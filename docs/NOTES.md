# Implementation notes

Concise rationale for reviewers and interview follow-ups. Commands and setup live in [README.md](../README.md).

## Stack at a glance

| Choice                      | Decision                                                                        |
| --------------------------- | ------------------------------------------------------------------------------- |
| **Next.js 16** (App Router) | RSC shell + client island; route handlers expose a real HTTP seam for mutations |
| **React 19**                | Ref-as-prop on primitives; no `forwardRef`                                      |
| **TypeScript (strict)**     | `noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature`, etc.          |
| **Tailwind CSS v4**         | Token-first styling via `@theme` + role utilities — see [Styling](#styling)     |
| **Vitest + RTL + MSW**      | Fast unit/integration tests; fetch goes through MSW, not `vi.mock("@/lib/api")` |
| **Playwright**              | One happy-path E2E over a live dev server                                       |
| **Reducer + hooks**         | Local UI state — see [Why not TanStack Query](#why-not-tanstack-query)          |
| **Hand-rolled UI**          | No Shadcn/Radix — see [Why not Shadcn](#why-not-shadcn)                         |

## Architecture

**Feature-sliced layout** under `src/features/transactions/`:

- `model/` — types, reducer, pure `filter-and-sort`, constants, state + selector hooks
- `summary/`, `filters/`, `table/`, `actions/` — UI by area
- `components/` — skeleton + Suspense loader
- Public API: `index.ts` exports only `{ TransactionsView }` (locked by `index.test.ts`)

**API layer** (`src/lib/api/`):

- `transactions.contract.ts` — shared types
- `transactions.mock.ts` — in-memory impl + Zod-validated seed
- `transactions.client.ts` — `fetch` wrappers for client components
- `transactions.routes.ts` — single source of truth for paths (client + MSW)
- `transactions.ts` — entry re-export; server `page.tsx` uses mock `listTransactions` directly
- Route handlers under `src/app/api/transactions/` delegate to the mock today

**RSC boundaries:** `page.tsx` paints the shell immediately; `TransactionsLoader` fetches inside `<Suspense>` with `TransactionsViewSkeleton` as fallback.

**Concurrency model:** `retrySelected(ids)` dispatches `START_RETRY` once, then `Promise.allSettled` over per-id calls. Each resolution dispatches `RESOLVE_RETRY` independently so row spinners clear as soon as that id settles.

## Why not TanStack Query?

There is no real remote cache to invalidate — data lives in an in-memory mock we own. Bulk retry is **N concurrent, independently-tracked** operations, not one mutation with a single loading flag. TanStack Query would still need a `Map<id, status>` (or similar) on top of `useMutation`. A small reducer + selectors hook maps directly to the problem and stays easy to unit-test.

Swapping to a real backend later: keep the reducer for selection/retry UI state; point `transactions.client.ts` at the real API (route handlers already mirror the contract).

## Why not Shadcn?

Deliberately skipped for this scope:

- ~10 small primitives (Button, Checkbox, Card, Select, Badge, …) — easy to audit and extend
- No Radix/shadcn dependency weight for a single-screen demo
- Patterns follow Shadcn-style composition (variants, `cn()`, token-based styling) without importing the library

Trade-off: no pre-built complex widgets (dialogs, command palette). Not needed here.

## Styling

Three layers in `src/app/globals.css`:

1. **`@theme` tokens** — `--color-fg`, `--color-fg-muted`, `--color-fg-subtle`, `--color-fg-success`, `--color-fg-danger`, `--color-surface`, `--color-border-subtle`, `--color-border-elevated`, `--color-ring`, `--color-brand`, `--color-brand-soft`. Dark mode via `prefers-color-scheme` and `.dark` in `@layer base`.
2. **`@utility` roles** — `text-eyebrow`, `text-title`, `text-body`, `text-muted`, `text-mono-id`, `focus-ring-brand`, `focus-ring`. Composable with Tailwind atomics (e.g. `text-eyebrow tracking-[0.2em] text-fg-success` — later utilities win).
3. **Component variants** — `Card`, `Button`, `Badge` encapsulate variant classes. Card uses tokens throughout; Button/Badge keep saturated palettes where contrast requires it.

Brand green drives body gradients via `color-mix(in oklab, var(--color-brand) …)` — one source, no scattered hex literals.

## Testing strategy

| Layer                    | What                                                              |
| ------------------------ | ----------------------------------------------------------------- |
| Reducer + pure functions | `transactionsReducer`, `filter-and-sort`                          |
| Hook                     | `useTransactionsManager` error paths (all-fail, mixed, empty ids) |
| Mock API                 | Latency, blob shape, seeded RNG                                   |
| Components               | Row checkbox rules, invoice button via MSW                        |
| Integration              | `TransactionsView` concurrent retry via MSW overrides             |
| A11y                     | One axe assertion per feature                                     |
| E2E                      | Filter failed → select two → retry → assert Success badge         |
| Public API               | `index.test.ts` prevents barrel creep                             |

MSW default handlers live in `src/test/msw/handlers.ts`; per-test overrides use shared `transactionsApiMswPatterns` from `transactions.routes.ts`.

## Tooling notes

- **Vitest 2.1.9** and **jsdom 25** are pinned because newer releases expect **Node ≥ 20.19**. On Node 20.18.x (`.nvmrc`), bump both after upgrading Node — no code changes expected.
- **CI** (`.github/workflows/ci.yml`): Node 20.18 + 22 matrix, runs `npm run validate`.
- **Hooks:** pre-commit = lint-staged; pre-push = lint + typecheck + test; commit-msg = Conventional Commits via commitlint.
- **[AGENTS.md](./AGENTS.md):** project coding conventions enforced by lint and review.

## Out of scope

No auth, persistence, pagination, or real PDF generation. ~20 seed rows — virtualization and mobile card layout not warranted.

## AI-assisted workflow

This project was built with AI coding tools as pair-programming assistants. Roles were split by task:

1. **Planning** — initial architecture from requirements
2. **Implementation** — baseline feature build from the plan
3. **Refinement** — harder refactors, review fixes, edge cases
4. **Polish** — tooling, tests, docs, and final quality pass

All architectural and trade-off calls were reviewed and adjusted in follow-up passes; this file reflects the final codebase, not the first draft.
