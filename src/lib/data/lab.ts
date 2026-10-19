import "server-only";
import { createClient } from "@/lib/supabase/server";
import { recommendLevel, type LevelDecision, type LevelSession } from "@/lib/pedagogy/adaptive";

export async function getLabHistory(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("exercise_attempts")
    .select("exercise_id, score, difficulty_level, created_at, exercises!inner(purpose)")
    .eq("user_id", userId)
    .eq("exercises.purpose", "laboratorio")
    .order("created_at", { ascending: false })
    .limit(500);
  const byExercise = new Map<string, LevelSession[]>();
  for (const a of data ?? []) {
    const list = byExercise.get(a.exercise_id) ?? [];
    list.push({ level: a.difficulty_level ?? 1, score: Number(a.score), createdAt: a.created_at });
    byExercise.set(a.exercise_id, list);
  }
  return byExercise;
}

export function decide(history: LevelSession[] | undefined, maxLevel: number): LevelDecision {
  return recommendLevel(history ?? [], maxLevel);
}
