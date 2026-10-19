import type { Metadata } from "next";
import * as Icons from "lucide-react";
import { PageHeader, Meter } from "@/components/common/page-header";
import { ActivityChart } from "@/components/common/activity-chart";
import { DeleteRecordButton } from "@/components/common/delete-record-button";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getSkills } from "@/lib/data/content";
import { masteryLabel, nextStepHint, MASTERY_LEVELS, type MasteryAttempt } from "@/lib/pedagogy/mastery";
import { formatDate, formatRelative, localDay, nowMs, pct } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Meu progresso" };

const CATEGORY = { tecnica_vocal: "Técnica vocal", afinacao: "Afinação", percepcao: "Percepção", ritmo: "Ritmo", harmonia: "Harmonia", leitura: "Leitura", teoria: "Teoria", interpretacao: "Interpretação", conjunto: "Canto em conjunto" } as Record<string, string>;

function toPascal(s: string) {
  return s.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
}

export default async function ProgressoPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const since = new Date(nowMs() - 27 * 86400000);
  const [{ data: stats }, skills, { data: mastery }, { data: attempts }, { data: logs }, { data: achievements }, { data: mine }] = await Promise.all([
    supabase.rpc("member_stats", { p_user: user.id }),
    getSkills(),
    supabase.from("skill_mastery").select("skill_slug, level, teacher_level, evidence").eq("user_id", user.id),
    supabase.from("exercise_attempts").select("id, score, created_at, details, correct_count, total_count, difficulty_level, exercises(title, skill_slug, type)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(400),
    supabase.from("practice_logs").select("id, practiced_on, minutes, activity").eq("user_id", user.id).order("practiced_on", { ascending: false }).limit(60),
    supabase.from("achievements").select("*").order("sort"),
    supabase.from("user_achievements").select("achievement_slug, earned_at").eq("user_id", user.id),
  ]);
  const s = stats?.[0];
  const levelBy = new Map((mastery ?? []).map((m) => [m.skill_slug, m]));
  const earned = new Map((mine ?? []).map((a) => [a.achievement_slug, a.earned_at]));

  const bySkill = new Map<string, MasteryAttempt[]>();
  for (const a of attempts ?? []) {
    const skill = a.exercises?.skill_slug;
    if (!skill) continue;
    const list = bySkill.get(skill) ?? [];
    list.push({ score: Number(a.score), day: localDay(a.created_at), selfReported: a.exercises?.type === "self_check" || (a.details as { selfReported?: boolean })?.selfReported === true });
    bySkill.set(skill, list);
  }

  const activity = new Map<string, number>();
  for (const a of attempts ?? []) activity.set(localDay(a.created_at), (activity.get(localDay(a.created_at)) ?? 0) + 1);
  for (const l of logs ?? []) activity.set(l.practiced_on, (activity.get(l.practiced_on) ?? 0) + 1);
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(since.getTime() + i * 86400000);
    const key = localDay(d);
    return { day: key, label: formatDate(d, { day: "2-digit", month: "2-digit" }), count: activity.get(key) ?? 0 };
  });

  const categories = [...new Set(skills.map((k) => k.category))];

  return (
    <>
      <PageHeader eyebrow="Evolução individual" title="Meu progresso" description="Seu progresso comparado apenas com você mesmo. Não há ranking entre integrantes." />
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Sequência atual", `${s?.streak_days ?? 0} dias`],
          ["Dias de estudo (7 dias)", s?.active_days_7 ?? 0],
          ["Minutos de prática (7 dias)", s?.practice_minutes_7 ?? 0],
          ["Pontos", s?.points ?? 0],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border bg-card p-4">
            <p className="font-heading text-2xl">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <section className="mb-8 space-y-3 rounded-2xl border bg-card p-5">
        <h2 className="text-lg font-semibold">Atividade nos últimos 28 dias</h2>
        <ActivityChart days={days} />
      </section>

      <section className="mb-8 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-xl font-semibold">Domínio das habilidades</h2>
          <p className="text-xs text-muted-foreground">{MASTERY_LEVELS.map((l) => `${l.level}. ${l.short}`).join(" · ")}</p>
        </div>
        {categories.map((cat) => (
          <div key={cat} className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{CATEGORY[cat] ?? cat}</h3>
            <ul className="grid gap-2 md:grid-cols-2">
              {skills
                .filter((k) => k.category === cat)
                .map((k) => {
                  const m = levelBy.get(k.slug);
                  const level = m?.level ?? 1;
                  const list = bySkill.get(k.slug) ?? [];
                  return (
                    <li key={k.slug} className="space-y-2 rounded-xl border bg-card p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{k.name}</p>
                          <p className="text-xs text-muted-foreground">{k.description}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">{masteryLabel(level)}</span>
                      </div>
                      <div className="flex gap-1" aria-hidden>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span key={n} className={cn("h-1.5 flex-1 rounded-full", n <= level ? "bg-primary" : "bg-muted")} />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{nextStepHint(list, k.auto_max_level, level)}</p>
                      {m?.teacher_level && <p className="text-xs">Avaliado pelo professor{m.evidence ? `: ${m.evidence}` : ""}</p>}
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </section>

      <section className="mb-8 space-y-3">
        <h2 className="text-xl font-semibold">Conquistas</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(achievements ?? []).map((a) => {
            const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[toPascal(a.icon)] ?? Icons.Award;
            const at = earned.get(a.slug);
            return (
              <li key={a.slug} className={cn("flex gap-3 rounded-xl border p-3", at ? "bg-card" : "bg-muted/30 opacity-70")}>
                <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", at ? "bg-gold/25 text-accent-foreground" : "bg-muted text-muted-foreground")}>
                  <Icon className="size-5" />
                </span>
                <span className="text-sm">
                  <span className="block font-medium">{a.title}</span>
                  <span className="text-muted-foreground">{a.description}</span>
                  <span className="block text-xs text-muted-foreground">{at ? `Conquistada ${formatRelative(at)} · ${a.points} pontos` : `${a.points} pontos`}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Atividades realizadas</h2>
          {(attempts ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma atividade ainda.</p>
          ) : (
            <ul className="divide-y rounded-2xl border bg-card">
              {(attempts ?? []).slice(0, 40).map((a) => (
                <li key={a.id} className="flex items-center gap-3 p-3 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{a.exercises?.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelative(a.created_at)}
                      {a.difficulty_level ? ` · nível ${a.difficulty_level}` : ""}
                      {(a.details as { selfReported?: boolean })?.selfReported ? " · autoavaliação" : ""}
                    </p>
                  </div>
                  <Meter value={Number(a.score)} className="w-24" />
                  <span className="w-10 text-right font-medium">{pct(Number(a.score))}</span>
                  <DeleteRecordButton id={a.id} kind="attempt" />
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Estudos registrados</h2>
          {(logs ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum estudo registrado manualmente.</p>
          ) : (
            <ul className="divide-y rounded-2xl border bg-card">
              {logs!.map((l) => (
                <li key={l.id} className="flex items-center gap-3 p-3 text-sm">
                  <span className="flex-1">
                    <span className="font-medium">{l.activity}</span>
                    <span className="block text-xs text-muted-foreground">
                      {formatDate(l.practiced_on + "T12:00:00")} · {l.minutes} min
                    </span>
                  </span>
                  <DeleteRecordButton id={l.id} kind="log" />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
