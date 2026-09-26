"""Unit tests for esp_tree entity platform modules.

Mocks all HA dependencies and pre-loads the esp_tree submodules
so entity modules can be imported for testing.
"""

from __future__ import annotations

import importlib
import importlib.util
import json
import sys
import types
from unittest.mock import MagicMock, AsyncMock
from dataclasses import dataclass
from enum import IntFlag
from pathlib import Path

import pytest

_BASE_DIR = Path(__file__).resolve().parent.parent
_PKG_DIR = _BASE_DIR / "custom_components" / "esp_tree"


def _setup_mocks():
    if "homeassistant" in sys.modules and hasattr(sys.modules["homeassistant"], "_mocked"):
        return

    for name in ["voluptuous"]:
        if name not in sys.modules:
            vol = types.ModuleType(name)
            vol.Schema = lambda value: value
            vol.Required = lambda value, **kwargs: value
            vol.Optional = lambda value, **kwargs: value
            sys.modules[name] = vol

    ha = types.ModuleType("homeassistant")
    ha.core = types.ModuleType("homeassistant.core")
    ha.core.HomeAssistant = type("HomeAssistant", (), {})
    ha.core.ServiceCall = type("ServiceCall", (), {})
    ha.core.callback = lambda f: f
    ha.config_entries = types.ModuleType("homeassistant.config_entries")
    ha.config_entries.ConfigEntry = type("ConfigEntry", (), {})
    # config_flow.py declares `class ConfigFlow(config_entries.ConfigFlow, domain=DOMAIN)`,
    # so the mock base must accept keyword arguments at class creation.
    class _MockConfigFlow:
        def __init_subclass__(cls, **kwargs):
            super().__init_subclass__()

        def __init__(self, *args, **kwargs):
            self.hass = kwargs.get("hass")
            self.context: dict = {}

        async def async_set_unique_id(self, unique_id, *, raise_on_progress=True):
            self.unique_id = unique_id
            return {"type": "abort", "reason": "already_configured"}

        def _abort_if_unique_id_configured(self, updates=None):
            return None

        def async_show_form(self, **kwargs):
            return {"type": "form", **kwargs}

        def async_create_entry(self, *, title, data):
            return {"type": "create_entry", "title": title, "data": data}

        def async_abort(self, *, reason):
            return {"type": "abort", "reason": reason}

    ha.config_entries.ConfigFlow = _MockConfigFlow
    ha.config_entries.OptionsFlow = _MockConfigFlow
    # Result alias used as a return annotation throughout config_flow.py.
    ha.config_entries.ConfigFlowResult = dict
    ha.config_entries.SOURCE_IMPORT = "import"
    ha.config_entries.SOURCE_INTEGRATION_DISCOVERY = "integration_discovery"
    ha.helpers = types.ModuleType("homeassistant.helpers")
    ha.helpers.selector = types.ModuleType("homeassistant.helpers.selector")
    ha.helpers.selector.AreaSelector = lambda *a, **k: None
    ha.helpers.entity = types.ModuleType("homeassistant.helpers.entity")
    ha.helpers.entity.Entity = type("Entity", (), {"async_write_ha_state": lambda self: None})
    ha.helpers.device_registry = types.ModuleType("homeassistant.helpers.device_registry")
    ha.helpers.device_registry.DeviceInfo = dict
    ha.helpers.device_registry.async_get = MagicMock()
    ha.helpers.device_registry.DeviceEntry = MagicMock
    ha.helpers.device_registry.async_get = MagicMock()
    ha.helpers.entity_registry = types.ModuleType("homeassistant.helpers.entity_registry")
    ha.helpers.entity_platform = types.ModuleType("homeassistant.helpers.entity_platform")
    ha.helpers.update_coordinator = types.ModuleType("homeassistant.helpers.update_coordinator")
    ha.helpers.update_coordinator.DataUpdateCoordinator = MagicMock
    ha.helpers.discovery = types.ModuleType("homeassistant.helpers.discovery")
    ha.helpers.discovery.async_load_platform = AsyncMock()
    ha.helpers.typing = types.ModuleType("homeassistant.helpers.typing")
    ha.helpers.typing.ConfigType = dict
    ha.helpers.event = types.ModuleType("homeassistant.helpers.event")
    ha.helpers.event.async_track_time_interval = MagicMock(return_value=lambda: None)
    ha.helpers.issue_registry = types.ModuleType("homeassistant.helpers.issue_registry")
    ha.helpers.issue_registry.async_create_issue = MagicMock()
    ha.helpers.issue_registry.async_delete_issue = MagicMock()
    ha.helpers.issue_registry.IssueSeverity = type("IssueSeverity", (), {"WARNING": "warning"})
    ha.helpers.storage = types.ModuleType("homeassistant.helpers.storage")
    ha.helpers.storage.Store = MagicMock
    ha.exceptions = types.ModuleType("homeassistant.exceptions")
    ha.exceptions.ConfigEntryNotReady = type("ConfigEntryNotReady", (Exception,), {})
    ha.const = types.ModuleType("homeassistant.const")
    ha.data_entry_flow = types.ModuleType("homeassistant.data_entry_flow")
    ha.data_entry_flow.FlowResult = dict

    sys.modules["homeassistant"] = ha
    sys.modules["homeassistant.core"] = ha.core
    sys.modules["homeassistant.config_entries"] = ha.config_entries
    sys.modules["homeassistant.helpers"] = ha.helpers
    sys.modules["homeassistant.helpers.selector"] = ha.helpers.selector
    sys.modules["homeassistant.helpers.entity"] = ha.helpers.entity
    sys.modules["homeassistant.helpers.device_registry"] = ha.helpers.device_registry
    sys.modules["homeassistant.helpers.entity_registry"] = ha.helpers.entity_registry
    sys.modules["homeassistant.helpers.entity_platform"] = ha.helpers.entity_platform
    sys.modules["homeassistant.helpers.update_coordinator"] = ha.helpers.update_coordinator
    sys.modules["homeassistant.helpers.discovery"] = ha.helpers.discovery
    sys.modules["homeassistant.helpers.typing"] = ha.helpers.typing
    sys.modules["homeassistant.helpers.event"] = ha.helpers.event
    sys.modules["homeassistant.helpers.issue_registry"] = ha.helpers.issue_registry
    sys.modules["homeassistant.helpers.storage"] = ha.helpers.storage
    sys.modules["homeassistant.exceptions"] = ha.exceptions
    sys.modules["homeassistant.const"] = ha.const
    sys.modules["homeassistant.data_entry_flow"] = ha.data_entry_flow

    repairs_mod = types.ModuleType("homeassistant.components.repairs")
    repairs_mod.RepairsFlow = type("RepairsFlow", (object,), {"__init__": lambda self: None})
    sys.modules["homeassistant.components.repairs"] = repairs_mod
    sys.modules["homeassistant.components"] = types.ModuleType("homeassistant.components")

    sys.modules["google"] = types.ModuleType("google")
    sys.modules["google.protobuf"] = types.ModuleType("google.protobuf")
    msg_mod = types.ModuleType("google.protobuf.message")
    msg_mod.DecodeError = type("DecodeError", (Exception,), {})
    sys.modules["google.protobuf.message"] = msg_mod

    aiohttp_mod = types.ModuleType("aiohttp")
    aiohttp_mod.ClientSession = MagicMock
    aiohttp_mod.ClientWebSocketResponse = MagicMock
    aiohttp_mod.ClientTimeout = MagicMock
    aiohttp_mod.WSMsgType = type("WSMsgType", (), {
        "TEXT": 1, "BINARY": 2, "CLOSE": 3, "CLOSING": 4, "CLOSED": 5, "ERROR": 6,
    })
    sys.modules["aiohttp"] = aiohttp_mod

    # HA component mocks
    light_mod = types.ModuleType("homeassistant.components.light")
    light_mod.LightEntity = type("LightEntity", (object,), {"__init__": lambda self: None})
    light_mod.ColorMode = type("ColorMode", (), {
        "ONOFF": "onoff", "BRIGHTNESS": "brightness", "WHITE": "white",
        "COLOR_TEMP": "color_temp", "RGB": "rgb", "RGBW": "rgbw", "RGBWW": "rgbww", "XY": "xy",
    })
    light_mod.ATTR_BRIGHTNESS = "brightness"
    light_mod.ATTR_COLOR_MODE = "color_mode"
    light_mod.ATTR_COLOR_TEMP = "color_temp"
    light_mod.ATTR_COLOR_TEMP_KELVIN = "color_temp_kelvin"
    light_mod.ATTR_EFFECT = "effect"
    light_mod.ATTR_RGB_COLOR = "rgb_color"
    light_mod.ATTR_WHITE = "white"
    light_mod.ATTR_TRANSITION = "transition"
    sys.modules["homeassistant.components.light"] = light_mod

    fan_mod = types.ModuleType("homeassistant.components.fan")
    fan_mod.FanEntity = type("FanEntity", (object,), {"__init__": lambda self: None})
    _FanEntityFeature = IntFlag("FanEntityFeature", {
        "SET_SPEED": 1, "OSCILLATE": 2, "DIRECTION": 4, "PRESET_MODE": 8,
        "TURN_OFF": 16, "TURN_ON": 32,
    })
    fan_mod.FanEntityFeature = _FanEntityFeature
    sys.modules["homeassistant.components.fan"] = fan_mod

    lock_mod = types.ModuleType("homeassistant.components.lock")
    lock_mod.LockEntity = type("LockEntity", (object,), {"__init__": lambda self: None})
    lock_mod.LockState = type("LockState", (), {"LOCKED": "LOCKED", "UNLOCKED": "UNLOCKED", "JAMMED": "JAMMED"})
    sys.modules["homeassistant.components.lock"] = lock_mod

    cover_mod = types.ModuleType("homeassistant.components.cover")
    cover_mod.CoverEntity = type("CoverEntity", (object,), {"__init__": lambda self: None})
    cover_mod.CoverEntityFeature = IntFlag("CoverEntityFeature", {"OPEN": 1, "CLOSE": 2, "STOP": 4, "SET_POSITION": 8})
    sys.modules["homeassistant.components.cover"] = cover_mod

    valve_mod = types.ModuleType("homeassistant.components.valve")

    class _MockValveEntity:
        _attr_reports_position = True
        def __init__(self):
            pass
        @property
        def reports_position(self):
            return self._attr_reports_position

    valve_mod.ValveEntity = _MockValveEntity
    valve_mod.ValveEntityFeature = IntFlag("ValveEntityFeature", {"OPEN": 1, "CLOSE": 2, "SET_POSITION": 4, "STOP": 8})
    sys.modules["homeassistant.components.valve"] = valve_mod

    alarm_mod = types.ModuleType("homeassistant.components.alarm_control_panel")
    alarm_mod.AlarmControlPanelEntity = type("AlarmControlPanelEntity", (object,), {"__init__": lambda self: None})
    alarm_mod.AlarmControlPanelState = type("AlarmControlPanelState", (), {
        "DISARMED": "disarmed", "ARMED_HOME": "armed_home", "ARMED_AWAY": "armed_away",
        "ARMED_NIGHT": "armed_night", "ARMED_VACATION": "armed_vacation",
        "ARMED_CUSTOM_BYPASS": "armed_custom_bypass", "TRIGGERED": "triggered",
        "PENDING": "pending", "ARMING": "arming", "DISARMING": "disarming",
    })
    alarm_mod.AlarmControlPanelEntityFeature = IntFlag("AlarmControlPanelEntityFeature", {
        "ARM_HOME": 1, "ARM_AWAY": 2, "ARM_NIGHT": 4, "TRIGGER": 8,
        "ARM_CUSTOM_BYPASS": 16, "ARM_VACATION": 32,
    })
    alarm_mod.CodeFormat = type("CodeFormat", (), {"NUMBER": "number"})
    sys.modules["homeassistant.components.alarm_control_panel"] = alarm_mod

    event_mod = types.ModuleType("homeassistant.components.event")
    event_mod.EventEntity = type("EventEntity", (object,), {"__init__": lambda self: None})
    sys.modules["homeassistant.components.event"] = event_mod

    # Register esp_tree as namespace package (skip __init__.py)
    cc = types.ModuleType("custom_components")
    cc.__path__ = [str(_BASE_DIR / "custom_components")]
    sys.modules["custom_components"] = cc
    esp_pkg = types.ModuleType("custom_components.esp_tree")
    esp_pkg.__path__ = [str(_PKG_DIR)]
    esp_pkg.__package__ = "custom_components.esp_tree"
    sys.modules["custom_components.esp_tree"] = esp_pkg

    # Mock protobuf generated module (used by integration_client and bridge_runtime)
    pb_gen = types.ModuleType("custom_components.esp_tree.protobuf.generated")
    pb_gen.esp_tree_runtime_pb2 = MagicMock()
    sys.modules["custom_components.esp_tree.protobuf.generated"] = pb_gen
    pb_parent = types.ModuleType("custom_components.esp_tree.protobuf")
    pb_parent.__path__ = [str(_PKG_DIR / "protobuf")]
    sys.modules["custom_components.esp_tree.protobuf"] = pb_parent

    # Load dependency chain
    def _load(fqn, path):
        if fqn in sys.modules and hasattr(sys.modules[fqn], "__spec__"):
            return sys.modules[fqn]
        spec = importlib.util.spec_from_file_location(fqn, str(path))
        mod = importlib.util.module_from_spec(spec)
        sys.modules[fqn] = mod
        spec.loader.exec_module(mod)
        return mod

    _load("custom_components.esp_tree.const", _PKG_DIR / "const.py")
    _load("custom_components.esp_tree.device_model", _PKG_DIR / "device_model.py")
    _load("custom_components.esp_tree.activity_logger", _PKG_DIR / "activity_logger.py")
    _load("custom_components.esp_tree.store", _PKG_DIR / "store.py")

    try:
        _load("custom_components.esp_tree.integration_client", _PKG_DIR / "integration_client.py")
    except Exception:
        ic_mod = types.ModuleType("custom_components.esp_tree.integration_client")
        ic_mod.IntegrationWSClient = MagicMock
        sys.modules["custom_components.esp_tree.integration_client"] = ic_mod

    try:
        _load("custom_components.esp_tree.bridge_runtime", _PKG_DIR / "bridge_runtime.py")
    except Exception:
        br_mod = types.ModuleType("custom_components.esp_tree.bridge_runtime")
        br_mod.get_runtime = MagicMock()
        sys.modules["custom_components.esp_tree.bridge_runtime"] = br_mod

    try:
        _load("custom_components.esp_tree.entity_model", _PKG_DIR / "entity_model.py")
    except Exception:
        from homeassistant.helpers.entity import Entity
        em = types.ModuleType("custom_components.esp_tree.entity_model")
        em.EspTreeEntity = type("EspTreeEntity", (Entity,), {
            "__init__": lambda self, model: (
                object.__setattr__(self, "model", model) if hasattr(object, "__setattr__") else None
                or setattr(self, "_attr_unique_id", model.unique_id)
                or setattr(self, "_attr_translation_key", model.object_id)
            ),
            "async_write_ha_state": lambda self: None,
        })
        sys.modules["custom_components.esp_tree.entity_model"] = em

    ha._mocked = True


_setup_mocks()


def import_entity(name: str):
    fqn = f"custom_components.esp_tree.{name}"
    if fqn in sys.modules and hasattr(sys.modules[fqn], "__spec__"):
        return sys.modules[fqn]
    path = _PKG_DIR / f"{name}.py"
    spec = importlib.util.spec_from_file_location(fqn, str(path))
    mod = importlib.util.module_from_spec(spec)
    sys.modules[fqn] = mod
    spec.loader.exec_module(mod)
    return mod


@dataclass
class EntityModel:
    remote_mac: str = "AA:BB:CC:DD:EE:FF"
    object_id: str = "test_entity"
    platform: str = ""
    name: str = "Test"
    native_type: str = ""
    unit: str = ""
    device_class: str = ""
    state_class: str = ""
    options_json: str = ""
    writable: bool = False
    available: bool = True
    value: object = None
    observed_unix_ms: int = 0
    missing_from_schema: bool = False

    @property
    def unique_id(self) -> str:
        return f"{self.remote_mac.replace(':', '').lower()}_{self.object_id}"


class MockRuntime:
    def __init__(self):
        self._commands: list[tuple] = []

    def subscribe_entity(self, remote_mac, object_id, cb):
        return lambda: None

    async def send_command(self, remote_mac, object_id, command, **kwargs):
        self._commands.append((remote_mac, object_id, command, kwargs))
        return MagicMock()


@pytest.fixture
def runtime():
    return MockRuntime()


@pytest.fixture
def mock_hass(runtime):
    hass = MagicMock()
    hass.data = {"esp_tree": {"runtime": runtime}}
    return hass
