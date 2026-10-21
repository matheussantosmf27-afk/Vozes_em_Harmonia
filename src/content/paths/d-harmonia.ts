import type { PathDef } from "../types";
import { SEGURANCA_BASE } from "../common";

export const trilhaD: PathDef = {
  slug: "harmonia-vocal",
  code: "D",
  title: "Harmonia vocal",
  subtitle: "De duas a quatro vozes, com independência",
  description:
    "O coração da formação: cantar uma linha própria mantendo afinação, ritmo e equilíbrio com as outras vozes. Progride de duas vozes em terças e sextas até acordes a quatro vozes, quarteto masculino e arranjos com contracanto e pedal.",
  icon: "git-merge",
  lessons: [
    {
      slug: "duas-vozes",
      title: "Duas vozes",
      summary: "Melodia principal e segunda voz; movimento paralelo e contrário.",
      level: 2,
      minutes: 25,
      skills: ["harmonia-duas-vozes", "independencia-vocal"],
      content: {
        objetivo: "Cantar uma segunda voz contra a melodia principal, reconhecendo movimento paralelo, contrário e nota sustentada contra melodia em movimento.",
        gancho: "Já reparou como um hino ganha vida quando alguém canta uma segunda voz por baixo da melodia? Hoje você aprende a ser essa voz, sem ser arrastado(a) pela melodia.",
        etapas: [
          {
            titulo: "Uma melodia ganha companhia",
            tipo: "ouvir",
            blocos: [
              { type: "p", text: "Na harmonia a duas vozes, uma voz canta a melodia principal e a outra canta uma linha de apoio: a “segunda voz”." },
              {
                type: "compare",
                prompt: "Ouça a mesma frase sozinha e com uma segunda voz por baixo.",
                options: [
                  { label: "Só a melodia", notes: ["E4", "F4", "G4", "F4", "E4"], tempo: 70 },
                  { label: "Melodia + segunda voz", notes: [["E4", "C4"], ["F4", "D4"], ["G4", "E4"], ["F4", "D4"], ["E4", "C4"]], tempo: 70 },
                ],
                explain: "A melodia é a mesma. A segunda voz não é uma melodia qualquer: ela caminha em intervalos consonantes (aqui, terças) e deixa o som mais cheio.",
              },
              {
                type: "check",
                question: "Qual é o papel da segunda voz?",
                options: ["Apoiar a melodia, soando um pouco mais suave", "Competir com a melodia, soando mais forte", "Cantar a mesma nota da melodia o tempo todo"],
                answer: 0,
                explain: "A melodia lidera; a segunda voz apoia. Se ela fica mais forte, a congregação perde a melodia.",
              },
            ],
          },
          {
            titulo: "Três jeitos de caminhar juntas",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "movimentos-vozes", caption: "Paralelo, contrário e oblíquo." },
              {
                type: "list",
                items: [
                  "Paralelo: as duas vozes sobem e descem juntas, mantendo o mesmo intervalo (ex.: terças paralelas).",
                  "Contrário: uma voz sobe enquanto a outra desce. Dá independência e riqueza.",
                  "Oblíquo: uma voz fica parada (nota sustentada) enquanto a outra se move.",
                ],
              },
              {
                type: "callout",
                icon: "ideia",
                title: "Pense em dois amigos andando",
                text: "Lado a lado no mesmo passo (paralelo), indo em direções opostas (contrário) ou um parado esperando o outro (oblíquo).",
              },
            ],
          },
          {
            titulo: "Ouça os movimentos",
            tipo: "ouvir",
            blocos: [
              {
                type: "compare",
                prompt: "Desafio: qual destes exemplos está em movimento contrário?",
                options: [
                  { label: "Paralelo (terças subindo juntas)", notes: [["E4", "C4"], ["F4", "D4"], ["G4", "E4"]], tempo: 70 },
                  { label: "Contrário (aguda sobe, grave desce)", notes: [["E4", "C4"], ["F4", "A3"], ["G4", "G3"]], tempo: 70 },
                  { label: "Oblíquo (grave parada em Dó)", notes: [["E4", "C4"], ["F4", "C4"], ["G4", "C4"]], tempo: 70 },
                ],
                answer: 1,
                explain: "No contrário, as vozes se afastam: a aguda sobe (Mi–Fá–Sol) e a grave desce (Dó–Lá–Sol).",
              },
              {
                type: "check",
                question: "Ouça: o que a voz grave faz?",
                audio: { notes: [["C4", "E4"], ["C4", "F4"], ["C4", "G4"], ["C4", "E4"]], mode: "seq", tempo: 70 },
                options: ["Fica parada no Dó (movimento oblíquo)", "Sobe junto com a aguda (paralelo)", "Desce enquanto a aguda sobe (contrário)"],
                answer: 0,
                explain: "A voz grave sustenta Dó enquanto a aguda se move: é o movimento oblíquo.",
              },
            ],
          },
          {
            titulo: "Sua vez: cante a segunda voz",
            tipo: "experimentar",
            blocos: [
              { type: "audio", label: "Sua linha: a segunda voz sozinha (Dó–Ré–Mi–Ré–Dó)", notes: ["C4", "D4", "E4", "D4", "C4"], tempo: 70 },
              { type: "timer", instruction: "Cante essa linha em “lu”, devagar e em volume confortável. Repita até conseguir sem ouvir de novo.", seconds: 20, reps: 2 },
              { type: "singAlong", instruction: "Termine na nota-âncora: sustente o Dó com segurança.", note: "C4", seconds: 4 },
              { type: "tip", title: "Nota-âncora", text: "Âncoras são notas fáceis de lembrar (início, fim, notas longas). Se a melodia te puxar, volte para elas." },
            ],
          },
          {
            titulo: "Solo, guiado, conjunto",
            tipo: "descobrir",
            blocos: [
              {
                type: "callout",
                icon: "estrela",
                title: "Como não ser arrastado(a) pela melodia",
                text: "Aprenda a sua voz sozinho(a), depois com a melodia baixinha e só então com as duas no mesmo volume. No movimento contrário, pense na direção da SUA linha.",
              },
              {
                type: "order",
                prompt: "Coloque os passos de estudo na ordem certa.",
                items: ["Modo solo: só a sua voz", "Modo guiado: a outra voz soa baixinho", "Modo conjunto: as duas no mesmo volume", "Gravar e ouvir: a sua voz se manteve?"],
              },
            ],
          },
          {
            titulo: "No treinador de harmonia",
            tipo: "aplicar",
            blocos: [
              { type: "harmonyLink", arrangement: "movimento-contrario", label: "Exercício: movimento contrário" },
              { type: "harmonyLink", arrangement: "hino-alegria-duas-vozes", label: "Hino da Alegria a duas vozes" },
              {
                type: "checklist",
                title: "Roteiro de estudo",
                items: [
                  "Ouvi “Movimento contrário” no modo conjunto",
                  "Cantei a voz 2 no modo solo",
                  "Cantei a voz 2 no modo guiado",
                  "Repeti no Hino da Alegria a duas vozes",
                  "Gravei no modo conjunto e ouvi",
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
                prompt: "Ligue cada termo ao que ele significa.",
                pairs: [
                  { left: "Movimento paralelo", right: "Sobem e descem juntas, mesmo intervalo" },
                  { left: "Movimento contrário", right: "Uma sobe enquanto a outra desce" },
                  { left: "Movimento oblíquo", right: "Uma sustenta, a outra se move" },
                  { left: "Segunda voz", right: "Apoia a melodia, sem encobri-la" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: { passos: ["Treinador: segunda voz do Hino da Alegria (modo guiado → conjunto).", "Marque os compassos difíceis e repita só esses trechos."], minutos: 12, frequencia: "4 vezes por semana" },
        errosComuns: [
          { erro: "Passar para a melodia sem perceber.", correcao: "Cante a sua linha em volume confortável e use as notas-âncora." },
          { erro: "Cantar a segunda voz mais forte que a melodia.", correcao: "A melodia lidera; a segunda voz apoia." },
        ],
        seguranca: [...SEGURANCA_BASE],
        criterioAvanco: "Acertar pelo menos 70% da avaliação e cantar a segunda voz do Hino da Alegria no modo conjunto.",
      },
      exercises: [
        { slug: "duas-vozes-treinador", title: "Prática: segunda voz no treinador", instructions: "Cante a segunda voz do Hino da Alegria e avalie.", type: "harmony_part", config: { voices: 2, arrangementSlug: "hino-alegria-duas-vozes" }, skill: "harmonia-duas-vozes", purpose: "pratica" },
        {
          slug: "duas-vozes-avaliacao",
          title: "Avaliação: movimentos entre vozes",
          instructions: "Responda e ouça os exemplos.",
          type: "quiz",
          config: {
            questions: [
              { q: "Duas vozes que sobem e descem juntas mantendo o intervalo estão em movimento…", options: ["Paralelo", "Contrário", "Oblíquo", "Uníssono"], answer: 0 },
              { q: "Uma voz sobe enquanto a outra desce. Que movimento é esse?", options: ["Contrário", "Paralelo", "Oblíquo", "Direto"], answer: 0 },
              { q: "Uma voz sustenta a nota enquanto a outra se move:", options: ["Movimento oblíquo", "Movimento paralelo", "Movimento contrário", "Cânone"], answer: 0 },
              {
                q: "Ouça: a voz aguda sobe e a grave desce. Que movimento você ouviu?",
                options: ["Contrário", "Paralelo"],
                answer: 0,
                audio: { notes: [["E4", "C4"], ["F4", "A3"], ["G4", "G3"]], mode: "seq", tempo: 70 },
              },
              { q: "Qual é a sequência recomendada para aprender a sua voz?", options: ["Solo → guiado → conjunto", "Conjunto → solo", "Só conjunto", "Só ler a partitura"], answer: 0 },
            ],
          },
          skill: "harmonia-duas-vozes",
          purpose: "avaliacao",
        },
      ],
    },
    {
      slug: "tercas-e-sextas",
      title: "Terças e sextas",
      summary: "Os intervalos mais usados entre duas vozes.",
      level: 2,
      minutes: 25,
      skills: ["harmonia-duas-vozes", "intervalos"],
      content: {
        objetivo: "Cantar terças e sextas paralelas com afinação e reconhecer esses intervalos entre duas vozes.",
        gancho: "Por que quase toda segunda voz de louvor soa tão “doce”? O segredo está em dois intervalos: a terça e a sexta.",
        etapas: [
          {
            titulo: "Contando degraus",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "intervalo-escada", caption: "Cada degrau é uma nota da escala." },
              {
                type: "list",
                items: [
                  "Terça abaixo: a segunda voz canta duas notas da escala abaixo da melodia (Mi → Dó, Fá → Ré).",
                  "Sexta abaixo: cinco notas da escala abaixo (Dó → Mi, Ré → Fá).",
                ],
              },
              {
                type: "check",
                question: "A melodia canta Sol. Qual nota fica uma terça abaixo?",
                options: ["Mi", "Fá", "Ré", "Dó"],
                answer: 0,
                explain: "Desça duas notas da escala: Sol → Fá → Mi. A terça abaixo de Sol é Mi.",
              },
            ],
          },
          {
            titulo: "Ouça terças e sextas",
            tipo: "ouvir",
            blocos: [
              { type: "p", text: "Terças e sextas são consonâncias imperfeitas: soam doces e cheias e permitem caminhar em paralelo sem perder a independência." },
              { type: "intervals", root: "C4", semitones: [3, 4, 8, 9] },
              {
                type: "compare",
                prompt: "Desafio: qual destes dois intervalos é a sexta?",
                options: [
                  { label: "Terça (Dó–Mi)", notes: [["C4", "E4"]], mode: "chord" },
                  { label: "Sexta (Mi–Dó)", notes: [["E3", "C4"]], mode: "chord" },
                ],
                answer: 1,
                explain: "A sexta é mais aberta, mas continua doce. A terça é mais “fechadinha”, as notas bem próximas.",
              },
            ],
          },
          {
            titulo: "A terça que vira sexta",
            tipo: "descobrir",
            blocos: [
              { type: "p", text: "Pegue a terça Dó–Mi e suba o Dó uma oitava. Agora Mi–Dó é uma sexta! Terça e sexta são inversões uma da outra." },
              { type: "audio", label: "Terça Dó–Mi e depois sexta Mi–Dó", notes: [["C4", "E4"], ["E4", "C5"]], tempo: 40 },
              {
                type: "reveal",
                prompt: "Some uma terça maior (4 semitons) com uma sexta menor (8 semitons). O que dá?",
                answer: "12 semitons: uma oitava. Por isso, ao inverter uma terça (levar a nota de baixo uma oitava acima), ela vira sexta.",
              },
            ],
          },
          {
            titulo: "Cuidado com o som “oco”",
            tipo: "ouvir",
            blocos: [
              {
                type: "compare",
                prompt: "Compare a mesma melodia acompanhada em terças e em quintas paralelas.",
                options: [
                  { label: "Terças paralelas", notes: [["E4", "C4"], ["F4", "D4"], ["G4", "E4"]], tempo: 70 },
                  { label: "Quintas paralelas", notes: [["G4", "C4"], ["A4", "D4"], ["B4", "E4"]], tempo: 70 },
                ],
                explain: "Quintas (e oitavas) paralelas soam “ocas” e fazem as vozes perderem a independência. Na segunda voz, prefira terças e sextas.",
              },
              {
                type: "trueFalse",
                items: [
                  { statement: "Na escala, todas as terças têm o mesmo número de semitons.", answer: false, explain: "Elas alternam entre maiores (4 semitons) e menores (3). Siga as notas da escala, não um número fixo." },
                  { statement: "A terça maior bem afinada num acorde soa um pouco mais baixa que a do teclado.", answer: true, explain: "Quando ela “encaixa”, o acorde parece vibrar. Ouça o grupo, não só o teclado." },
                  { statement: "Quintas paralelas são ótimas para a segunda voz.", answer: false, explain: "Soam ocas e tiram a independência da segunda voz." },
                ],
              },
            ],
          },
          {
            titulo: "Sua vez: a escada de terças",
            tipo: "experimentar",
            blocos: [
              { type: "audio", label: "Escala de Dó em terças", notes: [["C4", "E4"], ["D4", "F4"], ["E4", "G4"], ["F4", "A4"], ["G4", "B4"], ["A4", "C5"], ["B4", "D5"], ["C5", "E5"]], tempo: 60 },
              { type: "keyboard", from: "C4", to: "E5", highlight: ["C4", "E4", "D4", "F4"], label: "Dó–Mi, Ré–Fá… sempre pulando uma tecla branca" },
              { type: "timer", instruction: "Toque a escada e cante a nota de BAIXO de cada par (Dó, Ré, Mi…) em “lu”, ouvindo a terça se encaixar. Sem forçar o agudo.", seconds: 30 },
            ],
          },
          {
            titulo: "No treinador de harmonia",
            tipo: "aplicar",
            blocos: [
              { type: "harmonyLink", arrangement: "tercas-paralelas", label: "Terças paralelas" },
              { type: "harmonyLink", arrangement: "sextas-paralelas", label: "Sextas paralelas" },
              {
                type: "checklist",
                title: "Roteiro de estudo",
                items: ["Terças: voz 2 no modo solo", "Terças: modo guiado e depois conjunto", "Gravei uma vez no modo conjunto", "Repeti tudo com as sextas"],
              },
            ],
          },
          {
            titulo: "Terça ou sexta?",
            tipo: "checar",
            blocos: [
              {
                type: "check",
                question: "Ouça o intervalo. É uma terça ou uma sexta?",
                audio: { notes: [["E3", "C4"]], mode: "chord", tempo: 30 },
                options: ["Sexta", "Terça"],
                answer: 0,
                explain: "Mi3–Dó4 é uma sexta: o som é mais aberto que a terça Dó–Mi.",
              },
              {
                type: "match",
                prompt: "Ligue cada situação ao intervalo.",
                pairs: [
                  { left: "Melodia Mi, segunda voz Dó abaixo", right: "Terça abaixo" },
                  { left: "Melodia Dó, segunda voz Mi abaixo", right: "Sexta abaixo" },
                  { left: "Dó–Sol subindo para Ré–Lá", right: "Quintas paralelas: evite" },
                  { left: "Terça com a nota de baixo uma oitava acima", right: "Vira sexta" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: { passos: ["Cante a escala de Dó em terças com o teclado (Dó–Mi, Ré–Fá, Mi–Sol…).", "Treinador: terças e sextas paralelas no modo conjunto."], minutos: 10, frequencia: "4 vezes por semana" },
        errosComuns: [
          { erro: "Cantar sempre a mesma distância em semitons.", correcao: "Na escala, as terças alternam entre maiores e menores. Siga as notas, não um número fixo de semitons." },
          { erro: "Escorregar para a quinta.", correcao: "Ouça o intervalo: a quinta soa mais aberta e “oca”." },
        ],
        seguranca: [...SEGURANCA_BASE.slice(0, 3)],
        criterioAvanco: "Acertar pelo menos 70% na avaliação de terças e sextas.",
      },
      exercises: [
        { slug: "tercas-treinador", title: "Prática: terças paralelas", instructions: "Cante a voz 2 de “Terças paralelas”.", type: "harmony_part", config: { voices: 2, arrangementSlug: "tercas-paralelas" }, skill: "harmonia-duas-vozes", purpose: "pratica" },
        { slug: "tercas-sextas-avaliacao", title: "Avaliação: terça ou sexta?", instructions: "Identifique o intervalo harmônico.", type: "interval_id", config: { rounds: 10, intervals: [3, 4, 8, 9], direction: "harmonic" }, skill: "intervalos", purpose: "avaliacao" },
      ],
    },
    {
      slug: "tres-vozes",
      title: "Três vozes",
      summary: "Acordes, função de cada linha e entradas em momentos diferentes.",
      level: 2,
      minutes: 30,
      skills: ["harmonia-tres-quatro-vozes", "independencia-vocal"],
      content: {
        objetivo: "Cantar a sua linha numa textura de três vozes, compreendendo a distribuição das notas do acorde, notas comuns e entradas independentes.",
        gancho: "Com três vozes, o acorde fica completo pela primeira vez. Vamos descobrir onde a sua voz se encaixa nele.",
        etapas: [
          {
            titulo: "Um acorde, três vozes",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "triade", caption: "Fundamental, terça e quinta." },
              { type: "p", text: "Com três vozes já dá para cantar uma tríade completa: uma voz para cada nota (fundamental, terça e quinta)." },
              { type: "audio", label: "Dó maior nota por nota e depois junto", notes: ["C4", "E4", "G4", ["C4", "E4", "G4"]], tempo: 60 },
              {
                type: "check",
                question: "Na tríade de Dó maior (Dó–Mi–Sol), qual nota é a terça?",
                options: ["Mi", "Dó", "Sol"],
                answer: 0,
                explain: "Dó é a fundamental, Mi é a terça e Sol é a quinta.",
              },
            ],
          },
          {
            titulo: "Quem faz o quê",
            tipo: "descobrir",
            blocos: [
              {
                type: "list",
                items: ["Voz aguda: normalmente canta a melodia.", "Voz grave: dá a base do acorde.", "Voz do meio: completa o acorde."],
              },
              {
                type: "callout",
                icon: "ouvido",
                title: "O recheio do sanduíche",
                text: "A voz do meio é a mais difícil de ouvir. Ela precisa estar presente, sem encobrir a melodia.",
              },
              { type: "chords", root: "C4", qualities: ["maior", "menor"] },
            ],
          },
          {
            titulo: "O segredo das notas comuns",
            tipo: "ouvir",
            blocos: [
              { type: "p", text: "Quando dois acordes vizinhos têm uma nota em comum, a voz que canta essa nota costuma ficar nela. Isso facilita a afinação." },
              { type: "audio", label: "I – vi – IV – V – I a três vozes (Dó – Lám – Fá – Sol – Dó)", notes: [["C4", "E4", "G4"], ["C4", "E4", "A4"], ["C4", "F4", "A4"], ["B3", "D4", "G4"], ["C4", "E4", "G4"]], tempo: 50 },
              {
                type: "check",
                question: "De Dó maior (Dó–Mi–Sol) para Lá menor (Lá–Dó–Mi), quais notas ficaram iguais?",
                options: ["Dó e Mi", "Só o Sol", "Nenhuma", "Todas"],
                answer: 0,
                explain: "Dó e Mi são comuns aos dois acordes. Só o Sol se move, subindo um degrau para Lá.",
              },
            ],
          },
          {
            titulo: "O menor caminho",
            tipo: "ouvir",
            blocos: [
              {
                type: "compare",
                prompt: "Os dois exemplos vão de Dó maior para Fá maior. Qual é mais fácil de cantar?",
                options: [
                  { label: "Cada voz anda o mínimo", notes: [["C4", "E4", "G4"], ["C4", "F4", "A4"]], tempo: 50 },
                  { label: "Todas as vozes saltam", notes: [["C4", "E4", "G4"], ["F3", "A4", "C5"]], tempo: 50 },
                ],
                answer: 0,
                explain: "Na boa condução, cada voz vai pelo menor caminho para a próxima nota do acorde e mantém as notas comuns (aqui, o Dó).",
              },
            ],
          },
          {
            titulo: "Entradas em momentos diferentes",
            tipo: "experimentar",
            blocos: [
              { type: "p", text: "Em cânones e arranjos com imitação, as vozes entram em momentos diferentes. Num cânone, todas cantam a mesma melodia, cada uma no seu momento." },
              { type: "rhythm", pattern: "q q q q q q q q", bpm: 80, label: "Conte dois compassos: 1-2-3-4, 1-2-3-4" },
              { type: "timer", instruction: "Conte “1-2-3-4, 1-2-3-4” em voz alta com a pulsação e entre cantando Dó–Ré–Mi–Fá–Sol exatamente no próximo tempo 1.", seconds: 15, reps: 2 },
              { type: "tip", text: "Não espere a outra voz para entrar: conte os tempos. A sua entrada tem um momento próprio." },
            ],
          },
          {
            titulo: "No treinador de harmonia",
            tipo: "aplicar",
            blocos: [
              { type: "harmonyLink", arrangement: "triades-tres-vozes", label: "Tríades a três vozes (I – vi – IV – V – I)" },
              { type: "harmonyLink", arrangement: "canone-solfejo", label: "Cânone do solfejo: entradas em momentos diferentes" },
              { type: "harmonyLink", arrangement: "hino-alegria-tres-vozes", label: "Hino da Alegria a três vozes" },
              {
                type: "checklist",
                title: "Roteiro de estudo",
                items: [
                  "Tríades: cantei as três vozes no modo solo e achei as notas comuns",
                  "Escolhi a voz da minha região e cantei no guiado e no conjunto",
                  "Cânone: entrei como voz 2, depois da voz 1",
                  "Cantei a minha voz no Hino da Alegria a três vozes",
                ],
              },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "trueFalse",
                items: [
                  { statement: "Quando há uma nota comum entre dois acordes, a voz que a canta costuma permanecer nela.", answer: true, explain: "Permanecer na nota comum dá segurança e ajuda a afinação." },
                  { statement: "Num cânone, todas as vozes começam juntas.", answer: false, explain: "No cânone, a mesma melodia entra em momentos diferentes." },
                  { statement: "A voz do meio deve cantar mais forte para aparecer.", answer: false, explain: "Ela precisa estar presente, mas sem encobrir a melodia." },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: { passos: ["Treinador: Hino da Alegria a três vozes (sua voz).", "Cânone do solfejo entrando como voz 2 ou 3."], minutos: 12, frequencia: "3 vezes por semana" },
        errosComuns: [
          { erro: "Abandonar a nota comum entre acordes.", correcao: "Se a nota se repete, permaneça nela com segurança." },
          { erro: "Esperar a outra voz para entrar.", correcao: "Conte os tempos: a sua entrada tem um momento próprio." },
        ],
        seguranca: [...SEGURANCA_BASE],
        criterioAvanco: "Acertar pelo menos 70% da avaliação e cantar a sua voz a três vozes no modo conjunto.",
      },
      exercises: [
        { slug: "tres-vozes-treinador", title: "Prática: três vozes no treinador", instructions: "Cante a sua voz no Hino da Alegria a três vozes.", type: "harmony_part", config: { voices: 3, arrangementSlug: "hino-alegria-tres-vozes" }, skill: "harmonia-tres-quatro-vozes", purpose: "pratica" },
        { slug: "tres-vozes-acordes-avaliacao", title: "Avaliação: a nota mais aguda do acorde", instructions: "Ouça o acorde de três notas e encontre a nota mais aguda.", type: "chord_extreme", config: { rounds: 6, ask: "aguda", size: 3 }, skill: "acordes", purpose: "avaliacao" },
        {
          slug: "tres-vozes-avaliacao",
          title: "Avaliação: conceitos de três vozes",
          instructions: "Responda sobre harmonia a três vozes.",
          type: "quiz",
          config: {
            questions: [
              { q: "Uma tríade é formada por…", options: ["Fundamental, terça e quinta", "Três fundamentais", "Fundamental, segunda e quarta", "Três notas quaisquer"], answer: 0 },
              { q: "Quando dois acordes vizinhos têm uma nota em comum, a voz que a canta geralmente…", options: ["Permanece na mesma nota", "Salta uma oitava", "Faz uma pausa", "Canta mais forte"], answer: 0 },
              { q: "Qual voz costuma ser a mais difícil de ouvir numa textura a três vozes?", options: ["A voz do meio", "A melodia", "O baixo", "Nenhuma"], answer: 0 },
              { q: "Em um cânone, as vozes…", options: ["Cantam a mesma melodia entrando em momentos diferentes", "Cantam melodias diferentes ao mesmo tempo, começando juntas", "Cantam em uníssono", "Não têm letra"], answer: 0 },
            ],
          },
          skill: "harmonia-tres-quatro-vozes",
          purpose: "avaliacao",
        },
      ],
    },
    {
      slug: "acordes-a-quatro-vozes",
      title: "Acordes a quatro vozes (SATB)",
      summary: "Soprano, contralto, tenor e baixo: formação, condução e estudo da própria parte.",
      level: 3,
      minutes: 30,
      skills: ["harmonia-tres-quatro-vozes"],
      content: {
        objetivo: "Compreender a formação tradicional SATB, como os acordes são distribuídos em quatro vozes e como estudar a própria parte ouvindo o conjunto.",
        gancho: "Abra um hinário: as quatro linhas de notas são Soprano, Contralto, Tenor e Baixo. Hoje você descobre como elas formam o acorde e como estudar a sua.",
        etapas: [
          {
            titulo: "Quatro naipes, um coro",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "naipes-satb", caption: "Soprano, Contralto (Alto), Tenor e Baixo." },
              {
                type: "list",
                items: [
                  "Soprano: normalmente canta a melodia.",
                  "Contralto: voz feminina intermediária, logo abaixo do soprano.",
                  "Tenor: voz masculina aguda.",
                  "Baixo: voz masculina grave; costuma cantar a fundamental e define a harmonia.",
                ],
              },
              {
                type: "check",
                question: "Uma tríade tem três notas, mas o coro tem quatro vozes. O que acontece?",
                options: ["Uma nota é dobrada, geralmente a fundamental", "Uma das vozes fica calada", "Alguém inventa uma quarta nota qualquer"],
                answer: 0,
                explain: "Duas vozes cantam a mesma nota (em oitavas ou em uníssono). Em geral, dobra-se a fundamental.",
              },
            ],
          },
          {
            titulo: "Ouça o acorde se montar",
            tipo: "ouvir",
            blocos: [
              { type: "audio", label: "Baixo (Dó3), tenor (Sol3), contralto (Dó4), soprano (Mi4)… e todos juntos", notes: ["C3", "G3", "C4", "E4", ["C3", "G3", "C4", "E4"]], tempo: 50 },
              {
                type: "check",
                question: "Ouça este acorde de Sol maior. Qual nota está no baixo?",
                audio: { notes: [["G2", "D3", "B3", "G4"]], mode: "chord", tempo: 30 },
                options: ["Sol", "Si", "Ré"],
                answer: 0,
                explain: "O baixo canta Sol, a fundamental. Repare que o Sol aparece duas vezes: é a nota dobrada.",
              },
            ],
          },
          {
            titulo: "O baixo manda no acorde",
            tipo: "ouvir",
            blocos: [
              {
                type: "compare",
                prompt: "As vozes de cima são iguais. Só o baixo muda.",
                options: [
                  { label: "Baixo na fundamental (Dó)", notes: [["C3", "E4", "G4", "C5"]], mode: "chord" },
                  { label: "Baixo na terça (Mi)", notes: [["E3", "E4", "G4", "C5"]], mode: "chord" },
                ],
                explain: "Os dois são Dó maior, mas com Mi no baixo o acorde soa menos “assentado”. Por isso o baixo estuda a sua nota com prioridade e canta com firmeza.",
              },
              { type: "illustration", name: "inversoes", caption: "A nota do baixo muda a cara do acorde." },
            ],
          },
          {
            titulo: "Tenor: a pegadinha da clave",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "partitura-vocal" },
              { type: "p", text: "Nas partituras, o tenor costuma ser escrito na clave de Sol com um 8 embaixo. Isso quer dizer: soa uma oitava abaixo do escrito. Às vezes ele aparece na clave de Fá." },
              {
                type: "check",
                question: "Na parte do tenor (clave de Sol com 8 embaixo) está escrito este Dó. Que nota o tenor canta?",
                staff: { clef: "sol", notes: ["C5"] },
                options: ["Dó central (Dó4)", "O Dó escrito (Dó5)", "Dó duas oitavas abaixo (Dó3)"],
                answer: 0,
                explain: "O 8 embaixo da clave manda descer uma oitava: o Dó5 escrito soa como Dó4, o Dó central.",
              },
            ],
          },
          {
            titulo: "As regras de ouro da condução",
            tipo: "descobrir",
            blocos: [
              {
                type: "list",
                items: ["Mover cada voz pelo menor caminho.", "Manter as notas comuns.", "Evitar quintas e oitavas paralelas.", "Não cruzar as vozes sem motivo."],
              },
              { type: "audio", label: "Exemplo: I – IV – V7 – I a quatro vozes, com passos curtos", notes: [["C3", "G3", "E4", "C5"], ["F3", "A3", "F4", "C5"], ["G3", "D4", "F4", "B4"], ["C3", "C4", "E4", "C5"]], tempo: 40 },
              {
                type: "callout",
                icon: "ouvido",
                title: "Repare no soprano",
                text: "Ele fica no Dó, desce ao Si e volta ao Dó. Quase não se move, e mesmo assim o acorde muda inteiro.",
              },
            ],
          },
          {
            titulo: "Como estudar a sua parte",
            tipo: "experimentar",
            blocos: [
              {
                type: "order",
                prompt: "Monte o roteiro de estudo na ordem certa.",
                items: [
                  "Ler o texto e o ritmo",
                  "Ouvir a sua voz no modo solo",
                  "Cantar com a sua voz destacada (guiado)",
                  "Cantar no conjunto",
                  "Repetir os compassos difíceis",
                  "Voltar ao conjunto ouvindo quem está acima e abaixo",
                ],
              },
              { type: "toolLink", tool: "extensao", label: "Ainda não sabe o seu naipe? Teste a sua extensão" },
            ],
          },
          {
            titulo: "No treinador de harmonia",
            tipo: "aplicar",
            blocos: [
              { type: "harmonyLink", arrangement: "acordes-sustentados-satb", label: "Acordes sustentados SATB (para afinação vertical)" },
              { type: "harmonyLink", arrangement: "hino-alegria-satb", label: "Hino da Alegria a quatro vozes (SATB)" },
              { type: "timer", instruction: "Nos acordes sustentados, cante a sua nota e ouça o acorde completo se formar ao redor dela.", seconds: 20 },
              {
                type: "check",
                question: "No ensaio, um baixo está inseguro e começa a cantar a melodia uma oitava abaixo. Qual é o problema?",
                options: ["O acorde perde a fundamental e a base da harmonia", "Nenhum, desde que cante afinado", "O soprano vai cantar mais baixo"],
                answer: 0,
                explain: "A nota do baixo define o acorde. Estude-a com prioridade e cante-a com firmeza.",
              },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "match",
                prompt: "Ligue cada naipe à sua função mais comum.",
                pairs: [
                  { left: "Soprano", right: "Melodia" },
                  { left: "Contralto", right: "Voz feminina logo abaixo do soprano" },
                  { left: "Tenor", right: "Voz masculina aguda, soa uma oitava abaixo do escrito" },
                  { left: "Baixo", right: "Fundamental do acorde" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: { passos: ["Treinador: sua voz no Hino da Alegria SATB.", "Acordes sustentados SATB no modo conjunto."], minutos: 15, frequencia: "3 vezes por semana" },
        errosComuns: [
          { erro: "Tenores lendo a clave de Sol na altura escrita.", correcao: "Na clave de Sol com o 8 embaixo, o tenor soa uma oitava abaixo do escrito." },
          { erro: "Baixos fugindo da fundamental por insegurança.", correcao: "A nota do baixo define o acorde: estude-a com prioridade e firmeza." },
        ],
        seguranca: [...SEGURANCA_BASE],
        criterioAvanco: "Acertar pelo menos 70% da avaliação e cantar a sua parte no Hino da Alegria SATB no modo conjunto.",
      },
      exercises: [
        { slug: "satb-treinador", title: "Prática: sua parte no SATB", instructions: "Cante a sua parte no Hino da Alegria SATB e avalie.", type: "harmony_part", config: { voices: 4, arrangementSlug: "hino-alegria-satb" }, skill: "harmonia-tres-quatro-vozes", purpose: "pratica" },
        {
          slug: "satb-avaliacao",
          title: "Avaliação: formação SATB",
          instructions: "Responda sobre a escrita a quatro vozes.",
          type: "quiz",
          config: {
            questions: [
              { q: "Em SATB, quem normalmente canta a melodia?", options: ["Soprano", "Contralto", "Tenor", "Baixo"], answer: 0 },
              { q: "Numa tríade a quatro vozes, qual nota costuma ser dobrada?", options: ["A fundamental", "A terça", "A quinta", "Nenhuma"], answer: 0 },
              { q: "O tenor escrito na clave de Sol com um 8 embaixo soa…", options: ["Uma oitava abaixo do escrito", "Uma oitava acima", "Exatamente como escrito", "Uma quinta abaixo"], answer: 0 },
              { q: "Qual destas é uma regra de condução de vozes?", options: ["Evitar quintas e oitavas paralelas", "Sempre saltar uma oitava", "Cruzar as vozes em todos os acordes", "Mudar todas as notas a cada acorde"], answer: 0 },
              {
                q: "Ouça o acorde. Qual nota está no baixo?",
                options: ["Dó", "Mi", "Sol"],
                answer: 0,
                audio: { notes: [["C3", "G3", "E4", "C5"]], mode: "chord", tempo: 30 },
              },
            ],
          },
          skill: "harmonia-tres-quatro-vozes",
          purpose: "avaliacao",
        },
      ],
    },
    {
      slug: "quarteto-masculino",
      title: "Quarteto masculino",
      summary: "Primeiro tenor, segundo tenor, barítono e baixo.",
      level: 3,
      minutes: 25,
      skills: ["harmonia-tres-quatro-vozes"],
      content: {
        objetivo: "Conhecer a formação TTBB, a função de cada voz e cantar uma parte num quarteto masculino.",
        gancho: "Quatro vozes masculinas bem pertinho umas das outras: quando o acorde encaixa, parece um órgão. Vamos ver como cada voz do quarteto trabalha.",
        etapas: [
          {
            titulo: "TTBB: quem é quem",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "quarteto-ttbb", caption: "Primeiro tenor, segundo tenor, barítono e baixo." },
              {
                type: "list",
                items: [
                  "Primeiro tenor: a voz mais aguda; muitas vezes canta acima da melodia, com voz leve.",
                  "Segundo tenor: em muitos arranjos canta a melodia (no barbershop, é o “lead”).",
                  "Barítono: completa o acorde; às vezes acima, às vezes abaixo da melodia.",
                  "Baixo: a fundamental e o alicerce rítmico.",
                ],
              },
              {
                type: "callout",
                icon: "olho",
                title: "Os nomes variam",
                text: "A nomenclatura e a distribuição mudam conforme o arranjo e a tradição (hinódia, gospel, barbershop). Confira sempre na partitura.",
              },
            ],
          },
          {
            titulo: "Vozes próximas, som unido",
            tipo: "ouvir",
            blocos: [
              {
                type: "compare",
                prompt: "O mesmo acorde de Sol maior em duas formações.",
                options: [
                  { label: "Coral misto (vozes espalhadas)", notes: [["G2", "D3", "B3", "G4"]], mode: "chord" },
                  { label: "Quarteto masculino (vozes próximas)", notes: [["G2", "D3", "G3", "B3"]], mode: "chord" },
                ],
                explain: "No quarteto masculino as quatro vozes ficam numa região próxima. O som fica muito unido, e qualquer desafinação aparece mais.",
              },
              {
                type: "reveal",
                prompt: "Por que vozes tão próximas exigem afinação mais cuidadosa?",
                answer: "Com as notas perto umas das outras, o som se funde num bloco só. Uma nota um pouco fora “briga” com a vizinha e o acorde perde o brilho.",
              },
            ],
          },
          {
            titulo: "Onde está a melodia?",
            tipo: "descobrir",
            blocos: [
              { type: "p", text: "No arranjo de treino desta aula (melodia NEW BRITAIN, conhecida como “Amazing Grace”, de domínio público, com texto original da plataforma), a melodia está no segundo tenor." },
              {
                type: "check",
                question: "Se a melodia está no segundo tenor, onde costuma ficar o primeiro tenor?",
                options: ["Acima da melodia, com voz leve", "Abaixo do baixo", "Cantando a melodia junto, em uníssono"],
                answer: 0,
                explain: "O primeiro tenor é a voz mais aguda e frequentemente canta acima da melodia, com voz leve.",
              },
            ],
          },
          {
            titulo: "O barítono que cruza",
            tipo: "ouvir",
            blocos: [
              { type: "p", text: "O barítono é a voz que mais “cruza”: às vezes canta abaixo da melodia, às vezes acima. Nesses pontos, é fácil ser puxado para a melodia." },
              { type: "audio", label: "Exemplo: melodia Sol–Lá–Si com o barítono uma terça ACIMA", notes: [["G3", "B3"], ["A3", "C4"], ["B3", "D4"]], tempo: 60 },
              {
                type: "check",
                question: "Qual é a melhor forma de o barítono estudar os cruzamentos?",
                options: ["Marcar esses trechos e estudá-los separadamente", "Seguir a melodia nesses pontos", "Cantar mais forte para não se perder"],
                answer: 0,
                explain: "Isolar os pontos de cruzamento e repeti-los no modo solo e guiado evita cair na melodia.",
              },
            ],
          },
          {
            titulo: "Agudo leve, sem empurrar",
            tipo: "experimentar",
            blocos: [
              { type: "warning", text: "Primeiro tenor: não force a voz de peito no agudo. Use voz leve (mista ou de cabeça) e volume moderado. Se doer, pare." },
              { type: "timer", instruction: "Faça uma sirene suave em “u”, do grave ao agudo e de volta, sem empurrar e em volume moderado.", seconds: 10, reps: 3 },
              { type: "toolLink", tool: "extensao", label: "Escolha a sua voz pela região confortável: teste a extensão" },
            ],
          },
          {
            titulo: "Hora do quarteto",
            tipo: "aplicar",
            blocos: [
              { type: "harmonyLink", arrangement: "que-grande-amor-ttbb", label: "“Que grande amor”: quarteto masculino" },
              {
                type: "checklist",
                title: "Roteiro de estudo",
                items: [
                  "Ouvi no modo conjunto acompanhando a melodia no 2º tenor",
                  "Escolhi a minha voz pela região confortável",
                  "Estudei no solo e no guiado, marcando os cruzamentos",
                  "Cantei no modo conjunto e gravei",
                  "Sustentei o acorde final ouvindo as outras vozes",
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
                prompt: "Ligue cada voz do quarteto à sua função.",
                pairs: [
                  { left: "Primeiro tenor", right: "Acima da melodia, voz leve" },
                  { left: "Segundo tenor", right: "Melodia (o “lead”)" },
                  { left: "Barítono", right: "Completa o acorde e cruza a melodia" },
                  { left: "Baixo", right: "Fundamental e alicerce rítmico" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: { passos: ["Treinador: sua voz em “Que grande amor”.", "Afinação vertical: sustente o acorde final ouvindo as outras vozes."], minutos: 12, frequencia: "3 vezes por semana" },
        errosComuns: [
          { erro: "Barítono seguindo a melodia quando ela cruza a sua linha.", correcao: "Estude os pontos de cruzamento separadamente." },
          { erro: "Primeiro tenor forçando a voz de peito no agudo.", correcao: "Use voz leve (mista ou de cabeça) e volume moderado." },
        ],
        seguranca: [...SEGURANCA_BASE],
        criterioAvanco: "Acertar pelo menos 70% da avaliação e cantar uma parte do quarteto no modo conjunto.",
      },
      exercises: [
        { slug: "quarteto-treinador", title: "Prática: sua voz no quarteto", instructions: "Cante uma voz de “Que grande amor” no treinador.", type: "harmony_part", config: { voices: 4, arrangementSlug: "que-grande-amor-ttbb" }, skill: "harmonia-tres-quatro-vozes", purpose: "pratica" },
        {
          slug: "quarteto-avaliacao",
          title: "Avaliação: vozes do quarteto masculino",
          instructions: "Responda sobre a formação TTBB.",
          type: "quiz",
          config: {
            questions: [
              { q: "No estilo barbershop, o segundo tenor costuma ser chamado de “lead” porque…", options: ["Canta a melodia", "Rege o grupo", "Canta mais forte", "É o mais grave"], answer: 0 },
              { q: "Qual voz do quarteto mais frequentemente cruza a melodia?", options: ["Barítono", "Baixo", "Primeiro tenor", "Nenhuma"], answer: 0 },
              { q: "A nomenclatura das vozes num quarteto…", options: ["Pode variar conforme o arranjo e a tradição", "É sempre a mesma", "Não existe", "Depende só da altura dos cantores"], answer: 0 },
              { q: "Por que a afinação é tão sensível no quarteto masculino?", options: ["As vozes ficam numa região próxima e o som é muito unido", "Porque são só quatro pessoas", "Porque não há melodia", "Não é sensível"], answer: 0 },
            ],
          },
          skill: "harmonia-tres-quatro-vozes",
          purpose: "avaliacao",
        },
      ],
    },
    {
      slug: "afinacao-de-acordes",
      title: "Afinação de acordes",
      summary: "Afinação vertical: quando o acorde “encaixa”.",
      level: 3,
      minutes: 20,
      skills: ["percepcao-afinacao", "harmonia-tres-quatro-vozes"],
      content: {
        objetivo: "Perceber e ajustar a afinação vertical de acordes sustentados e reconhecer quando uma voz está acima ou abaixo.",
        gancho: "Sabe aquele acorde final que parece “brilhar” e arrepia a igreja? Isso tem nome: afinação vertical. E dá para treinar.",
        etapas: [
          {
            titulo: "Horizontal e vertical",
            tipo: "descobrir",
            blocos: [
              {
                type: "list",
                items: ["Afinação horizontal: a de cada voz ao longo da melodia.", "Afinação vertical: a do acorde, o quanto as notas cantadas ao mesmo tempo se encaixam."],
              },
              { type: "illustration", name: "onda-afinada", caption: "Notas que se encaixam: o som fica estável." },
              {
                type: "callout",
                icon: "estrela",
                title: "O acorde que brilha",
                text: "Quando o acorde está bem afinado, ele parece mais forte. Às vezes ouvimos até notas que ninguém está cantando: os harmônicos.",
              },
              {
                type: "check",
                question: "Quatro cantores sustentam um acorde final. Que afinação está em jogo?",
                options: ["Vertical: as notas soando juntas", "Horizontal: a melodia de cada um", "Nenhuma, é só manter o volume"],
                answer: 0,
                explain: "Notas cantadas ao mesmo tempo formam a afinação vertical.",
              },
            ],
          },
          {
            titulo: "Ouça a diferença",
            tipo: "ouvir",
            blocos: [
              {
                type: "compare",
                prompt: "O mesmo acorde de Dó maior duas vezes. Em qual deles TODAS as vozes estão afinadas?",
                options: [
                  { label: "acorde afinado", notes: [["C3", "G3", "C4", "E4"]], mode: "chord" },
                  { label: "soprano (Mi) um pouco abaixo", notes: [["C3", "G3", "C4", "E4"]], mode: "chord", voiceCents: [0, 0, 0, -35] },
                ],
                answer: 0,
                explain: "Basta uma voz fora do lugar para o acorde ondular e perder o brilho. No afinado, o som fica estável.",
              },
              { type: "illustration", name: "onda-desafinada", caption: "Notas fora do encaixe: o som “bate”." },
            ],
          },
          {
            titulo: "Esqueleto e recheio",
            tipo: "descobrir",
            blocos: [
              {
                type: "list",
                items: [
                  "Afine a partir do baixo: ele dá a referência.",
                  "Oitavas e quintas precisam estar exatas: são o “esqueleto” do acorde.",
                  "A terça maior encaixa um pouco mais baixa que no teclado; a menor, um pouco mais alta.",
                ],
              },
              { type: "audio", label: "Quinta justa (Dó3–Sol3) e depois o acorde com a terça", notes: [["C3", "G3"], ["C3", "G3", "E4"]], tempo: 25 },
              {
                type: "trueFalse",
                items: [
                  { statement: "O certo é afinar pela voz mais forte do grupo.", answer: false, explain: "Afine pelo baixo e pela fundamental do acorde." },
                  { statement: "Oitavas e quintas precisam estar exatas.", answer: true, explain: "Elas sustentam o acorde. Com o esqueleto firme, a terça encontra o seu lugar." },
                ],
              },
            ],
          },
          {
            titulo: "Sustente sem deixar cair",
            tipo: "experimentar",
            blocos: [
              { type: "tip", text: "Notas longas tendem a cair. Mantenha o fluxo de ar e o espaço interno até o corte." },
              { type: "breathing", inhale: 4, exhale: 8, rounds: 2, exhaleOn: "sss" },
              { type: "singAlong", instruction: "Sustente a nota em “u” até o fim, sem deixar cair. Observe o ponteiro no final.", note: "C4", seconds: 5 },
            ],
          },
          {
            titulo: "Desafio: só 25 cents",
            tipo: "ouvir",
            blocos: [
              { type: "audio", label: "Referência: Fá maior afinado (o contralto canta Lá3)", notes: [["F2", "C3", "A3", "F4"]], mode: "chord", tempo: 30 },
              {
                type: "compare",
                prompt: "Diferença pequena! Em qual destes acordes o contralto (Lá) está ABAIXO?",
                options: [
                  { label: "todos afinados", notes: [["F2", "C3", "A3", "F4"]], mode: "chord" },
                  { label: "contralto um pouco acima", notes: [["F2", "C3", "A3", "F4"]], mode: "chord", voiceCents: [0, 0, 25, 0] },
                  { label: "contralto um pouco abaixo", notes: [["F2", "C3", "A3", "F4"]], mode: "chord", voiceCents: [0, 0, -25, 0] },
                ],
                answer: 2,
                explain: "25 cents é um quarto de semitom. Ouvir isso dentro do acorde exige atenção, e é exatamente o ajuste fino da afinação vertical.",
              },
            ],
          },
          {
            titulo: "No ensaio",
            tipo: "aplicar",
            blocos: [
              { type: "harmonyLink", arrangement: "acordes-sustentados-satb", label: "Acordes sustentados SATB" },
              { type: "timer", instruction: "Cante a sua voz no modo guiado ouvindo o baixo. Sustente cada acorde por 4 tempos, prestando atenção ao “encaixe”.", seconds: 30 },
              {
                type: "check",
                question: "No ensaio, o acorde está “batendo” e uma voz está bem mais forte que as outras. Por onde você se guia?",
                options: ["Pelo baixo e pela fundamental do acorde", "Pela voz mais forte", "Pelo teclado, ignorando o grupo"],
                answer: 0,
                explain: "O baixo dá a referência. A voz mais forte pode estar justamente fora do lugar.",
              },
              { type: "toolLink", tool: "afinador", label: "Confira a sua nota sustentada no afinador" },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "order",
                prompt: "Coloque na ordem para afinar um acorde sustentado.",
                items: [
                  "O baixo firma a fundamental",
                  "Oitavas e quintas se ajustam ao baixo",
                  "A terça encontra o encaixe",
                  "Todos mantêm o apoio do ar até o corte",
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: { passos: ["Laboratório: perceber desafinação no nível recomendado.", "Acordes sustentados no modo conjunto."], minutos: 8, frequencia: "3 vezes por semana" },
        errosComuns: [
          { erro: "Afinar pela voz mais forte do grupo.", correcao: "Afine pelo baixo e pela fundamental do acorde." },
          { erro: "Deixar a nota cair no final.", correcao: "Mantenha o fluxo de ar e o espaço interno até o corte." },
        ],
        seguranca: [...SEGURANCA_BASE.slice(0, 3)],
        criterioAvanco: "Acertar pelo menos 70% na avaliação com diferenças de 25 cents.",
      },
      exercises: [
        { slug: "afinacao-acordes-avaliacao", title: "Avaliação: afinada, acima ou abaixo (25 cents)", instructions: "Diferenças menores exigem atenção.", type: "tuning_check", config: { rounds: 10, cents: 25 }, skill: "percepcao-afinacao", purpose: "avaliacao" },
        { slug: "afinacao-acordes-treinador", title: "Prática: acordes sustentados", instructions: "Cante a sua voz nos acordes sustentados.", type: "harmony_part", config: { voices: 4, arrangementSlug: "acordes-sustentados-satb" }, skill: "harmonia-tres-quatro-vozes", purpose: "pratica" },
      ],
    },
    {
      slug: "independencia-vocal",
      title: "Independência vocal",
      summary: "Ouvir o conjunto sem abandonar a própria voz.",
      level: 3,
      minutes: 25,
      skills: ["independencia-vocal"],
      content: {
        objetivo: "Manter a própria linha com todas as vozes soando no mesmo volume, inclusive com entradas independentes e melodias em movimento contrário.",
        gancho: "Quem nunca se pegou cantando a melodia sem querer, quando a ideia era cantar o contralto ou o tenor? Hoje você treina para ficar firme na sua linha, ouvindo todo mundo.",
        etapas: [
          {
            titulo: "Ouvir sem se perder",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "escuta-ativa" },
              { type: "p", text: "Independência vocal é cantar a sua linha com segurança enquanto ouve o conjunto. Não é ignorar os outros: é ouvir, se localizar e continuar na sua parte." },
              {
                type: "check",
                question: "Qual frase descreve melhor a independência vocal?",
                options: ["Ouvir o conjunto e continuar na sua parte", "Tapar um ouvido e ignorar as outras vozes", "Cantar mais alto que os outros para não se perder"],
                answer: 0,
                explain: "Independência não é isolamento: as outras vozes são suas referências.",
              },
            ],
          },
          {
            titulo: "Suas âncoras",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "equilibrio" },
              {
                type: "list",
                items: [
                  "Conheça a sua parte de cor antes do conjunto.",
                  "Saiba onde estão as notas-âncora e as entradas.",
                  "Ouça a voz logo acima e logo abaixo da sua: elas são suas referências.",
                ],
              },
              {
                type: "callout",
                icon: "ideia",
                title: "Pense num GPS",
                text: "As vozes vizinhas e as notas-âncora mostram onde você está. Se o sinal cair, você recalcula a rota na próxima âncora.",
              },
            ],
          },
          {
            titulo: "Firme contra a correnteza",
            tipo: "experimentar",
            blocos: [
              { type: "audio", label: "A melodia que vai tentar te puxar", notes: ["E4", "F4", "G4", "A4", "G4", "F4", "E4", "D4"], tempo: 90 },
              { type: "singAlong", instruction: "Agora sustente o Dó em “u” por 5 segundos, firme, pensando só na sua nota.", note: "C4", seconds: 5 },
              {
                type: "reveal",
                prompt: "Toque a melodia de novo e, enquanto ela soa, sustente o mesmo Dó. Você sentiu vontade de seguir a melodia?",
                answer: "É normal sentir o “puxão”. Pense na sua nota antes de cantá-la e mantenha o volume confortável. Com prática, a sua linha fica firme mesmo com outra melodia ao lado.",
              },
            ],
          },
          {
            titulo: "Movimento contrário: o grande teste",
            tipo: "ouvir",
            blocos: [
              { type: "p", text: "Quando as vozes vão em direções opostas, é fácil ser arrastado(a). Pense na direção da SUA linha antes de cada nota." },
              {
                type: "check",
                question: "Ouça as duas vozes. A voz grave sobe ou desce?",
                audio: { notes: [["G4", "G3"], ["F4", "A3"], ["E4", "B3"], ["D4", "C4"]], mode: "seq", tempo: 60 },
                options: ["Sobe (Sol–Lá–Si–Dó)", "Desce junto com a aguda", "Fica parada"],
                answer: 0,
                explain: "A aguda desce de Sol para Ré enquanto a grave sobe de Sol para Dó: movimento contrário.",
              },
            ],
          },
          {
            titulo: "Se errar, não pare",
            tipo: "checar",
            blocos: [
              {
                type: "callout",
                icon: "coracao",
                title: "O grupo segue junto",
                text: "Se você se perder, não pare o grupo. Fique em silêncio um instante, ouça e volte na próxima âncora ou na próxima frase.",
              },
              {
                type: "trueFalse",
                items: [
                  { statement: "Se me perder no culto, devo parar e esperar o grupo recomeçar.", answer: false, explain: "Continue e retome na próxima âncora. O grupo não para." },
                  { statement: "Saber a parte de cor ajuda a ouvir melhor as outras vozes.", answer: true, explain: "Sem precisar pensar em cada nota, sobra atenção para ouvir o conjunto." },
                  { statement: "A voz logo acima e logo abaixo da minha são boas referências.", answer: true, explain: "São as vizinhas que mostram onde você está no acorde." },
                ],
              },
            ],
          },
          {
            titulo: "Treine no modo conjunto",
            tipo: "aplicar",
            blocos: [
              { type: "harmonyLink", arrangement: "canone-solfejo", label: "Cânone a quatro vozes" },
              { type: "harmonyLink", arrangement: "hino-alegria-satb", label: "SATB no modo conjunto" },
              {
                type: "checklist",
                title: "Desafio da semana",
                items: [
                  "Cantei a voz 3 do cânone no modo conjunto",
                  "Cantei a minha voz do SATB no mesmo volume das outras",
                  "Fiz a avaliação de sustentação com distração",
                  "Cada dia, uma voz diferente do cânone",
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
                prompt: "Ligue cada momento à atitude certa.",
                pairs: [
                  { left: "Antes do conjunto", right: "Saber a parte de cor" },
                  { left: "Antes da sua entrada", right: "Contar os tempos" },
                  { left: "Para se localizar", right: "Ouvir as vozes vizinhas" },
                  { left: "Se se perder", right: "Voltar na próxima âncora" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: { passos: ["Cânone: cada dia uma voz diferente.", "Sustentação com distração: 3 notas por dia."], minutos: 10, frequencia: "4 vezes por semana" },
        errosComuns: [{ erro: "Parar quando erra.", correcao: "No grupo, continue e retome na próxima âncora." }],
        seguranca: [...SEGURANCA_BASE],
        criterioAvanco: "Média de 70% na sustentação com distração e voz cantada no modo conjunto.",
      },
      exercises: [
        { slug: "independencia-canone", title: "Prática: cânone a quatro vozes", instructions: "Cante uma voz do cânone no modo conjunto.", type: "harmony_part", config: { voices: 4, arrangementSlug: "canone-solfejo" }, skill: "independencia-vocal", purpose: "pratica" },
        { slug: "independencia-avaliacao", title: "Avaliação: sustentação com distração", instructions: "Sustente a sua nota enquanto outra melodia soa (use fones com o microfone).", type: "sing_note", config: { rounds: 4, holdSeconds: 5, toleranceCents: 25, distractor: true }, skill: "independencia-vocal", purpose: "avaliacao" },
      ],
    },
    {
      slug: "arranjos-avancados",
      title: "Arranjos avançados",
      summary: "Contracanto, pedal, dinâmica por naipe, modulação e adaptação de tonalidade.",
      level: 3,
      minutes: 30,
      skills: ["harmonia-tres-quatro-vozes", "teoria-harmonia", "interpretacao"],
      content: {
        objetivo: "Conhecer recursos de arranjo vocal — contracanto, pedal harmônico, introduções e interlúdios vocais, modulação, dinâmica por naipe e construção de clímax — e saber adaptar a tonalidade ao grupo.",
        gancho: "Por que a última estrofe às vezes “sobe” e arrepia a igreja inteira? Hoje você conhece os recursos de arranjo que fazem um hino crescer.",
        etapas: [
          {
            titulo: "Uma melodia por cima da melodia",
            tipo: "ouvir",
            blocos: [
              { type: "p", text: "Contracanto é uma segunda melodia independente, geralmente acima da principal (o descante), que dialoga com ela." },
              {
                type: "compare",
                prompt: "Ouça a melodia sozinha e depois com um contracanto acima.",
                options: [
                  { label: "Só a melodia", notes: ["E4", "D4", "C4", "D4", "E4"], tempo: 70 },
                  { label: "Melodia + contracanto", notes: [["E4", "G4"], ["D4", "B4"], ["C4", "C5"], ["D4", "B4"], ["E4", "G4"]], tempo: 70 },
                ],
                explain: "Quando a melodia desce, o contracanto sobe: as duas linhas conversam. O contracanto colore, mas a melodia continua sendo a principal.",
              },
              {
                type: "check",
                question: "Qual das duas deve soar mais?",
                options: ["A melodia", "O contracanto", "Tanto faz"],
                answer: 0,
                explain: "O contracanto mais forte que a melodia é um erro comum. Ele enfeita; a melodia lidera.",
              },
            ],
          },
          {
            titulo: "Pedal: a nota que não sai do lugar",
            tipo: "ouvir",
            blocos: [
              {
                type: "callout",
                icon: "musica",
                title: "Como o pedal do órgão",
                text: "Pedal harmônico é uma nota sustentada, muitas vezes a tônica ou a dominante no baixo, enquanto os acordes mudam acima dela.",
              },
              {
                type: "check",
                question: "Ouça. Qual voz está parada?",
                audio: { notes: [["G3", "E4"], ["G3", "D4"], ["G3", "C4"], ["G3", "B3"], ["G3", "C4"]], mode: "seq", tempo: 70 },
                options: ["A grave (Sol sustentado)", "A aguda", "Nenhuma das duas"],
                answer: 0,
                explain: "A voz grave sustenta Sol (a dominante de Dó) enquanto a aguda se move: um pedal.",
              },
              { type: "tip", text: "Quem canta o pedal mantém a nota firme, mesmo quando a melodia passa por notas que “brigam” com ela." },
            ],
          },
          {
            titulo: "Subir um tom na última estrofe",
            tipo: "ouvir",
            blocos: [
              {
                type: "compare",
                prompt: "A mesma frase antes e depois de uma modulação.",
                options: [
                  { label: "Em Dó maior", notes: ["C4", "E4", "G4", "E4", "C4"], tempo: 80 },
                  { label: "Um tom acima, em Ré maior", notes: ["D4", "F#4", "A4", "F#4", "D4"], tempo: 80 },
                ],
                explain: "Modulação é mudar de tonalidade. Subir um tom na última estrofe dá a sensação de elevação.",
              },
              { type: "warning", text: "Não module sem preparar a nova nota de entrada: ensaiem a passagem separadamente." },
            ],
          },
          {
            titulo: "Mais cores no arranjo",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "campo-harmonico", caption: "Os acordes disponíveis numa tonalidade." },
              {
                type: "list",
                items: [
                  "Introduções e interlúdios vocais: trechos em “u”, “m” ou sílabas que preparam o texto.",
                  "Rearmonização: trocar alguns acordes mantendo a melodia (ex.: vi no lugar de I).",
                  "Acordes de passagem: acordes rápidos que ligam dois acordes principais.",
                ],
              },
              {
                type: "compare",
                prompt: "A melodia canta Mi nos dois. Só o acorde muda.",
                options: [
                  { label: "Com Dó maior (I)", notes: [["C3", "G3", "C4", "E4"]], mode: "chord" },
                  { label: "Com Lá menor (vi)", notes: [["A2", "A3", "C4", "E4"]], mode: "chord" },
                ],
                explain: "Mi pertence aos dois acordes. Trocar o I pelo vi deixa a mesma nota mais suave e reflexiva.",
              },
            ],
          },
          {
            titulo: "Clímax e dinâmica por naipe",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "dinamica" },
              { type: "p", text: "Os naipes podem entrar aos poucos, a dinâmica cresce e o ponto mais alto coincide com a frase mais importante do texto." },
              {
                type: "reveal",
                prompt: "Pense num hino que o seu grupo canta. Em qual frase do texto você colocaria o clímax?",
                answer: "Escolha a frase que carrega a mensagem central. Planeje para chegar nela com todos os naipes e a dinâmica mais forte, e não antes.",
              },
            ],
          },
          {
            titulo: "A tonalidade certa para todos",
            tipo: "aplicar",
            blocos: [
              { type: "p", text: "A melhor tonalidade coloca a melodia na região confortável do grupo e da congregação. Para louvor congregacional, mantenha a melodia aproximadamente entre Si♭3 e Ré5." },
              { type: "keyboard", from: "A3", to: "E5", highlight: ["Bb3", "D5"], label: "Região confortável da melodia congregacional" },
              {
                type: "check",
                question: "A melodia de um louvor vai até Fá5 e a congregação sofre no refrão. O que fazer?",
                options: ["Descer a tonalidade até a melodia caber na região confortável", "Manter, porque é o tom da gravação", "Pedir para todos cantarem mais forte"],
                answer: 0,
                explain: "O critério é a região confortável do grupo e da congregação, não a gravação original.",
              },
            ],
          },
          {
            titulo: "No treinador de harmonia",
            tipo: "aplicar",
            blocos: [
              { type: "harmonyLink", arrangement: "hino-alegria-contracanto", label: "Hino da Alegria com contracanto e pedal" },
              { type: "harmonyLink", arrangement: "pedal-e-melodia", label: "Nota pedal e melodia" },
              {
                type: "checklist",
                title: "Roteiro de estudo",
                items: [
                  "Ouvi o arranjo no modo conjunto e identifiquei as três camadas",
                  "Cantei o contracanto (vozes agudas) ou o pedal (vozes graves) no modo guiado",
                  "Transpus +2 semitons: ficou mais confortável para o grupo?",
                  "Marquei o compasso do clímax do texto",
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
                prompt: "Ligue cada recurso de arranjo à sua definição.",
                pairs: [
                  { left: "Contracanto", right: "Segunda melodia que dialoga com a principal" },
                  { left: "Pedal", right: "Nota sustentada enquanto os acordes mudam" },
                  { left: "Modulação", right: "Mudança de tonalidade" },
                  { left: "Acorde de passagem", right: "Acorde rápido que liga dois acordes" },
                  { left: "Rearmonização", right: "Trocar acordes mantendo a melodia" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: { passos: ["Treinador: contracanto ou pedal no modo conjunto.", "Escolha uma música do repertório e anote onde caberia um pedal ou uma modulação."], minutos: 15, frequencia: "2 vezes por semana" },
        errosComuns: [
          { erro: "Contracanto mais forte que a melodia.", correcao: "O contracanto colore; a melodia continua sendo a principal." },
          { erro: "Modular sem preparar a nova nota de entrada.", correcao: "Ensaiem a passagem da modulação separadamente." },
        ],
        seguranca: [...SEGURANCA_BASE],
        criterioAvanco: "Acertar pelo menos 70% da avaliação.",
      },
      exercises: [
        { slug: "avancado-treinador", title: "Prática: contracanto e pedal", instructions: "Cante uma camada do arranjo com contracanto.", type: "harmony_part", config: { voices: 3, arrangementSlug: "hino-alegria-contracanto" }, skill: "harmonia-tres-quatro-vozes", purpose: "pratica" },
        {
          slug: "avancado-avaliacao",
          title: "Avaliação: recursos de arranjo",
          instructions: "Responda sobre arranjos avançados.",
          type: "quiz",
          config: {
            questions: [
              { q: "Uma nota sustentada no baixo enquanto os acordes mudam acima é um…", options: ["Pedal harmônico", "Contracanto", "Cânone", "Acorde de passagem"], answer: 0 },
              { q: "Contracanto é…", options: ["Uma segunda melodia independente que dialoga com a principal", "A melodia cantada mais forte", "Cantar sem texto", "Um tipo de respiração"], answer: 0 },
              { q: "Uma modulação comum para a última estrofe é…", options: ["Subir um tom", "Descer uma oitava", "Mudar para compasso ternário", "Retirar o baixo"], answer: 0 },
              { q: "O critério principal para escolher a tonalidade de um louvor congregacional é…", options: ["A região confortável do grupo e da congregação", "A tonalidade da gravação original", "A preferência do instrumentista", "Ser sempre Dó maior"], answer: 0 },
              {
                q: "Ouça: há uma nota grave sustentada enquanto a melodia se move?",
                options: ["Sim, um pedal", "Não"],
                answer: 0,
                audio: { notes: [["C3", "C4"], ["C3", "D4"], ["C3", "E4"], ["C3", "F4"], ["C3", "E4"]], mode: "seq", tempo: 80 },
              },
            ],
          },
          skill: "teoria-harmonia",
          purpose: "avaliacao",
        },
      ],
    },
  ],
};
