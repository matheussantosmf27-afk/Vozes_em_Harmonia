"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { actionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { translateDbError, type ActionResult } from "@/lib/action-result";
import type { Json } from "@/lib/supabase/database.types";

const agendaItem = z.object({
  minutes: z.number().int().min(1).max(300),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000).default(""),
  responsible: z.string().trim().max(120).default(""),
});

const rehearsalSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().trim().min(1, "Informe um título.").max(160),
  startsAt: z.string().min(10, "Informe data e horário."),
  durationMinutes: z.number().int().min(5).max(600),
  location: z.string().trim().max(200).optional(),
  groupId: z.uuid().nullable().optional(),
  objectives: z.string().trim().max(4000).default(""),
  agenda: z.array(agendaItem).max(30),
  repertoire: z.array(z.object({ id: z.uuid(), focus: z.string().trim().max(300).optional() })).max(30),
});

/** Converte "AAAA-MM-DDTHH:mm" (horário de Brasília) em ISO UTC. */
function brasiliaToIso(local: string) {
  const d = new Date(`${local}:00-03:00`);
  if (Number.isNaN(d.getTime())) throw new Error("Data inválida");
  return d.toISOString();
}

export async function saveRehearsal(input: z.input<typeof rehearsalSchema>): Promise<ActionResult<{ id: string }>> {
  const p = rehearsalSchema.safeParse(input);
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  let user;
  try {
    user = await actionUser(input.id ? "staff" : "diretor");
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const d = p.data;
  let startsAt: string;
  try {
    startsAt = brasiliaToIso(d.startsAt);
  } catch {
    return { ok: false, error: "Data inválida." };
  }
  const supabase = await createClient();
  const row = {
    title: d.title,
    starts_at: startsAt,
    duration_minutes: d.durationMinutes,
    location: d.location || null,
    group_id: d.groupId ?? null,
    objectives: d.objectives,
    agenda: d.agenda as unknown as Json,
  };
  let id = d.id;
  if (id) {
    const { error } = await supabase.from("rehearsal_sessions").update(row).eq("id", id);
    if (error) return { ok: false, error: translateDbError(error) };
  } else {
    const { data, error } = await supabase.from("rehearsal_sessions").insert({ ...row, created_by: user.id }).select("id").single();
    if (error || !data) return { ok: false, error: translateDbError(error) };
    id = data.id;
  }
  if (user.isDirector) {
    await supabase.from("rehearsal_repertoire").delete().eq("rehearsal_id", id);
    if (d.repertoire.length) {
      const { error } = await supabase.from("rehearsal_repertoire").insert(d.repertoire.map((r, i) => ({ rehearsal_id: id!, repertoire_id: r.id, sort: i, focus: r.focus || null })));
      if (error) return { ok: false, error: translateDbError(error) };
    }
  }
  revalidatePath("/ensaios");
  revalidatePath(`/ensaios/${id}`);
  return { ok: true, data: { id } };
}

export async function deleteRehearsal(id: string) {
  await actionUser("diretor");
  const supabase = await createClient();
  await supabase.from("rehearsal_sessions").delete().eq("id", id);
  revalidatePath("/ensaios");
  redirect("/ensaios");
}

const summarySchema = z.object({
  id: z.uuid(),
  status: z.enum(["planejado", "realizado", "cancelado"]),
  learned: z.string().trim().max(4000).optional(),
  revisit: z.string().trim().max(4000).optional(),
  next: z.string().trim().max(4000).optional(),
});

export async function saveRehearsalSummary(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const p = summarySchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    learned: formData.get("learned") ?? undefined,
    revisit: formData.get("revisit") ?? undefined,
    next: formData.get("next") ?? undefined,
  });
  if (!p.success) return { ok: false, error: "Dados inválidos." };
  try {
    await actionUser("staff");
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("rehearsal_sessions")
    .update({ status: p.data.status, summary_learned: p.data.learned || null, summary_revisit: p.data.revisit || null, summary_next: p.data.next || null })
    .eq("id", p.data.id);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(`/ensaios/${p.data.id}`);
  revalidatePath("/ensaios");
  return { ok: true, message: "Registro do ensaio salvo." };
}

export async function setAttendance(rehearsalId: string, userId: string, status: "presente" | "ausente" | "justificado" | null): Promise<ActionResult> {
  let user;
  try {
    user = await actionUser("staff");
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const supabase = await createClient();
  const { error } = status
    ? await supabase.from("rehearsal_attendance").upsert({ rehearsal_id: rehearsalId, user_id: userId, status, recorded_by: user.id }, { onConflict: "rehearsal_id,user_id" })
    : await supabase.from("rehearsal_attendance").delete().eq("rehearsal_id", rehearsalId).eq("user_id", userId);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(`/ensaios/${rehearsalId}`);
  return { ok: true };
}

const noteSchema = z.object({
  rehearsalId: z.uuid(),
  kind: z.enum(["dificuldade", "aprendizado", "retomar", "observacao"]),
  content: z.string().trim().min(1, "Escreva a anotação.").max(4000),
  visible: z.boolean(),
});

export async function addRehearsalNote(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const p = noteSchema.safeParse({
    rehearsalId: formData.get("rehearsalId"),
    kind: formData.get("kind"),
    content: formData.get("content"),
    visible: formData.get("visible") === "on",
  });
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  let user;
  try {
    user = await actionUser("staff");
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("rehearsal_notes").insert({ rehearsal_id: p.data.rehearsalId, author_id: user.id, kind: p.data.kind, content: p.data.content, visible_to_members: p.data.visible });
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(`/ensaios/${p.data.rehearsalId}`);
  return { ok: true, message: "Anotação registrada." };
}

export async function deleteRehearsalNote(id: string, rehearsalId: string): Promise<ActionResult> {
  await actionUser("staff");
  const supabase = await createClient();
  const { error } = await supabase.from("rehearsal_notes").delete().eq("id", id);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(`/ensaios/${rehearsalId}`);
  return { ok: true };
}

const taskSchema = z.object({
  rehearsalId: z.uuid(),
  assigneeId: z.union([z.uuid(), z.literal("")]),
  title: z.string().trim().min(1, "Descreva a tarefa.").max(200),
  description: z.string().trim().max(2000).default(""),
  dueOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
});

export async function addTask(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const p = taskSchema.safeParse({
    rehearsalId: formData.get("rehearsalId"),
    assigneeId: formData.get("assigneeId") ?? "",
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    dueOn: formData.get("dueOn") ?? "",
  });
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  let user;
  try {
    user = await actionUser("staff");
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("rehearsal_tasks").insert({
    rehearsal_id: p.data.rehearsalId,
    assignee_id: p.data.assigneeId || null,
    title: p.data.title,
    description: p.data.description,
    due_on: p.data.dueOn || null,
    created_by: user.id,
  });
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(`/ensaios/${p.data.rehearsalId}`);
  revalidatePath("/inicio");
  return { ok: true, message: "Tarefa criada." };
}

export async function toggleTask(id: string, done: boolean): Promise<ActionResult> {
  await actionUser();
  const supabase = await createClient();
  const { error } = await supabase.from("rehearsal_tasks").update({ done_at: done ? new Date().toISOString() : null }).eq("id", id);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath("/inicio");
  revalidatePath("/ensaios", "layout");
  return { ok: true };
}

export async function deleteTask(id: string, rehearsalId: string): Promise<ActionResult> {
  await actionUser("staff");
  const supabase = await createClient();
  const { error } = await supabase.from("rehearsal_tasks").delete().eq("id", id);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(`/ensaios/${rehearsalId}`);
  return { ok: true };
}
