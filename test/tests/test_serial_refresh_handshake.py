"""A serial refresh must request a clean session reconnect, never a bare ClientHello.

Regression from live UART traffic: refresh_snapshot() sent a bare ClientHello,
which the bridge treats as a new session and answers with an auth_challenge. With
no challenge future registered the add-on dropped it. The bridge sat in
CHALLENGE_SENT and answered pings with challenges instead of Pongs or snapshots;
topology (including the bridge's own row) vanished until a manual reconnect.

The safe recovery is to close the serial/TCP session and let the normal reconnect
loop perform its full HMAC handshake. This test pins that behavior.
"""
from __future__ import annotations

import asyncio
from unittest.mock import AsyncMock

import pytest

pytest.importorskip("google.protobuf")

from app import bridge_serial_client as serial_client  # noqa: E402
from app.models import BridgeTarget  # noqa: E402


def _client() -> serial_client.SerialBridgeClient:
    return serial_client.SerialBridgeClient(
        "bridge-1",
        BridgeTarget(host="", transport="serial", serial_port="/dev/null", api_key="test-api-key"),
        on_frame=AsyncMock(),
        on_connection_change=AsyncMock(),
    )


@pytest.mark.asyncio
async def test_refresh_schedules_normal_reconnect_instead_of_sending_client_hello() -> None:
    client = _client()
    client._schedule_reconnect = lambda: client._stop_event.set()  # type: ignore[method-assign]
    send = AsyncMock(side_effect=AssertionError("refresh must not send on the live session"))
    client._send_async = send  # type: ignore[method-assign]

    await client.refresh_snapshot()

    assert client._stop_event.is_set(), "refresh should end the live session cleanly"
    send.assert_not_awaited()


@pytest.mark.asyncio
async def test_refresh_does_not_open_a_second_reader_or_bypass_reconnect_loop() -> None:
    """Refresh should delegate all port teardown/reopen and HMAC auth to the owner loop."""
    client = _client()
    scheduled: list[bool] = []
    client._schedule_reconnect = lambda: scheduled.append(True)  # type: ignore[method-assign]

    await client.refresh_snapshot()

    assert scheduled == [True]
    assert client._connected is False
