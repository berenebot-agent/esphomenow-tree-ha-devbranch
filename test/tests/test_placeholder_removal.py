"""Synthetic wizard placeholders must be removable.

`/api/bridge/flash-wizard/submit` registers two synthetic device rows so the wizard can
poll compile status before the real device exists:

    PLACEHOLDER_MAC        FF:FF:FF:FF:FF:FF   (bridge provisioning)
    REMOTE_PLACEHOLDER_MAC FF:FF:FF:FF:FF:FE   (remote provisioning)

They are deliberately not real nodes, so they never appear in the bridge or retained
topology. `remove_remote` verified the target against that topology before deleting, so
a leftover placeholder could not be removed by any endpoint -- it stayed in the tree
forever as a fake offline node, showing up as a duplicate row for a remote that was
already flashed and live.

`DELETE /api/topology/remote/{mac}` now clears a placeholder directly.

These tests read the source rather than booting the app, because the route handlers are
nested closures inside `create_app` and need a full FastAPI/db stack to invoke. The
behaviour under test is *the ordering*: placeholders are handled before the topology
guard, which is exactly what was wrong.
"""
from __future__ import annotations

import re
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
SERVER = REPO_ROOT / "app" / "server.py"


@pytest.fixture(scope="module")
def server_src() -> str:
    return SERVER.read_text()


def _remove_remote_body(src: str) -> str:
    """The body of the remove_remote handler, up to the next route decorator."""
    start = src.index("async def remove_remote(")
    rest = src[start:]
    end = rest.find("@app.", 10)
    return rest[: end if end != -1 else len(rest)]


def test_placeholders_are_defined():
    """The two synthetic MACs must exist; the fix keys off them."""
    src = SERVER.read_text()
    assert 'PLACEHOLDER_MAC = "FF:FF:FF:FF:FF:FF"' in src
    assert 'REMOTE_PLACEHOLDER_MAC = "FF:FF:FF:FF:FF:FE"' in src


def test_remove_remote_handles_placeholders_before_the_topology_guard(server_src: str):
    """The regression: the placeholder branch must come FIRST.

    If it sits after the topology lookup it is dead code, because a placeholder is
    never in the topology and the request 404s before reaching it.
    """
    body = _remove_remote_body(server_src)
    placeholder_at = body.find("target_mac in {PLACEHOLDER_MAC, REMOTE_PLACEHOLDER_MAC}")
    assert placeholder_at != -1, "remove_remote does not special-case synthetic placeholders"
    topology_guard_at = body.find("remote not found in bridge or retained topology")
    assert topology_guard_at != -1, "expected the topology guard to still be present"
    assert placeholder_at < topology_guard_at, (
        "the placeholder branch must precede the topology guard, otherwise it is unreachable"
    )


def test_placeholder_branch_deletes_the_device_row(server_src: str):
    """It must actually delete, and return the same shape as a normal removal."""
    body = _remove_remote_body(server_src)
    branch = body[body.find("target_mac in {PLACEHOLDER_MAC, REMOTE_PLACEHOLDER_MAC}") :]
    branch = branch[: branch.find("bridge_macs")]
    assert "db.delete_device(target_mac)" in branch
    assert "db.unhide_device(target_mac)" in branch
    assert '"removed"' in branch
    # Must not claim it touched the integration: a placeholder has no config entry.
    assert '"integration": False' in branch


def test_placeholder_branch_does_not_claim_an_integration_forget(server_src: str):
    """A placeholder has no integration record, so it must not report one.

    Guards against a copy-paste that runs the integration forget path for a synthetic
    MAC, which would raise or silently warn.
    """
    body = _remove_remote_body(server_src)
    branch_end = body.find("bridge_macs")
    branch = body[body.find("target_mac in {PLACEHOLDER_MAC, REMOTE_PLACEHOLDER_MAC}") : branch_end]
    assert "forget_remote" not in branch
    assert "supervisor_token" not in branch


def test_real_remotes_still_go_through_the_topology_guard(server_src: str):
    """The placeholder shortcut must not weaken the live-remote protections."""
    body = _remove_remote_body(server_src)
    for guard in (
        "remote not found in bridge or retained topology",
        "this remote is currently online",
        "forget_remote",
    ):
        assert guard in body, f"remove_remote lost the '{guard}' protection"
