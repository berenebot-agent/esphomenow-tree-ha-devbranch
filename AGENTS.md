# AGENTS.md — ESP Tree

## Project Overview

ESP Tree is a Home Assistant add-on for administering an ESP-NOW Long Range network. A **bridge** ESP32 connects to WiFi/MQTT and relays commands to **remote** ESP32 nodes over ESP-NOW LR. This repo is a monorepo containing both the HA add-on/integration and the device firmware.

**Determine your task domain before reading.** Most tasks only touch one domain. Read only the section relevant to your work:

- **Add-on / Integration** — Python backend (`app/`), HA integration (`ha_integration/`), UI (`ui/`)
- **Device Code** — ESP firmware components (`device_code/`), demos, compile/flash workflow

## Communication

When talking to the user, be concise — answer in 1-3 sentences or fewer. Avoid preamble, explanations, or conclusions.

## Repo Layout

```
.
├── app/                     ← Add-on Python backend (server, bridge clients, OTA, models, config)
├── ha_integration/          ← HA custom_component (entities, config flow, services, protobuf)
├── ui/                      ← Add-on web UI (React/Vite)
├── test/                    ← Add-on integration tests (Docker-based)
├── rootfs/                  ← Add-on Docker rootfs overlay
├── docs/                    ← Specs, roadmaps, archives
├── cache/                   ← Build artifacts (gitignored)
├── logs/                    ← Debug logs (gitignored)
├── scripts/                 ← Add-on utility scripts (log_listener.py, etc.)
├── device_code/
│   ├── components/components/  ← ESPHome external components
│   │   ├── esp_tree_bridge/        ← Bridge: WiFi + MQTT + ESP-NOW LR
│   │   ├── esp_tree_remote/        ← Remote: ESP-NOW LR only
│   │   ├── espnow_82xx_remote/     ← Legacy ESP8266
│   │   └── esp_tree_common/        ← Shared: crypto, types, protocol
│   ├── demos/                 ← Example YAML configs for bridge & remotes
│   ├── scripts/               ← Compile, flash, esplog, serial scripts
│   ├── tests/                 ← C++ unit tests (CMake, 17 test targets)
│   └── README.md             ← Device code spec and protocol docs
├── dev.sh                   ← Unified dev menu (interactive + CLI subcommands)
├── config.yaml              ← Add-on configuration
├── Dockerfile               ← Add-on container build
└── requirements.txt         ← Python dependencies
```

---

## Add-on / Integration

### Purpose

Administers the ESP-NOW network via the bridge: topology view, OTA firmware flashing, remote management, entity state tracking.

### Bridge Transport

All bridge communication uses **protobuf over WebSocket** — a single binary transport. There is no HTTP polling or REST bridge client.

- **`BridgeV2Client`** (`app/bridge_v2_client.py`) — per-bridge WebSocket connection to `/esp-tree/v2/pb` with subprotocol `esp-tree-pb`. HMAC-SHA256 challenge-response auth. Handles protobuf frames for topology, state, commands.
- **`BridgeV2Manager`** (`app/bridge_v2_client.py`) — manages all bridge connections, in-memory topology state, routing, and proxies frames between the HA integration and bridges.
- **`BridgeV2OTAClient`** (`app/bridge_v2_ota.py`) — OTA client wrapping `BridgeV2Client` for firmware flashing flow.

Proto definitions live at `app/protobuf/esp_tree_runtime.proto` and are synced with `ha_integration/custom_components/esp_tree/protobuf/esp_tree_runtime.proto` (QC pipeline verifies sync).

### Key Files

| File | Role |
|------|------|
| `app/server.py` | Add-on server entrypoint (FastAPI/Uvicorn, 2500+ lines) |
| `app/bridge_v2_client.py` | `BridgeV2Client` + `BridgeV2Manager` — sole bridge transport layer |
| `app/bridge_v2_ota.py` | `BridgeV2OTAClient` — OTA over WebSocket protobuf |
| `app/ota_worker.py` | OTA lifecycle: start, chunk transfer, status tracking, rejoin verification |
| `app/compile_worker.py` | ESPHome firmware compilation worker |
| `app/compiler.py` | ESPHome firmware compilation logic |
| `app/store.py` | Runtime store (JSON persistence) |
| `app/db.py` | SQLite database layer |
| `app/firmware_store.py` | Firmware binary storage and management |
| `app/config.py` | Configuration management |
| `app/models.py` | Data models |
| `app/yaml_store.py` | ESPHome YAML config storage |
| `app/yaml_scaffold.py` | YAML config scaffolding for new remotes |
| `app/pairing_store.py` | Remote pairing persistence |
| `app/network_discovery.py` | Network scan for bridge discovery |
| `ha_integration/custom_components/esp_tree/` | HA integration (entities, services, config flow) |

### HA Integration Architecture

The integration connects to the add-on (not directly to the bridge) via WebSocket protobuf:

- **`IntegrationWSClient`** (`integration_client.py`) — connects to add-on at `/esp-tree/integration/v1/pb`. Authenticates with JSON `{"type": "auth", "token": "..."}`, then exchanges binary protobuf `Envelope` messages. Auto-reconnects with exponential backoff.
- **`EspTreeRuntime`** (`bridge_runtime.py`) — central state manager. Stores all remotes, entities, and bridge snapshots. Has pub/sub callback system for entities to subscribe to state changes. Persists to SQLite at `/share/esp_tree/esp_tree.db`.
- **Three config entry types:** `hub` (add-on connection, one only), `remote` (auto-discovered per node), `bridge` (legacy, migrated on setup).
- **Auto-discovery:** unknown remotes reported via protobuf trigger a config flow for the user to assign an area.

### HA Integration Services

| Service | Parameters | Description |
|---------|-----------|-------------|
| `esp_tree.send_command` | `remote_mac`, `object_id`, `command`, `value` (optional) | Send command to remote entity |
| `esp_tree.forget_remote` | `remote_mac` | Remove remote config entry and device |
| `esp_tree.cleanup` | (none) | Wipe all integration data, preserving hub |

### HA Frontend WebSocket Endpoint

- `esp_tree/status` — returns `{connected, bridge_count, remote_count, version}`

### HA Integration Entities

The integration creates HA entities from bridge topology data. Supported platforms:
`sensor`, `binary_sensor`, `button`, `switch`, `number`, `text`, `select`, `alarm_control_panel`, `cover`, `fan`, `light`, `lock`, `valve`, `event`

Each entity subscribes to `EspTreeRuntime` state changes on `async_added_to_hass`. Entities expose remote-level metadata (RSSI, hops, session, schema_hash) as extra state attributes. Devices are parented to the bridge device in the HA device registry.

### OTA

- **Exclusively via WebSocket protobuf.** No HTTP OTA path exists.
- Flow: upload `.ota.bin` via REST (`POST /api/ota/upload`) → confirm flash (`POST /api/ota/start/{job_id}`) → `OTAWorker` begins V2 flow:
  1. Sends `OtaStartRequest` protobuf message to bridge over WebSocket
  2. Bridge responds with `OtaChunkRequest` messages (pull model — bridge requests chunks it needs)
  3. Add-on sends `OtaChunkBatch` messages (up to 6 chunks × 2048 bytes each)
  4. Bridge sends `OtaStatus` for progress
  5. On success → `WAITING_REJOIN` phase: polls topology via `BridgeV2Manager` to verify device rejoined with new firmware MD5 and build date
- One OTA job active at a time
- Firmware retention: configurable via `firmware_retention_days` (default 7 days)

### Remote Debug Logging

**Log server:** `scripts/log_listener.py` at `10.1.1.23:9999` (screen session, started by `dev.sh qc`)
**Log file:** `logs/esp_tree_debug.jsonl` (cleared if > 24h old)
**Read logs:** `curl http://10.1.1.23:9999/logs`

Both addon and integration use `remote_logger_dev_only.py` (temporary, remove when debugging complete). Attaches to root logger — all `logger.info/error/debug/warning` calls forwarded.

### Version Bumps

Do NOT manually bump version numbers. Handled automatically by `dev.sh qc` (bumps patch version on `server.py`, `config.yaml`, `ui/package.json`, and `manifest.json`). Add-on version and integration version are bumped independently (integration version may diverge).

### Python Environment

Add-on Python code runs inside a Docker container with FastAPI and all dependencies pre-installed. **Do not attempt to validate Python syntax or imports outside this environment** — `python`/`python3` commands are not available in the dev workspace, and attempting `py_compile` or import-based validation will fail. Trust that the code is correct if it follows existing patterns.

### Tests

Add-on tests: `test/` (Docker-based, run via `test/start.sh`)
Integration tests: `ha_integration/tests/` (pytest)

---

## Device Code

### Purpose

ESP firmware for bridge and remote nodes. ESPHome external components + demo YAML configs + C++ unit tests.

### Component Structure

| Component | Description |
|-----------|-------------|
| `esp_tree_bridge` | Bridge: WiFi + MQTT + ESP-NOW LR. Remote management, entity discovery, command routing, OTA flashing, web UI |
| `esp_tree_remote` | Remote: ESP-NOW LR only. Entity registration, state reporting, command reception, relay forwarding, OTA file reception |
| `espnow_82xx_remote` | Legacy ESP8266 remote variant |
| `esp_tree_common` | Shared: crypto (`espnow_crypto.cpp/h`), MAC utils, frame definitions, protocol types |

### Key Sub-components

**Bridge:**
- `bridge_protocol.h/cpp` — low-level protocol handling, packet routing
- `bridge_ota_manager.h/cpp` — `ESPNowOTAManager` OTA session state machine
- `bridge_api_proto_ws.h/cpp` — WebSocket protobuf transport to add-on
- `bridge_api_proto_messages.h/cpp` — protobuf encode/decode helpers
- `bridge_api_auth.h/cpp` — HMAC-SHA256 session-based API auth
- `bridge_json_utils.h/cpp` — JSON serialization (topology.json)

**Remote:**
- `remote_protocol.h/cpp` — protocol state machine
- `remote_file_receiver.h/cpp` — OTA file chunk reception over ESP-NOW

### Protocol Source of Truth

`device_code/components/esp_tree_common/espnow_types.h` — all protocol types, packet structures, field type enums, and constants. Currently protocol version 3 with v2 1470-byte packet support. Keep changes consistent across bridge and remote.

### Bridge Responsibilities

1. **WiFi + MQTT + ESP-NOW LR transport** initialization and lifecycle
2. **Discovery responder** — listen for `PKT_DISCOVER`, respond with nonce
3. **Join manager** — receive `PKT_JOIN`, check schema hash cache
4. **Schema handler** — iterate `SCHEMA_REQUEST`/`SCHEMA_PUSH`, publish MQTT discovery
5. **State forwarding** — receive `PKT_STATE`, decrypt, publish to MQTT, send `PKT_ACK`
6. **Command delivery** — receive HA commands from MQTT, deliver via `PKT_COMMAND`
7. **OTA over ESP-NOW** — `ESPNowOTAManager` handles firmware flashing to remotes
8. **Web UI v2** — session-authenticated web interface (session-based auth)
9. **Fragment reassembly** — inbound frames recombined via `pending_rx_frames_` deque
10. **Diagnostics** — uptime, connected node count, airtime stats, RAM stats

### Remote Responsibilities

1. **ESP-NOW LR only** (no WiFi/MQTT)
2. **Entity registration** — all HA platform types (14 platforms supported)
3. **State reporting** — full snapshot after join, delta updates on change
4. **Command reception** — apply `PKT_COMMAND`, send `PKT_ACK`
5. **Relay/leaf forwarding** — multi-hop forwarding with preferred parent(s), max hops, route TTL
6. **OTA over ESP-NOW** — file chunk reception via `remote_file_receiver`
7. **Heartbeat** — sent only if no other outbound packet in heartbeat interval

### Build & Verify

```bash
./device_code/scripts/ha_compile.sh               # Interactive menu (no args); uses Docker
./device_code/scripts/ha_compile.sh <demo> bf      # CLI: build + flash
./device_code/scripts/ha_compile.sh <demo> f       # Flash only (uses cached .ota.bin)
./device_code/scripts/ha_compile.sh <demo> b       # Build only
```

- Interactive menu keys: `1`-`N` toggle, `a` all, `n` none, `b` build, `f` flash, `bf` build+flash
- Cached firmware ages shown in menu
- Artifacts: `cache/builds/<demo>.bin` and `.ota.bin`

**Smart dev target:** Build what you touched — bridge/shared code → bridge; remote only → remote.

### C++ Tests

```bash
./dev.sh build-cpp     # CMake build (under device_code/tests/)
./dev.sh run-cpp       # Run with ctest
```

17 test targets covering: protocol logic, heartbeat, packet sizes, parse helpers, counters, fragment assembly, route expiry, join status codes, state machine, retry backoff, encryption (OpenSSL), hop encoding, fragment interleaving, error handling, boundary cases, file receiver, bridge OTA manager, bridge API proto messages.

### Live ESP Logging (esplog)

```bash
./device_code/scripts/ha_esplog_run.sh restart        # Start/restart service
./device_code/scripts/ha_esplog_run.sh status         # Confirm ready (HTTP server: UP)
curl http://localhost:5555/status
curl "http://localhost:5555/stream?since=0&device_id=<name>&limit=20"
```

- Base URL: `http://localhost:5555`
- Key endpoints: `/stream` (logs), `/status` (device list), `/ui` (dashboard)
- Logs: SQLite `cache/esplog.db` (7-day retention) + in-memory ring buffer
- Screen session `esplog` runs `esplog-master.py --serve --port 5555`
- Per-device containers `esplog-<device_id>`

### Constraints

- `device_code/demos/secrets.yaml` is gitignored — never commit secrets
- Show full build output — don't hide warnings/errors
- Prefer cached `.ota.bin` for flashing

### Source of Truth

Executable config > prose.
Key docs: `docs/esptree_radio_v3_spec.md` (definitive protocol spec), `docs/esptree_api_protobuf_spec.md` (protobuf API)

### Demo Configs

Available demos in `device_code/demos/`:
- `espnow-bridge-c5.yml` — Bridge on ESP32-C5
- `espnow-remote-1.yml` — Remote variant 1
- `espnow-remote-2.yml` — Remote variant 2
- `espnow-remote-aqua.yml` — Aqua remote
- `espnow-remote-esp01.yml` — ESP-01 remote
- `espnow-remote-esp12e.yml` — ESP-12E remote
- `espnow-remote-leaf.yml` — Leaf (repeater) remote
- `espnow-remote-us1.yml` — US1 remote
- `espnow-microusb-1.yml` — microUSB remote variant
- `secrets.example.yaml` — Template for required secrets

---

## Dev Menu (Shared)

`dev.sh` at repo root — supports both interactive menu (no args) and CLI subcommands:

```bash
dev.sh                         # Interactive menu
dev.sh compile                 # ESPHome build menu
dev.sh build-cpp               # Build C++ tests
dev.sh run-cpp                 # Run C++ tests
dev.sh qc                      # QC pipeline (protobuf regen, UI build, version bump, commit/push)
dev.sh qc quick                # QC with "QuickPush" commit message
dev.sh flash-usb <port> <demo> # USB flash (e.g. dev.sh flash-usb /dev/ttyUSB0 espnow-bridge-c5)
dev.sh esplog                  # View esplog
dev.sh clean                   # Clean builds and __pycache__
```

---

## When to Cross Domains

Most tasks stay in one domain. Cross-domain work is rare but explicit:

| Scenario | Domains Involved |
|----------|-----------------|
| Protocol changes (`espnow_types.h`) | Device Code → may affect protobuf parsing in Add-on |
| OTA flow changes | Add-on + Device Code (firmware format, bridge endpoints) |
| Entity mapping changes | Device Code (schema) → Add-on/Integration (entity display) |
| Protobuf schema (`esp_tree_runtime.proto`) | Add-on ↔ Integration (must stay in sync) |

When crossing domains, read both relevant sections and note any protocol coupling.
