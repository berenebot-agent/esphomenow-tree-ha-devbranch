#pragma once

#include "esp_tree_common/espnow_types.h"

#include <esp_idf_version.h>
#include <esp_now.h>

#include <array>
#include <atomic>

#include <cstdint>
#include <deque>
#include <functional>
#include <map>
#include <string>
#include <vector>

#include "esphome/core/hal.h"

namespace esphome {
namespace esp_tree {

using BridgeEntitySchema = espnow_entity_schema_t;

struct BridgeIdentity {
  uint32_t chip_model{0};
  uint32_t firmware_epoch{0};
  std::string build_date;
  std::string build_time;
  std::string project_name;
  std::string project_version;
  std::array<uint8_t, 16> firmware_md5{};
};

struct BridgeSession {
  std::array<uint8_t, 6> leaf_mac{};
  std::array<uint8_t, 6> parent_mac{};
  std::array<uint8_t, 32> session_key{};
  std::array<uint8_t, 16> bridge_nonce{};
  std::array<uint8_t, 16> remote_nonce{};
  std::array<uint8_t, 32> schema_hash{};
  std::array<uint8_t, 6> next_hop_mac{};
  uint32_t last_seen_counter{0};
  uint32_t tx_counter{1};
  uint32_t last_seen_bridge_uptime_s{0};
  uint32_t discover_stuck_since_ms{0};
  uint32_t discover_announce_deadline_ms{0};
  std::array<uint8_t, 6> discover_announce_leaf_mac{};
  uint32_t joined_ms{0};
  uint32_t expected_contact_interval_s{0};
  uint32_t uptime_seconds{0};
  uint8_t hops_to_bridge{0};
  uint8_t last_reported_hops_to_bridge{0};
  uint8_t total_entities{0};
  uint16_t session_max_payload{ESPNOW_V1_MAX_PAYLOAD};
  uint16_t max_entity_fragment{ESPNOW_MAX_ENTITY_FRAGMENT_LEN};
  uint16_t max_assembly_bytes{ESPNOW_MAX_FRAGMENT_ASSEMBLY_BYTES};
  uint16_t max_total_fragment_bytes{ESPNOW_MAX_TOTAL_FRAGMENT_BYTES_PER_SESSION};
  uint8_t leaf_session_flags{0};
  std::array<uint8_t, 16> firmware_md5{};
  void update_from_mtu() {
    max_entity_fragment = espnow_max_entity_fragment(session_max_payload);
    max_assembly_bytes = espnow_max_assembly_bytes(session_max_payload);
    max_total_fragment_bytes = espnow_max_total_fragment_bytes(session_max_payload);
  }
  uint32_t chip_model{0};
  uint8_t pending_schema_index{0xFF};
  uint8_t pending_schema_descriptor_type{ESPNOW_DESCRIPTOR_TYPE_ENTITY};
  uint8_t schema_request_retries{0};
  uint8_t join_complete_retry_count{0};
  uint8_t direct_child_count{0};
  uint16_t total_child_count{0};
  int8_t last_rssi{-128};
  uint32_t rx_packets{0};
  uint32_t tx_packets{0};
  uint32_t last_schema_request_ms{0};
  uint32_t last_join_complete_ms{0};
  uint32_t last_completed_state_message_tx_base{0};
  std::atomic<bool> session_key_valid{false};
  std::atomic<bool> bridge_nonce_valid{false};
  std::atomic<bool> remote_nonce_valid{false};
  std::atomic<bool> online{false};
  espnow_log_state_t remote_state{espnow_log_state_t::NONE};
  std::atomic<bool> schema_received{false};
  std::atomic<bool> schema_request_in_flight{false};
  std::atomic<bool> awaiting_discovery_confirm{false};
  uint8_t pending_schema_request_index{0xFF};
  uint32_t last_discovery_confirm_ms{0};
  std::atomic<bool> join_complete_pending{false};
  std::atomic<bool> state_sync_pending{false};
  bool awaiting_more_dirty_{true};
  std::atomic<bool> join_in_progress_{false};
  uint8_t pending_discovery_count_{0};
  bool discovery_all_confirmed_{false};
  std::string esphome_name;
  std::string node_label;
  uint32_t firmware_epoch{0};
  std::string build_date;
  std::string build_time;
  std::string project_name;
  std::string project_version;
  std::string mac_hex_key;
  std::string parent_mac_hex_key;
  std::string last_offline_reason;
  std::vector<BridgeEntitySchema> schema_entities;
  using BridgeFragmentAssembly = espnow_fragment_assembly_t;
  std::map<uint8_t, BridgeFragmentAssembly> pending_state_assemblies;
  std::map<uint8_t, BridgeFragmentAssembly> pending_schema_assemblies;
  size_t state_reserved_bytes_{0};
  size_t schema_reserved_bytes_{0};
};

struct CachedSessionData {
  std::vector<BridgeEntitySchema> schema_entities;
  std::string esphome_name;
  std::string node_label;
  uint32_t firmware_epoch{0};
  std::string build_date;
  std::string build_time;
  std::string project_name;
  std::string project_version;
  uint16_t session_max_payload{ESPNOW_V1_MAX_PAYLOAD};
  uint32_t chip_model{0};
  std::array<uint8_t, 16> firmware_md5{};
};

struct ConfigAckResult {
  bool acked{false};
  bool timed_out{false};
  bool no_session{false};
  uint8_t result{CFG_RESULT_REJECTED};
  uint8_t command_echo{0};
};

class BridgeProtocol {
 public:
  using send_fn_t = std::function<bool(const uint8_t *mac, const uint8_t *frame, size_t frame_len)>;
  using publish_state_fn_t = std::function<void(const uint8_t *mac, const BridgeEntitySchema &entity,
                                                const std::vector<uint8_t> &value,
                                                espnow_field_type_t type,
                                                const std::string &text_value,
                                                uint32_t message_tx_base,
                                                const uint8_t *next_hop_mac)>;
  using publish_discovery_fn_t = std::function<void(const uint8_t *mac,
                                                    const BridgeEntitySchema &entity,
                                                    uint8_t total_entities,
                                                    bool is_commandable)>;
  using publish_availability_fn_t = std::function<void(const uint8_t *mac, bool online, const char *reason)>;
  using publish_topology_changed_fn_t = std::function<void(const uint8_t *mac, const char *reason)>;
  using publish_bridge_diag_fn_t = std::function<void(uint32_t uptime_s, uint8_t nodes_online)>;
  using clear_entities_fn_t = std::function<void(const uint8_t *mac, const std::vector<BridgeEntitySchema> &old_entities)>;
  using schema_complete_fn_t = std::function<void(const uint8_t *mac, uint8_t total_entities)>;
  using file_ack_fn_t = std::function<bool(const uint8_t *leaf_mac, const espnow_ack_t &ack_header,
                                            const uint8_t *trailing, size_t trailing_len)>;
  using send_err_fn_t = std::function<esp_err_t(const uint8_t *mac, const uint8_t *frame, size_t frame_len)>;
  using send_ota_frame_fn_t = std::function<esp_err_t(const uint8_t *leaf_mac, espnow_packet_type_t type,
                                                      const uint8_t *payload, size_t len,
                                                      uint32_t *tx_counter_out)>;
  using request_fingerprint_t = std::array<uint8_t, 4>;
  using config_ack_fn_t = std::function<void(const ConfigAckResult &result)>;

  BridgeProtocol();

  int init(const char *psk_hex, const char *network_id, uint16_t heartbeat_interval = 60);
  void set_runtime_ready(bool ready) { runtime_ready_ = ready; }
  void set_bridge_mac(const uint8_t *mac);
  void set_session_flags(uint8_t flags) { bridge_session_flags_ = flags; }
  uint8_t bridge_session_flags() const { return bridge_session_flags_; }
  void set_send_fn(send_fn_t fn);
  void set_publish_state_fn(publish_state_fn_t fn);
  void set_publish_discovery_fn(publish_discovery_fn_t fn);
  void set_publish_availability_fn(publish_availability_fn_t fn);
  void set_publish_topology_changed_fn(publish_topology_changed_fn_t fn);
  void set_publish_bridge_diag_fn(publish_bridge_diag_fn_t fn);
  void set_clear_entities_fn(clear_entities_fn_t fn);
  void set_schema_complete_fn(schema_complete_fn_t fn);
  void set_file_ack_fn(file_ack_fn_t fn);
  void set_send_err_fn(send_err_fn_t fn);
  void set_send_ota_frame_fn(send_ota_frame_fn_t fn);
  void set_bridge_identity(uint32_t chip_model, uint32_t firmware_epoch, const std::string &build_date,
                           const std::string &build_time, const std::string &project_name,
                           const std::string &project_version, const std::array<uint8_t, 16> &firmware_md5);
  const BridgeIdentity &bridge_identity() const { return bridge_identity_; }

  bool on_espnow_frame(const uint8_t *sender_mac, const uint8_t *data, size_t len, int8_t rssi);
  void loop();
  void flush_log_queue();
  void on_discovery_confirmed_(const uint8_t *mac, uint8_t entity_index, bool success);
  void publish_all_entities_(BridgeSession &session);
  void publish_discovery_for_entity_(BridgeSession &session, uint8_t entity_index);
  bool confirm_state_delivery_(const uint8_t *leaf_mac, uint8_t entity_index, uint32_t message_tx_base,
                               const uint8_t *next_hop_mac);
  esp_err_t send_ota_frame(const uint8_t *leaf_mac, espnow_packet_type_t type,
                            const uint8_t *payload, size_t len, uint32_t *tx_counter_out);
  bool send_command_to_leaf(const uint8_t *leaf_mac, uint8_t field_index, const std::vector<uint8_t> &value);
  bool send_config_to_leaf(const uint8_t *leaf_mac, uint8_t command,
                           const uint8_t *payload, size_t payload_len,
                           config_ack_fn_t callback = nullptr);

  BridgeSession *get_session(const uint8_t *leaf_mac);
  const BridgeSession *get_session(const uint8_t *leaf_mac) const;
  uint8_t get_active_remote_count() const;
  uint8_t get_direct_remote_count() const;
  const std::map<uint64_t, BridgeSession> &get_sessions() const { return sessions_; }
  const std::map<std::string, CachedSessionData> &get_schema_cache() const { return schema_cache_; }
  const std::map<std::string, std::array<uint8_t, 32>> &get_schema_hash_cache() const { return schema_hash_cache_; }
  void invalidate_all_sessions();

 private:
  bool parse_frame_(const uint8_t *sender_mac, const uint8_t *frame, size_t len, espnow_frame_header_t &header, const uint8_t *&payload,
                    size_t &payload_len, const uint8_t *&session_tag, uint8_t parent_mac[6]) const;
  bool handle_discover_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                           size_t payload_len, int8_t rssi, const uint8_t *session_tag);
  bool handle_join_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                      size_t payload_len, int8_t rssi, const uint8_t *session_tag);
  bool handle_schema_push_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                           size_t payload_len, int8_t rssi, const uint8_t *session_tag);
  bool handle_state_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                      size_t payload_len, int8_t rssi, const uint8_t *session_tag);
  bool handle_heartbeat_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                           size_t payload_len, int8_t rssi, const uint8_t *session_tag);
  bool handle_ack_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                   size_t payload_len, int8_t rssi, const uint8_t *session_tag);
  bool handle_deauth_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                      size_t payload_len, int8_t rssi);
  bool handle_schema_request_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                              size_t payload_len, int8_t rssi);

 public:
  bool log_dropped_(const char *handler_name, const uint8_t *mac);

  void fill_discover_announce_(espnow_discover_announce_t &announce, uint8_t hops_to_bridge) const;
  bool send_discover_announce_(const uint8_t *sender_mac, const uint8_t leaf_mac[6], uint8_t hops_to_bridge);
  bool send_join_ack_(const uint8_t *sender_mac, BridgeSession &session, uint8_t accepted, uint8_t reason,
                      uint8_t schema_status);
  bool send_join_complete_(const uint8_t *sender_mac, BridgeSession &session, bool reset_retry_state = true);
  void check_and_complete_join_(const uint8_t *leaf_mac);
  bool get_joining_leaf_mac(uint8_t *mac_out) const;
  bool get_joining_in_progress() const { return joining_in_progress_; }
  bool send_state_ack_(const uint8_t *sender_mac, BridgeSession &session, uint32_t rx_counter, uint8_t result);
  bool send_command_ack_(const uint8_t *sender_mac, BridgeSession &session, uint8_t field_index, uint8_t result);
  bool send_schema_request_(const uint8_t *sender_mac, BridgeSession &session, uint8_t descriptor_type,
                            uint8_t descriptor_index);
  bool send_command_(const uint8_t *sender_mac, BridgeSession &session, uint8_t field_index,
                     const std::vector<uint8_t> &value, bool reset_retry_state = true);
  bool send_command_fragments_(const uint8_t *sender_mac, BridgeSession &session, uint8_t field_index,
                               const std::vector<uint8_t> &value, uint32_t tx_base, bool consume_tx_counter,
                               uint8_t retry_count = 0);
  bool send_deauth_(const uint8_t *sender_mac, BridgeSession &session, uint8_t response_type, uint32_t response_tx,
                    const uint8_t *request_payload, size_t request_payload_len);
  request_fingerprint_t compute_request_fingerprint_(uint8_t response_type, uint32_t response_tx,
                                                     const uint8_t *request_payload, size_t request_payload_len) const;

  bool send_encrypted_(const uint8_t *sender_mac, BridgeSession &session, espnow_packet_type_t type,
                        uint8_t hop_count, const uint8_t *plaintext, size_t plaintext_len,
                        uint8_t ack_type = 0);
  esp_err_t send_encrypted_with_tx_counter_result_(const uint8_t *sender_mac, BridgeSession &session,
                                                   espnow_packet_type_t type, uint8_t hop_count,
                                                   uint32_t tx_counter, const uint8_t *plaintext,
                                                   size_t plaintext_len);
  bool send_encrypted_with_tx_counter_(const uint8_t *sender_mac, BridgeSession &session, espnow_packet_type_t type,
                                       uint8_t hop_count, uint32_t tx_counter, const uint8_t *plaintext,
                                       size_t plaintext_len);
  bool send_plain_psk_(const uint8_t *sender_mac, const uint8_t leaf_mac[6], espnow_packet_type_t type,
                       uint8_t hop_count, uint32_t tx_counter, const uint8_t *payload, size_t payload_len);

  void mark_online_(BridgeSession &session, int8_t rssi, uint32_t tx_counter, int8_t remote_reported_rssi = 0);
  BridgeSession *ensure_session_(const uint8_t *leaf_mac);
  void refresh_schema_cache_(BridgeSession &session);
  bool validate_session_packet_(const uint8_t *sender_mac, BridgeSession &session, const espnow_frame_header_t &header, const uint8_t *ciphertext,
                                size_t ciphertext_len, const uint8_t *session_tag, std::vector<uint8_t> &plaintext);
  uint64_t mac_to_key_(const uint8_t *mac) const;
  std::string schema_cache_key_(const BridgeSession &session) const;
  void queue_log_(bool tx, espnow_packet_type_t type, const uint8_t *mac, uint16_t length, int8_t rssi,
                   bool show_channel = false, uint8_t ch = 0,
                   bool show_entity = false, uint8_t entity_idx = 0, uint8_t entity_tot = 0,
                   uint8_t chunk_idx = 0, uint8_t chunk_tot = 0, uint8_t retry_count = 0, uint32_t pkt_uid = 0,
                   bool show_ack_type = false, uint8_t ack_type = 0,
                   bool parent_check = false);
  void queue_state_log_(espnow_log_state_t state, const char *fmt, ...);

  std::array<PacketLogEntry, PACKET_LOG_SIZE> log_queue_{};
  size_t log_head_{0};
  size_t log_tail_{0};
  size_t log_count_{0};

  espnow_log_state_t pending_state_{espnow_log_state_t::NONE};
  char pending_state_log_msg_[96]{0};

  std::string network_id_;
  uint16_t heartbeat_interval_{ESPNOW_HEARTBEAT_INTERVAL_S};
  std::array<uint8_t, 32> psk_{};
  bool psk_valid_{false};
  std::array<uint8_t, 6> bridge_mac_{};
  bool bridge_mac_valid_{false};
  std::array<uint8_t, 16> bridge_nonce_{};
  bool bridge_nonce_ready_{false};
  bool runtime_ready_{false};
  bool joining_in_progress_{false};
  std::array<uint8_t, 6> joining_leaf_mac_{};
  uint32_t join_started_ms_{0};
  std::map<uint64_t, BridgeSession> sessions_;
  std::map<std::string, CachedSessionData> schema_cache_;
  std::map<std::string, std::array<uint8_t, 32>> schema_hash_cache_;
  uint32_t bridge_uptime_s_{0};
  uint32_t last_diag_publish_ms_{0};
  uint32_t last_uptime_tick_ms_{0};
  uint32_t last_session_cleanup_ms_{0};
  uint8_t last_diag_online_count_{0xFF};
  uint8_t bridge_session_flags_{0};
  BridgeIdentity bridge_identity_{};
  static constexpr uint32_t DIAG_PUBLISH_INTERVAL_MS{10000};
  static constexpr uint32_t OFFLINE_TIMEOUT_GRACE_MS{5000};
  static constexpr size_t MAX_SESSIONS{128};
  static constexpr uint32_t SESSION_CLEANUP_INTERVAL_MS{60000};
  static constexpr float RAM_WARNING_PCT{0.20f};
  static constexpr float RAM_CRITICAL_PCT{0.10f};
  static constexpr uint32_t RAM_EVICTION_BUFFER_BYTES{10240};
  static constexpr uint32_t MIN_SESSIONS_TO_PROTECT{8};
  send_fn_t send_fn_;
  publish_state_fn_t publish_state_fn_;
  publish_discovery_fn_t publish_discovery_fn_;
  publish_availability_fn_t publish_availability_fn_;
  publish_topology_changed_fn_t publish_topology_changed_fn_;
  publish_bridge_diag_fn_t publish_bridge_diag_fn_;
  clear_entities_fn_t clear_entities_fn_;
  schema_complete_fn_t schema_complete_fn_;
  file_ack_fn_t file_ack_fn_;
  send_err_fn_t send_err_fn_;
  send_ota_frame_fn_t send_ota_frame_fn_;

  // Command retry tracking (mirrors STATE retry on remote)
  struct PendingCommand {
    uint8_t field_index{0};
    std::vector<uint8_t> value;
    std::array<uint8_t, 6> leaf_mac{};
    std::array<uint8_t, 6> next_hop_mac{};
    uint32_t tx_base{0};
    uint32_t last_tx_ms{0};
    uint8_t retry_count{0};
  };
  std::deque<PendingCommand> command_queue_;
  static constexpr uint32_t COMMAND_RETRY_INTERVAL_MS{ESPNOW_RETRY_INTERVAL_MS};
  static constexpr uint8_t COMMAND_MAX_RETRIES{ESPNOW_MAX_RETRIES};

  struct PendingConfig {
    std::array<uint8_t, 6> leaf_mac{};
    std::array<uint8_t, 6> next_hop_mac{};
    uint8_t command{0};
    std::vector<uint8_t> payload;
    uint32_t tx_base{0};
    uint8_t retry_count{0};
    uint32_t next_retry_ms{0};
    uint32_t ack_timeout_ms{500};
    config_ack_fn_t callback;
  };
  std::vector<PendingConfig> pending_configs_;
  static constexpr uint32_t CONFIG_ACK_TIMEOUT_MS{500};
  static constexpr uint8_t CONFIG_MAX_RETRIES{3};

  bool send_config_frame_(BridgeSession &session, const PendingConfig &pending, uint8_t retry_count);

  bool evict_sessions_for_ram_(bool aggressive);
};

}  // namespace esp_tree
}  // namespace esphome
