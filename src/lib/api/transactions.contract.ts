import type { Transaction, TransactionStatus } from "@/features/transactions/model/types";

export interface RetryResult {
  id: string;
  status: Extract<TransactionStatus, "success" | "failed">;
}

export interface TransactionsApi {
  listTransactions: () => Promise<Transaction[]>;
  generateInvoice: (id: string) => Promise<Blob>;
  retryPayment: (id: string) => Promise<RetryResult>;
}
