import type { Transaction } from "@/features/transactions/model/types";
import type { RetryResult, TransactionsApi } from "./transactions.contract";
import { transactionsApiRoutes } from "./transactions.routes";
import {
  parseInvoiceBlob,
  parseRetryResult,
  parseTransactionId,
  parseTransactionsList,
} from "./transactions.schema";

function apiUrl(path: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${path}`;
  }

  return path;
}

async function readJsonResponse(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new Error(`Failed to parse JSON response: ${response.status}`);
  }
}

export async function listTransactions(): Promise<Transaction[]> {
  const response = await fetch(apiUrl(transactionsApiRoutes.list));

  if (!response.ok) {
    throw new Error(`Failed to load transactions: ${response.status}`);
  }

  return parseTransactionsList(await readJsonResponse(response));
}

export async function generateInvoice(id: string): Promise<Blob> {
  const transactionId = parseTransactionId(id);
  const response = await fetch(apiUrl(transactionsApiRoutes.invoice(transactionId)));

  if (!response.ok) {
    throw new Error(`Failed to generate invoice: ${response.status}`);
  }

  return parseInvoiceBlob(await response.blob());
}

export async function retryPayment(id: string): Promise<RetryResult> {
  const transactionId = parseTransactionId(id);
  const response = await fetch(apiUrl(transactionsApiRoutes.retry(transactionId)), {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Failed to retry payment: ${response.status}`);
  }

  return parseRetryResult(await readJsonResponse(response));
}

export const transactionsHttpApi = {
  listTransactions,
  generateInvoice,
  retryPayment,
} satisfies TransactionsApi;
