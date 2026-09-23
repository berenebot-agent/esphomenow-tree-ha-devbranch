# OTA Blast-then-Gaps Implementation Plan

## Summary

Replace the sliding-window OTA protocol with a blast-then-gaps protocol at the
8KB default increment size. The WS/HTTP API becomes protocol-agnostic: the
bridge exposes `requested` (the set of chunk sequences it needs) and the addon
delivers them unconditionally. No `window_size`, no `next_sequence`, no
understanding of increments or retransmission rounds.

This document covers every file that needs to change, what changes, estimated
line counts, and dependencies between phases. All phases are implemented in a
single feature branch and merged as one atomic commit — the old and new
protocols cannot interoperate.

---

## Design Decisions for Implementation

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Default increment size | 8KB | Safe on all ESP32 variants, smallest free heap guarantee |
| `ESPNOW_LR_MAX_INCREMENT_KB` | 8 (constant) | Bridge uses `min(remote_buffer_size_kb, ESPNOW_LR_MAX_INCREMENT_KB)` |
| Increment size negotiation | Remote advertises `buffer_size_kb` in ACCEPT, bridge picks `min(remote, MAX_INCREMENT_KB)` | Future-proof: can raise the constant later |
| API contract | `requested` array of sequences | Protocol-agnostic; addon is a dumb chunk server |
| `window_size` field | Removed everywhere | No longer meaningful |
| HA addon backward compat | None — must be updated alongside | Hard replace |
| `OtaChunkHeader` framing | Unchanged | Transport-layer concern, orthogonal to radio protocol |

---

## Phase 1: Protocol Types (`espnow_types.h`)

**File:** `components/esp_tree_common/espnow_types.h`  
**Estimate:** ~30 lines changed

### Changes

1. **Add new constants:**
   ```c
   #define ESPNOW_LR_FILE_PHASE_BLAST_COMPLETE 0x03
   #define ESPNOW_LR_FILE_ACK_GAPS 0x05
   #define ESPNOW_LR_BLAST_COMPLETE_TIMEOUT_MS 1000
   #define ESPNOW_LR_MAX_BLAST_COMPLETE_RETRIES 5
   #define ESPNOW_LR_MAX_RETRANSMIT_ROUNDS 10
   #define ESPNOW_LR_RADIO_SILENCE_ABORT_MS 10000
   #define ESPNOW_LR_MAX_INCREMENT_KB 8
   ```

2. **Remove old constants:**
   ```c
   // REMOVED: ESPNOW_LR_FILE_DEFAULT_WINDOW_SIZE 32
   // REMOVED: ESPNOW_LR_FILE_ACK_INTERVAL 4
   // REMOVED: ESPNOW_LR_FILE_ACK_TIMEOUT_MS 3000
   ```

3. **Remove `ESPNOW_LR_FILE_ACK_PROGRESS` (0x02)** from the result code enum.
   Add `ESPNOW_LR_FILE_ACK_GAPS` (0x05).

4. **Shrink `espnow_file_announce_t`** — remove `window_size` field:
   ```c
   typedef struct {
       uint8_t phase;          // 0x00
       uint32_t file_size;
       uint8_t md5[16];
       uint16_t chunk_size;
       uint8_t action;
       uint8_t file_id[12];
   } espnow_file_announce_t;   // 36 bytes (was 37)
   ```

5. **Shrink `espnow_file_data_header_t`** — remove `offset` field:
   ```c
   typedef struct {
       uint32_t sequence;
   } espnow_file_data_header_t;  // 4 bytes (was 8)
   ```

6. **Add `espnow_file_blast_complete_t`:**
   ```c
   typedef struct {
       uint8_t phase;            // = ESPNOW_LR_FILE_PHASE_BLAST_COMPLETE (0x03)
       uint16_t increment_index; // 0-based
   } espnow_file_blast_complete_t;  // 3 bytes
   ```

7. **Update overhead constant:**
   ```c
   #define ESPNOW_LR_FILE_DATA_HEADER_OVERHEAD \
     (ESPNOW_LR_HEADER_WITH_PSK_TAG_LEN + sizeof(espnow_file_data_header_t) + ESPNOW_LR_SESSION_TAG_LEN)
   // = 17 + 4 + 8 = 29 (was 33)

   #define ESPNOW_LR_FILE_DEFAULT_CHUNK_SIZE \
     (ESPNOW_LR_FILE_DATA_MAX_FRAME_SIZE - ESPNOW_LR_FILE_DATA_HEADER_OVERHEAD)
   // = 250 - 29 = 221 (was 217)
   ```

8. **Update static_assert** from 37 to 36 for `espnow_file_announce_t`, from 8 to 4 for `espnow_file_data_header_t`, and from 217 to 221 for `ESPNOW_LR_FILE_DEFAULT_CHUNK_SIZE`.

9. **Add `is_encrypted_packet` entry** for `PKT_FILE_DATA` if not already present (it is — verified).

### Verification
- All `static_assert`s pass after changes
- `sizeof(espnow_file_announce_t) == 36`
- `sizeof(espnow_file_data_header_t) == 4`
- `sizeof(espnow_file_blast_complete_t) == 3`
- `ESPNOW_LR_FILE_DEFAULT_CHUNK_SIZE == 221`

### Breaks
This phase breaks compilation. All downstream code that references removed
constants, struct fields, or old sizes will fail. This is intentional —
Phases 2-6 update that code.

---

## Phase 2: Remote File Receiver

**Files:**
- `components/esp_tree_remote/remote_file_receiver.h`
- `components/esp_tree_remote/remote_file_receiver.cpp`  

**Estimate:** ~400 lines changed (net ~150 lines added)

### New State Machine

```
IDLE → ANNOUNCED → RECEIVING → CHECKING → WRITING → RECEIVING → ... → WAITING_END → VERIFYING → COMPLETE → IDLE
                          ↑       │           │                  │
                          │       │           │                  │
                          └───────┘    (gaps found,         (next increment)
                                       retransmit round)
```

### `remote_file_receiver.h` Changes

1. **Add `IncrementBuffer` struct:**
   ```cpp
   struct IncrementBuffer {
       std::vector<uint8_t> data;             // pre-allocated to increment_data_size
       std::vector<uint8_t> received_bitmap;  // ceil(chunks / 8) bytes, LSB-first
       uint16_t chunks_received{0};
       uint16_t chunks_expected{0};
       uint8_t retransmit_round{0};

       void reset(uint16_t num_chunks, uint32_t data_size);
       bool is_complete() const { return chunks_received == chunks_expected; }
       bool is_chunk_received(uint16_t chunk_in_increment) const;
       void mark_chunk_received(uint16_t chunk_in_increment);
   };
   ```

2. **Replace `FileReceiver` state machine:**
   ```cpp
   enum class State : uint8_t {
       IDLE = 0,
       ANNOUNCED,
       RECEIVING,    // receiving FILE_DATA packets for current increment
       CHECKING,      // received BLAST_COMPLETE, checking bitmap
       WRITING,       // writing complete increment to flash
       WAITING_END,   // last increment written, waiting for END
       VERIFYING,     // END received, verifying MD5
       COMPLETE,      // reboot pending
   };
   ```

3. **Replace outer `FileReceiver` members:**

   Remove:
   - `acked_sequence_` (UINT32_MAX sentinel)
   - `chunks_since_last_ack_`
   - `last_ack_sent_ms_`
   - `receive_buffer_` (std::map of BufferedChunk)
   - `window_size_`
   - `BufferedChunk` struct
   - `flush_buffered_chunks_()`
   - `deliver_chunk_()`
   - `send_ack_progress_()`
   - `all_chunks_received_()`
   - `progress_pct_()`

   Add:
   ```cpp
   IncrementBuffer increment_buf_;
   uint16_t buffer_size_kb_{ESPNOW_LR_MAX_INCREMENT_KB};
   uint16_t chunks_per_increment_{0};
   uint16_t total_increments_{0};
   uint16_t chunks_in_last_increment_{0};
   uint16_t current_increment_{0};
   uint32_t total_chunks_{0};
   uint16_t chunk_payload_size_{0};
   uint8_t retransmit_round_{0};
   uint32_t last_blast_complete_tx_counter_{0};
   bool increment_written_{false};  // true after esp_ota_write for current increment
   ```

4. **New method declarations:**
   ```cpp
   bool handle_blast_complete_(const espnow_file_blast_complete_t &bc);
   bool send_gaps_ack_(const uint8_t *bitmap, size_t bitmap_len);
   bool write_increment_to_flash_();
   void compute_increment_geometry_();
   uint16_t chunks_in_increment_(uint16_t increment_index) const;
   uint32_t calc_chunk_data_len_(uint32_t sequence) const;
   ```

5. **`ActionHandler` interface changes:**
   - `on_announce` signature: remove `window_size` param, add `buffer_size_kb` output
   - `on_data` signature: remove `offset` param (offset is derived from sequence)

6. **`OTAFlashHandler` changes:**
   - State machine: `IDLE → RECEIVING → VERIFYING` (simplified, no longer tracks
     individual chunks — `FileReceiver` handles increment buffering)
   - `on_announce`: compute and return `buffer_size_kb` from
     `heap_caps_get_largest_free_block(MALLOC_CAP_8BIT)` with 50% safety margin
   - `on_data`: called per-chunk during flash write (sliced from increment buffer),
     but the `FileReceiver` calls it with data from the increment buffer, not
     directly from radio packets
   - Progressive MD5: `on_data` already calls `md5_digest_.add()`, this continues
     but now happens per-increment during `write_increment_to_flash_()`

### `remote_file_receiver.cpp` Changes

1. **`handle_announce_`**: 
   - Remove `window_size` validation (was `announce.window_size > ESPNOW_LR_FILE_DEFAULT_WINDOW_SIZE`)
   - Remove `window_size_` storage
   - Pass `buffer_size_kb_` (computed from heap) in ACCEPT trailing:
     `[chunk_size_lo, chunk_size_hi, buffer_size_kb, action]` = 4 bytes
   - Compute `chunks_per_increment_`, `total_increments_`, etc. from negotiated chunk size and buffer_size_kb
   - Allocate `increment_buf_` with `reset(chunks_per_increment_, increment_data_size)`

2. **`handle_file_data`**:
   - Remove offset validation (field removed from header)
   - Validate `sequence` is within current increment range `[increment_start, increment_end)`
   - Compute `chunk_in_increment = sequence % chunks_per_increment_`
   - If bitmap bit already set (duplicate), silently ignore
   - Store chunk data in `increment_buf_.data` at `chunk_in_increment * chunk_payload_size_`
   - Mark bitmap bit
   - State must be RECEIVING

3. **`handle_blast_complete_`**:
   - New handler for `ESPNOW_LR_FILE_PHASE_BLAST_COMPLETE` phase byte
   - Validate `increment_index == current_increment_`
   - Transition to CHECKING state
   - If all chunks received (`increment_buf_.is_complete()`): transition to WRITING
   - If gaps exist: send GAPS ACK with bitmap, increment `retransmit_round_`,
     stay in RECEIVING (reset bitmap for gap-only receiving)

4. **`handle_end_`**:
   - Must be in WAITING_END state (not just "all chunks received")
   - Transition to VERIFYING, call handler's `on_end()`
   - Handler does MD5 finalize, `esp_ota_end()`, `esp_ota_set_boot_partition()`

5. **`write_increment_to_flash_()`**:
   - Iterate increment buffer in `chunk_payload_size_` slices
   - Call `handler->on_data()` for each slice with `delay(0)` between
   - Handle flash write failure: retry once, then ABORT
   - On success: send empty GAPS ACK (INCREMENT_COMPLETE)
   - If last increment: transition to WAITING_END
   - Otherwise: reset `increment_buf_`, advance `current_increment_`, transition to RECEIVING

6. **`send_gaps_ack_()`**:
   - Build ACK packet: `[espnow_ack_t (6 bytes)][bitmap_length (2 bytes LE)][bitmap_data]`
   - `ack_type = PKT_FILE_TRANSFER`, `result = ESPNOW_LR_FILE_ACK_GAPS`
   - `ref_tx_counter = last_blast_complete_tx_counter_`
   - Empty bitmap (bitmap_length=0) = INCREMENT_COMPLETE

7. **`loop()`**:
   - Radio silence detection: if `(millis() - last_activity_ms_) > ESPNOW_LR_RADIO_SILENCE_ABORT_MS`, ABORT
   - Remove old inactivity timeout based on `ESPNOW_LR_FILE_ACK_TIMEOUT_MS * ESPNOW_LR_FILE_MAX_RETRIES`
   - COMPLETE phase ACK retries remain (same as current)

8. **`ACCEPT` trailing bytes change**: 3 bytes → 4 bytes:
   ```
   [chunk_size_lo, chunk_size_hi, buffer_size_kb, action]
   ```

9. **`handle_file_transfer` dispatch**: Add case for `ESPNOW_LR_FILE_PHASE_BLAST_COMPLETE`:
   ```cpp
   case ESPNOW_LR_FILE_PHASE_BLAST_COMPLETE:
       if (len != sizeof(espnow_file_blast_complete_t)) { ... }
       return handle_blast_complete_(*reinterpret_cast<const espnow_file_blast_complete_t*>(payload));
   ```

### Acknowledgment: `window_size` in ACCEPT trailing

Current ACCEPT trailing: `[chunk_size(2), action(1)]` = 3 bytes  
New ACCEPT trailing: `[chunk_size(2), buffer_size_kb(1), action(1)]` = 4 bytes

The `buffer_size_kb` value is computed by `OTAFlashHandler::on_announce`:
```cpp
uint32_t largest_free = heap_caps_get_largest_free_block(MALLOC_CAP_8BIT);
uint16_t buffer_kb = static_cast<uint16_t>((largest_free * 50) / 100 / 1024);
buffer_kb = std::max<uint16_t>(buffer_kb, 8);
buffer_kb = std::min<uint16_t>(buffer_kb, ESPNOW_LR_MAX_INCREMENT_KB);
```

---

## Phase 3: Remote Protocol Dispatch

**Files:**
- `components/esp_tree_remote/remote_protocol.h`
- `components/esp_tree_remote/remote_protocol.cpp`

**Estimate:** ~80 lines changed

### Changes

1. **`handle_file_transfer_()`**: Add dispatch for `ESPNOW_LR_FILE_PHASE_BLAST_COMPLETE`:
   ```cpp
   case ESPNOW_LR_FILE_PHASE_BLAST_COMPLETE:
       // Forward to FileReceiver
   ```

2. **`handle_ack_()`**: Add dispatch for `result == ESPNOW_LR_FILE_ACK_GAPS`:
   - No-op on remote side (GAPS ACKs are only sent BY the remote, received BY the bridge)
   - But add a catch-all to ignore them gracefully

3. **Remove PROGRESS ACK handling** from `handle_ack_()`. The remote no longer
   receives or processes PROGRESS ACKs. Actually, the remote *sends* PROGRESS
   ACKs — this needs to be removed from `send_ack_progress_()` (already removed
   in Phase 2).

4. **Add `send_gaps_ack_()` wrapper**: Called by `FileReceiver` via callback,
   encrypts and sends the GAPS ACK packet.

5. **`send_ack_fn_t` callback**: The current `send_ack_fn_t` type takes `(const uint8_t *payload, size_t len)`.
   The `FileReceiver` builds the full ACK payload including `espnow_ack_t` header.
   This does not change — `FileReceiver::send_ack_()` already builds the full packet.
   The `remote_protocol.cpp` wraps this with encryption and transmission.

---

## Phase 4: Bridge OTA Manager

**Files:**
- `components/esp_tree_bridge/bridge_ota_manager.h`
- `components/esp_tree_bridge/bridge_ota_manager.cpp`

**Estimate:** ~500 lines changed (net rewrite of most of bridge_ota_manager.cpp)

### New State Machine

```
IDLE → ANNOUNCING → BLASTING → WAITING_GAPS → BLASTING → ... → ENDING → IDLE
                     ↑              │
                     │   (gaps found, retransmit)
                     └──────────────┘
```

### `bridge_ota_manager.h` Changes

1. **Replace `Config` struct:**
   ```cpp
   struct Config {
       uint32_t global_timeout_ms{900000};
       uint32_t no_mem_backoff_ms{5};
       uint32_t max_no_mem_backoff_ms{250};
       uint32_t tx_cooldown_ms{2};
   };
   ```
   Remove: `window_size`, `max_chunk_attempts`, `max_control_attempts`, `min_chunk_size`,
   `ack_timeout_ms`, `remote_silence_timeout_ms`.

2. **Replace `WindowTracker`/`ChunkSlot` with `IncrementTracker`:**
   ```cpp
   struct IncrementTracker {
       uint16_t current_increment{0};
       uint16_t total_increments{0};
       uint16_t chunks_per_increment{0};
       uint16_t chunks_in_last_increment{0};
       uint32_t total_chunks{0};
       uint16_t buffer_size_kb{ESPNOW_LR_MAX_INCREMENT_KB};

       uint8_t retransmit_round{0};
       uint8_t blast_complete_retries{0};
       uint32_t blast_complete_sent_ms{0};
       uint32_t last_blast_complete_tx_counter{0};
       std::vector<uint32_t> blast_complete_tx_history;

       std::vector<uint8_t> received_bitmap;  // assembled from remote's GAPS ACK
       std::set<uint32_t> gap_sequences;      // derived from inverted bitmap
       std::set<uint32_t> requested_sequences; // sequences needed from source
       std::set<uint32_t> sent_sequences;     // sequences already sent over radio

       uint32_t last_remote_activity_ms{0};
   };
   ```

3. **Replace state enum:**
   ```cpp
   enum class State : uint8_t {
       IDLE = 0,
       ANNOUNCING,
       BLASTING,
       WAITING_GAPS,
       ENDING,
       ABORTING,
       COMPLETE,
       FAILED,
   };
   ```

4. **New private method declarations:**
   ```cpp
   bool send_blast_complete_();
   void handle_gaps_ack_(const uint8_t *trailing, size_t trailing_len);
   void compute_increment_geometry_();
   void request_increment_chunks_();
   void pump_blasting_();
   ```

5. **New member variables:**
   ```cpp
   IncrementTracker tracker_{};
   uint32_t announce_tx_counter_{0};
   // (keep existing members that are still relevant)
   ```

6. **Remove members:**
   - `WindowTracker window_`
   - `uint8_t progress_pct_`
   - `uint32_t last_ack_received_ms_`
   - `uint8_t consecutive_no_mem_errors_` (keep for NO_MEM backoff)
   - `request_chunk_fn_t` (replaced by source streaming model)

7. **Change `request_chunk_fn_t` to source streaming:**
   The current `request_chunk_fn_t` callback is `(uint32_t sequence, uint32_t offset, size_t length)`.
   In the new model, the bridge computes needed sequences and exposes them via
   `requested_sequences_` (a set). The HTTP/WS client polls status and delivers
   chunks. Remove `request_chunk_fn_t` — the bridge no longer "requests" individual
   chunks; it exposes what it needs and the source delivers what's available.

### `bridge_ota_manager.cpp` Changes

1. **`start_transfer()`**:
   - Compute increment geometry after ACCEPT (not before ANNOUNCE — we don't know
     `buffer_size_kb` until the remote sends ACCEPT)
   - `announce.file_size` is validated against 1GB limit
   - `announce.window_size` removed from struct
   - After ACCEPT: compute `chunks_per_increment`, `total_increments` from
     `negotiated_chunk_size_` and `buffer_size_kb`

2. **`on_file_ack()`**: Major rewrite
   - Accept: extract `buffer_size_kb` from new 4-byte trailing, compute increment geometry
   - Remove PROGRESS handling entirely
   - Add GAPS ACK handling:
     - Parse `bitmap_length` (2 bytes LE) after `espnow_ack_t` (6 bytes)
     - If `bitmap_length == 0`: INCREMENT_COMPLETE — advance to next increment
     - If `bitmap_length > 0`: parse bitmap, invert to find gap sequences,
       set up retransmit round, transition to BLASTING
     - Validate `ref_tx_counter` against `blast_complete_tx_history`
   - COMPLETE: mostly unchanged (validate action, check result)
   - ABORT: unchanged

3. **`on_source_chunk()`**: 
   - Accept any sequence in `tracker_.requested_sequences`
   - Mark sequence as received in source buffer
   - Send over radio immediately (blast-as-they-arrive)
   - When all requested sequences for current increment have been sent:
     send BLAST_COMPLETE, transition to WAITING_GAPS

4. **`loop()`**: Major rewrite
   - ANNOUNCING: retry ANNOUNCE with timeout (same as current)
   - BLASTING: request increment chunks via `request_increment_chunks_()`,
     send as they arrive
   - WAITING_GAPS: check for BLAST_COMPLETE timeout (1000ms), retry up to 5 times
   - ENDING: retry END with timeout
   - Radio silence detection: 10s → ABORT
   - Global timeout: 900s → ABORT

5. **`send_blast_complete_()`**:
   - Build `espnow_file_blast_complete_t` packet
   - Send via `send_frame_fn_`
   - Record `tx_counter` in `blast_complete_tx_history`
   - Increment `blast_complete_retries`

6. **`handle_gaps_ack_()`**:
   - Parse bitmap from trailing bytes
   - If empty: INCREMENT_COMPLETE — advance increment
   - If non-empty: build gap set, transition to BLASTING for retransmit
   - Validate `ref_tx_counter` against history

7. **`status_json()`**: 
   - Remove: `window_size`, `last_acked_seq`, `next_seq_to_send`, `next_seq_to_request`
   - Add: `current_increment`, `total_increments`, `retransmit_round`, `buffer_size_kb`
   - Change: `requested` is now increment-scoped, not window-scoped
   - Change: `max_chunk_size` → `chunk_size`

8. **Public API additions:**
   ```cpp
   const std::set<uint32_t> &requested_sequences() const { return tracker_.requested_sequences; }
   uint16_t buffer_size_kb() const { return tracker_.buffer_size_kb; }
   uint16_t current_increment() const { return tracker_.current_increment; }
   uint16_t total_increments() const { return tracker_.total_increments; }
   uint8_t retransmit_round() const { return tracker_.retransmit_round; }
   ```

---

## Phase 5: Bridge Protocol ACK Dispatch

**Files:**
- `components/esp_tree_bridge/bridge_protocol.h`
- `components/esp_tree_bridge/bridge_protocol.cpp`

**Estimate:** ~60 lines changed

### Changes

1. **Add `handle_gaps_ack_()`**: When `ack_header.result == ESPNOW_LR_FILE_ACK_GAPS`,
   forward to `ESPNowOTAManager::handle_gaps_ack()`.

2. **Add `send_blast_complete_()`**: Expose a function that the OTAManager calls
   to send a BLAST_COMPLETE packet. This records the tx_counter for correlation.

3. **Remove PROGRESS ACK handling**: The `handle_ack_()` switch case for
   `ESPNOW_LR_FILE_ACK_PROGRESS` is removed. The bridge no longer processes
   PROGRESS ACKs.

4. **Update `handle_ack_()` ref_tx_counter validation**: Currently only
   `announce_tx_counter_` is checked. Now GAPS ACKs reference
   `blast_complete_tx_counter`, so the dispatch must route to OTAManager
   which maintains its own history. The protocol layer should not filter by
   `ref_tx_counter` for file ACKs — let the OTAManager handle it.

5. **Add BLAST_COMPLETE dispatch in outgoing packet handling**: The
   `send_ota_frame()` function already supports sending arbitrary PKT_FILE_TRANSFER
   payloads. BLAST_COMPLETE uses this same path.

---

## Phase 6: Bridge REST API & WS API

**Files:**
- `components/esp_tree_bridge/esp_tree_bridge.h`
- `components/esp_tree_bridge/esp_tree_bridge.cpp`
- `components/esp_tree_bridge/bridge_api_types.h`
- `components/esp_tree_bridge/bridge_api_messages.h`
- `components/esp_tree_bridge/bridge_api_messages.cpp`
- `components/esp_tree_bridge/bridge_api_router.cpp`
- `components/esp_tree_bridge/bridge_api_ota_frame.h`
- `components/esp_tree_bridge/bridge_api_ota_frame.cpp`

**Estimate:** ~100 lines changed

### Generic API Contract

The WS and HTTP APIs expose a protocol-agnostic interface:

```
The bridge tells the source what chunks it needs via `requested`.
The source delivers those chunks. That's the entire contract.
```

### `bridge_api_types.h`

1. **Remove:** `static constexpr uint8_t kOtaWindowSize = 4;`

2. **Add:** `static constexpr uint8_t kOtaMaxIncrementKB = ESPNOW_LR_MAX_INCREMENT_KB;`
   (or just use the constant from `espnow_types.h`)

3. **`BridgeFacade` interface changes:**
   ```cpp
   virtual bool api_ota_start(const std::string &target_mac_colon,
                              uint32_t file_size, const std::string &md5_hex,
                              const std::string &sha256_hex,
                              const std::string &filename,
                              uint16_t preferred_chunk_size,
                              std::string &job_id_out,
                              uint16_t &max_chunk_size_out,
                              const std::string &request_id) = 0;
   ```
   Remove `window_size_out` parameter.

4. **`OtaJobState` enum**: Consider adding `BLASTING` and `WAITING_GAPS` states,
   or map them to existing `TRANSFERRING` state. The simplest approach is to keep
   the external states as: IDLE, WAITING_FOR_LEAF, TRANSFERRING, VERIFYING, SUCCESS, FAILED, ABORTED
   and map BLASTING/WAITING_GAPS → TRANSFERRING.

### `bridge_api_messages.h/.cpp`

1. **`ota_accepted()` signature change:**
   ```cpp
   static std::string ota_accepted(const std::string &id, const std::string &job_id,
                                   const std::string &target_mac, uint16_t chunk_size,
                                   uint32_t total_chunks,
                                   const std::vector<uint32_t> &requested);
   ```
   Remove `window_size` parameter, add `total_chunks` and `requested`.

2. **`ota_accepted()` JSON output:**
   ```json
   {
     "job_id": "...",
     "target_mac": "...",
     "chunk_size": 221,
     "total_chunks": 1234,
     "requested": [0, 1, 2, ..., 36]
   }
   ```

3. **`ota_status_result()`**: Unchanged — wraps the status JSON from `api_ota_status_json()`.

### `esp_tree_bridge.h/.cpp`

1. **`api_ota_start()`**: Remove `window_size_out` parameter. Add computation of
   `requested` sequences for the first increment after ACCEPT.

2. **`api_ota_status_json()`**: New JSON format:
   ```json
   {
     "active": true,
     "job_id": "...",
     "target_mac": "...",
     "state": "transferring",
     "percent": 29,
     "chunk_size": 221,
     "total_chunks": 1234,
     "current_increment": 2,
     "total_increments": 18,
     "retransmit_round": 0,
     "buffer_size_kb": 8,
     "requested": [296, 297, 298, ...],
     "message": ""
   }
   ```
   Remove: `bytes_received`, `next_sequence`, `window_size`, `max_chunk_size` (→ `chunk_size`)
   Add: `current_increment`, `total_increments`, `retransmit_round`, `buffer_size_kb`

3. **`api_ota_inject_chunk()`**: Unchanged — the bridge validates that the
   sequence is in `tracker_.requested_sequences`.

4. **`emit_ota_ws_events_()`**: The `ota.accepted` message now includes
   `requested` array and `total_chunks` instead of `window_size` and `next_sequence`.

5. **HTTP `/api/ota/status`**: Uses the same JSON as `api_ota_status_json()`.

6. **HTTP `/api/ota/chunk`**: Unchanged — still accepts `seq` + `data` (base64).

7. **HTTP `/api/ota/start`**: Unchanged — form-urlencoded `target`, `size`, `md5`.

8. **Remove `/api/ota/upload`**: Was never implemented, now formally removed.
   (Check if any code references it — the JS client uses `/api/ota/chunk` already.)

### `bridge_api_ota_frame.h/.cpp`

**No changes.** The `OtaChunkHeader` binary framing is transport-layer and
orthogonal to the radio protocol. The `sequence` field semantics don't change.

### `api_ota_status_json()` → `requested` Array

The `requested` array is populated from `tracker_.requested_sequences`. During
BLASTING state, this contains all sequences for the current increment. During
WAITING_GAPS (after GAPS ACK received), it contains only the gap sequences.

The array is serialized as a comma-separated JSON array of integers. For 8KB
increments at 221-byte chunks, this is ~37 entries — compact enough for both
WS and HTTP polling.

---

## Phase 7: Web UI and CLI — DEFERRED

**Status:** Not implemented in this iteration. The local web UI (`ota_web_page.h`)
and CLI script (`ota_cli.py`) still use the old sliding-window protocol. They
will stop working once the bridge switches to blast-then-gaps. Update them in a
follow-up, or rely on the WS API (Phase 8) for OTA transfers.

**Outstanding items when this phase is picked up:**

- `ota_web_page.h`: Convert JS client from window-based to `requested`-array-based delivery
- `ota_cli.py`: Rewrite from `/api/ota/upload` to `/api/ota/start` + `/api/ota/chunk` flow

---

## Phase 8: HA Addon Changes

**Files (in `/home/ben/projects/esphomenow-tree-ha/`):**
- `esphome-esp-tree-ha/app/bridge_ws_ota.py`
- `esphome-esp-tree-ha/app/ota_worker.py`
- `esphome-esp-tree-ha/app/ota_chunks.py` (NO CHANGE)
- `esphome-esp-tree-ha/ui/src/components/ota-progress.ts`
- `esphome-esp-tree-ha/ui/src/components/ota-box.ts`

**Estimate:** ~70 lines changed total

### `bridge_ws_ota.py`

Replace window-based tracking with `requested`-based delivery:

```python
# Current:
self._window_size = 4
self._next_sequence = 0
# Uses next_sequence from status, sends up to next_seq - 1

# New:
# self._window_size removed
# self._next_sequence removed
# From ota.accepted response: parse chunk_size, total_chunks, requested
# From ota.status response: parse requested array
# Delivery: for each seq in requested, send chunk binary frame
```

Key changes:
- `start()`: Parse `chunk_size`, `total_chunks`, `requested` from accepted response
- `send_all_chunks()`: Replace `while sent_sequence < next_seq - 1` loop with
  `for seq in status["requested"]: send_chunk(seq)`
- `poll_status()`: Parse `requested` array, `chunk_size`, `total_chunks`
- Remove `window_size` property

### `ota_worker.py`

Replace sequential send loop with `requested`-based delivery:

```python
# Current:
next_seq = int(status.get("next_sequence", 0))
window_size = int(status.get("window_size", 4))
max_send_seq = min(next_seq - 1, total_chunks - 1)
while sent_seq < max_send_seq:
    sent_seq += 1
    send_chunk(sent_seq)

# New:
requested = [int(s) for s in status.get("requested", [])]
for seq in requested:
    if seq not in delivered:
        chunk = read_chunk_from_file(path, seq, max_chunk)
        send_chunk_binary(job_id, seq, chunk)
        delivered.add(seq)
# Also re-send sequences that are in requested AND already delivered (retransmit)
for seq in sorted(requested):
    chunk = read_chunk_from_file(path, seq, max_chunk)
    send_chunk_binary(job_id, seq, chunk)
```

### `ota-progress.ts` / `ota-box.ts`

- Display `current_increment/total_increments` instead of window-based progress
- Parse `requested`, `chunk_size`, `total_chunks` from WS status messages
- Remove `window_size`, `next_sequence` from progress UI

---

## Phase 9: Tests

**Files:**
- `tests/bridge_ota_manager_test.cpp`

**Estimate:** ~400 lines (mostly rewrite)

### Test Cases

1. **blast_complete_then_gaps_empty** — happy path: ANNOUNCE → ACCEPT →
   blast all chunks → BLAST_COMPLETE → GAPS(empty) → advance increment →
   ... → END → COMPLETE(success)

2. **blast_complete_then_gaps_with_missing_chunks** — retransmit: blast →
   BLAST_COMPLETE → GAPS(bitmap with gaps) → retransmit gap chunks →
   BLAST_COMPLETE → GAPS(empty) → advance

3. **blast_complete_timeout_retry** — BLAST_COMPLETE timeout → retry up to 5
   times → then ABORT

4. **retransmit_rounds_exceeded** — 10 retransmit rounds → ABORT

5. **radio_silence_abort** — 10 seconds of silence → ABORT

6. **flash_write_failure_retry_once** — `esp_ota_write` fails → retry → fail → ABORT

7. **last_increment_partial** — fewer chunks in last increment

8. **accept_negotiation** — remote advertises `buffer_size_kb` smaller than
   `ESPNOW_LR_MAX_INCREMENT_KB`, bridge uses remote's value

9. **stale_gaps_ack_ignored** — GAPS ACK with `ref_tx_counter` not in recent
   BLAST_COMPLETE history → ignored

10. **lost_all_clear_recovery** — bridge retries BLAST_COMPLETE, remote re-sends
    empty GAPS ACK

11. **blast_complete_wrong_increment** — remote ignores BLAST_COMPLETE with
    wrong `increment_index`

12. **file_size_over_1gb_rejected** — ANNOUNCE with file_size > 1GB → REJECT

13. **dynamic_buffer_size_kb** — remote computes `buffer_size_kb` from heap

14. **increment_geometry** — verify chunks_per_increment, total_increments,
    chunks_in_last_increment for various file sizes and buffer sizes

15. **global_timeout** — 900s global timeout → ABORT

### Test Infrastructure Updates

- Replace `WindowTracker`/`ChunkSlot` mocks with `IncrementTracker` mocks
- Replace PROGRESS ACK simulation with GAPS ACK simulation
- Replace `feed_chunk()` with per-increment chunk delivery
- Update `make_ack()` to support GAPS result code and bitmap trailing
- Add `make_blast_complete()` helper

---

## Phase 10: Build Verification & Cleanup

**Estimate:** ~0 lines (compile fixes only)

1. Compile `espnow-remote` demo
2. Compile `espnow-bridge-c5` demo
3. Fix any compilation errors
4. Run host-side tests
5. Verify static_asserts pass

---

## Summary: Line Estimates by Phase

| Phase | Description | Lines Changed |
|-------|-------------|---------------|
| 1 | Protocol Types (`espnow_types.h`) | ~30 |
| 2 | Remote File Receiver | ~400 |
| 3 | Remote Protocol Dispatch | ~80 |
| 4 | Bridge OTA Manager | ~500 |
| 5 | Bridge Protocol ACK Dispatch | ~60 |
| 6 | Bridge REST & WS API | ~100 |
| 7 | Web UI & CLI | ~150 |
| 8 | HA Addon | ~70 |
| 9 | Tests | ~400 |
| 10 | Build Verification | ~0 |
| **Total** | | **~1,790** |

---

## Key Design Constants

| Constant | Value | Location |
|----------|-------|----------|
| `ESPNOW_LR_MAX_INCREMENT_KB` | 8 | `espnow_types.h` |
| `ESPNOW_LR_FILE_PHASE_BLAST_COMPLETE` | 0x03 | `espnow_types.h` |
| `ESPNOW_LR_FILE_ACK_GAPS` | 0x05 | `espnow_types.h` |
| `ESPNOW_LR_BLAST_COMPLETE_TIMEOUT_MS` | 1000 | `espnow_types.h` |
| `ESPNOW_LR_MAX_BLAST_COMPLETE_RETRIES` | 5 | `espnow_types.h` |
| `ESPNOW_LR_MAX_RETRANSMIT_ROUNDS` | 10 | `espnow_types.h` |
| `ESPNOW_LR_RADIO_SILENCE_ABORT_MS` | 10000 | `espnow_types.h` |
| `ESPNOW_LR_FILE_DEFAULT_CHUNK_SIZE` | 221 | `espnow_types.h` (computed) |
| Increment data size at 8KB | 8,148 bytes (221 × 36 + 212) | derived |
| Chunks per 8KB increment | 36 | derived |
| Bitmap size per 8KB increment | 5 bytes | derived |

---

## Implementation Order Constraints

1. **Phase 1 must come first** — all downstream code depends on the type changes.
2. **Phases 2-5 can be done in order** (remote side first, then bridge).
3. **Phase 6 depends on Phase 4** (status_json format comes from OTA manager).
4. **Phase 7 depends on Phase 6** (Web UI uses the new API format).
5. **Phase 8 depends on Phase 6** (HA addon uses the new WS API format).
6. **Phase 9 depends on Phases 1-5** (tests need the new state machines).
7. **Phase 10 comes last** (everything must compile).

The branch will not compile between Phase 1 and Phase 5 completion. This is
intentional and acceptable for a feature branch.

---

## Files Touched (Complete List)

### ESP-NOW LR V2 (this repo)

| File | Change Type |
|------|-------------|
| `components/esp_tree_common/espnow_types.h` | Modify (Phase 1) |
| `components/esp_tree_remote/remote_file_receiver.h` | Modify (Phase 2) |
| `components/esp_tree_remote/remote_file_receiver.cpp` | Modify (Phase 2) |
| `components/esp_tree_remote/remote_protocol.h` | Modify (Phase 3) |
| `components/esp_tree_remote/remote_protocol.cpp` | Modify (Phase 3) |
| `components/esp_tree_bridge/bridge_ota_manager.h` | Modify (Phase 4) |
| `components/esp_tree_bridge/bridge_ota_manager.cpp` | Modify (Phase 4) |
| `components/esp_tree_bridge/bridge_protocol.h` | Modify (Phase 5) |
| `components/esp_tree_bridge/bridge_protocol.cpp` | Modify (Phase 5) |
| `components/esp_tree_bridge/esp_tree_bridge.h` | Modify (Phase 6) |
| `components/esp_tree_bridge/esp_tree_bridge.cpp` | Modify (Phase 6) |
| `components/esp_tree_bridge/bridge_api_types.h` | Modify (Phase 6) |
| `components/esp_tree_bridge/bridge_api_messages.h` | Modify (Phase 6) |
| `components/esp_tree_bridge/bridge_api_messages.cpp` | Modify (Phase 6) |
| `components/esp_tree_bridge/bridge_api_router.cpp` | Modify (Phase 6) |
| `components/esp_tree_bridge/ota_web_page.h` | Deferred (Phase 7) |
| `scripts/ota_cli.py` | Deferred (Phase 7) |
| `tests/bridge_ota_manager_test.cpp` | Modify (Phase 9) |

### HA Addon (separate repo)

| File | Change Type |
|------|-------------|
| `app/bridge_ws_ota.py` | Modify (Phase 8) |
| `app/ota_worker.py` | Modify (Phase 8) |
| `ui/src/components/ota-progress.ts` | Modify (Phase 8) |
| `ui/src/components/ota-box.ts` | Modify (Phase 8) |

### No Changes Needed

| File | Reason |
|------|--------|
| `components/esp_tree_bridge/bridge_api_ota_frame.h` | Binary framing unchanged |
| `components/esp_tree_bridge/bridge_api_ota_frame.cpp` | Binary framing unchanged |
| `app/ota_chunks.py` | Binary encoding unchanged |
| `components/esp_tree_bridge/bridge_api_ws.cpp` | WS transport unchanged |
| Remote demo YAML configs | No struct changes visible to YAML |

---

## Nice-to-Haves (Deferred)

These are not required for the initial blast-then-gaps implementation but would
improve robustness, debuggability, or performance. Pick any up in later iterations.

### 1. Increment progress in `esplog`

The `esplog-master.py` log streaming service can already poll `/stream` for
device logs. A nice addition would be a `/api/ota/status` watcher that logs
increment progress and retransmit rounds to SQLite for post-mortem analysis
of OTA transfers over the air.

### 2. Adaptive increment sizing

Currently hardcoded to `ESPNOW_LR_MAX_INCREMENT_KB = 8`. A future improvement:
the bridge could dynamically adjust increment size based on measured packet
loss rate. If loss is <2%, bump to 16KB or 32KB. If loss is >10%, drop to 4KB.
This would require adding a `preferred_increment_kb` field to the bridge's
`Config` and extending the `requested` API to expose the current increment
size (it already does via `buffer_size_kb`).

### 3. OTA transfer metrics / diagnostics

Expose per-transfer metrics via `/api/ota/status`:
- `total_retransmit_rounds`: cumulative across all increments
- `chunks_lost`: total chunks that required retransmit
- `blast_time_ms`: time from first chunk sent to BLAST_COMPLETE acknowledged
- `transfer_time_ms`: total wall-clock time

This helps diagnose whether the 8KB increment size is too conservative or
just right for a given deployment.

### 4. Relay-aware pacing hint

The bridge currently uses `ESP_ERR_NO_MEM` backoff for pacing. For multi-hop
relay paths, a per-path pacing hint could be derived from hop count. The
relay just forwards packets — the bridge could increase `tx_cooldown_ms`
proportionally to `hops_to_bridge`. This is a small change in the bridge's
`Config` and would improve relay path reliability without protocol changes.

### 5. `/api/ota/upload` streaming endpoint

Currently removed (was never implemented). A follow-up could add a streaming
upload endpoint where the browser POSTs the entire firmware file and the bridge
slices it into chunks internally. This would simplify the JS client — no need
for chunk-by-chunk POST. However, the WS binary path (`OtaChunkHeader` framing)
already provides this for the HA addon, so this is low priority.

### 6. Resume after power-cycle

If the bridge restarts mid-transfer, the remote loses its increment buffer
(because it's in RAM). A future improvement: persist transfer state to flash
on the bridge side so a restart can resume from the last completed increment.
Requires the remote to re-ACCEPT with the same file_id and MD5. The protocol
already carries file_id — just need bridge-side persistence and remote-side
duplicate-ANNOUNCE detection to handle resumption.

### 7. OTA logging via `esplog`

Tag OTA state transitions in the ESP-NOW log stream so `esplog` can extract
a timeline: ANNOUNCE → ACCEPT → BLAST (increment 0) → GAPS → BLAST (increment 1)
→ ... → END → COMPLETE. Useful for field debugging without HTTP access to the bridge.