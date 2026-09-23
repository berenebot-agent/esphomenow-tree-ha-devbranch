"""Tests for text_sensor entity."""
from __future__ import annotations

from unittest.mock import MagicMock

from tests.conftest import EntityModel, MockRuntime, import_entity

text_sensor_mod = import_entity("text_sensor")
EspTreeTextSensor = text_sensor_mod.EspTreeTextSensor


class TestEspTreeTextSensor:
    def _make(self, value=None):
        runtime = MockRuntime()
        model = EntityModel(platform="text_sensor", value=value)
        entity = EspTreeTextSensor(model)
        hass = MagicMock()
        hass.data = {"esp_tree": {"runtime": runtime}}
        entity.hass = hass
        return entity, runtime

    def test_native_value_string(self):
        entity, _ = self._make(value="hello world")
        assert entity.native_value == "hello world"

    def test_native_value_none(self):
        entity, _ = self._make(value=None)
        assert entity.native_value is None

    def test_native_value_empty_string(self):
        entity, _ = self._make(value="")
        assert entity.native_value == ""

    def test_uses_text_sensor_entity_base(self):
        from homeassistant.components.text_sensor import TextSensorEntity
        assert isinstance(EspTreeTextSensor(EntityModel(platform="text_sensor")), TextSensorEntity)