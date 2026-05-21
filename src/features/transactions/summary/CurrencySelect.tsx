import type { ChangeEvent } from "react";
import { Select } from "@/components/ui/Select";
import { CURRENCIES } from "@/lib/currency";
import type { Currency } from "../model/types";

interface CurrencySelectProps {
  selectedCurrency: Currency;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export function CurrencySelect({ selectedCurrency, onChange }: CurrencySelectProps) {
  return (
    <Select
      label="Display currency"
      size="xs"
      value={selectedCurrency}
      onChange={onChange}
    >
      {CURRENCIES.map((currency) => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      ))}
    </Select>
  );
}
