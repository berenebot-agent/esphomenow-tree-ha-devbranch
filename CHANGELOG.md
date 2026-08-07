# Changelog

## Unreleased

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
