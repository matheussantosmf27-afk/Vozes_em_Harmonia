"use client";

import { useEffect, useMemo, useRef } from "react";
import type { PartNote } from "@/lib/music/notation";
import { noteName } from "@/lib/music/notes";
import { cn } from "@/lib/utils";

export const VOICE_COLORS = ["var(--voice-1)", "var(--voice-2)", "var(--voice-3)", "var(--voice-4)", "var(--chart-5)", "var(--chart-1)"];

export interface RollPart {
  id: string;
  name: string;
  notes: PartNote[];
  color: string;
}

/**
 * Representação simplificada da partitura: tempo na horizontal, altura na
 * vertical. A voz selecionada fica destacada e mostra a letra.
 */
export function PianoRoll({
  parts,
  selectedId,
  beat,
  beatsPerMeasure,
  totalBeats,
  transpose,
  loop,
  onSeekMeasure,
}: {
  parts: RollPart[];
  selectedId: string | null;
  beat: number;
  beatsPerMeasure: number;
  totalBeats: number;
  transpose: number;
  loop: { start: number; end: number } | null;
  onSeekMeasure: (measure: number) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const pxPerBeat = 44;
  const rowH = 7;
  const all = parts.flatMap((p) => p.notes.filter((n) => n.p !== null).map((n) => n.p! + transpose));
  const low = Math.min(...all, 60) - 2;
  const high = Math.max(...all, 60) + 2;
  const height = (high - low + 1) * rowH;
  const width = Math.max(1, totalBeats) * pxPerBeat;
  const measures = Math.ceil(totalBeats / beatsPerMeasure);
  const y = (m: number) => (high - m) * rowH;
  const ordered = useMemo(() => [...parts].sort((a) => (a.id === selectedId ? 1 : -1)), [parts, selectedId]);
  const selected = parts.find((p) => p.id === selectedId);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const x = beat * pxPerBeat;
    if (x < el.scrollLeft + 40 || x > el.scrollLeft + el.clientWidth - 80) el.scrollTo({ left: Math.max(0, x - 80), behavior: "smooth" });
  }, [beat]);

  return (
    <div ref={scroller} className="overflow-x-auto rounded-2xl border bg-card" aria-label="Representação das notas das vozes" role="img">
      <div className="relative" style={{ width: width + 24 }}>
        <div className="sticky left-0 top-0 flex h-7 border-b bg-card/95 text-xs" style={{ width: width + 24 }}>
          {Array.from({ length: measures }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSeekMeasure(i + 1)}
              className="h-full shrink-0 border-l px-1 text-left text-muted-foreground hover:bg-muted"
              style={{ width: beatsPerMeasure * pxPerBeat }}
              aria-label={`Ir para o compasso ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <svg width={width + 24} height={height + 34} className="block">
          {loop && <rect x={loop.start * pxPerBeat} y={0} width={(loop.end - loop.start) * pxPerBeat} height={height} className="fill-gold/15" />}
          {Array.from({ length: high - low + 1 }, (_, i) => {
            const m = high - i;
            return m % 12 === 0 ? (
              <g key={m}>
                <line x1={0} x2={width} y1={y(m) + rowH / 2} y2={y(m) + rowH / 2} className="stroke-border" strokeDasharray="3 4" />
                <text x={2} y={y(m) + rowH / 2 - 2} className="fill-muted-foreground" fontSize={9}>
                  {noteName(m)}
                </text>
              </g>
            ) : null;
          })}
          {Array.from({ length: measures + 1 }, (_, i) => (
            <line key={i} x1={i * beatsPerMeasure * pxPerBeat} x2={i * beatsPerMeasure * pxPerBeat} y1={0} y2={height} className="stroke-border" />
          ))}
          {ordered.map((p) => {
            const active = p.id === selectedId;
            return (
              <g key={p.id} opacity={selectedId && !active ? 0.35 : 1}>
                {p.notes.map((n, i) =>
                  n.p === null ? null : (
                    <rect
                      key={i}
                      x={n.s * pxPerBeat + 1}
                      y={y(n.p + transpose) + 0.5}
                      width={Math.max(4, n.d * pxPerBeat - 2)}
                      height={rowH - 1}
                      rx={2}
                      style={{ fill: p.color }}
                      className={cn(active && "stroke-foreground/50")}
                    />
                  ),
                )}
              </g>
            );
          })}
          {selected?.notes.map((n, i) =>
            n.l ? (
              <text key={i} x={n.s * pxPerBeat + 2} y={height + 22} fontSize={12} className="fill-foreground">
                {n.l}
              </text>
            ) : null,
          )}
          <line x1={beat * pxPerBeat} x2={beat * pxPerBeat} y1={0} y2={height + 30} className="stroke-primary" strokeWidth={2} />
        </svg>
      </div>
    </div>
  );
}
