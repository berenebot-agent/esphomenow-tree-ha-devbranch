import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ChipInfo, api } from '../api/client';

/**
 * Create Remote wizard.
 *
 * Flashes a brand-new ESP-NOW remote entirely in the browser: the add-on compiles
 * the firmware, then esp-web-tools writes it over Web Serial from the user's own
 * machine. No add-on serial port is involved, so this works when the remote is
 * plugged into the computer rather than the HA host.
 *
 * Deliberately separate from `setup-page.ts`: that wizard owns bridge provisioning
 * (a bridges row, WiFi credentials, a serial client), which a remote must not have.
 *
 * ESP-NOW credentials are read from the configured bridge rather than typed here,
 * because a remote whose network id/PSK differ from the bridge's simply cannot join.
 */
@customElement('esp-remote-wizard')
export class EspRemoteWizard extends LitElement {
  @state() private name = 'espnow-remote';
  @state() private chips: ChipInfo[] = [];
  @state() private chipName = '';
  @state() private loadingChips = false;
  @state() private detectingChip = false;
  @state() private chipDetectionError = '';
  @state() private detectedChipName = '';

  @state() private networkId = '';
  @state() private psk = '';
  @state() private bridgeName = '';
  @state() private credentialsComplete = false;
  @state() private networkIdSource = '';
  @state() private pskSource = '';
  @state() private credentialsMismatch = false;
  @state() private bridgeNetworkId = '';
  @state() private loadingCredentials = false;

  @state() private stage: 'config' | 'compiling' | 'ready' | 'flashing' | 'done' | 'error' = 'config';
  @state() private error = '';
  @state() private mac = '';
  @state() private esphomeName = '';
  @state() private compilePercent = 0;

  @state() private manifestUrl = '';
  @state() private firmwareBlobUrl = '';
  @state() private preparingManifest = false;
  @state() private usbSupported = true;

  private pollTimer: ReturnType<typeof setInterval> | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this.usbSupported = this.detectUsbSupport();
    void this.loadChips();
    void this.loadCredentials();
  }

  disconnectedCallback(): void {
    this.clearPoll();
    this.clearManifestUrls();
    super.disconnectedCallback();
  }

  private detectUsbSupport(): boolean {
    const nav = navigator as Navigator & { serial?: unknown };
    return Boolean(nav.serial) && window.isSecureContext;
  }

  /** Detect the connected chip from this browser, where the USB device is plugged in. */
  private async detectChip(): Promise<void> {
    this.chipDetectionError = '';
    this.detectedChipName = '';
    this.detectingChip = true;
    let transport: any = null;

    try {
      if (!this.detectUsbSupport()) {
        throw new Error('USB chip detection requires Chrome or Edge on a secure HTTPS page. You can select the chip manually instead.');
      }
      const serial = (navigator as Navigator & {
        serial?: { requestPort: () => Promise<unknown> };
      }).serial;
      if (!serial) throw new Error('Web Serial is not available. Select the chip manually instead.');

      // requestPort must run directly from this click so the browser can show its USB picker.
      const port = await serial.requestPort();
      const moduleUrl = 'https://unpkg.com/esptool-js@0.6.1/bundle.js';
      const esptool = await import(/* @vite-ignore */ moduleUrl);
      transport = new esptool.Transport(port, true);
      const loader = new esptool.ESPLoader({
        transport,
        baudrate: 115200,
        terminal: { clean: () => {}, writeLine: () => {}, write: () => {} },
        debugLogging: false,
      });
      const detected = String(await loader.main());
      const normalized = detected.trim().toUpperCase().replace(/\s+/g, '');
      const families = ['ESP32-C61', 'ESP32-C6', 'ESP32-C5', 'ESP32-C3', 'ESP32-C2', 'ESP32-H2', 'ESP32-P4', 'ESP32-S3', 'ESP32-S2', 'ESP32'];
      const family = families.find((candidate) =>
        normalized.includes(candidate) || normalized.includes(candidate.replace(/-/g, '')),
      );
      const supportedChip = family && this.chips.find((chip) => chip.chip_name.toUpperCase() === family);
      if (!family || !supportedChip) {
        throw new Error(`Detected ${detected}, but this chip is not in the supported firmware list. Choose a supported chip manually.`);
      }
      this.chipName = supportedChip.chip_name;
      this.detectedChipName = detected;
    } catch (err) {
      this.chipDetectionError = err instanceof Error ? err.message : String(err);
    } finally {
      if (transport) {
        try {
          await transport.disconnect();
        } catch {
          // Detection has completed; ignore errors while releasing the serial port.
        }
      }
      this.detectingChip = false;
    }
  }

  private clearPoll(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  /** esp-web-tools holds this URL until it flashes; revoke to avoid a leak. */
  private clearManifestUrls(): void {
    if (this.manifestUrl) {
      URL.revokeObjectURL(this.manifestUrl);
      this.manifestUrl = '';
    }
    if (this.firmwareBlobUrl) {
      URL.revokeObjectURL(this.firmwareBlobUrl);
      this.firmwareBlobUrl = '';
    }
  }

  private async loadChips(): Promise<void> {
    this.loadingChips = true;
    try {
      const res = await api.getChips();
      this.chips = res.chips ?? [];
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
    } finally {
      this.loadingChips = false;
    }
  }

  /** Credentials come from the configured bridge, not from user input. */
  private async loadCredentials(): Promise<void> {
    this.loadingCredentials = true;
    try {
      const res = await api.getBridgeNetworkCredentials();
      this.networkId = res.network_id ?? '';
      this.psk = res.psk ?? '';
      this.bridgeName = res.bridge_name ?? '';
      this.credentialsComplete = Boolean(res.complete);
      this.networkIdSource = res.network_id_source ?? '';
      this.pskSource = res.psk_source ?? '';
      this.credentialsMismatch = Boolean(res.mismatch);
      this.bridgeNetworkId = res.bridge_network_id ?? '';
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
    } finally {
      this.loadingCredentials = false;
    }
  }

  private get selectedChip(): ChipInfo | undefined {
    return this.chips.find((c) => c.chip_name === this.chipName);
  }

  private get chipFamily(): string | null {
    // The registry keys are already esp-web-tools families (ESP32-C6 etc).
    return this.chipName || null;
  }

  private canSubmit(): boolean {
    return Boolean(
      this.name.trim() && this.chipName && this.selectedChip && this.networkId.trim() && this.psk.trim(),
    );
  }

  private async submit(): Promise<void> {
    const chip = this.selectedChip;
    if (!this.canSubmit() || !chip) return;
    this.error = '';
    this.stage = 'compiling';
    this.compilePercent = 0;
    try {
      const res = await api.submitFlashWizard({
        name: this.name.trim(),
        // Send the resolved credentials back so the server can verify this remote is
        // joining the configured network. A remote never writes secrets.yaml.
        network_id: this.networkId.trim(),
        psk: this.psk.trim(),
        // A remote has no WiFi: leave these empty so nothing wifi-shaped is written.
        wifi_ssid: '',
        wifi_password: '',
        api_key: '',
        espnow_mode: 'lr',
        ota_password: '',
        chip_name: this.chipName,
        board_info: { platform: chip.platform, board: chip.board, framework: chip.framework },
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
      if (typeof (status as { percent?: number }).percent === 'number') {
        this.compilePercent = (status as { percent?: number }).percent as number;
      }
      if (compile === 'compile_success' || compile === 'success') {
        this.clearPoll();
        this.stage = 'ready';
        void this.prepareManifest();
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

  /**
   * Hand esp-web-tools the compiled factory image.
   *
   * The factory .bin is the full merged image (bootloader + partitions + app), which
   * is what a blank device needs; the .ota.bin is an update image and cannot be
   * flashed to empty flash. The manifest must be a blob URL because the ingress path
   * is not a stable absolute URL for the component to fetch back.
   */
  private async prepareManifest(): Promise<void> {
    if (!this.mac) return;
    const chipFamily = this.chipFamily;
    if (!chipFamily) {
      this.error = 'Could not determine the chip family for browser flashing.';
      return;
    }
    this.preparingManifest = true;
    try {
      const resp = await fetch(api.downloadFactoryBinary(this.mac));
      if (!resp.ok) {
        this.error =
          'Compiled, but no factory image is available for browser flashing. Check the queue page for the build log.';
        return;
      }
      const firmwareBlobUrl = URL.createObjectURL(await resp.blob());
      const manifest = {
        name: this.esphomeName || this.name.trim(),
        version: 'compiled',
        new_install_prompt_erase: true,
        builds: [{ chipFamily, parts: [{ path: firmwareBlobUrl, offset: 0 }] }],
      };
      const manifestUrl = URL.createObjectURL(
        new Blob([JSON.stringify(manifest)], { type: 'application/json' }),
      );
      this.clearManifestUrls();
      this.manifestUrl = manifestUrl;
      this.firmwareBlobUrl = firmwareBlobUrl;
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
    } finally {
      this.preparingManifest = false;
    }
  }

  /** esp-web-tools has finished writing the firmware. */
  private async onBrowserFlashDone(): Promise<void> {
    this.clearPoll();
    try {
      await api.finalizeFlashWizard();
    } catch {
      // The placeholder is cosmetic; the remote is added by topology upsert.
    }
    this.clearManifestUrls();
    this.stage = 'done';
  }

  private goTopology(): void {
    window.location.hash = '/';
  }

  private credentialsLabel(): string {
    if (this.loadingCredentials) return 'loading…';
    if (!this.credentialsComplete) return 'not configured';
    return this.bridgeName ? `from bridge ${this.bridgeName}` : 'from secrets.yaml';
  }

  private sourceLabel(source: string): string {
    if (!source || source === 'missing') return 'missing';
    return `from ${source}`;
  }

  render() {
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
                  Flashes a new ESP-NOW remote from this browser. Plug the remote into
                  <strong>this computer</strong> by USB — the add-on compiles the firmware, then
                  your browser writes it.
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
                  <span>Chip</span>
                  <select
                    .value=${this.chipName}
                    @change=${(e: Event) => {
                      this.chipName = (e.target as HTMLSelectElement).value;
                      this.detectedChipName = '';
                    }}
                    ?disabled=${this.loadingChips || this.chips.length === 0}
                  >
                    ${this.loadingChips
                      ? html`<option value="">Loading chips…</option>`
                      : html`<option value="">Select a chip…</option>`
                    }
                    ${this.chips.map(
                      (c) => html`<option value=${c.chip_name} ?selected=${c.chip_name === this.chipName}>
                            ${c.chip_name} — ${c.board}
                          </option>`,
                    )}
                  </select>
                  <small class="hint">Connect the remote to this computer by USB, then detect the chip automatically or select it manually.</small>
                </label>

                <div class="chip-detect">
                  <button class="btn" ?disabled=${this.detectingChip || this.loadingChips} @click=${() => void this.detectChip()}>
                    ${this.detectingChip ? 'Detecting chip…' : 'Detect connected chip'}
                  </button>
                  ${this.detectedChipName
                    ? html`<span class="hint">Detected ${this.detectedChipName}; selected ${this.chipName}.</span>`
                    : nothing}
                  ${this.chipDetectionError
                    ? html`<span class="hint warn-text">${this.chipDetectionError}</span>`
                    : nothing}
                  ${!this.usbSupported
                    ? html`<span class="hint">Automatic detection needs Chrome or Edge on a secure HTTPS page. Manual chip selection is available.</span>`
                    : nothing}
                </div>

                <div class="creds ${this.credentialsComplete ? 'ok' : 'warn'}">
                  <div class="creds-row">
                    <strong>Network</strong>
                    <span>${this.credentialsLabel()}</span>
                  </div>
                  ${this.credentialsComplete
                    ? html`<div class="creds-row">
                          <span>Network ID <small class="src">${this.sourceLabel(this.networkIdSource)}</small></span>
                          <code>${this.networkId}</code>
                        </div>
                        <div class="creds-row">
                          <span>PSK <small class="src">${this.sourceLabel(this.pskSource)}</small></span>
                          <code>••••••••</code>
                        </div>`
                    : html`<p class="hint">
                        No ESP-NOW credentials found${this.bridgeName
                          ? html` for bridge <strong>${this.bridgeName}</strong>`
                          : nothing}.
                        A remote cannot join without them — configure a bridge first, or add
                        <code>espnow_network_id</code> and <code>espnow_psk</code> to secrets.yaml.
                      </p>`}
                  ${this.credentialsComplete
                    ? html`<p class="hint">
                        Taken from secrets.yaml so the remote matches what the bridge is running.
                      </p>`
                    : nothing}
                  ${this.credentialsMismatch
                    ? html`<p class="hint warn-text">
                        Note: the saved bridge record says the network ID is
                        <code>${this.bridgeNetworkId}</code>, which disagrees with secrets.yaml.
                        The bridge firmware reads secrets.yaml, so that value is used here — but
                        the record is stale and worth correcting.
                      </p>`
                    : nothing}
                </div>

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
                    <strong
                      >Compiling ${this.esphomeName}…${this.compilePercent > 0
                        ? ` ${this.compilePercent}%`
                        : ''}</strong
                    >
                    <p class="hint">This uses the add-on's own compiler. It can take a few minutes.</p>
                  </div>
                </div>
              `
            : nothing}

          ${this.stage === 'ready'
            ? html`
                <div class="status">
                  <strong>Firmware compiled.</strong>
                  <p class="hint">Plug the remote into this computer by USB, then flash it below.</p>
                </div>
                ${this.preparingManifest
                  ? html`<div class="status"><div class="spinner"></div><span>Preparing firmware…</span></div>`
                  : nothing}
                ${this.manifestUrl
                  ? html`
                      <esp-web-install-button manifest=${this.manifestUrl} @state-changed=${(e: Event) => {
                        const detail = (e as CustomEvent<{ state: string }>).detail;
                        if (detail?.state === 'FINISHED') void this.onBrowserFlashDone();
                      }}>
                        <button slot="activate" class="btn primary">Flash via Browser USB</button>
                        <span slot="unsupported"
                          >Open this page in Chrome or Edge over HTTPS to use browser USB flashing.</span
                        >
                        <span slot="not-allowed">Browser USB flashing requires a secure HTTPS page.</span>
                      </esp-web-install-button>
                    `
                  : nothing}
                ${!this.usbSupported
                  ? html`<div class="error">
                      This browser cannot flash over USB. Open the add-on in Chrome or Edge over HTTPS.
                    </div>`
                  : nothing}
                <div class="actions">
                  <button class="btn" @click=${() => void this.onBrowserFlashDone()}>
                    I've flashed it
                  </button>
                </div>
                <p class="hint">
                  The button above writes the firmware from this computer. If your browser cannot,
                  use the compiled .bin with your own tool, then continue.
                </p>
              `
            : nothing}

          ${this.stage === 'done'
            ? html`
                <div class="status ok">
                  <strong>${this.esphomeName} flashed.</strong>
                  <p class="hint">
                    Power the remote. Once it joins, the bridge reports it and it appears in the
                    topology view automatically.
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

    .chip-detect {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
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

    .creds {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 13px;
    }

    .creds.ok {
      border-color: #bbf7d0;
      background: #f0fdf4;
    }

    .creds.warn {
      border-color: #fed7aa;
      background: #fffbeb;
    }

    .creds-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .creds-row code {
      font-size: 12px;
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 2px 6px;
      max-width: 240px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .src {
      color: var(--muted, #64748b);
      font-size: 11px;
    }

    .warn-text {
      color: #b45309;
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

    .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
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
  `;
}
