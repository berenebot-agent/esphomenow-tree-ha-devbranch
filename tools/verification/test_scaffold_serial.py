"""Verify the scaffold's serial branch: pins per chip, no wifi in serial mode,
serial_transport emitted, logger pinned to UART0, and the wifi path unchanged."""
import sys
sys.path.insert(0, "/r")

from app.yaml_scaffold import generate_scaffold, uart0_pins_for_board, CHIP_NAME_TO_BOARD

FAIL = []

def check(label, cond, detail=""):
    print(("  PASS  " if cond else "  FAIL  ") + label + (f"  [{detail}]" if detail else ""))
    if not cond:
        FAIL.append(label)

# --- 1. pin map matches ESP-IDF v5.5 uart_pins.h exactly -------------------
EXPECTED = {
    "esp32":   (1, 3),
    "esp32s2": (43, 44),
    "esp32s3": (43, 44),
    "esp32c2": (20, 19),
    "esp32c3": (21, 20),
    "esp32c5": (11, 12),
    "esp32c6": (16, 17),
    "esp32h2": (24, 23),
}
print("\n== 1. UART0 pin map (vs IDF v5.5 U0TXD/U0RXD_GPIO_NUM) ==")
for variant, want in EXPECTED.items():
    got = uart0_pins_for_board({"platform": f"esp32-{variant[5:]}", "variant": variant})
    check(f"{variant} -> tx{want[0]} rx{want[1]}", got == want, f"got {got}")

print("\n== 2. classic ESP32 (no variant key) falls back to esp32 ==")
check("no-variant esp32 board", uart0_pins_for_board({"platform": "esp32", "board": "esp32dev"}) == (1, 3))

print("\n== 3. unknown SoC returns None (scaffold must not guess) ==")
check("unknown variant", uart0_pins_for_board({"platform": "esp32-x", "variant": "esp32zzz"}) is None)

# --- 4. SERIAL scaffold on a C5 ------------------------------------------
print("\n== 4. SERIAL bridge scaffold (ESP32-C5) ==")
serial_node = {
    "esphome_name": "bridge-serial-c5",
    "is_bridge": True,
    "chip_name": "ESP32-C5",
    "board_info": {**CHIP_NAME_TO_BOARD["ESP32-C5"]},
    "espnow_mode": "regular",
    "transport": "serial",
    "serial_transport": True,
    "ota_password": "!secret ota_password",
    "api_key": "!secret bridge_api_key",
    "web_server_port": 80,
}
out, unknown = generate_scaffold(serial_node)
print("\n".join("    | " + l for l in out.splitlines()))
print()
check("no wifi: block", "wifi:" not in out)
check("no wifi secret referenced", "wifi_ssid" not in out and "wifi_password" not in out)
check("network: present (for web_server/ota)", "\nnetwork:" in out)
check("logger pinned to UART0", "hardware_uart: UART0" in out)
check("uart bus present", "bridge_uart" in out)
check("C5 pins GPIO11/GPIO12", "tx_pin: GPIO11" in out and "rx_pin: GPIO12" in out)
check("rx_buffer_size set", "rx_buffer_size: 16384" in out)
check("serial_transport nested under component", "serial_transport:" in out and "uart_id: bridge_uart" in out)
check("serial_transport is under esp_tree_bridge (indented)",
      "\n  serial_transport:\n    uart_id: bridge_uart" in out)
check("ota present", "- platform: esphome" in out)
check("web_server present", "web_server:" in out)

# --- 5. WIFI scaffold must be unchanged ----------------------------------
print("\n== 5. WIFI bridge scaffold (regression) ==")
wifi_node = {
    "esphome_name": "bridge-wifi-s3",
    "is_bridge": True,
    "chip_name": "ESP32-S3",
    "board_info": {**CHIP_NAME_TO_BOARD["ESP32-S3"]},
    "espnow_mode": "lr",
    "transport": "wifi",
    "wifi_ssid_secret": "wifi_ssid",
    "wifi_password_secret": "wifi_password",
    "ota_password": "!secret ota_password",
    "api_key": "!secret bridge_api_key",
    "web_server_port": 80,
    "sdkconfig_options": {"CONFIG_FREERTOS_USE_TRACE_FACILITY": "y"},
}
out2, _ = generate_scaffold(wifi_node)
print("\n".join("    | " + l for l in out2.splitlines()))
print()
check("wifi: block present", "wifi:" in out2 and "ssid: !secret wifi_ssid" in out2)
check("no network: duplicate", "\nnetwork:" not in out2)
check("no uart bus in wifi mode", "bridge_uart" not in out2)
check("no serial_transport in wifi mode", "serial_transport" not in out2)
check("no hardware_uart override", "hardware_uart" not in out2)
check("logger plain DEBUG", "\nlogger:\n  level: DEBUG" in out2)

# --- 6. bare bridge (no secrets at all) -> network only -------------------
print("\n== 6. bare bridge (no wifi secret, not marked serial) ==")
bare_node = {
    "esphome_name": "bridge-bare",
    "is_bridge": True,
    "chip_name": "ESP32-C6",
    "board_info": {**CHIP_NAME_TO_BOARD["ESP32-C6"]},
    "espnow_mode": "lr",
    "ota_password": "!secret ota_password",
    "api_key": "!secret bridge_api_key",
    "web_server_port": 80,
}
out3, _ = generate_scaffold(bare_node)
check("network: present", "\nnetwork:" in out3)
check("no wifi: block", "wifi:" not in out3)
check("no serial_transport (not marked serial)", "serial_transport" not in out3)

# --- 7. never both wifi and serial ---------------------------------------
print("\n== 7. invariants ==")
check("serial scaffold has uart but no wifi", ("bridge_uart" in out) and ("wifi:" not in out))
check("wifi scaffold has wifi but no uart", ("wifi:" in out2) and ("bridge_uart" not in out2))

print("\n" + ("=" * 60))
if FAIL:
    print(f"FAILED ({len(FAIL)}): " + "; ".join(FAIL))
    sys.exit(1)
print("ALL SCAFFOLD CHECKS PASSED")
