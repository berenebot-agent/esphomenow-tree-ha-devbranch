#include "../components/esp_tree_common/espnow_types.h"

#include <cstring>
#include <iostream>

using namespace esphome::esp_tree;

static int failures = 0;

static void expect(bool cond, const char* msg) {
  if (!cond) {
    std::cerr << "FAIL: " << msg << '\n';
    failures++;
  }
}

static void test_packet_type_name() {
  expect(strcmp(packet_type_name(PKT_DISCOVER), "DISCOVER") == 0, "PKT_DISCOVER name");
  expect(strcmp(packet_type_name(PKT_DISCOVER_ANNOUNCE), "DISCOVER_ANNOUNCE") == 0, "PKT_DISCOVER_ANNOUNCE name");
  expect(strcmp(packet_type_name(PKT_JOIN), "JOIN") == 0, "PKT_JOIN name");
  expect(strcmp(packet_type_name(PKT_JOIN_ACK), "JOIN_ACK") == 0, "PKT_JOIN_ACK name");
  expect(strcmp(packet_type_name(PKT_STATE), "STATE") == 0, "PKT_STATE name");
  expect(strcmp(packet_type_name(PKT_ACK), "ACK") == 0, "PKT_ACK name");
  expect(strcmp(packet_type_name(PKT_COMMAND), "COMMAND") == 0, "PKT_COMMAND name");
  expect(strcmp(packet_type_name(PKT_SCHEMA_REQUEST), "SCHEMA_REQUEST") == 0, "PKT_SCHEMA_REQUEST name");
  expect(strcmp(packet_type_name(PKT_SCHEMA_PUSH), "SCHEMA_PUSH") == 0, "PKT_SCHEMA_PUSH name");
  expect(strcmp(packet_type_name(PKT_HEARTBEAT), "HEARTBEAT") == 0, "PKT_HEARTBEAT name");
  expect(strcmp(packet_type_name(PKT_DEAUTH), "DEAUTH") == 0, "PKT_DEAUTH name");
  expect(strcmp(packet_type_name(PKT_FILE_TRANSFER), "FILE_TRANSFER") == 0, "PKT_FILE_TRANSFER name");
  expect(strcmp(packet_type_name(PKT_FILE_DATA), "FILE_DATA") == 0, "PKT_FILE_DATA name");
  expect(strcmp(packet_type_name(static_cast<espnow_packet_type_t>(99)), "UNKNOWN") == 0, "unknown packet name");
}

static void test_is_valid_packet_type() {
  expect(is_valid_packet_type(PKT_DISCOVER), "DISCOVER valid");
  expect(is_valid_packet_type(PKT_DISCOVER_ANNOUNCE), "DISCOVER_ANNOUNCE valid");
  expect(is_valid_packet_type(PKT_JOIN), "JOIN valid");
  expect(is_valid_packet_type(PKT_JOIN_ACK), "JOIN_ACK valid");
  expect(is_valid_packet_type(PKT_STATE), "STATE valid");
  expect(is_valid_packet_type(PKT_ACK), "ACK valid");
  expect(is_valid_packet_type(PKT_COMMAND), "COMMAND valid");
  expect(is_valid_packet_type(PKT_SCHEMA_REQUEST), "SCHEMA_REQUEST valid");
  expect(is_valid_packet_type(PKT_SCHEMA_PUSH), "SCHEMA_PUSH valid");
  expect(is_valid_packet_type(PKT_HEARTBEAT), "HEARTBEAT valid");
  expect(is_valid_packet_type(PKT_DEAUTH), "DEAUTH valid");
  expect(is_valid_packet_type(PKT_FILE_TRANSFER), "FILE_TRANSFER valid");
  expect(is_valid_packet_type(PKT_FILE_DATA), "FILE_DATA valid");
  expect(!is_valid_packet_type(0xFF), "invalid type rejected");
}

static void test_is_encrypted_packet() {
  expect(!is_encrypted_packet(PKT_DISCOVER), "DISCOVER not encrypted");
  expect(!is_encrypted_packet(PKT_DISCOVER_ANNOUNCE), "DISCOVER_ANNOUNCE not encrypted");
  expect(!is_encrypted_packet(PKT_JOIN), "JOIN not encrypted");
  expect(!is_encrypted_packet(PKT_JOIN_ACK), "JOIN_ACK not encrypted");
  expect(is_encrypted_packet(PKT_STATE), "STATE encrypted");
  expect(is_encrypted_packet(PKT_ACK), "ACK encrypted");
  expect(is_encrypted_packet(PKT_COMMAND), "COMMAND encrypted");
  expect(is_encrypted_packet(PKT_SCHEMA_REQUEST), "SCHEMA_REQUEST encrypted");
  expect(is_encrypted_packet(PKT_SCHEMA_PUSH), "SCHEMA_PUSH encrypted");
  expect(is_encrypted_packet(PKT_HEARTBEAT), "HEARTBEAT encrypted");
  expect(!is_encrypted_packet(PKT_DEAUTH), "DEAUTH not encrypted");
  expect(is_encrypted_packet(PKT_FILE_TRANSFER), "FILE_TRANSFER encrypted");
  expect(is_encrypted_packet(PKT_FILE_DATA), "FILE_DATA encrypted");
}

static void test_identity_descriptor_payload_roundtrip() {
  std::vector<uint8_t> payload;
  const char node_id[] = "node-123";
  const char node_label[] = "Kitchen Remote";
  const char project_name[] = "espnow-lr";
  const char project_version[] = "1.2.3";
  const uint8_t firmware_md5[16] = {0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
                                     0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10};
  append_identity_descriptor_payload(payload,
                                     reinterpret_cast<const uint8_t *>(node_id), strlen(node_id),
                                     reinterpret_cast<const uint8_t *>(node_label), strlen(node_label),
                                     0x12345678u,
                                     reinterpret_cast<const uint8_t *>(project_name), strlen(project_name),
                                     reinterpret_cast<const uint8_t *>(project_version), strlen(project_version),
                                     7, ESPNOW_V1_MAX_PAYLOAD, 1,
                                     reinterpret_cast<const uint8_t *>("Jan 01 2026"), 11,
                                     reinterpret_cast<const uint8_t *>("00:00:00"), 8,
                                     firmware_md5, sizeof(firmware_md5));

  IdentityDescriptorView view{};
  uint8_t descriptor_index = 0xFF;
  expect(parse_identity_descriptor_payload(payload.data(), payload.size(), view, descriptor_index),
         "identity descriptor parse ok");
  expect(descriptor_index == 0, "identity descriptor index");
  expect(strcmp(reinterpret_cast<const char *>(view.esphome_name), node_id) == 0, "identity esphome_name");
  expect(strcmp(reinterpret_cast<const char *>(view.node_label), node_label) == 0, "identity node_label");
  expect(view.firmware_epoch == 0x12345678u, "identity firmware_epoch");
  expect(strcmp(reinterpret_cast<const char *>(view.project_name), project_name) == 0, "identity project_name");
  expect(strcmp(reinterpret_cast<const char *>(view.project_version), project_version) == 0, "identity project_version");
  expect(view.total_entities == 7, "identity total_entities");
  expect(view.max_frame_payload == ESPNOW_V1_MAX_PAYLOAD, "identity max_frame_payload");
  for (int i = 0; i < 16; i++) {
    expect(view.firmware_md5[i] == firmware_md5[i], "identity firmware_md5");
  }
}

static void test_parse_entity_payload_null() {
  EntityPayloadView view{};
  expect(!parse_entity_payload(nullptr, 100, view), "nullptr payload rejected");
}

static void test_parse_entity_payload_too_short() {
  EntityPayloadView view{};
  uint8_t short_payload[4] = {0, 0, 0, 0};
  expect(!parse_entity_payload(short_payload, sizeof(short_payload), view), "too short rejected");
}

static void test_parse_entity_payload_truncated() {
  EntityPayloadView view{};
  std::vector<uint8_t> payload;
  const uint8_t value[] = {1, 2, 3, 4, 5};
  append_entity_payload(payload, 3, 0, 0, 1, value, sizeof(value));

  /* A shortened payload is ACCEPTED at this layer by design, not rejected.
   * parse_entity_payload() derives the value length from
   * plaintext_len - sizeof(header) and deliberately ignores header->value_len,
   * because at V2 the fragment is up to 1440 bytes and value_len is a uint8_t
   * that cannot represent it (docs/esptree_radio_v3_spec.md:469). Truncation is
   * therefore not detectable here — and does not need to be: the frame is
   * authenticated and decrypted before parsing, so a truncated or altered frame
   * fails session-tag verification upstream and never reaches this function. */
  expect(parse_entity_payload(payload.data(), payload.size() - 1, view), "truncated payload accepted (length derived, not validated)");
  expect(view.value_len == sizeof(value) - 1, "value_len derived from actual payload length");
}

static void test_parse_entity_payload_zero_fragment_count() {
  EntityPayloadView view{};
  std::vector<uint8_t> payload;
  const uint8_t value[] = {7, 8};
  append_entity_payload(payload, 4, 0, 0, 1, value, sizeof(value));
  auto* header = reinterpret_cast<espnow_entity_packet_header_t*>(payload.data());
  header->fragment_count = 0;
  expect(!parse_entity_payload(payload.data(), payload.size(), view), "zero fragment count rejected");
}

static void test_parse_entity_payload_out_of_range_index() {
  EntityPayloadView view{};
  std::vector<uint8_t> payload;
  const uint8_t value[] = {7, 8};
  append_entity_payload(payload, 4, 0, 0, 1, value, sizeof(value));
  auto* header = reinterpret_cast<espnow_entity_packet_header_t*>(payload.data());
  header->fragment_count = 2;
  header->fragment_index = 2;
  expect(!parse_entity_payload(payload.data(), payload.size(), view), "out-of-range fragment index rejected");
}

static void test_parse_entity_payload_roundtrip() {
  EntityPayloadView view{};
  std::vector<uint8_t> payload;
  const uint8_t value[] = {1, 2, 3, 4, 5};
  append_entity_payload(payload, 9, ESPNOW_ENTITY_FLAG_MORE_FRAGMENTS, 2, 4, value, sizeof(value));
  expect(parse_entity_payload(payload.data(), payload.size(), view), "entity payload parse ok");
  expect(view.entity_index == 9, "entity index correct");
  expect(view.flags == ESPNOW_ENTITY_FLAG_MORE_FRAGMENTS, "flags correct");
  expect(view.fragment_index == 2, "fragment index correct");
  expect(view.fragment_count == 4, "fragment count correct");
  expect(view.value_len == sizeof(value), "value_len correct");
  expect(memcmp(view.value, value, sizeof(value)) == 0, "value data correct");
}

static void test_parse_entity_payload_single_fragment() {
  EntityPayloadView view{};
  std::vector<uint8_t> payload;
  const uint8_t value[] = {0xAA, 0xBB};
  append_entity_payload(payload, 1, 0, 0, 1, value, sizeof(value));
  expect(parse_entity_payload(payload.data(), payload.size(), view), "single fragment parse ok");
  expect(view.fragment_index == 0, "single fragment index 0");
  expect(view.fragment_count == 1, "single fragment count 1");
}

static void test_parse_entity_payload_last_fragment() {
  EntityPayloadView view{};
  std::vector<uint8_t> payload;
  const uint8_t value[] = {0xCC};
  append_entity_payload(payload, 5, 0, 3, 4, value, sizeof(value));
  expect(parse_entity_payload(payload.data(), payload.size(), view), "last fragment parse ok");
  expect(view.fragment_index == 3, "last fragment index 3");
  expect(view.fragment_count == 4, "last fragment count 4");
}

static void test_parse_schema_push_payload_too_short() {
  SchemaPushView view{};
  uint8_t short_payload[10] = {0};
  expect(!parse_schema_push_payload(short_payload, sizeof(short_payload), view), "schema too short rejected");
}

static void test_schema_push_payload_len() {
  expect(schema_push_payload_len() == sizeof(espnow_schema_push_t), "schema_push_payload_len matches struct");
}

static void test_fragment_message_tx_base() {
  espnow_frame_header_t hdr{};
  hdr.tx_counter = 100;
  EntityPayloadView view{};
  view.fragment_index = 3;
  expect(fragment_message_tx_base(hdr, view) == 97, "fragment_message_tx_base: 100-3=97");
  view.fragment_index = 0;
  expect(fragment_message_tx_base(hdr, view) == 100, "fragment_message_tx_base: 100-0=100");
}

static void test_more_dirty_flag_exists() {
  expect(ESPNOW_ENTITY_FLAG_MORE_DIRTY == 0x02, "MORE_DIRTY flag is 0x02");
}

static void test_entity_payload_with_more_dirty_flag() {
  EntityPayloadView view{};
  std::vector<uint8_t> payload;
  const uint8_t value[] = {0xAA, 0xBB};
  append_entity_payload(payload, 5, ESPNOW_ENTITY_FLAG_MORE_DIRTY, 3, 4, value, sizeof(value));
  expect(parse_entity_payload(payload.data(), payload.size(), view), "parse with MORE_DIRTY ok");
  expect(view.flags == ESPNOW_ENTITY_FLAG_MORE_DIRTY, "MORE_DIRTY flag parsed");
  expect(view.fragment_index == 3, "fragment index correct with MORE_DIRTY");
}

static void test_entity_payload_combined_flags() {
  EntityPayloadView view{};
  std::vector<uint8_t> payload;
  const uint8_t value[] = {0xCC};
  uint8_t combined_flags = ESPNOW_ENTITY_FLAG_MORE_FRAGMENTS | ESPNOW_ENTITY_FLAG_MORE_DIRTY;
  append_entity_payload(payload, 2, combined_flags, 0, 2, value, sizeof(value));
  expect(parse_entity_payload(payload.data(), payload.size(), view), "parse with combined flags ok");
  expect((view.flags & ESPNOW_ENTITY_FLAG_MORE_FRAGMENTS) != 0, "MORE_FRAGMENTS flag set");
  expect((view.flags & ESPNOW_ENTITY_FLAG_MORE_DIRTY) != 0, "MORE_DIRTY flag set");
}

int main() {
  test_packet_type_name();
  test_is_valid_packet_type();
  test_is_encrypted_packet();
  test_identity_descriptor_payload_roundtrip();
  test_parse_entity_payload_null();
  test_parse_entity_payload_too_short();
  test_parse_entity_payload_truncated();
  test_parse_entity_payload_zero_fragment_count();
  test_parse_entity_payload_out_of_range_index();
  test_parse_entity_payload_roundtrip();
  test_parse_entity_payload_single_fragment();
  test_parse_entity_payload_last_fragment();
  test_parse_schema_push_payload_too_short();
  test_schema_push_payload_len();
  test_fragment_message_tx_base();
  test_more_dirty_flag_exists();
  test_entity_payload_with_more_dirty_flag();
  test_entity_payload_combined_flags();

  return failures == 0 ? 0 : 1;
}
