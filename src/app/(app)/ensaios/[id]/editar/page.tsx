import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { RehearsalForm, type AgendaItem } from "@/components/rehearsal/rehearsal-form";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isoToBrasiliaLocal, rehearsalFormOptions } from "@/lib/data/rehearsal-form";

export const metadata: Metadata = { title: "Editar ensaio" };

export default async function EditarEnsaioPage({ params }: PageProps<"/ensaios/[id]/editar">) {
  const { id } = await params;
  const user = await requireStaff();
  const supabase = await createClient();
  const { data: s } = await supabase.from("rehearsal_sessions").select("*, rehearsal_repertoire(repertoire_id, focus, sort)").eq("id", id).maybeSingle();
  if (!s) notFound();
  const { groups, repertoire } = await rehearsalFormOptions();
  return (
    <div className="mx-auto max-w-4xl">
      <nav aria-label="Trilha de navegação" className="mb-3 text-sm text-muted-foreground">
        <Link href={`/ensaios/${id}`} className="hover:underline">
          {s.title}
        </Link>{" "}
        / Editar
      </nav>
      <PageHeader title="Editar ensaio" />
      <RehearsalForm
        canEditRepertoire={user.isDirector}
        groups={groups}
        repertoire={repertoire}
        initial={{
          id,
          title: s.title,
          startsAt: isoToBrasiliaLocal(s.starts_at),
          durationMinutes: s.duration_minutes,
          location: s.location ?? "",
          groupId: s.group_id ?? "",
          objectives: s.objectives,
          agenda: (s.agenda as unknown as AgendaItem[]) ?? [],
          repertoire: [...s.rehearsal_repertoire].sort((a, b) => a.sort - b.sort).map((r) => ({ id: r.repertoire_id, focus: r.focus ?? "" })),
        }}
      />
    </div>
  );
}
