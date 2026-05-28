// components/story/StoryReader.tsx
"use client";

import { useState } from "react";
import { useAudioPlayer } from "@/lib/useAudioPlayer";
import { StoryLineCard } from "@/components/story/StoryLineCard";
import { AudioPlayer } from "@/components/story/AudioPlayer";
import type { StoryLine } from "@/types";

interface StoryReaderProps {
  lines: StoryLine[];
  lang: string;
}

export function StoryReader({ lines, lang }: StoryReaderProps) {
  const [revealedLines, setRevealedLines] = useState<Record<number, boolean>>({});

  const { isPlaying, currentIndex, totalLines, togglePlay, prev, next, goTo, playFromLine } =
    useAudioPlayer(lines, lang);

  const toggleReveal = (index: number) =>
    setRevealedLines((prev) => ({ ...prev, [index]: !prev[index] }));

  return (
    <>
      <section className="space-y-4 pt-2">
        {lines.map((line, idx) => (
          <StoryLineCard
            key={idx}
            line={line}
            index={idx}
            isCurrent={idx === currentIndex && isPlaying}
            isRevealed={!!revealedLines[idx]}
            onPlay={playFromLine}
            onToggleReveal={toggleReveal}
          />
        ))}
      </section>

      <AudioPlayer
        isPlaying={isPlaying}
        currentIndex={currentIndex}
        totalLines={totalLines}
        onTogglePlay={togglePlay}
        onPrev={prev}
        onNext={next}
        onSeek={goTo}
      />
    </>
  );
}
