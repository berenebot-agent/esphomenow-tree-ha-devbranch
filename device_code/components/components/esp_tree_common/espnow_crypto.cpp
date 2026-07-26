#include "espnow_crypto.h"
#include "espnow_types.h"
#include <string.h>
#include <vector>

#if defined(ESP_PLATFORM)
  #include <esp_random.h>
  #include "mbedtls/md.h"
#elif defined(ARDUINO_ARCH_ESP8266)
  #include <bearssl/bearssl_hmac.h>
  #include <user_interface.h>
#else
  #include <openssl/evp.h>
  #include <openssl/hmac.h>
#endif

// ─── Internal helpers ────────────────────────────────────────────────────────

static void hmac_sha256(const uint8_t* key, size_t key_len,
                        const uint8_t* data, size_t data_len,
                        uint8_t* out /*[32]*/);

static void hkdf_expand(const uint8_t* prk, size_t prk_len,
                        const uint8_t* info, size_t info_len,
                        uint8_t* out, size_t out_len);

static void hkdf_extract(const uint8_t* salt, size_t salt_len,
                         const uint8_t* ikm, size_t ikm_len,
                         uint8_t* prk /*[32]*/);

static int hex_to_bytes(const char* hex, uint8_t* out, size_t* out_len);

static int constant_time_equal(const uint8_t* a, const uint8_t* b, size_t len) {
    uint8_t diff = 0;
    for (size_t i = 0; i < len; i++) diff |= a[i] ^ b[i];
    return diff == 0;
}

static const uint8_t kHkdfSalt[32] = {0};
static const uint8_t kAesSBox[256] = {
    0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
    0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
    0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
    0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
    0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
    0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
    0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
    0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
    0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
    0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
    0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
    0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
    0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
    0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
    0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
    0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16
};
static const uint8_t kAesRcon[15] = {0x00,0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1B,0x36,0x6C,0xD8,0xAB,0x4D};

static uint8_t xtime(uint8_t x) {
    return (uint8_t)((x << 1) ^ (((x >> 7) & 1U) * 0x1B));
}

static void sub_word(uint8_t *word) {
    word[0] = kAesSBox[word[0]];
    word[1] = kAesSBox[word[1]];
    word[2] = kAesSBox[word[2]];
    word[3] = kAesSBox[word[3]];
}

static void rot_word(uint8_t *word) {
    uint8_t t = word[0];
    word[0] = word[1];
    word[1] = word[2];
    word[2] = word[3];
    word[3] = t;
}

static void aes256_key_expand(const uint8_t *key, uint8_t round_keys[240]) {
    memcpy(round_keys, key, 32);
    uint32_t bytes_generated = 32;
    uint8_t rcon_iter = 1;
    uint8_t temp[4];
    while (bytes_generated < 240) {
        memcpy(temp, round_keys + bytes_generated - 4, 4);
        if ((bytes_generated % 32) == 0) {
            rot_word(temp);
            sub_word(temp);
            temp[0] ^= kAesRcon[rcon_iter++];
        } else if ((bytes_generated % 32) == 16) {
            sub_word(temp);
        }
        for (int i = 0; i < 4; i++) {
            round_keys[bytes_generated] = round_keys[bytes_generated - 32] ^ temp[i];
            bytes_generated++;
        }
    }
}

static void add_round_key(uint8_t state[16], const uint8_t *round_key) {
    for (int i = 0; i < 16; i++) state[i] ^= round_key[i];
}

static void sub_bytes(uint8_t state[16]) {
    for (int i = 0; i < 16; i++) state[i] = kAesSBox[state[i]];
}

static void shift_rows(uint8_t state[16]) {
    uint8_t temp[16];
    memcpy(temp, state, 16);
    state[0] = temp[0];   state[4] = temp[4];   state[8] = temp[8];   state[12] = temp[12];
    state[1] = temp[5];   state[5] = temp[9];   state[9] = temp[13];  state[13] = temp[1];
    state[2] = temp[10];  state[6] = temp[14];  state[10] = temp[2];  state[14] = temp[6];
    state[3] = temp[15];  state[7] = temp[3];   state[11] = temp[7];  state[15] = temp[11];
}

static void mix_columns(uint8_t state[16]) {
    for (int i = 0; i < 4; i++) {
        uint8_t *col = state + (i * 4);
        uint8_t a0 = col[0], a1 = col[1], a2 = col[2], a3 = col[3];
        uint8_t t = a0 ^ a1 ^ a2 ^ a3;
        uint8_t u = a0;
        col[0] ^= t ^ xtime((uint8_t)(a0 ^ a1));
        col[1] ^= t ^ xtime((uint8_t)(a1 ^ a2));
        col[2] ^= t ^ xtime((uint8_t)(a2 ^ a3));
        col[3] ^= t ^ xtime((uint8_t)(a3 ^ u));
    }
}

static void aes256_encrypt_block(const uint8_t *round_keys, const uint8_t input[16], uint8_t output[16]) {
    uint8_t state[16];
    memcpy(state, input, 16);
    add_round_key(state, round_keys);
    for (int round = 1; round < 14; round++) {
        sub_bytes(state);
        shift_rows(state);
        mix_columns(state);
        add_round_key(state, round_keys + (round * 16));
    }
    sub_bytes(state);
    shift_rows(state);
    add_round_key(state, round_keys + 224);
    memcpy(output, state, 16);
}

static void increment_counter(uint8_t counter[16]) {
    for (int i = 15; i >= 0; i--) {
        counter[i]++;
        if (counter[i] != 0) break;
    }
}

static void aes256_ctr_crypt(const uint8_t* key, uint32_t tx_counter,
                             const uint8_t* input, uint8_t* output, size_t len) {
    uint8_t counter[16] = {0};
    counter[0] = (uint8_t)(tx_counter & 0xFF);
    counter[1] = (uint8_t)((tx_counter >> 8) & 0xFF);
    counter[2] = (uint8_t)((tx_counter >> 16) & 0xFF);
    counter[3] = (uint8_t)((tx_counter >> 24) & 0xFF);
    uint8_t round_keys[240];
    aes256_key_expand(key, round_keys);
    uint8_t keystream[16];
    size_t offset = 0;
    while (offset < len) {
        aes256_encrypt_block(round_keys, counter, keystream);
        const size_t block_len = (len - offset < sizeof(keystream)) ? (len - offset) : sizeof(keystream);
        for (size_t i = 0; i < block_len; i++) output[offset + i] = input[offset + i] ^ keystream[i];
        offset += block_len;
        increment_counter(counter);
    }
}

// ─── Module state: only PSK is global (one per node) ─────────────────────────

static uint8_t g_psk[32]      = {0};
static int     g_psk_set       = 0;

// ─── Public API ───────────────────────────────────────────────────────────────

int espnow_crypto_init(const char* psk_input);

static void derive_psk_from_string(const char* input, size_t input_len, uint8_t* out_key) {
    uint8_t prk[32];
    hkdf_extract(kHkdfSalt, sizeof(kHkdfSalt), (const uint8_t*)input, input_len, prk);
    static const uint8_t info[] = "esp-tree-psk";
    hkdf_expand(prk, 32, info, sizeof(info) - 1, out_key, 32);
}

int espnow_crypto_init(const char* psk_input) {
    size_t len = 0;
    size_t input_len = strlen(psk_input);

    if (input_len == 64 && hex_to_bytes(psk_input, g_psk, &len) == 0 && len == 32) {
    } else {
        if (input_len == 0) {
            memset(g_psk, 0, sizeof(g_psk));
            g_psk_set = 0;
            return -1;
        }
        derive_psk_from_string(psk_input, input_len, g_psk);
    }
    g_psk_set = 1;
    return 0;
}

void espnow_crypto_derive_session_key(const uint8_t* bridge_nonce,
                                      const uint8_t* remote_nonce,
                                      uint8_t* out_session_key) {
    if (!g_psk_set) {
        memset(out_session_key, 0, 32);
        return;
    }

    // info = bridge_nonce || remote_nonce
    uint8_t info[32];
    memcpy(info,               bridge_nonce, 16);
    memcpy(info + 16,         remote_nonce,  16);

    // prk = HKDF-Extract(zero_salt, PSK)
    uint8_t prk[32];
    hkdf_extract(kHkdfSalt, sizeof(kHkdfSalt), g_psk, 32, prk);

    // session_key = HKDF-Expand(prk, info, 32)
    hkdf_expand(prk, 32, info, sizeof(info), out_session_key, 32);
}

void espnow_crypto_psk_tag(const uint8_t* header_bytes,
                           const uint8_t* payload,
                           size_t payload_len,
                           uint8_t* psk_tag) {
    if (!g_psk_set) {
        memset(psk_tag, 0, ESPNOW_PSK_TAG_LEN);
        return;
    }

    const size_t data_len = 11 + payload_len;
    uint8_t data_buf[11 + ESPNOW_V1_MAX_PAYLOAD];
    uint8_t *data_ptr = data_buf;
    std::vector<uint8_t> data_alloc;
    if (data_len > sizeof(data_buf)) {
        data_alloc.resize(data_len);
        data_ptr = data_alloc.data();
    }
    memcpy(data_ptr, header_bytes + 2, 11);
    if (payload_len > 0 && payload != nullptr) memcpy(data_ptr + 11, payload, payload_len);
    uint8_t hmac[32];
    hmac_sha256(g_psk, 32, data_ptr, data_len, hmac);
    memcpy(psk_tag, hmac, ESPNOW_PSK_TAG_LEN);
}

int espnow_crypto_verify_psk_tag(const uint8_t* header_bytes,
                                 const uint8_t* payload,
                                 size_t payload_len,
                                 const uint8_t* received_psk_tag) {
    if (!g_psk_set) {
        return 0;
    }

    uint8_t computed[ESPNOW_PSK_TAG_LEN];
    espnow_crypto_psk_tag(header_bytes, payload, payload_len, computed);
    return constant_time_equal(computed, received_psk_tag, ESPNOW_PSK_TAG_LEN) ? 1 : 0;
}

void espnow_crypto_hmac_sha256(const uint8_t* key, size_t key_len,
                               const uint8_t* data, size_t data_len,
                               uint8_t* out) {
    hmac_sha256(key, key_len, data, data_len, out);
}

void fill_random_bytes(uint8_t* data, size_t len) {
#if defined(ESP_PLATFORM)
  esp_fill_random(data, len);
#elif defined(ARDUINO_ARCH_ESP8266)
  os_get_random(data, len);
#else
  static FILE* urandom = nullptr;
  if (!urandom) urandom = fopen("/dev/urandom", "rb");
  if (urandom) {
    fread(data, 1, len, urandom);
  } else {
    for (size_t i = 0; i < len; i++) data[i] = static_cast<uint8_t>(rand() & 0xFF);
  }
#endif
}

void espnow_crypto_session_tag(const uint8_t* session_key,
                                const uint8_t* header_bytes,
                                const uint8_t* ciphertext,
                                size_t ciphertext_len,
                                uint8_t* session_tag) {
    const size_t data_len = 11 + ciphertext_len;
    uint8_t data_buf[11 + ESPNOW_V1_MAX_PAYLOAD];
    uint8_t *data_ptr = data_buf;
    std::vector<uint8_t> data_alloc;
    if (data_len > sizeof(data_buf)) {
        data_alloc.resize(data_len);
        data_ptr = data_alloc.data();
    }
    memcpy(data_ptr, header_bytes + 2, 11);
    if (ciphertext_len > 0 && ciphertext != nullptr) memcpy(data_ptr + 11, ciphertext, ciphertext_len);
    uint8_t hmac[32];
    hmac_sha256(session_key, 32, data_ptr, data_len, hmac);
    memcpy(session_tag, hmac, ESPNOW_SESSION_TAG_LEN);
}

int espnow_crypto_verify_session_tag(const uint8_t* session_key,
                                     const uint8_t* header_bytes,
                                     const uint8_t* ciphertext,
                                     size_t ciphertext_len,
                                     const uint8_t* received_session_tag) {
    uint8_t computed[ESPNOW_SESSION_TAG_LEN];
    espnow_crypto_session_tag(session_key, header_bytes, ciphertext, ciphertext_len, computed);
    return constant_time_equal(computed, received_session_tag, ESPNOW_SESSION_TAG_LEN) ? 1 : 0;
}

int espnow_crypto_crypt(const uint8_t* session_key,
                         uint32_t tx_counter,
                         const uint8_t* payload_in,
                         uint8_t* payload_out,
                         size_t payload_len) {
    if (!g_psk_set || session_key == nullptr) {
        return -1;
    }

#if defined(ESP_PLATFORM) || defined(ARDUINO_ARCH_ESP8266)
    aes256_ctr_crypt(session_key, tx_counter, payload_in, payload_out, payload_len);
#else
    uint8_t nonce_counter[16] = {0};
    nonce_counter[0] = (uint8_t)(tx_counter & 0xFF);
    nonce_counter[1] = (uint8_t)((tx_counter >> 8) & 0xFF);
    nonce_counter[2] = (uint8_t)((tx_counter >> 16) & 0xFF);
    nonce_counter[3] = (uint8_t)((tx_counter >> 24) & 0xFF);
    EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
    if (ctx == nullptr) {
        return -1;
    }
    int out_len = 0;
    int final_len = 0;
    if (EVP_EncryptInit_ex(ctx, EVP_aes_256_ctr(), nullptr, session_key, nonce_counter) != 1 ||
        EVP_EncryptUpdate(ctx, payload_out, &out_len, payload_in, (int) payload_len) != 1 ||
        EVP_EncryptFinal_ex(ctx, payload_out + out_len, &final_len) != 1) {
        EVP_CIPHER_CTX_free(ctx);
        return -1;
    }
    EVP_CIPHER_CTX_free(ctx);
#endif
    return 0;
}

// ─── Internal implementations ─────────────────────────────────────────────────

static void hmac_sha256(const uint8_t* key, size_t key_len,
                        const uint8_t* data, size_t data_len,
                        uint8_t* out /*[32]*/) {
#if defined(ESP_PLATFORM)
    const mbedtls_md_info_t* md_info = mbedtls_md_info_from_type(MBEDTLS_MD_SHA256);
    mbedtls_md_context_t ctx;
    mbedtls_md_init(&ctx);
    mbedtls_md_setup(&ctx, md_info, 1);
    mbedtls_md_hmac_starts(&ctx, key, key_len);
    mbedtls_md_hmac_update(&ctx, data, data_len);
    mbedtls_md_hmac_finish(&ctx, out);
    mbedtls_md_free(&ctx);
#elif defined(ARDUINO_ARCH_ESP8266)
    br_hmac_key_context kc;
    br_hmac_key_init(&kc, &br_sha256_vtable, key, key_len);
    br_hmac_context hc;
    br_hmac_init(&hc, &kc, 32);
    br_hmac_update(&hc, data, data_len);
    br_hmac_out(&hc, out);
#else
    unsigned int len = 0;
    ::HMAC(EVP_sha256(), key, (int)key_len, data, data_len, out, &len);
#endif
}

static void hkdf_extract(const uint8_t* salt, size_t salt_len,
                         const uint8_t* ikm, size_t ikm_len,
                         uint8_t* prk /*[32]*/) {
    hmac_sha256(salt, salt_len, ikm, ikm_len, prk);
}

static void hkdf_expand(const uint8_t* prk, size_t prk_len,
                        const uint8_t* info, size_t info_len,
                        uint8_t* out, size_t out_len) {
    uint8_t t[32];
    uint8_t counter = 0;
    size_t offset = 0;

    while (offset < out_len) {
        counter++;
        uint8_t block[96];
        size_t block_len = 0;

        if (counter == 1) {
            memcpy(block + block_len, info, info_len);
            block_len += info_len;
        } else {
            memcpy(block + block_len, t, 32);
            block_len += 32;
            memcpy(block + block_len, info, info_len);
            block_len += info_len;
        }
        block[block_len++] = counter;

        hmac_sha256(prk, prk_len, block, block_len, t);

        size_t copy = (offset + 32 <= out_len) ? 32 : (out_len - offset);
        memcpy(out + offset, t, copy);
        offset += copy;
    }
}

static int hex_to_bytes(const char* hex, uint8_t* out, size_t* out_len) {
    size_t len = strlen(hex);
    if ((len & 1) != 0) return -1;
    *out_len = len / 2;
    for (size_t i = 0; i < *out_len; i++) {
        char hi = hex[i * 2];
        char lo = hex[i * 2 + 1];
        int hi_n, lo_n;
        hi_n = (hi >= 'a' && hi <= 'f') ? (hi - 'a' + 10) :
               (hi >= 'A' && hi <= 'F') ? (hi - 'A' + 10) :
               (hi >= '0' && hi <= '9') ? (hi - '0') : -1;
        lo_n = (lo >= 'a' && lo <= 'f') ? (lo - 'a' + 10) :
               (lo >= 'A' && lo <= 'F') ? (lo - 'A' + 10) :
               (lo >= '0' && lo <= '9') ? (lo - '0') : -1;
        if (hi_n < 0 || lo_n < 0) return -1;
        out[i] = (uint8_t)((hi_n << 4) | lo_n);
    }
    return 0;
}
