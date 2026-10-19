/**
 * Notas, frequências e nomes em português.
 * Convenção de oitavas: científica (dó central = Dó4 = MIDI 60, Lá4 = 440 Hz).
 */

export const A4_MIDI = 69;
export const A4_FREQ = 440;

export const PITCH_CLASS_PT = ["Dó", "Dó♯", "Ré", "Ré♯", "Mi", "Fá", "Fá♯", "Sol", "Sol♯", "Lá", "Lá♯", "Si"] as const;
export const PITCH_CLASS_PT_FLAT = ["Dó", "Ré♭", "Ré", "Mi♭", "Mi", "Fá", "Sol♭", "Sol", "Lá♭", "Lá", "Si♭", "Si"] as const;
export const PITCH_CLASS_LETTER = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;
export const PITCH_CLASS_LETTER_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"] as const;

/** Notas naturais (teclas brancas) por classe de altura. */
export const NATURAL_PITCH_CLASSES = [0, 2, 4, 5, 7, 9, 11] as const;

export type NoteNameStyle = "pt" | "cifra";

export function midiToFrequency(midi: number, a4 = A4_FREQ): number {
  return a4 * Math.pow(2, (midi - A4_MIDI) / 12);
}

/** Converte frequência em número MIDI fracionário (ex.: 60.25 = Dó4 + 25 cents). */
export function frequencyToMidi(frequency: number, a4 = A4_FREQ): number {
  return A4_MIDI + 12 * Math.log2(frequency / a4);
}

/** Diferença em cents entre uma frequência e a nota de referência (positivo = acima). */
export function centsFromMidi(frequency: number, targetMidi: number, a4 = A4_FREQ): number {
  return (frequencyToMidi(frequency, a4) - targetMidi) * 100;
}

export function pitchClass(midi: number): number {
  return ((Math.round(midi) % 12) + 12) % 12;
}

export function octaveOf(midi: number): number {
  return Math.floor(Math.round(midi) / 12) - 1;
}

export function isBlackKey(midi: number): boolean {
  return !NATURAL_PITCH_CLASSES.includes(pitchClass(midi) as (typeof NATURAL_PITCH_CLASSES)[number]);
}

export function pitchClassName(pc: number, style: NoteNameStyle = "pt", preferFlats = false): string {
  const i = ((pc % 12) + 12) % 12;
  if (style === "cifra") return (preferFlats ? PITCH_CLASS_LETTER_FLAT : PITCH_CLASS_LETTER)[i];
  return (preferFlats ? PITCH_CLASS_PT_FLAT : PITCH_CLASS_PT)[i];
}

export function noteName(
  midi: number,
  opts: { style?: NoteNameStyle; withOctave?: boolean; preferFlats?: boolean } = {},
): string {
  const { style = "pt", withOctave = true, preferFlats = false } = opts;
  const name = pitchClassName(pitchClass(midi), style, preferFlats);
  return withOctave ? `${name}${octaveOf(midi)}` : name;
}

/** Nome duplo para interfaces: "Dó4 (C4)". */
export function noteLabel(midi: number): string {
  return `${noteName(midi)} (${noteName(midi, { style: "cifra" })})`;
}

const LETTER_TO_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const PT_TO_PC: Record<string, number> = { do: 0, re: 2, mi: 4, fa: 5, sol: 7, la: 9, si: 11 };

/**
 * Lê nomes como "C4", "F#3", "Bb2", "Dó4", "Fá♯3", "Si♭2", "re5".
 * Retorna o número MIDI ou null se não reconhecer.
 */
export function parseNote(input: string): number | null {
  const s = input
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/♯/g, "#")
    .replace(/♭/g, "b");
  const letter = /^([A-Ga-g])([#b]?)(-?\d)$/.exec(s);
  if (letter) {
    const pc = LETTER_TO_PC[letter[1].toUpperCase()];
    const acc = letter[2] === "#" ? 1 : letter[2] === "b" ? -1 : 0;
    return (Number(letter[3]) + 1) * 12 + pc + acc;
  }
  const pt = /^(do|re|mi|fa|sol|la|si)([#b]?)(-?\d)$/i.exec(s);
  if (pt) {
    const pc = PT_TO_PC[pt[1].toLowerCase()];
    const acc = pt[2] === "#" ? 1 : pt[2] === "b" ? -1 : 0;
    return (Number(pt[3]) + 1) * 12 + pc + acc;
  }
  return null;
}

export function clampMidi(midi: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, midi));
}

/** Formata cents com sinal: "+12", "−8", "0". */
export function formatCents(cents: number): string {
  const r = Math.round(cents);
  if (r === 0) return "0";
  return r > 0 ? `+${r}` : `−${Math.abs(r)}`;
}

export function range(low: number, high: number): number[] {
  const out: number[] = [];
  for (let m = low; m <= high; m++) out.push(m);
  return out;
}
