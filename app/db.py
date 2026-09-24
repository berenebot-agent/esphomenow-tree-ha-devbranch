from __future__ import annotations

import json
import sqlite3
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable, Iterable

from .models import (
    ACTIVE_STATUSES,
    COMPILE_QUEUED,
    COMPILING,
    COMPILE_SUCCESS,
    PENDING_CONFIRM,
    QUEUED,
    STARTING,
    ANNOUNCING,
    TRANSFERRING,
    VERIFYING,
    WAITING_REJOIN,
    SUCCESS,
    FAILED,
    ABORTED,
    REJOIN_TIMEOUT,
    VERSION_MISMATCH,
    TERMINAL_STATUSES,
    node_key_from_topology,
    normalize_mac,
    now_ts,
)

MAX_JOB_EVENT_OUTPUT_CHARS = 256 * 1024
MAX_JOB_EVENTS = 200


@dataclass
class SchemaMigration:
    version: int
    description: str
    migrate: Callable[[sqlite3.Connection], None]


MIGRATIONS: list[SchemaMigration] = []


def register_migration(version: int, description: str):
    def decorator(func: Callable[[sqlite3.Connection], None]):
        MIGRATIONS.append(SchemaMigration(version=version, description=description, migrate=func))
        MIGRATIONS.sort(key=lambda m: m.version)
        return func
    return decorator


class Database:
    def __init__(self, path: Path) -> None:
        self.path = path

    def connect(self) -> sqlite3.Connection:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(self.path, timeout=30, isolation_level=None)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA foreign_keys=ON")
        conn.execute("PRAGMA busy_timeout=30000")
        return conn

    @staticmethod
    def _get_schema_version(conn: sqlite3.Connection) -> int:
        row = conn.execute("SELECT version FROM schema_versions ORDER BY version DESC LIMIT 1").fetchone()
        return row["version"] if row else 0

    @staticmethod
    def _set_schema_version(conn: sqlite3.Connection, version: int) -> None:
        conn.execute("INSERT INTO schema_versions (version, applied_at) VALUES (?, ?)", (version, now_ts()))

    def _run_migrations(self, conn: sqlite3.Connection) -> None:
        current_version = self._get_schema_version(conn)
        pending = [m for m in MIGRATIONS if m.version > current_version]
        for migration in pending:
            migration.migrate(conn)
            self._set_schema_version(conn, migration.version)

    def init(self) -> None:
        with self.connect() as conn:
            conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS schema_versions (
                    version INTEGER PRIMARY KEY,
                    applied_at INTEGER NOT NULL
                );

                CREATE TABLE IF NOT EXISTS devices (
                    mac TEXT PRIMARY KEY,
                    node_key TEXT,
                    label TEXT,
                    esphome_name TEXT,
                    bridge_host TEXT,
                    last_seen_online INTEGER,
                    current_firmware_version TEXT,
                    current_project_name TEXT,
                    firmware_build_date TEXT,
                    firmware_md5 TEXT,
                    chip_name TEXT,
                    rssi INTEGER,
                    hops INTEGER,
                    entity_count INTEGER,
                    created_at INTEGER,
                    updated_at INTEGER
                );

                CREATE TABLE IF NOT EXISTS ota_jobs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    mac TEXT NOT NULL,
                    status TEXT NOT NULL,
                    firmware_path TEXT,
                    retained_until INTEGER,
                    firmware_name TEXT,
                    firmware_size INTEGER,
                    firmware_md5 TEXT,
                    parsed_project_name TEXT,
                    parsed_version TEXT,
                    parsed_esphome_name TEXT,
                    parsed_build_date TEXT,
                    parsed_chip_name TEXT,
                    old_firmware_version TEXT,
                    old_project_name TEXT,
                    preflight_warnings TEXT,
                    percent INTEGER DEFAULT 0,
                    bridge_state TEXT,
                    total_chunks INTEGER,
                    chunks_sent INTEGER DEFAULT 0,
                    error_msg TEXT,
                    started_at INTEGER,
                    completed_at INTEGER,
                    created_at INTEGER NOT NULL,
                    updated_at INTEGER,
                    FOREIGN KEY (mac) REFERENCES devices(mac)
                );

                CREATE INDEX IF NOT EXISTS idx_ota_jobs_mac_created ON ota_jobs(mac, created_at DESC);
                CREATE INDEX IF NOT EXISTS idx_ota_jobs_status ON ota_jobs(status);

                CREATE TABLE IF NOT EXISTS bridges (
                    uuid TEXT PRIMARY KEY,
                    name TEXT,
                    host TEXT NOT NULL,
                    port INTEGER DEFAULT 80,
                    discovered_via TEXT DEFAULT 'manual',
                    api_key TEXT DEFAULT '',
                    network_id TEXT DEFAULT '',
                    hostname TEXT DEFAULT '',
                    mac TEXT DEFAULT '',
                    flash_wizard_pending INTEGER DEFAULT 0,
                    enabled INTEGER DEFAULT 1,
                    last_connected_at INTEGER,
                    created_at INTEGER
                );
                """
            )
            self._run_migrations(conn)

    @staticmethod
    def row(row: sqlite3.Row | None) -> dict[str, Any] | None:
        return dict(row) if row is not None else None

    @staticmethod
    def rows(rows: Iterable[sqlite3.Row]) -> list[dict[str, Any]]:
        return [dict(row) for row in rows]

    @staticmethod
    def _without_log_events(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
        for row in rows:
            row.pop("log_events", None)
        return rows

    @staticmethod
    def _cap_job_log_events(events: list[dict[str, Any]]) -> list[dict[str, Any]]:
        capped = []
        for event in events:
            if event.get("type") != "compile_output":
                capped.append(event)
                continue
            output = str(event.get("output") or "")
            if len(output) <= MAX_JOB_EVENT_OUTPUT_CHARS:
                capped.append(event)
                continue
            trimmed = dict(event)
            trimmed["output"] = (
                f"[output truncated to last {MAX_JOB_EVENT_OUTPUT_CHARS // 1024} KiB]\n"
                + output[-MAX_JOB_EVENT_OUTPUT_CHARS:]
            )
            capped.append(trimmed)
        return capped

    @staticmethod
    def _bridge_row(row: sqlite3.Row | None) -> dict[str, Any] | None:
        if row is None:
            return None
        data = dict(row)
        data["enabled"] = bool(data.get("enabled", True))
        data["is_active"] = data["enabled"]
        if "port" in data and data["port"] is not None:
            data["port"] = int(data["port"])
        return data

    def list_bridges(self) -> list[dict[str, Any]]:
        with self.connect() as conn:
            rows = conn.execute("SELECT * FROM bridges WHERE flash_wizard_pending = 0 OR flash_wizard_pending IS NULL ORDER BY enabled DESC, created_at DESC").fetchall()
            return [self._bridge_row(row) or {} for row in rows]

    def list_enabled_bridges(self) -> list[dict[str, Any]]:
        with self.connect() as conn:
            rows = conn.execute("SELECT * FROM bridges WHERE enabled = 1 ORDER BY created_at DESC").fetchall()
            return [self._bridge_row(row) or {} for row in rows]

    def get_active_bridge(self) -> dict[str, Any] | None:
        with self.connect() as conn:
            return self._bridge_row(
                conn.execute("SELECT * FROM bridges WHERE enabled = 1 ORDER BY created_at DESC LIMIT 1").fetchone()
            )

    def get_bridge(self, bridge_uuid: str) -> dict[str, Any] | None:
        with self.connect() as conn:
            return self._bridge_row(conn.execute("SELECT * FROM bridges WHERE uuid = ?", (bridge_uuid,)).fetchone())

    def add_bridge(self, host: str, port: int, name: str | None = None, discovered_via: str = "manual", api_key: str = "", network_id: str = "", hostname: str = "", mac: str = "", flash_wizard_pending: int = 0, enabled: int = 1, transport: str = "wifi", serial_port: str = "", baud: int = 460800) -> dict[str, Any]:
        ts = now_ts()
        bridge_uuid = str(uuid.uuid4())
        with self.connect() as conn:
            conn.execute(
                """
                INSERT INTO bridges (uuid, name, host, port, discovered_via, api_key, network_id, hostname, mac, flash_wizard_pending, enabled, last_connected_at, created_at, transport, serial_port, baud)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (bridge_uuid, name, host, port, discovered_via, api_key, network_id, hostname, mac, flash_wizard_pending, enabled, ts if api_key else None, ts, transport, serial_port, baud),
            )
        return self.get_bridge(bridge_uuid) or {}

    def get_provisioning_bridge(self) -> dict[str, Any] | None:
        with self.connect() as conn:
            row = conn.execute(
                "SELECT * FROM bridges WHERE flash_wizard_pending = 1 LIMIT 1"
            ).fetchone()
            return self._bridge_row(row)

    def cleanup_stale_provisioning(self) -> int:
        with self.connect() as conn:
            cursor = conn.execute(
                "DELETE FROM bridges WHERE flash_wizard_pending = 1 AND mac = 'FF:FF:FF:FF:FF:FF'"
            )
            return cursor.rowcount

    def update_bridge(self, bridge_uuid: str, **values: Any) -> dict[str, Any] | None:
        if not values:
            return self.get_bridge(bridge_uuid)
        values["last_connected_at"] = now_ts()
        keys = list(values.keys())
        assignments = ", ".join(f"{key} = ?" for key in keys)
        with self.connect() as conn:
            conn.execute(f"UPDATE bridges SET {assignments} WHERE uuid = ?", tuple(values[key] for key in keys) + (bridge_uuid,))
        return self.get_bridge(bridge_uuid)

    def delete_bridge(self, bridge_uuid: str) -> None:
        with self.connect() as conn:
            conn.execute("DELETE FROM bridges WHERE uuid = ?", (bridge_uuid,))

    def set_active_bridge(self, bridge_uuid: str) -> dict[str, Any] | None:
        with self.connect() as conn:
            row = conn.execute("SELECT 1 FROM bridges WHERE uuid = ?", (bridge_uuid,)).fetchone()
            if not row:
                return None
            conn.execute("UPDATE bridges SET enabled = 1, last_connected_at = ? WHERE uuid = ?", (now_ts(), bridge_uuid))
        return self.get_bridge(bridge_uuid)

    def clear_active_bridge(self, bridge_uuid: str | None = None) -> None:
        with self.connect() as conn:
            if bridge_uuid is None:
                conn.execute("UPDATE bridges SET enabled = 0")
            else:
                conn.execute("UPDATE bridges SET enabled = 0 WHERE uuid = ?", (bridge_uuid,))

    def save_discovered_bridges(self, bridges: list[dict[str, Any]]) -> None:
        ts = now_ts()
        with self.connect() as conn:
            conn.execute("BEGIN")
            for b in bridges:
                conn.execute(
                    """
                    INSERT INTO discovered_bridges (host, port, name, version, network_id, hostname, discovered_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(host, port) DO UPDATE SET
                        name = excluded.name,
                        version = excluded.version,
                        network_id = excluded.network_id,
                        hostname = excluded.hostname,
                        discovered_at = excluded.discovered_at
                    """,
                    (
                        b["host"],
                        b["port"],
                        b.get("name"),
                        b.get("version"),
                        b.get("network_id"),
                        b.get("hostname"),
                        ts,
                    ),
                )
            conn.execute("COMMIT")

    def get_discovered_bridges(self) -> list[dict[str, Any]]:
        with self.connect() as conn:
            rows = conn.execute(
                "SELECT * FROM discovered_bridges ORDER BY discovered_at DESC"
            ).fetchall()
            return [dict(row) for row in rows]

    def delete_discovered_bridge(self, host: str, port: int) -> None:
        with self.connect() as conn:
            conn.execute("DELETE FROM discovered_bridges WHERE host = ? AND port = ?", (host, port))

    def clear_discovered_bridges(self) -> None:
        with self.connect() as conn:
            conn.execute("DELETE FROM discovered_bridges")

    def upsert_devices_from_topology(self, topology: list[dict[str, Any]], bridge_host: str) -> None:
        ts = now_ts()
        conn = self.connect()
        try:
            conn.execute("BEGIN")
            for node in topology:
                mac = normalize_mac(str(node.get("mac") or ""))
                if not mac:
                    continue
                existing = conn.execute("SELECT created_at FROM devices WHERE mac = ?", (mac,)).fetchone()
                created_at = existing["created_at"] if existing else ts
                conn.execute(
                    """
                    INSERT INTO devices (
                        mac, node_key, label, esphome_name, bridge_host, last_seen_online,
                        current_firmware_version, current_project_name, firmware_build_date,
                        firmware_md5, chip_name, rssi, hops, entity_count, created_at, updated_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(mac) DO UPDATE SET
                        node_key = excluded.node_key,
                        label = excluded.label,
                        esphome_name = excluded.esphome_name,
                        bridge_host = excluded.bridge_host,
                        last_seen_online = excluded.last_seen_online,
                        current_firmware_version = excluded.current_firmware_version,
                        current_project_name = excluded.current_project_name,
                        firmware_build_date = excluded.firmware_build_date,
                        firmware_md5 = excluded.firmware_md5,
                        chip_name = excluded.chip_name,
                        rssi = excluded.rssi,
                        hops = excluded.hops,
                        entity_count = excluded.entity_count,
                        updated_at = excluded.updated_at
                    """,
                    (
                        mac,
                        node_key_from_topology(node),
                        node.get("label"),
                        node.get("esphome_name"),
                        bridge_host,
                        ts if bool(node.get("online")) else None,
                        node.get("firmware_version") or node.get("project_version"),
                        node.get("project_name"),
                        node.get("firmware_build_date"),
                        node.get("firmware_md5"),
                        node.get("chip_name"),
                        node.get("rssi"),
                        node.get("hops"),
                        node.get("entity_count"),
                        created_at,
                        ts,
                    ),
                )
            conn.execute("COMMIT")
        except Exception:
            conn.execute("ROLLBACK")
            raise
        finally:
            conn.close()

    def list_devices(self) -> list[dict[str, Any]]:
        with self.connect() as conn:
            return self.rows(conn.execute("SELECT * FROM devices ORDER BY label COLLATE NOCASE, mac").fetchall())

    def get_device(self, mac: str) -> dict[str, Any] | None:
        with self.connect() as conn:
            return self.row(conn.execute("SELECT * FROM devices WHERE mac = ?", (normalize_mac(mac),)).fetchone())

    def delete_device(self, mac: str) -> bool:
        """Remove a device row. Used to clear the synthetic placeholder a remote
        flash registers before the real node appears in the bridge topology.

        ota_jobs.mac has a FOREIGN KEY onto devices(mac) and the connection runs
        with foreign_keys=ON, so the child job rows must go first: a flash wizard
        submit always creates a compile job, so deleting the device alone raises
        IntegrityError and leaves the placeholder behind.
        """
        nm = normalize_mac(mac)
        if not nm:
            return False
        with self.connect() as conn:
            conn.execute("DELETE FROM ota_jobs WHERE mac = ?", (nm,))
            cursor = conn.execute("DELETE FROM devices WHERE mac = ?", (nm,))
            conn.execute("DELETE FROM hidden_devices WHERE mac = ?", (nm,))
            return cursor.rowcount > 0

    def rename_device_mac(self, old_mac: str, new_mac: str) -> None:
        old_nm = normalize_mac(old_mac)
        new_nm = normalize_mac(new_mac)
        if not old_nm or not new_nm or old_nm == new_nm:
            return
        with self.connect() as conn:
            existing_old = conn.execute("SELECT * FROM devices WHERE mac = ?", (old_nm,)).fetchone()
            if not existing_old:
                return
            existing_new = conn.execute("SELECT 1 FROM devices WHERE mac = ?", (new_nm,)).fetchone()
            conn.execute("BEGIN")
            if existing_new:
                conn.execute("UPDATE ota_jobs SET mac = ? WHERE mac = ?", (new_nm, old_nm))
                conn.execute("DELETE FROM devices WHERE mac = ?", (old_nm,))
                conn.execute("DELETE FROM hidden_devices WHERE mac = ?", (old_nm,))
            else:
                conn.execute("UPDATE devices SET mac = ?, updated_at = ? WHERE mac = ?", (new_nm, now_ts(), old_nm))
                conn.execute("UPDATE ota_jobs SET mac = ? WHERE mac = ?", (new_nm, old_nm))
                row = conn.execute("SELECT hidden_at FROM hidden_devices WHERE mac = ?", (old_nm,)).fetchone()
                if row:
                    conn.execute(
                        "INSERT OR REPLACE INTO hidden_devices (mac, hidden_at) VALUES (?, ?)",
                        (new_nm, row["hidden_at"]),
                    )
                    conn.execute("DELETE FROM hidden_devices WHERE mac = ?", (old_nm,))
            conn.execute("COMMIT")

    def active_job(self) -> dict[str, Any] | None:
        from .models import FLASH_STATUSES
        placeholders = ",".join("?" for _ in FLASH_STATUSES)
        with self.connect() as conn:
            return self.row(
                conn.execute(
                    f"SELECT * FROM ota_jobs WHERE status IN ({placeholders}) ORDER BY created_at ASC LIMIT 1",
                    tuple(FLASH_STATUSES),
                ).fetchone()
            )

    def _ensure_device_stub(self, conn: sqlite3.Connection, mac: str) -> None:
        mac = normalize_mac(mac)
        if conn.execute("SELECT 1 FROM devices WHERE mac = ?", (mac,)).fetchone():
            return
        conn.execute(
            "INSERT OR IGNORE INTO devices (mac, created_at, updated_at) VALUES (?, ?, ?)",
            (mac, now_ts(), now_ts()),
        )

    def create_job(self, values: dict[str, Any]) -> dict[str, Any]:
        ts = now_ts()
        keys = [
            "mac",
            "status",
            "firmware_path",
            "firmware_name",
            "firmware_size",
            "firmware_md5",
            "parsed_project_name",
            "parsed_version",
            "parsed_esphome_name",
            "parsed_build_date",
            "parsed_chip_name",
            "old_firmware_version",
            "old_project_name",
            "preflight_warnings",
            "percent",
            "bridge_state",
            "total_chunks",
            "chunks_sent",
            "error_msg",
            "retained_until",
            "queue_order",
            "esphome_name",
            "auto_flash",
        ]
        data = {key: values.get(key) for key in keys}
        data["mac"] = normalize_mac(str(data["mac"] or ""))
        data["status"] = data["status"] or "pending_confirm"
        data["percent"] = data["percent"] or 0
        with self.connect() as conn:
            self._ensure_device_stub(conn, data["mac"])
            if data["status"] in (QUEUED, COMPILE_QUEUED):
                conn.execute("BEGIN IMMEDIATE")
                try:
                    status_filter = data["status"]
                    row = conn.execute("SELECT MAX(queue_order) as max_order FROM ota_jobs WHERE status = ?", (status_filter,)).fetchone()
                    data["queue_order"] = (row["max_order"] if row and row["max_order"] is not None else -1) + 1
                    cursor = conn.execute(
                        f"""
                        INSERT INTO ota_jobs ({",".join(keys)}, created_at, updated_at)
                        VALUES ({",".join("?" for _ in keys)}, ?, ?)
                        """,
                        tuple(data[key] for key in keys) + (ts, ts),
                    )
                    job_id = int(cursor.lastrowid)
                    conn.execute("COMMIT")
                    return self.get_job(job_id) or {}
                except Exception:
                    conn.execute("ROLLBACK")
                    raise
            cursor = conn.execute(
                f"""
                INSERT INTO ota_jobs ({",".join(keys)}, created_at, updated_at)
                VALUES ({",".join("?" for _ in keys)}, ?, ?)
                """,
                tuple(data[key] for key in keys) + (ts, ts),
            )
            job_id = int(cursor.lastrowid)
        return self.get_job(job_id) or {}

    def get_job(self, job_id: int) -> dict[str, Any] | None:
        with self.connect() as conn:
            return self.row(conn.execute("SELECT * FROM ota_jobs WHERE id = ?", (job_id,)).fetchone())

    def update_job(self, job_id: int, **values: Any) -> dict[str, Any] | None:
        if not values:
            return self.get_job(job_id)
        values["updated_at"] = now_ts()
        keys = list(values.keys())
        assignments = ", ".join(f"{key} = ?" for key in keys)
        with self.connect() as conn:
            conn.execute(
                f"UPDATE ota_jobs SET {assignments} WHERE id = ?",
                tuple(values[key] for key in keys) + (job_id,),
            )
        return self.get_job(job_id)

    def mark_terminal(
        self,
        job_id: int,
        status: str,
        error_msg: str | None = None,
        percent: int | None = None,
        retained_until: int | None = None,
    ) -> dict[str, Any] | None:
        values: dict[str, Any] = {"status": status, "completed_at": now_ts()}
        if error_msg is not None:
            values["error_msg"] = error_msg
        if percent is not None:
            values["percent"] = percent
        if retained_until is not None:
            values["retained_until"] = retained_until
        return self.update_job(job_id, **values)

    def append_job_event(self, job_id: int, event_type: str, **data: Any) -> dict[str, Any] | None:
        job = self.get_job(job_id)
        if not job:
            return None
        try:
            events = json.loads(job.get("log_events") or "[]")
        except (json.JSONDecodeError, TypeError):
            events = []
        event = {"type": event_type, "ts": now_ts(), **data}
        if event_type == "compile_output":
            output = str(event.get("output") or "")
            if len(output) > MAX_JOB_EVENT_OUTPUT_CHARS:
                event["output"] = (
                    f"[output truncated to last {MAX_JOB_EVENT_OUTPUT_CHARS // 1024} KiB]\n"
                    + output[-MAX_JOB_EVENT_OUTPUT_CHARS:]
                )
        events.append(event)
        if len(events) > MAX_JOB_EVENTS:
            events = events[-MAX_JOB_EVENTS:]
        return self.update_job(job_id, log_events=json.dumps(events))

    def get_job_log(self, job_id: int) -> dict[str, Any] | None:
        job = self.get_job(job_id)
        if not job:
            return None
        try:
            events = json.loads(job.get("log_events") or "[]")
        except (json.JSONDecodeError, TypeError):
            events = []
        return {
            "job_id": job_id,
            "status": job["status"],
            "mac": job["mac"],
            "is_terminal": job["status"] in TERMINAL_STATUSES,
            "log_events": self._cap_job_log_events(events),
        }

    def list_history(self, mac: str | None = None, limit: int = 100) -> list[dict[str, Any]]:
        excluded = (PENDING_CONFIRM,)
        excluded_placeholders = ",".join("?" for _ in excluded)
        with self.connect() as conn:
            if mac:
                rows = self._without_log_events(self.rows(
                    conn.execute(
                        f"SELECT * FROM ota_jobs WHERE mac = ? AND status NOT IN ({excluded_placeholders}) AND NOT (status = ? AND log_events IS NOT NULL AND (log_events LIKE ? OR log_events LIKE ?)) ORDER BY created_at DESC LIMIT ?",
                        (normalize_mac(mac),) + excluded + (FAILED, "%compile_failed%", "%compile_cancelled%", limit),
                    ).fetchall()
                ))
            else:
                rows = self._without_log_events(self.rows(
                    conn.execute(
                        f"SELECT * FROM ota_jobs WHERE status NOT IN ({excluded_placeholders}) AND NOT (status = ? AND log_events IS NOT NULL AND (log_events LIKE ? OR log_events LIKE ?)) ORDER BY created_at DESC LIMIT ?",
                        excluded + (FAILED, "%compile_failed%", "%compile_cancelled%", limit),
                    ).fetchall()
                ))
        for r in rows:
            r["job_type"] = "flash"
        return rows

    def compile_history(self, mac: str) -> list[dict[str, Any]]:
        with self.connect() as conn:
            return self._without_log_events(self.rows(
                conn.execute(
                    """
                    SELECT * FROM ota_jobs
                    WHERE mac = ?
                        AND esphome_name IS NOT NULL
                        AND (
                            status = ?
                            OR (
                                status = ?
                                AND (
                                    log_events LIKE ?
                                    OR log_events LIKE ?
                                )
                            )
                        )
                    ORDER BY created_at DESC, id DESC LIMIT 50
                    """,
                    (
                        normalize_mac(mac),
                        COMPILE_SUCCESS,
                        FAILED,
                        "%compile_failed%",
                        "%compile_cancelled%",
                    ),
                ).fetchall()
            ))

    def compile_history_all(self, limit: int = 100) -> list[dict[str, Any]]:
        with self.connect() as conn:
            rows = self._without_log_events(self.rows(
                conn.execute(
                    """
                    SELECT * FROM ota_jobs
                    WHERE status = ?
                       OR (status = ? AND log_events IS NOT NULL AND (log_events LIKE ? OR log_events LIKE ?))
                    ORDER BY created_at DESC, id DESC LIMIT ?
                    """,
                    (COMPILE_SUCCESS, FAILED, "%compile_failed%", "%compile_cancelled%", limit),
                ).fetchall()
            ))
        for r in rows:
            r["job_type"] = "compile"
        return rows

    def expired_retained(self) -> list[dict[str, Any]]:
        ts = now_ts()
        with self.connect() as conn:
            return self.rows(
                conn.execute(
                    """
                    SELECT * FROM ota_jobs
                    WHERE firmware_path IS NOT NULL
                        AND retained_until IS NOT NULL
                        AND retained_until <= ?
                    """,
                    (ts,),
                ).fetchall()
            )

    def clear_job_firmware(self, job_id: int) -> None:
        self.update_job(job_id, firmware_path=None, retained_until=None)

    def active_job_for_device(self, mac: str) -> dict[str, Any] | None:
        placeholders = ",".join("?" for _ in ACTIVE_STATUSES)
        with self.connect() as conn:
            return self.row(
                conn.execute(
                    f"SELECT * FROM ota_jobs WHERE mac = ? AND status IN ({placeholders}) ORDER BY created_at ASC LIMIT 1",
                    (normalize_mac(mac),) + tuple(ACTIVE_STATUSES),
                ).fetchone()
            )

    def get_job_by_mac_and_status(self, mac: str, status: str) -> dict[str, Any] | None:
        with self.connect() as conn:
            return self.row(
                conn.execute(
                    "SELECT * FROM ota_jobs WHERE mac = ? AND status = ? ORDER BY created_at DESC LIMIT 1",
                    (normalize_mac(mac), status),
                ).fetchone()
            )

    def get_latest_compile_job_for_device(self, mac: str) -> dict[str, Any] | None:
        compile_statuses = (COMPILE_QUEUED, COMPILING, COMPILE_SUCCESS)
        with self.connect() as conn:
            return self.row(
                conn.execute(
                    """
                    SELECT * FROM ota_jobs
                    WHERE mac = ?
                        AND (
                            status IN (?, ?, ?)
                            OR (
                                status = ?
                                AND (
                                    log_events LIKE ?
                                    OR log_events LIKE ?
                                )
                            )
                        )
                    ORDER BY created_at DESC, id DESC LIMIT 1
                    """,
                    (
                        normalize_mac(mac),
                        *compile_statuses,
                        FAILED,
                        "%compile_failed%",
                        "%compile_cancelled%",
                    ),
                ).fetchone()
            )

    def get_latest_flash_job_for_device(self, mac: str) -> dict[str, Any] | None:
        flash_statuses = (QUEUED, STARTING, ANNOUNCING, TRANSFERRING, VERIFYING, WAITING_REJOIN, SUCCESS, ABORTED, REJOIN_TIMEOUT, VERSION_MISMATCH)
        placeholders = ",".join("?" for _ in flash_statuses)
        with self.connect() as conn:
            return self.row(
                conn.execute(
                    f"""
                    SELECT * FROM ota_jobs
                    WHERE mac = ?
                        AND (
                            status IN ({placeholders})
                            OR (
                                status = ?
                                AND (
                                    log_events IS NULL
                                    OR (
                                        log_events NOT LIKE ?
                                        AND log_events NOT LIKE ?
                                    )
                                )
                            )
                        )
                    ORDER BY created_at DESC, id DESC LIMIT 1
                    """,
                    (
                        normalize_mac(mac),
                        *flash_statuses,
                        FAILED,
                        "%compile_failed%",
                        "%compile_cancelled%",
                    ),
                ).fetchone()
            )

    def list_jobs_by_status(self, status: str) -> list[dict[str, Any]]:
        with self.connect() as conn:
            return self.rows(
                conn.execute(
                    "SELECT * FROM ota_jobs WHERE status = ?",
                    (status,),
                ).fetchall()
            )

    def queued_jobs(self) -> list[dict[str, Any]]:
        with self.connect() as conn:
            return self.rows(
                conn.execute(
                    "SELECT * FROM ota_jobs WHERE status = ? ORDER BY queue_order ASC",
                    (QUEUED,),
                ).fetchall()
            )

    def next_queued_job(self) -> dict[str, Any] | None:
        with self.connect() as conn:
            return self.row(
                conn.execute(
                    "SELECT * FROM ota_jobs WHERE status = ? ORDER BY queue_order ASC LIMIT 1",
                    (QUEUED,),
                ).fetchone()
            )

    def has_queued_jobs(self) -> bool:
        with self.connect() as conn:
            row = conn.execute(
                "SELECT 1 FROM ota_jobs WHERE status = ? LIMIT 1",
                (QUEUED,),
            ).fetchone()
            return row is not None

    def count_queued_before(self, job_id: int) -> int:
        with self.connect() as conn:
            job = self.row(conn.execute("SELECT queue_order FROM ota_jobs WHERE id = ?", (job_id,)).fetchone())
            if not job or job["queue_order"] is None:
                return 0
            row = conn.execute(
                "SELECT COUNT(*) as cnt FROM ota_jobs WHERE status = ? AND queue_order < ?",
                (QUEUED, job["queue_order"]),
            ).fetchone()
            return row["cnt"] if row else 0

    def reorder_queue(self, job_id: int, new_order: int) -> None:
        with self.connect() as conn:
            conn.execute("BEGIN")
            jobs = self.rows(
                conn.execute(
                    "SELECT id, queue_order FROM ota_jobs WHERE status = ? ORDER BY queue_order ASC",
                    (QUEUED,),
                ).fetchall()
            )
            current_ids = [j["id"] for j in jobs]
            if job_id not in current_ids:
                conn.execute("ROLLBACK")
                return
            current_ids.remove(job_id)
            current_ids.insert(new_order, job_id)
            for idx, jid in enumerate(current_ids):
                conn.execute(
                    "UPDATE ota_jobs SET queue_order = ? WHERE id = ?",
                    (idx, jid),
                )
            conn.execute("COMMIT")

    def abort_queued_job(self, job_id: int) -> None:
        with self.connect() as conn:
            conn.execute("DELETE FROM ota_jobs WHERE id = ?", (job_id,))
            remaining = self.rows(
                conn.execute(
                    "SELECT id FROM ota_jobs WHERE status = ? ORDER BY queue_order ASC",
                    (QUEUED,),
                ).fetchall()
            )
            for idx, row in enumerate(remaining):
                conn.execute(
                    "UPDATE ota_jobs SET queue_order = ? WHERE id = ?",
                    (idx, row["id"]),
                )

    def active_compile_job(self) -> dict[str, Any] | None:
        with self.connect() as conn:
            return self.row(
                conn.execute(
                    "SELECT * FROM ota_jobs WHERE status = ? ORDER BY created_at ASC LIMIT 1",
                    (COMPILING,),
                ).fetchone()
            )

    def compile_queued_jobs(self) -> list[dict[str, Any]]:
        with self.connect() as conn:
            return self.rows(
                conn.execute(
                    "SELECT * FROM ota_jobs WHERE status = ? ORDER BY queue_order ASC",
                    (COMPILE_QUEUED,),
                ).fetchall()
            )

    def next_compile_queued_job(self) -> dict[str, Any] | None:
        with self.connect() as conn:
            return self.row(
                conn.execute(
                    "SELECT * FROM ota_jobs WHERE status = ? ORDER BY queue_order ASC LIMIT 1",
                    (COMPILE_QUEUED,),
                ).fetchone()
            )

    def count_compile_queued_before(self, job_id: int) -> int:
        with self.connect() as conn:
            job = self.row(conn.execute("SELECT queue_order FROM ota_jobs WHERE id = ?", (job_id,)).fetchone())
            if not job or job["queue_order"] is None:
                return 0
            row = conn.execute(
                "SELECT COUNT(*) as cnt FROM ota_jobs WHERE status = ? AND queue_order < ?",
                (COMPILE_QUEUED, job["queue_order"]),
            ).fetchone()
            return row["cnt"] if row else 0

    def transition_compile_queued_to_compiling(self, job_id: int, **extra: Any) -> None:
        values = {"status": COMPILING, "updated_at": now_ts(), **extra}
        keys = list(values.keys())
        assignments = ", ".join(f"{key} = ?" for key in keys)
        with self.connect() as conn:
            conn.execute(
                f"UPDATE ota_jobs SET {assignments} WHERE id = ? AND status = ?",
                tuple(values[key] for key in keys) + (job_id, COMPILE_QUEUED),
            )

    def abort_compile_queued_job(self, job_id: int) -> None:
        with self.connect() as conn:
            conn.execute("DELETE FROM ota_jobs WHERE id = ?", (job_id,))
            remaining = self.rows(
                conn.execute(
                    "SELECT id FROM ota_jobs WHERE status = ? ORDER BY queue_order ASC",
                    (COMPILE_QUEUED,),
                ).fetchall()
            )
            for idx, row in enumerate(remaining):
                conn.execute(
                    "UPDATE ota_jobs SET queue_order = ? WHERE id = ?",
                    (idx, row["id"]),
                )

    def hide_device(self, mac: str) -> None:
        with self.connect() as conn:
            conn.execute(
                "INSERT OR REPLACE INTO hidden_devices (mac, hidden_at) VALUES (?, ?)",
                (normalize_mac(mac), now_ts()),
            )

    def unhide_device(self, mac: str) -> None:
        with self.connect() as conn:
            conn.execute("DELETE FROM hidden_devices WHERE mac = ?", (normalize_mac(mac),))

    def is_device_hidden(self, mac: str) -> bool:
        with self.connect() as conn:
            row = conn.execute("SELECT 1 FROM hidden_devices WHERE mac = ?", (normalize_mac(mac),)).fetchone()
            return row is not None

    def get_hidden_macs(self) -> set[str]:
        with self.connect() as conn:
            rows = conn.execute("SELECT mac FROM hidden_devices").fetchall()
            return {normalize_mac(row["mac"]) for row in rows}


def _add_column_if_not_exists(conn: sqlite3.Connection, table: str, column: str, col_type: str) -> None:
    try:
        conn.execute(f"ALTER TABLE {table} ADD COLUMN {column} {col_type}")
    except sqlite3.OperationalError:
        pass


def _bridge_table_columns(conn: sqlite3.Connection) -> set[str]:
    return {str(row["name"]) for row in conn.execute("PRAGMA table_info(bridges)").fetchall()}


def _create_bridge_table(conn: sqlite3.Connection, table_name: str = "bridges") -> None:
    conn.execute(f"""
        CREATE TABLE IF NOT EXISTS {table_name} (
            uuid TEXT PRIMARY KEY,
            name TEXT,
            host TEXT NOT NULL,
            port INTEGER DEFAULT 80,
            discovered_via TEXT DEFAULT 'manual',
            api_key TEXT DEFAULT '',
            network_id TEXT DEFAULT '',
            hostname TEXT DEFAULT '',
            mac TEXT DEFAULT '',
            flash_wizard_pending INTEGER DEFAULT 0,
            enabled INTEGER DEFAULT 1,
            last_connected_at INTEGER,
            created_at INTEGER
        )
    """)


@register_migration(version=1, description="Add firmware_md5 to devices table")
def migration_001_add_firmware_md5_to_devices(conn: sqlite3.Connection) -> None:
    _add_column_if_not_exists(conn, "devices", "firmware_md5", "TEXT")


@register_migration(version=2, description="Add queue_order to ota_jobs")
def migration_002_add_queue_order(conn: sqlite3.Connection) -> None:
    _add_column_if_not_exists(conn, "ota_jobs", "queue_order", "INTEGER")


@register_migration(version=3, description="Add esphome_name to ota_jobs")
def migration_003_add_esphome_name(conn: sqlite3.Connection) -> None:
    _add_column_if_not_exists(conn, "ota_jobs", "esphome_name", "TEXT")


@register_migration(version=4, description="Add current_increment, total_increments, retransmit_round, buffer_size_kb to ota_jobs")
def migration_004_add_ota_job_columns(conn: sqlite3.Connection) -> None:
    for col, col_type in [
        ("current_increment", "INTEGER"),
        ("total_increments", "INTEGER"),
        ("retransmit_round", "INTEGER DEFAULT 0"),
        ("buffer_size_kb", "INTEGER"),
    ]:
        _add_column_if_not_exists(conn, "ota_jobs", col, col_type)


@register_migration(version=5, description="Add log_events to ota_jobs")
def migration_005_add_log_events(conn: sqlite3.Connection) -> None:
    _add_column_if_not_exists(conn, "ota_jobs", "log_events", "TEXT")


@register_migration(version=6, description="Add queue_order and esphome_name indexes")
def migration_006_add_ota_job_indexes(conn: sqlite3.Connection) -> None:
    conn.execute("CREATE INDEX IF NOT EXISTS idx_ota_jobs_queue_order ON ota_jobs(queue_order)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_ota_jobs_esphome_name ON ota_jobs(esphome_name)")


@register_migration(version=8, description="Add api_key to bridges table")
def migration_008_add_api_key_to_bridges(conn: sqlite3.Connection) -> None:
    _add_column_if_not_exists(conn, "bridges", "api_key", "TEXT")


@register_migration(version=9, description="Add network_id to bridges table")
def migration_009_add_network_id_to_bridges(conn: sqlite3.Connection) -> None:
    _add_column_if_not_exists(conn, "bridges", "network_id", "TEXT")


@register_migration(version=10, description="Add hidden_devices table")
def migration_010_add_hidden_devices_table(conn: sqlite3.Connection) -> None:
    conn.execute("""
        CREATE TABLE IF NOT EXISTS hidden_devices (
            mac TEXT PRIMARY KEY,
            hidden_at INTEGER NOT NULL
        )
    """)


@register_migration(version=11, description="Move bridge config to shared UUID bridge table")
def migration_011_uuid_bridge_table(conn: sqlite3.Connection) -> None:
    columns = _bridge_table_columns(conn)
    if columns == {
        "uuid",
        "name",
        "host",
        "port",
        "discovered_via",
        "api_key",
        "network_id",
        "enabled",
        "last_connected_at",
        "created_at",
    }:
        conn.execute("DROP TABLE IF EXISTS bridge_config")
        return

    existing: list[dict[str, Any]] = []
    if columns:
        selected_columns = [
            col
            for col in (
                "name",
                "host",
                "port",
                "discovered_via",
                "api_key",
                "network_id",
                "last_connected_at",
                "created_at",
            )
            if col in columns
        ]
        if "host" in selected_columns:
            rows = conn.execute(f"SELECT {', '.join(selected_columns)} FROM bridges WHERE host IS NOT NULL").fetchall()
            existing.extend(dict(row) for row in rows)

    conn.execute("DROP TABLE IF EXISTS bridges")
    _create_bridge_table(conn)
    conn.execute("DROP TABLE IF EXISTS bridge_config")

    ts = now_ts()
    for index, row in enumerate(existing):
        conn.execute(
            """
            INSERT INTO bridges (
                uuid, name, host, port, discovered_via, api_key, network_id,
                enabled, last_connected_at, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                str(uuid.uuid4()),
                row.get("name"),
                row.get("host"),
                int(row.get("port") or 80),
                row.get("discovered_via") or "manual",
                row.get("api_key") or "",
                row.get("network_id") or "",
                1,
                row.get("last_connected_at"),
                row.get("created_at") or ts,
            ),
        )


@register_migration(version=13, description="Add hostname column to bridges table")
def migration_013_add_hostname(conn: sqlite3.Connection) -> None:
    columns = _bridge_table_columns(conn)
    if "hostname" not in columns:
        _add_column_if_not_exists(conn, "bridges", "hostname", "TEXT DEFAULT ''")


@register_migration(version=14, description="Add discovered_bridges table for cached network scan results")
def migration_014_add_discovered_bridges_table(conn: sqlite3.Connection) -> None:
    conn.execute("""
        CREATE TABLE IF NOT EXISTS discovered_bridges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            host TEXT NOT NULL,
            port INTEGER NOT NULL,
            name TEXT,
            version TEXT,
            network_id TEXT,
            hostname TEXT,
            discovered_at INTEGER NOT NULL,
            UNIQUE(host, port)
        )
    """)


@register_migration(version=15, description="Add auto_flash column to ota_jobs")
def migration_015_add_auto_flash(conn: sqlite3.Connection) -> None:
    conn.execute("ALTER TABLE ota_jobs ADD COLUMN auto_flash INTEGER DEFAULT 0")


@register_migration(version=16, description="Add flash_wizard_pending to bridges table")
def migration_016_add_flash_wizard_pending(conn: sqlite3.Connection) -> None:
    _add_column_if_not_exists(conn, "bridges", "flash_wizard_pending", "INTEGER DEFAULT 0")


@register_migration(version=17, description="Add mac to bridges table")
def migration_017_add_mac_to_bridges(conn: sqlite3.Connection) -> None:
    _add_column_if_not_exists(conn, "bridges", "mac", "TEXT DEFAULT ''")


@register_migration(version=18, description="Add transport, serial_port, baud to bridges")
def migrate_v18(conn: sqlite3.Connection) -> None:
    conn.execute("ALTER TABLE bridges ADD COLUMN transport TEXT DEFAULT 'wifi'")
    conn.execute("ALTER TABLE bridges ADD COLUMN serial_port TEXT DEFAULT ''")
    conn.execute("ALTER TABLE bridges ADD COLUMN baud INTEGER DEFAULT 460800")
