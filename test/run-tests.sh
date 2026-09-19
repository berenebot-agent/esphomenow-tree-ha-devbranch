#!/bin/bash
set -e

IMAGE_NAME="${IMAGE_NAME:-esp-tree-ha}"
CONTAINER_NAME="esptree-ha-test"

if ! docker ps --format '{{.Names}}' | grep -q "$CONTAINER_NAME"; then
  echo "Container $CONTAINER_NAME not running. Start with: ./start-ha.sh"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Installing test dependencies in container..."
docker exec "$CONTAINER_NAME" pip3 install --break-system-packages pytest pytest-asyncio

echo "Running tests from $SCRIPT_DIR/tests/..."
docker exec -e PYTHONUNBUFFERED=1 -e PYTHONPATH=/opt/esp-tree "$CONTAINER_NAME" \
  python3 -m pytest /tests/tests/ -v "$@"
