#include "../components/esp_tree_remote/remote_file_receiver.h"
#include "mocks/test_time.h"

#include <algorithm>
#include <array>
#include <cstdint>
#include <cstring>
#include <iostream>
#include <map>
#include <set>
#include <string>
#include <vector>

using namespace esphome::esp_tree;

namespace {

int g_failures = 0;

void expect(bool condition, const char *message) {
  if (!condition) {
    std::cerr << "FAIL: " << message << '\n';
    ++g_failures;
  }
}

struct AckRecord {
  espnow_ack_t header{};
  std::vector<uint8_t> trailing;
};

AckRecord decode_ack(const std::vector<uint8_t> &payload) {
  AckRecord ack{};
  if (payload.size() >= sizeof(espnow_ack_t)) {
    std::memcpy(&ack.header, payload.data(), sizeof(ack.header));
    ack.trailing.assign(payload.begin() + static_cast<std::ptrdiff_t>(sizeof(ack.header)), payload.end());
  }
  return ack;
}

// GAPS ACKs carry a 2-byte little-endian bitmap length followed by the bitmap itself
// (remote_file_receiver.cpp:561-569).
uint16_t ack_bitmap_len(const AckRecord &ack) {
  uint16_t len = 0;
  if (ack.trailing.size() >= sizeof(len)) {
    std::memcpy(&len, ack.trailing.data(), sizeof(len));
  }
  return len;
}

const uint8_t *ack_bitmap(const AckRecord &ack) {
  return ack.trailing.data() + 2;
}

struct MockFlashHandler : public FileReceiver::ActionHandler {
  FileReceiver::AnnounceResponse announce_response{};
  uint8_t end_result{ESPNOW_FILE_COMPLETE_SUCCESS};
  bool restart_after_complete{false};
  bool receiving{false};
  uint8_t last_abort_reason{0xFF};
  std::vector<uint32_t> delivered_sequences;
  std::vector<uint8_t> delivered_bytes;
  std::map<uint32_t, std::vector<uint8_t>> delivered_by_sequence;
  int fail_after_n_calls{0};
  int fail_only_call{0};
  int call_count{0};

  FileReceiver::AnnounceResponse on_announce(uint32_t file_size, const uint8_t[16], uint16_t chunk_size,
                                            uint8_t action, const char *file_id,
                                            uint16_t &buffer_size_kb) override {
    (void) file_size;
    (void) chunk_size;
    (void) action;
    (void) file_id;
    receiving = announce_response.accepted;
    buffer_size_kb = 8;
    return announce_response;
  }

  FileReceiver::ChunkResponse on_data(uint32_t sequence, const uint8_t *data, size_t len) override {
    ++call_count;
    delivered_sequences.push_back(sequence);
    delivered_bytes.insert(delivered_bytes.end(), data, data + static_cast<std::ptrdiff_t>(len));
    delivered_by_sequence[sequence] = std::vector<uint8_t>(data, data + static_cast<std::ptrdiff_t>(len));
    if ((fail_after_n_calls > 0 && call_count >= fail_after_n_calls) ||
        (fail_only_call > 0 && call_count == fail_only_call)) {
      FileReceiver::ChunkResponse resp{};
      resp.accepted = false;
      resp.abort_reason = ESPNOW_FILE_ABORT_FLASH_ERROR;
      return resp;
    }
    return {};
  }

  uint8_t on_end() override {
    receiving = false;
    return end_result;
  }

  void on_abort(uint8_t reason) override {
    receiving = false;
    last_abort_reason = reason;
  }

  bool is_receiving() const override { return receiving; }
  bool wants_restart_after_complete() const override { return restart_after_complete; }
};

// True when the handler was handed exactly `count` distinct chunks starting at `first`
// (used instead of a positional check because FileReceiver::write_increment_to_flash_ walks a
// whole increment before invoking the handler at all).
bool delivered_chunks_exact(const MockFlashHandler &handler, uint32_t first, uint32_t count) {
  if (handler.delivered_sequences.size() != count) {
    return false;
  }
  std::set<uint32_t> unique(handler.delivered_sequences.begin(), handler.delivered_sequences.end());
  if (unique.size() != count) {
    return false;
  }
  for (uint32_t i = 0; i < count; ++i) {
    if (unique.count(first + i) == 0) {
      return false;
    }
  }
  return true;
}

bool delivered_slice_all(const MockFlashHandler &handler, uint32_t sequence, uint8_t value) {
  auto it = handler.delivered_by_sequence.find(sequence);
  if (it == handler.delivered_by_sequence.end() || it->second.empty()) {
    return false;
  }
  return std::all_of(it->second.begin(), it->second.end(),
                     [value](uint8_t byte) { return byte == value; });
}

struct TestRig {
  std::vector<std::vector<uint8_t>> acks;
  MockFlashHandler handler;
  FileReceiver receiver;
  uint32_t file_size{0};
  uint16_t chunk_size{0};

  TestRig() {
    receiver.set_ota_enabled(true);
    receiver.set_announce_tx_counter(0xAABBCCDDu);
    receiver.register_handler(ESPNOW_FILE_ACTION_OTA_FLASH, &handler);
    receiver.set_send_ack_fn([this](const uint8_t *payload, size_t len) {
      acks.emplace_back(payload, payload + static_cast<std::ptrdiff_t>(len));
      return true;
    });
  }

  void reset() {
    acks.clear();
    handler.delivered_sequences.clear();
    handler.delivered_bytes.clear();
    handler.delivered_by_sequence.clear();
    handler.call_count = 0;
    handler.fail_after_n_calls = 0;
    handler.fail_only_call = 0;
  }

  AckRecord last_ack() const { return decode_ack(acks.back()); }

  void announce_with_accept(uint32_t announce_file_size, uint16_t announce_chunk_size = 221,
                            uint8_t action = ESPNOW_FILE_ACTION_OTA_FLASH) {
    file_size = announce_file_size;
    chunk_size = announce_chunk_size;
    handler.announce_response.accepted = true;
    handler.announce_response.negotiated_chunk_size = announce_chunk_size;

    std::vector<uint8_t> announce_payload(sizeof(espnow_file_announce_t), 0);
    auto *announce = reinterpret_cast<espnow_file_announce_t *>(announce_payload.data());
    announce->phase = ESPNOW_FILE_PHASE_ANNOUNCE;
    announce->file_size = announce_file_size;
    announce->chunk_size = announce_chunk_size;
    announce->action = action;
    const char *file_id_str = "ota_fw";
    std::memcpy(announce->file_id, file_id_str, std::strlen(file_id_str));

    expect(receiver.handle_file_transfer(announce_payload.data(), announce_payload.size()), "announce handled");
  }

  // On-the-wire length FileReceiver expects for this sequence (remote_file_receiver.cpp:609-619).
  size_t expected_chunk_len(uint32_t sequence) const {
    const uint64_t offset = static_cast<uint64_t>(sequence) * chunk_size;
    if (chunk_size == 0 || offset >= file_size) {
      return 0;
    }
    const uint64_t remaining = static_cast<uint64_t>(file_size) - offset;
    return static_cast<size_t>(std::min<uint64_t>(remaining, chunk_size));
  }

  void send_data(uint32_t sequence, uint8_t base, size_t len) {
    std::vector<uint8_t> payload(sizeof(espnow_file_data_header_t) + len, 0);
    auto *header = reinterpret_cast<espnow_file_data_header_t *>(payload.data());
    header->sequence = sequence;
    std::fill(payload.begin() + sizeof(*header), payload.end(), base);
    receiver.handle_file_data(payload.data(), payload.size());
  }

  // Sends FILE_DATA for `sequence` padded to the exact length the receiver insists on, so every
  // chunk is accepted unless the test deliberately wants a length mismatch.
  void send_chunk(uint32_t sequence, uint8_t base) {
    send_data(sequence, base, expected_chunk_len(sequence));
  }

  void send_blast_complete(uint16_t increment_index) {
    espnow_file_blast_complete_t bc{};
    bc.phase = ESPNOW_FILE_PHASE_BLAST_COMPLETE;
    bc.increment_index = increment_index;
    std::vector<uint8_t> payload(reinterpret_cast<uint8_t *>(&bc),
                                  reinterpret_cast<uint8_t *>(&bc) + sizeof(bc));
    receiver.handle_file_transfer(payload.data(), payload.size());
  }

  void send_end() {
    espnow_file_end_t end_pkt{};
    end_pkt.phase = ESPNOW_FILE_PHASE_END;
    std::vector<uint8_t> payload(reinterpret_cast<uint8_t *>(&end_pkt),
                                  reinterpret_cast<uint8_t *>(&end_pkt) + sizeof(end_pkt));
    receiver.handle_file_transfer(payload.data(), payload.size());
  }

  size_t count_acks_with_result(uint8_t result) const {
    size_t n = 0;
    for (const auto &a : acks) {
      AckRecord r = decode_ack(a);
      if (r.header.result == result) {
        ++n;
      }
    }
    return n;
  }
};

// After an accepted announce the receiver is in RECEIVING (remote_file_receiver.cpp:217-230).
// With buffer_size_kb = 8 the mock negotiates 8 KB increments, so chunks_per_increment_ is
// 8192 / 221 = 37 (line 582-587).
void test_announce_accept_with_buffer_kb() {
  test::reset_mock_state();

  TestRig rig;
  rig.announce_with_accept(884, 221);

  expect(rig.acks.size() == 1, "accept ACK sent");
  AckRecord ack = rig.last_ack();
  expect(ack.header.ack_type == PKT_FILE_TRANSFER, "ack_type is file transfer");
  expect(ack.header.result == ESPNOW_FILE_ACK_ACCEPT, "result is ACCEPT");
  expect(ack.trailing.size() == 4, "accept trailing is 4 bytes");

  uint16_t negotiated_chunk = 0;
  std::memcpy(&negotiated_chunk, ack.trailing.data(), sizeof(negotiated_chunk));
  expect(negotiated_chunk == 221, "negotiated chunk is 221");
  expect(ack.trailing[2] > 0, "buffer_size_kb echoed in accept");
  expect(ack.trailing[3] == ESPNOW_FILE_ACTION_OTA_FLASH, "action echoed");
}

void test_blast_then_increment_complete() {
  test::reset_mock_state();

  TestRig rig;
  rig.announce_with_accept(884, 221);

  expect(rig.acks.size() == 1, "accept ACK sent");

  for (uint32_t seq = 0; seq < 4; ++seq) {
    rig.send_chunk(seq, static_cast<uint8_t>(seq * 10));
  }

  // handle_file_data() only buffers into increment_buf_ (remote_file_receiver.cpp:370-379); the
  // ActionHandler flash-write callback is not reached until the increment is flushed.
  expect(rig.acks.size() == 1, "no ACK during blast");
  expect(rig.handler.delivered_sequences.empty(), "no flash write before BLAST_COMPLETE");

  rig.send_blast_complete(0);

  // A complete increment produces exactly ONE all-clear GAPS ACK, sent by
  // write_increment_to_flash_() after the commit (remote_file_receiver.cpp:450-452).
  // It must not be sent before the write: an empty-bitmap GAPS ACK means
  // INCREMENT_COMPLETE, and the bridge advances on the first one, so an early ack
  // makes it blast the next increment into a node that is still WRITING.
  expect(rig.acks.size() == 2, "one GAPS ACK after BLAST_COMPLETE of a complete increment");
  expect(rig.count_acks_with_result(ESPNOW_FILE_ACK_GAPS) == 1, "the single post-blast ACK is GAPS");
  AckRecord gaps_ack = rig.last_ack();
  expect(gaps_ack.header.result == ESPNOW_FILE_ACK_GAPS, "result is GAPS");
  expect(ack_bitmap_len(gaps_ack) == 0, "empty bitmap = increment complete");

  expect(delivered_chunks_exact(rig.handler, 0, 4), "all four chunks written to flash once");
  expect(rig.handler.delivered_bytes.size() == 884, "wrote exactly file_size bytes");

  // The final increment leaves the receiver in WAITING_END (line 450-452), so a repeated
  // BLAST_COMPLETE is refused (line 237-241) and must not write the increment a second time.
  rig.send_blast_complete(0);
  expect(rig.acks.size() == 2, "duplicate BLAST_COMPLETE in WAITING_END is ignored");
  expect(rig.handler.delivered_bytes.size() == 884, "no second flash write");

  rig.send_end();
  expect(rig.acks.size() == 3, "COMPLETE ACK sent after END");
  AckRecord complete_ack = rig.last_ack();
  expect(complete_ack.header.result == ESPNOW_FILE_ACK_COMPLETE, "result is COMPLETE");
  expect(complete_ack.trailing[0] == ESPNOW_FILE_ACTION_OTA_FLASH, "action echoed");
  expect(complete_ack.trailing[1] == ESPNOW_FILE_COMPLETE_SUCCESS, "result is SUCCESS");
  expect(!rig.receiver.is_receiving(), "receiver idle after END");
}

void test_gaps_retransmit_then_complete() {
  test::reset_mock_state();

  TestRig rig;
  // 8236 bytes = 38 chunks of 221 bytes: increment 0 holds chunks 0..36, increment 1 holds chunk 37.
  rig.announce_with_accept(8236, 221);

  expect(rig.acks.size() == 1, "accept ACK sent");

  for (uint32_t seq = 0; seq < 36; ++seq) {
    rig.send_chunk(seq, static_cast<uint8_t>(seq * 10));
  }

  expect(rig.acks.size() == 1, "no ACK during partial blast");

  rig.send_blast_complete(0);

  // An incomplete increment gets exactly one GAPS ACK carrying the received bitmap
  // (remote_file_receiver.cpp:277-281), sized (37 + 7) / 8 = 5 bytes (line 36-37).
  expect(rig.acks.size() == 2, "one GAPS ACK for a partial increment");
  AckRecord gaps_ack = rig.last_ack();
  expect(gaps_ack.header.result == ESPNOW_FILE_ACK_GAPS, "result is GAPS");
  expect(ack_bitmap_len(gaps_ack) == 5, "bitmap present for missing chunk");
  expect(gaps_ack.trailing.size() == 7, "GAPS trailing is 2-byte length + 5-byte bitmap");

  const uint8_t *bitmap = ack_bitmap(gaps_ack);
  expect(bitmap[0] == 0xFF && bitmap[1] == 0xFF && bitmap[2] == 0xFF && bitmap[3] == 0xFF,
         "chunks 0..31 marked received");
  expect(bitmap[4] == 0x0F, "bit 36 is 0 (chunk 36 missing in bitmap)");

  rig.send_chunk(36, 0xBB);

  rig.send_blast_complete(0);

  // Now complete: exactly one GAPS ACK, sent after the write (line 455, since a second
  // increment still exists). No ack precedes the write.
  expect(rig.acks.size() == 3, "one GAPS ACK once the increment is complete");
  AckRecord gaps_ack2 = rig.last_ack();
  expect(gaps_ack2.header.result == ESPNOW_FILE_ACK_GAPS, "result is GAPS");
  expect(ack_bitmap_len(gaps_ack2) == 0, "empty bitmap after retransmit = all chunks received");

  expect(delivered_chunks_exact(rig.handler, 0, 37), "all 37 chunks of increment 0 written once");
  expect(rig.handler.delivered_bytes.size() == 8177, "increment 0 write is 37 * 221 bytes");
}

void test_blast_complete_future_increment_ignored() {
  test::reset_mock_state();

  TestRig rig;
  rig.announce_with_accept(884, 221);

  for (uint32_t seq = 0; seq < 4; ++seq) {
    rig.send_chunk(seq, static_cast<uint8_t>(seq * 10));
  }

  // A BLAST_COMPLETE for an increment that has not been reached yet is refused outright
  // (remote_file_receiver.cpp:251-253): no ACK and no state change.
  rig.send_blast_complete(1);
  expect(rig.acks.size() == 1, "future increment index produces no ACK");
  expect(rig.receiver.is_receiving(), "receiver still active after ignored BLAST_COMPLETE");

  // The receiver is still in RECEIVING, not WAITING_END, so END is refused too (line 288-291).
  rig.send_end();
  expect(rig.acks.size() == 1, "END before the last increment is ignored");

  // The real increment 0 then completes normally.
  rig.send_blast_complete(0);
  expect(rig.acks.size() == 2, "increment 0 completes after the stray index");
  expect(ack_bitmap_len(rig.last_ack()) == 0, "increment 0 complete (empty bitmap)");
  expect(delivered_chunks_exact(rig.handler, 0, 4), "chunks written once after the stray index");
}

void test_blast_complete_stale_increment_index_reacked() {
  test::reset_mock_state();

  TestRig rig;
  rig.announce_with_accept(8236, 221);

  for (uint32_t seq = 0; seq < 37; ++seq) {
    rig.send_chunk(seq, static_cast<uint8_t>(seq * 10));
  }

  rig.send_blast_complete(0);
  expect(rig.acks.size() == 2, "increment 0 complete, one GAPS after the write");

  // current_increment_ is now 1, so a stale BLAST_COMPLETE for increment 0 is answered with an
  // all-clear GAPS ACK so the sender can move on (remote_file_receiver.cpp:249-250).
  rig.send_blast_complete(0);
  expect(rig.acks.size() == 3, "stale increment index answered with a GAPS ACK");
  AckRecord stale_ack = rig.last_ack();
  expect(stale_ack.header.result == ESPNOW_FILE_ACK_GAPS, "result is GAPS");
  expect(ack_bitmap_len(stale_ack) == 0, "empty bitmap = current increment complete, re-sent all-clear");
  expect(delivered_chunks_exact(rig.handler, 0, 37), "stale index does not re-write increment 0");
}

void test_last_increment_end_flow() {
  test::reset_mock_state();

  TestRig rig;
  uint32_t file_size = 8236;
  rig.announce_with_accept(file_size, 221);

  expect(rig.acks.size() == 1, "accept ACK sent");

  for (uint32_t seq = 0; seq < 37; ++seq) {
    rig.send_chunk(seq, static_cast<uint8_t>(seq * 10));
  }

  rig.send_blast_complete(0);

  expect(rig.acks.size() == 2, "GAPS ACK sent for increment 0 (after the write)");
  AckRecord gaps_ack0 = rig.last_ack();
  expect(gaps_ack0.header.result == ESPNOW_FILE_ACK_GAPS, "result is GAPS");
  expect(ack_bitmap_len(gaps_ack0) == 0, "increment 0 complete (empty bitmap)");
  expect(rig.handler.delivered_bytes.size() == 8177, "increment 0 data written to flash");

  rig.send_chunk(37, 0xCC);

  rig.send_blast_complete(1);

  // Last increment: the post-write all-clear GAPS ACK (line 450-452) moves the receiver to
  // WAITING_END. Still exactly one ack for this increment.
  expect(rig.acks.size() == 3, "GAPS ACK sent for last increment (after the write)");
  AckRecord gaps_ack1 = rig.last_ack();
  expect(gaps_ack1.header.result == ESPNOW_FILE_ACK_GAPS, "result is GAPS");
  expect(ack_bitmap_len(gaps_ack1) == 0, "last increment complete (empty bitmap)");

  expect(delivered_chunks_exact(rig.handler, 0, 38), "all 38 chunks written once");
  expect(rig.handler.delivered_bytes.size() == file_size, "whole file written exactly once");
  expect(rig.handler.delivered_by_sequence.count(37) == 1 &&
             rig.handler.delivered_by_sequence.at(37).size() == 59,
         "final chunk written with its short length");

  rig.send_end();

  expect(rig.acks.size() == 4, "COMPLETE ACK sent after END");
  AckRecord complete_ack = rig.last_ack();
  expect(complete_ack.header.result == ESPNOW_FILE_ACK_COMPLETE, "result is COMPLETE");
  expect(complete_ack.trailing[0] == ESPNOW_FILE_ACTION_OTA_FLASH, "action echoed");
  expect(complete_ack.trailing[1] == ESPNOW_FILE_COMPLETE_SUCCESS, "result is SUCCESS");
  expect(!rig.receiver.is_receiving(), "receiver idle after END");
}

void test_flash_write_failure_retry_abort() {
  test::reset_mock_state();

  TestRig rig;
  rig.handler.fail_after_n_calls = 1;

  rig.announce_with_accept(884, 221);

  for (uint32_t seq = 0; seq < 4; ++seq) {
    rig.send_chunk(seq, static_cast<uint8_t>(seq * 10));
  }

  rig.send_blast_complete(0);

  // All-clear GAPS ACK before the write (line 258-262), then the one-shot retry (line 417-443)
  // fails as well and FileReceiver aborts with FLASH_ERROR (line 435-439).
  expect(rig.acks.size() == 2, "abort ACK after write failure + retry failure, no early GAPS");
  expect(rig.count_acks_with_result(ESPNOW_FILE_ACK_ABORT) == 1, "exactly one abort ACK");
  AckRecord abort_ack = rig.last_ack();
  expect(abort_ack.header.result == ESPNOW_FILE_ACK_ABORT, "result is ABORT");
  expect(abort_ack.trailing[0] == ESPNOW_FILE_ABORT_FLASH_ERROR, "abort reason is FLASH_ERROR");
  expect(rig.handler.last_abort_reason == ESPNOW_FILE_ABORT_FLASH_ERROR, "handler told FLASH_ERROR");
  expect(rig.handler.call_count == 2, "one write attempt plus one retry attempt");
  expect(!rig.handler.receiving, "handler notified of abort");
  expect(!rig.receiver.is_receiving(), "receiver reset after abort");
}

void test_flash_write_retry_recovers() {
  test::reset_mock_state();

  TestRig rig;
  rig.handler.fail_only_call = 1;  // first attempt fails, the whole-increment retry succeeds

  rig.announce_with_accept(884, 221);

  for (uint32_t seq = 0; seq < 4; ++seq) {
    rig.send_chunk(seq, static_cast<uint8_t>(seq * 10));
  }

  rig.send_blast_complete(0);

  // write_increment_to_flash_() retries the entire increment (line 417-443) and then continues;
  // the last increment finishes in WAITING_END with an all-clear GAPS ACK (line 450-452).
  expect(rig.acks.size() == 2, "one GAPS ACK after the successful retry");
  expect(rig.count_acks_with_result(ESPNOW_FILE_ACK_ABORT) == 0, "no abort when the retry succeeds");
  expect(ack_bitmap_len(rig.last_ack()) == 0, "increment complete after retry");
  expect(rig.handler.call_count == 5, "1 failed attempt + 4 retried chunks");
  expect(rig.handler.delivered_sequences == std::vector<uint32_t>({0, 0, 1, 2, 3}),
         "failed chunk and the retried chunks all reached the handler");

  rig.send_end();
  AckRecord complete_ack = rig.last_ack();
  expect(complete_ack.header.result == ESPNOW_FILE_ACK_COMPLETE, "END accepted after recovery");
}

void test_radio_silence_abort() {
  test::reset_mock_state();

  TestRig rig;
  rig.announce_with_accept(884, 221);

  rig.send_chunk(0, 0xAA);

  expect(rig.acks.size() == 1, "accept ACK sent before radio silence");

  test::advance_mock_time_ms(ESPNOW_RADIO_SILENCE_ABORT_MS + 1);
  rig.receiver.loop();

  expect(rig.acks.size() == 2, "abort ACK sent after radio silence timeout");
  AckRecord abort_ack = rig.last_ack();
  expect(abort_ack.header.result == ESPNOW_FILE_ACK_ABORT, "result is ABORT");
  expect(abort_ack.trailing[0] == ESPNOW_FILE_ABORT_TIMEOUT, "reason is TIMEOUT");
}

void test_duplicate_chunk_ignored() {
  test::reset_mock_state();

  TestRig rig;
  rig.announce_with_accept(884, 221);

  rig.send_chunk(0, 0xAA);
  expect(rig.acks.size() == 1, "accept ACK only");
  // Duplicates are suppressed inside increment_buf_ (remote_file_receiver.cpp:370-372); nothing is
  // handed to the ActionHandler until the increment is written.
  expect(rig.handler.delivered_sequences.empty(), "no flash write during blast");

  rig.send_chunk(0, 0xBB);  // duplicate, must not overwrite the stored copy
  rig.send_chunk(1, 0xCC);
  rig.send_chunk(1, 0xDD);  // duplicate
  rig.send_chunk(2, 0xE1);
  rig.send_chunk(3, 0xF2);

  expect(rig.acks.size() == 1, "still no ACK before BLAST_COMPLETE");
  expect(rig.handler.delivered_sequences.empty(), "still no flash write before BLAST_COMPLETE");

  rig.send_blast_complete(0);

  expect(rig.acks.size() == 2, "increment complete after deduplication");
  AckRecord gaps_ack = rig.last_ack();
  expect(gaps_ack.header.result == ESPNOW_FILE_ACK_GAPS, "result is GAPS");
  expect(ack_bitmap_len(gaps_ack) == 0, "all chunks received (duplicates ignored)");

  expect(delivered_chunks_exact(rig.handler, 0, 4), "each chunk delivered to flash exactly once");
  expect(rig.handler.delivered_bytes.size() == 884, "only one copy of each chunk");

  // The first arriving copy is the one kept (line 370-372 returns before the memcpy at line 378).
  expect(delivered_slice_all(rig.handler, 0, 0xAA), "first copy of chunk 0 is the one written");
  expect(delivered_slice_all(rig.handler, 1, 0xCC), "first copy of chunk 1 is the one written");
  expect(delivered_slice_all(rig.handler, 2, 0xE1), "chunk 2 data written");
  expect(delivered_slice_all(rig.handler, 3, 0xF2), "chunk 3 data written");
}

void test_disabled_ota_reject() {
  test::reset_mock_state();

  TestRig rig;
  rig.receiver.set_ota_enabled(false);

  std::vector<uint8_t> announce_payload(sizeof(espnow_file_announce_t), 0);
  auto *announce = reinterpret_cast<espnow_file_announce_t *>(announce_payload.data());
  announce->phase = ESPNOW_FILE_PHASE_ANNOUNCE;
  announce->file_size = 884;
  announce->chunk_size = 221;
  announce->action = ESPNOW_FILE_ACTION_OTA_FLASH;

  expect(rig.receiver.handle_file_transfer(announce_payload.data(), announce_payload.size()),
         "announce handled (reject sent)");

  expect(rig.acks.size() == 1, "reject ACK sent");
  AckRecord reject_ack = rig.last_ack();
  expect(reject_ack.header.result == ESPNOW_FILE_ACK_REJECT, "result is REJECT");
  expect(reject_ack.trailing[0] == ESPNOW_FILE_ACTION_OTA_FLASH, "action echoed");
  expect(reject_ack.trailing[1] == ESPNOW_FILE_REJECT_UNSUPPORTED, "reason is UNSUPPORTED");
}

void test_file_size_over_1gb_rejected() {
  test::reset_mock_state();

  TestRig rig;
  rig.handler.announce_response.accepted = true;
  rig.handler.announce_response.negotiated_chunk_size = 221;

  std::vector<uint8_t> announce_payload(sizeof(espnow_file_announce_t), 0);
  auto *announce = reinterpret_cast<espnow_file_announce_t *>(announce_payload.data());
  announce->phase = ESPNOW_FILE_PHASE_ANNOUNCE;
  announce->file_size = 1073741825U;
  announce->chunk_size = 221;
  announce->action = ESPNOW_FILE_ACTION_OTA_FLASH;

  expect(rig.receiver.handle_file_transfer(announce_payload.data(), announce_payload.size()), "announce handled");

  expect(rig.acks.size() == 1, "reject ACK sent for >1GB file");
  AckRecord reject_ack = rig.last_ack();
  expect(reject_ack.header.result == ESPNOW_FILE_ACK_REJECT, "result is REJECT");
  expect(reject_ack.trailing[1] == ESPNOW_FILE_REJECT_NO_SPACE, "reason is NO_SPACE");
}

void test_announce_timeout() {
  test::reset_mock_state();

  TestRig rig;
  rig.announce_with_accept(884, 221);

  expect(rig.acks.size() == 1, "accept sent");
  expect(rig.receiver.is_receiving(), "receiver active after accept");

  // A successful announce leaves the receiver in RECEIVING, not ANNOUNCED
  // (remote_file_receiver.cpp:217-230), so the ANNOUNCED-only timeout at line 492-498 cannot fire
  // here; sender silence is caught by the radio-silence timeout used for every non-WAITING_END
  // state (line 512-516).
  test::set_mock_time_ms(ESPNOW_FILE_ANNOUNCE_TIMEOUT_MS + 1);
  rig.receiver.loop();
  expect(rig.acks.size() == 1, "no abort at ANNOUNCE_TIMEOUT_MS while in RECEIVING");

  test::set_mock_time_ms(ESPNOW_RADIO_SILENCE_ABORT_MS + 1);
  rig.receiver.loop();

  expect(rig.acks.size() == 2, "abort sent after radio silence timeout");
  AckRecord abort_ack = rig.last_ack();
  expect(abort_ack.header.result == ESPNOW_FILE_ACK_ABORT, "result is ABORT");
  expect(abort_ack.trailing[0] == ESPNOW_FILE_ABORT_TIMEOUT, "reason is TIMEOUT");
  expect(rig.handler.last_abort_reason == ESPNOW_FILE_ABORT_TIMEOUT, "handler told TIMEOUT");
  expect(!rig.receiver.is_receiving(), "receiver idle after timeout abort");
}

}  // namespace

int main() {
  test_announce_accept_with_buffer_kb();
  test_blast_then_increment_complete();
  test_gaps_retransmit_then_complete();
  test_blast_complete_future_increment_ignored();
  test_blast_complete_stale_increment_index_reacked();
  test_last_increment_end_flow();
  test_flash_write_failure_retry_abort();
  test_flash_write_retry_recovers();
  test_radio_silence_abort();
  test_duplicate_chunk_ignored();
  test_disabled_ota_reject();
  test_file_size_over_1gb_rejected();
  test_announce_timeout();

  if (g_failures != 0) {
    std::cerr << g_failures << " file_receiver test(s) failed\n";
    return 1;
  }

  std::cout << "file_receiver tests passed\n";
  return 0;
}
