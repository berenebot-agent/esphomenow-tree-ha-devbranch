#ifdef USE_SERIAL

#include "bridge_api_serial.h"
#include "bridge_api_auth.h"
#include "bridge_json_utils.h"
#include "esp_tree_bridge.h"
#include "esp_tree_common/cobs_codec.h"
#include "esp_tree_common/espnow_crypto.h"

#include "esphome/components/uart/uart_component.h"
#include "esphome/core/hal.h"
#include "esphome/core/log.h"

#include <algorithm>
#include <cstring>

namespace esphome {
namespace esp_tree {
namespace bridge_api {

namespace {

static const char *const TAG = "bridge_api_serial";

static bool constant_time_equal(const uint8_t *a, const uint8_t *b, size_t len) {
  uint8_t diff = 0;
  for (size_t i = 0; i < len; ++i) diff |= static_cast<uint8_t>(a[i] ^ b[i]);
  return diff == 0;
}

}  // namespace

enum class SerialAuthState {
  WAITING_HELLO,
  CHALLENGE_SENT,
  WAITING_AUTH_RESPONSE,
  AUTHENTICATED,
  AUTH_FAILED,
};

struct BridgeApiSerialTransport::Impl {
  Impl(ESPTreeBridge *bridge, BridgeApiSerialTransport *owner, esphome::uart::UARTComponent *uart)
      : bridge(bridge), owner(owner), uart(uart) {}

  ESPTreeBridge *bridge{nullptr};
  BridgeApiSerialTransport *owner{nullptr};
  esphome::uart::UARTComponent *uart{nullptr};
  SerialAuthState auth_state{SerialAuthState::WAITING_HELLO};
  std::vector<uint8_t> rx_buffer;
  std::array<uint8_t, runtime_pb::kRuntimeServerNonceBytes> server_nonce{};
  uint32_t last_data_ms{0};
  uint32_t last_heartbeat_ms{0};
  uint32_t rx_dropped_{0};

  static constexpr uint32_t CONNECTION_TIMEOUT_MS = 60000;
  static constexpr size_t MAX_RX_BUFFER = runtime_pb::kRuntimeMaxFrameBytes * 2;

  bool has_authenticated_client() const {
    return auth_state == SerialAuthState::AUTHENTICATED;
  }

  void send_cobs_frame(const std::vector<uint8_t> &payload) {
    if (payload.empty()) return;
    std::vector<uint8_t> encoded;
    encoded.resize(payload.size() + payload.size() / 254 + 3);
    const size_t enc_len = esphome::esp_tree::cobs_encode(payload.data(), payload.size(), encoded.data());
    encoded.resize(enc_len);
    encoded.push_back(0x00);
    uart->write_array(encoded);
  }

  void send_auth_challenge() {
    fill_random_bytes(server_nonce.data(), server_nonce.size());
    auth_state = SerialAuthState::CHALLENGE_SENT;

    const std::string bridge_mac = bridge == nullptr ? "" : bridge->api_runtime_bridge_mac();
    std::vector<uint8_t> frame;
    runtime_pb::envelope(frame, "", runtime_pb::AUTH_CHALLENGE, [&](runtime_pb::Writer &w) {
      w.bytes(1, server_nonce.data(), server_nonce.size());
      w.varint(2, runtime_pb::kRuntimeApiVersion);
      w.varint(3, runtime_pb::kRuntimeApiVersion);
      w.string(4, runtime_pb::kRuntimeProtocol);
      w.string(5, bridge_mac);
    });
    send_cobs_frame(frame);
    ESP_LOGI(TAG, "Sent auth challenge over serial");
  }

  bool verify_auth_response(const runtime_pb::ParsedAuthResponse &response) {
    if (bridge == nullptr || response.client_kind.empty() || response.client_nonce.empty() ||
        response.hmac_sha256.size() != runtime_pb::kRuntimeHmacBytes) {
      return false;
    }
    const std::string server_nonce_hex = bridge_api::bytes_to_lower_hex(
        server_nonce.data(), server_nonce.size());
    const std::string client_nonce_hex = bridge_api::bytes_to_lower_hex(
        response.client_nonce.data(), response.client_nonce.size());
    const std::string input = std::string(runtime_pb::kRuntimeProtocol) + "|" +
                              runtime_pb::kRuntimeProtocolVersionLabel + "|" + response.client_kind + "|" +
                              server_nonce_hex + "|" + client_nonce_hex;
    const std::string &api_key = bridge->api_key();
    uint8_t digest[runtime_pb::kRuntimeHmacBytes]{};
    espnow_crypto_hmac_sha256(reinterpret_cast<const uint8_t *>(api_key.data()), api_key.size(),
                              reinterpret_cast<const uint8_t *>(input.data()), input.size(), digest);
    return constant_time_equal(digest, response.hmac_sha256.data(), sizeof(digest));
  }

  void send_auth_ok(const std::string &request_id) {
    std::vector<uint8_t> frame;
    bridge->api_runtime_encode_auth_ok(request_id, frame);
    send_cobs_frame(frame);
  }

  void send_auth_failed(const std::string &request_id, const std::string &code, const std::string &message) {
    std::vector<uint8_t> frame;
    runtime_pb::auth_failed_envelope(frame, request_id, code, message);
    send_cobs_frame(frame);
  }

  void reset_auth() {
    auth_state = SerialAuthState::WAITING_HELLO;
    rx_buffer.clear();
    if (bridge != nullptr) {
      bridge->clear_ota_transport_callbacks(owner);
    }
  }

  void handle_envelope(const runtime_pb::ParsedEnvelope &env) {
    if (auth_state == SerialAuthState::WAITING_HELLO || auth_state == SerialAuthState::CHALLENGE_SENT) {
      if (env.msg_field == runtime_pb::AUTH_RESPONSE) {
        runtime_pb::ParsedAuthResponse response;
        if (!runtime_pb::parse_auth_response(env.msg_data, env.msg_len, response) || !verify_auth_response(response)) {
          ESP_LOGW(TAG, "Serial auth failed: HMAC mismatch");
          send_auth_failed(env.request_id, "auth_failed", "Authentication failed");
          reset_auth();
          return;
        }
        auth_state = SerialAuthState::AUTHENTICATED;
        last_heartbeat_ms = millis();
        last_data_ms = millis();
        if (bridge != nullptr) {
          bridge->set_ota_transport_callbacks(owner);
        }
        send_auth_ok(env.request_id);
        ESP_LOGI(TAG, "Serial client authenticated");
        return;
      }
      ESP_LOGW(TAG, "Serial: unexpected message type %u before auth, sending challenge", env.msg_field);
      send_auth_challenge();
      return;
    }

    if (auth_state != SerialAuthState::AUTHENTICATED) return;

    last_data_ms = millis();

    if (env.msg_field == runtime_pb::CLIENT_HELLO) {
      if (bridge == nullptr) return;
      std::vector<uint8_t> snapshot;
      bridge->api_runtime_encode_full_snapshot(env.request_id, snapshot);
      send_cobs_frame(snapshot);
    } else if (env.msg_field == runtime_pb::PING) {
      const uint64_t monotonic = runtime_pb::ping_monotonic_ms(env.msg_data, env.msg_len);
      std::vector<uint8_t> pong;
      runtime_pb::envelope(pong, env.request_id, runtime_pb::PONG, [&](runtime_pb::Writer &w) {
        w.varint(1, monotonic);
      });
      send_cobs_frame(pong);
    } else if (env.msg_field == runtime_pb::COMMAND_REQUEST) {
      if (bridge == nullptr) return;
      runtime_pb::ParsedCommandRequest request;
      std::vector<uint8_t> result;
      if (!runtime_pb::parse_command_request(env.msg_data, env.msg_len, request)) {
        runtime_pb::error_envelope(result, env.request_id, "invalid_command", "Invalid command request");
      } else {
        bridge->api_runtime_handle_command(env.request_id, request, result);
      }
      send_cobs_frame(result);
    } else if (env.msg_field == runtime_pb::CONFIG_COMMAND_REQUEST) {
      if (bridge == nullptr) return;
      runtime_pb::ParsedConfigCommandRequest request;
      if (!runtime_pb::parse_config_command_request(env.msg_data, env.msg_len, request)) {
        std::vector<uint8_t> err;
        runtime_pb::error_envelope(err, env.request_id, "invalid_config_command", "Invalid config command request");
        send_cobs_frame(err);
      } else {
        bridge->api_runtime_handle_config_command(
            env.request_id, request,
            [this](const std::vector<uint8_t> &result) { send_cobs_frame(result); });
      }
    } else if (env.msg_field == runtime_pb::STATE_RECEIPT) {
      if (bridge == nullptr) return;
      runtime_pb::ParsedStateReceipt receipt;
      if (runtime_pb::parse_state_receipt(env.msg_data, env.msg_len, receipt)) {
        bridge->api_runtime_handle_state_receipt(receipt.remote_mac, receipt.session_id,
                                                 receipt.state_tx_counter, receipt.entity_index);
      }
    } else if (env.msg_field == runtime_pb::OTA_START_REQUEST ||
               env.msg_field == runtime_pb::OTA_CHUNK_BATCH ||
               env.msg_field == runtime_pb::OTA_ABORT_REQUEST) {
      std::vector<uint8_t> err;
      runtime_pb::error_envelope(err, env.request_id, "unsupported_message",
                                  "OTA is not supported over serial transport");
      send_cobs_frame(err);
    } else {
      std::vector<uint8_t> err;
      runtime_pb::error_envelope(err, env.request_id, "unsupported_message", "Unsupported runtime request");
      send_cobs_frame(err);
    }
  }

  void process_rx_buffer() {
    while (true) {
      auto delim = std::find(rx_buffer.begin(), rx_buffer.end(), 0x00);
      if (delim == rx_buffer.end()) return;

      std::vector<uint8_t> frame_data(rx_buffer.begin(), delim);
      rx_buffer.erase(rx_buffer.begin(), delim + 1);

      if (frame_data.empty()) continue;

      std::vector<uint8_t> decoded;
      decoded.resize(frame_data.size());
      size_t decoded_len = 0;
      if (!esphome::esp_tree::cobs_decode(frame_data.data(), frame_data.size(),
                                           decoded.data(), decoded_len)) {
        ESP_LOGW(TAG, "Serial: COBS decode failure, discarding frame");
        continue;
      }
      decoded.resize(decoded_len);
      if (decoded.empty()) continue;

      runtime_pb::ParsedEnvelope env;
      if (!runtime_pb::parse_envelope(decoded.data(), decoded.size(), env)) {
        ESP_LOGW(TAG, "Serial: protobuf parse failure, discarding frame");
        continue;
      }
      if (env.api_version != runtime_pb::kRuntimeApiVersion) {
        std::vector<uint8_t> err;
        runtime_pb::error_envelope(err, env.request_id, "unsupported_version", "Unsupported API version");
        send_cobs_frame(err);
        continue;
      }

      handle_envelope(env);
    }
  }

  void check_connection_timeout() {
    if (auth_state == SerialAuthState::AUTHENTICATED && last_data_ms != 0) {
      const uint32_t now = millis();
      if (now - last_data_ms >= CONNECTION_TIMEOUT_MS) {
        ESP_LOGW(TAG, "Serial: no data received for %ums, resetting auth",
                 static_cast<unsigned>(CONNECTION_TIMEOUT_MS));
        reset_auth();
      }
    }
  }

  void emit_heartbeat_if_due() {
    if (!has_authenticated_client() || bridge == nullptr) return;
    const uint32_t now = millis();
    if (last_heartbeat_ms != 0 && now - last_heartbeat_ms < runtime_pb::kRuntimeHeartbeatIntervalMs) return;
    last_heartbeat_ms = now;
    std::vector<uint8_t> frame;
    bridge->api_runtime_encode_bridge_heartbeat(frame);
    send_cobs_frame(frame);
  }
};

BridgeApiSerialTransport::BridgeApiSerialTransport(ESPTreeBridge *bridge, esphome::uart::UARTComponent *uart)
    : impl_(new Impl(bridge, this, uart)) {}

BridgeApiSerialTransport::~BridgeApiSerialTransport() = default;

void BridgeApiSerialTransport::loop() {
  if (impl_->uart == nullptr) return;

  while (impl_->uart->available() > 0) {
    uint8_t byte;
    if (!impl_->uart->read_byte(&byte)) break;
    if (impl_->rx_buffer.size() < impl_->MAX_RX_BUFFER) {
      impl_->rx_buffer.push_back(byte);
    } else {
      impl_->rx_dropped_++;
    }
  }

  if (impl_->rx_dropped_ > 0 && impl_->rx_dropped_ % 100 == 0) {
    ESP_LOGW(TAG, "Serial RX buffer full — dropped %u bytes so far", (unsigned int)impl_->rx_dropped_);
  }

  impl_->process_rx_buffer();
  impl_->check_connection_timeout();
  impl_->emit_heartbeat_if_due();
}

void BridgeApiSerialTransport::send_envelope(const std::vector<uint8_t> &data) {
  if (!impl_->has_authenticated_client()) return;
  impl_->send_cobs_frame(data);
}

bool BridgeApiSerialTransport::has_authenticated_client() const {
  return impl_->has_authenticated_client();
}

void BridgeApiSerialTransport::close_client() {
  impl_->reset_auth();
}

void BridgeApiSerialTransport::emit_heartbeat(uint32_t uptime_ms) {
  (void)uptime_ms;
  impl_->emit_heartbeat_if_due();
}

void BridgeApiSerialTransport::emit_topology_changed(const char *reason, const uint8_t *mac) {
  if (!has_authenticated_client() || impl_->bridge == nullptr) return;
  std::vector<uint8_t> frame;
  impl_->bridge->api_runtime_encode_topology_changed(reason, mac, frame);
  impl_->send_cobs_frame(frame);
}

void BridgeApiSerialTransport::emit_remote_availability(const uint8_t *mac, bool online, const char *reason,
                                                         int8_t rssi, uint32_t offline_s,
                                                         const uint8_t *parent_mac, uint8_t hop_count) {
  if (!has_authenticated_client() || impl_->bridge == nullptr) return;
  std::vector<uint8_t> frame;
  impl_->bridge->api_runtime_encode_remote_availability(mac, online, reason, rssi, offline_s, parent_mac, hop_count, frame);
  impl_->send_cobs_frame(frame);
}

void BridgeApiSerialTransport::emit_remote_state(const uint8_t *mac, const espnow_entity_schema_t &entity,
                                                  const std::vector<uint8_t> &value, espnow_field_type_t type,
                                                  uint32_t state_tx_counter) {
  if (!has_authenticated_client() || impl_->bridge == nullptr) return;
  std::vector<uint8_t> frame;
  impl_->bridge->api_runtime_encode_remote_state(mac, entity, value, type, state_tx_counter, frame);
  impl_->send_cobs_frame(frame);
}

void BridgeApiSerialTransport::emit_remote_schema_changed(const uint8_t *mac, const std::string &schema_hash) {
  if (!has_authenticated_client() || impl_->bridge == nullptr) return;
  std::vector<uint8_t> frame;
  impl_->bridge->api_runtime_encode_remote_schema_changed(mac, schema_hash, frame);
  impl_->send_cobs_frame(frame);
}

void BridgeApiSerialTransport::on_ota_accepted(const std::string &request_id, const std::string &job_id,
                                                const std::string &target_mac, uint16_t max_chunk_size,
                                                uint32_t total_chunks, uint16_t max_chunks_per_batch) {
  // OTA not supported over serial
}

void BridgeApiSerialTransport::on_ota_chunk_request(const std::string &job_id, const std::string &chunk_request_id,
                                                     const std::vector<uint32_t> &sequences,
                                                     uint32_t chunks_sent, uint32_t chunks_confirmed,
                                                     uint32_t current_increment, uint32_t total_increments,
                                                     uint32_t retransmit_round, uint32_t buffer_size_kb,
                                                     uint32_t percent) {
  // OTA not supported over serial
}

void BridgeApiSerialTransport::on_ota_status(const std::string &job_id, runtime_pb::OtaState state,
                                              uint32_t percent, uint32_t bytes_received,
                                              uint32_t file_size, const std::string &error_detail) {
  // OTA not supported over serial
}

void BridgeApiSerialTransport::on_ota_aborted(const std::string &request_id, const std::string &job_id,
                                               const std::string &reason) {
  // OTA not supported over serial
}

}  // namespace bridge_api
}  // namespace esp_tree
}  // namespace esphome

#endif  // USE_SERIAL