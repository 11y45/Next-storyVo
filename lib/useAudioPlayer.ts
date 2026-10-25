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

  // Holds the latest playSentence. utterance.onend calls it through this ref
  // so playSentence never has to reference itself while it is being declared.
  const playSentenceRef = useRef<(index: number) => void>(() => {});

  // ─── Core play function ───────────────────────────────────────────────────
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

        const next = currentIndexRef.current + 1;
        if (next < lines.length) {
          playSentenceRef.current(next);
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

  // Keep the ref pointing at the newest playSentence (after each render).
  useEffect(() => {
    playSentenceRef.current = playSentence;
  }, [playSentence]);

  // ─── Public controls ──────────────────────────────────────────────────────

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []);

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

  const prev = useCallback(() => goTo(currentIndexRef.current - 1), [goTo]);

  const next = useCallback(() => goTo(currentIndexRef.current + 1), [goTo]);

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
    stop,
  };
}
