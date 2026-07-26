# ESP Tree — OSS Publish Readiness Roadmap

Findings from a full end-to-end review of the repository, organized into four
categories. Category (a) is the priority for completing end-to-end testing —
these are the issues that break or risk breaking real use. Categories (b)–(d)
are readiness work that can follow.

---

## (a) Functionality / Code Issues

Things that break real use, produce wrong behavior, or risk bricking devices.
**Priority: fix these first to enable reliable end-to-end testing.**

### A1. `bridge_api_key` missing from `secrets.example.yaml` — blocks all bridge compiles

**✅ FIXED — Added `bridge_api_key` key to `secrets.example.yaml`**

Every bridge demo references `!secret bridge_api_key` for HMAC API auth, but
the committed example secrets file does not define it. The maintainer's own
gitignored `secrets.yaml` has it (`bridge_api_key: "keyman123"`), so this was
never caught. A new user copying the example file will hit an ESPHome
secrets-resolution failure on first bridge compile.

**Refs:** `device_code/demos/secrets.example.yaml` (missing key),
`device_code/demos/espnow-bridge-c5.yml:77`,
`device_code/demos/espnow-bridge-nomqtt.yml:51`,
`device_code/demos/espnow-bridge-c5-serial.yml:60`

### A2. `text_sensor` platform mapping is broken

The bridge maps `FIELD_TYPE_TEXT_SENSOR` (0x14) to the platform string
`"sensor"`, so text_sensor entities arrive at the HA integration as numeric
sensors carrying string values. Meanwhile the integration registers a
`"text_sensor"` platform callback that the bridge never emits (dead code).
Text sensors will render as broken numeric sensors in HA or show "unknown."

**Refs:** `device_code/components/components/esp_tree_bridge/esp_tree_bridge.cpp:232`
(mapping), `ha_integration/custom_components/esp_tree/sensor.py:49-50`
(dead callback)

### A3. Restart-from-repair flow documented as broken / unverified

`docs/ESP_findings_restart.md:176` concludes "Status: Pending user test" after
7 failed implementation attempts. The shipped `repairs.py` (v7) was never
verified to work. Separately, `__init__.py:114` contains a `blocking=False`
restart call — exactly the pattern the findings doc flags as silently
swallowing failures. After every integration update, users see a "Restart
required" repair; clicking Submit silently marks it fixed without restarting,
leaving stale cached code running.

**Refs:** `ha_integration/custom_components/esp_tree/repairs.py:34-67`,
`ha_integration/custom_components/esp_tree/__init__.py:114`,
`docs/ESP_findings_restart.md:176`

### A4. USB flash via `ha_compile.sh` broken — Docker missing `--device` passthrough

The USB-flash function in `ha_compile.sh` runs `docker run` to invoke
`esphome upload --device <port>` but does not pass `--device "${port_dev}"` to
the container. The container cannot open the serial port. `dev.sh flash-usb`
routes through this broken path. Users must fall back to native
`esphome upload`, which is undocumented.

**Refs:** `device_code/scripts/ha_compile.sh:249-255`, `dev.sh:299-313`

### A5. Compile status contradicts CHANGELOG — unclear if compile works

**⏳ Still open**

`CHANGELOG.md:5-8` states compilation is disabled: "The compile button will
fail with 'Native compilation not yet implemented.'" But `app/compiler.py`
implements a real native compile path (bootstraps an esphome venv via pip),
`app/server.py:2473-2507` exposes a working `POST /api/devices/{mac}/compile`
endpoint, and the UI renders `renderCompiling` / `renderCompileQueued` states.
No `NotImplementedError` or "not yet implemented" string exists in the code.
Either the CHANGELOG is wrong (compile works) or the code is half-removed.

**Refs:** `CHANGELOG.md:5-8`, `app/compiler.py:60,111-155`,
`app/server.py:2473-2507`, `ui/src/components/ota-box.ts:160-165,207-232`

### A6. `.bin` vs `.ota.bin` accepted silently at upload — bricking risk

`bin_parser.py` validates only the ESP image magic byte (0xE9) and minimum
length — it does not distinguish a factory `.bin` from an OTA `.ota.bin`.
The UI file input `accept=".bin,.ota.bin"` actively permits the wrong format.
Flashing a factory `.bin` to a remote over ESP-NOW (no recovery console) could
brick the device with a vague "bridge OTA failed" message.

**Refs:** `app/bin_parser.py:66-121`, `app/firmware_store.py:27-53`,
`app/server.py:2092-2115`, `ui/src/components/ota-box.ts:177-178`,
`device_code/components/components/esp_tree_remote/remote_file_receiver.h:66-105`

### A7. Rejoin verification uses uptime heuristic, not MD5/build-date

AGENTS.md states the add-on "polls topology via BridgeV2Manager to verify
device rejoined with new firmware MD5 and build date." The actual
implementation (`ota_worker.py:484-491`) checks only `node.online AND
current_uptime < initial_uptime`. A device that reboots into the *same*
firmware (transfer succeeded but remote rejected/rolled back, or a power
glitch) reports SUCCESS because uptime reset. The UI displays MD5/build-date
comparison badges post-hoc, but the job's terminal status was already set by
the heuristic. A version mismatch is never produced as a job status.

**Refs:** `app/ota_worker.py:455-496` (esp. `:484-491`),
`ui/src/components/ota-box.ts:398-482`

### A8. `cleanup` service registered in code but missing from `services.yaml`

**✅ FIXED — Added `cleanup` stanza to `services.yaml`**

`services.py:63-73` registers `esp_tree.cleanup`, but `services.yaml` only
documents `send_command` and `forget_remote`. The service appears undocumented
in HA's service dev tools. AGENTS.md lists `cleanup` as a supported service,
so this is a bug, not intentional omission.

**Refs:** `ha_integration/custom_components/esp_tree/services.py:63-73`,
`ha_integration/custom_components/esp_tree/services.yaml`

### A9. `update_repair.py` logs normal control flow at ERROR level

**✅ FIXED — Changed 7 `_LOGGER.error(...)` calls to `_LOGGER.debug(...)`**

Six `_LOGGER.error(...)` calls fire for routine marker-file checks
("RESTART_ISSUE: marker NOT found", "marker EXISTS", "CREATING issue") on
every 60-second tick (`async_track_time_interval`). These are informational
control-flow messages, not errors. They spam the HA log at ERROR severity,
alarming users and triggering log-error sensors, masking real errors.

**Refs:** `ha_integration/custom_components/esp_tree/update_repair.py:34,41,44,50,53,56,64`

### A10. `strings.json` missing `already_configured` abort translation

**✅ FIXED — Added `already_configured` to both `strings.json` and `translations/en.json`**

`config_flow.py:167` aborts with `reason="already_configured"` and `:180` uses
`_abort_if_unique_id_configured()`, but `strings.json` / `translations/en.json`
do not define `already_configured`. HA renders a raw translation key to the
user instead of a friendly message. Also: `strings.json` has a `"repairs"` key
while `translations/en.json` uses `"issues"` — namespace divergence suggesting
the string-regen step isn't syncing.

**Refs:** `ha_integration/custom_components/esp_tree/config_flow.py:167,180`,
`ha_integration/custom_components/esp_tree/strings.json`,
`ha_integration/custom_components/esp_tree/translations/en.json`

### A11. `ha_compile.sh` Docker image unpinned — breaks C5 builds reproducibly

`ha_compile.sh:13` uses `DOCKER_IMG="ghcr.io/esphome/esphome:latest"`. The
ESP32-C5 board + `variant: esp32c5` + `esp-idf` framework needs a recent
ESPHome. An unpinned `:latest` could drift to a version that doesn't support
C5, or a user pulling on a different day gets a different build. The
add-on-side `requirements-compile.txt:1` pins `esphome==2026.4.5` but that
applies to the (disabled?) add-on compile path, not the demo build path.

**Refs:** `device_code/scripts/ha_compile.sh:13`,
`requirements-compile.txt:1`

### A12. No repair flows for real failure modes

Only one repair flow exists: `RestartRequiredFlow` (restart after integration
update, and it's broken — see A3). No repairs exist for the failure modes users
will actually hit in the field: remote offline / stopped reporting, bridge
WebSocket disconnected, schema hash mismatch (remote rejected), OTA job stuck
/ failed rejoin, auth challenge-response failure. The `issue_registry`
infrastructure is wired up but only used for the restart case.

**Refs:** `ha_integration/custom_components/esp_tree/repairs.py`,
`ha_integration/custom_components/esp_tree/update_repair.py`

### Suggested fix order for end-to-end testing

1. **A1** (bridge_api_key) — unblocks all bridge compiles
2. **A4** (USB flash --device) — unblocks first-flash of bridge + remotes
3. **A11** (pin Docker image) — ensures reproducible builds
4. **A2** (text_sensor mapping) — verify text sensors surface correctly
5. **A6** (.bin vs .ota.bin guard) — prevent bricking during OTA testing
6. **A7** (rejoin MD5 verification) — confirm OTA actually updated firmware
7. **A5** (reconcile compile) — decide if compile works or stub it honestly
8. **A8** (cleanup service.yaml) — quick fix, completes the service surface
9. **A10** (strings.json translations) — quick fix, clean UX
10. **A9** (ERROR log spam) — quick fix, reduces noise during testing
11. **A3** (restart repair) — verify or rewrite; needed for update flow
12. **A12** (failure-mode repairs) — can follow after e2e testing is stable

---

## (b) Documentation Cleanup / Readiness

Missing, stale, or misleading user-facing documentation. These don't break
code but prevent a new user from succeeding without reading source.

### B1. No top-level `README.md`

Repo root has `AGENTS.md` (maintainer-only) and `DOCS.md` (stale — see B2).
GitHub renders a raw file listing. No user entry point describing what the
project is, how to install, or how to flash.

### B2. `DOCS.md` documents a removed V1 HTTP API

`DOCS.md:8-12,39-46` describes `/topology.json`, `/api/ota/chunk`,
`/api/ota/start` — all removed (transport is now protobuf-over-WebSocket per
AGENTS.md). `DOCS.md:20-24` shows `bridge_host`/`bridge_port` config that
isn't in `config.yaml`'s schema. A user following DOCS.md fails at every step.

**Refs:** `DOCS.md:5,8-12,20-24,37-46`

### B3. No YAML configuration reference for `esp_tree_remote:` / `esp_tree_bridge:`

Schema exists only in Python `cv.Schema` (`__init__.py`) and inline demo
comments. No prose doc lists options, types, defaults, ranges, and when to
change them. Users cannot answer "how do I make this node a relay?" or "what
does `force_v1_packet_size` do?" without reading source.

**Refs:** `device_code/components/components/esp_tree_remote/__init__.py:41-58`,
`device_code/components/components/esp_tree_bridge/__init__.py:54-74`

### B4. No "your first real sensor" walkthrough

The only "complete entity" example (`espnow-remote-1.yml`) is a dev stress-test
harness (`optimistic: true` stubs, project version `"BLASTMEBABYV2"`). The one
real-world example (`espnow-remote-us1.yml` — JSN-SR04T ultrasonic sensor) is
unlabeled. No BME280 / GPIO relay / temperature sensor walkthrough exists. The
scaffold tool (`app/yaml_scaffold.py:217-219`) generates YAML ending with
`# Add your sensors, switches, etc. below` and then nothing.

**Refs:** `device_code/demos/espnow-remote-1.yml:75-376`,
`device_code/demos/espnow-remote-us1.yml:58-105`,
`app/yaml_scaffold.py:217-219`

### B5. No troubleshooting / FAQ documentation

No `docs/troubleshooting.md`, no "common problems," no "getting help" path.
The only troubleshooting table (`docs/ESP_standalone.md:374-391`) is for the
standalone ESP-IDF path, not the ESPHome YAML path users follow. Users will
open GitHub issues for every transient join failure.

### B6. `host_network` / `uart` / `udev` privileges undocumented

`config.yaml:15-17` grants privileged add-on capabilities. No install doc
mentions them or explains why they're needed. Users accept privileged access
blindly via the HA add-on store.

**Refs:** `config.yaml:15-17`

### B7. AGENTS.md platform count wrong (claims 15, actual 14)

**✅ FIXED — Removed `diagnostics` from the AGENTS.md platform list**

AGENTS.md lists 15 platforms including `diagnostics`. Actually 14 entity
platforms exist in `const.PLATFORMS` (no `diagnostics`); diagnostic entities
are injected into `sensor`/`binary_sensor`. The maintainer doc is misleading.

**Refs:** `AGENTS.md` (Supported platforms list),
`ha_integration/custom_components/esp_tree/const.py:37-52`

### B8. Relay / leaf configuration undocumented

`relay_enabled`, `preferred_parents`, `max_hops`, `route_ttl_seconds`,
`max_discover_pending` exist in the schema but no doc explains what they mean
or when to change them. A user deploying a multi-hop mesh must reverse-
engineer the protocol from `docs/esptree_radio_v3_spec.md`.

**Refs:** `device_code/components/components/esp_tree_remote/__init__.py:50-54`

### B9. `docs/ESP_briefing.md` references removed files and a different repo

References `bridge_client.py`, `bridge_ws_client.py` (removed — transport is
now `bridge_v2_client.py`), a separate `ESPLR_V2` repo, HTTP Bridge API v1,
MQTT-only architecture, and an entity-type table listing `climate`/
`humidifier`/`time`/`datetime` as supported when they aren't registered.

**Refs:** `docs/ESP_briefing.md:8-11,107-129,173-224,228-272`

### B10. No board / chip compatibility matrix

Demos target 5 board types (ESP32-C5, ESP32 classic, ESP32-C3, ESP-01,
ESP-12E). The V1/V2 MTU story (ESP8266 limited to 250-byte payloads, can't do
LR) is in the 1591-line protocol spec only. No quick reference for users
choosing hardware. Also: all demos use `espnow_mode: regular` despite the
project being named "ESP-NOW Long Range" — never explained.

**Refs:** `docs/esptree_radio_v3_spec.md:147,1534` (spec-only)

### B11. `scan_subnets` format and `init: false` undocumented

`scan_subnets` schema is just `str` — no doc says whether it's CIDR,
comma-separated, or space-separated. `init: false` means the add-on doesn't
auto-start; no doc tells the user to start it manually or configure
`scan_subnets` before first start.

**Refs:** `config.yaml:22,31-33`

### B12. One-active-job, firmware retention, reflash-as-rollback undocumented

All three are implemented (queue system, 7-day retention configurable via
`firmware_retention_days`, reflash from retained binaries) but no user-facing
doc or UI tooltip explains the rules or the rollback recovery path.

**Refs:** `app/db.py:422-431`, `app/server.py:2074-2076,2202-2245,2247-2258`,
`app/firmware_store.py:55-66`, `config.yaml:29,32`,
`ui/src/components/flash-history.ts:99-104`

### B13. Diagnostics minimal and undocumented

What exists: 4 bridge diagnostic sensors (wifi_signal, uptime, remotes_online,
remotes_direct) and 5 remote diagnostic sensors (rssi, hops, uptime,
last_seen, chip_name). Missing: `online`, `session_id`, `schema_hash`,
`parent_mac` as entities (only in diagnostics dump). No doc tells users which
diagnostics exist or how to interpret them.

**Refs:** `ha_integration/custom_components/esp_tree/diagnostics.py`,
`ha_integration/custom_components/esp_tree/bridge_diagnostic_sensor.py`,
`ha_integration/custom_components/esp_tree/remote_diagnostic_sensor.py`

### B14. MQTT-optional and serial bridge variants undocumented

Three bridge YAMLs exist (WiFi+MQTT, WiFi+protobuf-only, serial+protobuf-only)
with no "which to pick" guidance. The MQTT-optional switch (just delete the
`mqtt:` block) and the serial transport option are only documented in inline
YAML comments and internal workplans.

**Refs:** `device_code/demos/espnow-bridge-nomqtt.yml`,
`device_code/demos/espnow-bridge-c5-serial.yml`,
`device_code/components/components/esp_tree_bridge/__init__.py:24-35,83-91,111-114`

---

## (c) Code Cleanup (maintenance scripts, telemetry, dead code)

Code that runs in production but shouldn't, or scripts that are broken and
ship in the public repo.

### C1. `remote_logger_dev_only.py` phones home to maintainer's private IP in production

**Most critical cleanup item.** Both copies hardcode
`LOG_SERVER_URL = "http://10.1.1.23:9999"` and attach to the root logger:

- `app/remote_logger_dev_only.py:9` — `SOURCE = "addon"`, attached at
  `app/server.py:62,1162`
- `ha_integration/custom_components/esp_tree/remote_logger_dev_only.py:9` —
  `SOURCE = "integration"`, attached at `__init__.py:16,22` (import time) and
  `update_repair.py:15,18`

Every end-user HA install POSTs every `esp_tree` log line (entity names, MACs,
tracebacks, possibly config values) to a third-party IP. Each log call blocks
up to 1 second on networks where `10.1.1.23` is unroutable (i.e. everyone but
the maintainer). All exceptions are silently swallowed (`except Exception:
pass`). AGENTS.md says "temporary, remove when debugging complete."

**Action:** Delete both copies and all 5 import/call sites before publish.

### C2. `scripts/log_listener.py` binds unauthenticated on `0.0.0.0:9999`

Maintainer log ingest server committed to public repo. Binds all interfaces,
no auth, persists logs to `cache/logs/esp_tree_debug.jsonl`. Not shipped in
the add-on Docker image (Dockerfile doesn't COPY `scripts/`), but lives in the
public repo. A contributor running it verbatim opens an unauthenticated log
endpoint on their machine.

**Refs:** `scripts/log_listener.py:13-15`

### C3. `scripts/esplog-master.py` hardcodes maintainer paths

Hardcodes `PROJ_DIR`, `DEMOS_DIR`, `CACHE_DIR`, and
`DOCKER_IMG = "ghcr.io/esphome/esphome:latest"` (unpinned). Spawns Docker
containers per device. Maintainer tooling in public repo.

**Refs:** `scripts/esplog-master.py:38-43`

### C4. `check_protocol_sync.sh` references non-existent paths — dead script

Looks for `device_code/components/include/espnow_types.h`,
`device_code/components/espnow_lr_bridge/espnow_types.h`, etc. None of these
paths exist — the actual layout is
`device_code/components/components/{esp_tree_bridge,esp_tree_remote,esp_tree_common}/`.
The script always fails. Renamed from `espnow_lr_*` to `esp_tree_*` but the
script was never updated.

**Refs:** `device_code/scripts/check_protocol_sync.sh:5-10`

---

## (d) Repository & Governance

Repo structure, release metadata, OSS governance, and demo content quality.
These affect contributor experience, legal readiness, and the quality of
shipped reference material, but don't break end-to-end use.

### Structure & git hygiene

#### D1. `device_code/components/` gitignored but force-tracked (51 files)

**✅ FIXED — Removed `device_code/components/` from `.gitignore`**

`.gitignore:17` lists `device_code/components/`, yet 51 files are tracked
via `git add -f`. A fresh clone gets them today, but: `git clean -fdX`
silently wipes the directory; new files added under that path are ignored
unless force-added; semantically it claims source files are artifacts.

**Action:** Remove `.gitignore:17`.

**Refs:** `.gitignore:17` (51 tracked files in `device_code/components/`)

#### D2. `.gitignore` incomplete

Missing entries for `.venv/`, `.opencode/`, `.agents/`, `logs/`. These
directories exist in the working tree and could leak into commits.

**Refs:** `.gitignore`

#### D3. Internal dev artifacts tracked in public repo

`AGENTS.md`, `opencode.json`, `.codex`, `.opencode/`, `docs/superpowers/`
(agent-generated plans/specs), `.agents/` are all tracked. These are
maintainer tooling and AI-agent session artifacts that shouldn't ship to end
users. `docs/superpowers/` alone has 14 tracked files of agent workplans.

**Refs:** repo root (`AGENTS.md`, `opencode.json`, `.codex`, `.opencode/`),
`docs/superpowers/`

#### D4. `docs/serial_bridge_manual_test_checklist.md` is internal QA

**✅ FIXED — Moved to `docs/internal/serial_bridge_manual_test_checklist.md`**

33-line regression-test checklist ("WiFi mode bridge still compiles," "YAML
rejects both `wifi:` and `serial_transport:`"). Filed under `docs/` with no
"internal" prefix. Will confuse users looking for help.

**Refs:** `docs/serial_bridge_manual_test_checklist.md`

#### D5. `docs/ESP_findings_restart.md` is an open investigation log

325-line scratchpad documenting a known-broken repair flow with "Status:
Pending user test," "Open Questions," and 7 failed version attempts. Reads as
a maintainer TODO and signals to users that the restart repair is unverified.
Should be archived or removed once A3 is resolved.

**Refs:** `docs/ESP_findings_restart.md:176,299`

#### D6. `test/README.md` contains maintainer home directory path

`test/README.md:52` shows `/home/ben/ai-hermes-agent/cache/ha-tree-addon-cache/`
— a hardcoded maintainer home directory. Confusing in a public repo.

**Refs:** `test/README.md:52`

### Governance & metadata

#### D7. No LICENSE file

No license file at repo root. OSS publishing requires one. Unlicensed code is
"all rights reserved" by default — users have no legal right to use, modify,
or distribute.

#### D8. No CONTRIBUTING / CODE_OF_CONDUCT / SECURITY policy / `.github/` templates

No `.github/` directory. No issue templates, PR template, CONTRIBUTING guide,
CODE_OF_CONDUCT, or SECURITY policy. No "reporting an issue" path for users.

#### D9. `manifest.json` governance gaps

- `codeowners: []` — empty. HACS/HA convention requires at least one GitHub
  username. Required for HACS listing.
- `"documentation": "https://github.com/dellarb/esp-tree-ha"` — points to repo
  root, which has no README (lands on a file listing).
- No `requires_ha_version` — the integration uses `issue_registry`,
  `OptionsFlow`, `async_step_integration_discovery`,
  `async_remove_config_entry_device` (requires recent HA). Users on older HA
  get cryptic import errors instead of a clean "requires HA X.Y" message.
- `"dependencies": ["repairs"]` — `repairs` is built-in core, doesn't need
  declaring. Harmless but worth confirming intent.

**Refs:** `ha_integration/custom_components/esp_tree/manifest.json:4,6,11`

#### D10. `CHANGELOG.md` ~240 versions stale + 3 divergent version numbers

- `CHANGELOG.md:3` last entry = `0.1.38`
- `config.yaml:2` = `0.1.272` (add-on)
- `manifest.json:10` = `0.2.216` (integration)
- `Dockerfile:7` = `BUILD_VERSION=0.1.58` (stale image label default)

The add-on/integration divergence is by design (AGENTS.md), but the changelog
documents none of the ~234 add-on and ~178 integration releases since 0.1.38,
and the Dockerfile default doesn't match either current version.

**Refs:** `CHANGELOG.md:3`, `config.yaml:2`, `manifest.json:10`, `Dockerfile:7`

#### D11. Maintainer identity (`dellarb`) baked into published artifacts

`repository.yaml:2`, `Dockerfile:16` (OCI image source label),
`manifest.json:6` (documentation URL), and `docs/ESP_ha-addon-plan.md:563`
(GHCR image) all reference `dellarb/esp-tree-ha`. Confirm this is the intended
public maintainer identity; if not, update before publish.

### Demo / reference content quality

#### D12. `espnow-remote-1.yml` is a dev harness, not a deployment template

`optimistic: true` template stubs for every platform, project version
`"BLASTMEBABYV2"`, `web_server`/`api`/`ota` blocks inconsistent with the "no
WiFi" claim in its own notes (`:380`). A user copying this as a template gets
entities that do nothing. The commented-out sections (climate, siren,
humidifier, water_heater, camera, media_player) signal a coverage test matrix,
not a recipe.

**Refs:** `device_code/demos/espnow-remote-1.yml:19,75-376,380`

#### D13. `espnow-remote-aqua.yml` and `espnow-remote-leaf.yml` are 95% duplicates

Both have identical headers ("Leaf-only remote... forced to join through
relay1") despite being named "aqua" vs "leaf." Neither demonstrates anything
specific to its name (no water sensor, no pump). They differ only in
`preferred_parents` MAC and minor pin labels. Dilutes the "real-world
examples" value.

**Refs:** `device_code/demos/espnow-remote-aqua.yml:1-2`,
`device_code/demos/espnow-remote-leaf.yml:1-2`

#### D14. `espnow-microusb-1.yml` is a 20-random-sensor stress test, not a microUSB example

Generates 20 `random_sensor_N` template sensors at 2-4s intervals with a 100ms
`interval` loop. Despite the name and friendly_name ("ESP-NOW Micro USB 1
Device"), it's a radio/protocol load generator. Header comment is copy-pasted
from `espnow-remote-1.yml` and doesn't describe what the file does.

**Refs:** `device_code/demos/espnow-microusb-1.yml:1-12,71-185,454-509`

#### D15. `espnow-remote-leaf.yml` contradictory relay config

Header (line 1-2) says "Leaf-only remote... forced to join through relay1"
(implying it does NOT relay), but `relay_enabled: true` (line 46) means it CAN
relay. No explanation that a "leaf" with `relay_enabled: true` is a mid-mesh
node that both consumes and forwards, vs. a pure leaf with
`relay_enabled: false`.

**Refs:** `device_code/demos/espnow-remote-leaf.yml:1-2,46`

#### D16. Demo YAML Usage comments reference wrong filenames and extensions

**✅ FIXED — Corrected all stale filename/extension references**

- `espnow-bridge-c5.yml:8-9` says `esphome compile demos/espnow-bridge.yml`
  (file is `espnow-bridge-c5.yml`)
- `espnow-remote-1.yml:9-10` says `esphome compile demos/espnow_remote_prototype.yml`
  (file is `espnow-remote-1.yml`)
- `espnow-microusb-1.yml:9-10` same stale reference
- `secrets.example.yaml:3` says "Copy this to `secrets.yml`" (should be
  `secrets.yaml`)
- Multiple demos say "Copy `demos/secrets.example.yml`" (actual file is
  `.yaml`)

**Refs:** `device_code/demos/espnow-bridge-c5.yml:8-9`,
`device_code/demos/espnow-remote-1.yml:9-10`,
`device_code/demos/espnow-microusb-1.yml:9-10`,
`device_code/demos/secrets.example.yaml:3`

#### D17. Hardcoded maintainer IPs in demo `use_address`

**✅ FIXED — Commented out `use_address` in both bridge demos with placeholder note**

`espnow-bridge-c5.yml:40` — `use_address: 10.1.1.146`
`espnow-bridge-nomqtt.yml:31` — `use_address: 10.1.1.145`

A user copying a demo as-is will have ESPHome try to reach the maintainer's
bridge IP. Should be removed (let mDNS resolve) or commented with a
placeholder.

#### D18. Hardcoded maintainer MACs in demo `preferred_parents`

`espnow-remote-aqua.yml:48` (`E8:3D:C1:9D:6C:90`),
`espnow-remote-leaf.yml:47` (`AC:A7:04:BE:09:28`),
`espnow-remote-us1.yml:45` (`F4:2D:C9:58:33:10`),
`espnow-remote-2.yml:64` (`E8:3D:C1:9D:6C:D0`)

Users copying these demos get remotes trying to relay through non-existent
parents, causing confusing "no route" behavior. Should be commented out with
`# preferred_parents: ["AA:BB:CC:DD:EE:FF"]  # set to your relay's MAC`.

#### D19. All 11 demo YAMLs ship `logger: level: DEBUG` or `VERBOSE`

Every demo sets verbose logging. Combined with C1 (remote logger phones home),
this generates maximal log volume that gets POSTed off-box. Even without C1,
`VERBOSE` is excessive for field use and increases flash/airtime. No doc tells
users to dial this down for production.

**Refs:** all 11 files in `device_code/demos/espnow-*.yml`

#### D20. `secrets.example.yaml` has vestigial keys and a non-random-looking PSK

**✅ FIXED — Removed `api_encryption_key`, `remote_node_label`; replaced PSK with placeholder; added `bridge_api_key`**

- `api_encryption_key` (line 16) — no demo references it; vestigial
- `remote_node_label` (line 24) — no demo references it; vestigial
- Example PSK (`00112233...`, line 21) looks like a real key, not a placeholder
  (WiFi/MQTT entries say "REPLACE_WITH..." but the PSK doesn't)
- No `bridge_api_key` entry (see A1)

**Refs:** `device_code/demos/secrets.example.yaml:16,21,24`