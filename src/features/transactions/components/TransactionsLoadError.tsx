"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface TransactionsLoadErrorProps {
  message: string;
}

export function TransactionsLoadError({ message }: TransactionsLoadErrorProps) {
  const router = useRouter();

  const handleRetry = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <Card
      padding="none"
      className="border-rose-200 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/20"
    >
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-1">
          <p className="text-eyebrow tracking-[0.2em] text-fg-danger">Unable to load</p>
          <h2 className="text-lg font-semibold text-fg">
            Transactions could not be loaded
          </h2>
          <p className="text-body">{message}</p>
        </div>
        <div>
          <Button onClick={handleRetry}>Try again</Button>
        </div>
      </div>
    </Card>
  );
}
