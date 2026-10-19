/**
 * Adaptação da dificuldade no laboratório de percepção.
 * - Entre sessões: avança após duas sessões seguidas >= 85% no mesmo nível;
 *   recua (e retoma o conceito) após duas sessões seguidas < 50%.
 * - Dentro da sessão: dois erros seguidos simplificam a próxima rodada.
 */
export interface LevelSession {
  level: number;
  score: number;
  createdAt: string;
}

export type LevelDecision = { level: number; reason: "inicio" | "avancar" | "manter" | "retomar" };

export const ADVANCE_THRESHOLD = 0.85;
export const RETREAT_THRESHOLD = 0.5;

export function recommendLevel(history: LevelSession[], maxLevel: number): LevelDecision {
  if (history.length === 0) return { level: 1, reason: "inicio" };
  const sorted = [...history].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const current = Math.min(Math.max(1, sorted[0].level), maxLevel);
  const lastTwo = sorted.filter((s) => s.level === current).slice(0, 2);
  if (lastTwo.length === 2 && lastTwo.every((s) => s.score >= ADVANCE_THRESHOLD)) {
    return current < maxLevel ? { level: current + 1, reason: "avancar" } : { level: current, reason: "manter" };
  }
  if (lastTwo.length === 2 && lastTwo.every((s) => s.score < RETREAT_THRESHOLD)) {
    return { level: Math.max(1, current - 1), reason: "retomar" };
  }
  return { level: current, reason: "manter" };
}

/** Dois erros seguidos dentro da sessão → simplificar. */
export function shouldSimplify(scores: number[]): boolean {
  if (scores.length < 2) return false;
  const [a, b] = scores.slice(-2);
  return a < 0.5 && b < 0.5;
}
