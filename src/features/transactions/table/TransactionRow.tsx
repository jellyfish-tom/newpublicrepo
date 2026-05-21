"use client";

import { useCallback } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Spinner } from "@/components/ui/Spinner";
import { convertMoney } from "@/lib/currency";
import { formatDateTime, formatMoney } from "@/lib/format";
import type { Currency, Transaction } from "../model/types";
import { DownloadInvoiceButton } from "../actions/DownloadInvoiceButton";
import { StatusBadge } from "./StatusBadge";

interface TransactionRowProps {
  transaction: Transaction;
  isSelected: boolean;
  isRetrying: boolean;
  onToggleSelect: (id: string) => void;
  displayCurrency: Currency;
}

export function TransactionRow({
  transaction,
  isSelected,
  isRetrying,
  onToggleSelect,
  displayCurrency,
}: TransactionRowProps) {
  const { id, amount, currency, createdAt, description, paymentMethod, status } =
    transaction;
  const isFailed = status === "failed";
  const displayAmount = convertMoney(amount, currency, displayCurrency);
  const ariaBusy = isRetrying ? true : undefined;

  const handleToggle = useCallback(() => {
    onToggleSelect(id);
  }, [id, onToggleSelect]);

  return (
    <tr
      aria-busy={ariaBusy}
      data-state={isSelected ? "selected" : undefined}
      className="scroll-mb-24 hover:bg-slate-50/70 data-[state=selected]:bg-emerald-50/40 dark:hover:bg-slate-800/40 dark:data-[state=selected]:bg-emerald-900/15"
    >
      <td className="w-12 px-5 py-4 align-middle">
        {isRetrying ? (
          <Spinner label={`Retrying ${id}`} className="text-emerald-500" />
        ) : isFailed ? (
          <Checkbox
            id={`select-${id}`}
            checked={isSelected}
            onChange={handleToggle}
            label={`Select transaction ${id}`}
            hideLabel
          />
        ) : null}
      </td>
      <td className="px-5 py-4 align-middle">
        <span className="text-mono-id">#{id}</span>
      </td>
      <td className="px-5 py-4 align-middle">
        <div className="text-sm font-medium text-fg">{description}</div>
        <div className="text-muted">{paymentMethod}</div>
      </td>
      <td className="px-5 py-4 align-middle text-sm font-semibold tabular-nums text-fg">
        {formatMoney(displayAmount, displayCurrency)}
      </td>
      <td className="px-5 py-4 align-middle text-body">
        <time dateTime={createdAt}>{formatDateTime(createdAt)}</time>
      </td>
      <td className="px-5 py-4 align-middle">
        {isRetrying ? (
          <span className="inline-flex items-center gap-2 text-xs font-medium text-fg-success">
            <Spinner size={12} label="Retrying payment" />
            Retrying…
          </span>
        ) : (
          <StatusBadge status={status} />
        )}
      </td>
      <td className="px-5 py-4 align-middle text-right">
        <DownloadInvoiceButton transactionId={id} />
      </td>
    </tr>
  );
}
