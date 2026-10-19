/**
 * Geração do plano individual a partir da avaliação inicial.
 * A classificação vocal NÃO é usada como critério do plano: só o desempenho
 * e o questionário. Os prazos de 4, 8 e 12 semanas são referências de
 * planejamento, não promessas de resultado.
 */

export type ExperienceLevel = "nenhuma" | "pouca" | "moderada" | "muita";

export interface Questionnaire {
  experiencia: ExperienceLevel;
  cantaEmGrupo: "nunca" | "as_vezes" | "regularmente";
  formacoes: ("coral" | "quarteto" | "louvor" | "solo")[];
  lePartitura: "nao" | "um_pouco" | "sim";
  conheceCifras: "nao" | "um_pouco" | "sim";
  tocaInstrumento: boolean;
  instrumento?: string;
  aulasDeCanto: "nunca" | "menos_1_ano" | "mais_1_ano";
  dificuldades: ("afinacao" | "respiracao" | "ritmo" | "agudos" | "graves" | "manter_voz" | "leitura" | "timidez" | "cansaco")[];
  facilidadeRegiao: "graves" | "medias" | "agudas" | "nao_sei";
  manterVozDiferente: "nao" | "com_dificuldade" | "sim";
  grupoVocal: "feminina" | "masculina" | "nao_informado";
  diasPorSemana: number;
  minutosPorDia: number;
}

export const TEST_KEYS = ["altura", "reproducao", "memoria", "intervalos", "ritmo", "sustentacao", "entrada", "consonancia", "independencia"] as const;
export type TestKey = (typeof TEST_KEYS)[number];
export type TestResults = Partial<Record<TestKey, number | null>>;

export const TEST_LABELS: Record<TestKey, string> = {
  altura: "Percepção de grave e agudo",
  reproducao: "Reprodução de notas",
  memoria: "Memória melódica",
  intervalos: "Identificação de intervalos",
  ritmo: "Reprodução de ritmos",
  sustentacao: "Afinação em nota sustentada",
  entrada: "Precisão de entrada e finalização",
  consonancia: "Consonância e dissonância",
  independencia: "Independência vocal",
};

interface SkillPlanInfo {
  label: string;
  lessons: string[];
  daily: { slug: string; title: string; minutes: number; href: string }[];
  strength: string;
  develop: string;
}

const SKILL_PLAN: Record<string, SkillPlanInfo> = {
  "discriminacao-altura": {
    label: "Percepção de altura",
    lessons: ["grave-e-agudo", "reproducao-de-notas"],
    daily: [{ slug: "lab-altura", title: "Laboratório: grave ou agudo", minutes: 3, href: "/ouvido/altura" }],
    strength: "Você percebe bem a direção das notas (mais aguda ou mais grave).",
    develop: "Perceber pequenas diferenças de altura — base para afinar.",
  },
  "afinacao-nota": {
    label: "Afinação",
    lessons: ["afinacao-basica", "reproducao-de-notas", "emissao-confortavel"],
    daily: [
      { slug: "treino-afinacao-livre", title: "Treinador de afinação (notas sustentadas)", minutes: 5, href: "/voz?ferramenta=afinador" },
      { slug: "lab-afinacao", title: "Laboratório: perceber desafinação", minutes: 3, href: "/ouvido/afinacao" },
    ],
    strength: "Sua afinação em notas isoladas é consistente.",
    develop: "Reproduzir e sustentar notas com estabilidade.",
  },
  "memoria-melodica": {
    label: "Memória melódica",
    lessons: ["memoria-de-sequencias", "escuta-ativa"],
    daily: [{ slug: "lab-memoria", title: "Laboratório: memória melódica", minutes: 4, href: "/ouvido/memoria" }],
    strength: "Você guarda sequências melódicas com facilidade — ótimo para aprender a sua voz.",
    develop: "Memorizar sequências e frases para aprender a própria linha.",
  },
  intervalos: {
    label: "Intervalos",
    lessons: ["intervalos-simples", "tercas-e-sextas", "intervalos-na-pauta"],
    daily: [{ slug: "lab-intervalos", title: "Laboratório: intervalos", minutes: 4, href: "/ouvido/intervalos" }],
    strength: "Você reconhece bem os intervalos básicos.",
    develop: "Reconhecer terças, quintas e oitavas — a matéria-prima da harmonia.",
  },
  "ritmo-pulsacao": {
    label: "Ritmo e entradas",
    lessons: ["ritmo-e-pulsacao", "entradas-e-finalizacoes", "figuras-ritmicas-e-compassos"],
    daily: [{ slug: "lab-ritmo", title: "Laboratório: ritmo", minutes: 3, href: "/ouvido/ritmo" }],
    strength: "Seu senso de pulsação e suas entradas são precisos.",
    develop: "Manter a pulsação e entrar no tempo após pausas.",
  },
  consonancia: {
    label: "Consonância",
    lessons: ["acordes-basicos"],
    daily: [{ slug: "lab-consonancia", title: "Laboratório: consonância", minutes: 2, href: "/ouvido/consonancia" }],
    strength: "Você distingue sons estáveis e tensos.",
    develop: "Distinguir consonância e dissonância para perceber quando o acorde “encaixa”.",
  },
  "independencia-vocal": {
    label: "Independência vocal",
    lessons: ["manter-a-propria-linha", "duas-vozes", "independencia-vocal"],
    daily: [
      { slug: "treino-independencia", title: "Sustentar a nota com outra melodia soando", minutes: 4, href: "/voz?ferramenta=independencia" },
      { slug: "harmonia-pratica-2-vozes", title: "Treinador de harmonia: terças paralelas", minutes: 5, href: "/harmonia/tercas-paralelas" },
    ],
    strength: "Você mantém a sua linha mesmo com outra voz soando.",
    develop: "Manter a própria linha sem ser arrastado(a) pela melodia principal.",
  },
  "respiracao-fraseado": {
    label: "Respiração",
    lessons: ["respiracao-e-fraseado", "postura-e-relaxamento"],
    daily: [{ slug: "aquecimento-guiado", title: "Rotina guiada de aquecimento e respiração", minutes: 6, href: "/voz?ferramenta=aquecimento" }],
    strength: "Você relata boa gestão do ar.",
    develop: "Gestão do ar e planejamento das respirações.",
  },
  "leitura-pauta": {
    label: "Leitura musical",
    lessons: ["notas-na-pauta", "figuras-ritmicas-e-compassos", "claves"],
    daily: [],
    strength: "Você já lê partitura — isso acelera o estudo das vozes.",
    develop: "Ler notas e ritmos para estudar a própria voz com autonomia.",
  },
  "harmonia-duas-vozes": {
    label: "Harmonia",
    lessons: ["duas-vozes", "tercas-e-sextas", "tres-vozes"],
    daily: [{ slug: "harmonia-pratica-2-vozes", title: "Treinador de harmonia: duas vozes", minutes: 6, href: "/harmonia/hino-alegria-duas-vozes" }],
    strength: "Você já tem experiência cantando em vozes.",
    develop: "Cantar uma segunda voz em terças e sextas.",
  },
};

export interface SkillEstimate {
  skill: string;
  score: number;
  source: "teste" | "questionario";
}

function avg(...values: (number | null | undefined)[]): number | null {
  const v = values.filter((x): x is number => typeof x === "number");
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
}

export function estimateSkills(q: Questionnaire, t: TestResults): SkillEstimate[] {
  const out: SkillEstimate[] = [];
  const push = (skill: string, test: number | null, fallback: number) =>
    out.push(test === null ? { skill, score: fallback, source: "questionario" } : { skill, score: test, source: "teste" });

  const difficulty = (d: Questionnaire["dificuldades"][number]) => q.dificuldades.includes(d);
  push("discriminacao-altura", avg(t.altura), difficulty("afinacao") ? 0.45 : 0.6);
  push("afinacao-nota", avg(t.reproducao, t.sustentacao), difficulty("afinacao") ? 0.35 : 0.55);
  push("memoria-melodica", avg(t.memoria), 0.55);
  push("intervalos", avg(t.intervalos), q.lePartitura === "sim" ? 0.6 : 0.4);
  push("ritmo-pulsacao", avg(t.ritmo, t.entrada), difficulty("ritmo") ? 0.4 : 0.6);
  push("consonancia", avg(t.consonancia), 0.55);
  const independenceFallback = { nao: 0.2, com_dificuldade: 0.45, sim: 0.75 }[q.manterVozDiferente];
  push("independencia-vocal", avg(t.independencia), independenceFallback);
  out.push({ skill: "respiracao-fraseado", score: difficulty("respiracao") || difficulty("cansaco") ? 0.4 : 0.65, source: "questionario" });
  out.push({ skill: "leitura-pauta", score: { nao: 0.15, um_pouco: 0.5, sim: 0.85 }[q.lePartitura], source: "questionario" });
  const groupExp = { nunca: 0.2, as_vezes: 0.5, regularmente: 0.75 }[q.cantaEmGrupo];
  const harmony = avg(groupExp, avg(t.independencia) ?? independenceFallback, avg(t.intervalos)) ?? groupExp;
  out.push({ skill: "harmonia-duas-vozes", score: harmony, source: "questionario" });
  return out;
}

export type OverallLevel = "iniciante" | "intermediario" | "avancado";

export function overallLevel(q: Questionnaire, t: TestResults): OverallLevel {
  const tests = avg(...TEST_KEYS.map((k) => t[k] ?? null));
  const exp = { nenhuma: 0.1, pouca: 0.35, moderada: 0.6, muita: 0.85 }[q.experiencia];
  const score = tests === null ? exp : 0.65 * tests + 0.35 * exp;
  if (score >= 0.75) return "avancado";
  if (score >= 0.5) return "intermediario";
  return "iniciante";
}

// Ordem pedagógica: escuta antes da execução, base antes da harmonia.
const FOUNDATION_ORDER = [
  "discriminacao-altura",
  "afinacao-nota",
  "respiracao-fraseado",
  "ritmo-pulsacao",
  "memoria-melodica",
  "intervalos",
  "consonancia",
  "independencia-vocal",
  "harmonia-duas-vozes",
  "leitura-pauta",
];

const CORE_WEIGHT: Record<string, number> = {
  "afinacao-nota": 1.25,
  "discriminacao-altura": 1.15,
  "independencia-vocal": 1.15,
  "respiracao-fraseado": 1.05,
  // A leitura é estudada em paralelo (Trilha E) e não deve tomar o lugar das bases vocais.
  "leitura-pauta": 0.7,
  "harmonia-duas-vozes": 0.9,
};

export interface PlanGoal {
  title: string;
  description: string;
  horizonWeeks: 4 | 8 | 12;
  skill?: string;
  targetLevel?: number;
}

export interface GeneratedPlan {
  level: OverallLevel;
  objective: string;
  prioritySkills: string[];
  recommendedLessons: string[];
  dailyExercises: { slug: string; title: string; minutes: number; href: string }[];
  weeklyFrequency: number;
  minutesPerSession: number;
  reviewEveryWeeks: number;
  completionCriteria: string;
  nextLevel: string;
  goals: PlanGoal[];
  rationale: string[];
  report: { strengths: string[]; toDevelop: string[]; recommendations: string[] };
  estimates: SkillEstimate[];
}

const BASE_LESSONS_BEGINNER = ["postura-e-relaxamento", "aquecimento-vocal"];

export function generatePlan(q: Questionnaire, t: TestResults, lessonOrder: string[]): GeneratedPlan {
  const estimates = estimateSkills(q, t);
  const level = overallLevel(q, t);
  const byScore = new Map(estimates.map((e) => [e.skill, e.score]));

  const ranked = estimates
    .map((e) => ({ ...e, need: (1 - e.score) * (CORE_WEIGHT[e.skill] ?? 1) }))
    .filter((e) => e.need > 0.3 && SKILL_PLAN[e.skill])
    .sort((a, b) => b.need - a.need);

  let priority = ranked.slice(0, 3).map((e) => e.skill);
  // Escuta antes da execução: se a afinação e a percepção estão baixas, a percepção vem antes.
  if (priority.includes("afinacao-nota") && (byScore.get("discriminacao-altura") ?? 1) < 0.6 && !priority.includes("discriminacao-altura")) {
    const dropIdx = priority.length >= 3 ? priority.findLastIndex((p) => p !== "afinacao-nota") : -1;
    if (dropIdx >= 0) priority.splice(dropIdx, 1);
    priority = ["discriminacao-altura", ...priority];
  }
  priority.sort((a, b) => FOUNDATION_ORDER.indexOf(a) - FOUNDATION_ORDER.indexOf(b));

  if (priority.length === 0) {
    // Já está bem nas bases: avança para a harmonia.
    priority = level === "avancado" ? ["harmonia-duas-vozes", "independencia-vocal"] : ["intervalos", "harmonia-duas-vozes"];
  }

  const lessonSet = new Set<string>();
  if (level === "iniciante") BASE_LESSONS_BEGINNER.forEach((l) => lessonSet.add(l));
  for (const s of priority) SKILL_PLAN[s]?.lessons.slice(0, 2).forEach((l) => lessonSet.add(l));
  if (level !== "iniciante" && (byScore.get("intervalos") ?? 0) >= 0.7) {
    ["duas-vozes", "tercas-e-sextas", "tres-vozes"].forEach((l) => lessonSet.add(l));
  }
  const recommendedLessons = [...lessonSet].sort((a, b) => lessonOrder.indexOf(a) - lessonOrder.indexOf(b)).slice(0, 6);

  const minutesPerSession = Math.max(10, Math.min(60, q.minutosPorDia));
  const daily: GeneratedPlan["dailyExercises"] = [];
  let used = 0;
  const add = (d: GeneratedPlan["dailyExercises"][number]) => {
    if (daily.some((x) => x.slug === d.slug) || used + d.minutes > minutesPerSession) return;
    daily.push(d);
    used += d.minutes;
  };
  add({ slug: "aquecimento-guiado", title: "Aquecimento vocal guiado", minutes: 5, href: "/voz?ferramenta=aquecimento" });
  for (const s of priority) for (const d of SKILL_PLAN[s]?.daily ?? []) add(d);
  if (used + 5 <= minutesPerSession) add({ slug: "aula-recomendada", title: "Próxima aula recomendada", minutes: minutesPerSession - used, href: "/jornada" });

  const weeklyFrequency = Math.max(3, Math.min(6, q.diasPorSemana));
  const labels = priority.map((s) => SKILL_PLAN[s]?.label.toLowerCase() ?? s);

  const objective =
    level === "iniciante"
      ? `Construir as bases para cantar com segurança no grupo, priorizando ${joinPt(labels)}.`
      : level === "intermediario"
        ? `Fortalecer ${joinPt(labels)} para cantar a sua própria voz em duas e três vozes.`
        : `Refinar ${joinPt(labels)} e consolidar a independência em arranjos a quatro vozes.`;

  const nextLevel =
    level === "iniciante"
      ? "Trilha C (canto em conjunto) e início da harmonia a duas vozes."
      : level === "intermediario"
        ? "Três vozes, acordes a quatro vozes (SATB) e afinação de acordes."
        : "Arranjos avançados (contracanto, pedal, modulação) e apoio ao naipe nos ensaios.";

  const [first, second] = priority;
  const goals: PlanGoal[] = [
    {
      title: `Concluir ${recommendedLessons.length >= 2 ? "as duas primeiras aulas recomendadas" : "a primeira aula recomendada"}`,
      description: "Atingir o critério de avanço das aulas (não basta abrir a aula).",
      horizonWeeks: 4,
    },
    {
      title: `${SKILL_PLAN[first]?.label ?? "Habilidade prioritária"}: chegar a “em desenvolvimento”`,
      description: "Ao menos 3 atividades avaliadas com média de 60% ou mais.",
      horizonWeeks: 4,
      skill: first,
      targetLevel: 3,
    },
    {
      title: `${SKILL_PLAN[first]?.label ?? "Habilidade prioritária"}: executar com consistência`,
      description: "Média de 80% em atividades feitas em pelo menos 3 dias diferentes.",
      horizonWeeks: 8,
      skill: first,
      targetLevel: 4,
    },
  ];
  if (second) {
    goals.push({
      title: `${SKILL_PLAN[second]?.label ?? second}: chegar a “em desenvolvimento”`,
      description: "Ao menos 3 atividades avaliadas com média de 60% ou mais.",
      horizonWeeks: 8,
      skill: second,
      targetLevel: 3,
    });
  }
  goals.push({
    title:
      level === "iniciante"
        ? "Cantar a segunda voz do Hino da Alegria no modo guiado"
        : level === "intermediario"
          ? "Cantar a sua voz a três vozes no modo conjunto"
          : "Cantar a sua parte no SATB ou no quarteto no modo conjunto",
    description: "Use o treinador de harmonia e registre a prática.",
    horizonWeeks: 12,
  });
  goals.push({
    title: "Fazer a avaliação de evolução",
    description: "Refaça a avaliação para comparar com o ponto de partida e ajustar o plano com o professor.",
    horizonWeeks: 12,
  });

  const rationale: string[] = [];
  if (priority.includes("discriminacao-altura")) rationale.push("A percepção vem antes da execução: treinar a escuta facilita a afinação.");
  if (priority.includes("afinacao-nota")) rationale.push("A afinação é a base para cantar em conjunto; por isso há prática curta e diária com o treinador.");
  if (priority.includes("independencia-vocal")) rationale.push("Manter a própria linha é treinado em passos pequenos: nota sustentada, depois terças e, por fim, o conjunto.");
  if (priority.includes("respiracao-fraseado")) rationale.push("Você relatou dificuldade com o ar ou cansaço: a rotina de respiração entra no aquecimento.");
  if ((byScore.get("memoria-melodica") ?? 0) >= 0.75) rationale.push("Sua boa memória melódica ajuda a aprender as vozes de ouvido.");
  if ((byScore.get("afinacao-nota") ?? 0) >= 0.75 && (byScore.get("harmonia-duas-vozes") ?? 1) < 0.6) {
    rationale.push("Sua afinação já é boa: você pode avançar mais rapidamente para intervalos, acordes e canto em vozes.");
  }
  rationale.push("A classificação vocal não define o plano: ele foi montado a partir do seu desempenho e das suas respostas.");

  const strengths: string[] = [];
  const toDevelop: string[] = [];
  for (const e of estimates) {
    const info = SKILL_PLAN[e.skill];
    if (!info) continue;
    if (e.score >= 0.75) strengths.push(info.strength);
    else if (e.score <= 0.55) toDevelop.push(info.develop);
  }
  if (strengths.length === 0) strengths.push("Disposição para aprender: você concluiu a avaliação e já tem um ponto de partida claro.");

  const recommendations = [
    `Estude ${weeklyFrequency} vezes por semana, cerca de ${minutesPerSession} minutos por sessão. Sessões curtas e frequentes funcionam melhor que uma longa.`,
    "Sempre comece pelo aquecimento e pare em caso de dor, rouquidão ou desconforto.",
    "Use fones de ouvido nas atividades com microfone.",
    `Refaça a avaliação a cada ${level === "iniciante" ? 4 : 6} semanas para acompanhar a evolução.`,
  ];
  if (q.lePartitura === "nao") recommendations.push("Comece a Trilha E (leitura musical) em paralelo, 5 minutos por dia.");

  return {
    level,
    objective,
    prioritySkills: priority,
    recommendedLessons,
    dailyExercises: daily,
    weeklyFrequency,
    minutesPerSession,
    reviewEveryWeeks: level === "iniciante" ? 4 : 6,
    completionCriteria:
      "Atingir o nível “em desenvolvimento” (3) nas habilidades prioritárias e concluir as aulas recomendadas, com validação do professor quando a habilidade exigir.",
    nextLevel,
    goals,
    rationale,
    report: { strengths, toDevelop, recommendations },
    estimates,
  };
}

export function skillPlanLabel(skill: string): string {
  return SKILL_PLAN[skill]?.label ?? skill;
}

function joinPt(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "as bases";
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}
