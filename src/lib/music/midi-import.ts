/**
 * Converte um arquivo MIDI em vozes do treinador (uma voz por trilha com notas).
 * Para treino preciso, prefira arquivos com uma trilha por naipe.
 */
import { Midi } from "@tonejs/midi";
import type { PartNote } from "./notation";

export interface ImportedMidi {
  tempo: number;
  beatsPerMeasure: number;
  parts: { name: string; notes: PartNote[] }[];
}

export function parseMidi(data: ArrayBuffer): ImportedMidi {
  const midi = new Midi(data);
  const ppq = midi.header.ppq || 480;
  const tempo = Math.round(midi.header.tempos[0]?.bpm ?? 80);
  const ts = midi.header.timeSignatures[0]?.timeSignature ?? [4, 4];
  const beatsPerMeasure = Math.max(1, Math.min(12, Math.round((ts[0] * 4) / ts[1])));
  const round = (x: number) => Math.round(x * 96) / 96;
  const parts = midi.tracks
    .filter((t) => t.notes.length > 0 && t.channel !== 9)
    .map((t, i) => ({
      name: (t.name || t.instrument?.name || `Voz ${i + 1}`).slice(0, 60),
      notes: t.notes
        .map((n) => ({ p: n.midi, s: round(n.ticks / ppq), d: Math.max(0.0625, round(n.durationTicks / ppq)) }))
        .sort((a, b) => a.s - b.s),
    }));
  return { tempo: Math.max(20, Math.min(260, tempo)), beatsPerMeasure, parts: parts.slice(0, 8) };
}
