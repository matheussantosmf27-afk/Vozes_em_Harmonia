import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function rehearsalFormOptions() {
  const supabase = await createClient();
  const [{ data: groups }, { data: repertoire }] = await Promise.all([
    supabase.from("vocal_groups").select("id, name").order("name"),
    supabase.from("repertoire").select("id, title").neq("status", "arquivada").order("title"),
  ]);
  return { groups: groups ?? [], repertoire: repertoire ?? [] };
}

/** ISO → "AAAA-MM-DDTHH:mm" no horário de Brasília (para input datetime-local). */
export function isoToBrasiliaLocal(iso: string) {
  const parts = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));
  return parts.replace(" ", "T");
}
