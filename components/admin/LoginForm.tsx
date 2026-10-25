// components/admin/LoginForm.tsx
"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/admin";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <main className="grow flex items-center justify-center px-4">
      <form
        action={formAction}
        className="w-full max-w-sm bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900">Admin login</h1>
          <p className="text-sm text-slate-500">Enter the admin password.</p>
        </div>

        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          aria-label="Password"
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {state?.error && (
          <p className="text-sm text-red-600 font-medium">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-[#0f172a] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-slate-800 transition disabled:opacity-50"
        >
          {pending ? "Checking…" : "Log in"}
        </button>
      </form>
    </main>
  );
}
