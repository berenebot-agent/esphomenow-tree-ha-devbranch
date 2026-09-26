/**
 * Minimal Web Serial typings for the parts this app uses.
 *
 * TypeScript 5.9's `lib.dom.d.ts` does not include the Web Serial API and the project has no
 * `@types/w3c-web-serial` dependency (the repo's convention is a local shim — see `js-yaml.d.ts`).
 * Before this file, call sites reached the API through inline structural casts such as
 * `(navigator as Navigator & { serial?: { requestPort: () => Promise<unknown> } }).serial`,
 * which is why the port they obtained could not be typed or passed on.
 *
 * Only what is used here is declared; add to it rather than casting at the call site.
 */
declare interface SerialPortInfo {
  usbVendorId?: number;
  usbProductId?: number;
}

declare interface SerialOptions {
  baudRate: number;
  dataBits?: 7 | 8;
  stopBits?: 1 | 2;
  parity?: 'none' | 'even' | 'odd';
  bufferSize?: number;
  flowControl?: 'none' | 'hardware';
}

declare interface SerialPort extends EventTarget {
  readonly readable: ReadableStream<Uint8Array> | null;
  readonly writable: WritableStream<Uint8Array> | null;
  readonly connected: boolean;
  open(options: SerialOptions): Promise<void>;
  close(): Promise<void>;
  forget(): Promise<void>;
  getInfo(): SerialPortInfo;
  setSignals(signals: { dataTerminalReady?: boolean; requestToSend?: boolean }): Promise<void>;
  getSignals(): Promise<{ dataCarrierDetect: boolean; clearToSend: boolean; ringIndicator: boolean; dataSetReady: boolean }>;
}

declare interface SerialPortRequestOptions {
  filters?: { usbVendorId?: number; usbProductId?: number }[];
}

declare interface Serial extends EventTarget {
  getPorts(): Promise<SerialPort[]>;
  requestPort(options?: SerialPortRequestOptions): Promise<SerialPort>;
  addEventListener(
    type: 'connect' | 'disconnect',
    listener: (event: Event & { target: SerialPort }) => void,
  ): void;
}

declare interface Navigator {
  /** Absent in browsers without Web Serial (Safari, Firefox before 151). */
  readonly serial?: Serial;
}
