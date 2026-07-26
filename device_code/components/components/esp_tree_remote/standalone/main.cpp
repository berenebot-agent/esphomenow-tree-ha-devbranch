#include "standalone_remote.h"

#include <driver/gpio.h>
#include <esp_log.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>

using namespace esphome::esp_tree;

StandaloneRemote remote;

static const char* TAG = "app_main";

static uint8_t motion_idx;
static uint8_t temp_idx;
static uint8_t relay_idx;

void on_command(uint8_t entity_index, uint8_t flags, const uint8_t* value, size_t value_len) {
  (void)flags;
  if (entity_index == relay_idx) {
    bool on = helpers::parse_switch(value, value_len);
    gpio_set_level(GPIO_NUM_5, on ? 1 : 0);
    remote.update_entity(relay_idx, on);
  }
}

extern "C" void app_main(void) {
  gpio_set_direction(GPIO_NUM_4, GPIO_MODE_INPUT);
  gpio_set_direction(GPIO_NUM_5, GPIO_MODE_OUTPUT);
  gpio_set_level(GPIO_NUM_5, 0);

  const char* psk = "0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20";

  remote.set_command_callback(on_command);

  int ret = remote.init(psk, "test-net", "node-standalone", "Standalone Example", 10);
  if (ret != 0) {
    ESP_LOGE(TAG, "remote init failed: %d", ret);
    return;
  }

  motion_idx = remote.add_binary_sensor("Motion", "motion");
  temp_idx   = remote.add_sensor("Temperature", "°C", "temperature");
  relay_idx  = remote.add_switch("Relay", "relay");

  ESP_LOGI(TAG, "standalone remote ready");
  ESP_LOGI(TAG, "  motion_idx=%u temp_idx=%u relay_idx=%u", motion_idx, temp_idx, relay_idx);

  int loop_count = 0;
  float temperature = 20.0f;

  while (true) {
    remote.loop();

    int pir = gpio_get_level(GPIO_NUM_4);
    remote.update_entity(motion_idx, pir == 1);

    if (loop_count % 100 == 0) {
      temperature += 0.1f;
      if (temperature > 30.0f) temperature = 15.0f;
      remote.update_entity(temp_idx, temperature);
    }

    vTaskDelay(pdMS_TO_TICKS(10));
    loop_count++;
  }
}