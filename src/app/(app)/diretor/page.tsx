import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, CalendarDays, Library, UserCheck, Users, UsersRound } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { ApproveButtons } from "@/components/director/director-controls";
import { requireDirector } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getMembersOverview } from "@/lib/data/staff";
import { getLessonsIndex, getPaths } from "@/lib/data/content";
import { REGION_LABELS, VOICE_LABELS, regionFor, type VoiceClass } from "@/lib/pedagogy/classification";
import { formatDateTime, formatRelative } from "@/lib/format";
import { REPERTOIRE_STATUS_LABELS } from "@/lib/repertoire";

export const metadata: Metadata = { title: "Direção musical" };

const DIFFICULTY_LABELS: Record<string, string> = { afinacao: "Afinação", respiracao: "Fôlego/respiração", ritmo: "Ritmo", agudos: "Notas agudas", graves: "Notas graves", manter_voz: "Manter a própria voz", leitura: "Leitura", timidez: "Timidez/insegurança", cansaco: "Cansaço vocal" };
const LEVEL_LABELS: Record<string, string> = { iniciante: "Iniciante", intermediario: "Intermediário", avancado: "Avançado" };

function Bars({ items, total, empty = "Sem dados no período." }: { items: { label: string; value: number; hint?: string }[]; total?: number; empty?: string }) {
  const max = Math.max(1, total ?? 0, ...items.map((i) => i.value));
  if (!items.some((i) => i.value > 0)) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <li key={i.label} className="grid grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-3 text-sm">
          <span className="truncate">{i.label}</span>
          <span className="h-2.5 overflow-hidden rounded-full bg-muted">
            <span className="block h-full rounded-full bg-primary" style={{ width: `${(i.value / max) * 100}%` }} />
          </span>
          <span className="w-12 text-right tabular-nums text-muted-foreground">{i.hint ?? i.value}</span>
        </li>
      ))}
    </ul>
  );
}

function Panel({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");

export default async function DiretorPage({ searchParams }: PageProps<"/diretor">) {
  await requireDirector();
  const sp = await searchParams;
  const periodo = [7, 30, 90].includes(Number(str(sp.periodo))) ? Number(str(sp.periodo)) : 30;
  const grupo = str(sp.grupo);
  const naipe = str(sp.naipe);
  const trilha = str(sp.trilha);
  const supabase = await createClient();
  const [overview, { data: pending }, { data: groups }, { data: groupMembers }, paths, lessons, { data: progress }, { data: mastery }, { data: skills }, { data: rehearsals }, { data: repertoire }] = await Promise.all([
    getMembersOverview(periodo),
    supabase.from("profiles").select("id, full_name, created_at").eq("is_active", false).order("created_at"),
    supabase.from("vocal_groups").select("id, name").order("name"),
    supabase.from("group_members").select("group_id, user_id"),
    getPaths(),
    getLessonsIndex(),
    supabase.from("user_progress").select("user_id, lesson_id, status").eq("status", "concluida"),
    supabase.from("skill_mastery").select("user_id, skill_slug, level"),
    supabase.from("skills").select("slug, name"),
    supabase.from("rehearsal_sessions").select("id, title, starts_at").gte("starts_at", new Date().toISOString()).neq("status", "cancelado").order("starts_at").limit(5),
    supabase
      .from("repertoire")
      .select("id, title, status, arrangements(id, title, vocal_parts(id, name, arrangement_assignments(status)))")
      .in("status", ["em_estudo", "em_ensaio"])
      .order("title"),
  ]);

  const inGroup = grupo ? new Set((groupMembers ?? []).filter((g) => g.group_id === grupo).map((g) => g.user_id)) : null;
  const members = overview.filter((m) => (!inGroup || inGroup.has(m.id)) && (!naipe || (naipe === "sem" ? !m.classification : m.classification === naipe)));
  const ids = new Set(members.map((m) => m.id));
  const n = members.length;

  // Distribuição vocal (atual), separando provisória de confirmada pelo professor.
  const voices = (Object.keys(VOICE_LABELS) as VoiceClass[]).map((v) => {
    const list = members.filter((m) => (m.classification ?? "nao_classificada") === v || (v === "nao_classificada" && !m.classification));
    return { label: VOICE_LABELS[v], value: list.length, hint: `${list.length}${list.length ? ` (${list.filter((m) => m.classifiedByTeacher).length} conf.)` : ""}` };
  });
  const regions = (["grave", "media", "aguda"] as const).map((r) => ({ label: REGION_LABELS[r], value: members.filter((m) => m.comfortable && regionFor(...m.comfortable) === r).length }));
  const levels = ["iniciante", "intermediario", "avancado"].map((l) => ({ label: LEVEL_LABELS[l], value: members.filter((m) => m.level === l).length }));
  const freq = [
    { label: "Sem prática", value: members.filter((m) => m.activeDays30 === 0).length },
    { label: "1 a 3 dias", value: members.filter((m) => m.activeDays30 >= 1 && m.activeDays30 <= 3).length },
    { label: "4 a 8 dias", value: members.filter((m) => m.activeDays30 >= 4 && m.activeDays30 <= 8).length },
    { label: "9 dias ou mais", value: members.filter((m) => m.activeDays30 >= 9).length },
  ];
  const visiblePaths = trilha ? paths.filter((p) => p.slug === trilha) : paths;
  const pathProgress = visiblePaths.map((p) => {
    const own = lessons.filter((l) => l.path_id === p.id).map((l) => l.id);
    const done = (progress ?? []).filter((x) => ids.has(x.user_id) && own.includes(x.lesson_id)).length;
    const pctDone = n && own.length ? done / (n * own.length) : 0;
    return { label: `${p.code} · ${p.title}`, value: Math.round(pctDone * 100), hint: `${Math.round(pctDone * 100)}%` };
  });
  const diffCount = new Map<string, number>();
  for (const m of members) for (const d of m.difficulties) diffCount.set(d, (diffCount.get(d) ?? 0) + 1);
  const difficulties = [...diffCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => ({ label: DIFFICULTY_LABELS[k] ?? k, value: v }));
  const skillName = new Map((skills ?? []).map((s) => [s.slug, s.name]));
  const skillAgg = new Map<string, { sum: number; count: number }>();
  for (const m of mastery ?? []) {
    if (!ids.has(m.user_id)) continue;
    const a = skillAgg.get(m.skill_slug) ?? { sum: 0, count: 0 };
    a.sum += m.level ?? 1;
    a.count += 1;
    skillAgg.set(m.skill_slug, a);
  }
  const weakSkills = [...skillAgg.entries()]
    .filter(([, a]) => a.count >= 2)
    .map(([k, a]) => ({ label: skillName.get(k) ?? k, avg: a.sum / a.count }))
    .sort((a, b) => a.avg - b.avg)
    .slice(0, 5);

  const reinforcement = (repertoire ?? []).flatMap((r) =>
    r.arrangements
      .map((a) => {
        const weak = a.vocal_parts.filter((p) => !p.arrangement_assignments.some((x) => x.status === "pronto"));
        return {
          song: r.title,
          songId: r.id,
          arrangement: a.title,
          parts: weak.map((p) => `${p.name}${p.arrangement_assignments.length === 0 ? " (ninguém designado)" : ` (${p.arrangement_assignments.length} estudando)`}`),
        };
      })
      .filter((x) => x.parts.length > 0),
  );
  const attention = members.filter((m) => m.flags.length > 0).slice(0, 10);

  return (
    <>
      <PageHeader
        eyebrow="Painel do diretor"
        title="Direção musical"
        description="Indicadores para planejar o desenvolvimento do grupo. Eles apoiam a decisão — a escuta dos professores continua sendo a referência."
        actions={
          <>
            <Link href="/diretor/integrantes" className={buttonVariants({ variant: "outline" })}>
              <Users /> Integrantes e papéis
            </Link>
            <Link href="/diretor/grupos" className={buttonVariants({ variant: "outline" })}>
              <UsersRound /> Grupos e formações
            </Link>
          </>
        }
      />

      <form className="mb-6 grid gap-2 rounded-2xl border bg-card p-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <NativeSelect name="periodo" aria-label="Período" defaultValue={String(periodo)} options={[{ value: "7", label: "Últimos 7 dias" }, { value: "30", label: "Últimos 30 dias" }, { value: "90", label: "Últimos 90 dias" }]} />
        <NativeSelect name="grupo" aria-label="Grupo" defaultValue={grupo} placeholder="Todos os grupos" options={(groups ?? []).map((g) => ({ value: g.id, label: g.name }))} />
        <NativeSelect name="naipe" aria-label="Naipe" defaultValue={naipe} placeholder="Todos os naipes" options={[...(Object.keys(VOICE_LABELS) as VoiceClass[]).filter((v) => v !== "nao_classificada").map((v) => ({ value: v, label: VOICE_LABELS[v] })), { value: "sem", label: "Sem classificação" }]} />
        <NativeSelect name="trilha" aria-label="Trilha" defaultValue={trilha} placeholder="Todas as trilhas" options={paths.map((p) => ({ value: p.slug, label: `${p.code} · ${p.title}` }))} />
        <Button type="submit" variant="secondary">
          Aplicar filtros
        </Button>
      </form>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { icon: Users, label: "Integrantes no filtro", value: n },
          { icon: UserCheck, label: `Praticaram (${periodo} dias)`, value: members.filter((m) => m.activeDays30 > 0).length },
          { icon: AlertCircle, label: "Avaliações pendentes", value: members.filter((m) => !m.hasInitial).length },
          { icon: CalendarDays, label: "Ensaios agendados", value: rehearsals?.length ?? 0 },
          { icon: Library, label: "Músicas em preparação", value: repertoire?.length ?? 0 },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl border bg-card p-4">
            <Icon className="size-5 text-gold" aria-hidden />
            <p className="mt-2 font-heading text-2xl">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {pending && pending.length > 0 && (
        <Panel title={`Aguardando aprovação (${pending.length})`}>
          <ul className="divide-y">
            {pending.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <span>
                  {p.full_name} <span className="text-muted-foreground">· cadastro {formatRelative(p.created_at)}</span>
                </span>
                <ApproveButtons userId={p.id} active={false} />
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Distribuição vocal atual">
          <Bars items={voices} total={n} />
          <p className="text-xs text-muted-foreground">“conf.” = classificações registradas por professor. As demais são provisórias.</p>
        </Panel>
        <Panel title="Região confortável (para formar naipes)">
          <Bars items={regions} total={n} empty="Ainda não há regiões medidas." />
        </Panel>
        <Panel title="Ponto de partida (última avaliação)">
          <Bars items={levels} total={n} empty="Ninguém fez a avaliação ainda." />
        </Panel>
        <Panel title={`Frequência de prática (dias com estudo em ${periodo} dias)`}>
          <Bars items={freq} total={n} />
        </Panel>
        <Panel title="Progresso nas trilhas (média de aulas concluídas)">
          <Bars items={pathProgress} total={100} />
        </Panel>
        <Panel title="Dificuldades mais citadas e habilidades mais frágeis">
          <Bars items={difficulties} empty="Sem respostas de questionário." />
          {weakSkills.length > 0 && (
            <div className="space-y-1 pt-2 text-sm">
              <p className="font-medium">Menor domínio médio</p>
              <ul className="flex flex-wrap gap-2">
                {weakSkills.map((w) => (
                  <li key={w.label}>
                    <Badge variant="secondary">
                      {w.label}: {w.avg.toFixed(1)}/5
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>
        <Panel title="Naipes que precisam de reforço" action={<Link href="/repertorio" className="text-sm text-primary hover:underline">Repertório</Link>}>
          {reinforcement.length ? (
            <ul className="space-y-1.5 text-sm">
              {reinforcement.slice(0, 8).map((r, i) => (
                <li key={i}>
                  <Link href={`/repertorio/${r.songId}`} className="font-medium hover:underline">
                    {r.song}
                  </Link>{" "}
                  <span className="text-muted-foreground">· {r.arrangement}</span>
                  <span className="block text-muted-foreground">{r.parts.join(" · ")}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Todas as vozes do repertório em preparação têm pessoas prontas.</p>
          )}
        </Panel>
        <Panel title="Integrantes que precisam de acompanhamento" action={<Link href="/professor?filtro=atencao" className="text-sm text-primary hover:underline">Ver todos</Link>}>
          {attention.length ? (
            <ul className="space-y-2 text-sm">
              {attention.map((m) => (
                <li key={m.id} className="flex flex-wrap items-center justify-between gap-2">
                  <Link href={`/professor/integrantes/${m.id}`} className="font-medium hover:underline">
                    {m.name}
                  </Link>
                  <span className="flex flex-wrap gap-1">
                    {m.flags.map((f) => (
                      <Badge key={f} variant="outline">
                        {f}
                      </Badge>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Ninguém com alertas no filtro atual.</p>
          )}
        </Panel>
        <Panel title="Próximos ensaios" action={<Link href="/ensaios/novo" className="text-sm text-primary hover:underline">Novo ensaio</Link>}>
          {rehearsals?.length ? (
            <ul className="space-y-1.5 text-sm">
              {rehearsals.map((r) => (
                <li key={r.id}>
                  <Link href={`/ensaios/${r.id}`} className="hover:underline">
                    {r.title}
                  </Link>{" "}
                  <span className="text-muted-foreground">· {formatDateTime(r.starts_at)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum ensaio agendado.</p>
          )}
        </Panel>
        <Panel title="Músicas em preparação">
          {repertoire?.length ? (
            <ul className="space-y-1.5 text-sm">
              {repertoire.map((r) => (
                <li key={r.id} className="flex justify-between gap-2">
                  <Link href={`/repertorio/${r.id}`} className="hover:underline">
                    {r.title}
                  </Link>
                  <Badge variant="outline">{REPERTOIRE_STATUS_LABELS[r.status]}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma música em estudo ou ensaio.</p>
          )}
        </Panel>
      </div>
    </>
  );
}
