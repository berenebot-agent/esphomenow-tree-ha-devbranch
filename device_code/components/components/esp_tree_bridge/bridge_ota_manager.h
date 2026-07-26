#pragma once

#include "esp_tree_common/espnow_types.h"

#include <esp_err.h>

#include <array>
#include <cstddef>
#include <cstdint>
#include <deque>
#include <functional>
#include <mutex>
#include <set>
#include <string>
#include <vector>

namespace esphome {
namespace esp_tree {

class ESPNowOTAManager {
 public:
  struct Config {
    uint32_t global_timeout_ms{900000};
    uint32_t no_mem_backoff_ms{5};
    uint32_t max_no_mem_backoff_ms{250};
    uint32_t tx_cooldown_ms{2};
  };

  struct IncrementTracker {
    uint16_t current_increment{0};
    uint16_t total_increments{0};
    uint16_t chunks_per_increment{0};
    uint16_t chunks_in_last_increment{0};
    uint32_t total_chunks{0};
    uint16_t buffer_size_kb{ESPNOW_MAX_INCREMENT_KB};

    uint8_t retransmit_round{0};
    uint8_t blast_complete_retries{0};
    uint32_t blast_complete_sent_ms{0};
    uint32_t last_blast_complete_tx_counter{0};
    std::vector<uint32_t> blast_complete_tx_history;

    std::vector<uint8_t> received_bitmap;
    std::set<uint32_t> gap_sequences;
    std::set<uint32_t> requested_sequences;
    std::set<uint32_t> sent_sequences;

    uint32_t last_remote_activity_ms{0};

    void reset();
    bool is_last_increment() const { return current_increment + 1U >= total_increments; }
    uint16_t chunks_in_this_increment() const;
    uint32_t increment_start_seq() const;
    uint32_t increment_end_seq() const;
  };

  using send_frame_fn_t = std::function<esp_err_t(const uint8_t *leaf_mac, espnow_packet_type_t type,
                                                  const uint8_t *payload, size_t len,
                                                  uint32_t *tx_counter_out)>;
  using target_reachable_fn_t = std::function<bool(const uint8_t *leaf_mac)>;

  ESPNowOTAManager();
  explicit ESPNowOTAManager(Config config);

  void set_send_frame_fn(send_frame_fn_t fn) { send_frame_fn_ = std::move(fn); }
  void set_target_reachable_fn(target_reachable_fn_t fn) { target_reachable_fn_ = std::move(fn); }

  bool start_transfer(const uint8_t *leaf_mac, uint32_t file_size, const uint8_t md5[16], uint8_t action,
                       uint16_t remote_max_frame_payload, const char *file_id = "ota.bin");

  bool on_source_chunk(uint32_t sequence, const uint8_t *data, size_t len);
  void on_source_abort(uint8_t reason = ESPNOW_FILE_ABORT_USER);
  bool on_file_ack(const uint8_t *leaf_mac, const espnow_ack_t &ack_header, const uint8_t *trailing,
                   size_t trailing_len);
  void loop();
  std::string status_json() const;

  bool is_busy() const { return state_ != State::IDLE; }
  const std::string &last_error() const { return last_error_; }
  const IncrementTracker &increment_tracker() const { return tracker_; }
  uint16_t chunk_size() const { return negotiated_chunk_size_; }
  uint32_t file_size() const { return file_size_; }
  uint32_t total_chunks() const { return tracker_.total_chunks; }
  const std::string &public_state() const { return public_state_; }
  std::set<uint32_t> requested_sequences() const {
    std::lock_guard<std::recursive_mutex> lock(ota_mutex_);
    return tracker_.requested_sequences;
  }
  uint16_t buffer_size_kb() const { return tracker_.buffer_size_kb; }
  uint16_t current_increment() const { return tracker_.current_increment; }
  uint16_t total_increments() const { return tracker_.total_increments; }
  uint8_t retransmit_round() const { return tracker_.retransmit_round; }
  uint8_t progress_pct() const { return public_progress_pct_; }

 private:
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

  bool send_announce_();
  bool send_blast_complete_();
  bool send_end_();
  bool send_abort_(uint8_t reason);
  bool send_chunk_(uint32_t sequence, const uint8_t *data, size_t len);
  void request_increment_chunks_();
  void pump_blasting_();
  void pump_queued_chunks_();
  void handle_accept_(const uint8_t *trailing, size_t trailing_len);
  void handle_gaps_ack_(const uint8_t *trailing, size_t trailing_len);
  void handle_complete_(const uint8_t *trailing, size_t trailing_len);
  void handle_reject_(const uint8_t *trailing, size_t trailing_len);
  void handle_abort_ack_(const uint8_t *trailing, size_t trailing_len);
  void fail_transfer_(uint8_t abort_reason, const std::string &message, bool notify_remote);
  void reset_();
  size_t expected_chunk_len_(uint32_t sequence) const;
  uint16_t clamp_chunk_size_(uint16_t remote_max_frame_payload) const;
  bool same_leaf_(const uint8_t *leaf_mac) const;
  std::string escape_json_(const std::string &value) const;

  Config config_{};
  send_frame_fn_t send_frame_fn_;
  target_reachable_fn_t target_reachable_fn_;

  State state_{State::IDLE};
  IncrementTracker tracker_{};

  std::array<uint8_t, 6> leaf_mac_{};
  std::array<uint8_t, 16> md5_{};
  std::string file_id_;
  std::string last_error_;

  uint32_t file_size_{0};
  uint32_t transfer_started_ms_{0};
  uint32_t last_activity_ms_{0};
  uint32_t last_control_send_ms_{0};
  uint32_t announce_tx_counter_{0};
  uint32_t no_mem_backoff_until_ms_{0};
  uint32_t last_chunk_send_ms_{0};
  uint16_t requested_chunk_size_{0};
  uint16_t negotiated_chunk_size_{0};
  uint16_t max_encrypted_plaintext_{0};
  uint8_t action_{0};
  uint8_t control_attempt_count_{0};
  uint8_t progress_pct_{0};
  uint8_t consecutive_no_mem_errors_{0};
  bool public_busy_{false};
  uint8_t public_progress_pct_{0};
  std::string public_state_{"IDLE"};
  std::array<uint8_t, 6> status_leaf_mac_{};

  struct QueuedChunk {
    uint32_t sequence;
    std::vector<uint8_t> data;
  };
  std::deque<QueuedChunk> pending_chunks_{};

  mutable std::recursive_mutex ota_mutex_;

  void mark_no_mem_backoff_();
  void decay_no_mem_backoff_();
  void clear_no_mem_backoff_();
  bool target_reachable_() const;
  std::string format_mac_(const std::array<uint8_t, 6> &mac) const;
};

using BridgeFileManager = ESPNowOTAManager;

}  // namespace esp_tree
}  // namespace esphome
