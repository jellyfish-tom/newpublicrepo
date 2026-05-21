import { http, HttpResponse } from "msw";
import type { RetryResult } from "@/lib/api/transactions.contract";
import { transactionsApiMswPatterns } from "@/lib/api/transactions.routes";
import type { Transaction } from "@/features/transactions/model/types";

interface InvoiceParams {
  id: string;
}

interface RetryParams {
  id: string;
}

const defaultInvoiceBlob = new Blob([new Uint8Array([0x25, 0x50, 0x44, 0x46])], {
  type: "application/pdf",
});

export const handlers = [
  http.get(transactionsApiMswPatterns.list, () => HttpResponse.json<Transaction[]>([])),
  http.get<InvoiceParams>(
    transactionsApiMswPatterns.invoice,
    ({ params }) =>
      new HttpResponse(defaultInvoiceBlob, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="invoice-${params["id"]}.pdf"`,
        },
      }),
  ),
  http.post<RetryParams>(transactionsApiMswPatterns.retry, ({ params }) =>
    HttpResponse.json<RetryResult>({ id: params["id"], status: "success" }),
  ),
];
