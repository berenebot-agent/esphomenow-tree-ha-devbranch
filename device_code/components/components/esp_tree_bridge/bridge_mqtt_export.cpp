#ifdef USE_MQTT

#include "bridge_mqtt_export.h"
#include "esp_tree_bridge.h"

#include "esp_tree_common/espnow_mac_utils.h"
#include "esp_tree_common/esp_tree_utils.h"

#include "esphome/components/json/json_util.h"
#include "esphome/core/log.h"
#include "esphome/core/application.h"

#include <cstdlib>
#include <cmath>
#include <cstring>
#include <algorithm>
#include <esp_heap_caps.h>
#include <esp_timer.h>
#include <esp_wifi.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <sstream>

static const uint8_t YIELD_MS = 1;
static const char *const TAG = "espnow";

namespace {

static float decode_float(const uint8_t *value, size_t value_len) {
  if (value_len < sizeof(float)) return 0.0f;
  float decoded = 0.0f;
  memcpy(&decoded, value, sizeof(decoded));
  return decoded;
}

static void encode_float(float input, uint8_t *out, size_t out_len) {
  memset(out, 0, out_len);
  memcpy(out, &input, sizeof(input));
}

static bool parse_on(const std::string &payload) {
  return payload == "ON" || payload == "on" || payload == "1" || payload == "true";
}

static const char *component_for_type(espnow_field_type_t type) {
  switch (type) {
    case FIELD_TYPE_SENSOR: return "sensor";
    case FIELD_TYPE_SWITCH: return "switch";
    case FIELD_TYPE_BINARY: return "binary_sensor";
    case FIELD_TYPE_BUTTON: return "button";
    case FIELD_TYPE_NUMBER: return "number";
    case FIELD_TYPE_TEXT: return "text";
    case FIELD_TYPE_TEXT_SENSOR: return "sensor";
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
    if (ch == sep) { parts.push_back(current); current.clear(); }
    else { current.push_back(ch); }
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
  if (hue < 60.0f) { rp = c; gp = x; }
  else if (hue < 120.0f) { rp = x; gp = c; }
  else if (hue < 180.0f) { gp = c; bp = x; }
  else if (hue < 240.0f) { gp = x; bp = c; }
  else if (hue < 300.0f) { rp = x; bp = c; }
  else { rp = c; bp = x; }
  r = static_cast<uint8_t>(std::lround((rp + m) * 255.0f));
  g = static_cast<uint8_t>(std::lround((gp + m) * 255.0f));
  b = static_cast<uint8_t>(std::lround((bp + m) * 255.0f));
}

static const char *color_mode_name_(uint8_t cm) {
  switch (cm) {
    case 1:    return "onoff";
    case 3:    return "brightness";
    case 7:    return "white";
    case 11:   return "color_temp";
    case 19:
    case 35:   return "rgb";
    case 39:   return "rgbw";
    case 47:   return "rgbww";
    default:   return "brightness";
  }
}

}  // namespace

namespace esphome {
namespace esp_tree {

ESPTreeBridgeMQTT::ESPTreeBridgeMQTT() = default;

void ESPTreeBridgeMQTT::init(ESPTreeBridge *bridge,
                               const std::array<uint8_t, 6> &bridge_mac,
                               const std::string &force_rejoin_topic) {
  bridge_ = bridge;
  bridge_mac_ = bridge_mac;
  force_rejoin_command_topic_ = force_rejoin_topic;
  this->subscribe(force_rejoin_topic, &ESPTreeBridgeMQTT::handle_force_rejoin_command_);
}

bool ESPTreeBridgeMQTT::do_publish_state_(MqttEntityRecord &rec) {
  if (!is_connected()) {
    ESP_LOGW(TAG, "MQTT disconnected; deferring STATE publish for entity %u", rec.schema.entity_index);
    return false;
  }
  const uint8_t *mac = rec.leaf_mac.data();
  const BridgeEntitySchema &entity = rec.schema;
  const espnow_field_type_t type = rec.current_type;
  bool ok = true;

  if (type == FIELD_TYPE_BUTTON) {
    ok = publish_json(state_topic_(mac, entity), [=](JsonObject root) { root["event_type"] = "press"; }, 1, false);
    delay(YIELD_MS);
  } else if (type == FIELD_TYPE_EVENT) {
    ok = publish_json(state_topic_(mac, entity), [event_type = rec.text_value](JsonObject root) { root["event_type"] = event_type; }, 1, false);
    delay(YIELD_MS);
  } else if (type == FIELD_TYPE_FAN) {
    const auto options = parse_options_map(entity.entity_options);
    ok = publish(state_topic_(mac, entity), (!rec.current_value.empty() && rec.current_value[0]) ? "ON" : "OFF", 1);
    delay(YIELD_MS);
    if (ok && rec.current_value.size() > 1 && option_u32(options, "speed_count", 0) > 0) {
      uint32_t speed_count = option_u32(options, "speed_count", 0);
      uint8_t level = rec.current_value[1];
      if (level > speed_count) level = speed_count;
      int pct = (level * 100) / speed_count;
      ok = publish(fan_speed_state_topic_(mac, entity), std::to_string(pct), 1);
      delay(YIELD_MS);
    }
    if (ok && rec.current_value.size() > 2 && option_is_true(options, "oscillation")) {
      ok = publish(fan_oscillation_state_topic_(mac, entity), rec.current_value[2] ? "oscillate_on" : "oscillate_off", 1);
      delay(YIELD_MS);
    }
    if (ok && rec.current_value.size() > 3 && option_is_true(options, "direction")) {
      ok = publish(fan_direction_state_topic_(mac, entity), rec.current_value[3] ? "reverse" : "forward", 1);
      delay(YIELD_MS);
    }
  } else if (type == FIELD_TYPE_LIGHT) {
    const auto options = parse_options_map(entity.entity_options);
    ok = publish_json(state_topic_(mac, entity), [value = rec.current_value, options](JsonObject root) {
      root["state"] = (!value.empty() && value[0]) ? "ON" : "OFF";
      if (value.size() > 5) {
        root["color_mode"] = color_mode_name_(value[5]);
      } else if (value.size() > 3 &&
                 (option_has_list_value(options, "color_modes", "rgb") ||
                  option_has_list_value(options, "color_modes", "rgbw") ||
                  option_has_list_value(options, "color_modes", "rgbww"))) {
        root["color_mode"] = "rgb";
      } else if (value.size() > 1 &&
                 option_has_list_value(options, "color_modes", "color_temp")) {
        root["color_mode"] = "color_temp";
      } else {
        root["color_mode"] = "brightness";
      }
      if ((option_has_list_value(options, "color_modes", "brightness") || option_has_list_value(options, "color_modes", "rgb") ||
           option_has_list_value(options, "color_modes", "rgbw") || option_has_list_value(options, "color_modes", "rgbww") ||
           option_has_list_value(options, "color_modes", "white") || option_has_list_value(options, "color_modes", "color_temp")) &&
          value.size() > 1) {
        root["brightness"] = value[1];
      }
      if ((option_has_list_value(options, "color_modes", "rgb") || option_has_list_value(options, "color_modes", "rgbw") ||
           option_has_list_value(options, "color_modes", "rgbww")) && value.size() > 3) {
        uint8_t r = 0, g = 0, b = 0;
        hsv_u8_to_rgb(value[2], value[3], value[1], r, g, b);
        JsonObject color = root["color"].to<JsonObject>();
        color["r"] = r;
        color["g"] = g;
        color["b"] = b;
      }
      if (value.size() > 7) {
        const uint16_t ct = static_cast<uint16_t>(value[6] | (static_cast<uint16_t>(value[7]) << 8));
        if (ct > 0) root["color_temp"] = ct;
      }
      if (value.size() > 8 && value[8] > 0) {
        root["white"] = value[8];
      }
      const auto effects = option_list(options, "effects");
      if (!effects.empty() && value.size() > 4) {
        root["effect"] = value[4] > 0 && value[4] <= effects.size() ? effects[value[4] - 1] : "None";
      }
    }, 1, false);
    delay(YIELD_MS);
  } else if ((type == FIELD_TYPE_TEXT || type == FIELD_TYPE_TEXT_SENSOR) && !rec.text_value.empty()) {
    ok = publish(state_topic_(mac, entity), rec.text_value, 1);
    delay(YIELD_MS);
  } else {
    ok = publish(state_topic_(mac, entity), encode_state_payload_(entity, rec.current_value, type), 1);
    delay(YIELD_MS);
  }

  if (ok) {
    rec.text_value.clear();
    rec.state_dirty = false;
    rec.first_state_publish_pending = false;
    if (bridge_ != nullptr && rec.pending_state_ack_) {
      bridge_->mark_mqtt_state_delivered(rec.leaf_mac.data(), rec.pending_ack_entity_index_,
                                         rec.pending_ack_message_tx_base_);
      rec.pending_state_ack_ = false;
    }
  } else {
    ESP_LOGW(TAG, "MQTT STATE publish failed for entity %u", rec.schema.entity_index);
    if (mqtt_retry_count_ < 7) {
      mqtt_retry_count_++;
    }
    const uint16_t backoff_ms = MQTT_RETRY_BACKOFF_MS[std::min<size_t>(mqtt_retry_count_, 7)];
    mqtt_backoff_until_ms_ = millis() + backoff_ms;
    ESP_LOGW(TAG, "MQTT backoff %ums (retry %u)", backoff_ms, mqtt_retry_count_);
  }
  return ok;
}

void ESPTreeBridgeMQTT::build_entity_component_(JsonObject cmp, const uint8_t *mac, const BridgeEntitySchema &entity) {
  const auto type = static_cast<espnow_field_type_t>(entity.entity_type);
  cmp["p"] = component_for_type(type);
  cmp["unique_id"] = unique_id_(mac, entity);
  cmp["name"] = entity.entity_name;
  cmp["stat_t"] = state_topic_(mac, entity);

  if (!entity.entity_unit.empty()) cmp["unit_of_meas"] = entity.entity_unit;

  switch (type) {
    case FIELD_TYPE_SWITCH:
      cmp["ic"] = "mdi:toggle-switch";
      cmp["cmd_t"] = command_topic_(mac, entity);
      cmp["pl_on"] = "ON"; cmp["pl_off"] = "OFF";
      cmp["stat_on"] = "ON"; cmp["stat_off"] = "OFF";
      break;
    case FIELD_TYPE_BINARY:
      cmp["ic"] = "mdi:check-circle-outline";
      cmp["pl_on"] = "ON"; cmp["pl_off"] = "OFF";
      break;
    case FIELD_TYPE_LOCK:
      cmp["ic"] = "mdi:lock";
      cmp["cmd_t"] = command_topic_(mac, entity);
      cmp["pl_lock"] = "LOCK"; cmp["pl_unlk"] = "UNLOCK";
      cmp["stat_locked"] = "LOCKED"; cmp["stat_unlocked"] = "UNLOCKED";
      cmp["payload_lock"] = "LOCK"; cmp["payload_unlock"] = "UNLOCK";
      cmp["state_locked"] = "LOCKED"; cmp["state_unlocked"] = "UNLOCKED";
      break;
    case FIELD_TYPE_BUTTON:
      cmp["ic"] = "mdi:gesture-tap-button";
      cmp["cmd_t"] = command_topic_(mac, entity);
      cmp["command_topic"] = command_topic_(mac, entity);
      break;
    case FIELD_TYPE_COVER:
      cmp["ic"] = "mdi:window-shutter";
      cmp["cmd_t"] = command_topic_(mac, entity);
      cmp["pos_t"] = state_topic_(mac, entity);
      break;
    case FIELD_TYPE_VALVE:
      cmp["ic"] = "mdi:valve";
      cmp["cmd_t"] = command_topic_(mac, entity);
      cmp["pos_t"] = state_topic_(mac, entity);
      break;
    case FIELD_TYPE_FAN:
      cmp["ic"] = "mdi:fan";
      cmp["cmd_t"] = command_topic_(mac, entity);
      cmp["pl_on"] = "ON"; cmp["pl_off"] = "OFF";
      cmp["stat_on"] = "ON"; cmp["stat_off"] = "OFF";
      cmp["payload_on"] = "ON"; cmp["payload_off"] = "OFF";
      cmp["state_on"] = "ON"; cmp["state_off"] = "OFF";
      {
        const auto options = parse_options_map(entity.entity_options);
        const uint32_t speed_count = option_u32(options, "speed_count", 0);
        if (speed_count > 0) {
          cmp["pct_cmd_t"] = fan_speed_command_topic_(mac, entity);
          cmp["pct_stat_t"] = fan_speed_state_topic_(mac, entity);
          cmp["spd_rng_max"] = speed_count;
          cmp["percentage_command_topic"] = fan_speed_command_topic_(mac, entity);
          cmp["percentage_state_topic"] = fan_speed_state_topic_(mac, entity);
          cmp["speed_range_max"] = speed_count;
          cmp["speed_range_min"] = 1;
        }
        if (option_is_true(options, "oscillation")) {
          cmp["osc_cmd_t"] = fan_oscillation_command_topic_(mac, entity);
          cmp["osc_stat_t"] = fan_oscillation_state_topic_(mac, entity);
          cmp["oscillation_command_topic"] = fan_oscillation_command_topic_(mac, entity);
          cmp["oscillation_state_topic"] = fan_oscillation_state_topic_(mac, entity);
          cmp["payload_oscillation_on"] = "oscillate_on";
          cmp["payload_oscillation_off"] = "oscillate_off";
        }
        if (option_is_true(options, "direction")) {
          cmp["dir_cmd_t"] = fan_direction_command_topic_(mac, entity);
          cmp["dir_stat_t"] = fan_direction_state_topic_(mac, entity);
          cmp["direction_command_topic"] = fan_direction_command_topic_(mac, entity);
          cmp["direction_state_topic"] = fan_direction_state_topic_(mac, entity);
          cmp["payload_direction_forward"] = "forward";
          cmp["payload_direction_reverse"] = "reverse";
        }
      }
      break;
    case FIELD_TYPE_LIGHT:
      cmp["ic"] = "mdi:lightbulb";
      cmp["cmd_t"] = command_topic_(mac, entity);
      cmp["schema"] = "json";
      {
        const auto options = parse_options_map(entity.entity_options);
        const bool supports_brightness = option_has_list_value(options, "color_modes", "brightness") ||
                                         option_has_list_value(options, "color_modes", "rgb") ||
                                         option_has_list_value(options, "color_modes", "rgbw") ||
                                         option_has_list_value(options, "color_modes", "rgbww") ||
                                         option_has_list_value(options, "color_modes", "white") ||
                                         option_has_list_value(options, "color_modes", "color_temp");
        const bool supports_rgb = option_has_list_value(options, "color_modes", "rgb") ||
                                  option_has_list_value(options, "color_modes", "rgbw") ||
                                  option_has_list_value(options, "color_modes", "rgbww");
        const bool supports_color_temp = option_has_list_value(options, "color_modes", "color_temp");
        const auto color_mode_list = option_list(options, "color_modes");
        if (!color_mode_list.empty()) {
          JsonArray modes = cmp["supported_color_modes"].to<JsonArray>();
          for (const auto &cm : color_mode_list) modes.add(cm.c_str());
        }
        if (supports_brightness) cmp["brt"] = true;
        if (supports_rgb) cmp["clr"] = true;
        if (supports_color_temp) cmp["clr_temp"] = true;
        const auto effects = option_list(options, "effects");
        if (!effects.empty()) {
          JsonArray eff = cmp["effect_list"].to<JsonArray>();
          for (const auto &e : effects) eff.add(e.c_str());
          cmp["effect"] = true;
          cmp["effect_cmd_t"] = command_topic_(mac, entity);
        }
      }
      break;
    default:
      break;
  }
}

void ESPTreeBridgeMQTT::do_publish_discovery_(MqttEntityRecord &rec) {
  if (!is_connected()) return;
  const uint8_t *mac = rec.leaf_mac.data();
  const BridgeEntitySchema &entity = rec.schema;
  const auto type = static_cast<espnow_field_type_t>(entity.entity_type);
  const std::string component = entity_component_(type);
  const std::string object_id = entity_object_id_(mac, entity);
  const std::string discovery_topic =
      mqtt_discovery_prefix_ + "/" + component + "/" + node_key_(mac) + "/" + object_id + "/config";
  const std::string device_id = std::string("esp_tree_") + node_key_(mac);
  auto dev_it = mqtt_devices_.find(rec.node_id);
  const std::string display_name = (dev_it != mqtt_devices_.end()) ? dev_it->second.display_name : rec.node_id;
  const bool ok = publish_json(discovery_topic, [this, mac, entity, type, device_id, display_name](JsonObject root) {
    root["default_entity_id"] = default_entity_id_(mac, entity);
    root["avty_t"] = availability_topic_(mac);
    root["pl_avail"] = "online";
    root["pl_not_avail"] = "offline";
    JsonObject origin = root["o"].to<JsonObject>();
    origin["name"] = "esp-tree-bridge";
    origin["sw"] = std::to_string(ESPNOW_PROTOCOL_VER);
    JsonObject device = root["device"].to<JsonObject>();
    device["ids"] = device_id;
    device["name"] = display_name;
    device["mf"] = "ESP-NOW LR";
    device["mdl"] = "Remote";
    device["sw"] = std::to_string(ESPNOW_PROTOCOL_VER);
    build_entity_component_(root, mac, entity);
  }, 1, true);

  subscribe_command_topic_(mac, entity);
  if (!ok) return;

  rec.discovery_published = true;
  rec.first_state_publish_pending = false;
  rec.discovery_published_ms = millis();
  if (bridge_ != nullptr) {
    bridge_->protocol_discovery_confirmed(mac, entity.entity_index, true);
  }
}

void ESPTreeBridgeMQTT::publish_device_discovery_(const uint8_t *mac) {
  if (!is_connected()) return;
  const std::string nk = node_key_(mac);
  auto it = mqtt_devices_.find(nk);
  if (it == mqtt_devices_.end()) return;
  auto &dev = it->second;

  if (dev.entities.empty()) return;

  const std::string discovery_topic = mqtt_discovery_prefix_ + "/device/" + nk + "/config";
  const std::string avail_topic = availability_topic_(mac);
  const bool ok = publish_json(discovery_topic, [&dev, avail_topic](JsonObject root) {
    JsonObject device = root["dev"].to<JsonObject>();
    device["ids"] = dev.device_id;
    device["name"] = dev.display_name;
    device["mf"] = "ESP-NOW LR";
    device["mdl"] = "Remote";
    device["sw"] = std::to_string(ESPNOW_PROTOCOL_VER);
    JsonObject origin = root["o"].to<JsonObject>();
    origin["name"] = "esp-tree-bridge";
    origin["sw"] = std::to_string(ESPNOW_PROTOCOL_VER);
    JsonArray avty_arr = root["availability"].to<JsonArray>();
    JsonObject avty = avty_arr.add<JsonObject>();
    avty["topic"] = avail_topic;
    avty["payload_available"] = "online";
    avty["payload_not_available"] = "offline";
  }, 1, true);

  for (auto &pair : dev.entities) {
    subscribe_command_topic_(mac, pair.second);
  }

  if (!ok) return;

  dev.discovery_dirty = false;
  dev.discovery_published = true;
  dev.discovery_published_ms = millis();
}

void ESPTreeBridgeMQTT::do_clear_device_discovery_(const uint8_t *mac) {
  if (!is_connected()) return;
  const std::string nk = node_key_(mac);
  publish(mqtt_discovery_prefix_ + "/device/" + nk + "/config", "", 1, true);
  mqtt_devices_.erase(nk);
}

void ESPTreeBridgeMQTT::do_clear_entity_(const uint8_t *mac, const BridgeEntitySchema &entity) {
  if (!is_connected()) return;
  const std::string component = entity_component_(static_cast<espnow_field_type_t>(entity.entity_type));
  const std::string discovery_topic =
      mqtt_discovery_prefix_ + "/" + component + "/" + node_key_(mac) + "/" + entity_object_id_(mac, entity) + "/config";
  publish(discovery_topic, "", 1, true);
}

void ESPTreeBridgeMQTT::subscribe_command_topic_(const uint8_t *mac, const BridgeEntitySchema &entity) {
  if (!is_connected()) return;
  const auto type = static_cast<espnow_field_type_t>(entity.entity_type);
  if (!(type == FIELD_TYPE_SWITCH || type == FIELD_TYPE_NUMBER || type == FIELD_TYPE_TEXT || type == FIELD_TYPE_COVER ||
        type == FIELD_TYPE_VALVE || type == FIELD_TYPE_LOCK || type == FIELD_TYPE_SELECT || type == FIELD_TYPE_ALARM ||
        type == FIELD_TYPE_FAN || type == FIELD_TYPE_LIGHT || type == FIELD_TYPE_BUTTON)) {
    return;
  }
  std::array<uint8_t, 6> leaf{};
  memcpy(leaf.data(), mac, 6);
  auto subscribe_route = [&](const std::string &topic, CommandRouteKind route_kind) {
    command_routes_[topic] = {leaf, entity.entity_index, route_kind};
    if (subscribed_topics_.insert(topic).second) {
      this->subscribe(topic, &ESPTreeBridgeMQTT::handle_command_message_);
    }
  };

  subscribe_route(command_topic_(mac, entity), CommandRouteKind::PRIMARY);
  if (type != FIELD_TYPE_FAN) return;

  const auto options = parse_options_map(entity.entity_options);
  if (option_u32(options, "speed_count", 0) > 0)
    subscribe_route(fan_speed_command_topic_(mac, entity), CommandRouteKind::FAN_SPEED);
  if (option_is_true(options, "oscillation"))
    subscribe_route(fan_oscillation_command_topic_(mac, entity), CommandRouteKind::FAN_OSCILLATION);
  if (option_is_true(options, "direction"))
    subscribe_route(fan_direction_command_topic_(mac, entity), CommandRouteKind::FAN_DIRECTION);
}

void ESPTreeBridgeMQTT::handle_command_message_(const std::string &topic, const std::string &payload) {
  const auto route_it = command_routes_.find(topic);
  if (route_it == command_routes_.end()) return;
  const auto &route = route_it->second;
  if (bridge_ == nullptr) return;
  const BridgeSession *session = bridge_->get_session(route.leaf_mac.data());
  if (session == nullptr || route.entity_index >= session->schema_entities.size()) return;
  const BridgeEntitySchema &entity = session->schema_entities[route.entity_index];
  std::vector<uint8_t> value;
  std::vector<uint8_t> current_value;
  const std::string key = entity_record_key_(route.leaf_mac.data(), route.entity_index);
  const auto it = mqtt_entities_.find(key);
  if (it != mqtt_entities_.end()) {
    current_value = it->second.current_value;
  }
  if (!decode_command_payload_(entity, route.route_kind, payload, value, current_value)) return;
  bridge_->send_command(route.leaf_mac.data(), route.entity_index, value);
}

void ESPTreeBridgeMQTT::handle_force_rejoin_command_(const std::string &topic, const std::string &payload) {
  if (bridge_ == nullptr) return;
  std::string clean;
  for (char c : payload) {
    if (c != ':' && c != '-' && c != ' ') clean += c;
  }
  if (clean.size() != 12) return;
  uint8_t mac[6]{};
  unsigned values[6]{};
  if (sscanf(clean.c_str(), "%2x%2x%2x%2x%2x%2x",
             &values[0], &values[1], &values[2], &values[3], &values[4], &values[5]) != 6) {
    return;
  }
  for (size_t i = 0; i < 6; i++) mac[i] = static_cast<uint8_t>(values[i]);
  bridge_->send_force_rejoin(mac);
}

void ESPTreeBridgeMQTT::publish_bridge_diag_discovery_() {
  if (!is_connected() || bridge_diag_discovery_published_) return;
  const std::string bridge_mac = mac_hex(bridge_mac_.data());
  const std::string device_id = std::string("esp_tree_bridge_") + bridge_mac;

  auto publish_sensor = [&](const char *suffix, const char *name, const char *unit,
                            const char *device_class, const char *state_class, const char *icon, int suggested_precision = -1) -> bool {
    const std::string discovery_topic = mqtt_discovery_prefix_ + "/sensor/" + bridge_mac + "/" + suffix + "/config";
    return publish_json(discovery_topic,
                        [&](JsonObject root) {
                          root["name"] = name;
                          root["uniq_id"] = device_id + "_" + suffix;
                          root["stat_t"] = bridge_state_topic_(suffix);
                          root["ent_cat"] = "diagnostic";
                          if (unit != nullptr) root["unit_of_meas"] = unit;
                          if (device_class != nullptr) root["dev_cla"] = device_class;
                          if (state_class != nullptr) root["stat_cla"] = state_class;
                          if (icon != nullptr) root["ic"] = icon;
                          if (suggested_precision >= 0) root["suggested_display_precision"] = suggested_precision;
                          JsonObject device = root["device"].to<JsonObject>();
                          device["ids"] = device_id;
                          device["name"] = bridge_friendly_name_;
                          device["mf"] = "ESP-NOW LR";
                          device["mdl"] = "Bridge";
                        },
                        1, true);
  };

  auto publish_binary_sensor = [&](const char *suffix, const char *name, const char *icon) -> bool {
    const std::string discovery_topic = mqtt_discovery_prefix_ + "/binary_sensor/" + bridge_mac + "/" + suffix + "/config";
    return publish_json(discovery_topic,
                        [&](JsonObject root) {
                          root["name"] = name;
                          root["uniq_id"] = device_id + "_" + suffix;
                          root["stat_t"] = bridge_state_topic_(suffix);
                          root["ent_cat"] = "diagnostic";
                          root["pl_on"] = "ON";
                          root["pl_off"] = "OFF";
                          if (icon != nullptr) root["ic"] = icon;
                          JsonObject device = root["device"].to<JsonObject>();
                          device["ids"] = device_id;
                          device["name"] = bridge_friendly_name_;
                          device["mf"] = "ESP-NOW LR";
                          device["mdl"] = "Bridge";
                        },
                        1, true);
  };

  const bool base_ok = publish_sensor("wifi_signal", "WiFi Signal", "dBm", "signal_strength", "measurement", "mdi:wifi") &&
                        publish_sensor("uptime", "Uptime", "s", "duration", "measurement", "mdi:timer-outline", 0) &&
                        publish_sensor("remotes_online", "Remotes Online", "remotes", nullptr, "measurement", "mdi:tree") &&
                        publish_sensor("remotes_direct", "Remotes Direct", "remotes", nullptr, "measurement", "mdi:account-group") &&
                        publish_sensor("wifi_channel", "WiFi Channel", nullptr, nullptr, "measurement", "mdi:wifi", 0) &&
                        publish_sensor("mac_address", "MAC Address", nullptr, nullptr, nullptr, "mdi:identifier");
  publish_sensor("topology_url", "IP Address", nullptr, nullptr, nullptr, "mdi:ip");
  const bool ram_ok = publish_sensor("ram_usage", "RAM Usage", nullptr, nullptr, "measurement", "mdi:memory", 1);
#if CONFIG_ESP32_ESP_IDF_FRAMEWORK && configUSE_TRACE_FACILITY
  const bool cpu_ok = publish_sensor("cpu_load", "CPU Load", "%", nullptr, "measurement", "mdi:cpu-64-bit", 1);
  (void)cpu_ok;
#endif
  (void)ram_ok;
  if (base_ok) bridge_diag_discovery_published_ = true;
}

void ESPTreeBridgeMQTT::publish_bridge_diag_state_() {
  if (!is_connected() || !bridge_diag_discovery_published_) return;
  int8_t wifi_rssi = cached_bridge_rssi_;
  const uint32_t uptime_s = cached_uptime_s_;
  const uint32_t remotes_online = cached_remotes_online_;
  const uint32_t remotes_direct = cached_remotes_direct_;

  publish(bridge_state_topic_("wifi_signal"), std::to_string(wifi_rssi), 1);
  delay(YIELD_MS);
  if (tick_budget_exceeded_()) return;
  publish(bridge_state_topic_("mac_address"), mac_display(bridge_mac_.data()), 1);
  delay(YIELD_MS);
  if (tick_budget_exceeded_()) return;
  publish(bridge_state_topic_("uptime"), std::to_string(uptime_s), 1);
  delay(YIELD_MS);
  if (tick_budget_exceeded_()) return;
  publish(bridge_state_topic_("remotes_online"), std::to_string(remotes_online), 1);
  delay(YIELD_MS);
  if (tick_budget_exceeded_()) return;
  publish(bridge_state_topic_("remotes_direct"), std::to_string(remotes_direct), 1);
  delay(YIELD_MS);
  if (tick_budget_exceeded_()) return;
  if (cached_ram_pct_ >= 0) {
    publish(bridge_state_topic_("ram_usage"), std::to_string(cached_ram_pct_), 1);
    delay(YIELD_MS);
  }
  if (tick_budget_exceeded_()) return;
  publish(bridge_state_topic_("wifi_channel"), std::to_string(cached_wifi_channel_), 1);
  delay(YIELD_MS);
  if (tick_budget_exceeded_()) return;
#if CONFIG_ESP32_ESP_IDF_FRAMEWORK && configUSE_TRACE_FACILITY
  if (cached_cpu_pct_ >= 0) {
    publish(bridge_state_topic_("cpu_load"), std::to_string(cached_cpu_pct_), 1);
    delay(YIELD_MS);
  }
  if (tick_budget_exceeded_()) return;
#endif
  (void)remotes_online;
  (void)remotes_direct;
}

void ESPTreeBridgeMQTT::publish_remote_diag_discovery_(const uint8_t *mac) {
  if (!is_connected() || mac == nullptr) return;
  const std::string node_key = node_key_(mac);
  if (remote_diag_discovery_published_.count(node_key)) return;
  if (bridge_ == nullptr) return;

  const std::string device_id = std::string("esp_tree_") + node_key;
  auto dev_it = mqtt_devices_.find(node_key);
  const std::string display_name = (dev_it != mqtt_devices_.end()) ? dev_it->second.display_name : node_key;

  bool ok = true;
  auto publish_sensor = [&](const char *suffix, const char *name, const char *unit,
                            const char *device_class, const char *icon) -> bool {
    const std::string discovery_topic = mqtt_discovery_prefix_ + "/sensor/" + node_key + "/diagnostic_" + suffix + "/config";
    return publish_json(discovery_topic, [&](JsonObject root) {
      root["name"] = name;
      root["uniq_id"] = device_id + "_diagnostic_" + suffix;
      root["stat_t"] = remote_diag_state_topic_(mac, suffix);
      root["avty_t"] = availability_topic_(mac);
      root["pl_avail"] = "online";
      root["pl_not_avail"] = "offline";
      root["ent_cat"] = "diagnostic";
      if (unit != nullptr) root["unit_of_meas"] = unit;
      if (device_class != nullptr) root["dev_cla"] = device_class;
      if (icon != nullptr) root["ic"] = icon;
      JsonObject device = root["device"].to<JsonObject>();
      device["ids"] = device_id;
      device["name"] = display_name;
      device["mf"] = "ESP-NOW LR";
      device["mdl"] = "Remote";
      device["sw"] = std::to_string(ESPNOW_PROTOCOL_VER);
    }, 1, true);
  };

  ok = publish_sensor("uptime_since_join", "Uptime Since Join", "s", "duration", "mdi:timer-outline") &&
       publish_sensor("last_seen", "Last Seen (seconds ago)", "s", nullptr, "mdi:eye") &&
       publish_sensor("rssi_dbm", "RSSI", "dBm", "signal_strength", "mdi:wifi") &&
       publish_sensor("rssi_pct", "RSSI (percent)", "%", nullptr, "mdi:signal") &&
       publish_sensor("tx_packets", "TX Packets", "packets", nullptr, "mdi:arrow-up-bold") &&
       publish_sensor("rx_packets", "RX Packets", "packets", nullptr, "mdi:arrow-down-bold") &&
       publish_sensor("hops_to_bridge", "Hops to Bridge", "hops", nullptr, "mdi:swap-horizontal-bold") &&
       publish_sensor("chip_type", "Chip Type", nullptr, nullptr, "mdi:chip") &&
       publish_sensor("child_remotes_direct", "Direct Child Remotes", "remotes", nullptr, "mdi:account-group") &&
       publish_sensor("child_remotes_total", "Total Child Remotes", "remotes", nullptr, "mdi:family-tree") &&
       publish_sensor("esphome_name", "ESPHome Name", nullptr, nullptr, "mdi:identifier") &&
       publish_sensor("project_name", "Project Name", nullptr, nullptr, "mdi:code-tags") &&
       publish_sensor("project_version", "Project Version", nullptr, nullptr, "mdi:tag-outline") &&
       publish_sensor("mac_address", "MAC Address", nullptr, nullptr, "mdi:identifier");

  if (ok) remote_diag_discovery_published_.insert(node_key);
}

void ESPTreeBridgeMQTT::publish_remote_diag_state_(const uint8_t *mac) {
  if (!is_connected() || mac == nullptr || bridge_ == nullptr) return;
  const BridgeSession *session = bridge_->get_session(mac);
  if (session == nullptr) return;
  const uint32_t uptime_s = session->joined_ms != 0 ? (millis() - session->joined_ms) / 1000U : 0;
  const int8_t rssi = session->last_rssi;
  const int rssi_pct = rssi <= -100 ? 0 : (rssi >= -60 ? 100 : (rssi + 100) * 5 / 2);

  publish(remote_diag_state_topic_(mac, "uptime_since_join"), std::to_string(uptime_s), 1);
  delay(YIELD_MS);
  const uint32_t last_seen_s = session->last_seen_bridge_uptime_s != 0 ? (millis() / 1000) - session->last_seen_bridge_uptime_s : 0;
  publish(remote_diag_state_topic_(mac, "last_seen"), std::to_string(last_seen_s), 1);
  delay(YIELD_MS);
  publish(remote_diag_state_topic_(mac, "rssi_dbm"), std::to_string(rssi), 1);
  delay(YIELD_MS);
  publish(remote_diag_state_topic_(mac, "rssi_pct"), std::to_string(rssi_pct), 1);
  delay(YIELD_MS);
  publish(remote_diag_state_topic_(mac, "tx_packets"), std::to_string(session->tx_packets), 1);
  delay(YIELD_MS);
  publish(remote_diag_state_topic_(mac, "rx_packets"), std::to_string(session->rx_packets), 1);
  delay(YIELD_MS);
  publish(remote_diag_state_topic_(mac, "hops_to_bridge"), std::to_string(session->hops_to_bridge), 1);
  delay(YIELD_MS);
  publish(remote_diag_state_topic_(mac, "chip_type"), chip_model_string(session->chip_model), 1);
  delay(YIELD_MS);
  publish(remote_diag_state_topic_(mac, "esphome_name"), session->esphome_name, 1);
  delay(YIELD_MS);
  publish(remote_diag_state_topic_(mac, "child_remotes_direct"), std::to_string(session->direct_child_count), 1);
  delay(YIELD_MS);
  publish(remote_diag_state_topic_(mac, "child_remotes_total"), std::to_string(session->total_child_count), 1);
  delay(YIELD_MS);
  publish(remote_diag_state_topic_(mac, "project_name"), session->project_name, 1);
  delay(YIELD_MS);
  publish(remote_diag_state_topic_(mac, "project_version"), session->project_version, 1);
}

void ESPTreeBridgeMQTT::queue_remote_diag_refresh_(const uint8_t *mac) {
  if (mac == nullptr) return;
  const std::string key = mac_hex(mac);
  remote_diag_refresh_pending_.insert(key);
  first_remote_diag_publish_pending_.insert(key);
}

void ESPTreeBridgeMQTT::publish_remote_diag_state_cached_(const uint8_t *mac, const std::string &node_key) {
  if (!is_connected() || mac == nullptr || bridge_ == nullptr) return;
  const BridgeSession *session = bridge_->get_session(mac);
  if (session == nullptr) return;

  const uint32_t now = millis();
  const uint32_t uptime_s = session->joined_ms != 0 ? (now - session->joined_ms) / 1000U : 0;
  const int8_t rssi = session->last_rssi;
  const int rssi_pct = rssi <= -100 ? 0 : (rssi >= -60 ? 100 : (rssi + 100) * 5 / 2);
  const uint32_t last_seen_s = session->last_seen_bridge_uptime_s != 0 ? (now / 1000) - session->last_seen_bridge_uptime_s : 0;

  RemoteDiagCache cache;
  auto cache_it = remote_diag_cache_.find(node_key);
  if (cache_it != remote_diag_cache_.end()) {
    cache = cache_it->second;
  }

  bool first_publish = first_remote_diag_publish_pending_.count(node_key) > 0;

  if (!first_publish &&
      rssi == cache.rssi_ && session->tx_packets == cache.tx_packets && session->rx_packets == cache.rx_packets &&
      session->hops_to_bridge == cache.hops && session->direct_child_count == cache.direct_children &&
      session->total_child_count == cache.total_children && session->chip_model == cache.chip_model &&
      session->firmware_epoch == cache.firmware_epoch &&
      session->esphome_name == cache.esphome_name &&
      session->project_name == cache.project_name && session->project_version == cache.project_version) {
    publish(remote_diag_state_topic_(mac, "last_seen"), std::to_string(last_seen_s), 1);
    return;
  }

  publish(remote_diag_state_topic_(mac, "uptime_since_join"), std::to_string(uptime_s), 1);
  delay(YIELD_MS);
  if (tick_budget_exceeded_()) return;
  publish(remote_diag_state_topic_(mac, "mac_address"), mac_display(mac), 1);
  delay(YIELD_MS);
  if (tick_budget_exceeded_()) return;
  publish(remote_diag_state_topic_(mac, "last_seen"), std::to_string(last_seen_s), 1);
  delay(YIELD_MS);
  if (tick_budget_exceeded_()) return;
  publish(remote_diag_state_topic_(mac, "rssi_dbm"), std::to_string(rssi), 1);
  delay(YIELD_MS);
  if (tick_budget_exceeded_()) return;
  publish(remote_diag_state_topic_(mac, "rssi_pct"), std::to_string(rssi_pct), 1);
  delay(YIELD_MS);
  if (tick_budget_exceeded_()) return;
  publish(remote_diag_state_topic_(mac, "tx_packets"), std::to_string(session->tx_packets), 1);
  delay(YIELD_MS);
  if (tick_budget_exceeded_()) return;
  publish(remote_diag_state_topic_(mac, "rx_packets"), std::to_string(session->rx_packets), 1);
  delay(YIELD_MS);
  if (tick_budget_exceeded_()) return;
  publish(remote_diag_state_topic_(mac, "hops_to_bridge"), std::to_string(session->hops_to_bridge), 1);
  delay(YIELD_MS);
  if (tick_budget_exceeded_()) return;
  publish(remote_diag_state_topic_(mac, "chip_type"), chip_model_string(session->chip_model), 1);
  delay(YIELD_MS);
  if (tick_budget_exceeded_()) return;
  publish(remote_diag_state_topic_(mac, "esphome_name"), session->esphome_name, 1);
  delay(YIELD_MS);
  if (tick_budget_exceeded_()) return;
  publish(remote_diag_state_topic_(mac, "child_remotes_direct"), std::to_string(session->direct_child_count), 1);
  delay(YIELD_MS);
  if (tick_budget_exceeded_()) return;
  publish(remote_diag_state_topic_(mac, "child_remotes_total"), std::to_string(session->total_child_count), 1);
  delay(YIELD_MS);
  if (tick_budget_exceeded_()) return;

  if (session->project_name != cache.project_name) {
    publish(remote_diag_state_topic_(mac, "project_name"), session->project_name, 1);
    delay(YIELD_MS);
    if (tick_budget_exceeded_()) return;
  }
  if (session->project_version != cache.project_version) {
    publish(remote_diag_state_topic_(mac, "project_version"), session->project_version, 1);
    delay(YIELD_MS);
  }

  RemoteDiagCache new_cache;
  new_cache.rssi_ = rssi;
  new_cache.tx_packets = session->tx_packets;
  new_cache.rx_packets = session->rx_packets;
  new_cache.hops = session->hops_to_bridge;
  new_cache.direct_children = session->direct_child_count;
  new_cache.total_children = session->total_child_count;
  new_cache.chip_model = session->chip_model;
  new_cache.firmware_epoch = session->firmware_epoch;
  new_cache.esphome_name = session->esphome_name;
  new_cache.project_name = session->project_name;
  new_cache.project_version = session->project_version;
  new_cache.last_publish_ms = now;
  remote_diag_cache_[node_key] = new_cache;
  first_remote_diag_publish_pending_.erase(node_key);
}

void ESPTreeBridgeMQTT::check_diag_publish_rr_() {
  const uint32_t now = millis();
  const size_t total = 1 + remote_diag_discovery_published_.size();
  if (total == 0) return;

  if (now - diag_last_any_publish_ms_ < DIAG_SPACING_MS) return;

  diag_rr_index_ = (diag_rr_index_ + 1) % total;

  if (diag_rr_index_ == 0) {
    if (now - last_published_bridge_diag_ms_ >= DIAG_MIN_INTERVAL_MS) {
      publish_bridge_diag_state_();
      last_published_bridge_diag_ms_ = now;
      diag_last_any_publish_ms_ = now;
    }
  } else {
    auto it = remote_diag_discovery_published_.begin();
    std::advance(it, diag_rr_index_ - 1);
    const std::string &node_key = *it;

    auto last_it = remote_diag_last_publish_ms_.find(node_key);
    uint32_t last_ms = (last_it != remote_diag_last_publish_ms_.end()) ? last_it->second : 0;

    if (now - last_ms >= DIAG_MIN_INTERVAL_MS) {
      if (bridge_ != nullptr) {
        uint8_t mac[6]{};
        bool found = bridge_->get_remote_mac_by_node_key(node_key, mac);
        if (found) {
          publish_remote_diag_state_cached_(mac, node_key);
          remote_diag_last_publish_ms_[node_key] = now;
          diag_last_any_publish_ms_ = now;
        }
      }
    }
  }
}

void ESPTreeBridgeMQTT::publish_force_rejoin_button_discovery_() {
  if (!is_connected() || force_rejoin_button_discovery_published_) return;
  const std::string bridge_mac = mac_hex(bridge_mac_.data());
  const std::string device_id = std::string("esp_tree_bridge_") + bridge_mac;

  const std::string discovery_topic = mqtt_discovery_prefix_ + "/button/" + bridge_mac + "/force_rejoin/config";
  const bool ok = publish_json(discovery_topic, [&](JsonObject root) {
    root["name"] = "Force Rejoin";
    root["uniq_id"] = device_id + "_force_rejoin";
    root["cmd_t"] = force_rejoin_command_topic_;
    root["ent_cat"] = "diagnostic";
    root["ic"] = "mdi:restart";
    root["pl_prs"] = "PRESS";
    JsonObject device = root["device"].to<JsonObject>();
    device["ids"] = device_id;
    device["name"] = bridge_friendly_name_;
    device["mf"] = "ESP-NOW LR";
    device["mdl"] = "Bridge";
  }, 1, true);

  if (ok) force_rejoin_button_discovery_published_ = true;
}

void ESPTreeBridgeMQTT::queue_discovery(const uint8_t *mac, const BridgeEntitySchema &entity,
                                          uint8_t total_entities, bool is_commandable,
                                          const std::string &display_name) {
  const std::string key = entity_record_key_(mac, entity.entity_index);
  auto &rec = mqtt_entities_[key];
  memcpy(rec.leaf_mac.data(), mac, 6);
  rec.node_id = node_key_(mac);
  rec.schema = entity;
  rec.total_entities = total_entities;
  rec.discovery_published = false;
  rec.first_state_publish_pending = false;
  rec.discovery_published_ms = 0;
  rec.current_type = static_cast<espnow_field_type_t>(entity.entity_type);
  rec.command_subscribed = is_commandable;

  const std::string dev_key = node_key_(mac);
  auto &dev = mqtt_devices_[dev_key];
  if (dev.node_id.empty()) {
    memcpy(dev.leaf_mac.data(), mac, 6);
    dev.node_id = dev_key;
    dev.device_id = std::string("esp_tree_") + dev_key;
    dev.display_name = display_name;
  }
  dev.entities[entity.entity_index] = entity;
  dev.total_entities = total_entities;
  dev.schema_complete = false;
  dev.discovery_dirty = true;
  dev.discovery_published = false;
}

void ESPTreeBridgeMQTT::queue_state(const uint8_t *mac, const BridgeEntitySchema &entity,
                                      const std::vector<uint8_t> &value, espnow_field_type_t type,
                                      const std::string &text_value, uint32_t message_tx_base,
                                      const uint8_t *next_hop_mac, const std::string &display_name) {
  const std::string key = entity_record_key_(mac, entity.entity_index);
  auto &rec = mqtt_entities_[key];
  memcpy(rec.leaf_mac.data(), mac, 6);
  if (rec.schema.entity_type == 0) rec.schema = entity;
  rec.current_value = value;
  rec.current_type = type;
  rec.text_value = text_value;
  rec.state_dirty = true;
  if (!rec.discovery_published) {
    rec.first_state_publish_pending = true;
    ESP_LOGW(TAG, "STATE for entity %u queued before discovery publish completed", entity.entity_index);
  }
  if (next_hop_mac != nullptr) {
    rec.pending_state_ack_ = true;
    rec.pending_ack_message_tx_base_ = message_tx_base;
    rec.pending_ack_entity_index_ = entity.entity_index;
    rec.pending_ack_queued_ms_ = millis();
    memcpy(rec.ack_next_hop_mac_.data(), next_hop_mac, 6);
  }

  // Update device display name if available
  const std::string dev_key = node_key_(mac);
  auto dev_it = mqtt_devices_.find(dev_key);
  if (dev_it != mqtt_devices_.end() && dev_it->second.display_name.empty() && !display_name.empty()) {
    dev_it->second.display_name = display_name;
  }
  (void)display_name;
}

void ESPTreeBridgeMQTT::queue_availability(const uint8_t *mac, bool online, const char *reason) {
  std::array<uint8_t, 6> key{};
  memcpy(key.data(), mac, key.size());
  availability_queue_.push_back({key, online, reason});
  if (online) {
    queue_remote_diag_refresh_(mac);
  } else {
    remote_diag_refresh_pending_.erase(mac_hex(mac));
  }
}

void ESPTreeBridgeMQTT::queue_clear_entities(const uint8_t *mac,
                                               const std::vector<BridgeEntitySchema> &old_entities) {
  for (const auto &entity : old_entities) {
    const std::string key = entity_record_key_(mac, entity.entity_index);
    auto it = mqtt_entities_.find(key);
    if (it != mqtt_entities_.end()) {
      do_clear_entity_(mac, entity);
      mqtt_entities_.erase(it);
    }
  }

  const std::string nk = node_key_(mac);
  auto dev_it = mqtt_devices_.find(nk);
  if (dev_it != mqtt_devices_.end()) {
    for (const auto &entity : old_entities) {
      dev_it->second.entities.erase(entity.entity_index);
    }
    if (dev_it->second.entities.empty()) {
      do_clear_device_discovery_(mac);
    } else {
      dev_it->second.discovery_dirty = true;
      dev_it->second.discovery_published = false;
    }
  }
}

void ESPTreeBridgeMQTT::on_schema_complete(const uint8_t *mac, uint8_t total_entities) {
  const std::string nk = node_key_(mac);
  auto it = mqtt_devices_.find(nk);
  if (it != mqtt_devices_.end()) {
    it->second.schema_complete = true;
    it->second.discovery_dirty = true;
    it->second.discovery_published = false;
  }
  queue_remote_diag_refresh_(mac);
  delayed_diag_refresh_pending_[mac_hex(mac)] = millis() + DIAG_DELAYED_REFRESH_DELAY_MS;
  (void)total_entities;
}

void ESPTreeBridgeMQTT::on_discovery_confirmed(const uint8_t *mac, uint8_t entity_index, bool success) {
  if (bridge_ != nullptr) {
    bridge_->protocol_discovery_confirmed(mac, entity_index, success);
  }
}

void ESPTreeBridgeMQTT::set_bridge_diag(uint32_t uptime_s, uint8_t remotes_online, int8_t rssi,
                                          uint8_t wifi_channel, int ram_pct, int cpu_pct,
                                          uint8_t remotes_direct) {
  cached_uptime_s_ = uptime_s;
  cached_remotes_online_ = remotes_online;
  cached_bridge_rssi_ = rssi;
  cached_wifi_channel_ = wifi_channel;
  cached_ram_pct_ = ram_pct;
  cached_cpu_pct_ = cpu_pct;
  cached_remotes_direct_ = remotes_direct;
}

void ESPTreeBridgeMQTT::queue_remote_diag_refresh(const uint8_t *mac) {
  queue_remote_diag_refresh_(mac);
}

void ESPTreeBridgeMQTT::tick() {
  tick_enter_ms_ = millis();
  if (!is_connected()) {
    mqtt_was_connected_ = false;
    return;
  }

  if (mqtt_backoff_until_ms_ != 0 && millis() < mqtt_backoff_until_ms_) {
    return;
  }
  if (mqtt_backoff_until_ms_ != 0 && millis() >= mqtt_backoff_until_ms_) {
    mqtt_backoff_until_ms_ = 0;
  }

  const bool just_connected = is_connected() && !mqtt_was_connected_;
  if (just_connected) {
    mqtt_retry_count_ = 0;
    mqtt_backoff_until_ms_ = 0;
    for (auto &pair : mqtt_devices_) {
      pair.second.discovery_dirty = true;
      pair.second.discovery_published = false;
      pair.second.schema_complete = true;
    }
    for (auto &pair : mqtt_entities_) {
      pair.second.discovery_published = false;
      pair.second.state_dirty = true;
    }
    bridge_diag_discovery_published_ = false;
    remote_diag_discovery_published_.clear();
    remote_diag_refresh_pending_.clear();
    first_remote_diag_publish_pending_.clear();
    delayed_diag_refresh_pending_.clear();
    if (bridge_ != nullptr) {
      auto online_macs = bridge_->get_online_macs();
      for (const auto &mac : online_macs) {
        queue_remote_diag_refresh_(mac.data());
      }
    }
  }
  mqtt_was_connected_ = is_connected();

  if (!bridge_diag_discovery_published_) {
    publish_force_rejoin_button_discovery_();
    if (tick_budget_exceeded_()) return;
    publish_bridge_diag_discovery_();
    if (tick_budget_exceeded_()) return;
  }

  if (!availability_queue_.empty()) {
    auto front = availability_queue_.front();
    availability_queue_.pop_front();
    publish(availability_topic_(front.mac.data()), front.online ? "online" : "offline", 1);
    delay(YIELD_MS);
    return;
  }

  for (auto it = delayed_diag_refresh_pending_.begin(); it != delayed_diag_refresh_pending_.end(); ) {
    if (tick_budget_exceeded_()) break;
    if (millis() >= it->second) {
      uint8_t mac[6]{};
      for (int i = 0; i < 6; i++) {
        unsigned int byte = 0;
        sscanf(it->first.c_str() + i * 2, "%02x", &byte);
        mac[i] = static_cast<uint8_t>(byte);
      }
      const std::string node_key = node_key_(mac);
      if (remote_diag_discovery_published_.count(node_key)) {
        publish_remote_diag_state_cached_(mac, node_key);
        first_remote_diag_publish_pending_.erase(node_key);
      }
      delayed_diag_refresh_pending_.erase(it++);
    } else {
      ++it;
    }
  }

  for (auto it = remote_diag_refresh_pending_.begin(); it != remote_diag_refresh_pending_.end(); ++it) {
    if (bridge_ == nullptr) continue;
    uint8_t mac[6]{};
    for (int i = 0; i < 6; i++) {
      unsigned int byte = 0;
      sscanf(it->c_str() + i * 2, "%02x", &byte);
      mac[i] = static_cast<uint8_t>(byte);
    }
    const BridgeSession *session = bridge_->get_session(mac);
    if (session == nullptr || !session->online) {
      continue;
    }
    if (!remote_diag_discovery_published_.count(node_key_(mac))) {
      publish_remote_diag_discovery_(mac);
      return;
    }
    publish_remote_diag_state_(mac);
    std::string key_copy = *it;
    remote_diag_refresh_pending_.erase(it);
    first_remote_diag_publish_pending_.erase(key_copy);
    return;
  }

  for (auto &pair : mqtt_devices_) {
    if (pair.second.discovery_dirty) {
      publish_device_discovery_(pair.second.leaf_mac.data());
      break;
    }
  }

  int states_processed = 0;
  for (auto &pair : mqtt_entities_) {
    if (tick_budget_exceeded_()) break;
    auto &rec = pair.second;
    const std::string dev_key = rec.node_id;
    bool dev_published = false;
    auto dev_it = mqtt_devices_.find(dev_key);
    if (dev_it != mqtt_devices_.end()) {
      dev_published = dev_it->second.discovery_published;
    }
    if (!rec.discovery_published && dev_published) {
      do_publish_discovery_(rec);
      break;
    }
    if (rec.state_dirty && rec.discovery_published) {
      if (rec.first_state_publish_pending) {
        const uint32_t now = millis();
        if (now - rec.discovery_published_ms < FIRST_STATE_PUBLISH_GRACE_MS) {
          continue;
        }
        rec.first_state_publish_pending = false;
      }
      do_publish_state_(rec);
      if (++states_processed >= 2) {
        break;
      }
    }
  }

  if (millis() >= next_diag_check_ms_) {
    check_diag_publish_rr_();
    next_diag_check_ms_ = millis() + DIAG_CHECK_INTERVAL_MS + (uint32_t)(esp_random() % (2 * DIAG_JITTER_MS)) - DIAG_JITTER_MS;
  }
}

std::string ESPTreeBridgeMQTT::node_key_(const uint8_t *mac) const {
  if (bridge_ != nullptr) {
    return bridge_->node_key(mac);
  }
  return mac_hex(mac);
}

std::string ESPTreeBridgeMQTT::entity_object_id_(const uint8_t *mac, const BridgeEntitySchema &entity) const {
  std::string base;
  if (!entity.entity_id.empty()) {
    base = slugify_name(entity.entity_id);
  } else {
    base = slugify_name(entity.entity_name);
  }
  if (base.empty()) base = "entity";
  if (bridge_ != nullptr) {
    const BridgeSession *session = bridge_->get_session(mac);
    if (session != nullptr && entity.entity_index < session->schema_entities.size()) {
      if (!entity.entity_id.empty()) {
        return base;
      }
      unsigned duplicate_index = 0;
      for (size_t i = 0; i <= entity.entity_index && i < session->schema_entities.size(); i++) {
        const auto &candidate = session->schema_entities[i];
        if (candidate.entity_type == 0) continue;
        if (slugify_name(candidate.entity_name) == base) duplicate_index++;
      }
      if (duplicate_index > 1) base += "_" + std::to_string(duplicate_index);
    }
  }
  return base;
}

std::string ESPTreeBridgeMQTT::default_entity_id_(const uint8_t *mac, const BridgeEntitySchema &entity) const {
  const std::string component = entity_component_(static_cast<espnow_field_type_t>(entity.entity_type));
  std::string slug = slugify_name(entity.entity_name);
  if (slug.empty()) slug = entity_object_id_(mac, entity);
  return component + "." + slug;
}

std::string ESPTreeBridgeMQTT::entity_component_(espnow_field_type_t type) const {
  return component_for_type(type);
}

std::string ESPTreeBridgeMQTT::availability_topic_(const uint8_t *mac) const {
  return "esp-tree/" + node_key_(mac) + "/availability";
}

std::string ESPTreeBridgeMQTT::state_topic_(const uint8_t *mac, const BridgeEntitySchema &entity) const {
  return "esp-tree/" + node_key_(mac) + "/" + entity_object_id_(mac, entity) + "/state";
}

std::string ESPTreeBridgeMQTT::command_topic_(const uint8_t *mac, const BridgeEntitySchema &entity) const {
  return "esp-tree/" + node_key_(mac) + "/" + entity_object_id_(mac, entity) + "/set";
}

std::string ESPTreeBridgeMQTT::fan_speed_state_topic_(const uint8_t *mac, const BridgeEntitySchema &entity) const {
  return "esp-tree/" + node_key_(mac) + "/" + entity_object_id_(mac, entity) + "/percentage_state";
}

std::string ESPTreeBridgeMQTT::fan_speed_command_topic_(const uint8_t *mac, const BridgeEntitySchema &entity) const {
  return "esp-tree/" + node_key_(mac) + "/" + entity_object_id_(mac, entity) + "/percentage_set";
}

std::string ESPTreeBridgeMQTT::fan_oscillation_state_topic_(const uint8_t *mac, const BridgeEntitySchema &entity) const {
  return "esp-tree/" + node_key_(mac) + "/" + entity_object_id_(mac, entity) + "/oscillation_state";
}

std::string ESPTreeBridgeMQTT::fan_oscillation_command_topic_(const uint8_t *mac, const BridgeEntitySchema &entity) const {
  return "esp-tree/" + node_key_(mac) + "/" + entity_object_id_(mac, entity) + "/oscillation_set";
}

std::string ESPTreeBridgeMQTT::fan_direction_state_topic_(const uint8_t *mac, const BridgeEntitySchema &entity) const {
  return "esp-tree/" + node_key_(mac) + "/" + entity_object_id_(mac, entity) + "/direction_state";
}

std::string ESPTreeBridgeMQTT::fan_direction_command_topic_(const uint8_t *mac, const BridgeEntitySchema &entity) const {
  return "esp-tree/" + node_key_(mac) + "/" + entity_object_id_(mac, entity) + "/direction_set";
}

std::string ESPTreeBridgeMQTT::unique_id_(const uint8_t *mac, const BridgeEntitySchema &entity) const {
  return "esp_tree_" + node_key_(mac) + "_" + entity_object_id_(mac, entity);
}

std::string ESPTreeBridgeMQTT::bridge_state_topic_(const char *suffix) const {
  return "esp-tree/bridge/" + mac_hex(bridge_mac_.data()) + "/" + suffix + "/state";
}

std::string ESPTreeBridgeMQTT::remote_diag_state_topic_(const uint8_t *mac, const char *suffix) const {
  return "esp-tree/" + node_key_(mac) + "/diagnostic/" + suffix + "/state";
}

std::string ESPTreeBridgeMQTT::encode_state_payload_(const BridgeEntitySchema &entity,
                                                      const std::vector<uint8_t> &value,
                                                      espnow_field_type_t type) const {
  switch (type) {
    case FIELD_TYPE_SENSOR:
    case FIELD_TYPE_NUMBER: {
      if (value.size() < sizeof(float)) return {};
      char buffer[32];
      snprintf(buffer, sizeof(buffer), "%g", decode_float(value.data(), value.size()));
      return buffer;
    }
    case FIELD_TYPE_SWITCH:
    case FIELD_TYPE_BINARY:
      return (!value.empty() && value[0]) ? "ON" : "OFF";
    case FIELD_TYPE_TEXT:
    case FIELD_TYPE_TEXT_SENSOR:
      return std::string(reinterpret_cast<const char *>(value.data()), value.size());
    case FIELD_TYPE_COVER:
    case FIELD_TYPE_VALVE:
      return std::to_string(!value.empty() ? value[0] : 0);
    case FIELD_TYPE_FAN:
      return (!value.empty() && value[0]) ? "ON" : "OFF";
    case FIELD_TYPE_LIGHT:
      return (!value.empty() && value[0]) ? "ON" : "OFF";
    case FIELD_TYPE_LOCK:
      return !value.empty() && value[0] == 1 ? "LOCKED" : (!value.empty() && value[0] == 2 ? "JAMMED" : "UNLOCKED");
    case FIELD_TYPE_SELECT:
      if (!entity.entity_options.empty()) {
        auto options = option_list(parse_options_map(entity.entity_options), "options");
        if (options.empty()) options = split_string(entity.entity_options, '|');
        if (!value.empty() && value[0] < options.size()) return options[value[0]];
      }
      return std::to_string(!value.empty() ? value[0] : 0);
    case FIELD_TYPE_ALARM:
      switch (!value.empty() ? value[0] : 0) {
        case 1: return "armed_home";
        case 2: return "armed_away";
        case 3: return "armed_night";
        case 4: return "armed_vacation";
        case 5: return "armed_custom_bypass";
        case 6: return "triggered";
        case 7: return "pending";
        case 8: return "arming";
        case 9: return "disarming";
        default: return "disarmed";
      }
    case FIELD_TYPE_BUTTON:
      return "press";
    case FIELD_TYPE_EVENT:
      return std::string(reinterpret_cast<const char *>(value.data()), value.size());
    default:
      return {};
  }
}

bool ESPTreeBridgeMQTT::decode_command_payload_(const BridgeEntitySchema &entity, CommandRouteKind route_kind,
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
      if (payload == "OPEN") {
        value[0] = 1; value[1] = 100;
      } else if (payload == "CLOSE") {
        value[0] = 2; value[1] = 0;
      } else if (payload == "STOP") {
        value[0] = 3; value[1] = 0;
      } else {
        value[0] = 0;
        value[1] = static_cast<uint8_t>(std::max(0, std::min(100, atoi(payload.c_str()))));
      }
      return true;
    case FIELD_TYPE_LOCK:
      value = {static_cast<uint8_t>((payload == "LOCK" || payload == "LOCKED") ? 1 : 0)};
      return true;
    case FIELD_TYPE_SELECT:
      value.resize(1);
      if (!entity.entity_options.empty()) {
        const auto parsed_options = parse_options_map(entity.entity_options);
        auto options = option_list(parsed_options, "options");
        if (options.empty()) options = split_string(entity.entity_options, '|');
        for (size_t i = 0; i < options.size(); i++) {
          if (options[i] == payload) {
            value[0] = static_cast<uint8_t>(i);
            return true;
          }
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
        if (current_value.size() >= 4) {
          memcpy(value.data(), current_value.data(), 4);
        }
        return json::parse_json(payload, [&value, speed_count, &options](JsonObject root) -> bool {
          bool ok = false;
          if (root["state"].is<const char *>()) {
            value[0] = parse_on(root["state"].as<std::string>()) ? 1 : 0;
            ok = true;
          }
          if (root["speed_level"].is<int>()) {
            value[1] = static_cast<uint8_t>(root["speed_level"].as<int>());
            ok = true;
          }
          if (root["oscillating"].is<bool>()) {
            value[2] = root["oscillating"].as<bool>() ? 1 : 0;
            ok = true;
          }
          if (root["direction"].is<const char *>()) {
            std::string dir = root["direction"].as<std::string>();
            value[3] = (dir == "reverse" || dir == "REVERSE") ? 1 : 0;
            ok = true;
          }
          if (root["percentage"].is<int>()) {
            if (speed_count > 0) {
              int pct = root["percentage"].as<int>();
              value[1] = static_cast<uint8_t>((pct * speed_count + 50) / 100);
              ok = true;
            }
          }
          return ok;
        });
      }
      switch (route_kind) {
        case CommandRouteKind::PRIMARY: {
          value.resize(4);
          if (current_value.size() >= 4) {
            value[0] = parse_on(payload) ? 1 : 0;
            value[1] = current_value[1];
            value[2] = current_value[2];
            value[3] = current_value[3];
          } else {
            value.assign(4, 0);
            value[0] = parse_on(payload) ? 1 : 0;
          }
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
          if (current_value.size() >= 4) {
            value[0] = current_value[0];
            value[1] = static_cast<uint8_t>(level);
            value[2] = current_value[2];
            value[3] = current_value[3];
          } else {
            value.assign(4, 0);
            value[0] = (level > 0) ? 1 : 0;
            value[1] = static_cast<uint8_t>(level);
          }
          return true;
        }
        case CommandRouteKind::FAN_OSCILLATION: {
          bool osc_on = (payload == "oscillate_on" || payload == "ON" || payload == "on" || payload == "1");
          value.resize(4);
          if (current_value.size() >= 4) {
            value[0] = current_value[0];
            value[1] = current_value[1];
            value[2] = osc_on ? 1 : 0;
            value[3] = current_value[3];
          } else {
            value.assign(4, 0);
            value[2] = osc_on ? 1 : 0;
          }
          return true;
        }
        case CommandRouteKind::FAN_DIRECTION: {
          bool reverse = (payload == "reverse" || payload == "REVERSE");
          value.resize(4);
          if (current_value.size() >= 4) {
            value[0] = current_value[0];
            value[1] = current_value[1];
            value[2] = current_value[2];
            value[3] = reverse ? 1 : 0;
          } else {
            value.assign(4, 0);
            value[3] = reverse ? 1 : 0;
          }
          return true;
        }
      }
      return true;
    }
    case FIELD_TYPE_LIGHT:
      if (!payload.empty() && payload[0] == '{') {
        value.assign(9, 0);
        bool ok = false;
        bool has_state = false;
        bool has_non_state_update = false;
        const auto parsed_options = parse_options_map(entity.entity_options);
        const auto effects = option_list(parsed_options, "effects");
        return json::parse_json(payload, [&value, &ok, &effects, &has_state, &has_non_state_update](JsonObject root) -> bool {
          if (root["state"].is<const char *>()) {
            value[0] = parse_on(root["state"].as<std::string>()) ? 1 : 0;
            has_state = true;
            ok = true;
          }
          if (root["brightness"].is<int>()) {
            value[1] = static_cast<uint8_t>(std::max(0, std::min(255, root["brightness"].as<int>())));
            has_non_state_update = true;
            ok = true;
          }
          if (root["effect"].is<const char *>()) {
            const std::string effect = root["effect"].as<std::string>();
            for (size_t i = 0; i < effects.size(); i++) {
              if (effects[i] == effect) {
                value[4] = static_cast<uint8_t>(i);
                ok = true;
                break;
              }
            }
            if (effect == "None") {
              value[4] = 0;
              ok = true;
            }
            has_non_state_update = true;
            ok = true;
          }
          if (root["color"].is<JsonObject>()) {
            JsonObject color = root["color"].as<JsonObject>();
            const float r = static_cast<float>(color["r"] | 0) / 255.0f;
            const float g = static_cast<float>(color["g"] | 0) / 255.0f;
            const float b = static_cast<float>(color["b"] | 0) / 255.0f;
            const float max_v = std::max({r, g, b});
            const float min_v = std::min({r, g, b});
            const float delta = max_v - min_v;
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
            has_non_state_update = true;
            ok = true;
          }
          if (root["color_temp"].is<float>()) {
            const uint16_t ct = static_cast<uint16_t>(std::max(0.0f, std::min(65535.0f, root["color_temp"].as<float>())));
            value[6] = ct & 0xFF;
            value[7] = (ct >> 8) & 0xFF;
            has_non_state_update = true;
            ok = true;
          }
          if (root["white"].is<int>()) {
            value[8] = static_cast<uint8_t>(std::max(0, std::min(255, root["white"].as<int>())));
            has_non_state_update = true;
            ok = true;
          }
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

std::string ESPTreeBridgeMQTT::entity_record_key_(const uint8_t *mac, uint8_t entity_index) const {
  return node_key_(mac) + "_" + std::to_string(entity_index);
}

}  // namespace esp_tree
}  // namespace esphome

#endif  // USE_MQTT
