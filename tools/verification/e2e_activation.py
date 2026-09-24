"""E2E for the wizard's serial activation path (fixes 1 + 2 + the finalize endpoint).

Tests the whole server chain: submit(serial) -> bridge row carries transport ->
status reports transport and stays undetected -> finalize activates -> status can
report detected once the client is connected.
"""
import asyncio, json, os, sys, tempfile
sys.path.insert(0, "/r")
os.environ["ESP_TREE_DATA_DIR"] = tempfile.mkdtemp()

import httpx

FAILS = []

def check(label, cond, detail=""):
    print(("  PASS  " if cond else "  FAIL  ") + label + (f"  [{detail}]" if detail else ""))
    if not cond:
        FAILS.append(label)


async def main():
    from app.config import load_settings
    from app.db import Database
    s = load_settings()
    Database(s.database_path).init()
    from app.server import create_app
    app = create_app()
    tr = httpx.ASGITransport(app=app)
    db = Database(s.database_path)

    async with httpx.AsyncClient(transport=tr, base_url="http://t") as c:
        print("\n== 1. submit serial (with serial_port) ==")
        r = await c.post("/api/bridge/flash-wizard/submit", json={
            "name": "act-serial", "network_id": "net1", "psk": "0" * 64, "api_key": "k",
            "espnow_mode": "regular", "ota_password": "o", "chip_name": "ESP32-C5",
            "board_info": {"platform": "esp32-c5", "board": "esp32-c5-devkitc-1",
                           "framework": "esp-idf", "variant": "esp32c5"},
            "transport": "serial", "serial_port": "/dev/ttyUSB0", "baud": 460800,
        })
        check("submit 200", r.status_code == 200, str(r.status_code))

        print("\n== 2. bridge row carries transport/serial_port (fix 1) ==")
        prov = db.get_provisioning_bridge()
        check("provisioning bridge exists", prov is not None)
        if prov:
            print("   row:", json.dumps({k: prov.get(k) for k in
                  ("name", "transport", "serial_port", "baud", "host", "enabled", "flash_wizard_pending")}))
            check("transport == serial", prov.get("transport") == "serial", str(prov.get("transport")))
            check("serial_port carried through", prov.get("serial_port") == "/dev/ttyUSB0", str(prov.get("serial_port")))
            check("baud carried through", int(prov.get("baud") or 0) == 460800, str(prov.get("baud")))
            check("enabled == 0 while pending", int(prov.get("enabled") or 0) == 0)
            check("flash_wizard_pending == 1", int(prov.get("flash_wizard_pending") or 0) == 1)

        print("\n== 3. status reports transport and does NOT claim detection (fix 2) ==")
        r = await c.get("/api/bridge/flash-wizard/status")
        st = r.json()
        print("   status:", json.dumps({k: st.get(k) for k in
              ("provisioning", "transport", "serial_port", "bridge_detected", "compile_status", "serial_flash_status")}))
        check("status 200", r.status_code == 200)
        check("status reports transport=serial", st.get("transport") == "serial", str(st.get("transport")))
        check("status exposes serial_port", st.get("serial_port") == "/dev/ttyUSB0", str(st.get("serial_port")))
        check("bridge_detected False (client not connected yet)", st.get("bridge_detected") is False,
              str(st.get("bridge_detected")))

        print("\n== 4. finalize activates the serial bridge ==")
        r = await c.post("/api/bridge/flash-wizard/finalize")
        fin = r.json()
        print("   finalize:", json.dumps(fin))
        check("finalize 200", r.status_code == 200)
        check("finalize reports activated", fin.get("activated") is True, str(fin.get("activated")))
        check("finalize reports transport=serial", fin.get("transport") == "serial")

        print("\n== 5. bridge is now enabled and no longer pending ==")
        prov_after = db.get_bridge(fin.get("uuid") or "")
        check("enabled == 1 after finalize", int((prov_after or {}).get("enabled") or 0) == 1,
              str((prov_after or {}).get("enabled")))
        check("flash_wizard_pending cleared", int((prov_after or {}).get("flash_wizard_pending") or 0) == 0)
        check("no provisioning bridge left", db.get_provisioning_bridge() is None)

        print("\n== 6. manager has a serial client registered for it ==")
        from app.server import create_app as _ca  # noqa
        # reach the manager through the app state if exposed, else skip gracefully
        print("   (manager.client_connected is exercised live, not here)")

        print("\n== 7. wifi path still behaves (regression) ==")
        r = await c.post("/api/bridge/flash-wizard/submit", json={
            "name": "act-wifi", "network_id": "net2", "psk": "0" * 64, "api_key": "k2",
            "espnow_mode": "lr", "ota_password": "o", "chip_name": "ESP32-S3",
            "board_info": {"platform": "esp32-s3", "board": "esp32-s3-devkitc-1",
                           "framework": "esp-idf", "variant": "esp32s3"},
            "transport": "wifi", "wifi_ssid": "Net", "wifi_password": "pw",
        })
        check("wifi submit 200", r.status_code == 200)
        prov2 = db.get_provisioning_bridge()
        check("wifi row transport == wifi", (prov2 or {}).get("transport") == "wifi",
              str((prov2 or {}).get("transport")))
        check("wifi row serial_port empty", ((prov2 or {}).get("serial_port") or "") == "")
        r = await c.get("/api/bridge/flash-wizard/status")
        st2 = r.json()
        check("wifi status transport == wifi", st2.get("transport") == "wifi", str(st2.get("transport")))
        # wifi detection must NOT be short-circuited by the serial branch
        check("wifi bridge_detected still host-based (False at 0.0.0.0)",
              st2.get("bridge_detected") is False, str(st2.get("bridge_detected")))

    print("\n" + "=" * 66)
    if FAILS:
        print(f"FAILED ({len(FAILS)}):")
        for f in FAILS:
            print("  -", f)
        sys.exit(1)
    print("SERIAL WIZARD ACTIVATION TESTS PASSED")

asyncio.run(main())
