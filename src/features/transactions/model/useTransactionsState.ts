"use client";

import { useCallback, useMemo, useReducer } from "react";
import {
  createInitialState,
  transactionsReducer,
  type TransactionsState,
} from "./transactionsReducer";
import type { Currency, SortKey, Transaction, TransactionStatus } from "./types";

export interface TransactionsActions {
  toggleSelect: (id: string) => void;
  selectAllFailed: () => void;
  clearSelection: () => void;
  setStatusFilter: (status: TransactionStatus | "all") => void;
  setQuery: (query: string) => void;
  toggleSort: (key: SortKey) => void;
  setDisplayCurrency: (currency: Currency) => void;
  startRetry: (ids: ReadonlyArray<string>) => void;
  resolveRetry: (id: string, nextStatus: "success" | "failed") => void;
}

export interface UseTransactionsStateResult {
  state: TransactionsState;
  actions: TransactionsActions;
}

export function useTransactionsState(
  initialTransactions: Transaction[],
): UseTransactionsStateResult {
  const [state, dispatch] = useReducer(
    transactionsReducer,
    initialTransactions,
    createInitialState,
  );

  const toggleSelect = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_SELECT", id });
  }, []);

  const selectAllFailed = useCallback(() => {
    dispatch({ type: "SELECT_ALL_FAILED" });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: "CLEAR_SELECTION" });
  }, []);

  const setStatusFilter = useCallback((status: TransactionStatus | "all") => {
    dispatch({ type: "SET_FILTER", filter: { status } });
  }, []);

  const setQuery = useCallback((query: string) => {
    dispatch({ type: "SET_FILTER", filter: { query } });
  }, []);

  const toggleSort = useCallback((key: SortKey) => {
    dispatch({ type: "SET_SORT", key });
  }, []);

  const setDisplayCurrency = useCallback((currency: Currency) => {
    dispatch({ type: "SET_DISPLAY_CURRENCY", currency });
  }, []);

  const startRetry = useCallback((ids: ReadonlyArray<string>) => {
    dispatch({ type: "START_RETRY", ids });
  }, []);

  const resolveRetry = useCallback((id: string, nextStatus: "success" | "failed") => {
    dispatch({ type: "RESOLVE_RETRY", id, nextStatus });
  }, []);

  const actions = useMemo<TransactionsActions>(
    () => ({
      toggleSelect,
      selectAllFailed,
      clearSelection,
      setStatusFilter,
      setQuery,
      toggleSort,
      setDisplayCurrency,
      startRetry,
      resolveRetry,
    }),
    [
      toggleSelect,
      selectAllFailed,
      clearSelection,
      setStatusFilter,
      setQuery,
      toggleSort,
      setDisplayCurrency,
      startRetry,
      resolveRetry,
    ],
  );

  return { state, actions };
}
