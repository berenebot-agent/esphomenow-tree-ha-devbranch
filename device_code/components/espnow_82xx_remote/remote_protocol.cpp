#include "remote_protocol.h"

#include "esphome/core/defines.h"
#include "esphome/core/log.h"
#include "esphome/core/hal.h"
#include "esphome/components/wifi/wifi_component.h"

#if defined(ARDUINO_ARCH_ESP8266)
// ESP8266 Arduino — most low-level wifi/esp IDf headers not available.
// Channel ops handled via wifi_set_channel/wifi_get_channel (non-OS SDK).
#else
// ESP-IDF (ESP32) — use native headers.
#include <esp_random.h>
#include <esp_system.h>
#include <esp_wifi.h>
#include <esp_ota_ops.h>
#include <esp_app_desc.h>
#endif

#include <algorithm>
#include <array>
#include <cstring>
#include <cstdlib>
#include <cstdarg>
#include <vector>

// TODO: HMAC-SHA256 for ESP8266 — this file references mbedtls/OpenSSL only
// for the static sha256_bytes() helper. The actual HMAC-SHA256 path used by
// the crypto layer lives in esp_tree_common/espnow_crypto.cpp. If a platform-
// specific SHA-256 is needed here, guard accordingly.
#if defined(ARDUINO_ARCH_ESP8266)
// ESP8266 SHA-256 via BearSSL (bundled with Arduino-ESP8266)
#include <bearssl/bearssl_hash.h>
#elif defined(ESP_PLATFORM)
#include <mbedtls/md.h>
#elif !defined(ARDUINO_ARCH_ESP8266)
#include <openssl/sha.h>
#endif

namespace esphome {
namespace esp_tree {

static const char *const TAG = "espnow";
static const char *const COLOR_RED    = "\x1b[31m";
static const char *const COLOR_YELLOW = "\x1b[33m";
static const char *const COLOR_AQUA  = "\x1b[36m";
static const char *const COLOR_GREEN = "\x1b[32m";
static const char *const COLOR_RESET = "\x1b[0m";

namespace {

static constexpr uint32_t OTA_SESSION_TIMEOUT_MS = 30000U;

uint32_t elapsed_ms_since(uint32_t now, uint32_t then) {
  if (then == 0 || now < then) {
    return 0;
  }
  return now - then;
}

uint8_t sweep_channel_from_index(uint8_t channel_index) {
  return static_cast<uint8_t>((channel_index % 13U) + 1U);
}

uint32_t discover_backoff_delay_ms(uint8_t stage) {
  static constexpr uint32_t kBackoff[] = {
      ESPNOW_DISCOVER_BACKOFF_START_MS,
      ESPNOW_DISCOVER_BACKOFF_2_MS,
      ESPNOW_DISCOVER_BACKOFF_3_MS,
      ESPNOW_DISCOVER_BACKOFF_4_MS,
      ESPNOW_DISCOVER_BACKOFF_CAP_MS,
  };
  if (stage >= (sizeof(kBackoff) / sizeof(kBackoff[0]))) {
    return kBackoff[sizeof(kBackoff) / sizeof(kBackoff[0]) - 1];
  }
  return kBackoff[stage];
}

#if defined(ARDUINO_ARCH_ESP8266)
static int set_wifi_channel_with_recovery(uint8_t channel, const char *context) {
  (void) context;
  // ESP8266 non-OS SDK: wifi_set_channel() sets the channel directly.
  wifi_set_channel(channel);
  return 0;
}
#else
esp_err_t set_wifi_channel_with_recovery(uint8_t channel, const char *context) {
  esp_err_t err = esp_wifi_set_channel(channel, WIFI_SECOND_CHAN_NONE);
  if (err == ESP_ERR_WIFI_NOT_STARTED) {
    ESP_LOGW(TAG, "esp_wifi_set_channel(%u) hit WIFI_NOT_STARTED during %s; starting WiFi and retrying",
             channel, context != nullptr ? context : "unknown");
    const esp_err_t start_err = esp_wifi_start();
    if (start_err != ESP_OK && start_err != ESP_ERR_WIFI_CONN) {
      ESP_LOGW(TAG, "esp_wifi_start failed during %s recovery: err=%d", context != nullptr ? context : "unknown",
               static_cast<int>(start_err));
      return err;
    }
    err = esp_wifi_set_channel(channel, WIFI_SECOND_CHAN_NONE);
  }
  return err;
}
#endif

}  // namespace

void RemoteProtocol::queue_log_(bool tx, espnow_packet_type_t type, const uint8_t *mac, uint16_t length, int8_t rssi,
                                bool show_channel, uint8_t ch, bool show_entity, uint8_t entity_idx, uint8_t entity_tot,
                                uint8_t chunk_idx, uint8_t chunk_tot, uint32_t rtt_ms, int8_t allowed,
                                uint8_t hops, uint8_t retry_count, uint32_t pkt_uid, bool parent_check) {
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
  entry.rtt_ms = rtt_ms;
  entry.allowed = allowed;
  entry.hops = hops;
  entry.retry_count = retry_count;
  entry.pkt_uid = pkt_uid;
  entry.parent_check = parent_check;
  log_head_ = (log_head_ + 1) % PACKET_LOG_SIZE;
  log_count_++;
}

void RemoteProtocol::queue_state_log_(espnow_log_state_t state, const char *fmt, ...) {
  va_list args;
  va_start(args, fmt);
  vsnprintf(pending_state_log_msg_, sizeof(pending_state_log_msg_), fmt, args);
  va_end(args);
  pending_state_ = state;
}

void RemoteProtocol::flush_log_queue() {
  if (pending_state_ != espnow_log_state_t::NONE) {
    const char *color = nullptr;
    switch (pending_state_) {
      case espnow_log_state_t::DISCOVERING:
        color = COLOR_YELLOW;
        break;
      case espnow_log_state_t::JOINING:
      case espnow_log_state_t::JOINED:
        color = COLOR_AQUA;
        break;
      case espnow_log_state_t::STATE_SYNC:
        color = COLOR_AQUA;
        break;
      case espnow_log_state_t::NORMAL:
      case espnow_log_state_t::PROVIDING_RELAY:
        color = COLOR_GREEN;
        break;
      default:
        break;
    }
    ESP_LOGI(TAG, " %s%s%s", color ? color : "", pending_state_log_msg_, COLOR_RESET);
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
    char uid_suffix[12] = "";
    if (entry.pkt_uid != 0) {
      snprintf(uid_suffix, sizeof(uid_suffix), " #%06X", entry.pkt_uid & 0xFFFFFF);
    }
    if (entry.show_entity) {
      if (is_deauth) {
        if (entry.chunk_total > 1) {
          ESP_LOGW(TAG, " %s[%s %s] Entity %u/%u (%u/%u)%s%s%s", COLOR_YELLOW,
                   entry.tx ? "TX" : "RX", packet_type_name(entry.type),
                   entry.entity_index + 1, entry.entity_total, entry.chunk_index, entry.chunk_total, uid_suffix, retry_suffix, COLOR_RESET);
        } else {
          ESP_LOGW(TAG, " %s[%s %s] Entity %u/%u%s%s%s", COLOR_YELLOW,
                   entry.tx ? "TX" : "RX", packet_type_name(entry.type),
                   entry.entity_index + 1, entry.entity_total, uid_suffix, retry_suffix, COLOR_RESET);
        }
      } else {
        const char *entity_name = nullptr;
        if (entry.entity_index < entity_records_.size()) {
          entity_name = entity_records_[entry.entity_index].schema.entity_name.c_str();
        }
        if (entry.chunk_total > 1) {
          if (entity_name && *entity_name) {
            ESP_LOGD(TAG, " %s[%s %s] Entity %u/%u (%u/%u): %s%s%s%s", COLOR_AQUA,
                     entry.tx ? "TX" : "RX", packet_type_name(entry.type),
                     entry.entity_index + 1, entry.entity_total, entry.chunk_index, entry.chunk_total, entity_name, uid_suffix, retry_suffix, COLOR_RESET);
          } else {
            ESP_LOGD(TAG, " %s[%s %s] Entity %u/%u (%u/%u)%s%s%s", COLOR_AQUA,
                     entry.tx ? "TX" : "RX", packet_type_name(entry.type),
                     entry.entity_index + 1, entry.entity_total, entry.chunk_index, entry.chunk_total, uid_suffix, retry_suffix, COLOR_RESET);
          }
        } else {
          if (entity_name && *entity_name) {
            ESP_LOGD(TAG, " %s[%s %s] Entity %u/%u: %s%s%s%s", COLOR_AQUA,
                     entry.tx ? "TX" : "RX", packet_type_name(entry.type),
                     entry.entity_index + 1, entry.entity_total, entity_name, uid_suffix, retry_suffix, COLOR_RESET);
          } else {
            ESP_LOGD(TAG, " %s[%s %s] Entity %u/%u%s%s%s", COLOR_AQUA,
                     entry.tx ? "TX" : "RX", packet_type_name(entry.type),
                     entry.entity_index + 1, entry.entity_total, uid_suffix, retry_suffix, COLOR_RESET);
          }
        }
      }
    } else if (entry.show_channel) {
      const bool is_discover_announce = entry.type == PKT_DISCOVER_ANNOUNCE;
      const bool is_disallowed = is_discover_announce && entry.allowed == 0;
      const char *color = is_disallowed ? COLOR_YELLOW : (entry.tx ? COLOR_AQUA : COLOR_AQUA);
      if (entry.tx) {
        if (is_deauth) {
          ESP_LOGW(TAG, " %s[TX %s] CH%u %02X:%02X:%02X:%02X:%02X:%02X%s%s%s", COLOR_YELLOW, packet_type_name(entry.type), entry.channel,
                   entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5], uid_suffix, retry_suffix, COLOR_RESET);
        } else {
          ESP_LOGD(TAG, " %s[TX %s] CH%u %02X:%02X:%02X:%02X:%02X:%02X (hops=%u)%s%s%s", color, packet_type_name(entry.type), entry.channel,
                   entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5],
                   entry.hops, uid_suffix, retry_suffix, COLOR_RESET);
        }
      } else {
        if (is_deauth) {
          ESP_LOGW(TAG, " %s[RX %s] %02X:%02X:%02X:%02X:%02X:%02X CH%u len=%u%s%s", COLOR_YELLOW, packet_type_name(entry.type),
                   entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5],
                   entry.channel, static_cast<unsigned>(entry.length), uid_suffix, COLOR_RESET);
        } else {
          if (is_discover_announce) {
            if (is_disallowed) {
              ESP_LOGD(TAG, " %s[RX %s] %02X:%02X:%02X:%02X:%02X:%02X CH%u (allowed=no hops=%u rssi=%d)%s%s", color, packet_type_name(entry.type),
                       entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5],
                       entry.channel, entry.hops, entry.rssi, uid_suffix, COLOR_RESET);
            } else {
              ESP_LOGD(TAG, " %s[RX %s] %02X:%02X:%02X:%02X:%02X:%02X CH%u (hops=%u rssi=%d)%s%s", color, packet_type_name(entry.type),
                       entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5],
                       entry.channel, entry.hops, entry.rssi, uid_suffix, COLOR_RESET);
            }
          } else {
            ESP_LOGD(TAG, " %s[RX %s] %02X:%02X:%02X:%02X:%02X:%02X CH%u len=%u%s%s", color, packet_type_name(entry.type),
                     entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5],
                     entry.channel, static_cast<unsigned>(entry.length), uid_suffix, COLOR_RESET);
          }
        }
      }
    } else if (entry.tx) {
      if (is_deauth) {
        ESP_LOGW(TAG, " %s[TX %s] %02X:%02X:%02X:%02X:%02X:%02X%s%s%s", COLOR_YELLOW, packet_type_name(entry.type),
                 entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5], uid_suffix, retry_suffix, COLOR_RESET);
      } else {
        ESP_LOGD(TAG, " %s[TX %s] %02X:%02X:%02X:%02X:%02X:%02X (hops=%u)%s%s%s", COLOR_AQUA, packet_type_name(entry.type),
                 entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5],
                 entry.hops, uid_suffix, retry_suffix, COLOR_RESET);
      }
    } else {
      if (is_deauth) {
        ESP_LOGW(TAG, " %s[RX %s] %02X:%02X:%02X:%02X:%02X:%02X len=%u%s%s", COLOR_YELLOW, packet_type_name(entry.type),
                 entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5],
                 static_cast<unsigned>(entry.length), uid_suffix, COLOR_RESET);
      } else {
        if (entry.show_ack_type) {
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
          ESP_LOGD(TAG, " %s[RX ACK (%s)] %02X:%02X:%02X:%02X:%02X:%02X len=%u rtt=%u%s%s", COLOR_AQUA, ack_label,
                   entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5],
                   static_cast<unsigned>(entry.length), entry.rtt_ms, uid_suffix, COLOR_RESET);
        } else if (entry.type == PKT_ACK && entry.rtt_ms > 0) {
          ESP_LOGD(TAG, " %s[RX %s] %02X:%02X:%02X:%02X:%02X:%02X len=%u rtt=%u%s%s", COLOR_AQUA, packet_type_name(entry.type),
                   entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5],
                   static_cast<unsigned>(entry.length), entry.rtt_ms, uid_suffix, COLOR_RESET);
        } else {
          ESP_LOGD(TAG, " %s[RX %s] %02X:%02X:%02X:%02X:%02X:%02X len=%u%s%s", COLOR_AQUA, packet_type_name(entry.type),
                   entry.mac[0], entry.mac[1], entry.mac[2], entry.mac[3], entry.mac[4], entry.mac[5],
                   static_cast<unsigned>(entry.length), uid_suffix, COLOR_RESET);
        }
      }
    }
    log_tail_ = (log_tail_ + 1) % PACKET_LOG_SIZE;
    log_count_--;
  }
}

namespace {

static constexpr uint8_t BROADCAST_MAC[6] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};

static void reset_fragment_assembly_(RemoteFragmentAssembly &assembly) {
  assembly = {};
}

static bool store_fragment_(RemoteFragmentAssembly &assembly, const EntityPayloadView &view, uint32_t message_tx_base,
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
    assembly.lengths.assign(view.fragment_count, 0);
    assembly.received.assign(view.fragment_count, 0);
    assembly.data.assign(reserved, 0);
    assembly.bytes_received = 0;
  } else if (assembly.message_tx_base != message_tx_base || assembly.fragment_count != view.fragment_count) {
    return false;
  } else {
    assembly.last_seen_ms = now_ms;
  }

  if (assembly.received[view.fragment_index]) return true;
  const size_t offset = static_cast<size_t>(view.fragment_index) * max_entity_fragment;
  if (offset + view.value_len > assembly.data.size()) return false;
  memcpy(assembly.data.data() + offset, view.value, view.value_len);
  assembly.received[view.fragment_index] = 1;
  assembly.lengths[view.fragment_index] = static_cast<uint16_t>(view.value_len);
  assembly.bytes_received += view.value_len;
  return assembly.bytes_received <= max_assembly_bytes;
}

static bool fragment_assembly_complete_(const RemoteFragmentAssembly &assembly) {
  if (!assembly.active || assembly.fragment_count == 0) return false;
  for (uint8_t i = 0; i < assembly.fragment_count; i++) {
    if (!assembly.received[i]) return false;
  }
  return true;
}

static std::vector<uint8_t> assemble_fragment_payload_(const RemoteFragmentAssembly &assembly, uint16_t max_entity_fragment) {
  std::vector<uint8_t> complete;
  complete.reserve(assembly.bytes_received);
  for (uint8_t i = 0; i < assembly.fragment_count; i++) {
    const size_t offset = static_cast<size_t>(i) * max_entity_fragment;
    complete.insert(complete.end(), assembly.data.begin() + static_cast<std::ptrdiff_t>(offset),
                    assembly.data.begin() + static_cast<std::ptrdiff_t>(offset + assembly.lengths[i]));
  }
  return complete;
}

static void sha256_bytes(const uint8_t *data, size_t len, uint8_t out[32]) {
// TODO: ESP8266 BearSSL SHA-256 — uses br_sha256_context. If BearSSL is not
// available in this compilation unit, this will fail to compile. Stage the
// crypto change (espnow_crypto.cpp BearSSL branch) before building for ESP8266.
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
  SHA256_CTX ctx;
  SHA256_Init(&ctx);
  if (data != nullptr && len > 0) SHA256_Update(&ctx, data, len);
  SHA256_Final(out, &ctx);
#endif
}

}  // namespace

RemoteProtocol::RemoteProtocol() = default;

int RemoteProtocol::init(const char *psk_hex, const char *network_id, const char *esphome_name, const char *node_label,
                         uint32_t firmware_epoch, const char *project_name, const char *project_version,
                         uint16_t heartbeat_interval) {
  network_id_ = network_id != nullptr ? network_id : "";
  esphome_name_ = esphome_name != nullptr ? esphome_name : "";
  node_label_ = node_label != nullptr ? node_label : "";
  firmware_epoch_ = firmware_epoch;
  project_name_ = project_name != nullptr ? project_name : "";
  project_version_ = project_version != nullptr ? project_version : "";
  heartbeat_interval_ = heartbeat_interval;
  boot_epoch_ms_ = millis();
  initial_discovery_pending_ = true;
  file_receiver_.set_send_ack_fn([this](const uint8_t *payload, size_t payload_len) {
    return this->send_ack_(payload, payload_len, 0);
  });
  file_receiver_.set_ota_enabled(ota_over_espnow_);
  return espnow_crypto_init(psk_hex);
}

void RemoteProtocol::set_local_mac(const uint8_t *mac) {
  if (mac == nullptr) return;
  memcpy(leaf_mac_.data(), mac, leaf_mac_.size());
  file_receiver_.set_local_mac(mac);
}

void RemoteProtocol::set_relay_config(bool relay_enabled, uint8_t, uint8_t) {
  relay_enabled_ = relay_enabled;
}

void RemoteProtocol::set_route_ttl(uint32_t route_ttl_seconds) {
  route_ttl_seconds_ = route_ttl_seconds;
}

void RemoteProtocol::add_preferred_parent(const std::array<uint8_t, 6> &mac) {
  preferred_parents_.push_back(mac);
  ESP_LOGI(TAG, "Configured preferred parent %s", format_mac_(mac.data()).c_str());
}

void RemoteProtocol::set_send_fn(send_fn_t fn) { send_fn_ = std::move(fn); }
void RemoteProtocol::set_command_fn(command_fn_t fn) { command_fn_ = std::move(fn); }
void RemoteProtocol::set_reset_peer_table_fn(std::function<void(const uint8_t *parent_mac)> fn) { reset_peer_table_fn_ = std::move(fn); }

const char *RemoteProtocol::state_name() const { return state_name_.c_str(); }

uint32_t RemoteProtocol::get_uptime_s() const {
  return (millis() - boot_epoch_ms_) / 1000U;
}

uint8_t RemoteProtocol::register_entity(espnow_field_type_t type, const char *name, const char *unit, const char *options, const char *entity_id) {
  RemoteEntitySchema schema;
  schema.entity_index = static_cast<uint8_t>(entities_.size());
  schema.entity_type = static_cast<uint8_t>(type);
  schema.entity_name = name != nullptr ? name : "";
  schema.entity_unit = unit != nullptr ? unit : "";
  schema.entity_options = options != nullptr ? options : "";
  schema.entity_id = entity_id != nullptr ? entity_id : "";
  entities_.push_back(schema);
  EntityRecord record;
  record.schema = schema;
  entity_records_.push_back(record);
  return schema.entity_index;
}

void RemoteProtocol::set_entity_options(uint8_t field_index, const char *options) {
  if (field_index >= entities_.size() || field_index >= entity_records_.size()) return;
  const std::string updated = options != nullptr ? options : "";
  entities_[field_index].entity_options = updated;
  entity_records_[field_index].schema.entity_options = updated;
}

void RemoteProtocol::on_entity_state_change(uint8_t field_index, const uint8_t *value, size_t value_len) {
  if (field_index >= entity_records_.size() || value == nullptr) return;
  entity_records_[field_index].current_value.assign(value, value + value_len);
  entity_records_[field_index].dirty = true;
}

void RemoteProtocol::on_entity_text_change(uint8_t field_index, const std::string &value) {
  if (field_index >= entity_records_.size()) return;
  auto &record = entity_records_[field_index];
  record.current_text = value;
  record.current_value.assign(record.current_text.begin(), record.current_text.end());
  record.dirty = true;
}

void RemoteProtocol::record_outstanding_request_(espnow_packet_type_t packet_type, uint32_t tx_counter,
                                                 const uint8_t *payload, size_t payload_len) {
  espnow_frame_header_t header{};
  header.protocol_version = ESPNOW_PROTOCOL_VER;
  header.packet_type = static_cast<uint8_t>(packet_type);
  memcpy(header.leaf_mac, leaf_mac_.data(), 6);
  header.tx_counter = tx_counter;
  header.hop_count = ESPNOW_HOPS_DIR_UP;
  update_outstanding_request_(packet_type, tx_counter, header, payload, payload_len);
}

void RemoteProtocol::update_outstanding_request_(espnow_packet_type_t packet_type, uint32_t tx_counter,
                                                 const espnow_frame_header_t &header, const uint8_t *payload,
                                                 size_t payload_len) {
  if (payload == nullptr || outstanding_requests_.empty()) return;
  OutstandingRequest req{};
  req.packet_type = packet_type;
  req.tx_counter = tx_counter;
  espnow_crypto_psk_tag(reinterpret_cast<const uint8_t *>(&header), payload, payload_len, req.request_fingerprint.data());
  if (outstanding_count_ < outstanding_requests_.size()) {
    outstanding_requests_[outstanding_count_++] = req;
  } else {
    std::move(outstanding_requests_.begin() + 1, outstanding_requests_.end(), outstanding_requests_.begin());
    outstanding_requests_.back() = req;
  }
}

bool RemoteProtocol::request_matches_outstanding_(espnow_packet_type_t packet_type, uint32_t tx_counter,
                                                  const uint8_t *payload, size_t payload_len) const {
  if (payload == nullptr || payload_len != sizeof(espnow_deauth_t)) return false;
  const auto *deauth = reinterpret_cast<const espnow_deauth_t *>(payload);
  for (size_t i = 0; i < outstanding_count_; i++) {
    const auto &req = outstanding_requests_[i];
    if (req.packet_type != static_cast<espnow_packet_type_t>(deauth->response_to_packet_type)) continue;
    if (req.tx_counter != deauth->response_to_tx_counter) continue;
    if (memcmp(req.request_fingerprint.data(), deauth->request_fingerprint, sizeof(deauth->request_fingerprint)) == 0) return true;
  }
  (void)packet_type;
  (void)tx_counter;
  return false;
}

bool RemoteProtocol::parse_frame_(const uint8_t *frame, size_t len, espnow_frame_header_t &header, const uint8_t *&payload,
                                   size_t &payload_len, const uint8_t *&session_tag, uint8_t parent_mac[6]) const {
  if (frame == nullptr || len < sizeof(espnow_frame_header_t)) return false;
  if (len > ESPNOW_V2_MAX_PAYLOAD) return false;
  memcpy(&header, frame, sizeof(header));
  if (header.protocol_version != ESPNOW_PROTOCOL_VER) {
    ESP_LOGW(TAG, "Dropping frame with protocol v%u (expected v%u), type=0x%02X len=%u",
             header.protocol_version, ESPNOW_PROTOCOL_VER, header.packet_type, static_cast<unsigned>(len));
    return false;
  }
  if (!is_valid_packet_type(header.packet_type)) {
    ESP_LOGW(TAG, "Dropping frame with invalid packet type=0x%02X len=%u",
             header.packet_type, static_cast<unsigned>(len));
    return false;
  }
  bool has_parent_check = (header.hop_count & ESPNOW_HOPS_PARENT_CHECK_BIT) != 0;
  size_t header_size = sizeof(espnow_frame_header_t) + (has_parent_check ? ESPNOW_PARENT_MAC_LEN : 0);
  if (len < header_size) return false;
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
      ESP_LOGW(TAG, "Dropping encrypted frame type=0x%02X with short payload len=%u",
               header.packet_type, static_cast<unsigned>(len));
      return false;
    }
    session_tag = frame + len - ESPNOW_SESSION_TAG_LEN;
    payload_len -= ESPNOW_SESSION_TAG_LEN;
  }
  return true;
}

bool RemoteProtocol::validate_psk_(const espnow_frame_header_t &header, const uint8_t *payload, size_t payload_len) const {
  return espnow_crypto_verify_psk_tag(reinterpret_cast<const uint8_t *>(&header), payload, payload_len, header.psk_tag) != 0;
}

bool RemoteProtocol::validate_session_(const espnow_frame_header_t &header, const uint8_t *ciphertext, size_t ciphertext_len,
                                       const uint8_t *session_tag) const {
  if (!session_key_valid_ || session_tag == nullptr) return false;
  return espnow_crypto_verify_session_tag(session_key_.data(), reinterpret_cast<const uint8_t *>(&header), ciphertext, ciphertext_len,
                                          session_tag) != 0;
}

bool RemoteProtocol::send_frame_(const uint8_t *mac, espnow_packet_type_t type, uint8_t hop_count, uint32_t tx_counter,
                                  const uint8_t *payload, size_t payload_len, bool encrypted,
                                  const uint8_t *pre_ciphertext) {
  if (!send_fn_ || mac == nullptr) return false;
  bool has_parent_check = (hop_count & ESPNOW_HOPS_PARENT_CHECK_BIT) != 0;
  size_t parent_mac_size = has_parent_check ? ESPNOW_PARENT_MAC_LEN : 0;
  size_t total_overhead = sizeof(espnow_frame_header_t) + parent_mac_size + (encrypted ? ESPNOW_SESSION_TAG_LEN : 0);
  if (encrypted && payload_len > (session_max_payload_ - total_overhead)) return false;
  if (encrypted && has_parent_check && payload_len > espnow_max_plaintext_with_parent(session_max_payload_)) return false;
  if (encrypted && !has_parent_check && payload_len > espnow_max_plaintext(session_max_payload_)) return false;
  if (type == PKT_DISCOVER) {
    uint8_t ch = sweep_channel_from_index(channel_index_);
#if defined(ARDUINO_ARCH_ESP8266)
    ch = wifi_get_channel();
#else
    wifi_second_chan_t sec = WIFI_SECOND_CHAN_NONE;
    esp_err_t err = esp_wifi_get_channel(&ch, &sec);
    if (err != ESP_OK || ch == 0 || ch > 13) {
      ESP_LOGW(TAG, "esp_wifi_get_channel failed during DISCOVER (err=%d), logging requested sweep channel %u",
               static_cast<int>(err), sweep_channel_from_index(channel_index_));
      ch = sweep_channel_from_index(channel_index_);
    }
#endif
    ESP_LOGI(TAG, "[TX] DISCOVER about to send on ch=%u", static_cast<unsigned>(ch));
    queue_log_(true, type, mac, 0, 0, true, ch, false, 0, 0, 0, 0, -1, 0, 0, tx_counter,
               has_parent_check);
  } else if (type == PKT_STATE) {
    // logged in send_state_
  } else if (type != PKT_SCHEMA_PUSH && type != PKT_ACK) {
    queue_log_(true, type, mac, 0, 0, false, 0, false, 0, 0, 0, 0, -1, 0, 0, tx_counter,
               has_parent_check);
  }
  std::vector<uint8_t> frame(sizeof(espnow_frame_header_t) + parent_mac_size + payload_len + (encrypted ? ESPNOW_SESSION_TAG_LEN : 0));
  auto *hdr = reinterpret_cast<espnow_frame_header_t *>(frame.data());
  hdr->protocol_version = ESPNOW_PROTOCOL_VER;
  hdr->hop_count = hop_count;
  hdr->packet_type = static_cast<uint8_t>(type);
  memcpy(hdr->leaf_mac, leaf_mac_.data(), 6);
  hdr->tx_counter = tx_counter;
  uint8_t *payload_out = frame.data() + sizeof(*hdr);
  if (has_parent_check) {
    memcpy(payload_out, parent_mac_.data(), 6);
    payload_out += 6;
  }
  if (encrypted) {
    if (pre_ciphertext != nullptr) {
      memcpy(payload_out, pre_ciphertext, payload_len);
    } else {
      if (espnow_crypto_crypt(session_key_.data(), tx_counter, payload, payload_out, payload_len) != 0) {
        return false;
      }
    }
    espnow_crypto_psk_tag(frame.data(), payload_out, payload_len, hdr->psk_tag);
    espnow_crypto_session_tag(session_key_.data(), frame.data(), payload_out, payload_len,
                              frame.data() + frame.size() - ESPNOW_SESSION_TAG_LEN);
  } else {
    memcpy(payload_out, payload, payload_len);
    espnow_crypto_psk_tag(frame.data(), payload_out, payload_len, hdr->psk_tag);
  }
  last_tx_ms_ = millis();
  const bool sent = send_fn_(mac, frame.data(), frame.size());
  const bool is_bcast = (mac[0] == 0xFF && mac[1] == 0xFF && mac[2] == 0xFF &&
                         mac[3] == 0xFF && mac[4] == 0xFF && mac[5] == 0xFF);
#if defined(ARDUINO_ARCH_ESP8266)
  uint8_t ch = wifi_get_channel();
#else
  uint8_t ch = 0;
  wifi_second_chan_t sec = WIFI_SECOND_CHAN_NONE;
  esp_wifi_get_channel(&ch, &sec);
#endif
  ESP_LOGI(TAG, "[TX] ch=%u %s frame sent=%d mac=%s type=%s size=%u",
           ch, is_bcast ? "BB" : "UN", sent, mac_display(mac).c_str(), packet_type_name(type), static_cast<unsigned>(frame.size()));
  if (sent) {
    last_successful_outbound_ms_ = last_tx_ms_;
    consecutive_send_failures_ = 0;
  } else {
    consecutive_send_failures_ = static_cast<uint8_t>(std::min<int>(255, consecutive_send_failures_ + 1));
  }
  return sent;
}

bool RemoteProtocol::send_join_() {
  if (!parent_valid_ || !best_parent_.valid) return false;
  join_delay_until_ms_ = 0;
  set_wifi_channel_with_recovery(last_known_channel_, "join");
  if (reset_peer_table_fn_) {
    reset_peer_table_fn_(parent_mac_.data());
  }
  espnow_join_t join{};
  memcpy(join.remote_nonce, remote_nonce_.data(), sizeof(join.remote_nonce));
  compute_schema_hash_(join.schema_hash);
  join.hops_to_bridge = hops_to_bridge_;
  {
    uint8_t count = 0;
    for (const auto &rec : entity_records_) {
      if (rec.dirty) count++;
    }
    join.dirty_count = count;
  }
  join.session_flags = local_session_flags_;
  const uint32_t tx_counter = tx_counter_++;
  const uint8_t join_hc = ESPNOW_HOPS_MAKE(ESPNOW_HOPS_DIR_UP, hops_to_bridge_) |
                          (parent_valid_ ? ESPNOW_HOPS_PARENT_CHECK_BIT : 0);
  join_in_flight_ = send_frame_(parent_mac_.data(), PKT_JOIN, join_hc, tx_counter,
                                reinterpret_cast<const uint8_t *>(&join), sizeof(join), false);
  last_join_attempt_ms_ = millis();
  if (join_in_flight_) {
    ESP_LOGI(TAG, "Attempting join to %s", mac_display(parent_mac_.data()).c_str());
  }
  if (join_in_flight_) join_retry_count_++;
  return join_in_flight_;
}

bool RemoteProtocol::send_deauth_(const uint8_t *mac, const espnow_frame_header_t &trigger, const uint8_t *payload,
                                  size_t payload_len) {
  espnow_deauth_t deauth{};
  deauth.reason = 1;
  deauth.response_to_packet_type = trigger.packet_type;
  deauth.response_to_tx_counter = trigger.tx_counter;
  espnow_crypto_psk_tag(reinterpret_cast<const uint8_t *>(&trigger), payload, payload_len, deauth.request_fingerprint);
  return send_frame_(mac, PKT_DEAUTH, ESPNOW_HOPS_MAKE(ESPNOW_HOPS_DIR_UP, ESPNOW_HOPS_COUNT(hops_to_bridge_)) |
                     (parent_valid_ ? ESPNOW_HOPS_PARENT_CHECK_BIT : 0), tx_counter_++, reinterpret_cast<const uint8_t *>(&deauth), sizeof(deauth), false);
}

bool RemoteProtocol::should_handle_locally_(const espnow_frame_header_t &header) const {
  if (memcmp(header.leaf_mac, leaf_mac_.data(), 6) == 0) return true;
  const auto packet_type = static_cast<espnow_packet_type_t>(header.packet_type);
  if (packet_type == PKT_DISCOVER && relay_enabled_ && normal_) return true;
  if (packet_type == PKT_DISCOVER_ANNOUNCE) return true;
  return false;
}

bool RemoteProtocol::on_espnow_frame(const uint8_t *sender_mac, const uint8_t *data, size_t len, int8_t rssi) {
  if (data != nullptr && len >= sizeof(espnow_frame_header_t)) {
    const auto *raw_header = reinterpret_cast<const espnow_frame_header_t *>(data);
    if (raw_header->protocol_version != ESPNOW_PROTOCOL_VER) {
      ESP_LOGW(TAG, "Dropping frame from %02X:%02X:%02X:%02X:%02X:%02X with protocol v%u (expected v%u), type=0x%02X len=%u",
               sender_mac != nullptr ? sender_mac[0] : 0, sender_mac != nullptr ? sender_mac[1] : 0,
               sender_mac != nullptr ? sender_mac[2] : 0, sender_mac != nullptr ? sender_mac[3] : 0,
               sender_mac != nullptr ? sender_mac[4] : 0, sender_mac != nullptr ? sender_mac[5] : 0,
               raw_header->protocol_version, ESPNOW_PROTOCOL_VER, raw_header->packet_type, static_cast<unsigned>(len));
      return false;
    }
    ESP_LOGI(TAG, "[PROTO] from=%s type=0x%02X pver=%u leaf=%02X%02X%02X%02X%02X%02X hops=%u len=%u",
             mac_display(sender_mac).c_str(), raw_header->packet_type, raw_header->protocol_version,
             raw_header->leaf_mac[0], raw_header->leaf_mac[1], raw_header->leaf_mac[2],
             raw_header->leaf_mac[3], raw_header->leaf_mac[4], raw_header->leaf_mac[5],
             raw_header->hop_count, static_cast<unsigned>(len));
  }
  espnow_frame_header_t header{};
  const uint8_t *payload = nullptr;
  size_t payload_len = 0;
  const uint8_t *session_tag = nullptr;
  uint8_t parent_mac[6]{};
  if (!parse_frame_(data, len, header, payload, payload_len, session_tag, parent_mac)) return false;
  if (!validate_psk_(header, payload, payload_len)) return false;
  if (ESPNOW_HOPS_COUNT(header.hop_count) >= ESPNOW_MAX_HOPS_DEFAULT) return false;

  // PARENT_CHECK filtering: drop frames not addressed to this relay/leaf
  bool has_parent_check = (header.hop_count & ESPNOW_HOPS_PARENT_CHECK_BIT) != 0;
  if (has_parent_check) {
    bool parent_is_all_zeros = espnow_is_parent_mac_all_zeros(parent_mac);
    bool parent_is_self = memcmp(parent_mac, leaf_mac_.data(), 6) == 0;
    if (!parent_is_all_zeros && !parent_is_self) {
      return false;
    }
  }
  memcpy(last_parent_mac, parent_mac, 6);

  // Update RSSI EMA from parent
  if (parent_valid_ && memcmp(sender_mac, parent_mac_.data(), 6) == 0) {
    if (parent_link_rssi_ema_ == -127) {
      parent_link_rssi_ema_ = rssi;
    } else {
      parent_link_rssi_ema_ = static_cast<int8_t>(
          (rssi + (ESPNOW_RSSI_EMA_ALPHA - 1) * parent_link_rssi_ema_) / ESPNOW_RSSI_EMA_ALPHA);
    }
  }

  if (is_encrypted_packet(static_cast<espnow_packet_type_t>(header.packet_type)) && len > session_max_payload_) {
    ESP_LOGW(TAG, "Dropping encrypted frame type=0x%02X len=%u > session_max=%u",
             header.packet_type, static_cast<unsigned>(len), session_max_payload_);
    return false;
  }

  const bool handle_locally = should_handle_locally_(header);
  if (handle_locally && memcmp(header.leaf_mac, leaf_mac_.data(), 6) == 0) {
    const uint8_t observed_hops = ESPNOW_HOPS_COUNT(header.hop_count);
    if (ESPNOW_HOPS_IS_UPSTREAM(header.hop_count) && observed_hops < hops_to_bridge_) {
      ESP_LOGI(TAG, "hops_to_bridge_: %u -> %u (observed from unicast)", hops_to_bridge_, observed_hops);
      hops_to_bridge_ = observed_hops;
    }
  }
  const auto packet_type = static_cast<espnow_packet_type_t>(header.packet_type);
  if (handle_locally && packet_type == PKT_COMMAND) {
    // logged in handle_command_
} else if (handle_locally && packet_type != PKT_SCHEMA_REQUEST && packet_type != PKT_SCHEMA_PUSH &&
           packet_type != PKT_ACK && packet_type != PKT_DISCOVER_ANNOUNCE && packet_type != PKT_JOIN_ACK &&
           !(packet_type == PKT_DISCOVER && !relay_enabled_)) {
    queue_log_(false, packet_type, sender_mac, static_cast<uint16_t>(len), rssi,
               false, 0, false, 0, 0, 0, 0, -1, 0, 0, header.tx_counter,
               has_parent_check);
  }
  if (packet_type == PKT_DISCOVER_ANNOUNCE) {
    if (!handle_locally) return false;
    const auto *announce = reinterpret_cast<const espnow_discover_announce_t *>(payload);
    const int8_t preferred_flag = is_preferred_parent_(sender_mac, announce->responder_mac) ? 1 : 0;
    queue_log_(false, packet_type, sender_mac, static_cast<uint16_t>(len), rssi,
               false, 0, false, 0, 0, 0, 0, preferred_flag, announce->hops_to_bridge, 0, header.tx_counter,
               has_parent_check);
  }

  if (handle_locally && (packet_type == PKT_FILE_TRANSFER || packet_type == PKT_FILE_DATA) && !ota_over_espnow_) {
    ESP_LOGD(TAG, "Ignoring %s from %s because ota_over_espnow is disabled",
             packet_type_name(packet_type), format_mac_(sender_mac).c_str());
    return false;
  }

  if (handle_locally) {
    switch (packet_type) {
      case PKT_DISCOVER: return handle_discover_(sender_mac, header, payload, payload_len, rssi);
      case PKT_DISCOVER_ANNOUNCE: return handle_discover_announce_(sender_mac, header, payload, payload_len, rssi);
      case PKT_JOIN_ACK: return handle_join_ack_(sender_mac, header, payload, payload_len, rssi);
      case PKT_ACK: return handle_ack_(sender_mac, header, payload, payload_len, session_tag, rssi);
      case PKT_COMMAND: return handle_command_(sender_mac, header, payload, payload_len, rssi);
      case PKT_CONFIG: return handle_config_(sender_mac, header, payload, payload_len, rssi);
      case PKT_SCHEMA_REQUEST: return handle_schema_request_(sender_mac, header, payload, payload_len, rssi);
      case PKT_DEAUTH: return handle_deauth_(sender_mac, header, payload, payload_len, rssi);
      case PKT_FILE_TRANSFER: return handle_file_transfer_(sender_mac, header, payload, payload_len, session_tag, rssi);
      case PKT_FILE_DATA: return handle_file_data_(sender_mac, header, payload, payload_len, session_tag, rssi);
      case PKT_JOIN: return false;          // Not handled locally by remotes
      case PKT_STATE: return false;         // Not handled locally by remotes
      case PKT_HEARTBEAT: return false;     // Not handled locally by remotes
      case PKT_SCHEMA_PUSH: return false;   // Not handled locally by remotes
      default: return false;
    }
  }

  return false;
}

void RemoteProtocol::loop() {
  uint32_t now = millis();
  const uint32_t join_retry_jitter =
#if defined(ARDUINO_ARCH_ESP8266)
      (random() % (ESPNOW_RETRY_JITTER_MS * 2 + 1));
#else
      esp_random() % (ESPNOW_RETRY_JITTER_MS * 2 + 1);
#endif
  prune_pending_command_fragments_(now);
  file_receiver_.loop();
  now = millis();
  if (file_receiver_.is_receiving()) {
    if (ota_last_activity_ms_ == 0) {
      ota_last_activity_ms_ = now;
    } else if (elapsed_ms_since(now, ota_last_activity_ms_) >= OTA_SESSION_TIMEOUT_MS) {
      ESP_LOGW(TAG, "Aborting OTA session after %u ms without file traffic", OTA_SESSION_TIMEOUT_MS);
      file_receiver_.abort(ESPNOW_FILE_ABORT_SESSION_LOST, true);
      ota_last_activity_ms_ = 0;
    }
  } else {
    ota_last_activity_ms_ = 0;
  }

  flush_pending_discover_announce_();

  if (initial_discovery_pending_) {
    initial_discovery_pending_ = false;
    start_discovery_cycle_();
    return;
  }

  if (wifi_waiting_) {
    if (wifi_connected_()) {
      start_discovery_cycle_(true);
      return;
    }
    if (now < wifi_wait_deadline_ms_) {
      return;
    }
    start_discovery_cycle_(true);
    return;
  }

  bool tx_queue_clear = !waiting_for_state_ack_ && consecutive_send_failures_ == 0 && !discovering_;

  if (normal_ && tx_queue_clear && parent_link_rssi_ema_ < ESPNOW_PREFERRED_RSSI_FLOOR_DBM) {
    ESP_LOGI(TAG, "Parent link RSSI low (%d dBm), triggering topology refresh", parent_link_rssi_ema_);
    topology_refresh_due_ms_ = 0;
    start_route_recovery_cycle_();
    return;
  }

  if (normal_ && tx_queue_clear && !preferred_parents_.empty()) {
    if (topology_refresh_due_ms_ == 0) {
      topology_refresh_due_ms_ = now + ESPNOW_TOPOLOGY_REFRESH_INTERVAL_MS;
    }
    if (now >= topology_refresh_due_ms_) {
      ESP_LOGI(TAG, "Periodic topology refresh due");
      topology_refresh_due_ms_ = now + ESPNOW_TOPOLOGY_REFRESH_INTERVAL_MS;
      start_route_recovery_cycle_();
      return;
    }
  }

  if (discovering_ && sweep_complete_ && best_parent_.valid && discovery_resume_normal_after_success_) {
    adopt_best_parent_candidate_(true);
    send_heartbeat_();
    return;
  }

  if (discovering_ && !discovery_resume_normal_after_success_ && sweep_complete_ && best_parent_.valid && !joined_) {
    const bool join_retries_remaining = join_retry_count_ < ESPNOW_MAX_RETRIES;
    const uint32_t join_backoff = retry_backoff_ms(join_retry_count_);
    const bool join_retry_due =
        join_retries_remaining && (!join_in_flight_ || now - last_join_attempt_ms_ >= join_backoff + join_retry_jitter);
    if (join_delay_until_ms_ == 0 || now >= join_delay_until_ms_) {
      if (join_retry_due) {
        uint8_t join_channel = best_parent_.channel;
        last_known_channel_ = join_channel;
        ESP_LOGI(TAG, "Discovery sweep complete: candidate %s hops=%u rssi=%d, attempting JOIN",
                 mac_display(best_parent_.next_hop_mac.data()).c_str(),
                 best_parent_.hops_to_bridge, best_parent_.rssi);
        if (join_in_flight_ && now - last_join_attempt_ms_ >= join_backoff + join_retry_jitter) {
          join_in_flight_ = false;
        }
        memcpy(parent_mac_.data(), best_parent_.next_hop_mac.data(), 6);
        parent_valid_ = true;
        hop_count_ = 0;
        hops_to_bridge_ = best_parent_.hops_to_bridge + 1;
#ifdef ARDUINO_ARCH_ESP8266
        parent_link_rssi_ema_ = -40;  // ESP8266 can't read RSSI — assume good link
#else
        parent_link_rssi_ema_ = -127;
#endif
        send_join_();
        state_name_ = "JOINING";
        queue_state_log_(espnow_log_state_t::JOINING, "State: JOINING");
        return;
      }
    }
  }

  if (discovering_ && !sweep_complete_ && now >= discover_due_ms_) {
    if (best_parent_.valid) {
      sweep_complete_ = true;
      ESP_LOGI(TAG, "Discovery collection window closed, best parent: %s hops=%u rssi=%d preferred=%s",
               mac_display(best_parent_.next_hop_mac.data()).c_str(), best_parent_.hops_to_bridge,
               best_parent_.rssi,
               best_parent_.preferred_index == 0xFF ? "none" : std::to_string(best_parent_.preferred_index).c_str());
    } else {
      send_discover_();
    }
    return;
  }

  if (join_in_flight_ && join_retry_count_ >= ESPNOW_MAX_RETRIES && !joined_) {
    ESP_LOGI(TAG, "Join retries exhausted (%u), restarting full discovery", join_retry_count_);
    join_in_flight_ = false;
    fast_rejoin_ = false;
    start_discovery_cycle_();
    discover_due_ms_ = now + 1000;
  }

  if (joined_) {
    if (!normal_ && joined_started_ms_ > 0 && (now - joined_started_ms_) >= ESPNOW_JOINED_TO_NORMAL_TIMEOUT_MS) {
      ESP_LOGW(TAG, "JOINED->NORMAL timeout (%us), restarting full discovery", ESPNOW_JOINED_TO_NORMAL_TIMEOUT_MS / 1000);
      clear_session_state_(false);
      fast_rejoin_ = false;
      start_discovery_cycle_();
      discover_due_ms_ = now + 1000;
      return;
    }
    const uint32_t state_stall_timeout_ms = std::max<uint32_t>(ESPNOW_RETRY_INTERVAL_MS * 16U, 30000U);
    const uint32_t outbound_stall_timeout_ms = std::max<uint32_t>(heartbeat_interval_ * 4000U, 120000U);
    if (consecutive_send_failures_ >= ESPNOW_MAX_RETRIES) {
      rejoin_due_to_transmit_stall_(now, "repeated send failures");
      return;
    }
    if (waiting_for_state_ack_ && last_successful_state_ms_ > 0 &&
        elapsed_ms_since(now, last_successful_state_ms_) >= state_stall_timeout_ms) {
      rejoin_due_to_transmit_stall_(now, "state stalled waiting for ack");
      return;
    }
    if (last_successful_outbound_ms_ > 0 &&
        elapsed_ms_since(now, last_successful_outbound_ms_) >= outbound_stall_timeout_ms) {
      rejoin_due_to_transmit_stall_(now, "no outbound progress");
      return;
    }
    if (waiting_for_state_ack_) {
      if (state_retry_count_ < ESPNOW_MAX_RETRIES) {
        const uint32_t state_retry_timeout =
            retry_backoff_ms(state_retry_count_) +
            (random() % (ESPNOW_RETRY_JITTER_MS * 2 + 1));
        if (now - last_state_tx_ms_ >= state_retry_timeout) {
          if (state_retry_count_ == 2) {
            const auto &rec = entity_records_[pending_state_field_index_];
            ESP_LOGI(TAG, " %sSTATE retry %u/%u for %s", COLOR_YELLOW,
                     state_retry_count_ + 1, ESPNOW_MAX_RETRIES + 1,
                     rec.schema.entity_name.empty() ? "<unknown>" : rec.schema.entity_name.c_str());
          }
          if (send_state_(pending_state_field_index_, pending_state_value_, false, state_retry_count_)) {
            state_retry_count_++;
          } else {
            last_state_tx_ms_ = millis();
          }
        }
      } else {
        ESP_LOGW(TAG, "%sSTATE timeout entity=%u after %u retries, rejoin", COLOR_YELLOW, pending_state_field_index_, state_retry_count_);
        waiting_for_state_ack_ = false;
        state_retry_count_ = 0;
        if (pending_state_field_index_ < entity_records_.size()) {
          entity_records_[pending_state_field_index_].dirty = true;
        }
        start_route_recovery_cycle_();
        return;
      }
    }
    if (!state_push_enabled_) {
      return;
    }
    if (normal_) {
      if (heartbeat_due_ms_ == 0) heartbeat_due_ms_ = now + static_cast<uint32_t>(heartbeat_interval_) * 1000U;
      if (now >= heartbeat_due_ms_) {
        send_heartbeat_();
        return;
      }
    }
    for (auto &record : entity_records_) {
      if (waiting_for_state_ack_ || !record.dirty) continue;
      if (pending_state_field_index_ == 0 && !waiting_for_state_ack_ && !normal_) {
        ESP_LOGI(TAG, "Join in Progress - Sending State (%u entities)", static_cast<uint8_t>(entity_records_.size()));
      }
      if (send_state_(record.schema.entity_index, record.current_value)) {
        waiting_for_state_ack_ = true;
      }
      break;
    }
  }
}

bool RemoteProtocol::handle_discover_(const uint8_t *, const espnow_frame_header_t &,
                                        const uint8_t *, size_t, int8_t) { return false; }  // ESP8266 cannot relay as parent

bool RemoteProtocol::handle_discover_announce_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                                               size_t payload_len, int8_t rssi) {
  if (sender_mac == nullptr) return false;
  if (payload_len != sizeof(espnow_discover_announce_t)) {
    ESP_LOGW(TAG, "Dropping DISCOVER_ANNOUNCE from %s due to payload len=%u (expected %u, protocol v%u)",
             format_mac_(sender_mac).c_str(), static_cast<unsigned>(payload_len),
             static_cast<unsigned>(sizeof(espnow_discover_announce_t)), ESPNOW_PROTOCOL_VER);
    return false;
  }
  const auto *announce = reinterpret_cast<const espnow_discover_announce_t *>(payload);
  if (announce->network_id_len != network_id_.size()) {
    ESP_LOGW(TAG, "Ignoring candidate sender=%s responder=%s due to network_id length mismatch (rx=%u local=%u)",
             format_mac_(sender_mac).c_str(), format_mac_(announce->responder_mac).c_str(), announce->network_id_len,
             static_cast<unsigned>(network_id_.size()));
    return false;
  }
  if (memcmp(announce->network_id, network_id_.data(), network_id_.size()) != 0) {
    ESP_LOGW(TAG, "Ignoring candidate sender=%s responder=%s due to network_id value mismatch",
             format_mac_(sender_mac).c_str(), format_mac_(announce->responder_mac).c_str());
    return false;
  }
  if (!announce->bridge_reachable) {
    return false;
  }
  if (announce->hops_to_bridge > ESPNOW_MAX_HOPS_DEFAULT) {
    return false;
  }
  select_parent_candidate_(sender_mac, *announce, rssi);
  return true;
}

bool RemoteProtocol::handle_join_(const uint8_t *, const espnow_frame_header_t &, const uint8_t *, size_t, int8_t) { return false; }

bool RemoteProtocol::handle_join_ack_(const uint8_t *, const espnow_frame_header_t &header, const uint8_t *payload,
                                      size_t payload_len, int8_t) {
  if (joined_ && !counter_is_newer(header.tx_counter, last_seen_counter_)) return false;
  if (payload_len != sizeof(espnow_join_ack_t)) {
    ESP_LOGW(TAG, "Dropping JOIN_ACK for %s due to payload len=%u (expected %u, protocol v%u)",
             mac_display(header.leaf_mac).c_str(), static_cast<unsigned>(payload_len),
             static_cast<unsigned>(sizeof(espnow_join_ack_t)), ESPNOW_PROTOCOL_VER);
    return false;
  }
  const auto *ack = reinterpret_cast<const espnow_join_ack_t *>(payload);
  const char *status_text = "Unknown";
  if (ack->stage == ESPNOW_JOIN_STATUS_SCHEMA_REFRESH) {
    status_text = "Schema Refresh";
  } else if (ack->stage == ESPNOW_JOIN_STATUS_SEND_STATE) {
    status_text = "Send State";
  } else if (ack->stage == ESPNOW_JOIN_STATUS_COMPLETE) {
    status_text = "Complete";
  }
  ESP_LOGI(TAG, " %s[RX JOIN_ACK] %s #%06X status=%u (%s)%s",
           COLOR_AQUA, mac_display(header.leaf_mac).c_str(),
           header.tx_counter & 0xFFFFFF, ack->stage, status_text, COLOR_RESET);
  if (ack->accepted != 1) {
    session_key_valid_ = false;
    fast_rejoin_ = false;
    if (ack->reason == ESPNOW_JOIN_REASON_WAIT) {
      const uint32_t wait_until_ms = millis() + ESPNOW_WAIT_REJECT_DELAY_MS;
      wait_reject_count_++;
      if (wait_reject_count_ >= ESPNOW_MAX_RETRIES) {
        ESP_LOGW(TAG, "%s[RX JOIN_ACK] 3 consecutive WAIT rejections, returning to discovery%s", COLOR_YELLOW, COLOR_RESET);
        join_in_flight_ = false;
        wait_reject_count_ = 0;
        start_discovery_cycle_();
        discover_due_ms_ = millis() + 1000;
      } else {
        ESP_LOGW(TAG, "%s[RX JOIN_ACK] WAIT rejection, pausing join retries for 10s%s", COLOR_YELLOW, COLOR_RESET);
        join_in_flight_ = false;
        join_delay_until_ms_ = wait_until_ms;
        join_retry_count_ = 0;
        discover_due_ms_ = wait_until_ms;
      }
    } else {
      join_in_flight_ = false;
      start_discovery_cycle_();
    }
    return false;
  }
  memcpy(bridge_nonce_.data(), ack->bridge_nonce, bridge_nonce_.size());
  bridge_session_flags_ = ack->session_flags;
  local_session_flags_ = ack->session_flags;
  if ((local_session_flags_ & ESPNOW_SESSION_FLAG_V2_MTU) &&
      (bridge_session_flags_ & ESPNOW_SESSION_FLAG_V2_MTU)) {
    session_max_payload_ = ESPNOW_V2_MAX_PAYLOAD;
  } else {
    session_max_payload_ = ESPNOW_V1_MAX_PAYLOAD;
  }
  update_mtu_from_route_();
  espnow_crypto_derive_session_key(bridge_nonce_.data(), remote_nonce_.data(), session_key_.data());
  session_key_valid_ = true;
  joined_ = true;

  fast_rejoin_ = false;
  discovering_ = false;
  join_in_flight_ = false;
  join_retry_count_ = 0;
  last_seen_counter_ = header.tx_counter;
  if (ack->stage == ESPNOW_JOIN_STATUS_SCHEMA_REFRESH) {
    if (normal_) {
      return true;
    }
    normal_ = false;
    state_push_enabled_ = false;
    state_name_ = "JOINED";
    queue_state_log_(espnow_log_state_t::JOINED, "State: JOINED (schema refresh)");
    ESP_LOGI(TAG, "Join in Progress - Schema Phase (%u entities)", static_cast<uint8_t>(entity_records_.size()));
    joined_started_ms_ = millis();
    return true;
  }
  if (ack->stage == ESPNOW_JOIN_STATUS_SEND_STATE) {
    if (normal_) {
      return true;
    }
    normal_ = false;
    state_push_enabled_ = true;
    waiting_for_state_ack_ = false;
    state_retry_count_ = 0;
    state_name_ = "STATE_SYNC";
    joined_started_ms_ = millis();
    if (!entity_records_.empty()) {
      mark_all_entities_dirty_();
    }
    return true;
  }
  if (ack->stage == ESPNOW_JOIN_STATUS_COMPLETE) {
    normal_ = true;
    joined_started_ms_ = 0;
    state_push_enabled_ = true;
    last_successful_outbound_ms_ = 0;
    consecutive_send_failures_ = 0;
    last_successful_state_ms_ = 0;
    memcpy(parent_mac_.data(), best_parent_.next_hop_mac.data(), 6);
    parent_valid_ = true;
    hop_count_ = 0;
    hops_to_bridge_ = best_parent_.hops_to_bridge + 1;
    state_name_ = "NORMAL";
    queue_state_log_(espnow_log_state_t::NORMAL, "ESPNOW Join Complete to %s @ %s. State: NORMAL. Mode: Regular",
                    network_id_.c_str(), mac_display(parent_mac_.data()).c_str());
    send_heartbeat_();
    return true;
  }
  normal_ = false;
  state_push_enabled_ = false;
  state_name_ = "JOINED";
  queue_state_log_(espnow_log_state_t::JOINED, "State: JOINED");
  joined_started_ms_ = millis();
  return true;
}

bool RemoteProtocol::handle_ack_(const uint8_t *sender_mac, const espnow_frame_header_t &header, const uint8_t *payload,
                                 size_t payload_len, const uint8_t *session_tag, int8_t) {
  if (!joined_ || !counter_is_newer(header.tx_counter, last_seen_counter_)) return false;
  if (!validate_session_(header, payload, payload_len, payload + payload_len)) return false;

  std::vector<uint8_t> plaintext(payload_len);
  if (espnow_crypto_crypt(session_key_.data(), header.tx_counter, payload, plaintext.data(), payload_len) != 0) {
    return false;
  }
  if (plaintext.size() < sizeof(espnow_ack_t)) {
    ESP_LOGW(TAG, "Dropping ACK for %s due to short plaintext len=%u (expected >= %u, protocol v%u)",
             mac_display(header.leaf_mac).c_str(), static_cast<unsigned>(plaintext.size()),
             static_cast<unsigned>(sizeof(espnow_ack_t)), ESPNOW_PROTOCOL_VER);
    return false;
  }
  const auto *ack = reinterpret_cast<const espnow_ack_t *>(plaintext.data());
  if (ack->ack_type == ACK_STATE) {
    last_seen_counter_ = header.tx_counter;
    if (waiting_for_state_ack_ && ack->ref_tx_counter == pending_state_message_tx_base_) {
      last_state_rtt_ms_ = millis() - last_state_tx_ms_;
      last_successful_state_ms_ = millis();
      // DEBUG: per-packet ACK logging — set to VERBOSE in production
      ESP_LOGD(TAG, " %s[RX ACK (State)] %02X:%02X:%02X:%02X:%02X:%02X len=%u rtt=%u%s", COLOR_AQUA,
               sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5],
               static_cast<unsigned>(plaintext.size()), last_state_rtt_ms_, "ms", COLOR_RESET);
      waiting_for_state_ack_ = false;
      state_retry_count_ = 0;
      if (pending_state_field_index_ < entity_records_.size()) {
        entity_records_[pending_state_field_index_].dirty = false;
      }
    }
    return true;
  }
  if (ack->ack_type == PKT_FILE_TRANSFER) {
    ESP_LOGD(TAG, " %s[RX ACK (File)] %02X:%02X:%02X:%02X:%02X:%02X len=%u%s", COLOR_AQUA,
             sender_mac[0], sender_mac[1], sender_mac[2], sender_mac[3], sender_mac[4], sender_mac[5],
              static_cast<unsigned>(plaintext.size()));
  }
  return true;
}

bool RemoteProtocol::handle_command_(const uint8_t *, const espnow_frame_header_t &header, const uint8_t *payload,
                                     size_t payload_len, int8_t rssi) {
  if (!joined_) return false;
  if (!validate_session_(header, payload, payload_len, payload + payload_len)) return false;

  std::vector<uint8_t> plaintext(payload_len);
  if (espnow_crypto_crypt(session_key_.data(), header.tx_counter, payload, plaintext.data(), payload_len) != 0) {
    return false;
  }
  EntityPayloadView command{};
  if (!parse_entity_payload(plaintext.data(), plaintext.size(), command)) return false;
  const uint32_t message_tx_base = fragment_message_tx_base(header, command);
  ESP_LOGI(TAG, " %s[RX COMMAND] %s entity=%u/%u", COLOR_AQUA,
           mac_display(header.leaf_mac).c_str(), command.entity_index + 1,
           static_cast<uint8_t>(entity_records_.size()));
  queue_log_(false, PKT_COMMAND, header.leaf_mac, payload_len, rssi, false, 0, true, command.entity_index, static_cast<uint8_t>(entity_records_.size()), 0, 0, 0, -1, 0, 0, header.tx_counter);
  if (command.entity_index >= entity_records_.size()) return send_command_ack_(command.entity_index, 2, message_tx_base);

  auto &record = entity_records_[command.entity_index];
  if (!counter_is_newer(message_tx_base, record.last_completed_command_message_tx_base)) {
    if (message_tx_base == record.last_completed_command_message_tx_base) {
      return send_command_ack_(command.entity_index, 0, message_tx_base);
    }
    return true;
  }
  const uint32_t now = millis();
  auto assembly_it = pending_command_assemblies_.find(command.entity_index);
  if (assembly_it == pending_command_assemblies_.end()) {
    if (pending_command_assemblies_.size() >= ESPNOW_MAX_PENDING_FRAGMENT_ASSEMBLIES) {
      ESP_LOGW(TAG, "Dropping COMMAND fragments for entity %u: pending assembly limit reached", command.entity_index);
      return false;
    }
    RemoteFragmentAssembly fresh{};
    assembly_it = pending_command_assemblies_.emplace(command.entity_index, std::move(fresh)).first;
    pending_command_reserved_bytes_ += static_cast<size_t>(command.fragment_count) * max_entity_fragment_;
  } else if (assembly_it->second.active && assembly_it->second.message_tx_base != message_tx_base &&
             assembly_it->second.message_tx_base < message_tx_base) {
    reset_fragment_assembly_(assembly_it->second);
  }
  auto &assembly = assembly_it->second;
  if (!assembly.active) {
    const size_t reserved_before = pending_command_reserved_bytes_;
    const size_t reserved_after =
        reserved_before + static_cast<size_t>(command.fragment_count) * max_entity_fragment_;
    if (reserved_after > max_total_fragment_bytes_) {
      ESP_LOGW(TAG, "Dropping COMMAND fragments for entity %u: session fragment byte cap exceeded", command.entity_index);
      return false;
    }
  }
  if (!store_fragment_(assembly, command, message_tx_base, now, max_entity_fragment_, max_assembly_bytes_)) {
    ESP_LOGW(TAG, "Dropping COMMAND fragments for entity %u: invalid fragment assembly", command.entity_index);
    return false;
  }
  last_seen_counter_ = std::max(last_seen_counter_, header.tx_counter);
  if (!fragment_assembly_complete_(assembly)) return true;

  std::vector<uint8_t> assembled_value = assemble_fragment_payload_(assembly, max_entity_fragment_);
  pending_command_reserved_bytes_ -= assembly.data.size();
  pending_command_assemblies_.erase(command.entity_index);
  record.current_value = assembled_value;
  if (record.schema.entity_type == FIELD_TYPE_TEXT || record.schema.entity_type == FIELD_TYPE_TEXT_SENSOR) {
    record.current_text.assign(reinterpret_cast<const char *>(assembled_value.data()), assembled_value.size());
  }
  record.dirty = false;
  record.last_completed_command_message_tx_base = message_tx_base;
  if (command_fn_) command_fn_(command.entity_index, command.flags, assembled_value.data(), assembled_value.size());
  return send_command_ack_(command.entity_index, 0, message_tx_base);
}

bool RemoteProtocol::handle_config_(const uint8_t *, const espnow_frame_header_t &header, const uint8_t *payload,
                                    size_t payload_len, int8_t rssi) {
  (void) rssi;
  if (!joined_ || !validate_session_(header, payload, payload_len, payload + payload_len)) return false;


  std::vector<uint8_t> plaintext(payload_len);
  if (espnow_crypto_crypt(session_key_.data(), header.tx_counter, payload, plaintext.data(), payload_len) != 0) {
    return false;
  }

  if (last_config_valid_ && header.tx_counter == last_config_tx_counter_) {
    return send_config_ack_(last_config_command_, last_config_result_, header.tx_counter);
  }
  if (!counter_is_newer(header.tx_counter, last_seen_counter_)) return false;

  auto ack_and_remember = [this, &header](uint8_t command, uint8_t result) -> bool {
    last_config_tx_counter_ = header.tx_counter;
    last_config_command_ = command;
    last_config_result_ = result;
    last_config_valid_ = true;
    return this->send_config_ack_(command, result, header.tx_counter);
  };

  if (plaintext.size() < sizeof(espnow_config_t)) {
    last_seen_counter_ = header.tx_counter;
    return ack_and_remember(0, CFG_RESULT_INVALID_PAYLOAD);
  }

  const auto *cfg = reinterpret_cast<const espnow_config_t *>(plaintext.data());
  const uint8_t command = cfg->command;
  const uint8_t *cmd_payload = plaintext.data() + sizeof(espnow_config_t);
  const size_t cmd_payload_len = plaintext.size() - sizeof(espnow_config_t);

  if (cfg->payload_len != cmd_payload_len) {
    last_seen_counter_ = header.tx_counter;
    return ack_and_remember(command, CFG_RESULT_INVALID_PAYLOAD);
  }

  last_seen_counter_ = header.tx_counter;
  if (!normal_) {
    ESP_LOGW(TAG, "Rejecting CONFIG command 0x%02X while state=%s", command, state_name_.c_str());
    return ack_and_remember(command, CFG_RESULT_BUSY);
  }

  switch (command) {
    case CFG_CMD_REBOOT:
      if (cmd_payload_len != 0) return ack_and_remember(command, CFG_RESULT_INVALID_PAYLOAD);
      if (!ack_and_remember(command, CFG_RESULT_OK)) return false;
      ESP_LOGW(TAG, "CONFIG reboot accepted; rebooting now");
#if defined(ARDUINO_ARCH_ESP8266)
      ESP.restart();
#else
      esp_restart();
#endif
      return true;

    case CFG_CMD_OTA_ENABLE:
    case CFG_CMD_WIFI_CONNECT:
      return ack_and_remember(command, CFG_RESULT_UNSUPPORTED);

    case CFG_CMD_HEARTBEAT_INTERVAL: {
      if (cmd_payload_len != sizeof(uint32_t)) return ack_and_remember(command, CFG_RESULT_INVALID_PAYLOAD);
      const uint32_t interval = static_cast<uint32_t>(cmd_payload[0]) |
                                (static_cast<uint32_t>(cmd_payload[1]) << 8U) |
                                (static_cast<uint32_t>(cmd_payload[2]) << 16U) |
                                (static_cast<uint32_t>(cmd_payload[3]) << 24U);
      if (interval < 5U || interval > 3600U) return ack_and_remember(command, CFG_RESULT_INVALID_PAYLOAD);
      if (!ack_and_remember(command, CFG_RESULT_OK)) return false;
      heartbeat_interval_ = static_cast<uint16_t>(interval);
      heartbeat_due_ms_ = millis() + interval * 1000U;
      ESP_LOGI(TAG, "CONFIG heartbeat interval set to %us", static_cast<unsigned>(interval));
      return true;
    }

    case CFG_CMD_FORCE_REDISCOVER:
      if (cmd_payload_len != 0) return ack_and_remember(command, CFG_RESULT_INVALID_PAYLOAD);
      if (!ack_and_remember(command, CFG_RESULT_OK)) return false;
      ESP_LOGW(TAG, "CONFIG force rediscover accepted; starting full discovery sweep");
      start_config_full_rediscovery_();
      return true;

    case CFG_CMD_SET_PARENT_MAC: {
      if (cmd_payload_len != 7) return ack_and_remember(command, CFG_RESULT_INVALID_PAYLOAD);
      const uint8_t flags = cmd_payload[0];
      if ((flags & ~SET_PARENT_MAC_FLAG_CLEAR) != 0) return ack_and_remember(command, CFG_RESULT_INVALID_PAYLOAD);
      std::array<uint8_t, 6> preferred{};
      memcpy(preferred.data(), cmd_payload + 1, preferred.size());
      if (!ack_and_remember(command, CFG_RESULT_OK)) return false;
      if ((flags & SET_PARENT_MAC_FLAG_CLEAR) != 0) preferred_parents_.clear();
      auto existing = std::find(preferred_parents_.begin(), preferred_parents_.end(), preferred);
      if (existing != preferred_parents_.end()) preferred_parents_.erase(existing);
      preferred_parents_.insert(preferred_parents_.begin(), preferred);
      ESP_LOGI(TAG, "CONFIG preferred parent set to %s clear=%u",
               mac_display(preferred.data()).c_str(), (flags & SET_PARENT_MAC_FLAG_CLEAR) ? 1U : 0U);
      start_route_recovery_cycle_();
      fast_rejoin_ = false;
      discovery_current_channel_only_ = false;
      return true;
    }

    case CFG_CMD_RELAY:
      return ack_and_remember(command, CFG_RESULT_UNSUPPORTED);  // ESP8266 cannot relay

    default:
      return ack_and_remember(command, CFG_RESULT_UNSUPPORTED);
  }
}

bool RemoteProtocol::handle_schema_request_(const uint8_t *, const espnow_frame_header_t &header, const uint8_t *payload,
                                            size_t payload_len, int8_t) {
  if (!joined_ || !counter_is_newer(header.tx_counter, last_seen_counter_)) return false;
  if (!validate_session_(header, payload, payload_len, payload + payload_len)) return false;

  std::vector<uint8_t> plaintext(payload_len);
  if (espnow_crypto_crypt(session_key_.data(), header.tx_counter, payload, plaintext.data(), payload_len) != 0) {
    return false;
  }
  if (plaintext.size() != sizeof(espnow_schema_request_t)) {
    ESP_LOGW(TAG, "Dropping SCHEMA_REQUEST for %s due to plaintext len=%u (expected %u, protocol v%u)",
             mac_display(header.leaf_mac).c_str(), static_cast<unsigned>(plaintext.size()),
             static_cast<unsigned>(sizeof(espnow_schema_request_t)), ESPNOW_PROTOCOL_VER);
    return false;
  }
  const auto *request = reinterpret_cast<const espnow_schema_request_t *>(plaintext.data());
  last_seen_counter_ = header.tx_counter;
  state_push_enabled_ = false;
  last_heartbeat_tx_ms_ = 0;
  heartbeat_due_ms_ = 0;
  last_successful_state_ms_ = 0;
  last_successful_heartbeat_ms_ = 0;
  queue_log_(false, PKT_SCHEMA_REQUEST, header.leaf_mac, 0, 0, false, 0, true, request->descriptor_index,
             static_cast<uint8_t>(entity_records_.size()), 0, 0, 0, -1, 0, 0, header.tx_counter);
  if (request->descriptor_type == ESPNOW_DESCRIPTOR_TYPE_IDENTITY) {
    ESP_LOGI(TAG, "  [RX SCHEMA_REQUEST] Identity desc=%u from %s", request->descriptor_index, mac_display(header.leaf_mac).c_str());
    return request->descriptor_index == 0 ? send_identity_descriptor_() : false;
  }
  if (request->descriptor_type == ESPNOW_DESCRIPTOR_TYPE_ENTITY) {
    if (request->descriptor_index == 0) {
      ESP_LOGI(TAG, "Join in Progress - Sending Schema (%u entities)", static_cast<uint8_t>(entity_records_.size()));
    }
    return send_schema_push_(request->descriptor_index);
  }
  return false;
}

bool RemoteProtocol::handle_deauth_(const uint8_t *, const espnow_frame_header_t &header, const uint8_t *payload, size_t payload_len, int8_t) {
  if (!should_handle_locally_(header)) return false;
  if (payload_len != sizeof(espnow_deauth_t)) {
    ESP_LOGW(TAG, "Dropping DEAUTH for %s due to payload len=%u (expected %u, protocol v%u)",
             mac_display(header.leaf_mac).c_str(), static_cast<unsigned>(payload_len),
             static_cast<unsigned>(sizeof(espnow_deauth_t)), ESPNOW_PROTOCOL_VER);
    return false;
  }
  const auto *deauth = reinterpret_cast<const espnow_deauth_t *>(payload);
  if (!request_matches_outstanding_(static_cast<espnow_packet_type_t>(deauth->response_to_packet_type),
                                    deauth->response_to_tx_counter, payload, payload_len)) {
    ESP_LOGW(TAG, "%s[RX DEAUTH] %s did not match an outstanding request, forcing rediscovery%s",
             COLOR_YELLOW, mac_display(header.leaf_mac).c_str(), COLOR_RESET);
  }
  const bool have_route = parent_valid_ && best_parent_.valid;
  clear_session_state_(false, true);
  discovering_ = true;
  sweep_complete_ = true;
  fast_rejoin_ = false;
  discovery_resume_normal_after_success_ = false;
  discovery_current_channel_only_ = true;
  fill_random_bytes(remote_nonce_.data(), remote_nonce_.size());
  if (have_route && send_join_()) {
    state_name_ = "JOINING";
    queue_state_log_(espnow_log_state_t::JOINING, "State: JOINING");
    return true;
  }
  start_discovery_cycle_();
  return true;
}

bool RemoteProtocol::handle_file_transfer_(const uint8_t *, const espnow_frame_header_t &header, const uint8_t *payload,
                                           size_t payload_len, const uint8_t *session_tag, int8_t) {
  if (std::memcmp(header.leaf_mac, leaf_mac_.data(), leaf_mac_.size()) != 0) {
    ESP_LOGW(TAG, "Dropping FILE_TRANSFER for unexpected destination %s (local %s)",
             mac_display(header.leaf_mac).c_str(), mac_display(leaf_mac_.data()).c_str());
    return false;
  }
  if (!joined_ || !validate_session_(header, payload, payload_len, session_tag)) return false;

  std::vector<uint8_t> plaintext(payload_len);
  if (espnow_crypto_crypt(session_key_.data(), header.tx_counter, payload, plaintext.data(), payload_len) != 0) {
    return false;
  }
  ota_last_activity_ms_ = millis();
  if (!plaintext.empty() && plaintext[0] == ESPNOW_FILE_PHASE_ANNOUNCE) {
    file_receiver_.set_announce_tx_counter(header.tx_counter);
  }
  if (!plaintext.empty() && plaintext[0] == ESPNOW_FILE_PHASE_BLAST_COMPLETE) {
    file_receiver_.set_blast_complete_tx_counter(header.tx_counter);
  }
  return file_receiver_.handle_file_transfer(plaintext.data(), plaintext.size());
}

bool RemoteProtocol::handle_file_data_(const uint8_t *, const espnow_frame_header_t &header, const uint8_t *payload,
                                       size_t payload_len, const uint8_t *session_tag, int8_t) {
  if (std::memcmp(header.leaf_mac, leaf_mac_.data(), leaf_mac_.size()) != 0) {
    ESP_LOGW(TAG, "Dropping FILE_DATA for unexpected destination %s (local %s)",
             mac_display(header.leaf_mac).c_str(), mac_display(leaf_mac_.data()).c_str());
    return false;
  }
  if (!joined_ || !validate_session_(header, payload, payload_len, session_tag)) return false;

  std::vector<uint8_t> plaintext(payload_len);
  if (espnow_crypto_crypt(session_key_.data(), header.tx_counter, payload, plaintext.data(), payload_len) != 0) {
    return false;
  }
  ota_last_activity_ms_ = millis();
  return file_receiver_.handle_file_data(plaintext.data(), plaintext.size());
}

bool RemoteProtocol::send_discover_() {
  const uint32_t now = millis();
  espnow_discover_t discover{};
  memcpy(discover.network_id, network_id_.data(), std::min(network_id_.size(), sizeof(discover.network_id)));
  discover.network_id_len = static_cast<uint8_t>(network_id_.size());
  discover.capability_flags = 0x00;  // ESP8266 cannot relay — no unicast TX for downstream forwarding
  state_name_ = "DISCOVERING";
  queue_state_log_(espnow_log_state_t::DISCOVERING, " State: DISCOVERING MAC=%s", mac_display(leaf_mac_.data()).c_str());

  auto send_on_channel = [&](uint8_t channel, const char *context) -> bool {
    const auto err = set_wifi_channel_with_recovery(channel, context);
    if (err != 0) {
      ESP_LOGW(TAG, "esp_wifi_set_channel(%u) failed during %s: err=%d", channel,
               context != nullptr ? context : "discovery", static_cast<int>(err));
    }
    const bool sent = send_frame_(BROADCAST_MAC, PKT_DISCOVER, ESPNOW_HOPS_MAKE(ESPNOW_HOPS_DIR_UP, 0), 0,
                                  reinterpret_cast<const uint8_t *>(&discover), sizeof(discover), false);
    discover_due_ms_ = now + ESPNOW_DISCOVER_COLLECTION_WINDOW_MS;
    return sent;
  };

  if (discover_retry_pending_) {
    discover_retry_pending_ = false;
    if (fast_rejoin_) {
      const uint8_t channel = last_known_channel_ >= 1 && last_known_channel_ <= 13 ? last_known_channel_ : 1;
      ++discover_retry_count_;
      return send_on_channel(channel, "fast rediscovery retry");
    }
    if (discovery_current_channel_only_) {
      ++discover_retry_count_;
      return send_on_channel(current_wifi_channel_(), "wifi discovery retry");
    }
    if (channel_index_ >= 13) channel_index_ = 0;
    const uint8_t channel = sweep_channel_from_index(channel_index_);
    channel_index_++;
    return send_on_channel(channel, "discovery sweep");
  }

  if (fast_rejoin_) {
    if (discover_retry_count_ == 0) {
      const uint8_t channel = last_known_channel_ >= 1 && last_known_channel_ <= 13 ? last_known_channel_ : 1;
      discover_retry_count_ = 1;
      return send_on_channel(channel, "fast rediscovery");
    }
    if (discover_retry_count_ == 1) {
      discover_retry_pending_ = true;
      discover_due_ms_ = now + ESPNOW_DISCOVER_BACKOFF_START_MS;
      return true;
    }
    fast_rejoin_ = false;
    discover_retry_count_ = 0;
    discover_phase_ = 0;
    discovery_current_channel_only_ = false;
    discovery_resume_normal_after_success_ = true;
    channel_index_ = 0;
    const uint8_t channel = sweep_channel_from_index(channel_index_);
    channel_index_++;
    return send_on_channel(channel, "discovery sweep");
  }

  if (discovery_current_channel_only_) {
    if (discover_retry_count_ == 0) {
      discover_retry_count_ = 1;
      return send_on_channel(current_wifi_channel_(), "wifi discovery");
    }
    discover_retry_pending_ = true;
    discover_due_ms_ = now + discover_backoff_delay_ms(discover_phase_);
    if (discover_phase_ < 4) discover_phase_++;
    return true;
  }

  if (channel_index_ >= 13) {
    if (best_parent_.valid) {
      sweep_complete_ = true;
      return true;
    }
    discover_retry_pending_ = true;
    discover_due_ms_ = now + discover_backoff_delay_ms(discover_phase_);
    if (discover_phase_ < 4) discover_phase_++;
    channel_index_ = 0;
    return true;
  }

  const uint8_t channel = sweep_channel_from_index(channel_index_);
  channel_index_++;
  return send_on_channel(channel, "discovery sweep");
}

bool RemoteProtocol::send_heartbeat_() {
  if (!joined_ || !parent_valid_ || !normal_) return false;
  set_wifi_channel_with_recovery(last_known_channel_, "heartbeat");
  espnow_heartbeat_t heartbeat{};
  heartbeat.uptime_seconds = get_uptime_s();
  heartbeat.expected_contact_interval_seconds = heartbeat_interval_;
  memcpy(heartbeat.parent_mac, parent_mac_.data(), 6);
  heartbeat.direct_child_count = 0;
  heartbeat.total_child_count = 0;
  heartbeat.remote_rssi_dbm = parent_link_rssi_ema_;
  const uint32_t tx_counter = tx_counter_++;
  const bool sent = send_frame_(parent_mac_.data(), PKT_HEARTBEAT, ESPNOW_HOPS_MAKE(ESPNOW_HOPS_DIR_UP, hops_to_bridge_) | (parent_valid_ ? ESPNOW_HOPS_PARENT_CHECK_BIT : 0), tx_counter, reinterpret_cast<const uint8_t *>(&heartbeat), sizeof(heartbeat), true);
  if (sent) {
    last_heartbeat_tx_ms_ = millis();
    last_successful_heartbeat_ms_ = last_heartbeat_tx_ms_;
    heartbeat_due_ms_ = last_heartbeat_tx_ms_ + static_cast<uint32_t>(heartbeat_interval_) * 1000U;
  } else {
    heartbeat_due_ms_ = millis() + 1000U;
  }
  return sent;
}

bool RemoteProtocol::send_state_(uint8_t field_index, const std::vector<uint8_t> &value, bool reset_retry_state, uint8_t retry_count) {
  if (!joined_ || !parent_valid_ || !state_push_enabled_ || field_index >= entity_records_.size()) return false;
  set_wifi_channel_with_recovery(last_known_channel_, "state push");
  const auto &record = entity_records_[field_index];
  const uint8_t *full_payload = nullptr;
  size_t full_payload_len = 0;
  if (record.schema.entity_type == FIELD_TYPE_TEXT || record.schema.entity_type == FIELD_TYPE_TEXT_SENSOR) {
    full_payload = reinterpret_cast<const uint8_t *>(record.current_text.data());
    full_payload_len = record.current_text.size();
  } else {
    full_payload = value.data();
    full_payload_len = value.size();
  }
  bool parent_check = parent_valid_;
  uint16_t effective_max_payload = parent_check ? espnow_max_plaintext_with_parent(session_max_payload_) : espnow_max_plaintext(session_max_payload_);
  uint16_t effective_frag_size = effective_max_payload - ESPNOW_ENTITY_PACKET_HEADER_LEN;
  const uint16_t frag_size = effective_frag_size;
  const size_t chunk_count = std::max<size_t>(1, (full_payload_len + frag_size - 1) / frag_size);
  uint32_t message_tx_base = 0;
  for (size_t chunk = 0; chunk < chunk_count; chunk++) {
    const size_t offset = chunk * frag_size;
    const size_t remaining = full_payload_len > offset ? (full_payload_len - offset) : 0;
    const size_t len = std::min<size_t>(frag_size, remaining);
    uint8_t flags = (chunk + 1 < chunk_count) ? ESPNOW_ENTITY_FLAG_MORE_FRAGMENTS : 0;
    if (chunk + 1 == chunk_count) {
      bool more_dirty = false;
      for (size_t i = field_index + 1; i < entity_records_.size(); i++) {
        if (entity_records_[i].dirty) {
          more_dirty = true;
          break;
        }
      }
      if (more_dirty) flags |= ESPNOW_ENTITY_FLAG_MORE_DIRTY;
    }
    std::vector<uint8_t> state;
    append_entity_payload(state, field_index, flags, static_cast<uint8_t>(chunk), static_cast<uint8_t>(chunk_count),
                          len > 0 ? full_payload + offset : nullptr, len);
    const uint32_t tx_counter = tx_counter_++;
    if (chunk == 0) message_tx_base = tx_counter;
    const uint8_t hop_count = ESPNOW_HOPS_MAKE(ESPNOW_HOPS_DIR_UP, hops_to_bridge_) | (parent_check ? ESPNOW_HOPS_PARENT_CHECK_BIT : 0);
    espnow_frame_header_t header{};
    header.protocol_version = ESPNOW_PROTOCOL_VER;
    header.packet_type = PKT_STATE;
    memcpy(header.leaf_mac, leaf_mac_.data(), 6);
    header.tx_counter = tx_counter;
    header.hop_count = hop_count;
    std::vector<uint8_t> ciphertext(state.size());
    if (espnow_crypto_crypt(session_key_.data(), tx_counter, state.data(), ciphertext.data(), ciphertext.size()) != 0) {
      return false;
    }
    update_outstanding_request_(PKT_STATE, tx_counter, header, ciphertext.data(), ciphertext.size());
    queue_log_(true, PKT_STATE, parent_mac_.data(), 0, 0, false, 0, true, field_index, static_cast<uint8_t>(entity_records_.size()),
               static_cast<uint8_t>(chunk + 1), static_cast<uint8_t>(chunk_count), 0, -1, 0, retry_count, tx_counter,
               parent_check);
    if (!send_frame_(parent_mac_.data(), PKT_STATE, hop_count, tx_counter, state.data(), state.size(), true, ciphertext.data())) {
      if (field_index < entity_records_.size()) {
        entity_records_[field_index].dirty = true;
      }
      waiting_for_state_ack_ = false;
      last_state_tx_ms_ = millis();
      return false;
    }
  }
  pending_state_message_tx_base_ = message_tx_base;
  pending_state_field_index_ = field_index;
  pending_state_value_ = value;
  pending_state_fragment_count_ = static_cast<uint8_t>(chunk_count);
  pending_state_payload_len_ = full_payload_len;
  last_state_tx_ms_ = millis();
  if (reset_retry_state) state_retry_count_ = 0;
  return true;
}

bool RemoteProtocol::send_command_ack_(uint8_t field_index, uint8_t result, uint32_t ref_tx_counter) {
  if (!joined_ || !parent_valid_) return false;
  set_wifi_channel_with_recovery(last_known_channel_, "command ack");
  (void)field_index;
  espnow_ack_t ack{};
  ack.ack_type = ACK_COMMAND;
  ack.result = result;
  ack.ref_tx_counter = ref_tx_counter;
  const uint32_t tx_counter = tx_counter_++;
  espnow_frame_header_t header{};
  header.protocol_version = ESPNOW_PROTOCOL_VER;
  header.packet_type = PKT_ACK;
  memcpy(header.leaf_mac, leaf_mac_.data(), 6);
  header.tx_counter = tx_counter;
  header.hop_count = ESPNOW_HOPS_MAKE(ESPNOW_HOPS_DIR_UP, hops_to_bridge_) | (parent_valid_ ? ESPNOW_HOPS_PARENT_CHECK_BIT : 0);
  std::vector<uint8_t> ciphertext(sizeof(ack));
  if (espnow_crypto_crypt(session_key_.data(), tx_counter, reinterpret_cast<const uint8_t *>(&ack), ciphertext.data(), ciphertext.size()) != 0) {
    return false;
  }
  update_outstanding_request_(PKT_ACK, tx_counter, header, ciphertext.data(), ciphertext.size());
  ESP_LOGD(TAG, " %s[TX ACK (Command)] %s len=%u%s", COLOR_AQUA,
           mac_display(parent_mac_.data()).c_str(), static_cast<unsigned>(sizeof(ack)),
           (header.hop_count & ESPNOW_HOPS_PARENT_CHECK_BIT) ? " pc" : "", COLOR_RESET);
  return send_frame_(parent_mac_.data(), PKT_ACK, ESPNOW_HOPS_MAKE(ESPNOW_HOPS_DIR_UP, hops_to_bridge_) | (parent_valid_ ? ESPNOW_HOPS_PARENT_CHECK_BIT : 0), tx_counter, reinterpret_cast<const uint8_t *>(&ack), sizeof(ack), true, ciphertext.data());
}

bool RemoteProtocol::send_config_ack_(uint8_t command, uint8_t result, uint32_t ref_tx_counter) {
  if (!joined_ || !parent_valid_) return false;
  set_wifi_channel_with_recovery(last_known_channel_, "config ack");
  uint8_t ack_payload[sizeof(espnow_ack_t) + 1]{};
  auto *ack = reinterpret_cast<espnow_ack_t *>(ack_payload);
  ack->ack_type = PKT_CONFIG;
  ack->result = result;
  ack->ref_tx_counter = ref_tx_counter;
  ack_payload[sizeof(espnow_ack_t)] = command;
  ESP_LOGD(TAG, " %s[TX ACK (Config)] %s cmd=0x%02X result=%u len=%u%s", COLOR_AQUA,
           mac_display(parent_mac_.data()).c_str(), command, result,
           static_cast<unsigned>(sizeof(ack_payload)),
           (parent_valid_ ? " pc" : ""), COLOR_RESET);
  return send_ack_(ack_payload, sizeof(ack_payload), ref_tx_counter);
}

bool RemoteProtocol::send_ack_(const uint8_t *payload, size_t payload_len, uint32_t ref_tx_counter) {
  if (!joined_ || !parent_valid_ || payload == nullptr || payload_len < sizeof(espnow_ack_t)) return false;
  set_wifi_channel_with_recovery(last_known_channel_, "ack");

  std::vector<uint8_t> ack_payload(payload, payload + payload_len);
  auto *ack = reinterpret_cast<espnow_ack_t *>(ack_payload.data());
  ack->ref_tx_counter = ref_tx_counter != 0 ? ref_tx_counter : ack->ref_tx_counter;

  const uint32_t tx_counter = tx_counter_++;
  espnow_frame_header_t header{};
  header.protocol_version = ESPNOW_PROTOCOL_VER;
  header.packet_type = PKT_ACK;
  memcpy(header.leaf_mac, leaf_mac_.data(), 6);
  header.tx_counter = tx_counter;
  header.hop_count = ESPNOW_HOPS_MAKE(ESPNOW_HOPS_DIR_UP, hops_to_bridge_) | (parent_valid_ ? ESPNOW_HOPS_PARENT_CHECK_BIT : 0);

  std::vector<uint8_t> ciphertext(ack_payload.size());
  if (espnow_crypto_crypt(session_key_.data(), tx_counter, ack_payload.data(), ciphertext.data(), ciphertext.size()) != 0) {
    return false;
  }
  update_outstanding_request_(PKT_ACK, tx_counter, header, ciphertext.data(), ciphertext.size());
  const char *ack_label = (ack->ack_type == ACK_STATE)     ? "State" :
                           (ack->ack_type == ACK_COMMAND)   ? "Command" :
                           (ack->ack_type == PKT_FILE_TRANSFER) ? "File" :
                           "Unknown";
  ESP_LOGD(TAG, " %s[TX ACK (%s)] %s len=%u%s", COLOR_AQUA, ack_label,
           mac_display(parent_mac_.data()).c_str(),
           static_cast<unsigned>(ack_payload.size()),
           (header.hop_count & ESPNOW_HOPS_PARENT_CHECK_BIT) ? " pc" : "", COLOR_RESET);
  return send_frame_(parent_mac_.data(), PKT_ACK, ESPNOW_HOPS_MAKE(ESPNOW_HOPS_DIR_UP, hops_to_bridge_) | (parent_valid_ ? ESPNOW_HOPS_PARENT_CHECK_BIT : 0),
                     tx_counter, ack_payload.data(), ack_payload.size(), true, ciphertext.data());
}

bool RemoteProtocol::send_identity_descriptor_() {
  if (!joined_ || !parent_valid_) return false;
  set_wifi_channel_with_recovery(last_known_channel_, "identity");
  std::vector<uint8_t> push;
  const uint8_t *build_date = reinterpret_cast<const uint8_t *>("");
  const uint8_t *build_time = reinterpret_cast<const uint8_t *>("");
  size_t build_date_len = 0;
  size_t build_time_len = 0;
  std::array<uint8_t, 16> firmware_md5{};
  firmware_md5.fill(0);
#if defined(ARDUINO_ARCH_ESP8266)
  // ESP8266: use compile-time __DATE__ and __TIME__ macros.
  // TODO: These are static strings from the compiler; ensure format is
  // compatible with the identity descriptor's 16-byte fields.
  const char *compile_date = __DATE__;
  const char *compile_time = __TIME__;
  build_date = reinterpret_cast<const uint8_t *>(compile_date);
  build_time = reinterpret_cast<const uint8_t *>(compile_time);
  build_date_len = strlen(compile_date);
  build_time_len = strlen(compile_time);
#elif defined(ESP_PLATFORM)
  esp_app_desc_t app_desc{};
  const esp_partition_t *running = esp_ota_get_running_partition();
  if (running && esp_ota_get_partition_description(running, &app_desc) == ESP_OK) {
    build_date = reinterpret_cast<const uint8_t *>(app_desc.date);
    build_time = reinterpret_cast<const uint8_t *>(app_desc.time);
    build_date_len = strnlen(app_desc.date, sizeof(app_desc.date));
    build_time_len = strnlen(app_desc.time, sizeof(app_desc.time));
  }
#endif
#if defined(ARDUINO_ARCH_ESP8266)
  // ESP8266/ESP8285 chip model ID for identity descriptor.
  const uint32_t chip_model = 0x00008266;
#elif defined(CONFIG_IDF_TARGET_ESP32C3)
  const uint32_t chip_model = 5;  // CHIP_ESP32C3 (esptool chip_id)
#elif defined(CONFIG_IDF_TARGET_ESP32S3)
  const uint32_t chip_model = 9;  // CHIP_ESP32S3 (esptool chip_id)
#elif defined(CONFIG_IDF_TARGET_ESP32)
  const uint32_t chip_model = 1;  // CHIP_ESP32
#elif defined(CONFIG_IDF_TARGET_ESP32S2)
  const uint32_t chip_model = 2;  // CHIP_ESP32S2
#elif defined(CONFIG_IDF_TARGET_ESP32C6)
  const uint32_t chip_model = 13;  // CHIP_ESP32C6 (esptool chip_id)
#elif defined(CONFIG_IDF_TARGET_ESP32H2)
  const uint32_t chip_model = 16;  // CHIP_ESP32H2 (esptool chip_id)
#elif defined(CONFIG_IDF_TARGET_ESP32C2)
  const uint32_t chip_model = 12;  // CHIP_ESP32C2 (esptool chip_id)
#elif defined(CONFIG_IDF_TARGET_ESP32C5)
  const uint32_t chip_model = 23;  // CHIP_ESP32C5 (esptool chip_id)
#elif defined(CONFIG_IDF_TARGET_ESP32C61)
  const uint32_t chip_model = 20;  // CHIP_ESP32C61 (esptool chip_id)
#elif defined(CONFIG_IDF_TARGET_ESP32P4)
  const uint32_t chip_model = 18;  // CHIP_ESP32P4 (esptool chip_id)
#else
  #error "Unknown ESP32 target"
#endif
  ESP_LOGI(TAG, "  [CHIP_INFO] model=%u (compile-time)", chip_model);
  chip_model_ = chip_model;
  build_date_.assign(reinterpret_cast<const char *>(build_date), build_date_len);
  build_time_.assign(reinterpret_cast<const char *>(build_time), build_time_len);
  firmware_md5_ = firmware_md5;
append_identity_descriptor_payload(push,
                                     reinterpret_cast<const uint8_t *>(esphome_name_.data()), esphome_name_.size(),
                                     reinterpret_cast<const uint8_t *>(node_label_.data()), node_label_.size(),
                                     firmware_epoch_,
                                     reinterpret_cast<const uint8_t *>(project_name_.data()), project_name_.size(),
                                     reinterpret_cast<const uint8_t *>(project_version_.data()), project_version_.size(),
                                     static_cast<uint8_t>(entity_records_.size()),
                                     session_max_payload_,
                                     chip_model,
                                      build_date, build_date_len,
                                      build_time, build_time_len,
                                      firmware_md5.data(), firmware_md5.size());

  const uint32_t tx_counter = tx_counter_++;
  std::vector<uint8_t> fragment;
  append_entity_payload(fragment, 0, 0, 0, 1, push.data(), push.size());
  ESP_LOGI(TAG, "  [TX IDENTITY_PUSH] esphome_name=%s total_entities=%u to %s",
           esphome_name_.c_str(), static_cast<uint8_t>(entity_records_.size()), mac_display(parent_mac_.data()).c_str());
  queue_log_(true, PKT_SCHEMA_PUSH, parent_mac_.data(), 0, 0, false, 0, true, 0,
             static_cast<uint8_t>(entity_records_.size()), 1, 1, 0, -1, 0, 0, tx_counter,
             parent_valid_);
  return send_frame_(parent_mac_.data(), PKT_SCHEMA_PUSH, ESPNOW_HOPS_MAKE(ESPNOW_HOPS_DIR_UP, hops_to_bridge_) | (parent_valid_ ? ESPNOW_HOPS_PARENT_CHECK_BIT : 0), tx_counter,
                     fragment.data(), fragment.size(), true);
}

bool RemoteProtocol::send_schema_push_(uint8_t entity_index) {
  if (!joined_ || !parent_valid_) return false;
  set_wifi_channel_with_recovery(last_known_channel_, "schema push");
  if (entity_index >= entity_records_.size()) return false;
  std::vector<uint8_t> push;
  uint8_t entity_type = 0;
  std::string entity_name;
  std::string entity_unit;
  std::string entity_id;
  std::string entity_options;
  if (entity_index < entity_records_.size()) {
    const auto &record = entity_records_[entity_index];
    const auto &schema = record.schema;
    entity_type = schema.entity_type;
    entity_name = schema.entity_name;
    entity_unit = schema.entity_unit;
    entity_id = schema.entity_id;
    entity_options = schema.entity_options;
  }
  append_schema_push_payload(push, ESPNOW_DESCRIPTOR_TYPE_ENTITY, entity_index,
                             entity_index, static_cast<uint8_t>(entity_records_.size()), entity_type,
                             reinterpret_cast<const uint8_t *>(entity_name.data()), entity_name.size(),
                             reinterpret_cast<const uint8_t *>(entity_unit.data()), entity_unit.size(),
                             reinterpret_cast<const uint8_t *>(entity_id.data()), entity_id.size(),
                             reinterpret_cast<const uint8_t *>(entity_options.data()), entity_options.size());
  // Note: remote constructs schema_push directly (binary espnow_schema_push_t).
  // The bridge parses received fragments using parse_schema_push_payload + SchemaPushView.
  // This is an intentional split — sender uses the packed struct, receiver uses the parsed view.
  const size_t full_payload_len = push.size();
  bool parent_check = parent_valid_;
  uint16_t effective_max_payload = parent_check ? espnow_max_plaintext_with_parent(session_max_payload_) : espnow_max_plaintext(session_max_payload_);
  uint16_t effective_frag_size = effective_max_payload - ESPNOW_ENTITY_PACKET_HEADER_LEN;
  const uint16_t frag_size = effective_frag_size;
  const size_t chunk_count = std::max<size_t>(1, (full_payload_len + frag_size - 1) / frag_size);
  const auto *raw_push = push.data();
  for (size_t chunk = 0; chunk < chunk_count; chunk++) {
    const size_t offset = chunk * frag_size;
    const size_t remaining = full_payload_len > offset ? (full_payload_len - offset) : 0;
    const size_t len = std::min<size_t>(frag_size, remaining);
    const uint8_t flags = (chunk + 1 < chunk_count) ? ESPNOW_ENTITY_FLAG_MORE_FRAGMENTS : 0;
    std::vector<uint8_t> fragment;
    append_entity_payload(fragment, entity_index, flags, static_cast<uint8_t>(chunk), static_cast<uint8_t>(chunk_count),
                          len > 0 ? raw_push + offset : nullptr, len);
    const uint32_t tx_counter = tx_counter_++;
    const uint8_t hop_count = ESPNOW_HOPS_MAKE(ESPNOW_HOPS_DIR_UP, hops_to_bridge_) | (parent_check ? ESPNOW_HOPS_PARENT_CHECK_BIT : 0);
    espnow_frame_header_t header{};
    header.protocol_version = ESPNOW_PROTOCOL_VER;
    header.packet_type = PKT_SCHEMA_PUSH;
    memcpy(header.leaf_mac, leaf_mac_.data(), 6);
    header.tx_counter = tx_counter;
    header.hop_count = hop_count;
    std::vector<uint8_t> ciphertext(fragment.size());
    if (espnow_crypto_crypt(session_key_.data(), tx_counter, fragment.data(), ciphertext.data(), ciphertext.size()) != 0) {
      return false;
    }
    queue_log_(true, PKT_SCHEMA_PUSH, parent_mac_.data(), 0, 0, false, 0, true, entity_index, static_cast<uint8_t>(entity_records_.size()),
               static_cast<uint8_t>(chunk + 1), static_cast<uint8_t>(chunk_count), 0, -1, 0, 0, tx_counter,
               parent_check);
    if (!send_frame_(parent_mac_.data(), PKT_SCHEMA_PUSH, hop_count, tx_counter, fragment.data(), fragment.size(), true, ciphertext.data())) {
      return false;
    }
  }
  return true;
}

void RemoteProtocol::fill_discover_announce_(espnow_discover_announce_t &announce, uint8_t responder_role,
                                             uint8_t hops_to_bridge) const {
  memcpy(announce.network_id, network_id_.data(), std::min(network_id_.size(), sizeof(announce.network_id)));
  announce.network_id_len = static_cast<uint8_t>(network_id_.size());
  memcpy(announce.responder_mac, leaf_mac_.data(), leaf_mac_.size());
  announce.responder_role = responder_role;
  announce.hops_to_bridge = hops_to_bridge;
  announce.bridge_reachable = 1;
  announce.flags = 0;
}

bool RemoteProtocol::send_discover_announce_with_jitter_(const uint8_t *sender_mac, const uint8_t leaf_mac[6],
                                                         uint8_t responder_role, uint8_t hops_to_bridge) {
  if (sender_mac == nullptr || leaf_mac == nullptr) return false;
  uint8_t next_tail = (announce_queue_tail_ + 1) % ANNOUNCE_QUEUE_SIZE;
  if (next_tail == announce_queue_head_) {
    return false;
  }
  const uint32_t jitter_ms =
#if defined(ARDUINO_ARCH_ESP8266)
      (random() % (ESPNOW_DISCOVER_ANNOUNCE_JITTER_MS + 1));
#else
      esp_random() % (ESPNOW_DISCOVER_ANNOUNCE_JITTER_MS + 1);
#endif
  auto &entry = announce_queue_[announce_queue_tail_];
  entry.deadline_ms = millis() + jitter_ms;
  memcpy(entry.sender_mac.data(), sender_mac, 6);
  memcpy(entry.leaf_mac.data(), leaf_mac, 6);
  entry.responder_role = responder_role;
  entry.hops_to_bridge = hops_to_bridge;
  entry.valid = true;
  announce_queue_tail_ = next_tail;
  discover_announce_pending_ = true;
  return true;
}

void RemoteProtocol::flush_pending_discover_announce_() {
  if (announce_queue_head_ == announce_queue_tail_) return;
  auto &entry = announce_queue_[announce_queue_head_];
  if (!entry.valid) return;
  const uint32_t now = millis();
  if (now < entry.deadline_ms) return;
  espnow_discover_announce_t announce{};
  fill_discover_announce_(announce, entry.responder_role, entry.hops_to_bridge);
  queue_log_(true, PKT_DISCOVER_ANNOUNCE, entry.sender_mac.data(), 0, 0,
             false, 0, false, 0, 0, 0, 0, -1, announce.hops_to_bridge);
  std::vector<uint8_t> frame(sizeof(espnow_frame_header_t) + sizeof(announce));
  auto *hdr = reinterpret_cast<espnow_frame_header_t *>(frame.data());
  hdr->protocol_version = ESPNOW_PROTOCOL_VER;
  hdr->hop_count = ESPNOW_HOPS_MAKE(ESPNOW_HOPS_DIR_DOWN, 0);
  hdr->packet_type = static_cast<uint8_t>(PKT_DISCOVER_ANNOUNCE);
  memcpy(hdr->leaf_mac, entry.leaf_mac.data(), 6);
  hdr->tx_counter = 0;
  uint8_t *payload_out = frame.data() + sizeof(*hdr);
  memcpy(payload_out, &announce, sizeof(announce));
  espnow_crypto_psk_tag(frame.data(), payload_out, sizeof(announce), hdr->psk_tag);
  if (send_fn_ != nullptr) {
    send_fn_(entry.sender_mac.data(), frame.data(), frame.size());
  }
  entry.valid = false;
  announce_queue_head_ = (announce_queue_head_ + 1) % ANNOUNCE_QUEUE_SIZE;
  if (announce_queue_head_ == announce_queue_tail_) {
    discover_announce_pending_ = false;
  }
}

bool RemoteProtocol::wifi_connected_() const {
  return wifi::global_wifi_component != nullptr && wifi::global_wifi_component->is_connected();
}

uint8_t RemoteProtocol::current_wifi_channel_() const {
#if defined(ARDUINO_ARCH_ESP8266)
  return wifi_get_channel();
#else
  uint8_t ch = 1;
  wifi_second_chan_t sec = WIFI_SECOND_CHAN_NONE;
  if (esp_wifi_get_channel(&ch, &sec) != ESP_OK || ch == 0 || ch > 13) {
    return 1;
  }
  return ch;
#endif
}

void RemoteProtocol::adopt_best_parent_candidate_(bool resume_normal_after_success) {
  if (!best_parent_.valid) return;
  memcpy(parent_mac_.data(), best_parent_.next_hop_mac.data(), 6);
  parent_valid_ = true;
  hop_count_ = 0;
  hops_to_bridge_ = best_parent_.hops_to_bridge + 1;
  last_known_channel_ = best_parent_.channel;
  discovering_ = false;
  sweep_complete_ = false;
  fast_rejoin_ = false;
  discover_retry_pending_ = false;
  discover_retry_count_ = 0;
  discovery_resume_normal_after_success_ = resume_normal_after_success;
  normal_ = resume_normal_after_success;
  joined_ = resume_normal_after_success;
  state_push_enabled_ = resume_normal_after_success;
#ifdef ARDUINO_ARCH_ESP8266
  parent_link_rssi_ema_ = -40;  // ESP8266 can't read RSSI — assume good link
#else
  parent_link_rssi_ema_ = -127;
#endif
  topology_refresh_due_ms_ = 0;
  state_name_ = "NORMAL";
  queue_state_log_(espnow_log_state_t::NORMAL, "Discovery found parent %s; resuming normal traffic",
                   mac_display(parent_mac_.data()).c_str());
}

void RemoteProtocol::start_route_recovery_cycle_() {
  discovering_ = true;
  fast_rejoin_ = true;
  discovery_resume_normal_after_success_ = true;
  discovery_current_channel_only_ = true;
  normal_ = false;
  state_push_enabled_ = false;
  join_in_flight_ = false;
  join_retry_count_ = 0;
  join_delay_until_ms_ = 0;
  waiting_for_state_ack_ = false;
  state_retry_count_ = 0;
  heartbeat_due_ms_ = 0;
  last_heartbeat_tx_ms_ = 0;
  wifi_waiting_ = false;
  wifi_wait_deadline_ms_ = 0;
  discover_retry_pending_ = false;
  discover_retry_count_ = 0;
  discover_phase_ = 0;
  channel_index_ = 0;
  discover_due_ms_ = millis();
  topology_refresh_due_ms_ = 0;
  sweep_complete_ = false;
  best_parent_ = {};
  state_name_ = "DISCOVERING";
  queue_state_log_(espnow_log_state_t::DISCOVERING, " State: DISCOVERING MAC=%s", mac_display(leaf_mac_.data()).c_str());
}

void RemoteProtocol::start_config_full_rediscovery_() {
  clear_session_state_(false, true);
  discovering_ = true;
  sweep_complete_ = false;
  fast_rejoin_ = false;
  discovery_resume_normal_after_success_ = false;
  discovery_current_channel_only_ = false;
  wifi_waiting_ = false;
  wifi_wait_deadline_ms_ = 0;
  discover_retry_pending_ = false;
  discover_retry_count_ = 0;
  discover_phase_ = 0;
  channel_index_ = 0;
  discover_due_ms_ = millis();
  topology_refresh_due_ms_ = 0;
  fill_random_bytes(remote_nonce_.data(), remote_nonce_.size());
  state_name_ = "DISCOVERING";
  queue_state_log_(espnow_log_state_t::DISCOVERING, " State: DISCOVERING MAC=%s", mac_display(leaf_mac_.data()).c_str());
  const uint8_t start_channel = sweep_channel_from_index(channel_index_);
  set_wifi_channel_with_recovery(start_channel, "config full rediscovery");
}

void RemoteProtocol::clear_session_state_(bool clear_entities, bool preserve_route) {
  if (file_receiver_.is_receiving()) {
    file_receiver_.abort(ESPNOW_FILE_ABORT_SESSION_LOST, false);
  }
  ota_last_activity_ms_ = 0;
  joined_ = false;
  join_in_flight_ = false;
  discovering_ = !preserve_route;
  session_key_valid_ = false;
  if (!preserve_route) {
    parent_valid_ = false;
    best_parent_ = {};
    bridge_mac_ = {};
    bridge_nonce_ = {};
  }
  last_config_tx_counter_ = 0;
  last_config_command_ = 0;
  last_config_result_ = CFG_RESULT_OK;
  last_config_valid_ = false;
  last_seen_counter_ = 0;
  if (!preserve_route) {
    hop_count_ = 0;
    hops_to_bridge_ = 0xFF;
  }
  outstanding_count_ = 0;
  join_retry_count_ = 0;
  wait_reject_count_ = 0;
  join_delay_until_ms_ = 0;
  state_push_enabled_ = false;
  last_heartbeat_tx_ms_ = 0;
  heartbeat_due_ms_ = 0;
  waiting_for_state_ack_ = false;
  state_retry_count_ = 0;
  last_state_tx_ms_ = 0;
  pending_state_message_tx_base_ = 0;
  pending_state_field_index_ = 0;
  pending_state_value_.clear();
  pending_state_fragment_count_ = 0;
  pending_state_payload_len_ = 0;
  normal_ = false;
  joined_started_ms_ = 0;
  last_successful_outbound_ms_ = 0;
  last_successful_state_ms_ = 0;
  last_successful_heartbeat_ms_ = 0;
  consecutive_send_failures_ = 0;
  pending_command_reserved_bytes_ = 0;
  pending_command_assemblies_.clear();
  announce_queue_head_ = 0;
  announce_queue_tail_ = 0;
  memset(announce_queue_, 0, sizeof(announce_queue_));
  discover_announce_pending_ = false;
  if (!preserve_route) {
    fast_rejoin_ = false;
    discovery_resume_normal_after_success_ = false;
    discovery_current_channel_only_ = false;
    wifi_waiting_ = false;
    wifi_wait_deadline_ms_ = 0;
    discover_retry_pending_ = false;
  }
  if (clear_entities) {
    entities_.clear();
    entity_records_.clear();
  }
}

void RemoteProtocol::rejoin_due_to_transmit_stall_(uint32_t now, const char *reason) {
  const uint32_t outbound_age = elapsed_ms_since(now, last_successful_outbound_ms_);
  const uint32_t state_age = elapsed_ms_since(now, last_successful_state_ms_);
  if (reason != nullptr && strcmp(reason, "no outbound progress") == 0) {
    ESP_LOGE(TAG, "%sNO OUTBOUND PROGRESS for %ums — cold rebooting in 10 seconds%s",
             COLOR_RED, outbound_age, COLOR_RESET);
    clear_session_state_(false, true);
    delay(10000);
#if defined(ARDUINO_ARCH_ESP8266)
    ESP.restart();
#else
    esp_restart();
#endif
  }
  ESP_LOGW(TAG, "%sTransmit stall detected (%s), forcing rejoin"
           " [fails=%u outbound_age=%ums state_age=%ums now=%u]%s",
           COLOR_YELLOW, reason != nullptr ? reason : "unknown",
           consecutive_send_failures_,
           outbound_age,
           state_age,
           now, COLOR_RESET);
  start_route_recovery_cycle_();
  discover_due_ms_ = now;
}

void RemoteProtocol::select_parent_candidate_(const uint8_t *sender_mac, const espnow_discover_announce_t &announce, int8_t rssi) {
  uint8_t preferred_index = 0xFF;
  if (!preferred_parents_.empty()) {
    for (size_t i = 0; i < preferred_parents_.size(); ++i) {
      if ((sender_mac != nullptr && memcmp(preferred_parents_[i].data(), sender_mac, 6) == 0) ||
          memcmp(preferred_parents_[i].data(), announce.responder_mac, 6) == 0) {
        preferred_index = static_cast<uint8_t>(i);
        break;
      }
    }
  }

  const bool better = !best_parent_.valid ||
                      preferred_index < best_parent_.preferred_index ||
                      (preferred_index == best_parent_.preferred_index &&
                       (announce.hops_to_bridge < best_parent_.hops_to_bridge ||
                        (announce.hops_to_bridge == best_parent_.hops_to_bridge &&
                         rssi > best_parent_.rssi)));
  if (!better) return;
  memcpy(best_parent_.next_hop_mac.data(), sender_mac, 6);
  best_parent_.responder_role = announce.responder_role;
  best_parent_.bridge_reachable = announce.bridge_reachable != 0;
  best_parent_.flags = announce.flags;
  best_parent_.hops_to_bridge = announce.hops_to_bridge;
  best_parent_.rssi = rssi;
  best_parent_.valid = true;
  best_parent_.preferred_index = preferred_index;
#if defined(ARDUINO_ARCH_ESP8266)
  best_parent_.channel = wifi_get_channel();
#else
  uint8_t current_channel = 1;
  wifi_second_chan_t sec = WIFI_SECOND_CHAN_NONE;
  esp_wifi_get_channel(&current_channel, &sec);
  best_parent_.channel = current_channel;
#endif
  ESP_LOGI(TAG, "Accepted parent candidate sender=%s responder=%s next_hop=%s role=%u hops=%u rssi=%d preferred=%s",
           format_mac_(sender_mac).c_str(), format_mac_(announce.responder_mac).c_str(),
           format_mac_(best_parent_.next_hop_mac.data()).c_str(), announce.responder_role,
           announce.hops_to_bridge, rssi,
           preferred_index == 0xFF ? "none" : std::to_string(preferred_index).c_str());
}

bool RemoteProtocol::is_preferred_parent_(const uint8_t *, const uint8_t *) const {
  return true;
}

std::string RemoteProtocol::format_mac_(const uint8_t *mac) { return mac_display(mac); }

void RemoteProtocol::prune_pending_command_fragments_(uint32_t now) {
  for (auto it = pending_command_assemblies_.begin(); it != pending_command_assemblies_.end();) {
    if (it->second.active && now - it->second.last_seen_ms >= ESPNOW_FRAGMENT_ASSEMBLY_TIMEOUT_MS) {
      ESP_LOGW(TAG, "Dropping expired COMMAND fragments for entity %u", it->first);
      pending_command_reserved_bytes_ -= it->second.data.size();
      it = pending_command_assemblies_.erase(it);
    } else {
      ++it;
    }
  }
}

void RemoteProtocol::start_discovery_cycle_(bool wifi_wait_expired) {
  clear_session_state_(false);
  discovering_ = true;
  fast_rejoin_ = false;
  discovery_resume_normal_after_success_ = false;
  discovery_current_channel_only_ = false;
  discover_retry_pending_ = false;
  discover_retry_count_ = 0;
  discover_phase_ = 0;
  sweep_complete_ = false;
  topology_refresh_due_ms_ = 0;
  fill_random_bytes(remote_nonce_.data(), remote_nonce_.size());

  if (!wifi_wait_expired && wifi::global_wifi_component != nullptr && !wifi_connected_()) {
    // If no STA is configured (AP-only), there's nothing to wait for — skip
    // the 15s wifi wait and start discovery immediately.
    if (wifi::global_wifi_component->has_sta()) {
      wifi_waiting_ = true;
      wifi_wait_deadline_ms_ = millis() + ESPNOW_WIFI_DISCOVER_WAIT_MS;
      state_name_ = "WAIT_WIFI";
      queue_state_log_(espnow_log_state_t::DISCOVERING, "State: WAIT_WIFI");
      discover_due_ms_ = wifi_wait_deadline_ms_;
      return;
    }
  }

  wifi_waiting_ = false;
  wifi_wait_deadline_ms_ = 0;
  discovery_current_channel_only_ = wifi_connected_();
  if (discovery_current_channel_only_) {
    channel_index_ = 0;
    state_name_ = "DISCOVERING";
    discover_due_ms_ = millis();
    const uint8_t ch = current_wifi_channel_();
    ESP_LOGI(TAG, "Starting Discovery Fast Connect...");
    const auto err = set_wifi_channel_with_recovery(ch, "wifi discovery start");
    if (err != 0) {
      ESP_LOGW(TAG, "esp_wifi_set_channel(%u) failed when starting wifi discovery: err=%d", ch, static_cast<int>(err));
    }
    return;
  }

  channel_index_ = 0;
  state_name_ = "DISCOVERING";
  discover_due_ms_ = millis();
  const uint8_t start_channel = sweep_channel_from_index(channel_index_);
  ESP_LOGI(TAG, "Starting discovery channel scan...");
  const auto err = set_wifi_channel_with_recovery(start_channel, "discovery start");
  if (err != 0) {
    ESP_LOGW(TAG, "esp_wifi_set_channel(%u) failed when starting discovery: err=%d", start_channel, static_cast<int>(err));
  }
}

void RemoteProtocol::mark_all_entities_dirty_() {
  for (auto &record : entity_records_) record.dirty = true;
}

void RemoteProtocol::compute_schema_hash_(uint8_t out_hash[32]) const {
  std::vector<uint8_t> bytes;
  bytes.reserve(entity_records_.size() * ESPNOW_SCHEMA_HASH_LEN + ESPNOW_NODE_ID_LEN +
                ESPNOW_NODE_LABEL_LEN + sizeof(firmware_epoch_) +
                ESPNOW_PROJECT_NAME_LEN + ESPNOW_PROJECT_VERSION_LEN +
                sizeof(chip_model_) + build_date_.size() + 1 + build_time_.size() + 1);
  bytes.insert(bytes.end(), esphome_name_.begin(), esphome_name_.end());
  bytes.push_back(0);
  bytes.insert(bytes.end(), node_label_.begin(), node_label_.end());
  bytes.push_back(0);
  for (size_t i = 0; i < sizeof(firmware_epoch_); i++) {
    bytes.push_back(static_cast<uint8_t>((firmware_epoch_ >> (i * 8)) & 0xFF));
  }
  bytes.insert(bytes.end(), project_name_.begin(), project_name_.end());
  bytes.push_back(0);
  bytes.insert(bytes.end(), project_version_.begin(), project_version_.end());
  bytes.push_back(0);
  for (size_t i = 0; i < sizeof(chip_model_); i++) {
    bytes.push_back(static_cast<uint8_t>((chip_model_ >> (i * 8)) & 0xFF));
  }
  bytes.insert(bytes.end(), build_date_.begin(), build_date_.end());
  bytes.push_back(0);
  bytes.insert(bytes.end(), build_time_.begin(), build_time_.end());
  bytes.push_back(0);
  for (size_t i = 0; i < entity_records_.size(); i++) {
    std::vector<uint8_t> payload;
    append_schema_push_payload(payload, ESPNOW_DESCRIPTOR_TYPE_ENTITY, static_cast<uint8_t>(i),
                               static_cast<uint8_t>(i), static_cast<uint8_t>(entity_records_.size()),
                               entity_records_[i].schema.entity_type,
                               reinterpret_cast<const uint8_t *>(entity_records_[i].schema.entity_name.data()),
                               entity_records_[i].schema.entity_name.size(),
                               reinterpret_cast<const uint8_t *>(entity_records_[i].schema.entity_unit.data()),
                               entity_records_[i].schema.entity_unit.size(),
                               reinterpret_cast<const uint8_t *>(entity_records_[i].schema.entity_id.data()),
                               entity_records_[i].schema.entity_id.size(),
                               reinterpret_cast<const uint8_t *>(entity_records_[i].schema.entity_options.data()),
                               entity_records_[i].schema.entity_options.size());
    bytes.insert(bytes.end(), payload.begin(), payload.begin() + std::min<size_t>(payload.size(), ESPNOW_SCHEMA_HASH_LEN));
  }
  sha256_bytes(bytes.data(), bytes.size(), out_hash);
}

}  // namespace esp_tree
}  // namespace esphome
