import type { ExerciseDef } from "./types";

export interface LabDef extends ExerciseDef {
  /** caminho amigável em /ouvido/[tipo] */
  route: string;
  icon: string;
  description: string;
}

const lab = (d: Omit<LabDef, "purpose" | "instructions"> & { instructions?: string }): LabDef => ({
  purpose: "laboratorio",
  instructions: d.instructions ?? d.description,
  ...d,
});

/**
 * Laboratório de percepção auditiva: cada atividade tem 5 níveis.
 * A adaptação (src/lib/pedagogy/adaptive.ts) escolhe o nível pelo histórico.
 */
export const LAB: LabDef[] = [
  lab({
    slug: "lab-altura",
    route: "altura",
    title: "Grave ou agudo",
    icon: "arrow-up-down",
    description: "Compare duas notas: a segunda é mais aguda, mais grave ou igual?",
    type: "pitch_compare",
    skill: "discriminacao-altura",
    config: {
      rounds: 10,
      conceptLesson: "grave-e-agudo",
      conceptSummary: "Altura é o quão agudo ou grave é um som. No teclado, a direita é mais aguda. Não confunda altura com volume.",
      levels: [
        { minSemitones: 7, maxSemitones: 12 },
        { minSemitones: 4, maxSemitones: 7 },
        { minSemitones: 2, maxSemitones: 4 },
        { minSemitones: 1, maxSemitones: 2 },
        { minSemitones: 1, maxSemitones: 2, allowEqual: true },
      ],
    },
  }),
  lab({
    slug: "lab-notas",
    route: "notas",
    title: "Identificação de notas",
    icon: "piano",
    description: "A partir do Dó de referência, encontre a nota no teclado.",
    type: "note_match",
    skill: "discriminacao-altura",
    config: {
      rounds: 8,
      conceptLesson: "reproducao-de-notas",
      conceptSummary: "Compare a nota misteriosa com a referência: acima ou abaixo? Perto ou longe? Depois teste as teclas vizinhas.",
      levels: [
        { range: [60, 67], naturalOnly: true },
        { range: [60, 72], naturalOnly: true },
        { range: [60, 72], naturalOnly: false },
        { range: [55, 76], naturalOnly: false },
        { range: [53, 79], naturalOnly: false, reference: false },
      ],
    },
  }),
  lab({
    slug: "lab-intervalos",
    route: "intervalos",
    title: "Intervalos",
    icon: "ruler",
    description: "Reconheça a distância entre duas notas.",
    type: "interval_id",
    skill: "intervalos",
    config: {
      rounds: 10,
      conceptLesson: "intervalos-simples",
      conceptSummary: "Terça maior soa luminosa (Dó–Mi), terça menor mais introspectiva (Lá–Dó), quinta aberta (Dó–Sol) e oitava como a mesma nota mais aguda.",
      levels: [
        { intervals: [7, 12], direction: "asc" },
        { intervals: [4, 7, 12], direction: "asc" },
        { intervals: [3, 4, 5, 7, 12], direction: "asc" },
        { intervals: [2, 3, 4, 5, 7, 9, 12], direction: "mixed" },
        { intervals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], direction: "mixed" },
      ],
    },
  }),
  lab({
    slug: "lab-memoria",
    route: "memoria",
    title: "Memória melódica",
    icon: "list-music",
    description: "Ouça a sequência e reproduza no teclado.",
    type: "melody_memory",
    skill: "memoria-melodica",
    config: {
      rounds: 5,
      conceptLesson: "memoria-de-sequencias",
      conceptSummary: "Memorize o desenho da melodia (sobe, desce, repete) e o ponto de chegada, não nota por nota.",
      levels: [
        { minLength: 3, maxLength: 3, maxLeap: 1 },
        { minLength: 3, maxLength: 4, maxLeap: 2 },
        { minLength: 4, maxLength: 5, maxLeap: 2 },
        { minLength: 5, maxLength: 6, maxLeap: 3 },
        { minLength: 6, maxLength: 8, maxLeap: 4, tempo: 100 },
      ],
    },
  }),
  lab({
    slug: "lab-acordes",
    route: "acordes",
    title: "Tipos de acorde",
    icon: "layers",
    description: "Maior, menor, diminuto, aumentado e com sétima.",
    type: "chord_quality",
    skill: "acordes",
    config: {
      rounds: 8,
      conceptLesson: "acordes-basicos",
      conceptSummary: "A diferença entre maior e menor está na terça: 4 semitons (maior) ou 3 (menor) acima da fundamental.",
      levels: [
        { qualities: ["maior", "menor"], play: "ambos" },
        { qualities: ["maior", "menor"], play: "bloco" },
        { qualities: ["maior", "menor", "diminuto"], play: "ambos" },
        { qualities: ["maior", "menor", "diminuto", "aumentado"], play: "bloco" },
        { qualities: ["maior", "menor", "diminuto", "aumentado", "dominante7"], play: "bloco", inversions: true },
      ],
    },
  }),
  lab({
    slug: "lab-extremos",
    route: "extremos",
    title: "Nota mais grave e mais aguda",
    icon: "align-vertical-space-between",
    description: "Encontre a nota mais grave ou a mais aguda de um acorde.",
    type: "chord_extreme",
    skill: "acordes",
    config: {
      rounds: 6,
      conceptLesson: "acordes-basicos",
      conceptSummary: "Cante baixinho a nota que você acha que é a mais grave (ou aguda) enquanto o acorde soa; depois compare com as opções.",
      levels: [
        { ask: "grave", size: 3 },
        { ask: "aguda", size: 3 },
        { ask: "misto", size: 3 },
        { ask: "grave", size: 4 },
        { ask: "misto", size: 4 },
      ],
    },
  }),
  lab({
    slug: "lab-progressoes",
    route: "progressoes",
    title: "Progressões harmônicas",
    icon: "route",
    description: "Reconheça encadeamentos e cadências comuns.",
    type: "progression_id",
    skill: "progressoes",
    config: {
      rounds: 5,
      conceptLesson: "campo-harmonico-e-funcoes",
      conceptSummary: "Tônica é repouso, subdominante é afastamento e dominante é tensão que pede a tônica.",
      levels: [
        { progressions: ["I-IV-V-I", "I-V"] },
        { progressions: ["I-IV-I", "IV-V-I", "I-V"] },
        { progressions: ["I-IV-V-I", "I-V-vi-IV", "I-vi-IV-V"] },
        { progressions: ["IV-V-I", "I-IV-I", "I-V", "V-vi"] },
        { progressions: ["I-IV-V-I", "I-V-vi-IV", "I-vi-IV-V", "ii-V-I", "V-vi"] },
      ],
    },
  }),
  lab({
    slug: "lab-entradas",
    route: "entradas",
    title: "Entradas vocais",
    icon: "audio-lines",
    description: "Quantas vozes entraram? Qual entrou por último?",
    type: "entry_detect",
    skill: "escuta-ativa",
    config: {
      rounds: 6,
      conceptLesson: "escuta-ativa",
      conceptSummary: "Cada nova voz muda a “espessura” do som. Conte as mudanças, não as notas.",
      levels: [
        { maxVoices: 2, ask: "quantidade" },
        { maxVoices: 3, ask: "quantidade" },
        { maxVoices: 3, ask: "ultima" },
        { maxVoices: 4, ask: "quantidade" },
        { maxVoices: 4, ask: "ultima" },
      ],
    },
  }),
  lab({
    slug: "lab-afinacao",
    route: "afinacao",
    title: "Perceber desafinação",
    icon: "gauge",
    description: "A segunda nota está afinada, acima ou abaixo?",
    type: "tuning_check",
    skill: "percepcao-afinacao",
    config: {
      rounds: 10,
      conceptLesson: "afinacao-basica",
      conceptSummary: "100 cents = um semitom. Notas um pouco acima soam “esticadas”; um pouco abaixo, “caídas”.",
      levels: [{ cents: 60 }, { cents: 45 }, { cents: 30 }, { cents: 20 }, { cents: 12 }],
    },
  }),
  lab({
    slug: "lab-ritmo",
    route: "ritmo",
    title: "Percepção de ritmo",
    icon: "drum",
    description: "Ouça e reproduza padrões rítmicos.",
    type: "rhythm_tap",
    skill: "ritmo-pulsacao",
    config: {
      rounds: 5,
      conceptLesson: "ritmo-e-pulsacao",
      conceptSummary: "Sinta o pulso no corpo antes de tocar. As notas curtas cabem dentro do tempo; o pulso não muda.",
      levels: [
        { patterns: ["q q q q", "h h", "q q h", "h q q", "w"], bpm: 72, toleranceMs: 160 },
        { patterns: ["q e e q q", "e e q h", "q q e e q", "h e e q"], bpm: 76, toleranceMs: 140 },
        { patterns: ["q. e q q", "h. q", "q rq q q", "rq q q q", "q q. e q"], bpm: 80, toleranceMs: 130 },
        { patterns: ["e e e e q q", "q. e e e q", "rq e e q q", "s s e q q h"], bpm: 84, toleranceMs: 120 },
        { patterns: ["e q e q q", "q. e e e e e", "s s s s q h", "e e rq e e q"], bpm: 90, toleranceMs: 110 },
      ],
    },
  }),
  lab({
    slug: "lab-frases",
    route: "frases",
    title: "Frases melódicas",
    icon: "messages-square",
    description: "Compare duas frases: iguais ou diferentes? Onde mudou?",
    type: "phrase_compare",
    skill: "memoria-melodica",
    config: {
      rounds: 6,
      conceptLesson: "memoria-de-sequencias",
      conceptSummary: "Guarde o desenho da primeira frase e preste atenção ao ponto em que a segunda se afasta dele.",
      levels: [
        { length: 3 },
        { length: 4 },
        { length: 5 },
        { length: 5, askPosition: true },
        { length: 7, askPosition: true, tempo: 110 },
      ],
    },
  }),
  lab({
    slug: "lab-consonancia",
    route: "consonancia",
    title: "Consonância e dissonância",
    icon: "waves",
    description: "O intervalo soa estável ou tenso?",
    type: "consonance",
    skill: "consonancia",
    config: {
      rounds: 8,
      conceptLesson: "acordes-basicos",
      conceptSummary: "Oitavas, quintas, terças e sextas soam estáveis; segundas, sétimas e o trítono soam tensos.",
      levels: [
        { intervals: [1, 12, 7, 11] },
        { intervals: [1, 2, 4, 7, 11, 12] },
        { intervals: [1, 2, 3, 4, 6, 7, 10, 11, 12] },
        { intervals: [2, 3, 5, 6, 8, 9, 10] },
        { intervals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
      ],
    },
  }),
  lab({
    slug: "lab-escalas",
    route: "escalas",
    title: "Escalas",
    icon: "bar-chart-3",
    description: "Maior, menor natural, menor harmônica e pentatônica.",
    type: "scale_id",
    skill: "teoria-escalas",
    config: {
      rounds: 6,
      conceptLesson: "escalas-tons-e-semitons",
      conceptSummary: "Na escala maior a terça é maior (luminosa); na menor, a terça é menor. A menor harmônica tem o 7º grau elevado.",
      levels: [
        { scales: ["maior", "menor_natural"] },
        { scales: ["maior", "menor_natural"], direction: "desc" },
        { scales: ["maior", "menor_natural", "menor_harmonica"] },
        { scales: ["maior", "menor_natural", "menor_harmonica", "pentatonica_maior"] },
        { scales: ["maior", "menor_natural", "menor_harmonica", "menor_melodica", "pentatonica_maior"] },
      ],
    },
  }),
];

/** Atividades do treinador de voz e do treinador de harmonia (registram tentativas). */
export const PRACTICE_EXERCISES: ExerciseDef[] = [
  { slug: "treino-afinacao-livre", title: "Treinador de afinação", instructions: "Nota sustentada com microfone.", type: "sing_note", config: { rounds: 1, holdSeconds: 3 }, skill: "afinacao-nota", purpose: "pratica" },
  { slug: "treino-independencia", title: "Sustentação com distração", instructions: "Sustente a nota enquanto outra melodia soa.", type: "sing_note", config: { rounds: 1, holdSeconds: 4, distractor: true }, skill: "independencia-vocal", purpose: "pratica" },
  { slug: "harmonia-pratica-1-voz", title: "Treinador de harmonia — uníssono", instructions: "Prática no treinador de harmonia.", type: "harmony_part", config: { voices: 1 }, skill: "canto-unissono", purpose: "pratica" },
  { slug: "harmonia-pratica-2-vozes", title: "Treinador de harmonia — duas vozes", instructions: "Prática no treinador de harmonia.", type: "harmony_part", config: { voices: 2 }, skill: "harmonia-duas-vozes", purpose: "pratica" },
  { slug: "harmonia-pratica-3-vozes", title: "Treinador de harmonia — três vozes", instructions: "Prática no treinador de harmonia.", type: "harmony_part", config: { voices: 3 }, skill: "harmonia-tres-quatro-vozes", purpose: "pratica" },
  { slug: "harmonia-pratica-4-vozes", title: "Treinador de harmonia — quatro vozes", instructions: "Prática no treinador de harmonia.", type: "harmony_part", config: { voices: 4 }, skill: "harmonia-tres-quatro-vozes", purpose: "pratica" },
  { slug: "aquecimento-guiado", title: "Rotina guiada de aquecimento", instructions: "Rotina de aquecimento com temporizador.", type: "self_check", config: { items: ["Corpo", "Respiração", "Vibração", "Deslizes", "Escalas", "Articulação"] }, skill: "aquecimento-vocal", purpose: "pratica" },
];

/** Atividades da avaliação inicial (purpose = diagnostico). */
export const DIAGNOSTIC_EXERCISES: ExerciseDef[] = [
  { slug: "diag-altura", title: "Diagnóstico: grave e agudo", instructions: "", type: "pitch_compare", config: { rounds: 6, minSemitones: 2, maxSemitones: 7 }, skill: "discriminacao-altura", purpose: "diagnostico" },
  { slug: "diag-reproducao", title: "Diagnóstico: reprodução de notas", instructions: "", type: "sing_note", config: { rounds: 3, holdSeconds: 2.5 }, skill: "afinacao-nota", purpose: "diagnostico" },
  { slug: "diag-sequencia", title: "Diagnóstico: memória de sequências", instructions: "", type: "melody_memory", config: { rounds: 3, minLength: 3, maxLength: 4, maxLeap: 2 }, skill: "memoria-melodica", purpose: "diagnostico" },
  { slug: "diag-intervalos", title: "Diagnóstico: intervalos", instructions: "", type: "interval_id", config: { rounds: 6, intervals: [4, 7, 12], direction: "asc" }, skill: "intervalos", purpose: "diagnostico" },
  { slug: "diag-ritmo", title: "Diagnóstico: ritmo", instructions: "", type: "rhythm_tap", config: { rounds: 3, patterns: ["q q h", "q e e q q", "h q q"], bpm: 80 }, skill: "ritmo-pulsacao", purpose: "diagnostico" },
  { slug: "diag-sustentacao", title: "Diagnóstico: nota sustentada", instructions: "", type: "sing_note", config: { rounds: 2, holdSeconds: 4 }, skill: "afinacao-nota", purpose: "diagnostico" },
  { slug: "diag-entrada", title: "Diagnóstico: entrada e finalização", instructions: "", type: "rhythm_tap", config: { rounds: 2, patterns: ["rq h q", "rh h"], bpm: 80, toleranceMs: 140 }, skill: "ritmo-pulsacao", purpose: "diagnostico" },
  { slug: "diag-consonancia", title: "Diagnóstico: consonância", instructions: "", type: "consonance", config: { rounds: 6, intervals: [1, 4, 6, 7, 11, 12] }, skill: "consonancia", purpose: "diagnostico" },
  { slug: "diag-independencia", title: "Diagnóstico: independência vocal", instructions: "", type: "sing_note", config: { rounds: 2, holdSeconds: 4, distractor: true }, skill: "independencia-vocal", purpose: "diagnostico" },
];
