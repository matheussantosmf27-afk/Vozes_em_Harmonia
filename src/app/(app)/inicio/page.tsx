import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Award, CalendarDays, CheckSquare, ClipboardList, Flame, GraduationCap, HandHeart, MessageSquareQuote, Star } from "lucide-react";
import { PageHeader, Meter } from "@/components/common/page-header";
import { PracticeLogForm } from "@/components/common/practice-log-form";
import { ToastOnParam } from "@/components/common/toast-on-param";
import { TaskCheckbox } from "@/components/rehearsal/task-checkbox";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getLessonsIndex, getMyProgress } from "@/lib/data/content";
import { formatDate, formatDateTime, formatRelative } from "@/lib/format";

export const metadata: Metadata = { title: "Início" };

function greeting() {
  const h = Number(new Intl.DateTimeFormat("pt-BR", { hour: "numeric", hour12: false, timeZone: "America/Sao_Paulo" }).format(new Date()));
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

export default async function InicioPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const now = new Date().toISOString();
  const [{ data: stats }, { data: challenge }, { count: assessments }, { data: plan }, lessons, progress, { data: rehearsals }, { data: tasks }, { data: observations }] = await Promise.all([
    supabase.rpc("member_stats", { p_user: user.id }),
    supabase.rpc("collective_challenge"),
    supabase.from("vocal_assessments").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("study_plans").select("daily_exercises, recommended_lessons, objective").eq("user_id", user.id).eq("is_current", true).maybeSingle(),
    getLessonsIndex(),
    getMyProgress(user.id),
    supabase.from("rehearsal_sessions").select("id, title, starts_at, location, status").gte("starts_at", now).neq("status", "cancelado").order("starts_at").limit(3),
    supabase.from("rehearsal_tasks").select("id, title, due_on, done_at, assignee_id, rehearsal_sessions(title)").is("done_at", null).or(`assignee_id.eq.${user.id},assignee_id.is.null`).order("due_on", { ascending: true, nullsFirst: false }).limit(6),
    supabase.from("teacher_observations").select("id, content, created_at").eq("user_id", user.id).eq("visible_to_member", true).order("created_at", { ascending: false }).limit(2),
  ]);
  const s = stats?.[0];
  const c = challenge?.[0];
  const daily = (plan?.daily_exercises as { slug: string; title: string; minutes: number; href: string }[] | undefined) ?? [];
  const recommended = (plan?.recommended_lessons ?? []).map((slug) => lessons.find((l) => l.slug === slug)).filter(Boolean);
  const nextLesson =
    recommended.find((l) => progress.get(l!.id)?.status !== "concluida") ??
    lessons.find((l) => progress.get(l.id)?.status === "em_andamento") ??
    lessons.find((l) => !progress.get(l.id));

  return (
    <>
      <Suspense>
        <ToastOnParam />
      </Suspense>
      <PageHeader eyebrow={formatDate(new Date(), { weekday: "long", day: "numeric", month: "long" })} title={`${greeting()}, ${user.displayName}!`} description="Cada voz se desenvolve para servir melhor na harmonia do conjunto." />

      {(assessments ?? 0) === 0 && (
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center">
          <ClipboardList className="size-10 shrink-0 text-gold" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Comece pela avaliação inicial</h2>
            <p className="text-primary-foreground/80">Conheça sua região vocal e receba um plano de estudos sob medida.</p>
          </div>
          <Link href="/jornada/avaliacao" className={buttonVariants({ variant: "secondary" })}>
            Fazer avaliação <ArrowRight />
          </Link>
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { icon: Flame, label: "Sequência", value: `${s?.streak_days ?? 0} dia${s?.streak_days === 1 ? "" : "s"}` },
          { icon: Star, label: "Pontos", value: s?.points ?? 0 },
          { icon: GraduationCap, label: "Aulas concluídas", value: s?.lessons_completed ?? 0 },
          { icon: Award, label: "Conquistas", value: s?.achievements_count ?? 0 },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl border bg-card p-4">
            <Icon className="size-5 text-gold" aria-hidden />
            <p className="mt-2 font-heading text-2xl">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="space-y-3 rounded-2xl border bg-card p-5">
            <h2 className="text-lg font-semibold">Seu plano de hoje</h2>
            {daily.length ? (
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
            ) : (
              <p className="text-sm text-muted-foreground">Seu plano aparece aqui depois da avaliação inicial.</p>
            )}
            {nextLesson && (
              <Link href={`/aprender/${nextLesson.learning_paths?.slug}/${nextLesson.slug}`} className="flex items-center gap-3 rounded-xl bg-secondary/60 p-3 hover:bg-secondary">
                <GraduationCap className="size-5 text-primary" />
                <span className="flex-1 text-sm">
                  <span className="block text-xs text-muted-foreground">Próxima aula · Trilha {nextLesson.learning_paths?.code}</span>
                  <span className="font-medium">{nextLesson.title}</span>
                </span>
                <ArrowRight className="size-4" />
              </Link>
            )}
          </section>

          <section className="space-y-3 rounded-2xl border bg-card p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <CheckSquare className="size-5 text-gold" /> Tarefas para o próximo ensaio
            </h2>
            {tasks && tasks.length ? (
              <ul className="space-y-2">
                {tasks.map((t) => (
                  <li key={t.id} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
                    <TaskCheckbox id={t.id} done={!!t.done_at} canToggle={t.assignee_id === user.id || user.isStaff} />
                    <span className="flex-1">
                      <span className="font-medium">{t.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        {t.rehearsal_sessions?.title ?? "Tarefa"}
                        {t.assignee_id ? "" : " · para todo o grupo"}
                        {t.due_on ? ` · até ${formatDate(t.due_on)}` : ""}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma tarefa pendente.</p>
            )}
          </section>

          {c && (
            <section className="space-y-3 rounded-2xl border bg-card p-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <HandHeart className="size-5 text-gold" /> Desafio coletivo da semana
              </h2>
              <p className="text-sm text-muted-foreground">
                Juntos, somar {c.target} dias de estudo nesta semana. Cada pessoa que pratica contribui — não há ranking, só o resultado do grupo.
              </p>
              <Meter value={c.target ? c.active_member_days / c.target : 0} label={`${c.active_member_days} de ${c.target} dias de estudo · ${c.participants} de ${c.active_members} integrantes participaram`} />
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <section className="space-y-3 rounded-2xl border bg-card p-5">
            <h2 className="flex items-center gap-2 font-semibold">
              <CalendarDays className="size-5 text-gold" /> Próximos ensaios
            </h2>
            {rehearsals && rehearsals.length ? (
              <ul className="space-y-2">
                {rehearsals.map((r) => (
                  <li key={r.id}>
                    <Link href={`/ensaios/${r.id}`} className="block rounded-lg p-2 text-sm hover:bg-muted">
                      <span className="font-medium">{r.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        {formatDateTime(r.starts_at)}
                        {r.location ? ` · ${r.location}` : ""}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum ensaio agendado.</p>
            )}
          </section>
          {observations && observations.length > 0 && (
            <section className="space-y-3 rounded-2xl border bg-card p-5">
              <h2 className="flex items-center gap-2 font-semibold">
                <MessageSquareQuote className="size-5 text-gold" /> Do seu professor
              </h2>
              {observations.map((o) => (
                <p key={o.id} className="text-sm leading-relaxed">
                  “{o.content}” <span className="block text-xs text-muted-foreground">{formatRelative(o.created_at)}</span>
                </p>
              ))}
            </section>
          )}
          <section className="space-y-3 rounded-2xl border bg-card p-5">
            <h2 className="font-semibold">Estudou fora da plataforma?</h2>
            <PracticeLogForm />
            <p className="text-xs text-muted-foreground">Registros contam para a sua sequência de dias e para o desafio coletivo.</p>
          </section>
        </aside>
      </div>
    </>
  );
}
