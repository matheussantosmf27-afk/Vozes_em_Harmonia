import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { LessonContent } from "@/content/types";
import type { Tables } from "@/lib/supabase/database.types";

export type PathRow = Tables<"learning_paths">;
export type LessonRow = Omit<Tables<"lessons">, "content"> & { content: LessonContent };
export type ExerciseRow = Tables<"exercises">;

export const getPaths = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("learning_paths").select("*").order("sort");
  if (error) throw error;
  return data;
});

export const getLessonsIndex = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("id, slug, title, summary, sort, level, estimated_minutes, path_id, is_published, learning_paths(slug, sort, code, title)")
    .order("sort");
  if (error) throw error;
  return [...data].sort((a, b) => (a.learning_paths?.sort ?? 0) - (b.learning_paths?.sort ?? 0) || a.sort - b.sort);
});

export const getSkills = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("skills").select("*").order("sort");
  if (error) throw error;
  return data;
});

export async function getMyProgress(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("user_progress").select("lesson_id, status, best_score, completed_at").eq("user_id", userId);
  return new Map((data ?? []).map((p) => [p.lesson_id, p]));
}

export const getLabExercises = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("exercises").select("*").eq("purpose", "laboratorio").eq("is_published", true).order("sort");
  if (error) throw error;
  return data;
});

export async function getExerciseBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("exercises").select("*").eq("slug", slug).maybeSingle();
  return data;
}

/** Faixa confortável atual da pessoa (classificação → medição mais recente). */
export async function getVoiceRange(userId: string): Promise<[number, number] | null> {
  const supabase = await createClient();
  const { data: cls } = await supabase
    .from("vocal_classifications")
    .select("comfortable_low_midi, comfortable_high_midi")
    .eq("user_id", userId)
    .eq("is_current", true)
    .maybeSingle();
  if (cls?.comfortable_low_midi && cls.comfortable_high_midi) return [cls.comfortable_low_midi, cls.comfortable_high_midi];
  const { data: range } = await supabase
    .from("vocal_ranges")
    .select("comfortable_low_midi, comfortable_high_midi, low_midi, high_midi")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (range) return [range.comfortable_low_midi ?? range.low_midi, range.comfortable_high_midi ?? range.high_midi];
  return null;
}
