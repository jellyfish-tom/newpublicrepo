import { TransactionsView } from "@/features/transactions/TransactionsView";
import { listTransactions } from "@/lib/api";

export async function TransactionsLoader() {
  const transactions = await listTransactions();

  return <TransactionsView initialTransactions={transactions} />;
}
