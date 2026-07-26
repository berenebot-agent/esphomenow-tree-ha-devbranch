import esphome.codegen as cg
import esphome.config_validation as cv
from esphome.const import CONF_ID
from esphome.core import CORE, CoroPriority, coroutine_with_priority
from esphome.components import binary_sensor as binary_sensor_component
from esphome.components import button as button_component
from esphome.components import cover as cover_component
from esphome.components import event as event_component
from esphome.components import fan as fan_component
from esphome.components import light as light_component
from esphome.components import lock as lock_component
from esphome.components import number as number_component
from esphome.components import select as select_component
from esphome.components import sensor as sensor_component
from esphome.components import text as text_component
from esphome.components import text_sensor as text_sensor_component
from esphome.components import valve as valve_component
from esphome.components import alarm_control_panel as alarm_control_panel_component
from esphome.components import switch as switch_component

CODEOWNERS = ["@esphome"]
AUTO_LOAD = ["esp_tree_common"]

CONF_NETWORK_ID = "network_id"
CONF_PSK = "psk"
CONF_ESPHOME_NAME = "esphome_name"
CONF_NODE_LABEL = "node_label"
CONF_HEARTBEAT_INTERVAL = "heartbeat_interval_seconds"
CONF_ESPNOW_MODE = "espnow_mode"
CONF_RELAY_ENABLED = "relay_enabled"
CONF_ROUTE_TTL = "route_ttl_seconds"
CONF_MAX_HOPS = "max_hops"
CONF_MAX_DISCOVER_PENDING = "max_discover_pending"
CONF_PREFERRED_PARENTS = "preferred_parents"
CONF_OTA_OVER_ESPNOW = "ota_over_espnow"
CONF_FORCE_V1_PACKET_SIZE = "force_v1_packet_size"

espnow_ns = cg.esphome_ns.namespace("esp_tree")
ESPNowLRRemote = espnow_ns.class_("ESPNowLRRemote", cg.Component)

CONFIG_SCHEMA = cv.Schema(
    {
        cv.GenerateID(): cv.declare_id(ESPNowLRRemote),
        cv.Required(CONF_NETWORK_ID): cv.string_strict,
        cv.Required(CONF_PSK): cv.All(cv.string_strict, cv.Length(min=1)),
        cv.Optional(CONF_ESPHOME_NAME): cv.string_strict,
        cv.Optional(CONF_NODE_LABEL): cv.string_strict,
        cv.Optional(CONF_HEARTBEAT_INTERVAL, default=60): cv.int_range(min=10, max=3600),
        cv.Optional(CONF_ESPNOW_MODE, default="lr"): cv.one_of("lr", "regular", lower=True),
        cv.Optional(CONF_RELAY_ENABLED, default=True): cv.boolean,
        cv.Optional(CONF_ROUTE_TTL, default=172800): cv.int_range(min=60, max=604800),
        cv.Optional(CONF_MAX_HOPS, default=5): cv.int_range(min=1, max=16),
        cv.Optional(CONF_MAX_DISCOVER_PENDING, default=8): cv.int_range(min=1, max=32),
        cv.Optional(CONF_PREFERRED_PARENTS, default=[]): cv.ensure_list(cv.mac_address),
        cv.Optional(CONF_OTA_OVER_ESPNOW, default=False): cv.boolean,
        cv.Optional(CONF_FORCE_V1_PACKET_SIZE, default=False): cv.boolean,
    }
).extend(cv.COMPONENT_SCHEMA)


@coroutine_with_priority(CoroPriority.FINAL)
async def to_code(config):
    cg.add_build_flag("-Isrc/esphome/components")
    var = cg.new_Pvariable(config[CONF_ID])
    await cg.register_component(var, config)

    cg.add(var.set_network_id(config[CONF_NETWORK_ID]))
    cg.add(var.set_psk(config[CONF_PSK]))
    cg.add(var.set_esphome_name(config.get(CONF_ESPHOME_NAME) or CORE.name))
    node_label = config.get(CONF_NODE_LABEL) or CORE.friendly_name or CORE.name
    cg.add(var.set_node_label(node_label))
    cg.add(var.set_heartbeat_interval(config[CONF_HEARTBEAT_INTERVAL]))
    cg.add(var.set_relay_enabled(config[CONF_RELAY_ENABLED]))
    cg.add(var.set_route_ttl(config[CONF_ROUTE_TTL]))
    cg.add(var.set_max_hops(config[CONF_MAX_HOPS]))
    cg.add(var.set_max_discover_pending(config[CONF_MAX_DISCOVER_PENDING]))
    cg.add(var.set_ota_over_espnow(config[CONF_OTA_OVER_ESPNOW]))
    cg.add(var.set_force_v1_packet_size(config[CONF_FORCE_V1_PACKET_SIZE]))
    for mac in config[CONF_PREFERRED_PARENTS]:
        cg.add(var.add_preferred_parent(mac.parts))
    cg.add(var.set_espnow_mode(config[CONF_ESPNOW_MODE]))

    for id_, entity in CORE.variables.items():
        if id_.type is None:
            continue

        if not hasattr(id_, "id") or not isinstance(id_.id, str):
            continue
        if id_.id.startswith("gamma_"):
            continue

        if id_.type.inherits_from(sensor_component.Sensor):
            cg.add(var.register_sensor_entity(entity, id_.id))
        elif id_.type.inherits_from(switch_component.Switch):
            cg.add(var.register_switch_entity(entity, id_.id))
        elif id_.type.inherits_from(binary_sensor_component.BinarySensor):
            cg.add(var.register_binary_sensor_entity(entity, id_.id))
        elif id_.type.inherits_from(cover_component.Cover):
            cg.add(var.register_cover_entity(entity, id_.id))
        elif id_.type.inherits_from(event_component.Event):
            cg.add(var.register_event_entity(entity, id_.id))
        elif id_.type.inherits_from(fan_component.Fan):
            cg.add(var.register_fan_entity(entity, id_.id))
        elif id_.type.inherits_from(light_component.LightState):
            cg.add(var.register_light_entity(entity, id_.id))
        elif id_.type.inherits_from(lock_component.Lock):
            cg.add(var.register_lock_entity(entity, id_.id))
        elif id_.type.inherits_from(number_component.Number):
            cg.add(var.register_number_entity(entity, id_.id))
        elif id_.type.inherits_from(valve_component.Valve):
            cg.add(var.register_valve_entity(entity, id_.id))
        elif id_.type.inherits_from(alarm_control_panel_component.AlarmControlPanel):
            cg.add(var.register_alarm_control_panel_entity(entity, id_.id))
        elif id_.type.inherits_from(select_component.Select):
            cg.add(var.register_select_entity(entity, id_.id))
        elif id_.type.inherits_from(text_sensor_component.TextSensor):
            cg.add(var.register_text_sensor_entity(entity, id_.id))
        elif id_.type.inherits_from(text_component.Text):
            cg.add(var.register_text_entity(entity, id_.id))
        elif id_.type.inherits_from(button_component.Button):
            cg.add(var.register_button_entity(entity, id_.id))
