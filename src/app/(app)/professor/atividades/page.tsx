import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { ActivityBuilder, ActivityRowActions } from "@/components/teacher/activity-builder";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getLessonsIndex, getSkills } from "@/lib/data/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Atividades do professor" };

export default async function AtividadesPage() {
  await requireStaff();
  const supabase = await createClient();
  const [skills, lessons, { data: mine }] = await Promise.all([
    getSkills(),
    getLessonsIndex(),
    supabase.from("exercises").select("id, slug, title, type, is_published, created_at, lessons(title), profiles!exercises_created_by_fkey(full_name)").not("created_by", "is", null).order("created_at", { ascending: false }),
  ]);
  return (
    <>
      <nav aria-label="Trilha de navegação" className="mb-3 text-sm text-muted-foreground">
        <Link href="/professor" className="hover:underline">
          Área do professor
        </Link>{" "}
        / Atividades
      </nav>
      <PageHeader title="Criar atividades" description="Monte questionários e exercícios auditivos para o seu grupo. As atividades registram tentativas e alimentam o domínio das habilidades, como as aulas da plataforma." />
      <section className="mb-8 rounded-2xl border bg-card p-5">
        <ActivityBuilder skills={skills.map((s) => ({ slug: s.slug, name: s.name }))} lessons={lessons.map((l) => ({ id: l.id, label: `${l.learning_paths?.code} · ${l.title}` }))} />
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Atividades criadas pela equipe</h2>
        <ul className="divide-y rounded-2xl border bg-card">
          {(mine ?? []).map((e) => (
            <li key={e.id} className="flex flex-wrap items-center gap-3 p-3 text-sm">
              <span className="flex-1">
                <Link href={`/aprender/atividade/${e.slug}`} className="font-medium text-primary hover:underline">
                  {e.title}
                </Link>
                <span className="block text-xs text-muted-foreground">
                  {e.lessons?.title ? `Aula: ${e.lessons.title}` : "Atividade avulsa"} · {e.profiles?.full_name} · {formatDate(e.created_at)}
                </span>
              </span>
              {!e.is_published && <Badge variant="outline">Oculta</Badge>}
              <ActivityRowActions id={e.id} published={e.is_published} />
            </li>
          ))}
          {(mine ?? []).length === 0 && <li className="p-3 text-sm text-muted-foreground">Nenhuma atividade criada ainda.</li>}
        </ul>
      </section>
    </>
  );
}
