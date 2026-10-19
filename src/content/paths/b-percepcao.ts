import type { PathDef } from "../types";
import { SEGURANCA_BASE } from "../common";

const SEGURANCA_ESCUTA = [
  "Use volume moderado nos fones de ouvido: a audição também precisa de cuidado.",
  "Faça pausas a cada 15 minutos de exercícios de escuta.",
];

export const trilhaB: PathDef = {
  slug: "percepcao-musical",
  code: "B",
  title: "Percepção musical",
  subtitle: "Aprender a ouvir antes de cantar",
  description:
    "Treino auditivo progressivo: altura, reprodução de notas, intervalos, memória melódica, ritmo e acordes. Cada aula combina exemplos sonoros, prática no teclado e avaliação com feedback imediato.",
  icon: "ear",
  lessons: [
    {
      slug: "grave-e-agudo",
      title: "Reconhecimento de notas graves e agudas",
      summary: "Perceber a direção do som: mais agudo, mais grave ou igual.",
      level: 1,
      minutes: 15,
      skills: ["discriminacao-altura"],
      content: {
        objetivo: "Perceber se uma nota é mais aguda, mais grave ou igual a outra, mesmo quando a diferença é pequena.",
        explicacao: [
          {
            type: "p",
            text: "Altura é a característica que faz um som ser agudo (“fino”) ou grave (“grosso”). Ela depende da frequência: quanto mais vibrações por segundo, mais agudo o som. No teclado, as notas ficam mais agudas para a direita e mais graves para a esquerda.",
          },
          {
            type: "p",
            text: "Não confunda altura com volume: um som pode ser grave e forte, ou agudo e suave. Também não confunda com timbre: um violão e uma voz podem tocar exatamente a mesma altura.",
          },
          {
            type: "tip",
            title: "Use o corpo",
            text: "Ao ouvir duas notas, mova a mão para cima ou para baixo acompanhando a segunda nota. Muitas pessoas percebem melhor a direção com um gesto.",
          },
        ],
        demonstracao: [
          { type: "audio", label: "Grande diferença: Dó4 → Dó5", notes: ["C4", "C5"], tempo: 60 },
          { type: "audio", label: "Diferença média: Dó4 → Sol4", notes: ["C4", "G4"], tempo: 60 },
          { type: "audio", label: "Diferença pequena: Dó4 → Ré4", notes: ["C4", "D4"], tempo: 60 },
          { type: "audio", label: "Descendo: Sol4 → Mi4", notes: ["G4", "E4"], tempo: 60 },
          { type: "keyboard", from: "C3", to: "C5", label: "Toque teclas à esquerda (graves) e à direita (agudas)" },
        ],
        exercicioGuiado: {
          passos: [
            "Ouça cada demonstração e mova a mão para cima ou para baixo junto com a segunda nota.",
            "No teclado, toque uma nota e depois outra à direita: confirme que a segunda é mais aguda.",
            "Cante as duas notas da demonstração “Dó4 → Sol4” em “lá”, sentindo a voz subir.",
            "Faça o exercício de prática e depois a avaliação.",
          ],
        },
        pratiqueSozinho: { passos: ["Laboratório: “Grave ou agudo”, 5 minutos.", "Ao ouvir hinos, perceba se cada frase sobe ou desce."], minutos: 5, frequencia: "Diariamente na primeira semana" },
        errosComuns: [
          { erro: "Confundir “mais forte” com “mais agudo”.", correcao: "Preste atenção apenas na altura. O exercício toca as notas com o mesmo volume." },
          { erro: "Responder antes de ouvir a segunda nota inteira.", correcao: "Espere a nota terminar; repita o áudio quantas vezes precisar." },
        ],
        seguranca: SEGURANCA_ESCUTA,
        criterioAvanco: "Acertar pelo menos 70% na avaliação com diferenças de 2 a 5 semitons.",
      },
      exercises: [
        { slug: "altura-pratica", title: "Prática: grande e média diferença", instructions: "A segunda nota é mais aguda ou mais grave?", type: "pitch_compare", config: { rounds: 8, minSemitones: 5, maxSemitones: 12 }, skill: "discriminacao-altura", purpose: "pratica" },
        { slug: "altura-avaliacao", title: "Avaliação: grave ou agudo", instructions: "As diferenças agora são menores.", type: "pitch_compare", config: { rounds: 10, minSemitones: 2, maxSemitones: 5 }, skill: "discriminacao-altura", purpose: "avaliacao" },
      ],
    },
    {
      slug: "reproducao-de-notas",
      title: "Reprodução de notas",
      summary: "Encontrar no teclado e na voz a nota que você ouviu.",
      level: 1,
      minutes: 20,
      skills: ["afinacao-nota", "discriminacao-altura"],
      content: {
        objetivo: "Reproduzir notas isoladas com a voz e encontrá-las no teclado a partir de uma referência.",
        explicacao: [
          {
            type: "p",
            text: "Reproduzir uma nota é ligar o que o ouvido percebe ao que a voz faz. Comece pela escuta interna: ouça a nota, “cante por dentro” e só depois cante em voz alta. No teclado, use uma nota de referência (o Dó) para se orientar: a nota misteriosa está acima ou abaixo? Perto ou longe?",
          },
          {
            type: "list",
            items: [
              "As teclas brancas seguem Dó, Ré, Mi, Fá, Sol, Lá, Si; depois o Dó se repete uma oitava acima.",
              "As teclas pretas são os sustenidos (♯) e bemóis (♭). Dó♯ e Ré♭ são a mesma tecla.",
              "O dó central do piano é o Dó4. Vozes masculinas costumam cantar uma oitava abaixo das femininas.",
            ],
          },
        ],
        demonstracao: [
          { type: "keyboard", from: "C4", to: "C5", highlight: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"], label: "Notas naturais de Dó4 a Dó5" },
          { type: "audio", label: "Referência Dó4 e depois Mi4", notes: ["C4", "E4"], tempo: 50 },
          { type: "audio", label: "Referência Dó4 e depois Lá4", notes: ["C4", "A4"], tempo: 50 },
          { type: "toolLink", tool: "teclado", label: "Abrir o teclado interativo com nomes das notas" },
        ],
        exercicioGuiado: {
          passos: [
            "Toque o Dó4 no teclado e cante-o em “lá” (homens: uma oitava abaixo).",
            "Toque Mi4 e cante. Depois toque Sol4 e cante.",
            "Peça a alguém (ou use o exercício) para tocar uma nota: cante-a primeiro e depois procure no teclado.",
            "Use o treinador de afinação para conferir se a sua nota sustentada está no centro.",
          ],
        },
        pratiqueSozinho: { passos: ["Exercício “Encontre a nota” (5 minutos).", "Treinador de afinação: 3 notas sustentadas."], minutos: 8, frequencia: "4 vezes por semana" },
        errosComuns: [
          { erro: "Procurar a nota aleatoriamente no teclado.", correcao: "Compare com a referência: acima ou abaixo? Perto ou longe? Depois teste as vizinhas." },
          { erro: "Cantar a nota antes de ouvi-la por dentro.", correcao: "Faça um segundo de silêncio entre ouvir e cantar." },
        ],
        seguranca: [...SEGURANCA_BASE.slice(0, 2), ...SEGURANCA_ESCUTA],
        criterioAvanco: "Acertar pelo menos 70% em “Encontre a nota” com notas naturais.",
      },
      exercises: [
        { slug: "reproducao-cantar", title: "Cantar a nota ouvida", instructions: "Ouça e cante sustentando. Com microfone, o sistema estima a afinação.", type: "sing_note", config: { rounds: 3, holdSeconds: 3 }, skill: "afinacao-nota", purpose: "pratica" },
        { slug: "reproducao-teclado-avaliacao", title: "Avaliação: encontre a nota no teclado", instructions: "Ouça o Dó de referência e a nota misteriosa; encontre-a no teclado.", type: "note_match", config: { rounds: 8, range: [60, 72], naturalOnly: true }, skill: "discriminacao-altura", purpose: "avaliacao" },
      ],
    },
    {
      slug: "intervalos-simples",
      title: "Intervalos simples",
      summary: "Terças, quintas e oitavas: as distâncias que formam as harmonias.",
      level: 1,
      minutes: 25,
      skills: ["intervalos"],
      content: {
        objetivo: "Reconhecer pelo som e pelo nome os intervalos de terça maior, terça menor, quinta justa e oitava, ascendentes e simultâneos.",
        explicacao: [
          {
            type: "p",
            text: "Intervalo é a distância entre duas notas. Medimos em semitons (cada tecla vizinha no teclado) e damos nomes pelo número de notas da escala que ele abrange: de Dó a Mi há três notas (Dó, Ré, Mi), então é uma terça.",
          },
          {
            type: "list",
            items: [
              "Terça maior (4 semitons): Dó → Mi. Som luminoso.",
              "Terça menor (3 semitons): Dó → Mi♭ ou Lá → Dó. Som mais introspectivo.",
              "Quinta justa (7 semitons): Dó → Sol. Som aberto, estável.",
              "Oitava (12 semitons): Dó → Dó. A mesma nota mais aguda.",
            ],
          },
          {
            type: "p",
            text: "Melódico é quando as notas soam uma depois da outra; harmônico é quando soam juntas. Cantar em harmonia é, na prática, cantar intervalos harmônicos com outras pessoas: por isso esta aula é a base da divisão de vozes.",
          },
          { type: "tip", title: "Memorize com músicas", text: "A quinta justa aparece em “Brilha, brilha, estrelinha”; a quarta justa no início de “Graça Excelsa”. Associar intervalos a melodias conhecidas acelera o reconhecimento." },
        ],
        demonstracao: [
          { type: "intervals", root: "C4", semitones: [3, 4, 7, 12] },
          { type: "staff", clef: "sol", notes: ["C4", "E4", "G4", "C5"], label: "Dó, Mi, Sol e Dó na pauta" },
        ],
        exercicioGuiado: {
          passos: [
            "Toque cada intervalo da demonstração de forma melódica e depois harmônica.",
            "Cante a nota grave e depois a aguda de cada intervalo (homens, uma oitava abaixo).",
            "Compare terça maior e terça menor: qual soa mais luminosa?",
            "Faça a prática com terça maior, quinta e oitava; depois a avaliação incluindo a terça menor.",
          ],
        },
        pratiqueSozinho: { passos: ["Laboratório de intervalos no nível recomendado (5 minutos).", "Cante as terças da escala de Dó: Dó–Mi, Ré–Fá, Mi–Sol…"], minutos: 8, frequencia: "5 vezes por semana" },
        errosComuns: [
          { erro: "Confundir terça maior e menor.", correcao: "Pense em acorde maior (alegre) e menor (introspectivo). Ouça os dois lado a lado." },
          { erro: "Confundir quinta e oitava.", correcao: "A oitava soa como a mesma nota repetida mais aguda; a quinta, como notas diferentes que combinam." },
        ],
        seguranca: SEGURANCA_ESCUTA,
        criterioAvanco: "Acertar pelo menos 70% na avaliação com terças, quinta e oitava.",
      },
      exercises: [
        { slug: "intervalos-pratica", title: "Prática: terça maior, quinta e oitava", instructions: "Identifique o intervalo ascendente.", type: "interval_id", config: { rounds: 8, intervals: [4, 7, 12], direction: "asc" }, skill: "intervalos", purpose: "pratica" },
        { slug: "intervalos-avaliacao", title: "Avaliação: intervalos simples", instructions: "Inclui a terça menor e intervalos harmônicos.", type: "interval_id", config: { rounds: 10, intervals: [3, 4, 7, 12], direction: "mixed" }, skill: "intervalos", purpose: "avaliacao" },
      ],
    },
    {
      slug: "memoria-de-sequencias",
      title: "Memorização de sequências",
      summary: "Guardar e reproduzir pequenas melodias.",
      level: 1,
      minutes: 20,
      skills: ["memoria-melodica"],
      content: {
        objetivo: "Memorizar sequências de 3 a 5 notas e reproduzi-las no teclado e com a voz.",
        explicacao: [
          {
            type: "p",
            text: "Aprender a própria voz num arranjo depende de memória melódica: guardar a linha depois de ouvi-la algumas vezes. A estratégia é perceber o desenho da melodia (sobe, desce, repete), os saltos e a nota de chegada, em vez de tentar decorar nota por nota.",
          },
          {
            type: "list",
            items: [
              "Ouça uma vez apenas observando o desenho (sobe/desce).",
              "Ouça de novo cantando por dentro.",
              "Cante em voz alta em “lá” ou com os nomes das notas.",
              "Só então procure no teclado, partindo da primeira nota (que é informada).",
            ],
          },
        ],
        demonstracao: [
          { type: "audio", label: "Sequência que sobe por graus: Dó–Ré–Mi", notes: ["C4", "D4", "E4"], tempo: 84 },
          { type: "audio", label: "Sequência com repetição: Sol–Sol–Mi–Dó", notes: ["G4", "G4", "E4", "C4"], tempo: 84 },
          { type: "audio", label: "Sequência com salto: Dó–Sol–Mi–Ré", notes: ["C4", "G4", "E4", "D4"], tempo: 84 },
        ],
        exercicioGuiado: {
          passos: [
            "Ouça a primeira demonstração e desenhe no ar: sobe, sobe.",
            "Cante-a em “lá” e depois com os nomes: Dó–Ré–Mi.",
            "Toque no teclado a partir do Dó destacado.",
            "Repita com as demais demonstrações e faça a prática.",
          ],
        },
        pratiqueSozinho: { passos: ["Laboratório: memória melódica (5 minutos).", "Escolha um trecho curto de um hino e aprenda de ouvido, sem partitura."], minutos: 8, frequencia: "4 vezes por semana" },
        errosComuns: [
          { erro: "Tentar memorizar nota por nota.", correcao: "Memorize o desenho e os pontos de chegada." },
          { erro: "Tocar rápido demais no teclado.", correcao: "Cante primeiro; o teclado confirma o que você já sabe." },
        ],
        seguranca: SEGURANCA_ESCUTA,
        criterioAvanco: "Acertar pelo menos 70% das notas em sequências de 4 notas.",
      },
      exercises: [
        { slug: "memoria-pratica", title: "Prática: sequências de 3 notas", instructions: "Ouça e reproduza no teclado.", type: "melody_memory", config: { rounds: 5, minLength: 3, maxLength: 3, maxLeap: 2 }, skill: "memoria-melodica", purpose: "pratica" },
        { slug: "memoria-avaliacao", title: "Avaliação: sequências de 4 notas", instructions: "Ouça e reproduza no teclado.", type: "melody_memory", config: { rounds: 5, minLength: 4, maxLength: 4, maxLeap: 3 }, skill: "memoria-melodica", purpose: "avaliacao" },
      ],
    },
    {
      slug: "ritmo-e-pulsacao",
      title: "Ritmo e pulsação",
      summary: "Sentir o pulso e reproduzir padrões rítmicos.",
      level: 1,
      minutes: 20,
      skills: ["ritmo-pulsacao"],
      content: {
        objetivo: "Sentir a pulsação, manter o andamento e reproduzir padrões rítmicos simples com semínimas, mínimas e colcheias.",
        explicacao: [
          {
            type: "p",
            text: "Pulsação é a batida regular que sentimos na música — a que marcamos com o pé. O andamento é a velocidade dessa pulsação, medida em batidas por minuto (bpm). O ritmo é a combinação de durações curtas e longas sobre a pulsação.",
          },
          {
            type: "list",
            items: [
              "Semínima: dura 1 tempo.",
              "Mínima: dura 2 tempos.",
              "Colcheia: dura meio tempo (duas colcheias por tempo).",
              "Compasso 4/4: quatro tempos por compasso, com o primeiro mais forte.",
            ],
          },
          {
            type: "tip",
            title: "Cantar junto começa no ritmo",
            text: "Num grupo, entrar meio tempo atrasado é tão perceptível quanto desafinar. Sentir a pulsação no corpo (pé, mão) dá segurança para as entradas.",
          },
        ],
        demonstracao: [
          { type: "rhythm", pattern: "q q q q", bpm: 80, label: "Quatro semínimas" },
          { type: "rhythm", pattern: "h h", bpm: 80, label: "Duas mínimas" },
          { type: "rhythm", pattern: "q e e q q", bpm: 80, label: "Semínima, duas colcheias, duas semínimas" },
          { type: "toolLink", tool: "metronomo", label: "Abrir o metrônomo" },
        ],
        exercicioGuiado: {
          passos: [
            "Ligue o metrônomo a 80 bpm e bata o pé em cada clique.",
            "Fale “tá” em cada tempo (semínimas). Depois “tá-a” para mínimas (dois tempos).",
            "Fale “ti-ti” para duas colcheias dentro de um tempo.",
            "Ouça cada demonstração e bata palmas junto. Depois faça o exercício tocando no botão.",
          ],
        },
        pratiqueSozinho: { passos: ["Metrônomo: bata o pé por 1 minuto em 60, 80 e 100 bpm.", "Laboratório de ritmo (5 minutos)."], minutos: 7, frequencia: "4 vezes por semana" },
        errosComuns: [
          { erro: "Acelerar nas notas curtas.", correcao: "As colcheias cabem dentro do tempo: o pulso não muda." },
          { erro: "Encurtar notas longas.", correcao: "Conte mentalmente os tempos das mínimas até o fim." },
        ],
        seguranca: SEGURANCA_ESCUTA,
        criterioAvanco: "Acertar pelo menos 70% na avaliação de padrões rítmicos.",
      },
      exercises: [
        { slug: "ritmo-pratica", title: "Prática: semínimas e mínimas", instructions: "Ouça a contagem e o ritmo; depois toque o mesmo ritmo.", type: "rhythm_tap", config: { rounds: 4, patterns: ["q q q q", "h h", "q q h", "h q q"], bpm: 80 }, skill: "ritmo-pulsacao", purpose: "pratica" },
        { slug: "ritmo-avaliacao", title: "Avaliação: padrões com colcheias", instructions: "Reproduza os padrões tocando no botão.", type: "rhythm_tap", config: { rounds: 5, patterns: ["q e e q q", "e e q h", "q q e e q", "h e e q", "q e e e e q"], bpm: 76 }, skill: "ritmo-pulsacao", purpose: "avaliacao" },
      ],
    },
    {
      slug: "acordes-basicos",
      title: "Reconhecimento de acordes básicos",
      summary: "Maior, menor e as notas extremas de um acorde.",
      level: 2,
      minutes: 25,
      skills: ["acordes", "consonancia"],
      content: {
        objetivo: "Distinguir acordes maiores e menores, ouvir a nota mais grave e a mais aguda de um acorde e reconhecer consonância e dissonância.",
        explicacao: [
          {
            type: "p",
            text: "Um acorde é a combinação de três ou mais notas soando juntas. A tríade básica tem fundamental, terça e quinta. O que muda entre maior e menor é a terça: maior (4 semitons acima da fundamental) ou menor (3 semitons).",
          },
          {
            type: "p",
            text: "Em grupo, cada voz canta uma nota do acorde. Saber ouvir a nota mais grave (geralmente o baixo) e a mais aguda (geralmente a melodia) ajuda você a se localizar: “minha nota está no meio, acima do baixo”.",
          },
          {
            type: "list",
            items: [
              "Consonâncias: soam estáveis (oitava, quinta, terças, sextas).",
              "Dissonâncias: soam tensas e pedem resolução (segundas, sétimas, trítono).",
              "Dissonância não é erro: ela cria movimento. Mas uma dissonância fora do lugar indica que alguém saiu da própria nota.",
            ],
          },
        ],
        demonstracao: [
          { type: "chords", root: "C4", qualities: ["maior", "menor"] },
          { type: "audio", label: "Acorde de Dó maior com as notas separadas", notes: ["C4", "E4", "G4", ["C4", "E4", "G4"]], tempo: 70 },
          { type: "intervals", root: "C4", semitones: [2, 4, 7, 11] },
        ],
        exercicioGuiado: {
          passos: [
            "Toque Dó maior e Dó menor alternadamente e perceba a diferença da terça.",
            "Ouça o acorde arpejado e cante cada nota: fundamental, terça e quinta.",
            "Ouça o acorde em bloco e cante só a nota mais grave; depois só a mais aguda.",
            "Faça a prática de maior/menor e a avaliação de notas extremas.",
          ],
        },
        pratiqueSozinho: { passos: ["Laboratório de acordes no nível recomendado.", "Laboratório de consonância e dissonância."], minutos: 8, frequencia: "3 vezes por semana" },
        errosComuns: [
          { erro: "Achar que acorde menor é “triste” sempre.", correcao: "O caráter depende do contexto; use a terça como referência, não a emoção." },
          { erro: "Perder a nota grave quando o acorde é longo.", correcao: "Cante baixinho a nota que você acha que é a mais grave enquanto o acorde soa." },
        ],
        seguranca: SEGURANCA_ESCUTA,
        criterioAvanco: "Acertar pelo menos 70% nas avaliações de tipo de acorde e de nota extrema.",
      },
      exercises: [
        { slug: "acordes-maior-menor-avaliacao", title: "Avaliação: maior ou menor?", instructions: "Ouça o acorde arpejado e em bloco.", type: "chord_quality", config: { rounds: 8, qualities: ["maior", "menor"], play: "ambos" }, skill: "acordes", purpose: "avaliacao" },
        { slug: "acordes-extremos-avaliacao", title: "Avaliação: a nota mais grave", instructions: "Ouça o acorde e escolha qual opção é a nota mais grave dele.", type: "chord_extreme", config: { rounds: 6, ask: "grave", size: 3 }, skill: "acordes", purpose: "avaliacao" },
        { slug: "consonancia-pratica", title: "Prática: consonante ou dissonante?", instructions: "Ouça as duas notas juntas.", type: "consonance", config: { rounds: 8 }, skill: "consonancia", purpose: "pratica" },
      ],
    },
  ],
};
