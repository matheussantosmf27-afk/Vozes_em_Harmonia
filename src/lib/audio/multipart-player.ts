/**
 * Reprodutor de arranjos por voz com agendamento antecipado ("lookahead"):
 * volumes, andamento, transposição, metrônomo e repetição de trechos podem
 * mudar durante a reprodução.
 */
import type { PartNote } from "@/lib/music/notation";
import type { Instrument } from "@/lib/exercises/generators";
import { getAudioContext, getMaster, scheduleNote, unlockAudio } from "./engine";

export interface PlayerPart {
  id: string;
  notes: PartNote[];
}

interface PartState {
  part: PlayerPart;
  /** ganho da sessão de reprodução atual (recriado a cada play para cortar notas agendadas) */
  gain: GainNode | null;
  volume: number;
  muted: boolean;
  octave: number;
  instrument: Instrument;
}

const LOOKAHEAD_SEC = 0.12;
const TICK_MS = 25;

export class MultiPartPlayer {
  private parts = new Map<string, PartState>();
  private bpm: number;
  private transpose = 0;
  private metronome = false;
  private loop: { start: number; end: number } | null = null;
  private anchorTime = 0;
  private anchorBeat = 0;
  private cursorBeat = 0;
  private timer: number | null = null;
  private raf: number | null = null;
  private playing = false;
  private endBeat: number;
  private sessionBus: GainNode | null = null;
  onPosition?: (beat: number) => void;
  onEnd?: () => void;

  constructor(
    parts: PlayerPart[],
    tempo: number,
    private readonly beatsPerMeasure: number,
  ) {
    this.bpm = tempo;
    for (const p of parts) {
      this.parts.set(p.id, { part: p, gain: null, volume: 1, muted: false, octave: 0, instrument: "voz" });
    }
    this.endBeat = Math.max(0, ...parts.map((p) => p.notes.reduce((a, n) => Math.max(a, n.s + n.d), 0)));
  }

  get totalBeats() {
    return this.endBeat;
  }

  get isPlaying() {
    return this.playing;
  }

  get tempo() {
    return this.bpm;
  }

  private beatToTime(beat: number) {
    return this.anchorTime + ((beat - this.anchorBeat) * 60) / this.bpm;
  }

  currentBeat(): number {
    if (!this.playing) return this.cursorBeat;
    const c = getAudioContext();
    return this.anchorBeat + ((c.currentTime - this.anchorTime) * this.bpm) / 60;
  }

  setVolume(id: string, volume: number) {
    const s = this.parts.get(id);
    if (!s) return;
    s.volume = volume;
    this.applyGain(s);
  }

  setMuted(id: string, muted: boolean) {
    const s = this.parts.get(id);
    if (!s) return;
    s.muted = muted;
    this.applyGain(s);
  }

  setOctave(id: string, octave: number) {
    const s = this.parts.get(id);
    if (s) s.octave = octave;
  }

  setInstrument(id: string, instrument: Instrument) {
    const s = this.parts.get(id);
    if (s) s.instrument = instrument;
  }

  private applyGain(s: PartState) {
    if (!s.gain) return;
    const c = getAudioContext();
    s.gain.gain.cancelScheduledValues(c.currentTime);
    s.gain.gain.setTargetAtTime(s.muted ? 0 : s.volume, c.currentTime, 0.03);
  }

  private openSession() {
    const c = getAudioContext();
    this.sessionBus = c.createGain();
    this.sessionBus.connect(getMaster());
    for (const s of this.parts.values()) {
      s.gain = c.createGain();
      s.gain.gain.value = s.muted ? 0 : s.volume;
      s.gain.connect(this.sessionBus);
    }
  }

  setTempo(bpm: number) {
    const beat = this.currentBeat();
    this.bpm = Math.max(20, Math.min(240, bpm));
    if (this.playing) {
      this.anchorTime = getAudioContext().currentTime;
      this.anchorBeat = beat;
    }
  }

  setTranspose(semitones: number) {
    this.transpose = semitones;
  }

  setMetronome(on: boolean) {
    this.metronome = on;
  }

  /** Repete compassos (1 = primeiro compasso). null desliga. */
  setLoop(startMeasure: number | null, endMeasure?: number) {
    if (startMeasure === null) {
      this.loop = null;
      return;
    }
    const start = (startMeasure - 1) * this.beatsPerMeasure;
    const end = Math.min(this.endBeat, (endMeasure ?? startMeasure) * this.beatsPerMeasure);
    this.loop = end > start ? { start, end } : null;
  }

  async play(fromBeat?: number) {
    const c = await unlockAudio();
    this.stopScheduler();
    this.silence();
    this.openSession();
    const start = fromBeat ?? (this.cursorBeat >= this.endBeat ? 0 : this.cursorBeat);
    this.anchorTime = c.currentTime + 0.08;
    this.anchorBeat = start;
    this.cursorBeat = start;
    this.playing = true;
    // Notas já iniciadas antes do ponto de partida não são retomadas.
    this.timer = window.setInterval(() => this.tick(), TICK_MS);
    this.tick();
    const loopRaf = () => {
      if (!this.playing) return;
      this.onPosition?.(this.currentBeat());
      this.raf = requestAnimationFrame(loopRaf);
    };
    this.raf = requestAnimationFrame(loopRaf);
  }

  pause() {
    if (!this.playing) return;
    this.cursorBeat = this.currentBeat();
    this.playing = false;
    this.stopScheduler();
    this.silence();
  }

  stop() {
    this.playing = false;
    this.cursorBeat = 0;
    this.stopScheduler();
    this.silence();
    this.onPosition?.(0);
  }

  seek(beat: number) {
    const wasPlaying = this.playing;
    if (wasPlaying) this.pause();
    this.cursorBeat = Math.max(0, Math.min(this.endBeat, beat));
    this.onPosition?.(this.cursorBeat);
    if (wasPlaying) void this.play(this.cursorBeat);
  }

  dispose() {
    this.stop();
  }

  /** Corta todas as notas já agendadas (desliga o barramento da sessão). */
  private silence() {
    const old = this.sessionBus;
    if (!old) return;
    const c = getAudioContext();
    old.gain.setTargetAtTime(0, c.currentTime, 0.01);
    window.setTimeout(() => old.disconnect(), 120);
    this.sessionBus = null;
    for (const s of this.parts.values()) s.gain = null;
  }

  private stopScheduler() {
    if (this.timer !== null) window.clearInterval(this.timer);
    if (this.raf !== null) cancelAnimationFrame(this.raf);
    this.timer = null;
    this.raf = null;
  }

  private tick() {
    if (!this.playing) return;
    const c = getAudioContext();
    const horizon = c.currentTime + LOOKAHEAD_SEC;
    const loopEnd = this.loop?.end ?? this.endBeat;

    while (this.beatToTime(this.cursorBeat) < horizon) {
      const from = this.cursorBeat;
      const to = Math.min(loopEnd, from + 0.25);
      this.scheduleRange(from, to);
      this.cursorBeat = to;
      if (to >= loopEnd) {
        if (this.loop) {
          // Reancora no início do trecho repetido.
          const endTime = this.beatToTime(loopEnd);
          this.anchorTime = endTime;
          this.anchorBeat = this.loop.start;
          this.cursorBeat = this.loop.start;
        } else {
          const endTime = this.beatToTime(this.endBeat);
          window.setTimeout(() => {
            if (!this.playing) return;
            this.playing = false;
            this.cursorBeat = this.endBeat;
            this.stopScheduler();
            this.onPosition?.(this.endBeat);
            this.onEnd?.();
          }, Math.max(0, (endTime - c.currentTime) * 1000 + 200));
          window.clearInterval(this.timer!);
          this.timer = null;
          return;
        }
      }
    }
  }

  private scheduleRange(from: number, to: number) {
    const secPerBeat = 60 / this.bpm;
    for (const s of this.parts.values()) {
      if (!s.gain) continue;
      for (const n of s.part.notes) {
        if (n.p === null || n.s < from || n.s >= to) continue;
        scheduleNote(n.p + this.transpose + s.octave * 12, this.beatToTime(n.s), n.d * secPerBeat * 0.96, {
          instrument: s.instrument,
          gain: 0.5,
          destination: s.gain,
        });
      }
    }
    if (this.metronome) {
      for (let b = Math.ceil(from); b < to; b++) {
        if (b < from) continue;
        const accent = b % this.beatsPerMeasure === 0;
        scheduleNote(accent ? 96 : 89, this.beatToTime(b), 0.05, { instrument: "clique", gain: accent ? 0.5 : 0.3, destination: this.sessionBus ?? undefined });
      }
    }
  }
}
