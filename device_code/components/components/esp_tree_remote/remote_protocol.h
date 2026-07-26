#pragma once

#include "remote_file_receiver.h"
#include "esp_tree_common/espnow_crypto.h"
#include "esp_tree_common/espnow_types.h"
#include "esp_tree_common/espnow_mac_utils.h"

#include <array>
#include <atomic>
#include <cstddef>
#include <cstdint>
#include <functional>
#include <map>
#include <string>
#include <vector>

namespace esphome {
namespace esp_tree {

using RemoteEntitySchema = espnow_entity_schema_t;

struct OutstandingRequest {
  espnow_packet_type_t packet_type{PKT_DISCOVER};
  uint32_t tx_counter{0};
  std::array<uint8_t, 4> request_fingerprint{};
};

struct RemoteRouteEntry {
  std::array<uint8_t, 6> leaf_mac{};
  std::array<uint8_t, 6> next_hop_mac{};
  uint32_t expiry_ms{0};
  bool has_logged_providing_relay{false};
};

struct DiscoverCandidate {
  std::array<uint8_t, 6> next_hop_mac{};
  uint8_t responder_role{ESPNOW_NODE_ROLE_RELAY};
  bool bridge_reachable{false};
  uint8_t flags{0};
  uint8_t channel{1};
  int8_t rssi{-127};
  uint8_t hops_to_bridge{0xFF};
  bool valid{false};
  uint8_t preferred_index{0xFF};
};

struct PendingDiscover {
  std::array<uint8_t, 6> leaf_mac{};
  uint32_t expiry_ms{0};
};

struct PendingAnnounce {
  std::array<uint8_t, 6> leaf_mac{};
  std::array<uint8_t, 6> sender_mac{};
  uint8_t responder_role{0};
  uint8_t hops_to_bridge{0};
  uint32_t deadline_ms{0};
  bool valid{false};
};

using RemoteFragmentAssembly = espnow_fragment_assembly_t;

class RemoteProtocol {
 public:
 using send_fn_t = std::function<bool(const uint8_t *mac, const uint8_t *frame, size_t frame_len)>;
  using command_fn_t = std::function<void(uint8_t entity_index, uint8_t flags, const uint8_t *value, size_t value_len)>;

  RemoteProtocol();

  int init(const char *psk_hex, const char *network_id, const char *esphome_name, const char *node_label,
           uint32_t firmware_epoch, const char *project_name, const char *project_version, uint16_t heartbeat_interval);
  void set_local_mac(const uint8_t *mac);
  void set_relay_config(bool relay_enabled, uint8_t max_hops, uint8_t max_discover_pending);
  void set_route_ttl(uint32_t route_ttl_seconds);
  void add_preferred_parent(const std::array<uint8_t, 6> &mac);
  void set_send_fn(send_fn_t fn);
  void set_command_fn(command_fn_t fn);
  void set_session_flags(uint8_t flags) { local_session_flags_ = flags; }
  void set_relay_enabled_runtime(bool enabled) {
    relay_enabled_ = enabled;
    refresh_can_relay_();
  }
  void set_ota_over_espnow(bool enabled) {
    ota_over_espnow_ = enabled;
    file_receiver_.set_ota_enabled(enabled);
  }

  const char *state_name() const;
  uint32_t get_uptime_s() const;
  uint32_t get_firmware_epoch() const { return firmware_epoch_; }
  const std::string &get_project_name() const { return project_name_; }
  const std::string &get_project_version() const { return project_version_; }
  bool has_parent() const { return parent_valid_; }
  const std::array<uint8_t, 6> &parent_mac() const { return parent_mac_; }
  const std::vector<RemoteRouteEntry> &routes() const { return routes_; }

  bool on_espnow_frame(const uint8_t *sender_mac, const uint8_t *data, size_t len, int8_t rssi);
  void loop();
  void flush_log_queue();

  uint8_t register_entity(espnow_field_type_t type, const char *name, const char *unit, const char *options = "", const char *entity_id = "");
  void set_entity_options(uint8_t field_index, const char *options);
  void on_entity_state_change(uint8_t field_index, const uint8_t *value, size_t value_len);
  void on_entity_text_change(uint8_t field_index, const std::string &value);
  uint16_t get_total_children_count() const { return total_children_count_(); }

 private:
  bool parse_frame_(const uint8_t *frame, size_t len, espnow_frame_header_t &header, const uint8_t *&payload,
                    size_t &payload_len, const uint8_t *&session_tag, uint8_t parent_mac[6]) const;
  bool validate_psk_(const espnow_frame_header_t &header, const uint8_t *payload, size_t payload_len) const;
  bool validate_session_(const espnow_frame_header_t &header, const uint8_t *ciphertext, size_t ciphertext_len,
                         const uint8_t *session_tag) const;
  bool send_frame_(const uint8_t *mac, espnow_packet_type_t type, uint8_t hop_count, uint32_t tx_counter,
                   const uint8_t *payload, size_t payload_len, bool encrypted,
                   const uint8_t *pre_ciphertext = nullptr);
  bool send_join_();
  bool send_deauth_(const uint8_t *mac, const espnow_frame_header_t &trigger, const uint8_t *payload,
                    size_t payload_len);
  bool handle_discover_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                        size_t payload_len, int8_t rssi);
  bool handle_discover_announce_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                                 size_t payload_len, int8_t rssi);
  bool handle_join_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                    size_t payload_len, int8_t rssi);
  bool handle_join_ack_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                        size_t payload_len, int8_t rssi);
  bool handle_ack_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                   size_t payload_len, const uint8_t *session_tag, int8_t rssi);
  bool handle_command_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                       size_t payload_len, int8_t rssi);
  bool handle_config_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                      size_t payload_len, int8_t rssi);
  bool handle_schema_request_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                              size_t payload_len, int8_t rssi);
  bool handle_deauth_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                       size_t payload_len, int8_t rssi);
  bool handle_file_transfer_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                             size_t payload_len, const uint8_t *session_tag, int8_t rssi);
  bool handle_file_data_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                          size_t payload_len, const uint8_t *session_tag, int8_t rssi);
  bool handle_upstream_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                        size_t payload_len, const uint8_t *session_tag, int8_t rssi);
  bool handle_downstream_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                          size_t payload_len, const uint8_t *session_tag, int8_t rssi);
  bool send_heartbeat_();
  bool send_state_(uint8_t field_index, const std::vector<uint8_t> &value, bool reset_retry_state = true, uint8_t retry_count = 0);
  bool send_command_ack_(uint8_t field_index, uint8_t result, uint32_t ref_tx_counter);
  bool send_config_ack_(uint8_t command, uint8_t result, uint32_t ref_tx_counter);
  bool send_schema_push_(uint8_t descriptor_index);
  bool send_identity_descriptor_();
  bool send_discover_();
  void fill_discover_announce_(espnow_discover_announce_t &announce, uint8_t responder_role,
                                uint8_t hops_to_bridge) const;
  bool send_discover_announce_with_jitter_(const uint8_t *sender_mac, const uint8_t leaf_mac[6],
                                           uint8_t responder_role, uint8_t hops_to_bridge);
  void flush_pending_discover_announce_();
  void clear_session_state_(bool clear_entities, bool preserve_route = false);
  void rejoin_due_to_transmit_stall_(uint32_t now, const char *reason);
  bool refresh_route_(const uint8_t *leaf_mac, const uint8_t *next_hop_mac);
  const RemoteRouteEntry *find_route_(const uint8_t *leaf_mac) const;
  RemoteRouteEntry *find_route_mut_(const uint8_t *leaf_mac);
  bool forward_packet_(const espnow_frame_header_t &header, const uint8_t *payload, size_t payload_len,
                      const uint8_t *session_tag);
  bool forward_frame_(const uint8_t *mac, const espnow_frame_header_t &header, const uint8_t *payload, size_t payload_len,
                      const uint8_t *session_tag, uint8_t hop_count_delta);
  bool should_handle_locally_(const espnow_frame_header_t &header) const;
  void select_parent_candidate_(const uint8_t *sender_mac, const espnow_discover_announce_t &announce, int8_t rssi);
  uint8_t direct_child_count_() const;
  uint16_t total_children_count_() const;
  void update_outstanding_request_(espnow_packet_type_t packet_type, uint32_t tx_counter,
                                   const espnow_frame_header_t &header, const uint8_t *payload, size_t payload_len);
  bool send_ack_(const uint8_t *payload, size_t payload_len, uint32_t ref_tx_counter);
  void prune_routes_(uint32_t now_ms);
  void prune_pending_discovers_(uint32_t now_ms);
  void prune_pending_command_fragments_(uint32_t now_ms);
  bool is_preferred_parent_(const uint8_t *sender_mac, const uint8_t *responder_mac) const;
  static std::string format_mac_(const uint8_t *mac);
  void start_discovery_cycle_(bool wifi_wait_expired = false);
  void start_route_recovery_cycle_();
  void start_config_full_rediscovery_();
  bool wifi_connected_() const;
  uint8_t current_wifi_channel_() const;
  void adopt_best_parent_candidate_(bool resume_normal_after_success);
  void refresh_can_relay_();
  void mark_all_entities_dirty_();
  void compute_schema_hash_(uint8_t out_hash[32]) const;
  void update_mtu_from_route_() {
    max_entity_fragment_ = espnow_max_entity_fragment(session_max_payload_);
    max_assembly_bytes_ = espnow_max_assembly_bytes(session_max_payload_);
    max_total_fragment_bytes_ = espnow_max_total_fragment_bytes(session_max_payload_);
    file_receiver_.set_max_chunk_size(session_max_payload_);
  }

  std::array<uint8_t, 6> parent_mac_{};
  bool parent_valid_{false};
  uint8_t last_parent_mac[6]{};
  std::array<uint8_t, 6> leaf_mac_{};
  std::array<uint8_t, 6> bridge_mac_{};
  std::array<uint8_t, 16> remote_nonce_{};
  std::array<uint8_t, 16> bridge_nonce_{};
  std::array<uint8_t, 32> session_key_{};
  std::atomic<bool> session_key_valid_{false};
  std::atomic<bool> joined_{false};
  uint8_t local_session_flags_{0};
  uint8_t bridge_session_flags_{0};
  uint16_t session_max_payload_{ESPNOW_V1_MAX_PAYLOAD};
  uint16_t max_entity_fragment_{ESPNOW_MAX_ENTITY_FRAGMENT_LEN};
  uint16_t max_assembly_bytes_{ESPNOW_MAX_FRAGMENT_ASSEMBLY_BYTES};
  uint16_t max_total_fragment_bytes_{ESPNOW_MAX_TOTAL_FRAGMENT_BYTES_PER_SESSION};
  std::atomic<bool> discovering_{true};
  std::atomic<bool> join_in_flight_{false};
  std::atomic<bool> discover_announce_pending_{false};
  static constexpr size_t ANNOUNCE_QUEUE_SIZE = 8;
  uint8_t announce_queue_head_{0};
  uint8_t announce_queue_tail_{0};
  PendingAnnounce announce_queue_[ANNOUNCE_QUEUE_SIZE]{};
  bool relay_enabled_{true};
  bool ota_over_espnow_{false};
  bool can_relay_{false};
  uint8_t max_hops_{ESPNOW_MAX_HOPS_DEFAULT};
  uint8_t max_discover_pending_{ESPNOW_MAX_PENDING_DISCOVER};
  std::vector<std::array<uint8_t, 6>> preferred_parents_{};
  uint8_t hop_count_{0};
  uint8_t hops_to_bridge_{0xFF};
  uint32_t tx_counter_{1};
  uint32_t last_seen_counter_{0};
  uint32_t last_tx_ms_{0};
  uint32_t last_successful_outbound_ms_{0};
  uint32_t last_successful_state_ms_{0};
  uint32_t last_successful_heartbeat_ms_{0};
  uint32_t last_heartbeat_tx_ms_{0};
  uint32_t last_join_attempt_ms_{0};
  uint32_t join_delay_until_ms_{0};
  uint32_t joined_started_ms_{0};
  uint16_t heartbeat_interval_{60};
  uint32_t route_ttl_seconds_{ESPNOW_ROUTE_TTL_DEFAULT_SECONDS};
  uint32_t boot_epoch_ms_{0};
  std::string network_id_;
  std::string esphome_name_;
  std::string node_label_;
  uint32_t firmware_epoch_{0};
  std::string project_name_;
  std::string project_version_;
  uint32_t chip_model_{0};
  std::string build_date_;
  std::string build_time_;
  std::array<uint8_t, 16> firmware_md5_{};
  std::vector<RemoteEntitySchema> entities_;
  std::array<OutstandingRequest, 8> outstanding_requests_{};
  uint8_t outstanding_count_{0};
  std::vector<RemoteRouteEntry> routes_;
  std::vector<PendingDiscover> pending_discovers_;
  DiscoverCandidate best_parent_;
  send_fn_t send_fn_;
  command_fn_t command_fn_;
  FileReceiver file_receiver_{};
  std::string state_name_{"DISCOVERING"};
  uint32_t heartbeat_due_ms_{0};
  uint32_t discover_due_ms_{0};
  std::atomic<bool> state_push_enabled_{false};
  std::atomic<bool> normal_{false};
  std::atomic<bool> waiting_for_state_ack_{false};
  uint8_t discover_retry_count_{0};
  uint8_t join_retry_count_{0};
  uint8_t wait_reject_count_{0};
  uint8_t state_retry_count_{0};
  uint8_t consecutive_send_failures_{0};
  uint32_t last_state_tx_ms_{0};
  uint32_t last_state_rtt_ms_{0};
  uint32_t pending_state_message_tx_base_{0};
  uint32_t last_config_tx_counter_{0};
  uint8_t last_config_command_{0};
  uint8_t last_config_result_{CFG_RESULT_OK};
  bool last_config_valid_{false};
  uint8_t pending_state_field_index_{0};
  std::vector<uint8_t> pending_state_value_;
  uint8_t pending_state_flags_{0};
  uint8_t pending_state_fragment_count_{0};
  size_t pending_state_payload_len_{0};
  uint8_t channel_index_{0};
  uint8_t last_known_channel_{1};
  bool sweep_complete_{false};
  bool fast_rejoin_{false};
  bool discovery_resume_normal_after_success_{false};
  bool discovery_current_channel_only_{false};
  bool wifi_waiting_{false};
  uint32_t wifi_wait_deadline_ms_{0};
  bool discover_retry_pending_{false};
  uint8_t discover_phase_{0};
  bool initial_discovery_pending_{false};
  int8_t parent_link_rssi_ema_{-127};
  uint32_t topology_refresh_due_ms_{0};
  uint32_t ota_last_activity_ms_{0};
  struct EntityRecord {
    RemoteEntitySchema schema;
    std::vector<uint8_t> current_value;
    bool dirty{true};
    std::string current_text;
    uint32_t last_completed_command_message_tx_base{0};
  };
  std::vector<EntityRecord> entity_records_;
  std::map<uint8_t, RemoteFragmentAssembly> pending_command_assemblies_{};
  size_t pending_command_reserved_bytes_{0};

  std::array<PacketLogEntry, PACKET_LOG_SIZE> log_queue_{};
  size_t log_head_{0};
  size_t log_tail_{0};
  size_t log_count_{0};

  espnow_log_state_t pending_state_{espnow_log_state_t::NONE};
  char pending_state_log_msg_[96]{0};

  void record_outstanding_request_(espnow_packet_type_t packet_type, uint32_t tx_counter,
                                   const uint8_t *payload, size_t payload_len);
  bool request_matches_outstanding_(espnow_packet_type_t packet_type, uint32_t tx_counter,
                                    const uint8_t *payload, size_t payload_len) const;
  void queue_log_(bool tx, espnow_packet_type_t type, const uint8_t *mac, uint16_t length, int8_t rssi,
                  bool show_channel = false, uint8_t ch = 0,
                  bool show_entity = false, uint8_t entity_idx = 0, uint8_t entity_tot = 0,
                  uint8_t chunk_idx = 0, uint8_t chunk_tot = 0, uint32_t rtt_ms = 0,
                  int8_t allowed = -1, uint8_t hops = 0,
                  uint8_t retry_count = 0, uint32_t pkt_uid = 0,
                  bool parent_check = false);
  void queue_state_log_(espnow_log_state_t state, const char *fmt, ...);

  static uint32_t retry_backoff_ms(uint8_t retry_count) {
    constexpr size_t n = sizeof(RETRY_BACKOFF_MS) / sizeof(RETRY_BACKOFF_MS[0]);
    return RETRY_BACKOFF_MS[std::min<size_t>(retry_count, n - 1)];
  }
};

}  // namespace esp_tree
}  // namespace esphome
