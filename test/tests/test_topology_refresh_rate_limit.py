"""The empty-topology refresh must be rate-limited.

topology() is called by the UI's 3s poll and by many endpoints. Its
"empty but connected -> request a refresh" retry had no spacing, so a bridge
that legitimately has no remotes paired (or a wedged session) got a continuous
stream of refreshes. On the serial transport each refresh is a full HMAC
handshake on the UART, so this became a handshake storm -- observed as a
client_hello/challenge exchange every ~3s.

These tests pin the spacing so the retry stays a recovery mechanism rather than
a polling loop.
"""
from __future__ import annotations

import asyncio
from unittest.mock import AsyncMock

import pytest

pytest.importorskip("google.protobuf")

from app.bridge_v2_client import MIN_REFRESH_INTERVAL_S, BridgeV2Manager  # noqa: E402


def _manager(client) -> BridgeV2Manager:
    """A manager holding one client with an empty topology."""
    mgr = BridgeV2Manager.__new__(BridgeV2Manager)
    mgr._clients = {"bridge-uuid": client}
    mgr._topology_nodes = {}
    mgr._device_id_map = {}
    mgr._last_refresh_attempt = None
    return mgr


def _connected_client() -> AsyncMock:
    client = AsyncMock()
    client.connected = True
    return client


def test_first_empty_topology_call_refreshes(monkeypatch) -> None:
    """The initial recovery attempt must still happen."""
    client = _connected_client()
    mgr = _manager(client)

    async def run() -> None:
        await mgr.topology()

    # Skip the post-refresh settle sleep; it is not what this test is pinning.
    monkeypatch.setattr(asyncio, "sleep", AsyncMock())
    asyncio.run(run())

    client.refresh_snapshot.assert_awaited_once()


def test_immediate_second_call_does_not_refresh(monkeypatch) -> None:
    """The regression: the UI polls every 3s, so a second call must not refresh."""
    client = _connected_client()
    mgr = _manager(client)
    monkeypatch.setattr(asyncio, "sleep", AsyncMock())

    async def run() -> None:
        await mgr.topology()
        await mgr.topology()
        await mgr.topology()

    asyncio.run(run())

    assert client.refresh_snapshot.await_count == 1, (
        "an unsuppressed retry turns an empty topology into a handshake storm"
    )


def test_refresh_attempts_resume_after_the_interval(monkeypatch) -> None:
    """Once the interval elapses the retry comes back -- it is a recovery path, not a latch."""
    client = _connected_client()
    mgr = _manager(client)
    clock = {"t": 1000.0}
    monkeypatch.setattr(asyncio, "sleep", AsyncMock())

    def fake_monotonic() -> float:
        return clock["t"]

    monkeypatch.setattr("app.bridge_v2_client.time.monotonic", fake_monotonic)

    async def run() -> None:
        await mgr.topology()
        clock["t"] += MIN_REFRESH_INTERVAL_S / 2
        await mgr.topology()
        clock["t"] += MIN_REFRESH_INTERVAL_S
        await mgr.topology()

    asyncio.run(run())

    assert client.refresh_snapshot.await_count == 2, (
        "the retry must resume after the interval, otherwise a bridge that was "
        "restarted with no remotes never recovers its topology"
    )


def test_no_refresh_when_the_bridge_is_disconnected(monkeypatch) -> None:
    """A disconnected bridge is not asked for a snapshot at all."""
    client = _connected_client()
    client.connected = False
    mgr = _manager(client)
    monkeypatch.setattr(asyncio, "sleep", AsyncMock())

    async def run() -> None:
        await mgr.topology()

    asyncio.run(run())

    client.refresh_snapshot.assert_not_awaited()
