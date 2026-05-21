import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

interface SpinnerProps {
  size?: number;
  label?: string;
  className?: string;
}

export function Spinner({ size = 16, label = "Loading", className }: SpinnerProps) {
  const dimension: CSSProperties = { width: size, height: size };

  return (
    <span
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <span
        aria-hidden="true"
        style={dimension}
        className="inline-block animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
