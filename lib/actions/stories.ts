// lib/actions/stories.ts
"use server";

import { createClient } from "@supabase/supabase-js";
import type { Story, StoryListItem, LanguageVersion, StoryLine } from "@/types";

// ─── Supabase client ──────────────────────────────────────────────────────────
// Values live in .env.local — never commit those to git.
//
// NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// ─── Raw shapes returned by Supabase ─────────────────────────────────────────
// Supabase returns snake_case columns, so we map them to our camelCase types.

interface RawLine {
  id: string;
  version_id: string;
  position: number;
  text: string;
  en: string;
}

interface RawVersion {
  id: string;
  story_id: string;
  lang: string;
  language: string;
  level: string;
  meta: string;
  description: string;
  story_lines: RawLine[];
}

interface RawStory {
  id: string;
  slug: string;
  title: string;
  cover_image: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  story_versions: RawVersion[];
}

/** Shape returned by fetchStoriesByLanguage — version row with nested story */
interface RawVersionWithStory {
  id: string;
  story_id: string;
  lang: string;
  language: string;
  level: LanguageVersion["level"];
  meta: string;
  description: string;
  story_lines: { id: string }[];
  // many versions → one story, so Supabase returns an object here, not an array
  stories: {
    id: string;
    slug: string;
    title: string;
    cover_image: string | null;
    published: boolean;
    created_at: string;
  };
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapLine(raw: RawLine): StoryLine {
  return {
    text: raw.text,
    en: raw.en,
  };
}

function mapVersion(raw: RawVersion): LanguageVersion {
  const lines = [...raw.story_lines]
    .sort((a, b) => a.position - b.position)
    .map(mapLine);

  return {
    id: raw.id,
    storyId: raw.story_id,
    lang: raw.lang,
    language: raw.language,
    level: raw.level as LanguageVersion["level"],
    meta: raw.meta,
    description: raw.description,
    lines,
  };
}

function mapStory(raw: RawStory): Story {
  const versions: Story["versions"] = {};
  for (const v of raw.story_versions) {
    versions[v.lang] = mapVersion(v);
  }
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    coverImage: raw.cover_image,
    published: raw.published,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    versions,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Fetch a single fully-populated story by its URL slug.
 * Used on the story detail page — includes all versions and lines.
 */
export async function fetchStoryBySlug(slug: string): Promise<Story | null> {
  const { data, error } = await supabase
    .from("stories")
    .select(
      `
      *,
      story_versions (
        *,
        story_lines (*)
      )
    `,
    )
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) return null;
  return mapStory(data as RawStory);
}

/**
 * Fetch the lightweight list of stories for a given language.
 * Lines are excluded — only used for library cards.
 */
export async function fetchStoriesByLanguage(
  lang: string,
): Promise<StoryListItem[]> {
  const { data, error } = await supabase
    .from("story_versions")
    .select(
      `
      id,
      story_id,
      lang,
      language,
      level,
      meta,
      description,
      story_lines (id),
      stories!inner (
        id,
        slug,
        title,
        cover_image,
        published,
        created_at
      )
    `,
    )
    .eq("lang", lang)
    .eq("stories.published", true);

  if (error || !data) return [];

  return (data as unknown as RawVersionWithStory[]).map(
    (row): StoryListItem => {
      const story = row.stories;
      return {
        story: {
          id: story.id,
          slug: story.slug,
          title: story.title,
          coverImage: story.cover_image,
          createdAt: story.created_at,
        },
        version: {
          id: row.id,
          storyId: row.story_id,
          lang: row.lang,
          language: row.language,
          level: row.level,
          meta: row.meta,
          description: row.description,
        },
        lineCount: row.story_lines.length,
      };
    },
  );
}

/**
 * Fetch stories for multiple languages in one call.
 * Used when SSR needs to hydrate client-side language switching.
 */
export async function fetchStoriesForLanguages(
  langs: string[],
): Promise<Record<string, StoryListItem[]>> {
  const entries = await Promise.all(
    langs.map(
      async (lang) => [lang, await fetchStoriesByLanguage(lang)] as const,
    ),
  );
  return Object.fromEntries(entries);
}
