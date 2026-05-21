import { describe, expect, it } from "vitest";
import type { Transaction } from "./types";
import { createInitialState, transactionsReducer } from "./transactionsReducer";

function buildTransactions(): Transaction[] {
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
      status: "success",
    },
    {
      id: "TX-3",
      amount: 1500,
      currency: "USD",
      createdAt: "2026-05-09T10:00:00.000Z",
      description: "Plan C",
      paymentMethod: "Visa",
      status: "failed",
    },
  ];
}

describe("transactionsReducer", () => {
  it("only allows selecting failed transactions", () => {
    const initial = createInitialState(buildTransactions());
    const afterSelectSuccess = transactionsReducer(initial, {
      type: "TOGGLE_SELECT",
      id: "TX-2",
    });

    expect(afterSelectSuccess.selectedIds.size).toBe(0);

    const afterSelectFailed = transactionsReducer(initial, {
      type: "TOGGLE_SELECT",
      id: "TX-1",
    });

    expect(afterSelectFailed.selectedIds.has("TX-1")).toBe(true);
  });

  it("toggles selection off when selecting again", () => {
    const initial = createInitialState(buildTransactions());
    const selected = transactionsReducer(initial, {
      type: "TOGGLE_SELECT",
      id: "TX-1",
    });
    const deselected = transactionsReducer(selected, {
      type: "TOGGLE_SELECT",
      id: "TX-1",
    });

    expect(deselected.selectedIds.has("TX-1")).toBe(false);
  });

  it("selects only failed and not-retrying transactions on SELECT_ALL_FAILED", () => {
    const initial = createInitialState(buildTransactions());
    const retrying = transactionsReducer(initial, {
      type: "START_RETRY",
      ids: ["TX-1"],
    });
    const allFailed = transactionsReducer(retrying, { type: "SELECT_ALL_FAILED" });

    expect(allFailed.selectedIds.has("TX-1")).toBe(false);
    expect(allFailed.selectedIds.has("TX-3")).toBe(true);
    expect(allFailed.selectedIds.size).toBe(1);
  });

  it("optimistically adds ids to retryingIds and clears selection on START_RETRY", () => {
    let state = createInitialState(buildTransactions());

    state = transactionsReducer(state, { type: "TOGGLE_SELECT", id: "TX-1" });
    state = transactionsReducer(state, { type: "TOGGLE_SELECT", id: "TX-3" });
    state = transactionsReducer(state, {
      type: "START_RETRY",
      ids: Array.from(state.selectedIds),
    });
    expect(state.retryingIds.has("TX-1")).toBe(true);
    expect(state.retryingIds.has("TX-3")).toBe(true);
    expect(state.selectedIds.size).toBe(0);
  });

  it("resolves a single retry independently of others", () => {
    let state = createInitialState(buildTransactions());

    state = transactionsReducer(state, {
      type: "START_RETRY",
      ids: ["TX-1", "TX-3"],
    });
    state = transactionsReducer(state, {
      type: "RESOLVE_RETRY",
      id: "TX-1",
      nextStatus: "success",
    });

    expect(state.retryingIds.has("TX-1")).toBe(false);
    expect(state.retryingIds.has("TX-3")).toBe(true);
    expect(state.transactions.find((entry) => entry.id === "TX-1")?.status).toBe(
      "success",
    );
    expect(state.transactions.find((entry) => entry.id === "TX-3")?.status).toBe(
      "failed",
    );
  });

  it("toggles sort direction when re-clicking the same key", () => {
    let state = createInitialState(buildTransactions());

    expect(state.sort.direction).toBe("desc");
    state = transactionsReducer(state, { type: "SET_SORT", key: "createdAt" });
    expect(state.sort.direction).toBe("asc");
    state = transactionsReducer(state, { type: "SET_SORT", key: "amount" });
    expect(state.sort).toEqual({ key: "amount", direction: "desc" });
  });
});
