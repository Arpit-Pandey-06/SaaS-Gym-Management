"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store";

function AuthInitializer() {
  const { isAuthenticated, setAuthLoading } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      if (isAuthenticated) {
        // User was logged in before — try to restore session via refresh cookie
        await authService.initAuth();
        // initAuth calls setAuth on success (sets isAuthLoading false)
        // or clearAuth on failure (also sets isAuthLoading false)
      } else {
        // Not logged in — no need to check, just mark loading done
        setAuthLoading(false);
      }
    };

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only on mount

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 2,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthInitializer />
        {children}
        <Toaster
          richColors
          position="top-right"
          toastOptions={{ classNames: { toast: "font-sans text-sm" } }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
