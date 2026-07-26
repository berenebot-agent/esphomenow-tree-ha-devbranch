#pragma once

#include "esp_tree_common/espnow_types.h"
#include "esphome/components/md5/md5.h"

#include <array>
#include <cstddef>
#include <cstdint>
#include <functional>
#include <map>
#include <memory>
#include <vector>

#ifdef USE_ESP8266
#include "esphome/components/ota/ota_backend_esp8266.h"
#endif

#if !defined(USE_ESP8266)
#include <esp_ota_ops.h>
#include <esp_partition.h>
#else
struct esp_partition_t {
  size_t size{0};
};

using esp_ota_handle_t = uintptr_t;
#endif

namespace esphome {
namespace esp_tree {

struct IncrementBuffer {
  std::vector<uint8_t> data;
  std::vector<uint8_t> received_bitmap;
  uint16_t chunks_received{0};
  uint16_t chunks_expected{0};

  void reset(uint16_t num_chunks, uint32_t data_size);
  bool is_complete() const { return chunks_received == chunks_expected; }
  bool is_chunk_received(uint16_t chunk_in_increment) const;
  void mark_chunk_received(uint16_t chunk_in_increment);
};

class FileReceiver {
 public:
  struct AnnounceResponse {
    bool accepted{false};
    uint8_t reject_reason{ESPNOW_FILE_REJECT_UNSUPPORTED};
    uint16_t negotiated_chunk_size{0};
  };

  struct ChunkResponse {
    bool accepted{true};
    uint8_t abort_reason{ESPNOW_FILE_ABORT_FLASH_ERROR};
  };

  class ActionHandler {
   public:
    virtual ~ActionHandler() = default;
    virtual AnnounceResponse on_announce(uint32_t file_size, const uint8_t md5[16],
                                         uint16_t chunk_size, uint8_t action,
                                         const char *file_id, uint16_t &buffer_size_kb) = 0;
    virtual ChunkResponse on_data(uint32_t sequence,
                                  const uint8_t *data, size_t len) = 0;
    virtual uint8_t on_end() = 0;
    virtual void on_abort(uint8_t reason) = 0;
    virtual bool is_receiving() const = 0;
    virtual bool wants_restart_after_complete() const { return false; }
  };

  class OTAFlashHandler : public ActionHandler {
   public:
    OTAFlashHandler() = default;

    AnnounceResponse on_announce(uint32_t file_size, const uint8_t md5[16],
                                 uint16_t chunk_size, uint8_t action,
                                 const char *file_id, uint16_t &buffer_size_kb) override;
    ChunkResponse on_data(uint32_t sequence,
                          const uint8_t *data, size_t len) override;
    uint8_t on_end() override;
    void on_abort(uint8_t reason) override;
    bool is_receiving() const override { return state_ != State::IDLE; }
    bool wants_restart_after_complete() const override { return restart_requested_; }
    void set_max_chunk_size(uint16_t max_chunk) { max_chunk_size_ = max_chunk; }

   private:
    enum class State : uint8_t {
      IDLE = 0,
      RECEIVING,
      VERIFYING,
    };

    void reset_state_();
    bool begin_md5_();
    bool update_md5_(const uint8_t *data, size_t len);
    bool finish_md5_(uint8_t out[16]);

    State state_{State::IDLE};
    uint32_t file_size_{0};
    std::array<uint8_t, 16> expected_md5_{};
    uint16_t chunk_size_{0};
    uint16_t max_chunk_size_{ESPNOW_FILE_DEFAULT_CHUNK_SIZE};
    uint32_t total_written_{0};
    bool restart_requested_{false};

    esphome::md5::MD5Digest md5_digest_{};
    bool md5_active_{false};
#ifdef USE_ESP8266
    std::unique_ptr<esphome::ota::ESP8266OTABackend> backend_;
#endif
    const esp_partition_t *update_partition_{nullptr};
    esp_ota_handle_t ota_handle_{0};
  };

  using send_ack_fn_t = std::function<bool(const uint8_t *payload, size_t len)>;

  FileReceiver();

  void set_send_ack_fn(send_ack_fn_t fn) { send_ack_fn_ = std::move(fn); }
  void set_announce_tx_counter(uint32_t tx_counter) { announce_tx_counter_ = tx_counter; }
  void set_blast_complete_tx_counter(uint32_t tx_counter) { last_blast_complete_tx_counter_ = tx_counter; }
  void set_local_mac(const uint8_t *mac);
  void set_ota_enabled(bool enabled) { ota_enabled_ = enabled; }
  void set_deep_sleep_active(bool active) { deep_sleep_active_ = active; }
  void set_max_chunk_size(uint16_t max_chunk);

  void register_handler(uint8_t action, ActionHandler *handler);

  bool handle_file_transfer(const uint8_t *payload, size_t len);
  bool handle_file_data(const uint8_t *payload, size_t len);
  void loop();
  void abort(uint8_t reason, bool notify_sender = true);

  bool is_receiving() const { return state_ != State::IDLE; }

 private:
  enum class State : uint8_t {
    IDLE = 0,
    ANNOUNCED,
    RECEIVING,
    CHECKING,
    WRITING,
    WAITING_END,
    VERIFYING,
    COMPLETE,
  };

  bool handle_announce_(const espnow_file_announce_t &announce);
  bool handle_blast_complete_(const espnow_file_blast_complete_t &bc);
  bool handle_end_(const espnow_file_end_t &end_packet);
  bool handle_abort_(const espnow_file_abort_t &abort_packet);
  bool send_ack_(uint8_t result, const uint8_t *trailing, size_t trailing_len);
  bool send_ack_accept_(uint16_t chunk_size, uint8_t action, uint16_t buffer_size_kb);
  bool send_ack_reject_(uint8_t action, uint8_t reason);
  bool send_gaps_ack_(const uint8_t *bitmap, size_t bitmap_len);
  bool send_ack_complete_(uint8_t action, uint8_t result);
  bool send_ack_abort_(uint8_t reason);
  bool write_increment_to_flash_();
  void compute_increment_geometry_();
  uint16_t chunks_in_increment_(uint16_t increment_index) const;
  size_t expected_chunk_len_(uint32_t sequence) const;
  void reset_();
  void schedule_restart_();
  void perform_restart_if_due_();

  State state_{State::IDLE};
  ActionHandler *active_handler_{nullptr};
  std::map<uint8_t, ActionHandler *> handlers_;
  OTAFlashHandler ota_flash_handler_{};

  IncrementBuffer increment_buf_;

  uint32_t file_size_{0};
  uint16_t chunk_payload_size_{0};
  uint16_t buffer_size_kb_{ESPNOW_MAX_INCREMENT_KB};
  uint16_t chunks_per_increment_{0};
  uint16_t total_increments_{0};
  uint16_t chunks_in_last_increment_{0};
  uint16_t current_increment_{0};
  uint32_t total_chunks_{0};
  uint8_t action_{0};
  uint8_t file_id_[12]{};
  uint8_t last_announce_md5_[16]{};
  uint32_t announce_tx_counter_{0};

  uint32_t last_activity_ms_{0};
  uint32_t last_blast_complete_tx_counter_{0};
  uint8_t retransmit_round_{0};
  bool increment_written_{false};

  std::array<uint8_t, 6> local_mac_{};
  send_ack_fn_t send_ack_fn_;
  bool ota_enabled_{false};
  bool deep_sleep_active_{false};
  uint16_t max_chunk_size_{ESPNOW_FILE_DEFAULT_CHUNK_SIZE};
  bool restart_pending_{false};
  uint32_t restart_due_ms_{0};
  bool in_complete_phase_{false};
  uint8_t complete_action_{0};
  uint8_t complete_result_{0};
  int8_t complete_ack_remaining_{0};
  uint32_t next_complete_ack_ms_{0};
};

}  // namespace esp_tree
}  // namespace esphome
