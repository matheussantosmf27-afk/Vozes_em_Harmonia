"use client";

import { formatCents, noteName } from "@/lib/music/notes";
import type { TrackedPitch } from "@/lib/music/pitch-detection";
import { cn } from "@/lib/utils";

const CONFIDENCE_LABEL = {
  confiavel: "Detecção confiável",
  incerta: "Detecção incerta",
  sem_sinal: "Sem sinal utilizável",
} as const;

/**
 * Mostra a nota detectada e o desvio em cents em relação ao alvo (ou à nota
 * mais próxima, se não houver alvo).
 */
export function PitchMeter({ pitch, target, level, className }: { pitch: TrackedPitch | null; target?: number; level?: number; className?: string }) {
  const midi = pitch?.midi ?? null;
  let cents: number | null = null;
  let reference: number | null = null;
  if (midi !== null) {
    if (target !== undefined) {
      // compara com o alvo na oitava mais próxima (vozes masculinas/femininas)
      const shift = Math.round((midi - target) / 12) * 12;
      reference = target + shift;
    } else {
      reference = Math.round(midi);
    }
    cents = (midi - reference) * 100;
  }
  const clamped = cents === null ? 0 : Math.max(-60, Math.min(60, cents));
  const inTune = cents !== null && Math.abs(cents) <= 25;
  const confidence = pitch?.confidence ?? "sem_sinal";

  return (
    <div className={cn("space-y-3 rounded-2xl border bg-card p-4", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">{target !== undefined ? "Nota esperada" : "Nota mais próxima"}</p>
          <p className="font-heading text-2xl">{target !== undefined ? noteName(target) : reference !== null ? noteName(reference) : "—"}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Você está cantando</p>
          <p className={cn("font-heading text-2xl", confidence !== "confiavel" && "text-muted-foreground")}>
            {midi !== null && confidence !== "sem_sinal" ? noteName(Math.round(midi)) : "—"}
          </p>
        </div>
      </div>
      <div className="relative h-10" aria-hidden>
        <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-destructive/40 via-success/50 to-destructive/40" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-foreground/40" />
        <div className="absolute left-[29.2%] top-1/4 h-1/2 w-px bg-foreground/20" />
        <div className="absolute left-[70.8%] top-1/4 h-1/2 w-px bg-foreground/20" />
        {cents !== null && confidence !== "sem_sinal" && (
          <div
            className={cn("absolute top-0 h-full w-1.5 -translate-x-1/2 rounded-full transition-[left] duration-100", inTune ? "bg-success" : "bg-destructive", confidence === "incerta" && "opacity-50")}
            style={{ left: `${50 + (clamped / 60) * 50}%` }}
          />
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm" aria-live="polite">
        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", confidence === "confiavel" ? "bg-success/15 text-success" : confidence === "incerta" ? "bg-warning/20 text-warning-foreground" : "bg-muted text-muted-foreground")}>
          {CONFIDENCE_LABEL[confidence]}
        </span>
        <span className="text-muted-foreground">
          {cents !== null && confidence !== "sem_sinal"
            ? `${formatCents(cents)} cents ${Math.abs(cents) <= 25 ? "(afinado)" : cents > 0 ? "(acima)" : "(abaixo)"}`
            : "Cante numa vogal aberta, perto do microfone"}
        </span>
      </div>
      {level !== undefined && (
        <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-label="Nível do microfone">
          <div className="h-full bg-primary/70 transition-[width] duration-75" style={{ width: `${Math.round(level * 100)}%` }} />
        </div>
      )}
    </div>
  );
}
