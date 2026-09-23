#!/usr/bin/env python3
"""
Standalone ESPHome serial log viewer for /dev/ttyUSB0
Usage: python3 esplog-serial.py <yaml_file> [device_path]
Default device: /dev/ttyUSB0
"""

import subprocess
import sys
import signal
import os
from pathlib import Path

PROJ_DIR = Path(__file__).parent.resolve()
DEMOS_DIR = PROJ_DIR / "demos"
DOCKER_IMG = "ghcr.io/esphome/esphome:2026.4.5"


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 esplog-serial.py <yaml_file> [device_path]")
        print("       device_path defaults to /dev/ttyUSB0")
        sys.exit(1)

    yaml_file = sys.argv[1]
    device = sys.argv[2] if len(sys.argv) > 2 else "/dev/ttyUSB0"

    yaml_path = PROJ_DIR / yaml_file
    if not yaml_path.exists():
        yaml_path = DEMOS_DIR / yaml_file
    if not yaml_path.exists():
        print(f"Error: {yaml_file} not found")
        sys.exit(1)

    container_name = f"esplog-serial-{yaml_path.stem}"
    rel_yml = f"demos/{yaml_path.name}"

    subprocess.run(["docker", "rm", "-f", container_name], capture_output=True)
    print(f"Starting serial log on {device} for {yaml_path.name}...")
    print("Ctrl+C to stop\n")

    proc = subprocess.Popen(
        [
            "docker", "run", "--rm",
            "--name", container_name,
            "--device", f"{device}:{device}",
            "-v", f"{DEMOS_DIR}:/config",
            "-v", f"{PROJ_DIR}:/external",
            "-w", "/external",
            "--network", "host",
            DOCKER_IMG,
            "logs", "--device", device, rel_yml,
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )

    def cleanup():
        try:
            os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
        except (ProcessLookupError, OSError):
            pass

    signal.signal(signal.SIGINT, lambda *_: cleanup())
    signal.signal(signal.SIGTERM, lambda *_: cleanup())

    try:
        for line in proc.stdout:
            sys.stdout.write(line.decode("utf-8", errors="replace"))
            sys.stdout.flush()
    except KeyboardInterrupt:
        pass
    finally:
        cleanup()
        print("\n--- Stopped ---")
