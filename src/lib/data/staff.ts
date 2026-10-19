import "server-only";
import { createClient } from "@/lib/supabase/server";
import { localDay } from "@/lib/format";

export interface MemberOverview {
  id: string;
  name: string;
  createdAt: string;
  classification: string | null;
  classificationStatus: string | null;
  classifiedByTeacher: boolean;
  comfortable: [number, number] | null;
  lastActivity: string | null;
  activeDays30: number;
  recentAvg: number | null;
  lessonsCompleted: number;
  hasInitial: boolean;
  level: string | null;
  difficulties: string[];
  flags: string[];
}

const INACTIVE_DAYS = 14;

/** Panorama de todos os integrantes ativos para professores e diretor. */
export async function getMembersOverview(days = 30): Promise<MemberOverview[]> {
  const supabase = await createClient();
  const since = new Date(Date.now() - days * 86400000).toISOString();
  // A busca cobre ao menos 14 dias para o alerta de inatividade não depender do período escolhido.
  const fetchSince = new Date(Date.now() - Math.max(days, INACTIVE_DAYS) * 86400000).toISOString();
  const [{ data: profiles }, { data: cls }, { data: attempts }, { data: logs }, { data: progress }, { data: assessments }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, created_at").eq("is_active", true).order("full_name"),
    supabase.from("vocal_classifications").select("user_id, classification, status, classified_by, comfortable_low_midi, comfortable_high_midi").eq("is_current", true),
    supabase.from("exercise_attempts").select("user_id, score, created_at").gte("created_at", fetchSince).order("created_at", { ascending: false }).limit(5000),
    supabase.from("practice_logs").select("user_id, practiced_on").gte("practiced_on", fetchSince.slice(0, 10)),
    supabase.from("user_progress").select("user_id, status").eq("status", "concluida"),
    supabase.from("vocal_assessments").select("user_id, kind, report, questionnaire, created_at").order("created_at", { ascending: false }),
  ]);
  const clsBy = new Map((cls ?? []).map((c) => [c.user_id, c]));
  return (profiles ?? []).map((p) => {
    const mine = (attempts ?? []).filter((a) => a.user_id === p.id);
    const myLogs = (logs ?? []).filter((l) => l.user_id === p.id);
    const daysSet = new Set([...mine.filter((a) => a.created_at >= since).map((a) => localDay(a.created_at)), ...myLogs.filter((l) => l.practiced_on >= since.slice(0, 10)).map((l) => l.practiced_on)]);
    const last = [mine[0]?.created_at, myLogs.map((l) => l.practiced_on).sort().at(-1)].filter(Boolean).sort().at(-1) ?? null;
    const recent = mine.filter((a) => a.created_at >= since).slice(0, 10);
    const recentAvg = recent.length ? recent.reduce((a, b) => a + Number(b.score), 0) / recent.length : null;
    const myAssess = (assessments ?? []).filter((a) => a.user_id === p.id);
    const latest = myAssess.find((a) => a.kind !== "professor");
    const c = clsBy.get(p.id);
    const flags: string[] = [];
    if (!myAssess.some((a) => a.kind === "inicial")) flags.push("Sem avaliação inicial");
    const inactiveMs = INACTIVE_DAYS * 86400000;
    if (!last) flags.push(Date.now() - new Date(p.created_at).getTime() < inactiveMs ? "Ainda não praticou" : `Sem prática há ${INACTIVE_DAYS}+ dias`);
    else if (Date.now() - new Date(last).getTime() > inactiveMs) flags.push(`Sem prática há ${INACTIVE_DAYS}+ dias`);
    if (recentAvg !== null && recent.length >= 3 && recentAvg < 0.5) flags.push("Média recente abaixo de 50%");
    if (c && !c.classified_by) flags.push("Classificação aguardando revisão");
    return {
      id: p.id,
      name: p.full_name,
      createdAt: p.created_at,
      classification: c?.classification ?? null,
      classificationStatus: c?.status ?? null,
      classifiedByTeacher: !!c?.classified_by,
      comfortable: c?.comfortable_low_midi && c.comfortable_high_midi ? [c.comfortable_low_midi, c.comfortable_high_midi] : null,
      lastActivity: last,
      activeDays30: daysSet.size,
      recentAvg,
      lessonsCompleted: (progress ?? []).filter((x) => x.user_id === p.id).length,
      hasInitial: myAssess.some((a) => a.kind === "inicial"),
      level: (latest?.report as { level?: string } | null)?.level ?? null,
      difficulties: ((latest?.questionnaire as { dificuldades?: string[] } | null)?.dificuldades ?? []) as string[],
      flags,
    };
  });
}
