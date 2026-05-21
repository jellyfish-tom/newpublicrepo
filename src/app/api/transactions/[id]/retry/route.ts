import { NextResponse } from "next/server";
import { retryPayment } from "@/lib/api/transactions.mock";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const result = await retryPayment(id);

  return NextResponse.json(result);
}
