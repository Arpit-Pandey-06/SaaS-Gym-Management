"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Bell, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui";
import { useSidebarStore, useAuthStore, useNotificationStore, useBranchStore } from "@/store";
import { mockBranches } from "@/mock/data";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { formatRelativeTime } from "@/lib/utils";
import { notificationService } from "@/services";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const { toggle } = useSidebarStore();
  const { user } = useAuthStore();
  const { notifications, unreadCount, markRead, markAllRead, setNotifications } = useNotificationStore();
  const { activeBranchId, setActiveBranch } = useBranchStore();

  const [notifOpen, setNotifOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const branchRef = useRef<HTMLDivElement>(null);

  // Load notifications
  useEffect(() => {
    notificationService.getNotifications().then(setNotifications);
  }, [setNotifications]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (branchRef.current && !branchRef.current.contains(e.target as Node)) setBranchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeBranch = mockBranches.find((b) => b.id === activeBranchId);

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-4 gap-3 sticky top-0 z-30">
      {/* Mobile menu */}
      <Button variant="ghost" size="icon-sm" onClick={toggle} className="lg:hidden">
        <Menu className="h-4 w-4" />
      </Button>

      {/* Branch selector */}
      {user?.role === "owner" || user?.role === "admin" ? (
        <div className="relative" ref={branchRef}>
          <button
            onClick={() => setBranchOpen(!branchOpen)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors py-1 px-2 rounded-lg hover:bg-muted"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="font-medium">{activeBranchId === "all" ? "All branches" : activeBranch?.name ?? "Select branch"}</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          {branchOpen && (
            <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-xl shadow-lg py-1 w-52 z-50">
              <button
                className={cn("w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors", activeBranchId === "all" && "text-brand font-medium")}
                onClick={() => { setActiveBranch("all"); setBranchOpen(false); }}
              >All branches</button>
              {mockBranches.map((b) => (
                <button
                  key={b.id}
                  className={cn("w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors", activeBranchId === b.id && "text-brand font-medium")}
                  onClick={() => { setActiveBranch(b.id); setBranchOpen(false); }}
                >{b.name}</button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <div className="flex-1" />

      {/* Theme toggle */}
      <Button variant="ghost" size="icon-sm" onClick={cycleTheme} title="Toggle theme">
        <ThemeIcon className="h-4 w-4" />
      </Button>

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <Button variant="ghost" size="icon-sm" onClick={() => setNotifOpen(!notifOpen)} className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-brand text-brand-foreground text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>

        {notifOpen && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-sm font-medium">Notifications</p>
              {unreadCount > 0 && (
                <button className="text-xs text-brand hover:underline" onClick={() => { markAllRead(); notificationService.markAllAsRead(); }}>
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    className={cn("w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-0", !n.isRead && "bg-brand-muted/30")}
                    onClick={() => { markRead(n.id); notificationService.markAsRead(n.id); }}
                  >
                    <div className="flex items-start gap-2">
                      {!n.isRead && <span className="h-1.5 w-1.5 rounded-full bg-brand mt-1.5 flex-shrink-0" />}
                      <div className={cn(!n.isRead ? "" : "pl-3.5")}>
                        <p className="text-xs font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">{formatRelativeTime(n.createdAt)}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
