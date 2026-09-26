from __future__ import annotations

import logging
import time
from collections.abc import Callable
from typing import Any

from homeassistant.config_entries import ConfigEntry, SOURCE_INTEGRATION_DISCOVERY
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr

from .integration_client import IntegrationWSClient
from .activity_logger import ActivityLogger
from .const import API_VERSION, CONF_ADDON_URL, CONF_BRIDGE_MAC, CONF_INTEGRATION_TOKEN, CONF_TYPE, DOMAIN
from .device_model import EntityModel, RemoteModel, norm_mac
from .protobuf.generated import esp_tree_runtime_pb2 as pb
from .store import RuntimeStore

_LOGGER = logging.getLogger(__name__)

EntityCallback = Callable[[EntityModel], None]


def _via_device_id(
    registry: dr.DeviceRegistry,
    identifier: tuple[str, str] | None,
    config_entry_id: str | None,
) -> str | None:
    """Resolve a parent device identifier to its device id.

    DeviceInfo/async_get_or_create now take `via_device_id`, not the deprecated
    `via_device` identifier tuple (HA deprecates `via_device` from 2027.8.0). The
    parent is the bridge, which belongs to the hub config entry, so look it up
    scoped to that entry.
    """
    if not identifier or not config_entry_id:
        return None
    device = registry.async_get_device_by_identifier(identifier, config_entry_id)
    return device.id if device else None


class EspTreeRuntime:
    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.client: IntegrationWSClient | None = None
        self.bridge_snapshots: dict[str, dict[str, Any]] = {}
        self.remotes: dict[str, RemoteModel] = {}
        self.entities: dict[tuple[str, str], EntityModel] = {}
        self.entity_callbacks: dict[str, list[tuple[EntityCallback, str | None]]] = {}
        self.update_callbacks: dict[tuple[str, str], list[Callable[[], None]]] = {}
        self.store = RuntimeStore(hass)
        self._store_loaded = False
        self._pending_remote_discoveries: set[str] = set()
        self._remote_entry_ids: dict[str, str] = {}
        self._hub_entry_id: str | None = None
        self._bridge_uptime_observed: dict[str, tuple[int, float]] = {}
        self._device_id_map_pending = False

    def _effective_bridge_uptime(self, bridge_mac: str) -> int:
        entry = self._bridge_uptime_observed.get(norm_mac(bridge_mac))
        if not entry:
            return 0
        uptime_s, observed_at = entry
        return uptime_s + max(0, int(time.time() - observed_at))

    def _touch_last_seen(self, remote: RemoteModel, bridge_mac: str) -> None:
        effective = self._effective_bridge_uptime(bridge_mac)
        if effective > 0:
            remote.last_seen_bridge_uptime_s = effective
            remote.last_seen_observed_at = time.time()

    def register_platform(self, platform: str, cb: EntityCallback, entry_id: str | None = None) -> None:
        self.entity_callbacks.setdefault(platform, []).append((cb, entry_id))
        for entity in list(self.entities.values()):
            if entity.platform == platform:
                self._maybe_fire_callback(cb, entry_id, entity)

    def _maybe_fire_callback(self, cb: EntityCallback, entry_id: str | None, entity: EntityModel) -> None:
        remote_mac = norm_mac(entity.remote_mac)
        if remote_mac in self._remote_entry_ids:
            if self._remote_entry_ids[remote_mac] == entry_id:
                cb(entity)
        elif entry_id is None:
            cb(entity)

    def register_remote_entry(self, remote_mac: str, entry_id: str) -> None:
        remote_mac = norm_mac(remote_mac)
        self._remote_entry_ids[remote_mac] = entry_id
        self._pending_remote_discoveries.discard(remote_mac)

    def _remove_stale_remote_devices(self, remote_mac: str, keep_entry_id: str) -> None:
        registry = dr.async_get(self.hass)
        live_entry_ids = {
            entry.entry_id
            for entry in self.hass.config_entries.async_entries(DOMAIN)
        }
        identifier = (DOMAIN, remote_mac)
        # async_get_devices, not the deprecated registry.devices mapping or
        # async_get_device(identifiers=...) -- both stop working in HA 2027.8/2027.9.
        for device in registry.async_get_devices(identifiers={identifier}):
            if identifier not in device.identifiers:
                continue
            if keep_entry_id in device.config_entries:
                continue
            is_hub_owned = bool(self._hub_entry_id and self._hub_entry_id in device.config_entries)
            is_orphaned = not device.config_entries.intersection(live_entry_ids)
            if is_hub_owned or is_orphaned:
                registry.async_remove_device(device.id)

    async def ensure_remote_device(self, remote_mac: str, entry: ConfigEntry) -> None:
        remote_mac = norm_mac(remote_mac)
        remote = self.remotes.get(remote_mac)
        registry = dr.async_get(self.hass)
        self._remove_stale_remote_devices(remote_mac, entry.entry_id)
        via_identifier = (DOMAIN, norm_mac(remote.bridge_mac)) if remote and remote.bridge_mac else None
        device = registry.async_get_or_create(
            config_entry_id=entry.entry_id,
            identifiers={(DOMAIN, remote_mac)},
            name=(remote.display_name if remote else entry.title or remote_mac),
            manufacturer=(remote.manufacturer if remote else "ESPHome"),
            model=(remote.model if remote else "esp_tree_remote"),
            sw_version=(remote.project_version if remote else None),
            via_device_id=_via_device_id(registry, via_identifier, self._hub_entry_id),
        )
        area_id = entry.data.get("area_id")
        if area_id and device.area_id != area_id:
            registry.async_update_device(device.id, area_id=area_id)
        self._schedule_device_id_map_send()

    async def _send_device_id_map(self) -> None:
        if not self.client or not self.client.connected:
            return
        entries = []
        registry = dr.async_get(self.hass)
        all_macs = set(self.remotes.keys())
        if self._hub_entry_id:
            for bridge_mac in self.bridge_snapshots:
                all_macs.add(norm_mac(bridge_mac))
        for mac in all_macs:
            mac = norm_mac(mac)
            identifier = (DOMAIN, mac)
            # async_get_devices, not the deprecated async_get_device(identifiers=...):
            # identifiers are only unique within a config entry, and this loop mixes
            # remote-owned macs with hub-owned bridge macs. async_get_devices returns
            # every match, so no config entry id is needed here.
            devices = registry.async_get_devices(identifiers={identifier})
            device = devices[0] if devices else None
            if device and device.id:
                entries.append(pb.DeviceIdEntry(remote_mac=mac, ha_device_id=device.id))
        if not entries:
            return
        envelope = pb.Envelope(
            api_version=API_VERSION,
            device_id_map=pb.DeviceIdMap(entries=entries),
        )
        try:
            await self.client.send(envelope)
            _LOGGER.info("Sent DeviceIdMap to add-on: %d entries", len(entries))
        except Exception:
            _LOGGER.debug("Failed to send DeviceIdMap to add-on", exc_info=True)

    def _schedule_device_id_map_send(self) -> None:
        if self._device_id_map_pending:
            return
        self._device_id_map_pending = True

        async def _do_send() -> None:
            self._device_id_map_pending = False
            await self._send_device_id_map()

        self.hass.async_create_task(_do_send())

    async def add_entry(self, entry: ConfigEntry) -> None:
        if entry.data.get(CONF_TYPE) != "hub":
            return
        if not self._store_loaded:
            await self._load_store()
            self._store_loaded = True
        addon_url = str(entry.data.get(CONF_ADDON_URL) or "")
        token = str(entry.data.get(CONF_INTEGRATION_TOKEN) or "")
        if not addon_url or not token:
            _LOGGER.warning("ESP Tree hub entry is missing add-on URL or integration token")
            ActivityLogger.get().warning("hub entry missing add-on URL or integration token")
            return
        self._hub_entry_id = entry.entry_id
        ActivityLogger.get().info("hub configured for add-on %s", addon_url)
        if self.client:
            await self.client.stop()
        self.client = IntegrationWSClient(
            self.hass,
            addon_url=addon_url,
            token=token,
            frame_handler=self.handle_frame,
            known_schema_provider=self.known_remote_schemas,
        )
        await self.client.start()

    def known_remote_schemas(self) -> list[tuple[str, str]]:
        return [
            (remote_mac, remote.schema_hash)
            for remote_mac, remote in self.remotes.items()
            if remote.schema_hash
        ]

    def parent_device_id(self, bridge_mac: str | None) -> str | None:
        """HA device id of the bridge that owns `bridge_mac`'s parent relationship.

        Used by entities' device_info to set via_device_id: the bridge device
        belongs to the hub config entry.
        """
        if not bridge_mac:
            return None
        registry = dr.async_get(self.hass)
        return _via_device_id(registry, (DOMAIN, norm_mac(bridge_mac)), self._hub_entry_id)

    async def remove_entry(self, entry: ConfigEntry) -> None:
        if entry.data.get(CONF_TYPE) == "remote":
            remote_mac = entry.data.get("remote_mac")
            if remote_mac:
                self._remote_entry_ids.pop(norm_mac(remote_mac), None)
            return
        if entry.data.get(CONF_TYPE) == "hub":
            self._hub_entry_id = None
            if self.client:
                await self.client.stop()
                self.client = None

    async def forget_remote(self, remote_mac: str) -> None:
        remote_mac = norm_mac(remote_mac)
        self._pending_remote_discoveries.discard(remote_mac)
        self._remote_entry_ids.pop(remote_mac, None)
        self.remotes.pop(remote_mac, None)
        for key in [entity_key for entity_key in self.entities if entity_key[0] == remote_mac]:
            self.entities.pop(key, None)
        await self.store.save_now(self._store_data())

    def subscribe_entity(self, remote_mac: str, object_id: str, cb: Callable[[], None]) -> Callable[[], None]:
        key = (norm_mac(remote_mac), object_id)
        self.update_callbacks.setdefault(key, []).append(cb)

        def unsub() -> None:
            callbacks = self.update_callbacks.get(key)
            if callbacks and cb in callbacks:
                callbacks.remove(cb)

        return unsub

    def subscribe_bridge(self, bridge_mac: str, cb: Callable[[], None]) -> Callable[[], None]:
        key = ("bridge", norm_mac(bridge_mac))
        self.update_callbacks.setdefault(key, []).append(cb)

        def unsub() -> None:
            callbacks = self.update_callbacks.get(key)
            if callbacks and cb in callbacks:
                callbacks.remove(cb)

        return unsub

    def subscribe_remote(self, remote_mac: str, cb: Callable[[], None]) -> Callable[[], None]:
        key = ("remote", norm_mac(remote_mac))
        self.update_callbacks.setdefault(key, []).append(cb)

        def unsub() -> None:
            callbacks = self.update_callbacks.get(key)
            if callbacks and cb in callbacks:
                callbacks.remove(cb)

        return unsub

    def subscribe_bridge(self, bridge_mac: str, cb: Callable[[], None]) -> Callable[[], None]:
        key = ("bridge", norm_mac(bridge_mac))
        self.update_callbacks.setdefault(key, []).append(cb)

        def unsub() -> None:
            callbacks = self.update_callbacks.get(key)
            if callbacks and cb in callbacks:
                callbacks.remove(cb)

        return unsub

    def _notify_bridge(self, bridge_mac: str) -> None:
        for cb in self.update_callbacks.get(("bridge", norm_mac(bridge_mac)), []):
            cb()

    def _notify_remote(self, remote_mac: str) -> None:
        for cb in self.update_callbacks.get(("remote", norm_mac(remote_mac)), []):
            cb()

    async def handle_frame(self, env: pb.Envelope) -> None:
        kind = env.WhichOneof("msg")
        if kind == "auth_ok":
            return
        if kind == "full_snapshot":
            await self._handle_snapshot(env.full_snapshot)
        elif kind == "event_batch":
            self._handle_events(env.event_batch)

    async def _handle_snapshot(self, snapshot: pb.FullSnapshot) -> None:
        bridge_mac = norm_mac(snapshot.bridge.bridge_mac)
        self.bridge_snapshots[bridge_mac] = self._bridge_snapshot_data(snapshot)
        self._bridge_uptime_observed[bridge_mac] = (snapshot.bridge_runtime.uptime_s, time.time())
        await self._ensure_bridge_device(bridge_mac)
        if self._hub_entry_id:
            entry = self.hass.config_entries.async_get_entry(self._hub_entry_id)
            if entry and entry.data.get("bridge_mac") != bridge_mac:
                self.hass.config_entries.async_update_entry(
                    entry,
                    data={**entry.data, "bridge_mac": bridge_mac},
                )
                self.hass.async_create_task(
                    self.hass.config_entries.async_reload(entry.entry_id)
                )
        self._notify_bridge(bridge_mac)

        for remote in snapshot.remotes:
            remote_mac = norm_mac(remote.identity.remote_mac)
            self._merge_remote_snapshot(remote, bridge_mac, snapshot.snapshot_unix_ms)
            self._schedule_remote_discovery(
                remote_mac,
                remote.identity.friendly_name or remote.identity.esphome_name or remote_mac,
                bridge_mac,
            )

        self.hass.async_create_task(self.store.save(self._store_data()))

        n_remotes = len(snapshot.remotes)
        ActivityLogger.get().info(
            "snapshot: %d remotes from bridge %s", n_remotes, bridge_mac
        )

        direct_count = sum(
            1 for r in self.remotes.values()
            if r.hops_to_bridge == 1 and r.bridge_mac == bridge_mac
        )
        self.bridge_snapshots[bridge_mac]["direct_child_count"] = direct_count
        self._notify_bridge(bridge_mac)
        self._schedule_device_id_map_send()

    def _schedule_remote_discovery(self, remote_mac: str, name: str, bridge_mac: str) -> None:
        remote_mac = norm_mac(remote_mac)
        bridge_mac = norm_mac(bridge_mac)
        self._abort_stale_discovery_flow(remote_mac)
        if remote_mac in self._pending_remote_discoveries:
            return
        if remote_mac in self._remote_entry_ids:
            return
        existing = self.hass.config_entries.async_entry_for_domain_unique_id(DOMAIN, remote_mac)
        if existing:
            return
        self._pending_remote_discoveries.add(remote_mac)
        ActivityLogger.get().info(
            "remote discovered %s \"%s\" on bridge %s", remote_mac, name, bridge_mac
        )

        self.hass.async_create_task(
            self._async_create_remote_entry(
                remote_mac,
                name or remote_mac,
                bridge_mac,
            )
        )

    def _abort_stale_discovery_flow(self, remote_mac: str) -> None:
        """Clear a parked discovery flow for this remote before starting a new one.

        Home Assistant refuses to start a second flow for the same (handler, unique id)
        with `already_in_progress`. A flow that stopped at `discovery_confirm` used to
        wait forever for a human, and because no UI ever rendered it the remote could
        never be added -- every later discovery attempt was refused by that corpse.
        That is what leaves the device page showing "Entities: Not Yet Added" while the
        only offered remedy (Devices & Services) aborts with `already_configured`.

        Only flows we are about to supersede are aborted, and only ones belonging to
        this domain.
        """
        try:
            flow_manager = self.hass.config_entries.flow
            progress_entries = list(getattr(flow_manager, "async_progress")())
            for progress in progress_entries:
                if progress.get("handler") != DOMAIN:
                    continue
                context = progress.get("context") or {}
                if norm_mac(context.get("unique_id") or "") != remote_mac:
                    continue
                flow_id = progress.get("flow_id")
                if not flow_id:
                    continue
                _LOGGER.info(
                    "aborting stale ESP Tree discovery flow %s (step %s) for %s",
                    flow_id,
                    progress.get("step_id"),
                    remote_mac,
                )
                self.hass.config_entries.flow.async_abort(flow_id)
        except Exception:
            _LOGGER.debug("could not reconcile stale discovery flows", exc_info=True)

    async def _async_create_remote_entry(self, remote_mac: str, name: str, bridge_mac: str) -> None:
        try:
            result = await self.hass.config_entries.flow.async_init(
                DOMAIN,
                context={"source": SOURCE_INTEGRATION_DISCOVERY},
                data={
                    "remote_mac": remote_mac,
                    "name": name,
                    "bridge_mac": bridge_mac,
                },
            )
            if result.get("type") != "create_entry" and remote_mac not in self._remote_entry_ids:
                self._pending_remote_discoveries.discard(remote_mac)
        except Exception:
            self._pending_remote_discoveries.discard(remote_mac)
            raise

    async def _ensure_bridge_device(self, bridge_mac: str) -> None:
        entry = self.hass.config_entries.async_get_entry(self._hub_entry_id) if self._hub_entry_id else None
        if not entry:
            return
        bridge_snapshot = self.bridge_snapshots.get(bridge_mac, {})
        base_name = bridge_snapshot.get("friendly_name") or bridge_snapshot.get("esphome_name") or bridge_snapshot.get("label") or "ESP Tree Bridge"
        bridge_name = f"[Bridge] {base_name}"
        registry = dr.async_get(self.hass)
        registry.async_get_or_create(
            config_entry_id=entry.entry_id,
            identifiers={(DOMAIN, bridge_mac)},
            name=bridge_name,
            manufacturer="ESPHome",
            model="esp_tree_bridge",
        )
        ActivityLogger.get().info("bridge device configured %s \"%s\"", bridge_mac, bridge_name)

    @callback
    def _merge_remote_snapshot(self, snapshot: pb.RemoteSnapshot, bridge_mac: str, observed_ms: int) -> None:
        ident = snapshot.identity
        runtime = snapshot.runtime
        remote_mac = norm_mac(ident.remote_mac)
        remote = self.remotes.setdefault(remote_mac, RemoteModel(remote_mac=remote_mac))
        remote.name = ident.friendly_name
        remote.esphome_name = ident.esphome_name
        remote.manufacturer = ident.manufacturer or "ESPHome"
        remote.model = ident.model or "esp_tree_remote"
        remote.project_name = ident.project_name
        remote.project_version = ident.project_version
        remote.firmware_build_date = ident.firmware_build_date
        remote.firmware_md5 = ident.firmware_md5
        remote.schema_hash = ident.schema_hash
        remote.bridge_mac = norm_mac(runtime.bridge_mac or bridge_mac)
        remote.parent_mac = norm_mac(runtime.parent_mac)
        remote.session_id = runtime.session_id
        remote.last_tx_counter = runtime.last_tx_counter
        bridge_uptime_s = self._effective_bridge_uptime(bridge_mac)
        elapsed_s = bridge_uptime_s - runtime.last_seen_bridge_uptime_s if runtime.last_seen_bridge_uptime_s > 0 and bridge_uptime_s > 0 else 0
        elapsed_ms = elapsed_s * 1000
        remote.last_live_observed_ms = elapsed_ms if elapsed_ms > 0 else (observed_ms or 0)
        remote.last_seen_bridge_uptime_s = runtime.last_seen_bridge_uptime_s
        remote.last_seen_observed_at = time.time()
        remote.online = runtime.online
        if not runtime.online and runtime.last_seen_bridge_uptime_s != 0:
            remote.offline_started_at = int(time.time()) - elapsed_s if elapsed_s > 0 else None
        remote.rssi = runtime.rssi
        remote.hops_to_bridge = runtime.hops_to_bridge
        remote.uptime_s = runtime.uptime_s
        remote.uptime_observed_at = time.time()
        _LOGGER.debug("merge_remote_snapshot %s: uptime_s=%d last_seen_bridge_uptime_s=%d", remote_mac, runtime.uptime_s, runtime.last_seen_bridge_uptime_s)
        remote.chip_name = ident.chip_name
        entry_id = self._remote_entry_ids.get(remote_mac)
        if entry_id:
            entry = self.hass.config_entries.async_get_entry(entry_id)
            if entry:
                self.hass.async_create_task(self.ensure_remote_device(remote_mac, entry))
                self._schedule_device_id_map_send()

        seen: set[str] = set()
        for desc in snapshot.descriptor_set.entities:
            object_id = desc.object_id
            if not object_id:
                continue
            seen.add(object_id)
            entity = self.entities.get((remote_mac, object_id))
            if entity is None:
                entity = EntityModel(
                    remote_mac=remote_mac,
                    object_id=object_id,
                    platform=desc.platform,
                    name=desc.friendly_name or object_id,
                )
                self.entities[(remote_mac, object_id)] = entity
                remote.entities[object_id] = entity
                for cb, entry_id in self.entity_callbacks.get(entity.platform, []):
                    self._maybe_fire_callback(cb, entry_id, entity)
            entity.name = desc.friendly_name or object_id
            entity.native_type = desc.native_type
            entity.unit = desc.unit_of_measurement
            entity.device_class = desc.device_class
            entity.state_class = desc.state_class
            entity.options_json = desc.options_json
            entity.writable = desc.writable
            entity.available = remote.online
            entity.missing_from_schema = False
        for object_id, entity in remote.entities.items():
            if object_id not in seen:
                entity.available = False
                entity.missing_from_schema = True
                self._notify(entity)
        for state in snapshot.states:
            self._apply_state(remote_mac, state)
        self._notify_remote(remote_mac)

    @callback
    def _handle_events(self, batch: pb.EventBatch) -> None:
        for event in batch.events:
            kind = event.WhichOneof("kind")
            if kind == "remote_state":
                ev = event.remote_state
                remote_mac = norm_mac(ev.remote_mac)
                remote = self.remotes.get(remote_mac)
                if remote and self._accept_live(remote, norm_mac(ev.bridge_mac), ev.session_id, ev.tx_counter, ev.observed_unix_ms):
                    remote.bridge_mac = norm_mac(ev.bridge_mac)
                    remote.session_id = ev.session_id
                    remote.last_tx_counter = ev.tx_counter
                    remote.last_live_observed_ms = ev.observed_unix_ms
                    remote.online = True
                    self._touch_last_seen(remote, norm_mac(ev.bridge_mac))
                for state in ev.states:
                    self._apply_state(remote_mac, state)
                self._notify_remote(remote_mac)
            elif kind == "remote_availability":
                ev = event.remote_availability
                remote_mac = norm_mac(ev.remote_mac)
                remote = self.remotes.setdefault(remote_mac, RemoteModel(remote_mac=remote_mac))
                bridge_mac = norm_mac(ev.bridge_mac)
                if ev.online:
                    if self._accept_live(remote, bridge_mac, ev.session_id, ev.tx_counter, ev.observed_unix_ms):
                        remote.bridge_mac = bridge_mac
                        remote.session_id = ev.session_id
                        remote.last_tx_counter = ev.tx_counter
                        remote.last_live_observed_ms = ev.uptime_s * 1000
                        remote.online = True
                        remote.rssi = ev.rssi
                        remote.hops_to_bridge = ev.hops_to_bridge
                        remote.uptime_s = ev.uptime_s
                        remote.uptime_observed_at = time.time()
                        self._touch_last_seen(remote, bridge_mac)

                elif remote.bridge_mac == bridge_mac and remote.session_id == ev.session_id:
                    if remote.online:
                        remote.offline_started_at = int(time.time())
                    remote.online = False
                ActivityLogger.get().info(
                    "remote %s went %s", remote_mac, "online" if ev.online else "offline"
                )
                self._schedule_remote_discovery(remote_mac, remote.display_name, bridge_mac)
                for entity in remote.entities.values():
                    entity.available = remote.online
                    self._notify(entity)
                self._notify_remote(remote_mac)
            elif kind == "remote_schema_changed":
                ev = event.remote_schema_changed
                bridge_mac = norm_mac(ev.bridge_mac)
                self._merge_remote_snapshot(ev.snapshot, bridge_mac, 0)
                ActivityLogger.get().info(
                    "schema changed %s on bridge %s", ev.snapshot.identity.remote_mac, bridge_mac
                )
                self._schedule_remote_discovery(
                    ev.snapshot.identity.remote_mac,
                    ev.snapshot.identity.friendly_name or ev.snapshot.identity.esphome_name or ev.remote_mac,
                    bridge_mac,
                )
                self.hass.async_create_task(self.store.save(self._store_data()))
            elif kind == "remote_metadata_changed":
                ev = event.remote_metadata_changed
                remote_mac = norm_mac(ev.identity.remote_mac)
                bridge_mac = norm_mac(ev.runtime.bridge_mac)
                remote = self.remotes.setdefault(remote_mac, RemoteModel(remote_mac=remote_mac))
                remote.name = ev.identity.friendly_name
                remote.esphome_name = ev.identity.esphome_name
                remote.manufacturer = ev.identity.manufacturer or "ESPHome"
                remote.model = ev.identity.model or "esp_tree_remote"
                remote.project_name = ev.identity.project_name
                remote.project_version = ev.identity.project_version
                remote.firmware_build_date = ev.identity.firmware_build_date
                remote.schema_hash = ev.identity.schema_hash
                remote.bridge_mac = bridge_mac
                remote.parent_mac = norm_mac(ev.runtime.parent_mac)
                remote.session_id = ev.runtime.session_id
                remote.last_tx_counter = ev.runtime.last_tx_counter
                bridge_uptime_s = self._effective_bridge_uptime(bridge_mac)
                elapsed_s = bridge_uptime_s - ev.runtime.last_seen_bridge_uptime_s if ev.runtime.last_seen_bridge_uptime_s > 0 and bridge_uptime_s > 0 else 0
                remote.last_live_observed_ms = elapsed_s * 1000 if elapsed_s > 0 else 0
                remote.last_seen_bridge_uptime_s = ev.runtime.last_seen_bridge_uptime_s
                remote.last_seen_observed_at = time.time()
                remote.online = ev.runtime.online
                remote.rssi = ev.runtime.rssi
                remote.hops_to_bridge = ev.runtime.hops_to_bridge
                remote.uptime_s = ev.runtime.uptime_s
                remote.uptime_observed_at = time.time()
                remote.chip_name = ev.identity.chip_name
                self._schedule_remote_discovery(remote_mac, remote.display_name, bridge_mac)
                self._notify_remote(remote_mac)
                entry_id = self._remote_entry_ids.get(remote_mac)
                if entry_id:
                    entry = self.hass.config_entries.async_get_entry(entry_id)
                    if entry:
                        self.hass.async_create_task(self.ensure_remote_device(remote_mac, entry))
                        self._schedule_device_id_map_send()
                self.hass.async_create_task(self.store.save(self._store_data()))
            elif kind == "topology_changed":
                ev = event.topology_changed
                bridge_mac_tc = norm_mac(ev.bridge_mac)
                remote = self.remotes.get(norm_mac(ev.remote_mac))
                if remote:
                    remote.parent_mac = norm_mac(ev.parent_mac)
                    remote.hops_to_bridge = ev.hops_to_bridge
                    remote.rssi = ev.rssi
                    remote.uptime_s = ev.uptime_s
                    remote.uptime_observed_at = time.time()
                    if remote.online:
                        self._touch_last_seen(remote, bridge_mac_tc)
                    self._notify_remote(norm_mac(ev.remote_mac))
                    ActivityLogger.get().info(
                        "topology changed %s: parent=%s hops=%d rssi=%d",
                        ev.remote_mac, ev.parent_mac, ev.hops_to_bridge, ev.rssi
                    )
            elif kind == "bridge_heartbeat":
                ev = event.bridge_heartbeat
                bridge_mac = norm_mac(ev.bridge_mac)
                bridge = self.bridge_snapshots.setdefault(bridge_mac, {"mac": bridge_mac})
                bridge["uptime_s"] = ev.uptime_s
                self._bridge_uptime_observed[bridge_mac] = (ev.uptime_s, time.time())
                for rls in ev.remote_last_seen:
                    rls_remote = self.remotes.get(norm_mac(rls.remote_mac))
                    if rls_remote:
                        rls_remote.last_seen_bridge_uptime_s = rls.last_seen_bridge_uptime_s
                        rls_remote.last_seen_observed_at = time.time()
                self._notify_bridge(bridge_mac)

    def _accept_live(self, remote: RemoteModel, bridge_mac: str, session_id: str, tx_counter: int, observed_ms: int) -> bool:
        if not remote.session_id or remote.session_id != session_id:
            return True
        if remote.bridge_mac == bridge_mac:
            return tx_counter >= remote.last_tx_counter
        if tx_counter > remote.last_tx_counter:
            return True
        return observed_ms > remote.last_live_observed_ms

    def _apply_state(self, remote_mac: str, state: pb.EntityState) -> None:
        entity = self.entities.get((norm_mac(remote_mac), state.object_id))
        if not entity:
            return
        value_kind = state.WhichOneof("value")
        entity.value = getattr(state, value_kind) if value_kind else None
        entity.available = state.available
        entity.observed_unix_ms = state.observed_unix_ms
        self._notify(entity)

    def _notify(self, entity: EntityModel) -> None:
        for cb in self.update_callbacks.get((norm_mac(entity.remote_mac), entity.object_id), []):
            cb()

    async def _load_store(self) -> None:
        data = await self.store.load()
        for remote_mac, remote_data in data.get("remotes", {}).items():
            self.remotes[norm_mac(remote_mac)] = RemoteModel(remote_mac=norm_mac(remote_mac), **remote_data)
        for key, entity_data in data.get("entities", {}).items():
            remote_mac, object_id = key.split("|", 1)
            model = EntityModel(remote_mac=norm_mac(remote_mac), object_id=object_id, **entity_data)
            self.entities[(model.remote_mac, model.object_id)] = model
            self.remotes.setdefault(model.remote_mac, RemoteModel(remote_mac=model.remote_mac)).entities[model.object_id] = model

    def _store_data(self) -> dict[str, Any]:
        remotes = {
            mac: {
                "name": remote.name,
                "esphome_name": remote.esphome_name,
                "manufacturer": remote.manufacturer,
                "model": remote.model,
                "project_name": remote.project_name,
                "project_version": remote.project_version,
                "firmware_build_date": remote.firmware_build_date,
                "schema_hash": remote.schema_hash,
            }
            for mac, remote in self.remotes.items()
        }
        entities = {
            f"{mac}|{object_id}": {
                "platform": entity.platform,
                "name": entity.name,
                "native_type": entity.native_type,
                "unit": entity.unit,
                "device_class": entity.device_class,
                "state_class": entity.state_class,
                "options_json": entity.options_json,
                "writable": entity.writable,
            }
            for (mac, object_id), entity in self.entities.items()
        }
        return {"remotes": remotes, "entities": entities}

    def _bridge_snapshot_data(self, snapshot: pb.FullSnapshot) -> dict[str, Any]:
        ident = snapshot.bridge
        runtime = snapshot.bridge_runtime
        bridge_mac = norm_mac(ident.bridge_mac)
        name = ident.bridge_name or ident.friendly_name or bridge_mac
        return {
            "mac": bridge_mac,
            "node_key": bridge_mac.replace(":", ""),
            "device_unique_id": f"esp_tree_{bridge_mac.replace(':', '')}",
            "parent_mac": "",
            "name": name,
            "esphome_name": ident.bridge_name or name,
            "friendly_name": ident.friendly_name or name,
            "label": ident.friendly_name or name,
            "manufacturer": ident.manufacturer or "ESPHome",
            "model": ident.model or "esp_tree_bridge",
            "sw_version": ident.project_version,
            "project_name": ident.project_name,
            "firmware_version": ident.project_version,
            "firmware_build_date": ident.firmware_build_date,
            "online": runtime.online,
            "rssi": runtime.wifi_rssi,
            "hops": 0,
            "uptime_s": runtime.uptime_s,
            "offline_s": 0,
            "entity_count": runtime.remote_count,
            "route_v2_capable": True,
            "can_relay": True,
            "relay_enabled": True,
            "total_child_count": runtime.remote_count,
            "from_integration_api": True,
            "is_bridge": True,
            "network_id": ident.network_id,
            "chip_name": ident.chip_name,
            "bridge_uptime_s": runtime.uptime_s,
        }

    def topology_nodes(self) -> list[dict[str, Any]]:
        now = time.time()
        nodes: list[dict[str, Any]] = []
        nodes.extend(self.bridge_snapshots.values())
        for remote in self.remotes.values():
            remote_mac = norm_mac(remote.remote_mac)
            bridge_uptime_s = self._effective_bridge_uptime(remote.bridge_mac)
            lsbu = remote.last_seen_bridge_uptime_s
            lsbu_at = remote.last_seen_observed_at
            if lsbu > 0 and lsbu_at > 0 and bridge_uptime_s > 0:
                effective_lsbu = lsbu + max(0, int(now - lsbu_at))
                elapsed = bridge_uptime_s - effective_lsbu
                last_seen_ago = max(0, elapsed)
            elif remote.last_live_observed_ms > 0:
                last_seen_ago = remote.last_live_observed_ms // 1000
            else:
                last_seen_ago = None
            if remote.online and remote.uptime_s > 0 and remote.uptime_observed_at > 0:
                effective_uptime = remote.uptime_s + max(0, int(now - remote.uptime_observed_at))
            else:
                effective_uptime = remote.uptime_s
            nodes.append(
                {
                    "mac": remote_mac,
                    "node_key": remote_mac.replace(":", ""),
                    "device_unique_id": f"esp_tree_{remote_mac.replace(':', '')}",
                    "parent_mac": norm_mac(remote.parent_mac),
                    "name": remote.esphome_name or remote.display_name,
                    "esphome_name": remote.esphome_name,
                    "friendly_name": remote.display_name,
                    "label": remote.display_name,
                    "manufacturer": remote.manufacturer,
                    "model": remote.model,
                    "sw_version": remote.project_version,
                    "project_name": remote.project_name,
                    "firmware_version": remote.project_version,
                    "firmware_build_date": remote.firmware_build_date,
                    "online": remote.online,
                    "rssi": remote.rssi,
                    "hops": remote.hops_to_bridge,
                    "uptime_s": effective_uptime,
                    "chip_name": remote.chip_name,
                    "last_seen_ago": last_seen_ago,
                    "last_seen_bridge_uptime_s": lsbu,
                    "bridge_uptime_s": bridge_uptime_s,
                    "offline_started_at": remote.offline_started_at if not remote.online else None,
                    "entity_count": len(remote.entities),
                    "route_v2_capable": True,
                    "can_relay": False,
                    "relay_enabled": False,
                    "direct_child_count": 0,
                    "total_child_count": 0,
                    "from_integration_api": True,
                    "is_bridge": False,
                    "network_id": "",
                }
            )
        return nodes

    def bridge_connected(self) -> bool:
        return bool(self.client and self.client.connected)

    async def send_command(self, remote_mac: str, object_id: str, command: str, **args: Any) -> pb.CommandResult:
        remote = self.remotes[norm_mac(remote_mac)]
        if not self.client or not self.client.connected:
            raise RuntimeError("ESP Tree add-on is not connected")
        return await self.client.command(remote.remote_mac, object_id, command, **args)

    async def send_config_command(self, remote_mac: str, command: str, params: dict[str, Any]) -> pb.ConfigCommandResult:
        remote = self.remotes[norm_mac(remote_mac)]
        if not self.client or not self.client.connected:
            raise RuntimeError("ESP Tree add-on is not connected")
        return await self.client.config_command(remote.remote_mac, command, **params)


def get_runtime(hass: HomeAssistant) -> EspTreeRuntime:
    return hass.data[DOMAIN]["runtime"]
