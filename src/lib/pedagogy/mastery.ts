/**
 * Espelho das regras de domínio calculadas no banco
 * (supabase/migrations/*_logic.sql → compute_auto_level). Usado para explicar
 * ao integrante o que falta para o próximo nível. O banco é a fonte oficial.
 */
export const MASTERY_LEVELS = [
  { level: 1, label: "Ainda não iniciado", short: "Não iniciado" },
  { level: 2, label: "Em familiarização", short: "Familiarização" },
  { level: 3, label: "Em desenvolvimento", short: "Desenvolvimento" },
  { level: 4, label: "Executado com consistência", short: "Consistência" },
  { level: 5, label: "Aplicado em repertório", short: "Repertório" },
] as const;

export function masteryLabel(level: number): string {
  return MASTERY_LEVELS.find((l) => l.level === level)?.label ?? "—";
}

export interface MasteryAttempt {
  score: number;
  /** data local (AAAA-MM-DD) */
  day: string;
  selfReported: boolean;
}

export function computeAutoLevel(attempts: MasteryAttempt[], autoMaxLevel: number): number {
  if (attempts.length === 0) return 1;
  const graded = attempts.filter((a) => !a.selfReported);
  const recent = graded.slice(0, 5);
  const avg = recent.length ? recent.reduce((s, a) => s + a.score, 0) / recent.length : 0;
  const days = new Set(recent.map((a) => a.day)).size;
  let level = 2;
  if (graded.length >= 3 && avg >= 0.6) level = 3;
  if (graded.length >= 5 && avg >= 0.8 && days >= 3) level = 4;
  return Math.min(level, autoMaxLevel, 4);
}

/** Próximo passo em linguagem simples. `attempts` em ordem do mais recente. */
export function nextStepHint(attempts: MasteryAttempt[], autoMaxLevel: number, currentLevel: number): string {
  if (currentLevel >= 5) return "Habilidade aplicada no repertório. Continue revisando para manter.";
  const auto = computeAutoLevel(attempts, autoMaxLevel);
  if (auto >= autoMaxLevel && currentLevel < 5) {
    return autoMaxLevel < 4
      ? "Os próximos níveis desta habilidade são confirmados pelo professor, ouvindo você cantar."
      : "Peça ao professor para validar a aplicação desta habilidade no repertório.";
  }
  const graded = attempts.filter((a) => !a.selfReported);
  if (auto === 1) return "Faça a primeira atividade desta habilidade.";
  if (auto === 2) {
    const missing = Math.max(0, 3 - graded.length);
    return missing > 0
      ? `Faça mais ${missing} atividade${missing > 1 ? "s" : ""} avaliada${missing > 1 ? "s" : ""} com média de 60% ou mais.`
      : "Mantenha média de 60% ou mais nas últimas 5 atividades.";
  }
  const recent = graded.slice(0, 5);
  const days = new Set(recent.map((a) => a.day)).size;
  const parts: string[] = [];
  if (graded.length < 5) parts.push(`mais ${5 - graded.length} atividade${5 - graded.length > 1 ? "s" : ""}`);
  if (days < 3) parts.push(`praticar em ${3 - days} dia${3 - days > 1 ? "s" : ""} diferente${3 - days > 1 ? "s" : ""}`);
  parts.push("média de 80% nas últimas 5");
  return `Para chegar à consistência: ${parts.join(", ")}.`;
}
