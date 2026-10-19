import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { ClassificationCard, type ClassificationData } from "@/components/common/classification-card";
import { GoalList } from "@/components/common/goal-list";
import { Badge } from "@/components/ui/badge";
import { ClassificationForm, DeleteObservationButton, GoalForm, ObservationForm, PlanForm, SkillOverrideRow, TeacherAssessmentForm } from "@/components/teacher/teacher-forms";
import { requireStaff, ROLE_LABELS } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getLessonsIndex, getSkills } from "@/lib/data/content";
import { CLASSIFICATION_STATUS_LABELS, VOICE_LABELS } from "@/lib/pedagogy/classification";
import { formatDate, formatRelative, pct } from "@/lib/format";
import { noteName } from "@/lib/music/notes";

export const metadata: Metadata = { title: "Integrante" };

function Card({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="space-y-3 rounded-2xl border bg-card p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default async function IntegrantePage({ params }: PageProps<"/professor/integrantes/[id]">) {
  const { id } = await params;
  const me = await requireStaff();
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
  if (!profile) notFound();
  const [{ data: roles }, { data: classifications }, { data: assessments }, { data: mastery }, skills, { data: observations }, { data: plan }, { data: goals }, { data: attempts }, lessons, { data: progress }, { data: stats }] = await Promise.all([
    supabase.from("user_roles").select("role").eq("user_id", id),
    supabase.from("vocal_classifications").select("*, author:profiles!vocal_classifications_classified_by_fkey(full_name)").eq("user_id", id).order("created_at", { ascending: false }),
    supabase.from("vocal_assessments").select("id, kind, created_at, notes, assessed_by, report, comfortable_low_midi, comfortable_high_midi, author:profiles!vocal_assessments_assessed_by_fkey(full_name)").eq("user_id", id).order("created_at", { ascending: false }),
    supabase.from("skill_mastery").select("*").eq("user_id", id),
    getSkills(),
    supabase.from("teacher_observations").select("id, category, content, visible_to_member, created_at, author_id, author:profiles!teacher_observations_author_id_fkey(full_name)").eq("user_id", id).order("created_at", { ascending: false }),
    supabase.from("study_plans").select("*").eq("user_id", id).eq("is_current", true).maybeSingle(),
    supabase.from("practice_goals").select("*").eq("user_id", id).order("created_at", { ascending: false }),
    supabase.from("exercise_attempts").select("id, score, created_at, details, exercises(title)").eq("user_id", id).order("created_at", { ascending: false }).limit(15),
    getLessonsIndex(),
    supabase.from("user_progress").select("lesson_id, status").eq("user_id", id),
    supabase.rpc("member_stats", { p_user: id }),
  ]);
  const current = classifications?.find((c) => c.is_current) ?? null;
  const masteryBy = new Map((mastery ?? []).map((m) => [m.skill_slug, m]));
  const skillName = new Map(skills.map((s) => [s.slug, s.name]));
  const completed = new Set((progress ?? []).filter((p) => p.status === "concluida").map((p) => p.lesson_id));
  const s = stats?.[0];

  return (
    <>
      <nav aria-label="Trilha de navegação" className="mb-3 text-sm text-muted-foreground">
        <Link href="/professor" className="hover:underline">
          Área do professor
        </Link>{" "}
        / {profile.full_name}
      </nav>
      <PageHeader
        title={profile.full_name}
        description={`Membro desde ${formatDate(profile.created_at)} · ${(roles ?? []).map((r) => ROLE_LABELS[r.role].split(" /")[0]).join(", ")}`}
        actions={!profile.is_active ? <Badge variant="destructive">Conta inativa</Badge> : undefined}
      />
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Sequência", `${s?.streak_days ?? 0} dias`],
          ["Dias ativos (7d)", s?.active_days_7 ?? 0],
          ["Aulas concluídas", `${completed.size} de ${lessons.length}`],
          ["Atividades", s?.attempts_total ?? 0],
        ].map(([l, v]) => (
          <div key={l} className="rounded-2xl border bg-card p-4">
            <p className="font-heading text-xl">{v}</p>
            <p className="text-sm text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <ClassificationCard data={current as ClassificationData | null} authorName={current?.author?.full_name} />
          <Card title="Registrar classificação (fica no histórico)">
            <ClassificationForm userId={id} current={current} />
            {classifications && classifications.length > 1 && (
              <details className="text-sm">
                <summary className="cursor-pointer font-medium">Histórico de classificações ({classifications.length})</summary>
                <ul className="mt-2 space-y-1">
                  {classifications.map((c) => (
                    <li key={c.id} className="flex flex-wrap justify-between gap-2 rounded-lg bg-muted/40 px-3 py-1.5">
                      <span>
                        {VOICE_LABELS[c.classification]} · {CLASSIFICATION_STATUS_LABELS[c.status]}
                        {c.comfortable_low_midi && c.comfortable_high_midi ? ` · ${noteName(c.comfortable_low_midi)}–${noteName(c.comfortable_high_midi)}` : ""}
                      </span>
                      <span className="text-muted-foreground">
                        {c.classified_by ? c.author?.full_name ?? "Professor(a)" : "automática"} · {formatDate(c.created_at)}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </Card>
          <Card title="Avaliações">
            <ul className="space-y-2 text-sm">
              {(assessments ?? []).map((a) => (
                <li key={a.id} className="rounded-lg border p-3">
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="font-medium">{a.kind === "inicial" ? "Avaliação inicial" : a.kind === "periodica" ? "Avaliação de evolução" : `Avaliação de ${a.author?.full_name ?? "professor(a)"}`}</span>
                    <span className="text-muted-foreground">{formatDate(a.created_at)}</span>
                  </div>
                  {a.notes && <p className="mt-1 text-muted-foreground">{a.notes}</p>}
                  {a.kind !== "professor" && (
                    <Link href={`/jornada/relatorio/${a.id}`} className="text-primary underline-offset-4 hover:underline">
                      Ver relatório
                    </Link>
                  )}
                </li>
              ))}
              {(assessments ?? []).length === 0 && <li className="text-muted-foreground">Ainda não fez a avaliação inicial.</li>}
            </ul>
            <details>
              <summary className="cursor-pointer text-sm font-medium">Registrar avaliação do professor</summary>
              <div className="mt-3">
                <TeacherAssessmentForm userId={id} />
              </div>
            </details>
          </Card>
          <Card title="Observações técnicas">
            <ObservationForm userId={id} />
            <ul className="space-y-2">
              {(observations ?? []).map((o) => (
                <li key={o.id} className="flex items-start gap-2 rounded-lg border p-3 text-sm">
                  <div className="flex-1">
                    <p>{o.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.category.replace("_", " ")} · {o.author?.full_name ?? "—"} · {formatRelative(o.created_at)} · {o.visible_to_member ? "visível ao integrante" : "somente equipe"}
                    </p>
                  </div>
                  {(o.author_id === me.id || me.isDirector) && <DeleteObservationButton id={o.id} userId={id} />}
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="space-y-6">
          <Card title="Domínio das habilidades">
            <p className="text-sm text-muted-foreground">O nível automático vem das atividades. Registre exceções e a aplicação em repertório (nível 5) com evidências.</p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-2">Habilidade</th>
                    <th className="p-2">Automático</th>
                    <th className="p-2">Professor</th>
                    <th className="p-2">Evidência</th>
                    <th className="p-2" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {skills.map((k) => {
                    const m = masteryBy.get(k.slug);
                    return <SkillOverrideRow key={k.slug} userId={id} skill={k.slug} name={k.name} autoLevel={m?.auto_level ?? 1} teacherLevel={m?.teacher_level ?? null} evidence={m?.evidence ?? null} />;
                  })}
                </tbody>
              </table>
            </div>
          </Card>
          <Card title="Plano individual">
            <PlanForm
              userId={id}
              plan={plan}
              skills={skills.map((k) => ({ slug: k.slug, name: k.name }))}
              lessons={lessons.map((l) => ({ slug: l.slug, label: `${l.learning_paths?.code} · ${l.title}${completed.has(l.id) ? " ✓" : ""}` }))}
            />
          </Card>
          <Card title="Metas">
            <GoalForm userId={id} skills={skills.map((k) => ({ slug: k.slug, name: k.name }))} />
            <GoalList
              goals={(goals ?? []).map((g) => ({ ...g, skillName: g.skill_slug ? skillName.get(g.skill_slug) : undefined, currentLevel: g.skill_slug ? masteryBy.get(g.skill_slug)?.level ?? 1 : undefined, byTeacher: g.created_by !== id }))}
            />
          </Card>
          <Card title="Atividades recentes">
            <ul className="divide-y text-sm">
              {(attempts ?? []).map((a) => (
                <li key={a.id} className="flex justify-between gap-2 py-2">
                  <span>
                    {a.exercises?.title}
                    {(a.details as { selfReported?: boolean })?.selfReported ? <span className="text-xs text-muted-foreground"> · autoavaliação</span> : null}
                  </span>
                  <span className="text-muted-foreground">
                    {pct(Number(a.score))} · {formatRelative(a.created_at)}
                  </span>
                </li>
              ))}
              {(attempts ?? []).length === 0 && <li className="py-2 text-muted-foreground">Nenhuma atividade.</li>}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
