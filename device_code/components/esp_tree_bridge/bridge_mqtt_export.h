#pragma once

#ifdef USE_MQTT

#include "esphome/components/mqtt/custom_mqtt_device.h"

#include <array>
#include <deque>
#include <map>
#include <set>
#include <string>
#include <vector>

#include "esp_tree_common/espnow_types.h"
#include "esp_tree_bridge.h"

namespace esphome {
namespace esp_tree {

class ESPTreeBridge;

struct MqttEntityRecord {
  std::array<uint8_t, 6> leaf_mac{};
  std::string node_id;
  espnow_entity_schema_t schema{};
  uint8_t total_entities{0};
  bool discovery_published{false};
  bool first_state_publish_pending{false};
  bool state_dirty{false};
  bool command_subscribed{false};
  uint32_t discovery_published_ms{0};
  std::vector<uint8_t> current_value;
  espnow_field_type_t current_type{FIELD_TYPE_SENSOR};
  std::string text_value;
  bool pending_state_ack_{false};
  uint32_t pending_ack_message_tx_base_{0};
  uint8_t pending_ack_entity_index_{0};
  uint32_t pending_ack_queued_ms_{0};
  std::array<uint8_t, 6> ack_next_hop_mac_{};
};

struct MqttDeviceRecord {
  std::array<uint8_t, 6> leaf_mac{};
  std::string node_id;
  std::string device_id;
  std::string display_name;
  std::map<uint8_t, espnow_entity_schema_t> entities{};
  uint8_t total_entities{0};
  bool schema_complete{false};
  bool discovery_dirty{false};
  bool discovery_published{false};
  uint32_t discovery_published_ms{0};
};

class ESPTreeBridgeMQTT : public mqtt::CustomMQTTDevice {
 public:
  ESPTreeBridgeMQTT();

  void init(ESPTreeBridge *bridge, const std::array<uint8_t, 6> &bridge_mac, const std::string &force_rejoin_topic);
  void tick();
  bool is_connected() const { return mqtt::global_mqtt_client != nullptr && mqtt::global_mqtt_client->is_connected(); }
  void set_mqtt_discovery_prefix(const std::string &prefix) { mqtt_discovery_prefix_ = prefix; }
  void set_bridge_friendly_name(const std::string &name) { bridge_friendly_name_ = name; }
  void set_bridge_diag(uint32_t uptime_s, uint8_t remotes_online, int8_t rssi,
                       uint8_t wifi_channel, int ram_pct, int cpu_pct, uint8_t remotes_direct);
  void queue_discovery(const uint8_t *mac, const espnow_entity_schema_t &entity,
                       uint8_t total_entities, bool is_commandable, const std::string &display_name);
  void queue_state(const uint8_t *mac, const espnow_entity_schema_t &entity,
                   const std::vector<uint8_t> &value, espnow_field_type_t type,
                   const std::string &text_value, uint32_t message_tx_base,
                   const uint8_t *next_hop_mac, const std::string &display_name);
  void queue_availability(const uint8_t *mac, bool online, const char *reason);
  void queue_clear_entities(const uint8_t *mac, const std::vector<espnow_entity_schema_t> &old_entities);
  void on_schema_complete(const uint8_t *mac, uint8_t total_entities);
  void on_discovery_confirmed(const uint8_t *mac, uint8_t entity_index, bool success);
  void queue_remote_diag_refresh(const uint8_t *mac);

 private:
  ESPTreeBridge *bridge_{nullptr};
  std::array<uint8_t, 6> bridge_mac_{};
  std::string mqtt_discovery_prefix_{"homeassistant"};
  std::string bridge_friendly_name_;
  std::string force_rejoin_command_topic_;

  void do_publish_discovery_(MqttEntityRecord &rec);
  void publish_device_discovery_(const uint8_t *mac);
  void build_entity_component_(JsonObject cmp, const uint8_t *mac, const espnow_entity_schema_t &entity);
  void do_clear_device_discovery_(const uint8_t *mac);
  bool do_publish_state_(MqttEntityRecord &rec);
  void do_clear_entity_(const uint8_t *mac, const espnow_entity_schema_t &entity);
  void subscribe_command_topic_(const uint8_t *mac, const espnow_entity_schema_t &entity);
  void handle_command_message_(const std::string &topic, const std::string &payload);
  void handle_force_rejoin_command_(const std::string &topic, const std::string &payload);
  void publish_bridge_diag_discovery_();
  void publish_bridge_diag_state_();
  void publish_remote_diag_discovery_(const uint8_t *mac);
  void publish_remote_diag_state_(const uint8_t *mac);
  void publish_remote_diag_state_cached_(const uint8_t *mac, const std::string &node_key);
  void queue_remote_diag_refresh_(const uint8_t *mac);
  void check_diag_publish_rr_();
  void publish_force_rejoin_button_discovery_();

  std::string node_key_(const uint8_t *mac) const;
  std::string entity_object_id_(const uint8_t *mac, const espnow_entity_schema_t &entity) const;
  std::string default_entity_id_(const uint8_t *mac, const espnow_entity_schema_t &entity) const;
  std::string entity_component_(espnow_field_type_t type) const;
  std::string availability_topic_(const uint8_t *mac) const;
  std::string state_topic_(const uint8_t *mac, const espnow_entity_schema_t &entity) const;
  std::string command_topic_(const uint8_t *mac, const espnow_entity_schema_t &entity) const;
  std::string fan_speed_state_topic_(const uint8_t *mac, const espnow_entity_schema_t &entity) const;
  std::string fan_speed_command_topic_(const uint8_t *mac, const espnow_entity_schema_t &entity) const;
  std::string fan_oscillation_state_topic_(const uint8_t *mac, const espnow_entity_schema_t &entity) const;
  std::string fan_oscillation_command_topic_(const uint8_t *mac, const espnow_entity_schema_t &entity) const;
  std::string fan_direction_state_topic_(const uint8_t *mac, const espnow_entity_schema_t &entity) const;
  std::string fan_direction_command_topic_(const uint8_t *mac, const espnow_entity_schema_t &entity) const;
  std::string unique_id_(const uint8_t *mac, const espnow_entity_schema_t &entity) const;
  std::string bridge_state_topic_(const char *suffix) const;
  std::string remote_diag_state_topic_(const uint8_t *mac, const char *suffix) const;
  bool decode_command_payload_(const espnow_entity_schema_t &entity, CommandRouteKind route_kind,
                               const std::string &payload, std::vector<uint8_t> &value,
                               const std::vector<uint8_t> &current_value) const;
  std::string encode_state_payload_(const espnow_entity_schema_t &entity, const std::vector<uint8_t> &value,
                                    espnow_field_type_t type) const;
  std::string entity_record_key_(const uint8_t *mac, uint8_t entity_index) const;

  std::map<std::string, MqttEntityRecord> mqtt_entities_;
  std::map<std::string, MqttDeviceRecord> mqtt_devices_;
  struct AvailabilityEntry { std::array<uint8_t, 6> mac{}; bool online{false}; std::string reason; };
  std::deque<AvailabilityEntry> availability_queue_;
  std::set<std::string> subscribed_topics_;
  std::map<std::string, CommandRoute> command_routes_;
  bool mqtt_was_connected_{false};
  uint32_t mqtt_backoff_until_ms_{0};
  uint8_t mqtt_retry_count_{0};
  struct RemoteDiagCache {
    int8_t rssi_{-127}; uint32_t tx_packets{0}; uint32_t rx_packets{0}; uint8_t hops{0};
    uint8_t direct_children{0}; uint8_t total_children{0}; uint32_t firmware_epoch{0};
    std::string esphome_name; std::string project_name; std::string project_version;
    uint32_t chip_model{0}; uint32_t last_publish_ms{0};
  };
  bool bridge_diag_discovery_published_{false};
  std::set<std::string> remote_diag_discovery_published_;
  std::set<std::string> remote_diag_refresh_pending_;
  std::set<std::string> first_remote_diag_publish_pending_;
  std::map<std::string, RemoteDiagCache> remote_diag_cache_;
  std::map<std::string, uint32_t> delayed_diag_refresh_pending_;
  std::map<std::string, uint32_t> remote_diag_last_publish_ms_;
  uint32_t last_published_bridge_diag_ms_{0};
  uint32_t diag_last_any_publish_ms_{0};
  size_t diag_rr_index_{0};
  uint32_t next_diag_check_ms_{0};
  bool force_rejoin_button_discovery_published_{false};
  uint32_t cached_uptime_s_{0}; uint8_t cached_remotes_online_{0};
  int8_t cached_bridge_rssi_{-127}; uint8_t cached_wifi_channel_{0};
  int cached_ram_pct_{-1}; int cached_cpu_pct_{-1}; uint8_t cached_remotes_direct_{0};
  static constexpr uint16_t MQTT_RETRY_BACKOFF_MS[]{200, 400, 800, 1600, 3200, 6400, 12800, 30000};
  static constexpr uint32_t MQTT_MAX_BACKOFF_MS{30000};
  static constexpr uint32_t FIRST_STATE_PUBLISH_GRACE_MS{200};
  static constexpr uint32_t DIAG_CHECK_INTERVAL_MS{250};
  static constexpr uint32_t DIAG_SPACING_MS{250};
  static constexpr uint32_t DIAG_MIN_INTERVAL_MS{10000};
  static constexpr uint32_t DIAG_JITTER_MS{50};
  static constexpr uint32_t DIAG_DELAYED_REFRESH_DELAY_MS{1000};
  uint32_t tick_enter_ms_{0};
  bool tick_budget_exceeded_() const { return (millis() - tick_enter_ms_) >= LOOP_TIME_BUDGET_MS; }
  static constexpr uint32_t LOOP_TIME_BUDGET_MS{200};
};

}  // namespace esp_tree
}  // namespace esphome

#endif  // USE_MQTT
