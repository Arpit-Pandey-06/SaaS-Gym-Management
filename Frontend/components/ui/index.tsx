"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ─── Button ───────────────────────────────────────────────────
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        brand: "bg-brand text-brand-foreground hover:bg-brand/90 shadow-sm",
        "brand-outline": "border border-brand text-brand hover:bg-brand-muted",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8 text-base",
        icon: "h-9 w-9",
        "icon-sm": "h-7 w-7",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

// ─── Badge ────────────────────────────────────────────────────
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "border-border text-foreground",
        success: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400",
        warning: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400",
        danger: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400",
        info: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400",
        muted: "border-border bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

// ─── Card ─────────────────────────────────────────────────────
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)} {...props} />
  )
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1 p-5 pb-0", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-sm font-medium text-muted-foreground", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 pt-3", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-5 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

// ─── Input ────────────────────────────────────────────────────
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

// ─── Label ────────────────────────────────────────────────────
export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    {...props}
  />
));
Label.displayName = "Label";

// ─── Textarea ─────────────────────────────────────────────────
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

// ─── Separator ────────────────────────────────────────────────
export function Separator({ className, orientation = "horizontal", ...props }: React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      role="separator"
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  );
}

// ─── Skeleton ─────────────────────────────────────────────────
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

// ─── Avatar ───────────────────────────────────────────────────
interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const avatarSizes = { sm: "h-7 w-7 text-xs", md: "h-9 w-9 text-sm", lg: "h-11 w-11 text-base", xl: "h-14 w-14 text-lg" };

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const initials = name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const colors = ["bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700", "bg-purple-100 text-purple-700", "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700", "bg-teal-100 text-teal-700"];
  const color = colors[name.charCodeAt(0) % colors.length];

  if (src) {
    return (
      <div className={cn("rounded-full overflow-hidden flex-shrink-0", avatarSizes[size], className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className={cn("rounded-full flex-shrink-0 flex items-center justify-center font-semibold", avatarSizes[size], color, className)}>
      {initials}
    </div>
  );
}

// ─── StatusBadge ──────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
    active: { label: "Active", variant: "success" },
    inactive: { label: "Inactive", variant: "muted" },
    expired: { label: "Expired", variant: "danger" },
    frozen: { label: "Frozen", variant: "info" },
    on_leave: { label: "On Leave", variant: "warning" },
    paid: { label: "Paid", variant: "success" },
    pending: { label: "Pending", variant: "warning" },
    failed: { label: "Failed", variant: "danger" },
    refunded: { label: "Refunded", variant: "secondary" },
  };
  const config = map[status] ?? { label: status, variant: "outline" as const };
  return (
    <Badge variant={config.variant}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </Badge>
  );
}

// ─── StatsCard ────────────────────────────────────────────────
interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  iconColor?: string;
  loading?: boolean;
}

export function StatsCard({ title, value, change, changeType = "neutral", icon, iconColor = "bg-brand-muted text-brand", loading }: StatsCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-5">
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
            {change && (
              <p className={cn("text-xs font-medium flex items-center gap-1",
                changeType === "up" ? "text-emerald-600" : changeType === "down" ? "text-red-500" : "text-muted-foreground"
              )}>
                {changeType === "up" ? "↑" : changeType === "down" ? "↓" : ""} {change}
              </p>
            )}
          </div>
          <div className={cn("rounded-xl p-2.5", iconColor)}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Empty State ──────────────────────────────────────────────
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      {icon && (
        <div className="rounded-full bg-muted p-4 text-muted-foreground">
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Search Bar ───────────────────────────────────────────────
interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search…", className }: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pl-8 h-9" />
    </div>
  );
}

// ─── Page Header ──────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumb?: string[];
}

export function PageHeader({ title, description, action, breadcrumb }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between mb-6">
      <div>
        {breadcrumb && (
          <p className="text-xs text-muted-foreground mb-1">{breadcrumb.join(" / ")}</p>
        )}
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-2 mt-2 sm:mt-0">{action}</div>}
    </div>
  );
}
