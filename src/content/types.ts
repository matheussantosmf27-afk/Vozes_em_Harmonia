/**
 * Tipos do conteúdo pedagógico. Fonte do conteúdo inicial: arquivos em
 * src/content/*. O script `npm run content:sql` gera a migration de conteúdo
 * (supabase/migrations/*_content.sql); em produção a aplicação lê do banco,
 * permitindo que professores criem atividades novas.
 */
import type { ExerciseType } from "@/lib/exercises/schemas";

export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "tip"; title?: string; text: string }
  | { type: "warning"; text: string }
  /** notas por nome ("C4"); um item em array = acorde naquele tempo */
  | { type: "audio"; label: string; notes: (string | string[])[]; mode?: "seq" | "chord"; tempo?: number }
  | { type: "keyboard"; from: string; to: string; highlight?: string[]; label?: string }
  | { type: "staff"; clef: "sol" | "fa"; notes: string[]; label?: string }
  | { type: "intervals"; root: string; semitones: number[] }
  | { type: "chords"; root: string; qualities: ("maior" | "menor" | "diminuto" | "aumentado" | "dominante7")[] }
  | { type: "scales"; tonic: string; kinds: ("maior" | "menor_natural" | "menor_harmonica")[] }
  | { type: "rhythm"; pattern: string; bpm: number; label: string }
  | { type: "harmonyLink"; arrangement: string; label: string }
  | { type: "toolLink"; tool: "afinador" | "extensao" | "aquecimento" | "teclado" | "metronomo" | "gravador"; label: string };

export interface LessonContent {
  objetivo: string;
  explicacao: Block[];
  demonstracao: Block[];
  exercicioGuiado: { intro?: string; passos: string[] };
  pratiqueSozinho: { passos: string[]; minutos: number; frequencia: string };
  errosComuns: { erro: string; correcao: string }[];
  seguranca: string[];
  criterioAvanco: string;
}

export interface ExerciseDef {
  slug: string;
  title: string;
  instructions: string;
  type: ExerciseType;
  config: Record<string, unknown>;
  skill: string;
  purpose: "pratica" | "avaliacao" | "laboratorio" | "diagnostico";
  difficulty?: number;
}

export interface LessonDef {
  slug: string;
  title: string;
  summary: string;
  level: 1 | 2 | 3;
  minutes: number;
  skills: string[];
  content: LessonContent;
  exercises: ExerciseDef[];
  passThreshold?: number;
}

export interface PathDef {
  slug: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  lessons: LessonDef[];
}

export interface SkillDef {
  slug: string;
  name: string;
  category: "tecnica_vocal" | "afinacao" | "percepcao" | "ritmo" | "harmonia" | "leitura" | "teoria" | "interpretacao" | "conjunto";
  description: string;
  autoMaxLevel: number;
  criteria: Record<"2" | "3" | "4" | "5", string>;
}

export interface AchievementDef {
  slug: string;
  title: string;
  description: string;
  icon: string;
  points: number;
}
