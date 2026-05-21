import type { Transaction } from "@/features/transactions/model/types";
import { TransactionsView } from "@/features/transactions/TransactionsView";
import { TransactionsLoadError } from "@/features/transactions/components/TransactionsLoadError";
import { listTransactions } from "@/lib/api";
import { toUserMessage } from "@/lib/api/api-error";
import { parseTransactionsList } from "@/lib/api/transactions.schema";

type LoadTransactionsResult =
  | { ok: true; transactions: Transaction[] }
  | { ok: false; message: string };

async function loadInitialTransactions(): Promise<LoadTransactionsResult> {
  try {
    const transactions = parseTransactionsList(await listTransactions());

    return { ok: true, transactions };
  } catch (error) {
    return { ok: false, message: toUserMessage(error) };
  }
}

export async function TransactionsLoader() {
  const result = await loadInitialTransactions();

  if (!result.ok) {
    return <TransactionsLoadError message={result.message} />;
  }

  return <TransactionsView initialTransactions={result.transactions} />;
}
