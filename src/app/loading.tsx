import { Sidebar } from "@/components/layout/Sidebar";
import { TransactionsViewSkeleton } from "@/features/transactions/components/TransactionsViewSkeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <header className="flex flex-col gap-2">
            <div className="h-3 w-32 animate-pulse rounded bg-slate-200/80 dark:bg-slate-800/80" />
            <div className="h-9 w-2/3 animate-pulse rounded bg-slate-200/80 dark:bg-slate-800/80" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200/80 dark:bg-slate-800/80" />
          </header>
          <TransactionsViewSkeleton />
        </div>
      </main>
    </div>
  );
}
