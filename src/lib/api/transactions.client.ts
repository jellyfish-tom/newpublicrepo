import type { Transaction } from "@/features/transactions/model/types";
import type { RetryResult, TransactionsApi } from "./transactions.contract";
import { API_ERROR_CODES, ApiError, apiErrorFromResponse } from "./api-error";
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
  } catch (cause) {
    throw new ApiError(
      API_ERROR_CODES.VALIDATION,
      "The server returned unexpected data.",
      response.status,
      { cause },
    );
  }
}

export async function listTransactions(): Promise<Transaction[]> {
  const response = await fetch(apiUrl(transactionsApiRoutes.list));

  if (!response.ok) {
    throw await apiErrorFromResponse(response);
  }

  return parseTransactionsList(await readJsonResponse(response));
}

export async function generateInvoice(id: string): Promise<Blob> {
  const transactionId = parseTransactionId(id);
  const response = await fetch(apiUrl(transactionsApiRoutes.invoice(transactionId)));

  if (!response.ok) {
    throw await apiErrorFromResponse(response);
  }

  return parseInvoiceBlob(await response.blob());
}

export async function retryPayment(id: string): Promise<RetryResult> {
  const transactionId = parseTransactionId(id);
  const response = await fetch(apiUrl(transactionsApiRoutes.retry(transactionId)), {
    method: "POST",
  });

  if (!response.ok) {
    throw await apiErrorFromResponse(response);
  }

  return parseRetryResult(await readJsonResponse(response));
}

export const transactionsHttpApi = {
  listTransactions,
  generateInvoice,
  retryPayment,
} satisfies TransactionsApi;
