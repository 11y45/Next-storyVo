// lib/actions/stories.ts
"use server";

import { STORIES_SEED } from "@/data/stories";
import type { Story, StoryListItem } from "@/types";

// ─── DB stub ──────────────────────────────────────────────────────────────────
// Every function goes through this wrapper so the call-sites are already async.
// When you add Prisma / Drizzle / Supabase, replace the body here (or per-function)
// and delete data/stories.ts.
//
// Example Prisma replacement:
//   async function fetchStoryBySlug(slug: string) {
//     return prisma.story.findFirst({ where: { slug, published: true },
//       include: { versions: { include: { lines: { orderBy: { position: "asc" } } } } }
//     });
//   }
// ─────────────────────────────────────────────────────────────────────────────

async function simulateDb<T>(value: T): Promise<T> {
  return value;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Fetch a single, fully-populated story by its URL slug.
 * Used on the story detail page — includes all lines.
 */
export async function fetchStoryBySlug(slug: string): Promise<Story | null> {
  const story =
    STORIES_SEED.find((s) => s.slug === slug && s.published) ?? null;
  return simulateDb(story);
}

/**
 * Fetch the lightweight list of stories for a given language.
 * Lines are excluded — use fetchStoryBySlug for the full content.
 */
export async function fetchStoriesByLanguage(
  lang: string,
): Promise<StoryListItem[]> {
  const items = STORIES_SEED.filter(
    (s) => s.published && !!s.versions[lang],
  ).map((s): StoryListItem => {
    const { lines, ...versionWithoutLines } = s.versions[lang];
    return {
      story: {
        id: s.id,
        slug: s.slug,
        title: s.title,
        coverImage: s.coverImage,
        createdAt: s.createdAt,
      },
      version: versionWithoutLines,
      lineCount: lines.length,
    };
  });
  return simulateDb(items);
}

/**
 * Fetch stories for multiple languages in a single call.
 * Useful for SSR pages that need to hydrate client-side language switching.
 */
export async function fetchStoriesForLanguages(
  langs: string[],
): Promise<Record<string, StoryListItem[]>> {
  const entries = await Promise.all(
    langs.map(async (lang) => [lang, await fetchStoriesByLanguage(lang)] as const),
  );
  return Object.fromEntries(entries);
}
