// lib/stories.ts

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

// Filter groups — A/B/C each cover both sub-levels.
// Stories keep their exact level (A2, B1 etc.) on their badges.
export const FILTER_GROUPS = [
  { label: "All",   description: null,                        levels: null },
  { label: "A",     description: "Beginner & Elementary",     levels: ["A1", "A2"] },
  { label: "B",     description: "Intermediate",              levels: ["B1", "B2"] },
  { label: "C",     description: "Advanced",                  levels: ["C1", "C2"] },
] as const;

export type FilterGroup = "All" | "A" | "B" | "C";
