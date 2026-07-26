#pragma once

/*
 * bridge_web_pages.h
 *
 * Web pages for the ESP-NOW LR bridge
 *
 * Routes added:
 *   GET  /login              — ESPHome-themed login form
 *   POST /api/auth/login     — validates api_key, sets session cookie
 *   POST /api/auth/logout    — clears session cookie
 *   GET  /v2/topology        — WS-powered topology page
 *
 * Pages use WebSocket at /esp-tree/v1/ws with HMAC-SHA256 auth
 * using the same api_key as the login form.
 */

// =========================================================================
// LOGIN PAGE — served at GET /login
// =========================================================================
static const char LOGIN_PAGE_HTML[] = R"raw(<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ESP-NOW LR · Sign In</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{
    font-family:'Inter',system-ui,-apple-system,sans-serif;
    background:#f5f7fa;color:#1c1c1e;min-height:100vh;
    display:flex;flex-direction:column;align-items:center;justify-content:center
  }
  .login-card{
    background:#fff;border-radius:12px;padding:40px;
    box-shadow:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
    border:1px solid #e2e8f0;width:380px;max-width:94vw
  }
  h1{font-size:22px;font-weight:700;letter-spacing:-0.3px;margin-bottom:4px}
  .sub{color:#64748b;font-size:13px;margin-bottom:28px}
  .form-group{display:flex;flex-direction:column;gap:6px;margin-bottom:20px}
  .form-group label{font-size:13px;font-weight:600;color:#1c1c1e}
  .form-group input{
    border:1px solid #cbd5e1;border-radius:8px;padding:10px 14px;
    font-family:inherit;font-size:15px;transition:border-color 0.12s
  }
  .form-group input:focus{outline:none;border-color:#0b3b4b;box-shadow:0 0 0 3px rgba(11,59,75,0.1)}
  .btn{
    display:inline-flex;align-items:center;justify-content:center;gap:6px;
    font-family:inherit;font-size:14px;font-weight:600;
    padding:10px 20px;border-radius:8px;border:none;cursor:pointer;
    transition:all 0.12s;width:100%
  }
  .btn-primary{background:#0b3b4b;color:#fff}
  .btn-primary:hover{background:#0d4d5e}
  .btn-primary:disabled{opacity:0.5;cursor:not-allowed}
  .error-msg{background:#fef2f2;color:#991b1b;padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:16px;display:none}
  .error-msg.visible{display:block}
  .loader{display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.6s linear infinite;vertical-align:middle}
  @keyframes spin{to{transform:rotate(360deg)}}
</style>
</head>
<body>
<div class="login-card">
  <h1>ESP-NOW LR</h1>
  <div class="sub">Bridge Control Panel</div>
  <div id="errorMsg" class="error-msg"></div>
  <form id="loginForm">
    <div class="form-group">
      <label for="apiKey">API Key</label>
      <input type="password" id="apiKey" placeholder="Enter bridge API key" autofocus>
    </div>
    <button type="submit" class="btn btn-primary" id="loginBtn">Sign In</button>
  </form>
</div>
<script>
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var key = document.getElementById('apiKey').value.trim();
  if (!key) return;
  var btn = document.getElementById('loginBtn');
  var errEl = document.getElementById('errorMsg');
  btn.disabled = true;
  btn.innerHTML = '<span class="loader"></span> Signing in...';
  errEl.classList.remove('visible');
  fetch('/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},
    body: new URLSearchParams({api_key: key}).toString()
  }).then(function(r) {
    if (!r.ok) throw new Error('Invalid API key');
    sessionStorage.setItem('espnow_api_key', key);
    var dest = new URLSearchParams(location.search).get('redirect') || '/v2/topology';
    window.location.href = dest;
  }).catch(function(err) {
    btn.disabled = false;
    btn.textContent = 'Sign In';
    errEl.textContent = err.message || 'Authentication failed';
    errEl.classList.add('visible');
  });
});
</script>
</body>
</html>)raw";

// =========================================================================
// TOPOLOGY V2 PAGE — served at GET /v2/topology
// Uses WebSocket for live data, no HTTP polling
// =========================================================================
static const char TOPOLOGY_V2_PAGE_HTML[] = R"raw(<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ESP-NOW LR · Topology</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{
    font-family:'Inter',system-ui,-apple-system,sans-serif;
    background:#f5f7fa;color:#1c1c1e;min-height:100vh;padding:0
  }
  .topbar{
    background:#0b3b4b;color:#fff;display:flex;align-items:center;
    justify-content:space-between;padding:0 24px;height:56px;
    box-shadow:0 1px 3px rgba(0,0,0,0.12);position:sticky;top:0;z-index:100
  }
  .topbar-left{display:flex;align-items:center;gap:16px}
  .topbar-logo{font-size:20px;font-weight:700;letter-spacing:-0.3px}
  .topbar-logo small{font-weight:400;opacity:0.7;font-size:13px;margin-left:6px}
  .topbar-nav{display:flex;gap:4px}
  .topbar-nav a{
    color:rgba(255,255,255,0.8);text-decoration:none;padding:8px 16px;
    border-radius:8px;font-size:14px;font-weight:500;transition:all 0.15s;cursor:pointer
  }
  .topbar-nav a:hover{background:rgba(255,255,255,0.1);color:#fff}
  .topbar-nav a.active{background:rgba(255,255,255,0.18);color:#fff;font-weight:600}
  .badge{display:inline-block;background:#f39c12;color:#fff;font-size:10px;font-weight:700;padding:1px 7px;border-radius:10px;margin-left:5px;vertical-align:middle}
  .topbar-right{display:flex;align-items:center;gap:12px}
  .version{font-size:12px;opacity:0.6}
  .app{max-width:1100px;margin:0 auto;padding:24px}
  .summary{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}
  .summary-card{
    background:#fff;border-radius:12px;padding:20px 24px;
    box-shadow:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
    border:1px solid #e2e8f0
  }
  .summary-card .num{font-size:32px;font-weight:700;color:#0b3b4b;line-height:1.2}
  .summary-card .label{font-size:13px;color:#64748b;margin-top:4px;font-weight:500}
  .card{
    background:#fff;border-radius:12px;
    box-shadow:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
    border:1px solid #e2e8f0;margin-bottom:24px
  }
  .card-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #e2e8f0}
  .card-header h2{font-size:16px;font-weight:600}
  .card-body{padding:16px 20px}
  .tree-node{
    display:flex;align-items:center;gap:12px;padding:12px 14px;
    border:1px solid #e2e8f0;border-radius:10px;background:#fafbfc;
    margin-bottom:6px;cursor:pointer;transition:all 0.12s
  }
  .tree-node:hover{border-color:#0b3b4b;background:#f0f7fa}
  .tree-node .status-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
  .tree-node .status-dot.online{background:#22c55e}
  .tree-node .status-dot.offline{background:#ef4444}
  .tree-node .status-dot.connecting{background:#f59e0b}
  .tree-node .identity{flex:1;min-width:0}
  .tree-node .identity strong{display:block;font-size:14px;font-weight:600}
  .tree-node .identity small{font-size:12px;color:#94a3b8}
  .tree-node .metrics{display:flex;gap:8px;font-size:12px;color:#64748b}
  .tree-node .metrics span{background:#f1f5f9;padding:3px 8px;border-radius:6px;white-space:nowrap}
  .tree-node .chip-badge{background:#0b3b4b;color:#fff;font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px;vertical-align:middle}
  .tree-node .ota-badge{
    background:#0b3b4b;color:#fff;font-size:11px;font-weight:600;
    padding:3px 10px;border-radius:6px;white-space:nowrap;text-decoration:none
  }
  .tree-node .ota-badge.queued{background:#f39c12}
  .tree-node .offline-note{font-size:12px;color:#ef4444;font-weight:500}
  .tree-child{margin-left:32px;border-left:2px solid #e2e8f0;padding-left:16px}
  .btn{
    display:inline-flex;align-items:center;gap:6px;font-family:inherit;
    font-size:13px;font-weight:500;padding:8px 16px;border-radius:8px;
    border:1px solid #e2e8f0;background:#fff;color:#1c1c1e;cursor:pointer;
    transition:all 0.12s
  }
  .btn:hover{background:#f8fafc;border-color:#cbd5e1}
  .btn-primary{background:#0b3b4b;color:#fff;border-color:#0b3b4b}
  .btn-primary:hover{background:#0d4d5e}
  .btn-sm{padding:5px 10px;font-size:12px}
  .hero{
    display:flex;justify-content:space-between;align-items:end;
    padding:20px 24px;margin-bottom:20px;background:#fff;border-radius:12px;
    border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.06)
  }
  .hero h2{font-size:28px;font-weight:700;margin-top:8px}
  .hero p{color:#64748b;font-size:14px;margin-top:6px}
  .state-pill{
    display:inline-block;padding:4px 12px;border-radius:20px;
    font-size:12px;font-weight:600;text-transform:uppercase
  }
  .state-pill.online{background:#dcfce7;color:#166534}
  .state-pill.offline{background:#fef2f2;color:#991b1b}
  .state-pill.connecting{background:#fef3c7;color:#92400e}
  .hero-rssi{font-size:20px;font-weight:700;color:#0b3b4b}
  .layout-2col{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}
  .diag-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
  .diag-item{background:#f8fafc;padding:10px 12px;border-radius:8px;border:1px solid #f1f5f9}
  .diag-item .lbl{font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;margin-bottom:4px}
  .diag-item .val{font-size:14px;font-weight:500;overflow-wrap:anywhere}
  .diag-item.sm{padding:6px 10px}
  .diag-item.sm .lbl{font-size:9px;margin-bottom:2px}
  .diag-item.sm .val{font-size:11px;font-family:monospace;color:#64748b;cursor:pointer}
  .diag-item.sm .val:hover{color:#0b3b4b}
  .detail-panel{display:none}
  .detail-panel.visible{display:block}
  .ws-status{
    display:inline-flex;align-items:center;gap:4px;font-size:11px;padding:3px 10px;
    border-radius:20px;font-weight:500
  }
  .ws-status.connected{background:#dcfce7;color:#166534}
  .ws-status.disconnected{background:#fef2f2;color:#991b1b}
  @media (max-width:768px){
    .summary{grid-template-columns:1fr}
    .layout-2col{grid-template-columns:1fr}
    .diag-grid{grid-template-columns:1fr}
  }
</style>
</head>
<body>
<header class="topbar">
  <div class="topbar-left">
    <div class="topbar-logo">ESP-NOW LR <small>Tree Control</small></div>
  </div>
  <nav class="topbar-nav">
    <a class="active">Topology</a>
  </nav>
  <div class="topbar-right">
    <span class="ws-status disconnected" id="wsStatus">Disconnected</span>
  </div>
</header>
<div class="app">
  <div class="summary">
    <div class="summary-card"><div class="num" id="statOnline">0</div><div class="label">Online Nodes</div></div>
    <div class="summary-card"><div class="num" id="statRemotes">0</div><div class="label">Remotes</div></div>
    <div class="summary-card"><div class="num" id="statOta">IDLE</div><div class="label">OTA State</div></div>
  </div>
  <div class="card">
    <div class="card-header"><h2>Bridge Topology</h2></div>
    <div class="card-body" id="treeContainer"></div>
  </div>
  <div class="detail-panel" id="detailPanel">
    <div class="hero">
      <div>
        <span class="state-pill" id="detState">online</span>
        <h2 id="detName">—</h2>
        <p id="detSub">—</p>
      </div>
      <div class="hero-rssi" id="detRssi">—</div>
    </div>
    <div class="layout-2col">
      <div class="card">
        <div class="card-header"><h2>Diagnostics</h2></div>
        <div class="card-body">
          <div class="diag-grid">
            <div class="diag-item"><div class="lbl">MAC</div><div class="val" id="detMac">—</div></div>
            <div class="diag-item"><div class="lbl">Firmware</div><div class="val" id="detFw">—</div></div>
            <div class="diag-item"><div class="lbl">Project</div><div class="val" id="detProject">—</div></div>
            <div class="diag-item"><div class="lbl">Build</div><div class="val" id="detBuild">—</div></div>
            <div class="diag-item sm"><div class="lbl">MD5</div><div class="val" id="detMd5" title="">—</div></div>
            <div class="diag-item"><div class="lbl">Chip</div><div class="val" id="detChip">—</div></div>
            <div class="diag-item"><div class="lbl">RSSI</div><div class="val" id="detRssiVal">—</div></div>
            <div class="diag-item"><div class="lbl">Hops</div><div class="val" id="detHops">—</div></div>
            <div class="diag-item"><div class="lbl">Last Seen</div><div class="val" id="detLastSeen">—</div></div>
            <div class="diag-item"><div class="lbl">Uptime</div><div class="val" id="detUptime">—</div></div>
            <div class="diag-item"><div class="lbl">Entities</div><div class="val" id="detEntities">—</div></div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h2>Actions</h2></div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:8px">
        </div>
      </div>
    </div>
  </div>
</div>
<script>
(function(){
  var POLL_INTERVAL = 5000;
  var pollTimer = null;
  var topology = [];
  var selectedMac = '';

  function loadTopology() {
    fetch('/api/v1/topology', { credentials: 'include' })
      .then(function(r) {
        if (!r.ok) {
          if (r.status === 401) { window.location.href = '/login?redirect=/v2/topology'; return; }
          throw new Error('fetch failed');
        }
        return r.json();
      })
      .then(function(data) {
        topology = Array.isArray(data) ? data : (data.payload || []);
        renderTopology();
        startPolling();
      })
      .catch(function(e) {
        setWsStatus(false);
        if (pollTimer) { clearTimeout(pollTimer); pollTimer = null; }
        pollTimer = setTimeout(loadTopology, POLL_INTERVAL);
      });
  }

  function startPolling() {
    if (pollTimer) return;
    pollTimer = setTimeout(function() { pollTimer = null; loadTopology(); }, POLL_INTERVAL);
  }

  function fmtUptime(s) {
    var r=[];
    if(s>=86400){var d=Math.floor(s/86400);s%=86400;r.push(d+'d')}
    if(s>=3600){var h=Math.floor(s/3600);s%=3600;r.push(h+'h')}
    if(s>=60){var m=Math.floor(s/60);s%=60;r.push(m+'m')}
    r.push(s+'s');return r.join('');
  }

  function fmtLastSeen(bridge_uptime, last_seen) {
    if (!last_seen || last_seen === 0) return 'never';
    var ago = bridge_uptime - last_seen;
    if (ago < 0) ago = 0;
    return fmtUptime(ago);
  }

  function fmtRssi(rssi) {
    if (rssi === undefined || rssi === null) return '—';
    var pct = rssi <= -100 ? 0 : (rssi >= -60 ? 100 : Math.round((rssi+100)*5/2));
    return rssi + ' dBm';
  }

  function fmtMd5(el, md5) {
    if (!md5) { el.textContent = '—'; el.title = ''; return; }
    var abbr = md5.slice(0, 4) + '...' + md5.slice(-4);
    el.textContent = abbr;
    el.title = 'Click to copy: ' + md5;
    if (el.dataset.md5Listener) return;
    el.dataset.md5Listener = '1';
    el.addEventListener('click', function() {
      navigator.clipboard.writeText(md5).then(function() {
        var orig = el.textContent;
        el.textContent = 'copied!';
        setTimeout(function(){ el.textContent = abbr; }, 1200);
      });
    });
  }

  function renderTopology() {
    if (!topology || topology.length === 0) return;
    var root = topology.find(function(n){return n.hops===0;}) || topology[0];
    var bridgeMac = root ? root.mac : '';
    var bridgeUptime = root && root.bridge_uptime_s ? root.bridge_uptime_s : 0;
    var children = {};
    topology.forEach(function(n){
      var p = n.parent_mac || bridgeMac;
      if (!children[p]) children[p] = [];
      children[p].push(n);
    });
    var stats = {online:0, remotes:0};
    topology.forEach(function(n){if(n.hops!==0)stats.remotes++;if(n.online)stats.online++;});
    document.getElementById('statOnline').textContent = stats.online;
    document.getElementById('statRemotes').textContent = stats.remotes;

    function renderNode(node, isRoot) {
      var div = document.createElement('div');
      div.className = 'tree-node';
      div.onclick = function(){ showDetail(node.mac); };
      var stateClass = node.online ? 'online' : (node.state >= 1 && node.state <= 4 ? 'connecting' : 'offline');
      var dot = document.createElement('span');
      dot.className = 'status-dot ' + stateClass;
      div.appendChild(dot);

      var id = document.createElement('div');
      id.className = 'identity';
      var strong = document.createElement('strong');
      strong.textContent = node.label || node.mac || 'Unknown';
      if (node.chip_name && !isRoot) {
        var chip = document.createElement('span');
        chip.className = 'chip-badge';
        chip.textContent = node.chip_name;
        strong.appendChild(document.createTextNode(' '));
        strong.appendChild(chip);
      }
      id.appendChild(strong);
      var small = document.createElement('small');
      small.textContent = node.mac || '';
      id.appendChild(small);
      div.appendChild(id);

      var metrics = document.createElement('div');
      metrics.className = 'metrics';
      if (!isRoot && node.last_seen_bridge_uptime_s && bridgeUptime > 0) {
        var ls = document.createElement('span');
        ls.textContent = fmtLastSeen(bridgeUptime, node.last_seen_bridge_uptime_s);
        metrics.appendChild(ls);
      }
      if (node.uptime_s > 0) {
        var u = document.createElement('span');
        u.textContent = fmtUptime(node.uptime_s);
        metrics.appendChild(u);
      }
      if (node.rssi !== undefined && node.rssi !== null) {
        var r = document.createElement('span');
        r.textContent = fmtRssi(node.rssi);
        metrics.appendChild(r);
      }
      if (node.chip_name && isRoot) {
        var c = document.createElement('span');
        c.textContent = node.chip_name;
        metrics.appendChild(c);
      }
      div.appendChild(metrics);

      if (!node.online) {
        var off = document.createElement('span');
        off.className = 'offline-note';
        off.textContent = (node.offline_s || 0) + 's offline';
        div.appendChild(off);
      }

      return div;
    }

    function renderSubtree(mac) {
      var container = document.createElement('div');
      if (mac !== '' && mac !== (root ? root.mac : '')) {
        container.className = 'tree-child';
      }
      var nodes = children[mac] || [];
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var el = renderNode(n, false);
        container.appendChild(el);
        var sub = children[n.mac];
        if (sub && sub.length) container.appendChild(renderSubtree(n.mac));
      }
      return container;
    }

    var tc = document.getElementById('treeContainer');
    tc.innerHTML = '';
    if (root) tc.appendChild(renderNode(root, true));
    tc.appendChild(renderSubtree(root ? root.mac : ''));
    if (!selectedMac) selectedMac = root ? root.mac : '';
    showDetail(selectedMac);
  }

  function updateNodeAvailability(payload) {
    var mac = payload.mac || '';
    for (var i = 0; i < topology.length; i++) {
      if (topology[i].mac === mac) {
        topology[i].online = payload.online;
        topology[i].rssi = payload.rssi;
        renderTopology();
        break;
      }
    }
  }

  function showDetail(mac) {
    selectedMac = mac;
    var node = null;
    for (var i = 0; i < topology.length; i++) { if (topology[i].mac === mac) { node = topology[i]; break; } }
    var panel = document.getElementById('detailPanel');
    if (!node) { panel.classList.remove('visible'); return; }
    panel.classList.add('visible');
    var online = node.online;
    document.getElementById('detState').textContent = online ? 'online' : 'offline';
    document.getElementById('detState').className = 'state-pill ' + (online ? 'online' : 'offline');
    document.getElementById('detName').textContent = node.label || node.mac || '—';
    document.getElementById('detSub').textContent = (node.mac || '—') + ' / ' + (node.hops !== undefined ? node.hops + ' hop' + (node.hops !== 1 ? 's' : '') : '—') + ' / uptime ' + (node.uptime_s ? fmtUptime(node.uptime_s) : '—');
    document.getElementById('detRssi').textContent = fmtRssi(node.rssi);
    document.getElementById('detMac').textContent = node.mac || '—';
    document.getElementById('detFw').textContent = node.firmware_version || node.project_version || '—';
    document.getElementById('detProject').textContent = node.project_name || '—';
    document.getElementById('detBuild').textContent = node.firmware_build_date || '—';
    fmtMd5(document.getElementById('detMd5'), node.firmware_md5);
    document.getElementById('detChip').textContent = node.chip_name || '—';
    document.getElementById('detRssiVal').textContent = fmtRssi(node.rssi);
    document.getElementById('detHops').textContent = node.hops !== undefined ? String(node.hops) : '—';
    var root = null;
    for (var i = 0; i < topology.length; i++) { if (topology[i].hops === 0) { root = topology[i]; break; } }
    var bridgeUptime = root && root.bridge_uptime_s ? root.bridge_uptime_s : 0;
    document.getElementById('detLastSeen').textContent = node.last_seen_bridge_uptime_s ? fmtLastSeen(bridgeUptime, node.last_seen_bridge_uptime_s) : '—';
    document.getElementById('detUptime').textContent = node.uptime_s ? fmtUptime(node.uptime_s) : '—';
    document.getElementById('detEntities').textContent = node.entity_count !== undefined ? String(node.entity_count) : '—';
  }

  loadTopology();
})();
</script>
</body>
</html>)raw";
