// components/admin/StoryPreview.tsx
"use client";

import { useState } from "react";
import { LevelBadge } from "@/components/ui/LevelBadge";
import { StoryLineCard } from "@/components/story/StoryLineCard";
import type { StoryLine } from "@/types";

interface StoryPreviewProps {
  title: string;
  lang: string;
  level: string;
  meta: string;
  description: string;
  lines: StoryLine[];
}

/** Renders the story the way readers will see it (same line cards). */
export function StoryPreview({
  title,
  lang,
  level,
  meta,
  description,
  lines,
}: StoryPreviewProps) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  function speak(index: number) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lines[index].text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <LevelBadge meta={meta} level={level} />
        <h3 className="text-xl font-bold tracking-tight text-slate-900">
          {title.trim() || "Untitled story"}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          {description.trim() || "No description yet."}
        </p>
      </div>

      {lines.length === 0 ? (
        <p className="text-sm text-slate-400 py-6 text-center">
          Add sentences to see them here.
        </p>
      ) : (
        <div className="space-y-3">
          {lines.map((line, i) => (
            <StoryLineCard
              key={i}
              line={line}
              index={i}
              isCurrent={false}
              isSingleActive={false}
              isRevealed={!!revealed[i]}
              onPlaySingle={speak}
              onToggleReveal={(idx) =>
                setRevealed((prev) => ({ ...prev, [idx]: !prev[idx] }))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
