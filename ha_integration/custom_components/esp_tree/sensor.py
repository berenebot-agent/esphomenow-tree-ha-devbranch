from __future__ import annotations

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .bridge_runtime import get_runtime
from .bridge_diagnostic_sensor import BridgeDiagnosticSensor, BRIDGE_DIAGNOSTIC_SENSORS as _BRIDGE_DIAGNOSTIC_SENSORS
from .device_model import EntityModel
from .entity_model import EspTreeEntity
from .remote_diagnostic_sensor import RemoteDiagnosticSensor, REMOTE_DIAGNOSTIC_SENSORS


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities) -> None:
    if entry.data.get("type") == "hub":
        bridge_mac = entry.data.get("bridge_mac")
        if not bridge_mac:
            runtime = get_runtime(hass)
            if runtime.bridge_snapshots:
                bridge_mac = next(iter(runtime.bridge_snapshots))
        if bridge_mac:
            bridge_mac = "".join(ch for ch in bridge_mac.upper() if ch in "0123456789ABCDEF")
            if len(bridge_mac) == 12:
                bridge_mac = ":".join(bridge_mac[i : i + 2] for i in range(0, 12, 2))
            async_add_entities(
                [BridgeDiagnosticSensor(bridge_mac, object_id, name, device_class, unit, state_class) for object_id, name, device_class, unit, state_class in _BRIDGE_DIAGNOSTIC_SENSORS]
            )
        return

    if entry.data.get("type") == "remote":
        remote_mac = entry.data.get("remote_mac")
        if not remote_mac:
            return
        remote_mac = "".join(ch for ch in remote_mac.upper() if ch in "0123456789ABCDEF")
        if len(remote_mac) == 12:
            remote_mac = ":".join(remote_mac[i : i + 2] for i in range(0, 12, 2))
        async_add_entities(
            [RemoteDiagnosticSensor(remote_mac, object_id, name, device_class, unit, state_class) for object_id, name, device_class, unit, state_class in REMOTE_DIAGNOSTIC_SENSORS]
        )

    seen: set[str] = set()

    def add(model: EntityModel) -> None:
        if model.unique_id in seen:
            return
        seen.add(model.unique_id)
        async_add_entities([EspTreeSensor(model)])

    def add_text_sensor(model: EntityModel) -> None:
        if model.unique_id in seen:
            return
        seen.add(model.unique_id)
        async_add_entities([EspTreeTextSensor(model)])

    get_runtime(hass).register_platform("sensor", add, entry.entry_id if entry.data.get("type") == "remote" else None)
    get_runtime(hass).register_platform("text_sensor", add_text_sensor, entry.entry_id if entry.data.get("type") == "remote" else None)


class EspTreeSensor(EspTreeEntity, SensorEntity):
    @property
    def native_value(self):
        return self.model.value

    @property
    def native_unit_of_measurement(self):
        return self.model.unit or None

    @property
    def device_class(self):
        return self.model.device_class or None

    @property
    def state_class(self):
        return self.model.state_class or None


class EspTreeTextSensor(EspTreeEntity, SensorEntity):
    @property
    def native_value(self):
        return self.model.value
