# ESPNow Tree: Integrated Home Assistant Integration Roadmap & Protobuf Runtime API v2 Specification

> Status: Integrated implementation-ready draft  
> Date: 2026-05-05  
> Source basis: concrete implementation roadmap from the main spec, strengthened with GLM's identity, multi-bridge overlay, snapshot, and lifecycle model.

---

## 1. Purpose

This document defines the next major architecture step for the ESPNow Tree project:

- keep the existing Home Assistant add-on as the admin, provisioning, compile, topology, diagnostics, and OTA tool
- add a bundled Home Assistant custom integration that owns Home Assistant devices, entities, runtime state, and service calls
- add a direct bridge runtime API for the integration using protobuf over a persistent WebSocket
- retain existing JSON/HTTP and JSON/WebSocket APIs for add-on/admin use and migration support
- keep radio and remote firmware changes minimal by reusing existing join/session/heartbeat/schema/state/command behavior wherever possible

The design goal is pragmatic robustness. The integration should feel native in Home Assistant, avoid tying remote devices to one bridge, and avoid over-engineering the radio layer.


The home assistant addon/integration repo is at: /home/ben/projects/esphomenow-tree-ha
The ESP device repo containing the bridge code is at:  /home/ben/projects/ESPLR_V2


---

## 2. Key Decisions

| Area | Decision |
|---|---|
| HA runtime owner | Custom integration owns HA config entries, devices, entities, runtime state, and service calls |
| Add-on role | Admin/provisioning/compile/topology/diagnostics/OTA UI |
| Integration to bridge transport | Protobuf over persistent WebSocket |
| Runtime endpoint | `/espnow-tree/v2/pb` preferred; `/espnow-tree/v2/ws` acceptable if already implemented, but choose one canonical endpoint before coding |
| Add-on to bridge transport | Existing JSON HTTP/WS retained |
| OTA | Remains on add-on/admin API, not protobuf runtime API |
| Config entry model | One HA config entry per bridge |
| Runtime model | Domain-level shared runtime overlays all bridge feeds |
| Bridge identity | Bridge is a HA device and config-entry source, not part of remote identity |
| Remote identity | `remote_mac` |
| Entity identity | `remote_mac + object_id` |
| Entity display name | Mutable metadata only, never stable identity |
| Command routing | Route to the current active bridge for that remote session |
| Multi-bridge behavior | Supported pragmatically using active source, `session_id`, and `tx_counter` |
| Schema changes | Eagerly reconcile; do not auto-delete missing entities on first disappearance |
| Remote/radio changes | Minimal; no required new radio field unless session derivation proves insufficient |
| Bridge authority | Bridge remains authoritative for topology, availability, schema, session state, and command execution |

---

## 3. Target Architecture

```text
Home Assistant
  Custom Integration: espnow_tree
    - one config entry per bridge
    - one persistent protobuf WS client per bridge
    - domain-level remote/entity runtime store
    - HA device/entity registry owner
    - HA services -> currently active bridge -> remote command

  Add-on: esphome-espnow-tree-ha
    - ingress UI
    - bridge flashing/provisioning
    - compile/build tooling
    - topology/admin/diagnostics
    - OTA
    - one-time bridge import helper for the integration

Bridge Firmware
  Existing radio/session/topology logic
  Existing admin APIs retained
  New protobuf runtime WS API for HA integration
  Snapshot and event publisher

Remotes
  Existing join/session/heartbeat/schema/state/command behavior
  Stable object_id discipline for entities
```

### Core Data Flow

| Data | Source | Path to HA |
|---|---|---|
| Bridge metadata | Bridge snapshot/event | Protobuf WS -> integration -> bridge device/diagnostics |
| Remote topology | Bridge snapshot/event | Protobuf WS -> integration -> remote metadata/diagnostics |
| Schema/descriptors | Bridge snapshot/schema event | Protobuf WS -> integration -> HA entity creation/update |
| State | Remote -> bridge -> protobuf event | Integration updates HA state directly |
| Availability | Bridge session/heartbeat timeout | Integration mirrors bridge authority, with stale-source protection |
| Entity commands | HA entity method/service | Integration -> active bridge -> existing `send_command_to_leaf()` path |
| Config commands | HA service call | Integration -> bridge -> existing config command path |
| OTA | Add-on UI | Add-on -> existing admin/OTA API -> bridge -> remote |

---

## 4. Responsibility Split

### 4.1 Add-on Responsibilities

- Flash and provision bridges.
- Generate or capture per-bridge API keys.
- Present bridge diagnostics, topology, and admin UI.
- Handle OTA and compile workflows.
- **Bundle and deploy the custom integration** on add-on install — no separate integration install step required.
- Offer a one-time import flow to the integration for newly provisioned bridges.
- Read HA state through Supervisor/API if the admin UI wants to display runtime entity state.

The add-on may help setup, but the integration must not depend on the add-on at runtime.

Add-on install behavior:
- On add-on install, integration files are copied to `custom_components/` making the integration immediately available in Home Assistant.
- No separate integration install step required.
- This is a required behavior, not optional.

### 4.2 Integration Responsibilities

- Own Home Assistant config entries.
- Own Home Assistant device and entity registry entries.
- Maintain one bridge client task per config entry.
- Maintain a shared domain runtime keyed by `remote_mac`.
- Merge multiple bridge views of the same remote.
- Expose state, availability, diagnostics, and service calls in HA.
- Persist last-known descriptors and remote metadata in HA storage.
- Raise repair issues for auth, version, network, and incompatible bridge problems.

### 4.3 Bridge Responsibilities

- Remain source of truth for current bridge-local session state.
- Expose topology, availability, schema, state, and command execution semantics.
- Provide a full snapshot after auth/client hello.
- Push runtime events over protobuf.
- Keep existing JSON/admin APIs working.

---

## 5. Identity Model

### 5.1 Bridge Identity

Bridge identity is for config entry ownership and diagnostic devices.

Required bridge fields:

- `bridge_mac`
- `bridge_name`
- `friendly_name`
- `network_id`
- `manufacturer`
- `model`
- `project_name`
- `project_version`
- `firmware_build_date`
- `api_version`

Recommended future field:

- `bridge_uid`

`bridge_uid` is useful for future-proofing, but is not required for the first integration slice because remote identity is bridge-independent.

### 5.2 Remote Identity

Canonical remote identity:

```text
remote_mac
```

This identity remains stable across:

- bridge roaming
- parent/relay changes
- bridge replacement
- network_id changes
- Home Assistant restarts
- config entry recreation

### 5.3 Entity Identity

Canonical entity identity:

```text
remote_mac + object_id
```

Rules:

- `object_id` must be stable for the logical entity across reflashes where that entity still exists.
- Display name is not part of identity.
- Home Assistant `entity_id` is not a protocol input and must not be used as a stable key.
- Bridge-local `entity_index` is transport-only and must never be persisted as identity.

### 5.4 Naming Model

Mirror ESPHome behavior pragmatically:

- `esphome_name`: stable technical node name where available
- `friendly_name`: mutable display name
- `object_id`: stable entity key
- HA `unique_id`: derived from `remote_mac + object_id`

---

## 6. Multi-Bridge Runtime Overlay Rules

This is the key GLM improvement to fold into the main implementation plan.

### 6.1 Active Bridge Rule

For a given remote, the active bridge is whichever bridge last delivered real live remote traffic for the current remote session.

Live remote traffic means:

- state update from the remote
- heartbeat from the remote
- availability event marking the remote online, when backed by an active session

Do not update active bridge based only on:

- schema refresh
- metadata-only update
- topology rebroadcast
- late offline event from an old bridge

### 6.2 Ordering Data

Every remote runtime event should carry:

- `remote_mac`
- `bridge_mac`
- `session_id`
- `tx_counter`, when the event originated from a remote packet
- `observed_unix_ms`

Use them like this:

- `session_id` separates old sessions from new sessions after rejoin.
- `tx_counter` orders traffic within the same session.
- receive wall-clock time is only a tiebreaker.

### 6.3 Session ID

`session_id` does not need to be globally monotonic. It only needs to be:

- stable for the lifetime of one remote session
- different after a new join/session is established
- exposed in startup snapshots and runtime events

Recommended bridge implementation:

```text
session_id = truncated_hash(bridge_nonce || remote_nonce || remote_mac || network_id)
```

This avoids adding a new radio-level field purely for HA integration.

### 6.4 Offline Rule

If bridge A emits an offline event for a remote, but bridge B has already emitted newer live traffic for that remote/session, ignore bridge A's offline event.

If the currently active bridge emits offline and no newer live traffic has arrived elsewhere, mark the remote unavailable.

### 6.5 Startup Rule

At startup:

- trust a bridge snapshot enough to populate bridge and remote state
- if snapshot says remote is online and includes current `session_id`, the remote is commandable immediately
- if snapshot says remote is offline, entities are unavailable but retained

### 6.6 Seamless Roam Rule

If a remote starts sending live traffic through another bridge before the old bridge times it out:

- keep the same HA device and entities
- switch active bridge
- do not create an availability blip
- ignore later stale offline from the old bridge

---

## 7. Repository Structure

Recommended integrated layout:

```text
esphomenow-tree-ha/
├── repository.yaml
├── hacs.json
├── docs/
│   ├── integration_roadmap_spec.md
│   └── api_v2_runtime.md
├── ha_integration/
│   └── custom_components/
│       └── espnow_tree/
│           ├── __init__.py
│           ├── manifest.json
│           ├── const.py
│           ├── config_flow.py
│           ├── repairs.py
│           ├── strings.json
│           ├── services.yaml
│           ├── protobuf/
│           │   ├── espnow_tree_runtime.proto
│           │   └── generated/
│           ├── bridge_client.py
│           ├── bridge_runtime.py
│           ├── store.py
│           ├── registry.py
│           ├── command_router.py
│           ├── coordinator.py
│           ├── device_model.py
│           ├── entity_model.py
│           ├── diagnostics.py
│           ├── services.py
│           ├── sensor.py
│           ├── binary_sensor.py
│           ├── switch.py
│           ├── light.py
│           ├── button.py
│           ├── number.py
│           ├── select.py
│           ├── text.py
│           ├── lock.py
│           ├── cover.py
│           ├── fan.py
│           ├── valve.py
│           ├── alarm_control_panel.py
│           ├── event.py
│           └── update.py
├── esphome-espnow-tree-ha/
│   ├── app/
│   │   ├── pairing_store.py
│   │   ├── integration_bundle.py
│   │   └── integration_import_api.py
│   ├── ui/
│   └── config.yaml
└── ESPLR_V2/
    └── components/
        └── espnow_lr_bridge/
            ├── proto/
            │   └── espnow_tree_runtime.proto
            ├── bridge_api_proto_ws.h
            ├── bridge_api_proto_ws.cpp
            ├── bridge_api_proto_router.h
            ├── bridge_api_proto_router.cpp
            ├── bridge_api_proto_messages.h
            └── bridge_api_proto_messages.cpp
```

Notes:

- `ha_integration/` is the authoritative integration source.
- Add-on must deploy integration files to `custom_components/` on add-on install.
- Integration must be usable without the add-on running (add-on is provisioning/admin only, not a runtime dependency).
- Do not hide integration source under add-on-only folders.

---

## 8. Protobuf Runtime API v2

### 8.1 Transport

- Endpoint: `ws://<bridge_host>:<bridge_port>/espnow-tree/v2/pb`
- Protocol name: `espnow-tree-pb`
- Frame type: WebSocket binary frames only
- Envelope: one serialized protobuf `Envelope` per binary frame
- Text frames: reject with error and close
- Max frame size: 65536 bytes initially
- Runtime client policy: one authenticated protobuf integration client per bridge

The existing JSON/HTTP and JSON/WS APIs remain for add-on/admin use.

### 8.2 Authentication Flow

1. Client opens WebSocket.
2. Bridge sends `AuthChallenge`.
3. Client replies `AuthResponse`.
4. Bridge sends `AuthOk` or `AuthFailed` and closes on failure.
5. Client sends `ClientHello`.
6. Bridge sends `FullSnapshot`.
7. Bridge begins live event stream.

HMAC input:

```text
espnow-tree-pb|v2|<client_kind>|<server_nonce>|<client_nonce>
```

HMAC:

- HMAC-SHA256
- key: per-bridge API key bytes
- output: raw 32 bytes preferred in protobuf

### 8.3 Envelope

```proto
syntax = "proto3";
package espnow.tree.runtime.v2;

message Envelope {
  string request_id = 1;
  uint32 api_version = 2;
  oneof msg {
    AuthChallenge auth_challenge = 10;
    AuthResponse auth_response = 11;
    AuthOk auth_ok = 12;
    AuthFailed auth_failed = 13;
    ClientHello client_hello = 14;
    FullSnapshot full_snapshot = 15;
    EventBatch event_batch = 16;
    CommandRequest command_request = 17;
    CommandResult command_result = 18;
    ConfigCommandRequest config_command_request = 19;
    ConfigCommandResult config_command_result = 20;
    Ping ping = 21;
    Pong pong = 22;
    Error error = 99;
  }
}
```

`request_id` is required for client request/response messages and optional for bridge-pushed events.

### 8.4 Auth Messages

```proto
message AuthChallenge {
  bytes server_nonce = 1;
  uint32 min_version = 2;
  uint32 max_version = 3;
  string protocol = 4; // "espnow-tree-pb"
  string bridge_mac = 5;
}

message AuthResponse {
  string client_kind = 1; // "ha_integration"
  string client_name = 2;
  bytes client_nonce = 3;
  bytes hmac_sha256 = 4;
}

message AuthOk {
  uint32 negotiated_version = 1;
  string server_name = 2;
  BridgeIdentity bridge = 3;
  BridgeCapabilities capabilities = 4;
}

message AuthFailed {
  string code = 1;
  string message = 2;
}
```

### 8.5 Client Hello And Snapshot

```proto
message ClientHello {
  bool request_full_snapshot = 1;
  string integration_version = 2;
  repeated KnownRemoteSchema known_remote_schemas = 3;
}

message KnownRemoteSchema {
  string remote_mac = 1;
  string schema_hash = 2;
}

message FullSnapshot {
  BridgeIdentity bridge = 1;
  BridgeRuntime bridge_runtime = 2;
  repeated RemoteSnapshot remotes = 3;
  uint64 snapshot_unix_ms = 4;
}
```

Startup always returns a full logical snapshot. `known_remote_schemas` is advisory for future optimization only.

### 8.6 Bridge Metadata

```proto
message BridgeIdentity {
  string bridge_mac = 1;
  string bridge_name = 2;
  string friendly_name = 3;
  string network_id = 4;
  string manufacturer = 5;
  string model = 6;
  string project_name = 7;
  string project_version = 8;
  string firmware_build_date = 9;
  string api_server = 10;
}

message BridgeCapabilities {
  bool supports_runtime_v2 = 1;
  bool supports_commands = 2;
  bool supports_schema_push = 3;
  bool supports_state_push = 4;
  bool supports_topology = 5;
  bool supports_config_commands = 6;
}

message BridgeRuntime {
  bool online = 1;
  sint32 wifi_rssi = 2;
  uint32 uptime_s = 3;
  uint32 remote_count = 4;
}
```

### 8.7 Remote Snapshot And Runtime

```proto
message RemoteSnapshot {
  RemoteIdentity identity = 1;
  RemoteRuntime runtime = 2;
  RemoteDescriptorSet descriptor_set = 3;
  repeated EntityState states = 4;
}

message RemoteIdentity {
  string remote_mac = 1;
  string esphome_name = 2;
  string friendly_name = 3;
  string manufacturer = 4;
  string model = 5;
  string project_name = 6;
  string project_version = 7;
  string firmware_build_date = 8;
  string firmware_md5 = 9;
  string schema_hash = 10;
  uint32 entity_count = 11;
  string chip_name = 12;
  bool can_relay = 13;
  bool relay_enabled = 14;
}

message RemoteRuntime {
  bool online = 1;
  string bridge_mac = 2;
  string parent_mac = 3;
  uint32 hops_to_bridge = 4;
  sint32 rssi = 5;
  uint32 offline_s = 6;
  uint64 last_seen_unix_ms = 7;
  string session_id = 8;
  uint32 last_tx_counter = 9;
}
```

### 8.8 Entity Descriptors

```proto
message RemoteDescriptorSet {
  string schema_hash = 1;
  repeated EntityDescriptor entities = 2;
}

message EntityDescriptor {
  string object_id = 1;
  string platform = 2;
  string friendly_name = 3;
  string icon = 4;
  string device_class = 5;
  string state_class = 6;
  string unit_of_measurement = 7;
  string entity_category = 8;
  bool disabled_by_default = 9;
  bool diagnostic = 10;
  bool writable = 11;
  string native_type = 12;
  string options_json = 13;
  repeated Option options = 14;
  CommandDescriptor command = 15;
}

message Option {
  string key = 1;
  string label = 2;
}

message CommandDescriptor {
  repeated string supported_commands = 1;
  repeated ArgumentDescriptor arguments = 2;
}

message ArgumentDescriptor {
  string name = 1;
  string value_type = 2; // bool, int, float, string
  bool required = 3;
  double min_value = 4;
  double max_value = 5;
  double step = 6;
}
```

The descriptor model supports both simple generic commands and richer future HA platforms without baking every HA service shape into the bridge.

### 8.9 Entity State

```proto
message EntityState {
  string object_id = 1;
  bool available = 2;
  uint64 observed_unix_ms = 3;
  oneof value {
    bool bool_value = 10;
    sint64 int_value = 11;
    double float_value = 12;
    string string_value = 13;
    bytes bytes_value = 14;
  }
}
```

Preferred first-cut state encoding:

| Platform/type | Preferred protobuf value |
|---|---|
| bool switch/binary | `bool_value` |
| integer position/select | `int_value` |
| float sensor/number | `float_value` |
| text/text_sensor/event/alarm | `string_value` |
| complex light/fan payload | `string_value` JSON, or `bytes_value` if reusing existing bridge serializer |

For implementation speed, complex existing JSON state can be sent as UTF-8 `string_value` and parsed in Python.

### 8.10 Runtime Events

```proto
message EventBatch {
  repeated Event events = 1;
}

message Event {
  oneof kind {
    BridgeHeartbeat bridge_heartbeat = 10;
    RemoteAvailabilityEvent remote_availability = 11;
    RemoteStateEvent remote_state = 12;
    RemoteSchemaChangedEvent remote_schema_changed = 13;
    RemoteMetadataChangedEvent remote_metadata_changed = 14;
    TopologyChangedEvent topology_changed = 15;
  }
}

message RemoteAvailabilityEvent {
  string remote_mac = 1;
  bool online = 2;
  string bridge_mac = 3;
  string session_id = 4;
  uint32 tx_counter = 5;
  uint64 observed_unix_ms = 6;
  sint32 rssi = 7;
  uint32 hops_to_bridge = 8;
  string reason = 9;
}

message RemoteStateEvent {
  string remote_mac = 1;
  string bridge_mac = 2;
  string session_id = 3;
  uint32 tx_counter = 4;
  repeated EntityState states = 5;
  uint64 observed_unix_ms = 6;
}

message RemoteSchemaChangedEvent {
  string remote_mac = 1;
  string bridge_mac = 2;
  string session_id = 3;
  string old_schema_hash = 4;
  RemoteSnapshot snapshot = 5;
}

message RemoteMetadataChangedEvent {
  RemoteIdentity identity = 1;
  RemoteRuntime runtime = 2;
}

message TopologyChangedEvent {
  string remote_mac = 1;
  string bridge_mac = 2;
  string parent_mac = 3;
  uint32 hops_to_bridge = 4;
  sint32 rssi = 5;
  uint64 observed_unix_ms = 6;
}

message BridgeHeartbeat {
  string bridge_mac = 1;
  uint64 bridge_unix_ms = 2;
  uint32 uptime_s = 3;
}
```

Schema changed events should eagerly include the fresh descriptor set and current states. Avoid forcing a second round trip unless payload size becomes a real problem.

---

## 9. Commands

### 9.1 Generic Command Request

```proto
message CommandRequest {
  string remote_mac = 1;
  string object_id = 2;
  string command = 3;
  repeated CommandArgument args = 4;
}

message CommandArgument {
  string name = 1;
  oneof value {
    bool bool_value = 10;
    sint64 int_value = 11;
    double float_value = 12;
    string string_value = 13;
  }
}

message CommandResult {
  string remote_mac = 1;
  string object_id = 2;
  string command = 3;
  string bridge_mac = 4;
  string session_id = 5;
  CommandStatus status = 6;
  string error_code = 7;
  string error_message = 8;
}

enum CommandStatus {
  COMMAND_STATUS_UNSPECIFIED = 0;
  COMMAND_STATUS_ACCEPTED = 1;
  COMMAND_STATUS_DELIVERED = 2;
  COMMAND_STATUS_FAILED = 3;
  COMMAND_STATUS_UNAVAILABLE = 4;
  COMMAND_STATUS_UNSUPPORTED = 5;
  COMMAND_STATUS_TIMEOUT = 6;
}
```

### 9.2 Bridge Mapping

The bridge maps:

```text
remote_mac + object_id -> bridge session -> entity_index -> send_command_to_leaf()
```

No remote radio command format change is required.

### 9.3 Platform Command Semantics

Initial platform mapping:

| Platform | HA command | Bridge command/value intent |
|---|---|---|
| switch | turn_on / turn_off | bool state |
| button | press | trigger |
| number | set_value | float |
| text | set_value | UTF-8 string |
| select | select_option | option key/index |
| light | turn_on / turn_off | state, brightness, color, effect as supported |
| fan | turn_on / turn_off / set_percentage | state/speed/oscillation/direction as supported |
| cover | open / close / stop / set_position | command + position |
| valve | open / close / set_position | command + position |
| lock | lock / unlock | lock state |
| alarm_control_panel | arm/disarm commands | command + optional code |

If existing bridge command decoder expects compact bytes internally, the protobuf router should translate the generic command into the existing internal payload before calling `send_command_to_leaf()`.

### 9.4 Config Commands

```proto
message ConfigCommandRequest {
  string remote_mac = 1;
  string command = 2;           // reboot, heartbeat_interval, force_rediscover, set_parent_mac, relay
  uint32 interval_seconds = 3;
  string parent_mac = 4;
  bool clear_parent = 5;
  bool relay_enable = 6;
}

message ConfigCommandResult {
  string remote_mac = 1;
  string command = 2;
  string bridge_mac = 3;
  string session_id = 4;
  CommandStatus status = 5;
  string error_code = 6;
  string error_message = 7;
}
```

---

## 10. Bridge Runtime Behavior

### 10.1 Startup Snapshot

After successful `ClientHello`, bridge sends one `FullSnapshot` containing:

- bridge identity and runtime data
- all currently known remotes
- each remote's current runtime state
- each remote's descriptor set
- current entity states where available

This is intentionally simpler than fragmented bootstrap.

### 10.2 Live Events

Bridge pushes:

- bridge heartbeat
- remote availability changes
- remote state updates
- schema changes with fresh descriptor/state snapshot
- material topology changes such as parent, hops, route, or RSSI changes

### 10.3 State Push Scope

Bridge only pushes state for remotes currently talking through that bridge. This matches the existing radio/session reality and avoids duplicate multi-writer traffic.

### 10.4 Availability Authority

Bridge remains primary authority for remote availability. The integration mirrors bridge availability but applies stale-source protection across bridges.

---

## 11. Home Assistant Integration Design

### 11.1 Domain

```text
espnow_tree
```

### 11.2 Config Entry Model

One config entry per bridge, storing:

- host
- port
- API key
- bridge MAC
- network ID
- optional display name
- protocol version/capability snapshot

### 11.3 Domain Runtime Manager

Because remotes can roam between bridges, use a domain-level runtime manager:

```python
class EspnowTreeRuntime:
    bridge_clients: dict[str, BridgeClient]          # bridge_mac -> client
    remotes: dict[str, RemoteRuntime]                 # remote_mac -> model
    entities: dict[tuple[str, str], EntityRef]        # (remote_mac, object_id) -> HA entity
```

Each config entry owns one bridge client, but the domain runtime owns remote/entity overlay logic.

### 11.4 Persistent Storage

Persist in HA storage:

- bridge metadata
- remote metadata
- last-known descriptor sets
- schema hashes
- last-known object IDs for cleanup comparison
- active-source hints if useful, but treat them as advisory after restart

Do not rely on memory-only discovery.

### 11.5 Entity Lifecycle

On descriptor discovery:

- retained `object_id`: update metadata in place
- new `object_id`: create new entity
- missing `object_id`: mark unavailable and annotate missing-from-current-schema
- do not auto-delete on first disappearance

Manual cleanup or repair flow can come later.

### 11.6 Device Creation

Bridge device:

```python
DeviceInfo(
    identifiers={(DOMAIN, bridge_mac_key)},
    name=bridge_name,
    manufacturer=manufacturer or "ESPHome",
    model=model or "espnow_lr_bridge",
    sw_version=project_version,
)
```

Remote device:

```python
DeviceInfo(
    identifiers={(DOMAIN, remote_mac_key)},
    name=friendly_name or esphome_name or remote_mac_key,
    manufacturer=manufacturer or "ESPHome",
    model=model or "espnow_lr_remote",
)
```

Remote device metadata should include current bridge, parent, hops, RSSI, relay flags, firmware/build information, and schema hash as diagnostics or device attributes where appropriate.

### 11.7 Platform Mapping

| Schema platform | HA platform |
|---|---|
| sensor | sensor |
| binary_sensor | binary_sensor |
| switch | switch |
| light | light |
| fan | fan |
| number | number |
| button | button |
| cover | cover |
| valve | valve |
| lock | lock |
| alarm_control_panel | alarm_control_panel |
| select | select |
| text | text |
| event | event |
| update | update, for firmware status if implemented later |

Diagnostic entities per bridge and remote should include RSSI, hops, uptime/last seen, online, current bridge, remote count, and version/capability information where useful.

### 11.8 Runtime Behavior

Bridge disconnect:

- start reconnect loop
- if not reconnected within a short grace period, mark bridge unavailable
- mark unavailable only remotes currently sourced from that bridge and not superseded elsewhere

Live event handling:

- same `session_id` and higher `tx_counter`: accept
- different `session_id`: treat as new active session and switch source
- old bridge offline for stale session: ignore

Command routing:

- route commands to the bridge that most recently produced live traffic for the remote's active session
- no active session means fail fast and expose entity unavailable
- do not fan commands out to multiple bridges

---

## 12. Add-on To Integration Pairing Flow

### 12.0 Add-on Install (Single Bundle)

On add-on install:
1. Integration files are copied to `custom_components/espnow_tree/`.
2. Integration becomes immediately available in Home Assistant (no separate install step).
3. Add-on is ready to provision bridges and trigger the import flow.

### 12.1 New Bridge Flow

1. Add-on flashes bridge firmware.
2. Add-on provisions or captures host, port, API key, bridge MAC, network ID, and display metadata.
3. Add-on stores a short-lived pending import record.
4. Integration setup flow discovers pending imports and prompts the user to confirm.
5. Integration creates its own config entry and stores final credentials in Home Assistant.
6. Pending import is deleted.

### 12.2 Pending Import Rules

- TTL: 10 minutes recommended
- one-time use
- local-only helper API
- never used as runtime dependency

### 12.3 Existing Bridge Flow

Manual setup supports host, port, and API key entry directly in the integration. The add-on is not required after setup.

### 12.4 Single Bundle Install

The add-on and integration are packaged together in a single custom repository. Installing the add-on deploys the integration to `custom_components/` automatically. The user performs one action (install the add-on) and both are ready with no separate integration install step required.

---

## 13. Required Bridge Firmware Changes

### 13.1 New Protobuf WS Endpoint

Add `/espnow-tree/v2/pb` with binary protobuf frames.

New files:

- `bridge_api_proto_ws.h/cpp`
- `bridge_api_proto_router.h/cpp`
- `bridge_api_proto_messages.h/cpp`
- `proto/espnow_tree_runtime.proto`

Modified files:

- `espnow_lr_bridge.h/cpp`
- `bridge_api_types.h`
- existing event/MQTT/WS publish hook locations

### 13.2 Authentication

Implement protobuf auth equivalent to existing HMAC challenge-response.

### 13.3 Snapshot Builder

Bridge must assemble `FullSnapshot` with:

- bridge metadata
- bridge runtime data
- all known remote snapshots
- remote descriptors
- current state values where available
- session ID and last tx counter for each online remote

### 13.4 Runtime Event Publisher

Add a protobuf outbound publisher that emits:

- bridge heartbeat
- remote availability
- remote state
- schema changed with snapshot payload
- topology changed
- metadata changed

This should sit alongside the existing MQTT/admin publish hooks rather than replacing them initially.

### 13.5 Session ID Exposure

Expose `session_id` per remote session.

Recommended:

- derive from existing join/session material
- do not add a new radio field unless bridge derivation is impossible or ambiguous

### 13.6 TX Counter Exposure

Expose last observed remote `tx_counter` on live packet-derived events and snapshots.

### 13.7 Command Router

Implement protobuf command handler:

1. normalize network ID and remote MAC
2. find active bridge-local remote session
3. resolve `object_id` to current `entity_index`
4. validate command and arguments against descriptor/options
5. translate to existing internal command payload
6. call existing `send_command_to_leaf()` path
7. return `CommandResult`

### 13.8 Backward Compatibility

Keep working:

- existing HTTP topology/admin endpoints
- existing JSON WebSocket API
- existing OTA/admin flow
- existing MQTT discovery/state during migration, if currently present

---

## 14. Required Radio Or Remote Changes

Preferred: minimal or none.

Do not add a new required radio identity field for HA. Use:

- `remote_mac`
- existing session/join material
- existing `tx_counter`

No new availability logic is required. Keep remote heartbeat and bridge timeout behavior.

Remote-side developer discipline required:

- stable `object_id` generation for logical entities
- schema hash changes when descriptors materially change
- avoid using display names as identity

---

## 15. Implementation Phases

### Phase 1: Finalise API Contract And Codegen

- choose canonical endpoint name: recommend `/espnow-tree/v2/pb`
- create shared `.proto` file
- generate Python protobuf bindings
- generate nanopb C bindings
- compile both sides
- add round-trip serialization tests
- document compatibility/version rules

Deliverable: protobuf schema and generated code compile on HA and bridge sides.

### Phase 2: Bridge Runtime Endpoint And Auth

- implement binary WS endpoint
- implement protobuf auth challenge/response
- implement `ClientHello`/`FullSnapshot` skeleton
- enforce one runtime client per bridge
- reject text frames and oversized frames
- verify existing JSON/admin API still works

Deliverable: integration test can connect, auth, send hello, and receive bridge-only snapshot.

### Phase 3: Full Snapshot Builder

- add bridge identity/runtime snapshot
- add remote identity/runtime snapshots
- include descriptor sets and state values
- expose `session_id` and `last_tx_counter`
- include bridge capability flags

Deliverable: HA-side test client can render bridge/remotes/entities from snapshot.

### Phase 4: Runtime Event Publisher

- push bridge heartbeat
- push remote availability events
- push remote state events
- push topology events
- push schema changed events with fresh snapshot
- batch events where useful, but do not over-optimise initially

Deliverable: state and availability update in a live client without polling.

### Phase 5: Home Assistant Integration Core

- create config flow
- create bridge client
- create domain runtime manager
- add persistent store
- add repair issues for auth/version/network problems
- create bridge device and diagnostics

Deliverable: bridge can be added as HA integration and remains connected.

### Phase 6: Remote Devices And Entities

- create remote devices from descriptors
- create initial sensor, binary_sensor, switch, button, number, select, text platforms
- add light/fan/cover/lock/valve/alarm after command/value semantics are confirmed
- implement availability and stale-source handling
- implement missing-from-current-schema behavior

Deliverable: remote entities appear natively in HA and update from protobuf events.

### Phase 7: Command Routing

- implement HA entity commands
- implement generic command request/result
- bridge maps `object_id` to `entity_index`
- validate command arguments
- add timeout/error handling
- add config command services

Deliverable: HA can control writable remote entities through the active bridge.

### Phase 8: Add-on Pairing And Bundling

- add pending import store
- add pending import API
- add UI flow after bridge provisioning
- add optional integration export/install helper
- document manual install path

Deliverable: add-on can provision a bridge and hand it to integration setup without becoming a runtime proxy.

### Phase 9: Migration And Hardening

- support MQTT/admin coexistence during transition
- add reconnection/backoff tests
- add multi-bridge roaming tests
- add stale offline suppression tests
- add schema change/missing entity tests
- add fuzz/invalid protobuf frame tests
- add performance/memory budget checks on bridge

Deliverable: robust beta-ready implementation.

---

## 16. Testing Strategy

### Bridge Tests

- protobuf encode/decode round trips
- auth success/failure
- reject text frames
- reject malformed/oversized protobuf frames
- full snapshot with zero, one, and many remotes
- schema changed event includes descriptor/state snapshot
- command request maps to correct `entity_index`
- command failure cases: unavailable, unsupported, timeout, invalid payload

### Integration Tests

- config flow manual bridge setup
- auth/version repair issues
- snapshot creates bridge and remote devices
- descriptor creates stable unique IDs
- entity names can change without identity change
- state events update HA entities
- stale offline from old bridge is ignored
- active bridge switches on newer live traffic
- removed schema entity is marked unavailable, not deleted

### System Tests

- bridge reboot
- HA restart
- integration reconnect
- remote rejoin
- remote roaming between bridges
- add-on OTA still works while integration runtime exists
- JSON/admin API compatibility retained

---

## 17. Open Items That Should Be Decided Before Coding

1. Canonical endpoint name: choose `/espnow-tree/v2/pb` or `/espnow-tree/v2/ws`. Recommendation: `/espnow-tree/v2/pb`.
2. Command payload approach: generic command arguments vs compact bytes. Recommendation: generic protobuf externally, translate to existing compact internal payload on bridge.
3. Complex state encoding for light/fan: typed protobuf later vs JSON string now. Recommendation: JSON string now for speed and compatibility.
4. First platform slice: decide whether to ship sensors/switches/buttons/numbers first before light/fan/cover complexity.
5. Decision: use `remote_mac` only for HA unique identity (dropped `network_id` from identity model).
6. Whether to keep MQTT enabled by default during transition. Recommendation: yes initially, then make optional/legacy once integration parity is proven.

---

## 18. Recommended First Cut

Implement the first cut in this order:

1. protobuf endpoint with auth and full snapshot
2. HA integration config flow and bridge diagnostics
3. remote devices and read-only entities
4. live state and availability events
5. active-source overlay using `session_id` and `tx_counter`
6. simple writable platforms: switch, button, number, text, select
7. complex writable platforms: light, fan, cover, valve, lock, alarm
8. add-on pairing/import helper
9. OTA/admin coexistence hardening

This gives native HA value early without destabilising OTA or the radio layer.
