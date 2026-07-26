#pragma once

#include <array>
#include <cstddef>
#include <cstdint>
#include <functional>
#include <map>
#include <set>
#include <string>
#include <vector>

#include "esp_tree_common/espnow_types.h"

namespace esphome {
namespace esp_tree {
namespace bridge_api {

static constexpr size_t kServerNonceBytes = 16;
static constexpr size_t kHmacDigestBytes = 32;
static constexpr size_t kHmacHexChars = kHmacDigestBytes * 2;
static constexpr uint32_t kHeartbeatIntervalMs = 30000;
static constexpr size_t kMaxJsonBytes = 8192;
static constexpr size_t kMaxOutboundFrameBytes = 16384;
static constexpr size_t kMaxChunkSize = 2048;
static constexpr uint8_t kOtaMaxIncrementKB = ESPNOW_MAX_INCREMENT_KB;

namespace error {
static constexpr const char *AUTH_FAILED = "auth_failed";
static constexpr const char *INVALID_JSON = "invalid_json";
static constexpr const char *INVALID_ENVELOPE = "invalid_envelope";
static constexpr const char *UNSUPPORTED_VERSION = "unsupported_version";
static constexpr const char *UNKNOWN_TYPE = "unknown_type";
static constexpr const char *INVALID_PAYLOAD = "invalid_payload";
static constexpr const char *BRIDGE_NOT_READY = "bridge_not_ready";
static constexpr const char *NODE_NOT_FOUND = "node_not_found";
static constexpr const char *REMOTE_NOT_FOUND = "remote_not_found";
static constexpr const char *OTA_BUSY = "ota_busy";
static constexpr const char *OTA_NOT_ACTIVE = "ota_not_active";
static constexpr const char *OTA_INVALID_CHUNK = "ota_invalid_chunk";
static constexpr const char *OTA_REJECTED = "ota_rejected";
static constexpr const char *OTA_INVALID_SIZE = "ota_invalid_size";
static constexpr const char *OTA_INVALID_MD5 = "ota_invalid_md5";
static constexpr const char *OTA_ABORTED = "ota_aborted";
static constexpr const char *CLIENT_ALREADY_CONNECTED = "client_already_connected";
static constexpr const char *INTERNAL_ERROR = "internal_error";
}  // namespace error

namespace config_result {
static constexpr const char *OK = "ok";
static constexpr const char *BUSY = "busy";
static constexpr const char *REJECTED = "rejected";
static constexpr const char *UNSUPPORTED = "unsupported";
static constexpr const char *INVALID_PAYLOAD = "invalid_payload";
static constexpr const char *TIMEOUT = "timeout";
static constexpr const char *NO_SESSION = "no_session";
static constexpr const char *NOT_REMOTE = "not_remote";
}  // namespace config_result

enum class OtaJobState : uint8_t {
  IDLE,
  WAITING_FOR_LEAF,
  TRANSFERRING,
  VERIFYING,
  SUCCESS,
  FAILED,
  ABORTED,
};

inline const char *ota_job_state_string(OtaJobState state) {
  switch (state) {
    case OtaJobState::IDLE:
      return "idle";
    case OtaJobState::WAITING_FOR_LEAF:
      return "waiting_for_leaf";
    case OtaJobState::TRANSFERRING:
      return "transferring";
    case OtaJobState::VERIFYING:
      return "verifying";
    case OtaJobState::SUCCESS:
      return "success";
    case OtaJobState::FAILED:
      return "failed";
    case OtaJobState::ABORTED:
      return "aborted";
    default:
      return "unknown";
  }
}

using NodeConfigCallback = std::function<void(const std::string &result, const std::string &command)>;

struct BridgeFacade {
  virtual ~BridgeFacade() = default;
  virtual std::string api_bridge_info_json() const = 0;
  virtual std::string api_topology_snapshot_json(const std::string &request_payload_json) const = 0;
  virtual std::string api_node_schema_json(const std::string &mac_colon) const = 0;
  virtual std::string api_node_state_json(const std::string &mac_colon) const = 0;
  virtual bool api_node_config_start(const std::string &mac_colon, uint8_t command,
                                     const std::vector<uint8_t> &payload,
                                     const std::string &command_name,
                                     NodeConfigCallback callback,
                                     std::string &immediate_result_out) = 0;

  virtual bool api_ota_start(const std::string &target_mac_colon,
                             uint32_t file_size, const std::string &md5_hex,
                             const std::string &sha256_hex,
                             const std::string &filename,
                             uint16_t preferred_chunk_size,
                             std::string &job_id_out,
                             uint16_t &max_chunk_size_out,
                             const std::string &request_id,
                             std::string &error_out) = 0;
  virtual bool api_ota_abort(const std::string &job_id,
                             const std::string &reason) = 0;
  virtual bool api_ota_inject_chunk(uint32_t sequence, const uint8_t *data,
                                    size_t len) = 0;
  virtual bool api_ota_has_active_job() const = 0;
  virtual std::string api_ota_active_job_id() const = 0;
  virtual std::string api_ota_active_chunk_request_id() const = 0;
  virtual uint16_t api_ota_chunk_size() const = 0;
  virtual uint16_t api_ota_max_chunks_per_batch() const = 0;
  virtual std::vector<uint32_t> api_ota_requested_sequences() const = 0;
  virtual void api_ota_resend_chunk_request() = 0;
};

}  // namespace bridge_api
}  // namespace esp_tree
}  // namespace esphome
