#pragma once

#include <stdint.h>
#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

/**
 * @file espnow_crypto.h
 *
 * Stateless ESP-NOW LR crypto layer.
 *
 * All functions are pure — they take explicit key material and produce
 * output without reading or writing any module-level state.
 * The caller is responsible for deriving and storing per-peer session keys.
 *
 * Session key derivation:
 *   session_key = HKDF-SHA256(PSK, bridge_nonce || remote_nonce)
 *
 * PSK tag (first 4 bytes):
 *   psk_tag = HMAC-SHA256(PSK, bytes[2..12] || payload)[0:4]
 * Session tag (first 8 bytes):
 *   session_tag = HMAC-SHA256(session_key, bytes[2..12] || ciphertext)[0:8]
 *
 * Per-packet encryption:
 *   AES-CTR(session_key, nonce = tx_counter_as_16_bytes_LE)
 *   ciphertext = plaintext XOR keystream
 */

/**
 * @brief Initialize the crypto layer with a Pre-Shared Key (hex string).
 *
 * This is the only function that uses module-level state.
 * It stores the PSK for use in espnow_crypto_derive_session_key().
 *
 * @param psk_hex Null-terminated hex string (64 chars = 32 bytes)
 * @return 0 on success, -1 on invalid hex
 */
int espnow_crypto_init(const char* psk_hex);

void espnow_crypto_psk_tag(const uint8_t* header_bytes,
                           const uint8_t* payload,
                           size_t payload_len,
                           uint8_t* psk_tag);

int espnow_crypto_verify_psk_tag(const uint8_t* header_bytes,
                                 const uint8_t* payload,
                                 size_t payload_len,
                                 const uint8_t* received_psk_tag);

/**
 * @brief Derive a session key from the PSK and two nonces.
 *
 * This function is stateless — it writes the derived key to out_session_key.
 *
 *   session_key = HKDF-SHA256(stored_PSK, bridge_nonce || remote_nonce)
 *
 * @param bridge_nonce  16 bytes
 * @param remote_nonce  16 bytes
 * @param out_session_key  Caller-allocated 32-byte output buffer
 */
void espnow_crypto_derive_session_key(const uint8_t* bridge_nonce,
                                      const uint8_t* remote_nonce,
                                      uint8_t* out_session_key);

/**
 * @brief Compute session_tag = HMAC-SHA256(session_key, bytes[2..12] || ciphertext),
 *        truncated to 8 bytes.
 *
 * @param session_key  32-byte session key
 * @param header       13-byte common frame header
 * @param payload      Payload bytes
 * @param payload_len  Length of payload
 * @param auth_tag     Output buffer (must be at least 8 bytes)
 */
void espnow_crypto_session_tag(const uint8_t* session_key,
                               const uint8_t* header_bytes,
                               const uint8_t* ciphertext,
                               size_t ciphertext_len,
                               uint8_t* session_tag);

/**
 * @brief Verify a received auth tag matches the computed one.
 *
 * @param session_key          32-byte session key
 * @param header               6-byte common header
 * @param payload              Received (encrypted) payload bytes
 * @param payload_len          Length of payload
 * @param received_auth_tag    The 8-byte auth tag from the received packet
 * @return 1 if valid, 0 if invalid
 */
int espnow_crypto_verify_session_tag(const uint8_t* session_key,
                                     const uint8_t* header_bytes,
                                     const uint8_t* ciphertext,
                                     size_t ciphertext_len,
                                     const uint8_t* received_session_tag);

/**
 * @brief Encrypt or decrypt a packet payload in-place using AES-CTR.
 *
 * @param session_key  32-byte session key
 * @param tx_counter   Packet send counter (from header)
 * @param payload_in   Input payload bytes (ciphertext or plaintext)
 * @param payload_out  Output buffer (may equal payload_in for in-place)
 * @param payload_len  Length of payload
 * @return 0 on success, -1 if session_key is null or PSK was not initialized
 */
int espnow_crypto_crypt(const uint8_t* session_key,
                         uint32_t tx_counter,
                         const uint8_t* payload_in,
                         uint8_t* payload_out,
                         size_t payload_len);

/**
 * @brief Compute raw HMAC-SHA256
 * @param key HMAC key bytes
 * @param key_len Length of key (typically 32)
 * @param data Data to authenticate
 * @param data_len Length of data
 * @param out Output buffer (must be at least 32 bytes)
 */
void espnow_crypto_hmac_sha256(const uint8_t* key, size_t key_len,
                               const uint8_t* data, size_t data_len,
                               uint8_t* out);

/**
 * @brief Fill buffer with cryptographically random bytes.
 */
void fill_random_bytes(uint8_t* data, size_t len);

#ifdef __cplusplus
}
#endif
