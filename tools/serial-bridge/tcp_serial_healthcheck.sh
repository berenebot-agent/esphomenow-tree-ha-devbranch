#!/bin/sh
# Healthcheck for the raw-TCP serial bridge.
#
# Do NOT probe with a TCP connect: this bridge serves ONE client at a time, and an
# accepted connection evicts the incumbent ("dropped previous client"). A healthcheck
# that connects therefore disconnects the real add-on every interval, which looks
# exactly like the flapping it is supposed to detect.
#
# Check the process and that the listen socket exists instead, and read it from
# /proc so no netstat/ss binary is required in the image.
set -e

# 1. the bridge process is alive
# Note: pgrep is NOT available in the ESPHome image, so read /proc instead -- a
# healthcheck that exits 127 for a missing binary reports a false failure.
found_proc=0
for p in /proc/[0-9]*; do
  if [ -r "$p/cmdline" ] && tr '\0' ' ' < "$p/cmdline" 2>/dev/null | grep -q tcp_serial_bridge.py; then
    found_proc=1
    break
  fi
done
[ "$found_proc" = "1" ]

# 2. a listening socket exists on the expected port, from /proc/net/tcp
#    7000 == 0x1B58; state 0A == LISTEN
awk 'NR>1 { split($2, a, ":"); if (a[2] == "1B58" && $4 == "0A") { found=1 } }
     END { exit(found ? 0 : 1) }' /proc/net/tcp

exit 0
