import type { ComponentPropsWithoutRef, Ref } from "react";
import { cn } from "@/lib/cn";

type CardVariant = "frosted" | "solid" | "floating";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
  variant?: CardVariant;
  padding?: CardPadding;
  ref?: Ref<HTMLDivElement>;
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  frosted:
    "border border-border-subtle/70 bg-surface/80 shadow-sm backdrop-blur-sm dark:bg-surface/60",
  solid: "border border-border-subtle bg-surface shadow-sm",
  floating:
    "border border-border-elevated bg-surface/95 shadow-lg backdrop-blur dark:bg-surface/90",
};

const PADDING_CLASSES: Record<CardPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({
  variant = "frosted",
  padding = "md",
  className,
  ref,
  ...props
}: CardProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl",
        VARIANT_CLASSES[variant],
        PADDING_CLASSES[padding],
        className,
      )}
      {...props}
    />
  );
}
