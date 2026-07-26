#pragma once

#include <stdint.h>
#include <stddef.h>
#include <stdio.h>

#ifdef __cplusplus
extern "C" {
#endif

#define ESPNOW_MAC_STR_LEN 18
#define ESPNOW_MAC_KEY_LEN 13

static inline void espnow_mac_to_hex_string(const uint8_t* mac, char* out) {
  if (mac == nullptr || out == nullptr) return;
  snprintf(out, ESPNOW_MAC_KEY_LEN + 1, "%02X%02X%02X%02X%02X%02X",
           mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
}

static inline void espnow_mac_to_display_string(const uint8_t* mac, char* out) {
  if (mac == nullptr || out == nullptr) return;
  snprintf(out, ESPNOW_MAC_STR_LEN + 1, "%02X:%02X:%02X:%02X:%02X:%02X",
           mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
}

#ifdef __cplusplus
}
#endif

#ifdef __cplusplus
#include <string>

namespace esphome {
namespace esp_tree {

inline std::string mac_hex(const uint8_t* mac) {
  if (mac == nullptr) return {};
  char buf[ESPNOW_MAC_KEY_LEN + 1];
  espnow_mac_to_hex_string(mac, buf);
  return buf;
}

inline std::string mac_display(const uint8_t* mac) {
  if (mac == nullptr) return "<null>";
  char buf[ESPNOW_MAC_STR_LEN + 1];
  espnow_mac_to_display_string(mac, buf);
  return buf;
}

}  // namespace esp_tree
}  // namespace esphome
#endif