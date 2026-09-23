#!/bin/bash
set -e

cleanup() {
  docker stop -t 5 esptree-homeassistant-addon-test 2>/dev/null || true
  docker rm esptree-homeassistant-addon-test 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CACHE_DIR="${CACHE_DIR:-/home/ben/projects/cache/ha-tree-addon-cache}"
ENV_FILE="${SCRIPT_DIR}/.env"
IMAGE_NAME="${IMAGE_NAME:-esphome-standalone-test}"
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
  echo "Removing database at $CACHE_DIR..."
  sudo rm -rf "$CACHE_DIR"/*
else
  read -p "Delete database for a full fresh start? (y/N) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Removing database at $CACHE_DIR..."
    sudo rm -rf "$CACHE_DIR"/*
  fi
fi

if [[ "$AUTO_BUILD" != "0" ]]; then
  docker build -t "$IMAGE_NAME" -f "${SCRIPT_DIR}/Dockerfile.standalone" "${SCRIPT_DIR}/.."
fi

docker rm -f esptree-homeassistant-addon-test 2>/dev/null || true

docker run -it --name esptree-homeassistant-addon-test \
  --network host \
  -e BRIDGE_HOST="$BRIDGE_HOST" \
  -e BRIDGE_PORT="$BRIDGE_PORT" \
  -e BRIDGE_TRANSPORT="$BRIDGE_TRANSPORT" \
  -e BRIDGE_API_KEY="$BRIDGE_API_KEY" \
  -e BRIDGE_WS_PERSISTENT="${BRIDGE_WS_PERSISTENT:-true}" \
  -e ESP_TREE_DATA_DIR=/data \
  -e LOG_LEVEL=info \
  -v "${CACHE_DIR}:/data" \
  "$IMAGE_NAME"
