import { describe, expect, it } from "vitest";
import { filterAndSort } from "./filter-and-sort";
import type { FilterState, SortState, Transaction } from "./types";

function buildTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: "TX-1",
    amount: 1000,
    currency: "USD",
    createdAt: "2026-01-01T00:00:00.000Z",
    description: "Premium Plan",
    paymentMethod: "Visa **** 4242",
    status: "success",
    ...overrides,
  };
}

const baseFilter: FilterState = { status: "all", query: "" };
const baseSort: SortState = { key: "createdAt", direction: "desc" };

describe("filterAndSort", () => {
  it("filters by status when filter is not 'all'", () => {
    const transactions = [
      buildTransaction({ id: "TX-1", status: "success" }),
      buildTransaction({ id: "TX-2", status: "failed" }),
      buildTransaction({ id: "TX-3", status: "pending" }),
    ];

    const result = filterAndSort(
      transactions,
      { ...baseFilter, status: "failed" },
      baseSort,
    );

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("TX-2");
  });

  it("matches query against id, description, and payment method", () => {
    const transactions = [
      buildTransaction({ id: "TX-1", description: "Foo" }),
      buildTransaction({ id: "TX-2", description: "Bar" }),
      buildTransaction({ id: "TX-3", description: "Baz", paymentMethod: "FooPay" }),
    ];

    const byDescription = filterAndSort(
      transactions,
      { ...baseFilter, query: "Bar" },
      baseSort,
    );

    expect(byDescription.map((entry) => entry.id)).toEqual(["TX-2"]);

    const byPaymentMethod = filterAndSort(
      transactions,
      { ...baseFilter, query: "foopay" },
      baseSort,
    );

    expect(byPaymentMethod.map((entry) => entry.id)).toEqual(["TX-3"]);
  });

  it("sorts by amount ascending and descending", () => {
    const transactions = [
      buildTransaction({ id: "TX-1", amount: 200 }),
      buildTransaction({ id: "TX-2", amount: 100 }),
      buildTransaction({ id: "TX-3", amount: 300 }),
    ];

    const asc = filterAndSort(transactions, baseFilter, {
      key: "amount",
      direction: "asc",
    });

    expect(asc.map((entry) => entry.id)).toEqual(["TX-2", "TX-1", "TX-3"]);

    const desc = filterAndSort(transactions, baseFilter, {
      key: "amount",
      direction: "desc",
    });

    expect(desc.map((entry) => entry.id)).toEqual(["TX-3", "TX-1", "TX-2"]);
  });

  it("sorts ISO createdAt lexically (matches chronological)", () => {
    const transactions = [
      buildTransaction({ id: "TX-1", createdAt: "2026-03-01T00:00:00.000Z" }),
      buildTransaction({ id: "TX-2", createdAt: "2026-01-01T00:00:00.000Z" }),
      buildTransaction({ id: "TX-3", createdAt: "2026-02-01T00:00:00.000Z" }),
    ];

    const desc = filterAndSort(transactions, baseFilter, baseSort);

    expect(desc.map((entry) => entry.id)).toEqual(["TX-1", "TX-3", "TX-2"]);
  });

  it("does not mutate the input array", () => {
    const transactions = [
      buildTransaction({ id: "TX-1", amount: 200 }),
      buildTransaction({ id: "TX-2", amount: 100 }),
    ];
    const snapshot = transactions.map((entry) => entry.id);

    filterAndSort(transactions, baseFilter, { key: "amount", direction: "asc" });

    expect(transactions.map((entry) => entry.id)).toEqual(snapshot);
  });
});
