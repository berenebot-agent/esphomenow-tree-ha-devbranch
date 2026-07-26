#include "esp_tree_remote.h"

#include "esphome/core/application.h"
#include "esphome/core/defines.h"

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
#include "esphome/components/light/color_mode.h"
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
#include "esphome/core/log.h"

#include <algorithm>
#include <cinttypes>
#include <cmath>
#include <esp_err.h>
#include <esp_ota_ops.h>
#include <esp_app_desc.h>
#include <esp_wifi.h>

#include <ctime>

namespace esphome {
namespace esp_tree {

static const char *const TAG = "espnow";
ESPNowLRRemote *ESPNowLRRemote::active_instance_ = nullptr;

namespace {

static const char *project_name_() {
#ifdef ESPHOME_PROJECT_NAME
  return ESPHOME_PROJECT_NAME;
#else
  return "";
#endif
}

static const char *project_version_() {
#ifdef ESPHOME_PROJECT_VERSION
  return ESPHOME_PROJECT_VERSION;
#else
  return "";
#endif
}

static constexpr uint8_t POSITION_COMMAND_SET_POSITION = 0;
static constexpr uint8_t POSITION_COMMAND_OPEN = 1;
static constexpr uint8_t POSITION_COMMAND_CLOSE = 2;
static constexpr uint8_t POSITION_COMMAND_STOP = 3;

static uint32_t calc_airtime_lr_us_(size_t frame_bytes) {
  return 336 + 16 * static_cast<uint32_t>(frame_bytes);
}

static bool parse_mac_hex_(const std::string &mac_hex_str, uint8_t mac[6]) {
  if (mac == nullptr || mac_hex_str.size() != 12) return false;
  unsigned values[6]{};
  if (sscanf(mac_hex_str.c_str(), "%2x%2x%2x%2x%2x%2x",
             &values[0], &values[1], &values[2], &values[3], &values[4], &values[5]) != 6) {
    return false;
  }
  for (size_t i = 0; i < 6; ++i) {
    mac[i] = static_cast<uint8_t>(values[i]);
  }
  return true;
}

static std::string format_uptime(uint32_t uptime_s) {
  if (uptime_s < 60) {
    return std::to_string(uptime_s) + "s";
  } else if (uptime_s < 3600) {
    return std::to_string(uptime_s / 60) + "m";
  } else if (uptime_s < 86400) {
    const uint32_t h = uptime_s / 3600;
    const uint32_t m = (uptime_s % 3600) / 60;
    if (m == 0) return std::to_string(h) + "h";
    char buf[16];
    snprintf(buf, sizeof(buf), "%.1fh", uptime_s / 3600.0f);
    return std::string(buf);
  } else {
    const uint32_t d = uptime_s / 86400;
    const uint32_t h = (uptime_s % 86400) / 3600;
    char buf[16];
    snprintf(buf, sizeof(buf), "%dd%dh", d, h);
    return std::string(buf);
  }
}

static void encode_float(float value, uint8_t* out, size_t out_len) {
  memset(out, 0, out_len);
  memcpy(out, &value, sizeof(value));
}

static float decode_float(const uint8_t* value, size_t value_len) {
  if (value_len < sizeof(float)) return 0.0f;
  float decoded = 0.0f;
  memcpy(&decoded, value, sizeof(decoded));
  return decoded;
}

static uint8_t clamp_u8(int value) {
  return static_cast<uint8_t>(std::max(0, std::min(255, value)));
}

static uint8_t clamp_percent_u8(float normalized) {
  return clamp_u8(static_cast<int>(std::lround(std::max(0.0f, std::min(1.0f, normalized)) * 100.0f)));
}

static float percent_to_normalized(uint8_t value) {
  return static_cast<float>(value) / 100.0f;
}

static void rgb_to_hsv_u8(float r, float g, float b, uint8_t &h, uint8_t &s, uint8_t &v) {
  const float max_v = std::max({r, g, b});
  const float min_v = std::min({r, g, b});
  const float delta = max_v - min_v;
  float hue = 0.0f;
  if (delta > 0.0001f) {
    if (max_v == r) {
      hue = 60.0f * std::fmod(((g - b) / delta), 6.0f);
    } else if (max_v == g) {
      hue = 60.0f * (((b - r) / delta) + 2.0f);
    } else {
      hue = 60.0f * (((r - g) / delta) + 4.0f);
    }
  }
  if (hue < 0.0f) hue += 360.0f;
  const float sat = max_v <= 0.0001f ? 0.0f : delta / max_v;
  h = clamp_u8(static_cast<int>(std::lround((hue / 360.0f) * 255.0f)));
  s = clamp_u8(static_cast<int>(std::lround(sat * 255.0f)));
  v = clamp_u8(static_cast<int>(std::lround(max_v * 255.0f)));
}

static void hsv_u8_to_rgb(uint8_t h, uint8_t s, uint8_t v, float &r, float &g, float &b) {
  const float hue = (static_cast<float>(h) / 255.0f) * 360.0f;
  const float sat = static_cast<float>(s) / 255.0f;
  const float val = static_cast<float>(v) / 255.0f;
  const float c = val * sat;
  const float x = c * (1.0f - std::fabs(std::fmod(hue / 60.0f, 2.0f) - 1.0f));
  const float m = val - c;
  float rp = 0.0f, gp = 0.0f, bp = 0.0f;
  if (hue < 60.0f) {
    rp = c; gp = x;
  } else if (hue < 120.0f) {
    rp = x; gp = c;
  } else if (hue < 180.0f) {
    gp = c; bp = x;
  } else if (hue < 240.0f) {
    gp = x; bp = c;
  } else if (hue < 300.0f) {
    rp = x; bp = c;
  } else {
    rp = c; bp = x;
  }
  r = rp + m;
  g = gp + m;
  b = bp + m;
}

static void append_option_(std::string &options, const std::string &key, const std::string &value) {
  if (!options.empty()) options.push_back(';');
  options += key;
  options.push_back('=');
  options += value;
}

#ifdef USE_LIGHT
static std::string light_supported_color_modes_(const light::LightTraits &traits) {
  std::vector<std::string> modes;
  if (traits.supports_color_mode(light::ColorMode::ON_OFF))
    modes.emplace_back("onoff");
  if (traits.supports_color_mode(light::ColorMode::BRIGHTNESS))
    modes.emplace_back("brightness");
  if (traits.supports_color_mode(light::ColorMode::WHITE))
    modes.emplace_back("white");
  if (traits.supports_color_mode(light::ColorMode::COLOR_TEMPERATURE) ||
      traits.supports_color_mode(light::ColorMode::COLD_WARM_WHITE))
    modes.emplace_back("color_temp");
  if (traits.supports_color_mode(light::ColorMode::RGB))
    modes.emplace_back("rgb");
  if (traits.supports_color_mode(light::ColorMode::RGB_WHITE) ||
      traits.supports_color_mode(light::ColorMode::RGB_COLOR_TEMPERATURE))
    modes.emplace_back("rgbw");
  if (traits.supports_color_mode(light::ColorMode::RGB_COLD_WARM_WHITE))
    modes.emplace_back("rgbww");

  std::string joined;
  for (size_t i = 0; i < modes.size(); i++) {
    if (i > 0) joined.push_back('|');
    joined += modes[i];
  }
  return joined;
}
#endif

#ifdef USE_FAN
static std::string fan_schema_options_(fan::Fan *a_fan) {
  const auto traits = a_fan->get_traits();
  std::string options;
  append_option_(options, "speed_count", std::to_string(traits.supports_speed() ? std::max(0, traits.supported_speed_count()) : 0));
  append_option_(options, "oscillation", traits.supports_oscillation() ? "1" : "0");
  append_option_(options, "direction", traits.supports_direction() ? "1" : "0");
  if (traits.supports_preset_modes()) {
    std::string presets;
    const auto &preset_modes = traits.supported_preset_modes();
    for (size_t i = 0; i < preset_modes.size(); i++) {
      if (i > 0) presets.push_back('|');
      presets += preset_modes[i];
    }
    append_option_(options, "presets", presets);
  }
  return options;
}
#endif

#ifdef USE_LIGHT
static std::string light_schema_options_(light::LightState *a_light) {
  const auto traits = a_light->get_traits();
  std::string options;
  append_option_(options, "color_modes", light_supported_color_modes_(traits));
  if (traits.supports_color_mode(light::ColorMode::COLOR_TEMPERATURE) ||
      traits.supports_color_mode(light::ColorMode::COLD_WARM_WHITE) ||
      traits.supports_color_mode(light::ColorMode::RGB_COLOR_TEMPERATURE)) {
    append_option_(options, "min_mireds", std::to_string(traits.get_min_mireds()));
    append_option_(options, "max_mireds", std::to_string(traits.get_max_mireds()));
  }
  if (a_light->supports_effects()) {
    std::string effect_names;
    bool first = true;
    for (auto *effect : a_light->get_effects()) {
      if (!first) effect_names.push_back('|');
      effect_names += effect->get_name().c_str();
      first = false;
    }
    append_option_(options, "effects", effect_names);
  }
  return options;
}
#endif

}  // namespace

ESPNowLRRemote::ESPNowLRRemote() = default;

void ESPNowLRRemote::clear_ota_rollback_state_() {
#if defined(ESP_PLATFORM)
  const esp_partition_t *running = esp_ota_get_running_partition();
  if (running == nullptr) {
    return;
  }
  esp_ota_img_states_t state;
  if (esp_ota_get_state_partition(running, &state) == ESP_OK && state == ESP_OTA_IMG_PENDING_VERIFY) {
    ESP_LOGW(TAG, "OTA partition in PENDING_VERIFY state, marking app as valid to clear rollback flag");
    ESP_ERROR_CHECK(esp_ota_mark_app_valid_cancel_rollback());
  }
#endif
}

void ESPNowLRRemote::register_instance_(ESPNowLRRemote *instance) { active_instance_ = instance; }

bool ESPNowLRRemote::init_wifi_and_espnow_() {
  wifi_mode_t current_mode;
  if (esp_wifi_get_mode(&current_mode) == ESP_ERR_WIFI_NOT_INIT) {
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));
    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
    wifi_protocols_t protocols{};
    protocols.ghz_2g = (espnow_mode_ == "lr") ? WIFI_PROTOCOL_LR : WIFI_PROTOCOL_11N;
    ESP_ERROR_CHECK(esp_wifi_set_protocols(WIFI_IF_STA, &protocols));
  }
  if (esp_now_init() != ESP_OK) return false;
#if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(5, 4, 0)
  if (!force_v1_packet_size_) {
    uint32_t espnow_version = 1;
    esp_now_get_version(&espnow_version);
    if (espnow_version >= 2) {
      protocol_.set_session_flags(ESPNOW_SESSION_FLAG_V2_MTU);
      ESP_LOGI(TAG, "ESP-NOW V2 radio detected (version=%u), enabling V2 MTU", static_cast<unsigned>(espnow_version));
    } else {
      ESP_LOGI(TAG, "ESP-NOW V1 radio (version=%u), MTU limited to %u bytes", static_cast<unsigned>(espnow_version), static_cast<unsigned>(ESPNOW_V1_MAX_PAYLOAD));
    }
  } else {
    ESP_LOGI(TAG, "force_v1_packet_size active, using V1 MTU (%u bytes)", static_cast<unsigned>(ESPNOW_V1_MAX_PAYLOAD));
  }
#else
  ESP_LOGI(TAG, "ESP-NOW V1 radio (IDF < 5.4), MTU limited to %u bytes", static_cast<unsigned>(ESPNOW_V1_MAX_PAYLOAD));
#endif
  esp_now_register_recv_cb(
#if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(5, 0, 0)
      on_data_received_
#else
      on_data_received_
#endif
  );
  esp_now_register_send_cb(
#if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(5, 0, 0)
      on_data_sent_
#else
      on_data_sent_
#endif
  );
  return true;
}
bool ESPNowLRRemote::add_peer_(const uint8_t *mac) {
  if (mac == nullptr) return false;
  if (esp_now_is_peer_exist(mac)) {
    note_peer_activity_(mac);
    return true;
  }
  esp_now_peer_info_t peer{};
  memcpy(peer.peer_addr, mac, 6);
  peer.channel = 0;
  peer.encrypt = false;
#if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(5, 0, 0)
  peer.ifidx = WIFI_IF_STA;
#endif
  esp_err_t err = esp_now_add_peer(&peer);
  if (err == ESP_OK) {
    note_peer_activity_(mac);
    return true;
  }

  ESP_LOGW(TAG, "esp_now_add_peer failed for %s (err=%d), attempting stale peer eviction",
           mac_hex(mac).c_str(), static_cast<int>(err));
  if (!evict_stale_peer_(mac)) {
    return false;
  }

  err = esp_now_add_peer(&peer);
  if (err == ESP_OK) {
    note_peer_activity_(mac);
    return true;
  }

  ESP_LOGW(TAG, "esp_now_add_peer retry failed for %s (err=%d)", mac_hex(mac).c_str(), static_cast<int>(err));
  return false;
}

void ESPNowLRRemote::note_peer_activity_(const uint8_t *mac) {
  if (mac == nullptr) return;
  peer_last_used_ms_[mac_hex(mac)] = millis();
}

bool ESPNowLRRemote::is_peer_protected_(const uint8_t *mac) const {
  if (mac == nullptr) return false;
  if (protocol_.has_parent() && memcmp(protocol_.parent_mac().data(), mac, 6) == 0) return true;
  for (const auto &preferred_parent : preferred_parents_) {
    if (memcmp(preferred_parent.data(), mac, 6) == 0) return true;
  }
  for (const auto &route : protocol_.routes()) {
    if (memcmp(route.next_hop_mac.data(), mac, 6) == 0) return true;
    if (memcmp(route.leaf_mac.data(), mac, 6) == 0) return true;
  }
  return false;
}

bool ESPNowLRRemote::evict_stale_peer_(const uint8_t *preferred_mac) {
  if (peer_last_used_ms_.empty()) return false;

  auto best_it = peer_last_used_ms_.end();
  for (auto it = peer_last_used_ms_.begin(); it != peer_last_used_ms_.end(); ++it) {
    uint8_t mac[6]{};
    if (!parse_mac_hex_(it->first, mac)) continue;
    if (preferred_mac != nullptr && memcmp(mac, preferred_mac, sizeof(mac)) == 0) continue;
    if (is_peer_protected_(mac)) continue;
    if (best_it == peer_last_used_ms_.end() || it->second < best_it->second) {
      best_it = it;
    }
  }

  if (best_it == peer_last_used_ms_.end()) return false;

  uint8_t evict_mac[6]{};
  if (!parse_mac_hex_(best_it->first, evict_mac)) {
    peer_last_used_ms_.erase(best_it);
    return false;
  }

  const std::string evict_mac_str = best_it->first;
  const uint32_t age_ms = millis() - best_it->second;
  peer_last_used_ms_.erase(best_it);
  esp_err_t err = esp_now_del_peer(evict_mac);
  if (err != ESP_OK) {
    ESP_LOGW(TAG, "esp_now_del_peer failed for stale peer %s (err=%d)", evict_mac_str.c_str(), static_cast<int>(err));
    return false;
  }

  ESP_LOGW(TAG, "Evicted stale ESP-NOW peer %s (idle %ums) to free peer slot", evict_mac_str.c_str(), age_ms);
  return true;
}

bool ESPNowLRRemote::send_frame_(const uint8_t *mac, const uint8_t *frame, size_t frame_len) {
  if (mac != nullptr && !add_peer_(mac)) {
    ESP_LOGW(TAG, "ESP-NOW send aborted: no peer slot available for %s", mac_hex(mac).c_str());
    return false;
  }
  rolling_airtime_.tx_airtime_us += calc_airtime_lr_us_(frame_len);
  rolling_airtime_.tx_packets++;
  if (mac != nullptr) note_peer_activity_(mac);
  return esp_now_send(mac, frame, frame_len) == ESP_OK;
}

#ifdef USE_SENSOR
void ESPNowLRRemote::register_sensor_entity(sensor::Sensor *sensor, const char *entity_id) {
  if (sensor == nullptr) return;
  const uint8_t idx = protocol_.register_entity(FIELD_TYPE_SENSOR, sensor->get_name().c_str(), sensor->get_unit_of_measurement_ref().c_str(), "", entity_id);
  sensor_targets_.push_back({idx, sensor});
  sensor->add_on_state_callback([this, idx](float state) {
    uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN];
    encode_float(state, value, sizeof(float));
    this->publish_entity_state_(idx, value, sizeof(float));
  });
  if (sensor->has_state()) {
    const float state = sensor->get_state();
    if (!std::isnan(state)) {
      uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN];
      encode_float(state, value, sizeof(float));
      this->publish_entity_state_(idx, value, sizeof(float));
    }
  }
}
#endif

#ifdef USE_SWITCH
void ESPNowLRRemote::register_switch_entity(switch_::Switch *a_switch, const char *entity_id) {
  if (a_switch == nullptr) return;
  const uint8_t idx = protocol_.register_entity(FIELD_TYPE_SWITCH, a_switch->get_name().c_str(), "", "", entity_id);
  command_targets_.push_back({idx, a_switch});
  a_switch->add_on_state_callback([this, idx](bool state) {
    uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN]{};
    value[0] = state ? 1 : 0;
    this->publish_entity_state_(idx, value, 1);
  });
  if (auto initial_state = a_switch->get_initial_state_with_restore_mode(); initial_state.has_value()) {
    uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN]{};
    value[0] = *initial_state ? 1 : 0;
    this->publish_entity_state_(idx, value, 1);
  }
}
#endif

#ifdef USE_BINARY_SENSOR
void ESPNowLRRemote::register_binary_sensor_entity(binary_sensor::BinarySensor *binary_sensor, const char *entity_id) {
  if (binary_sensor == nullptr) return;
  const uint8_t idx = protocol_.register_entity(FIELD_TYPE_BINARY, binary_sensor->get_name().c_str(), "", "", entity_id);
  binary_sensor_targets_.push_back({idx, binary_sensor});
  binary_sensor->add_on_state_callback([this, idx](bool state) {
    uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN]{};
    value[0] = state ? 1 : 0;
    this->publish_entity_state_(idx, value, 1);
  });
  if (binary_sensor->has_state()) {
    uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN]{};
    value[0] = binary_sensor->get_state() ? 1 : 0;
    this->publish_entity_state_(idx, value, 1);
  }
}
#endif

#ifdef USE_BUTTON
void ESPNowLRRemote::register_button_entity(button::Button *button, const char *entity_id) {
  if (button == nullptr) return;
  const uint8_t idx = protocol_.register_entity(FIELD_TYPE_BUTTON, button->get_name().c_str(), "", "", entity_id);
  button_targets_.push_back({idx, button});
  button->add_on_press_callback([this, idx]() {
    uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN]{};
    value[0] = 1;
    this->publish_entity_state_(idx, value, 1);
  });
}
#endif

#ifdef USE_COVER
void ESPNowLRRemote::register_cover_entity(cover::Cover *a_cover, const char *entity_id) {
  if (a_cover == nullptr) return;
  const uint8_t idx = protocol_.register_entity(FIELD_TYPE_COVER, a_cover->get_name().c_str(), "", "", entity_id);
  cover_command_targets_.push_back({idx, a_cover});
  a_cover->add_on_state_callback([this, idx, a_cover]() {
    uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN]{};
    value[0] = clamp_percent_u8(a_cover->position);
    this->publish_entity_state_(idx, value, 1);
  });
  uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN]{};
  value[0] = clamp_percent_u8(a_cover->position);
  this->publish_entity_state_(idx, value, 1);
}
#endif

#ifdef USE_LOCK
void ESPNowLRRemote::register_lock_entity(lock::Lock *a_lock, const char *entity_id) {
  if (a_lock == nullptr) return;
  const uint8_t idx = protocol_.register_entity(FIELD_TYPE_LOCK, a_lock->get_name().c_str(), "", "", entity_id);
  lock_command_targets_.push_back({idx, a_lock});
  a_lock->add_on_state_callback([this, idx](lock::LockState state) {
    uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN]{};
    switch (state) {
      case lock::LOCK_STATE_LOCKED: value[0] = 1; break;
      case lock::LOCK_STATE_JAMMED: value[0] = 2; break;
      default: value[0] = 0; break;
    }
    this->publish_entity_state_(idx, value, 1);
  });
  uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN]{};
  switch (a_lock->state) {
    case lock::LOCK_STATE_LOCKED: value[0] = 1; break;
    case lock::LOCK_STATE_JAMMED: value[0] = 2; break;
    default: value[0] = 0; break;
  }
  this->publish_entity_state_(idx, value, 1);
}
#endif

#ifdef USE_NUMBER
void ESPNowLRRemote::register_number_entity(number::Number *a_number, const char *entity_id) {
  if (a_number == nullptr) return;
  char options[96];
  snprintf(options, sizeof(options), "min=%g;max=%g;step=%g", a_number->traits.get_min_value(), a_number->traits.get_max_value(),
           a_number->traits.get_step());
  const uint8_t idx = protocol_.register_entity(FIELD_TYPE_NUMBER, a_number->get_name().c_str(),
                                                a_number->get_unit_of_measurement_ref().c_str(), options, entity_id);
  number_command_targets_.push_back({idx, a_number});
  a_number->add_on_state_callback([this, idx](float state) {
    uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN];
    encode_float(state, value, sizeof(float));
    this->publish_entity_state_(idx, value, sizeof(float));
  });
  if (!std::isnan(a_number->state)) {
    uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN];
    encode_float(a_number->state, value, sizeof(a_number->state));
    this->publish_entity_state_(idx, value, sizeof(float));
  }
}
#endif

#ifdef USE_VALVE
void ESPNowLRRemote::register_valve_entity(valve::Valve *a_valve, const char *entity_id) {
  if (a_valve == nullptr) return;
  const uint8_t idx = protocol_.register_entity(FIELD_TYPE_VALVE, a_valve->get_name().c_str(), "", "", entity_id);
  valve_command_targets_.push_back({idx, a_valve});
  a_valve->add_on_state_callback([this, idx, a_valve]() {
    uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN]{};
    value[0] = clamp_percent_u8(a_valve->position);
    this->publish_entity_state_(idx, value, 1);
  });
  uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN]{};
  value[0] = clamp_percent_u8(a_valve->position);
  this->publish_entity_state_(idx, value, 1);
}
#endif

#ifdef USE_ALARM_CONTROL_PANEL
void ESPNowLRRemote::register_alarm_control_panel_entity(alarm_control_panel::AlarmControlPanel *a_alarm, const char *entity_id) {
  if (a_alarm == nullptr) return;
  char options[96];
  snprintf(options, sizeof(options), "features=%" PRIu32 ";requires_code=%d;requires_code_to_arm=%d",
           a_alarm->get_supported_features(), a_alarm->get_requires_code() ? 1 : 0,
           a_alarm->get_requires_code_to_arm() ? 1 : 0);
  const uint8_t idx = protocol_.register_entity(FIELD_TYPE_ALARM, a_alarm->get_name().c_str(), "", options, entity_id);
  alarm_command_targets_.push_back({idx, a_alarm});
  a_alarm->add_on_state_callback([this, idx](alarm_control_panel::AlarmControlPanelState state) {
    uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN]{};
    value[0] = static_cast<uint8_t>(state);
    this->publish_entity_state_(idx, value, 1);
  });
  uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN]{};
  value[0] = static_cast<uint8_t>(a_alarm->get_state());
  this->publish_entity_state_(idx, value, 1);
}
#endif

#ifdef USE_EVENT
void ESPNowLRRemote::register_event_entity(event::Event *a_event, const char *entity_id) {
  if (a_event == nullptr) return;
  std::string options = "options=";
  bool first = true;
  for (const auto &event_type : a_event->get_event_types()) {
    if (!first) options.push_back('|');
    options += event_type;
    first = false;
  }
  const uint8_t idx = protocol_.register_entity(FIELD_TYPE_EVENT, a_event->get_name().c_str(), "", options.c_str(), entity_id);
  event_command_targets_.push_back({idx, a_event});
  a_event->add_on_event_callback([this, idx](StringRef event_type) {
    this->publish_entity_state_(idx, reinterpret_cast<const uint8_t *>(event_type.c_str()), event_type.size());
  });
}
#endif

#ifdef USE_FAN
void ESPNowLRRemote::register_fan_entity(fan::Fan *a_fan, const char *entity_id) {
  if (a_fan == nullptr) return;
  const std::string options = fan_schema_options_(a_fan);
  const uint8_t idx = protocol_.register_entity(FIELD_TYPE_FAN, a_fan->get_name().c_str(), "", options.c_str(), entity_id);
  fan_command_targets_.push_back({idx, a_fan});
  a_fan->add_on_state_callback([this, idx, a_fan]() {
    uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN]{};
    value[0] = a_fan->state ? 1 : 0;
    value[1] = clamp_u8(a_fan->speed);
    value[2] = a_fan->oscillating ? 1 : 0;
    value[3] = a_fan->direction == fan::FanDirection::REVERSE ? 1 : 0;
    this->publish_entity_state_(idx, value, 4);
  });
  uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN]{};
  value[0] = a_fan->state ? 1 : 0;
  value[1] = clamp_u8(a_fan->speed);
  value[2] = a_fan->oscillating ? 1 : 0;
  value[3] = a_fan->direction == fan::FanDirection::REVERSE ? 1 : 0;
  this->publish_entity_state_(idx, value, 4);
}
#endif

#ifdef USE_LIGHT
void ESPNowLRRemote::register_light_entity(light::LightState *a_light, const char *entity_id) {
  if (a_light == nullptr) return;
  const std::string options = light_schema_options_(a_light);
  const uint8_t idx = protocol_.register_entity(FIELD_TYPE_LIGHT, a_light->get_name().c_str(), "", options.c_str(), entity_id);
  light_command_targets_.push_back({idx, a_light});
  class Listener : public light::LightRemoteValuesListener {
   public:
    Listener(ESPNowLRRemote *owner, uint8_t field_index, light::LightState *light_state)
        : owner_(owner), field_index_(field_index), light_state_(light_state) {}
    void on_light_remote_values_update() override {
      float r = 0.0f, g = 0.0f, b = 0.0f;
      light_state_->remote_values.as_rgb(&r, &g, &b);
      uint8_t hue = 0, sat = 0, val = 0;
      rgb_to_hsv_u8(r, g, b, hue, sat, val);
      const auto cm = light_state_->remote_values.get_color_mode();
      const float ct = light_state_->remote_values.get_color_temperature();
      const float white = light_state_->remote_values.get_white();
      const uint16_t ct_u16 = static_cast<uint16_t>(std::min(std::max(ct, 0.0f), 65535.0f));
      uint8_t payload[9]{};
      payload[0] = light_state_->remote_values.get_state() > 0.5f ? 1 : 0;
      payload[1] = val;
      payload[2] = hue;
      payload[3] = sat;
      payload[4] = static_cast<uint8_t>(std::min<uint32_t>(255, light_state_->get_current_effect_index()));
      payload[5] = static_cast<uint8_t>(cm);
      payload[6] = ct_u16 & 0xFF;
      payload[7] = (ct_u16 >> 8) & 0xFF;
      payload[8] = static_cast<uint8_t>(std::min(std::max(white * 255.0f, 0.0f), 255.0f));
      owner_->publish_entity_state_for_listener_(field_index_, payload, 9);
    }
   private:
    ESPNowLRRemote *owner_;
    uint8_t field_index_;
    light::LightState *light_state_;
  };
  auto *listener = new Listener(this, idx, a_light);
  a_light->add_remote_values_listener(listener);
  listener->on_light_remote_values_update();
}
#endif

#ifdef USE_SELECT
void ESPNowLRRemote::register_select_entity(select::Select *a_select, const char *entity_id) {
  if (a_select == nullptr) return;
  std::string options;
  const auto &select_options = a_select->traits.get_options();
  for (size_t i = 0; i < select_options.size(); i++) {
    if (!options.empty()) options.push_back('|');
    options += select_options[i];
  }
  const std::string schema_options = "options=" + options;
  const uint8_t idx = protocol_.register_entity(FIELD_TYPE_SELECT, a_select->get_name().c_str(), "", schema_options.c_str(), entity_id);
  select_command_targets_.push_back({idx, a_select});
  a_select->add_on_state_callback([this, idx](size_t selected_index) {
    uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN]{};
    value[0] = static_cast<uint8_t>(selected_index);
    this->publish_entity_state_(idx, value, 1);
  });
  const std::string current_option = std::string(a_select->current_option().c_str());
  if (!current_option.empty()) {
    const auto selected_index = a_select->index_of(current_option.c_str());
    if (selected_index.has_value()) {
      uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN]{};
      value[0] = static_cast<uint8_t>(*selected_index);
      this->publish_entity_state_(idx, value, 1);
    }
  }
}
#endif

#ifdef USE_TEXT
void ESPNowLRRemote::register_text_entity(text::Text *a_text, const char *entity_id) {
  if (a_text == nullptr) return;
  const uint8_t idx = protocol_.register_entity(FIELD_TYPE_TEXT, a_text->get_name().c_str(), "", "", entity_id);
  text_command_targets_.push_back({idx, a_text});
  a_text->add_on_state_callback([this, idx](const std::string &state) {
    this->protocol_.on_entity_text_change(idx, state);
  });
  if (!a_text->state.empty()) this->protocol_.on_entity_text_change(idx, a_text->state);
}
#endif

#ifdef USE_TEXT_SENSOR
void ESPNowLRRemote::register_text_sensor_entity(text_sensor::TextSensor *a_text_sensor, const char *entity_id) {
  if (a_text_sensor == nullptr) return;
  const uint8_t idx = protocol_.register_entity(FIELD_TYPE_TEXT_SENSOR, a_text_sensor->get_name().c_str(), "", "", entity_id);
  text_sensor_targets_.push_back({idx, a_text_sensor});
  a_text_sensor->add_on_state_callback([this, idx](const std::string &state) {
    this->protocol_.on_entity_text_change(idx, state);
  });
  if (!a_text_sensor->get_state().empty()) this->protocol_.on_entity_text_change(idx, a_text_sensor->get_state());
}
#endif

bool ESPNowLRRemote::process_command_target_(uint8_t field_index, uint8_t, const uint8_t *value, size_t value_len) {
  if (value == nullptr) return false;
#ifdef USE_SWITCH
  for (auto &target : command_targets_) {
    if (target.field_index != field_index) continue;
    value[0] ? target.a_switch->turn_on() : target.a_switch->turn_off();
    return true;
  }
#endif
#ifdef USE_COVER
  for (auto &target : cover_command_targets_) {
    if (target.field_index != field_index) continue;
    auto call = target.a_cover->make_call();
    if (value_len >= 2) {
      switch (value[0]) {
        case POSITION_COMMAND_OPEN: call.set_command_open(); break;
        case POSITION_COMMAND_CLOSE: call.set_command_close(); break;
        case POSITION_COMMAND_STOP: call.set_command_stop(); break;
        default: call.set_position(percent_to_normalized(value[1])); break;
      }
    } else {
      call.set_position(percent_to_normalized(value[0]));
    }
    call.perform();
    return true;
  }
#endif
#ifdef USE_LOCK
  for (auto &target : lock_command_targets_) {
    if (target.field_index != field_index) continue;
    auto call = target.a_lock->make_call();
    call.set_state(value[0] == 1 ? lock::LOCK_STATE_LOCKED : lock::LOCK_STATE_UNLOCKED);
    call.perform();
    return true;
  }
#endif
#ifdef USE_NUMBER
  for (auto &target : number_command_targets_) {
    if (target.field_index != field_index) continue;
    auto call = target.a_number->make_call();
    if (value_len < sizeof(float)) return false;
    call.set_value(decode_float(value, value_len));
    call.perform();
    return true;
  }
#endif
#ifdef USE_VALVE
  for (auto &target : valve_command_targets_) {
    if (target.field_index != field_index) continue;
    auto call = target.a_valve->make_call();
    if (value_len >= 2) {
      switch (value[0]) {
        case POSITION_COMMAND_OPEN: call.set_command_open(); break;
        case POSITION_COMMAND_CLOSE: call.set_command_close(); break;
        case POSITION_COMMAND_STOP: call.set_command_stop(); break;
        default: call.set_position(percent_to_normalized(value[1])); break;
      }
    } else {
      call.set_position(percent_to_normalized(value[0]));
    }
    call.perform();
    return true;
  }
#endif
#ifdef USE_ALARM_CONTROL_PANEL
  for (auto &target : alarm_command_targets_) {
    if (target.field_index != field_index) continue;
    auto call = target.a_alarm->make_call();
    if (value_len > 1) call.set_code(reinterpret_cast<const char *>(value + 1), value_len - 1);
    switch (value[0]) {
      case 1: call.arm_home(); break;
      case 2: call.arm_away(); break;
      case 3: call.arm_night(); break;
      case 4: call.arm_vacation(); break;
      case 5: call.arm_custom_bypass(); break;
      case 6: call.triggered(); break;
      case 7: call.pending(); break;
      default: call.disarm(); break;
    }
    call.perform();
    return true;
  }
#endif
#ifdef USE_FAN
  for (auto &target : fan_command_targets_) {
    if (target.field_index != field_index) continue;
    auto call = target.a_fan->make_call();
    if (value_len >= 1) call.set_state(value[0] != 0);
    if (value_len >= 2) call.set_speed(static_cast<int>(value[1]));
    if (value_len >= 3) call.set_oscillating(value[2] != 0);
    if (value_len >= 4) call.set_direction(value[3] != 0 ? fan::FanDirection::REVERSE : fan::FanDirection::FORWARD);
    call.perform();
    return true;
  }
#endif
#ifdef USE_LIGHT
  for (auto &target : light_command_targets_) {
    if (target.field_index != field_index) continue;
    auto call = target.a_light->make_call();
    call.set_state(value[0] != 0);
    if (value_len > 1) call.set_brightness(static_cast<float>(value[1]) / 255.0f);
    if (value_len > 3) {
      float r = 0.0f, g = 0.0f, b = 0.0f;
      hsv_u8_to_rgb(value[2], value[3], value[1], r, g, b);
      call.set_rgb(r, g, b);
    }
    if (value_len > 4) call.set_effect(static_cast<uint32_t>(value[4]));
    if (value_len > 7) {
      const float ct = static_cast<float>(value[6] | (static_cast<uint16_t>(value[7]) << 8));
      call.set_color_temperature(ct);
    }
    if (value_len > 8) {
      call.set_white(static_cast<float>(value[8]) / 255.0f);
    }
    call.perform();
    return true;
  }
#endif
#ifdef USE_SELECT
  for (auto &target : select_command_targets_) {
    if (target.field_index != field_index) continue;
    auto call = target.a_select->make_call();
    call.set_index(value_len > 0 ? value[0] : 0);
    call.perform();
    return true;
  }
#endif
#ifdef USE_TEXT
  for (auto &target : text_command_targets_) {
    if (target.field_index != field_index) continue;
    auto call = target.a_text->make_call();
    call.set_value(reinterpret_cast<const char *>(value), value_len);
    call.perform();
    return true;
  }
#endif
#ifdef USE_BUTTON
  for (auto &target : button_targets_) {
    if (target.field_index != field_index) continue;
    target.button->press();
    return true;
  }
#endif
  return false;
}

bool ESPNowLRRemote::apply_command_to_field_(uint8_t field_index, uint8_t flags, const uint8_t *value, size_t value_len) {
  return process_command_target_(field_index, flags, value, value_len);
}

void ESPNowLRRemote::publish_entity_state_(uint8_t field_index, const uint8_t *value, size_t value_len) {
  protocol_.on_entity_state_change(field_index, value, value_len);
}

void ESPNowLRRemote::handle_received_frame_(const uint8_t *mac, const uint8_t *data, size_t len, int8_t rssi) {
  if (mac == nullptr || data == nullptr || len == 0) return;
  if (pending_rx_mutex_ == nullptr) {
    rx_dropped_++;
    return;
  }
  if (xSemaphoreTake(pending_rx_mutex_, 0) != pdTRUE) {
    rx_dropped_++;
    return;
  }
  if (pending_rx_frames_.size() >= MAX_PENDING_RX_FRAMES) {
    xSemaphoreGive(pending_rx_mutex_);
    rx_dropped_++;
    return;
  }
  PendingRxFrame frame{};
  memcpy(frame.mac.data(), mac, frame.mac.size());
  frame.data.assign(data, data + len);
  frame.rssi = rssi;
  pending_rx_frames_.push_back(std::move(frame));
  xSemaphoreGive(pending_rx_mutex_);
}

void ESPNowLRRemote::handle_send_status_(const uint8_t *, bool success) {
  if (success) tx_ok_++; else tx_fail_++;
}

void ESPNowLRRemote::drain_received_frames_() {
  if (pending_rx_mutex_ == nullptr) return;
  std::deque<PendingRxFrame> pending;
  if (xSemaphoreTake(pending_rx_mutex_, pdMS_TO_TICKS(10)) != pdTRUE) {
    ESP_LOGW(TAG, "Timeout waiting for pending_rx_mutex_ in drain_received_frames_");
    return;
  }
  pending.swap(pending_rx_frames_);
  xSemaphoreGive(pending_rx_mutex_);

  for (auto &frame : pending) {
    if (!protocol_.on_espnow_frame(frame.mac.data(), frame.data.data(), frame.data.size(), frame.rssi)) {
      rx_dropped_++;
      continue;
    }
    rx_packets_++;
    rolling_airtime_.rx_airtime_us += calc_airtime_lr_us_(frame.data.size());
    rolling_airtime_.rx_packets++;
    if (frame.rssi != 0) {
      rolling_airtime_.rssi_sum += frame.rssi;
      rolling_airtime_.rssi_count++;
    }
  }
}

void ESPNowLRRemote::log_airtime_status_() {
  const uint32_t now_ms = millis();
  if (airtime_window_start_ms_ == 0) {
    airtime_window_start_ms_ = now_ms;
    rolling_airtime_.window_start_ms = now_ms;
    return;
  }
  const uint32_t elapsed_ms = now_ms - airtime_window_start_ms_;
  if (elapsed_ms < AIRTIME_REPORT_INTERVAL_MS) return;

  const uint64_t total_airtime_us = rolling_airtime_.tx_airtime_us + rolling_airtime_.rx_airtime_us;
  const uint64_t window_duration_us = static_cast<uint64_t>(elapsed_ms) * 1000ULL;
  const float busy_pct = (window_duration_us > 0) ? (static_cast<float>(total_airtime_us) / static_cast<float>(window_duration_us)) * 100.0f : 0.0f;

  const uint32_t uptime_s = protocol_.get_uptime_s();

  const int8_t avg_rssi = (rolling_airtime_.rssi_count > 0)
                              ? static_cast<int8_t>(rolling_airtime_.rssi_sum / static_cast<int64_t>(rolling_airtime_.rssi_count))
                              : 0;

  const uint32_t total_tx = rolling_airtime_.tx_packets;
  const uint32_t total_rx = rolling_airtime_.rx_packets;
  const float fail_pct = (tx_ok_ + tx_fail_ > 0) ? (static_cast<float>(tx_fail_) / static_cast<float>(tx_ok_ + tx_fail_)) * 100.0f : 0.0f;

#if defined(CONFIG_IDF_TARGET_ESP32C3)
  const uint32_t chip_model = 4;
#elif defined(CONFIG_IDF_TARGET_ESP32S3)
  const uint32_t chip_model = 5;
#elif defined(CONFIG_IDF_TARGET_ESP32)
  const uint32_t chip_model = 1;
#elif defined(CONFIG_IDF_TARGET_ESP32S2)
  const uint32_t chip_model = 2;
#elif defined(CONFIG_IDF_TARGET_ESP32C6)
  const uint32_t chip_model = 6;
#elif defined(CONFIG_IDF_TARGET_ESP32H2)
  const uint32_t chip_model = 9;
#elif defined(CONFIG_IDF_TARGET_ESP32C2)
  const uint32_t chip_model = 13;
#elif defined(CONFIG_IDF_TARGET_ESP32C5)
  const uint32_t chip_model = 11;
#elif defined(CONFIG_IDF_TARGET_ESP32C61)
  const uint32_t chip_model = 12;
#elif defined(CONFIG_IDF_TARGET_ESP32P4)
  const uint32_t chip_model = 14;
#else
  const uint32_t chip_model = 0;
#endif

  ESP_LOGI(TAG, "up:%s | radio(%s):%.1f%% | tx:%u rx:%u | rssi:%ddBm | fail:%d%% | children:%u",
            format_uptime(uptime_s).c_str(), espnow_mode_.c_str(), busy_pct, total_tx, total_rx, avg_rssi, static_cast<int>(fail_pct), protocol_.get_total_children_count());

  airtime_window_start_ms_ = now_ms;
  rolling_airtime_.tx_packets = 0;
  rolling_airtime_.rx_packets = 0;
  rolling_airtime_.tx_airtime_us = 0;
  rolling_airtime_.rx_airtime_us = 0;
  rolling_airtime_.rssi_sum = 0;
  rolling_airtime_.rssi_count = 0;
}

bool ESPNowLRRemote::setup_transport_() {
  register_instance_(this);
  if (pending_rx_mutex_ == nullptr) {
    pending_rx_mutex_ = xSemaphoreCreateMutex();
    if (pending_rx_mutex_ == nullptr) {
      ESP_LOGE(TAG, "failed to create rx queue mutex");
      return false;
    }
  }
  if (!init_wifi_and_espnow_()) return false;
  esp_wifi_get_mac(WIFI_IF_STA, sta_mac_.data());
  protocol_.set_local_mac(sta_mac_.data());
  protocol_.set_relay_config(relay_enabled_, max_hops_, max_discover_pending_);
  protocol_.set_route_ttl(route_ttl_seconds_);
  for (const auto &mac : preferred_parents_) protocol_.add_preferred_parent(mac);
  protocol_.set_send_fn([this](const uint8_t *mac, const uint8_t *frame, size_t frame_len) { return this->send_frame_(mac, frame, frame_len); });
  protocol_.set_command_fn([this](uint8_t field_index, uint8_t flags, const uint8_t *value, size_t value_len) {
    this->apply_command_to_field_(field_index, flags, value, value_len);
  });
  transport_ready_ = true;
  return true;
}

void ESPNowLRRemote::refresh_dynamic_schema_options_() {
#ifdef USE_FAN
  for (const auto &target : fan_command_targets_) {
    protocol_.set_entity_options(target.field_index, fan_schema_options_(target.a_fan).c_str());
  }
#endif
#ifdef USE_LIGHT
  for (const auto &target : light_command_targets_) {
    protocol_.set_entity_options(target.field_index, light_schema_options_(target.a_light).c_str());
  }
#endif
}

static uint32_t read_build_epoch_from_flash_() {
  esp_app_desc_t app_desc{};
  const esp_partition_t *running = esp_ota_get_running_partition();
  if (running && esp_ota_get_partition_description(running, &app_desc) == ESP_OK) {
    struct tm tm{};
    if (strptime(app_desc.date, "%b %d %Y", &tm) != nullptr &&
        strptime(app_desc.time, "%H:%M:%S", &tm) != nullptr) {
      tm.tm_isdst = 0;
      return static_cast<uint32_t>(mktime(&tm) - (8 * 3600));
    }
  }
  return App.get_build_time();
}

void ESPNowLRRemote::setup() {
  if (!setup_transport_()) {
    this->mark_failed();
    return;
  }
  clear_ota_rollback_state_();
  if (!psk_.empty() && !network_id_.empty()) {
    const auto build_epoch = read_build_epoch_from_flash_();
    protocol_ready_ = protocol_.init(psk_.c_str(), network_id_.c_str(), esphome_name_.c_str(), node_label_.c_str(),
                                     build_epoch, project_name_(), project_version_(), heartbeat_interval_) == 0;
  }
  if (!protocol_ready_) {
    this->mark_failed();
    return;
  }
  refresh_dynamic_schema_options_();
  dynamic_schema_options_refreshed_ = true;
  this->set_interval("airtime_status", AIRTIME_REPORT_INTERVAL_MS, [this]() { this->log_airtime_status_(); });
}

void ESPNowLRRemote::loop() {
  if (!dynamic_schema_options_refreshed_) {
    refresh_dynamic_schema_options_();
    dynamic_schema_options_refreshed_ = true;
  }
  drain_received_frames_();
  protocol_.loop();
  protocol_.flush_log_queue();
}
void ESPNowLRRemote::dump_config() {
  ESP_LOGCONFIG(TAG, "ESP-NOW LR Remote:");
  ESP_LOGCONFIG(TAG, "  Network ID: %s", network_id_.c_str());
  ESP_LOGCONFIG(TAG, "  ESPHome Name: %s", esphome_name_.c_str());
  ESP_LOGCONFIG(TAG, "  Node Label: %s", node_label_.c_str());
  char date_buf[32] = {"unknown"};
  time_t epoch = protocol_.get_firmware_epoch();
  if (epoch > 0) {
    struct tm *tm_info = gmtime(&epoch);
    if (tm_info != nullptr) {
      strftime(date_buf, sizeof(date_buf), "%Y-%m-%d %H:%M:%S UTC", tm_info);
    }
  }
  ESP_LOGCONFIG(TAG, "  Firmware Build Date: %s", date_buf);
  ESP_LOGCONFIG(TAG, "  Project Name: %s", protocol_.get_project_name().c_str());
  ESP_LOGCONFIG(TAG, "  Project Version: %s", protocol_.get_project_version().c_str());
  ESP_LOGCONFIG(TAG, "  Mode: %s", espnow_mode_.c_str());
  ESP_LOGCONFIG(TAG, "  Relay Enabled: %s", relay_enabled_ ? "true" : "false");
  ESP_LOGCONFIG(TAG, "  Route TTL: %u s", route_ttl_seconds_);
  ESP_LOGCONFIG(TAG, "  Max Hops: %u", max_hops_);
  ESP_LOGCONFIG(TAG, "  Max Pending Discover: %u", max_discover_pending_);
  ESP_LOGCONFIG(TAG, "  Preferred Parents: %u", static_cast<unsigned>(preferred_parents_.size()));
  for (const auto &mac : preferred_parents_) {
    ESP_LOGCONFIG(TAG, "    - %s", mac_display(mac.data()).c_str());
  }
}

#if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(5, 0, 0)
void ESPNowLRRemote::on_data_received_(const esp_now_recv_info_t *info, const uint8_t *data, int len) {
  if (active_instance_ == nullptr || info == nullptr || info->src_addr == nullptr) return;
  int8_t rssi = (info->rx_ctrl != nullptr) ? info->rx_ctrl->rssi : 0;
  active_instance_->handle_received_frame_(info->src_addr, data, static_cast<size_t>(len), rssi);
}
void ESPNowLRRemote::on_data_sent_(const esp_now_send_info_t *, esp_now_send_status_t status) {
  if (active_instance_ == nullptr) return;
  active_instance_->handle_send_status_(nullptr, status == ESP_NOW_SEND_SUCCESS);
}
#else
void ESPNowLRRemote::on_data_received_(const uint8_t *mac, const uint8_t *data, int len) {
  if (active_instance_ == nullptr) return;
  active_instance_->handle_received_frame_(mac, data, static_cast<size_t>(len), 0);
}
void ESPNowLRRemote::on_data_sent_(const uint8_t *, esp_now_send_status_t status) {
  if (active_instance_ == nullptr) return;
  active_instance_->handle_send_status_(nullptr, status == ESP_NOW_SEND_SUCCESS);
}
#endif

}  // namespace esp_tree
}  // namespace esphome
