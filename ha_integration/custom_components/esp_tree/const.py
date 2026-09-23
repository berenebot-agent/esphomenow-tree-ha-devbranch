from __future__ import annotations

import json
from pathlib import Path

DOMAIN = "esp_tree"
CONF_HOST = "host"
CONF_PORT = "port"
CONF_API_KEY = "api_key"
CONF_BRIDGE_MAC = "bridge_mac"
CONF_NETWORK_ID = "network_id"
CONF_NAME = "name"
CONF_TYPE = "type"
CONF_ADDON_URL = "addon_url"
CONF_INTEGRATION_TOKEN = "integration_token"

SHARED_DB_PATH = "/share/esp_tree/esp_tree.db"
SHARED_LOG_PATH = "/share/esp_tree/activity.log"
SHARED_CONFIG_PATH = "/share/esp_tree/integration_config.json"
SHARED_RUNTIME_PATH = "/share/esp_tree/integration_runtime.json"
LOCAL_CONFIG_FILE = ".addon_config.json"
API_VERSION = 2
CLIENT_KIND = "ha_integration"


def _read_integration_version() -> str:
    # Keep the integration version in one place: manifest.json.
    try:
        manifest_path = Path(__file__).with_name("manifest.json")
        return str(json.loads(manifest_path.read_text(encoding="utf-8")).get("version") or "")
    except Exception:
        return ""


INTEGRATION_VERSION = _read_integration_version()

PLATFORMS = [
    "sensor",
    "text_sensor",
    "binary_sensor",
    "switch",
    "button",
    "number",
    "select",
    "text",
    "light",
    "fan",
    "cover",
    "valve",
    "lock",
    "alarm_control_panel",
    "event",
]
