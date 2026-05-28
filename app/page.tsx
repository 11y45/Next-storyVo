// app/page.tsx

import type { Metadata } from "next";
import { fetchStoriesByLanguage } from "@/lib/actions/stories";
import { HeroSection } from "@/components/library/HeroSection";
import { FilterControls } from "@/components/library/FilterControls";
import { StoryGrid } from "@/components/library/StoryGrid";
import type { SupportedLang } from "@/types";

export const metadata: Metadata = {
  title: "Storyvo — Master Immersive Language Stories",
  description: "Sentence-by-sentence reading comprehension platform.",
};

interface PageProps {
  searchParams: Promise<{ lang?: string; level?: string }>;
}

export default async function LibraryPage({ searchParams }: PageProps) {
  const { lang: rawLang, level = "All" } = await searchParams;
  const lang: SupportedLang = rawLang === "fr" ? "fr" : "es";

  // Fetch on the server — HTML is included in the initial response (good for SEO)
  const allStories = await fetchStoriesByLanguage(lang);
  const stories =
    level === "All"
      ? allStories
      : allStories.filter((s) => s.version.level === level);

  return (
    <main className="grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-16 sm:space-y-20">
      {/* Hero — client component (needs audio APIs) */}
      {/* key={lang} remounts on language switch so preview audio state is reset */}
      <HeroSection key={lang} lang={lang} />

      {/* Library section */}
      <section className="space-y-6">
        {/* FilterControls updates URL → server re-renders with new data */}
        <FilterControls currentLang={lang} currentLevel={level} />

        {/* StoryGrid is server-rendered — story cards are in the HTML source */}
        <StoryGrid stories={stories} lang={lang} />
      </section>
    </main>
  );
}
