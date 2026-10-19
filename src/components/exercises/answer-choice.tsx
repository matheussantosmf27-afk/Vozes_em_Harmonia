"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlayButton } from "@/components/music/play-button";
import type { Round } from "@/lib/exercises/generators";
import { cn } from "@/lib/utils";

export function AnswerChoice({ round, answered, onAnswer }: { round: Round; answered: string | null; onAnswer: (id: string) => void }) {
  const hasOptionCues = round.options?.some((o) => o.cue?.length);
  return (
    <div className={cn("grid gap-2", (round.options?.length ?? 0) > 3 ? "sm:grid-cols-2" : "sm:grid-cols-3")} role="group" aria-label="Opções de resposta">
      {round.options?.map((o) => {
        const isCorrect = o.id === round.correct;
        const chosen = answered === o.id;
        return (
          <div key={o.id} className={cn("flex gap-2", hasOptionCues && "flex-col rounded-xl border p-2")}>
            {o.cue?.length ? <PlayButton events={o.cue} label={`Ouvir ${o.label}`} variant="outline" size="sm" /> : null}
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={answered !== null}
              onClick={() => onAnswer(o.id)}
              className={cn(
                "h-auto min-h-12 w-full justify-start whitespace-normal py-3 text-left",
                answered !== null && isCorrect && "border-success bg-success/10 text-foreground disabled:opacity-100",
                answered !== null && chosen && !isCorrect && "border-destructive bg-destructive/10 disabled:opacity-100",
              )}
            >
              {answered !== null && isCorrect && <Check className="text-success" />}
              {answered !== null && chosen && !isCorrect && <X className="text-destructive" />}
              {hasOptionCues ? `Escolher ${o.label}` : o.label}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
