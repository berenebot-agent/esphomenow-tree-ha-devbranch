"""Add-on must use Home Assistant websocket commands that actually exist.

Regression: ha_config_entries() called {"type": "config_entries/list"}. That
command was removed from Home Assistant -- it now answers "Unknown command", which
surfaced as a bare 500 from /api/debug-config-entries and silently broke every
caller that enumerates config entries:

  * the setup-status probe for loaded / entry_loaded (the flags operators read to
    decide whether the integration is actually running);
  * auto_cleanup_legacy_state(), the legacy /share removal;
  * both cleanup fallbacks that remove esp_tree entries one by one.

The callers were wrapped in try/except that logged and continued, so the feature
degraded silently rather than erroring loudly. The live command is
`config_entries/get`, which returns a flat list whose entries carry both `domain`
and `entry_id` -- exactly what the consumers read.
"""
from __future__ import annotations

import re
from pathlib import Path

APP = Path(__file__).resolve().parents[2] / "app"

# Config-entry websocket commands that exist in current Home Assistant.
VALID_CONFIG_ENTRY_COMMANDS = {
    "config_entries/get",
    "config_entries/get_single",
    "config_entries/remove",
    "config_entries/update",
    "config_entries/subentries/list",
    "config_entries/subentries/add",
    "config_entries/subentries/remove",
    "config_entries/subentries/update",
    "config_entries/flow/progress",
    "config_entries/flow",
    "config_entries/flow/configure",
    "config_entries/flow/abort",
    # The integration's own command surface, registered by the custom component.
    "esp_tree/status",
}


def _ws_commands() -> dict[str, list[str]]:
    """Every {"type": "..."} literal passed to a websocket call."""
    found: dict[str, list[str]] = {}
    for py in sorted(APP.glob("*.py")):
        for n, line in enumerate(py.read_text().splitlines(), 1):
            for m in re.finditer(r'"type"\s*:\s*"([a-z_]+/[a-z_/]+)"', line):
                found.setdefault(m.group(1), []).append(f"{py.name}:{n}")
    return found


def _code_lines(py: Path) -> list[tuple[int, str]]:
    """Source lines with comments stripped, so prose cannot satisfy or trip a check."""
    out: list[tuple[int, str]] = []
    for n, line in enumerate(py.read_text().splitlines(), 1):
        code = line.split("#", 1)[0]
        if code.strip():
            out.append((n, code))
    return out


def test_config_entries_uses_the_live_command() -> None:
    # Check code, not prose: the explanatory comment names the removed command, and
    # a naive substring test would either trip on the comment or be satisfied by it.
    exec_lines = [f"{n}:{c}" for n, c in _code_lines(APP / "server.py")]
    joined = "\n".join(exec_lines)
    assert "config_entries/list" not in joined, (
        "config_entries/list was removed from Home Assistant; use config_entries/get"
    )
    assert '"type": "config_entries/get"' in joined


def test_no_config_entries_command_was_removed_upstream() -> None:
    bad = {
        cmd: where
        for cmd, where in _ws_commands().items()
        if cmd.startswith("config_entries/") and cmd not in VALID_CONFIG_ENTRY_COMMANDS
    }
    assert not bad, f"config-entry websocket command(s) that do not exist: {bad}"


def test_debug_config_entries_route_still_exists() -> None:
    """The route that surfaced the 500 should not simply be deleted to hide it."""
    src = (APP / "server.py").read_text()
    assert "/api/debug-config-entries" in src
