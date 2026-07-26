#pragma once

#include "esp_tree_common/espnow_types.h"

#include <cstddef>
#include <cstdint>
#include <string>

namespace esphome {
namespace esp_tree {
namespace bridge_api {

std::string escape_json(const std::string &value);

std::string state_value_json(espnow_field_type_t type, const uint8_t *value, size_t value_len,
                             const std::string &entity_options);

std::string bytes_to_lower_hex(const uint8_t *data, size_t len);

}  // namespace bridge_api
}  // namespace esp_tree
}  // namespace esphome
