import { NextResponse } from "next/server";
import { generateInvoice } from "@/lib/api/transactions.mock";
import { transactionIdSchema } from "@/lib/api/transactions.schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const parsedId = transactionIdSchema.safeParse(id);

  if (!parsedId.success) {
    return NextResponse.json({ message: "Invalid transaction id" }, { status: 400 });
  }

  const blob = await generateInvoice(parsedId.data);

  return new Response(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${parsedId.data}.pdf"`,
    },
  });
}
