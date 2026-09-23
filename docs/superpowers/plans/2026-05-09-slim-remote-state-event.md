# Slim RemoteStateEvent Protobuf

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Slim `RemoteStateEvent` protobuf message to only `remote_mac` + `states[]`, eliminating 7 redundant fields already carried in `RemoteAvailabilityEvent`.

**Architecture:** Change protobuf definition in three repo locations (firmware `ESPLR_V2`, add-on `app/`, HA integration `ha_integration/`). Strip firmware encoder to emit only `remote_mac` + `states`. Update Python event handlers that read dropped fields. Regenerate Python stubs.

**Tech Stack:** protobuf3, C++ (firmware), Python (add-on + HA integration)

---

## File Map

| Role | File |
|------|------|
| Proto source of truth | `ESPLR_V2/components/esp_tree_bridge/proto/esp_tree_runtime.proto` |
| Proto in add-on | `ha_integration/custom_components/esp_tree/protobuf/esp_tree_runtime.proto` |
| Proto in app | `ha_integration/custom_components/esp_tree/protobuf/esp_tree_runtime.proto` (symlink or copy) |
| Firmware encoder | `ESPLR_V2/components/esp_tree_bridge/esp_tree_bridge.cpp:2441-2467` |
| HA integration handler | `ha_integration/custom_components/esp_tree/bridge_runtime.py:362-374` |
| App handler | `app/bridge_v2_client.py:502-507` |
| Generated stubs (HA) | `ha_integration/custom_components/esp_tree/protobuf/generated/esp_tree_runtime_pb2.py` |
| Generated stubs (HA) | `ha_integration/custom_components/esp_tree/protobuf/esp_tree_runtime_pb2.pyi` |
| Generated stubs (app) | `app/protobuf/generated/esp_tree_runtime_pb2.py` |
| Generated stubs (app) | `app/protobuf/esp_tree_runtime_pb2.pyi` |

---

## Task 1: Update proto definitions (3 files)

- [ ] **Step 1: Update ESPLR_V2 proto**

Modify: `ESPLR_V2/components/esp_tree_bridge/proto/esp_tree_runtime.proto:220-230`

```protobuf
message RemoteStateEvent {
  string              remote_mac = 1;
  repeated EntityState states = 2;
}
```

- [ ] **Step 2: Update add-on HA integration proto**

Modify: `ha_integration/custom_components/esp_tree/protobuf/esp_tree_runtime.proto:220-230`

```protobuf
message RemoteStateEvent {
  string              remote_mac = 1;
  repeated EntityState states = 2;
}
```

- [ ] **Step 3: Update add-on app proto**

Modify: `app/protobuf/esp_tree_runtime.proto:220-230`

```protobuf
message RemoteStateEvent {
  string              remote_mac = 1;
  repeated EntityState states = 2;
}
```

---

## Task 2: Update firmware encoder

- [ ] **Step 1: Rewrite api_runtime_encode_remote_state**

Modify: `ESPLR_V2/components/esp_tree_bridge/esp_tree_bridge.cpp:2441-2467`

The function currently encodes 9 fields. Strip to encode only `remote_mac` (field 1) and `states` (field 2):

```cpp
void ESPTreeBridge::api_runtime_encode_remote_state(const uint8_t *mac, const espnow_entity_schema_t &entity,
                                                     const std::vector<uint8_t> &value, espnow_field_type_t type,
                                                     std::vector<uint8_t> &out) const {
  const std::string object_id = entity.entity_id.empty() ? sanitize_object_id(entity.entity_name) : entity.entity_id;
  const uint64_t now_ms = runtime_now_unix_ms_();
  bridge_api::runtime_pb::envelope(out, "", bridge_api::runtime_pb::EVENT_BATCH, [&](bridge_api::runtime_pb::Writer &w) {
    w.message(1, [&](bridge_api::runtime_pb::Writer &event) {
      event.message(12, [&](bridge_api::runtime_pb::Writer &state) {
        state.string(1, mac_colon_string_(mac));
        state.message(2, [&](bridge_api::runtime_pb::Writer &st) {
          runtime_write_entity_state_(st, object_id, true, now_ms, type, value, entity.entity_options);
        });
      });
    });
  });
}
```

---

## Task 3: Update HA integration handler

- [ ] **Step 1: Strip dropped field reads from remote_state handler**

Modify: `ha_integration/custom_components/esp_tree/bridge_runtime.py:362-374`

Replace the `if remote and self._accept_live(...)` block that reads `ev.bridge_mac`, `ev.session_id`, `ev.tx_counter`, `ev.observed_unix_ms` — since those fields no longer exist in the protobuf:

```python
            if kind == "remote_state":
                ev = event.remote_state
                remote_mac = norm_mac(ev.remote_mac)
                remote = self.remotes.get(remote_mac)
                if remote:
                    remote.online = True
                for state in ev.states:
                    self._apply_state(remote_mac, state)
                self._notify_remote(remote_mac)
```

The `_accept_live` validation and remote metadata updates are now solely the domain of `remote_availability` events.

---

## Task 4: Update app handler

- [ ] **Step 1: Remove session_id update from remote_state handler**

Modify: `app/bridge_v2_client.py:502-507`

```python
            elif kind == "remote_state":
                ev = event.remote_state
                # remote_state no longer carries session_id — routing context
                # comes from remote_availability events
```

---

## Task 5: Regenerate Python protobuf stubs

- [ ] **Step 1: Regenerate HA integration stubs**

Run in `ha_integration/`:
```bash
cd /home/ben/projects/esphomenow-tree-ha && python -m grpc_tools.protoc \
  -I./custom_components/esp_tree/protobuf \
  --python_out=./custom_components/esp_tree/protobuf/generated \
  --pyi_out=./custom_components/esp_tree/protobuf/generated \
  ./custom_components/esp_tree/protobuf/esp_tree_runtime.proto
```

- [ ] **Step 2: Regenerate app stubs**

Run in root directory:
```bash
cd /home/ben/projects/esphomenow-tree-ha && python -m grpc_tools.protoc \
  -I./app/protobuf \
  --python_out=./app/protobuf/generated \
  --pyi_out=./app/protobuf/generated \
  ./app/protobuf/esp_tree_runtime.proto
```

---

## Task 6: Run qc.sh

- [ ] **Step 1: Run quality control**

```bash
cd /home/ben/projects/esphomenow-tree-ha && ./qc.sh
```

Expected: All checks pass. The proto change reduces wire size of every `RemoteStateEvent` by ~60-80 bytes.

---

## Verification

1. **Proto change verified:** `RemoteStateEvent` has exactly 2 fields in all 3 proto files
2. **Firmware encodes minimal:** `api_runtime_encode_remote_state` only writes `remote_mac` (1) and `states` (2)
3. **Python no longer reads dropped fields:** `bridge_runtime.py` does not access `ev.bridge_mac`, `ev.session_id`, `ev.tx_counter`, `ev.observed_unix_ms`, `ev.uptime_s`, `ev.rssi`, `ev.hops_to_bridge` from `RemoteStateEvent`
4. **Stubs regenerate without error:** Both `python -m grpc_tools.protoc` commands succeed
5. **qc.sh passes**