# Bridge Lite Workplan

Detailed step-by-step instructions for building the `bridge_lite` ESPHome component and its Python client library. Both live under `components/bridge_lite/` and share a single proto schema.

---

## Directory Structure (Final State)

```
components/bridge_lite/
  __init__.py                    # ESPHome YAML config schema + component registration
  bridge_lite.h                 # Main component class
  bridge_lite.cpp               # Setup/loop: WiFi, ESP-NOW, PSK tag, RX queue, peer mgmt, WS
  transport.h                   # BridgeTransport abstract interface
  transport_ws.h                # WebSocket transport declaration
  transport_ws.cpp              # WebSocket transport implementation + auth + encryption
  proto/
    espnow_bridge.proto         # Single source of truth for wire protocol
  nanopb/
    espnow_bridge.pb.h          # Generated: nanopb C header
    espnow_bridge.pb.c          # Generated: nanopb C source
  python/
    bridge_lite_client/
      __init__.py               # Package init, exports BridgeLiteClient
      client.py                 # Top-level: connect, send, receive, flow control
      transport.py              # Abstract transport interface (mirror of transport.h)
      transport_ws.py           # WebSocket client transport
      auth.py                   # Challenge-response + HKDF + ChaCha20-Poly1305
      proto/
        __init__.py
        espnow_bridge_pb2.py   # Generated: Python protobuf module
    pyproject.toml              # Package metadata + dependencies
    Makefile                    # Build targets: proto, test, lint
    tests/
      test_auth.py              # Auth + encryption round-trip tests
      test_flow.py              # Flow control tests
      test_client.py            # Integration tests (mock server)

demos/
  espnow-bridge-lite.yml        # Demo YAML for the lite bridge
```

---

## Phase 1: Proto Schema + Code Generation

### Step 1.1: Write the proto schema

Create `components/bridge_lite/proto/espnow_bridge.proto` with the schema from the spec.

```protobuf
syntax = "proto3";

package esp_tree;

message BridgeHello {
  bytes bridge_mac = 1;
  string espnow_mode = 2;
  uint32 max_peers = 3;
  string version = 4;
  uint32 max_inflight = 5;
}

message RadioFrame {
  bytes src_mac = 1;
  bytes raw_frame = 2;
  bool psk_tag_valid = 3;
  int32 rssi = 4;
  uint32 timestamp_ms = 5;
}

message RadioSend {
  bytes dst_mac = 1;
  bytes raw_frame = 2;
  bool lr_mode = 3;
  uint32 seq = 4;
}

message SendResult {
  uint32 seq = 1;
  bool success = 2;
  string error = 3;
}

message BridgeStatus {
  int32 wifi_rssi = 1;
  uint32 uptime_s = 2;
  uint32 free_heap = 3;
  uint32 peers_connected = 4;
  uint32 rx_queue_fill = 5;
}

message BridgeMessage {
  oneof payload {
    BridgeHello hello = 1;
    RadioFrame frame = 2;
    RadioSend send = 3;
    SendResult result = 4;
    BridgeStatus status = 5;
  }
}
```

### Step 1.2: Generate nanopb C++ output

Install nanopb protoc plugin if not present:

```bash
pip install nanopb
# Or download from https://jpa.kapsi.fi/nanopb-download/
# The ESPHome build system needs protoc + nanopb_generator
```

Create `components/bridge_lite/proto/nanopb.options`:

```
BridgeMessage.payload max_count: 1
BridgeMessage.payload.msgid: 1
```

Generate:

```bash
cd components/bridge_lite/proto
protoc --nanopb_out=../nanopb/ espnow_bridge.proto
```

This produces:
- `components/bridge_lite/nanopb/espnow_bridge.pb.h`
- `components/bridge_lite/nanopb/espnow_bridge.pb.c`

**Note:** Add these generated files to `.gitignore` if you want CI to regenerate them, or commit them for reproducibility. For ESPHome external components, committing is simpler (no build-time proto step needed by consumers).

### Step 1.3: Generate Python protobuf output

```bash
cd components/bridge_lite/proto
protoc --python_out=../python/bridge_lite_client/proto/ espnow_bridge.proto
```

This produces:
- `components/bridge_lite/python/bridge_lite_client/proto/espnow_bridge_pb2.py`

### Step 1.4: Verify generation

```bash
# C++: check that nanopb headers compile
cd /home/ben/projects/ESPLR_V2
# We'll verify in Phase 3 when the C++ code includes them

# Python: quick smoke test
cd components/bridge_lite/python
python3 -c "from bridge_lite_client.proto import espnow_bridge_pb2; print('OK')"
```

---

## Phase 2: Python Client Library

Build the Python side first because it's faster to iterate and test, and the ESP side will need a client to talk to anyway.

### Step 2.1: Package scaffolding

Create `components/bridge_lite/python/pyproject.toml`:

```toml
[build-system]
requires = ["setuptools>=68.0"]
build-backend = "setuptools.backends._legacy:_Backend"

[project]
name = "bridge-lite-client"
version = "0.1.0"
description = "Python client for ESP-NOW LR Bridge Lite WebSocket protocol"
requires-python = ">=3.11"
dependencies = [
    "protobuf>=4.25",
    "websockets>=12.0",
    "cryptography>=42.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0",
    "pytest-asyncio>=0.23",
    "ruff>=0.4",
]

[tool.ruff]
target-version = "py311"
line-length = 120
```

Create `components/bridge_lite/python/bridge_lite_client/__init__.py`:

```python
from .client import BridgeLiteClient

__all__ = ["BridgeLiteClient"]
```

Create `components/bridge_lite/python/bridge_lite_client/proto/__init__.py` (empty).

### Step 2.2: Abstract transport interface

Create `components/bridge_lite/python/bridge_lite_client/transport.py`:

```python
from abc import ABC, abstractmethod
from typing import Callable

class Transport(ABC):
    @abstractmethod
    async def connect(self, host: str, port: int, path: str = "/esp-tree/lite/v1/ws") -> None:
        ...

    @abstractmethod
    async def send(self, data: bytes) -> None:
        ...

    @abstractmethod
    async def close(self) -> None:
        ...

    @abstractmethod
    def on_received(self, callback: Callable[[bytes], None]) -> None:
        ...

    @abstractmethod
    def is_connected(self) -> bool:
        ...
```

### Step 2.3: Auth + encryption module

Create `components/bridge_lite/python/bridge_lite_client/auth.py`:

This module implements:

1. **Challenge-response handshake** (JSON over WebSocket text frames):
   - Receive `{"type":"auth_challenge","nonce":"<hex>"}` from bridge
   - Compute `hmac_hex = HMAC-SHA256(api_key, "esp-tree-lite|v1|<client_name>|<server_nonce_hex>|<client_nonce_hex>").hex()`
   - Send `{"type":"auth_response","nonce":"<client_nonce_hex>","hmac":"<hmac_hex>","client":"<client_name>"}`
   - Receive `{"type":"auth_ok"}` or `{"type":"error","message":"auth_failed"}`

2. **Session key derivation**:
   - `session_key = HKDF-SHA256(api_key_bytes, server_nonce || client_nonce, "esp-tree-lite-v1-session")`
   - Split into two 32-byte keys: `key_c2s` (client→server), `key_s2c` (server→client)
   - Use `HKDF-SHA256(session_key, b"c2s", 32)` and `HKDF-SHA256(session_key, b"s2c", 32)` or split session_key in half.

   Actually, use the standard approach:
   - `session_key = HKDF-SHA256(salt=api_key_bytes, ikm=server_nonce||client_nonce, info="esp-tree-lite-v1-session")` producing 64 bytes
   - First 32 bytes = `key_c2s`, next 32 bytes = `key_s2c`

3. **Per-frame encryption** (ChaCha20-Poly1305 AEAD):
   - Each frame: `[4-byte counter LE][ciphertext][16-byte Poly1305 tag]`
   - Nonce construction: 12 bytes = `[4-byte counter LE][8 zero bytes]`
   - Counter starts at 0, monotonically increments per direction
   - Use `cryptography.hazmat.primitives.ciphers.aead.ChaCha20Poly1305`

```python
import hashlib
import hmac
import json
import os
import struct
from cryptography.hazmat.primitives.ciphers.aead import ChaCha20Poly1305
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes

PROTOCOL_NAME = "esp-tree-lite"
PROTOCOL_VERSION = "v1"
SESSION_INFO = f"{PROTOCOL_NAME}-{PROTOCOL_VERSION}-session"

class SessionKeys:
    def __init__(self, key_c2s: bytes, key_s2c: bytes):
        self.c2s = ChaCha20Poly1305(key_c2s)
        self.s2c = ChaCha20Poly1305(key_s2c)
        self.c2s_counter: int = 0
        self.s2c_counter: int = 0

    def encrypt(self, plaintext: bytes) -> bytes:
        nonce = struct.pack("<I", self.c2s_counter) + b"\x00" * 8
        self.c2s_counter += 1
        ciphertext = self.c2s.encrypt(nonce, plaintext, None)
        return struct.pack("<I", self.c2s_counter - 1) + ciphertext

    def decrypt(self, data: bytes) -> bytes:
        counter = struct.unpack("<I", data[:4])[0]
        nonce = struct.pack("<I", counter) + b"\x00" * 8
        plaintext = self.s2c.decrypt(nonce, data[4:], None)
        return plaintext


def compute_auth_hmac(api_key: str, client_name: str, server_nonce_hex: str, client_nonce_hex: str) -> str:
    msg = f"{PROTOCOL_NAME}|{PROTOCOL_VERSION}|{client_name}|{server_nonce_hex}|{client_nonce_hex}"
    return hmac.new(api_key.encode(), msg.encode(), hashlib.sha256).hexdigest()


def derive_session_keys(api_key: str, server_nonce: bytes, client_nonce: bytes) -> SessionKeys:
    ikm = server_nonce + client_nonce
    hkdf = HKDF(
        algorithm=hashes.SHA256(),
        length=64,
        salt=api_key.encode(),
        info=SESSION_INFO.encode(),
    )
    key_material = hkdf.derive(ikm)
    return SessionKeys(key_material[:32], key_material[32:])
```

### Step 2.4: WebSocket transport

Create `components/bridge_lite/python/bridge_lite_client/transport_ws.py`:

Implements `Transport` using `websockets` library:

1. Connect to `ws://<host>:<port>/esp-tree/lite/v1/ws`
2. Run auth handshake (JSON text frames):
   - Receive `auth_challenge`
   - Send `auth_response`
   - Receive `auth_ok`
3. Derive session keys
4. Switch to binary frames: all subsequent frames are `[4-byte counter][ChaCha20-Poly1305 ciphertext][16-byte tag]`
5. Decrypt inbound, encrypt outbound
6. Receive loop runs in background task, calls `on_received` callback with decrypted bytes
7. `send(proto_bytes)` encrypts and sends
8. Auto-reconnect with exponential backoff on disconnect

### Step 2.5: Flow control

Create `components/bridge_lite/python/bridge_lite_client/flow.py`:

```python
class FlowController:
    def __init__(self, max_inflight: int):
        self.max_inflight = max_inflight
        self.next_seq: int = 0
        self.pending: dict[int, asyncio.Event] = {}
        self.results: dict[int, bool] = {}

    def allocate_seq(self) -> int:
        seq = self.next_seq
        self.next_seq += 1
        self.pending[seq] = asyncio.Event()
        return seq

    async def wait_for_ack(self, seq: int, timeout: float = 5.0) -> bool:
        try:
            await asyncio.wait_for(self.pending[seq].wait(), timeout=timeout)
            return self.results.pop(seq, False)
        except asyncio.TimeoutError:
            return False
        finally:
            self.pending.pop(seq, None)

    def can_send(self) -> bool:
        return len(self.pending) < self.max_inflight

    def handle_send_result(self, seq: int, success: bool) -> None:
        self.results[seq] = success
        event = self.pending.get(seq)
        if event:
            event.set()
```

### Step 2.6: Top-level client

Create `components/bridge_lite/python/bridge_lite_client/client.py`:

```python
import asyncio
import logging
from typing import Callable, Optional
from google.protobuf.message import DecodeError
from .proto import espnow_bridge_pb2 as pb
from .transport import Transport
from .transport_ws import WebSocketTransport
from .auth import compute_auth_hmac, derive_session_keys, SessionKeys
from .flow import FlowController

log = logging.getLogger("bridge_lite_client")

class BridgeLiteClient:
    def __init__(self, host: str, port: int, api_key: str, client_name: str = "addon"):
        self.host = host
        self.port = port
        self.api_key = api_key
        self.client_name = client_name
        self.transport: Optional[WebSocketTransport] = None
        self.flow: Optional[FlowController] = None
        self.bridge_hello: Optional[pb.BridgeHello] = None
        self._on_frame: Optional[Callable[[pb.RadioFrame], None]] = None
        self._on_status: Optional[Callable[[pb.BridgeStatus], None]] = None
        self._on_disconnect: Optional[Callable[[], None]] = None

    async def connect(self) -> None:
        self.transport = WebSocketTransport(self.host, self.port)
        await self.transport.connect()
        # Auth handshake handled inside transport_ws
        self.transport.on_received(self._on_raw_message)
        # Wait for BridgeHello
        hello_data = await self.transport.recv_proto(timeout=10.0)
        msg = pb.BridgeMessage()
        msg.ParseFromString(hello_data)
        if msg.HasField("hello"):
            self.bridge_hello = msg.hello
            self.flow = FlowController(msg.hello.max_inflight)
            log.info("Connected to bridge %s, mode=%s, max_peers=%d, max_inflight=%d",
                     msg.hello.bridge_mac.hex(":"),
                     msg.hello.espnow_mode,
                     msg.hello.max_peers,
                     msg.hello.max_inflight)
        else:
            raise ConnectionError("Expected BridgeHello, got something else")

    async def send_frame(self, dst_mac: bytes, raw_frame: bytes, lr_mode: bool = True) -> bool:
        seq = self.flow.allocate_seq()
        send_msg = pb.BridgeMessage()
        send_msg.send.dst_mac = dst_mac
        send_msg.send.raw_frame = raw_frame
        send_msg.send.lr_mode = lr_mode
        send_msg.send.seq = seq
        await self.transport.send(send_msg.SerializeToString())
        return await self.flow.wait_for_ack(seq)

    def on_frame(self, callback: Callable[[pb.RadioFrame], None]) -> None:
        self._on_frame = callback

    def on_status(self, callback: Callable[[pb.BridgeStatus], None]) -> None:
        self._on_status = callback

    def on_disconnect(self, callback: Callable[[], None]) -> None:
        self._on_disconnect = callback

    def _on_raw_message(self, data: bytes) -> None:
        msg = pb.BridgeMessage()
        try:
            msg.ParseFromString(data)
        except DecodeError:
            log.warning("Failed to parse BridgeMessage")
            return
        if msg.HasField("frame") and self._on_frame:
            self._on_frame(msg.frame)
        elif msg.HasField("status") and self._on_status:
            self._on_status(msg.status)
        elif msg.HasField("result") and self.flow:
            self.flow.handle_send_result(msg.result.seq, msg.result.success)
```

### Step 2.7: Write tests

Create `components/bridge_lite/python/tests/test_auth.py`:

Test scenarios:
- `test_auth_hmac_roundtrip`: Compute HMAC on both sides (Python + expected values), verify match
- `test_session_key_derivation`: Derive session keys from known nonces, verify key material is deterministic
- `test_encrypt_decrypt_roundtrip`: Encrypt with `key_c2s`, decrypt with same key, verify plaintext matches
- `test_counter_increments`: Send 5 frames, verify counter increments from 0 to 4

Create `components/bridge_lite/python/tests/test_flow.py`:

Test scenarios:
- `test_seq_allocation`: Allocate seq numbers, verify 0, 1, 2...
- `test_flow_control_blocks_at_max`: Set max_inflight=2, allocate 2, verify `can_send()` returns False
- `test_ack_releases_slot`: Allocate seq, call `handle_send_result`, verify slot freed

```bash
cd components/bridge_lite/python
pip install -e ".[dev]"
pytest tests/
```

### Step 2.8: Lint

```bash
cd components/bridge_lite/python
ruff check bridge_lite_client/ tests/
```

---

## Phase 3: ESP Component — Core (No WebSocket Yet)

### Step 3.1: ESPHome component registration

Create `components/bridge_lite/__init__.py`:

```python
import esphome.codegen as cg
import esphome.config_validation as cv
from esphome.components.esp32 import add_idf_sdkconfig_option
from esphome.const import CONF_ID

CODEOWNERS = ["@your_github"]
DEPENDENCIES = ["wifi", "web_server"]
AUTO_LOAD = ["esp_tree_common"]

CONF_NETWORK_ID = "network_id"
CONF_PSK = "psk"
CONF_ESPNOW_MODE = "espnow_mode"
CONF_API_KEY = "api_key"

espnow_ns = cg.esphome_ns.namespace("esp_tree")
BridgeLite = espnow_ns.class_("BridgeLite", cg.Component)

CONFIG_SCHEMA = cv.Schema(
    {
        cv.GenerateID(): cv.declare_id(BridgeLite),
        cv.Required(CONF_NETWORK_ID): cv.string_strict,
        cv.Required(CONF_PSK): cv.All(cv.string_strict, cv.Length(min=1)),
        cv.Optional(CONF_ESPNOW_MODE, default="lr"): cv.one_of("lr", "regular", lower=True),
        cv.Optional(CONF_API_KEY, default=""): cv.string_strict,
    }
).extend(cv.COMPONENT_SCHEMA)

async def to_code(config):
    add_idf_sdkconfig_option("CONFIG_HTTPD_WS_SUPPORT", True)
    var = cg.new_Pvariable(config[CONF_ID])
    await cg.register_component(var, config)
    cg.add(var.set_network_id(config[CONF_NETWORK_ID]))
    cg.add(var.set_psk(config[CONF_PSK]))
    cg.add(var.set_api_key(config[CONF_API_KEY]))
    if config[CONF_ESPNOW_MODE] == "regular":
        cg.add(var.set_espnow_mode_regular())
    else:
        cg.add(var.set_espnow_mode_lr())
```

### Step 3.2: Main component header

Create `components/bridge_lite/bridge_lite.h`:

Key class members:
- `std::string network_id_`, `psk_`, `api_key_`, `espnow_mode_`
- `std::array<uint8_t, 6> sta_mac_` — bridge MAC
- `std::deque<RadioFrameBuffer> rx_ring_buffer_` — 100-frame circular buffer
- `std::map<std::string, uint32_t> peer_last_used_ms_` — for LRU eviction
- `BridgeTransport *transport_` — abstract transport
- `uint32_t tx_seq_{0}` — outgoing sequence counter
- `std::deque<PendingSendAck> pending_acks_` — seq→callback for send results

Key methods:
- `setup()` — WiFi, ESP-NOW init, PSK init, start WS server, mDNS announce
- `loop()` — drain RX ring buffer, send to transport, process incoming WS messages
- Static ISR callbacks: `on_data_received_`, `on_data_sent_`
- `handle_received_frame_()` — validate PSK tag, push to ring buffer
- `handle_send_result_()` — match seq, notify transport

### Step 3.3: Main component implementation

Create `components/bridge_lite/bridge_lite.cpp`:

The implementation is adapted from `esp_tree_bridge.cpp` but drastically simplified:

**From `esp_tree_bridge.cpp`, REUSE (with attribution/adaptation):**
- `init_wifi_and_espnow_()` — lines 336-368 (~33 lines) → same ESP-NOW init
- `add_peer_()` — lines 371-415 (~45 lines) → simplified (no session-aware protection check)
- `evict_stale_peer_()` — lines 448-479 (~32 lines) → simplified (no `is_peer_protected_()`)
- `on_data_received_()` / `on_data_sent_()` — lines 3183-3202 (~20 lines) → same ISR pattern
- PSK validation: call `espnow_crypto_psk_tag()` from `esp_tree_common`

**NEW code:**
- Ring buffer drain and protobuf serialization (~40 lines)
- `BridgeHello` construction and periodic `BridgeStatus` (~30 lines)
- Send-result tracking by seq number (~25 lines)
- WiFi RSSI, uptime, heap collection (~10 lines)
- mDNS service registration (~15 lines)

**Total estimated: ~250 lines** for `bridge_lite.cpp`

### Step 3.4: Transport abstraction

Create `components/bridge_lite/transport.h`:

```cpp
#pragma once
#include <cstddef>
#include <cstdint>
#include <functional>

namespace esphome {
namespace esp_tree {

class BridgeTransport {
 public:
  virtual ~BridgeTransport() = default;
  virtual bool start() = 0;
  virtual bool is_connected() = 0;
  virtual bool send(const uint8_t *data, size_t len) = 0;
  virtual void stop() = 0;
  void set_on_received(std::function<void(const uint8_t *, size_t)> callback) { on_received_ = std::move(callback); }
  void set_on_connected(std::function<void()> callback) { on_connected_ = std::move(callback); }
  void set_on_disconnected(std::function<void()> callback) { on_disconnected_ = std::move(callback); }

 protected:
  std::function<void(const uint8_t *, size_t)> on_received_;
  std::function<void()> on_connected_;
  std::function<void()> on_disconnected_;
};

}  // namespace esp_tree
}  // namespace esphome
```

### Step 3.5: Compile test (core only, no WS yet)

At this point, the core can compile with a null transport (or a simple serial debug transport) to verify ESP-NOW init, PSK tag check, ring buffer, and peer management all work.

Create `demos/espnow-bridge-lite.yml`:

```yaml
substitutions:
  name: espnow-bridge-lite

esphome:
  name: ${name}
  external_components:
    - source:
        type: local
        path: /external

esp_tree_bridge_lite:
  network_id: !secret network_id
  psk: !secret psk
  api_key: !secret api_key

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

web_server:
  port: 80
```

```bash
./compile.sh espnow-bridge-lite b
```

Fix compilation errors until it builds cleanly.

---

## Phase 4: WebSocket Transport + Auth + Encryption

### Step 4.1: WebSocket server

Create `components/bridge_lite/transport_ws.h` and `transport_ws.cpp`:

The WS server is adapted from `bridge_api_ws.cpp` (520 lines) but dramatically simplified:

**Removed** (vs `bridge_api_ws.cpp`):
- JSON message parsing/routing (~200 lines)
- `BridgeFacade` interface and all request handlers
- OTA frame handling
- Topology snapshot JSON
- All `type::` message types except auth

**Kept/adapted** (from `bridge_api_ws.cpp`):
- Raw WebSocket server setup via `web_server_base::global_web_server_base` (~50 lines)
- HTTP upgrade handling (~40 lines)
- Frame receive/send loop (~60 lines)
- Single-client lock (409 Conflict on second connection) (~10 lines)
- Connection lifecycle (connect, disconnect, cleanup) (~30 lines)

**New** (not in `bridge_api_ws.cpp`):
- Auth handshake: JSON challenge-response (~60 lines, adapted from `bridge_api_auth.cpp`)
- HKDF key derivation (~20 lines)
- ChaCha20-Poly1305 encrypt/decrypt per frame (~40 lines, using mbedTLS `mbedtls_chachapoly_*`)
- Binary frame handling (protobuf decode/encode) (~30 lines)
- `BridgeHello` send on connect (~15 lines)
- `BridgeStatus` periodic send (~15 lines)

**Total estimated: ~300 lines** for `transport_ws.cpp`, ~50 lines for `transport_ws.h`

### Step 4.2: Auth + encryption (C++ side, mbedTLS)

The C++ auth mirrors the Python `auth.py`:

1. **On WS connect:** Generate 16-byte random `server_nonce`, send `{"type":"auth_challenge","nonce":"<hex>"}` as text frame
2. **Receive auth_response:** Parse JSON, extract `client_nonce` and `hmac_hex`
3. **Validate HMAC:** Compute `HMAC-SHA256(api_key, "esp-tree-lite|v1|<client>|<server_nonce_hex>|<client_nonce_hex>")`, compare
4. **Send `{"type":"auth_ok"}`** or `{"type":"error","message":"auth_failed"}` and close
5. **Derive session keys:** `HKDF-SHA256(api_key_bytes, server_nonce||client_nonce, "esp-tree-lite-v1-session")` → two 32-byte keys
6. **Switch to binary frames:** All subsequent frames are encrypted

mbedTLS API for ChaCha20-Poly1305:

```cpp
#include <mbedtls/chachapoly.h>

// Encrypt:
mbedtls_chachapoly_context ctx;
mbedtls_chachapoly_init(&ctx);
mbedtls_chachapoly_setkey(&ctx, key_c2s);  // or key_s2c for decrypt
// nonce = counter (4 bytes LE) + 8 zero bytes
mbedtls_chachapoly_encrypt_and_tag(&ctx, plaintext_len, nonce, nullptr, 0, plaintext, ciphertext, tag);
mbedtls_chachapoly_free(&ctx);

// Decrypt:
mbedtls_chachapoly_init(&ctx);
mbedtls_chachapoly_setkey(&ctx, key_s2c);
mbedtls_chachapoly_auth_decrypt(&ctx, ciphertext_len, nonce, nullptr, 0, tag, ciphertext, plaintext);
mbedtls_chachapoly_free(&ctx);
```

### Step 4.3: Compile test with WS

```bash
./compile.sh espnow-bridge-lite b
```

Fix compilation errors. The binary should build with both ESP-NOW and WebSocket server.

---

## Phase 5: Integration Testing

### Step 5.1: Python mock server test

Write a test that:
1. Starts a mock WebSocket server (Python) that speaks the auth handshake
2. Connects `BridgeLiteClient`
3. Receives a `BridgeHello` (mock)
4. Sends a `RadioSend` with a dummy frame
5. Receives a `SendResult` (mock)
6. Verifies flow control blocks at `max_inflight`

```bash
cd components/bridge_lite/python
pytest tests/test_client.py -v
```

### Step 5.2: ESP ↔ Python round-trip test

Hardware test:
1. Flash `espnow-bridge-lite` to an ESP32
2. Run Python client: `python -m bridge_lite_client --host 192.168.1.x --api-key <key>`
3. Verify `BridgeHello` received with correct MAC, mode, max_peers
4. Send a `RadioSend` with a test frame
5. Verify `SendResult` comes back

### Step 5.3: Auth + encryption round-trip test

Test that:
1. Python client can authenticate with the ESP WS server
2. Encrypted protobuf frames round-trip correctly
3. Counter increments properly per direction
4. Reconnection re-establishes new session keys

---

## Phase 6: mDNS Discovery

### Step 6.1: ESP mDNS advertisement

In `bridge_lite.cpp` `setup()`:

```cpp
#include <mdns.h>

mdns_init();
mdns_hostname_set("espnow-bridge-lite");
mdns_instance_name_set("ESP-NOW LR Bridge Lite");
mdns_service_add("_espnowlr", "_tcp", 80, nullptr, 0);
```

### Step 6.2: Python mDNS discovery

In `transport_ws.py` or a separate `discovery.py`:

```python
from zeroconf import Zeroconf, ServiceBrowser, ServiceStateChange

async def discover_bridges(timeout: float = 5.0) -> list[dict]:
    # Uses zeroconf library to find _espnowlr._tcp services
    # Returns list of {"host": str, "port": int, "name": str}
    ...
```

Add `zeroconf` to `pyproject.toml` dependencies.

---

## Build Commands Summary

```bash
# Generate proto files (both C++ and Python)
cd components/bridge_lite/proto
protoc --nanopb_out=../nanopb/ espnow_bridge.proto
protoc --python_out=../python/bridge_lite_client/proto/ espnow_bridge.proto

# Python lint + test
cd components/bridge_lite/python
pip install -e ".[dev]"
ruff check bridge_lite_client/ tests/
pytest tests/ -v

# ESP compile
cd /home/ben/projects/ESPLR_V2
./compile.sh espnow-bridge-lite b
```

---

## Line Count Estimates (Final)

| File | Lines | Complexity |
|------|-------|------------|
| `proto/espnow_bridge.proto` | ~45 | Low |
| `nanopb/espnow_bridge.pb.{h,c}` | ~300 | Auto-gen |
| `__init__.py` | ~30 | Low |
| `bridge_lite.h` | ~80 | Low |
| `bridge_lite.cpp` | ~250 | Medium |
| `transport.h` | ~25 | Low |
| `transport_ws.h` | ~50 | Medium |
| `transport_ws.cpp` | ~300 | High |
| **ESP Total** | **~780** | |
| | | |
| `python/bridge_lite_client/client.py` | ~80 | Medium |
| `python/bridge_lite_client/transport.py` | ~25 | Low |
| `python/bridge_lite_client/transport_ws.py` | ~120 | Medium |
| `python/bridge_lite_client/auth.py` | ~80 | Medium |
| `python/bridge_lite_client/flow.py` | ~40 | Low |
| `python/bridge_lite_client/proto/espnow_bridge_pb2.py` | ~200 | Auto-gen |
| `python/tests/test_auth.py` | ~60 | Low |
| `python/tests/test_flow.py` | ~50 | Low |
| `python/tests/test_client.py` | ~80 | Medium |
| `python/pyproject.toml` | ~25 | Low |
| **Python Total** | **~660** | |
| | | |
| **Grand Total** | **~1440** | |

---

## Risk Items

| Risk | Impact | Mitigation |
|------|--------|------------|
| ChaCha20-Poly1305 nonce reuse | Catastrophic | Independent 32-bit counters per direction, reset on new session, reject out-of-order |
| WebSocket binary frame framing | Medium | Test with 250+ byte ESP-NOW frames (near MTU). WebSocket provides framing but verify buffer handling |
| nanopb + ESPHome build integration | Medium | Commit generated files to avoid CI dependency. Test with `./compile.sh` early |
| WiFi + ESP-NOW coexistence | Low | Same pattern as active bridge, proven |
| Single WS client lock (409) | Low | Same pattern as active bridge WS API |
| Ring buffer overflow under load | Low | 100 frames is generous for LR rates. Monitor `rx_queue_fill` in BridgeStatus |

---

## Dependency Graph

```
Phase 1: Proto schema ─────────────────────────────────────┐
                                                            │
Phase 2: Python client ──── depends on Phase 1 ────────────┤
                                                            │
Phase 3: ESP core ──── depends on Phase 1 ─────────────────┤
         (no WS yet, can test with null transport)          │
                                                            │
Phase 4: ESP WS transport ──── depends on Phase 3 ──────────┤
         + auth/encryption                                   │
                                                            │
Phase 5: Integration ──── depends on Phase 2 + Phase 4 ────┤
                                                            │
Phase 6: mDNS ──── depends on Phase 4 ─────────────────────┘
```

Phases 2 and 3 can proceed in parallel after Phase 1. Phase 5 requires both to be complete.