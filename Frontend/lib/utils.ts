import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "INR"): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Fallback if en-IN locale not available in this Node build
    return `₹${amount.toLocaleString()}`;
  }
}

export function formatDate(date: string | Date, fmt = "dd MMM yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, fmt);
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(n);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900",
    inactive: "text-gray-600 bg-gray-100 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    expired: "text-red-700 bg-red-50 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900",
    frozen: "text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900",
    on_leave: "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
    paid: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900",
    pending: "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
    failed: "text-red-700 bg-red-50 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900",
    refunded: "text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-900",
  };
  return map[status] ?? "text-gray-600 bg-gray-100 border-gray-200";
}

export function truncate(str: string, max = 40): string {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timer: NodeJS.Timeout;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}
