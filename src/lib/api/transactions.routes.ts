const TRANSACTIONS_API_BASE = "/api/transactions";

export const transactionsApiRoutes = {
  list: TRANSACTIONS_API_BASE,
  invoice: (id: string) => `${TRANSACTIONS_API_BASE}/${id}/invoice`,
  retry: (id: string) => `${TRANSACTIONS_API_BASE}/${id}/retry`,
} as const;

export const transactionsApiMswPatterns = {
  list: `*${TRANSACTIONS_API_BASE}`,
  invoice: `*${TRANSACTIONS_API_BASE}/:id/invoice`,
  retry: `*${TRANSACTIONS_API_BASE}/:id/retry`,
} as const;
