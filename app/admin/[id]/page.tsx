// app/admin/[id]/page.tsx

import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getStoryForEdit } from "@/lib/admin-data";
import { StoryForm } from "@/components/admin/StoryForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStoryPage({ params }: PageProps) {
  if (!(await isAdmin())) return null;

  const { id } = await params;
  const initial = await getStoryForEdit(id);
  if (!initial) notFound();

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Edit story</h1>
      <StoryForm mode="edit" storyId={id} initial={initial} />
    </section>
  );
}
