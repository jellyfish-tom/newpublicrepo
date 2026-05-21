import type { Ref, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type SelectSize = "xs" | "sm" | "md";

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label: string;
  hideLabel?: boolean;
  size?: SelectSize;
  containerClassName?: string;
  ref?: Ref<HTMLSelectElement>;
}

const SIZE_CLASSES: Record<SelectSize, string> = {
  xs: "h-7 pl-3 pr-7 text-xs",
  sm: "h-9 pl-4 pr-9 text-sm",
  md: "h-11 pl-5 pr-10 text-sm",
};

const CHEVRON_CLASSES: Record<SelectSize, string> = {
  xs: "right-2.5 h-3.5 w-3.5",
  sm: "right-3 h-4 w-4",
  md: "right-4 h-4 w-4",
};

export function Select({
  label,
  hideLabel = true,
  size = "md",
  className,
  containerClassName,
  id,
  children,
  ref,
  ...rest
}: SelectProps) {
  return (
    <label
      className={cn("relative inline-flex shrink-0 items-center", containerClassName)}
    >
      <span className={hideLabel ? "sr-only" : undefined}>{label}</span>
      <select
        ref={ref}
        id={id}
        className={cn(
          "cursor-pointer appearance-none rounded-full border border-border-subtle bg-surface font-semibold leading-none text-fg-muted shadow-sm transition-colors",
          "hover:border-slate-300 dark:hover:border-slate-600",
          "focus-ring-brand",
          "disabled:cursor-not-allowed disabled:opacity-60",
          "dark:bg-surface dark:text-fg",
          SIZE_CLASSES[size],
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      <Icon
        name="chevron-down"
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-300",
          CHEVRON_CLASSES[size],
        )}
      />
    </label>
  );
}
