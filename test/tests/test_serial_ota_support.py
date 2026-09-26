"""Regression tests: OTA must work over the SERIAL bridge transport.

Ben's report: after compiling a remote's entity config the flash failed with
"OTA is not supported over serial transport". The bridge firmware refused every
OTA envelope on the serial transport, even though the OTA machinery
(bridge_ota_manager / api_ota_*) is transport-agnostic and the roadmap states
remote ESP-NOW OTA is "unchanged and fully supported in serial mode".

These tests read the serial transport source and assert the guard is gone and the
handlers/callbacks are present. They deliberately parse source rather than compile
so they run in the unit suite; the real compile + on-air check is separate.
"""

from __future__ import annotations

import re
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
SERIAL = REPO_ROOT / "device_code/components/esp_tree_bridge/bridge_api_serial.cpp"
WS = REPO_ROOT / "device_code/components/esp_tree_bridge/bridge_api_proto_ws.cpp"
TYPES_H = REPO_ROOT / "device_code/components/esp_tree_bridge/bridge_api_types.h"


@pytest.fixture(scope="module")
def serial_src() -> str:
    return SERIAL.read_text()


def test_serial_transport_no_longer_refuses_ota(serial_src: str) -> None:
    """The blanket refusal must be gone: it blocked remote ESP-NOW OTA entirely."""
    assert "OTA is not supported over serial transport" not in serial_src


def test_serial_still_does_not_claim_bridge_self_ota() -> None:
    """We only enabled REMOTE ota over serial.

    OTA of the bridge itself over the same cable still needs esptool on USB, so the
    caveat comment must remain - if someone deletes it they may assume self-OTA works.
    """
    src = SERIAL.read_text()
    assert "esptool" in src


def test_serial_dispatches_all_three_ota_messages(serial_src: str) -> None:
    """OTA start / chunk batch / abort must route to handlers, not to an error."""
    for msg in ("OTA_START_REQUEST", "OTA_CHUNK_BATCH", "OTA_ABORT_REQUEST"):
        assert msg in serial_src, f"{msg} not handled by the serial transport"
    for handler in ("handle_ota_start", "handle_ota_chunk_batch", "handle_ota_abort"):
        assert re.search(rf"void {handler}\(", serial_src), f"{handler} missing"


def test_serial_implements_every_ota_transport_callback(serial_src: str) -> None:
    """The bridge pushes OTA progress through these; stubs would silently stall a job."""
    for cb in ("on_ota_accepted", "on_ota_chunk_request", "on_ota_status", "on_ota_aborted"):
        assert re.search(rf"BridgeApiSerialTransport::{cb}\(", serial_src), f"{cb} not implemented"
        # A callback whose body is only a comment means OTA is still disabled.
        body = re.search(rf"BridgeApiSerialTransport::{cb}\(.*?\n\}}", serial_src, re.S)
        assert body and "send_cobs_frame" in body.group(0), f"{cb} does not send anything"


def test_serial_chunk_handler_validates_like_websocket(serial_src: str) -> None:
    """Chunk validation must not be weaker on serial: a bad chunk must abort the job.

    The WebSocket transport checks CRC32, offset and flags before injecting. A serial
    handler that skipped these would happily flash corrupt firmware.
    """
    body = re.search(r"void handle_ota_chunk_batch\(.*?\n  \}", serial_src, re.S)
    assert body, "handle_ota_chunk_batch not found"
    text = body.group(0)
    for check in ("crc32_bytes", "expected_offset", "api_ota_inject_chunk", "api_ota_abort"):
        assert check in text, f"serial chunk handler is missing the {check} check"


def test_shared_ota_helpers_live_in_the_common_header() -> None:
    """Both transports must share ONE crc32/error-code implementation."""
    types_src = TYPES_H.read_text()
    assert "crc32_bytes" in types_src
    assert "ota_start_error_code" in types_src
    # No duplicate definitions left behind: two copies in the same namespace is an
    # ODR violation and they can silently drift apart.
    for name, path in (("crc32_bytes", WS), ("ota_start_error_code", WS)):
        ws_src = path.read_text()
        assert not re.search(rf"^\s*(static\s+)?\w+\s+{name}\(", ws_src, re.M), (
            f"{name} is still defined in {path.name}; it should only live in bridge_api_types.h"
        )


def test_serial_ota_callbacks_belong_to_the_authenticated_session(serial_src: str) -> None:
    """OTA must not be reachable before auth.

    The handlers sit inside the AUTHENTICATED branch; a pre-auth OTA path would let an
    unauthenticated serial client push firmware.
    """
    auth_gate = serial_src.index("if (auth_state != SerialAuthState::AUTHENTICATED) return;")
    start = serial_src.index("env.msg_field == runtime_pb::OTA_START_REQUEST")
    assert auth_gate < start, "OTA handlers are dispatched before the auth gate"
