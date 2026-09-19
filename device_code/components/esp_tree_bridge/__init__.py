import esphome.codegen as cg
import esphome.config_validation as cv
from esphome.components.esp32 import add_idf_sdkconfig_option
from esphome.const import CONF_ID
import esphome.core as core

CODEOWNERS = ["@esphome"]
DEPENDENCIES = ["wifi", "web_server"]
AUTO_LOAD = ["esp_tree_common"]

CONF_NETWORK_ID = "network_id"
CONF_PSK = "psk"
CONF_HEARTBEAT_INTERVAL = "heartbeat_interval_seconds"
CONF_MQTT_DISCOVERY_PREFIX = "mqtt_discovery_prefix"
CONF_ESPNOW_MODE = "espnow_mode"
CONF_OTA_OVER_ESPNOW = "ota_over_espnow"
CONF_FORCE_V1_PACKET_SIZE = "force_v1_packet_size"
CONF_API_KEY = "api_key"

espnow_ns = cg.esphome_ns.namespace("esp_tree")
ESPTreeBridge = espnow_ns.class_("ESPTreeBridge", cg.Component)

CONFIG_SCHEMA = cv.Schema(
    {
        cv.GenerateID(): cv.declare_id(ESPTreeBridge),
        cv.Required(CONF_NETWORK_ID): cv.string_strict,
        cv.Required(CONF_PSK): cv.All(cv.string_strict, cv.Length(min=1)),
        cv.Optional(CONF_HEARTBEAT_INTERVAL, default=60): cv.int_range(min=10, max=3600),
        cv.Optional(CONF_ESPNOW_MODE, default="lr"): cv.one_of("lr", "regular", lower=True),
        cv.Optional(CONF_MQTT_DISCOVERY_PREFIX, default="homeassistant"): cv.string_strict,
        cv.Optional(CONF_OTA_OVER_ESPNOW, default=False): cv.boolean,
        cv.Optional(CONF_FORCE_V1_PACKET_SIZE, default=False): cv.boolean,
        cv.Optional(CONF_API_KEY, default=""): cv.string_strict,
    }
).extend(cv.COMPONENT_SCHEMA)


async def to_code(config):
    add_idf_sdkconfig_option("CONFIG_HTTPD_WS_SUPPORT", True)
    cg.add_build_flag("-Isrc/esphome/components")
    var = cg.new_Pvariable(config[CONF_ID])
    await cg.register_component(var, config)

    cg.add(var.set_network_id(config[CONF_NETWORK_ID]))
    cg.add(var.set_psk(config[CONF_PSK]))
    cg.add(var.set_api_key(config[CONF_API_KEY]))
    cg.add(var.set_heartbeat_interval(config[CONF_HEARTBEAT_INTERVAL]))
    cg.add(var.set_ota_over_espnow(config[CONF_OTA_OVER_ESPNOW]))
    cg.add(var.set_espnow_mode(config[CONF_ESPNOW_MODE]))

    friendly_name = core.CORE.friendly_name or core.CORE.name or "ESP-NOW LR Bridge"
    hostname = core.CORE.name or "esp-tree-bridge"
    cg.add(var.set_force_v1_packet_size(config[CONF_FORCE_V1_PACKET_SIZE]))
    cg.add(var.set_bridge_friendly_name(friendly_name))
    cg.add(var.set_hostname(hostname))

    # MQTT discovery prefix is only used when mqtt: block is present in YAML.
    if "mqtt" in core.CORE.loaded_integrations:
        cg.add(var.set_mqtt_discovery_prefix(config.get(CONF_MQTT_DISCOVERY_PREFIX, "homeassistant")))
        cg.add_build_flag("-DUSE_MQTT")
