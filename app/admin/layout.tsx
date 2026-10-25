// app/admin/layout.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import { logout } from "@/lib/actions/admin";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin — Storyvo",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) return <LoginForm />;

  return (
    <main className="grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <Link href="/admin" className="font-bold text-slate-900">
          Admin <span className="text-slate-400 font-medium">· Stories</span>
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition"
          >
            Log out
          </button>
        </form>
      </div>
      {children}
    </main>
  );
}
