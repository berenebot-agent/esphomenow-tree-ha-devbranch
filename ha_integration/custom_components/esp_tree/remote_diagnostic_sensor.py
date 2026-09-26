from __future__ import annotations

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import EntityCategory

from .bridge_runtime import get_runtime
from .const import DOMAIN
from .device_model import norm_mac


CHIP_NAMES = frozenset({
    "ESP32",
    "ESP32-S2",
    "ESP32-C3",
    "ESP32-S3",
    "ESP32-C2",
    "ESP32-C6",
    "ESP32-H2",
    "ESP32-P4",
    "ESP32-C61",
    "ESP32-C5",
    "ESP32-H21",
    "ESP32-H4",
    "ESP32-S3/FH",
    "ESP8266",
})


def normalize_chip_name(chip_name: str) -> str:
    if not chip_name:
        return ""
    return chip_name if chip_name in CHIP_NAMES else chip_name


REMOTE_DIAGNOSTIC_SENSORS = [
    ("rssi", "RSSI", SensorDeviceClass.SIGNAL_STRENGTH, "dBm", "measurement"),
    ("hops_to_bridge", "Hops to Bridge", None, "hops", "measurement"),
    ("uptime_s", "Uptime", SensorDeviceClass.DURATION, "s", "total"),
    ("last_seen_s", "Last Seen", SensorDeviceClass.DURATION, "s", "measurement"),
    ("chip_name", "Chip", None, None, None),
]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities) -> None:
    if entry.data.get("type") != "remote":
        return

    remote_mac = entry.data.get("remote_mac")
    if not remote_mac:
        return

    remote_mac = norm_mac(remote_mac)

    entities = []
    for object_id, name, device_class, unit, state_class in REMOTE_DIAGNOSTIC_SENSORS:
        entities.append(RemoteDiagnosticSensor(remote_mac, object_id, name, device_class, unit, state_class))
    async_add_entities(entities)


class RemoteDiagnosticSensor(SensorEntity):
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(
        self,
        remote_mac: str,
        object_id: str,
        name: str,
        device_class: str | None,
        unit: str | None,
        state_class: str | None,
    ) -> None:
        self._remote_mac = remote_mac
        self._object_id = object_id
        self._name = name
        self._device_class = device_class
        self._unit = unit
        self._state_class = state_class
        self._attr_unique_id = f"{remote_mac.replace(':', '').lower()}_{object_id}"
        self._attr_translation_key = object_id

    async def async_added_to_hass(self) -> None:
        runtime = get_runtime(self.hass)
        self.async_on_remove(runtime.subscribe_remote(self._remote_mac, self.async_write_ha_state))

    @property
    def name(self) -> str:
        return self._name

    @property
    def device_info(self):
        runtime = get_runtime(self.hass)
        remote = runtime.remotes.get(self._remote_mac)
        name = remote.display_name if remote else self._remote_mac
        # via_device_id, not the deprecated via_device identifier tuple (HA
        # deprecates via_device from 2027.8.0). The parent device is the bridge.
        via_device_id = runtime.parent_device_id(remote.bridge_mac) if remote and remote.bridge_mac else None
        return {
            "identifiers": {((DOMAIN, self._remote_mac))},
            "name": name,
            "manufacturer": remote.manufacturer if remote else "ESPHome",
            "model": remote.model if remote else "esp_tree_remote",
            "sw_version": remote.project_version if remote else None,
            "via_device_id": via_device_id,
        }

    @property
    def native_value(self):
        runtime = get_runtime(self.hass)
        remote = runtime.remotes.get(self._remote_mac)
        if not remote:
            return None

        if self._object_id == "rssi":
            return remote.rssi
        if self._object_id == "hops_to_bridge":
            return remote.hops_to_bridge
        if self._object_id == "uptime_s":
            return int(remote.uptime_s or 0)
        if self._object_id == "last_seen_s":
            last_seen_bridge_uptime_s = remote.last_live_observed_ms // 1000
            return last_seen_bridge_uptime_s if last_seen_bridge_uptime_s > 0 else None
        if self._object_id == "chip_name":
            return normalize_chip_name(remote.chip_name)
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
        remote = runtime.remotes.get(self._remote_mac)
        return remote is not None
