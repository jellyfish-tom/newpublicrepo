"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { logAppError } from "@/lib/api/api-error";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    logAppError("app-error", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-md flex-col gap-4 text-center">
        <p className="text-eyebrow tracking-[0.2em] text-fg-danger">Error</p>
        <h1 className="text-title">Something went wrong.</h1>
        <p className="text-body">
          We could not load this page. Try again, or come back in a moment.
        </p>
        <div className="mt-2 flex justify-center">
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </main>
  );
}
