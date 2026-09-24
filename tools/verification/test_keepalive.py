"""Prove the keepalive sends Ping when idle and stops when the session ends."""
import asyncio, sys, time
sys.path.insert(0, "/r")

from app import bridge_serial_client as mod
from app.bridge_serial_client import SerialBridgeClient, KEEPALIVE_INTERVAL_S, CONNECTION_TIMEOUT_S


def check(label, cond, detail=""):
    print(("  PASS  " if cond else "  FAIL  ") + label + (f"  [{detail}]" if detail else ""))
    return cond


async def main():
    fails = []
    sent = []

    c = SerialBridgeClient.__new__(SerialBridgeClient)
    c.bridge_uuid = "t"
    c._stop_event = __import__("threading").Event()
    c._connected = True
    c._pending = {}
    c._loop = asyncio.get_running_loop()
    c._last_data_time = time.monotonic()
    c.target = type("T", (), {"name": "t", "api_key": "k", "serial_port": "/dev/null", "baud": 460800})()
    c._port_desc = lambda: "test"

    from app.protobuf.generated import esp_tree_runtime_pb2 as pb

    async def fake_send(env):
        # Only the wire is stubbed, so the real request() still assigns request_id
        # and registers the pending future exactly as it does in production.
        sent.append(env)
        fut = c._pending.get(env.request_id)
        if fut and not fut.done():
            fut.set_result(pb.Envelope(request_id=env.request_id, pong=pb.Pong(monotonic_ms=1)))
    c._send_async = fake_send

    print("\n== constants sane ==")
    fails.append(0) if not check("KEEPALIVE_INTERVAL_S < CONNECTION_TIMEOUT_S",
        KEEPALIVE_INTERVAL_S < CONNECTION_TIMEOUT_S, f"{KEEPALIVE_INTERVAL_S} < {CONNECTION_TIMEOUT_S}") else None

    print("\n== no ping while data is flowing ==")
    c._last_data_time = time.monotonic()
    task = asyncio.ensure_future(c._keepalive_loop())
    await asyncio.sleep(3)
    ok = check("idle < interval -> no ping sent", len(sent) == 0, f"sent={len(sent)}")
    if not ok: fails.append(1)

    print("\n== ping sent once idle exceeds the interval ==")
    c._last_data_time = time.monotonic() - (KEEPALIVE_INTERVAL_S + 1)
    await asyncio.sleep(2)
    ok = check("ping sent when idle", len(sent) >= 1, f"sent={len(sent)}")
    if not ok: fails.append(2)
    if sent:
        ok = check("message is a ping", sent[0].WhichOneof("msg") == "ping", sent[0].WhichOneof("msg"))
        if not ok: fails.append(3)
        ok = check("ping has request_id", bool(sent[0].request_id))
        if not ok: fails.append(4)

    print("\n== stops when the session ends ==")
    c._stop_event.set()
    await asyncio.sleep(2.5)
    n = len(sent)
    await asyncio.sleep(2)
    ok = check("no further pings after stop", len(sent) == n, f"{n} -> {len(sent)}")
    if not ok: fails.append(5)

    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass

    print("\n== disconnected -> no ping ==")
    c._stop_event.clear()
    c._connected = False
    c._last_data_time = time.monotonic() - 999
    before = len(sent)
    t2 = asyncio.ensure_future(c._keepalive_loop())
    await asyncio.sleep(3)
    ok = check("no ping while disconnected", len(sent) == before, f"{before} -> {len(sent)}")
    if not ok: fails.append(6)
    t2.cancel()
    try:
        await t2
    except asyncio.CancelledError:
        pass

    print("\n" + "=" * 58)
    if fails:
        print("FAILED:", fails); sys.exit(1)
    print("KEEPALIVE TESTS PASSED")

asyncio.run(main())
