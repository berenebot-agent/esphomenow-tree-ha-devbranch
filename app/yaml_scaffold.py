from __future__ import annotations

from typing import Any

CHIP_TYPE_TO_BOARD: dict[int, dict[str, str]] = {
    1: {"platform": "esp32", "board": "esp32dev", "framework": "esp-idf"},
    2: {"platform": "esp32-s2", "board": "esp32-s2-saola", "framework": "esp-idf", "variant": "esp32s2"},
    5: {"platform": "esp32-c3", "board": "esp32-c3-devkitm-1", "framework": "esp-idf", "variant": "esp32c3"},
    9: {"platform": "esp32-s3", "board": "esp32-s3-devkitc-1", "framework": "esp-idf", "variant": "esp32s3"},
    12: {"platform": "esp32-c2", "board": "esp32-c2-devkitm-1", "framework": "esp-idf", "variant": "esp32c2"},
    13: {"platform": "esp32-c6", "board": "esp32-c6-devkitc", "framework": "esp-idf", "variant": "esp32c6"},
    16: {"platform": "esp32-h2", "board": "esp32-h2-devkitm-1", "framework": "esp-idf", "variant": "esp32h2"},
    23: {"platform": "esp32-c5", "board": "esp32-c5-devkitc-1", "framework": "esp-idf", "variant": "esp32c5"},
    0x8266: {"platform": "esp8266", "board": "esp01_1m", "framework": "arduino"},
    0x8236: {"platform": "esp8266", "board": "esp01_1m", "framework": "arduino"},
}

CHIP_NAME_TO_BOARD: dict[str, dict[str, str]] = {
    "ESP32": {"platform": "esp32", "board": "esp32dev", "framework": "esp-idf"},
    "ESP32-S2": {"platform": "esp32-s2", "board": "esp32-s2-saola", "framework": "esp-idf", "variant": "esp32s2"},
    "ESP32-S3": {"platform": "esp32-s3", "board": "esp32-s3-devkitc-1", "framework": "esp-idf", "variant": "esp32s3"},
    "ESP32-C3": {"platform": "esp32-c3", "board": "esp32-c3-devkitm-1", "framework": "esp-idf", "variant": "esp32c3"},
    "ESP32-C2": {"platform": "esp32-c2", "board": "esp32-c2-devkitm-1", "framework": "esp-idf", "variant": "esp32c2"},
    "ESP32-C6": {"platform": "esp32-c6", "board": "esp32-c6-devkitc", "framework": "esp-idf", "variant": "esp32c6"},
    "ESP32-H2": {"platform": "esp32-h2", "board": "esp32-h2-devkitm-1", "framework": "esp-idf", "variant": "esp32h2"},
    "ESP32-C5": {"platform": "esp32-c5", "board": "esp32-c5-devkitc-1", "framework": "esp-idf", "variant": "esp32c5"},
    "ESP32-C61": {"platform": "esp32-c5", "board": "esp32-c5-devkitc-1", "framework": "esp-idf", "variant": "esp32c5"},
    "ESP32-P4": {"platform": "esp32-s3", "board": "esp32-s3-devkitc-1", "framework": "esp-idf", "variant": "esp32s3"},
    "ESP8266": {"platform": "esp8266", "board": "esp01_1m", "framework": "arduino"},
}


def esphome_platform_key(board_info: dict[str, str]) -> str:
    platform = board_info["platform"]
    if platform.startswith("esp32"):
        return "esp32"
    return platform


# Default UART0 (tx, rx) pin numbers per SoC variant, taken from ESP-IDF v5.5
# `components/soc/<chip>/include/soc/uart_pins.h` (U0TXD_GPIO_NUM /
# U0RXD_GPIO_NUM). These are the pins the ROM bootloader prints on, so wiring a
# USB-UART adapter to them gives you the console without any pad re-routing.
#
# Why hardcode at all: ESPHome's `uart:` schema requires at least one of
# tx_pin / rx_pin / port, so a block with neither pin fails validation outright
# ("Must contain at least one of tx_pin, rx_pin, port"). Omitting the pins to get
# the ROM default is not expressible in YAML — so a serial scaffold must name the
# chip-correct pair. Keyed by the `variant:` value in CHIP_NAME_TO_BOARD; entries
# without a variant (classic ESP32 boards) fall back to key "esp32".
UART0_PINS_BY_VARIANT: dict[str, tuple[int, int]] = {
    "esp32": (1, 3),
    "esp32s2": (43, 44),
    "esp32s3": (43, 44),
    "esp32c2": (20, 19),
    "esp32c3": (21, 20),
    "esp32c5": (11, 12),
    "esp32c6": (16, 17),
    "esp32h2": (24, 23),
}

# The hardware FIFO is 128 bytes and the link runs at ~46 KB/s at 460800 baud, so
# a small rx buffer overflows during ESP-NOW radio operations. Matches the demo.
SERIAL_RX_BUFFER_SIZE = 16384
SERIAL_DEFAULT_BAUD = 460800


def uart0_pins_for_board(board_info: dict[str, str]) -> tuple[int, int] | None:
    """UART0 (tx, rx) for this board, or None if the SoC is not in the map."""
    variant = str(board_info.get("variant") or "").strip().lower()
    if not variant:
        platform = str(board_info.get("platform") or "").strip().lower()
        variant = "esp32" if platform == "esp32" else platform
    return UART0_PINS_BY_VARIANT.get(variant)


def chip_type_to_board(chip_type: int) -> dict[str, str] | None:
    return CHIP_TYPE_TO_BOARD.get(chip_type)


def chip_name_to_board(chip_name: str | None) -> dict[str, str] | None:
    if chip_name is None:
        return None
    return CHIP_NAME_TO_BOARD.get(chip_name)


def find_board_info(node: dict[str, Any]) -> tuple[dict[str, str] | None, bool]:
    explicit_board = node.get("board_info")
    if isinstance(explicit_board, dict):
        platform = str(explicit_board.get("platform") or "").strip()
        board = str(explicit_board.get("board") or "").strip()
        if platform and board:
            board_info = {str(k): str(v) for k, v in explicit_board.items() if v is not None}
            return board_info, False

    chip_type = node.get("chip_type")
    try:
        chip_type_int = int(chip_type) if chip_type is not None else 0
    except (TypeError, ValueError):
        chip_type_int = 0

    board_info = chip_type_to_board(chip_type_int)
    if board_info is not None:
        return board_info, False

    chip_name = node.get("chip_name")
    board_info = chip_name_to_board(chip_name)
    if board_info is not None:
        return board_info, False

    return None, chip_name


def generate_scaffold(node: dict[str, Any]) -> tuple[str, bool]:
    esphome_name = str(node.get("esphome_name") or node.get("label") or "").strip()
    if not esphome_name:
        raise ValueError("device has no esphome_name or label, cannot generate scaffold")

    board_info, chip_unknown = find_board_info(node)
    is_bridge = bool(node.get("is_bridge"))
    is_8266 = board_info is not None and board_info["platform"] == "esp8266"
    # A bridge is either WiFi/MQTT (default) or serial-transport. Serial is
    # selected by `transport: "serial"` (set by the flash wizard's Serial tab) or
    # by the older signal of having no wifi secret at all.
    serial_mode = is_bridge and (
        bool(node.get("serial_transport")) or node.get("transport") == "serial"
    )
    if is_bridge:
        remote_component = "esp_tree_bridge"
    elif is_8266:
        remote_component = "espnow_82xx_remote"
    else:
        remote_component = "esp_tree_remote"
    espnow_mode = "regular" if is_8266 else "lr"

    if board_info is None:
        chip_type = node.get("chip_type")
        try:
            chip_type_int = int(chip_type) if chip_type is not None else 0
        except (TypeError, ValueError):
            chip_type_int = 0
        chip_name = chip_unknown if isinstance(chip_unknown, str) else node.get("chip_name", "unknown")
        lines = [
            "esphome:",
            f"  name: {esphome_name}",
            "",
            f"# Unknown chip (chip_type={chip_type_int}, chip_name={chip_name}).",
            "# Create a config manually or use import.",
            "",
            "external_components:",
            "  - source:",
            "      type: local",
            "      path: /opt/esp-tree/components",
            f"    components: [{remote_component}, esp_tree_common]",
            "",
            "logger:",
            "  level: DEBUG",
            "",
            f"{remote_component}:",
            "  network_id: !secret espnow_network_id",
            "  psk: !secret espnow_psk",
            "  ota_over_espnow: true",
            f"  espnow_mode: {espnow_mode}",
            "",
            "# Add your sensors, switches, etc. below",
            "",
        ]
        return "\n".join(lines), True

    lines = [
        "esphome:",
        f"  name: {esphome_name}",
    ]

    if is_bridge:
        lines.append(f"  friendly_name: {esphome_name}")

    lines.append("")

    platform_key = esphome_platform_key(board_info)
    sdkconfig_options = node.get("sdkconfig_options") if is_bridge else None

    lines.append(f"{platform_key}:")
    lines.append(f"  board: {board_info['board']}")
    if "variant" in board_info:
        lines.append(f"  variant: {board_info['variant']}")

    # ESPHome's `esp8266:` block accepts no `framework:` key at all — the framework
    # type is implied (Arduino). Emitting one fails validation outright
    # ("[type] is an invalid option for [framework]"), so every scaffolded ESP8266
    # config was rejected before it reached the compiler. Only ESP32 takes a
    # framework block, where a non-default type has to be stated explicitly.
    if platform_key == "esp8266":
        pass
    elif sdkconfig_options:
        lines.append("  framework:")
        lines.append(f"    type: {board_info['framework']}")
        lines.append("    sdkconfig_options:")
        for key, value in sdkconfig_options.items():
            lines.append(f"      {key}: \"{value}\"")
    else:
        lines.append("  framework:")
        lines.append(f"    type: {board_info['framework']}")

    lines.append("")

    lines.extend([
        "external_components:",
        "  - source:",
        "      type: local",
        "      path: /opt/esp-tree/components",
        f"    components: [{remote_component}, esp_tree_common]",
        "",
    ])

    if is_bridge:
        if node.get("wifi_ssid_secret") is not None and not serial_mode:
            wifi_ssid = node.get("wifi_ssid_secret", "wifi_ssid")
            wifi_pass = node.get("wifi_password_secret", "wifi_password")
            lines.extend([
                "wifi:",
                f"  ssid: !secret {wifi_ssid}",
                f"  password: !secret {wifi_pass}",
                "",
            ])

        # web_server_base (and the web_server OTA platform) declare a dependency
        # on ESPHome's `network` component, which `wifi:` would normally supply.
        # A bridge scaffolded WITHOUT a wifi secret (the serial-transport case)
        # still emits web_server:/ota:, so request `network` explicitly or
        # validation fails with "Component web_server_base requires component
        # network" and the compile job dies at config load.
        wants_web_or_ota = (
            node.get("web_server_port") is not None
            or node.get("ota_password") is not None
        )
        if (node.get("wifi_ssid_secret") is None or serial_mode) and wants_web_or_ota:
            lines.extend([
                "network:",
                "",
            ])

        if node.get("web_server_port") is not None:
            port = node.get("web_server_port") or 80
            lines.extend([
                "web_server:",
                f"  port: {port}",
                "",
            ])

        if node.get("ota_password") is not None:
            lines.extend([
                "ota:",
                "  - platform: esphome",
                "    password: !secret ota_password",
                "",
            ])

    if is_bridge and serial_mode:
        baud = int(node.get("serial_baud") or SERIAL_DEFAULT_BAUD)
        pins = uart0_pins_for_board(board_info)
        lines.extend([
            "logger:",
            "  level: DEBUG",
            # Pin the console to UART0. Without hardware_uart: ESPHome defaults the
            # C5/C6/S3 to USB-Serial-JTAG and emits CONFIG_ESP_CONSOLE_UART_NUM=-1,
            # which routes logs AND panic backtraces to native USB. On a CH340/
            # CP2102 wired to the UART0 pins that makes an early crash look like a
            # silent hang. Must match the bridge_uart baud below.
            "  hardware_uart: UART0",
            f"  baud_rate: {baud}",
            "",
            "# UART bus for serial transport. The larger rx_buffer_size is required:",
            "# the ESP32 FIFO is 128 bytes and data arrives at ~46 KB/s at 460800",
            "# baud, so a small buffer overflows during ESP-NOW radio operations.",
            "uart:",
            "  - id: bridge_uart",
            f"    baud_rate: {baud}",
            f"    rx_buffer_size: {SERIAL_RX_BUFFER_SIZE}",
        ])
        if pins is None:
            # A serial scaffold with no pins cannot be flashed: ESPHome rejects the
            # `uart:` block outright ("Must contain at least one of tx_pin, rx_pin,
            # port"), and the "unknown SoC" case above means the caller passed board
            # info this build has no UART0 mapping for. A commented-out pin pair is
            # not a usable config — it just moves the failure to compile time, where
            # it reads like a firmware fault instead of a bad board argument. Fail
            # here, where the cause is still visible.
            raise ValueError(
                "cannot scaffold serial transport: no UART0 pins known for "
                f"board_info={board_info!r} (variant={board_info.get('variant')!r}, "
                f"platform={board_info.get('platform')!r}). Pass a board whose "
                "'variant' is in UART0_PINS_BY_VARIANT."
            )
        tx, rx = pins
        lines.extend([
            f"    tx_pin: GPIO{tx}",
            f"    rx_pin: GPIO{rx}",
        ])
        lines.append("")

    if not (is_bridge and serial_mode):
        lines.extend([
            "logger:",
            "  level: DEBUG",
            "",
        ])

    if is_bridge:
        lines.append(f"{remote_component}:")
        lines.append("  id: bridge_component")
        lines.append("  network_id: !secret espnow_network_id")
        lines.append("  psk: !secret espnow_psk")
        lines.append(f"  espnow_mode: {node.get('espnow_mode', 'lr')}")
        lines.append("  ota_over_espnow: true")
        if node.get("api_key") is not None:
            lines.append("  api_key: !secret bridge_api_key")
        if serial_mode:
            lines.append("  serial_transport:")
            lines.append("    uart_id: bridge_uart")
    else:
        lines.append(f"{remote_component}:")
        lines.append("  network_id: !secret espnow_network_id")
        lines.append("  psk: !secret espnow_psk")
        lines.append("  ota_over_espnow: true")
        lines.append(f"  espnow_mode: {espnow_mode}")

    lines.extend([
        "",
        "# Add your sensors, switches, etc. below",
        "",
    ])

    return "\n".join(lines), False
