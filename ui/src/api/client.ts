export interface TopologyNode {
  mac: string;
  label?: string;
  parent_mac?: string;
  online?: boolean;
  hops?: number;
  offline_started_at?: number;
  offline_reason?: string;
  uptime_s?: number;
  last_seen_ago?: number;
  last_seen_bridge_uptime_s?: number;
  bridge_uptime_s?: number;
  firmware_version?: string;
  project_version?: string;
  esphome_name?: string;
  friendly_name?: string;
  project_name?: string;
  firmware_build_date?: string;
  firmware_md5?: string;
  chip_name?: string;
  rssi?: number;
  route_v2_capable?: boolean;
  can_relay?: boolean;
  relay_enabled?: boolean;
  direct_child_count?: number;
  total_child_count?: number;
  is_bridge?: boolean;
  network_id?: string;
  hidden?: boolean;
  ha_device_id?: string;
  /** True for remotes the integration retains but the bridge no longer advertises. */
  from_integration_store?: boolean;
}

export interface OtaJob {
  id: number;
  mac: string;
  status: string;
  job_type?: string;
  esphome_name?: string | null;
  firmware_path?: string | null;
  retained_until?: number | null;
  firmware_name?: string | null;
  firmware_size?: number | null;
  firmware_md5?: string | null;
  parsed_project_name?: string | null;
  parsed_version?: string | null;
  parsed_esphome_name?: string | null;
  parsed_build_date?: string | null;
  parsed_chip_name?: string | null;
  old_firmware_version?: string | null;
  old_project_name?: string | null;
  preflight_warnings?: string | null;
  percent?: number | null;
  bridge_state?: string | null;
  total_chunks?: number | null;
  chunks_sent?: number | null;
  error_msg?: string | null;
  started_at?: number | null;
  completed_at?: number | null;
  created_at: number;
  updated_at?: number | null;
  queue_order?: number | null;
  queue_position?: number | null;
  device_label?: string | null;
  current_increment?: number | null;
  total_increments?: number | null;
  retransmit_round?: number | null;
  buffer_size_kb?: number | null;
}

export interface StartResponse {
  job: OtaJob;
  queue_position?: number;
}

export interface QueueResponse {
  active_job: OtaJob | null;
  queued_jobs: OtaJob[];
  paused: boolean;
  count: number;
}

export interface PreflightComparison {
  name: { current: string; new: string; match: boolean };
  build_date: { current: string; new: string; status: string; delta: string };
  chip: { current: string; new: string; match: boolean };
  has_warnings: boolean;
  warnings: string[];
  metadata_unavailable?: boolean;
}

export interface UploadResponse {
  job: OtaJob;
  firmware: Record<string, unknown>;
  preflight: PreflightComparison;
}

export interface CompileResult {
  job: OtaJob;
  queue_position: number;
  preflight: PreflightComparison;
}

export interface ReflashResponse {
  job: OtaJob;
  preflight: PreflightComparison;
}

export interface FlashJobInfo {
  id: number;
  status: string;
  queue_position?: number;
}

export interface CompileStatusResponse {
  mac: string;
  esphome_name: string;
  status: string;
  job_id: number | null;
  queue_position: number | null;
  compile_status: string | null;
  error: string | null;
  flash_job: FlashJobInfo | null;
}

export interface CompileQueueResponse {
  active_job: OtaJob | null;
  queued_jobs: OtaJob[];
  count: number;
}

export interface LogEvent {
  type: string;
  ts: number;
  [key: string]: unknown;
}

export interface JobLogResponse {
  job_id: number;
  status: string;
  mac: string;
  is_terminal: boolean;
  log_events: LogEvent[];
}

export interface ConfigStatus {
  mac: string;
  esphome_name: string;
  config_state: 'no_config' | 'has_config' | 'compiled_ready' | 'compile_queued' | 'compiling';
  has_config: boolean;
  compile_status: string;
  job_id?: number;
  queue_position?: number;
}

export interface DeviceConfig {
  mac: string;
  esphome_name: string;
  content: string;
  has_config: boolean;
  chip_unknown?: boolean;
}

export interface ConfigResult {
  result: 'ok' | 'busy' | 'rejected' | 'unsupported' | 'invalid_payload' | 'timeout' | 'no_session' | 'not_remote';
  command: string;
}

export interface ContainerStatusInfo {
  image: string;
  available: boolean;
  tag: string;
  error?: string | null;
}

export interface SerialPort {
  port: string;
  description: string;
  hwid: string;
}

export interface SerialPortInfo {
  port: string;
  label: string;
  path: string;
  resolved: string;
  available: boolean;
  by_id: boolean;
}

export interface SerialFlashStatus {
  status: 'idle' | 'starting' | 'flashing' | 'success' | 'failed';
  esphome_name: string;
  port: string | null;
  error: string | null;
  flashed_bytes?: number;
}

export interface DiscoveredBridge {
  host: string;
  port: number;
  name: string;
  version: string;
  network_id?: string;
  hostname?: string;
}

export interface DiscoverBridgesResponse {
  bridges: DiscoveredBridge[];
  scanning: boolean;
}

export interface ConfiguredBridge {
  uuid: string;
  name: string;
  host: string;
  port: number;
  discovered_via: string;
  api_key?: string;
  network_id?: string;
  hostname?: string;
  is_active: boolean;
  last_connected_at?: number;
  created_at?: number;
  transport?: string;
  serial_port?: string;
  baud?: number;
}

export interface AppConfig {
  bridge: Record<string, unknown>;
  active_bridge: Record<string, unknown> | null;
  firmware_retention_days: number;
  ws_client_enabled?: boolean;
  ws_status?: Record<string, unknown> | null;
  integration?: {
    installed: boolean;
    loaded: boolean;
    configured: boolean;
    entry_count: number;
    bridge_count: number;
    remote_count: number;
    remotes_online?: number;
    connected: boolean;
    version?: string;
  };
}

export interface FlashWizardStatus {
  provisioning: boolean;
  kind?: 'bridge' | 'remote';
  esphome_name?: string;
  mac?: string;
  transport?: string;
  serial_port?: string;
  compile_status?: string;
  serial_flash_status?: string;
  bridge_detected?: boolean;
  remote_detected?: boolean;
  detected_bridge?: { host: string; port: number; name: string } | null;
}

export interface SetupStatus {
  bridge: {
    configured: boolean;
    connected: boolean;
    ws_connected?: boolean;
    uuid: string | null;
    hostname: string | null;
    ip: string | null;
  };
  restart: {
    required: boolean;
    running_version?: string | null;
    latest_version?: string | null;
    target_version?: string | null;
    reason?: string | null;
    source?: string | null;
    marker_present?: boolean;
  };
  integration: {
    loaded: boolean;
    runtime_loaded?: boolean;
    live_connected?: boolean;
    live_client_count?: number;
    live_hello_received?: boolean;
    live_version?: string | null;
    configured: boolean;
    entry_loaded?: boolean;
    entry_count?: number;
    entry_states?: string[];
    connected?: boolean;
    ws_client_connected?: boolean;
    last_flow?: Record<string, unknown> | null;
    version: string | null;
    runtime_version?: string | null;
    latest_version?: string | null;
  };
}

export interface IntegrationSetupResult {
  success: boolean;
  entry_created: boolean;
  restart_required: boolean;
  error?: string;
  integration?: AppConfig['integration'];
  flow?: Record<string, unknown>;
}

const API_PREFIX: string = (() => {
  const el = document.querySelector('meta[name="x-ingress-path"]');
  if (el && el.getAttribute('content')) {
    return el.getAttribute('content')!.replace(/\/+$/, '');
  }
  return '';
})();

const CONNECTION_TIMEOUT_MS = 15000;

export type ConnectionState = 'connected' | 'disconnected';

const TOPOLOGY_CACHE_TTL_MS = 30_000;
let _topologyCache: { data: TopologyNode[]; ts: number } | null = null;
let _serverId: string | null = null;

export interface WsTopologyMessage {
  type: string;
  payload: Record<string, unknown>;
}

export interface TopologyStreamHandle {
  close: () => void;
}

function apiPath(path: string): string {
  const prefix = API_PREFIX || '';
  if (path.startsWith('/')) {
    return prefix + path;
  }
  return prefix + '/' + path;
}

function parseBody(text: string, contentType: string | null): unknown {
  if (!text) return null;
  if (contentType?.includes('application/json')) {
    return JSON.parse(text);
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort('timeout'), CONNECTION_TIMEOUT_MS);
  try {
    const response = await fetch(apiPath(path), {
      ...init,
      signal: controller.signal,
      headers: init?.body instanceof FormData ? init.headers : { 'Content-Type': 'application/json', ...(init?.headers || {}) }
    });
    clearTimeout(timeout);
    const text = await response.text();
    const body = parseBody(text, response.headers.get('content-type'));
    if (!response.ok) {
      let message = `${response.status} ${response.statusText}`;
      if (body && typeof body === 'object') {
        const errorBody = body as Record<string, unknown>;
        const detail = errorBody.detail;
        const error = errorBody.error;
        if (typeof detail === 'string' && detail) {
          message = detail;
        } else if (typeof error === 'string' && error) {
          message = error;
        }
      } else if (typeof body === 'string' && body) {
        message = body;
      }
      throw new Error(message);
    }
    return body as T;
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof DOMException && err.name === 'AbortError') {
      const reason = controller.signal.reason as string;
      throw new Error(reason === 'timeout' ? 'timeout' : 'cancelled');
    }
    throw err;
  }
}

export const api = {
  config: () => request<AppConfig>('/api/config'),
  updateConfig: (patch: Partial<AppConfig>) =>
    request<AppConfig>('/api/config', {
      method: 'PUT',
      body: JSON.stringify(patch)
    }),
  discoverBridges: () =>
    request<DiscoverBridgesResponse | DiscoveredBridge[]>('/api/bridge/discover').then(result =>
      Array.isArray(result)
        ? { bridges: result, scanning: true }
        : { bridges: result.bridges ?? [], scanning: Boolean(result.scanning) }
    ),
  triggerScan: () => request<{ success: boolean; error?: string }>('/api/bridge/scan', { method: 'POST' }),
  getScanLog: () => request<string>('/api/bridge/scan-log'),
  getBridges: () => request<ConfiguredBridge[]>('/api/bridges'),
  scanSerialPorts: () => request<{ ports: SerialPort[] }>('/api/serial/ports').then(result => result.ports),
  addBridge: (host: string, port: number = 80, name?: string, api_key?: string, hostname?: string, transport: string = "wifi", serial_port?: string, baud: number = 460800) =>
    request<ConfiguredBridge>('/api/bridges', {
      method: 'POST',
      body: JSON.stringify({ host, port, name, api_key, hostname, transport, serial_port, baud })
    }),
  updateBridge: (uuid: string, name?: string, host?: string, port?: number, api_key?: string) =>
    request<ConfiguredBridge>(`/api/bridges/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify({ name, host, port, api_key })
    }),
  deleteBridge: (uuid: string) =>
    request<{ deleted: boolean; uuid: string }>(`/api/bridges/${uuid}`, { method: 'DELETE' }),
  activateBridge: (uuid: string) =>
    request<ConfiguredBridge>(`/api/bridges/${uuid}/activate`, { method: 'PUT' }),
  deactivateBridge: (uuid: string) =>
    request<ConfiguredBridge>(`/api/bridges/${uuid}/deactivate`, { method: 'PUT' }),
  bridgeReconnect: (uuid: string) =>
    request<{ reconnected: boolean; uuid: string }>(`/api/bridges/${uuid}/reconnect`, { method: 'POST' }),
  selectBridge: (host: string, port: number, name?: string, version?: string, api_key?: string, network_id?: string, hostname?: string) =>
    request<ConfiguredBridge>('/api/bridge/select', {
      method: 'POST',
      body: JSON.stringify({ host, port, name, version, api_key, network_id, hostname })
    }),
  topology: (bypassCache = false) => {
    const now = Date.now();
    if (!bypassCache && _topologyCache && now - _topologyCache.ts < TOPOLOGY_CACHE_TTL_MS) {
      return Promise.resolve(_topologyCache.data);
    }
    return request<TopologyNode[]>('/api/bridge/topology.json').then(data => {
      _topologyCache = { data, ts: now };
      return data;
    });
  },
  hideDevice: (mac: string) =>
    request<{ mac: string; hidden: boolean }>(`/api/topology/hide/${encodeURIComponent(mac)}`, { method: 'DELETE' }),
  unhideDevice: (mac: string) =>
    request<{ mac: string; hidden: boolean }>(`/api/topology/unhide/${encodeURIComponent(mac)}`, { method: 'POST' }),
  devices: () => request<Record<string, unknown>[]>('/api/devices'),
  device: (mac: string) => request<Record<string, unknown>>(`/api/devices/${encodeURIComponent(mac)}`),
  currentOta: () => request<{ job: OtaJob | null }>('/api/ota/current'),
  currentOtaForDevice: (mac: string) => request<{ job: OtaJob | null }>(`/api/ota/current?mac=${encodeURIComponent(mac)}`),
  uploadFirmware: (mac: string, file: File) => {
    const body = new FormData();
    body.set('mac', mac);
    body.set('file', file);
    return request<UploadResponse>('/api/ota/upload', { method: 'POST', body });
  },
  startOta: (jobId: number) => request<StartResponse>(`/api/ota/start/${jobId}`, { method: 'POST' }),
  abortOta: () => request<{ job: OtaJob | null }>('/api/ota/abort', { method: 'POST' }),
  cancelPending: (jobId: number) => request<{ ok: boolean }>(`/api/ota/pending/${jobId}`, { method: 'DELETE' }),
  getQueue: () => request<QueueResponse>('/api/ota/queue'),
  getQueuePaused: () => request<{ paused: boolean }>('/api/ota/queue/paused'),
  pauseQueue: () => request<{ paused: boolean }>('/api/ota/queue/pause', { method: 'POST' }),
  resumeQueue: () => request<{ paused: boolean }>('/api/ota/queue/resume', { method: 'POST' }),
  abortQueuedJob: (jobId: number) => request<{ ok: boolean }>(`/api/ota/queue/${jobId}/abort`, { method: 'POST' }),
  reorderJobUp: (jobId: number) => request<{ jobs: OtaJob[] }>(`/api/ota/queue/${jobId}/up`, { method: 'POST' }),
  reorderJobDown: (jobId: number) => request<{ jobs: OtaJob[] }>(`/api/ota/queue/${jobId}/down`, { method: 'POST' }),
  history: (mac: string) => request<{ jobs: OtaJob[] }>(`/api/ota/history/${encodeURIComponent(mac)}`),
  jobLog: (jobId: number) => request<JobLogResponse>(`/api/ota/jobs/${jobId}/log`),
  retained: () => request<{ jobs: OtaJob[] }>('/api/firmware/retained'),
  reflash: (jobId: number) => request<ReflashResponse>(`/api/ota/reflash/${jobId}`, { method: 'POST' }),
  deleteRetained: (jobId: number) => request<{ job: OtaJob }>(`/api/firmware/retained/${jobId}`, { method: 'DELETE' }),

  getConfig: (mac: string) => request<DeviceConfig>(`/api/devices/${encodeURIComponent(mac)}/config`),
  saveConfig: (mac: string, content: string, scaffold?: boolean) =>
    request<DeviceConfig>(`/api/devices/${encodeURIComponent(mac)}/config`, {
      method: 'PUT',
      body: JSON.stringify({ content, scaffold })
    }),
  deleteConfig: (mac: string) => request<{ deleted: boolean }>(`/api/devices/${encodeURIComponent(mac)}/config`, { method: 'DELETE' }),
  checkSecrets: (content: string) =>
    request<{ missing_secrets: string[] }>('/api/secrets/check', {
      method: 'POST',
      body: JSON.stringify({ content })
    }),
  importConfig: (mac: string, fileOrContent: File | string) => {
    if (typeof fileOrContent === 'string') {
      return request<DeviceConfig>(`/api/devices/${encodeURIComponent(mac)}/config/import`, {
        method: 'POST',
        body: JSON.stringify({ content: fileOrContent })
      });
    }
    const body = new FormData();
    body.set('file', fileOrContent);
    return request<DeviceConfig>(`/api/devices/${encodeURIComponent(mac)}/config/import`, { method: 'POST', body });
  },
  getConfigStatus: (mac: string) => request<ConfigStatus>(`/api/devices/${encodeURIComponent(mac)}/config/status`),
  compileDevice: (mac: string, autoFlash = false) => {
    const params = autoFlash ? '?auto_flash=true' : '';
    return request<CompileResult>(`/api/devices/${encodeURIComponent(mac)}/compile${params}`, { method: 'POST' });
  },
  getCompileStatus: (mac: string) => request<CompileStatusResponse>(`/api/devices/${encodeURIComponent(mac)}/compile/status`),
  cancelCompile: (mac: string) => request<{ cancelled: boolean; job_id: number; mac: string }>(`/api/devices/${encodeURIComponent(mac)}/compile/cancel`, { method: 'POST' }),
  startCompileFlash: (mac: string) => request<{ job: OtaJob }>(`/api/devices/${encodeURIComponent(mac)}/compile/start-flash`, { method: 'POST' }),
  getCompileHistory: (mac: string) => request<{ jobs: OtaJob[] }>(`/api/devices/${encodeURIComponent(mac)}/compile/history`),

  rebootDevice: (mac: string) => request<ConfigResult>(`/api/devices/${encodeURIComponent(mac)}/reboot`, { method: 'POST' }),
  setHeartbeatInterval: (mac: string, intervalSeconds: number) =>
    request<ConfigResult>(`/api/devices/${encodeURIComponent(mac)}/heartbeat`, {
      method: 'POST',
      body: JSON.stringify({ interval_seconds: intervalSeconds })
    }),
  forceRediscover: (mac: string) => request<ConfigResult>(`/api/devices/${encodeURIComponent(mac)}/rediscover`, { method: 'POST' }),
  setParentMac: (mac: string, parentMac: string, clear = true) =>
    request<ConfigResult>(`/api/devices/${encodeURIComponent(mac)}/parent`, {
      method: 'POST',
      body: JSON.stringify({ parent_mac: parentMac, clear })
    }),
  setRelay: (mac: string, enable: boolean) =>
    request<ConfigResult>(`/api/devices/${encodeURIComponent(mac)}/relay`, {
      method: 'POST',
      body: JSON.stringify({ enable })
    }),

  getCompileQueue: () => request<CompileQueueResponse>('/api/compile/queue'),
  getCompileHistoryAll: (limit = 100) => request<{ jobs: OtaJob[] }>(`/api/compile/history?limit=${limit}`),
  abortCompileJob: (jobId: number) => request<{ ok: boolean; job_id: number }>(`/api/compile/queue/${jobId}/abort`, { method: 'POST' }),

  getAllHistory: async (limit = 100) => {
    const [flash, compile] = await Promise.all([
      request<{ jobs: OtaJob[] }>(`/api/ota/history?limit=${limit}`),
      request<{ jobs: OtaJob[] }>(`/api/compile/history?limit=${limit}`),
    ]);
    const merged = [...flash.jobs, ...compile.jobs];
    merged.sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0));
    return { jobs: merged.slice(0, limit) };
  },

  getSecrets: () => request<{ content: string }>('/api/secrets'),
  saveSecrets: (content: string) => request<{ content: string; saved: boolean }>('/api/secrets', {
    method: 'PUT',
    body: JSON.stringify({ content })
  }),

  getContainerStatus: () => request<ContainerStatusInfo>('/api/compile/container/status'),
  cleanArtifacts: () => request<{ ok: boolean; platformio_cache_bytes: number; esphome_build_bytes: number; total_bytes: number }>('/api/compile/artifacts', { method: 'DELETE' }),

  getSerialPorts: () => request<{ ports: SerialPortInfo[] }>('/api/serial/ports'),
  startSerialFlash: (mac: string, port: string) =>
    request<{ started: boolean; mac: string; esphome_name: string; port: string }>(`/api/devices/${encodeURIComponent(mac)}/flash/serial`, {
      method: 'POST',
      body: JSON.stringify({ port })
    }),
  getSerialFlashStatus: (mac: string) => request<SerialFlashStatus>(`/api/devices/${encodeURIComponent(mac)}/flash/serial/status`),
  cancelSerialFlash: (mac: string) => request<{ cancelled: boolean; mac: string }>(`/api/devices/${encodeURIComponent(mac)}/flash/serial/cancel`, { method: 'POST' }),

  restartRequired: () => request<{ restart_required: boolean; integration_version?: string; created_at?: number; reason?: string | null; running_version?: string | null; latest_version?: string | null; target_version?: string | null; source?: string | null; integration?: AppConfig['integration'] }>('/api/restart-required'),
  requestRestart: () => request<{ success: boolean; error?: string }>('/api/restart', { method: 'POST' }),

  setupStatus: () => request<SetupStatus>('/api/setup-status'),
  integrationSetup: () => request<IntegrationSetupResult>('/api/integration/setup', { method: 'POST' }),

  detectChip: (port: string) =>
    request<{ chip_name: string; board_info: Record<string, string> | null; error?: string }>('/api/bridge/flash-wizard/detect-chip', {
      method: 'POST',
      body: JSON.stringify({ port }),
    }),

  submitFlashWizard: (config: {
    name: string;
    network_id: string;
    psk: string;
    wifi_ssid: string;
    wifi_password: string;
    api_key: string;
    espnow_mode: string;
    ota_password: string;
    chip_name: string;
    board_info: Record<string, string>;
    serial_port?: string;
    transport?: string;
    kind?: 'bridge' | 'remote';
  }) =>
    request<{ status: string; mac: string; esphome_name: string; job_id: number; kind?: string }>('/api/bridge/flash-wizard/submit', {
      method: 'POST',
      body: JSON.stringify(config),
    }),

  getFlashWizardStatus: () =>
    request<FlashWizardStatus>('/api/bridge/flash-wizard/status'),

  finalizeFlashWizard: () =>
    request<{ activated: boolean; uuid?: string; transport?: string; detail?: string }>(
      '/api/bridge/flash-wizard/finalize', { method: 'POST' }),

  streamCompileLogs(mac: string, onLog: (line: string) => void, onError: (err: Event) => void): EventSource {
    const url = apiPath(`/api/devices/${encodeURIComponent(mac)}/compile/logs`);
    const es = new EventSource(url);
    es.onmessage = (event: MessageEvent) => {
      onLog(event.data as string);
    };
    es.addEventListener('status', (event: MessageEvent) => {
      onLog(`[status: ${event.data}]`);
    });
    es.addEventListener('exit', (event: MessageEvent) => {
      onLog(`[build exited with code ${event.data}]`);
    });
    es.addEventListener('queue_position', (event: MessageEvent) => {
      onLog(`[queue position: ${event.data}]`);
    });
    es.onerror = onError;
    return es;
  },

  streamSerialFlashLogs(mac: string, onLog: (line: string) => void, onStatus: (status: string) => void, onError: (err: Event) => void): EventSource {
    const url = apiPath(`/api/devices/${encodeURIComponent(mac)}/flash/serial/logs`);
    const es = new EventSource(url);
    es.onmessage = (event: MessageEvent) => {
      onLog(event.data as string);
    };
    es.addEventListener('status', (event: MessageEvent) => {
      onStatus(event.data as string);
    });
    es.onerror = onError;
    return es;
  },

  downloadFactoryBinary(mac: string): string {
    return apiPath(`/api/devices/${encodeURIComponent(mac)}/firmware/download`);
  },

  downloadCompileBinary(mac: string): string {
    return apiPath(`/api/devices/${encodeURIComponent(mac)}/compile/firmware/download`);
  },

  downloadJobBinary(jobId: number): string {
    return apiPath(`/api/jobs/${jobId}/firmware/download`);
  },

  activityLog(onLine: (line: string) => void, onEnd: () => void, onError: (err: Event) => void): EventSource {
    const url = apiPath('/api/integration/activity');
    const es = new EventSource(url);
    es.addEventListener('line', (event: MessageEvent) => {
      onLine(event.data as string);
    });
    es.addEventListener('end', () => {
      onEnd();
    });
    es.addEventListener('error', (event: MessageEvent) => {
      onError(event as unknown as Event);
    });
    es.onerror = onError;
    return es;
  },
};

export function streamBridgeState(handler: (connected: boolean) => void): TopologyStreamHandle {
  let ws: WebSocket | null = null;
  let closed = false;
  let reconnectDelay = 1000;

  const connect = () => {
    if (closed) return;
    const url = apiPath('/ws/topology');
    ws = new WebSocket(url);
    ws.onopen = () => {
      reconnectDelay = 1000;
    };
    ws.onmessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data as string) as WsTopologyMessage;
        if (msg.type === 'bridge.connection' && typeof msg.payload === 'object' && msg.payload !== null) {
          handler((msg.payload as { connected: boolean }).connected);
        }
      } catch {
      }
    };
    ws.onclose = () => {
      if (!closed) {
        setTimeout(connect, reconnectDelay);
        reconnectDelay = Math.min(reconnectDelay * 2, 10000);
      }
    };
    ws.onerror = () => {
      ws?.close();
    };
  };

  connect();

  return {
    close() {
      closed = true;
      ws?.close();
    },
  };
}

export function streamTopology(handler: (msg: WsTopologyMessage) => void): TopologyStreamHandle {
  let ws: WebSocket | null = null;
  let closed = false;
  let reconnectDelay = 1000;

  const connect = () => {
    if (closed) return;
    const url = apiPath('/ws/topology');
    ws = new WebSocket(url);
    ws.onopen = () => {
      reconnectDelay = 1000;
    };
    ws.onmessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data as string);
        if (msg && msg.type === 'server_id' && typeof msg.value === 'string') {
          if (_serverId !== null && _serverId !== msg.value) {
            location.reload();
          }
          _serverId = msg.value;
        }
        handler(msg as WsTopologyMessage);
      } catch {
      }
    };
    ws.onclose = () => {
      if (!closed) {
        setTimeout(connect, reconnectDelay);
        reconnectDelay = Math.min(reconnectDelay * 2, 10000);
      }
    };
    ws.onerror = () => {
      ws?.close();
    };
  };

  connect();

  return {
    close() {
      closed = true;
      ws?.close();
    },
  };
}

export function normalizeMac(value: string): string {
  const compact = value.replace(/[^0-9A-Fa-f]/g, '');
  if (compact.length !== 12) return value.trim().toUpperCase();
  return compact.match(/.{2}/g)!.join(':').toUpperCase();
}

export function fmtBytes(value?: number | null): string {
  const bytes = value || 0;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function fmtTime(ts?: number | null): string {
  if (!ts) return '-';
  return new Date(ts * 1000).toLocaleString();
}

export function fmtTimeAgo(ts?: number | null): string {
  if (!ts) return '-';
  const diffS = Math.max(0, Math.floor((Date.now() - ts * 1000) / 1000));
  if (diffS < 60) return `${diffS}s ago`;
  if (diffS < 3600) return `${Math.floor(diffS / 60)}m ago`;
  if (diffS < 86400) return `${Math.floor(diffS / 3600)}h ago`;
  return `${Math.floor(diffS / 86400)}d ago`;
}

export function fmtDuration(seconds?: number | null): string {
  if (seconds == null || seconds < 0) return '';
  const value = Number(seconds);
  if (value < 60) return `${Math.round(value)}s`;
  if (value < 3600) return `${Math.floor(value / 60)}m ${Math.round(value % 60)}s`;
  if (value < 86400) {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
  const days = Math.floor(value / 86400);
  if (days < 7) {
    const rem = value % 86400;
    const hours = Math.floor(rem / 3600);
    return `${days}d ${hours}h`;
  }
  const weeks = Math.floor(days / 7);
  const remDays = days % 7;
  return `${weeks}w ${remDays}d`;
}
