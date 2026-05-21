"use client";

import { useCallback, useId, useMemo, type ChangeEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";
import { STATUS_OPTIONS } from "../model/constants";
import type { TransactionStatus } from "../model/types";

interface FilterBarProps {
  status: TransactionStatus | "all";
  query: string;
  onStatusChange: (status: TransactionStatus | "all") => void;
  onQueryChange: (query: string) => void;
}

export function FilterBar({
  status,
  query,
  onStatusChange,
  onQueryChange,
}: FilterBarProps) {
  const searchId = useId();
  const selectId = useId();

  const handleQueryChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onQueryChange(event.target.value);
    },
    [onQueryChange],
  );

  const handleQueryClear = useCallback(() => {
    onQueryChange("");
  }, [onQueryChange]);

  const handleStatusChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      onStatusChange(event.target.value as TransactionStatus | "all");
    },
    [onStatusChange],
  );

  const activeStatusLabel = useMemo(() => {
    const matchedStatusOption = STATUS_OPTIONS.find((option) => option.value === status);
    const matchedStatusLabel = matchedStatusOption?.label;

    if (matchedStatusLabel) {
      return matchedStatusLabel;
    }

    return "Show all";
  }, [status]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <label htmlFor={searchId} className="sr-only">
          Search transactions
        </label>
        <Icon
          name="search"
          size="sm"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={handleQueryChange}
          placeholder="Search"
          className={cn(
            "h-11 w-full rounded-full border border-border-subtle bg-surface/90 pl-10 pr-10 text-sm text-fg shadow-sm transition-colors",
            "placeholder:text-fg-subtle",
            "hover:border-slate-300 dark:hover:border-slate-600",
            "focus-ring-brand",
            "dark:bg-surface/70",
          )}
        />
        {query.length > 0 ? (
          <button
            type="button"
            onClick={handleQueryClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-fg-subtle transition-[transform,background-color,color] hover:bg-slate-100 hover:text-fg focus-ring active:scale-95 dark:hover:bg-slate-800"
          >
            <span aria-hidden="true" className="text-base leading-none">
              ×
            </span>
          </button>
        ) : null}
      </div>
      <Select
        id={selectId}
        label="Filter transactions by status"
        value={status}
        onChange={handleStatusChange}
        className="bg-white/90 font-medium dark:bg-slate-900/70 dark:text-slate-100"
        aria-label={`Status filter, currently: ${activeStatusLabel}`}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
