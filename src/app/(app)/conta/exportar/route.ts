import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Exportação dos dados pessoais (LGPD, art. 18). */
export async function GET() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const id = claims?.claims?.sub;
  if (!id) return NextResponse.json({ error: "não autenticado" }, { status: 401 });
  const tables = [
    "user_roles",
    "vocal_assessments",
    "vocal_ranges",
    "vocal_classifications",
    "study_plans",
    "practice_goals",
    "exercise_attempts",
    "user_progress",
    "skill_mastery",
    "user_achievements",
    "practice_logs",
    "practice_bookmarks",
    "arrangement_assignments",
    "rehearsal_attendance",
  ] as const;
  const result: Record<string, unknown> = {};
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
  result.perfil = { ...profile, email: claims?.claims?.email };
  for (const t of tables) {
    const { data } = await supabase.from(t).select("*").eq("user_id", id);
    result[t] = data ?? [];
  }
  const { data: obs } = await supabase.from("teacher_observations").select("content, category, created_at").eq("user_id", id).eq("visible_to_member", true);
  result.observacoes_do_professor = obs ?? [];
  const { data: rec } = await supabase.from("media_assets").select("title, path, created_at, size_bytes").eq("owner_id", id).eq("bucket", "recordings");
  result.gravacoes = rec ?? [];
  return new NextResponse(JSON.stringify({ exportado_em: new Date().toISOString(), ...result }, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="vozes-em-harmonia-meus-dados.json"`,
      "Cache-Control": "no-store",
    },
  });
}
