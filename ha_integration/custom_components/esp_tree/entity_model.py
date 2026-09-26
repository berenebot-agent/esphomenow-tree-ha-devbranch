from __future__ import annotations

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import Entity

from .bridge_runtime import get_runtime
from .const import DOMAIN
from .device_model import EntityModel, norm_mac


class EspTreeEntity(Entity):
    _attr_has_entity_name = True

    def __init__(self, model: EntityModel) -> None:
        self.model = model
        self._attr_unique_id = model.unique_id
        self._attr_translation_key = model.object_id

    async def async_added_to_hass(self) -> None:
        runtime = get_runtime(self.hass)
        self.async_on_remove(runtime.subscribe_entity(self.model.remote_mac, self.model.object_id, self.async_write_ha_state))

    @property
    def name(self) -> str:
        return self.model.name

    @property
    def available(self) -> bool:
        return self.model.available and not self.model.missing_from_schema

    @property
    def device_info(self) -> DeviceInfo:
        runtime = get_runtime(self.hass)
        remote = runtime.remotes.get(norm_mac(self.model.remote_mac))
        name = remote.display_name if remote else norm_mac(self.model.remote_mac)
        info = DeviceInfo(
            identifiers={(DOMAIN, norm_mac(self.model.remote_mac))},
            name=name,
            manufacturer=(remote.manufacturer if remote else "ESPHome"),
            model=(remote.chip_name if remote and remote.chip_name else remote.model if remote else "esp_tree_remote"),
            sw_version=(remote.project_version if remote else None),
        )
        if remote and remote.bridge_mac:
            # via_device_id, not the deprecated via_device identifier tuple (HA
            # deprecates via_device from 2027.8.0).
            info["via_device_id"] = runtime.parent_device_id(remote.bridge_mac)
        return info

    @property
    def extra_state_attributes(self) -> dict[str, object]:
        runtime = get_runtime(self.hass)
        remote = runtime.remotes.get(norm_mac(self.model.remote_mac))
        data: dict[str, object] = {
            "remote_mac": norm_mac(self.model.remote_mac),
            "object_id": self.model.object_id,
            "observed_unix_ms": self.model.observed_unix_ms,
            "schema_missing": self.model.missing_from_schema,
        }
        if remote:
            data.update(
                {
                    "active_bridge": remote.bridge_mac,
                    "parent_mac": remote.parent_mac,
                    "session_id": remote.session_id,
                    "last_tx_counter": remote.last_tx_counter,
                    "rssi": remote.rssi,
                    "hops_to_bridge": remote.hops_to_bridge,
                    "schema_hash": remote.schema_hash,
                }
            )
        return data
