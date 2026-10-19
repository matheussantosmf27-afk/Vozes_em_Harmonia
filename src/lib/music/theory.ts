import { pitchClassName, type NoteNameStyle } from "./notes";

// ---------------------------------------------------------------------------
// Intervalos
// ---------------------------------------------------------------------------
export type Consonance = "perfeita" | "imperfeita" | "dissonante";

export interface IntervalInfo {
  semitones: number;
  code: string;
  name: string;
  consonance: Consonance;
  /** Música conhecida ou referência para memorizar o som (melodias de domínio público). */
  memoryHint?: string;
}

export const INTERVALS: readonly IntervalInfo[] = [
  { semitones: 0, code: "1J", name: "uníssono", consonance: "perfeita" },
  { semitones: 1, code: "2m", name: "segunda menor", consonance: "dissonante", memoryHint: "O tema do filme “Tubarão”: meio-tom tenso que quer resolver" },
  { semitones: 2, code: "2M", name: "segunda maior", consonance: "dissonante", memoryHint: "“Pa-ra-béns pra você”: de “ra” para “béns” a melodia sobe um tom" },
  { semitones: 3, code: "3m", name: "terça menor", consonance: "imperfeita", memoryHint: "Início de “Greensleeves”; é a terça do acorde menor" },
  { semitones: 4, code: "3M", name: "terça maior", consonance: "imperfeita", memoryHint: "Início de “When the Saints Go Marching In”; é a terça do acorde maior" },
  { semitones: 5, code: "4J", name: "quarta justa", consonance: "perfeita", memoryHint: "Início de “Graça Excelsa” (Amazing Grace) e da Marcha Nupcial de Wagner" },
  { semitones: 6, code: "4A", name: "trítono (4ª aumentada / 5ª diminuta)", consonance: "dissonante", memoryHint: "Muito instável: divide a oitava exatamente ao meio" },
  { semitones: 7, code: "5J", name: "quinta justa", consonance: "perfeita", memoryHint: "“Bri-lha, bri-lha, es-tre-li-nha”: do primeiro “bri-lha” para o segundo, a melodia salta uma quinta" },
  { semitones: 8, code: "6m", name: "sexta menor", consonance: "imperfeita", memoryHint: "Salto amplo e melancólico; inversão da terça maior" },
  { semitones: 9, code: "6M", name: "sexta maior", consonance: "imperfeita", memoryHint: "Início de “My Bonnie”; muito usada entre duas vozes" },
  { semitones: 10, code: "7m", name: "sétima menor", consonance: "dissonante", memoryHint: "Quase uma oitava, mas um tom abaixo: soa “em suspenso”" },
  { semitones: 11, code: "7M", name: "sétima maior", consonance: "dissonante", memoryHint: "Meio-tom abaixo da oitava: brilho tenso" },
  { semitones: 12, code: "8J", name: "oitava justa", consonance: "perfeita", memoryHint: "A mesma nota, mais aguda: homens e mulheres cantando a melodia juntos" },
] as const;

export function intervalBySemitones(semitones: number): IntervalInfo {
  const s = Math.abs(semitones);
  const found = INTERVALS.find((i) => i.semitones === s);
  if (found) return found;
  const simple = INTERVALS.find((i) => i.semitones === s % 12);
  if (!simple) throw new Error(`Intervalo inválido: ${semitones}`);
  return { ...simple, name: `${simple.name} composta`, code: `${simple.code}+8` };
}

export function isConsonant(semitones: number): boolean {
  const s = Math.abs(semitones) % 12;
  if (s === 0) return true;
  return intervalBySemitones(s).consonance !== "dissonante";
}

// ---------------------------------------------------------------------------
// Acordes
// ---------------------------------------------------------------------------
export type ChordQuality = "maior" | "menor" | "diminuto" | "aumentado" | "dominante7" | "maior7" | "menor7";

export const CHORD_QUALITIES: Record<ChordQuality, { intervals: number[]; label: string; suffix: string; description: string }> = {
  maior: { intervals: [0, 4, 7], label: "Maior", suffix: "", description: "Fundamental + terça maior + quinta justa. Som estável e luminoso." },
  menor: { intervals: [0, 3, 7], label: "Menor", suffix: "m", description: "Fundamental + terça menor + quinta justa. Som estável, mais introspectivo." },
  diminuto: { intervals: [0, 3, 6], label: "Diminuto", suffix: "°", description: "Duas terças menores. Som tenso que pede resolução." },
  aumentado: { intervals: [0, 4, 8], label: "Aumentado", suffix: "+", description: "Duas terças maiores. Som suspenso, de expectativa." },
  dominante7: { intervals: [0, 4, 7, 10], label: "Maior com sétima (dominante)", suffix: "7", description: "Acorde maior com sétima menor. Conduz fortemente à tônica." },
  maior7: { intervals: [0, 4, 7, 11], label: "Maior com sétima maior", suffix: "7M", description: "Acorde maior com sétima maior. Som suave e aberto." },
  menor7: { intervals: [0, 3, 7, 10], label: "Menor com sétima", suffix: "m7", description: "Acorde menor com sétima menor." },
};

/** Monta as notas de um acorde (MIDI) a partir da fundamental, com inversão opcional. */
export function buildChord(rootMidi: number, quality: ChordQuality, inversion = 0): number[] {
  const notes = CHORD_QUALITIES[quality].intervals.map((i) => rootMidi + i);
  const inv = ((inversion % notes.length) + notes.length) % notes.length;
  for (let k = 0; k < inv; k++) {
    const n = notes.shift()!;
    notes.push(n + 12);
  }
  return notes;
}

export function chordSymbol(rootPc: number, quality: ChordQuality, style: NoteNameStyle = "cifra", preferFlats = false): string {
  return `${pitchClassName(rootPc, style, preferFlats)}${CHORD_QUALITIES[quality].suffix}`;
}

export const INVERSION_NAMES = ["estado fundamental", "1ª inversão", "2ª inversão", "3ª inversão"] as const;

// ---------------------------------------------------------------------------
// Escalas, tonalidades e campo harmônico
// ---------------------------------------------------------------------------
export type ScaleKind = "maior" | "menor_natural" | "menor_harmonica" | "menor_melodica" | "pentatonica_maior";

export const SCALES: Record<ScaleKind, { steps: number[]; label: string }> = {
  maior: { steps: [0, 2, 4, 5, 7, 9, 11], label: "Maior" },
  menor_natural: { steps: [0, 2, 3, 5, 7, 8, 10], label: "Menor natural" },
  menor_harmonica: { steps: [0, 2, 3, 5, 7, 8, 11], label: "Menor harmônica" },
  menor_melodica: { steps: [0, 2, 3, 5, 7, 9, 11], label: "Menor melódica (ascendente)" },
  pentatonica_maior: { steps: [0, 2, 4, 7, 9], label: "Pentatônica maior" },
};

export function buildScale(tonicMidi: number, kind: ScaleKind, includeOctave = true): number[] {
  const notes = SCALES[kind].steps.map((s) => tonicMidi + s);
  if (includeOctave) notes.push(tonicMidi + 12);
  return notes;
}

/** Fórmula de tons (T) e semitons (S) da escala, ex.: "T T S T T T S". */
export function scaleFormula(kind: ScaleKind): string {
  const steps = [...SCALES[kind].steps, 12];
  const out: string[] = [];
  for (let i = 1; i < steps.length; i++) {
    const d = steps[i] - steps[i - 1];
    out.push(d === 1 ? "S" : d === 2 ? "T" : d === 3 ? "T+S" : `${d}`);
  }
  return out.join(" ");
}

export type HarmonicFunction = "tônica" | "subdominante" | "dominante";

export interface HarmonicDegree {
  degree: number;
  roman: string;
  rootPc: number;
  quality: ChordQuality;
  fn: HarmonicFunction;
}

const MAJOR_FIELD: { roman: string; quality: ChordQuality; fn: HarmonicFunction }[] = [
  { roman: "I", quality: "maior", fn: "tônica" },
  { roman: "ii", quality: "menor", fn: "subdominante" },
  { roman: "iii", quality: "menor", fn: "tônica" },
  { roman: "IV", quality: "maior", fn: "subdominante" },
  { roman: "V", quality: "maior", fn: "dominante" },
  { roman: "vi", quality: "menor", fn: "tônica" },
  { roman: "vii°", quality: "diminuto", fn: "dominante" },
];

const MINOR_FIELD: { roman: string; quality: ChordQuality; fn: HarmonicFunction }[] = [
  { roman: "i", quality: "menor", fn: "tônica" },
  { roman: "ii°", quality: "diminuto", fn: "subdominante" },
  { roman: "III", quality: "maior", fn: "tônica" },
  { roman: "iv", quality: "menor", fn: "subdominante" },
  // Na prática coral usa-se a dominante maior (escala menor harmônica).
  { roman: "V", quality: "maior", fn: "dominante" },
  { roman: "VI", quality: "maior", fn: "subdominante" },
  { roman: "vii°", quality: "diminuto", fn: "dominante" },
];

export function harmonicField(tonicPc: number, mode: "maior" | "menor" = "maior"): HarmonicDegree[] {
  const steps = mode === "maior" ? SCALES.maior.steps : SCALES.menor_harmonica.steps;
  const table = mode === "maior" ? MAJOR_FIELD : MINOR_FIELD;
  return table.map((t, i) => ({
    degree: i + 1,
    roman: t.roman,
    rootPc: (tonicPc + steps[i]) % 12,
    quality: t.quality,
    fn: t.fn,
  }));
}

/** Armaduras de clave das tonalidades maiores (número positivo = sustenidos, negativo = bemóis). */
export const MAJOR_KEY_SIGNATURES: { tonicPc: number; name: string; accidentals: number }[] = [
  { tonicPc: 0, name: "Dó maior", accidentals: 0 },
  { tonicPc: 7, name: "Sol maior", accidentals: 1 },
  { tonicPc: 2, name: "Ré maior", accidentals: 2 },
  { tonicPc: 9, name: "Lá maior", accidentals: 3 },
  { tonicPc: 4, name: "Mi maior", accidentals: 4 },
  { tonicPc: 11, name: "Si maior", accidentals: 5 },
  { tonicPc: 5, name: "Fá maior", accidentals: -1 },
  { tonicPc: 10, name: "Si♭ maior", accidentals: -2 },
  { tonicPc: 3, name: "Mi♭ maior", accidentals: -3 },
  { tonicPc: 8, name: "Lá♭ maior", accidentals: -4 },
  { tonicPc: 1, name: "Ré♭ maior", accidentals: -5 },
];

export const SHARP_ORDER = ["Fá", "Dó", "Sol", "Ré", "Lá", "Mi", "Si"];
export const FLAT_ORDER = ["Si", "Mi", "Lá", "Ré", "Sol", "Dó", "Fá"];

/** Transpõe notas MIDI (null = pausa) por semitons. */
export function transpose<T extends number | null>(notes: T[], semitones: number): T[] {
  return notes.map((n) => (n === null ? n : ((n as number) + semitones) as T));
}

/** Tonalidades com bemol são escritas com bemóis. */
export function prefersFlats(tonicPc: number): boolean {
  return [5, 10, 3, 8, 1, 6].includes(((tonicPc % 12) + 12) % 12);
}

// ---------------------------------------------------------------------------
// Progressões (cadências e sequências comuns no louvor congregacional)
// ---------------------------------------------------------------------------
export interface ProgressionDef {
  id: string;
  label: string;
  degrees: number[];
  description: string;
}

export const PROGRESSIONS: ProgressionDef[] = [
  { id: "I-IV-V-I", label: "I – IV – V – I", degrees: [1, 4, 5, 1], description: "A progressão mais comum em hinos: repouso, afastamento, tensão e retorno." },
  { id: "I-V-vi-IV", label: "I – V – vi – IV", degrees: [1, 5, 6, 4], description: "Muito usada no louvor contemporâneo." },
  { id: "I-vi-IV-V", label: "I – vi – IV – V", degrees: [1, 6, 4, 5], description: "Sequência clássica que termina em suspensão (dominante)." },
  { id: "ii-V-I", label: "ii – V – I", degrees: [2, 5, 1], description: "Preparação, dominante e resolução." },
  { id: "I-IV-I", label: "I – IV – I (cadência plagal)", degrees: [1, 4, 1], description: "O “Amém” dos hinos." },
  { id: "IV-V-I", label: "IV – V – I (cadência perfeita)", degrees: [4, 5, 1], description: "Conclusão firme de uma frase." },
  { id: "I-V", label: "I – V (semicadência)", degrees: [1, 5], description: "Termina na dominante: a frase fica “em aberto”." },
  { id: "V-vi", label: "V – vi (cadência de engano)", degrees: [5, 6], description: "A dominante resolve onde não esperamos." },
];

/**
 * Encadeamento simples a quatro vozes (baixo + tríade fechada próxima),
 * escolhendo a inversão da tríade superior que minimiza o movimento das vozes.
 */
export function voiceProgression(tonicMidi: number, degrees: number[], mode: "maior" | "menor" = "maior"): number[][] {
  const field = harmonicField(((tonicMidi % 12) + 12) % 12, mode);
  const chords: number[][] = [];
  let previousUpper: number[] | null = null;
  for (const d of degrees) {
    const deg = field[d - 1];
    let rootMidi = tonicMidi - 12 + ((deg.rootPc - (((tonicMidi % 12) + 12) % 12) + 12) % 12);
    if (rootMidi > tonicMidi - 5) rootMidi -= 12;
    const bass = rootMidi;
    const base = rootMidi + 12;
    const candidates = [0, 1, 2].flatMap((inv) => {
      const c = buildChord(base, deg.quality, inv);
      return [c, c.map((n) => n - 12), c.map((n) => n + 12)];
    }).filter((c) => c[0] >= tonicMidi - 3 && c[c.length - 1] <= tonicMidi + 16);
    let best = candidates[0] ?? buildChord(base, deg.quality);
    if (previousUpper) {
      let bestCost = Infinity;
      for (const c of candidates) {
        const cost = c.reduce((acc, n, i) => acc + Math.abs(n - previousUpper![i]), 0);
        if (cost < bestCost) {
          bestCost = cost;
          best = c;
        }
      }
    }
    previousUpper = best;
    chords.push([bass, ...best]);
  }
  return chords;
}
