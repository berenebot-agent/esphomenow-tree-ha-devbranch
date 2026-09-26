"""The flash wizard's synthetic bridge MAC must be migrated, on both transports.

Regression: the wizard creates the bridge (and its devices row) with the
PLACEHOLDER_MAC because the real MAC is unknown at submit time. The WiFi path
migrated it in _try_auto_activate_provisioned_bridge(), but the serial path
activated the bridge without ever calling rename_device_mac -- and the serial
client is pure transport with no DB handle, so nothing else could migrate it
either. The placeholder device row survived, and the topology showed two rows
named after the same bridge: one at FF:FF:FF:FF:FF:FF and one at the real
address. The bridge's own bridges.mac row was left at the placeholder too.

The fix migrates in BridgeV2Manager._handle_snapshot(), which is the moment the
real MAC first becomes known on either transport, and is the only place both
transports converge.
"""
from __future__ import annotations

from pathlib import Path

APP = Path(__file__).resolve().parents[2] / "app"


def _snapshot_body() -> str:
    """The body of _handle_snapshot, up to the next method of the same class."""
    src = (APP / "bridge_v2_client.py").read_text()
    start = src.index("def _handle_snapshot(")
    rest = src[start:]
    end = rest.find("\n    def ", 10)
    return rest[: end if end != -1 else len(rest)]


def test_snapshot_migrates_the_placeholder_mac() -> None:
    """_handle_snapshot must rename the placeholder device row."""
    body = _snapshot_body()
    assert "rename_device_mac" in body, (
        "_handle_snapshot does not migrate the placeholder MAC; the serial "
        "transport would leave a permanent FF:FF:FF:FF:FF:FF device row"
    )
    assert "PLACEHOLDER_MAC" in body
    assert "bridge_mac" in body


def test_placeholder_mac_is_shared_not_redefined() -> None:
    """One definition only: server.py imports it, it does not re-declare it."""
    consts = (APP / "bridge_constants.py").read_text()
    assert 'PLACEHOLDER_MAC = "FF:FF:FF:FF:FF:FF"' in consts
    assert 'REMOTE_PLACEHOLDER_MAC = "FF:FF:FF:FF:FF:FE"' in consts

    server = (APP / "server.py").read_text()
    assert 'PLACEHOLDER_MAC = "FF:FF:FF:FF:FF:FF"' not in server, (
        "server.py re-declares PLACEHOLDER_MAC; the bridge client needs the same "
        "value, so a second definition is a silent-divergence risk"
    )
    assert "PLACEHOLDER_MAC" in server and "REMOTE_PLACEHOLDER_MAC" in server


def test_snapshot_persists_the_real_bridge_mac() -> None:
    """The bridges row must stop carrying the placeholder MAC.

    remove_remote() protects bridge MACs by reading bridges.mac, so a bridge row
    left at FF:FF:FF:FF:FF:FF leaves the real bridge address unprotected: removing
    it as though it were a remote would be permitted.
    """
    body = _snapshot_body()
    assert "mac=bridge_mac" in body, (
        "_handle_snapshot does not persist the real bridge MAC onto the bridges row"
    )
    assert "update_bridge" in body


def test_both_placeholder_macs_stay_distinct() -> None:
    """Sharing one value would let a remote overwrite the bridge's device row."""
    consts = (APP / "bridge_constants.py").read_text()
    assert 'PLACEHOLDER_MAC = "FF:FF:FF:FF:FF:FF"' in consts
    assert 'REMOTE_PLACEHOLDER_MAC = "FF:FF:FF:FF:FF:FE"' in consts
    # Distinct literals: the bridge's key must not be usable as the remote's.
    assert consts.count('"FF:FF:FF:FF:FF:FF"') == 1
    assert consts.count('"FF:FF:FF:FF:FF:FE"') == 1
