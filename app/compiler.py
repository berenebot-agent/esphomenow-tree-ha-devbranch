from __future__ import annotations

import asyncio
import json
import os
import shutil
import signal
import subprocess
from dataclasses import dataclass
import re
from pathlib import Path
from typing import Any, AsyncGenerator

from .bin_parser import parse_firmware
from .compile_store import CompileStore
from .yaml_scaffold import CHIP_NAME_TO_BOARD


@dataclass
class CompileResult:
    success: bool
    esphome_name: str
    ota_bin_path: str | None = None
    factory_bin_path: str | None = None
    firmware_info: Any = None
    error: str | None = None
    build_log: str = ""


@dataclass
class FlashResult:
    success: bool
    esphome_name: str
    port: str
    error: str | None = None
    build_log: str = ""
    flashed_bytes: int | None = None


class ESPHomeCompiler:
    def __init__(
        self,
        compile_store: CompileStore,
        devices_root: Path,
        components_root: Path,
        platformio_cache: Path,
    ) -> None:
        self.compile_store = compile_store
        self.devices_root = devices_root
        self.components_root = components_root
        self.platformio_cache = platformio_cache
        self._active_procs: dict[str, asyncio.subprocess.Process] = {}
        self._secrets_paths: dict[str, Path] = {}
        self._serial_proc: asyncio.subprocess.Process | None = None
        self._serial_esphome_name: str | None = None
        self._serial_lock = asyncio.Lock()
        self._serial_reserved = False

    def _lazy_venv_root(self) -> Path:
        return Path(os.environ.get("ESP_TREE_DATA_DIR", "/data")) / "esphome_venv"

    def _esphome_bin(self) -> str:
        candidates = [
            self._lazy_venv_root() / "bin" / "esphome",
            Path("/opt/esp-tree/venv/bin/esphome"),
        ]
        override = os.environ.get("ESP_TREE_ESPHOME_BIN", "").strip()
        if override:
            candidates.insert(0, Path(override))
        for candidate in candidates:
            if candidate and candidate.exists():
                return str(candidate)
        return "esphome"

    def _esptool_bin(self) -> str:
        candidates = [
            self._lazy_venv_root() / "bin" / "esptool",
            self._lazy_venv_root() / "bin" / "esptool.py",
            Path("/opt/esp-tree/venv/bin/esptool"),
            Path("/opt/esp-tree/venv/bin/esptool.py"),
        ]
        override = os.environ.get("ESP_TREE_ESPTOOL_BIN", "").strip()
        if override:
            candidates.insert(0, Path(override))
        for candidate in candidates:
            if candidate.exists():
                return str(candidate)
        return "esptool"

    def _pinned_esphome_version(self) -> str | None:
        req_file = Path("/opt/esp-tree/requirements-compile.txt")
        if not req_file.exists():
            return None
        for line in req_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith("#") or not line:
                continue
            if "esphome" in line.lower():
                m = re.search(r"==([^\s;]+)", line)
                if m:
                    return m.group(1)
        return None

    def _installed_esphome_version(self) -> str | None:
        venv_root = self._lazy_venv_root()
        marker = venv_root / "ESP_TREE_ESPHOME_VERSION"
        if marker.exists():
            return marker.read_text(encoding="utf-8").strip()
        return None

    def _bootstrap_esphome_sync(self, log_path: Path, installed: str | None, pinned: str | None) -> None:
        venv_root = self._lazy_venv_root()
        if venv_root.exists():
            shutil.rmtree(venv_root, ignore_errors=True)
        venv_root.mkdir(parents=True, exist_ok=True)
        log_path.parent.mkdir(parents=True, exist_ok=True)
        with log_path.open("a", encoding="utf-8") as lf:
            if installed is not None:
                lf.write(f"ESPHome version changed ({installed} -> {pinned}), reinstalling...\n")
            else:
                lf.write("Installing ESPHome (first compile)...\n")
            lf.flush()
            subprocess.run(
                ["python3", "-m", "venv", str(venv_root)],
                check=True,
                stdout=lf,
                stderr=subprocess.STDOUT,
            )
            lf.flush()
            req_file = Path("/opt/esp-tree/requirements-compile.txt")
            subprocess.run(
                [str(venv_root / "bin" / "pip"), "install", "--no-cache-dir", "--upgrade", "pip"],
                check=True,
                stdout=lf,
                stderr=subprocess.STDOUT,
            )
            lf.flush()
            subprocess.run(
                [str(venv_root / "bin" / "pip"), "install", "--no-cache-dir", "-r", str(req_file)],
                check=True,
                stdout=lf,
                stderr=subprocess.STDOUT,
            )
            lf.write("ESPHome installation complete.\n")

    async def _ensure_esphome(self, log_path: Path) -> None:
        pinned = self._pinned_esphome_version()
        installed = self._installed_esphome_version()
        if installed is not None and installed == pinned:
            esphome_bin = self._lazy_venv_root() / "bin" / "esphome"
            if esphome_bin.exists():
                os.environ["ESP_TREE_ESPHOME_BIN"] = str(esphome_bin)
                os.environ["ESP_TREE_ESPTOOL_BIN"] = str(self._lazy_venv_root() / "bin" / "esptool")
                return
        await asyncio.to_thread(self._bootstrap_esphome_sync, log_path, installed, pinned)
        venv_root = self._lazy_venv_root()
        if pinned:
            (venv_root / "ESP_TREE_ESPHOME_VERSION").write_text(pinned, encoding="utf-8")
        os.environ["ESP_TREE_ESPHOME_BIN"] = str(venv_root / "bin" / "esphome")
        os.environ["ESP_TREE_ESPTOOL_BIN"] = str(venv_root / "bin" / "esptool")

    @staticmethod
    def _fix_yaml_path(yaml_path: Path) -> None:
        if not yaml_path.exists():
            return
        content = yaml_path.read_text(encoding="utf-8")
        fixed = re.sub(
            r"^(\s*path\s*:\s*)\.\./components\s*$",
            r"\1/opt/esp-tree/components",
            content,
            flags=re.MULTILINE,
        )
        if fixed != content:
            yaml_path.write_text(fixed, encoding="utf-8")

    def _compile_env(self) -> dict[str, str]:
        env = dict(os.environ)
        try:
            compile_jobs = max(1, int(os.environ.get("ESP_TREE_COMPILE_JOBS", "1") or "1"))
        except ValueError:
            compile_jobs = 1
        env["PLATFORMIO_CORE_DIR"] = str(self.platformio_cache)
        env["GIT_PYTHON_GIT_EXECUTABLE"] = "/usr/bin/git"
        env.setdefault("SCONSFLAGS", f"-j{compile_jobs}")
        env.setdefault("MAKEFLAGS", f"-j{compile_jobs}")
        env.setdefault("CMAKE_BUILD_PARALLEL_LEVEL", str(compile_jobs))
        env.pop("ESPHOME_IS_HA_ADDON", None)
        env.pop("ESPHOME_DATA_DIR", None)
        return env

    def _artifact_dir(self, esphome_name: str) -> Path:
        return self.devices_root / esphome_name / ".esphome" / "build" / esphome_name / ".pioenvs" / esphome_name

    def _serial_log_path(self, esphome_name: str) -> Path:
        return self.devices_root / esphome_name / "serial_flash.log"

    def _serial_status_path(self, esphome_name: str) -> Path:
        return self.devices_root / esphome_name / "serial_flash_status.json"

    def _find_artifact(self, esphome_name: str, filename: str, suffix: str) -> Path | None:
        expected = self._artifact_dir(esphome_name) / filename
        if expected.exists():
            return expected
        build_root = self.devices_root / esphome_name / ".esphome" / "build" / esphome_name
        if not build_root.exists():
            return None
        for path in sorted(build_root.rglob(f"*{suffix}")):
            if path.is_file():
                return path
        return None

    async def compile(self, esphome_name: str) -> CompileResult:
        yaml_path = self.devices_root / esphome_name / f"{esphome_name}.yaml"
        if not yaml_path.exists():
            error = f"YAML config not found: {yaml_path}"
            self.compile_store.set_status(esphome_name, "failed", error=error)
            return CompileResult(success=False, esphome_name=esphome_name, error=error)

        self._fix_yaml_path(yaml_path)

        self.platformio_cache.mkdir(parents=True, exist_ok=True)
        log_path = self.compile_store._log_path(esphome_name)
        log_path.parent.mkdir(parents=True, exist_ok=True)
        log_path.write_text("", encoding="utf-8")

        self.compile_store.set_status(esphome_name, "pulling_image")
        await self._ensure_esphome(log_path)
        self.compile_store.set_status(esphome_name, "compiling")

        secrets_src = self.devices_root / "secrets.yaml"
        secrets_dst = self.devices_root / esphome_name / "secrets.yaml"

        try:
            if secrets_src.exists():
                shutil.copy2(secrets_src, secrets_dst)
                self._secrets_paths[esphome_name] = secrets_dst

            proc = await asyncio.create_subprocess_exec(
                self._esphome_bin(),
                "compile",
                str(yaml_path),
                env=self._compile_env(),
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.STDOUT,
                start_new_session=True,
            )
            self._active_procs[esphome_name] = proc

            assert proc.stdout is not None
            with log_path.open("a", encoding="utf-8") as log_file:
                while True:
                    raw = await proc.stdout.readline()
                    if not raw:
                        break
                    decoded = raw.decode("utf-8", errors="replace")
                    log_file.write(decoded)
                    log_file.flush()

            await proc.wait()
            exit_code = proc.returncode
            if exit_code != 0:
                error = f"ESPHome compile failed with exit code {exit_code}"
                self.compile_store.set_status(esphome_name, "failed", error=error)
                self.compile_store.copy_log_to_error(esphome_name)
                return CompileResult(success=False, esphome_name=esphome_name, error=error, build_log=self.compile_store.get_log_tail(esphome_name, error=True))

            ota_bin = self._find_artifact(esphome_name, "firmware.ota.bin", ".ota.bin")
            factory_bin = self._find_artifact(esphome_name, "firmware.factory.bin", ".factory.bin")
            if ota_bin is None:
                build_root = self.devices_root / esphome_name / ".esphome" / "build" / esphome_name
                error = f"ESPHome compile succeeded but no OTA binary was found under {build_root}"
                self.compile_store.set_status(esphome_name, "failed", error=error)
                self.compile_store.copy_log_to_error(esphome_name)
                return CompileResult(success=False, esphome_name=esphome_name, error=error, build_log=self.compile_store.get_log_tail(esphome_name, error=True))

            firmware_info = None
            try:
                firmware_info = parse_firmware(ota_bin)
            except Exception as exc:
                with log_path.open("a", encoding="utf-8") as log_file:
                    log_file.write(f"\nFirmware metadata parse failed: {exc}\n")

            self.compile_store.set_status(esphome_name, "success")
            return CompileResult(
                success=True,
                esphome_name=esphome_name,
                ota_bin_path=str(ota_bin),
                factory_bin_path=str(factory_bin) if factory_bin else None,
                firmware_info=firmware_info,
                build_log=self.compile_store.get_log_tail(esphome_name),
            )
        except FileNotFoundError as exc:
            error = f"ESPHome executable not found: {exc.filename or self._esphome_bin()}"
            self.compile_store.set_status(esphome_name, "failed", error=error)
            return CompileResult(success=False, esphome_name=esphome_name, error=error, build_log=self.compile_store.get_log_tail(esphome_name))
        except Exception as exc:
            error = str(exc)
            self.compile_store.set_status(esphome_name, "failed", error=error)
            self.compile_store.copy_log_to_error(esphome_name)
            return CompileResult(success=False, esphome_name=esphome_name, error=error, build_log=self.compile_store.get_log_tail(esphome_name, error=True))
        finally:
            self._active_procs.pop(esphome_name, None)
            secrets_path = self._secrets_paths.pop(esphome_name, secrets_dst)
            try:
                if secrets_path.exists():
                    secrets_path.unlink()
            except OSError:
                pass

    async def stream_logs(self, esphome_name: str) -> AsyncGenerator[str, None]:
        status = self.compile_store.get_status(esphome_name)
        status_str = str(status.get("status", "idle"))
        yield f"event: status\ndata: {status_str}\n\n"

        if status_str not in ("compiling", "pulling_image"):
            log_text = self.compile_store.get_log_tail(esphome_name, error=status_str == "failed")
            if status_str == "failed" and not log_text:
                log_text = self.compile_store.get_log_tail(esphome_name)
            for line in log_text.splitlines():
                yield f"data: {line}\n\n"
            yield f"event: exit\ndata: {0 if status_str == 'success' else 1}\n\n"
            return

        log_path = self.compile_store._log_path(esphome_name)
        position = 0
        if log_path.exists():
            position = log_path.stat().st_size
            content = self.compile_store.get_log_tail(esphome_name)
            for line in content.splitlines():
                yield f"data: {line}\n\n"

        if esphome_name not in self._active_procs:
            for _ in range(60):
                await asyncio.sleep(1)
                current = self.compile_store.get_status(esphome_name).get("status", "idle")
                if current not in ("compiling", "pulling_image"):
                    yield f"event: status\ndata: {current}\n\n"
                    return
                if esphome_name in self._active_procs:
                    break

        while esphome_name in self._active_procs:
            await asyncio.sleep(0.5)
            if not log_path.exists():
                continue
            with log_path.open("rb") as handle:
                handle.seek(position)
                chunk = handle.read()
                position = handle.tell()
            if not chunk:
                continue
            for line in chunk.decode("utf-8", errors="replace").splitlines():
                yield f"data: {line}\n\n"

        final_status = self.compile_store.get_status(esphome_name).get("status", "idle")
        yield f"event: status\ndata: {final_status}\n\n"
        if final_status in ("success", "failed"):
            yield f"event: exit\ndata: {0 if final_status == 'success' else 1}\n\n"

    async def cancel_compile(self, esphome_name: str) -> bool:
        proc = self._active_procs.get(esphome_name)
        if proc is None:
            return False
        try:
            pgid = os.getpgid(proc.pid)
            os.killpg(pgid, signal.SIGTERM)
        except (ProcessLookupError, OSError):
            pass
        try:
            await asyncio.wait_for(proc.wait(), timeout=5.0)
        except asyncio.TimeoutError:
            try:
                pgid = os.getpgid(proc.pid)
                os.killpg(pgid, signal.SIGKILL)
            except (ProcessLookupError, OSError):
                pass
            await proc.wait()
        secrets_dst = self.devices_root / esphome_name / "secrets.yaml"
        try:
            if secrets_dst.exists():
                secrets_dst.unlink()
        except OSError:
            pass
        self.compile_store.set_status(esphome_name, "failed", error="cancelled by user")
        return True

    def serial_flash_active(self) -> bool:
        return self._serial_reserved or self._serial_lock.locked() or self._serial_proc is not None

    def reserve_serial_flash(self) -> bool:
        if self.serial_flash_active():
            return False
        self._serial_reserved = True
        return True

    def serial_flash_status(self, esphome_name: str) -> dict[str, Any]:
        path = self._serial_status_path(esphome_name)
        if not path.exists():
            return {"status": "idle", "esphome_name": esphome_name, "port": None, "error": None}
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return {"status": "idle", "esphome_name": esphome_name, "port": None, "error": None}

    def _set_serial_status(self, esphome_name: str, status: str, **kwargs: Any) -> None:
        path = self._serial_status_path(esphome_name)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps({"status": status, "esphome_name": esphome_name, **kwargs}), encoding="utf-8")

    async def stream_serial_logs(self, esphome_name: str) -> AsyncGenerator[str, None]:
        status = self.serial_flash_status(esphome_name).get("status", "idle")
        yield f"event: status\ndata: {status}\n\n"
        log_path = self._serial_log_path(esphome_name)
        position = 0
        if log_path.exists():
            content = log_path.read_text(encoding="utf-8", errors="replace")
            position = len(content.encode("utf-8"))
            for line in content.splitlines():
                yield f"data: {line}\n\n"

        while True:
            current_status = str(self.serial_flash_status(esphome_name).get("status", "idle"))
            active = (
                self._serial_esphome_name == esphome_name
                and self._serial_proc is not None
            ) or current_status in {"starting", "flashing"}
            if not active:
                break
            await asyncio.sleep(0.5)
            if not log_path.exists():
                continue
            with log_path.open("rb") as handle:
                handle.seek(position)
                chunk = handle.read()
                position = handle.tell()
            if not chunk:
                continue
            for line in chunk.decode("utf-8", errors="replace").splitlines():
                yield f"data: {line}\n\n"

        final_status = self.serial_flash_status(esphome_name).get("status", "idle")
        yield f"event: status\ndata: {final_status}\n\n"

    async def cancel_serial_flash(self) -> bool:
        proc = self._serial_proc
        esphome_name = self._serial_esphome_name
        if proc is None or esphome_name is None:
            return False
        try:
            pgid = os.getpgid(proc.pid)
            os.killpg(pgid, signal.SIGTERM)
        except (ProcessLookupError, OSError):
            pass
        try:
            await asyncio.wait_for(proc.wait(), timeout=5.0)
        except asyncio.TimeoutError:
            try:
                pgid = os.getpgid(proc.pid)
                os.killpg(pgid, signal.SIGKILL)
            except (ProcessLookupError, OSError):
                pass
            await proc.wait()
        self._set_serial_status(esphome_name, "failed", port=None, error="cancelled by user")
        return True

    def clean_artifacts(self) -> tuple[int, int]:
        platformio_bytes = _rmtree_size(self.platformio_cache)
        self.platformio_cache.mkdir(parents=True, exist_ok=True)

        esphome_bytes = 0
        if self.devices_root.exists():
            for entry in self.devices_root.iterdir():
                esphome_dir = entry / ".esphome"
                if entry.is_dir() and esphome_dir.exists():
                    esphome_bytes += _rmtree_size(esphome_dir)

        return platformio_bytes, esphome_bytes

    def cleanup_stale(self) -> None:
        if not self.devices_root.exists():
            return
        for entry in self.devices_root.iterdir():
            if not entry.is_dir():
                continue
            status_path = entry / "compile_status.json"
            if status_path.exists():
                try:
                    data = json.loads(status_path.read_text(encoding="utf-8"))
                    if data.get("status") in {"compiling", "pulling_image"}:
                        status_path.unlink()
                except (OSError, json.JSONDecodeError):
                    pass
            secrets_file = entry / "secrets.yaml"
            if secrets_file.exists():
                try:
                    secrets_file.unlink()
                except OSError:
                    pass

    async def flash_serial(self, esphome_name: str, port: str) -> FlashResult:
        if self._serial_lock.locked():
            return FlashResult(success=False, esphome_name=esphome_name, port=port, error="another serial flash is already running")

        async with self._serial_lock:
            self._serial_reserved = False
            factory_path = self.devices_root / esphome_name / f"{esphome_name}.factory.bin"
            log_path = self._serial_log_path(esphome_name)
            log_path.parent.mkdir(parents=True, exist_ok=True)
            log_path.write_text("", encoding="utf-8")
            lines: list[str] = []

            if not factory_path.exists():
                error = f"Factory binary not found: {factory_path}"
                self._set_serial_status(esphome_name, "failed", port=port, error=error)
                return FlashResult(success=False, esphome_name=esphome_name, port=port, error=error)

            self._set_serial_status(esphome_name, "flashing", port=port, error=None)
            try:
                proc = await asyncio.create_subprocess_exec(
                    self._esptool_bin(),
                    "--chip",
                    "auto",
                    "--port",
                    port,
                    "--baud",
                    "460800",
                    "write-flash",
                    "0x0",
                    str(factory_path),
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.STDOUT,
                    start_new_session=True,
                )
                self._serial_proc = proc
                self._serial_esphome_name = esphome_name

                assert proc.stdout is not None
                with log_path.open("a", encoding="utf-8") as log_file:
                    while True:
                        raw = await proc.stdout.readline()
                        if not raw:
                            break
                        decoded = raw.decode("utf-8", errors="replace")
                        lines.append(decoded)
                        log_file.write(decoded)
                        log_file.flush()

                await proc.wait()
                build_log = "".join(lines)
                if proc.returncode == 0:
                    flashed_bytes = factory_path.stat().st_size
                    self._set_serial_status(esphome_name, "success", port=port, error=None, flashed_bytes=flashed_bytes)
                    return FlashResult(True, esphome_name, port, build_log=build_log, flashed_bytes=flashed_bytes)
                error = f"Serial flash failed with exit code {proc.returncode}"
                self._set_serial_status(esphome_name, "failed", port=port, error=error)
                return FlashResult(False, esphome_name, port, error=error, build_log=build_log)
            except FileNotFoundError as exc:
                error = f"esptool executable not found: {exc.filename or self._esptool_bin()}"
                self._set_serial_status(esphome_name, "failed", port=port, error=error)
                return FlashResult(False, esphome_name, port, error=error, build_log="".join(lines))
            except Exception as exc:
                error = str(exc)
                self._set_serial_status(esphome_name, "failed", port=port, error=error)
                return FlashResult(False, esphome_name, port, error=error, build_log="".join(lines))
            finally:
                self._serial_proc = None
                self._serial_esphome_name = None
                self._serial_reserved = False


    async def detect_chip_on_port(self, port: str) -> dict[str, Any]:
        log_path = self.devices_root / "_chip_detect" / "detect.log"
        log_path.parent.mkdir(parents=True, exist_ok=True)
        try:
            await self._ensure_esphome(log_path)
        except Exception as exc:
            return {"chip_name": "unknown", "board_info": None, "error": f"esptool setup failed: {exc}"}
        try:
            proc = await asyncio.create_subprocess_exec(
                self._esptool_bin(),
                "chip-id",
                "--port",
                port,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.STDOUT,
                start_new_session=True,
            )
            try:
                stdout, _ = await asyncio.wait_for(proc.communicate(), timeout=10.0)
            except asyncio.TimeoutError:
                try:
                    pgid = os.getpgid(proc.pid)
                    os.killpg(pgid, signal.SIGKILL)
                except (ProcessLookupError, OSError):
                    pass
                await proc.wait()
                return {"chip_name": "unknown", "board_info": None, "error": "esptool timed out after 10 seconds"}
            output = stdout.decode("utf-8", errors="replace")
            if proc.returncode != 0:
                return {"chip_name": "unknown", "board_info": None, "error": f"esptool exited with code {proc.returncode}: {output.strip()}"}
            chip_name = None
            for line in output.splitlines():
                m = re.search(r"Chip is (ESP\d+\S*)", line)
                if m:
                    chip_name = m.group(1)
                    break
            if chip_name is None:
                for line in output.splitlines():
                    m = re.search(r"(ESP32-[A-Z0-9]+|ESP8266|ESP32)", line)
                    if m:
                        chip_name = m.group(1)
                        break
            if chip_name is None:
                return {"chip_name": "unknown", "board_info": None, "error": f"could not detect chip from output: {output.strip()}"}
            board_info = CHIP_NAME_TO_BOARD.get(chip_name)
            if board_info is None:
                return {"chip_name": chip_name, "board_info": None, "error": f"chip '{chip_name}' not in CHIP_NAME_TO_BOARD mapping"}
            return {"chip_name": chip_name, "board_info": board_info}
        except FileNotFoundError as exc:
            return {"chip_name": "unknown", "board_info": None, "error": f"esptool not found: {exc.filename or self._esptool_bin()}"}
        except PermissionError:
            return {"chip_name": "unknown", "board_info": None, "error": f"permission denied on port {port}"}
        except OSError as exc:
            return {"chip_name": "unknown", "board_info": None, "error": str(exc)}


def _rmtree_size(path: Path) -> int:
    size = 0
    if path.exists():
        for entry in path.rglob("*"):
            if entry.is_file():
                try:
                    size += entry.stat().st_size
                except OSError:
                    pass
        shutil.rmtree(path, ignore_errors=True)
    return size
