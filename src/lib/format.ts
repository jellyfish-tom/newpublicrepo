import type { Currency } from "@/features/transactions/model/types";

const moneyFormatters = new Map<string, Intl.NumberFormat>();
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatMoney(amountInMinorUnits: number, currency: Currency): string {
  let formatter = moneyFormatters.get(currency);

  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    });
    moneyFormatters.set(currency, formatter);
  }

  return formatter.format(amountInMinorUnits / 100);
}

export function formatDateTime(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function __resetFormattersForTest(): void {
  moneyFormatters.clear();
}
