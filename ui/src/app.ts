import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './components/topology-map';
import './components/device-detail';
import './components/settings';
import './pages/queue-page';
import './pages/config-page';
import './pages/secrets-page';
import './pages/job-page';
import './pages/activity-log-page';
import './pages/setup-page';
import './pages/remote-wizard';
import { QueueResponse, CompileQueueResponse, api, streamBridgeState } from './api/client';

declare const __GIT_HASH__: string;
declare const __GIT_DATE__: string;

type Route = { name: 'topology' } | { name: 'device'; mac: string } | { name: 'device-config'; mac: string } | { name: 'settings' } | { name: 'queue' } | { name: 'secrets'; from: string } | { name: 'job'; jobId: number; from: string } | { name: 'activity-log' } | { name: 'setup' } | { name: 'remote-wizard' };

@customElement('espnow-app')
export class EspnowApp extends LitElement {
  @state() private route: Route = this.readRoute();
  @state() private queueData: QueueResponse | null = null;
  @state() private compileData: CompileQueueResponse | null = null;
  @state() private addonConnected = true;
  @state() private bridgeConnected: boolean | null = null;
  @state() private bridgeConfigured: boolean | null = null;
  @state() private integrationLoaded: boolean | null = null;
  @state() private integrationConfigured = false;
  @state() private restartRequired = false;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private bridgeStreamHandle: { close: () => void } | null = null;
  private setupDismissed = false;

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('hashchange', this.onHashChange);
    this.addEventListener('setup-dismissed', this.onSetupDismissed as EventListener);
    this.bridgeStreamHandle = streamBridgeState((connected) => {
      this.bridgeConnected = connected;
      void this.fetchConfig();
    });
    this.fetchQueue();
    this.pollTimer = setInterval(() => {
      this.fetchQueue();
      void this.fetchConfig();
      void this.checkRestartRequired();
    }, 3000);
    void this.fetchConfig();
    void this.checkRestartRequired();
    this.maybeRedirectToSetup();
  }

  private async checkRestartRequired(): Promise<void> {
    try {
      const status = await api.restartRequired();
      this.restartRequired = status.restart_required;
      this.integrationLoaded = status.integration?.loaded ?? this.integrationLoaded;
      this.integrationConfigured = status.integration?.configured ?? this.integrationConfigured;
    } catch {
      this.restartRequired = false;
    }
    this.maybeRedirectToSetup();
  }

  private async fetchConfig(): Promise<void> {
    try {
      const config = await api.config();
      this.integrationLoaded = config.integration?.loaded ?? null;
      this.integrationConfigured = config.integration?.configured ?? false;
      this.bridgeConfigured = !!(
        (config.active_bridge && !config.active_bridge.error) ||
        ((config.integration?.bridge_count ?? 0) > 0)
      );
      this.addonConnected = true;
    } catch {
      this.addonConnected = false;
      this.bridgeConfigured = false;
    }
    this.maybeRedirectToSetup();
  }

  private needsSetup(): boolean {
    return this.bridgeConfigured === false
      || this.restartRequired
      || (!this.integrationConfigured && this.integrationLoaded === false);
  }

  private maybeRedirectToSetup(): void {
    if (
      this.needsSetup() &&
      this.route.name === 'topology' &&
      !this.setupDismissed
    ) {
      this.navigate('/setup');
    }
  }

  disconnectedCallback(): void {
    window.removeEventListener('hashchange', this.onHashChange);
    this.removeEventListener('setup-dismissed', this.onSetupDismissed as EventListener);
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    this.bridgeStreamHandle?.close();
    this.bridgeStreamHandle = null;
    super.disconnectedCallback();
  }

  private async fetchQueue(): Promise<void> {
    try {
      const [flash, compile] = await Promise.all([
        api.getQueue(),
        api.getCompileQueue(),
      ]);
      this.queueData = flash;
      this.compileData = compile;
      this.addonConnected = true;
    } catch {
      this.addonConnected = false;
    }
  }

  private onHashChange = (): void => {
    this.route = this.readRoute();
  };

  private onSetupDismissed = (): void => {
    this.setupDismissed = true;
  };

  private readRoute(): Route {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash.startsWith('device/')) {
      const rest = hash.slice(7);
      if (rest.endsWith('/config')) {
        return { name: 'device-config', mac: decodeURIComponent(rest.replace(/\/config$/, '')) };
      }
      return { name: 'device', mac: decodeURIComponent(rest) };
    }
    if (hash.startsWith('job/')) {
      const rest = hash.slice(4);
      const [idPart, query] = rest.split('?');
      const jobId = parseInt(idPart, 10);
      let from = '/queue';
      if (query) {
        const params = new URLSearchParams(query);
        from = params.get('from') || '/queue';
      }
      return { name: 'job', jobId, from };
    }
    if (hash === 'settings') return { name: 'settings' };
    if (hash === 'queue') return { name: 'queue' };
    if (hash === 'secrets') return { name: 'secrets', from: '/' };
    if (hash.startsWith('secrets?')) {
      const params = new URLSearchParams(hash.slice(7));
      return { name: 'secrets', from: params.get('from') || '/' };
    }
    if (hash === 'activity-log') return { name: 'activity-log' };
    if (hash === 'setup') return { name: 'setup' };
    if (hash === 'add-remote') return { name: 'remote-wizard' };
    return { name: 'topology' };
  }

  private navigate(path: string): void {
    window.location.hash = path;
  }

  render() {
    if (this.route.name === 'setup') {
      return html`<esp-setup-wizard></esp-setup-wizard>`;
    }

    const q = this.queueData;
    const cq = this.compileData;
    const queueCount = q?.count ?? 0;
    const compileCount = cq?.count ?? 0;
    const hasActive = !!q?.active_job && !['success', 'failed', 'aborted', 'rejoin_timeout', 'version_mismatch'].includes(q.active_job.status);
    const hasCompileActive = !!cq?.active_job;
    const paused = q?.paused ?? false;
    const showBadge = hasActive || queueCount > 0 || hasCompileActive || compileCount > 0;

    return html`
      <div class="app-shell">
        ${!this.addonConnected ? html`<div class="connection-banner">Cannot reach addon</div>` : nothing}
        ${this.bridgeConnected === false ? html`<div class="connection-banner">Addon cannot reach bridge</div>` : nothing}

        <header>
          <div class="brand">
            <a class="brand-name" href="#/">ESP-Tree<small>Go where WiFi won't</small></a>
          </div>
          <div class="header-right">
            <nav>
              <button class=${this.route.name === 'topology' || this.route.name === 'remote-wizard' ? 'active' : ''} @click=${() => this.navigate('/')}>Topology</button>
              <button class=${this.route.name === 'queue' ? 'active' : ''} @click=${() => this.navigate('/queue')}>
                Queue${showBadge ? html`<span class="badge ${hasCompileActive || hasActive ? 'loading' : ''}">${paused ? '\u23F8 ' : ''}${queueCount + compileCount + (hasActive ? 1 : 0)}</span>` : nothing}
              </button>
              <button class=${this.route.name === 'settings' ? 'active' : ''} @click=${() => this.navigate('/settings')}>Settings</button>
            </nav>
          </div>
        </header>
        <main>
          ${this.route.name === 'remote-wizard'
            ? html`<esp-remote-wizard></esp-remote-wizard>`
            : this.route.name === 'topology'
            ? html`<esp-topology-map @node-selected=${(event: CustomEvent<string>) => this.navigate(`/device/${encodeURIComponent(event.detail)}`)}></esp-topology-map>`
            : this.route.name === 'device'
              ? html`<esp-device-detail .mac=${this.route.mac}></esp-device-detail>`
              : this.route.name === 'device-config'
                ? html`<esp-config-page .mac=${this.route.mac}></esp-config-page>`
                : this.route.name === 'job'
                  ? html`<esp-job-page .jobId=${this.route.jobId} .from=${this.route.from}></esp-job-page>`
                  : this.route.name === 'queue'
                    ? html`<esp-queue-page></esp-queue-page>`
                    : this.route.name === 'secrets'
                      ? html`<esp-secrets-page .from=${this.route.from}></esp-secrets-page>`
                      : this.route.name === 'activity-log'
                        ? html`<esp-activity-log-page></esp-activity-log-page>`
                        : html`<esp-settings></esp-settings>`}
        </main>
      </div>
    `;
  }

  static styles = css`
    :host {
      --bg: #f5f7fa;
      --surface: #ffffff;
      --ink: #1c1c1e;
      --muted: #64748b;
      --line: #e2e8f0;
      --primary: #0b3b4b;
      --accent: #f39c12;
      --danger: #ef4444;
      --ok: #22c55e;
      --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      display: block;
      min-height: 100vh;
      background: var(--bg);
      color: var(--ink);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    .app-shell {
      margin: 0 auto;
      padding: 24px;
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--primary);
      color: #fff;
      padding: 0 24px;
      height: 56px;
      border-radius: 12px;
      margin-bottom: 24px;
      box-shadow: var(--shadow);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .brand-name,
    .brand-name:visited {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.3px;
      color: inherit;
      text-decoration: none;
    }

    .brand-name small {
      font-weight: 400;
      opacity: 0.7;
      font-size: 13px;
      margin-left: 6px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    nav {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }

    nav button {
      border: none;
      background: rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.8);
      min-height: 36px;
      padding: 0 16px;
      font: inherit;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.15s;
    }

    nav button:hover,
    nav button.active {
      background: rgba(255,255,255,0.18);
      color: #fff;
      font-weight: 600;
    }

    .badge {
      display: inline-block;
      margin-left: 5px;
      padding: 1px 7px;
      font-size: 10px;
      font-weight: 700;
      background: var(--accent);
      color: white;
      border-radius: 10px;
      vertical-align: middle;
    }

.badge.loading {
      position: relative;
      width: 24px;
      height: 24px;
      padding: 0;
      border-radius: 50%;
      background: transparent;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
    }

    .badge.loading::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 3px solid rgba(243, 156, 18, 0.3);
      border-top-color: var(--accent);
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .connection-banner {
      background: var(--danger);
      color: #fff;
      text-align: center;
      padding: 8px;
      font-weight: 600;
      font-size: 14px;
      border-radius: 8px;
      margin-bottom: 12px;
    }

    .info-banner {
      background: #1e40af;
      color: #fff;
      text-align: center;
      padding: 8px;
      font-weight: 600;
      font-size: 14px;
      border-radius: 8px;
      margin-bottom: 12px;
    }

    main {
    }

    @media (max-width: 720px) {
      .app-shell {
        padding: 12px;
      }
      header {
        flex-wrap: wrap;
        height: auto;
        padding: 12px 16px;
        gap: 8px;
      }
      nav {
        justify-content: flex-start;
      }
    }
  `;
}
