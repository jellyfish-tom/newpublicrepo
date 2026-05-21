import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { RetryResult } from "@/lib/api/transactions.contract";
import { transactionsApiMswPatterns } from "@/lib/api/transactions.routes";
import { mswServer } from "@/test/msw/server";
import type { Transaction } from "./model/types";

vi.mock("sonner", () => ({
  toast: Object.assign(() => undefined, {
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

import { TransactionsView } from "./TransactionsView";

function buildSeed(): Transaction[] {
  return [
    {
      id: "TX-A",
      amount: 1000,
      currency: "USD",
      createdAt: "2026-05-10T10:00:00.000Z",
      description: "Plan A",
      paymentMethod: "Visa",
      status: "failed",
    },
    {
      id: "TX-B",
      amount: 2000,
      currency: "USD",
      createdAt: "2026-05-11T10:00:00.000Z",
      description: "Plan B",
      paymentMethod: "Visa",
      status: "failed",
    },
    {
      id: "TX-C",
      amount: 3000,
      currency: "USD",
      createdAt: "2026-05-12T10:00:00.000Z",
      description: "Plan C",
      paymentMethod: "Visa",
      status: "success",
    },
  ];
}

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
}

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });

  return { promise, resolve };
}

describe("TransactionsView integration", () => {
  it("retries selected rows concurrently and updates each independently", async () => {
    const user = userEvent.setup();

    const deferredA = deferred<RetryResult>();
    const deferredB = deferred<RetryResult>();

    mswServer.use(
      http.post(transactionsApiMswPatterns.retry, async ({ params }) => {
        const id = String(params["id"]);

        if (id === "TX-A") {
          const result = await deferredA.promise;

          return HttpResponse.json(result);
        }

        if (id === "TX-B") {
          const result = await deferredB.promise;

          return HttpResponse.json(result);
        }

        return HttpResponse.json({ id, status: "failed" }, { status: 500 });
      }),
    );

    render(<TransactionsView initialTransactions={buildSeed()} />);

    await user.click(screen.getByRole("checkbox", { name: /select transaction TX-A/i }));
    await user.click(screen.getByRole("checkbox", { name: /select transaction TX-B/i }));

    await user.click(screen.getByRole("button", { name: /retry selected \(2\)/i }));

    const rowA = screen.getByRole("row", { name: /TX-A/ });
    const rowB = screen.getByRole("row", { name: /TX-B/ });

    expect(rowA).toHaveAttribute("aria-busy", "true");
    expect(rowB).toHaveAttribute("aria-busy", "true");

    await act(async () => {
      deferredA.resolve({ id: "TX-A", status: "success" });
      await deferredA.promise;
    });

    await vi.waitFor(() => {
      const refreshedRowA = screen.getByRole("row", { name: /TX-A/ });

      expect(refreshedRowA).not.toHaveAttribute("aria-busy");
      expect(within(refreshedRowA).getByText("Success")).toBeInTheDocument();
    });

    const stillRetryingRowB = screen.getByRole("row", { name: /TX-B/ });

    expect(stillRetryingRowB).toHaveAttribute("aria-busy", "true");

    await act(async () => {
      deferredB.resolve({ id: "TX-B", status: "failed" });
      await deferredB.promise;
    });

    await vi.waitFor(() => {
      const refreshedRowB = screen.getByRole("row", { name: /TX-B/ });

      expect(refreshedRowB).not.toHaveAttribute("aria-busy");
      expect(within(refreshedRowB).getByText("Failed")).toBeInTheDocument();
    });
  });
});
