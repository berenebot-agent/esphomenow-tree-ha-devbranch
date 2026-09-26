"""A stale parked discovery flow must not block a remote from being added.

Regression for the second half of the "Entities: Not Yet Added" dead-end.

Even with `async_step_integration_discovery` creating the entry outright, an OLD flow
sitting in `discovery_confirm` (created before that change) still blocks the retry:
Home Assistant refuses to start a second flow for the same (handler, unique id) with
`already_in_progress`. So the remote could never be added, the device page kept
showing "Not Yet Added", and the only remedy it offered -- add the integration from
Devices & Services -- aborts with `already_configured` because the hub is installed.

Observed live before the fix:

    flow_id 01M3CM8S63Z61GCGSG2W65PWHQ  esp_tree  uid F4:2D:C9:58:33:10  discovery_confirm
    flow_id 01M3CMRT3RN6R6J2AVMW8PC981  esp_tree  uid 7C:9E:BD:07:39:1C  discovery_confirm

`_abort_stale_discovery_flow` clears that corpse before a new discovery is scheduled.

These tests drive `EspTreeRuntime._abort_stale_discovery_flow` against a fake flow
manager, because the important behaviour is *which* flows get aborted.
"""
from __future__ import annotations

import importlib.util
import sys
from pathlib import Path
from unittest.mock import MagicMock

_PKG_DIR = Path(__file__).resolve().parent.parent / "custom_components" / "esp_tree"


def _load_runtime():
    """Import bridge_runtime with the mocked Home Assistant surface from conftest."""
    fqn = "custom_components.esp_tree.bridge_runtime"
    if fqn in sys.modules and hasattr(sys.modules[fqn], "__spec__"):
        return sys.modules[fqn]
    spec = importlib.util.spec_from_file_location(fqn, _PKG_DIR / "bridge_runtime.py")
    mod = importlib.util.module_from_spec(spec)
    sys.modules[fqn] = mod
    spec.loader.exec_module(mod)
    return mod


def _runtime_with_flows(flows):
    """A runtime whose hass exposes the given in-progress flows."""
    rt_mod = _load_runtime()
    runtime = rt_mod.EspTreeRuntime.__new__(rt_mod.EspTreeRuntime)
    manager = MagicMock()
    manager.async_progress.return_value = list(flows)
    hass = MagicMock()
    hass.config_entries.flow = manager
    runtime.hass = hass
    return runtime, manager


TARGET = "F4:2D:C9:58:33:10"


def test_aborts_the_parked_flow_for_this_remote():
    """The real-world case: a flow stopped at discovery_confirm for our remote."""
    runtime, manager = _runtime_with_flows(
        [
            {
                "flow_id": "01M3CM8S63Z61GCGSG2W65PWHQ",
                "handler": "esp_tree",
                "context": {"source": "integration_discovery", "unique_id": TARGET},
                "step_id": "discovery_confirm",
            }
        ]
    )

    runtime._abort_stale_discovery_flow(TARGET)

    manager.async_abort.assert_called_once_with("01M3CM8S63Z61GCGSG2W65PWHQ")


def test_does_not_touch_another_remotes_flow():
    """A different remote's in-flight flow must be left alone."""
    runtime, manager = _runtime_with_flows(
        [
            {
                "flow_id": "other-remote-flow",
                "handler": "esp_tree",
                "context": {"unique_id": "7C:9E:BD:07:39:1C"},
                "step_id": "discovery_confirm",
            }
        ]
    )

    runtime._abort_stale_discovery_flow(TARGET)

    manager.async_abort.assert_not_called()


def test_does_not_touch_other_integrations_flows():
    """Only this domain's flows are ours to abort, even if the unique_id matches."""
    runtime, manager = _runtime_with_flows(
        [
            {
                "flow_id": "someone-elses-flow",
                "handler": "esphome",
                "context": {"unique_id": TARGET},
                "step_id": "discovery_confirm",
            }
        ]
    )

    runtime._abort_stale_discovery_flow(TARGET)

    manager.async_abort.assert_not_called()


def test_mac_comparison_ignores_formatting():
    """Unique ids are stored normalised; a differently-formatted MAC must still match.

    `norm_mac` strips separators and upper-cases, so the same remote written as
    `f4-2d-c9-58-33-10` or `F42DC9583310` is still the same remote.
    """
    runtime, manager = _runtime_with_flows(
        [
            {
                "flow_id": "flow-normalised",
                "handler": "esp_tree",
                "context": {"unique_id": "f4-2d-c9-58-33-10"},
                "step_id": "discovery_confirm",
            }
        ]
    )

    runtime._abort_stale_discovery_flow(TARGET)

    manager.async_abort.assert_called_once_with("flow-normalised")


def test_survives_a_flow_manager_without_async_progress():
    """A missing/renamed API must not raise into the discovery path.

    Discoveries run off the websocket snapshot path; an exception here would break
    topology handling entirely, so the reconcile is best-effort by design.
    """
    rt_mod = _load_runtime()
    runtime = rt_mod.EspTreeRuntime.__new__(rt_mod.EspTreeRuntime)
    hass = MagicMock()
    del hass.config_entries.flow.async_progress
    runtime.hass = hass

    runtime._abort_stale_discovery_flow(TARGET)  # must not raise
