"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { actionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { translateDbError, type ActionResult } from "@/lib/action-result";

async function director() {
  return actionUser("diretor");
}

export async function setMemberActive(userId: string, active: boolean): Promise<ActionResult> {
  try {
    await director();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ is_active: active }).eq("id", userId);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath("/diretor", "layout");
  return { ok: true, message: active ? "Acesso aprovado." : "Acesso suspenso." };
}

export async function setRole(userId: string, role: "professor" | "diretor", on: boolean): Promise<ActionResult> {
  let me;
  try {
    me = await director();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const supabase = await createClient();
  const { error } = on
    ? await supabase.from("user_roles").insert({ user_id: userId, role, granted_by: me.id })
    : await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
  if (error) return { ok: false, error: error.code === "P0001" ? error.message : translateDbError(error) };
  revalidatePath("/diretor/integrantes");
  return { ok: true };
}

const groupSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome.").max(120),
  kind: z.enum(["coral", "quarteto", "pequeno_grupo", "equipe_louvor", "turma"]),
  description: z.string().trim().max(1000).default(""),
});

export async function createGroup(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const p = groupSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  let me;
  try {
    me = await director();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("vocal_groups").insert({ ...p.data, created_by: me.id }).select("id").single();
  if (error || !data) return { ok: false, error: translateDbError(error) };
  revalidatePath("/diretor/grupos");
  redirect(`/diretor/grupos/${data.id}`);
}

export async function deleteGroup(id: string) {
  await director();
  const supabase = await createClient();
  await supabase.from("vocal_groups").delete().eq("id", id);
  revalidatePath("/diretor/grupos");
  redirect("/diretor/grupos");
}

export async function addGroupMember(groupId: string, userId: string, partLabel: string): Promise<ActionResult> {
  await director();
  const supabase = await createClient();
  const { error } = await supabase.from("group_members").insert({ group_id: groupId, user_id: userId, part_label: partLabel.trim().slice(0, 60) || null });
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(`/diretor/grupos/${groupId}`);
  return { ok: true };
}

export async function setGroupMemberPart(groupId: string, userId: string, partLabel: string): Promise<ActionResult> {
  await director();
  const supabase = await createClient();
  const { error } = await supabase.from("group_members").update({ part_label: partLabel.trim().slice(0, 60) || null }).eq("group_id", groupId).eq("user_id", userId);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(`/diretor/grupos/${groupId}`);
  return { ok: true };
}

export async function removeGroupMember(groupId: string, userId: string): Promise<ActionResult> {
  await director();
  const supabase = await createClient();
  const { error } = await supabase.from("group_members").delete().eq("group_id", groupId).eq("user_id", userId);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(`/diretor/grupos/${groupId}`);
  return { ok: true };
}
