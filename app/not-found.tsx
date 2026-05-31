// app/not-found.tsx
// Shown automatically by Next.js when notFound() is called or a route doesn't exist.
// No "use client" — server rendered.

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="grow flex flex-col items-center justify-center px-4 text-center space-y-6">
      <div className="space-y-2">
        <p className="text-7xl font-black text-slate-300">404</p>
        <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
          The story or page you&apos;re looking for doesn&apos;t exist, may have
          been removed, or the link is wrong.
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#0f172a] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-slate-800 transition shadow-sm"
      >
        Back to Library
      </Link>
    </main>
  );
}
