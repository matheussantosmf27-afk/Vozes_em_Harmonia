import type { PathDef } from "../types";

const PAUSAS = ["Alterne teoria e prática: depois de cada conceito, toque e cante o exemplo."];

export const trilhaF: PathDef = {
  slug: "teoria-aplicada",
  code: "F",
  title: "Teoria aplicada",
  subtitle: "Escalas, acordes, campo harmônico e transposição",
  description:
    "Teoria a serviço do ministério: entender por que as vozes se encaixam, como os acordes funcionam numa música e como escolher a tonalidade certa para o grupo.",
  icon: "library",
  lessons: [
    {
      slug: "escalas-tons-e-semitons",
      title: "Escalas, tons, semitons e armaduras",
      summary: "A fórmula da escala maior e menor e as armaduras de clave.",
      level: 2,
      minutes: 25,
      skills: ["teoria-escalas"],
      content: {
        objetivo: "Construir escalas maiores e menores a partir de tons e semitons e reconhecer as armaduras de clave mais usadas.",
        explicacao: [
          {
            type: "p",
            text: "Semitom é a menor distância entre duas notas no teclado (tecla vizinha, branca ou preta). Tom são dois semitons. Entre Mi–Fá e Si–Dó há apenas um semitom, por isso não existe tecla preta entre elas.",
          },
          {
            type: "list",
            items: [
              "Escala maior: T T S T T T S (Dó maior: Dó Ré Mi Fá Sol Lá Si Dó).",
              "Escala menor natural: T S T T S T T (Lá menor: Lá Si Dó Ré Mi Fá Sol Lá).",
              "Menor harmônica: menor natural com o 7º grau elevado — cria a sensível que conduz à tônica.",
              "Toda tonalidade maior tem uma relativa menor com a mesma armadura (Dó maior ↔ Lá menor).",
            ],
          },
          {
            type: "p",
            text: "A armadura de clave, logo após a clave, indica os sustenidos ou bemóis da tonalidade. Ordem dos sustenidos: Fá, Dó, Sol, Ré, Lá, Mi, Si. Ordem dos bemóis: Si, Mi, Lá, Ré, Sol, Dó, Fá. Exemplos: Sol maior = 1♯ (Fá♯); Ré maior = 2♯; Fá maior = 1♭ (Si♭); Si♭ maior = 2♭.",
          },
          { type: "tip", title: "Truque das armaduras", text: "Com sustenidos, a tônica maior fica meio-tom acima do último sustenido. Com bemóis, a tônica é o penúltimo bemol (exceto Fá maior, com um bemol)." },
        ],
        demonstracao: [
          { type: "scales", tonic: "C4", kinds: ["maior", "menor_natural", "menor_harmonica"] },
          { type: "keyboard", from: "C4", to: "C5", highlight: ["E4", "F4", "B4", "C5"], label: "Semitons naturais: Mi–Fá e Si–Dó" },
        ],
        exercicioGuiado: {
          passos: ["Construa a escala de Sol maior seguindo T T S T T T S no teclado (você vai precisar do Fá♯).", "Construa Fá maior (você vai precisar do Si♭).", "Ouça as escalas maior e menor e cante-as.", "Faça a avaliação."],
        },
        pratiqueSozinho: { passos: ["Laboratório: escalas maior e menor.", "Descubra a armadura de duas músicas do repertório."], minutos: 10, frequencia: "2 vezes por semana" },
        errosComuns: [{ erro: "Esquecer os semitons naturais Mi–Fá e Si–Dó.", correcao: "Olhe o teclado: não há tecla preta entre eles." }],
        seguranca: PAUSAS,
        criterioAvanco: "Acertar pelo menos 70% nas avaliações.",
      },
      exercises: [
        { slug: "escalas-escuta-avaliacao", title: "Avaliação: maior ou menor?", instructions: "Ouça a escala.", type: "scale_id", config: { rounds: 6, scales: ["maior", "menor_natural"] }, skill: "teoria-escalas", purpose: "avaliacao" },
        {
          slug: "escalas-teoria-avaliacao",
          title: "Avaliação: escalas e armaduras",
          instructions: "Responda sobre escalas e armaduras.",
          type: "quiz",
          config: {
            questions: [
              { q: "Qual é a fórmula da escala maior?", options: ["T T S T T T S", "T S T T S T T", "S T T S T T T", "T T T S T T S"], answer: 0 },
              { q: "Quantos semitons há em um tom?", options: ["2", "1", "3", "12"], answer: 0 },
              { q: "Qual é a armadura de Sol maior?", options: ["1 sustenido (Fá♯)", "1 bemol (Si♭)", "2 sustenidos", "Nenhum acidente"], answer: 0 },
              { q: "Qual é a relativa menor de Dó maior?", options: ["Lá menor", "Dó menor", "Mi menor", "Ré menor"], answer: 0 },
              { q: "Entre quais notas naturais há apenas um semitom?", options: ["Mi–Fá e Si–Dó", "Dó–Ré e Fá–Sol", "Lá–Si e Ré–Mi", "Sol–Lá e Dó–Ré"], answer: 0 },
              { q: "Uma armadura com 2 bemóis (Si♭ e Mi♭) indica, no modo maior…", options: ["Si♭ maior", "Mi♭ maior", "Fá maior", "Ré maior"], answer: 0 },
            ],
          },
          skill: "teoria-escalas",
          purpose: "avaliacao",
        },
      ],
    },
    {
      slug: "triades-e-inversoes",
      title: "Tríades e inversões",
      summary: "Acordes maiores, menores, diminutos e aumentados; estado fundamental e inversões.",
      level: 2,
      minutes: 25,
      skills: ["teoria-harmonia", "acordes"],
      content: {
        objetivo: "Formar tríades maiores, menores, diminutas e aumentadas e reconhecer o estado fundamental e as inversões.",
        explicacao: [
          {
            type: "list",
            items: [
              "Maior: terça maior + terça menor (Dó–Mi–Sol).",
              "Menor: terça menor + terça maior (Dó–Mi♭–Sol).",
              "Diminuta: terça menor + terça menor (Si–Ré–Fá).",
              "Aumentada: terça maior + terça maior (Dó–Mi–Sol♯).",
            ],
          },
          {
            type: "list",
            items: [
              "Estado fundamental: a fundamental está no baixo (Dó–Mi–Sol).",
              "1ª inversão: a terça no baixo (Mi–Sol–Dó). Cifra: C/E.",
              "2ª inversão: a quinta no baixo (Sol–Dó–Mi). Cifra: C/G.",
            ],
          },
          {
            type: "p",
            text: "Inversões permitem que as vozes se movam pouco entre acordes — por isso os arranjos vocais as usam o tempo todo. Para quem canta, saber se o acorde está invertido ajuda a entender por que a sua nota é a mais grave ou a mais aguda naquele momento.",
          },
        ],
        demonstracao: [
          { type: "chords", root: "C4", qualities: ["maior", "menor", "diminuto", "aumentado"] },
          { type: "audio", label: "Dó maior: estado fundamental, 1ª e 2ª inversão", notes: [["C4", "E4", "G4"], ["E4", "G4", "C5"], ["G4", "C5", "E5"]], tempo: 50 },
        ],
        exercicioGuiado: {
          passos: ["Forme no teclado as quatro tríades sobre Ré.", "Toque Fá maior nas três posições.", "Faça a avaliação de tipos de acorde, incluindo diminuto e aumentado."],
        },
        pratiqueSozinho: { passos: ["Laboratório de acordes (níveis 3 a 5).", "Identifique uma inversão numa música do repertório (cifra com barra)."], minutos: 10, frequencia: "2 vezes por semana" },
        errosComuns: [{ erro: "Achar que a inversão muda o tipo do acorde.", correcao: "C/E continua sendo Dó maior; muda só a nota do baixo." }],
        seguranca: PAUSAS,
        criterioAvanco: "Acertar pelo menos 70% nas avaliações.",
      },
      exercises: [
        { slug: "triades-escuta-avaliacao", title: "Avaliação: quatro tipos de tríade", instructions: "Identifique o tipo de acorde.", type: "chord_quality", config: { rounds: 8, qualities: ["maior", "menor", "diminuto", "aumentado"], play: "ambos" }, skill: "acordes", purpose: "avaliacao" },
        {
          slug: "triades-teoria-avaliacao",
          title: "Avaliação: formação e inversões",
          instructions: "Responda sobre tríades e inversões.",
          type: "quiz",
          config: {
            questions: [
              { q: "Quais notas formam Ré menor?", options: ["Ré, Fá, Lá", "Ré, Fá♯, Lá", "Ré, Fá, Lá♭", "Ré, Sol, Si"], answer: 0 },
              { q: "Si–Ré–Fá é uma tríade…", options: ["Diminuta", "Menor", "Maior", "Aumentada"], answer: 0 },
              { q: "Mi–Sol–Dó é Dó maior em…", options: ["1ª inversão", "Estado fundamental", "2ª inversão", "Não é Dó maior"], answer: 0 },
              { q: "A cifra C/G indica…", options: ["Dó maior com Sol no baixo (2ª inversão)", "Dó e Sol tocados juntos apenas", "Sol maior", "Dó com sétima"], answer: 0 },
              { q: "Por que os arranjos vocais usam inversões?", options: ["Para as vozes se moverem pouco entre os acordes", "Para mudar o tipo do acorde", "Para evitar o baixo", "Porque soam mais forte"], answer: 0 },
            ],
          },
          skill: "teoria-harmonia",
          purpose: "avaliacao",
        },
      ],
    },
    {
      slug: "campo-harmonico-e-funcoes",
      title: "Campo harmônico e funções",
      summary: "Os sete acordes da tonalidade e o papel de cada um.",
      level: 3,
      minutes: 25,
      skills: ["teoria-harmonia", "progressoes"],
      content: {
        objetivo: "Montar o campo harmônico maior e entender as funções de tônica, subdominante e dominante.",
        explicacao: [
          {
            type: "p",
            text: "Campo harmônico é o conjunto de acordes formados sobre cada nota da escala, usando apenas as notas da tonalidade. Em Dó maior: C (I), Dm (ii), Em (iii), F (IV), G (V), Am (vi), B° (vii°). Em qualquer tonalidade maior o padrão é o mesmo: maior, menor, menor, maior, maior, menor, diminuto.",
          },
          {
            type: "list",
            items: [
              "Tônica (I, e também iii e vi): repouso, “casa”.",
              "Subdominante (IV, e também ii): afastamento, preparação.",
              "Dominante (V e vii°): tensão que pede resolução na tônica.",
            ],
          },
          { type: "tip", title: "Graus em algarismos romanos", text: "Usar I–IV–V em vez de C–F–G permite falar da harmonia em qualquer tom. Por isso as progressões do laboratório aparecem em algarismos romanos." },
        ],
        demonstracao: [
          { type: "audio", label: "Campo harmônico de Dó maior", notes: [["C4", "E4", "G4"], ["D4", "F4", "A4"], ["E4", "G4", "B4"], ["F4", "A4", "C5"], ["G4", "B4", "D5"], ["A4", "C5", "E5"], ["B4", "D5", "F5"]], tempo: 70 },
          { type: "audio", label: "I – IV – V – I (repouso, afastamento, tensão, repouso)", notes: [["C3", "G3", "C4", "E4"], ["F3", "A3", "C4", "F4"], ["G3", "B3", "D4", "G4"], ["C3", "G3", "C4", "E4"]], tempo: 60 },
        ],
        exercicioGuiado: {
          passos: ["Escreva o campo harmônico de Sol maior (G, Am, Bm, C, D, Em, F♯°).", "Toque I–IV–V–I em Sol.", "Faça a avaliação de progressões."],
        },
        pratiqueSozinho: { passos: ["Laboratório de progressões.", "Na cifra de uma música do repertório, escreva o grau de cada acorde."], minutos: 10, frequencia: "2 vezes por semana" },
        errosComuns: [{ erro: "Confundir o vi com um acorde “fora do tom”.", correcao: "Am faz parte de Dó maior: é o 6º grau, com função de tônica." }],
        seguranca: PAUSAS,
        criterioAvanco: "Acertar pelo menos 70% nas avaliações.",
      },
      exercises: [
        { slug: "progressoes-avaliacao", title: "Avaliação: progressões comuns", instructions: "Qual progressão você ouviu?", type: "progression_id", config: { rounds: 6, progressions: ["I-IV-V-I", "I-V-vi-IV", "I-vi-IV-V"] }, skill: "progressoes", purpose: "avaliacao" },
        {
          slug: "campo-harmonico-avaliacao",
          title: "Avaliação: campo harmônico",
          instructions: "Responda sobre campo harmônico e funções.",
          type: "quiz",
          config: {
            questions: [
              { q: "Qual é o acorde do 5º grau em Dó maior?", options: ["G", "F", "Am", "Em"], answer: 0 },
              { q: "Qual função o acorde V exerce?", options: ["Dominante", "Tônica", "Subdominante", "Nenhuma"], answer: 0 },
              { q: "Em qualquer tom maior, o 6º grau é um acorde…", options: ["Menor", "Maior", "Diminuto", "Aumentado"], answer: 0 },
              { q: "Qual é o IV grau de Sol maior?", options: ["C", "D", "Am", "F"], answer: 0 },
              { q: "Qual acorde costuma soar como “casa”, repouso?", options: ["I", "V", "vii°", "ii"], answer: 0 },
            ],
          },
          skill: "teoria-harmonia",
          purpose: "avaliacao",
        },
      ],
    },
    {
      slug: "cadencias",
      title: "Cadências",
      summary: "Como as frases terminam: perfeita, plagal, à dominante e de engano.",
      level: 3,
      minutes: 20,
      skills: ["progressoes", "teoria-harmonia"],
      content: {
        objetivo: "Reconhecer as cadências mais comuns e usar essa percepção para cantar com segurança os finais de frase.",
        explicacao: [
          {
            type: "list",
            items: [
              "Cadência perfeita (V → I): conclusão firme. Fim de hinos e de estrofes.",
              "Cadência plagal (IV → I): o tradicional “A-mém”.",
              "Semicadência (… → V): a frase termina em suspensão, pedindo continuação.",
              "Cadência de engano (V → vi): a tensão resolve num acorde inesperado.",
            ],
          },
          {
            type: "p",
            text: "Nos finais de frase, cada voz tem um movimento típico: na cadência perfeita, a sensível (7º grau) sobe para a tônica e o baixo salta da dominante para a tônica. Conhecer esse desenho dá segurança para afinar o acorde final.",
          },
        ],
        demonstracao: [
          { type: "audio", label: "Cadência perfeita (V → I)", notes: [["G2", "D3", "B3", "G4"], ["C3", "E3", "C4", "G4"]], tempo: 50 },
          { type: "audio", label: "Cadência plagal (IV → I) — “A-mém”", notes: [["F3", "A3", "C4", "F4"], ["C3", "G3", "C4", "E4"]], tempo: 50 },
          { type: "audio", label: "Cadência de engano (V → vi)", notes: [["G2", "D3", "B3", "G4"], ["A2", "E3", "C4", "A4"]], tempo: 50 },
        ],
        exercicioGuiado: {
          passos: ["Ouça cada cadência e descreva a sensação (conclusão, suspensão, surpresa).", "Cante a voz mais aguda da cadência plagal: Fá → Mi.", "Faça a avaliação de cadências."],
        },
        pratiqueSozinho: { passos: ["Laboratório de progressões com cadências.", "Encontre uma cadência plagal num hino do repertório."], minutos: 8, frequencia: "2 vezes por semana" },
        errosComuns: [{ erro: "Confundir semicadência com fim da música.", correcao: "Na semicadência, a frase soa “em aberto”; o fim definitivo vem com a tônica." }],
        seguranca: PAUSAS,
        criterioAvanco: "Acertar pelo menos 70% na avaliação.",
      },
      exercises: [
        { slug: "cadencias-avaliacao", title: "Avaliação: qual cadência?", instructions: "Identifique a cadência.", type: "progression_id", config: { rounds: 6, progressions: ["IV-V-I", "I-IV-I", "I-V", "V-vi"] }, skill: "progressoes", purpose: "avaliacao" },
      ],
    },
    {
      slug: "tonalidade-e-transposicao",
      title: "Tonalidade e transposição",
      summary: "Mudar o tom de uma música para servir ao grupo e à congregação.",
      level: 3,
      minutes: 20,
      skills: ["teoria-escalas"],
      content: {
        objetivo: "Entender o que é tonalidade e transpor uma melodia e uma sequência de cifras para outra tonalidade.",
        explicacao: [
          {
            type: "p",
            text: "Tonalidade é o centro de uma música: a nota e o acorde de repouso (a tônica) e a escala a partir dela. Transpor é tocar ou cantar a mesma música em outra tonalidade, mantendo todos os intervalos. A melodia continua a mesma — só fica mais aguda ou mais grave.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Decida quantos semitons subir ou descer (ex.: de Dó para Ré = +2).",
              "Some esse valor a todas as notas e fundamentais dos acordes.",
              "Mantenha o tipo de cada acorde: Am em Dó vira Bm em Ré.",
              "Confira a nota mais aguda e a mais grave de cada voz depois da transposição.",
            ],
          },
          { type: "tip", title: "Por que transpor", text: "Se a melodia passa de Ré5, sopranos e congregação se cansam; se desce abaixo de Lá3, perde força. Subir ou descer um ou dois semitons pode transformar a participação da igreja." },
        ],
        demonstracao: [
          { type: "audio", label: "Melodia em Dó: Mi–Mi–Fá–Sol", notes: ["E4", "E4", "F4", "G4"], tempo: 90 },
          { type: "audio", label: "A mesma melodia em Ré: Fá♯–Fá♯–Sol–Lá", notes: ["F#4", "F#4", "G4", "A4"], tempo: 90 },
          { type: "harmonyLink", arrangement: "hino-alegria-satb", label: "No treinador, use a transposição e compare as tonalidades" },
        ],
        exercicioGuiado: {
          passos: ["Transponha C – F – G – C para Ré (+2).", "Transponha Am – Dm – E – Am para Si menor.", "No treinador, transponha o SATB em +2 e observe a nota mais aguda do soprano.", "Faça a avaliação."],
        },
        pratiqueSozinho: { passos: ["Escolha um hino e descubra a nota mais aguda e a mais grave da melodia.", "Proponha uma tonalidade confortável para o seu grupo."], minutos: 10, frequencia: "1 vez por semana" },
        errosComuns: [{ erro: "Mudar o tipo do acorde ao transpor.", correcao: "Menor continua menor; com sétima continua com sétima." }],
        seguranca: PAUSAS,
        criterioAvanco: "Acertar pelo menos 70% na avaliação.",
      },
      exercises: [
        {
          slug: "transposicao-avaliacao",
          title: "Avaliação: transposição",
          instructions: "Responda sobre tonalidade e transposição.",
          type: "quiz",
          config: {
            questions: [
              { q: "Transpondo C – F – G – C um tom acima (+2), obtemos…", options: ["D – G – A – D", "D – F – G – D", "C♯ – F♯ – G♯ – C♯", "E – A – B – E"], answer: 0 },
              { q: "Am transposto um tom acima vira…", options: ["Bm", "B", "A♯m", "Cm"], answer: 0 },
              { q: "Ao transpor, os intervalos da melodia…", options: ["Permanecem os mesmos", "Ficam maiores", "Ficam menores", "Mudam aleatoriamente"], answer: 0 },
              { q: "De Sol maior para Lá maior, quantos semitons?", options: ["+2", "+1", "+3", "−2"], answer: 0 },
              { q: "Qual é um bom motivo para transpor um louvor?", options: ["Colocar a melodia na região confortável do grupo e da congregação", "Deixar a música mais difícil", "Igualar à gravação original sempre", "Evitar acordes menores"], answer: 0 },
            ],
          },
          skill: "teoria-escalas",
          purpose: "avaliacao",
        },
      ],
    },
  ],
};
