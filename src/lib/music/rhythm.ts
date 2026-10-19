/**
 * Ritmo: padrões em figuras e correção de toques (tap).
 * Figuras: "w" semibreve (4), "h" mínima (2), "q" semínima (1), "e" colcheia (1/2),
 * "s" semicolcheia (1/4), "q." semínima pontuada (1.5). Pausas usam prefixo "r" (ex.: "rq").
 */

export const FIGURE_BEATS: Record<string, number> = {
  w: 4,
  h: 2,
  "h.": 3,
  q: 1,
  "q.": 1.5,
  e: 0.5,
  "e.": 0.75,
  s: 0.25,
};

export const FIGURE_NAMES: Record<string, string> = {
  w: "semibreve",
  h: "mínima",
  "h.": "mínima pontuada",
  q: "semínima",
  "q.": "semínima pontuada",
  e: "colcheia",
  "e.": "colcheia pontuada",
  s: "semicolcheia",
};

export interface RhythmEvent {
  /** início em tempos */
  start: number;
  /** duração em tempos */
  duration: number;
  rest: boolean;
  figure: string;
}

export function parsePattern(pattern: string): RhythmEvent[] {
  const events: RhythmEvent[] = [];
  let t = 0;
  for (const raw of pattern.trim().split(/\s+/)) {
    const rest = raw.startsWith("r");
    const figure = rest ? raw.slice(1) : raw;
    const beats = FIGURE_BEATS[figure];
    if (beats === undefined) throw new Error(`Figura rítmica desconhecida: ${raw}`);
    events.push({ start: t, duration: beats, rest, figure });
    t += beats;
  }
  return events;
}

export function patternLength(pattern: string): number {
  return parsePattern(pattern).reduce((acc, e) => acc + e.duration, 0);
}

/** Instantes (ms) dos ataques (notas, não pausas) para um andamento. */
export function onsetTimesMs(pattern: string, bpm: number): number[] {
  const beatMs = 60000 / bpm;
  return parsePattern(pattern)
    .filter((e) => !e.rest)
    .map((e) => e.start * beatMs);
}

export interface TapGrade {
  score: number;
  matched: number;
  expected: number;
  extraTaps: number;
  /** desvio médio absoluto (ms) dos toques corretos */
  meanAbsErrorMs: number | null;
  /** desvio de cada ataque esperado (ms; null = não tocado) */
  errors: (number | null)[];
}

/**
 * Compara toques com ataques esperados. Os tempos podem ter qualquer origem:
 * o primeiro toque é alinhado ao primeiro ataque (a pessoa só precisa manter
 * as proporções e o andamento), testando também o alinhamento pelo segundo toque.
 */
export function gradeTaps(expectedMs: number[], tapsMs: number[], toleranceMs = 130): TapGrade {
  if (expectedMs.length === 0) {
    return { score: tapsMs.length === 0 ? 1 : 0, matched: 0, expected: 0, extraTaps: tapsMs.length, meanAbsErrorMs: null, errors: [] };
  }
  if (tapsMs.length === 0) {
    return { score: 0, matched: 0, expected: expectedMs.length, extraTaps: 0, meanAbsErrorMs: null, errors: expectedMs.map(() => null) };
  }

  const candidates = tapsMs.slice(0, 2).map((t) => t - expectedMs[0]);
  let best: TapGrade | null = null;
  for (const offset of candidates) {
    const used = new Set<number>();
    const errors: (number | null)[] = expectedMs.map((exp) => {
      let bestIdx = -1;
      let bestErr = Infinity;
      tapsMs.forEach((tap, i) => {
        if (used.has(i)) return;
        const err = tap - offset - exp;
        if (Math.abs(err) <= toleranceMs && Math.abs(err) < Math.abs(bestErr)) {
          bestErr = err;
          bestIdx = i;
        }
      });
      if (bestIdx === -1) return null;
      used.add(bestIdx);
      return bestErr;
    });
    const matched = errors.filter((e) => e !== null).length;
    const extraTaps = tapsMs.length - matched;
    const score = matched / Math.max(expectedMs.length, matched + extraTaps);
    const hits = errors.filter((e): e is number => e !== null);
    const grade: TapGrade = {
      score,
      matched,
      expected: expectedMs.length,
      extraTaps,
      meanAbsErrorMs: hits.length ? hits.reduce((a, e) => a + Math.abs(e), 0) / hits.length : null,
      errors,
    };
    if (!best || grade.score > best.score) best = grade;
  }
  return best!;
}

/** Descrição em português, ex.: "semínima, semínima, mínima". */
export function describePattern(pattern: string): string {
  return parsePattern(pattern)
    .map((e) => (e.rest ? `pausa de ${FIGURE_NAMES[e.figure]}` : FIGURE_NAMES[e.figure]))
    .join(", ");
}
