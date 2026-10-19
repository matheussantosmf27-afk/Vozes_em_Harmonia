"use client";

import { useState } from "react";
import { PlayButton } from "@/components/music/play-button";
import { PianoKeyboard, type KeyTone } from "@/components/music/piano-keyboard";
import { audioSpecToEvents, chord, seq, type NoteEvent } from "@/lib/exercises/generators";
import { buildChord, buildScale, CHORD_QUALITIES, intervalBySemitones, scaleFormula, SCALES, type ChordQuality, type ScaleKind } from "@/lib/music/theory";
import { noteName, parseNote } from "@/lib/music/notes";
import { describePattern, parsePattern } from "@/lib/music/rhythm";
import { cn } from "@/lib/utils";

const m = (n: string) => parseNote(n) ?? 60;

export function AudioDemo({ label, notes, mode = "seq", tempo = 80 }: { label: string; notes: (string | string[])[]; mode?: "seq" | "chord"; tempo?: number }) {
  const events = audioSpecToEvents({ notes, mode, tempo });
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card px-3 py-2">
      <PlayButton events={events} label="Ouvir" size="sm" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function KeyboardDemo({ from, to, highlight = [], label }: { from: string; to: string; highlight?: string[]; label?: string }) {
  const [last, setLast] = useState<number | null>(null);
  const hl: Record<number, KeyTone> = Object.fromEntries(highlight.map((h) => [m(h), "gold" as KeyTone]));
  if (last !== null) hl[last] = "primary";
  return (
    <figure className="space-y-2">
      <PianoKeyboard from={m(from)} to={m(to)} highlight={hl} onPress={setLast} labels="pt" />
      <figcaption className="text-sm text-muted-foreground" aria-live="polite">
        {label}
        {last !== null && ` · Você tocou ${noteName(last)}.`}
      </figcaption>
    </figure>
  );
}

export function IntervalsDemo({ root, semitones }: { root: string; semitones: number[] }) {
  const r = m(root);
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {semitones.map((s) => {
        const info = intervalBySemitones(s);
        return (
          <div key={s} className="space-y-2 rounded-xl border bg-card p-3">
            <p className="font-medium first-letter:uppercase">
              {info.name} <span className="text-sm font-normal text-muted-foreground">({s} semitons)</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {noteName(r)} → {noteName(r + s, { preferFlats: [1, 3, 6, 8, 10].includes(s) })}
              {info.memoryHint ? ` · ${info.memoryHint}` : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              <PlayButton events={seq([r, r + s], 0.7, 0.1)} label="Melódico" size="sm" />
              <PlayButton events={chord([r, r + s])} label="Harmônico" size="sm" variant="outline" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ChordsDemo({ root, qualities }: { root: string; qualities: ChordQuality[] }) {
  const r = m(root);
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {qualities.map((q) => {
        const notes = buildChord(r, q);
        return (
          <div key={q} className="space-y-2 rounded-xl border bg-card p-3">
            <p className="font-medium">{CHORD_QUALITIES[q].label}</p>
            <p className="text-sm text-muted-foreground">{notes.map((n) => noteName(n, { preferFlats: q === "menor" || q === "diminuto" || q === "dominante7" })).join(" – ")}</p>
            <div className="flex flex-wrap gap-2">
              <PlayButton events={chord(notes)} label="Bloco" size="sm" />
              <PlayButton events={seq(notes, 0.5, 0.05)} label="Arpejo" size="sm" variant="outline" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ScalesDemo({ tonic, kinds }: { tonic: string; kinds: ScaleKind[] }) {
  const t = m(tonic);
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {kinds.map((k) => (
        <div key={k} className="space-y-2 rounded-xl border bg-card p-3">
          <p className="font-medium">{SCALES[k].label}</p>
          <p className="font-mono text-xs text-muted-foreground">{scaleFormula(k)}</p>
          <PlayButton events={seq(buildScale(t, k), 0.42, 0.04)} label="Ouvir" size="sm" />
        </div>
      ))}
    </div>
  );
}

export function RhythmDemo({ pattern, bpm, label }: { pattern: string; bpm: number; label: string }) {
  const beat = 60 / bpm;
  const clicks: NoteEvent[] = Array.from({ length: 4 }, (_, i) => ({ midi: i === 0 ? 96 : 89, start: i * beat, duration: 0.05, instrument: "clique" as const }));
  const notes: NoteEvent[] = parsePattern(pattern)
    .filter((e) => !e.rest)
    .map((e) => ({ midi: 72, start: (4 + e.start) * beat, duration: Math.max(0.1, e.duration * beat * 0.85), instrument: "piano" as const }));
  const events = [...clicks, ...notes];
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card px-3 py-2">
      <PlayButton events={events} label="Ouvir" size="sm" />
      <div>
        <p className="text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">
          {describePattern(pattern)} · {bpm} bpm (com contagem de 4)
        </p>
      </div>
      <RhythmStrip pattern={pattern} />
    </div>
  );
}

function RhythmStrip({ pattern }: { pattern: string }) {
  const ev = parsePattern(pattern);
  const total = ev.reduce((a, e) => a + e.duration, 0);
  return (
    <div className="ml-auto flex h-6 w-48 overflow-hidden rounded-md border" aria-hidden>
      {ev.map((e, i) => (
        <div key={i} className={cn("border-r last:border-r-0", e.rest ? "bg-muted" : "bg-primary/60")} style={{ width: `${(e.duration / total) * 100}%` }} />
      ))}
    </div>
  );
}
