/**
 * Motor de áudio baseado na Web Audio API (sem dependências externas).
 * Sintetiza notas com timbres simples — suficientes e leves para exercícios:
 *  - piano: ataque rápido e decaimento (referência de nota);
 *  - voz: dente-de-serra filtrado com vibrato suave (vozes do treinador);
 *  - orgão: sustentado, para acordes e progressões;
 *  - clique: metrônomo.
 */
import type { Instrument, NoteEvent } from "@/lib/exercises/generators";
import { midiToFrequency } from "@/lib/music/notes";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

export function isAudioSupported(): boolean {
  return typeof window !== "undefined" && ("AudioContext" in window || "webkitAudioContext" in window);
}

export function getAudioContext(): AudioContext {
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctor({ latencyHint: "interactive" });
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -14;
    compressor.ratio.value = 4;
    master = ctx.createGain();
    master.gain.value = 0.8;
    master.connect(compressor).connect(ctx.destination);
  }
  return ctx;
}

export function getMaster(): GainNode {
  getAudioContext();
  return master!;
}

/** Deve ser chamado num gesto do usuário (clique) — exigência do iOS/Chrome. */
export async function unlockAudio(): Promise<AudioContext> {
  const c = getAudioContext();
  if (c.state === "suspended") await c.resume();
  return c;
}

export function setMasterVolume(v: number) {
  getMaster().gain.value = Math.max(0, Math.min(1.2, v));
}

interface VoiceOpts {
  freq: number;
  start: number;
  duration: number;
  gain: number;
  destination: AudioNode;
}

function envelope(g: GainNode, start: number, attack: number, peak: number, sustainLevel: number, decay: number, end: number, release: number) {
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), start + attack);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, sustainLevel), start + attack + decay);
  g.gain.setValueAtTime(Math.max(0.0002, sustainLevel), Math.max(start + attack + decay, end));
  g.gain.exponentialRampToValueAtTime(0.0001, Math.max(start + attack + decay, end) + release);
}

function piano(c: AudioContext, o: VoiceOpts): number {
  const g = c.createGain();
  g.connect(o.destination);
  const osc1 = c.createOscillator();
  osc1.type = "triangle";
  osc1.frequency.value = o.freq;
  const osc2 = c.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = o.freq * 2;
  const g2 = c.createGain();
  g2.gain.value = 0.18;
  osc1.connect(g);
  osc2.connect(g2).connect(g);
  const end = o.start + o.duration;
  g.gain.setValueAtTime(0.0001, o.start);
  g.gain.exponentialRampToValueAtTime(o.gain, o.start + 0.008);
  g.gain.exponentialRampToValueAtTime(o.gain * 0.35, o.start + 0.35);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, o.gain * 0.2), Math.max(o.start + 0.36, end));
  g.gain.exponentialRampToValueAtTime(0.0001, Math.max(o.start + 0.36, end) + 0.35);
  const stopAt = Math.max(o.start + 0.36, end) + 0.4;
  osc1.start(o.start);
  osc2.start(o.start);
  osc1.stop(stopAt);
  osc2.stop(stopAt);
  return stopAt;
}

function voice(c: AudioContext, o: VoiceOpts): number {
  const g = c.createGain();
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = Math.min(4000, 900 + o.freq * 2.2);
  filter.Q.value = 0.8;
  const formant = c.createBiquadFilter();
  formant.type = "peaking";
  formant.frequency.value = 900;
  formant.gain.value = 5;
  formant.Q.value = 1.2;
  filter.connect(formant).connect(g).connect(o.destination);
  const osc = c.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = o.freq;
  const lfo = c.createOscillator();
  lfo.frequency.value = 5.3;
  const lfoGain = c.createGain();
  lfoGain.gain.setValueAtTime(0, o.start);
  lfoGain.gain.linearRampToValueAtTime(o.freq * 0.004, o.start + Math.min(0.6, o.duration * 0.6));
  lfo.connect(lfoGain).connect(osc.frequency);
  osc.connect(filter);
  const end = o.start + o.duration;
  envelope(g, o.start, 0.06, o.gain * 0.55, o.gain * 0.45, 0.08, end - 0.06, 0.12);
  const stopAt = end + 0.15;
  osc.start(o.start);
  lfo.start(o.start);
  osc.stop(stopAt);
  lfo.stop(stopAt);
  return stopAt;
}

function organ(c: AudioContext, o: VoiceOpts): number {
  const g = c.createGain();
  g.connect(o.destination);
  const partials: [number, number][] = [
    [1, 1],
    [2, 0.35],
    [3, 0.15],
  ];
  const end = o.start + o.duration;
  envelope(g, o.start, 0.03, o.gain * 0.5, o.gain * 0.45, 0.05, end - 0.05, 0.09);
  const stopAt = end + 0.12;
  for (const [mult, amp] of partials) {
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = o.freq * mult;
    const pg = c.createGain();
    pg.gain.value = amp;
    osc.connect(pg).connect(g);
    osc.start(o.start);
    osc.stop(stopAt);
  }
  return stopAt;
}

function click(c: AudioContext, o: VoiceOpts): number {
  const g = c.createGain();
  g.connect(o.destination);
  const osc = c.createOscillator();
  osc.type = "square";
  osc.frequency.value = o.freq;
  osc.connect(g);
  g.gain.setValueAtTime(0.0001, o.start);
  g.gain.exponentialRampToValueAtTime(o.gain * 0.5, o.start + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, o.start + 0.05);
  osc.start(o.start);
  osc.stop(o.start + 0.06);
  return o.start + 0.06;
}

const SYNTHS: Record<Instrument, (c: AudioContext, o: VoiceOpts) => number> = { piano, voz: voice, orgao: organ, clique: click };

/** Agenda uma nota. `when` em segundos do relógio do AudioContext. */
export function scheduleNote(
  midi: number,
  when: number,
  duration: number,
  opts: { instrument?: Instrument; gain?: number; cents?: number; destination?: AudioNode } = {},
): number {
  const c = getAudioContext();
  const freq = midiToFrequency(midi) * Math.pow(2, (opts.cents ?? 0) / 1200);
  return SYNTHS[opts.instrument ?? "piano"](c, {
    freq,
    start: Math.max(when, c.currentTime + 0.005),
    duration: Math.max(0.03, duration),
    gain: Math.max(0.0005, opts.gain ?? 0.6),
    destination: opts.destination ?? getMaster(),
  });
}

export interface PlaybackHandle {
  stop: () => void;
  /** segundos (relógio do contexto) em que o trecho termina */
  endsAt: number;
  startedAt: number;
  done: Promise<void>;
}

/**
 * Toca uma lista de eventos. `speed` < 1 deixa mais lento (0.5 = metade da velocidade).
 */
export async function playEvents(
  events: NoteEvent[],
  opts: { instrument?: Instrument; speed?: number; gain?: number; transpose?: number; offset?: number } = {},
): Promise<PlaybackHandle> {
  const c = await unlockAudio();
  const speed = opts.speed ?? 1;
  const bus = c.createGain();
  bus.gain.value = opts.gain ?? 1;
  bus.connect(getMaster());
  const t0 = c.currentTime + 0.06 + (opts.offset ?? 0);
  let endsAt = t0;
  for (const e of events) {
    const end = scheduleNote(e.midi + (opts.transpose ?? 0), t0 + e.start / speed, e.duration / speed, {
      instrument: e.instrument ?? opts.instrument ?? "piano",
      gain: (e.gain ?? 0.6) * 1,
      cents: e.cents,
      destination: bus,
    });
    endsAt = Math.max(endsAt, end);
  }
  let resolveDone: () => void = () => {};
  const done = new Promise<void>((r) => (resolveDone = r));
  const timer = window.setTimeout(() => resolveDone(), Math.max(0, (endsAt - c.currentTime) * 1000));
  return {
    startedAt: t0,
    endsAt,
    done,
    stop: () => {
      window.clearTimeout(timer);
      const now = c.currentTime;
      bus.gain.cancelScheduledValues(now);
      bus.gain.setValueAtTime(bus.gain.value, now);
      bus.gain.linearRampToValueAtTime(0, now + 0.04);
      window.setTimeout(() => bus.disconnect(), 120);
      resolveDone();
    },
  };
}

export async function playMidi(midi: number | number[], opts: { duration?: number; instrument?: Instrument; arpeggio?: boolean } = {}) {
  const notes = Array.isArray(midi) ? midi : [midi];
  const dur = opts.duration ?? 1;
  const events: NoteEvent[] = notes.map((m, i) => ({
    midi: m,
    start: opts.arpeggio ? i * (dur * 0.55) : 0,
    duration: dur,
    gain: 0.65 / Math.sqrt(opts.arpeggio ? 1 : notes.length),
  }));
  return playEvents(events, { instrument: opts.instrument });
}
