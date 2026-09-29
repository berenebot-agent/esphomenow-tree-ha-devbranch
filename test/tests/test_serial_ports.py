"""Serial-port enumeration must offer real adapters, never phantom VM UARTs.

Regression: the add-on listed ``/dev/ttyS0..3`` (a VM's virtual UARTs) as selectable
serial ports, so a user could pick one that the serial client can never open. The
list must also prefer ``/dev/serial/by-id/*`` stable names so a saved bridge keeps
resolving across the ``ttyUSB0`` renumbering that happens on replug.
"""

from __future__ import annotations

import os

from app.serial_ports import list_serial_ports


def _touch(path):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("")
    os.chmod(path, 0o666)


def test_phantom_ttyS_ports_are_excluded(tmp_path):
    dev = tmp_path / "dev"
    for name in ("ttyS0", "ttyS1", "ttyS2", "ttyS3"):
        _touch(dev / name)
    _touch(dev / "ttyUSB0")

    ports = list_serial_ports(str(dev))

    names = {p["label"] for p in ports}
    assert names == {"ttyUSB0"}, names


def test_by_id_symlink_and_its_target_are_deduplicated(tmp_path):
    dev = tmp_path / "dev"
    target = dev / "ttyUSB0"
    _touch(target)
    by_id = dev / "serial" / "by-id"
    by_id.mkdir(parents=True)
    link = by_id / "usb-1a86_USB_Serial-if00-port0"
    link.symlink_to(target)

    ports = list_serial_ports(str(dev))

    assert len(ports) == 1, ports
    only = ports[0]
    assert only["by_id"] is True
    assert only["port"].endswith("usb-1a86_USB_Serial-if00-port0")
    assert only["resolved"] == str(target)


def test_empty_dev_dir_returns_no_ports(tmp_path):
    assert list_serial_ports(str(tmp_path / "dev")) == []
