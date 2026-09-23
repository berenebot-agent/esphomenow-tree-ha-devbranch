#!/bin/bash
#
# ESP-NOW LR Log Collector - Screen Runner
# Kills old containers/screen session and starts fresh
#

set -e

PROJ_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_IMG="ghcr.io/esphome/esphome:2026.4.5"
CONTAINER_NAME="esplog-master"
SCREEN_NAME="esplog"

cleanup() {
    echo "==> Cleaning up old containers matching 'esplog-*'..."
    docker ps -a --filter "name=esplog-" --format "{{.Names}}" | while read -r name; do
        echo "   Killing: $name"
        docker kill "$name" 2>/dev/null || true
        docker rm "$name" 2>/dev/null || true
    done

    echo "==> Checking for leftover esplog containers..."
    docker ps -q --filter "ancestor=${DOCKER_IMG}" --filter "name=esplog-" | while read -r cid; do
        if [ -n "$cid" ]; then
            echo "   Force killing container: $cid"
            docker kill "$cid" 2>/dev/null || true
        fi
    done
}

wait_for_http() {
    local attempts=20
    local delay=1
    local url="http://localhost:5555/status"
    for ((i=1; i<=attempts; i++)); do
        if curl -fsS "${url}" >/dev/null 2>&1; then
            return 0
        fi
        sleep "${delay}"
    done
    return 1
}

kill_session() {
    if screen -list | grep -q "\.${SCREEN_NAME}"; then
        echo "==> Killing existing screen session '${SCREEN_NAME}'..."
        screen -S "${SCREEN_NAME}" -X quit 2>/dev/null || true
        sleep 1
        screen -wipe 2>/dev/null || true
    fi
}

stop_session() {
    kill_session
    cleanup
    echo "==> Stopped."
    exit 0
}

case "${1:-}" in
    stop|kill)
        stop_session
        ;;
    restart)
        kill_session
        cleanup
        ;;
    status)
        echo "=== Screen Sessions ==="
        screen -list | grep -E "${SCREEN_NAME}" || echo "  No esplog session running"
        echo ""
        echo "=== esplog Containers ==="
        docker ps -a --filter "name=esplog-" --format "  {{.Names}} ({{.Status}})"
        echo ""
        echo "=== HTTP Server Check ==="
        if curl -fsS http://localhost:5555/status >/dev/null 2>&1; then
            echo "  HTTP server: UP (http://localhost:5555)"
        else
            echo "  HTTP server: DOWN"
        fi
        exit 0
        ;;
esac

kill_session
cleanup

echo "==> Starting ESP-NOW LR Log Collector in screen..."
echo "    Session: ${SCREEN_NAME}"
echo "    HTTP:    http://localhost:5555"
echo ""
echo "    To attach:  screen -r ${SCREEN_NAME}"
echo "    To detach:  Ctrl-A D"
echo "    To stop:    ./esplog-run.sh stop"
echo ""

cd "${PROJ_DIR}"
screen -dmS "${SCREEN_NAME}" bash -c "
    trap 'kill %% 2>/dev/null; exit' INT TERM
    echo 'Starting esplog-master.py...'
    python3 esplog-master.py --serve --port 5555
"

sleep 1
if screen -list | grep -q "\.${SCREEN_NAME}"; then
    if wait_for_http; then
        echo "==> Started. Attach with: screen -r ${SCREEN_NAME}"
    else
        echo "ERROR: Screen session started but HTTP server did not become ready"
        exit 1
    fi
else
    echo "ERROR: Screen session failed to start"
    exit 1
fi
