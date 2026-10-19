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

/** Panorama de todos os integrantes ativos para professores e diretor. */
export async function getMembersOverview(days = 30): Promise<MemberOverview[]> {
  const supabase = await createClient();
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const [{ data: profiles }, { data: cls }, { data: attempts }, { data: logs }, { data: progress }, { data: assessments }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, created_at").eq("is_active", true).order("full_name"),
    supabase.from("vocal_classifications").select("user_id, classification, status, classified_by, comfortable_low_midi, comfortable_high_midi").eq("is_current", true),
    supabase.from("exercise_attempts").select("user_id, score, created_at").gte("created_at", since).order("created_at", { ascending: false }).limit(5000),
    supabase.from("practice_logs").select("user_id, practiced_on").gte("practiced_on", since.slice(0, 10)),
    supabase.from("user_progress").select("user_id, status").eq("status", "concluida"),
    supabase.from("vocal_assessments").select("user_id, kind, report, questionnaire, created_at").order("created_at", { ascending: false }),
  ]);
  const clsBy = new Map((cls ?? []).map((c) => [c.user_id, c]));
  return (profiles ?? []).map((p) => {
    const mine = (attempts ?? []).filter((a) => a.user_id === p.id);
    const myLogs = (logs ?? []).filter((l) => l.user_id === p.id);
    const daysSet = new Set([...mine.map((a) => localDay(a.created_at)), ...myLogs.map((l) => l.practiced_on)]);
    const last = [mine[0]?.created_at, myLogs.map((l) => l.practiced_on).sort().at(-1)].filter(Boolean).sort().at(-1) ?? null;
    const recent = mine.slice(0, 10);
    const recentAvg = recent.length ? recent.reduce((a, b) => a + Number(b.score), 0) / recent.length : null;
    const myAssess = (assessments ?? []).filter((a) => a.user_id === p.id);
    const latest = myAssess.find((a) => a.kind !== "professor");
    const c = clsBy.get(p.id);
    const flags: string[] = [];
    if (!myAssess.some((a) => a.kind === "inicial")) flags.push("Sem avaliação inicial");
    if (!last || Date.now() - new Date(last).getTime() > 14 * 86400000) flags.push("Sem prática há 14+ dias");
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
