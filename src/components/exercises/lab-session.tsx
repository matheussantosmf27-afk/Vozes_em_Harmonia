"use client";

import { useState } from "react";
import { ExerciseRunner, type RunnerExercise } from "./exercise-runner";
import { cn } from "@/lib/utils";

/** Laboratório: nível recomendado, com opção de escolher outro. */
export function LabSession({
  exercise,
  recommended,
  levels,
  concept,
  voiceRange,
  revalidate,
}: {
  exercise: RunnerExercise;
  recommended: number;
  levels: number;
  concept?: { summary?: string; href?: string };
  voiceRange?: [number, number] | null;
  revalidate: string;
}) {
  const [level, setLevel] = useState(recommended);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Nível de dificuldade">
        <span className="text-sm text-muted-foreground">Nível:</span>
        {Array.from({ length: levels }, (_, i) => i + 1).map((l) => (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={level === l}
            onClick={() => setLevel(l)}
            className={cn("size-9 rounded-full border text-sm font-medium", level === l ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted", l === recommended && level !== l && "border-gold")}
          >
            {l}
          </button>
        ))}
        <span className="text-xs text-muted-foreground">(recomendado: {recommended})</span>
      </div>
      <ExerciseRunner key={level} exercise={exercise} level={level} concept={concept} voiceRange={voiceRange} revalidate={revalidate} />
    </div>
  );
}
