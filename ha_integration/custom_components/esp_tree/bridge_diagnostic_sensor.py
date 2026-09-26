from __future__ import annotations

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import EntityCategory

from .bridge_runtime import get_runtime
from .const import CONF_BRIDGE_MAC, CONF_TYPE, DOMAIN
from .device_model import norm_mac


BRIDGE_DIAGNOSTIC_SENSORS = [
    ("wifi_signal", "WiFi Signal", SensorDeviceClass.SIGNAL_STRENGTH, "dBm", "measurement"),
    ("uptime_s", "Uptime", SensorDeviceClass.DURATION, "s", "total"),
    ("remotes_online", "Remotes Online", None, "remotes", "measurement"),
    ("remotes_direct", "Direct Children", None, "remotes", "measurement"),
]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities) -> None:
    if entry.data.get(CONF_TYPE) != "hub":
        return

    bridge_mac = entry.data.get(CONF_BRIDGE_MAC)
    if not bridge_mac:
        return

    bridge_mac = norm_mac(bridge_mac)

    entities = []
    for object_id, name, device_class, unit, state_class in BRIDGE_DIAGNOSTIC_SENSORS:
        entities.append(BridgeDiagnosticSensor(bridge_mac, object_id, name, device_class, unit, state_class))
    async_add_entities(entities)


class BridgeDiagnosticSensor(SensorEntity):
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(
        self,
        bridge_mac: str,
        object_id: str,
        name: str,
        device_class: str | None,
        unit: str | None,
        state_class: str | None,
    ) -> None:
        self._bridge_mac = bridge_mac
        self._object_id = object_id
        self._name = name
        self._device_class = device_class
        self._unit = unit
        self._state_class = state_class
        self._attr_unique_id = f"bridge_{bridge_mac.replace(':', '').lower()}_{object_id}"
        self._attr_translation_key = object_id

    async def async_added_to_hass(self) -> None:
        runtime = get_runtime(self.hass)
        self.async_on_remove(runtime.subscribe_bridge(self._bridge_mac, self.async_write_ha_state))

    @property
    def name(self) -> str:
        return self._name

    @property
    def device_info(self):
        runtime = get_runtime(self.hass)
        bridge = runtime.bridge_snapshots.get(self._bridge_mac, {})
        return {
            "identifiers": {((DOMAIN, self._bridge_mac))},
            "name": "ESP Tree Bridge",
            "manufacturer": "ESPHome",
            "model": bridge.get("chip_name") or "esp_tree_bridge",
        }

    @property
    def native_value(self):
        runtime = get_runtime(self.hass)
        bridge = runtime.bridge_snapshots.get(self._bridge_mac, {})
        if not bridge:
            return None

        if self._object_id == "wifi_signal":
            return bridge.get("rssi")
        if self._object_id == "uptime_s":
            return int(bridge.get("uptime_s") or 0)
        if self._object_id == "remotes_online":
            return bridge.get("total_child_count")
        if self._object_id == "remotes_direct":
            return bridge.get("direct_child_count")
        return None

    @property
    def device_class(self):
        return self._device_class

    @property
    def native_unit_of_measurement(self):
        return self._unit

    @property
    def state_class(self):
        return self._state_class

    @property
    def available(self) -> bool:
        runtime = get_runtime(self.hass)
        return self._bridge_mac in runtime.bridge_snapshots