import { z } from "zod";
import type { Transaction } from "@/features/transactions/model/types";
import type { RetryResult } from "./transactions.contract";

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

export function parseTransactionId(value: string): string {
  return transactionIdSchema.parse(value);
}

export function parseTransactionsList(value: unknown): Transaction[] {
  return transactionsListSchema.parse(value);
}

export function parseRetryResult(value: unknown): RetryResult {
  return retryResultSchema.parse(value);
}

export function parseInvoiceBlob(blob: Blob): Blob {
  if (blob.type !== PDF_MIME_TYPE) {
    throw new Error(`Expected ${PDF_MIME_TYPE}, received ${blob.type || "unknown"}`);
  }

  if (blob.size === 0) {
    throw new Error("Invoice blob is empty");
  }

  return blob;
}
