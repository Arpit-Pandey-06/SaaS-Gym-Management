import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers";

export const metadata: Metadata = {
  title: { template: "%s | FitSaaS", default: "FitSaaS — Gym Management" },
  description: "Modern multi-tenant SaaS platform for gym management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
