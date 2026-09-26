# ESP Tree

ESP Tree puts ESPHome-style ESP32 sensor and actuator nodes on a **Home Assistant
add-on + integration**, talking over **ESP-NOW** to one active bridge over WiFi
or a wired serial transport. Both ESP-NOW Long Range (LR) and regular mode are
supported; the shipped reference demos currently use regular mode.

- A **bridge** (ESP32-C5 in the reference build) coordinates the nodes and
  forwards remote OTA. A WiFi bridge can expose MQTT discovery and/or the
  protobuf WebSocket API; a serial bridge carries the protobuf API over UART.
- **Remotes / leaves** (ESP32 classic/C3 in the shipped ESPHome demos, with
  ESP8266 support through the legacy component) declare ordinary ESPHome
  entities — sensor, text_sensor, switch, binary_sensor, button, number, select,
  text, light, fan, cover, valve, lock, alarm_control_panel, event — and the
  add-on manages the network: topology, diagnostics, compile, flash, OTA and
  reflash-as-rollback.
- An optional **relay** node forwards encrypted frames to extend range. Relays
  are blind: only the bridge and the leaf hold the session key.

The add-on is the management plane and the HA integration is a client of it; the
integration never talks to the bridge directly. Multiple bridge records can be
stored, but at most one is active at a time.

## Repository layout

| Path | Contents |
|------|----------|
| `app/` | Add-on backend (FastAPI), bridge WiFi/serial clients, OTA/compile workers, stores, protobuf |
| `ha_integration/custom_components/esp_tree/` | Home Assistant integration: entities, services, config flow, repairs |
| `ui/` | Lit/Vite web interface served through HA ingress |
| `device_code/components/` | ESPHome external components: `esp_tree_bridge`, `esp_tree_remote`, `espnow_82xx_remote`, `esp_tree_common` |
| `device_code/demos/` | Firmware configurations (bridge, remotes, serial-transport variant) |
| `device_code/tests/` | C++ unit tests |
| `test/` | Standalone add-on UI harness; Home Assistant-only setup and cleanup actions are unavailable |
| `scripts/`, `device_code/scripts/` | Development, compile, flash and logging helpers |
| `docs/` | Protocol, API, roadmap and workplan documents |
| `rootfs/` | Container init: installs the integration into `/config`, announces discovery |

See `CONTRIBUTING.md` for the per-domain entry points and
`docs/ESP_ha-addon-plan.md` for the add-on design.

## Requirements

- **Home Assistant OS or Supervised** for the add-on. It uses ingress for user
  auth and `SUPERVISOR_TOKEN` for the Core API, and installs the integration into
  `/config/custom_components` (mounted as `/homeassistant` inside the add-on).
- An **ESP32** board for the bridge. The reference bridge demos use
  `esp32-c5-devkitc-1`; shipped remote demos use classic ESP32, ESP32-C3 and
  ESP8266 boards. ESP8266 (ESP-01/ESP-12E) leaves use `espnow_82xx_remote`, are
  regular-mode only, and have the limitations documented in
  `docs/esptree_radio_v3_spec.md` § ESP82xx Leaf Limitations.
- **Docker** for developer firmware builds and the standalone add-on test
  environment. Firmware compilation initiated inside the add-on runs in its
  container and bootstraps a local ESPHome virtual environment.
- **Chrome or Edge over HTTPS** for browser-based USB flashing. The UI loads
  `esp-web-tools` and `esptool-js` from `unpkg.com`, so those workflows also
  require outbound internet access.

## Install the add-on

1. In Home Assistant: **Settings → Add-ons → Add-on Store → ⋮ → Repositories**,
   and add `https://github.com/dellarb/esphomenow-tree-ha`.
2. Install **ESP Tree**, start it, then open its panel from the sidebar
   (ingress) or **OPEN WEB UI** on the add-on page.

The add-on runs on the host network with the `uart` and `udev` privileges so it
can see serial adapters. `startup: services` starts it before Home Assistant
Core; `init: false` is set because the container uses the s6-overlay init from
the HA base image.

### First run — the add-on's own wizard

1. **Connect or provision a bridge.** *I Already Have a Bridge* offers
   **Discover** (scan the network), **Manual** (host, port, API key) and
   **Serial** (a locally discovered serial device). *Set Up a New Bridge* asks
   you to choose WiFi or serial transport, compiles the firmware, then offers
   browser USB flashing or add-on-side serial flashing as appropriate.
2. **Activate the integration.** The wizard can request a Home Assistant restart
   after copying the integration into `/config/custom_components`, then starts
   the `esp_tree` config flow and announces Supervisor discovery. If automatic
   setup is unavailable, the wizard links to **Devices & Services** for manual
   setup.
3. **Confirm each remote.** When a remote joins, the add-on creates its Home
   Assistant config entry and its device and entities appear automatically — no
   confirmation prompt is required. An area can be assigned afterwards from the
   device page.

A new remote is flashed from the UI with the **Create Remote** wizard
(`#/add-remote`): the add-on compiles the firmware, then esp-web-tools writes it
over Web Serial from the browser. The ESP-NOW credentials come from the
configured bridge — a remote consumes credentials and never writes them, so a
mismatched network is refused rather than silently replacing the live PSK.

### Home Assistant integration

The integration creates one hub config entry and a separate config entry for each
confirmed remote. It exposes the remote entity platforms listed above, plus
diagnostic sensors: bridge WiFi signal, uptime, online remotes and direct
children; remote RSSI, hop count, uptime, last-seen time and chip name.

The integration registers `esp_tree.send_command`, `esp_tree.forget_remote` and
`esp_tree.cleanup` services. Its Options flow can clean up integration data and
remove the hub entry, and restart-required repairs can request a Home Assistant
restart. Deleting a remote config entry or calling `forget_remote` also clears
its retained runtime state and device-registry entry.

## Firmware (ESPHome external components)

`device_code/demos/secrets.example.yaml` is the template for
`device_code/demos/secrets.yaml` (gitignored): WiFi, MQTT, OTA, the ESP-NOW
`network_id` / `psk`, and the bridge's `api_key`. Generate a real PSK with
`openssl rand -hex 32` and keep it identical on the bridge and every node — it is
resolved at compile time, so changing it requires reflashing the nodes.

```yaml
esp_tree_bridge:
  network_id: !secret espnow_network_id
  psk: !secret espnow_psk
  espnow_mode: regular            # shipped demos; lr is available on supported ESP32 radios
  ota_over_espnow: true
  heartbeat_interval_seconds: 60
  api_key: !secret bridge_api_key # HMAC key for the protobuf API
```

```yaml
esp_tree_remote:
  network_id: !secret espnow_network_id
  psk: !secret espnow_psk
  espnow_mode: regular            # must match the bridge; lr is ESP32-only
  relay_enabled: true             # may forward for other nodes
  max_hops: 5
  route_ttl_seconds: 172800
  preferred_parents: []           # optional MAC pinning
  ota_over_espnow: false

sensor:
  - platform: dht
    pin: GPIO4
    temperature:
      name: "Shed Temperature"
```

On ESP32, `esp_tree_remote` does not need to associate with WiFi: it brings up the
radio itself and selects the ESP-NOW protocol from `espnow_mode`. The component
pulls in neither WiFi credentials nor MQTT; the ESP32 demos keep a `wifi:` block
so a device can also be flashed over the network. ESP32 remotes sweep channels
while discovering and then lock to the selected parent's channel.

The ESP8266 component is different: its demos retain a `wifi: ap:` block because
ESPHome owns the radio, and `espnow_mode` accepts only `regular`. Its `channel`
option defaults to channel 11. In every configuration, the bridge and remotes
must use the same `network_id`, PSK and ESP-NOW mode.

Bridge transport options:

- **WiFi + MQTT** (`espnow-bridge-c5.yml`) — MQTT discovery as well as the
  protobuf WebSocket API.
- **WiFi, protobuf only** (`espnow-bridge-nomqtt.yml`) — delete the `mqtt:`
  block and the WebSocket API becomes the only upstream transport. MQTT is
  compile-time optional: absent, no MQTT code is linked.
- **Serial** (`espnow-bridge-c5-serial.yml`) — `serial_transport:` over a UART
  instead of WiFi. `wifi:` and `serial_transport:` are mutually exclusive, and
  one of them is required. A serial build also needs an explicit `network:`
  block, because `web_server` would otherwise get it from `wifi:`.

`device_code/components/esp_tree_common/espnow_types.h` is the source of truth
for packet types, structures and field enums. The protocol is specified in
`docs/esptree_radio_v3_spec.md` (frame layout, PSK and session tags, packet
types, join flow, relay rules) and the API in
`docs/esptree_api_protobuf_spec.md`. A WiFi bridge exposes protobuf over
WebSocket at `/esp-tree/v2/pb`; the integration endpoint is
`/esp-tree/integration/v1/pb`; the serial bridge carries the same protobuf
messages in COBS-framed UART traffic.

## Add-on options

| Option | Default | Meaning |
|--------|---------|---------|
| `firmware_retention_days` | `7` | How long uploaded/built firmware is kept for rollback |
| `scan_subnets` | `""` | Extra subnets to scan for bridges — comma-separated CIDR, e.g. `10.0.0.0/24,192.168.5.0/24` |

Operational rules worth knowing: **one OTA job at a time** across the add-on,
with the rest queued; a job is marked successful only once the node rejoins, and
the reported firmware version is confirmed when available; and retention makes
reflash-as-rollback the recovery path — any retained binary can be reflashed
from the job history.

## Day-to-day management

- **Topology and device pages** show the active bridge, retained/offline remotes,
  route hops, firmware and job state. Hiding a node is reversible. Removing a
  stale remote is permanent and also removes it from Home Assistant and retained
  history; live remotes and bridge records cannot be removed this way.
- **Remote controls** include reboot, force rediscovery, relay enable/disable,
  heartbeat interval and preferred-parent configuration. Device configuration
  also exposes compile, compile-and-flash over ESP-NOW, browser USB flash and
  factory/OTA binary downloads.
- **Queue and history** keep compile jobs and OTA uploads in separate queues.
  OTA jobs can be paused, reordered and aborted; per-job logs, combined
  compile-then-flash history and the add-on activity log are available from the
  UI.
- **Settings** manage multiple stored bridge records with at most one active
  bridge, network scans, add-on/integration status, Home Assistant restart,
  cleanup of old build artifacts and the previous-installation cleanup gate.
- **Secrets** are managed in the add-on's `secrets.yaml` editor and checked before
  a compile. The file contains credentials and must be backed up and shared
  securely. Persistent add-on state is stored under `/data`; shared integration
  runtime state is stored under `/share/esp_tree`.

## Development

```bash
./dev.sh                         # interactive menu
./dev.sh compile                 # ESPHome build menu
./dev.sh build-cpp && ./dev.sh run-cpp
./dev.sh verify global           # unit tests + C++ tests + smoke compile
./dev.sh qc                      # verify, then version bump / commit / push
./dev.sh flash-usb <port> <demo> # flash an already-built demo over USB
./dev.sh esplog [demo]           # stream ESPHome OTA logs for a selected demo
```

```bash
./device_code/scripts/ha_compile.sh <demo> b       # build
./device_code/scripts/ha_compile.sh <demo> bf      # build then flash
./device_code/scripts/ha_esplog_run.sh restart     # network log collector on :5555
./test/build.sh && ./test/start.sh                 # standalone add-on UI, no HA
cd ui && npm ci && npm run build
```

Add-on Python is containerized; do not validate its imports or syntax with the
host `python`. Firmware builds started by the add-on use a local virtual
environment pinned by `requirements-compile.txt`, while developer demo builds
run in the corresponding Docker image. `dev.sh qc` is a mutating release
pipeline: it verifies, may regenerate files and bump versions, then commits and
pushes. Build the smallest affected target — remote-only changes do not require
a bridge build.

## Documentation

- `docs/esptree_radio_v3_spec.md` — the ESP-NOW protocol, including LR and
  regular mode (authoritative).
- `docs/esptree_api_protobuf_spec.md` — protobuf/WebSocket API contract.
- `docs/ESP_guide_usblog.md` — direct USB serial logging.
- `docs/ESP_standalone.md` — ESP-IDF (non-ESPHome) remote implementation.
- `docs/HA_workplan_multi_bridge.md`, `docs/ESP_roadmap_*.md`,
  `docs/workplan_*.md` — historical roadmaps and workplans. Check their status
  against current code and dated manual-test checklists before relying on them.
- `docs/roadmap_publish.md` — a historical OSS-readiness audit. Several entries
  are now resolved, so verify each item against the current tree rather than
  treating the whole file as an open-item list.
- `DOCS.md` is **stale**: it documents the removed V1 HTTP API. Trust the
  specifications, executable configuration and code instead.

## Status

Core add-on, integration, WiFi-bridge and serial-bridge paths are implemented,
but this is not yet a polished OSS release. The serial implementation still has
a manual hardware-test matrix in `docs/ESP_roadmap_workplan_serial_bridge.md`;
use the current manual checklist before claiming a tested transport matrix.

Licensed **AGPL-3.0-only** (see `LICENSE`).

Known release-readiness gaps:

- No dedicated troubleshooting or FAQ document.
- No board / chip compatibility matrix.
- Incomplete YAML configuration reference for `esp_tree_bridge:` / `esp_tree_remote:`.
- No documented walkthrough for a first real sensor.
- `CHANGELOG.md` last has a released entry for 0.1.38; later releases are not
  itemised there.
- `DOCS.md` is stale (see above) and is slated for removal.
- `scripts/log_listener.py` and `scripts/esplog-master.py` are development
  helpers that bind an unauthenticated HTTP port and are not intended for
  production use; they need either hardening or removal before release.
- `docs/roadmap_publish.md` contains useful background but is not a current
  open-items list — verify each item against the tree.
