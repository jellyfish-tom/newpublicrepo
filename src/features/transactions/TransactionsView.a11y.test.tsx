import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import type { Transaction } from "./model/types";

vi.mock("sonner", () => ({
  toast: Object.assign(() => undefined, { success: vi.fn(), error: vi.fn() }),
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
      paymentMethod: "Visa **** 4242",
      status: "failed",
    },
    {
      id: "TX-B",
      amount: 2000,
      currency: "USD",
      createdAt: "2026-05-11T10:00:00.000Z",
      description: "Plan B",
      paymentMethod: "Mastercard **** 1234",
      status: "success",
    },
  ];
}

describe("TransactionsView accessibility", () => {
  it("renders without axe violations", async () => {
    const { container } = render(<TransactionsView initialTransactions={buildSeed()} />);
    const results = await axe(container);

    expect(results.violations).toEqual([]);
  });
});
