import { generateInvoice } from "@/lib/api/transactions.mock";
import { runRoute } from "@/lib/api/api-error";
import { parseTransactionId } from "@/lib/api/transactions.schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  return runRoute(async () => {
    const { id } = await params;
    const transactionId = parseTransactionId(id);
    const blob = await generateInvoice(transactionId);

    return new Response(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${transactionId}.pdf"`,
      },
    });
  });
}
