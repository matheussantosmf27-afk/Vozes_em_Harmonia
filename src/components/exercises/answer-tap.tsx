"use client";

import { useEffect, useRef, useState } from "react";
import { Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scheduleNote, unlockAudio } from "@/lib/audio/engine";
import type { Round } from "@/lib/exercises/generators";
import { cn } from "@/lib/utils";

/** Toque o ritmo depois da contagem. Aceita toque na tela ou barra de espaço. */
export function AnswerTap({ round, onSubmit, done }: { round: Round; onSubmit: (tapsMs: number[]) => void; done: boolean }) {
  const [phase, setPhase] = useState<"ready" | "count" | "tapping">("ready");
  const [beat, setBeat] = useState(0);
  const taps = useRef<number[]>([]);
  const [tapCount, setTapCount] = useState(0);
  const timers = useRef<number[]>([]);
  const bpm = round.bpm ?? 80;
  const countIn = round.countInBeats ?? 4;
  const lastOnset = Math.max(0, ...(round.expectedTapsMs ?? [0]));

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clear, []);

  const tap = () => {
    if (phase !== "tapping" && phase !== "count") return;
    taps.current.push(performance.now());
    setTapCount(taps.current.length);
  };

  useEffect(() => {
    if (done) return;
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && (phase === "tapping" || phase === "count")) {
        e.preventDefault();
        tap();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  async function begin() {
    const c = await unlockAudio();
    clear();
    taps.current = [];
    setTapCount(0);
    setPhase("count");
    const beatSec = 60 / bpm;
    const t0 = c.currentTime + 0.1;
    for (let i = 0; i < countIn; i++) {
      scheduleNote(i === 0 ? 96 : 89, t0 + i * beatSec, 0.05, { instrument: "clique", gain: 0.5 });
      timers.current.push(window.setTimeout(() => setBeat(i + 1), (0.1 + i * beatSec) * 1000));
    }
    timers.current.push(window.setTimeout(() => setPhase("tapping"), (0.1 + countIn * beatSec - 0.15) * 1000));
    const windowMs = (0.1 + countIn * beatSec) * 1000 + lastOnset + beatSec * 1000 * 2;
    timers.current.push(
      window.setTimeout(() => {
        setPhase("ready");
        setBeat(0);
        onSubmit(taps.current.map((t) => t));
      }, windowMs),
    );
  }

  if (done) return null;
  return (
    <div className="space-y-3">
      {phase === "ready" ? (
        <Button type="button" size="lg" onClick={begin}>
          Começar: contagem de {countIn} tempos
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {phase === "count" ? `Contagem: ${beat} de ${countIn}…` : `Toque o ritmo agora! (${tapCount} toques)`}
        </p>
      )}
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          tap();
        }}
        disabled={phase === "ready"}
        className={cn(
          "flex h-36 w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed text-lg font-medium transition-colors touch-manipulation",
          phase === "tapping" ? "border-primary bg-primary/10 text-primary active:bg-primary/20" : "border-border text-muted-foreground",
        )}
      >
        <Hand className="size-6" /> Toque aqui (ou barra de espaço)
      </button>
    </div>
  );
}
