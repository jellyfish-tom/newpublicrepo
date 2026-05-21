import type { SortState } from "../model/types";

interface SortIndicatorProps {
  active: boolean;
  direction: SortState["direction"];
}

export function SortIndicator({ active, direction }: SortIndicatorProps) {
  const colorClassName = active
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-slate-300";
  const glyph = !active ? "↕" : direction === "asc" ? "↑" : "↓";

  return (
    <span
      aria-hidden="true"
      className={`inline-block w-3 text-center leading-none ${colorClassName}`}
    >
      {glyph}
    </span>
  );
}
