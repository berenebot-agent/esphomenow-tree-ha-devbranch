"""Preflight validation shared by the flash-wizard endpoint and tests."""

from __future__ import annotations

import re
from typing import Any

from fastapi import HTTPException


def validate_flash_name(name: str, *, is_remote: bool, yaml_store: Any, db: Any) -> None:
    if not name:
        raise HTTPException(status_code=400, detail="name is required")
    if not re.fullmatch(r"[a-z][a-z0-9-]*", name):
        raise HTTPException(status_code=400, detail="name must be lowercase letters, numbers, and hyphens")
    existing_prov = db.get_provisioning_bridge()
    active_target = (
        existing_prov is not None
        and str(existing_prov.get("name") or "") == name
        and not is_remote
    )
    if is_remote:
        remote = db.get_device("FF:FF:FF:FF:FF:FE") or {}
        active_target = str(remote.get("esphome_name") or "") == name
    if yaml_store.has_config(name) and not active_target:
        raise HTTPException(status_code=409, detail=f"ESPHome config already exists for {name}")


def validate_remote_network_credentials(
    requested_network_id: str,
    requested_psk: str,
    configured_network_id: str,
    configured_psk: str,
) -> None:
    if requested_network_id and configured_network_id and (
        requested_network_id.upper() != configured_network_id.upper()
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "network_id does not match the configured ESP-NOW network "
                f"({configured_network_id}). A remote must join the bridge's network; "
                "change the network by re-provisioning the bridge."
            ),
        )
    if requested_psk and configured_psk and requested_psk != configured_psk:
        raise HTTPException(
            status_code=400,
            detail=(
                "psk does not match the configured ESP-NOW network. A remote must join "
                "the bridge's network; change it by re-provisioning the bridge."
            ),
        )
    if not configured_network_id or not configured_psk:
        missing = [
            key for key, value in (
                ("espnow_network_id", configured_network_id),
                ("espnow_psk", configured_psk),
            ) if not value
        ]
        raise HTTPException(
            status_code=400,
            detail=(
                "no ESP-NOW credentials configured "
                f"({', '.join(missing)}); a remote cannot join without them. "
                "Add them to secrets.yaml, or provision a bridge first."
            ),
        )


def validate_board(chip_name: str, board_info: dict[str, str], supported_boards: dict[str, dict[str, str]]) -> None:
    supported = supported_boards.get(chip_name)
    if not supported or board_info.get("board") != supported.get("board"):
        raise HTTPException(status_code=400, detail="chip_name and board_info do not match a supported board")
    expected_platform = supported.get("platform")
    allowed_platforms = {expected_platform}
    if str(expected_platform or "").startswith("esp32"):
        allowed_platforms.add("esp32")
    if board_info.get("platform") not in allowed_platforms:
        raise HTTPException(status_code=400, detail="board_info platform does not match chip_name")
