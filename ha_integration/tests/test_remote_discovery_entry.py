"""A discovered remote must get its config entry created, not parked in a prompt.

Regression for the dead-end Ben hit: clicking Settings on the remote showed
"Entities: Not Yet Added" and an "add ESP Tree" prompt. The integration *had*
discovered the remote -- `bridge_runtime._schedule_remote_discovery` fired and a
flow was created with `source=integration_discovery` -- but
`async_step_integration_discovery` deferred to `async_step_discovery_confirm`,
which returns a *form*. A form is not a created entry, so the flow sat in
`discovery_confirm` forever:

    flow_id 01M3CM8S63Z61GCGSG2W65PWHQ  uid F4:2D:C9:58:33:10  step discovery_confirm

With no remote entry, `async_setup_entry` never ran the remote branch, so
`ensure_remote_device` never created a Home Assistant device, so topology reported
`ha_device_id: ""` and the UI dead-ended. Each newly discovered remote added
another stuck flow.

The fix: create the entry directly. The only field the confirm form asked for was
an optional area, so there was nothing that needed a human. These tests assert the
discovery step returns a create_entry result with the right data, and that the
confirm step still works for a flow already in flight.
"""
from __future__ import annotations

import asyncio
import importlib.util
import sys
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock

import pytest

# NOTE: conftest.py installs the Home Assistant mocks at collection time; pytest
# loads it automatically, so it must not be imported here by name (it is not an
# importable module when pytest runs the suite from the repo root).
_PKG_DIR = Path(__file__).resolve().parent.parent / "custom_components" / "esp_tree"


def _load_config_flow():
    """Import config_flow with the mocked HA surface from conftest."""
    fqn = "custom_components.esp_tree.config_flow"
    if fqn in sys.modules and hasattr(sys.modules[fqn], "__spec__"):
        return sys.modules[fqn]
    spec = importlib.util.spec_from_file_location(fqn, _PKG_DIR / "config_flow.py")
    mod = importlib.util.module_from_spec(spec)
    sys.modules[fqn] = mod
    spec.loader.exec_module(mod)
    return mod


def _flow():
    """A ConfigFlow instance. The conftest mock base supplies the HA helpers
    (async_create_entry / async_show_form / unique-id guards), so this only has to
    give the instance the attributes the steps touch."""
    cf = _load_config_flow()
    flow = cf.ConfigFlow()
    flow.hass = MagicMock()
    flow.context = {}
    return flow, cf


DISCOVERY = {
    "remote_mac": "F4:2D:C9:58:33:10",
    "name": "espnow-remote",
    "bridge_mac": "D0:CF:13:EB:81:28",
}


def test_discovery_creates_entry_without_a_prompt():
    """The discovery step must create the entry, never return a form."""
    flow, _ = _flow()

    result = asyncio.run(flow.async_step_integration_discovery(dict(DISCOVERY)))

    assert result["type"] == "create_entry", (
        "a discovered remote must be created outright; returning a form leaves the "
        f"flow parked in discovery_confirm and the remote with no HA device (got {result['type']})"
    )
    data = result["data"]
    assert data["type"] == "remote"
    assert data["remote_mac"] == DISCOVERY["remote_mac"]
    assert data["bridge_mac"] == DISCOVERY["bridge_mac"]
    assert result["title"] == DISCOVERY["name"]


def test_discovery_carries_no_stale_area_from_a_previous_flow():
    """Each new remote starts with no area, so one remote's area cannot leak."""
    flow, _ = _flow()
    flow._remote_info = {"remote_mac": "AA:BB:CC:DD:EE:FF", "name": "old", "bridge_mac": "X", "area_id": "kitchen"}

    result = asyncio.run(flow.async_step_integration_discovery(dict(DISCOVERY)))

    assert result["data"]["area_id"] is None


def test_confirm_step_still_completes_an_in_flight_flow():
    """A flow already sitting in discovery_confirm (created before this change) must
    still be completable, so the parked flows are not stranded."""
    flow, _ = _flow()
    flow._remote_info = dict(DISCOVERY, area_id=None)

    result = asyncio.run(flow.async_step_discovery_confirm({"area_id": "garage"}))

    assert result["type"] == "create_entry"
    assert result["data"]["remote_mac"] == DISCOVERY["remote_mac"]
    assert result["data"]["area_id"] == "garage"


def test_confirm_step_shows_a_form_when_no_input():
    """With no input it still renders the area form (unchanged behaviour)."""
    flow, _ = _flow()
    flow._remote_info = dict(DISCOVERY)
    flow.async_show_form = MagicMock(return_value={"type": "form", "step_id": "discovery_confirm"})

    result = asyncio.run(flow.async_step_discovery_confirm(None))

    assert result["type"] == "form"
