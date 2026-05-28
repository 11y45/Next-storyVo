// types/index.ts

export interface StoryLine {
  text: string;
  en: string;
}

export interface LanguageVersion {
  /** DB primary key for this version row */
  id: string;
  storyId: string;
  lang: string;
  language: string;
  level: CEFRLevel;
  meta: string;
  description: string;
  lines: StoryLine[];
}

export interface Story {
  /** DB primary key */
  id: string;
  /** URL-friendly identifier — unique, indexed */
  slug: string;
  title: string;
  coverImage: string | null;
  published: boolean;
  createdAt: string; // ISO-8601
  updatedAt: string;
  versions: Record<string, LanguageVersion>;
}

/**
 * Lightweight shape for list / card views.
 * Lines are excluded to keep the payload small — fetch the full Story
 * only on the detail page.
 */
export interface StoryListItem {
  story: Pick<Story, "id" | "slug" | "title" | "coverImage" | "createdAt">;
  version: Omit<LanguageVersion, "lines">;
  lineCount: number;
}

export type SupportedLang = "es" | "fr";
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
