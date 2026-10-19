"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { translateDbError, type ActionResult } from "@/lib/action-result";
import { generatePlan, TEST_KEYS, type Questionnaire } from "@/lib/pedagogy/plan";
import { suggestClassification } from "@/lib/pedagogy/classification";
import type { Json } from "@/lib/supabase/database.types";

const questionnaireSchema = z.object({
  experiencia: z.enum(["nenhuma", "pouca", "moderada", "muita"]),
  cantaEmGrupo: z.enum(["nunca", "as_vezes", "regularmente"]),
  formacoes: z.array(z.enum(["coral", "quarteto", "louvor", "solo"])).max(4),
  lePartitura: z.enum(["nao", "um_pouco", "sim"]),
  conheceCifras: z.enum(["nao", "um_pouco", "sim"]),
  tocaInstrumento: z.boolean(),
  instrumento: z.string().trim().max(80).optional(),
  aulasDeCanto: z.enum(["nunca", "menos_1_ano", "mais_1_ano"]),
  dificuldades: z.array(z.enum(["afinacao", "respiracao", "ritmo", "agudos", "graves", "manter_voz", "leitura", "timidez", "cansaco"])).max(9),
  facilidadeRegiao: z.enum(["graves", "medias", "agudas", "nao_sei"]),
  manterVozDiferente: z.enum(["nao", "com_dificuldade", "sim"]),
  grupoVocal: z.enum(["feminina", "masculina", "nao_informado"]),
  diasPorSemana: z.number().int().min(1).max(7),
  minutosPorDia: z.number().int().min(5).max(120),
}) satisfies z.ZodType<Questionnaire>;

const score = z.number().min(0).max(1).nullable();
const midi = z.number().int().min(21).max(108);

const submitSchema = z.object({
  kind: z.enum(["inicial", "periodica"]),
  questionnaire: questionnaireSchema,
  tests: z.object(Object.fromEntries(TEST_KEYS.map((k) => [k, score.optional()])) as Record<(typeof TEST_KEYS)[number], z.ZodOptional<typeof score>>),
  range: z
    .object({ low: midi, high: midi, comfortableLow: midi, comfortableHigh: midi, confidence: z.enum(["confiavel", "incerta"]), usedMic: z.boolean() })
    .nullable(),
  diagnostics: z
    .array(z.object({ slug: z.string().regex(/^diag-[a-z-]+$/), score: z.number().min(0).max(1), correct: z.number().int().min(0), total: z.number().int().min(0), selfReported: z.boolean() }))
    .max(20),
  notes: z.string().trim().max(2000).optional(),
});

export async function submitAssessment(input: z.input<typeof submitSchema>): Promise<ActionResult<{ id: string }>> {
  const parsed = submitSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Alguma resposta está incompleta. Revise a avaliação." };
  let user;
  try {
    user = await actionUser();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const { kind, questionnaire: q, tests, range, diagnostics, notes } = parsed.data;
  const supabase = await createClient();

  const { data: lessons } = await supabase.from("lessons").select("slug, sort, learning_paths(sort)");
  const order = [...(lessons ?? [])]
    .sort((a, b) => (a.learning_paths?.sort ?? 0) - (b.learning_paths?.sort ?? 0) || a.sort - b.sort)
    .map((l) => l.slug);

  const plan = generatePlan(q, tests, order);
  const suggestion = suggestClassification({
    comfortableLow: range?.comfortableLow ?? null,
    comfortableHigh: range?.comfortableHigh ?? null,
    rangeLow: range?.low ?? null,
    rangeHigh: range?.high ?? null,
    group: q.grupoVocal,
  });

  const { data: assessment, error } = await supabase
    .from("vocal_assessments")
    .insert({
      user_id: user.id,
      kind,
      questionnaire: q as unknown as Json,
      test_results: tests as unknown as Json,
      range_low_midi: range?.low ?? null,
      range_high_midi: range?.high ?? null,
      comfortable_low_midi: range?.comfortableLow ?? null,
      comfortable_high_midi: range?.comfortableHigh ?? null,
      range_confidence: range ? range.confidence : "nao_medida",
      suggested_classification: suggestion.classification,
      notes: notes ?? null,
      report: {
        level: plan.level,
        strengths: plan.report.strengths,
        toDevelop: plan.report.toDevelop,
        recommendations: plan.report.recommendations,
        estimates: plan.estimates,
        classification: suggestion,
        prioritySkills: plan.prioritySkills,
      } as unknown as Json,
    })
    .select("id")
    .single();
  if (error || !assessment) return { ok: false, error: translateDbError(error) };

  if (range) {
    await supabase.from("vocal_ranges").insert({
      user_id: user.id,
      low_midi: range.low,
      high_midi: range.high,
      comfortable_low_midi: range.comfortableLow,
      comfortable_high_midi: range.comfortableHigh,
      source: range.usedMic ? "teste_automatico" : "autoavaliacao",
      confidence: range.confidence,
    });
  }

  // A sugestão automática nunca substitui uma classificação feita pelo professor (RLS garante).
  await supabase.from("vocal_classifications").insert({
    user_id: user.id,
    classification: suggestion.classification,
    status: "provisoria",
    comfortable_low_midi: range?.comfortableLow ?? null,
    comfortable_high_midi: range?.comfortableHigh ?? null,
    range_low_midi: range?.low ?? null,
    range_high_midi: range?.high ?? null,
    notes: suggestion.explanation,
    assessment_id: assessment.id,
  });

  const { data: newPlan, error: planError } = await supabase
    .from("study_plans")
    .insert({
      user_id: user.id,
      assessment_id: assessment.id,
      objective: plan.objective,
      priority_skills: plan.prioritySkills,
      recommended_lessons: plan.recommendedLessons,
      daily_exercises: plan.dailyExercises as unknown as Json,
      weekly_frequency: plan.weeklyFrequency,
      minutes_per_session: plan.minutesPerSession,
      review_every_weeks: plan.reviewEveryWeeks,
      completion_criteria: plan.completionCriteria,
      next_level: plan.nextLevel,
      rationale: plan.rationale as unknown as Json,
      created_by: user.id,
    })
    .select("id")
    .single();
  if (planError) return { ok: false, error: translateDbError(planError) };

  if (newPlan) {
    // Metas do plano anterior criadas automaticamente são substituídas pelas novas.
    await supabase.from("practice_goals").update({ status: "cancelada" }).eq("user_id", user.id).eq("status", "ativa").eq("created_by", user.id).not("plan_id", "is", null);
    const today = new Date();
    await supabase.from("practice_goals").insert(
      plan.goals.map((g) => ({
        user_id: user.id,
        plan_id: newPlan.id,
        title: g.title,
        description: g.description,
        horizon_weeks: g.horizonWeeks,
        skill_slug: g.skill ?? null,
        target_level: g.targetLevel ?? null,
        due_on: new Date(today.getTime() + g.horizonWeeks * 7 * 86400000).toISOString().slice(0, 10),
        created_by: user.id,
      })),
    );
  }

  if (diagnostics.length) {
    const { data: exs } = await supabase.from("exercises").select("id, slug").in("slug", diagnostics.map((d) => d.slug));
    const bySlug = new Map((exs ?? []).map((e) => [e.slug, e.id]));
    const rows = diagnostics
      .filter((d) => bySlug.has(d.slug) && d.correct <= d.total)
      .map((d) => ({
        user_id: user.id,
        exercise_id: bySlug.get(d.slug)!,
        score: Math.round(d.score * 10000) / 10000,
        correct_count: d.correct,
        total_count: d.total,
        details: { assessment: assessment.id, selfReported: d.selfReported } as Json,
      }));
    if (rows.length) await supabase.from("exercise_attempts").insert(rows);
  }

  revalidatePath("/inicio");
  revalidatePath("/jornada");
  return { ok: true, data: { id: assessment.id } };
}
