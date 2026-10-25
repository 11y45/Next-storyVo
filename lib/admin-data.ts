// lib/admin-data.ts
// Admin-only reads. Unlike the public queries, these include unpublished stories.
// Every function checks auth itself: layouts are not a security boundary.

import "server-only";

import { sql } from "@/lib/db";
import { assertAdmin } from "@/lib/admin-auth";
import {
  LANGS,
  emptyStoryInput,
  emptyVersion,
  type StoryInput,
} from "@/lib/story-form";

export interface AdminStoryRow {
  id: string;
  slug: string;
  title: string;
  coverImage: string | null;
  published: boolean;
  versions: { lang: string; level: string; lines: number }[];
}

export async function listAdminStories(): Promise<AdminStoryRow[]> {
  await assertAdmin();

  const rows = await sql`
    WITH counts AS (
      SELECT version_id, COUNT(*)::int AS n
      FROM story_lines
      GROUP BY version_id
    )
    SELECT
      s.id,
      s.slug,
      s.title,
      s.cover_image,
      s.published,
      COALESCE(
        json_agg(
          json_build_object('lang', sv.lang, 'level', sv.level, 'lines', COALESCE(c.n, 0))
          ORDER BY sv.lang
        ) FILTER (WHERE sv.id IS NOT NULL),
        '[]'::json
      ) AS versions
    FROM stories s
    LEFT JOIN story_versions sv ON sv.story_id = s.id
    LEFT JOIN counts c ON c.version_id = sv.id
    GROUP BY s.id
    ORDER BY s.created_at DESC
  `;

  return rows.map((r) => ({
    id: r.id as string,
    slug: r.slug as string,
    title: r.title as string,
    coverImage: (r.cover_image as string | null) ?? null,
    published: r.published as boolean,
    versions: r.versions as AdminStoryRow["versions"],
  }));
}

/** Loads a story (published or not) in the exact shape the form edits. */
export async function getStoryForEdit(id: string): Promise<StoryInput | null> {
  await assertAdmin();

  const stories = await sql`SELECT * FROM stories WHERE id = ${id} LIMIT 1`;
  if (stories.length === 0) return null;
  const story = stories[0];

  const versions = await sql`SELECT * FROM story_versions WHERE story_id = ${id}`;
  const versionIds = versions.map((v) => v.id);
  const lines =
    versionIds.length > 0
      ? await sql`
          SELECT * FROM story_lines
          WHERE version_id = ANY(${sql.array(versionIds)})
          ORDER BY position ASC
        `
      : [];

  const input = emptyStoryInput();
  input.title = story.title;
  input.slug = story.slug;
  input.coverImage = story.cover_image ?? "";
  input.published = story.published;

  for (const { lang } of LANGS) {
    const v = versions.find((x) => x.lang === lang);
    if (!v) {
      input.versions[lang] = emptyVersion(); // disabled
      continue;
    }
    input.versions[lang] = {
      enabled: true,
      level: v.level,
      description: v.description,
      linesText: lines
        .filter((l) => l.version_id === v.id)
        .map((l) => `${l.text} | ${l.en}`)
        .join("\n"),
    };
  }

  return input;
}
