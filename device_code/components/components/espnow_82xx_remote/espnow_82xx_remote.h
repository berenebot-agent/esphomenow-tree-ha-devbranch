#pragma once

#include <array>
#include <deque>
#include <map>
#include <set>
#include <vector>

#include "esphome/core/component.h"
#include "remote_protocol.h"

#ifdef USE_ALARM_CONTROL_PANEL
#include "esphome/components/alarm_control_panel/alarm_control_panel.h"
#endif
#ifdef USE_BINARY_SENSOR
#include "esphome/components/binary_sensor/binary_sensor.h"
#endif
#ifdef USE_BUTTON
#include "esphome/components/button/button.h"
#endif
#ifdef USE_COVER
#include "esphome/components/cover/cover.h"
#endif
#ifdef USE_EVENT
#include "esphome/components/event/event.h"
#endif
#ifdef USE_FAN
#include "esphome/components/fan/fan.h"
#endif
#ifdef USE_LIGHT
#include "esphome/components/light/light_state.h"
#endif
#ifdef USE_LOCK
#include "esphome/components/lock/lock.h"
#endif
#ifdef USE_NUMBER
#include "esphome/components/number/number.h"
#endif
#ifdef USE_SELECT
#include "esphome/components/select/select.h"
#endif
#ifdef USE_SENSOR
#include "esphome/components/sensor/sensor.h"
#endif
#ifdef USE_SWITCH
#include "esphome/components/switch/switch.h"
#endif
#ifdef USE_VALVE
#include "esphome/components/valve/valve.h"
#endif
#ifdef USE_TEXT
#include "esphome/components/text/text.h"
#endif
#ifdef USE_TEXT_SENSOR
#include "esphome/components/text_sensor/text_sensor.h"
#endif

#ifdef USE_ESP8266
#include <ESP8266WiFi.h>
#include <espnow.h>
#endif
#include <espnow.h>
#include <string>
#include <vector>

namespace esphome {
namespace esp_tree {

class ESPNow82xxRemote : public Component {
 public:
  ESPNow82xxRemote();

  void set_network_id(const std::string &network_id) { network_id_ = network_id; }
  void set_psk(const std::string &psk) { psk_ = psk; }
  void set_esphome_name(const std::string &esphome_name) { esphome_name_ = esphome_name; }
  void set_node_label(const std::string &node_label) { node_label_ = node_label; }
  void set_heartbeat_interval(uint16_t heartbeat_interval) { heartbeat_interval_ = heartbeat_interval; }
  void set_ota_over_espnow(bool enabled) { ota_over_espnow_ = enabled; protocol_.set_ota_over_espnow(enabled); }
  void set_espnow_mode(const std::string &mode) { espnow_mode_ = mode; }
  void add_preferred_parent(const std::array<uint8_t, 6> &mac) { preferred_parents_.push_back(mac); }
  void set_channel(uint8_t channel) { espnow_channel_ = channel; }

#ifdef USE_SENSOR
  void register_sensor_entity(sensor::Sensor *sensor, const char *entity_id = "");
#endif
#ifdef USE_SWITCH
  void register_switch_entity(switch_::Switch *a_switch, const char *entity_id = "");
#endif
#ifdef USE_BINARY_SENSOR
  void register_binary_sensor_entity(binary_sensor::BinarySensor *binary_sensor, const char *entity_id = "");
#endif
#ifdef USE_COVER
  void register_cover_entity(cover::Cover *a_cover, const char *entity_id = "");
#endif
#ifdef USE_LOCK
  void register_lock_entity(lock::Lock *a_lock, const char *entity_id = "");
#endif
#ifdef USE_NUMBER
  void register_number_entity(number::Number *a_number, const char *entity_id = "");
#endif
#ifdef USE_VALVE
  void register_valve_entity(valve::Valve *a_valve, const char *entity_id = "");
#endif
#ifdef USE_ALARM_CONTROL_PANEL
  void register_alarm_control_panel_entity(alarm_control_panel::AlarmControlPanel *a_alarm, const char *entity_id = "");
#endif
#ifdef USE_EVENT
  void register_event_entity(event::Event *a_event, const char *entity_id = "");
#endif
#ifdef USE_FAN
  void register_fan_entity(fan::Fan *a_fan, const char *entity_id = "");
#endif
#ifdef USE_LIGHT
  void register_light_entity(light::LightState *a_light, const char *entity_id = "");
#endif
#ifdef USE_SELECT
  void register_select_entity(select::Select *a_select, const char *entity_id = "");
#endif
#ifdef USE_TEXT
  void register_text_entity(text::Text *a_text, const char *entity_id = "");
#endif
#ifdef USE_TEXT_SENSOR
  void register_text_sensor_entity(text_sensor::TextSensor *a_text_sensor, const char *entity_id = "");
#endif
#ifdef USE_BUTTON
  void register_button_entity(button::Button *button, const char *entity_id = "");
#endif

  void setup() override;
  void loop() override;
  float get_setup_priority() const override { return setup_priority::AFTER_WIFI; }
  void dump_config() override;

  bool is_protocol_ready() const { return protocol_ready_; }
  bool is_transport_ready() const { return transport_ready_; }
  const char *get_protocol_state() const { return protocol_.state_name(); }
  uint32_t get_uptime_seconds() const { return protocol_.get_uptime_s(); }
  void publish_entity_state_for_listener_(uint8_t field_index, const uint8_t *value, size_t value_len) {
    this->publish_entity_state_(field_index, value, value_len);
  }

 protected:
  bool setup_transport_();
  bool send_frame_(const uint8_t *mac, const uint8_t *frame, size_t frame_len);
#ifdef USE_ESP8266
  bool scanning_permutations_{false};
  size_t permutation_index_{0};
  uint32_t permutation_scan_start_ms_{0};
  std::array<uint8_t, 6> scan_target_mac_{};
  uint8_t scan_seq_num_{0};
  bool scan_suppress_diag_{false};
  std::array<uint8_t, 16> join_nonce_{};
  uint8_t join_attempt_phase_{0};
  uint32_t join_attempt_start_ms_{0};
  bool send_frame_raw_(const uint8_t *mac, const uint8_t *frame, size_t frame_len);
#else
  bool send_frame_raw_(const uint8_t *mac, const uint8_t *frame, size_t frame_len) { return false; }
#endif
  bool add_peer_(const uint8_t *mac);
  void note_peer_activity_(const uint8_t *mac);
  bool is_peer_protected_(const uint8_t *mac) const;
  bool evict_stale_peer_(const uint8_t *preferred_mac);
  void reset_peer_table_for_parent_(const uint8_t *parent_mac);
  bool init_wifi_and_espnow_();
  void handle_received_frame_(const uint8_t *mac, const uint8_t *data, size_t len);
  void handle_send_status_(const uint8_t *mac, bool success);
  void drain_received_frames_();
  bool apply_command_to_field_(uint8_t field_index, uint8_t flags, const uint8_t *value, size_t value_len);
  static void register_instance_(ESPNow82xxRemote *instance);
  static void on_data_received_(uint8_t *mac, uint8_t *data, uint8_t len);
  static void on_data_sent_(uint8_t *mac, uint8_t status);

  RemoteProtocol protocol_;
  std::string network_id_;
  std::string psk_;
  std::string esphome_name_;
  std::string node_label_;
  std::string espnow_mode_{"regular"};
  uint16_t heartbeat_interval_{ESPNOW_HEARTBEAT_INTERVAL_S};
  bool ota_over_espnow_{false};
  std::vector<std::array<uint8_t, 6>> preferred_parents_{};
  uint8_t espnow_channel_{11};
  bool protocol_ready_{false};
  bool transport_ready_{false};
  bool dynamic_schema_options_refreshed_{false};
  uint32_t rx_packets_{0};
  uint32_t rx_dropped_{0};
  uint32_t tx_ok_{0};
  uint32_t tx_fail_{0};
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
  void log_airtime_status_();
  void log_diagnostic_();
  std::array<uint8_t, 6> sta_mac_{};
  struct PendingRxFrame {
    std::array<uint8_t, 6> mac{};
    std::vector<uint8_t> data;
    int8_t rssi{0};  // ESP8266 ESP-NOW callbacks don't provide RSSI — always 0
  };
  static constexpr size_t MAX_PENDING_RX_FRAMES = 16;
  std::deque<PendingRxFrame> pending_rx_frames_;
  std::map<std::string, uint32_t> peer_last_used_ms_;
  std::set<std::string> protected_peers_;
  void dump_peer_table_();
  void clear_all_peers_();
#ifdef USE_SWITCH
  struct CommandTarget {
    uint8_t field_index;
    switch_::Switch *a_switch;
  };
  std::vector<CommandTarget> command_targets_;
#endif
#ifdef USE_SENSOR
  struct SensorTarget {
    uint8_t field_index;
    sensor::Sensor *sensor;
  };
  std::vector<SensorTarget> sensor_targets_;
#endif
#ifdef USE_BINARY_SENSOR
  struct BinarySensorTarget {
    uint8_t field_index;
    binary_sensor::BinarySensor *binary_sensor;
  };
  std::vector<BinarySensorTarget> binary_sensor_targets_;
#endif
#ifdef USE_BUTTON
  struct ButtonTarget {
    uint8_t field_index;
    button::Button *button;
  };
  std::vector<ButtonTarget> button_targets_;
#endif
#ifdef USE_COVER
  struct CoverCommandTarget {
    uint8_t field_index;
    cover::Cover *a_cover;
  };
  std::vector<CoverCommandTarget> cover_command_targets_;
#endif
#ifdef USE_LOCK
  struct LockCommandTarget {
    uint8_t field_index;
    lock::Lock *a_lock;
  };
  std::vector<LockCommandTarget> lock_command_targets_;
#endif
#ifdef USE_VALVE
  struct ValveCommandTarget {
    uint8_t field_index;
    valve::Valve *a_valve;
  };
  std::vector<ValveCommandTarget> valve_command_targets_;
#endif
#ifdef USE_NUMBER
  struct NumberCommandTarget {
    uint8_t field_index;
    number::Number *a_number;
  };
  std::vector<NumberCommandTarget> number_command_targets_;
#endif
#ifdef USE_ALARM_CONTROL_PANEL
  struct AlarmCommandTarget {
    uint8_t field_index;
    alarm_control_panel::AlarmControlPanel *a_alarm;
  };
  std::vector<AlarmCommandTarget> alarm_command_targets_;
#endif
#ifdef USE_EVENT
  struct EventCommandTarget {
    uint8_t field_index;
    event::Event *a_event;
  };
  std::vector<EventCommandTarget> event_command_targets_;
#endif
#ifdef USE_FAN
  struct FanCommandTarget {
    uint8_t field_index;
    fan::Fan *a_fan;
  };
  std::vector<FanCommandTarget> fan_command_targets_;
#endif
#ifdef USE_LIGHT
  struct LightCommandTarget {
    uint8_t field_index;
    light::LightState *a_light;
  };
  std::vector<LightCommandTarget> light_command_targets_;
#endif
#ifdef USE_SELECT
  struct SelectCommandTarget {
    uint8_t field_index;
    select::Select *a_select;
  };
  std::vector<SelectCommandTarget> select_command_targets_;
#endif
#ifdef USE_TEXT
  struct TextCommandTarget {
    uint8_t field_index;
    text::Text *a_text;
  };
  std::vector<TextCommandTarget> text_command_targets_;
#endif
#ifdef USE_TEXT_SENSOR
  struct TextSensorTarget {
    uint8_t field_index;
    text_sensor::TextSensor *a_text_sensor;
  };
  std::vector<TextSensorTarget> text_sensor_targets_;
#endif
  bool process_command_target_(uint8_t field_index, uint8_t flags, const uint8_t *value, size_t value_len);
  void publish_entity_state_(uint8_t field_index, const uint8_t *value, size_t value_len);
  void refresh_dynamic_schema_options_();
  static ESPNow82xxRemote *active_instance_;
};

}  // namespace esp_tree
}  // namespace esphome
