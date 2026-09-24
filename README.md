# ESP Tree

ESP Tree puts ESPHome-style ESP32 sensor and actuator nodes on a **Home Assistant
add-on + integration**, talking over **ESP-NOW Long Range (LR)** to a single
WiFi-connected bridge.

- A **bridge** (ESP32-C5 in the reference build) joins WiFi and speaks ESP-NOW LR
  to the nodes, exposes them to Home Assistant (MQTT discovery and/or the
  protobuf WebSocket API), and carries OTA to them.
- **Remotes / leaves** (ESP32-C3, ESP32, ESP8266) declare ordinary ESPHome
  entities — sensor, text_sensor, switch, binary_sensor, button, number, select,
  text, light, fan, cover, valve, lock, alarm_control_panel, event — and the
  add-on manages the network: topology, diagnostics, compile, flash, OTA and
  reflash-as-rollback.
- An optional **relay** node forwards encrypted frames to extend range. Relays
  are blind: only the bridge and the leaf hold the session key.

The add-on is the management plane and the HA integration is a client of it; the
integration never talks to the bridge directly. One bridge per Home Assistant
instance.

## Repository layout

| Path | Contents |
|------|----------|
| `app/` | Add-on backend (FastAPI), bridge WebSocket clients, OTA/compile workers, stores, protobuf |
| `ha_integration/custom_components/esp_tree/` | Home Assistant integration: entities, services, config flow, repairs |
| `ui/` | Lit/Vite web interface served through HA ingress |
| `device_code/components/` | ESPHome external components: `esp_tree_bridge`, `esp_tree_remote`, `espnow_82xx_remote`, `esp_tree_common` |
| `device_code/demos/` | Firmware configurations (bridge, remotes, serial-transport variant) |
| `device_code/tests/` | C++ unit tests |
| `test/` | Standalone add-on test environment (runs the UI without Home Assistant) |
| `scripts/`, `device_code/scripts/` | Development, compile, flash and logging helpers |
| `docs/` | Protocol, API, roadmap and workplan documents |
| `rootfs/` | Container init: installs the integration into `/config`, announces discovery |

See `CONTRIBUTING.md` for the per-domain entry points and
`docs/ESP_ha-addon-plan.md` for the add-on design.

## Requirements

- **Home Assistant OS or Supervised** for the add-on. It uses ingress for user
  auth and `SUPERVISOR_TOKEN` for the Core API, and installs the integration into
  `/config/custom_components`.
- An **ESP32** board for the bridge. The reference demos use
  `esp32-c5-devkitc-1`; remotes run on C3/C5/classic. ESP8266 (ESP-01/ESP-12E)
  leaves are supported through `espnow_82xx_remote`, with the constraints in
  `docs/esptree_radio_v3_spec.md` § ESP82xx Leaf Limitations.
- **Docker** for firmware builds and the standalone test environment.

## Install the add-on

1. In Home Assistant: **Settings → Add-ons → Add-on Store → ⋮ → Repositories**,
   and add `https://github.com/dellarb/esphomenow-tree-ha`.
   > `repository.yaml` in this tree still advertises
   > `https://github.com/dellarb/esp-tree-ha`, which does not resolve. Use the
   > canonical repository URL above until that metadata is corrected.
2. Install **ESP Tree**, start it, then open its panel from the sidebar
   (ingress) or **OPEN WEB UI** on the add-on page.

The add-on runs on the host network with the `uart` and `udev` privileges so it
can see serial adapters. `startup: services` starts it before Home Assistant
Core; `init: false` is set because the container uses the s6-overlay init from
the HA base image.

### First run — the add-on's own wizard

1. **Connect your bridge.** *I Already Have a Bridge* offers **Discover**
   (scan the network), **Manual** (host, port, API key) and **Serial** (a local
   serial device, or a `socket://host:port` passthrough). *Set Up a New Bridge*
   compiles and flashes a fresh bridge over serial, then selects the transport
   for you.
2. **Restart Home Assistant.** The add-on has copied the integration into
   `/config/custom_components`; the restart is what loads it.
3. **Add the ESP Tree integration.** The add-on announces a discovery for the
   `esp_tree` service, and the integration is added as a hub entry. Remotes are
   discovered as they join and appear as devices.

A new remote is flashed from the UI with the **Create Remote** wizard
(`#/add-remote`): the add-on compiles the firmware, esp-web-tools writes it over
Web Serial from the browser. The ESP-NOW credentials come from the configured
bridge — a remote consumes credentials and never writes them, so a mismatched
network is refused rather than silently replacing the live PSK.

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
  espnow_mode: lr                 # lr (long range) or regular
  ota_over_espnow: true
  heartbeat_interval_seconds: 60
  api_key: !secret bridge_api_key # HMAC key for the protobuf WebSocket API
```

```yaml
esp_tree_remote:
  network_id: !secret espnow_network_id
  psk: !secret espnow_psk
  espnow_mode: lr
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

A remote does not need to associate with WiFi: the component brings up the radio
itself and selects the ESP-NOW protocol from `espnow_mode`. The demos keep a
`wifi:` block so a remote can be flashed over the network; `esp_tree_remote`
itself pulls in neither WiFi credentials nor MQTT. Discovery sweeps the channels
before locking to the bridge's channel, so keep every node on the same
`network_id` and PSK.

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
`docs/esptree_api_protobuf_spec.md` (protobuf over WebSocket at
`/esp-tree/v2/pb` for the bridge, `/esp-tree/integration/v1/pb` for the
integration).

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

## Development

```bash
./dev.sh                      # interactive menu
./dev.sh compile              # ESPHome build menu
./dev.sh build-cpp && ./dev.sh run-cpp
./dev.sh verify global        # unit tests + C++ tests + smoke compile
./dev.sh qc                   # verify, then version bump / commit / push
./dev.sh flash-usb <port> <demo>
./dev.sh esplog               # network log collector UI on :5555
```

```bash
./device_code/scripts/ha_compile.sh <demo> b     # build
./device_code/scripts/ha_compile.sh <demo> bf    # build then flash
./test/build.sh && ./test/start.sh               # standalone add-on, no HA
cd ui && npm ci && npm run build
```

Add-on Python and firmware builds run in Docker, against the ESPHome version
pinned in `requirements-compile.txt`; do not validate imports or Python syntax
with the host `python`. Versions are bumped by `dev.sh qc`, not by hand. Build
the smallest affected target — remote-only changes do not require a bridge build.

## Documentation

- `docs/esptree_radio_v3_spec.md` — the ESP-NOW LR protocol (authoritative).
- `docs/esptree_api_protobuf_spec.md` — protobuf/WebSocket API contract.
- `docs/ESP_guide_usblog.md` — direct USB serial logging.
- `docs/ESP_standalone.md` — ESP-IDF (non-ESPHome) remote implementation.
- `docs/HA_workplan_multi_bridge.md`, `docs/ESP_roadmap_*.md`,
  `docs/workplan_*.md` — roadmaps and workplans; the MQTT-optional and
  serial-transport work are complete.
- `docs/roadmap_publish.md` — the open OSS-readiness list, including known
  documentation gaps.
- `DOCS.md` is **stale**: it documents the removed V1 HTTP API. Trust the
  specifications and the code instead.

## Status

Working end to end against Home Assistant OS with a live ESP32-C5 bridge, over
both the WiFi and serial transports — but not yet a polished OSS release. Open
items tracked in `docs/roadmap_publish.md` include: no `LICENSE` file, no
`.github/` issue or PR templates, a `CHANGELOG.md` that stopped at 0.1.38,
missing board/chip compatibility guidance, and no troubleshooting or FAQ
document. The ESP8266 demos are also known to lag the current protocol
constants.
