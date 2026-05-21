"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface RetryToolbarProps {
  selectedCount: number;
  isRetrying: boolean;
  onRetry: () => void;
  onClear: () => void;
}

export function RetryToolbar({
  selectedCount,
  isRetrying,
  onRetry,
  onClear,
}: RetryToolbarProps) {
  const hasNoSelection = selectedCount === 0;
  const shouldHideToolbar = hasNoSelection && !isRetrying;
  const isClearDisabled = isRetrying || hasNoSelection;

  if (shouldHideToolbar) {
    return null;
  }

  return (
    <section
      aria-label="Retry actions"
      className="sticky bottom-6 z-10 mx-auto flex w-fit min-w-[320px] items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90"
    >
      <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
        <Badge variant="count" className="h-6 min-w-6 justify-center px-1.5">
          {selectedCount}
        </Badge>
        selected
      </span>
      <Button variant="ghost" size="sm" onClick={onClear} disabled={isClearDisabled}>
        Clear
      </Button>
      <Button
        variant="primary"
        size="sm"
        onClick={onRetry}
        isLoading={isRetrying}
        loadingLabel="Retrying selected payments"
        disabled={hasNoSelection}
      >
        {isRetrying ? "Retrying…" : `Retry Selected (${selectedCount})`}
      </Button>
    </section>
  );
}
