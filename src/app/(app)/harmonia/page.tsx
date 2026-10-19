import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Music } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { HARMONY_LEVELS } from "@/lib/data/harmony";

export const metadata: Metadata = { title: "Cantar em harmonia" };

const ASSIGN_LABEL = { designado: "Designado(a)", estudando: "Estudando", pronto: "Pronto(a)" } as const;

export default async function HarmoniaPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const [{ data: arrangements }, { data: assignments }] = await Promise.all([
    supabase.from("arrangements").select("id, slug, title, harmony_level, formation, key_name, description, repertoire(title), vocal_parts(id)").order("harmony_level").order("title"),
    supabase.from("arrangement_assignments").select("id, status, vocal_parts(name, arrangements(slug, title, repertoire(title)))").eq("user_id", user.id),
  ]);
  const withSlug = (arrangements ?? []).filter((a) => a.slug);
  return (
    <>
      <PageHeader
        eyebrow="Escola de divisão de vozes"
        title="Cantar em harmonia"
        description="Aprenda a cantar uma linha própria mantendo afinação, ritmo e equilíbrio. Use o treinador por voz: ouça só a sua parte, a sua destacada ou todas juntas."
      />
      {assignments && assignments.length > 0 && (
        <section className="mb-8 space-y-3">
          <h2 className="text-xl font-semibold">Minhas designações</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {assignments.map((a) => {
              const arr = a.vocal_parts?.arrangements;
              return (
                <li key={a.id}>
                  <Link href={arr?.slug ? `/harmonia/${arr.slug}` : "/repertorio"} className="flex items-center gap-3 rounded-xl border bg-card p-3 hover:border-primary">
                    <Music className="size-5 text-primary" />
                    <span className="flex-1 text-sm">
                      <span className="block font-medium">{arr?.repertoire?.title}</span>
                      {a.vocal_parts?.name} · {arr?.title}
                    </span>
                    <Badge variant={a.status === "pronto" ? "default" : "secondary"}>{ASSIGN_LABEL[a.status]}</Badge>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
      <div className="space-y-8">
        {HARMONY_LEVELS.map((lvl) => {
          const items = withSlug.filter((a) => a.harmony_level === lvl.level);
          return (
            <section key={lvl.level} className="space-y-3">
              <div>
                <h2 className="text-xl font-semibold">{lvl.title}</h2>
                <p className="text-sm text-muted-foreground">{lvl.text}</p>
              </div>
              {items.length === 0 ? (
                <EmptyState title="Nenhum arranjo neste nível ainda" text="O diretor musical pode cadastrar arranjos no repertório." />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((a) => (
                    <Link key={a.id} href={`/harmonia/${a.slug}`} className="group flex flex-col gap-2 rounded-2xl border bg-card p-4 hover:border-primary">
                      <p className="text-xs text-muted-foreground">{a.repertoire?.title}</p>
                      <h3 className="font-semibold group-hover:text-primary">{a.title}</h3>
                      <p className="text-sm text-muted-foreground">{a.description}</p>
                      <div className="mt-auto flex items-center gap-2 pt-2 text-xs">
                        <Badge variant="outline">{a.vocal_parts?.length ?? 0} vozes</Badge>
                        {a.key_name && <Badge variant="outline">{a.key_name}</Badge>}
                        <ArrowRight className="ml-auto size-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
