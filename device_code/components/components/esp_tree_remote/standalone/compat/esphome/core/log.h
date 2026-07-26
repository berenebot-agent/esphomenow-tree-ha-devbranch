#pragma once

#include <cstdarg>
#include <esp_log.h>

#define ESPHOME_LOG_LEVEL ESP_LOG_INFO
#define ESPHOME_LOG_FORMAT(format) format

namespace esphome {

inline void esp_log_printf_(int level, const char* tag, int line, const char* format, ...) {
  (void)line;
  char buf[256];
  va_list args;
  va_start(args, format);
  vsnprintf(buf, sizeof(buf), format, args);
  va_end(args);
  esp_log_write(static_cast<esp_log_level_t>(level), tag, "%s\n", buf);
}

}  // namespace esphome

#define esph_log_i(tag, format, ...) \
  ::esphome::esp_log_printf_(ESPHOME_LOG_LEVEL_INFO, tag, 0, format, ##__VA_ARGS__)
#define esph_log_w(tag, format, ...) \
  ::esphome::esp_log_printf_(ESPHOME_LOG_LEVEL_WARN, tag, 0, format, ##__VA_ARGS__)
#define esph_log_e(tag, format, ...) \
  ::esphome::esp_log_printf_(ESPHOME_LOG_LEVEL_ERROR, tag, 0, format, ##__VA_ARGS__)
#define esph_log_d(tag, format, ...) \
  ::esphome::esp_log_printf_(ESPHOME_LOG_LEVEL_DEBUG, tag, 0, format, ##__VA_ARGS__)
#define esph_log_config(tag, format, ...) \
  ::esphome::esp_log_printf_(ESPHOME_LOG_LEVEL_INFO, tag, 0, format, ##__VA_ARGS__)
#define esph_log_v(tag, format, ...) \
  ::esphome::esp_log_printf_(ESPHOME_LOG_LEVEL_VERBOSE, tag, 0, format, ##__VA_ARGS__)
#define esph_log_vv(tag, format, ...) \
  ::esphome::esp_log_printf_(ESPHOME_LOG_LEVEL_VERBOSE, tag, 0, format, ##__VA_ARGS__)

#define ESP_LOGE(tag, ...) esph_log_e(tag, ##__VA_ARGS__)
#define ESP_LOGW(tag, ...) esph_log_w(tag, ##__VA_ARGS__)
#define ESP_LOGI(tag, ...) esph_log_i(tag, ##__VA_ARGS__)
#define ESP_LOGD(tag, ...) esph_log_d(tag, ##__VA_ARGS__)
#define ESP_LOGCONFIG(tag, ...) esph_log_config(tag, ##__VA_ARGS__)
#define ESP_LOGV(tag, ...) esph_log_v(tag, ##__VA_ARGS__)
