# Workplan: Topology Pill Alignment, Remote Entity Setup, Edit-YAML Pass-Through, Relay

> **Status: PROPOSED — awaiting go-ahead.** No code has been changed for this workplan.
>
> Scope agreed in conversation 2026-09-25. Four items, in the order raised.
>
> **Ground rules carried into implementation:**
> - Implement only after explicit go-ahead.
> - Do not change SoC board/`variant`/pin settings to "fix" anything. (A previous pass
>   changed UART pins on a wrong assumption and broke the link; pins are load-bearing.)
> - Verify with a marker unique to the change, not a version string.
> - Release path is `./dev.sh qc quick addon` **then** `git push devrepo HEAD:main` —
>   `qc` pushes only to its own upstream (`prfork/esptree-dev`), so the push to
>   `devrepo/main` is a separate, mandatory step or the HA store never sees the version.
> - Finish the whole flow: release → install → restart HA → verify → confirm regular
>   topology. "Released" is not "done".

---

## Objective

Four outcomes:

1. **Topology row actions stop looking clunky.** The Settings / Edit YAML / Remove buttons
   and the metric pills currently disagree in height, radius, padding and effective width.
   Make them one consistent pill language.
2. **Clicking Settings on a discovered remote stops dead-ending at "Entities: Not Yet Added".**
   The remote is discovered and a config flow exists, but it is never confirmed, so the remote
   never gets a Home Assistant device.
3. **Edit YAML works end-to-end.** Write a real config with entities on the C3 remote, save,
   compile, OTA it, and confirm the entities appear in HA and their state pushes back.
4. **Relay works.** Ben is adding a second remote; verify a two-hop tree.

---

## Item 1 — Topology row: align the actions with the pills

### What is wrong (measured, not guessed)

`ui/src/components/topology-node.ts`:

- **No `box-sizing: border-box`.** Only 4 files in `ui/src` set it at all
  (`device-config.ts`, `ota-box.ts`, `secrets-page.ts`); nothing sets it globally. So every
  `width: 76px` pill renders **92px** wide (`76 + 2×8px padding`), and each pill's real width
  depends on its padding rather than being a shared column — which is exactly the "clunky and
  different" look.
- **The hide button is a pill inside a pill.** Template line 77 renders `<button class="hide-pill">`
  *inside* the `.metrics span` that is already styled as a pill (`background:#f1f5f9`,
  `padding:3px 8px`, `border-radius:6px`, `width:76px`, line 363-373). `.hide-pill` then adds its
  own `width:76px` + `padding:3px 8px` + danger background (line 380-394). Nested pills, doubled
  padding.
- **`width: 76px` fights `min-width: 72px`.** `.metrics .chip-name` sets `min-width: 72px`
  (line 400-402) against the 76px flex-item width, so the chip cell sizes differently from its
  neighbours.
- **Buttons and pills are two different visual languages.** `.icon-btn` (line 284-300) is
  `min-height: 36px; padding: 0 16px; border-radius: 8px; font-size: 13px;` with a solid teal
  fill. `.ota-badge` (line 423-435) is `font-size: 11px; padding: 2px 8px; border-radius: 6px`.
  The metrics pills are a third thing again (`font-size: 12px; padding: 3px 8px; radius 6px`).
- **The same button class lands in two different columns.** The grid is
  `14px 10px minmax(180px,1fr) minmax(0,1fr) 120px 190px` (line 191). Settings renders in the
  120px column, Edit YAML + Remove in the 190px column (with `gap: 12px`). Same class, different
  box, so they never line up.

### Approach

Unify on one pill token set, applied to metrics pills, badges and action buttons:

- Add `box-sizing: border-box` so a declared width means that width.
- Base unit: `height: 26px`, `padding: 0 10px`, `border-radius: 999px`, `font-size: 12px`,
  `line-height: 1`, `display: inline-flex; align-items: center; justify-content: center`.
- Metrics pills: keep a shared fixed width via `min-width` (not `width`) so they line up but can
  grow for long values.
- Replace the nested `hide-pill` inside a pill with a single button styled as a pill.
- Give `.icon-btn`, `.ota-badge` and the metrics pills the same height/radius/vertical rhythm so
  a row reads as one band. Buttons keep their affordance (border, hover) without the 36px height.
- Keep the responsive block (`@media (max-width: 840px)`, line 489+) working — it hides
  `.action-buttons` and reflows to one column, so pills must not assume fixed columns there.

Ben's steer: **the pill may get slightly larger** if that is what makes them agree.

### Files

- Modify: `ui/src/components/topology-node.ts` (template lines 60-117; styles 142-549)
- Possibly touch: `ui/src/app.ts` for shared `:root` pill tokens (line ~231 already holds
  `--muted/--line/--primary/--danger/--ok`) — only if tokens are wanted globally.

### Verification

- `bash test/run-unit-tests.sh` (UI build is part of the add-on image; `npx tsc --noEmit` in `ui/`).
- Screenshot the topology at 1280px and at <840px, online remote and offline remote, and confirm:
  the metric pills share left/right edges; Settings / Edit YAML / Remove are the same height and
  radius as the pills; no nested pill on an offline row.
- Confirm the compile / OTA badges still render in the actions column without breaking the grid.

---

## Item 2 — Settings on a remote: make entity setup actually complete

### What is wrong (live evidence from the test box)

- `GET /api/bridge/topology.json` for the remote `F4:2D:C9:58:33:10` returns
  `ha_device_id: ""`, `entity_count: 0`.
- `ui/src/components/device-detail.ts:145` renders the hero link as **"Not Yet Added"** when
  `ha_device_id` is empty, and points it at
  `/config/integrations/dashboard/add?domain=esp_tree`.
- A discovery flow **already exists and is sitting unconfirmed**:

  ```
  flow_id: 01M3CM8S63Z61GCGSG2W65PWHQ
  handler: esp_tree
  source:  integration_discovery
  unique_id: F4:2D:C9:58:33:10   title: espnow-remote
  step_id: discovery_confirm
  ```

So the integration *did* discover the remote — `bridge_runtime.py:302 _schedule_remote_discovery`
→ `:325 _async_create_remote_entry` → `config_entries.flow.async_init(source=SOURCE_INTEGRATION_DISCOVERY)`
— and then `config_flow.py:184 async_step_discovery_confirm` waits for a human to press Add.
Until that happens: no config entry for the remote → no HA device → `ha_device_id` empty →
"Not Yet Added". The generic "add integration" URL the UI links to is also not the right
destination for a flow that already exists and merely needs confirming.

### Approach (one decision needed — see Open Decisions)

**Preferred: auto-create the remote entry.** A discovered remote has nothing mandatory to ask
(area is `vol.Optional`). Change `async_step_discovery_confirm` (or the caller) so discovery
completes without a user prompt, keeping the form only for the explicit "set an area" path.
Removes the prompt entirely, which is what Ben hit.

**Alternative: keep the prompt, fix the destination.** Leave confirm-on-discovery, and point the
UI at the pending flow (`/config/integrations`) instead of the generic add page, with the hero
label saying "Confirm in HA" rather than "Not Yet Added".

Either way, once the entry exists, `__init__.py:175-187` runs `ensure_remote_device` and forwards
the platforms, so the remote gets a HA device and `ha_device_id` populates.

Note the interaction with Item 3: with no entities in the remote's YAML, the device will exist
but have no entities. Item 2 gets the *device*; Item 3 fills it.

### Files

- Modify: `ha_integration/custom_components/esp_tree/config_flow.py:175-205`
- Possibly modify: `ha_integration/custom_components/esp_tree/bridge_runtime.py:302-340`
  (result handling / retry when the flow does not immediately create an entry)
- Possibly modify: `ui/src/components/device-detail.ts:145` (label + href once the entry is
  auto-created, so the label reads correctly for a device that exists)
- Test: `ha_integration/tests/` (config-flow coverage for discovery confirm)

### Verification

- After the change: a fresh remote appears and, with no user action, `config_entries/get` shows an
  `esp_tree` remote entry for that MAC; `ha_device_id` is populated in topology.
- `GET /api/devices/<mac>` and the device-detail page show "View in HA", not "Not Yet Added".
- Confirm the pending-flow prompt no longer appears for a newly discovered remote.
- Integration tests in `ha_integration/tests` pass.

---

## Item 3 — Edit YAML: entities end-to-end, flashed, passing through

### Current state (live)

`GET /api/devices/F4:2D:C9:58:33:10/config` returns `has_config: true`, `config_state:
has_config`, and this content — **no entities at all**:

```yaml
esphome:
  name: espnow-remote
esp32:
  board: esp32dev
  framework:
    type: esp-idf
external_components:
  - source:
      type: local
      path: /opt/esp-tree/components
    components: [esp_tree_remote, esp_tree_common]
logger:
  level: DEBUG
esp_tree_remote:
  network_id: !secret espnow_network_id
  psk: !secret espnow_psk
  ota_over_espnow: true
  espnow_mode: lr
# Add your sensors, switches, etc. below
```

The editor plumbing exists: `ui/src/components/config-editor.ts` (CodeMirror + YAML + the
`hasEspTreeExternalComponents` guard), `ui/src/pages/config-page.ts` (save / compile / OTA,
~1300 lines), and `POST /api/devices/{mac}/config` → `app/server.py:2851 save_device_config`
→ `app/yaml_store.py`. `app/yaml_scaffold.py` deliberately emits only the
`# Add your sensors, switches, etc. below` placeholder (lines 165, 330) — so an empty scaffold
is by design, not a bug.

So the work is: prove the *round trip* works with real entities, and fix whatever breaks.

### Approach

1. **Confirm the LED pin before writing it.** Do not assume. The scaffold set `board: esp32dev`
   (from the remote's generic `chip_name: "ESP32"`), but the physical device is Ben's C3 devkit.
   GPIO2 is the classic-ESP32 onboard LED; a C3 devkit is typically GPIO8 (often an addressable
   WS2812). `device_code/demos/espnow-remote-1.yml` uses GPIO2 *and* GPIO25/26/27/32/33 — all
   classic-ESP32 pins, so it is not a reliable template for this board. Resolve the actual board
   from the device's reported chip + the physical devkit and confirm with Ben, or use template
   switches only.
2. **Write a config with both entity kinds** so the test covers GPIO and pure-virtual:
   the onboard LED switch plus 2–3 `template` (optimistic) switches, and one `template` binary
   sensor for state variety. Nothing else is connected, so no hazard.
3. **Drive the real UI path**, not the API directly: Settings → Edit YAML → edit → Save →
   Compile → flash via OTA from the browser. This is the flow Ben asked to have tested.
4. **Confirm pass-through in both directions**: entities appear in HA on the remote's device, and
   toggling in HA reaches the device (visible in device logs), with the device's state visible
   back in HA.

Candidate YAML (pin to be confirmed per step 1):

```yaml
switch:
  - platform: template
    name: "Virtual Switch 1"
    id: vsw1
    optimistic: true
  - platform: template
    name: "Virtual Switch 2"
    id: vsw2
    optimistic: true
  - platform: gpio
    pin: GPIO8          # CONFIRM: C3 devkit onboard LED (GPIO2 = classic ESP32)
    name: "Board LED"
    id: board_led
binary_sensor:
  - platform: template
    name: "Virtual Motion"
    id: vmotion
```

### Files

- Modify (only if the round trip is broken): `ui/src/pages/config-page.ts`,
  `ui/src/components/config-editor.ts`, `app/server.py` config/compile routes,
  `app/yaml_store.py`
- Inspect: `app/yaml_scaffold.py`
- Device config artefact: the remote's YAML in the add-on config store
  (`yaml_store` under the add-on's data path — read via the API, not by reaching into the fs)

### Verification

- Save persists: `GET .../config` returns the edited content verbatim.
- Compile succeeds (watch the compile log; no warnings suppressed).
- OTA completes and the remote rejoins (online, `hops` back to 1).
- `entity_count` in topology matches the number of entities defined.
- Entities visible under the remote's HA device, and a state change made on the device shows in
  HA. Toggling from HA reaches the device.
- `bash test/run-unit-tests.sh` green; `npx tsc --noEmit` exit 0.
- Add a regression test if a code defect is found (write it failing first — the last fix in this
  repo was validated by stashing the fix and confirming the new test fails without it).

---

## Item 4 — Relay, two-hop tree (Ben adds the second remote)

Ben is adding a second remote. Current C3 state: `can_relay: true`, `relay_enabled: false`,
`hops: 1`, `direct_child_count: 0`.

### Approach

- Wait for Ben's second remote, then place it **out of direct range** of the bridge so the path
  must go through the first remote, or explicitly set the relay parent.
- Relay control exists on the protobuf side: `ConfigCommandRequest` carries `parent_mac`,
  `clear_parent`, `relay_enable` (`esp_tree_runtime.proto`), and there is a
  `/api/bridge/...` route for config commands. Confirm the UI exposes it before reaching for raw
  API calls.
- Verify the topology changes shape: the second remote reports `hops: 2`, first remote becomes its
  `parent_mac`, and `direct_child_count` on the first remote increments.

### Files

- Inspect first: `app/bridge_v2_client.py` (routing/route bookkeeping), `ui/src/components/topology-map.ts`
  (tree building), `ui/src/components/topology-node.ts` (child rendering)
- Device side only if relay proves broken: `device_code/components/esp_tree_remote/`

### Verification

- Topology shows a 2-hop chain, not two flat children of the bridge.
- Both remotes' entities are reachable and controllable through the relay.
- Offline behaviour is sane: take the middle node down and confirm the outer node reports offline
  with a reason rather than silently vanishing.

---

## Open decisions — RESOLVED (Ben, 2026-09-25)

| # | Decision | Answer |
|---|----------|--------|
| D1 | Item 2: how should discovery complete? | **Auto-create** the remote entry, no prompt (my recommendation, accepted). Discovery has nothing mandatory to ask. |
| D2 | Item 3: onboard LED pin | **Both remotes are classic ESP32 devkits** → onboard LED is **GPIO2**. Use it; `espnow-remote-1.yml`'s use of GPIO2 was correct after all. Do not touch `board:`/`variant:`. |
| D3 | Item 1: scope of the pill unify | Topology row. Implement it; no site-wide token extraction unless it looks wrong. |
| D4 | Item 4: relay verification | **Exercise the relay controls** (`parent_mac` / `clear_parent` / `relay_enable`) and verify the tree reshapes — do not just record the organic 2-hop result. |
| D5 | Cleanup | Remove the duplicate `FF:FF:FF:FF:FF:FF:FE` placeholder row **only**. Keep the 4 retained long-dead remotes as history. |
| — | Authorisation | **Implement all of it tonight**; Ben reviews in the morning. |

### Relay is already forming a real 2-hop chain (observed before any change)

```
esptree_bridge_serial   D0:CF:13:EB:81:28   hops 0   online   (bridge)
espnow-remote           F4:2D:C9:58:33:10   hops 1   online   parent = bridge
espnow-remote-musb      7C:9E:BD:07:39:1C   hops 2   online   parent = espnow-remote
```

So two-hop relay works organically. Item 4's remaining work is proving the **controls**
reshape the tree (D4), including through the relay's entities.

## Risks

- **R1 — wrong board assumption.** The remote's stored config says `board: esp32dev` while the
  device is a C3 devkit. Changing `board:`/`variant:` is exactly the class of edit that broke the
  link last time. This plan does **not** change it; it picks the LED pin to match, or skips GPIO.
  If the board setting itself needs correcting that is a separate, explicitly-approved change.
- **R2 — OTA over ESP-NOW is slow and can drop.** Budget for a retry rather than declaring failure
  on the first attempt; watch the rejoin.
- **R3 — resetting state.** Confirming discovery and flashing entities changes the test box's
  state. Nothing here is destructive; the mountless GPIO switch is safe by design.
- **R4 — the release trap.** `dev.sh qc` will happily leave `devrepo/main` unpushed. Always push
  explicitly and confirm GitHub serves the new version before refreshing the store.

## Definition of done

- Topology row: pills and buttons agree in height/radius/alignment, at desktop and narrow widths.
- A discovered remote gets a HA device with no manual prompt (per D1), and Settings no longer
  dead-ends.
- Edit YAML round trip proven: save → compile → OTA → entities in HA → state both ways.
- Two-hop relay proven with the second remote.
- Full suite green, `tsc` clean, deployed to the test HA, HA restarted, restart prompt clear,
  regular topology confirmed.
