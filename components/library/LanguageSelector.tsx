// components/library/LanguageSelector.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import type { SupportedLang } from "@/types";

const LANGUAGES: {
  value: SupportedLang;
  label: string;
  flag: string;
  native: string;
}[] = [
  { value: "es", label: "Spanish", flag: "🇪🇸", native: "Español" },
  { value: "fr", label: "French", flag: "🇫🇷", native: "Français" },
];

interface LanguageSelectorProps {
  currentLang: SupportedLang;
  currentLevel: string;
}

export function LanguageSelector({
  currentLang,
  currentLevel,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const current = LANGUAGES.find((l) => l.value === currentLang)!;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function select(lang: SupportedLang) {
    setOpen(false);
    const params = new URLSearchParams();
    params.set("lang", lang);
    // Reset level when language changes — same as before
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm hover:border-slate-300 transition text-sm font-bold text-slate-800"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-lg shadow-slate-200/60 overflow-hidden z-20 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="p-1.5 space-y-0.5">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.value === currentLang;
              return (
                <button
                  key={lang.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => select(lang.value)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition ${
                    isSelected
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <div className="grow">
                    <p className="text-sm font-semibold leading-none">
                      {lang.label}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {lang.native}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
