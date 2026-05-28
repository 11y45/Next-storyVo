// lib/hooks/usePreviewPlayer.ts
"use client";

import { useState, useCallback, useEffect } from "react";
import type { SupportedLang } from "@/types";

export interface PreviewLine {
  id: number;
  text: string;
  translation: string;
}

export function usePreviewPlayer(lang: SupportedLang) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineId, setActiveLineId] = useState<number | null>(null);
  const [revealedLines, setRevealedLines] = useState<Record<number, boolean>>({});

  const browserLang = lang === "es" ? "es-ES" : "fr-FR";

  // Reset state whenever the language changes
  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setActiveLineId(null);
    setRevealedLines({});
  }, [lang]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setActiveLineId(null);
  }, []);

  /** Play / stop a single line. Clicking the active line stops it. */
  const playSingle = useCallback(
    (line: PreviewLine) => {
      if (activeLineId === line.id) {
        stop();
        return;
      }
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setActiveLineId(line.id);

      const utterance = new SpeechSynthesisUtterance(line.text);
      utterance.lang = browserLang;
      utterance.onend = () => setActiveLineId(null);
      window.speechSynthesis.speak(utterance);
    },
    [activeLineId, browserLang, stop],
  );

  /** Play all lines in sequence. */
  const playAll = useCallback(
    (lines: PreviewLine[]) => {
      let i = 0;
      setIsPlaying(true);

      const playNext = () => {
        if (i >= lines.length) {
          setIsPlaying(false);
          setActiveLineId(null);
          return;
        }
        setActiveLineId(lines[i].id);
        const utterance = new SpeechSynthesisUtterance(lines[i].text);
        utterance.lang = browserLang;
        utterance.onend = () => {
          i++;
          playNext();
        };
        window.speechSynthesis.speak(utterance);
      };

      playNext();
    },
    [browserLang],
  );

  /** Toggle full playback. */
  const togglePlayAll = useCallback(
    (lines: PreviewLine[]) => {
      if (isPlaying || activeLineId !== null) {
        stop();
      } else {
        playAll(lines);
      }
    },
    [isPlaying, activeLineId, stop, playAll],
  );

  const toggleReveal = useCallback((id: number) => {
    setRevealedLines((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return {
    isPlaying,
    activeLineId,
    revealedLines,
    playSingle,
    togglePlayAll,
    toggleReveal,
    stop,
  };
}
