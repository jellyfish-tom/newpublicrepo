import { NextResponse } from "next/server";
import { listTransactions } from "@/lib/api/transactions.mock";

export async function GET() {
  const transactions = await listTransactions();

  return NextResponse.json(transactions);
}
