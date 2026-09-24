#!/usr/bin/env python3
"""Raw-TCP serial bridge for ONE client at a time.

A serial port has a single byte stream: if two clients are attached, their reader
threads compete in ser.read() and steal each other's bytes, which looks exactly
like random disconnects and silent 0-byte sessions. So when a new client connects
we drop the previous one and start clean.

Usage: tcp_serial_bridge.py <port> <device> <baud>
"""
import socket
import sys
import threading
import time

import serial

LISTEN_PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 7000
DEVICE = sys.argv[2] if len(sys.argv) > 2 else "/dev/ttyUSB0"
BAUD = int(sys.argv[3]) if len(sys.argv) > 3 else 460800

ser = serial.Serial(port=DEVICE, baudrate=BAUD, timeout=0.05,
                    rtscts=False, dsrdtr=False)
ser.dtr = False
ser.rts = False
print(f"tcp-serial: {DEVICE} @ {BAUD} ready, listening on 0.0.0.0:{LISTEN_PORT}", flush=True)

srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
srv.bind(("0.0.0.0", LISTEN_PORT))
srv.listen(8)
print("tcp-serial: accepting connections (single client)", flush=True)

current = {"conn": None, "addr": None, "stop": None, "lock": threading.Lock()}


def drop_current(reason: str) -> None:
    """Disconnect the active client so its reader thread stops touching the port."""
    with current["lock"]:
        conn, stop = current["conn"], current["stop"]
        current["conn"] = None
        current["stop"] = None
    if stop:
        stop.set()
    if conn:
        try:
            conn.shutdown(socket.SHUT_RDWR)
        except Exception:
            pass
        try:
            conn.close()
        except Exception:
            pass
        print(f"tcp-serial: dropped previous client ({reason})", flush=True)
    # let the old reader thread notice and exit before the new one starts
    time.sleep(0.25)


def serve(conn, addr) -> None:
    print(f"tcp-serial: client {addr} connected", flush=True)
    stop = threading.Event()

    def reader():
        while not stop.is_set():
            try:
                d = ser.read(4096)
            except Exception as e:
                print(f"tcp-serial: serial read error {e}", flush=True)
                break
            if d:
                print(f"tcp-serial: -> client {len(d)}B {d[:60].hex()}", flush=True)
                try:
                    conn.sendall(d)
                except Exception:
                    break

    t = threading.Thread(target=reader, daemon=True)
    t.start()
    total = 0
    try:
        while True:
            data = conn.recv(4096)
            if not data:
                break
            total += len(data)
            print(f"tcp-serial: <- client {len(data)}B {data[:60].hex()}", flush=True)
            ser.write(data)
            ser.flush()
    except Exception:
        pass
    finally:
        stop.set()
        try:
            conn.close()
        except Exception:
            pass
        print(f"tcp-serial: client {addr} disconnected after {total}B", flush=True)


while True:
    conn, addr = srv.accept()
    drop_current("new client arrived")
    with current["lock"]:
        current["conn"], current["addr"] = conn, addr
    threading.Thread(target=serve, args=(conn, addr), daemon=True).start()
