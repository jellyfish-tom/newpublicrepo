import { TransactionsView } from "@/features/transactions/TransactionsView";
import { listTransactions } from "@/lib/api";
import { parseTransactionsList } from "@/lib/api/transactions.schema";

export async function TransactionsLoader() {
  const transactions = parseTransactionsList(await listTransactions());

  return <TransactionsView initialTransactions={transactions} />;
}
