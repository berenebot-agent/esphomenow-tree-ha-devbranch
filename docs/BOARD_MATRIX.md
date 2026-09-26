# Board and chip compatibility

Every board name in this document is taken from a file in this repository. Where a
board or chip is accepted by the add-on but cannot be built, that is stated
explicitly rather than left to be discovered at compile time.

Two things are separate here and often confused:

- **Which chip the add-on will accept** — the board registry in `app/yaml_scaffold.py`.
- **Which chips are offered as buttons in a wizard** — a narrower subset of that
  registry, hardcoded in the bridge flash wizard
  (`ui/src/pages/setup-page.ts:6-15`).

A chip can be in the registry and still be unusable for a given role.

## Registry of accepted chips

`app/yaml_scaffold.py:18-30` (`CHIP_NAME_TO_BOARD`) is the authoritative list. These
are the exact `chip_name` strings the API accepts, with the ESPHome board and
framework the add-on writes into a generated config:

| `chip_name` | ESPHome platform key | `board` | `framework` | `variant` |
|---|---|---|---|---|
| `ESP32` | `esp32` | `esp32dev` | `esp-idf` | — |
| `ESP32-S2` | `esp32` | `esp32-s2-saola` | `esp-idf` | `esp32s2` |
| `ESP32-S3` | `esp32` | `esp32-s3-devkitc-1` | `esp-idf` | `esp32s3` |
| `ESP32-C3` | `esp32` | `esp32-c3-devkitm-1` | `esp-idf` | `esp32c3` |
| `ESP32-C2` | `esp32` | `esp32-c2-devkitm-1` | `esp-idf` | `esp32c2` |
| `ESP32-C6` | `esp32` | `esp32-c6-devkitc` | `esp-idf` | `esp32c6` |
| `ESP32-H2` | `esp32` | `esp32-h2-devkitm-1` | `esp-idf` | `esp32h2` |
| `ESP32-C5` | `esp32` | `esp32-c5-devkitc-1` | `esp-idf` | `esp32c5` |
| `ESP32-C61` | `esp32` | `esp32-c5-devkitc-1` | `esp-idf` | `esp32c5` |
| `ESP32-P4` | `esp32` | `esp32-s3-devkitc-1` | `esp-idf` | `esp32s3` |
| `ESP8266` | `esp8266` | `esp01_1m` | `arduino` | — |

Notes on the two aliases, which are deliberate but easy to misread:

- `ESP32-C61` resolves to the **C5** board and variant (`app/yaml_scaffold.py:27`).
- `ESP32-P4` resolves to the **S3** board and variant (`app/yaml_scaffold.py:28`).

Neither the C61 nor the P4 has its own `board:`/`variant:` entry anywhere in the
repository, so the add-on builds those two chip names as C5 and S3 respectively.
The ESPHome platform key is collapsed for every ESP32 family: anything whose
`platform` starts with `esp32` is emitted as a single `esp32:` block
(`app/yaml_scaffold.py:33-37`).

A second table, `CHIP_TYPE_TO_BOARD` (`app/yaml_scaffold.py:5-16`), maps numeric
esptool chip IDs to the same board info. It covers IDs 1, 2, 5, 9, 12, 13, 16, 23
and `0x8266`/`0x8236`. It contains no entry for C61 (`0x0014`) or P4 (`0x0012`),
even though `app/bin_parser.py:78-96` can name those chips when reading a firmware
image. A detected chip ID that is absent from both tables produces the "unknown
chip" scaffold described below.

## What the wizards actually offer

The add-on serves the registry over `GET /api/chips` (`app/server.py:3235-3260`),
with a `buildable` flag and an `unbuildable_reason` per chip, so the UI does not
duplicate the map. The bridge flash wizard does **not** use that endpoint for its
board list: it hardcodes a narrower set in `ui/src/pages/setup-page.ts:6-15`:

| Chip in the bridge wizard | Board label shown |
|---|---|
| `ESP32-C5` | `ESP32-C5 (esp32-c5-devkitc-1)` |
| `ESP32-C6` | `ESP32-C6 (esp32-c6-devkitc)` |
| `ESP32-S3` | `ESP32-S3 (esp32-s3-devkitc-1)` |
| `ESP32-C3` | `ESP32-C3 (esp32-c3-devkitm-1)` |
| `ESP32-S2` | `ESP32-S2 (esp32-s2-saola)` |
| `ESP32` | `ESP32 (esp32dev)` |
| `ESP32-H2` | `ESP32-H2 (esp32-h2-devkitm-1)` |
| `ESP32-C2` | `ESP32-C2 (esp32-c2-devkitm-1)` |

So the bridge wizard offers eight chips: no `ESP8266`, no `ESP32-C61`, no
`ESP32-P4`. The Create Remote wizard reads the full registry from `/api/chips`
instead, and disables any chip whose `buildable` is false
(`ui/src/pages/remote-wizard.ts:172-173`, `ui/src/pages/remote-wizard.ts:595-597`).

## Role support per chip

The scaffold picks the component from the role first and the chip second
(`app/yaml_scaffold.py:128-133`):

- bridge → `esp_tree_bridge`
- non-bridge on `esp8266` → `espnow_82xx_remote`
- anything else → `esp_tree_remote`

`espnow_mode` is forced to `regular` for ESP8266 and `lr` otherwise
(`app/yaml_scaffold.py:134`). Nothing in the scaffold vetoes a role per chip: every
registry entry is scaffolded as either a bridge or a remote. What differs is which
chips each wizard offers:

| Chip | In the bridge wizard | In the remote wizard | Demo in this repo |
|---|---|---|---|
| `ESP32` | yes | yes | remote (`esp32dev`) |
| `ESP32-S2` | yes | yes | none |
| `ESP32-C3` | yes | yes | remote (`esp32-c3-devkitm-1`) |
| `ESP32-C2` | yes | yes | none |
| `ESP32-C6` | yes | yes | none |
| `ESP32-H2` | yes | yes | none |
| `ESP32-C5` | yes | yes | bridge (`esp32-c5-devkitc-1`) |
| `ESP32-S3` | yes | yes | none |
| `ESP32-C61` | no | yes | none |
| `ESP32-P4` | no | yes | none |
| `ESP8266` | registered, but not offered | offered and disabled | remote (`esp01_1m`, `esp12e`) |

The remote wizard reads `/api/chips`, so it lists all eleven registry entries;
`ESP8266` appears but is disabled. The bridge wizard's list is the eight hardcoded
chips above (`ui/src/pages/setup-page.ts:6-15`). No ESP8266 bridge demo exists in
this repository; see "ESP8266 bridge status" above.

`espnow_mode` is forced to `regular` for ESP8266 and `lr` otherwise
(`app/yaml_scaffold.py:134`). Both wizards start on `lr` before submission and let
the scaffold override it (`ui/src/pages/setup-page.ts:78`,
`ui/src/pages/remote-wizard.ts:238`).

### ESP8266 remotes are refused by the wizard

`app/flash_wizard.py:81-88` defines `UNBUILDABLE_CHIP_REASON`, whose only entry is
`ESP8266`, with this reason text:

> ESP8266 remote firmware is not buildable in this release. Its receiver links
> ESPHome's ESP8266 OTA backend, which the remote scaffold does not load. Choose an
> ESP32 remote (C3, C5, C6, S3), or build this device outside the wizard. Bridge
> firmware for ESP8266 is unaffected.

`is_unbuildable_chip()` (`app/flash_wizard.py:91-95`) returns true both for a chip
named in that table and for any `board_info` whose `platform` is `esp8266`, and
`POST /api/bridge/flash-wizard/submit` calls `validate_remote_chip_buildable()`
for remotes only (`app/server.py:1735`). The reason for refusing early rather than
letting the build fail is in the code comment at `app/server.py:1728-1734`: the
raw compiler error names a header that is absent by design and reads as a broken
toolchain.

ESP8266 *bridge* firmware is explicitly out of scope of that rejection. **This
repository does not contain an ESP8266 bridge demo and I did not build one**, so
whether `esp_tree_bridge` compiles for ESP8266 is **undetermined by this
repository**. What is observable is that `esp_tree_bridge.h` includes
`<esp_idf_version.h>` and `<esp_now.h>` unconditionally
(`device_code/components/esp_tree_bridge/esp_tree_bridge.h:25-26`), that the
WebSocket transport body is wrapped in `#if USE_ESP32`
(`device_code/components/esp_tree_bridge/bridge_api_proto_ws.cpp:18`), and that
`README.md:51` already states an **ESP32** board is required for the bridge.

### ESP8266 remotes are leaf-only

`docs/esptree_radio_v3_spec.md` § "ESP82xx Leaf Limitations" states that ESP8266
modules running the Arduino ESP-NOW stack cannot transmit ESP-NOW unicast frames
reliably, and therefore **may not act as relays**. The firmware agrees:
`espnow_82xx_remote/remote_protocol.cpp:1492` sets
`discover.capability_flags = 0x00` with the comment "ESP8266 cannot relay — no
unicast TX for downstream forwarding", whereas the ESP32 remote sets it from
`relay_enabled_` (`esp_tree_remote/remote_protocol.cpp:1545`). The ESP8266
component has no `relay_enabled` option at all
(`device_code/components/espnow_82xx_remote/__init__.py:27-51`) and its
`espnow_mode` accepts only `regular` (`:50`).

The same spec section explains the consequence: all encrypted upstream frames from
ESP82xx leaves are sent as 802.11 broadcast with a 6-byte `parent_mac` field, and
only the selected parent relay processes them.

## ESP-NOW radio version (V1 vs V2), by chip

Radio version is detected at runtime, not configured, after `esp_now_init()`
(`device_code/components/esp_tree_bridge/esp_tree_bridge.cpp:495-507`,
`device_code/components/esp_tree_remote/esp_tree_remote.cpp:314-326`). Detection
requires IDF >= 5.4; below that the build is V1-only.

| Chip | `esp_now_get_version()` | Session MTU | Source |
|---|---|---|---|
| ESP32 (original) | 1 | 250 bytes | `docs/esptree_radio_v3_spec.md` § 6.5, § 22.2 |
| ESP32-C5, ESP32-C6, ESP32-C3 | 2 | 1470 bytes | `docs/esptree_radio_v3_spec.md` § 6.5, § 22.2 |
| Any chip on IDF < 5.4 | not available | 250 bytes | `docs/esptree_radio_v3_spec.md` § 22.2 |

MTU is negotiated once per session and is fixed for that session: it is the smaller
of the two endpoints, and both must set `ESPNOW_SESSION_FLAG_V2_MTU`
(`device_code/components/esp_tree_common/espnow_types.h:21`;
`docs/esptree_radio_v3_spec.md` § 22.1; `esp_tree_remote/remote_protocol.cpp:1145-1146`).
Setting `force_v1_packet_size: true` on either component skips detection and pins
the session to `ESPNOW_V1_MAX_PAYLOAD` (250 bytes).

The V1/V2 table above names C5, C6 and C3 only; the spec does not classify C2, H2,
S2, S3, C61 or P4. **I could not determine their ESP-NOW radio version from this
repository** — the firmware reads it from the IDF call at runtime rather than
mapping it from the chip name, so the code contains no per-chip answer.

## Serial-transport UART0 pin map

A serial bridge scaffold must name a `tx_pin`/`rx_pin` pair, because ESPHome
rejects a `uart:` block with neither pin. The pins come from
`UART0_PINS_BY_VARIANT` (`app/yaml_scaffold.py:51-60`), keyed by the `variant`
value:

| `variant` | UART0 tx | UART0 rx |
|---|---|---|
| `esp32` | GPIO1 | GPIO3 |
| `esp32s2` | GPIO43 | GPIO44 |
| `esp32s3` | GPIO43 | GPIO44 |
| `esp32c2` | GPIO20 | GPIO19 |
| `esp32c3` | GPIO21 | GPIO20 |
| `esp32c5` | GPIO11 | GPIO12 |
| `esp32c6` | GPIO16 | GPIO17 |
| `esp32h2` | GPIO24 | GPIO23 |

Lookup falls back to `esp32` only when `variant` is absent **and** `platform` is
exactly `esp32` (`app/yaml_scaffold.py:68-74`). A C5 board with no `variant` gets
`None`, not a guess, and the scaffold raises rather than emitting a pinless block
(`app/yaml_scaffold.py:281-294`). `test/tests/test_serial_scaffold_pins.py:16-35`
asserts both behaviours.

Serial scaffolding is only reachable for boards that resolve pins. ESP8266 is
skipped by that test as "not a serial-transport target"
(`test/tests/test_serial_scaffold_pins.py:20-21`).

## ESP32-C61 and ESP32-P4: what is actually known

Both names are accepted by `validate_board()` because they are keys in
`CHIP_NAME_TO_BOARD`; both are named as detectable families by the browser chip
detector (`ui/src/pages/setup-page.ts:20`) and by the integration's chip-name
allowlist (`ha_integration/custom_components/esp_tree/remote_diagnostic_sensor.py:12-27`,
which also lists `ESP32-H21`, `ESP32-H4` and `ESP32-S3/FH`). The integration's
allowlist is wider than the scaffold's registry: those three extra names can appear
as reported chip names but have no board mapping.

Their firmware builds as C5 (C61) or S3 (P4) as described above. **No physical
C61 or P4 hardware is referenced anywhere in this repository**, so support for
those parts should be treated as untested.

## Chip identity in firmware images

`app/bin_parser.py:78-96` maps the OTA image header chip ID (bytes 12-13,
little-endian) to a chip name, covering `0x0000` ESP32, `0x0002` ESP32-S2,
`0x0005` ESP32-C3, `0x0009` ESP32-S3, `0x000C` ESP32-C2, `0x000D` ESP32-C6,
`0x0010` ESP32-H2, `0x0012` ESP32-P4, `0x0014` ESP32-C61, `0x0017` ESP32-C5,
`0x0019` ESP32-H21, `0x001C` ESP32-H4, `0x001F` ESP32-S3/FH, and ESP8266.
`docs/esptree_radio_v3_spec.md` § 19.5 documents the same offsets and § 19.6 warns
that byte 1 is the segment count, not the chip type.

The add-on warns rather than blocks when an uploaded image's chip does not match
the target device's reported chip (`app/preflight.py:56-60`), and when chip
metadata is missing on either side it warns that "the remote will perform final
image validation" (`app/preflight.py:61-62`).

## Boards used by the shipped demos

| Demo file | Component | Board |
|---|---|---|
| `device_code/demos/espnow-bridge-c5.yml` | `esp_tree_bridge` | `esp32-c5-devkitc-1` |
| `device_code/demos/espnow-bridge-c5-serial.yml` | `esp_tree_bridge` | `esp32-c5-devkitc-1` |
| `device_code/demos/espnow-bridge-nomqtt.yml` | `esp_tree_bridge` | `esp32-c5-devkitc-1` |
| `device_code/demos/espnow-remote-1.yml` | `esp_tree_remote` | `esp32dev` |
| `device_code/demos/espnow-remote-2.yml` | `esp_tree_remote` | `esp32dev` |
| `device_code/demos/espnow-microusb-1.yml` | `esp_tree_remote` | `esp32dev` |
| `device_code/demos/espnow-remote-leaf.yml` | `esp_tree_remote` | `esp32-c3-devkitm-1` |
| `device_code/demos/espnow-remote-us1.yml` | `esp_tree_remote` | `esp32-c3-devkitm-1` |
| `device_code/demos/espnow-remote-aqua.yml` | `esp_tree_remote` | `esp32-c3-devkitm-1` |
| `device_code/demos/espnow-remote-esp01.yml` | `espnow_82xx_remote` | `esp01_1m` |
| `device_code/demos/espnow-remote-esp12e.yml` | `espnow_82xx_remote` | `esp12e` |

One registry key does not appear in that list: `esp12e` is used only by the
ESP-12E demo and is not a `CHIP_NAME_TO_BOARD` entry. Demos that name a `variant`
do so inconsistently — the C3 leaf demos
have no `variant:` line, while `espnow-remote-aqua.yml` does. That is harmless for
a non-serial scaffold but is exactly the input that makes serial scaffolding raise
(see the UART0 section above).

## Unknown chips

If `find_board_info()` (`app/yaml_scaffold.py:87-111`) cannot resolve board info
from `board_info`, then `chip_type`, then `chip_name`, `generate_scaffold()` emits a
stub config instead of a buildable one: an `esphome:` block with the name, a comment
recording the unresolved `chip_type`/`chip_name`, `external_components:` pointing at
`/opt/esp-tree/components`, a `logger:`, and the component block with
`network_id`/`psk`/`ota_over_espnow: true`/`espnow_mode`
(`app/yaml_scaffold.py:136-168`). It returns `True` as the "unknown chip" flag. The
comment in that output says to create the config manually or use import.

A serial scaffold for a board with no UART0 mapping does not get that fallback: it
raises `ValueError` with the offending `board_info`, `variant` and `platform`
(`app/yaml_scaffold.py:289-294`).
