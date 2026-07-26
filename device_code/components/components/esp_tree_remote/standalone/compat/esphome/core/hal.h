#pragma once

#include <esp_timer.h>

#define millis() (static_cast<uint32_t>(esp_timer_get_time() / 1000))
