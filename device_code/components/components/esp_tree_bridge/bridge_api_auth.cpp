#include "bridge_api_auth.h"

#include <algorithm>

namespace esphome {
namespace esp_tree {
namespace bridge_api {

bool BridgeApiAuth::has_api_key() const { return api_key_ != nullptr && !api_key_->empty(); }

bool BridgeApiAuth::is_lower_or_upper_hex(const std::string &value) {
  for (char ch : value) {
    const bool is_digit = ch >= '0' && ch <= '9';
    const bool is_lower = ch >= 'a' && ch <= 'f';
    const bool is_upper = ch >= 'A' && ch <= 'F';
    if (!is_digit && !is_lower && !is_upper) {
      return false;
    }
  }
  return true;
}

bool BridgeApiAuth::constant_time_equal(const std::string &a, const std::string &b) {
  const size_t max_len = a.size() > b.size() ? a.size() : b.size();
  uint8_t diff = static_cast<uint8_t>(a.size() ^ b.size());
  for (size_t i = 0; i < max_len; ++i) {
    const uint8_t av = i < a.size() ? static_cast<uint8_t>(a[i]) : 0;
    const uint8_t bv = i < b.size() ? static_cast<uint8_t>(b[i]) : 0;
    diff |= static_cast<uint8_t>(av ^ bv);
  }
  return diff == 0;
}

}  // namespace bridge_api
}  // namespace esp_tree
}  // namespace esphome