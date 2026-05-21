import { NextResponse } from "next/server";
import { retryPayment } from "@/lib/api/transactions.mock";
import { parseRetryResult, transactionIdSchema } from "@/lib/api/transactions.schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const parsedId = transactionIdSchema.safeParse(id);

  if (!parsedId.success) {
    return NextResponse.json({ message: "Invalid transaction id" }, { status: 400 });
  }

  const result = parseRetryResult(await retryPayment(parsedId.data));

  return NextResponse.json(result);
}
