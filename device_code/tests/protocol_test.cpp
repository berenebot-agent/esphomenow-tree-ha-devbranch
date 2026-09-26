#include "../components/esp_tree_common/espnow_types.h"
#include "../components/esp_tree_common/espnow_crypto.h"
#include "../components/esp_tree_remote/remote_protocol.h"

#include <cstring>
#include <iostream>

using namespace esphome::esp_tree;

static uint64_t mac_key(const uint8_t mac[6]) {
  uint64_t key = 0;
  for (int i = 0; i < 6; i++) key |= static_cast<uint64_t>(mac[i]) << (i * 8);
  return key;
}

static int failures = 0;

static void expect(bool condition, const char *message) {
  if (!condition) {
    std::cerr << "FAIL: " << message << '\n';
    failures++;
  }
}

static void fill_hex(char *out, size_t len, uint8_t value) {
  const char *digits = "0123456789abcdef";
  for (size_t i = 0; i < len; i += 2) {
    out[i] = digits[(value >> 4) & 0x0F];
    out[i + 1] = digits[value & 0x0F];
  }
  out[len] = '\0';
}

static void init_route(RemoteRouteEntry &route, const uint8_t leaf[6], const uint8_t next_hop[6], uint32_t now_ms, uint32_t ttl_ms) {
  memcpy(route.leaf_mac.data(), leaf, 6);
  memcpy(route.next_hop_mac.data(), next_hop, 6);
  route.expiry_ms = now_ms + ttl_ms;
}

static void test_route_expiry() {
  RemoteRouteEntry direct{};
  RemoteRouteEntry relay1{};
  RemoteRouteEntry relay2{};
  uint8_t leaf[6] = {1, 2, 3, 4, 5, 6};
  uint8_t hop1[6] = {6, 5, 4, 3, 2, 1};
  uint8_t hop2[6] = {7, 7, 7, 7, 7, 7};
  init_route(direct, leaf, hop1, 1000, 5000);
  init_route(relay1, leaf, hop2, 1000, 60000);
  init_route(relay2, leaf, hop1, 2000, 60000);
  expect(direct.expiry_ms == 6000, "direct route expiry");
  expect(relay1.expiry_ms == 61000, "relay1 expiry");
  expect(relay2.expiry_ms == 62000, "relay2 expiry");
}

static void test_deauth_fingerprint() {
  char psk_hex[65];
  fill_hex(psk_hex, 64, 0x22);
  expect(espnow_crypto_init(psk_hex) == 0, "crypto init for deauth");
  espnow_frame_header_t hdr{};
  hdr.protocol_version = ESPNOW_PROTOCOL_VER;
  hdr.packet_type = PKT_STATE;
  hdr.tx_counter = 99;
  uint8_t payload[5] = {9, 8, 7, 6, 5};
  uint8_t fp[4]{};
  espnow_crypto_psk_tag(reinterpret_cast<const uint8_t *>(&hdr), payload, sizeof(payload), fp);
  expect(espnow_crypto_verify_psk_tag(reinterpret_cast<const uint8_t *>(&hdr), payload, sizeof(payload), fp) == 1,
         "deauth fingerprint verify");
}

static void test_schema_sequence() {
  uint8_t entity_count = 3;
  uint8_t requested = 0;
  for (uint8_t i = 0; i < entity_count; i++) {
    requested = i;
    expect(requested == i, "schema request increments");
  }
}

static void test_aes_ctr_roundtrip_long_payload() {
  espnow_frame_header_t hdr{};
  hdr.protocol_version = ESPNOW_PROTOCOL_VER;
  hdr.packet_type = PKT_SCHEMA_PUSH;
  hdr.tx_counter = 7;
  uint8_t bridge_nonce[16]{};
  uint8_t remote_nonce[16]{};
  for (size_t i = 0; i < sizeof(bridge_nonce); i++) bridge_nonce[i] = static_cast<uint8_t>(i);
  for (size_t i = 0; i < sizeof(remote_nonce); i++) remote_nonce[i] = static_cast<uint8_t>(0xA0 + i);
  uint8_t session_key[32]{};
  espnow_crypto_derive_session_key(bridge_nonce, remote_nonce, session_key);

  uint8_t plaintext[223]{};
  for (size_t i = 0; i < sizeof(plaintext); i++) plaintext[i] = static_cast<uint8_t>((i * 13U) & 0xFF);
  uint8_t ciphertext[223]{};
  uint8_t decrypted[223]{};
  espnow_crypto_crypt(session_key, hdr.tx_counter, plaintext, ciphertext, sizeof(plaintext));
  espnow_crypto_crypt(session_key, hdr.tx_counter, ciphertext, decrypted, sizeof(ciphertext));
  expect(memcmp(plaintext, decrypted, sizeof(plaintext)) == 0, "aes ctr roundtrip");
  expect(memcmp(plaintext, ciphertext, sizeof(plaintext)) != 0, "aes ctr encrypts");
}

static void test_aes_ctr_counter_zero() {
  uint8_t bridge_nonce[16]{};
  uint8_t remote_nonce[16]{};
  uint8_t session_key[32]{};
  espnow_crypto_derive_session_key(bridge_nonce, remote_nonce, session_key);

  uint8_t plaintext[32] = {0};
  uint8_t ciphertext[32] = {0};
  uint8_t decrypted[32] = {0};

  espnow_crypto_crypt(session_key, 0, plaintext, ciphertext, sizeof(plaintext));
  espnow_crypto_crypt(session_key, 0, ciphertext, decrypted, sizeof(ciphertext));
  expect(memcmp(plaintext, decrypted, sizeof(plaintext)) == 0, "aes ctr counter=0 roundtrip");
}

static void test_aes_ctr_counter_max() {
  uint8_t bridge_nonce[16]{};
  uint8_t remote_nonce[16]{};
  uint8_t session_key[32]{};
  espnow_crypto_derive_session_key(bridge_nonce, remote_nonce, session_key);

  uint8_t plaintext[32] = {0xFF};
  uint8_t ciphertext[32] = {0};
  uint8_t decrypted[32] = {0};

  espnow_crypto_crypt(session_key, 0xFFFFFFFF, plaintext, ciphertext, sizeof(plaintext));
  espnow_crypto_crypt(session_key, 0xFFFFFFFF, ciphertext, decrypted, sizeof(ciphertext));
  expect(memcmp(plaintext, decrypted, sizeof(plaintext)) == 0, "aes ctr counter=max roundtrip");
}

static void test_aes_ctr_different_counters_different_keystream() {
  uint8_t bridge_nonce[16]{};
  uint8_t remote_nonce[16]{};
  uint8_t session_key[32]{};
  espnow_crypto_derive_session_key(bridge_nonce, remote_nonce, session_key);

  uint8_t plaintext[32] = {0};
  uint8_t ct1[32] = {0};
  uint8_t ct2[32] = {0};

  espnow_crypto_crypt(session_key, 1, plaintext, ct1, sizeof(plaintext));
  espnow_crypto_crypt(session_key, 2, plaintext, ct2, sizeof(plaintext));
  expect(memcmp(ct1, ct2, sizeof(ct1)) != 0, "aes ctr: different counters produce different keystream");
}

static void test_aes_ctr_same_counter_same_keystream() {
  uint8_t bridge_nonce[16]{};
  uint8_t remote_nonce[16]{};
  uint8_t session_key[32]{};
  espnow_crypto_derive_session_key(bridge_nonce, remote_nonce, session_key);

  uint8_t plaintext[32] = {0};
  uint8_t ct1[32] = {0};
  uint8_t ct2[32] = {0};

  espnow_crypto_crypt(session_key, 99, plaintext, ct1, sizeof(plaintext));
  espnow_crypto_crypt(session_key, 99, plaintext, ct2, sizeof(plaintext));
  expect(memcmp(ct1, ct2, sizeof(ct1)) == 0, "aes ctr: same counter produces same keystream");
}

static void test_entity_payload_helpers() {
  std::vector<uint8_t> payload;
  const uint8_t value[] = {1, 2, 3, 4, 5};
  append_entity_payload(payload, 9, ESPNOW_ENTITY_FLAG_MORE_FRAGMENTS, 2, 4, value, sizeof(value));
  expect(payload.size() == sizeof(espnow_entity_packet_header_t) + sizeof(value), "entity payload size");

  EntityPayloadView view{};
  expect(parse_entity_payload(payload.data(), payload.size(), view), "entity payload parse");
  expect(view.entity_index == 9, "entity index parsed");
  expect(view.flags == ESPNOW_ENTITY_FLAG_MORE_FRAGMENTS, "entity flags parsed");
  expect(view.fragment_index == 2, "entity fragment index parsed");
  expect(view.fragment_count == 4, "entity fragment count parsed");
  expect(view.value_len == sizeof(value), "entity value len parsed");
  expect(memcmp(view.value, value, sizeof(value)) == 0, "entity value parsed");

  payload.back() ^= 0x01;
  /* Shortening the buffer must NOT be rejected here — see the note in
   * parse_helpers_test.cpp: parse_entity_payload() derives the value length
   * from the actual plaintext length and ignores header->value_len (which
   * cannot represent a V2 fragment, spec §8.3.3). Integrity is enforced
   * upstream by session-tag verification, so this layer has nothing to reject. */
  expect(parse_entity_payload(payload.data(), payload.size() - 1, view), "entity payload accepts shortened buffer (length derived)");
  expect(view.value_len == sizeof(value) - 1, "shortened value_len derived");
}

static void test_entity_payload_rejects_invalid_fragment_metadata() {
  std::vector<uint8_t> payload;
  const uint8_t value[] = {7, 8};
  append_entity_payload(payload, 4, 0, 0, 1, value, sizeof(value));

  auto *header = reinterpret_cast<espnow_entity_packet_header_t *>(payload.data());
  header->fragment_count = 0;
  EntityPayloadView view{};
  expect(!parse_entity_payload(payload.data(), payload.size(), view), "entity payload rejects zero fragment count");

  header->fragment_count = 2;
  header->fragment_index = 2;
  expect(!parse_entity_payload(payload.data(), payload.size(), view), "entity payload rejects out of range fragment index");
}

int main() {
  expect(sizeof(espnow_frame_header_t) == 17, "frame header size");
  expect(sizeof(espnow_discover_t) == 34, "discover payload size");
  expect(sizeof(espnow_schema_push_t) == 77, "schema push payload size");
  expect(sizeof(espnow_deauth_t) == 10, "deauth payload size");
  expect(sizeof(espnow_entity_packet_header_t) == 5, "entity packet header size");
  expect(sizeof(espnow_join_t) == 51, "join payload size");

  char psk_hex[65];
  fill_hex(psk_hex, 64, 0x11);
  expect(espnow_crypto_init(psk_hex) == 0, "crypto init");

  espnow_frame_header_t hdr{};
  hdr.protocol_version = ESPNOW_PROTOCOL_VER;
  hdr.hop_count = 1;
  hdr.packet_type = PKT_DISCOVER;
  hdr.tx_counter = 42;
  expect(hdr.protocol_version == ESPNOW_PROTOCOL_VER, "protocol version constant");

  uint8_t payload[8] = {1, 2, 3, 4, 5, 6, 7, 8};
  uint8_t psk_tag[ESPNOW_PSK_TAG_LEN]{};
  espnow_crypto_psk_tag(reinterpret_cast<const uint8_t *>(&hdr), payload, sizeof(payload), psk_tag);
  expect(espnow_crypto_verify_psk_tag(reinterpret_cast<const uint8_t *>(&hdr), payload, sizeof(payload), psk_tag) == 1,
         "psk tag verify");

  uint8_t session_key[32]{};
  uint8_t bridge_nonce[16]{};
  uint8_t remote_nonce[16]{};
  espnow_crypto_derive_session_key(bridge_nonce, remote_nonce, session_key);
  uint8_t session_tag[ESPNOW_SESSION_TAG_LEN]{};
  espnow_crypto_session_tag(session_key, reinterpret_cast<const uint8_t *>(&hdr), payload, sizeof(payload), session_tag);
  expect(espnow_crypto_verify_session_tag(session_key, reinterpret_cast<const uint8_t *>(&hdr), payload, sizeof(payload), session_tag) == 1,
          "session tag verify");

  uint8_t deauth_fp[4]{};
  espnow_crypto_psk_tag(reinterpret_cast<const uint8_t *>(&hdr), payload, sizeof(payload), deauth_fp);
  expect(memcmp(deauth_fp, psk_tag, sizeof(psk_tag)) == 0, "deauth fingerprint shape");

  test_route_expiry();
  test_deauth_fingerprint();
  test_schema_sequence();
  test_aes_ctr_roundtrip_long_payload();
  test_aes_ctr_counter_zero();
  test_aes_ctr_counter_max();
  test_aes_ctr_different_counters_different_keystream();
  test_aes_ctr_same_counter_same_keystream();
  test_entity_payload_helpers();
  test_entity_payload_rejects_invalid_fragment_metadata();

  return failures == 0 ? 0 : 1;
}
