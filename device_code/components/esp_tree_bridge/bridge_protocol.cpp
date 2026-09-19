#include "bridge_protocol.h"
#include "esp_tree_common/espnow_mac_utils.h"

#include "esp_tree_common/espnow_crypto.h"
#include "esphome/core/log.h"
#include "esphome/core/hal.h"
#include <esp_random.h>
#include <esp_wifi.h>

#include <algorithm>
#include <cstring>
#include <cstdlib>
#include <cstdarg>
#include <utility>
#include <vector>
#include <array>
#include <esp_heap_caps.h>

namespace esphome {
namespace esp_tree {

// TODO(USER): Remove ESP12 special logging below after debugging complete
static const uint8_t ESP12_MAC_[6] = {0xEC, 0xFA, 0xBC, 0x63, 0x17, 0x00};

static inline const char* drop_prefix(const uint8_t* mac) {
  return (mac != nullptr && memcmp(mac, ESP12_MAC_, 6) == 0) ? "!!!!!!ESP8266 " : "";
}

// Yield after ESP-NOW sends to give FreeRTOS time to run the MQTT
// and TCP/IP tasks. Prevents inbound MQTT event drops during
// heavy ESP-NOW bursts such as discovery storms.
static const uint8_t SEND_YIELD_MS = 1;

static const char *const TAG = "espnow";
static const char *const COLOR_YELLOW = "\x1b[33m";
static const char *const COLOR_AQUA  = "\x1b[36m";
static const char *const COLOR_GREEN = "\x1b[32m";
static const char *const COLOR_RED = "\x1b[31m";
static const char *const COLOR_RESET = "\x1b[0m";

namespace {

static uint8_t downstream_hop_count_session(const BridgeSession &session) {
  return ESPNOW_HOPS_MAKE(ESPNOW_HOPS_DIR_DOWN, 0);
}

static uint8_t downstream_hop_count_plain(uint8_t bridge_flags) {
  return ESPNOW_HOPS_MAKE(ESPNOW_HOPS_DIR_DOWN, 0);
}

static void reset_fragment_assembly_(espnow_fragment_assembly_t &assembly) {
  assembly = {};
}

static bool store_fragment_(espnow_fragment_assembly_t &assembly, const EntityPayloadView &view, uint32_t message_tx_base,
                            uint32_t now_ms, uint16_t max_entity_fragment, uint16_t max_assembly_bytes) {
  if (!assembly.active) {
    const size_t reserved = static_cast<size_t>(view.fragment_count) * max_entity_fragment;
    if (reserved > max_assembly_bytes) return false;
    assembly.active = true;
    assembly.entity_index = view.entity_index;
    assembly.flags = view.flags;
    assembly.fragment_count = view.fragment_count;
    assembly.message_tx_base = message_tx_base;
    assembly.first_seen_ms = now_ms;
    assembly.last_seen_ms = now_ms;
    assembly.bytes_received = 0;
    assembly.lengths.assign(view.fragment_count, 0);
    assembly.received.assign(view.fragment_count, 0);
    assembly.data.assign(reserved, 0);
  } else if (assembly.message_tx_base != message_tx_base || assembly.fragment_count != view.fragment_count) {
    return false;
  } else {
    assembly.last_seen_ms = now_ms;
  }
  if (view.fragment_index == assembly.fragment_count - 1) {
    assembly.flags = view.flags;
  }

  if (view.fragment_index >= assembly.fragment_count) return false;
  if (assembly.received[view.fragment_index]) return true;
  const size_t offset = static_cast<size_t>(view.fragment_index) * max_entity_fragment;
  if (offset + view.value_len > assembly.data.size()) return false;
  memcpy(assembly.data.data() + offset, view.value, view.value_len);
  assembly.received[view.fragment_index] = 1;
  assembly.lengths[view.fragment_index] = static_cast<uint16_t>(view.value_len);
  assembly.bytes_received += view.value_len;
  return assembly.bytes_received <= max_assembly_bytes;
}

static bool fragment_assembly_complete_(const espnow_fragment_assembly_t &assembly) {
  if (!assembly.active || assembly.fragment_count == 0) return false;
  for (uint8_t i = 0; i < assembly.fragment_count; i++) {
    if (!assembly.received[i]) return false;
  }
  return true;
}

static std::vector<uint8_t> assemble_fragment_payload_(const espnow_fragment_assembly_t &assembly, uint16_t max_entity_fragment) {
  std::vector<uint8_t> complete;
  complete.reserve(assembly.bytes_received);
  for (uint8_t i = 0; i < assembly.fragment_count; i++) {
    const size_t offset = static_cast<size_t>(i) * max_entity_fragment;
    complete.insert(complete.end(), assembly.data.begin() + static_cast<std::ptrdiff_t>(offset),
                    assembly.data.begin() + static_cast<std::ptrdiff_t>(offset + assembly.lengths[i]));
  }
  return complete;
}

}  // namespace

void BridgeProtocol::queue_log_(bool tx, espnow_packet_type_t type, const uint8_t *mac, uint16_t length, int8_t rssi,
                                bool show_channel, uint8_t ch, bool show_entity, uint8_t entity_idx, uint8_t entity_tot,
                                uint8_t chunk_idx, uint8_t chunk_tot, uint8_t retry_count, uint32_t pkt_uid,
                                bool show_ack_type, uint8_t ack_type,
                                bool parent_check) {
  if (log_count_ >= PACKET_LOG_SIZE) return;
  auto &entry = log_queue_[log_head_];
  entry.tx = tx;
  entry.type = type;
  memcpy(entry.mac, mac, 6);
  entry.channel = ch;
  entry.length = length;
  entry.rssi = rssi;
  entry.show_channel = show_channel;
  entry.show_entity = show_entity;
  entry.entity_index = entity_idx;
  entry.entity_total = entity_tot;
  entry.chunk_index = chunk_idx;
  entry.chunk_total = chunk_tot;
  entry.retry_count = retry_count;
  entry.pkt_uid = pkt_uid;
  entry.show_ack_type = show_ack_type;
  entry.ack_type = ack_type;
  entry.parent_check = parent_check;
  log_head_ = (log_head_ + 1) % PACKET_LOG_SIZE;
  log_count_++;
}

void BridgeProtocol::queue_state_log_(espnow_log_state_t state, const char *fmt, ...) {
  va_list args;
  va_start(args, fmt);
  vsnprintf(pending_state_log_msg_, sizeof(pending_state_log_msg_), fmt, args);
  va_end(args);
  pending_state_ = state;
}

void BridgeProtocol::flush_log_queue() {
  if (pending_state_ != espnow_log_state_t::NONE) {
    const char *color = nullptr;
    switch (pending_state_) {
      case espnow_log_state_t::JOINED:
      case espnow_log_state_t::NORMAL:
        color = COLOR_GREEN;
        break;
      default:
        break;
    }
    if (color) {
      ESP_LOGI(TAG, "%s%s%s", color, pending_state_log_msg_, COLOR_RESET);
    } else {
      ESP_LOGI(TAG, "%s", pending_state_log_msg_);
    }
    pending_state_ = espnow_log_state_t::NONE;
  }
  // DEBUG: per-packet TX/RX logs — set to VERBOSE in production to reduce noise
  while (log_count_ > 0) {
    auto &entry = log_queue_[log_tail_];
    const bool is_deauth = entry.type == PKT_DEAUTH;
    char retry_suffix[24] = "";
    if (entry.tx && (entry.type == PKT_STATE || entry.type == PKT_COMMAND) && entry.retry_count > 0) {
      snprintf(retry_suffix, sizeof(retry_suffix), " \033[33mRetry %u\033[0m", entry.retry_count + 1);
    }
    char uid_suffix[24] = "";
    if (entry.pkt_uid != 0) {
      snprintf(uid_suffix, sizeof(uid_suffix), " #%06X", entry.pkt_uid & 0xFFFFFF);
    }
    const char *parent_check_label = entry.parent_check ? " PC" : "";
    if (entry.show_entity) {
      if (is_deauth) {
        if (entry.chunk_total > 1) {
          ESP_LOGW(TAG, "%s[%s %s] Entity %u/%u (%u/%u)%s%s%s", COLOR_YELLOW,
                   entry.tx ? "TX" : "RX", packet_type_name(entry.type),
                   entry.entity_index + 1, entry.entity_total, entry.chunk_index, entry.chunk_total, uid_suffix, retry_suffix, COLOR_RESET);
        } else {
          ESP_LOGW(TAG, "%s[%s %s] Entity %u/%u%s%s%s", COLOR_YELLOW,
                   entry.tx ? "TX" : "RX", packet_type_name(entry.type),
                   entry.entity_index + 1, entry.entity_total, uid_suffix, retry_suffix, COLOR_RESET);
        }
      } else {
        const uint64_t key = mac_to_key_(entry.mac);
        auto it = sessions_.find(key);
        const char *entity_name = nullptr;
        if (it != sessions_.end() && entry.entity_index < it->second.schema_entities.size()) {
          entity_name = it->second.schema_entities[entry.entity_index].entity_name.c_str();
        }
        if (entry.chunk_total > 1) {
          if (entity_name && *entity_name) {
            ESP_LOGD(TAG, "%s[%s %s] Entity %u/%u (%u/%u): %s%s%s%s", COLOR_AQUA,
                     entry.tx ? "TX" : "RX", packet_type_name(entry.type),
                     entry.entity_index + 1, entry.entity_total, entry.chunk_index, entry.chunk_total, entity_name, uid_suffix, retry_suffix, COLOR_RESET);
          } else {
            ESP_LOGD(TAG, "%s[%s %s] Entity %u/%u (%u/%u)%s%s%s", COLOR_AQUA,
                     entry.tx ? "TX" : "RX", packet_type_name(entry.type),
                     entry.entity_index + 1, entry.entity_total, entry.chunk_index, entry.chunk_total, uid_suffix, retry_suffix, COLOR_RESET);
          }
        } else {
          if (entity_name && *entity_name) {
            ESP_LOGD(TAG, "%s[%s %s] Entity %u/%u: %s%s%s%s", COLOR_AQUA,
                     entry.tx ? "TX" : "RX", packet_type_name(entry.type),
                     entry.entity_index + 1, entry.entity_total, entity_name, uid_suffix, retry_suffix, COLOR_RESET);
          } else {
            ESP_LOGD(TAG, "%s[%s %s] Entity %u/%u%s%s%s", COLOR_AQUA,
                     entry.tx ? "TX" : "RX", packet_type_name(entry.type),
                     entry.entity_index + 1, entry.entity_total, uid_suffix, retry_suffix, COLOR_RESET);
          }
        }
      }
    } else if (entry.show_channel) {
      if (entry.tx) {
        if (is_deauth) {
          ESP_LOGW(TAG, "%s[TX %s] %02X%02X%02X%02X%02X%02X CH%u len=%u%s%s%s", COLOR_YELLOW, packet_type_name(entry.type),
                   entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5], entry.channel,
                   static_cast<unsigned>(entry.length), uid_suffix, retry_suffix, COLOR_RESET);
        } else {
          ESP_LOGD(TAG, "%s[TX %s] %02X%02X%02X%02X%02X%02X CH%u len=%u%s%s%s", COLOR_AQUA, packet_type_name(entry.type),
                   entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5], entry.channel,
                   static_cast<unsigned>(entry.length), uid_suffix, retry_suffix, COLOR_RESET);
        }
      } else {
        if (is_deauth) {
          ESP_LOGW(TAG, "%s[RX %s] %02X%02X%02X%02X%02X%02X CH%u len=%u rssi=%d%s%s%s", COLOR_YELLOW, packet_type_name(entry.type),
                   entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5],
                   entry.channel, static_cast<unsigned>(entry.length), entry.rssi, uid_suffix, parent_check_label, COLOR_RESET);
        } else {
          ESP_LOGD(TAG, "%s[RX %s] %02X%02X%02X%02X%02X%02X CH%u len=%u rssi=%d%s%s%s", COLOR_AQUA, packet_type_name(entry.type),
                   entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5],
                   entry.channel, static_cast<unsigned>(entry.length), entry.rssi, uid_suffix, parent_check_label, COLOR_RESET);
        }
      }
    } else if (entry.tx) {
      if (is_deauth) {
        ESP_LOGW(TAG, "%s[TX %s] %02X%02X%02X%02X%02X%02X len=%u%s%s%s", COLOR_YELLOW, packet_type_name(entry.type),
                 entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5],
                 static_cast<unsigned>(entry.length), uid_suffix, retry_suffix, COLOR_RESET);
      } else if (entry.type == PKT_ACK) {
        const char *ack_label;
        char ack_buf[12];
        if (entry.ack_type == ACK_STATE) {
          ack_label = "State";
        } else if (entry.ack_type == ACK_COMMAND) {
          ack_label = "Command";
        } else if (entry.ack_type == PKT_CONFIG) {
          ack_label = "Config";
        } else if (entry.ack_type == PKT_FILE_TRANSFER) {
          ack_label = "File";
        } else {
          snprintf(ack_buf, sizeof(ack_buf), "0x%02X", entry.ack_type);
          ack_label = ack_buf;
        }
        snprintf(uid_suffix, sizeof(uid_suffix), "%s%s", uid_suffix, parent_check_label);
        ESP_LOGD(TAG, "%s[TX ACK (%s)] %02X%02X%02X%02X%02X%02X len=%u rssi=%d%s%s", COLOR_AQUA,
                 ack_label,
                 entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5],
                 static_cast<unsigned>(entry.length), entry.rssi, uid_suffix, retry_suffix, COLOR_RESET);
      } else {
        ESP_LOGD(TAG, "%s[TX %s] %02X%02X%02X%02X%02X%02X len=%u%s%s%s", COLOR_AQUA, packet_type_name(entry.type),
                 entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5],
                 static_cast<unsigned>(entry.length), uid_suffix, retry_suffix, COLOR_RESET);
      }
    } else {
      if (is_deauth) {
        ESP_LOGW(TAG, "%s[RX %s] %02X%02X%02X%02X%02X%02X len=%u rssi=%d%s%s%s", COLOR_YELLOW, packet_type_name(entry.type),
                 entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5],
                 static_cast<unsigned>(entry.length), entry.rssi, uid_suffix, parent_check_label, COLOR_RESET);
      } else if (entry.type == PKT_ACK) {
        const char *ack_label;
        char ack_buf[12];
        if (entry.ack_type == ACK_STATE) {
          ack_label = "State";
        } else if (entry.ack_type == ACK_COMMAND) {
          ack_label = "Command";
        } else if (entry.ack_type == PKT_CONFIG) {
          ack_label = "Config";
        } else if (entry.ack_type == PKT_FILE_TRANSFER) {
          ack_label = "File";
        } else {
          snprintf(ack_buf, sizeof(ack_buf), "0x%02X", entry.ack_type);
          ack_label = ack_buf;
        }
        ESP_LOGD(TAG, "%s[%s ACK (%s)] %02X%02X%02X%02X%02X%02X len=%u rssi=%d%s%s%s", COLOR_AQUA,
                 entry.tx ? "TX" : "RX", ack_label,
                 entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5],
                 static_cast<unsigned>(entry.length), entry.rssi, uid_suffix, parent_check_label, COLOR_RESET);
      } else {
        ESP_LOGD(TAG, "%s[RX %s] %02X%02X%02X%02X%02X%02X len=%u rssi=%d%s%s%s", COLOR_AQUA, packet_type_name(entry.type),
                 entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5],
                 static_cast<unsigned>(entry.length), entry.rssi, uid_suffix, parent_check_label, COLOR_RESET);
      }
    }
    log_tail_ = (log_tail_ + 1) % PACKET_LOG_SIZE;
    log_count_--;
  }
}

BridgeProtocol::BridgeProtocol() = default;

int BridgeProtocol::init(const char *psk_hex, const char *network_id, uint16_t heartbeat_interval) {
  network_id_ = network_id != nullptr ? network_id : "";
  heartbeat_interval_ = heartbeat_interval;
  psk_valid_ = espnow_crypto_init(psk_hex) == 0;
  bridge_nonce_ready_ = false;
#if defined(CONFIG_IDF_TARGET_ESP32C3)
  bridge_identity_.chip_model = 5;
#elif defined(CONFIG_IDF_TARGET_ESP32S3)
  bridge_identity_.chip_model = 9;
#elif defined(CONFIG_IDF_TARGET_ESP32)
  bridge_identity_.chip_model = 1;
#elif defined(CONFIG_IDF_TARGET_ESP32S2)
  bridge_identity_.chip_model = 2;
#elif defined(CONFIG_IDF_TARGET_ESP32C6)
  bridge_identity_.chip_model = 13;
#elif defined(CONFIG_IDF_TARGET_ESP32H2)
  bridge_identity_.chip_model = 16;
#elif defined(CONFIG_IDF_TARGET_ESP32C2)
  bridge_identity_.chip_model = 12;
#elif defined(CONFIG_IDF_TARGET_ESP32C5)
  bridge_identity_.chip_model = 23;
#elif defined(CONFIG_IDF_TARGET_ESP32C61)
  bridge_identity_.chip_model = 20;
#elif defined(CONFIG_IDF_TARGET_ESP32P4)
  bridge_identity_.chip_model = 18;
#else
  bridge_identity_.chip_model = 0;
#endif
  return psk_valid_ ? 0 : -1;
}

void BridgeProtocol::set_bridge_identity(uint32_t chip_model, uint32_t firmware_epoch, const std::string &build_date,
                                         const std::string &build_time, const std::string &project_name,
                                         const std::string &project_version, const std::array<uint8_t, 16> &firmware_md5) {
  bridge_identity_.chip_model = chip_model;
  bridge_identity_.firmware_epoch = firmware_epoch;
  bridge_identity_.build_date = build_date;
  bridge_identity_.build_time = build_time;
  bridge_identity_.project_name = project_name;
  bridge_identity_.project_version = project_version;
  bridge_identity_.firmware_md5 = firmware_md5;
}

void BridgeProtocol::set_bridge_mac(const uint8_t *mac) {
  if (mac == nullptr) return;
  memcpy(bridge_mac_.data(), mac, bridge_mac_.size());
  bridge_mac_valid_ = true;
}

void BridgeProtocol::set_send_fn(send_fn_t fn) { send_fn_ = std::move(fn); }
void BridgeProtocol::set_publish_state_fn(publish_state_fn_t fn) { publish_state_fn_ = std::move(fn); }
void BridgeProtocol::set_publish_discovery_fn(publish_discovery_fn_t fn) { publish_discovery_fn_ = std::move(fn); }
void BridgeProtocol::set_publish_availability_fn(publish_availability_fn_t fn) { publish_availability_fn_ = std::move(fn); }
void BridgeProtocol::set_publish_topology_changed_fn(publish_topology_changed_fn_t fn) { publish_topology_changed_fn_ = std::move(fn); }
void BridgeProtocol::set_publish_bridge_diag_fn(publish_bridge_diag_fn_t fn) { publish_bridge_diag_fn_ = std::move(fn); }
void BridgeProtocol::set_clear_entities_fn(clear_entities_fn_t fn) { clear_entities_fn_ = std::move(fn); }
void BridgeProtocol::set_schema_complete_fn(schema_complete_fn_t fn) { schema_complete_fn_ = std::move(fn); }

void BridgeProtocol::set_file_ack_fn(file_ack_fn_t fn) { file_ack_fn_ = std::move(fn); }
void BridgeProtocol::set_send_err_fn(send_err_fn_t fn) { send_err_fn_ = std::move(fn); }
void BridgeProtocol::set_send_ota_frame_fn(send_ota_frame_fn_t fn) { send_ota_frame_fn_ = std::move(fn); }

uint64_t BridgeProtocol::mac_to_key_(const uint8_t *mac) const {
  uint64_t key = 0;
  if (mac == nullptr) return key;
  for (int i = 0; i < 6; i++) key |= static_cast<uint64_t>(mac[i]) << (i * 8);
  return key;
}

std::string BridgeProtocol::schema_cache_key_(const BridgeSession &session) const {
  if (!session.esphome_name.empty()) return session.esphome_name;
  return mac_hex(session.leaf_mac.data());
}

BridgeSession *BridgeProtocol::ensure_session_(const uint8_t *leaf_mac) {
  if (leaf_mac == nullptr) return nullptr;
  auto &session = sessions_[mac_to_key_(leaf_mac)];
  if (session.mac_hex_key.empty()) {
    session.mac_hex_key = mac_hex(leaf_mac);
  }
  memcpy(session.leaf_mac.data(), leaf_mac, session.leaf_mac.size());
  return &session;
}

BridgeSession *BridgeProtocol::get_session(const uint8_t *leaf_mac) {
  const auto it = sessions_.find(mac_to_key_(leaf_mac));
  return it == sessions_.end() ? nullptr : &it->second;
}

const BridgeSession *BridgeProtocol::get_session(const uint8_t *leaf_mac) const {
  const auto it = sessions_.find(mac_to_key_(leaf_mac));
  return it == sessions_.end() ? nullptr : &it->second;
}

uint8_t BridgeProtocol::get_active_remote_count() const {
  uint8_t count = 0;
  for (const auto &entry : sessions_) {
    if (entry.second.online) count++;
  }
  return count;
}

uint8_t BridgeProtocol::get_direct_remote_count() const {
  uint8_t count = 0;
  for (const auto &entry : sessions_) {
    const auto &session = entry.second;
    if (session.online && session.hops_to_bridge == 1) count++;
  }
  return count;
}

void BridgeProtocol::invalidate_all_sessions() {
  ESP_LOGW(TAG, "Manual session invalidation triggered for all remotes by MQTT");
  for (auto it = sessions_.begin(); it != sessions_.end();) {
    auto &session = it->second;
    session.session_key_valid = false;
    session.online = false;
    session.remote_state = espnow_log_state_t::NONE;
    session.schema_received = false;
    if (publish_availability_fn_) {
      publish_availability_fn_(session.leaf_mac.data(), false, "manual");
    }
    if (publish_topology_changed_fn_) {
      publish_topology_changed_fn_(session.leaf_mac.data(), "node_removed");
    }
    if (clear_entities_fn_) {
      clear_entities_fn_(session.leaf_mac.data(), session.schema_entities);
    }
    it = sessions_.erase(it);
  }
  schema_cache_.clear();
  schema_hash_cache_.clear();
}

bool BridgeProtocol::send_command_to_leaf(const uint8_t *leaf_mac, uint8_t field_index,
                                          const std::vector<uint8_t> &value) {
  BridgeSession *session = get_session(leaf_mac);
  if (session == nullptr || !session->online || !session->session_key_valid) return false;
  return send_command_(session->next_hop_mac.data(), *session, field_index, value);
}

bool BridgeProtocol::send_config_frame_(BridgeSession &session, const PendingConfig &pending, uint8_t retry_count) {
  if (!session.session_key_valid || !session.online) return false;
  if (pending.payload.size() > (ESPNOW_MAX_ENTITY_FRAGMENT_LEN - sizeof(espnow_config_t))) return false;

  std::vector<uint8_t> config_payload(sizeof(espnow_config_t) + pending.payload.size());
  auto *cfg = reinterpret_cast<espnow_config_t *>(config_payload.data());
  cfg->command = pending.command;
  cfg->flags = 0;
  cfg->payload_len = static_cast<uint8_t>(pending.payload.size());
  if (!pending.payload.empty()) {
    memcpy(config_payload.data() + sizeof(espnow_config_t), pending.payload.data(), pending.payload.size());
  }

  const uint8_t hop_count = downstream_hop_count_session(session);
  queue_log_(true, PKT_CONFIG, pending.next_hop_mac.data(),
             static_cast<uint16_t>(config_payload.size() + sizeof(espnow_frame_header_t) + ESPNOW_SESSION_TAG_LEN),
             0, false, 0, false, 0, 0, 0, 0, retry_count, pending.tx_base,
             false, 0, false);
  return send_encrypted_with_tx_counter_(pending.next_hop_mac.data(), session, PKT_CONFIG, hop_count,
                                         pending.tx_base, config_payload.data(), config_payload.size());
}

bool BridgeProtocol::send_config_to_leaf(const uint8_t *leaf_mac, uint8_t command,
                                         const uint8_t *payload, size_t payload_len,
                                         config_ack_fn_t callback) {
  if (leaf_mac == nullptr) return false;
  if (payload_len > (ESPNOW_MAX_ENTITY_FRAGMENT_LEN - sizeof(espnow_config_t))) return false;

  BridgeSession *session = get_session(leaf_mac);
  if (session == nullptr || !session->online || !session->session_key_valid) {
    ESP_LOGW(TAG, "Cannot send CONFIG cmd=0x%02X to %s: no active session",
             command, mac_display(leaf_mac).c_str());
    return false;
  }

  PendingConfig pending{};
  memcpy(pending.leaf_mac.data(), session->leaf_mac.data(), pending.leaf_mac.size());
  memcpy(pending.next_hop_mac.data(), session->next_hop_mac.data(), pending.next_hop_mac.size());
  pending.command = command;
  if (payload != nullptr && payload_len > 0) {
    pending.payload.assign(payload, payload + payload_len);
  }
  pending.tx_base = session->tx_counter++;
  pending.retry_count = 0;
  pending.ack_timeout_ms = CONFIG_ACK_TIMEOUT_MS;
  pending.next_retry_ms = millis() + pending.ack_timeout_ms;
  pending.callback = std::move(callback);

  if (!send_config_frame_(*session, pending, 0)) {
    return false;
  }

  pending_configs_.push_back(std::move(pending));
  return true;
}

esp_err_t BridgeProtocol::send_ota_frame(const uint8_t *leaf_mac, espnow_packet_type_t type,
                                          const uint8_t *payload, size_t len, uint32_t *tx_counter_out) {
  if (leaf_mac == nullptr || payload == nullptr || (type != PKT_FILE_TRANSFER && type != PKT_FILE_DATA)) {
    return ESP_ERR_INVALID_ARG;
  }
  BridgeSession *session = get_session(leaf_mac);
  if (session == nullptr || !session->session_key_valid) {
    return ESP_ERR_NOT_FOUND;
  }
  const uint32_t tx_counter = session->tx_counter++;
  if (tx_counter_out != nullptr) {
    *tx_counter_out = tx_counter;
  }
  return send_encrypted_with_tx_counter_result_(session->next_hop_mac.data(), *session, type,
                                                 downstream_hop_count_session(*session),
                                                tx_counter, payload, len);
}

bool BridgeProtocol::parse_frame_(const uint8_t *sender_mac, const uint8_t *frame, size_t len, espnow_frame_header_t &header, const uint8_t *&payload,
                                  size_t &payload_len, const uint8_t *&session_tag, uint8_t parent_mac[6]) const {
  if (frame == nullptr || len < sizeof(espnow_frame_header_t)) {
    ESP_LOGD(TAG, "%s[DROP] L1 data: data=%p len=%u < header=%u mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac), frame, static_cast<unsigned>(len),
             static_cast<unsigned>(sizeof(espnow_frame_header_t)),
             sender_mac != nullptr ? sender_mac[0] : 0, sender_mac != nullptr ? sender_mac[1] : 0,
             sender_mac != nullptr ? sender_mac[2] : 0, sender_mac != nullptr ? sender_mac[3] : 0,
             sender_mac != nullptr ? sender_mac[4] : 0, sender_mac != nullptr ? sender_mac[5] : 0);
    return false;
  }
  if (len > ESPNOW_V2_MAX_PAYLOAD) {
    ESP_LOGD(TAG, "%s[DROP] L2 len_max: len=%u > 1470 mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac), static_cast<unsigned>(len),
             sender_mac != nullptr ? sender_mac[0] : 0, sender_mac != nullptr ? sender_mac[1] : 0,
             sender_mac != nullptr ? sender_mac[2] : 0, sender_mac != nullptr ? sender_mac[3] : 0,
             sender_mac != nullptr ? sender_mac[4] : 0, sender_mac != nullptr ? sender_mac[5] : 0);
    return false;
  }
  memcpy(&header, frame, sizeof(header));
  if (header.protocol_version != ESPNOW_PROTOCOL_VER) {
    ESP_LOGW(TAG, "Dropping frame with protocol v%u (expected v%u), type=0x%02X len=%u",
             header.protocol_version, ESPNOW_PROTOCOL_VER, header.packet_type, static_cast<unsigned>(len));
    return false;
  }
  if (!is_valid_packet_type(static_cast<espnow_packet_type_t>(header.packet_type))) {
    ESP_LOGW(TAG, "Dropping frame with invalid packet type=0x%02X len=%u",
             header.packet_type, static_cast<unsigned>(len));
    return false;
  }
  bool has_parent_check = (header.hop_count & ESPNOW_HOPS_PARENT_CHECK_BIT) != 0;
  size_t header_size = sizeof(espnow_frame_header_t) + (has_parent_check ? ESPNOW_PARENT_MAC_LEN : 0);
  if (len < header_size) {
    ESP_LOGD(TAG, "%s[DROP] L1 parent_check: len=%u < header_size=%u mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac), static_cast<unsigned>(len), static_cast<unsigned>(header_size),
             sender_mac != nullptr ? sender_mac[0] : 0, sender_mac != nullptr ? sender_mac[1] : 0,
             sender_mac != nullptr ? sender_mac[2] : 0, sender_mac != nullptr ? sender_mac[3] : 0,
             sender_mac != nullptr ? sender_mac[4] : 0, sender_mac != nullptr ? sender_mac[5] : 0);
    return false;
  }
  if (has_parent_check) {
      memcpy(parent_mac, frame + sizeof(espnow_frame_header_t), 6);
  } else {
      memset(parent_mac, 0, 6);
  }
  payload = frame + header_size;
  payload_len = len - header_size;
  session_tag = nullptr;
  if (is_encrypted_packet(static_cast<espnow_packet_type_t>(header.packet_type))) {
    if (payload_len < ESPNOW_SESSION_TAG_LEN) {
      ESP_LOGD(TAG, "%s[DROP] L2 enc_short: payload_len=%u < 8 type=0x%02X mac=%02X:%02X:%02X:%02X:%02X:%02X",
               drop_prefix(sender_mac), static_cast<unsigned>(payload_len), header.packet_type,
               sender_mac != nullptr ? sender_mac[0] : 0, sender_mac != nullptr ? sender_mac[1] : 0,
               sender_mac != nullptr ? sender_mac[2] : 0, sender_mac != nullptr ? sender_mac[3] : 0,
               sender_mac != nullptr ? sender_mac[4] : 0, sender_mac != nullptr ? sender_mac[5] : 0);
      return false;
    }
    session_tag = frame + len - ESPNOW_SESSION_TAG_LEN;
    payload_len -= ESPNOW_SESSION_TAG_LEN;
  }
  if (espnow_crypto_verify_psk_tag(frame, payload, payload_len, header.psk_tag) == 0) {
    ESP_LOGD(TAG, "%s[DROP] L2 psk_fail: mac=%02X:%02X:%02X:%02X:%02X:%02X type=0x%02X tx=%u",
             drop_prefix(sender_mac),
             sender_mac != nullptr ? sender_mac[0] : 0, sender_mac != nullptr ? sender_mac[1] : 0,
             sender_mac != nullptr ? sender_mac[2] : 0, sender_mac != nullptr ? sender_mac[3] : 0,
             sender_mac != nullptr ? sender_mac[4] : 0, sender_mac != nullptr ? sender_mac[5] : 0,
             header.packet_type, header.tx_counter);
    return false;
  }
  return true;
}

bool BridgeProtocol::validate_session_packet_(const uint8_t *sender_mac, BridgeSession &session, const espnow_frame_header_t &header, const uint8_t *ciphertext,
                                               size_t ciphertext_len, const uint8_t *session_tag, std::vector<uint8_t> &plaintext) {
  if (!session.session_key_valid) {
    ESP_LOGD(TAG, "%s[DROP] L3 key_invalid: mac=%02X:%02X:%02X:%02X:%02X:%02X type=0x%02X tx=%u",
             drop_prefix(sender_mac),
             sender_mac != nullptr ? sender_mac[0] : 0, sender_mac != nullptr ? sender_mac[1] : 0,
             sender_mac != nullptr ? sender_mac[2] : 0, sender_mac != nullptr ? sender_mac[3] : 0,
             sender_mac != nullptr ? sender_mac[4] : 0, sender_mac != nullptr ? sender_mac[5] : 0,
             header.packet_type, header.tx_counter);
    return false;
  }
  if (session_tag == nullptr) {
    ESP_LOGD(TAG, "%s[DROP] L3 tag_null: mac=%02X:%02X:%02X:%02X:%02X:%02X type=0x%02X tx=%u",
             drop_prefix(sender_mac),
             sender_mac != nullptr ? sender_mac[0] : 0, sender_mac != nullptr ? sender_mac[1] : 0,
             sender_mac != nullptr ? sender_mac[2] : 0, sender_mac != nullptr ? sender_mac[3] : 0,
             sender_mac != nullptr ? sender_mac[4] : 0, sender_mac != nullptr ? sender_mac[5] : 0,
             header.packet_type, header.tx_counter);
    return false;
  }
  if (espnow_crypto_verify_session_tag(session.session_key.data(), reinterpret_cast<const uint8_t *>(&header), ciphertext, ciphertext_len,
                                       session_tag) == 0) {
    ESP_LOGD(TAG, "%s[DROP] L3 tag_verify: mac=%02X:%02X:%02X:%02X:%02X:%02X type=0x%02X tx=%u",
             drop_prefix(sender_mac),
             sender_mac != nullptr ? sender_mac[0] : 0, sender_mac != nullptr ? sender_mac[1] : 0,
             sender_mac != nullptr ? sender_mac[2] : 0, sender_mac != nullptr ? sender_mac[3] : 0,
             sender_mac != nullptr ? sender_mac[4] : 0, sender_mac != nullptr ? sender_mac[5] : 0,
             header.packet_type, header.tx_counter);
    return false;
  }
  plaintext.resize(ciphertext_len);
  if (espnow_crypto_crypt(session.session_key.data(), header.tx_counter, ciphertext, plaintext.data(), ciphertext_len) != 0) {
    ESP_LOGD(TAG, "%s[DROP] L3 aes_ctr: mac=%02X:%02X:%02X:%02X:%02X:%02X type=0x%02X tx=%u",
             drop_prefix(sender_mac),
             sender_mac != nullptr ? sender_mac[0] : 0, sender_mac != nullptr ? sender_mac[1] : 0,
             sender_mac != nullptr ? sender_mac[2] : 0, sender_mac != nullptr ? sender_mac[3] : 0,
             sender_mac != nullptr ? sender_mac[4] : 0, sender_mac != nullptr ? sender_mac[5] : 0,
             header.packet_type, header.tx_counter);
    return false;
  }
  return true;
}

bool BridgeProtocol::on_espnow_frame(const uint8_t *sender_mac, const uint8_t *data, size_t len, int8_t rssi) {
  if (data == nullptr || len < sizeof(espnow_frame_header_t)) {
    ESP_LOGD(TAG, "%s[DROP] L1 data: data=%p len=%u < header=%u mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac), data, static_cast<unsigned>(len),
             static_cast<unsigned>(sizeof(espnow_frame_header_t)),
             sender_mac != nullptr ? sender_mac[0] : 0, sender_mac != nullptr ? sender_mac[1] : 0,
             sender_mac != nullptr ? sender_mac[2] : 0, sender_mac != nullptr ? sender_mac[3] : 0,
             sender_mac != nullptr ? sender_mac[4] : 0, sender_mac != nullptr ? sender_mac[5] : 0);
    return false;
  }
  const auto *raw_header = reinterpret_cast<const espnow_frame_header_t *>(data);
  if (raw_header->protocol_version != ESPNOW_PROTOCOL_VER) {
    ESP_LOGW(TAG, "Dropping frame from %02X:%02X:%02X:%02X:%02X:%02X with protocol v%u (expected v%u), type=0x%02X len=%u",
             sender_mac != nullptr ? sender_mac[0] : 0, sender_mac != nullptr ? sender_mac[1] : 0,
             sender_mac != nullptr ? sender_mac[2] : 0, sender_mac != nullptr ? sender_mac[3] : 0,
             sender_mac != nullptr ? sender_mac[4] : 0, sender_mac != nullptr ? sender_mac[5] : 0,
             raw_header->protocol_version, ESPNOW_PROTOCOL_VER, raw_header->packet_type, static_cast<unsigned>(len));
    return false;
  }
  espnow_frame_header_t header{};
  const uint8_t *payload = nullptr;
  size_t payload_len = 0;
  const uint8_t *session_tag = nullptr;
  uint8_t parent_mac[6] = {};
  if (!parse_frame_(sender_mac, data, len, header, payload, payload_len, session_tag, parent_mac)) return false;

  const auto pkt_type = static_cast<espnow_packet_type_t>(header.packet_type);
  const bool has_parent_check = (header.hop_count & ESPNOW_HOPS_PARENT_CHECK_BIT) != 0;
  if (has_parent_check) {
      bool parent_is_all_zeros = espnow_is_parent_mac_all_zeros(parent_mac);
      bool parent_is_self = memcmp(parent_mac, bridge_mac_.data(), 6) == 0;
      if (!parent_is_all_zeros && !parent_is_self) {
          return false;
      }
  }
  if (pkt_type == PKT_DISCOVER) {
    uint8_t ch = 0;
    wifi_second_chan_t sec = WIFI_SECOND_CHAN_NONE;
    esp_wifi_get_channel(&ch, &sec);
    queue_log_(false, pkt_type, sender_mac, static_cast<uint16_t>(len), rssi, true, ch, false, 0, 0, 0, 0, 0, header.tx_counter, false, 0, has_parent_check);
  } else if (pkt_type == PKT_SCHEMA_PUSH) {
  } else if (pkt_type == PKT_STATE) {
    queue_log_(false, pkt_type, sender_mac, static_cast<uint16_t>(len), rssi, false, 0, false, 0, 0, 0, 0, 0, header.tx_counter, false, 0, has_parent_check);
  } else if (pkt_type != PKT_ACK) {
    queue_log_(false, pkt_type, sender_mac, static_cast<uint16_t>(len), rssi, false, 0, false, 0, 0, 0, 0, 0, header.tx_counter, false, 0, has_parent_check);
  }

#ifndef NDEBUG
  if (ESPNOW_HOPS_IS_DOWNSTREAM(header.hop_count) && pkt_type != PKT_DEAUTH) {
    ESP_LOGW(TAG, "Unexpected downstream direction flag on pkt=0x%02X from "
             "%02X%02X%02X%02X%02X%02X",
             header.packet_type,
             sender_mac[0], sender_mac[1], sender_mac[2],
             sender_mac[3], sender_mac[4], sender_mac[5]);
  }
#endif

  switch (pkt_type) {
    case PKT_DISCOVER: return handle_discover_(sender_mac, header, payload, payload_len, rssi, session_tag);
    case PKT_STATE:
    case PKT_HEARTBEAT:
    case PKT_ACK: {
      BridgeSession *session = get_session(header.leaf_mac);
      if (session == nullptr) {
        BridgeSession temp{};
        memcpy(temp.leaf_mac.data(), header.leaf_mac, 6);
        memcpy(temp.next_hop_mac.data(), sender_mac, 6);
        return send_deauth_(sender_mac, temp, header.packet_type, header.tx_counter, payload, payload_len);
      }
      if (!session->session_key_valid) {
        memcpy(session->next_hop_mac.data(), sender_mac, 6);
        session->last_rssi = rssi;
        ESP_LOGW(TAG, "Session key invalid for %s on pkt=%s, sending DEAUTH",
                 mac_hex(header.leaf_mac).c_str(), packet_type_name(pkt_type));
        return send_deauth_(sender_mac, *session, header.packet_type, header.tx_counter, payload, payload_len);
      }
      memcpy(session->next_hop_mac.data(), sender_mac, 6);
      session->rx_packets++;
      session->last_rssi = rssi;
      {
        const uint8_t new_hops = ESPNOW_HOPS_COUNT(header.hop_count);
        if (new_hops != session->hops_to_bridge) {
          session->hops_to_bridge = new_hops;
          if (publish_availability_fn_) {
            publish_availability_fn_(session->leaf_mac.data(), true, "hop_count_changed");
          }
        }
      }
      break;
    }
    case PKT_JOIN: return handle_join_(sender_mac, header, payload, payload_len, rssi, session_tag);
    case PKT_SCHEMA_PUSH: return handle_schema_push_(sender_mac, header, payload, payload_len, rssi, session_tag);
    default: return false;
  }

  BridgeSession *session = ensure_session_(header.leaf_mac);
  if (session == nullptr) return false;
  if (len > session->session_max_payload) {
    ESP_LOGW(TAG, "Dropping frame from %s: len=%u > session_max_payload=%u",
             mac_hex(header.leaf_mac).c_str(), static_cast<unsigned>(len), session->session_max_payload);
    return false;
  }
  return pkt_type == PKT_STATE ? handle_state_(sender_mac, header, payload, payload_len, rssi, session_tag) :
         pkt_type == PKT_HEARTBEAT ? handle_heartbeat_(sender_mac, header, payload, payload_len, rssi, session_tag) :
         pkt_type == PKT_ACK ? handle_ack_(sender_mac, header, payload, payload_len, rssi, session_tag) :
         false;
}

bool BridgeProtocol::handle_discover_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                                       size_t payload_len, int8_t rssi, const uint8_t *session_tag) {
  if (sender_mac == nullptr) {
    ESP_LOGD(TAG, "%s[DROP] L4 discover sender: mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac),
             sender_mac != nullptr ? sender_mac[0] : 0, sender_mac != nullptr ? sender_mac[1] : 0,
             sender_mac != nullptr ? sender_mac[2] : 0, sender_mac != nullptr ? sender_mac[3] : 0,
             sender_mac != nullptr ? sender_mac[4] : 0, sender_mac != nullptr ? sender_mac[5] : 0);
    return false;
  }
  if (payload_len != sizeof(espnow_discover_t)) {
    ESP_LOGW(TAG, "Dropping DISCOVER for %s due to payload len=%u (expected %u, protocol v%u)",
             mac_hex(header.leaf_mac).c_str(), static_cast<unsigned>(payload_len),
             static_cast<unsigned>(sizeof(espnow_discover_t)), ESPNOW_PROTOCOL_VER);
    return false;
  }
  const auto *discover = reinterpret_cast<const espnow_discover_t *>(payload);
  if (discover->network_id_len != network_id_.size()) {
    ESP_LOGD(TAG, "%s[DROP] L4 discover net_id_len: mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac),
             sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5]);
    return false;
  }
  if (memcmp(discover->network_id, network_id_.data(), network_id_.size()) != 0) {
    ESP_LOGD(TAG, "%s[DROP] L4 discover net_id: mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac),
             sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5]);
    return false;
  }
  (void)header;
  (void)rssi;
  (void)session_tag;
  BridgeSession *session = ensure_session_(header.leaf_mac);
  if (session == nullptr) return false;
  const uint32_t jitter_ms = esp_random() % (ESPNOW_DISCOVER_ANNOUNCE_JITTER_MS + 1);
  session->discover_announce_deadline_ms = millis() + jitter_ms;
  memcpy(session->discover_announce_leaf_mac.data(), sender_mac, sizeof(session->discover_announce_leaf_mac));
  return true;
}

bool BridgeProtocol::handle_join_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                                     size_t payload_len, int8_t rssi, const uint8_t *session_tag) {
  (void)session_tag;
  if (sender_mac == nullptr) {
    ESP_LOGD(TAG, "%s[DROP] L4 join sender: mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac),
             sender_mac != nullptr ? sender_mac[0] : 0, sender_mac != nullptr ? sender_mac[1] : 0,
             sender_mac != nullptr ? sender_mac[2] : 0, sender_mac != nullptr ? sender_mac[3] : 0,
             sender_mac != nullptr ? sender_mac[4] : 0, sender_mac != nullptr ? sender_mac[5] : 0);
    return false;
  }
  if (payload_len != sizeof(espnow_join_t)) {
    ESP_LOGW(TAG, "Dropping JOIN for %s due to payload len=%u (expected %u, protocol v%u)",
             mac_hex(header.leaf_mac).c_str(), static_cast<unsigned>(payload_len),
             static_cast<unsigned>(sizeof(espnow_join_t)), ESPNOW_PROTOCOL_VER);
    return false;
  }
  const auto *join = reinterpret_cast<const espnow_join_t *>(payload);
  BridgeSession *session_ptr = ensure_session_(header.leaf_mac);
  if (session_ptr == nullptr) {
    ESP_LOGD(TAG, "%s[DROP] L4 join session: mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac),
             sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5]);
    return false;
  }
  BridgeSession &session = *session_ptr;
  if (joining_in_progress_ && memcmp(header.leaf_mac, joining_leaf_mac_.data(), 6) != 0) {
    ESP_LOGW(TAG, "JOIN from %s blocked — global join slot held by %s",
             mac_hex(header.leaf_mac).c_str(), mac_hex(joining_leaf_mac_.data()).c_str());
    return send_join_ack_(sender_mac, session, 0, ESPNOW_JOIN_REASON_WAIT, 0);
  }
  if (session.join_in_progress_) {
    const bool same_remote_nonce =
        memcmp(session.remote_nonce.data(), join->remote_nonce, sizeof(join->remote_nonce)) == 0;
    const bool same_schema_hash =
        memcmp(session.schema_hash.data(), join->schema_hash, sizeof(join->schema_hash)) == 0;

    if (same_remote_nonce && same_schema_hash) {
      uint8_t retry_stage = ESPNOW_JOIN_STATUS_SCHEMA_REFRESH;
      if (session.join_complete_pending) {
        retry_stage = ESPNOW_JOIN_STATUS_COMPLETE;
      } else if (session.state_sync_pending || session.schema_received) {
        retry_stage = ESPNOW_JOIN_STATUS_SEND_STATE;
      }

      memcpy(session.next_hop_mac.data(), sender_mac, 6);
      session.last_seen_bridge_uptime_s = millis() / 1000;
      session.last_seen_counter = header.tx_counter;
      session.last_rssi = rssi;

      ESP_LOGI(TAG, "Join retry detected for %s, resending JOIN_ACK stage=%u",
               mac_hex(header.leaf_mac).c_str(), retry_stage);
      return send_join_ack_(sender_mac, session, 1, 0, retry_stage);
    }

    ESP_LOGI(TAG, "Fresh JOIN detected for %s while prior join was still in progress, restarting join state",
             mac_hex(header.leaf_mac).c_str());
    session.join_in_progress_ = false;
  }
  memcpy(session.remote_nonce.data(), join->remote_nonce, sizeof(join->remote_nonce));
  session.remote_nonce_valid = true;
  fill_random_bytes(session.bridge_nonce.data(), session.bridge_nonce.size());
  session.bridge_nonce_valid = true;
  session.join_complete_pending = false;
  session.join_complete_retry_count = 0;
  espnow_crypto_derive_session_key(session.bridge_nonce.data(), session.remote_nonce.data(), session.session_key.data());
  session.session_key_valid = true;
  const std::string prior_esphome_name = session.esphome_name;
  session.esphome_name.clear();
  session.node_label.clear();
  session.firmware_epoch = 0;
  session.project_name.clear();
  session.project_version.clear();
  session.session_max_payload = ESPNOW_V1_MAX_PAYLOAD;
  session.max_entity_fragment = ESPNOW_MAX_ENTITY_FRAGMENT_LEN;
  session.max_assembly_bytes = ESPNOW_MAX_FRAGMENT_ASSEMBLY_BYTES;
  session.max_total_fragment_bytes = ESPNOW_MAX_TOTAL_FRAGMENT_BYTES_PER_SESSION;
  session.leaf_session_flags = join->session_flags;
  if ((session.leaf_session_flags & ESPNOW_SESSION_FLAG_V2_MTU) &&
      (bridge_session_flags_ & ESPNOW_SESSION_FLAG_V2_MTU)) {
    session.session_max_payload = ESPNOW_V2_MAX_PAYLOAD;
    session.update_from_mtu();
  } else {
    session.session_max_payload = ESPNOW_V1_MAX_PAYLOAD;
  }
  memcpy(session.schema_hash.data(), join->schema_hash, sizeof(join->schema_hash));
  memcpy(session.next_hop_mac.data(), sender_mac, 6);
  session.hops_to_bridge = ESPNOW_HOPS_COUNT(header.hop_count);
  session.last_reported_hops_to_bridge = session.hops_to_bridge;
  session.remote_state = espnow_log_state_t::JOINED;
  session.last_seen_bridge_uptime_s = millis() / 1000;
  session.last_seen_counter = header.tx_counter;
  session.last_rssi = rssi;

  const std::string cache_key = !prior_esphome_name.empty() ? prior_esphome_name : schema_cache_key_(session);
  const auto hash_it = schema_hash_cache_.find(cache_key);
  const bool cached_schema_hit = hash_it != schema_hash_cache_.end() && hash_it->second == session.schema_hash;
  const uint8_t action = cached_schema_hit ? ESPNOW_JOIN_STATUS_SEND_STATE : ESPNOW_JOIN_STATUS_SCHEMA_REFRESH;
  ESP_LOGI(TAG, "[JOIN] %02X%02X%02X%02X%02X%02X recv_hash=%02X%02X%02X%02X%02X%02X%02X%02X... cached=%s action=%u",
           session.leaf_mac[0], session.leaf_mac[1], session.leaf_mac[2],
           session.leaf_mac[3], session.leaf_mac[4], session.leaf_mac[5],
           join->schema_hash[0], join->schema_hash[1], join->schema_hash[2], join->schema_hash[3],
           join->schema_hash[4], join->schema_hash[5], join->schema_hash[6], join->schema_hash[7],
           cached_schema_hit ? "valid" : "MISS", action);
  session.pending_schema_index = 0xFF;
  session.pending_schema_descriptor_type = ESPNOW_DESCRIPTOR_TYPE_ENTITY;
  session.schema_request_retries = 0;
  session.schema_request_in_flight = false;
  session.last_completed_state_message_tx_base = 0;
  session.state_sync_pending = false;
  session.state_reserved_bytes_ = 0;
  session.pending_state_assemblies.clear();
  session.schema_reserved_bytes_ = 0;
  session.pending_schema_assemblies.clear();

  if (cached_schema_hit) {
    auto cached = schema_cache_.find(cache_key);
    if (cached != schema_cache_.end()) {
      session.schema_entities = cached->second.schema_entities;
      session.esphome_name = cached->second.esphome_name;
      session.node_label = cached->second.node_label;
      session.firmware_epoch = cached->second.firmware_epoch;
      session.project_name = cached->second.project_name;
      session.project_version = cached->second.project_version;
      session.chip_model = cached->second.chip_model;
      session.build_date = cached->second.build_date;
      session.build_time = cached->second.build_time;
      session.session_max_payload = cached->second.session_max_payload;
      session.firmware_md5 = cached->second.firmware_md5;
    }
    session.schema_received = true;
    session.total_entities = static_cast<uint8_t>(session.schema_entities.size());
    if (schema_complete_fn_) schema_complete_fn_(session.leaf_mac.data(), session.total_entities);
    if (join->dirty_count == 0) {
      const bool sent = send_join_complete_(sender_mac, session);
      queue_state_log_(espnow_log_state_t::JOINED, "State: JOINED remote=%s (Complete, no dirty state)",
                       mac_hex(static_cast<const uint8_t *>(header.leaf_mac)).c_str());
      return sent;
    }
    session.state_sync_pending = true;
    session.awaiting_more_dirty_ = true;
    queue_state_log_(espnow_log_state_t::STATE_SYNC, "State: STATE_SYNC remote=%s (dirty_count=%u)",
                     mac_hex(sender_mac).c_str(), join->dirty_count);
    const bool sent = send_join_ack_(sender_mac, session, 1, 0, ESPNOW_JOIN_STATUS_SEND_STATE);
    if (!sent) {
      session.join_in_progress_ = false;
      session.online = false;
      session.remote_state = espnow_log_state_t::NONE;
      session.schema_received = false;
      session.schema_request_in_flight = false;
      session.session_key_valid = false;
      return false;
    }
    return sent;
  }

  session.schema_entities.clear();
  session.schema_received = false;
  session.pending_schema_descriptor_type = ESPNOW_DESCRIPTOR_TYPE_IDENTITY;
  session.pending_schema_index = 0;
  const bool join_ack_ok = send_join_ack_(sender_mac, session, 1, 0, ESPNOW_JOIN_STATUS_SCHEMA_REFRESH);
  if (!join_ack_ok) {
    session.join_in_progress_ = false;
    session.online = false;
    session.remote_state = espnow_log_state_t::NONE;
    session.schema_request_in_flight = false;
    session.session_key_valid = false;
    return false;
  }
  queue_state_log_(espnow_log_state_t::JOINED, "State: JOINED remote=%s (Schema Refresh)", mac_hex(static_cast<const uint8_t*>(header.leaf_mac)).c_str());
  session.schema_request_retries = 0;
  ESP_LOGI(TAG, "  [TX SCHEMA_REQUEST] Identity desc=0 to %s", mac_hex(sender_mac).c_str());
  session.schema_request_in_flight = send_schema_request_(sender_mac, session, ESPNOW_DESCRIPTOR_TYPE_IDENTITY, 0);
  if (!session.schema_request_in_flight) {
    session.join_in_progress_ = false;
    session.online = false;
    session.remote_state = espnow_log_state_t::NONE;
    session.schema_received = false;
    session.session_key_valid = false;
    return false;
  }
  session.last_schema_request_ms = millis();
  return session.schema_request_in_flight;
}

bool BridgeProtocol::handle_schema_push_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                                         size_t payload_len, int8_t, const uint8_t *session_tag) {
  BridgeSession *session_ptr = get_session(header.leaf_mac);
  if (session_ptr == nullptr) {
    ESP_LOGD(TAG, "%s[DROP] L4 schema session: mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac),
             sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5]);
    return false;
  }
  BridgeSession &session = *session_ptr;
  if (!counter_is_newer(header.tx_counter, session.last_seen_counter)) {
    ESP_LOGD(TAG, "%s[DROP] L4 schema counter: tx=%u mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac), header.tx_counter,
             sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5]);
    return false;
  }
  std::vector<uint8_t> plaintext;
  if (!validate_session_packet_(sender_mac, session, header, payload, payload_len, session_tag, plaintext)) return false;
  EntityPayloadView schema_view{};
  if (!parse_entity_payload(plaintext.data(), plaintext.size(), schema_view)) {
    ESP_LOGD(TAG, "%s[DROP] L4 schema entity: entity_id=%u mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac), schema_view.entity_index,
             sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5]);
    return false;
  }
  const uint32_t message_tx_base = fragment_message_tx_base(header, schema_view);
  const uint32_t now = millis();
  auto assembly_it = session.pending_schema_assemblies.find(schema_view.entity_index);
  if (assembly_it == session.pending_schema_assemblies.end()) {
    if (session.pending_schema_assemblies.size() >= ESPNOW_MAX_PENDING_FRAGMENT_ASSEMBLIES) {
      ESP_LOGD(TAG, "%s[DROP] L4 schema frag_limit: entity=%u mac=%02X:%02X:%02X:%02X:%02X:%02X",
               drop_prefix(sender_mac), schema_view.entity_index,
               sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5]);
      return false;
    }
    espnow_fragment_assembly_t fresh{};
    assembly_it = session.pending_schema_assemblies.emplace(schema_view.entity_index, std::move(fresh)).first;
    session.schema_reserved_bytes_ += static_cast<size_t>(schema_view.fragment_count) * session.max_entity_fragment;
  } else if (assembly_it->second.active && assembly_it->second.message_tx_base != message_tx_base &&
             assembly_it->second.message_tx_base < message_tx_base) {
    reset_fragment_assembly_(assembly_it->second);
  }
  auto &assembly = assembly_it->second;
  if (!assembly.active) {
    const size_t reserved_before = session.schema_reserved_bytes_;
    const size_t reserved_after =
        reserved_before + static_cast<size_t>(schema_view.fragment_count) * session.max_entity_fragment;
    if (reserved_after > session.max_total_fragment_bytes) {
      ESP_LOGD(TAG, "%s[DROP] L4 schema byte_cap: entity=%u mac=%02X:%02X:%02X:%02X:%02X:%02X",
               drop_prefix(sender_mac), schema_view.entity_index,
               sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5]);
      return false;
    }
  }
  if (!store_fragment_(assembly, schema_view, message_tx_base, now, session.max_entity_fragment, session.max_assembly_bytes)) {
    ESP_LOGD(TAG, "%s[DROP] L4 schema frag_store: entity=%u mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac), schema_view.entity_index,
             sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5]);
    return false;
  }
  session.last_seen_counter = std::max(session.last_seen_counter, header.tx_counter);
  session.last_seen_bridge_uptime_s = now / 1000;
  session.pending_schema_index = schema_view.entity_index;
  session.schema_request_retries = 0;
  session.last_schema_request_ms = 0;
  queue_log_(false, PKT_SCHEMA_PUSH, sender_mac, static_cast<uint16_t>(payload_len), 0, false, 0, true,
             schema_view.entity_index, session.total_entities, schema_view.fragment_index + 1, schema_view.fragment_count, 0, header.tx_counter,
              false, 0, false);
  if (!fragment_assembly_complete_(assembly)) return true;
  std::vector<uint8_t> complete = assemble_fragment_payload_(assembly, session.max_entity_fragment);
  session.schema_reserved_bytes_ -= static_cast<size_t>(assembly.fragment_count) * session.max_entity_fragment;
  session.pending_schema_assemblies.erase(schema_view.entity_index);
  if (complete.size() < 2) return false;
  if (complete[0] == ESPNOW_DESCRIPTOR_TYPE_IDENTITY) {
    IdentityDescriptorView identity{};
    uint8_t descriptor_index = 0xFF;
    if (!parse_identity_descriptor_payload(complete.data(), complete.size(), identity, descriptor_index)) return false;
    if (descriptor_index != 0) return false;
    session.esphome_name.assign(reinterpret_cast<const char *>(identity.esphome_name),
                           strnlen(reinterpret_cast<const char *>(identity.esphome_name), ESPNOW_NODE_ID_LEN));
    session.node_label.assign(reinterpret_cast<const char *>(identity.node_label),
                              strnlen(reinterpret_cast<const char *>(identity.node_label), ESPNOW_NODE_LABEL_LEN));
    session.firmware_epoch = identity.firmware_epoch;
    session.project_name.assign(reinterpret_cast<const char *>(identity.project_name),
                                strnlen(reinterpret_cast<const char *>(identity.project_name),
                                        ESPNOW_PROJECT_NAME_LEN));
    session.project_version.assign(reinterpret_cast<const char *>(identity.project_version),
                                   strnlen(reinterpret_cast<const char *>(identity.project_version),
                                           ESPNOW_PROJECT_VERSION_LEN));
    session.total_entities = identity.total_entities;
    session.chip_model = identity.chip_model;
    session.build_date.assign(reinterpret_cast<const char *>(identity.build_date),
                              strnlen(reinterpret_cast<const char *>(identity.build_date), 16));
    session.build_time.assign(reinterpret_cast<const char *>(identity.build_time),
                              strnlen(reinterpret_cast<const char *>(identity.build_time), 16));
    session.firmware_md5.fill(0);
    if (identity.firmware_md5 != nullptr) {
      memcpy(session.firmware_md5.data(), identity.firmware_md5, 16);
    }
    ESP_LOGI(TAG, "  [RX IDENTITY_PUSH] esphome_name=%s project_name=%s project_version=%s total_entities=%u identity_mtu=%u session_mtu=%u chip_model=%u from %s",
             session.esphome_name.c_str(), session.project_name.c_str(), session.project_version.c_str(),
             identity.total_entities, identity.max_frame_payload, session.session_max_payload, identity.chip_model, mac_hex(sender_mac).c_str());
    session.pending_schema_descriptor_type = ESPNOW_DESCRIPTOR_TYPE_ENTITY;
    session.pending_schema_index = 0;
    session.schema_request_retries = 0;
    std::vector<BridgeEntitySchema> stale_entities = session.schema_entities;
    if (!stale_entities.empty() && clear_entities_fn_) {
      clear_entities_fn_(session.leaf_mac.data(), stale_entities);
    }
    if (identity.total_entities == 0) {
      session.schema_received = true;
      session.schema_request_in_flight = false;
      session.pending_schema_index = 0xFF;
      refresh_schema_cache_(session);
      publish_all_entities_(session);
      if (schema_complete_fn_) schema_complete_fn_(session.leaf_mac.data(), session.total_entities);
      return send_join_complete_(sender_mac, session);
    }
    session.schema_request_in_flight =
        send_schema_request_(sender_mac, session, ESPNOW_DESCRIPTOR_TYPE_ENTITY, 0);
    if (session.schema_request_in_flight) {
      session.last_schema_request_ms = millis();
    }
    return session.schema_request_in_flight;
  }

  SchemaPushView schema_push{};
  if (!parse_schema_push_payload(complete.data(), complete.size(), schema_push)) return false;
  if (schema_push.descriptor_type != ESPNOW_DESCRIPTOR_TYPE_ENTITY) return false;
  BridgeEntitySchema entity;
  entity.entity_index = schema_push.entity_index;
  entity.entity_type = schema_push.entity_type;
  entity.entity_name.assign(reinterpret_cast<const char *>(schema_push.entity_name),
                            strnlen(reinterpret_cast<const char *>(schema_push.entity_name), 32));
  entity.entity_unit.assign(reinterpret_cast<const char *>(schema_push.entity_unit),
                            strnlen(reinterpret_cast<const char *>(schema_push.entity_unit), 8));
  entity.entity_id.assign(reinterpret_cast<const char *>(schema_push.entity_id),
                          strnlen(reinterpret_cast<const char *>(schema_push.entity_id), ESPNOW_ENTITY_ID_LEN));
  const size_t options_remaining = complete.size() - sizeof(espnow_schema_push_t);
  const size_t options_len = strnlen(reinterpret_cast<const char *>(schema_push.entity_options),
                                     std::min(options_remaining, static_cast<size_t>(ESPNOW_SCHEMA_OPTIONS_LEN)));
  entity.entity_options.assign(reinterpret_cast<const char *>(schema_push.entity_options), options_len);
  if (session.schema_entities.size() <= schema_push.entity_index) session.schema_entities.resize(schema_push.entity_index + 1);
  session.schema_entities[schema_push.entity_index] = entity;
  session.total_entities = schema_push.total_entities;
  memcpy(session.next_hop_mac.data(), sender_mac, 6);

  if (schema_push.total_entities == 0 || schema_push.entity_index + 1 >= schema_push.total_entities) {
    session.schema_received = true;
    session.schema_request_in_flight = false;
    session.pending_schema_index = 0xFF;
    session.pending_schema_descriptor_type = ESPNOW_DESCRIPTOR_TYPE_ENTITY;
    refresh_schema_cache_(session);
    publish_all_entities_(session);
    session.pending_discovery_count_ = 0;
    session.discovery_all_confirmed_ = true;
    if (schema_complete_fn_) schema_complete_fn_(session.leaf_mac.data(), session.total_entities);
    if (schema_push.total_entities == 0) return send_join_complete_(sender_mac, session);
    session.state_sync_pending = true;
    session.awaiting_more_dirty_ = true;
    const bool sent = send_join_ack_(sender_mac, session, 1, 0, ESPNOW_JOIN_STATUS_SEND_STATE);
    queue_state_log_(espnow_log_state_t::STATE_SYNC, "State: STATE_SYNC remote=%s", mac_hex(sender_mac).c_str());
    return sent;
  }
  session.awaiting_discovery_confirm = false;
  session.pending_schema_request_index = 0xFF;
  session.last_discovery_confirm_ms = 0;
  session.pending_schema_descriptor_type = ESPNOW_DESCRIPTOR_TYPE_ENTITY;
  session.pending_schema_index = schema_push.entity_index;
  session.schema_request_retries = 1;
  publish_discovery_for_entity_(session, schema_push.entity_index);
  const uint8_t next_index = static_cast<uint8_t>(schema_push.entity_index + 1);
  session.schema_request_in_flight =
      send_schema_request_(sender_mac, session, ESPNOW_DESCRIPTOR_TYPE_ENTITY, next_index);
  if (session.schema_request_in_flight) {
    session.last_schema_request_ms = millis();
  }
  return session.schema_request_in_flight;
}

bool BridgeProtocol::handle_state_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                                   size_t payload_len, int8_t rssi, const uint8_t *session_tag) {
  BridgeSession *session_ptr = get_session(header.leaf_mac);
  if (session_ptr == nullptr) {
    ESP_LOGW(TAG, "Dropping STATE from %s: no session", mac_hex(header.leaf_mac).c_str());
    return false;
  }
  BridgeSession &session = *session_ptr;
  if (!session.session_key_valid) {
    ESP_LOGW(TAG, "Dropping STATE from %s: session key invalid", mac_hex(header.leaf_mac).c_str());
    return false;
  }
  std::vector<uint8_t> plaintext;
  if (!validate_session_packet_(sender_mac, session, header, payload, payload_len, session_tag, plaintext)) {
    ESP_LOGW(TAG, "Dropping STATE from %s: session validation failed tx=%u len=%u",
             mac_hex(header.leaf_mac).c_str(), header.tx_counter, static_cast<unsigned>(payload_len));
    send_deauth_(sender_mac, session, header.packet_type, header.tx_counter, payload, payload_len);
    return false;
  }
  EntityPayloadView state{};
  if (!parse_entity_payload(plaintext.data(), plaintext.size(), state)) {
    ESP_LOGD(TAG, "%s[DROP] L4 state entity: entity_id=%u mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac), state.entity_index,
             sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5]);
    return false;
  }
  const uint32_t message_tx_base = fragment_message_tx_base(header, state);
  if (!counter_is_newer(message_tx_base, session.last_completed_state_message_tx_base)) {
    if (message_tx_base == session.last_completed_state_message_tx_base) {
      return send_state_ack_(sender_mac, session, message_tx_base, 0);
    }
    return true;
  }
  queue_log_(false, PKT_STATE, sender_mac, static_cast<uint16_t>(payload_len), rssi, false, 0, true,
             state.entity_index, session.total_entities, state.fragment_index + 1, state.fragment_count, 0, header.tx_counter,
             false, 0, false);
  const uint32_t now = millis();
  auto assembly_it = session.pending_state_assemblies.find(state.entity_index);
  if (assembly_it == session.pending_state_assemblies.end()) {
    if (session.pending_state_assemblies.size() >= ESPNOW_MAX_PENDING_FRAGMENT_ASSEMBLIES) {
      ESP_LOGD(TAG, "%s[DROP] L4 state frag_limit: entity=%u mac=%02X:%02X:%02X:%02X:%02X:%02X",
               drop_prefix(sender_mac), state.entity_index,
               sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5]);
      return false;
    }
    espnow_fragment_assembly_t fresh{};
    assembly_it = session.pending_state_assemblies.emplace(state.entity_index, std::move(fresh)).first;
    session.state_reserved_bytes_ += static_cast<size_t>(state.fragment_count) * session.max_entity_fragment;
  } else if (assembly_it->second.active && assembly_it->second.message_tx_base != message_tx_base &&
             assembly_it->second.message_tx_base < message_tx_base) {
    reset_fragment_assembly_(assembly_it->second);
  }
  auto &assembly = assembly_it->second;
  if (!assembly.active) {
    const size_t reserved_before = session.state_reserved_bytes_;
    const size_t reserved_after =
        reserved_before + static_cast<size_t>(state.fragment_count) * session.max_entity_fragment;
    if (reserved_after > session.max_total_fragment_bytes) {
      ESP_LOGD(TAG, "%s[DROP] L4 state byte_cap: entity=%u mac=%02X:%02X:%02X:%02X:%02X:%02X",
               drop_prefix(sender_mac), state.entity_index,
               sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5]);
      return false;
    }
  }
  if (!store_fragment_(assembly, state, message_tx_base, now, session.max_entity_fragment, session.max_assembly_bytes)) {
    ESP_LOGD(TAG, "%s[DROP] L4 state frag_store: entity=%u mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac), state.entity_index,
             sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5]);
    return false;
  }
  session.last_seen_counter = std::max(session.last_seen_counter, header.tx_counter);
  session.last_seen_bridge_uptime_s = now / 1000;
  if (!fragment_assembly_complete_(assembly)) return true;

  if (session.state_sync_pending) {
    session.awaiting_more_dirty_ = (assembly.flags & ESPNOW_ENTITY_FLAG_MORE_DIRTY) != 0;
  }

  BridgeEntitySchema entity;
  if (state.entity_index < session.schema_entities.size()) entity = session.schema_entities[state.entity_index];
  std::vector<uint8_t> complete = assemble_fragment_payload_(assembly, session.max_entity_fragment);
  std::string text_value;
  if (entity.entity_type == FIELD_TYPE_TEXT || entity.entity_type == FIELD_TYPE_EVENT) {
    text_value.assign(reinterpret_cast<const char *>(complete.data()), complete.size());
  }
  session.state_reserved_bytes_ -= assembly.data.size();
  session.pending_state_assemblies.erase(state.entity_index);
  if (session.remote_state == espnow_log_state_t::NORMAL && !session.online) {
    mark_online_(session, rssi, header.tx_counter);
  }
  if (publish_state_fn_) {
    publish_state_fn_(header.leaf_mac, entity, complete, static_cast<espnow_field_type_t>(entity.entity_type), text_value,
                      message_tx_base, sender_mac);
  }
  return true;
}

bool BridgeProtocol::confirm_state_delivery_(const uint8_t *leaf_mac, uint8_t entity_index, uint32_t message_tx_base,
                                             const uint8_t *next_hop_mac) {
  BridgeSession *session_ptr = get_session(leaf_mac);
  if (session_ptr == nullptr || next_hop_mac == nullptr) return false;
  BridgeSession &session = *session_ptr;

  if (counter_is_newer(message_tx_base, session.last_completed_state_message_tx_base)) {
    session.last_completed_state_message_tx_base = message_tx_base;
    if (session.state_sync_pending && !session.awaiting_more_dirty_) {
      if (session.discovery_all_confirmed_) {
        session.state_sync_pending = false;
        send_join_complete_(next_hop_mac, session);
      }
    }
  }

  if (!send_state_ack_(next_hop_mac, session, message_tx_base, 0)) {
    ESP_LOGW(TAG, "Failed to send STATE_ACK to %s for rx_counter=%u", mac_hex(leaf_mac).c_str(), message_tx_base);
    return false;
  }
  return true;
}

bool BridgeProtocol::handle_heartbeat_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                                       size_t payload_len, int8_t rssi, const uint8_t *session_tag) {
  if (sender_mac == nullptr) {
    ESP_LOGD(TAG, "%s[DROP] L4 hb sender: mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac),
             sender_mac != nullptr ? sender_mac[0] : 0, sender_mac != nullptr ? sender_mac[1] : 0,
             sender_mac != nullptr ? sender_mac[2] : 0, sender_mac != nullptr ? sender_mac[3] : 0,
             sender_mac != nullptr ? sender_mac[4] : 0, sender_mac != nullptr ? sender_mac[5] : 0);
    return false;
  }
  BridgeSession *session_ptr = get_session(header.leaf_mac);
  if (session_ptr == nullptr) {
    ESP_LOGD(TAG, "%s[DROP] L4 hb session: mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac),
             sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5]);
    return false;
  }
  BridgeSession &session = *session_ptr;
  if (!session.session_key_valid) {
    ESP_LOGD(TAG, "%s[DROP] L4 hb key: mac=%02X:%02X:%02X:%02X:%02X:%02X tx=%u",
             drop_prefix(sender_mac),
             sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5], header.tx_counter);
    return false;
  }
  if (!counter_is_newer(header.tx_counter, session.last_seen_counter)) {
    ESP_LOGD(TAG, "%s[DROP] L4 hb counter: tx=%u mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac), header.tx_counter,
             sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5]);
    return false;
  }
  std::vector<uint8_t> plaintext;
  if (!validate_session_packet_(sender_mac, session, header, payload, payload_len, session_tag, plaintext)) return false;
  if (plaintext.size() != sizeof(espnow_heartbeat_t)) {
    ESP_LOGW(TAG, "Dropping HEARTBEAT for %s due to plaintext len=%u (expected %u, protocol v%u)",
             mac_hex(header.leaf_mac).c_str(), static_cast<unsigned>(plaintext.size()),
             static_cast<unsigned>(sizeof(espnow_heartbeat_t)), ESPNOW_PROTOCOL_VER);
    return false;
  }
  session.last_seen_counter = header.tx_counter;
  session.last_seen_bridge_uptime_s = millis() / 1000;
  const auto *heartbeat = reinterpret_cast<const espnow_heartbeat_t *>(plaintext.data());
  session.uptime_seconds = heartbeat->uptime_seconds;
  session.expected_contact_interval_s = heartbeat->expected_contact_interval_seconds;
  {
    const bool parent_changed = memcmp(session.parent_mac.data(), heartbeat->parent_mac, 6) != 0;
    memcpy(session.parent_mac.data(), heartbeat->parent_mac, 6);
    session.parent_mac_hex_key = mac_hex(heartbeat->parent_mac);
    if (parent_changed && session.online && publish_topology_changed_fn_) {
      publish_topology_changed_fn_(session.leaf_mac.data(), "route_changed");
    }
  }
  session.direct_child_count = heartbeat->direct_child_count;
  session.total_child_count = heartbeat->total_child_count;
  session.last_rssi = heartbeat->remote_rssi_dbm;
  memcpy(session.next_hop_mac.data(), sender_mac, 6);
  if (session.remote_state != espnow_log_state_t::NORMAL) {
    session.remote_state = espnow_log_state_t::NORMAL;
    mark_online_(session, rssi, header.tx_counter, heartbeat->remote_rssi_dbm);
    queue_state_log_(espnow_log_state_t::NORMAL, "State: NORMAL remote=%s", mac_hex(session.leaf_mac.data()).c_str());
  }
  if (session.join_complete_pending) {
    session.join_complete_pending = false;
    session.join_complete_retry_count = 0;
    session.last_join_complete_ms = 0;
  }
  session.join_in_progress_ = false;
  return true;
}

bool BridgeProtocol::log_dropped_(const char *handler_name, const uint8_t *mac) {
  ESP_LOGD(TAG, "Bridge dropped %s from %02X%02X%02X%02X%02X%02X", handler_name, mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
  return false;
}

bool BridgeProtocol::handle_ack_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                                 size_t payload_len, int8_t rssi, const uint8_t *session_tag) {
  BridgeSession *session_ptr = get_session(header.leaf_mac);
  if (session_ptr == nullptr) {
    ESP_LOGD(TAG, "%s[DROP] L4 ack session: mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac),
             sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5]);
    return false;
  }
  BridgeSession &session = *session_ptr;
  if (!session.session_key_valid) {
    ESP_LOGD(TAG, "%s[DROP] L4 ack key: mac=%02X:%02X:%02X:%02X:%02X:%02X tx=%u",
             drop_prefix(sender_mac),
             sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5], header.tx_counter);
    return false;
  }
  if (!counter_is_newer(header.tx_counter, session.last_seen_counter)) {
    ESP_LOGD(TAG, "%s[DROP] L4 ack counter: tx=%u mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac), header.tx_counter,
             sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5]);
    return false;
  }
  std::vector<uint8_t> plaintext;
  if (!validate_session_packet_(sender_mac, session, header, payload, payload_len, session_tag, plaintext)) return false;
  session.last_seen_counter = header.tx_counter;
  session.last_seen_bridge_uptime_s = millis() / 1000;

  if (plaintext.size() < sizeof(espnow_ack_t)) {
    ESP_LOGD(TAG, "%s[DROP] L4 ack len: len=%u < %u mac=%02X:%02X:%02X:%02X:%02X:%02X",
             drop_prefix(sender_mac), static_cast<unsigned>(plaintext.size()),
             static_cast<unsigned>(sizeof(espnow_ack_t)),
             sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5]);
    return false;
  }

  const auto *ack = reinterpret_cast<const espnow_ack_t *>(plaintext.data());
  if (ack->ack_type == PKT_FILE_TRANSFER && file_ack_fn_) {
    const uint8_t *trailing = (plaintext.size() > sizeof(espnow_ack_t))
                                  ? plaintext.data() + sizeof(espnow_ack_t)
                                  : nullptr;
    const size_t trailing_len = (plaintext.size() > sizeof(espnow_ack_t))
                                    ? plaintext.size() - sizeof(espnow_ack_t)
                                    : 0;
    file_ack_fn_(session.leaf_mac.data(), *ack, trailing, trailing_len);
    const bool has_parent_check = (header.hop_count & ESPNOW_HOPS_PARENT_CHECK_BIT) != 0;
    const char *ack_label = (ack->ack_type == ACK_STATE)     ? "State" :
                             (ack->ack_type == ACK_COMMAND)   ? "Command" :
                             (ack->ack_type == PKT_CONFIG)    ? "Config" :
                             (ack->ack_type == PKT_FILE_TRANSFER) ? "File" :
                             "Unknown";
    ESP_LOGD(TAG, "%s[RX ACK (%s)] %02X%02X%02X%02X%02X%02X len=%u%s%s%s", COLOR_AQUA, ack_label,
             sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5],
             static_cast<unsigned>(plaintext.size()),
             mac_hex(session.leaf_mac.data()).c_str(), has_parent_check ? " PC" : "", COLOR_RESET);
    return true;
  }
  if (ack->ack_type == PKT_CONFIG) {
    const uint8_t command_echo = plaintext.size() > sizeof(espnow_ack_t)
                                     ? plaintext[sizeof(espnow_ack_t)]
                                     : 0;
    for (auto it = pending_configs_.begin(); it != pending_configs_.end(); ++it) {
      if (ack->ref_tx_counter == it->tx_base &&
          memcmp(session.leaf_mac.data(), it->leaf_mac.data(), 6) == 0) {
        ConfigAckResult result{};
        result.acked = true;
        result.result = plaintext.size() > sizeof(espnow_ack_t) ? ack->result : CFG_RESULT_INVALID_PAYLOAD;
        result.command_echo = command_echo;
        if (command_echo != it->command) {
          ESP_LOGW(TAG, "CONFIG ACK command mismatch for %s: expected=0x%02X echo=0x%02X",
                   mac_display(session.leaf_mac.data()).c_str(), it->command, command_echo);
          result.result = CFG_RESULT_INVALID_PAYLOAD;
        }
        auto callback = std::move(it->callback);
        pending_configs_.erase(it);
        ESP_LOGI(TAG, "CONFIG ACK from %s cmd=0x%02X result=%u ref=%u",
                 mac_display(session.leaf_mac.data()).c_str(), command_echo, result.result,
                 static_cast<unsigned>(ack->ref_tx_counter));
        if (session.remote_state == espnow_log_state_t::NORMAL && !session.online) {
          mark_online_(session, rssi, header.tx_counter);
        }
        if (callback) callback(result);
        return true;
      }
    }
    ESP_LOGW(TAG, "Unmatched CONFIG ACK from %s cmd=0x%02X ref=%u result=%u",
             mac_display(session.leaf_mac.data()).c_str(), command_echo,
             static_cast<unsigned>(ack->ref_tx_counter), ack->result);
    return true;
  }
  if (ack->ack_type == ACK_COMMAND && ack->result == 0) {
    for (auto it = command_queue_.begin(); it != command_queue_.end(); ++it) {
      if (ack->ref_tx_counter == it->tx_base &&
          memcmp(session.leaf_mac.data(), it->leaf_mac.data(), 6) == 0) {
        command_queue_.erase(it);
        break;
      }
    }
  }

  if (session.remote_state == espnow_log_state_t::NORMAL && !session.online) {
    mark_online_(session, rssi, header.tx_counter);
  }
  return plaintext.size() >= sizeof(espnow_ack_t);
}

bool BridgeProtocol::handle_deauth_(const uint8_t *mac, const espnow_frame_header_t &, const uint8_t *, size_t, int8_t) {
  return log_dropped_("handle_deauth_", mac);
}

bool BridgeProtocol::handle_schema_request_(const uint8_t *mac, const espnow_frame_header_t &, const uint8_t *, size_t, int8_t) {
  return log_dropped_("handle_schema_request_", mac);
}

void BridgeProtocol::fill_discover_announce_(espnow_discover_announce_t &announce, uint8_t hops_to_bridge) const {
  memcpy(announce.network_id, network_id_.data(), std::min(network_id_.size(), sizeof(announce.network_id)));
  announce.network_id_len = static_cast<uint8_t>(network_id_.size());
  memcpy(announce.responder_mac, bridge_mac_.data(), bridge_mac_.size());
  announce.responder_role = ESPNOW_NODE_ROLE_BRIDGE;
  announce.hops_to_bridge = hops_to_bridge;
  announce.bridge_reachable = 1;
  announce.flags = 0;
}

bool BridgeProtocol::send_discover_announce_(const uint8_t *sender_mac, const uint8_t leaf_mac[6], uint8_t hops_to_bridge) {
  espnow_discover_announce_t announce{};
  fill_discover_announce_(announce, hops_to_bridge);
  return send_plain_psk_(sender_mac, leaf_mac, PKT_DISCOVER_ANNOUNCE, downstream_hop_count_plain(bridge_session_flags_), 0,
                         reinterpret_cast<const uint8_t *>(&announce), sizeof(announce));
}

bool BridgeProtocol::send_join_ack_(const uint8_t *sender_mac, BridgeSession &session, uint8_t accepted, uint8_t reason,
                                    uint8_t schema_status) {
  espnow_join_ack_t ack{};
  ack.accepted = accepted;
  ack.reason = reason;
  ack.stage = schema_status;
  memcpy(ack.bridge_nonce, session.bridge_nonce.data(), session.bridge_nonce.size());
  ack.session_flags = bridge_session_flags_;
  if (accepted) {
    session.join_in_progress_ = true;
    if (!joining_in_progress_) {
      joining_in_progress_ = true;
      memcpy(joining_leaf_mac_.data(), session.leaf_mac.data(), 6);
      join_started_ms_ = millis();
    }
  }
  return send_plain_psk_(sender_mac, session.leaf_mac.data(), PKT_JOIN_ACK, downstream_hop_count_session(session),
                         session.tx_counter++, reinterpret_cast<const uint8_t *>(&ack), sizeof(ack));
}

bool BridgeProtocol::send_join_complete_(const uint8_t *sender_mac, BridgeSession &session, bool reset_retry_state) {
  const bool sent = send_join_ack_(sender_mac, session, 1, 0, ESPNOW_JOIN_STATUS_COMPLETE);
  session.join_complete_pending = true;
  session.join_in_progress_ = false;
  joining_in_progress_ = false;
  memset(joining_leaf_mac_.data(), 0, 6);
  join_started_ms_ = 0;
  session.last_join_complete_ms = millis();
  if (reset_retry_state) {
    session.join_complete_retry_count = 0;
  }
  return sent;
}

void BridgeProtocol::check_and_complete_join_(const uint8_t *leaf_mac) {
  BridgeSession *session = get_session(leaf_mac);
  if (session == nullptr || !session->state_sync_pending) return;
  if (session->discovery_all_confirmed_ && !session->awaiting_more_dirty_) {
    session->state_sync_pending = false;
    send_join_complete_(session->next_hop_mac.data(), *session);
  }
}

bool BridgeProtocol::get_joining_leaf_mac(uint8_t *mac_out) const {
  if (!joining_in_progress_) return false;
  memcpy(mac_out, joining_leaf_mac_.data(), 6);
  return true;
}

bool BridgeProtocol::send_state_ack_(const uint8_t *sender_mac, BridgeSession &session, uint32_t rx_counter, uint8_t result) {
  espnow_ack_t ack{};
  ack.ack_type = ACK_STATE;
  ack.result = result;
  ack.ref_tx_counter = rx_counter;
  return send_encrypted_(sender_mac, session, PKT_ACK, downstream_hop_count_session(session), reinterpret_cast<const uint8_t *>(&ack), sizeof(ack), ACK_STATE);
}

bool BridgeProtocol::send_command_ack_(const uint8_t *sender_mac, BridgeSession &session, uint8_t field_index, uint8_t result) {
  (void)field_index;
  espnow_ack_t ack{};
  ack.ack_type = ACK_COMMAND;
  ack.result = result;
  ack.ref_tx_counter = session.tx_counter;
  return send_encrypted_(sender_mac, session, PKT_ACK, downstream_hop_count_session(session), reinterpret_cast<const uint8_t *>(&ack), sizeof(ack), ACK_COMMAND);
}

bool BridgeProtocol::send_schema_request_(const uint8_t *sender_mac, BridgeSession &session, uint8_t descriptor_type,
                                          uint8_t descriptor_index) {
  const uint8_t hop_count = downstream_hop_count_session(session);
  queue_log_(true, PKT_SCHEMA_REQUEST, sender_mac,
             static_cast<uint16_t>(sizeof(espnow_schema_request_t) + sizeof(espnow_frame_header_t) + ESPNOW_SESSION_TAG_LEN),
              0, false, 0, true, descriptor_index, session.total_entities, 0, 0, 0, session.tx_counter,
              false, 0, false);
  espnow_schema_request_t request{descriptor_type, descriptor_index};
  const bool sent = send_encrypted_(sender_mac, session, PKT_SCHEMA_REQUEST, hop_count,
                                    reinterpret_cast<const uint8_t *>(&request), sizeof(request));
  session.pending_schema_descriptor_type = descriptor_type;
  session.pending_schema_index = descriptor_index;
  session.last_schema_request_ms = millis();
  return sent;
}

bool BridgeProtocol::send_command_(const uint8_t *sender_mac, BridgeSession &session, uint8_t field_index,
                                   const std::vector<uint8_t> &value, bool reset_retry_state) {
  PendingCommand cmd{};
  cmd.field_index = field_index;
  cmd.value = value;
  memcpy(cmd.leaf_mac.data(), session.leaf_mac.data(), 6);
  memcpy(cmd.next_hop_mac.data(), sender_mac, 6);
  cmd.tx_base = session.tx_counter;
  if (!send_command_fragments_(sender_mac, session, field_index, value, cmd.tx_base, true)) return false;
  cmd.last_tx_ms = millis();
  if (reset_retry_state) cmd.retry_count = 0;
  command_queue_.push_back(std::move(cmd));
  return true;
}

bool BridgeProtocol::send_command_fragments_(const uint8_t *sender_mac, BridgeSession &session, uint8_t field_index,
                                             const std::vector<uint8_t> &value, uint32_t tx_base,
                                             bool consume_tx_counter, uint8_t retry_count) {
  const uint16_t frag_size = session.max_entity_fragment;
  const size_t chunk_count =
      std::max<size_t>(1, (value.size() + frag_size - 1) / frag_size);
  const uint8_t hop_count = downstream_hop_count_session(session);
  for (size_t chunk = 0; chunk < chunk_count; chunk++) {
    const size_t offset = chunk * frag_size;
    const size_t remaining = value.size() > offset ? (value.size() - offset) : 0;
    const size_t len = std::min<size_t>(frag_size, remaining);
    const uint8_t flags = (chunk + 1 < chunk_count) ? ESPNOW_ENTITY_FLAG_MORE_FRAGMENTS : 0;
    std::vector<uint8_t> command;
    append_entity_payload(command, field_index, flags, static_cast<uint8_t>(chunk), static_cast<uint8_t>(chunk_count),
                          len > 0 ? value.data() + offset : nullptr, len);
    queue_log_(true, PKT_COMMAND, sender_mac,
               static_cast<uint16_t>(command.size() + sizeof(espnow_frame_header_t) + ESPNOW_SESSION_TAG_LEN),
               0, false, 0, true, field_index, session.total_entities,
                static_cast<uint8_t>(chunk + 1), static_cast<uint8_t>(chunk_count), retry_count, tx_base + static_cast<uint32_t>(chunk),
                false, 0, false);
    const uint32_t tx_counter = tx_base + static_cast<uint32_t>(chunk);
    if (consume_tx_counter) {
      session.tx_counter = tx_counter + 1;
    }
    if (!send_encrypted_with_tx_counter_(sender_mac, session, PKT_COMMAND, hop_count, tx_counter, command.data(), command.size())) {
      return false;
    }
    delay(SEND_YIELD_MS);
  }
  return true;
}

bool BridgeProtocol::send_deauth_(const uint8_t *sender_mac, BridgeSession &session, uint8_t response_type, uint32_t response_tx,
                                  const uint8_t *request_payload, size_t request_payload_len) {
  espnow_deauth_t deauth{};
  deauth.reason = 1;
  deauth.response_to_packet_type = response_type;
  deauth.response_to_tx_counter = response_tx;
  espnow_frame_header_t trigger{};
  trigger.protocol_version = ESPNOW_PROTOCOL_VER;
  trigger.packet_type = response_type;
  memcpy(trigger.leaf_mac, session.leaf_mac.data(), 6);
  trigger.tx_counter = response_tx;
  espnow_crypto_psk_tag(reinterpret_cast<const uint8_t *>(&trigger), request_payload, request_payload_len, deauth.request_fingerprint);
  return send_plain_psk_(sender_mac, session.leaf_mac.data(), PKT_DEAUTH, downstream_hop_count_session(session), session.tx_counter++,
                         reinterpret_cast<const uint8_t *>(&deauth), sizeof(deauth));
}

BridgeProtocol::request_fingerprint_t BridgeProtocol::compute_request_fingerprint_(uint8_t response_type, uint32_t response_tx,
                                                                                  const uint8_t *request_payload,
                                                                                  size_t request_payload_len) const {
  request_fingerprint_t fingerprint{};
  espnow_frame_header_t trigger{};
  trigger.protocol_version = ESPNOW_PROTOCOL_VER;
  trigger.packet_type = response_type;
  trigger.tx_counter = response_tx;
  espnow_crypto_psk_tag(reinterpret_cast<const uint8_t *>(&trigger), request_payload, request_payload_len, fingerprint.data());
  return fingerprint;
}

bool BridgeProtocol::send_encrypted_(const uint8_t *sender_mac, BridgeSession &session, espnow_packet_type_t type, uint8_t hop_count,
                                     const uint8_t *plaintext, size_t plaintext_len,
                                     uint8_t ack_type) {
  if (!send_fn_ || !session.session_key_valid) return false;
  if (plaintext_len > espnow_max_plaintext(session.session_max_payload)) return false;
  if (type != PKT_SCHEMA_REQUEST && type != PKT_COMMAND) {
    const bool is_ack = (type == PKT_ACK);
    queue_log_(true, type, sender_mac,
               static_cast<uint16_t>(plaintext_len + sizeof(espnow_frame_header_t) + ESPNOW_SESSION_TAG_LEN),
                0, false, 0, false, 0, 0, 0, 0, 0, session.tx_counter,
                is_ack, is_ack ? ack_type : 0,
                false);
  }
  std::vector<uint8_t> frame(sizeof(espnow_frame_header_t) + plaintext_len + ESPNOW_SESSION_TAG_LEN);
  auto *header = reinterpret_cast<espnow_frame_header_t *>(frame.data());
  header->protocol_version = ESPNOW_PROTOCOL_VER;
  header->hop_count = hop_count;
  header->packet_type = static_cast<uint8_t>(type);
  memcpy(header->leaf_mac, session.leaf_mac.data(), 6);
  header->tx_counter = session.tx_counter++;
  uint8_t *ciphertext = frame.data() + sizeof(*header);
  if (espnow_crypto_crypt(session.session_key.data(), header->tx_counter, plaintext, ciphertext, plaintext_len) != 0) {
    return false;
  }
  espnow_crypto_psk_tag(frame.data(), ciphertext, plaintext_len, header->psk_tag);
  // NOTE: PSK tag is 4 bytes (32 bits). A birthday collision is achievable with
  // ~65,000 crafted frames, giving an attacker relay-forwarding capability.
  // This is a known trade-off per protocol spec. Future protocol revision
  // should consider a longer tag (e.g., 8 bytes) if scalability is a concern.
  espnow_crypto_session_tag(session.session_key.data(), frame.data(), ciphertext, plaintext_len, frame.data() + frame.size() - ESPNOW_SESSION_TAG_LEN);
  session.tx_packets++;
  return send_fn_(sender_mac, frame.data(), frame.size());
}

esp_err_t BridgeProtocol::send_encrypted_with_tx_counter_result_(const uint8_t *sender_mac, BridgeSession &session,
                                                                 espnow_packet_type_t type, uint8_t hop_count,
                                                                 uint32_t tx_counter, const uint8_t *plaintext,
                                                                 size_t plaintext_len) {
  if ((!send_fn_ && !send_err_fn_) || !session.session_key_valid) return ESP_FAIL;
  if (plaintext_len > espnow_max_plaintext(session.session_max_payload)) return ESP_FAIL;
  const uint32_t free_heap = esp_get_free_heap_size();
  const size_t needed = sizeof(espnow_frame_header_t) + plaintext_len + ESPNOW_SESSION_TAG_LEN;
  if (free_heap < needed + 4096) {
    ESP_LOGW(TAG, "heap low %u, needed %zu, backing off", free_heap, needed);
    return ESP_ERR_ESPNOW_NO_MEM;
  }
  std::vector<uint8_t> frame(needed);
  auto *header = reinterpret_cast<espnow_frame_header_t *>(frame.data());
  header->protocol_version = ESPNOW_PROTOCOL_VER;
  header->hop_count = hop_count;
  header->packet_type = static_cast<uint8_t>(type);
  memcpy(header->leaf_mac, session.leaf_mac.data(), 6);
  header->tx_counter = tx_counter;
  uint8_t *ciphertext = frame.data() + sizeof(*header);
  if (espnow_crypto_crypt(session.session_key.data(), header->tx_counter, plaintext, ciphertext, plaintext_len) != 0) {
    return ESP_FAIL;
  }
  espnow_crypto_psk_tag(frame.data(), ciphertext, plaintext_len, header->psk_tag);
  espnow_crypto_session_tag(session.session_key.data(), frame.data(), ciphertext, plaintext_len,
                            frame.data() + frame.size() - ESPNOW_SESSION_TAG_LEN);
  session.tx_packets++;
  esp_err_t err = ESP_FAIL;
  if (send_err_fn_) {
    err = send_err_fn_(sender_mac, frame.data(), frame.size());
  } else if (send_fn_(sender_mac, frame.data(), frame.size())) {
    err = ESP_OK;
  }
  delay(SEND_YIELD_MS);
  return err;
}

bool BridgeProtocol::send_encrypted_with_tx_counter_(const uint8_t *sender_mac, BridgeSession &session,
                                                     espnow_packet_type_t type, uint8_t hop_count,
                                                     uint32_t tx_counter, const uint8_t *plaintext,
                                                     size_t plaintext_len) {
  return send_encrypted_with_tx_counter_result_(sender_mac, session, type, hop_count, tx_counter, plaintext,
                                                plaintext_len) == ESP_OK;
}

bool BridgeProtocol::send_plain_psk_(const uint8_t *sender_mac, const uint8_t leaf_mac[6], espnow_packet_type_t type,
                                     uint8_t hop_count, uint32_t tx_counter, const uint8_t *payload, size_t payload_len) {
  if (!send_fn_) return false;
  if (type == PKT_DISCOVER_ANNOUNCE) {
    uint8_t ch = 0;
    wifi_second_chan_t sec = WIFI_SECOND_CHAN_NONE;
    esp_wifi_get_channel(&ch, &sec);
    queue_log_(true, type, sender_mac,
               static_cast<uint16_t>(sizeof(espnow_frame_header_t) + payload_len),
                0, true, ch, false, 0, 0, 0, 0, 0, tx_counter,
                false, 0, false);
  } else {
    queue_log_(true, type, sender_mac,
               static_cast<uint16_t>(sizeof(espnow_frame_header_t) + payload_len),
                0, false, 0, false, 0, 0, 0, 0, 0, tx_counter,
                false, 0, false);
  }
  std::vector<uint8_t> frame(sizeof(espnow_frame_header_t) + payload_len);
  auto *header = reinterpret_cast<espnow_frame_header_t *>(frame.data());
  header->protocol_version = ESPNOW_PROTOCOL_VER;
  header->hop_count = hop_count;
  header->packet_type = static_cast<uint8_t>(type);
  memcpy(header->leaf_mac, leaf_mac, 6);
  header->tx_counter = tx_counter;
  memcpy(frame.data() + sizeof(*header), payload, payload_len);
  espnow_crypto_psk_tag(frame.data(), frame.data() + sizeof(*header), payload_len, header->psk_tag);
  const bool ok = send_fn_(sender_mac, frame.data(), frame.size());
  delay(SEND_YIELD_MS);
  return ok;
}

void BridgeProtocol::mark_online_(BridgeSession &session, int8_t rssi, uint32_t tx_counter, int8_t remote_reported_rssi) {
  const bool first_join = (session.joined_ms == 0);
  session.online = true;
  session.last_seen_counter = tx_counter;
  session.joined_ms = millis();
  session.last_rssi = remote_reported_rssi != 0 ? remote_reported_rssi : rssi;
  session.last_offline_reason.clear();
  if (publish_availability_fn_) publish_availability_fn_(session.leaf_mac.data(), true, first_join ? "joined" : "rejoined");
  if (publish_topology_changed_fn_) publish_topology_changed_fn_(session.leaf_mac.data(), "node_joined");
}

void BridgeProtocol::refresh_schema_cache_(BridgeSession &session) {
  const std::string cache_key = schema_cache_key_(session);
  schema_cache_[cache_key] = {session.schema_entities, session.esphome_name,
                               session.node_label, session.firmware_epoch,
                               session.build_date, session.build_time,
                               session.project_name, session.project_version,
                               session.session_max_payload, session.chip_model,
                               session.firmware_md5};
  schema_hash_cache_[cache_key] = session.schema_hash;
}

void BridgeProtocol::publish_discovery_for_entity_(BridgeSession &session, uint8_t entity_index) {
  if (!publish_discovery_fn_ || entity_index >= session.schema_entities.size()) return;
  auto &entity = session.schema_entities[entity_index];
  if (entity.entity_type == 0) return;
  const auto type = static_cast<espnow_field_type_t>(entity.entity_type);
  switch (type) {
    case FIELD_TYPE_CLIMATE:
    case FIELD_TYPE_HUMIDIFIER:
    case FIELD_TYPE_DEHUMIDIFIER:
    case FIELD_TYPE_TIME:
    case FIELD_TYPE_DATETIME:
      ESP_LOGD(TAG, "Skipping unimplemented entity type 0x%02X for entity %u", type, entity.entity_index);
      return;
    default:
      break;
  }
  const bool is_commandable = !(type == FIELD_TYPE_SENSOR || type == FIELD_TYPE_BINARY || type == FIELD_TYPE_BUTTON ||
                                type == FIELD_TYPE_EVENT || type == FIELD_TYPE_TEXT_SENSOR);
  publish_discovery_fn_(session.leaf_mac.data(), entity, session.total_entities, is_commandable);
}

void BridgeProtocol::publish_all_entities_(BridgeSession &session) {
  if (!publish_discovery_fn_) return;
  for (const auto &entity : session.schema_entities) {
    if (entity.entity_type == 0) continue;
    const auto type = static_cast<espnow_field_type_t>(entity.entity_type);
    switch (type) {
      case FIELD_TYPE_CLIMATE:
      case FIELD_TYPE_HUMIDIFIER:
      case FIELD_TYPE_DEHUMIDIFIER:
      case FIELD_TYPE_TIME:
      case FIELD_TYPE_DATETIME:
        ESP_LOGD(TAG, "Skipping unimplemented entity type 0x%02X for entity %u", type, entity.entity_index);
        continue;
      default:
        break;
    }
    const bool is_commandable = !(type == FIELD_TYPE_SENSOR || type == FIELD_TYPE_BINARY || type == FIELD_TYPE_BUTTON ||
                                  type == FIELD_TYPE_EVENT || type == FIELD_TYPE_TEXT_SENSOR);
    publish_discovery_fn_(session.leaf_mac.data(), entity, session.total_entities, is_commandable);
  }
}

void BridgeProtocol::on_discovery_confirmed_(const uint8_t *mac, uint8_t entity_index, bool success) {
  BridgeSession *session = get_session(mac);
  if (session == nullptr) return;
  const uint8_t *next_hop_mac = session->next_hop_mac.data();

  const uint32_t now = millis();

  if (!session->awaiting_discovery_confirm) {
    if (success && session->pending_discovery_count_ > 0) {
      session->pending_discovery_count_--;
      if (session->pending_discovery_count_ == 0) {
        session->discovery_all_confirmed_ = true;
      }
    }
    return;
  }

  if (!success || now - session->last_discovery_confirm_ms > ESPNOW_MQTT_CONFIRM_TIMEOUT_MS) {
    if (!success) {
      ESP_LOGW(TAG, "Discovery MQTT publish failed for entity %u, re-requesting", entity_index);
    } else {
      ESP_LOGW(TAG, "Discovery MQTT timeout for entity %u, re-requesting", entity_index);
    }
    session->schema_request_retries = 1;
    session->schema_request_in_flight =
        send_schema_request_(next_hop_mac, *session, ESPNOW_DESCRIPTOR_TYPE_ENTITY, entity_index);
    session->last_schema_request_ms = now;
    session->last_discovery_confirm_ms = now;
    return;
  }

  if (session->pending_discovery_count_ > 0) {
    session->pending_discovery_count_--;
    if (session->pending_discovery_count_ == 0) {
      session->discovery_all_confirmed_ = true;
    }
  }

  if (!session->awaiting_discovery_confirm) return;
  session->awaiting_discovery_confirm = false;

  if (session->pending_schema_request_index == 0xFF) {
    return;
  }

  uint8_t next_index = session->pending_schema_request_index;
  session->schema_request_retries = 1;
  session->schema_request_in_flight =
      send_schema_request_(next_hop_mac, *session, ESPNOW_DESCRIPTOR_TYPE_ENTITY, next_index);
  session->last_schema_request_ms = now;
}

bool BridgeProtocol::evict_sessions_for_ram_(bool aggressive) {
  const uint32_t free_heap = esp_get_free_heap_size();
  const uint32_t total_heap = heap_caps_get_total_size(MALLOC_CAP_DEFAULT);
  const float free_pct = static_cast<float>(free_heap) / static_cast<float>(total_heap);
  const float threshold = aggressive ? RAM_CRITICAL_PCT : RAM_WARNING_PCT;

  if (free_pct >= threshold) {
    return false;
  }

  const uint32_t target_free = free_heap + RAM_EVICTION_BUFFER_BYTES;
  ESP_LOGW(TAG, "%sRAM %s: %.1f%% free, evicting sessions", aggressive ? COLOR_RED : COLOR_YELLOW,
           aggressive ? "critical" : "warning", free_pct * 100);

  // Build candidate list from current sessions
  std::array<std::pair<uint64_t, uint32_t>, MAX_SESSIONS> candidates{};
  size_t candidate_count = 0;
  for (auto &entry : sessions_) {
    candidates[candidate_count++] = {entry.first, entry.second.last_seen_bridge_uptime_s};
  }

  // Sort by last_seen_ms ascending (oldest first)
  std::sort(candidates.begin(), candidates.begin() + candidate_count,
            [](const auto &a, const auto &b) { return a.second < b.second; });

  uint32_t evicted_count = 0;
  const uint32_t start_free = free_heap;

  for (size_t i = 0; i < candidate_count; ++i) {
    // Recheck free heap dynamically
    if (esp_get_free_heap_size() >= target_free) {
      break;
    }
    if (sessions_.size() - evicted_count <= MIN_SESSIONS_TO_PROTECT) {
      break;
    }

    auto it = sessions_.find(candidates[i].first);
    if (it == sessions_.end()) {
      continue;
    }

    auto &session = it->second;
    bool has_active = !session.pending_state_assemblies.empty() || !session.pending_schema_assemblies.empty();

    if (!aggressive && has_active) {
      continue;
    }

    const uint32_t age_s = (millis() / 1000) - session.last_seen_bridge_uptime_s;
    ESP_LOGW(TAG, "%sEvicting session %02X%02X%02X%02X%02X%02X (age %us, online=%d, active_asm=%d)",
             COLOR_YELLOW, session.leaf_mac[0], session.leaf_mac[1], session.leaf_mac[2],
             session.leaf_mac[3], session.leaf_mac[4], session.leaf_mac[5], age_s,
             session.online ? 1 : 0, has_active ? 1 : 0);

    // Publish offline status and clear entities before erasing
    if (session.online && publish_availability_fn_) {
      publish_availability_fn_(session.leaf_mac.data(), false, "evicted");
    }
    if (publish_topology_changed_fn_) {
      publish_topology_changed_fn_(session.leaf_mac.data(), "node_removed");
    }
    if (clear_entities_fn_) {
      clear_entities_fn_(session.leaf_mac.data(), session.schema_entities);
    }
    std::string cache_key = schema_cache_key_(session);
    schema_cache_.erase(cache_key);
    schema_hash_cache_.erase(cache_key);
    sessions_.erase(it);
    evicted_count++;
  }

  if (evicted_count > 0) {
    const uint32_t freed_heap = esp_get_free_heap_size();
    const uint32_t actual_freed = start_free > freed_heap ? start_free - freed_heap : 0;
    ESP_LOGI(TAG, "%sRAM eviction: freed %u bytes, removed %u sessions", COLOR_YELLOW, actual_freed, evicted_count);
  }

  return evicted_count > 0;
}

void BridgeProtocol::loop() {
  const uint32_t now = millis();
  if (last_uptime_tick_ms_ == 0) last_uptime_tick_ms_ = now;
  if (now > last_uptime_tick_ms_) {
    bridge_uptime_s_ += (now - last_uptime_tick_ms_) / 1000U;
    last_uptime_tick_ms_ = now - ((now - last_uptime_tick_ms_) % 1000U);
  }
  if (now - last_session_cleanup_ms_ >= SESSION_CLEANUP_INTERVAL_MS) {
    last_session_cleanup_ms_ = now;
    evict_sessions_for_ram_(false);
    if (sessions_.size() > MAX_SESSIONS) {
      for (auto it = sessions_.begin(); it != sessions_.end();) {
        if (!it->second.online) {
          // Clear entities and erase — already offline, no availability transition
          if (publish_topology_changed_fn_) {
            publish_topology_changed_fn_(it->second.leaf_mac.data(), "node_removed");
          }
          if (clear_entities_fn_) {
            clear_entities_fn_(it->second.leaf_mac.data(), it->second.schema_entities);
          }
          std::string cache_key = schema_cache_key_(it->second);
          schema_cache_.erase(cache_key);
          schema_hash_cache_.erase(cache_key);
          it = sessions_.erase(it);
          if (sessions_.size() <= MAX_SESSIONS) break;
        } else {
          ++it;
        }
      }
    }
    // Prune stale schema assemblies at idle path (between sessions)
    for (auto &entry : sessions_) {
      auto &session = entry.second;
      for (auto it = session.pending_schema_assemblies.begin(); it != session.pending_schema_assemblies.end();) {
        if (it->second.active && now - it->second.last_seen_ms >= ESPNOW_FRAGMENT_ASSEMBLY_TIMEOUT_MS) {
          ESP_LOGW(TAG, "Dropping expired SCHEMA fragments for entity %u (idle prune)", it->first);
          session.schema_reserved_bytes_ -= static_cast<size_t>(it->second.fragment_count) * session.max_entity_fragment;
          it = session.pending_schema_assemblies.erase(it);
        } else {
          ++it;
        }
      }
    }
  }
  for (auto &entry : sessions_) {
    auto &session = entry.second;
    for (auto it = session.pending_state_assemblies.begin(); it != session.pending_state_assemblies.end();) {
      if (it->second.active && now - it->second.last_seen_ms >= ESPNOW_FRAGMENT_ASSEMBLY_TIMEOUT_MS) {
        ESP_LOGW(TAG, "Dropping expired STATE fragments for entity %u", it->first);
        session.state_reserved_bytes_ -= it->second.data.size();
        it = session.pending_state_assemblies.erase(it);
      } else {
        ++it;
      }
    }
    for (auto it = session.pending_schema_assemblies.begin(); it != session.pending_schema_assemblies.end();) {
      if (it->second.active && now - it->second.last_seen_ms >= ESPNOW_FRAGMENT_ASSEMBLY_TIMEOUT_MS) {
        ESP_LOGW(TAG, "Dropping expired SCHEMA fragments for entity %u", it->first);
        session.schema_reserved_bytes_ -= static_cast<size_t>(it->second.fragment_count) * session.max_entity_fragment;
        it = session.pending_schema_assemblies.erase(it);
      } else {
        ++it;
      }
    }
    if (session.online) {
      const uint32_t timeout_ms = std::max<uint32_t>(
          heartbeat_interval_ * 1000U + OFFLINE_TIMEOUT_GRACE_MS,
          session.expected_contact_interval_s > 0
              ? session.expected_contact_interval_s * 3000U + OFFLINE_TIMEOUT_GRACE_MS
              : heartbeat_interval_ * 3000U + OFFLINE_TIMEOUT_GRACE_MS);
      if (session.last_seen_bridge_uptime_s > 0 && (now / 1000) - session.last_seen_bridge_uptime_s > timeout_ms / 1000) {
        ESP_LOGW(TAG, "%sSession timeout for %02X%02X%02X%02X%02X%02X", COLOR_YELLOW,
                 session.leaf_mac[0], session.leaf_mac[1], session.leaf_mac[2],
                 session.leaf_mac[3], session.leaf_mac[4], session.leaf_mac[5]);
        session.online = false;
        session.remote_state = espnow_log_state_t::NONE;
        session.last_offline_reason = "timeout";
        if (publish_availability_fn_) publish_availability_fn_(session.leaf_mac.data(), false, "timeout");
        if (publish_topology_changed_fn_) publish_topology_changed_fn_(session.leaf_mac.data(), "node_offline");
      }
    }
    if (session.online && !session.schema_received && session.schema_request_in_flight &&
        session.last_schema_request_ms > 0) {
      const uint32_t schema_jitter = esp_random() % (ESPNOW_RETRY_JITTER_MS * 2 + 1);
      if (now - session.last_schema_request_ms >=
          RETRY_BACKOFF_MS[std::min<size_t>(session.schema_request_retries, 3)] + schema_jitter) {
        if (session.schema_request_retries < ESPNOW_MAX_RETRIES) {
          session.schema_request_retries++;
          session.schema_request_in_flight =
              send_schema_request_(session.next_hop_mac.data(), session, session.pending_schema_descriptor_type,
                                   session.pending_schema_index);
        } else {
          session.online = false;
          session.remote_state = espnow_log_state_t::NONE;
          session.schema_request_in_flight = false;
          session.session_key_valid = false;
          session.join_in_progress_ = false;
          session.last_offline_reason = "timeout";
          if (publish_availability_fn_) publish_availability_fn_(session.leaf_mac.data(), false, "timeout");
          if (publish_topology_changed_fn_) publish_topology_changed_fn_(session.leaf_mac.data(), "node_offline");
        }
      }
    }
    if (session.state_sync_pending && !session.join_complete_pending &&
        session.last_seen_bridge_uptime_s > 0 && (now / 1000) - session.last_seen_bridge_uptime_s >= ESPNOW_STATE_SYNC_TIMEOUT_MS / 1000) {
      ESP_LOGW(TAG, "%sState sync timeout for %02X%02X%02X%02X%02X%02X, resetting join state%s", COLOR_YELLOW,
               session.leaf_mac[0], session.leaf_mac[1], session.leaf_mac[2],
               session.leaf_mac[3], session.leaf_mac[4], session.leaf_mac[5], COLOR_RESET);
      session.state_sync_pending = false;
      session.join_in_progress_ = false;
      session.pending_state_assemblies.clear();
      session.state_reserved_bytes_ = 0;
    }
  if (session.join_complete_pending) {
      const uint32_t join_complete_jitter = esp_random() % (ESPNOW_RETRY_JITTER_MS * 2 + 1);
      if (session.last_join_complete_ms > 0 &&
          now - session.last_join_complete_ms >=
              RETRY_BACKOFF_MS[std::min<size_t>(session.join_complete_retry_count, 3)] + join_complete_jitter) {
        if (session.join_complete_retry_count < ESPNOW_MAX_RETRIES) {
          if (send_join_complete_(session.next_hop_mac.data(), session, false)) {
            session.join_complete_retry_count++;
          } else {
            ESP_LOGW(TAG, "JOIN complete send failed for %02X%02X%02X%02X%02X%02X, retrying",
                     session.leaf_mac[0], session.leaf_mac[1], session.leaf_mac[2],
                     session.leaf_mac[3], session.leaf_mac[4], session.leaf_mac[5]);
          }
        } else {
          ESP_LOGW(TAG, "JOIN completion timeout for %02X%02X%02X%02X%02X%02X after %u retries",
                   session.leaf_mac[0], session.leaf_mac[1], session.leaf_mac[2],
                   session.leaf_mac[3], session.leaf_mac[4], session.leaf_mac[5], session.join_complete_retry_count);
          session.join_complete_pending = false;
          session.join_complete_retry_count = 0;
          session.last_join_complete_ms = 0;
          session.join_in_progress_ = false;
          session.online = false;
          session.remote_state = espnow_log_state_t::NONE;
          session.schema_request_in_flight = false;
          session.last_offline_reason = "timeout";
          if (publish_availability_fn_) publish_availability_fn_(session.leaf_mac.data(), false, "timeout");
          if (publish_topology_changed_fn_) publish_topology_changed_fn_(session.leaf_mac.data(), "node_offline");
          if (clear_entities_fn_) clear_entities_fn_(session.leaf_mac.data(), session.schema_entities);
        }
      }
    }
  }
  if (joining_in_progress_ && join_started_ms_ > 0 && now - join_started_ms_ >= 45000) {
    ESP_LOGW(TAG, "Global join slot timed out for %s", mac_hex(joining_leaf_mac_.data()).c_str());
    joining_in_progress_ = false;
    memset(joining_leaf_mac_.data(), 0, 6);
    join_started_ms_ = 0;
  }
  // Process pending discover_announce with jitter deadline
  for (auto &entry : sessions_) {
    auto &session = entry.second;
    if (session.discover_announce_deadline_ms > 0 && now >= session.discover_announce_deadline_ms) {
      if (!session.discover_announce_leaf_mac.empty()) {
        send_discover_announce_(session.discover_announce_leaf_mac.data(), session.leaf_mac.data(), 0);
      }
      session.discover_announce_deadline_ms = 0;
      session.discover_announce_leaf_mac.fill(0);
    }
  }
  const uint32_t free_heap = esp_get_free_heap_size();
  const uint32_t total_heap = heap_caps_get_total_size(MALLOC_CAP_DEFAULT);
  if (free_heap < total_heap * RAM_CRITICAL_PCT) {
    evict_sessions_for_ram_(true);
  }
  // Config queue processing: retry until the remote sends PKT_ACK(ack_type=PKT_CONFIG).
  for (auto it = pending_configs_.begin(); it != pending_configs_.end();) {
    if (now < it->next_retry_ms) {
      ++it;
      continue;
    }

    if (it->retry_count >= CONFIG_MAX_RETRIES) {
      ESP_LOGW(TAG, "CONFIG timeout for %s cmd=0x%02X after %u retries",
               mac_display(it->leaf_mac.data()).c_str(), it->command, it->retry_count);
      ConfigAckResult result{};
      result.timed_out = true;
      result.command_echo = it->command;
      auto callback = std::move(it->callback);
      it = pending_configs_.erase(it);
      if (callback) callback(result);
      continue;
    }

    BridgeSession *session = get_session(it->leaf_mac.data());
    if (session == nullptr || !session->online || !session->session_key_valid) {
      ESP_LOGW(TAG, "CONFIG session lost for %s cmd=0x%02X",
               mac_display(it->leaf_mac.data()).c_str(), it->command);
      ConfigAckResult result{};
      result.no_session = true;
      result.command_echo = it->command;
      auto callback = std::move(it->callback);
      it = pending_configs_.erase(it);
      if (callback) callback(result);
      continue;
    }

    it->retry_count++;
    memcpy(it->next_hop_mac.data(), session->next_hop_mac.data(), it->next_hop_mac.size());
    if (!send_config_frame_(*session, *it, it->retry_count)) {
      ESP_LOGW(TAG, "CONFIG retry send failed for %s cmd=0x%02X retry=%u",
               mac_display(it->leaf_mac.data()).c_str(), it->command, it->retry_count);
    }
    it->next_retry_ms = now + it->ack_timeout_ms;
    ++it;
  }
  // Command queue processing: retry failed commands
  for (auto it = command_queue_.begin(); it != command_queue_.end();) {
    if (it->retry_count >= COMMAND_MAX_RETRIES) {
      ESP_LOGW(TAG, "COMMAND timeout for %s entity=%u after %u retries, marking offline",
               mac_display(it->leaf_mac.data()).c_str(), it->field_index, it->retry_count);
      BridgeSession *session = get_session(it->leaf_mac.data());
      if (session != nullptr) {
        session->online = false;
        session->last_offline_reason = "timeout";
        if (publish_availability_fn_) {
          publish_availability_fn_(it->leaf_mac.data(), false, "timeout");
        }
        if (publish_topology_changed_fn_) {
          publish_topology_changed_fn_(it->leaf_mac.data(), "node_offline");
        }
      }
      it = command_queue_.erase(it);
      continue;
    }
    const uint32_t jitter = esp_random() % (ESPNOW_RETRY_JITTER_MS * 2 + 1);
    if (now - it->last_tx_ms >= RETRY_BACKOFF_MS[it->retry_count] + jitter) {
      BridgeSession *session = get_session(it->leaf_mac.data());
      if (session == nullptr || !session->online || !session->session_key_valid) {
        it = command_queue_.erase(it);
        continue;
      }
      if (!send_command_fragments_(it->next_hop_mac.data(), *session, it->field_index, it->value, it->tx_base, false, it->retry_count)) {
        if (it->retry_count == 2) {
          ESP_LOGI(TAG, "COMMAND retry %u/%u for %s entity=%u",
                   it->retry_count + 1, COMMAND_MAX_RETRIES + 1,
                   mac_display(it->leaf_mac.data()).c_str(), it->field_index);
        }
      }
      it->retry_count++;
      it->last_tx_ms = now;
    }
    ++it;
  }

  const uint8_t online_count = get_active_remote_count();
  if (publish_bridge_diag_fn_ &&
      (now - last_diag_publish_ms_ >= DIAG_PUBLISH_INTERVAL_MS || online_count != last_diag_online_count_)) {
    last_diag_publish_ms_ = now;
    last_diag_online_count_ = online_count;
    publish_bridge_diag_fn_(bridge_uptime_s_, online_count);
  }
}

}  // namespace esp_tree
}  // namespace esphome
