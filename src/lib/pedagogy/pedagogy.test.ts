import { describe, expect, it } from "vitest";
import { generatePlan, type Questionnaire } from "./plan";
import { suggestClassification, regionFor } from "./classification";
import { recommendLevel, shouldSimplify } from "./adaptive";
import { computeAutoLevel, nextStepHint } from "./mastery";
import { PATHS } from "@/content";

const ORDER = PATHS.flatMap((p) => p.lessons.map((l) => l.slug));

const base: Questionnaire = {
  experiencia: "pouca",
  cantaEmGrupo: "as_vezes",
  formacoes: ["louvor"],
  lePartitura: "nao",
  conheceCifras: "um_pouco",
  tocaInstrumento: false,
  aulasDeCanto: "nunca",
  dificuldades: [],
  facilidadeRegiao: "medias",
  manterVozDiferente: "com_dificuldade",
  grupoVocal: "masculina",
  diasPorSemana: 4,
  minutosPorDia: 20,
};

describe("plano individual", () => {
  it("barítono com boa memória, mas afinação e independência frágeis: prioriza afinação, escuta e própria linha", () => {
    const plan = generatePlan(
      { ...base, dificuldades: ["afinacao", "manter_voz", "respiracao"], manterVozDiferente: "nao" },
      { altura: 0.5, reproducao: 0.35, sustentacao: 0.3, memoria: 0.9, intervalos: 0.5, ritmo: 0.7, entrada: 0.7, consonancia: 0.6, independencia: 0.25 },
      ORDER,
    );
    expect(plan.prioritySkills).toContain("afinacao-nota");
    expect(plan.prioritySkills).toContain("independencia-vocal");
    // escuta antes da execução
    expect(plan.prioritySkills[0]).toBe("discriminacao-altura");
    expect(plan.recommendedLessons).toContain("afinacao-basica");
    expect(plan.dailyExercises.some((d) => d.slug === "treino-afinacao-livre")).toBe(true);
    expect(plan.report.strengths.join(" ")).toMatch(/sequências melódicas/);
    expect(plan.dailyExercises.reduce((a, d) => a + d.minutes, 0)).toBeLessThanOrEqual(20);
    expect(plan.goals.map((g) => g.horizonWeeks)).toEqual(expect.arrayContaining([4, 8, 12]));
  });

  it("boa afinação sem experiência em harmonia: avança para intervalos e vozes", () => {
    const plan = generatePlan(
      { ...base, experiencia: "moderada", cantaEmGrupo: "nunca", manterVozDiferente: "nao", lePartitura: "um_pouco" },
      { altura: 0.95, reproducao: 0.9, sustentacao: 0.9, memoria: 0.8, intervalos: 0.75, ritmo: 0.85, entrada: 0.8, consonancia: 0.85, independencia: null },
      ORDER,
    );
    expect(plan.prioritySkills).not.toContain("afinacao-nota");
    expect(plan.prioritySkills.some((s) => s === "independencia-vocal" || s === "harmonia-duas-vozes")).toBe(true);
    expect(plan.recommendedLessons.some((l) => ["duas-vozes", "tercas-e-sextas", "tres-vozes"].includes(l))).toBe(true);
    expect(plan.rationale.join(" ")).toMatch(/avançar mais rapidamente/);
  });

  it("não usa a classificação vocal como critério", () => {
    const tests = { altura: 0.6, reproducao: 0.6, memoria: 0.6, intervalos: 0.6, ritmo: 0.6 };
    const a = generatePlan({ ...base, grupoVocal: "feminina", facilidadeRegiao: "agudas" }, tests, ORDER);
    const b = generatePlan({ ...base, grupoVocal: "masculina", facilidadeRegiao: "graves" }, tests, ORDER);
    expect(a.prioritySkills).toEqual(b.prioritySkills);
  });
});

describe("classificação provisória", () => {
  it("sugere categorias pela região confortável e grupo vocal", () => {
    expect(suggestClassification({ comfortableLow: 45, comfortableHigh: 62, group: "masculina" }).classification).toBe("baritono");
    expect(suggestClassification({ comfortableLow: 52, comfortableHigh: 67, group: "masculina" }).classification).toBe("tenor");
    expect(suggestClassification({ comfortableLow: 64, comfortableHigh: 77, group: "feminina" }).classification).toBe("soprano");
    expect(suggestClassification({ comfortableLow: 55, comfortableHigh: 70, group: "feminina" }).classification).toBe("contralto");
  });

  it("não força categoria sem dados ou sem grupo informado", () => {
    expect(suggestClassification({ comfortableLow: null, comfortableHigh: null, group: "feminina" }).classification).toBe("nao_classificada");
    const s = suggestClassification({ comfortableLow: 55, comfortableHigh: 67, group: "nao_informado" });
    expect(s.classification).toBe("nao_classificada");
    expect(s.region).toBe("media");
    expect(s.explanation).toMatch(/provisória|professor/);
  });

  it("calcula regiões independentes do rótulo", () => {
    expect(regionFor(43, 57)).toBe("grave");
    expect(regionFor(52, 64)).toBe("media");
    expect(regionFor(62, 76)).toBe("aguda");
  });
});

describe("adaptação e domínio", () => {
  const s = (level: number, score: number, day: number) => ({ level, score, createdAt: `2026-10-${String(day).padStart(2, "0")}T10:00:00Z` });

  it("avança, mantém e retoma o nível", () => {
    expect(recommendLevel([], 5)).toEqual({ level: 1, reason: "inicio" });
    expect(recommendLevel([s(2, 0.9, 1), s(2, 0.9, 2)], 5)).toEqual({ level: 3, reason: "avancar" });
    expect(recommendLevel([s(3, 0.4, 3), s(3, 0.3, 4), s(2, 0.9, 1)], 5)).toEqual({ level: 2, reason: "retomar" });
    expect(recommendLevel([s(3, 0.7, 3), s(3, 0.9, 4)], 5).reason).toBe("manter");
    expect(recommendLevel([s(5, 1, 3), s(5, 1, 4)], 5)).toEqual({ level: 5, reason: "manter" });
  });

  it("simplifica após dois erros seguidos", () => {
    expect(shouldSimplify([1, 0, 0])).toBe(true);
    expect(shouldSimplify([0, 1, 0])).toBe(false);
  });

  it("espelha as regras de domínio do banco", () => {
    const a = (score: number, day: string, selfReported = false) => ({ score, day, selfReported });
    expect(computeAutoLevel([], 4)).toBe(1);
    expect(computeAutoLevel([a(1, "d1", true)], 4)).toBe(2);
    expect(computeAutoLevel([a(0.7, "d1"), a(0.6, "d1"), a(0.7, "d1")], 4)).toBe(3);
    const five = [a(0.9, "d1"), a(0.85, "d2"), a(0.8, "d3"), a(0.9, "d3"), a(0.9, "d3")];
    expect(computeAutoLevel(five, 4)).toBe(4);
    expect(computeAutoLevel(five, 3)).toBe(3);
    expect(nextStepHint(five, 3, 3)).toMatch(/professor/);
    expect(nextStepHint([a(0.7, "d1")], 4, 2)).toMatch(/mais 2 atividades/);
  });
});
