# ESP Tree — Install & End-to-End Test Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Comprehensively test the `esphomenow-tree-ha` (ESP Tree) project — install the add-on and integration into Home Assistant, flash the bridge and remote firmware onto real devices, and verify every transport (WiFi/WebSocket, MQTT-optional, Serial/USB) plus OTA end-to-end.

**Architecture:** ESP Tree is a monorepo with three coupled domains that must be tested together:
1. **Add-on** (`app/`, `ui/`, `rootfs/`) — FastAPI server + React UI, runs in a HA add-on container.
2. **HA integration** (`ha_integration/`) — custom_component that connects to the add-on over WebSocket protobuf and exposes entities.
3. **Device code** (`device_code/`) — ESPHome external components (bridge + remotes) flashed to ESP32 hardware.

The bridge relays ESP-NOW LR packets from remotes to the add-on over one of three transports: **WiFi/WebSocket protobuf** (default), **MQTT export** (optional), or **Serial/USB (COBS+protobuf)**. OTA of remote firmware runs over ESP-NOW via the bridge.

**Tech Stack:** Home Assistant (HAOS), HA add-on (Docker), custom_component (Python), FastAPI/Uvicorn, WebSocket + protobuf, ESPHome (ESP-IDF), ESP32-C5 bridge + ESP32 remotes, pyserial + COBS, pytest, C++/CMake/ctest.

---

## Current Context & Assumptions

- Repo: `/home/ben/projects/esphomenow-tree-ha` (monorepo, git).
- **Uncommitted restructuring in progress:** `device_code/components/` was flattened from `components/components/` → `components/` (many `D` deletions + untracked new files). The `docs/internal/serial_bridge_manual_test_checklist.md` was deleted. **Do not run `dev.sh qc` (it commits/pushes) during testing** — it will sweep up unrelated WIP.
- **Known blockers** (from `docs/roadmap_publish.md` §(a)) that must be fixed before reliable end-to-end testing:
  - A1: `bridge_api_key` missing from `secrets.example.yaml` → blocks all bridge compiles.
  - A2: `text_sensor` platform mapping broken (maps to `"sensor"`).
  - A3: Restart-from-repair flow unverified; `__init__.py:114` uses `blocking=False`.
  - A4: USB flash via `ha_compile.sh` broken — Docker missing `--device` passthrough.
  - A5: Compile status contradicts CHANGELOG.
  - A6: `.bin` vs `.ota.bin` accepted silently at upload (bricking risk).
  - A7: Rejoin verification uses uptime heuristic, not MD5/build-date.
  - A8: `cleanup` service missing from `services.yaml`.
  - A9: `update_repair.py` logs normal flow at ERROR.
  - A10: `strings.json` missing `already_configured` abort translation.
  - A11: `ha_compile.sh` Docker image unpinned.
  - A12: No repair flows for real failure modes.
- **Serial transport is the newest feature** and has **zero automated test coverage** for `app/bridge_serial_client.py` (`SerialBridgeClient`). The COBS cross-platform golden test exists (`ha_integration/tests/test_cobs_cross_platform.py`).
- Test infra already present:
  - Add-on Docker tests: `test/start-ha.sh` (runs container) + `test/run-tests.sh` (pytest inside container). Existing: `test/tests/test_v2_ota.py` (12 tests).
  - Integration tests: `ha_integration/tests/` (pytest, mocked HA via `conftest.py`).
  - C++ tests: `dev.sh build-cpp` / `dev.sh run-cpp` (17 targets).
  - ESPHome build/flash: `device_code/scripts/ha_compile.sh`; esplog: `ha_esplog_run.sh`.
- **Hardware available (assumed):** 1× ESP32-C5 bridge (WiFi-capable, USB-CDC), several ESP32 remotes (variants: remote-1, remote-2, aqua, esp01, esp12e, leaf, us1, microusb-1). Confirm actual boards before flashing.
- **Network:** bridge `use_address: 10.1.1.146`; addon test `.env` points `BRIDGE_HOST=10.1.1.146`, `BRIDGE_API_KEY=keyman123`. Log server `10.1.1.23:9999`.
- **Python note:** Add-on Python only runs inside the Docker container (per AGENTS.md). Do not `py_compile`/import outside the container.

---

## Proposed Approach

Test in layers, bottom-up, so each layer is proven before the next depends on it:

1. **Pre-flight** — fix the A1–A12 blockers that break real use; confirm hardware inventory.
2. **Unit/automated tests** — C++ (device), add-on Python (Docker), integration (mocked HA). Add missing serial-client tests.
3. **Device firmware** — compile all demos, flash bridge + remotes, verify boot + ESP-NOW link via esplog.
4. **Add-on standalone** — run add-on in Docker, connect to a real bridge, verify topology/state/commands.
5. **HA install** — install add-on + integration into HAOS, configure hub, verify entities.
6. **End-to-end scenarios** — WiFi, MQTT-optional, Serial transports; OTA; multi-bridge; failure/recovery.
7. **UI** — verify add-on web UI (topology, OTA, serial tab).
8. **Regression + cleanup** — re-run all automated tests, document results.

---

## Step-by-Step Plan

### Phase 0 — Pre-flight & Blockers

**Objective:** Ensure the repo is in a testable state and hardware is known.

**Task 0.1: Confirm hardware inventory**
- List available ESP32 boards and their USB ports (`ls /dev/ttyUSB* /dev/ttyACM*`, `dmesg`).
- Map each board to a demo config (bridge → `espnow-bridge-c5.yml`; remotes → the matching variant).
- Record each board's MAC (from boot log) for later topology verification.

**Task 0.2: Fix A1 — `bridge_api_key` in `secrets.example.yaml`**
- Add `bridge_api_key: <placeholder>` to `device_code/demos/secrets.example.yaml` so a fresh user can compile.
- Verify every bridge demo (`espnow-bridge-c5.yml`, `espnow-bridge-nomqtt.yml`, `espnow-bridge-c5-serial.yml`) resolves all secrets.

**Task 0.3: Fix A2 — `text_sensor` platform mapping**
- In `device_code/components/esp_tree_bridge/esp_tree_bridge.cpp` (mapping ~line 232), map `FIELD_TYPE_TEXT_SENSOR` → `"text_sensor"`.
- Remove the dead `text_sensor` callback in `ha_integration/custom_components/esp_tree/sensor.py` (or wire it correctly).

**Task 0.4: Fix A4 — USB flash `--device` passthrough**
- In `device_code/scripts/ha_compile.sh`, add `--device "${port_dev}"` to the `docker run` for `esphome upload`.
- Verify `dev.sh flash-usb /dev/ttyUSB0 <demo>` works.

**Task 0.5: Fix A6 — reject `.bin` at OTA upload**
- In `app/server.py` OTA upload endpoint, reject files not ending in `.ota.bin` (or validate the ESPHome OTA header) with a clear 400.

**Task 0.6: Fix A8 — register `cleanup` service**
- Add `cleanup` to `ha_integration/custom_components/esp_tree/services.yaml`.

**Task 0.7: Fix A10 — `already_configured` translation**
- Add the `already_configured` abort reason to `strings.json` and `translations/en.json`.

**Task 0.8: Fix A11 — pin `ha_compile.sh` Docker image**
- Pin the ESPHome compiler image to a specific tag in `ha_compile.sh` for reproducible C5 builds.

**Task 0.9: Fix A3/A7/A9/A12 (deferred but documented)**
- A3 (restart repair), A7 (MD5 rejoin verify), A9 (ERROR log level), A12 (repair flows) — note as known limitations; test current behavior and record results rather than fixing in this pass (unless time permits).

**Verification:** `git status` clean of accidental changes; all demos compile (Phase 2).

---

### Phase 1 — Automated Unit Tests (all layers)

**Objective:** Prove each layer's logic before touching hardware.

**Task 1.1: C++ device tests**
- Run: `./dev.sh build-cpp` then `./dev.sh run-cpp`.
- Expected: 17 test targets pass (protocol, heartbeat, packet sizes, parse helpers, counters, fragment assembly, route expiry, join status, state machine, retry backoff, encryption, hop encoding, fragment interleaving, error handling, boundary, file receiver, bridge OTA manager, bridge API proto messages, COBS codec).
- Record pass/fail per target.

**Task 1.2: Add-on Python tests (Docker)**
- Start container: `cd test && ./start-ha.sh` (or `./start.sh` for standalone UI).
- Run: `./test/run-tests.sh`.
- Expected: `test/tests/test_v2_ota.py` 12 tests pass.

**Task 1.3: Integration tests (mocked HA)**
- Run: `cd ha_integration && python3 -m pytest tests/ -v` (in an env with pytest + the conftest mocks; note AGENTS.md says Python isn't available in the dev workspace — run inside the add-on container or a venv with `pyserial`, `cobs`, `protobuf`).
- Expected: all entity tests (alarm, cover, event, fan, light, lock, valve, repairs), config e2e, COBS cross-platform pass.

**Task 1.4: Add serial-client unit tests (NEW — currently zero coverage)**
- Create `test/tests/test_serial_bridge_client.py` covering `app/bridge_serial_client.py`:
  - `_resolve_port` hotplug rename (`/dev/ttyUSB0` → `/dev/ttyUSB1` via HWID/description match) — mock `serial.tools.list_ports.comports()`.
  - `_connect_once` opens the resolved port at the configured baud.
  - COBS framing round-trip of a protobuf `Envelope` (reuse `test_cobs_cross_platform.py` patterns).
  - Auth flow: addon sends `ClientHello` → bridge responds `auth_challenge` → HMAC-SHA256 response.
  - Reconnect/backoff on port-missing; 60s timeout resets backoff.
  - `stop()` cancels reconnect task and fails pending futures.
- Run via `./test/run-tests.sh test_serial_bridge_client.py`.

**Task 1.5: Protobuf sync check**
- Run: `./dev.sh qc` is NOT allowed (commits). Instead run the protobuf regen + sync check manually:
  - `python3 -m grpc_tools.protoc -I app/protobuf --python_out=... --pyi_out=... app/protobuf/esp_tree_runtime.proto` for both `app/protobuf/generated` and `ha_integration/.../protobuf/generated`.
  - `diff` the two `.proto` files and the two generated `.py`/`.pyi` pairs — must be identical.

**Verification:** All automated tests green; serial client has coverage.

---

### Phase 2 — Device Firmware Build & Flash

**Objective:** Compile and flash bridge + remotes, verify ESP-NOW link.

**Task 2.1: Compile all demos**
- For each demo in `device_code/demos/*.yml`, run `./device_code/scripts/ha_compile.sh <demo> b` (build only).
- Expected: all compile cleanly (bridge-c5, bridge-nomqtt, bridge-c5-serial, remote-1, remote-2, aqua, esp01, esp12e, leaf, us1, microusb-1).
- Record firmware sizes and `.ota.bin` presence in `cache/builds/`.

**Task 2.2: Flash bridge (WiFi mode)**
- Flash `espnow-bridge-c5.yml` to the C5 board: `./device_code/scripts/ha_compile.sh espnow-bridge-c5 f` (or `dev.sh flash-usb /dev/ttyUSB0 espnow-bridge-c5` after A4 fix).
- Verify boot: WiFi connects, MQTT connects (if enabled), ESP-NOW init, web server on `:80`, protobuf WS endpoint up.

**Task 2.3: Flash remotes**
- Flash each remote variant to its board.
- Verify each boots ESP-NOW LR only (no WiFi), registers entities, sends heartbeat.

**Task 2.4: Verify ESP-NOW link via esplog**
- Start esplog: `./device_code/scripts/ha_esplog_run.sh restart`, check `status`.
- Confirm bridge sees each remote (topology), remotes report state, RSSI/hops present.

**Verification:** All devices boot; bridge topology lists all remotes; logs clean of errors.

---

### Phase 3 — Add-on Standalone (no HA yet)

**Objective:** Prove add-on ↔ bridge connectivity independent of HA.

**Task 3.1: Run add-on standalone**
- `cd test && ./start.sh` (standalone UI on `:8099`) or `./start-ha.sh` (addon container).
- Configure `.env` with `BRIDGE_HOST=10.1.1.146`, `BRIDGE_TRANSPORT=ws`, `BRIDGE_API_KEY=keyman123`.

**Task 3.2: Verify topology & state**
- Open `http://localhost:8099` — topology view lists bridge + all remotes.
- Confirm remote entity state updates flow through.

**Task 3.3: Verify commands round-trip**
- Send a command to a remote entity from the UI; confirm the remote applies it and ACKs.

**Verification:** Add-on shows live topology and state; commands work.

---

### Phase 4 — Home Assistant Install

**Objective:** Install add-on + integration into HAOS and configure.

**Task 4.1: Install add-on**
- Copy the repo (or a built tarball) into HA add-on store as a local add-on (or use the Dockerfile build).
- Install "ESP Tree" add-on; enable `host_network`, `uart`, `udev` (required for serial + USB flash).
- Start add-on; confirm ingress UI at `:8099`.

**Task 4.2: Install integration**
- Copy `ha_integration/custom_components/esp_tree/` into HA `custom_components/`.
- Restart HA.
- Add "ESP Tree" integration via Settings → Devices → Add Integration (or discovery via add-on).
- Hub config: add-on URL `http://127.0.0.1:8099` + integration token (from add-on shared config).

**Task 4.3: Verify hub connection & entities**
- Confirm `esp_tree/status` returns `{connected: true, bridge_count, remote_count, version}`.
- Confirm remote devices + entities appear in HA device registry, parented to the bridge device.
- Confirm auto-discovery: unknown remotes trigger config flow to assign an area.

**Verification:** Integration connects to add-on; all remote entities present and updating.

---

### Phase 5 — End-to-End Transport Scenarios

**Objective:** Verify each transport path and OTA.

**Task 5.1: WiFi/WebSocket transport (default)**
- Full path: remote → ESP-NOW → bridge → WS protobuf → add-on → integration → HA entity.
- Verify state updates, commands, entity availability, RSSI/hops attributes.

**Task 5.2: MQTT-optional transport**
- Flash a bridge with `mqtt:` block (`espnow-bridge-c5.yml`); verify MQTT discovery + state export to broker.
- Flash `espnow-bridge-nomqtt.yml`; verify protobuf-only operation (no MQTT) still works.

**Task 5.3: Serial transport (USB)**
- Flash `espnow-bridge-c5-serial.yml` to a C5 board; connect via USB to the add-on host.
- Add a serial bridge in the add-on UI (Serial tab): scan ports, select port, baud 460800, connect.
- Verify auth (ClientHello → challenge → HMAC), topology sync, state, commands over COBS+protobuf.
- Test hotplug: unplug/replug cable; verify reconnect + port rename handling.
- Verify OTA attempt on serial bridge → `COMMAND_STATUS_UNSUPPORTED` (bridge OTA over serial is unsupported).

**Task 5.4: OTA over ESP-NOW**
- Upload a new `.ota.bin` for a remote via the add-on UI.
- Confirm flash flow: `OtaStartRequest` → `OtaChunkRequest` (pull) → `OtaChunkBatch` (≤6×2048B) → `OtaStatus` → `WAITING_REJOIN` → rejoin verified.
- Verify remote runs new firmware (MD5/build-date) and rejoins topology.
- Test rollback: reflash previous firmware.

**Task 5.5: Multi-bridge**
- Add a second bridge (WiFi + serial simultaneously) in the manager.
- Verify `BridgeV2Manager` routes remotes to the correct bridge; both bridges' remotes appear.

**Task 5.6: Failure & recovery**
- Kill the add-on → integration shows disconnected; restart → auto-reconnect (exponential backoff).
- Power-cycle a remote → bridge marks it offline → remote rejoins → state restores.
- Unplug bridge USB (serial) → add-on retries with backoff → replug → reconnects.

**Verification:** All transports work; OTA succeeds with rejoin; recovery paths clean.

---

### Phase 6 — UI Verification

**Objective:** Verify the add-on web UI.

**Task 6.1: Topology page** — bridge + remotes render, live state, last-seen.
**Task 6.2: OTA page** — upload, flash progress, status, rejoin.
**Task 6.3: Serial tab** — port scan lists ports; connect works; WiFi tabs (Discover/Manual/Flash) unchanged.
**Task 6.4: Config page** — firmware retention, scan_subnets, bridge add/edit/remove.

**Verification:** UI functional across all tabs.

---

### Phase 7 — Regression & Documentation

**Objective:** Confirm nothing regressed and record results.

**Task 7.1: Re-run all automated tests** (Phase 1) — all green.
**Task 7.2: Re-run protobuf sync check** — in sync.
**Task 7.3: Write test report** — record per-task pass/fail, device MACs, firmware versions, known limitations (A3/A7/A9/A12).
**Task 7.4: Restore `docs/internal/serial_bridge_manual_test_checklist.md`** (was deleted) with updated results, or create a consolidated `docs/test_report.md`.

**Verification:** Full test report committed (or saved) documenting end-to-end results.

---

## Files Likely to Change

- `device_code/demos/secrets.example.yaml` (A1)
- `device_code/components/esp_tree_bridge/esp_tree_bridge.cpp` (A2)
- `ha_integration/custom_components/esp_tree/sensor.py` (A2)
- `device_code/scripts/ha_compile.sh` (A4, A11)
- `app/server.py` (A6)
- `ha_integration/custom_components/esp_tree/services.yaml` (A8)
- `ha_integration/custom_components/esp_tree/strings.json`, `translations/en.json` (A10)
- `test/tests/test_serial_bridge_client.py` (NEW)
- `docs/test_report.md` (NEW) or restored checklist

## Tests / Validation

- C++: `./dev.sh build-cpp && ./dev.sh run-cpp` (17 targets)
- Add-on: `cd test && ./start-ha.sh && ./run-tests.sh`
- Integration: `pytest ha_integration/tests/`
- Serial client: `./test/run-tests.sh test_serial_bridge_client.py`
- Protobuf sync: manual regen + `diff`
- Hardware: boot logs, esplog, HA entity states, OTA rejoin

## Risks, Tradeoffs, Open Questions

- **Uncommitted WIP:** The `device_code/components` flattening is mid-flight. Testing against it may hit stale paths. Recommend committing the restructure first (or testing on a clean branch) to avoid confusion.
- **Hardware availability:** Plan assumes specific boards. Confirm inventory before Phase 2.
- **A3/A7/A9/A12 deferred:** Restart-repair and MD5-rejoin are known-weak; test current behavior and document rather than fix in this pass.
- **Python env:** Add-on code only runs in Docker; integration tests need a venv with `pyserial`, `cobs`, `protobuf` (not present in dev workspace per AGENTS.md).
- **`dev.sh qc` commits/pushes** — do NOT run during testing; it will sweep up WIP and bump versions.
- **Open question (RESOLVED):** Target is a **real HAOS test VM** that Ben will spin up and provide credentials for. Phase 4 uses the standard HA add-on install path (local add-on repo + custom_component), and serial/USB device passthrough is handled via the VM's USB passthrough to the add-on container (`host_network`, `uart`, `udev`).

---

## Execution Handoff

Plan complete and saved. Ready to execute using subagent-driven-development — I'll dispatch a fresh subagent per phase with two-stage review (spec compliance then code quality). Shall I proceed?
