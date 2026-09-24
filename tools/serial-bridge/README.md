# Serial bridge (TCP passthrough)

Exposes a local serial device as a raw TCP socket so the ESP Tree add-on can talk
to a bridge over serial when it is not physically attached to HAOS.

HAOS USB passthrough on this test box only shows root hubs, so the C5 bridge lives
on the dev host instead. The add-on's serial target is pointed at
`socket://<dev-host>:7000`, which pyserial handles via `serial_for_url()`.

## Run

```bash
./tools/serial-bridge/run.sh                  # /dev/ttyUSB0, 460800, port 7000
./tools/serial-bridge/run.sh /dev/ttyACM0 460800 7000
```

Then set the add-on's serial target to `socket://<dev-host-ip>:7000`.

Stop it with `docker rm -f tcp-serial`.

## Single-client semantics — read before changing

The bridge serves **one client at a time** and evicts the incumbent when a new
connection arrives (`dropped previous client` in the log). Two consequences that
have already caused bugs:

- **Never healthcheck it with a TCP connect.** An accepted connection disconnects
  the real add-on, so a connecting healthcheck manufactures exactly the flapping it
  is meant to detect. `tcp_serial_healthcheck.sh` verifies the listener by reading
  `/proc/net/tcp` and checks the process via `/proc`, making no connection at all.
- **Never run a second client against it** (a test harness, a second add-on)
  while the real one is attached; they steal each other's bytes and the link
  appears to flap.

The same trap bit in reverse: the ESPHome base image's inherited healthcheck probes
port 6052 (the dashboard), which this container never serves, so an unmodified
container reports `unhealthy` forever and hides the real state. `run.sh` sets an
explicit healthcheck.

## Why the serial link needs a keepalive

A serial bridge only speaks when it has something to send, so a healthy-but-idle
session looks identical to a dead one and the client's no-data timer tears it down
— a metronomic flap (`disconnected after <N>B` at a fixed interval, each cycle
re-authenticating and refetching the full snapshot).

The websocket client gets keepalive for free from `websockets`
(`ping_interval=30`); the serial client implements it: a protobuf `Ping` (field 21,
wire tag `aa01`) after `KEEPALIVE_INTERVAL_S` idle, answered by the device's
existing `Pong` (field 22, tag `b201`) handler. On the wire a ping/pong pair is two
~47B frames carrying the *same* `request_id`.

To check it is working, count `disconnected after` lines in the log over several
minutes and assert the delta is 0 — don't eyeball "looks stable".

## Layout

- `tcp_serial_bridge.py` — the passthrough server (single-client).
- `tcp_serial_healthcheck.sh` — connection-free readiness check.
- `run.sh` — starts the container with the correct device, port and healthcheck.

Verification harnesses live in `tools/verification/`. Build artefacts and one-off
output belong in the gitignored `.local/` at the repo root, not in ad-hoc folders
elsewhere on the filesystem.
