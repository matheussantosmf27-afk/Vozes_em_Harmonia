import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MapPin, Plus } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime, nowMs } from "@/lib/format";

export const metadata: Metadata = { title: "Ensaios" };

const STATUS = { planejado: "Planejado", realizado: "Realizado", cancelado: "Cancelado" } as const;

export default async function EnsaiosPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: sessions } = await supabase.from("rehearsal_sessions").select("id, title, starts_at, duration_minutes, location, status, vocal_groups(name), rehearsal_repertoire(repertoire(title))").order("starts_at", { ascending: false }).limit(60);
  const now = nowMs();
  const upcoming = (sessions ?? []).filter((s) => new Date(s.starts_at).getTime() >= now - 3 * 3600_000).reverse();
  const past = (sessions ?? []).filter((s) => new Date(s.starts_at).getTime() < now - 3 * 3600_000);
  const card = (s: NonNullable<typeof sessions>[number]) => (
    <Link key={s.id} href={`/ensaios/${s.id}`} className="block space-y-2 rounded-2xl border bg-card p-4 hover:border-primary">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold">{s.title}</h3>
        <Badge variant={s.status === "realizado" ? "default" : s.status === "cancelado" ? "destructive" : "secondary"}>{STATUS[s.status]}</Badge>
        {s.vocal_groups?.name && <Badge variant="outline">{s.vocal_groups.name}</Badge>}
      </div>
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="size-4" /> {formatDateTime(s.starts_at)} · {s.duration_minutes} min
        </span>
        {s.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-4" /> {s.location}
          </span>
        )}
      </p>
      {s.rehearsal_repertoire.length > 0 && <p className="text-sm">{s.rehearsal_repertoire.map((r) => r.repertoire?.title).filter(Boolean).join(" · ")}</p>}
    </Link>
  );
  return (
    <>
      <PageHeader
        eyebrow="Planejamento"
        title="Ensaios"
        description="Pauta, músicas, objetivos, presença e tarefas de cada ensaio."
        actions={
          user.isDirector ? (
            <Link href="/ensaios/novo" className={buttonVariants()}>
              <Plus /> Novo ensaio
            </Link>
          ) : undefined
        }
      />
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Próximos</h2>
        {upcoming.length ? <div className="grid gap-3 md:grid-cols-2">{upcoming.map(card)}</div> : <EmptyState icon={CalendarDays} title="Nenhum ensaio agendado" text={user.isDirector ? "Crie o próximo ensaio com a pauta por blocos de tempo." : "O diretor musical ainda não agendou ensaios."} />}
      </section>
      {past.length > 0 && (
        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Anteriores</h2>
          <div className="grid gap-3 md:grid-cols-2">{past.map(card)}</div>
        </section>
      )}
    </>
  );
}
