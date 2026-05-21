import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createSeededRandom,
  generateInvoice,
  listTransactions,
  retryPayment,
} from "./transactions.mock";

describe("transactions mock", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns a cloned copy of seed transactions", async () => {
    const promise = listTransactions();

    await vi.advanceTimersByTimeAsync(500);
    const first = await promise;

    const secondPromise = listTransactions();

    await vi.advanceTimersByTimeAsync(500);
    const second = await secondPromise;

    expect(first).not.toBe(second);
    expect(first[0]).not.toBe(second[0]);
    expect(first[0]?.id).toBe(second[0]?.id);
  });

  it("returns a Blob with PDF mime type from generateInvoice", async () => {
    const promise = generateInvoice("TX-1");

    await vi.advanceTimersByTimeAsync(2000);
    const blob = await promise;

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("application/pdf");
    expect(blob.size).toBeGreaterThan(0);
  });

  it("respects the failure rate with a deterministic RNG", async () => {
    const random = createSeededRandom(42);

    const promises = Array.from({ length: 50 }, () => retryPayment("TX", random));

    await vi.advanceTimersByTimeAsync(5000);
    const results = await Promise.all(promises);

    const failureCount = results.filter((entry) => entry.status === "failed").length;

    expect(failureCount).toBeGreaterThan(0);
    expect(failureCount).toBeLessThan(results.length);
  });
});
