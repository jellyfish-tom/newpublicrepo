# Project conventions

These rules are enforced by lint, tests, and review. Break them only with an explicit reason recorded in the PR description.

## Architecture

- **Feature-sliced.** Domain code lives under `src/features/<feature>/`. The feature folder has its own `model/` (types, reducer, selectors, constants, pure functions), and sub-folders by UI area (`summary/`, `filters/`, `table/`, `actions/`, `components/`).
- **Public API is a single file.** `src/features/<feature>/index.ts` re-exports only the symbols the rest of the app may import. A test (`index.test.ts`) locks that surface so it cannot grow silently.
- **No barrel `export *`.** All `index.ts` files re-export with `export { Foo } from "./Foo"`. `export *` will inevitably drag a `"use client"` module into an RSC graph the first time someone adds a hook to a primitive.
- **Domain types live in the feature.** No global `src/types/` bucket. Cross-feature consumers (e.g. `src/lib/format.ts`) import types from `@/features/<feature>/model/types`.
- **API surface split.** `transactions.contract.ts` (types + `TransactionsApi`), `transactions.schema.ts` (Zod + parse helpers), `api-error.ts` (structured errors), `transactions.mock.ts` (in-memory impl), `transactions.client.ts` (fetch wrappers), `transactions.ts` (entry re-export). Route handlers under `src/app/api/...` delegate to the mock and wrap logic in `runRoute`.
- **Validate at boundaries.** Params and JSON payloads parse through `transactions.schema.ts`. Parsers throw `ApiError`, not raw `ZodError`. Mock and client both `satisfies TransactionsApi`.
- **Safe errors end-to-end.** Routes return `{ code, message }`. Client uses `apiErrorFromResponse`. UI shows `toUserMessage(error)` — never raw `error.message` from unknown failures. Log with `logAppError(scope, error)`.

## React

- **No logical expressions in JSX.** Don't write `{condition && <Foo />}` or `{a || b}` in JSX. Assign to a named variable first, or use a ternary that returns `null`. This avoids the "0 rendered as text" footgun and forces intent into a name.
- **No JSX inside try/catch.** Async work and error handling belong in a helper that returns a result object; render from that result outside the try block (see `TransactionsLoader`).
- **No `forwardRef` for new primitives.** React 19 ships ref-as-prop. Declare `ref?: Ref<HTMLElement>` on the props interface.
- **Named handlers.** Event handlers are named functions, wrapped in `useCallback` when passed as props.
- **No anonymous default exports.** Lint will warn; assign to a named const first.

## TypeScript

- `strict` + `noUncheckedIndexedAccess` + `noPropertyAccessFromIndexSignature` + `useUnknownInCatchVariables` are on. Use bracket access for index signatures (`process.env["FOO"]`), and narrow `unknown` instead of casting.
- **No `any` and no `as` casting** outside test glue. Prefer type guards, narrowing, or refactoring.
- **Generic names are words**, not single letters (`TParams`, not `T`).

## Styling

- **Token-first.** Colors and borders come from `@theme` tokens in `src/app/globals.css` (`fg`, `fg-muted`, `fg-subtle`, `fg-success`, `fg-danger`, `surface`, `border-subtle`, `border-elevated`, `ring`). Don't hard-code `text-slate-700` or `border-slate-200` in components.
- **Typography utilities compose via cascade.** `text-eyebrow tracking-[0.2em] text-fg-success` works because later utilities override the earlier eyebrow defaults. Use the utilities (`text-eyebrow`, `text-title`, `text-body`, `text-muted`, `text-mono-id`) instead of duplicating their atomics.
- **Focus rings via `focus-ring`** utility. Never inline the full focus-visible ring/offset combo.
- **Animate intent, not layout.** Use `transition-[transform,background-color,border-color,color]` instead of `transition-all` so layout/size changes don't animate.

## Tests

- **MSW for I/O.** Tests that exercise components which call `fetch` use `mswServer.use(...)` instead of `vi.mock("@/lib/api")`. Only modules with no HTTP equivalent (e.g. `triggerDownload` DOM helper) may be `vi.mock`ed.
- **Assert error shape in API tests.** Schema/client tests expect `ApiError` codes, not bare `toThrow()`. Route behavior is covered via `runRoute` unit tests.
- **One axe assertion per feature** at a representative state.
- **Reset formatter caches** between tests. The vitest setup calls `__resetFormattersForTest()` after each test.

## Commits

- Conventional Commits enforced by `@commitlint` in `.husky/commit-msg`. Format: `type(scope): subject`.

## Comments

- Default to zero comments. Refactor the code to be self-documenting first. Comments are reserved for non-obvious intent, trade-offs, or constraints the code can't convey.
