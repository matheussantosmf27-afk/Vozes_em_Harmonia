"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { actionUser, getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { translateDbError, type ActionResult } from "@/lib/action-result";

const profileSchema = z.object({
  fullName: z.string().trim().min(3, "Informe seu nome completo.").max(120),
  displayName: z.string().trim().max(60).optional(),
});

export async function updateProfile(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const p = profileSchema.safeParse({ fullName: formData.get("fullName"), displayName: formData.get("displayName") || undefined });
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sessão expirada." };
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ full_name: p.data.fullName, display_name: p.data.displayName || null }).eq("id", user.id);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath("/", "layout");
  return { ok: true, message: "Dados atualizados." };
}

export async function deleteAllRecordings(): Promise<ActionResult> {
  const user = await actionUser();
  const supabase = await createClient();
  const { data } = await supabase.from("media_assets").select("id, path").eq("owner_id", user.id).eq("bucket", "recordings");
  if (data?.length) {
    const { error } = await supabase.storage.from("recordings").remove(data.map((d) => d.path));
    if (error) return { ok: false, error: "Não foi possível excluir os arquivos." };
    await supabase.from("media_assets").delete().eq("owner_id", user.id).eq("bucket", "recordings");
  }
  revalidatePath("/voz");
  revalidatePath("/conta");
  return { ok: true, message: "Gravações excluídas." };
}

export async function deleteMyAccount(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  if (formData.get("confirm") !== "EXCLUIR") return { ok: false, error: "Digite EXCLUIR para confirmar." };
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sessão expirada." };
  const supabase = await createClient();
  const { data: files } = await supabase.storage.from("recordings").list(user.id, { limit: 1000 });
  if (files?.length) await supabase.storage.from("recordings").remove(files.map((f) => `${user.id}/${f.name}`));
  const { error } = await supabase.rpc("delete_my_account");
  if (error) return { ok: false, error: error.message || translateDbError(error) };
  await supabase.auth.signOut();
  redirect("/?conta=excluida");
}
