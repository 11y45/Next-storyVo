// components/library/StoryGrid.tsx

import { Inbox } from "lucide-react";
import { StoryCard } from "@/components/story/StoryCard";
import type { StoryListItem, SupportedLang } from "@/types";

interface StoryGridProps {
  stories: StoryListItem[];
  lang: SupportedLang;
}

export function StoryGrid({ stories, lang }: StoryGridProps) {
  if (stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center max-w-sm mx-auto space-y-3">
        <div className="bg-slate-100 p-3 rounded-full text-slate-400">
          <Inbox className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-semibold text-slate-800 text-base">
            No stories available
          </h4>
          <p className="text-sm text-slate-400 leading-normal">
            We couldn&apos;t find any matches for this level and language
            combination. Try choosing another filter above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map(({ story, version, lineCount }) => (
        <StoryCard
          key={story.id}
          slug={story.slug}
          title={story.title}
          version={version}
          language={lang}
          lineCount={lineCount}
        />
      ))}
    </div>
  );
}
