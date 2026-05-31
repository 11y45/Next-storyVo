// app/error.tsx
// Shown automatically by Next.js when an unhandled error is thrown during render.
// Must be "use client" — Next.js requires error boundaries to be client components.

"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to your error tracking service here (e.g. Sentry) when you add one
    console.error(error);
  }, [error]);

  return (
    <main className="grow flex flex-col items-center justify-center px-4 text-center space-y-6">
      <div className="space-y-2">
        <p className="text-7xl font-black text-slate-100">500</p>
        <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
        <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
          An unexpected error occurred. This is on our end — please try again or go back to the library.
        </p>
        {/* Show digest in dev so you can find it in terminal logs */}
        {error.digest && (
          <p className="text-[11px] font-mono text-slate-300 mt-1">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="text-sm font-medium px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#0f172a] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-slate-800 transition shadow-sm"
        >
          Back to Library
        </Link>
      </div>
    </main>
  );
}
