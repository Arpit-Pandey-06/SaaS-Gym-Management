"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useAuthStore } from "@/store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Dumbbell } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait until auth check is complete before deciding to redirect
    if (!isAuthLoading && !isAuthenticated) {
      // Save the page they tried to visit so we can redirect back after login
      sessionStorage.setItem("fitsaas-redirect", pathname);
      router.replace("/login");
    }
  }, [isAuthenticated, isAuthLoading, router, pathname]);

  // Show spinner while auth is being verified on startup
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand flex items-center justify-center">
            <Dumbbell className="h-5 w-5 text-white" />
          </div>
          <div className="h-5 w-5 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Not authenticated and not loading — redirect is happening, render nothing
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
