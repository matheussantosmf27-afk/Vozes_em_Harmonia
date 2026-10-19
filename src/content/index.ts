import { trilhaA } from "./paths/a-fundamentos";
import { trilhaB } from "./paths/b-percepcao";
import { trilhaC } from "./paths/c-conjunto";
import { trilhaD } from "./paths/d-harmonia";
import { trilhaE } from "./paths/e-leitura";
import { trilhaF } from "./paths/f-teoria";
import type { ExerciseDef, PathDef } from "./types";
import { DIAGNOSTIC_EXERCISES, LAB, PRACTICE_EXERCISES } from "./lab";

export const PATHS: PathDef[] = [trilhaA, trilhaB, trilhaC, trilhaD, trilhaE, trilhaF];

export function allLessonExercises(): (ExerciseDef & { lessonSlug: string; sort: number })[] {
  return PATHS.flatMap((p) => p.lessons.flatMap((l) => l.exercises.map((e, i) => ({ ...e, lessonSlug: l.slug, sort: i }))));
}

export function allStandaloneExercises(): ExerciseDef[] {
  return [...LAB, ...PRACTICE_EXERCISES, ...DIAGNOSTIC_EXERCISES];
}

export { LAB, PRACTICE_EXERCISES, DIAGNOSTIC_EXERCISES };
export { SKILLS, ACHIEVEMENTS } from "./skills";
export { ARRANGEMENTS, REPERTOIRE } from "./arrangements";
