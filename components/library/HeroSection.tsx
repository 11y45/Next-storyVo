// components/library/HeroSection.tsx
"use client";

import { BookOpen, Play, Square, Volume2 } from "lucide-react";
import { usePreviewPlayer, type PreviewLine } from "@/lib/hooks/usePreviewPlayer";
import type { SupportedLang } from "@/types";

// Static preview lines — these are marketing copy, not story data,
// so they live here rather than in the DB.
const PREVIEW_LINES: Record<SupportedLang, PreviewLine[]> = {
  es: [
    {
      id: 1,
      text: "Un zorro curioso aprende que el ingenio vale más que la velocidad.",
      translation: "A curious fox learns that wit is worth more than speed.",
    },
    {
      id: 2,
      text: "Vive en un bosque lleno de secretos profundos.",
      translation: "He lives in a forest full of deep secrets.",
    },
  ],
  fr: [
    {
      id: 1,
      text: "Un petit café s'ouvre chaque matin à Paris.",
      translation: "A small café opens every morning in Paris.",
    },
    {
      id: 2,
      text: "Les arômes de croissants frais remplissent la rue.",
      translation: "The aromas of fresh croissants fill the street.",
    },
  ],
};

const PREVIEW_TITLE: Record<SupportedLang, string> = {
  es: "The Clever Little Fox",
  fr: "Le Petit Café Parisien",
};

interface HeroSectionProps {
  lang: SupportedLang;
}

export function HeroSection({ lang }: HeroSectionProps) {
  const lines = PREVIEW_LINES[lang];
  const { isPlaying, activeLineId, revealedLines, playSingle, togglePlayAll, toggleReveal } =
    usePreviewPlayer(lang);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left copy */}
      <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left lg:pt-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15] text-slate-900">
          Learn a language, <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
            one story at a time.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
          Beautifully written short stories with sentence-by-sentence translations. Tap any line
          to reveal its meaning — at your own pace.
        </p>
        <div className="pt-2 flex justify-center lg:justify-start">
          <button className="bg-[#0f172a] text-white font-medium px-6 py-3 rounded-xl shadow-sm hover:bg-slate-800 transition w-full sm:w-auto">
            Start Reading Free
          </button>
        </div>
      </div>

      {/* Right preview widget */}
      <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
          {/* Widget header */}
          <div className="bg-blue-50 border border-blue-100/50 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2.5 rounded-lg shadow-sm text-blue-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-blue-600 tracking-wider uppercase">
                  Previewing
                </span>
                <h4 className="font-bold text-slate-800 text-sm">{PREVIEW_TITLE[lang]}</h4>
              </div>
            </div>
            <button
              onClick={() => togglePlayAll(lines)}
              className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition shadow-md"
              aria-label={isPlaying || activeLineId !== null ? "Stop preview" : "Play preview"}
            >
              {isPlaying || activeLineId !== null ? (
                <Square className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
            </button>
          </div>

          {/* Preview lines */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Tap text for translation • Click icon for audio
            </p>

            {lines.map((line) => (
              <div
                key={line.id}
                className={`transition-all duration-200 border rounded-xl p-3 flex items-start gap-3 ${
                  activeLineId === line.id
                    ? "border-blue-400 bg-blue-50/30 shadow-sm shadow-blue-100"
                    : "border-slate-100 hover:border-slate-200 bg-white"
                }`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playSingle(line);
                  }}
                  aria-label={`Play sentence ${line.id}`}
                  className={`p-2 rounded-lg transition shrink-0 flex items-center justify-center w-8 h-8 ${
                    activeLineId === line.id
                      ? "bg-blue-100 text-blue-600"
                      : "bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {activeLineId === line.id ? (
                    <Volume2 className="w-4 h-4 animate-pulse" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                </button>

                <div
                  onClick={() => toggleReveal(line.id)}
                  className="cursor-pointer grow select-none min-w-0"
                  role="button"
                  aria-label="Toggle translation"
                >
                  <p
                    className={`text-sm font-medium leading-snug wrap-break-word ${
                      activeLineId === line.id ? "text-blue-800" : "text-slate-800"
                    }`}
                  >
                    {line.text}
                  </p>
                  {revealedLines[line.id] && (
                    <p className="text-xs text-blue-600 font-medium wrap-break-word mt-1.5 border-t border-slate-50 pt-1.5 animate-in fade-in duration-200">
                      {line.translation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
