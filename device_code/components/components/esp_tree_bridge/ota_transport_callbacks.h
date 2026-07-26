#pragma once

#include "bridge_api_proto_messages.h"

#include <cstdint>
#include <string>
#include <vector>

namespace esphome {
namespace esp_tree {
namespace bridge_api {

class OtaTransportCallbacks {
 public:
  virtual ~OtaTransportCallbacks() = default;

  virtual void on_ota_accepted(const std::string &request_id, const std::string &job_id,
                               const std::string &target_mac, uint16_t max_chunk_size,
                               uint32_t total_chunks, uint16_t max_chunks_per_batch) = 0;
  virtual void on_ota_chunk_request(const std::string &job_id, const std::string &chunk_request_id,
                                    const std::vector<uint32_t> &sequences,
                                    uint32_t chunks_sent, uint32_t chunks_confirmed,
                                    uint32_t current_increment, uint32_t total_increments,
                                    uint32_t retransmit_round, uint32_t buffer_size_kb,
                                    uint32_t percent) = 0;
  virtual void on_ota_status(const std::string &job_id, runtime_pb::OtaState state,
                             uint32_t percent, uint32_t bytes_received,
                             uint32_t file_size, const std::string &error_detail) = 0;
  virtual void on_ota_aborted(const std::string &request_id, const std::string &job_id,
                              const std::string &reason) = 0;
};

}  // namespace bridge_api
}  // namespace esp_tree
}  // namespace esphome
