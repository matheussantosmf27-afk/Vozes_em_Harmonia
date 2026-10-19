/**
 * Notação compacta para linhas vocais:
 *   "E4/1 E4/1 F4/1 G4/1 | G4/2 r/2"   (nota/duração em tempos; r = pausa)
 * Barras "|" são apenas visuais. A letra é uma lista de sílabas separadas por
 * espaço, uma por nota (pausas não recebem sílaba); "_" continua a sílaba
 * anterior (melisma).
 */
import { parseNote } from "./notes";

export interface PartNote {
  /** altura MIDI ou null para pausa */
  p: number | null;
  /** início em tempos */
  s: number;
  /** duração em tempos */
  d: number;
  /** sílaba */
  l?: string;
}

export function parseVoice(source: string, startBeat = 0): PartNote[] {
  const out: PartNote[] = [];
  let t = startBeat;
  for (const token of source.trim().split(/\s+/)) {
    if (!token || token === "|") continue;
    const m = /^([^/]+)\/([0-9.]+)$/.exec(token);
    if (!m) throw new Error(`Token inválido: "${token}"`);
    const dur = Number(m[2]);
    if (!(dur > 0)) throw new Error(`Duração inválida: "${token}"`);
    const pitch = m[1] === "r" ? null : parseNote(m[1]);
    if (m[1] !== "r" && pitch === null) throw new Error(`Nota inválida: "${token}"`);
    out.push({ p: pitch, s: t, d: dur });
    t += dur;
  }
  return out;
}

export function applyLyrics(notes: PartNote[], lyrics: string): PartNote[] {
  const syllables = lyrics.trim().split(/\s+/);
  const sung = notes.filter((n) => n.p !== null);
  if (syllables.length !== sung.length) {
    throw new Error(`Letra com ${syllables.length} sílabas para ${sung.length} notas`);
  }
  let i = 0;
  return notes.map((n) => {
    if (n.p === null) return n;
    const syl = syllables[i++];
    return syl === "_" ? n : { ...n, l: syl.replace(/~/g, "‿") };
  });
}

export function partLength(notes: PartNote[]): number {
  return notes.reduce((acc, n) => Math.max(acc, n.s + n.d), 0);
}

export function partRange(notes: PartNote[]): [number, number] | null {
  const pitches = notes.map((n) => n.p).filter((p): p is number => p !== null);
  if (!pitches.length) return null;
  return [Math.min(...pitches), Math.max(...pitches)];
}

export function transposeNotes(notes: PartNote[], semitones: number): PartNote[] {
  return notes.map((n) => (n.p === null ? n : { ...n, p: n.p + semitones }));
}

/** Repete uma linha `times` vezes (útil para cânones). */
export function repeatVoice(source: string, times: number): string {
  return Array.from({ length: times }, () => source).join(" | ");
}
