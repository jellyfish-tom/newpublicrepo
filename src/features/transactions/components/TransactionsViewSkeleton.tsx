import { Card } from "@/components/ui/Card";

const SUMMARY_TILES = ["total", "success", "failed", "pending"] as const;
const TABLE_ROWS = Array.from({ length: 6 }, (_, index) => index);
const SKELETON_BAR_CLASSES = "animate-pulse rounded bg-slate-200/80 dark:bg-slate-800/80";

export function TransactionsViewSkeleton() {
  return (
    <div
      className="flex flex-col gap-6"
      role="status"
      aria-busy="true"
      aria-label="Loading transactions"
    >
      <section className="grid grid-cols-1 gap-4 rounded-2xl border border-border-subtle/70 bg-surface/80 p-6 sm:grid-cols-2 lg:grid-cols-4 dark:bg-surface/60">
        {SUMMARY_TILES.map((tile) => (
          <div key={tile} className="flex flex-col gap-2">
            <div className={`${SKELETON_BAR_CLASSES} h-3 w-24`} />
            <div className={`${SKELETON_BAR_CLASSES} h-7 w-32`} />
          </div>
        ))}
      </section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className={`${SKELETON_BAR_CLASSES} h-11 w-full sm:max-w-sm`} />
        <div className={`${SKELETON_BAR_CLASSES} h-11 w-full sm:max-w-xs`} />
      </div>
      <Card padding="none" className="overflow-hidden bg-surface/90 dark:bg-surface/60">
        <div className="border-b border-border-subtle/70 px-5 py-4">
          <div className={`${SKELETON_BAR_CLASSES} h-3 w-40`} />
        </div>
        <div className="divide-y divide-border-subtle/40 dark:divide-border-subtle/70">
          {TABLE_ROWS.map((row) => (
            <div key={row} className="flex items-center gap-4 px-5 py-4">
              <div className={`${SKELETON_BAR_CLASSES} h-4 w-4 shrink-0`} />
              <div className={`${SKELETON_BAR_CLASSES} h-4 w-32`} />
              <div className={`${SKELETON_BAR_CLASSES} h-4 flex-1`} />
              <div className={`${SKELETON_BAR_CLASSES} h-4 w-20`} />
              <div className={`${SKELETON_BAR_CLASSES} h-4 w-28`} />
              <div className={`${SKELETON_BAR_CLASSES} h-4 w-20`} />
            </div>
          ))}
        </div>
      </Card>
      <span className="sr-only">Loading transactions...</span>
    </div>
  );
}
