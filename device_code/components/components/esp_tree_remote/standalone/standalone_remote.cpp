#include "standalone_remote.h"

#include <esp_err.h>
#include <esp_wifi.h>
#include <esp_timer.h>
#include <esp_now.h>
#include <freertos/FreeRTOS.h>
#include <freertos/semphr.h>

#include <algorithm>
#include <cstring>

namespace esphome {
namespace esp_tree {

StandaloneRemote* StandaloneRemote::active_instance_ = nullptr;

StandaloneRemote::StandaloneRemote() = default;

static wifi_mode_t s_wifi_mode{WIFI_MODE_NULL};

static void wifi_init_() {
  if (s_wifi_mode != WIFI_MODE_NULL) return;

  wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
  esp_err_t err = esp_wifi_init(&cfg);
  if (err != ESP_OK) return;

  err = esp_wifi_set_mode(WIFI_MODE_STA);
  if (err != ESP_OK) return;

  err = esp_wifi_start();
  if (err != ESP_OK) return;

  s_wifi_mode = WIFI_MODE_STA;
}

bool StandaloneRemote::setup_transport_() {
  active_instance_ = this;

  pending_rx_mutex_ = xSemaphoreCreateMutex();
  if (pending_rx_mutex_ == nullptr) {
    return false;
  }

  esp_err_t err = esp_now_init();
  if (err != ESP_OK) {
    return false;
  }

  esp_now_register_recv_cb(static_on_data_received_);
  esp_now_register_send_cb(static_on_data_sent_);

  esp_wifi_get_mac(WIFI_IF_STA, sta_mac_.data());
  protocol_.set_local_mac(sta_mac_.data());

  protocol_.set_relay_config(relay_enabled_, max_hops_, max_discover_pending_);
  for (const auto& mac : preferred_parents_) {
    protocol_.add_preferred_parent(mac);
  }

  protocol_.set_send_fn([this](const uint8_t* mac, const uint8_t* frame, size_t frame_len) -> bool {
    return this->send_frame_(mac, frame, frame_len);
  });

  protocol_.set_command_fn([this](uint8_t entity_index, uint8_t flags, const uint8_t* value, size_t value_len) {
    if (command_callback_) {
      command_callback_(entity_index, flags, value, value_len);
    }
  });

  transport_ready_ = true;
  return true;
}

int StandaloneRemote::init(const char* psk_hex, const char* network_id, const char* esphome_name,
                           const char* node_label, uint16_t heartbeat_interval_seconds) {
  psk_ = psk_hex;
  network_id_ = network_id;
  esphome_name_ = esphome_name;
  node_label_ = node_label;
  heartbeat_interval_ = heartbeat_interval_seconds;

  wifi_init_();

  int ret = protocol_.init(psk_hex, network_id, esphome_name, node_label, 0, "", "",
                           heartbeat_interval_seconds);
  if (ret != 0) {
    return ret;
  }
  protocol_ready_ = true;

  if (!setup_transport_()) {
    return -1;
  }

  return 0;
}

void StandaloneRemote::loop() {
  drain_received_frames_();
  protocol_.loop();
  protocol_.flush_log_queue();
}

bool StandaloneRemote::is_protocol_ready() const { return protocol_ready_; }
bool StandaloneRemote::is_transport_ready() const { return transport_ready_; }
const char* StandaloneRemote::get_state_name() const { return protocol_.state_name(); }
uint32_t StandaloneRemote::get_uptime_seconds() const { return protocol_.get_uptime_s(); }

void StandaloneRemote::set_relay_enabled(bool enabled) { relay_enabled_ = enabled; }
void StandaloneRemote::set_max_hops(uint8_t max_hops) { max_hops_ = max_hops; }
void StandaloneRemote::set_max_discover_pending(uint8_t max_discover_pending) { max_discover_pending_ = max_discover_pending; }
void StandaloneRemote::add_preferred_parent(const std::array<uint8_t, 6>& mac) { preferred_parents_.push_back(mac); }

void StandaloneRemote::set_command_callback(CommandCallback callback) { command_callback_ = std::move(callback); }

std::string StandaloneRemote::auto_entity_id_(const char* name) {
  std::string id;
  id.reserve(32);
  bool next_underscore = false;
  for (const char* p = name; *p && id.size() < 32; ++p) {
    char c = *p;
    if ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')) {
      if (next_underscore && !id.empty()) {
        id += '_';
        next_underscore = false;
      }
      id += c;
    } else if (c >= 'A' && c <= 'Z') {
      if (next_underscore && !id.empty()) {
        id += '_';
        next_underscore = false;
      }
      id += (c + ('a' - 'A'));
    } else if (c == ' ' || c == '-' || c == '.') {
      next_underscore = true;
    }
  }
  if (id.empty()) id = "entity";
  return id;
}

uint8_t StandaloneRemote::register_entity_(espnow_field_type_t type, const char* name,
                                            const char* unit, const char* options,
                                            const char* entity_id) {
  const char* id = entity_id && entity_id[0] ? entity_id : auto_entity_id_(name).c_str();
  return protocol_.register_entity(type, name, unit, options, id);
}

uint8_t StandaloneRemote::add_sensor(const char* name, const char* unit, const char* entity_id) {
  return register_entity_(FIELD_TYPE_SENSOR, name, unit, "", entity_id);
}
uint8_t StandaloneRemote::add_binary_sensor(const char* name, const char* entity_id) {
  return register_entity_(FIELD_TYPE_BINARY, name, "", "", entity_id);
}
uint8_t StandaloneRemote::add_switch(const char* name, const char* entity_id) {
  return register_entity_(FIELD_TYPE_SWITCH, name, "", "", entity_id);
}
uint8_t StandaloneRemote::add_button(const char* name, const char* entity_id) {
  return register_entity_(FIELD_TYPE_BUTTON, name, "", "", entity_id);
}
uint8_t StandaloneRemote::add_number(const char* name, const char* unit, const char* entity_id) {
  return register_entity_(FIELD_TYPE_NUMBER, name, unit, "", entity_id);
}
uint8_t StandaloneRemote::add_text(const char* name, const char* entity_id) {
  return register_entity_(FIELD_TYPE_TEXT, name, "", "", entity_id);
}
uint8_t StandaloneRemote::add_cover(const char* name, const char* entity_id) {
  return register_entity_(FIELD_TYPE_COVER, name, "", "", entity_id);
}
uint8_t StandaloneRemote::add_light(const char* name, const char* entity_id) {
  return register_entity_(FIELD_TYPE_LIGHT, name, "", "", entity_id);
}
uint8_t StandaloneRemote::add_fan(const char* name, const char* entity_id) {
  return register_entity_(FIELD_TYPE_FAN, name, "", "", entity_id);
}
uint8_t StandaloneRemote::add_lock(const char* name, const char* entity_id) {
  return register_entity_(FIELD_TYPE_LOCK, name, "", "", entity_id);
}
uint8_t StandaloneRemote::add_alarm(const char* name, const char* entity_id) {
  return register_entity_(FIELD_TYPE_ALARM, name, "", "", entity_id);
}
uint8_t StandaloneRemote::add_select(const char* name, const char* entity_id) {
  return register_entity_(FIELD_TYPE_SELECT, name, "", "", entity_id);
}
uint8_t StandaloneRemote::add_event(const char* name, const char* entity_id) {
  return register_entity_(FIELD_TYPE_EVENT, name, "", "", entity_id);
}
uint8_t StandaloneRemote::add_valve(const char* name, const char* entity_id) {
  return register_entity_(FIELD_TYPE_VALVE, name, "", "", entity_id);
}
uint8_t StandaloneRemote::add_text_sensor(const char* name, const char* entity_id) {
  return register_entity_(FIELD_TYPE_TEXT_SENSOR, name, "", "", entity_id);
}

void StandaloneRemote::update_entity(uint8_t index, float value) {
  uint8_t buf[sizeof(float)];
  memcpy(buf, &value, sizeof(value));
  protocol_.on_entity_state_change(index, buf, sizeof(value));
}

void StandaloneRemote::update_entity(uint8_t index, bool value) {
  uint8_t buf[1] = {value ? 1 : 0};
  protocol_.on_entity_state_change(index, buf, 1);
}

void StandaloneRemote::update_entity(uint8_t index, const char* value) {
  protocol_.on_entity_text_change(index, std::string(value));
}

void StandaloneRemote::update_entity(uint8_t index, const uint8_t* raw, size_t raw_len) {
  protocol_.on_entity_state_change(index, raw, raw_len);
}

bool StandaloneRemote::add_peer_(const uint8_t* mac) {
  if (mac == nullptr) return false;
  if (esp_now_is_peer_exist(mac)) return true;
  esp_now_peer_info_t peer{};
  memcpy(peer.peer_addr, mac, 6);
  peer.channel = 0;
  peer.encrypt = false;
#if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(5, 0, 0)
  peer.ifidx = WIFI_IF_STA;
#endif
  return esp_now_add_peer(&peer) == ESP_OK;
}

bool StandaloneRemote::send_frame_(const uint8_t* mac, const uint8_t* frame, size_t frame_len) {
  if (mac == nullptr) return false;
  if (!add_peer_(mac)) return false;
  return esp_now_send(mac, frame, frame_len) == ESP_OK;
}

void StandaloneRemote::handle_received_frame_(const uint8_t* mac, const uint8_t* data, size_t len, int8_t rssi) {
  if (mac == nullptr || data == nullptr || len == 0) return;
  if (pending_rx_mutex_ == nullptr) return;
  if (xSemaphoreTake(pending_rx_mutex_, 0) != pdTRUE) return;
  if (pending_rx_frames_.size() >= MAX_PENDING_RX_FRAMES) {
    xSemaphoreGive(pending_rx_mutex_);
    return;
  }
  PendingRxFrame frame{};
  memcpy(frame.mac.data(), mac, frame.mac.size());
  frame.data.assign(data, data + len);
  frame.rssi = rssi;
  pending_rx_frames_.push_back(std::move(frame));
  xSemaphoreGive(pending_rx_mutex_);
}

void StandaloneRemote::drain_received_frames_() {
  if (pending_rx_mutex_ == nullptr) return;
  std::vector<PendingRxFrame> pending;
  {
    if (xSemaphoreTake(pending_rx_mutex_, portMAX_DELAY) != pdTRUE) return;
    pending = std::move(pending_rx_frames_);
    if (!pending_rx_frames_.empty()) pending_rx_frames_.clear();
    xSemaphoreGive(pending_rx_mutex_);
  }
  for (auto& frame : pending) {
    protocol_.on_espnow_frame(frame.mac.data(), frame.data.data(), frame.data.size(), frame.rssi);
  }
}

#if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(5, 0, 0)
void StandaloneRemote::static_on_data_received_(const esp_now_recv_info_t* info, const uint8_t* data, int len) {
  if (active_instance_ == nullptr || info == nullptr || info->src_addr == nullptr) return;
  int8_t rssi = (info->rx_ctrl != nullptr) ? info->rx_ctrl->rssi : 0;
  active_instance_->handle_received_frame_(info->src_addr, data, static_cast<size_t>(len), rssi);
}
#else
void StandaloneRemote::static_on_data_received_(const uint8_t* mac, const uint8_t* data, int len) {
  if (active_instance_ == nullptr) return;
  active_instance_->handle_received_frame_(mac, data, static_cast<size_t>(len), 0);
}
#endif

void StandaloneRemote::static_on_data_sent_(const esp_now_send_info_t*, esp_now_send_status_t status) {
  (void)status;
}

namespace helpers {

bool parse_switch(const uint8_t* value, size_t len) {
  if (value == nullptr || len == 0) return false;
  return value[0] != 0;
}

bool parse_binary(const uint8_t* value, size_t len) {
  return parse_switch(value, len);
}

float parse_float(const uint8_t* value, size_t len) {
  if (value == nullptr || len < sizeof(float)) return 0.0f;
  float decoded = 0.0f;
  memcpy(&decoded, value, sizeof(decoded));
  return decoded;
}

int32_t parse_int(const uint8_t* value, size_t len) {
  if (value == nullptr || len < sizeof(int32_t)) return 0;
  int32_t decoded = 0;
  memcpy(&decoded, value, sizeof(decoded));
  return decoded;
}

std::string parse_string(const uint8_t* value, size_t len) {
  if (value == nullptr || len == 0) return {};
  return std::string(reinterpret_cast<const char*>(value), len);
}

}  // namespace helpers
}  // namespace esp_tree
}  // namespace esphome
