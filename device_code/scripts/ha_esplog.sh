#!/bin/bash
#
# ESP-NOW LR ESPHome Log Viewer
# Connects to ESPHome devices via mDNS/OTA and streams logs to terminal
#

set -e

PROJ_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEMOS_DIR="${PROJ_DIR}/demos"
DOCKER_IMG="ghcr.io/esphome/esphome:2026.4.5"

mapfile -t YML_FILES < <(find "${DEMOS_DIR}" -maxdepth 1 -name "*.yml" ! -name "secrets*.yml" | sort)

if [ ${#YML_FILES[@]} -eq 0 ]; then
    echo "No demo .yml files found in ${DEMOS_DIR}"
    exit 1
fi

yaml_basename() {
    basename "$1" .yml
}

esphome_name() {
    awk '
        /^[[:space:]]*esphome:[[:space:]]*$/ { in_esphome = 1; next }
        in_esphome && /^[[:space:]]{2}name:[[:space:]]*/ {
            sub(/^[[:space:]]*name:[[:space:]]*/, "", $0)
            gsub(/^"|"$/, "", $0)
            print
            exit
        }
    ' "$1"
}

cleanup_esplog() {
    local running
    running=$(docker ps -q --filter "ancestor=${DOCKER_IMG}" --filter "status=running" 2>/dev/null)
    if [ -n "${running}" ]; then
        echo "==> Cleaning up previous esplog sessions..."
        docker kill "${running}" 2>/dev/null || true
    fi
}

log_device() {
    local yml_file="$1"
    local yml_basename
    local esp_name
    local rel_yml

    cleanup_esplog

    yml_basename="$(yaml_basename "${yml_file}")"
    esp_name="$(esphome_name "${yml_file}")"
    if [ -z "${esp_name}" ]; then
        echo "ERROR: Could not determine ESPHome name from ${yml_file}"
        return 1
    fi
    rel_yml="demos/${yml_basename}.yml"

    echo ""
    echo "==> Connecting to ${esp_name} (${yml_basename}) ..."
    echo "    Ctrl+C to disconnect"
    echo ""

    docker run --rm \
        -v "${DEMOS_DIR}:/config" \
        -v "${PROJ_DIR}:/external" \
        -w /external \
        --env-file /dev/null \
        "${DOCKER_IMG}" logs --device OTA "${rel_yml}"
}

show_menu() {
    echo "================================================"
    echo "  ESP-NOW LR ESPHome Log Viewer"
    echo "================================================"
    echo ""
    local i
    for i in "${!YML_FILES[@]}"; do
        local name
        name="$(esphome_name "${YML_FILES[$i]}")"
        printf "  %d) %s\n" $((i+1)) "${name:-$(yaml_basename "${YML_FILES[$i]}")}"
    done
    echo ""
    echo "  0) Exit"
    echo ""
}

find_by_name() {
    local name="$1"
    for yml in "${YML_FILES[@]}"; do
        local bn
        bn="$(yaml_basename "$yml")"
        if [[ "${bn,,}" == "${name,,}" ]]; then
            echo "$yml"
            return 0
        fi
    done
    return 1
}

if [ $# -gt 0 ]; then
    CHOICE="$1"

    if [[ "${CHOICE}" == "0" ]]; then
        echo "Exiting."
        exit 0
    fi

    yml_file="$(find_by_name "${CHOICE}")"
    if [ -z "$yml_file" ]; then
        if ! [[ "${CHOICE}" =~ ^[0-9]+$ ]] || \
           [ "${CHOICE}" -lt 1 ] || \
           [ "${CHOICE}" -gt ${#YML_FILES[@]} ]; then
            echo "Invalid selection: ${CHOICE}"
            exit 1
        fi
        yml_file="${YML_FILES[$((CHOICE-1))]}"
    fi

    log_device "$yml_file"
    exit $?
fi

show_menu
read -rp "Select device to log: " CHOICE

if [[ "${CHOICE}" == "0" || -z "${CHOICE}" ]]; then
    echo "Exiting."
    exit 0
fi

if ! [[ "${CHOICE}" =~ ^[0-9]+$ ]] || \
   [ "${CHOICE}" -lt 1 ] || \
   [ "${CHOICE}" -gt ${#YML_FILES[@]} ]; then
    echo "Invalid selection."
    exit 1
fi

log_device "${YML_FILES[$((CHOICE-1))]}"