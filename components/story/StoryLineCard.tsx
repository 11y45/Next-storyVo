// components/story/StoryLineCard.tsx
"use client";

import { Play, Volume2 } from "lucide-react";
import type { StoryLine } from "@/types";

interface StoryLineCardProps {
  line: StoryLine;
  index: number;
  /** True when the global sequential player is on this line */
  isCurrent: boolean;
  /** True when this line is playing via its own play button */
  isSingleActive: boolean;
  isRevealed: boolean;
  onPlaySingle: (index: number) => void;
  onToggleReveal: (index: number) => void;
}

export function StoryLineCard({
  line,
  index,
  isCurrent,
  isSingleActive,
  isRevealed,
  onPlaySingle,
  onToggleReveal,
}: StoryLineCardProps) {
  const isActive = isCurrent || isSingleActive;

  return (
    <div
      className={`border rounded-xl p-4 flex items-start gap-4 transition-all duration-200 ${
        isActive
          ? "border-blue-400 bg-blue-50/30 shadow-sm shadow-blue-100"
          : "bg-white border-slate-100 hover:border-slate-200"
      }`}
    >
      {/* Play / stop button — plays this sentence only */}
      <button
        onClick={() => onPlaySingle(index)}
        aria-label={
          isSingleActive
            ? `Stop sentence ${index + 1}`
            : `Play sentence ${index + 1}`
        }
        className={`mt-0.5 p-2 rounded-lg transition shrink-0 ${
          isActive
            ? "bg-blue-100 text-blue-600"
            : "bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
        }`}
      >
        {isSingleActive ? (
          <Volume2 className="w-4 h-4 animate-pulse" />
        ) : isCurrent ? (
          <Volume2 className="w-4 h-4 animate-pulse" />
        ) : (
          <Play className="w-4 h-4 fill-current" />
        )}
      </button>

      {/* Text + translation */}
      <div
        onClick={() => onToggleReveal(index)}
        className="cursor-pointer grow select-none"
        role="button"
        aria-label="Toggle translation"
      >
        <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed">
          {line.text}
        </p>
        {isRevealed && (
          <p className="text-sm sm:text-base text-blue-600 mt-2 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
            {line.en}
          </p>
        )}
      </div>
    </div>
  );
}
