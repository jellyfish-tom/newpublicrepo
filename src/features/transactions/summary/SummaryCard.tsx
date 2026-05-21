import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";

interface SummaryCardProps {
  label: string;
  value: string;
  meta?: string;
  accessory?: ReactNode;
  accent?: "neutral" | "danger" | "success";
}

const ACCENT_TEXT_CLASSES: Record<NonNullable<SummaryCardProps["accent"]>, string> = {
  neutral: "text-fg",
  danger: "text-fg-danger",
  success: "text-fg-success",
};

export function SummaryCard({
  label,
  value,
  meta,
  accessory,
  accent = "neutral",
}: SummaryCardProps) {
  return (
    <div className="relative min-w-0 md:px-4 first:md:pl-0 last:md:pr-0">
      <p
        className={`h-4 truncate text-[10px] font-semibold uppercase leading-4 tracking-wider text-fg-subtle ${accessory ? "pr-20" : ""}`}
      >
        {label}
      </p>
      {accessory ? <div className="absolute right-0 top-0">{accessory}</div> : null}
      <div className="mt-1 flex min-w-0 items-baseline gap-2">
        <p
          className={`truncate text-lg font-semibold leading-6 tabular-nums ${ACCENT_TEXT_CLASSES[accent]}`}
        >
          {value}
        </p>
        {meta ? (
          <Badge variant="warning" size="xs">
            {meta}
          </Badge>
        ) : null}
      </div>
    </div>
  );
}
