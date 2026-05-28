"use client";

import { Play, Square, ChevronLeft, ChevronRight } from "lucide-react";

interface AudioPlayerProps {
  isPlaying: boolean;
  currentIndex: number;
  totalLines: number;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (index: number) => void;
}

export function AudioPlayer({
  isPlaying,
  currentIndex,
  totalLines,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
}: AudioPlayerProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl px-4 py-2.5 z-50">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            aria-label="Previous sentence"
            className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 transition rounded-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 active:scale-95 transition-all shadow-sm flex items-center justify-center"
          >
            {isPlaying ? (
              <Square className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
          </button>

          <button
            onClick={onNext}
            disabled={currentIndex === totalLines - 1}
            aria-label="Next sentence"
            className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 transition rounded-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Seek slider */}
        <div className="grow flex items-center gap-3">
          <span className="text-[11px] font-mono font-bold text-slate-400 whitespace-nowrap tabular-nums">
            {currentIndex + 1} / {totalLines}
          </span>
          <input
            type="range"
            min={0}
            max={totalLines - 1}
            value={currentIndex}
            onChange={(e) => onSeek(parseInt(e.target.value, 10))}
            aria-label="Sentence position"
            className="grow h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          />
        </div>
      </div>
    </footer>
  );
}
