import type { AchievementDef, SkillDef } from "./types";

const tecnica = (slug: string, name: string, description: string, observavel: string): SkillDef => ({
  slug,
  name,
  category: "tecnica_vocal",
  description,
  // Técnica vocal só chega a "consistência" com a escuta do professor.
  autoMaxLevel: 3,
  criteria: {
    "2": "Conhece os conceitos da aula e fez a primeira prática guiada.",
    "3": "Acertou a avaliação da aula e pratica regularmente.",
    "4": `Professor observou: ${observavel}`,
    "5": "Aplica a habilidade no repertório, nos ensaios e no culto.",
  },
});

const auditiva = (slug: string, name: string, category: SkillDef["category"], description: string): SkillDef => ({
  slug,
  name,
  category,
  description,
  autoMaxLevel: 4,
  criteria: {
    "2": "Realizou as primeiras atividades.",
    "3": "Ao menos 3 atividades avaliadas, com média recente de 60% ou mais.",
    "4": "Ao menos 5 atividades avaliadas, média recente de 80% ou mais, em 3 dias diferentes.",
    "5": "Professor confirmou o uso da habilidade no repertório.",
  },
});

export const SKILLS: SkillDef[] = [
  tecnica("postura-relaxamento", "Postura e relaxamento", "Corpo alinhado, apoiado e sem tensões desnecessárias ao cantar.", "postura estável e ausência de tensão no pescoço, ombros e mandíbula durante uma música inteira."),
  tecnica("aquecimento-vocal", "Aquecimento e desaquecimento", "Preparar e recuperar a voz com uma rotina segura e progressiva.", "conduz sozinho(a) uma rotina completa de aquecimento antes do ensaio."),
  tecnica("respiracao-fraseado", "Respiração e fraseado", "Gestão confortável do ar, planejamento de respirações e sustentação de frases.", "frases sustentadas até o fim, com respirações planejadas e sem prender o ar."),
  tecnica("emissao-ressonancia", "Emissão e ressonância", "Som livre, equilibrado e projetado sem esforço.", "som consistente em toda a região confortável, sem apertar a garganta."),
  tecnica("diccao-articulacao", "Dicção e articulação", "Texto inteligível, vogais unificadas e consoantes claras.", "texto compreensível sem prejudicar o legato."),
  tecnica("registros-extensao", "Extensão, tessitura e registros", "Conhecer a própria região confortável e transitar entre registros sem forçar.", "transições suaves entre registros na região confortável."),
  {
    slug: "interpretacao",
    name: "Interpretação musical",
    category: "interpretacao",
    description: "Dinâmica, fraseado, legato e intenção do texto sacro.",
    autoMaxLevel: 3,
    criteria: {
      "2": "Conhece os elementos de interpretação.",
      "3": "Acertou a avaliação e marca dinâmicas e respirações nas músicas.",
      "4": "Professor observou dinâmica e fraseado intencionais em uma música inteira.",
      "5": "Interpreta com unidade junto ao grupo no culto.",
    },
  },
  {
    slug: "afinacao-nota",
    name: "Reproduzir e sustentar notas",
    category: "afinacao",
    description: "Cantar a nota ouvida e mantê-la estável.",
    autoMaxLevel: 4,
    criteria: {
      "2": "Tentou reproduzir as primeiras notas.",
      "3": "Média recente de 60% nas notas sustentadas.",
      "4": "Média recente de 80%, em 3 dias diferentes (detecção confiável).",
      "5": "Professor confirmou a afinação no repertório.",
    },
  },
  auditiva("discriminacao-altura", "Grave e agudo", "percepcao", "Perceber se uma nota é mais aguda ou mais grave que outra."),
  auditiva("intervalos", "Intervalos", "percepcao", "Reconhecer e cantar as distâncias entre notas."),
  auditiva("memoria-melodica", "Memória melódica", "percepcao", "Memorizar e reproduzir sequências e frases."),
  auditiva("ritmo-pulsacao", "Ritmo e pulsação", "ritmo", "Sentir o pulso, reproduzir padrões e entrar no tempo."),
  auditiva("acordes", "Acordes", "percepcao", "Reconhecer tipos de acorde e as notas extremas."),
  auditiva("progressoes", "Progressões e cadências", "percepcao", "Reconhecer encadeamentos harmônicos comuns."),
  auditiva("percepcao-afinacao", "Perceber desafinação", "percepcao", "Ouvir quando uma nota está acima ou abaixo."),
  auditiva("consonancia", "Consonância e dissonância", "percepcao", "Distinguir sons estáveis de sons tensos."),
  {
    slug: "canto-unissono",
    name: "Canto em uníssono",
    category: "conjunto",
    description: "Cantar a mesma melodia com unidade de altura, ritmo, dicção e respiração.",
    autoMaxLevel: 3,
    criteria: {
      "2": "Conhece os princípios do uníssono.",
      "3": "Acertou a avaliação e pratica com o treinador de harmonia.",
      "4": "Professor observou unidade com o grupo no ensaio.",
      "5": "Canta em uníssono no repertório com segurança.",
    },
  },
  auditiva("escuta-ativa", "Escuta ativa e entradas", "conjunto", "Ouvir o conjunto, reconhecer entradas e equilibrar a própria voz."),
  {
    slug: "independencia-vocal",
    name: "Independência vocal",
    category: "harmonia",
    description: "Manter a própria linha enquanto outras vozes cantam melodias diferentes.",
    autoMaxLevel: 4,
    criteria: {
      "2": "Tentou sustentar uma nota com outra melodia soando.",
      "3": "Média recente de 60% sustentando a própria nota com distração.",
      "4": "Média recente de 80% em 3 dias diferentes.",
      "5": "Professor confirmou a linha própria mantida no ensaio.",
    },
  },
  auditiva("harmonia-duas-vozes", "Harmonia em duas vozes", "harmonia", "Cantar uma segunda voz em terças, sextas e movimento contrário."),
  auditiva("harmonia-tres-quatro-vozes", "Três e quatro vozes", "harmonia", "Cantar a própria parte em acordes de três e quatro vozes."),
  auditiva("leitura-pauta", "Leitura de notas", "leitura", "Ler notas nas claves de Sol e de Fá."),
  auditiva("leitura-ritmica", "Leitura rítmica", "leitura", "Ler figuras, pausas e compassos."),
  auditiva("cifras", "Cifras", "teoria", "Entender cifras e relacioná-las às notas dos acordes."),
  auditiva("teoria-escalas", "Escalas e tonalidade", "teoria", "Tons, semitons, escalas, armaduras e transposição."),
  auditiva("teoria-harmonia", "Acordes e campo harmônico", "teoria", "Tríades, inversões, campo harmônico, funções e cadências."),
];

export const ACHIEVEMENTS: AchievementDef[] = [
  { slug: "primeiro-passo", title: "Primeiro passo", description: "Concluiu a avaliação inicial.", icon: "footprints", points: 30 },
  { slug: "primeira-nota-estavel", title: "Primeira nota estável", description: "Reproduziu uma nota com estabilidade e afinação.", icon: "audio-waveform", points: 30 },
  { slug: "primeira-sequencia-melodica", title: "Primeira sequência melódica", description: "Reproduziu uma sequência melódica completa.", icon: "list-music", points: 20 },
  { slug: "primeira-harmonia-duas-vozes", title: "Primeira harmonia a duas vozes", description: "Praticou sua voz em um exercício a duas vozes.", icon: "git-merge", points: 40 },
  { slug: "primeira-participacao-quatro-vozes", title: "Quatro vozes", description: "Participou de uma prática ou ensaio a quatro vozes.", icon: "users", points: 50 },
  { slug: "primeira-musica-estudada", title: "Música estudada", description: "Estudou integralmente a sua parte em uma música.", icon: "music", points: 50 },
  { slug: "primeira-avaliacao-evolucao", title: "Evolução registrada", description: "Concluiu a primeira avaliação de evolução.", icon: "trending-up", points: 40 },
  { slug: "primeira-aula-concluida", title: "Primeira aula concluída", description: "Atingiu o critério de avanço de uma aula.", icon: "graduation-cap", points: 20 },
  { slug: "trilha-concluida", title: "Trilha concluída", description: "Concluiu todas as aulas de uma trilha.", icon: "trophy", points: 100 },
  { slug: "ouvido-atento", title: "Ouvido atento", description: "Fez 30 sessões no laboratório de percepção.", icon: "ear", points: 40 },
  { slug: "constancia-sete-dias", title: "Constância", description: "Estudou 7 dias seguidos.", icon: "flame", points: 50 },
  { slug: "presenca-no-ensaio", title: "Presente no ensaio", description: "Teve a primeira presença registrada em um ensaio.", icon: "calendar-check", points: 10 },
];
