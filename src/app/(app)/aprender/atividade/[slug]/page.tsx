import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { ExerciseRunner } from "@/components/exercises/exercise-runner";
import { requireUser } from "@/lib/auth";
import { getExerciseBySlug, getVoiceRange } from "@/lib/data/content";
import type { ExerciseType } from "@/lib/exercises/schemas";

export const metadata: Metadata = { title: "Atividade" };

export default async function AtividadePage({ params }: PageProps<"/aprender/atividade/[slug]">) {
  const { slug } = await params;
  const user = await requireUser();
  const e = await getExerciseBySlug(slug);
  if (!e) notFound();
  const voiceRange = await getVoiceRange(user.id);
  return (
    <div className="mx-auto max-w-3xl">
      <nav aria-label="Trilha de navegação" className="mb-3 text-sm text-muted-foreground">
        <Link href="/aprender" className="hover:underline">
          Aprender
        </Link>{" "}
        / Atividade
      </nav>
      <PageHeader title={e.title} description={e.instructions} />
      <ExerciseRunner exercise={{ id: e.id, slug: e.slug, title: e.title, instructions: e.instructions, type: e.type as ExerciseType, config: e.config, purpose: e.purpose }} voiceRange={voiceRange} revalidate={`/aprender/atividade/${slug}`} />
    </div>
  );
}
