from __future__ import annotations

import asyncio
import hashlib
import hmac
import logging
import secrets
import threading
import time
import uuid
from collections.abc import Awaitable, Callable
from typing import Any

import serial
import serial.tools.list_ports
from cobs import cobs
from google.protobuf.message import DecodeError

from .bridge_constants import API_VERSION, BACKOFF_DELAYS, CLIENT_KIND, ConnectionHandler, FrameHandler, PROTOCOL
from .models import BridgeTarget, normalize_mac
from .protobuf.generated import esp_tree_runtime_pb2 as pb

logger = logging.getLogger(__name__)

CONNECTION_TIMEOUT_S = 60
# Send a Ping when the link has been idle this long. Must be comfortably below
# CONNECTION_TIMEOUT_S so a quiet-but-healthy link keeps refreshing the reader's
# no-data timer.
KEEPALIVE_INTERVAL_S = 20
# How long to wait for the Pong before giving up on this keepalive tick.
KEEPALIVE_PONG_TIMEOUT_S = 5.0
SERIAL_READ_TIMEOUT = 0.1


class SerialBridgeClient:
    def __init__(
        self,
        bridge_uuid: str,
        target: BridgeTarget,
        *,
        on_frame: FrameHandler,
        on_connection_change: ConnectionHandler,
    ) -> None:
        self.bridge_uuid = bridge_uuid
        self.target = target
        self._on_frame = on_frame
        self._on_connection_change = on_connection_change
        self._serial: serial.Serial | None = None
        self._reader_thread: threading.Thread | None = None
        self._stop_event = threading.Event()
        self._send_lock = threading.Lock()
        self._pending: dict[str, asyncio.Future[pb.Envelope]] = {}
        self._pending_ota_start: dict[str, asyncio.Future[pb.OtaAccepted]] = {}
        self._auth_challenge_future: asyncio.Future[pb.Envelope] | None = None
        self._auth_ok_future: asyncio.Future[pb.Envelope] | None = None
        self._auth_pending_frames: list[tuple[pb.Envelope, bytes]] = []
        self._ota_chunk_request_handler: Callable[[pb.OtaChunkRequest], Awaitable[None]] | None = None
        self._ota_status_handler: Callable[[pb.OtaStatus], Awaitable[None]] | None = None
        self._ota_aborted_handler: Callable[[pb.OtaAborted], Awaitable[None]] | None = None
        self._connected = False
        self.bridge_mac = ""
        self._loop: asyncio.AbstractEventLoop | None = None
        self._reconnect_task: asyncio.Task[None] | None = None
        self._last_data_time: float = 0.0

    def start(self) -> None:
        if self._reconnect_task is None or self._reconnect_task.done():
            self._loop = asyncio.get_running_loop()
            self._reconnect_task = asyncio.create_task(
                self._reconnect_loop(), name=f"bridge-serial-{self.bridge_uuid}"
            )

    async def stop(self) -> None:
        if self._reconnect_task and not self._reconnect_task.done():
            self._reconnect_task.cancel()
            try:
                await self._reconnect_task
            except asyncio.CancelledError:
                pass
        self._reconnect_task = None
        self._stop_reader()
        self._fail_pending(ConnectionError("serial bridge client stopped"))
        was_connected = self._connected
        self._connected = False
        if was_connected:
            await self._on_connection_change(self, False)

    async def reconnect(self) -> None:
        await self.stop()
        self.start()

    @property
    def connected(self) -> bool:
        return self._connected

    @connected.setter
    def connected(self, value: bool) -> None:
        self._connected = value

    def _stop_reader(self) -> None:
        self._stop_event.set()
        if self._serial and self._serial.is_open:
            try:
                self._serial.close()
            except Exception:
                pass
        if self._reader_thread and self._reader_thread.is_alive():
            self._reader_thread.join(timeout=2.0)
        self._reader_thread = None
        self._serial = None

    async def _reconnect_loop(self) -> None:
        backoff_index = 0
        while True:
            connected_at = time.monotonic()
            try:
                await asyncio.get_running_loop().run_in_executor(None, self._connect_once)
                await self._run_auth()
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                logger.warning("serial bridge %s: %s", self._port_desc(), exc)
            finally:
                was_connected = self._connected
                self._connected = False
                self._stop_reader()
                self._fail_pending(ConnectionError("serial bridge disconnected"))
                if was_connected and self._loop and not self._loop.is_closed():
                    try:
                        await self._on_connection_change(self, False)
                    except Exception:
                        logger.exception("serial bridge %s: connection change callback failed", self._port_desc())
            if time.monotonic() - connected_at > 60:
                backoff_index = 0
            delay = BACKOFF_DELAYS[min(backoff_index, len(BACKOFF_DELAYS) - 1)]
            backoff_index = min(backoff_index + 1, len(BACKOFF_DELAYS) - 1)
            try:
                await asyncio.sleep(delay)
            except asyncio.CancelledError:
                raise

    def _port_desc(self) -> str:
        return self.target.serial_port or "unknown"

    def _resolve_port(self) -> str | None:
        configured = self.target.serial_port
        # A pyserial URL (e.g. socket://host:460800) is handed straight to
        # serial.Serial - there is nothing local to enumerate, and the remote end
        # is what owns the device. This is what lets the add-on drive a bridge
        # whose UART lives on another host (the add-on container/VM usually has no
        # USB passthrough, so a network serial bridge is the only route).
        if "://" in configured:
            return configured

        available = list(serial.tools.list_ports.comports())

        for port in available:
            if port.device == configured:
                return configured

        for port in available:
            if configured and (configured.lower() in (port.description or "").lower()
                                or configured.lower() in (port.hwid or "").lower()):
                self.target.serial_port = port.device
                logger.info("serial bridge: hotplug resolved %s → %s", configured, port.device)
                return port.device

        return None

    def _connect_once(self) -> None:
        port = self._resolve_port()
        if not port:
            raise ConnectionError(f"serial port {self.target.serial_port} not found")
        self._stop_event.clear()
        # serial.Serial() only accepts a device path; pyserial's URL schemes
        # (socket://, rfc2217://, ...) are handled by serial_for_url(), which also
        # accepts plain paths. Use it for everything so both work.
        ser = serial.serial_for_url(
            url=port,
            baudrate=self.target.baud,
            timeout=SERIAL_READ_TIMEOUT,
        )
        self._serial = ser
        logger.info("serial bridge %s: opened %s @ %d baud", self.bridge_uuid, port, self.target.baud)

    async def _run_auth(self) -> None:
        self._last_data_time = time.monotonic()
        self._reader_thread = threading.Thread(
            target=self._read_loop,
            daemon=True,
            name=f"serial-reader-{self.bridge_uuid}",
        )
        self._reader_thread.start()

        auth_challenge_future: asyncio.Future[pb.Envelope] = self._loop.create_future()
        auth_ok_future: asyncio.Future[pb.Envelope] = self._loop.create_future()
        self._auth_challenge_future = auth_challenge_future
        self._auth_ok_future = auth_ok_future
        self._auth_pending_frames = []
        client_hello = pb.Envelope(
            request_id=uuid.uuid4().hex,
            api_version=API_VERSION,
            client_hello=pb.ClientHello(request_full_snapshot=True, integration_version="addon"),
        )
        # Install the receiver before writing: a fast device may challenge before
        # the write call returns.
        self._send_envelope_sync(client_hello)

        try:
            await asyncio.wait_for(asyncio.shield(auth_challenge_future), timeout=10)
        except asyncio.TimeoutError as exc:
            self._auth_challenge_future = None
            self._auth_ok_future = None
            raise RuntimeError("timeout waiting for auth_challenge from bridge") from exc
        except RuntimeError as exc:
            self._auth_challenge_future = None
            self._auth_ok_future = None
            raise RuntimeError("authentication failed before challenge") from exc
        finally:
            self._auth_challenge_future = None

        challenge_env = auth_challenge_future.result()
        challenge = challenge_env.auth_challenge
        client_nonce = secrets.token_bytes(16)
        digest_input = (
            f"{PROTOCOL}|v2|{CLIENT_KIND}|"
            f"{challenge.server_nonce.hex()}|{client_nonce.hex()}"
        ).encode()
        digest = hmac.new(self.target.api_key.encode(), digest_input, hashlib.sha256).digest()

        auth_resp = pb.Envelope(
            request_id=uuid.uuid4().hex,
            api_version=API_VERSION,
            auth_response=pb.AuthResponse(
                client_kind=CLIENT_KIND,
                client_name=self.target.name or "ESP Tree Add-on",
                client_nonce=client_nonce,
                hmac_sha256=digest,
            ),
        )
        self._send_envelope_sync(auth_resp)

        try:
            auth_env = await asyncio.wait_for(asyncio.shield(auth_ok_future), timeout=10)
        except asyncio.TimeoutError:
            raise RuntimeError("timeout waiting for auth_ok from bridge")
        finally:
            self._auth_ok_future = None

        kind = auth_env.WhichOneof("msg")
        if kind == "auth_failed":
            raise RuntimeError(auth_env.auth_failed.message or auth_env.auth_failed.code)
        if kind != "auth_ok":
            raise RuntimeError(f"unexpected auth response: {kind}")

        self.bridge_mac = normalize_mac(auth_env.auth_ok.bridge.bridge_mac)
        self._connected = True
        await self._on_connection_change(self, True)
        pending_frames, self._auth_pending_frames = self._auth_pending_frames, []
        for pending_env, pending_raw in pending_frames:
            self._dispatch_frame(pending_env, pending_raw)
        await self._run_session()

    async def _keepalive_loop(self) -> None:
        """Ping the bridge while the link is idle.

        A serial link has no protocol-level keepalive and the bridge only speaks when
        it has something to send, so a healthy-but-quiet session looks identical to a
        dead one: the reader's no-data timer hits CONNECTION_TIMEOUT_S and tears the
        session down. The websocket client gets this for free from the websockets
        library's ping_interval; the serial client has to do it itself. Without this
        a connected serial bridge flaps on a fixed cycle (observed: disconnect
        "after 175B" every ~92s).
        """
        while not self._stop_event.is_set():
            try:
                await asyncio.sleep(1.0)
            except asyncio.CancelledError:
                return
            if not self.connected or self._stop_event.is_set():
                continue
            idle = time.monotonic() - self._last_data_time
            if idle < KEEPALIVE_INTERVAL_S:
                continue
            try:
                pong = await asyncio.wait_for(
                    self.request(
                        pb.Envelope(ping=pb.Ping(monotonic_ms=int(time.monotonic() * 1000))),
                        timeout=KEEPALIVE_PONG_TIMEOUT_S,
                    ),
                    timeout=KEEPALIVE_PONG_TIMEOUT_S + 1.0,
                )
                if pong.WhichOneof("msg") != "pong":
                    logger.debug(
                        "serial bridge %s: keepalive got %s, not pong",
                        self._port_desc(), pong.WhichOneof("msg"),
                    )
            except asyncio.CancelledError:
                return
            except Exception as exc:
                # Don't tear down here: a genuinely dead link is caught by the
                # reader's CONNECTION_TIMEOUT_S. Log and retry on the next tick.
                logger.debug("serial bridge %s: keepalive ping failed: %s", self._port_desc(), exc)

    async def _run_session(self) -> None:
        """Own the session for its whole life: keepalive + wait for the reader to die."""
        keepalive = asyncio.ensure_future(self._keepalive_loop())
        try:
            await self._await_session_end()
        finally:
            keepalive.cancel()
            try:
                await keepalive
            except (asyncio.CancelledError, Exception):
                pass

    async def _await_session_end(self) -> None:
        """Hold the connection open while the reader thread owns the port.

        _reconnect_loop() tears the port down in its finally block as soon as
        _run_auth() returns, so returning straight after a successful handshake
        killed the reader thread immediately: the client reported connected, then
        instantly disconnected and reconnected in a loop. Wait here until the
        reader thread dies (read error or the no-data timeout), which is what
        actually ends a session for a UART.
        """
        while not self._stop_event.is_set():
            if self._reader_thread is None or not self._reader_thread.is_alive():
                return
            await asyncio.sleep(0.5)

    def _read_loop(self) -> None:
        buf = bytearray()
        try:
            while not self._stop_event.is_set():
                try:
                    data = self._serial.read(4096) if self._serial and self._serial.is_open else b""
                except Exception as exc:
                    if not self._stop_event.is_set():
                        logger.warning("serial bridge %s: read error: %r", self._port_desc(), exc)
                    break

                if data:
                    self._last_data_time = time.monotonic()
                    buf.extend(data)
                    while True:
                        delim = buf.find(b"\x00")
                        if delim < 0:
                            break
                        if delim > 0:
                            frame_bytes = bytes(buf[:delim])
                            try:
                                decoded = cobs.decode(frame_bytes)
                            except Exception:
                                logger.warning("serial bridge %s: COBS decode error, skipping frame", self._port_desc())
                                buf = buf[delim + 1:]
                                continue
                            buf = buf[delim + 1:]
                            try:
                                self._on_raw_frame(decoded)
                            except Exception:
                                logger.exception("serial bridge %s: frame dispatch error", self._port_desc())
                        else:
                            buf = buf[1:]

                if self.connected and time.monotonic() - self._last_data_time > CONNECTION_TIMEOUT_S:
                    logger.warning("serial bridge %s: connection timeout (no data for %ds)", self._port_desc(), CONNECTION_TIMEOUT_S)
                    if self._loop and not self._loop.is_closed():
                        self._loop.call_soon_threadsafe(self._schedule_reconnect)
                    break
        finally:
            # Surface why the session ended: a silent reader exit looks identical to
            # a healthy idle link from the outside, which made this hard to diagnose.
            logger.info(
                "serial bridge %s: reader thread exiting (stop=%s connected=%s serial_open=%s)",
                self._port_desc(), self._stop_event.is_set(), self.connected,
                bool(self._serial and self._serial.is_open),
            )

    def _on_raw_frame(self, data: bytes) -> None:
        env = pb.Envelope()
        try:
            env.ParseFromString(data)
        except DecodeError:
            logger.warning("serial bridge %s: protobuf decode error", self._port_desc())
            return

        if self._loop is None or self._loop.is_closed():
            return

        if self._auth_challenge_future is not None and not self._auth_challenge_future.done():
            kind = env.WhichOneof("msg")
            if kind == "auth_challenge":
                self._loop.call_soon_threadsafe(self._auth_challenge_future.set_result, env)
                return
            if kind == "auth_failed":
                self._loop.call_soon_threadsafe(self._auth_challenge_future.set_exception, RuntimeError("authentication failed before challenge"))
                return
            if kind in ("full_snapshot", "auth_ok"):
                # Do not accept these as proof of authentication. The bridge
                # sends the snapshot after auth_ok, following the fresh HMAC.
                return

        # Checked separately from the challenge future: that one is cleared as soon
        # as the challenge lands, so auth_ok/auth_failed would otherwise fall through
        # to _dispatch_frame and be delivered as an ordinary frame, leaving the
        # handshake to time out despite the bridge having answered.
        if self._auth_ok_future is not None and not self._auth_ok_future.done():
            kind = env.WhichOneof("msg")
            if kind in ("auth_failed", "auth_ok"):
                self._loop.call_soon_threadsafe(self._auth_ok_future.set_result, env)
                return
            # Frames immediately following auth_ok can race the coroutine that
            # observes that future. Buffer them and dispatch only after auth_ok.
            self._loop.call_soon_threadsafe(self._auth_pending_frames.append, (env, data))
            return

        self._loop.call_soon_threadsafe(self._dispatch_frame, env, data)

    def _dispatch_frame(self, env: pb.Envelope, raw: bytes) -> None:
        kind = env.WhichOneof("msg")

        if kind == "error" and env.request_id in self._pending_ota_start:
            fut = self._pending_ota_start.pop(env.request_id)
            if not fut.done():
                fut.set_exception(RuntimeError(env.error.message or env.error.code))
            return

        if kind == "ota_accepted" and env.request_id in self._pending_ota_start:
            fut = self._pending_ota_start.pop(env.request_id)
            if not fut.done():
                fut.set_result(env.ota_accepted)
            return

        fut = self._pending.pop(env.request_id, None) if env.request_id else None
        if fut and not fut.done():
            fut.set_result(env)
            if kind == "ota_aborted" and self._ota_aborted_handler:
                asyncio.ensure_future(self._ota_aborted_handler(env.ota_aborted))
            return

        if kind == "ota_chunk_request" and self._ota_chunk_request_handler:
            asyncio.ensure_future(self._ota_chunk_request_handler(env.ota_chunk_request))
            return

        if kind == "ota_status" and self._ota_status_handler:
            asyncio.ensure_future(self._ota_status_handler(env.ota_status))
            return

        if kind == "ota_aborted" and self._ota_aborted_handler:
            asyncio.ensure_future(self._ota_aborted_handler(env.ota_aborted))
            return

        asyncio.ensure_future(self._on_frame(self, env, raw))

    def _schedule_reconnect(self) -> None:
        # Called from the reader thread when the link goes quiet. Do NOT cancel the
        # reconnect task from here: that task is currently inside _await_session_end()
        # waiting for this very thread to finish, so cancelling it tears the session
        # down and the client flaps instead of recovering. The task's own finally
        # block handles teardown once _await_session_end() returns.
        self._stop_event.set()

    def _send_envelope_sync(self, envelope: pb.Envelope) -> None:
        if self._serial is None or not self._serial.is_open:
            raise ConnectionError("serial port not open")
        data = envelope.SerializeToString()
        encoded = cobs.encode(data)
        with self._send_lock:
            self._serial.write(encoded + b"\x00")
            self._serial.flush()

    async def _send_async(self, envelope: pb.Envelope) -> None:
        await asyncio.get_running_loop().run_in_executor(None, self._send_envelope_sync, envelope)

    async def refresh_snapshot(self) -> None:
        """Ask the bridge for a full snapshot.

        Public counterpart to BridgeV2Client._send for this call site: the manager
        used to reach into `client._send(...)`, which only the WebSocket client has,
        so the refresh raised AttributeError on a serial bridge. That path is only
        taken when the topology list is empty, which is why it stayed hidden until a
        remote entry needed rediscovering.
        """
        await self._send_async(
            pb.Envelope(
                request_id=uuid.uuid4().hex,
                api_version=API_VERSION,
                client_hello=pb.ClientHello(request_full_snapshot=True, integration_version="addon"),
            )
        )

    async def request(self, envelope: pb.Envelope, timeout: float = 10.0) -> pb.Envelope:
        if not envelope.request_id:
            envelope.request_id = uuid.uuid4().hex
        envelope.api_version = API_VERSION
        fut: asyncio.Future[pb.Envelope] = self._loop.create_future()
        self._pending[envelope.request_id] = fut
        try:
            await self._send_async(envelope)
            return await asyncio.wait_for(fut, timeout=timeout)
        finally:
            self._pending.pop(envelope.request_id, None)

    async def command(self, request: pb.CommandRequest, timeout: float = 10.0) -> pb.CommandResult:
        env = await self.request(pb.Envelope(command_request=request), timeout=timeout)
        return env.command_result

    async def config_command(self, request: pb.ConfigCommandRequest, timeout: float = 10.0) -> pb.ConfigCommandResult:
        env = await self.request(pb.Envelope(config_command_request=request), timeout=timeout)
        return env.config_command_result

    def set_ota_event_handlers(
        self,
        *,
        chunk_request: Callable[[pb.OtaChunkRequest], Awaitable[None]] | None = None,
        status: Callable[[pb.OtaStatus], Awaitable[None]] | None = None,
        aborted: Callable[[pb.OtaAborted], Awaitable[None]] | None = None,
    ) -> None:
        self._ota_chunk_request_handler = chunk_request
        self._ota_status_handler = status
        self._ota_aborted_handler = aborted

    async def ota_start(
        self,
        *,
        target_mac: str,
        file_size: int,
        md5: str,
        sha256: str = "",
        filename: str = "",
        preferred_chunk_size: int = 0,
        timeout: float = 30.0,
    ) -> pb.OtaAccepted:
        request_id = uuid.uuid4().hex
        logger.info("serial bridge %s: ota_start request_id=%s mac=%s", self._port_desc(), request_id[:8], target_mac)
        fut: asyncio.Future[pb.OtaAccepted] = self._loop.create_future()
        self._pending_ota_start[request_id] = fut
        try:
            await self._send_async(
                pb.Envelope(
                    request_id=request_id,
                    api_version=API_VERSION,
                    ota_start_request=pb.OtaStartRequest(
                        target_mac=normalize_mac(target_mac),
                        file_size=int(file_size),
                        md5=md5,
                        sha256=sha256,
                        filename=filename,
                        preferred_chunk_size=int(preferred_chunk_size or 0),
                    ),
                )
            )
            return await asyncio.wait_for(fut, timeout=timeout)
        except asyncio.TimeoutError:
            logger.error("serial bridge %s: ota_start TIMED OUT (request_id=%s)", self._port_desc(), request_id[:8])
            raise
        finally:
            self._pending_ota_start.pop(request_id, None)

    async def ota_abort(self, job_id: str, reason: str = "user", timeout: float = 10.0) -> pb.OtaAborted:
        env = await self.request(
            pb.Envelope(ota_abort_request=pb.OtaAbortRequest(job_id=job_id, reason=reason)),
            timeout=timeout,
        )
        if env.WhichOneof("msg") == "error":
            raise RuntimeError(env.error.message or env.error.code)
        return env.ota_aborted

    async def send_ota_chunk_batch(self, job_id: str, response_request_id: str, chunks: list[pb.OtaChunk]) -> None:
        batch = pb.OtaChunkBatch(job_id=job_id, response_request_id=response_request_id)
        batch.chunks.extend(chunks)
        await self._send_async(pb.Envelope(api_version=API_VERSION, ota_chunk_batch=batch))

    async def state_receipt(self, event: pb.RemoteStateEvent) -> None:
        if not event.state_tx_counter:
            return
        await self._send_async(
            pb.Envelope(
                api_version=API_VERSION,
                state_receipt=pb.StateReceipt(
                    remote_mac=normalize_mac(event.remote_mac),
                    bridge_mac=normalize_mac(event.bridge_mac or self.bridge_mac),
                    session_id=event.session_id,
                    state_tx_counter=event.state_tx_counter,
                    entity_index=event.entity_index,
                ),
            )
        )

    def _fail_pending(self, exc: Exception) -> None:
        pending = self._pending
        self._pending = {}
        for fut in pending.values():
            if not fut.done():
                fut.set_exception(exc)
        pending_ota = self._pending_ota_start
        self._pending_ota_start = {}
        for fut in pending_ota.values():
            if not fut.done():
                fut.set_exception(exc)
