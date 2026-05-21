import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API_ERROR_CODES, isApiError } from "./api-error";
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

    await expect(listTransactions()).rejects.toSatisfy((error: unknown) => {
      const isValidationError =
        isApiError(error) && error.code === API_ERROR_CODES.VALIDATION;

      return isValidationError;
    });
  });

  it("maps structured API errors from failed responses", async () => {
    mswServer.use(
      http.get(transactionsApiMswPatterns.list, () =>
        HttpResponse.json(
          { code: API_ERROR_CODES.UPSTREAM, message: "Service unavailable." },
          { status: 503 },
        ),
      ),
    );

    await expect(listTransactions()).rejects.toSatisfy((error: unknown) => {
      const isStructuredUpstreamError =
        isApiError(error) &&
        error.code === API_ERROR_CODES.UPSTREAM &&
        error.message === "Service unavailable." &&
        error.status === 503;

      return isStructuredUpstreamError;
    });
  });

  it("rejects malformed retry responses", async () => {
    mswServer.use(
      http.post(transactionsApiMswPatterns.retry, () =>
        HttpResponse.json({ id: "TX-1", status: "pending" }),
      ),
    );

    await expect(retryPayment("TX-1")).rejects.toSatisfy((error: unknown) => {
      const isValidationError =
        isApiError(error) && error.code === API_ERROR_CODES.VALIDATION;

      return isValidationError;
    });
  });
});
