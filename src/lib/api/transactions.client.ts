import type { Transaction } from "@/features/transactions/model/types";
import type { RetryResult } from "./transactions.contract";
import { transactionsApiRoutes } from "./transactions.routes";

function apiUrl(path: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${path}`;
  }

  return path;
}

export async function listTransactions(): Promise<Transaction[]> {
  const response = await fetch(apiUrl(transactionsApiRoutes.list));

  if (!response.ok) {
    throw new Error(`Failed to load transactions: ${response.status}`);
  }

  return response.json();
}

export async function generateInvoice(id: string): Promise<Blob> {
  const response = await fetch(apiUrl(transactionsApiRoutes.invoice(id)));

  if (!response.ok) {
    throw new Error(`Failed to generate invoice: ${response.status}`);
  }

  return response.blob();
}

export async function retryPayment(id: string): Promise<RetryResult> {
  const response = await fetch(apiUrl(transactionsApiRoutes.retry(id)), {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Failed to retry payment: ${response.status}`);
  }

  return response.json();
}
