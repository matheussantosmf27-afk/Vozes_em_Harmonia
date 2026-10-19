/**
 * Sugestão de classificação vocal PROVISÓRIA a partir da região confortável.
 *
 * Limitações declaradas: a classificação real depende de timbre, passagens de
 * registro, qualidade técnica e escuta de um profissional. Esta função só
 * indica uma hipótese inicial para orientar o estudo e a prática em conjunto.
 */
import { noteName } from "@/lib/music/notes";

export type VoiceClass = "soprano" | "mezzo_soprano" | "contralto" | "tenor" | "baritono" | "baixo" | "nao_classificada";
export type VoiceGroup = "feminina" | "masculina" | "nao_informado";
export type Region = "grave" | "media" | "aguda";

export const VOICE_LABELS: Record<VoiceClass, string> = {
  soprano: "Soprano",
  mezzo_soprano: "Mezzo-soprano",
  contralto: "Contralto",
  tenor: "Tenor",
  baritono: "Barítono",
  baixo: "Baixo",
  nao_classificada: "Ainda não classificada",
};

export const CLASSIFICATION_STATUS_LABELS = {
  provisoria: "Provisória",
  em_desenvolvimento: "Voz em desenvolvimento",
  confirmada: "Confirmada pelo professor",
} as const;

/** Faixas de referência (MIDI) usadas em coros amadores: tessitura típica. */
export const VOICE_REFERENCE: Record<Exclude<VoiceClass, "nao_classificada">, { group: VoiceGroup; range: [number, number]; tessitura: [number, number] }> = {
  soprano: { group: "feminina", range: [60, 81], tessitura: [64, 77] },
  mezzo_soprano: { group: "feminina", range: [57, 77], tessitura: [60, 74] },
  contralto: { group: "feminina", range: [53, 74], tessitura: [57, 69] },
  tenor: { group: "masculina", range: [48, 69], tessitura: [52, 66] },
  baritono: { group: "masculina", range: [45, 65], tessitura: [48, 62] },
  baixo: { group: "masculina", range: [40, 62], tessitura: [43, 57] },
};

export interface ClassificationInput {
  comfortableLow: number | null;
  comfortableHigh: number | null;
  rangeLow?: number | null;
  rangeHigh?: number | null;
  group: VoiceGroup;
}

export interface ClassificationSuggestion {
  classification: VoiceClass;
  alternatives: VoiceClass[];
  region: Region | null;
  confidence: "baixa" | "moderada";
  explanation: string;
}

function centre(low: number, high: number) {
  return (low + high) / 2;
}

/** Região confortável (independente do rótulo) para distribuir vozes no grupo. */
export function regionFor(comfortableLow: number, comfortableHigh: number): Region {
  const c = centre(comfortableLow, comfortableHigh);
  // Uma oitava separa vozes masculinas e femininas; a região considera a altura real.
  if (c < 54) return "grave";
  if (c < 62) return "media";
  return "aguda";
}

export const REGION_LABELS: Record<Region, string> = {
  grave: "Região grave",
  media: "Região média",
  aguda: "Região aguda",
};

export function suggestClassification(input: ClassificationInput): ClassificationSuggestion {
  const { comfortableLow, comfortableHigh, group } = input;
  if (comfortableLow == null || comfortableHigh == null || comfortableHigh - comfortableLow < 4) {
    return {
      classification: "nao_classificada",
      alternatives: [],
      region: comfortableLow != null && comfortableHigh != null ? regionFor(comfortableLow, comfortableHigh) : null,
      confidence: "baixa",
      explanation:
        "Ainda não há dados suficientes sobre a sua região confortável. Isso é normal no início: o professor pode avaliar sua voz com calma.",
    };
  }

  const c = centre(comfortableLow, comfortableHigh);
  const region = regionFor(comfortableLow, comfortableHigh);
  const candidates = (Object.entries(VOICE_REFERENCE) as [Exclude<VoiceClass, "nao_classificada">, (typeof VOICE_REFERENCE)["soprano"]][])
    .filter(([, ref]) => group === "nao_informado" || ref.group === group)
    .map(([voice, ref]) => ({ voice, distance: Math.abs(centre(...ref.tessitura) - c) }))
    .sort((a, b) => a.distance - b.distance);

  const span = `${noteName(comfortableLow)} a ${noteName(comfortableHigh)}`;
  if (group === "nao_informado") {
    return {
      classification: "nao_classificada",
      alternatives: candidates.slice(0, 2).map((x) => x.voice),
      region,
      confidence: "baixa",
      explanation: `Sua região confortável atual vai de ${span} (${REGION_LABELS[region].toLowerCase()}). Para sugerir uma categoria tradicional é preciso considerar o timbre e a registração — converse com o professor. Para cantar em conjunto, você já pode ser distribuído(a) pela região confortável.`,
    };
  }

  const [best, second] = candidates;
  const close = second && second.distance - best.distance < 1.5;
  return {
    classification: best.voice,
    alternatives: close ? [second.voice] : [],
    region,
    confidence: close ? "baixa" : "moderada",
    explanation:
      `Sua região confortável atual vai de ${span}. Ela se aproxima da tessitura típica de ${VOICE_LABELS[best.voice].toLowerCase()}` +
      (close ? `, mas também é compatível com ${VOICE_LABELS[second.voice].toLowerCase()}` : "") +
      ". Esta é uma classificação provisória: timbre, passagens de registro e a avaliação do professor podem mudá-la.",
  };
}
