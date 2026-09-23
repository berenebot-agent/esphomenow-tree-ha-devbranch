#pragma once

#include <cstdint>
#include <cstring>
#include <vector>
#include "espnow_types.h"

namespace esphome {
namespace esp_tree {

static constexpr size_t kMaxWireFrameBytes = 66000;

inline size_t cobs_encode(const uint8_t *input, size_t length, uint8_t *output) {
  if (length == 0) {
    output[0] = 1;
    return 1;
  }

  size_t out_idx = 1;
  size_t code_idx = 0;
  uint8_t code = 1;

  for (size_t i = 0; i < length; i++) {
    if (input[i] == 0) {
      output[code_idx] = code;
      code = 1;
      code_idx = out_idx;
      out_idx++;
    } else {
      output[out_idx++] = input[i];
      code++;
      if (code == 255) {
        output[code_idx] = code;
        code = 1;
        code_idx = out_idx;
        out_idx++;
      }
    }
  }

  output[code_idx] = code;
  return out_idx;
}

inline bool cobs_decode(const uint8_t *input, size_t length, uint8_t *output, size_t &out_length) {
  out_length = 0;

  if (length == 0)
    return false;

  size_t in_idx = 0;

  while (in_idx < length) {
    uint8_t code = input[in_idx++];
    if (code == 0)
      return false;

    size_t copy_len = code - 1;
    if (in_idx + copy_len > length)
      return false;

    memcpy(output + out_length, input + in_idx, copy_len);
    out_length += copy_len;
    in_idx += copy_len;

    if (code < 255 && in_idx < length) {
      output[out_length++] = 0;
    }
  }

  return true;
}

}  // namespace esp_tree
}  // namespace esphome