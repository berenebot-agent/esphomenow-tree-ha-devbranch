#!/bin/bash
set -e

cleanup() {
  docker stop -t 5 esptree-ha-test 2>/dev/null || true
  docker rm esptree-ha-test 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Cache defaults to a gitignored directory inside the repo so a fresh clone
# works without configuration. Override with CACHE_DIR=... for a persistent path.
CACHE_DIR="${CACHE_DIR:-${SCRIPT_DIR}/../.cache/ha-tree-addon-cache}"
ENV_FILE="${SCRIPT_DIR}/.env"
IMAGE_NAME="${IMAGE_NAME:-esp-tree-ha}"
AUTO_BUILD="${AUTO_BUILD:-1}"

if [[ -f "$ENV_FILE" ]]; then
    set -a
    source "$ENV_FILE"
    set +a
fi

BRIDGE_HOST="${BRIDGE_HOST:-192.168.1.50}"
BRIDGE_PORT="${BRIDGE_PORT:-80}"
BRIDGE_TRANSPORT="${BRIDGE_TRANSPORT:-ws}"

mkdir -p "$CACHE_DIR"

if [[ "$1" == "--fresh" ]] || [[ "$1" == "-f" ]]; then
  echo "Removing data at $CACHE_DIR..."
  sudo rm -rf "$CACHE_DIR"/*
fi

if [[ "$AUTO_BUILD" != "0" ]]; then
  echo "Building $IMAGE_NAME from main Dockerfile..."
  docker build -t "$IMAGE_NAME" "${SCRIPT_DIR}/.."
fi

docker rm -f esptree-ha-test 2>/dev/null || true

docker run --name esptree-ha-test \
  --network host \
  --entrypoint "" \
  -e BRIDGE_HOST="$BRIDGE_HOST" \
  -e BRIDGE_PORT="$BRIDGE_PORT" \
  -e BRIDGE_TRANSPORT="$BRIDGE_TRANSPORT" \
  -e BRIDGE_API_KEY="$BRIDGE_API_KEY" \
  -e BRIDGE_WS_PERSISTENT="${BRIDGE_WS_PERSISTENT:-true}" \
  -e ESP_TREE_DATA_DIR=/data \
  -e ESP_TREE_DB="${ESP_TREE_DB:-/data/esp_tree/esp_tree.db}" \
  -e LOG_LEVEL=info \
  -v "${CACHE_DIR}:/data" \
  -v "${SCRIPT_DIR}:/tests:ro" \
  "$IMAGE_NAME" \
  uvicorn app.main:app --host 0.0.0.0 --port 8099
