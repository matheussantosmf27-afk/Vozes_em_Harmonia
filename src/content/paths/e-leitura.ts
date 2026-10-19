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
        explicacao: [
          {
            type: "p",
            text: "A pauta (ou pentagrama) tem cinco linhas e quatro espaços, contados de baixo para cima. Cada linha e cada espaço representam uma nota; quanto mais acima, mais aguda. Para notas além da pauta, usamos linhas suplementares.",
          },
          {
            type: "p",
            text: "A clave de Sol é desenhada começando na 2ª linha: por isso, a nota na 2ª linha é Sol (Sol4). A partir daí, as notas seguem em ordem: linha, espaço, linha, espaço…",
          },
          {
            type: "list",
            items: [
              "Linhas (de baixo para cima) na clave de Sol: Mi4, Sol4, Si4, Ré5, Fá5.",
              "Espaços (de baixo para cima): Fá4, Lá4, Dó5, Mi5 — formam a palavra “FALADOMI” (Fá-Lá-Dó-Mi).",
              "Dó4 (dó central) fica numa linha suplementar abaixo da pauta.",
              "Ré4 fica logo abaixo da 1ª linha.",
            ],
          },
          { type: "tip", title: "Notas-âncora", text: "Memorize três âncoras: Dó4 (linha suplementar), Sol4 (2ª linha, onde a clave começa) e Dó5 (3º espaço). As outras você encontra contando a partir delas." },
        ],
        demonstracao: [
          { type: "staff", clef: "sol", notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"], label: "Escala de Dó4 a Dó5 na clave de Sol" },
          { type: "staff", clef: "sol", notes: ["E4", "G4", "B4", "D5", "F5"], label: "Notas nas linhas" },
          { type: "staff", clef: "sol", notes: ["F4", "A4", "C5", "E5"], label: "Notas nos espaços (FALADOMI)" },
          { type: "keyboard", from: "C4", to: "G5", highlight: ["C4", "G4", "C5"], label: "As três notas-âncora no teclado" },
        ],
        exercicioGuiado: {
          passos: [
            "Diga em voz alta as notas das linhas e dos espaços olhando as demonstrações.",
            "Toque cada nota no teclado enquanto lê.",
            "Faça a prática com as notas entre Dó4 e Dó5.",
            "Faça a avaliação até o Sol5.",
          ],
        },
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
        explicacao: [
          {
            type: "list",
            items: [
              "Semibreve: 4 tempos (em compassos de semínima).",
              "Mínima: 2 tempos.",
              "Semínima: 1 tempo.",
              "Colcheia: meio tempo (duas por tempo).",
              "Semicolcheia: um quarto de tempo (quatro por tempo).",
              "O ponto de aumento acrescenta metade do valor: mínima pontuada = 3 tempos; semínima pontuada = 1 tempo e meio.",
              "Cada figura tem uma pausa correspondente, com a mesma duração em silêncio.",
            ],
          },
          {
            type: "p",
            text: "A fórmula de compasso aparece no início da música. O número de cima indica quantos tempos há em cada compasso; o de baixo, qual figura vale um tempo (4 = semínima). Assim, 3/4 tem três semínimas por compasso — o compasso de muitos hinos, como “Que grande amor”.",
          },
        ],
        demonstracao: [
          { type: "rhythm", pattern: "w", bpm: 80, label: "Semibreve (4 tempos)" },
          { type: "rhythm", pattern: "h h", bpm: 80, label: "Duas mínimas" },
          { type: "rhythm", pattern: "q q q q", bpm: 80, label: "Quatro semínimas" },
          { type: "rhythm", pattern: "e e e e e e e e", bpm: 80, label: "Oito colcheias" },
          { type: "rhythm", pattern: "h. q", bpm: 80, label: "Mínima pontuada e semínima" },
          { type: "rhythm", pattern: "q. e q q", bpm: 80, label: "Semínima pontuada, colcheia e duas semínimas" },
        ],
        exercicioGuiado: {
          passos: [
            "Com o metrônomo, fale “tá” em cada semínima e “tá-a” nas mínimas.",
            "Fale “ti-ti” nas colcheias.",
            "Ouça a “semínima pontuada + colcheia”: “tá—a-ti”. É o ritmo de “har-mo-ni-a” no Hino da Alegria.",
            "Faça a prática de leitura rítmica tocando os padrões.",
          ],
        },
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
        explicacao: [
          {
            type: "p",
            text: "A clave de Fá começa na 4ª linha, marcada pelos dois pontos ao redor dela: essa linha é Fá3. Ela é usada para baixos e, em muitos hinários, também para tenores.",
          },
          {
            type: "list",
            items: [
              "Linhas na clave de Fá (de baixo para cima): Sol2, Si2, Ré3, Fá3, Lá3.",
              "Espaços: Lá2, Dó3, Mi3, Sol3.",
              "Dó4 (dó central) fica numa linha suplementar acima da pauta de Fá — a mesma nota da linha suplementar abaixo da pauta de Sol.",
              "Clave de Sol com um 8 embaixo: usada pelo tenor; soa uma oitava abaixo do que está escrito.",
            ],
          },
          { type: "tip", title: "Pauta dupla", text: "Nos hinários SATB, soprano e contralto leem na clave de Sol (pauta de cima), tenor e baixo na clave de Fá (pauta de baixo). O dó central liga as duas pautas." },
        ],
        demonstracao: [
          { type: "staff", clef: "fa", notes: ["G2", "B2", "D3", "F3", "A3"], label: "Linhas na clave de Fá" },
          { type: "staff", clef: "fa", notes: ["A2", "C3", "E3", "G3"], label: "Espaços na clave de Fá" },
          { type: "staff", clef: "fa", notes: ["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"], label: "Escala de Dó3 a Dó4" },
        ],
        exercicioGuiado: {
          passos: [
            "Leia em voz alta as linhas e espaços da clave de Fá.",
            "Toque no teclado as notas da escala de Dó3 a Dó4 enquanto lê.",
            "Faça a prática e a avaliação.",
          ],
        },
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
        explicacao: [
          {
            type: "list",
            items: [
              "Segunda: de linha para o espaço vizinho (notas “encostadas”).",
              "Terça: de linha para a linha seguinte, ou de espaço para o espaço seguinte.",
              "Quarta: de linha para espaço, pulando uma linha.",
              "Quinta: de linha para linha pulando uma, ou de espaço para espaço pulando um.",
              "Oitava: linha ↔ espaço com mesma letra (Dó4 → Dó5).",
            ],
          },
          {
            type: "p",
            text: "Saber ver um intervalo ajuda a cantar à primeira vista: se a sua próxima nota está uma terça acima, você já sabe que é a distância do início de um acorde maior ou menor.",
          },
        ],
        demonstracao: [
          { type: "staff", clef: "sol", notes: ["E4", "G4"], label: "Terça (linha → linha)" },
          { type: "staff", clef: "sol", notes: ["G4", "D5"], label: "Quinta (linha → linha pulando uma)" },
          { type: "staff", clef: "sol", notes: ["C4", "C5"], label: "Oitava" },
          { type: "intervals", root: "E4", semitones: [3, 7, 12] },
        ],
        exercicioGuiado: {
          passos: ["Observe as demonstrações e toque cada intervalo.", "Cante cada intervalo depois de ouvi-lo.", "Faça a avaliação de intervalos na pauta."],
        },
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
        explicacao: [
          {
            type: "list",
            items: [
              "Letras: A = Lá, B = Si, C = Dó, D = Ré, E = Mi, F = Fá, G = Sol.",
              "Acidentes: ♯ (sustenido) sobe meio-tom; ♭ (bemol) desce meio-tom. Ex.: F♯ = Fá sustenido; B♭ = Si bemol.",
              "Letra sozinha = acorde maior (C = Dó maior: Dó, Mi, Sol).",
              "“m” = menor (Am = Lá menor: Lá, Dó, Mi).",
              "“7” = sétima menor acrescentada (G7 = Sol, Si, Ré, Fá).",
              "“7M” ou “maj7” = sétima maior (C7M = Dó, Mi, Sol, Si).",
              "“°” ou “dim” = diminuto; “+” ou “aug” = aumentado.",
              "Barra = baixo invertido: D/F♯ é Ré maior com Fá♯ no baixo.",
            ],
          },
          {
            type: "p",
            text: "Para quem canta, a cifra ajuda a saber em que acorde a sua nota está. Se a cifra é C e você canta Mi, você está na terça do acorde; se canta Sol, está na quinta.",
          },
        ],
        demonstracao: [
          { type: "chords", root: "C4", qualities: ["maior", "menor", "dominante7"] },
          { type: "audio", label: "G7 (Sol–Si–Ré–Fá)", notes: [["G3", "B3", "D4", "F4"]], mode: "chord", tempo: 30 },
          { type: "audio", label: "D/F♯ (Ré maior com Fá♯ no baixo)", notes: [["F#3", "D4", "F#4", "A4"]], mode: "chord", tempo: 30 },
        ],
        exercicioGuiado: {
          passos: ["Escreva as notas de C, F, G e Am.", "Toque-as no teclado e confira com as demonstrações.", "Faça a avaliação de cifras."],
        },
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
        explicacao: [
          {
            type: "list",
            items: [
              "Sistema: conjunto de pautas lidas ao mesmo tempo. Num hinário SATB, duas pautas (S/C em cima, T/B embaixo).",
              "Hastes para cima e para baixo: na mesma pauta, hastes para cima = voz de cima (soprano ou tenor); para baixo = voz de baixo (contralto ou baixo).",
              "Texto: fica entre as pautas; as estrofes aparecem numeradas.",
              "Sinais de repetição (:‖), casas de 1ª e 2ª vez, D.C. (do início) e D.S. (do sinal) indicam o caminho da leitura.",
              "Dinâmicas (p, mf, f), crescendo e respirações (vírgula ou “V”).",
              "Fermata (𝄐): sustente a nota além do valor, conforme o regente.",
              "Números de compasso ajudam a combinar onde recomeçar no ensaio.",
            ],
          },
          { type: "tip", title: "Marcações a lápis", text: "Marque a sua voz com marca-texto, as respirações com “V” e os trechos difíceis com um círculo. Revise as marcações após cada ensaio." },
        ],
        demonstracao: [
          { type: "staff", clef: "sol", notes: ["E4", "E4", "F4", "G4"], label: "Primeiro compasso do soprano no Hino da Alegria" },
          { type: "staff", clef: "fa", notes: ["C3", "C3", "F3", "C3"], label: "Primeiro compasso do baixo no Hino da Alegria" },
          { type: "harmonyLink", arrangement: "hino-alegria-satb", label: "Siga a sua voz no treinador com a representação das notas" },
        ],
        exercicioGuiado: {
          passos: [
            "Abra o Hino da Alegria SATB no treinador e acompanhe a sua voz na representação de notas.",
            "Identifique em que compasso há um ritmo pontuado.",
            "Leia o ritmo falando o texto antes de cantar.",
            "Marque respirações e trechos difíceis (no treinador, use “marcar trecho”).",
          ],
        },
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
