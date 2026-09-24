#!/usr/bin/env python3
"""Run the add-on's real BridgeV2Manager with a serial target."""
import asyncio, logging, sys
sys.path.insert(0, "/r")
logging.basicConfig(level=logging.DEBUG, format="%(levelname)s %(name)s: %(message)s")
for noisy in ("asyncio", "urllib3", "websockets"):
    logging.getLogger(noisy).setLevel(logging.WARNING)
from app.bridge_v2_client import BridgeV2Manager

class FakeDB:
    def list_enabled_bridges(self): return []

async def main():
    mgr = BridgeV2Manager(FakeDB())
    async def on_conn(client, connected):
        print(f"    >>> CONN: connected={connected}", flush=True)
    async def on_frame(client, env, raw):
        print(f"    >>> FRAME: {env.WhichOneof('msg')}", flush=True)
    mgr._handle_connection_change = on_conn
    mgr._handle_bridge_frame = on_frame
    await mgr.sync_bridges([{
        "uuid":"test-serial-uuid","name":"c5-serial-bridge","host":"","port":0,
        "api_key":"k","network_id":"","transport":"serial",
        "serial_port":"socket://127.0.0.1:7000","baud":460800,"enabled":1,
    }])
    print("=== watching 50s ===", flush=True)
    await asyncio.sleep(50)

if __name__ == "__main__":
    asyncio.run(main())
