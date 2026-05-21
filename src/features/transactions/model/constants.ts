import type { SortKey, TransactionStatus } from "./types";

export type FilterStatus = TransactionStatus | "all";

interface SortableColumnConfig {
  key: SortKey;
  label: string;
  sortable: true;
  className?: string;
  ariaLabel?: string;
}

interface StaticColumnConfig {
  key: "id" | "description" | "actions";
  label: string;
  sortable: false;
  className?: string;
  ariaLabel?: string;
}

export type ColumnConfig = SortableColumnConfig | StaticColumnConfig;

export const STATUS_OPTIONS: ReadonlyArray<{
  value: FilterStatus;
  label: string;
}> = [
  { value: "all", label: "Show all transactions" },
  { value: "success", label: "Show successful" },
  { value: "failed", label: "Show failed" },
  { value: "pending", label: "Show pending" },
];

export function isFilterStatus(value: string): value is FilterStatus {
  return STATUS_OPTIONS.some((option) => option.value === value);
}

export const COLUMNS: ReadonlyArray<ColumnConfig> = [
  { key: "id", label: "Transaction ID", sortable: false, className: "w-44" },
  { key: "description", label: "Description", sortable: false },
  { key: "amount", label: "Amount", sortable: true, className: "w-28" },
  { key: "createdAt", label: "Date", sortable: true, className: "w-44" },
  { key: "status", label: "Status", sortable: true, className: "w-32" },
  {
    key: "actions",
    label: "Actions",
    sortable: false,
    className: "w-44 text-right",
    ariaLabel: "Invoice actions",
  },
];
