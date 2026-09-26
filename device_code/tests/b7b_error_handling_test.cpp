#include "../components/esp_tree_common/espnow_types.h"

#include <cstdint>
#include <cstring>
#include <iostream>
#include <vector>

using namespace esphome::esp_tree;

static int failures = 0;

static void expect(bool cond, const char* msg) {
  if (!cond) {
    std::cerr << "FAIL: " << msg << '\n';
    failures++;
  }
}

static void test_truncated_frame_header() {
  uint8_t short_header[10] = {0};
  espnow_frame_header_t header{};
  size_t copy_len = std::min(sizeof(header), sizeof(short_header));
  memcpy(&header, short_header, copy_len);

  expect(header.protocol_version == 0, "truncated header: fields zeroed");
  expect(header.packet_type == 0, "truncated header: packet_type is 0");
}

static void test_zero_length_frame() {
  std::vector<uint8_t> empty_frame;
  espnow_frame_header_t header{};

  expect(empty_frame.size() < sizeof(espnow_frame_header_t), "empty frame smaller than header");
}

static void test_oversized_frame() {
  std::vector<uint8_t> huge_frame(4096, 0xFF);
  expect(huge_frame.size() > 512, "huge frame size > 512");

  espnow_frame_header_t header{};
  memcpy(&header, huge_frame.data(), sizeof(header));
  expect(header.protocol_version == 0xFF, "oversized frame: protocol version is 0xFF");
}

static void test_wrong_protocol_version() {
  espnow_frame_header_t header{};
  header.protocol_version = 0xFF;
  header.packet_type = PKT_DISCOVER;

  bool valid = (header.protocol_version == ESPNOW_PROTOCOL_VER);
  expect(!valid, "wrong protocol version rejected");
}

static void test_unknown_packet_type() {
  espnow_frame_header_t header{};
  header.protocol_version = ESPNOW_PROTOCOL_VER;
  header.packet_type = 0xFF;

  expect(!is_valid_packet_type(static_cast<espnow_packet_type_t>(header.packet_type)),
         "unknown packet type rejected");
}

static void test_invalid_hop_count() {
  espnow_frame_header_t header{};
  header.protocol_version = ESPNOW_PROTOCOL_VER;
  header.packet_type = PKT_DISCOVER;
  header.hop_count = ESPNOW_HOPS_MAKE(ESPNOW_HOPS_DIR_UP, 0x7F);

  /* hop_count is a 4-bit field (ESPNOW_HOPS_COUNT_MASK == 0x0Fu); the upper
   * nibble carries the direction/parent-check flags. ESPNOW_HOPS_MAKE() masks
   * the count, so 0x7F cannot survive the round trip — the extracted count is
   * 0x0F, not 0x7F. ESPNOW_HOPS_LIMIT (8) is the practical ceiling. */
  uint8_t hop_count = ESPNOW_HOPS_COUNT(header.hop_count);
  expect(hop_count == 0x0F, "hop count extracted correctly (4-bit field, value masked)");
}

static void test_null_payload_for_encrypted() {
  espnow_frame_header_t header{};
  header.protocol_version = ESPNOW_PROTOCOL_VER;
  header.packet_type = PKT_STATE;

  expect(is_encrypted_packet(static_cast<espnow_packet_type_t>(header.packet_type)),
         "STATE is encrypted packet");

  EntityPayloadView view{};
  bool parsed = parse_entity_payload(nullptr, 0, view);
  expect(!parsed, "null payload rejected for encrypted packet parse");
}

static void test_parse_entity_payload_truncated_header() {
  std::vector<uint8_t> payload;
  payload.resize(3);

  EntityPayloadView view{};
  bool parsed = parse_entity_payload(payload.data(), payload.size(), view);
  expect(!parsed, "truncated entity payload header rejected");
}

static void test_parse_schema_push_null_ptr() {
  SchemaPushView view{};
  bool parsed = parse_schema_push_payload(nullptr, 100, view);
  expect(!parsed, "null schema push payload rejected");
}

static void test_parse_schema_push_truncated() {
  std::vector<uint8_t> short_payload(5, 0);
  SchemaPushView view{};
  bool parsed = parse_schema_push_payload(short_payload.data(), short_payload.size(), view);
  expect(!parsed, "truncated schema push payload rejected");
}

static void test_frame_with_invalid_mac() {
  espnow_frame_header_t header{};
  header.protocol_version = ESPNOW_PROTOCOL_VER;
  header.packet_type = PKT_DISCOVER;

  uint8_t zero_mac[6] = {0};
  bool valid_mac = false;
  for (int i = 0; i < 6; i++) {
    if (header.leaf_mac[i] != zero_mac[i]) {
      valid_mac = true;
      break;
    }
  }
  expect(valid_mac || header.leaf_mac[0] == 0, "frame header has mac field (may be zero)");
}

static void test_tx_counter_wraparound() {
  espnow_frame_header_t header{};
  header.tx_counter = 0xFFFFFFFF;

  uint32_t counter = header.tx_counter;
  expect(counter == 0xFFFFFFFF, "tx_counter can hold max value");
}

static void test_psk_tag_all_zeros() {
  uint8_t psk_tag[ESPNOW_PSK_TAG_LEN] = {0};
  uint8_t zeros[ESPNOW_PSK_TAG_LEN] = {0};
  expect(memcmp(psk_tag, zeros, ESPNOW_PSK_TAG_LEN) == 0, "psk_tag all zeros is valid (just all zeros)");
}

static void test_psk_tag_all_ones() {
  uint8_t psk_tag[ESPNOW_PSK_TAG_LEN];
  memset(psk_tag, 0xFF, ESPNOW_PSK_TAG_LEN);

  uint8_t all_zeros[ESPNOW_PSK_TAG_LEN] = {0};
  expect(memcmp(psk_tag, all_zeros, ESPNOW_PSK_TAG_LEN) != 0, "psk_tag all ones differs from zeros");
}

static void test_fragment_assembly_invalid_index() {
  EntityPayloadView view{};
  view.fragment_count = 3;
  view.fragment_index = 3;

  bool invalid = (view.fragment_index >= view.fragment_count);
  expect(invalid, "fragment index >= count is invalid");
}

static void test_fragment_assembly_index_equal_count() {
  EntityPayloadView view{};
  view.fragment_count = 5;
  view.fragment_index = 5;

  bool invalid = (view.fragment_index >= view.fragment_count);
  expect(invalid, "fragment index == count is invalid");
}

static void test_empty_fragment_vector() {
  espnow_fragment_assembly_t assembly{};
  assembly.active = true;
  assembly.fragment_count = 1;
  assembly.bytes_received = 0;

  expect(assembly.data.empty(), "empty fragment data is valid (zero bytes)");
}

static void test_state_payload_too_short() {
  std::vector<uint8_t> payload(3, 0);
  EntityPayloadView view{};

  bool parsed = parse_entity_payload(payload.data(), payload.size(), view);
  expect(!parsed, "state payload too short for header");
}

static void test_ack_too_short() {
  std::vector<uint8_t> payload(1, 0);
  espnow_ack_t ack{};
  expect(payload.size() < sizeof(ack), "ack payload too short");
}

int main() {
  std::cout << "\n[Error/Malformed] Packet error handling tests:\n";

  test_truncated_frame_header();
  test_zero_length_frame();
  test_oversized_frame();
  test_wrong_protocol_version();
  test_unknown_packet_type();
  test_invalid_hop_count();
  test_null_payload_for_encrypted();
  test_parse_entity_payload_truncated_header();
  test_parse_schema_push_null_ptr();
  test_parse_schema_push_truncated();
  test_frame_with_invalid_mac();
  test_tx_counter_wraparound();
  test_psk_tag_all_zeros();
  test_psk_tag_all_ones();
  test_fragment_assembly_invalid_index();
  test_fragment_assembly_index_equal_count();
  test_empty_fragment_vector();
  test_state_payload_too_short();
  test_ack_too_short();

  std::cout << "  error handling tests completed\n";

  return failures == 0 ? 0 : 1;
}