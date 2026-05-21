import { Suspense } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TransactionsLoader } from "@/features/transactions/components/TransactionsLoader";
import { TransactionsViewSkeleton } from "@/features/transactions/components/TransactionsViewSkeleton";

export default function HomePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main
        id="main"
        tabIndex={-1}
        className="flex-1 px-4 py-10 focus:outline-none sm:px-8 lg:px-12"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <header className="flex flex-col gap-1">
            <p className="text-eyebrow tracking-[0.2em] text-fg-success">
              Account · Billing
            </p>
            <h1 className="text-title">Customer transactions</h1>
            <p className="max-w-2xl text-body">
              Review past payments, download invoices, and retry failed charges in bulk.
            </p>
          </header>
          <Suspense fallback={<TransactionsViewSkeleton />}>
            <TransactionsLoader />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
