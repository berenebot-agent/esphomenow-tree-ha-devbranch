import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { OtaJob, PreflightComparison, TopologyNode, api, fmtBytes, fmtTime, normalizeMac } from '../api/client';
import './ota-progress';

const TERMINAL_STATUSES = new Set(['success', 'failed', 'aborted', 'rejoin_timeout', 'version_mismatch']);

@customElement('esp-ota-box')
export class EspOtaBox extends LitElement {
  @property({ type: String }) mac = '';
  @property({ type: Object }) node!: TopologyNode;
  @property({ type: Boolean }) showEditYaml = false;
  @property({ type: Object }) currentJob: OtaJob | null = null;
  @state() private pendingJob: OtaJob | null = null;
  @state() preflight: PreflightComparison | null = null;
  @state() private acceptedWarnings = false;
  @state() private busy = false;
  @state() private error = '';
  
  @state() private showAbortModal = false;

  private async upload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.busy = true;
    this.error = '';
    this.acceptedWarnings = false;
    try {
      const result = await api.uploadFirmware(this.mac, file);
      this.pendingJob = result.job;
      this.preflight = result.preflight || null;
      this.dispatchChanged();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.busy = false;
      input.value = '';
    }
  }

private async start(): Promise<void> {
    if (!this.pendingJob) return;
    this.busy = true;
    this.error = '';
    try {
      const result = await api.startOta(this.pendingJob.id);
      if (result.job.status === 'queued') {
        this.pendingJob = null;
        this.preflight = null;
        this.dispatchChanged();
      } else {
        this.pendingJob = null;
        this.preflight = null;
        this.dispatchChanged();
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.busy = false;
    }
  }

  private goToConfig(): void {
    window.location.hash = `/device/${encodeURIComponent(this.mac)}/config`;
  }

  private async abort(): Promise<void> {
    const pendingId = this.pendingJob?.id ?? (this.currentJob?.status === 'pending_confirm' ? this.currentJob?.id : null);
    if (pendingId) {
      this.pendingJob = null;
      this.preflight = null;
      this.acceptedWarnings = false;
      this.busy = true;
      this.error = '';
      try {
        await api.cancelPending(pendingId);
        this.dispatchChanged();
      } catch (error) {
        this.error = error instanceof Error ? error.message : String(error);
      } finally {
        this.busy = false;
      }
      return;
    }
    try {
      const queue = await api.getQueue();
      if (queue.count > 0) {
        this.showAbortModal = true;
        return;
      }
    } catch { /* if queue check fails, proceed with normal abort */ }
    this.pendingJob = null;
    this.preflight = null;
    this.acceptedWarnings = false;
    this.busy = true;
    this.error = '';
    try {
      await api.abortOta();
      this.dispatchChanged();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.busy = false;
    }
  }

  private async abortQueued(): Promise<void> {
    if (!this.currentJob) return;
    this.busy = true;
    this.error = '';
    try {
      await api.abortQueuedJob(this.currentJob.id);
      this.dispatchChanged();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.busy = false;
    }
  }

  private isJobDismissed(jobId: number): boolean {
    return sessionStorage.getItem(`esp_tree_ota_dismissed_${jobId}`) === '1';
  }

  private dismissAndClear(): void {
    if (this.currentJob?.id != null) {
      sessionStorage.setItem(`esp_tree_ota_dismissed_${this.currentJob.id}`, '1');
    }
    this.requestUpdate();
  }

  private dispatchChanged(): void {
    this.dispatchEvent(new CustomEvent('ota-changed', { bubbles: true, composed: true }));
  }

  render() {
    const activeForThis = this.currentJob && normalizeMac(this.currentJob.mac) === normalizeMac(this.mac);
    const terminalJob = activeForThis && this.currentJob && TERMINAL_STATUSES.has(this.currentJob.status) ? this.currentJob : null;
    const isCompileQueued = activeForThis && this.currentJob?.status === 'compile_queued';
    const isCompiling = activeForThis && this.currentJob?.status === 'compiling';
    const isQueued = activeForThis && this.currentJob?.status === 'queued';
    const isFlashing = activeForThis && this.currentJob && !isQueued && !isCompileQueued && !isCompiling && this.currentJob.status !== 'pending_confirm' && !TERMINAL_STATUSES.has(this.currentJob.status);
    const pending = this.pendingJob;
    const canStart = !!pending && (!this.preflight?.has_warnings || this.acceptedWarnings) && !this.busy;
    const showResult = !!terminalJob && !this.isJobDismissed(terminalJob.id);

    return html`
      <section class="ota">
        <div class="title-row">
          <div>
            <h2>Firmware</h2>
          </div>
          ${activeForThis && this.currentJob && !terminalJob && !showResult && !isQueued && !isCompileQueued && !isCompiling && !pending && !isFlashing ? html`<button class="btn btn-danger" ?disabled=${this.busy} @click=${this.abort}>Abort</button>` : nothing}
        </div>

        ${showResult && terminalJob
          ? this.renderFlashResult(terminalJob)
          : html`
              ${isCompileQueued && this.currentJob
                ? this.renderCompileQueued(this.currentJob)
                : nothing}
              ${isCompiling && this.currentJob
                ? this.renderCompiling(this.currentJob)
                : nothing}
              ${isQueued && this.currentJob
                ? this.renderQueued(this.currentJob)
                : isFlashing && this.currentJob
                  ? html`<esp-ota-progress .job=${this.currentJob} .showAbort=${true} @abort=${this.abort}></esp-ota-progress>`
                  : nothing}

              ${!pending && !isQueued && !isFlashing && !isCompileQueued && !isCompiling
                ? html`
                    <div class="idle-controls">
                      ${this.showEditYaml ? html`<button class="btn btn-edit-yaml" @click=${this.goToConfig}>Edit Firmware YAML</button>` : nothing}
                      <label class="upload ${this.busy ? 'busy' : ''}">
                        <input type="file" accept=".ota.bin" ?disabled=${this.busy} @change=${this.upload} />
                        <strong>${this.busy ? 'Processing firmware...' : 'Upload .ota.bin firmware to flash'}</strong>
                      </label>
                    </div>
                  `
                : nothing}

              ${pending ? this.renderPending(pending, canStart) : nothing}
            `}
        ${this.showAbortModal ? this.renderAbortModal() : nothing}
        ${this.error ? html`<p class="error">${this.error}</p>` : nothing}
      </section>
    `;
  }

  private renderQueued(job: OtaJob) {
    const position = job.queue_position ?? 1;
    return html`
      <div class="queued-wrapper">
        <esp-ota-progress .job=${job}></esp-ota-progress>
        <div class="queued-overlay">
          <span class="queued-icon">⏳</span>
          <strong>Firmware Update Queued</strong>
          <small>#${position} in queue</small>
          <button class="btn btn-danger" ?disabled=${this.busy} @click=${this.abortQueued}>Abort</button>
        </div>
      </div>
    `;
  }

  private renderCompileQueued(job: OtaJob) {
    const position = (job.queue_position ?? 0) + 1;
    return html`
      <div class="queued-wrapper">
        <div class="queued-overlay compile-overlay">
          <span class="queued-icon">⏳</span>
          <strong>Compiling Firmware...</strong>
          <small>#${position} in compile queue</small>
          <button class="btn btn-danger" ?disabled=${this.busy} @click=${this.abortCompileQueuedJob}>Cancel</button>
        </div>
      </div>
    `;
  }

  private renderCompiling(_job: OtaJob) {
    return html`
      <div class="queued-wrapper">
        <div class="queued-overlay compile-overlay compiling-overlay">
          <span class="queued-icon">⚙</span>
          <strong>Building Firmware...</strong>
          <a class="view-logs-link" href=${`#/device/${encodeURIComponent(this.mac)}/config`}>View compile logs →</a>
          <button class="btn btn-danger" ?disabled=${this.busy} @click=${this.cancelCompile}>Cancel</button>
        </div>
      </div>
    `;
  }

  private async abortCompileQueuedJob(): Promise<void> {
    if (!this.currentJob) return;
    this.busy = true;
    this.error = '';
    try {
      await api.cancelCompile(this.mac);
      this.dispatchChanged();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.busy = false;
    }
  }

  private async cancelCompile(): Promise<void> {
    this.busy = true;
    this.error = '';
    try {
      await api.cancelCompile(this.mac);
      this.dispatchChanged();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.busy = false;
    }
  }

  private renderAbortModal() {
    return html`
      <div class="modal-backdrop" @click=${() => { this.showAbortModal = false; this.pendingJob = null; this.preflight = null; }}>
        <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
          <h3>Other queued jobs waiting</h3>
          <p>Continue running the next queued job after aborting this one?</p>
          <div class="actions">
            <button class="start" @click=${this.abortAndContinue}>Yes, continue queue</button>
            <button class="btn btn-danger" @click=${this.abortAndPause}>No, pause queue</button>
            <button @click=${() => { this.showAbortModal = false; this.pendingJob = null; this.preflight = null; }}>Cancel</button>
          </div>
        </div>
      </div>
    `;
  }

  private async abortAndContinue(): Promise<void> {
    this.showAbortModal = false;
    this.pendingJob = null;
    this.preflight = null;
    this.busy = true;
    try {
      await api.abortOta();
      this.dispatchChanged();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.busy = false;
    }
  }

  private async abortAndPause(): Promise<void> {
    this.showAbortModal = false;
    this.pendingJob = null;
    this.preflight = null;
    this.busy = true;
    try {
      await api.abortOta();
      await api.pauseQueue();
      this.dispatchChanged();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.busy = false;
    }
  }

  private renderPending(job: OtaJob, canStart: boolean) {
    const p = this.preflight;
    const jobLabel = job.parsed_esphome_name || job.esphome_name || job.firmware_name || 'Selected firmware';
    const nameBadge = p?.name.match ? 'match' : 'mismatch';
    const nameBadgeClass = `tag ${nameBadge}`;
    const nameBadgeText = p?.name.match ? 'MATCH' : 'MISMATCH';

    const chipBadge = p?.chip.match ? 'match' : 'mismatch';
    const chipBadgeClass = `tag ${chipBadge}`;
    const chipBadgeText = p?.chip.match ? 'MATCH' : 'MISMATCH';

    const dateStatus = p?.build_date.status || 'unknown';
    let dateBadgeClass = 'tag ';
    let dateBadgeText = '';
    if (dateStatus === 'same') {
      dateBadgeClass += 'same';
      dateBadgeText = 'SAME';
    } else if (dateStatus === 'newer') {
      dateBadgeClass += 'newer';
      dateBadgeText = `NEWER ${p?.build_date.delta}`;
    } else if (dateStatus === 'older') {
      dateBadgeClass += 'older';
      dateBadgeText = `OLDER ${p?.build_date.delta}`;
    }

    if (p?.metadata_unavailable) {
      return html`
        <div class="pending">
          <h3>${jobLabel}</h3>
          <p class="meta-unavailable">Metadata not available for ESP8266 Arduino firmware.</p>
          <div class="meta-info">
            <span>Size: ${fmtBytes(job.firmware_size)}</span>
            <span>MD5: ${job.firmware_md5 || '-'}</span>
          </div>
          <div class="actions">
            <button class="btn btn-primary" ?disabled=${!canStart} @click=${this.start}>Flash</button>
            <button class="btn" ?disabled=${this.busy} @click=${this.abort}>Cancel</button>
          </div>
        </div>
      `;
    }

    return html`
      <div class="pending">
        <h3>${jobLabel}</h3>
        <table class="compare-table">
          <thead>
            <tr><th>Field</th><th>Current (Remote)</th><th>New (Firmware)</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>${p?.name.current || '-'}</td>
              <td>${p?.name.new || '-'}<br><span class="${nameBadgeClass}">${nameBadgeText}</span></td>
            </tr>
            <tr>
              <td>Build Date</td>
              <td>${p?.build_date.current || '-'}</td>
              <td>${p?.build_date.new || '-'}<br><span class="${dateBadgeClass}">${dateBadgeText}</span></td>
            </tr>
            <tr>
              <td>Chip Type</td>
              <td>${p?.chip.current || '-'}</td>
              <td>${p?.chip.new || '-'}<br><span class="${chipBadgeClass}">${chipBadgeText}</span></td>
            </tr>
          </tbody>
        </table>
        <div class="meta-info">
          <span>Size: ${fmtBytes(job.firmware_size)}</span>
          <span>MD5: ${job.firmware_md5 || '-'}</span>
        </div>
        ${p?.has_warnings
          ? html`
              <div class="warnings">
                ${p.warnings.map((warning) => html`<p>${warning}</p>`)}
                <label>
                  <input type="checkbox" .checked=${this.acceptedWarnings} @change=${(event: Event) => (this.acceptedWarnings = (event.target as HTMLInputElement).checked)} />
                  Flash anyway
                </label>
              </div>
            `
          : nothing}
        <div class="actions">
          <button class="btn btn-primary" ?disabled=${!canStart} @click=${this.start}>Flash</button>
          <button class="btn" ?disabled=${this.busy} @click=${this.abort}>Cancel</button>
        </div>
      </div>
    `;
  }

  private renderFlashResult(job: OtaJob) {
    const isSuccess = job.status === 'success';
    const resultClass = isSuccess ? 'success' : 'failure';
    const resultLabel = isSuccess ? 'FLASH SUCCESSFUL' : job.status.replaceAll('_', ' ').toUpperCase();
    const resultMessage = isSuccess
      ? 'The device accepted the new firmware and rejoined the network.'
      : job.error_msg || 'The firmware update did not complete successfully.';

    const jobName = job.parsed_esphome_name || job.esphome_name || job.firmware_name || '-';
    const nodeName = this.node.esphome_name || '-';
    const nameMatch = jobName === nodeName || (jobName === '-' && nodeName === '-');

    const jobDate = job.parsed_build_date || '-';
    const nodeDate = this.node.firmware_build_date || '-';
    const dateMatch = jobDate === nodeDate || (jobDate === '-' && nodeDate === '-');

    const jobChip = job.parsed_chip_name || '-';
    const nodeChip = this.node.chip_name || '-';
    const chipMatch = jobChip === nodeChip || (jobChip === '-' && nodeChip === '-');

    const jobMd5 = job.firmware_md5 || '-';
    const nodeMd5 = this.node.firmware_md5 || '-';
    const md5Match = jobMd5 === nodeMd5 || (jobMd5 === '-' && nodeMd5 === '-');

    if (isSuccess) {
      return html`
        <div class="flash-result ${resultClass}">
          <div class="result-banner">
            <span class="result-icon">✓</span>
            <span class="result-label">${resultLabel}</span>
          </div>
          <h3>${jobName}</h3>
          <p class="result-message">${resultMessage}</p>
          <div class="actions">
            <button class="btn btn-primary" @click=${this.dismissAndClear}>Done</button>
          </div>
        </div>
      `;
    }

    return html`
      <div class="flash-result ${resultClass}">
        <div class="result-banner">
          <span class="result-icon">✗</span>
          <span class="result-label">${resultLabel}</span>
        </div>
        <h3>${jobName}</h3>
        <p class="result-message">${resultMessage}</p>
        <table class="compare-table">
          <thead>
            <tr><th>Field</th><th>Flashed</th><th>Device Now</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>${jobName}</td>
              <td>${nodeName} ${!nameMatch ? html`<span class="tag mismatch">CHANGED</span>` : nothing}</td>
            </tr>
            <tr>
              <td>Build Date</td>
              <td>${jobDate}</td>
              <td>${nodeDate} ${!dateMatch ? html`<span class="tag mismatch">CHANGED</span>` : nothing}</td>
            </tr>
            <tr>
              <td>Chip Type</td>
              <td>${jobChip}</td>
              <td>${nodeChip} ${!chipMatch ? html`<span class="tag mismatch">CHANGED</span>` : nothing}</td>
            </tr>
            <tr>
              <td>Firmware MD5</td>
              <td>${jobMd5}</td>
              <td>${nodeMd5} ${!md5Match ? html`<span class="tag mismatch">CHANGED</span>` : nothing}</td>
            </tr>
          </tbody>
        </table>
        <div class="meta-info">
          <span>Size: ${fmtBytes(job.firmware_size)}</span>
          ${job.completed_at ? html`<span>Completed: ${fmtTime(job.completed_at)}</span>` : nothing}
        </div>
        <div class="actions">
          <button class="btn btn-primary" @click=${this.dismissAndClear}>Done</button>
        </div>
      </div>
    `;
  }

  static styles = css`
    .ota {
      display: grid;
      gap: 16px;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .card-header h2 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }

    .title-row {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 12px;
    }

    .title-row span {
      color: var(--primary);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .title-row h2 {
      margin: 0;
      font-size: 20px;
      line-height: 1.1;
    }

    .upload {
      display: grid;
      gap: 6px;
      place-items: center;
      min-height: 42px;
      border: 2px dashed var(--line);
      background: #fafbfc;
      border-radius: 8px;
      cursor: pointer;
      padding: 6px 18px;
      text-align: center;
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      transition: all 0.12s;
    }

    .upload:hover {
      border-color: var(--primary);
      background: #f0f7fa;
    }

    .idle-controls {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    button.btn-edit-yaml {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #0f766e;
      background: #0f766e;
      color: #fff;
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.12s, border-color 0.12s;
      width: 100%;
      min-height: 38px;
      box-sizing: border-box;
      padding: 0 12px;
    }

    button.btn-edit-yaml:hover {
      background: #115e59;
      border-color: #115e59;
    }

    input[type='file'] {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      opacity: 0;
      pointer-events: none;
    }

    small,
    .meta {
      color: var(--muted);
      font-size: 12px;
    }

    .pending {
      border: 1px solid var(--line);
      background: var(--surface);
      border-radius: 8px;
      padding: 16px;
    }

    .pending h3 {
      margin: 0 0 12px;
    }

    .meta-unavailable {
      color: var(--muted);
      font-style: italic;
      margin: 0 0 12px;
    }

    .compare-table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
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

    .compare-table td:first-child {
      font-weight: 500;
      color: var(--muted);
    }

    .tag {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      margin-top: 4px;
    }

    .tag.match {
      background: #dcfce7;
      color: #166534;
    }

    .tag.same {
      background: #f1f5f9;
      color: var(--muted);
    }

    .tag.mismatch,
    .tag.newer {
      background: #fef2f2;
      color: #991b1b;
    }

    .tag.older {
      background: #dcfce7;
      color: #166534;
    }

    .meta-info {
      display: flex;
      gap: 16px;
      font-size: 11px;
      color: var(--muted);
      margin-bottom: 12px;
    }

    .warnings {
      border-left: 4px solid var(--accent);
      background: #fffbeb;
      padding: 12px;
      display: grid;
      gap: 8px;
      margin-bottom: 12px;
      border-radius: 6px;
    }

    .warnings p {
      margin: 0;
      font-size: 13px;
    }

    .warnings label {
      font-weight: 500;
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .flash-result {
      border: 1px solid var(--line);
      background: var(--surface);
      border-radius: 8px;
      padding: 16px;
    }

    .result-message {
      margin: 0 0 12px;
      color: var(--ink);
      font-size: 13px;
      line-height: 1.45;
    }

    .flash-result.failure {
      border-color: var(--danger);
    }

    .result-banner {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      margin: -16px -16px 12px -16px;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 14px;
      border-radius: 8px 8px 0 0;
    }

    .flash-result.success .result-banner {
      background: #dcfce7;
      color: #166534;
    }

    .flash-result.failure .result-banner {
      background: #fef2f2;
      color: #991b1b;
    }

    .result-icon {
      font-size: 18px;
      line-height: 1;
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

    .btn-danger {
      background: var(--danger);
      color: #fff;
      border-color: var(--danger);
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    button:disabled,
    .btn:disabled {
      opacity: 0.48;
      cursor: not-allowed;
    }

    .notice,
    .error {
      margin: 0;
      padding: 10px 12px;
      border: 1px solid var(--accent);
      background: #fffbeb;
      color: #7c3f00;
      font-weight: 500;
      border-radius: 6px;
    }

    .error {
      border-color: var(--danger);
      background: #fef2f2;
      color: #991b1b;
    }

    .queued-wrapper {
      position: relative;
      overflow: visible;
    }

    .queued-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      background: rgba(255, 247, 223, 0.92);
      z-index: 2;
      text-align: center;
      padding: 8px;
      overflow: visible;
      border-radius: 8px;
    }

    .queued-icon {
      font-size: 24px;
    }

    .queued-overlay strong {
      font-size: 14px;
    }

    .queued-overlay small {
      color: var(--muted);
      font-size: 11px;
    }

    .queued-overlay .btn-danger {
      margin-top: 8px;
    }

    .compile-overlay {
      background: rgba(255, 249, 230, 0.95);
    }

    .compiling-overlay {
      background: rgba(232, 248, 245, 0.95);
    }

    .view-logs-link {
      color: var(--primary);
      font-size: 12px;
      font-weight: 500;
      text-decoration: underline;
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 20px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .modal h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .modal p {
      margin: 0 0 16px 0;
      font-size: 14px;
      color: var(--muted);
    }

    @media (max-width: 760px) {
      .compare-table {
        font-size: 11px;
      }
    }
  `;
}
