import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";
import { useAuthStore } from "@/store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
const TOKEN_KEY = "fitsaas-access-token";

// ─── Token helpers ────────────────────────────────────────────
export function setAccessToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common["Authorization"];
  }
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

// ─── Axios instance ───────────────────────────────────────────
export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ─── Request interceptor ──────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — 401 → refresh → retry ────────────
let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

function processQueue(error: AxiosError | null, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const is401 = error.response?.status === 401;
    const isRefreshRoute = originalRequest.url?.includes("/auth/refresh");
    const alreadyRetried = originalRequest._retry;

    console.log(`[Axios] ${error.response?.status} on ${originalRequest.url}`);

    if (is401 && !alreadyRetried && !isRefreshRoute) {

      // Queue parallel requests while refresh in progress
      if (isRefreshing) {
        console.log("[Axios] Refresh in progress — queuing request");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      console.log("[Axios] Access token expired — calling /refresh...");

      try {
        const res = await api.post<{
          success: boolean;
          data: { access_token: string };
        }>("/auth/refresh");

        const newToken = res.data.data.access_token;
        console.log("[Axios] /refresh succeeded — new token received ✓");

        setAccessToken(newToken);
        useAuthStore.getState().setToken(newToken);
        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        }

        console.log("[Axios] Retrying original request...");
        return api(originalRequest);

      } catch (refreshError) {
        const refreshErr = refreshError as AxiosError;
        console.error("[Axios] /refresh FAILED —", refreshErr.response?.status, refreshErr.response?.data);
        console.log("[Axios] Session expired — redirecting to login");

        processQueue(refreshErr, null);
        setAccessToken(null);
        useAuthStore.getState().clearAuth();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
