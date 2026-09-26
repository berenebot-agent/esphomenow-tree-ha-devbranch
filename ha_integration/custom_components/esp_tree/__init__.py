from __future__ import annotations

import asyncio
import json
import logging
import time
from pathlib import Path

from homeassistant.config_entries import ConfigEntry, SOURCE_IMPORT
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.device_registry import DeviceEntry

from .activity_logger import ActivityLogger
from .const import CONF_TYPE, DOMAIN, INTEGRATION_VERSION, PLATFORMS, SHARED_RUNTIME_PATH

_LOGGER = logging.getLogger(__name__)
_MODULE_IMPORTED_AT = int(time.time())

ActivityLogger.get()


async def _migrate_legacy_entries(hass: HomeAssistant) -> None:
    entries = hass.config_entries.async_entries(DOMAIN)
    for entry in entries:
        if CONF_TYPE not in entry.data or entry.data.get(CONF_TYPE) == "bridge":
            _LOGGER.info("Removing legacy ESP Tree entry %s", entry.entry_id)
            await hass.config_entries.async_remove(entry.entry_id)


def _ensure_data(hass: HomeAssistant) -> dict:
    from .bridge_runtime import EspTreeRuntime

    domain_data = hass.data.setdefault(DOMAIN, {})
    domain_data.setdefault("runtime", EspTreeRuntime(hass))
    return domain_data


def _remote_identifiers(hass: HomeAssistant, runtime) -> set[tuple[str, str]]:
    identifiers = {
        (DOMAIN, remote_mac)
        for remote_mac in set(runtime.remotes) | set(runtime._remote_entry_ids)
    }
    identifiers.update(
        (DOMAIN, entry.data.get("remote_mac"))
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.data.get(CONF_TYPE) == "remote" and entry.data.get("remote_mac")
    )
    return identifiers


def _remove_hub_owned_remote_devices(hass: HomeAssistant, hub_entry_id: str, runtime) -> None:
    remote_ids = _remote_identifiers(hass, runtime)
    if not remote_ids:
        return
    remote_entry_ids = {
        entry.entry_id
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.data.get(CONF_TYPE) == "remote"
    }
    registry = dr.async_get(hass)
    # Iterate the registry's entries rather than the deprecated `devices` mapping
    # (HA deprecates mapping/lookup access to `device_registry.devices` from
    # 2027.9.0). async_entries_for_config_entry returns the hub's devices directly.
    for device in dr.async_entries_for_config_entry(registry, hub_entry_id):
        if device.config_entries.intersection(remote_entry_ids):
            continue
        if device.identifiers.intersection(remote_ids):
            registry.async_remove_device(device.id)


async def _write_runtime_status(hass: HomeAssistant) -> None:
    runtime_path = Path(SHARED_RUNTIME_PATH)
    payload = {
        "version": INTEGRATION_VERSION,
        "module_imported_at": _MODULE_IMPORTED_AT,
        "written_at": int(time.time()),
    }
    # Off the event loop: HA flags write_text/open here as blocking calls
    # ("Detected blocking call to write_text with args (PosixPath('/share/esp_tree/
    # integration_runtime.json'), ...) inside the event loop"). The add-on reads
    # this file to report runtime_loaded, so it must still be written.
    def _write() -> None:
        runtime_path.parent.mkdir(parents=True, exist_ok=True)
        runtime_path.write_text(json.dumps(payload), encoding="utf-8")

    try:
        await hass.async_add_executor_job(_write)
    except OSError as exc:
        _LOGGER.debug("Could not write ESP Tree runtime status: %s", exc)


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    from .services import async_setup_services
    from .update_repair import async_start_update_repair_watcher
    from .websocket_api import async_register_websocket_commands
    from .config_flow import has_connection_data, hub_data_from_config, read_shared_config

    await _migrate_legacy_entries(hass)
    await _write_runtime_status(hass)
    shared_config = await read_shared_config(hass)
    hub_entries = [
        entry
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.data.get(CONF_TYPE) == "hub"
    ]
    if shared_config:
        for entry in hub_entries:
            merged = hub_data_from_config(entry.data, shared_config)
            if has_connection_data(merged) and merged != entry.data:
                _LOGGER.info("Updating ESP Tree hub entry from shared add-on config")
                hass.config_entries.async_update_entry(entry, data=merged)

    async def _dismiss_restart_notification() -> None:
        try:
            await hass.services.async_call(
                "persistent_notification",
                "dismiss",
                {"notification_id": "esp_tree_restart_required"},
                blocking=False,
            )
        except Exception as exc:
            _LOGGER.debug("Could not dismiss ESP Tree restart notification: %s", exc)

    async def _cleanup_restart_marker() -> None:
        # These are all normal outcomes, not errors: no marker means nothing to
        # clean up, and hass running / no hub entries means skip. Logged at ERROR
        # they made a healthy restart look broken and trained readers to ignore
        # ERROR in this log.
        if hass.is_running:
            _LOGGER.debug("RESTART_CLEANUP: hass is running, skipping cleanup")
            return
        if not hub_entries:
            _LOGGER.debug("RESTART_CLEANUP: no hub entries, skipping cleanup")
            return
        marker_path = Path(__file__).resolve().parent / ".restart_required.json"
        if marker_path.exists():
            try:
                created_at = int(json.loads(marker_path.read_text(encoding="utf-8")).get("created_at") or 0)
            except Exception:
                created_at = 0
            if created_at > _MODULE_IMPORTED_AT:
                _LOGGER.info("RESTART_CLEANUP: marker is fresh (created_at=%s > MODULE_IMPORTED_AT=%s), keeping", created_at, _MODULE_IMPORTED_AT)
                return
            _LOGGER.info("RESTART_CLEANUP: marker is stale, DELETING at %s", marker_path)
            try:
                marker_path.unlink()
            except OSError:
                pass
        else:
            _LOGGER.debug("RESTART_CLEANUP: no marker found at %s", marker_path)

    hass.async_create_task(_dismiss_restart_notification())
    await _cleanup_restart_marker()
    domain_data = _ensure_data(hass)
    async_setup_services(hass)
    async_register_websocket_commands(hass)
    await async_start_update_repair_watcher(hass)
    if not hub_entries:
        if has_connection_data(hub_data_from_config(shared_config)):
            hass.async_create_task(
                hass.config_entries.flow.async_init(
                    DOMAIN,
                    context={"source": SOURCE_IMPORT},
                    data=shared_config,
                )
            )
    else:
        async def _resync_restart_issue():
            await asyncio.sleep(2)
            from .update_repair import _sync_restart_issue
            await _sync_restart_issue(hass)
        hass.async_create_task(_resync_restart_issue())
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    domain_data = _ensure_data(hass)
    runtime = domain_data["runtime"]

    if entry.data.get(CONF_TYPE) == "hub":
        await runtime.add_entry(entry)
        _remove_hub_owned_remote_devices(hass, entry.entry_id, runtime)
        await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
        return True

    if entry.data.get(CONF_TYPE) == "remote":
        remote_mac = entry.data.get("remote_mac")
        if remote_mac:
            runtime.register_remote_entry(remote_mac, entry.entry_id)
            await runtime.ensure_remote_device(remote_mac, entry)
        area_id = entry.data.get("area_id")
        if area_id and remote_mac:
            registry = dr.async_get(hass)
            device = registry.async_get_device_by_identifier((DOMAIN, remote_mac), entry.entry_id)
            if device:
                registry.async_update_device(device.id, area_id=area_id)
        await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
        return True

    if entry.data.get(CONF_TYPE) == "bridge":
        await hass.config_entries.async_remove(entry.entry_id)
        return False


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    unload_ok = True
    # Hub entries forward platforms too (see async_setup_entry), so they must unload
    # them as well. Previously only "remote" entries unloaded, so reloading a hub left
    # its platforms loaded and the re-setup failed with
    # "Config entry ESP Tree (...) for esp_tree.sensor has already been setup!",
    # which silently dropped every bridge entity until a full HA restart.
    if entry.data.get(CONF_TYPE) in ("remote", "hub"):
        unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        await hass.data[DOMAIN]["runtime"].remove_entry(entry)
    return unload_ok


async def async_remove_config_entry_device(
    hass: HomeAssistant, config_entry: ConfigEntry, device_entry: DeviceEntry
) -> bool:
    if config_entry.data.get(CONF_TYPE) != "remote":
        return False
    identifiers = {identifier for domain, identifier in device_entry.identifiers if domain == DOMAIN}
    remote_mac = next(iter(identifiers), None)
    if remote_mac:
        await hass.data[DOMAIN]["runtime"].forget_remote(remote_mac)
    return await hass.config_entries.async_remove(config_entry.entry_id)


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Clear retained runtime data when a remote config entry is deleted."""
    if entry.data.get(CONF_TYPE) != "remote":
        return
    remote_mac = entry.data.get("remote_mac")
    if not remote_mac:
        return
    domain_data = hass.data.get(DOMAIN, {})
    runtime = domain_data.get("runtime")
    if runtime:
        await runtime.forget_remote(remote_mac)
    registry = dr.async_get(hass)
    device = registry.async_get_device_by_identifier((DOMAIN, remote_mac), entry.entry_id)
    if device:
        registry.async_remove_device(device.id)


async def cleanup_integration(hass: HomeAssistant, *, remove_hub: bool = False) -> None:
    domain_data = hass.data.get(DOMAIN)
    if not domain_data:
        return

    runtime = domain_data.get("runtime")
    if not runtime:
        return

    entries = hass.config_entries.async_entries(DOMAIN)
    remote_identifiers = _remote_identifiers(hass, runtime)
    for entry in entries:
        if entry.data.get(CONF_TYPE) == "remote":
            await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    for entry in entries:
        if entry.data.get(CONF_TYPE) == "bridge":
            await runtime.remove_entry(entry)
            await hass.config_entries.async_remove(entry.entry_id)

    for entry in entries:
        if entry.data.get(CONF_TYPE) == "remote":
            await hass.config_entries.async_remove(entry.entry_id)

    registry = dr.async_get(hass)
    remaining_entry_ids = {entry.entry_id for entry in hass.config_entries.async_entries(DOMAIN)}
    # Iterate config entries' devices rather than the deprecated registry.devices
    # mapping (stops working in HA 2027.9.0).
    for entry in hass.config_entries.async_entries(DOMAIN):
        for device in dr.async_entries_for_config_entry(registry, entry.entry_id):
            if device.identifiers.intersection(remote_identifiers):
                registry.async_remove_device(device.id)
                continue
            if not device.config_entries.intersection(remaining_entry_ids):
                for ident in device.identifiers:
                    if ident[0] == DOMAIN:
                        registry.async_remove_device(device.id)
                        break

    await runtime.store.clear()
    if runtime.client:
        await runtime.client.stop()
        runtime.client = None
    runtime.bridge_snapshots.clear()
    runtime.remotes.clear()
    runtime.entities.clear()
    runtime._remote_entry_ids.clear()
    runtime._pending_remote_discoveries.clear()

    if remove_hub:
        for entry in entries:
            if entry.data.get(CONF_TYPE) == "hub":
                await hass.config_entries.async_remove(entry.entry_id)

    shared_db_path = Path("/share/esp_tree/esp_tree.db")
    if shared_db_path.exists():
        shared_db_path.unlink(missing_ok=True)
    shared_dir = shared_db_path.parent
    if shared_dir.exists() and not any(shared_dir.iterdir()):
        try:
            shared_dir.rmdir()
        except OSError:
            pass
