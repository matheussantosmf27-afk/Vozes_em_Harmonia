"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { translateDbError, type ActionResult } from "@/lib/action-result";

const midi = z.number().int().min(21).max(108);
const rangeSchema = z.object({
  low: midi,
  high: midi,
  comfortableLow: midi,
  comfortableHigh: midi,
  confidence: z.enum(["confiavel", "incerta"]),
  usedMic: z.boolean(),
});

export async function saveVocalRange(input: z.input<typeof rangeSchema>): Promise<ActionResult> {
  const parsed = rangeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Dados de extensão inválidos." };
  const user = await actionUser();
  const r = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("vocal_ranges").insert({
    user_id: user.id,
    low_midi: Math.min(r.low, r.comfortableLow),
    high_midi: Math.max(r.high, r.comfortableHigh),
    comfortable_low_midi: r.comfortableLow,
    comfortable_high_midi: r.comfortableHigh,
    source: r.usedMic ? "teste_automatico" : "autoavaliacao",
    confidence: r.confidence,
  });
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath("/jornada");
  revalidatePath("/voz");
  return { ok: true };
}

const recordingSchema = z.object({
  path: z.string().min(3).max(300),
  title: z.string().trim().min(1).max(200),
  mimeType: z.string().max(100),
  sizeBytes: z.number().int().min(0).max(20 * 1024 * 1024),
});

/** Registra os metadados de uma gravação já enviada pelo navegador ao bucket privado. */
export async function registerRecording(input: z.input<typeof recordingSchema>): Promise<ActionResult> {
  const parsed = recordingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Gravação inválida." };
  const user = await actionUser();
  if (!parsed.data.path.startsWith(`${user.id}/`)) return { ok: false, error: "Caminho inválido." };
  const supabase = await createClient();
  const { error } = await supabase.from("media_assets").insert({
    owner_id: user.id,
    bucket: "recordings",
    path: parsed.data.path,
    kind: "audio",
    title: parsed.data.title,
    mime_type: parsed.data.mimeType,
    size_bytes: parsed.data.sizeBytes,
  });
  if (error) {
    await supabase.storage.from("recordings").remove([parsed.data.path]);
    return { ok: false, error: translateDbError(error) };
  }
  revalidatePath("/voz");
  return { ok: true };
}

export async function deleteRecording(id: string): Promise<ActionResult> {
  const user = await actionUser();
  const supabase = await createClient();
  const { data: asset } = await supabase.from("media_assets").select("id, path, bucket, owner_id").eq("id", id).maybeSingle();
  if (!asset || asset.owner_id !== user.id || asset.bucket !== "recordings") return { ok: false, error: "Gravação não encontrada." };
  const { error: storageError } = await supabase.storage.from("recordings").remove([asset.path]);
  if (storageError) return { ok: false, error: "Não foi possível excluir o arquivo." };
  await supabase.from("media_assets").delete().eq("id", id);
  revalidatePath("/voz");
  return { ok: true };
}

export async function recordingUrl(id: string): Promise<ActionResult<{ url: string }>> {
  const user = await actionUser();
  const supabase = await createClient();
  const { data: asset } = await supabase.from("media_assets").select("path, owner_id").eq("id", id).eq("bucket", "recordings").maybeSingle();
  if (!asset || asset.owner_id !== user.id) return { ok: false, error: "Gravação não encontrada." };
  const { data, error } = await supabase.storage.from("recordings").createSignedUrl(asset.path, 60 * 10);
  if (error || !data) return { ok: false, error: "Não foi possível abrir a gravação." };
  return { ok: true, data: { url: data.signedUrl } };
}
