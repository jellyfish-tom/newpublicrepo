import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { RetryResult } from "@/lib/api/transactions.contract";
import type { Transaction } from "./types";
import { useTransactionsManager } from "./useTransactionsManager";

function buildSeed(): Transaction[] {
  return [
    {
      id: "TX-1",
      amount: 1000,
      currency: "USD",
      createdAt: "2026-05-10T10:00:00.000Z",
      description: "Plan A",
      paymentMethod: "Visa",
      status: "failed",
    },
    {
      id: "TX-2",
      amount: 2000,
      currency: "USD",
      createdAt: "2026-05-11T10:00:00.000Z",
      description: "Plan B",
      paymentMethod: "Visa",
      status: "failed",
    },
    {
      id: "TX-3",
      amount: 3000,
      currency: "USD",
      createdAt: "2026-05-12T10:00:00.000Z",
      description: "Plan C",
      paymentMethod: "Visa",
      status: "failed",
    },
  ];
}

describe("useTransactionsManager.retrySelected", () => {
  it("returns an empty summary and does not call retry when no ids are passed", async () => {
    const retry = vi.fn();
    const onRetryComplete = vi.fn();
    const { result } = renderHook(() =>
      useTransactionsManager({
        initialTransactions: buildSeed(),
        retry,
        onRetryComplete,
      }),
    );

    let summary;

    await act(async () => {
      summary = await result.current.retrySelected([]);
    });

    expect(summary).toEqual({ attempted: 0, succeeded: 0, failed: 0 });
    expect(retry).not.toHaveBeenCalled();
    expect(onRetryComplete).not.toHaveBeenCalled();
  });

  it("counts every rejection as failed and still calls onRetryComplete", async () => {
    const retry = vi.fn().mockRejectedValue(new Error("network"));
    const onRetryComplete = vi.fn();
    const { result } = renderHook(() =>
      useTransactionsManager({
        initialTransactions: buildSeed(),
        retry,
        onRetryComplete,
      }),
    );

    let summary;

    await act(async () => {
      summary = await result.current.retrySelected(["TX-1", "TX-2"]);
    });

    expect(summary).toEqual({ attempted: 2, succeeded: 0, failed: 2 });
    expect(retry).toHaveBeenCalledTimes(2);
    expect(onRetryComplete).toHaveBeenCalledWith({
      attempted: 2,
      succeeded: 0,
      failed: 2,
    });
    expect(
      result.current.state.transactions.find((entry) => entry.id === "TX-1")?.status,
    ).toBe("failed");
  });

  it("mixes successes and failures and resolves each id independently", async () => {
    const retry = vi.fn().mockImplementation(async (id: string): Promise<RetryResult> => {
      if (id === "TX-1") {
        return { id, status: "success" };
      }

      throw new Error("nope");
    });
    const onRetryComplete = vi.fn();
    const { result } = renderHook(() =>
      useTransactionsManager({
        initialTransactions: buildSeed(),
        retry,
        onRetryComplete,
      }),
    );

    let summary;

    await act(async () => {
      summary = await result.current.retrySelected(["TX-1", "TX-2"]);
    });

    expect(summary).toEqual({ attempted: 2, succeeded: 1, failed: 1 });
    expect(onRetryComplete).toHaveBeenCalledWith({
      attempted: 2,
      succeeded: 1,
      failed: 1,
    });

    const tx1 = result.current.state.transactions.find((entry) => entry.id === "TX-1");
    const tx2 = result.current.state.transactions.find((entry) => entry.id === "TX-2");

    expect(tx1?.status).toBe("success");
    expect(tx2?.status).toBe("failed");
  });
});
