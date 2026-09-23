from __future__ import annotations

from homeassistant.components.text_sensor import TextSensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .bridge_runtime import get_runtime
from .device_model import EntityModel
from .entity_model import EspTreeEntity


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities) -> None:
    if entry.data.get("type") != "remote":
        return

    seen: set[str] = set()

    def add(model: EntityModel) -> None:
        if model.unique_id in seen:
            return
        seen.add(model.unique_id)
        async_add_entities([EspTreeTextSensor(model)])

    get_runtime(hass).register_platform("text_sensor", add, entry.entry_id)


class EspTreeTextSensor(EspTreeEntity, TextSensorEntity):
    @property
    def native_value(self):
        return self.model.value