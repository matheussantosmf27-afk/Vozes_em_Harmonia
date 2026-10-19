import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Lightbulb, Sprout } from "lucide-react";
import { PageHeader, Meter } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { TEST_KEYS, TEST_LABELS, skillPlanLabel, type TestResults } from "@/lib/pedagogy/plan";
import { VOICE_LABELS, REGION_LABELS, type ClassificationSuggestion } from "@/lib/pedagogy/classification";
import { noteName } from "@/lib/music/notes";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Relatório da avaliação" };

interface Report {
  level?: "iniciante" | "intermediario" | "avancado";
  strengths?: string[];
  toDevelop?: string[];
  recommendations?: string[];
  classification?: ClassificationSuggestion;
  prioritySkills?: string[];
}

const LEVEL = { iniciante: "Iniciante", intermediario: "Intermediário", avancado: "Avançado" } as const;

export default async function RelatorioPage({ params }: PageProps<"/jornada/relatorio/[id]">) {
  const { id } = await params;
  const user = await requireUser();
  const supabase = await createClient();
  const { data: a } = await supabase.from("vocal_assessments").select("*, profiles!vocal_assessments_user_id_fkey(full_name)").eq("id", id).maybeSingle();
  if (!a) notFound();
  const report = (a.report ?? {}) as Report;
  const tests = (a.test_results ?? {}) as TestResults;
  const own = a.user_id === user.id;
  const sug = report.classification;
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        eyebrow={a.kind === "inicial" ? "Avaliação inicial" : a.kind === "periodica" ? "Avaliação de evolução" : "Avaliação do professor"}
        title={own ? "Seu relatório individual" : `Relatório de ${a.profiles?.full_name ?? "integrante"}`}
        description={`Realizada em ${formatDate(a.created_at)}. Os resultados são um retrato deste dia e servem para orientar o estudo — não são um diagnóstico.`}
        actions={
          own ? (
            <Link href="/jornada" className={buttonVariants()}>
              Ver meu plano
            </Link>
          ) : undefined
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Ponto de partida</p>
          <p className="font-heading text-2xl">{report.level ? LEVEL[report.level] : "—"}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Classificação provisória</p>
          <p className="font-heading text-2xl">{sug ? VOICE_LABELS[sug.classification] : "—"}</p>
          {sug?.alternatives?.length ? <p className="text-xs text-muted-foreground">também compatível com {sug.alternatives.map((x) => VOICE_LABELS[x].toLowerCase()).join(", ")}</p> : null}
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Região confortável</p>
          <p className="font-heading text-2xl">{a.comfortable_low_midi && a.comfortable_high_midi ? `${noteName(a.comfortable_low_midi)} – ${noteName(a.comfortable_high_midi)}` : "não medida"}</p>
          {sug?.region && <p className="text-xs text-muted-foreground">{REGION_LABELS[sug.region]} · detecção {a.range_confidence === "confiavel" ? "confiável" : a.range_confidence === "incerta" ? "incerta" : "—"}</p>}
        </div>
      </div>
      {sug && <p className="rounded-xl bg-secondary/60 p-4 text-sm leading-relaxed">{sug.explanation}</p>}

      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-3 rounded-2xl border bg-card p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <CheckCircle2 className="size-5 text-success" /> Pontos fortes
          </h2>
          <ul className="space-y-2 text-sm">{(report.strengths ?? []).map((s) => <li key={s}>• {s}</li>)}</ul>
        </section>
        <section className="space-y-3 rounded-2xl border bg-card p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Sprout className="size-5 text-gold" /> Habilidades a desenvolver
          </h2>
          {report.toDevelop?.length ? <ul className="space-y-2 text-sm">{report.toDevelop.map((s) => <li key={s}>• {s}</li>)}</ul> : <p className="text-sm text-muted-foreground">Nenhuma fragilidade relevante nos testes.</p>}
        </section>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Resultados dos testes</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {TEST_KEYS.map((k) => (
            <div key={k} className="rounded-xl border bg-card p-3">
              {tests[k] == null ? (
                <div className="flex justify-between text-sm">
                  <span>{TEST_LABELS[k]}</span>
                  <span className="text-muted-foreground">não realizado</span>
                </div>
              ) : (
                <Meter value={tests[k]!} label={TEST_LABELS[k]} />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Lightbulb className="size-5 text-gold" /> Recomendações iniciais
        </h2>
        {report.prioritySkills?.length ? (
          <div className="flex flex-wrap gap-2">
            {report.prioritySkills.map((s) => (
              <Badge key={s} variant="secondary">
                Prioridade: {skillPlanLabel(s)}
              </Badge>
            ))}
          </div>
        ) : null}
        <ul className="space-y-2 text-sm">{(report.recommendations ?? []).map((s) => <li key={s}>• {s}</li>)}</ul>
        {a.notes && (
          <p className="rounded-lg bg-muted/50 p-3 text-sm">
            <span className="font-medium">Observações: </span>
            {a.notes}
          </p>
        )}
      </section>
    </div>
  );
}
