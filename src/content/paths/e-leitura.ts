import type { PathDef } from "../types";

const PAUSAS = ["A leitura cansa a vista e a mente: faça pausas curtas a cada 15 minutos."];

export const trilhaE: PathDef = {
  slug: "leitura-musical",
  code: "E",
  title: "Leitura musical",
  subtitle: "Da pauta à partitura vocal",
  description:
    "Ler música dá autonomia para estudar a própria voz. A trilha cobre notas na pauta, figuras rítmicas e compassos, claves, intervalos escritos, cifras e a leitura de partituras corais.",
  icon: "book-open",
  lessons: [
    {
      slug: "notas-na-pauta",
      title: "Notas na pauta",
      summary: "Linhas, espaços e a clave de Sol.",
      level: 1,
      minutes: 20,
      skills: ["leitura-pauta"],
      content: {
        objetivo: "Ler as notas naturais na clave de Sol, da região do dó central até o Sol5.",
        gancho: "Cinco linhas, quatro espaços e uma palavra mágica: FALADOMI. Em poucos minutos você vai ler a linha do soprano de um hino sem pedir ajuda.",
        etapas: [
          {
            titulo: "Uma escada de cinco linhas",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "pauta", caption: "Linhas e espaços contam de baixo para cima." },
              {
                type: "p",
                text: "A pauta (ou pentagrama) tem cinco linhas e quatro espaços. Cada linha e cada espaço é uma nota. Quanto mais acima, mais aguda. Para ir além da pauta, usamos pequenas linhas extras: as linhas suplementares.",
              },
              {
                type: "check",
                question: "Uma nota na 4ª linha soa mais aguda ou mais grave que uma nota na 2ª linha?",
                options: ["Mais aguda", "Mais grave", "Igual: as duas estão em linhas"],
                answer: 0,
                explain: "Na pauta, subir é ficar mais agudo. A 4ª linha está acima da 2ª, então a nota é mais aguda.",
              },
            ],
          },
          {
            titulo: "A clave que abraça o Sol",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "claves", caption: "A clave de Sol começa enrolada na 2ª linha." },
              {
                type: "callout",
                icon: "olho",
                title: "Siga o caracol",
                text: "O desenho da clave de Sol começa com um caracol enrolado na 2ª linha. Essa linha é o Sol (Sol4). Daí em diante é só contar: linha, espaço, linha, espaço…",
              },
              {
                type: "check",
                question: "Qual é esta nota?",
                staff: { clef: "sol", notes: ["G4"] },
                options: ["Sol", "Lá", "Mi", "Fá"],
                answer: 0,
                explain: "Está na 2ª linha, onde a clave de Sol se enrola. É o Sol4, sua primeira âncora.",
              },
            ],
          },
          {
            titulo: "FALADOMI: os espaços",
            tipo: "descobrir",
            blocos: [
              { type: "staff", clef: "sol", notes: ["F4", "A4", "C5", "E5"], label: "Os quatro espaços: Fá, Lá, Dó, Mi" },
              {
                type: "callout",
                icon: "ideia",
                title: "Uma palavra só",
                text: "Lendo os espaços de baixo para cima você tem Fá-Lá-Dó-Mi. Junte tudo: “FALADOMI”. Repita três vezes em voz alta e não esquece mais.",
              },
              {
                type: "check",
                question: "Qual é esta nota?",
                staff: { clef: "sol", notes: ["C5"] },
                options: ["Dó", "Lá", "Si", "Ré"],
                answer: 0,
                explain: "É o 3º espaço: Fá, Lá, DÓ. Esse Dó5 é mais uma âncora.",
              },
            ],
          },
          {
            titulo: "As linhas pulam uma nota",
            tipo: "descobrir",
            blocos: [
              { type: "staff", clef: "sol", notes: ["E4", "G4", "B4", "D5", "F5"], label: "As cinco linhas: Mi, Sol, Si, Ré, Fá" },
              {
                type: "callout",
                icon: "musica",
                title: "Mi, Sol, Si, Ré, Fá",
                text: "De uma linha para a seguinte você pula uma nota: Mi (Fá) Sol (Lá) Si (Dó) Ré (Mi) Fá. As notas puladas são justamente o FALADOMI dos espaços.",
              },
              {
                type: "check",
                question: "Qual é esta nota?",
                staff: { clef: "sol", notes: ["E4"] },
                options: ["Mi", "Fá", "Ré", "Sol"],
                answer: 0,
                explain: "1ª linha, a de baixo: Mi4. Uma linha abaixo do Sol da clave, pulando o Fá.",
              },
            ],
          },
          {
            titulo: "Três âncoras no teclado",
            tipo: "experimentar",
            blocos: [
              { type: "illustration", name: "linhas-suplementares", caption: "O Dó central mora numa linha suplementar abaixo da pauta." },
              { type: "keyboard", from: "C4", to: "G5", highlight: ["C4", "G4", "C5"], label: "Âncoras: Dó4, Sol4 e Dó5" },
              { type: "staff", clef: "sol", notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"], label: "Escala de Dó4 a Dó5" },
              {
                type: "timer",
                instruction: "Aponte cada nota da escala e diga o nome em voz alta. Toque no teclado se quiser conferir. O Ré4 fica logo abaixo da 1ª linha.",
                seconds: 30,
              },
            ],
          },
          {
            titulo: "Qual é esta nota?",
            tipo: "checar",
            blocos: [
              {
                type: "check",
                question: "Qual é esta nota?",
                staff: { clef: "sol", notes: ["A4"] },
                options: ["Lá", "Sol", "Si", "Dó"],
                answer: 0,
                explain: "2º espaço: Fá, LÁ. Ou parta da âncora Sol (2ª linha) e suba um degrau.",
              },
              {
                type: "check",
                question: "Qual é esta nota?",
                staff: { clef: "sol", notes: ["D4"] },
                options: ["Ré", "Dó", "Mi", "Si"],
                answer: 0,
                explain: "Fica logo abaixo da 1ª linha (Mi), sem linha suplementar: é o Ré4.",
              },
              {
                type: "check",
                question: "Qual é esta nota?",
                staff: { clef: "sol", notes: ["F5"] },
                options: ["Fá", "Mi", "Sol", "Ré"],
                answer: 0,
                explain: "5ª linha, a última de cima: Mi, Sol, Si, Ré, FÁ.",
              },
            ],
          },
          {
            titulo: "Leia um hino de verdade",
            tipo: "aplicar",
            blocos: [
              { type: "staff", clef: "sol", notes: ["E4", "E4", "F4", "G4", "G4", "F4", "E4", "D4"], label: "Início do soprano no Hino da Alegria" },
              {
                type: "reveal",
                prompt: "Diga os nomes das oito notas antes de tocar para ver.",
                answer: "Mi, Mi, Fá, Sol, Sol, Fá, Mi, Ré. Usou as âncoras? O Sol da 2ª linha resolve quase tudo aqui.",
              },
              { type: "toolLink", tool: "teclado", label: "Toque a frase no teclado e cante junto" },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "match",
                prompt: "Ligue cada lugar da pauta (clave de Sol) à sua nota.",
                pairs: [
                  { left: "Linha suplementar abaixo", right: "Dó4" },
                  { left: "1ª linha", right: "Mi4" },
                  { left: "2ª linha", right: "Sol4" },
                  { left: "3º espaço", right: "Dó5" },
                  { left: "5ª linha", right: "Fá5" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: { passos: ["5 minutos de leitura de notas por dia.", "Leia a linha do soprano de um hino conhecido dizendo os nomes das notas."], minutos: 5, frequencia: "Diariamente por duas semanas" },
        errosComuns: [
          { erro: "Contar as linhas de cima para baixo.", correcao: "Linhas e espaços são contados de baixo para cima." },
          { erro: "Confundir notas em linha e em espaço vizinhos.", correcao: "Olhe se a linha passa pelo meio da nota (linha) ou se a nota está entre duas linhas (espaço)." },
        ],
        seguranca: PAUSAS,
        criterioAvanco: "Acertar pelo menos 70% na avaliação de leitura na clave de Sol.",
      },
      exercises: [
        { slug: "pauta-pratica", title: "Prática: Dó4 a Dó5", instructions: "Qual é o nome da nota?", type: "staff_read", config: { rounds: 8, clef: "sol", range: ["C4", "C5"] }, skill: "leitura-pauta", purpose: "pratica" },
        { slug: "pauta-avaliacao", title: "Avaliação: clave de Sol", instructions: "Qual é o nome da nota?", type: "staff_read", config: { rounds: 10, clef: "sol", range: ["C4", "G5"] }, skill: "leitura-pauta", purpose: "avaliacao" },
      ],
    },
    {
      slug: "figuras-ritmicas-e-compassos",
      title: "Ritmo: figuras e compassos",
      summary: "Semibreve, mínima, semínima, colcheia, pausas e fórmulas de compasso.",
      level: 1,
      minutes: 25,
      skills: ["leitura-ritmica", "ritmo-pulsacao"],
      content: {
        objetivo: "Ler as figuras rítmicas e as pausas mais comuns e compreender os compassos simples 2/4, 3/4 e 4/4.",
        gancho: "Ritmo é matemática que se dança. Com uma pizza imaginária e três sílabas (tá, ti-ti, tá-a) você vai ler qualquer ritmo de hino.",
        etapas: [
          {
            titulo: "A pizza do ritmo",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "figuras-ritmicas", caption: "Cada figura vale metade da anterior." },
              {
                type: "callout",
                icon: "ideia",
                title: "Corte a pizza ao meio",
                text: "A semibreve é a pizza inteira: 4 tempos. A mínima é meia pizza: 2 tempos. A semínima, um quarto: 1 tempo. A colcheia, meio tempo. A semicolcheia, um quarto de tempo.",
              },
              {
                type: "check",
                question: "Quantas semínimas cabem numa mínima?",
                options: ["2", "4", "1", "3"],
                answer: 0,
                explain: "A mínima vale 2 tempos e a semínima vale 1. Meia pizza = dois pedaços de um quarto.",
              },
            ],
          },
          {
            titulo: "Ouça as figuras",
            tipo: "ouvir",
            blocos: [
              { type: "p", text: "Os quatro exemplos ocupam o mesmo espaço: um compasso de 4 tempos. Só muda quantas notas cabem nele." },
              { type: "rhythm", pattern: "w", bpm: 80, label: "Semibreve (4 tempos)" },
              { type: "rhythm", pattern: "h h", bpm: 80, label: "Duas mínimas" },
              { type: "rhythm", pattern: "q q q q", bpm: 80, label: "Quatro semínimas" },
              { type: "rhythm", pattern: "e e e e e e e e", bpm: 80, label: "Oito colcheias (duas por tempo)" },
            ],
          },
          {
            titulo: "Fale o ritmo",
            tipo: "experimentar",
            blocos: [
              {
                type: "list",
                items: ["Semínima: “tá” (1 tempo).", "Duas colcheias: “ti-ti” (as duas num tempo).", "Mínima: “tá-a” (segure por 2 tempos)."],
              },
              { type: "rhythm", pattern: "q e e q q", bpm: 72, label: "tá, ti-ti, tá, tá" },
              { type: "rhythm", pattern: "q q h", bpm: 72, label: "tá, tá, tá-a" },
              { type: "timer", instruction: "Bata o pé no pulso e fale as sílabas dos dois ritmos acima, duas vezes cada.", seconds: 30 },
            ],
          },
          {
            titulo: "O ponto que estica",
            tipo: "descobrir",
            blocos: [
              {
                type: "callout",
                icon: "estrela",
                title: "Ponto = mais metade",
                text: "O ponto de aumento soma metade do valor da figura. Mínima pontuada: 2 + 1 = 3 tempos. Semínima pontuada: 1 + ½ = 1 tempo e meio.",
              },
              { type: "rhythm", pattern: "h. q", bpm: 80, label: "Mínima pontuada e semínima" },
              { type: "rhythm", pattern: "q. e q q", bpm: 80, label: "“tá—a-ti, tá, tá”" },
              {
                type: "check",
                question: "Quanto vale uma semínima pontuada?",
                options: ["1 tempo e meio", "2 tempos", "1 tempo", "3 tempos"],
                answer: 0,
                explain: "Semínima = 1 tempo; metade dela = meio tempo. Somando: 1 tempo e meio.",
              },
            ],
          },
          {
            titulo: "O silêncio também conta",
            tipo: "ouvir",
            blocos: [
              { type: "p", text: "Cada figura tem uma pausa com a mesma duração, só que em silêncio. Na pausa o pulso continua: aproveite para respirar." },
              { type: "rhythm", pattern: "rq q q q", bpm: 72, label: "Pausa de semínima e três semínimas" },
              {
                type: "trueFalse",
                items: [
                  { statement: "Na pausa, posso parar de contar.", answer: false, explain: "O pulso não para. Quem para de contar entra atrasado(a)." },
                  { statement: "A pausa de mínima vale 2 tempos de silêncio.", answer: true, explain: "Toda pausa tem o valor da figura correspondente." },
                  { statement: "O ponto também pode aparecer em pausas.", answer: true, explain: "Sim: a pausa pontuada também ganha metade do seu valor." },
                ],
              },
            ],
          },
          {
            titulo: "A fração do compasso",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "compasso", caption: "O número de cima conta os tempos; o de baixo diz qual figura vale um tempo." },
              {
                type: "p",
                text: "A fórmula de compasso aparece no início da música. Em 2/4, 3/4 e 4/4, o 4 de baixo significa que a semínima vale um tempo. O número de cima diz quantos tempos cabem em cada compasso.",
              },
              {
                type: "check",
                question: "No compasso 3/4, quanto cabe em cada compasso?",
                options: ["Três semínimas", "Três mínimas", "Quatro semínimas", "Três colcheias"],
                answer: 0,
                explain: "3 tempos (em cima), cada um valendo uma semínima (o 4 embaixo). É o compasso de muitos hinos, como “Que grande amor”.",
              },
            ],
          },
          {
            titulo: "Ritmo no ensaio",
            tipo: "aplicar",
            blocos: [
              { type: "illustration", name: "pulso" },
              {
                type: "check",
                question: "No fim da primeira frase do Hino da Alegria aparece o ritmo “tá—a-ti”, um longo e um curto. Que figuras são essas?",
                options: ["Semínima pontuada + colcheia", "Duas semínimas", "Mínima + semínima", "Duas colcheias"],
                answer: 0,
                explain: "O “tá—a” longo é a semínima pontuada (1 tempo e meio) e o “ti” curto é a colcheia (meio tempo). Juntas fecham 2 tempos.",
              },
              { type: "toolLink", tool: "metronomo", label: "Ligue o metrônomo a 72 e fale o ritmo da sua voz num hino" },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "match",
                prompt: "Ligue cada figura à sua duração (em compassos de semínima).",
                pairs: [
                  { left: "Semibreve", right: "4 tempos" },
                  { left: "Mínima pontuada", right: "3 tempos" },
                  { left: "Mínima", right: "2 tempos" },
                  { left: "Semínima", right: "1 tempo" },
                  { left: "Colcheia", right: "Meio tempo" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: { passos: ["Leia o ritmo da sua voz numa partitura do repertório, falando as sílabas no tempo.", "Exercício de ritmo com padrões pontuados."], minutos: 8, frequencia: "3 vezes por semana" },
        errosComuns: [
          { erro: "Ignorar o ponto de aumento.", correcao: "O ponto acrescenta metade do valor da figura." },
          { erro: "Pular pausas.", correcao: "Pausas também são contadas: o silêncio faz parte do ritmo." },
        ],
        seguranca: PAUSAS,
        criterioAvanco: "Acertar pelo menos 70% nas avaliações de leitura rítmica.",
      },
      exercises: [
        { slug: "ritmo-pontuado-pratica", title: "Prática: ritmos pontuados", instructions: "Ouça e reproduza.", type: "rhythm_tap", config: { rounds: 4, patterns: ["h. q", "q. e q q", "q q. e q", "q. e h"], bpm: 72 }, skill: "leitura-ritmica", purpose: "pratica" },
        {
          slug: "figuras-avaliacao",
          title: "Avaliação: figuras e compassos",
          instructions: "Responda sobre figuras e compassos.",
          type: "quiz",
          config: {
            questions: [
              { q: "Em 4/4, quantos tempos vale a mínima?", options: ["2", "1", "4", "3"], answer: 0 },
              { q: "Quantas colcheias cabem em um tempo de semínima?", options: ["2", "1", "4", "8"], answer: 0 },
              { q: "Quanto vale uma mínima pontuada?", options: ["3 tempos", "2 tempos", "2 tempos e meio", "4 tempos"], answer: 0 },
              { q: "No compasso 3/4, cada compasso tem…", options: ["Três semínimas", "Três mínimas", "Quatro semínimas", "Três colcheias"], answer: 0 },
              { q: "Uma pausa de semínima vale…", options: ["1 tempo de silêncio", "Meio tempo", "2 tempos", "Nenhum tempo"], answer: 0 },
            ],
          },
          skill: "leitura-ritmica",
          purpose: "avaliacao",
        },
      ],
    },
    {
      slug: "claves",
      title: "Claves de Sol e de Fá",
      summary: "Leitura na clave de Fá e a clave de Sol do tenor.",
      level: 2,
      minutes: 20,
      skills: ["leitura-pauta"],
      content: {
        objetivo: "Ler notas na clave de Fá (vozes graves) e entender a clave de Sol oitavada usada para o tenor.",
        gancho: "Tenores e baixos, esta aula é de vocês (e de quem quer entender a pauta de baixo do hinário). A clave de Fá tem dois pontinhos que entregam o segredo.",
        etapas: [
          {
            titulo: "Duas claves, duas regiões",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "claves", caption: "Clave de Sol para as vozes agudas; clave de Fá para as graves." },
              {
                type: "p",
                text: "A clave diz qual nota mora em cada linha. A de Sol serve às vozes agudas. A de Fá serve aos baixos e, em muitos hinários, também aos tenores.",
              },
              {
                type: "check",
                question: "Por que os baixos leem na clave de Fá?",
                options: ["Porque as notas graves ficam dentro da pauta, sem muitas linhas suplementares", "Porque a clave de Fá é mais fácil", "Porque baixos não usam notas"],
                answer: 0,
                explain: "Na clave de Sol, as notas do baixo ficariam muito abaixo da pauta, cheias de linhas suplementares. A clave de Fá traz essa região para dentro das cinco linhas.",
              },
            ],
          },
          {
            titulo: "Os dois pontinhos marcam o Fá",
            tipo: "descobrir",
            blocos: [
              {
                type: "callout",
                icon: "olho",
                title: "Um sanduíche de pontos",
                text: "A clave de Fá começa na 4ª linha, e os dois pontos ficam um acima e outro abaixo dela. A linha “recheada” pelos pontos é o Fá3, sua âncora.",
              },
              { type: "staff", clef: "fa", notes: ["F3"], label: "Fá3 na 4ª linha" },
              {
                type: "check",
                question: "Qual é esta nota?",
                staff: { clef: "fa", notes: ["F3"] },
                options: ["Fá", "Lá", "Ré", "Sol"],
                answer: 0,
                explain: "4ª linha, entre os dois pontos da clave: Fá3.",
              },
            ],
          },
          {
            titulo: "Linhas e espaços da clave de Fá",
            tipo: "descobrir",
            blocos: [
              { type: "staff", clef: "fa", notes: ["G2", "B2", "D3", "F3", "A3"], label: "Linhas: Sol, Si, Ré, Fá, Lá" },
              { type: "staff", clef: "fa", notes: ["A2", "C3", "E3", "G3"], label: "Espaços: Lá, Dó, Mi, Sol" },
              {
                type: "callout",
                icon: "ideia",
                title: "Truque das duas notas",
                text: "Sabe ler na clave de Sol? Leia a posição como se fosse clave de Sol e suba duas notas no nome. 1ª linha: Mi vira Sol. 1º espaço: Fá vira Lá. 4ª linha: Ré vira Fá.",
              },
            ],
          },
          {
            titulo: "Qual é esta nota? (clave de Fá)",
            tipo: "checar",
            blocos: [
              {
                type: "check",
                question: "Qual é esta nota?",
                staff: { clef: "fa", notes: ["C3"] },
                options: ["Dó", "Lá", "Mi", "Si"],
                answer: 0,
                explain: "2º espaço: Lá, DÓ. Pelo truque: na clave de Sol seria Lá; duas notas acima, Dó.",
              },
              {
                type: "check",
                question: "Qual é esta nota?",
                staff: { clef: "fa", notes: ["A3"] },
                options: ["Lá", "Fá", "Sol", "Dó"],
                answer: 0,
                explain: "5ª linha, a de cima: Sol, Si, Ré, Fá, LÁ. Uma linha acima da âncora Fá.",
              },
              {
                type: "check",
                question: "Qual é esta nota?",
                staff: { clef: "fa", notes: ["D3"] },
                options: ["Ré", "Si", "Fá", "Mi"],
                answer: 0,
                explain: "3ª linha, a do meio: uma linha abaixo do Fá (pulando o Mi). É o Ré3.",
              },
            ],
          },
          {
            titulo: "O Dó central une as pautas",
            tipo: "experimentar",
            blocos: [
              { type: "illustration", name: "linhas-suplementares", caption: "O mesmo Dó4 aparece acima da pauta de Fá e abaixo da pauta de Sol." },
              { type: "staff", clef: "fa", notes: ["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"], label: "Escala de Dó3 a Dó4 na clave de Fá" },
              { type: "keyboard", from: "C3", to: "C5", highlight: ["C3", "F3", "C4"], label: "Dó3, a âncora Fá3 e o Dó central" },
              { type: "timer", instruction: "Leia a escala em voz alta, nota por nota, e toque cada uma no teclado.", seconds: 30 },
            ],
          },
          {
            titulo: "O 8 do tenor",
            tipo: "ouvir",
            blocos: [
              {
                type: "p",
                text: "Algumas partituras escrevem o tenor na clave de Sol com um 8 pequeno embaixo. O 8 avisa: cante uma oitava abaixo do que está escrito.",
              },
              {
                type: "compare",
                prompt: "A nota escrita é Sol4 na clave de Sol com 8. Ouça as duas e veja qual o tenor canta.",
                options: [
                  { label: "Sol4 (como está escrito)", notes: ["G4"] },
                  { label: "Sol3 (uma oitava abaixo)", notes: ["G3"] },
                ],
                explain: "O tenor canta Sol3, uma oitava abaixo. O desenho fica igual ao das vozes agudas, mas o som é o da voz masculina.",
              },
              {
                type: "check",
                question: "Num hinário SATB de duas pautas, quem lê na pauta de baixo (clave de Fá)?",
                options: ["Tenor e baixo", "Soprano e contralto", "Só o baixo", "Contralto e tenor"],
                answer: 0,
                explain: "Soprano e contralto ficam na pauta de cima (clave de Sol); tenor e baixo, na de baixo (clave de Fá).",
              },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "match",
                prompt: "Ligue cada pista ao que ela indica.",
                pairs: [
                  { left: "Caracol na 2ª linha", right: "Sol4 (clave de Sol)" },
                  { left: "Dois pontos na 4ª linha", right: "Fá3 (clave de Fá)" },
                  { left: "Linha suplementar acima da pauta de Fá", right: "Dó4 (dó central)" },
                  { left: "Clave de Sol com 8 embaixo", right: "Soa uma oitava abaixo" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: { passos: ["5 minutos de leitura na clave de Fá.", "Leia a linha do baixo de um hino conhecido."], minutos: 5, frequencia: "Diariamente por duas semanas" },
        errosComuns: [{ erro: "Ler a clave de Fá como se fosse a de Sol.", correcao: "Comece sempre pela âncora: a 4ª linha é Fá." }],
        seguranca: PAUSAS,
        criterioAvanco: "Acertar pelo menos 70% na avaliação da clave de Fá.",
      },
      exercises: [
        { slug: "clave-fa-pratica", title: "Prática: clave de Fá", instructions: "Qual é o nome da nota?", type: "staff_read", config: { rounds: 8, clef: "fa", range: ["C3", "C4"] }, skill: "leitura-pauta", purpose: "pratica" },
        { slug: "clave-fa-avaliacao", title: "Avaliação: claves de Sol e de Fá", instructions: "As notas aparecem nas duas claves.", type: "staff_read", config: { rounds: 10, clef: "ambas" }, skill: "leitura-pauta", purpose: "avaliacao" },
      ],
    },
    {
      slug: "intervalos-na-pauta",
      title: "Intervalos na pauta",
      summary: "Ver e ouvir a distância entre as notas escritas.",
      level: 2,
      minutes: 20,
      skills: ["leitura-pauta", "intervalos"],
      content: {
        objetivo: "Reconhecer intervalos na pauta pela posição das notas e relacioná-los ao som.",
        gancho: "Ler nota por nota é lento. Quem lê bem enxerga distâncias: “subiu uma terça”, “desceu uma quinta”. Vamos treinar o olho para ver saltos na pauta.",
        etapas: [
          {
            titulo: "Conte nos dedos, incluindo a primeira",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "intervalo-escada", caption: "Cada degrau da escada é uma nota." },
              {
                type: "callout",
                icon: "maos",
                title: "Dedos na mão",
                text: "Para saber o intervalo, conte as notas incluindo a primeira e a última. Dó, Ré, Mi: três dedos, então é uma terça.",
              },
              {
                type: "check",
                question: "De Sol até Ré (subindo), qual é o intervalo?",
                options: ["Quinta", "Quarta", "Terça", "Sexta"],
                answer: 0,
                explain: "Sol, Lá, Si, Dó, Ré: cinco notas contando as duas pontas. Quinta.",
              },
            ],
          },
          {
            titulo: "O truque linha e espaço",
            tipo: "descobrir",
            blocos: [
              {
                type: "callout",
                icon: "ideia",
                title: "Ímpar casa com igual",
                text: "Linha para linha (ou espaço para espaço): intervalo ímpar, como terça, quinta ou sétima. Linha para espaço: intervalo par, como segunda, quarta, sexta ou oitava.",
              },
              { type: "staff", clef: "sol", notes: ["E4", "G4"], label: "Terça: linha → linha seguinte" },
              { type: "staff", clef: "sol", notes: ["A4", "B4"], label: "Segunda: notas “encostadas”" },
              {
                type: "check",
                question: "Que intervalo é este?",
                staff: { clef: "sol", notes: ["G4", "D5"] },
                options: ["Quinta", "Terça", "Quarta", "Sexta"],
                answer: 0,
                explain: "Linha para linha, pulando uma linha no meio: quinta. Conferindo: Sol, Lá, Si, Dó, Ré.",
              },
            ],
          },
          {
            titulo: "Ouça o tamanho do salto",
            tipo: "ouvir",
            blocos: [
              { type: "p", text: "Agora ligue o que você vê ao que você ouve. Toque cada intervalo a partir do Mi." },
              { type: "intervals", root: "E4", semitones: [3, 7, 12] },
              {
                type: "compare",
                prompt: "Qual destes saltos é a oitava (Dó4 → Dó5)?",
                options: [
                  { label: "Dó → Sol (quinta)", notes: ["C4", "G4"], mode: "seq" },
                  { label: "Dó → Dó (oitava)", notes: ["C4", "C5"], mode: "seq" },
                  { label: "Dó → Mi (terça)", notes: ["C4", "E4"], mode: "seq" },
                ],
                answer: 1,
                explain: "Na oitava as duas notas têm o mesmo nome e soam quase como uma só, uma mais aguda que a outra.",
              },
            ],
          },
          {
            titulo: "Cante a terça",
            tipo: "experimentar",
            blocos: [
              { type: "staff", clef: "sol", notes: ["C4", "E4"], label: "Dó4 → Mi4: linha suplementar para linha" },
              { type: "audio", label: "Ouça Dó → Mi", notes: ["C4", "E4"], mode: "seq", tempo: 70 },
              { type: "singAlong", instruction: "Ouça o Mi, a terça acima do Dó, e cante-o em “lá”, sem esforço.", note: "E4", seconds: 3 },
              {
                type: "callout",
                icon: "ouvido",
                title: "Por que a terça importa",
                text: "A terça é a distância entre as duas primeiras notas de um acorde maior ou menor. Vê-la na pauta já prepara o ouvido.",
              },
            ],
          },
          {
            titulo: "Que intervalo é este?",
            tipo: "checar",
            blocos: [
              {
                type: "check",
                question: "Que intervalo é este?",
                staff: { clef: "sol", notes: ["D4", "G4"] },
                audio: { notes: ["D4", "G4"], mode: "seq", tempo: 70 },
                options: ["Quarta", "Terça", "Quinta", "Segunda"],
                answer: 0,
                explain: "Espaço (abaixo da pauta) para linha: intervalo par. Ré, Mi, Fá, Sol: quarta.",
              },
              {
                type: "check",
                question: "Que intervalo é este (clave de Fá)?",
                staff: { clef: "fa", notes: ["C3", "E3"] },
                options: ["Terça", "Quinta", "Segunda", "Oitava"],
                answer: 0,
                explain: "Espaço para o espaço seguinte: terça. Dó, Ré, Mi. O truque vale em qualquer clave.",
              },
              {
                type: "check",
                question: "Que intervalo é este?",
                staff: { clef: "sol", notes: ["C4", "C5"] },
                options: ["Oitava", "Sétima", "Quinta", "Sexta"],
                answer: 0,
                explain: "Linha suplementar para o 3º espaço, com o mesmo nome: Dó4 → Dó5, oitava.",
              },
            ],
          },
          {
            titulo: "Saltos no repertório",
            tipo: "aplicar",
            blocos: [
              {
                type: "reveal",
                prompt: "Pegue a sua voz num hino do repertório. Antes de cantar, procure o maior salto da linha. Qual é?",
                answer: "Circule-o a lápis, conte as notas e cante só esse salto algumas vezes. Saltos marcados com antecedência deixam de ser surpresa no ensaio.",
              },
              { type: "harmonyLink", arrangement: "tercas-paralelas", label: "Ouça e cante terças em paralelo no treinador" },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "match",
                prompt: "Ligue o que você vê na pauta ao intervalo.",
                pairs: [
                  { left: "Notas encostadas (linha → espaço vizinho)", right: "Segunda" },
                  { left: "Linha → linha seguinte", right: "Terça" },
                  { left: "Linha → linha, pulando uma", right: "Quinta" },
                  { left: "Mesmo nome, Dó4 → Dó5", right: "Oitava" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: { passos: ["Na sua partitura, circule os saltos de terça, quinta e oitava da sua voz e cante-os separadamente."], minutos: 6, frequencia: "2 vezes por semana" },
        errosComuns: [{ erro: "Contar o intervalo sem incluir a primeira nota.", correcao: "Conte as duas notas: de Dó a Mi são três notas (Dó, Ré, Mi) — terça." }],
        seguranca: PAUSAS,
        criterioAvanco: "Acertar pelo menos 70% na avaliação.",
      },
      exercises: [
        {
          slug: "intervalos-pauta-avaliacao",
          title: "Avaliação: intervalos escritos",
          instructions: "Observe as notas na pauta e ouça.",
          type: "quiz",
          config: {
            questions: [
              { q: "Que intervalo é este?", options: ["Terça", "Segunda", "Quinta", "Oitava"], answer: 0, staff: { clef: "sol", notes: ["E4", "G4"] }, audio: { notes: ["E4", "G4"], mode: "seq", tempo: 70 } },
              { q: "Que intervalo é este?", options: ["Quinta", "Terça", "Quarta", "Sexta"], answer: 0, staff: { clef: "sol", notes: ["G4", "D5"] }, audio: { notes: ["G4", "D5"], mode: "seq", tempo: 70 } },
              { q: "Que intervalo é este?", options: ["Segunda", "Terça", "Uníssono", "Quarta"], answer: 0, staff: { clef: "sol", notes: ["A4", "B4"] }, audio: { notes: ["A4", "B4"], mode: "seq", tempo: 70 } },
              { q: "Que intervalo é este?", options: ["Oitava", "Sétima", "Quinta", "Sexta"], answer: 0, staff: { clef: "sol", notes: ["C4", "C5"] }, audio: { notes: ["C4", "C5"], mode: "seq", tempo: 70 } },
              { q: "Que intervalo é este?", options: ["Quarta", "Terça", "Quinta", "Segunda"], answer: 0, staff: { clef: "sol", notes: ["D4", "G4"] }, audio: { notes: ["D4", "G4"], mode: "seq", tempo: 70 } },
              { q: "Que intervalo é este (clave de Fá)?", options: ["Terça", "Quinta", "Segunda", "Oitava"], answer: 0, staff: { clef: "fa", notes: ["C3", "E3"] }, audio: { notes: ["C3", "E3"], mode: "seq", tempo: 70 } },
            ],
          },
          skill: "leitura-pauta",
          purpose: "avaliacao",
        },
      ],
    },
    {
      slug: "cifras",
      title: "Cifras",
      summary: "Letras, acidentes e sufixos dos acordes.",
      level: 2,
      minutes: 20,
      skills: ["cifras"],
      content: {
        objetivo: "Ler cifras (C, Am, G7, D/F♯…) e identificar as notas que formam cada acorde.",
        gancho: "Aquelas letras em cima da letra do hino (C, Am, G7, D/F♯) não são só para o violão. Quem canta e sabe ler cifra sabe onde a própria nota mora no acorde.",
        etapas: [
          {
            titulo: "A, B, C… é Lá, Si, Dó",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "cifra", caption: "Letra = nota fundamental; o resto diz o tipo do acorde." },
              {
                type: "callout",
                icon: "ideia",
                title: "Comece no Lá",
                text: "A cifra usa letras. O alfabeto começa no Lá: A = Lá, B = Si, C = Dó, D = Ré, E = Mi, F = Fá, G = Sol. Fixe o par A = Lá e siga em frente na escala: as outras vêm em ordem.",
              },
              {
                type: "check",
                question: "A cifra E corresponde a qual nota?",
                options: ["Mi", "Ré", "Fá", "Lá"],
                answer: 0,
                explain: "A, B, C, D, E: Lá, Si, Dó, Ré, MI.",
              },
            ],
          },
          {
            titulo: "Sustenido sobe, bemol baixa",
            tipo: "descobrir",
            blocos: [
              {
                type: "callout",
                icon: "olho",
                title: "♭ de “baixo”",
                text: "♯ (sustenido) sobe meio-tom; ♭ (bemol) desce meio-tom. Lembre: o bemol parece um “b” minúsculo, de “baixar”. F♯ = Fá sustenido; B♭ = Si bemol.",
              },
              { type: "keyboard", from: "C4", to: "C5", highlight: ["F#4", "Bb4"], label: "F♯ (Fá sustenido) e B♭ (Si bemol)" },
              {
                type: "check",
                question: "No teclado, onde fica o B♭?",
                options: ["Na tecla preta logo abaixo do Si", "Na tecla preta logo acima do Si", "Na tecla branca do Lá", "Na tecla branca do Dó"],
                answer: 0,
                explain: "Bemol desce meio-tom: do Si, vá para a tecla vizinha à esquerda, a preta entre Lá e Si.",
              },
            ],
          },
          {
            titulo: "O “m” muda tudo",
            tipo: "ouvir",
            blocos: [
              { type: "p", text: "Letra sozinha é acorde maior: C = Dó, Mi, Sol. Com “m” minúsculo é menor: Cm = Dó, Mi♭, Sol. Só a nota do meio muda." },
              { type: "chords", root: "C4", qualities: ["maior", "menor"] },
              {
                type: "compare",
                prompt: "Desafio: qual destes é o Cm (Dó menor)?",
                options: [
                  { label: "C (maior)", notes: [["C4", "E4", "G4"]], mode: "chord" },
                  { label: "Cm (menor)", notes: [["C4", "Eb4", "G4"]], mode: "chord" },
                ],
                answer: 1,
                explain: "O menor soa mais escuro, mais “sério”. O maior soa mais aberto e luminoso.",
              },
            ],
          },
          {
            titulo: "O 7, o 7M e a barra",
            tipo: "descobrir",
            blocos: [
              {
                type: "list",
                items: [
                  "“7”: acrescenta a sétima menor. G7 = Sol, Si, Ré, Fá.",
                  "“7M” ou “maj7”: sétima maior. C7M = Dó, Mi, Sol, Si.",
                  "“°” ou “dim”: diminuto. “+” ou “aug”: aumentado.",
                  "Barra: a nota depois dela vai no baixo. D/F♯ = Ré maior com Fá♯ no baixo.",
                ],
              },
              { type: "audio", label: "G7 (Sol–Si–Ré–Fá)", notes: [["G3", "B3", "D4", "F4"]], mode: "chord", tempo: 30 },
              { type: "audio", label: "D/F♯ (Ré maior com Fá♯ no baixo)", notes: [["F#3", "D4", "F#4", "A4"]], mode: "chord", tempo: 30 },
              {
                type: "check",
                question: "O que significa a cifra D/F♯?",
                options: ["Ré maior com Fá♯ no baixo", "Ré e Fá♯ alternados", "Fá♯ maior", "Ré menor"],
                answer: 0,
                explain: "Antes da barra, o acorde (Ré maior); depois da barra, a nota mais grave (Fá♯).",
              },
            ],
          },
          {
            titulo: "Monte os acordes",
            tipo: "experimentar",
            blocos: [
              {
                type: "callout",
                icon: "maos",
                title: "Pula uma, pega uma",
                text: "Para montar um acorde maior ou menor, parta da letra e pegue notas pulando uma: Dó (Ré) Mi (Fá) Sol. Depois confira se a nota do meio é maior ou menor.",
              },
              { type: "keyboard", from: "C4", to: "C5", highlight: ["F4", "A4", "C5"], label: "F = Fá, Lá, Dó" },
              {
                type: "reveal",
                prompt: "Pense: quais são as notas de G e de Am?",
                answer: "G = Sol, Si, Ré. Am = Lá, Dó, Mi. Toque os dois no teclado para conferir.",
              },
              { type: "toolLink", tool: "teclado", label: "Monte C, F, G e Am no teclado" },
            ],
          },
          {
            titulo: "Onde está a sua nota?",
            tipo: "aplicar",
            blocos: [
              { type: "illustration", name: "triade", caption: "Fundamental, terça e quinta." },
              {
                type: "check",
                question: "A cifra é C e você, contralto, canta Mi. Em que posição do acorde você está?",
                options: ["Na terça", "Na fundamental", "Na quinta", "Fora do acorde"],
                answer: 0,
                explain: "C = Dó (fundamental), Mi (terça), Sol (quinta). Saber isso ajuda a afinar: a terça define se o acorde é maior ou menor.",
              },
              {
                type: "trueFalse",
                items: [
                  { statement: "Bm é Si maior.", answer: false, explain: "O “m” minúsculo indica menor: Si menor." },
                  { statement: "“7” e “7M” são a mesma coisa.", answer: false, explain: "“7” é sétima menor (a mais comum); “7M” é sétima maior." },
                  { statement: "C7 tem quatro notas: Dó, Mi, Sol, Si♭.", answer: true, explain: "A tríade de Dó maior mais a sétima menor (Si♭)." },
                ],
              },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "match",
                prompt: "Ligue cada cifra às notas do acorde.",
                pairs: [
                  { left: "C", right: "Dó, Mi, Sol" },
                  { left: "Am", right: "Lá, Dó, Mi" },
                  { left: "G7", right: "Sol, Si, Ré, Fá" },
                  { left: "C7M", right: "Dó, Mi, Sol, Si" },
                  { left: "D/F♯", right: "Ré maior, Fá♯ no baixo" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: { passos: ["Pegue a cifra de um hino do repertório e escreva as notas de cada acorde.", "Identifique em que nota do acorde a sua voz está em cada sílaba forte."], minutos: 10, frequencia: "2 vezes por semana" },
        errosComuns: [
          { erro: "Confundir “7” com “7M”.", correcao: "“7” é sétima menor (a mais comum); “7M” é sétima maior." },
          { erro: "Ler “Bm” como Si maior.", correcao: "O “m” minúsculo indica menor." },
        ],
        seguranca: PAUSAS,
        criterioAvanco: "Acertar pelo menos 70% na avaliação de cifras.",
      },
      exercises: [
        {
          slug: "cifras-avaliacao",
          title: "Avaliação: lendo cifras",
          instructions: "Responda sobre cifras.",
          type: "quiz",
          config: {
            questions: [
              { q: "Quais notas formam o acorde G?", options: ["Sol, Si, Ré", "Sol, Si♭, Ré", "Sol, Dó, Mi", "Lá, Dó, Mi"], answer: 0 },
              { q: "Quais notas formam o acorde Am?", options: ["Lá, Dó, Mi", "Lá, Dó♯, Mi", "Lá, Ré, Fá", "Mi, Sol, Si"], answer: 0 },
              { q: "O que significa a cifra D/F♯?", options: ["Ré maior com Fá♯ no baixo", "Ré e Fá♯ alternados", "Ré menor", "Fá♯ maior"], answer: 0 },
              { q: "A letra E corresponde a…", options: ["Mi", "Ré", "Fá", "Lá"], answer: 0 },
              { q: "Quantas notas tem o acorde C7?", options: ["Quatro (Dó, Mi, Sol, Si♭)", "Três", "Sete", "Duas"], answer: 0 },
              { q: "Ouça: este acorde é C ou Cm?", options: ["Cm", "C"], answer: 0, audio: { notes: [["C4", "D#4", "G4"]], mode: "chord", tempo: 30 } },
            ],
          },
          skill: "cifras",
          purpose: "avaliacao",
        },
      ],
    },
    {
      slug: "leitura-de-partituras-vocais",
      title: "Leitura aplicada a partituras vocais",
      summary: "Encontrar a sua voz, o texto, as respirações e as indicações.",
      level: 2,
      minutes: 25,
      skills: ["leitura-pauta", "leitura-ritmica"],
      content: {
        objetivo: "Orientar-se numa partitura coral: sistemas, pautas, a própria voz, texto, repetições, dinâmicas e marcações de estudo.",
        gancho: "Abriu o hinário e viu quatro vozes, duas pautas, três estrofes e um monte de sinais? Calma: a partitura é um mapa, e você vai aprender a achar o seu caminho nele.",
        etapas: [
          {
            titulo: "A partitura é um mapa",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "partitura-vocal", caption: "Um sistema: as pautas lidas ao mesmo tempo." },
              {
                type: "p",
                text: "O sistema é o conjunto de pautas lidas ao mesmo tempo. Num hinário SATB há duas: soprano e contralto em cima, tenor e baixo embaixo. O texto fica entre as pautas, com as estrofes numeradas.",
              },
              {
                type: "check",
                question: "Num hinário SATB, em que pauta está o tenor?",
                options: ["Na de baixo, junto com o baixo", "Na de cima, junto com o soprano", "Numa pauta só dele", "Na de cima, junto com o contralto"],
                answer: 0,
                explain: "Pauta de cima: soprano e contralto. Pauta de baixo: tenor e baixo.",
              },
            ],
          },
          {
            titulo: "Siga a sua haste",
            tipo: "descobrir",
            blocos: [
              {
                type: "callout",
                icon: "olho",
                title: "Cima é cima, baixo é baixo",
                text: "Duas vozes dividem a mesma pauta. Haste para cima: a voz de cima (soprano ou tenor). Haste para baixo: a voz de baixo (contralto ou baixo).",
              },
              {
                type: "trueFalse",
                items: [
                  { statement: "Na pauta de cima, as notas com haste para baixo são do contralto.", answer: true, explain: "O contralto é a voz de baixo da pauta de cima." },
                  { statement: "Na pauta de baixo, a haste para cima é do baixo.", answer: false, explain: "Haste para cima na pauta de baixo é do tenor; o baixo tem haste para baixo." },
                ],
              },
            ],
          },
          {
            titulo: "Leia e ouça o primeiro compasso",
            tipo: "ouvir",
            blocos: [
              { type: "staff", clef: "sol", notes: ["E4", "E4", "F4", "G4"], label: "Soprano, primeiro compasso do Hino da Alegria" },
              { type: "audio", label: "Ouça o soprano", notes: ["E4", "E4", "F4", "G4"], mode: "seq", tempo: 90 },
              { type: "staff", clef: "fa", notes: ["C3", "C3", "F3", "C3"], label: "Baixo, primeiro compasso do Hino da Alegria" },
              { type: "audio", label: "Ouça o baixo", notes: ["C3", "C3", "F3", "C3"], mode: "seq", tempo: 90 },
              {
                type: "check",
                question: "Qual é a primeira nota do baixo?",
                staff: { clef: "fa", notes: ["C3"] },
                options: ["Dó", "Mi", "Lá", "Fá"],
                answer: 0,
                explain: "2º espaço da clave de Fá: Lá, DÓ. É o Dó3.",
              },
            ],
          },
          {
            titulo: "O caminho da leitura",
            tipo: "descobrir",
            blocos: [
              {
                type: "list",
                items: [
                  "Sinal de repetição (:‖): volte e cante o trecho de novo.",
                  "Casas de 1ª e 2ª vez: na repetição, pule a 1ª e vá para a 2ª.",
                  "D.C. (da capo, “da cabeça”): volte ao início.",
                  "D.S. (dal segno): volte ao sinal 𝄋.",
                ],
              },
              {
                type: "callout",
                icon: "ideia",
                title: "Capo é cabeça",
                text: "Lembre: D.C. = da Cabeça (início). D.S. = do Sinal. Antes de cantar, percorra o caminho com o dedo.",
              },
              {
                type: "check",
                question: "Você chegou ao D.C. no fim da página. Para onde vai?",
                options: ["Para o início da música", "Para o sinal 𝄋", "Para a 2ª casa", "Termina ali"],
                answer: 0,
                explain: "D.C. vem do italiano da capo: “da cabeça”, ou seja, do começo.",
              },
            ],
          },
          {
            titulo: "Volume, ar e fermata",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "dinamica", caption: "p = piano (suave), mf = meio-forte, f = forte." },
              {
                type: "p",
                text: "Dinâmicas (p, mf, f) e o crescendo dizem o volume. Vírgula ou “V” marcam respiração. A fermata (𝄐) pede para sustentar a nota além do valor, conforme o regente. Os números de compasso servem para combinar onde recomeçar no ensaio.",
              },
              {
                type: "check",
                question: "Sobre uma nota aparece a fermata (𝄐). O que fazer?",
                options: ["Sustentar além do valor, olhando o regente", "Cantar mais forte", "Respirar ali", "Repetir o trecho"],
                answer: 0,
                explain: "A fermata alonga a nota. Quanto, quem decide é o regente: por isso olhe para ele(a).",
              },
            ],
          },
          {
            titulo: "Prepare a sua voz",
            tipo: "experimentar",
            blocos: [
              {
                type: "order",
                prompt: "Coloque na ordem os passos para estudar uma partitura nova.",
                items: [
                  "Encontrar a sua pauta e a direção da sua haste",
                  "Percorrer o caminho com o dedo (repetições, D.C.)",
                  "Ler o ritmo falando o texto",
                  "Cantar com as notas",
                  "Marcar respirações e trechos difíceis a lápis",
                ],
              },
              {
                type: "checklist",
                title: "Marcações a lápis",
                items: ["Minha voz destacada com marca-texto", "Respirações marcadas com “V”", "Trechos difíceis circulados", "Repetições e D.C. conferidos", "Marcações revisadas após o ensaio"],
              },
            ],
          },
          {
            titulo: "No treinador de harmonia",
            tipo: "aplicar",
            blocos: [
              { type: "rhythm", pattern: "q. e h", bpm: 80, label: "O ritmo pontuado do fim da frase: “tá—a-ti tá-a”" },
              {
                type: "reveal",
                prompt: "Abra o Hino da Alegria SATB e siga a sua voz. Em que ponto aparece esse ritmo pontuado?",
                answer: "No fim das frases (por exemplo, a primeira termina com Mi pontuado, Ré colcheia e Ré mínima). Fale o texto nesse ritmo antes de cantar e use “marcar trecho” onde travar.",
              },
              { type: "harmonyLink", arrangement: "hino-alegria-satb", label: "Siga a sua voz no Hino da Alegria SATB" },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "match",
                prompt: "Ligue cada sinal ao que ele pede.",
                pairs: [
                  { left: "D.C.", right: "Voltar ao início" },
                  { left: "D.S.", right: "Voltar ao sinal" },
                  { left: "Fermata (𝄐)", right: "Sustentar além do valor" },
                  { left: "“V” ou vírgula", right: "Respirar" },
                  { left: "Número de compasso", right: "Combinar onde recomeçar" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: { passos: ["Prepare a sua voz de uma música do repertório com marcações a lápis.", "Leve dúvidas para o professor."], minutos: 15, frequencia: "1 vez por semana" },
        errosComuns: [
          { erro: "Seguir a haste errada na pauta compartilhada.", correcao: "Confira a direção das hastes da sua voz." },
          { erro: "Esquecer as repetições.", correcao: "Antes de cantar, percorra o “caminho” da partitura com o dedo." },
        ],
        seguranca: PAUSAS,
        criterioAvanco: "Acertar pelo menos 70% da avaliação.",
      },
      exercises: [
        {
          slug: "partitura-avaliacao",
          title: "Avaliação: orientação na partitura",
          instructions: "Responda sobre leitura de partituras vocais.",
          type: "quiz",
          config: {
            questions: [
              { q: "Na pauta de cima de um hinário SATB, as notas com haste para baixo são do…", options: ["Contralto", "Soprano", "Tenor", "Baixo"], answer: 0 },
              { q: "O sinal de fermata indica…", options: ["Sustentar a nota além do valor, conforme o regente", "Repetir o trecho", "Cantar forte", "Respirar"], answer: 0 },
              { q: "D.C. significa…", options: ["Voltar ao início", "Ir para o sinal", "Diminuir o volume", "Cantar mais devagar"], answer: 0 },
              { q: "Para que servem os números de compasso no ensaio?", options: ["Combinar de onde recomeçar", "Indicar a dinâmica", "Contar os cantores", "Indicar a tonalidade"], answer: 0 },
            ],
          },
          skill: "leitura-pauta",
          purpose: "avaliacao",
        },
      ],
    },
  ],
};
