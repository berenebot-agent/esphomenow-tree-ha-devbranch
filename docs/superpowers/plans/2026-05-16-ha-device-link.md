# HA Device Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "View in Home Assistant" link on the add-on device detail page that navigates to the corresponding HA device page.

**Architecture:** The HA integration looks up `device_id` from the device registry after creating/ensuring a device, then sends a `DeviceIdMap` protobuf message to the add-on over the existing integration WebSocket. The add-on stores the MAC→device_id mapping in `BridgeV2Manager` and includes `ha_device_id` in topology node data. The UI conditionally renders the link when `ha_device_id` is present.

**Tech Stack:** Protobuf (proto3), Python (FastAPI, protobuf), TypeScript (Lit web components)

---

## Protobuf Field Number Allocation & Direction Rules

The `Envelope.oneof msg` field numbers are allocated as follows. **These rules must be followed for all future protocol extensions to prevent bridge C++ parser conflicts:**

| Field Range | Direction | Owner | Notes |
|---|---|---|---|
| 10–22 | Bidirectional (bridge↔add-on and integration→add-on) | Shared | Auth, snapshots, events, commands, ping/pong |
| 23–29 | Reserved | — | Reserved for future bidirectional messages |
| 30–36 | Bidirectional (bridge↔add-on) | OTA | OTA flow messages |
| 37–39 | Reserved | — | Reserved for future OTA messages |
| 40–49 | Integration→Add-on only | Integration | **Never sent to bridge.** Bridge C++ parser does not handle these fields — it returns error for unknown `oneof` fields. Adding bridge-side fields here is safe because the bridge ignores them. But bridge must NEVER generate these. |
| 50–59 | Bridge→Integration only (via add-on) | Bridge | Bridge generates, add-on forwards to integration. |
| 90–99 | Reserved/special | — | 99 = Error (bidirectional) |

**This plan adds `device_id_map = 40` (integration→add-on direction).**

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `app/protobuf/esp_tree_runtime.proto` | Modify | Add `DeviceIdEntry`, `DeviceIdMap` messages and `device_id_map = 40` to Envelope |
| `app/protobuf/generated/esp_tree_runtime_pb2.py` | Regenerate | Auto-generated from proto |
| `app/protobuf/generated/esp_tree_runtime_pb2.pyi` | Regenerate | Auto-generated from proto (type stubs) |
| `ha_integration/.../protobuf/esp_tree_runtime.proto` | Copy | Must stay in sync with add-on proto |
| `ha_integration/.../protobuf/generated/esp_tree_runtime_pb2.py` | Regenerate | Auto-generated from proto |
| `ha_integration/.../protobuf/generated/esp_tree_runtime_pb2.pyi` | Regenerate | Auto-generated from proto (type stubs) |
| `app/bridge_v2_client.py` | Modify | Add `_device_id_map` dict, handle `device_id_map` in `handle_integration_frame()`, include `ha_device_id` in `_remote_node()` and bridge node dict |
| `ha_integration/.../integration_client.py` | Modify | Add public `send()` method |
| `ha_integration/.../bridge_runtime.py` | Modify | Add `_send_device_id_map()` method, call it from snapshot/event handlers |
| `ui/src/api/client.ts` | Modify | Add `ha_device_id?: string` to `TopologyNode` |
| `ui/src/components/device-detail.ts` | Modify | Render "View in Home Assistant" link when `ha_device_id` is present |

---

### Task 1: Update protobuf schema

**Files:**
- Modify: `app/protobuf/esp_tree_runtime.proto`
- Modify: `ha_integration/custom_components/esp_tree/protobuf/esp_tree_runtime.proto`

- [ ] **Step 1: Add DeviceIdEntry, DeviceIdMap messages and device_id_map field to proto**

Add to `app/protobuf/esp_tree_runtime.proto` after the `ConfigCommandResult` message (before `Ping`):

```protobuf
message DeviceIdEntry {
  string remote_mac = 1;
  string ha_device_id = 2;
}

message DeviceIdMap {
  repeated DeviceIdEntry entries = 1;
}
```

Add `device_id_map = 40` to the `Envelope.msg` oneof, after `ota_aborted = 36` and before `error = 99`:

```protobuf
    DeviceIdMap device_id_map = 40;
```

Add a comment block before the `Envelope` message documenting the field allocation:

```protobuf
// Envelope oneof msg field allocation:
//   10-22: Bidirectional (auth, snapshots, events, commands, ping/pong)
//   23-29: Reserved for future bidirectional messages
//   30-36: Bidirectional - OTA flow (bridge <-> add-on)
//   37-39: Reserved for future OTA messages
//   40-49: Integration -> Add-on only (never sent to bridge; bridge C++ parser
//          returns error for unknown oneof fields)
//   50-59: Bridge -> Integration only (via add-on)
//   90-98: Reserved
//   99:    Error (bidirectional)
message Envelope {
```

- [ ] **Step 2: Copy proto to integration directory**

```bash
cp app/protobuf/esp_tree_runtime.proto ha_integration/custom_components/esp_tree/protobuf/esp_tree_runtime.proto
```

- [ ] **Step 3: Regenerate protobuf Python bindings**

```bash
cd /home/ben/projects/esphomenow-tree-ha && python3 -m grpc_tools.protoc -I app/protobuf --python_out=app/protobuf/generated --pyi_out=app/protobuf/generated app/protobuf/esp_tree_runtime.proto && python3 -m grpc_tools.protoc -I app/protobuf --python_out=ha_integration/custom_components/esp_tree/protobuf/generated --pyi_out=ha_integration/custom_components/esp_tree/protobuf/generated app/protobuf/esp_tree_runtime.proto
```

- [ ] **Step 4: Verify proto sync**

```bash
diff app/protobuf/esp_tree_runtime.proto ha_integration/custom_components/esp_tree/protobuf/esp_tree_runtime.proto && echo "Proto files match" || echo "MISMATCH"
diff app/protobuf/generated/esp_tree_runtime_pb2.py ha_integration/custom_components/esp_tree/protobuf/generated/esp_tree_runtime_pb2.py && echo "pb2 files match" || echo "MISMATCH"
```

- [ ] **Step 5: Verify DeviceIdMap is importable**

```bash
python3 -c "import sys; sys.path.insert(0, 'app/protobuf/generated'); from esp_tree_runtime_pb2 import DeviceIdMap, Envelope; e = Envelope(device_id_map=DeviceIdMap(entries=[DeviceIdMap.DeviceIdEntry(remote_mac='AA:BB:CC:DD:EE:FF', ha_device_id='test123')])); print('device_id_map OK:', e.WhichOneof('msg'))"
```

- [ ] **Step 6: Commit proto changes**

```bash
git add app/protobuf/esp_tree_runtime.proto ha_integration/custom_components/esp_tree/protobuf/esp_tree_runtime.proto app/protobuf/generated/esp_tree_runtime_pb2.py app/protobuf/generated/esp_tree_runtime_pb2.pyi ha_integration/custom_components/esp_tree/protobuf/generated/esp_tree_runtime_pb2.py ha_integration/custom_components/esp_tree/protobuf/generated/esp_tree_runtime_pb2.pyi && git commit -m "feat: add DeviceIdMap protobuf message for HA device link (field 40)"
```

---

### Task 2: Add-on — Store and serve ha_device_id

**Files:**
- Modify: `app/bridge_v2_client.py`

- [ ] **Step 1: Add `_device_id_map` to `BridgeV2Manager.__init__`**

In `app/bridge_v2_client.py`, find the `BridgeV2Manager.__init__` method (around line 395) and add `self._device_id_map: dict[str, str] = {}` after the `_integration_clients` line:

```python
        self._integration_clients: dict[asyncio.Queue[bytes], IntegrationClientMeta] = {}
        self._device_id_map: dict[str, str] = {}
```

- [ ] **Step 2: Handle `device_id_map` in `handle_integration_frame`**

In `app/bridge_v2_client.py`, find the `handle_integration_frame` method. After the `ping` handler (around line 560-561), add a handler for `device_id_map`:

```python
        if kind == "ping":
            return pb.Envelope(
                request_id=env.request_id,
                api_version=API_VERSION,
                pong=pb.Pong(monotonic_ms=env.ping.monotonic_ms),
            ).SerializeToString()
        if kind == "device_id_map":
            for entry in env.device_id_map.entries:
                mac = normalize_mac(entry.remote_mac)
                if entry.ha_device_id:
                    self._device_id_map[mac] = entry.ha_device_id
                else:
                    self._device_id_map.pop(mac, None)
            return pb.Envelope(
                request_id=env.request_id,
                api_version=API_VERSION,
            ).SerializeToString()
```

- [ ] **Step 3: Add `ha_device_id` to `_remote_node()` output**

In `app/bridge_v2_client.py`, find the `_remote_node` method (around line 1052). Add `ha_device_id` to the returned dict. Add it after the `"network_id"` line (around line 1095):

```python
            "network_id": "",
            "ha_device_id": self._device_id_map.get(remote_mac, ""),
```

- [ ] **Step 4: Add `ha_device_id` to bridge node dict**

In `app/bridge_v2_client.py`, find the `_snapshot_nodes` method (starts around line 1008). In the bridge dict literal (the inline dict starting around line 1013), add after the `"bridge_uptime_s"` line (around line 1045):

```python
            "bridge_uptime_s": snapshot.bridge_runtime.uptime_s,
            "ha_device_id": self._device_id_map.get(bridge_mac, ""),
```

- [ ] **Step 5: Commit add-on changes**

```bash
git add app/bridge_v2_client.py && git commit -m "feat: add-on stores and serves ha_device_id from integration"
```

---

### Task 3: Integration — Send DeviceIdMap after device registry operations

**Files:**
- Modify: `ha_integration/custom_components/esp_tree/integration_client.py`
- Modify: `ha_integration/custom_components/esp_tree/bridge_runtime.py`

- [ ] **Step 1: Add public `send()` method to `IntegrationWSClient`**

In `ha_integration/custom_components/esp_tree/integration_client.py`, add a public `send()` method after the existing `_send` method (after line 152):

```python
    async def send(self, envelope: pb.Envelope) -> None:
        """Fire-and-forget send. No response expected."""
        await self._send(envelope)
```

- [ ] **Step 2: Add `_send_device_id_map()` method to `EspTreeRuntime`**

In `ha_integration/custom_components/esp_tree/bridge_runtime.py`, add a new method after `ensure_remote_device` (after line 105). This method collects all known device IDs and sends them to the add-on:

```python
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
            device = registry.async_get_device(identifiers={identifier})
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
        except Exception:
            _LOGGER.debug("Failed to send DeviceIdMap to add-on", exc_info=True)
```

Add the import for `API_VERSION` — check if it's already imported at the top of the file. It's imported from `.const` in `integration_client.py` but not in `bridge_runtime.py`. Add it to the existing imports in `bridge_runtime.py`:

In the imports at the top, find the line:
```python
from .const import CONF_ADDON_URL, CONF_BRIDGE_MAC, CONF_INTEGRATION_TOKEN, CONF_TYPE, DOMAIN
```

Change it to:
```python
from .const import API_VERSION, CONF_ADDON_URL, CONF_BRIDGE_MAC, CONF_INTEGRATION_TOKEN, CONF_TYPE, DOMAIN
```

- [ ] **Step 3: Call `_send_device_id_map()` from `_handle_snapshot`**

In `bridge_runtime.py`, find `_handle_snapshot` method. At the end of the method, after the `_notify_bridge` call (the second one, around line 259), add:

```python
        self.hass.async_create_task(self._send_device_id_map())
```

- [ ] **Step 4: Call `_send_device_id_map()` from `_merge_remote_snapshot`**

In `bridge_runtime.py`, find `_merge_remote_snapshot` method. After the `ensure_remote_device` call at line 356, find the line:

```python
                self.hass.async_create_task(self.ensure_remote_device(remote_mac, entry))
```

After it, add:

```python
                        self.hass.async_create_task(self._send_device_id_map())
```

- [ ] **Step 5: Call `_send_device_id_map()` from `_handle_events` after `remote_metadata_changed`**

In `bridge_runtime.py`, find `_handle_events` and the `remote_metadata_changed` branch. After the `ensure_remote_device` call at line 489:

```python
                        self.hass.async_create_task(self.ensure_remote_device(remote_mac, entry))
```

After it, add:

```python
                        self.hass.async_create_task(self._send_device_id_map())
```

- [ ] **Step 6: Call `_schedule_device_id_map_send()` from `register_remote_entry`**

In `bridge_runtime.py`, find `register_remote_entry` (line 67). Add a call to schedule the device ID map send:

```python
    def register_remote_entry(self, remote_mac: str, entry_id: str) -> None:
        remote_mac = norm_mac(remote_mac)
        self._remote_entry_ids[remote_mac] = entry_id
        self._pending_remote_discoveries.discard(remote_mac)
        self._schedule_device_id_map_send()
```

- [ ] **Step 7: Debounce `_send_device_id_map()` calls**

Steps 3-6 each call `self.hass.async_create_task(self._send_device_id_map())` directly. When processing a snapshot with many remotes, this would fire many sends. Replace all four calls with a debounced version.

Add `_device_id_map_pending` flag to `EspTreeRuntime.__init__`:

```python
        self._device_id_map_pending = False
```

Add a `_schedule_device_id_map_send()` method:

```python
    def _schedule_device_id_map_send(self) -> None:
        if self._device_id_map_pending:
            return
        self._device_id_map_pending = True

        async def _do_send() -> None:
            self._device_id_map_pending = False
            await self._send_device_id_map()

        self.hass.async_create_task(_do_send())
```

Now replace all four `self.hass.async_create_task(self._send_device_id_map())` calls from steps 3-6 with `self._schedule_device_id_map_send()`:
- End of `_handle_snapshot` (step 3)
- After `ensure_remote_device` in `_merge_remote_snapshot` (step 4)
- After `ensure_remote_device` in `remote_metadata_changed` handler (step 5)
- In `register_remote_entry` (step 6)

The end-of-snapshot call already covers bridge devices, so no separate call is needed after `_ensure_bridge_device`.

- [ ] **Step 8: Commit integration changes**

```bash
git add ha_integration/custom_components/esp_tree/integration_client.py ha_integration/custom_components/esp_tree/bridge_runtime.py && git commit -m "feat: integration sends DeviceIdMap to add-on after device operations"
```

---

### Task 4: UI — Add ha_device_id to TopologyNode and render link

**Files:**
- Modify: `ui/src/api/client.ts`
- Modify: `ui/src/components/device-detail.ts`

- [ ] **Step 1: Add `ha_device_id` to `TopologyNode` interface**

In `ui/src/api/client.ts`, find the `TopologyNode` interface (starts around line 1-30). Add the new field at the end of the interface:

```typescript
  network_id?: string;
  hidden?: boolean;
  ha_device_id?: string;
}
```

- [ ] **Step 2: Add "View in Home Assistant" link to device detail hero section**

In `ui/src/components/device-detail.ts`, find the hero section render. After the `</h2>` closing tag in the hero section (around line 139), add the link. Find this exact block:

```typescript
          <h2>${this.node.friendly_name || this.node.esphome_name || this.node.label || this.node.mac}<span class="mac-suffix"> ${this.node.mac}</span></h2>
          <div class="hero-stats">
```

Change it to:

```typescript
          <h2>${this.node.friendly_name || this.node.esphome_name || this.node.label || this.node.mac}<span class="mac-suffix"> ${this.node.mac}</span></h2>
          ${this.node.ha_device_id ? html`<a class="ha-link" href="/config/devices/device/${this.node.ha_device_id}" target="_blank" rel="noopener">View in Home Assistant</a>` : nothing}
          <div class="hero-stats">
```

Note: HA device page URL format is `/config/devices/device/<device_id>`, not `/device/<device_id>`. Verify this is correct for the current HA version.

- [ ] **Step 3: Add CSS for the link**

In `ui/src/components/device-detail.ts`, add the `.ha-link` style to the `static styles` block. Add after the `.hero-left h2` styles:

```css
    .ha-link {
      font-size: 13px;
      color: var(--primary-color, #3b82f6);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .ha-link:hover {
      text-decoration: underline;
    }
```

- [ ] **Step 4: Commit UI changes**

```bash
git add ui/src/api/client.ts ui/src/components/device-detail.ts && git commit -m "feat: add View in Home Assistant link on device detail page"
```

---

### Task 5: Verify HA device URL format

**Before executing Task 4, verify the correct HA URL format.**

- [ ] **Step 1: Check HA device URL format**

HA device pages use the URL format `/config/devices/device/<device_id>`. This was confirmed by looking at HA's frontend routing. The add-on runs under ingress, so relative paths resolve to the HA instance.

If the URL format is different (e.g., `/device/<device_id>`), update the `href` in Task 4 Step 2 accordingly.

---

### Task 6: Verify end-to-end data flow

- [ ] **Step 1: Build the UI**

```bash
cd /home/ben/projects/esphomenow-tree-ha/ui && npm run build
```

- [ ] **Step 2: Run C++ tests to verify bridge firmware is unaffected**

```bash
cd /home/ben/projects/esphomenow-tree-ha && ./dev.sh run-cpp
```

- [ ] **Step 3: Verify proto sync with QC pipeline**

```bash
cd /home/ben/projects/esphomenow-tree-ha && ./dev.sh qc
```

Note: `dev.sh qc` bumps version, so this may create a commit. Only run if you want a version bump.

- [ ] **Step 4: Manual integration test checklist**

With a running add-on + integration + bridge:
1. Verify integration sends `DeviceIdMap` after snapshot processing (check add-on logs)
2. Verify `/api/bridge/topology.json` includes `ha_device_id` for known remotes
3. Verify device detail page shows "View in Home Assistant" link
4. Click link → opens HA device page in new tab
5. Verify link is hidden for remotes not yet registered in HA
6. Verify reconnection re-populates `ha_device_id`