"use client";

import { useCallback, type ChangeEvent } from "react";
import { EXCHANGE_RATE_DATE, convertTotalsToCurrency, isCurrency } from "@/lib/currency";
import { formatMoney } from "@/lib/format";
import type { Currency } from "../model/types";
import { CurrencySelect } from "./CurrencySelect";
import { SummaryCard } from "./SummaryCard";

interface SummaryHeaderProps {
  total: number;
  failedCount: number;
  successCount: number;
  pendingCount: number;
  selectedCurrency: Currency;
  totalSpendByCurrency: Map<Currency, number>;
  onCurrencyChange: (currency: Currency) => void;
}

export function SummaryHeader({
  total,
  failedCount,
  successCount,
  pendingCount,
  selectedCurrency,
  totalSpendByCurrency,
  onCurrencyChange,
}: SummaryHeaderProps) {
  const successRate = total === 0 ? 0 : Math.round((successCount / total) * 100);
  const convertedTotalSpend = convertTotalsToCurrency(
    totalSpendByCurrency,
    selectedCurrency,
  );
  const handleCurrencyChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      if (isCurrency(event.target.value)) {
        onCurrencyChange(event.target.value);
      }
    },
    [onCurrencyChange],
  );

  return (
    <section
      aria-label="Account summary"
      className="rounded-2xl border border-border-subtle/70 bg-surface/80 px-4 py-3 shadow-sm backdrop-blur-sm dark:bg-surface/60"
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-4 md:divide-x md:divide-border-subtle/70">
        <SummaryCard label="Transactions" value={total.toString()} />
        <SummaryCard
          label="Successful"
          value={`${successCount} (${successRate}%)`}
          meta={pendingCount > 0 ? `${pendingCount} pending` : undefined}
          accent="success"
        />
        <SummaryCard
          label="Failed"
          value={failedCount.toString()}
          accent={failedCount > 0 ? "danger" : "neutral"}
        />
        <SummaryCard
          label="Total spend"
          value={formatMoney(convertedTotalSpend, selectedCurrency)}
          meta={`FX ${EXCHANGE_RATE_DATE}`}
          accessory={
            <CurrencySelect
              selectedCurrency={selectedCurrency}
              onChange={handleCurrencyChange}
            />
          }
        />
      </div>
    </section>
  );
}
