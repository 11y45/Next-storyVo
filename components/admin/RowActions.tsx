// components/admin/RowActions.tsx
"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setPublished, deleteStory } from "@/lib/actions/admin";

interface RowActionsProps {
  id: string;
  title: string;
  published: boolean;
  /** Public URL, only set when the story is published */
  publicHref: string | null;
}

const btn =
  "text-xs font-semibold px-3 py-1.5 rounded-lg border transition disabled:opacity-50";

export function RowActions({ id, title, published, publicHref }: RowActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function togglePublished() {
    startTransition(async () => {
      await setPublished(id, !published);
      router.refresh();
    });
  }

  function remove() {
    if (!window.confirm(`Delete "${title}" and all its sentences? This cannot be undone.`))
      return;
    startTransition(async () => {
      await deleteStory(id);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2 shrink-0 flex-wrap">
      {publicHref && (
        <Link
          href={publicHref}
          target="_blank"
          className={`${btn} border-slate-200 text-slate-600 hover:bg-slate-50`}
        >
          View
        </Link>
      )}
      <Link
        href={`/admin/${id}`}
        className={`${btn} border-slate-200 text-slate-700 hover:bg-slate-50`}
      >
        Edit
      </Link>
      <button
        onClick={togglePublished}
        disabled={pending}
        className={`${btn} border-slate-200 text-slate-700 hover:bg-slate-50`}
      >
        {published ? "Unpublish" : "Publish"}
      </button>
      <button
        onClick={remove}
        disabled={pending}
        className={`${btn} border-red-100 text-red-600 hover:bg-red-50`}
      >
        Delete
      </button>
    </div>
  );
}
