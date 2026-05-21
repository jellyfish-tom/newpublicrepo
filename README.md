<div align="center">

# Transactions Management Dashboard

Next.js + TypeScript take-home for Cleeng: review payment history, download invoices, and retry failed charges in bulk.
<br />

<img width="1512" height="861" alt="image" src="https://github.com/user-attachments/assets/9b7466af-e0dd-4882-9179-8e089966f378" />

<br />

[![CI](https://github.com/jellyfish-tom/newpublicrepo/actions/workflows/ci.yml/badge.svg?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/jellyfish-tom/newpublicrepo/actions/workflows/ci.yml)
[![Node](https://img.shields.io/badge/node-%3E%3D20.18-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](./.nvmrc)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](./tsconfig.json)
[![Vitest](https://img.shields.io/badge/Vitest-28_tests-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](./src)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](./e2e)

<br />

[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MSW](https://img.shields.io/badge/MSW-mocked_API-FF6C37?style=flat-square)](./src/test/msw)
[![App Router](https://img.shields.io/badge/App_Router-RSC-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/docs/app)


</div>

---

## 🛠 Prerequisites

Node **20.18+** and npm **10+** (see [`.nvmrc`](./.nvmrc)).

## 🚀 Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

## 🧪 Test

```bash
npm test             # Vitest — unit + integration (28 tests)
npm run test:e2e     # Playwright happy path (starts dev server on :3100)
npm run validate     # lint + typecheck + test + build (same as CI)
```

> **First-time E2E:** `npx playwright install chromium`.

> **Optional:** `npm run test:coverage`, `npm run test:watch`, `npm run lint`, `npm run typecheck`, `npm run analyze` (Turbopack bundle UI on :4000).

## 📦 Build & deploy

```bash
npm run build
npm start            # serves the production build (default :3000)
```

Any Node host that can run `npm ci && npm run build && npm start` works. On Vercel, connect the repo — Next.js needs no extra config for this app.

## ✨ What it does

|     |                                                                                        |
| --- | -------------------------------------------------------------------------------------- |
| 📊  | Transaction table with status filter, search, and sort                                 |
| 📄  | Per-row invoice download (mock PDF, ~2s latency)                                       |
| 🔄  | Bulk retry for failed rows with per-row spinners and aggregate toasts                  |
| 🧱  | App Router boundaries (`loading`, `error`, `not-found`), Suspense skeleton, basic a11y |

## 📚 Further reading

Documentation in [`docs/`](./docs/):

|     | Doc                                       | Contents                                                                           |
| --- | ----------------------------------------- | ---------------------------------------------------------------------------------- |
| 📝  | [NOTES.md](./docs/NOTES.md)               | Architecture decisions, trade-offs, styling model, tooling notes _(for reviewers)_ |
| 📐  | [AGENTS.md](./docs/AGENTS.md)             | Project coding conventions                                                         |
| 🤝  | [CONTRIBUTING.md](./docs/CONTRIBUTING.md) | Dev workflow, hooks, testing policy                                                |
