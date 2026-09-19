#pragma once

#include "esphome/core/component.h"
#include "esphome/core/application.h"
#include "bridge_protocol.h"
#include "bridge_ota_manager.h"
#include "bridge_api_types.h"
#ifdef USE_SERIAL
namespace bridge_api { class BridgeApiSerialTransport; }
#else
#include "bridge_api_proto_ws.h"
#endif
#include "ota_transport_callbacks.h"

#ifdef USE_SERIAL
#include "esphome/components/uart/uart.h"
#endif

#include <esp_idf_version.h>
#include <esp_now.h>

#include <array>
#include <deque>
#include <map>
#include <memory>
#include <set>
#include <string>
#include <vector>

#include <freertos/FreeRTOS.h>
#include <freertos/semphr.h>

namespace esphome {
namespace esp_tree {

enum class CommandRouteKind : uint8_t {
  PRIMARY = 0,
  FAN_SPEED,
  FAN_OSCILLATION,
  FAN_DIRECTION,
};

struct CommandRoute {
  std::array<uint8_t, 6> leaf_mac{};
  uint8_t entity_index{0};
  CommandRouteKind route_kind{CommandRouteKind::PRIMARY};
};

#ifdef USE_MQTT
struct ESPTreeBridgeMQTT;  // opaque pointer — full class in bridge_mqtt_export.cpp
#endif

class ESPTreeBridge : public Component, public bridge_api::BridgeFacade {
 public:
  ESPTreeBridge();

  void set_network_id(const std::string &network_id) { network_id_ = network_id; }
  void set_psk(const std::string &psk) { psk_ = psk; }
  void set_heartbeat_interval(uint16_t heartbeat_interval) { heartbeat_interval_ = heartbeat_interval; }
  void set_mqtt_discovery_prefix(const std::string &mqtt_discovery_prefix) { mqtt_discovery_prefix_ = mqtt_discovery_prefix; }
  void set_espnow_mode(const std::string &mode) { espnow_mode_ = mode; }
  void set_ota_over_espnow(bool enabled) { ota_over_espnow_ = enabled; }
  void set_force_v1_packet_size(bool v) { force_v1_packet_size_ = v; }
  void set_bridge_friendly_name(const std::string &name) { bridge_friendly_name_ = name; }
  void set_hostname(const std::string &name) { hostname_ = name; }
  void set_api_key(const std::string &api_key) { api_key_ = api_key; }
#ifdef USE_SERIAL
  void set_uart_component(esphome::uart::UARTComponent *uart) { uart_component_ = uart; }
#endif
  void setup() override;
  void loop() override;
  float get_setup_priority() const override { return setup_priority::AFTER_WIFI; }
  void dump_config() override;

  uint8_t get_active_remote_count() const { return protocol_.get_active_remote_count(); }
  bool api_has_key_configured() const { return !api_key_.empty(); }
  const std::string &api_key() const { return api_key_; }

  std::string api_bridge_info_json() const override;
  std::string api_topology_snapshot_json(const std::string &request_payload_json) const override;
  std::string api_node_schema_json(const std::string &mac_colon) const override;
  std::string api_node_state_json(const std::string &mac_colon) const override;
  bool api_node_config_start(const std::string &mac_colon, uint8_t command,
                             const std::vector<uint8_t> &payload,
                             const std::string &command_name,
                             bridge_api::NodeConfigCallback callback,
                             std::string &immediate_result_out) override;
  std::string api_runtime_bridge_mac() const;
  void api_runtime_encode_auth_ok(const std::string &request_id, std::vector<uint8_t> &out) const;
  void api_runtime_encode_full_snapshot(const std::string &request_id, std::vector<uint8_t> &out) const;
  void api_runtime_encode_bridge_heartbeat(std::vector<uint8_t> &out) const;
  void api_runtime_encode_topology_changed(const char *reason, const uint8_t *mac, std::vector<uint8_t> &out) const;
  void api_runtime_encode_remote_availability(const uint8_t *mac, bool online, const char *reason, int8_t rssi,
                                              uint32_t offline_s, const uint8_t *parent_mac, uint8_t hop_count,
                                              std::vector<uint8_t> &out) const;
  void api_runtime_encode_remote_state(const uint8_t *mac, const espnow_entity_schema_t &entity,
                                       const std::vector<uint8_t> &value, espnow_field_type_t type,
                                       uint32_t state_tx_counter, std::vector<uint8_t> &out) const;
  void api_runtime_encode_remote_schema_changed(const uint8_t *mac, const std::string &schema_hash,
                                                std::vector<uint8_t> &out) const;
  void api_runtime_handle_command(const std::string &request_id,
                                  const bridge_api::runtime_pb::ParsedCommandRequest &request,
                                  std::vector<uint8_t> &out);
  void api_runtime_handle_state_receipt(const std::string &remote_mac, const std::string &session_id,
                                        uint32_t state_tx_counter, uint8_t entity_index);
  using ConfigResponseCallback = std::function<void(const std::vector<uint8_t> &result)>;
  void api_runtime_handle_config_command(const std::string &request_id,
                                         const bridge_api::runtime_pb::ParsedConfigCommandRequest &request,
                                         ConfigResponseCallback callback = nullptr);

  bool api_ota_start(const std::string &target_mac_colon, uint32_t file_size,
                     const std::string &md5_hex, const std::string &sha256_hex,
                     const std::string &filename, uint16_t preferred_chunk_size,
                     std::string &job_id_out, uint16_t &max_chunk_size_out,
                     const std::string &request_id,
                     std::string &error_out) override;
  bool api_ota_abort(const std::string &job_id, const std::string &reason) override;
  bool api_ota_inject_chunk(uint32_t sequence, const uint8_t *data, size_t len) override;
  bool api_ota_has_active_job() const override;
  std::string api_ota_active_job_id() const override;
  std::string api_ota_active_chunk_request_id() const override;
  uint16_t api_ota_chunk_size() const override;
  uint16_t api_ota_max_chunks_per_batch() const override;
  std::vector<uint32_t> api_ota_requested_sequences() const override;
  void api_ota_resend_chunk_request() override;
  void set_ota_transport_callbacks(bridge_api::OtaTransportCallbacks *callbacks);
  void clear_ota_transport_callbacks(bridge_api::OtaTransportCallbacks *callbacks);

  // Public methods called by ESPTreeBridgeMQTT
#ifdef USE_MQTT
  void send_command(const uint8_t *mac, uint8_t entity_index, const std::vector<uint8_t> &value);
  void send_force_rejoin(const uint8_t *mac);
  void protocol_discovery_confirmed(const uint8_t *mac, uint8_t entity_index, bool success);
  void mark_mqtt_state_delivered(const uint8_t *mac, uint8_t entity_index, uint32_t message_tx_base);
#endif
  std::vector<std::array<uint8_t, 6>> get_online_macs() const;
  const BridgeSession *get_session(const uint8_t *mac) const;
  std::string node_key(const uint8_t *mac) const;
  bool get_remote_mac_by_node_key(const std::string &node_key, uint8_t *mac_out) const;

 protected:
  bool setup_transport_();
  bool send_frame_(const uint8_t *mac, const uint8_t *frame, size_t frame_len);
  esp_err_t send_frame_result_(const uint8_t *mac, const uint8_t *frame, size_t frame_len);
  bool add_peer_(const uint8_t *mac);
  uint8_t current_wifi_channel_() const;
  void note_peer_activity_(const uint8_t *mac);
  bool is_peer_protected_(const uint8_t *mac) const;
  bool evict_stale_peer_(const uint8_t *preferred_mac);
  bool init_wifi_and_espnow_();
  void handle_received_frame_(const uint8_t *mac, const uint8_t *data, size_t len, int8_t rssi);
  void handle_send_status_(const uint8_t *mac, bool success);
  void drain_received_frames_();

  std::string build_topology_json_() const;
  std::string build_remote_info_json_(const uint8_t *mac) const;
  std::string mac_colon_string_(const uint8_t *mac) const;

  std::string node_key_(const uint8_t *mac) const;
  std::string remote_display_name_(const uint8_t *mac) const;

  void log_airtime_status_();
  void log_ram_stats_();
  void log_timer_debug_state_();

  void schema_complete_(const uint8_t *mac, uint8_t total_entities);
  void on_discovery_confirmed_(const uint8_t *mac, uint8_t entity_index, bool success);

  std::string entity_object_id_(const uint8_t *mac, const BridgeEntitySchema &entity) const;
  std::string slugify_name_(std::string input) const;

  bool decode_command_payload_(const BridgeEntitySchema &entity, CommandRouteKind route_kind,
                               const std::string &payload, std::vector<uint8_t> &value,
                               const std::vector<uint8_t> &current_value) const;

  static std::string mac_key_string_(const uint8_t *mac);
  static void register_instance_(ESPTreeBridge *instance);
#if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(5, 0, 0)
  static void on_data_received_(const esp_now_recv_info_t *info, const uint8_t *data, int len);
  static void on_data_sent_(const esp_now_send_info_t *tx_info, esp_now_send_status_t status);
#else
  static void on_data_received_(const uint8_t *mac, const uint8_t *data, int len);
  static void on_data_sent_(const uint8_t *mac, esp_now_send_status_t status);
#endif

  BridgeProtocol protocol_;
  std::string network_id_;
  std::string psk_;
  std::string api_key_;
  std::string espnow_mode_{"lr"};
  std::string mqtt_discovery_prefix_{"homeassistant"};
  std::string bridge_friendly_name_{"ESP-NOW LR Bridge"};
  std::string hostname_;
  uint16_t heartbeat_interval_{ESPNOW_HEARTBEAT_INTERVAL_S};
  bool protocol_ready_{false};
  bool transport_ready_{false};
  uint32_t rx_packets_{0};
  uint32_t rx_dropped_{0};
  uint32_t rx_dropped_while_disallowed_{0};
  uint32_t tx_ok_{0};
  uint32_t tx_fail_{0};
  std::array<uint8_t, 6> sta_mac_{};
  struct PendingRxFrame {
    std::array<uint8_t, 6> mac{};
    std::vector<uint8_t> data;
    int8_t rssi{0};
  };
  static constexpr size_t MAX_PENDING_RX_FRAMES = 64;
  static constexpr size_t RX_BUFFER_WATERMARK_PCT = 80;
  std::deque<PendingRxFrame> pending_rx_frames_;
  SemaphoreHandle_t pending_rx_mutex_{nullptr};
  std::map<std::string, uint32_t> peer_last_used_ms_;

  struct AirtimeStats {
    uint32_t tx_packets{0};
    uint32_t rx_packets{0};
    uint64_t tx_airtime_us{0};
    uint64_t rx_airtime_us{0};
    int64_t rssi_sum{0};
    uint32_t rssi_count{0};
    uint32_t window_start_ms{0};
  };
  AirtimeStats rolling_airtime_;
  uint32_t airtime_window_start_ms_{0};
  static constexpr uint32_t AIRTIME_REPORT_INTERVAL_MS{30000};

  static ESPTreeBridge *active_instance_;
  // Whether the bridge should process incoming ESP-NOW frames. This is set when
  // Wi-Fi is connected. (MQTT is optional — removed from this gate.)
  bool espnow_allowed_{false};

#ifndef USE_SERIAL
  // --- Topology Web Server ---
  void register_web_handler_();
  // === V2 Web UI ===
  void register_v2_auth_handlers_();
  void register_v2_web_handlers_();
  bool v2_http_authenticate_(void *request);
  bool v2_verify_session_(void *request);
  std::string v2_session_token_;
  uint32_t v2_session_created_ms_{0};
  bool v2_web_handlers_registered_{false};
  bool v2_auth_handlers_registered_{false};
  std::string get_ip_string() const;
  bool web_handler_registered_{false};
  bool api_proto_ws_handler_registered_{false};
  bool mdns_initialized_{false};
#endif
#ifdef USE_SERIAL
  std::unique_ptr<bridge_api::BridgeApiSerialTransport> serial_transport_;
#else
  std::unique_ptr<bridge_api::BridgeApiProtoWsTransport> api_proto_ws_;
#endif
  bool ota_over_espnow_{false};
#ifdef USE_SERIAL
  esphome::uart::UARTComponent *uart_component_{nullptr};
#endif
  bool force_v1_packet_size_{false};
  std::unique_ptr<ESPNowOTAManager> ota_manager_;
  std::vector<uint8_t> ota_upload_buf_;
  size_t ota_upload_expected_size_{0};
  size_t ota_upload_received_{0};
  uint32_t ota_upload_last_activity_ms_{0};
  bool ota_upload_complete_{false};
  bool ota_upload_failed_{false};
  bool ota_upload_session_pending_{false};
  std::array<uint8_t, 6> ota_upload_target_mac_{};
  std::array<uint8_t, 16> ota_upload_md5_{};
  std::string ota_upload_error_msg_;
  struct OtaChunkStage {
    size_t total{0};
    std::vector<uint8_t> data;
  };
  std::map<uint32_t, OtaChunkStage> ota_chunk_stages_;
  void reset_ota_upload_state_(bool release_memory = false);

  uint64_t cpu_last_publish_time_us_{0};
  uint64_t cpu_last_idle_runtime_{0};

  mutable uint32_t snapshot_sequence_{0};

  void emit_ota_events_();
  void emit_ota_status_callback_(bridge_api::runtime_pb::OtaState state, const std::string &error_detail = "");
  std::vector<uint32_t> ota_requested_sequences_() const;
  std::string next_ota_chunk_request_id_();

  // Lightweight entity value cache for non-MQTT code paths (protobuf WS)
  struct EntityValueCache {
    std::vector<uint8_t> current_value;
    espnow_field_type_t current_type{FIELD_TYPE_SENSOR};
    BridgeEntitySchema schema{};
  };
  std::map<std::string, EntityValueCache> entity_values_;
  std::string entity_value_key_(const uint8_t *mac, const BridgeEntitySchema &entity) const;

  enum StateDeliverySink : uint8_t {
    STATE_DELIVERY_SINK_MQTT = 0x01,
    STATE_DELIVERY_SINK_PROTOBUF = 0x02,
  };
  struct PendingStateDelivery {
    std::array<uint8_t, 6> leaf_mac{};
    std::array<uint8_t, 6> next_hop_mac{};
    uint8_t entity_index{0};
    uint32_t message_tx_base{0};
    uint8_t required_sinks{0};
    uint8_t delivered_sinks{0};
    uint32_t created_ms{0};
  };
  std::map<std::string, PendingStateDelivery> pending_state_deliveries_;
  std::string state_delivery_key_(const uint8_t *mac, uint8_t entity_index, uint32_t message_tx_base) const;
  uint8_t active_state_delivery_sinks_() const;
  void begin_state_delivery_(const uint8_t *mac, uint8_t entity_index, uint32_t message_tx_base,
                             const uint8_t *next_hop_mac, uint8_t required_sinks);
  void mark_state_sink_delivered_(const uint8_t *mac, uint8_t entity_index, uint32_t message_tx_base,
                                  uint8_t sink);
  void expire_state_deliveries_();
  static constexpr uint32_t STATE_DELIVERY_TIMEOUT_MS{2000};

  bridge_api::OtaJobState ota_job_state_{bridge_api::OtaJobState::IDLE};
  std::string ota_job_id_;
  uint32_t ota_job_counter_{0};
  std::string ota_request_id_;
  std::string ota_session_id_;
  std::array<uint8_t, 6> ota_target_mac_{};
  std::string ota_manager_prev_public_state_;
  bridge_api::OtaTransportCallbacks *ota_transport_callbacks_{nullptr};
  std::vector<uint32_t> ota_last_requested_sequences_;
  uint32_t ota_chunk_request_counter_{0};
  uint8_t ota_last_status_percent_{255};
  uint32_t ota_last_status_ms_{0};

#ifdef USE_MQTT
  ESPTreeBridgeMQTT *mqtt_export_{nullptr};
#endif
};

}  // namespace esp_tree
}  // namespace esphome
