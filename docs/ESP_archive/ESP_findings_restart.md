# HA Restart from Integration Repair Flow — Investigation

## Problem

When the ESP Tree add-on installs or updates its Home Assistant integration
(`custom_components/esp_tree/`), it writes a `.restart_required.json` marker file.
An `update_repair.py` watcher creates a fixable repair issue in HA. The user sees a
"Restart required" notification. Clicking "Submit" on the repair form should restart
Home Assistant — but **it does not actually restart HA**.

**Observed behaviour:** The repair form closes (marked as "fixed"), but HA does not restart.
Environment: HA OS / Supervised. No error shown in the UI.

## Architecture

Three restart paths exist in the add-on ecosystem:

| # | Path | Mechanism | Location |
|---|------|-----------|----------|
| 1 | Add-on `/api/restart` | Supervisor `POST /core/restart` → fallback to HA WebSocket `call_service homeassistant.restart` | `app/server.py:530-560` |
| 2 | HA integration direct call | `hass.services.async_call("homeassistant", "restart")` | `ha_integration/.../__init__.py` |
| 3 | Supervisor API direct | `POST http://supervisor/core/restart` with Bearer token | `ha_integration/.../__init__.py` (added in v6) |

The repair flow (`RestartRequiredFlow` in `__init__.py`) has evolved through 6 versions of
the restart mechanism.

## Git History — Timeline of Restart Flow Changes

### v1 — Initial: direct `await` (commit `110a4c5`)
```python
await self.hass.services.async_call("homeassistant", "restart")
return self.async_create_entry(title="", data={})
```
Moved flow from `repairs.py` to `__init__.py`. Simple direct service call.
No fallback. No error handling.

### v2 — `call_soon` with lambda (commit `62f5785`)
```python
self.hass.loop.call_soon(
    lambda: self.hass.services.async_call("homeassistant", "restart")
)
return self.async_create_entry(title="", data={})
```
**Intent:** Let the flow response return before the restart begins.
**BUG:** `call_soon` runs callbacks synchronously and does NOT handle coroutines.
The lambda returns a coroutine object that is never awaited — the restart service
**never executes**. This is the likely origin of the bug.

### v3 — `async_create_task` (commit `c5b4842`)
```python
self.hass.async_create_task(
    self.hass.services.async_call("homeassistant", "restart")
)
return self.async_create_entry(title="", data={})
```
**FIX for v2:** `async_create_task` properly schedules a coroutine on the event loop.
The restart service should now execute.

### v4 — `await` with `blocking=False`, add-on fallback first (commit `c1eecdc`)
```python
# Try add-on endpoint first
if await self._restart_via_addon():
    return self.async_create_entry(title="", data={})

# Fallback: direct HA service
try:
    await self.hass.services.async_call("homeassistant", "restart", blocking=False)
    return self.async_create_entry(title="", data={})
except Exception as exc:
    _LOGGER.warning(...)
```
Added `_restart_via_addon()` method (POSTs to add-on's `/api/restart`).
Issues:
- `_restart_via_addon` requires a hub config entry with `CONF_ADDON_URL` — if none
  exists (fresh install, no hub configured), returns `False` silently.
- `blocking=False` on the HA service call means service dispatch failures are
  swallowed. The `async_call` returns without exception even if the restart service
  dispatch fails.

### v5 — `await` with `blocking=True`, shared config fallback (commit `75a915a` / `3545eb2`)
```python
# Try add-on endpoint first
if await self._restart_via_addon():
    return self.async_create_entry(title="", data={})

# Fallback: direct HA service (blocking=True)
try:
    await self.hass.services.async_call("homeassistant", "restart")
    return self.async_create_entry(title="", data={})
except Exception:
    _LOGGER.info("Direct HA restart failed, trying add-on fallback")
```
Changes:
- `_restart_via_addon()` now falls back to `read_shared_config()` for `addon_url`
  when no hub entry exists (or when hub entry has no URL).
- Removed `blocking=False` — service dispatch failures now raise exceptions.
- HA service is tried first in the try/except; add-on is the implicit pre-check.

**User tested this version. Result: Form closes, no restart.**
Both paths (`_restart_via_addon` and `homeassistant.restart`) return "success" but
HA does not restart.

### v6 — Supervisor API direct (commit `9e33b92`)
```python
# Try supervisor API directly
if await self._restart_via_supervisor():
    return self.async_create_entry(title="", data={})

# Fallback 1: direct HA service
try:
    await self.hass.services.async_call("homeassistant", "restart")
    return self.async_create_entry(title="", data={})
except Exception:
    _LOGGER.info("Direct HA restart failed, trying add-on fallback")

# Fallback 2: add-on /api/restart endpoint
if await self._restart_via_addon():
    return self.async_create_entry(title="", data={})

_LOGGER.error("Failed to restart Home Assistant")
return self.async_show_form(..., errors={"base": "restart_failed"})
```
Added supervisor API path via `_restart_via_supervisor()`. Shared config fallback
for `_restart_via_addon`. HA service call without `blocking=False`.

**User tested this version. Result: No error, no restart, no log output.**
The "no log output" observation (even `_LOGGER.error` lines) suggests the repair
flow's step methods may not be executing at all — or the component file wasn't
deployed.

### v7 — `async_create_task` + hardened supervisor + diagnostic logging (HEAD)
```python
async def async_step_confirm_restart(self, user_input=None):
    if user_input is not None:
        self.hass.async_create_task(self._do_restart())
        return self.async_create_entry(title="", data={})

    return self.async_show_form(
        step_id="confirm_restart",
        data_schema=vol.Schema({}),
        ...
    )

async def _do_restart(self) -> None:
    await asyncio.sleep(0.5)  # let flow teardown complete first

    if await self._restart_via_supervisor():
        return

    # Fallback: HA service fire-and-forget
    await self.hass.services.async_call("homeassistant", "restart", blocking=False)

async def _restart_via_supervisor(self) -> bool:
    token = os.environ.get("SUPERVISOR_TOKEN")
    if not token:
        return False

    # POST http://supervisor/core/restart with Bearer auth
    # Catches:
    #   ServerDisconnectedError → success (supervisor killed connection during restart)
    #   TimeoutError → fail
    #   Other exceptions → fail
```
Key changes:
- **Architecture:** `async_create_task()` + immediate `async_create_entry` — flow closes
  before restart fires; `asyncio.sleep(0.5)` provides a gap for teardown.
- **`ServerDisconnectedError` catch:** Supervisor may kill the TCP connection the
  instant Core begins shutting down, before the HTTP response is serialized. This was
  likely the silent failure in v6 — aiohttp raised `ServerDisconnectedError` which the
  generic `except Exception` swallowed as a "fail", when it was actually a success.
- **`_restart_via_addon()` removed:** Can't reach the add-on at `127.0.0.1:8099` from
  inside the HA Core Docker container — always fails.
- **Aggressive `_LOGGER.error` diagnostic logging** added at every step of the flow
  (see "Diagnostic Logging" section).

**Status: Pending user test.**

## Cascade Summary (v7, current)

```
User clicks Submit
  |
  v
async_step_confirm_restart({})
  |
  v
hass.async_create_task(_do_restart())  ← fire & forget
  |
  v
async_create_entry(title="", data={})  ← form closes immediately
  |
  ──── (async gap: 0.5s) ────
  |
  v
_restart_via_supervisor()
  |
  ├─ ServerDisconnectedError → SUCCESS (return True)
  ├─ 2xx response → SUCCESS (return True)
  ├─ TimeoutError → FAIL (try HA service)
  └─ other Exception → FAIL (try HA service)
       |
       v (if supervisor returned False)
  homeassistant.restart (blocking=False)
```

## Server-Side Restart (Add-on's `/api/restart`)

Located in `app/server.py:530-560`:

```python
async def restart_home_assistant() -> dict[str, Any]:
    # Method 1: POST http://supervisor/core/restart
    #   Requires SUPERVISOR_TOKEN
    #   If 2xx → returns {"success": True, "method": "supervisor"}

    # Method 2 (fallback): HA WebSocket call_service homeassistant.restart
    #   Returns {"success": True, "method": "homeassistant_service"}
```

The `/api/restart` endpoint (`server.py:1082`) calls `restart_home_assistant()` and
returns `{"success": True}` if either method reports success. **However, "success" only
means the API call was accepted — not that HA actually restarted.**

## Diagnostic Logging (v7)

v7 adds `_LOGGER.error("RESTART_FLOW: ...")` at every step of the flow.
Error-level logs always appear in HA logs regardless of the configured log level.

**Expected log output (success path):**
```
RESTART_FLOW: async_step_init called
RESTART_FLOW: async_step_confirm_restart called, user_input=None
RESTART_FLOW: showing form (no user_input)
-- user clicks submit --
RESTART_FLOW: async_step_confirm_restart called, user_input={}
RESTART_FLOW: user_input received, scheduling restart task
RESTART_FLOW: task scheduled, returning async_create_entry
RESTART_FLOW: _do_restart entered, sleeping 0.5s
RESTART_FLOW: sleep done, calling supervisor restart
RESTART_FLOW: _restart_via_supervisor called, token=SET
RESTART_FLOW: posting to http://supervisor/core/restart
RESTART_FLOW: supervisor response status=200
  or
RESTART_FLOW: supervisor disconnected mid-restart (treating as success)
```

Submit the repair form and report which lines appear. This identifies the exact
execution point where the flow stops or silently fails.

## Known Issues & Observations

1. **`hass.services.async_call("homeassistant", "restart")` from within an HA integration**
   — This is the standard way to restart HA from within. It calls the core service handler
   which schedules `hass.async_stop(RESTART_EXIT_CODE)`. In HA OS, the supervisor should
   detect exit code 100 and restart the Core. Why this fails is unclear.

2. **The repair flow returns `async_create_entry` before the restart executes.**
   The flow response closes the UI dialog, marking the issue as fixed. If the restart
   never fires, the user sees a resolved repair but no actual restart.

3. **`_restart_via_addon()` URL resolution** — The add-on writes `addon_url` to the
   shared config as `http://127.0.0.1:8099`. From within the HA Core container, this
   points to HA Core's own port 8099, not the add-on's. The add-on's `/api/restart`
   uses `http://supervisor/` for its own calls, but the HA integration can't reach the
   add-on at `127.0.0.1:8099` in a Docker-based HA OS setup. This means `_restart_via_addon()`
   always fails when called from the HA integration (wrong address). **Removed in v7.**

4. **`SUPERVISOR_TOKEN` availability** — In HA OS, `os.environ["SUPERVISOR_TOKEN"]` is
   available inside the Core container. The supervisor API path depends on this.
   If the token is missing (non-HA-OS installs, or wrong container), it returns `False`
   and falls through to the HA service path.

5. **No user-facing error** — In v4/v5, if `_restart_via_addon` returned `False` and
   `homeassistant.restart` didn't raise (blocking=False swallowed errors), the flow
   returned `async_create_entry` successfully. The repair was marked fixed with no
   restart occurring.

6. **ServerDisconnectedError — most likely silent failure in v6** — When the supervisor
   initiates Core restart, it may kill the TCP connection before the HTTP response is
   fully serialized. In v6, `aiohttp` raised `ServerDisconnectedError` which was caught
   by the generic `except Exception` and treated as a failure — when it was actually a
   success. v7 explicitly catches this and returns `True`.

7. **Step name alignment critical** — The `step_id` in `async_show_form` must exactly
   match the method name (`async_step_{step_id}`). Mismatch means form submission silently
   goes to the parent class handler instead. v7 uses `step_id="confirm_restart"` with
   `async_step_confirm_restart` — verified consistent.

## Component Caching Concern

HA aggressively caches custom component Python files in memory. Even after updating
the files on disk via the add-on's file copy mechanism, HA may run the old version
until a full restart.

To verify the correct version is loaded:
- Use Developer Tools → Template: `{{ integration_version('esp_tree') }}`
- From HA config directory: `grep -n "async_create_task\|_do_restart\|RESTART_FLOW" custom_components/esp_tree/__init__.py`

## Open Questions

1. Why does `hass.services.async_call("homeassistant", "restart", blocking=True)` succeed
   (no exception) but HA does not restart? The handler schedules `async_stop(RESTART_EXIT_CODE)`
   — does this task get cancelled or silently fail?

2. Is the `SUPERVISOR_TOKEN` value correct at runtime within the HA Core container?
   A bad or expired token would cause `POST http://supervisor/core/restart` to return
   401/403, returning `False`, then falling through to the other methods.

3. Does the `aiohttp.ClientSession` from within the HA integration's repairs flow have
   the right network access to reach `http://supervisor/core/restart`? Docker DNS
   resolution for `supervisor` should work from within the HA Core container.

4. Does the `async_create_task` + `asyncio.sleep(0.5)` approach actually avoid the
   flow teardown race? The task runs on `hass.loop` so it should survive flow cleanup.

## Files Involved

| File | Role |
|------|------|
| `ha_integration/custom_components/esp_tree/__init__.py` | `RestartRequiredFlow` class (repair flow with restart logic) |
| `ha_integration/custom_components/esp_tree/update_repair.py` | Watcher that syncs `.restart_required.json` to HA repair registry |
| `app/server.py:530-560` | `restart_home_assistant()` — server-side restart via supervisor API |
| `app/server.py:1082` | `POST /api/restart` endpoint |
| `ha_integration/custom_components/esp_tree/config_flow.py` | `read_shared_config()` — reads add-on URL from shared config |
| `ha_integration/custom_components/esp_tree/translations/en.json` | UI strings for the repair flow |
