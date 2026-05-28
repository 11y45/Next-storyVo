// components/library/FilterControls.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { FILTER_LEVELS } from "@/lib/stories";
import type { SupportedLang } from "@/types";

interface FilterControlsProps {
  currentLang: SupportedLang;
  currentLevel: string;
}

export function FilterControls({ currentLang, currentLevel }: FilterControlsProps) {
  const router = useRouter();
  const pathname = usePathname();

  function navigate(updates: { lang?: string; level?: string }) {
    const params = new URLSearchParams();
    const newLang = updates.lang ?? currentLang;
    const newLevel = updates.level ?? currentLevel;

    params.set("lang", newLang);
    if (newLevel !== "All") params.set("level", newLevel);

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
      {/* Level pills */}
      <div className="flex flex-wrap items-center gap-1.5 order-2 md:order-1">
        {FILTER_LEVELS.map((lvl) => (
          <button
            key={lvl}
            onClick={() => navigate({ level: lvl })}
            className={`text-xs font-semibold px-3.5 py-2 rounded-full transition ${
              currentLevel === lvl
                ? "bg-[#0f172a] text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {lvl === "All" ? "All Levels" : `${lvl} Level`}
          </button>
        ))}
      </div>

      {/* Language selector */}
      <div className="flex items-center gap-2 self-end md:self-auto order-1 md:order-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
        <select
          value={currentLang}
          onChange={(e) => navigate({ lang: e.target.value, level: "All" })}
          className="bg-transparent border-none text-sm font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
        >
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>
    </div>
  );
}
