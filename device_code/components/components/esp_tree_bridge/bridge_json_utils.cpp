#include "bridge_json_utils.h"

#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstring>
#include <sstream>
#include <unordered_map>
#include <vector>

namespace esphome {
namespace esp_tree {
namespace bridge_api {

namespace {

static std::vector<std::string> split_string(const std::string &input, char sep) {
  std::vector<std::string> result;
  std::string current;
  for (char ch : input) {
    if (ch == sep) {
      result.push_back(std::move(current));
      current.clear();
    } else {
      current += ch;
    }
  }
  result.push_back(std::move(current));
  return result;
}

static std::vector<std::string> parse_select_options(const std::string &entity_options) {
  std::vector<std::string> fallback = split_string(entity_options, '|');
  for (const auto &part : split_string(entity_options, ';')) {
    auto eq = part.find('=');
    if (eq == std::string::npos) continue;
    std::string key = part.substr(0, eq);
    if (key == "options") {
      std::string val = part.substr(eq + 1);
      std::vector<std::string> opts = split_string(val, '|');
      if (!opts.empty()) return opts;
    }
  }
  return fallback;
}

static std::string quoted_json_string(const std::string &raw) {
  return "\"" + escape_json(raw) + "\"";
}

static std::unordered_map<std::string, std::string> parse_options_map(const std::string &entity_options) {
  std::unordered_map<std::string, std::string> map;
  for (const auto &part : split_string(entity_options, ';')) {
    auto eq = part.find('=');
    if (eq == std::string::npos) continue;
    map[part.substr(0, eq)] = part.substr(eq + 1);
  }
  return map;
}

static std::vector<std::string> option_list(
    const std::unordered_map<std::string, std::string> &opts, const std::string &key) {
  auto it = opts.find(key);
  if (it == opts.end()) return {};
  return split_string(it->second, '|');
}

static bool option_has_list_value(
    const std::unordered_map<std::string, std::string> &opts, const std::string &key, const std::string &value) {
  auto it = opts.find(key);
  if (it == opts.end()) return false;
  for (const auto &v : split_string(it->second, '|')) {
    if (v == value) return true;
  }
  return false;
}

static const char *color_mode_name_json(uint8_t cm) {
  switch (cm) {
    case 1:  return "onoff";
    case 3:  return "brightness";
    case 7:  return "white";
    case 11: return "color_temp";
    case 19: return "color_temp";
    case 35: return "rgb";
    case 39: return "rgbw";
    case 47: return "rgbw";
    case 51: return "rgbww";
    default: return "brightness";
  }
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

static std::string build_light_state_json(const uint8_t *value, size_t value_len,
                                           const std::string &entity_options) {
  if (value_len < 1) return "{}";
  const auto opts = parse_options_map(entity_options);
  std::ostringstream ss;
  ss << "{";
  ss << "\"state\":" << (value[0] ? "true" : "false");
  if (value_len > 5) {
    ss << ",\"color_mode\":\"" << color_mode_name_json(value[5]) << "\"";
  } else if (value_len > 3 &&
             (option_has_list_value(opts, "color_modes", "rgb") ||
              option_has_list_value(opts, "color_modes", "rgbw") ||
              option_has_list_value(opts, "color_modes", "rgbww"))) {
    ss << ",\"color_mode\":\"rgb\"";
  } else if (value_len > 1 &&
             option_has_list_value(opts, "color_modes", "color_temp")) {
    ss << ",\"color_mode\":\"color_temp\"";
  } else {
    ss << ",\"color_mode\":\"brightness\"";
  }
  if (value_len > 1 &&
      (option_has_list_value(opts, "color_modes", "brightness") ||
       option_has_list_value(opts, "color_modes", "rgb") ||
       option_has_list_value(opts, "color_modes", "rgbw") ||
       option_has_list_value(opts, "color_modes", "rgbww") ||
       option_has_list_value(opts, "color_modes", "white") ||
       option_has_list_value(opts, "color_modes", "color_temp"))) {
    ss << ",\"brightness\":" << static_cast<int>(value[1]);
  }
  if (value_len > 3 &&
      (option_has_list_value(opts, "color_modes", "rgb") ||
       option_has_list_value(opts, "color_modes", "rgbw") ||
       option_has_list_value(opts, "color_modes", "rgbww"))) {
    uint8_t r = 0, g = 0, b = 0;
    hsv_u8_to_rgb(value[2], value[3], value[1], r, g, b);
    ss << ",\"color\":{\"r\":" << static_cast<int>(r)
       << ",\"g\":" << static_cast<int>(g)
       << ",\"b\":" << static_cast<int>(b) << "}";
  }
  if (value_len > 7) {
    const uint16_t ct = static_cast<uint16_t>(value[6]) | (static_cast<uint16_t>(value[7]) << 8);
    if (ct > 0) ss << ",\"color_temp\":" << ct;
  }
  if (value_len > 8 && value[8] > 0) {
    ss << ",\"white\":" << static_cast<int>(value[8]);
  }
  const auto effects = option_list(opts, "effects");
  if (!effects.empty() && value_len > 4) {
    if (value[4] > 0 && value[4] <= effects.size()) {
      ss << ",\"effect\":\"" << escape_json(effects[value[4] - 1]) << "\"";
    } else {
      ss << ",\"effect\":\"None\"";
    }
  }
  ss << "}";
  return ss.str();
}

static std::string build_fan_state_json(const uint8_t *value, size_t value_len) {
  if (value_len < 1) return "{}";
  std::ostringstream ss;
  ss << "{";
  ss << "\"state\":" << (value[0] ? "true" : "false");
  if (value_len > 1) ss << ",\"speed_level\":" << static_cast<int>(value[1]);
  if (value_len > 2) ss << ",\"oscillating\":" << (value[2] ? "true" : "false");
  if (value_len > 3) ss << ",\"direction\":\"" << (value[3] ? "reverse" : "forward") << "\"";
  ss << "}";
  return ss.str();
}

}  // namespace

std::string escape_json(const std::string &value) {
  std::string out;
  out.reserve(value.size() + 8);
  for (char ch : value) {
    switch (ch) {
      case '"': out += "\\\""; break;
      case '\\': out += "\\\\"; break;
      case '\b': out += "\\b"; break;
      case '\f': out += "\\f"; break;
      case '\n': out += "\\n"; break;
      case '\r': out += "\\r"; break;
      case '\t': out += "\\t"; break;
      default:
        if (static_cast<unsigned char>(ch) < 0x20) {
          char buf[8];
          snprintf(buf, sizeof(buf), "\\u%04x", static_cast<unsigned int>(static_cast<unsigned char>(ch)));
          out += buf;
        } else {
          out += ch;
        }
        break;
    }
  }
  return out;
}

std::string state_value_json(espnow_field_type_t type, const uint8_t *value, size_t value_len,
                             const std::string &entity_options) {
  if (value == nullptr || value_len == 0) return "null";

  switch (type) {
    case FIELD_TYPE_SENSOR:
    case FIELD_TYPE_NUMBER: {
      if (value_len < sizeof(float)) return "0";
      float f = 0.0f;
      memcpy(&f, value, sizeof(f));
      std::ostringstream ss;
      ss << f;
      return ss.str();
    }
    case FIELD_TYPE_SWITCH:
    case FIELD_TYPE_BINARY:
    case FIELD_TYPE_BUTTON:
    case FIELD_TYPE_HUMIDIFIER:
    case FIELD_TYPE_DEHUMIDIFIER:
      return value[0] ? "true" : "false";
    case FIELD_TYPE_LIGHT:
      return build_light_state_json(value, value_len, entity_options);
    case FIELD_TYPE_FAN:
      return build_fan_state_json(value, value_len);
    case FIELD_TYPE_COVER:
    case FIELD_TYPE_VALVE: {
      int pct = value_len > 0 ? static_cast<int>(value[0]) : 0;
      return std::to_string(pct);
    }
    case FIELD_TYPE_LOCK: {
      if (value_len > 0 && value[0] == 1) return quoted_json_string("LOCKED");
      if (value_len > 0 && value[0] == 2) return quoted_json_string("JAMMED");
      return quoted_json_string("UNLOCKED");
    }
    case FIELD_TYPE_ALARM: {
      const char *state = "disarmed";
      if (value_len > 0) {
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
      return quoted_json_string(state);
    }
    case FIELD_TYPE_SELECT: {
      if (!entity_options.empty() && value_len > 0) {
        auto options = parse_select_options(entity_options);
        if (value[0] < options.size()) {
          return quoted_json_string(options[value[0]]);
        }
      }
      return value_len > 0 ? std::to_string(value[0]) : "0";
    }
    case FIELD_TYPE_TEXT:
    case FIELD_TYPE_TEXT_SENSOR:
    case FIELD_TYPE_EVENT:
    case FIELD_TYPE_TIME:
    case FIELD_TYPE_DATETIME:
      return quoted_json_string(std::string(reinterpret_cast<const char *>(value), value_len));
    case FIELD_TYPE_CLIMATE:
    default:
      return "null";
  }
}

namespace {

static char lower_hex_digit(uint8_t value) {
  static constexpr char kDigits[] = "0123456789abcdef";
  return kDigits[value & 0x0F];
}

}  // namespace

std::string bytes_to_lower_hex(const uint8_t *data, size_t len) {
  if (data == nullptr && len != 0) {
    return "";
  }
  std::string out;
  out.resize(len * 2);
  for (size_t i = 0; i < len; ++i) {
    out[i * 2] = lower_hex_digit(static_cast<uint8_t>(data[i] >> 4));
    out[i * 2 + 1] = lower_hex_digit(data[i]);
  }
  return out;
}

}  // namespace bridge_api
}  // namespace esp_tree
}  // namespace esphome
