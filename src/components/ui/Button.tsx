import type { ButtonHTMLAttributes, Ref } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  loadingLabel?: string;
  ref?: Ref<HTMLButtonElement>;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-slate-950 text-white shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100",
  secondary:
    "border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
  danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-500",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingLabel = "Loading",
  disabled,
  children,
  type = "button",
  ref,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const ariaBusy = isLoading ? true : undefined;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={ariaBusy}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-[transform,background-color,border-color,color]",
        "focus-ring",
        "active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...rest}
    >
      {isLoading ? <Spinner size={14} label={loadingLabel} /> : null}
      {children}
    </button>
  );
}
