# Changelog

This file documents released behaviour. Entries were maintained only up to
`0.1.38`; the add-on has since reached `0.1.309` and the intervening releases
are not itemised here. Rather than backfill ~270 versions, the release history
lives in `git log` — treat that as authoritative for what changed and when.
Future releases should add an entry here.

## Unreleased

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
