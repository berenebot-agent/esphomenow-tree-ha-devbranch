#!/usr/bin/env python3
"""Decisive test: run the ADD-ON'S OWN handshake (ClientHello -> AuthChallenge ->
AuthResponse -> snapshot) against the C5 over the local serial port.

This tests the real protocol end-to-end without needing a network serial bridge,
because the wire protocol is identical either way - only the transport differs.

Mirrors app/bridge_serial_client.py exactly: same framing (COBS + 0x00), same
HMAC digest input, same message order.
"""
import hashlib
import hmac
import secrets
import sys
import time
import uuid

sys.path.insert(0, "/r/app/protobuf/generated")
import esp_tree_runtime_pb2 as pb  # noqa: E402

import serial  # noqa: E402

# COBS encode (byte-stuffing, 0x00 delimiter)
def cobs_encode(data: bytes) -> bytes:
    out = bytearray()
    code = 1
    code_idx = 0
    out.append(0)  # placeholder
    for b in data:
        if b == 0:
            out[code_idx] = code
            code = 1
            code_idx = len(out)
            out.append(0)
        else:
            out.append(b)
            code += 1
            if code == 0xFF:
                out[code_idx] = code
                code = 1
                code_idx = len(out)
                out.append(0)
    out[code_idx] = code
    return bytes(out)


def cobs_decode(data: bytes) -> bytes:
    out = bytearray()
    i = 0
    while i < len(data):
        c = data[i]
        i += 1
        if c == 0:
            break
        for _ in range(c - 1):
            if i < len(data):
                out.append(data[i])
                i += 1
        if c < 0xFF and i < len(data):
            out.append(0)
    return bytes(out)


PORT = "socket://127.0.0.1:7000"
BAUD = 460800
API_KEY = sys.argv[1] if len(sys.argv) > 1 else "k"
PROTOCOL = "esp-tree-pb"
API_VERSION = 2
CLIENT_KIND = "addon"


def main():
    ser = serial.serial_for_url(url=PORT, baudrate=BAUD, timeout=0.3)
    time.sleep(1.0)

    def send(env):
        data = env.SerializeToString()
        ser.write(cobs_encode(data) + b"\x00")
        ser.flush()

    print(f"=== opening {PORT} @ {BAUD}, api_key len={len(API_KEY)} ===")

    # 1. client hello (the add-on speaks first)
    hello = pb.Envelope(
        request_id=uuid.uuid4().hex,
        api_version=API_VERSION,
        client_hello=pb.ClientHello(request_full_snapshot=True,
                                    integration_version="addon"),
    )
    send(hello)
    print("-> sent ClientHello")

    # 2. wait for auth_challenge
    buf = bytearray()
    corrupt = [0]
    challenge = None
    t0 = time.time()
    while time.time() - t0 < 12:
        d = ser.read(4096)
        if not d:
            continue
        buf.extend(d)
        while b"\x00" in buf:
            idx = buf.index(0)
            frame, buf = bytes(buf[:idx]), buf[idx + 1:]
            if len(frame) < 3:
                continue
            try:
                env = pb.Envelope()
                env.ParseFromString(cobs_decode(frame))
            except Exception:
                corrupt[0] += 1
                continue
            kind = env.WhichOneof("msg")
            print(f"<- {kind} (frame {len(frame)}B)")
            if kind == "auth_challenge":
                challenge = env
                break
        if challenge:
            break

    print(f"   (ignored {corrupt[0]} non-protocol frames = ROM boot banner at wrong baud)")
    if challenge is None:
        print("RESULT: FAIL - no auth_challenge received from bridge")
        ser.close()
        return 1

    # 3. respond (same digest input as the add-on)
    client_nonce = secrets.token_bytes(16)
    digest_input = (
        f"{PROTOCOL}|v2|{CLIENT_KIND}|"
        f"{challenge.auth_challenge.server_nonce.hex()}|{client_nonce.hex()}"
    ).encode()
    digest = hmac.new(API_KEY.encode(), digest_input, hashlib.sha256).digest()

    auth_resp = pb.Envelope(
        request_id=uuid.uuid4().hex,
        api_version=API_VERSION,
        auth_response=pb.AuthResponse(
            client_kind=CLIENT_KIND,
            client_name="ESP Tree Add-on",
            client_nonce=client_nonce,
            hmac_sha256=digest,
        ),
    )
    send(auth_resp)
    print("-> sent AuthResponse")

    # 4. look for auth_ok / snapshot
    got_ok = got_snapshot = False
    t0 = time.time()
    while time.time() - t0 < 40:
        d = ser.read(4096)
        if not d:
            continue
        buf.extend(d)
        while b"\x00" in buf:
            idx = buf.index(0)
            frame, buf = bytes(buf[:idx]), buf[idx + 1:]
            if len(frame) < 3:
                continue
            try:
                env = pb.Envelope()
                env.ParseFromString(cobs_decode(frame))
            except Exception:
                corrupt[0] += 1
                continue
            kind = env.WhichOneof("msg")
            print(f"<- {kind} (frame {len(frame)}B)")
            if kind == "full_snapshot":
                fs = env.full_snapshot
                print(f"   bridge id: {fs.bridge.identity.chip_model if fs.HasField('bridge') else '?'}")
                print(f"   remotes: {len(fs.remotes)}  entities: {len(fs.entities)}")
            if kind == "auth_ok":
                got_ok = True
            elif kind in ("full_snapshot", "snapshot"):
                got_snapshot = True
                print("   SNAPSHOT RECEIVED")
        if got_ok and got_snapshot:
            break

    ser.close()
    print()
    if got_ok and got_snapshot:
        print("RESULT: PASS - auth_ok + snapshot over serial. TRANSPORT WORKS.")
        return 0
    if got_ok:
        print("RESULT: PARTIAL - auth_ok received, no snapshot yet.")
        return 0
    print("RESULT: FAIL - no auth_ok after auth_response")
    return 1


if __name__ == "__main__":
    sys.exit(main())
