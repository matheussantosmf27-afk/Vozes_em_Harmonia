import type { Metadata } from "next";
import Link from "next/link";
import { Library, Plus, Search } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS, FORMATION_LABELS, LICENSE_LABELS, REPERTOIRE_STATUS_LABELS } from "@/lib/repertoire";

export const metadata: Metadata = { title: "Partituras e repertório" };

const opts = (m: Record<string, string>) => Object.entries(m).map(([value, label]) => ({ value, label }));
const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");

export default async function RepertorioPage({ searchParams }: PageProps<"/repertorio">) {
  const sp = await searchParams;
  const user = await requireUser();
  const supabase = await createClient();
  const q = str(sp.q).trim();
  let query = supabase.from("repertoire").select("id, title, composer, license_status, group_key, difficulty, categories, formation, voices_required, status, arrangements(id)").order("title");
  if (q) query = query.or(`title.ilike.%${q.replace(/[%,()]/g, " ")}%,composer.ilike.%${q.replace(/[%,()]/g, " ")}%`);
  if (str(sp.categoria) && CATEGORY_LABELS[str(sp.categoria)]) query = query.contains("categories", [str(sp.categoria)]);
  if (str(sp.formacao) && FORMATION_LABELS[str(sp.formacao)]) query = query.eq("formation", str(sp.formacao));
  if (str(sp.dificuldade)) query = query.eq("difficulty", Number(str(sp.dificuldade)));
  if (str(sp.status) && REPERTOIRE_STATUS_LABELS[str(sp.status)]) query = query.eq("status", str(sp.status) as "planejada");
  else query = query.neq("status", "arquivada");
  const { data: items, error } = await query;

  return (
    <>
      <PageHeader
        eyebrow="Biblioteca"
        title="Partituras e repertório"
        description="Músicas do ministério com arranjos por voz, materiais autorizados, distribuição de vozes e situação de preparo."
        actions={
          user.isDirector ? (
            <Link href="/repertorio/novo" className={buttonVariants()}>
              <Plus /> Nova música
            </Link>
          ) : undefined
        }
      />
      <form className="mb-6 grid gap-2 rounded-2xl border bg-card p-3 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto]" role="search">
        <Input name="q" defaultValue={q} placeholder="Buscar por título ou autor" aria-label="Buscar" />
        <NativeSelect name="categoria" aria-label="Categoria" defaultValue={str(sp.categoria)} placeholder="Todas as categorias" options={opts(CATEGORY_LABELS)} />
        <NativeSelect name="formacao" aria-label="Formação" defaultValue={str(sp.formacao)} placeholder="Todas as formações" options={opts(FORMATION_LABELS)} />
        <NativeSelect name="dificuldade" aria-label="Dificuldade" defaultValue={str(sp.dificuldade)} placeholder="Qualquer dificuldade" options={[1, 2, 3, 4, 5].map((d) => ({ value: String(d), label: `Dificuldade ${d}` }))} />
        <NativeSelect name="status" aria-label="Situação" defaultValue={str(sp.status)} placeholder="Ativas" options={opts(REPERTOIRE_STATUS_LABELS)} />
        <Button type="submit" variant="secondary">
          <Search /> Filtrar
        </Button>
      </form>
      {error && <p className="text-destructive">Não foi possível carregar o repertório.</p>}
      {items && items.length === 0 ? (
        <EmptyState icon={Library} title="Nenhuma música encontrada" text={q ? "Tente outra busca ou limpe os filtros." : "O diretor musical ainda não cadastrou músicas."} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items?.map((r) => (
            <Link key={r.id} href={`/repertorio/${r.id}`} className="flex flex-col gap-2 rounded-2xl border bg-card p-4 hover:border-primary">
              <div className="flex flex-wrap items-start gap-2">
                <h2 className="flex-1 font-semibold">{r.title}</h2>
                <Badge variant={r.status === "pronta" ? "default" : "secondary"}>{REPERTOIRE_STATUS_LABELS[r.status]}</Badge>
              </div>
              {r.composer && <p className="text-sm text-muted-foreground">{r.composer}</p>}
              <div className="flex flex-wrap gap-1.5 text-xs">
                <Badge variant="outline">{FORMATION_LABELS[r.formation] ?? r.formation}</Badge>
                <Badge variant="outline">{r.voices_required} vozes</Badge>
                <Badge variant="outline">Dificuldade {r.difficulty}</Badge>
                {r.group_key && <Badge variant="outline">{r.group_key}</Badge>}
                <Badge variant={r.license_status === "autorizacao_pendente" ? "destructive" : "outline"}>{LICENSE_LABELS[r.license_status]}</Badge>
                {r.arrangements.length > 0 && <Badge variant="secondary">{r.arrangements.length} arranjo(s) para treino</Badge>}
                {r.categories.map((c) => (
                  <Badge key={c} variant="ghost">
                    {CATEGORY_LABELS[c]}
                  </Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
