#include "../components/esp_tree_bridge/bridge_ota_manager.h"
#include "mocks/test_time.h"

#include <array>
#include <cstdint>
#include <cstring>
#include <iostream>
#include <set>
#include <string>
#include <vector>

using namespace esphome::esp_tree;

namespace {

int g_failures = 0;

void expect_impl(bool condition, const char *message, int line) {
  if (!condition) {
    std::cerr << "FAIL(" << line << "): " << message << '\n';
    ++g_failures;
  }
}

/* Macros so every failure reports the source line that asserted it. */
#define expect(condition, message) expect_impl((condition), (message), __LINE__)

struct SendRecord {
  espnow_packet_type_t type{PKT_DISCOVER};
  std::vector<uint8_t> payload;
  uint32_t tx_counter{0};
};

struct TestRig {
  std::array<uint8_t, 6> leaf_mac{{0x10, 0x11, 0x12, 0x13, 0x14, 0x15}};
  std::array<uint8_t, 16> md5{};
  uint32_t next_tx_counter{1000};
  uint32_t no_mem_failures_remaining{0};
  std::vector<SendRecord> sends;
  ESPNowOTAManager manager;

  TestRig() { wire_callbacks(); }

  // ESPNowOTAManager holds a std::recursive_mutex, so it is neither copyable
  // nor move-assignable; configure it at construction instead of assigning.
  explicit TestRig(const ESPNowOTAManager::Config &config) : manager(config) { wire_callbacks(); }

  void wire_callbacks() {
    manager.set_send_frame_fn([this](const uint8_t *, espnow_packet_type_t type, const uint8_t *payload,
                                     size_t len, uint32_t *tx_counter_out) {
      if (no_mem_failures_remaining > 0) {
        --no_mem_failures_remaining;
        return ESP_ERR_ESPNOW_NO_MEM;
      }
      SendRecord record{};
      record.type = type;
      record.payload.assign(payload, payload + static_cast<std::ptrdiff_t>(len));
      record.tx_counter = next_tx_counter++;
      sends.push_back(record);
      if (tx_counter_out != nullptr) {
        *tx_counter_out = record.tx_counter;
      }
      return ESP_OK;
    });
  }

  espnow_ack_t make_ack(uint8_t result, uint32_t ref_tx_counter) const {
    espnow_ack_t ack{};
    ack.ack_type = PKT_FILE_TRANSFER;
    ack.result = result;
    ack.ref_tx_counter = ref_tx_counter;
    return ack;
  }

  std::vector<uint8_t> make_gaps_trailing_empty() const { return {0, 0}; }

  std::vector<uint8_t> make_gaps_trailing_with_bitmap(const uint8_t *bitmap, size_t bitmap_len) const {
    std::vector<uint8_t> trailing(2 + bitmap_len, 0);
    uint16_t len_le = static_cast<uint16_t>(bitmap_len);
    std::memcpy(trailing.data(), &len_le, sizeof(len_le));
    if (bitmap_len > 0 && bitmap != nullptr) {
      std::memcpy(trailing.data() + 2, bitmap, bitmap_len);
    }
    return trailing;
  }

  void send_accept(uint32_t announce_tx_counter, uint16_t chunk_size, uint8_t buffer_size_kb,
                   uint8_t action = ESPNOW_FILE_ACTION_OTA_FLASH) {
    uint8_t trailing[4] = {
        static_cast<uint8_t>(chunk_size & 0xFF),
        static_cast<uint8_t>((chunk_size >> 8) & 0xFF),
        buffer_size_kb,
        action,
    };
    const espnow_ack_t ack = make_ack(ESPNOW_FILE_ACK_ACCEPT, announce_tx_counter);
    manager.on_file_ack(leaf_mac.data(), ack, trailing, sizeof(trailing));
  }

  void send_gaps_empty(uint32_t ref_tx_counter) {
    const espnow_ack_t ack = make_ack(ESPNOW_FILE_ACK_GAPS, ref_tx_counter);
    auto trailing = make_gaps_trailing_empty();
    manager.on_file_ack(leaf_mac.data(), ack, trailing.data(), trailing.size());
  }

  void send_gaps_bitmap(uint32_t ref_tx_counter, const uint8_t *bitmap, size_t bitmap_len) {
    const espnow_ack_t ack = make_ack(ESPNOW_FILE_ACK_GAPS, ref_tx_counter);
    auto trailing = make_gaps_trailing_with_bitmap(bitmap, bitmap_len);
    manager.on_file_ack(leaf_mac.data(), ack, trailing.data(), trailing.size());
  }

  void send_complete(uint32_t ref_tx_counter, uint8_t action = ESPNOW_FILE_ACTION_OTA_FLASH,
                     uint8_t result = ESPNOW_FILE_COMPLETE_SUCCESS) {
    uint8_t trailing[2] = {action, result};
    const espnow_ack_t ack = make_ack(ESPNOW_FILE_ACK_COMPLETE, ref_tx_counter);
    manager.on_file_ack(leaf_mac.data(), ack, trailing, sizeof(trailing));
  }

  /* One manager loop cycle's worth of mock time. The manager only transmits one
   * chunk per loop pass when config tx_cooldown_ms (default 2 ms,
   * bridge_ota_manager.h:26) has elapsed since the previous chunk
   * (bridge_ota_manager.cpp:562-565), and its timeout bookkeeping is
   * timestamp-gated (`blast_complete_sent_ms > 0`,
   * bridge_ota_manager.cpp:297; `last_remote_activity_ms > 0`,
   * bridge_ota_manager.cpp:273). Advancing the clock before each pump models a
   * real device loop (whose millis() is well past 0) and keeps every timestamp
   * the manager records non-zero. */
  static constexpr uint32_t kLoopCycleMs = 3;

  bool feed_chunk(uint32_t sequence, uint8_t base, size_t len) {
    std::vector<uint8_t> chunk(len, 0);
    for (size_t i = 0; i < len; ++i) {
      chunk[i] = static_cast<uint8_t>(base + i);
    }
    /* on_source_chunk() only QUEUES the chunk; transmission happens in
     * pump_queued_chunks_(), which is driven from loop(). Pump once per chunk so
     * the test observes the wire traffic a real run would produce. */
    test::advance_mock_time_ms(kLoopCycleMs);
    const bool accepted = manager.on_source_chunk(sequence, chunk.data(), chunk.size());
    manager.loop();
    return accepted;
  }

  SendRecord &last_send() { return sends.back(); }

  size_t count_type(espnow_packet_type_t type) const {
    size_t n = 0;
    for (const auto &s : sends) {
      if (s.type == type) {
        ++n;
      }
    }
    return n;
  }

  SendRecord *find_last_bc() {
    for (int i = static_cast<int>(sends.size()) - 1; i >= 0; --i) {
      if (sends[i].type == PKT_FILE_TRANSFER && sends[i].payload.size() == 3 &&
          sends[i].payload[0] == ESPNOW_FILE_PHASE_BLAST_COMPLETE) {
        return &sends[i];
      }
    }
    return nullptr;
  }

  /* Assert-and-return so a missing BLAST_COMPLETE is reported as a failure with
   * a useful message instead of segfaulting on a null dereference further down
   * (which also aborts the remaining assertions in the test). A sentinel is
   * returned on failure so callers that immediately dereference are still safe;
   * the failure has already been recorded by expect(). */
  SendRecord *require_last_bc(const char *where) {
    static SendRecord sentinel{};
    SendRecord *rec = find_last_bc();
    expect(rec != nullptr, where);
    return rec != nullptr ? rec : &sentinel;
  }

  SendRecord *require_last_end(const char *where) {
    static SendRecord sentinel{};
    SendRecord *rec = find_last_end();
    expect(rec != nullptr, where);
    return rec != nullptr ? rec : &sentinel;
  }

  SendRecord *find_last_end() {
    for (int i = static_cast<int>(sends.size()) - 1; i >= 0; --i) {
      if (sends[i].type == PKT_FILE_TRANSFER && sends[i].payload.size() == 1 &&
          sends[i].payload[0] == ESPNOW_FILE_PHASE_END) {
        return &sends[i];
      }
    }
    return nullptr;
  }
};

static std::vector<uint8_t> build_bitmap_all_received(size_t num_chunks) {
  size_t bitmap_bytes = (num_chunks + 7) / 8;
  std::vector<uint8_t> bitmap(bitmap_bytes, 0);
  for (size_t i = 0; i < num_chunks; ++i) {
    size_t byte_idx = i / 8;
    uint8_t bit_mask = static_cast<uint8_t>(1 << (i % 8));
    bitmap[byte_idx] |= bit_mask;
  }
  return bitmap;
}

static std::vector<uint8_t> build_bitmap_missing_last(size_t num_chunks) {
  size_t bitmap_bytes = (num_chunks + 7) / 8;
  std::vector<uint8_t> bitmap(bitmap_bytes, 0);
  for (size_t i = 0; i < num_chunks - 1; ++i) {
    size_t byte_idx = i / 8;
    uint8_t bit_mask = static_cast<uint8_t>(1 << (i % 8));
    bitmap[byte_idx] |= bit_mask;
  }
  return bitmap;
}

void test_file_size_over_1gb_rejected() {
  test::reset_mock_state();

  TestRig rig;
  expect(!rig.manager.is_busy(), "manager starts IDLE");

  uint8_t large_md5[16] = {0};
  bool started = rig.manager.start_transfer(rig.leaf_mac.data(), 1073741825U, large_md5,
                                            ESPNOW_FILE_ACTION_OTA_FLASH, 250);
  expect(!started, "1GB+1 file_size rejected");
  expect(rig.sends.empty(), "no packets sent for rejected transfer");
}

void test_increment_geometry_single_increment() {
  test::reset_mock_state();

  TestRig rig;
  expect(rig.manager.start_transfer(rig.leaf_mac.data(), 884, rig.md5.data(), ESPNOW_FILE_ACTION_OTA_FLASH, 250),
         "transfer starts");
  const uint32_t announce_tx = rig.sends.front().tx_counter;

  rig.send_accept(announce_tx, 221, 8);

  const auto &tr = rig.manager.increment_tracker();
  expect(tr.chunks_per_increment == 37, "8KB / 221 = 37 chunks per increment");
  expect(tr.total_chunks == 4, "884 bytes / 221 = 4 chunks");
  expect(tr.total_increments == 1, "4 chunks fits in 1 increment");
  expect(tr.chunks_in_last_increment == 4, "last increment has 4 chunks");
}

void test_increment_geometry_partial_last() {
  test::reset_mock_state();

  TestRig rig;
  uint32_t file_size = 8177 + 59;
  expect(rig.manager.start_transfer(rig.leaf_mac.data(), file_size, rig.md5.data(),
                                    ESPNOW_FILE_ACTION_OTA_FLASH, 250),
         "transfer starts");
  const uint32_t announce_tx = rig.sends.front().tx_counter;

  rig.send_accept(announce_tx, 221, 8);

  const auto &tr = rig.manager.increment_tracker();
  expect(tr.total_chunks == 38, "8177+59 bytes needs 38 chunks");
  expect(tr.chunks_per_increment == 37, "37 chunks per full increment");
  expect(tr.total_increments == 2, "ceil(38/37) = 2 increments");
  expect(tr.chunks_in_last_increment == 1, "last increment has 1 chunk");
}

void test_increment_geometry_multi_increment() {
  test::reset_mock_state();

  TestRig rig;
  uint32_t file_size = 37 * 4 * 221 + 1;
  expect(rig.manager.start_transfer(rig.leaf_mac.data(), file_size, rig.md5.data(),
                                    ESPNOW_FILE_ACTION_OTA_FLASH, 250),
         "transfer starts");
  const uint32_t announce_tx = rig.sends.front().tx_counter;

  rig.send_accept(announce_tx, 221, 8);

  const auto &tr = rig.manager.increment_tracker();
  expect(tr.total_chunks == 149, "4*37+1 = 149 chunks");
  expect(tr.total_increments == 5, "ceil(149/37) = 5 increments");
  expect(tr.chunks_in_last_increment == 1, "last has 1 chunk");
}

void test_blast_complete_then_gaps_empty_single_increment() {
  test::reset_mock_state();

  TestRig rig;
  expect(rig.manager.start_transfer(rig.leaf_mac.data(), 884, rig.md5.data(), ESPNOW_FILE_ACTION_OTA_FLASH, 250),
         "transfer starts");
  expect(rig.sends.size() == 1, "announce sent");

  const uint32_t announce_tx = rig.sends.front().tx_counter;
  rig.send_accept(announce_tx, 221, 8);

  expect(rig.manager.current_increment() == 0, "current_increment = 0");
  expect(rig.manager.total_increments() == 1, "1 increment total");

for (uint32_t seq = 0; seq < 4; ++seq) {
    rig.feed_chunk(seq, static_cast<uint8_t>(seq * 10), 221);
  }

  /* 1 announce + 4 data chunks + BLAST_COMPLETE (the END comes later, once the
   * remote acks the BLAST_COMPLETE with an all-received GAPS bitmap). */
  expect(rig.sends.size() == 6, "1 announce + 4 data chunks + BLAST_COMPLETE");
  auto *bc = rig.require_last_bc("BLAST_COMPLETE sent");
  expect(bc->payload.size() == 3, "BLAST_COMPLETE is 3 bytes");
  expect(bc->payload[0] == ESPNOW_FILE_PHASE_BLAST_COMPLETE, "phase is BLAST_COMPLETE");

  const uint32_t bc_tx = bc->tx_counter;
  expect(bc_tx > announce_tx, "BLAST_COMPLETE tx > announce tx");

  expect(rig.manager.increment_tracker().is_last_increment(), "is last increment");

  rig.send_gaps_empty(bc_tx);

  rig.manager.loop();

  auto *end_rec = rig.require_last_end("END packet sent after last increment complete");
  expect(end_rec->payload.size() == 1, "END is 1 byte");
  expect(end_rec->payload[0] == ESPNOW_FILE_PHASE_END, "phase is END");

  rig.send_complete(end_rec->tx_counter);

  expect(!rig.manager.is_busy(), "manager reset after COMPLETE");
}

void test_blast_complete_then_gaps_empty_multi_increment() {
  test::reset_mock_state();

  TestRig rig;
  uint32_t file_size = 37 * 2 * 221;
  expect(rig.manager.start_transfer(rig.leaf_mac.data(), file_size, rig.md5.data(), ESPNOW_FILE_ACTION_OTA_FLASH, 250),
         "transfer starts");
  expect(rig.sends.size() == 1, "announce sent");

  const uint32_t announce_tx = rig.sends.front().tx_counter;
  rig.send_accept(announce_tx, 221, 8);

  expect(rig.manager.total_increments() == 2, "2 increments");
  expect(rig.manager.increment_tracker().chunks_per_increment == 37, "37 chunks per inc");

  for (int inc = 0; inc < 2; ++inc) {
    uint16_t chunks = rig.manager.increment_tracker().chunks_in_this_increment();
    uint32_t start_seq = static_cast<uint32_t>(inc) * 37;

    for (uint16_t i = 0; i < chunks; ++i) {
      uint32_t seq = start_seq + i;
      rig.feed_chunk(seq, static_cast<uint8_t>(i * 10), 221);
    }

    auto *bc = rig.require_last_bc("BLAST_COMPLETE sent");
    expect(bc != nullptr, "BLAST_COMPLETE sent for increment");

    uint16_t expected_inc_idx = static_cast<uint16_t>(inc);
    uint16_t bc_inc_idx = bc->payload[1] | (static_cast<uint16_t>(bc->payload[2]) << 8);
    expect(bc_inc_idx == expected_inc_idx, "BLAST_COMPLETE has correct increment index");

    const uint32_t bc_tx = bc->tx_counter;
    rig.send_gaps_empty(bc_tx);
  }

  /* The last increment's all-received GAPS ack does NOT finish the transfer:
   * handle_gaps_ack_() switches to State::ENDING and sends END
   * (bridge_ota_manager.cpp:709-715); the transfer only completes when the
   * remote's FILE_ACK_COMPLETE arrives (bridge_ota_manager.cpp:793-800). */
  auto *end_rec = rig.require_last_end("END sent after both increments");
  expect(end_rec->payload.size() == 1, "END is 1 byte");
  expect(end_rec->payload[0] == ESPNOW_FILE_PHASE_END, "phase is END");

  rig.send_complete(end_rec->tx_counter);

  expect(!rig.manager.is_busy(), "manager not busy after COMPLETE for 2 increments");
}

void test_blast_complete_then_gaps_with_missing_chunks() {
  test::reset_mock_state();

  TestRig rig;
  expect(rig.manager.start_transfer(rig.leaf_mac.data(), 8177 + 59, rig.md5.data(),
                                    ESPNOW_FILE_ACTION_OTA_FLASH, 250),
         "transfer starts");
  const uint32_t announce_tx = rig.sends.front().tx_counter;
  rig.send_accept(announce_tx, 221, 8);

  expect(rig.manager.total_increments() == 2, "2 increments");

  /* BLAST_COMPLETE is only emitted once every requested sequence of the
   * increment has been handed to and pumped out by the manager
   * (bridge_ota_manager.cpp:592-599: pending_chunks_ empty AND
   * requested_sequences empty). Feed a full 37-chunk increment, then let the
   * remote's bitmap report chunk 36 as missing. */
  uint32_t inc0_start = 0;
  for (uint32_t seq = inc0_start; seq < inc0_start + 37; ++seq) {
    rig.feed_chunk(seq, static_cast<uint8_t>(seq * 10), 221);
  }

  expect(rig.sends.size() == 1 + 37 + 1, "1 announce + 37 data chunks + BLAST_COMPLETE");
  auto *bc = rig.require_last_bc("BLAST_COMPLETE sent");
  const uint32_t bc_tx = bc->tx_counter;

  auto bitmap = build_bitmap_missing_last(37);
  rig.send_gaps_bitmap(bc_tx, bitmap.data(), bitmap.size());

  expect(rig.manager.increment_tracker().retransmit_round == 1, "retransmit_round = 1");
  expect(rig.manager.increment_tracker().gap_sequences.size() == 1, "1 gap (chunk 36 missing)");
  if (!rig.manager.increment_tracker().gap_sequences.empty()) {
    expect(*rig.manager.increment_tracker().gap_sequences.begin() == 36, "gap is seq 36");
  }

  rig.feed_chunk(36, 0xBB, 221);

  bc = rig.require_last_bc("BLAST_COMPLETE re-sent");
  const uint32_t bc_tx2 = bc->tx_counter;
  expect(bc_tx2 != bc_tx, "second BLAST_COMPLETE has new tx_counter");

  rig.send_gaps_empty(bc_tx2);

  expect(rig.manager.increment_tracker().current_increment == 1, "advanced to increment 1");
  expect(rig.manager.increment_tracker().is_last_increment(), "increment 1 is last");

  rig.feed_chunk(37, 0xCC, 59);

  bc = rig.require_last_bc("BLAST_COMPLETE re-sent");
  expect(bc != nullptr, "BLAST_COMPLETE for last increment sent");
  const uint32_t bc_tx3 = bc->tx_counter;
  expect(bc_tx3 != bc_tx2, "last increment BLAST_COMPLETE has new tx_counter");

  /* END for the last increment is emitted when the remote acks that
   * BLAST_COMPLETE with an all-received (empty) GAPS bitmap
   * (bridge_ota_manager.cpp:709-715). */
  rig.send_gaps_empty(bc_tx3);

  auto *end_rec = rig.require_last_end("END sent after last increment's GAPS ack");
  expect(end_rec->payload.size() == 1, "END is 1 byte");

  rig.send_complete(end_rec->tx_counter);
  expect(!rig.manager.is_busy(), "manager done after COMPLETE");
}

void test_blast_complete_timeout_retry() {
  test::reset_mock_state();

  TestRig rig;
  expect(rig.manager.start_transfer(rig.leaf_mac.data(), 884, rig.md5.data(), ESPNOW_FILE_ACTION_OTA_FLASH, 250),
         "transfer starts");
  const uint32_t announce_tx = rig.sends.front().tx_counter;
  rig.send_accept(announce_tx, 221, 8);

  size_t sends_before_timeout = 0;
  for (uint32_t seq = 0; seq < 4; ++seq) {
    rig.feed_chunk(seq, static_cast<uint8_t>(seq * 10), 221);
    sends_before_timeout = rig.sends.size();
  }

  auto *bc = rig.require_last_bc("BLAST_COMPLETE sent");
  const uint32_t first_bc_tx = bc->tx_counter;

  rig.manager.loop();
  expect(rig.sends.size() == sends_before_timeout, "no new sends before timeout");

  /* Each timeout window re-sends BLAST_COMPLETE and increments
   * blast_complete_retries (bridge_ota_manager.cpp:303, 422); the initial send
   * already counted as retry 1. The guard is `blast_complete_retries >=
   * ESPNOW_MAX_BLAST_COMPLETE_RETRIES` (bridge_ota_manager.cpp:299), so the
   * 20th window aborts. */
  for (int i = 0; i < ESPNOW_MAX_BLAST_COMPLETE_RETRIES - 1; ++i) {
    test::advance_mock_time_ms(ESPNOW_BLAST_COMPLETE_TIMEOUT_MS);
    rig.manager.loop();
  }

  auto *retry_bc = rig.require_last_bc("BLAST_COMPLETE retried on timeout");
  expect(retry_bc->tx_counter != first_bc_tx, "retry BLAST_COMPLETE has a new tx_counter");
  expect(rig.manager.is_busy(), "still busy while retries remain");

  test::advance_mock_time_ms(ESPNOW_BLAST_COMPLETE_TIMEOUT_MS);
  rig.manager.loop();

  expect(!rig.manager.is_busy(), "manager aborted after max retries");
  expect(rig.manager.last_error() == "BLAST_COMPLETE retry limit exceeded", "correct error");
}

void test_retransmit_rounds_exceeded() {
  test::reset_mock_state();

  TestRig rig;
  expect(rig.manager.start_transfer(rig.leaf_mac.data(), 8177 + 59, rig.md5.data(),
                                    ESPNOW_FILE_ACTION_OTA_FLASH, 250),
         "transfer starts");
  const uint32_t announce_tx = rig.sends.front().tx_counter;
  rig.send_accept(announce_tx, 221, 8);

  /* Each retransmit round needs a full blast of the increment before the
   * manager will emit BLAST_COMPLETE: pump_queued_chunks_() only sends it when
   * pending_chunks_ and requested_sequences are both empty
   * (bridge_ota_manager.cpp:592-599). Reporting chunk 36 missing then makes
   * handle_gaps_ack_() open a new retransmit round (bridge_ota_manager.cpp:768).
   * The guard `retransmit_round >= ESPNOW_MAX_RETRANSMIT_ROUNDS`
   * (bridge_ota_manager.cpp:734) aborts on the bitmap that arrives when the
   * round counter already reads 10, i.e. the 11th bitmap. */
  for (int round = 0; round <= ESPNOW_MAX_RETRANSMIT_ROUNDS; ++round) {
    const uint32_t inc_start = static_cast<uint32_t>(rig.manager.current_increment()) * 37;

    for (uint32_t seq = inc_start; seq < inc_start + 37; ++seq) {
      rig.feed_chunk(seq, static_cast<uint8_t>(seq * 10), 221);
    }

    auto *bc = rig.require_last_bc("BLAST_COMPLETE sent");
    expect(bc->payload.size() == 3, "BLAST_COMPLETE is 3 bytes");

    auto bitmap = build_bitmap_missing_last(37);
    rig.send_gaps_bitmap(bc->tx_counter, bitmap.data(), bitmap.size());

    /* Read the counters before the aborted (11th) bitmap: fail_transfer_() calls
     * reset_()/IncrementTracker::reset() (bridge_ota_manager.cpp:829-830), which
     * zeroes retransmit_round. */
    if (!rig.manager.is_busy()) {
      expect(rig.manager.increment_tracker().retransmit_round == 0,
             "tracker reset by the abort");
      break;
    }
    expect(rig.manager.increment_tracker().retransmit_round == round + 1,
           "retransmit_round advanced per bitmap");
    expect(rig.manager.increment_tracker().current_increment == 0,
           "increment never advanced while gaps persisted");
  }

  expect(!rig.manager.is_busy(), "manager aborted after retransmit rounds exceeded");
  expect(rig.manager.last_error() == "retransmit rounds exceeded", "correct error");
}

void test_radio_silence_abort() {
  test::reset_mock_state();

  TestRig rig;
  expect(rig.manager.start_transfer(rig.leaf_mac.data(), 884, rig.md5.data(), ESPNOW_FILE_ACTION_OTA_FLASH, 250),
         "transfer starts");
  const uint32_t announce_tx = rig.sends.front().tx_counter;
  rig.send_accept(announce_tx, 221, 8);

  for (uint32_t seq = 0; seq < 4; ++seq) {
    rig.feed_chunk(seq, static_cast<uint8_t>(seq * 10), 221);
  }

  /* The 4th chunk completes the increment, so the manager is in
   * State::WAITING_GAPS waiting for the remote's GAPS bitmap. That state uses
   * the longer silence window: `silence_timeout_ms = (state_ ==
   * State::WAITING_GAPS) ? ESPNOW_WAITING_GAPS_TIMEOUT_MS :
   * ESPNOW_RADIO_SILENCE_ABORT_MS` (bridge_ota_manager.cpp:275). */
  test::advance_mock_time_ms(ESPNOW_RADIO_SILENCE_ABORT_MS + 1);
  rig.manager.loop();
  expect(rig.manager.is_busy(), "WAITING_GAPS survives the BLASTING silence timeout");

  test::advance_mock_time_ms(ESPNOW_WAITING_GAPS_TIMEOUT_MS - ESPNOW_RADIO_SILENCE_ABORT_MS);
  rig.manager.loop();

  expect(!rig.manager.is_busy(), "manager aborted on radio silence");
  expect(rig.manager.last_error() == "radio silence from remote", "radio silence error");
}

void test_accept_negotiation_uses_remote_buffer_kb() {
  test::reset_mock_state();

  TestRig rig;
  expect(rig.manager.start_transfer(rig.leaf_mac.data(), 884, rig.md5.data(), ESPNOW_FILE_ACTION_OTA_FLASH, 250),
         "transfer starts");
  const uint32_t announce_tx = rig.sends.front().tx_counter;

  rig.send_accept(announce_tx, 221, 8);

  expect(rig.manager.buffer_size_kb() == 8, "buffer_size_kb = 8 from remote");
  expect(rig.manager.increment_tracker().chunks_per_increment == 37, "37 chunks per increment");
}

void test_stale_gaps_ack_ignored() {
  test::reset_mock_state();

  TestRig rig;
  expect(rig.manager.start_transfer(rig.leaf_mac.data(), 884, rig.md5.data(), ESPNOW_FILE_ACTION_OTA_FLASH, 250),
         "transfer starts");
  const uint32_t announce_tx = rig.sends.front().tx_counter;
  rig.send_accept(announce_tx, 221, 8);

  for (uint32_t seq = 0; seq < 4; ++seq) {
    rig.feed_chunk(seq, static_cast<uint8_t>(seq * 10), 221);
  }

  auto *bc = rig.require_last_bc("BLAST_COMPLETE sent");
  const uint32_t bc_tx = bc->tx_counter;

  espnow_ack_t stale_ack{};
  stale_ack.ack_type = PKT_FILE_TRANSFER;
  stale_ack.result = ESPNOW_FILE_ACK_GAPS;
  stale_ack.ref_tx_counter = bc_tx - 100;
  uint8_t trailing[2] = {0, 0};
  rig.manager.on_file_ack(rig.leaf_mac.data(), stale_ack, trailing, sizeof(trailing));

  expect(rig.manager.increment_tracker().current_increment == 0, "stale GAPS ignored, increment still 0");

  rig.send_gaps_empty(bc_tx);
  expect(rig.manager.increment_tracker().is_last_increment(), "increment advanced with valid GAPS");
}

void test_last_increment_partial() {
  test::reset_mock_state();

  TestRig rig;
  uint32_t file_size = 8177 + 59;
  expect(rig.manager.start_transfer(rig.leaf_mac.data(), file_size, rig.md5.data(),
                                    ESPNOW_FILE_ACTION_OTA_FLASH, 250),
         "transfer starts");
  const uint32_t announce_tx = rig.sends.front().tx_counter;
  rig.send_accept(announce_tx, 221, 8);

  expect(rig.manager.total_increments() == 2, "2 increments");
  expect(rig.manager.increment_tracker().chunks_in_last_increment == 1, "last has 1 chunk");

  for (uint32_t seq = 0; seq < 37; ++seq) {
    rig.feed_chunk(seq, 0xAA, 221);
  }

  auto *bc = rig.require_last_bc("BLAST_COMPLETE sent");
  const uint32_t bc_tx0 = bc->tx_counter;
  rig.send_gaps_empty(bc_tx0);

  expect(rig.manager.increment_tracker().current_increment == 1, "advanced to increment 1");

  rig.feed_chunk(37, 0xBB, 59);

  bc = rig.require_last_bc("BLAST_COMPLETE re-sent");
  expect(bc != nullptr, "BLAST_COMPLETE sent for last increment");

  /* The partial last increment ends with an all-received GAPS ack, which is what
   * triggers the END (bridge_ota_manager.cpp:696-715), after which only the
   * remote's COMPLETE ack clears the transfer (bridge_ota_manager.cpp:793-800).
   * The manager never reports itself idle on its own once the last increment has
   * been acked, so no loop() can finish the transfer. */
  rig.send_gaps_empty(bc->tx_counter);

  auto *end_rec = rig.require_last_end("END sent after partial last increment");
  expect(end_rec->payload.size() == 1, "END is 1 byte");
  expect(end_rec->payload[0] == ESPNOW_FILE_PHASE_END, "phase is END");

  rig.send_complete(end_rec->tx_counter);
  expect(!rig.manager.is_busy(), "manager complete after partial last increment");
}

void test_global_timeout() {
  test::reset_mock_state();

  ESPNowOTAManager::Config cfg;
  cfg.global_timeout_ms = 1000;
  TestRig rig(cfg);

  expect(rig.manager.start_transfer(rig.leaf_mac.data(), 884, rig.md5.data(), ESPNOW_FILE_ACTION_OTA_FLASH, 250),
         "transfer starts");
  const uint32_t announce_tx = rig.sends.front().tx_counter;
  rig.send_accept(announce_tx, 221, 8);

  test::advance_mock_time_ms(1000);
  rig.manager.loop();
  expect(rig.manager.is_busy(), "not aborted just before the deadline");
  expect(rig.manager.last_error().empty(), "no error just before the deadline");

  /* loop() aborts only once the start has aged *past* the limit:
   * `(now - transfer_started_ms_) > config_.global_timeout_ms`
   * (bridge_ota_manager.cpp:265). */
  test::advance_mock_time_ms(6000);
  rig.manager.loop();

  expect(!rig.manager.is_busy(), "manager aborted on global timeout");
  expect(rig.manager.last_error() == "transfer global timeout", "global timeout error");
}

void test_accept_rejects_action_mismatch() {
  test::reset_mock_state();

  TestRig rig;
  expect(rig.manager.start_transfer(rig.leaf_mac.data(), 884, rig.md5.data(), ESPNOW_FILE_ACTION_OTA_FLASH, 250),
         "transfer starts");
  const uint32_t announce_tx = rig.sends.front().tx_counter;

  uint8_t trailing[4] = {221, 0, 8, ESPNOW_FILE_ACTION_EXECUTE};
  espnow_ack_t ack = rig.make_ack(ESPNOW_FILE_ACK_ACCEPT, announce_tx);
  rig.manager.on_file_ack(rig.leaf_mac.data(), ack, trailing, sizeof(trailing));

  expect(!rig.manager.is_busy(), "manager rejected due to action mismatch");
  expect(rig.manager.last_error() == "accept ack action mismatch", "action mismatch error");
}

void test_accept_rejects_zero_buffer_kb() {
  test::reset_mock_state();

  TestRig rig;
  expect(rig.manager.start_transfer(rig.leaf_mac.data(), 884, rig.md5.data(), ESPNOW_FILE_ACTION_OTA_FLASH, 250),
         "transfer starts");
  const uint32_t announce_tx = rig.sends.front().tx_counter;

  uint8_t trailing[4] = {221, 0, 0, ESPNOW_FILE_ACTION_OTA_FLASH};
  espnow_ack_t ack = rig.make_ack(ESPNOW_FILE_ACK_ACCEPT, announce_tx);
  rig.manager.on_file_ack(rig.leaf_mac.data(), ack, trailing, sizeof(trailing));

  expect(!rig.manager.is_busy(), "manager rejected due to zero buffer_size_kb");
  expect(rig.manager.last_error() == "remote buffer_size_kb is 0", "zero buffer error");
}

void test_status_json_format() {
  test::reset_mock_state();

  TestRig rig;
  expect(rig.manager.start_transfer(rig.leaf_mac.data(), 884, rig.md5.data(), ESPNOW_FILE_ACTION_OTA_FLASH, 250),
         "transfer starts");
  const uint32_t announce_tx = rig.sends.front().tx_counter;
  rig.send_accept(announce_tx, 221, 8);

  std::string json = rig.manager.status_json();
  expect(json.find("\"current_increment\":0") != std::string::npos, "status has current_increment");
  expect(json.find("\"total_increments\":1") != std::string::npos, "status has total_increments");
  expect(json.find("\"retransmit_round\":0") != std::string::npos, "status has retransmit_round");
  expect(json.find("\"buffer_size_kb\":8") != std::string::npos, "status has buffer_size_kb");
  expect(json.find("\"requested\":[") != std::string::npos, "status has requested array");
}

}  // namespace

int main() {
  test_file_size_over_1gb_rejected();
  test_increment_geometry_single_increment();
  test_increment_geometry_partial_last();
  test_increment_geometry_multi_increment();
  test_blast_complete_then_gaps_empty_single_increment();
  test_blast_complete_then_gaps_empty_multi_increment();
  test_blast_complete_then_gaps_with_missing_chunks();
  test_blast_complete_timeout_retry();
  test_retransmit_rounds_exceeded();
  test_radio_silence_abort();
  test_accept_negotiation_uses_remote_buffer_kb();
  test_stale_gaps_ack_ignored();
  test_last_increment_partial();
  test_global_timeout();
  test_accept_rejects_action_mismatch();
  test_accept_rejects_zero_buffer_kb();
  test_status_json_format();

  if (g_failures != 0) {
    std::cerr << g_failures << " bridge_ota_manager test(s) failed\n";
    return 1;
  }

  std::cout << "bridge_ota_manager tests passed\n";
  return 0;
}
