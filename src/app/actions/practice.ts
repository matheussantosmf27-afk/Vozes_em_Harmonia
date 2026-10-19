"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { translateDbError, type ActionResult } from "@/lib/action-result";
import type { Json } from "@/lib/supabase/database.types";

const attemptSchema = z.object({
  exerciseId: z.guid().optional(),
  exerciseSlug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  score: z.number().min(0).max(1),
  correct: z.number().int().min(0),
  total: z.number().int().min(0),
  durationMs: z.number().int().min(0).max(4 * 60 * 60 * 1000).optional(),
  level: z.number().int().min(1).max(5).optional(),
  details: z.record(z.string(), z.unknown()).default({}),
  revalidate: z.string().startsWith("/").optional(),
});

export interface AttemptOutcome {
  achievements: string[];
  lessonCompleted: boolean;
}

export async function recordAttempt(input: z.input<typeof attemptSchema>): Promise<ActionResult<AttemptOutcome>> {
  const parsed = attemptSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Resultado inválido." };
  let user;
  try {
    user = await actionUser();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const d = parsed.data;
  if (d.correct > d.total) return { ok: false, error: "Resultado inválido." };
  const supabase = await createClient();

  if (!d.exerciseId && !d.exerciseSlug) return { ok: false, error: "Atividade não informada." };
  const query = supabase.from("exercises").select("id, lesson_id");
  const { data: exercise } = await (d.exerciseId ? query.eq("id", d.exerciseId) : query.eq("slug", d.exerciseSlug!)).maybeSingle();
  if (!exercise) return { ok: false, error: "Atividade não encontrada." };

  const [{ data: before }, progressBefore] = await Promise.all([
    supabase.from("user_achievements").select("achievement_slug").eq("user_id", user.id),
    exercise.lesson_id
      ? supabase.from("user_progress").select("status").eq("user_id", user.id).eq("lesson_id", exercise.lesson_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const { error } = await supabase.from("exercise_attempts").insert({
    user_id: user.id,
    exercise_id: exercise.id,
    score: Math.round(d.score * 10000) / 10000,
    correct_count: d.correct,
    total_count: d.total,
    duration_ms: d.durationMs ?? null,
    difficulty_level: d.level ?? null,
    details: d.details as Json,
  });
  if (error) return { ok: false, error: translateDbError(error) };

  const had = new Set((before ?? []).map((a) => a.achievement_slug));
  const [{ data: after }, progressAfter] = await Promise.all([
    supabase.from("user_achievements").select("achievement_slug, achievements(title)").eq("user_id", user.id),
    exercise.lesson_id
      ? supabase.from("user_progress").select("status").eq("user_id", user.id).eq("lesson_id", exercise.lesson_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const achievements = (after ?? [])
    .filter((a) => !had.has(a.achievement_slug))
    .map((a) => (a.achievements as { title: string } | null)?.title ?? a.achievement_slug);
  const lessonCompleted = progressBefore.data?.status !== "concluida" && progressAfter.data?.status === "concluida";

  revalidatePath("/inicio");
  revalidatePath("/progresso");
  revalidatePath("/jornada");
  if (d.revalidate) revalidatePath(d.revalidate);
  return { ok: true, data: { achievements, lessonCompleted } };
}

export async function startLesson(lessonId: string, path: string): Promise<void> {
  const user = await actionUser();
  const supabase = await createClient();
  await supabase.from("user_progress").upsert(
    { user_id: user.id, lesson_id: lessonId, status: "em_andamento" },
    { onConflict: "user_id,lesson_id", ignoreDuplicates: true },
  );
  if (path.startsWith("/")) revalidatePath(path);
}

const logSchema = z.object({
  minutes: z.coerce.number().int().min(1).max(600),
  activity: z.string().trim().min(1).max(120),
  notes: z.string().trim().max(2000).optional(),
});

export async function logPractice(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = logSchema.safeParse({
    minutes: formData.get("minutes"),
    activity: formData.get("activity"),
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const user = await actionUser();
  const supabase = await createClient();
  const { error } = await supabase.from("practice_logs").insert({ user_id: user.id, ...parsed.data });
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath("/progresso");
  revalidatePath("/inicio");
  return { ok: true, message: "Estudo registrado. Bom trabalho!" };
}

export async function deleteAttempt(id: string): Promise<ActionResult> {
  const user = await actionUser();
  const supabase = await createClient();
  const { error } = await supabase.from("exercise_attempts").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath("/progresso");
  return { ok: true };
}

export async function deletePracticeLog(id: string): Promise<ActionResult> {
  const user = await actionUser();
  const supabase = await createClient();
  const { error } = await supabase.from("practice_logs").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath("/progresso");
  return { ok: true };
}

export async function logPracticeDirect(input: { minutes: number; activity: string; notes?: string }): Promise<ActionResult> {
  const parsed = logSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const user = await actionUser();
  const supabase = await createClient();
  const { error } = await supabase.from("practice_logs").insert({ user_id: user.id, ...parsed.data });
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath("/progresso");
  revalidatePath("/inicio");
  return { ok: true };
}
