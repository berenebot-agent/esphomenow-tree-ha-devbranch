"""Snapshot refresh must work on every bridge transport, not just WebSocket.

Regression for a real failure on the serial bridge:

    POST /api/devices/F4:2D:C9:58:33:10/rediscover
    -> 503 {"detail": "bridge unavailable: 'SerialBridgeClient' object has no
       attribute '_send'"}

`BridgeV2Manager.refresh_once` reached into `client._send(...)`, a private
method that only `BridgeV2Client` defines. `SerialBridgeClient` sends through
`_send_async`/`_send_envelope_sync` instead, so the refresh blew up with
AttributeError.

It stayed hidden because `topology()` only refreshes when the node list is empty,
so it took a state where the topology had drained -- removing a remote's config entry
to test rediscovery did it.

The fix: a public `refresh_snapshot()` on each client, called through
`getattr(client, "refresh_snapshot", None)`.
"""
from __future__ import annotations

import asyncio
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock

import pytest

pytest.importorskip("google.protobuf")

from app.bridge_v2_client import BridgeV2Manager  # noqa: E402

APP_DIR = Path(__file__).resolve().parents[2] / "app"


def _manager_with(client) -> BridgeV2Manager:
    """A manager holding one client, without running __init__."""
    mgr = BridgeV2Manager.__new__(BridgeV2Manager)
    mgr._clients = {"bridge-uuid": client}
    return mgr


def test_refresh_once_uses_the_public_method_on_a_serial_like_client():
    """The regression: a client with only refresh_snapshot() (no `_send`) must work.

    This mirrors SerialBridgeClient's shape -- notably it has NO `_send` attribute,
    which is what made the old implementation raise AttributeError.
    """
    client = MagicMock(spec=["connected", "refresh_snapshot"])
    client.connected = True
    client.refresh_snapshot = AsyncMock()

    asyncio.run(_manager_with(client).refresh_once())

    client.refresh_snapshot.assert_awaited_once()


def test_refresh_once_does_not_require_private_send():
    """It must not depend on a private `_send` -- that is the defect being fixed.

    `spec` omits `_send`, so any attempt to use it raises AttributeError instead of
    silently passing on a MagicMock.
    """
    client = MagicMock(spec=["connected", "refresh_snapshot"])
    client.connected = True
    client.refresh_snapshot = AsyncMock()

    asyncio.run(_manager_with(client).refresh_once())  # must not raise

    assert not hasattr(client, "_send")


def test_refresh_once_skips_disconnected_clients():
    """An offline bridge must not be asked for a snapshot."""
    client = MagicMock(spec=["connected", "refresh_snapshot"])
    client.connected = False
    client.refresh_snapshot = AsyncMock()

    asyncio.run(_manager_with(client).refresh_once())

    client.refresh_snapshot.assert_not_awaited()


def test_refresh_once_tolerates_a_client_without_the_method():
    """A client lacking refresh_snapshot is skipped, not an AttributeError.

    The manager fans out over heterogeneous transports, so one client missing an
    optional capability must not break the whole refresh.
    """
    client = MagicMock(spec=["connected"])
    client.connected = True

    asyncio.run(_manager_with(client).refresh_once())  # must not raise


def test_both_transports_expose_refresh_snapshot():
    """Both client classes must define the shared method, or one transport silently lags.

    Checked by reading source because importing the serial client needs pyserial/cobs,
    which the unit image does not carry.
    """
    for filename in ("bridge_v2_client.py", "bridge_serial_client.py"):
        src = (APP_DIR / filename).read_text()
        assert "async def refresh_snapshot" in src, f"{filename} is missing refresh_snapshot()"
