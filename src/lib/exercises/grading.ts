import { gradeTaps } from "@/lib/music/rhythm";
import type { SustainAnalysis } from "@/lib/music/pitch-detection";
import type { Round } from "./generators";

export interface RoundResult {
  index: number;
  score: number;
  correct: boolean;
  answer?: string;
  detail?: Record<string, unknown>;
}

export function gradeChoice(round: Round, optionId: string): RoundResult {
  const correct = optionId === round.correct;
  return { index: round.index, score: correct ? 1 : 0, correct, answer: optionId };
}

/** Compara notas tocadas no teclado com a sequência esperada (posição a posição). */
export function gradeSequence(round: Round, played: number[]): RoundResult {
  const expected = round.expectedSequence ?? [];
  const start = round.givenFirst ? 1 : 0;
  const relevant = expected.length - start;
  let hits = 0;
  for (let i = start; i < expected.length; i++) if (played[i] === expected[i]) hits++;
  const score = relevant > 0 ? hits / relevant : played[0] === expected[0] ? 1 : 0;
  return { index: round.index, score, correct: score === 1, detail: { played, expected } };
}

export function gradeTapRound(round: Round, tapsMs: number[]): RoundResult {
  const g = gradeTaps(round.expectedTapsMs ?? [], tapsMs, round.tapToleranceMs);
  return {
    index: round.index,
    score: g.score,
    correct: g.score >= 0.99,
    detail: { matched: g.matched, expected: g.expected, extraTaps: g.extraTaps, meanAbsErrorMs: g.meanAbsErrorMs },
  };
}

export function gradeSing(round: Round, analysis: SustainAnalysis): RoundResult {
  return {
    index: round.index,
    score: analysis.status === "sem_sinal" ? 0 : analysis.score,
    correct: analysis.verdict === "afinado" && analysis.stable,
    detail: {
      targetMidi: round.targetMidi,
      meanCents: analysis.meanCents,
      stdCents: analysis.stdCents,
      inTuneRatio: analysis.inTuneRatio,
      stable: analysis.stable,
      status: analysis.status,
      verdict: analysis.verdict,
    },
  };
}

/** Autoavaliação: 0 = não consegui, 1 = com dificuldade, 2 = com conforto. */
export function gradeSelf(round: Round, ratings: number[]): RoundResult {
  const items = round.selfItems?.length ?? ratings.length;
  const total = ratings.reduce((a, r) => a + Math.max(0, Math.min(2, r)), 0);
  const score = items ? total / (items * 2) : 0;
  return { index: round.index, score, correct: score >= 0.75, detail: { ratings, selfReported: true } };
}

export function summarize(results: RoundResult[]) {
  const total = results.length;
  const correct = results.filter((r) => r.correct).length;
  const score = total ? results.reduce((a, r) => a + r.score, 0) / total : 0;
  return { total, correct, score: Math.round(score * 10000) / 10000 };
}
