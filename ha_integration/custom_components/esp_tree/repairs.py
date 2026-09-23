from __future__ import annotations

import asyncio
import logging
import os

import voluptuous as vol
from homeassistant import data_entry_flow
from homeassistant.components.repairs import RepairsFlow
from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

RESTART_REQUIRED_ISSUE_ID = "restart_required"


class RestartRequiredFlow(RepairsFlow):
    """Repair flow that restarts Home Assistant after integration install/update."""

    async def async_step_init(self, user_input: dict | None = None) -> data_entry_flow.FlowResult:
        return await self.async_step_confirm_restart(user_input)

    async def async_step_confirm_restart(self, user_input: dict | None = None) -> data_entry_flow.FlowResult:
        if user_input is not None:
            try:
                await self._do_restart()
            except asyncio.CancelledError:
                raise
            _LOGGER.error("Restart was requested but did not execute — the repair issue remains open")
            return self.async_show_form(
                step_id="confirm_restart",
                data_schema=vol.Schema({}),
                description_placeholders={"name": "ESP Tree"},
                errors={"base": "restart_failed"},
            )

        return self.async_show_form(
            step_id="confirm_restart",
            data_schema=vol.Schema({}),
            description_placeholders={"name": "ESP Tree"},
        )

    async def _do_restart(self) -> None:
        await asyncio.sleep(0.5)

        if await self._restart_via_supervisor():
            return

        try:
            await self.hass.services.async_call("homeassistant", "restart", blocking=True)
        except Exception as exc:
            _LOGGER.error("Failed to restart Home Assistant from repair flow: %s", exc)

    async def _restart_via_supervisor(self) -> bool:
        token = os.environ.get("SUPERVISOR_TOKEN")
        if not token:
            return False

        import aiohttp

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    "http://supervisor/core/restart",
                    headers={"Authorization": f"Bearer {token}"},
                    timeout=aiohttp.ClientTimeout(total=10),
                ) as resp:
                    return 200 <= resp.status < 300
        except aiohttp.ServerDisconnectedError:
            return True
        except asyncio.TimeoutError:
            _LOGGER.debug("Supervisor restart request timed out")
            return False
        except Exception as exc:
            _LOGGER.debug("Supervisor restart request failed: %s", exc)
            return False


async def async_create_fix_flow(
    hass: HomeAssistant,
    issue_id: str,
    data: dict[str, str | int | float | None] | None,
) -> RepairsFlow | None:
    """Create the repair flow for a fixable ESP Tree issue."""
    if issue_id == RESTART_REQUIRED_ISSUE_ID:
        return RestartRequiredFlow()
    return None
