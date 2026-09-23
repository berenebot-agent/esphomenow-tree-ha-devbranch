# Topology Default Link → HA Device Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change default topology node click to open HA device page (new tab); replace idle OTA upload icon (📤) with gear icon (⚙) linking to in-app device page.

**Architecture:** Single-file change to `ui/src/components/topology-node.ts`. Two independent edits: `selectNode()` method and the idle OTA badge render branch. Both use existing CSS class `.icon-btn` and existing HA URL pattern `/config/devices/device/${ha_device_id}`.

**Tech Stack:** LitElement, TypeScript

---

### Task 1: Update selectNode() to navigate to HA device page

**Files:**
- Modify: `ui/src/components/topology-node.ts:26-28`

- [ ] **Step 1: Replace selectNode() implementation**

Current code at line 26-28:
```typescript
  private selectNode(): void {
    this.dispatchEvent(new CustomEvent('node-selected', { detail: this.node.mac, bubbles: true, composed: true }));
  }
```

Replace with:
```typescript
  private selectNode(): void {
    if (this.node.ha_device_id) {
      window.open(`/config/devices/device/${this.node.ha_device_id}`, '_blank');
    } else {
      this.dispatchEvent(new CustomEvent('node-selected', { detail: this.node.mac, bubbles: true, composed: true }));
    }
  }
```

- [ ] **Step 2: Verify the edit**

Read `ui/src/components/topology-node.ts` around line 26-28, confirm the change is correct and `ha_device_id` is a property on `TopologyNode` (it's at `client.ts:30`).

---

### Task 2: Replace idle OTA badge with gear icon

**Files:**
- Modify: `ui/src/components/topology-node.ts:101-102`

- [ ] **Step 1: Replace the idle OTA badge**

Current code at lines 101-102:
```typescript
                      : html`<span class="ota-badge idle" title="OTA"
                             @click=${(e: Event) => { e.stopPropagation(); this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}`); }}>📤</span>`
```

Replace with:
```typescript
                      : html`<button class="icon-btn" title="View device"
                             @click=${(e: Event) => { e.stopPropagation(); this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}`); }}>⚙</button>`
```

Uses existing `.icon-btn` CSS (lines 258-277): 76×28px, white background, turns `var(--primary)` on hover with white text.

- [ ] **Step 2: Verify the edit**

Read `ui/src/components/topology-node.ts` around lines 101-102, confirm the idle OTA badge is replaced but the other badge states (active `📡 %`, queued `⏳`, compiling `⚙`) remain unchanged.

---

### Task 3: Build and verify

- [ ] **Step 1: Build the UI**

```bash
cd /home/ben/projects/esphomenow-tree-ha/ui && npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Clean up**

No additional work needed — single file, minimal change.
