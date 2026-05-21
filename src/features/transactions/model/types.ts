export type TransactionStatus = "success" | "failed" | "pending";

export type Currency = "USD" | "EUR" | "GBP";

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  createdAt: string;
  description: string;
  paymentMethod: string;
  status: TransactionStatus;
}

export type SortKey = "createdAt" | "amount" | "status";
export type SortDirection = "asc" | "desc";

export interface SortState {
  key: SortKey;
  direction: SortDirection;
}

export interface FilterState {
  status: TransactionStatus | "all";
  query: string;
}
