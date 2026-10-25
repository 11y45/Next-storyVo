// lib/actions/admin.ts
"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import {
  checkPassword,
  endSession,
  isAdmin,
  startSession,
} from "@/lib/admin-auth";
import {
  LANGS,
  metaFor,
  parseLines,
  validateStory,
  type SaveResult,
  type StoryInput,
} from "@/lib/story-form";

type LineRow = {
  id: string;
  version_id: string;
  position: number;
  text: string;
  en: string;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login(
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) return { error: "Wrong password." };
  await startSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin");
}

// ─── Create / update ──────────────────────────────────────────────────────────

/**
 * Creates a story (no id) or updates one (with id).
 * Everything happens in one transaction: either the whole story is saved or
 * nothing is. On edit, a version's lines are replaced entirely, so removed
 * sentences don't linger in the database.
 */
export async function saveStory(
  input: StoryInput,
  id?: string,
): Promise<SaveResult> {
  if (!(await isAdmin())) return { ok: false, error: "Not authorized." };

  // The server never trusts the client: run the same checks again.
  const { errors } = validateStory(input);
  if (errors.length > 0) return { ok: false, error: errors[0] };

  const title = input.title.trim();
  const slug = input.slug.trim();
  const cover = input.coverImage.trim() || null;

  try {
    if (id) {
      const exists = await sql`SELECT 1 FROM stories WHERE id = ${id} LIMIT 1`;
      if (exists.length === 0) return { ok: false, error: "Story not found." };
    }

    const taken = id
      ? await sql`SELECT 1 FROM stories WHERE slug = ${slug} AND id <> ${id} LIMIT 1`
      : await sql`SELECT 1 FROM stories WHERE slug = ${slug} LIMIT 1`;
    if (taken.length > 0)
      return {
        ok: false,
        error: `The slug "${slug}" is already used by another story.`,
      };

    const storyId = await sql.begin(async (tx) => {
      let sid = id;

      if (!sid) {
        sid = randomUUID();
        await tx`
          INSERT INTO stories (id, slug, title, cover_image, published, created_at, updated_at)
          VALUES (${sid}, ${slug}, ${title}, ${cover}, ${input.published}, now(), now())
        `;
      } else {
        await tx`
          UPDATE stories
          SET slug = ${slug}, title = ${title}, cover_image = ${cover},
              published = ${input.published}, updated_at = now()
          WHERE id = ${sid}
        `;
      }

      const existing =
        await tx`SELECT id, lang FROM story_versions WHERE story_id = ${sid}`;

      for (const { lang, language } of LANGS) {
        const v = input.versions[lang];
        const found = existing.find((e) => e.lang === lang);

        // Language switched off: remove its version and lines.
        if (!v.enabled) {
          if (found) {
            await tx`DELETE FROM story_lines WHERE version_id = ${found.id}`;
            await tx`DELETE FROM story_versions WHERE id = ${found.id}`;
          }
          continue;
        }

        const versionId: string = found?.id ?? randomUUID();
        const meta = metaFor(language, v.level);
        const description = v.description.trim();

        if (found) {
          await tx`
            UPDATE story_versions
            SET language = ${language}, level = ${v.level},
                meta = ${meta}, description = ${description}
            WHERE id = ${versionId}
          `;
        } else {
          await tx`
            INSERT INTO story_versions (id, story_id, lang, language, level, meta, description)
            VALUES (${versionId}, ${sid}, ${lang}, ${language}, ${v.level}, ${meta}, ${description})
          `;
        }

        await tx`DELETE FROM story_lines WHERE version_id = ${versionId}`;

        const rows: LineRow[] = parseLines(v.linesText).lines.map((l, i) => ({
          id: randomUUID(),
          version_id: versionId,
          position: i,
          text: l.text,
          en: l.en,
        }));

        await tx`
          INSERT INTO story_lines ${tx(rows, "id", "version_id", "position", "text", "en")}
        `;
      }

      return sid;
    });

    revalidatePath("/", "layout");
    return { ok: true, id: storyId };
  } catch (err) {
    console.error("saveStory failed:", err);
    if (typeof err === "object" && err && "code" in err && err.code === "23505")
      return {
        ok: false,
        error: "A unique value (probably the slug) already exists.",
      };
    return {
      ok: false,
      error: "Could not save the story. Check the server logs.",
    };
  }
}

// ─── Publish toggle / delete ──────────────────────────────────────────────────

export async function setPublished(
  id: string,
  published: boolean,
): Promise<{ ok: boolean }> {
  if (!(await isAdmin())) return { ok: false };
  await sql`UPDATE stories SET published = ${published}, updated_at = now() WHERE id = ${id}`;
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteStory(id: string): Promise<{ ok: boolean }> {
  if (!(await isAdmin())) return { ok: false };

  await sql.begin(async (tx) => {
    await tx`
      DELETE FROM story_lines
      WHERE version_id IN (SELECT id FROM story_versions WHERE story_id = ${id})
    `;
    await tx`DELETE FROM story_versions WHERE story_id = ${id}`;
    await tx`DELETE FROM stories WHERE id = ${id}`;
  });

  revalidatePath("/", "layout");
  return { ok: true };
}
