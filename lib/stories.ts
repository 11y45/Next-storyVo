// lib/stories.ts
// Story data and DB queries have moved to:
//   data/stories.ts        ← seed data
//   lib/actions/stories.ts ← server actions (queries)

export const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-green-50 text-green-700 border-green-100",
  A2: "bg-emerald-50 text-emerald-700 border-emerald-100",
  B1: "bg-sky-50 text-sky-700 border-sky-100",
  B2: "bg-blue-50 text-blue-700 border-blue-100",
  C1: "bg-violet-50 text-violet-700 border-violet-100",
  C2: "bg-rose-50 text-rose-700 border-rose-100",
};

export const SUPPORTED_LANGS = ["es", "fr"] as const;
export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export const FILTER_LEVELS = ["All", "A2", "B2", "C1"] as const;
