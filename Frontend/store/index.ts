import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Notification } from "@/types";

// ─── Auth Store ───────────────────────────────────────────────
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;        // true while initAuth() is running on startup
  setAuth: (user: User, token: string) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
  setAuthLoading: (v: boolean) => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAuthLoading: true,        // start as true — assume loading until checked
      setAuth: (user, token) => set({ user, token, isAuthenticated: true, isAuthLoading: false }),
      setToken: (token) => set({ token }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false, isAuthLoading: false }),
      setAuthLoading: (v) => set({ isAuthLoading: v }),
      updateUser: (data) =>
        set((s) => ({ user: s.user ? { ...s.user, ...data } : null })),
    }),
    {
      name: "fitsaas-auth",
      // Only persist user presence — token comes fresh from /refresh on every startup
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ─── Notification Store ───────────────────────────────────────
interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (n: Notification[]) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({ notifications, unreadCount: notifications.filter((n) => !n.isRead).length }),
  markRead: (id) =>
    set((s) => {
      const updated = s.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return { notifications: updated, unreadCount: updated.filter((n) => !n.isRead).length };
    }),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
}));

// ─── Sidebar Store ────────────────────────────────────────────
interface SidebarStore {
  isCollapsed: boolean;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggle: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
      setCollapsed: (v) => set({ isCollapsed: v }),
    }),
    { name: "fitsaas-sidebar" }
  )
);

// ─── Branch Store ─────────────────────────────────────────────
interface BranchStore {
  activeBranchId: string | "all";
  setActiveBranch: (id: string | "all") => void;
}

export const useBranchStore = create<BranchStore>()(
  persist(
    (set) => ({
      activeBranchId: "all",
      setActiveBranch: (id) => set({ activeBranchId: id }),
    }),
    { name: "fitsaas-branch" }
  )
);
