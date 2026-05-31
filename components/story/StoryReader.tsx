// components/story/StoryReader.tsx
"use client";

import { useState, useCallback } from "react";
import { useAudioPlayer } from "@/lib/useAudioPlayer";
import { StoryLineCard } from "@/components/story/StoryLineCard";
import { AudioPlayer } from "@/components/story/AudioPlayer";
import type { StoryLine } from "@/types";

interface StoryReaderProps {
  lines: StoryLine[];
  lang: string;
}

export function StoryReader({ lines, lang }: StoryReaderProps) {
  const [revealedLines, setRevealedLines] = useState<Record<number, boolean>>(
    {},
  );
  const [singleActiveIndex, setSingleActiveIndex] = useState<number | null>(
    null,
  );

  const { isPlaying, currentIndex, totalLines, togglePlay, prev, next, goTo } =
    useAudioPlayer(lines, lang);

  const toggleReveal = (index: number) =>
    setRevealedLines((prev) => ({ ...prev, [index]: !prev[index] }));

  const playSingleLine = useCallback(
    (index: number) => {
      if (singleActiveIndex === index) {
        window.speechSynthesis.cancel();
        setSingleActiveIndex(null);
        return;
      }

      window.speechSynthesis.cancel();
      setSingleActiveIndex(index);

      const utterance = new SpeechSynthesisUtterance(lines[index].text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.onend = () => setSingleActiveIndex(null);

      window.speechSynthesis.speak(utterance);
    },
    [singleActiveIndex, lines, lang],
  );

  return (
    <>
      <section className="space-y-4 pt-2">
        {lines.map((line, idx) => (
          <StoryLineCard
            key={idx}
            line={line}
            index={idx}
            isCurrent={idx === currentIndex && isPlaying}
            isSingleActive={singleActiveIndex === idx}
            isRevealed={!!revealedLines[idx]}
            onPlaySingle={playSingleLine}
            onToggleReveal={toggleReveal}
          />
        ))}
      </section>

      <AudioPlayer
        isPlaying={isPlaying}
        currentIndex={currentIndex}
        totalLines={totalLines}
        isSinglePlaying={singleActiveIndex !== null}
        onTogglePlay={togglePlay}
        onPrev={prev}
        onNext={next}
        onSeek={goTo}
      />
    </>
  );
}
