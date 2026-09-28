import { Platform } from 'react-native';
import packageJson from '../package.json';

export const APP_VERSION: string = packageJson.version;

/**
 * Set this to reach a backend that isn't on the dev machine's loopback — e.g. a physical
 * device on the same Wi-Fi needs the machine's LAN IP (`http://192.168.1.23:4000`).
 * Leave it empty to use the per-platform default below.
 */
const API_ORIGIN_OVERRIDE = 'http://192.168.1.33:4000';

// The Android emulator's `localhost` is the emulator itself; 10.0.2.2 is its alias for the host.
const DEV_ORIGIN = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

export const API_ORIGIN = API_ORIGIN_OVERRIDE || DEV_ORIGIN;
export const API_BASE_URL = `${API_ORIGIN}/api`;
export const API_TIMEOUT_MS = 15000;

/** Turns a backend-relative upload path (`/uploads/x.jpg`) into an absolute URL; leaves absolute URLs alone. */
export function absoluteUrl(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${API_ORIGIN}${path}`;
}
