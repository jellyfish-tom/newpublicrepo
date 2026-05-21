import { NextResponse } from "next/server";
import { listTransactions } from "@/lib/api/transactions.mock";
import { parseTransactionsList } from "@/lib/api/transactions.schema";

export async function GET() {
  const transactions = parseTransactionsList(await listTransactions());

  return NextResponse.json(transactions);
}
