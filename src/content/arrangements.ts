/**
 * Arranjos de treino da plataforma.
 * Melodias em domínio público; harmonizações, exercícios e textos originais
 * escritos para o Vozes em Harmonia (livres para uso no ministério).
 */
import type { VoiceClass } from "@/lib/pedagogy/classification";

export interface PartDef {
  name: string;
  short: string;
  notes: string;
  lyrics?: string;
  voices: VoiceClass[];
}

export interface ArrangementDef {
  slug: string;
  repertoire: RepertoireKey;
  title: string;
  formation: string;
  harmonyLevel: 1 | 2 | 3 | 4 | 5;
  keyName: string;
  tempo: number;
  beatsPerMeasure: number;
  description: string;
  studyTips: string;
  parts: PartDef[];
}

export type RepertoireKey = "hino-alegria" | "que-grande-amor" | "canone-solfejo" | "caderno-exercicios";

export interface RepertoireDef {
  key: RepertoireKey;
  title: string;
  composer: string;
  lyricist: string;
  source: string;
  copyright: string;
  license: "dominio_publico" | "material_original_plataforma";
  originalKey: string;
  groupKey: string;
  tempo: number;
  timeSignature: string;
  lyrics: string | null;
  chords: string | null;
  difficulty: number;
  categories: string[];
  formation: string;
  voicesRequired: number;
  notes: string;
}

const FEM: VoiceClass[] = ["soprano", "mezzo_soprano", "contralto"];
const MASC: VoiceClass[] = ["tenor", "baritono", "baixo"];

// ---------------------------------------------------------------------------
// Hino da Alegria (melodia: Beethoven, Sinfonia nº 9 — domínio público)
// Texto original: “Uma só voz”
// ---------------------------------------------------------------------------
const ALEGRIA_TEXTO =
  "Can te mos com a le gri a nos sa voz em har mo nia U ma só voz um só can to a Deus to da gló ri a";

const ALEGRIA_S =
  "E4/1 E4/1 F4/1 G4/1 | G4/1 F4/1 E4/1 D4/1 | C4/1 C4/1 D4/1 E4/1 | E4/1.5 D4/.5 D4/2 | " +
  "E4/1 E4/1 F4/1 G4/1 | G4/1 F4/1 E4/1 D4/1 | C4/1 C4/1 D4/1 E4/1 | D4/1.5 C4/.5 C4/2";
const ALEGRIA_A =
  "C4/1 C4/1 C4/1 E4/1 | D4/1 D4/1 C4/1 B3/1 | G3/1 A3/1 B3/1 C4/1 | C4/1.5 C4/.5 B3/2 | " +
  "C4/1 C4/1 C4/1 E4/1 | D4/1 D4/1 C4/1 B3/1 | G3/1 A3/1 A3/1 C4/1 | B3/1.5 B3/.5 G3/2";
const ALEGRIA_T =
  "G3/1 G3/1 A3/1 C4/1 | B3/1 B3/1 G3/1 G3/1 | E3/1 E3/1 G3/1 G3/1 | G3/1.5 G3/.5 G3/2 | " +
  "G3/1 G3/1 A3/1 C4/1 | B3/1 B3/1 G3/1 G3/1 | E3/1 E3/1 F3/1 G3/1 | G3/1.5 G3/.5 E3/2";
const ALEGRIA_B =
  "C3/1 C3/1 F3/1 C3/1 | G3/1 G3/1 C3/1 G2/1 | C3/1 A2/1 G2/1 C3/1 | C3/1.5 C3/.5 G2/2 | " +
  "C3/1 C3/1 F3/1 C3/1 | G3/1 G3/1 C3/1 G2/1 | C3/1 A2/1 D3/1 G2/1 | G2/1.5 G2/.5 C3/2";
const ALEGRIA_2V =
  "C4/1 C4/1 D4/1 E4/1 | E4/1 D4/1 C4/1 B3/1 | A3/1 A3/1 B3/1 C4/1 | C4/1.5 B3/.5 B3/2 | " +
  "C4/1 C4/1 D4/1 E4/1 | E4/1 D4/1 C4/1 B3/1 | A3/1 A3/1 B3/1 C4/1 | B3/1.5 C4/.5 C4/2";
const ALEGRIA_OITAVA_ABAIXO =
  "E3/1 E3/1 F3/1 G3/1 | G3/1 F3/1 E3/1 D3/1 | C3/1 C3/1 D3/1 E3/1 | E3/1.5 D3/.5 D3/2 | " +
  "E3/1 E3/1 F3/1 G3/1 | G3/1 F3/1 E3/1 D3/1 | C3/1 C3/1 D3/1 E3/1 | D3/1.5 C3/.5 C3/2";
const ALEGRIA_DESCANTE =
  "G4/2 A4/1 C5/1 | B4/2 C5/1 B4/1 | C5/2 B4/1 C5/1 | G4/2 G4/2 | " +
  "C5/2 C5/1 E5/1 | D5/2 C5/1 B4/1 | C5/1 E5/1 F5/1 E5/1 | D5/2 E5/2";
const ALEGRIA_PEDAL = "C3/4 | C3/4 | C3/4 | C3/2 G2/2 | C3/4 | C3/4 | C3/2 D3/1 G2/1 | G2/2 C3/2";

// ---------------------------------------------------------------------------
// “Que grande amor” (melodia NEW BRITAIN, tradicional, 1829 — domínio público)
// Texto original. Quarteto masculino (alturas reais).
// ---------------------------------------------------------------------------
const AMOR_TEXTO_MELODIA =
  "Que gran de~a _ mor que do ce paz o Pai do _ céu nos deu Em tre vas _ eu vi vi a só e~a su a _ luz me~a chou";
const AMOR_TEXTO =
  "Que gran de~a mor que do ce paz o Pai do céu nos deu Em tre vas eu vi vi a só e~a su a luz me~a chou";
const AMOR_T1 =
  "r/2 G3/1 | B3/2 D4/1 | D4/2 C4/1 | C4/2 C4/1 | B3/2 B3/1 | B3/2 D4/1 | D4/2 D4/1 | F#4/5 G4/1 | " +
  "G4/2 D4/1 | D4/2 C4/1 | C4/2 C4/1 | B3/2 B3/1 | B3/2 D4/1 | D4/2 C4/1 | B3/3";
const AMOR_T2 =
  "r/2 D3/1 | G3/2 B3/.5 G3/.5 | B3/2 A3/1 | G3/2 E3/1 | D3/2 D3/1 | G3/2 B3/.5 G3/.5 | B3/2 A3/1 | D4/5 B3/1 | " +
  "D4/2 B3/.5 G3/.5 | B3/2 A3/1 | G3/2 E3/1 | D3/2 D3/1 | G3/2 B3/.5 G3/.5 | B3/2 A3/1 | G3/3";
const AMOR_BAR =
  "r/2 B2/1 | D3/2 D3/1 | G3/2 E3/1 | E3/2 G3/1 | G3/2 G3/1 | D3/2 D3/1 | G3/2 F#3/1 | A3/5 G3/1 | " +
  "B3/2 G3/1 | G3/2 E3/1 | E3/2 G3/1 | G3/2 G3/1 | D3/2 D3/1 | G3/2 F#3/1 | D3/3";
const AMOR_B =
  "r/2 G2/1 | G2/2 G2/1 | G2/2 A2/1 | C3/2 C3/1 | G2/2 G2/1 | G2/2 G2/1 | G2/2 D3/1 | D3/5 G2/1 | " +
  "G2/2 G2/1 | G2/2 A2/1 | C3/2 C3/1 | G2/2 G2/1 | G2/2 G2/1 | D3/2 D3/1 | G2/3";

// ---------------------------------------------------------------------------
// Cânone do solfejo (melodia tradicional FRÈRE JACQUES — domínio público)
// ---------------------------------------------------------------------------
const CANONE_MELODIA =
  "C4/1 D4/1 E4/1 C4/1 | C4/1 D4/1 E4/1 C4/1 | E4/1 F4/1 G4/2 | E4/1 F4/1 G4/2 | " +
  "G4/.5 A4/.5 G4/.5 F4/.5 E4/1 C4/1 | G4/.5 A4/.5 G4/.5 F4/.5 E4/1 C4/1 | C4/1 G3/1 C4/2 | C4/1 G3/1 C4/2";
const CANONE_SOLFEJO =
  "dó ré mi dó dó ré mi dó mi fá sol mi fá sol sol lá sol fá mi dó sol lá sol fá mi dó dó sol dó dó sol dó";
const oitavaAbaixo = (src: string) =>
  src.replace(/([A-G]#?)(\d)\//g, (_, n: string, o: string) => `${n}${Number(o) - 1}/`);
const canoneVoz = (entradaCompassos: number, grave: boolean) => {
  const base = `${CANONE_MELODIA} | ${CANONE_MELODIA}`;
  const linha = grave ? oitavaAbaixo(base) : base;
  const antes = entradaCompassos > 0 ? `r/${entradaCompassos * 4} | ` : "";
  const depois = entradaCompassos < 6 ? ` | r/${(6 - entradaCompassos) * 4}` : "";
  return `${antes}${linha}${depois}`;
};

export const REPERTOIRE: RepertoireDef[] = [
  {
    key: "hino-alegria",
    title: "Uma só voz (Hino da Alegria)",
    composer: "Ludwig van Beethoven (melodia, Sinfonia nº 9, 1824)",
    lyricist: "Texto original — Vozes em Harmonia",
    source: "Material de treino da plataforma",
    copyright:
      "Melodia em domínio público. Harmonizações, contracanto e texto originais da plataforma Vozes em Harmonia, livres para uso no ministério.",
    license: "material_original_plataforma",
    originalKey: "Ré maior",
    groupKey: "Dó maior",
    tempo: 96,
    timeSignature: "4/4",
    lyrics:
      "Cantemos com alegria,\nnossa voz em harmonia;\numa só voz, um só canto:\na Deus toda glória!",
    chords: "C C F C | G G7 C G | C Am G C | C G | C C F C | G G7 C G | C Am Dm C/G | G C",
    difficulty: 2,
    categories: ["coral", "culto", "louvor_congregacional"],
    formation: "satb",
    voicesRequired: 4,
    notes: "Usado na escola de harmonia: uníssono, duas vozes, três vozes, SATB e contracanto com pedal.",
  },
  {
    key: "que-grande-amor",
    title: "Que grande amor (NEW BRITAIN)",
    composer: "Melodia tradicional norte-americana (NEW BRITAIN, 1829)",
    lyricist: "Texto original — Vozes em Harmonia",
    source: "Material de treino da plataforma",
    copyright: "Melodia em domínio público. Arranjo para quarteto masculino e texto originais da plataforma, livres para uso no ministério.",
    license: "material_original_plataforma",
    originalKey: "Sol maior",
    groupKey: "Sol maior",
    tempo: 76,
    timeSignature: "3/4",
    lyrics: "Que grande amor, que doce paz\no Pai do céu nos deu;\nem trevas eu vivia só,\ne a sua luz me achou.",
    chords: "G | G | G Am | C | G | G | G D | D | G | G | G Am | C | G | G/D D7 | G",
    difficulty: 3,
    categories: ["quarteto", "culto"],
    formation: "quarteto_masculino",
    voicesRequired: 4,
    notes: "Melodia no segundo tenor (lead). Atenção aos cruzamentos do barítono nos compassos 3 e 4.",
  },
  {
    key: "canone-solfejo",
    title: "Cânone do solfejo (FRÈRE JACQUES)",
    composer: "Melodia tradicional francesa",
    lyricist: "Sílabas de solfejo",
    source: "Material de treino da plataforma",
    copyright: "Melodia tradicional em domínio público.",
    license: "dominio_publico",
    originalKey: "Dó maior",
    groupKey: "Dó maior",
    tempo: 100,
    timeSignature: "4/4",
    lyrics: "Dó ré mi dó, dó ré mi dó,\nmi fá sol, mi fá sol,\nsol lá sol fá mi dó, sol lá sol fá mi dó,\ndó sol dó, dó sol dó.",
    chords: null,
    difficulty: 2,
    categories: ["coral", "pequeno_grupo"],
    formation: "livre",
    voicesRequired: 4,
    notes: "Cânone a quatro vozes com entradas a cada dois compassos. Excelente para independência e entradas.",
  },
  {
    key: "caderno-exercicios",
    title: "Caderno de exercícios de harmonia vocal",
    composer: "Vozes em Harmonia",
    lyricist: "Sílabas de solfejo e vogais",
    source: "Material de treino da plataforma",
    copyright: "Exercícios originais da plataforma, livres para uso no ministério.",
    license: "material_original_plataforma",
    originalKey: "Dó maior",
    groupKey: "Dó maior",
    tempo: 72,
    timeSignature: "4/4",
    lyrics: null,
    chords: null,
    difficulty: 1,
    categories: ["coral", "pequeno_grupo", "quarteto"],
    formation: "livre",
    voicesRequired: 2,
    notes: "Exercícios curtos: terças e sextas paralelas, movimento contrário, pedal, tríades e acordes sustentados.",
  },
];

export const ARRANGEMENTS: ArrangementDef[] = [
  {
    slug: "hino-alegria-unissono",
    repertoire: "hino-alegria",
    title: "Uníssono (melodia em oitavas)",
    formation: "unissono",
    harmonyLevel: 1,
    keyName: "Dó maior",
    tempo: 96,
    beatsPerMeasure: 4,
    description: "Todos cantam a melodia. As vozes graves cantam uma oitava abaixo.",
    studyTips: "Respire no fim do compasso 4. Finalize a última nota exatamente no tempo 4 do compasso 8.",
    parts: [
      { name: "Melodia (vozes agudas)", short: "Mel", notes: ALEGRIA_S, lyrics: ALEGRIA_TEXTO, voices: FEM },
      { name: "Melodia (vozes graves, 8ª abaixo)", short: "Mel 8vb", notes: ALEGRIA_OITAVA_ABAIXO, lyrics: ALEGRIA_TEXTO, voices: MASC },
    ],
  },
  {
    slug: "hino-alegria-duas-vozes",
    repertoire: "hino-alegria",
    title: "Duas vozes (terças)",
    formation: "duas_vozes",
    harmonyLevel: 2,
    keyName: "Dó maior",
    tempo: 92,
    beatsPerMeasure: 4,
    description: "A segunda voz caminha uma terça abaixo da melodia e termina em uníssono.",
    studyTips: "No compasso 8, a segunda voz sobe de Si para Dó encontrando a melodia: ouça o uníssono final.",
    parts: [
      { name: "Voz 1 (melodia)", short: "V1", notes: ALEGRIA_S, lyrics: ALEGRIA_TEXTO, voices: ["soprano", "mezzo_soprano", "tenor"] },
      { name: "Voz 2 (terças)", short: "V2", notes: ALEGRIA_2V, lyrics: ALEGRIA_TEXTO, voices: ["contralto", "mezzo_soprano", "baritono"] },
    ],
  },
  {
    slug: "hino-alegria-tres-vozes",
    repertoire: "hino-alegria",
    title: "Três vozes (S – C – voz grave)",
    formation: "tres_vozes",
    harmonyLevel: 3,
    keyName: "Dó maior",
    tempo: 92,
    beatsPerMeasure: 4,
    description: "Melodia, voz intermediária e baixo formando as tríades.",
    studyTips: "A voz intermediária repete Dó nos compassos 1 e 5: use essas notas como âncora.",
    parts: [
      { name: "Soprano (melodia)", short: "S", notes: ALEGRIA_S, lyrics: ALEGRIA_TEXTO, voices: ["soprano", "mezzo_soprano"] },
      { name: "Contralto", short: "C", notes: ALEGRIA_A, lyrics: ALEGRIA_TEXTO, voices: ["contralto", "mezzo_soprano"] },
      { name: "Voz grave (barítono/baixo)", short: "B", notes: ALEGRIA_B, lyrics: ALEGRIA_TEXTO, voices: ["baritono", "baixo", "tenor"] },
    ],
  },
  {
    slug: "hino-alegria-satb",
    repertoire: "hino-alegria",
    title: "Quatro vozes (SATB)",
    formation: "satb",
    harmonyLevel: 4,
    keyName: "Dó maior",
    tempo: 92,
    beatsPerMeasure: 4,
    description: "Harmonização a quatro vozes com dominante com sétima e cadência final V – I.",
    studyTips:
      "Tenores: no compasso 2, o Si desce para Sol (nota interna) em vez de subir para Dó. Baixos: nos compassos 2 e 6 há salto de Sol3 para Dó3 — prepare a nota com antecedência.",
    parts: [
      { name: "Soprano", short: "S", notes: ALEGRIA_S, lyrics: ALEGRIA_TEXTO, voices: ["soprano", "mezzo_soprano"] },
      { name: "Contralto", short: "C", notes: ALEGRIA_A, lyrics: ALEGRIA_TEXTO, voices: ["contralto", "mezzo_soprano"] },
      { name: "Tenor", short: "T", notes: ALEGRIA_T, lyrics: ALEGRIA_TEXTO, voices: ["tenor", "baritono"] },
      { name: "Baixo", short: "B", notes: ALEGRIA_B, lyrics: ALEGRIA_TEXTO, voices: ["baixo", "baritono"] },
    ],
  },
  {
    slug: "hino-alegria-contracanto",
    repertoire: "hino-alegria",
    title: "Contracanto e pedal",
    formation: "tres_vozes",
    harmonyLevel: 5,
    keyName: "Dó maior",
    tempo: 92,
    beatsPerMeasure: 4,
    description: "Contracanto agudo em “a”, melodia com o texto e pedal grave em “hm” (boca fechada).",
    studyTips: "O pedal sustenta Dó nos compassos 1 a 3 enquanto a harmonia muda acima. O contracanto é mais suave que a melodia.",
    parts: [
      { name: "Contracanto (sopranos)", short: "Cc", notes: ALEGRIA_DESCANTE, voices: ["soprano"] },
      { name: "Melodia (contraltos e tenores)", short: "Mel", notes: ALEGRIA_S, lyrics: ALEGRIA_TEXTO, voices: ["contralto", "mezzo_soprano", "tenor"] },
      { name: "Pedal (baixos e barítonos)", short: "Ped", notes: ALEGRIA_PEDAL, voices: ["baixo", "baritono"] },
    ],
  },
  {
    slug: "que-grande-amor-ttbb",
    repertoire: "que-grande-amor",
    title: "Quarteto masculino (TTBB)",
    formation: "quarteto_masculino",
    harmonyLevel: 4,
    keyName: "Sol maior",
    tempo: 76,
    beatsPerMeasure: 3,
    description: "Melodia no 2º tenor; 1º tenor acima; barítono completa o acorde (e às vezes cruza a melodia); baixo na fundamental.",
    studyTips: "Compasso 4: o barítono canta acima da melodia (cruzamento). Compassos 8–9: “deu” dura 5 tempos — mantenha o apoio do ar.",
    parts: [
      { name: "1º tenor", short: "T1", notes: AMOR_T1, lyrics: AMOR_TEXTO, voices: ["tenor"] },
      { name: "2º tenor (melodia)", short: "T2", notes: AMOR_T2, lyrics: AMOR_TEXTO_MELODIA, voices: ["tenor", "baritono"] },
      { name: "Barítono", short: "Bar", notes: AMOR_BAR, lyrics: AMOR_TEXTO, voices: ["baritono"] },
      { name: "Baixo", short: "B", notes: AMOR_B, lyrics: AMOR_TEXTO, voices: ["baixo"] },
    ],
  },
  {
    slug: "canone-solfejo",
    repertoire: "canone-solfejo",
    title: "Cânone a quatro vozes",
    formation: "livre",
    harmonyLevel: 3,
    keyName: "Dó maior",
    tempo: 100,
    beatsPerMeasure: 4,
    description: "Cada voz canta a melodia duas vezes, entrando a cada dois compassos. Vozes 3 e 4 uma oitava abaixo.",
    studyTips: "Conte os compassos de pausa antes da sua entrada. Quando todas as vozes soam, ouça a voz que entrou antes de você.",
    parts: [
      { name: "Voz 1", short: "V1", notes: canoneVoz(0, false), lyrics: `${CANONE_SOLFEJO} ${CANONE_SOLFEJO}`, voices: FEM },
      { name: "Voz 2", short: "V2", notes: canoneVoz(2, false), lyrics: `${CANONE_SOLFEJO} ${CANONE_SOLFEJO}`, voices: FEM },
      { name: "Voz 3 (8ª abaixo)", short: "V3", notes: canoneVoz(4, true), lyrics: `${CANONE_SOLFEJO} ${CANONE_SOLFEJO}`, voices: MASC },
      { name: "Voz 4 (8ª abaixo)", short: "V4", notes: canoneVoz(6, true), lyrics: `${CANONE_SOLFEJO} ${CANONE_SOLFEJO}`, voices: MASC },
    ],
  },
  {
    slug: "tercas-paralelas",
    repertoire: "caderno-exercicios",
    title: "Terças paralelas",
    formation: "duas_vozes",
    harmonyLevel: 2,
    keyName: "Dó maior",
    tempo: 72,
    beatsPerMeasure: 4,
    description: "A voz 2 canta uma terça abaixo da voz 1 o tempo todo.",
    studyTips: "As terças alternam entre maiores e menores conforme a escala. Termine afinando a terça final Mi–Dó.",
    parts: [
      { name: "Voz 1", short: "V1", notes: "E4/1 F4/1 G4/1 A4/1 | G4/1 F4/1 E4/1 D4/1 | E4/4", lyrics: "mi fá sol lá sol fá mi ré mi", voices: ["soprano", "mezzo_soprano", "tenor"] },
      { name: "Voz 2", short: "V2", notes: "C4/1 D4/1 E4/1 F4/1 | E4/1 D4/1 C4/1 B3/1 | C4/4", lyrics: "dó ré mi fá mi ré dó si dó", voices: ["contralto", "mezzo_soprano", "baritono"] },
    ],
  },
  {
    slug: "sextas-paralelas",
    repertoire: "caderno-exercicios",
    title: "Sextas paralelas",
    formation: "duas_vozes",
    harmonyLevel: 2,
    keyName: "Dó maior",
    tempo: 72,
    beatsPerMeasure: 4,
    description: "A voz 2 canta uma sexta abaixo da voz 1.",
    studyTips: "A sexta é uma terça invertida: compare com o exercício de terças.",
    parts: [
      { name: "Voz 1", short: "V1", notes: "C5/1 B4/1 A4/1 G4/1 | A4/1 B4/1 C5/2", lyrics: "dó si lá sol lá si dó", voices: ["soprano", "mezzo_soprano"] },
      { name: "Voz 2", short: "V2", notes: "E4/1 D4/1 C4/1 B3/1 | C4/1 D4/1 E4/2", lyrics: "mi ré dó si dó ré mi", voices: ["contralto", "mezzo_soprano", "tenor"] },
    ],
  },
  {
    slug: "movimento-contrario",
    repertoire: "caderno-exercicios",
    title: "Movimento contrário",
    formation: "duas_vozes",
    harmonyLevel: 2,
    keyName: "Dó maior",
    tempo: 72,
    beatsPerMeasure: 4,
    description: "Enquanto a voz 1 sobe, a voz 2 desce — e vice-versa — terminando em uníssono.",
    studyTips: "Pense na direção da sua linha antes de cada nota. A abertura máxima é a oitava Sol–Sol do compasso 1.",
    parts: [
      { name: "Voz 1", short: "V1", notes: "E4/1 F4/1 G4/2 | F4/1 E4/1 D4/2 | C4/4", lyrics: "mi fá sol fá mi ré dó", voices: ["soprano", "mezzo_soprano", "tenor"] },
      { name: "Voz 2", short: "V2", notes: "C4/1 A3/1 G3/2 | A3/1 C4/1 B3/2 | C4/4", lyrics: "dó lá sol lá dó si dó", voices: ["contralto", "baritono", "tenor"] },
    ],
  },
  {
    slug: "pedal-e-melodia",
    repertoire: "caderno-exercicios",
    title: "Nota pedal e melodia",
    formation: "duas_vozes",
    harmonyLevel: 2,
    keyName: "Dó maior",
    tempo: 72,
    beatsPerMeasure: 4,
    description: "A voz 2 sustenta notas longas (pedal) enquanto a voz 1 se move.",
    studyTips: "Quem canta o pedal deve manter a nota firme mesmo quando a melodia passa por notas que “brigam” com ela.",
    parts: [
      { name: "Voz 1 (melodia)", short: "V1", notes: "C4/1 D4/1 E4/1 F4/1 | G4/2 E4/2 | F4/1 D4/1 B3/1 D4/1 | C4/4", lyrics: "dó ré mi fá sol mi fá ré si ré dó", voices: ["soprano", "mezzo_soprano", "contralto", "tenor"] },
      { name: "Voz 2 (pedal)", short: "Ped", notes: "C3/4 | C3/4 | G2/4 | C3/4", lyrics: "dó _ sol dó", voices: ["baixo", "baritono", "tenor"] },
    ],
  },
  {
    slug: "triades-tres-vozes",
    repertoire: "caderno-exercicios",
    title: "Tríades a três vozes (I – vi – IV – V – I)",
    formation: "tres_vozes",
    harmonyLevel: 3,
    keyName: "Dó maior",
    tempo: 66,
    beatsPerMeasure: 4,
    description: "Três vozes cantando os acordes de Dó maior com notas comuns.",
    studyTips: "A voz grave repete Dó em três acordes: âncora. A voz do meio é a que mais se move.",
    parts: [
      { name: "Voz aguda", short: "A", notes: "G4/2 A4/2 | A4/2 G4/2 | G4/4", lyrics: "lu lu lu lu lu", voices: ["soprano", "mezzo_soprano"] },
      { name: "Voz do meio", short: "M", notes: "E4/2 E4/2 | F4/2 D4/2 | E4/4", lyrics: "lu lu lu lu lu", voices: ["mezzo_soprano", "contralto"] },
      { name: "Voz grave", short: "G", notes: "C4/2 C4/2 | C4/2 B3/2 | C4/4", lyrics: "lu lu lu lu lu", voices: ["contralto", "tenor", "baritono"] },
    ],
  },
  {
    slug: "acordes-sustentados-satb",
    repertoire: "caderno-exercicios",
    title: "Acordes sustentados SATB (I – IV – V7 – I)",
    formation: "satb",
    harmonyLevel: 4,
    keyName: "Dó maior",
    tempo: 60,
    beatsPerMeasure: 4,
    description: "Quatro acordes longos para treinar a afinação vertical.",
    studyTips: "Afine a partir do baixo. No V7, o Fá do soprano é a sétima: ele resolve descendo para Mi.",
    parts: [
      { name: "Soprano", short: "S", notes: "E4/4 | F4/4 | F4/4 | E4/4", lyrics: "u u u u", voices: ["soprano", "mezzo_soprano"] },
      { name: "Contralto", short: "C", notes: "C4/4 | C4/4 | D4/4 | C4/4", lyrics: "u u u u", voices: ["contralto", "mezzo_soprano"] },
      { name: "Tenor", short: "T", notes: "G3/4 | A3/4 | B3/4 | G3/4", lyrics: "u u u u", voices: ["tenor", "baritono"] },
      { name: "Baixo", short: "B", notes: "C3/4 | F3/4 | G3/4 | C3/4", lyrics: "u u u u", voices: ["baixo", "baritono"] },
    ],
  },
];
