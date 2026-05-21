import type { Currency, FilterState, SortKey, SortState, Transaction } from "./types";

export interface TransactionsState {
  transactions: Transaction[];
  selectedIds: ReadonlySet<string>;
  retryingIds: ReadonlySet<string>;
  filter: FilterState;
  sort: SortState;
  displayCurrency: Currency;
}

export type TransactionsAction =
  | { type: "TOGGLE_SELECT"; id: string }
  | { type: "SELECT_ALL_FAILED" }
  | { type: "CLEAR_SELECTION" }
  | { type: "START_RETRY"; ids: ReadonlyArray<string> }
  | { type: "RESOLVE_RETRY"; id: string; nextStatus: "success" | "failed" }
  | { type: "SET_FILTER"; filter: Partial<FilterState> }
  | { type: "SET_SORT"; key: SortKey }
  | { type: "SET_DISPLAY_CURRENCY"; currency: Currency };

export function createInitialState(transactions: Transaction[]): TransactionsState {
  return {
    transactions,
    selectedIds: new Set(),
    retryingIds: new Set(),
    filter: { status: "all", query: "" },
    sort: { key: "createdAt", direction: "desc" },
    displayCurrency: "USD",
  };
}

export function transactionsReducer(
  state: TransactionsState,
  action: TransactionsAction,
): TransactionsState {
  switch (action.type) {
    case "TOGGLE_SELECT": {
      const transaction = state.transactions.find((entry) => entry.id === action.id);
      const transactionIsMissing = !transaction;
      const transactionIsNotFailed = transaction?.status !== "failed";
      const isNotSelectableFailedTransaction =
        transactionIsMissing || transactionIsNotFailed;

      if (isNotSelectableFailedTransaction) {
        return state;
      }

      if (state.retryingIds.has(action.id)) {
        return state;
      }

      const nextSelected = new Set(state.selectedIds);

      if (nextSelected.has(action.id)) {
        nextSelected.delete(action.id);
      } else {
        nextSelected.add(action.id);
      }

      return { ...state, selectedIds: nextSelected };
    }

    case "SELECT_ALL_FAILED": {
      const failedSelectable = state.transactions
        .filter((entry) => {
          const isFailedTransaction = entry.status === "failed";
          const isRetryInProgress = state.retryingIds.has(entry.id);
          const isSelectableFailedTransaction = isFailedTransaction && !isRetryInProgress;

          return isSelectableFailedTransaction;
        })
        .map((entry) => entry.id);

      return { ...state, selectedIds: new Set(failedSelectable) };
    }

    case "CLEAR_SELECTION":
      if (state.selectedIds.size === 0) {
        return state;
      }

      return { ...state, selectedIds: new Set() };

    case "START_RETRY": {
      if (action.ids.length === 0) {
        return state;
      }

      const nextRetrying = new Set(state.retryingIds);

      for (const id of action.ids) {
        nextRetrying.add(id);
      }

      return {
        ...state,
        retryingIds: nextRetrying,
        selectedIds: new Set(),
      };
    }

    case "RESOLVE_RETRY": {
      const nextRetrying = new Set(state.retryingIds);

      nextRetrying.delete(action.id);
      const nextTransactions = state.transactions.map((entry) =>
        entry.id === action.id ? { ...entry, status: action.nextStatus } : entry,
      );

      return { ...state, retryingIds: nextRetrying, transactions: nextTransactions };
    }

    case "SET_FILTER":
      return {
        ...state,
        filter: { ...state.filter, ...action.filter },
        selectedIds: new Set(),
      };

    case "SET_SORT": {
      const isSameKey = state.sort.key === action.key;
      const isCurrentlyDescending = state.sort.direction === "desc";
      const shouldFlipToAscending = isSameKey && isCurrentlyDescending;
      const direction = shouldFlipToAscending ? "asc" : "desc";

      return { ...state, sort: { key: action.key, direction } };
    }

    case "SET_DISPLAY_CURRENCY": {
      if (state.displayCurrency === action.currency) {
        return state;
      }

      return { ...state, displayCurrency: action.currency };
    }

    default: {
      action satisfies never;

      return state;
    }
  }
}
