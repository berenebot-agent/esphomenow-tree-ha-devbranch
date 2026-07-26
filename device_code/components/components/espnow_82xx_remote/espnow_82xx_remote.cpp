#include "espnow_82xx_remote.h"

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
#include <ctime>

namespace esphome {
namespace esp_tree {

static const char *const TAG = "espnow";
ESPNow82xxRemote *ESPNow82xxRemote::active_instance_ = nullptr;

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

static uint32_t calc_airtime_us_(size_t frame_bytes) {
  return 192 + 8 * static_cast<uint32_t>(frame_bytes);
}

static std::string fmt_mac(const uint8_t *mac) {
  if (mac == nullptr) return "??:??:??:??:??:??";
  char buf[18];
  snprintf(buf, sizeof(buf), "%02X:%02X:%02X:%02X:%02X:%02X",
           mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
  return std::string(buf);
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

}  // anonymous namespace

ESPNow82xxRemote::ESPNow82xxRemote() = default;

// ── WiFi + ESP-NOW init ──────────────────────────────────────────────────

void ESPNow82xxRemote::register_instance_(ESPNow82xxRemote *instance) {
  active_instance_ = instance;
}

#ifdef USE_ESP8266
extern "C" void *g_ic;

static void patch_esp8266_ic_bss_() {
  auto *base = reinterpret_cast<uint8_t *>(&g_ic);
  void **ic_bss = reinterpret_cast<void **>(base + 0x90);
  if (*ic_bss != nullptr) return;

  static const uint16_t candidate_offsets[] = {0xF4, 0x194, 0x1A0, 0x1AC, 0x1B4};
  void *ap_bss = nullptr;
  for (uint8_t i = 0; i < sizeof(candidate_offsets) / sizeof(candidate_offsets[0]); i++) {
    void *candidate = *reinterpret_cast<void **>(base + candidate_offsets[i]);
    if (candidate == nullptr) continue;
    auto addr = reinterpret_cast<uint32_t>(candidate);
    if ((addr >= 0x3FFE0000 && addr < 0x40000000) || (addr >= 0x40100000 && addr < 0x40200000)) {
      ap_bss = candidate;
      ESP_LOGI("espnow", "g_ic+%03X: AP BSS node at %p", candidate_offsets[i], candidate);
      break;
    }
  }

  if (ap_bss != nullptr) {
    *ic_bss = ap_bss;
    uint8_t ap_mac[6];
    WiFi.softAPmacAddress(ap_mac);
    ESP_LOGI("espnow", "Patched ic_bss -> AP BSS node (AP MAC=%02X:%02X:%02X:%02X:%02X:%02X)",
             ap_mac[0], ap_mac[1], ap_mac[2], ap_mac[3], ap_mac[4], ap_mac[5]);
  } else {
    ESP_LOGW("espnow", "Could not find AP BSS node in g_ic — unicast ESP-NOW may fail");
    for (uint8_t i = 0; i < sizeof(candidate_offsets) / sizeof(candidate_offsets[0]); i++) {
      void *val = *reinterpret_cast<void **>(base + candidate_offsets[i]);
      ESP_LOGI("espnow", "g_ic+%03X: %p", candidate_offsets[i], val);
    }
  }
}
#endif

bool ESPNow82xxRemote::init_wifi_and_espnow_() {
  // On ESP8266, unicast ESP-NOW requires WIFI_AP_STA mode. Pure WIFI_AP or
  // WIFI_STA both cause unicast TX CB status=FAIL. ESPHome's wifi: ap: config
  // typically starts WIFI_AP mode; we upgrade to WIFI_AP_STA by setting the mode.
  // We do NOT call WiFi.softAP() — ESPHome already runs the AP on the configured
  // channel. Just toggling WIFI_AP_STA preserves the existing AP.
  WiFi.setSleepMode(WIFI_NONE_SLEEP);
  const auto mode = WiFi.getMode();
  const auto cur_ch = wifi_get_channel();
  ESP_LOGI(TAG, "WiFi before init: mode=%u ch=%u AP=%u STA=%u", mode, cur_ch, !!(mode & WIFI_AP), !!(mode & WIFI_STA));
  if (mode != WIFI_AP_STA) {
    WiFi.mode(WIFI_AP_STA);
    ESP_LOGI(TAG, "Switched WiFi to AP_STA mode for unicast ESP-NOW (was mode=%u)", mode);
  }
#ifdef USE_ESP8266
  patch_esp8266_ic_bss_();
#endif
  if (esp_now_init() != 0) {
    ESP_LOGE(TAG, "esp_now_init() failed");
    return false;
  }
  esp_now_set_self_role(ESP_NOW_ROLE_COMBO);
  static const uint8_t broadcast_mac[6] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
  if (esp_now_add_peer(const_cast<uint8_t*>(broadcast_mac), ESP_NOW_ROLE_COMBO, 0, nullptr, 0) != 0) {
    ESP_LOGE(TAG, "Failed to add broadcast ESP-NOW peer");
    return false;
  }
  note_peer_activity_(broadcast_mac);
  protected_peers_.insert(fmt_mac(broadcast_mac));
  esp_now_register_recv_cb(on_data_received_);
  esp_now_register_send_cb(on_data_sent_);
  return true;
}

void ESPNow82xxRemote::clear_all_peers_() {
  ESP_LOGW(TAG, "Clearing all ESP-NOW peers from table...");
  for (const auto &entry : peer_last_used_ms_) {
    uint8_t mac[6] = {};
    if (sscanf(entry.first.c_str(), "%2hhx:%2hhx:%2hhx:%2hhx:%2hhx:%2hhx",
               &mac[0], &mac[1], &mac[2], &mac[3], &mac[4], &mac[5]) != 6) continue;
    esp_now_del_peer(mac);
  }
  peer_last_used_ms_.clear();
  protected_peers_.clear();
  ESP_LOGW(TAG, "All peers cleared");
}

// ── Peer management ──────────────────────────────────────────────────────

bool ESPNow82xxRemote::add_peer_(const uint8_t *mac) {
  if (mac == nullptr) return false;
  uint8_t mac_copy[6];
  memcpy(mac_copy, mac, 6);
  uint8_t ch;
#if defined(ARDUINO_ARCH_ESP8266)
  ch = espnow_channel_;
  if (ch == 0) ch = 11;  // Default to ch11 if not set
#else
  ch = espnow_channel_;
  if (ch == 0) {
    wifi_second_chan_t sec = WIFI_SECOND_CHAN_NONE;
    esp_wifi_get_channel(&ch, &sec);
  }
#endif
  const bool existed = esp_now_is_peer_exist(mac_copy);
  if (existed) {
    esp_now_del_peer(mac_copy);
  }
  const auto peer_role = ESP_NOW_ROLE_COMBO;
  ESP_LOGI(TAG, "Adding peer %s channel=%u role=%u (existed=%d)", fmt_mac(mac).c_str(), ch,
           static_cast<unsigned>(peer_role), existed);
  int add_err = esp_now_add_peer(mac_copy, peer_role, ch, nullptr, 0);
  if (add_err == 0) {
    note_peer_activity_(mac);
    return true;
  }
  ESP_LOGW(TAG, "esp_now_add_peer failed for %s channel=%u (err=%d), attempting stale peer eviction",
           fmt_mac(mac).c_str(), ch, add_err);
  ESP_LOGI(TAG, "Peer table before eviction: tracked=%u", static_cast<unsigned>(peer_last_used_ms_.size()));
  if (!evict_stale_peer_(mac)) {
    ESP_LOGW(TAG, "evict_stale_peer_ returned false - no peer to evict");
    return false;
  }
  if (esp_now_add_peer(mac_copy, peer_role, ch, nullptr, 0) != 0) {
    ESP_LOGW(TAG, "esp_now_add_peer retry failed for %s channel=%u", fmt_mac(mac).c_str(), ch);
    return false;
  }
  note_peer_activity_(mac);
  return true;
}

void ESPNow82xxRemote::note_peer_activity_(const uint8_t *mac) {
  if (mac == nullptr) return;
  peer_last_used_ms_[fmt_mac(mac)] = millis();
}

bool ESPNow82xxRemote::is_peer_protected_(const uint8_t *mac) const {
  if (mac == nullptr) return false;
  if (protocol_.has_parent() && memcmp(protocol_.parent_mac().data(), mac, 6) == 0) return true;
  for (const auto &preferred_parent : preferred_parents_) {
    if (memcmp(preferred_parent.data(), mac, 6) == 0) return true;
  }
  return false;
}

bool ESPNow82xxRemote::evict_stale_peer_(const uint8_t *preferred_mac) {
  uint8_t self_mac[6] = {};
  WiFi.macAddress(self_mac);
  std::string self_mac_str = fmt_mac(self_mac);
  uint32_t oldest_age = 0;
  std::string oldest_mac_str;
  for (auto &entry : peer_last_used_ms_) {
    const std::string &mac_str = entry.first;
    const uint32_t last_used = entry.second;
    uint8_t mac[6] = {};
    if (sscanf(mac_str.c_str(), "%2hhx:%2hhx:%2hhx:%2hhx:%2hhx:%2hhx",
               &mac[0], &mac[1], &mac[2], &mac[3], &mac[4], &mac[5]) != 6) continue;
    if (is_peer_protected_(mac)) continue;
    if (preferred_mac != nullptr && memcmp(preferred_mac, mac, 6) == 0) continue;
    if (mac_str == self_mac_str) continue;
    const uint32_t age = millis() - last_used;
    if (age > oldest_age) {
      oldest_age = age;
      oldest_mac_str = mac_str;
    }
  }
  if (oldest_mac_str.empty()) {
    ESP_LOGW(TAG, "evict_stale_peer_: no peer found to evict (peer_last_used_ms_ size=%u)",
             static_cast<unsigned>(peer_last_used_ms_.size()));
    return false;
  }
  peer_last_used_ms_.erase(oldest_mac_str);
  uint8_t evict_mac[6] = {};
  sscanf(oldest_mac_str.c_str(), "%2hhx:%2hhx:%2hhx:%2hhx:%2hhx:%2hhx",
         &evict_mac[0], &evict_mac[1], &evict_mac[2], &evict_mac[3], &evict_mac[4], &evict_mac[5]);
  if (esp_now_del_peer(evict_mac) != 0) {
    ESP_LOGW(TAG, "esp_now_del_peer failed for stale peer %s", oldest_mac_str.c_str());
    return false;
  }
  ESP_LOGW(TAG, "Evicted stale ESP-NOW peer %s from table", oldest_mac_str.c_str());
  protected_peers_.erase(oldest_mac_str);
  return true;
}

void ESPNow82xxRemote::reset_peer_table_for_parent_(const uint8_t *parent_mac) {
  ESP_LOGI(TAG, "Adding parent %s to peer table (preserving existing peers)", fmt_mac(parent_mac).c_str());
  if (!add_peer_(parent_mac)) {
    ESP_LOGW(TAG, "Failed to add parent peer");
  }
  dump_peer_table_();
}

void ESPNow82xxRemote::dump_peer_table_() {
  ESP_LOGI(TAG, "=== ESP-NOW Peer Table Dump ===");
  uint8_t self_mac[6] = {};
  WiFi.macAddress(self_mac);
  uint8_t cur_ch = wifi_get_channel();
  ESP_LOGI(TAG, "  Self MAC: %s cur_ch=%u", fmt_mac(self_mac).c_str(), cur_ch);
  for (const auto &entry : peer_last_used_ms_) {
    uint8_t mac[6] = {};
    if (sscanf(entry.first.c_str(), "%2hhx:%2hhx:%2hhx:%2hhx:%2hhx:%2hhx",
               &mac[0], &mac[1], &mac[2], &mac[3], &mac[4], &mac[5]) != 6) continue;
    bool is_self = memcmp(mac, self_mac, 6) == 0;
    bool is_protected = protected_peers_.count(entry.first) > 0;
    ESP_LOGI(TAG, "  Peer: %s %s %s", entry.first.c_str(),
             is_self ? "(SELF!)" : "",
             is_protected ? "[PROTECTED]" : "");
  }
  ESP_LOGI(TAG, "  Total peers in tracking: %u", static_cast<unsigned>(peer_last_used_ms_.size()));
  ESP_LOGI(TAG, "=== End Peer Table ===");
}

// ── Send ─────────────────────────────────────────────────────────────────

#ifdef USE_ESP8266
bool ESPNow82xxRemote::send_frame_raw_(const uint8_t *mac, const uint8_t *frame, size_t frame_len) {
  static uint8_t seq_num = 0;
  if (mac == nullptr || frame == nullptr) return false;
  constexpr uint8_t MAC_HEADER_LEN = 24;
  constexpr uint8_t VENDOR_ACTION_LEN = 5;
  const size_t total_len = MAC_HEADER_LEN + VENDOR_ACTION_LEN + frame_len;
  uint8_t *pkt = reinterpret_cast<uint8_t *>(malloc(total_len));
  if (pkt == nullptr) return false;

  uint8_t our_mac[6] = {};
  wifi_get_macaddr(STATION_IF, our_mac);
  size_t idx = 0;
  pkt[idx++] = 0x08;
  pkt[idx++] = 0x88;
  pkt[idx++] = 0x00;
  pkt[idx++] = 0x00;
  memcpy(&pkt[idx], mac, 6);
  idx += 6;
  memcpy(&pkt[idx], our_mac, 6);
  idx += 6;
  memset(&pkt[idx], 0, 6);
  idx += 6;
  pkt[idx++] = (seq_num << 4) & 0xFF;
  pkt[idx++] = 0;
  seq_num++;
  pkt[idx++] = 0x7F;
  pkt[idx++] = 0x18;
  pkt[idx++] = 0xFE;
  pkt[idx++] = 0x34;
  pkt[idx++] = 0x02;
  memcpy(&pkt[idx], frame, frame_len);
  idx += frame_len;
  wifi_set_channel(espnow_channel_);
  ESP_LOGI(TAG, "[RAW TX> 0x0800] ch=%u to=%s len=%zu fc=0x0800 %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X",
           espnow_channel_, fmt_mac(mac).c_str(), total_len,
           pkt[0], pkt[1], pkt[2], pkt[3], pkt[4], pkt[5],
           pkt[6], pkt[7], pkt[8], pkt[9], pkt[10], pkt[11],
           pkt[12], pkt[13], pkt[14], pkt[15]);
  int err = wifi_send_pkt_freedom(pkt, static_cast<int>(total_len), 0);
  if (err != 0) {
    ESP_LOGW(TAG, "[RAW TX] ch=%u to=%s len=%zu fc=0x0800 failed=%d - trying 0x00D0",
             espnow_channel_, fmt_mac(mac).c_str(), total_len, err);
    free(pkt);
    uint8_t *pkt2 = reinterpret_cast<uint8_t *>(malloc(total_len));
    if (pkt2 == nullptr) return false;
    idx = 0;
    pkt2[idx++] = 0x88;
    pkt2[idx++] = 0x08;
    pkt2[idx++] = 0x00;
    pkt2[idx++] = 0x00;
    memcpy(&pkt2[idx], mac, 6);
    idx += 6;
    memcpy(&pkt2[idx], our_mac, 6);
    idx += 6;
    memset(&pkt2[idx], 0, 6);
    idx += 6;
    pkt2[idx++] = (seq_num << 4) & 0xFF;
    pkt2[idx++] = 0;
    seq_num++;
    pkt2[idx++] = 0x7F;
    pkt2[idx++] = 0x18;
    pkt2[idx++] = 0xFE;
    pkt2[idx++] = 0x34;
    pkt2[idx++] = 0x04;
    memcpy(&pkt2[idx], frame, frame_len);
    idx += frame_len;
    wifi_set_channel(espnow_channel_);
    ESP_LOGI(TAG, "[RAW TX> 0x00D0] ch=%u to=%s len=%zu fc=0x00D0 %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X",
             espnow_channel_, fmt_mac(mac).c_str(), total_len,
             pkt2[0], pkt2[1], pkt2[2], pkt2[3], pkt2[4], pkt2[5],
             pkt2[6], pkt2[7], pkt2[8], pkt2[9], pkt2[10], pkt2[11],
             pkt2[12], pkt2[13], pkt2[14], pkt2[15]);
    err = wifi_send_pkt_freedom(pkt2, static_cast<int>(total_len), 0);
    free(pkt2);
    if (err != 0) {
      ESP_LOGW(TAG, "[RAW TX] fc=0x00D0 also failed=%d", espnow_channel_, fmt_mac(mac).c_str(), total_len, err);
      return false;
    }
    ESP_LOGI(TAG, "[RAW TX] fc=0x00D0 succeeded");
  }
  rolling_airtime_.tx_airtime_us += calc_airtime_us_(frame_len);
  rolling_airtime_.tx_packets++;
  return true;
}
#endif

bool ESPNow82xxRemote::send_frame_(const uint8_t *mac, const uint8_t *frame, size_t frame_len) {
  if (mac == nullptr || frame == nullptr) return false;
  // ESP8266 unicast ESPNOW fails (no 802.11 ACK from any device).
  // Workaround: send ALL frames as broadcast. Relays forward based on leaf_mac
  // in the ESPNOW header, not the 802.11 destination, so relay logic is unaffected.
  const bool is_broadcast = true;
  static uint8_t bcast_addr[6] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
  const uint8_t *tx_mac = bcast_addr;  // Force broadcast destination
  bool used_broadcast = true;
  if (is_broadcast) {
    uint8_t broadcast_mac[6] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
    bool peer_exists = esp_now_is_peer_exist(broadcast_mac);
    ESP_LOGI(TAG, "[TX] BB broadcast: is_peer_exist=%d", peer_exists);
    if (!peer_exists) {
      ESP_LOGI(TAG, "Adding broadcast peer for ESP-NOW send");
      add_peer_(broadcast_mac);
    }
  } else {
    uint8_t mac_copy[6];
    memcpy(mac_copy, mac, sizeof(mac_copy));
    const bool peer_exists = esp_now_is_peer_exist(mac_copy);
    ESP_LOGI(TAG, "[TX] UN to=%s len=%u peer_exists=%d",
             fmt_mac(mac).c_str(), static_cast<unsigned>(frame_len), peer_exists);
    if (!peer_exists) {
      ESP_LOGI(TAG, "[TX] UN %s not in peer table, adding...", fmt_mac(mac).c_str());
      if (!add_peer_(mac)) {
        ESP_LOGW(TAG, "ESP-NOW send aborted: no peer slot for %s", fmt_mac(mac).c_str());
        return false;
      }
    } else {
      note_peer_activity_(mac);
    }
  }
  if (frame_len > 255) {
    ESP_LOGW(TAG, "ESP-NOW send aborted: frame too large (%u bytes)", static_cast<unsigned>(frame_len));
    return false;
  }
  if (!is_broadcast && espnow_channel_ > 0 && wifi_get_channel() != espnow_channel_) {
    wifi_set_channel(espnow_channel_);
  }
  rolling_airtime_.tx_airtime_us += calc_airtime_us_(frame_len);
  rolling_airtime_.tx_packets++;
  int err = esp_now_send(const_cast<uint8_t*>(tx_mac), const_cast<uint8_t*>(frame),
                         static_cast<uint8_t>(frame_len));
  if (err != 0) {
    ESP_LOGW(TAG, "[TX] ch=%u %s esp_now_send failed=%d", wifi_get_channel(), used_broadcast ? "BB" : "UN", err);
  }
  return err == 0;
}

// ── Entity registration ──────────────────────────────────────────────────

#ifdef USE_SENSOR
void ESPNow82xxRemote::register_sensor_entity(sensor::Sensor *sensor, const char *entity_id) {
  if (sensor == nullptr) return;
  const uint8_t idx = protocol_.register_entity(FIELD_TYPE_SENSOR, sensor->get_name().c_str(),
                                                 sensor->get_unit_of_measurement_ref().c_str(), "", entity_id);
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
void ESPNow82xxRemote::register_switch_entity(switch_::Switch *a_switch, const char *entity_id) {
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
void ESPNow82xxRemote::register_binary_sensor_entity(binary_sensor::BinarySensor *binary_sensor, const char *entity_id) {
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
void ESPNow82xxRemote::register_button_entity(button::Button *button, const char *entity_id) {
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
void ESPNow82xxRemote::register_cover_entity(cover::Cover *a_cover, const char *entity_id) {
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
void ESPNow82xxRemote::register_lock_entity(lock::Lock *a_lock, const char *entity_id) {
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
void ESPNow82xxRemote::register_number_entity(number::Number *a_number, const char *entity_id) {
  if (a_number == nullptr) return;
  char options[96];
  snprintf(options, sizeof(options), "min=%g;max=%g;step=%g",
           a_number->traits.get_min_value(), a_number->traits.get_max_value(),
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
void ESPNow82xxRemote::register_valve_entity(valve::Valve *a_valve, const char *entity_id) {
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
void ESPNow82xxRemote::register_alarm_control_panel_entity(alarm_control_panel::AlarmControlPanel *a_alarm, const char *entity_id) {
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
void ESPNow82xxRemote::register_event_entity(event::Event *a_event, const char *entity_id) {
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
    this->publish_entity_state_(idx, reinterpret_cast<const uint8_t*>(event_type.c_str()), event_type.size());
  });
}
#endif

#ifdef USE_FAN
void ESPNow82xxRemote::register_fan_entity(fan::Fan *a_fan, const char *entity_id) {
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
void ESPNow82xxRemote::register_light_entity(light::LightState *a_light, const char *entity_id) {
  if (a_light == nullptr) return;
  const std::string options = light_schema_options_(a_light);
  const uint8_t idx = protocol_.register_entity(FIELD_TYPE_LIGHT, a_light->get_name().c_str(), "", options.c_str(), entity_id);
  light_command_targets_.push_back({idx, a_light});
  class Listener : public light::LightRemoteValuesListener {
   public:
    Listener(ESPNow82xxRemote *owner, uint8_t field_index, light::LightState *ls)
        : owner_(owner), field_index_(field_index), light_state_(ls) {}
    void on_light_remote_values_update() override {
      float r = 0, g = 0, b = 0;
      light_state_->remote_values.as_rgb(&r, &g, &b);
      uint8_t hue = 0, sat = 0, val = 0;
      rgb_to_hsv_u8(r, g, b, hue, sat, val);
      uint8_t p[ESPNOW_MAX_ENTITY_FRAGMENT_LEN]{};
      p[0] = light_state_->remote_values.get_state() > 0.5f ? 1 : 0;
      p[1] = val; p[2] = hue; p[3] = sat;
      p[4] = static_cast<uint8_t>(std::min<uint32_t>(255, light_state_->get_current_effect_index()));
      owner_->publish_entity_state_for_listener_(field_index_, p, 5);
    }
   private:
    ESPNow82xxRemote *owner_;
    uint8_t field_index_;
    light::LightState *light_state_;
  };
  auto *l = new Listener(this, idx, a_light);
  a_light->add_remote_values_listener(l);
  l->on_light_remote_values_update();
}
#endif

#ifdef USE_SELECT
void ESPNow82xxRemote::register_select_entity(select::Select *a_select, const char *entity_id) {
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
    const auto sel_idx = a_select->index_of(current_option.c_str());
    if (sel_idx.has_value()) {
      uint8_t value[ESPNOW_MAX_ENTITY_FRAGMENT_LEN]{};
      value[0] = static_cast<uint8_t>(*sel_idx);
      this->publish_entity_state_(idx, value, 1);
    }
  }
}
#endif

#ifdef USE_TEXT
void ESPNow82xxRemote::register_text_entity(text::Text *a_text, const char *entity_id) {
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
void ESPNow82xxRemote::register_text_sensor_entity(text_sensor::TextSensor *a_text_sensor, const char *entity_id) {
  if (a_text_sensor == nullptr) return;
  const uint8_t idx = protocol_.register_entity(FIELD_TYPE_TEXT_SENSOR, a_text_sensor->get_name().c_str(), "", "", entity_id);
  text_sensor_targets_.push_back({idx, a_text_sensor});
  a_text_sensor->add_on_state_callback([this, idx](const std::string &state) {
    this->protocol_.on_entity_text_change(idx, state);
  });
  if (!a_text_sensor->get_state().empty()) this->protocol_.on_entity_text_change(idx, a_text_sensor->get_state());
}
#endif

// ── Command dispatch ─────────────────────────────────────────────────────

bool ESPNow82xxRemote::process_command_target_(uint8_t field_index, uint8_t, const uint8_t *value, size_t value_len) {
  if (value == nullptr) return false;
#ifdef USE_SWITCH
  for (auto &t : command_targets_) { if (t.field_index == field_index) { value[0] ? t.a_switch->turn_on() : t.a_switch->turn_off(); return true; }}
#endif
#ifdef USE_COVER
  for (auto &t : cover_command_targets_) {
    if (t.field_index != field_index) continue;
    auto call = t.a_cover->make_call();
    if (value_len >= 2) {
      switch (value[0]) {
        case POSITION_COMMAND_OPEN: call.set_command_open(); break;
        case POSITION_COMMAND_CLOSE: call.set_command_close(); break;
        case POSITION_COMMAND_STOP: call.set_command_stop(); break;
        default: call.set_position(percent_to_normalized(value[1])); break;
      }
    } else call.set_position(percent_to_normalized(value[0]));
    call.perform(); return true;
  }
#endif
#ifdef USE_LOCK
  for (auto &t : lock_command_targets_) { if (t.field_index == field_index) { auto c = t.a_lock->make_call(); c.set_state(value[0]==1?lock::LOCK_STATE_LOCKED:lock::LOCK_STATE_UNLOCKED); c.perform(); return true; }}
#endif
#ifdef USE_NUMBER
  for (auto &t : number_command_targets_) { if (t.field_index == field_index) { if (value_len<sizeof(float)) return false; auto c = t.a_number->make_call(); c.set_value(decode_float(value,value_len)); c.perform(); return true; }}
#endif
#ifdef USE_VALVE
  for (auto &t : valve_command_targets_) {
    if (t.field_index != field_index) continue;
    auto call = t.a_valve->make_call();
    if (value_len >= 2) {
      switch (value[0]) {
        case POSITION_COMMAND_OPEN: call.set_command_open(); break;
        case POSITION_COMMAND_CLOSE: call.set_command_close(); break;
        case POSITION_COMMAND_STOP: call.set_command_stop(); break;
        default: call.set_position(percent_to_normalized(value[1])); break;
      }
    } else call.set_position(percent_to_normalized(value[0]));
    call.perform(); return true;
  }
#endif
#ifdef USE_ALARM_CONTROL_PANEL
  for (auto &t : alarm_command_targets_) {
    if (t.field_index != field_index) continue;
    auto call = t.a_alarm->make_call();
    if (value_len>1) call.set_code(reinterpret_cast<const char*>(value+1), value_len-1);
    switch (value[0]) { case 1: call.arm_home(); break; case 2: call.arm_away(); break; case 3: call.arm_night(); break; case 4: call.arm_vacation(); break; case 5: call.arm_custom_bypass(); break; case 6: call.triggered(); break; case 7: call.pending(); break; default: call.disarm(); break; }
    call.perform(); return true;
  }
#endif
#ifdef USE_FAN
  for (auto &t : fan_command_targets_) {
    if (t.field_index != field_index) continue;
    auto c = t.a_fan->make_call();
    if (value_len>=1) c.set_state(value[0]!=0); if (value_len>=2) c.set_speed((int)value[1]); if (value_len>=3) c.set_oscillating(value[2]!=0); if (value_len>=4) c.set_direction(value[3]!=0?fan::FanDirection::REVERSE:fan::FanDirection::FORWARD);
    c.perform(); return true;
  }
#endif
#ifdef USE_LIGHT
  for (auto &t : light_command_targets_) {
    if (t.field_index != field_index) continue;
    auto c = t.a_light->make_call();
    c.set_state(value[0] != 0);
    if (value_len > 1) c.set_brightness(static_cast<float>(value[1]) / 255.0f);
    if (value_len > 3) {
      float r = 0.0f, g = 0.0f, b = 0.0f;
      hsv_u8_to_rgb(value[2], value[3], value[1], r, g, b);
      c.set_rgb(r, g, b);
    }
    if (value_len > 4) c.set_effect(static_cast<uint32_t>(value[4]));
    if (value_len > 7) {
      const float ct = static_cast<float>(value[6] | (static_cast<uint16_t>(value[7]) << 8));
      c.set_color_temperature(ct);
    }
    if (value_len > 8) {
      c.set_white(static_cast<float>(value[8]) / 255.0f);
    }
    c.perform();
    return true;
  }
#endif
#ifdef USE_SELECT
  for (auto &t : select_command_targets_) { if (t.field_index == field_index) { auto c = t.a_select->make_call(); c.set_index(value_len>0?value[0]:0); c.perform(); return true; }}
#endif
#ifdef USE_TEXT
  for (auto &t : text_command_targets_) { if (t.field_index == field_index) { auto c = t.a_text->make_call(); c.set_value(reinterpret_cast<const char*>(value),value_len); c.perform(); return true; }}
#endif
#ifdef USE_BUTTON
  for (auto &t : button_targets_) { if (t.field_index == field_index) { t.button->press(); return true; }}
#endif
  return false;
}

bool ESPNow82xxRemote::apply_command_to_field_(uint8_t field_index, uint8_t flags, const uint8_t *value, size_t value_len) {
  return process_command_target_(field_index, flags, value, value_len);
}

void ESPNow82xxRemote::publish_entity_state_(uint8_t field_index, const uint8_t *value, size_t value_len) {
  protocol_.on_entity_state_change(field_index, value, value_len);
}

// ── RX handling ──────────────────────────────────────────────────────────

void ESPNow82xxRemote::handle_received_frame_(const uint8_t *mac, const uint8_t *data, size_t len) {
  if (mac == nullptr || data == nullptr || len == 0) return;
  if (pending_rx_frames_.size() >= MAX_PENDING_RX_FRAMES) { rx_dropped_++; return; }
  PendingRxFrame f{};
  memcpy(f.mac.data(), mac, 6);
  f.data.assign(data, data + len);
  pending_rx_frames_.push_back(std::move(f));
}

void ESPNow82xxRemote::handle_send_status_(const uint8_t *mac, bool success) {
  static int cb_counter = 0;
  cb_counter++;
  ESP_LOGI(TAG, "[TX CB #%d] mac=%s status=%s", cb_counter, mac ? fmt_mac(mac).c_str() : "NULL", success ? "SUCCESS" : "FAIL");
  if (success) tx_ok_++; else { tx_fail_++; ESP_LOGW(TAG, "[TX CB #%d] FAIL — total fails=%u", cb_counter, tx_fail_); }
}

void ESPNow82xxRemote::drain_received_frames_() {
  std::deque<PendingRxFrame> pending;
  pending.swap(pending_rx_frames_);
  for (auto &f : pending) {
    bool processed = protocol_.on_espnow_frame(f.mac.data(), f.data.data(), f.data.size(), 0);
    if (!processed) {
      rx_dropped_++;
    }
    else {
      rx_packets_++;
      rolling_airtime_.rx_airtime_us += calc_airtime_us_(f.data.size());
      rolling_airtime_.rx_packets++;
    }
  }
}

// ── Airtime stats ────────────────────────────────────────────────────────

void ESPNow82xxRemote::log_airtime_status_() {
  const uint32_t now_ms = millis();
  if (airtime_window_start_ms_ == 0) { airtime_window_start_ms_ = now_ms; return; }
  const uint32_t elapsed_ms = now_ms - airtime_window_start_ms_;
  if (elapsed_ms < AIRTIME_REPORT_INTERVAL_MS) return;
  const uint32_t total_tx = rolling_airtime_.tx_packets;
  const uint32_t total_rx = rolling_airtime_.rx_packets;
  const uint64_t busy_us = rolling_airtime_.tx_airtime_us + rolling_airtime_.rx_airtime_us;
  const float busy_pct = (busy_us * 100.0f) / (static_cast<uint64_t>(elapsed_ms) * 1000ULL);
  const float fail_pct = (total_tx > 0) ? (static_cast<float>(tx_fail_) * 100.0f / static_cast<float>(total_tx)) : 0.0f;
  const int avg_rssi = rolling_airtime_.rssi_count > 0 ? static_cast<int>(rolling_airtime_.rssi_sum / rolling_airtime_.rssi_count) : 0;
  const uint32_t uptime_s = protocol_.get_uptime_s();
  ESP_LOGI(TAG, "up:%s | radio(ESP8266):%.1f%% | tx:%u rx:%u | rssi:%ddBm | fail:%d%% | children:%u",
           format_uptime(uptime_s).c_str(), busy_pct, total_tx, total_rx, avg_rssi, static_cast<int>(fail_pct), protocol_.get_total_children_count());
  airtime_window_start_ms_ = now_ms;
  rolling_airtime_.tx_packets = 0;
  rolling_airtime_.rx_packets = 0;
  rolling_airtime_.tx_airtime_us = 0;
  rolling_airtime_.rx_airtime_us = 0;
  rolling_airtime_.rssi_sum = 0;
  rolling_airtime_.rssi_count = 0;
}

// ── Build epoch ──────────────────────────────────────────────────────────

static uint32_t read_build_epoch_() {
  const char *compile_date = __DATE__;
  const char *compile_time = __TIME__;
  struct tm tm{};
  if (strptime(compile_date, "%b %d %Y", &tm) == nullptr) return 0;
  if (strptime(compile_time, "%H:%M:%S", &tm) == nullptr) return 0;
  tm.tm_isdst = 0;
  return static_cast<uint32_t>(mktime(&tm));
}

// ── Setup / loop ─────────────────────────────────────────────────────────

bool ESPNow82xxRemote::setup_transport_() {
  register_instance_(this);
  if (!init_wifi_and_espnow_()) return false;
  uint8_t mac[6];
  WiFi.macAddress(mac);
  // On ESP8266 in AP_STA mode, esp_now_send uses the STA MAC as 802.11 source.
  // The STA MAC = AP MAC with bit 1 of first byte flipped: EC → EE.
  // This ensures the leaf_mac in ESPNOW header matches what the bridge registers
  // as a peer (the 802.11 source of DISCOVER), enabling unicast ACKs.
  mac[0] |= 0x02;
  memcpy(sta_mac_.data(), mac, 6);
  ESP_LOGI(TAG, "Set leaf_mac=%s (AP_MAC bit1-flipped for esp_now_send compat)",
           fmt_mac(sta_mac_.data()).c_str());
  protocol_.set_local_mac(sta_mac_.data());
  protocol_.set_relay_config(false, 0, 0);
  for (const auto &mac : preferred_parents_) {
    protocol_.add_preferred_parent(mac);
    protected_peers_.insert(fmt_mac(mac.data()));
  }
  protocol_.set_send_fn([this](const uint8_t *m, const uint8_t *f, size_t fl) { return send_frame_(m, f, fl); });
  protocol_.set_command_fn([this](uint8_t fi, uint8_t fl, const uint8_t *v, size_t vl) { apply_command_to_field_(fi, fl, v, vl); });
  protocol_.set_reset_peer_table_fn([this](const uint8_t *m) { reset_peer_table_for_parent_(m); });
  transport_ready_ = true;
  clear_all_peers_();
  dump_peer_table_();
  return true;
}

void ESPNow82xxRemote::refresh_dynamic_schema_options_() {
#ifdef USE_FAN
  for (auto &t : fan_command_targets_) protocol_.set_entity_options(t.field_index, fan_schema_options_(t.a_fan).c_str());
#endif
#ifdef USE_LIGHT
  for (auto &t : light_command_targets_) protocol_.set_entity_options(t.field_index, light_schema_options_(t.a_light).c_str());
#endif
}

void ESPNow82xxRemote::setup() {
  if (!setup_transport_()) { this->mark_failed(); return; }
  if (!psk_.empty() && !network_id_.empty()) {
    const auto epoch = read_build_epoch_();
    protocol_ready_ = protocol_.init(psk_.c_str(), network_id_.c_str(), esphome_name_.c_str(), node_label_.c_str(),
                                     epoch, project_name_(), project_version_(), heartbeat_interval_) == 0;
  }
  if (!protocol_ready_) { this->mark_failed(); return; }
  refresh_dynamic_schema_options_();
  dynamic_schema_options_refreshed_ = true;
#ifdef USE_ESP8266
  std::array<uint8_t, 6> bridge_mac{{0xD0, 0xCF, 0x13, 0xEB, 0x81, 0x28}};
  scan_target_mac_ = bridge_mac;
  scan_seq_num_ = 0;
  scanning_permutations_ = true;
  scan_suppress_diag_ = true;
  permutation_scan_start_ms_ = 0;
  permutation_index_ = 0;
  fill_random_bytes(join_nonce_.data(), join_nonce_.size());
#endif
  this->set_interval("airtime_status", AIRTIME_REPORT_INTERVAL_MS, [this]() { log_airtime_status_(); });
  this->set_interval("espnow_diag", 10000, [this]() { log_diagnostic_(); });
}

void ESPNow82xxRemote::loop() {
  if (!dynamic_schema_options_refreshed_) { refresh_dynamic_schema_options_(); dynamic_schema_options_refreshed_ = true; }
#ifdef USE_ESP8266
  patch_esp8266_ic_bss_();
  // All frames go broadcast (see send_frame_)
#endif
  drain_received_frames_();
  protocol_.loop();
  protocol_.flush_log_queue();
}

void ESPNow82xxRemote::dump_config() {
  ESP_LOGCONFIG(TAG, "ESP-NOW 82xx Remote (ESP8266/ESP8285):");
  ESP_LOGCONFIG(TAG, "  Network ID: %s", network_id_.c_str());
  ESP_LOGCONFIG(TAG, "  ESPHome Name: %s", esphome_name_.c_str());
  ESP_LOGCONFIG(TAG, "  Node Label: %s", node_label_.c_str());
  char db[32] = {"unknown"};
  time_t epoch = protocol_.get_firmware_epoch();
  if (epoch > 0) { struct tm *ti = gmtime(&epoch); if (ti) strftime(db, sizeof(db), "%Y-%m-%d %H:%M:%S UTC", ti); }
  ESP_LOGCONFIG(TAG, "  Firmware Build Date: %s", db);
  ESP_LOGCONFIG(TAG, "  Project Name: %s", protocol_.get_project_name().c_str());
  ESP_LOGCONFIG(TAG, "  Project Version: %s", protocol_.get_project_version().c_str());
  ESP_LOGCONFIG(TAG, "  Mode: regular");
  ESP_LOGCONFIG(TAG, "  Preferred Parents: %u", static_cast<unsigned>(preferred_parents_.size()));
  for (const auto &mac : preferred_parents_)
    ESP_LOGCONFIG(TAG, "    - %s", fmt_mac(mac.data()).c_str());
}

// ── ESP8266 ESP-NOW callbacks ────────────────────────────────────────────

void ESPNow82xxRemote::on_data_received_(uint8_t *mac, uint8_t *data, uint8_t len) {
  if (active_instance_ == nullptr) return;
  if (len < 17 || len > 1500) {
    ESP_LOGW(TAG, "[RX DROP] mac=%s len=%u outside valid range (17-1500)", fmt_mac(mac), len);
    return;
  }
  bool is_broadcast = (mac[0] == 0xFF && mac[1] == 0xFF && mac[2] == 0xFF &&
                       mac[3] == 0xFF && mac[4] == 0xFF && mac[5] == 0xFF);
  if (!is_broadcast) {
    if (esp_now_is_peer_exist(mac)) {
      ESP_LOGI(TAG, "[RX] mac=%s len=%u peer=YES", fmt_mac(mac).c_str(), len);
    } else {
      ESP_LOGI(TAG, "[RX] mac=%s len=%u peer=NO, adding...", fmt_mac(mac).c_str());
      active_instance_->add_peer_(mac);
    }
  }
  ESP_LOGI(TAG, "[RX RAW<] %s len=%u %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X %02X",
           fmt_mac(mac).c_str(), len, data[0], data[1], data[2], data[3],
           data[4], data[5], data[6], data[7], data[8], data[9], data[10],
           data[11], data[12], data[13], data[14], data[15]);
  active_instance_->handle_received_frame_(mac, data, static_cast<size_t>(len));
}

// Periodic diagnostic log every 10 seconds
void ESPNow82xxRemote::log_diagnostic_() {
  dump_peer_table_();
  ESP_LOGI(TAG, "[DIAG] tx=%u rx=%u rx_dropped=%u has_parent=%d discovering=%d peers=%u",
           tx_ok_, rx_packets_, rx_dropped_,
           active_instance_ ? active_instance_->protocol_.has_parent() : 0,
           active_instance_ ? active_instance_->protocol_.is_discovering() : 0,
           static_cast<unsigned>(peer_last_used_ms_.size()));
}

void ESPNow82xxRemote::on_data_sent_(uint8_t *mac, uint8_t status) {
  if (active_instance_ == nullptr) return;
  active_instance_->handle_send_status_(mac, status == 0);
}

}  // namespace esp_tree
}  // namespace esphome
