"use client";

import { useCallback, useMemo } from "react";
import { retryPayment, type RetryResult } from "@/lib/api";
import type { TransactionsState } from "./transactionsReducer";
import type { Currency, SortKey, Transaction, TransactionStatus } from "./types";
import { useTransactionsSelectors } from "./useTransactionsSelectors";
import { useTransactionsState } from "./useTransactionsState";

interface UseTransactionsManagerOptions {
  initialTransactions: Transaction[];
  retry?: (id: string) => Promise<RetryResult>;
  onRetryComplete?: (summary: RetrySummary) => void;
}

export interface RetrySummary {
  attempted: number;
  succeeded: number;
  failed: number;
}

export interface TransactionsManager {
  state: TransactionsState;
  visibleTransactions: Transaction[];
  failedCount: number;
  selectableFailedCount: number;
  totalSpendByCurrency: Map<Currency, number>;
  toggleSelect: (id: string) => void;
  selectAllFailed: () => void;
  clearSelection: () => void;
  setStatusFilter: (status: TransactionStatus | "all") => void;
  setQuery: (query: string) => void;
  toggleSort: (key: SortKey) => void;
  setDisplayCurrency: (currency: Currency) => void;
  retrySelected: (ids: ReadonlyArray<string>) => Promise<RetrySummary>;
  isRowRetrying: (id: string) => boolean;
  isRowSelected: (id: string) => boolean;
}

const EMPTY_SUMMARY: RetrySummary = { attempted: 0, succeeded: 0, failed: 0 };

export function useTransactionsManager({
  initialTransactions,
  retry = retryPayment,
  onRetryComplete,
}: UseTransactionsManagerOptions): TransactionsManager {
  const { state, actions } = useTransactionsState(initialTransactions);
  const selectors = useTransactionsSelectors(state);

  const retrySelected = useCallback(
    async (ids: ReadonlyArray<string>): Promise<RetrySummary> => {
      if (ids.length === 0) {
        return EMPTY_SUMMARY;
      }

      actions.startRetry(ids);

      const settledResults = await Promise.allSettled(
        ids.map(async (id) => {
          const result = await retry(id);

          actions.resolveRetry(id, result.status);

          return result;
        }),
      );

      let succeeded = 0;
      let failed = 0;

      for (const [index, settled] of settledResults.entries()) {
        const retryFulfilled = settled.status === "fulfilled";
        const retrySucceeded = retryFulfilled && settled.value.status === "success";

        if (retrySucceeded) {
          succeeded += 1;
          continue;
        }

        failed += 1;
        if (settled.status === "rejected") {
          const id = ids[index];

          if (id) {
            actions.resolveRetry(id, "failed");
          }
        }
      }

      const summary: RetrySummary = { attempted: ids.length, succeeded, failed };

      onRetryComplete?.(summary);

      return summary;
    },
    [retry, actions, onRetryComplete],
  );

  return useMemo<TransactionsManager>(
    () => ({
      state,
      visibleTransactions: selectors.visibleTransactions,
      failedCount: selectors.failedCount,
      selectableFailedCount: selectors.selectableFailedCount,
      totalSpendByCurrency: selectors.totalSpendByCurrency,
      toggleSelect: actions.toggleSelect,
      selectAllFailed: actions.selectAllFailed,
      clearSelection: actions.clearSelection,
      setStatusFilter: actions.setStatusFilter,
      setQuery: actions.setQuery,
      toggleSort: actions.toggleSort,
      setDisplayCurrency: actions.setDisplayCurrency,
      retrySelected,
      isRowRetrying: selectors.isRowRetrying,
      isRowSelected: selectors.isRowSelected,
    }),
    [state, selectors, actions, retrySelected],
  );
}
