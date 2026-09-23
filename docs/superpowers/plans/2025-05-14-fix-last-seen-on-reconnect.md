# Fix "Last Seen" Showing Incorrect Values After Restart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix nonsensical "last seen" values for remotes (particularly ESP8266) that appear after add-on restart when bridge/devices are already online.

**Architecture:** The root cause is a data flow ordering bug and missing node creation in event handlers. When `_remote_node()` processes snapshot data, `_effective_bridge_uptime()` returns 0 because `_bridge_uptime_observed` hasn't been populated yet. Additionally, `remote_availability` events don't create missing nodes, leaving stale data or no data until the next snapshot.

**Tech Stack:** Python (add-on backend, HA integration), Protobuf

---

## Bugs Found

### Bug 1: `_bridge_uptime_observed` populated after `_remote_node()` uses it (Add-on)

**File:** `app/bridge_v2_client.py:899-900`

`_snapshot_nodes()` calls `_remote_node()` for each remote at line 899, but `_bridge_uptime_observed` is set at line 900 — AFTER all remote nodes have been created. This means `_remote_node()` calls `_effective_bridge_uptime()` which returns 0, causing:
- `bridge_uptime_s = 0` stored in each node
- `_touch_last_seen()` (called via events later) uses `_effective_bridge_uptime()` which may return the wrong value if called before the first heartbeat after snapshot

While the `get_topology_list()` extrapolation mostly compensates for this (since both `bridge_uptime_s` and `last_seen_bridge_uptime_s` use the same wall-clock anchor), it leaves stale `bridge_uptime_s = 0` in the node dict and creates an unnecessary window of incorrect data.

### Bug 2: `remote_availability` doesn't create missing nodes (Add-on)

**File:** `app/bridge_v2_client.py:712-724`

After a bridge reconnect, the add-on removes stale nodes for remotes not in the snapshot (line 673-680). If a `remote_availability(online=true)` event arrives before the next snapshot (common for already-online remotes), the handler at line 712 only updates existing nodes — it doesn't create missing ones. Compare with the HA integration at line 407 which uses `setdefault` to create a `RemoteModel`.

This means `_touch_last_seen()` is never called for remotes that were removed by stale cleanup, so their `last_seen_bridge_uptime_s` stays stale or the node is absent entirely until the next full snapshot or `topology_changed` event.

### Bug 3: `get_topology_list()` doesn't recompute `last_seen_ago` for non-bridge nodes when extrapolation condition fails (Add-on)

**File:** `app/bridge_v2_client.py:573-579`

When `lsbu > 0 and lsbu_at > 0 and bridge_uptime_s > 0` is not met, the code falls through to `elif node.get("is_bridge")`. For non-bridge remotes, `last_seen_ago` retains whatever was in the dict — which could be 0 from `_remote_node()` or a stale value from a previous event. There's no fallback computation or `None` default for offline remotes.

Compare with the HA integration's `topology_nodes()` at line 620-627, which has a proper fallback to `last_live_observed_ms` and final `None` default.

### Bug 4 (Minor): `_remote_node()` `bridge_uptime_s` stored as 0 (Add-on)

**File:** `app/bridge_v2_client.py:936`

When `_effective_bridge_uptime()` returns 0 (Bug 1), `bridge_uptime_s = 0` is stored in the node dict. This value is never updated by heartbeat event handlers for remotes (only the bridge node gets `uptime_s` updated). The UI uses `bridge_uptime_s` to compute `last_seen_ago` for offline nodes (topology-node.ts line 9-11): `Math.max(0, node.bridge_uptime_s - node.last_seen_bridge_uptime_s)`. If `bridge_uptime_s = 0`, offline nodes show incorrect "last seen" values.

---

## Files to Modify

| File | What to fix |
|------|-------------|
| `app/bridge_v2_client.py` | Bug 1, 2, 3, 4 |
| `ha_integration/custom_components/esp_tree/bridge_runtime.py` | No changes needed — this side is correct |

No changes needed on the device code (C++) side or proto definitions. No changes needed on the HA integration side — it already has correct ordering and node creation.

---

### Task 1: Fix `_bridge_uptime_observed` ordering in `_snapshot_nodes()` (Bug 1 + 4)

**Files:**
- Modify: `app/bridge_v2_client.py:899-900`

- [ ] **Step 1: Move `_bridge_uptime_observed` assignment before `_remote_node()` calls**

In `_snapshot_nodes()`, move line 900 (`self._bridge_uptime_observed[...]`) to before line 899 (`nodes.extend(...)`).

Change:
```python
        nodes.extend(self._remote_node(remote, bridge_mac) for remote in snapshot.remotes)
        self._bridge_uptime_observed[bridge_mac] = (snapshot.bridge_runtime.uptime_s, time.time())
```

To:
```python
        self._bridge_uptime_observed[bridge_mac] = (snapshot.bridge_runtime.uptime_s, time.time())
        nodes.extend(self._remote_node(remote, bridge_mac) for remote in snapshot.remotes)
```

This ensures `_effective_bridge_uptime()` returns the correct value inside `_remote_node()`, fixing both `bridge_uptime_s` and `elapsed_s`/`last_seen_ago` computation.

- [ ] **Step 2: Verify the change is correct by reading the full method context**

Read `app/bridge_v2_client.py` lines 861-901 to confirm the swap is in the right place and doesn't affect the bridge node dict (which uses `snapshot.bridge_runtime.uptime_s` directly, not `_effective_bridge_uptime`).

---

### Task 2: Create missing nodes in `remote_availability` handler (Bug 2)

**Files:**
- Modify: `app/bridge_v2_client.py:704-728`

- [ ] **Step 1: Add node creation in the `remote_availability` handler when node doesn't exist**

Currently at line 712-724, the handler does `if node:` and skips updates when the node is missing. Add an `else` branch to create a placeholder node (similar to the `topology_changed` handler at lines 755-795).

Change the `remote_availability` handler from:

```python
            if kind == "remote_availability":
                ev = event.remote_availability
                remote_mac = normalize_mac(ev.remote_mac)
                bridge_mac = normalize_mac(ev.bridge_mac or client.bridge_mac)
                route = self._routes.setdefault(remote_mac, RemoteRoute(client.bridge_uuid, bridge_mac, remote_mac))
                route.bridge_uuid = client.bridge_uuid
                route.bridge_mac = bridge_mac
                route.session_id = ev.session_id
                node = self._topology_nodes.get(remote_mac)
                if node:
                    was_online = node.get("online", False)
                    node["online"] = bool(ev.online)
                    if was_online and not ev.online:
                        node["offline_started_at"] = int(time.time())
                    node["rssi"] = ev.rssi
                    node["hops"] = ev.hops_to_bridge
                    node["offline_reason"] = ev.reason
                    node["uptime_s"] = ev.uptime_s
                    node["_uptime_observed_at"] = time.time()
                    if ev.online:
                        self._touch_last_seen(node, bridge_mac)
                self.broadcast.emit(
                    "remote.availability",
                    {"mac": remote_mac, "online": bool(ev.online), "bridge_mac": bridge_mac, "reason": ev.reason},
                )
```

To:

```python
            if kind == "remote_availability":
                ev = event.remote_availability
                remote_mac = normalize_mac(ev.remote_mac)
                bridge_mac = normalize_mac(ev.bridge_mac or client.bridge_mac)
                route = self._routes.setdefault(remote_mac, RemoteRoute(client.bridge_uuid, bridge_mac, remote_mac))
                route.bridge_uuid = client.bridge_uuid
                route.bridge_mac = bridge_mac
                route.session_id = ev.session_id
                node = self._topology_nodes.get(remote_mac)
                if node:
                    was_online = node.get("online", False)
                    node["online"] = bool(ev.online)
                    if was_online and not ev.online:
                        node["offline_started_at"] = int(time.time())
                    node["rssi"] = ev.rssi
                    node["hops"] = ev.hops_to_bridge
                    node["offline_reason"] = ev.reason
                    node["uptime_s"] = ev.uptime_s
                    node["_uptime_observed_at"] = time.time()
                    if ev.online:
                        self._touch_last_seen(node, bridge_mac)
                elif ev.online:
                    eff_bu = self._effective_bridge_uptime(bridge_mac)
                    node = {
                        "mac": remote_mac,
                        "node_key": remote_mac.replace(":", ""),
                        "device_unique_id": f"esp_tree_{remote_mac.replace(':', '')}",
                        "parent_mac": None,
                        "name": remote_mac,
                        "esphome_name": None,
                        "friendly_name": remote_mac,
                        "label": remote_mac,
                        "manufacturer": "ESPHome",
                        "model": "esp_tree_remote",
                        "sw_version": None,
                        "project_name": None,
                        "firmware_version": None,
                        "firmware_build_date": None,
                        "firmware_md5": None,
                        "chip_name": None,
                        "online": True,
                        "rssi": ev.rssi,
                        "hops": ev.hops_to_bridge,
                        "offline_reason": ev.reason,
                        "offline_started_at": None,
                        "uptime_s": ev.uptime_s,
                        "_uptime_observed_at": time.time(),
                        "last_seen_ago": 0,
                        "last_seen_bridge_uptime_s": eff_bu,
                        "_last_seen_observed_at": time.time(),
                        "bridge_uptime_s": eff_bu,
                        "route_v2_capable": True,
                        "can_relay": False,
                        "relay_enabled": False,
                        "direct_child_count": 0,
                        "total_child_count": 0,
                        "from_v2_api": True,
                        "is_bridge": False,
                        "bridge_mac": bridge_mac,
                        "network_id": "",
                        "entity_count": 0,
                    }
                    self._topology_nodes[remote_mac] = node
                    logger.debug(
                        "bridge v2 %s: created placeholder node for %s (remote_availability)",
                        bridge_mac, remote_mac,
                    )
                self.broadcast.emit(
                    "remote.availability",
                    {"mac": remote_mac, "online": bool(ev.online), "bridge_mac": bridge_mac, "reason": ev.reason},
                )
```

The key design decisions:
- Only create placeholder on `ev.online == True` (offline events for unknown nodes are useless)
- Set `last_seen_bridge_uptime_s = eff_bu` and `_last_seen_observed_at = time.time()` so `last_seen_ago` computes to ~0
- Match the same fields as the `topology_changed` placeholder (lines 756-795)

---

### Task 3: Add fallback `last_seen_ago` computation in `get_topology_list()` (Bug 3)

**Files:**
- Modify: `app/bridge_v2_client.py:573-579`

- [ ] **Step 1: Add fallback `last_seen_ago` for non-bridge nodes when extrapolation conditions aren't met**

Currently, when `lsbu > 0 and lsbu_at > 0 and bridge_uptime_s > 0` fails, only bridge nodes get `last_seen_ago = None`. Non-bridge nodes retain stale `last_seen_ago` from the dict.

Change:
```python
            if lsbu > 0 and lsbu_at > 0 and bridge_uptime_s > 0:
                effective_lsbu = lsbu + max(0, int(now - lsbu_at))
                elapsed = bridge_uptime_s - effective_lsbu
                node["last_seen_ago"] = max(0, elapsed)
                node["bridge_uptime_s"] = bridge_uptime_s
            elif node.get("is_bridge"):
                node["last_seen_ago"] = None
```

To:
```python
            if lsbu > 0 and lsbu_at > 0 and bridge_uptime_s > 0:
                effective_lsbu = lsbu + max(0, int(now - lsbu_at))
                elapsed = bridge_uptime_s - effective_lsbu
                node["last_seen_ago"] = max(0, elapsed)
                node["bridge_uptime_s"] = bridge_uptime_s
            elif node.get("is_bridge"):
                node["last_seen_ago"] = None
            elif lsbu > 0 and bridge_uptime_s > 0:
                node["last_seen_ago"] = max(0, bridge_uptime_s - lsbu)
                node["bridge_uptime_s"] = bridge_uptime_s
            else:
                node["last_seen_ago"] = node.get("last_seen_ago")
```

The new `elif lsbu > 0 and bridge_uptime_s > 0` branch handles the case where `lsbu_at` is missing (e.g., stale node dict from before a reconnect). It computes a non-extrapolated `last_seen_ago` as a best-effort fallback. The final `else` preserves whatever was already in the dict (which could be `0` from `_remote_node()` or a stale value).

---

### Task 4: Verify and test

- [ ] **Step 1: Search for any other places in the add-on where `_effective_bridge_uptime()` returning 0 could cause issues**

Search `app/bridge_v2_client.py` for all calls to `_effective_bridge_uptime()` and verify each one:
- `_touch_last_seen` (line 383): guarded by `if effective > 0:` — correct
- `_remote_node` (line 908): was returning 0, now fixed by Task 1 ordering
- `get_topology_list` (line 570): now handled by Task 3 fallback
- `_handle_event_batch` topology_changed new node (line 756): guarded by `eff_bu` used directly — correct
- `_snapshot_nodes` bridge node (line 896): uses `snapshot.bridge_runtime.uptime_s` directly, not `_effective_bridge_uptime()` — correct

- [ ] **Step 2: Check the HA integration's `topology_nodes()` has no similar vulnerability**

Read `ha_integration/custom_components/esp_tree/bridge_runtime.py:611-668` and verify it has proper fallbacks.

The HA integration at line 620-627 has:
```python
if lsbu > 0 and lsbu_at > 0 and bridge_uptime_s > 0:
    ...
elif remote.last_live_observed_ms > 0:
    last_seen_ago = remote.last_live_observed_ms // 1000
else:
    last_seen_ago = None
```

This has a proper fallback hierarchy. No changes needed.

- [ ] **Step 3: Run linting/type checking**

Run: `cd /home/ben/projects/esphomenow-tree-ha && python -m py_compile app/bridge_v2_client.py`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add app/bridge_v2_client.py
git commit -m "fix: correct last_seen ordering and missing node creation in add-on

- Move _bridge_uptime_observed assignment before _remote_node() calls
  in _snapshot_nodes() so _effective_bridge_uptime() returns correct
  values during snapshot processing (Bug 1/4)

- Create placeholder nodes in remote_availability handler when node
  doesn't exist, matching topology_changed handler behavior (Bug 2)

- Add fallback last_seen_ago computation in get_topology_list() for
  cases where extrapolation condition fails (Bug 3)"
```