/**
 * Tipos do conteúdo pedagógico. Fonte do conteúdo inicial: arquivos em
 * src/content/*. O script `npm run content:sql` gera a migration de conteúdo
 * (supabase/migrations/*_content.sql); em produção a aplicação lê do banco,
 * permitindo que professores criem atividades novas.
 */
import type { ExerciseType } from "@/lib/exercises/schemas";

/** Ilustrações em SVG disponíveis (ver src/components/lesson/illustrations.tsx). */
export const ILLUSTRATIONS = [
  "postura-comparada",
  "postura-sentada",
  "respiracao",
  "aparelho-vocal",
  "ressonancia",
  "vogais",
  "mandibula",
  "registros",
  "extensao-tessitura",
  "aquecimento",
  "hidratacao",
  "pauta",
  "claves",
  "linhas-suplementares",
  "figuras-ritmicas",
  "compasso",
  "pulso",
  "onda-afinada",
  "onda-desafinada",
  "unissono",
  "naipes-satb",
  "quarteto-ttbb",
  "equilibrio",
  "regente",
  "escuta-ativa",
  "tom-semitom",
  "intervalo-escada",
  "triade",
  "inversoes",
  "movimentos-vozes",
  "campo-harmonico",
  "cadencia",
  "cifra",
  "partitura-vocal",
  "dinamica",
  "frase-respiracao",
] as const;
export type IllustrationName = (typeof ILLUSTRATIONS)[number];

/** Notas por nome ("C4"); um item em array = acorde naquele tempo. */
export type NoteSpec = (string | string[])[];

export type CalloutIcon = "ideia" | "ouvido" | "coracao" | "musica" | "olho" | "maos" | "estrela" | "pergunta";

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
  | { type: "toolLink"; tool: "afinador" | "extensao" | "aquecimento" | "teclado" | "metronomo" | "gravador"; label: string }
  // --- blocos interativos das aulas em etapas -------------------------------
  /** Ilustração em SVG com legenda curta. */
  | { type: "illustration"; name: IllustrationName; caption?: string }
  /** Destaque visual curto (analogia, curiosidade, dica). */
  | { type: "callout"; icon: CalloutIcon; title: string; text: string }
  /** Pergunta rápida com resposta imediata (não vale nota). Pode ter áudio, pauta ou ilustração. */
  | {
      type: "check";
      question: string;
      options: string[];
      answer: number;
      explain: string;
      audio?: { notes: NoteSpec; mode?: "seq" | "chord"; tempo?: number };
      staff?: { clef: "sol" | "fa"; notes: string[] };
      illustration?: IllustrationName;
    }
  /** Afirmações de verdadeiro ou falso, uma por vez. */
  | { type: "trueFalse"; items: { statement: string; answer: boolean; explain: string }[] }
  /** Ouça as opções e compare; com `answer`, vira um desafio de escuta. */
  | {
      type: "compare";
      prompt: string;
      options: { label: string; notes: NoteSpec; cents?: number; tempo?: number; mode?: "seq" | "chord" }[];
      answer?: number;
      explain: string;
    }
  /** Treinador de respiração animado (tempos em segundos). */
  | { type: "breathing"; inhale: number; hold?: number; exhale: number; rounds: number; exhaleOn?: string }
  /** Ação guiada com cronômetro: “faça agora”. */
  | { type: "timer"; instruction: string; seconds: number; reps?: number }
  /** Cante e veja: toca a nota de referência e mostra a nota detectada pelo microfone. */
  | { type: "singAlong"; instruction: string; note: string; seconds?: number }
  /** Ligue os pares (toque à esquerda e depois à direita). */
  | { type: "match"; prompt: string; pairs: { left: string; right: string }[] }
  /** Coloque na ordem certa (os itens são informados já na ordem correta). */
  | { type: "order"; prompt: string; items: string[] }
  /** Lista para marcar enquanto pratica (fica salva no aparelho). */
  | { type: "checklist"; title: string; items: string[] }
  /** Pense primeiro, depois toque para ver a resposta. */
  | { type: "reveal"; prompt: string; answer: string };

export type EtapaTipo = "descobrir" | "ouvir" | "experimentar" | "checar" | "aplicar";

/** Uma tela da aula interativa: uma ideia por vez. */
export interface Etapa {
  titulo: string;
  tipo: EtapaTipo;
  blocos: Block[];
}

export interface LessonContent {
  objetivo: string;
  /** Frase de abertura curta e convidativa da aula interativa. */
  gancho?: string;
  /** Aula interativa em etapas. Quando presente, substitui explicação, demonstração e exercício guiado. */
  etapas?: Etapa[];
  explicacao?: Block[];
  demonstracao?: Block[];
  exercicioGuiado?: { intro?: string; passos: string[] };
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
