import "server-only";
import { createClient } from "@/lib/supabase/server";

/** Integrantes ativos com classificação atual (para staff e listas de ensaio). */
export async function getActiveMembers() {
  const supabase = await createClient();
  const [{ data: profiles }, { data: cls }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, display_name, is_active, created_at").eq("is_active", true).order("full_name"),
    supabase.from("vocal_classifications").select("user_id, classification, status, comfortable_low_midi, comfortable_high_midi").eq("is_current", true),
  ]);
  const byUser = new Map((cls ?? []).map((c) => [c.user_id, c]));
  return (profiles ?? []).map((p) => ({ ...p, classification: byUser.get(p.id) ?? null }));
}
