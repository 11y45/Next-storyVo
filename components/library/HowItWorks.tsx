// components/library/HowItWorks.tsx
// No "use client" — static content, server rendered.

const STEPS = [
  {
    emoji: "📖",
    step: "Step 1",
    title: "Pick a story",
    description:
      "Choose from stories in Spanish or French, filtered by your level.",
  },
  {
    emoji: "👆",
    step: "Step 2",
    title: "Tap to translate",
    description:
      "Read sentence by sentence. Tap any line to instantly reveal its English translation.",
  },
  {
    emoji: "🔊",
    step: "Step 3",
    title: "Listen along",
    description:
      "Play the audio for any sentence, or let the whole story read itself to you.",
  },
];

export function HowItWorks() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {STEPS.map((s, i) => (
        <div
          key={i}
          className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {s.step}
            </span>
            <span className="text-2xl">{s.emoji}</span>
          </div>
          <div>
            <p className="font-bold text-slate-900">{s.title}</p>
            <p className="text-sm text-slate-500 mt-1 leading-snug">
              {s.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
