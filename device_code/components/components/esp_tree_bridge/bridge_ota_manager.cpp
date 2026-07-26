#include "bridge_ota_manager.h"

#include "esp_tree_common/espnow_mac_utils.h"
#include "esp_tree_common/espnow_types.h"
#include "esphome/core/hal.h"
#include "esphome/core/log.h"

#include <algorithm>
#include <array>
#include <cstdio>
#include <cstring>
#include <limits>
#include <set>
#include <sstream>
#include <utility>
#include <vector>

#ifndef ESP_ERR_ESPNOW_NO_MEM
#define ESP_ERR_ESPNOW_NO_MEM ESP_ERR_NO_MEM
#endif

namespace esphome {
namespace esp_tree {

namespace {

static const char *const TAG = "espnow.ota";
static constexpr size_t FILE_ID_LEN = 12;

static std::string reject_reason_to_string(uint8_t reason) {
  switch (reason) {
    case ESPNOW_FILE_REJECT_BUSY:
      return "busy";
    case ESPNOW_FILE_REJECT_NO_SPACE:
      return "no_space";
    case ESPNOW_FILE_REJECT_UNSUPPORTED:
      return "unsupported_action";
    case ESPNOW_FILE_REJECT_ALREADY:
      return "already_receiving";
    case ESPNOW_FILE_REJECT_DEEP_SLEEP:
      return "deep_sleep";
    case ESPNOW_FILE_REJECT_CHIP_MISMATCH:
      return "chip_mismatch";
    default:
      return "reject_unknown";
  }
}

static std::string complete_result_to_string(uint8_t result) {
  switch (result) {
    case ESPNOW_FILE_COMPLETE_SUCCESS:
      return "success";
    case ESPNOW_FILE_COMPLETE_MD5_MISMATCH:
      return "md5_mismatch";
    case ESPNOW_FILE_COMPLETE_FLASH_ERROR:
      return "flash_error";
    case ESPNOW_FILE_COMPLETE_WRITE_ERROR:
      return "write_error";
    case ESPNOW_FILE_COMPLETE_ABORTED:
      return "aborted";
    default:
      return "complete_unknown";
  }
}

}  // namespace

void ESPNowOTAManager::IncrementTracker::reset() {
  current_increment = 0;
  total_increments = 0;
  chunks_per_increment = 0;
  chunks_in_last_increment = 0;
  total_chunks = 0;
  buffer_size_kb = ESPNOW_MAX_INCREMENT_KB;
  retransmit_round = 0;
  blast_complete_retries = 0;
  blast_complete_sent_ms = 0;
  last_blast_complete_tx_counter = 0;
  blast_complete_tx_history.clear();
  received_bitmap.clear();
  gap_sequences.clear();
  requested_sequences.clear();
  sent_sequences.clear();
  last_remote_activity_ms = 0;
}

uint16_t ESPNowOTAManager::IncrementTracker::chunks_in_this_increment() const {
  if (is_last_increment()) {
    return chunks_in_last_increment;
  }
  return chunks_per_increment;
}

uint32_t ESPNowOTAManager::IncrementTracker::increment_start_seq() const {
  return static_cast<uint32_t>(current_increment) * chunks_per_increment;
}

uint32_t ESPNowOTAManager::IncrementTracker::increment_end_seq() const {
  return std::min<uint32_t>(increment_start_seq() + static_cast<uint32_t>(chunks_in_this_increment()), total_chunks);
}

ESPNowOTAManager::ESPNowOTAManager() = default;

ESPNowOTAManager::ESPNowOTAManager(Config config) : config_(config) {}

bool ESPNowOTAManager::start_transfer(const uint8_t *leaf_mac, uint32_t file_size, const uint8_t md5[16], uint8_t action,
                                      uint16_t remote_max_frame_payload, const char *file_id) {
  if (leaf_mac == nullptr || md5 == nullptr || file_size == 0) {
    return false;
  }
  if (is_busy()) {
    last_error_ = "busy";
    return false;
  }
  if (!send_frame_fn_) {
    last_error_ = "send_frame_fn not configured";
    return false;
  }
  if (file_size > 1073741824U) {
    last_error_ = "file_size exceeds 1GB limit";
    return false;
  }

  const uint16_t requested_chunk_size = clamp_chunk_size_(remote_max_frame_payload);
  if (requested_chunk_size < 64) {
    last_error_ = "remote chunk size below minimum";
    return false;
  }

  max_encrypted_plaintext_ = espnow_max_plaintext(remote_max_frame_payload);

  reset_();
  std::copy_n(leaf_mac, leaf_mac_.size(), leaf_mac_.begin());
  status_leaf_mac_ = leaf_mac_;
  std::copy_n(md5, md5_.size(), md5_.begin());
  file_size_ = file_size;
  requested_chunk_size_ = requested_chunk_size;
  negotiated_chunk_size_ = requested_chunk_size;
  action_ = action;
  file_id_ = file_id != nullptr ? file_id : "ota.bin";
  if (file_id_.size() > FILE_ID_LEN) {
    file_id_.resize(FILE_ID_LEN);
  }
  transfer_started_ms_ = millis();
  last_activity_ms_ = transfer_started_ms_;
  public_busy_ = true;
  public_progress_pct_ = 0;
  public_state_ = "START_RECEIVED";
  last_error_.clear();

  state_ = State::ANNOUNCING;
  if (!send_announce_() && state_ == State::IDLE) {
    return false;
  }
  return true;
}

bool ESPNowOTAManager::on_source_chunk(uint32_t sequence, const uint8_t *data, size_t len) {
  std::lock_guard<std::recursive_mutex> lock(ota_mutex_);
  if (state_ != State::BLASTING || data == nullptr) {
    return false;
  }
  if (tracker_.requested_sequences.find(sequence) == tracker_.requested_sequences.end()) {
    return false;
  }

  const size_t expected_len = expected_chunk_len_(sequence);
  if (expected_len == 0 || len != expected_len) {
    ESP_LOGW(TAG, "Rejecting source chunk seq=%u len=%u expected=%u", static_cast<unsigned>(sequence),
             static_cast<unsigned>(len), static_cast<unsigned>(expected_len));
    return false;
  }

  QueuedChunk qc;
  qc.sequence = sequence;
  qc.data.assign(data, data + len);
  pending_chunks_.push_back(std::move(qc));
  tracker_.requested_sequences.erase(sequence);

  return true;
}

void ESPNowOTAManager::on_source_abort(uint8_t reason) {
  std::lock_guard<std::recursive_mutex> lock(ota_mutex_);
  if (!is_busy()) {
    return;
  }
  fail_transfer_(reason, abort_reason_to_string(reason), true);
}

bool ESPNowOTAManager::on_file_ack(const uint8_t *leaf_mac, const espnow_ack_t &ack_header, const uint8_t *trailing,
                                   size_t trailing_len) {
  std::lock_guard<std::recursive_mutex> lock(ota_mutex_);
  if (!is_busy() || leaf_mac == nullptr) {
    return false;
  }
  if (ack_header.ack_type != PKT_FILE_TRANSFER) {
    return false;
  }
  if (!same_leaf_(leaf_mac)) {
    return false;
  }

  last_activity_ms_ = millis();
  tracker_.last_remote_activity_ms = millis();

  switch (ack_header.result) {
    case ESPNOW_FILE_ACK_ACCEPT:
      if (state_ == State::ANNOUNCING) {
        if (ack_header.ref_tx_counter != announce_tx_counter_) {
          ESP_LOGD(TAG, "Ignoring stale ACCEPT ACK ref_tx=%u expected=%u",
                   static_cast<unsigned>(ack_header.ref_tx_counter),
                   static_cast<unsigned>(announce_tx_counter_));
          return false;
        }
        handle_accept_(trailing, trailing_len);
      }
      return true;

    case ESPNOW_FILE_ACK_REJECT:
      handle_reject_(trailing, trailing_len);
      return true;

    case ESPNOW_FILE_ACK_GAPS:
      if (state_ == State::WAITING_GAPS) {
        bool valid_ack = false;
        for (auto tx : tracker_.blast_complete_tx_history) {
          if (ack_header.ref_tx_counter == tx) {
            valid_ack = true;
            break;
          }
        }
        if (!valid_ack) {
          ESP_LOGD(TAG, "Ignoring stale GAPS ACK ref_tx=%u not in history",
                   static_cast<unsigned>(ack_header.ref_tx_counter));
          return false;
        }
        handle_gaps_ack_(trailing, trailing_len);
      }
      return true;

    case ESPNOW_FILE_ACK_COMPLETE:
      handle_complete_(trailing, trailing_len);
      return true;

    case ESPNOW_FILE_ACK_ABORT:
      handle_abort_ack_(trailing, trailing_len);
      return true;

    default:
      return false;
  }
}

void ESPNowOTAManager::loop() {
  if (!is_busy()) {
    return;
  }

  const uint32_t now = millis();
  if (!target_reachable_()) {
    fail_transfer_(ESPNOW_FILE_ABORT_SESSION_LOST, "target unreachable", false);
    return;
  }
  if (config_.global_timeout_ms > 0 && (now - transfer_started_ms_) > config_.global_timeout_ms) {
    fail_transfer_(ESPNOW_FILE_ABORT_TIMEOUT, "transfer global timeout", true);
    return;
  }
  if (now < no_mem_backoff_until_ms_) {
    return;
  }

  if (tracker_.last_remote_activity_ms > 0 &&
      (state_ == State::BLASTING || state_ == State::WAITING_GAPS)) {
    uint32_t silence_timeout_ms = (state_ == State::WAITING_GAPS) ? ESPNOW_WAITING_GAPS_TIMEOUT_MS : ESPNOW_RADIO_SILENCE_ABORT_MS;
    if ((now - tracker_.last_remote_activity_ms) > silence_timeout_ms) {
      fail_transfer_(ESPNOW_FILE_ABORT_TIMEOUT, "radio silence from remote", true);
      return;
    }
  }

  switch (state_) {
    case State::ANNOUNCING:
      if (control_attempt_count_ == 0 || (now - last_control_send_ms_) >= ESPNOW_FILE_ANNOUNCE_TIMEOUT_MS) {
        if (!send_announce_() && state_ == State::IDLE) {
          return;
        }
      }
      break;

    case State::BLASTING:
      pump_blasting_();
      pump_queued_chunks_();
      break;

    case State::WAITING_GAPS:
      if (tracker_.blast_complete_sent_ms > 0 &&
          (now - tracker_.blast_complete_sent_ms) >= ESPNOW_BLAST_COMPLETE_TIMEOUT_MS) {
        if (tracker_.blast_complete_retries >= ESPNOW_MAX_BLAST_COMPLETE_RETRIES) {
          fail_transfer_(ESPNOW_FILE_ABORT_TIMEOUT, "BLAST_COMPLETE retry limit exceeded", true);
          return;
        }
        if (!send_blast_complete_() && state_ == State::IDLE) {
          return;
        }
      }
      break;

    case State::ENDING:
      if (control_attempt_count_ == 0 || (now - last_control_send_ms_) >= ESPNOW_FILE_ANNOUNCE_TIMEOUT_MS) {
        if (!send_end_() && state_ == State::IDLE) {
          return;
        }
      }
      break;

    case State::ABORTING:
    case State::IDLE:
      break;
  }
}

std::string ESPNowOTAManager::status_json() const {
  std::ostringstream json;
  json << '{'
       << "\"state\":\"" << public_state_ << "\","
       << "\"busy\":" << (public_busy_ ? "true" : "false") << ','
       << "\"leaf_mac\":\"" << format_mac_(public_busy_ ? leaf_mac_ : status_leaf_mac_) << "\","
       << "\"file_size\":" << file_size_ << ','
       << "\"chunk_size\":" << negotiated_chunk_size_ << ','
       << "\"total_chunks\":" << tracker_.total_chunks << ','
       << "\"current_increment\":" << tracker_.current_increment << ','
       << "\"total_increments\":" << tracker_.total_increments << ','
       << "\"retransmit_round\":" << static_cast<unsigned>(tracker_.retransmit_round) << ','
       << "\"buffer_size_kb\":" << static_cast<unsigned>(tracker_.buffer_size_kb) << ','
       << "\"progress_pct\":" << static_cast<unsigned>(public_progress_pct_) << ','
       << "\"error\":\"" << escape_json_(last_error_) << "\","
       << "\"requested\":[";

  bool first = true;
  for (auto seq : tracker_.requested_sequences) {
    if (!first) json << ',';
    json << seq;
    first = false;
  }
  json << "]}";
  return json.str();
}

bool ESPNowOTAManager::send_announce_() {
  if (state_ != State::ANNOUNCING) {
    return false;
  }
  if (control_attempt_count_ >= ESPNOW_FILE_MAX_RETRIES) {
    fail_transfer_(ESPNOW_FILE_ABORT_TIMEOUT, "announce retry limit exceeded", true);
    return false;
  }

  espnow_file_announce_t announce{};
  announce.phase = ESPNOW_FILE_PHASE_ANNOUNCE;
  announce.file_size = file_size_;
  std::memcpy(announce.md5, md5_.data(), md5_.size());
  announce.chunk_size = requested_chunk_size_;
  announce.action = action_;
  if (!file_id_.empty()) {
    std::memcpy(announce.file_id, file_id_.data(),
                std::min(file_id_.size(), sizeof(announce.file_id)));
  }

  uint32_t tx_counter = 0;
  const esp_err_t err =
      send_frame_fn_(leaf_mac_.data(), PKT_FILE_TRANSFER, reinterpret_cast<const uint8_t *>(&announce),
                     sizeof(announce), &tx_counter);
  if (err == ESP_ERR_ESPNOW_NO_MEM) {
    mark_no_mem_backoff_();
    return false;
  }
  clear_no_mem_backoff_();
  if (err != ESP_OK) {
    fail_transfer_(err == ESP_ERR_NOT_FOUND ? ESPNOW_FILE_ABORT_SESSION_LOST : ESPNOW_FILE_ABORT_SEND_FAILURE,
                   err == ESP_ERR_NOT_FOUND ? "target unreachable" : "failed to send announce", false);
    return false;
  }

  announce_tx_counter_ = tx_counter;
  last_control_send_ms_ = millis();
  last_activity_ms_ = last_control_send_ms_;
  ++control_attempt_count_;
  ESP_LOGI(TAG, "Sent OTA announce tx=%u size=%u chunk=%u attempts=%u", static_cast<unsigned>(tx_counter),
           static_cast<unsigned>(file_size_), static_cast<unsigned>(requested_chunk_size_),
           static_cast<unsigned>(control_attempt_count_));
  return true;
}

bool ESPNowOTAManager::send_blast_complete_() {
  espnow_file_blast_complete_t bc{};
  bc.phase = ESPNOW_FILE_PHASE_BLAST_COMPLETE;
  bc.increment_index = tracker_.current_increment;

  uint32_t tx_counter = 0;
  const esp_err_t err =
      send_frame_fn_(leaf_mac_.data(), PKT_FILE_TRANSFER, reinterpret_cast<const uint8_t *>(&bc),
                     sizeof(bc), &tx_counter);
  if (err == ESP_ERR_ESPNOW_NO_MEM) {
    mark_no_mem_backoff_();
    return false;
  }
  clear_no_mem_backoff_();
  if (err != ESP_OK) {
    if (err == ESP_ERR_NOT_FOUND) {
      fail_transfer_(ESPNOW_FILE_ABORT_SESSION_LOST, "target unreachable during BLAST_COMPLETE", false);
    }
    return false;
  }

  tracker_.last_blast_complete_tx_counter = tx_counter;
  tracker_.blast_complete_tx_history.push_back(tx_counter);
  if (tracker_.blast_complete_tx_history.size() > 8) {
    tracker_.blast_complete_tx_history.erase(tracker_.blast_complete_tx_history.begin());
  }
  tracker_.blast_complete_sent_ms = millis();
  ++tracker_.blast_complete_retries;
  last_activity_ms_ = millis();

  ESP_LOGD(TAG, "Sent BLAST_COMPLETE tx=%u inc=%u retry=%u", static_cast<unsigned>(tx_counter),
           static_cast<unsigned>(tracker_.current_increment),
           static_cast<unsigned>(tracker_.blast_complete_retries));
  return true;
}

bool ESPNowOTAManager::send_end_() {
  if (state_ != State::WAITING_GAPS && state_ != State::ENDING) {
    return false;
  }
  if (control_attempt_count_ >= ESPNOW_FILE_MAX_RETRIES) {
    fail_transfer_(ESPNOW_FILE_ABORT_TIMEOUT, "end retry limit exceeded", true);
    return false;
  }

  espnow_file_end_t end_packet{};
  end_packet.phase = ESPNOW_FILE_PHASE_END;

  uint32_t ignored_tx_counter = 0;
  const esp_err_t err =
      send_frame_fn_(leaf_mac_.data(), PKT_FILE_TRANSFER, reinterpret_cast<const uint8_t *>(&end_packet),
                     sizeof(end_packet), &ignored_tx_counter);
  if (err == ESP_ERR_ESPNOW_NO_MEM) {
    mark_no_mem_backoff_();
    fail_transfer_(ESPNOW_FILE_ABORT_SEND_FAILURE, "end no mem", true);
    return false;
  }
  clear_no_mem_backoff_();
  if (err != ESP_OK) {
    fail_transfer_(err == ESP_ERR_NOT_FOUND ? ESPNOW_FILE_ABORT_SESSION_LOST : ESPNOW_FILE_ABORT_SEND_FAILURE,
                   err == ESP_ERR_NOT_FOUND ? "target unreachable" : "failed to send end",
                   err != ESP_ERR_NOT_FOUND);
    return false;
  }

  state_ = State::ENDING;
  last_control_send_ms_ = millis();
  last_activity_ms_ = last_control_send_ms_;
  ++control_attempt_count_;
  return true;
}

bool ESPNowOTAManager::send_abort_(uint8_t reason) {
  if (!send_frame_fn_) {
    return false;
  }

  espnow_file_abort_t abort_packet{};
  abort_packet.phase = ESPNOW_FILE_PHASE_ABORT;
  abort_packet.reason = reason;

  uint32_t ignored_tx_counter = 0;
  const esp_err_t err =
      send_frame_fn_(leaf_mac_.data(), PKT_FILE_TRANSFER, reinterpret_cast<const uint8_t *>(&abort_packet),
                     sizeof(abort_packet), &ignored_tx_counter);
  if (err == ESP_ERR_ESPNOW_NO_MEM) {
    mark_no_mem_backoff_();
    return false;
  }
  clear_no_mem_backoff_();
  return err == ESP_OK;
}

bool ESPNowOTAManager::send_chunk_(uint32_t sequence, const uint8_t *data, size_t len) {
  std::vector<uint8_t> payload(sizeof(espnow_file_data_header_t) + len, 0);
  auto *header = reinterpret_cast<espnow_file_data_header_t *>(payload.data());
  header->sequence = sequence;
  std::memcpy(payload.data() + sizeof(*header), data, len);

  if (payload.size() > max_encrypted_plaintext_) {
    fail_transfer_(ESPNOW_FILE_ABORT_SEND_FAILURE, "chunk payload exceeds encrypted limit", true);
    return false;
  }

  uint32_t ignored_tx_counter = 0;
  const esp_err_t err =
      send_frame_fn_(leaf_mac_.data(), PKT_FILE_DATA, payload.data(), payload.size(), &ignored_tx_counter);
  if (err == ESP_ERR_ESPNOW_NO_MEM) {
    mark_no_mem_backoff_();
    return false;
  }
  decay_no_mem_backoff_();
  if (err != ESP_OK) {
    return false;
  }

  ESP_LOGD(TAG, "[TX FILE_DATA] %s len=%u #%06u", mac_display(leaf_mac_.data()).c_str(),
           static_cast<unsigned>(payload.size()), static_cast<unsigned>(sequence));

  last_chunk_send_ms_ = millis();
  last_activity_ms_ = last_chunk_send_ms_;
  if (state_ == State::BLASTING) {
    tracker_.last_remote_activity_ms = last_chunk_send_ms_;
  }
  return true;
}

void ESPNowOTAManager::request_increment_chunks_() {
  std::lock_guard<std::recursive_mutex> lock(ota_mutex_);
  if (tracker_.retransmit_round == 0) {
    tracker_.requested_sequences.clear();
    tracker_.sent_sequences.clear();
    for (uint32_t seq = tracker_.increment_start_seq(); seq < tracker_.increment_end_seq(); ++seq) {
      tracker_.requested_sequences.insert(seq);
    }
  } else {
    tracker_.requested_sequences = tracker_.gap_sequences;
    tracker_.sent_sequences.clear();
  }
}

void ESPNowOTAManager::pump_blasting_() {
  if (state_ != State::BLASTING) {
    return;
  }
  if (millis() < no_mem_backoff_until_ms_) {
    return;
  }
  if (config_.tx_cooldown_ms > 0 && last_chunk_send_ms_ > 0 &&
      (millis() - last_chunk_send_ms_) < config_.tx_cooldown_ms) {
    return;
  }

  std::lock_guard<std::recursive_mutex> lock(ota_mutex_);
  if (tracker_.requested_sequences.empty() && tracker_.sent_sequences.empty() && pending_chunks_.empty()) {
    request_increment_chunks_();
    public_state_ = "TRANSFERRING";
  }
}

void ESPNowOTAManager::pump_queued_chunks_() {
  if (state_ != State::BLASTING) {
    return;
  }
  if (millis() < no_mem_backoff_until_ms_) {
    return;
  }
  if (config_.tx_cooldown_ms > 0 && last_chunk_send_ms_ > 0 &&
      (millis() - last_chunk_send_ms_) < config_.tx_cooldown_ms) {
    return;
  }

  ota_mutex_.lock();
  if (pending_chunks_.empty()) {
    if (tracker_.requested_sequences.empty() && !tracker_.sent_sequences.empty()) {
      ota_mutex_.unlock();
      bool ok = send_blast_complete_();
      if (ok) {
        state_ = State::WAITING_GAPS;
      }
    } else {
      ota_mutex_.unlock();
    }
    return;
  }

  QueuedChunk &qc = pending_chunks_.front();
  ota_mutex_.unlock();

  if (!send_chunk_(qc.sequence, qc.data.data(), qc.data.size())) {
    return;
  }

  ota_mutex_.lock();
  tracker_.sent_sequences.insert(qc.sequence);
  pending_chunks_.pop_front();

  if (pending_chunks_.empty() && tracker_.requested_sequences.empty()) {
    ota_mutex_.unlock();
    bool ok = send_blast_complete_();
    if (ok) {
      state_ = State::WAITING_GAPS;
    }
    return;
  }
  ota_mutex_.unlock();
}

void ESPNowOTAManager::handle_accept_(const uint8_t *trailing, size_t trailing_len) {
  std::lock_guard<std::recursive_mutex> lock(ota_mutex_);
  if (trailing == nullptr || trailing_len < 4) {
    fail_transfer_(ESPNOW_FILE_ABORT_SEND_FAILURE, "malformed accept ack", true);
    return;
  }

  uint16_t negotiated_chunk_size = 0;
  std::memcpy(&negotiated_chunk_size, trailing, sizeof(negotiated_chunk_size));
  const uint8_t remote_buffer_kb = trailing[2];
  const uint8_t action = trailing[3];

  if (action != action_) {
    fail_transfer_(ESPNOW_FILE_ABORT_SEND_FAILURE, "accept ack action mismatch", true);
    return;
  }
  if (negotiated_chunk_size == 0 || negotiated_chunk_size > requested_chunk_size_) {
    fail_transfer_(ESPNOW_FILE_ABORT_SEND_FAILURE, "invalid negotiated chunk size", true);
    return;
  }
  if (remote_buffer_kb == 0) {
    fail_transfer_(ESPNOW_FILE_ABORT_SEND_FAILURE, "remote buffer_size_kb is 0", true);
    return;
  }

  negotiated_chunk_size_ = negotiated_chunk_size;

  uint16_t effective_kb = std::min<uint16_t>(remote_buffer_kb, ESPNOW_MAX_INCREMENT_KB);
  tracker_.buffer_size_kb = effective_kb;

  uint32_t increment_data_size = static_cast<uint32_t>(effective_kb) * 1024U;
  tracker_.chunks_per_increment = static_cast<uint16_t>(increment_data_size / negotiated_chunk_size_);
  if (tracker_.chunks_per_increment == 0) {
    tracker_.chunks_per_increment = 1;
  }

  tracker_.total_chunks = (file_size_ / negotiated_chunk_size_) +
                          ((file_size_ % negotiated_chunk_size_) != 0U ? 1U : 0U);
  tracker_.total_increments = (tracker_.total_chunks / tracker_.chunks_per_increment) +
                              ((tracker_.total_chunks % tracker_.chunks_per_increment) != 0U ? 1U : 0U);
  if (tracker_.total_increments == 0) {
    tracker_.total_increments = 1;
  }
  tracker_.chunks_in_last_increment = static_cast<uint16_t>(
      tracker_.total_chunks -
      static_cast<uint32_t>(tracker_.total_increments - 1U) * tracker_.chunks_per_increment);
  if (tracker_.chunks_in_last_increment == 0) {
    tracker_.chunks_in_last_increment = tracker_.chunks_per_increment;
  }

  tracker_.current_increment = 0;
  tracker_.retransmit_round = 0;
  tracker_.blast_complete_retries = 0;
  tracker_.blast_complete_tx_history.clear();
  tracker_.last_remote_activity_ms = millis();

  if (tracker_.total_chunks == 0) {
    fail_transfer_(ESPNOW_FILE_ABORT_SEND_FAILURE, "invalid negotiated geometry", true);
    return;
  }

  control_attempt_count_ = 0;
  progress_pct_ = 0;
  public_progress_pct_ = 0;
  public_state_ = "TRANSFERRING";
  state_ = State::BLASTING;

  request_increment_chunks_();

  ESP_LOGI(TAG, "Accepted OTA: chunk=%u buf_kb=%u cpi=%u total_inc=%u total_chunks=%u",
           static_cast<unsigned>(negotiated_chunk_size_), static_cast<unsigned>(tracker_.buffer_size_kb),
           static_cast<unsigned>(tracker_.chunks_per_increment),
           static_cast<unsigned>(tracker_.total_increments),
           static_cast<unsigned>(tracker_.total_chunks));
}

void ESPNowOTAManager::handle_gaps_ack_(const uint8_t *trailing, size_t trailing_len) {
  std::lock_guard<std::recursive_mutex> lock(ota_mutex_);
  if (trailing == nullptr || trailing_len < 2) {
    fail_transfer_(ESPNOW_FILE_ABORT_SEND_FAILURE, "malformed gaps ack", true);
    return;
  }

  uint16_t bitmap_len = 0;
  std::memcpy(&bitmap_len, trailing, sizeof(bitmap_len));
  const uint8_t *bitmap = trailing + 2;
  size_t expected_trailing = 2 + static_cast<size_t>(bitmap_len);

  if (trailing_len < expected_trailing) {
    fail_transfer_(ESPNOW_FILE_ABORT_SEND_FAILURE, "gaps ack trailing too short", true);
    return;
  }

  if (bitmap_len == 0) {
    ESP_LOGI(TAG, "INCREMENT_COMPLETE for increment %u - [%u%%]", static_cast<unsigned>(tracker_.current_increment),
             static_cast<unsigned>(progress_pct_));

    uint32_t inc_chunks = tracker_.increment_end_seq() - tracker_.increment_start_seq();
    uint64_t bytes_done = std::min<uint64_t>(
        file_size_,
        static_cast<uint64_t>(tracker_.current_increment + 1U) *
            static_cast<uint64_t>(tracker_.chunks_per_increment) * negotiated_chunk_size_);
    progress_pct_ = static_cast<uint8_t>(std::min<uint64_t>(100ULL, (bytes_done * 100ULL) / file_size_));
    if (progress_pct_ >= 100) progress_pct_ = 99;
    public_progress_pct_ = progress_pct_;

    if (tracker_.is_last_increment()) {
      ESP_LOGI(TAG, "Last increment complete, sending END");
      state_ = State::ENDING;
      control_attempt_count_ = 0;
      public_state_ = "VERIFYING";
      send_end_();
      return;
    }

    tracker_.blast_complete_retries = 0;
    tracker_.blast_complete_tx_history.clear();
    tracker_.retransmit_round = 0;
    tracker_.current_increment++;
    tracker_.requested_sequences.clear();
    tracker_.sent_sequences.clear();
    tracker_.gap_sequences.clear();

    state_ = State::BLASTING;
    request_increment_chunks_();

    ESP_LOGD(TAG, "Advancing to increment %u/%u", static_cast<unsigned>(tracker_.current_increment),
             static_cast<unsigned>(tracker_.total_increments));
    return;
  }

  if (tracker_.retransmit_round >= ESPNOW_MAX_RETRANSMIT_ROUNDS) {
    fail_transfer_(ESPNOW_FILE_ABORT_TIMEOUT, "retransmit rounds exceeded", true);
    return;
  }

  tracker_.gap_sequences.clear();
  uint16_t total_inc_chunks = tracker_.chunks_in_this_increment();

  for (uint16_t i = 0; i < total_inc_chunks; ++i) {
    size_t byte_idx = static_cast<size_t>(i) / 8U;
    uint8_t bit_mask = static_cast<uint8_t>(1U << (i % 8U));
    bool received = (byte_idx < static_cast<size_t>(bitmap_len)) && ((bitmap[byte_idx] & bit_mask) != 0);
    if (!received) {
      tracker_.gap_sequences.insert(
          static_cast<uint32_t>(tracker_.current_increment) * tracker_.chunks_per_increment + i);
    }
  }

  if (tracker_.gap_sequences.empty()) {
    tracker_.retransmit_round = 0;
    tracker_.blast_complete_retries = 0;
    tracker_.requested_sequences.clear();
    tracker_.sent_sequences.clear();
    tracker_.gap_sequences.clear();

    ESP_LOGI(TAG, "GAPS bitmap shows all chunks received, advancing increment %u",
             static_cast<unsigned>(tracker_.current_increment));

    tracker_.current_increment++;
    state_ = State::BLASTING;
    request_increment_chunks_();
    return;
  }

  ++tracker_.retransmit_round;
  tracker_.blast_complete_retries = 0;
  tracker_.blast_complete_tx_history.clear();

  ESP_LOGW(TAG, "GAPS in increment %u: %u missing chunks, retransmit round %u",
           static_cast<unsigned>(tracker_.current_increment),
           static_cast<unsigned>(tracker_.gap_sequences.size()),
           static_cast<unsigned>(tracker_.retransmit_round));

  tracker_.requested_sequences = tracker_.gap_sequences;
  tracker_.sent_sequences.clear();
  state_ = State::BLASTING;
}

void ESPNowOTAManager::handle_complete_(const uint8_t *trailing, size_t trailing_len) {
  if (trailing == nullptr || trailing_len < 2) {
    fail_transfer_(ESPNOW_FILE_ABORT_SEND_FAILURE, "malformed complete ack", false);
    return;
  }
  if (trailing[0] != action_) {
    fail_transfer_(ESPNOW_FILE_ABORT_SEND_FAILURE, "complete ack action mismatch", false);
    return;
  }

  const uint8_t result = trailing[1];
  if (result == ESPNOW_FILE_COMPLETE_SUCCESS) {
    progress_pct_ = 100;
    public_progress_pct_ = 100;
    public_busy_ = false;
    public_state_ = "SUCCESS";
    last_error_.clear();
    state_ = State::COMPLETE;
    reset_();
    return;
  }
  fail_transfer_(ESPNOW_FILE_ABORT_FLASH_ERROR, complete_result_to_string(result), false);
}

void ESPNowOTAManager::handle_reject_(const uint8_t *trailing, size_t trailing_len) {
  if (trailing == nullptr || trailing_len < 2) {
    fail_transfer_(ESPNOW_FILE_ABORT_SEND_FAILURE, "malformed reject ack", false);
    return;
  }
  fail_transfer_(ESPNOW_FILE_ABORT_SEND_FAILURE, reject_reason_to_string(trailing[1]), false);
}

void ESPNowOTAManager::handle_abort_ack_(const uint8_t *trailing, size_t trailing_len) {
  const uint8_t reason = (trailing != nullptr && trailing_len >= 1) ? trailing[0] : ESPNOW_FILE_ABORT_TIMEOUT;
  fail_transfer_(reason, abort_reason_to_string(reason), false);
}

void ESPNowOTAManager::fail_transfer_(uint8_t abort_reason, const std::string &message, bool notify_remote) {
  ESP_LOGW(TAG, "OTA transfer failed: reason=%u notify=%u msg=%s", static_cast<unsigned>(abort_reason),
           notify_remote ? 1U : 0U, message.c_str());
  last_error_ = message;
  public_busy_ = false;
  public_state_ = "FAIL";
  if (notify_remote && state_ != State::ABORTING) {
    state_ = State::ABORTING;
    send_abort_(abort_reason);
  }
  reset_();
}

void ESPNowOTAManager::reset_() {
  state_ = State::IDLE;
  tracker_.reset();
  pending_chunks_.clear();
  file_size_ = 0;
  transfer_started_ms_ = 0;
  last_activity_ms_ = 0;
  last_control_send_ms_ = 0;
  announce_tx_counter_ = 0;
  no_mem_backoff_until_ms_ = 0;
  last_chunk_send_ms_ = 0;
  requested_chunk_size_ = 0;
  negotiated_chunk_size_ = 0;
  action_ = 0;
  control_attempt_count_ = 0;
  progress_pct_ = 0;
  consecutive_no_mem_errors_ = 0;
  file_id_.clear();
  leaf_mac_.fill(0);
  md5_.fill(0);
}

void ESPNowOTAManager::mark_no_mem_backoff_() {
  ++consecutive_no_mem_errors_;
  const uint8_t shift = static_cast<uint8_t>(std::min<uint8_t>(consecutive_no_mem_errors_ - 1U, 7U));
  uint32_t backoff_ms = config_.no_mem_backoff_ms;
  if (shift > 0) {
    const uint64_t expanded = static_cast<uint64_t>(backoff_ms) << shift;
    backoff_ms = static_cast<uint32_t>(std::min<uint64_t>(expanded, config_.max_no_mem_backoff_ms));
  }
  no_mem_backoff_until_ms_ = millis() + std::min(backoff_ms, config_.max_no_mem_backoff_ms);
}

void ESPNowOTAManager::decay_no_mem_backoff_() {
  if (consecutive_no_mem_errors_ > 0) {
    consecutive_no_mem_errors_ /= 2;
    if (consecutive_no_mem_errors_ == 0) {
      no_mem_backoff_until_ms_ = 0;
    }
  }
}

void ESPNowOTAManager::clear_no_mem_backoff_() {
  consecutive_no_mem_errors_ = 0;
  no_mem_backoff_until_ms_ = 0;
}

bool ESPNowOTAManager::target_reachable_() const {
  return target_reachable_fn_ == nullptr || target_reachable_fn_(leaf_mac_.data());
}

size_t ESPNowOTAManager::expected_chunk_len_(uint32_t sequence) const {
  if (negotiated_chunk_size_ == 0 || sequence >= tracker_.total_chunks) {
    return 0;
  }
  const uint64_t offset = static_cast<uint64_t>(sequence) * negotiated_chunk_size_;
  if (offset >= file_size_) {
    return 0;
  }
  const uint64_t remaining = static_cast<uint64_t>(file_size_) - offset;
  return static_cast<size_t>(std::min<uint64_t>(remaining, negotiated_chunk_size_));
}

uint16_t ESPNowOTAManager::clamp_chunk_size_(uint16_t remote_max_frame_payload) const {
  if (remote_max_frame_payload <= ESPNOW_FILE_DATA_HEADER_OVERHEAD) {
    return 0;
  }
  return static_cast<uint16_t>(remote_max_frame_payload - ESPNOW_FILE_DATA_HEADER_OVERHEAD);
}

bool ESPNowOTAManager::same_leaf_(const uint8_t *leaf_mac) const {
  return leaf_mac != nullptr && std::memcmp(leaf_mac_.data(), leaf_mac, leaf_mac_.size()) == 0;
}

std::string ESPNowOTAManager::escape_json_(const std::string &value) const {
  std::string escaped;
  escaped.reserve(value.size());
  for (char ch : value) {
    if (ch == '\\' || ch == '"') {
      escaped.push_back('\\');
    }
    escaped.push_back(ch);
  }
  return escaped;
}

std::string ESPNowOTAManager::format_mac_(const std::array<uint8_t, 6> &mac) const {
  char buffer[18] = {0};
  std::snprintf(buffer, sizeof(buffer), "%02X:%02X:%02X:%02X:%02X:%02X", mac[0], mac[1], mac[2], mac[3], mac[4],
                mac[5]);
  return buffer;
}

}  // namespace esp_tree
}  // namespace esphome
