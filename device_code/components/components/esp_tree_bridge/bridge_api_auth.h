#pragma once

#include <cstddef>
#include <cstdint>
#include <string>

namespace esphome {
namespace esp_tree {
namespace bridge_api {

class BridgeApiAuth {
 public:
  BridgeApiAuth() = default;

  void set_api_key(const std::string *api_key) { api_key_ = api_key; }
  bool has_api_key() const;

  static std::string bytes_to_lower_hex(const uint8_t *data, size_t len);
  static bool is_lower_or_upper_hex(const std::string &value);
  static bool constant_time_equal(const std::string &a, const std::string &b);

 private:
  const std::string *api_key_{nullptr};
};

}  // namespace bridge_api
}  // namespace esp_tree
}  // namespace esphome