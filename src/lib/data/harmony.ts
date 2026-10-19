import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { PartNote } from "@/lib/music/notation";

export const HARMONY_LEVELS = [
  { level: 1, title: "Nível 1 — Uníssono", text: "Mesma altura, mesmo ritmo, entradas, respirações e finalizações conjuntas, unidade de dicção." },
  { level: 2, title: "Nível 2 — Duas vozes", text: "Segunda voz, movimento paralelo e contrário, notas sustentadas contra melodia, terças e sextas." },
  { level: 3, title: "Nível 3 — Três vozes", text: "Notas do acorde distribuídas, função de cada linha, entradas em momentos diferentes e notas comuns." },
  { level: 4, title: "Nível 4 — Quatro vozes", text: "SATB e quarteto masculino (1º tenor, 2º tenor, barítono e baixo): afinação vertical, equilíbrio e cortes." },
  { level: 5, title: "Nível 5 — Arranjos avançados", text: "Contracantos, pedais, introduções vocais, modulação, dinâmica por naipe e construção de clímax." },
];

export async function getArrangementBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("arrangements")
    .select("*, repertoire(id, title, composer, copyright_info, license_status), vocal_parts(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return null;
  const parts = [...(data.vocal_parts ?? [])].sort((a, b) => a.sort - b.sort).map((p) => ({ ...p, notes: (p.notes as unknown as PartNote[]) ?? [] }));
  return { ...data, vocal_parts: parts };
}

export async function getArrangementById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("arrangements").select("slug").eq("id", id).maybeSingle();
  return data?.slug ? getArrangementBySlug(data.slug) : null;
}
