import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import type { ColumnConfig } from "../model/constants";
import type { SortKey, SortState } from "../model/types";
import { SortIndicator } from "./SortIndicator";

interface SortableThProps {
  column: ColumnConfig;
  sort: SortState;
  onToggleSort: (key: SortKey) => void;
}

export function SortableTh({ column, sort, onToggleSort }: SortableThProps) {
  const isSortable = column.sortable;
  const sortKey = isSortable ? (column.key as SortKey) : null;
  const hasSortKey = sortKey !== null;
  const isCurrentSortKey = sort.key === sortKey;
  const isActive = hasSortKey && isCurrentSortKey;
  const ariaSort = isActive
    ? sort.direction === "asc"
      ? "ascending"
      : "descending"
    : "none";
  const isActiveAscending = isActive && sort.direction === "asc";
  const nextSortAction = isActiveAscending ? "descending" : "ascending";
  const sortButtonLabel = isActive
    ? `Sort by ${column.label}, currently ${ariaSort}. Activate to sort ${nextSortAction}.`
    : `Sort by ${column.label} ${nextSortAction}`;

  const handleClick = () => {
    if (sortKey) {
      onToggleSort(sortKey);
    }
  };

  return (
    <th
      scope="col"
      aria-sort={isSortable ? ariaSort : undefined}
      aria-label={column.ariaLabel}
      className={cn("px-5 py-4", column.className)}
    >
      {isSortable ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClick}
          aria-label={sortButtonLabel}
          className="h-auto gap-1 rounded-none px-0 py-0 uppercase tracking-wider hover:bg-transparent hover:text-slate-900 focus-visible:text-slate-900 focus-visible:underline focus-visible:underline-offset-4 focus-visible:ring-0 focus-visible:ring-offset-0 dark:hover:bg-transparent dark:hover:text-white dark:focus-visible:text-white"
        >
          {column.label}
          <SortIndicator active={isActive} direction={sort.direction} />
        </Button>
      ) : (
        column.label
      )}
    </th>
  );
}
