import type { Currency } from "@/features/transactions/model/types";

export const CURRENCIES = ["USD", "EUR", "GBP"] satisfies ReadonlyArray<Currency>;

export const EXCHANGE_RATE_DATE = "2026-05-21";

const USD_PER_MAJOR_UNIT: Record<Currency, number> = {
  USD: 1,
  EUR: 1.167,
  GBP: 1.339,
};

export function isCurrency(value: string): value is Currency {
  return CURRENCIES.some((currency) => currency === value);
}

export function convertMoney(
  amountInMinorUnits: number,
  sourceCurrency: Currency,
  targetCurrency: Currency,
): number {
  if (sourceCurrency === targetCurrency) {
    return amountInMinorUnits;
  }

  const amountInUsd = (amountInMinorUnits / 100) * USD_PER_MAJOR_UNIT[sourceCurrency];
  const convertedAmount = amountInUsd / USD_PER_MAJOR_UNIT[targetCurrency];

  return Math.round(convertedAmount * 100);
}

export function convertTotalsToCurrency(
  totalsByCurrency: ReadonlyMap<Currency, number>,
  targetCurrency: Currency,
): number {
  let total = 0;

  for (const [sourceCurrency, amount] of totalsByCurrency.entries()) {
    total += convertMoney(amount, sourceCurrency, targetCurrency);
  }

  return total;
}
