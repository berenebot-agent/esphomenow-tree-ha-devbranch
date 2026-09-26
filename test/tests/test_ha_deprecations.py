"""Guards against Home Assistant APIs and async practices that break later.

Home Assistant reports these through its own error log (`system_log/list`), not
through test failures: deprecated APIs and blocking I/O keep *working* right up
until they are removed. Our CI cannot catch them, so pin the rules here.

Each rule below records what HA logged and the version the API stops working in.
"""

from __future__ import annotations

import ast
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
COMPONENT = REPO / "ha_integration" / "custom_components" / "esp_tree"
APP = REPO / "app"


def _code_lines(py: Path) -> list[tuple[int, str]]:
    """Lines with comments and docstrings stripped, so prose can't trip a rule."""
    src = py.read_text(encoding="utf-8")
    out: list[tuple[int, str]] = []
    tree = ast.parse(src)
    doc_lines: set[int] = set()
    for node in ast.walk(tree):
        if isinstance(node, (ast.Module, ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            body = getattr(node, "body", [])
            if body and isinstance(body[0], ast.Expr) and isinstance(body[0].value, ast.Constant) and isinstance(body[0].value.value, str):
                doc_lines.update(range(body[0].lineno, (body[0].end_lineno or body[0].lineno) + 1))
    for n, line in enumerate(src.splitlines(), 1):
        if n in doc_lines:
            continue
        out.append((n, line.split("#", 1)[0]))
    return out


def _findings(pattern: str, root: Path = COMPONENT) -> list[str]:
    hits: list[str] = []
    for py in sorted(root.glob("*.py")):
        for n, line in _code_lines(py):
            if re.search(pattern, line):
                hits.append(f"{py.name}:{n}: {line.strip()}")
    return hits


def test_no_deprecated_device_registry_devices_mapping() -> None:
    """`device_registry.devices` as a mapping stops working in HA 2027.9.0."""
    hits = _findings(r"\.devices\.values\(\)|\.devices\[")
    assert not hits, (
        "deprecated device_registry.devices mapping access (HA 2027.9.0); "
        "iterate with async_entries_for_config_entry/dr helpers instead:\n  "
        + "\n  ".join(hits)
    )


def test_no_deprecated_async_get_device_by_identifiers() -> None:
    """`async_get_device(identifiers=...)` stops working in HA 2027.8.0."""
    hits = _findings(r"async_get_device\(identifiers")
    assert not hits, (
        "deprecated async_get_device(identifiers=...); identifiers are only unique "
        "per config entry -- use async_get_device_by_identifier(id, entry_id) or "
        "async_get_devices(...):\n  " + "\n  ".join(hits)
    )


def test_no_deprecated_via_device() -> None:
    """`via_device` stops working in HA 2027.8.0; use `via_device_id`.

    Matches the kwarg form AND the dict-key form used by device_info, e.g.
    info["via_device"] = ... / "via_device": ... -- the dict form is how one
    instance survived the first pass (HA attributed it to the async_add_entities
    call site in sensor.py, not to remote_diagnostic_sensor.py where it lived).
    """
    hits = _findings(r"""via_device["']?\s*[=:]""")
    assert not hits, (
        "deprecated via_device (HA 2027.8.0); pass via_device_id (a device id) "
        "instead -- see _via_device_id()/parent_device_id():\n  " + "\n  ".join(hits)
    )


def test_no_hardcoded_domain_in_device_identifiers() -> None:
    """Identifiers must use the DOMAIN constant, not a literal \"esp_tree\".

    A literal that does not match the real domain silently creates devices in a
    different identifier space from the rest of the integration.
    """
    hits = _findings(r"""[\"']esp_tree[\"']\s*,""")
    assert not hits, (
        'hardcoded "esp_tree" domain literal in an identifier; import DOMAIN:\n  '
        + "\n  ".join(hits)
    )


def test_integration_does_not_track_its_long_lived_websocket_task() -> None:
    """The add-on WS reconnect loop must be a *background* task.

    Registered with hass.async_create_task, Home Assistant tracks it and
    async_block_till_done() waits on it forever. HA logged "Setup timed out for
    bootstrap waiting on {<Task pending name='esp_tree_addon_ws'>}" and held its
    own startup for the full 300s bootstrap timeout on every restart.
    """
    src = (COMPONENT / "integration_client.py").read_text(encoding="utf-8")
    assert "async_create_background_task" in src, (
        "the long-lived add-on websocket task must be created with "
        "hass.async_create_background_task so HA does not wait on it"
    )
    assert 'async_create_task(self._run()' not in src, (
        "self._run() is a reconnect loop; creating it as a tracked task blocks HA setup"
    )


def test_no_blocking_file_io_in_async_setup_path() -> None:
    """File I/O in the integration's setup path must go through the executor.

    HA logged "Detected blocking call to write_text/read_text ... inside the event
    loop" for the runtime status write and the shared-config read.
    """
    init_src = (COMPONENT / "__init__.py").read_text(encoding="utf-8")
    assert "async_add_executor_job" in init_src, (
        "_write_runtime_status must write via hass.async_add_executor_job"
    )
    assert "await _write_runtime_status(hass)" in init_src, (
        "_write_runtime_status is async now; its call must be awaited"
    )
    flow_src = (COMPONENT / "config_flow.py").read_text(encoding="utf-8")
    assert "async_add_executor_job" in flow_src, (
        "read_shared_config must read via hass.async_add_executor_job"
    )


def test_addon_supervisor_websocket_call_retries_during_ha_startup() -> None:
    """The add-on's supervisor WS call must survive HA's startup window.

    Single-attempt calls failed hard with "InvalidStatus: server rejected
    WebSocket connection" for the whole window after an HA restart (10/10 failed
    mid-startup, 12/12 succeeded once HA was up).
    """
    src = (APP / "server.py").read_text(encoding="utf-8")
    assert "_supervisor_ws_connect" in src, (
        "ha_ws_call should retry the connect+auth step via a helper"
    )
    assert re.search(r"attempts\s*=\s*[2-9]", src), (
        "ha_ws_call must make more than one connect attempt"
    )
    assert "asyncio.sleep(delay)" in src, "retries need a backoff delay"


def test_no_benign_conditions_logged_at_error() -> None:
    """Normal outcomes must not be logged at ERROR.

    "RESTART_CLEANUP: no marker found ..." is the healthy case (nothing to clean
    up) but was logged at ERROR, making a good restart look broken.
    """
    src = (COMPONENT / "__init__.py").read_text(encoding="utf-8")
    for marker in (
        "no marker found",
        "hass is running, skipping cleanup",
        "no hub entries, skipping cleanup",
    ):
        for n, line in enumerate(src.splitlines(), 1):
            if marker in line and "_LOGGER.error" in line:
                raise AssertionError(
                    f"__init__.py:{n} logs the benign case {marker!r} at ERROR: {line.strip()}"
                )
