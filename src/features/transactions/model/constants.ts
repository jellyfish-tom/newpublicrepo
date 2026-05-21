import type { SortKey, TransactionStatus } from "./types";

export interface ColumnConfig {
  key: SortKey | "id" | "description" | "method" | "actions";
  label: string;
  sortable: boolean;
  className?: string;
  ariaLabel?: string;
}

export const STATUS_OPTIONS: ReadonlyArray<{
  value: TransactionStatus | "all";
  label: string;
}> = [
  { value: "all", label: "Show all transactions" },
  { value: "success", label: "Show successful" },
  { value: "failed", label: "Show failed" },
  { value: "pending", label: "Show pending" },
];

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
