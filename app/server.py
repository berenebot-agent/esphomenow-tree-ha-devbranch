from __future__ import annotations

import asyncio
import hashlib
import hmac
import ipaddress
import json
import logging
import mimetypes
import os
import re
import secrets
import shutil
import sqlite3
import sys
import time
import uuid
from pathlib import Path
from typing import Any, AsyncGenerator

from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile, WebSocket
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, PlainTextResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from google.protobuf.message import DecodeError

from .bridge_constants import API_VERSION, CLIENT_KIND, PLACEHOLDER_MAC, PROTOCOL, REMOTE_PLACEHOLDER_MAC
from .bridge_v2_client import BridgeV2Manager
from .network_discovery import NetworkDiscovery
from .compile_store import CompileStore
from .compiler import CHIP_NAME_TO_BOARD, ESPHomeCompiler
from .config import _int_option, _read_options, load_settings
from .db import Database
from .firmware_store import FirmwareStore
from .compile_worker import CompileWorker
from .models import (
    ANNOUNCING,
    ABORTED,
    COMPILING,
    COMPILE_QUEUED,
    COMPILE_SUCCESS,
    FAILED,
    PENDING_CONFIRM,
    QUEUED,
    REJOIN_TIMEOUT,
    SUCCESS,
    STARTING,
    TRANSFERRING,
    VERSION_MISMATCH,
    VERIFYING,
    WAITING_REJOIN,
    BridgeTarget,
    find_node_by_mac,
    normalize_mac,
    now_ts,
)
from .ota_worker import OTAWorker
from .pairing_store import PendingImportStore
from .preflight import preflight_comparison
from .protobuf.generated import esp_tree_runtime_pb2 as pb
from .restart_status import integration_restart_decision
from .yaml_scaffold import generate_scaffold
from .ha_config_flow import configure_flow_payload, start_flow_payload
from .flash_wizard import (
    UNBUILDABLE_CHIP_REASON,
    is_unbuildable_chip,
    validate_board,
    validate_flash_name,
    validate_remote_chip_buildable,
    validate_remote_network_credentials,
)
from .yaml_store import YAMLStore


logger = logging.getLogger(__name__)
bridge_api_logger = logging.getLogger("bridge_api")
bridge_api_logger.setLevel(logging.INFO)
_handler = logging.StreamHandler(sys.stdout)
_handler.setFormatter(logging.Formatter("INFO:     %(message)s\n"))
bridge_api_logger.addHandler(_handler)
bridge_api_logger.propagate = False


def _flash_work_pending(db: Database, current_job_id: int | None = None) -> bool:
    active = db.active_job()
    if active and (current_job_id is None or int(active["id"]) != int(current_job_id)):
        return True
    return bool(db.queued_jobs())


CLEANUP_PAGE_HTML = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ESP Tree - Cleanup Required</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #1a1a2e;
      color: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .container {
      background: #16213e;
      border-radius: 12px;
      padding: 40px;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      text-align: center;
    }
    h1 {
      color: #e94560;
      margin: 0 0 20px;
      font-size: 1.5rem;
    }
    p {
      color: #a0a0a0;
      line-height: 1.6;
      margin: 0 0 30px;
    }
    .info {
      background: #0f3460;
      border-radius: 8px;
      padding: 15px;
      margin: 0 0 30px;
      text-align: left;
    }
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px solid #1a4a7a;
    }
    .info-item:last-child {
      border-bottom: none;
    }
    .label {
      color: #a0a0a0;
    }
    .value {
      color: #fff;
      font-weight: 500;
    }
    .value.dirty {
      color: #e94560;
    }
    .buttons {
      display: flex;
      gap: 15px;
      flex-direction: column;
    }
    button {
      padding: 14px 24px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-cleanup {
      background: #e94560;
      color: white;
    }
    .btn-cleanup:hover {
      background: #d63850;
    }
    .btn-continue {
      background: #2a2a4a;
      color: #a0a0a0;
      border: 1px solid #3a3a5a;
    }
    .btn-continue:hover {
      background: #3a3a5a;
      color: #e0e0e0;
    }
    .spinner {
      display: none;
      border: 3px solid #2a2a4a;
      border-top: 3px solid #e94560;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      animation: spin 1s linear infinite;
      margin: 0 auto 15px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .loading .spinner { display: block; }
    .loading .btn-cleanup { opacity: 0.5; pointer-events: none; }
    .loading .btn-continue { display: none; }
    .result {
      margin-top: 20px;
      padding: 15px;
      border-radius: 8px;
      display: none;
    }
    .result.success {
      background: #1a4a3a;
      color: #4ade80;
      display: block;
    }
    .result.error {
      background: #4a1a2a;
      color: #f87171;
      display: block;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚠️ Previous Installation Detected</h1>
    <p>It looks like ESP Tree was previously installed and then removed. Would you like to clean up the old integration data before continuing?</p>

    <div class="info">
      <div class="info-item">
        <span class="label">Shared DB</span>
        <span class="value" id="db-status">Checking...</span>
      </div>
      <div class="info-item">
        <span class="label">Integration</span>
        <span class="value" id="integration-status">Checking...</span>
      </div>
    </div>

    <div id="loading-section">
      <div class="spinner"></div>
    </div>

    <div class="buttons">
      <button class="btn-cleanup" id="btn-cleanup" onclick="doCleanup()">Clean Up &amp; Restart Home Assistant</button>
      <button class="btn-continue" id="btn-continue" onclick="continueAnyway()">Continue Without Cleaning Up</button>
    </div>

    <div class="result" id="result"></div>
  </div>

  <script>
    const basePath = window.location.pathname.replace(/\\/$/, '');
    const apiPath = (path) => `${basePath}${path}`;

    async function checkStatus() {
      try {
        const res = await fetch(apiPath('/api/cleanup/status'));
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        document.getElementById('db-status').textContent = data.shared_db_exists ? 'Has data (dirty)' : 'Empty / Not found';
        document.getElementById('db-status').className = data.shared_db_exists ? 'value dirty' : 'value';
        document.getElementById('integration-status').textContent = data.integration_installed ? 'Installed (dirty)' : 'Not installed';
        document.getElementById('integration-status').className = data.integration_installed ? 'value dirty' : 'value';
      } catch (e) {
        document.getElementById('db-status').textContent = 'Check failed: ' + e.message;
        document.getElementById('integration-status').textContent = 'Check failed: ' + e.message;
      }
    }

    async function doCleanup() {
      const section = document.getElementById('loading-section');
      const result = document.getElementById('result');
      section.classList.add('loading');
      result.className = 'result';
      result.textContent = 'Starting cleanup...';

      try {
        const res = await fetch(apiPath('/api/cleanup/trigger'), { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          result.className = 'result success';
          result.textContent = 'Cleanup Success - Restarting Home Assistant';
          setTimeout(() => { window.location.reload(); }, 3000);
        } else {
          result.className = 'result error';
          result.textContent = 'Cleanup failed: ' + (data.error || 'Unknown error');
          section.classList.remove('loading');
        }
      } catch (e) {
        result.className = 'result error';
        result.textContent = 'Network error: ' + e.message;
        section.classList.remove('loading');
      }
    }

    async function continueAnyway() {
      try {
        const res = await fetch(apiPath('/api/cleanup/dismiss'), { method: 'POST' });
        const data = await res.json();
      } catch (e) {}
      window.location.reload();
    }

    checkStatus();
  </script>
</body>
</html>"""


class BridgeAddRequest(BaseModel):
    host: str = ""
    port: int = 80
    name: str | None = None
    api_key: str = ""
    hostname: str = ""
    transport: str = "wifi"
    serial_port: str = ""
    baud: int = 460800


class BridgeUpdateRequest(BaseModel):
    name: str | None = None
    host: str | None = None
    port: int | None = None
    api_key: str | None = None


class BridgeSelectRequest(BaseModel):
    host: str
    port: int = 80
    name: str | None = None
    version: str | None = None
    api_key: str = ""
    network_id: str = ""
    hostname: str = ""


class HeartbeatConfigRequest(BaseModel):
    interval_seconds: int


class ParentConfigRequest(BaseModel):
    parent_mac: str
    clear: bool = True


class RelayConfigRequest(BaseModel):
    enable: bool


class PendingImportRequest(BaseModel):
    host: str
    port: int = 80
    api_key: str
    bridge_mac: str = ""
    network_id: str = ""
    name: str = "ESP Tree Bridge"


class SerialFlashRequest(BaseModel):
    port: str


class FlashWizardDetectChipRequest(BaseModel):
    port: str
    before: str | None = None


class FlashWizardSubmitRequest(BaseModel):
    name: str
    network_id: str
    psk: str
    wifi_ssid: str = ""
    wifi_password: str = ""
    api_key: str = ""
    espnow_mode: str = "lr"
    ota_password: str = ""
    chip_name: str
    board_info: dict[str, str]
    serial_port: str = ""
    transport: str = "wifi"
    baud: int = 460800
    # "bridge" (default) or "remote". A remote scaffolds esp_tree_remote, has no
    # WiFi/api_key/web server, and must NOT create a bridges row - it is a node on
    # the bridge's network, not a bridge.
    kind: str = "bridge"


def create_app() -> FastAPI:
    settings = load_settings()
    db = Database(settings.database_path)
    firmware_store = FirmwareStore(settings.firmware_dir, settings.firmware_retention_days)
    bridge_manager = BridgeV2Manager(db)
    ota_worker = OTAWorker(
        db=db,
        firmware_store=firmware_store,
        rejoin_timeout_s=settings.ota_rejoin_timeout_s,
        transfer_timeout_s=settings.ota_transfer_timeout_s,
        bridge_manager=bridge_manager,
    )

    app = FastAPI(title="ESP Tree Add-on", version="0.1.316")
    app.state._activity_positions = {}
    app.state.settings = settings
    app.state.db = db
    app.state.firmware_store = firmware_store
    app.state.ota_worker = ota_worker
    app.state.bridge_manager = bridge_manager
    app.state.integration_clients = 0
    app.state.autoconfig_task = None
    app.state.pending_imports = PendingImportStore(settings.data_dir / "pending_imports.json")
    scan_log_path = settings.data_dir / "esp_tree" / "bridge_scan.log"
    bridge_scan_lock = asyncio.Lock()

    def integration_token() -> str:
        token_path = settings.data_dir / "esp_tree" / "integration_token"
        token_path.parent.mkdir(parents=True, exist_ok=True)
        if token_path.exists():
            token = token_path.read_text(encoding="utf-8").strip()
            if token:
                return token
        token = uuid.uuid4().hex + uuid.uuid4().hex
        token_path.write_text(token, encoding="utf-8")
        return token

    def addon_url() -> str:
        return str(getattr(settings, "addon_url", "") or "http://127.0.0.1:8099").rstrip("/")

    def write_shared_integration_config() -> dict[str, str]:
        config = {
            "addon_url": addon_url(),
            "integration_token": integration_token(),
        }
        for config_path in (
            Path("/share/esp_tree/integration_config.json"),
            Path("/homeassistant/custom_components/esp_tree/.addon_config.json"),
        ):
            if not config_path.parent.exists() and not str(config_path).startswith("/share/"):
                continue
            try:
                config_path.parent.mkdir(parents=True, exist_ok=True)
                config_path.write_text(json.dumps(config), encoding="utf-8")
            except OSError as exc:
                logger.info("shared integration config write skipped for %s: %s", config_path, exc)
        return config

    @app.middleware("http")
    async def log_bridge_api_access(request: Request, call_next):
        path = request.url.path
        response = await call_next(request)
        if path.startswith("/api/bridge"):
            client = request.client
            client_info = f"{client.host}:{client.port}" if client else "unknown"
            status = response.status_code
            size = response.headers.get("content-length", "-")
            bridge_api_logger.info(
                '[bridge_api] %s - "GET %s HTTP/1.1" %s %s',
                client_info, path, status, size
            )
        return response

    yaml_store = YAMLStore(settings.data_dir / "devices")
    compile_store = CompileStore(settings.data_dir / "devices")
    compiler = ESPHomeCompiler(
        compile_store=compile_store,
        devices_root=settings.data_dir / "devices",
        components_root=Path("/opt/esp-tree/components"),
        platformio_cache=settings.data_dir / "platformio_cache",
    )
    compile_worker = CompileWorker(
        db=db,
        compiler=compiler,
        bridge_manager=bridge_manager,
        firmware_store=firmware_store,
        yaml_store=yaml_store,
        settings=settings,
        ota_worker=ota_worker,
    )
    app.state.yaml_store = yaml_store
    app.state.compile_store = compile_store
    app.state.compiler = compiler
    app.state.compile_worker = compile_worker

    async def log_health_periodically() -> None:
        while True:
            try:
                bridge_api_logger.info(
                    "HEALTH: v2_connected=%s, integration_clients=%d, nodes=%d",
                    bridge_manager.connected,
                    app.state.integration_clients,
                    len(bridge_manager.get_topology_list()),
                )
            except Exception as exc:
                bridge_api_logger.warning("health check failed: %s", exc)
            await asyncio.sleep(30)

    def bridge_target_from_row(bridge: dict[str, Any] | None) -> BridgeTarget | None:
        if not bridge or not bridge.get("host"):
            return None
        api_key = str(bridge.get("api_key") or "")
        if not api_key:
            return None
        return BridgeTarget(
            host=str(bridge["host"]),
            port=int(bridge.get("port") or 80),
            source="shared_db",
            name=str(bridge.get("name") or ""),
            api_key=api_key,
        )

    async def validate_bridge_key_pb(host: str, port: int, api_key: str) -> dict[str, Any]:
        import websockets

        ws_url = f"ws://{host.strip()}:{port}/esp-tree/v2/pb"
        try:
            async with websockets.connect(
                ws_url,
                subprotocols=[PROTOCOL],
                max_size=4 * 1024 * 1024,
                close_timeout=2,
                ping_interval=None,
                open_timeout=5,
            ) as ws:
                raw = await asyncio.wait_for(ws.recv(), timeout=5)
                if not isinstance(raw, bytes):
                    return {"valid": False, "error": "missing_binary_auth_challenge"}
                challenge_env = pb.Envelope()
                challenge_env.ParseFromString(raw)
                if challenge_env.WhichOneof("msg") != "auth_challenge":
                    return {"valid": False, "error": "missing_auth_challenge"}
                challenge = challenge_env.auth_challenge
                if challenge.protocol != PROTOCOL or challenge.max_version < API_VERSION:
                    return {"valid": False, "error": "incompatible_bridge_runtime_api"}
                client_nonce = secrets.token_bytes(16)
                digest_input = (
                    f"{PROTOCOL}|v2|{CLIENT_KIND}|"
                    f"{challenge.server_nonce.hex()}|{client_nonce.hex()}"
                ).encode()
                digest = hmac.new(api_key.encode(), digest_input, hashlib.sha256).digest()
                await ws.send(
                    pb.Envelope(
                        request_id=uuid.uuid4().hex,
                        api_version=API_VERSION,
                        auth_response=pb.AuthResponse(
                            client_kind=CLIENT_KIND,
                            client_name="ESP Tree Add-on",
                            client_nonce=client_nonce,
                            hmac_sha256=digest,
                        ),
                    ).SerializeToString()
                )
                auth_raw = await asyncio.wait_for(ws.recv(), timeout=5)
                if not isinstance(auth_raw, bytes):
                    return {"valid": False, "error": "missing_binary_auth_result"}
                auth_env = pb.Envelope()
                auth_env.ParseFromString(auth_raw)
                kind = auth_env.WhichOneof("msg")
                if kind == "auth_ok":
                    return {
                        "valid": True,
                        "bridge_mac": normalize_mac(auth_env.auth_ok.bridge.bridge_mac),
                        "bridge_name": auth_env.auth_ok.bridge.bridge_name,
                    }
                if kind == "auth_failed":
                    return {"valid": False, "error": auth_env.auth_failed.message or auth_env.auth_failed.code}
                return {"valid": False, "error": f"unexpected_auth_result:{kind}"}
        except Exception as exc:
            return {"valid": False, "error": str(exc)}

    async def validate_bridge_if_possible(bridge: dict[str, Any]) -> None:
        api_key = str(bridge.get("api_key") or "")
        if not api_key:
            return
        # A serial bridge is reached over a byte stream (e.g. socket://host:port), not
        # TCP host/port, so the websocket validator cannot reach it and would build
        # "ws://:80/...". Skip validation there - the transport handshake is the real
        # check, and failing here made the bridge's api_key permanently un-editable.
        if str(bridge.get("transport") or "wifi") == "serial":
            return
        host = str(bridge.get("host") or "").strip()
        port = int(bridge.get("port") or 80)
        result = await validate_bridge_key_pb(host, port, api_key)
        if not result.get("valid"):
            raise RuntimeError(str(result.get("error") or "API key rejected by bridge"))

    async def reconnect_bridge() -> None:
        await bridge_manager.sync_bridges(db.list_enabled_bridges())
        compile_worker.bridge_manager = bridge_manager

    def list_serial_ports() -> list[dict[str, Any]]:
        candidates: list[Path] = []
        for pattern in ("ttyUSB*", "ttyACM*", "ttyS*"):
            candidates.extend(Path("/dev").glob(pattern))
        by_id_dir = Path("/dev/serial/by-id")
        if by_id_dir.exists():
            candidates.extend(by_id_dir.glob("*"))

        seen: set[str] = set()
        ports: list[dict[str, Any]] = []
        for path in sorted(candidates, key=lambda p: str(p)):
            try:
                resolved = str(path.resolve())
            except OSError:
                resolved = str(path)
            key = resolved
            if key in seen:
                continue
            seen.add(key)
            port = str(path)
            ports.append(
                {
                    "port": port,
                    "label": path.name,
                    "path": port,
                    "resolved": resolved,
                    "available": os.access(resolved, os.R_OK | os.W_OK) if Path(resolved).exists() else os.access(port, os.R_OK | os.W_OK),
                    "by_id": str(path).startswith("/dev/serial/by-id/"),
                }
            )
        return ports

    def control_manager() -> Any | None:
        return bridge_manager

    async def ha_ws_call(command: dict[str, Any], timeout: float = 10.0) -> dict[str, Any]:
        if not settings.supervisor_token:
            raise RuntimeError("SUPERVISOR_TOKEN not available")
        import websockets

        async with websockets.connect("ws://supervisor/core/websocket", open_timeout=timeout, close_timeout=2) as ws:
            await asyncio.wait_for(ws.recv(), timeout=timeout)
            await ws.send(json.dumps({"type": "auth", "access_token": settings.supervisor_token}))
            auth = json.loads(await asyncio.wait_for(ws.recv(), timeout=timeout))
            if auth.get("type") != "auth_ok":
                raise RuntimeError("HA auth failed")
            await ws.send(json.dumps({"id": 1, **command}))
            while True:
                msg = json.loads(await asyncio.wait_for(ws.recv(), timeout=timeout))
                if msg.get("id") != 1:
                    continue
                if not msg.get("success", False):
                    error = msg.get("error") or {}
                    raise RuntimeError(error.get("message") or error.get("code") or "Home Assistant command failed")
                return msg

    async def restart_home_assistant() -> dict[str, Any]:
        if not settings.supervisor_token:
            raise RuntimeError("SUPERVISOR_TOKEN not available")
        import httpx

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(
                    "http://supervisor/core/restart",
                    headers={"Authorization": f"Bearer {settings.supervisor_token}"},
                    json={},
                )
                if 200 <= resp.status_code < 300:
                    try:
                        payload = resp.json()
                    except ValueError:
                        payload = {}
                    return {"success": True, "method": "supervisor", "response": payload}
                logger.info("Supervisor Core restart returned %s: %s", resp.status_code, resp.text)
        except Exception as exc:
            logger.info("Supervisor Core restart failed, falling back to HA service: %s", exc)

        try:
            restart_msg = await ha_ws_call(
                {"type": "call_service", "domain": "homeassistant", "service": "restart"},
                timeout=10.0,
            )
        except Exception as restart_exc:
            if "1000 (OK)" not in str(restart_exc):
                raise
            logger.info("Home Assistant closed the WebSocket during restart: %s", restart_exc)
            restart_msg = {"success": True, "assumed": True}
        return {
            "success": bool(restart_msg.get("success", True)),
            "method": "homeassistant_service",
            "response": restart_msg,
        }

    async def ha_config_entries(timeout: float = 5.0) -> list[dict[str, Any]]:
        # The command is `config_entries/get`. `config_entries/list` was removed from
        # Home Assistant -- calling it raises "Unknown command", which surfaced as a
        # bare 500 from /api/debug-config-entries and silently broke every caller
        # that enumerates entries (the setup-status loaded/entry_loaded probe, the
        # legacy /share cleanup, and both cleanup fallbacks).
        msg = await ha_ws_call({"type": "config_entries/get"}, timeout=timeout)
        result = msg.get("result", [])
        entries = result.get("entries", []) if isinstance(result, dict) else result
        logger.debug(f"config_entries/get raw response: {entries}")
        return entries if isinstance(entries, list) else []

    def integration_runtime_status() -> dict[str, Any]:
        runtime_path = Path("/share/esp_tree/integration_runtime.json")
        try:
            data = json.loads(runtime_path.read_text(encoding="utf-8"))
        except Exception:
            return {}
        return data if isinstance(data, dict) else {}

    @app.get("/api/debug-config-entries")
    async def debug_config_entries():
        if not settings.supervisor_token:
            return {"error": "SUPERVISOR_TOKEN not available"}
        entries = await ha_config_entries(timeout=5.0)
        esp_entries = [e for e in entries if e.get("domain") == "esp_tree"]
        return {
            "all_entries_count": len(entries),
            "esp_tree_entries": esp_entries,
            "first_entry_domain": entries[0].get("domain") if entries else None,
            "first_entry": entries[0] if entries else None,
        }

    async def integration_status() -> dict[str, Any]:
        installed = Path("/homeassistant/custom_components/esp_tree/manifest.json").exists()
        entries: list[dict[str, Any]] = []
        status: dict[str, Any] | None = None
        runtime_status = integration_runtime_status()
        runtime_version = str(runtime_status.get("version") or "")
        runtime_loaded = bool(runtime_version)
        live_status = bridge_manager.integration_status()
        live_version = str(live_status.get("integration_version") or "")
        live_connected = bool(live_status.get("connected"))
        loaded = False
        entry_loaded = False
        connected = False
        ws_client_connected = live_connected
        if settings.supervisor_token:
            # 1.5s is too tight for this probe: ha_ws_call opens a fresh websocket
            # to the supervisor on every call (connect + auth + request), and the
            # config-entries listing is the slowest of the two. When it lost the
            # race, `entries` stayed empty and the response reported entry_count 0
            # with entry_states [] -- indistinguishable from "no integration
            # installed", while `loaded` still read True from the live socket. The
            # same listing completes comfortably at 5s on /api/debug-config-entries.
            entries_task = asyncio.create_task(ha_config_entries(timeout=5.0))
            status_task = asyncio.create_task(ha_ws_call({"type": "esp_tree/status"}, timeout=1.5))
            try:
                entry_results, status_msg = await asyncio.gather(
                    entries_task,
                    status_task,
                    return_exceptions=True,
                )
            finally:
                if not entries_task.done():
                    entries_task.cancel()
                if not status_task.done():
                    status_task.cancel()

            if not isinstance(entry_results, Exception):
                entries = [entry for entry in entry_results if entry.get("domain") == "esp_tree"]
                entry_loaded = any("loaded" in str(entry.get("state") or "").lower() for entry in entries)

            if isinstance(status_msg, Exception):
                loaded = entry_loaded or ws_client_connected
                connected = ws_client_connected
            else:
                result = status_msg.get("result")
                if isinstance(result, dict):
                    status = result
                    loaded = True
                    connected = bool(result.get("connected", False))

        if ws_client_connected:
            loaded = True
            connected = True
            entry_loaded = True
        bridge_count = int((status or {}).get("bridge_count") or 0)
        remote_count = int((status or {}).get("remote_count") or 0)
        # Pass the online split through as-is, including absent. Remote_count includes
        # remotes retained from earlier sessions, so substituting it here would present
        # the retained total as live. Let the UI say "known" when the split is missing.
        remotes_online_raw = (status or {}).get("remotes_online")
        remotes_online = None if remotes_online_raw is None else int(remotes_online_raw)
        ha_status_version = str((status or {}).get("version") or "")
        return {
            "installed": installed,
            "loaded": loaded,
            "runtime_loaded": runtime_loaded,
            "live_connected": live_connected,
            "live_client_count": int(live_status.get("connected_count") or 0),
            "live_last_seen_at": live_status.get("last_seen_at"),
            "live_hello_received": bool(live_status.get("hello_received")),
            "live_version": live_version or None,
            "entry_loaded": entry_loaded,
            "version": live_version or ha_status_version or runtime_version,
            "ha_status_version": ha_status_version,
            "runtime_version": runtime_version,
            "configured": bool(entries) or ws_client_connected,
            "entry_count": len(entries),
            "entry_states": [str(entry.get("state") or "") for entry in entries],
            "bridge_count": bridge_count,
            "remote_count": remote_count,
            "remotes_online": remotes_online,
            "connected": connected,
            "ws_client_connected": ws_client_connected,
        }

    async def clear_local_state() -> None:
        db.init()
        with db.connect() as conn:
            conn.executescript(
                """
                DELETE FROM ota_jobs;
                DELETE FROM devices;
                DELETE FROM bridges;
                """
            )
        marker_path = settings.data_dir / ".cleanup_dismissed"
        marker_path.write_text(str(int(time.time())))
        app.state.cleanup_required = False

    async def validate_cleanup_complete() -> dict[str, Any]:
        try:
            db.init()
            with db.connect() as conn:
                bridges = conn.execute("SELECT COUNT(*) FROM bridges").fetchone()[0]
                devices = conn.execute("SELECT COUNT(*) FROM devices").fetchone()[0]
                ota_jobs = conn.execute("SELECT COUNT(*) FROM ota_jobs").fetchone()[0]
            if bridges > 0 or devices > 0 or ota_jobs > 0:
                return {
                    "valid": False,
                    "error": f"DB not clean: {bridges} bridges, {devices} devices, {ota_jobs} ota_jobs remain",
                }
            return {"valid": True}
        except Exception as exc:
            return {"valid": False, "error": str(exc)}

    def integration_source_dir() -> Path:
        src_candidates = [
            Path("/opt/esp-tree/ha_integration/custom_components/esp_tree"),
            Path(__file__).resolve().parents[1] / "ha_integration/custom_components/esp_tree",
        ]
        src = next((path for path in src_candidates if path.exists()), None)
        if src is None:
            raise RuntimeError("ESP Tree integration source directory not found")
        return src

    def integration_version(path: Path) -> str:
        manifest_path = path / "manifest.json"
        if not manifest_path.exists():
            return ""
        try:
            return str(json.loads(manifest_path.read_text(encoding="utf-8")).get("version") or "")
        except Exception:
            return ""

    def install_integration_files(reason: str = "custom_component_updated") -> dict[str, Any]:
        src = integration_source_dir()
        dst = Path("/homeassistant/custom_components/esp_tree")
        if not dst.parent.exists():
            raise RuntimeError("/homeassistant/custom_components is not available")

        version = integration_version(src) or None

        if dst.exists():
            shutil.rmtree(dst)
        shutil.copytree(src, dst)
        write_shared_integration_config()
        marker_path = dst / ".restart_required.json"
        marker_path.write_text(
            json.dumps(
                {
                    "integration_version": version,
                    "created_at": int(time.time()),
                    "reason": reason,
                }
            ),
            encoding="utf-8",
        )
        return {"source": str(src), "destination": str(dst), "version": version}

    def ensure_integration_files_current() -> dict[str, Any]:
        dst = Path("/homeassistant/custom_components/esp_tree")
        if not dst.parent.exists():
            return {"installed": False, "changed": False, "error": "/homeassistant/custom_components is not available"}
        src = integration_source_dir()
        src_version = integration_version(src)
        dst_version = integration_version(dst)
        write_shared_integration_config()
        if dst.exists() and src_version == dst_version:
            return {
                "installed": True,
                "changed": False,
                "version": src_version,
            }
        result = install_integration_files(reason="custom_component_updated")
        result["changed"] = True
        result["old_version"] = dst_version
        logger.info("Installed ESP Tree integration files (%s -> %s)", dst_version or "none", src_version or "unknown")
        return result

    async def announce_supervisor_discovery() -> None:
        if not settings.supervisor_token:
            return
        import httpx

        async with httpx.AsyncClient(timeout=10.0) as client:
            await client.post(
                "http://supervisor/discovery",
                headers={"Authorization": f"Bearer {settings.supervisor_token}"},
                json={
                    "addon": "esp-tree",
                    "service": "esp_tree",
                    "config": {
                        **write_shared_integration_config(),
                    },
                },
            )

    async def notify_restart_required(reason: str, version: str | None = None) -> None:
        if not settings.supervisor_token:
            return
        marker_path = Path("/homeassistant/custom_components/esp_tree/.restart_required.json")
        if marker_path.parent.exists() and not marker_path.exists():
            marker_path.write_text(
                json.dumps(
                    {
                        "integration_version": version,
                        "created_at": int(time.time()),
                        "reason": reason,
                    }
                ),
                encoding="utf-8",
            )

    def integration_flow_complete(result: dict[str, Any]) -> bool:
        flow_type = str(result.get("type") or "")
        reason = str(result.get("reason") or "")
        return flow_type == "create_entry" or (flow_type == "abort" and reason == "already_configured")

    async def config_flow_rest(method: str, path: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        """Call HA core's config-flow REST API through the Supervisor proxy.

        Config flows have NO websocket API — `config_entries/flow/init` and
        `config_entries/flow/start` both answer "Unknown command." for every handler
        (verified against a stock integration as a control). Flow creation lives on
        REST only: POST /api/config/config_entries/flow.
        """
        if not settings.supervisor_token:
            raise RuntimeError("SUPERVISOR_TOKEN not available")
        import httpx

        url = f"http://supervisor/core/api{path}"
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.request(
                    method,
                    url,
                    json=payload,
                    headers={
                        "Authorization": f"Bearer {settings.supervisor_token}",
                        "Content-Type": "application/json",
                    },
                )
            if resp.status_code >= 400:
                raise RuntimeError(f"HA {resp.status_code}: {resp.text[:200]}")
            data = resp.json()
            return data if isinstance(data, dict) else {}
        except RuntimeError:
            raise
        except Exception as exc:  # noqa: BLE001 - surface as a flow error
            raise RuntimeError(f"HA config flow request failed: {exc}") from exc

    async def start_integration_flow() -> dict[str, Any]:
        return await config_flow_rest(
            "POST",
            "/config/config_entries/flow",
            start_flow_payload("esp_tree"),
        )

    async def configure_integration_flow(flow_id: str, config: dict[str, str]) -> dict[str, Any]:
        return await config_flow_rest(
            "POST",
            f"/config/config_entries/flow/{flow_id}",
            configure_flow_payload(config),
        )

    async def request_ha_integration_config_flow() -> dict[str, Any]:
        if not settings.supervisor_token:
            return {"attempts": [], "complete": False, "error": "SUPERVISOR_TOKEN not available"}
        attempts: list[dict[str, Any]] = []
        try:
            config = write_shared_integration_config()
            # SOURCE_IMPORT is started by the integration's shared-config path in
            # async_setup. The REST endpoint always starts a user flow and ignores
            # caller-supplied context/data at initialization.
            result = await start_integration_flow()
            attempts.append({"source": "user", "result": result})
            logger.info(
                "integration user config flow result: type=%s reason=%s",
                result.get("type") or "unknown",
                result.get("reason") or "",
            )
            flow_id = str(result.get("flow_id") or "")
            if result.get("type") == "form" and flow_id:
                result = await configure_integration_flow(flow_id, config)
                attempts.append({"source": "user_configure", "result": result})
                logger.info(
                    "integration user configure result: type=%s reason=%s",
                    result.get("type") or "unknown",
                    result.get("reason") or "",
                )
            flow = {
                "attempts": attempts,
                "complete": integration_flow_complete(result),
                "last_result": result,
            }
            app.state.last_integration_flow = flow
            return flow
        except Exception as exc:
            logger.info("integration config flow deferred: %s", exc)
            flow = {"attempts": attempts, "complete": False, "error": str(exc)}
            app.state.last_integration_flow = flow
            return flow

    async def integration_autoconfigure_loop() -> None:
        while True:
            try:
                write_shared_integration_config()
                if getattr(app.state, "cleanup_required", False):
                    cleanup_required, cleanup_info = await check_cleanup_required()
                    app.state.cleanup_required = cleanup_required
                    app.state.cleanup_info = cleanup_info
                    if not cleanup_required:
                        continue
                    await asyncio.sleep(30)
                    continue
                install_status = ensure_integration_files_current()
                if install_status.get("changed"):
                    logger.info("integration files refreshed; Home Assistant restart is required")
                status = await integration_status()
                if status["installed"] and not status["configured"]:
                    await announce_supervisor_discovery()
                    await request_ha_integration_config_flow()
                    await asyncio.sleep(5)
                    status = await integration_status()
                if status["configured"]:
                    if status["loaded"] and not status["connected"]:
                        await announce_supervisor_discovery()
                    if status["loaded"] and status["connected"]:
                        return
                if status["installed"]:
                    if not status["loaded"]:
                        if install_status.get("changed"):
                            await notify_restart_required(
                                "esp_tree_integration_installed_not_loaded",
                                integration_version(Path("/homeassistant/custom_components/esp_tree")),
                            )
                        await asyncio.sleep(30)
                        continue
                    await announce_supervisor_discovery()
                    await request_ha_integration_config_flow()
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                logger.info("integration auto-configure deferred: %s", exc)
            await asyncio.sleep(30)

    async def mirror_activity_log_to_addon_log() -> None:
        path = Path("/share/esp_tree/activity.log")
        try:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.touch(exist_ok=True)
        except OSError as exc:
            logger.info("integration activity log mirror disabled for %s: %s", path, exc)
            return
        position = path.stat().st_size
        while True:
            try:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.touch(exist_ok=True)
                current_size = path.stat().st_size
                if current_size < position:
                    position = 0
                if current_size > position:
                    with path.open("r", encoding="utf-8", errors="replace") as fh:
                        fh.seek(position)
                        for line in fh:
                            line = line.strip()
                            if line:
                                logger.info("[integration] %s", line)
                        position = fh.tell()
                await asyncio.sleep(2)
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                logger.info("integration activity log mirror deferred: %s", exc)
                await asyncio.sleep(10)

    async def check_cleanup_required(include_integration: bool = False) -> tuple[bool, dict[str, Any]]:
        marker_path = settings.data_dir / ".cleanup_dismissed"
        if marker_path.exists():
            return False, {"dismissed": True}
        shared_db_path = Path("/share/esp_tree/esp_tree.db")
        db_exists = shared_db_path.exists() and shared_db_path.stat().st_size > 0
        bridges_count = 0
        if db_exists:
            try:
                with sqlite3.connect(shared_db_path) as conn:
                    row = conn.execute("SELECT COUNT(*) as cnt FROM bridges").fetchone()
                    bridges_count = int(row[0]) if row else 0
            except Exception:
                pass
        status = await integration_status() if include_integration else None
        integration_installed = bool(status and status["configured"])
        needs_cleanup = db_exists and (bridges_count > 0 or integration_installed)
        return needs_cleanup, {
            "shared_db_exists": db_exists,
            "bridges_count": bridges_count,
            "integration_installed": integration_installed,
            "integration_loaded": bool(status and status["loaded"]),
        }

    async def auto_cleanup_legacy_state() -> None:
        marker_path = settings.data_dir / ".legacy_cleanup_done"
        legacy_dir = Path("/share/esp_tree")
        # Either condition alone means there is nothing left to clean up: the
        # marker means a previous run finished, and a missing directory means
        # nothing to remove. Written as `and`, this guard only returned when BOTH
        # held -- but the integration recreates /share/esp_tree on every HA start,
        # so the directory was present on every add-on start, the guard fell
        # through, and shutil.rmtree() destroyed a live shared directory (taking
        # the integration's shared DB, activity log and config) on every update.
        if marker_path.exists() or not legacy_dir.exists():
            return
        if settings.supervisor_token:
            try:
                for entry in await ha_config_entries(timeout=10.0):
                    if entry.get("domain") == "esp_tree" and entry.get("entry_id"):
                        await ha_ws_call({"type": "config_entries/remove", "entry_id": entry["entry_id"]}, timeout=15.0)
            except Exception as exc:
                logger.info("legacy HA entry cleanup skipped: %s", exc)
        try:
            if legacy_dir.exists():
                shutil.rmtree(legacy_dir)
        except Exception as exc:
            logger.info("legacy /share cleanup skipped: %s", exc)
        marker_path.write_text(str(int(time.time())), encoding="utf-8")

    async def _init_cleanup_check() -> None:
        try:
            cleanup_required, cleanup_info = await asyncio.wait_for(
                check_cleanup_required(), timeout=5.0
            )
            app.state.cleanup_required = cleanup_required
            app.state.cleanup_info = cleanup_info
        except asyncio.TimeoutError:
            logger.info("cleanup check deferred (timeout)")
            app.state.cleanup_required = False
            app.state.cleanup_info = {"timeout": True}
        except Exception as exc:
            logger.info("cleanup check failed: %s", exc)
            app.state.cleanup_required = False
            app.state.cleanup_info = {"error": str(exc)}

    async def _init_reconnect_ws() -> None:
        try:
            await asyncio.wait_for(reconnect_bridge(), timeout=10.0)
        except asyncio.TimeoutError:
            logger.info("ws manager connect deferred (bridge not responding)")
        except Exception as exc:
            logger.info("ws manager connect failed: %s", exc)

    @app.on_event("startup")
    async def startup() -> None:
        db.init()
        cleaned = db.cleanup_stale_provisioning()
        if cleaned:
            logger.info("Cleaned up %d stale flash wizard provisioning record(s)", cleaned)
        write_shared_integration_config()
        try:
            ensure_integration_files_current()
        except Exception as exc:
            logger.info("integration file install deferred: %s", exc)
        app.state.cleanup_legacy_task = asyncio.create_task(
            auto_cleanup_legacy_state(),
            name="esp-tree-cleanup-legacy",
        )
        server_id_path = settings.data_dir / "server_id"
        if server_id_path.exists():
            server_id = server_id_path.read_text().strip()
        else:
            server_id = uuid.uuid4().hex[:8]
            server_id_path.write_text(server_id)
        app.state.server_id = server_id
        app.state.cleanup_required = False
        app.state.cleanup_info = {}
        app.state.cleanup_check_task = asyncio.create_task(
            _init_cleanup_check(),
            name="esp-tree-cleanup-check",
        )
        firmware_store.init()
        firmware_store.cleanup_partials()
        logger.info("Starting OTA worker and compile worker")
        try:
            await ota_worker.recover_startup()
        except Exception as exc:
            logger.info("OTA worker startup recovery deferred: %s", exc)
        try:
            await compile_worker.recover_startup()
        except Exception as exc:
            logger.info("Compile worker startup recovery deferred: %s", exc)
        ota_worker.start()
        compile_worker.start()
        app.state.autoconfig_task = asyncio.create_task(
            integration_autoconfigure_loop(),
            name="esp-tree-integration-autoconfigure",
        )
        app.state.activity_log_task = asyncio.create_task(
            mirror_activity_log_to_addon_log(),
            name="esp-tree-activity-log-mirror",
        )
        app.state.reconnect_ws_task = asyncio.create_task(
            _init_reconnect_ws(),
            name="esp-tree-reconnect-ws",
        )
        app.state.health_log_task = asyncio.create_task(
            log_health_periodically(),
            name="esp-tree-health-log",
        )
        app.state.bridge_scan_task = asyncio.create_task(
            _background_bridge_scan_loop(),
            name="esp-tree-bridge-scan",
        )

    @app.on_event("shutdown")
    async def shutdown() -> None:
        await bridge_manager.stop()
        for task_name in ("autoconfig_task", "activity_log_task", "bridge_scan_task",
                          "cleanup_legacy_task", "cleanup_check_task", "reconnect_ws_task",
                          "health_log_task"):
            task = getattr(app.state, task_name, None)
            if task and not task.done():
                task.cancel()
                try:
                    await task
                except asyncio.CancelledError:
                    pass
        await compile_worker.stop()
        await ota_worker.stop()

    @app.get("/api/health")
    async def health() -> dict[str, Any]:
        return {
            "ok": True,
            "ws_connected": bridge_manager.connected,
            "integration_ws_connected": app.state.integration_clients > 0,
        }

    @app.get("/api/cleanup/status")
    async def cleanup_status() -> dict[str, Any]:
        if not hasattr(app.state, "cleanup_required"):
            _, info = await check_cleanup_required(include_integration=True)
            return {"cleanup_required": False, **info}
        info = dict(getattr(app.state, "cleanup_info", {}))
        try:
            status = await integration_status()
            info["integration_installed"] = bool(status["configured"])
            info["integration_loaded"] = bool(status["loaded"])
        except Exception:
            pass
        return {
            "cleanup_required": app.state.cleanup_required,
            **info,
        }

    @app.post("/api/cleanup/dismiss")
    async def cleanup_dismiss() -> dict[str, Any]:
        marker_path = settings.data_dir / ".cleanup_dismissed"
        marker_path.write_text(str(int(time.time())))
        app.state.cleanup_required = False
        return {"success": True}

    @app.post("/api/cleanup/trigger")
    async def cleanup_trigger() -> dict[str, Any]:
        if not settings.supervisor_token:
            return {"success": False, "error": "SUPERVISOR_TOKEN not available"}
        try:
            cleanup_result: Any = None
            try:
                cleanup_msg = await ha_ws_call(
                    {"type": "call_service", "domain": "esp_tree", "service": "cleanup"},
                    timeout=30.0,
                )
                cleanup_result = cleanup_msg.get("result")
                await clear_local_state()
            except Exception as service_exc:
                logger.info("ESP Tree cleanup service unavailable, falling back to config entry removal: %s", service_exc)
                for entry in await ha_config_entries():
                    if entry.get("domain") != "esp_tree" or not entry.get("entry_id"):
                        continue
                    await ha_ws_call({"type": "config_entries/remove", "entry_id": entry["entry_id"]}, timeout=15.0)
                await clear_local_state()

            validation = await validate_cleanup_complete()
            if not validation["valid"]:
                return {"success": False, "error": "Cleanup validation failed: " + validation["error"]}

            install_result = install_integration_files(reason="cleanup_reinstall")
            restart_msg = await restart_home_assistant()
            restart_requested = bool(restart_msg.get("success", True))
            return {
                "success": restart_requested,
                "restart_requested": restart_requested,
                "cleanup_result": cleanup_result,
                "install_result": install_result,
            }
        except Exception as exc:
            return {"success": False, "error": str(exc)}

    @app.get("/api/restart-required")
    async def restart_required() -> dict[str, Any]:
        marker_path = Path("/homeassistant/custom_components/esp_tree/.restart_required.json")
        status = await integration_status()
        latest_version = integration_version(integration_source_dir())
        marker: dict[str, Any] = {}
        marker_exists = marker_path.exists()
        if marker_path.exists():
            try:
                marker = json.loads(marker_path.read_text(encoding="utf-8"))
            except Exception:
                marker = {"reason": "custom_component_updated"}
        decision = integration_restart_decision(status, latest_version, marker, marker_exists)
        if decision["clear_marker"]:
            try:
                marker_path.unlink(missing_ok=True)
            except OSError:
                pass
        return {
            "restart_required": decision["required"],
            "integration_version": (marker.get("integration_version") or decision["target_version"]) if decision["required"] else None,
            "created_at": marker.get("created_at") if decision["required"] else None,
            "reason": decision["reason"] if decision["required"] else None,
            "running_version": decision["running_version"],
            "latest_version": decision["latest_version"],
            "target_version": decision["target_version"],
            "source": decision["source"],
            "integration": status,
        }

    @app.post("/api/restart")
    async def request_restart() -> dict[str, Any]:
        if not settings.supervisor_token:
            return {"success": False, "error": "SUPERVISOR_TOKEN not available"}
        marker_path = Path("/homeassistant/custom_components/esp_tree/.restart_required.json")
        try:
            restart_msg = await restart_home_assistant()
            restart_requested = bool(restart_msg.get("success", True))
            if restart_requested and marker_path.exists():
                marker_path.unlink(missing_ok=True)
            return {
                "success": restart_requested,
                "restart_requested": restart_requested,
                "method": restart_msg.get("method"),
            }
        except Exception as exc:
            return {"success": False, "error": str(exc)}

    @app.get("/api/setup-status")
    async def setup_status() -> dict[str, Any]:
        active_bridge = db.get_active_bridge()
        bridge_ws = None
        manager = control_manager()
        if manager:
            bridge_ws = {
                "connected": manager.connected,
            }
        status = await integration_status()
        restart_marker = Path("/homeassistant/custom_components/esp_tree/.restart_required.json")
        latest_version = integration_version(integration_source_dir())
        marker: dict[str, Any] = {}
        if restart_marker.exists():
            try:
                marker = json.loads(restart_marker.read_text(encoding="utf-8"))
            except Exception:
                marker = {"reason": "custom_component_updated"}
        decision = integration_restart_decision(status, latest_version, marker, restart_marker.exists())
        if decision["clear_marker"]:
            try:
                restart_marker.unlink(missing_ok=True)
            except OSError:
                pass
        return {
            "bridge": {
                "configured": bool(active_bridge and not active_bridge.get("error")),
                "connected": bool(bridge_ws and bridge_ws.get("connected")),
                "ws_connected": bool(bridge_ws and bridge_ws.get("connected")),
                "uuid": (active_bridge or {}).get("uuid"),
                "hostname": (active_bridge or {}).get("hostname"),
                "ip": (active_bridge or {}).get("host"),
            },
            "restart": {
                "required": decision["required"],
                "running_version": decision["running_version"],
                "latest_version": decision["latest_version"],
                "target_version": decision["target_version"],
                "reason": decision["reason"] if decision["required"] else None,
                "source": decision["source"],
                "marker_present": bool(decision["marker_present"] and not decision["clear_marker"]),
            },
            "integration": {
                "loaded": status.get("loaded", False),
                "runtime_loaded": status.get("runtime_loaded", False),
                "live_connected": status.get("live_connected", False),
                "live_client_count": status.get("live_client_count", 0),
                "live_hello_received": status.get("live_hello_received", False),
                "live_version": status.get("live_version"),
                "configured": status.get("configured", False),
                "entry_loaded": status.get("entry_loaded", False),
                "entry_count": status.get("entry_count", 0),
                "entry_states": status.get("entry_states", []),
                "connected": status.get("connected", False),
                "ws_client_connected": status.get("ws_client_connected", False),
                "version": status.get("version"),
                "runtime_version": status.get("runtime_version"),
                "latest_version": latest_version,
                "last_flow": getattr(app.state, "last_integration_flow", None),
            },
        }

    @app.post("/api/integration/setup")
    async def integration_setup() -> dict[str, Any]:
        try:
            install_status = ensure_integration_files_current()
            if install_status.get("changed"):
                logger.info("integration files refreshed during on-demand setup")
            await announce_supervisor_discovery()
            flow = await request_ha_integration_config_flow()
            status = await integration_status()
            return {
                "success": True,
                "entry_created": bool(status.get("configured", False) or flow.get("complete", False)),
                "restart_required": install_status.get("changed", False),
                "integration": status,
                "flow": flow,
            }
        except Exception as exc:
            logger.info("on-demand integration setup failed: %s", exc)
            status = await integration_status()
            return {
                "success": False,
                "entry_created": status.get("configured", False),
                "restart_required": False,
                "error": str(exc),
                "integration": status,
            }

    @app.get("/api/integration/pending_imports")
    async def pending_imports() -> dict[str, Any]:
        return {"imports": list(app.state.pending_imports.list().values())}

    @app.post("/api/integration/pending_imports")
    async def create_pending_import(request: PendingImportRequest) -> dict[str, Any]:
        return app.state.pending_imports.create(request.model_dump())

    @app.delete("/api/integration/pending_imports/{import_id}")
    async def consume_pending_import(import_id: str) -> dict[str, Any]:
        record = app.state.pending_imports.pop(import_id)
        if record is None:
            raise HTTPException(status_code=404, detail="pending import not found")
        return record

    @app.post("/api/bridge/ws/refresh")
    async def ws_refresh_topology() -> dict[str, Any]:
        manager = control_manager()
        if not manager:
            raise HTTPException(status_code=400, detail="WebSocket transport is not active")
        try:
            await manager.refresh_once()
            return {"type": "topology.snapshot", "nodes": len(manager.get_topology_list())}
        except Exception as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc

    @app.websocket("/ws/topology")
    async def ws_topology(websocket: WebSocket) -> None:
        await websocket.accept()
        manager = control_manager()
        if not manager:
            await websocket.close(code=1011, reason="WebSocket transport is not active")
            return
        q = manager.broadcast.add_client()
        try:
            await websocket.send_json({"type": "server_id", "value": app.state.server_id})
            try:
                topo = await manager.topology()
                await websocket.send_json({"type": "topology.snapshot", "payload": {"nodes": topo}})
            except Exception as exc:
                await websocket.close(code=1011, reason=f"failed to get topology: {exc}")
                return
            while True:
                msg = await q.get()
                await websocket.send_text(msg)
        except Exception:
            pass
        finally:
            manager.broadcast.remove_client(q)

    @app.websocket("/esp-tree/integration/v1/pb")
    async def ws_integration_pb(websocket: WebSocket) -> None:
        await websocket.accept()
        try:
            auth = await asyncio.wait_for(websocket.receive_json(), timeout=10.0)
        except Exception:
            await websocket.close(code=1008, reason="auth required")
            return
        if auth.get("type") != "auth" or auth.get("token") != integration_token():
            await websocket.close(code=1008, reason="auth failed")
            return
        await websocket.send_json({"type": "auth_ok"})
        q = bridge_manager.add_integration_client()
        app.state.integration_clients = bridge_manager.integration_status()["connected_count"]
        await bridge_manager.replay_snapshots(q)
        sender_lock = asyncio.Lock()
        receiver_lock = asyncio.Lock()

        async def sender() -> None:
            while True:
                raw = await q.get()
                async with sender_lock:
                    await websocket.send_bytes(raw)

        sender_task = asyncio.create_task(sender(), name="integration-pb-sender")
        try:
            while True:
                message = await websocket.receive()
                if "bytes" not in message or message["bytes"] is None:
                    await websocket.close(code=1003, reason="binary protobuf required")
                    return
                try:
                    response = await bridge_manager.handle_integration_frame(message["bytes"], q)
                except DecodeError:
                    await websocket.close(code=1003, reason="invalid protobuf")
                    return
                async with receiver_lock:
                    await websocket.send_bytes(response)
        except Exception:
            pass
        finally:
            sender_task.cancel()
            bridge_manager.remove_integration_client(q)
            app.state.integration_clients = bridge_manager.integration_status()["connected_count"]
            try:
                await sender_task
            except asyncio.CancelledError:
                pass

    @app.get("/api/config")
    async def config() -> dict[str, Any]:
        active_bridge = db.get_active_bridge()
        if active_bridge:
            active_bridge = {**active_bridge, "source": "shared_db"}
        ws_status = None
        manager = control_manager()
        if manager:
            ws_status = {
                "connected": manager.connected,
                "transport": "bridge_v2_pb",
                "persistent": True,
            }
        status = await integration_status()
        return {
            "bridge": active_bridge or {},
            "active_bridge": active_bridge,
            "bridges": db.list_bridges(),
            "firmware_retention_days": settings.firmware_retention_days,
            "scan_subnets": settings.scan_subnets,
            "ws_status": ws_status,
            "integration": status,
        }

    @app.put("/api/config")
    async def update_config(patch: dict[str, Any]) -> dict[str, Any]:
        options = _read_options(settings.options_path)
        if "firmware_retention_days" in patch:
            options["firmware_retention_days"] = max(1, int(patch["firmware_retention_days"]))
        if "scan_subnets" in patch:
            options["scan_subnets"] = str(patch["scan_subnets"] or "")
        settings.options_path.write_text(json.dumps(options, indent=2), encoding="utf-8")
        settings.firmware_retention_days = max(1, _int_option(options, "firmware_retention_days", 7))
        settings.scan_subnets = str(options.get("scan_subnets", "") or "")
        return await config()

    async def _try_auto_activate_provisioned_bridge() -> bool:
        prov = db.get_provisioning_bridge()
        if not prov:
            return False
        api_key = str(prov.get("api_key") or "")
        if not api_key:
            return False

        if str(prov.get("transport") or "wifi") == "serial":
            # A serial bridge is never discovered by scanning: there is no host and
            # no network. Once its firmware is flashed, activation is just "start
            # the serial client for this bridge and let it authenticate".
            db.update_bridge(
                prov["uuid"],
                enabled=1,
                flash_wizard_pending=0,
            )
            await reconnect_bridge()
            logger.info("flash wizard: activated serial bridge uuid=%s", prov["uuid"])
            return True

        cached = db.get_discovered_bridges()
        for bridge in cached:
            host = bridge["host"]
            port = int(bridge.get("port", 80))
            result = await validate_bridge_key_pb(host, port, api_key)
            if result.get("valid"):
                bridge_mac = result.get("bridge_mac", "")
                update_values: dict[str, Any] = {
                    "host": host,
                    "port": port,
                    "enabled": 1,
                    "flash_wizard_pending": 0,
                }
                if bridge.get("hostname"):
                    update_values["hostname"] = bridge.get("hostname")
                if bridge.get("network_id"):
                    update_values["network_id"] = bridge.get("network_id")
                if bridge.get("name"):
                    update_values["name"] = bridge.get("name")
                if bridge_mac:
                    update_values["mac"] = bridge_mac
                    try:
                        db.rename_device_mac(PLACEHOLDER_MAC, bridge_mac)
                    except Exception:
                        logger.info("flash wizard: could not migrate placeholder device MAC to %s", bridge_mac)
                db.update_bridge(prov["uuid"], **update_values)
                await reconnect_bridge()
                return True
        return False

    async def _run_bridge_scan() -> None:
        async with bridge_scan_lock:
            try:
                scan_log_path.unlink(missing_ok=True)
            except Exception:
                pass
            scan_log_path.touch()
            options = _read_options(settings.options_path)
            subnets_str = str(options.get("scan_subnets", "") or "").strip()
            extra_subnets: list[ipaddress.IPv4Network] = []
            if subnets_str:
                for part in subnets_str.split(","):
                    part = part.strip()
                    if part:
                        try:
                            extra_subnets.append(ipaddress.IPv4Network(part, strict=False))
                        except ValueError as e:
                            logger.warning("network: invalid subnet %r: %s", part, e)
            net = NetworkDiscovery(scan_log_path=scan_log_path)
            discovered = await net.discover(timeout=8.0, extra_subnets=extra_subnets if extra_subnets else None)
            db.save_discovered_bridges([
                {"host": b.host, "port": b.port, "name": b.name, "version": b.version, "network_id": b.network_id, "hostname": b.hostname}
                for b in discovered
            ])
            await _try_auto_activate_provisioned_bridge()

    async def _background_bridge_scan_loop() -> None:
        await asyncio.sleep(5)
        while True:
            try:
                await _run_bridge_scan()
            except Exception as exc:
                logger.info("background bridge scan failed: %s", exc)
            await asyncio.sleep(240)

    @app.get("/api/bridge/discover")
    async def discover_bridges() -> list[dict[str, Any]]:
        cached = db.get_discovered_bridges()
        live_bridges: list[dict[str, Any]] = []
        net = NetworkDiscovery()
        for bridge in cached:
            result = await net.ping(bridge["host"], int(bridge.get("port", 80)), timeout=0.5)
            if result is not None:
                live_bridges.append({
                    "host": result.host,
                    "port": result.port,
                    "name": result.name,
                    "version": result.version,
                    "network_id": result.network_id,
                    "hostname": result.hostname,
                })
            else:
                db.delete_discovered_bridge(bridge["host"], int(bridge.get("port", 80)))
        return live_bridges

    @app.post("/api/bridge/scan")
    async def trigger_bridge_scan() -> dict[str, Any]:
        if bridge_scan_lock.locked():
            return {"success": False, "error": "Scan already in progress"}
        asyncio.create_task(_run_bridge_scan())
        return {"success": True, "message": "Scan started"}

    @app.get("/api/bridge/scan-log")
    async def get_scan_log():
        if not scan_log_path.exists():
            return PlainTextResponse("No scan has been run yet. Click 'Scan Network' to discover bridges.", status_code=200)
        return FileResponse(scan_log_path, media_type="text/plain", filename="bridge_scan.log")

    @app.post("/api/bridge/flash-wizard/detect-chip")
    async def flash_wizard_detect_chip(body: FlashWizardDetectChipRequest) -> dict[str, Any]:
        result = await compiler.detect_chip_on_port(body.port, body.before)
        return result

    # PLACEHOLDER_MAC / REMOTE_PLACEHOLDER_MAC now live in bridge_constants, because
    # the bridge client needs PLACEHOLDER_MAC too to migrate the placeholder device
    # row once the real MAC is known.

    @app.post("/api/bridge/flash-wizard/submit")
    async def flash_wizard_submit(body: FlashWizardSubmitRequest) -> dict[str, Any]:
        import secrets as secrets_mod

        name = body.name.strip()
        chip_name = body.chip_name.strip()
        board_info = {str(key): str(value) for key, value in body.board_info.items() if value is not None}
        api_key = body.api_key.strip() or secrets_mod.token_urlsafe(24)
        ota_password = body.ota_password.strip() or secrets_mod.token_urlsafe(24)
        transport = (body.transport or "wifi").strip().lower()
        kind = (body.kind or "bridge").strip().lower()
        if kind not in ("bridge", "remote"):
            raise HTTPException(status_code=400, detail=f"unsupported kind: {kind}")
        is_remote = kind == "remote"
        # Transport only means something for a bridge. A remote is ESP-NOW-only and
        # has no host and no UART, so validating its transport would reject the
        # wizard's own payload for no benefit.
        if not is_remote:
            if transport not in ("wifi", "serial"):
                raise HTTPException(status_code=400, detail=f"unsupported transport: {transport}")
            if transport == "serial" and not body.serial_port.strip():
                raise HTTPException(status_code=400, detail="serial_port is required for serial transport")
            if transport == "wifi" and (not body.wifi_ssid.strip() or not body.wifi_password):
                raise HTTPException(status_code=400, detail="wifi_ssid and wifi_password are required for WiFi transport")

        logger.info("flash_wizard_submit: name=%s chip=%s transport=%s kind=%s", name, chip_name, transport, kind)

        validate_flash_name(name, is_remote=is_remote, yaml_store=yaml_store, db=db)
        if not board_info.get("platform") or not board_info.get("board"):
            raise HTTPException(status_code=400, detail="board_info is required")

        validate_board(chip_name, board_info, CHIP_NAME_TO_BOARD)
        # A remote the compiler cannot build must be refused here, with the reason.
        # Letting it through produces a multi-minute job that ends in a raw
        # "#include ... No such file or directory" against a header that is absent
        # by design, which reads as a broken toolchain rather than a known gap.
        # Bridges are unaffected: only a remote scaffold omits the ota:/network:
        # blocks that the ESP8266 receiver's OTA backend depends on.
        if is_remote:
            validate_remote_chip_buildable(chip_name, board_info)

        node = {
            "esphome_name": name,
            "is_bridge": not is_remote,
            "chip_name": chip_name,
            "board_info": board_info,
            "espnow_mode": body.espnow_mode,
            "transport": transport,
        }
        if is_remote:
            # A remote is ESP-NOW LR only: no wifi:, no api:/web_server:, no
            # bridge api_key, no ota password. generate_scaffold already emits the
            # remote component shape when is_bridge is false, so nothing extra is
            # needed here beyond not asking for bridge-only blocks.
            pass
        else:
            node.update({
                "sdkconfig_options": {
                    "CONFIG_FREERTOS_USE_TRACE_FACILITY": "y",
                    "CONFIG_ESP_MAIN_TASK_STACK_SIZE": "12288",
                },
                "ota_password": "!secret ota_password",
                "api_key": "!secret bridge_api_key",
                "web_server_port": 80,
            })
            if transport == "serial":
                # No wifi: block in serial mode, so no wifi secrets may be referenced:
                # a !secret with no matching key is a hard failure at config load.
                node["serial_transport"] = True
            else:
                node["wifi_ssid_secret"] = "wifi_ssid"
                node["wifi_password_secret"] = "wifi_password"
        # A remote consumes the network's ESP-NOW credentials; it must never author
        # them. These live in secrets.yaml and the bridge firmware resolves them, so
        # writing them here would let a single remote flash silently re-identify the
        # whole network and orphan every device already on it. Only a bridge submit
        # (which defines the network) is allowed to write them.
        configured_network_id = _secret_from_secrets_yaml("espnow_network_id") or str(
            (db.get_active_bridge() or {}).get("network_id") or ""
        ).strip()
        configured_psk = _secret_from_secrets_yaml("espnow_psk")

        requested_network_id = body.network_id.strip()
        requested_psk = body.psk.strip()

        if is_remote:
            # Reject a remote that asks for a different network rather than quietly
            # using either value: the mismatch is exactly the failure that is hardest
            # to diagnose later (firmware that compiles but can never join).
            validate_remote_network_credentials(
                requested_network_id, requested_psk, configured_network_id, configured_psk
            )

        secrets_to_merge: dict[str, str] = {}
        if is_remote:
            logger.info(
                "flash_wizard_submit: remote %s will use the configured ESP-NOW network", name
            )
        else:
            secrets_to_merge["espnow_network_id"] = requested_network_id
            secrets_to_merge["espnow_psk"] = requested_psk
        if not is_remote:
            secrets_to_merge["bridge_api_key"] = api_key
            secrets_to_merge["ota_password"] = ota_password
        if transport != "serial" and not is_remote:
            # Serial configs have no wifi: block, so writing empty wifi secrets
            # would only leave unused junk in secrets.yaml.
            secrets_to_merge["wifi_ssid"] = body.wifi_ssid
            secrets_to_merge["wifi_password"] = body.wifi_password

        # Generate all content before the first filesystem or DB mutation.
        yaml_content, _ = generate_scaffold(node)
        yaml_store.save_config(name, yaml_content)
        logger.info("flash_wizard_submit: saved yaml config for %s", name)
        if secrets_to_merge:
            yaml_store.merge_secrets(secrets_to_merge)
        logger.info("flash_wizard_submit: merged secrets for %s (remote=%s)", name, is_remote)

        nm = normalize_mac(PLACEHOLDER_MAC if not is_remote else REMOTE_PLACEHOLDER_MAC)
        try:
            await compiler.cancel_compile(name)
        except Exception:
            pass

        bridge = None
        if not is_remote:
            existing_prov = db.get_provisioning_bridge()
            if existing_prov:
                db.delete_bridge(existing_prov["uuid"])

            bridge = db.add_bridge(
                host="0.0.0.0",
                port=0,
                name=name,
                discovered_via="flash_wizard",
                api_key=api_key,
                network_id=body.network_id,
                mac=PLACEHOLDER_MAC,
                flash_wizard_pending=1,
                enabled=0,
                # Carry the transport through to the bridge record, or the wizard's
                # choice is lost here: the row would always look like a wifi bridge
                # and the serial client would never be started for it.
                transport=transport,
                serial_port=body.serial_port.strip(),
                baud=int(body.baud or 460800),
            )
            logger.info("flash_wizard_submit: created bridge record uuid=%s", bridge["uuid"])

        # A remote must NOT get a bridges row: it is a node on the bridge's
        # network, not a bridge, and a row here would make the add-on try to open a
        # transport to it. It also cannot claim PLACEHOLDER_MAC - that key is
        # reserved for the single in-flight bridge provisioning, and a remote that
        # took it would collide with (and delete) the bridge's own device row.
        if is_remote:
            db.upsert_devices_from_topology([
                {
                    "mac": nm,
                    "label": name,
                    "esphome_name": name,
                    "chip_name": chip_name,
                    "is_bridge": False,
                }
            ], "0.0.0.0")
            logger.info("flash_wizard_submit: registered remote placeholder device name=%s", name)
        else:
            db.upsert_devices_from_topology([
                {
                    "mac": PLACEHOLDER_MAC,
                    "label": name,
                    "esphome_name": name,
                    "chip_name": chip_name,
                    "is_bridge": True,
                }
            ], "0.0.0.0")

        device = db.get_device(nm)
        logger.info("flash_wizard_submit: device lookup mac=%s found=%s esphome_name=%s", nm, device is not None, device.get("esphome_name") if device else None)

        if not yaml_store.has_config(name):
            raise HTTPException(status_code=500, detail="config not found after save")

        active = db.active_job_for_device(nm)
        if active and active["status"] not in (COMPILE_SUCCESS, FAILED, ABORTED, REJOIN_TIMEOUT, VERSION_MISMATCH):
            try:
                db.mark_terminal(int(active["id"]), ABORTED, error_msg="superseded by flash wizard re-submit")
            except Exception:
                pass

        job = db.create_job({
            "mac": nm,
            "status": COMPILE_QUEUED,
            "esphome_name": name,
            "firmware_name": f"{name}.ota.bin",
            "percent": 0,
        })
        compile_worker.wake()
        logger.info("flash_wizard_submit: created compile job id=%s mac=%s esphome_name=%s", job["id"], nm, name)

        return {
            "status": "compiling",
            "mac": nm,
            "esphome_name": name,
            "job_id": job["id"],
            "kind": kind,
        }

    @app.get("/api/bridge/flash-wizard/status")
    async def flash_wizard_status() -> dict[str, Any]:
        prov = db.get_provisioning_bridge()
        if not prov:
            # A remote deliberately has no bridges row, so fall back to its device
            # placeholder. Without this branch the remote wizard polls this endpoint
            # and is told provisioning:false forever, i.e. it looks stuck at step 1.
            return await _remote_provisioning_status()
        esphome_name = str(prov.get("name") or "")
        nm = normalize_mac(PLACEHOLDER_MAC)
        compile_status_dict = {}
        active_job = db.active_job_for_device(nm)
        if active_job:
            compile_status_dict = {"status": active_job["status"], "percent": active_job.get("percent")}

        serial_status = {}
        if esphome_name:
            serial_status = compiler.serial_flash_status(esphome_name) or {}

        bridge_detected = prov.get("host", "0.0.0.0") not in ("", "0.0.0.0")
        prov_transport = str(prov.get("transport") or "wifi")
        if prov_transport == "serial":
            # A serial bridge has no host to be discovered at, so presence has to
            # come from the transport: is the add-on's serial client for this
            # bridge actually connected? Without this the wizard polls on a
            # permanent false and then errors telling the user to check WiFi.
            bridge_detected = bridge_manager.client_connected(str(prov.get("uuid") or ""))
        detected_bridge = None
        if bridge_detected:
            detected_bridge = {
                "host": prov.get("host"),
                "port": prov.get("port", 80),
                "name": prov.get("name"),
            }

        return {
            "provisioning": True,
            "kind": "bridge",
            "esphome_name": esphome_name,
            "mac": PLACEHOLDER_MAC,
            "transport": prov_transport,
            "serial_port": prov.get("serial_port", ""),
            "compile_status": compile_status_dict.get("status", "idle"),
            "serial_flash_status": serial_status.get("status", "idle"),
            "bridge_detected": bridge_detected,
            "detected_bridge": detected_bridge,
        }

    async def _remote_provisioning_status() -> dict[str, Any]:
        """Status for an in-flight remote flash (no bridges row by design)."""
        nm = normalize_mac(REMOTE_PLACEHOLDER_MAC)
        dev = db.get_device(nm)
        if not dev:
            return {"provisioning": False}
        esphome_name = str(dev.get("esphome_name") or "")
        active_job = db.active_job_for_device(nm)
        compile_status_dict: dict[str, Any] = {}
        if active_job:
            compile_status_dict = {"status": active_job["status"], "percent": active_job.get("percent")}
        else:
            # active_job_for_device only returns non-terminal jobs, so once a build
            # finishes this endpoint would otherwise report "idle" forever and any
            # client polling it (rather than the device compile-status endpoint)
            # could never learn that it succeeded or failed. Surface the latest
            # terminal compile result instead.
            latest_compile = db.get_latest_compile_job_for_device(nm)
            if latest_compile and latest_compile["status"] in (COMPILE_SUCCESS, FAILED):
                compile_status_dict = {
                    "status": latest_compile["status"],
                    "percent": 100 if latest_compile["status"] == COMPILE_SUCCESS else 0,
                }
        serial_status = {}
        if esphome_name:
            serial_status = compiler.serial_flash_status(esphome_name) or {}
        # A remote has no host and no serial client: it is "detected" once the
        # bridge reports it in its live topology, which is the real join signal.
        remote_detected = False
        if esphome_name:
            remote_detected = any(
                str(node.get("esphome_name") or node.get("label") or node.get("friendly_name") or "") == esphome_name
                for node in bridge_manager.get_topology_list()
            )
        return {
            "provisioning": True,
            "kind": "remote",
            "esphome_name": esphome_name,
            "mac": nm,
            "transport": "espnow",
            "serial_port": "",
            "compile_status": compile_status_dict.get("status", "idle"),
            "percent": compile_status_dict.get("percent", 0),
            "serial_flash_status": serial_status.get("status", "idle"),
            "bridge_detected": remote_detected,
            "remote_detected": remote_detected,
            "detected_bridge": None,
        }

    @app.post("/api/bridge/flash-wizard/finalize")
    async def flash_wizard_finalize() -> dict[str, Any]:
        """Activate the provisioning bridge once its firmware has been flashed.

        For wifi this finds the bridge by scanning; for serial there is nothing to
        scan, so it just enables the bridge and starts its serial client. Without
        an explicit trigger a serial bridge would sit forever at
        flash_wizard_pending=1 waiting for a network scan that can never find it.
        """
        prov = db.get_provisioning_bridge()
        nm = normalize_mac(REMOTE_PLACEHOLDER_MAC)

        if not prov:
            # A remote never creates a bridges row, so "no provisioning bridge" is its
            # normal finish: drop the synthetic placeholder. The remote is added for
            # real by the normal topology upsert once it joins the bridge, so keeping
            # the placeholder would leave a permanent fake offline node.
            try:
                if db.get_device(nm):
                    db.delete_device(nm)
                    logger.info("flash_wizard_finalize: cleared remote placeholder %s", nm)
                    return {"activated": False, "kind": "remote", "detail": "remote placeholder cleared"}
            except Exception:
                # Cleanup of a cosmetic row must never fail the request: a 500 here
                # leaves the wizard reporting an error after a successful flash, and
                # this endpoint is polled. Report the failure instead of raising.
                logger.exception("flash_wizard_finalize: could not clear remote placeholder %s", nm)
                return {"activated": False, "kind": "remote", "detail": "placeholder cleanup failed"}
            return {"activated": False, "detail": "no provisioning bridge"}

        # A bridge is provisioning: that is the request to service. A stale remote
        # placeholder is cleared best-effort but must NOT change this response, or a
        # remote finished earlier would stop the bridge ever being activated.
        try:
            if db.get_device(nm):
                db.delete_device(nm)
                logger.info("flash_wizard_finalize: also cleared stale remote placeholder %s", nm)
        except Exception:
            logger.warning("flash_wizard_finalize: stale remote placeholder %s not cleared", nm, exc_info=True)
        activated = await _try_auto_activate_provisioned_bridge()
        return {
            "activated": activated,
            "uuid": prov.get("uuid"),
            "transport": str(prov.get("transport") or "wifi"),
        }

    @app.get("/api/bridges")
    async def list_bridges() -> list[dict[str, Any]]:
        # Annotate each bridge with why its client was skipped, if it was. A bridge
        # that cannot connect must not be indistinguishable from one that is merely
        # idle: the UI polls this list, so the reason belongs in the payload.
        skipped = bridge_manager.skipped_bridges()
        rows = db.list_bridges()
        for row in rows:
            uuid = str(row.get("uuid") or "")
            row["client_connected"] = bridge_manager.client_connected(uuid)
            if uuid in skipped:
                row["client_skipped_reason"] = skipped[uuid]
        return rows

    async def _fetch_hostname_from_bridge(host: str, port: int) -> str:
        import httpx
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(f"http://{host.strip()}:{port}/bridge.json", follow_redirects=False)
                if resp.status_code == 200:
                    data = resp.json()
                    return str(data.get("hostname", "")) or ""
        except Exception:
            pass
        return ""

    @app.post("/api/bridges")
    async def add_bridge(req: BridgeAddRequest) -> dict[str, Any]:
        host = req.host.strip()
        if req.transport == "serial":
            if not req.serial_port:
                raise HTTPException(status_code=400, detail="serial_port is required for serial transport")
        else:
            if not host:
                raise HTTPException(status_code=400, detail="host is required")
        bridge_candidate = {
            "host": host,
            "port": req.port,
            "name": req.name or "",
            "api_key": req.api_key or "",
        }
        if req.transport != "serial":
            try:
                await validate_bridge_if_possible(bridge_candidate)
            except Exception as exc:
                raise HTTPException(status_code=400, detail=str(exc)) from exc
        hostname = req.hostname or ""
        if req.transport != "serial" and (not hostname or hostname == host):
            hostname = await _fetch_hostname_from_bridge(host, req.port)
        bridge = db.add_bridge(
            host=host,
            port=req.port,
            name=req.name,
            discovered_via="manual",
            api_key=req.api_key or "",
            hostname=hostname,
            transport=req.transport,
            serial_port=req.serial_port,
            baud=req.baud,
        )
        await reconnect_bridge()
        bridge = db.get_bridge(str(bridge["uuid"])) or bridge
        return bridge

    @app.put("/api/bridges/{bridge_uuid}")
    async def update_bridge(bridge_uuid: str, req: BridgeUpdateRequest) -> dict[str, Any]:
        existing = db.get_bridge(bridge_uuid)
        if not existing:
            raise HTTPException(status_code=404, detail="bridge not found")
        updates: dict[str, Any] = {}
        if req.name is not None:
            updates["name"] = req.name
        if req.host is not None:
            updates["host"] = req.host.strip()
        if req.port is not None:
            updates["port"] = req.port
        if req.api_key is not None:
            updates["api_key"] = req.api_key
        if not updates:
            return existing
        needs_validate = "host" in updates or "port" in updates or "api_key" in updates
        if needs_validate:
            try:
                merged = {**existing, **updates}
                await validate_bridge_if_possible(merged)
            except Exception as exc:
                raise HTTPException(status_code=400, detail=str(exc)) from exc
        result = db.update_bridge(bridge_uuid, **updates)
        if needs_validate:
            await reconnect_bridge()
        return result or {}

    @app.delete("/api/bridges/{bridge_uuid}")
    async def delete_bridge(bridge_uuid: str) -> dict[str, Any]:
        existing = db.get_bridge(bridge_uuid)
        if not existing:
            raise HTTPException(status_code=404, detail="bridge not found")
        db.delete_bridge(bridge_uuid)
        await reconnect_bridge()
        return {"deleted": True, "uuid": bridge_uuid}

    @app.post("/api/bridges/{bridge_uuid}/reconnect")
    async def reconnect_bridge_by_uuid(bridge_uuid: str) -> dict[str, Any]:
        existing = db.get_bridge(bridge_uuid)
        if not existing:
            raise HTTPException(status_code=404, detail="bridge not found")
        # Report what actually happened. reconnect_bridge() answers False when no
        # client exists for this bridge, and the old handler discarded that and
        # always returned reconnected=True - so a bridge whose client was never
        # started (sync_bridges skips one with no api_key, or skips a wifi bridge
        # with no host) reported a successful reconnect while nothing connected.
        reconnected = await bridge_manager.reconnect_bridge(bridge_uuid)
        if not reconnected:
            reason = "no client is running for this bridge"
            if not str(existing.get("api_key") or "").strip():
                reason = "bridge has no api_key, so no client is started for it"
            elif str(existing.get("transport") or "wifi") != "serial" and not str(existing.get("host") or "").strip():
                reason = "bridge has no host, so no client is started for it"
            raise HTTPException(status_code=409, detail=f"bridge not reconnected: {reason}")
        return {"reconnected": True, "uuid": bridge_uuid}

    @app.put("/api/bridges/{bridge_uuid}/activate")
    async def activate_bridge(bridge_uuid: str) -> dict[str, Any]:
        existing = db.get_bridge(bridge_uuid)
        if not existing:
            raise HTTPException(status_code=404, detail="bridge not found")
        if not str(existing.get("api_key") or "").strip():
            raise HTTPException(status_code=400, detail="API key is required before activation")
        try:
            await validate_bridge_if_possible(existing)
        except Exception as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        result = db.set_active_bridge(bridge_uuid)
        await reconnect_bridge()
        return result or {}

    @app.put("/api/bridges/{bridge_uuid}/deactivate")
    async def deactivate_bridge(bridge_uuid: str) -> dict[str, Any]:
        existing = db.get_bridge(bridge_uuid)
        if not existing:
            raise HTTPException(status_code=404, detail="bridge not found")
        db.clear_active_bridge(bridge_uuid)
        await reconnect_bridge()
        return db.get_bridge(bridge_uuid) or {}

    @app.post("/api/bridge/select")
    async def select_discovered_bridge(req: BridgeSelectRequest) -> dict[str, Any]:
        host = req.host.strip()
        if not host:
            raise HTTPException(status_code=400, detail="host is required")
        bridge_candidate = {
            "host": host,
            "port": req.port,
            "name": req.name or "",
            "api_key": req.api_key or "",
        }
        try:
            await validate_bridge_if_possible(bridge_candidate)
        except Exception as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        bridge = db.add_bridge(
            host=host,
            port=req.port,
            name=req.name,
            discovered_via="network_scan",
            api_key=req.api_key or "",
            network_id=req.network_id or '',
            hostname=req.hostname or '',
        )
        await reconnect_bridge()
        bridge = db.get_bridge(str(bridge["uuid"])) or bridge
        return bridge

    @app.get("/api/bridge/topology.json")
    async def topology() -> list[dict[str, Any]]:
        manager = control_manager()
        if not manager:
            raise HTTPException(status_code=503, detail="WebSocket transport is not active")
        try:
            nodes = await manager.topology()
            if not nodes and manager.connected:
                logger.info("topology empty but bridge connected, retrying with refresh")
                await manager.refresh_once()
                await asyncio.sleep(0.5)
                nodes = await manager.topology()
            if not nodes:
                raise RuntimeError("bridge returned an empty topology")
        except Exception as exc:
            nodes = manager.get_topology_list()
            if not nodes:
                msg = str(exc)
                if isinstance(exc, OSError) and exc.errno == 113:
                    msg = "Bridge is unreachable — make sure the bridge is powered on and connected to the network, then restart the add-on"
                elif "Cannot connect to bridge" in msg:
                    msg = "Bridge is unreachable — make sure the bridge is powered on and connected to the network, then restart the add-on"
                raise HTTPException(status_code=502, detail=msg) from exc

        hidden_macs = db.get_hidden_macs()
        for node in nodes:
            node["hidden"] = node.get("mac") in hidden_macs

        # Append remotes the integration still retains from earlier sessions. The
        # bridge only advertises what is currently reachable, so a retained remote
        # otherwise exists in the counts but has no row anywhere - it cannot be
        # seen, edited or cleared. Draw it as an offline node instead.
        known_macs = {str(node.get("mac") or "").upper() for node in nodes}
        active = db.get_active_bridge() or {}
        bridge_mac = str(active.get("mac") or "").upper()
        for remote in await _retained_remotes():
            mac = str(remote.get("mac") or "").upper()
            if not mac or mac in known_macs:
                continue
            nodes.append(
                {
                    "mac": mac,
                    "node_key": mac.replace(":", ""),
                    "name": remote.get("name") or mac,
                    "esphome_name": remote.get("esphome_name") or remote.get("name") or mac,
                    "friendly_name": remote.get("name") or mac,
                    "label": remote.get("name") or mac,
                    "parent_mac": bridge_mac,
                    "online": False,
                    "hops": int(remote.get("hops") or 0),
                    "offline_reason": "not seen",
                    "offline_started_at": None,
                    "entity_count": int(remote.get("entity_count") or 0),
                    "chip_name": "",
                    "is_bridge": False,
                    "from_integration_store": True,
                    "hidden": mac in hidden_macs,
                }
            )
        return nodes

    def _secret_from_secrets_yaml(key: str) -> str:
        """Read one key from secrets.yaml, tolerating quotes and a missing file."""
        import re as _re

        try:
            text = yaml_store.get_secrets() or ""
        except Exception:
            return ""
        match = _re.search(rf"^\s*{_re.escape(key)}\s*:\s*(.+)$", text, _re.MULTILINE)
        if not match:
            return ""
        return match.group(1).strip().strip("\"'")

    async def _retained_remotes() -> list[dict[str, Any]]:
        """Remotes the integration still holds, including offline/retained ones.

        Primary source is the integration's own storage file. The add-on mounts the
        HA config dir, so this is a cheap local read; the websocket command is only a
        fallback because it needs the integration to be loaded AND version-matched,
        and a mismatch silently yields nothing (the remotes then vanish from the
        topology again). Ordering matters: the file is the durable record.
        """
        remotes = _retained_remotes_from_storage()
        if remotes:
            return remotes
        if not settings.supervisor_token:
            return []
        try:
            msg = await ha_ws_call({"type": "esp_tree/remotes"}, timeout=5.0)
        except Exception:
            return []
        result = msg.get("result") if isinstance(msg, dict) else None
        if not isinstance(result, dict):
            return []
        remotes = result.get("remotes")
        return remotes if isinstance(remotes, list) else []

    def _retained_remotes_from_storage() -> list[dict[str, Any]]:
        """Read retained remotes from HA's own store file for the integration.

        Store() writes JSON to <config>/.storage/esp_tree.runtime with the payload
        under "data", so the remotes live at data["remotes"]. Both {"remotes": {...}}
        and a bare mapping are tolerated: the integration has used a dict keyed by
        mac, and a shape change must not silently empty the topology.
        """
        import json as _json

        path = Path("/homeassistant/.storage/esp_tree.runtime")
        try:
            if not path.exists():
                return []
            payload = _json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            return []
        data = payload.get("data") if isinstance(payload, dict) else None
        raw = data.get("remotes") if isinstance(data, dict) else None
        if isinstance(raw, dict):
            items = []
            for mac, entry in raw.items():
                if isinstance(entry, dict):
                    merged = {"mac": mac}
                    merged.update(entry)
                    items.append(merged)
            return items
        if isinstance(raw, list):
            return [r for r in raw if isinstance(r, dict)]
        return []

    async def _retained_topology_nodes() -> list[dict[str, Any]]:
        """Use durable retained records for offline removals without a live manager."""
        nodes = await _retained_remotes()
        active = db.get_active_bridge() or {}
        if active.get("mac"):
            nodes.append({"mac": active["mac"], "is_bridge": True, "online": False})
        return nodes

    @app.delete("/api/topology/hide/{mac}")
    async def hide_device(mac: str) -> dict[str, Any]:
        target_mac = validate_mac_or_400(mac)
        db.hide_device(target_mac)
        return {"mac": target_mac, "hidden": True}

    @app.delete("/api/topology/remote/{mac}")
    async def remove_remote(mac: str) -> dict[str, Any]:
        """Forget a remote entirely: config entry, device row, retained store entry.

        Distinct from hide: hiding is a reversible cosmetic marker, whereas forget
        destroys the retained record. Needed because a stale remote from an older
        network otherwise stays in the topology forever with no way to clear it.

        A remote that the bridge still reports is refused - that is a live device, and
        removing it would only have it re-added by the next topology upsert. Take it
        off the air (or hide it) instead.
        """
        target_mac = validate_mac_or_400(mac)

        # Synthetic wizard placeholders are not real remotes and never appear in the
        # bridge or retained topology -- they live only as a device row registered by
        # /api/bridge/flash-wizard/submit so the wizard can poll compile status before
        # the device exists. The topology check below therefore cannot find them, so
        # they were unreachable by any endpoint and stayed in the tree forever as a
        # fake offline node (seen as a duplicate row for an already-flashed remote).
        # Clear those here instead of 404ing.
        if target_mac in {PLACEHOLDER_MAC, REMOTE_PLACEHOLDER_MAC}:
            removed = db.delete_device(target_mac)
            db.unhide_device(target_mac)
            logger.info("remove_remote: cleared synthetic placeholder %s (existed=%s)", target_mac, removed)
            return {
                "mac": target_mac,
                "removed": bool(removed),
                "integration": False,
                "synthetic": True,
                "warnings": [],
            }

        # The database is the authoritative bridge inventory. Never rely on the
        # live topology to protect bridge records: it may be unavailable precisely
        # when a bridge is offline.
        bridge_macs = {
            normalize_mac(str(bridge.get("mac") or ""))
            for bridge in db.list_all_bridges()
            if bridge.get("mac")
        }
        active_bridge = db.get_active_bridge() or {}
        if active_bridge.get("mac"):
            bridge_macs.add(normalize_mac(str(active_bridge["mac"])))
        if target_mac in bridge_macs:
            raise HTTPException(
                status_code=409,
                detail="that is the bridge, not a remote; only remotes can be removed.",
            )

        manager = control_manager()
        retained_source_available = bool(_retained_remotes_from_storage())
        try:
            live_nodes = await manager.topology() if manager else []
            if manager:
                live_macs = {normalize_mac(str(node.get("mac") or "")) for node in live_nodes}
                live_nodes.extend(
                    node for node in await _retained_remotes()
                    if normalize_mac(str(node.get("mac") or "")) not in live_macs
                )
            else:
                live_nodes = await _retained_topology_nodes()
            live = find_node_by_mac(live_nodes, target_mac)
        except Exception as exc:
            if not retained_source_available:
                raise HTTPException(
                    status_code=503,
                    detail=f"cannot verify live topology before removing remote: {exc}",
                ) from exc
            live = find_node_by_mac(_retained_remotes_from_storage(), target_mac)
        if live is None or live.get("is_bridge"):
            raise HTTPException(status_code=404, detail="remote not found in bridge or retained topology")
        if live.get("online", False):
            raise HTTPException(
                status_code=409,
                detail=(
                    "this remote is currently online; removing it would only be undone "
                    "by the next topology update. Hide it, or take it off the air first."
                ),
            )

        errors: list[str] = []
        forgot_in_integration = False

        # The integration holds the durable record (its own store file + config entry),
        # so forget there first. Without this the remote reappears from the store on
        # the next read even after the add-on row is gone.
        if settings.supervisor_token:
            try:
                await ha_ws_call(
                    {
                        "type": "call_service",
                        "domain": "esp_tree",
                        "service": "forget_remote",
                        "service_data": {"remote_mac": target_mac},
                    },
                    timeout=15.0,
                )
                forgot_in_integration = True
            except Exception as exc:
                errors.append(f"integration forget_remote failed: {exc}")
        else:
            errors.append("integration forget_remote unavailable: SUPERVISOR_TOKEN not available")

        if errors:
            raise HTTPException(status_code=502, detail="; ".join(errors))

        # Add-on side: device row, its jobs, and any hidden marker.
        try:
            if db.get_device(target_mac):
                db.delete_device(target_mac)
            db.unhide_device(target_mac)
        except Exception as exc:
            errors.append(f"local cleanup failed: {exc}")

        if errors:
            raise HTTPException(status_code=502, detail="; ".join(errors))

        logger.info(
            "remove_remote: forgot %s (integration=%s, warnings=%s)",
            target_mac,
            forgot_in_integration,
            errors or "none",
        )
        return {
            "mac": target_mac,
            "removed": True,
            "integration": forgot_in_integration,
            "warnings": errors,
        }

    @app.post("/api/topology/unhide/{mac}")
    async def unhide_device(mac: str) -> dict[str, Any]:
        target_mac = validate_mac_or_400(mac)
        db.unhide_device(target_mac)
        return {"mac": target_mac, "hidden": False}

    def validate_mac_or_400(value: str, field: str = "mac") -> str:
        compact = re.sub(r"[^0-9A-Fa-f]", "", value or "")
        if len(compact) != 12:
            raise HTTPException(status_code=400, detail=f"{field} must be a valid MAC address")
        return normalize_mac(value)

    async def require_remote_node(mac: str) -> dict[str, Any]:
        target_mac = validate_mac_or_400(mac)
        manager = control_manager()
        if not manager:
            raise HTTPException(status_code=503, detail="WebSocket transport is not active")
        try:
            topo = await manager.topology()
        except Exception as exc:
            raise HTTPException(status_code=503, detail=f"bridge unavailable: {exc}") from exc
        node = find_node_by_mac(topo, target_mac)
        if not node:
            raise HTTPException(status_code=404, detail="device not found in current topology")
        try:
            hops = int(node.get("hops") or 0)
        except (TypeError, ValueError):
            hops = 0
        if node.get("is_bridge") or hops == 0:
            raise HTTPException(status_code=409, detail="config commands require a remote node")
        if not node.get("online", False):
            raise HTTPException(status_code=409, detail="device is offline")
        return node

    def config_status_code(result: str) -> int:
        if result == "timeout":
            return 504
        if result == "unsupported":
            return 501
        if result in {"no_session", "not_remote"}:
            return 409
        return 200

    async def post_device_config(mac: str, command: str, params: dict[str, Any] | None = None) -> JSONResponse:
        await require_remote_node(mac)
        manager = control_manager()
        if not manager or not manager.connected:
            raise HTTPException(status_code=503, detail="WebSocket transport is not connected")
        try:
            result = await manager.send_config(normalize_mac(mac), command, params or {})
        except asyncio.TimeoutError:
            return JSONResponse(status_code=504, content={"result": "timeout", "command": command})
        except RuntimeError as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc
        status = str(result.get("result") or "rejected")
        return JSONResponse(status_code=config_status_code(status), content=result)

    @app.post("/api/devices/{mac}/reboot")
    async def reboot_device(mac: str) -> JSONResponse:
        return await post_device_config(mac, "reboot")

    @app.post("/api/devices/{mac}/heartbeat")
    async def set_device_heartbeat(mac: str, body: HeartbeatConfigRequest) -> JSONResponse:
        if body.interval_seconds < 5 or body.interval_seconds > 3600:
            raise HTTPException(status_code=400, detail="interval_seconds must be 5-3600")
        return await post_device_config(mac, "heartbeat_interval", {"interval_seconds": body.interval_seconds})

    @app.post("/api/devices/{mac}/rediscover")
    async def rediscover_device(mac: str) -> JSONResponse:
        return await post_device_config(mac, "force_rediscover")

    @app.post("/api/devices/{mac}/parent")
    async def set_device_parent(mac: str, body: ParentConfigRequest) -> JSONResponse:
        parent_mac = validate_mac_or_400(body.parent_mac, "parent_mac")
        return await post_device_config(mac, "set_parent_mac", {"parent_mac": parent_mac, "clear": body.clear})

    @app.post("/api/devices/{mac}/relay")
    async def set_device_relay(mac: str, body: RelayConfigRequest) -> JSONResponse:
        return await post_device_config(mac, "relay", {"enable": body.enable})


    @app.get("/api/devices")
    async def devices() -> list[dict[str, Any]]:
        return db.list_devices()

    @app.get("/api/devices/{mac}")
    async def device(mac: str) -> dict[str, Any]:
        found = db.get_device(mac)
        if not found:
            raise HTTPException(status_code=404, detail="device not found")
        return found

    @app.post("/api/ota/upload")
    async def ota_upload(mac: str = Form(...), file: UploadFile = File(...)) -> dict[str, Any]:
        target_mac = normalize_mac(mac)
        existing = db.active_job_for_device(target_mac)
        if existing:
            raise HTTPException(status_code=409, detail="this device already has an active or pending OTA job")
        pending = db.get_job_by_mac_and_status(target_mac, PENDING_CONFIRM)
        if pending:
            db.abort_queued_job(pending["id"])
            firmware_store.delete_file(pending.get("firmware_path"))

        try:
            topo = await bridge_manager.topology()
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"bridge health check failed: {exc}") from exc

        node = find_node_by_mac(topo, target_mac)
        if not node:
            raise HTTPException(status_code=404, detail="target device was not found in current topology")

        try:
            _, path, size, md5, info = await firmware_store.save_upload(file)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

        preflight = preflight_comparison(node, info.as_dict())
        job = db.create_job(
            {
                "mac": target_mac,
                "status": PENDING_CONFIRM,
                "firmware_path": str(path),
                "firmware_name": file.filename or path.name,
                "firmware_size": size,
                "firmware_md5": md5,
                "parsed_project_name": info.project_name,
                "parsed_version": info.parsed_version,
                "parsed_esphome_name": info.project_name,
                "parsed_build_date": info.formatted_build_date,
                "parsed_chip_name": info.chip_name,
                "old_firmware_version": node.get("firmware_version") or node.get("project_version"),
                "old_project_name": node.get("project_name"),
                "preflight_warnings": json.dumps(preflight["warnings"]),
            }
        )
        return {"job": job, "firmware": info.as_dict() | {"size": size, "md5": md5}, "preflight": preflight}

    @app.get("/api/ota/current")
    async def ota_current(mac: str | None = None) -> dict[str, Any]:
        if mac:
            job = db.active_job_for_device(normalize_mac(mac))
            if job and job["status"] == QUEUED:
                job = dict(job)
                job["queue_position"] = db.count_queued_before(int(job["id"])) + 1
            return {"job": job}
        return {"job": db.active_job()}

    @app.post("/api/ota/start/{job_id}")
    async def ota_start(job_id: int) -> dict[str, Any]:
        job = db.get_job(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="OTA job not found")
        if job["status"] != PENDING_CONFIRM:
            raise HTTPException(status_code=409, detail=f"job is not awaiting confirmation: {job['status']}")
        queued_jobs = db.queued_jobs()
        if _flash_work_pending(db, job_id):
            queue_order = len(queued_jobs)
            db.update_job(job_id, status=QUEUED, queue_order=queue_order)
            db.append_job_event(job_id, "flash_queued", position=queue_order + 1, firmware_name=job.get("firmware_name"), firmware_size=job.get("firmware_size"))
            ota_worker.wake()
            return {"job": db.get_job(job_id), "queue_position": queue_order + 1}
        db.update_job(job_id, status=STARTING, percent=0, error_msg=None)
        db.append_job_event(job_id, "flash_starting")
        ota_worker.wake()
        return {"job": db.get_job(job_id)}

    @app.post("/api/ota/abort")
    async def ota_abort() -> dict[str, Any]:
        job = db.active_job()
        if not job:
            return {"job": None}
        bridge_abort_failed = False
        if bridge_manager.connected:
            try:
                ota_client = bridge_manager.ota_client_for_remote(str(job["mac"]))
                await ota_client.abort(reason="user")
            except Exception:
                bridge_abort_failed = True
        retained_path, retained_until = firmware_store.retain(job.get("firmware_path"), int(job["id"]))
        db.update_job(int(job["id"]), firmware_path=retained_path, retained_until=retained_until)
        error_msg = "aborted by user"
        if bridge_abort_failed:
            error_msg += " (warning: bridge abort request failed, bridge may still have an active session)"
        db.mark_terminal(int(job["id"]), ABORTED, error_msg=error_msg)
        db.append_job_event(int(job["id"]), "flash_aborted", reason=error_msg)
        ota_worker.wake()
        return {"job": db.get_job(int(job["id"]))}

    @app.delete("/api/ota/pending/{job_id}")
    async def ota_cancel_pending(job_id: int) -> dict[str, Any]:
        job = db.get_job(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="job not found")
        if job["status"] != PENDING_CONFIRM:
            raise HTTPException(status_code=409, detail=f"job is not in pending_confirm status: {job['status']}")
        firmware_store.delete_file(job.get("firmware_path"))
        db.abort_queued_job(job_id)
        return {"ok": True, "job_id": job_id}

    @app.get("/api/ota/history")
    async def ota_history(limit: int = 100) -> dict[str, Any]:
        return {"jobs": db.list_history(limit=limit)}

    @app.get("/api/ota/history/{mac}")
    async def ota_history_for_mac(mac: str, limit: int = 100) -> dict[str, Any]:
        return {"jobs": db.list_history(mac=mac, limit=limit)}

    @app.get("/api/ota/jobs/{job_id}/log")
    async def ota_job_log(job_id: int) -> dict[str, Any]:
        result = db.get_job_log(job_id)
        if not result:
            raise HTTPException(status_code=404, detail="job not found")
        return result

    @app.get("/api/devices/{mac}/compile/history")
    async def compile_history(mac: str) -> dict[str, Any]:
        return {"jobs": db.compile_history(normalize_mac(mac))}

    @app.get("/api/compile/history")
    async def compile_history_all(limit: int = 100) -> dict[str, Any]:
        return {"jobs": db.compile_history_all(limit=limit)}

    @app.post("/api/ota/reflash/{job_id}")
    async def ota_reflash(job_id: int) -> dict[str, Any]:
        source = db.get_job(job_id)
        if not source:
            raise HTTPException(status_code=404, detail="source job not found")
        if db.active_job_for_device(str(source["mac"])):
            raise HTTPException(status_code=409, detail="this device already has an active or pending OTA job")
        if not source.get("firmware_path") or not source.get("retained_until") or int(source["retained_until"]) <= now_ts():
            raise HTTPException(status_code=410, detail="firmware binary is no longer retained")
        try:
            path = firmware_store.clone_retained(str(source["firmware_path"]))
        except FileNotFoundError as exc:
            raise HTTPException(status_code=410, detail=str(exc)) from exc
        device = db.get_device(str(source["mac"])) or {}
        source_firmware_info = {
            "esphome_name": source.get("parsed_esphome_name"),
            "parsed_build_date": source.get("parsed_build_date"),
            "chip_name": source.get("parsed_chip_name"),
        }
        node_for_preflight = {
            "esphome_name": device.get("esphome_name"),
            "firmware_build_date": device.get("firmware_build_date"),
            "chip_name": device.get("chip_name"),
        }
        preflight = preflight_comparison(node_for_preflight, source_firmware_info)
        job = db.create_job(
            {
                "mac": source["mac"],
                "status": PENDING_CONFIRM,
                "firmware_path": str(path),
                "firmware_name": source.get("firmware_name"),
                "firmware_size": source.get("firmware_size"),
                "firmware_md5": source.get("firmware_md5"),
                "parsed_project_name": source.get("parsed_project_name"),
                "parsed_version": source.get("parsed_version"),
                "parsed_esphome_name": source.get("parsed_esphome_name"),
                "parsed_build_date": source.get("parsed_build_date"),
                "parsed_chip_name": source.get("parsed_chip_name"),
                "old_firmware_version": device.get("current_firmware_version"),
                "old_project_name": device.get("current_project_name"),
                "preflight_warnings": json.dumps(preflight["warnings"]),
            }
        )
        return {"job": job, "preflight": preflight}

    @app.get("/api/firmware/retained")
    async def retained() -> dict[str, Any]:
        return {"jobs": db.list_retained()}

    @app.delete("/api/firmware/retained/{job_id}")
    async def delete_retained(job_id: int) -> dict[str, Any]:
        job = db.get_job(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="job not found")
        firmware_store.delete_file(job.get("firmware_path"))
        db.clear_job_firmware(job_id)
        return {"job": db.get_job(job_id)}

    @app.get("/api/ota/queue")
    async def ota_queue() -> dict[str, Any]:
        active = db.active_job()
        queued = db.queued_jobs()
        queued_with_position = []
        manager = control_manager()
        topo = await manager.topology() if manager else []
        topo_by_mac = {normalize_mac(n["mac"]): n for n in topo}
        for job in queued:
            job_copy = dict(job)
            job_copy["queue_position"] = db.count_queued_before(int(job["id"])) + 1
            nm = normalize_mac(str(job["mac"]))
            node = topo_by_mac.get(nm) or {}
            device = db.get_device(nm)
            job_copy["device_label"] = node.get("label") or node.get("friendly_name") or device.get("label") or device.get("esphome_name") or str(job["mac"])
            queued_with_position.append(job_copy)
        return {
            "active_job": active,
            "queued_jobs": queued_with_position,
            "paused": ota_worker.is_paused(),
            "count": len(queued_with_position),
        }

    @app.get("/api/ota/queue/paused")
    async def ota_queue_paused() -> dict[str, Any]:
        return {"paused": ota_worker.is_paused()}

    @app.post("/api/ota/queue/pause")
    async def ota_queue_pause() -> dict[str, Any]:
        ota_worker.pause()
        return {"paused": True}

    @app.post("/api/ota/queue/resume")
    async def ota_queue_resume() -> dict[str, Any]:
        ota_worker.resume()
        return {"paused": False}

    @app.post("/api/ota/queue/{job_id}/abort")
    async def ota_queue_abort(job_id: int) -> dict[str, Any]:
        job = db.get_job(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="queued job not found")
        if job["status"] != QUEUED:
            raise HTTPException(status_code=409, detail="job is not in queued status")
        firmware_store.delete_file(job.get("firmware_path"))
        db.abort_queued_job(job_id)
        return {"ok": True}

    @app.post("/api/ota/queue/{job_id}/up")
    async def ota_queue_up(job_id: int) -> dict[str, Any]:
        job = db.get_job(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="job not found")
        if job["status"] != QUEUED:
            raise HTTPException(status_code=409, detail="job is not in queued status")
        current_order = job.get("queue_order")
        if current_order is None or current_order <= 0:
            raise HTTPException(status_code=400, detail="job is already at the front of the queue")
        db.reorder_queue(job_id, current_order - 1)
        return {"jobs": db.queued_jobs()}

    @app.post("/api/ota/queue/{job_id}/down")
    async def ota_queue_down(job_id: int) -> dict[str, Any]:
        job = db.get_job(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="job not found")
        if job["status"] != QUEUED:
            raise HTTPException(status_code=409, detail="job is not in queued status")
        current_order = job.get("queue_order")
        queued_count = len(db.queued_jobs())
        if current_order is None or current_order >= queued_count - 1:
            raise HTTPException(status_code=400, detail="job is already at the back of the queue")
        db.reorder_queue(job_id, current_order + 1)
        return {"jobs": db.queued_jobs()}

    # ── Device Config ──

    @app.get("/api/devices/{mac}/config")
    async def get_device_config(mac: str) -> dict[str, Any]:
        device = db.get_device(mac)
        if not device:
            raise HTTPException(status_code=404, detail="device not found")
        esphome_name = str(device.get("esphome_name") or "")
        if not esphome_name:
            raise HTTPException(status_code=404, detail="device has no esphome_name associated")
        content = yaml_store.get_config(esphome_name)
        if content is None:
            raise HTTPException(status_code=404, detail="no config exists for this device")
        return {
            "mac": mac,
            "esphome_name": esphome_name,
            "content": content,
            "has_config": True,
        }

    @app.put("/api/devices/{mac}/config")
    async def save_device_config(mac: str, body: dict[str, Any]) -> dict[str, Any]:
        device = db.get_device(mac)
        if not device:
            raise HTTPException(status_code=404, detail="device not found")
        esphome_name = str(device.get("esphome_name") or "")
        if not esphome_name:
            raise HTTPException(status_code=404, detail="device has no esphome_name associated")
        content = str(body.get("content") or body.get("yaml") or "")
        scaffold = body.get("scaffold") if not content else False
        chip_unknown = False
        if scaffold:
            manager = control_manager()
            if not manager:
                raise HTTPException(status_code=503, detail="WebSocket transport is not active")
            try:
                topo = await manager.topology()
            except Exception as exc:
                raise HTTPException(status_code=502, detail=f"bridge unavailable: {exc}") from exc
            node = find_node_by_mac(topo, normalize_mac(mac))
            if not node:
                raise HTTPException(status_code=404, detail="device not found in topology")
            content, chip_unknown = generate_scaffold(node)
        if not content.strip():
            raise HTTPException(status_code=400, detail="config content is empty")
        yaml_store.save_config(esphome_name, content)
        return {
            "mac": mac,
            "esphome_name": esphome_name,
            "content": content,
            "has_config": True,
            "chip_unknown": chip_unknown if scaffold else False,
        }

    @app.delete("/api/devices/{mac}/config")
    async def delete_device_config(mac: str) -> dict[str, Any]:
        device = db.get_device(mac)
        if not device:
            raise HTTPException(status_code=404, detail="device not found")
        esphome_name = str(device.get("esphome_name") or "")
        if not esphome_name:
            raise HTTPException(status_code=404, detail="device has no esphome_name associated")
        yaml_store.delete_config(esphome_name)
        return {"deleted": True, "mac": mac, "esphome_name": esphome_name}

    @app.post("/api/devices/{mac}/config/import")
    async def import_device_config(
        mac: str,
        file: UploadFile | None = File(None),
        body: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        device = db.get_device(mac)
        if not device:
            raise HTTPException(status_code=404, detail="device not found")
        esphome_name = str(device.get("esphome_name") or "")
        if not esphome_name:
            raise HTTPException(status_code=404, detail="device has no esphome_name associated")
        content = ""
        if file is not None:
            content = (await file.read()).decode("utf-8", errors="replace")
        elif body is not None:
            content = str(body.get("content") or body.get("yaml") or "")
        elif body is None:
            content = ""
        if not content.strip():
            raise HTTPException(status_code=400, detail="no YAML content provided")
        yaml_store.save_config(esphome_name, content)
        return {
            "mac": mac,
            "esphome_name": esphome_name,
            "content": content,
            "has_config": True,
        }

    @app.get("/api/devices/{mac}/config/status")
    async def device_config_status(mac: str) -> dict[str, Any]:
        device = db.get_device(mac)
        if not device:
            raise HTTPException(status_code=404, detail="device not found")
        esphome_name = str(device.get("esphome_name") or "")
        has_config = bool(esphome_name and yaml_store.has_config(esphome_name))
        compile_status = compile_store.get_status(esphome_name) if esphome_name else {"status": "idle"}
        state = "no_config"
        if has_config:
            state = "has_config"
        nm = normalize_mac(mac)
        active_job = db.active_job_for_device(nm)
        job_id = None
        queue_position = None
        if active_job:
            if active_job["status"] == COMPILE_QUEUED:
                state = "compile_queued"
                job_id = active_job["id"]
                queue_position = db.count_compile_queued_before(job_id) + 1
            elif active_job["status"] == COMPILING:
                state = "compiling"
                job_id = active_job["id"]
        latest_compile = db.get_latest_compile_job_for_device(nm)
        if state not in ("compile_queued", "compiling") and latest_compile:
            if latest_compile["status"] == COMPILE_SUCCESS:
                state = "compiled_ready"
                compile_status = {"status": "success"}
            elif latest_compile["status"] == FAILED:
                compile_status = {"status": "failed", "error": latest_compile.get("error_msg")}
        if compile_status.get("status") == "success" and state not in ("compile_queued", "compiling"):
            state = "compiled_ready"
        return {
            "mac": mac,
            "esphome_name": esphome_name,
            "config_state": state,
            "has_config": has_config,
            "compile_status": compile_status.get("status", "idle"),
            "job_id": job_id,
            "queue_position": queue_position,
        }

    # ── Compilation ──

    @app.post("/api/devices/{mac}/compile")
    async def compile_device_config(mac: str, auto_flash: bool = False) -> dict[str, Any]:
        device = db.get_device(mac)
        if not device:
            raise HTTPException(status_code=404, detail="device not found")
        esphome_name = str(device.get("esphome_name") or "")
        if not esphome_name:
            raise HTTPException(status_code=404, detail="device has no esphome_name associated")
        if not yaml_store.has_config(esphome_name):
            raise HTTPException(status_code=404, detail=f"no config found for '{esphome_name}'")

        nm = normalize_mac(mac)
        active_for_device = db.active_job_for_device(nm)
        if active_for_device:
            if active_for_device["status"] == COMPILE_QUEUED:
                return {
                    "job": active_for_device,
                    "queue_position": db.count_compile_queued_before(active_for_device["id"]) + 1,
                    "preflight": preflight_comparison({}, {"metadata_unavailable": True}),
                }
            if active_for_device["status"] == COMPILING:
                return {
                    "job": active_for_device,
                    "queue_position": 1,
                    "preflight": preflight_comparison({}, {"metadata_unavailable": True}),
                }
            raise HTTPException(status_code=409, detail=f"device already has an active job ({active_for_device['status']})")

        job = db.create_job(
            {
                "mac": nm,
                "status": COMPILE_QUEUED,
                "esphome_name": esphome_name,
                "firmware_name": f"{esphome_name}.ota.bin",
                "percent": 0,
                "auto_flash": 1 if auto_flash else 0,
            }
        )
        active_compile = db.active_compile_job()
        queue_position = db.count_compile_queued_before(job["id"]) + 1 + (1 if active_compile else 0)
        compile_worker.wake()
        return {
            "job": db.get_job(job["id"]) or job,
            "queue_position": queue_position,
            "preflight": preflight_comparison({}, {"metadata_unavailable": True}),
        }

    @app.get("/api/devices/{mac}/compile/status")
    async def compile_status(mac: str) -> dict[str, Any]:
        device = db.get_device(mac)
        if not device:
            raise HTTPException(status_code=404, detail="device not found")
        esphome_name = str(device.get("esphome_name") or "")
        if not esphome_name:
            return {"mac": normalize_mac(mac), "esphome_name": "", "status": "idle", "job_id": None, "queue_position": None, "error": None, "flash_job": None}
        nm = normalize_mac(mac)
        compile_job = db.active_job_for_device(nm)
        if compile_job and compile_job["status"] in (COMPILE_QUEUED, COMPILING):
            if compile_job["status"] == COMPILE_QUEUED:
                pos = db.count_compile_queued_before(compile_job["id"]) + 1
                return {
                    "mac": nm,
                    "esphome_name": esphome_name,
                    "status": "compile_queued",
                    "job_id": compile_job["id"],
                    "queue_position": pos,
                    "compile_status": None,
                    "error": None,
                    "flash_job": None,
                }
            else:
                cs = compile_store.get_status(esphome_name)
                return {
                    "mac": nm,
                    "esphome_name": esphome_name,
                    "status": "compiling",
                    "job_id": compile_job["id"],
                    "queue_position": None,
                    "compile_status": cs.get("status", "compiling"),
                    "error": None,
                    "flash_job": None,
                }
        flash_job = db.get_latest_flash_job_for_device(nm)
        if flash_job and flash_job["status"] in (QUEUED, STARTING, ANNOUNCING, TRANSFERRING, VERIFYING, WAITING_REJOIN):
            if flash_job["status"] == QUEUED:
                pos = db.count_queued_before(flash_job["id"]) + 1
                return {
                    "mac": nm,
                    "esphome_name": esphome_name,
                    "status": "queued",
                    "job_id": flash_job["id"],
                    "queue_position": pos,
                    "compile_status": None,
                    "error": None,
                    "flash_job": {"id": flash_job["id"], "status": flash_job["status"], "queue_position": pos},
                }
            return {
                "mac": nm,
                "esphome_name": esphome_name,
                "status": flash_job["status"],
                "job_id": flash_job["id"],
                "queue_position": None,
                "compile_status": None,
                "error": None,
                "flash_job": {"id": flash_job["id"], "status": flash_job["status"]},
            }
        latest_compile = db.get_latest_compile_job_for_device(nm)
        if latest_compile and latest_compile["status"] == COMPILE_SUCCESS:
            return {
                "mac": nm,
                "esphome_name": esphome_name,
                "status": "compiled",
                "job_id": latest_compile["id"],
                "queue_position": None,
                "compile_status": "success",
                "error": None,
                "flash_job": None,
            }
        if latest_compile and latest_compile["status"] == FAILED:
            return {
                "mac": nm,
                "esphome_name": esphome_name,
                "status": "failed",
                "job_id": latest_compile["id"],
                "queue_position": None,
                "compile_status": "failed",
                "error": latest_compile.get("error_msg"),
                "flash_job": None,
            }
        if flash_job and flash_job["status"] in (SUCCESS, FAILED, ABORTED, REJOIN_TIMEOUT, VERSION_MISMATCH):
            return {
                "mac": nm,
                "esphome_name": esphome_name,
                "status": "idle",
                "job_id": None,
                "queue_position": None,
                "compile_status": None,
                "error": flash_job["error_msg"] if flash_job["status"] == FAILED else None,
                "flash_job": {"id": flash_job["id"], "status": flash_job["status"]},
            }
        cs = compile_store.get_status(esphome_name) if esphome_name else {"status": "idle"}
        cs_status = cs.get("status", "idle")
        if cs_status in ("success", "failed"):
            return {
                "mac": nm,
                "esphome_name": esphome_name,
                "status": cs_status,
                "job_id": None,
                "queue_position": None,
                "compile_status": cs_status,
                "error": cs.get("error"),
                "flash_job": None,
            }
        return {
            "mac": nm,
            "esphome_name": esphome_name,
            "status": "idle",
            "job_id": None,
            "queue_position": None,
            "compile_status": None,
            "error": None,
            "flash_job": None,
        }

    @app.get("/api/devices/{mac}/compile/logs")
    async def compile_logs(mac: str) -> StreamingResponse:
        device = db.get_device(mac)
        if not device:
            raise HTTPException(status_code=404, detail="device not found")
        esphome_name = str(device.get("esphome_name") or "")
        if not esphome_name:
            raise HTTPException(status_code=404, detail="device has no esphome_name associated")
        nm = normalize_mac(mac)
        compile_job = db.active_job_for_device(nm)

        async def compile_job_stream(job: dict[str, Any]) -> AsyncGenerator[str, None]:
            status = str(job.get("status") or "idle")
            exit_code = 0 if status == COMPILE_SUCCESS else 1
            yield f"event: status\ndata: {status}\n\n"
            if job.get("error_msg"):
                yield f"data: {job['error_msg']}\n\n"
            job_log = db.get_job_log(int(job["id"])) or {}
            for event in job_log.get("log_events", []):
                if event.get("type") == "compile_failed" and event.get("error") and event.get("error") != job.get("error_msg"):
                    yield f"data: {event['error']}\n\n"
                if event.get("type") == "compile_cancelled":
                    yield "data: cancelled by user\n\n"
                if event.get("type") != "compile_output":
                    continue
                for line in str(event.get("output") or "").splitlines():
                    yield f"data: {line}\n\n"
            yield f"event: exit\ndata: {exit_code}\n\n"

        if compile_job and compile_job["status"] == COMPILE_QUEUED:
            pos = db.count_compile_queued_before(compile_job["id"])
            async def queued_stream():
                while True:
                    yield "event: status\ndata: compile_queued\n\n"
                    yield f"event: queue_position\ndata: {pos}\n\n"
                    await asyncio.sleep(2)
                    current = db.get_job(compile_job["id"])
                    if not current or current["status"] not in (COMPILE_QUEUED, COMPILING):
                        if current:
                            async for chunk in compile_job_stream(current):
                                yield chunk
                        return
                    if current["status"] == COMPILING:
                        break
            async def combined_stream():
                async for chunk in queued_stream():
                    yield chunk
                async for chunk in compiler.stream_logs(esphome_name):
                    yield chunk
            return StreamingResponse(
                combined_stream(),
                media_type="text/event-stream",
                headers={"Cache-Control": "no-cache", "Connection": "keep-alive", "X-Accel-Buffering": "no"},
            )
        latest_compile = db.get_latest_compile_job_for_device(nm)
        if latest_compile and latest_compile["status"] in (COMPILE_SUCCESS, FAILED):
            return StreamingResponse(
                compile_job_stream(latest_compile),
                media_type="text/event-stream",
                headers={"Cache-Control": "no-cache", "Connection": "keep-alive", "X-Accel-Buffering": "no"},
            )
        return StreamingResponse(
            compiler.stream_logs(esphome_name),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "Connection": "keep-alive", "X-Accel-Buffering": "no"},
        )

    @app.post("/api/devices/{mac}/compile/cancel")
    async def compile_cancel(mac: str) -> dict[str, Any]:
        nm = normalize_mac(mac)
        job = db.active_job_for_device(nm)
        if not job or job["status"] not in (COMPILE_QUEUED, COMPILING):
            raise HTTPException(status_code=404, detail="no compile job found for this device")
        if job["status"] == COMPILE_QUEUED:
            db.abort_compile_queued_job(job["id"])
            compile_worker.wake()
            return {"cancelled": True, "job_id": job["id"], "mac": nm}
        if job["status"] == COMPILING:
            await compile_worker.cancel(job["id"])
            return {"cancelled": True, "job_id": job["id"], "mac": nm}
        raise HTTPException(status_code=404, detail="no compile job found for this device")

    # ── Secrets ──

    @app.get("/api/chips")
    async def chips_list() -> dict[str, Any]:
        """Supported chips and their ESPHome board mapping.

        The browser cannot detect a chip over Web Serial without flashing, so the
        wizard picks from this list. Serving it keeps the mapping in one place -
        duplicating CHIP_NAME_TO_BOARD in the UI would drift from the compiler.
        """
        return {
            "chips": [
                {
                    "chip_name": chip,
                    **info,
                    # Whether the scaffold can currently produce a config that
                    # compiles. ESP8266 remote firmware is not buildable yet: its
                    # receiver links ESPHome's ESP8266 OTA backend, which is only
                    # copied into the build tree when `ota:`/`network:`/`wifi:` are
                    # present, and the remote scaffold emits none of them. Marked
                    # so the wizard can say so instead of surfacing a raw
                    # "md5.h / ota_backend_esp8266.h: No such file" compiler error.
                    "buildable": not is_unbuildable_chip(chip, info),
                    "unbuildable_reason": UNBUILDABLE_CHIP_REASON.get(chip),
                }
                for chip, info in sorted(CHIP_NAME_TO_BOARD.items())
            ]
        }

    @app.get("/api/bridge/network-credentials")
    async def bridge_network_credentials() -> dict[str, Any]:
        """ESP-NOW credentials a new remote must share to join the network.

        secrets.yaml wins for both halves: the bridge firmware resolves
        `!secret espnow_network_id` / `espnow_psk` from there, so those are the values
        the bridge is actually running with. The bridges table carries a copy that can
        drift (or hold junk from a hand-created row), so it is only a fallback and any
        disagreement is reported rather than silently flashed onto a new remote - a
        mismatched pair produces a remote that can never join.
        """
        active = db.get_active_bridge() or {}
        bridge_network_id = str(active.get("network_id") or "").strip()

        network_id = _secret_from_secrets_yaml("espnow_network_id")
        network_id_source = "secrets.yaml"
        if not network_id:
            network_id = bridge_network_id
            network_id_source = "active bridge" if bridge_network_id else "missing"
        psk = _secret_from_secrets_yaml("espnow_psk")

        mismatch = bool(
            network_id
            and bridge_network_id
            and network_id.upper() != bridge_network_id.upper()
        )

        return {
            "network_id": network_id,
            "psk": psk,
            "bridge_name": active.get("name") or "",
            "bridge_uuid": active.get("uuid") or "",
            "network_id_source": network_id_source,
            "psk_source": "secrets.yaml" if psk else "missing",
            "complete": bool(network_id and psk),
            # The bridge's stored copy differs from what it is running with. Surfaced
            # so the UI can warn instead of handing out credentials that cannot join.
            "bridge_network_id": bridge_network_id,
            "mismatch": mismatch,
        }

    @app.get("/api/secrets")
    async def secrets_get() -> dict[str, Any]:
        return {"content": yaml_store.get_secrets()}

    @app.put("/api/secrets")
    async def secrets_save(body: dict[str, Any]) -> dict[str, Any]:
        content = str(body.get("content") or "")
        yaml_store.save_secrets(content)
        return {"content": content, "saved": True}

    @app.post("/api/secrets/check")
    async def secrets_check(body: dict[str, Any]) -> dict[str, Any]:
        content = str(body.get("content") or "")
        import re
        secret_refs = set(re.findall(r"!secret\s+(\w+)", content))
        if not secret_refs:
            return {"missing_secrets": []}
        secrets_content = yaml_store.get_secrets()
        defined_keys = set(re.findall(r"^\s*(\w+)\s*:", secrets_content, re.MULTILINE))
        missing = sorted(secret_refs - defined_keys)
        return {"missing_secrets": missing}

    # ── Container / Artifacts ──

    @app.get("/api/compile/container/status")
    async def container_status() -> dict[str, Any]:
        # ESPHome is provisioned lazily into a venv under the data dir, not baked
        # into the image, so the old /opt/esp-tree/venv check reported "Unavailable"
        # even when compiling worked fine. Report the same binary the compiler uses.
        esphome_bin = Path(compiler._esphome_bin())
        pinned = compiler._pinned_esphome_version()
        installed = compiler._installed_esphome_version()

        # The venv may exist on disk without a marker file (or vice versa) if a
        # bootstrap was interrupted, so treat either as evidence it is there.
        available = esphome_bin.exists() and esphome_bin.is_file()
        if available and not installed:
            installed = pinned

        error = None
        if not available:
            error = (
                "ESPHome is not installed yet — it is downloaded on first compile. "
                "Start a compile to install it."
            )

        return {
            "image": "lazy-venv",
            "available": available,
            "tag": installed or pinned or "",
            "error": error,
        }

    @app.delete("/api/compile/artifacts")
    async def clean_artifacts() -> dict[str, Any]:
        platformio_bytes, esphome_bytes = compiler.clean_artifacts()
        return {
            "ok": True,
            "platformio_cache_bytes": platformio_bytes,
            "esphome_build_bytes": esphome_bytes,
            "total_bytes": platformio_bytes + esphome_bytes,
        }

    @app.get("/api/compile/queue")
    async def compile_queue() -> dict[str, Any]:
        active = db.active_compile_job()
        if active:
            device = db.get_device(str(active.get("mac", "")))
            active = dict(active)
            active["device_label"] = (device or {}).get("label") or (device or {}).get("esphome_name") or str(active.get("mac", ""))
        queued = db.compile_queued_jobs()
        queued_enriched = []
        for job in queued:
            job_copy = dict(job)
            device = db.get_device(str(job.get("mac", "")))
            job_copy["device_label"] = (device or {}).get("label") or (device or {}).get("esphome_name") or str(job.get("mac", ""))
            queued_enriched.append(job_copy)
        return {
            "active_job": active,
            "queued_jobs": queued_enriched,
            "count": (1 if active else 0) + len(queued_enriched),
        }

    @app.post("/api/compile/queue/{job_id}/abort")
    async def compile_queue_abort(job_id: int) -> dict[str, Any]:
        job = db.get_job(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="job not found")
        if job["status"] != COMPILE_QUEUED:
            raise HTTPException(status_code=409, detail="job is not in compile_queued status")
        db.abort_compile_queued_job(job_id)
        compile_worker.wake()
        return {"ok": True, "job_id": job_id}

    @app.get("/api/serial/ports")
    async def serial_ports() -> dict[str, Any]:
        return {"ports": list_serial_ports()}

    @app.get("/api/devices/{mac}/flash/serial/status")
    async def flash_serial_status(mac: str) -> dict[str, Any]:
        device = db.get_device(mac)
        if not device:
            raise HTTPException(status_code=404, detail="device not found")
        esphome_name = str(device.get("esphome_name") or "")
        if not esphome_name:
            raise HTTPException(status_code=404, detail="device has no esphome_name associated")
        return compiler.serial_flash_status(esphome_name)

    @app.get("/api/devices/{mac}/flash/serial/logs")
    async def flash_serial_logs(mac: str) -> StreamingResponse:
        device = db.get_device(mac)
        if not device:
            raise HTTPException(status_code=404, detail="device not found")
        esphome_name = str(device.get("esphome_name") or "")
        if not esphome_name:
            raise HTTPException(status_code=404, detail="device has no esphome_name associated")
        return StreamingResponse(
            compiler.stream_serial_logs(esphome_name),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "Connection": "keep-alive", "X-Accel-Buffering": "no"},
        )

    @app.post("/api/devices/{mac}/flash/serial")
    async def flash_serial(mac: str, body: SerialFlashRequest) -> dict[str, Any]:
        port = body.port.strip()
        if not port:
            raise HTTPException(status_code=400, detail="port is required")
        device = db.get_device(mac)
        if not device:
            raise HTTPException(status_code=404, detail="device not found")
        esphome_name = str(device.get("esphome_name") or "")
        if not esphome_name:
            raise HTTPException(status_code=404, detail="device has no esphome_name associated")
        factory_path = yaml_store.get_factory_binary(esphome_name)
        if factory_path is None:
            raise HTTPException(status_code=404, detail="no compiled factory binary available")
        if not compiler.reserve_serial_flash():
            raise HTTPException(status_code=409, detail="another serial flash is already running")

        compiler._set_serial_status(esphome_name, "starting", port=port, error=None)
        asyncio.create_task(compiler.flash_serial(esphome_name, port), name=f"serial-flash-{esphome_name}")
        return {
            "started": True,
            "mac": normalize_mac(mac),
            "esphome_name": esphome_name,
            "port": port,
        }

    @app.post("/api/devices/{mac}/flash/serial/cancel")
    async def flash_serial_cancel(mac: str) -> dict[str, Any]:
        device = db.get_device(mac)
        if not device:
            raise HTTPException(status_code=404, detail="device not found")
        cancelled = await compiler.cancel_serial_flash()
        return {"cancelled": cancelled, "mac": normalize_mac(mac)}

    # ── Flash hand-off ──

    @app.post("/api/devices/{mac}/compile/start-flash")
    async def compile_start_flash(mac: str) -> dict[str, Any]:
        nm = normalize_mac(mac)
        job = db.active_job_for_device(nm)
        if not job:
            job = db.get_job_by_mac_and_status(nm, PENDING_CONFIRM)
        if not job:
            compile_job = db.get_latest_compile_job_for_device(nm)
            if not compile_job or compile_job["status"] != COMPILE_SUCCESS:
                raise HTTPException(status_code=404, detail="no pending, queued, or compiled OTA firmware for this device")
            firmware_path = str(compile_job.get("firmware_path") or "")
            if not firmware_path or not Path(firmware_path).exists():
                raise HTTPException(status_code=410, detail="compiled OTA firmware is no longer available")

            status = QUEUED if _flash_work_pending(db) else STARTING
            flash_job = db.create_job(
                {
                    "mac": nm,
                    "status": status,
                    "firmware_path": firmware_path,
                    "firmware_name": compile_job.get("firmware_name"),
                    "firmware_size": compile_job.get("firmware_size"),
                    "firmware_md5": compile_job.get("firmware_md5"),
                    "parsed_project_name": compile_job.get("parsed_project_name"),
                    "parsed_version": compile_job.get("parsed_version"),
                    "parsed_esphome_name": compile_job.get("parsed_esphome_name"),
                    "parsed_build_date": compile_job.get("parsed_build_date"),
                    "parsed_chip_name": compile_job.get("parsed_chip_name"),
                    "old_firmware_version": compile_job.get("old_firmware_version"),
                    "old_project_name": compile_job.get("old_project_name"),
                    "preflight_warnings": compile_job.get("preflight_warnings"),
                    "esphome_name": compile_job.get("esphome_name"),
                    "percent": 0,
                }
            )
            if status == QUEUED:
                queue_position = db.count_queued_before(int(flash_job["id"])) + 1
                db.append_job_event(int(flash_job["id"]), "flash_queued", position=queue_position, firmware_name=flash_job.get("firmware_name"), firmware_size=flash_job.get("firmware_size"))
                db.append_job_event(int(compile_job["id"]), "flash_job_created", flash_job_id=flash_job["id"], position=queue_position, firmware_name=flash_job.get("firmware_name"), firmware_size=flash_job.get("firmware_size"))
                ota_worker.wake()
                return {"job": db.get_job(int(flash_job["id"])), "queue_position": queue_position}
            db.update_job(int(flash_job["id"]), started_at=now_ts())
            db.append_job_event(int(flash_job["id"]), "flash_starting")
            db.append_job_event(int(compile_job["id"]), "flash_job_created", flash_job_id=flash_job["id"], firmware_name=flash_job.get("firmware_name"), firmware_size=flash_job.get("firmware_size"))
            ota_worker.wake()
            return {"job": db.get_job(int(flash_job["id"]))}
        if job["status"] == PENDING_CONFIRM:
            queued_jobs = db.queued_jobs()
            if _flash_work_pending(db, int(job["id"])):
                queue_order = len(queued_jobs)
                db.update_job(job["id"], status=QUEUED, queue_order=queue_order)
                db.append_job_event(job["id"], "flash_queued", position=queue_order + 1, firmware_name=job.get("firmware_name"), firmware_size=job.get("firmware_size"))
                ota_worker.wake()
                return {"job": db.get_job(job["id"]), "queue_position": queue_order + 1}
            db.update_job(job["id"], status=STARTING, percent=0, error_msg=None)
            db.append_job_event(job["id"], "flash_starting")
            ota_worker.wake()
            return {"job": db.get_job(job["id"])}
        if job["status"] == QUEUED:
            active = db.active_job()
            queue_position = db.count_queued_before(int(job["id"])) + 1
            if (active and int(active["id"]) != job["id"]) or queue_position > 1:
                return {"job": job, "queue_position": queue_position}
            db.update_job(job["id"], status=STARTING, percent=0, error_msg=None, started_at=now_ts())
            db.append_job_event(job["id"], "flash_starting")
            ota_worker.wake()
            return {"job": db.get_job(job["id"])}
        if job["status"] in (STARTING, ANNOUNCING, TRANSFERRING, VERIFYING, WAITING_REJOIN):
            return {"job": job}
        raise HTTPException(status_code=409, detail=f"job status is {job['status']}, not awaiting flash")


    @app.get("/api/integration/activity")
    async def integration_activity(request: Request) -> StreamingResponse:
        share_log_path = Path("/share/esp_tree/activity.log")
        share_dir = share_log_path.parent
        if not share_dir.exists():
            share_dir.mkdir(parents=True, exist_ok=True)
        if not share_log_path.exists():
            share_log_path.touch()
        logger.info("integration_activity: checking path=%s exists=%s", share_log_path, share_log_path.exists())

        async def event_generator() -> AsyncGenerator[str, None]:
            conn_id = uuid.uuid4().hex
            pos_key = f"activity_{conn_id}"
            chunk_size = 64 * 1024
            activity_positions: dict[str, int | None] = getattr(request.app.state, "_activity_positions", {})
            logger.info("integration_activity: generator started conn_id=%s", conn_id)

            yield "event: line\ndata: START\n\n"

            try:
                if not share_log_path.exists():
                    logger.warning("integration_activity: log file not found at %s", share_log_path)
                    yield "event: error\ndata: log file not found\n\n"
                    return

                file_size = share_log_path.stat().st_size
                logger.info("integration_activity: file size=%d", file_size)

                if file_size <= chunk_size:
                    content = await asyncio.to_thread(share_log_path.read_text, encoding="utf-8")
                    lines = content.splitlines()
                else:
                    lines = await asyncio.to_thread(_read_last_lines_backward, share_log_path, chunk_size)
                activity_positions[pos_key] = file_size
                logger.info("integration_activity: sending %d lines", len([l for l in lines if l.strip()]))
                for line in lines:
                    if line.strip():
                        yield f"event: line\ndata: {line}\n\n"
                logger.info("integration_activity: initial send complete, entering loop")

                while True:
                    await asyncio.sleep(1)
                    try:
                        current_size = share_log_path.stat().st_size
                        prev_pos = activity_positions.get(pos_key) or 0
                        if current_size < prev_pos:
                            prev_pos = 0
                        if current_size > prev_pos:
                            read_from = prev_pos
                            new_content = await asyncio.to_thread(
                                lambda p=read_from: share_log_path.read_text(encoding="utf-8")[p:]
                            )
                            activity_positions[pos_key] = current_size
                            logger.info("integration_activity: read %d bytes from pos %d", len(new_content), read_from)
                            for line in new_content.splitlines():
                                if line.strip():
                                    yield f"event: line\ndata: {line}\n\n"
                    except asyncio.CancelledError:
                        raise
                    except Exception as exc:
                        logger.debug("integration_activity: read error=%s", exc)

            except asyncio.CancelledError:
                logger.info("integration_activity: client disconnected conn_id=%s", conn_id)
                raise
            except Exception as exc:
                logger.error("integration_activity: error=%s type=%s", exc, type(exc).__name__, exc_info=True)
                yield f"event: error\ndata: {exc}\n\n"
            finally:
                activity_positions.pop(pos_key, None)

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )

    def _read_last_lines_backward(path: Path, chunk_size: int = 65536) -> list[str]:
        lines: list[str] = []
        with open(path, "rb") as f:
            f.seek(0, 2)
            file_size = f.tell()
            remain = file_size
            while remain > 0:
                seek_pos = max(0, f.tell() - chunk_size)
                f.seek(seek_pos)
                chunk = f.read(chunk_size)
                remain = seek_pos
                chunk_lines = chunk.decode("utf-8", errors="replace").splitlines()
                if not chunk_lines:
                    continue
                if remain > 0:
                    chunk_lines = chunk_lines[1:]
                lines = chunk_lines + lines
                if seek_pos == 0:
                    break
                f.seek(seek_pos)
        return lines

    @app.get("/api/devices/{mac}/firmware/download")
    async def factory_binary_download(mac: str) -> FileResponse:
        device = db.get_device(mac)
        if not device:
            raise HTTPException(status_code=404, detail="device not found")
        esphome_name = str(device.get("esphome_name") or "")
        if not esphome_name:
            raise HTTPException(status_code=404, detail="device has no esphome_name associated")
        factory_path = yaml_store.get_factory_binary(esphome_name)
        if factory_path is None:
            raise HTTPException(status_code=404, detail="no compiled factory binary available")
        return FileResponse(
            factory_path,
            media_type="application/octet-stream",
            filename=f"{esphome_name}.factory.bin",
        )

    @app.get("/api/devices/{mac}/compile/firmware/download")
    async def compile_firmware_download(mac: str) -> FileResponse:
        nm = normalize_mac(mac)
        compile_job = db.get_latest_compile_job_for_device(nm)
        if not compile_job or compile_job["status"] != COMPILE_SUCCESS:
            raise HTTPException(status_code=404, detail="no successful compile job found")
        firmware_path = str(compile_job.get("firmware_path") or "")
        if not firmware_path or not Path(firmware_path).exists():
            raise HTTPException(status_code=404, detail="compiled firmware file no longer available")
        esphome_name = str(compile_job.get("esphome_name") or "")
        return FileResponse(
            firmware_path,
            media_type="application/octet-stream",
            filename=f"{esphome_name}.ota.bin",
        )

    @app.get("/api/jobs/{job_id}/firmware/download")
    async def job_firmware_download(job_id: int) -> FileResponse:
        job = db.get_job(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="job not found")
        firmware_path = str(job.get("firmware_path") or "")
        if not firmware_path or not Path(firmware_path).exists():
            raise HTTPException(status_code=404, detail="firmware file no longer available")
        firmware_name = job.get("firmware_name") or "firmware.bin"
        return FileResponse(
            firmware_path,
            media_type="application/octet-stream",
            filename=firmware_name,
        )

    _mount_static(app, settings.static_dir)
    return app


def _mount_static(app: FastAPI, static_dir: Path) -> None:
    assets_dir = static_dir / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    def _serve_index(request: Request) -> HTMLResponse:
        if getattr(app.state, "cleanup_required", False):
            return HTMLResponse(CLEANUP_PAGE_HTML)
        index_path = static_dir / "index.html"
        if not index_path.exists():
            return HTMLResponse("<!doctype html><title>ESP Tree</title><p>Frontend build is missing.</p>", status_code=503)
        content = index_path.read_text(encoding="utf-8")
        ingress_path = (request.headers.get("x-ingress-path") or "").rstrip("/")
        if ingress_path:
            content = content.replace(
                '<meta name="x-ingress-path" content="" />',
                f'<meta name="x-ingress-path" content="{ingress_path}" />',
            )
        return HTMLResponse(content)

    @app.get("/", response_class=HTMLResponse)
    async def index(request: Request):
        return _serve_index(request)

    @app.get("/{path:path}")
    async def spa_fallback(path: str, request: Request):
        candidate = (static_dir / path).resolve()
        if static_dir.exists() and static_dir.resolve() in candidate.parents and candidate.exists() and candidate.is_file():
            return FileResponse(candidate, media_type=mimetypes.guess_type(candidate.name)[0])
        return _serve_index(request)
