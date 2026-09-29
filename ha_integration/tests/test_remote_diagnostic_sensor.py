from __future__ import annotations

from types import SimpleNamespace
from unittest.mock import MagicMock

from tests.conftest import import_entity


def test_last_seen_sensor_returns_elapsed_bridge_uptime(monkeypatch):
    module = import_entity("remote_diagnostic_sensor")
    bridge_uptime = 60005
    now = 1000.0
    remote = SimpleNamespace(
        bridge_mac="AA:BB:CC:DD:EE:00",
        last_seen_bridge_uptime_s=bridge_uptime - 4,
        last_seen_observed_at=now - 2,
    )
    runtime = SimpleNamespace(
        remotes={"AA:BB:CC:DD:EE:FF": remote},
        _effective_bridge_uptime=MagicMock(return_value=bridge_uptime + 2),
    )
    monkeypatch.setattr(module.time, "time", lambda: now)
    monkeypatch.setattr(module, "get_runtime", lambda hass: runtime)
    sensor = module.RemoteDiagnosticSensor("AA:BB:CC:DD:EE:FF", "last_seen_s", "Last Seen", "duration", "s", "measurement")
    sensor.hass = MagicMock()

    assert sensor.native_value == 4


def test_last_seen_sensor_returns_none_without_bridge_timing():
    module = import_entity("remote_diagnostic_sensor")
    remote = SimpleNamespace(
        bridge_mac="AA:BB:CC:DD:EE:00",
        last_seen_bridge_uptime_s=0,
        last_seen_observed_at=0,
    )
    runtime = SimpleNamespace(remotes={"AA:BB:CC:DD:EE:FF": remote}, _effective_bridge_uptime=lambda _: 60000)
    module.get_runtime = lambda hass: runtime
    sensor = module.RemoteDiagnosticSensor("AA:BB:CC:DD:EE:FF", "last_seen_s", "Last Seen", "duration", "s", "measurement")
    sensor.hass = MagicMock()

    assert sensor.native_value is None
