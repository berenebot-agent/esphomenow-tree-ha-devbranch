from __future__ import annotations

from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock
import asyncio

import pytest

from app import models


def test_ha_config_flow_rest_payloads_match_core_contract() -> None:
    from app.ha_config_flow import configure_flow_payload, start_flow_payload

    config = {"addon_url": "http://127.0.0.1:8099", "integration_token": "secret"}
    assert start_flow_payload("esp_tree") == {"handler": "esp_tree"}
    assert configure_flow_payload(config) == config
    assert configure_flow_payload(None) == {}


@pytest.mark.asyncio
async def test_serial_auth_does_not_accept_snapshot_as_authentication(monkeypatch) -> None:
    from app import bridge_serial_client as serial_client
    from app.models import BridgeTarget
    from app.protobuf.generated import esp_tree_runtime_pb2 as pb

    client = serial_client.SerialBridgeClient(
        "bridge-1", BridgeTarget(host="", transport="serial", serial_port="/dev/null", api_key="key"),
        on_frame=AsyncMock(), on_connection_change=AsyncMock(),
    )
    client._loop = asyncio.get_running_loop()
    challenge_future = client._loop.create_future()
    client._auth_challenge_future = challenge_future
    snapshot = pb.Envelope(full_snapshot=pb.FullSnapshot())
    client._on_raw_frame(snapshot.SerializeToString())
    await asyncio.sleep(0)
    assert client.connected is False
    assert not challenge_future.done()


def test_serial_auth_buffers_snapshot_until_auth_ok() -> None:
    from app import bridge_serial_client as serial_client
    from app.models import BridgeTarget
    from app.protobuf.generated import esp_tree_runtime_pb2 as pb

    client = serial_client.SerialBridgeClient(
        "bridge-1", BridgeTarget(host="", transport="serial", serial_port="/dev/null", api_key="key"),
        on_frame=AsyncMock(), on_connection_change=AsyncMock(),
    )
    client._loop = asyncio.new_event_loop()
    client._auth_ok_future = client._loop.create_future()
    snapshot = pb.Envelope(full_snapshot=pb.FullSnapshot())
    client._on_raw_frame(snapshot.SerializeToString())
    client._loop.run_until_complete(asyncio.sleep(0))
    assert len(client._auth_pending_frames) == 1
    assert not client.connected
    client._loop.close()


def test_announcing_is_active_flash_status() -> None:
    assert models.ANNOUNCING in models.ACTIVE_STATUSES
    assert models.ANNOUNCING in models.FLASH_STATUSES
    assert not models.is_terminal(models.ANNOUNCING)


@pytest.mark.asyncio
async def test_v2_ota_client_splits_batches_and_uses_crc(tmp_path: Path) -> None:
    from app.bridge_v2_ota import BridgeV2OTAClient

    firmware = tmp_path / "firmware.bin"
    firmware.write_bytes(b"abcdefghi")

    class FakeClient:
        def __init__(self) -> None:
            self.batches = []

        async def send_ota_chunk_batch(self, job_id, response_request_id, chunks):
            self.batches.append((job_id, response_request_id, chunks))

    fake = FakeClient()
    ota = BridgeV2OTAClient(fake)
    ota.job_id = "b7f1"
    ota.max_chunk_size = 3
    ota.total_chunks = 3
    ota.max_chunks_per_batch = 2

    await ota.send_chunks("chunk-1", [0, 1, 2], firmware)

    assert len(fake.batches) == 2
    assert [chunk.sequence for chunk in fake.batches[0][2]] == [0, 1]
    assert [chunk.sequence for chunk in fake.batches[1][2]] == [2]
    assert fake.batches[1][2][0].flags & 0x0001
    assert fake.batches[0][2][0].payload == b"abc"
    assert fake.batches[0][2][0].crc32 == 0x352441C2


def test_manager_routes_ota_client_by_remote_mac() -> None:
    from app.bridge_v2_client import BridgeV2Manager, RemoteRoute

    manager = BridgeV2Manager(db=None)
    manager._routes["AA:BB:CC:DD:EE:FF"] = RemoteRoute(
        bridge_uuid="bridge-1",
        bridge_mac="11:22:33:44:55:66",
        remote_mac="AA:BB:CC:DD:EE:FF",
    )

    class FakeClient:
        connected = True

    fake = FakeClient()
    manager._clients["bridge-1"] = fake

    assert manager.ota_client_for_remote("AA:BB:CC:DD:EE:FF")._client is fake


@pytest.mark.asyncio
async def test_manager_tracks_live_integration_hello() -> None:
    from app.bridge_v2_client import BridgeV2Manager
    from app.protobuf.generated import esp_tree_runtime_pb2 as pb

    manager = BridgeV2Manager(db=None)
    q = manager.add_integration_client()

    response = await manager.handle_integration_frame(
        pb.Envelope(
            request_id="hello-1",
            client_hello=pb.ClientHello(
                request_full_snapshot=True,
                integration_version="0.2.171",
            ),
        ).SerializeToString(),
        q,
    )

    env = pb.Envelope()
    env.ParseFromString(response)
    status = manager.integration_status()
    assert env.WhichOneof("msg") == "auth_ok"
    assert status["connected"] is True
    assert status["connected_count"] == 1
    assert status["integration_version"] == "0.2.171"
    assert status["hello_received"] is True

    manager.remove_integration_client(q)
    assert manager.integration_status()["connected"] is False


def test_restart_decision_live_version_wins_over_marker() -> None:
    from app.restart_status import integration_restart_decision

    decision = integration_restart_decision(
        {"live_connected": True, "live_version": "0.2.171", "installed": True},
        "0.2.171",
        {"integration_version": "0.2.171", "reason": "custom_component_updated"},
        True,
    )

    assert decision["required"] is False
    assert decision["clear_marker"] is True


def test_restart_decision_live_old_version_requires_restart() -> None:
    from app.restart_status import integration_restart_decision

    decision = integration_restart_decision(
        {"live_connected": True, "live_version": "0.2.170", "installed": True},
        "0.2.171",
        {},
        False,
    )

    assert decision["required"] is True
    assert decision["reason"] == "integration_version_mismatch"


def test_restart_decision_no_live_uses_marker() -> None:
    from app.restart_status import integration_restart_decision

    decision = integration_restart_decision(
        {"live_connected": False, "installed": True},
        "0.2.171",
        {"integration_version": "0.2.171", "reason": "custom_component_updated"},
        True,
    )

    assert decision["required"] is True
    assert decision["source"] == "marker"


def test_flash_work_pending_detects_queued_jobs(tmp_path: Path) -> None:
    from app.db import Database
    from app.server import _flash_work_pending

    db = Database(tmp_path / "esp_tree.db")
    db.init()
    assert not _flash_work_pending(db)

    queued = db.create_job(
        {
            "mac": "AA:BB:CC:DD:EE:01",
            "status": models.QUEUED,
            "firmware_path": str(tmp_path / "first.bin"),
        }
    )

    assert _flash_work_pending(db)
    assert _flash_work_pending(db, int(queued["id"]))


@pytest.mark.asyncio
async def test_ota_worker_handles_waiting_rejoin_status(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    import sys
    from types import ModuleType

    fastapi_stub = ModuleType("fastapi")
    fastapi_stub.UploadFile = object  # type: ignore[attr-defined]
    sys.modules.setdefault("fastapi", fastapi_stub)

    from app.db import Database
    from app.ota_worker import OTAWorker

    db = Database(tmp_path / "esp_tree.db")
    db.init()

    class DummyFirmwareStore:
        def retain(self, path, job_id):
            return path, None

        def delete_file(self, path):
            return None

    firmware_store = DummyFirmwareStore()

    worker = OTAWorker(
        db=db,
        firmware_store=firmware_store,
        rejoin_timeout_s=1,
        transfer_timeout_s=1,
        bridge_manager=SimpleNamespace(),
    )
    job = db.create_job(
        {
            "mac": "AA:BB:CC:DD:EE:FF",
            "status": models.WAITING_REJOIN,
        }
    )
    called = {}

    async def fake_wait_for_rejoin(rejoin_job, **kwargs):
        called["job_id"] = rejoin_job["id"]
        called["kwargs"] = kwargs

    monkeypatch.setattr(worker, "_wait_for_rejoin", fake_wait_for_rejoin)

    await worker._process(job)

    assert called["job_id"] == job["id"]
    assert called["kwargs"] == {}


@pytest.mark.asyncio
async def test_ota_worker_wait_for_rejoin_succeeds_on_uptime_reset(tmp_path: Path) -> None:
    import sys
    from types import ModuleType

    fastapi_stub = ModuleType("fastapi")
    fastapi_stub.UploadFile = object  # type: ignore[attr-defined]
    sys.modules.setdefault("fastapi", fastapi_stub)

    from app.db import Database
    from app.ota_worker import OTAWorker

    db = Database(tmp_path / "esp_tree.db")
    db.init()

    class DummyFirmwareStore:
        def retain(self, path, job_id):
            return path, None

        def delete_file(self, path):
            return None

    firmware_store = DummyFirmwareStore()

    firmware = tmp_path / "remote.ota.bin"
    firmware.write_bytes(b"updated firmware")

    class FakeBridgeManager:
        def __init__(self) -> None:
            self.calls = 0

        async def topology(self):
            self.calls += 1
            return [
                {
                    "mac": "AA:BB:CC:DD:EE:FF",
                    "online": True,
                    "session_id": "new-session",
                    "uptime_s": 2,
                    "firmware_md5": "new-md5",
                }
            ]

        async def refresh_once(self):
            return None

    worker = OTAWorker(
        db=db,
        firmware_store=firmware_store,
        rejoin_timeout_s=1,
        transfer_timeout_s=1,
        bridge_manager=FakeBridgeManager(),
    )
    job = db.create_job(
        {
            "mac": "AA:BB:CC:DD:EE:FF",
            "status": models.WAITING_REJOIN,
            "firmware_path": str(firmware),
            "firmware_md5": "new-md5",
        }
    )

    await worker._wait_for_rejoin(
        job,
        initial_uptime_s=100,
    )

    completed = db.get_job(job["id"])
    assert completed is not None
    assert completed["status"] == models.SUCCESS


@pytest.mark.asyncio
async def test_compile_auto_flash_creates_queued_flash_job(tmp_path: Path) -> None:
    from app.compile_store import CompileStore
    from app.compile_worker import CompileWorker
    from app.compiler import CompileResult
    from app.db import Database
    from app.firmware_store import FirmwareStore
    from app.ota_worker import OTAWorker

    db = Database(tmp_path / "esp_tree.db")
    db.init()
    firmware_store = FirmwareStore(tmp_path / "firmware", retention_days=1)
    firmware_store.init()

    firmware = tmp_path / "remote.ota.bin"
    image = bytearray(64)
    image[0] = 0xE9
    image[12:14] = (0x0017).to_bytes(2, "little")
    firmware.write_bytes(image)

    class FakeCompiler:
        def __init__(self) -> None:
            self.compile_store = CompileStore(tmp_path / "devices")

        async def compile(self, esphome_name: str) -> CompileResult:
            return CompileResult(success=True, esphome_name=esphome_name, ota_bin_path=str(firmware))

    class FakeBridgeManager:
        async def topology(self):
            return [
                {
                    "mac": "AA:BB:CC:DD:EE:FF",
                    "online": True,
                    "esphome_name": "remote",
                    "firmware_md5": "old",
                    "chip_name": "ESP32-C5",
                }
            ]

    class FakeYamlStore:
        root = tmp_path / "devices"

        def has_config(self, esphome_name: str) -> bool:
            return esphome_name == "remote"

    ota_worker = OTAWorker(db, firmware_store, 1, 1, bridge_manager=FakeBridgeManager())
    worker = CompileWorker(
        db=db,
        compiler=FakeCompiler(),
        bridge_manager=FakeBridgeManager(),
        firmware_store=firmware_store,
        yaml_store=FakeYamlStore(),
        settings=SimpleNamespace(firmware_dir=tmp_path / "firmware"),
        ota_worker=ota_worker,
    )
    compile_job = db.create_job(
        {
            "mac": "AA:BB:CC:DD:EE:FF",
            "status": models.COMPILING,
            "esphome_name": "remote",
            "firmware_name": "remote.ota.bin",
            "auto_flash": 1,
        }
    )

    await worker._process(compile_job)

    completed_compile = db.get_job(compile_job["id"])
    flash_jobs = db.queued_jobs()
    assert completed_compile is not None
    assert completed_compile["status"] == models.COMPILE_SUCCESS
    assert len(flash_jobs) == 1
    flash_job = flash_jobs[0]
    assert flash_job["mac"] == "AA:BB:CC:DD:EE:FF"
    assert flash_job["firmware_path"]
    assert Path(flash_job["firmware_path"]).exists()
    assert flash_job["firmware_name"] == completed_compile["firmware_name"]
    assert flash_job["parsed_esphome_name"] == completed_compile["parsed_esphome_name"]
    assert flash_job["parsed_build_date"] == completed_compile["parsed_build_date"]
    assert flash_job["parsed_chip_name"] == completed_compile["parsed_chip_name"]
    assert flash_job["old_firmware_version"] == completed_compile["old_firmware_version"]
    assert flash_job["old_project_name"] == completed_compile["old_project_name"]
    assert flash_job["preflight_warnings"] == completed_compile["preflight_warnings"]


@pytest.mark.asyncio
async def test_compile_worker_size_md5_consistency(tmp_path: Path) -> None:
    """Verify firmware_size and firmware_md5 come from the same file after compile.

    Ensures the MD5 and size stored in the DB match the actual binary on disk.
    """
    import hashlib
    from app.bin_parser import APP_DESC_MAGIC
    from app.compile_store import CompileStore
    from app.compile_worker import CompileWorker
    from app.compiler import CompileResult
    from app.db import Database
    from app.firmware_store import FirmwareStore
    from app.ota_worker import OTAWorker

    db = Database(tmp_path / "esp_tree.db")
    db.init()
    firmware_store = FirmwareStore(tmp_path / "firmware", retention_days=1)
    firmware_store.init()

    firmware = tmp_path / "remote.ota.bin"
    image = bytearray(256)
    image[0] = 0xE9
    image[12:14] = (0x0017).to_bytes(2, "little")
    magic_pos = 32
    image[magic_pos:magic_pos + 4] = APP_DESC_MAGIC
    firmware.write_bytes(bytes(image))

    class FakeCompiler:
        def __init__(self) -> None:
            self.compile_store = CompileStore(tmp_path / "devices")

        async def compile(self, esphome_name: str) -> CompileResult:
            return CompileResult(success=True, esphome_name=esphome_name, ota_bin_path=str(firmware))

    class FakeBridgeManager:
        async def topology(self):
            return [
                {
                    "mac": "AA:BB:CC:DD:EE:FF",
                    "online": True,
                    "esphome_name": "remote",
                    "firmware_md5": "old",
                    "chip_name": "ESP32-C5",
                }
            ]

    class FakeYamlStore:
        root = tmp_path / "devices"

        def has_config(self, esphome_name: str) -> bool:
            return esphome_name == "remote"

    ota_worker = OTAWorker(db, firmware_store, 1, 1, bridge_manager=FakeBridgeManager())
    worker = CompileWorker(
        db=db,
        compiler=FakeCompiler(),
        bridge_manager=FakeBridgeManager(),
        firmware_store=firmware_store,
        yaml_store=FakeYamlStore(),
        settings=SimpleNamespace(firmware_dir=tmp_path / "firmware"),
        ota_worker=ota_worker,
    )
    compile_job = db.create_job(
        {
            "mac": "AA:BB:CC:DD:EE:FF",
            "status": models.COMPILING,
            "esphome_name": "remote",
            "firmware_name": "remote.ota.bin",
            "auto_flash": 0,
        }
    )

    await worker._process(compile_job)

    completed = db.get_job(compile_job["id"])
    assert completed is not None
    assert completed["status"] == models.COMPILE_SUCCESS

    active_path = Path(completed["firmware_path"])
    active_md5 = hashlib.md5(active_path.read_bytes()).hexdigest()
    active_size = active_path.stat().st_size

    assert completed["firmware_size"] == active_size, \
        f"firmware_size ({completed['firmware_size']}) should match active_path size ({active_size})"
    assert completed["firmware_md5"] == active_md5, \
        f"firmware_md5 ({completed['firmware_md5'][:8]}...) should match active_path MD5 ({active_md5[:8]}...)"
