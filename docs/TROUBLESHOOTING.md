# Troubleshooting and FAQ

This guide covers the failure modes this project has actually exhibited. Each entry
gives the symptom as it appears, the cause, and the fix. Sources are the code and
tests in this repository; where a defect is described as fixed, the evidence is the
regression test or the comment that records it.

Two general rules before anything else:

1. **Read the firmware log, not the add-on UI, when a node will not join.** The
   remote prints its protocol state (`DISCOVERING`, `JOINING`, `JOINED`,
   `STATE_SYNC`, `NORMAL`, `WAIT_WIFI`) — see `docs/ESP_guide_usblog.md` for direct
   USB logging and `docs/ESP_standalone.md` § 5.1 for `get_state_name()`.
2. **If a node never joins, suspect the three shared credentials first**
   (`network_id`, `psk`, `espnow_mode`). A mismatch produces a device that flashes
   and boots cleanly but is silently deaf on air — see "A remote never joins"
   below.

## Bridge-side failures

### The bridge looks healthy but is deaf on air

**Symptoms.** The bridge boots, the WiFi or serial transport connects, the add-on
shows the bridge as connected, but no remote ever appears. Remotes stay in
`DISCOVERING` forever and neither side logs an error.

**Cause.** The WiFi driver was initialised but never started. `esp_now_init()`
does not start it. The bridge's own comment describes exactly this
(`device_code/components/esp_tree_bridge/esp_tree_bridge.cpp:442-449`):

> The driver must be STARTED, not merely initialised. `esp_now_init()` does not
> start it, and an initialised-but-stopped driver looks completely healthy from the
> outside: the component boots, the API/serial transport connects, the bridge
> reports online, and it is deaf on air. A remote then broadcasts DISCOVER into
> nothing, never receives DISCOVER_ANNOUNCE, and loops in discovery forever with no
> error on either side.

**Fix.** Update the firmware. The component now initialises and starts WiFi itself,
only when nothing else has, probed with `esp_wifi_get_mode() == ESP_ERR_WIFI_NOT_INIT`.
The sequence is `init -> set_mode -> set_storage(RAM) -> set_ps(NONE) -> start ->
disconnect` (`esp_tree_bridge.cpp:427-476`). `WIFI_STORAGE_RAM` stops the driver
reading stale AP credentials out of NVS and `WIFI_PS_NONE` stops power-save duty
cycling from swallowing ESP-NOW frames (`:454-462`). Serial-mode boot logs
`"WiFi driver started by bridge (serial mode, no wifi: component)"` with the
channel (`:479-482`).

### Serial-mode bridge crashes in a reset loop at boot

**Symptoms.** Guru Meditation / Instruction access fault shortly after boot, then a
boot loop. Only on a bridge built with `serial_transport:`.

**Cause.** In serial mode there is no `wifi:` component, so nothing called
`esp_wifi_init()`, and `esp_now_init()` ran against an uninitialised WiFi stack
(`esp_tree_bridge.cpp:419-425`).

**Fix.** Same fix as above — the component initialises the stack itself. If you are
on an older build, do not work around this in YAML: the failure is in component
start-up order, not configuration.

### `ESP-NOW disabled: waiting for Wi-Fi` and dropped frames

**Symptoms.** Log line `"ESP-NOW disabled: waiting for Wi-Fi"`, and for each
received frame `"ESP-NOW frame dropped: espnow_allowed_=false (Wi-Fi disconnected)"`.

**Cause.** This is the WiFi-mode gate, not a fault: the bridge only accepts ESP-NOW
frames once WiFi reports connected (`esp_tree_bridge.cpp:2492-2500`, `:643-646`).
In **serial** mode this gate is bypassed and the log instead reads
`"ESP-NOW enabled (serial mode — no WiFi required)"` (`:2486-2488`).

**Fix.** If you see the "waiting" message on a WiFi bridge, the WiFi link is down.
Check the `wifi:` block and its credentials. If you see it on a serial bridge, you
are running a build without the serial gate bypass — update.

### Remote is refused before flashing: ESP8266 is "not buildable in this release"

**Symptoms.** The Create Remote wizard disables the ESP8266 chip and shows, in
place of the raw compiler error:

> ESP8266 remote firmware is not buildable in this release. Its receiver links
> ESPHome's ESP8266 OTA backend, which the remote scaffold does not load. Choose an
> ESP32 remote (C3, C5, C6, S3), or build this device outside the wizard. Bridge
> firmware for ESP8266 is unaffected.

**Cause.** `espnow_82xx_remote/remote_file_receiver.h` includes
`esphome/components/ota/ota_backend_esp8266.h`, and ESPHome only copies a component
into the build tree when it is loaded. A remote scaffold emits no `ota:`/`wifi:`,
so the header is absent. Before the refusal existed, the user waited minutes and
then got a `#include ... No such file or directory` naming a header that is missing
by design (`app/flash_wizard.py:71-88`, `app/server.py:1728-1734`).

**Fix.** Use an ESP32 remote, or build the ESP8266 firmware outside the wizard. The
two ESP8266 demos (`device_code/demos/espnow-remote-esp01.yml`,
`device_code/demos/espnow-remote-esp12e.yml`) are working examples. Making the
wizard path buildable would need the scaffold to emit `wifi:` + `network:` + `ota:`
for ESP8266 — deferred, per `app/flash_wizard.py:79-80`.

## Compile failures

### `fatal error: md5.h: No such file or directory`

**Symptoms.** A remote config fails to compile with a missing-header error for
`esphome/components/md5/md5.h`. Bridges are unaffected.

**Cause.** `remote_file_receiver.h` includes `md5.h` unconditionally, and ESPHome
only copies **loaded** components into the build tree. On a bridge, `ota:` happens
to `AUTO_LOAD` md5, which masked the problem; a remote deliberately has no
`ota:`/`wifi:` (`device_code/components/esp_tree_remote/__init__.py:22-28`).

**Fix.** The component now declares `AUTO_LOAD = ["esp_tree_common", "md5"]`
(`esp_tree_remote/__init__.py:28`). If you hit this, your component copy is stale. Do not work
around it by adding an `ota:` block to a remote.

### `global_wifi_component` is undeclared

**Symptoms.** Compile stops during discovery, referencing the WiFi component in a
remote that has no `wifi:` block.

**Cause.** Two code paths referenced `wifi::global_wifi_component` outside a
`USE_WIFI` guard. The symbol only exists when the `wifi` component is loaded
(`device_code/components/esp_tree_remote/remote_protocol.cpp:2016-2020`, `:2428-2432`).

**Fix.** Both paths are now wrapped in `#ifdef USE_WIFI` with a `false` fallback.
Update the component. The affected paths are a radio-channel hint and a
WiFi-channel wait, neither of which a plain ESP-NOW remote needs.

### `ESPHome compile failed with exit code 2` on a serial bridge

**Symptoms.** A serial-transport bridge scaffold fails at config load with exit
code 2. The log shows ESPHome rejecting the `uart:` block:
`"Must contain at least one of tx_pin, rx_pin, port"`.

**Cause.** The board info carried no `variant`, so the scaffold emitted a UART block
whose pins were commented out. A commented pin pair is not a usable config — it just
moves the failure to compile time, where it reads like a firmware fault rather than
a bad board argument (`app/yaml_scaffold.py:281-288`; regression test
`test/tests/test_serial_scaffold_pins.py:1-8`).

**Fix.** The scaffold now raises immediately with the offending
`board_info`/`variant`/`platform`, naming `UART0_PINS_BY_VARIANT` as the required
source (`app/yaml_scaffold.py:289-294`). Pass a board whose `variant` is in that map
— see `docs/BOARD_MATRIX.md`. Note that a chip selected without a `variant`
(a C5 with no variant) resolves to `None` rather than falling back to the classic
ESP32 pin pair (`test_serial_scaffold_pins.py:29-31`).

### `Component web_server_base requires component network`

**Symptoms.** A serial bridge scaffold dies at config load. The message names
`web_server_base`.

**Cause.** `web_server_base` and the `web_server` OTA platform depend on ESPHome's
`network` component, which `wifi:` normally supplies. A serial bridge has no `wifi:`
but still emits `web_server:`/`ota:`, so `network:` must be requested explicitly
(`app/yaml_scaffold.py:227-232`).

**Fix.** Add an empty `network:` block — the serial demo does
(`device_code/demos/espnow-bridge-c5-serial.yml:47-51`). Generated scaffolds add it
automatically whenever there is no WiFi secret and a `web_server:` or `ota:` block
is wanted (`app/yaml_scaffold.py:233-241`).

### `[type] is an invalid option for [framework]` on an ESP8266 config

**Symptoms.** Every scaffolded ESP8266 config is rejected before it reaches the
compiler.

**Cause.** ESPHome's `esp8266:` block accepts no `framework:` key at all — the
framework is implied (Arduino). Only ESP32 takes a framework block
(`app/yaml_scaffold.py:188-192`).

**Fix.** The scaffold now emits no `framework:` for `esp8266`
(`app/yaml_scaffold.py:193-194`). If hand-editing, delete it. Note the registry
entry for ESP8266 does record `"framework": "arduino"`
(`app/yaml_scaffold.py:29`) but that value is never written into the YAML.

### `hardware_uart` under `uart:` fails validation

**Symptoms.** A serial bridge config is rejected. The error points at
`hardware_uart` inside the `uart:` block.

**Cause.** `hardware_uart:` is **not** a valid option under `uart:` in ESPHome — it
only exists under `logger:`. A previous revision of the serial demo used
`hardware_uart: USB_CDC` there, which fails validation outright
(`device_code/demos/espnow-bridge-c5-serial.yml:62-64`).

**Fix.** Put `hardware_uart:` only under `logger:`. The serial demo and the scaffold
both use `logger: hardware_uart: UART0` (`espnow-bridge-c5-serial.yml:32`;
`app/yaml_scaffold.py:270`).

## Boot-log and console failures

### An early crash looks like a silent hang

**Symptoms.** No log output at all on a CH340/CP2102 adapter wired to the UART0
pins, even for a panic. The device appears dead.

**Cause.** Without `hardware_uart:`, ESPHome defaults the ESP32-C5/C6/S3 to
USB-Serial-JTAG and emits `CONFIG_ESP_CONSOLE_UART_NUM=-1`, routing the log stream
**and any panic backtrace** to native USB — a port those boards do not use on a
UART-adapter wiring (`app/yaml_scaffold.py:265-269`;
`espnow-bridge-c5-serial.yml:26-31`).

**Fix.** Set `logger: hardware_uart: UART0` and keep its `baud_rate` the same as the
`uart:` bus baud. Both are 460800 in the serial demo
(`espnow-bridge-c5-serial.yml:32-33`, `:67`).

### Serial data is lost or the bridge drops frames under load

**Symptoms.** Frames go missing at 460800 baud, particularly while the radio is
busy.

**Cause.** The ESP32 hardware FIFO is 128 bytes and data arrives at roughly 46 KB/s
at 460800 baud, so a small RX buffer overflows during ESP-NOW radio operations
(`app/yaml_scaffold.py:62-63`; `espnow-bridge-c5-serial.yml:56-60`).

**Fix.** Keep `rx_buffer_size: 16384` on the `uart:` block. That is
`SERIAL_RX_BUFFER_SIZE` (`app/yaml_scaffold.py:64`) and the demo's value
(`espnow-bridge-c5-serial.yml:68`).

## Remote join failures

### A remote never joins, and nothing logs an error

**Symptoms.** The remote sits in `DISCOVERING` indefinitely. The bridge logs
nothing, or only low-level `[DROP]` lines at debug level.

**Cause (in order of likelihood).**

1. **`network_id` mismatch.** The bridge drops a DISCOVER whose length byte differs
   from its own (`esp_tree_bridge.cpp`-side handler,
   `device_code/components/esp_tree_bridge/bridge_protocol.cpp:764-771`), then drops
   one whose bytes differ. Comparison is exact and case-sensitive.
2. **`psk` mismatch.** The PSK tag fails with the debug line
   `"%s[DROP] L2 psk_fail"` (`bridge_protocol.cpp:584-586`).
3. **`espnow_mode` mismatch.** `lr` selects `WIFI_PROTOCOL_LR` and anything else
   selects `WIFI_PROTOCOL_11B|11G|11N` (`esp_tree_bridge.cpp:488-493`,
   `esp_tree_remote.cpp:310`). Nothing negotiates this; a bridge in LR and a remote
   in regular simply never hear each other.
4. **Bridge deaf on air** — see the first entry in this document.

**Fix.** Make `network_id`, `psk` and `espnow_mode` identical on the bridge and the
remote, then reflash. The bridge and every remote resolve the PSK at compile time,
so a change requires reflashing all nodes (`README.md:115-117`). The add-on will not
let you do this wrong by accident: a remote flash whose credentials disagree with
the configured network is refused with
`"network_id does not match the configured ESP-NOW network (...)"` or
`"psk does not match the configured ESP-NOW network..."` rather than silently
replacing the live PSK (`app/flash_wizard.py:29-53`), because the failure is
"firmware that compiles but can never join" (`app/server.py:1782-1785`).

Raise the log level to DEBUG to see the `[DROP]` lines; they are emitted via
`ESP_LOGD`, so they are invisible at the default level.

### ESP-NOW OTA to a remote fails, remote stays on old firmware

**Symptoms.** The flash job reaches the transfer stage but the remote never comes
back on the new version.

**Cause.** `ota_over_espnow` is `false` on the remote. The file receiver is gated on
it and logs `"Ignoring %s from %s because ota_over_espnow is disabled"`
(`device_code/components/esp_tree_remote/remote_protocol.cpp:723-724`, `:789`).

**Fix.** Set `ota_over_espnow: true` on the remote and reflash it over USB/serial
once. Note that `ota_over_espnow` defaults to `false` on **both**
`esp_tree_remote` (`esp_tree_bridge/__init__.py:61`) and `esp_tree_bridge`
(`esp_tree_bridge/__init__.py:67`), while every scaffolded config and every shipped
demo sets it to `true` (`app/yaml_scaffold.py:315`, `:325`;
`espnow-bridge-c5.yml:72`, `espnow-remote-1.yml:68`). A hand-written config that
omits it has OTA disabled.

### A remote joins but is only reachable through a specific relay

**Symptoms.** A leaf joins only when a particular relay is in range, or joins the
"wrong" node.

**Cause.** `preferred_parents` is an **ordered preference**, not a filter. Candidate
selection compares the sender's index in the list first, then hop count, then RSSI,
and accepts the best candidate found even when it is not in the list
(`device_code/components/esp_tree_remote/remote_protocol.cpp:2316-2341`).

**Fix.** Order the list by preference; the first match wins ties. Remember the list
is also mutated at runtime by the `SET_PARENT_MAC` config command, which moves a MAC
to the front or clears the list
(`esp_tree_remote/remote_protocol.cpp:1410-1413`; flags and command ids at
`device_code/components/esp_tree_common/espnow_types.h:322-332`). Setting a parent
from the UI therefore changes what the next discovery will prefer.

## ESP8266-specific failures

### ESP8266 remote: unicast sends fail, or the AP channel is wrong

**Symptoms.** `esp_now_send` reports failure, or the peer cannot be reached.

**Cause.** Two things, both inherent to the Arduino ESP-NOW stack on ESP8266:

- Unicast ESP-NOW requires `WIFI_AP_STA` mode. Pure `WIFI_AP` or pure `WIFI_STA`
  both cause unicast TX CB `status=FAIL`. ESPHome's `wifi: ap:` config normally
  starts `WIFI_AP` (`device_code/components/espnow_82xx_remote/espnow_82xx_remote.cpp:320-331`).
- The channel must match. The component does not call `WiFi.softAP()` — ESPHome owns
  the AP — so its `channel` option and the AP's channel must agree
  (`espnow_82xx_remote.cpp:322-327`).

**Fix.** The component upgrades the mode to `WIFI_AP_STA` itself and logs
`"Switched WiFi to AP_STA mode for unicast ESP-NOW (was mode=%u)"`. Keep
`channel:` on the component equal to `wifi: ap: channel:` — both demos use 11
(`device_code/demos/espnow-remote-esp01.yml:37-51`,
`device_code/demos/espnow-remote-esp12e.yml:40-54`).

Also note that ESP8266 unicast ESP-NOW fails outright at the protocol level — the
stack gets no 802.11 ACK from any device — so the component sends **all** frames as
broadcast and relays forward based on `leaf_mac` in the ESP-NOW header rather than
the 802.11 destination (`espnow_82xx_remote.cpp:582-585`). This is why the ESP8266
component cannot relay: see `docs/BOARD_MATRIX.md`.

### ESP8266 remote has no RSSI

All ESP8266 receive paths report RSSI as 0; the limitation is stated in both ESP8266
demos (`device_code/demos/espnow-remote-esp01.yml:7-11`,
`espnow-remote-esp12e.yml:7-11`). Do not treat a zero RSSI on an ESP8266 node as a
diagnostic signal.

## Add-on and topology failures

### A genuinely online remote has no card, while a long-dead one does

**Symptoms.** `/api/devices` holds only the bridge. A remote that is online is not
listed, while a remote restored from the integration store is.

**Cause.** `upsert_devices_from_topology` was only called from the `full_snapshot`
path, so a remote that joined **later** (arriving as
`remote_schema_changed`/`remote_metadata_changed`) never got a `devices` row. The
visible symptom is described as inverted
(`app/bridge_v2_client.py:1092-1099`; regression test
`test/tests/test_remote_device_row.py:1-9`).

**Fix.** The `_handle_remote_snapshot` path now persists the device row through the
same upsert. Asserted by `test/tests/test_remote_device_row.py`.

### A retained remote disappears from the topology page

**Symptoms.** The "known" remote count is higher than the number of rows; a remote
from an earlier session exists in the count but has no row, no config badge and no
Edit YAML button.

**Cause.** Two filters gated on `hops > 0`. A retained remote is restored from the
integration store without a hop count, so it was dropped from the page entirely
(`ui/src/components/topology-map.ts:132-137`,
`ui/src/components/topology-node.ts:48-50`).

**Fix.** Both now keep any non-hidden node that is either reachable (`hops > 0`) or a
retained remote, and a retained remote with no (or a dead) `parent_mac` is parked
under the bridge rather than dropped (`topology-map.ts:150-151`).

### A fake offline node that cannot be removed

**Symptoms.** A duplicate row for a remote that is already flashed and live. The
row is offline forever and no endpoint removes it.

**Cause.** `/api/bridge/flash-wizard/submit` registers synthetic device rows
(`FF:FF:FF:FF:FF:FF` for bridge provisioning, `FF:FF:FF:FF:FF:FE` for remote
provisioning) so the wizard can poll compile status before the device exists. They
are deliberately not real nodes, so they never appear in the bridge or retained
topology — and `remove_remote` verified against that topology before deleting, so a
placeholder 404'd and stayed forever (`app/server.py:2376-2384`;
`test/tests/test_placeholder_removal.py:1-20`).

**Fix.** `DELETE /api/topology/remote/{mac}` now clears a placeholder directly,
before the topology guard, returning `"synthetic": true` and `"integration": false`
(`app/server.py:2385-2401`). The ordering matters: a placeholder branch placed after
the topology lookup would be dead code, which is what
`test_placeholder_removal.py:53-66` asserts against.

### "Reconnected" is reported but nothing is connected

**Symptoms.** The reconnect button reports success, but the bridge stays offline.

**Cause.** `reconnect_bridge()` returns `False` when no client exists for that
bridge, and the old handler discarded the result and always returned
`reconnected=True`. A bridge whose client was never started — skipped for a missing
`api_key`, or a WiFi bridge with no `host` — therefore reported a successful
reconnect (`app/server.py:2152-2158`).

**Fix.** The handler now raises HTTP 409 with a specific reason:
`"bridge has no api_key, so no client is started for it"`,
`"bridge has no host, so no client is started for it"`, or
`"no client is running for this bridge"` (`app/server.py:2160-2166`).

### A bridge with no `api_key` is listed, enabled, and silently does nothing

**Symptoms.** A bridge row appears correctly configured, but nothing connects and no
message anywhere says why.

**Cause.** `sync_bridges` skips a bridge with no `api_key` and a WiFi bridge with no
`host`, and that fact was not surfaced anywhere
(`app/bridge_v2_client.py:426-434`, skip reasons at `:474-481`).

**Fix.** Skips are now recorded in a per-uuid `_skipped_bridges` map with the reason,
and the UI prefers the add-on's per-bridge client state instead of merely asking
whether the bridge is the active one (`ui/src/components/settings.ts:176-180`).
If you see a bridge that will not connect, check whether an `api_key` exists for it.

### Bridge entities vanish after reloading the integration, with `already been setup!`

**Symptoms.** Reloading the hub leaves every bridge entity missing until a full HA
restart. The log shows
`"Config entry ESP Tree (...) for esp_tree.sensor has already been setup!"`.

**Cause.** Hub entries forward platforms too, so they must unload them as well.
Previously only `remote` entries unloaded, so the hub's platforms stayed loaded and
the re-setup failed (`ha_integration/custom_components/esp_tree/__init__.py:196-202`).

**Fix.** Hub entries now unload `PLATFORMS` on unload
(`ha_integration/custom_components/esp_tree/__init__.py:202`). Restart Home
Assistant once to clear an already-wedged state.

### "Entities: Not Yet Added" points at a page that cannot work

**Symptoms.** A remote's device page shows the red `Entities: Not Yet Added` badge.
Its link goes to `config/integrations/dashboard/add?domain=esp_tree`, which aborts
with `already_configured` because the hub is already installed.

**Cause.** Remotes used to be created only after a confirmation form, so
discovery flows parked in `discovery_confirm` and were never confirmed. That URL
starts a `user` flow rather than a discovery flow, so it can never add a *remote*
(`ui/src/pages/remote-wizard.ts:52-58`, `:429-437`;
`ha_integration/custom_components/esp_tree/config_flow.py:175-188`).

**Fix, part one.** Remotes are auto-added — `async_step_integration_discovery` now
creates the entry outright and there is nothing mandatory to ask
(`config_flow.py:175-203`). An area can be set afterwards from the device page.
`async_step_discovery_confirm` is retained only so an in-flight older flow can still
be completed (`config_flow.py:205-228`).

**Fix, part two.** An **old** flow parked in `discovery_confirm` still blocks the
retry: HA refuses a second flow for the same (handler, unique id) with
`already_in_progress`. That "corpse" is now cleared before a new discovery is
scheduled (`ha_integration/tests/test_stale_discovery_flow.py:1-21`). The
integration's `_abort_stale_discovery_flow` only touches `esp_tree` flows whose
normalised unique id matches the remote, and is best-effort by design
(`test_stale_discovery_flow.py:77-147`).

**Fix, part three.** The wizard now runs the discovery path itself via
`/api/integration/setup` rather than sending you to the generic add-integration URL
(`ui/src/pages/remote-wizard.ts:429-437`).

### The remote flash wizard is stuck at step 1

**Symptoms.** The remote wizard polls forever and is told `provisioning: false`.

**Cause.** A remote deliberately has no `bridges` row, so the wizard's status
endpoint — which keyed off the provisioning bridge — had nothing to report
(`app/server.py:1907-1909`).

**Fix.** `GET /api/bridge/flash-wizard/status` now falls back to
`_remote_provisioning_status()`, which reads the remote placeholder device row and
reports `kind: "remote"` with `bridge_detected`/`remote_detected` set once the bridge
reports the remote in its live topology (`app/server.py:1910-1913`, `:1951-1998`).

### The remote wizard also reported "idle" forever after a build finished

**Cause.** `active_job_for_device` only returns non-terminal jobs, so once a build
reached a terminal state the endpoint reported `idle` and any client polling it
could never learn the result (`app/server.py:1963-1967`).

**Fix.** The remote status path surfaces the latest terminal compile result
(`app/server.py:1968-1975`). Separately, the remote wizard polls the **per-device**
compile status rather than the flash-wizard status, for the same reason
(`ui/src/pages/remote-wizard.ts:276-277`).

### A serial bridge is never "detected", and the wizard tells you to check WiFi

**Cause.** A serial bridge has no host to be discovered at. The wizard's
`bridge_detected` came from `host not in ("", "0.0.0.0")`, which is permanently
false for serial, and the wizard has no other signal (`app/server.py:1925-1932`).

**Fix.** For a serial transport, `bridge_detected` now asks the bridge manager
whether the add-on's serial client for that bridge is actually connected
(`app/server.py:1926-1932`).

### `503 bridge unavailable: 'SerialBridgeClient' object has no attribute '_send'`

**Symptoms.** Rediscover (or any snapshot refresh) fails with that exact 503 on a
serial bridge.

**Cause.** `BridgeV2Manager.refresh_once` called `client._send(...)`, a private
method only `BridgeV2Client` defines. `SerialBridgeClient` sends through
`_send_async`/`_send_envelope_sync`, so the refresh raised `AttributeError`. It
stayed hidden because `topology()` only refreshes when the node list is empty
(`test/tests/test_transport_refresh.py:1-20`).

**Fix.** Each client now exposes a public `refresh_snapshot()`, called through
`getattr(client, "refresh_snapshot", None)` so a transport missing it is skipped
rather than breaking the whole refresh (`test/tests/test_transport_refresh.py:84-94`).

## Serial transport failures

### The serial client connects, then instantly disconnects, in a loop

**Symptoms.** The add-on reports connected and immediately disconnected,
repeatedly.

**Cause.** `_reconnect_loop()` tears the port down in its `finally` block as soon as
`_run_auth()` returns, so returning straight after a successful handshake killed the
reader thread immediately (`app/bridge_serial_client.py:317-330`).

**Fix.** The session is now held open by `_await_session_end()`, which waits until
the reader thread dies — a read error or the no-data timeout
(`app/bridge_serial_client.py:317-330`). Do **not** attempt to cancel the reconnect
task from the reader thread: that task is inside `_await_session_end()` waiting for
that very thread, so cancelling it tears the session down and the client flaps
instead of recovering (`app/bridge_serial_client.py:457-461`).

### `connection timeout (no data for 60s)` on an idle-but-healthy link

**Symptoms.** A serial bridge session ends after 60 seconds of quiet, then
reconnects.

**Cause.** `CONNECTION_TIMEOUT_S = 60` (`app/bridge_serial_client.py:25`). A quiet
link looks identical to a dead one.

**Fix.** A keepalive Ping is sent every 20 seconds of idle
(`KEEPALIVE_INTERVAL_S`, `app/bridge_serial_client.py:26-32`), with a 5-second Pong
timeout. A failed ping does not tear the link down — a genuinely dead link is caught
by the reader's timeout (`app/bridge_serial_client.py:300-304`). If you still see
60-second timeouts, the bridge is not answering Pings: check that the bridge
firmware is current.

### A silent reader exit

**Symptoms.** The session ends with no explanation.

**Cause.** From the outside, a silent reader exit is identical to a healthy idle
link, which made this hard to diagnose
(`app/bridge_serial_client.py:372-373`).

**Fix.** The reader now logs why it exited:
`"reader thread exiting (stop=%s connected=%s serial_open=%s)"`
(`app/bridge_serial_client.py:374-378`). Check that line first.

### A serial snapshot is accepted as authentication

This was a defect class, not a user-visible symptom: accepting `full_snapshot` or
`auth_ok` as proof of authentication would connect without a handshake. The client
now refuses them before the challenge and buffers them until `auth_ok`
(`app/bridge_serial_client.py:394-400`; tests
`test/tests/test_v2_ota.py:22-58`). If you see a serial session that reports
connected without a challenge/response exchange, that is a bug worth reporting.

### Remote ESP-NOW OTA fails over a serial bridge

**Symptoms.** Flashing a remote fails with
`"OTA is not supported over serial transport"`.

**Cause.** The serial transport refused every OTA envelope outright, even though the
bridge's OTA machinery (`bridge_ota_manager` / `api_ota_*`) is transport-agnostic
and already reaches the remote over ESP-NOW
(`device_code/components/esp_tree_bridge/bridge_api_serial.cpp:129-137`;
`test/tests/test_serial_ota_support.py:1-11`).

**Fix.** The serial transport now dispatches `OTA_START_REQUEST`,
`OTA_CHUNK_BATCH` and `OTA_ABORT_REQUEST` to real handlers, with the same CRC-32,
offset and flags validation as the WebSocket transport, and sits behind the
authentication gate (`test/tests/test_serial_ota_support.py:32-99`).

**What is still not supported:** OTA *of the bridge itself* over the same cable.
That needs esptool on a USB connection, and the caveat is deliberately left in the
source (`bridge_api_serial.cpp:138-141`,
`test/tests/test_serial_ota_support.py:37-44`).

### `serial port ... not found`, or a `socket://` URL is rejected

**Cause.** `serial.Serial()` only accepts a device path; pyserial's URL schemes
(`socket://`, `rfc2217://`, …) need `serial_for_url()`.

**Fix.** The client opens everything through `serial.serial_for_url()`, which also
accepts plain paths, so both work (`app/bridge_serial_client.py:171-184`). This is
what makes `socket://host:port` usable for a byte-stream bridge.

### The bridge's `api_key` is un-editable

**Symptoms.** Saving a bridge record for a serial bridge fails validation.

**Cause.** A serial bridge is reached over a byte stream, not TCP host/port, so the
WebSocket validator could not reach it and would build `"ws://:80/..."`. Failing
here made the `api_key` permanently un-editable
(`app/server.py:570-575`).

**Fix.** The TCP validator is skipped for serial bridges
(`app/server.py:568-577`); the transport handshake is the real check.

## OTA job failures

### `rejoin_timeout` — the transfer succeeded but the device did not come back

**Cause.** A job is marked successful only once the node rejoins. The rejoin wait is
`ota_rejoin_timeout_s`, **180 seconds** by default (`app/config.py:21`). On expiry
the job is finished as `REJOIN_TIMEOUT` with
`"bridge transfer succeeded but the device did not rejoin before timeout"`
(`app/ota_worker.py:515-516`). Note this is a *warning* class result, not a failure
of the transfer itself — the UI colours it amber, like `version_mismatch`
(`ui/src/pages/job-page.ts:18-19`, `:152-153`).

**Fix.** Check the node's log. A remote that does not rejoin usually failed to boot
the new image, or is out of range of its parent. Transfer itself is capped separately
by `ota_transfer_timeout_s`, **1800 seconds** (`app/config.py:22`). Both are
`Settings` fields with no `config.yaml` option exposed — the add-on options are only
`firmware_retention_days` and `scan_subnets` (`config.yaml:28-33`), so they are
**not user-configurable through the add-on UI** in this release.

### `version_mismatch` — the device rejoined but reports the old version

**Cause.** The node rejoined (detected by an uptime reset) but its reported
`firmware_version` does not match the expected `parsed_version`. The job is closed as
`VERSION_MISMATCH` with
`"firmware version mismatch after rejoin — device may not have updated"`
(`app/ota_worker.py:495-512`). If either version string is empty, the check is
skipped and the job is marked successful
(`app/ota_worker.py:504-513`).

**Fix.** Reflash. Retention makes reflash-as-rollback the recovery path — any
retained binary can be reflashed from the job history
(`README.md:186-190`; `app/server.py:2716`).

### The upload is rejected: `firmware file must be an OTA image (.ota.bin)`

**Cause.** Uploading a factory `.bin` over ESP-NOW would brick the device, so the
upload path requires the filename to end in `.ota.bin`
(`app/firmware_store.py:47-49`).

**Fix.** Upload the `.ota.bin`, not the `.factory.bin`. The factory image is for
USB/serial flashing only. Other rejections from the same path:
`"firmware file is empty"` (`:45`) and the parser's own error
(`:54`, backed by `app/bin_parser.py:71-75`).

### `409 this device already has an active or pending OTA job`

**Cause.** One OTA job at a time per device, and one across the add-on
(`app/server.py:2588-2590`, `:2722`). The compile path raises
`409 device already has an active job (<status>)` (`app/server.py:3013`).

**Fix.** Let the current job finish, or abort it from the queue. OTA jobs can be
paused, reordered and aborted (`README.md:203-205`;
`app/server.py:2801-2850`).

### OTA start fails with a raw compiler/transport error

The bridge maps a free-text OTA start failure to a wire error code that the add-on
switches on, shared by every transport — it started as a file-static in the
WebSocket transport, which meant the serial transport could not reuse it
(`device_code/components/esp_tree_bridge/bridge_api_types.h:48-51`). If you see a
transport-specific OTA error, that is the code to read.

## Hardware and detection failures

### Chip detection times out or reports `unknown`

**Symptoms.** `POST /api/bridge/flash-wizard/detect-chip` returns
`{"chip_name": "unknown", "board_info": null, "error": "..."}`.

**Causes and messages** (`app/compiler.py:571-625`):

| Error text | Meaning |
|---|---|
| `esptool timed out after 10 seconds` | The chip did not answer. Try a different reset mode. |
| `esptool exited with code N: ...` | esptool ran and failed; the output is included. |
| `could not detect chip from output: ...` | esptool succeeded but no chip name could be parsed. |
| `chip '<name>' not in CHIP_NAME_TO_BOARD mapping` | The chip is real but unsupported by the scaffold. |
| `esptool not found: ...` | The esptool binary is missing from the add-on. |
| `permission denied on port <port>` | The port needs permissions — see `docs/ESP_guide_usblog.md` § "Permission Setup". |

**Fix.** The request accepts an optional `before` field
(`app/server.py:362-364`) passed through as esptool's `--before` global option,
which must precede the subcommand (`app/compiler.py:580-586`). Use it to change the
reset mode when a board will not enter download mode.

Note that `--before` is a *global* option and must come before `chip-id`; getting
that ordering wrong was a real defect (`app/compiler.py:579-586`).

### A node reboots into the old firmware after an update

**Cause.** This is the ESP-IDF rollback path, not an add-on bug. If an OTA image is
left in `PENDING_VERIFY` the bootloader can roll back. The remote clears this
deliberately on boot and logs
`"OTA partition in PENDING_VERIFY state, marking app as valid to clear rollback flag"`
(`device_code/components/esp_tree_remote/esp_tree_remote.cpp:290-297`).

**Fix.** If a remote rolls back, its firmware predates that clear. Reflash over
USB/serial once.

## FAQ

**What is the minimum set of files and services I need?**
A Home Assistant OS or Supervised install; the ESP Tree add-on; one ESP32 bridge
flashed with `esp_tree_bridge`; and one remote. Chrome or Edge over HTTPS is needed
for browser USB flashing, because the UI loads `esp-web-tools` and `esptool-js` from
`unpkg.com` and therefore needs outbound internet access (`README.md:46-61`).

**Do I need MQTT?**
No. MQTT is compile-time optional. Remove the `mqtt:` block and the protobuf
WebSocket API becomes the sole upstream transport
(`device_code/demos/espnow-bridge-nomqtt.yml:1-3`, `README.md:162-164`).
`mqtt_discovery_prefix` is accepted but ignored without `mqtt:`
(`espnow-bridge-nomqtt.yml:49-50`).

**Which ESP-NOW mode should I use: `lr` or `regular`?**
The protocol is built around Long Range mode, and `lr` is the schema default for
both `esp_tree_bridge` and `esp_tree_remote`. The shipped demos currently use
`regular` (`README.md:5-6`, `README.md:123`). Whatever you choose, the bridge and
every remote must use the same value.

**Can I run two bridges at once?**
Not with the same PSK/network_id. Multiple bridges are supported as **passive
failover only** — "Multiple bridges with same PSK/network_id must not be
simultaneously active" (`docs/esptree_radio_v3_spec.md`, "Known Issues and
Constraints"). The add-on can store multiple bridge records but at most one is active
at a time (`README.md:20-22`).

**Why is my maximum payload 250 bytes and not 1470?**
MTU is negotiated once per session and is the weaker of the two endpoints: both the
bridge and the leaf must be V2-capable (C5/C6/C3) *and* set
`ESPNOW_SESSION_FLAG_V2_MTU`. If either side is V1-only, or the IDF is older than
5.4, the session uses 250 bytes (`docs/esptree_radio_v3_spec.md` § 22.1 "MTU
Negotiation" and § 22.2 "V1 <-> V2 Session Matrix" / "V2 Radio Detection";
`device_code/components/esp_tree_common/espnow_types.h:19-21`). Setting
`force_v1_packet_size: true` forces it deliberately.

**Can an ESP8266 be a relay?**
No. It is a protocol-level constraint, not a configuration choice: ESP82xx cannot
transmit ESP-NOW unicast reliably. ESP82xx nodes are leaf-only
(`docs/esptree_radio_v3_spec.md` § "ESP82xx Leaf Limitations";
`espnow_82xx_remote/remote_protocol.cpp:1492`).

**Can I power down a remote between reads?**
Deep-sleep command delivery is out of scope: "Commands arriving while leaf is
sleeping are queued in RAM with TTL. No NVS persistence"
(`docs/esptree_radio_v3_spec.md`, "Known Issues and Constraints").

**Do stale Home Assistant entities get cleaned up automatically after a bridge
reboot?**
No. The bridge is stateless on reboot by design and its schema cache is RAM-only;
stale HA entities from prior sessions must be manually cleared
(`docs/esptree_radio_v3_spec.md`, "Known Issues and Constraints").

**Where do secrets live?**
In the add-on's `secrets.yaml`, editable from the UI and checked before a compile
(`app/yaml_store.py:58-76`; `app/server.py:3313-3325`). It holds WiFi, MQTT, OTA,
`espnow_network_id`, `espnow_psk` and `bridge_api_key`
(`device_code/demos/secrets.example.yaml:1-29`). Persistent add-on state is under
`/data`; shared integration runtime state is under `/share/esp_tree`
(`app/config.py:66-83`;
`ha_integration/custom_components/esp_tree/const.py:17-20`).

**Home Assistant says a restart is required. What is that?**
The add-on installs the integration into `/config/custom_components/esp_tree` and,
when the version changed or it was a fresh install, writes a restart marker
(`rootfs/etc/cont-init.d/00-prepare.sh`). The integration raises a fixable
`restart_required` repair whose fix flow restarts HA
(`ha_integration/custom_components/esp_tree/repairs.py:14-43`). A stale marker is
cleared automatically once the running version matches
(`update_repair.py:36-71`); `GET /api/restart-required` reports the decision
(`app/server.py:1294-1321`).

**Where do I read the protocol details?**
`docs/esptree_radio_v3_spec.md` is authoritative for frame layout, PSK and session
tags, packet types, join flow and relay rules, and
`docs/esptree_api_protobuf_spec.md` for the protobuf/WebSocket contract.
`device_code/components/esp_tree_common/espnow_types.h` is the source of truth for
packet types, structures and field enums, with `static_assert`s pinning the wire
sizes.

**How do I run the tests before reporting a bug?**
`./dev.sh verify global` runs unit tests, C++ tests and a smoke compile; it is
non-mutating. `./dev.sh qc` is a mutating release pipeline — it verifies, may
regenerate files and bump versions, then commits and pushes. Do not run `qc` to
check a diagnosis. Add-on Python is containerised: do not validate its imports or
syntax with the host `python` (`CONTRIBUTING.md:56-73`, `README.md:214-239`).

**The add-on UI misbehaves and I do not have Home Assistant handy.**
`./test/start.sh` runs the standalone add-on UI harness. Note that Home
Assistant-only setup and cleanup actions are unavailable there
(`README.md:34`).
