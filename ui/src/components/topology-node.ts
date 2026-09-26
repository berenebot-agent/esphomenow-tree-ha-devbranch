import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ConfigStatus, OtaJob, TopologyNode, fmtDuration, normalizeMac } from '../api/client';

@customElement('esp-topology-node')
export class EspTopologyNode extends LitElement {
  @property({ type: Object }) node!: TopologyNode;
  @property({ type: Array }) childNodesData: TopologyNode[] = [];
  @property({ attribute: false }) childMap: Map<string, TopologyNode[]> = new Map();
  @property({ attribute: false }) jobForMac: (mac: string) => OtaJob | null = () => null;
  @property({ attribute: false }) configForMac: (mac: string) => ConfigStatus | null = () => null;
  @property({ attribute: false }) onHideDevice: (mac: string) => void = () => {};
  @property({ attribute: false }) onRemoveDevice: (mac: string) => void = () => {};
  @property({ type: Boolean }) isRoot = false;
  @property({ type: Boolean, reflect: true }) isLast = false;

  private selectNode(): void {
    if (this.node.ha_device_id) {
      window.open(`/config/devices/device/${this.node.ha_device_id}`, '_blank');
    } else {
      this.dispatchEvent(new CustomEvent('node-selected', { detail: this.node.mac, bubbles: true, composed: true }));
    }
  }

  private navigateTo(path: string): void {
    window.location.hash = path;
  }

  private rssiBars(rssi?: number | null): string {
    if (rssi == null) return '-';
    if (rssi >= -50) return '▂▄▆█';
    if (rssi >= -65) return '▂▄▆';
    if (rssi >= -80) return '▂▄';
    if (rssi >= -90) return '▂';
    return '▁';
  }

  private childKey(node: TopologyNode): string {
    return normalizeMac(node.mac || '');
  }

  render() {
    const job = this.jobForMac(this.node.mac);
    const isActive = !!job && ['starting', 'transferring', 'verifying', 'transfer_success_waiting_rejoin'].includes(job.status);
    const isQueued = !!job && job.status === 'queued';
    const percent = job?.percent ?? 0;
    const hasChildren = this.childNodesData.length > 0;
    // Any node that is not the tree root and not the bridge itself is a remote.
    // Gating on `hops > 0` alone hid retained remotes: those are restored from the
    // integration store without a hop count, so they silently lost their config
    // badge and their Edit YAML button.
    const isRemote = !this.isRoot && !this.node.is_bridge;

    const configStatus = this.configForMac(this.node.mac);
    const configState = configStatus?.config_state ?? 'no_config';
    const isCompiling = configState === 'compiling';
    const isCompileQueued = configState === 'compile_queued';
    const compileQueuePos = configStatus?.queue_position ?? 1;

    return html`
      <div class="tree-row">
        <div class="branch ${this.isRoot ? 'root' : ''}" aria-hidden="true"></div>
        <div class="tree-node ${this.node.online ? 'online' : 'offline'}" @click=${this.selectNode}>
          ${isRemote ? html`
            <span class="config-badge config-${configState}">
              ${configState === 'no_config' ? '—' : configState === 'has_config' ? '✓' : configState === 'compiled_ready' ? '↑' : '—'}
            </span>
          ` : this.isRoot ? html`
            <span class="bridge-badge">B</span>
          ` : html`<span></span>`}
          <span class="status-dot ${this.node.online ? 'online' : 'offline'}"></span>
          <span class="identity">
            <span class="bridge-name-line">${this.isRoot && this.node.network_id ? html`<strong>${this.node.friendly_name || this.node.esphome_name || this.node.label || this.node.mac}</strong><span class="network-id">${this.node.network_id}</span>` : html`<strong>${this.node.friendly_name || this.node.esphome_name || this.node.label || this.node.mac}</strong>`}</span>
            <small>${this.node.mac}</small>
          </span>
          <span class="metrics">
            ${this.node.online
              ? html`<span>${fmtDuration(this.node.uptime_s)}</span>`
              : html`<button class="hide-pill" title="hide until back online" @click=${(e: Event) => { e.stopPropagation(); this.onHideDevice(this.node.mac); }}>✕ hide</button>`}
            ${this.isRoot || this.node.last_seen_ago == null ? html`<span class="pill-placeholder">—</span>` : html`<span class="last-seen">${fmtDuration(this.node.last_seen_ago)} ago</span>`}
            ${this.isRoot ? html`<span class="pill-placeholder">—</span>` : this.node.online
              ? html`<span title="${this.node.rssi != null ? `${this.node.rssi} dBm` : ''}">${this.rssiBars(this.node.rssi)}${(this.node.hops ?? 0) > 0 ? `  ${this.node.hops}↷` : ''}</span>`
              : html`<span class="offline-metric">${this.node.offline_reason || 'offline'}</span>`
            }
            <span class="chip-name">${this.node.chip_name || '-'}</span>
          </span>
          ${isRemote ? html`
            ${this.node.online
              ? html`
                  ${isCompiling
                    ? html`<span class="ota-badge compile-active" title="Compiling firmware..."
                           @click=${(e: Event) => { e.stopPropagation(); this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}`); }}><span class="compile-spinner">⚙</span></span>`
                    : isCompileQueued
                      ? html`<span class="ota-badge queued compile" title="Compile queued (#${compileQueuePos})"
                             @click=${(e: Event) => { e.stopPropagation(); this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}`); }}>⏳ #${compileQueuePos}</span>`
                      : isActive
                        ? html`<span class="ota-badge active" title="OTA in progress"
                               @click=${(e: Event) => { e.stopPropagation(); this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}`); }}>📡 ${percent}%</span>`
                        : isQueued
                          ? html`<span class="ota-badge queued" title="OTA queued"
                                 @click=${(e: Event) => { e.stopPropagation(); this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}`); }}>⏳ #${job.queue_position ?? 1}</span>`
                          : html`<button class="icon-btn" title="View device"
                                 @click=${(e: Event) => { e.stopPropagation(); this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}`); }}>⚙ Settings</button>`
                  }
                `
              : html`<button class="icon-btn" title="View device"
                     @click=${(e: Event) => { e.stopPropagation(); this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}`); }}>⚙ Settings</button>`
            }
          ` : html`<span></span>`}
          ${isRemote ? html`
            <span class="action-buttons">
              <button class="icon-btn" title="Edit YAML config" @click=${(e: Event) => { e.stopPropagation(); this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}/config`); }}>Edit YAML</button>
              ${this.node.online
                ? nothing
                : html`<button class="icon-btn danger" title="Forget this remote (removes it from the network and Home Assistant)"
                       @click=${(e: Event) => { e.stopPropagation(); this.onRemoveDevice(this.node.mac); }}>Remove</button>`}
            </span>
          ` : nothing}
        </div>
      </div>
      ${hasChildren
        ? html`
            <div class="tree-child">
              ${this.childNodesData.map(
                (child, i) => html`
                  <esp-topology-node
                    .node=${child}
                    .childNodesData=${this.childMap.get(this.childKey(child)) || []}
                    .childMap=${this.childMap}
                    .jobForMac=${this.jobForMac}
                    .configForMac=${this.configForMac}
                    .onHideDevice=${this.onHideDevice}
                    .onRemoveDevice=${this.onRemoveDevice}
                    .isLast=${i === this.childNodesData.length - 1}
                  ></esp-topology-node>
                `
              )}
            </div>
          `
        : nothing}
    `;
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
      margin-left: 10px;
    }

    :host([is-root]) {
      margin-left: 0;
    }

    .tree-row {
      display: flex;
      align-items: stretch;
      position: relative;
      padding: 6px 0;
    }

    .branch {
      position: relative;
      width: 22px;
      flex: 0 0 22px;
      margin-right: 2px;
    }

    .branch.root {
      width: 0;
      flex-basis: 0;
      margin-right: 0;
    }

    /* For last child, stop the vertical line at the horizontal connector */
    :host([is-last])::before {
      display: none;
    }

    /* Don't show continuation line on the root */
    :host([is-root])::before {
      display: none;
    }

    .tree-node {
      width: 100%;
      display: grid;
      /* Fixed trailing tracks keep every box - bridge or remote - on the same
         column grid. With auto tracks each row sized its own columns, so the
         bridge (which has no OTA/action cells) never aligned with a remote. The
         trailing widths fit the widest remote content: the Settings button, and
         the Edit YAML + Remove pair. */
      grid-template-columns: 14px 10px minmax(180px, 1fr) minmax(0, 1fr) 120px 190px;
      gap: 12px;
      align-items: center;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: #fafbfc;
      color: var(--ink);
      padding: 12px 14px;
      cursor: pointer;
      font: inherit;
      transition: all 0.12s;
    }

    .tree-node:hover {
      border-color: var(--primary);
      background: #f0f7fa;
    }

    .tree-node.offline {
      background: #fef2f2;
      border-color: #fecaca;
    }

    .tree-node.offline .status-dot {
      background: var(--danger);
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--ok);
    }

    .config-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      font-size: 9px;
      font-weight: 700;
      border: 1px solid var(--line);
      border-radius: 4px;
    }

    .config-badge.config-has_config {
      border-color: var(--ok);
      color: var(--ok);
      background: #dcfce7;
    }

    .config-badge.config-compiled_ready {
      border-color: var(--primary);
      color: var(--primary);
      background: #d5f0f3;
    }

    .config-badge.config-no_config {
      border-color: var(--line);
      color: var(--muted);
    }

    .bridge-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      font-size: 9px;
      font-weight: 700;
      border-radius: 4px;
      background: var(--primary);
      color: #fff;
      flex-shrink: 0;
    }

    .ota-badge.compile-active {
      background: #5b9bd5;
      color: #fff;
      font-size: 16px;
    }

    .ota-badge.compile-active .compile-spinner {
      display: inline-block;
      animation: compile-spin 1s linear infinite;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
    }

    .icon-btn {
      border: 1px solid #0f766e;
      background: #0f766e;
      color: #fff;
      padding: 0 14px;
      font: inherit;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.12s;
    }

    .icon-btn:hover {
      background: #0d5f58;
      border-color: #0d5f58;
      transform: translateY(-1px);
    }

    .icon-btn.danger {
      background: #fff;
      border-color: #fecaca;
      color: #b91c1c;
    }

    .icon-btn.danger:hover {
      background: #fef2f2;
      border-color: #fca5a5;
      transform: translateY(-1px);
    }

    .identity {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }

    .bridge-name-line {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .network-id {
      color: var(--primary);
      font-weight: 500;
      font-size: 14px;
      flex-shrink: 0;
    }

    strong,
    small {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    small {
      color: var(--muted);
      font-size: 12px;
    }

    .metrics {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      min-width: 0;
      font-size: 12px;
      color: var(--muted);
      justify-content: flex-end;
    }

    /* One pill language for the row. Every pill and badge shares the same height,
       radius and horizontal padding so a row reads as a single band. box-sizing is
       set here because nothing sets it globally: without it a width:76px pill
       actually rendered 92px (76 plus 2x8px padding), so each pill's real width
       depended on its own padding rather than a shared column. */
    .metrics span,
    .metrics .hide-pill,
    .pill-placeholder,
    .config-badge,
    .bridge-badge,
    .ota-badge,
    .icon-btn {
      box-sizing: border-box;
      min-height: 26px;
      border-radius: 999px;
      font-size: 12px;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
    }

    .metrics span {
      background: #f1f5f9;
      padding: 0 10px;
      /* min-width, not width: the cells line up but a long value can still grow
         instead of overflowing. */
      min-width: 76px;
      text-align: center;
    }

    .metrics span.offline-metric {
      background: var(--danger);
      color: #fff;
    }

    .hide-pill {
      padding: 0 10px;
      border: none;
      background: var(--danger);
      color: #fff;
      font: inherit;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.12s;
    }

    .hide-pill:hover {
      background: #dc2626;
    }

    .metrics .chip-name {
      min-width: 76px;
    }

    .pill-placeholder {
      background: #f1f5f9;
      padding: 0 10px;
      min-width: 76px;
      text-align: center;
      color: var(--muted);
    }

    .tree-node.offline .last-seen {
      background: var(--danger);
      color: #fff;
    }

    .metrics .last-seen {
      color: var(--muted, #888);
      font-size: 11px;
    }

    .ota-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      padding: 0 10px;
      cursor: pointer;
      transition: all 0.12s;
    }

    .ota-badge.active {
      position: relative;
      overflow: hidden;
      background: #5b9bd5;
    }

    .ota-badge.active::before {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 4px,
        rgba(255, 255, 255, 0.2) 4px,
        rgba(255, 255, 255, 0.2) 8px
      );
      background-size: 12px 12px;
      animation: ota-stripes 0.6s linear infinite;
    }

    .ota-badge.idle {
      background: #fff;
      color: var(--ink);
      border: 1px solid var(--line);
      font-size: 16px;
    }

    .ota-badge.queued {
      background: #5b9bd5;
    }

    .ota-badge:hover {
      opacity: 0.85;
    }

    @keyframes ota-stripes {
      0% { background-position: 0 0; }
      100% { background-position: 12px 0; }
    }

    @keyframes compile-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .tree-child {
      position: relative;
      margin-left: 6px;
      padding-left: 0;
    }

    @media (max-width: 840px) {
      :host {
        margin-left: 0;
      }
      .branch {
        display: none;
      }
      .tree-node {
        grid-template-columns: 1fr auto;
        grid-auto-flow: row;
        align-items: start;
        gap: 6px 10px;
        padding: 12px 12px;
      }
      .config-badge {
        display: none;
      }
      .status-dot {
        grid-column: 2;
        grid-row: 1;
        justify-self: end;
        margin-top: 8px;
      }
      .identity {
        grid-column: 1;
        grid-row: 1;
        align-self: start;
        gap: 2px;
      }
      strong,
      small {
        white-space: normal;
      }
      strong {
        font-size: 14px;
        line-height: 1.25;
      }
      small {
        font-size: 11px;
        line-height: 1.3;
      }
      .metrics,
      .ota-badge,
      .offline-note {
        grid-column: 1 / -1;
      }
      .metrics {
        display: flex;
        flex-wrap: wrap;
        grid-row: 2;
        gap: 6px;
      }
      .ota-badge,
      .offline-note {
        grid-row: 3;
      }
      .action-buttons {
        display: none;
      }
    }
  `;
}
