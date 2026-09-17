import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Base URL for the Verdant backend API.
 *
 * - iOS Simulator: `http://localhost:4000` works as-is — the simulator shares the host
 *   machine's network.
 * - Android Emulator: `localhost` on the emulator refers to the emulator itself, not the
 *   dev machine — use `http://10.0.2.2:4000` instead (the emulator's alias for the host).
 * - Physical device (either platform): use your development machine's LAN IP, e.g.
 *   `http://192.168.1.23:4000` (the device and machine must be on the same network).
 *
 * Swap the value below for your environment.
 */
export const API_ORIGIN = 'http://localhost:4000';
export const API_BASE_URL = `${API_ORIGIN}/api`;

export const ACCESS_TOKEN_KEY = 'verdant_access_token';
export const REFRESH_TOKEN_KEY = 'verdant_refresh_token';

export async function clearStoredTokens(): Promise<void> {
  await AsyncStorage.removeMany([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
}

/**
 * Called when the refresh flow determines the session is no longer valid (refresh token
 * missing/expired/rejected). AuthContext registers a listener here on mount so it can clear
 * its in-memory user state without this module needing to import React/context directly.
 */
type ForceLogoutListener = () => void;
let forceLogoutListener: ForceLogoutListener | null = null;
export function onForceLogout(listener: ForceLogoutListener): void {
  forceLogoutListener = listener;
}

export const api = axios.create({ baseURL: API_BASE_URL });

// Attach the stored access token (if any) to every outgoing request.
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// On a 401, try to refresh the access token once and retry the original request.
let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // The refresh call itself failing shouldn't trigger another refresh attempt.
    if (originalRequest.url?.includes('/auth/refresh')) {
      await clearStoredTokens();
      forceLogoutListener?.();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      // A refresh is already in flight — queue this request until it settles.
      return new Promise((resolve, reject) => {
        pendingQueue.push((newToken) => {
          if (!newToken) {
            reject(error);
            return;
          }
          originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;
    try {
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token stored');
      }

      const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken },
      );

      await AsyncStorage.setMany({
        [ACCESS_TOKEN_KEY]: data.accessToken,
        [REFRESH_TOKEN_KEY]: data.refreshToken,
      });

      pendingQueue.forEach((resolveQueued) => resolveQueued(data.accessToken));
      pendingQueue = [];

      originalRequest.headers.set('Authorization', `Bearer ${data.accessToken}`);
      return api(originalRequest);
    } catch (refreshError) {
      pendingQueue.forEach((resolveQueued) => resolveQueued(null));
      pendingQueue = [];

      // Only treat this as "the session is genuinely gone" when the server actually
      // rejected the refresh token (401/403). A network error, timeout, or 5xx here
      // just means we couldn't refresh right now — the stored refresh token is likely
      // still perfectly valid, so keep it and let the next attempt (or AuthContext's
      // own retry loop) try again, instead of forcing a fresh login over what might be
      // a brief connectivity blip or the backend being momentarily unreachable.
      const status = axios.isAxiosError(refreshError) ? refreshError.response?.status : undefined;
      if (status === 401 || status === 403) {
        await clearStoredTokens();
        forceLogoutListener?.();
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

/** Extracts a human-readable message from an API error, falling back to a generic message. */
export function getErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string } | undefined;
    if (data?.error) return data.error;
    if (err.message) return err.message;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

interface ValidationDetail {
  path?: string;
  param?: string;
  msg?: string;
}

/** Maps a 422 express-validator response's `details` array to `{ fieldName: message }`. */
export function getFieldErrors(err: unknown): Record<string, string> | null {
  if (!axios.isAxiosError(err) || err.response?.status !== 422) {
    return null;
  }
  const data = err.response.data as { details?: ValidationDetail[] } | undefined;
  if (!Array.isArray(data?.details)) {
    return null;
  }
  const fieldErrors: Record<string, string> = {};
  for (const detail of data.details) {
    const key = detail.path ?? detail.param;
    if (key && detail.msg) {
      fieldErrors[key] = detail.msg;
    }
  }
  return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
}
