# Transactions Management Dashboard

Next.js + TypeScript take-home for Cleeng: review payment history, download invoices, and retry failed charges in bulk.

## Prerequisites

Node **20.18+** and npm **10+** (see `.nvmrc`).

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

## Test

```bash
npm test             # Vitest — unit + integration (28 tests)
npm run test:e2e     # Playwright happy path (starts dev server on :3100)
npm run validate     # lint + typecheck + test + build (same as CI)
```

First-time E2E: `npx playwright install chromium`.

Optional: `npm run test:coverage`, `npm run test:watch`, `npm run lint`, `npm run typecheck`, `npm run analyze` (Turbopack bundle UI on :4000).

## Build & deploy

```bash
npm run build
npm start            # serves the production build (default :3000)
```

Any Node host that can run `npm ci && npm run build && npm start` works. On Vercel, connect the repo — Next.js needs no extra config for this app.

## What it does

- Transaction table with status filter, search, and sort
- Per-row invoice download (mock PDF, ~2s latency)
- Bulk retry for failed rows with per-row spinners and aggregate toasts
- App Router boundaries (`loading`, `error`, `not-found`), Suspense skeleton, basic a11y

## Further reading

Documentation in [`docs/`](./docs/):

- [NOTES.md](./docs/NOTES.md) — architecture decisions, trade-offs, styling model, tooling notes _(for reviewers)_
- [AGENTS.md](./docs/AGENTS.md) — project coding conventions
- [CONTRIBUTING.md](./docs/CONTRIBUTING.md) — dev workflow, hooks, testing policy
