"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { translateDbError, type ActionResult } from "@/lib/action-result";

const statusSchema = z.enum(["ativa", "concluida", "pausada", "cancelada"]);

export async function updateGoalStatus(id: string, status: z.infer<typeof statusSchema>, note?: string): Promise<ActionResult> {
  const s = statusSchema.safeParse(status);
  if (!s.success) return { ok: false, error: "Status inválido." };
  await actionUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("practice_goals")
    .update({ status: s.data, ...(note !== undefined ? { progress_note: note.slice(0, 2000) } : {}) })
    .eq("id", id);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath("/jornada");
  revalidatePath("/professor", "layout");
  return { ok: true };
}

const goalSchema = z.object({
  userId: z.guid(),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).default(""),
  horizon: z.coerce.number().refine((n) => [1, 4, 8, 12].includes(n), "Prazo inválido"),
  skill: z.string().optional(),
  targetLevel: z.coerce.number().int().min(1).max(5).optional(),
});

export async function createGoal(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const p = goalSchema.safeParse({
    userId: formData.get("userId"),
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    horizon: formData.get("horizon"),
    skill: formData.get("skill") || undefined,
    targetLevel: formData.get("targetLevel") || undefined,
  });
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  const user = await actionUser();
  if (p.data.userId !== user.id && !user.isStaff) return { ok: false, error: "Sem permissão." };
  const supabase = await createClient();
  const due = new Date(Date.now() + p.data.horizon * 7 * 86400000).toISOString().slice(0, 10);
  const { error } = await supabase.from("practice_goals").insert({
    user_id: p.data.userId,
    title: p.data.title,
    description: p.data.description,
    horizon_weeks: p.data.horizon,
    skill_slug: p.data.skill ?? null,
    target_level: p.data.targetLevel ?? null,
    due_on: due,
    created_by: user.id,
  });
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath("/jornada");
  revalidatePath(`/professor/integrantes/${p.data.userId}`);
  return { ok: true, message: "Meta criada." };
}
