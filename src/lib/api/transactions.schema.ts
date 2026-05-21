import { z } from "zod";
import type { Transaction } from "@/features/transactions/model/types";
import type { RetryResult } from "./transactions.contract";
import { API_ERROR_CODES, ApiError } from "./api-error";

export const transactionIdSchema = z.string().trim().min(1);

export const transactionSchema = z.object({
  id: z.string(),
  amount: z.number().int().nonnegative(),
  currency: z.enum(["USD", "EUR", "GBP"]),
  createdAt: z.string().datetime(),
  description: z.string(),
  paymentMethod: z.string(),
  status: z.enum(["success", "failed", "pending"]),
}) satisfies z.ZodType<Transaction>;

export const transactionsListSchema = z.array(transactionSchema);

export const retryResultSchema = z.object({
  id: z.string(),
  status: z.enum(["success", "failed"]),
}) satisfies z.ZodType<RetryResult>;

const PDF_MIME_TYPE = "application/pdf";

function validationError(cause: z.ZodError): ApiError {
  return new ApiError(
    API_ERROR_CODES.VALIDATION,
    "The server returned unexpected data.",
    422,
    { cause },
  );
}

export function parseTransactionId(value: string): string {
  const parsed = transactionIdSchema.safeParse(value);

  if (!parsed.success) {
    throw new ApiError(API_ERROR_CODES.INVALID_INPUT, "Invalid transaction id.", 400, {
      cause: parsed.error,
    });
  }

  return parsed.data;
}

export function parseTransactionsList(value: unknown): Transaction[] {
  const parsed = transactionsListSchema.safeParse(value);

  if (!parsed.success) {
    throw validationError(parsed.error);
  }

  return parsed.data;
}

export function parseRetryResult(value: unknown): RetryResult {
  const parsed = retryResultSchema.safeParse(value);

  if (!parsed.success) {
    throw validationError(parsed.error);
  }

  return parsed.data;
}

export function parseInvoiceBlob(blob: Blob): Blob {
  if (blob.type !== PDF_MIME_TYPE) {
    throw new ApiError(
      API_ERROR_CODES.VALIDATION,
      "Invalid invoice format received.",
      422,
    );
  }

  if (blob.size === 0) {
    throw new ApiError(API_ERROR_CODES.VALIDATION, "Invoice file is empty.", 422);
  }

  return blob;
}
