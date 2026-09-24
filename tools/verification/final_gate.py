"""FINAL GATE: take the YAML the real server endpoint wrote, point it at the repo
components, and run it through the real `esphome config` validator."""
import os, subprocess, sys, tempfile
sys.path.insert(0, "/r")
os.environ["ESP_TREE_DATA_DIR"] = tempfile.mkdtemp()

from pathlib import Path
import asyncio, httpx

SECRETS = """espnow_network_id: "0011223344556677"
espnow_psk: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff"
bridge_api_key: "testapikey"
ota_password: "testotapass"
wifi_ssid: "TestSSID"
wifi_password: "TestPass123"
"""
COMPONENTS = "/r/device_code/components"


async def build():
    from app.config import load_settings
    from app.db import Database
    s = load_settings()
    Database(s.database_path).init()
    from app.server import create_app
    app = create_app()
    tr = httpx.ASGITransport(app=app)
    cases = [
        ("final-serial-c5", {"transport": "serial", "chip_name": "ESP32-C5",
            "board_info": {"platform": "esp32-c5", "board": "esp32-c5-devkitc-1",
                           "framework": "esp-idf", "variant": "esp32c5"}}),
        ("final-serial-s3", {"transport": "serial", "chip_name": "ESP32-S3",
            "board_info": {"platform": "esp32-s3", "board": "esp32-s3-devkitc-1",
                           "framework": "esp-idf", "variant": "esp32s3"}}),
        ("final-wifi-c6", {"transport": "wifi", "chip_name": "ESP32-C6",
            "board_info": {"platform": "esp32-c6", "board": "esp32-c6-devkitc",
                           "framework": "esp-idf", "variant": "esp32c6"}}),
    ]
    out = []
    async with httpx.AsyncClient(transport=tr, base_url="http://t") as c:
        for name, extra in cases:
            payload = {"name": name, "network_id": "net1", "psk": "0" * 64,
                       "api_key": "k", "espnow_mode": "regular", "ota_password": "o",
                       "wifi_ssid": "TestSSID", "wifi_password": "pw", **extra}
            r = await c.post("/api/bridge/flash-wizard/submit", json=payload)
            out.append((name, r.status_code))
    from app.yaml_store import YAMLStore
    st = YAMLStore(Path(os.environ["ESP_TREE_DATA_DIR"]) / "devices")
    return out, st


submitted, store = asyncio.run(build())
print("submissions:", submitted)

fails = 0
print("\n" + "=" * 70)
print("REAL `esphome config` ON SERVER-WRITTEN YAML")
print("=" * 70)
for name, code in submitted:
    content = store.get_config(name)
    if not content:
        print(f"FAIL  {name}: nothing written"); fails += 1; continue
    content = content.replace("path: /opt/esp-tree/components", f"path: {COMPONENTS}")
    with tempfile.TemporaryDirectory() as td:
        cfg = os.path.join(td, "d.yaml")
        open(cfg, "w").write(content)
        open(os.path.join(td, "secrets.yaml"), "w").write(SECRETS)
        p = subprocess.run(["esphome", "config", cfg], capture_output=True, text=True, timeout=300)
        ok = p.returncode == 0
        print(f"{'PASS' if ok else 'FAIL'}  {name} (submit HTTP {code})")
        if not ok:
            fails += 1
            for line in ((p.stdout or "") + (p.stderr or "")).splitlines():
                if "Failed config" in line or "Must be" in line or "required" in line.lower():
                    print("       ", line.strip()[:200])
                if line.startswith("  ") and ":" in line and "source" in line:
                    print("       ", line.strip()[:200])

print("=" * 70)
print("FINAL GATE:", "PASSED" if not fails else f"FAILED ({fails})")
sys.exit(1 if fails else 0)
