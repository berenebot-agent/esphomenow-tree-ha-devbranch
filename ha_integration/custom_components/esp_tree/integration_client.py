from __future__ import annotations

import asyncio
import json
import logging
import time
import uuid
from collections.abc import Awaitable, Callable, Iterable
from typing import Any

import aiohttp
from google.protobuf.message import DecodeError
from homeassistant.core import HomeAssistant

from .const import API_VERSION, INTEGRATION_VERSION
from .activity_logger import ActivityLogger
from .protobuf.generated import esp_tree_runtime_pb2 as pb

_LOGGER = logging.getLogger(__name__)

FrameHandler = Callable[[pb.Envelope], Awaitable[None]]
KnownSchemaProvider = Callable[[], Iterable[tuple[str, str]]]


class IntegrationWSClient:
    def __init__(
        self,
        hass: HomeAssistant,
        *,
        addon_url: str,
        token: str,
        frame_handler: FrameHandler,
        known_schema_provider: KnownSchemaProvider | None = None,
    ) -> None:
        self.hass = hass
        self.addon_url = addon_url.rstrip("/")
        self.token = token
        self._frame_handler = frame_handler
        self._known_schema_provider = known_schema_provider
        self._session: aiohttp.ClientSession | None = None
        self._ws: aiohttp.ClientWebSocketResponse | None = None
        self._task: asyncio.Task[None] | None = None
        self._pending: dict[str, asyncio.Future[pb.Envelope]] = {}
        self.connected = False
        self._active_url: str | None = None

    @property
    def url(self) -> str:
        return self._active_url or self._url_from_base(self.addon_url)

    @staticmethod
    def _url_from_base(base: str) -> str:
        base = base.rstrip("/")
        if base.startswith("http://"):
            base = "ws://" + base[len("http://") :]
        elif base.startswith("https://"):
            base = "wss://" + base[len("https://") :]
        return f"{base}/esp-tree/integration/v1/pb"

    def _candidate_urls(self) -> list[str]:
        urls = [self._url_from_base(self.addon_url)]
        local_url = self._url_from_base("http://127.0.0.1:8099")
        if local_url not in urls:
            urls.append(local_url)
        return urls

    async def start(self) -> None:
        self._session = aiohttp.ClientSession()
        # A background task, NOT hass.async_create_task: this is a reconnect loop
        # that lives for the lifetime of the integration. A regular task is tracked
        # by Home Assistant, so async_block_till_done() waits on it and it never
        # finishes -- HA logged "Setup timed out for bootstrap waiting on
        # {<Task pending name='esp_tree_addon_ws'>}" and held its own startup for
        # the full 300s bootstrap timeout on every restart.
        self._task = self.hass.async_create_background_task(
            self._run(), name="esp_tree_addon_ws"
        )

    async def stop(self) -> None:
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        if self._ws and not self._ws.closed:
            await self._ws.close()
        if self._session:
            await self._session.close()
        self._fail_pending(RuntimeError("addon websocket stopped"))

    async def _run(self) -> None:
        backoff = 1
        while True:
            connected_at = time.monotonic()
            try:
                await self._connect_once()
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                self.connected = False
                _LOGGER.warning("ESP Tree add-on WS disconnected: %s", exc)
                ActivityLogger.get().warning("add-on websocket disconnected: %s", exc)
            await asyncio.sleep(backoff)
            backoff = 1 if time.monotonic() - connected_at > 60 else min(backoff * 2, 30)

    async def _connect_once(self) -> None:
        last_exc: Exception | None = None
        for url in self._candidate_urls():
            try:
                await self._connect_url(url)
                return
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                last_exc = exc
                ActivityLogger.get().warning("add-on websocket failed at %s: %s", url, exc)
        raise last_exc or RuntimeError("add-on websocket failed")

    async def _connect_url(self, url: str) -> None:
        assert self._session is not None
        async with self._session.ws_connect(url, max_msg_size=65536) as ws:
            self._ws = ws
            self._active_url = url
            await ws.send_json({"type": "auth", "token": self.token})
            auth = await ws.receive()
            if auth.type != aiohttp.WSMsgType.TEXT:
                raise RuntimeError("missing add-on auth response")
            payload = json.loads(auth.data)
            if payload.get("type") != "auth_ok":
                raise RuntimeError("add-on auth failed")
            await self._send_client_hello()
            self.connected = True
            ActivityLogger.get().info("connected to add-on websocket %s", url)
            async for msg in ws:
                if msg.type in (aiohttp.WSMsgType.CLOSE, aiohttp.WSMsgType.CLOSING, aiohttp.WSMsgType.CLOSED):
                    break
                if msg.type == aiohttp.WSMsgType.ERROR:
                    break
                if msg.type != aiohttp.WSMsgType.BINARY:
                    continue
                env = pb.Envelope()
                try:
                    env.ParseFromString(msg.data)
                except DecodeError as exc:
                    raise RuntimeError("invalid add-on protobuf frame") from exc
                fut = self._pending.pop(env.request_id, None) if env.request_id else None
                if fut and not fut.done():
                    fut.set_result(env)
                    continue
                await self._frame_handler(env)
            self.connected = False
            ActivityLogger.get().info("add-on websocket disconnected")
            self._ws = None
            self._fail_pending(ConnectionError("addon websocket disconnected"))

    async def _send(self, envelope: pb.Envelope) -> None:
        if not self._ws:
            raise RuntimeError("add-on websocket is not connected")
        await self._ws.send_bytes(envelope.SerializeToString())

    async def send(self, envelope: pb.Envelope) -> None:
        """Fire-and-forget send. No response expected."""
        await self._send(envelope)

    async def _send_client_hello(self) -> None:
        hello = pb.ClientHello(
            request_full_snapshot=True,
            integration_version=INTEGRATION_VERSION,
        )
        if self._known_schema_provider is not None:
            try:
                for remote_mac, schema_hash in self._known_schema_provider():
                    if remote_mac and schema_hash:
                        hello.known_remote_schemas.add(
                            remote_mac=str(remote_mac),
                            schema_hash=str(schema_hash),
                        )
            except Exception as exc:
                _LOGGER.debug("Could not collect known ESP Tree schemas for hello: %s", exc)
        await self._send(
            pb.Envelope(
                request_id=uuid.uuid4().hex,
                api_version=API_VERSION,
                client_hello=hello,
            )
        )

    async def request(self, envelope: pb.Envelope, timeout: float = 10) -> pb.Envelope:
        if not envelope.request_id:
            envelope.request_id = uuid.uuid4().hex
        envelope.api_version = API_VERSION
        fut: asyncio.Future[pb.Envelope] = asyncio.get_running_loop().create_future()
        self._pending[envelope.request_id] = fut
        try:
            await self._send(envelope)
            return await asyncio.wait_for(fut, timeout)
        finally:
            self._pending.pop(envelope.request_id, None)

    async def command(self, remote_mac: str, object_id: str, command: str, **args: Any) -> pb.CommandResult:
        req_args = []
        for name, value in args.items():
            arg = pb.CommandArgument(name=name)
            if isinstance(value, bool):
                arg.bool_value = value
            elif isinstance(value, int):
                arg.int_value = value
            elif isinstance(value, float):
                arg.float_value = value
            elif value is not None:
                arg.string_value = str(value)
            req_args.append(arg)
        env = await self.request(
            pb.Envelope(
                command_request=pb.CommandRequest(
                    remote_mac=remote_mac,
                    object_id=object_id,
                    command=command,
                    args=req_args,
                )
            )
        )
        return env.command_result

    async def config_command(self, remote_mac: str, command: str, **params: Any) -> pb.ConfigCommandResult:
        request = pb.ConfigCommandRequest(remote_mac=remote_mac, command=command)
        if "interval_seconds" in params and params["interval_seconds"] is not None:
            request.interval_seconds = int(params["interval_seconds"])
        if "parent_mac" in params and params["parent_mac"] is not None:
            request.parent_mac = str(params["parent_mac"])
        if "clear" in params and params["clear"] is not None:
            request.clear_parent = bool(params["clear"])
        if "clear_parent" in params and params["clear_parent"] is not None:
            request.clear_parent = bool(params["clear_parent"])
        if "enable" in params and params["enable"] is not None:
            request.relay_enable = bool(params["enable"])
        if "relay_enable" in params and params["relay_enable"] is not None:
            request.relay_enable = bool(params["relay_enable"])
        env = await self.request(pb.Envelope(config_command_request=request))
        return env.config_command_result

    def _fail_pending(self, exc: Exception) -> None:
        pending = self._pending
        self._pending = {}
        for fut in pending.values():
            if not fut.done():
                fut.set_exception(exc)
