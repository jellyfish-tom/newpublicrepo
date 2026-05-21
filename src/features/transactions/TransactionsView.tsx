"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { toUserMessage } from "@/lib/api/api-error";
import { RetryToolbar } from "./actions/RetryToolbar";
import { FilterBar } from "./filters/FilterBar";
import type { Transaction } from "./model/types";
import {
  useTransactionsManager,
  type RetrySummary,
} from "./model/useTransactionsManager";
import { SummaryHeader } from "./summary/SummaryHeader";
import { TransactionsTable } from "./table/TransactionsTable";

interface TransactionsViewProps {
  initialTransactions: Transaction[];
}

export function TransactionsView({ initialTransactions }: TransactionsViewProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryAnnouncement, setRetryAnnouncement] = useState<string>("");

  const handleRetryComplete = useCallback((summary: RetrySummary) => {
    const message =
      summary.failed === 0
        ? `All (${summary.succeeded}) payment${summary.succeeded === 1 ? "" : "s"} retried successfully.`
        : `${summary.succeeded} succeeded, ${summary.failed} still failed.`;

    setRetryAnnouncement(message);

    if (summary.failed === 0) {
      toast.success("Retry complete", { description: message });

      return;
    }

    if (summary.succeeded === 0) {
      toast.error("Retry failed", { description: message });

      return;
    }

    toast("Retry complete", { description: message });
  }, []);

  const manager = useTransactionsManager({
    initialTransactions,
    onRetryComplete: handleRetryComplete,
  });

  const handleRetrySelected = useCallback(async () => {
    if (isRetrying) {
      return;
    }

    const ids = Array.from(manager.state.selectedIds);

    setIsRetrying(true);
    try {
      await manager.retrySelected(ids);
    } catch (error) {
      toast.error("Retry failed", { description: toUserMessage(error) });
    } finally {
      setIsRetrying(false);
    }
  }, [isRetrying, manager]);

  const successCount = manager.state.transactions.filter(
    (entry) => entry.status === "success",
  ).length;
  const pendingCount = manager.state.transactions.filter(
    (entry) => entry.status === "pending",
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <SummaryHeader
        total={manager.state.transactions.length}
        failedCount={manager.failedCount}
        successCount={successCount}
        pendingCount={pendingCount}
        selectedCurrency={manager.state.displayCurrency}
        totalSpendByCurrency={manager.totalSpendByCurrency}
        onCurrencyChange={manager.setDisplayCurrency}
      />
      <FilterBar
        status={manager.state.filter.status}
        query={manager.state.filter.query}
        onStatusChange={manager.setStatusFilter}
        onQueryChange={manager.setQuery}
      />
      <TransactionsTable
        transactions={manager.visibleTransactions}
        selectableFailedCount={manager.selectableFailedCount}
        selectedCount={manager.state.selectedIds.size}
        sort={manager.state.sort}
        onToggleSelect={manager.toggleSelect}
        onSelectAllFailed={manager.selectAllFailed}
        onClearSelection={manager.clearSelection}
        onToggleSort={manager.toggleSort}
        isRowSelected={manager.isRowSelected}
        isRowRetrying={manager.isRowRetrying}
        displayCurrency={manager.state.displayCurrency}
      />
      <RetryToolbar
        selectedCount={manager.state.selectedIds.size}
        isRetrying={isRetrying}
        onRetry={handleRetrySelected}
        onClear={manager.clearSelection}
      />
      <p aria-live="polite" className="sr-only">
        {retryAnnouncement}
      </p>
    </div>
  );
}
