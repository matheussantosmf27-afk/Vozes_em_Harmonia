"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { translateDbError, type ActionResult } from "@/lib/action-result";
import { CONFIG_SCHEMAS, EXERCISE_TYPES } from "@/lib/exercises/schemas";
import type { Json } from "@/lib/supabase/database.types";

const VOICES = ["soprano", "mezzo_soprano", "contralto", "tenor", "baritono", "baixo", "nao_classificada"] as const;
const midiOpt = z.preprocess((v) => (v === "" || v === null || v === undefined ? null : Number(v)), z.number().int().min(21).max(108).nullable());

async function staff() {
  return actionUser("staff");
}

function memberPath(id: string) {
  return `/professor/integrantes/${id}`;
}

const classificationSchema = z.object({
  userId: z.guid(),
  classification: z.enum(VOICES),
  status: z.enum(["provisoria", "em_desenvolvimento", "confirmada"]),
  comfortableLow: midiOpt,
  comfortableHigh: midiOpt,
  rangeLow: midiOpt,
  rangeHigh: midiOpt,
  tessituraLow: midiOpt,
  tessituraHigh: midiOpt,
  passaggio: z.string().trim().max(300).optional(),
  notes: z.string().trim().max(4000).optional(),
});

export async function setClassification(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const p = classificationSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  let user;
  try {
    user = await staff();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const d = p.data;
  for (const [a, b] of [[d.comfortableLow, d.comfortableHigh], [d.rangeLow, d.rangeHigh], [d.tessituraLow, d.tessituraHigh]]) {
    if (a !== null && b !== null && a > b) return { ok: false, error: "A nota grave deve ser menor que a aguda." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("vocal_classifications").insert({
    user_id: d.userId,
    classification: d.classification,
    status: d.status,
    comfortable_low_midi: d.comfortableLow,
    comfortable_high_midi: d.comfortableHigh,
    range_low_midi: d.rangeLow,
    range_high_midi: d.rangeHigh,
    tessitura_low_midi: d.tessituraLow,
    tessitura_high_midi: d.tessituraHigh,
    passaggio: d.passaggio || null,
    notes: d.notes || null,
    classified_by: user.id,
  });
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(memberPath(d.userId));
  return { ok: true, message: "Classificação registrada. O histórico anterior foi preservado." };
}

const assessmentSchema = z.object({
  userId: z.guid(),
  notes: z.string().trim().min(1, "Descreva a avaliação.").max(4000),
  comfortableLow: midiOpt,
  comfortableHigh: midiOpt,
  rangeLow: midiOpt,
  rangeHigh: midiOpt,
});

export async function addTeacherAssessment(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const p = assessmentSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  let user;
  try {
    user = await staff();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const d = p.data;
  const supabase = await createClient();
  const { error } = await supabase.from("vocal_assessments").insert({
    user_id: d.userId,
    kind: "professor",
    assessed_by: user.id,
    notes: d.notes,
    comfortable_low_midi: d.comfortableLow,
    comfortable_high_midi: d.comfortableHigh,
    range_low_midi: d.rangeLow,
    range_high_midi: d.rangeHigh,
    range_confidence: d.rangeLow || d.comfortableLow ? "confiavel" : "nao_medida",
    report: { avaliadoPeloProfessor: true } as Json,
  });
  if (error) return { ok: false, error: translateDbError(error) };
  const low = d.rangeLow ?? d.comfortableLow;
  const high = d.rangeHigh ?? d.comfortableHigh;
  if (low !== null && high !== null && low <= high) {
    await supabase.from("vocal_ranges").insert({
      user_id: d.userId,
      low_midi: low,
      high_midi: high,
      comfortable_low_midi: d.comfortableLow,
      comfortable_high_midi: d.comfortableHigh,
      source: "professor",
      confidence: "confiavel",
      measured_by: user.id,
    });
  }
  revalidatePath(memberPath(d.userId));
  return { ok: true, message: "Avaliação registrada." };
}

export async function setSkillOverride(userId: string, skill: string, level: number | null, evidence: string): Promise<ActionResult> {
  try {
    await staff();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  if (level !== null && (level < 1 || level > 5)) return { ok: false, error: "Nível inválido." };
  const supabase = await createClient();
  const { data: existing } = await supabase.from("skill_mastery").select("user_id").eq("user_id", userId).eq("skill_slug", skill).maybeSingle();
  const { error } = existing
    ? await supabase.from("skill_mastery").update({ teacher_level: level, evidence: evidence.slice(0, 2000) || null }).eq("user_id", userId).eq("skill_slug", skill)
    : await supabase.from("skill_mastery").insert({ user_id: userId, skill_slug: skill, teacher_level: level, evidence: evidence.slice(0, 2000) || null });
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(memberPath(userId));
  return { ok: true };
}

const observationSchema = z.object({
  userId: z.guid(),
  category: z.enum(["geral", "afinacao", "respiracao", "ritmo", "projecao", "percepcao", "independencia_vocal", "interpretacao", "saude_vocal", "distribuicao_vocal"]),
  content: z.string().trim().min(1, "Escreva a observação.").max(4000),
  visible: z.boolean(),
});

export async function addObservation(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const p = observationSchema.safeParse({ userId: formData.get("userId"), category: formData.get("category"), content: formData.get("content"), visible: formData.get("visible") === "on" });
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  let user;
  try {
    user = await staff();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("teacher_observations").insert({ user_id: p.data.userId, author_id: user.id, category: p.data.category, content: p.data.content, visible_to_member: p.data.visible });
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(memberPath(p.data.userId));
  return { ok: true, message: "Observação registrada." };
}

export async function deleteObservation(id: string, userId: string): Promise<ActionResult> {
  await staff();
  const supabase = await createClient();
  const { error } = await supabase.from("teacher_observations").delete().eq("id", id);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(memberPath(userId));
  return { ok: true };
}

const planSchema = z.object({
  userId: z.guid(),
  planId: z.guid().optional().or(z.literal("")),
  objective: z.string().trim().min(1).max(600),
  weeklyFrequency: z.coerce.number().int().min(1).max(7),
  minutesPerSession: z.coerce.number().int().min(5).max(120),
  reviewEveryWeeks: z.coerce.number().int().min(1).max(12),
  prioritySkills: z.array(z.string().regex(/^[a-z0-9-]+$/)).max(8),
  recommendedLessons: z.array(z.string().regex(/^[a-z0-9-]+$/)).max(12),
  completionCriteria: z.string().trim().max(1000).default(""),
  nextLevel: z.string().trim().max(1000).default(""),
});

export async function savePlan(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const p = planSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    prioritySkills: formData.getAll("prioritySkills"),
    recommendedLessons: formData.getAll("recommendedLessons"),
  });
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  let user;
  try {
    user = await staff();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const d = p.data;
  const supabase = await createClient();
  const row = {
    objective: d.objective,
    weekly_frequency: d.weeklyFrequency,
    minutes_per_session: d.minutesPerSession,
    review_every_weeks: d.reviewEveryWeeks,
    priority_skills: d.prioritySkills,
    recommended_lessons: d.recommendedLessons,
    completion_criteria: d.completionCriteria,
    next_level: d.nextLevel,
  };
  const { error } = d.planId
    ? await supabase.from("study_plans").update(row).eq("id", d.planId)
    : await supabase.from("study_plans").insert({ ...row, user_id: d.userId, created_by: user.id });
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(memberPath(d.userId));
  return { ok: true, message: "Plano atualizado." };
}

const activitySchema = z.object({
  title: z.string().trim().min(3).max(160),
  instructions: z.string().trim().max(1000).default(""),
  type: z.enum(EXERCISE_TYPES),
  skill: z.string().regex(/^[a-z0-9-]+$/),
  lessonId: z.guid().nullable(),
  purpose: z.enum(["pratica", "avaliacao"]),
  difficulty: z.number().int().min(1).max(5),
  config: z.record(z.string(), z.unknown()),
});

export async function createActivity(input: z.input<typeof activitySchema>): Promise<ActionResult> {
  const p = activitySchema.safeParse(input);
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  const cfg = CONFIG_SCHEMAS[p.data.type].safeParse(p.data.config);
  if (!cfg.success) return { ok: false, error: `Configuração inválida: ${cfg.error.issues[0].message}` };
  let user;
  try {
    user = await staff();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const supabase = await createClient();
  const slug = `prof-${p.data.title.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40)}-${Date.now().toString(36)}`;
  const { error } = await supabase.from("exercises").insert({
    slug,
    title: p.data.title,
    instructions: p.data.instructions,
    type: p.data.type,
    config: cfg.data as Json,
    skill_slug: p.data.skill,
    lesson_id: p.data.lessonId,
    purpose: p.data.lessonId ? p.data.purpose : "pratica",
    difficulty: p.data.difficulty,
    created_by: user.id,
  });
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath("/professor/atividades");
  revalidatePath("/aprender");
  return { ok: true, message: "Atividade criada." };
}

export async function toggleActivity(id: string, published: boolean): Promise<ActionResult> {
  await staff();
  const supabase = await createClient();
  const { error } = await supabase.from("exercises").update({ is_published: published }).eq("id", id).not("created_by", "is", null);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath("/professor/atividades");
  return { ok: true };
}

export async function deleteActivity(id: string): Promise<ActionResult> {
  await staff();
  const supabase = await createClient();
  const { error } = await supabase.from("exercises").delete().eq("id", id).not("created_by", "is", null);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath("/professor/atividades");
  return { ok: true };
}
