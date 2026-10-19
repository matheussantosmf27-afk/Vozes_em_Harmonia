import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { AssessmentWizard } from "@/components/assessment/assessment-wizard";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ExerciseType } from "@/lib/exercises/schemas";

export const metadata: Metadata = { title: "Avaliação vocal" };

export default async function AvaliacaoPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const [{ data: exercises }, { count }] = await Promise.all([
    supabase.from("exercises").select("*").eq("purpose", "diagnostico").order("sort"),
    supabase.from("vocal_assessments").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("kind", "inicial"),
  ]);
  const kind = (count ?? 0) > 0 ? "periodica" : "inicial";
  return (
    <div className="mx-auto max-w-3xl">
      <nav aria-label="Trilha de navegação" className="mb-3 text-sm text-muted-foreground">
        <Link href="/jornada" className="hover:underline">
          Minha jornada
        </Link>{" "}
        / Avaliação
      </nav>
      <PageHeader eyebrow={kind === "inicial" ? "Avaliação inicial" : "Avaliação de evolução"} title="Avaliação vocal e musical" />
      <AssessmentWizard
        kind={kind}
        exercises={(exercises ?? []).map((e) => ({ id: e.id, slug: e.slug, title: e.title, instructions: e.instructions, type: e.type as ExerciseType, config: e.config, purpose: e.purpose }))}
      />
    </div>
  );
}
