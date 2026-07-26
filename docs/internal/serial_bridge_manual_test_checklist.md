# Serial Bridge Manual Test Checklist

## Bridge (C++)

- [ ] WiFi mode bridge still compiles and works (regression)
- [ ] Serial mode bridge compiles with `USE_SERIAL`
- [ ] Serial mode bridge boots without WiFi
- [ ] `espnow_allowed_` set immediately in serial mode (check logs)
- [ ] `serial_transport:` YAML validates correctly
- [ ] YAML rejects both `wifi:` and `serial_transport:`
- [ ] YAML rejects neither `wifi:` nor `serial_transport:`
- [ ] YAML with `serial_transport:` does not require `wifi:`

## Addon (Python)

- [ ] Addon can connect to bridge via serial
- [ ] Auth succeeds, topology syncs
- [ ] Commands round-trip correctly
- [ ] Reconnect works after cable unplug/replug
- [ ] Port rename hotplug (`/dev/ttyUSB0` → `/dev/ttyUSB1`)
- [ ] 60s connection timeout works

## UI

- [ ] Port scan returns available ports
- [ ] Serial tab shows after clicking "Serial" tab button
- [ ] User can select port, connect, and bridge appears connected
- [ ] Existing WiFi tabs (Discover, Manual, Flash) unchanged

## Mixed

- [ ] OTA attempt on Serial bridge → `COMMAND_STATUS_UNSUPPORTED`
- [ ] Mixed WiFi + Serial bridges work in manager simultaneously