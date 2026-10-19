import { describe, expect, it } from "vitest";
import { analyzeSustain, detectPitch, PitchTracker, type PitchFrame } from "./pitch-detection";
import { frequencyToMidi } from "./notes";

const SR = 44100;

function synth(f0: number, harmonics: number[], n = 2048, noise = 0, seed = 1): Float32Array {
  const buf = new Float32Array(n);
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647 - 0.5;
  };
  for (let i = 0; i < n; i++) {
    let v = 0;
    harmonics.forEach((amp, h) => {
      v += amp * Math.sin((2 * Math.PI * f0 * (h + 1) * i) / SR);
    });
    buf[i] = 0.3 * v + noise * rand();
  }
  return buf;
}

describe("detecção de altura (YIN)", () => {
  it("detecta senoides em toda a extensão vocal", () => {
    for (const f of [82.41, 110, 196, 261.63, 440, 698.46, 987.77]) {
      const r = detectPitch(synth(f, [1]), SR);
      expect(r.frequency).not.toBeNull();
      expect(Math.abs((frequencyToMidi(r.frequency!) - frequencyToMidi(f)) * 100)).toBeLessThan(5);
    }
  });

  it("não confunde harmônicos fortes com a fundamental", () => {
    // Voz masculina grave: 2º harmônico mais forte que a fundamental
    const r = detectPitch(synth(130.81, [0.4, 1, 0.7, 0.5, 0.3]), SR);
    expect(r.frequency).not.toBeNull();
    expect(Math.abs(frequencyToMidi(r.frequency!) - frequencyToMidi(130.81))).toBeLessThan(0.1);
  });

  it("ignora silêncio e ruído", () => {
    expect(detectPitch(new Float32Array(2048), SR).frequency).toBeNull();
    const noise = synth(0, [], 2048, 0.8, 7);
    const r = detectPitch(noise, SR);
    expect(r.frequency === null || r.clarity < 0.7).toBe(true);
  });

  it("suporta ruído moderado", () => {
    const r = detectPitch(synth(220, [1, 0.5, 0.25], 2048, 0.05), SR);
    expect(r.frequency).not.toBeNull();
    expect(Math.abs(frequencyToMidi(r.frequency!) - 57)).toBeLessThan(0.15);
  });
});

describe("rastreador e análise de nota sustentada", () => {
  it("corrige saltos isolados de oitava e indica confiança", () => {
    const t = new PitchTracker();
    const est = (f: number, clarity = 0.9) => ({ frequency: f, clarity, rms: 0.1 });
    t.push(est(220));
    t.push(est(220));
    t.push(est(220));
    const jump = t.push(est(440, 0.85));
    expect(jump.midi).toBeCloseTo(57, 0);
    expect(jump.confidence).toBe("confiavel");
    expect(t.push({ frequency: null, clarity: 0, rms: 0 }).confidence).toBe("sem_sinal");
  });

  const frames = (cents: (i: number) => number, count = 60, midi = 60): PitchFrame[] =>
    Array.from({ length: count }, (_, i) => ({ time: i * 50, midi: midi + cents(i) / 100, confidence: "confiavel" as const }));

  it("considera afinada uma nota estável próxima ao alvo", () => {
    const a = analyzeSustain(frames(() => 8), 60);
    expect(a.verdict).toBe("afinado");
    expect(a.stable).toBe(true);
    expect(a.score).toBeGreaterThan(0.9);
  });

  it("aponta tendência a cantar abaixo", () => {
    const a = analyzeSustain(frames(() => -70), 60);
    expect(a.verdict).toBe("abaixo");
    expect(a.score).toBeLessThan(0.3);
  });

  it("aceita a mesma nota em outra oitava (vozes masculinas e femininas)", () => {
    const a = analyzeSustain(frames(() => 0, 60, 48), 60);
    expect(a.octaveShift).toBe(-1);
    expect(a.verdict).toBe("afinado");
  });

  it("detecta instabilidade", () => {
    const a = analyzeSustain(frames((i) => (i % 2 ? 45 : -45)), 60);
    expect(a.stable).toBe(false);
  });

  it("informa ausência de sinal utilizável", () => {
    const a = analyzeSustain([{ time: 400, midi: null, confidence: "sem_sinal" }], 60);
    expect(a.status).toBe("sem_sinal");
  });
});
