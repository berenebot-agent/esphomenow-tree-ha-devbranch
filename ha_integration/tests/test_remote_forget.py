from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest

from tests.conftest import import_entity

services = import_entity("services")


@pytest.mark.asyncio
async def test_forget_remote_clears_runtime_and_registry_even_with_config_entry(monkeypatch):
    runtime = MagicMock()
    runtime.forget_remote = AsyncMock()
    hass = MagicMock()
    hass.data = {"esp_tree": {"runtime": runtime}}
    hass.config_entries.async_remove = AsyncMock()
    entry = MagicMock(entry_id="remote-entry")
    hass.config_entries.async_entry_for_domain_unique_id.return_value = entry
    hass.config_entries.async_entry_for_domain_unique_id.side_effect = [entry, None]
    registry = MagicMock()
    # async_get_devices, not the deprecated async_get_device(identifiers=...)
    registry.async_get_devices.return_value = [MagicMock(id="device-id")]
    monkeypatch.setattr(services.dr, "async_get", MagicMock(return_value=registry))

    services.async_setup_services(hass)
    handler = hass.services.async_register.call_args_list[1].args[2]
    await handler(MagicMock(data={"remote_mac": "aa:bb:cc:dd:ee:ff"}))

    hass.config_entries.async_remove.assert_awaited_once_with("remote-entry")
    runtime.forget_remote.assert_awaited_once_with("AA:BB:CC:DD:EE:FF")
    registry.async_remove_device.assert_called_once_with("device-id")
