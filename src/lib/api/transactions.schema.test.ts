import { describe, expect, it } from "vitest";
import { API_ERROR_CODES, isApiError } from "./api-error";
import {
  parseInvoiceBlob,
  parseRetryResult,
  parseTransactionId,
  parseTransactionsList,
} from "./transactions.schema";

describe("transactions schema", () => {
  const validTransaction = {
    id: "TX-1",
    amount: 1000,
    currency: "USD",
    createdAt: "2026-05-10T10:00:00.000Z",
    description: "Plan A",
    paymentMethod: "Visa **** 4242",
    status: "failed",
  } as const;

  it("parses a valid transaction id", () => {
    expect(parseTransactionId(" TX-1 ")).toBe("TX-1");
  });

  it("rejects an empty transaction id", () => {
    try {
      parseTransactionId("   ");
      expect.fail("Expected parseTransactionId to throw");
    } catch (error) {
      expect(isApiError(error)).toBe(true);
      if (isApiError(error)) {
        expect(error.code).toBe(API_ERROR_CODES.INVALID_INPUT);
        expect(error.status).toBe(400);
      }
    }
  });

  it("parses a valid transactions list", () => {
    expect(parseTransactionsList([validTransaction])).toEqual([validTransaction]);
  });

  it("rejects malformed transaction payloads", () => {
    try {
      parseTransactionsList([{ ...validTransaction, amount: -1 }]);
      expect.fail("Expected parseTransactionsList to throw");
    } catch (error) {
      expect(isApiError(error)).toBe(true);
      if (isApiError(error)) {
        expect(error.code).toBe(API_ERROR_CODES.VALIDATION);
      }
    }

    try {
      parseTransactionsList({ items: [validTransaction] });
      expect.fail("Expected parseTransactionsList to throw");
    } catch (error) {
      expect(isApiError(error)).toBe(true);
    }
  });

  it("parses a valid retry result", () => {
    expect(parseRetryResult({ id: "TX-1", status: "success" })).toEqual({
      id: "TX-1",
      status: "success",
    });
  });

  it("rejects retry results with pending status", () => {
    try {
      parseRetryResult({ id: "TX-1", status: "pending" });
      expect.fail("Expected parseRetryResult to throw");
    } catch (error) {
      expect(isApiError(error)).toBe(true);
      if (isApiError(error)) {
        expect(error.code).toBe(API_ERROR_CODES.VALIDATION);
      }
    }
  });

  it("accepts only pdf blobs with content", () => {
    const blob = new Blob(["%PDF"], { type: "application/pdf" });

    expect(parseInvoiceBlob(blob)).toBe(blob);
  });

  it("rejects empty or non-pdf invoice blobs", () => {
    expect(() => parseInvoiceBlob(new Blob([], { type: "application/pdf" }))).toThrow();
    expect(() => parseInvoiceBlob(new Blob(["x"], { type: "text/plain" }))).toThrow();
  });
});
