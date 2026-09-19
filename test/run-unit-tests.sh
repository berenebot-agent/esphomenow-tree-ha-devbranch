#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE="${PYTHON_TEST_IMAGE:-python:3.13-slim}"

docker run --rm \
  -e PYTHONDONTWRITEBYTECODE=1 \
  -e PYTHONUNBUFFERED=1 \
  -v "${ROOT}:/repo:ro" \
  -w /repo \
  "${IMAGE}" \
  sh -euc '
    python -m pip install --disable-pip-version-check --no-cache-dir \
      -r requirements.txt -r test/requirements-test.txt
    python -m pytest -p no:cacheprovider test/tests -v
    cd ha_integration
    python -m pytest -p no:cacheprovider tests -v
  '
