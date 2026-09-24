"""Generate the serial scaffold for several chips and validate each with the real
`esphome config` loader. A scaffold that satisfies our own assertions but fails
ESPHome validation is worthless — this is the actual gate."""
import os, subprocess, sys, tempfile
sys.path.insert(0, "/r")
from app.yaml_scaffold import generate_scaffold, CHIP_NAME_TO_BOARD, uart0_pins_for_board

SECRETS = """wifi_ssid: TestSSID
wifi_password: TestPass123
espnow_network_id: "0011223344556677"
espnow_psk: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff"
ota_password: testotapass
bridge_api_key: testapikey
"""
# Repo components live at /r/device_code/components inside this container.
COMPONENTS = "/r/device_code/components"

CHIPS = ["ESP32", "ESP32-S3", "ESP32-C5", "ESP32-C6", "ESP32-C3", "ESP32-H2", "ESP32-S2"]

results = []
for chip in CHIPS:
    board_info = {**CHIP_NAME_TO_BOARD[chip]}
    node = {
        "esphome_name": f"t-{chip.lower().replace('-', '')}",
        "is_bridge": True,
        "chip_name": chip,
        "board_info": board_info,
        "espnow_mode": "regular",
        "transport": "serial",
        "serial_transport": True,
        "ota_password": "!secret ota_password",
        "api_key": "!secret bridge_api_key",
        "web_server_port": 80,
    }
    yaml_text, _ = generate_scaffold(node)
    # Point external_components at the real repo path for this test.
    yaml_text = yaml_text.replace("path: /opt/esp-tree/components", f"path: {COMPONENTS}")

    with tempfile.TemporaryDirectory() as td:
        cfg = os.path.join(td, "test.yml")
        open(cfg, "w").write(yaml_text)
        open(os.path.join(td, "secrets.yaml"), "w").write(SECRETS)
        # `esphome config` does the full validate pass and exits non-zero on failure.
        p = subprocess.run(["esphome", "config", cfg], capture_output=True, text=True, timeout=300)
        ok = p.returncode == 0
        pins = uart0_pins_for_board(board_info)
        tail = (p.stderr or p.stdout or "").strip().splitlines()
        msg = "" if ok else " | ".join(tail[-4:])
        results.append((chip, pins, ok, msg, yaml_text))

print("=" * 72)
print("REAL `esphome config` VALIDATION OF GENERATED SERIAL SCAFFOLDS")
print("=" * 72)
fails = 0
for chip, pins, ok, msg, _ in results:
    print(f"{'PASS' if ok else 'FAIL'}  {chip:10s} pins={pins}")
    if not ok:
        fails += 1
        print(f"      {msg[:400]}")

# Show one full generated config for the record.
sample = [r for r in results if r[0] == "ESP32-C5"][0][4]
print("\n--- generated serial scaffold for ESP32-C5 ---")
print(sample)

print("=" * 72)
print(f"{len(results) - fails}/{len(results)} chips produced VALID ESPHome config")
sys.exit(1 if fails else 0)
