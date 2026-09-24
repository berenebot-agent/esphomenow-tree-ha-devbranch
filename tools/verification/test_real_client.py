#!/usr/bin/env python3
"""Run the add-on's REAL SerialBridgeClient against the TCP serial bridge and print
whatever it logs. This isolates whether the add-on's client (not my harness) can do
the socket:// handshake, and surfaces the exact exception.
"""
import asyncio
import logging
import sys

sys.path.insert(0, "/r")

logging.basicConfig(level=logging.DEBUG, format="%(levelname)s %(name)s: %(message)s")

from app.bridge_serial_client import SerialBridgeClient  # noqa: E402
from app.models import BridgeTarget  # noqa: E402


async def main():
    target = BridgeTarget(
        host="",
        port=0,
        name="c5-serial-bridge",
        api_key="k",
        transport="serial",
        serial_port=sys.argv[1] if len(sys.argv) > 1 else "socket://127.0.0.1:7000",
        baud=460800,
    )
    frames = []

    async def on_frame(client, env, raw):
        kind = env.WhichOneof("msg")
        frames.append(kind)
        print(f"    >>> FRAME RECEIVED: {kind}", flush=True)

    async def on_conn(client, connected):
        print(f"    >>> CONNECTION CHANGE: connected={connected}", flush=True)

    client = SerialBridgeClient(
        "test-uuid", target,
        on_frame=on_frame,
        on_connection_change=on_conn,
    )
    client.start()
    await asyncio.sleep(35)
    print()
    print("frames seen:", frames)
    print("connected:", client.connected)
    await client.stop()


if __name__ == "__main__":
    asyncio.run(main())
