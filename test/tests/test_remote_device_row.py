"""A remote that joins after connect must get a device row.

Regression for the inverted-topology bug: `upsert_devices_from_topology` was only
called from the `full_snapshot` path, so a remote that joined LATER (arriving as
`remote_schema_changed` / `remote_metadata_changed` -> `_handle_remote_snapshot`)
never got a `devices` row. `/api/devices` then held only the bridge, and the UI
rendered no card for a remote that was genuinely online, while long-dead remotes
restored from the integration store still rendered. A joined remote looked absent
and an absent one looked present.

The test drives the real handler with a minimal protobuf RemoteSnapshot and asserts
the node reached the database via the same upsert the snapshot path uses.
"""
from __future__ import annotations

import asyncio
from pathlib import Path

import pytest

from app.bridge_v2_client import BridgeV2Manager
from app.db import Database

pb = pytest.importorskip(
    "app.protobuf.generated.esp_tree_runtime_pb2", reason="generated protobuf not present"
)


class _FakeClient:
    """Just enough of a bridge client for the handler's bookkeeping."""

    def __init__(self, bridge_uuid: str, name: str = "esptree-bridge-serial"):
        self.bridge_uuid = bridge_uuid
        self.bridge_mac = ""
        self.target = type("T", (), {"name": name, "host": "socket://test", "serial_port": "socket://test"})()


def _remote_snapshot(mac: str, name: str):
    snap = pb.RemoteSnapshot()
    snap.identity.remote_mac = mac
    snap.identity.esphome_name = name
    snap.identity.friendly_name = name
    snap.identity.chip_name = "ESP32-C3"
    snap.runtime.online = True
    snap.runtime.hops_to_bridge = 1
    return snap


@pytest.fixture()
def manager(tmp_path):
    db = Database(Path(tmp_path) / "esp_tree.db")
    db.init()
    mgr = BridgeV2Manager(db)
    return mgr, db


def test_late_joining_remote_is_persisted(manager):
    """The handler for a post-connect join must write a device row."""
    mgr, db = manager
    client = _FakeClient("uuid-1")

    assert db.list_devices() == [], "precondition: nothing persisted yet"

    # The handler dispatches its DB write with asyncio.ensure_future(to_thread(...)),
    # so it must run with a live loop (as it does in the app) and be given a moment
    # for the worker thread to commit.
    async def drive():
        mgr._handle_remote_snapshot(
            client, _remote_snapshot("F4:2D:C9:58:33:10", "espnow-remote"), "D0:CF:13:EB:81:28"
        )
        for _ in range(100):
            if db.list_devices():
                return
            await asyncio.sleep(0.05)

    asyncio.run(drive())

    rows = db.list_devices()
    assert len(rows) == 1, f"expected the joined remote to be persisted, got {rows}"
    row = rows[0]
    assert row["mac"] == "F4:2D:C9:58:33:10"
    assert row["esphome_name"] == "espnow-remote"
    assert row["chip_name"] == "ESP32-C3"
    assert row["hops"] == 1
    assert row["last_seen_online"], "an online remote must record last_seen_online"


def test_remote_node_shape_is_upsertable(manager):
    """The node built for a remote must produce a node_key the DB accepts.

    A remote with no `esphome_name` must still yield a usable key (MAC-derived),
    which is exactly the branch that silently produced nothing before.
    """
    mgr, db = manager
    client = _FakeClient("uuid-2")
    snap = _remote_snapshot("AA:BB:CC:DD:EE:FF", "")
    node = mgr._remote_node(snap, "D0:CF:13:EB:81:28")
    from app.models import node_key_from_topology

    key = node_key_from_topology(node)
    assert key, "node_key must never be empty"
    assert ":" not in key
