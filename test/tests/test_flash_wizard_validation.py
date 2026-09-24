from __future__ import annotations

import pytest
from fastapi import HTTPException

from app.flash_wizard import validate_board, validate_flash_name, validate_remote_network_credentials
from app.yaml_store import YAMLStore


class FakeDatabase:
    def __init__(self, *, provisioning=None, remote=None):
        self.provisioning = provisioning
        self.remote = remote

    def get_provisioning_bridge(self):
        return self.provisioning

    def get_device(self, mac):
        return self.remote


def test_remote_network_mismatch_rejected_before_yaml_mutation(tmp_path):
    store = YAMLStore(tmp_path)
    store.save_config("unrelated-device", "preserve me")

    with pytest.raises(HTTPException) as exc:
        validate_remote_network_credentials("different", "psk", "configured", "psk")

    assert exc.value.status_code == 400
    assert store.get_config("unrelated-device") == "preserve me"


def test_existing_unrelated_name_rejected_but_in_progress_target_is_resubmittable(tmp_path):
    store = YAMLStore(tmp_path)
    store.save_config("bridge-one", "existing")

    with pytest.raises(HTTPException) as exc:
        validate_flash_name("bridge-one", is_remote=False, yaml_store=store, db=FakeDatabase())
    assert exc.value.status_code == 409

    validate_flash_name(
        "bridge-one", is_remote=False, yaml_store=store,
        db=FakeDatabase(provisioning={"name": "bridge-one"}),
    )


def test_board_validation_rejects_chip_board_mismatch():
    supported = {"ESP32-C3": {"platform": "esp32-c3", "board": "esp32-c3-devkitm-1"}}
    with pytest.raises(HTTPException) as exc:
        validate_board("ESP32-C3", {"platform": "esp32", "board": "esp32dev"}, supported)
    assert exc.value.status_code == 400
    validate_board(
        "ESP32-C3", {"platform": "esp32", "board": "esp32-c3-devkitm-1"}, supported
    )
