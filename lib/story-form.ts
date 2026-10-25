// lib/story-form.ts
// Shared between the admin form (client) and the save action (server), so the
// exact same checks run in both places. No "server-only" here on purpose.

import { CEFR_LEVELS } from "@/lib/stories";
import type { StoryLine } from "@/types";

export const LANGS = [
  { lang: "es", language: "Spanish" },
  { lang: "fr", language: "French" },
] as const;

export type LangCode = (typeof LANGS)[number]["lang"];

export interface VersionInput {
  enabled: boolean;
  level: string;
  description: string;
  /** One sentence per line, formatted as: "text | English translation" */
  linesText: string;
}

export interface StoryInput {
  title: string;
  slug: string;
  coverImage: string;
  published: boolean;
  versions: Record<LangCode, VersionInput>;
}

export type SaveResult = { ok: true; id: string } | { ok: false; error: string };

export function emptyVersion(): VersionInput {
  return { enabled: false, level: "A1", description: "", linesText: "" };
}

export function emptyStoryInput(): StoryInput {
  return {
    title: "",
    slug: "",
    coverImage: "",
    published: false, // new stories start as drafts
    versions: {
      es: { ...emptyVersion(), enabled: true },
      fr: { ...emptyVersion(), enabled: true },
    },
  };
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Badge label, e.g. "Spanish · B1" */
export function metaFor(language: string, level: string): string {
  return `${language} · ${level}`;
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Turns the textarea content into lines.
 * Splits each non-empty line on the FIRST "|".
 */
export function parseLines(text: string): {
  lines: StoryLine[];
  errors: string[];
} {
  const lines: StoryLine[] = [];
  const errors: string[] = [];

  text.split(/\r?\n/).forEach((raw, i) => {
    if (!raw.trim()) return;
    const n = i + 1;
    const bar = raw.indexOf("|");
    if (bar === -1) {
      errors.push(`Line ${n}: missing "|" between the sentence and its English translation.`);
      return;
    }
    const sentence = raw.slice(0, bar).trim();
    const en = raw.slice(bar + 1).trim();
    if (!sentence || !en) {
      errors.push(`Line ${n}: the sentence or its English translation is empty.`);
      return;
    }
    lines.push({ text: sentence, en });
  });

  return { lines, errors };
}

export function validateStory(input: StoryInput): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!input.title.trim()) errors.push("Title is required.");

  const slug = input.slug.trim();
  if (!slug) errors.push("Slug is required.");
  else if (!SLUG_RE.test(slug))
    errors.push("Slug can only contain lowercase letters, numbers and single dashes.");

  const cover = input.coverImage.trim();
  if (cover && !/^https:\/\//i.test(cover))
    errors.push("Cover image must be an https:// URL.");
  if (!cover) warnings.push("No cover image: the placeholder will be shown.");

  const enabled = LANGS.filter((l) => input.versions[l.lang].enabled);
  if (enabled.length === 0) errors.push("Enable at least one language version.");

  const parsed: Partial<Record<LangCode, StoryLine[]>> = {};

  for (const { lang, language } of enabled) {
    const v = input.versions[lang];
    if (!(CEFR_LEVELS as readonly string[]).includes(v.level))
      errors.push(`${language}: invalid level.`);
    if (!v.description.trim()) errors.push(`${language}: description is required.`);

    const result = parseLines(v.linesText);
    result.errors.forEach((e) => errors.push(`${language} · ${e}`));
    if (result.lines.length === 0 && result.errors.length === 0)
      errors.push(`${language}: add at least one sentence.`);
    parsed[lang] = result.lines;
  }

  // Cross-language checks (warnings only: translations can legitimately differ)
  const [a, b] = enabled;
  if (a && b) {
    const la = parsed[a.lang] ?? [];
    const lb = parsed[b.lang] ?? [];
    if (la.length !== lb.length) {
      warnings.push(
        `Sentence counts differ: ${a.language} has ${la.length}, ${b.language} has ${lb.length}.`,
      );
    } else {
      const diffs = la
        .map((line, i) => (line.en.trim() !== lb[i].en.trim() ? i + 1 : 0))
        .filter(Boolean);
      if (diffs.length > 0) {
        const shown = diffs.slice(0, 8).join(", ");
        warnings.push(
          `English translations differ between languages on sentence ${shown}${diffs.length > 8 ? "…" : ""}. Check for typos (names, spelling).`,
        );
      }
    }
  }

  return { errors, warnings };
}
