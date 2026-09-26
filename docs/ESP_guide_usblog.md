# USB Serial Logging Guide

Standalone serial log viewer for devices connected via USB/serial (e.g., `/dev/ttyUSB0`), without needing OTA or network connectivity.

---

## Requirements

- Docker + `ghcr.io/esphome/esphome:latest`
- Read/write access to the serial port (typically requires `dialout` group membership)
- A device YAML file from `demos/`

### Permission Setup (if needed)

```bash
sudo usermod -a -G dialout $USER
# Then log out and back in, or reboot.
```

---

## Usage

Run from the repository root:

```bash
python3 device_code/scripts/ha_esplog_serial.py <yaml_file> [device_path]
```

| Argument       | Default         | Description                        |
|----------------|-----------------|------------------------------------|
| `yaml_file`    | (required)      | YAML from `device_code/demos/` or absolute path |
| `device_path`  | `/dev/ttyUSB0`  | Serial device path                 |

**Examples:**

```bash
# Using default /dev/ttyUSB0
python3 device_code/scripts/ha_esplog_serial.py espnow-microusb-1.yml

# Explicit device
python3 device_code/scripts/ha_esplog_serial.py espnow-microusb-1.yml /dev/ttyUSB1

# Absolute path to YAML
python3 device_code/scripts/ha_esplog_serial.py /path/to/mydevice.yml /dev/ttyUSB0
```

**Stopping:** `Ctrl+C` — cleans up the Docker container automatically.

---

## How It Works

- Spawns a Docker container with `--device /dev/ttyUSB0` for direct serial access
- Runs `esphome logs --device /dev/ttyUSB0 <yaml>` inside the container
- Streams raw serial output to stdout with ANSI color codes preserved
- Auto-removes the container on exit (no cleanup needed)

---

## Relationship to OTA Logging (`esplog-master.py`)

`ha_esplog_serial.py` and `esplog-master.py` are **completely independent**:

| Feature               | `esplog-master.py`              | `ha_esplog_serial.py`        |
|-----------------------|----------------------------------|-------------------------------|
| Transport             | OTA (WiFi/mDNS)                  | USB serial direct             |
| Device target         | `--device OTA`                   | `--device /dev/ttyUSB0`      |
| Multi-device          | Yes (auto-scans `demos/`)        | No (one device per invocation)|
| HTTP UI               | Yes (`:5555`)                    | No                            |
| SQLite logging        | Yes                              | No (raw stdout only)          |
| Docker container per device | Yes                      | No (single container, one-shot)|
| Use case              | Remote/misc devices on network   | Direct USB debug              |

`esplog-master.py` is a bench tool and lives outside this repository (in the
project's `tools/archive/`), alongside its runner `ha_esplog_run.sh`. The
script in this repo is `ha_esplog_serial.py` only.

Running `ha_esplog_serial.py` has **zero effect** on any devices being logged by `esplog-master.py` via OTA. They are separate subprocesses with no shared state.

---

## Troubleshooting

**"Permission denied" on serial port:**
```bash
sudo usermod -a -G dialout $USER
# Then log out/in and retry.
```

**No output / device not responding:**
- Verify the device is connected: `ls /dev/ttyUSB0`
- Check baud rate in YAML matches device (default 115200)
- Try pressing the device's RESET button

**Docker exited immediately:**
- Run with verbose output to see Docker errors:
```bash
docker run --rm --device /dev/ttyUSB0:/dev/ttyUSB0 \
  -v $(pwd)/demos:/config \
  -v $(pwd):/external -w /external \
  --network host ghcr.io/esphome/esphome:latest \
  logs --device /dev/ttyUSB0 demos/espnow-microusb-1.yml
```
