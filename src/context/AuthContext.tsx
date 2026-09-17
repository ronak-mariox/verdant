import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, api, clearStoredTokens, onForceLogout } from '../services/api';

const SESSION_RESTORE_RETRIES = 2;
const SESSION_RESTORE_RETRY_DELAY_MS = 800;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

export interface AuthUser {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  dob: string | null;
  gender: string | null;
  avatarUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfilePatch {
  name?: string;
  email?: string;
  dob?: string;
  gender?: 'female' | 'male' | 'other';
}

export interface OtpRequestResult {
  message: string;
  devOtp?: string;
}

/**
 * An OTP verify on an unknown phone number does NOT create an account — it only
 * proves phone ownership and hands back a short-lived `verifiedPhoneToken` for
 * `register` below. This means a customer who verifies but abandons signup never
 * leaves a blank profile behind.
 */
export type VerifyOtpResult = { isNewUser: true; verifiedPhoneToken: string } | { isNewUser: false; user: AuthUser };

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requestOtp: (phone: string) => Promise<OtpRequestResult>;
  loginWithOtp: (phone: string, otp: string) => Promise<VerifyOtpResult>;
  register: (verifiedPhoneToken: string, name: string, email?: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  updateProfile: (patch: ProfilePatch) => Promise<AuthUser>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Let the api layer force a logout (e.g. refresh token rejected) without importing React.
  useEffect(() => {
    onForceLogout(() => setUser(null));
  }, []);

  const refreshUser = useCallback(async () => {
    const { data } = await api.get<AuthUser>('/customer/me');
    setUser(data);
  }, []);

  // On mount, try to restore a session from a persisted access token. Critically, a
  // network failure here (server unreachable, brief connectivity blip, etc.) must NOT
  // wipe the stored session — only a genuine auth rejection (401, meaning the interceptor
  // already tried to refresh and the backend rejected that too) should log the user out.
  // Losing this distinction was exactly why reopening the app after being offline for a
  // moment forced a fresh login even though the session was still perfectly valid.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
      if (!token) {
        if (!cancelled) setIsLoading(false);
        return;
      }

      for (let attempt = 0; attempt <= SESSION_RESTORE_RETRIES; attempt++) {
        try {
          const { data } = await api.get<AuthUser>('/customer/me');
          if (!cancelled) setUser(data);
          break;
        } catch (err) {
          const status = axios.isAxiosError(err) ? err.response?.status : undefined;
          if (status === 401) {
            // Refresh already failed inside the interceptor — the session is genuinely gone.
            await clearStoredTokens();
            if (!cancelled) setUser(null);
            break;
          }
          if (attempt === SESSION_RESTORE_RETRIES) {
            // Couldn't reach the server after retrying — keep the stored tokens (they're
            // likely still valid) rather than forcing a fresh login over a network problem.
            break;
          }
          await sleep(SESSION_RESTORE_RETRY_DELAY_MS);
        }
      }
      if (!cancelled) setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const requestOtp = useCallback(async (phone: string): Promise<OtpRequestResult> => {
    const { data } = await api.post<OtpRequestResult>('/customer/auth/otp/request', { phone });
    return data;
  }, []);

  const loginWithOtp = useCallback(async (phone: string, otp: string): Promise<VerifyOtpResult> => {
    const { data } = await api.post<
      { isNewUser: true; verifiedPhoneToken: string } | { isNewUser: false; accessToken: string; refreshToken: string; user: AuthUser }
    >('/customer/auth/otp/verify', { phone, otp });

    if (data.isNewUser) {
      return { isNewUser: true, verifiedPhoneToken: data.verifiedPhoneToken };
    }

    await AsyncStorage.setMany({
      [ACCESS_TOKEN_KEY]: data.accessToken,
      [REFRESH_TOKEN_KEY]: data.refreshToken,
    });
    setUser(data.user);
    return { isNewUser: false, user: data.user };
  }, []);

  const register = useCallback(async (verifiedPhoneToken: string, name: string, email?: string): Promise<AuthUser> => {
    const { data } = await api.post<{ accessToken: string; refreshToken: string; user: AuthUser }>(
      '/customer/auth/register',
      { verifiedPhoneToken, name, ...(email ? { email } : {}) },
    );

    await AsyncStorage.setMany({
      [ACCESS_TOKEN_KEY]: data.accessToken,
      [REFRESH_TOKEN_KEY]: data.refreshToken,
    });
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch {
      // Best-effort — the session is cleared locally regardless of the server response.
    } finally {
      await clearStoredTokens();
      setUser(null);
    }
  }, []);

  const updateProfile = useCallback(async (patch: ProfilePatch): Promise<AuthUser> => {
    const { data } = await api.patch<AuthUser>('/customer/me', patch);
    setUser(data);
    return data;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user != null,
      isLoading,
      requestOtp,
      loginWithOtp,
      register,
      logout,
      updateProfile,
      refreshUser,
    }),
    [user, isLoading, requestOtp, loginWithOtp, register, logout, updateProfile, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
