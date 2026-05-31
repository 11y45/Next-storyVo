// app/page.tsx
// Server component — no "use client".

import type { Metadata } from "next";
import { fetchStoriesByLanguage } from "@/lib/actions/stories";
import { HeroSection } from "@/components/library/HeroSection";
import { HowItWorks } from "@/components/library/HowItWorks";
import { FilterControls } from "@/components/library/FilterControls";
import { StoryGrid } from "@/components/library/StoryGrid";
import { FILTER_GROUPS, type FilterGroup } from "@/lib/stories";
import type { SupportedLang } from "@/types";

export const metadata: Metadata = {
  title: "Storyvo — Master Immersive Language Stories",
  description: "Sentence-by-sentence reading comprehension platform.",
};

interface PageProps {
  searchParams: Promise<{ lang?: string; group?: string }>;
}

export default async function LibraryPage({ searchParams }: PageProps) {
  const { lang: rawLang, group: rawGroup } = await searchParams;

  const lang: SupportedLang = rawLang === "fr" ? "fr" : "es";
  const group: FilterGroup =
    rawGroup === "A" || rawGroup === "B" || rawGroup === "C" ? rawGroup : "All";

  const allStories = await fetchStoriesByLanguage(lang);

  // Filter by group — A covers A1+A2, B covers B1+B2, C covers C1+C2
  const groupConfig = FILTER_GROUPS.find((g) => g.label === group);
  const stories =
    group === "All" || !groupConfig?.levels
      ? allStories
      : allStories.filter((s) =>
          (groupConfig.levels as readonly string[]).includes(s.version.level),
        );

  return (
    <main className="grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-14">
      <HeroSection key={lang} lang={lang} />

      <HowItWorks />

      <section id="library" className="space-y-6">
        <FilterControls currentLang={lang} currentGroup={group} />
        <StoryGrid stories={stories} lang={lang} />
      </section>
    </main>
  );
}
