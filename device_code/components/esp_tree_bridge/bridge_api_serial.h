#pragma once

#ifdef USE_SERIAL

#include "bridge_api_proto_messages.h"
#include "esp_tree_common/espnow_types.h"
#include "ota_transport_callbacks.h"

#include <cstdint>
#include <memory>
#include <string>
#include <vector>

namespace esphome {
namespace uart {
class UARTComponent;
}  // namespace uart
}  // namespace esphome

namespace esphome {
namespace esp_tree {

class ESPTreeBridge;

namespace bridge_api {

class BridgeApiSerialTransport : public OtaTransportCallbacks {
 public:
  explicit BridgeApiSerialTransport(ESPTreeBridge *bridge, esphome::uart::UARTComponent *uart);
  ~BridgeApiSerialTransport();

  BridgeApiSerialTransport(const BridgeApiSerialTransport &) = delete;
  BridgeApiSerialTransport &operator=(const BridgeApiSerialTransport &) = delete;

  void loop();
  void send_envelope(const std::vector<uint8_t> &data);

  bool has_authenticated_client() const;
  void close_client();

  void emit_heartbeat(uint32_t uptime_ms);
  void emit_topology_changed(const char *reason, const uint8_t *mac);
  void emit_remote_availability(const uint8_t *mac, bool online, const char *reason, int8_t rssi,
                                uint32_t offline_s, const uint8_t *parent_mac, uint8_t hop_count);
  void emit_remote_state(const uint8_t *mac, const espnow_entity_schema_t &entity,
                         const std::vector<uint8_t> &value, espnow_field_type_t type,
                         uint32_t state_tx_counter);
  void emit_remote_schema_changed(const uint8_t *mac, const std::string &schema_hash);

  void on_ota_accepted(const std::string &request_id, const std::string &job_id,
                       const std::string &target_mac, uint16_t max_chunk_size,
                       uint32_t total_chunks, uint16_t max_chunks_per_batch) override;
  void on_ota_chunk_request(const std::string &job_id, const std::string &chunk_request_id,
                            const std::vector<uint32_t> &sequences,
                            uint32_t chunks_sent, uint32_t chunks_confirmed,
                            uint32_t current_increment, uint32_t total_increments,
                            uint32_t retransmit_round, uint32_t buffer_size_kb,
                            uint32_t percent) override;
  void on_ota_status(const std::string &job_id, runtime_pb::OtaState state,
                     uint32_t percent, uint32_t bytes_received,
                     uint32_t file_size, const std::string &error_detail) override;
  void on_ota_aborted(const std::string &request_id, const std::string &job_id,
                      const std::string &reason) override;

 private:
  struct Impl;
  std::unique_ptr<Impl> impl_;
};

}  // namespace bridge_api
}  // namespace esp_tree
}  // namespace esphome

#endif  // USE_SERIAL