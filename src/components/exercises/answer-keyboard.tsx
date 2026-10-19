"use client";

import { useState } from "react";
import { Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PianoKeyboard, type KeyTone } from "@/components/music/piano-keyboard";
import type { Round } from "@/lib/exercises/generators";
import { isBlackKey, noteName } from "@/lib/music/notes";

/** Responder tocando no teclado: uma nota (note_match) ou uma sequência (melody_memory). */
export function AnswerKeyboard({ round, onSubmit, done }: { round: Round; onSubmit: (played: number[]) => void; done: boolean }) {
  const expected = round.expectedSequence ?? [];
  const single = round.answerMode === "keyboard-note";
  const [played, setPlayed] = useState<number[]>(round.givenFirst ? [expected[0]] : []);
  const [low, high] = round.keyboardRange ?? [60, 72];
  const from = isBlackKey(low) ? low - 1 : low;
  const to = Math.max(isBlackKey(high) ? high + 1 : high, from + 12);

  const highlight: Record<number, KeyTone> = {};
  if (round.givenFirst) highlight[expected[0]] = "gold";
  if (single && played[0] !== undefined && !done) highlight[played[0]] = "primary";
  if (done) {
    expected.forEach((m) => (highlight[m] = "success"));
    played.forEach((m, i) => {
      if (expected[i] !== m) highlight[m] = "destructive";
    });
  }

  const press = (m: number) => {
    if (done) return;
    if (single) {
      setPlayed([m]);
      return;
    }
    const next = [...played, m];
    setPlayed(next);
    if (next.length >= expected.length) onSubmit(next);
  };

  return (
    <div className="space-y-3">
      <PianoKeyboard from={from} to={to} highlight={highlight} onPress={press} labels="c-only" shortcuts disabled={done} />
      {!single && (
        <div className="flex flex-wrap items-center gap-2" aria-live="polite">
          <span className="text-sm text-muted-foreground">
            Sua sequência ({played.length}/{expected.length}):
          </span>
          {played.map((m, i) => (
            <span key={i} className="rounded-md bg-secondary px-2 py-1 text-sm">
              {noteName(m)}
            </span>
          ))}
          {!done && played.length > (round.givenFirst ? 1 : 0) && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setPlayed(played.slice(0, -1))}>
              <Delete /> Apagar
            </Button>
          )}
        </div>
      )}
      {single && !done && (
        <div className="flex items-center gap-3">
          <Button type="button" onClick={() => played.length && onSubmit(played)} disabled={!played.length}>
            Confirmar {played.length ? noteName(played[0]) : "nota"}
          </Button>
          <span className="text-sm text-muted-foreground">Toque as teclas para comparar; confirme quando tiver certeza.</span>
        </div>
      )}
      <p className="hidden text-xs text-muted-foreground sm:block">Dica: use as teclas A W S E D F T G Y H U J K do computador.</p>
    </div>
  );
}
