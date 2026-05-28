// components/story/StoryCard.tsx
// No "use client" — pure presentational, rendered on server inside StoryGrid.

import Link from "next/link";
import { AlignLeft, ChevronRight } from "lucide-react";
import type { StoryListItem } from "@/types";

interface StoryCardProps {
  slug: string;
  title: string;
  /** Omit<LanguageVersion, "lines"> — no lines needed for the card */
  version: StoryListItem["version"];
  language: string;
  lineCount: number;
}

export function StoryCard({ slug, title, version, language, lineCount }: StoryCardProps) {
  return (
    <Link
      href={`/stories/${slug}?lang=${language}`}
      className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-200 transition flex flex-col group"
    >
      {/* Cover */}
      <div className="h-40 bg-linear-to-br from-emerald-50 to-teal-50/50 border-b border-slate-100 flex items-center justify-center relative">
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase text-slate-700">
          {version.meta}
        </span>
        <span className="text-xs font-medium text-slate-400 tracking-wide">
          [ Cover Image Placeholder ]
        </span>
      </div>

      {/* Body */}
      <div className="p-5 grow flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition">
            {title}
          </h3>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{version.description}</p>
        </div>
        <div className="flex items-center justify-between text-xs font-medium text-slate-400 border-t border-slate-50 pt-3">
          <span className="flex items-center gap-1">
            <AlignLeft className="w-3.5 h-3.5" />
            {lineCount} sentences
          </span>
          <span className="text-slate-700 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Read Story <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
