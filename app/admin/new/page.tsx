// app/admin/new/page.tsx

import { isAdmin } from "@/lib/admin-auth";
import { emptyStoryInput } from "@/lib/story-form";
import { StoryForm } from "@/components/admin/StoryForm";

export default async function NewStoryPage() {
  if (!(await isAdmin())) return null;

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">New story</h1>
      <StoryForm mode="create" initial={emptyStoryInput()} />
    </section>
  );
}
