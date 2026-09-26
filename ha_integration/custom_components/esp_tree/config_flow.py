from __future__ import annotations

import json
import logging
from pathlib import Path

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.config_entries import ConfigFlowResult
from homeassistant.core import HomeAssistant
from homeassistant.helpers import selector

from .const import CONF_ADDON_URL, CONF_INTEGRATION_TOKEN, CONF_TYPE, DOMAIN, LOCAL_CONFIG_FILE, SHARED_CONFIG_PATH

_LOGGER = logging.getLogger(__name__)


def _clean_value(value: object) -> str:
    return str(value or "").strip()


async def read_shared_config(hass: HomeAssistant | None = None) -> dict:
    """Read the add-on's shared config.

    Reads off the event loop when a hass instance is supplied: HA flags the
    read_text/open on /share/esp_tree/integration_config.json as blocking calls
    inside the event loop. Callers in a sync context may omit hass.
    """
    def _read() -> dict:
        for path in (Path(__file__).with_name(LOCAL_CONFIG_FILE), Path(SHARED_CONFIG_PATH)):
            try:
                data = json.loads(path.read_text(encoding="utf-8"))
            except Exception:
                continue
            if isinstance(data, dict):
                return data
        return {}

    if hass is None:
        return _read()
    return await hass.async_add_executor_job(_read)


def hub_data_from_config(*configs: dict | None) -> dict:
    data = {
        CONF_TYPE: "hub",
    }
    for config in configs:
        if not isinstance(config, dict):
            continue
        addon_url = _clean_value(config.get(CONF_ADDON_URL) or config.get("addon_url"))
        token = _clean_value(config.get(CONF_INTEGRATION_TOKEN) or config.get("integration_token"))
        if addon_url:
            data[CONF_ADDON_URL] = addon_url.rstrip("/")
        if token:
            data[CONF_INTEGRATION_TOKEN] = token
    data.setdefault(CONF_ADDON_URL, "")
    data.setdefault(CONF_INTEGRATION_TOKEN, "")
    return data


def has_connection_data(data: dict) -> bool:
    return bool(_clean_value(data.get(CONF_ADDON_URL)) and _clean_value(data.get(CONF_INTEGRATION_TOKEN)))


class OptionsFlowHandler(config_entries.OptionsFlow):
    async def async_step_init(self, user_input=None) -> ConfigFlowResult:
        return self.async_show_menu(
            step_id="init",
            menu_options=["uninstall_confirm"],
            description_placeholders={"name": "ESP Tree"},
        )

    async def async_step_uninstall_confirm(self, user_input=None) -> ConfigFlowResult:
        if user_input is not None:
            _LOGGER.warning("Uninstall confirmed, running cleanup")
            from . import cleanup_integration
            await cleanup_integration(self.hass, remove_hub=True)
            return self.async_create_entry(title="Uninstalled", data={})
        return self.async_show_form(
            step_id="uninstall_confirm",
            data_schema=vol.Schema(
                {
                    vol.Required("confirm", default=True): bool,
                }
            ),
            description_placeholders={"name": "ESP Tree"},
            last_step=True,
        )


class ConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    def __init__(self) -> None:
        self._remote_info: dict | None = None
        self._errors: dict[str, str] = {}

    @staticmethod
    def async_get_options_flow(config_entry: config_entries.ConfigEntry) -> config_entries.OptionsFlow:
        return OptionsFlowHandler()

    def _hub_configured(self) -> bool:
        return any(
            entry.data.get(CONF_TYPE) == "hub"
            for entry in self.hass.config_entries.async_entries(DOMAIN)
        )

    def _hub_entry(self):
        return next(
            (
                entry
                for entry in self.hass.config_entries.async_entries(DOMAIN)
                if entry.data.get(CONF_TYPE) == "hub"
            ),
            None,
        )

    async def async_step_user(self, user_input=None) -> ConfigFlowResult:
        if self._hub_configured():
            return self.async_abort(reason="already_configured")
        await self.async_set_unique_id("esp_tree_shared_db")
        self._abort_if_unique_id_configured()
        if user_input is not None:
            data = hub_data_from_config(user_input)
            if has_connection_data(data):
                return self.async_create_entry(title="ESP Tree", data=data)
            self._errors["base"] = "missing_addon_config"
        config = await read_shared_config(self.hass)
        data = hub_data_from_config(config)
        if has_connection_data(data):
            return self.async_create_entry(title="ESP Tree", data=data)
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_ADDON_URL, default=data.get(CONF_ADDON_URL) or "http://127.0.0.1:8099"): str,
                    vol.Required(CONF_INTEGRATION_TOKEN, default=data.get(CONF_INTEGRATION_TOKEN) or ""): str,
                }
            ),
            errors=self._errors,
        )

    async def async_step_import(self, import_info: dict | None = None) -> ConfigFlowResult:
        data = hub_data_from_config(await read_shared_config(self.hass), import_info or {})
        existing = self._hub_entry()
        if existing:
            if has_connection_data(data):
                merged = hub_data_from_config(existing.data, data)
                if merged != existing.data:
                    self.hass.config_entries.async_update_entry(existing, data=merged)
                    try:
                        await self.hass.config_entries.async_reload(existing.entry_id)
                    except Exception as exc:
                        _LOGGER.warning("Could not reload ESP Tree hub entry after import update: %s", exc)
            return self.async_abort(reason="already_configured")
        if not has_connection_data(data):
            return await self.async_step_user()
        await self.async_set_unique_id("esp_tree_shared_db")
        self._abort_if_unique_id_configured()
        return self.async_create_entry(title="ESP Tree", data=data)

    async def async_step_hassio(self, info: dict) -> ConfigFlowResult:
        _LOGGER.debug("async_step_hassio received info: %s", info)
        config = info.get("config") if isinstance(info.get("config"), dict) else info
        shared_config = await read_shared_config(self.hass)
        _LOGGER.debug("shared_config contents: %s", shared_config)
        data = hub_data_from_config(shared_config, config)
        _LOGGER.debug("hub_data_from_config result: %s", data)
        existing = self._hub_entry()
        if existing:
            merged = hub_data_from_config(existing.data, data)
            if merged != existing.data:
                self.hass.config_entries.async_update_entry(existing, data=merged)
                try:
                    await self.hass.config_entries.async_reload(existing.entry_id)
                except Exception as exc:
                    _LOGGER.warning("Could not reload ESP Tree hub entry after discovery update: %s", exc)
            return self.async_abort(reason="already_configured")
        if not has_connection_data(data):
            _LOGGER.warning("async_step_hassio aborting: missing_addon_config, data=%s", data)
            return self.async_abort(reason="missing_addon_config")
        await self.async_set_unique_id("esp_tree_shared_db")
        self._abort_if_unique_id_configured()
        return self.async_create_entry(title="ESP Tree", data=data)

    async def async_step_integration_discovery(self, discovery_info: dict) -> ConfigFlowResult:
        """Triggered by bridge_runtime when new remote detected.

        The remote is created straight away rather than waiting for a confirmation
        form. There is nothing mandatory to ask -- the only field was an optional
        area -- and leaving the flow parked in `discovery_confirm` meant the remote
        never got a Home Assistant device: `/api/bridge/topology.json` reported
        `ha_device_id: ""`, and the device-detail page dead-ended at
        "Entities: Not Yet Added" pointing at a generic add-integration URL that is
        not even the right destination for a flow that merely needed confirming.
        Each newly discovered remote left another flow sitting unconfirmed.

        An area can still be set afterwards from the device page.
        """
        self._remote_info = discovery_info
        remote_mac = discovery_info["remote_mac"]
        await self.async_set_unique_id(remote_mac)
        self._abort_if_unique_id_configured()
        self.context["title_placeholders"] = {"name": discovery_info["name"]}
        _LOGGER.info("Auto-creating remote entry for %s (%s)", remote_mac, discovery_info["name"])
        return self.async_create_entry(
            title=discovery_info["name"],
            data={
                "type": "remote",
                "remote_mac": remote_mac,
                "bridge_mac": discovery_info["bridge_mac"],
                "area_id": None,
            },
        )

    async def async_step_discovery_confirm(self, user_input=None) -> ConfigFlowResult:
        """Kept so an in-flight `discovery_confirm` flow (created before remotes were
        auto-created) can still be completed, and so an area can be chosen
        deliberately if this step is ever reached again."""
        if user_input is not None:
            info = self._remote_info
            return self.async_create_entry(
                title=info["name"],
                data={
                    "type": "remote",
                    "remote_mac": info["remote_mac"],
                    "bridge_mac": info["bridge_mac"],
                    "area_id": user_input.get("area_id"),
                },
            )
        return self.async_show_form(
            step_id="discovery_confirm",
            data_schema=vol.Schema(
                {
                    vol.Optional("area_id"): selector.AreaSelector(),
                }
            ),
            description_placeholders={"name": self._remote_info["name"]},
        )
