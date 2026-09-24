"""Run the add-on's REAL SerialBridgeClient against the real bridge for 5 minutes
and count session interruptions. Before the keepalive fix this flapped every ~92s."""
import asyncio, os, sys, time
sys.path.insert(0, "/r")
os.environ.setdefault("ESP_TREE_DATA_DIR", "/tmp/soak")

from app.bridge_serial_client import SerialBridgeClient
from app.models import BridgeTarget
from app.bridge_constants import API_VERSION

PORT = sys.argv[1] if len(sys.argv) > 1 else "socket://127.0.0.1:7000"
API_KEY = os.environ["API_KEY"]
DURATION = float(sys.argv[2]) if len(sys.argv) > 2 else 300.0

events = []

def on_frame(client, env, raw):
    kind = env.WhichOneof("msg")
    events.append(("frame", kind, time.monotonic()))

def on_conn(client, connected):
    events.append(("conn", connected, time.monotonic()))

async def main():
    target = BridgeTarget(host="", port=0, source="soak", name="soak",
                          api_key=API_KEY, transport="serial", serial_port=PORT, baud=460800)
    c = SerialBridgeClient(bridge_uuid="soak", target=target,
                           on_frame=on_frame, on_connection_change=on_conn)
    c.start()
    t0 = time.monotonic()
    print(f"soaking {PORT} for {DURATION}s ...", flush=True)
    while time.monotonic() - t0 < DURATION:
        await asyncio.sleep(10)
        el = int(time.monotonic() - t0)
        conns = [e for e in events if e[0] == "conn"]
        drops = [e for e in conns if e[1] is False]
        frames = [e for e in events if e[0] == "frame"]
        print(f"[{el:3d}s] connected={c.connected} connects={sum(1 for e in conns if e[1])} "
              f"disconnects={len(drops)} frames={len(frames)}", flush=True)
    await c.stop()

    conns = [e for e in events if e[0] == "conn"]
    ups = [e for e in conns if e[1]]
    downs = [e for e in conns if e[1] is False]
    pongs = [e for e in events if e[0] == "frame" and e[1] == "pong"]
    kinds = {}
    for e in events:
        if e[0] == "frame":
            kinds[e[1]] = kinds.get(e[1], 0) + 1

    print("\n" + "=" * 62)
    print(f"SOAK RESULT over {int(DURATION)}s")
    print(f"  connects    : {len(ups)}")
    print(f"  disconnects : {len(downs)}")
    print(f"  frame kinds : {kinds}")
    if len(ups) >= 2:
        gaps = [ups[i+1][2] - ups[i][2] for i in range(len(ups)-1)]
        print(f"  session gaps: {[round(g,1) for g in gaps]}")
    verdict = "STABLE (single session, no flapping)" if len(ups) <= 1 else \
              f"FLAPPING ({len(ups)} sessions)"
    print(f"  VERDICT     : {verdict}")
    print("=" * 62)

asyncio.run(main())
