#pragma once

#include <string>
#include <cstdio>
#include <cstdint>
#include <cstring>
#include <vector>
#include <algorithm>
#include <map>

#include "esphome/core/application.h"
#include "esphome/core/helpers.h"

namespace esphome {
namespace esp_tree {

inline std::string sanitize_object_id(std::string input) {
  for (char &ch : input) {
    if ((ch >= 'A' && ch <= 'Z')) ch = static_cast<char>(ch - 'A' + 'a');
    if (!((ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9'))) ch = '_';
  }
  return input;
}

inline std::string slugify_name(std::string input) {
  return sanitize_object_id(std::move(input));
}

}  // namespace esp_tree
}  // namespace esphome
