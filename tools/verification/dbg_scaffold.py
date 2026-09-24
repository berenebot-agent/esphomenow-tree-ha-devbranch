"""Dump the FULL esphome config output for one chip so the real error is visible."""
import os, subprocess, sys, tempfile
sys.path.insert(0, "/r")
from app.yaml_scaffold import generate_scaffold, CHIP_NAME_TO_BOARD

SECRETS = """wifi_ssid: TestSSID
wifi_password: TestPass123
espnow_network_id: "0011223344556677"
espnow_psk: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff"
ota_password: testotapass
bridge_api_key: testapikey
"""
CHIP = os.environ.get("CHIP", "ESP32-C5")
board_info = {**CHIP_NAME_TO_BOARD[CHIP]}
node = {
    "esphome_name": "t-serial",
    "is_bridge": True,
    "chip_name": CHIP,
    "board_info": board_info,
    "espnow_mode": "regular",
    "transport": "serial",
    "serial_transport": True,
    "ota_password": "!secret ota_password",
    "api_key": "!secret bridge_api_key",
    "web_server_port": 80,
}
yaml_text, _ = generate_scaffold(node)
yaml_text = yaml_text.replace("path: /opt/esp-tree/components", "path: /r/device_code/components")

td = "/w/dbgcfg"
os.makedirs(td, exist_ok=True)
cfg = os.path.join(td, "test.yml")
open(cfg, "w").write(yaml_text)
open(os.path.join(td, "secrets.yaml"), "w").write(SECRETS)

p = subprocess.run(["esphome", "config", cfg], capture_output=True, text=True, timeout=300)
print("=" * 70)
print("CHIP:", CHIP, "RETURNCODE:", p.returncode)
print("=" * 70)
print("--- STDOUT ---")
print(p.stdout)
print("--- STDERR ---")
print(p.stderr)
