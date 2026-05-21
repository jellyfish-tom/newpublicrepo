import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "neutral" | "success" | "danger" | "warning" | "count";
type BadgeSize = "xs" | "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral:
    "bg-slate-50 text-slate-700 ring-slate-600/20 dark:bg-slate-800/60 dark:text-slate-200 dark:ring-slate-400/20",
  success:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-400/30",
  danger:
    "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-900/30 dark:text-rose-300 dark:ring-rose-400/30",
  warning:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-400/30",
  count:
    "bg-emerald-100 text-emerald-700 ring-transparent dark:bg-emerald-500/20 dark:text-emerald-300",
};

const DOT_CLASSES: Record<BadgeVariant, string> = {
  neutral: "bg-slate-400",
  success: "bg-emerald-500",
  danger: "bg-rose-500",
  warning: "bg-amber-500",
  count: "bg-emerald-500",
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  xs: "gap-1 px-2 py-0.5 text-[10px]",
  sm: "gap-1.5 px-2.5 py-1 text-xs",
  md: "gap-2 px-3 py-1.5 text-sm",
};

const DOT_SIZE_CLASSES: Record<BadgeSize, string> = {
  xs: "h-1.5 w-1.5",
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
};

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full font-medium ring-1 ring-inset",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className={cn("rounded-full", DOT_CLASSES[variant], DOT_SIZE_CLASSES[size])}
        />
      ) : null}
      {children}
    </span>
  );
}
