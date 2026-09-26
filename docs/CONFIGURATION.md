# YAML configuration reference

This is the reference for the ESPHome external components in
`device_code/components/`. Every key, default and accepted value below is read from
the component's schema in its `__init__.py`; behaviour notes cite the C++ that
consumes the value.

Three components exist:

| Component | File | Role |
|---|---|---|
| `esp_tree_bridge:` | `device_code/components/esp_tree_bridge/__init__.py` | The single root node; WiFi or serial upstream |
| `esp_tree_remote:` | `device_code/components/esp_tree_remote/__init__.py` | ESP32 remote (leaf or relay) |
| `espnow_82xx_remote:` | `device_code/components/espnow_82xx_remote/__init__.py` | ESP8266 remote (leaf only) |

`esp_tree_common` has no config schema at all — it exists only to provide the
shared headers and the crypto implementation, and is pulled in by `AUTO_LOAD`
(`device_code/components/esp_tree_common/__init__.py:1-3`).

All three schemas `.extend(cv.COMPONENT_SCHEMA)`
(`esp_tree_bridge/__init__.py:72`, `esp_tree_remote/__init__.py:64`,
`espnow_82xx_remote/__init__.py:53`) and declare an `id:` through
`cv.GenerateID()`. The keys ESPHome's `COMPONENT_SCHEMA` adds are defined by
ESPHome, not by this repository, so they are not enumerated here. This repository
uses `id:` explicitly only for the bridge
(`app/yaml_scaffold.py:311`, `device_code/demos/espnow-bridge-c5.yml:65`).

## `esp_tree_bridge:`

### Schema

| Key | Required | Type / accepted values | Default | Source |
|---|---|---|---|---|
| `id` | no | ESPHome component id | auto-generated | `esp_tree_bridge/__init__.py:57` |
| `network_id` | **yes** | strict string | — | `esp_tree_bridge/__init__.py:58` |
| `psk` | **yes** | strict string, length >= 1 | — | `esp_tree_bridge/__init__.py:59` |
| `heartbeat_interval_seconds` | no | int, 10–3600 | `60` | `esp_tree_bridge/__init__.py:60-62` |
| `espnow_mode` | no | `lr` or `regular` (case-insensitive) | `lr` | `esp_tree_bridge/__init__.py:63-65` |
| `mqtt_discovery_prefix` | no | strict string | `homeassistant` | `esp_tree_bridge/__init__.py:66` |
| `ota_over_espnow` | no | boolean | `false` | `esp_tree_bridge/__init__.py:67` |
| `force_v1_packet_size` | no | boolean | `false` | `esp_tree_bridge/__init__.py:68` |
| `api_key` | no | strict string | `""` (empty) | `esp_tree_bridge/__init__.py:69` |
| `serial_transport` | no | mapping, see below | — | `esp_tree_bridge/__init__.py:70` |

### `serial_transport:`

| Key | Required | Type | Effect |
|---|---|---|---|
| `uart_id` | **yes** | id reference to a `uart:` component | sets the UART the transport uses; adds `-DUSE_SERIAL` | 
| `usb_cdc` | no | empty mapping (`usb_cdc: {}`) | adds `-DUSE_USB_CDC` |

Source: `esp_tree_bridge/__init__.py:30-35`, `esp_tree_bridge/__init__.py:83-91`.

`usb_cdc` is only correct when the board is wired via native USB. The serial demo
states this and omits it because it uses a hardware UART adapter
(`device_code/demos/espnow-bridge-c5-serial.yml:82-84`).

### Transport requirement

The bridge must have exactly one upstream transport.
`_validate_transport_exclusivity` (`esp_tree_bridge/__init__.py:38-51`) rejects a
config with both, and rejects one with neither:

- `wifi:` and `serial_transport:` both present →
  `"wifi: and serial_transport: cannot both be configured. Use serial_transport: for USB/UART transport or wifi: for WiFi transport, not both."`
- neither present →
  `"Either wifi: or serial_transport: must be configured. The bridge requires a transport layer."`

`to_code` repeats the check for the WiFi case (`esp_tree_bridge/__init__.py:92-96`), raising
`"wifi: is required when serial_transport: is not configured"`.

### Required surrounding blocks

- **`web_server:` is a hard dependency.** `DEPENDENCIES = ["web_server"]`
  (`esp_tree_bridge/__init__.py:9`). Both WiFi demos and the serial demo carry a `web_server:`
  block (`espnow-bridge-c5.yml:60-61`, `espnow-bridge-nomqtt.yml:39-40`,
  `espnow-bridge-c5-serial.yml:53-54`).
- **`network:` is required in serial mode.** `web_server_base` and the
  `web_server` OTA platform depend on ESPHome's `network` component, which `wifi:`
  would normally supply. A serial bridge has no `wifi:`, so `network:` must be
  requested explicitly or validation fails with
  `"Component web_server_base requires component network"`
  (`app/yaml_scaffold.py:227-241`,
  `device_code/demos/espnow-bridge-c5-serial.yml:47-51`).
- **`mqtt:` is optional.** If the `mqtt:` integration is loaded, `mqtt_discovery_prefix`
  is passed through and `-DUSE_MQTT` is set; if not, the whole MQTT translation unit
  is not compiled (`esp_tree_bridge/__init__.py:111-121`). Removing `mqtt:` leaves the protobuf
  WebSocket API as the sole upstream transport
  (`device_code/demos/espnow-bridge-nomqtt.yml:1-3`). `mqtt_discovery_prefix` is
  accepted but ignored without `mqtt:` (`espnow-bridge-nomqtt.yml:49-50`).
- **ESP32 only in practice.** `to_code` imports `add_idf_sdkconfig_option` from
  `esphome.components.esp32` (`esp_tree_bridge/__init__.py:4`) and calls it for
  `CONFIG_HTTPD_WS_SUPPORT` (`esp_tree_bridge/__init__.py:78`). The WebSocket transport body is
  guarded by `#if USE_ESP32` (`bridge_api_proto_ws.cpp:18`). See `BOARD_MATRIX.md`
  for what is and is not verified for ESP8266 bridges.

### Behaviour notes

**`network_id`** is the network discriminator. On the wire it is a 32-byte field
with a separate length byte (`esp_tree_common/espnow_types.h:259-260`). The bridge
drops a DISCOVER whose length byte differs from its own, then drops one whose bytes
differ (`bridge_protocol.cpp:764-771`). The comparison is exact and therefore
case-sensitive; the demo states "1-32 chars, case-sensitive"
(`espnow-bridge-c5.yml:66`). The schema itself only requires a non-empty string —
there is no length validator in `__init__.py`.

**`psk`** is not required to be hex. `espnow_crypto_init()` uses the 64-character
hex form only when the string is exactly 64 characters *and* decodes to 32 bytes;
anything else is stretched into a key with HKDF-SHA256 over the string (info
`esp-tree-psk`), and an empty string fails and leaves the PSK unset
(`esp_tree_common/espnow_crypto.cpp:189-204`). The demo's guidance to use
`openssl rand -hex 32` and the 64-hex-character comment
(`espnow-bridge-c5.yml:68`, `secrets.example.yaml:18-20`) choose the first path
deliberately. The bridge marks the protocol unusable when init fails
(`bridge_protocol.cpp:311`, `:336`).

**`espnow_mode`** selects the 2.4 GHz protocol mask: `lr` →
`WIFI_PROTOCOL_LR`, otherwise `WIFI_PROTOCOL_11B | 11G | 11N`
(`esp_tree_bridge.cpp:488-493`). The value is broadcast in a log line at setup
(`esp_tree_bridge.cpp:494`). The bridge and every remote must agree; nothing in the
code negotiates or repairs a mismatch.

**`heartbeat_interval_seconds`** is used for session timeout, not for sending.
A session is marked offline when bridge uptime exceeds
`max(interval * 1000 + 5000 ms, expected_contact_interval_s * 3000 + 5000 ms)`,
falling back to `interval * 3000 + 5000 ms` when the remote reports no expected
contact interval (`bridge_protocol.cpp:2016-2021`;
`OFFLINE_TIMEOUT_GRACE_MS = 5000` at `bridge_protocol.h:316`). The remote reports
its own interval in HEARTBEAT (`esp_tree_remote/remote_protocol.cpp:1632`), so the two values
should match to get predictable offline detection.

**`ota_over_espnow`** allocates the OTA manager at setup
(`esp_tree_bridge.cpp:2454-2462`). If allocation fails the component calls
`mark_failed()` and returns. With it `false`, remote firmware transfer over
ESP-NOW is not available from this bridge.

**`force_v1_packet_size`** skips runtime radio-version detection and pins the
session MTU to `ESPNOW_V1_MAX_PAYLOAD` (250 bytes)
(`esp_tree_bridge.cpp:495-507`); it logs
`"force_v1_packet_size active, using V1 MTU (250 bytes)"`. Use it to interoperate
with a peer that cannot do V2, at the cost of throughput.

**`api_key`** is the HMAC key for the protobuf API. Empty means unauthenticated
requests are refused outright: the WebSocket socket session answers HTTP 503 with
`"Bridge API key is not configured"` (`bridge_api_proto_ws.cpp:189-191`), and on
the serial transport a bad HMAC produces an `auth_failed` envelope with the
message `"Authentication failed"` (`bridge_api_serial.cpp:259-261`). The add-on
skips creating a client for a bridge with no `api_key` and records the reason
`"bridge has no api_key"` (`app/bridge_v2_client.py:474-481`).

### What the add-on's wizard generates

Scaffolded bridge configs (`app/yaml_scaffold.py:170-334`) emit, in order: the
`esphome:` block with `name` and `friendly_name`; the `esp32:` block with `board`,
optional `variant`, `framework: type: esp-idf` and any `sdkconfig_options`;
`external_components:` pointing at `/opt/esp-tree/components`; `wifi:` (WiFi mode
only); `network:` and `web_server:`/`ota:`; then the component block with
`id: bridge_component`, `network_id`/`psk` via `!secret`, `espnow_mode`,
`ota_over_espnow: true`, and `api_key` via `!secret`, plus `serial_transport:
uart_id: bridge_uart` in serial mode. A serial scaffold is preceded by `logger:`
with `hardware_uart: UART0`, `baud_rate: 460800`, and a `uart:` block with
`rx_buffer_size: 16384` and the SoC's UART0 pins
(`app/yaml_scaffold.py:259-300`; defaults at `:64-65`).

## `esp_tree_remote:`

### Schema

| Key | Required | Type / accepted values | Default | Source |
|---|---|---|---|---|
| `id` | no | ESPHome component id | auto-generated | `esp_tree_remote/__init__.py:49` |
| `network_id` | **yes** | strict string | — | `esp_tree_remote/__init__.py:50` |
| `psk` | **yes** | strict string, length >= 1 | — | `esp_tree_remote/__init__.py:51` |
| `esphome_name` | no | strict string | `CORE.name` | `esp_tree_remote/__init__.py:52`, `:75` |
| `node_label` | no | strict string | `CORE.friendly_name` then `CORE.name` | `esp_tree_remote/__init__.py:53`, `:76` |
| `heartbeat_interval_seconds` | no | int, 10–3600 | `60` | `esp_tree_remote/__init__.py:54` |
| `espnow_mode` | no | `lr` or `regular` (case-insensitive) | `lr` | `esp_tree_remote/__init__.py:55` |
| `relay_enabled` | no | boolean | `true` | `esp_tree_remote/__init__.py:56` |
| `route_ttl_seconds` | no | int, 60–604800 | `172800` | `esp_tree_remote/__init__.py:57` |
| `max_hops` | no | int, 1–16 | `5` | `esp_tree_remote/__init__.py:58` |
| `max_discover_pending` | no | int, 1–32 | `8` | `esp_tree_remote/__init__.py:59` |
| `preferred_parents` | no | list of MAC addresses | `[]` | `esp_tree_remote/__init__.py:60` |
| `ota_over_espnow` | no | boolean | `false` | `esp_tree_remote/__init__.py:61` |
| `force_v1_packet_size` | no | boolean | `false` | `esp_tree_remote/__init__.py:62` |

`AUTO_LOAD = ["esp_tree_common", "md5"]` (`esp_tree_remote/__init__.py:28`). There is no
`DEPENDENCIES`, so this component needs no `web_server:`, no `wifi:` and no
`ota:`. The `md5` entry is load-bearing: `remote_file_receiver.h` includes
`esphome/components/md5/md5.h` unconditionally and ESPHome only copies loaded
components into the build tree, so without it the build stops at
`"fatal error: md5.h: No such file or directory"` (`esp_tree_remote/__init__.py:22-27`).
Separately, `remote_protocol.cpp` guards its only WiFi reference with `#ifdef
USE_WIFI` because a remote normally has no `wifi:` component
(`esp_tree_remote/remote_protocol.cpp:2428-2432`).

### Behaviour notes

**Registering entities.** `to_code` walks every variable ESPHome created and
registers it with the component by type for: sensor, switch, binary_sensor, cover,
event, fan, light, lock, number, valve, alarm_control_panel, select, text_sensor,
text, button (`esp_tree_remote/__init__.py:89-127`). Variables whose id starts with `gamma_` are
skipped (`:95`). There is no allow-list: any entity of those platforms in the same
YAML is exported to the bridge.

**`esphome_name` / `node_label`** default to the ESPHome `name` and
`friendly_name` (`esp_tree_remote/__init__.py:75-77`). Setting `esphome_name` explicitly
decouples the network identity from the YAML filename — relevant when the
`device_code/demos` names (`espnow-remote-1`, `espnow-remote-us1`, …) would
otherwise become the identity.

**`espnow_mode`** sets `WIFI_PROTOCOL_LR` versus `WIFI_PROTOCOL_11N`
(`esp_tree_remote.cpp:310-311`). It must match the bridge. On the bridge the
equivalent mask is `WIFI_PROTOCOL_LR` versus `11B | 11G | 11N`
(`esp_tree_bridge.cpp:488-493`).

**`relay_enabled`** controls whether this node may forward for others. It is
advertised in DISCOVER as `capability_flags` bit `0x01`
(`esp_tree_remote/remote_protocol.cpp:1545`) and is re-evaluated at runtime into `can_relay_`,
which also requires NORMAL state, a valid parent and a known hop count
(`esp_tree_remote/remote_protocol.cpp:2037`). It can also be changed over the air by the
`CFG_CMD_RELAY` config command (`esp_tree_remote/remote_protocol.cpp:1425-1426`;
command ids at `esp_tree_common/espnow_types.h:322-330`).

**`route_ttl_seconds`** is the lifetime of a routing-table entry this node creates
as a relay: `expiry_ms = millis() + route_ttl_seconds * 1000`
(`esp_tree_remote/remote_protocol.cpp:2296`). The default matches
`ESPNOW_ROUTE_TTL_DEFAULT_SECONDS = 172800U` — 48 hours
(`esp_tree_common/espnow_types.h:71`).

**`max_hops`** is used twice: a received frame whose hop count is `>= max_hops` is
dropped (`esp_tree_remote/remote_protocol.cpp:665`), and a DISCOVER_ANNOUNCE advertising
`hops_to_bridge > max_hops` is ignored (`esp_tree_remote/remote_protocol.cpp:1087`). The protocol
default constant is `ESPNOW_MAX_HOPS_DEFAULT 5`
(`esp_tree_common/espnow_types.h:40`). The 4-bit hop field allows 0–15 and the
spec's hard limit is 8; the schema allows up to 16.

**`max_discover_pending`** caps the reverse-path entries a relay holds for
in-flight joins. Once `pending_discovers_.size() >= max_discover_pending`, further
DISCOVER relaying is refused (`esp_tree_remote/remote_protocol.cpp:1052`). The protocol default is
`ESPNOW_MAX_PENDING_DISCOVER 8` (`esp_tree_common/espnow_types.h:91`).

**`preferred_parents`** is an ordered preference list. Candidate selection compares
the index of the sender in the list first, then hop count, then RSSI
(`esp_tree_remote/remote_protocol.cpp:2316-2341`). A parent can also be set at runtime by the
`CFG_CMD_SET_PARENT_MAC` config command, which moves that MAC to the front of the
list, or clears the list when `SET_PARENT_MAC_FLAG_CLEAR` is set
(`esp_tree_remote/remote_protocol.cpp:1410-1413`; flags at
`esp_tree_common/espnow_types.h:330`). An empty list
means no pinning. Note that `select_parent_candidate_` only *prefers* a listed MAC;
unlisted candidates are still accepted when nothing better is offered, so a
restrictive list does not by itself hard-block joining.

**`ota_over_espnow`** gates the whole file-receiver path on the remote: it is passed
to the file receiver (`esp_tree_remote/remote_protocol.cpp:382`) and checked before acting on
`PKT_FILE_TRANSFER`/`PKT_FILE_DATA`, logging
`"Ignoring %s from %s because ota_over_espnow is disabled"`
(`esp_tree_remote/remote_protocol.cpp:723-724`, `:789`). A remote with this `false` cannot be
OTA-flashed over ESP-NOW from the bridge.

**`force_v1_packet_size`** mirrors the bridge option: it skips radio-version
detection and pins the MTU to 250 bytes (`esp_tree_remote.cpp:314-326`).

### Minimum workable remote

```yaml
esp_tree_remote:
  network_id: !secret espnow_network_id
  psk: !secret espnow_psk
  espnow_mode: regular
```

That is the required set. In the shipped demos the ESP32 remotes additionally carry
`wifi:`, `api:`, `ota:`, `web_server:` and a `logger:` block
(`device_code/demos/espnow-remote-1.yml:31-49`), but none of those are required by
this component — the demos keep them so a device can also be flashed and logged over
the network (`README.md:147-151`).

## `espnow_82xx_remote:` (ESP8266)

### Schema

| Key | Required | Type / accepted values | Default | Source |
|---|---|---|---|---|
| `id` | no | ESPHome component id | auto-generated | `espnow_82xx_remote/__init__.py:42` |
| `network_id` | **yes** | strict string | — | `espnow_82xx_remote/__init__.py:43` |
| `psk` | **yes** | strict string, length >= 1 | — | `espnow_82xx_remote/__init__.py:44` |
| `esphome_name` | no | strict string | `CORE.name` | `espnow_82xx_remote/__init__.py:45`, `:64` |
| `node_label` | no | strict string | `CORE.friendly_name` then `CORE.name` | `espnow_82xx_remote/__init__.py:46`, `:65` |
| `heartbeat_interval_seconds` | no | int, 10–3600 | `60` | `espnow_82xx_remote/__init__.py:47` |
| `preferred_parents` | no | list of MAC addresses | `[]` | `espnow_82xx_remote/__init__.py:48` |
| `ota_over_espnow` | no | boolean | `false` | `espnow_82xx_remote/__init__.py:49` |
| `espnow_mode` | no | `regular` **only** (case-insensitive) | `regular` | `espnow_82xx_remote/__init__.py:50` |
| `channel` | no | int, 1–13 | `11` | `espnow_82xx_remote/__init__.py:51` |

`AUTO_LOAD = ["esp_tree_common", "md5"]` (`espnow_82xx_remote/__init__.py:25`).

### Keys this component does not have

`relay_enabled`, `route_ttl_seconds`, `max_hops`, `max_discover_pending` and
`force_v1_packet_size` exist on `esp_tree_remote` and are **absent here**. Setting
any of them on this component is a schema error. The omission is deliberate for
relaying — ESP8266 cannot relay (`__init__.py` has no relay key;
`espnow_82xx_remote/remote_protocol.cpp:1492` sets `capability_flags = 0x00` with
the comment "ESP8266 cannot relay"). For the other four I found no comment
explaining the omission; treat them as unavailable rather than defaulted.

### Behaviour notes

**`espnow_mode` rejects `lr`.** The validator is `cv.one_of("regular", lower=True)`
(`espnow_82xx_remote/__init__.py:50`), so `espnow_mode: lr` fails validation outright. `regular` is the
only accepted value and also the default.

**`channel`** is stored and used for peer registration and transmission:
`ch = espnow_channel_` in `add_peer` (`espnow_82xx_remote.cpp:374-388`) and before
unicast sends (`:617-618`, `:526`). The default of 11 matches
`espnow_channel_{11}` in the header (`espnow_82xx_remote.h:182`). ESPHome still owns
the radio: the component does **not** call `WiFi.mode()` or `WiFi.softAP()` for the
AP's channel; it upgrades the mode to `WIFI_AP_STA` because pure AP or pure STA make
unicast TX report `status=FAIL` (`espnow_82xx_remote.cpp:320-331`). Both ESP8266
demos therefore set `channel: 11` on the component *and* `channel: 11` under
`wifi: ap:` so the two agree (`espnow-remote-esp01.yml:37-53`).

**`espnow_mode` is not read at runtime on this component.** `set_espnow_mode()`
stores the string (`espnow_82xx_remote.h:79`) and `dump_config()` prints the
hardcoded line `"  Mode: regular"` (`espnow_82xx_remote.cpp:1187`). Since the
schema only accepts `regular`, this is self-consistent rather than a bug.

**Leaf-only.** See `BOARD_MATRIX.md` for the protocol-level reason, and the spec's
"ESP82xx Leaf Limitations" section for the broadcast + `parent_mac` mechanism that
replaces upstream unicast.

### Shipped ESP8266 demos

`device_code/demos/espnow-remote-esp01.yml` (board `esp01_1m`) and
`device_code/demos/espnow-remote-esp12e.yml` (board `esp12e`) are the only examples.
Both keep `wifi:` with an `ap:` block plus `captive_portal:` and `network:`, and
both set `heartbeat_interval_seconds: 30` rather than the default 60.

## Cross-component rules

- **`network_id`, `psk` and `espnow_mode` must be identical on the bridge and every
  remote.** Nothing negotiates them. A mismatched `network_id` is dropped at the
  DISCOVER layer with a length check then a byte comparison
  (`bridge_protocol.cpp:764-771`); a mismatched `psk` fails the PSK-tag check with
  the log line `"%s[DROP] L2 psk_fail"` (`bridge_protocol.cpp:584-586`).
- **A remote may not author these credentials.** The add-on refuses a remote
  flash whose `network_id` or `psk` disagrees with the configured network rather
  than silently overwriting, because the failure mode is firmware that compiles but
  can never join (`app/flash_wizard.py:29-68`, `app/server.py:1768-1790`).
- **Secrets live in `secrets.yaml`.** `device_code/demos/secrets.example.yaml` is
  the template for `device_code/demos/secrets.yaml`, which is gitignored: WiFi,
  MQTT, OTA, `espnow_network_id`, `espnow_psk` and `bridge_api_key`
  (`secrets.example.yaml:1-29`, `README.md:113-117`). The add-on writes and merges
  this file itself (`app/yaml_store.py:58-76`).
- **A `!secret` with no matching key is a hard failure at config load.** The
  scaffold only references WiFi secrets when it also emits a `wifi:` block, and
  never references them in serial mode (`app/server.py:1762-1766`).

## Verifying your own keys

There is no offline schema dump in this repository. The authoritative checks are
the schema files themselves:

- `device_code/components/esp_tree_bridge/__init__.py:54-74`
- `device_code/components/esp_tree_remote/__init__.py:47-64`
- `device_code/components/espnow_82xx_remote/__init__.py:40-53`

A key not present in one of those schemas is not a valid key for that component.
