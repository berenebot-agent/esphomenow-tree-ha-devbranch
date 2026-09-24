#!/usr/bin/env python3
"""Call the scaffold directly and assert the network: block appears only in the
serial (no wifi secret) case. This is the add-on's own codepath, not a hand-built YAML."""
import sys
sys.path.insert(0, "/r")
from app import yaml_scaffold as ys

BOARD = {"platform": "esp32", "board": "esp32-c5-devkitc-1",
         "variant": "esp32c5", "framework": "esp-idf"}

cases = {
    "serial (no wifi secret)": {
        "esphome_name": "espnow-bridge-c5-serial", "is_bridge": True,
        "board_info": BOARD, "web_server_port": 80,
        "ota_password": "ota_password", "api_key": "bridge_api_key",
        "espnow_network_id_secret": "espnow_network_id",
    },
    "wifi bridge (wifi secret present)": {
        "esphome_name": "espnow-bridge-c5", "is_bridge": True,
        "board_info": BOARD, "web_server_port": 80,
        "ota_password": "ota_password", "api_key": "bridge_api_key",
        "wifi_ssid_secret": "wifi_ssid", "wifi_password_secret": "wifi_password",
    },
    "serial, no web/ota at all": {
        "esphome_name": "espnow-bridge-min", "is_bridge": True,
        "board_info": BOARD,
    },
}

ok = True
for name, node in cases.items():
    yaml_text, unknown = ys.generate_scaffold(node)
    has_net = any(l.strip() == "network:" for l in yaml_text.splitlines())
    has_wifi = any(l.strip() == "wifi:" for l in yaml_text.splitlines())
    has_web = any(l.strip() == "web_server:" for l in yaml_text.splitlines())
    print(f"=== {name} ===")
    print(f"    network: {has_net}   wifi: {has_wifi}   web_server: {has_web}")
    expect_net = ("no wifi secret" in name and (has_web or "ota:" in yaml_text))
    if has_wifi and has_net:
        print("    !! BOTH wifi: and network: — would fail transport exclusivity")
        ok = False
    if expect_net and not has_net:
        print("    !! expected network: but none emitted")
        ok = False

print()
print("SERIAL SCAFFOLD (full):")
print(ys.generate_scaffold(cases["serial (no wifi secret)"])[0])
print("ALL ASSERTIONS OK" if ok else "ASSERTIONS FAILED")
