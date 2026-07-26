#pragma once

#include "espnow_types.h"
#include "espnow_crypto.h"

#include <stdint.h>
#include <stddef.h>
#include <string.h>

#ifdef __cplusplus
extern "C" {
#endif

#ifdef ARDUINO_ARCH_ESP8266
#include <bearssl/bearssl_hash.h>
#endif

#if defined(ESP_PLATFORM)
#include <esp_random.h>
#include <mbedtls/md.h>
#endif

#pragma pack(push, 1)

static inline void espnowframes_sha256(const uint8_t* data, size_t len, uint8_t out[32]) {
#if defined(ARDUINO_ARCH_ESP8266)
  br_sha256_context ctx;
  br_sha256_init(&ctx);
  if (data != nullptr && len > 0) br_sha256_update(&ctx, data, len);
  br_sha256_out(&ctx, out);
#elif defined(ESP_PLATFORM)
  mbedtls_md_context_t ctx;
  mbedtls_md_init(&ctx);
  mbedtls_md_setup(&ctx, mbedtls_md_info_from_type(MBEDTLS_MD_SHA256), 0);
  mbedtls_md_starts(&ctx);
  if (data != nullptr && len > 0) mbedtls_md_update(&ctx, data, len);
  mbedtls_md_finish(&ctx, out);
  mbedtls_md_free(&ctx);
#else
  unsigned int len_out = 0;
  (void)data;
  (void)len;
  (void)out;
#endif
}

static inline void espnowframes_fill_random(uint8_t* data, size_t len) {
#if defined(ESP_PLATFORM)
  esp_fill_random(data, len);
#elif defined(ARDUINO_ARCH_ESP8266)
  os_get_random(data, len);
#else
  for (size_t i = 0; i < len; i++) data[i] = static_cast<uint8_t>(rand() & 0xFF);
#endif
}

#pragma pack(pop)

#ifdef __cplusplus
}
#endif

#ifdef __cplusplus
#include <array>
#include <cstdio>
#include <string>
#include <vector>

namespace esphome {
namespace esp_tree {

static constexpr uint8_t ESPNOW_BROADCAST_MAC[6] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};

static inline void format_mac(const uint8_t* mac, char* out, size_t out_len) {
  snprintf(out, out_len, "%02X:%02X:%02X:%02X:%02X:%02X",
           mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
}

static inline std::array<uint8_t, 6> parse_mac(const char* str) {
  std::array<uint8_t, 6> mac{};
  if (str == nullptr) return mac;
  for (int i = 0; i < 6 && *str != '\0'; i++) {
    while (*str == ' ' || *str == ':') str++;
    if (*str == '\0') break;
    unsigned int byte = 0;
    if (sscanf(str, "%02X", &byte) == 1 || sscanf(str, "%02x", &byte) == 1) {
      mac[i] = static_cast<uint8_t>(byte);
    }
    while (*str && *str != ':' && *str != ' ') str++;
  }
  return mac;
}

static inline void build_frame_header(const std::array<uint8_t, 6>& src_mac,
                                      uint8_t protocol_version,
                                      uint8_t hop_count,
                                      uint8_t packet_type,
                                      uint32_t tx_counter,
                                      uint8_t psk_tag[ESPNOW_PSK_TAG_LEN],
                                      uint8_t frame[sizeof(espnow_frame_header_t)]) {
  auto* hdr = reinterpret_cast<espnow_frame_header_t*>(frame);
  hdr->protocol_version = protocol_version;
  hdr->hop_count = hop_count;
  hdr->packet_type = packet_type;
  memcpy(hdr->leaf_mac, src_mac.data(), 6);
  hdr->tx_counter = tx_counter;
  if (psk_tag != nullptr) {
    memcpy(hdr->psk_tag, psk_tag, ESPNOW_PSK_TAG_LEN);
  }
}

static inline void make_discover_payload(const std::string& network_id,
                                          uint8_t capability_flags,
                                          espnow_discover_t& out) {
  memset(&out, 0, sizeof(out));
  memcpy(out.network_id, network_id.data(), std::min(network_id.size(), sizeof(out.network_id)));
  out.network_id_len = static_cast<uint8_t>(network_id.size());
  out.capability_flags = capability_flags;
}

static inline void make_discover_announce_payload(const std::string& network_id,
                                                  const std::array<uint8_t, 6>& responder_mac,
                                                  uint8_t responder_role,
                                                  uint8_t hops_to_bridge,
                                                  bool bridge_reachable,
                                                  espnow_discover_announce_t& out) {
  memset(&out, 0, sizeof(out));
  memcpy(out.network_id, network_id.data(), std::min(network_id.size(), sizeof(out.network_id)));
  out.network_id_len = static_cast<uint8_t>(network_id.size());
  memcpy(out.responder_mac, responder_mac.data(), 6);
  out.responder_role = responder_role;
  out.hops_to_bridge = hops_to_bridge;
  out.bridge_reachable = bridge_reachable ? 1 : 0;
  out.flags = 0;
}

static inline void make_join_payload(const std::array<uint8_t, 16>& remote_nonce,
                                    const uint8_t schema_hash[32],
                                    uint8_t hops_to_bridge,
                                    uint8_t dirty_count,
                                    uint8_t session_flags,
                                    espnow_join_t& out) {
  memset(&out, 0, sizeof(out));
  memcpy(out.remote_nonce, remote_nonce.data(), 16);
  if (schema_hash != nullptr) {
    memcpy(out.schema_hash, schema_hash, 32);
  }
  out.hops_to_bridge = hops_to_bridge;
  out.dirty_count = dirty_count;
  out.session_flags = session_flags;
}

static inline void compute_schema_hash_for_empty_node(const char* esphome_name,
                                                      const char* node_label,
                                                      uint32_t firmware_epoch,
                                                      const char* project_name,
                                                      const char* project_version,
                                                      uint8_t out_hash[32]) {
  std::vector<uint8_t> bytes;
  if (esphome_name != nullptr && esphome_name[0] != '\0') {
    bytes.insert(bytes.end(), esphome_name, esphome_name + strlen(esphome_name));
  }
  bytes.push_back(0);
  if (node_label != nullptr && node_label[0] != '\0') {
    bytes.insert(bytes.end(), node_label, node_label + strlen(node_label));
  }
  bytes.push_back(0);
  for (size_t i = 0; i < sizeof(firmware_epoch); i++) {
    bytes.push_back(static_cast<uint8_t>((firmware_epoch >> (i * 8)) & 0xFF));
  }
  if (project_name != nullptr && project_name[0] != '\0') {
    bytes.insert(bytes.end(), project_name, project_name + strlen(project_name));
  }
  bytes.push_back(0);
  if (project_version != nullptr && project_version[0] != '\0') {
    bytes.insert(bytes.end(), project_version, project_version + strlen(project_version));
  }
  bytes.push_back(0);
  espnowframes_sha256(bytes.data(), bytes.size(), out_hash);
}

static inline void make_join_ack_payload(bool accepted,
                                         uint8_t reason,
                                         uint8_t stage,
                                         const std::array<uint8_t, 16>& bridge_nonce,
                                         uint8_t session_flags,
                                         espnow_join_ack_t& out) {
  memset(&out, 0, sizeof(out));
  out.accepted = accepted ? 1 : 0;
  out.reason = reason;
  out.stage = stage;
  memcpy(out.bridge_nonce, bridge_nonce.data(), 16);
  out.session_flags = session_flags;
}

static inline size_t assemble_plain_frame(uint8_t packet_type,
                                         const std::array<uint8_t, 6>& leaf_mac,
                                         uint8_t hop_count,
                                         uint32_t tx_counter,
                                         const void* payload,
                                         size_t payload_len,
                                         uint8_t frame_out[17 + 250]) {
  uint8_t hdr_buf[sizeof(espnow_frame_header_t)];
  auto* hdr = reinterpret_cast<espnow_frame_header_t*>(hdr_buf);
  hdr->protocol_version = ESPNOW_PROTOCOL_VER;
  hdr->hop_count = hop_count;
  hdr->packet_type = packet_type;
  memcpy(hdr->leaf_mac, leaf_mac.data(), 6);
  hdr->tx_counter = tx_counter;
  espnow_crypto_psk_tag(hdr_buf, static_cast<const uint8_t*>(payload), payload_len, hdr->psk_tag);
  size_t total = sizeof(espnow_frame_header_t);
  memcpy(frame_out, hdr_buf, total);
  memcpy(frame_out + total, payload, payload_len);
  total += payload_len;
  return total;
}

static inline size_t make_discover_frame(const std::array<uint8_t, 6>& leaf_mac,
                                         const std::string& network_id,
                                         uint8_t capability_flags,
                                         uint8_t frame_out[17 + 34]) {
  espnow_discover_t discover;
  make_discover_payload(network_id, capability_flags, discover);
  return assemble_plain_frame(PKT_DISCOVER, leaf_mac,
                            ESPNOW_HOPS_DIR_UP, 0,
                            &discover, sizeof(discover), frame_out);
}

static inline size_t make_join_frame(const std::array<uint8_t, 6>& leaf_mac,
                                     uint8_t hops_to_bridge,
                                     uint8_t dirty_count,
                                     uint8_t session_flags,
                                     const std::array<uint8_t, 16>& remote_nonce,
                                     const uint8_t schema_hash[32],
                                     uint8_t frame_out[17 + 51]) {
  espnow_join_t join;
  make_join_payload(remote_nonce, schema_hash, hops_to_bridge, dirty_count, session_flags, join);
  return assemble_plain_frame(PKT_JOIN, leaf_mac,
                             ESPNOW_HOPS_DIR_UP, 1,
                             &join, sizeof(join), frame_out);
}

static inline size_t make_discover_announce_frame(const std::array<uint8_t, 6>& leaf_mac,
                                                  const std::string& network_id,
                                                  const std::array<uint8_t, 6>& responder_mac,
                                                  uint8_t responder_role,
                                                  uint8_t hops_to_bridge,
                                                  bool bridge_reachable,
                                                  uint8_t frame_out[17 + 43]) {
  espnow_discover_announce_t announce;
  make_discover_announce_payload(network_id, responder_mac, responder_role, hops_to_bridge, bridge_reachable, announce);
  return assemble_plain_frame(PKT_DISCOVER_ANNOUNCE, leaf_mac,
                             ESPNOW_HOPS_DIR_DOWN, 0,
                             &announce, sizeof(announce), frame_out);
}

static inline bool verify_frame_psk_tag(const uint8_t* frame, const uint8_t* payload, size_t payload_len) {
  if (frame == nullptr || payload_len == 0) return false;
  auto* hdr = reinterpret_cast<const espnow_frame_header_t*>(frame);
  return espnow_crypto_verify_psk_tag(frame, payload, payload_len, hdr->psk_tag) != 0;
}

static inline bool parse_received_header(const uint8_t* frame,
                                         size_t frame_len,
                                         espnow_frame_header_t& hdr_out,
                                         const uint8_t*& payload_out,
                                         size_t& payload_len_out,
                                         uint8_t parent_mac_out[6] = nullptr) {
  if (frame == nullptr || frame_len < sizeof(espnow_frame_header_t)) return false;
  memcpy(&hdr_out, frame, sizeof(hdr_out));
  bool has_parent_check = (hdr_out.hop_count & ESPNOW_HOPS_PARENT_CHECK_BIT) != 0;
  size_t header_size = sizeof(espnow_frame_header_t) + (has_parent_check ? ESPNOW_PARENT_MAC_LEN : 0);
  if (frame_len < header_size) return false;
  if (has_parent_check && parent_mac_out != nullptr) {
    memcpy(parent_mac_out, frame + sizeof(espnow_frame_header_t), 6);
  } else if (has_parent_check && parent_mac_out == nullptr) {
    // Still need to skip parent_mac even if caller doesn't want it
  }
  if (parent_mac_out != nullptr && !has_parent_check) {
    memset(parent_mac_out, 0, 6);
  }
  payload_out = frame + header_size;
  payload_len_out = frame_len - header_size;
  return true;
}

static inline bool parse_join_ack(const uint8_t* payload,
                                  size_t payload_len,
                                  espnow_join_ack_t& ack_out) {
  if (payload == nullptr || payload_len < sizeof(espnow_join_ack_t)) return false;
  memcpy(&ack_out, payload, sizeof(ack_out));
  return true;
}

static inline bool parse_discover_announce(const uint8_t* payload,
                                            size_t payload_len,
                                            espnow_discover_announce_t& announce_out) {
  if (payload == nullptr || payload_len < sizeof(espnow_discover_announce_t)) return false;
  memcpy(&announce_out, payload, sizeof(announce_out));
  return true;
}

static inline bool parse_discover(const uint8_t* payload,
                                  size_t payload_len,
                                  espnow_discover_t& discover_out) {
  if (payload == nullptr || payload_len < sizeof(espnow_discover_t)) return false;
  memcpy(&discover_out, payload, sizeof(discover_out));
  return true;
}

static inline void make_schema_push_payload(uint8_t descriptor_index,
                                            uint8_t entity_index,
                                            uint8_t total_entities,
                                            uint8_t entity_type,
                                            const uint8_t* entity_name,
                                            size_t entity_name_len,
                                            const uint8_t* entity_unit,
                                            size_t entity_unit_len,
                                            const uint8_t* entity_id,
                                            size_t entity_id_len,
                                            const uint8_t* entity_options,
                                            size_t entity_options_len,
                                            espnow_schema_push_t& out) {
  memset(&out, 0, sizeof(out));
  out.descriptor_type = ESPNOW_DESCRIPTOR_TYPE_ENTITY;
  out.descriptor_index = descriptor_index;
  out.entity_index = entity_index;
  out.total_entities = total_entities;
  out.entity_type = entity_type;
  if (entity_name != nullptr && entity_name_len > 0) {
    memcpy(out.entity_name, entity_name, std::min(entity_name_len, sizeof(out.entity_name)));
  }
  if (entity_unit != nullptr && entity_unit_len > 0) {
    memcpy(out.entity_unit, entity_unit, std::min(entity_unit_len, sizeof(out.entity_unit)));
  }
  if (entity_id != nullptr && entity_id_len > 0) {
    memcpy(out.entity_id, entity_id, std::min(entity_id_len, sizeof(out.entity_id)));
  }
  (void)entity_options;
  (void)entity_options_len;
}

static inline size_t make_schema_push_frame(const std::array<uint8_t, 6>& leaf_mac,
                                            uint8_t hops_to_bridge,
                                            uint32_t tx_counter,
                                            uint8_t descriptor_index,
                                            uint8_t entity_index,
                                            uint8_t total_entities,
                                            uint8_t entity_type,
                                            const uint8_t* entity_name,
                                            size_t entity_name_len,
                                            const uint8_t* entity_unit,
                                            size_t entity_unit_len,
                                            const uint8_t* entity_id,
                                            size_t entity_id_len,
                                            uint8_t frame_out[17 + 77]) {
  espnow_schema_push_t push;
  make_schema_push_payload(descriptor_index, entity_index, total_entities, entity_type,
                          entity_name, entity_name_len,
                          entity_unit, entity_unit_len,
                          entity_id, entity_id_len,
                          nullptr, 0, push);
  return assemble_plain_frame(PKT_SCHEMA_PUSH, leaf_mac,
                             ESPNOW_HOPS_MAKE(ESPNOW_HOPS_DIR_UP, hops_to_bridge),
                             tx_counter,
                             &push, sizeof(push), frame_out);
}

static inline bool verify_network_id(const espnow_discover_t& discover,
                                     const std::string& expected_network_id) {
  if (discover.network_id_len != expected_network_id.size()) return false;
  return memcmp(discover.network_id, expected_network_id.data(), discover.network_id_len) == 0;
}

static inline void derive_session_key(const uint8_t bridge_nonce[16],
                                        const uint8_t remote_nonce[16],
                                        uint8_t session_key_out[32]) {
  espnow_crypto_derive_session_key(bridge_nonce, remote_nonce, session_key_out);
}

static inline void derive_session_key_from_join_ack(const espnow_join_ack_t& join_ack,
                                                    const std::array<uint8_t, 16>& remote_nonce,
                                                    uint8_t session_key_out[32]) {
  derive_session_key(join_ack.bridge_nonce, remote_nonce.data(), session_key_out);
}

}  // namespace esp_tree
}  // namespace esphome
#endif