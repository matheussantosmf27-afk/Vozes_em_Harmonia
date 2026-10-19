import { describe, expect, it } from "vitest";
import { centsFromMidi, frequencyToMidi, isBlackKey, midiToFrequency, noteName, parseNote, formatCents } from "./notes";
import { buildChord, buildScale, chordSymbol, harmonicField, intervalBySemitones, isConsonant, scaleFormula, voiceProgression } from "./theory";
import { gradeTaps, onsetTimesMs, parsePattern, patternLength } from "./rhythm";
import { createRng, shuffle } from "./random";

describe("notas", () => {
  it("converte MIDI e frequência", () => {
    expect(midiToFrequency(69)).toBeCloseTo(440);
    expect(midiToFrequency(60)).toBeCloseTo(261.626, 2);
    expect(frequencyToMidi(220)).toBeCloseTo(57);
    expect(centsFromMidi(445, 69)).toBeCloseTo(19.56, 1);
  });

  it("nomeia notas em português e em cifra", () => {
    expect(noteName(60)).toBe("Dó4");
    expect(noteName(61)).toBe("Dó♯4");
    expect(noteName(70, { preferFlats: true })).toBe("Si♭4");
    expect(noteName(43, { style: "cifra" })).toBe("G2");
    expect(isBlackKey(61)).toBe(true);
    expect(isBlackKey(64)).toBe(false);
  });

  it("lê nomes de notas", () => {
    expect(parseNote("C4")).toBe(60);
    expect(parseNote("Bb2")).toBe(46);
    expect(parseNote("Dó4")).toBe(60);
    expect(parseNote("Fá♯3")).toBe(54);
    expect(parseNote("sol5")).toBe(79);
    expect(parseNote("H9")).toBeNull();
  });

  it("formata cents com sinal", () => {
    expect(formatCents(12.4)).toBe("+12");
    expect(formatCents(-8)).toBe("−8");
    expect(formatCents(0.2)).toBe("0");
  });
});

describe("teoria", () => {
  it("identifica intervalos", () => {
    expect(intervalBySemitones(4).name).toBe("terça maior");
    expect(intervalBySemitones(-7).code).toBe("5J");
    expect(intervalBySemitones(16).name).toBe("terça maior composta");
    expect(isConsonant(3)).toBe(true);
    expect(isConsonant(6)).toBe(false);
    expect(isConsonant(12)).toBe(true);
  });

  it("forma acordes e inversões", () => {
    expect(buildChord(60, "maior")).toEqual([60, 64, 67]);
    expect(buildChord(60, "menor", 1)).toEqual([63, 67, 72]);
    expect(buildChord(60, "maior", 2)).toEqual([67, 72, 76]);
    expect(chordSymbol(9, "menor")).toBe("Am");
    expect(chordSymbol(11, "diminuto")).toBe("B°");
  });

  it("monta escalas e o campo harmônico", () => {
    expect(buildScale(60, "maior")).toEqual([60, 62, 64, 65, 67, 69, 71, 72]);
    expect(scaleFormula("maior")).toBe("T T S T T T S");
    expect(scaleFormula("menor_harmonica")).toBe("T S T T S T+S S");
    const field = harmonicField(7); // Sol maior
    expect(field.map((d) => chordSymbol(d.rootPc, d.quality))).toEqual(["G", "Am", "Bm", "C", "D", "Em", "F#°"]);
    expect(field[4].fn).toBe("dominante");
  });

  it("encadeia progressões com pouco movimento nas vozes superiores", () => {
    const chords = voiceProgression(60, [1, 4, 5, 1]);
    expect(chords).toHaveLength(4);
    for (const c of chords) expect(c).toHaveLength(4);
    // baixo com a fundamental de cada grau
    expect(chords.map((c) => ((c[0] % 12) + 12) % 12)).toEqual([0, 5, 7, 0]);
    // movimento total das vozes superiores entre acordes vizinhos é pequeno
    for (let i = 1; i < chords.length; i++) {
      const move = chords[i].slice(1).reduce((a, n, k) => a + Math.abs(n - chords[i - 1][k + 1]), 0);
      expect(move).toBeLessThanOrEqual(6);
    }
  });
});

describe("ritmo", () => {
  it("interpreta padrões", () => {
    expect(patternLength("q q h")).toBe(4);
    expect(parsePattern("q rq e e q").filter((e) => !e.rest)).toHaveLength(4);
    expect(onsetTimesMs("q e e h", 60)).toEqual([0, 1000, 1500, 2000]);
    expect(() => parsePattern("x")).toThrow();
  });

  it("corrige toques com tolerância e desloca a origem", () => {
    const expected = onsetTimesMs("q q e e q", 90);
    const perfect = expected.map((t) => t + 5000);
    expect(gradeTaps(expected, perfect).score).toBe(1);
    const sloppy = expected.map((t, i) => t + 5000 + (i % 2 ? 60 : -40));
    expect(gradeTaps(expected, sloppy).score).toBe(1);
    const missing = perfect.slice(0, 3);
    expect(gradeTaps(expected, missing).score).toBeCloseTo(3 / 5);
    const extra = [...perfect, perfect[4] + 300].sort((a, b) => a - b);
    expect(gradeTaps(expected, extra).score).toBeCloseTo(5 / 6);
    expect(gradeTaps(expected, []).score).toBe(0);
  });
});

describe("aleatoriedade reprodutível", () => {
  it("gera a mesma sequência com a mesma semente", () => {
    const a = createRng(42);
    const b = createRng(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
    expect(shuffle(createRng(1), [1, 2, 3, 4]).sort()).toEqual([1, 2, 3, 4]);
  });
});

import { transposeChordSymbol } from "@/components/theory/theory-explorer";
import { applyLyrics, parseVoice, partLength } from "./notation";

describe("notação e transposição de cifras", () => {
  it("lê linhas vocais e aplica letra com melismas", () => {
    const notes = applyLyrics(parseVoice("C4/1 D4/.5 E4/.5 | r/1 G4/1"), "Lou _ vor Deus");
    expect(partLength(notes)).toBe(4);
    expect(notes.map((n) => n.l)).toEqual(["Lou", undefined, "vor", undefined, "Deus"]);
    expect(() => applyLyrics(parseVoice("C4/1"), "a b")).toThrow();
  });

  it("transpõe cifras mantendo o tipo do acorde", () => {
    expect(transposeChordSymbol("Am7", 2, false)).toBe("Bm7");
    expect(transposeChordSymbol("D/F#", -2, false)).toBe("C/E");
    expect(transposeChordSymbol("Bb", 1, true)).toBe("B");
    expect(transposeChordSymbol("G", 3, true)).toBe("Bb");
  });
});
