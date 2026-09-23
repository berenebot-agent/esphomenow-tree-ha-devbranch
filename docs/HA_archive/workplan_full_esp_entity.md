# Workplan: Full ESPHome Entity Type Integration via Bridge Protobuf API

## Objective

Integrate all 7 missing ESPHome entity types through the bridge protobuf (v2) API and into Home Assistant, achieving **full functional parity** with the bridge's existing MQTT discovery path. Currently, the HA integration only supports 8 entity types (sensor, binary_sensor, switch, button, number, select, text, text_sensor). This workplan adds light, fan, cover, valve, lock, alarm_control_panel, and event.

The existing MQTT discovery path on the bridge already fully supports these types — this effort brings the same capabilities to the protobuf/WebSocket path used by the HA integration.

### Alignment Principle

Every entity type must support the **same commands and state semantics** via the proto/WS path as via the MQTT path. The encoding may differ (protobuf oneof fields vs MQTT topic strings), but the functional behavior must be identical. Where the proto path was previously broken or incomplete, bridge firmware changes are required to achieve alignment.

---

## Scope

### In Scope

| Entity Type | HA Platform | Bridge Wire Type | Proto Encoding (after fixes) | Commands |
|---|---|---|---|---|
| light | `LightEntity` | `FIELD_TYPE_LIGHT` (0x09) | `string_value` (JSON) | turn_on (JSON payload), turn_off (JSON payload) |
| fan | `FanEntity` | `FIELD_TYPE_FAN` (0x0A) | `string_value` (JSON) | turn_on, turn_off, set_speed, set_oscillation, set_direction |
| lock | `LockEntity` | `FIELD_TYPE_LOCK` (0x0B) | `string_value` (`"LOCKED"`/`"UNLOCKED"`/`"JAMMED"`) | lock, unlock |
| cover | `CoverEntity` | `FIELD_TYPE_COVER` (0x08) | `int_value` (0-100 position) | open, close, stop, set_value |
| valve | `ValveEntity` | `FIELD_TYPE_VALVE` (0x11) | `int_value` (0-100 position) | open, close, stop, set_value |
| alarm_control_panel | `AlarmControlPanelEntity` | `FIELD_TYPE_ALARM` (0x0C) | `string_value` (plain state string) | arm_home, arm_away, arm_night, arm_vacation, arm_custom_bypass, trigger, disarm |
| event | `EventEntity` | `FIELD_TYPE_EVENT` (0x0E) | `string_value` (event type string) | none (read-only) |

### Out of Scope

- climate, humidifier, dehumidifier, time, datetime — these fall back to "sensor" in MQTT and require bridge firmware schema work first
- Alarm code/disarm in V1 (disarm command added but code field deferred)
- OTA (unchanged — OTA remains HTTP-only)
- Bridge MQTT path modifications (MQTT is the reference, not a target for change)

### Minimum Requirements

- Home Assistant 2024.8+ (required for `EventEntity` and `ValveEntity`)
- Bridge firmware with all Phase 0 modifications (6 changes total)

---

## Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| State encoding | JSON in `string_value` for complex types (light, fan); `string_value` for state-string types (lock, alarm); `int_value` for position (cover, valve); `string_value` for event type | Matches bridge's `runtime_write_entity_state_` output **after Phase 0 fixes**; no proto schema changes needed |
| Command encoding | JSON in `string_value` arg for complex commands (light turn_on/turn_off); simple command names for scalar types (cover/valve/lock); named commands mapped to `CommandRouteKind` for fan sub-commands | Matches bridge's `decode_command_payload_` input; `CommandArgument` supports typed values |
| Fan command routing | Use dedicated command names (`set_speed`, `set_oscillation`, `set_direction`) mapped to `CommandRouteKind` enum in bridge | MQTT uses separate topics → separate `CommandRouteKind`; WS API has no topic mechanism, so command names provide the routing |
| Lock state encoding | Use `string_value` from `state_value_json` instead of `bool_value` | Preserves JAMMED state (value=2) which `bool_value` collapses to `true`, matching MQTT's 3-state output |
| Alarm state encoding | Use `string_value` with plain state strings (not `quoted_json_string`) | Proto `string_value` fields should not have JSON quoting; matches MQTT plain-string output |
| Alarm command encoding | Map lowercase command names to uppercase in `api_runtime_handle_command` | `decode_command_payload_` expects uppercase (`"ARM_HOME"`) but HA sends lowercase (`"arm_home"`) |
| Capability source | Parse `options_json` per entity in `__init__` | Matches existing pattern (number, select); options contain color_modes, effects, speeds, etc. |
| State parsing | Complex entities override `async_added_to_hass` with custom callback; scalar entities use default `subscribe_entity` → `async_write_ha_state` | Localizes domain logic; matches existing pattern |
| File structure | Separate platform file per entity type | Matches existing pattern and HA convention |

---

## Phase 0: Bridge Firmware — Full MQTT/Proto Alignment ✅ IMPLEMENTED

**Why:** The bridge's proto/WS path has 6 issues that prevent functional parity with the MQTT path. These range from missing command mappings to state encoding bugs. All fixes are in `esp_tree_bridge.cpp` — no proto schema changes or `bridge_api_messages.cpp` changes were needed.

**Status:** All 6 fixes implemented and firmware builds successfully (2026-05-08).

**Files modified:**
- `/home/ben/projects/ESPLR_V2/components/esp_tree_bridge/esp_tree_bridge.cpp` (only file changed)

### MQTT vs Proto Alignment Audit (Pre-Fix)

| Entity | Aspect | MQTT Path | Proto/WS Path (current) | Bug? |
|--------|--------|-----------|-------------------------|------|
| Light | Command: JSON payload | JSON on single topic → `decode_command_payload_` JSON branch | `turn_on`→`"ON"`, JSON args silently dropped | Yes — fixed by 0.1 |
| Fan | Command: set speed | Separate topic → `CommandRouteKind::FAN_SPEED` | No routing; hardcoded `PRIMARY` | Yes — fixed by 0.2 + 0.3 |
| Fan | Command: set oscillation | Separate topic → `CommandRouteKind::FAN_OSCILLATION` | No routing | Yes — fixed by 0.2 |
| Fan | Command: set direction | Separate topic → `CommandRouteKind::FAN_DIRECTION` | No routing | Yes — fixed by 0.2 |
| Fan | Command: JSON payload | N/A (MQTT uses separate topics) | PRIMARY route has no JSON parsing | Yes — fixed by 0.3 |
| Alarm | State | Plain string `"disarmed"` via `publish()` | `"disarmed"` with literal quote chars via `quoted_json_string` | Yes — fixed by 0.4 |
| Alarm | Commands | HA sends `"ARM_HOME"` → matches `decode_command_payload_` | `command="arm_home"` → `payload="arm_home"` → doesn't match `"ARM_HOME"` → defaults to DISARM | Yes — fixed by 0.5 |
| Lock | State | `"LOCKED"` / `"UNLOCKED"` / `"JAMMED"` (3 strings) | `bool_value`: true/false — JAMMED collapsed to true | Yes — fixed by 0.6 |

### Step 0.1: JSON Arg Passthrough in `api_runtime_handle_command` ✅

**Problem:** `api_runtime_handle_command` maps `turn_on`→`"ON"` and `turn_off`→`"OFF"`, discarding any JSON args. For light, the HA integration needs to pass JSON payloads that `decode_command_payload_` already knows how to parse (starting with `{`).

**Current code** (simplified):
```cpp
if (request.command == "turn_on") payload = "ON";
else if (request.command == "turn_off") payload = "OFF";
else if (request.command == "press") payload = "PRESS";
else if (request.command == "open") payload = "OPEN";
else if (request.command == "close") payload = "CLOSE";
else if (request.command == "stop") payload = "STOP";
else if (request.command == "lock") payload = "LOCK";
else if (request.command == "unlock") payload = "UNLOCK";
else if (!request.args.empty()) payload = request.args.front().value;
else payload = request.command;
```

**New code** — add JSON passthrough after simple mapping:
```cpp
if (request.command == "turn_on") payload = "ON";
else if (request.command == "turn_off") payload = "OFF";
else if (request.command == "press") payload = "PRESS";
else if (request.command == "open") payload = "OPEN";
else if (request.command == "close") payload = "CLOSE";
else if (request.command == "stop") payload = "STOP";
else if (request.command == "lock") payload = "LOCK";
else if (request.command == "unlock") payload = "UNLOCK";
else if (!request.args.empty()) payload = request.args.front().value;
else payload = request.command;

// Override simple mapping if a JSON arg is provided — enables
// complex command payloads for light, fan, alarm, etc.
if (!request.args.empty()) {
  const auto &first_arg = request.args.front();
  if (!first_arg.value.empty() && first_arg.value[0] == '{') {
    payload = first_arg.value;
  }
}
```

This preserves backward compatibility (simple `turn_on`→`"ON"` still works for switch/binary) while enabling JSON payloads for complex types. `decode_command_payload_` for LIGHT already checks `payload[0] == '{'` and enters the JSON parsing branch.

### Step 0.2: Fan Command Routing in `api_runtime_handle_command` ✅

**Problem:** The WS API always calls `decode_command_payload_` with `CommandRouteKind::PRIMARY` (line ~2507). MQTT uses separate topics that map to `FAN_SPEED`, `FAN_OSCILLATION`, `FAN_DIRECTION` routes. Without routing, fan speed/oscillation/direction cannot be set via the WS API.

**Fix:** Add `CommandRouteKind` routing for fan entities before the `decode_command_payload_` call:

```cpp
CommandRouteKind route = CommandRouteKind::PRIMARY;
if (match->entity_type == FIELD_TYPE_FAN) {
  if (request.command == "set_speed") route = CommandRouteKind::FAN_SPEED;
  else if (request.command == "set_oscillation") route = CommandRouteKind::FAN_OSCILLATION;
  else if (request.command == "set_direction") route = CommandRouteKind::FAN_DIRECTION;
}

if (!decode_command_payload_(*match, route, payload, value, current_value)) {
```

For `set_speed`, `set_oscillation`, `set_direction`, the `payload` is already set correctly by the existing fallback at line ~2499: `else if (!request.args.empty()) payload = request.args.front().value`. The HA side will send the appropriate value (e.g., percentage string for speed, `"oscillate_on"`/`"oscillate_off"` for oscillation, `"forward"`/`"reverse"` for direction) as a `CommandArgument` string arg.

**MQTT alignment:** This mirrors MQTT's separate-topic routing. Each MQTT topic → `CommandRouteKind` is equivalent to each command name → `CommandRouteKind`.

### Step 0.3: JSON Parsing for Fan PRIMARY Route in `decode_command_payload_` ✅

**Problem:** The FAN `PRIMARY` route in `decode_command_payload_` (lines ~871-882) only calls `parse_on(payload)` — it has no JSON support. If a JSON payload `{"state":"ON","speed_level":2,"oscillating":false,"direction":"forward"}` arrives (e.g., via a combined fan command), the JSON is ignored and only ON/OFF is parsed.

**Fix:** Add JSON parsing to the FAN PRIMARY route, analogous to FIELD_TYPE_LIGHT (line ~936):

```cpp
case FIELD_TYPE_FAN: {
  if (!payload.empty() && payload[0] == '{') {
    // JSON command — set all 4 fields at once
    value.assign(4, 0);
    if (current_value.size() >= 4) {
      memcpy(value.data(), current_value.data(), 4);
    }
    return json::parse_json(payload, [&value](JsonObject root) -> bool {
      bool ok = false;
      if (root["state"].is<const char *>()) {
        value[0] = parse_on(root["state"].as<std::string>()) ? 1 : 0;
        ok = true;
      }
      if (root["speed_level"].is<int>()) {
        value[1] = static_cast<uint8_t>(root["speed_level"].as<int>());
        ok = true;
      }
      if (root["oscillating"].is<bool>()) {
        value[2] = root["oscillating"].as<bool>() ? 1 : 0;
        ok = true;
      }
      if (root["direction"].is<const char *>()) {
        std::string dir = root["direction"].as<std::string>();
        value[3] = (dir == "reverse" || dir == "REVERSE") ? 1 : 0;
        ok = true;
      }
      if (root["percentage"].is<int>()) {
        // Accept percentage too (convert to speed_level via speed_count)
        // This mirrors the FAN_SPEED route logic
        const auto opts = parse_options_map(entity.entity_options);
        const uint32_t speed_count = option_u32(opts, "speed_count", 0);
        if (speed_count > 0) {
          int pct = root["percentage"].as<int>();
          value[1] = static_cast<uint8_t>((pct * speed_count + 50) / 100);
          ok = true;
        }
      }
      return ok;
    });
  }
  // Non-JSON: dispatch by route_kind (existing logic)
  switch (route_kind) {
    case CommandRouteKind::PRIMARY: {
      // ... existing ON/OFF + current_value preservation
    }
    case CommandRouteKind::FAN_SPEED: {
      // ... existing speed parsing
    }
    // ... etc
  }
}
```

**MQTT alignment:** MQTT has no combined fan JSON command (it uses separate topics). This JSON path is a proto-only convenience that allows setting multiple fan attributes in a single WS message. It does not conflict with the `CommandRouteKind` routing in Step 0.2 — the JSON check runs first; if payload starts with `{`, JSON parsing handles it; otherwise, route-based dispatching handles it.

### Step 0.4: Fix Alarm State — Remove `quoted_json_string` in `runtime_write_entity_state_` ✅

**Problem:** `runtime_write_entity_state_` falls through to the `default:` case for ALARM, which calls `state_value_json()`. That function wraps the alarm state in `quoted_json_string()`, producing strings like `"disarmed"` (9 chars including literal double-quote characters). Proto `string_value` is already a string field — it does not need JSON quoting. The Python `_apply_state` method stores the raw string, so `entity.value` ends up as `'"disarmed"'` (with quotes) instead of `'disarmed'`.

**MQTT comparison:** MQTT's `encode_state_payload_` for ALARM (line ~760) returns plain strings like `"disarmed"` (the C++ `std::string`, not JSON-quoted). MQTT publishes these plain strings directly.

**Fix:** Add an explicit `FIELD_TYPE_ALARM` case to `runtime_write_entity_state_` before the `default:` fallthrough:

```cpp
case FIELD_TYPE_ALARM: {
  const char *state = "disarmed";
  if (!value.empty()) {
    switch (value[0]) {
      case 1:  state = "armed_home"; break;
      case 2:  state = "armed_away"; break;
      case 3:  state = "armed_night"; break;
      case 4:  state = "armed_vacation"; break;
      case 5:  state = "armed_custom_bypass"; break;
      case 6:  state = "triggered"; break;
      case 7:  state = "pending"; break;
      case 8:  state = "arming"; break;
      case 9:  state = "disarming"; break;
      default: state = "disarmed"; break;
    }
  }
  w.string(13, state);
  break;
}
```

This writes the plain state string (e.g., `"disarmed"`) directly to the proto `string_value` field, matching what MQTT publishes. No JSON quoting.

**Note:** The `default:` case that calls `state_value_json()` should still remain for future types, but ALARM no longer falls through to it.

### Step 0.5: Alarm Command Mappings in `api_runtime_handle_command` ✅

**Problem:** HA sends alarm commands like `command="arm_home"`. `api_runtime_handle_command` has no mapping for these, so `payload = request.command = "arm_home"` (lowercase). But `decode_command_payload_` for ALARM expects uppercase strings (`"ARM_HOME"`, `"ARM_AWAY"`, etc.) and defaults to DISARM (value[0]=0) for any unrecognized string. Sending `"arm_home"` would **silently disarm** the alarm instead of arming it.

**MQTT comparison:** MQTT discovery declares `"payload_arm_home": "ARM_HOME"` etc., so HA sends uppercase directly to the topic.

**Fix:** Add alarm command mappings to `api_runtime_handle_command`, before the existing `else if (!request.args.empty())` fallback:

```cpp
if (request.command == "turn_on") payload = "ON";
else if (request.command == "turn_off") payload = "OFF";
else if (request.command == "press") payload = "PRESS";
else if (request.command == "open") payload = "OPEN";
else if (request.command == "close") payload = "CLOSE";
else if (request.command == "stop") payload = "STOP";
else if (request.command == "lock") payload = "LOCK";
else if (request.command == "unlock") payload = "UNLOCK";
else if (request.command == "arm_home") payload = "ARM_HOME";
else if (request.command == "arm_away") payload = "ARM_AWAY";
else if (request.command == "arm_night") payload = "ARM_NIGHT";
else if (request.command == "arm_vacation") payload = "ARM_VACATION";
else if (request.command == "arm_custom_bypass") payload = "ARM_CUSTOM_BYPASS";
else if (request.command == "disarm") payload = "DISARM";
else if (request.command == "trigger") payload = "TRIGGERED";
else if (!request.args.empty()) payload = request.args.front().value;
else payload = request.command;
```

This maps HA-style lowercase command names to the uppercase strings that `decode_command_payload_` expects. The mapping is consistent with `decode_command_payload_` ALARM case (lines ~858-865).

### Step 0.6: Lock State — Use `string_value` Instead of `bool_value` ✅

**Problem:** `runtime_write_entity_state_` for LOCK writes `bool_value`: `w.boolean(10, !value.empty() && value[0] != 0)`. This collapses byte values 1 (LOCKED) and 2 (JAMMED) both to `true`. The MQTT path preserves this distinction: `encode_state_payload_` returns `"LOCKED"`, `"UNLOCKED"`, or `"JAMMED"`.

**Fix:** Change LOCK to use `string_value` via `state_value_json` (which already handles LOCK correctly):

```cpp
// REMOVE from the SWITCH/BINARY case:
//   case FIELD_TYPE_LOCK:
// ADD explicit LOCK case:
case FIELD_TYPE_LOCK:
  w.string(13, bridge_api::BridgeApiMessages::state_value_json(type, value.data(), value.size(), options));
  break;
```

`state_value_json` for LOCK (bridge_api_messages.cpp ~line 221) returns `"LOCKED"`, `"JAMMED"`, or `"UNLOCKED"` wrapped in `quoted_json_string`. However, per the fix in 0.4, proto `string_value` should not have JSON quoting. Two options:

**Option A (preferred):** Add inline logic like the alarm fix in 0.4:
```cpp
case FIELD_TYPE_LOCK: {
  const char *state = "UNLOCKED";
  if (!value.empty()) {
    if (value[0] == 1) state = "LOCKED";
    else if (value[0] == 2) state = "JAMMED";
  }
  w.string(13, state);
  break;
}
```

**Option B:** Modify `state_value_json` for LOCK to stop using `quoted_json_string` and return plain strings. This would affect the WS v1 JSON path as well, changing its output from `"LOCKED"` (quoted) to `LOCKED` (unquoted). Option A avoids this side effect.

**MQTT alignment:** Proto now sends `"LOCKED"` / `"UNLOCKED"` / `"JAMMED"` as plain strings, matching MQTT's 3-state output.

### Step 0.7: Build and Verify Bridge Firmware ✅

Built successfully on 2026-05-08 with `espnow-bridge-c5` target. No regressions expected — all changes are additive (new command mappings, new explicit cases for ALARM/LOCK in switch, JSON passthrough only activates when args start with `{`).

```bash
cd /home/ben/projects/ESPLR_V2 && ./compile.sh
```

Verify no regression on existing switch/binary/button/number/select commands. All existing simple command mappings (`turn_on`→`"ON"`, etc.) are preserved; the new mappings and JSON passthrough are additive.

### Post-Fix MQTT vs Proto Alignment Audit

| Entity | State | Commands | Aligned? |
|--------|-------|----------|----------|
| Light | Both send JSON state objects (proto uses boolean `true`/`false`, MQTT uses string `"ON"`/`"OFF"` — both valid for HA) | JSON payloads via Phase 0.1 passthrough + existing `decode_command_payload_` JSON branch | **Yes** |
| Fan | Both send full fan state (proto: single JSON object; MQTT: 4 separate topic strings — same data) | `turn_on`/`turn_off` via PRIMARY; `set_speed`/`set_oscillation`/`set_direction` via `CommandRouteKind` routing (0.2); JSON combined commands via PRIMARY JSON parsing (0.3) | **Yes** |
| Lock | Both send `LOCKED`/`UNLOCKED`/`JAMMED` strings (0.6) | `lock`→`"LOCK"`, `unlock`→`"UNLOCK"` → existing `decode_command_payload_` | **Yes** |
| Cover | Both send position 0-100 (proto: `int_value`; MQTT: plain string) | `open`/`close`/`stop` mapped; `set_value` with int arg falls through to position string | **Yes** |
| Valve | Same as cover | Same as cover | **Yes** |
| Alarm | Both send plain state strings like `"disarmed"` (0.4) | `arm_home`→`"ARM_HOME"` etc. (0.5); `disarm`→`"DISARM"`; `trigger`→`"TRIGGERED"` | **Yes** |
| Event | Proto: plain event type string; MQTT: JSON `{"event_type":"..."}` — both valid for HA `EventEntity` | None (read-only) | **Yes** |

---

## Phase 1: HA Integration — Platform Registration & Wiring ✅ IMPLEMENTED

**Status:** All 3 steps completed (2026-05-08).

**Files modified:**
- `ha_integration/custom_components/esp_tree/const.py` — added 7 platforms to PLATFORMS list

### Step 1.1: Update `const.py` PLATFORMS list ✅

**File:** `ha_integration/custom_components/esp_tree/const.py`

Added 7 new platforms:
```python
PLATFORMS = [
    "sensor",
    "binary_sensor",
    "switch",
    "button",
    "number",
    "select",
    "text",
    "light",
    "fan",
    "cover",
    "valve",
    "lock",
    "alarm_control_panel",
    "event",
]
```

### Step 1.2: Verify `__init__.py` platform forwarding ✅

**File:** `ha_integration/custom_components/esp_tree/__init__.py`

The existing `async_forward_entry_setups(entry, PLATFORMS)` call forwards all platforms in `PLATFORMS`. Since we added to that list in Step 1.1, no changes needed here — it picks them up automatically.

### Step 1.3: Verify `bridge_runtime.py` entity model hydration ✅

**File:** `ha_integration/custom_components/esp_tree/bridge_runtime.py`

The `register_platform()` method already dispatches entities to platform callbacks by `entity.platform`. Since the bridge sets `platform` to `component_for_type()` output (e.g., `"light"`, `"fan"`), and we'll register callbacks for those platform names in each entity file's `async_setup_entry`, no changes needed to `bridge_runtime.py` registration logic.

Verified that `_apply_state()` correctly handles all proto `value` oneof variants for the new types:
- `string_value` — used by light, fan, lock (after Phase 0.6), alarm (after Phase 0.4), event
- `int_value` — used by cover, valve

Current `_apply_state`:
```python
value_kind = state.WhichOneof("value")
entity.value = getattr(state, value_kind) if value_kind else None
```

This already works generically — no changes needed. After Phase 0.6, lock state is now `string_value` (not `bool_value`), which `_apply_state` handles. After Phase 0.4, alarm state is now a plain string in `string_value`, which `_apply_state` handles.

---

## Phase 2: Light Entity (Most Complex — Establishes JSON Patterns) ✅ IMPLEMENTED

**File to create:** `ha_integration/custom_components/esp_tree/light.py`

### Bridge Reference: MQTT vs Proto State

**MQTT state** (from `publish_json` inline lambda, line ~1494):
```json
{"state": "ON", "color_mode": "rgb", "brightness": 128, "color": {"r": 255, "g": 0, "b": 0}, ...}
```
Note: `"state"` is a string `"ON"` or `"OFF"`.

**Proto state** (from `state_value_json` → `build_light_state_json`):
```json
{"state": true, "color_mode": "rgb", "brightness": 128, "color": {"r": 255, "g": 0, "b": 0}, ...}
```
Note: `"state"` is a boolean `true`/`false`.

Both formats are valid — HA's `LightEntity` works with either.

### Bridge Reference: Command Format

**MQTT & Proto** (from `decode_command_payload_`):
```json
{"state": "ON", "brightness": 200, "color": {"r": 255, "g": 0, "b": 0}, "color_temp": 300, "white": 128, "effect": "rainbow"}
```
Same format for both paths — `decode_command_payload_` parses the same JSON whether it arrives from an MQTT topic or a proto `CommandArgument`.

### Entity options:
- `color_modes=brightness|rgb|color_temp` — pipe-separated list of supported color modes
- `effects=rainbow|strobe|pulse` — pipe-separated list of effect names
- `min_mireds=153` — minimum color temperature in mireds
- `max_mireds=500` — maximum color temperature in mireds

### Step 2.1: Create `light.py`

```python
from __future__ import annotations

import json
from homeassistant.components.light import (
    LightEntity,
    ColorMode,
    ATTR_BRIGHTNESS,
    ATTR_COLOR_MODE,
    ATTR_COLOR_TEMP,
    ATTR_EFFECT,
    ATTR_RGB_COLOR,
    ATTR_WHITE,
    ATTR_TRANSITION,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .bridge_runtime import get_runtime
from .device_model import EntityModel
from .entity_model import EspTreeEntity

_COLOR_MODE_MAP = {
    "onoff": ColorMode.ONOFF,
    "brightness": ColorMode.BRIGHTNESS,
    "white": ColorMode.WHITE,
    "color_temp": ColorMode.COLOR_TEMP,
    "rgb": ColorMode.RGB,
    "rgbw": ColorMode.RGBW,
    "rgbww": ColorMode.RGBWW,
    "xy": ColorMode.XY,
}

def _parse_options(raw: str) -> dict:
    result = {"color_modes": [], "effects": [], "min_mireds": None, "max_mireds": None}
    for part in raw.split(";"):
        if "=" not in part:
            continue
        k, v = part.split("=", 1)
        if k == "color_modes":
            result["color_modes"] = [m.strip() for m in v.replace(",", "|").split("|") if m.strip()]
        elif k == "effects":
            result["effects"] = [e.strip() for e in v.replace(",", "|").split("|") if e.strip()]
        elif k == "min_mireds":
            try: result["min_mireds"] = int(v)
            except ValueError: pass
        elif k == "max_mireds":
            try: result["max_mireds"] = int(v)
            except ValueError: pass
    return result

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities) -> None:
    seen: set[str] = set()
    def add(model: EntityModel) -> None:
        if model.unique_id in seen:
            return
        seen.add(model.unique_id)
        async_add_entities([EspTreeLight(model)])
    get_runtime(hass).register_platform("light", add, entry.entry_id if entry.data.get("type") == "remote" else None)

class EspTreeLight(EspTreeEntity, LightEntity):
    def __init__(self, model: EntityModel) -> None:
        super().__init__(model)
        opts = _parse_options(model.options_json)
        self._color_modes = [_COLOR_MODE_MAP.get(m, ColorMode.ONOFF) for m in opts["color_modes"]]
        self._effect_list = opts["effects"] + ["None"] if opts["effects"] else []
        self._min_mireds = opts["min_mireds"]
        self._max_mireds = opts["max_mireds"]
        self._state = False
        self._brightness = 0
        self._color_mode = None
        self._rgb = None
        self._color_temp = None
        self._white = None
        self._effect = "None"

    @property
    def is_on(self) -> bool:
        return self._state

    @property
    def brightness(self):
        return self._brightness

    @property
    def color_mode(self):
        return self._color_mode

    @property
    def supported_color_modes(self) -> set[ColorMode]:
        return set(self._color_modes) if self._color_modes else {ColorMode.ONOFF}

    @property
    def rgb_color(self):
        return self._rgb

    @property
    def color_temp(self):
        return self._color_temp

    @property
    def min_mireds(self):
        return self._min_mireds or 153

    @property
    def max_mireds(self):
        return self._max_mireds or 500

    @property
    def effect(self):
        return self._effect

    @property
    def effect_list(self):
        return self._effect_list or None

    async def async_added_to_hass(self) -> None:
        runtime = get_runtime(self.hass)
        self.async_on_remove(
            runtime.subscribe_entity(
                self.model.remote_mac, self.model.object_id, self._process_state
            )
        )

    def _process_state(self) -> None:
        raw = self.model.value
        if isinstance(raw, str):
            try:
                data = json.loads(raw)
                self._state = data.get("state", False)
                cm = data.get("color_mode")
                self._color_mode = _COLOR_MODE_MAP.get(cm) if cm else None
                self._brightness = data.get("brightness", 0)
                color = data.get("color")
                self._rgb = (color["r"], color["g"], color["b"]) if color else None
                self._color_temp = data.get("color_temp")
                self._white = data.get("white")
                self._effect = data.get("effect", "None")
            except (json.JSONDecodeError, KeyError):
                self._state = bool(raw)
        elif isinstance(raw, bool):
            self._state = raw
        self.async_write_ha_state()

    async def async_turn_on(self, **kwargs) -> None:
        payload = {"state": "ON"}
        if ATTR_BRIGHTNESS in kwargs:
            payload["brightness"] = kwargs[ATTR_BRIGHTNESS]
        if ATTR_COLOR_MODE in kwargs:
            payload["color_mode"] = kwargs[ATTR_COLOR_MODE]
        if ATTR_RGB_COLOR in kwargs:
            r, g, b = kwargs[ATTR_RGB_COLOR]
            payload["color"] = {"r": r, "g": g, "b": b}
        if ATTR_COLOR_TEMP in kwargs:
            payload["color_temp"] = kwargs[ATTR_COLOR_TEMP]
        if ATTR_WHITE in kwargs:
            payload["white"] = kwargs[ATTR_WHITE]
        if ATTR_EFFECT in kwargs:
            payload["effect"] = kwargs[ATTR_EFFECT]
        if ATTR_TRANSITION in kwargs:
            payload["transition"] = kwargs[ATTR_TRANSITION]
        import json as _json
        await get_runtime(self.hass).send_command(
            self.model.remote_mac, self.model.object_id, "turn_on",
            payload=_json.dumps(payload),
        )

    async def async_turn_off(self, **kwargs) -> None:
        payload = {"state": "OFF"}
        if ATTR_TRANSITION in kwargs:
            payload["transition"] = kwargs[ATTR_TRANSITION]
        import json as _json
        await get_runtime(self.hass).send_command(
            self.model.remote_mac, self.model.object_id, "turn_off",
            payload=_json.dumps(payload),
        )
```

### Key Design Points

- **State parsing**: `_process_state()` parses JSON from `model.value` (which is `string_value` from proto). The bridge's `build_light_state_json` uses boolean `true`/`false` for `"state"` and string names for `"color_mode"`. Handle fallback gracefully if parse fails.
- **Command construction**: `async_turn_on` builds a JSON dict matching `decode_command_payload_` input format and passes it as a `string_value` arg named `"payload"`. This arrives at the bridge as `request.args[0].value` which, with Phase 0.1's change, overrides the simple `"ON"` mapping.
- **Color modes**: Parsed from `options_json` `color_modes=brightness|rgb|color_temp`.
- **Effects**: Parsed from `options_json` `effects=effect1|effect2`.
- **Color temp range**: Parsed from `options_json` `min_mireds`, `max_mireds`.

---

## Phase 3: Fan Entity ✅ IMPLEMENTED

**File to create:** `ha_integration/custom_components/esp_tree/fan.py`

### Bridge Reference: MQTT vs Proto

**MQTT** uses 4 separate command topics:
- Primary topic: `"ON"`/`"OFF"` → `CommandRouteKind::PRIMARY`
- Speed topic: integer percentage → `CommandRouteKind::FAN_SPEED`
- Oscillation topic: `"oscillate_on"`/`"oscillate_off"` → `CommandRouteKind::FAN_OSCILLATION`
- Direction topic: `"forward"`/`"reverse"` → `CommandRouteKind::FAN_DIRECTION`

**Proto/WS** (after Phase 0.2 + 0.3) uses named commands:
- `turn_on`/`turn_off` → PRIMARY route (simple ON/OFF)
- `set_speed` with `value=<percentage>` → FAN_SPEED route
- `set_oscillation` with `value="oscillate_on"`/`"oscillate_off"` → FAN_OSCILLATION route
- `set_direction` with `value="forward"`/`"reverse"` → FAN_DIRECTION route
- JSON combined command as arg → PRIMARY route with JSON parsing (Phase 0.3)

**State JSON** (from `build_fan_state_json`, same for both paths):
```json
{
  "state": true,
  "speed_level": 2,
  "oscillating": false,
  "direction": "forward"
}
```
Note: Proto uses boolean `true`/`false` for `"state"`; MQTT uses string `"ON"`/`"OFF"`. Both carry the same data.

**Entity options**:
- `speed_count=N` — enables percentage-based speed (N discrete speeds)
- `oscillation=1` — enables oscillation
- `direction=1` — enables direction control

### Step 3.1: Create `fan.py`

Key properties:
- `supported_features`: `FanEntityFeature.SET_SPEED` if `speed_count > 0`, `FanEntityFeature.OSCILLATE` if oscillation, `FanEntityFeature.DIRECTION` if direction
- `percentage`: derived from `speed_level * 100 / speed_count`
- `oscillating`: from state JSON
- `current_direction`: from state JSON `"forward"`/`"reverse"`
- Custom `_process_state` callback for JSON state parsing

Commands — using named commands that Phase 0.2 maps to `CommandRouteKind`:
```python
async def async_turn_on(self, **kwargs) -> None:
    await get_runtime(self.hass).send_command(
        self.model.remote_mac, self.model.object_id, "turn_on"
    )

async def async_turn_off(self, **kwargs) -> None:
    await get_runtime(self.hass).send_command(
        self.model.remote_mac, self.model.object_id, "turn_off"
    )

async def async_set_percentage(self, percentage: int) -> None:
    await get_runtime(self.hass).send_command(
        self.model.remote_mac, self.model.object_id, "set_speed",
        value=str(percentage),
    )

async def async_oscillate(self, oscillating: bool) -> None:
    await get_runtime(self.hass).send_command(
        self.model.remote_mac, self.model.object_id, "set_oscillation",
        value="oscillate_on" if oscillating else "oscillate_off",
    )

async def async_set_direction(self, direction: str) -> None:
    await get_runtime(self.hass).send_command(
        self.model.remote_mac, self.model.object_id, "set_direction",
        value=direction,
    )
```

**MQTT alignment:** Each named command maps to the same `CommandRouteKind` that MQTT's separate topics use. The payload values (`"oscillate_on"`, `"forward"`, integer percentage) are identical to what MQTT sends.

---

## Phase 4: Lock Entity ✅ IMPLEMENTED

**File to create:** `ha_integration/custom_components/esp_tree/lock.py`

### Bridge Reference: MQTT vs Proto (after Phase 0.6)

**MQTT state**: `"LOCKED"` / `"UNLOCKED"` / `"JAMMED"` (3 distinct plain strings)

**Proto state** (after Phase 0.6): `string_value` = `"LOCKED"` / `"UNLOCKED"` / `"JAMMED"` (3 distinct plain strings — no JSON quoting, matches MQTT)

**Command**: Both paths use `"LOCK"` and `"UNLOCK"` payloads → `decode_command_payload_` LOCK case.

### Step 4.1: Create `lock.py`

Key considerations:
- State is now a `string_value` containing plain state names (after Phase 0.6 fix). Map to HA `LockEntity` states:
  - `"LOCKED"` → `LockState.LOCKED`
  - `"UNLOCKED"` → `LockState.UNLOCKED`
  - `"JAMMED"` → `LockState.JAMMED`
- `_process_state` parses the string values from `model.value`
- Commands use existing bridge command mappings: `"lock"` → `"LOCK"`, `"unlock"` → `"UNLOCK"`

```python
from homeassistant.components.lock import LockEntity, LockState

class EspTreeLock(EspTreeEntity, LockEntity):
    def __init__(self, model: EntityModel) -> None:
        super().__init__(model)
        self._lock_state = LockState.UNLOCKED

    @property
    def is_locked(self) -> bool:
        return self._lock_state == LockState.LOCKED

    @property
    def state(self):
        return self._lock_state

    def _process_state(self) -> None:
        raw = self.model.value
        if isinstance(raw, str):
            if raw == "LOCKED":
                self._lock_state = LockState.LOCKED
            elif raw == "JAMMED":
                self._lock_state = LockState.JAMMED
            else:
                self._lock_state = LockState.UNLOCKED
        self.async_write_ha_state()

    async def async_lock(self, **kwargs):
        await get_runtime(self.hass).send_command(self.model.remote_mac, self.model.object_id, "lock")

    async def async_unlock(self, **kwargs):
        await get_runtime(self.hass).send_command(self.model.remote_mac, self.model.object_id, "unlock")
```

**MQTT alignment:** Full 3-state parity. MQTT sends `"LOCKED"`/`"UNLOCKED"`/`"JAMMED"`; proto now sends the same strings. Both paths support `lock`/`unlock` commands.

---

## Phase 5: Cover Entity ✅ IMPLEMENTED

**File to create:** `ha_integration/custom_components/esp_tree/cover.py`

### Bridge Reference: MQTT vs Proto

**MQTT state**: Position 0-100 as plain string `"75"` (from `encode_state_payload_`)

**Proto state**: `int_value` = 75 (integer, from `runtime_write_entity_state_` COVER case)

Same data, different proto encoding (int vs string).

**MQTT command**: `"OPEN"` / `"CLOSE"` / `"STOP"` / integer position string on single command topic

**Proto command**: `open`→`"OPEN"`, `close`→`"CLOSE"`, `stop`→`"STOP"` via existing mappings; `set_value` with `value=75` falls through to `args.front().value` = `"75"` → `decode_command_payload_` else-branch → `POSITION_COMMAND_SET_POSITION` with position 75.

### Step 5.1: Create `cover.py`

Key properties:
- `current_cover_position`: `self.model.value` (int 0-100)
- `is_opening` / `is_closing`: not available from bridge state (defer for V1, set both False with TODO)
- `is_closed`: `position == 0`

Commands:
```python
async def async_open_cover(self, **kwargs):
    await get_runtime(self.hass).send_command(self.model.remote_mac, self.model.object_id, "open")

async def async_close_cover(self, **kwargs):
    await get_runtime(self.hass).send_command(self.model.remote_mac, self.model.object_id, "close")

async def async_stop_cover(self, **kwargs):
    await get_runtime(self.hass).send_command(self.model.remote_mac, self.model.object_id, "stop")

async def async_set_cover_position(self, position: int):
    await get_runtime(self.hass).send_command(self.model.remote_mac, self.model.object_id, "set_value", value=position)
```

**MQTT alignment:** Full parity. `set_value` with `value=position` (int) → `CommandArgument.int_value` → stringified to `"75"` by C++ parser → hits `decode_command_payload_` COVER else-branch as set_position.

---

## Phase 6: Valve Entity ✅ IMPLEMENTED

**File to create:** `ha_integration/custom_components/esp_tree/valve.py`

### Bridge Reference

Identical to cover in state/command format. Only difference: HA `ValveEntity` (2024.7+) vs `CoverEntity`.

**State**: `int_value` from proto — position 0-100
**Command**: Same as cover: open/close/stop/set_value

### Step 6.1: Create `valve.py`

Nearly identical to `cover.py` but subclass `ValveEntity`. Key properties:
- `current_valve_position`: `self.model.value` (int 0-100)
- `is_closed`: `position == 0`
- `is_opening` / `is_closing`: defer for V1

Commands: same as cover — `open`, `close`, `stop`, `set_value` with position.

---

## Phase 7: Alarm Control Panel Entity ✅ IMPLEMENTED

**File to create:** `ha_integration/custom_components/esp_tree/alarm_control_panel.py`

### Bridge Reference: MQTT vs Proto (after Phase 0.4 + 0.5)

**MQTT state** (from `encode_state_payload_`): Plain string `"disarmed"`, `"armed_home"`, etc.

**Proto state** (after Phase 0.4): `string_value` = plain string `"disarmed"`, `"armed_home"`, etc. (no JSON quoting)

Both paths now send the same plain state strings.

**MQTT command** (discovery declares): `"ARM_HOME"`, `"ARM_AWAY"`, `"ARM_NIGHT"`, `"ARM_VACATION"`, `"ARM_CUSTOM_BYPASS"`, `"DISARM"`, `"TRIGGERED"` — sent to single command topic

**Proto command** (after Phase 0.5): `arm_home`→`"ARM_HOME"`, `arm_away`→`"ARM_AWAY"`, etc. — mapped in `api_runtime_handle_command`

Both paths result in `decode_command_payload_` receiving the same uppercase command strings.

**Entity options**:
- `features=N` — uint32 bitmask: 0x01=arm_home, 0x02=arm_away, 0x04=arm_night, 0x08=trigger, 0x10=arm_custom_bypass, 0x20=arm_vacation
- `requires_code=1` — requires code to disarm (V1: ignored, no code support)
- `requires_code_to_arm=1` — requires code to arm (V1: ignored)

### Step 7.1: Create `alarm_control_panel.py`

Key properties:
- `state`: map from bridge state string to HA `AlarmControlPanelState`
- `supported_features`: parsed from `features` bitmask option
- `code_arm_required`: from `requires_code_to_arm` option (but no code handling in V1)

Commands — all mapped by Phase 0.5:
```python
async def async_alarm_arm_home(self, code=None):
    await get_runtime(self.hass).send_command(self.model.remote_mac, self.model.object_id, "arm_home")

async def async_alarm_arm_away(self, code=None):
    await get_runtime(self.hass).send_command(self.model.remote_mac, self.model.object_id, "arm_away")

async def async_alarm_arm_night(self, code=None):
    await get_runtime(self.hass).send_command(self.model.remote_mac, self.model.object_id, "arm_night")

async def async_alarm_arm_vacation(self, code=None):
    await get_runtime(self.hass).send_command(self.model.remote_mac, self.model.object_id, "arm_vacation")

async def async_alarm_arm_custom_bypass(self, code=None):
    await get_runtime(self.hass).send_command(self.model.remote_mac, self.model.object_id, "arm_custom_bypass")

async def async_alarm_disarm(self, code=None):
    await get_runtime(self.hass).send_command(self.model.remote_mac, self.model.object_id, "disarm")

async def async_alarm_trigger(self, code=None):
    await get_runtime(self.hass).send_command(self.model.remote_mac, self.model.object_id, "trigger")
```

For V2 code support, would send JSON: `{"state": "DISARM", "code": "1234"}`.

**MQTT alignment:** Full parity. All 7 alarm commands in MQTT (`ARM_HOME`, `ARM_AWAY`, `ARM_NIGHT`, `ARM_VACATION`, `ARM_CUSTOM_BYPASS`, `DISARM`, `TRIGGERED`) are now mapped from lowercase HA command names.

---

## Phase 8: Event Entity ✅ IMPLEMENTED

**File to create:** `ha_integration/custom_components/esp_tree/event.py`

### Bridge Reference: MQTT vs Proto

**MQTT state** (from `publish_json`, line ~1469): `{"event_type": "button_pressed"}` — JSON object with `event_type` key

**Proto state** (from `runtime_write_entity_state_` EVENT case): `string_value` = `"button_pressed"` — plain string (the event type directly)

Both valid for HA `EventEntity` — it fires events from the event type string.

**Command**: None (read-only entity)

**Entity options**:
- `options=type1|type2|type3` — pipe-separated list of valid event types

### Step 8.1: Create `event.py`

Key properties:
- `event_types`: parsed from `options_json` `options=...`
- `_trigger_event`: called on state update when event type changes

The entity fires a HA event when a new event type is received from the bridge. Override state subscription to detect event type changes:

```python
class EspTreeEvent(EspTreeEntity, EventEntity):
    def __init__(self, model: EntityModel) -> None:
        super().__init__(model)
        self._last_event_type = None

    @property
    def event_types(self) -> list[str]:
        # parse from options_json
        ...

    async def async_added_to_hass(self) -> None:
        runtime = get_runtime(self.hass)
        self.async_on_remove(
            runtime.subscribe_entity(self.model.remote_mac, self.model.object_id, self._process_event)
        )

    def _process_event(self) -> None:
        event_type = self.model.value  # string_value from proto
        if event_type and event_type != self._last_event_type:
            self._last_event_type = event_type
            self._trigger_event(event_type)
        self.async_write_ha_state()
```

**MQTT alignment:** Full parity. Read-only entity; event type fires identically whether from MQTT JSON or proto plain string.

---

## Phase 9: State Update Handling — Edge Cases ✅ IMPLEMENTED

### Problem: Complex entities need custom state parsing

The existing entity base class subscribes to `subscribe_entity` with `self.async_write_ha_state` as callback. This works for scalar types where HA reads `self.model.value` directly in properties. For complex types (light, fan, lock, alarm), the entity needs to parse `model.value` before HA reads the properties.

**Two categories:**

1. **Scalar entities** (cover, valve, event): `subscribe_entity(..., self.async_write_ha_state)` — HA reads `model.value` directly in property getters (int position, string event type)

2. **Complex entities** (light, fan, lock, alarm): Override `async_added_to_hass` to use a custom callback (like `_process_state`) that parses the value, updates internal state variables, then calls `self.async_write_ha_state`

### Proto Encoding Summary (after Phase 0 fixes)

| Entity Type | Proto Field | `model.value` type | Parsing needed |
|---|---|---|---|
| light | `string_value` (JSON) | `str` | JSON parse in `_process_state` |
| fan | `string_value` (JSON) | `str` | JSON parse in `_process_state` |
| lock | `string_value` (`"LOCKED"`/`"UNLOCKED"`/`"JAMMED"`) | `str` | String comparison in `_process_state` |
| cover | `int_value` (0-100) | `int` | Direct read in property |
| valve | `int_value` (0-100) | `int` | Direct read in property |
| alarm | `string_value` (plain string) | `str` | String comparison in `_process_state` |
| event | `string_value` (plain string) | `str` | Direct read / event trigger |

Note: `native_type_for_type` in the bridge declares `"int"` for all these types, which is inaccurate. The bridge's `runtime_write_entity_state_` is the source of truth for actual proto encoding.

---

## Phase 10: Unit Tests ✅ IMPLEMENTED

### Test Structure

Create `tests/` directory (or add to existing) with one test file per entity type.

### Step 10.1: Test helpers

Create shared test utilities:
- Mock `EntityModel` with configurable `platform`, `options_json`, `value`, `available`
- Mock `bridge_runtime` with `send_command` capture
- Mock `HomeAssistant` instance

### Step 10.2: Per-entity tests

**`test_light.py`**:
- options_json parsing: color_modes, effects, mireds range
- State JSON parsing: brightness, color_mode, RGB, color_temp, effect (both boolean and string `state`)
- Command construction: turn_on with brightness/color, turn_off
- Supported color modes mapping

**`test_fan.py`**:
- options_json parsing: speed_count, oscillation, direction
- State JSON parsing: state, speed_level, oscillating, direction
- Command construction: turn_on, turn_off, set_percentage, set_oscillation, set_direction
- Verify `set_speed` sends string value for FAN_SPEED route
- Verify `set_oscillation` sends `"oscillate_on"`/`"oscillate_off"` for FAN_OSCILLATION route
- Verify `set_direction` sends `"forward"`/`"reverse"` for FAN_DIRECTION route

**`test_lock.py`**:
- State from string_value: `"LOCKED"` → locked, `"UNLOCKED"` → unlocked, `"JAMMED"` → jammed
- Commands: lock, unlock

**`test_cover.py`**:
- State from int_value: position 0-100
- Commands: open, close, stop, set_value
- is_closed when position==0

**`test_valve.py`**:
- Same as cover but ValveEntity

**`test_alarm_control_panel.py`**:
- options_json parsing: features bitmask
- State parsing: alarm state strings (plain, no JSON quoting)
- Commands: arm_home, arm_away, arm_night, arm_vacation, arm_custom_bypass, disarm, trigger
- supported_features mapping

**`test_event.py`**:
- options_json parsing: event_types list
- Event firing on state change
- No commands

---

## Phase 11: Integration Verification ✅ READY FOR TESTING

### Step 11.1: Verify platform forwarding

After all files are created and `const.py` is updated:
1. Restart HA
2. Check that all 7 new entity types appear in the entity registry for a remote that declares those types
3. Verify entity capabilities are set correctly from options_json

### Step 11.2: Verify state updates

For each entity type:
1. Confirm state arrives from bridge via proto and entity updates in HA
2. Check light: brightness, color, color_temp, effect all display correctly
3. Check fan: speed, oscillation, direction
4. Check cover/valve: position 0-100
5. Check lock: locked/unlocked/jammed states
6. Check alarm: state transitions (disarmed → armed_home → triggered → disarmed)
7. Check event: events fire

### Step 11.3: Verify commands

For each writable entity type:
1. Send command from HA UI
2. Verify `send_command` is called with correct args
3. Verify bridge receives and forwards to remote
4. Verify remote executes command and state updates back
5. Verify no regression on existing 8 entity types

---

## Known Limitations

| Limitation | Reason | Follow-up |
|---|---|---|
| Cover/Valve opening/closing state not available | Bridge only sends position, not movement direction | Track position changes over time |
| Alarm code/disarm code field | V1 sends disarm command without code | Add JSON command with code field |
| Climate/humidifier/dehumidifier/time/datetime | Bridge MQTT treats these as generic sensors | Requires bridge schema work first |
| `native_type_for_type` inaccuracy | Declares "int" for types that actually use string/bool | Bridge-side fix to return accurate type names |
| Light color_mode inference | Bridge may not always send color_mode in JSON | Infer from brightness/RGB/color_temp presence |
| Fan JSON command vs route commands | Both JSON combined command and per-route commands work; preference is per-route (clearer) | Document both paths |

---

## Implementation Priority & Effort Estimate

| Phase | Entity | Effort | Dependencies |
|---|---|---|---|
| 0.1 | Bridge: JSON arg passthrough | S | None |
| 0.2 | Bridge: Fan command routing | S | None |
| 0.3 | Bridge: Fan JSON parsing | M | None |
| 0.4 | Bridge: Alarm state fix | S | None |
| 0.5 | Bridge: Alarm command mappings | S | None |
| 0.6 | Bridge: Lock state fix | S | None |
| 0.7 | Bridge: Build & verify | M | 0.1-0.6 |
| 1 | Platform wiring | S | None |
| 2 | Light | L | Phase 0, 1 |
| 3 | Fan | M | Phase 0, 1 |
| 4 | Lock | S | Phase 0, 1 |
| 5 | Cover | S | Phase 1 |
| 6 | Valve | S | Phase 1 |
| 7 | Alarm | M | Phase 0, 1 |
| 8 | Event | S | Phase 1 |
| 9 | Edge cases | M | Phase 2-8 |
| 10 | Unit tests | L | Phase 2-8 |
| 11 | Integration verification | M | All |

S=Small (<1hr), M=Medium (1-3hr), L=Large (3-5hr)

**Total estimated effort**: ~20-25 hours (increased from original ~15-20 to account for bridge firmware fixes)

---

## File Impact Summary

### New Files (HA Integration)
- `ha_integration/custom_components/esp_tree/light.py`
- `ha_integration/custom_components/esp_tree/fan.py`
- `ha_integration/custom_components/esp_tree/lock.py`
- `ha_integration/custom_components/esp_tree/cover.py`
- `ha_integration/custom_components/esp_tree/valve.py`
- `ha_integration/custom_components/esp_tree/alarm_control_panel.py`
- `ha_integration/custom_components/esp_tree/event.py`

### Modified Files (HA Integration)
- `ha_integration/custom_components/esp_tree/const.py` — add 7 platforms to PLATFORMS

### Modified Files (Bridge Firmware)
- `ESPLR_V2/components/esp_tree_bridge/esp_tree_bridge.cpp`:
  - `api_runtime_handle_command`: JSON arg passthrough (0.1), fan command routing (0.2), alarm command mappings (0.5)
  - `decode_command_payload_`: Add JSON parsing for FAN PRIMARY route (0.3)
  - `runtime_write_entity_state_`: Fix ALARM state — add explicit case with plain string (0.4); change LOCK from `bool_value` to `string_value` (0.6)

### No Changes
- `__init__.py` — platform forwarding is automatic via PLATFORMS list
- `bridge_runtime.py` — entity dispatch is already generic via `register_platform`; `_apply_state` is type-agnostic
- `%AUTO` proto files — no schema changes needed
- `integration_client.py` — command sending already supports typed args
- `manifest.json` — no additional dependencies needed