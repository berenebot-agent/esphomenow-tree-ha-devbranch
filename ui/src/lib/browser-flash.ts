/**
 * Browser-side flashing: chip detection and the ESP Web Tools install dialog.
 *
 * Two things this module exists to fix, both verified against esp-web-tools@10.4.0:
 *
 * 1. **The second USB chooser.** esp-web-tools' `connect()` (what `<esp-web-install-button>`
 *    runs on click) always calls `navigator.serial.requestPort()` itself, so a page could
 *    never hand it a port it had already been granted. Every wizard here detects the chip
 *    first — and that detection click is where the browser's picker appears — so the user
 *    saw the USB picker twice per flash. `openInstallDialog({ port })` passes the held port
 *    straight in, and the dialog is created directly instead of through `connect()`.
 *
 * 2. **The chip-probe coupling.** `InstallButton.isSupported` is `"serial" in navigator`
 *    and `InstallButton.isAllowed` is `window.isSecureContext`, both read at module load.
 *    `usbFlashSupported()` asks the same two questions without loading the element.
 *
 * Ordering note: `requestPort()` throws `SecurityError` without transient activation, so it
 * is called *before* any awaited dynamic import. Awaiting the import first consumes the
 * click's activation and the chooser never appears.
 */

/** The chip families esptool-js reports, mapped to the names the add-on's API uses. */
export type ChipFamily =
  | 'ESP32'
  | 'ESP32-S2'
  | 'ESP32-S3'
  | 'ESP32-C2'
  | 'ESP32-C3'
  | 'ESP32-C5'
  | 'ESP32-C6'
  | 'ESP32-C61'
  | 'ESP32-H2'
  | 'ESP32-P4'
  | 'ESP8266';

/** Longest first: "ESP32-C61" must be tested before "ESP32-C6" before "ESP32". */
const CHIP_FAMILIES: ChipFamily[] = [
  'ESP32-C61',
  'ESP32-C6',
  'ESP32-C5',
  'ESP32-C3',
  'ESP32-C2',
  'ESP32-H2',
  'ESP32-P4',
  'ESP32-S3',
  'ESP32-S2',
  'ESP8266',
  'ESP32',
];

/** The baud rate esp-web-tools opens with, so a held port is in the state it expects. */
const SERIAL_OPEN_OPTIONS: SerialOptions = { baudRate: 115200, bufferSize: 8192 };

export type OpenInstallDialogResult = 'opened' | 'cancelled';

/**
 * The DOM's Web Serial port type, under a name that cannot collide.
 *
 * Several pages already import an unrelated `SerialPort` (the add-on's serial-port listing
 * shape) from `../api/client`, which shadows the global. Import this alias instead of
 * annotating with `SerialPort` in those files.
 */
export type UsbSerialPort = SerialPort;

/** Chrome/Edge (and Firefox 151+) on a secure context — the minimum for Web Serial. */
export function usbFlashSupported(): boolean {
  return typeof window !== 'undefined' && window.isSecureContext && 'serial' in navigator;
}

/**
 * Map an esptool/detection string onto a chip family.
 *
 * Accepts the loose forms esptool produces ("ESP32-C5", "ESP32C5", "ESP32-C5 (QFN32)"),
 * because the exact wording differs between esptool versions and reset modes.
 */
export function chipFamilyFromName(chipName: string | null | undefined): ChipFamily | null {
  if (!chipName) return null;
  const normalized = chipName.trim().toUpperCase().replace(/\s+/g, '');
  for (const family of CHIP_FAMILIES) {
    if (normalized.includes(family) || normalized.includes(family.replace(/-/g, ''))) return family;
  }
  return null;
}

/**
 * Ports this page has already been granted, most recent last.
 *
 * `getPorts()` needs no user activation, so a port granted in an earlier step (or an
 * earlier page load) can be reused with no browser prompt at all.
 */
export async function grantedPorts(): Promise<SerialPort[]> {
  if (!usbFlashSupported() || !navigator.serial) return [];
  try {
    return await navigator.serial.getPorts();
  } catch {
    return [];
  }
}

/**
 * Return a port to flash with, preferring one already granted.
 *
 * `requestPort()` fallback needs a real user gesture — call this from a click handler.
 */
export async function acquirePort(): Promise<SerialPort | 'cancelled'> {
  const granted = await grantedPorts();
  // Prefer a port that still reports a USB identity. Chrome keeps previously-granted
  // ports in `getPorts()` long after the device is gone: those entries return an empty
  // `getInfo()` and fail every `open()` with "Failed to open serial port". Taking the
  // last entry blindly lands on one of those dead handles and the whole flash flow
  // stalls before it starts, so keep the dead ones as a fallback only.
  const live = granted.filter((port) => {
    try {
      return Boolean(port.getInfo().usbVendorId);
    } catch {
      return false;
    }
  });
  if (live.length > 0) return live[live.length - 1];
  if (granted.length > 0) return granted[granted.length - 1];

  if (!navigator.serial) throw new Error('Web Serial is not available in this browser.');
  try {
    return await navigator.serial.requestPort();
  } catch (err) {
    // NotFoundError is the documented "picker dismissed" rejection, not a fault.
    if (err instanceof DOMException && err.name === 'NotFoundError') return 'cancelled';
    throw err;
  }
}

export interface ChipDetectionResult {
  /** The raw string esptool reported, for display. */
  detected: string;
  family: ChipFamily | null;
}

/**
 * Connect to a chip and read its identity, leaving the port granted but closed.
 *
 * The port is deliberately released afterwards: a multi-minute compile with the port held
 * keeps the chip parked in the bootloader and is exposed to the device re-enumerating
 * mid-build. Reopening a granted port needs no gesture, so nothing is lost.
 */
export async function detectChip(port: SerialPort): Promise<ChipDetectionResult> {
  // esptool-js is ~200 KB; only detection and flashing need it.
  const { Transport, ESPLoader } = await import('esptool-js');
  const transport = new Transport(port, true);
  try {
    const loader = new ESPLoader({
      transport,
      baudrate: 115200,
      terminal: { clean: () => {}, writeLine: () => {}, write: () => {} },
      debugLogging: false,
    });
    const detected = String(await loader.main());
    return { detected, family: chipFamilyFromName(detected) };
  } finally {
    try {
      await transport.disconnect();
    } catch {
      // Detection is finished either way; releasing the port is best-effort.
    }
  }
}

/**
 * Open the install dialog.
 *
 * `port` — a port the page already holds (from detection). When omitted, the browser's
 * picker is shown instead, which requires this to be called from a real user gesture.
 *
 * Resolves `'cancelled'` when the user dismisses the picker; the dialog reports its own
 * progress and errors, and its `closed` event is surfaced via `onClosed`.
 */
export async function openInstallDialog(options: {
  manifestUrl: string;
  port?: SerialPort | null;
  onClosed?: () => void;
  onFinished?: () => void;
}): Promise<OpenInstallDialogResult> {
  if (!usbFlashSupported()) {
    throw new Error('Browser USB flashing needs Chrome or Edge on a secure HTTPS page.');
  }

  let port = options.port ?? null;
  if (!port) {
    const acquired = await acquirePort();
    if (acquired === 'cancelled') return 'cancelled';
    port = acquired;
  }

  // Loaded on demand: the dialog drags in lit, Material Web and esptool-js (~360 KB), none
  // of which the rest of the page needs.
  await import('esp-web-tools/dist/install-dialog.js');

  if (port.readable === null) {
    // A port held from an earlier detection step is closed but still granted; the dialog
    // expects to be handed an open one, exactly as esp-web-tools' own `connect()` does.
    await port.open(SERIAL_OPEN_OPTIONS);
  }

  const el = document.createElement('ewt-install-dialog') as HTMLElement & {
    port: SerialPort;
    manifestPath: string;
  };
  el.port = port;
  el.manifestPath = options.manifestUrl;

  /**
   * Report a completed write.
   *
   * esp-web-tools@10's dialog never dispatches the `state-changed` event its own README and
   * older versions advertise (the only `state-changed` listener in the source is for the
   * Improv client), so watching for a `FINISHED` event silently never fires. It does mirror
   * its internal state machine onto a `state` attribute, which is what we watch instead:
   * the write runs with `state="INSTALL"`, and the "Next" button after it moves to
   * `DASHBOARD` (or `PROVISION` when Improv is available). So "INSTALL has been seen, and
   * the state has moved on from it" means the firmware was written — whereas closing the
   * dialog straight from the initial dashboard state does not.
   */
  let sawInstall = false;
  let reported = false;
  let observer: MutationObserver | null = null;
  const stopWatching = (): void => {
    observer?.disconnect();
    observer = null;
  };
  const watch = (): void => {
    if (!options.onFinished) return;
    observer = new MutationObserver(() => {
      const state = el.getAttribute('state');
      if (state === 'INSTALL') {
        sawInstall = true;
        return;
      }
      if (sawInstall && !reported && (state === 'DASHBOARD' || state === 'PROVISION')) {
        reported = true;
        options.onFinished?.();
      }
    });
    observer.observe(el, { attributes: true, attributeFilter: ['state'] });
  };
  watch();

  el.addEventListener(
    'closed',
    () => {
      stopWatching();
      // The dialog never closes the port itself; `connect()` does this via the same event.
      void port.close().catch(() => {});
      options.onClosed?.();
    },
    { once: true },
  );
  document.body.appendChild(el);
  return 'opened';
}
