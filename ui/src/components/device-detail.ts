import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { EspOtaBox } from './ota-box';
import { OtaJob, PreflightComparison, TopologyNode, api, fmtDuration, normalizeMac } from '../api/client';
import { CompileStatusResponse } from '../api/client';
import './device-config';
import './ota-box';
import './flash-history';
import './compile-history';
import './compile-log-viewer';

const ACTIVE_STATUSES = ['queued', 'starting', 'transferring', 'verifying', 'transfer_success_waiting_rejoin'];
const COMPILE_ACTIVE_STATUSES = ['compile_queued', 'compiling'];

@customElement('esp-device-detail')
export class EspDeviceDetail extends LitElement {
  @property({ type: String }) mac = '';
  @state() private node: TopologyNode | null = null;
  @state() private topology: TopologyNode[] = [];
  @state() private currentJob: OtaJob | null = null;
  @state() private history: OtaJob[] = [];
  @state() private compileHistoryList: OtaJob[] = [];
  @state() private compileStatus: string = 'idle';
  @state() private loading = true;
  @state() private error = '';
  private timer: number | undefined;
  private compileTimer: ReturnType<typeof setInterval> | null = null;
  @query('esp-ota-box') private otaBox!: EspOtaBox;

  connectedCallback(): void {
    super.connectedCallback();
    void this.load();
    this.schedulePoll();
  }

  disconnectedCallback(): void {
    if (this.timer) window.clearInterval(this.timer);
    if (this.compileTimer) window.clearInterval(this.compileTimer);
    super.disconnectedCallback();
  }

  private schedulePoll(): void {
    if (this.timer) window.clearInterval(this.timer);
    const isActive = this.currentJob && ACTIVE_STATUSES.includes(this.currentJob.status);
    const interval = isActive ? 2000 : 5000;
    this.timer = window.setInterval(() => void this.load(false), interval);
  }

  private pollCompileStatus(): void {
    api.getCompileStatus(this.mac).then((s: CompileStatusResponse) => {
      this.compileStatus = s.status;
      if (COMPILE_ACTIVE_STATUSES.includes(s.status)) {
        if (!this.compileTimer) {
          this.compileTimer = setInterval(() => this.pollCompileStatus(), 3000);
        }
      } else {
        if (this.compileTimer) {
          clearInterval(this.compileTimer);
          this.compileTimer = null;
        }
      }
    }).catch(() => {});
  }

  private handleReflashResult(e: CustomEvent<{ job: OtaJob; preflight: PreflightComparison }>): void {
    this.otaBox.preflight = e.detail.preflight;
    void this.load(false);
  }

  updated(): void {
    this.schedulePoll();
  }

  private async load(showLoading = true): Promise<void> {
    if (showLoading) this.loading = true;
    try {
      const [topology, current, queue, history, compileHistory] = await Promise.all([
        api.topology(),
        api.currentOtaForDevice(this.mac),
        api.getQueue(),
        api.history(this.mac),
        api.getCompileHistory(this.mac),
      ]);
      this.topology = topology;
      this.node = topology.find((node) => normalizeMac(node.mac) === normalizeMac(this.mac)) || null;
      const nm = normalizeMac(this.mac);
      const queuedForThis = (queue.queued_jobs ?? []).find((j) => normalizeMac(j.mac) === nm) ?? null;
      if (current && current.job && normalizeMac(current.job.mac) === nm) {
        this.currentJob = current.job;
      } else if (queuedForThis) {
        this.currentJob = queuedForThis;
      } else {
        this.currentJob = null;
      }
      this.history = history.jobs;
      this.compileHistoryList = compileHistory.jobs;
      this.error = '';
      const compileResp = await api.getCompileStatus(this.mac).catch(() => null);
      if (compileResp) {
        this.compileStatus = compileResp.status;
      }
      if (COMPILE_ACTIVE_STATUSES.includes(this.compileStatus)) {
        this.pollCompileStatus();
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.loading = false;
    }
  }

  private goBack(): void {
    window.location.hash = '/';
  }

  render() {
    if (this.loading) return html`<div class="card">Loading device...</div>`;
    if (this.error) return html`<div class="card error">${this.error}</div>`;
    if (!this.node) {
      return html`
        <div class="card">
          <button class="back" @click=${this.goBack}>Back</button>
          <p>Device ${this.mac} is not present in the current bridge topology.</p>
        </div>
      `;
    }
    const isRemote = !this.node.is_bridge && (this.node.hops ?? 0) > 0;
    const relayNodes = this.topology.filter((node) => {
      if (!node.online) return false;
      if (normalizeMac(node.mac) === normalizeMac(this.node!.mac)) return false;
      return !!node.is_bridge || !!node.can_relay || (node.hops ?? 0) > 0;
    });
    return html`
      <button class="back" @click=${this.goBack}>Back to topology</button>
      <section class="hero">
        <div class="hero-left">
          <h2>${this.node.friendly_name || this.node.esphome_name || this.node.label || this.node.mac}<span class="mac-suffix"> ${this.node.mac}</span></h2>
          <div class="hero-stats">
            <div class="hero-box sm ${this.node.online ? 'box-online' : 'box-offline'}" title="${this.node.firmware_md5 ? `firmware MD5: ${this.node.firmware_md5}` : 'firmware MD5: —'}"><span class="lbl">Status</span><span class="val">${this.node.online ? 'Online' : (this.node.offline_reason || 'Offline')}</span></div>
            <div class="hero-box sm"><span class="lbl">Hops</span><span class="val">${this.node.hops ?? 0}</span></div>
            <div class="hero-box sm"><span class="lbl">Uptime</span><span class="val">${fmtDuration(this.node.uptime_s)}</span></div>
            <div class="hero-box sm"><span class="lbl">Last Seen</span><span class="val">${this.node.last_seen_ago != null ? `${fmtDuration(this.node.last_seen_ago)}${!this.node.is_bridge ? ' ago' : ''}` : '-'}</span></div>
            ${this.node.chip_name ? html`<div class="hero-box sm"><span class="lbl">Chip</span><span class="val">${this.node.chip_name}</span></div>` : nothing}
            <div class="hero-box sm"><span class="lbl">RSSI</span><span class="val">${this.node.rssi == null ? '-' : `${this.node.rssi}`}<span class="unit">dBm</span></span></div>
            <a class="hero-entities ${this.node.ha_device_id ? '' : 'not-added'}" href="${this.node.ha_device_id ? `/config/devices/device/${this.node.ha_device_id}` : '/config/integrations/dashboard/add?domain=esp_tree'}" target="_blank" rel="noopener"><span class="lbl">Entities</span><span class="val">${this.node.ha_device_id ? 'View in HA' : 'Not Yet Added'}</span></a>
          </div>
        </div>
      </section>

      <div class="layout">
        ${isRemote
          ? html`
              <section class="card config-card">
                <esp-device-config
                  .mac=${this.node.mac}
                  .online=${!!this.node.online}
                  .isRemote=${isRemote}
                  .relayNodes=${relayNodes}
                  .relayEnabled=${!!this.node.relay_enabled}
                  @config-changed=${() => void this.load(false)}
                ></esp-device-config>
              </section>
              <section class="card">
                <esp-ota-box .mac=${this.node.mac} .node=${this.node} .currentJob=${this.currentJob} .showEditYaml=${isRemote} @ota-changed=${() => void this.load(false)}></esp-ota-box>
              </section>
              <section class="layout-empty"></section>
            `
          : html`
              <section class="card">
                <esp-ota-box .mac=${this.node.mac} .node=${this.node} .currentJob=${this.currentJob} @ota-changed=${() => void this.load(false)}></esp-ota-box>
              </section>
            `}
        <section class="card history">
          <esp-flash-history .jobs=${this.history} @ota-changed=${() => void this.load(false)} @ota-reflash-result=${this.handleReflashResult}></esp-flash-history>
        </section>
        <section class="panel history">
          <esp-compile-history .jobs=${this.compileHistoryList} .mac=${this.mac}></esp-compile-history>
        </section>
        ${COMPILE_ACTIVE_STATUSES.includes(this.compileStatus) || this.compileStatus === 'failed'
          ? html`<section class="panel history">
              <esp-compile-log-viewer .mac=${this.mac} .visible=${true}></esp-compile-log-viewer>
            </section>`
          : nothing}
      </div>
    `;
  }

static styles = css`
    .back {
      border: 1px solid var(--line);
      background: var(--surface);
      min-height: 36px;
      padding: 0 14px;
      font: inherit;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      margin-bottom: 16px;
      font-size: 13px;
      transition: all 0.12s;
    }

    .back:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .hero,
    .card {
      border: 1px solid var(--line);
      background: var(--surface);
      border-radius: 12px;
      box-shadow: var(--shadow);
    }

    .hero {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      padding: 20px 24px;
      margin-bottom: 20px;
    }

    .hero-left {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .hero-left h2 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
      overflow-wrap: anywhere;
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .mac-suffix {
      font-size: 14px;
      font-weight: 400;
      color: var(--muted);
      font-family: monospace;
    }
    .hero-entities {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 6px 10px;
      min-width: 70px;
      text-decoration: none;
      color: inherit;
      transition: border-color 0.15s, background 0.15s;
    }
    .hero-entities:hover {
      background: #eef4ff;
      border-color: #93c5fd;
    }
    .hero-entities .lbl {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
    }
    .hero-entities .val {
      font-size: 13px;
      font-weight: 600;
    }
    .hero-entities.not-added {
      border-color: #fecaca;
      background: #fef2f2;
    }
    .hero-entities.not-added:hover {
      background: #fee2e2;
      border-color: #f87171;
    }
    .hero-entities.not-added .val {
      color: #dc2626;
      font-size: 10px;
      font-weight: 500;
    }

    .hero-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .hero-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px 14px;
      min-width: 80px;
    }

    .hero-box.sm {
      min-width: 70px;
      padding: 6px 10px;
    }

    .hero-box.sm .lbl {
      font-size: 9px;
    }

.hero-box.sm {
      min-width: 70px;
      padding: 6px 10px;
    }

    .hero-box.sm .lbl {
      font-size: 9px;
    }

.hero-box.sm .val {
      font-size: 13px;
    }

    .box-online {
      background: #dcfce7;
      border-color: #bbf7d0;
    }

    .box-online .lbl,
    .box-online .val {
      color: #166534;
    }

    .box-offline {
      background: #fef2f2;
      border-color: #fecaca;
    }

    .box-offline .lbl,
    .box-offline .val {
      color: #991b1b;
    }

    .hero-box .lbl {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 2px;
    }

    .hero-box .val {
      font-size: 16px;
      font-weight: 700;
      color: var(--primary);
      display: flex;
      align-items: baseline;
      gap: 2px;
    }

    .hero-box .val .unit {
      font-size: 11px;
      font-weight: 500;
      color: #94a3b8;
    }

    .btn-edit-config {
      border: 1px solid #0f766e;
      background: #0f766e;
      color: #fff;
      min-height: 36px;
      padding: 0 16px;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.12s;
      align-self: flex-start;
    }

    .btn-edit-config:hover {
      background: #0d5f58;
      border-color: #0d5f58;
    }

    .layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .panel,
    .card {
      padding: 16px 20px;
    }

    .history {
      grid-column: 1 / -1;
    }

    .layout-empty {
      min-height: 1px;
    }

    .error {
      color: var(--danger);
      font-weight: 500;
      padding: 12px;
      border: 1px solid var(--danger);
      border-radius: 8px;
      background: #fef2f2;
    }

    @media (max-width: 900px) {
      .layout {
        grid-template-columns: 1fr;
      }
      .hero-stats {
        flex-wrap: wrap;
      }
    }

    @media (max-width: 500px) {
      .hero-stats {
        flex-direction: column;
      }
    }
  `;
}
