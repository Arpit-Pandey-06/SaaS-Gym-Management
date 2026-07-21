/**
 * Auth Service — Real API calls.
 * Aligned with backend contract: /api/v1/auth/*
 *
 * Token flow:
 * - Access token → sessionStorage + Axios Bearer header
 * - Refresh token → HttpOnly cookie (backend sets, browser sends automatically)
 * - Every protected route → sends Bearer access token
 * - 401 received → interceptor calls /refresh → new access token → retry
 */

import api, { setAccessToken, getAccessToken } from "@/lib/axios";
import { useAuthStore } from "@/store";
import {
  User,
  LoginRequest, LoginResponse,
  RegisterRequest, RegisterResponse,
  MeResponse, LogoutResponse,
} from "@/types";

export const authService = {

  /**
   * POST /api/v1/auth/register
   * Creates gym owner + gym. Redirects to login after.
   */
  async register(payload: RegisterRequest): Promise<RegisterResponse["data"]> {
    const res = await api.post<RegisterResponse>("/auth/register", payload);
    return res.data.data;
  },

  /**
   * POST /api/v1/auth/login
   * - Returns access_token in body → stored in sessionStorage
   * - Backend sets refresh_token as HttpOnly cookie automatically
   */
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    } satisfies LoginRequest);

    const { access_token, user } = res.data.data;

    // Store access token in sessionStorage + set Axios header
    setAccessToken(access_token);

    return { user, token: access_token };
  },

  /**
   * GET /api/v1/auth/me
   * Verify current access token and get fresh user data.
   * Called: on startup (if token exists), and after refresh.
   * If this returns 401, the interceptor automatically calls /refresh.
   */
  async getMe(): Promise<User> {
    const res = await api.get<MeResponse>("/auth/me");
    return res.data.data;
  },

  /**
   * POST /api/v1/auth/refresh
   * No body — browser sends HttpOnly cookie automatically.
   * Called: by interceptor on 401, or on startup if no token in sessionStorage.
   */
  async refresh(): Promise<string> {
    const res = await api.post<{ success: boolean; data: { access_token: string } }>(
      "/auth/refresh"
    );
    const newToken = res.data.data.access_token;
    setAccessToken(newToken);
    return newToken;
  },

  /**
   * POST /api/v1/auth/logout
   * Backend revokes refresh token from DB + clears HttpOnly cookie.
   * Frontend clears sessionStorage + Zustand + Axios header.
   */
  async logout(): Promise<void> {
    try {
      await api.post<LogoutResponse>("/auth/logout");
    } catch {
      // Even if backend call fails, clear all frontend state
    } finally {
      setAccessToken(null);
      useAuthStore.getState().clearAuth();
    }
  },

  /**
   * POST /api/v1/auth/forgot-password
   */
  async forgotPassword(email: string): Promise<void> {
    await api.post("/auth/forgot-password", { email });
  },

  /**
   * App startup session restore.
   * 
   * Flow:
   * 1. Access token exists in sessionStorage (page reload, not tab close)?
   *    → Call /me directly with that token
   *    → If /me returns 401 (token expired) → interceptor auto-calls /refresh → retries /me
   *    → If refresh also fails → clearAuth → redirect to login
   *
   * 2. No access token (new tab, tab was closed)?
   *    → Call /refresh with HttpOnly cookie
   *    → Get new access token → call /me
   *    → If refresh fails → clearAuth → redirect to login
   */
  async initAuth(): Promise<User | null> {
    const { isAuthenticated, setAuthLoading } = useAuthStore.getState();

    if (!isAuthenticated) {
      setAuthLoading(false);
      return null;
    }

    try {
      const existingToken = getAccessToken();

      if (existingToken) {
        // Token in sessionStorage — try /me directly
        // If token expired, 401 interceptor will auto-refresh and retry /me
        const user = await authService.getMe();
        useAuthStore.getState().setAuth(user, existingToken);
        return user;
      } else {
        // No token (new tab or tab was closed) — restore via refresh cookie
        const newToken = await authService.refresh();
        const user = await authService.getMe();
        useAuthStore.getState().setAuth(user, newToken);
        return user;
      }
    } catch {
      // Both access token and refresh token invalid — full logout
      setAccessToken(null);
      useAuthStore.getState().clearAuth();
      return null;
    }
  },
};
