"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { translateDbError, type ActionResult } from "@/lib/action-result";

const bookmarkSchema = z.object({
  arrangementId: z.guid(),
  start: z.number().int().min(1).max(999),
  end: z.number().int().min(1).max(999),
  note: z.string().trim().max(300).optional(),
  path: z.string().startsWith("/"),
});

export async function addBookmark(input: z.input<typeof bookmarkSchema>): Promise<ActionResult> {
  const p = bookmarkSchema.safeParse(input);
  if (!p.success || p.data.start > p.data.end) return { ok: false, error: "Trecho inválido." };
  const user = await actionUser();
  const supabase = await createClient();
  const { error } = await supabase.from("practice_bookmarks").insert({
    user_id: user.id,
    arrangement_id: p.data.arrangementId,
    start_measure: p.data.start,
    end_measure: p.data.end,
    note: p.data.note || null,
  });
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(p.data.path);
  return { ok: true };
}

export async function deleteBookmark(id: string, path: string): Promise<ActionResult> {
  const user = await actionUser();
  const supabase = await createClient();
  const { error } = await supabase.from("practice_bookmarks").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(path);
  return { ok: true };
}

export async function updateMyAssignment(id: string, status: "designado" | "estudando" | "pronto", path: string): Promise<ActionResult> {
  const user = await actionUser();
  const supabase = await createClient();
  const { error } = await supabase.from("arrangement_assignments").update({ status }).eq("id", id).eq("user_id", user.id);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(path);
  return { ok: true, message: status === "pronto" ? "Marcado como pronto. Parabéns!" : "Status atualizado." };
}
