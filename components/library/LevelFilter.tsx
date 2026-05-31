// components/library/LevelFilter.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { FILTER_GROUPS, type FilterGroup } from "@/lib/stories";
import type { SupportedLang } from "@/types";

interface LevelFilterProps {
  currentLang: SupportedLang;
  currentGroup: FilterGroup;
}

export function LevelFilter({ currentLang, currentGroup }: LevelFilterProps) {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setTooltip(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function navigate(group: FilterGroup) {
    const params = new URLSearchParams();
    params.set("lang", currentLang);
    if (group !== "All") params.set("group", group);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {FILTER_GROUPS.map((g) => (
        <div key={g.label} className="relative flex items-center gap-1">
          <button
            onClick={() => navigate(g.label as FilterGroup)}
            className={`text-xs font-semibold px-3.5 py-2 rounded-full transition ${
              currentGroup === g.label
                ? "bg-[#0f172a] text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {g.label === "All" ? "All Levels" : `${g.label} Level`}
          </button>

          {g.description && (
            <div ref={tooltip === g.label ? tooltipRef : undefined} className="relative">
              <button
                onClick={() => setTooltip(tooltip === g.label ? null : g.label)}
                aria-label={`What is ${g.label} level?`}
                className="text-slate-300 hover:text-slate-500 transition"
              >
                <Info className="w-3.5 h-3.5" />
              </button>

              {tooltip === g.label && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 bg-slate-900 text-white text-[11px] font-medium rounded-xl px-3 py-2 shadow-lg z-20 leading-snug animate-in fade-in duration-150">
                  <span className="font-bold text-blue-300">{g.label}</span> — {g.description}
                  <span className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-slate-900" />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
