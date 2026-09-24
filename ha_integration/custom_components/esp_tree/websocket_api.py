from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from .bridge_runtime import get_runtime
from .const import DOMAIN, INTEGRATION_VERSION


def async_register_websocket_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, websocket_status)
    websocket_api.async_register_command(hass, websocket_remotes)


@websocket_api.websocket_command({vol.Required("type"): "esp_tree/remotes"})
@websocket_api.async_response
async def websocket_remotes(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Retained remote table, so the add-on can draw offline remotes as rows.

    The add-on's topology only carries what the bridge currently advertises, so
    remotes kept in this store from earlier sessions show up in the counts but
    nowhere in the UI. Expose them (with online + hop state) so they can be
    rendered as offline rows instead of vanishing.
    """
    runtime = get_runtime(hass)
    remotes = []
    for remote in runtime.remotes.values():
        entity_count = len(getattr(remote, "entities", {}) or {})
        remotes.append(
            {
                "mac": remote.remote_mac,
                "name": remote.name or remote.esphome_name or remote.remote_mac,
                "esphome_name": remote.esphome_name or "",
                "online": bool(getattr(remote, "online", False)),
                "hops": int(getattr(remote, "hops_to_bridge", 0) or 0),
                "bridge_mac": getattr(remote, "bridge_mac", "") or "",
                "schema_hash": getattr(remote, "schema_hash", "") or "",
                "entity_count": entity_count,
            }
        )
    connection.send_result(msg["id"], {"remotes": remotes})


@websocket_api.websocket_command({vol.Required("type"): "esp_tree/status"})
@websocket_api.async_response
async def websocket_status(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    runtime = get_runtime(hass)
    # remotes/entities persist across restarts, so the raw length includes stale
    # entries from earlier sessions. Report the online split too, so a UI can say
    # "1 online of 5 known" instead of implying all five are live.
    remotes = runtime.remotes.values()
    online = sum(1 for r in remotes if getattr(r, "online", False))
    connection.send_result(
        msg["id"],
        {
            "connected": runtime.bridge_connected(),
            "bridge_count": len(runtime.bridge_snapshots),
            "remote_count": len(runtime.remotes),
            "remotes_online": online,
            "remotes_offline": len(runtime.remotes) - online,
            "version": INTEGRATION_VERSION,
        },
    )
