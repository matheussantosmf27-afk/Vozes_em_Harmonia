import type { Metadata } from "next";
import Link from "next/link";
import { UsersRound } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { GroupCreateForm } from "@/components/director/director-controls";
import { requireDirector } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Grupos e formações" };

const KIND = { coral: "Coral", quarteto: "Quarteto", pequeno_grupo: "Pequeno grupo", equipe_louvor: "Equipe de louvor", turma: "Turma" } as const;

export default async function GruposPage() {
  await requireDirector();
  const supabase = await createClient();
  const { data: groups } = await supabase.from("vocal_groups").select("id, name, kind, description, group_members(user_id)").order("name");
  return (
    <>
      <nav aria-label="Trilha de navegação" className="mb-3 text-sm text-muted-foreground">
        <Link href="/diretor" className="hover:underline">
          Direção musical
        </Link>{" "}
        / Grupos
      </nav>
      <PageHeader title="Grupos e formações" description="Crie turmas, corais, quartetos e equipes. Distribua integrantes por voz e confira se a formação está pronta para um arranjo." />
      <section className="mb-6 rounded-2xl border bg-card p-5">
        <GroupCreateForm />
      </section>
      {groups && groups.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <Link key={g.id} href={`/diretor/grupos/${g.id}`} className="space-y-2 rounded-2xl border bg-card p-4 hover:border-primary">
              <div className="flex items-center gap-2">
                <h2 className="flex-1 font-semibold">{g.name}</h2>
                <Badge variant="outline">{KIND[g.kind]}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{g.group_members.length} integrante(s)</p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState icon={UsersRound} title="Nenhum grupo ainda" text="Crie o primeiro grupo acima." />
      )}
    </>
  );
}
