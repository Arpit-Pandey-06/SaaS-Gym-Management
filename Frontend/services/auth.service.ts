/**
 * Auth Service — REAL API (replaces mock)
 * Aligned with backend contract: /api/v1/auth/*
 *
 * Uses the Axios instance from lib/axios.ts which:
 * - Attaches Bearer token automatically
 * - Handles 401 → refresh → retry
 */

import api, { setAccessToken } from "@/lib/axios";
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
   * Creates gym owner + gym in one call.
   * Does NOT log the user in — redirect to login after.
   */
  async register(payload: RegisterRequest): Promise<RegisterResponse["data"]> {
    const res = await api.post<RegisterResponse>("/auth/register", payload);
    return res.data.data;
  },

  /**
   * POST /api/v1/auth/login
   * Returns access_token in body.
   * Backend sets refresh_token as HttpOnly cookie automatically.
   */
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    } satisfies LoginRequest);

    const { access_token, user } = res.data.data;

    // Set on Axios instance immediately
    setAccessToken(access_token);

    return { user, token: access_token };
  },

  /**
   * GET /api/v1/auth/me
   * Called on app startup to rehydrate user from a valid access token.
   * If this fails with 401, the interceptor will auto-refresh.
   */
  async getMe(): Promise<User> {
    const res = await api.get<MeResponse>("/auth/me");
    return res.data.data;
  },

  /**
   * POST /api/v1/auth/refresh
   * No body — browser sends HttpOnly cookie automatically.
   * Called automatically by Axios interceptor on 401.
   * Can also be called manually on app startup if needed.
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
   * Backend revokes refresh token from DB and clears the HttpOnly cookie.
   * Frontend clears store + Axios header.
   */
  async logout(): Promise<void> {
    try {
      await api.post<LogoutResponse>("/auth/logout");
    } catch {
      // Even if backend call fails, clear frontend state
    } finally {
      setAccessToken(null);
      useAuthStore.getState().clearAuth();
    }
  },

  /**
   * App startup check.
   * Call this once when the app mounts.
   * If user is in Zustand store (persisted), try to get a fresh token via /refresh,
   * then call /me to revalidate the user object.
   */
  async initAuth(): Promise<User | null> {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) return null;

    try {
      // Try to get a fresh access token via the refresh cookie
      const newToken = await authService.refresh();
      setAccessToken(newToken);

      // Revalidate user from backend
      const user = await authService.getMe();
      useAuthStore.getState().setAuth(user, newToken);
      return user;
    } catch {
      // Refresh failed — session expired, clear everything
      setAccessToken(null);
      useAuthStore.getState().clearAuth();
      return null;
    }
  },
  /**
   * POST /api/v1/auth/forgot-password
   * Sends a reset link to the given email.
   */
  async forgotPassword(email: string): Promise<void> {
    await api.post("/auth/forgot-password", { email });
  },


};
