// components/admin/StoryForm.tsx
"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";

import { saveStory } from "@/lib/actions/admin";
import { CEFR_LEVELS } from "@/lib/stories";
import {
  LANGS,
  metaFor,
  parseLines,
  slugify,
  validateStory,
  type LangCode,
  type StoryInput,
  type VersionInput,
} from "@/lib/story-form";
import { CoverUpload } from "@/components/admin/CoverUpload";
import { StoryPreview } from "@/components/admin/StoryPreview";
import { AutoGrowTextarea } from "@/components/admin/AutoGrowTextarea";

interface StoryFormProps {
  mode: "create" | "edit";
  storyId?: string;
  initial: StoryInput;
}

const inputCls =
  "w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";
const labelCls = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5";
const cardCls = "bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4";

export function StoryForm({ mode, storyId, initial }: StoryFormProps) {
  const router = useRouter();
  const [input, setInput] = useState<StoryInput>(initial);
  // In edit mode the slug is a live URL, so never rewrite it from the title.
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [previewLang, setPreviewLang] = useState<LangCode>("es");
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const { errors, warnings } = useMemo(() => validateStory(input), [input]);

  const enabledLangs = LANGS.filter((l) => input.versions[l.lang].enabled);
  const activePreview =
    enabledLangs.find((l) => l.lang === previewLang) ?? enabledLangs[0];

  const previewLines = useMemo(
    () =>
      activePreview ? parseLines(input.versions[activePreview.lang].linesText).lines : [],
    [activePreview, input.versions],
  );

  function patch(p: Partial<StoryInput>) {
    setInput((prev) => ({ ...prev, ...p }));
  }

  function patchVersion(lang: LangCode, p: Partial<VersionInput>) {
    setInput((prev) => ({
      ...prev,
      versions: { ...prev.versions, [lang]: { ...prev.versions[lang], ...p } },
    }));
  }

  function onTitleChange(title: string) {
    setInput((prev) => ({
      ...prev,
      title,
      slug: slugTouched ? prev.slug : slugify(title),
    }));
  }

  function onSave() {
    setServerError(null);
    startTransition(async () => {
      const result = await saveStory(input, storyId);
      if (!result.ok) {
        setServerError(result.error);
        return;
      }
      router.push("/admin");
      router.refresh();
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* ── Left: the form ─────────────────────────────────────────────── */}
      <div className="space-y-6">
        <section className={cardCls}>
          <div>
            <label className={labelCls} htmlFor="title">Title</label>
            <input
              id="title"
              value={input.title}
              onChange={(e) => onTitleChange(e.target.value)}
              className={inputCls}
              placeholder="The Lighthouse Keeper"
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="slug">Slug (URL)</label>
            <input
              id="slug"
              value={input.slug}
              onChange={(e) => {
                setSlugTouched(true);
                patch({ slug: e.target.value });
              }}
              className={`${inputCls} font-mono`}
              placeholder="the-lighthouse-keeper"
            />
            {mode === "edit" && (
              <p className="text-xs text-slate-400 mt-1.5">
                Changing the slug breaks existing links to this story.
              </p>
            )}
          </div>

          <div>
            <span className={labelCls}>Cover image</span>
            <CoverUpload
              value={input.coverImage}
              onChange={(url) => patch({ coverImage: url })}
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={input.published}
              onChange={(e) => patch({ published: e.target.checked })}
              className="w-4 h-4 accent-blue-600"
            />
            <span className="text-sm font-medium text-slate-700">
              Published (visible in the library)
            </span>
          </label>
        </section>

        {LANGS.map(({ lang, language }) => {
          const v = input.versions[lang];
          const count = parseLines(v.linesText).lines.length;
          return (
            <section key={lang} className={cardCls}>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={v.enabled}
                  onChange={(e) => patchVersion(lang, { enabled: e.target.checked })}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="font-bold text-slate-900">{language} version</span>
              </label>

              {v.enabled ? (
                <>
                  <div>
                    <label className={labelCls} htmlFor={`${lang}-level`}>Level</label>
                    <select
                      id={`${lang}-level`}
                      value={v.level}
                      onChange={(e) => patchVersion(lang, { level: e.target.value })}
                      className={inputCls}
                    >
                      {CEFR_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelCls} htmlFor={`${lang}-desc`}>Description</label>
                    <AutoGrowTextarea
                      id={`${lang}-desc`}
                      value={v.description}
                      onChange={(e) => patchVersion(lang, { description: e.target.value })}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className={labelCls} htmlFor={`${lang}-lines`}>
                        Sentences
                      </label>
                      <span className="text-xs font-semibold text-slate-400 mb-1.5">
                        {count} sentence{count === 1 ? "" : "s"}
                      </span>
                    </div>
                    <textarea
                      id={`${lang}-lines`}
                      value={v.linesText}
                      onChange={(e) => patchVersion(lang, { linesText: e.target.value })}
                      rows={12}
                      spellCheck={false}
                      placeholder={
                        lang === "es"
                          ? "Tengo un perro. Se llama Bruno. | I have a dog. His name is Bruno."
                          : "J'ai un chien. Il s'appelle Bruno. | I have a dog. His name is Bruno."
                      }
                      className={`${inputCls} font-mono leading-relaxed`}
                    />
                    <p className="text-xs text-slate-400 mt-1.5">
                      One sentence per line: <code>text | English translation</code>
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-400">
                  This language is off. If the story already had a {language} version,
                  saving will delete it.
                </p>
              )}
            </section>
          );
        })}
      </div>

      {/* ── Right: checks + preview ────────────────────────────────────── */}
      <div className="space-y-6 lg:sticky lg:top-6">
        <section className={cardCls}>
          <h2 className="font-bold text-slate-900">Checks</h2>

          {errors.length === 0 && warnings.length === 0 && (
            <p className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Everything looks good.
            </p>
          )}

          {errors.length > 0 && (
            <ul className="space-y-1.5">
              {errors.slice(0, 6).map((e, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-600">
                  <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{e}</span>
                </li>
              ))}
              {errors.length > 6 && (
                <li className="text-xs text-red-400 pl-6">
                  …and {errors.length - 6} more.
                </li>
              )}
            </ul>
          )}

          {warnings.length > 0 && (
            <ul className="space-y-1.5">
              {warnings.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          )}

          {serverError && (
            <p className="text-sm text-red-600 font-semibold">{serverError}</p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onSave}
              disabled={pending || errors.length > 0}
              className="bg-[#0f172a] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-slate-800 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {pending ? "Saving…" : mode === "create" ? "Create story" : "Save changes"}
            </button>
            <Link
              href="/admin"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition"
            >
              Cancel
            </Link>
          </div>
          <p className="text-xs text-slate-400">
            Warnings don&apos;t block saving. Errors do.
          </p>
        </section>

        <section className={cardCls}>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Preview</h2>
            <div className="flex gap-1.5">
              {enabledLangs.map(({ lang, language }) => (
                <button
                  key={lang}
                  onClick={() => setPreviewLang(lang)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                    activePreview?.lang === lang
                      ? "bg-[#0f172a] text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>

          {activePreview ? (
            <div className="max-h-[70vh] overflow-y-auto pr-1">
              <StoryPreview
                key={activePreview.lang}
                title={input.title}
                lang={activePreview.lang}
                level={input.versions[activePreview.lang].level}
                meta={metaFor(
                  activePreview.language,
                  input.versions[activePreview.lang].level,
                )}
                description={input.versions[activePreview.lang].description}
                lines={previewLines}
              />
            </div>
          ) : (
            <p className="text-sm text-slate-400">Enable a language to preview it.</p>
          )}
        </section>
      </div>
    </div>
  );
}
