from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN

STORAGE_VERSION = 1
STORAGE_KEY = f"{DOMAIN}.runtime"


class RuntimeStore:
    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)

    async def load(self) -> dict[str, Any]:
        return await self._store.async_load() or {"remotes": {}, "entities": {}}

    async def save(self, data: dict[str, Any]) -> None:
        self._store.async_delay_save(lambda: data, 5)

    async def save_now(self, data: dict[str, Any]) -> None:
        await self._store.async_save(data)

    async def clear(self) -> None:
        await self._store.async_remove()
