import { retryPayment } from "@/lib/api/transactions.mock";
import { runRoute } from "@/lib/api/api-error";
import { parseRetryResult, parseTransactionId } from "@/lib/api/transactions.schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: RouteParams) {
  return runRoute(async () => {
    const { id } = await params;
    const transactionId = parseTransactionId(id);
    const result = parseRetryResult(await retryPayment(transactionId));

    return Response.json(result);
  });
}
