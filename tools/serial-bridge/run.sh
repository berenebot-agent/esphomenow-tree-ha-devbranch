#!/usr/bin/env bash
# Run the serial-bridge TCP passthrough against a real device.
#
# Why this exists: the add-on speaks to the bridge over a serial port, but the
# bridge here is on a different host from HAOS (HAOS USB passthrough shows only
# root hubs), so we expose the local serial device as a raw TCP socket and point
# the add-on's serial target at `socket://<host>:7000`.
#
# Single-client by design: the bridge serves ONE client and evicts the incumbent
# when a new connection arrives. Do not add a healthcheck that connects to it --
# that would disconnect the real client every interval. The bundled healthcheck
# reads /proc/net/tcp instead, so it verifies the listener without connecting.
#
#   ./tools/serial-bridge/run.sh [serial_port] [baud] [tcp_port]
#
# Defaults: /dev/ttyUSB0, 460800, 7000 (matches the add-on's serial target).

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DEVICE="${1:-/dev/ttyUSB0}"
BAUD="${2:-460800}"
PORT="${3:-7000}"

NAME="tcp-serial"
IMAGE="ghcr.io/esphome/esphome:2026.6.5"

if [ ! -e "$DEVICE" ]; then
  echo "error: $DEVICE not found. Pass the serial device as the first argument." >&2
  exit 1
fi

echo "running $NAME: $DEVICE @ $BAUD -> tcp 0.0.0.0:$PORT"
docker rm -f "$NAME" >/dev/null 2>&1 || true

# The repo is mounted (read-only) at /r so the bridge script comes from version
# control; the gitignored scratch dir is /w for anything the run needs to write.
docker run -d --name "$NAME" --restart unless-stopped \
  --device="$DEVICE" -p "${PORT}:${PORT}" \
  -v "$REPO_ROOT":/r:ro \
  --health-cmd "/bin/sh /r/tools/serial-bridge/tcp_serial_healthcheck.sh" \
  --health-interval 30s --health-timeout 10s --health-retries 3 \
  --health-start-period 15s \
  --entrypoint python3 "$IMAGE" \
  /r/tools/serial-bridge/tcp_serial_bridge.py "$PORT" "$DEVICE" "$BAUD" >/dev/null

sleep 8
docker ps --filter "name=$NAME" --format '{{.Names}} | {{.Status}}'
echo
echo "point the add-on's serial target at: socket://$(hostname -I | awk '{print $1}'):$PORT"
echo "logs: docker logs -f $NAME"
