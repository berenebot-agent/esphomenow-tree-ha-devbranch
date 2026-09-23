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

    if sdkconfig_options:
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
        if node.get("wifi_ssid_secret") is not None:
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
        if node.get("wifi_ssid_secret") is None and wants_web_or_ota:
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
