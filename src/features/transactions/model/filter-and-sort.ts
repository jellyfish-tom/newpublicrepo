import type { FilterState, SortState, Transaction } from "./types";

export function filterAndSort(
  transactions: Transaction[],
  filter: FilterState,
  sort: SortState,
): Transaction[] {
  const query = filter.query.trim().toLowerCase();
  const filtered = transactions.filter((entry) => {
    const statusFilterIsActive = filter.status !== "all";
    const statusDoesNotMatch = entry.status !== filter.status;
    const shouldExcludeByStatus = statusFilterIsActive && statusDoesNotMatch;

    if (shouldExcludeByStatus) {
      return false;
    }

    if (query.length === 0) {
      return true;
    }

    const transactionIdMatchesQuery = entry.id.toLowerCase().includes(query);
    const descriptionMatchesQuery = entry.description.toLowerCase().includes(query);
    const paymentMethodMatchesQuery = entry.paymentMethod.toLowerCase().includes(query);
    const transactionMatchesQuery =
      transactionIdMatchesQuery || descriptionMatchesQuery || paymentMethodMatchesQuery;

    return transactionMatchesQuery;
  });

  const directionMultiplier = sort.direction === "asc" ? 1 : -1;

  return [...filtered].sort((left, right) => {
    switch (sort.key) {
      case "amount":
        return (left.amount - right.amount) * directionMultiplier;
      case "status":
        return left.status.localeCompare(right.status) * directionMultiplier;
      case "createdAt":
        return left.createdAt.localeCompare(right.createdAt) * directionMultiplier;
    }
  });
}
