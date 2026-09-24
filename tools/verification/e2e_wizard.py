"""End-to-end: exercise the REAL /api/bridge/flash-wizard/submit endpoint with
transport=serial, then validate the YAML the server actually wrote. This is the
gate that matters - it tests the handler, not just generate_scaffold()."""
import asyncio, json, sys, os, tempfile
sys.path.insert(0, "/r")

os.environ["ESP_TREE_DATA_DIR"] = tempfile.mkdtemp()

import httpx

async def main():
    from app.config import load_settings
    from app.db import Database
    _s = load_settings()
    _db = Database(_s.database_path)
    _db.init()   # create schema for the temp data dir
    from app.server import create_app
    app = create_app()
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://t") as c:

        async def submit(label, payload):
            r = await c.post("/api/bridge/flash-wizard/submit", json=payload)
            body = r.text
            print(f"\n== {label} == HTTP {r.status_code}")
            try:
                print("   ", json.dumps(r.json())[:260])
            except Exception:
                print("   ", body[:260])
            return r

        base = {
            "name": "e2e-serial-c5",
            "network_id": "network1",
            "psk": "0" * 64,
            "api_key": "key123",
            "espnow_mode": "regular",
            "ota_password": "otapw",
            "chip_name": "ESP32-C5",
            "board_info": {"platform": "esp32-c5", "board": "esp32-c5-devkitc-1",
                           "framework": "esp-idf", "variant": "esp32c5"},
        }

        # 1. serial, with NO wifi credentials at all -> must succeed
        r1 = await submit("SERIAL, no wifi creds", {**base, "transport": "serial"})
        ok1 = r1.status_code == 200

        # 2. wifi -> must still require/accept wifi creds and emit wifi:
        r2 = await submit("WIFI", {**base, "name": "e2e-wifi-s3", "transport": "wifi",
                                   "wifi_ssid": "MyNet", "wifi_password": "pw",
                                   "chip_name": "ESP32-S3",
                                   "board_info": {"platform": "esp32-s3", "board": "esp32-s3-devkitc-1",
                                                  "framework": "esp-idf", "variant": "esp32s3"}})
        ok2 = r2.status_code == 200

        # 3. bad transport -> must be rejected
        r3 = await submit("BAD transport", {**base, "transport": "carrier-pigeon"})
        ok3 = r3.status_code == 400

        # 4. omitted transport -> defaults to wifi, so wifi creds required?
        r4 = await submit("OMITTED transport (defaults wifi)", {**base, "name": "e2e-default"})
        print("    -> omitted transport status:", r4.status_code)

    # ---- now read back what the server wrote and check the YAML -------------
    from app.yaml_store import YAMLStore
    from pathlib import Path
    store = YAMLStore(Path(os.environ["ESP_TREE_DATA_DIR"]) / "devices")

    print("\n" + "=" * 68)
    print("SERVER-WRITTEN YAML CHECK")
    print("=" * 68)
    fails = []
    if not ok1:
        fails.append("serial submit rejected (should succeed without wifi creds)")
    if not ok2:
        fails.append("wifi submit rejected")
    if not ok3:
        fails.append("bad transport not rejected")

    try:
        print("stored configs:", store.list_configs())
    except Exception as exc:
        print("(could not list configs:", exc, ")")

    for nm in ("e2e-serial-c5", "e2e-wifi-s3"):
        try:
            content = store.get_config(nm)
        except Exception as exc:
            print(f"{nm}: LOAD FAILED {exc}")
            continue
        print(f"\n--- {nm} ---")
        if content is None:
            fails.append(f"{nm}: no YAML written")
            print("(nothing written)")
            continue
        print(content)
        if nm.endswith("serial-c5"):
            if "wifi:" in content:
                fails.append("serial config contains a wifi: block")
            if "serial_transport:" not in content:
                fails.append("serial config missing serial_transport:")
            if "tx_pin: GPIO11" not in content:
                fails.append("serial config missing C5 tx pin")
            if "wifi_ssid" in content:
                fails.append("serial config references a wifi secret")
        else:
            if "wifi:" not in content:
                fails.append("wifi config missing wifi: block")
            if "serial_transport:" in content:
                fails.append("wifi config contains serial_transport:")

    print("\n" + "=" * 68)
    if fails:
        print("FAILURES:")
        for f in fails:
            print("  -", f)
        sys.exit(1)
    print("E2E SERVER ENDPOINT TEST PASSED")

asyncio.run(main())
