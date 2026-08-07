#!/bin/bash
#
# ESP-NOW LR ESPHome Build Menu (v2)
# Selection-based menu - select demos then build/flash
#



PROJ_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEMOS_DIR="${PROJ_DIR}/demos"
CACHE_DIR="${PROJ_DIR}/../cache/builds"
DOCKER_CACHE_DIR="${PROJ_DIR}/../cache/docker_compiler"
DOCKER_IMG="ghcr.io/esphome/esphome:latest"

mkdir -p "${CACHE_DIR}"
mkdir -p "${DOCKER_CACHE_DIR}"

mapfile -t YML_FILES < <(find "${DEMOS_DIR}" -maxdepth 1 -name "*.yml" ! -name "secrets*.yml" | sort)

if [ ${#YML_FILES[@]} -eq 0 ]; then
    echo "No demo .yml files found in ${DEMOS_DIR}"
    exit 1
fi

NUM_DEMOS=${#YML_FILES[@]}

SELECTED=()

for i in "${!YML_FILES[@]}"; do
    SELECTED[$i]=0
done

build_name() {
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

ensure_external_components() {
    local yml_file="$1"

    grep -q "^external_components:" "$yml_file" && return 0

    local components
    if grep -q "^espnow_lr_remote:" "$yml_file"; then
        components="espnow_lr_remote, espnow_lr_common"
    elif grep -q "^espnow_lr_bridge:" "$yml_file"; then
        components="espnow_lr_bridge, espnow_lr_common"
    else
        echo "WARNING: Unknown component type in ${yml_file}, skipping external_components injection"
        return 1
    fi

    local comp_line
    comp_line=$(grep -n "^espnow_lr_" "$yml_file" | head -1 | cut -d: -f1)

    awk -v n="$comp_line" -v c="$components" '
        NR == n {
            print "external_components:"
            print "  - source:"
            print "      type: local"
            print "      path: ../components"
            print "    components: [" c "]"
            print ""
        }
        { print }
    ' "$yml_file" > "${yml_file}.tmp" && mv "${yml_file}.tmp" "$yml_file"

    echo "Injected external_components: [${components}]"
}

build_demo() {
    local yml_file="$1"
    local yml_basename
    local esp_name
    local rel_yml
    local build_dir
    local factory_bin
    local ota_bin

    yml_basename="$(build_name "${yml_file}")"
    esp_name="$(esphome_name "${yml_file}")"
    if [ -z "${esp_name}" ]; then
        echo "ERROR: Could not determine ESPHome name from ${yml_file}"
        return 1
    fi
    rel_yml="demos/${yml_basename}.yml"

    echo ""
    echo "==> Building ${yml_basename} ..."
    echo ""

    ensure_external_components "${yml_file}"

    if ! docker run --rm \
        -v "${DEMOS_DIR}:/config" \
        -v "${PROJ_DIR}:/external" \
        -v "${DOCKER_CACHE_DIR}:/root/.platformio" \
        -w /external \
        "${DOCKER_IMG}" compile "${rel_yml}"; then
        echo ""
        echo "ERROR: Docker build failed for ${yml_basename}"
        return 1
    fi

    build_dir="demos/.esphome/build/${esp_name}/.pioenvs/${esp_name}"
    factory_bin="${PROJ_DIR}/${build_dir}/firmware.factory.bin"
    ota_bin="${PROJ_DIR}/${build_dir}/firmware.ota.bin"

    if [ ! -f "${factory_bin}" ] || [ ! -f "${ota_bin}" ]; then
        echo ""
        echo "ERROR: Build output not found at ${build_dir}"
        return 1
    fi

    cp "${factory_bin}" "${CACHE_DIR}/${yml_basename}.bin"
    cp "${ota_bin}"     "${CACHE_DIR}/${yml_basename}.ota.bin"

    echo ""
    echo "==> ${yml_basename} complete."
}

build_selected() {
    local failed=0
    for i in "${!SELECTED[@]}"; do
        if [ "${SELECTED[$i]}" -eq 1 ]; then
            build_demo "${YML_FILES[$i]}" || ((failed++))
        fi
    done
    if [ ${failed} -gt 0 ]; then
        echo "ERROR: ${failed} build(s) failed."
        return 1
    fi
    return 0
}

file_age_minutes() {
    local file="$1"
    if [ ! -f "$file" ]; then
        echo "--"
        return
    fi
    local now=$(date +%s)
    local mtime=$(stat -c %Y "${file}" 2>/dev/null || stat -f %m "${file}" 2>/dev/null)
    local age=$(( (now - mtime) / 60 ))
    echo "${age}m"
}

yaml_hostname() {
    local yml_file="$1"
    local addr
    addr=$(awk '/^[[:space:]]*use_address:[[:space:]]*/ { sub(/^[[:space:]]*use_address:[[:space:]]*/, ""); gsub(/^"|"$/, ""); print; exit }' "${yml_file}")
    if [ -n "${addr}" ]; then
        echo "${addr}"
        return
    fi
    awk '
        /^[[:space:]]*esphome:[[:space:]]*$/ { in_esphome = 1; next }
        in_esphome && /^[[:space:]]{2}name:[[:space:]]*/ {
            sub(/^[[:space:]]*name:[[:space:]]*/, "", $0)
            gsub(/^"|"$/, "", $0)
            print
            exit
        }
    ' "${yml_file}"
}

list_usb_ports() {
    python -m serial.tools.list_ports 2>/dev/null
}

flash_ota() {
    local demo_name="$1"
    local yml_file="${DEMOS_DIR}/${demo_name}.yml"

    local ota_file="${CACHE_DIR}/${demo_name}.ota.bin"
    if [ ! -f "${ota_file}" ]; then
        echo "ERROR: No cached firmware found: ${ota_file}"
        return 1
    fi

    local hostname
    hostname=$(yaml_hostname "${yml_file}")
    if [ -z "${hostname}" ]; then
        echo "ERROR: Could not determine hostname from ${yml_file}"
        return 1
    fi

    if ! ping -c 1 -W 1 "${hostname}" > /dev/null 2>&1; then
        echo "ERROR: Host ${hostname} not reachable, skipping flash."
        return 1
    fi

    echo ""
    echo "==> Flashing ${demo_name} to ${hostname} via Docker OTA..."
    echo ""

    docker run --rm \
        -v "${DEMOS_DIR}:/config" \
        -v "${PROJ_DIR}:/external" \
        -v "${CACHE_DIR}:/external/cache/builds" \
        -v "${DOCKER_CACHE_DIR}:/root/.platformio" \
        -w /external \
        "${DOCKER_IMG}" upload --device "${hostname}" --file "cache/builds/${demo_name}.ota.bin" "demos/${demo_name}.yml"

    local status=$?
    if [ ${status} -eq 0 ]; then
        echo ""
        echo "==> Flash complete!"
    else
        echo "ERROR: Docker upload failed with status ${status}"
        return 1
    fi
}

usb_flash_demo() {
    local port="$1"
    local demo_name="$2"

    local factory_bin="${CACHE_DIR}/${demo_name}.bin"
    if [ ! -f "${factory_bin}" ]; then
        echo "ERROR: No cached firmware found: ${factory_bin}"
        return 1
    fi

    local port_dev="${port}"
    if [[ "$port" != /* ]]; then
        port_dev="/dev/${port}"
    fi
    if [ ! -c "${port_dev}" ]; then
        echo "ERROR: Port ${port_dev} does not exist or is not a character device"
        return 1
    fi

    echo ""
    echo "==> USB flashing ${demo_name} to ${port_dev}..."
    echo ""

    docker run --rm \
        --device "${port_dev}" \
        -v "${DEMOS_DIR}:/config" \
        -v "${PROJ_DIR}:/external" \
        -v "${CACHE_DIR}:/external/cache/builds" \
        -v "${DOCKER_CACHE_DIR}:/root/.platformio" \
        -w /external \
        "${DOCKER_IMG}" upload --device "${port_dev}" --file "cache/builds/${demo_name}.bin" "demos/${demo_name}.yml"

    local status=$?
    if [ ${status} -eq 0 ]; then
        echo ""
        echo "==> USB flash complete!"
    else
        echo "ERROR: Docker upload failed with status ${status}"
        return 1
    fi
}

flash_selected() {
    local failed=0
    for i in "${!SELECTED[@]}"; do
        if [ "${SELECTED[$i]}" -eq 1 ]; then
            local name
            name="$(build_name "${YML_FILES[$i]}")"
            flash_ota "${name}" || ((failed++))
        fi
    done
    if [ ${failed} -gt 0 ]; then
        echo "WARNING: ${failed} flash(es) failed."
        return 1
    fi
    return 0
}

clean_pycache() {
    local count
    count=$(find "${PROJ_DIR}" -type d -name "__pycache__" 2>/dev/null | wc -l)
    if [ "${count}" -eq 0 ]; then
        echo "No __pycache__ folders found."
        return 0
    fi
    find "${PROJ_DIR}" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
    echo "==> Removed ${count} __pycache__ folder(s)"
}

selected_count() {
    local count=0
    for i in "${!SELECTED[@]}"; do
        [ "${SELECTED[$i]}" -eq 1 ] && ((count++))
    done
    echo $count
}

clean_esphome() {
    echo "==> Cleaning build cache..."
    rm -rf "${DEMOS_DIR}/.esphome"
    echo "==> Clean complete. Rebuild needed."
}

USB_PORT=""
USB_DEMO=""

show_usb_port_menu() {
    echo ""
    echo "================================================"
    echo "  USB Flash — Select Port"
    echo "================================================"
    echo ""

    local ports
    ports=$(list_usb_ports)
    if [ -z "${ports}" ]; then
        echo "No serial ports found."
        return 1
    fi

    local port_array=()
    local count=0
    while IFS= read -r line; do
        port_array+=("$line")
        echo "  $((count+1))) $line"
        ((count++))
    done <<< "${ports}"

    echo ""
    echo "  0) Cancel"
    echo ""

    read -rp "Select port: " CHOICE

    if [[ "${CHOICE}" == "0" ]]; then
        return 1
    fi

    if ! [[ "${CHOICE}" =~ ^[0-9]+$ ]] || [ "${CHOICE}" -lt 1 ] || [ "${CHOICE}" -gt ${count} ]; then
        echo "Invalid selection: ${CHOICE}"
        return 1
    fi

    USB_PORT="${port_array[$((CHOICE-1))]}"
    return 0
}

show_usb_demo_menu() {
    local port="$1"
    echo ""
    echo "================================================"
    echo "  USB Flash — Select Demo"
    echo "================================================"
    echo ""
    echo "  Target port: ${port}"
    echo ""
    echo "  Select the demo to flash (USB can only flash one at a time):"
    echo ""

    for i in "${!YML_FILES[@]}"; do
        local check=" "
        [ "${SELECTED[$i]}" -eq 1 ] && check="*"
        printf "  %d) [%s] %-25s\n" $((i+1)) "$check" "$(build_name "${YML_FILES[$i]}")"
    done
    echo ""
    echo "  0) Cancel"
    echo ""

    read -rp "Select demo: " CHOICE

    if [[ "${CHOICE}" == "0" ]]; then
        return 1
    fi

    if ! [[ "${CHOICE}" =~ ^[0-9]+$ ]] || [ "${CHOICE}" -lt 1 ] || [ "${CHOICE}" -gt ${NUM_DEMOS} ]; then
        echo "Invalid selection: ${CHOICE}"
        return 1
    fi

    USB_DEMO="$(build_name "${YML_FILES[$((CHOICE-1))]}")"
    return 0
}

run_usb_flash() {
    local port="$1"
    local demo="$2"

    if [ -n "${port}" ] && [ -n "${demo}" ]; then
        usb_flash_demo "${port}" "${demo}"
        return $?
    fi

    if ! show_usb_port_menu; then
        return 0
    fi

    if ! show_usb_demo_menu "${USB_PORT}"; then
        return 0
    fi

    usb_flash_demo "${USB_PORT}" "${USB_DEMO}"
}

show_menu() {
    echo "================================================"
    echo "  ESP-NOW LR ESPHome Build Menu"
    echo "================================================"
    echo ""
    echo "  Select demos with number keys (toggle on/off):"
    echo ""
    for i in "${!YML_FILES[@]}"; do
        local check=" "
        [ "${SELECTED[$i]}" -eq 1 ] && check="*"
        local age
        age=$(file_age_minutes "${CACHE_DIR}/$(build_name "${YML_FILES[$i]}").ota.bin")
        printf "  %d) [%s] %-25s Age: %s\n" $((i+1)) "$check" "$(build_name "${YML_FILES[$i]}")" "$age"
    done
    echo ""
    local sel_count
    sel_count=$(selected_count)
    echo "  Selected: ${sel_count} / ${NUM_DEMOS}"
    echo ""
    echo "  --- Actions ---"
    echo "  b)  Build selected (${sel_count})"
    echo "  f)  Flash selected (${sel_count})"
    echo "  bf) Build + Flash selected (${sel_count})"
    echo "  u)  USB flash"
    echo "  c)  Clean __pycache__"
    echo "  a)  Select all"
    echo "  n)  Select none"
    echo "  0)  Exit"
    echo ""
}

toggle_selection() {
    local idx=$1
    if [ $idx -lt 0 ] || [ $idx -ge $NUM_DEMOS ]; then
        return 1
    fi
    if [ "${SELECTED[$idx]}" -eq 1 ]; then
        SELECTED[$idx]=0
    else
        SELECTED[$idx]=1
    fi
}

select_all() {
    for i in "${!SELECTED[@]}"; do
        SELECTED[$i]=1
    done
}

select_none() {
    for i in "${!SELECTED[@]}"; do
        SELECTED[$i]=0
    done
}

run_action() {
    local action="$1"
    local sel_count
    sel_count=$(selected_count)

    case "$action" in
        b)
            if [ ${sel_count} -eq 0 ]; then
                echo "No demos selected."
                return 1
            fi
            echo "==> Building ${sel_count} selected demo(s)..."
            build_selected
            ;;
        f)
            if [ ${sel_count} -eq 0 ]; then
                echo "No demos selected."
                return 1
            fi
            echo "==> Flashing ${sel_count} selected demo(s)..."
            flash_selected
            ;;
        bf)
            if [ ${sel_count} -eq 0 ]; then
                echo "No demos selected."
                return 1
            fi
            echo "==> Building ${sel_count} selected demo(s)..."
            build_selected && echo "==> Flashing ${sel_count} selected demo(s)..." && flash_selected
            ;;
        c)
            clean_pycache
            ;;
    esac
}

if [ $# -gt 0 ]; then
    for arg in "$@"; do
        case "$arg" in
            a) select_all ;;
            n) select_none ;;
            b|f|bf|c) run_action "$arg" ;;
            --list-ports)
                python -m serial.tools.list_ports
                exit 0
                ;;
            usb)
                shift
                if [ $# -lt 2 ]; then
                    echo "Usage: compile.sh usb <port> <demo>"
                    echo "  port: /dev/ttyUSB0 or ttyUSB0"
                    echo "  demo: e.g. espnow-bridge-c5"
                    exit 1
                fi
                _usb_port="$1"
                _usb_demo="$2"
                shift 2
                run_usb_flash "${_usb_port}" "${_usb_demo}"
                exit $?
                ;;
            *)
                _demo_name="$(basename "$arg" .yml)"
                if [[ "$arg" =~ ^[0-9]+$ ]] && [ $arg -ge 1 ] && [ $arg -le $NUM_DEMOS ]; then
                    toggle_selection $((arg-1))
                elif [ -f "${DEMOS_DIR}/${_demo_name}.yml" ]; then
                    _found=0
                    for i in "${!YML_FILES[@]}"; do
                        if [[ "$(basename "${YML_FILES[$i]}" .yml)" == "$_demo_name" ]]; then
                            toggle_selection $i
                            _found=1
                            break
                        fi
                    done
                    [ "$_found" -eq 0 ] && echo "Demo not found: $_demo_name"
                else
                    echo "Unknown argument: $arg"
                fi
                ;;
        esac
    done
    exit 0
fi

show_menu
read -rp "Select option: " CHOICE

while [[ "${CHOICE}" != "0" ]]; do
    case "${CHOICE}" in
        a) select_all ;;
        n) select_none ;;
        b|f|bf|c) run_action "${CHOICE}" ;;
        u)
            run_usb_flash
            ;;
        *)
            if [[ "$CHOICE" =~ ^[0-9]+$ ]] && [ $CHOICE -ge 1 ] && [ $CHOICE -le $NUM_DEMOS ]; then
                toggle_selection $((CHOICE-1))
            else
                echo "Invalid option: ${CHOICE}"
            fi
            ;;
    esac

    show_menu
    read -rp "Select option: " CHOICE
done

echo "Exiting."
exit 0
