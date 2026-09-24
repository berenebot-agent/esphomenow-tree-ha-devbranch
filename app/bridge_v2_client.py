from __future__ import annotations

import asyncio
import hashlib
import hmac
import logging
import secrets
import time
import uuid
from collections.abc import Awaitable, Callable
from dataclasses import dataclass
from typing import Any

import websockets
from google.protobuf.message import DecodeError

import json
from .bridge_constants import API_VERSION, BACKOFF_DELAYS, CLIENT_KIND, ConnectionHandler, FrameHandler, PROTOCOL
from .bridge_serial_client import SerialBridgeClient
from .models import BridgeTarget, normalize_mac, now_ts
from .protobuf.generated import esp_tree_runtime_pb2 as pb

logger = logging.getLogger(__name__)


class TopologyBroadcast:
    def __init__(self) -> None:
        self._clients: set[asyncio.Queue[str]] = set()

    def add_client(self) -> asyncio.Queue[str]:
        q: asyncio.Queue[str] = asyncio.Queue()
        self._clients.add(q)
        return q

    def remove_client(self, q: asyncio.Queue[str]) -> None:
        self._clients.discard(q)

    def emit(self, event_type: str, payload: dict[str, Any]) -> None:
        msg = json.dumps({"type": event_type, "payload": payload})
        for client in list(self._clients):
            try:
                client.put_nowait(msg)
            except asyncio.QueueFull:
                pass


WS_PATH = "/esp-tree/v2/pb"


@dataclass
class RemoteRoute:
    bridge_uuid: str
    bridge_mac: str
    remote_mac: str
    session_id: str = ""


@dataclass
class IntegrationClientMeta:
    queue: asyncio.Queue[bytes]
    connected_at: float
    last_seen_at: float
    integration_version: str = ""
    hello_received: bool = False
    request_full_snapshot: bool = False
    known_schema_count: int = 0


class BridgeV2Client:
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
        self._ws: Any | None = None
        self._task: asyncio.Task[None] | None = None
        self._stop_event = asyncio.Event()
        self._send_lock = asyncio.Lock()
        self._pending: dict[str, asyncio.Future[pb.Envelope]] = {}
        self._pending_ota_start: dict[str, asyncio.Future[pb.OtaAccepted]] = {}
        self._ota_chunk_request_handler: Callable[[pb.OtaChunkRequest], Awaitable[None]] | None = None
        self._ota_status_handler: Callable[[pb.OtaStatus], Awaitable[None]] | None = None
        self._ota_aborted_handler: Callable[[pb.OtaAborted], Awaitable[None]] | None = None
        self.connected = False
        self.bridge_mac = ""

    def ws_url(self) -> str:
        host = self.target.host.strip()
        if host.startswith("ws://") or host.startswith("wss://"):
            return f"{host.rstrip('/')}{WS_PATH}"
        return f"ws://{host}:{self.target.port}{WS_PATH}"

    def start(self) -> None:
        if self._task is None or self._task.done():
            self._stop_event.clear()
            self._task = asyncio.create_task(self._run(), name=f"bridge-v2-{self.bridge_uuid}")

    async def stop(self) -> None:
        self._stop_event.set()
        self._fail_pending(ConnectionError("bridge v2 client stopped"))
        if self._ws is not None:
            try:
                await self._ws.close()
            except Exception:
                pass
        if self._task and not self._task.done():
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        self._task = None

    async def reconnect(self) -> None:
        await self.stop()
        self.start()

    async def _run(self) -> None:
        backoff_index = 0
        while not self._stop_event.is_set():
            connected_at = time.monotonic()
            try:
                await self._connect_once()
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                logger.warning("bridge v2 %s disconnected: %s", self.target.host, exc)
            finally:
                was_connected = self.connected
                self.connected = False
                self._ws = None
                self._fail_pending(ConnectionError("bridge v2 websocket disconnected"))
                if was_connected:
                    await self._on_connection_change(self, False)
            if self._stop_event.is_set():
                break
            if time.monotonic() - connected_at > 60:
                backoff_index = 0
            delay = BACKOFF_DELAYS[min(backoff_index, len(BACKOFF_DELAYS) - 1)]
            backoff_index = min(backoff_index + 1, len(BACKOFF_DELAYS) - 1)
            try:
                await asyncio.wait_for(self._stop_event.wait(), timeout=delay)
            except asyncio.TimeoutError:
                pass

    async def _connect_once(self) -> None:
        async with websockets.connect(
            self.ws_url(),
            subprotocols=[PROTOCOL],
            max_size=4 * 1024 * 1024,
            close_timeout=5,
            ping_interval=30,
            ping_timeout=10,
        ) as ws:
            self._ws = ws
            await self._authenticate()
            await self._send(
                pb.Envelope(
                    request_id=uuid.uuid4().hex,
                    api_version=API_VERSION,
                    client_hello=pb.ClientHello(request_full_snapshot=True, integration_version="addon"),
                )
            )
            self.connected = True
            await self._on_connection_change(self, True)
            async for raw in ws:
                if not isinstance(raw, bytes):
                    raise RuntimeError("bridge v2 sent non-binary frame")
                env = pb.Envelope()
                try:
                    env.ParseFromString(raw)
                except DecodeError as exc:
                    raise RuntimeError("invalid bridge v2 protobuf frame") from exc
                kind = env.WhichOneof("msg")
                if kind == "error" and env.request_id in self._pending_ota_start:
                    fut = self._pending_ota_start.pop(env.request_id)
                    logger.info("bridge v2 %s: received OTA error response request_id=%s code=%s message=%s",
                                self.target.host, env.request_id[:8], env.error.code, env.error.message)
                    if not fut.done():
                        fut.set_exception(RuntimeError(env.error.message or env.error.code))
                    continue
                if kind == "ota_accepted" and env.request_id in self._pending_ota_start:
                    fut = self._pending_ota_start.pop(env.request_id)
                    logger.info("bridge v2 %s: received OTA accepted request_id=%s job_id=%s",
                                self.target.host, env.request_id[:8], env.ota_accepted.job_id)
                    if not fut.done():
                        fut.set_result(env.ota_accepted)
                    continue
                fut = self._pending.pop(env.request_id, None) if env.request_id else None
                if fut and not fut.done():
                    fut.set_result(env)
                    if kind == "ota_aborted" and self._ota_aborted_handler is not None:
                        try:
                            await self._ota_aborted_handler(env.ota_aborted)
                        except Exception:
                            logger.exception("ota_aborted handler failed")
                    continue
                if kind == "ota_chunk_request" and self._ota_chunk_request_handler is not None:
                    logger.debug("bridge v2 %s: received ota_chunk_request job_id=%s sequences=%d",
                                self.target.host, env.ota_chunk_request.job_id, len(env.ota_chunk_request.sequences))
                    try:
                        await self._ota_chunk_request_handler(env.ota_chunk_request)
                    except Exception:
                        logger.exception("ota_chunk_request handler failed")
                    continue
                if kind == "ota_status" and self._ota_status_handler is not None:
                    state_name = pb.OtaState.Name(int(env.ota_status.state)) if hasattr(env.ota_status, 'state') else str(env.ota_status.state)
                    logger.info("bridge v2 %s: received ota_status job_id=%s state=%s percent=%d",
                                self.target.host, env.ota_status.job_id, state_name, env.ota_status.percent)
                    try:
                        await self._ota_status_handler(env.ota_status)
                    except Exception:
                        logger.exception("ota_status handler failed")
                    continue
                if kind == "ota_aborted" and self._ota_aborted_handler is not None:
                    logger.info("bridge v2 %s: received ota_aborted job_id=%s reason=%s",
                                self.target.host, env.ota_aborted.job_id, env.ota_aborted.reason)
                    try:
                        await self._ota_aborted_handler(env.ota_aborted)
                    except Exception:
                        logger.exception("ota_aborted handler failed")
                    continue
                if kind in ("ota_chunk_request", "ota_status", "ota_aborted"):
                    logger.warning("bridge v2 %s: received %s but handler is None (chunk=%s status=%s aborted=%s)",
                                  self.target.host, kind,
                                  self._ota_chunk_request_handler is not None,
                                  self._ota_status_handler is not None,
                                  self._ota_aborted_handler is not None)
                await self._on_frame(self, env, raw)

    async def _authenticate(self) -> None:
        assert self._ws is not None
        raw = await asyncio.wait_for(self._ws.recv(), timeout=10)
        if not isinstance(raw, bytes):
            raise RuntimeError("missing binary auth challenge")
        env = pb.Envelope()
        env.ParseFromString(raw)
        if env.WhichOneof("msg") != "auth_challenge":
            raise RuntimeError("missing auth challenge")
        challenge = env.auth_challenge
        if challenge.protocol != PROTOCOL or challenge.max_version < API_VERSION:
            raise RuntimeError("incompatible bridge runtime API")
        client_nonce = secrets.token_bytes(16)
        digest_input = (
            f"{PROTOCOL}|v2|{CLIENT_KIND}|"
            f"{challenge.server_nonce.hex()}|{client_nonce.hex()}"
        ).encode()
        digest = hmac.new(self.target.api_key.encode(), digest_input, hashlib.sha256).digest()
        await self._send(
            pb.Envelope(
                request_id=uuid.uuid4().hex,
                api_version=API_VERSION,
                auth_response=pb.AuthResponse(
                    client_kind=CLIENT_KIND,
                    client_name=self.target.name or "ESP Tree Add-on",
                    client_nonce=client_nonce,
                    hmac_sha256=digest,
                ),
            )
        )
        raw = await asyncio.wait_for(self._ws.recv(), timeout=10)
        if not isinstance(raw, bytes):
            raise RuntimeError("missing binary auth result")
        auth_env = pb.Envelope()
        auth_env.ParseFromString(raw)
        kind = auth_env.WhichOneof("msg")
        if kind == "auth_failed":
            raise RuntimeError(auth_env.auth_failed.message or auth_env.auth_failed.code)
        if kind != "auth_ok":
            raise RuntimeError("missing auth ok")
        self.bridge_mac = normalize_mac(auth_env.auth_ok.bridge.bridge_mac)

    async def _send(self, envelope: pb.Envelope) -> None:
        if self._ws is None:
            raise RuntimeError("bridge v2 websocket is not connected")
        async with self._send_lock:
            await self._ws.send(envelope.SerializeToString())

    async def request(self, envelope: pb.Envelope, timeout: float = 10.0) -> pb.Envelope:
        if not envelope.request_id:
            envelope.request_id = uuid.uuid4().hex
        envelope.api_version = API_VERSION
        fut: asyncio.Future[pb.Envelope] = asyncio.get_running_loop().create_future()
        self._pending[envelope.request_id] = fut
        try:
            await self._send(envelope)
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
        logger.info("bridge v2 %s: set_ota_event_handlers chunk=%s status=%s aborted=%s",
                    self.target.host if hasattr(self, 'target') else 'unknown',
                    chunk_request is not None, status is not None, aborted is not None)
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
        logger.info("bridge v2 %s: sending ota_start request_id=%s mac=%s size=%s timeout=%.0fs",
                    self.target.host, request_id[:8], target_mac, file_size, timeout)
        fut: asyncio.Future[pb.OtaAccepted] = asyncio.get_running_loop().create_future()
        self._pending_ota_start[request_id] = fut
        try:
            await self._send(
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
            logger.info("bridge v2 %s: ota_start request sent, awaiting response (request_id=%s)",
                        self.target.host, request_id[:8])
            return await asyncio.wait_for(fut, timeout=timeout)
        except asyncio.TimeoutError:
            logger.error("bridge v2 %s: ota_start TIMED OUT after %.0fs (request_id=%s mac=%s)",
                        self.target.host, timeout, request_id[:8], target_mac)
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
        await self._send(pb.Envelope(api_version=API_VERSION, ota_chunk_batch=batch))

    async def state_receipt(self, event: pb.RemoteStateEvent) -> None:
        if not event.state_tx_counter:
            return
        await self._send(
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


class BridgeV2Manager:
    def __init__(self, db: Any) -> None:
        self._db = db
        self.broadcast = TopologyBroadcast()
        self._clients: dict[str, BridgeV2Client] = {}
        self._bridge_mac_to_uuid: dict[str, str] = {}
        self._snapshots: dict[str, pb.FullSnapshot] = {}
        self._topology_nodes: dict[str, dict[str, Any]] = {}
        self._routes: dict[str, RemoteRoute] = {}
        self._bridge_uptime_observed: dict[str, tuple[int, float]] = {}
        self._integration_clients: dict[asyncio.Queue[bytes], IntegrationClientMeta] = {}
        self._device_id_map: dict[str, str] = {}
        # Bridges present in the DB but skipped by sync_bridges, keyed by uuid with the
        # reason. Without this a bridge that can never connect (no api_key, or a wifi
        # bridge with no host) looks like a working one: it is listed, it is enabled,
        # and nothing anywhere says why no client was started for it.
        self._skipped_bridges: dict[str, str] = {}

    @property
    def connected(self) -> bool:
        return any(client.connected for client in self._clients.values())

    def skipped_bridges(self) -> dict[str, str]:
        """Bridges that sync_bridges refused to start a client for: uuid -> reason."""
        return dict(self._skipped_bridges)

    def client_connected(self, bridge_uuid: str) -> bool:
        """Is this specific bridge's client connected?

        Needed because a serial bridge has no host to detect it by: presence has to
        come from the transport itself rather than from a discovered address.
        """
        client = self._clients.get(str(bridge_uuid or ""))
        return bool(client is not None and client.connected)

    def client_for(self, bridge_uuid: str) -> Any | None:
        return self._clients.get(str(bridge_uuid or ""))

    def _effective_bridge_uptime(self, bridge_mac: str) -> int:
        entry = self._bridge_uptime_observed.get(normalize_mac(bridge_mac))
        if not entry:
            return 0
        uptime_s, observed_at = entry
        return uptime_s + max(0, int(time.time() - observed_at))

    def _touch_last_seen(self, node: dict[str, Any], bridge_mac: str) -> None:
        effective = self._effective_bridge_uptime(bridge_mac)
        if effective > 0:
            node["last_seen_bridge_uptime_s"] = effective
            node["_last_seen_observed_at"] = time.time()
            node["bridge_uptime_s"] = effective

    async def sync_bridges(self, bridges: list[dict[str, Any]]) -> None:
        wanted: set[str] = set()
        for bridge in bridges:
            if not bridge.get("enabled", True):
                continue
            bridge_uuid = str(bridge.get("uuid") or "")
            api_key = str(bridge.get("api_key") or "")
            host = str(bridge.get("host") or "").strip()
            transport = bridge.get("transport", "wifi")
            if transport != "serial" and not host:
                self._skipped_bridges[bridge_uuid] = "bridge has no host"
                continue
            if not bridge_uuid or not api_key:
                self._skipped_bridges[bridge_uuid] = "bridge has no api_key"
                continue
            self._skipped_bridges.pop(bridge_uuid, None)
            serial_port = bridge.get("serial_port", "")
            baud = bridge.get("baud", 460800)
            wanted.add(bridge_uuid)
            existing = self._clients.get(bridge_uuid)
            target = BridgeTarget(
                host=host,
                port=int(bridge.get("port") or 80),
                source="shared_db",
                name=str(bridge.get("name") or ""),
                api_key=api_key,
                transport=transport,
                serial_port=serial_port,
                baud=baud,
            )
            if existing and existing.target == target:
                continue
            if existing:
                await existing.stop()
            if transport == "serial":
                client = SerialBridgeClient(
                    bridge_uuid=bridge_uuid,
                    target=target,
                    on_frame=self._handle_bridge_frame,
                    on_connection_change=self._handle_connection_change,
                )
            else:
                client = BridgeV2Client(
                    bridge_uuid,
                    target,
                    on_frame=self._handle_bridge_frame,
                    on_connection_change=self._handle_connection_change,
                )
            self._clients[bridge_uuid] = client
            client.start()
        for bridge_uuid in list(self._clients):
            if bridge_uuid not in wanted:
                await self._clients.pop(bridge_uuid).stop()

    async def reconnect_bridge(self, bridge_uuid: str) -> bool:
        client = self._clients.get(bridge_uuid)
        if client:
            await client.reconnect()
            return True
        return False

    async def stop(self) -> None:
        for client in list(self._clients.values()):
            await client.stop()
        self._clients.clear()
        self._integration_clients.clear()

    def add_integration_client(self) -> asyncio.Queue[bytes]:
        q: asyncio.Queue[bytes] = asyncio.Queue(maxsize=256)
        now = time.time()
        self._integration_clients[q] = IntegrationClientMeta(
            queue=q,
            connected_at=now,
            last_seen_at=now,
        )
        return q

    def remove_integration_client(self, q: asyncio.Queue[bytes]) -> None:
        self._integration_clients.pop(q, None)

    def integration_status(self) -> dict[str, Any]:
        metas = list(self._integration_clients.values())
        last_seen = max((meta.last_seen_at for meta in metas), default=0.0)
        version_meta = max(
            (meta for meta in metas if meta.integration_version),
            key=lambda meta: meta.last_seen_at,
            default=None,
        )
        return {
            "connected": bool(metas),
            "connected_count": len(metas),
            "last_seen_at": int(last_seen) if last_seen else None,
            "integration_version": version_meta.integration_version if version_meta else None,
            "hello_received": any(meta.hello_received for meta in metas),
            "clients": [
                {
                    "connected_at": int(meta.connected_at),
                    "last_seen_at": int(meta.last_seen_at),
                    "integration_version": meta.integration_version or None,
                    "hello_received": meta.hello_received,
                    "request_full_snapshot": meta.request_full_snapshot,
                    "known_schema_count": meta.known_schema_count,
                }
                for meta in metas
            ],
        }

    async def replay_snapshots(self, q: asyncio.Queue[bytes]) -> None:
        for snapshot in self._snapshots.values():
            await q.put(pb.Envelope(api_version=API_VERSION, full_snapshot=snapshot).SerializeToString())

    async def handle_integration_frame(self, data: bytes, source: asyncio.Queue[bytes] | None = None) -> bytes:
        env = pb.Envelope()
        env.ParseFromString(data)
        meta = self._integration_clients.get(source) if source is not None else None
        if meta is not None:
            meta.last_seen_at = time.time()
        kind = env.WhichOneof("msg")
        if kind == "client_hello":
            if meta is not None:
                meta.hello_received = True
                meta.integration_version = str(env.client_hello.integration_version or "")
                meta.request_full_snapshot = bool(env.client_hello.request_full_snapshot)
                meta.known_schema_count = len(env.client_hello.known_remote_schemas)
            return pb.Envelope(
                request_id=env.request_id,
                api_version=API_VERSION,
                auth_ok=pb.AuthOk(negotiated_version=API_VERSION, server_name="ESP Tree Add-on"),
            ).SerializeToString()
        if kind == "command_request":
            route = self._route_for_remote(env.command_request.remote_mac)
            if not route:
                return pb.Envelope(
                    request_id=env.request_id,
                    api_version=API_VERSION,
                    command_result=pb.CommandResult(
                        remote_mac=normalize_mac(env.command_request.remote_mac),
                        object_id=env.command_request.object_id,
                        command=env.command_request.command,
                        status=pb.COMMAND_STATUS_UNAVAILABLE,
                        error_code="unknown_remote",
                        error_message="remote is not known to the add-on",
                    ),
                ).SerializeToString()
            result = await self._clients[route.bridge_uuid].command(env.command_request)
            return pb.Envelope(request_id=env.request_id, api_version=API_VERSION, command_result=result).SerializeToString()
        if kind == "config_command_request":
            route = self._route_for_remote(env.config_command_request.remote_mac)
            if not route:
                return pb.Envelope(
                    request_id=env.request_id,
                    api_version=API_VERSION,
                    config_command_result=pb.ConfigCommandResult(
                        remote_mac=normalize_mac(env.config_command_request.remote_mac),
                        command=env.config_command_request.command,
                        status=pb.COMMAND_STATUS_UNAVAILABLE,
                        error_code="unknown_remote",
                        error_message="remote is not known to the add-on",
                    ),
                ).SerializeToString()
            result = await self._clients[route.bridge_uuid].config_command(env.config_command_request)
            return pb.Envelope(request_id=env.request_id, api_version=API_VERSION, config_command_result=result).SerializeToString()
        if kind == "ping":
            return pb.Envelope(request_id=env.request_id, api_version=API_VERSION, pong=pb.Pong(monotonic_ms=env.ping.monotonic_ms)).SerializeToString()
        if kind == "device_id_map":
            for entry in env.device_id_map.entries:
                mac = normalize_mac(entry.remote_mac)
                if entry.ha_device_id:
                    self._device_id_map[mac] = entry.ha_device_id
                else:
                    self._device_id_map.pop(mac, None)
                existing = self._topology_nodes.get(mac)
                if existing is not None:
                    existing["ha_device_id"] = entry.ha_device_id or ""
            self._emit_topology()
            return pb.Envelope(
                request_id=env.request_id,
                api_version=API_VERSION,
            ).SerializeToString()
        return pb.Envelope(
            request_id=env.request_id,
            api_version=API_VERSION,
            error=pb.Error(code="unsupported_frame", message=f"unsupported integration frame: {kind}"),
        ).SerializeToString()

    async def send_config(self, mac: str, command: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
        req = pb.ConfigCommandRequest(remote_mac=normalize_mac(mac), command=command)
        params = params or {}
        if params.get("interval_seconds") is not None:
            req.interval_seconds = int(params["interval_seconds"])
        if params.get("parent_mac") is not None:
            req.parent_mac = normalize_mac(str(params["parent_mac"]))
        if params.get("clear") is not None:
            req.clear_parent = bool(params["clear"])
        if params.get("clear_parent") is not None:
            req.clear_parent = bool(params["clear_parent"])
        if params.get("enable") is not None:
            req.relay_enable = bool(params["enable"])
        if params.get("relay_enable") is not None:
            req.relay_enable = bool(params["relay_enable"])
        route = self._routes.get(normalize_mac(mac))
        if not route:
            raise RuntimeError("remote is not known to the add-on")
        client = self._clients.get(route.bridge_uuid)
        if not client or not client.connected:
            raise RuntimeError("bridge for remote is not connected")
        try:
            result = await client.config_command(req, timeout=10.0)
        except asyncio.TimeoutError:
            raise RuntimeError("timeout waiting for config command response from bridge")
        status_name = pb.CommandStatus.Name(result.status)
        if result.status == pb.COMMAND_STATUS_TIMEOUT:
            result_str = "timeout"
        elif result.status == pb.COMMAND_STATUS_UNSUPPORTED:
            result_str = "unsupported"
        elif result.status == pb.COMMAND_STATUS_ACCEPTED:
            em = (result.error_message or "").lower()
            if em in ("", "ok", "accepted"):
                result_str = "ok"
            elif em == "timeout":
                result_str = "timeout"
            elif em == "busy":
                result_str = "busy"
            elif em in ("rejected", "invalid_payload"):
                result_str = "rejected"
            else:
                result_str = "ok"
        elif result.status == pb.COMMAND_STATUS_DELIVERED:
            result_str = "ok"
        else:
            result_str = "rejected"
        return {
            "ok": result_str == "ok",
            "result": result_str,
            "status": status_name,
            "error": result.error_message or result.error_code,
            "bridge_mac": normalize_mac(result.bridge_mac),
        }

    async def refresh_once(self) -> None:
        for client in self._clients.values():
            if client.connected:
                await client._send(
                    pb.Envelope(
                        request_id=uuid.uuid4().hex,
                        api_version=API_VERSION,
                        client_hello=pb.ClientHello(request_full_snapshot=True, integration_version="addon"),
                    )
                )

    async def _async_refresh_once(self) -> None:
        await self.refresh_once()

    async def topology(self) -> list[dict[str, Any]]:
        nodes = self.get_topology_list()
        if not nodes and self.connected:
            logger.info("bridge v2 topology empty but connected, requesting refresh")
            await self.refresh_once()
            await asyncio.sleep(2.0)
            nodes = self.get_topology_list()
        return nodes

    def get_topology_list(self) -> list[dict[str, Any]]:
        now = time.time()
        result = []
        for node in self._topology_nodes.values():
            node = dict(node)
            _ha_id = self._device_id_map.get(normalize_mac(node.get("mac", "")), "")
            if _ha_id:
                node["ha_device_id"] = _ha_id
            bridge_mac = node.get("bridge_mac", "")
            bridge_uptime_s = self._effective_bridge_uptime(bridge_mac)
            lsbu = node.get("last_seen_bridge_uptime_s") or 0
            lsbu_at = node.get("_last_seen_observed_at") or 0
            if lsbu > 0 and lsbu_at > 0 and bridge_uptime_s > 0:
                effective_lsbu = lsbu + max(0, int(now - lsbu_at))
                elapsed = bridge_uptime_s - effective_lsbu
                node["last_seen_ago"] = max(0, elapsed)
                node["bridge_uptime_s"] = bridge_uptime_s
            elif node.get("is_bridge"):
                node["last_seen_ago"] = None
            elif lsbu > 0 and bridge_uptime_s > 0:
                node["last_seen_ago"] = max(0, bridge_uptime_s - lsbu)
                node["bridge_uptime_s"] = bridge_uptime_s
            elif lsbu_at > 0:
                node["last_seen_ago"] = max(0, int(now - lsbu_at))
                node["bridge_uptime_s"] = bridge_uptime_s
            if node.get("is_bridge"):
                if bridge_uptime_s > 0:
                    node["uptime_s"] = bridge_uptime_s
            elif node.get("online"):
                uptime_s = node.get("uptime_s") or 0
                uptime_at = node.get("_uptime_observed_at") or 0
                if uptime_s > 0 and uptime_at > 0:
                    node["uptime_s"] = uptime_s + max(0, int(now - uptime_at))
            result.append(node)
        return result

    def invalidate_device_md5(self, mac: str) -> None:
        node = self._topology_nodes.get(normalize_mac(mac))
        if node:
            node["firmware_md5"] = ""
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            return
        loop.create_task(self._async_refresh_once())

    def _route_for_remote(self, remote_mac: str) -> RemoteRoute | None:
        route = self._routes.get(normalize_mac(remote_mac))
        if not route:
            return None
        client = self._clients.get(route.bridge_uuid)
        if not client or not client.connected:
            return None
        return route

    def ota_client_for_remote(self, remote_mac: str):
        from .bridge_v2_ota import BridgeV2OTAClient

        route = self._route_for_remote(remote_mac)
        if not route:
            raise RuntimeError("bridge for remote is not connected")
        return BridgeV2OTAClient(self._clients[route.bridge_uuid])

    async def _handle_bridge_frame(self, client: BridgeV2Client, env: pb.Envelope, raw: bytes) -> None:
        kind = env.WhichOneof("msg")
        if kind == "full_snapshot":
            logger.info(
                "bridge v2 %s: received full_snapshot bytes=%d bridge_mac=%s remotes=%d",
                client.target.host,
                len(raw),
                normalize_mac(env.full_snapshot.bridge.bridge_mac or client.bridge_mac),
                len(env.full_snapshot.remotes),
            )
            self._handle_snapshot(client, env.full_snapshot)
            await self._broadcast_binary(raw)
            self._emit_topology()
        elif kind == "event_batch":
            self._handle_event_batch(client, env.event_batch)
            await self._send_state_receipts(client, env.event_batch)
            await self._broadcast_binary(raw)
            self._emit_topology()
        else:
            logger.warning("bridge v2 %s: unhandled message kind=%s", client.target.host, kind)

    async def _handle_connection_change(self, client: BridgeV2Client, connected: bool) -> None:
        if connected:
            self.broadcast.emit("bridge.connection", {"bridge_uuid": client.bridge_uuid, "connected": True})
            return
        offline = self._offline_batch_for_bridge(client)
        if offline.events:
            raw = pb.Envelope(api_version=API_VERSION, event_batch=offline).SerializeToString()
            self._handle_event_batch(client, offline)
            await self._broadcast_binary(raw)
        bridge_mac = client.bridge_mac
        if bridge_mac:
            stale = [
                mac for mac, node in list(self._topology_nodes.items())
                if node.get("bridge_mac", "") == bridge_mac and mac != bridge_mac
            ]
            for mac in stale:
                self._topology_nodes.pop(mac, None)
                self._routes.pop(mac, None)
            self._snapshots.pop(client.bridge_uuid, None)
            self._bridge_uptime_observed.pop(bridge_mac, None)
        self.broadcast.emit("bridge.connection", {"bridge_uuid": client.bridge_uuid, "connected": False})
        self._emit_topology()

    def _handle_snapshot(self, client: BridgeV2Client, snapshot: pb.FullSnapshot) -> None:
        bridge_mac = normalize_mac(snapshot.bridge.bridge_mac or client.bridge_mac)
        remote_count = len(snapshot.remotes)
        logger.debug(
            "bridge v2 %s: handling snapshot bridge_mac=%s remotes=%d",
            client.target.host, bridge_mac, remote_count,
        )
        if bridge_mac:
            self._bridge_mac_to_uuid[bridge_mac] = client.bridge_uuid
            client.bridge_mac = bridge_mac
            asyncio.ensure_future(
                asyncio.to_thread(
                    self._db.update_bridge,
                    client.bridge_uuid,
                    network_id=snapshot.bridge.network_id,
                    last_connected_at=now_ts(),
                )
            )
        self._snapshots[client.bridge_uuid] = snapshot
        snapshot_macs = set()
        for node in self._snapshot_nodes(client.bridge_uuid, snapshot):
            mac = normalize_mac(node.get("mac"))
            snapshot_macs.add(mac)
            existing = self._topology_nodes.get(mac)
            if existing and not node.get("is_bridge"):
                if existing.get("last_seen_bridge_uptime_s"):
                    node["last_seen_bridge_uptime_s"] = existing["last_seen_bridge_uptime_s"]
                    node["_last_seen_observed_at"] = existing.get("_last_seen_observed_at", node.get("_last_seen_observed_at"))
                if existing.get("offline_started_at"):
                    node["offline_started_at"] = existing["offline_started_at"]
            self._topology_nodes[mac] = node
        stale_macs = [
            mac for mac, node in list(self._topology_nodes.items())
            if mac not in snapshot_macs
            and node.get("bridge_mac", "") == bridge_mac
            and mac != bridge_mac
        ]
        for mac in stale_macs:
            del self._topology_nodes[mac]
            self._routes.pop(mac, None)
        for remote in snapshot.remotes:
            remote_mac = normalize_mac(remote.identity.remote_mac)
            self._routes[remote_mac] = RemoteRoute(
                bridge_uuid=client.bridge_uuid,
                bridge_mac=bridge_mac,
                remote_mac=remote_mac,
                session_id=remote.runtime.session_id,
            )
        asyncio.ensure_future(
            asyncio.to_thread(
                self._db.upsert_devices_from_topology,
                self.get_topology_list(),
                snapshot.bridge.bridge_name or client.target.name,
            )
        )
        logger.debug(
            "bridge v2 %s: topology now has %d nodes", client.target.host, len(self._topology_nodes),
        )

    def _handle_event_batch(self, client: BridgeV2Client, batch: pb.EventBatch) -> None:
        for event in batch.events:
            kind = event.WhichOneof("kind")
            if kind == "remote_availability":
                ev = event.remote_availability
                remote_mac = normalize_mac(ev.remote_mac)
                bridge_mac = normalize_mac(ev.bridge_mac or client.bridge_mac)
                route = self._routes.setdefault(remote_mac, RemoteRoute(client.bridge_uuid, bridge_mac, remote_mac))
                route.bridge_uuid = client.bridge_uuid
                route.bridge_mac = bridge_mac
                route.session_id = ev.session_id
                node = self._topology_nodes.get(remote_mac)
                if node:
                    was_online = node.get("online", False)
                    node["online"] = bool(ev.online)
                    node["session_id"] = ev.session_id
                    if was_online and not ev.online:
                        node["offline_started_at"] = int(time.time())
                    node["rssi"] = ev.rssi
                    node["hops"] = ev.hops_to_bridge
                    node["offline_reason"] = ev.reason
                    node["uptime_s"] = ev.uptime_s
                    node["_uptime_observed_at"] = time.time()
                    if ev.online:
                        self._touch_last_seen(node, bridge_mac)
                elif ev.online:
                    eff_bu = self._effective_bridge_uptime(bridge_mac)
                    node = {
                        "mac": remote_mac,
                        "node_key": remote_mac.replace(":", ""),
                        "device_unique_id": f"esp_tree_{remote_mac.replace(':', '')}",
                        "parent_mac": None,
                        "name": remote_mac,
                        "esphome_name": None,
                        "friendly_name": remote_mac,
                        "label": remote_mac,
                        "manufacturer": "ESPHome",
                        "model": "esp_tree_remote",
                        "sw_version": None,
                        "project_name": None,
                        "firmware_version": None,
                        "firmware_build_date": None,
                        "firmware_md5": None,
                        "session_id": ev.session_id,
                        "chip_name": None,
                        "online": True,
                        "rssi": ev.rssi,
                        "hops": ev.hops_to_bridge,
                        "offline_reason": ev.reason,
                        "offline_started_at": None,
                        "uptime_s": ev.uptime_s,
                        "_uptime_observed_at": time.time(),
                        "last_seen_ago": 0,
                        "last_seen_bridge_uptime_s": eff_bu,
                        "_last_seen_observed_at": time.time(),
                        "bridge_uptime_s": eff_bu,
                        "route_v2_capable": True,
                        "can_relay": False,
                        "relay_enabled": False,
                        "direct_child_count": 0,
                        "total_child_count": 0,
                        "from_v2_api": True,
                        "is_bridge": False,
                        "bridge_mac": bridge_mac,
                        "network_id": "",
                        "entity_count": 0,
                    }
                    self._topology_nodes[remote_mac] = node
                    logger.debug(
                        "bridge v2 %s: created placeholder node for %s (remote_availability)",
                        bridge_mac, remote_mac,
                    )
                self.broadcast.emit(
                    "remote.availability",
                    {"mac": remote_mac, "online": bool(ev.online), "bridge_mac": bridge_mac, "reason": ev.reason},
                )
            elif kind == "remote_state":
                ev = event.remote_state
                remote_mac = normalize_mac(ev.remote_mac)
                route = self._routes.get(remote_mac)
                if route:
                    route.session_id = ev.session_id
                bridge_mac_rs = normalize_mac(ev.bridge_mac)
                node = self._topology_nodes.get(remote_mac)
                if node and node.get("online"):
                    node["session_id"] = route.session_id if route else node.get("session_id", "")
                    self._touch_last_seen(node, bridge_mac_rs)
            elif kind == "remote_schema_changed":
                self._handle_remote_snapshot(client, event.remote_schema_changed.snapshot, event.remote_schema_changed.bridge_mac)
            elif kind == "remote_metadata_changed":
                self._handle_remote_snapshot(client, self._remote_snapshot_from_metadata(event.remote_metadata_changed), event.remote_metadata_changed.runtime.bridge_mac)
            elif kind == "topology_changed":
                ev = event.topology_changed
                remote_mac = normalize_mac(ev.remote_mac)
                bridge_mac_tc = normalize_mac(ev.bridge_mac or "")
                node = self._topology_nodes.get(remote_mac)
                if node:
                    route = self._routes.get(remote_mac)
                    node["parent_mac"] = normalize_mac(ev.parent_mac)
                    node["hops"] = ev.hops_to_bridge
                    node["rssi"] = ev.rssi
                    node["uptime_s"] = ev.uptime_s
                    node["session_id"] = route.session_id if route else node.get("session_id", "")
                    node["_uptime_observed_at"] = time.time()
                    if node.get("online"):
                        self._touch_last_seen(node, bridge_mac_tc)
                else:
                    eff_bu = self._effective_bridge_uptime(bridge_mac_tc)
                    route = self._routes.get(remote_mac)
                    node = {
                        "mac": remote_mac,
                        "node_key": remote_mac.replace(":", ""),
                        "device_unique_id": f"esp_tree_{remote_mac.replace(':', '')}",
                        "parent_mac": normalize_mac(ev.parent_mac),
                        "name": remote_mac,
                        "esphome_name": None,
                        "friendly_name": remote_mac,
                        "label": remote_mac,
                        "manufacturer": "ESPHome",
                        "model": "esp_tree_remote",
                        "sw_version": None,
                        "project_name": None,
                        "firmware_version": None,
                        "firmware_build_date": None,
                        "firmware_md5": None,
                        "session_id": route.session_id if route else "",
                        "chip_name": None,
                        "online": True,
                        "rssi": ev.rssi,
                        "hops": ev.hops_to_bridge,
                        "offline_started_at": None,
                        "uptime_s": ev.uptime_s,
                        "_uptime_observed_at": time.time(),
                        "last_seen_ago": 0,
                        "last_seen_bridge_uptime_s": eff_bu,
                        "_last_seen_observed_at": time.time(),
                        "bridge_uptime_s": eff_bu,
                        "route_v2_capable": True,
                        "can_relay": False,
                        "relay_enabled": False,
                        "direct_child_count": 0,
                        "total_child_count": 0,
                        "from_v2_api": True,
                        "is_bridge": False,
                        "bridge_mac": bridge_mac_tc,
                        "network_id": "",
                        "entity_count": 0,
                    }
                    self._topology_nodes[remote_mac] = node
                    logger.debug(
                        "bridge v2 %s: created placeholder node for new device %s (topology_changed)",
                        bridge_mac_tc, remote_mac,
                    )
            elif kind == "bridge_heartbeat":
                hb_bridge_mac = normalize_mac(event.bridge_heartbeat.bridge_mac)
                node = self._topology_nodes.get(hb_bridge_mac)
                if node:
                    node["uptime_s"] = event.bridge_heartbeat.uptime_s
                self._bridge_uptime_observed[hb_bridge_mac] = (event.bridge_heartbeat.uptime_s, time.time())
                for rls in event.bridge_heartbeat.remote_last_seen:
                    rls_mac = normalize_mac(rls.remote_mac)
                    rls_node = self._topology_nodes.get(rls_mac)
                    if rls_node:
                        rls_node["last_seen_bridge_uptime_s"] = rls.last_seen_bridge_uptime_s
                        rls_node["_last_seen_observed_at"] = time.time()
                        rls_node["bridge_uptime_s"] = self._effective_bridge_uptime(hb_bridge_mac)

    async def _send_state_receipts(self, client: BridgeV2Client, batch: pb.EventBatch) -> None:
        for event in batch.events:
            if event.WhichOneof("kind") != "remote_state":
                continue
            try:
                await client.state_receipt(event.remote_state)
            except Exception:
                logger.exception(
                    "bridge v2 %s: failed to send state receipt remote=%s tx=%s",
                    client.target.host,
                    normalize_mac(event.remote_state.remote_mac),
                    event.remote_state.state_tx_counter,
                )

    def _handle_remote_snapshot(self, client: BridgeV2Client, snapshot: pb.RemoteSnapshot, bridge_mac_value: str) -> None:
        bridge_mac = normalize_mac(bridge_mac_value or snapshot.runtime.bridge_mac or client.bridge_mac)
        node_mac = normalize_mac(snapshot.identity.remote_mac)
        existing = self._topology_nodes.get(node_mac)
        node = self._remote_node(snapshot, bridge_mac)
        if existing:
            if existing.get("last_seen_bridge_uptime_s"):
                node["last_seen_bridge_uptime_s"] = existing["last_seen_bridge_uptime_s"]
                node["_last_seen_observed_at"] = existing.get("_last_seen_observed_at", node.get("_last_seen_observed_at"))
            if existing.get("offline_started_at"):
                node["offline_started_at"] = existing["offline_started_at"]
        self._topology_nodes[normalize_mac(node["mac"])] = node
        self._routes[normalize_mac(node["mac"])] = RemoteRoute(
            bridge_uuid=client.bridge_uuid,
            bridge_mac=bridge_mac,
            remote_mac=normalize_mac(node["mac"]),
            session_id=snapshot.runtime.session_id,
        )

    def _offline_batch_for_bridge(self, client: BridgeV2Client) -> pb.EventBatch:
        batch = pb.EventBatch()
        for route in list(self._routes.values()):
            if route.bridge_uuid != client.bridge_uuid:
                continue
            ev = batch.events.add().remote_availability
            ev.remote_mac = route.remote_mac
            ev.bridge_mac = route.bridge_mac
            ev.session_id = route.session_id
            ev.online = False
            ev.reason = "bridge_disconnected"
            ev.observed_unix_ms = int(time.time() * 1000)
        return batch

    async def _broadcast_binary(self, raw: bytes) -> None:
        for q in list(self._integration_clients):
            try:
                q.put_nowait(raw)
            except asyncio.QueueFull:
                logger.warning(
                    "integration client queue full (maxsize=%d), draining oldest entries",
                    q.maxsize,
                )
                try:
                    while True:
                        q.get_nowait()
                except asyncio.QueueEmpty:
                    pass
                try:
                    q.put_nowait(raw)
                except asyncio.QueueFull:
                    pass

    def _emit_topology(self) -> None:
        self.broadcast.emit("topology.snapshot", {"nodes": self.get_topology_list()})

    def _snapshot_nodes(self, bridge_uuid: str, snapshot: pb.FullSnapshot) -> list[dict[str, Any]]:
        bridge_mac = normalize_mac(snapshot.bridge.bridge_mac)
        name = snapshot.bridge.friendly_name or snapshot.bridge.bridge_name or bridge_mac
        nodes = [
            {
                "mac": bridge_mac,
                "node_key": bridge_mac.replace(":", ""),
                "device_unique_id": f"esp_tree_{bridge_mac.replace(':', '')}",
                "session_id": "",
                "parent_mac": "",
                "name": snapshot.bridge.bridge_name or name,
                "esphome_name": snapshot.bridge.bridge_name or name,
                "friendly_name": name,
                "label": name,
                "manufacturer": snapshot.bridge.manufacturer or "ESPHome",
                "model": snapshot.bridge.model or "esp_tree_bridge",
                "sw_version": snapshot.bridge.project_version,
                "project_name": snapshot.bridge.project_name,
                "firmware_version": snapshot.bridge.project_version,
                "firmware_build_date": snapshot.bridge.firmware_build_date,
                "online": snapshot.bridge_runtime.online,
                "rssi": snapshot.bridge_runtime.wifi_rssi,
                "hops": 0,
                "uptime_s": snapshot.bridge_runtime.uptime_s,
                "offline_s": 0,
                "entity_count": snapshot.bridge_runtime.remote_count,
                "route_v2_capable": True,
                "can_relay": True,
                "relay_enabled": True,
                "direct_child_count": 0,
                "total_child_count": len(snapshot.remotes),
                "from_v2_api": True,
                "is_bridge": True,
                "bridge_uuid": bridge_uuid,
                "network_id": snapshot.bridge.network_id,
                "chip_name": snapshot.bridge.chip_name,
                "bridge_uptime_s": snapshot.bridge_runtime.uptime_s,
                "ha_device_id": self._device_id_map.get(bridge_mac, ""),
            }
        ]
        self._bridge_uptime_observed[bridge_mac] = (snapshot.bridge_runtime.uptime_s, time.time())
        nodes.extend(self._remote_node(remote, bridge_mac) for remote in snapshot.remotes)
        return nodes

    def _remote_node(self, remote: pb.RemoteSnapshot, bridge_mac: str) -> dict[str, Any]:
        ident = remote.identity
        runtime = remote.runtime
        remote_mac = normalize_mac(ident.remote_mac)
        now = time.time()
        bridge_uptime_s = self._effective_bridge_uptime(bridge_mac)
        elapsed_s = bridge_uptime_s - runtime.last_seen_bridge_uptime_s if runtime.last_seen_bridge_uptime_s > 0 else 0
        return {
            "mac": remote_mac,
            "node_key": remote_mac.replace(":", ""),
            "device_unique_id": f"esp_tree_{remote_mac.replace(':', '')}",
            "parent_mac": normalize_mac(runtime.parent_mac),
            "name": ident.esphome_name or ident.friendly_name or remote_mac,
            "esphome_name": ident.esphome_name,
            "friendly_name": ident.friendly_name or ident.esphome_name or remote_mac,
            "label": ident.friendly_name or ident.esphome_name or remote_mac,
            "manufacturer": ident.manufacturer or "ESPHome",
            "model": ident.model or "esp_tree_remote",
            "sw_version": ident.project_version,
            "project_name": ident.project_name,
            "firmware_version": ident.project_version,
            "firmware_build_date": ident.firmware_build_date,
            "firmware_md5": ident.firmware_md5,
            "session_id": runtime.session_id,
            "online": runtime.online,
            "chip_name": ident.chip_name,
            "rssi": runtime.rssi,
            "hops": runtime.hops_to_bridge,
            "offline_started_at": int(now) - elapsed_s if not runtime.online and elapsed_s > 0 else None,
            "uptime_s": runtime.uptime_s,
            "_uptime_observed_at": now,
            "last_seen_ago": elapsed_s if elapsed_s > 0 else 0,
            "last_seen_bridge_uptime_s": runtime.last_seen_bridge_uptime_s,
            "_last_seen_observed_at": now,
            "bridge_uptime_s": bridge_uptime_s,
            "route_v2_capable": True,
            "can_relay": ident.can_relay,
            "relay_enabled": ident.relay_enabled,
            "direct_child_count": 0,
            "total_child_count": 0,
            "from_v2_api": True,
            "is_bridge": False,
            "bridge_mac": bridge_mac,
            "network_id": "",
            "ha_device_id": self._device_id_map.get(remote_mac, ""),
            "entity_count": ident.entity_count,
        }

    def _remote_snapshot_from_metadata(self, ev: pb.RemoteMetadataChangedEvent) -> pb.RemoteSnapshot:
        snapshot = pb.RemoteSnapshot()
        snapshot.identity.CopyFrom(ev.identity)
        snapshot.runtime.CopyFrom(ev.runtime)
        return snapshot
