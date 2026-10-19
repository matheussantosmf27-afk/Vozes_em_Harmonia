"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: 2, label: "Com conforto" },
  { value: 1, label: "Com dificuldade" },
  { value: 0, label: "Não consegui" },
];

/** Autoavaliação guiada. Conta apenas como familiarização no domínio da habilidade. */
export function AnswerSelf({ items, onSubmit, done }: { items: string[]; onSubmit: (ratings: number[]) => void; done: boolean }) {
  const [ratings, setRatings] = useState<(number | null)[]>(items.map(() => null));
  const complete = ratings.every((r) => r !== null);
  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={item} className="rounded-xl border bg-card p-3">
            <p className="mb-2 font-medium">{item}</p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={item}>
              {OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={ratings[i] === o.value}
                  disabled={done}
                  onClick={() => setRatings(ratings.map((r, k) => (k === i ? o.value : r)))}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    ratings[i] === o.value ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
      {!done && (
        <Button type="button" disabled={!complete} onClick={() => onSubmit(ratings as number[])}>
          Concluir autoavaliação
        </Button>
      )}
      <p className="text-xs text-muted-foreground">A autoavaliação registra a sua prática. O avanço para níveis mais altos depende de atividades avaliadas ou do professor.</p>
    </div>
  );
}
