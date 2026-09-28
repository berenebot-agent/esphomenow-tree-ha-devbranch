# Changelog

This file documents released behaviour. Entries were maintained only up to
`0.1.38`; the add-on has since reached `0.1.309` and the intervening releases
are not itemised here. Rather than backfill ~270 versions, the release history
lives in `git log` — treat that as authoritative for what changed and when.
Future releases should add an entry here.

## Unreleased

- **Fixed a wedged serial bridge that stopped delivering topology entirely.** On the serial transport a snapshot refresh sent a bare `ClientHello`, which the bridge's UART handler treats as the start of a new session and re-challenges (a UART has no disconnect signal, so a new client must prove possession of the API key again). Nothing was listening for that challenge, so the bridge sat in `CHALLENGE_SENT` — answering keepalive Pings with more challenges, never a Pong, never a snapshot — and the bridge node itself disappeared from the topology. Only a manual reconnect cleared it. `refresh_snapshot()` now drives the full HMAC handshake, so the challenge is answered and the snapshot is delivered.
- **Rate-limited the empty-topology refresh retry.** It had no spacing and `topology()` is called by the UI's 3s poll, so a genuinely empty topology (or a wedged session) produced a continuous refresh stream — an HMAC handshake every ~3s on the UART. Now spaced to one attempt per 30s, so it stays a recovery path rather than a polling loop.
- **Removed the separate USB recovery route and device-detail button.** Existing devices continue
  to use the normal Edit YAML → Compile and Flash (USB via Browser) flow.
- **Moved permanent deletion into Hidden Devices.** Visible devices must be hidden first; the hidden
  list now offers equal-width Restore and Delete pills, with a confirmation before permanent deletion.
- **Standardized device action pills.** Settings and Edit YAML controls now use the same fixed width.
- **Dropped the config-state badge from topology rows.** The small bordered glyph left of each status
  light (`—` / `✓` / `↑`) read as a disabled button and was ambient state nobody acts on from the row.
  Config state is still on the device page. The one case that changes what the row's button does — no
  YAML yet, so Edit YAML opens "Create Config" instead of an editor — is now a small amber dot on that
  button. The `compile_queued`/`compiling` states also no longer render as a misleading `—`, since the
  badge is gone.

- **Browser USB flashing no longer asks for the device twice.** `esp-web-tools`' install
  dialog calls `navigator.serial.requestPort()` itself, so the USB chooser appeared again
  even when the wizard had just detected the chip over the same port. The detected port is
  now passed straight into the dialog, so a board already granted needs no second prompt at
  all. The flash step also reuses any port the browser has previously granted, and the
  `esp-web-tools`/`esptool-js` bundles are now vendored through `npm` instead of being
  fetched from `unpkg.com` at runtime (so browser flashing works without outbound internet
  access, and the versions are pinned).
- **Browser USB flashing no longer asks redundant questions.** The install manifests set
  `new_install_prompt_erase: false` and `new_install_improv_wait_time: 0`: the erase decision
  is already made by pressing Compile and Flash, and the firmware implements no Improv, so
  the dialog's post-write Improv probe could only ever stall for its 10 s default before
  continuing. Boards are still erased — the dialog erases by default when no erase prompt is
  configured and the device reports no Improv.
- **Bug fix — the Create Remote wizard advanced on an event that never fires.** It listened
  for `esp-web-tools`' `state-changed` `FINISHED` event to move to the Home Assistant step,
  but `esp-web-tools@10`'s dialog never dispatches `state-changed`; the event belongs to the
  Improv serial client. The wizard only appeared to work because of a manual "I've flashed
  it" button beside it, which is now removed in favour of watching the dialog's real state
  (with a manual continue offered if the dialog is dismissed before that completes).
- **Licensed AGPL-3.0-only.** Added the top-level `LICENSE` file. Previously the
  repository had no licence, which meant no one was permitted to use, modify or
  redistribute it.
- **Corrected `repository.yaml`.** It advertised the development fork
  (`berenebot-agent/esptree-dev`) as the add-on repository URL, which meant
  users' add-on stores pointed at a development snapshot rather than the
  canonical project. Now points at `dellarb/esphomenow-tree-ha`.
- **CI now runs the full test suite.** It previously ran 4 add-on tests and 1
  integration test out of ~180, so a change breaking any of the others merged
  green. Both suites now run in full, mirroring `test/run-unit-tests.sh`.
- **Documentation accuracy pass.** The README no longer claims HA presents a
  discovery confirmation for new remotes (remotes are auto-added), no longer
  carries a warning about a `repository.yaml` URL that has since been fixed, and
  its release-readiness gap list reflects the current tree.
- **Correction:** Native compilation is now implemented. The add-on bootstraps a local ESPHome venv (via `requirements-compile.txt`) and exposes `POST /api/devices/{mac}/compile`. The 0.1.38 note about "Native compilation not yet implemented" is obsolete — the compile button and compile queue are functional.

## 0.1.38

- **Breaking: Removed Docker-based compilation.** The add-on no longer requires `docker_api: true` and no longer spawns sibling ESPHome Docker containers for firmware compilation. All Docker-related code has been stripped from the backend, frontend, config schema, and init scripts.
- Compilation is disabled; the compile button will fail with "Native compilation not yet implemented." The compile queue system, config editor, OTA queue, and all other features remain fully functional.
- Removed: `docker` Python package, `docker_api: true` config, `docker_socket` option, Docker debug endpoints, Docker socket discovery in init script.
- Added: Placeholder panel in settings UI indicating compilation is unavailable.

## 0.1.33

- Disable AppArmor protection for the add-on so Home Assistant can mount the Docker socket when `docker_api: true` is enabled.
- Clarify Docker compilation troubleshooting in the add-on docs.

## 0.1.0

- Initial V1 add-on implementation.
- FastAPI backend with SQLite persistence.
- Lit/Vite ingress frontend.
- Topology proxy and recursive topology UI.
- Add-on-managed firmware upload, retention, OTA state machine, and bridge chunk feeding.
