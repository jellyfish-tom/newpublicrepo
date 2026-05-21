"use client";

import { useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { EmptyState } from "@/components/ui/EmptyState";
import { COLUMNS } from "../model/constants";
import type { Currency, SortKey, SortState, Transaction } from "../model/types";
import { SortableTh } from "./SortableTh";
import { TransactionRow } from "./TransactionRow";

interface TransactionsTableProps {
  transactions: Transaction[];
  selectableFailedCount: number;
  selectedCount: number;
  sort: SortState;
  onToggleSelect: (id: string) => void;
  onSelectAllFailed: () => void;
  onClearSelection: () => void;
  onToggleSort: (key: SortKey) => void;
  isRowSelected: (id: string) => boolean;
  isRowRetrying: (id: string) => boolean;
  displayCurrency: Currency;
}

export function TransactionsTable({
  transactions,
  selectableFailedCount,
  selectedCount,
  sort,
  onToggleSelect,
  onSelectAllFailed,
  onClearSelection,
  onToggleSort,
  isRowSelected,
  isRowRetrying,
  displayCurrency,
}: TransactionsTableProps) {
  const hasSelectableFailedTransactions = selectableFailedCount > 0;
  const hasSelectedTransactions = selectedCount > 0;
  const selectedAllSelectableFailedTransactions = selectedCount === selectableFailedCount;
  const allFailedSelected =
    hasSelectableFailedTransactions && selectedAllSelectableFailedTransactions;
  const someFailedSelected = hasSelectedTransactions && !allFailedSelected;
  const isSelectAllDisabled = !hasSelectableFailedTransactions;

  const handleSelectAllToggle = useCallback(() => {
    if (allFailedSelected) {
      onClearSelection();

      return;
    }

    onSelectAllFailed();
  }, [allFailedSelected, onClearSelection, onSelectAllFailed]);

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions match your filters"
        description="Try removing filters or searching for a different term."
      />
    );
  }

  return (
    <Card padding="none" className="overflow-x-auto bg-surface/90 dark:bg-surface/60">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">Transaction history</caption>
        <thead className="text-eyebrow border-b border-border-subtle/70">
          <tr>
            <th scope="col" className="w-12 px-5 py-4">
              <Checkbox
                id="select-all-failed"
                checked={allFailedSelected}
                indeterminate={someFailedSelected}
                onChange={handleSelectAllToggle}
                disabled={isSelectAllDisabled}
                label="Select all failed transactions"
                hideLabel
              />
            </th>
            {COLUMNS.map((column) => (
              <SortableTh
                key={column.key}
                column={column}
                sort={sort}
                onToggleSort={onToggleSort}
              />
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle/40 dark:divide-border-subtle/70">
          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              isSelected={isRowSelected(transaction.id)}
              isRetrying={isRowRetrying(transaction.id)}
              onToggleSelect={onToggleSelect}
              displayCurrency={displayCurrency}
            />
          ))}
        </tbody>
      </table>
    </Card>
  );
}
