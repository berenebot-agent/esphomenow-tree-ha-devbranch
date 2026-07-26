#include "remote_file_receiver.h"

#include "esphome/core/hal.h"
#include "esphome/core/log.h"

#include <algorithm>
#include <array>
#include <cstring>
#include <limits>
#include <utility>
#include <vector>

#if defined(ESP_PLATFORM)
#include <esp_err.h>
#include <esp_heap_caps.h>
#include <esp_ota_ops.h>
#include <esp_system.h>
#endif

namespace esphome {
namespace esp_tree {

namespace {

static const char *const TAG = "espnow.file";
static constexpr uint8_t kEspImageMagic = 0xE9;
static constexpr uint32_t kRestartDelayMs = 250;
static constexpr uint32_t kFileStreamInactivityTimeoutMs = 30000U;
static constexpr int8_t kCompleteAckRetries = 5;
static constexpr uint32_t kCompleteAckIntervalMs = 1000U;

}  // namespace

void IncrementBuffer::reset(uint16_t num_chunks, uint32_t data_size) {
  data.assign(data_size, 0);
  size_t bitmap_bytes = (static_cast<size_t>(num_chunks) + 7U) / 8U;
  received_bitmap.assign(bitmap_bytes, 0);
  chunks_received = 0;
  chunks_expected = num_chunks;
}

bool IncrementBuffer::is_chunk_received(uint16_t chunk_in_increment) const {
  if (received_bitmap.empty()) return false;
  size_t byte_idx = static_cast<size_t>(chunk_in_increment) / 8U;
  if (byte_idx >= received_bitmap.size()) return false;
  uint8_t bit_mask = static_cast<uint8_t>(1U << (chunk_in_increment % 8U));
  return (received_bitmap[byte_idx] & bit_mask) != 0;
}

void IncrementBuffer::mark_chunk_received(uint16_t chunk_in_increment) {
  size_t byte_idx = static_cast<size_t>(chunk_in_increment) / 8U;
  uint8_t bit_mask = static_cast<uint8_t>(1U << (chunk_in_increment % 8U));
  if (byte_idx < received_bitmap.size() && !(received_bitmap[byte_idx] & bit_mask)) {
    received_bitmap[byte_idx] |= bit_mask;
    ++chunks_received;
  }
}

FileReceiver::FileReceiver() {
  this->register_handler(ESPNOW_FILE_ACTION_OTA_FLASH, &ota_flash_handler_);
}

void FileReceiver::set_local_mac(const uint8_t *mac) {
  if (mac == nullptr) {
    return;
  }
  std::copy_n(mac, local_mac_.size(), local_mac_.begin());
}

void FileReceiver::set_max_chunk_size(uint16_t max_chunk) {
  max_chunk_size_ = max_chunk;
  ota_flash_handler_.set_max_chunk_size(max_chunk);
}

void FileReceiver::register_handler(uint8_t action, ActionHandler *handler) {
  if (handler == nullptr) {
    handlers_.erase(action);
    return;
  }
  handlers_[action] = handler;
}

bool FileReceiver::handle_file_transfer(const uint8_t *payload, size_t len) {
  if (payload == nullptr || len < 1) {
    return false;
  }

  last_activity_ms_ = millis();
  switch (payload[0]) {
    case ESPNOW_FILE_PHASE_ANNOUNCE:
      if (len != sizeof(espnow_file_announce_t)) {
        ESP_LOGW(TAG, "Rejecting FILE_TRANSFER ANNOUNCE with invalid length=%u",
                 static_cast<unsigned>(len));
        return false;
      }
      return this->handle_announce_(*reinterpret_cast<const espnow_file_announce_t *>(payload));

    case ESPNOW_FILE_PHASE_END:
      if (len != sizeof(espnow_file_end_t)) {
        ESP_LOGW(TAG, "Rejecting FILE_TRANSFER END with invalid length=%u",
                 static_cast<unsigned>(len));
        return false;
      }
      return this->handle_end_(*reinterpret_cast<const espnow_file_end_t *>(payload));

    case ESPNOW_FILE_PHASE_ABORT:
      if (len != sizeof(espnow_file_abort_t)) {
        ESP_LOGW(TAG, "Rejecting FILE_TRANSFER ABORT with invalid length=%u",
                 static_cast<unsigned>(len));
        return false;
      }
      return this->handle_abort_(*reinterpret_cast<const espnow_file_abort_t *>(payload));

    case ESPNOW_FILE_PHASE_BLAST_COMPLETE:
      if (len != sizeof(espnow_file_blast_complete_t)) {
        ESP_LOGW(TAG, "Rejecting BLAST_COMPLETE with invalid length=%u",
                 static_cast<unsigned>(len));
        return false;
      }
      return this->handle_blast_complete_(*reinterpret_cast<const espnow_file_blast_complete_t *>(payload));

    default:
      ESP_LOGW(TAG, "Rejecting FILE_TRANSFER with unknown phase=0x%02X", payload[0]);
      return false;
  }
}

bool FileReceiver::handle_announce_(const espnow_file_announce_t &announce) {
  if (!ota_enabled_ && announce.action == ESPNOW_FILE_ACTION_OTA_FLASH) {
    ESP_LOGW(TAG, "Rejecting OTA ANNOUNCE because OTA-over-ESP-NOW is disabled");
    return this->send_ack_reject_(announce.action, ESPNOW_FILE_REJECT_UNSUPPORTED);
  }
  if (deep_sleep_active_) {
    ESP_LOGW(TAG, "Rejecting FILE_TRANSFER ANNOUNCE because deep sleep is active");
    return this->send_ack_reject_(announce.action, ESPNOW_FILE_REJECT_DEEP_SLEEP);
  }
  if (state_ != State::IDLE || (active_handler_ != nullptr && active_handler_->is_receiving())) {
    if (memcmp(file_id_, announce.file_id, sizeof(announce.file_id)) == 0 &&
        file_size_ == announce.file_size &&
        action_ == announce.action &&
        memcmp(last_announce_md5_, announce.md5, 16) == 0) {
      if (state_ == State::ANNOUNCED || state_ == State::RECEIVING) {
        ESP_LOGI(TAG, "Idempotent announce: re-sending accept for state=%d", static_cast<int>(state_));
        return this->send_ack_accept_(chunk_payload_size_, action_, buffer_size_kb_);
      }
      if (state_ == State::CHECKING || state_ == State::WRITING) {
        ESP_LOGI(TAG, "Idempotent announce: responding with status for state=%d", static_cast<int>(state_));
        return this->send_ack_accept_(chunk_payload_size_, action_, buffer_size_kb_);
      }
    }
    ESP_LOGW(TAG, "Rejecting FILE_TRANSFER ANNOUNCE because a transfer is already active");
    return this->send_ack_reject_(announce.action, ESPNOW_FILE_REJECT_ALREADY);
  }
  if (announce.file_size == 0 || announce.chunk_size == 0) {
    ESP_LOGW(TAG, "Rejecting FILE_TRANSFER ANNOUNCE with invalid parameters size=%u chunk=%u",
             static_cast<unsigned>(announce.file_size), static_cast<unsigned>(announce.chunk_size));
    return this->send_ack_reject_(announce.action, ESPNOW_FILE_REJECT_UNSUPPORTED);
  }
  if (announce.file_size > 1073741824U) {
    ESP_LOGW(TAG, "Rejecting FILE_TRANSFER ANNOUNCE with file_size > 1GB");
    return this->send_ack_reject_(announce.action, ESPNOW_FILE_REJECT_NO_SPACE);
  }

  auto handler_it = handlers_.find(announce.action);
  if (handler_it == handlers_.end() || handler_it->second == nullptr) {
    ESP_LOGW(TAG, "Rejecting FILE_TRANSFER ANNOUNCE for unsupported action=0x%02X", announce.action);
    return this->send_ack_reject_(announce.action, ESPNOW_FILE_REJECT_UNSUPPORTED);
  }

  char file_id[sizeof(announce.file_id) + 1] = {0};
  std::memcpy(file_id, announce.file_id, sizeof(announce.file_id));

  uint16_t remote_buffer_size_kb = ESPNOW_MAX_INCREMENT_KB;
  AnnounceResponse response = handler_it->second->on_announce(announce.file_size, announce.md5,
                                                               announce.chunk_size,
                                                               announce.action, file_id,
                                                               remote_buffer_size_kb);
  if (!response.accepted) {
    ESP_LOGW(TAG, "Rejecting FILE_TRANSFER ANNOUNCE for action=0x%02X reason=%u",
             announce.action, static_cast<unsigned>(response.reject_reason));
    return this->send_ack_reject_(announce.action, response.reject_reason);
  }

  if (response.negotiated_chunk_size == 0 ||
      response.negotiated_chunk_size > announce.chunk_size ||
      response.negotiated_chunk_size > max_chunk_size_) {
    ESP_LOGW(TAG, "Rejecting FILE_TRANSFER ANNOUNCE due to invalid negotiated chunk=%u",
             static_cast<unsigned>(response.negotiated_chunk_size));
    handler_it->second->on_abort(ESPNOW_FILE_ABORT_FLASH_ERROR);
    return this->send_ack_reject_(announce.action, ESPNOW_FILE_REJECT_UNSUPPORTED);
  }

  active_handler_ = handler_it->second;
  file_size_ = announce.file_size;
  chunk_payload_size_ = response.negotiated_chunk_size;
  action_ = announce.action;
  std::memcpy(file_id_, announce.file_id, sizeof(file_id_));
  std::memcpy(last_announce_md5_, announce.md5, 16);

  buffer_size_kb_ = remote_buffer_size_kb;
  compute_increment_geometry_();

  if (total_chunks_ == 0 || total_increments_ == 0 || chunks_per_increment_ == 0) {
    active_handler_->on_abort(ESPNOW_FILE_ABORT_FLASH_ERROR);
    this->reset_();
    return this->send_ack_reject_(announce.action, ESPNOW_FILE_REJECT_UNSUPPORTED);
  }

  current_increment_ = 0;
  retransmit_round_ = 0;
  increment_written_ = false;

  uint16_t first_inc_chunks = chunks_in_increment_(0);
  uint32_t increment_data_size = static_cast<uint32_t>(first_inc_chunks) * chunk_payload_size_;
  increment_buf_.reset(first_inc_chunks, increment_data_size);

  state_ = State::ANNOUNCED;
  ESP_LOGI(TAG, "OTA announce accepted: file_size=%u chunk=%u buf_kb=%u cpi=%u total_inc=%u total_chunks=%u",
           static_cast<unsigned>(file_size_), static_cast<unsigned>(chunk_payload_size_),
           static_cast<unsigned>(buffer_size_kb_), static_cast<unsigned>(chunks_per_increment_),
           static_cast<unsigned>(total_increments_), static_cast<unsigned>(total_chunks_));

  const bool ack_sent = this->send_ack_accept_(chunk_payload_size_, action_, buffer_size_kb_);
  if (!ack_sent) {
    active_handler_->on_abort(ESPNOW_FILE_ABORT_SEND_FAILURE);
    this->reset_();
    return false;
  }

  state_ = State::RECEIVING;
  ESP_LOGI(TAG, "Accepted FILE_TRANSFER action=0x%02X size=%u chunk=%u",
           static_cast<unsigned>(action_), static_cast<unsigned>(file_size_),
           static_cast<unsigned>(chunk_payload_size_));
  return true;
}

bool FileReceiver::handle_blast_complete_(const espnow_file_blast_complete_t &bc) {
  if (state_ != State::RECEIVING || active_handler_ == nullptr) {
    ESP_LOGW(TAG, "Ignoring BLAST_COMPLETE with no active receiving state");
    return false;
  }

  last_activity_ms_ = millis();

  if (bc.increment_index == current_increment_) {
    if (increment_written_) {
      return this->send_gaps_ack_(nullptr, 0);
    }
  } else if (bc.increment_index < current_increment_) {
    return this->send_gaps_ack_(nullptr, 0);
  } else {
    return false;
  }

  bool is_complete = increment_buf_.is_complete();
  bool has_gaps = !increment_buf_.is_complete();

  if (is_complete) {
    state_ = State::WRITING;
    if (!this->send_gaps_ack_(nullptr, 0)) {
      return false;
    }
    if (!write_increment_to_flash_()) {
      return false;
    }
    return true;
  }

  if (retransmit_round_ >= ESPNOW_MAX_RETRANSMIT_ROUNDS) {
    ESP_LOGW(TAG, "Max retransmit rounds (%u) exceeded for increment %u",
             static_cast<unsigned>(ESPNOW_MAX_RETRANSMIT_ROUNDS),
             static_cast<unsigned>(current_increment_));
    this->abort(ESPNOW_FILE_ABORT_TIMEOUT, true);
    return true;
  }

  ++retransmit_round_;
  bool ack_ok = send_gaps_ack_(increment_buf_.received_bitmap.data(),
                                increment_buf_.received_bitmap.size());
  state_ = State::RECEIVING;
  return ack_ok;
}

bool FileReceiver::handle_end_(const espnow_file_end_t &end_packet) {
  if (end_packet.phase != ESPNOW_FILE_PHASE_END) {
    return false;
  }
  if (state_ != State::WAITING_END || active_handler_ == nullptr) {
    ESP_LOGW(TAG, "Ignoring FILE_TRANSFER END with no active transfer in WAITING_END state");
    return false;
  }

  state_ = State::VERIFYING;
  const uint8_t current_action = action_;
  const uint8_t result = active_handler_->on_end();
  const bool should_restart = (result == ESPNOW_FILE_COMPLETE_SUCCESS) &&
                              active_handler_->wants_restart_after_complete();

  ESP_LOGI(TAG, "Completed FILE_TRANSFER action=0x%02X result=%u",
           static_cast<unsigned>(current_action), static_cast<unsigned>(result));

  if (should_restart) {
    complete_action_ = action_;
    complete_result_ = result;
    complete_ack_remaining_ = kCompleteAckRetries;
    next_complete_ack_ms_ = millis();
    in_complete_phase_ = true;
    return true;
  }

  const bool ack_sent = this->send_ack_complete_(action_, result);
  this->reset_();
  return ack_sent;
}

bool FileReceiver::handle_abort_(const espnow_file_abort_t &abort_packet) {
  if (abort_packet.phase != ESPNOW_FILE_PHASE_ABORT) {
    return false;
  }
  if (state_ == State::IDLE || active_handler_ == nullptr) {
    return true;
  }

  ESP_LOGW(TAG, "Peer aborted FILE_TRANSFER reason=%s", abort_reason_to_string(abort_packet.reason));
  active_handler_->on_abort(abort_packet.reason);
  this->reset_();
  return true;
}

bool FileReceiver::handle_file_data(const uint8_t *payload, size_t len) {
  if (payload == nullptr || len < sizeof(espnow_file_data_header_t)) {
    return false;
  }
  if (state_ != State::RECEIVING || active_handler_ == nullptr) {
    return false;
  }

  const auto *header = reinterpret_cast<const espnow_file_data_header_t *>(payload);
  const uint8_t *data = payload + sizeof(*header);
  const size_t data_len = len - sizeof(*header);

  if (header->sequence >= total_chunks_) {
    ESP_LOGW(TAG, "Dropping FILE_DATA seq=%u beyond total_chunks=%u",
             static_cast<unsigned>(header->sequence), static_cast<unsigned>(total_chunks_));
    return false;
  }

  uint32_t inc_start = static_cast<uint32_t>(current_increment_) * chunks_per_increment_;
  uint32_t inc_end = std::min<uint32_t>(
      inc_start + static_cast<uint32_t>(chunks_in_increment_(current_increment_)),
      total_chunks_);
  if (header->sequence < inc_start || header->sequence >= inc_end) {
    if (header->sequence < inc_start && increment_written_) {
      return true;
    }
    return false;
  }

  const size_t expected_len = expected_chunk_len_(header->sequence);
  if (expected_len == 0 || data_len != expected_len) {
    ESP_LOGW(TAG, "Dropping FILE_DATA seq=%u due to length mismatch got=%u expected=%u",
             static_cast<unsigned>(header->sequence), static_cast<unsigned>(data_len),
             static_cast<unsigned>(expected_len));
    return false;
  }

  last_activity_ms_ = millis();
  uint16_t chunk_in_increment = static_cast<uint16_t>(header->sequence % chunks_per_increment_);

  if (increment_buf_.is_chunk_received(chunk_in_increment)) {
    return true;
  }

  size_t offset_in_buffer = static_cast<size_t>(chunk_in_increment) * chunk_payload_size_;
  if (offset_in_buffer + data_len > increment_buf_.data.size()) {
    return false;
  }
  std::memcpy(increment_buf_.data.data() + offset_in_buffer, data, data_len);
  increment_buf_.mark_chunk_received(chunk_in_increment);

  return true;
}

bool FileReceiver::write_increment_to_flash_() {
  if (active_handler_ == nullptr || increment_buf_.data.empty()) {
    return false;
  }

  uint16_t num_chunks = chunks_in_increment_(current_increment_);

  for (uint16_t i = 0; i < num_chunks; ++i) {
    size_t offset_in_buffer = static_cast<size_t>(i) * chunk_payload_size_;
    size_t slice_len = chunk_payload_size_;
    if (i == num_chunks - 1) {
      uint32_t total_buf_len = static_cast<uint32_t>(num_chunks) * chunk_payload_size_;
      uint64_t file_offset_done = static_cast<uint64_t>(current_increment_) *
                                  static_cast<uint64_t>(chunks_per_increment_) *
                                  chunk_payload_size_;
      file_offset_done += offset_in_buffer;
      if (file_offset_done + slice_len > file_size_) {
        slice_len = static_cast<size_t>(file_size_ - file_offset_done);
      }
    }
    if (slice_len == 0) break;

    if (offset_in_buffer + slice_len > increment_buf_.data.size()) {
      break;
    }

    ChunkResponse response = active_handler_->on_data(
        static_cast<uint32_t>(current_increment_) * chunks_per_increment_ + i,
        increment_buf_.data.data() + offset_in_buffer, slice_len);
    if (!response.accepted) {
      ESP_LOGE(TAG, "Flash write failed for increment %u chunk %u, retrying once",
               static_cast<unsigned>(current_increment_), static_cast<unsigned>(i));

      for (uint16_t j = 0; j < num_chunks; ++j) {
        size_t retry_offset = static_cast<size_t>(j) * chunk_payload_size_;
        size_t retry_len = chunk_payload_size_;
        if (j == num_chunks - 1) {
          uint64_t file_off = static_cast<uint64_t>(current_increment_) *
                              static_cast<uint64_t>(chunks_per_increment_) *
                              chunk_payload_size_;
          file_off += retry_offset;
          if (file_off + retry_len > file_size_) {
            retry_len = static_cast<size_t>(file_size_ - file_off);
          }
        }
        if (retry_len == 0) break;
        if (retry_offset + retry_len > increment_buf_.data.size()) break;

        ChunkResponse retry_resp = active_handler_->on_data(
            static_cast<uint32_t>(current_increment_) * chunks_per_increment_ + j,
            increment_buf_.data.data() + retry_offset, retry_len);
        if (!retry_resp.accepted) {
          ESP_LOGE(TAG, "Flash write retry also failed for increment %u chunk %u",
                   static_cast<unsigned>(current_increment_), static_cast<unsigned>(j));
          this->abort(ESPNOW_FILE_ABORT_FLASH_ERROR, true);
          return false;
        }
        delay(0);
      }
      break;
    }
    delay(0);
  }

  increment_written_ = true;

  if (current_increment_ + 1U >= total_increments_) {
    state_ = State::WAITING_END;
    return send_gaps_ack_(nullptr, 0);
  }

  bool ack_ok = send_gaps_ack_(nullptr, 0);

  ++current_increment_;
  retransmit_round_ = 0;
  increment_written_ = false;

  uint16_t next_inc_chunks = chunks_in_increment_(current_increment_);
  uint32_t next_inc_data_size = static_cast<uint32_t>(next_inc_chunks) * chunk_payload_size_;
  increment_buf_.reset(next_inc_chunks, next_inc_data_size);
  state_ = State::RECEIVING;

  return ack_ok;
}

void FileReceiver::loop() {
  this->perform_restart_if_due_();

  if (in_complete_phase_) {
    const uint32_t now = millis();
    if (now - next_complete_ack_ms_ >= kCompleteAckIntervalMs) {
      this->send_ack_complete_(complete_action_, complete_result_);
      complete_ack_remaining_--;
      next_complete_ack_ms_ = now;
    }
    if (complete_ack_remaining_ <= 0) {
      this->reset_();
      this->schedule_restart_();
      in_complete_phase_ = false;
    }
    return;
  }

  if (state_ == State::IDLE || active_handler_ == nullptr) {
    return;
  }

  const uint32_t now = millis();
  if (state_ == State::ANNOUNCED) {
    if ((now - last_activity_ms_) > ESPNOW_FILE_ANNOUNCE_TIMEOUT_MS) {
      ESP_LOGW(TAG, "Aborting FILE_TRANSFER due to ANNOUNCED inactivity timeout");
      this->abort(ESPNOW_FILE_ABORT_TIMEOUT, true);
    }
    return;
  }

  if (state_ == State::WRITING || state_ == State::CHECKING) {
    return;
  }

  if (state_ == State::WAITING_END) {
    if ((now - last_activity_ms_) > ESPNOW_RADIO_SILENCE_ABORT_MS) {
      ESP_LOGW(TAG, "Aborting FILE_TRANSFER due to WAITING_END radio silence");
      this->abort(ESPNOW_FILE_ABORT_TIMEOUT, true);
    }
    return;
  }

  if ((now - last_activity_ms_) > ESPNOW_RADIO_SILENCE_ABORT_MS) {
    ESP_LOGW(TAG, "Aborting FILE_TRANSFER due to radio silence timeout (%ums)",
             static_cast<unsigned>(ESPNOW_RADIO_SILENCE_ABORT_MS));
    this->abort(ESPNOW_FILE_ABORT_TIMEOUT, true);
  }
}

void FileReceiver::abort(uint8_t reason, bool notify_sender) {
  if (active_handler_ != nullptr) {
    active_handler_->on_abort(reason);
  }
  if (notify_sender) {
    this->send_ack_abort_(reason);
  }
  this->reset_();
}

bool FileReceiver::send_ack_(uint8_t result, const uint8_t *trailing, size_t trailing_len) {
  if (!send_ack_fn_) {
    return false;
  }

  std::vector<uint8_t> payload(sizeof(espnow_ack_t) + trailing_len, 0);
  auto *ack = reinterpret_cast<espnow_ack_t *>(payload.data());
  ack->ack_type = PKT_FILE_TRANSFER;
  ack->result = result;
  ack->ref_tx_counter = (result == ESPNOW_FILE_ACK_GAPS)
                            ? last_blast_complete_tx_counter_
                            : announce_tx_counter_;
  if (trailing_len > 0 && trailing != nullptr) {
    std::memcpy(payload.data() + sizeof(*ack), trailing, trailing_len);
  }

  return send_ack_fn_(payload.data(), payload.size());
}

bool FileReceiver::send_ack_accept_(uint16_t chunk_size, uint8_t action, uint16_t buffer_size_kb) {
  std::array<uint8_t, 4> trailing{};
  std::memcpy(trailing.data(), &chunk_size, sizeof(chunk_size));
  trailing[2] = static_cast<uint8_t>(buffer_size_kb);
  trailing[3] = action;
  return this->send_ack_(ESPNOW_FILE_ACK_ACCEPT, trailing.data(), trailing.size());
}

bool FileReceiver::send_ack_reject_(uint8_t action, uint8_t reason) {
  const uint8_t trailing[2] = {action, reason};
  return this->send_ack_(ESPNOW_FILE_ACK_REJECT, trailing, sizeof(trailing));
}

bool FileReceiver::send_gaps_ack_(const uint8_t *bitmap, size_t bitmap_len) {
  std::vector<uint8_t> trailing(2 + bitmap_len, 0);
  uint16_t bitmap_len_le = static_cast<uint16_t>(bitmap_len);
  std::memcpy(trailing.data(), &bitmap_len_le, sizeof(bitmap_len_le));
  if (bitmap_len > 0 && bitmap != nullptr) {
    std::memcpy(trailing.data() + 2, bitmap, bitmap_len);
  }
  return this->send_ack_(ESPNOW_FILE_ACK_GAPS, trailing.data(), trailing.size());
}

bool FileReceiver::send_ack_complete_(uint8_t action, uint8_t result) {
  const uint8_t trailing[2] = {action, result};
  return this->send_ack_(ESPNOW_FILE_ACK_COMPLETE, trailing, sizeof(trailing));
}

bool FileReceiver::send_ack_abort_(uint8_t reason) {
  const uint8_t trailing[1] = {reason};
  return this->send_ack_(ESPNOW_FILE_ACK_ABORT, trailing, sizeof(trailing));
}

void FileReceiver::compute_increment_geometry_() {
  uint16_t effective_kb = std::min<uint16_t>(buffer_size_kb_, ESPNOW_MAX_INCREMENT_KB);
  uint32_t increment_data_size = static_cast<uint32_t>(effective_kb) * 1024U;
  chunks_per_increment_ = static_cast<uint16_t>(increment_data_size / chunk_payload_size_);
  if (chunks_per_increment_ == 0) {
    chunks_per_increment_ = 1;
  }
  total_chunks_ = (file_size_ / chunk_payload_size_) +
                  ((file_size_ % chunk_payload_size_) != 0U ? 1U : 0U);
  total_increments_ = (total_chunks_ / chunks_per_increment_) +
                      ((total_chunks_ % chunks_per_increment_) != 0U ? 1U : 0U);
  if (total_increments_ == 0) {
    total_increments_ = 1;
  }
  chunks_in_last_increment_ = total_chunks_ -
                              static_cast<uint32_t>(total_increments_ - 1U) * chunks_per_increment_;
  if (chunks_in_last_increment_ == 0) {
    chunks_in_last_increment_ = chunks_per_increment_;
  }
}

uint16_t FileReceiver::chunks_in_increment_(uint16_t increment_index) const {
  if (increment_index + 1U >= total_increments_) {
    return chunks_in_last_increment_;
  }
  return chunks_per_increment_;
}

size_t FileReceiver::expected_chunk_len_(uint32_t sequence) const {
  if (chunk_payload_size_ == 0 || sequence >= total_chunks_) {
    return 0;
  }
  const uint64_t offset = static_cast<uint64_t>(sequence) * chunk_payload_size_;
  if (offset >= file_size_) {
    return 0;
  }
  const uint64_t remaining = static_cast<uint64_t>(file_size_) - offset;
  return static_cast<size_t>(std::min<uint64_t>(remaining, chunk_payload_size_));
}

void FileReceiver::reset_() {
  state_ = State::IDLE;
  active_handler_ = nullptr;
  file_size_ = 0;
  chunk_payload_size_ = 0;
  buffer_size_kb_ = ESPNOW_MAX_INCREMENT_KB;
  chunks_per_increment_ = 0;
  total_increments_ = 0;
  chunks_in_last_increment_ = 0;
  current_increment_ = 0;
  total_chunks_ = 0;
  action_ = 0;
  std::memset(file_id_, 0, sizeof(file_id_));
  std::memset(last_announce_md5_, 0, sizeof(last_announce_md5_));
  announce_tx_counter_ = 0;
  last_activity_ms_ = 0;
  last_blast_complete_tx_counter_ = 0;
  retransmit_round_ = 0;
  increment_written_ = false;
  increment_buf_ = IncrementBuffer{};
  in_complete_phase_ = false;
  complete_ack_remaining_ = 0;
  next_complete_ack_ms_ = 0;
}

void FileReceiver::schedule_restart_() {
  restart_pending_ = true;
  restart_due_ms_ = millis() + kRestartDelayMs;
}

void FileReceiver::perform_restart_if_due_() {
  if (!restart_pending_) {
    return;
  }
  if (static_cast<int32_t>(millis() - restart_due_ms_) < 0) {
    return;
  }

  restart_pending_ = false;
  ESP_LOGI(TAG, "Restarting after OTA COMPLETE ACK handoff");
#if defined(ESP_PLATFORM)
  delay(50);
  esp_restart();
#endif
}

FileReceiver::AnnounceResponse FileReceiver::OTAFlashHandler::on_announce(
    uint32_t file_size, const uint8_t md5[16],
    uint16_t chunk_size, uint8_t action,
    const char *file_id, uint16_t &buffer_size_kb) {
  (void) action;
  (void) file_id;

  AnnounceResponse response{};
  if (state_ != State::IDLE) {
    response.reject_reason = ESPNOW_FILE_REJECT_ALREADY;
    return response;
  }
  if (file_size == 0 || chunk_size == 0) {
    response.reject_reason = ESPNOW_FILE_REJECT_UNSUPPORTED;
    return response;
  }

  const uint16_t negotiated_chunk_size = std::min<uint16_t>(chunk_size, max_chunk_size_);
  if (negotiated_chunk_size == 0) {
    response.reject_reason = ESPNOW_FILE_REJECT_UNSUPPORTED;
    return response;
  }

#if defined(ESP_PLATFORM)
  update_partition_ = esp_ota_get_next_update_partition(nullptr);
  if (update_partition_ == nullptr) {
    response.reject_reason = ESPNOW_FILE_REJECT_UNSUPPORTED;
    return response;
  }
  if (file_size > update_partition_->size) {
    response.reject_reason = ESPNOW_FILE_REJECT_NO_SPACE;
    return response;
  }

  ota_handle_ = 0;
  const esp_err_t begin_err = esp_ota_begin(update_partition_, file_size, &ota_handle_);
  if (begin_err != ESP_OK) {
    ESP_LOGE(TAG, "esp_ota_begin failed: %s", esp_err_to_name(begin_err));
    response.reject_reason = ESPNOW_FILE_REJECT_BUSY;
    return response;
  }

  uint32_t largest_free = heap_caps_get_largest_free_block(MALLOC_CAP_8BIT);
  uint16_t heap_kb = static_cast<uint16_t>((static_cast<uint64_t>(largest_free) * 50ULL) / 100ULL / 1024ULL);
  if (heap_kb < 8) {
    heap_kb = 8;
  }
  if (heap_kb > ESPNOW_MAX_INCREMENT_KB) {
    heap_kb = ESPNOW_MAX_INCREMENT_KB;
  }
  buffer_size_kb = heap_kb;
#else
  static esp_partition_t host_partition{4U * 1024U * 1024U};
  update_partition_ = &host_partition;
  ota_handle_ = 1;
  if (file_size > update_partition_->size) {
    response.reject_reason = ESPNOW_FILE_REJECT_NO_SPACE;
    return response;
  }
  buffer_size_kb = ESPNOW_MAX_INCREMENT_KB;
#endif

  if (!begin_md5_()) {
#if defined(ESP_PLATFORM)
    esp_ota_abort(ota_handle_);
#endif
    ota_handle_ = 0;
    update_partition_ = nullptr;
    response.reject_reason = ESPNOW_FILE_REJECT_BUSY;
    return response;
  }

  file_size_ = file_size;
  chunk_size_ = negotiated_chunk_size;
  total_written_ = 0;
  restart_requested_ = false;
  expected_md5_.fill(0);
  std::memcpy(expected_md5_.data(), md5, expected_md5_.size());
  state_ = State::RECEIVING;

  ESP_LOGI(TAG, "OTAFlash accept: chunk_size=%u max_chunk_size=%u buf_kb=%u",
           static_cast<unsigned>(negotiated_chunk_size),
           static_cast<unsigned>(max_chunk_size_),
           static_cast<unsigned>(buffer_size_kb));

  response.accepted = true;
  response.negotiated_chunk_size = negotiated_chunk_size;
  return response;
}

FileReceiver::ChunkResponse FileReceiver::OTAFlashHandler::on_data(
    uint32_t sequence, const uint8_t *data, size_t len) {
  (void) sequence;

  ChunkResponse response{};
  if (state_ != State::RECEIVING || data == nullptr || len == 0) {
    response.accepted = false;
    response.abort_reason = ESPNOW_FILE_ABORT_FLASH_ERROR;
    return response;
  }

  if (total_written_ == 0 && data[0] != kEspImageMagic) {
    ESP_LOGE(TAG, "Rejecting OTA image with invalid magic byte 0x%02X", data[0]);
    response.accepted = false;
    response.abort_reason = ESPNOW_FILE_ABORT_FLASH_ERROR;
    return response;
  }

#if defined(ESP_PLATFORM)
  const esp_err_t write_err = esp_ota_write(ota_handle_, data, len);
  if (write_err != ESP_OK) {
    ESP_LOGE(TAG, "esp_ota_write failed: %s", esp_err_to_name(write_err));
    response.accepted = false;
    response.abort_reason = ESPNOW_FILE_ABORT_FLASH_ERROR;
    return response;
  }
#endif

  if (!update_md5_(data, len)) {
    response.accepted = false;
    response.abort_reason = ESPNOW_FILE_ABORT_FLASH_ERROR;
    return response;
  }

  total_written_ += static_cast<uint32_t>(len);
  delay(0);
  return response;
}

uint8_t FileReceiver::OTAFlashHandler::on_end() {
  if (state_ != State::RECEIVING) {
    return ESPNOW_FILE_COMPLETE_ABORTED;
  }

  state_ = State::VERIFYING;
  if (total_written_ != file_size_) {
#if defined(ESP_PLATFORM)
    esp_ota_abort(ota_handle_);
#endif
    reset_state_();
    return ESPNOW_FILE_COMPLETE_WRITE_ERROR;
  }

  uint8_t computed_md5[16] = {0};
  if (!finish_md5_(computed_md5)) {
#if defined(ESP_PLATFORM)
    esp_ota_abort(ota_handle_);
#endif
    reset_state_();
    return ESPNOW_FILE_COMPLETE_FLASH_ERROR;
  }

  if (std::memcmp(computed_md5, expected_md5_.data(), expected_md5_.size()) != 0) {
#if defined(ESP_PLATFORM)
    esp_ota_abort(ota_handle_);
#endif
    reset_state_();
    return ESPNOW_FILE_COMPLETE_MD5_MISMATCH;
  }

#if defined(ESP_PLATFORM)
  const esp_err_t end_err = esp_ota_end(ota_handle_);
  if (end_err != ESP_OK) {
    ESP_LOGE(TAG, "esp_ota_end failed: %s", esp_err_to_name(end_err));
    reset_state_();
    return ESPNOW_FILE_COMPLETE_FLASH_ERROR;
  }

  const esp_err_t set_boot_err = esp_ota_set_boot_partition(update_partition_);
  if (set_boot_err != ESP_OK) {
    ESP_LOGE(TAG, "esp_ota_set_boot_partition failed: %s", esp_err_to_name(set_boot_err));
    reset_state_();
    return ESPNOW_FILE_COMPLETE_FLASH_ERROR;
  }
#endif

  reset_state_();
  restart_requested_ = true;
  return ESPNOW_FILE_COMPLETE_SUCCESS;
}

void FileReceiver::OTAFlashHandler::on_abort(uint8_t reason) {
  (void) reason;
#if defined(ESP_PLATFORM)
  if (state_ != State::IDLE && ota_handle_ != 0) {
    esp_ota_abort(ota_handle_);
  }
#endif
  reset_state_();
}

void FileReceiver::OTAFlashHandler::reset_state_() {
  state_ = State::IDLE;
  file_size_ = 0;
  chunk_size_ = 0;
  total_written_ = 0;
  restart_requested_ = false;
  expected_md5_.fill(0);
  update_partition_ = nullptr;
  ota_handle_ = 0;
  md5_active_ = false;
}

bool FileReceiver::OTAFlashHandler::begin_md5_() {
  md5_digest_.init();
  md5_active_ = true;
  return true;
}

bool FileReceiver::OTAFlashHandler::update_md5_(const uint8_t *data, size_t len) {
  if (!md5_active_) {
    return false;
  }
  md5_digest_.add(data, len);
  return true;
}

bool FileReceiver::OTAFlashHandler::finish_md5_(uint8_t out[16]) {
  if (!md5_active_) {
    return false;
  }
  md5_digest_.calculate();
  md5_digest_.get_bytes(out);
  md5_active_ = false;
  return true;
}

}  // namespace esp_tree
}  // namespace esphome
