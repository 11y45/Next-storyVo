// lib/useAudioPlayer.ts
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { StoryLine } from "@/types";

export function useAudioPlayer(lines: StoryLine[], lang: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Refs so that utterance.onend callbacks always see the latest values
  // without needing to be recreated.
  const isPlayingRef = useRef(false);
  const currentIndexRef = useRef(0);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []);

  // ─── Core play function ───────────────────────────────────────────────────
  // playSentence is stable (useCallback with [lines, lang]) so it is safe to
  // call directly from utterance.onend — no extra ref layer needed.
  // The previous code computed `next = currentIndexRef.current + 1` inside
  // onend but then called playNextRef.current() which re-read the ref without
  // the +1, causing the same sentence to repeat.
  const playSentence = useCallback(
    (index: number) => {
      window.speechSynthesis.cancel();

      if (index < 0 || index >= lines.length) {
        setIsPlaying(false);
        setCurrentIndex(0);
        isPlayingRef.current = false;
        currentIndexRef.current = 0;
        return;
      }

      setCurrentIndex(index);
      currentIndexRef.current = index;

      const utterance = new SpeechSynthesisUtterance(lines[index].text);
      utterance.lang = lang;
      utterance.rate = 0.9;

      utterance.onend = () => {
        if (!isPlayingRef.current) return;

        const next = currentIndexRef.current + 1; // ✅ correctly incremented
        if (next < lines.length) {
          playSentence(next); // ✅ passed directly — stable ref, no extra layer
        } else {
          // Reached the end
          setIsPlaying(false);
          setCurrentIndex(0);
          isPlayingRef.current = false;
          currentIndexRef.current = 0;
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [lines, lang],
  );

  // ─── Public controls ──────────────────────────────────────────────────────

  const togglePlay = useCallback(() => {
    const next = !isPlayingRef.current;
    setIsPlaying(next);
    isPlayingRef.current = next;

    if (next) {
      playSentence(currentIndexRef.current);
    } else {
      window.speechSynthesis.cancel();
    }
  }, [playSentence]);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(lines.length - 1, index));
      setCurrentIndex(clamped);
      currentIndexRef.current = clamped;
      if (isPlayingRef.current) playSentence(clamped);
    },
    [lines.length, playSentence],
  );

  const prev = useCallback(
    () => goTo(currentIndexRef.current - 1),
    [goTo],
  );

  const next = useCallback(
    () => goTo(currentIndexRef.current + 1),
    [goTo],
  );

  /** Start playing from a specific line (e.g. clicking a line's play button). */
  const playFromLine = useCallback(
    (index: number) => {
      setIsPlaying(true);
      isPlayingRef.current = true;
      playSentence(index);
    },
    [playSentence],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  return {
    isPlaying,
    currentIndex,
    totalLines: lines.length,
    togglePlay,
    prev,
    next,
    goTo,
    playFromLine,
    stop,
  };
}
