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
        gancho: "Por que o “Dó-Ré-Mi” soa tão familiar? Por trás dele existe uma receita simples de passos grandes e pequenos. Vamos descobri-la no teclado.",
        etapas: [
          {
            titulo: "O menor passo da música",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "tom-semitom", caption: "Semitom: tecla vizinha. Tom: dois semitons." },
              { type: "p", text: "Semitom é a menor distância entre duas notas: a tecla vizinha, branca ou preta. Tom são dois semitons." },
              { type: "keyboard", from: "C4", to: "C5", highlight: ["E4", "F4", "B4", "C5"], label: "Semitons naturais: Mi–Fá e Si–Dó" },
              {
                type: "check",
                question: "Quantos semitons há de Dó a Ré?",
                options: ["2 (um tom)", "1 (um semitom)", "3"],
                answer: 0,
                explain: "Entre Dó e Ré existe uma tecla preta (Dó♯). São dois passos de tecla vizinha: um tom.",
              },
            ],
          },
          {
            titulo: "Ouça o passo grande e o pequeno",
            tipo: "ouvir",
            blocos: [
              { type: "intervals", root: "C4", semitones: [1, 2] },
              {
                type: "compare",
                prompt: "Qual dos dois passos é um semitom?",
                options: [
                  { label: "Dó → Ré (tom)", notes: ["C4", "D4"], tempo: 70 },
                  { label: "Mi → Fá (semitom)", notes: ["E4", "F4"], tempo: 70 },
                ],
                answer: 1,
                explain: "Entre Mi e Fá não há tecla preta: o passo é de um só semitom. Entre Dó e Ré há um tom inteiro.",
              },
              { type: "tip", text: "Os únicos semitons entre notas naturais são Mi–Fá e Si–Dó. Olhe o teclado: não há tecla preta entre eles." },
            ],
          },
          {
            titulo: "A receita da escala maior",
            tipo: "descobrir",
            blocos: [
              { type: "p", text: "A escala maior segue sempre a mesma fórmula: T T S T T T S. Em Dó maior: Dó Ré Mi Fá Sol Lá Si Dó." },
              { type: "scales", tonic: "C4", kinds: ["maior"] },
              {
                type: "check",
                question: "Na escala maior, onde ficam os dois semitons?",
                options: ["Entre os graus 3–4 e 7–8", "Entre os graus 1–2 e 5–6", "Entre os graus 2–3 e 6–7"],
                answer: 0,
                explain: "T T S T T T S: o primeiro S (3º passo) cai entre Mi e Fá, graus 3–4; o último, entre Si e Dó, graus 7–8.",
              },
            ],
          },
          {
            titulo: "Sua vez: Sol maior e Fá maior",
            tipo: "experimentar",
            blocos: [
              { type: "p", text: "Toque a escala de Sol maior seguindo T T S T T T S. Depois, toque Fá maior com a mesma receita." },
              { type: "keyboard", from: "F4", to: "G5", highlight: ["G4", "A4", "B4", "C5", "D5", "E5", "F#5", "G5"], label: "Sol maior" },
              {
                type: "reveal",
                prompt: "Que nota “diferente” Sol maior precisa? E Fá maior?",
                answer: "Sol maior precisa de Fá♯: do 6º grau (Mi) ao 7º deve haver um tom, e do 7º ao Sol, um semitom. Fá maior precisa de Si♭: do 3º grau (Lá) ao 4º deve haver só um semitom.",
              },
            ],
          },
          {
            titulo: "Maior e menor: luz e sombra",
            tipo: "ouvir",
            blocos: [
              {
                type: "list",
                items: [
                  "Menor natural: T S T T S T T (Lá menor: Lá Si Dó Ré Mi Fá Sol Lá).",
                  "Menor harmônica: a natural com o 7º grau elevado. Ele vira sensível e conduz à tônica.",
                ],
              },
              { type: "scales", tonic: "C4", kinds: ["maior", "menor_natural", "menor_harmonica"] },
              {
                type: "compare",
                prompt: "Qual das duas é a escala menor?",
                options: [
                  { label: "Dó maior", notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"], tempo: 110 },
                  { label: "Dó menor natural", notes: ["C4", "D4", "Eb4", "F4", "G4", "Ab4", "Bb4", "C5"], tempo: 110 },
                ],
                answer: 1,
                explain: "A menor tem o 3º grau meio-tom mais baixo (Mi♭ em vez de Mi), além do 6º e do 7º. É isso que dá a cor mais sombria.",
              },
            ],
          },
          {
            titulo: "Armadura: o tom em resumo",
            tipo: "descobrir",
            blocos: [
              { type: "p", text: "Logo após a clave, a armadura mostra os sustenidos ou bemóis da tonalidade. Assim ninguém precisa escrevê-los em cada nota." },
              {
                type: "list",
                items: ["Ordem dos sustenidos: Fá, Dó, Sol, Ré, Lá, Mi, Si.", "Ordem dos bemóis: Si, Mi, Lá, Ré, Sol, Dó, Fá.", "Sol maior = 1♯; Ré maior = 2♯; Fá maior = 1♭; Si♭ maior = 2♭."],
              },
              {
                type: "callout",
                icon: "ideia",
                title: "Truque",
                text: "Com sustenidos, a tônica maior fica meio-tom acima do último sustenido. Com bemóis, é o penúltimo bemol (exceto Fá maior, que tem um só).",
              },
              {
                type: "check",
                question: "A armadura tem Fá♯ e Dó♯. Qual é a tonalidade maior?",
                options: ["Ré maior", "Dó♯ maior", "Sol maior", "Lá maior"],
                answer: 0,
                explain: "O último sustenido é Dó♯; meio-tom acima dele está Ré. Ré maior tem dois sustenidos.",
              },
            ],
          },
          {
            titulo: "Abra o hinário",
            tipo: "aplicar",
            blocos: [
              { type: "p", text: "Toda tonalidade maior tem uma relativa menor com a mesma armadura: Dó maior e Lá menor. Por isso, olhe também a última nota do baixo." },
              {
                type: "check",
                question: "Um hino tem um bemol (Si♭) na armadura e termina num acorde de Fá. Qual é a tonalidade?",
                options: ["Fá maior", "Ré menor", "Si♭ maior", "Sol menor"],
                answer: 0,
                explain: "Um bemol serve para Fá maior e para sua relativa, Ré menor. Como o hino repousa em Fá, a tonalidade é Fá maior.",
              },
              { type: "toolLink", tool: "teclado", label: "Toque no teclado a escala de um hino que você canta" },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "match",
                prompt: "Ligue cada termo ao seu significado.",
                pairs: [
                  { left: "Semitom", right: "Tecla vizinha" },
                  { left: "Tom", right: "Dois semitons" },
                  { left: "T T S T T T S", right: "Escala maior" },
                  { left: "T S T T S T T", right: "Escala menor natural" },
                  { left: "7º grau elevado", right: "Menor harmônica" },
                ],
              },
            ],
          },
        ],
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
        gancho: "Quando o quarteto canta um acorde, cada um segura uma peça do mesmo quebra-cabeça. Descubra quais peças existem e por que às vezes a sua nota fica embaixo, às vezes em cima.",
        etapas: [
          {
            titulo: "Três notas, um acorde",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "triade", caption: "Fundamental, terça e quinta, empilhadas em terças." },
              { type: "p", text: "Tríade é um acorde de três notas empilhadas em terças: a fundamental (que dá o nome), a terça e a quinta." },
              { type: "keyboard", from: "C4", to: "C5", highlight: ["C4", "E4", "G4"], label: "Dó maior: Dó–Mi–Sol" },
              {
                type: "check",
                question: "No acorde Dó–Mi–Sol, qual nota é a terça?",
                options: ["Mi", "Dó", "Sol"],
                answer: 0,
                explain: "Dó é a fundamental, Mi fica uma terça acima dela e Sol, uma quinta acima.",
              },
            ],
          },
          {
            titulo: "Quatro cores de acorde",
            tipo: "ouvir",
            blocos: [
              {
                type: "list",
                items: [
                  "Maior: terça maior + terça menor (Dó–Mi–Sol).",
                  "Menor: terça menor + terça maior (Dó–Mi♭–Sol).",
                  "Diminuta: terça menor + terça menor (Si–Ré–Fá).",
                  "Aumentada: terça maior + terça maior (Dó–Mi–Sol♯).",
                ],
              },
              { type: "chords", root: "C4", qualities: ["maior", "menor", "diminuto", "aumentado"] },
              { type: "tip", text: "Terça maior = 4 semitons. Terça menor = 3 semitons. Conte no teclado." },
            ],
          },
          {
            titulo: "Desafio: qual é o menor?",
            tipo: "checar",
            blocos: [
              {
                type: "compare",
                prompt: "Ouça os dois acordes. Qual deles é menor?",
                options: [
                  { label: "Dó maior", notes: ["C4", "E4", "G4", ["C4", "E4", "G4"]], tempo: 90 },
                  { label: "Dó menor", notes: ["C4", "Eb4", "G4", ["C4", "Eb4", "G4"]], tempo: 90 },
                ],
                answer: 1,
                explain: "Só a terça mudou: Mi virou Mi♭, meio-tom abaixo. Uma única nota troca a cor do acorde inteiro.",
              },
              {
                type: "check",
                question: "Ré–Fá♯–Lá é uma tríade…",
                options: ["Maior", "Menor", "Diminuta", "Aumentada"],
                answer: 0,
                explain: "Ré–Fá♯ tem 4 semitons (terça maior) e Fá♯–Lá tem 3 (terça menor): é Ré maior.",
              },
            ],
          },
          {
            titulo: "Sua vez: quatro acordes sobre Ré",
            tipo: "experimentar",
            blocos: [
              { type: "p", text: "Toque Ré–Fá♯–Lá (maior). Abaixe o Fá♯ para Fá: menor. Abaixe também o Lá para Lá♭: diminuta. Volte ao maior e suba o Lá para Lá♯: aumentada." },
              { type: "keyboard", from: "C4", to: "C5", highlight: ["D4", "F#4", "A4"], label: "Comece por Ré maior" },
              { type: "reveal", prompt: "Quais são as notas de Ré diminuto?", answer: "Ré–Fá–Lá♭: duas terças menores (3 + 3 semitons)." },
            ],
          },
          {
            titulo: "Mesmo acorde, outro baixo",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "inversoes" },
              {
                type: "list",
                items: [
                  "Estado fundamental: a fundamental no baixo (Dó–Mi–Sol). Cifra: C.",
                  "1ª inversão: a terça no baixo (Mi–Sol–Dó). Cifra: C/E.",
                  "2ª inversão: a quinta no baixo (Sol–Dó–Mi). Cifra: C/G.",
                ],
              },
              { type: "audio", label: "Dó maior: estado fundamental, 1ª e 2ª inversão", notes: [["C4", "E4", "G4"], ["E4", "G4", "C5"], ["G4", "C5", "E5"]], tempo: 50 },
              {
                type: "trueFalse",
                items: [
                  { statement: "C/E continua sendo um acorde de Dó maior.", answer: true, explain: "As notas são as mesmas (Dó, Mi, Sol). Muda só a nota do baixo." },
                  { statement: "Inverter um acorde maior o transforma em menor.", answer: false, explain: "A inversão não muda o tipo do acorde, só a ordem das notas." },
                  { statement: "Lá–Dó–Fá é Fá maior em 1ª inversão (F/A).", answer: true, explain: "Fá maior é Fá–Lá–Dó. Com o Lá, a terça, no baixo, é a 1ª inversão." },
                ],
              },
            ],
          },
          {
            titulo: "Por que os arranjos invertem",
            tipo: "ouvir",
            blocos: [
              { type: "p", text: "Inversões deixam as vozes se moverem pouco entre os acordes. Compare o baixo nas duas versões de C – G – C." },
              {
                type: "compare",
                prompt: "Ouça e repare na voz mais grave.",
                options: [
                  { label: "G em estado fundamental: o baixo salta Dó–Sol–Dó", notes: [["C3", "G3", "E4", "C5"], ["G2", "G3", "D4", "B4"], ["C3", "G3", "E4", "C5"]], tempo: 50 },
                  { label: "G/B (1ª inversão): o baixo anda Dó–Si–Dó", notes: [["C3", "G3", "E4", "C5"], ["B2", "G3", "D4", "D5"], ["C3", "G3", "E4", "C5"]], tempo: 50 },
                ],
                explain: "Com G/B, o baixo anda só um semitom. Fica mais fácil de afinar e a linha soa mais ligada. É por isso que a sua nota às vezes não é a fundamental.",
              },
            ],
          },
          {
            titulo: "Encontre no repertório",
            tipo: "aplicar",
            blocos: [
              { type: "p", text: "No arranjo abaixo, a voz grave fica quase toda no Dó. Por isso vi e IV aparecem invertidos (Am/C e F/C) e o V vem como G/B." },
              { type: "harmonyLink", arrangement: "triades-tres-vozes", label: "Treinador: tríades a três vozes (I – vi – IV – V – I)" },
              {
                type: "check",
                question: "Na cifra de um louvor aparece D/F♯. O que o baixo canta ou toca?",
                options: ["Fá♯, a terça de Ré maior", "Ré, a fundamental", "Um acorde de Fá♯ maior"],
                answer: 0,
                explain: "A nota depois da barra é o baixo. D/F♯ é Ré maior em 1ª inversão.",
              },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "match",
                prompt: "Ligue cada cifra às suas notas.",
                pairs: [
                  { left: "C", right: "Dó–Mi–Sol" },
                  { left: "Cm", right: "Dó–Mi♭–Sol" },
                  { left: "C°", right: "Dó–Mi♭–Sol♭" },
                  { left: "C+", right: "Dó–Mi–Sol♯" },
                  { left: "C/E", right: "Mi–Sol–Dó" },
                ],
              },
            ],
          },
        ],
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
        gancho: "Quase todo louvor gira em torno de uma “família” de sete acordes. Conheça essa família e você vai prever para onde a música quer ir.",
        etapas: [
          {
            titulo: "Uma família de sete acordes",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "campo-harmonico", caption: "Um acorde sobre cada nota da escala." },
              { type: "p", text: "Campo harmônico é o conjunto de tríades formadas sobre cada nota da escala, usando só notas da tonalidade. Em Dó maior: C, Dm, Em, F, G, Am, B°." },
              { type: "audio", label: "Campo harmônico de Dó maior", notes: [["C4", "E4", "G4"], ["D4", "F4", "A4"], ["E4", "G4", "B4"], ["F4", "A4", "C5"], ["G4", "B4", "D5"], ["A4", "C5", "E5"], ["B4", "D5", "F5"]], tempo: 70 },
              {
                type: "check",
                question: "Por que o acorde do 2º grau de Dó maior é Dm, e não D?",
                options: ["Porque Fá♯ não pertence a Dó maior: usa-se Fá natural", "Porque o 2º grau é sempre diminuto", "Porque D só existe em tons menores"],
                answer: 0,
                explain: "Ré maior precisaria de Fá♯. Usando só notas de Dó maior, sobre Ré forma-se Ré–Fá–Lá: Ré menor.",
              },
            ],
          },
          {
            titulo: "O padrão que nunca muda",
            tipo: "descobrir",
            blocos: [
              { type: "p", text: "Em qualquer tonalidade maior, a sequência de tipos é a mesma: maior, menor, menor, maior, maior, menor, diminuto." },
              {
                type: "callout",
                icon: "olho",
                title: "Graus em algarismos romanos",
                text: "I, IV, V em maiúsculas são maiores; ii, iii, vi em minúsculas são menores; vii° é diminuto. Assim falamos da harmonia em qualquer tom.",
              },
              { type: "reveal", prompt: "Monte o campo harmônico de Sol maior (lembre-se do Fá♯).", answer: "G, Am, Bm, C, D, Em, F♯°." },
            ],
          },
          {
            titulo: "Casa, saída e tensão",
            tipo: "ouvir",
            blocos: [
              {
                type: "list",
                items: [
                  "Tônica (I, e também iii e vi): repouso, a “casa”.",
                  "Subdominante (IV, e também ii): afastamento, preparação.",
                  "Dominante (V e vii°): tensão que pede a volta à tônica.",
                ],
              },
              { type: "audio", label: "I – IV – V – I em Dó (repouso, afastamento, tensão, repouso)", notes: [["C3", "G3", "C4", "E4"], ["F2", "A3", "C4", "F4"], ["G2", "G3", "B3", "D4"], ["C3", "G3", "C4", "E4"]], tempo: 60 },
              { type: "callout", icon: "coracao", title: "Como uma visita", text: "Você sai de casa (IV), chega ao ponto mais distante (V) e sente vontade de voltar (I)." },
            ],
          },
          {
            titulo: "Desafio: onde está a casa?",
            tipo: "checar",
            blocos: [
              {
                type: "compare",
                prompt: "Qual das duas progressões termina em repouso?",
                options: [
                  { label: "I – IV – V – I", notes: [["C3", "G3", "C4", "E4"], ["F2", "A3", "C4", "F4"], ["G2", "G3", "B3", "D4"], ["C3", "G3", "C4", "E4"]], tempo: 60 },
                  { label: "I – IV – I – V", notes: [["C3", "G3", "C4", "E4"], ["F2", "A3", "C4", "F4"], ["C3", "G3", "C4", "E4"], ["G2", "G3", "B3", "D4"]], tempo: 60 },
                ],
                answer: 0,
                explain: "Terminar no I soa como chegar em casa. Terminar no V deixa a frase suspensa, pedindo continuação.",
              },
              {
                type: "check",
                question: "Am aparece numa música em Dó maior. Ele está “fora do tom”?",
                options: ["Não: é o vi grau, com função de tônica", "Sim: acordes menores não pertencem a tons maiores", "Sim: é um acorde de dominante emprestado"],
                answer: 0,
                explain: "Am (Lá–Dó–Mi) usa só notas de Dó maior e divide Dó e Mi com o I. Por isso pode substituir a tônica.",
              },
            ],
          },
          {
            titulo: "Sua vez: I – IV – V – I em Sol",
            tipo: "experimentar",
            blocos: [
              { type: "p", text: "Toque com a mão direita: Sol–Si–Ré (G), Sol–Dó–Mi (C), Fá♯–Lá–Ré (D), Sol–Si–Ré (G). Repare que as notas mudam pouco de um acorde para o outro." },
              { type: "keyboard", from: "F4", to: "E5", highlight: ["G4", "B4", "D5"], label: "Comece em G (I de Sol maior)" },
              { type: "audio", label: "I – IV – V – I em Sol maior", notes: [["G3", "G4", "B4", "D5"], ["C3", "G4", "C5", "E5"], ["D3", "F#4", "A4", "D5"], ["G3", "G4", "B4", "D5"]], tempo: 60 },
            ],
          },
          {
            titulo: "Graus na cifra do louvor",
            tipo: "aplicar",
            blocos: [
              { type: "illustration", name: "cifra" },
              { type: "p", text: "Pegue a cifra de uma música do repertório e escreva o grau sobre cada acorde. Você logo percebe o caminho da harmonia." },
              {
                type: "check",
                question: "Um louvor está em Ré maior e aparece o acorde G. Qual é o grau?",
                options: ["IV", "V", "iii", "ii"],
                answer: 0,
                explain: "Ré maior: Ré (I), Mi (ii), Fá♯ (iii), Sol (IV). G é o IV: subdominante.",
              },
              { type: "harmonyLink", arrangement: "triades-tres-vozes", label: "Cante I – vi – IV – V – I a três vozes" },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "match",
                prompt: "Em Dó maior, ligue cada grau ao seu acorde.",
                pairs: [
                  { left: "ii", right: "Dm" },
                  { left: "IV", right: "F" },
                  { left: "V", right: "G" },
                  { left: "vi", right: "Am" },
                  { left: "vii°", right: "B°" },
                ],
              },
              {
                type: "trueFalse",
                items: [
                  { statement: "O V grau tem função de dominante: tensão que pede resolução.", answer: true, explain: "V e vii° são os acordes de dominante." },
                  { statement: "O ii grau tem função de tônica.", answer: false, explain: "O ii acompanha o IV na função de subdominante, de preparação." },
                ],
              },
            ],
          },
        ],
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
        gancho: "Por que o “A-mém” no fim do hino soa tão sereno? E por que algumas frases parecem uma pergunta? A resposta está nas cadências.",
        etapas: [
          {
            titulo: "A pontuação da música",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "cadencia", caption: "Cadência: o jeito como a frase termina." },
              {
                type: "callout",
                icon: "ideia",
                title: "Como num texto",
                text: "Uma frase pode terminar em ponto final, em vírgula ou com uma surpresa. Na música, quem faz essa pontuação são os acordes do fim da frase.",
              },
              {
                type: "list",
                items: [
                  "Perfeita (V → I): conclusão firme, o ponto final.",
                  "Plagal (IV → I): o tradicional “A-mém”.",
                  "Semicadência (… → V): frase em aberto, como uma vírgula.",
                  "De engano (V → vi): a tensão resolve num acorde inesperado.",
                ],
              },
            ],
          },
          {
            titulo: "O ponto final: V → I",
            tipo: "ouvir",
            blocos: [
              { type: "audio", label: "Cadência perfeita em Dó (G → C)", notes: [["G2", "D3", "B3", "G4"], ["C3", "E3", "C4", "G4"]], tempo: 50 },
              { type: "p", text: "Ouça de novo, prestando atenção em duas vozes: a sensível (Si, 7º grau) sobe meio-tom para a tônica (Dó), e o baixo salta de Sol para Dó." },
              { type: "singAlong", instruction: "Depois da cadência, cante a tônica (Dó) e sustente: é a nota de chegada.", note: "C4", seconds: 3 },
            ],
          },
          {
            titulo: "O “A-mém”: IV → I",
            tipo: "ouvir",
            blocos: [
              { type: "audio", label: "Cadência plagal (F → C): “A-mém”", notes: [["F2", "A3", "C4", "F4"], ["C3", "G3", "C4", "E4"]], tempo: 50 },
              { type: "p", text: "Aqui a voz mais aguda desce de Fá para Mi, enquanto o Dó fica parado nas duas sílabas. Uma resolução suave, sem a tensão da sensível." },
              { type: "singAlong", instruction: "Cante o “mém”: a nota Mi, leve e sustentada.", note: "E4", seconds: 3 },
            ],
          },
          {
            titulo: "Vírgula e surpresa",
            tipo: "ouvir",
            blocos: [
              {
                type: "check",
                question: "Ouça o fim desta frase. Como ela termina?",
                options: ["Em aberto, pedindo continuação", "Com conclusão firme", "Com o “A-mém”"],
                answer: 0,
                explain: "Terminou no V: é uma semicadência. A frase fica suspensa, esperando a próxima.",
                audio: { notes: [["C3", "G3", "C4", "E4"], ["F2", "A3", "C4", "F4"], ["G2", "G3", "B3", "D4"]], tempo: 50 },
              },
              {
                type: "compare",
                prompt: "As duas começam no mesmo V. Qual delas engana o ouvido?",
                options: [
                  { label: "Perfeita (V → I)", notes: [["G2", "D4", "G4", "B4"], ["C3", "C4", "E4", "C5"]], tempo: 50 },
                  { label: "De engano (V → vi)", notes: [["G2", "D4", "G4", "B4"], ["A2", "C4", "E4", "C5"]], tempo: 50 },
                ],
                answer: 1,
                explain: "As vozes de cima chegam às mesmas notas. Só o baixo muda: em vez de Dó, vai para Lá, e o acorde final vira Am (vi).",
              },
            ],
          },
          {
            titulo: "No Hino da Alegria",
            tipo: "aplicar",
            blocos: [
              { type: "p", text: "A primeira frase termina em Ré, sobre o acorde de G (V): semicadência. A segunda termina em Dó, sobre C (I): cadência perfeita." },
              { type: "audio", label: "Hino da Alegria, 1ª frase (termina no V)", notes: ["E4", "E4", "F4", "G4", "G4", "F4", "E4", "D4", "C4", "C4", "D4", "E4", "E4", "D4", "D4"], tempo: 110 },
              { type: "audio", label: "2ª frase (termina no I)", notes: ["E4", "E4", "F4", "G4", "G4", "F4", "E4", "D4", "C4", "C4", "D4", "E4", "D4", "C4", "C4"], tempo: 110 },
              { type: "tip", text: "Ao chegar no acorde final de uma cadência, pense na sua nota de destino antes de cantá-la. Isso ajuda a afinar o fim da frase." },
            ],
          },
          {
            titulo: "Cante uma cadência a quatro vozes",
            tipo: "aplicar",
            blocos: [
              { type: "p", text: "No treinador, o V7 resolve no I: cadência perfeita. Escute o seu naipe chegar ao acorde final." },
              { type: "harmonyLink", arrangement: "acordes-sustentados-satb", label: "Treinador: I – IV – V7 – I em SATB" },
              {
                type: "check",
                question: "No V7 desse arranjo, o soprano canta Fá, a sétima do acorde. Para onde ele vai no acorde final?",
                options: ["Desce para Mi", "Sobe para Sol", "Fica parado em Fá"],
                answer: 0,
                explain: "A sétima do V7 tende a descer por grau. Fá desce para Mi, a terça de Dó maior, e o acorde repousa.",
              },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "match",
                prompt: "Ligue cada cadência à sua sensação.",
                pairs: [
                  { left: "V → I (perfeita)", right: "Ponto final" },
                  { left: "IV → I (plagal)", right: "“A-mém”" },
                  { left: "… → V (semicadência)", right: "Vírgula, em aberto" },
                  { left: "V → vi (de engano)", right: "Surpresa" },
                ],
              },
              {
                type: "trueFalse",
                items: [
                  { statement: "Uma semicadência pode encerrar a música definitivamente.", answer: false, explain: "Ela soa em aberto. O fim definitivo vem com a tônica." },
                  { statement: "Na cadência perfeita, a sensível costuma subir para a tônica.", answer: true, explain: "Em Dó maior, Si sobe para Dó." },
                ],
              },
            ],
          },
        ],
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
        gancho: "O louvor ficou alto demais e a igreja parou de cantar no refrão? Transpor resolve: a mesma música, no lugar certo para as vozes.",
        etapas: [
          {
            titulo: "A mesma música, outra altura",
            tipo: "descobrir",
            blocos: [
              { type: "p", text: "Tonalidade é o centro da música: a nota e o acorde de repouso (a tônica) e a escala que parte dela. Transpor é cantar ou tocar a mesma música em outra tonalidade." },
              {
                type: "callout",
                icon: "ideia",
                title: "Como um elevador",
                text: "A família inteira sobe junto: todos mudam de andar, mas a distância entre eles continua a mesma. Ao transpor, todos os intervalos se mantêm.",
              },
              {
                type: "compare",
                prompt: "Ouça o início do Hino da Alegria em dois tons.",
                options: [
                  { label: "Em Dó: Mi–Mi–Fá–Sol", notes: ["E4", "E4", "F4", "G4"], tempo: 90 },
                  { label: "Em Ré: Fá♯–Fá♯–Sol–Lá", notes: ["F#4", "F#4", "G4", "A4"], tempo: 90 },
                ],
                explain: "A melodia é a mesma, só ficou um tom mais aguda. O desenho de passos (semitom, depois tom) não mudou.",
              },
            ],
          },
          {
            titulo: "Por que Fá♯, e não Fá?",
            tipo: "checar",
            blocos: [
              {
                type: "check",
                question: "Em Dó, a melodia faz Mi–Mi–Fá–Sol. Transposta um tom acima (para Ré), ela fica…",
                options: ["Fá♯–Fá♯–Sol–Lá", "Fá–Fá–Sol–Lá", "Ré–Ré–Mi–Fá"],
                answer: 0,
                explain: "Cada nota sobe 2 semitons: Mi → Fá♯, Fá → Sol, Sol → Lá. Com Fá natural, o primeiro passo viraria um tom e a melodia mudaria.",
              },
              { type: "keyboard", from: "C4", to: "C5", highlight: ["F#4", "G4", "A4"], label: "Em Ré: Fá♯, Sol, Lá" },
            ],
          },
          {
            titulo: "Conte os semitons",
            tipo: "descobrir",
            blocos: [
              {
                type: "list",
                ordered: true,
                items: [
                  "Decida quantos semitons subir ou descer (de Dó para Ré = +2).",
                  "Some esse valor a todas as notas e às fundamentais dos acordes.",
                  "Mantenha o tipo de cada acorde: Am em Dó vira Bm em Ré.",
                  "Confira a nota mais aguda e a mais grave de cada voz.",
                ],
              },
              {
                type: "check",
                question: "De Dó maior para Mi♭ maior, quantos semitons?",
                options: ["+3", "+2", "+4", "−3"],
                answer: 0,
                explain: "Dó → Dó♯ → Ré → Mi♭: três teclas vizinhas, +3 semitons.",
              },
            ],
          },
          {
            titulo: "Sua vez: transponha a cifra",
            tipo: "experimentar",
            blocos: [
              { type: "illustration", name: "cifra", caption: "Na cifra, muda a letra; o tipo do acorde fica." },
              { type: "reveal", prompt: "Transponha C – F – G – C para Ré (+2).", answer: "D – G – A – D." },
              { type: "reveal", prompt: "Transponha Am – Dm – E – Am para Si menor (+2).", answer: "Bm – Em – F♯ – Bm. O E é maior e continua maior: F♯." },
            ],
          },
          {
            titulo: "Ouça: o tipo não muda",
            tipo: "ouvir",
            blocos: [
              {
                type: "compare",
                prompt: "A mesma progressão em Lá menor e em Si menor.",
                options: [
                  { label: "Am – Dm – E – Am", notes: [["A3", "C4", "E4"], ["A3", "D4", "F4"], ["G#3", "B3", "E4"], ["A3", "C4", "E4"]], tempo: 60 },
                  { label: "Bm – Em – F♯ – Bm", notes: [["B3", "D4", "F#4"], ["B3", "E4", "G4"], ["A#3", "C#4", "F#4"], ["B3", "D4", "F#4"]], tempo: 60 },
                ],
                explain: "O caráter é idêntico: menor, menor, maior, menor. Só a altura subiu um tom.",
              },
              {
                type: "trueFalse",
                items: [
                  { statement: "Am transposto um tom acima vira Bm.", answer: true, explain: "Lá + 2 semitons = Si, e o acorde continua menor." },
                  { statement: "Ao transpor, um acorde com sétima pode perder a sétima.", answer: false, explain: "Nada muda além da altura: com sétima continua com sétima." },
                ],
              },
            ],
          },
          {
            titulo: "O tom que serve à igreja",
            tipo: "aplicar",
            blocos: [
              { type: "illustration", name: "extensao-tessitura" },
              { type: "p", text: "Se a melodia passa de Ré5, sopranos e congregação se cansam. Se desce abaixo de Lá3, perde força. Mudar um ou dois semitons pode transformar a participação da igreja." },
              {
                type: "check",
                question: "Um louvor está em Mi maior e o refrão chega a Mi5. A igreja para de cantar ali. O que fazer?",
                options: ["Descer para Ré maior (−2): o agudo vira Ré5", "Subir para Fá maior para dar mais brilho", "Manter o tom e pedir mais volume"],
                answer: 0,
                explain: "Descendo um tom, tudo desce 2 semitons: Mi5 vira Ré5, uma região confortável para a maioria.",
              },
              { type: "harmonyLink", arrangement: "hino-alegria-satb", label: "No treinador, transponha o SATB em +2 e veja a nota mais aguda do soprano" },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "order",
                prompt: "Coloque os passos da transposição na ordem.",
                items: [
                  "Escolher o novo tom e contar os semitons",
                  "Somar esse valor a todas as notas e cifras",
                  "Conferir que cada acorde manteve o tipo",
                  "Verificar o agudo e o grave de cada voz",
                ],
              },
            ],
          },
        ],
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
