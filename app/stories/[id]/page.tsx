// app/stories/[id]/page.tsx

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { fetchStoryBySlug } from "@/lib/actions/stories";
import { LevelBadge } from "@/components/ui/LevelBadge";
import { TipBanner } from "@/components/ui/TipBanner";
import { StoryReader } from "@/components/story/StoryReader";
import type { SupportedLang } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}

// ─── SEO metadata ──

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { lang = "es" } = await searchParams;

  // Cached: the page below reuses this result, no second DB round-trip.
  const story = await fetchStoryBySlug(id);
  if (!story) return { title: "Story Not Found — Storyvo" };

  const version = story.versions[lang];
  return {
    title: `${story.title} — Storyvo`,
    description: version?.description ?? "",
  };
}

// ─── Page ──

export default async function StoryDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { lang: rawLang = "es" } = await searchParams;
  const lang: SupportedLang = rawLang === "fr" ? "fr" : "es";

  const story = await fetchStoryBySlug(id);
  if (!story) notFound();

  const version = story.versions[lang];
  if (!version) notFound();

  return (
    <main className="grow max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 pb-44">
      {/* Back */}
      <Link
        href={`/?lang=${lang}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Library
      </Link>

      {/* Illustration — one container, image or placeholder inside */}
      <div className="w-full h-48 sm:h-64 overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-linear-to-br from-emerald-50 to-teal-50/50 flex items-center justify-center">
        {story.coverImage ? (
          <Image
            src={story.coverImage}
            alt={story.title}
            width={800}
            height={500}
            unoptimized
            priority
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium text-slate-400 tracking-wide">
            [ Story Illustration ]
          </span>
        )}
      </div>

      {/* Meta — server-rendered, picked up by crawlers */}
      <div className="space-y-3">
        <LevelBadge meta={version.meta} level={version.level} />
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
          {story.title}
        </h1>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
          {version.description}
        </p>
      </div>

      <TipBanner
        message={
          <>
            <span className="font-bold">Tip:</span> Click any sentence to reveal
            its English translation. Use the player below to listen along.
          </>
        }
      />

      {/* Interactive reader — only this subtree is a client bundle */}
      <StoryReader lines={version.lines} lang={version.lang} />
    </main>
  );
}
