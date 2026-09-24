import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { SerialPortInfo, api } from '../api/client';

/**
 * Create Remote wizard.
 *
 * Flashes a brand-new ESP-NOW remote. Deliberately separate from
 * `setup-page.ts`: that wizard owns bridge provisioning (a bridges row, WiFi
 * credentials, a serial client), which a remote must not have. Reusing it would
 * mean threading a device-kind flag through every bridge-only branch.
 *
 * The remote shares the bridge's ESP-NOW network credentials, so those are
 * prefilled from secrets.yaml rather than asked for again.
 */
@customElement('esp-remote-wizard')
export class EspRemoteWizard extends LitElement {
  @state() private name = 'espnow-remote';
  @state() private networkId = '';
  @state() private psk = '';
  @state() private ports: SerialPortInfo[] = [];
  @state() private selectedPort = '';
  @state() private scanningPorts = false;
  @state() private chipName = '';
  @state() private boardInfo: Record<string, string> | null = null;
  @state() private detecting = false;

  @state() private stage: 'config' | 'compiling' | 'ready' | 'flashing' | 'done' | 'error' = 'config';
  @state() private error = '';
  @state() private mac = '';
  @state() private esphomeName = '';
  @state() private compilePercent = 0;
  @state() private flashStatus = '';
  @state() private flashLog: string[] = [];
  @state() private secretsLoaded = false;

  private pollTimer: ReturnType<typeof setInterval> | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this.loadDefaults();
  }

  disconnectedCallback(): void {
    this.clearPoll();
    super.disconnectedCallback();
  }

  private clearPoll(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  /** Prefill the shared ESP-NOW network id/psk from secrets.yaml. */
  private async loadDefaults(): Promise<void> {
    try {
      const { content } = await api.getSecrets();
      const pick = (key: string): string => {
        const m = content.match(new RegExp(`^\\s*${key}\\s*:\\s*(.+)$`, 'm'));
        return m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
      };
      this.networkId = this.networkId || pick('espnow_network_id');
      this.psk = this.psk || pick('espnow_psk');
      this.secretsLoaded = true;
    } catch {
      // Not fatal: the user can type them.
    }
  }

  private async scanPorts(): Promise<void> {
    this.scanningPorts = true;
    try {
      const res = await api.getSerialPorts();
      this.ports = res.ports ?? [];
      const usable = this.ports.filter((p) => p.available);
      if (!this.selectedPort && usable.length > 0) this.selectedPort = usable[0].port;
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
    } finally {
      this.scanningPorts = false;
    }
  }

  private async detectChip(): Promise<void> {
    if (!this.selectedPort) return;
    this.detecting = true;
    this.error = '';
    try {
      const res = await api.detectChip(this.selectedPort);
      if (res.error || !res.board_info) {
        this.chipName = res.chip_name || 'unknown';
        this.boardInfo = null;
        this.error = res.error || `chip '${res.chip_name}' is not a supported board`;
        return;
      }
      this.chipName = res.chip_name;
      this.boardInfo = res.board_info;
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
    } finally {
      this.detecting = false;
    }
  }

  private canSubmit(): boolean {
    return Boolean(this.name.trim() && this.boardInfo && this.chipName && this.networkId.trim() && this.psk.trim());
  }

  private async submit(): Promise<void> {
    if (!this.canSubmit() || !this.boardInfo) return;
    this.error = '';
    this.stage = 'compiling';
    this.compilePercent = 0;
    try {
      const res = await api.submitFlashWizard({
        name: this.name.trim(),
        network_id: this.networkId.trim(),
        psk: this.psk.trim(),
        // A remote has no WiFi: leave these empty so nothing wifi-shaped is written.
        wifi_ssid: '',
        wifi_password: '',
        api_key: '',
        espnow_mode: 'lr',
        ota_password: '',
        chip_name: this.chipName,
        board_info: this.boardInfo,
        transport: 'espnow',
        kind: 'remote',
      });
      this.mac = res.mac;
      this.esphomeName = res.esphome_name;
      this.startCompilePoll();
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
      this.stage = 'error';
    }
  }

  private startCompilePoll(): void {
    this.clearPoll();
    this.pollTimer = setInterval(() => {
      void this.pollCompile();
    }, 3000);
    void this.pollCompile();
  }

  private async pollCompile(): Promise<void> {
    try {
      const status = await api.getFlashWizardStatus();
      const compile = status.compile_status ?? 'idle';
      // Percent is not always reported by the compile job; keep the last known
      // value rather than resetting it to 0 on every poll.
      if (typeof (status as { percent?: number }).percent === 'number') {
        this.compilePercent = (status as { percent?: number }).percent as number;
      }
      if (compile === 'compile_success' || compile === 'success') {
        this.clearPoll();
        this.stage = 'ready';
        return;
      }
      if (['failed', 'compile_failed', 'aborted', 'rejoin_timeout', 'version_mismatch'].includes(compile)) {
        this.clearPoll();
        this.error = `Compile finished as "${compile}" — check the queue page for the build log.`;
        this.stage = 'error';
      }
    } catch {
      // Keep polling through transient errors.
    }
  }

  private async startFlash(): Promise<void> {
    if (!this.selectedPort || !this.mac) return;
    this.stage = 'flashing';
    this.flashStatus = 'starting';
    this.flashLog = [];
    try {
      await api.startSerialFlash(this.mac, this.selectedPort);
      const es = api.streamSerialFlashLogs(
        this.mac,
        (line) => {
          this.flashLog = [...this.flashLog.slice(-200), line];
        },
        (status) => {
          this.flashStatus = status;
          if (status === 'success') {
            void this.finish();
          } else if (status === 'failed') {
            this.error = 'Serial flash failed — see the log below.';
            this.stage = 'error';
            es.close();
          }
        },
        () => {
          /* stream errors are non-fatal; status polling still applies */
        },
      );
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
      this.stage = 'error';
    }
  }

  /** Clear the synthetic placeholder; the real node appears once it joins. */
  private async finish(): Promise<void> {
    this.clearPoll();
    try {
      await api.finalizeFlashWizard();
    } catch {
      // The placeholder is cosmetic; the remote is added by topology upsert.
    }
    this.stage = 'done';
  }

  private goTopology(): void {
    window.location.hash = '/';
  }

  render() {
    const usablePorts = this.ports.filter((p) => p.available);
    return html`
      <section class="card">
        <div class="card-header">
          <h2>Create Remote</h2>
          <button class="btn" @click=${this.goTopology}>Back to topology</button>
        </div>
        <div class="card-body">
          ${this.error ? html`<div class="error">${this.error}</div>` : nothing}

          ${this.stage === 'config'
            ? html`
                <p class="hint">
                  Flashes a new ESP-NOW remote. It joins the bridge's network, so it uses the same
                  network ID and PSK as the bridge.
                </p>

                <label class="field">
                  <span>Device name</span>
                  <input
                    type="text"
                    .value=${this.name}
                    @input=${(e: Event) => { this.name = (e.target as HTMLInputElement).value; }}
                  />
                </label>

                <label class="field">
                  <span>Serial port</span>
                  <div class="row">
                    <select
                      .value=${this.selectedPort}
                      @change=${(e: Event) => { this.selectedPort = (e.target as HTMLSelectElement).value; }}
                    >
                      <option value="">— select a port —</option>
                      ${usablePorts.map(
                        (p) => html`<option value=${p.port} ?selected=${p.port === this.selectedPort}>${p.label || p.port}</option>`,
                      )}
                    </select>
                    <button class="btn" ?disabled=${this.scanningPorts} @click=${() => void this.scanPorts()}>
                      ${this.scanningPorts ? 'Scanning…' : 'Scan ports'}
                    </button>
                    <button class="btn" ?disabled=${this.detecting || !this.selectedPort} @click=${() => void this.detectChip()}>
                      ${this.detecting ? 'Detecting…' : 'Detect chip'}
                    </button>
                  </div>
                  ${this.chipName
                    ? html`<small class="ok-note">Detected: ${this.chipName}${this.boardInfo ? ` (${this.boardInfo.board})` : ''}</small>`
                    : nothing}
                </label>

                <details class="advanced" ?open=${!this.secretsLoaded}>
                  <summary>Network credentials</summary>
                  <label class="field">
                    <span>Network ID</span>
                    <input
                      type="text"
                      .value=${this.networkId}
                      @input=${(e: Event) => { this.networkId = (e.target as HTMLInputElement).value; }}
                    />
                  </label>
                  <label class="field">
                    <span>ESP-NOW PSK</span>
                    <input
                      type="text"
                      .value=${this.psk}
                      @input=${(e: Event) => { this.psk = (e.target as HTMLInputElement).value; }}
                    />
                  </label>
                  <p class="hint">Prefilled from secrets.yaml — must match the bridge or the remote cannot join.</p>
                </details>

                <button class="btn primary" ?disabled=${!this.canSubmit()} @click=${() => void this.submit()}>
                  Compile firmware
                </button>
              `
            : nothing}

          ${this.stage === 'compiling'
            ? html`
                <div class="status">
                  <div class="spinner"></div>
                  <div>
                    <strong>Compiling ${this.esphomeName}…${this.compilePercent > 0 ? ` ${this.compilePercent}%` : ''}</strong>
                    <p class="hint">This uses the add-on's own compiler. It can take a few minutes.</p>
                  </div>
                </div>
              `
            : nothing}

          ${this.stage === 'ready'
            ? html`
                <div class="status">
                  <strong>Firmware compiled.</strong>
                  <p class="hint">Connect the remote over USB and flash it now.</p>
                </div>
                <button class="btn primary" ?disabled=${!this.selectedPort} @click=${() => void this.startFlash()}>
                  Flash over serial
                </button>
                ${!this.selectedPort ? html`<p class="hint">Select a serial port first.</p>` : nothing}
              `
            : nothing}

          ${this.stage === 'flashing'
            ? html`
                <div class="status">
                  <div class="spinner"></div>
                  <div>
                    <strong>Flashing ${this.esphomeName}…</strong>
                    <p class="hint">Status: ${this.flashStatus}</p>
                  </div>
                </div>
                <pre class="log">${this.flashLog.join('\n')}</pre>
              `
            : nothing}

          ${this.stage === 'done'
            ? html`
                <div class="status ok">
                  <strong>${this.esphomeName} flashed.</strong>
                  <p class="hint">
                    Power the remote. Once it joins, the bridge reports it and it appears in the topology
                    view automatically.
                  </p>
                </div>
                <button class="btn primary" @click=${this.goTopology}>Go to topology</button>
              `
            : nothing}

          ${this.stage === 'error'
            ? html`
                <button class="btn" @click=${() => { this.stage = 'config'; this.error = ''; }}>Start over</button>
              `
            : nothing}
        </div>
      </section>
    `;
  }

  static styles = css`
    .card {
      background: var(--surface);
      border-radius: 12px;
      box-shadow: var(--shadow);
      border: 1px solid var(--line);
      margin-bottom: 20px;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--line);
    }

    .card-header h2 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }

    .card-body {
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 13px;
      font-weight: 500;
      color: var(--ink, #0f172a);
    }

    .row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    input,
    select {
      font: inherit;
      font-size: 14px;
      padding: 8px 10px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fff;
      color: var(--ink, #0f172a);
      min-width: 180px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid var(--line);
      background: var(--surface, #fff);
      color: var(--ink, #0f172a);
      cursor: pointer;
      min-height: 36px;
      white-space: nowrap;
    }

    .btn:hover:not(:disabled) {
      background: #f8fafc;
    }

    .btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .btn.primary {
      background: #0f766e;
      border-color: #0f766e;
      color: #fff;
    }

    .btn.primary:hover:not(:disabled) {
      background: #0d5f58;
    }

    .hint {
      margin: 0;
      color: var(--muted, #64748b);
      font-size: 13px;
      font-weight: 400;
      line-height: 1.5;
    }

    .ok-note {
      color: var(--ok, #15803d);
      font-weight: 500;
    }

    .error {
      background: #fef2f2;
      border: 1px solid var(--danger, #dc2626);
      color: var(--danger, #dc2626);
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 13px;
      font-weight: 400;
    }

    .status {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 14px;
    }

    .status.ok strong {
      color: var(--ok, #15803d);
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid var(--line);
      border-top-color: var(--primary, #0f766e);
      border-radius: 50%;
      animation: spin 0.9s linear infinite;
      flex-shrink: 0;
      margin-top: 2px;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .log {
      background: #0f172a;
      color: #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      font-size: 12px;
      max-height: 280px;
      overflow: auto;
      white-space: pre-wrap;
      margin: 0;
    }

    .advanced summary {
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      color: var(--ink, #0f172a);
      margin-bottom: 10px;
    }

    .advanced {
      display: flex;
      flex-direction: column;
      gap: 10px;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
    }
  `;
}
