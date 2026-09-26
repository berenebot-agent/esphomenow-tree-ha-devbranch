import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '../components/config-editor';
import '../components/compile-log-viewer';
import { hasEspTreeExternalComponents } from '../components/config-editor';
import { api, CompileStatusResponse, DeviceConfig, normalizeMac, PreflightComparison } from '../api/client';
import { chipFamilyFromName, openInstallDialog, usbFlashSupported } from '../lib/browser-flash';

type PageState = 'loading' | 'no_config' | 'editor';
type CompilePhase = 'idle' | 'compile_queued' | 'compiling' | 'compiled' | 'failed' | 'queued_for_flash';
type FlashIntent = 'none' | 'ota' | 'browser';
const FLASH_STATUSES = new Set(['queued', 'starting', 'announcing', 'transferring', 'verifying', 'transfer_success_waiting_rejoin']);
const FLASH_TERMINAL_STATUSES = new Set(['success', 'failed', 'aborted', 'rejoin_timeout', 'version_mismatch']);

function chipFamilyFromYaml(yaml: string): string | null {
  const text = yaml || '';
  if (/^\s*esp8266\s*:/m.test(text)) return 'ESP8266';
  if (!/^\s*esp32\s*:/m.test(text)) return null;
  const variantMatch = text.match(/^\s*variant\s*:\s*["']?([A-Za-z0-9_-]+)["']?\s*$/m);
  const variant = (variantMatch?.[1] || '').toUpperCase().replace(/_/g, '-');
  if (!variant) return 'ESP32';
  if (variant.includes('ESP32-C61')) return 'ESP32-C61';
  if (variant.includes('ESP32-C6')) return 'ESP32-C6';
  if (variant.includes('ESP32-C5')) return 'ESP32-C5';
  if (variant.includes('ESP32-C3')) return 'ESP32-C3';
  if (variant.includes('ESP32-C2')) return 'ESP32-C2';
  if (variant.includes('ESP32-H2')) return 'ESP32-H2';
  if (variant.includes('ESP32-P4')) return 'ESP32-P4';
  if (variant.includes('ESP32-S3')) return 'ESP32-S3';
  if (variant.includes('ESP32-S2')) return 'ESP32-S2';
  return 'ESP32';
}

@customElement('esp-config-page')
export class EspConfigPage extends LitElement {
  @property({ type: String }) mac = '';
  @state() private state: PageState = 'loading';
  @state() private device: Record<string, unknown> | null = null;
  @state() private config: DeviceConfig | null = null;
  @state() private editorContent = '';
  @state() private saveIndicator = '';
  @state() private hasUnsavedChanges = false;
  @state() private error = '';
  @state() private compilePhase: CompilePhase = 'idle';
  @state() private topology: { mac: string; online?: boolean }[] = [];
  @state() private compileJobId: number | null = null;
  @state() private compileQueuePosition: number | null = null;
  @state() private preflight: PreflightComparison | null = null;
  @state() private chipUnknown = false;
  @state() private yamlWarnings: string[] = [];
  @state() private showExternalComponentsFix = false;
  @state() private showSecretsWarning = false;
  @state() private missingSecrets: string[] = [];
  private pendingAction: 'save' | 'compile' | null = null;
  private pendingAutoFlash = false;
  @state() private showCompileLog = true;
  @state() private compileStartedAt: number | null = null;
  @state() private flashIntent: FlashIntent = 'none';
  @state() private browserFlashManifestUrl = '';
  @state() private browserFlashError = '';
  @state() private browserFlashOpen = false;
  private browserFlashFirmwareBlobUrl = '';
  private elapsedTimer: ReturnType<typeof setInterval> | null = null;
  @query('esp-compile-log-viewer') private compileLogViewer!: HTMLElement | null;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private devicePollTimer: ReturnType<typeof setInterval> | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    void this.load();
  }

  disconnectedCallback(): void {
    this.stopPolling();
    this.stopDevicePolling();
    super.disconnectedCallback();
  }

  private startPolling(): void {
    if (this.pollTimer) return;
    this.pollTimer = setInterval(() => this.pollCompileStatus(), 2000);
  }

  private stopPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private stopCompileLogViewer(): void {
    if (this.compileLogViewer) {
      (this.compileLogViewer as any).stopped = true;
    }
  }

  private startDevicePolling(): void {
    if (this.devicePollTimer) return;
    this.devicePollTimer = setInterval(() => void this.pollDevice(), 30_000);
  }

  private stopDevicePolling(): void {
    if (this.devicePollTimer) {
      clearInterval(this.devicePollTimer);
      this.devicePollTimer = null;
    }
  }

  private async pollDevice(): Promise<void> {
    try {
      const dev = await api.device(this.mac);
      this.device = dev || {};
    } catch {
      // ignore poll errors
    }
  }

  private get isCompilingActive(): boolean {
    return this.compilePhase === 'compiling' || this.compilePhase === 'compile_queued';
  }

  private get browserSupportsUsbFlash(): boolean {
    return usbFlashSupported();
  }

  private get browserFlashChipFamily(): string | null {
    const chipName = String(this.preflight?.chip.new || this.device?.chip_name || '');
    return chipFamilyFromYaml(this.editorContent) || chipFamilyFromName(chipName);
  }

  private getElapsedTime(): string {
    if (!this.compileStartedAt) return '00:00';
    const elapsed = Math.floor((Date.now() - this.compileStartedAt) / 1000);
    const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const secs = (elapsed % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  private startElapsedTimer(): void {
    this.stopElapsedTimer();
    this.elapsedTimer = setInterval(() => this.requestUpdate(), 1000);
  }

  private stopElapsedTimer(): void {
    if (this.elapsedTimer) {
      clearInterval(this.elapsedTimer);
      this.elapsedTimer = null;
    }
  }

  private async load(): Promise<void> {
    this.state = 'loading';
    try {
      const [dev, configData, topology] = await Promise.all([
        api.device(this.mac).catch(() => null),
        api.getConfig(this.mac).catch(() => null),
        api.topology().catch(() => []),
      ]);
      this.device = dev || {};
      this.topology = topology;
      this.startDevicePolling();
      if (configData && (configData as DeviceConfig).has_config) {
        this.config = configData as DeviceConfig;
        this.editorContent = this.config.content;
        this.hasUnsavedChanges = false;
        this.state = 'editor';
      } else {
        this.state = 'no_config';
      }
      await this.pollCompileStatus();
    } catch {
      this.state = 'no_config';
    }
  }

  private clearBrowserFlashManifestUrl(): void {
    if (this.browserFlashManifestUrl) {
      URL.revokeObjectURL(this.browserFlashManifestUrl);
      this.browserFlashManifestUrl = '';
    }
    if (this.browserFlashFirmwareBlobUrl) {
      URL.revokeObjectURL(this.browserFlashFirmwareBlobUrl);
      this.browserFlashFirmwareBlobUrl = '';
    }
  }

  private async updateBrowserFlashManifestUrl(): Promise<void> {
    if (this.compilePhase !== 'compiled') return;
    const chipFamily = this.browserFlashChipFamily;
    if (!chipFamily) {
      this.clearBrowserFlashManifestUrl();
      return;
    }
    try {
      const downloadUrl = api.downloadFactoryBinary(this.mac);
      const resp = await fetch(downloadUrl);
      if (!resp.ok) {
        this.clearBrowserFlashManifestUrl();
        return;
      }
      const firmwareBlob = await resp.blob();
      const newFirmwareBlobUrl = URL.createObjectURL(firmwareBlob);
      const manifest = {
        name: String(this.device?.esphome_name || this.device?.label || this.mac),
        version: String(this.device?.project_version || this.device?.firmware_version || 'compiled'),
        // No erase prompt: this is a factory image reflashed from the device's own
        // page, and the dialog's "Erase device?" step is a second question for a
        // decision the user already made by pressing Compile and Flash. The dialog
        // erases without asking when this is false and the device has no Improv.
        new_install_prompt_erase: false,
        // The firmware implements no Improv (no `improv_serial:` anywhere in
        // device_code/), so the dialog's post-write Improv probe can only ever time
        // out. 0 skips it instead of stalling for the 10 s default.
        new_install_improv_wait_time: 0,
        builds: [
          {
            chipFamily,
            parts: [{ path: newFirmwareBlobUrl, offset: 0 }],
          },
        ],
      };
      const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
      const newManifestUrl = URL.createObjectURL(manifestBlob);
      this.clearBrowserFlashManifestUrl();
      this.browserFlashManifestUrl = newManifestUrl;
      this.browserFlashFirmwareBlobUrl = newFirmwareBlobUrl;
    } catch {
      this.clearBrowserFlashManifestUrl();
    }
  }

  private async pollCompileStatus(): Promise<void> {
    try {
      const status: CompileStatusResponse = await api.getCompileStatus(this.mac);
      if (status.status === 'compile_queued') {
        this.compilePhase = 'compile_queued';
        this.compileJobId = status.job_id;
        this.compileQueuePosition = status.queue_position;
        this.startPolling();
      } else if (status.status === 'compiling') {
        this.compilePhase = 'compiling';
        this.compileJobId = status.job_id;
        this.compileQueuePosition = null;
        this.startPolling();
      } else if (FLASH_STATUSES.has(status.status)) {
        this.compilePhase = 'queued_for_flash';
        this.compileJobId = status.job_id;
        this.compileQueuePosition = status.queue_position;
        this.flashIntent = 'ota';
        this.startPolling();
        window.location.hash = `/device/${encodeURIComponent(this.mac)}`;
      } else if (status.status === 'compiled') {
        this.compilePhase = 'compiled';
        this.compileJobId = status.job_id;
        this.compileQueuePosition = null;
        this.stopElapsedTimer();
        this.updateBrowserFlashManifestUrl();
        this.stopPolling();
        if (this.flashIntent === 'ota') {
          window.location.hash = `/device/${encodeURIComponent(this.mac)}`;
        }
      } else if (FLASH_TERMINAL_STATUSES.has(status.status)) {
        this.compilePhase = 'idle';
        this.compileJobId = null;
        this.compileQueuePosition = null;
        this.compileStartedAt = null;
        this.flashIntent = 'none';
        this.clearBrowserFlashManifestUrl();
        this.stopElapsedTimer();
        this.stopPolling();
        this.stopCompileLogViewer();
      }
    } catch {
      // ignore poll errors
    }
  }

  private async createScaffold(): Promise<void> {
    try {
      const result = await api.saveConfig(this.mac, '', true);
      this.config = result;
      this.editorContent = result.content;
      this.chipUnknown = result.chip_unknown ?? false;
      this.state = 'editor';
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
    }
  }

  private async importYaml(): Promise<void> {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.yaml,.yml';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const result = await api.importConfig(this.mac, file);
        this.config = result;
        this.editorContent = result.content;
        this.state = 'editor';
      } catch (err) {
        this.error = err instanceof Error ? err.message : String(err);
      }
    };
    input.click();
  }

  private async saveConfig(bypassCheck = false): Promise<void> {
    if (!bypassCheck && !hasEspTreeExternalComponents(this.editorContent)) {
      this.pendingAction = 'save';
      this.showExternalComponentsFix = true;
      return;
    }
    this.saveIndicator = 'Saving...';
    try {
      const result = await api.saveConfig(this.mac, this.editorContent);
      this.config = result;
      this.hasUnsavedChanges = false;
      this.saveIndicator = 'Saved ✓';
      setTimeout(() => { this.saveIndicator = ''; this.requestUpdate(); }, 2000);
    } catch (err) {
      this.saveIndicator = '';
      this.error = err instanceof Error ? err.message : String(err);
    }
  }

  private onEditorChange(e: CustomEvent): void {
    const detail = e.detail as { content: string; warnings?: string[] };
    this.editorContent = detail.content;
    this.yamlWarnings = detail.warnings ?? [];
    this.hasUnsavedChanges = this.config ? this.editorContent !== this.config.content : true;
  }

  private get isBridgeDevice(): boolean {
    return Boolean((this.device as { is_bridge?: boolean })?.is_bridge);
  }

  private get isEsp8266Device(): boolean {
    const chipName = String(this.device?.chip_name ?? '');
    return chipName === 'ESP8266' || chipName === 'ESP-01' || chipName === 'ESP-12E';
  }

  private get remoteComponentName(): string {
    if (this.isBridgeDevice) return 'esp_tree_bridge';
    if (this.isEsp8266Device) return 'espnow_82xx_remote';
    return 'esp_tree_remote';
  }

  private get externalComponentsFixYaml(): string {
    const component = this.remoteComponentName;
    return `external_components:\n  - source:\n      type: local\n      path: /opt/esp-tree/components\n    components: [${component}, esp_tree_common]`;
  }

  private insertExternalComponentsFix(): void {
    const component = this.remoteComponentName;
    const block = `\nexternal_components:\n  - source:\n      type: local\n      path: /opt/esp-tree/components\n    components: [${component}, esp_tree_common]\n`;
    let text = this.editorContent;

    text = this.removeExternalComponentsBlock(text);

    const lines = text.split('\n');
    let insertIdx = this.findBlockEnd(lines, /^esphome:\s*$/);
    if (insertIdx < 0) insertIdx = 0;

    const chipEnd = this.findBlockEnd(lines, /^(esp32|esp8266):\s*$/, insertIdx);
    if (chipEnd > insertIdx) insertIdx = chipEnd;

    while (insertIdx < lines.length && lines[insertIdx].trim() === '') insertIdx++;
    lines.splice(insertIdx, 0, ...block.split('\n'));
    this.editorContent = lines.join('\n');
  }

  private removeExternalComponentsBlock(text: string): string {
    const lines = text.split('\n');
    const startIdx = lines.findIndex((l) => /^external_components:\s*$/.test(l));
    if (startIdx < 0) return text;
    let endIdx = startIdx + 1;
    while (endIdx < lines.length && (lines[endIdx].startsWith(' ') || lines[endIdx].startsWith('\t') || lines[endIdx].trim() === '')) {
      if (lines[endIdx].trim() === '' && endIdx + 1 < lines.length && !lines[endIdx + 1].startsWith(' ') && !lines[endIdx + 1].startsWith('\t')) break;
      endIdx++;
    }
    while (endIdx < lines.length && lines[endIdx].trim() === '') endIdx++;
    lines.splice(startIdx, endIdx - startIdx);
    return lines.join('\n');
  }

  private findBlockEnd(lines: string[], headerRe: RegExp, searchFrom = 0): number {
    const start = lines.findIndex((l, i) => i >= searchFrom && headerRe.test(l));
    if (start < 0) return -1;
    let end = start + 1;
    while (end < lines.length && (lines[end].startsWith(' ') || lines[end].startsWith('\t'))) end++;
    return end;
  }

  private async applyExternalComponentsFix(): Promise<void> {
    this.showExternalComponentsFix = false;
    this.insertExternalComponentsFix();
    this.yamlWarnings = [];
    this.hasUnsavedChanges = true;
    this.requestUpdate();
    const action = this.pendingAction;
    const autoFlash = this.pendingAutoFlash;
    this.pendingAction = null;
    this.pendingAutoFlash = false;
    if (action === 'save') {
      await this.saveConfig(true);
    } else if (action === 'compile') {
      await this.queueCompile(autoFlash, true);
    }
  }

  private async dismissExternalComponentsFix(): Promise<void> {
    this.showExternalComponentsFix = false;
    const action = this.pendingAction;
    const autoFlash = this.pendingAutoFlash;
    this.pendingAction = null;
    this.pendingAutoFlash = false;
    if (action === 'save') {
      await this.saveConfig(true);
    } else if (action === 'compile') {
      await this.queueCompile(autoFlash, true);
    }
  }

  private async dismissSecretsWarning(): Promise<void> {
    this.showSecretsWarning = false;
    const action = this.pendingAction;
    const autoFlash = this.pendingAutoFlash;
    this.pendingAction = null;
    this.pendingAutoFlash = false;
    if (action === 'compile') {
      await this.queueCompile(autoFlash, true);
    }
  }

  private goToSecretsFromWarning(): void {
    this.showSecretsWarning = false;
    this.goToSecrets();
  }

  private async checkForMissingSecrets(): Promise<string[]> {
    try {
      const result = await api.checkSecrets(this.editorContent);
      return result.missing_secrets;
    } catch {
      return [];
    }
  }

  private async queueCompile(autoFlash: boolean, bypassCheck = false): Promise<void> {
    if (this.compilePhase === 'compiling' || this.compilePhase === 'compile_queued') return;
    if (!bypassCheck) {
      const missing = await this.checkForMissingSecrets();
      if (missing.length > 0) {
        this.missingSecrets = missing;
        this.pendingAction = 'compile';
        this.pendingAutoFlash = autoFlash;
        this.showSecretsWarning = true;
        return;
      }
    }
    if (!bypassCheck && !hasEspTreeExternalComponents(this.editorContent)) {
      this.pendingAction = 'compile';
      this.pendingAutoFlash = autoFlash;
      this.showExternalComponentsFix = true;
      return;
    }
    if (this.hasUnsavedChanges) {
      await this.saveConfig(true);
    }
    this.compilePhase = 'compiling';
    this.compileStartedAt = Date.now();
    this.startElapsedTimer();
    this.error = '';
    this.showCompileLog = true;

    try {
      const result = await api.compileDevice(this.mac, autoFlash);
      this.compileJobId = result.job.id;
      this.preflight = result.preflight || null;
      if (result.job.status === 'compile_queued') {
        this.compilePhase = 'compile_queued';
        this.compileQueuePosition = result.queue_position;
      } else if (result.job.status === 'compiling') {
        this.compilePhase = 'compiling';
        this.compileQueuePosition = null;
      }
      this.startPolling();
    } catch (err) {
      this.compilePhase = 'failed';
      this.compileStartedAt = null;
      this.stopElapsedTimer();
      this.error = err instanceof Error ? err.message : String(err);
    }
  }

  private async triggerCompile(): Promise<void> {
    this.flashIntent = 'none';
    await this.queueCompile(false);
  }

  private async triggerOtaFlash(): Promise<void> {
    this.flashIntent = 'ota';
    await this.queueCompile(true);
  }

  private async triggerBrowserFlashFlow(): Promise<void> {
    this.flashIntent = 'browser';
    await this.queueCompile(false);
  }

  /**
   * Open the install dialog against this page's compiled factory image.
   *
   * Called from a click so the requestPort() fallback still has its user activation;
   * when the chip was already detected earlier in the session the port is passed
   * straight in and the browser shows no second chooser.
   */
  private async openBrowserFlash(): Promise<void> {
    if (!this.browserFlashManifestUrl) return;
    this.browserFlashError = '';
    try {
      const result = await openInstallDialog({
        manifestUrl: this.browserFlashManifestUrl,
        onClosed: () => this.onBrowserFlashClosed(),
      });
      if (result === 'cancelled') {
        this.browserFlashError = 'No USB device was selected.';
        return;
      }
      this.browserFlashOpen = true;
    } catch (err) {
      this.browserFlashError = err instanceof Error ? err.message : String(err);
    }
  }

  private onBrowserFlashClosed(): void {
    this.browserFlashOpen = false;
  }

  private async cancelCompile(): Promise<void> {
    try {
      await api.cancelCompile(this.mac);
    } catch {
      // no active job to cancel — fall through to local reset
    }
    this.compilePhase = 'idle';
    this.compileJobId = null;
    this.compileQueuePosition = null;
    this.compileStartedAt = null;
    this.flashIntent = 'none';
    this.clearBrowserFlashManifestUrl();
    this.stopElapsedTimer();
    this.stopPolling();
  }

  private goBack(): void {
    window.location.hash = `/device/${encodeURIComponent(this.mac)}`;
  }

  private goToTopology(): void {
    window.location.hash = '/';
  }

  private goToSecrets(): void {
    window.location.hash = `/secrets?from=${encodeURIComponent(window.location.hash)}`;
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (
      changedProperties.has('compilePhase') ||
      changedProperties.has('device') ||
      changedProperties.has('preflight')
    ) {
      void this.updateBrowserFlashManifestUrl();
    }
  }

  render() {
    const esphomeName = String(this.device?.esphome_name || this.device?.label || this.mac);
    const chipName = String(this.device?.chip_name || '-');
    const topologyNode = this.topology.find((n) => normalizeMac(n.mac) === normalizeMac(this.mac));
    const online = topologyNode?.online ?? Boolean(this.device?.online);
    const dev = this.device as { is_bridge?: boolean; hops?: number };
    const isBridge = Boolean(dev?.is_bridge);
    const isRemote = !isBridge && (dev?.hops ?? 0) > 0;
    const chipFamily = this.browserFlashChipFamily;
    const showBrowserFlashInstall = this.compilePhase === 'compiled' && !!this.browserFlashManifestUrl;

    return html`
      <div class="config-page" data-job-id=${this.compileJobId ?? ''}>
        ${this.showExternalComponentsFix
          ? html`
              <div class="ec-fix-backdrop" @click=${this.dismissExternalComponentsFix}>
                <div class="ec-fix-modal" @click=${(e: Event) => e.stopPropagation()}>
                  <h3>ESP-Tree External Components Required</h3>
                  <p>Your configuration is missing the required <code>external_components</code> block. ESP-Tree devices need the following:</p>
                  <pre class="ec-fix-snippet">${this.externalComponentsFixYaml}</pre>
                  <p class="ec-fix-hint">This must be present for ESP-Tree components to compile correctly.</p>
                  <div class="ec-fix-actions">
                    <button class="btn btn-primary" @click=${this.applyExternalComponentsFix}>Apply Fix</button>
                    <button class="btn" @click=${this.dismissExternalComponentsFix}>Cancel</button>
                  </div>
                </div>
              </div>
            `
          : nothing}
        ${this.showSecretsWarning
          ? html`
              <div class="ec-fix-backdrop" @click=${this.dismissSecretsWarning}>
                <div class="ec-fix-modal" @click=${(e: Event) => e.stopPropagation()}>
                  <h3>Missing Secrets Warning</h3>
                  <p>Your configuration references secrets that are not defined in secrets.yaml:</p>
                  <ul class="missing-secrets-list">
                    ${this.missingSecrets.map((s) => html`<li><code>!secret ${s}</code></li>`)}
                  </ul>
                  <p class="ec-fix-hint">Add these secrets to your secrets.yaml file before compiling.</p>
                  <div class="ec-fix-actions">
                    <button class="btn" @click=${this.dismissSecretsWarning}>Try Anyway</button>
                    <button class="btn btn-primary" @click=${this.goToSecretsFromWarning}>Edit Secrets</button>
                  </div>
                </div>
              </div>
            `
          : nothing}
        <header class="config-header">
          <div class="back-buttons">
            <button class="back" @click=${this.goToTopology}>&#8592; Back to Topology</button>
            <button class="back" @click=${this.goBack}>&#8592; Back to Device Settings</button>
          </div>
          <div class="header-info">
            <h2>${esphomeName}${isRemote ? html`<span class="device-type-tag">Remote</span>` : nothing}</h2>
            <p>${this.mac} &middot; ${chipName} &middot; <span class=${online ? 'ok' : 'danger'}>${online ? 'online' : 'offline'}</span></p>
          </div>
          <button class="btn btn-edit-config" @click=${this.goToSecrets}>Secrets &#9881;</button>
        </header>

        ${this.state === 'loading'
          ? html`<div class="card">Loading config...</div>`
          : this.state === 'no_config'
            ? html`
                <div class="card no-config">
                  ${this.chipUnknown ? html`
                    <div class="chip-error-banner">
                      <span>&#9888; Unsupported chip type detected. Ensure correct chip type is entered in topology settings before compiling.</span>
                      <button class="dismiss-btn" @click=${() => { this.chipUnknown = false; }}>&#10005;</button>
                    </div>
                  ` : nothing}
                  <h3>No configuration yet for this device.</h3>
                  <div class="no-config-actions">
                    <button class="btn btn-primary" @click=${this.createScaffold}>Create Config</button>
                    <button class="btn" @click=${this.importYaml}>Import YAML</button>
                  </div>
                  <p class="hint">Create Config generates a minimal scaffold populated from this device's topology data.</p>
                  <p class="hint">Import lets you upload an existing YAML file.</p>
                  ${this.error ? html`<p class="error">${this.error}</p>` : nothing}
                </div>
              `
: this.state === 'editor'
                ? html`
                    <div class="main-content">
                    ${!this.isCompilingActive
                      ? html`
                          <esp-config-editor
                            .value=${this.editorContent}
                            .readonly=${false}
                            @content-change=${this.onEditorChange}
                          ></esp-config-editor>

                          ${this.yamlWarnings.length > 0
                            ? html`<div class="yaml-warnings">${this.yamlWarnings.map((w) => html`<p>&#9888; ${w}</p>`)}</div>`
                            : nothing}
                        `
                      : html`
                          <div class="compile-focus-view">
                            <div class="compile-status-header">
                              <span class="compile-spinner">&#9696;</span>
                              <span>${this.compilePhase === 'compile_queued'
                                ? `Queued at position ${this.compileQueuePosition !== null ? this.compileQueuePosition : '?'}`
                                : 'Compiling firmware...'}</span>
                              <span class="compile-elapsed">${this.getElapsedTime()}</span>
                            </div>
                            <esp-compile-log-viewer
                              .mac=${this.mac}
                              .visible=${true}
                              class="expanded-log"
                            ></esp-compile-log-viewer>
                          </div>
                        `
                    }
                    </div>

                    <esp-compile-log-viewer
                      .mac=${this.mac}
                      .visible=${(this.compilePhase === 'queued_for_flash' || this.compilePhase === 'failed') && this.showCompileLog}
                      class="bottom-log"
                    ></esp-compile-log-viewer>

                    ${this.compilePhase === 'compile_queued'
                    ? html`
                        <div class="queue-banner">
                          <strong>&#9203; Position ${this.compileQueuePosition !== null ? this.compileQueuePosition : '?'} in compile queue</strong>
                          <small>Waiting for compile slot...</small>
                          <button class="cancel-btn" @click=${this.cancelCompile}>Cancel</button>
                        </div>
                      `
                    : nothing}

                  <div class="action-bar">
                    <button class="btn btn-primary" @click=${this.saveConfig} ?disabled=${this.compilePhase === 'compiling' || this.compilePhase === 'compile_queued'}>
                      ${this.saveIndicator || (this.hasUnsavedChanges ? 'Save' : 'Saved ✓')}
                    </button>
                    ${this.compilePhase === 'idle' || this.compilePhase === 'failed' || this.compilePhase === 'compiled'
                      ? html`
                          <button class="btn btn-success" ?disabled=${!this.config} @click=${this.triggerCompile}>Compile</button>
                          <button class="btn btn-primary" ?disabled=${!this.config} @click=${this.triggerOtaFlash}>Compile and Flash (OTA)</button>
                          <button class="btn" ?disabled=${!this.config} @click=${this.triggerBrowserFlashFlow}>Compile and Flash (USB via Browser)</button>
                        `
                      : this.compilePhase === 'compiling' || this.compilePhase === 'compile_queued'
                        ? html`<button class="btn btn-danger" @click=${this.cancelCompile}>Cancel</button>`
                        : nothing
                    }
                  </div>

                  <div class="browser-flash-panel">
                    ${showBrowserFlashInstall
                      ? html`
                          <div class="browser-flash-actions">
                            <button
                              class="btn btn-primary"
                              ?disabled=${this.browserFlashOpen}
                              @click=${this.openBrowserFlash}
                            >
                              ${this.browserFlashOpen ? 'Flashing…' : 'Flash via Browser USB'}
                            </button>
                            <a class="btn" href=${api.downloadFactoryBinary(this.mac)} download>Download factory .bin</a>
                          </div>
                          ${this.browserFlashError
                            ? html`<p class="browser-flash-error">${this.browserFlashError}</p>`
                            : nothing}
                        `
                      : html`
                          <div class="browser-flash-hint">
                            ${this.compilePhase === 'compiled' && !chipFamily
                              ? html`<p>Browser USB flash is unavailable because the chip family could not be determined for this build.</p>`
                              : !this.browserSupportsUsbFlash
                                ? html`<p>Browser USB flash requires Chrome or Edge with Web Serial on an HTTPS page.</p>`
                                : html`<p>Compile the device first, then flash the resulting firmware through your browser here.</p>`}
                            <a class="btn" href=${api.downloadFactoryBinary(this.mac)} download ?hidden=${this.compilePhase !== 'compiled'}>Download factory .bin</a>
                          </div>
                        `}
                  </div>

                  ${this.compilePhase === 'compiling'
                    ? html`<p class="status-line">Status: compiling... <button class="cancel-link" @click=${this.cancelCompile}>Cancel</button></p>`
                    : this.compilePhase === 'compile_queued'
                      ? html`<p class="status-line">Status: waiting to compile (#${this.compileQueuePosition !== null ? this.compileQueuePosition : '?'})</p>`
                      : this.compilePhase === 'queued_for_flash'
                        ? html`<p class="status-line">Status: OTA flash queued or running${this.compileQueuePosition !== null ? ` (#${this.compileQueuePosition})` : ''}</p>`
                      : html`<p class="status-line">Status: ${this.hasUnsavedChanges ? 'unsaved' : 'saved'}</p>`
                  }

                  ${this.error && this.compilePhase !== 'compiling'
                    ? html`<p class="error">${this.error}</p>`
                    : nothing}

                  ${this.compilePhase === 'compiled'
                    ? html`
                        <div class="success-section">
                          <div class="success-banner">&#10003; Build successful</div>
                          <p class="build-info">${esphomeName} &middot; ready for flash</p>
                          ${this.preflight?.has_warnings
                            ? html`
                                <div class="warnings">
                                  ${this.preflight!.warnings.map((w) => html`<p>${w}</p>`)}
                                </div>
                              `
                            : nothing}
                          ${this.flashIntent === 'browser'
                            ? html`<p class="hint">Build complete. Connect the device by USB and use the browser flash control above.</p>`
                            : html`<p class="hint">Firmware compiled. Use OTA or browser USB flash from the action bar above.</p>`}
                          <div class="download-links">
                            <a class="btn" href=${api.downloadFactoryBinary(this.mac)} download>Download .bin</a>
                            <a class="btn" href=${api.downloadCompileBinary(this.mac)} download>Download .ota.bin</a>
                          </div>
                        </div>
                      `
                    : nothing}

                  ${this.compilePhase === 'failed'
                    ? html`
                        <div class="fail-section">
                          <div class="fail-banner">
                            <span>&#10007; Build failed</span>
                            ${this.showCompileLog ? html`<button class="close-logs-link" @click=${() => { this.showCompileLog = false; }}>Hide logs</button>` : html`<button class="close-logs-link" @click=${() => { this.showCompileLog = true; }}>Show logs</button>`}
                          </div>
                          <p class="hint">Fix the YAML above and try again. <button class="btn-link" @click=${this.cancelCompile}>Cancel</button></p>
                        </div>
                      `
                    : nothing}
                `
              : nothing}
      </div>
    `;
  }

  static styles = css`
    .config-page {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      color: var(--ink);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .config-header {
      display: flex;
      align-items: end;
      gap: 16px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--line);
    }
    .back-buttons {
      display: flex;
      gap: 8px;
    }
    .back {
      border: 1px solid var(--line);
      background: var(--surface);
      min-height: 36px;
      padding: 0 14px;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.12s;
    }
    .back:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }
    .header-info {
      flex: 1;
      min-width: 0;
    }
    .header-info h2 {
      margin: 0;
      font-size: clamp(18px, 2.5vw, 26px);
      font-weight: 700;
      line-height: 1.1;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .header-info p {
      margin: 4px 0 0;
      font-size: 13px;
      color: var(--muted);
    }
    .ok { color: var(--ok); }
    .danger { color: var(--danger); }
    .device-type-tag {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      color: #475569;
      vertical-align: middle;
    }

    .card {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 12px;
      box-shadow: var(--shadow);
      padding: 20px 24px;
      margin-bottom: 16px;
    }
    .no-config {
      text-align: center;
    }
    .no-config h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 18px;
    }
    .no-config-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-bottom: 16px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--ink);
      cursor: pointer;
      transition: all 0.12s;
      min-height: 38px;
    }
    .btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }
    .btn-primary {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }
    .btn-primary:hover {
      background: #0d4d5e;
    }
    .btn-success {
      background: var(--ok);
      color: #fff;
      border-color: var(--ok);
    }
    .btn-success:hover {
      background: #16a34a;
    }
    .btn-danger {
      background: var(--danger);
      color: #fff;
      border-color: var(--danger);
    }
    .btn-danger:hover {
      background: #dc2626;
    }
    .btn-edit-config {
      border: 1px solid #0f766e;
      background: #0f766e;
      color: #fff;
    }
    .btn-edit-config:hover {
      background: #0d5f58;
      border-color: #0d5f58;
    }
    .hint {
      font-size: 12px;
      color: var(--muted);
      margin: 4px 0;
    }

    .yaml-warnings {
      border: 1px solid var(--accent);
      background: #fffbeb;
      border-radius: 8px;
      padding: 10px 14px;
      margin-top: 8px;
    }
    .yaml-warnings p {
      font-size: 12px;
      color: #7c3f00;
      margin: 4px 0;
      font-weight: 500;
    }

    .queue-banner {
      border: 1px solid var(--accent);
      background: #fffbeb;
      border-radius: 8px;
      padding: 12px 16px;
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .queue-banner strong {
      font-size: 14px;
      font-weight: 600;
    }
    .queue-banner small {
      color: var(--muted);
      font-size: 11px;
    }

    .action-bar {
      display: flex;
      gap: 8px;
      padding: 16px 0 8px;
      border-top: 1px solid var(--line);
      margin-top: 12px;
    }

    .cancel-link {
      border: 1px solid var(--danger);
      background: transparent;
      color: var(--danger);
      font: inherit;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .cancel-link:hover {
      background: var(--danger);
      color: white;
    }
    .btn-link {
      border: none;
      background: transparent;
      color: var(--primary);
      font: inherit;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      padding: 0 4px;
      text-decoration: underline;
    }
    .btn-link:hover {
      color: var(--ink);
    }
    .close-logs-link {
      margin-left: auto;
      border: 1px solid rgba(255,255,255,0.1);
      background: transparent;
      color: var(--muted);
      font: inherit;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      font-size: 10px;
      font-weight: 500;
      cursor: pointer;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .close-logs-link:hover {
      background: rgba(255,255,255,0.1);
      color: #fff;
    }

    .status-line {
      font-size: 11px;
      color: var(--muted);
      margin: 4px 0 0;
    }

    .success-section,
    .fail-section {
      margin-top: 10px;
    }
    .download-links {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }
    .success-banner {
      background: #dcfce7;
      color: #166534;
      border: 1px solid var(--ok);
      border-radius: 8px;
      padding: 8px 12px;
      font-weight: 600;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .fail-banner {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid var(--danger);
      border-radius: 8px;
      padding: 8px 12px;
      font-weight: 600;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .build-info {
      font-size: 13px;
      color: var(--muted);
      margin: 6px 0;
    }
    .flash-actions {
      display: flex;
      gap: 8px;
      margin: 10px 0;
      flex-wrap: wrap;
    }
    .browser-flash-panel {
      border: 1px solid var(--line);
      background: #f8fafc;
      border-radius: 8px;
      padding: 12px;
      display: grid;
      gap: 10px;
      margin-top: 8px;
    }
    .browser-flash-copy strong {
      display: block;
      font-size: 13px;
      margin-bottom: 4px;
    }
    .browser-flash-copy p {
      margin: 0;
      font-size: 12px;
      color: var(--muted);
    }
    .browser-flash-actions,
    .browser-flash-hint {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    .browser-flash-hint p {
      margin: 0;
      font-size: 12px;
      color: var(--muted);
    }
    .browser-flash-error {
      margin: 6px 0 0;
      font-size: 12px;
      color: var(--danger, #dc2626);
    }
    .warnings {
      border-left: 4px solid var(--accent);
      background: #fffbeb;
      padding: 12px;
      border-radius: 6px;
      display: grid;
      gap: 8px;
      margin: 8px 0;
    }
    .warnings p {
      margin: 0;
      font-size: 13px;
      color: #7c3f00;
    }
    .warnings label {
      font-weight: 500;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .error {
      color: var(--danger);
      font-size: 13px;
      font-weight: 500;
      padding: 10px 12px;
      background: #fef2f2;
      border: 1px solid var(--danger);
      border-radius: 6px;
    }

    .chip-error-banner {
      background: #fef2f2;
      border: 2px solid #b91c1c;
      color: #991b1b;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 13px;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .chip-error-banner .dismiss-btn {
      background: transparent;
      border: none;
      font-size: 16px;
      cursor: pointer;
      color: #991b1b;
      padding: 0 4px;
      width: auto;
      min-height: auto;
      border-radius: 0;
      transform: none;
    }

    .chip-error-banner .dismiss-btn:hover {
      color: #7f1d1d;
      background: transparent;
      border-color: transparent;
      transform: none;
    }

    .compare-table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
      font-size: 13px;
    }
    .compare-table th,
    .compare-table td {
      border: 1px solid var(--line);
      padding: 8px 10px;
      text-align: left;
    }
    .compare-table th {
      background: #f8fafc;
      font-size: 11px;
      text-transform: uppercase;
      color: var(--muted);
      font-weight: 600;
    }
    .tag {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      margin-left: 4px;
    }
    .tag.match {
      background: #dcfce7;
      color: #166534;
    }
    .tag.mismatch {
      background: #fef2f2;
      color: #991b1b;
    }

    .compile-focus-view {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--line);
      border-radius: 8px;
      overflow: hidden;
      flex: 1;
      min-height: 0;
      background: #1a1b1e;
    }
    .compile-status-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: var(--primary);
      color: white;
      font-size: 13px;
      font-weight: 600;
    }
    .compile-spinner {
      font-size: 16px;
      animation: spin 1.5s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .compile-elapsed {
      margin-left: auto;
      font-family: ui-monospace, monospace;
      font-size: 12px;
      opacity: 0.85;
    }
    .expanded-log {
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
    .expanded-log .log-body {
      height: 100%;
      max-height: none;
    }
    .main-content {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .bottom-log {
      margin-top: 8px;
    }
    .ec-fix-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.6);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ec-fix-modal {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 24px;
      max-width: 560px;
      width: 90%;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    .ec-fix-modal h3 { margin: 0 0 12px; font-size: 16px; }
    .ec-fix-modal p { margin: 8px 0; font-size: 13px; }
    .ec-fix-modal code { font-family: ui-monospace, monospace; font-size: 12px; }
    .ec-fix-snippet {
      background: #1e1e2e;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 12px;
      font-family: ui-monospace, monospace;
      font-size: 12px;
      white-space: pre-wrap;
      color: #a8d8a8;
      margin: 8px 0;
    }
    .ec-fix-hint { font-size: 12px; color: var(--muted); }
    .ec-fix-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
      justify-content: flex-end;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'esp-config-page': EspConfigPage;
  }
}
