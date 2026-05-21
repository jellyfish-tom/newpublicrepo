import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-md flex-col gap-4 text-center">
        <p className="text-eyebrow tracking-[0.2em] text-fg-muted">404</p>
        <h1 className="text-title">Page not found</h1>
        <p className="text-body">The page you are looking for moved or never existed.</p>
        <div className="mt-2 flex justify-center">
          <Link
            href="/"
            className="focus-ring inline-flex h-11 cursor-pointer items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-medium text-white shadow-sm transition-[transform,background-color,color] hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            Back to transactions
          </Link>
        </div>
      </div>
    </main>
  );
}
