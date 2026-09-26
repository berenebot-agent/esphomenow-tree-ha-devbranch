"""Integration must only call Home Assistant APIs that exist.

Regression: bridge_runtime._handle_snapshot() called
``hass.config_entries.async_reload_entry(...)``. There is no such method on
ConfigEntries -- the real one is ``async_reload``. The AttributeError was raised
inside the add-on websocket handler, so the connection was torn down and logged
as a warning; the runtime then reconnected over its fallback path and worked, which
is why the defect was easy to miss. It fires on the first snapshot whose
bridge_mac differs from the stored entry data, which is exactly the flash-wizard
placeholder -> real-MAC transition.

This mirrors config_flow.py, which already used the correct name.
"""
from __future__ import annotations

import re
from pathlib import Path

COMPONENT = (
    Path(__file__).resolve().parents[2]
    / "ha_integration"
    / "custom_components"
    / "esp_tree"
)

# Methods genuinely present on Home Assistant's ConfigEntries helper.
KNOWN_CONFIG_ENTRIES_METHODS = {
    "async_entries",
    "async_entry_for_domain_unique_id",
    "async_forward_entry_setups",
    "async_get_entry",
    "async_remove",
    "async_reload",
    "async_unload_platforms",
    "async_update_entry",
    # `flow` is the ConfigFlow manager attribute, not a method.
    "flow",
}


def _config_entries_calls() -> dict[str, list[str]]:
    """Calls on the hass.config_entries helper only.

    ``device.config_entries`` is a set attribute on a *device* registry entry, so
    an unanchored regex reports set methods (``intersection``) as false positives.
    Require the ``hass.`` receiver.
    """
    found: dict[str, list[str]] = {}
    for py in sorted(COMPONENT.glob("*.py")):
        for n, line in enumerate(py.read_text().splitlines(), 1):
            for m in re.finditer(r"\bhass\.config_entries\.([a-z_]+)", line):
                found.setdefault(m.group(1), []).append(f"{py.name}:{n}")
    return found


def test_no_call_to_a_nonexistent_config_entries_method() -> None:
    unknown = {
        name: where
        for name, where in _config_entries_calls().items()
        if name not in KNOWN_CONFIG_ENTRIES_METHODS
    }
    assert not unknown, (
        "call(s) to methods that do not exist on Home Assistant's ConfigEntries: "
        f"{unknown}"
    )


def test_bridge_runtime_does_not_use_async_reload_entry() -> None:
    """The specific regression, named so a revert is unmistakable."""
    src = (COMPONENT / "bridge_runtime.py").read_text()
    assert "async_reload_entry" not in src, (
        "async_reload_entry does not exist on ConfigEntries; use async_reload"
    )
    assert "async_reload(" in src, (
        "bridge_runtime.py should reload the hub entry via async_reload"
    )
