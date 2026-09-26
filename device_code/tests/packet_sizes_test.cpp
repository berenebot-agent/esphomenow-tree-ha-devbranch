#include "../components/esp_tree_common/espnow_types.h"
#include <cstddef>
#include <iostream>

using namespace esphome::esp_tree;

static int failures = 0;

static void expect(bool cond, const char* msg) {
  if (!cond) {
    std::cerr << "FAIL: " << msg << '\n';
    failures++;
  }
}

int main() {
  expect(sizeof(espnow_join_t) == 51, "join payload size");
  expect(sizeof(espnow_ack_t) == 6, "ack payload size");
  expect(sizeof(espnow_schema_request_t) == 2, "schema_request payload size");
  expect(sizeof(espnow_identity_descriptor_t) == 203, "identity descriptor payload size");
  expect(sizeof(espnow_identity_push_t) == 205, "identity push payload size");
  expect(sizeof(espnow_file_announce_t) == 36, "file announce payload size");
  expect(sizeof(espnow_file_end_t) == 1, "file end payload size");
  expect(sizeof(espnow_file_abort_t) == 2, "file abort payload size");
  expect(sizeof(espnow_file_data_header_t) == 4, "file data header size");
  expect(ESPNOW_FILE_DEFAULT_CHUNK_SIZE == 221, "default file chunk size");

  return failures == 0 ? 0 : 1;
}
