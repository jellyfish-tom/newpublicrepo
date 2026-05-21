import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Transaction } from "../model/types";
import { TransactionRow } from "./TransactionRow";

function renderRow(
  overrides: Partial<Transaction> = {},
  props: { isRetrying?: boolean; isSelected?: boolean } = {},
) {
  const transaction: Transaction = {
    id: "TX-TEST",
    amount: 1500,
    currency: "USD",
    createdAt: "2026-05-10T10:00:00.000Z",
    description: "Premium Plan",
    paymentMethod: "Visa **** 4242",
    status: "failed",
    ...overrides,
  };
  const onToggleSelect = vi.fn();
  const isSelected = props.isSelected ?? false;
  const isRetrying = props.isRetrying ?? false;

  render(
    <table>
      <tbody>
        <TransactionRow
          transaction={transaction}
          isSelected={isSelected}
          isRetrying={isRetrying}
          onToggleSelect={onToggleSelect}
          displayCurrency="USD"
        />
      </tbody>
    </table>,
  );

  return { onToggleSelect };
}

describe("TransactionRow", () => {
  it("shows a checkbox only for failed transactions", () => {
    renderRow({ status: "failed" });
    expect(
      screen.getByRole("checkbox", { name: /select transaction TX-TEST/i }),
    ).toBeInTheDocument();
  });

  it("does not show a checkbox for non-failed transactions", () => {
    renderRow({ status: "success" });
    expect(
      screen.queryByRole("checkbox", { name: /select transaction TX-TEST/i }),
    ).not.toBeInTheDocument();
  });

  it("replaces the checkbox with a spinner while retrying", () => {
    renderRow({ status: "failed" }, { isRetrying: true });
    expect(
      screen.queryByRole("checkbox", { name: /select transaction TX-TEST/i }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
  });

  it("fires onToggleSelect when the checkbox is clicked", async () => {
    const user = userEvent.setup();
    const { onToggleSelect } = renderRow({ status: "failed" });

    await user.click(
      screen.getByRole("checkbox", { name: /select transaction TX-TEST/i }),
    );
    expect(onToggleSelect).toHaveBeenCalledWith("TX-TEST");
  });

  it("renders the formatted status badge when not retrying", () => {
    renderRow({ status: "success" });
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("converts the amount to the selected display currency", () => {
    renderRow({ amount: 1000, currency: "EUR" });
    expect(screen.getByText("$11.67")).toBeInTheDocument();
  });
});
