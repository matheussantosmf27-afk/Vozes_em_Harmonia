/**
 * Configurações das atividades interativas. O banco guarda `type` + `config`
 * (jsonb); aqui validamos o formato antes de gerar as rodadas.
 */
import { z } from "zod";

export const EXERCISE_TYPES = [
  "pitch_compare",
  "note_match",
  "interval_id",
  "chord_quality",
  "chord_extreme",
  "progression_id",
  "melody_memory",
  "rhythm_tap",
  "tuning_check",
  "consonance",
  "quiz",
  "sing_note",
  "staff_read",
  "entry_detect",
  "phrase_compare",
  "scale_id",
  "self_check",
  "harmony_part",
] as const;
export type ExerciseType = (typeof EXERCISE_TYPES)[number];

const midi = z.number().int().min(21).max(108);
const midiRange = z.tuple([midi, midi]);
const rounds = z.number().int().min(1).max(30);

export const pitchCompareSchema = z.object({
  rounds: rounds.default(8),
  minSemitones: z.number().int().min(1).max(12).default(2),
  maxSemitones: z.number().int().min(1).max(24).default(12),
  allowEqual: z.boolean().default(false),
  range: midiRange.default([55, 72]),
});

export const noteMatchSchema = z.object({
  rounds: rounds.default(6),
  range: midiRange.default([60, 72]),
  naturalOnly: z.boolean().default(true),
  /** Toca o Dó de referência antes da nota-alvo. */
  reference: z.boolean().default(true),
});

export const intervalIdSchema = z.object({
  rounds: rounds.default(8),
  intervals: z.array(z.number().int().min(0).max(12)).min(2).default([4, 7, 12]),
  direction: z.enum(["asc", "desc", "harmonic", "mixed"]).default("asc"),
  range: midiRange.default([53, 72]),
});

export const chordQualitySchema = z.object({
  rounds: rounds.default(8),
  qualities: z.array(z.enum(["maior", "menor", "diminuto", "aumentado", "dominante7"])).min(2).default(["maior", "menor"]),
  inversions: z.boolean().default(false),
  play: z.enum(["bloco", "arpejo", "ambos"]).default("ambos"),
  range: midiRange.default([52, 64]),
});

export const chordExtremeSchema = z.object({
  rounds: rounds.default(6),
  ask: z.enum(["grave", "aguda", "misto"]).default("grave"),
  size: z.union([z.literal(3), z.literal(4)]).default(3),
  range: midiRange.default([48, 64]),
});

export const progressionIdSchema = z.object({
  rounds: rounds.default(5),
  progressions: z.array(z.string()).min(2).default(["I-IV-V-I", "I-V"]),
});

export const melodyMemorySchema = z.object({
  rounds: rounds.default(5),
  minLength: z.number().int().min(2).max(10).default(3),
  maxLength: z.number().int().min(2).max(12).default(4),
  maxLeap: z.number().int().min(1).max(7).default(2),
  tempo: z.number().int().min(40).max(160).default(84),
});

export const rhythmTapSchema = z.object({
  rounds: rounds.default(4),
  patterns: z.array(z.string()).min(1).default(["q q q q", "h q q", "q q h"]),
  bpm: z.number().int().min(40).max(160).default(80),
  beatsPerMeasure: z.number().int().min(2).max(6).default(4),
  toleranceMs: z.number().int().min(40).max(300).default(130),
});

export const tuningCheckSchema = z.object({
  rounds: rounds.default(8),
  cents: z.number().int().min(5).max(100).default(40),
  range: midiRange.default([57, 69]),
});

export const consonanceSchema = z.object({
  rounds: rounds.default(8),
  intervals: z.array(z.number().int().min(1).max(12)).min(2).default([1, 2, 3, 4, 6, 7, 10, 11, 12]),
  range: midiRange.default([55, 67]),
});

const audioSpec = z.object({
  notes: z.array(z.union([z.string(), z.number(), z.array(z.union([z.string(), z.number()]))])).min(1),
  mode: z.enum(["seq", "chord"]).default("seq"),
  tempo: z.number().int().min(30).max(200).default(90),
});

export const quizQuestionSchema = z.object({
  q: z.string().min(1),
  options: z.array(z.string().min(1)).min(2).max(6),
  answer: z.number().int().min(0),
  explanation: z.string().optional(),
  audio: audioSpec.optional(),
  staff: z.object({ clef: z.enum(["sol", "fa"]), notes: z.array(z.string()).min(1) }).optional(),
});
export const quizSchema = z.object({
  questions: z.array(quizQuestionSchema).min(1),
  shuffleOptions: z.boolean().default(true),
});

export const singNoteSchema = z.object({
  rounds: rounds.default(3),
  /** Notas fixas (nomes ou MIDI). Se ausente, usa a região confortável da pessoa. */
  notes: z.array(z.union([z.string(), z.number()])).optional(),
  holdSeconds: z.number().min(1).max(10).default(3),
  toleranceCents: z.number().int().min(10).max(60).default(25),
  /** Toca uma melodia diferente enquanto a pessoa sustenta a nota (independência). */
  distractor: z.boolean().default(false),
});

export const staffReadSchema = z.object({
  rounds: rounds.default(8),
  clef: z.enum(["sol", "fa", "ambas"]).default("sol"),
  naturalOnly: z.boolean().default(true),
  /** Limites em notas naturais (nomes), ex.: ["C4", "G5"] */
  range: z.tuple([z.string(), z.string()]).optional(),
  style: z.enum(["pt", "cifra"]).default("pt"),
});

export const entryDetectSchema = z.object({
  rounds: rounds.default(5),
  maxVoices: z.number().int().min(2).max(4).default(3),
  ask: z.enum(["quantidade", "ultima"]).default("quantidade"),
});

export const phraseCompareSchema = z.object({
  rounds: rounds.default(6),
  length: z.number().int().min(3).max(10).default(4),
  askPosition: z.boolean().default(false),
  tempo: z.number().int().min(40).max(160).default(90),
});

export const scaleIdSchema = z.object({
  rounds: rounds.default(6),
  scales: z.array(z.enum(["maior", "menor_natural", "menor_harmonica", "menor_melodica", "pentatonica_maior"])).min(2).default(["maior", "menor_natural"]),
  direction: z.enum(["asc", "desc"]).default("asc"),
});

export const selfCheckSchema = z.object({
  items: z.array(z.string().min(1)).min(1),
  minutes: z.number().int().min(1).max(60).optional(),
  audio: audioSpec.optional(),
});

export const harmonyPartSchema = z.object({
  voices: z.number().int().min(1).max(8),
  arrangementSlug: z.string().optional(),
});

export const CONFIG_SCHEMAS = {
  pitch_compare: pitchCompareSchema,
  note_match: noteMatchSchema,
  interval_id: intervalIdSchema,
  chord_quality: chordQualitySchema,
  chord_extreme: chordExtremeSchema,
  progression_id: progressionIdSchema,
  melody_memory: melodyMemorySchema,
  rhythm_tap: rhythmTapSchema,
  tuning_check: tuningCheckSchema,
  consonance: consonanceSchema,
  quiz: quizSchema,
  sing_note: singNoteSchema,
  staff_read: staffReadSchema,
  entry_detect: entryDetectSchema,
  phrase_compare: phraseCompareSchema,
  scale_id: scaleIdSchema,
  self_check: selfCheckSchema,
  harmony_part: harmonyPartSchema,
} as const satisfies Record<ExerciseType, z.ZodType>;

export type ConfigFor<T extends ExerciseType> = z.output<(typeof CONFIG_SCHEMAS)[T]>;
export type QuizQuestion = z.output<typeof quizQuestionSchema>;
export type AudioSpec = z.output<typeof audioSpec>;

/**
 * Exercícios do laboratório trazem níveis de dificuldade: cada nível é uma
 * configuração parcial aplicada sobre a base.
 */
export const labWrapperSchema = z.object({
  levels: z.array(z.record(z.string(), z.unknown())).min(1),
  conceptLesson: z.string().optional(),
  conceptSummary: z.string().optional(),
});

export function isExerciseType(t: string): t is ExerciseType {
  return (EXERCISE_TYPES as readonly string[]).includes(t);
}

export function parseConfig<T extends ExerciseType>(type: T, raw: unknown): ConfigFor<T> {
  return CONFIG_SCHEMAS[type].parse(raw ?? {}) as ConfigFor<T>;
}

/** Resolve a configuração de um nível do laboratório (1 = mais fácil). */
export function resolveLevelConfig(raw: unknown, level: number): { config: Record<string, unknown>; levels: number } {
  const wrapper = labWrapperSchema.safeParse(raw);
  if (!wrapper.success) return { config: (raw as Record<string, unknown>) ?? {}, levels: 1 };
  const { levels } = wrapper.data;
  const idx = Math.min(Math.max(1, level), levels.length) - 1;
  const base = Object.fromEntries(
    Object.entries(raw as Record<string, unknown>).filter(([k]) => !["levels", "conceptLesson", "conceptSummary"].includes(k)),
  );
  return { config: { ...base, ...levels[idx] }, levels: levels.length };
}
