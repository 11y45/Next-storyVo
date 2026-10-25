// lib/actions/stories.ts
// Server-only data access. These functions are called from server components,
// so this file is NOT a "use server" file (that would expose every export as a
// public POST endpoint). `server-only` makes the build fail if a client
// component ever imports it by mistake.

import "server-only";

import { cache } from "react";
import { sql } from "@/lib/db";
import type { Story, StoryListItem, LanguageVersion, StoryLine } from "@/types";

// ─── Raw shapes returned by postgres.js ──────────────────────────────────────

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

interface RawVersionWithStory {
  id: string;
  story_id: string;
  lang: string;
  language: LanguageVersion["language"];
  level: LanguageVersion["level"];
  meta: string;
  description: string;
  line_count: number;
  s_id: string;
  s_slug: string;
  s_title: string;
  s_cover_image: string | null;
  s_published: boolean;
  s_created_at: string;
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
 *
 * Wrapped in cache(): generateMetadata() and the page both call this during
 * the same request, and cache() makes the second call reuse the first result
 * instead of running the 3 SQL queries again.
 */
export const fetchStoryBySlug = cache(
  async (slug: string): Promise<Story | null> => {
    // 1. Fetch the story row
    const stories = await sql`
      SELECT * FROM stories
      WHERE slug = ${slug} AND published = true
      LIMIT 1
    `;
    if (stories.length === 0) return null;
    const story = stories[0];

    // 2. Fetch all versions for this story
    const versions = await sql`
      SELECT * FROM story_versions
      WHERE story_id = ${story.id}
    `;
    if (versions.length === 0) return null;

    const versionIds = versions.map((v) => v.id);

    // 3. Fetch all lines for those versions in one query
    const lines = await sql`
      SELECT * FROM story_lines
      WHERE version_id = ANY(${sql.array(versionIds)})
      ORDER BY position ASC
    `;

    // 4. Group lines by version_id
    const linesByVersion: Record<string, RawLine[]> = {};
    for (const line of lines) {
      if (!linesByVersion[line.version_id])
        linesByVersion[line.version_id] = [];
      linesByVersion[line.version_id].push(line as RawLine);
    }

    // 5. Assemble the RawStory shape the mapper expects
    const rawStory: RawStory = {
      ...(story as Omit<RawStory, "story_versions">),
      story_versions: versions.map((v) => ({
        ...(v as Omit<RawVersion, "story_lines">),
        story_lines: linesByVersion[v.id] ?? [],
      })),
    };

    return mapStory(rawStory);
  },
);

/**
 * Fetch the lightweight list of stories for a given language.
 * Lines are excluded — only used for library cards.
 */
export const fetchStoriesByLanguage = cache(
  async (lang: string): Promise<StoryListItem[]> => {
    const rows = await sql`
      SELECT
        sv.id,
        sv.story_id,
        sv.lang,
        sv.language,
        sv.level,
        sv.meta,
        sv.description,
        COUNT(sl.id)::int AS line_count,
        s.id          AS s_id,
        s.slug        AS s_slug,
        s.title       AS s_title,
        s.cover_image AS s_cover_image,
        s.published   AS s_published,
        s.created_at  AS s_created_at
      FROM story_versions sv
      INNER JOIN stories s ON s.id = sv.story_id
      LEFT JOIN story_lines sl ON sl.version_id = sv.id
      WHERE sv.lang = ${lang}
        AND s.published = true
      GROUP BY sv.id, s.id
    `;

    return (rows as unknown as RawVersionWithStory[]).map(
      (row): StoryListItem => ({
        story: {
          id: row.s_id,
          slug: row.s_slug,
          title: row.s_title,
          coverImage: row.s_cover_image,
          createdAt: row.s_created_at,
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
        lineCount: row.line_count,
      }),
    );
  },
);
