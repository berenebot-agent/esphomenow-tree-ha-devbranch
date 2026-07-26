#pragma once

#include "remote_protocol.h"

#include <array>
#include <cstdint>
#include <functional>
#include <string>
#include <vector>

namespace esphome {
namespace esp_tree {

class StandaloneRemote {
 public:
  using CommandCallback = std::function<void(uint8_t entity_index, uint8_t flags, const uint8_t* value, size_t value_len)>;

  StandaloneRemote();

  int init(const char* psk_hex, const char* network_id, const char* esphome_name,
           const char* node_label, uint16_t heartbeat_interval_seconds);

  void loop();

  bool is_protocol_ready() const;
  bool is_transport_ready() const;
  const char* get_state_name() const;
  uint32_t get_uptime_seconds() const;

  void set_relay_enabled(bool enabled);
  void set_max_hops(uint8_t max_hops);
  void set_max_discover_pending(uint8_t max_discover_pending);
  void add_preferred_parent(const std::array<uint8_t, 6>& mac);

  void set_command_callback(CommandCallback callback);

  uint8_t add_sensor(const char* name, const char* unit = "", const char* entity_id = nullptr);
  uint8_t add_binary_sensor(const char* name, const char* entity_id = nullptr);
  uint8_t add_switch(const char* name, const char* entity_id = nullptr);
  uint8_t add_button(const char* name, const char* entity_id = nullptr);
  uint8_t add_number(const char* name, const char* unit = "", const char* entity_id = nullptr);
  uint8_t add_text(const char* name, const char* entity_id = nullptr);
  uint8_t add_cover(const char* name, const char* entity_id = nullptr);
  uint8_t add_light(const char* name, const char* entity_id = nullptr);
  uint8_t add_fan(const char* name, const char* entity_id = nullptr);
  uint8_t add_lock(const char* name, const char* entity_id = nullptr);
  uint8_t add_alarm(const char* name, const char* entity_id = nullptr);
  uint8_t add_select(const char* name, const char* entity_id = nullptr);
  uint8_t add_event(const char* name, const char* entity_id = nullptr);
  uint8_t add_valve(const char* name, const char* entity_id = nullptr);
  uint8_t add_text_sensor(const char* name, const char* entity_id = nullptr);

  void update_entity(uint8_t index, float value);
  void update_entity(uint8_t index, bool value);
  void update_entity(uint8_t index, const char* value);
  void update_entity(uint8_t index, const uint8_t* raw, size_t raw_len);

 private:
  static constexpr size_t MAX_PENDING_RX_FRAMES = 16;

  uint8_t register_entity_(espnow_field_type_t type, const char* name,
                           const char* unit, const char* options,
                           const char* entity_id);
  static std::string auto_entity_id_(const char* name);

  bool setup_transport_();
  bool send_frame_(const uint8_t* mac, const uint8_t* frame, size_t frame_len);
  bool add_peer_(const uint8_t* mac);
  void handle_received_frame_(const uint8_t* mac, const uint8_t* data, size_t len, int8_t rssi);
  void drain_received_frames_();

  static void static_on_data_received_(const esp_now_recv_info_t* info, const uint8_t* data, int len);
  static void static_on_data_sent_(const esp_now_send_info_t*, esp_now_send_status_t status);

  RemoteProtocol protocol_;
  std::string psk_;
  std::string network_id_;
  std::string esphome_name_;
  std::string node_label_;
  uint16_t heartbeat_interval_{ESPNOW_HEARTBEAT_INTERVAL_S};
  bool relay_enabled_{true};
  uint8_t max_hops_{ESPNOW_MAX_HOPS_DEFAULT};
  uint8_t max_discover_pending_{ESPNOW_MAX_PENDING_DISCOVER};
  std::vector<std::array<uint8_t, 6>> preferred_parents_;

  CommandCallback command_callback_;

  bool protocol_ready_{false};
  bool transport_ready_{false};
  std::array<uint8_t, 6> sta_mac_{};
  std::vector<PendingRxFrame> pending_rx_frames_;
  void* pending_rx_mutex_{nullptr};

  static StandaloneRemote* active_instance_;
};

namespace helpers {

bool parse_switch(const uint8_t* value, size_t len);
bool parse_binary(const uint8_t* value, size_t len);
float parse_float(const uint8_t* value, size_t len);
int32_t parse_int(const uint8_t* value, size_t len);
std::string parse_string(const uint8_t* value, size_t len);

}  // namespace helpers
}  // namespace esp_tree
}  // namespace esphome