// components/library/FilterControls.tsx
"use client";

import { LevelFilter } from "@/components/library/LevelFilter";
import { LanguageSelector } from "@/components/library/LanguageSelector";
import type { SupportedLang } from "@/types";
import type { FilterGroup } from "@/lib/stories";

interface FilterControlsProps {
  currentLang: SupportedLang;
  currentGroup: FilterGroup;
}

export function FilterControls({ currentLang, currentGroup }: FilterControlsProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <div className="order-2 md:order-1">
        <LevelFilter currentLang={currentLang} currentGroup={currentGroup} />
      </div>
      <div className="order-1 md:order-2 self-end md:self-auto">
        <LanguageSelector currentLang={currentLang} currentLevel={currentGroup} />
      </div>
    </div>
  );
}
