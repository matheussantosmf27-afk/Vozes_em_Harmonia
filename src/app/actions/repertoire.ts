"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { actionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { translateDbError, type ActionResult } from "@/lib/action-result";
import type { Json } from "@/lib/supabase/database.types";

const CATEGORIES = ["culto", "coral", "quarteto", "pequeno_grupo", "louvor_congregacional", "eventos_especiais"] as const;
const FORMATIONS = ["unissono", "duas_vozes", "tres_vozes", "satb", "quarteto_masculino", "quarteto_feminino", "quarteto_misto", "coral", "livre"] as const;
const LICENSES = ["dominio_publico", "composicao_propria", "licenciado", "material_original_plataforma", "autorizacao_pendente"] as const;
const STATUSES = ["planejada", "em_estudo", "em_ensaio", "pronta", "arquivada"] as const;

const opt = (max: number) => z.string().trim().max(max).optional().transform((v) => (v ? v : null));

const repertoireSchema = z
  .object({
    id: z.uuid().optional(),
    title: z.string().trim().min(1, "Informe o título.").max(200),
    composer: opt(200),
    lyricist: opt(200),
    source: opt(300),
    copyright_info: z.string().trim().max(2000).default(""),
    license_status: z.enum(LICENSES),
    original_key: opt(40),
    group_key: opt(40),
    tempo_bpm: z.coerce.number().int().min(20).max(260).optional().or(z.literal("").transform(() => undefined)),
    time_signature: z.string().regex(/^\d{1,2}\/\d{1,2}$/, "Compasso no formato 4/4").optional().or(z.literal("").transform(() => undefined)),
    lyrics: opt(20000),
    chords: opt(20000),
    difficulty: z.coerce.number().int().min(1).max(5),
    categories: z.array(z.enum(CATEGORIES)).default([]),
    formation: z.enum(FORMATIONS),
    voices_required: z.coerce.number().int().min(1).max(8),
    director_notes: opt(4000),
    status: z.enum(STATUSES),
  })
  .refine((d) => d.license_status !== "autorizacao_pendente" || (!d.lyrics && !d.chords), {
    message: "Letra e cifra só podem ser cadastradas quando houver autorização (domínio público, composição própria ou licença).",
  });

export async function saveRepertoire(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const p = repertoireSchema.safeParse({ ...raw, categories: formData.getAll("categories") });
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  let user;
  try {
    user = await actionUser("diretor");
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const { id, ...row } = p.data;
  const supabase = await createClient();
  let savedId = id;
  if (id) {
    const { error } = await supabase.from("repertoire").update(row).eq("id", id);
    if (error) return { ok: false, error: translateDbError(error) };
  } else {
    const { data, error } = await supabase.from("repertoire").insert({ ...row, created_by: user.id }).select("id").single();
    if (error || !data) return { ok: false, error: translateDbError(error) };
    savedId = data.id;
  }
  revalidatePath("/repertorio");
  redirect(`/repertorio/${savedId}`);
}

export async function deleteRepertoire(id: string) {
  await actionUser("diretor");
  const supabase = await createClient();
  const { data: files } = await supabase.from("media_assets").select("path").eq("repertoire_id", id).eq("bucket", "media");
  if (files?.length) await supabase.storage.from("media").remove(files.map((f) => f.path));
  await supabase.from("repertoire").delete().eq("id", id);
  revalidatePath("/repertorio");
  redirect("/repertorio");
}

const noteSchema = z.object({ p: z.number().int().min(0).max(127).nullable(), s: z.number().min(0).max(10000), d: z.number().positive().max(1000), l: z.string().max(40).optional() });
const arrangementSchema = z.object({
  repertoireId: z.uuid(),
  title: z.string().trim().min(1).max(160),
  formation: z.enum(FORMATIONS),
  keyName: z.string().trim().max(40).optional(),
  tempo: z.number().int().min(20).max(260),
  beatsPerMeasure: z.number().int().min(1).max(12),
  harmonyLevel: z.number().int().min(1).max(5).nullable(),
  description: z.string().trim().max(2000).default(""),
  source: z.enum(["manual", "midi"]),
  parts: z.array(z.object({ name: z.string().trim().min(1).max(60), notes: z.array(noteSchema).max(5000) })).min(1).max(8),
});

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 50);
}

export async function createArrangement(input: z.input<typeof arrangementSchema>): Promise<ActionResult<{ slug: string }>> {
  const p = arrangementSchema.safeParse(input);
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  let user;
  try {
    user = await actionUser("diretor");
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const d = p.data;
  const supabase = await createClient();
  const slug = `${slugify(d.title) || "arranjo"}-${Date.now().toString(36)}`;
  const { data: arr, error } = await supabase
    .from("arrangements")
    .insert({
      repertoire_id: d.repertoireId,
      slug,
      title: d.title,
      formation: d.formation,
      key_name: d.keyName || null,
      tempo_bpm: d.tempo,
      beats_per_measure: d.beatsPerMeasure,
      harmony_level: d.harmonyLevel,
      description: d.description,
      source: d.source,
      created_by: user.id,
    })
    .select("id")
    .single();
  if (error || !arr) return { ok: false, error: translateDbError(error) };
  const { error: partsError } = await supabase.from("vocal_parts").insert(
    d.parts.map((part, i) => {
      const pitches = part.notes.map((n) => n.p).filter((x): x is number => x !== null && x >= 21 && x <= 108);
      return {
        arrangement_id: arr.id,
        name: part.name,
        short_name: part.name.slice(0, 6),
        sort: i,
        range_low_midi: pitches.length ? Math.min(...pitches) : null,
        range_high_midi: pitches.length ? Math.max(...pitches) : null,
        notes: part.notes as unknown as Json,
      };
    }),
  );
  if (partsError) {
    await supabase.from("arrangements").delete().eq("id", arr.id);
    return { ok: false, error: translateDbError(partsError) };
  }
  revalidatePath(`/repertorio/${d.repertoireId}`);
  revalidatePath("/harmonia");
  return { ok: true, data: { slug } };
}

export async function deleteArrangement(id: string, repertoireId: string): Promise<ActionResult> {
  await actionUser("diretor");
  const supabase = await createClient();
  const { error } = await supabase.from("arrangements").delete().eq("id", id);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(`/repertorio/${repertoireId}`);
  revalidatePath("/harmonia");
  return { ok: true };
}

export async function assignPart(partId: string, userId: string, repertoireId: string): Promise<ActionResult> {
  let user;
  try {
    user = await actionUser("diretor");
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("arrangement_assignments").insert({ vocal_part_id: partId, user_id: userId, assigned_by: user.id });
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(`/repertorio/${repertoireId}`);
  return { ok: true };
}

export async function removeAssignment(id: string, repertoireId: string): Promise<ActionResult> {
  await actionUser("diretor");
  const supabase = await createClient();
  const { error } = await supabase.from("arrangement_assignments").delete().eq("id", id);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(`/repertorio/${repertoireId}`);
  return { ok: true };
}

const mediaSchema = z.object({
  repertoireId: z.uuid(),
  path: z.string().min(3).max(400),
  title: z.string().trim().min(1).max(200),
  kind: z.enum(["audio", "midi", "musicxml", "pdf", "imagem", "outro"]),
  mimeType: z.string().max(120),
  sizeBytes: z.number().int().min(0),
  vocalPartId: z.uuid().nullable(),
  licenseNote: z.string().trim().max(500).optional(),
});

export async function registerMedia(input: z.input<typeof mediaSchema>): Promise<ActionResult> {
  const p = mediaSchema.safeParse(input);
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  let user;
  try {
    user = await actionUser("diretor");
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  if (!p.data.path.startsWith(`repertorio/${p.data.repertoireId}/`)) return { ok: false, error: "Caminho inválido." };
  const supabase = await createClient();
  const { error } = await supabase.from("media_assets").insert({
    owner_id: user.id,
    bucket: "media",
    path: p.data.path,
    kind: p.data.kind,
    title: p.data.title,
    mime_type: p.data.mimeType,
    size_bytes: p.data.sizeBytes,
    repertoire_id: p.data.repertoireId,
    vocal_part_id: p.data.vocalPartId,
    license_note: p.data.licenseNote || null,
  });
  if (error) {
    await supabase.storage.from("media").remove([p.data.path]);
    return { ok: false, error: translateDbError(error) };
  }
  revalidatePath(`/repertorio/${p.data.repertoireId}`);
  return { ok: true };
}

export async function deleteMedia(id: string, repertoireId: string): Promise<ActionResult> {
  await actionUser("diretor");
  const supabase = await createClient();
  const { data: asset } = await supabase.from("media_assets").select("path").eq("id", id).eq("bucket", "media").maybeSingle();
  if (!asset) return { ok: false, error: "Arquivo não encontrado." };
  await supabase.storage.from("media").remove([asset.path]);
  await supabase.from("media_assets").delete().eq("id", id);
  revalidatePath(`/repertorio/${repertoireId}`);
  return { ok: true };
}

export async function mediaUrl(id: string): Promise<ActionResult<{ url: string }>> {
  await actionUser();
  const supabase = await createClient();
  const { data: asset } = await supabase.from("media_assets").select("path").eq("id", id).eq("bucket", "media").maybeSingle();
  if (!asset) return { ok: false, error: "Arquivo não encontrado." };
  const { data, error } = await supabase.storage.from("media").createSignedUrl(asset.path, 60 * 30);
  if (error || !data) return { ok: false, error: "Não foi possível abrir o arquivo." };
  return { ok: true, data: { url: data.signedUrl } };
}

export async function setRepertoireStatus(id: string, status: (typeof STATUSES)[number]): Promise<ActionResult> {
  await actionUser("diretor");
  const supabase = await createClient();
  const { error } = await supabase.from("repertoire").update({ status }).eq("id", id);
  if (error) return { ok: false, error: translateDbError(error) };
  revalidatePath(`/repertorio/${id}`);
  revalidatePath("/repertorio");
  return { ok: true };
}
