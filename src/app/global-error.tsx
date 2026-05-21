"use client";

import { useEffect } from "react";
import { logAppError } from "@/lib/api/api-error";

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootGlobalError({ error, reset }: GlobalErrorPageProps) {
  useEffect(() => {
    logAppError("global-error", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-full bg-white font-sans text-slate-900 antialiased">
        <main className="flex min-h-screen items-center justify-center px-4 py-10">
          <div className="flex w-full max-w-md flex-col gap-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-rose-600">
              Error
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Application unavailable
            </h1>
            <p className="text-sm text-slate-600">
              Something went wrong while rendering the app. Please try again.
            </p>
            <div className="mt-2 flex justify-center">
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-medium text-white shadow-sm transition-[transform,background-color,color] hover:bg-slate-800 active:scale-[0.98]"
              >
                Try again
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
