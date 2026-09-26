# Contributing to ESP Tree

ESP Tree contains the Home Assistant add-on and integration, the web UI, and the ESP-NOW Long Range bridge and remote firmware. The Git repository is the `repo/` directory in this checkout; run repository commands from that directory unless stated otherwise.

## Start with the right context

Most changes belong to one domain:

- `app/` contains the add-on backend, bridge clients, OTA workers, stores, and models.
- `ha_integration/custom_components/esp_tree/` contains the Home Assistant integration, entities, services, and config flow.
- `ui/` contains the React/Vite add-on interface.
- `test/` contains the standalone add-on test environment.
- `device_code/components/` contains the ESPHome bridge, remote, legacy ESP8266, and shared components.
- `device_code/demos/` contains firmware configurations.
- `device_code/tests/` contains the C++ unit tests.
- `device_code/scripts/` contains compile, flash and serial-log helpers used by `dev.sh`.

Read the current code and executable configuration before relying on prose. The technical references are:

- `docs/esptree_radio_v3_spec.md` for the ESP-NOW LR protocol.
- `docs/esptree_api_protobuf_spec.md` for the protobuf/WebSocket API.
- `docs/ESP_guide_usblog.md` for direct USB serial logging.
- `docs/internal/serial_bridge_manual_test_checklist.md` for serial QA.

Historical plans, roadmaps and archives are **not** in this repository — they
live outside the git tree in the project's `docs/archive/`. Do not treat them as
current documentation.

## Scope and safety

- Confirm the scope of a new feature with the maintainer.
- Do not add a new dependency, service, or infrastructure component without an explicit request.
- Do not expand deferred work or unrelated backlog items while making a focused change.
- Stop and ask before changing authentication, credentials, encryption, persistence, destructive migrations, firmware flashing, or public protocol compatibility unless the request explicitly covers it.
- Report a real inconsistency between code, executable configuration, and documentation instead of silently resolving it.
- Never commit or expose credentials, private keys, API tokens, WiFi/MQTT secrets, or `device_code/demos/secrets.yaml`.

## Architecture invariants

- Bridge communication uses protobuf over WebSocket. Do not introduce HTTP polling or a second bridge transport.
- The Home Assistant integration connects to the add-on, not directly to the bridge.
- OTA control and transfer use the protobuf WebSocket flow. The REST upload endpoint is only the initial firmware-ingress path.
- `device_code/components/esp_tree_common/espnow_types.h` is the source of truth for protocol types, packet structures, constants, and field enums.
- Keep these protobuf definitions synchronized:
  - `app/protobuf/esp_tree_runtime.proto`
  - `ha_integration/custom_components/esp_tree/protobuf/esp_tree_runtime.proto`
- Treat protocol fields, packet sizes, entity mappings, and bridge/integration compatibility as load-bearing.
- Before changing a settled architectural decision, state the requirement, explain why the current design is insufficient, and identify compatibility impact.

## Development commands

Run commands from the repository root unless noted.

### Add-on and integration

```bash
./dev.sh verify addon
./test/build.sh
./test/start.sh
```

The add-on Python runtime is containerized. Do not validate imports or Python syntax with host `python` or `python3` commands. Integration tests live under `ha_integration/tests/` and run with pytest in the configured integration test environment.

For the UI, use the existing Node toolchain:

```bash
cd ui
npm ci
npm run build
npm run dev
```

`dev.sh qc` also builds the UI, regenerates protobuf files, and may update generated artifacts. Review its output and staged files before using it in a release workflow.

### Firmware

```bash
./device_code/scripts/ha_compile.sh
./device_code/scripts/ha_compile.sh <demo> b
./device_code/scripts/ha_compile.sh <demo> f
./device_code/scripts/ha_compile.sh <demo> bf
```

The menu also accepts `a` for all demos and `n` for none. `b` builds, `f` flashes a cached artifact, and `bf` builds then flashes. Firmware builds use Docker. Build the smallest affected target: shared or bridge changes require a bridge build; remote-only changes do not automatically require a bridge build.

Prefer a cached `.ota.bin` when flashing an already-built target. Never commit files under `cache/`, `logs/`, or generated local build output.

### C++ tests

```bash
./dev.sh build-cpp
./dev.sh run-cpp
```

### Logging

For direct USB serial logging, follow `docs/ESP_guide_usblog.md`.

The OTA/mDNS multi-device log collector (`esplog-master.py`, HTTP on `:5555`)
is a bench tool and deliberately lives outside this repository, in the
project's `tools/archive/` directory. It is not part of the add-on.

### Unified menu

```text
./dev.sh
./dev.sh compile
./dev.sh build-cpp
./dev.sh run-cpp
./dev.sh verify [global|device|addon]
./dev.sh qc [quick] [global|device|addon]
./dev.sh flash-usb <port> <demo>
./dev.sh esplog
./dev.sh clean
```

`dev.sh verify` runs the relevant deployment checks. `dev.sh qc` is broader: it can verify, bump versions, regenerate files, build the UI, and commit or push. Use it only when that broader pipeline is intended.

## Verification

- For documentation-only changes, inspect the diff and run `git diff --check`; a full test suite is normally unnecessary.
- For code changes, run the smallest relevant verification that covers the change.
- Run broader or expensive tests and firmware builds only when appropriate for the requested scope.
- Show complete build output, including warnings and errors.
- Report the exact commands run, results, and any checks not run. Do not claim a test, build, flash, or verification ran when it did not.

## Git workflow

- Canonical repository: `dellarb/esphomenow-tree-ha`.
- Upstream target branch: `master`.
- Working fork: `berenebot-agent/esphomenow-tree-ha-devbranch`.
- Current upstream pull request: <https://github.com/dellarb/esphomenow-tree-ha/pull/6>, from `esptree-dev` to `master`. PR #5 (from the retired `consolidate-latest` branch) is closed.
- Once implementation is requested, work on the active branch and commit focused changes in place. Do not create a separate branch for an ordinary change.
- Push the active branch to the fork and update its existing pull request, or open a pull request when the branch has none.
- Never push directly to the canonical repository.
- `esptree-dev` is a standalone snapshot of the release path, not the upstream pull-request fork. It has been branch-consolidated and is the only branch on both `berenebot-agent/esptree-dev` (as `main`) and the pull-request fork; any other branch name on a remote is stale.
- After a release, `git push devrepo HEAD:main` by hand — the push inside `dev.sh qc` has no upstream to reach `devrepo`.
- Stage only intended files, keep commits focused, and include the verification result in the change description.
- Keep local-only agent guidance outside the repository unless it is explicitly asked to be tracked.

## Versioning and generated files

Do not manually bump add-on or integration versions. The QC pipeline owns version changes for `server.py`, `config.yaml`, `ui/package.json`, and the integration manifest. Add-on and integration versions may advance independently.

Do not commit generated caches, logs, local configuration, or build artifacts. When a generated file must change, include it only when the repository workflow requires it and verify the source and generated copies remain synchronized.
