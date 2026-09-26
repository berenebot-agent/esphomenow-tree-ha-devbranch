from __future__ import annotations

import logging
import voluptuous as vol
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import device_registry as dr

from .bridge_runtime import get_runtime
from .const import DOMAIN
from .device_model import norm_mac

_LOGGER = logging.getLogger(__name__)


def async_setup_services(hass: HomeAssistant) -> None:
    async def handle_send_command(call: ServiceCall) -> None:
        runtime = get_runtime(hass)
        await runtime.send_command(
            call.data["remote_mac"],
            call.data["object_id"],
            call.data["command"],
            value=call.data.get("value"),
        )

    hass.services.async_register(
        DOMAIN,
        "send_command",
        handle_send_command,
        schema=vol.Schema(
            {
                vol.Required("remote_mac"): str,
                vol.Required("object_id"): str,
                vol.Required("command"): str,
                vol.Optional("value"): object,
            }
        ),
    )

    async def handle_forget_remote(call: ServiceCall) -> None:
        runtime = get_runtime(hass)
        remote_mac = norm_mac(call.data["remote_mac"])
        entry = hass.config_entries.async_entry_for_domain_unique_id(DOMAIN, remote_mac)
        if entry:
            await hass.config_entries.async_remove(entry.entry_id)
            if hass.config_entries.async_entry_for_domain_unique_id(DOMAIN, remote_mac):
                raise RuntimeError(f"remote config entry for {remote_mac} could not be removed")
        await runtime.forget_remote(remote_mac)
        registry = dr.async_get(hass)
        devices = registry.async_get_devices(identifiers={(DOMAIN, remote_mac)})
        if devices:
            registry.async_remove_device(devices[0].id)

    hass.services.async_register(
        DOMAIN,
        "forget_remote",
        handle_forget_remote,
        schema=vol.Schema(
            {
                vol.Required("remote_mac"): str,
            }
        ),
    )

    async def handle_cleanup(call: ServiceCall) -> None:
        _LOGGER.warning("esp_tree.cleanup service called - removing integration data and preserving hub entry")
        from . import cleanup_integration
        await cleanup_integration(hass)

    hass.services.async_register(
        DOMAIN,
        "cleanup",
        handle_cleanup,
        schema=vol.Schema({}),
    )
