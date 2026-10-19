/**
 * Geração das rodadas de cada atividade. Funções puras (testáveis): recebem
 * a configuração validada, um gerador aleatório e devolvem o que tocar, o que
 * perguntar e qual é a resposta.
 */
import { createRng, pick, randInt, shuffle, type Rng } from "@/lib/music/random";
import { isBlackKey, NATURAL_PITCH_CLASSES, noteName, parseNote, pitchClass } from "@/lib/music/notes";
import {
  buildChord,
  buildScale,
  CHORD_QUALITIES,
  intervalBySemitones,
  isConsonant,
  PROGRESSIONS,
  SCALES,
  voiceProgression,
  type ChordQuality,
  type ScaleKind,
} from "@/lib/music/theory";
import { describePattern, onsetTimesMs, parsePattern } from "@/lib/music/rhythm";
import { parseConfig, type AudioSpec, type ConfigFor, type ExerciseType } from "./schemas";

export type Instrument = "piano" | "voz" | "clique" | "orgao";

export interface NoteEvent {
  midi: number;
  /** segundos desde o início do trecho */
  start: number;
  duration: number;
  cents?: number;
  gain?: number;
  instrument?: Instrument;
}

export interface RoundOption {
  id: string;
  label: string;
  cue?: NoteEvent[];
}

export type AnswerMode = "choice" | "keyboard-note" | "keyboard-sequence" | "tap" | "sing" | "self";

export interface Round {
  index: number;
  prompt: string;
  cue: NoteEvent[];
  answerMode: AnswerMode;
  options?: RoundOption[];
  correct?: string;
  expectedSequence?: number[];
  /** Nota dada como ponto de partida na memória melódica */
  givenFirst?: boolean;
  expectedTapsMs?: number[];
  tapToleranceMs?: number;
  countInBeats?: number;
  bpm?: number;
  targetMidi?: number;
  holdSeconds?: number;
  toleranceCents?: number;
  /** melodia tocada enquanto a pessoa sustenta a nota */
  distractor?: NoteEvent[];
  keyboardRange?: [number, number];
  staff?: { clef: "sol" | "fa"; notes: number[] };
  explanation?: string;
  selfItems?: string[];
}

export interface GenerateContext {
  rng?: Rng;
  index?: number;
  /** região confortável da pessoa (para atividades cantadas) */
  voiceRange?: [number, number];
}

// ---------------------------------------------------------------------------
// Utilitários de áudio
// ---------------------------------------------------------------------------
export function seq(midis: number[], noteDur = 0.7, gap = 0.08, start = 0, instrument?: Instrument): NoteEvent[] {
  return midis.map((m, i) => ({ midi: m, start: start + i * (noteDur + gap), duration: noteDur, instrument }));
}

export function chord(midis: number[], start = 0, duration = 1.6, instrument?: Instrument): NoteEvent[] {
  return midis.map((m) => ({ midi: m, start, duration, gain: 0.8 / Math.sqrt(midis.length), instrument }));
}

export function cueEnd(events: NoteEvent[]): number {
  return events.reduce((acc, e) => Math.max(acc, e.start + e.duration), 0);
}

/** Converte a especificação de áudio dos conteúdos (nomes de notas) em eventos. */
export function audioSpecToEvents(spec: AudioSpec): NoteEvent[] {
  const beat = 60 / spec.tempo;
  const toMidi = (n: string | number) => (typeof n === "number" ? n : parseNote(n) ?? 60);
  if (spec.mode === "chord") {
    return chord(spec.notes.flatMap((n) => (Array.isArray(n) ? n.map(toMidi) : [toMidi(n)])), 0, beat * 3);
  }
  const events: NoteEvent[] = [];
  spec.notes.forEach((n, i) => {
    const group = Array.isArray(n) ? n.map(toMidi) : [toMidi(n)];
    for (const m of group) events.push({ midi: m, start: i * beat, duration: beat * 0.92, gain: 0.8 / Math.sqrt(group.length) });
  });
  return events;
}

function naturalNotesIn(low: number, high: number): number[] {
  const out: number[] = [];
  for (let m = low; m <= high; m++) if (!isBlackKey(m)) out.push(m);
  return out;
}

function randomMidi(rng: Rng, [low, high]: [number, number], naturalOnly = false): number {
  if (naturalOnly) return pick(rng, naturalNotesIn(low, high));
  return randInt(rng, low, high);
}

const DIRECTION_LABEL = { asc: "ascendente", desc: "descendente", harmonic: "harmônico (simultâneo)" } as const;

// ---------------------------------------------------------------------------
// Geradores
// ---------------------------------------------------------------------------
type Gen<T extends ExerciseType> = (cfg: ConfigFor<T>, rng: Rng, ctx: Required<Pick<GenerateContext, "index">> & GenerateContext) => Round;

const pitchCompare: Gen<"pitch_compare"> = (cfg, rng, { index }) => {
  const [low, high] = cfg.range;
  const first = randInt(rng, low + cfg.maxSemitones, Math.max(low + cfg.maxSemitones, high - cfg.maxSemitones));
  const equal = cfg.allowEqual && rng() < 0.2;
  const dist = equal ? 0 : randInt(rng, cfg.minSemitones, Math.max(cfg.minSemitones, cfg.maxSemitones));
  const dir = rng() < 0.5 ? 1 : -1;
  const second = first + dir * dist;
  const options: RoundOption[] = [
    { id: "aguda", label: "A segunda é mais aguda" },
    { id: "grave", label: "A segunda é mais grave" },
  ];
  if (cfg.allowEqual) options.push({ id: "igual", label: "São iguais" });
  const correct = dist === 0 ? "igual" : dir > 0 ? "aguda" : "grave";
  return {
    index,
    prompt: "Ouça as duas notas. A segunda nota é mais aguda ou mais grave que a primeira?",
    cue: seq([first, second], 0.8, 0.25),
    answerMode: "choice",
    options,
    correct,
    explanation:
      dist === 0
        ? `As duas notas eram ${noteName(first)}.`
        : `${noteName(first)} → ${noteName(second)}: a segunda estava ${dist} semitom${dist > 1 ? "s" : ""} ${dir > 0 ? "acima" : "abaixo"}.`,
  };
};

const noteMatch: Gen<"note_match"> = (cfg, rng, { index }) => {
  const [low, high] = cfg.range;
  const target = randomMidi(rng, cfg.range, cfg.naturalOnly);
  const ref = 60;
  const cue = cfg.reference ? [...seq([ref], 0.8), ...seq([target], 0.9, 0, 1.4)] : seq([target], 0.9);
  return {
    index,
    prompt: cfg.reference
      ? "Primeiro soa o Dó4 de referência; depois, a nota misteriosa. Encontre a nota misteriosa no teclado."
      : "Encontre no teclado a nota que você ouviu.",
    cue,
    answerMode: "keyboard-note",
    expectedSequence: [target],
    keyboardRange: [Math.min(low, ref), Math.max(high, ref)],
    explanation: `A nota era ${noteName(target)}.`,
  };
};

const intervalId: Gen<"interval_id"> = (cfg, rng, { index }) => {
  const semitones = pick(rng, cfg.intervals);
  const direction = cfg.direction === "mixed" ? pick(rng, ["asc", "desc", "harmonic"] as const) : cfg.direction;
  const [low, high] = cfg.range;
  const root = direction === "desc" ? randInt(rng, low + semitones, high) : randInt(rng, low, Math.max(low, high - semitones));
  const other = direction === "desc" ? root - semitones : root + semitones;
  const cue = direction === "harmonic" ? chord([root, other], 0, 1.8) : seq([root, other], 0.8, 0.12);
  const info = intervalBySemitones(semitones);
  const options = [...new Set(cfg.intervals)]
    .sort((a, b) => a - b)
    .map((s) => ({ id: String(s), label: intervalBySemitones(s).name }));
  return {
    index,
    prompt: `Que intervalo ${DIRECTION_LABEL[direction]} você ouviu?`,
    cue,
    answerMode: "choice",
    options,
    correct: String(semitones),
    explanation: `${noteName(root)} → ${noteName(other)}: ${info.name} (${semitones} semitons).${info.memoryHint ? ` Dica: ${info.memoryHint}.` : ""}`,
  };
};

const chordQualityGen: Gen<"chord_quality"> = (cfg, rng, { index }) => {
  const quality = pick(rng, cfg.qualities) as ChordQuality;
  const root = randInt(rng, cfg.range[0], cfg.range[1]);
  const size = CHORD_QUALITIES[quality].intervals.length;
  const inversion = cfg.inversions ? randInt(rng, 0, size - 1) : 0;
  const notes = buildChord(root, quality, inversion);
  let cue: NoteEvent[];
  if (cfg.play === "bloco") cue = chord(notes);
  else if (cfg.play === "arpejo") cue = seq(notes, 0.55, 0.05);
  else cue = [...seq(notes, 0.5, 0.05), ...chord(notes, notes.length * 0.55 + 0.3)];
  return {
    index,
    prompt: "Qual é o tipo de acorde?",
    cue,
    answerMode: "choice",
    options: cfg.qualities.map((q) => ({ id: q, label: CHORD_QUALITIES[q as ChordQuality].label })),
    correct: quality,
    explanation: `${notes.map((n) => noteName(n)).join(" – ")}: acorde ${CHORD_QUALITIES[quality].label.toLowerCase()}. ${CHORD_QUALITIES[quality].description}`,
  };
};

const chordExtreme: Gen<"chord_extreme"> = (cfg, rng, { index }) => {
  const quality: ChordQuality = cfg.size === 4 ? "dominante7" : pick(rng, ["maior", "menor"] as const);
  const root = randInt(rng, cfg.range[0], cfg.range[1]);
  const notes = buildChord(root, quality, randInt(rng, 0, cfg.size - 1));
  const ask = cfg.ask === "misto" ? pick(rng, ["grave", "aguda"] as const) : cfg.ask;
  const target = ask === "grave" ? notes[0] : notes[notes.length - 1];
  // Distratores próximos que NÃO estão no acorde: é preciso reconhecer a nota.
  const pool = [-3, -2, -1, 1, 2, 3].map((d) => target + d).filter((m) => !notes.some((n) => pitchClass(n) === pitchClass(m)));
  const distractors = shuffle(rng, pool).slice(0, 2);
  const opts = shuffle(rng, [target, ...distractors]).map((m, i) => ({
    id: String(m),
    label: `Opção ${String.fromCharCode(65 + i)}`,
    cue: seq([m], 1),
  }));
  return {
    index,
    prompt: `Ouça o acorde. Depois ouça as opções: qual delas é a nota mais ${ask} do acorde?`,
    cue: chord(notes, 0, 2.2),
    answerMode: "choice",
    options: opts,
    correct: String(target),
    explanation: `O acorde era ${notes.map((n) => noteName(n)).join(" – ")}. A nota mais ${ask} era ${noteName(target)}.`,
  };
};

const progressionId: Gen<"progression_id"> = (cfg, rng, { index }) => {
  const defs = PROGRESSIONS.filter((p) => cfg.progressions.includes(p.id));
  const prog = pick(rng, defs.length >= 2 ? defs : PROGRESSIONS.slice(0, 2));
  const tonic = randInt(rng, 57, 64);
  const chords = voiceProgression(tonic, prog.degrees);
  const cue = chords.flatMap((c, i) => chord(c, i * 1.25, 1.15, "orgao"));
  return {
    index,
    prompt: "Qual progressão harmônica você ouviu? (o primeiro acorde é sempre a tônica, salvo indicação)",
    cue,
    answerMode: "choice",
    options: (defs.length >= 2 ? defs : PROGRESSIONS.slice(0, 2)).map((p) => ({ id: p.id, label: p.label })),
    correct: prog.id,
    explanation: `${prog.label} em ${noteName(tonic, { withOctave: false })} maior. ${prog.description}`,
  };
};

const melodyMemory: Gen<"melody_memory"> = (cfg, rng, { index }) => {
  const length = randInt(rng, cfg.minLength, Math.max(cfg.minLength, cfg.maxLength));
  const tonic = pick(rng, [55, 57, 60, 62]);
  const scale = buildScale(tonic, "maior", true);
  let degree = randInt(rng, 0, 4);
  const notes = [scale[degree]];
  for (let i = 1; i < length; i++) {
    let next = degree + randInt(rng, -cfg.maxLeap, cfg.maxLeap);
    if (next === degree) next += rng() < 0.5 ? 1 : -1;
    degree = Math.max(0, Math.min(scale.length - 1, next));
    notes.push(scale[degree]);
  }
  const beat = 60 / cfg.tempo;
  return {
    index,
    prompt: `Ouça a sequência de ${length} notas e reproduza no teclado. A primeira nota (${noteName(notes[0])}) está destacada.`,
    cue: seq(notes, beat * 0.85, beat * 0.15),
    answerMode: "keyboard-sequence",
    expectedSequence: notes,
    givenFirst: true,
    keyboardRange: [tonic - 1, tonic + 13],
    explanation: `A sequência era: ${notes.map((n) => noteName(n)).join(" – ")}.`,
  };
};

const rhythmTap: Gen<"rhythm_tap"> = (cfg, rng, { index }) => {
  const pattern = cfg.patterns[index % cfg.patterns.length] ?? pick(rng, cfg.patterns);
  const beatSec = 60 / cfg.bpm;
  const countIn = cfg.beatsPerMeasure;
  const countEvents: NoteEvent[] = Array.from({ length: countIn }, (_, i) => ({
    midi: i === 0 ? 96 : 89,
    start: i * beatSec,
    duration: 0.06,
    instrument: "clique" as const,
  }));
  const patternEvents: NoteEvent[] = parsePattern(pattern)
    .filter((e) => !e.rest)
    .map((e) => ({ midi: 76, start: (countIn + e.start) * beatSec, duration: Math.min(0.25, e.duration * beatSec * 0.8), instrument: "piano" as const }));
  return {
    index,
    prompt: "Ouça a contagem e o ritmo. Depois, toque o mesmo ritmo no botão (ou na barra de espaço).",
    cue: [...countEvents, ...patternEvents],
    answerMode: "tap",
    expectedTapsMs: onsetTimesMs(pattern, cfg.bpm),
    tapToleranceMs: cfg.toleranceMs,
    countInBeats: countIn,
    bpm: cfg.bpm,
    explanation: `Ritmo: ${describePattern(pattern)}.`,
  };
};

const tuningCheck: Gen<"tuning_check"> = (cfg, rng, { index }) => {
  const ref = randInt(rng, cfg.range[0], cfg.range[1]);
  const kind = pick(rng, ["afinada", "acima", "abaixo"] as const);
  const cents = kind === "afinada" ? 0 : kind === "acima" ? cfg.cents : -cfg.cents;
  return {
    index,
    prompt: "Primeiro soa a nota de referência, depois alguém “canta” a mesma nota. Ela está afinada, acima ou abaixo?",
    cue: [
      { midi: ref, start: 0, duration: 1.1, instrument: "piano" },
      { midi: ref, start: 1.4, duration: 1.4, cents, instrument: "voz" },
    ],
    answerMode: "choice",
    options: [
      { id: "afinada", label: "Afinada" },
      { id: "acima", label: "Acima (alta demais)" },
      { id: "abaixo", label: "Abaixo (baixa demais)" },
    ],
    correct: kind,
    explanation: kind === "afinada" ? "A segunda nota estava afinada." : `A segunda nota estava ${Math.abs(cents)} cents ${kind}.`,
  };
};

const consonanceGen: Gen<"consonance"> = (cfg, rng, { index }) => {
  const s = pick(rng, cfg.intervals);
  const root = randInt(rng, cfg.range[0], cfg.range[1]);
  const consonant = isConsonant(s);
  const info = intervalBySemitones(s);
  return {
    index,
    prompt: "As duas notas soam juntas. O intervalo é consonante (estável) ou dissonante (tenso)?",
    cue: chord([root, root + s], 0, 2),
    answerMode: "choice",
    options: [
      { id: "consonante", label: "Consonante" },
      { id: "dissonante", label: "Dissonante" },
    ],
    correct: consonant ? "consonante" : "dissonante",
    explanation: `${info.name}: ${info.consonance === "dissonante" ? "dissonante" : `consonância ${info.consonance}`}.`,
  };
};

const quiz: Gen<"quiz"> = (cfg, rng, { index }) => {
  const q = cfg.questions[index % cfg.questions.length];
  const order = cfg.shuffleOptions ? shuffle(rng, q.options.map((_, i) => i)) : q.options.map((_, i) => i);
  return {
    index,
    prompt: q.q,
    cue: q.audio ? audioSpecToEvents(q.audio) : [],
    answerMode: "choice",
    options: order.map((i) => ({ id: String(i), label: q.options[i] })),
    correct: String(q.answer),
    explanation: q.explanation,
    staff: q.staff ? { clef: q.staff.clef, notes: q.staff.notes.map((n) => parseNote(n) ?? 60) } : undefined,
  };
};

const singNote: Gen<"sing_note"> = (cfg, rng, { index, voiceRange }) => {
  let target: number;
  if (cfg.notes && cfg.notes.length) {
    const n = cfg.notes[index % cfg.notes.length];
    target = typeof n === "number" ? n : parseNote(n) ?? 60;
  } else {
    const [low, high] = voiceRange ?? [55, 64];
    const span = Math.max(0, high - low);
    target = pick(rng, naturalNotesIn(low + Math.floor(span * 0.25), Math.max(low + Math.floor(span * 0.25), high - Math.floor(span * 0.25))));
  }
  let distractor: NoteEvent[] | undefined;
  if (cfg.distractor) {
    const steps = [4, 5, 7, 9, 7, 5, 4, 2];
    distractor = steps.map((s, i) => ({ midi: target + s, start: 0.5 + i * 0.45, duration: 0.42, instrument: "piano" as const, gain: 0.5 }));
  }
  return {
    index,
    prompt: cfg.distractor
      ? `Ouça ${noteName(target)} e sustente-a por ${cfg.holdSeconds} s enquanto outra melodia toca. Mantenha a sua nota!`
      : `Ouça ${noteName(target)} e cante-a sustentando por ${cfg.holdSeconds} segundos, num “ú” ou “lá” confortável.`,
    cue: seq([target], 1.5, 0, 0, "piano"),
    answerMode: "sing",
    targetMidi: target,
    holdSeconds: cfg.holdSeconds,
    toleranceCents: cfg.toleranceCents,
    distractor,
  };
};

const STAFF_DEFAULT: Record<"sol" | "fa", [string, string]> = { sol: ["C4", "G5"], fa: ["E2", "C4"] };

const staffRead: Gen<"staff_read"> = (cfg, rng, { index }) => {
  const clef = cfg.clef === "ambas" ? pick(rng, ["sol", "fa"] as const) : cfg.clef;
  const [lowName, highName] = cfg.range ?? STAFF_DEFAULT[clef];
  const low = parseNote(lowName) ?? 60;
  const high = parseNote(highName) ?? 79;
  const target = randomMidi(rng, [low, high], cfg.naturalOnly);
  const correctName = noteName(target, { style: cfg.style, withOctave: false });
  const names = cfg.naturalOnly
    ? NATURAL_PITCH_CLASSES.map((pc) => noteName(pc + 60, { style: cfg.style, withOctave: false }))
    : Array.from({ length: 12 }, (_, pc) => noteName(pc + 60, { style: cfg.style, withOctave: false }));
  const distractors = shuffle(rng, names.filter((n) => n !== correctName)).slice(0, 3);
  const options = shuffle(rng, [correctName, ...distractors]).map((n) => ({ id: n, label: n }));
  return {
    index,
    prompt: `Clave de ${clef === "sol" ? "Sol" : "Fá"}: qual é o nome desta nota?`,
    cue: seq([target], 1),
    answerMode: "choice",
    options,
    correct: correctName,
    staff: { clef, notes: [target] },
    explanation: `É ${noteName(target)} (${noteName(target, { style: "cifra" })}).`,
  };
};

const entryDetect: Gen<"entry_detect"> = (cfg, rng, { index }) => {
  const root = randInt(rng, 48, 55);
  const voicesAll = [root, root + 7, root + 16, root + 19].slice(0, cfg.maxVoices);
  const count = randInt(rng, 2, cfg.maxVoices);
  const chosen = shuffle(rng, voicesAll).slice(0, count);
  const order = shuffle(rng, chosen);
  const totalDur = order.length * 1.2 + 1.5;
  const cue: NoteEvent[] = order.map((m, i) => ({ midi: m, start: i * 1.2, duration: totalDur - i * 1.2, instrument: "voz", gain: 0.45 }));
  if (cfg.ask === "ultima") {
    const sorted = [...chosen].sort((a, b) => a - b);
    const last = order[order.length - 1];
    const pos = sorted.indexOf(last);
    const label = pos === 0 ? "grave" : pos === sorted.length - 1 ? "aguda" : "media";
    const options = [
      { id: "grave", label: "A mais grave" },
      ...(sorted.length > 2 ? [{ id: "media", label: "Uma voz do meio" }] : []),
      { id: "aguda", label: "A mais aguda" },
    ];
    return {
      index,
      prompt: "As vozes entram uma de cada vez. Qual foi a ÚLTIMA voz a entrar?",
      cue,
      answerMode: "choice",
      options,
      correct: label,
      explanation: `Ordem das entradas: ${order.map((m) => noteName(m)).join(" → ")}.`,
    };
  }
  return {
    index,
    prompt: "As vozes entram uma de cada vez e permanecem soando. Quantas vozes entraram?",
    cue,
    answerMode: "choice",
    options: Array.from({ length: cfg.maxVoices }, (_, i) => ({ id: String(i + 1), label: `${i + 1} voz${i ? "es" : ""}` })),
    correct: String(count),
    explanation: `Entraram ${count} vozes: ${order.map((m) => noteName(m)).join(" → ")}.`,
  };
};

const phraseCompare: Gen<"phrase_compare"> = (cfg, rng, { index }) => {
  const tonic = pick(rng, [57, 60, 62]);
  const scale = buildScale(tonic, "maior");
  let d = randInt(rng, 0, 4);
  const a: number[] = [scale[d]];
  for (let i = 1; i < cfg.length; i++) {
    d = Math.max(0, Math.min(7, d + pick(rng, [-2, -1, 1, 2])));
    a.push(scale[d]);
  }
  const different = rng() < 0.55;
  const b = [...a];
  let changed = -1;
  if (different) {
    changed = randInt(rng, 1, cfg.length - 1);
    b[changed] = a[changed] + pick(rng, [-2, -1, 1, 2]);
  }
  const beat = 60 / cfg.tempo;
  const phraseDur = cfg.length * beat;
  const cue = [...seq(a, beat * 0.85, beat * 0.15), ...seq(b, beat * 0.85, beat * 0.15, phraseDur + 0.9)];
  if (cfg.askPosition) {
    return {
      index,
      prompt: "Ouça as duas frases. Em qual nota a segunda frase muda? (ou são iguais?)",
      cue,
      answerMode: "choice",
      options: [{ id: "-1", label: "São iguais" }, ...Array.from({ length: cfg.length - 1 }, (_, i) => ({ id: String(i + 1), label: `${i + 2}ª nota` }))],
      correct: String(changed),
      explanation: different ? `A ${changed + 1}ª nota mudou: ${noteName(a[changed])} → ${noteName(b[changed])}.` : "As frases eram idênticas.",
    };
  }
  return {
    index,
    prompt: "Ouça as duas frases melódicas. Elas são iguais ou diferentes?",
    cue,
    answerMode: "choice",
    options: [
      { id: "iguais", label: "Iguais" },
      { id: "diferentes", label: "Diferentes" },
    ],
    correct: different ? "diferentes" : "iguais",
    explanation: different ? `A ${changed + 1}ª nota mudou: ${noteName(a[changed])} → ${noteName(b[changed])}.` : "As frases eram idênticas.",
  };
};

const scaleId: Gen<"scale_id"> = (cfg, rng, { index }) => {
  const kind = pick(rng, cfg.scales) as ScaleKind;
  const tonic = randInt(rng, 55, 64);
  let notes = buildScale(tonic, kind);
  if (cfg.direction === "desc") notes = [...notes].reverse();
  return {
    index,
    prompt: "Qual escala você ouviu?",
    cue: seq(notes, 0.38, 0.04),
    answerMode: "choice",
    options: cfg.scales.map((s) => ({ id: s, label: SCALES[s as ScaleKind].label })),
    correct: kind,
    explanation: `Escala ${SCALES[kind].label.toLowerCase()} a partir de ${noteName(tonic)}.`,
  };
};

const selfCheck: Gen<"self_check"> = (cfg, _rng, { index }) => ({
  index,
  prompt: cfg.minutes
    ? `Pratique por cerca de ${cfg.minutes} minuto${cfg.minutes > 1 ? "s" : ""} e marque o que conseguiu fazer com conforto.`
    : "Pratique e marque o que conseguiu fazer com conforto.",
  cue: cfg.audio ? audioSpecToEvents(cfg.audio) : [],
  answerMode: "self",
  selfItems: cfg.items,
});

const harmonyPart: Gen<"harmony_part"> = (cfg, _rng, { index }) => ({
  index,
  prompt: `Pratique a sua voz no treinador de harmonia (${cfg.voices} voz${cfg.voices > 1 ? "es" : ""}).`,
  cue: [],
  answerMode: "self",
  selfItems: ["Cantei a minha linha do início ao fim", "Mantive a minha voz com as outras soando", "Respirei nos lugares planejados"],
});

const GENERATORS: { [K in ExerciseType]: Gen<K> } = {
  pitch_compare: pitchCompare,
  note_match: noteMatch,
  interval_id: intervalId,
  chord_quality: chordQualityGen,
  chord_extreme: chordExtreme,
  progression_id: progressionId,
  melody_memory: melodyMemory,
  rhythm_tap: rhythmTap,
  tuning_check: tuningCheck,
  consonance: consonanceGen,
  quiz,
  sing_note: singNote,
  staff_read: staffRead,
  entry_detect: entryDetect,
  phrase_compare: phraseCompare,
  scale_id: scaleId,
  self_check: selfCheck,
  harmony_part: harmonyPart,
};

/** Número de rodadas de uma atividade com esta configuração. */
export function roundCount(type: ExerciseType, rawConfig: unknown): number {
  const cfg = parseConfig(type, rawConfig) as Record<string, unknown>;
  if (type === "quiz") return (cfg.questions as unknown[]).length;
  if (type === "self_check" || type === "harmony_part") return 1;
  return (cfg.rounds as number) ?? 1;
}

export function generateRound(type: ExerciseType, rawConfig: unknown, ctx: GenerateContext = {}): Round {
  const cfg = parseConfig(type, rawConfig);
  const rng = ctx.rng ?? createRng();
  const gen = GENERATORS[type] as Gen<typeof type>;
  return gen(cfg as never, rng, { ...ctx, index: ctx.index ?? 0 });
}
