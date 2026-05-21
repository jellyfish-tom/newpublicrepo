import type { Transaction } from "@/features/transactions/model/types";
import type { RetryResult, TransactionsApi } from "./transactions.contract";
import {
  parseRetryResult,
  parseTransactionId,
  parseTransactionsList,
  transactionsListSchema,
} from "./transactions.schema";
import { SEED_TRANSACTIONS } from "./transactions.seed";

const seedSchema = transactionsListSchema;

const VALIDATED_SEED: ReadonlyArray<Transaction> = seedSchema.parse(SEED_TRANSACTIONS);

const LIST_LATENCY_MS = 300;
const INVOICE_LATENCY_MS = 2000;
const RETRY_MIN_LATENCY_MS = 1000;
const RETRY_LATENCY_RANGE_MS = 3000;
const RETRY_FAILURE_RATE = 0.2;

interface RandomSource {
  next: () => number;
}

const defaultRandom: RandomSource = { next: Math.random };

export function createSeededRandom(seed: number): RandomSource {
  const normalizedSeed = seed >>> 0;
  const initialState = normalizedSeed === 0 ? 1 : normalizedSeed;
  let state = initialState;

  return {
    next: () => {
      state = (state * 1664525 + 1013904223) >>> 0;

      return state / 0x100000000;
    },
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function listTransactions(): Promise<Transaction[]> {
  await delay(LIST_LATENCY_MS);

  return parseTransactionsList(VALIDATED_SEED.map((transaction) => ({ ...transaction })));
}

export async function generateInvoice(id: string): Promise<Blob> {
  const transactionId = parseTransactionId(id);

  await delay(INVOICE_LATENCY_MS);
  const payload = buildInvoiceText(transactionId);

  return new Blob([payload], { type: "application/pdf" });
}

export async function retryPayment(
  id: string,
  random: RandomSource = defaultRandom,
): Promise<RetryResult> {
  const transactionId = parseTransactionId(id);
  const latency = RETRY_MIN_LATENCY_MS + random.next() * RETRY_LATENCY_RANGE_MS;

  await delay(latency);
  const status: RetryResult["status"] =
    random.next() < RETRY_FAILURE_RATE ? "failed" : "success";

  return parseRetryResult({ id: transactionId, status });
}

function buildInvoiceText(id: string): string {
  const generatedAt = new Date().toISOString();

  return [
    "%PDF-1.4",
    `% Cleeng mock invoice for ${id}`,
    `% Generated at ${generatedAt}`,
    "1 0 obj << /Type /Catalog >> endobj",
    "trailer << /Root 1 0 R >>",
    "%%EOF",
  ].join("\n");
}

export const transactionsMockApi = {
  listTransactions,
  generateInvoice,
  retryPayment,
} satisfies TransactionsApi;
