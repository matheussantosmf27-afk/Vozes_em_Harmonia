/**
 * Estimativa da frequência fundamental (f0) pelo algoritmo YIN
 * (de Cheveigné & Kawahara, 2002), com:
 *  - porta de silêncio por RMS;
 *  - função de diferença normalizada cumulativa (evita confundir harmônicos
 *    com a fundamental, o erro mais comum em vozes);
 *  - interpolação parabólica para precisão abaixo de 1 amostra;
 *  - suavização por mediana e estados de confiança.
 *
 * A estimativa automática é um apoio ao estudo: não é diagnóstico vocal.
 */
import { centsFromMidi, frequencyToMidi } from "./notes";

export interface PitchEstimate {
  /** Frequência em Hz, ou null quando não há som com altura definida. */
  frequency: number | null;
  /** 0..1 — quão periódico é o sinal (1 = muito claro). */
  clarity: number;
  rms: number;
}

export interface DetectOptions {
  minFrequency?: number;
  maxFrequency?: number;
  threshold?: number;
  rmsThreshold?: number;
}

export function computeRms(buf: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
  return Math.sqrt(sum / buf.length);
}

export function detectPitch(buf: Float32Array, sampleRate: number, opts: DetectOptions = {}): PitchEstimate {
  const { minFrequency = 65, maxFrequency = 1100, threshold = 0.15, rmsThreshold = 0.01 } = opts;
  const rms = computeRms(buf);
  if (rms < rmsThreshold) return { frequency: null, clarity: 0, rms };

  const n = buf.length;
  const tauMin = Math.max(2, Math.floor(sampleRate / maxFrequency));
  const tauMax = Math.min(Math.floor(sampleRate / minFrequency), Math.floor(n / 2));
  if (tauMax <= tauMin + 2) return { frequency: null, clarity: 0, rms };
  const w = n - tauMax;

  // 1) Função de diferença
  const diff = new Float32Array(tauMax + 1);
  for (let tau = 1; tau <= tauMax; tau++) {
    let sum = 0;
    for (let j = 0; j < w; j++) {
      const d = buf[j] - buf[j + tau];
      sum += d * d;
    }
    diff[tau] = sum;
  }

  // 2) Diferença normalizada cumulativa (CMNDF)
  const cmnd = new Float32Array(tauMax + 1);
  cmnd[0] = 1;
  let running = 0;
  for (let tau = 1; tau <= tauMax; tau++) {
    running += diff[tau];
    cmnd[tau] = running > 0 ? (diff[tau] * tau) / running : 1;
  }

  // 3) Primeiro vale abaixo do limiar (seguido até o mínimo local)
  let tauEstimate = -1;
  for (let tau = tauMin; tau <= tauMax; tau++) {
    if (cmnd[tau] < threshold) {
      while (tau + 1 <= tauMax && cmnd[tau + 1] < cmnd[tau]) tau++;
      tauEstimate = tau;
      break;
    }
  }

  // Sem vale claro: usa o mínimo global apenas se ainda for razoavelmente periódico.
  if (tauEstimate === -1) {
    let minVal = Infinity;
    for (let tau = tauMin; tau <= tauMax; tau++) {
      if (cmnd[tau] < minVal) {
        minVal = cmnd[tau];
        tauEstimate = tau;
      }
    }
    if (minVal > 0.35) return { frequency: null, clarity: Math.max(0, 1 - minVal), rms };
  }

  // 4) Interpolação parabólica
  let betterTau = tauEstimate;
  if (tauEstimate > 1 && tauEstimate < tauMax) {
    const s0 = cmnd[tauEstimate - 1];
    const s1 = cmnd[tauEstimate];
    const s2 = cmnd[tauEstimate + 1];
    const denom = 2 * (2 * s1 - s2 - s0);
    if (denom !== 0) betterTau = tauEstimate + (s2 - s0) / denom;
  }

  const frequency = sampleRate / betterTau;
  if (frequency < minFrequency * 0.97 || frequency > maxFrequency * 1.03) {
    return { frequency: null, clarity: 0, rms };
  }
  return { frequency, clarity: Math.max(0, Math.min(1, 1 - cmnd[tauEstimate])), rms };
}

// ---------------------------------------------------------------------------
// Rastreamento contínuo com suavização e estados de confiança
// ---------------------------------------------------------------------------
export type DetectionConfidence = "confiavel" | "incerta" | "sem_sinal";

export interface TrackedPitch {
  frequency: number | null;
  midi: number | null;
  clarity: number;
  confidence: DetectionConfidence;
}

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export class PitchTracker {
  private history: { midi: number; clarity: number }[] = [];
  private silentFrames = 0;

  constructor(
    private readonly windowSize = 5,
    private readonly minClarity = 0.8,
  ) {}

  reset(): void {
    this.history = [];
    this.silentFrames = 0;
  }

  push(estimate: PitchEstimate): TrackedPitch {
    if (estimate.frequency === null || estimate.clarity < 0.5) {
      this.silentFrames++;
      if (this.silentFrames >= 3) this.history = [];
      return { frequency: null, midi: null, clarity: estimate.clarity, confidence: "sem_sinal" };
    }
    this.silentFrames = 0;
    let midi = frequencyToMidi(estimate.frequency);

    // Correção de saltos de oitava isolados (erro típico de estimadores).
    if (this.history.length >= 3) {
      const ref = median(this.history.map((h) => h.midi));
      const delta = midi - ref;
      if (Math.abs(Math.abs(delta) - 12) < 0.6 && estimate.clarity < 0.95) {
        midi -= Math.sign(delta) * 12;
      }
    }

    this.history.push({ midi, clarity: estimate.clarity });
    if (this.history.length > this.windowSize) this.history.shift();

    const smoothed = median(this.history.map((h) => h.midi));
    const spread = Math.max(...this.history.map((h) => Math.abs(h.midi - smoothed)));
    const avgClarity = this.history.reduce((a, h) => a + h.clarity, 0) / this.history.length;
    const confidence: DetectionConfidence =
      this.history.length >= 3 && avgClarity >= this.minClarity && spread <= 0.5 ? "confiavel" : "incerta";

    return {
      frequency: 440 * Math.pow(2, (smoothed - 69) / 12),
      midi: smoothed,
      clarity: avgClarity,
      confidence,
    };
  }
}

// ---------------------------------------------------------------------------
// Análise de nota sustentada
// ---------------------------------------------------------------------------
export interface PitchFrame {
  /** ms desde o início da captação */
  time: number;
  midi: number | null;
  confidence: DetectionConfidence;
}

export interface SustainAnalysis {
  status: "ok" | "incerta" | "sem_sinal";
  meanCents: number | null;
  stdCents: number | null;
  inTuneRatio: number;
  voicedRatio: number;
  octaveShift: number;
  stable: boolean;
  score: number;
  verdict: "afinado" | "levemente_acima" | "levemente_abaixo" | "acima" | "abaixo" | "indefinido";
}

export function analyzeSustain(
  frames: PitchFrame[],
  targetMidi: number,
  opts: { ignoreFirstMs?: number; toleranceCents?: number; allowOctave?: boolean } = {},
): SustainAnalysis {
  const { ignoreFirstMs = 300, toleranceCents = 25, allowOctave = true } = opts;
  const relevant = frames.filter((f) => f.time >= ignoreFirstMs);
  const voiced = relevant.filter((f) => f.midi !== null && f.confidence !== "sem_sinal") as (PitchFrame & { midi: number })[];
  const reliable = voiced.filter((f) => f.confidence === "confiavel");
  const voicedRatio = relevant.length ? voiced.length / relevant.length : 0;

  const empty: SustainAnalysis = {
    status: "sem_sinal",
    meanCents: null,
    stdCents: null,
    inTuneRatio: 0,
    voicedRatio,
    octaveShift: 0,
    stable: false,
    score: 0,
    verdict: "indefinido",
  };
  if (voiced.length < 5) return empty;

  const source = reliable.length >= Math.max(5, voiced.length * 0.5) ? reliable : voiced;
  const med = median(source.map((f) => f.midi));
  const octaveShift = allowOctave ? Math.round((med - targetMidi) / 12) : 0;
  const cents = source.map((f) => (f.midi - targetMidi - octaveShift * 12) * 100);
  const mean = cents.reduce((a, c) => a + c, 0) / cents.length;
  const std = Math.sqrt(cents.reduce((a, c) => a + (c - mean) ** 2, 0) / cents.length);
  const inTuneRatio = cents.filter((c) => Math.abs(c) <= toleranceCents).length / cents.length;
  const stable = std <= 20 && voicedRatio >= 0.6;

  let verdict: SustainAnalysis["verdict"];
  if (Math.abs(mean) <= toleranceCents) verdict = "afinado";
  else if (mean > 0) verdict = mean <= 50 ? "levemente_acima" : "acima";
  else verdict = mean >= -50 ? "levemente_abaixo" : "abaixo";

  const score = Math.max(0, Math.min(1, 0.7 * inTuneRatio + 0.3 * Math.max(0, 1 - Math.abs(mean) / 100)));
  const status = reliable.length >= 5 && voicedRatio >= 0.5 ? "ok" : "incerta";

  return { status, meanCents: mean, stdCents: std, inTuneRatio, voicedRatio, octaveShift, stable, score, verdict };
}

/** Diferença em cents de uma frequência para a nota-alvo, desconsiderando oitavas. */
export function centsToNearestOctave(frequency: number, targetMidi: number): number {
  const c = centsFromMidi(frequency, targetMidi);
  return c - Math.round(c / 1200) * 1200;
}
