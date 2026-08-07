from __future__ import annotations

import hashlib
import shutil
import uuid
from pathlib import Path

from fastapi import UploadFile

from .bin_parser import FirmwareInfo, parse_firmware
from .models import now_ts


class FirmwareStore:
    def __init__(self, root: Path, retention_days: int) -> None:
        self.root = root
        self.tmp_dir = root / "tmp"
        self.active_dir = root / "active"
        self.retained_dir = root / "retained"
        self.retention_days = retention_days

    def init(self) -> None:
        self.tmp_dir.mkdir(parents=True, exist_ok=True)
        self.active_dir.mkdir(parents=True, exist_ok=True)
        self.retained_dir.mkdir(parents=True, exist_ok=True)

    async def save_upload(self, upload: UploadFile) -> tuple[str, Path, int, str, FirmwareInfo]:
        upload_id = uuid.uuid4().hex
        tmp_path = self.tmp_dir / f"{upload_id}.part"
        active_path = self.active_dir / f"{upload_id}.bin"
        md5 = hashlib.md5()
        size = 0

        with tmp_path.open("wb") as handle:
            while True:
                chunk = await upload.read(1024 * 1024)
                if not chunk:
                    break
                size += len(chunk)
                md5.update(chunk)
                handle.write(chunk)

        if size == 0:
            tmp_path.unlink(missing_ok=True)
            raise ValueError("firmware file is empty")

        if not upload.filename or not upload.filename.endswith(".ota.bin"):
            tmp_path.unlink(missing_ok=True)
            raise ValueError("firmware file must be an OTA image (.ota.bin); a factory .bin would brick the device over ESP-NOW")

        info = parse_firmware(tmp_path)
        if not info.valid:
            tmp_path.unlink(missing_ok=True)
            raise ValueError(info.error or "invalid firmware image")

        tmp_path.replace(active_path)
        return upload_id, active_path, size, md5.hexdigest(), info

    def retain(self, path_value: str | None, job_id: int) -> tuple[str | None, int | None]:
        if not path_value:
            return None, None
        source = Path(path_value)
        if not source.exists():
            return None, None
        retained_path = self.retained_dir / f"job-{job_id}-{source.name}"
        if source.resolve() != retained_path.resolve():
            retained_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(source), retained_path)
        retained_until = now_ts() + self.retention_days * 86400
        return str(retained_path), retained_until

    def clone_retained(self, path_value: str) -> Path:
        source = Path(path_value)
        if not source.exists():
            raise FileNotFoundError("retained firmware binary is missing")
        upload_id = uuid.uuid4().hex
        active_path = self.active_dir / f"{upload_id}.bin"
        shutil.copy2(source, active_path)
        return active_path

    def cleanup_partials(self) -> None:
        for path in self.tmp_dir.glob("*.part"):
            path.unlink(missing_ok=True)

    def delete_file(self, path_value: str | None) -> None:
        if path_value:
            Path(path_value).unlink(missing_ok=True)
