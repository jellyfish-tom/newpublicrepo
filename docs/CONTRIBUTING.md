# Contributing

Thanks for taking the time to look at this project. The bar is "make it boringly easy for the next person to ship safely."

Architecture decisions and interview notes: [NOTES.md](./NOTES.md). Coding conventions: [AGENTS.md](./AGENTS.md).

## Setup

```bash
nvm use            # honors .nvmrc (20.18.0)
npm ci
npm run dev
```

## Daily commands

```bash
npm run dev              # Next dev server on :3000
npm test                 # Vitest run
npm run test:watch       # Vitest watch
npm run test:coverage    # Vitest with v8 coverage thresholds (80/75/80/80)
npm run test:e2e         # Playwright happy path (boots a dev server)
npm run lint             # ESLint
npm run lint:fix         # Autofix
npm run typecheck        # tsc --noEmit
npm run format           # Prettier write
npm run build            # Production build
npm run analyze          # Turbopack bundle analyzer UI (http://localhost:4000)
npm run analyze:output   # Write analysis to .next/diagnostics/analyze only
```

`npm run validate` runs `lint + typecheck + test + build` in sequence and is the same script CI uses.

## Hooks

- **pre-commit** runs `lint-staged` (prettier + eslint --fix on changed files).
- **pre-push** runs `lint + typecheck + test`. Build runs in CI only — keep the local push fast.
- **commit-msg** runs `@commitlint` with `config-conventional`. Use `type(scope): subject` (e.g. `feat(transactions): add bulk retry`).

## Coding conventions

The full list lives in [AGENTS.md](./AGENTS.md). The highlights:

- **No `any`. No `as` casting.** Narrow `unknown`, write a type guard, or refactor.
- **No `forwardRef`** in new primitives. React 19 ref-as-prop.
- **No logical expressions in JSX.** Hoist to a named variable or use a ternary that returns `null`.
- **No global `src/types/`** bucket. Domain types live in their feature.
- **No `export *`** in barrels. Always `export { Foo } from "./Foo"`.
- **Tokens before atomics** for color, border, and ring. Don't hard-code `slate-*` or `emerald-*` in components.
- **Zero comments by default.** If you'd add a comment, refactor the code so the comment isn't needed.

## Tests

- New behavior ships with a Vitest test.
- Tests that hit `/api/transactions/*` use `mswServer.use(...)`, not `vi.mock("@/lib/api")`.
- API boundary tests live in `transactions.schema.test.ts`, `transactions.client.test.ts`, and `api-error.test.ts` — assert `ApiError` codes/messages, not unchecked throws.
- One axe assertion per feature at a meaningful state.
- Mutations to module-level caches (e.g. `Intl.NumberFormat` cache in `format.ts`) expose a `__resetFormattersForTest`-style hook called from `vitest.setup.ts`.

## Pull requests

Each PR description should answer:

1. What user-facing change does this make?
2. Why this approach, briefly?
3. What tests cover it?
4. Anything reviewers should look at twice?

CI must be green before merge. No `--no-verify` pushes.
