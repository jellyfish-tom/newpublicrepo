"use client";

import { useMemo } from "react";
import { filterAndSort } from "./filter-and-sort";
import type { TransactionsState } from "./transactionsReducer";
import type { Currency, Transaction } from "./types";

export interface TransactionsSelectors {
  visibleTransactions: Transaction[];
  failedCount: number;
  selectableFailedCount: number;
  totalSpendByCurrency: Map<Currency, number>;
  isRowSelected: (id: string) => boolean;
  isRowRetrying: (id: string) => boolean;
}

export function useTransactionsSelectors(
  state: TransactionsState,
): TransactionsSelectors {
  const visibleTransactions = useMemo(
    () => filterAndSort(state.transactions, state.filter, state.sort),
    [state.transactions, state.filter, state.sort],
  );

  const failedCount = useMemo(
    () => state.transactions.filter((entry) => entry.status === "failed").length,
    [state.transactions],
  );

  const selectableFailedCount = useMemo(
    () =>
      state.transactions.filter((entry) => {
        const isFailedTransaction = entry.status === "failed";
        const isRetryInProgress = state.retryingIds.has(entry.id);
        const isSelectableFailedTransaction = isFailedTransaction && !isRetryInProgress;

        return isSelectableFailedTransaction;
      }).length,
    [state.transactions, state.retryingIds],
  );

  const totalSpendByCurrency = useMemo(() => {
    const totals = new Map<Currency, number>();

    for (const entry of state.transactions) {
      if (entry.status !== "success") {
        continue;
      }

      totals.set(entry.currency, (totals.get(entry.currency) ?? 0) + entry.amount);
    }

    return totals;
  }, [state.transactions]);

  return useMemo(
    () => ({
      visibleTransactions,
      failedCount,
      selectableFailedCount,
      totalSpendByCurrency,
      isRowSelected: (id: string) => state.selectedIds.has(id),
      isRowRetrying: (id: string) => state.retryingIds.has(id),
    }),
    [
      visibleTransactions,
      failedCount,
      selectableFailedCount,
      totalSpendByCurrency,
      state.selectedIds,
      state.retryingIds,
    ],
  );
}
