"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarStore, useAuthStore } from "@/store";
import {
  LayoutDashboard, Users, Dumbbell, UserCog, Building2,
  CreditCard, ClipboardList, BarChart3, Settings, LogOut,
  ChevronLeft, Utensils, BriefcaseMedical, Bell, User, Activity
} from "lucide-react";
import { authService } from "@/services";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui";

const navItems = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/members", icon: Users, label: "Members" },
      { href: "/trainers", icon: Dumbbell, label: "Trainers" },
      { href: "/staff", icon: UserCog, label: "Staff" },
      { href: "/branches", icon: Building2, label: "Branches" },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/plans", icon: BriefcaseMedical, label: "Plans" },
      { href: "/attendance", icon: ClipboardList, label: "Attendance" },
      { href: "/payments", icon: CreditCard, label: "Payments" },
    ],
  },
  {
    label: "Health",
    items: [
      { href: "/workout-plans", icon: Activity, label: "Workout Plans" },
      { href: "/diet-plans", icon: Utensils, label: "Diet Plans" },
    ],
  },
  {
    label: "Analytics",
    items: [
      { href: "/reports", icon: BarChart3, label: "Reports" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebarStore();
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    clearAuth();
    router.push("/login");
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center border-b border-sidebar-border h-14 px-4 flex-shrink-0", isCollapsed ? "justify-center" : "justify-between")}>
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">
              <Link href="/dashboard"><Dumbbell className="h-4 w-4 text-white" /></Link>
            </div>
            <span className="font-semibold text-sm text-foreground">FitSaaS</span>
          </div>
        )}
        {isCollapsed && (
          <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center">
               <Link href="/dashboard"><Dumbbell className="h-4 w-4 text-white" /></Link>
          </div>
        )}
        {!isCollapsed && (
          <button
            onClick={toggle}
            className="h-6 w-6 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-none py-3 px-2">
        {navItems.map((group) => (
          <div key={group.label} className="mb-4">
            {!isCollapsed && (
              <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors mb-0.5",
                    isCollapsed ? "justify-center" : "",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className={cn("flex-shrink-0", isCollapsed ? "h-5 w-5" : "h-4 w-4")} />
                  {!isCollapsed && item.label}
                </Link>
              );
            })}
            {isCollapsed && group.label !== "Analytics" && (
              <div className="h-px bg-sidebar-border mx-2 my-1.5" />
            )}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-2 flex-shrink-0">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-muted/60 hover:text-foreground transition-colors mb-0.5",
            isCollapsed ? "justify-center" : ""
          )}
          title={isCollapsed ? "Settings" : undefined}
        >
          <Settings className={cn("flex-shrink-0", isCollapsed ? "h-5 w-5" : "h-4 w-4")} />
          {!isCollapsed && "Settings"}
        </Link>

        {!isCollapsed ? (
          <div className="flex items-center gap-2 px-2 py-2 mt-1 rounded-lg">
            <Avatar name={user?.name ?? "User"} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground truncate capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted/60 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <button
          onClick={toggle}
          className="flex items-center justify-center p-2 border-t border-sidebar-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4 rotate-180" />
        </button>
      )}
    </aside>
  );
}
