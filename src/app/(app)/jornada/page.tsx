import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardList, FileText, MessageSquareQuote } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/common/page-header";
import { ClassificationCard, type ClassificationData } from "@/components/common/classification-card";
import { GoalList } from "@/components/common/goal-list";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getLessonsIndex, getMyProgress, getSkills } from "@/lib/data/content";
import { masteryLabel } from "@/lib/pedagogy/mastery";
import { formatDate, formatRelative } from "@/lib/format";

export const metadata: Metadata = { title: "Minha jornada" };

export default async function JornadaPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const [{ data: cls }, { data: assessments }, { data: plan }, { data: goals }, { data: mastery }, skills, lessons, progress, { data: observations }] = await Promise.all([
    supabase.from("vocal_classifications").select("*, author:profiles!vocal_classifications_classified_by_fkey(full_name)").eq("user_id", user.id).eq("is_current", true).maybeSingle(),
    supabase.from("vocal_assessments").select("id, kind, created_at, report").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("study_plans").select("*").eq("user_id", user.id).eq("is_current", true).maybeSingle(),
    supabase.from("practice_goals").select("*").eq("user_id", user.id).order("horizon_weeks"),
    supabase.from("skill_mastery").select("skill_slug, level").eq("user_id", user.id),
    getSkills(),
    getLessonsIndex(),
    getMyProgress(user.id),
    supabase.from("teacher_observations").select("id, content, category, created_at, author:profiles!teacher_observations_author_id_fkey(full_name)").eq("user_id", user.id).eq("visible_to_member", true).order("created_at", { ascending: false }).limit(5),
  ]);
  const levelBy = new Map((mastery ?? []).map((m) => [m.skill_slug, m.level]));
  const skillName = new Map(skills.map((s) => [s.slug, s.name]));
  const hasInitial = (assessments ?? []).some((a) => a.kind === "inicial");
  const daily = (plan?.daily_exercises as { slug: string; title: string; minutes: number; href: string }[] | undefined) ?? [];
  const rationale = (plan?.rationale as string[] | undefined) ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Plano individual"
        title="Minha jornada"
        description="Sua classificação provisória, seu plano de estudos, metas e histórico de avaliações."
        actions={
          <Link href="/jornada/avaliacao" className={buttonVariants({ variant: hasInitial ? "outline" : "default" })}>
            <ClipboardList /> {hasInitial ? "Fazer avaliação de evolução" : "Fazer avaliação inicial"}
          </Link>
        }
      />
      {!hasInitial && (
        <div className="mb-6 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-6">
          <h2 className="text-xl font-semibold">Comece pela avaliação inicial</h2>
          <p className="mt-1 text-muted-foreground">Em cerca de 25 minutos conhecemos sua experiência, sua escuta e sua região vocal, e criamos seu plano com metas de 4, 8 e 12 semanas.</p>
          <Link href="/jornada/avaliacao" className={buttonVariants({ className: "mt-4" })}>
            Começar avaliação <ArrowRight />
          </Link>
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {plan ? (
            <section className="space-y-4 rounded-2xl border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Objetivo principal</p>
                  <h2 className="text-xl font-semibold leading-snug">{plan.objective}</h2>
                </div>
                <Badge variant="outline">desde {formatDate(plan.created_at)}</Badge>
              </div>
              <div className="grid gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-muted-foreground">Frequência</p>
                  <p className="font-medium">{plan.weekly_frequency}× por semana</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-muted-foreground">Tempo por sessão</p>
                  <p className="font-medium">{plan.minutes_per_session} minutos</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-muted-foreground">Avaliação periódica</p>
                  <p className="font-medium">a cada {plan.review_every_weeks} semanas</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Habilidades prioritárias</h3>
                <ul className="flex flex-wrap gap-2">
                  {plan.priority_skills.map((s) => (
                    <li key={s} className="rounded-full border bg-secondary/50 px-3 py-1 text-sm">
                      {skillName.get(s) ?? s} · <span className="text-muted-foreground">{masteryLabel(levelBy.get(s) ?? 1)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Exercícios diários</h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {daily.map((d) => (
                    <li key={d.slug}>
                      <Link href={d.href} className="flex items-center justify-between gap-2 rounded-xl border p-3 text-sm hover:border-primary">
                        <span>{d.title}</span>
                        <span className="text-muted-foreground">{d.minutes} min</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Aulas recomendadas</h3>
                <ol className="space-y-1.5">
                  {plan.recommended_lessons.map((slug) => {
                    const l = lessons.find((x) => x.slug === slug);
                    if (!l) return null;
                    const status = progress.get(l.id)?.status;
                    return (
                      <li key={slug}>
                        <Link href={`/aprender/${l.learning_paths?.slug}/${l.slug}`} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted">
                          <span>
                            <span className="text-muted-foreground">Trilha {l.learning_paths?.code} · </span>
                            {l.title}
                          </span>
                          <Badge variant={status === "concluida" ? "default" : "outline"}>{status === "concluida" ? "Concluída" : status ? "Em andamento" : "A fazer"}</Badge>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="font-semibold">Critério de conclusão</p>
                  <p className="text-muted-foreground">{plan.completion_criteria}</p>
                </div>
                <div>
                  <p className="font-semibold">Próximo nível</p>
                  <p className="text-muted-foreground">{plan.next_level}</p>
                </div>
              </div>
              {rationale.length > 0 && (
                <details className="rounded-xl bg-muted/40 p-3 text-sm">
                  <summary className="cursor-pointer font-medium">Por que este plano?</summary>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                    {rationale.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </details>
              )}
            </section>
          ) : (
            <EmptyState icon={ClipboardList} title="Você ainda não tem um plano" text="O plano individual é criado automaticamente ao concluir a avaliação inicial, e o professor pode ajustá-lo." />
          )}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Metas</h2>
            <GoalList
              goals={(goals ?? []).map((g) => ({
                ...g,
                skillName: g.skill_slug ? skillName.get(g.skill_slug) : undefined,
                currentLevel: g.skill_slug ? levelBy.get(g.skill_slug) ?? 1 : undefined,
                byTeacher: g.created_by !== user.id,
              }))}
            />
          </section>
        </div>
        <aside className="space-y-6">
          <ClassificationCard data={cls as ClassificationData | null} authorName={cls?.author?.full_name} />
          <section className="space-y-2 rounded-2xl border bg-card p-5">
            <h2 className="flex items-center gap-2 font-semibold">
              <MessageSquareQuote className="size-4 text-gold" /> Comentários do professor
            </h2>
            {observations && observations.length ? (
              <ul className="space-y-3">
                {observations.map((o) => (
                  <li key={o.id} className="text-sm">
                    <p className="leading-relaxed">{o.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.author?.full_name ?? "Professor(a)"} · {formatRelative(o.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum comentário ainda.</p>
            )}
          </section>
          <section className="space-y-2 rounded-2xl border bg-card p-5">
            <h2 className="flex items-center gap-2 font-semibold">
              <FileText className="size-4 text-gold" /> Avaliações
            </h2>
            {assessments && assessments.length ? (
              <ul className="space-y-1">
                {assessments.map((a) => (
                  <li key={a.id}>
                    <Link href={`/jornada/relatorio/${a.id}`} className="flex justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-muted">
                      <span>{a.kind === "inicial" ? "Avaliação inicial" : a.kind === "periodica" ? "Avaliação de evolução" : "Avaliação do professor"}</span>
                      <span className="text-muted-foreground">{formatDate(a.created_at)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma avaliação ainda.</p>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}
