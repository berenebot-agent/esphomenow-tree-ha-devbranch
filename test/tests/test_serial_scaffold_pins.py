"""Serial scaffolding must never emit a UART block ESPHome will reject.

Regression for the "unknown SoC" fallback: when board info carried no `variant`,
generate_scaffold() emitted a `bridge_uart` whose pins were commented out, and
ESPHome rejects that outright ("Must contain at least one of tx_pin, rx_pin,
port"). The failure surfaced at compile time as "ESPHome compile failed with exit
code 2", which reads like a firmware fault rather than a bad board argument.
"""
from __future__ import annotations

import pytest

from app.yaml_scaffold import CHIP_NAME_TO_BOARD, UART0_PINS_BY_VARIANT, uart0_pins_for_board


def test_every_chip_board_entry_yields_uart0_pins():
    """Every board the wizard can offer must scaffold valid serial pins."""
    for chip_name, board_info in CHIP_NAME_TO_BOARD.items():
        pins = uart0_pins_for_board(board_info)
        if board_info.get("platform", "").startswith("esp8266"):
            continue  # not a serial-transport target
        assert pins is not None, f"{chip_name} has no UART0 mapping: {board_info}"


def test_esp32c5_maps_to_its_uart0_pins():
    assert uart0_pins_for_board({"platform": "esp32-c5", "variant": "esp32c5"}) == (11, 12)


def test_missing_variant_is_not_silently_accepted():
    """A C5 board with no variant must not fall through to a pinless block."""
    assert uart0_pins_for_board({"platform": "esp32-c5"}) is None


def test_classic_esp32_falls_back_to_its_default_pair():
    assert uart0_pins_for_board({"platform": "esp32"}) == UART0_PINS_BY_VARIANT["esp32"]
