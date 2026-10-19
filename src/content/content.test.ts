import { describe, expect, it } from "vitest";
import { ACHIEVEMENTS, ARRANGEMENTS, LAB, PATHS, REPERTOIRE, SKILLS, allLessonExercises, allStandaloneExercises } from "./index";
import { CONFIG_SCHEMAS, isExerciseType, resolveLevelConfig } from "@/lib/exercises/schemas";
import { generateRound, roundCount } from "@/lib/exercises/generators";
import { applyLyrics, parseVoice, partLength } from "@/lib/music/notation";
import { createRng } from "@/lib/music/random";
import { parseNote } from "@/lib/music/notes";
import type { Block } from "./types";

const skillSlugs = new Set(SKILLS.map((s) => s.slug));
const arrangementSlugs = new Set(ARRANGEMENTS.map((a) => a.slug));
const lessonSlugs = new Set(PATHS.flatMap((p) => p.lessons.map((l) => l.slug)));

describe("conteúdo pedagógico", () => {
  it("tem as seis trilhas e conteúdo em todas as aulas", () => {
    expect(PATHS.map((p) => p.code)).toEqual(["A", "B", "C", "D", "E", "F"]);
    const lessons = PATHS.flatMap((p) => p.lessons);
    expect(lessons.length).toBeGreaterThanOrEqual(36);
    for (const l of lessons) {
      const c = l.content;
      expect(c.objetivo.length, l.slug).toBeGreaterThan(30);
      expect(c.explicacao.length, l.slug).toBeGreaterThan(0);
      expect(c.demonstracao.length, l.slug).toBeGreaterThan(0);
      expect(c.exercicioGuiado.passos.length, l.slug).toBeGreaterThanOrEqual(3);
      expect(c.pratiqueSozinho.passos.length, l.slug).toBeGreaterThan(0);
      expect(c.errosComuns.length, l.slug).toBeGreaterThan(0);
      expect(c.seguranca.length, l.slug).toBeGreaterThan(0);
      expect(c.criterioAvanco.length, l.slug).toBeGreaterThan(10);
      expect(l.exercises.some((e) => e.purpose === "avaliacao"), `${l.slug} sem avaliação`).toBe(true);
      for (const s of l.skills) expect(skillSlugs.has(s), `${l.slug}: habilidade ${s}`).toBe(true);
    }
  });

  it("usa slugs únicos", () => {
    const lessons = PATHS.flatMap((p) => p.lessons.map((l) => l.slug));
    expect(new Set(lessons).size).toBe(lessons.length);
    const exercises = [...allLessonExercises(), ...allStandaloneExercises()].map((e) => e.slug);
    expect(new Set(exercises).size).toBe(exercises.length);
    for (const slug of [...lessons, ...exercises, ...SKILLS.map((s) => s.slug), ...ACHIEVEMENTS.map((a) => a.slug)]) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("referencia notas, arranjos e aulas existentes nos blocos", () => {
    const check = (b: Block, where: string) => {
      const notes: string[] = [];
      if (b.type === "audio") notes.push(...b.notes.flat());
      if (b.type === "keyboard") notes.push(b.from, b.to, ...(b.highlight ?? []));
      if (b.type === "staff") notes.push(...b.notes);
      if (b.type === "intervals" || b.type === "chords") notes.push(b.root);
      if (b.type === "scales") notes.push(b.tonic);
      for (const n of notes) expect(parseNote(n), `${where}: nota ${n}`).not.toBeNull();
      if (b.type === "harmonyLink") expect(arrangementSlugs.has(b.arrangement), `${where}: arranjo ${b.arrangement}`).toBe(true);
    };
    for (const p of PATHS) for (const l of p.lessons) for (const b of [...l.content.explicacao, ...l.content.demonstracao]) check(b, l.slug);
  });

  it("tem configurações válidas e gera rodadas para todas as atividades", () => {
    const rng = createRng(7);
    for (const e of [...allLessonExercises(), ...allStandaloneExercises()]) {
      expect(isExerciseType(e.type), e.slug).toBe(true);
      expect(skillSlugs.has(e.skill), `${e.slug}: habilidade ${e.skill}`).toBe(true);
      const levels = (e.config as { levels?: unknown[] }).levels?.length ?? 1;
      for (let level = 1; level <= levels; level++) {
        const { config } = resolveLevelConfig(e.config, level);
        expect(() => CONFIG_SCHEMAS[e.type].parse(config), `${e.slug} nível ${level}`).not.toThrow();
        const n = roundCount(e.type, config);
        for (let i = 0; i < Math.min(n, 4); i++) {
          const round = generateRound(e.type, config, { rng, index: i, voiceRange: [55, 67] });
          if (round.answerMode === "choice") {
            expect(round.options?.some((o) => o.id === round.correct), `${e.slug}: resposta entre as opções`).toBe(true);
          }
          for (const ev of round.cue) expect(ev.midi).toBeGreaterThan(20);
        }
      }
      if (e.type === "quiz") {
        for (const q of (e.config as { questions: { options: string[]; answer: number }[] }).questions) {
          expect(q.answer).toBeLessThan(q.options.length);
        }
      }
      const harmony = (e.config as { arrangementSlug?: string }).arrangementSlug;
      if (harmony) expect(arrangementSlugs.has(harmony), e.slug).toBe(true);
    }
  });

  it("aponta o laboratório para aulas existentes", () => {
    for (const l of LAB) {
      const concept = (l.config as { conceptLesson?: string }).conceptLesson;
      expect(concept && lessonSlugs.has(concept), l.slug).toBe(true);
      expect((l.config as { levels: unknown[] }).levels).toHaveLength(5);
    }
  });
});

describe("arranjos de treino", () => {
  it("têm vozes com a mesma duração, compassos completos e letra alinhada", () => {
    for (const a of ARRANGEMENTS) {
      expect(REPERTOIRE.some((r) => r.key === a.repertoire), a.slug).toBe(true);
      const lengths = a.parts.map((p) => partLength(parseVoice(p.notes)));
      for (const len of lengths) expect(len, a.slug).toBe(lengths[0]);
      expect(lengths[0] % a.beatsPerMeasure, `${a.slug}: compassos completos`).toBe(0);
      for (const p of a.parts) {
        const notes = parseVoice(p.notes);
        if (p.lyrics) expect(() => applyLyrics(notes, p.lyrics!), `${a.slug} ${p.short}`).not.toThrow();
        for (const n of notes) if (n.p !== null) expect(n.p).toBeGreaterThanOrEqual(40);
      }
    }
  });

  it("não tem quintas ou oitavas paralelas entre as vozes do SATB", () => {
    const a = ARRANGEMENTS.find((x) => x.slug === "hino-alegria-satb")!;
    const parts = a.parts.map((p) => parseVoice(p.notes));
    const times = [...new Set(parts.flatMap((p) => p.map((n) => n.s)))].sort((x, y) => x - y);
    const at = (part: typeof parts[number], t: number) => part.find((n) => n.s <= t && t < n.s + n.d)?.p ?? null;
    const problems: string[] = [];
    for (let k = 1; k < times.length; k++) {
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const a1 = at(parts[i], times[k - 1]), b1 = at(parts[j], times[k - 1]);
          const a2 = at(parts[i], times[k]), b2 = at(parts[j], times[k]);
          if ([a1, b1, a2, b2].some((x) => x === null)) continue;
          const i1 = (a1! - b1!) % 12, i2 = (a2! - b2!) % 12;
          const moved = a1 !== a2 && b1 !== b2;
          if (moved && i1 === i2 && (i1 === 7 || i1 === 0) && Math.sign(a2! - a1!) === Math.sign(b2! - b1!)) {
            problems.push(`tempo ${times[k]}: vozes ${i}/${j}`);
          }
        }
      }
    }
    expect(problems).toEqual([]);
  });
});
