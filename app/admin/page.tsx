// app/admin/page.tsx

import Link from "next/link";
import { Plus } from "lucide-react";
import { isAdmin } from "@/lib/admin-auth";
import { listAdminStories } from "@/lib/admin-data";
import { RowActions } from "@/components/admin/RowActions";

export default async function AdminPage() {
  // Layouts are not a security boundary: check again here.
  if (!(await isAdmin())) return null;

  const stories = await listAdminStories();

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          Stories{" "}
          <span className="text-slate-400 font-medium text-lg">
            ({stories.length})
          </span>
        </h1>
        <Link
          href="/admin/new"
          className="inline-flex items-center gap-2 bg-[#0f172a] text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-slate-800 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New story
        </Link>
      </div>

      {stories.length === 0 ? (
        <p className="text-sm text-slate-500 py-12 text-center">
          No stories yet. Create your first one.
        </p>
      ) : (
        <ul className="space-y-3">
          {stories.map((s) => (
            <li
              key={s.id}
              className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"
            >
              <div className="grow min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-bold text-slate-900 truncate">
                    {s.title}
                  </h2>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      s.published
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {s.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 truncate">
                  /{s.slug}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {s.versions.map((v) => (
                    <span
                      key={v.lang}
                      className="text-[11px] font-semibold bg-slate-50 border border-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                    >
                      {v.lang.toUpperCase()} · {v.level} · {v.lines} sentences
                    </span>
                  ))}
                  {s.versions.length === 0 && (
                    <span className="text-[11px] text-amber-600 font-medium">
                      No language version
                    </span>
                  )}
                </div>
              </div>

              <RowActions
                id={s.id}
                title={s.title}
                published={s.published}
                publicHref={
                  s.published && s.versions[0]
                    ? `/stories/${s.slug}?lang=${s.versions[0].lang}`
                    : null
                }
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
