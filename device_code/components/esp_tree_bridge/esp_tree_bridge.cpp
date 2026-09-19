#include "esp_tree_bridge.h"
#include "esp_tree_common/espnow_mac_utils.h"

#ifdef USE_SERIAL
#include "bridge_api_serial.h"
#endif

#include "bridge_json_utils.h"

#include "bridge_web_pages.h"
#include "esp_tree_common/espnow_crypto.h"
#define TAG BRIDGE_OTA_TAG

#ifdef USE_MQTT
#include "bridge_mqtt_export.h"
#include "esphome/components/mqtt/mqtt_client.h"
#endif
#include "esphome/components/json/json_util.h"
#include "esphome/core/log.h"
#ifndef USE_SERIAL
#include "esphome/components/wifi/wifi_component.h"
#include "esphome/components/web_server_base/web_server_base.h"
#endif
#include "esphome/components/network/ip_address.h"

#include <cstdlib>
#include <cmath>
#include <cstring>
#include <ctime>
#include <algorithm>
#include <map>
#include <unordered_map>
#include <unordered_set>
#include <esp_err.h>
#include <esp_heap_caps.h>
#include <esp_timer.h>
#include <esp_now.h>
#include <esp_wifi.h>

#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <sstream>

namespace esphome {
namespace esp_tree {

// Yield delay inserted after publishes and ESP-NOW sends to prevent
// starving the MQTT client task. 1ms is enough for FreeRTOS to
// schedule higher-priority tasks (TCP/IP, MQTT) between our work.
static const uint8_t YIELD_MS = 1;

static const char *const TAG = "espnow";
ESPTreeBridge *ESPTreeBridge::active_instance_ = nullptr;

namespace {

static constexpr uint8_t POSITION_COMMAND_SET_POSITION = 0;
static constexpr uint8_t POSITION_COMMAND_OPEN = 1;
static constexpr uint8_t POSITION_COMMAND_CLOSE = 2;
static constexpr uint8_t POSITION_COMMAND_STOP = 3;

constexpr uint8_t CM_ONOFF = 1;
constexpr uint8_t CM_BRIGHTNESS = 3;
constexpr uint8_t CM_WHITE = 7;
constexpr uint8_t CM_COLOR_TEMP = 11;
constexpr uint8_t CM_COLD_WARM = 19;
constexpr uint8_t CM_RGB = 35;
constexpr uint8_t CM_RGBW = 39;
constexpr uint8_t CM_RGB_CT = 47;
constexpr uint8_t CM_RGBWW = 51;

static const char *color_mode_name_(uint8_t cm) {
  switch (cm) {
    case CM_ONOFF:    return "onoff";
    case CM_BRIGHTNESS: return "brightness";
    case CM_WHITE:      return "white";
    case CM_COLOR_TEMP: return "color_temp";  // also covers COLD_WARM_WHITE
    case CM_COLD_WARM:
    case CM_RGB:        return "rgb";
    case CM_RGBW:       return "rgbw";
    case CM_RGB_CT:
    case CM_RGBWW:      return "rgbww";
    default: break;
  }
  return "brightness";
}

static uint32_t calc_airtime_lr_us_(size_t frame_bytes) {
  return 336 + 16 * static_cast<uint32_t>(frame_bytes);
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
static std::string format_build_date_(const char *date_str, const char *time_str) {
  if (!date_str || !time_str) return "unknown";
  static const char *months[] = {"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"};
  int month_idx = -1;
  int day = 0, year = 0;
  char mon_str[8] = {0};
  if (sscanf(date_str, "%7s %d %d", mon_str, &day, &year) != 3) return "unknown";
  for (int i = 0; i < 12; i++) {
    if (strcmp(mon_str, months[i]) == 0) { month_idx = i; break; }
  }
  if (month_idx < 0) return "unknown";
  char result[32] = {0};
  snprintf(result, sizeof(result), "%s %d %04d %s", mon_str, day, year, time_str);
  return std::string(result);
}


static float decode_float(const uint8_t* value, size_t value_len) {
  if (value_len < sizeof(float)) return 0.0f;
  float decoded = 0.0f;
  memcpy(&decoded, value, sizeof(decoded));
  return decoded;
}

static void encode_float(float input, uint8_t* out, size_t out_len) {
  memset(out, 0, out_len);
  memcpy(out, &input, sizeof(input));
}

static std::string sanitize_object_id(std::string input) {
  for (char &ch : input) {
    if ((ch >= 'A' && ch <= 'Z')) ch = static_cast<char>(ch - 'A' + 'a');
    if (!((ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9'))) ch = '_';
  }
  return input;
}

static std::string get_esphome_device_name_() {
  return sanitize_object_id(App.get_name().str());
}

static std::string bridge_device_id_(const uint8_t *mac) {
  return std::string("esp_tree_bridge_") + mac_hex(mac);
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

static int parse_hex_nibble_(char ch) {
  if (ch >= '0' && ch <= '9') return ch - '0';
  if (ch >= 'a' && ch <= 'f') return ch - 'a' + 10;
  if (ch >= 'A' && ch <= 'F') return ch - 'A' + 10;
  return -1;
}

static bool parse_md5_hex_(const std::string &md5_hex, uint8_t md5[16]) {
  if (md5 == nullptr || md5_hex.size() != 32) return false;
  for (size_t i = 0; i < 16; ++i) {
    const int hi = parse_hex_nibble_(md5_hex[i * 2]);
    const int lo = parse_hex_nibble_(md5_hex[i * 2 + 1]);
    if (hi < 0 || lo < 0) return false;
    md5[i] = static_cast<uint8_t>((hi << 4) | lo);
  }
  return true;
}

static bool decode_base64_(const std::string &input, std::vector<uint8_t> &out) {
  static constexpr int8_t kTable[256] = {
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      62,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,62,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-2,-1,-1,
      -1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,63,
      -1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1
  };

  out.clear();
  out.reserve((input.size() * 3U) / 4U);
  uint32_t accumulator = 0;
  int bits = 0;
  for (char ch : input) {
    const uint8_t byte = static_cast<uint8_t>(ch);
    const int8_t value = kTable[byte];
    if (value == -1) {
      if (ch == '\r' || ch == '\n' || ch == '\t') continue;
      return false;
    }
    if (value == -2) {
      continue;
    }
    accumulator = (accumulator << 6U) | static_cast<uint32_t>(value);
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out.push_back(static_cast<uint8_t>((accumulator >> bits) & 0xFFU));
    }
  }
  return true;
}

static const char *component_for_type(espnow_field_type_t type) {
  switch (type) {
    case FIELD_TYPE_SENSOR: return "sensor";
    case FIELD_TYPE_SWITCH: return "switch";
    case FIELD_TYPE_BINARY: return "binary_sensor";
    case FIELD_TYPE_BUTTON: return "button";
    case FIELD_TYPE_NUMBER: return "number";
    case FIELD_TYPE_TEXT: return "text";
    case FIELD_TYPE_TEXT_SENSOR: return "text_sensor";
    case FIELD_TYPE_COVER: return "cover";
    case FIELD_TYPE_LIGHT: return "light";
    case FIELD_TYPE_FAN: return "fan";
    case FIELD_TYPE_LOCK: return "lock";
    case FIELD_TYPE_ALARM: return "alarm_control_panel";
    case FIELD_TYPE_SELECT: return "select";
    case FIELD_TYPE_EVENT: return "event";
    case FIELD_TYPE_VALVE: return "valve";
    default: return "sensor";
  }
}

static const char *native_type_for_type(espnow_field_type_t type) {
  switch (type) {
    case FIELD_TYPE_SENSOR:
    case FIELD_TYPE_NUMBER:
      return "float";
    case FIELD_TYPE_SWITCH:
    case FIELD_TYPE_BINARY:
    case FIELD_TYPE_BUTTON:
    case FIELD_TYPE_HUMIDIFIER:
    case FIELD_TYPE_DEHUMIDIFIER:
      return "bool";
    case FIELD_TYPE_TEXT:
    case FIELD_TYPE_TEXT_SENSOR:
    case FIELD_TYPE_SELECT:
    case FIELD_TYPE_TIME:
    case FIELD_TYPE_DATETIME:
      return "string";
    case FIELD_TYPE_LIGHT:
    case FIELD_TYPE_FAN:
    case FIELD_TYPE_COVER:
    case FIELD_TYPE_VALVE:
    case FIELD_TYPE_CLIMATE:
    case FIELD_TYPE_LOCK:
    case FIELD_TYPE_ALARM:
    case FIELD_TYPE_EVENT:
      return "int";
    default:
      return "float";
  }
}

static bool parse_on(const std::string &payload) {
  return payload == "ON" || payload == "on" || payload == "1" || payload == "true";
}

static const char *config_result_string_(const ConfigAckResult &result) {
  if (result.no_session) return bridge_api::config_result::NO_SESSION;
  if (result.timed_out) return bridge_api::config_result::TIMEOUT;
  if (!result.acked) return bridge_api::config_result::TIMEOUT;
  switch (result.result) {
    case CFG_RESULT_OK:
      return bridge_api::config_result::OK;
    case CFG_RESULT_REJECTED:
      return bridge_api::config_result::REJECTED;
    case CFG_RESULT_UNSUPPORTED:
      return bridge_api::config_result::UNSUPPORTED;
    case CFG_RESULT_INVALID_PAYLOAD:
      return bridge_api::config_result::INVALID_PAYLOAD;
    case CFG_RESULT_BUSY:
      return bridge_api::config_result::BUSY;
    default:
      return bridge_api::config_result::REJECTED;
  }
}

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

static const char *chip_model_string(uint32_t model) {
  switch (model) {
    case 1:  return "ESP32";
    case 2:  return "ESP32-S2";
    case 5:  return "ESP32-C3";
    case 9:  return "ESP32-S3";
    case 12: return "ESP32-C2";
    case 13: return "ESP32-C6";
    case 16: return "ESP32-H2";
    case 18: return "ESP32-P4";
    case 20: return "ESP32-C61";
    case 23: return "ESP32-C5";
    case 33382: return "ESP8266";
    default: return "Unknown";
  }
}

static std::vector<std::string> split_string(const std::string &input, char sep) {
  std::vector<std::string> parts;
  std::string current;
  for (char ch : input) {
    if (ch == sep) {
      parts.push_back(current);
      current.clear();
    } else {
      current.push_back(ch);
    }
  }
  parts.push_back(current);
  return parts;
}

static std::map<std::string, std::string> parse_options_map(const std::string &input) {
  std::map<std::string, std::string> options;
  for (const auto &part : split_string(input, ';')) {
    const auto eq = part.find('=');
    if (eq == std::string::npos) continue;
    options[part.substr(0, eq)] = part.substr(eq + 1);
  }
  return options;
}

static bool option_is_true(const std::map<std::string, std::string> &options, const char *key) {
  const auto it = options.find(key);
  return it != options.end() && (it->second == "1" || it->second == "true" || it->second == "yes");
}

static std::vector<std::string> option_list(const std::map<std::string, std::string> &options, const char *key) {
  const auto it = options.find(key);
  if (it == options.end() || it->second.empty()) return {};
  return split_string(it->second, '|');
}

static bool option_has_list_value(const std::map<std::string, std::string> &options, const char *key, const char *value) {
  const auto values = option_list(options, key);
  return std::find(values.begin(), values.end(), value) != values.end();
}

static float option_float(const std::map<std::string, std::string> &options, const char *key, float fallback = 0.0f) {
  const auto it = options.find(key);
  return it == options.end() ? fallback : strtof(it->second.c_str(), nullptr);
}

static uint32_t option_u32(const std::map<std::string, std::string> &options, const char *key, uint32_t fallback = 0) {
  const auto it = options.find(key);
  return it == options.end() ? fallback : static_cast<uint32_t>(strtoul(it->second.c_str(), nullptr, 10));
}

static void hsv_u8_to_rgb(uint8_t h, uint8_t s, uint8_t v, uint8_t &r, uint8_t &g, uint8_t &b) {
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
  r = static_cast<uint8_t>(std::lround((rp + m) * 255.0f));
  g = static_cast<uint8_t>(std::lround((gp + m) * 255.0f));
  b = static_cast<uint8_t>(std::lround((bp + m) * 255.0f));
}

}  // namespace

ESPTreeBridge::ESPTreeBridge() = default;

void ESPTreeBridge::register_instance_(ESPTreeBridge *instance) { active_instance_ = instance; }

std::string ESPTreeBridge::mac_key_string_(const uint8_t *mac) { return mac_hex(mac); }

bool ESPTreeBridge::init_wifi_and_espnow_() {
  if (esp_now_init() != ESP_OK) return false;
  wifi_protocols_t protocols{};
  if (espnow_mode_ == "lr") {
    protocols.ghz_2g = WIFI_PROTOCOL_LR;
  } else {
    protocols.ghz_2g = WIFI_PROTOCOL_11B | WIFI_PROTOCOL_11G | WIFI_PROTOCOL_11N;
  }
  ESP_ERROR_CHECK(esp_wifi_set_protocols(WIFI_IF_STA, &protocols));
  ESP_LOGI(TAG, "ESP-NOW mode=%s, 2.4GHz protocol mask=0x%08x", espnow_mode_.c_str(), protocols.ghz_2g);
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

bool ESPTreeBridge::add_peer_(const uint8_t *mac) {
  if (mac == nullptr) return false;
  if (esp_now_is_peer_exist(mac)) {
    note_peer_activity_(mac);
    return true;
  }
  esp_now_peer_info_t peer{};
  memcpy(peer.peer_addr, mac, 6);
  peer.channel = current_wifi_channel_();
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
           mac_key_string_(mac).c_str(), static_cast<int>(err));
  if (!evict_stale_peer_(mac)) {
    return false;
  }

  err = esp_now_add_peer(&peer);
  if (err == ESP_OK) {
    note_peer_activity_(mac);
    return true;
  }

  ESP_LOGW(TAG, "esp_now_add_peer retry failed for %s (err=%d)",
           mac_key_string_(mac).c_str(), static_cast<int>(err));
  return false;
}

uint8_t ESPTreeBridge::current_wifi_channel_() const {
  uint8_t primary = 1;
  wifi_second_chan_t secondary = WIFI_SECOND_CHAN_NONE;
  esp_wifi_get_channel(&primary, &secondary);
  return primary;
}

esp_err_t ESPTreeBridge::send_frame_result_(const uint8_t *mac, const uint8_t *frame, size_t frame_len) {
  if (!add_peer_(mac)) {
    ESP_LOGW(TAG, "ESP-NOW send aborted: no peer slot available for %s", mac_key_string_(mac).c_str());
    return ESP_FAIL;
  }
  rolling_airtime_.tx_airtime_us += calc_airtime_lr_us_(frame_len);
  rolling_airtime_.tx_packets++;
  note_peer_activity_(mac);
  const esp_err_t err = esp_now_send(mac, frame, frame_len);

  if (err != ESP_OK) {
    ESP_LOGW(TAG, "[TX] esp_now_send to %s failed err=%d", mac_key_string_(mac).c_str(), err);
  }
  return err;
}

bool ESPTreeBridge::send_frame_(const uint8_t *mac, const uint8_t *frame, size_t frame_len) {
  return send_frame_result_(mac, frame, frame_len) == ESP_OK;
}

void ESPTreeBridge::note_peer_activity_(const uint8_t *mac) {
  if (mac == nullptr) return;
  peer_last_used_ms_[mac_key_string_(mac)] = millis();
}

bool ESPTreeBridge::is_peer_protected_(const uint8_t *mac) const {
  if (mac == nullptr) return false;
  for (const auto &entry : protocol_.get_sessions()) {
    const auto &session = entry.second;
    if (!session.online) continue;
    if (memcmp(session.next_hop_mac.data(), mac, 6) == 0) return true;
    if (memcmp(session.leaf_mac.data(), mac, 6) == 0) return true;
  }
  return false;
}

bool ESPTreeBridge::evict_stale_peer_(const uint8_t *preferred_mac) {
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

void ESPTreeBridge::handle_received_frame_(const uint8_t *mac, const uint8_t *data, size_t len, int8_t rssi) {
  if (!espnow_allowed_) {
    rx_dropped_while_disallowed_++;
    ESP_LOGW(TAG, "ESP-NOW frame dropped: espnow_allowed_=false (Wi-Fi disconnected)");
    return;
  }
  if (mac == nullptr || data == nullptr || len == 0) return;
  if (pending_rx_mutex_ == nullptr) {
    rx_dropped_++;
    return;
  }
  if (xSemaphoreTake(pending_rx_mutex_, 0) != pdTRUE) {
    rx_dropped_++;
    return;
  }
  const size_t rx_size = pending_rx_frames_.size();
  if (rx_size >= MAX_PENDING_RX_FRAMES) {
    xSemaphoreGive(pending_rx_mutex_);
    rx_dropped_++;
    return;
  }
  if (rx_size >= (MAX_PENDING_RX_FRAMES * RX_BUFFER_WATERMARK_PCT / 100)) {
    ESP_LOGW(TAG, "ESP-NOW RX buffer at %d%% (%zu/%zu frames)", RX_BUFFER_WATERMARK_PCT, rx_size,
             MAX_PENDING_RX_FRAMES);
  }
  PendingRxFrame frame{};
  memcpy(frame.mac.data(), mac, frame.mac.size());
  frame.data.assign(data, data + len);
  frame.rssi = rssi;
  pending_rx_frames_.push_back(std::move(frame));
  xSemaphoreGive(pending_rx_mutex_);
}

void ESPTreeBridge::handle_send_status_(const uint8_t *mac, bool success) {
  if (success) {
    tx_ok_++;
  } else {
    tx_fail_++;
  }
}

void ESPTreeBridge::drain_received_frames_() {
  if (pending_rx_mutex_ == nullptr) return;
  std::deque<PendingRxFrame> pending;
  if (xSemaphoreTake(pending_rx_mutex_, pdMS_TO_TICKS(10)) != pdTRUE) {
    ESP_LOGW(TAG, "Timeout waiting for pending_rx_mutex_ in drain_received_frames_");
    return;
  }
  pending.swap(pending_rx_frames_);
  xSemaphoreGive(pending_rx_mutex_);

  size_t i = 0;
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
    if (++i % 5 == 0) delay(YIELD_MS);
  }
}

std::string ESPTreeBridge::slugify_name_(std::string input) const { return sanitize_object_id(std::move(input)); }

std::string ESPTreeBridge::node_key_(const uint8_t *mac) const {
  return node_key(mac);
}

std::string ESPTreeBridge::node_key(const uint8_t *mac) const {
  const BridgeSession *session = protocol_.get_session(mac);
  if (session != nullptr && !session->esphome_name.empty()) return slugify_name_(session->esphome_name);
  return mac_key_string_(mac);
}

std::string ESPTreeBridge::remote_display_name_(const uint8_t *mac) const {
  const BridgeSession *session = protocol_.get_session(mac);
  if (session != nullptr && !session->node_label.empty()) return session->node_label;
  if (session != nullptr && !session->esphome_name.empty()) return session->esphome_name;
  return std::string("ESP-NOW LR Remote ") + mac_key_string_(mac);
}

std::string ESPTreeBridge::entity_object_id_(const uint8_t *mac, const BridgeEntitySchema &entity) const {
  std::string base;
  if (!entity.entity_id.empty()) {
    base = slugify_name_(entity.entity_id);
  } else {
    base = slugify_name_(entity.entity_name);
  }
  if (base.empty()) base = "entity";
  const BridgeSession *session = protocol_.get_session(mac);
  if (session == nullptr || entity.entity_index >= session->schema_entities.size()) return base;
  if (!entity.entity_id.empty()) {
    return base;
  }
  unsigned duplicate_index = 0;
  for (size_t i = 0; i <= entity.entity_index && i < session->schema_entities.size(); i++) {
    const auto &candidate = session->schema_entities[i];
    if (candidate.entity_type == 0) continue;
    if (slugify_name_(candidate.entity_name) == base) duplicate_index++;
  }
  if (duplicate_index > 1) base += "_" + std::to_string(duplicate_index);
  return base;
}



void ESPTreeBridge::log_airtime_status_() {
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

  const uint32_t uptime_s = protocol_.bridge_uptime_s_;

  const int8_t avg_rssi = (rolling_airtime_.rssi_count > 0)
                              ? static_cast<int8_t>(rolling_airtime_.rssi_sum / static_cast<int64_t>(rolling_airtime_.rssi_count))
                              : 0;

  const uint32_t total_tx = rolling_airtime_.tx_packets;
  const uint32_t total_rx = rolling_airtime_.rx_packets;
  const float fail_pct = (tx_ok_ + tx_fail_ > 0) ? (static_cast<float>(tx_fail_) / static_cast<float>(tx_ok_ + tx_fail_)) * 100.0f : 0.0f;

  uint16_t total_children = 0;
  // remote_diag_cache_ moved to MQTT helper
  (void)total_children;

ESP_LOGI(TAG, "up:%s | radio(%s):%.1f%% | tx:%u rx:%u | rssi:%ddBm | fail:%d%% | children:%u",
            format_uptime(uptime_s).c_str(), espnow_mode_.c_str(), busy_pct, total_tx, total_rx, avg_rssi, static_cast<int>(fail_pct), total_children);

  airtime_window_start_ms_ = now_ms;
  rolling_airtime_.tx_packets = 0;
  rolling_airtime_.rx_packets = 0;
  rolling_airtime_.tx_airtime_us = 0;
  rolling_airtime_.rx_airtime_us = 0;
  rolling_airtime_.rssi_sum = 0;
  rolling_airtime_.rssi_count = 0;
}

void ESPTreeBridge::log_ram_stats_() {
  multi_heap_info_t heap_info{};
  heap_caps_get_info(&heap_info, MALLOC_CAP_8BIT);
  const size_t total_used = heap_info.total_allocated_bytes;
  const size_t total_free = heap_info.total_free_bytes;
  const size_t total_heap = total_used + total_free;

  const size_t sessions_count = protocol_.get_sessions().size();
  const size_t schema_count = protocol_.get_schema_cache().size();
  const size_t schema_hash_count = protocol_.get_schema_hash_cache().size();
  const size_t pending_rx_count = pending_rx_frames_.size();
  const size_t ota_chunks_count = ota_chunk_stages_.size();
  constexpr size_t KB = 1024;
  const size_t sessions_kb = sessions_count * 2;
  const size_t schema_kb = schema_count * 5;
  const size_t pending_rx_kb = pending_rx_count * 2;
  const size_t ota_kb = ota_chunks_count * 1;

  ESP_LOGI(TAG,
           "RAM: free=%zu KB used=%zu KB total=%zu KB "
           "| largest_blk=%zu KB min_free=%zu KB blocks=%zu "
           "| sessions=%zu(%zuKB) schema=%zu hash=%zu rx=%zu(%zuKB) ota=%zu(%zuKB)",
           total_free / KB, total_used / KB, total_heap / KB, heap_info.largest_free_block / KB,
           heap_info.minimum_free_bytes / KB, heap_info.allocated_blocks, sessions_count, sessions_kb,
           schema_count, schema_hash_count, pending_rx_count, pending_rx_kb, ota_chunks_count, ota_kb);
}



std::string ESPTreeBridge::build_topology_json_() const {
  static const uint32_t OFFLINE_TIMEOUT_MS = 86400000;
  const uint32_t now_ms = millis();
  const std::string bridge_mac = mac_colon_string_(sta_mac_.data());

  const size_t num_sessions = protocol_.get_sessions().size();
  const size_t kReserveBytes = 2048 + num_sessions * 512;
  std::string json;
  json.reserve(kReserveBytes);
  json += "[";
  json += "{\"mac\":\"" + bridge_mac + "\",\"label\":\"" + bridge_friendly_name_ +
          "\",\"parent_mac\":\"\",\"online\":true,\"state\":5,\"hops\":0,\"uptime_s\":" +
          std::to_string(protocol_.bridge_uptime_s_) +
          ",\"last_seen_bridge_uptime_s\":" + std::to_string(now_ms / 1000) + "," +
          "\"chip_type\":" + std::to_string(protocol_.bridge_identity().chip_model) + "," +
          "\"chip_name\":\"" + chip_model_string(protocol_.bridge_identity().chip_model) + "\"," +
          "\"session_max_payload\":" +
          std::to_string(protocol_.bridge_session_flags() ? ESPNOW_V2_MAX_PAYLOAD : ESPNOW_V1_MAX_PAYLOAD) +
          ",\"bridge_session_flags\":" + std::to_string(protocol_.bridge_session_flags()) + "}";
  bool need_comma = true;

  for (const auto &entry : protocol_.get_sessions()) {
    const auto &session = entry.second;
    const uint32_t last_seen_ago = session.last_seen_bridge_uptime_s == 0 ? UINT32_MAX : (now_ms / 1000) - session.last_seen_bridge_uptime_s;
    const bool online = session.online.load();
    if (!online && last_seen_ago > OFFLINE_TIMEOUT_MS) continue;
    const std::string mac = mac_colon_string_(session.leaf_mac.data());
    const std::string label = session.node_label.empty() ? mac : session.node_label;
    const std::string parent = mac_colon_string_(session.parent_mac.data());
    std::string build_date_str;
    if (!session.build_date.empty() && !session.build_time.empty()) {
      build_date_str = format_build_date_(session.build_date.c_str(), session.build_time.c_str());
    }
    if (need_comma) json += ",";
    json += "{\"mac\":\"" + mac + "\",\"label\":\"" + label +
            "\",\"parent_mac\":\"" + parent +
            "\",\"online\":" + (online ? "true" : "false") +
            ",\"state\":" + std::to_string(static_cast<uint8_t>(session.remote_state)) +
            ",\"hops\":" + std::to_string(session.hops_to_bridge) +
            ",\"last_seen_bridge_uptime_s\":" + std::to_string(session.last_seen_bridge_uptime_s) +
            ",\"uptime_s\":" + std::to_string(session.uptime_seconds) +
            ",\"entity_count\":" + std::to_string(session.schema_entities.size()) +
            ",\"firmware_version\":\"" + session.project_version + "\"" +
            ",\"esphome_name\":\"" + session.esphome_name + "\"" +
            ",\"project_name\":\"" + session.project_name + "\"" +
            ",\"firmware_build_date\":\"" + build_date_str + "\"" +
            ",\"chip_type\":" + std::to_string(session.chip_model) +
            ",\"chip_name\":\"" + chip_model_string(session.chip_model) + "\"" +
            ",\"rssi\":" + std::to_string(session.last_rssi) +
            ",\"session_max_payload\":" + std::to_string(session.session_max_payload) +
            ",\"leaf_session_flags\":" + std::to_string(session.leaf_session_flags) +
            ",\"bridge_session_flags\":" + std::to_string(protocol_.bridge_session_flags()) + "}";
    need_comma = true;
  }
  json += "]";
  return json;
}

std::string ESPTreeBridge::build_remote_info_json_(const uint8_t *mac) const {
  const BridgeSession *session = protocol_.get_session(mac);
  if (session == nullptr) {
    return "{}";
  }
  std::string json = "{";
  json += "\"label\":\"" + (session->node_label.empty() ? mac_key_string_(mac) : session->node_label) + "\",";
  json += "\"online\":" + std::string(session->online ? "true" : "false") + ",";
  json += "\"uptime_s\":" + std::to_string(session->uptime_seconds) + ",";
  json += "\"hops\":" + std::to_string(session->hops_to_bridge) + ",";
  json += "\"rssi\":" + std::to_string(session->last_rssi) + ",";
  json += "\"entity_count\":" + std::to_string(session->schema_entities.size()) + ",";
  json += "\"firmware_version\":\"" + session->project_version + "\",";
  json += "}";
  return json;
}

std::string ESPTreeBridge::api_bridge_info_json() const {
  const std::string bridge_mac = mac_colon_string_(sta_mac_.data());
  const std::string device_name = sanitize_object_id(App.get_name().str());
  const std::string esphome_version = ESPHOME_VERSION;

  std::string json;
  json.reserve(1024);
  json += "{\"api_version\":";
  json += std::to_string(bridge_api::runtime_pb::kRuntimeApiVersion);
  json += ",\"name\":\"";
  json += bridge_api::escape_json(device_name);
  json += "\",\"mac\":\"";
  json += bridge_api::escape_json(bridge_mac);
  json += "\",\"firmware\":{";
  json += "\"name\":\"";
  json += bridge_api::escape_json(device_name);
  json += "\",\"version\":\"";
  json += bridge_api::escape_json(esphome_version);
  json += "\",\"esphome_version\":\"";
  json += bridge_api::escape_json(esphome_version);
  json += "\"";
  json += ",\"features\":{";
  json += "\"topology\":true,";
  json += "\"events\":true,";
  json += "\"ota_ws\":true,";
  json += "\"config_ws\":true,";

  json += "\"legacy_http\":true";
  json += "},\"limits\":{";
  json += "\"max_json_bytes\":";
  json += std::to_string(bridge_api::kMaxJsonBytes);
  json += ",\"max_ws_chunk_size\":";
  json += std::to_string(bridge_api::kMaxChunkSize);
  json += ",\"ota_max_increment_kb\":";
  json += std::to_string(bridge_api::kOtaMaxIncrementKB);
  json += "}}";
  return json;
}

std::string ESPTreeBridge::api_topology_snapshot_json(const std::string &request_payload_json) const {
  static const uint32_t OFFLINE_TIMEOUT_MS = 86400000;
  const uint32_t now_ms = millis();

  snapshot_sequence_++;

  const std::string bridge_mac = mac_colon_string_(sta_mac_.data());
  const std::string node_name = sanitize_object_id(App.get_name().str());

  std::string json;
  json += "{\"bridge\":{";
  json += "\"mac\":\"" + bridge_api::escape_json(bridge_mac) + "\",";
  json += "\"node_key\":\"" + bridge_api::escape_json(mac_key_string_(sta_mac_.data())) + "\",";
  json += "\"device_unique_id\":\"esp_tree_" + mac_key_string_(sta_mac_.data()) + "\",";
  json += "\"name\":\"" + bridge_api::escape_json(node_name) + "\",";
  json += "\"friendly_name\":\"" + bridge_api::escape_json(bridge_friendly_name_) + "\",";
  json += "\"manufacturer\":\"ESPHome\",";
  json += "\"model\":\"esp_tree_bridge\",";
  json += "\"sw_version\":\"" + bridge_api::escape_json(protocol_.bridge_identity().project_version) + "\",";
  json += "\"online\":true,";
  json += "\"parent_mac\":\"\",";
  json += "\"hop_count\":0,";
  json += "\"rssi\":\"N.A.\",";
  json += "\"last_seen_bridge_uptime_s\":" + std::to_string(now_ms / 1000) + ",";
  json += "\"uptime_s\":" + std::to_string(protocol_.bridge_uptime_s_) + ",";
  json += "\"identity\":{";
  json += "\"esphome_name\":\"" + bridge_api::escape_json(node_name) + "\",";
  json += "\"node_label\":\"" + bridge_api::escape_json(bridge_friendly_name_) + "\",";
  json += "\"project_name\":\"" + bridge_api::escape_json(protocol_.bridge_identity().project_name) + "\",";
  json += "\"project_version\":\"" + bridge_api::escape_json(protocol_.bridge_identity().project_version) + "\",";
  json += "\"firmware_epoch\":" + std::to_string(protocol_.bridge_identity().firmware_epoch) + ",";
  json += "\"chip_model\":" + std::to_string(protocol_.bridge_identity().chip_model) + ",";
  if (!network_id_.empty()) {
    json += "\"network_id\":\"" + bridge_api::escape_json(network_id_) + "\",";
  }
  std::string bridge_build_date = format_build_date_(protocol_.bridge_identity().build_date.c_str(),
                                                    protocol_.bridge_identity().build_time.c_str());
  json += "\"firmware_build_date\":\"" + bridge_build_date + "\",";
  uint8_t bridge_firmware_md5_bytes[16];
  memcpy(bridge_firmware_md5_bytes, protocol_.bridge_identity().firmware_md5.data(), sizeof(bridge_firmware_md5_bytes));
  std::string bridge_firmware_md5_hex = bridge_api::bytes_to_lower_hex(bridge_firmware_md5_bytes, sizeof(bridge_firmware_md5_bytes));
  json += "\"firmware_md5\":\"" + bridge_firmware_md5_hex + "\",";
  json += "\"schema_hash\":\"N.A.\"},";
  json += "\"session\":{";
  json += "\"joined\":true,";
  json += "\"schema_complete\":true,";
  json += "\"state_complete\":true,";
  json += "\"session_flags\":" + std::to_string(protocol_.bridge_session_flags()) + ",";
  json += "\"max_payload\":0,";
  json += "\"max_entity_fragment\":0,";
  json += "\"refresh_pending\":false";
  json += "},\"radio\":{";
  json += "\"rssi\":\"N.A.\",";
  json += "\"last_seen_bridge_uptime_s\":" + std::to_string(now_ms / 1000) + ",";
  json += "\"hops_to_bridge\":0,";
  json += "\"parent_rssi\":\"N.A.\"},";
  json += "\"diagnostics\":{";
  json += "\"dirty_count\":0,";
  json += "\"retry_count\":0,";
  json += "\"last_error\":\"\"";
  json += "}},\"nodes\":[";

  bool first_node = true;
  for (const auto &entry : protocol_.get_sessions()) {
    const auto &session = entry.second;
    const uint32_t last_seen_ago = session.last_seen_bridge_uptime_s == 0 ? UINT32_MAX : (now_ms / 1000) - session.last_seen_bridge_uptime_s;
    const bool online = session.online.load();
    if (!online && last_seen_ago > OFFLINE_TIMEOUT_MS) continue;

    const std::string mac = mac_colon_string_(session.leaf_mac.data());
    const std::string mac_key = mac_key_string_(session.leaf_mac.data());
    const std::string parent_mac = mac_colon_string_(session.parent_mac.data());
    const std::string label = session.node_label.empty() ? mac : session.node_label;
    const std::string name = session.esphome_name.empty() ? mac_key : session.esphome_name;
    const std::string friendly_name = session.node_label.empty() ? mac : session.node_label;
    const std::string device_unique_id = "esp_tree_" + mac_key;
    const std::string node_key_str = mac_key;

    if (!first_node) json += ",";
    first_node = false;

    json += "{";
    json += "\"mac\":\"" + bridge_api::escape_json(mac) + "\",";
    json += "\"node_key\":\"" + bridge_api::escape_json(node_key_str) + "\",";
    json += "\"device_unique_id\":\"" + bridge_api::escape_json(device_unique_id) + "\",";
    json += "\"name\":\"" + bridge_api::escape_json(name) + "\",";
    json += "\"friendly_name\":\"" + bridge_api::escape_json(friendly_name) + "\",";
    json += "\"manufacturer\":\"ESPHome\",";
    json += "\"model\":\"esp_tree_remote\",";
    json += "\"sw_version\":\"" + bridge_api::escape_json(session.project_version) + "\",";
    json += "\"online\":" + std::string(online ? "true" : "false") + ",";
    json += "\"parent_mac\":\"" + bridge_api::escape_json(parent_mac) + "\",";
    json += "\"hop_count\":" + std::to_string(session.hops_to_bridge) + ",";
    json += "\"rssi\":" + std::to_string(session.last_rssi) + ",";
    json += "\"last_seen_bridge_uptime_s\":" + std::to_string(session.last_seen_bridge_uptime_s) + ",";
    json += "\"uptime_s\":" + std::to_string(session.uptime_seconds) + ",";
    json += "\"direct_child_count\":" + std::to_string(session.direct_child_count) + ",";
    json += "\"total_child_count\":" + std::to_string(session.total_child_count) + ",";
    json += "\"can_relay\":" + std::string(session.online.load() && session.session_key_valid.load() ? "true" : "false") + ",";
    json += "\"relay_enabled\":" + std::string((session.direct_child_count > 0 || session.total_child_count > 0) ? "true" : "false") + ",";

    json += "\"identity\":{";
    json += "\"esphome_name\":\"" + bridge_api::escape_json(session.esphome_name) + "\",";
    json += "\"node_label\":\"" + bridge_api::escape_json(session.node_label) + "\",";
    json += "\"project_name\":\"" + bridge_api::escape_json(session.project_name) + "\",";
    json += "\"project_version\":\"" + bridge_api::escape_json(session.project_version) + "\",";
    json += "\"firmware_epoch\":" + std::to_string(session.firmware_epoch) + ",";
    json += "\"chip_model\":" + std::to_string(session.chip_model) + ",";
    std::string node_build_date;
    if (!session.build_date.empty() && !session.build_time.empty()) {
      node_build_date = format_build_date_(session.build_date.c_str(), session.build_time.c_str());
    }
    json += "\"firmware_build_date\":\"" + node_build_date + "\",";

    uint8_t firmware_md5_bytes[16];
    memcpy(firmware_md5_bytes, session.firmware_md5.data(), sizeof(firmware_md5_bytes));
    std::string firmware_md5_hex = bridge_api::bytes_to_lower_hex(firmware_md5_bytes, sizeof(firmware_md5_bytes));
    json += "\"firmware_md5\":\"" + firmware_md5_hex + "\",";

    uint8_t schema_hash_bytes[32];
    memcpy(schema_hash_bytes, session.schema_hash.data(), sizeof(schema_hash_bytes));
    std::string schema_hash_hex = bridge_api::bytes_to_lower_hex(schema_hash_bytes, sizeof(schema_hash_bytes));
    json += "\"schema_hash\":\"sha256:" + schema_hash_hex + "\"";

    json += "},";

    json += "\"session\":{";
    const bool joined = session.session_key_valid.load();
    const bool schema_complete = session.schema_received.load();
    const bool state_complete = schema_complete && !session.state_sync_pending.load();
    json += "\"joined\":" + std::string(joined ? "true" : "false") + ",";
    json += "\"schema_complete\":" + std::string(schema_complete ? "true" : "false") + ",";
    json += "\"state_complete\":" + std::string(state_complete ? "true" : "false") + ",";
    json += "\"session_flags\":" + std::to_string(session.leaf_session_flags) + ",";
    json += "\"max_payload\":" + std::to_string(session.session_max_payload) + ",";
    json += "\"max_entity_fragment\":" + std::to_string(session.max_entity_fragment) + ",";
    json += "\"refresh_pending\":false";
    json += "},";

    json += "\"radio\":{";
    json += "\"rssi\":" + std::to_string(session.last_rssi) + ",";
    json += "\"last_seen_bridge_uptime_s\":" + std::to_string(session.last_seen_bridge_uptime_s) + ",";
    json += "\"hops_to_bridge\":" + std::to_string(session.hops_to_bridge) + ",";
    json += "\"parent_rssi\":" + std::to_string(session.last_rssi);
    json += "},";

    json += "\"diagnostics\":{";
    json += "\"dirty_count\":0,";
    json += "\"retry_count\":0,";
    json += "\"last_error\":\"\",";
    json += "\"uptime_s\":" + std::to_string(session.uptime_seconds);
    json += "}";
    json += "}";
  }
  json += "]}";
  return json;
}

std::string ESPTreeBridge::api_node_schema_json(const std::string &mac_colon) const {
  std::string clean;
  for (char c : mac_colon) {
    if (c != ':' && c != '-' && c != ' ') clean += c;
  }
  uint8_t mac[6]{};
  if (!parse_mac_hex_(clean, mac)) {
    return "{\"mac\":\"" + bridge_api::escape_json(mac_colon) + "\",\"schema_hash\":null,\"schema\":null}";
  }

  auto it = protocol_.get_sessions().find(protocol_.mac_to_key_(mac));
  if (it == protocol_.get_sessions().end()) {
    return "{\"mac\":\"" + bridge_api::escape_json(mac_colon) + "\",\"schema_hash\":null,\"schema\":null}";
  }

  const auto &session = it->second;
  std::string json;
  json.reserve(4096);
  json += "{\"mac\":\"" + bridge_api::escape_json(mac_colon) + "\",";

  uint8_t schema_hash_bytes[32];
  memcpy(schema_hash_bytes, session.schema_hash.data(), sizeof(schema_hash_bytes));
  std::string schema_hash_hex = bridge_api::bytes_to_lower_hex(schema_hash_bytes, sizeof(schema_hash_bytes));
  json += "\"schema_hash\":\"sha256:" + schema_hash_hex + "\",";

  if (session.schema_received.load() && !session.schema_entities.empty()) {
    json += "\"schema\":{";
    json += "\"complete\":" + std::string(session.schema_received.load() ? "true" : "false") + ",";
    size_t valid_entities = 0;
    for (const auto &se : session.schema_entities) {
      if (se.entity_type != 0) valid_entities++;
    }
    json += "\"total_entities\":" + std::to_string(valid_entities) + ",";
    json += "\"entities\":[";
    bool first_entity = true;
    const std::string mac_key = mac_key_string_(mac);
    for (size_t i = 0; i < session.schema_entities.size(); ++i) {
      const auto &entity = session.schema_entities[i];
      if (entity.entity_type == 0) continue;
      if (!first_entity) json += ",";
      first_entity = false;
      const std::string entity_object = entity.entity_id.empty() ?
          sanitize_object_id(entity.entity_name) : entity.entity_id;
      const std::string entity_unique_id = "esp_tree_" + mac_key + "_" + entity_object;
      const std::string entity_key = entity.entity_id.empty() ? entity.entity_name : entity.entity_id;

      json += "{";
      json += "\"key\":\"" + bridge_api::escape_json(entity_key) + "\",";
      json += "\"entity_id\":\"" + bridge_api::escape_json(entity.entity_id) + "\",";
      json += "\"unique_id\":\"" + bridge_api::escape_json(entity_unique_id) + "\",";
      json += "\"entity_index\":" + std::to_string(entity.entity_index) + ",";
      json += "\"stable_identity\":" + std::string(entity.entity_id.empty() ? "false" : "true") + ",";
      json += "\"platform\":\"" + std::string(component_for_type(static_cast<espnow_field_type_t>(entity.entity_type))) + "\",";
      json += "\"name\":\"" + bridge_api::escape_json(entity.entity_name) + "\",";
      if (!entity.entity_unit.empty()) {
        json += "\"unit\":\"" + bridge_api::escape_json(entity.entity_unit) + "\",";
      }
      json += "\"native_type\":\"";
      json += native_type_for_type(static_cast<espnow_field_type_t>(entity.entity_type));
      json += "\"";
      json += "}";
    }
    json += "]}";
  } else {
    json += "\"schema\":null";
  }
  json += "}";
  return json;
}

std::string ESPTreeBridge::api_node_state_json(const std::string &mac_colon) const {
  std::string clean;
  for (char c : mac_colon) {
    if (c != ':' && c != '-' && c != ' ') clean += c;
  }
  uint8_t mac[6]{};
  if (!parse_mac_hex_(clean, mac)) {
    return "{\"mac\":\"" + bridge_api::escape_json(mac_colon) + "\",\"state\":{}}";
  }

  std::string json;
  json.reserve(2048);
  json += "{\"mac\":\"" + bridge_api::escape_json(mac_colon) + "\",\"state\":{";
  bool first = true;
  const std::string mac_key = mac_key_string_(mac);
  for (const auto &rec : entity_values_) {
    if (rec.first.find(mac_key) != 0) continue;
    if (rec.second.current_value.empty()) continue;
    if (!first) json += ",";
    first = false;
    const std::string entity_key = rec.second.schema.entity_id.empty() ?
        rec.second.schema.entity_name : rec.second.schema.entity_id;
    json += "\"" + bridge_api::escape_json(entity_key) + "\":";
    json += bridge_api::state_value_json(
        rec.second.current_type,
        rec.second.current_value.data(),
        rec.second.current_value.size(),
        rec.second.schema.entity_options);
  }
  json += "}}";
  return json;
}

bool ESPTreeBridge::api_node_config_start(const std::string &mac_colon, uint8_t command,
                                           const std::vector<uint8_t> &payload,
                                           const std::string &command_name,
                                           bridge_api::NodeConfigCallback callback,
                                           std::string &immediate_result_out) {
  immediate_result_out.clear();

  std::string clean;
  for (char c : mac_colon) {
    if (c != ':' && c != '-' && c != ' ') clean += c;
  }
  uint8_t mac[6]{};
  if (!parse_mac_hex_(clean, mac)) {
    immediate_result_out = bridge_api::config_result::INVALID_PAYLOAD;
    return false;
  }

  if (memcmp(mac, sta_mac_.data(), 6) == 0) {
    immediate_result_out = bridge_api::config_result::NOT_REMOTE;
    return false;
  }

  const BridgeSession *session = protocol_.get_session(mac);
  if (session == nullptr || !session->online || !session->session_key_valid) {
    immediate_result_out = bridge_api::config_result::NO_SESSION;
    return false;
  }

  auto wrapped_callback = [callback, command_name](const ConfigAckResult &result) {
    if (callback) callback(config_result_string_(result), command_name);
  };

  const uint8_t *payload_data = payload.empty() ? nullptr : payload.data();
  if (!protocol_.send_config_to_leaf(mac, command, payload_data, payload.size(), wrapped_callback)) {
    immediate_result_out = bridge_api::config_result::NO_SESSION;
    return false;
  }
  return true;
}

std::string ESPTreeBridge::api_runtime_bridge_mac() const {
  return mac_colon_string_(sta_mac_.data());
}

namespace {

static std::string runtime_schema_hash_(const BridgeSession &session) {
  uint8_t schema_hash_bytes[32];
  memcpy(schema_hash_bytes, session.schema_hash.data(), sizeof(schema_hash_bytes));
  return "sha256:" + bridge_api::bytes_to_lower_hex(schema_hash_bytes, sizeof(schema_hash_bytes));
}

static std::string runtime_firmware_md5_(const BridgeSession &session) {
  uint8_t firmware_md5_bytes[16];
  memcpy(firmware_md5_bytes, session.firmware_md5.data(), sizeof(firmware_md5_bytes));
  return bridge_api::bytes_to_lower_hex(firmware_md5_bytes, sizeof(firmware_md5_bytes));
}

static std::string runtime_session_id_(const BridgeSession &session, const std::string &network_id) {
  std::string input;
  input.reserve(16 + 16 + 6 + network_id.size());
  input.append(reinterpret_cast<const char *>(session.bridge_nonce.data()), session.bridge_nonce.size());
  input.append(reinterpret_cast<const char *>(session.remote_nonce.data()), session.remote_nonce.size());
  input.append(reinterpret_cast<const char *>(session.leaf_mac.data()), session.leaf_mac.size());
  input += network_id;
  uint8_t digest[32]{};
  espnow_crypto_hmac_sha256(session.session_key.data(), session.session_key.size(),
                            reinterpret_cast<const uint8_t *>(input.data()), input.size(), digest);
  return bridge_api::bytes_to_lower_hex(digest, 8);
}

static uint64_t runtime_now_unix_ms_() {
  const time_t now = time(nullptr);
  return now <= 0 ? 0 : static_cast<uint64_t>(now) * 1000ULL;
}

static void runtime_write_capabilities_(bridge_api::runtime_pb::Writer &w) {
  w.boolean(1, true);
  w.boolean(2, true);
  w.boolean(3, true);
  w.boolean(4, true);
  w.boolean(5, true);
  w.boolean(6, true);
}

static bool runtime_entity_writable_(espnow_field_type_t type) {
  switch (type) {
    case FIELD_TYPE_SWITCH:
    case FIELD_TYPE_BUTTON:
    case FIELD_TYPE_NUMBER:
    case FIELD_TYPE_TEXT:
    case FIELD_TYPE_SELECT:
    case FIELD_TYPE_LIGHT:
    case FIELD_TYPE_FAN:
    case FIELD_TYPE_COVER:
    case FIELD_TYPE_VALVE:
    case FIELD_TYPE_LOCK:
    case FIELD_TYPE_ALARM:
      return true;
    default:
      return false;
  }
}

static void runtime_write_entity_state_(bridge_api::runtime_pb::Writer &w, const std::string &object_id,
                                        bool available, uint64_t observed_unix_ms,
                                        espnow_field_type_t type, const std::vector<uint8_t> &value,
                                        const std::string &options) {
  w.string(1, object_id);
  w.boolean(2, available);
  w.varint(3, observed_unix_ms);
  switch (type) {
    case FIELD_TYPE_SWITCH:
    case FIELD_TYPE_BINARY:
      w.boolean(10, !value.empty() && value[0] != 0);
      break;
    case FIELD_TYPE_LOCK: {
      const char *state = "UNLOCKED";
      if (!value.empty()) {
        if (value[0] == 1) state = "LOCKED";
        else if (value[0] == 2) state = "JAMMED";
      }
      w.string(13, state);
      break;
    }
    case FIELD_TYPE_ALARM: {
      const char *state = "disarmed";
      if (!value.empty()) {
        switch (value[0]) {
          case 1:  state = "armed_home"; break;
          case 2:  state = "armed_away"; break;
          case 3:  state = "armed_night"; break;
          case 4:  state = "armed_vacation"; break;
          case 5:  state = "armed_custom_bypass"; break;
          case 6:  state = "triggered"; break;
          case 7:  state = "pending"; break;
          case 8:  state = "arming"; break;
          case 9:  state = "disarming"; break;
          default: state = "disarmed"; break;
        }
      }
      w.string(13, state);
      break;
    }
    case FIELD_TYPE_COVER:
    case FIELD_TYPE_VALVE:
    case FIELD_TYPE_SELECT:
      w.sint64(11, value.empty() ? 0 : value[0]);
      break;
    case FIELD_TYPE_SENSOR:
    case FIELD_TYPE_NUMBER:
      w.fixed64(12, [&]() -> uint64_t {
        double d = static_cast<double>(decode_float(value.data(), value.size()));
        uint64_t bits = 0;
        memcpy(&bits, &d, sizeof(bits));
        return bits;
      }());
      break;
    case FIELD_TYPE_TEXT:
    case FIELD_TYPE_TEXT_SENSOR:
    case FIELD_TYPE_EVENT:
      w.string(13, std::string(reinterpret_cast<const char *>(value.data()), value.size()));
      break;
    default:
      w.string(13, bridge_api::state_value_json(type, value.data(), value.size(), options));
      break;
  }
}

}  // namespace

void ESPTreeBridge::api_runtime_encode_auth_ok(const std::string &request_id, std::vector<uint8_t> &out) const {
  const std::string bridge_mac = mac_colon_string_(sta_mac_.data());
  const std::string device_name = sanitize_object_id(App.get_name().str());
  const std::string build_date = format_build_date_(protocol_.bridge_identity().build_date.c_str(),
                                                    protocol_.bridge_identity().build_time.c_str());
  bridge_api::runtime_pb::envelope(out, request_id, bridge_api::runtime_pb::AUTH_OK, [&](bridge_api::runtime_pb::Writer &w) {
    w.varint(1, bridge_api::runtime_pb::kRuntimeApiVersion);
    w.string(2, bridge_friendly_name_);
    w.message(3, [&](bridge_api::runtime_pb::Writer &b) {
      b.string(1, bridge_mac);
      b.string(2, device_name);
      b.string(3, bridge_friendly_name_);
      b.string(4, network_id_);
      b.string(5, "ESPHome");
      b.string(6, "esp_tree_bridge");
      b.string(7, protocol_.bridge_identity().project_name);
      b.string(8, protocol_.bridge_identity().project_version);
      b.string(9, build_date);
      b.string(10, bridge_api::runtime_pb::kRuntimeProtocol);
    });
    w.message(4, runtime_write_capabilities_);
  });
}

void ESPTreeBridge::api_runtime_encode_full_snapshot(const std::string &request_id, std::vector<uint8_t> &out) const {
  const std::string bridge_mac = mac_colon_string_(sta_mac_.data());
  const std::string bridge_name = sanitize_object_id(App.get_name().str());
  const std::string bridge_build_date = format_build_date_(protocol_.bridge_identity().build_date.c_str(),
                                                           protocol_.bridge_identity().build_time.c_str());
  const uint64_t now_ms = runtime_now_unix_ms_();
  const uint32_t now_s = millis() / 1000U;

  bridge_api::runtime_pb::envelope(out, request_id, bridge_api::runtime_pb::FULL_SNAPSHOT,
                                   [&](bridge_api::runtime_pb::Writer &w) {
    w.message(1, [&](bridge_api::runtime_pb::Writer &b) {
      b.string(1, bridge_mac);
      b.string(2, bridge_name);
      b.string(3, bridge_friendly_name_);
      b.string(4, network_id_);
      b.string(5, "ESPHome");
      b.string(6, "esp_tree_bridge");
      b.string(7, protocol_.bridge_identity().project_name);
      b.string(8, protocol_.bridge_identity().project_version);
      b.string(9, bridge_build_date);
      b.string(10, bridge_api::runtime_pb::kRuntimeProtocol);
      b.string(11, chip_model_string(protocol_.bridge_identity().chip_model));
    });
    w.message(2, [&](bridge_api::runtime_pb::Writer &b) {
      b.boolean(1, true);
      b.sint32(2, 0);
      b.varint(3, protocol_.bridge_uptime_s_);
      b.varint(4, protocol_.get_active_remote_count());
    });

    for (const auto &entry : protocol_.get_sessions()) {
      const BridgeSession &session = entry.second;
      const bool online = session.online.load();
      const uint32_t offline_s = online || session.last_seen_bridge_uptime_s == 0 ? 0 : now_s - session.last_seen_bridge_uptime_s;
      const uint32_t last_seen_ago = session.last_seen_bridge_uptime_s == 0 ? 0 : now_s - session.last_seen_bridge_uptime_s;
      const std::string remote_mac = mac_colon_string_(session.leaf_mac.data());
      const std::string parent_mac = mac_colon_string_(session.parent_mac.data());
      const std::string schema_hash = runtime_schema_hash_(session);
      const std::string session_id = runtime_session_id_(session, network_id_);
      const std::string build_date = (!session.build_date.empty() && !session.build_time.empty())
                                         ? format_build_date_(session.build_date.c_str(), session.build_time.c_str())
                                         : "";
      w.message(3, [&](bridge_api::runtime_pb::Writer &r) {
        r.message(1, [&](bridge_api::runtime_pb::Writer &id) {
          id.string(1, remote_mac);
          id.string(2, session.esphome_name);
          id.string(3, session.node_label.empty() ? remote_mac : session.node_label);
          id.string(4, "ESPHome");
          id.string(5, "esp_tree_remote");
          id.string(6, session.project_name);
          id.string(7, session.project_version);
          id.string(8, build_date);
          id.string(9, runtime_firmware_md5_(session));
          id.string(10, schema_hash);
          id.varint(11, session.schema_entities.size());
          id.string(12, chip_model_string(session.chip_model));
          id.boolean(13, session.online.load() && session.session_key_valid.load());
          id.boolean(14, session.direct_child_count > 0 || session.total_child_count > 0);
        });
        r.message(2, [&](bridge_api::runtime_pb::Writer &rt) {
          rt.boolean(1, online);
          rt.string(2, bridge_mac);
          rt.string(3, parent_mac);
          rt.varint(4, session.hops_to_bridge);
          rt.sint32(5, session.last_rssi);
          rt.varint(7, session.last_seen_bridge_uptime_s);
          rt.string(8, session_id);
          rt.varint(9, session.last_seen_counter);
          rt.varint(10, session.uptime_seconds);
        });
        r.message(3, [&](bridge_api::runtime_pb::Writer &ds) {
          ds.string(1, schema_hash);
          for (const auto &entity : session.schema_entities) {
            if (entity.entity_type == 0) continue;
            const auto type = static_cast<espnow_field_type_t>(entity.entity_type);
            const std::string object_id = entity.entity_id.empty() ? sanitize_object_id(entity.entity_name) : entity.entity_id;
            ds.message(2, [&](bridge_api::runtime_pb::Writer &ed) {
              ed.string(1, object_id);
              ed.string(2, component_for_type(type));
              ed.string(3, entity.entity_name);
              ed.string(6, entity.entity_unit);
              ed.boolean(11, runtime_entity_writable_(type));
              ed.string(12, native_type_for_type(type));
              ed.string(13, entity.entity_options);
            });
          }
        });
        const std::string session_mac_key = mac_key_string_(session.leaf_mac.data());
        for (const auto &rec : entity_values_) {
          if (rec.first.find(session_mac_key) != 0) continue;
          if (rec.second.current_value.empty()) continue;
          const std::string object_id = rec.second.schema.entity_id.empty()
                                            ? sanitize_object_id(rec.second.schema.entity_name)
                                            : rec.second.schema.entity_id;
          r.message(4, [&](bridge_api::runtime_pb::Writer &st) {
            runtime_write_entity_state_(st, object_id, online, now_ms, rec.second.current_type,
                                        rec.second.current_value, rec.second.schema.entity_options);
          });
        }
      });
    }
    w.varint(4, now_ms);
  });
}

void ESPTreeBridge::api_runtime_encode_bridge_heartbeat(std::vector<uint8_t> &out) const {
  bridge_api::runtime_pb::envelope(out, "", bridge_api::runtime_pb::EVENT_BATCH, [&](bridge_api::runtime_pb::Writer &w) {
    w.message(1, [&](bridge_api::runtime_pb::Writer &event) {
      event.message(10, [&](bridge_api::runtime_pb::Writer &hb) {
        hb.string(1, mac_colon_string_(sta_mac_.data()));
        hb.varint(2, runtime_now_unix_ms_());
        hb.varint(3, protocol_.bridge_uptime_s_);
        for (const auto &[key, session] : protocol_.get_sessions()) {
          if (!session.online || session.last_seen_bridge_uptime_s == 0) continue;
          hb.message(4, [&](bridge_api::runtime_pb::Writer &rls) {
            rls.string(1, mac_colon_string_(session.leaf_mac.data()));
            rls.varint(2, session.last_seen_bridge_uptime_s);
          });
        }
      });
    });
  });
}

void ESPTreeBridge::api_runtime_encode_topology_changed(const char *reason, const uint8_t *mac,
                                                         std::vector<uint8_t> &out) const {
  (void)reason;
  const BridgeSession *session = protocol_.get_session(mac);
  const std::string bridge_mac = mac_colon_string_(sta_mac_.data());
  bridge_api::runtime_pb::envelope(out, "", bridge_api::runtime_pb::EVENT_BATCH, [&](bridge_api::runtime_pb::Writer &w) {
    w.message(1, [&](bridge_api::runtime_pb::Writer &event) {
      event.message(15, [&](bridge_api::runtime_pb::Writer &topo) {
        topo.string(1, mac_colon_string_(mac));
        topo.string(2, bridge_mac);
        topo.string(3, session == nullptr ? "" : mac_colon_string_(session->parent_mac.data()));
        topo.varint(4, session == nullptr ? 0 : session->hops_to_bridge);
        topo.sint32(5, session == nullptr ? -127 : session->last_rssi);
        topo.varint(6, runtime_now_unix_ms_());
        topo.varint(7, session == nullptr ? 0 : session->uptime_seconds);
      });
    });
  });
}

void ESPTreeBridge::api_runtime_encode_remote_availability(const uint8_t *mac, bool online, const char *reason,
                                                            int8_t rssi, uint32_t offline_s,
                                                            const uint8_t *parent_mac, uint8_t hop_count,
                                                            std::vector<uint8_t> &out) const {
  const BridgeSession *session = protocol_.get_session(mac);
  const std::string session_id = session == nullptr ? "" : runtime_session_id_(*session, network_id_);
  const uint32_t tx = session == nullptr ? 0 : session->last_seen_counter;
  const std::string bridge_mac = mac_colon_string_(sta_mac_.data());
  bridge_api::runtime_pb::envelope(out, "", bridge_api::runtime_pb::EVENT_BATCH, [&](bridge_api::runtime_pb::Writer &w) {
    w.message(1, [&](bridge_api::runtime_pb::Writer &event) {
      event.message(11, [&](bridge_api::runtime_pb::Writer &av) {
        av.string(1, mac_colon_string_(mac));
        av.boolean(2, online);
        av.string(3, bridge_mac);
        av.string(4, session_id);
        av.varint(5, tx);
        av.varint(6, runtime_now_unix_ms_());
        av.sint32(7, rssi);
        av.varint(8, hop_count);
        av.string(9, reason == nullptr ? "" : reason);
        av.varint(10, session == nullptr ? 0 : session->uptime_seconds);
      });
    });
  });
  (void)offline_s;
  (void)parent_mac;
}

void ESPTreeBridge::api_runtime_encode_remote_state(const uint8_t *mac, const espnow_entity_schema_t &entity,
                                                     const std::vector<uint8_t> &value, espnow_field_type_t type,
                                                     uint32_t state_tx_counter, std::vector<uint8_t> &out) const {
  const BridgeSession *session = protocol_.get_session(mac);
  const std::string session_id = session == nullptr ? "" : runtime_session_id_(*session, network_id_);
  const uint32_t tx = session == nullptr ? 0 : session->last_seen_counter;
  const std::string object_id = entity.entity_id.empty() ? sanitize_object_id(entity.entity_name) : entity.entity_id;
  const uint64_t now_ms = runtime_now_unix_ms_();
  const std::string bridge_mac = mac_colon_string_(sta_mac_.data());
  bridge_api::runtime_pb::envelope(out, "", bridge_api::runtime_pb::EVENT_BATCH, [&](bridge_api::runtime_pb::Writer &w) {
    w.message(1, [&](bridge_api::runtime_pb::Writer &event) {
      event.message(12, [&](bridge_api::runtime_pb::Writer &state) {
        state.string(1, mac_colon_string_(mac));
        state.string(2, bridge_mac);
        state.string(3, session_id);
        state.varint(4, tx);
        state.message(5, [&](bridge_api::runtime_pb::Writer &st) {
          runtime_write_entity_state_(st, object_id, true, now_ms, type, value, entity.entity_options);
        });
        state.varint(6, now_ms);
        state.varint(7, state_tx_counter);
        state.varint(8, entity.entity_index);
      });
    });
  });
}

void ESPTreeBridge::api_runtime_encode_remote_schema_changed(const uint8_t *mac, const std::string &schema_hash,
                                                              std::vector<uint8_t> &out) const {
  const BridgeSession *session = protocol_.get_session(mac);
  const std::string bridge_mac = mac_colon_string_(sta_mac_.data());
  const std::string session_id = session == nullptr ? "" : runtime_session_id_(*session, network_id_);
  bridge_api::runtime_pb::envelope(out, "", bridge_api::runtime_pb::EVENT_BATCH, [&](bridge_api::runtime_pb::Writer &w) {
    w.message(1, [&](bridge_api::runtime_pb::Writer &event) {
      event.message(13, [&](bridge_api::runtime_pb::Writer &schema) {
        schema.string(1, mac_colon_string_(mac));
        schema.string(2, bridge_mac);
        schema.string(3, session_id);
        schema.string(4, "");
        if (session != nullptr) {
          const std::string build_date = (!session->build_date.empty() && !session->build_time.empty())
                                             ? format_build_date_(session->build_date.c_str(), session->build_time.c_str())
                                             : "";
          schema.message(5, [&](bridge_api::runtime_pb::Writer &snap) {
            snap.message(1, [&](bridge_api::runtime_pb::Writer &id) {
              id.string(1, mac_colon_string_(session->leaf_mac.data()));
              id.string(2, session->esphome_name);
              id.string(3, session->node_label.empty() ? mac_colon_string_(session->leaf_mac.data()) : session->node_label);
              id.string(4, "ESPHome");
              id.string(5, "esp_tree_remote");
              id.string(6, session->project_name);
              id.string(7, session->project_version);
              id.string(8, build_date);
              id.string(9, runtime_firmware_md5_(*session));
              id.string(10, schema_hash);
              id.varint(11, session->schema_entities.size());
              id.string(12, chip_model_string(session->chip_model));
              id.boolean(13, session->online.load() && session->session_key_valid.load());
              id.boolean(14, session->direct_child_count > 0 || session->total_child_count > 0);
            });
            snap.message(2, [&](bridge_api::runtime_pb::Writer &rt) {
              rt.boolean(1, session->online.load());
              rt.string(2, bridge_mac);
              rt.string(3, mac_colon_string_(session->parent_mac.data()));
              rt.varint(4, session->hops_to_bridge);
              rt.sint32(5, session->last_rssi);
              rt.string(8, session_id);
              rt.varint(9, session->last_seen_counter);
            });
            snap.message(3, [&](bridge_api::runtime_pb::Writer &ds) {
              ds.string(1, schema_hash);
              for (const auto &entity : session->schema_entities) {
                if (entity.entity_type == 0) continue;
                const auto type = static_cast<espnow_field_type_t>(entity.entity_type);
                ds.message(2, [&](bridge_api::runtime_pb::Writer &ed) {
                  ed.string(1, entity.entity_id.empty() ? sanitize_object_id(entity.entity_name) : entity.entity_id);
                  ed.string(2, component_for_type(type));
                  ed.string(3, entity.entity_name);
                  ed.string(6, entity.entity_unit);
                  ed.boolean(11, runtime_entity_writable_(type));
                  ed.string(12, native_type_for_type(type));
                  ed.string(13, entity.entity_options);
                });
              }
            });
          });
        }
      });
    });
  });
}

void ESPTreeBridge::api_runtime_handle_command(const std::string &request_id,
                                                const bridge_api::runtime_pb::ParsedCommandRequest &request,
                                                std::vector<uint8_t> &out) {
  std::string clean;
  for (char c : request.remote_mac) if (c != ':' && c != '-' && c != ' ') clean += c;
  uint8_t mac[6]{};
  bridge_api::runtime_pb::CommandStatus status = bridge_api::runtime_pb::COMMAND_STATUS_UNAVAILABLE;
  std::string error_code;
  std::string error_message;
  std::string session_id;

  if (!parse_mac_hex_(clean, mac)) {
    status = bridge_api::runtime_pb::COMMAND_STATUS_FAILED;
    error_code = "invalid_remote_mac";
    error_message = "Invalid remote MAC";
  } else {
    BridgeSession *session = protocol_.get_session(mac);
    if (session == nullptr || !session->online || !session->session_key_valid) {
      error_code = "remote_unavailable";
      error_message = "Remote session is unavailable";
    } else {
      session_id = runtime_session_id_(*session, network_id_);
      const BridgeEntitySchema *match = nullptr;
      for (const auto &entity : session->schema_entities) {
        if (entity.entity_type == 0) continue;
        const std::string object_id = entity.entity_id.empty() ? sanitize_object_id(entity.entity_name) : entity.entity_id;
        if (object_id == request.object_id) {
          match = &entity;
          break;
        }
      }
      if (match == nullptr) {
        status = bridge_api::runtime_pb::COMMAND_STATUS_UNSUPPORTED;
        error_code = "entity_not_found";
        error_message = "Entity object_id is not in the current remote schema";
      } else {
        std::string payload;
        if (request.command == "turn_on") payload = "ON";
        else if (request.command == "turn_off") payload = "OFF";
        else if (request.command == "press") payload = "PRESS";
        else if (request.command == "open") payload = "OPEN";
        else if (request.command == "close") payload = "CLOSE";
        else if (request.command == "stop") payload = "STOP";
        else if (request.command == "lock") payload = "LOCK";
        else if (request.command == "unlock") payload = "UNLOCK";
        else if (request.command == "arm_home") payload = "ARM_HOME";
        else if (request.command == "arm_away") payload = "ARM_AWAY";
        else if (request.command == "arm_night") payload = "ARM_NIGHT";
        else if (request.command == "arm_vacation") payload = "ARM_VACATION";
        else if (request.command == "arm_custom_bypass") payload = "ARM_CUSTOM_BYPASS";
        else if (request.command == "disarm") payload = "DISARM";
        else if (request.command == "trigger") payload = "TRIGGERED";
        else if (!request.args.empty()) payload = request.args.front().value;
        else payload = request.command;

        // Override simple mapping if a JSON arg is provided — enables
        // complex command payloads for light, fan, alarm, etc.
        if (!request.args.empty()) {
          const auto &first_arg = request.args.front();
          if (!first_arg.value.empty() && first_arg.value[0] == '{') {
            payload = first_arg.value;
          }
        }

        std::vector<uint8_t> current_value;
        const std::string key = entity_value_key_(mac, *match);
        auto it = entity_values_.find(key);
        if (it != entity_values_.end()) current_value = it->second.current_value;
        std::vector<uint8_t> value;

        CommandRouteKind route = CommandRouteKind::PRIMARY;
        if (match->entity_type == FIELD_TYPE_FAN) {
          if (request.command == "set_speed") route = CommandRouteKind::FAN_SPEED;
          else if (request.command == "set_oscillation") route = CommandRouteKind::FAN_OSCILLATION;
          else if (request.command == "set_direction") route = CommandRouteKind::FAN_DIRECTION;
        }

        if (!decode_command_payload_(*match, route, payload, value, current_value)) {
          status = bridge_api::runtime_pb::COMMAND_STATUS_UNSUPPORTED;
          error_code = "unsupported_command";
          error_message = "Command is not supported for this entity";
        } else if (!protocol_.send_command_to_leaf(mac, match->entity_index, value)) {
          status = bridge_api::runtime_pb::COMMAND_STATUS_FAILED;
          error_code = "send_failed";
          error_message = "Bridge failed to queue command";
        } else {
          status = bridge_api::runtime_pb::COMMAND_STATUS_ACCEPTED;
        }
      }
    }
  }

  bridge_api::runtime_pb::envelope(out, request_id, bridge_api::runtime_pb::COMMAND_RESULT,
                                   [&](bridge_api::runtime_pb::Writer &w) {
    w.string(1, request.remote_mac);
    w.string(2, request.object_id);
    w.string(3, request.command);
    w.string(4, mac_colon_string_(sta_mac_.data()));
    w.string(5, session_id);
    w.varint(6, status);
    w.string(7, error_code);
    w.string(8, error_message);
  });
}

void ESPTreeBridge::api_runtime_handle_config_command(
    const std::string &request_id, const bridge_api::runtime_pb::ParsedConfigCommandRequest &request,
    ConfigResponseCallback callback) {
  std::vector<uint8_t> out;
  auto finish = [&]() {
    if (callback != nullptr) callback(out);
  };
  uint8_t command = 0;
  std::vector<uint8_t> payload;
  if (request.command == "reboot") {
    command = CFG_CMD_REBOOT;
  } else if (request.command == "heartbeat_interval") {
    command = CFG_CMD_HEARTBEAT_INTERVAL;
    payload.resize(4);
    uint32_t interval = request.interval_seconds;
    memcpy(payload.data(), &interval, sizeof(interval));
  } else if (request.command == "force_rediscover") {
    command = CFG_CMD_FORCE_REDISCOVER;
  } else if (request.command == "set_parent_mac") {
    command = CFG_CMD_SET_PARENT_MAC;
    payload.resize(7, 0);
    payload[0] = request.clear_parent ? SET_PARENT_MAC_FLAG_CLEAR : 0;
    std::string clean;
    for (char c : request.parent_mac) if (c != ':' && c != '-' && c != ' ') clean += c;
    if (!clean.empty() && !parse_mac_hex_(clean, payload.data() + 1)) {
      bridge_api::runtime_pb::error_envelope(out, request_id, "invalid_parent_mac", "Invalid parent MAC");
      finish();
      return;
    }
  } else if (request.command == "relay") {
    command = CFG_CMD_RELAY;
    payload = {static_cast<uint8_t>(request.relay_enable ? 1 : 0)};
  } else {
    bridge_api::runtime_pb::error_envelope(out, request_id, "unsupported_config_command", "Unsupported config command");
    finish();
    return;
  }

  auto on_config_ack = [this, request_id, callback, remote_mac = request.remote_mac, cmd = request.command](
      const std::string &result, const std::string & /*command_result*/) {
    if (!callback) return;
    auto status = bridge_api::runtime_pb::COMMAND_STATUS_ACCEPTED;
    if (result == bridge_api::config_result::TIMEOUT || result == bridge_api::config_result::NO_SESSION) {
      status = bridge_api::runtime_pb::COMMAND_STATUS_TIMEOUT;
    } else if (result == bridge_api::config_result::BUSY) {
      status = bridge_api::runtime_pb::COMMAND_STATUS_UNAVAILABLE;
    } else if (result == bridge_api::config_result::REJECTED || result == bridge_api::config_result::UNSUPPORTED ||
               result == bridge_api::config_result::INVALID_PAYLOAD) {
      status = bridge_api::runtime_pb::COMMAND_STATUS_FAILED;
    }
    std::vector<uint8_t> out;
    bridge_api::runtime_pb::envelope(out, request_id, bridge_api::runtime_pb::CONFIG_COMMAND_RESULT,
                                   [&](bridge_api::runtime_pb::Writer &w) {
      w.string(1, remote_mac);
      w.string(2, cmd);
      w.string(3, mac_colon_string_(sta_mac_.data()));
      w.varint(5, status);
      w.string(7, result);
    });
    callback(out);
  };

  std::string immediate;
  if (!api_node_config_start(request.remote_mac, command, payload, request.command, on_config_ack, immediate)) {
    if (callback) {
      if (immediate.empty()) immediate = bridge_api::config_result::NO_SESSION;
      auto status = bridge_api::runtime_pb::COMMAND_STATUS_FAILED;
      if (immediate == bridge_api::config_result::TIMEOUT) {
        status = bridge_api::runtime_pb::COMMAND_STATUS_TIMEOUT;
      } else if (immediate == bridge_api::config_result::BUSY) {
        status = bridge_api::runtime_pb::COMMAND_STATUS_UNAVAILABLE;
      }
      std::vector<uint8_t> out;
      bridge_api::runtime_pb::envelope(out, request_id, bridge_api::runtime_pb::CONFIG_COMMAND_RESULT,
                                       [&](bridge_api::runtime_pb::Writer &w) {
        w.string(1, request.remote_mac);
        w.string(2, request.command);
        w.string(3, mac_colon_string_(sta_mac_.data()));
        w.varint(5, status);
        w.string(7, immediate);
      });
      callback(out);
    }
    return;
  }
}

bool ESPTreeBridge::api_ota_start(const std::string &target_mac_colon, uint32_t file_size,
                                    const std::string &md5_hex, const std::string &sha256_hex,
                                    const std::string &filename, uint16_t preferred_chunk_size,
                                    std::string &job_id_out, uint16_t &max_chunk_size_out,
                                    const std::string &request_id,
                                    std::string &error_out) {
  std::string clean;
  for (char c : target_mac_colon) {
    if (c != ':' && c != '-' && c != ' ') clean += c;
  }
  uint8_t mac[6]{};
  if (!parse_mac_hex_(clean, mac)) {
    error_out = "invalid target_mac";
    return false;
  }

  const BridgeSession *session = protocol_.get_session(mac);
  if (session == nullptr || !session->online) {
    error_out = "remote not found or offline";
    return false;
  }

  if (ota_manager_ == nullptr || ota_manager_->is_busy()) {
    error_out = "ota busy";
    return false;
  }

  uint16_t clamped = preferred_chunk_size;
  if (clamped == 0 || clamped > bridge_api::kMaxChunkSize)
    clamped = bridge_api::kMaxChunkSize;

  uint8_t md5[16]{};
  if (!parse_md5_hex_(md5_hex, md5)) {
    error_out = "invalid md5 hex";
    return false;
  }

  uint16_t remote_max = session->session_max_payload;
  if (!ota_manager_->start_transfer(mac, file_size, md5, ESPNOW_FILE_ACTION_OTA_FLASH,
                                     remote_max, filename.empty() ? "ota.bin" : filename.c_str())) {
    error_out = ota_manager_->last_error().empty() ? "start_transfer failed" : ota_manager_->last_error().c_str();
    return false;
  }

  ota_job_counter_++;
  char hex_buf[8];
  snprintf(hex_buf, sizeof(hex_buf), "%04x", ota_job_counter_ & 0xFFFFu);
  ota_job_id_ = hex_buf;
  job_id_out = ota_job_id_;

  max_chunk_size_out = ota_manager_->chunk_size();

  ota_job_state_ = bridge_api::OtaJobState::WAITING_FOR_LEAF;
  ota_request_id_ = request_id;
  std::copy_n(mac, ota_target_mac_.size(), ota_target_mac_.begin());
  ota_session_id_.clear();
  ota_last_requested_sequences_.clear();
  ota_chunk_request_counter_ = 0;
  ota_last_status_percent_ = 255;
  ota_last_status_ms_ = 0;

  ESP_LOGI(TAG, "WS OTA started job=%s target=%s size=%u", ota_job_id_.c_str(),
           target_mac_colon.c_str(), static_cast<unsigned>(file_size));

  (void) sha256_hex;
  return true;
}

void ESPTreeBridge::set_ota_transport_callbacks(bridge_api::OtaTransportCallbacks *callbacks) {
  ota_transport_callbacks_ = callbacks;
  if (ota_transport_callbacks_ != nullptr &&
      ota_job_state_ != bridge_api::OtaJobState::IDLE) {
    ota_manager_prev_public_state_.clear();
  }
}

void ESPTreeBridge::clear_ota_transport_callbacks(bridge_api::OtaTransportCallbacks *callbacks) {
  if (ota_transport_callbacks_ == callbacks) {
    ota_transport_callbacks_ = nullptr;
  }
}

bool ESPTreeBridge::api_ota_abort(const std::string &job_id, const std::string &reason) {
  if (ota_job_state_ == bridge_api::OtaJobState::IDLE) return false;
  if (!job_id.empty() && job_id != ota_job_id_) return false;

  if (ota_manager_ != nullptr && ota_manager_->is_busy()) {
    ota_manager_->on_source_abort(ESPNOW_FILE_ABORT_USER);
  }
  ota_job_state_ = bridge_api::OtaJobState::IDLE;
  return true;
}

bool ESPTreeBridge::api_ota_inject_chunk(uint32_t sequence, const uint8_t *data, size_t len) {
  if (ota_job_state_ != bridge_api::OtaJobState::TRANSFERRING) return false;
  if (ota_manager_ == nullptr) return false;
  return ota_manager_->on_source_chunk(sequence, data, len);
}

bool ESPTreeBridge::api_ota_has_active_job() const {
  return ota_job_state_ != bridge_api::OtaJobState::IDLE;
}

std::string ESPTreeBridge::api_ota_active_job_id() const {
  return ota_job_state_ != bridge_api::OtaJobState::IDLE ? ota_job_id_ : "";
}

std::string ESPTreeBridge::api_ota_active_chunk_request_id() const {
  return ota_session_id_;
}

uint16_t ESPTreeBridge::api_ota_chunk_size() const {
  return ota_manager_ != nullptr ? ota_manager_->chunk_size() : bridge_api::kMaxChunkSize;
}

uint16_t ESPTreeBridge::api_ota_max_chunks_per_batch() const {
  return 6;
}

std::vector<uint32_t> ESPTreeBridge::api_ota_requested_sequences() const {
  return ota_requested_sequences_();
}

void ESPTreeBridge::api_ota_resend_chunk_request() {
  if (ota_job_state_ == bridge_api::OtaJobState::TRANSFERRING && ota_transport_callbacks_ != nullptr) {
    ota_last_requested_sequences_.clear();
    const std::vector<uint32_t> requested = ota_requested_sequences_();
    if (!requested.empty()) {
      ota_session_id_ = next_ota_chunk_request_id_();
      ota_last_requested_sequences_ = requested;
      ota_transport_callbacks_->on_ota_chunk_request(
          ota_job_id_, ota_session_id_, requested,
          0, 0, ota_manager_ != nullptr ? ota_manager_->current_increment() : 0,
          ota_manager_ != nullptr ? ota_manager_->total_increments() : 0,
          ota_manager_ != nullptr ? ota_manager_->retransmit_round() : 0,
          ota_manager_ != nullptr ? ota_manager_->buffer_size_kb() : bridge_api::kOtaMaxIncrementKB,
          ota_manager_ != nullptr ? ota_manager_->progress_pct() : 0);
    }
  }
}

std::vector<uint32_t> ESPTreeBridge::ota_requested_sequences_() const {
  std::vector<uint32_t> requested;
  if (ota_manager_ != nullptr) {
    for (auto seq : ota_manager_->requested_sequences()) {
      requested.push_back(seq);
    }
  }
  return requested;
}

std::string ESPTreeBridge::next_ota_chunk_request_id_() {
  ota_chunk_request_counter_++;
  return ota_job_id_ + "-" + std::to_string(ota_chunk_request_counter_);
}

void ESPTreeBridge::emit_ota_status_callback_(bridge_api::runtime_pb::OtaState state,
                                              const std::string &error_detail) {
  if (ota_transport_callbacks_ == nullptr) return;
  uint32_t percent = ota_manager_ != nullptr ? ota_manager_->progress_pct() : 0;
  uint32_t file_size = ota_manager_ != nullptr ? ota_manager_->file_size() : 0;
  uint32_t bytes_received = file_size > 0 ? (file_size * percent) / 100U : 0;
  ota_transport_callbacks_->on_ota_status(ota_job_id_, state, percent, bytes_received, file_size, error_detail);
}

void ESPTreeBridge::emit_ota_events_() {
  if (ota_transport_callbacks_ == nullptr) return;
  if (ota_job_state_ == bridge_api::OtaJobState::IDLE) return;

  if (ota_job_state_ == bridge_api::OtaJobState::WAITING_FOR_LEAF) {
    if (ota_manager_ != nullptr && ota_manager_->is_busy() &&
        ota_manager_->public_state() == "TRANSFERRING" &&
        ota_manager_prev_public_state_ != "TRANSFERRING") {
      std::string target_mac_str = mac_display(ota_target_mac_.data());
      uint16_t chunk_sz = ota_manager_->chunk_size();
      uint32_t total_chks = ota_manager_->total_chunks();
      std::vector<uint32_t> requested = ota_requested_sequences_();
      ESP_LOGI(TAG, "Sending ota_accepted with chunk_size=%u total_chunks=%u requested=%zu",
               static_cast<unsigned>(chunk_sz), static_cast<unsigned>(total_chks), requested.size());
      ota_job_state_ = bridge_api::OtaJobState::TRANSFERRING;
      ota_manager_prev_public_state_ = "TRANSFERRING";

      ota_last_requested_sequences_ = requested;
      ota_last_status_percent_ = 255;
      ota_last_status_ms_ = millis();
      ota_transport_callbacks_->on_ota_accepted(ota_request_id_, ota_job_id_, target_mac_str,
                                                chunk_sz, total_chks, 6);
      ota_session_id_ = next_ota_chunk_request_id_();
      ota_transport_callbacks_->on_ota_chunk_request(
          ota_job_id_, ota_session_id_, requested,
          0, 0, ota_manager_->current_increment(), ota_manager_->total_increments(),
          ota_manager_->retransmit_round(), ota_manager_->buffer_size_kb(), ota_manager_->progress_pct());
      return;
    }
    if (ota_manager_ == nullptr || !ota_manager_->is_busy()) {
      emit_ota_status_callback_(bridge_api::runtime_pb::OTA_STATE_FAILED,
                                "OTA transfer failed before leaf accepted");
      ota_job_state_ = bridge_api::OtaJobState::IDLE;
      ota_manager_prev_public_state_.clear();
      ota_last_requested_sequences_.clear();
      return;
    }
    if (ota_manager_ != nullptr) {
      ota_manager_prev_public_state_ = ota_manager_->public_state();
    }
    return;
  }

  if (ota_job_state_ == bridge_api::OtaJobState::TRANSFERRING) {
    if (ota_manager_ == nullptr) {
      ota_job_state_ = bridge_api::OtaJobState::IDLE;
      ota_manager_prev_public_state_.clear();
      return;
    }
    std::string current_state = ota_manager_->public_state();
    if (current_state == "SUCCESS" && ota_manager_prev_public_state_ != "SUCCESS") {
      emit_ota_status_callback_(bridge_api::runtime_pb::OTA_STATE_SUCCESS);
      ota_job_state_ = bridge_api::OtaJobState::SUCCESS;
      ota_manager_prev_public_state_ = "SUCCESS";
      ota_last_requested_sequences_.clear();
      return;
    }
    if (current_state == "FAIL" && ota_manager_prev_public_state_ != "FAIL") {
      std::string error = ota_manager_->last_error();
      emit_ota_status_callback_(bridge_api::runtime_pb::OTA_STATE_FAILED, error);
      ota_job_state_ = bridge_api::OtaJobState::FAILED;
      ota_manager_prev_public_state_ = "FAIL";
      ota_last_requested_sequences_.clear();
      return;
    }
    if (!ota_manager_->is_busy()) {
      ota_job_state_ = bridge_api::OtaJobState::IDLE;
      ota_manager_prev_public_state_.clear();
      ota_last_requested_sequences_.clear();
      return;
    }
    const std::vector<uint32_t> requested = ota_requested_sequences_();
    bool requested_is_subset_of_last = true;
    for (uint32_t seq : requested) {
      if (std::find(ota_last_requested_sequences_.begin(), ota_last_requested_sequences_.end(), seq) ==
          ota_last_requested_sequences_.end()) {
        requested_is_subset_of_last = false;
        break;
      }
    }
    if (requested.empty()) {
      ota_last_requested_sequences_.clear();
    } else if (ota_last_requested_sequences_.empty() || !requested_is_subset_of_last) {
      ota_last_requested_sequences_ = requested;
      ota_session_id_ = next_ota_chunk_request_id_();
      ota_transport_callbacks_->on_ota_chunk_request(
          ota_job_id_, ota_session_id_, requested,
          0, 0, ota_manager_->current_increment(), ota_manager_->total_increments(),
          ota_manager_->retransmit_round(), ota_manager_->buffer_size_kb(), ota_manager_->progress_pct());
    }
    bridge_api::runtime_pb::OtaState state = bridge_api::runtime_pb::OTA_STATE_TRANSFERRING;
    if (current_state == "VERIFYING") {
      state = bridge_api::runtime_pb::OTA_STATE_VERIFYING;
    }
    const uint8_t percent = ota_manager_->progress_pct();
    const uint32_t now = millis();
    if (state == bridge_api::runtime_pb::OTA_STATE_VERIFYING ||
        ota_last_status_percent_ == 255 ||
        percent >= ota_last_status_percent_ + 10 ||
        now - ota_last_status_ms_ >= 5000) {
      emit_ota_status_callback_(state);
      ota_last_status_percent_ = percent;
      ota_last_status_ms_ = now;
    }
    ota_manager_prev_public_state_ = current_state;
    return;
  }
}

std::string ESPTreeBridge::mac_colon_string_(const uint8_t *mac) const { return mac_display(mac); }

#ifndef USE_SERIAL
std::string ESPTreeBridge::get_ip_string() const {
  if (wifi::global_wifi_component == nullptr) {
    return "";
  }
  auto ips = wifi::global_wifi_component->get_ip_addresses();
  for (auto &ip : ips) {
    if (ip.is_set()) {
      char buf[network::IP_ADDRESS_BUFFER_SIZE];
      ip.str_to(buf);
      return std::string(buf);
    }
  }
  return "";
}

void ESPTreeBridge::register_web_handler_() {
  if (web_server_base::global_web_server_base == nullptr) return;

  static const char *const kHtml =
      "<!DOCTYPE html><html><head><meta charset='utf-8'>"
      "<title>Topology</title>"
      "<style>"
      "*{margin:0;padding:0;box-sizing:border-box}"
      "body{font-family:system-ui,sans-serif;background:#1a1a2e;color:#e0e0e0;padding:1.5em}"
      "h2{margin-bottom:1em;color:#00d4ff}"
      ".tree{list-style:none;padding-left:1.2em}"
      ".tree li{position:relative;padding:.35em 0 .35em 1.2em}"
      ".tree li::before{content:'';position:absolute;left:0;top:0;width:1px;height:100%;background:#444}"
      ".tree li::after{content:'';position:absolute;left:0;top:1.1em;width:1em;height:1px;background:#444}"
      ".tree>li::before,.tree>li::after{display:none}"
      ".tree li:last-child::before{height:1.1em}"
      ".node{display:inline-flex;align-items:center;gap:.5em;padding:.3em .7em;"
      "border-radius:6px;background:#16213e;border:1px solid #0f3460}"
      ".node.bridge{border-color:#00d4ff;background:#0f3460}"
      ".dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}"
      ".dot.on{background:#00e676}.dot.connecting{background:#888}.dot.off{background:#ff5252}"
      ".lbl{font-weight:600}.mac{font-size:.75em;color:#888}"
      ".badge{font-size:.7em;background:#ff5252;color:#fff;padding:1px 5px;border-radius:3px;margin-left:.3em}"
      ".badge.connecting{background:#888}"
      ".v2-badge{font-size:1.1em;margin-left:.4em}"
      ".uptime{font-size:.7em;color:#888;margin-left:.5em}"
      ".entities{font-size:.7em;color:#0af;margin-left:.5em}"
      ".ota-link{font-size:.7em;color:#00d4ff;text-decoration:none;margin-left:.5em}"
      ".ota-link:hover{text-decoration:underline}"
      ".rssi{font-size:.7em;color:#aaa;margin-left:.5em}"
      ".chip-badge{font-size:.7em;background:#0a5b8c;color:#fff;padding:1px 5px;border-radius:3px;margin-left:.3em}"
      ".lastseen{font-size:.7em;color:#888;margin-left:.5em}"
      "</style></head><body>"
      "<h2 id='title'>Topology</h2>"
      "<ul class='tree' id='tree'></ul>"
      "<script>"
      "function fmt(s){if(s<60)return s+'s';if(s<3600)return Math.floor(s/60)+'m';return Math.floor(s/3600)+'h'}"
      "function fmtU(s){var r=[];if(s>=86400){var d=Math.floor(s/86400);s%=86400;r.push(d+'d')}if(s>=3600){var h=Math.floor(s/3600);s%=3600;if(h>0||r.length>0)r.push(h+'h')}if(s>=60){var m=Math.floor(s/60);s%=60;if(m>0||r.length>0)r.push(m+'m')}r.push(s+'s');return r.join('')}"
      "function fmtLastSeen(bt,ls){if(!ls)return'?';var ago=bt-ls;if(ago<0)ago=0;if(ago<60)return Math.floor(ago)+'s';if(ago<3600)return Math.floor(ago/60)+'m';if(ago<86400)return Math.floor(ago/3600)+'h';return Math.floor(ago/86400)+'d'}"
      "function build(data){"
      "var m={};data.forEach(function(n){m[n.mac]=n});"
      "var cm={};data.forEach(function(n){if(n.parent_mac){"
      "if(!cm[n.parent_mac])cm[n.parent_mac]=[];cm[n.parent_mac].push(n)}});"
      "var bridgeUptime=data[0]?data[0].uptime_s:0;"
      "function mk(n){var li=document.createElement('li');"
      "var s=document.createElement('span');s.className='node bridge';"
      "var d=document.createElement('span');d.className='dot '+(n.state===5?'on':'connecting');"
      "var l=document.createElement('span');l.className='lbl';l.textContent=n.label;"
      "if(n.chip_name){var cb=document.createElement('span');cb.className='chip-badge';cb.textContent=n.chip_name;l.appendChild(cb)}"
      "var mac=document.createElement('span');mac.className='mac';mac.textContent=n.mac;"
      "s.appendChild(d);s.appendChild(l);s.appendChild(mac);"

      "if(n.last_seen_bridge_uptime_s&&bridgeUptime>0&&n.hops>0){var ls=document.createElement('span');ls.className='lastseen';ls.textContent='seen '+fmtLastSeen(bridgeUptime,n.last_seen_bridge_uptime_s);s.appendChild(ls)}"
      "if(n.uptime_s>0){var u=document.createElement('span');u.className='uptime';u.textContent='up ';var t=document.createElement('span');t.textContent=fmtU(n.uptime_s);u.appendChild(t);s.appendChild(u)}"
      "if(n.entity_count!==undefined){var e=document.createElement('span');e.className='entities';e.textContent=n.entity_count+' ent';s.appendChild(e)}"
      "if(n.rssi!==undefined){var r=document.createElement('span');r.className='rssi';r.textContent=n.rssi+' dBm';s.appendChild(r)}"
      "if(!n.online){var b=document.createElement('span');b.className='badge'+(n.state>=1&&n.state<=4?' connecting':'');"
      "b.textContent='offline '+fmtLastSeen(bridgeUptime,n.last_seen_bridge_uptime_s);s.appendChild(b)}"
      "li.appendChild(s);"
      "var ch=cm[n.mac];if(ch&&ch.length){var ul=document.createElement('ul');"
      "ul.className='tree';ch.forEach(function(c){ul.appendChild(mk(c))});li.appendChild(ul)}"
      "return li}"
      "var root=m[data[0].parent_mac]||data[0];"
      "if(!root||root.hops!==0)root=data.find(function(n){return n.hops===0})||data[0];"
      "document.getElementById('title').textContent=root.label+' Topology';"
      "var tree=document.getElementById('tree');tree.innerHTML='';"
      "tree.appendChild(mk(root))}"
      "function refresh(){fetch('/topology.json').then(function(r){return r.json()})"
      ".then(build).catch(function(){})}"
      "refresh();setInterval(refresh,5000)"
      "</script></body></html>";

  struct PageHandler : public AsyncWebHandler {
    ESPTreeBridge *bridge_;
    PageHandler(ESPTreeBridge *bridge) : bridge_(bridge) {}
    bool canHandle(AsyncWebServerRequest *request) const override {
      char url_buf[AsyncWebServerRequest::URL_BUF_SIZE]{};
      return request->url_to(url_buf) == "/topology";
    }
    void handleRequest(AsyncWebServerRequest *request) override {
      request->send(200, "text/html; charset=utf-8", kHtml);
    }
    void handleUpload(AsyncWebServerRequest *, const std::string &, size_t, uint8_t *, size_t, bool) override {}
    void handleBody(AsyncWebServerRequest *, uint8_t *, size_t, size_t, size_t) override {}
    bool isRequestHandlerTrivial() const override { return false; }
  };

  struct JsonHandler : public AsyncWebHandler {
    ESPTreeBridge *bridge_;
    JsonHandler(ESPTreeBridge *bridge) : bridge_(bridge) {}
    bool canHandle(AsyncWebServerRequest *request) const override {
      char url_buf[AsyncWebServerRequest::URL_BUF_SIZE]{};
      return request->url_to(url_buf) == "/topology.json";
    }
    void handleRequest(AsyncWebServerRequest *request) override {
      std::string json = bridge_->build_topology_json_();
      request->send(200, "application/json", json.c_str());
    }
    void handleUpload(AsyncWebServerRequest *, const std::string &, size_t, uint8_t *, size_t, bool) override {}
    void handleBody(AsyncWebServerRequest *, uint8_t *, size_t, size_t, size_t) override {}
    bool isRequestHandlerTrivial() const override { return false; }
  };

  struct BridgeJsonHandler : public AsyncWebHandler {
    ESPTreeBridge *bridge_;
    explicit BridgeJsonHandler(ESPTreeBridge *b) : bridge_(b) {}
    bool canHandle(AsyncWebServerRequest *request) const override {
      char url_buf[AsyncWebServerRequest::URL_BUF_SIZE]{};
      return request->method() == HTTP_GET && request->url_to(url_buf) == "/bridge.json";
    }
    void handleRequest(AsyncWebServerRequest *request) override {
      std::string json = "{\"friendly_name\":\"";
      json += bridge_api::escape_json(bridge_->bridge_friendly_name_);
      json += "\",\"network_id\":\"";
      json += bridge_api::escape_json(bridge_->network_id_);
      json += "\",\"port\":80,\"hostname\":\"";
      json += bridge_api::escape_json(bridge_->hostname_);
      json += "\"}";
      request->send(200, "application/json", json.c_str());
    }
    void handleUpload(AsyncWebServerRequest *, const std::string &, size_t, uint8_t *, size_t, bool) override {}
    void handleBody(AsyncWebServerRequest *, uint8_t *, size_t, size_t, size_t) override {}
    bool isRequestHandlerTrivial() const override { return false; }
  };

  web_server_base::global_web_server_base->add_handler(new PageHandler(this));
  web_server_base::global_web_server_base->add_handler(new JsonHandler(this));
  web_server_base::global_web_server_base->add_handler(new BridgeJsonHandler(this));
}

void ESPTreeBridge::reset_ota_upload_state_(bool release_memory) {
  ota_upload_expected_size_ = 0;
  ota_upload_received_ = 0;
  ota_upload_last_activity_ms_ = 0;
  ota_upload_complete_ = false;
  ota_upload_failed_ = false;
  ota_upload_session_pending_ = false;
  ota_upload_target_mac_.fill(0);
  ota_upload_md5_.fill(0);
  ota_upload_error_msg_.clear();
  ota_chunk_stages_.clear();
  ota_upload_buf_.clear();
  if (release_memory) {
    ota_upload_buf_.shrink_to_fit();
  }
}



void ESPTreeBridge::schema_complete_(const uint8_t *mac, uint8_t total_entities) {
#ifdef USE_MQTT
  if (mqtt_export_ != nullptr) {
    mqtt_export_->on_schema_complete(mac, total_entities);
  }
#endif
  {
    const BridgeSession *session = protocol_.get_session(mac);
    if (session != nullptr) {
      uint8_t schema_hash_bytes[32];
      memcpy(schema_hash_bytes, session->schema_hash.data(), sizeof(schema_hash_bytes));
#ifdef USE_SERIAL
      serial_transport_->emit_remote_schema_changed(
          mac, "sha256:" + bridge_api::bytes_to_lower_hex(schema_hash_bytes, sizeof(schema_hash_bytes)));
#else
      api_proto_ws_->emit_remote_schema_changed(
          mac, "sha256:" + bridge_api::bytes_to_lower_hex(schema_hash_bytes, sizeof(schema_hash_bytes)));
#endif
    }
  }
  (void)total_entities;
}

void ESPTreeBridge::on_discovery_confirmed_(const uint8_t *mac, uint8_t entity_index, bool success) {
#ifdef USE_MQTT
  if (mqtt_export_ != nullptr) {
    mqtt_export_->on_discovery_confirmed(mac, entity_index, success);
  }
#endif
  protocol_.on_discovery_confirmed_(mac, entity_index, success);
}

bool ESPTreeBridge::setup_transport_() {
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
  protocol_.set_bridge_mac(sta_mac_.data());
  protocol_.set_publish_state_fn([this](const uint8_t *mac, const BridgeEntitySchema &entity, const std::vector<uint8_t> &value,
                                        espnow_field_type_t type, const std::string &text_value,
                                        uint32_t message_tx_base, const uint8_t *next_hop_mac) {
    {
      EntityValueCache cache;
      cache.current_value = value;
      cache.current_type = type;
      cache.schema = entity;
      entity_values_[entity_value_key_(mac, entity)] = cache;
    }
    const uint8_t required_sinks = active_state_delivery_sinks_();
    begin_state_delivery_(mac, entity.entity_index, message_tx_base, next_hop_mac, required_sinks);
#ifdef USE_SERIAL
    serial_transport_->emit_remote_state(mac, entity, value, type, message_tx_base);
#else
    if (api_proto_ws_ != nullptr) {
      api_proto_ws_->emit_remote_state(mac, entity, value, type, message_tx_base);
    }
#endif
#ifdef USE_MQTT
    if (mqtt_export_ != nullptr) {
      mqtt_export_->queue_state(mac, entity, value, type, text_value, message_tx_base, next_hop_mac, remote_display_name_(mac));
    }
#endif
  });
  protocol_.set_publish_discovery_fn([this](const uint8_t *mac, const BridgeEntitySchema &entity, uint8_t total_entities,
                                            bool is_commandable) {
#ifdef USE_MQTT
    if (mqtt_export_ != nullptr) {
      mqtt_export_->queue_discovery(mac, entity, total_entities, is_commandable, remote_display_name_(mac));
    }
#endif
  });
  protocol_.set_publish_availability_fn([this](const uint8_t *mac, bool online, const char *reason) {
#ifdef USE_SERIAL
    const uint32_t now_ms = millis();
    const BridgeSession *session = protocol_.get_session(mac);
    const int8_t rssi = session == nullptr ? -127 : session->last_rssi;
    const uint32_t offline_s =
        (session == nullptr || online) ? 0 : ((now_ms / 1000) - session->last_seen_bridge_uptime_s);
    const uint8_t *parent_mac = session == nullptr ? mac : session->parent_mac.data();
    const uint8_t hop_count = session == nullptr ? 0 : session->hops_to_bridge;
    serial_transport_->emit_remote_availability(mac, online, reason, rssi, offline_s, parent_mac, hop_count);
#else
    if (api_proto_ws_ != nullptr) {
      const uint32_t now_ms = millis();
      const BridgeSession *session = protocol_.get_session(mac);
      const int8_t rssi = session == nullptr ? -127 : session->last_rssi;
      const uint32_t offline_s =
          (session == nullptr || online) ? 0 : ((now_ms / 1000) - session->last_seen_bridge_uptime_s);
      const uint8_t *parent_mac = session == nullptr ? mac : session->parent_mac.data();
      const uint8_t hop_count = session == nullptr ? 0 : session->hops_to_bridge;
      api_proto_ws_->emit_remote_availability(mac, online, reason, rssi, offline_s, parent_mac, hop_count);
    }
#endif
#ifdef USE_MQTT
    if (mqtt_export_ != nullptr) {
      mqtt_export_->queue_availability(mac, online, reason);
    }
#endif
  });
  protocol_.set_publish_topology_changed_fn([this](const uint8_t *mac, const char *reason) {
#ifdef USE_SERIAL
    serial_transport_->emit_topology_changed(reason, mac);
#else
    if (this->api_proto_ws_ != nullptr) {
      this->api_proto_ws_->emit_topology_changed(reason, mac);
    }
#endif
  });
  protocol_.set_clear_entities_fn([this](const uint8_t *mac, const std::vector<BridgeEntitySchema> &old_entities) {
#ifdef USE_MQTT
    if (mqtt_export_ != nullptr) {
      mqtt_export_->queue_clear_entities(mac, old_entities);
    }
#endif
  });
  protocol_.set_schema_complete_fn([this](const uint8_t *mac, uint8_t total_entities) { this->schema_complete_(mac, total_entities); });
  protocol_.set_discovery_confirmed_fn([this](const uint8_t *mac, uint8_t entity_index, bool success) {
    this->on_discovery_confirmed_(mac, entity_index, success);
  });
  protocol_.set_send_fn([this](const uint8_t *mac, const uint8_t *frame, size_t frame_len) {
    return this->send_frame_(mac, frame, frame_len);
  });
  protocol_.set_send_err_fn([this](const uint8_t *mac, const uint8_t *frame, size_t frame_len) {
    return this->send_frame_result_(mac, frame, frame_len);
  });
  transport_ready_ = true;
  return true;
}

void ESPTreeBridge::setup() {
  if (!psk_.empty() && !network_id_.empty()) {
    protocol_ready_ = protocol_.init(psk_.c_str(), network_id_.c_str(), heartbeat_interval_) == 0;
  }
  if (!protocol_ready_) {
    this->mark_failed();
    return;
  }
  protocol_.set_bridge_identity(protocol_.bridge_identity().chip_model, App.get_build_time(), __DATE__, __TIME__,
                                project_name_(), project_version_(), {});
  if (!setup_transport_()) {
    this->mark_failed();
    return;
  }
#ifdef USE_SERIAL
  serial_transport_ = std::make_unique<bridge_api::BridgeApiSerialTransport>(this, uart_component_);
#else
  api_proto_ws_ = std::make_unique<bridge_api::BridgeApiProtoWsTransport>(this);
#endif
#ifdef USE_MQTT
  mqtt_export_ = new ESPTreeBridgeMQTT();
  mqtt_export_->set_mqtt_discovery_prefix(mqtt_discovery_prefix_);
  mqtt_export_->set_bridge_friendly_name(bridge_friendly_name_);
  {
    std::string rejoin_topic = "esp-tree/bridge/" + mac_key_string_(sta_mac_.data()) + "/force_rejoin/set";
    mqtt_export_->init(this, sta_mac_, rejoin_topic);
  }
#endif
  if (ota_over_espnow_) {
    ota_manager_ = std::make_unique<ESPNowOTAManager>();
    if (ota_manager_ == nullptr) {
      ESP_LOGE(TAG, "OTA over ESP-NOW requested but manager allocation failed");
      this->mark_failed();
      return;
    }
    protocol_.set_file_ack_fn([this](const uint8_t *leaf_mac, const espnow_ack_t &ack_header,
                                     const uint8_t *trailing, size_t trailing_len) -> bool {
      if (ota_manager_ == nullptr) return false;
      return ota_manager_->on_file_ack(leaf_mac, ack_header, trailing, trailing_len);
    });
    ota_manager_->set_send_frame_fn([this](const uint8_t *leaf_mac, espnow_packet_type_t type,
                                            const uint8_t *payload, size_t len,
                                            uint32_t *tx_counter_out) -> esp_err_t {
      return protocol_.send_ota_frame(leaf_mac, type, payload, len, tx_counter_out);
    });
    ota_manager_->set_target_reachable_fn([this](const uint8_t *leaf_mac) -> bool {
      const BridgeSession *session = protocol_.get_session(leaf_mac);
      return session != nullptr && session->online && session->session_key_valid;
    });
  }
  this->set_interval("airtime_status", AIRTIME_REPORT_INTERVAL_MS, [this]() { this->log_airtime_status_(); });
  this->set_interval("ram_stats", 30000, [this]() { this->log_ram_stats_(); });
}

void ESPTreeBridge::loop() {
  if (!transport_ready_) {
    ESP_LOGD(TAG, "bridge loop transport_ready=%d", transport_ready_ ? 1 : 0);
  }

#ifdef USE_SERIAL
  if (!espnow_allowed_) {
    espnow_allowed_ = true;
    ESP_LOGI(TAG, "ESP-NOW enabled (serial mode — no WiFi required)");
  }
#else
  const bool ready_for_espnow = (wifi::global_wifi_component != nullptr && wifi::global_wifi_component->is_connected());
  if (ready_for_espnow && !espnow_allowed_) {
    espnow_allowed_ = true;
    uint8_t wifi_ch;
    wifi_second_chan_t sec;
    esp_wifi_get_channel(&wifi_ch, &sec);
    ESP_LOGI(TAG, "ESP-NOW enabled: Wi-Fi connected (Wi-Fi ch %u)", wifi_ch);
  } else if (!ready_for_espnow && espnow_allowed_) {
    espnow_allowed_ = false;
    ESP_LOGW(TAG, "ESP-NOW disabled: waiting for Wi-Fi");
  }
#endif

  drain_received_frames_();
  protocol_.loop();
  expire_state_deliveries_();
  protocol_.flush_log_queue();
  if (ota_manager_ != nullptr) {
    ota_manager_->loop();
    emit_ota_events_();
    if (ota_manager_->is_busy() && ota_upload_session_pending_ && ota_upload_expected_size_ > 0 && !ota_upload_complete_ &&
        ota_upload_last_activity_ms_ != 0 &&
        (millis() - ota_upload_last_activity_ms_) > 30000U) {
      ESP_LOGW(TAG, "Aborting OTA upload after stalled HTTP upload stream");
      ota_manager_->on_source_abort(ESPNOW_FILE_ABORT_TIMEOUT);
      reset_ota_upload_state_(true);
    }
    if (!ota_manager_->is_busy() && !ota_upload_session_pending_ &&
        (ota_upload_expected_size_ != 0 || !ota_upload_buf_.empty() || ota_upload_received_ != 0)) {
      reset_ota_upload_state_(true);
    }
  }
#ifdef USE_MQTT
  if (mqtt_export_ != nullptr) {
    {
      const int ram_pct = []() {
        const size_t free_heap = esp_get_free_heap_size();
        const size_t total_heap = heap_caps_get_total_size(MALLOC_CAP_8BIT);
        return (total_heap > 0) ? static_cast<int>(100 - (100 * free_heap / total_heap)) : -1;
      }();
      int cpu_pct = -1;
#if CONFIG_ESP32_ESP_IDF_FRAMEWORK && configUSE_TRACE_FACILITY
      {
        TaskHandle_t idle_handle = xTaskGetIdleTaskHandle();
        TaskStatus_t task_status;
        vTaskGetInfo(idle_handle, &task_status, pdTRUE, eInvalid);
        uint64_t now_us = esp_timer_get_time();
        uint64_t elapsed_us = (cpu_last_publish_time_us_ > 0) ? (now_us - cpu_last_publish_time_us_) : 0;
        uint64_t idle_delta_us = (cpu_last_idle_runtime_ > 0 && task_status.ulRunTimeCounter >= cpu_last_idle_runtime_)
                                      ? (task_status.ulRunTimeCounter - cpu_last_idle_runtime_)
                                      : 0;
        if (elapsed_us == 0) idle_delta_us = 0;
        else if (idle_delta_us > elapsed_us) idle_delta_us = elapsed_us;
        cpu_pct = (elapsed_us > 0) ? static_cast<int>(100 * (elapsed_us - idle_delta_us) / elapsed_us) : 0;
        cpu_last_publish_time_us_ = now_us;
        cpu_last_idle_runtime_ = task_status.ulRunTimeCounter;
      }
#endif
      int8_t wifi_rssi = -127;
      wifi_ap_record_t ap_info{};
      if (esp_wifi_sta_get_ap_info(&ap_info) == ESP_OK) wifi_rssi = ap_info.rssi;
      mqtt_export_->set_bridge_diag(
          protocol_.bridge_uptime_s_,
          protocol_.get_active_remote_count(),
          wifi_rssi,
          current_wifi_channel_(),
          ram_pct,
          cpu_pct,
          protocol_.get_direct_remote_count()
      );
      mqtt_export_->tick();
    }
  }
#endif

#ifndef USE_SERIAL
  if (!web_handler_registered_ && web_server_base::global_web_server_base != nullptr) {
    register_web_handler_();
    web_handler_registered_ = true;
  }
#endif
#ifdef USE_SERIAL
  if (serial_transport_ != nullptr) {
    serial_transport_->loop();
  }
#else
  if (!api_proto_ws_handler_registered_ && api_proto_ws_ != nullptr && web_server_base::global_web_server_base != nullptr) {
    api_proto_ws_handler_registered_ = api_proto_ws_->register_with_web_server();
  }
  if (api_proto_ws_ != nullptr) {
    api_proto_ws_->loop();
  }
  // --- V2 Web UI registrations (parallel, independent paths) ---
  if (!v2_auth_handlers_registered_ && web_server_base::global_web_server_base != nullptr) {
    register_v2_auth_handlers_();
    v2_auth_handlers_registered_ = true;
  }
  if (!v2_web_handlers_registered_ && web_server_base::global_web_server_base != nullptr) {
    register_v2_web_handlers_();
    v2_web_handlers_registered_ = true;
  }
#endif
}

void ESPTreeBridge::dump_config() {
#ifdef USE_SERIAL
  ESP_LOGI(TAG, "  Transport: Serial (UART)");
#endif
}

#if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(5, 0, 0)
void ESPTreeBridge::on_data_received_(const esp_now_recv_info_t *info, const uint8_t *data, int len) {
  if (active_instance_ == nullptr || info == nullptr || info->src_addr == nullptr) return;
  int8_t rssi = (info->rx_ctrl != nullptr) ? info->rx_ctrl->rssi : 0;
  active_instance_->handle_received_frame_(info->src_addr, data, static_cast<size_t>(len), rssi);
}
void ESPTreeBridge::on_data_sent_(const esp_now_send_info_t *, esp_now_send_status_t status) {
  if (active_instance_ == nullptr) return;
  active_instance_->handle_send_status_(nullptr, status == ESP_NOW_SEND_SUCCESS);
}
#else
void ESPTreeBridge::on_data_received_(const uint8_t *mac, const uint8_t *data, int len) {
  if (active_instance_ == nullptr) return;
  ESP_LOGI(TAG, "[RX ALL] mac=%s len=%u first=0x%02X", mac_key_string_(mac).c_str(), static_cast<unsigned>(len), data[0]);
  active_instance_->handle_received_frame_(mac, data, static_cast<size_t>(len), 0);
}
void ESPTreeBridge::on_data_sent_(const uint8_t *, esp_now_send_status_t status) {
  if (active_instance_ == nullptr) return;
  active_instance_->handle_send_status_(nullptr, status == ESP_NOW_SEND_SUCCESS);
}
#endif

// --- V2 Web UI additions ---

static constexpr uint32_t V2_SESSION_TIMEOUT_MS = 86400000; // 24h
static constexpr size_t V2_TOKEN_HEX_BYTES = 16;             // 32 hex chars

static std::string v2_generate_token_() {
  uint8_t bytes[V2_TOKEN_HEX_BYTES];
  fill_random_bytes(bytes, sizeof(bytes));
  std::string hex;
  hex.reserve(V2_TOKEN_HEX_BYTES * 2);
  static const char *kHex = "0123456789abcdef";
  for (size_t i = 0; i < V2_TOKEN_HEX_BYTES; ++i) {
    hex += kHex[(bytes[i] >> 4) & 0x0F];
    hex += kHex[bytes[i] & 0x0F];
  }
  return hex;
}

void ESPTreeBridge::register_v2_auth_handlers_() {
  if (web_server_base::global_web_server_base == nullptr) return;

  struct LoginPageHandler : public AsyncWebHandler {
    bool canHandle(AsyncWebServerRequest *request) const override {
      char url_buf[AsyncWebServerRequest::URL_BUF_SIZE]{};
      return request->method() == HTTP_GET && request->url_to(url_buf) == std::string("/login");
    }
    void handleRequest(AsyncWebServerRequest *request) override {
      request->send(200, "text/html; charset=utf-8", LOGIN_PAGE_HTML);
    }
    void handleUpload(AsyncWebServerRequest *, const std::string &, size_t, uint8_t *, size_t, bool) override {}
    void handleBody(AsyncWebServerRequest *, uint8_t *, size_t, size_t, size_t) override {}
    bool isRequestHandlerTrivial() const override { return false; }
  };

  struct LoginHandler : public AsyncWebHandler {
    ESPTreeBridge *bridge_;
    LoginHandler(ESPTreeBridge *bridge) : bridge_(bridge) {}

    bool canHandle(AsyncWebServerRequest *request) const override {
      char url_buf[AsyncWebServerRequest::URL_BUF_SIZE]{};
      return request->method() == HTTP_POST && request->url_to(url_buf) == std::string("/api/auth/login");
    }

    void handleRequest(AsyncWebServerRequest *request) override {
      std::string key;
      if (request->hasArg("api_key")) {
        key = request->arg("api_key").c_str();
      }
      if (key.empty()) {
        request->send(400, "application/json", "{\"error\":\"empty api_key\"}");
        return;
      }

      const std::string &configured = bridge_->api_key();
      bool match = configured.size() == key.size();
      uint8_t diff = 0;
      for (size_t i = 0; i < configured.size() && i < key.size(); ++i) {
        diff |= static_cast<uint8_t>(configured[i] ^ key[i]);
      }
      if (!match || diff != 0) {
        request->send(401, "application/json", "{\"error\":\"invalid api_key\"}");
        return;
      }

      std::string token = v2_generate_token_();
      bridge_->v2_session_token_ = token;
      bridge_->v2_session_created_ms_ = millis();

      httpd_req_t *req = *request;
      std::string cookie = "espnow_session=" + token + "; Path=/; Max-Age=86400; SameSite=Lax";
      httpd_resp_set_hdr(req, "Set-Cookie", cookie.c_str());

      request->send(200, "application/json",
                    ("{\"status\":\"ok\",\"api_key\":\"" + key + "\"}").c_str());
    }

    void handleUpload(AsyncWebServerRequest *, const std::string &, size_t, uint8_t *, size_t, bool) override {}
    void handleBody(AsyncWebServerRequest *, uint8_t *, size_t, size_t, size_t) override {}
    bool isRequestHandlerTrivial() const override { return false; }
  };

  struct LogoutHandler : public AsyncWebHandler {
    ESPTreeBridge *bridge_;
    LogoutHandler(ESPTreeBridge *bridge) : bridge_(bridge) {}

    bool canHandle(AsyncWebServerRequest *request) const override {
      char url_buf[AsyncWebServerRequest::URL_BUF_SIZE]{};
      return request->method() == HTTP_POST && request->url_to(url_buf) == std::string("/api/auth/logout");
    }

    void handleRequest(AsyncWebServerRequest *request) override {
      bridge_->v2_session_token_.clear();
      bridge_->v2_session_created_ms_ = 0;
      request->send(200, "application/json", "{\"status\":\"logged_out\"}");
    }

    void handleUpload(AsyncWebServerRequest *, const std::string &, size_t, uint8_t *, size_t, bool) override {}
    void handleBody(AsyncWebServerRequest *, uint8_t *, size_t, size_t, size_t) override {}
    bool isRequestHandlerTrivial() const override { return false; }
  };

  web_server_base::global_web_server_base->add_handler(new LoginPageHandler());
  web_server_base::global_web_server_base->add_handler(new LoginHandler(this));
  web_server_base::global_web_server_base->add_handler(new LogoutHandler(this));

  struct TopologyHttpHandler : public AsyncWebHandler {
    ESPTreeBridge *bridge_;
    explicit TopologyHttpHandler(ESPTreeBridge *b) : bridge_(b) {}
    bool canHandle(AsyncWebServerRequest *request) const override {
      char url_buf[AsyncWebServerRequest::URL_BUF_SIZE]{};
      return request->method() == HTTP_GET && request->url_to(url_buf) == std::string("/api/v1/topology");
    }
    void handleRequest(AsyncWebServerRequest *request) override {
      if (!bridge_->v2_http_authenticate_(request)) {
        request->send(401, "application/json", "{\"error\":\"unauthorized\"}");
        return;
      }
      std::string json = bridge_->api_topology_snapshot_json("{}");
      request->send(200, "application/json", json.c_str());
    }
    void handleUpload(AsyncWebServerRequest *, const std::string &, size_t, uint8_t *, size_t, bool) override {}
    void handleBody(AsyncWebServerRequest *, uint8_t *, size_t, size_t, size_t) override {}
    bool isRequestHandlerTrivial() const override { return false; }
  };

  struct BridgeInfoHttpHandler : public AsyncWebHandler {
    ESPTreeBridge *bridge_;
    explicit BridgeInfoHttpHandler(ESPTreeBridge *b) : bridge_(b) {}
    bool canHandle(AsyncWebServerRequest *request) const override {
      char url_buf[AsyncWebServerRequest::URL_BUF_SIZE]{};
      return request->method() == HTTP_GET && request->url_to(url_buf) == std::string("/api/v1/bridge/info");
    }
    void handleRequest(AsyncWebServerRequest *request) override {
      if (!bridge_->v2_http_authenticate_(request)) {
        request->send(401, "application/json", "{\"error\":\"unauthorized\"}");
        return;
      }
      std::string json = bridge_->api_bridge_info_json();
      request->send(200, "application/json", json.c_str());
    }
    void handleUpload(AsyncWebServerRequest *, const std::string &, size_t, uint8_t *, size_t, bool) override {}
    void handleBody(AsyncWebServerRequest *, uint8_t *, size_t, size_t, size_t) override {}
    bool isRequestHandlerTrivial() const override { return false; }
  };

  struct NodeStateHttpHandler : public AsyncWebHandler {
    ESPTreeBridge *bridge_;
    explicit NodeStateHttpHandler(ESPTreeBridge *b) : bridge_(b) {}
    bool canHandle(AsyncWebServerRequest *request) const override {
      char url_buf[AsyncWebServerRequest::URL_BUF_SIZE]{};
      if (request->method() != HTTP_GET) return false;
      request->url_to(url_buf);
      return strncmp(url_buf, "/api/v1/node/", 15) == 0;
    }
    void handleRequest(AsyncWebServerRequest *request) override {
      if (!bridge_->v2_http_authenticate_(request)) {
        request->send(401, "application/json", "{\"error\":\"unauthorized\"}");
        return;
      }
      char url_buf[AsyncWebServerRequest::URL_BUF_SIZE]{};
      request->url_to(url_buf);
      const char *url = url_buf;
      const char *prefix = "/api/v1/node/";
      const char *suffix = "/state";
      const size_t prefix_len = 15;
      const size_t suffix_len = 7;
      size_t url_len = strlen(url);
      if (url_len <= prefix_len + suffix_len) {
        request->send(400, "application/json", "{\"error\":\"invalid path\"}");
        return;
      }
      std::string mac_with_slash(url + prefix_len, url_len - prefix_len - suffix_len);
      std::string mac_colon;
      for (char c : mac_with_slash) {
        if (c != '-' && c != ' ') mac_colon += c;
      }
      std::transform(mac_colon.begin(), mac_colon.end(), mac_colon.begin(), ::toupper);
      std::string json = bridge_->api_node_state_json(mac_colon);
      if (json.empty()) {
        request->send(404, "application/json", "{\"error\":\"node not found\"}");
        return;
      }
      request->send(200, "application/json", json.c_str());
    }
    void handleUpload(AsyncWebServerRequest *, const std::string &, size_t, uint8_t *, size_t, bool) override {}
    void handleBody(AsyncWebServerRequest *, uint8_t *, size_t, size_t, size_t) override {}
    bool isRequestHandlerTrivial() const override { return false; }
  };

  web_server_base::global_web_server_base->add_handler(new TopologyHttpHandler(this));
  web_server_base::global_web_server_base->add_handler(new BridgeInfoHttpHandler(this));
  web_server_base::global_web_server_base->add_handler(new NodeStateHttpHandler(this));
}

bool ESPTreeBridge::v2_http_authenticate_(void *req) {
  if (api_key_.empty()) {
    return true;
  }
  auto *request = static_cast<AsyncWebServerRequest *>(req);
  if (request->hasArg("api_key")) {
    const std::string &configured = api_key_;
    std::string key = request->arg("api_key").c_str();
    if (key.size() != configured.size()) return false;
    uint8_t diff = 0;
    for (size_t i = 0; i < configured.size(); ++i) {
      diff |= static_cast<uint8_t>(configured[i] ^ key[i]);
    }
    return diff == 0;
  }
  return v2_verify_session_(request);
}

bool ESPTreeBridge::v2_verify_session_(void *req) {
  if (api_key_.empty()) {
    return true;
  }

  auto *request = static_cast<AsyncWebServerRequest *>(req);
  auto cookie_hdr = request->get_header("Cookie");
  if (!cookie_hdr.has_value()) {
    return false;
  }

  std::string cookie_str = cookie_hdr.value().c_str();
  auto start = cookie_str.find("espnow_session=");
  if (start == std::string::npos) {
    return false;
  }
  start += 15;
  auto end = cookie_str.find(';', start);
  if (end == std::string::npos) {
    end = cookie_str.size();
  }
  std::string token = cookie_str.substr(start, end - start);

  if (token.empty() || token != v2_session_token_) {
    return false;
  }
  if (millis() - v2_session_created_ms_ > V2_SESSION_TIMEOUT_MS) {
    v2_session_token_.clear();
    v2_session_created_ms_ = 0;
    return false;
  }
  return true;
}

void ESPTreeBridge::register_v2_web_handlers_() {
  if (web_server_base::global_web_server_base == nullptr) return;

  struct V2TopologyPageHandler : public AsyncWebHandler {
    ESPTreeBridge *bridge_;
    V2TopologyPageHandler(ESPTreeBridge *bridge) : bridge_(bridge) {}

    bool canHandle(AsyncWebServerRequest *request) const override {
      char url_buf[AsyncWebServerRequest::URL_BUF_SIZE]{};
      return request->method() == HTTP_GET && request->url_to(url_buf) == std::string("/v2/topology");
    }

    void handleRequest(AsyncWebServerRequest *request) override {
      if (!bridge_->v2_verify_session_(request)) {
        request->redirect("/login?redirect=/v2/topology");
        return;
      }
      request->send(200, "text/html; charset=utf-8", TOPOLOGY_V2_PAGE_HTML);
    }

    void handleUpload(AsyncWebServerRequest *, const std::string &, size_t, uint8_t *, size_t, bool) override {}
    void handleBody(AsyncWebServerRequest *, uint8_t *, size_t, size_t, size_t) override {}
    bool isRequestHandlerTrivial() const override { return false; }
  };

   web_server_base::global_web_server_base->add_handler(new V2TopologyPageHandler(this));
}
#endif  // !USE_SERIAL

// --- Public methods for ESPTreeBridgeMQTT ---
#ifdef USE_MQTT
void ESPTreeBridge::send_command(const uint8_t *mac, uint8_t entity_index, const std::vector<uint8_t> &value) {
  protocol_.send_command_to_leaf(mac, entity_index, value);
}

void ESPTreeBridge::send_force_rejoin(const uint8_t *mac) {
  // Force rejoin - mark session for rediscovery
  BridgeSession *session = protocol_.get_session(mac);
  if (session != nullptr) {
    session->state_sync_pending = true;
  }
}

void ESPTreeBridge::protocol_discovery_confirmed(const uint8_t *mac, uint8_t entity_index, bool success) {
  protocol_.on_discovery_confirmed_(mac, entity_index, success);
}

void ESPTreeBridge::mark_mqtt_state_delivered(const uint8_t *mac, uint8_t entity_index, uint32_t message_tx_base) {
  mark_state_sink_delivered_(mac, entity_index, message_tx_base, STATE_DELIVERY_SINK_MQTT);
}
#endif

std::string ESPTreeBridge::state_delivery_key_(const uint8_t *mac, uint8_t entity_index, uint32_t message_tx_base) const {
  return mac_key_string_(mac) + "_" + std::to_string(entity_index) + "_" + std::to_string(message_tx_base);
}

uint8_t ESPTreeBridge::active_state_delivery_sinks_() const {
  uint8_t sinks = 0;
#ifdef USE_SERIAL
  if (serial_transport_ != nullptr && serial_transport_->has_authenticated_client()) {
    sinks |= STATE_DELIVERY_SINK_PROTOBUF;
  }
#else
  if (api_proto_ws_ != nullptr && api_proto_ws_->has_authenticated_client()) {
    sinks |= STATE_DELIVERY_SINK_PROTOBUF;
  }
#endif
#ifdef USE_MQTT
  if (mqtt_export_ != nullptr && mqtt_export_->is_connected()) {
    sinks |= STATE_DELIVERY_SINK_MQTT;
  }
#endif
  return sinks;
}

void ESPTreeBridge::begin_state_delivery_(const uint8_t *mac, uint8_t entity_index, uint32_t message_tx_base,
                                          const uint8_t *next_hop_mac, uint8_t required_sinks) {
  if (mac == nullptr || next_hop_mac == nullptr) return;
  if (required_sinks == 0) {
    protocol_.confirm_state_delivery_(mac, entity_index, message_tx_base, next_hop_mac);
    return;
  }
  PendingStateDelivery delivery;
  memcpy(delivery.leaf_mac.data(), mac, 6);
  memcpy(delivery.next_hop_mac.data(), next_hop_mac, 6);
  delivery.entity_index = entity_index;
  delivery.message_tx_base = message_tx_base;
  delivery.required_sinks = required_sinks;
  delivery.created_ms = millis();
  pending_state_deliveries_[state_delivery_key_(mac, entity_index, message_tx_base)] = delivery;
}

void ESPTreeBridge::mark_state_sink_delivered_(const uint8_t *mac, uint8_t entity_index, uint32_t message_tx_base,
                                               uint8_t sink) {
  const std::string key = state_delivery_key_(mac, entity_index, message_tx_base);
  auto it = pending_state_deliveries_.find(key);
  if (it == pending_state_deliveries_.end()) return;
  auto &delivery = it->second;
  delivery.delivered_sinks |= sink;
  if ((delivery.delivered_sinks & delivery.required_sinks) != delivery.required_sinks) return;
  protocol_.confirm_state_delivery_(delivery.leaf_mac.data(), delivery.entity_index, delivery.message_tx_base,
                                    delivery.next_hop_mac.data());
  pending_state_deliveries_.erase(it);
}

void ESPTreeBridge::expire_state_deliveries_() {
  const uint32_t now = millis();
  for (auto it = pending_state_deliveries_.begin(); it != pending_state_deliveries_.end();) {
    const auto &delivery = it->second;
    if (now - delivery.created_ms < STATE_DELIVERY_TIMEOUT_MS) {
      ++it;
      continue;
    }
    ESP_LOGW(TAG, "State delivery timeout mac=%s entity=%u tx=%u required=0x%02x delivered=0x%02x",
             mac_key_string_(delivery.leaf_mac.data()).c_str(), delivery.entity_index,
             delivery.message_tx_base, delivery.required_sinks, delivery.delivered_sinks);
    it = pending_state_deliveries_.erase(it);
  }
}

void ESPTreeBridge::api_runtime_handle_state_receipt(const std::string &remote_mac, const std::string &session_id,
                                                     uint32_t state_tx_counter, uint8_t entity_index) {
  std::string clean;
  for (char c : remote_mac) {
    if (c != ':' && c != '-' && c != ' ') clean += c;
  }
  uint8_t mac[6]{};
  if (!parse_mac_hex_(clean, mac)) return;
  const BridgeSession *session = protocol_.get_session(mac);
  if (session == nullptr) return;
  if (!session_id.empty() && session_id != runtime_session_id_(*session, network_id_)) return;
  mark_state_sink_delivered_(mac, entity_index, state_tx_counter, STATE_DELIVERY_SINK_PROTOBUF);
}

std::vector<std::array<uint8_t, 6>> ESPTreeBridge::get_online_macs() const {
  std::vector<std::array<uint8_t, 6>> result;
  for (const auto &entry : protocol_.get_sessions()) {
    const auto &session = entry.second;
    if (session.online.load()) {
      result.push_back(session.leaf_mac);
    }
  }
  return result;
}

const BridgeSession *ESPTreeBridge::get_session(const uint8_t *mac) const {
  return protocol_.get_session(mac);
}

bool ESPTreeBridge::get_remote_mac_by_node_key(const std::string &node_key, uint8_t *mac_out) const {
  for (const auto &entry : protocol_.get_sessions()) {
    const auto &session = entry.second;
    const std::string key = slugify_name_(session.esphome_name);
    if (key == node_key) {
      memcpy(mac_out, session.leaf_mac.data(), 6);
      return true;
    }
    if (mac_key_string_(session.leaf_mac.data()) == node_key) {
      memcpy(mac_out, session.leaf_mac.data(), 6);
      return true;
    }
  }
  return false;
}

// --- Bridge entity value cache (non-MQTT path) ---
std::string ESPTreeBridge::entity_value_key_(const uint8_t *mac, const BridgeEntitySchema &entity) const {
  return mac_key_string_(mac) + "_" + std::to_string(entity.entity_index);
}

bool ESPTreeBridge::decode_command_payload_(const BridgeEntitySchema &entity, CommandRouteKind route_kind,
                                             const std::string &payload, std::vector<uint8_t> &value,
                                             const std::vector<uint8_t> &current_value) const {
  value.clear();
  switch (static_cast<espnow_field_type_t>(entity.entity_type)) {
    case FIELD_TYPE_SWITCH:
      value = {static_cast<uint8_t>(parse_on(payload) ? 1 : 0)};
      return true;
    case FIELD_TYPE_NUMBER: {
      char *end = nullptr;
      const float parsed = strtof(payload.c_str(), &end);
      if (end == payload.c_str()) return false;
      value.resize(250);
      encode_float(parsed, value.data(), sizeof(parsed));
      return true;
    }
    case FIELD_TYPE_TEXT:
      value.assign(payload.begin(), payload.end());
      return true;
    case FIELD_TYPE_COVER:
    case FIELD_TYPE_VALVE:
      value.resize(2);
      if (payload == "OPEN") { value[0] = 1; value[1] = 100; }
      else if (payload == "CLOSE") { value[0] = 2; value[1] = 0; }
      else if (payload == "STOP") { value[0] = 3; value[1] = 0; }
      else { value[0] = 0; value[1] = static_cast<uint8_t>(std::max(0, std::min(100, atoi(payload.c_str())))); }
      return true;
    case FIELD_TYPE_LOCK:
      value = {static_cast<uint8_t>((payload == "LOCK" || payload == "LOCKED") ? 1 : 0)};
      return true;
    case FIELD_TYPE_SELECT:
      value.resize(1);
      if (!entity.entity_options.empty()) {
        auto options = option_list(parse_options_map(entity.entity_options), "options");
        if (options.empty()) options = split_string(entity.entity_options, '|');
        for (size_t i = 0; i < options.size(); i++) {
          if (options[i] == payload) { value[0] = static_cast<uint8_t>(i); return true; }
        }
      }
      value[0] = static_cast<uint8_t>(atoi(payload.c_str()));
      return true;
    case FIELD_TYPE_ALARM:
      if (!payload.empty() && payload[0] == '{') {
        return json::parse_json(payload, [&value](JsonObject root) -> bool {
          const char *state = root["state"];
          if (state == nullptr) return false;
          std::string command = state;
          std::string code;
          if (root["code"].is<const char *>()) code = root["code"].as<std::string>();
          value.resize(1 + code.size());
          if (command == "ARM_HOME") value[0] = 1;
          else if (command == "ARM_AWAY") value[0] = 2;
          else if (command == "ARM_NIGHT") value[0] = 3;
          else if (command == "ARM_VACATION") value[0] = 4;
          else if (command == "ARM_CUSTOM_BYPASS") value[0] = 5;
          else if (command == "TRIGGERED") value[0] = 6;
          else if (command == "PENDING") value[0] = 7;
          else value[0] = 0;
          if (!code.empty()) memcpy(value.data() + 1, code.data(), code.size());
          return true;
        });
      }
      value.resize(1);
      if (payload == "ARM_HOME") value[0] = 1;
      else if (payload == "ARM_AWAY") value[0] = 2;
      else if (payload == "ARM_NIGHT") value[0] = 3;
      else if (payload == "ARM_VACATION") value[0] = 4;
      else if (payload == "ARM_CUSTOM_BYPASS") value[0] = 5;
      else if (payload == "TRIGGERED") value[0] = 6;
      else if (payload == "PENDING") value[0] = 7;
      else value[0] = 0;
      return true;
    case FIELD_TYPE_FAN: {
      const auto options = parse_options_map(entity.entity_options);
      const uint32_t speed_count = option_u32(options, "speed_count", 0);
      if (!payload.empty() && payload[0] == '{') {
        value.assign(4, 0);
        if (current_value.size() >= 4) memcpy(value.data(), current_value.data(), 4);
        return json::parse_json(payload, [&value, speed_count](JsonObject root) -> bool {
          bool ok = false;
          if (root["state"].is<const char *>()) { value[0] = parse_on(root["state"].as<std::string>()) ? 1 : 0; ok = true; }
          if (root["speed_level"].is<int>()) { value[1] = static_cast<uint8_t>(root["speed_level"].as<int>()); ok = true; }
          if (root["oscillating"].is<bool>()) { value[2] = root["oscillating"].as<bool>() ? 1 : 0; ok = true; }
          if (root["direction"].is<const char *>()) { value[3] = (root["direction"].as<std::string>() == "reverse" || root["direction"].as<std::string>() == "REVERSE") ? 1 : 0; ok = true; }
          if (root["percentage"].is<int>()) { if (speed_count > 0) { value[1] = static_cast<uint8_t>((root["percentage"].as<int>() * speed_count + 50) / 100); ok = true; } }
          return ok;
        });
      }
      switch (route_kind) {
        case CommandRouteKind::PRIMARY: {
          value.resize(4);
          if (current_value.size() >= 4) {
            value[0] = parse_on(payload) ? 1 : 0; value[1] = current_value[1]; value[2] = current_value[2]; value[3] = current_value[3];
          } else { value.assign(4, 0); value[0] = parse_on(payload) ? 1 : 0; }
          return true;
        }
        case CommandRouteKind::FAN_SPEED: {
          char *end = nullptr;
          const long parsed = strtol(payload.c_str(), &end, 10);
          if (end == payload.c_str()) return false;
          int pct = std::max(0, std::min(100, static_cast<int>(parsed)));
          int level = speed_count > 0 ? (pct * static_cast<int>(speed_count) + 50) / 100 : 0;
          level = std::max(0, std::min(static_cast<int>(speed_count), level));
          value.resize(4);
          if (current_value.size() >= 4) { value[0] = current_value[0]; value[1] = static_cast<uint8_t>(level); value[2] = current_value[2]; value[3] = current_value[3]; }
          else { value.assign(4, 0); value[0] = (level > 0) ? 1 : 0; value[1] = static_cast<uint8_t>(level); }
          return true;
        }
        case CommandRouteKind::FAN_OSCILLATION: {
          bool osc_on = (payload == "oscillate_on" || payload == "ON" || payload == "on" || payload == "1");
          value.resize(4);
          if (current_value.size() >= 4) { value[0] = current_value[0]; value[1] = current_value[1]; value[2] = osc_on ? 1 : 0; value[3] = current_value[3]; }
          else { value.assign(4, 0); value[2] = osc_on ? 1 : 0; }
          return true;
        }
        case CommandRouteKind::FAN_DIRECTION: {
          bool reverse = (payload == "reverse" || payload == "REVERSE");
          value.resize(4);
          if (current_value.size() >= 4) { value[0] = current_value[0]; value[1] = current_value[1]; value[2] = current_value[2]; value[3] = reverse ? 1 : 0; }
          else { value.assign(4, 0); value[3] = reverse ? 1 : 0; }
          return true;
        }
      }
      return true;
    }
    case FIELD_TYPE_LIGHT:
      if (!payload.empty() && payload[0] == '{') {
        value.assign(9, 0);
        bool ok = false, has_state = false, has_non_state_update = false;
        const auto parsed_options = parse_options_map(entity.entity_options);
        const auto effects = option_list(parsed_options, "effects");
        return json::parse_json(payload, [&value, &ok, &effects, &has_state, &has_non_state_update](JsonObject root) -> bool {
          if (root["state"].is<const char *>()) { value[0] = parse_on(root["state"].as<std::string>()) ? 1 : 0; has_state = true; ok = true; }
          if (root["brightness"].is<int>()) { value[1] = static_cast<uint8_t>(std::max(0, std::min(255, root["brightness"].as<int>()))); has_non_state_update = true; ok = true; }
          if (root["effect"].is<const char *>()) {
            const std::string effect = root["effect"].as<std::string>();
            for (size_t i = 0; i < effects.size(); i++) { if (effects[i] == effect) { value[4] = static_cast<uint8_t>(i); ok = true; break; } }
            if (effect == "None") { value[4] = 0; ok = true; }
            has_non_state_update = true;
          }
          if (root["color"].is<JsonObject>()) {
            JsonObject color = root["color"].as<JsonObject>();
            const float r = static_cast<float>(color["r"] | 0) / 255.0f, g = static_cast<float>(color["g"] | 0) / 255.0f, b = static_cast<float>(color["b"] | 0) / 255.0f;
            const float max_v = std::max({r, g, b}), min_v = std::min({r, g, b}), delta = max_v - min_v;
            float hue = 0.0f;
            if (delta > 0.0001f) {
              if (max_v == r) hue = 60.0f * std::fmod(((g - b) / delta), 6.0f);
              else if (max_v == g) hue = 60.0f * (((b - r) / delta) + 2.0f);
              else hue = 60.0f * (((r - g) / delta) + 4.0f);
            }
            if (hue < 0.0f) hue += 360.0f;
            const float sat = max_v <= 0.0001f ? 0.0f : delta / max_v;
            value[2] = static_cast<uint8_t>(std::lround((hue / 360.0f) * 255.0f));
            value[3] = static_cast<uint8_t>(std::lround(sat * 255.0f));
            if (value[1] == 0) value[1] = static_cast<uint8_t>(std::lround(max_v * 255.0f));
            has_non_state_update = true; ok = true;
          }
          if (root["color_temp"].is<float>()) {
            const uint16_t ct = static_cast<uint16_t>(std::max(0.0f, std::min(65535.0f, root["color_temp"].as<float>())));
            value[6] = ct & 0xFF; value[7] = (ct >> 8) & 0xFF;
            has_non_state_update = true; ok = true;
          }
          if (root["white"].is<int>()) { value[8] = static_cast<uint8_t>(std::max(0, std::min(255, root["white"].as<int>()))); has_non_state_update = true; ok = true; }
          if (!has_state && has_non_state_update) value[0] = 1;
          return ok;
        });
      }
      value.resize(9);
      value[0] = parse_on(payload) ? 1 : 0;
      value[1] = value[0] ? 255 : 0;
      return true;
    case FIELD_TYPE_BUTTON:
      value = {1};
      return true;
    default:
      return false;
  }
}

}  // namespace esp_tree
}  // namespace esphome
