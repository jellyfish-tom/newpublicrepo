import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { listTransactions, retryPayment } from "./transactions.client";
import { transactionsApiMswPatterns } from "./transactions.routes";
import { mswServer } from "@/test/msw/server";

describe("transactions client", () => {
  it("parses a valid transactions list response", async () => {
    mswServer.use(
      http.get(transactionsApiMswPatterns.list, () =>
        HttpResponse.json([
          {
            id: "TX-1",
            amount: 1000,
            currency: "USD",
            createdAt: "2026-05-10T10:00:00.000Z",
            description: "Plan A",
            paymentMethod: "Visa",
            status: "failed",
          },
        ]),
      ),
    );

    await expect(listTransactions()).resolves.toEqual([
      {
        id: "TX-1",
        amount: 1000,
        currency: "USD",
        createdAt: "2026-05-10T10:00:00.000Z",
        description: "Plan A",
        paymentMethod: "Visa",
        status: "failed",
      },
    ]);
  });

  it("rejects malformed transactions list responses", async () => {
    mswServer.use(
      http.get(transactionsApiMswPatterns.list, () =>
        HttpResponse.json([{ id: "TX-1", status: "failed" }]),
      ),
    );

    await expect(listTransactions()).rejects.toThrow();
  });

  it("rejects malformed retry responses", async () => {
    mswServer.use(
      http.post(transactionsApiMswPatterns.retry, () =>
        HttpResponse.json({ id: "TX-1", status: "pending" }),
      ),
    );

    await expect(retryPayment("TX-1")).rejects.toThrow();
  });
});
