"""Payload construction for Home Assistant's config-flow REST API."""

from __future__ import annotations

from typing import Any


def start_flow_payload(handler: str) -> dict[str, str]:
    """REST flow start accepts the handler; HA chooses the user-flow source."""
    return {"handler": handler}


def configure_flow_payload(user_input: dict[str, Any] | None) -> dict[str, Any]:
    """The flow continuation request body itself is passed to async_configure."""
    return user_input or {}
