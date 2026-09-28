import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_TIMEOUT_MS } from '../config';

export const ACCESS_TOKEN_KEY = 'verdant_access_token';
export const REFRESH_TOKEN_KEY = 'verdant_refresh_token';

export async function clearStoredTokens(): Promise<void> {
  await AsyncStorage.removeMany([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
}

/**
 * Called when the session is no longer valid (refresh token rejected, or the account was
 * restricted). AuthContext registers a listener here on mount so it can clear its in-memory
 * user state without this module needing to import React/context directly.
 */
type ForceLogoutListener = () => void;
let forceLogoutListener: ForceLogoutListener | null = null;
export function onForceLogout(listener: ForceLogoutListener): void {
  forceLogoutListener = listener;
}

export const api = axios.create({ baseURL: API_BASE_URL, timeout: API_TIMEOUT_MS });

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

    if (isAccountRestricted(error)) {
      await clearStoredTokens();
      forceLogoutListener?.();
      return Promise.reject(error);
    }

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

interface ApiErrorBody {
  error?: string;
  reason?: string;
  details?: unknown;
}

/** A 403 with `reason: 'account_restricted'` means the account was blocked server-side. */
export function isAccountRestricted(err: unknown): boolean {
  if (!axios.isAxiosError(err) || err.response?.status !== 403) return false;
  return (err.response.data as ApiErrorBody | undefined)?.reason === 'account_restricted';
}

export function getErrorStatus(err: unknown): number | undefined {
  return axios.isAxiosError(err) ? err.response?.status : undefined;
}

/** True for failures where the request never got a server verdict (offline, timeout) or the server itself broke. */
export function isNetworkOrServerError(err: unknown): boolean {
  if (!axios.isAxiosError(err)) return false;
  const status = err.response?.status;
  return status === undefined || status >= 500;
}

/** Extracts a human-readable message from an API error, falling back to a generic message. */
export function getErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorBody | undefined;
    if (data?.error) return data.error;
    if (err.response?.status === 429) return 'Too many requests — please wait a few minutes and try again.';
    if (err.code === 'ECONNABORTED') return 'The request timed out. Check your connection and try again.';
    if (!err.response) return 'Could not reach the server. Check your connection and try again.';
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
