import { listTransactions } from "@/lib/api/transactions.mock";
import { runRoute } from "@/lib/api/api-error";
import { parseTransactionsList } from "@/lib/api/transactions.schema";

export async function GET() {
  return runRoute(async () => {
    const transactions = parseTransactionsList(await listTransactions());

    return Response.json(transactions);
  });
}
