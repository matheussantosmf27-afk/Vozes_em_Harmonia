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
    // -----------------------------------------------------------------------
    {
      slug: "grave-e-agudo",
      title: "Reconhecimento de notas graves e agudas",
      summary: "Perceber a direção do som: mais agudo, mais grave ou igual.",
      level: 1,
      minutes: 15,
      skills: ["discriminacao-altura"],
      content: {
        objetivo: "Perceber se uma nota é mais aguda, mais grave ou igual a outra, mesmo quando a diferença é pequena.",
        gancho: "Será que você percebe quando a melodia sobe só um pouquinho? Vamos treinar o ouvido com desafios rápidos, do mais fácil ao mais sutil.",
        etapas: [
          {
            titulo: "Fino ou grosso?",
            tipo: "descobrir",
            blocos: [
              {
                type: "p",
                text: "Altura é o que faz um som ser agudo (“fino”) ou grave (“grosso”). Ela depende da frequência: quanto mais vibrações por segundo, mais agudo o som.",
              },
              {
                type: "compare",
                prompt: "Ouça as duas notas. Qual é a mais aguda?",
                options: [
                  { label: "Dó5, a mais aguda", notes: ["C5"] },
                  { label: "Dó4, a mais grave", notes: ["C4"] },
                ],
                answer: 0,
                explain: "O Dó5 vibra duas vezes mais rápido que o Dó4: é a mesma nota, uma oitava acima.",
              },
            ],
          },
          {
            titulo: "Esquerda grave, direita aguda",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "intervalo-escada", caption: "Cada degrau acima é um som mais agudo." },
              { type: "keyboard", from: "C3", to: "C5", label: "Toque teclas à esquerda (graves) e à direita (agudas)" },
              {
                type: "check",
                question: "No teclado, para que lado as notas ficam mais agudas?",
                options: ["Para a direita", "Para a esquerda", "Depende da cor da tecla"],
                answer: 0,
                explain: "Da esquerda para a direita o som sobe. As teclas pretas seguem a mesma regra das brancas.",
              },
            ],
          },
          {
            titulo: "Do grande ao pequeno",
            tipo: "ouvir",
            blocos: [
              {
                type: "callout",
                icon: "maos",
                title: "Use a mão",
                text: "Ao ouvir cada par, mova a mão para cima ou para baixo junto com a segunda nota. Muita gente percebe melhor a direção com um gesto.",
              },
              { type: "audio", label: "Grande diferença: Dó4 → Dó5", notes: ["C4", "C5"], tempo: 60 },
              { type: "audio", label: "Diferença média: Dó4 → Sol4", notes: ["C4", "G4"], tempo: 60 },
              { type: "audio", label: "Diferença pequena: Dó4 → Ré4", notes: ["C4", "D4"], tempo: 60 },
              { type: "audio", label: "Descendo: Sol4 → Mi4", notes: ["G4", "E4"], tempo: 60 },
            ],
          },
          {
            titulo: "Desafio: para onde foi?",
            tipo: "ouvir",
            blocos: [
              { type: "p", text: "Ouça até o fim da segunda nota antes de responder. Pode repetir quantas vezes quiser." },
              {
                type: "check",
                question: "A segunda nota é…",
                options: ["Mais aguda", "Mais grave", "Igual"],
                answer: 1,
                explain: "Mi4 → Dó4: a melodia desceu. Sua mão deveria ter ido para baixo.",
                audio: { notes: ["E4", "C4"], tempo: 60 },
              },
              {
                type: "check",
                question: "E agora, a segunda nota é…",
                options: ["Mais aguda", "Mais grave", "Igual"],
                answer: 0,
                explain: "Ré4 → Mi4: subiu só um tom. Diferenças pequenas exigem atenção, mas o ouvido aprende rápido.",
                audio: { notes: ["D4", "E4"], tempo: 60 },
              },
              {
                type: "check",
                question: "E neste par?",
                options: ["Mais aguda", "Mais grave", "Igual"],
                answer: 2,
                explain: "Lá3 → Lá3: a mesma nota repetida. “Igual” também é uma resposta possível!",
                audio: { notes: ["A3", "A3"], tempo: 60 },
              },
            ],
          },
          {
            titulo: "Altura não é volume",
            tipo: "descobrir",
            blocos: [
              {
                type: "p",
                text: "Um som pode ser grave e forte, ou agudo e suave. E timbre é outra coisa: um violão e uma voz podem tocar exatamente a mesma altura.",
              },
              {
                type: "trueFalse",
                items: [
                  { statement: "Um som mais forte é sempre mais agudo.", answer: false, explain: "Volume e altura são independentes. Os exercícios tocam as notas com o mesmo volume para você focar só na altura." },
                  { statement: "Uma voz e um violão podem tocar a mesma nota.", answer: true, explain: "A cor do som (timbre) muda, mas a altura pode ser idêntica." },
                  { statement: "Uma nota grave pode ser cantada bem suave.", answer: true, explain: "Grave não quer dizer forte. O baixo do coral canta pianíssimo muitas vezes." },
                ],
              },
            ],
          },
          {
            titulo: "Sua voz sobe",
            tipo: "experimentar",
            blocos: [
              { type: "p", text: "Agora sinta a diferença de altura na própria voz. Cante em “lá”, sem esforço." },
              { type: "singAlong", instruction: "Ouça e cante o Dó em “lá”, sustentando.", note: "C4", seconds: 3 },
              { type: "singAlong", instruction: "Agora uma nota mais aguda: Mi. Sinta a voz subir, sem apertar.", note: "E4", seconds: 3 },
            ],
          },
          {
            titulo: "Nos hinos",
            tipo: "aplicar",
            blocos: [
              { type: "p", text: "Toda melodia é feita de notas que sobem, descem ou repetem. Ouça este trecho conhecido." },
              {
                type: "check",
                question: "No “Parabéns pra você”, a primeira frase termina mais aguda ou mais grave do que começou?",
                options: ["Mais aguda", "Mais grave", "Na mesma nota"],
                answer: 0,
                explain: "Sol–Sol–Lá–Sol–Dó–Si: a frase começa no Sol e chega ao Si, acima. Faça o mesmo exercício ao ouvir os hinos do culto.",
                audio: { notes: ["G4", "G4", "A4", "G4", "C5", "B4"], tempo: 90 },
              },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "match",
                prompt: "Ligue cada ideia ao que ela significa.",
                pairs: [
                  { left: "Mais vibrações por segundo", right: "Som mais agudo" },
                  { left: "Teclas à esquerda", right: "Notas mais graves" },
                  { left: "Volume", right: "Forte ou suave" },
                  { left: "Timbre", right: "A cor do som (voz ou violão)" },
                ],
              },
            ],
          },
        ],
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
    // -----------------------------------------------------------------------
    {
      slug: "reproducao-de-notas",
      title: "Reprodução de notas",
      summary: "Encontrar no teclado e na voz a nota que você ouviu.",
      level: 1,
      minutes: 20,
      skills: ["afinacao-nota", "discriminacao-altura"],
      content: {
        objetivo: "Reproduzir notas isoladas com a voz e encontrá-las no teclado a partir de uma referência.",
        gancho: "No ensaio, o pianista toca a sua nota e você precisa cantá-la na hora. Vamos ligar o ouvido à voz e ao teclado, passo a passo.",
        etapas: [
          {
            titulo: "Ouvir, pensar, cantar",
            tipo: "descobrir",
            blocos: [
              { type: "p", text: "Reproduzir uma nota é ligar o que o ouvido percebe ao que a voz faz. O segredo é a escuta interna: “cantar por dentro” antes de cantar em voz alta." },
              {
                type: "callout",
                icon: "ouvido",
                title: "Um segundo de silêncio",
                text: "Entre ouvir e cantar, faça uma pausa curta e imagine a nota na cabeça. Esse segundo evita o “chute”.",
              },
              {
                type: "order",
                prompt: "Coloque o caminho na ordem certa.",
                items: ["Ouvir a nota", "Cantar por dentro, em silêncio", "Cantar em voz alta", "Conferir no teclado ou no afinador"],
              },
            ],
          },
          {
            titulo: "O mapa do teclado",
            tipo: "descobrir",
            blocos: [
              { type: "keyboard", from: "C4", to: "C5", highlight: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"], label: "Notas naturais de Dó4 a Dó5" },
              {
                type: "list",
                items: [
                  "Teclas brancas: Dó, Ré, Mi, Fá, Sol, Lá, Si; depois o Dó se repete uma oitava acima.",
                  "Teclas pretas: sustenidos (♯) e bemóis (♭).",
                  "O dó central do piano é o Dó4.",
                ],
              },
              {
                type: "check",
                question: "Dó♯ e Ré♭ são…",
                options: ["A mesma tecla preta", "Duas teclas diferentes", "Uma tecla branca e uma preta"],
                answer: 0,
                explain: "É a mesma tecla, entre o Dó e o Ré, com dois nomes possíveis.",
              },
            ],
          },
          {
            titulo: "Sua vez: cante o Dó",
            tipo: "experimentar",
            blocos: [
              { type: "p", text: "Vozes masculinas costumam cantar uma oitava abaixo das femininas. Se for o seu caso, use o botão “Voz grave”." },
              { type: "singAlong", instruction: "Ouça o Dó4, cante por dentro e depois cante em “lá”, sustentando.", note: "C4", seconds: 3 },
              { type: "singAlong", instruction: "Agora o Mi4. Mesmo caminho: ouvir, pensar, cantar.", note: "E4", seconds: 3 },
            ],
          },
          {
            titulo: "Acima ou abaixo? Perto ou longe?",
            tipo: "ouvir",
            blocos: [
              { type: "p", text: "Para achar uma nota no teclado, use o Dó como referência. A nota misteriosa está acima ou abaixo dele? Perto ou longe?" },
              {
                type: "compare",
                prompt: "Em qual opção a segunda nota está mais longe do Dó?",
                options: [
                  { label: "Dó4 → Mi4 (perto)", notes: ["C4", "E4"], tempo: 50 },
                  { label: "Dó4 → Lá4 (mais longe)", notes: ["C4", "A4"], tempo: 50 },
                ],
                answer: 1,
                explain: "Do Dó ao Lá são cinco teclas brancas de distância; do Dó ao Mi, só duas. Perceber a distância encurta a busca.",
              },
            ],
          },
          {
            titulo: "Desafio: qual é a nota?",
            tipo: "ouvir",
            blocos: [
              {
                type: "check",
                question: "Primeiro o Dó4 de referência, depois a nota misteriosa. Qual é ela?",
                options: ["Ré4", "Sol4", "Dó5"],
                answer: 1,
                explain: "É o Sol4: acima do Dó, distância média. O Ré seria bem perto e o Dó5 soaria como o mesmo Dó, só mais agudo.",
                audio: { notes: ["C4", "G4"], tempo: 50 },
              },
              { type: "keyboard", from: "C4", to: "C5", highlight: ["C4"], label: "Confira: toque o Dó e procure a nota pelas vizinhas" },
            ],
          },
          {
            titulo: "Bem no centro da nota",
            tipo: "ouvir",
            blocos: [
              { type: "illustration", name: "onda-afinada", caption: "Afinado: as ondas da voz e da referência se encaixam." },
              {
                type: "compare",
                prompt: "Qual das duas notas está afinada?",
                options: [
                  { label: "Afinada", notes: ["C4"] },
                  { label: "Um pouco abaixo", notes: ["C4"], cents: -35 },
                ],
                answer: 0,
                explain: "A outra estava levemente abaixo. Cantar a nota certa é só metade: sustentar no centro dela é a outra metade.",
              },
              { type: "toolLink", tool: "afinador", label: "Treinador de afinação: sustente 3 notas e veja se ficam no centro" },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "trueFalse",
                items: [
                  { statement: "O jeito mais rápido de achar a nota é testar teclas aleatórias.", answer: false, explain: "Compare com a referência: acima ou abaixo, perto ou longe. Depois teste as vizinhas." },
                  { statement: "O dó central do piano é o Dó4.", answer: true, explain: "Ele é o ponto de partida dos exercícios desta trilha." },
                  { statement: "Um homem que canta a nota uma oitava abaixo da referência está cantando a mesma nota.", answer: true, explain: "Mesmo nome, uma oitava abaixo. É o natural para vozes masculinas." },
                ],
              },
              { type: "toolLink", tool: "teclado", label: "Abrir o teclado interativo com nomes das notas" },
            ],
          },
        ],
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
    // -----------------------------------------------------------------------
    {
      slug: "intervalos-simples",
      title: "Intervalos simples",
      summary: "Terças, quintas e oitavas: as distâncias que formam as harmonias.",
      level: 1,
      minutes: 25,
      skills: ["intervalos"],
      content: {
        objetivo: "Reconhecer pelo som e pelo nome os intervalos de terça maior, terça menor, quinta justa e oitava, ascendentes e simultâneos.",
        gancho: "Toda harmonia bonita do coral é feita de distâncias entre notas. Aprenda a reconhecer quatro delas e você começa a ouvir onde a sua voz se encaixa.",
        etapas: [
          {
            titulo: "A distância entre duas notas",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "intervalo-escada", caption: "Intervalo: quantos degraus separam duas notas." },
              {
                type: "p",
                text: "Intervalo é a distância entre duas notas. Medimos em semitons (cada tecla vizinha) e damos o nome contando as notas da escala: de Dó a Mi há três notas (Dó, Ré, Mi), então é uma terça.",
              },
              {
                type: "check",
                question: "Contando Dó, Ré, Mi, Fá, Sol: que intervalo há de Dó a Sol?",
                options: ["Quinta", "Quarta", "Terça", "Oitava"],
                answer: 0,
                explain: "São cinco notas, do Dó ao Sol: uma quinta.",
              },
            ],
          },
          {
            titulo: "Quatro distâncias para conhecer",
            tipo: "ouvir",
            blocos: [
              {
                type: "list",
                items: [
                  "Terça menor (3 semitons): Dó → Mi♭ ou Lá → Dó. Som mais introspectivo.",
                  "Terça maior (4 semitons): Dó → Mi. Som luminoso.",
                  "Quinta justa (7 semitons): Dó → Sol. Som aberto, estável.",
                  "Oitava (12 semitons): Dó → Dó. A mesma nota mais aguda.",
                ],
              },
              { type: "intervals", root: "C4", semitones: [3, 4, 7, 12] },
            ],
          },
          {
            titulo: "Luminosa ou introspectiva?",
            tipo: "ouvir",
            blocos: [
              {
                type: "compare",
                prompt: "Ouça as duas terças, uma depois da outra.",
                options: [
                  { label: "Terça maior: Dó → Mi", notes: ["C4", "E4"], tempo: 60 },
                  { label: "Terça menor: Dó → Mi♭", notes: ["C4", "Eb4"], tempo: 60 },
                ],
                explain: "Só um semitom de diferença muda o caráter: a maior soa luminosa, a menor mais introspectiva.",
              },
              {
                type: "compare",
                prompt: "Desafio: agora as notas soam juntas. Qual é a terça maior?",
                options: [
                  { label: "Terça menor: Lá + Dó", notes: [["A3", "C4"]] },
                  { label: "Terça maior: Fá + Lá", notes: [["F3", "A3"]] },
                ],
                answer: 1,
                explain: "Fá–Lá tem 4 semitons; Lá–Dó tem 3. Pense em acorde maior e acorde menor.",
              },
            ],
          },
          {
            titulo: "Quinta ou oitava?",
            tipo: "ouvir",
            blocos: [
              {
                type: "callout",
                icon: "ouvido",
                title: "A pista da oitava",
                text: "A oitava soa como a mesma nota repetida mais aguda. A quinta soa como duas notas diferentes que combinam muito bem.",
              },
              {
                type: "check",
                question: "Que intervalo é este?",
                options: ["Terça maior", "Quinta justa", "Oitava"],
                answer: 2,
                explain: "Dó4 → Dó5: a mesma nota, mais aguda. É a oitava.",
                audio: { notes: ["C4", "C5"], tempo: 60 },
              },
              {
                type: "check",
                question: "E este?",
                options: ["Terça menor", "Quinta justa", "Oitava"],
                answer: 1,
                explain: "Ré4 → Lá4: notas diferentes, som aberto e estável. Quinta justa, 7 semitons.",
                audio: { notes: ["D4", "A4"], tempo: 60 },
              },
            ],
          },
          {
            titulo: "Uma depois da outra, ou juntas?",
            tipo: "descobrir",
            blocos: [
              {
                type: "p",
                text: "Melódico: as notas soam uma depois da outra. Harmônico: soam juntas. Cantar em harmonia é cantar intervalos harmônicos com outras pessoas.",
              },
              {
                type: "compare",
                prompt: "A mesma quinta, de dois jeitos.",
                options: [
                  { label: "Melódica", notes: ["C4", "G4"], tempo: 60 },
                  { label: "Harmônica", notes: [["C4", "G4"]] },
                ],
                explain: "Mesmas notas, mesma distância. Muda só se elas soam em sequência ou ao mesmo tempo.",
              },
              { type: "staff", clef: "sol", notes: ["C4", "E4", "G4", "C5"], label: "Dó, Mi, Sol e Dó na pauta" },
            ],
          },
          {
            titulo: "Cante a escada de terças",
            tipo: "experimentar",
            blocos: [
              { type: "singAlong", instruction: "Cante a nota grave do intervalo: Dó.", note: "C4", seconds: 3 },
              { type: "singAlong", instruction: "Agora a terça maior acima: Mi.", note: "E4", seconds: 3 },
              { type: "timer", instruction: "Cante devagar, em “lá”, as terças da escala de Dó: Dó–Mi, Ré–Fá, Mi–Sol. Homens, uma oitava abaixo.", seconds: 30 },
            ],
          },
          {
            titulo: "Intervalos que você já conhece",
            tipo: "aplicar",
            blocos: [
              {
                type: "callout",
                icon: "musica",
                title: "Memorize com músicas",
                text: "A quinta justa está em “Brilha, brilha, estrelinha”; a quarta justa, no início de “Graça Excelsa”. Associar intervalos a melodias conhecidas acelera o reconhecimento.",
              },
              {
                type: "check",
                question: "Ouça o início de “Brilha, brilha”. Que intervalo há entre a segunda e a terceira nota?",
                options: ["Terça maior", "Quinta justa", "Oitava"],
                answer: 1,
                explain: "Dó–Dó–Sol–Sol: o salto de Dó para Sol é uma quinta justa.",
                audio: { notes: ["C4", "C4", "G4", "G4", "A4", "A4", "G4"], tempo: 90 },
              },
              { type: "harmonyLink", arrangement: "tercas-paralelas", label: "Cante terças paralelas no treinador de harmonia" },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "match",
                prompt: "Ligue cada intervalo ao seu tamanho e exemplo.",
                pairs: [
                  { left: "Terça menor", right: "3 semitons (Lá → Dó)" },
                  { left: "Terça maior", right: "4 semitons (Dó → Mi)" },
                  { left: "Quinta justa", right: "7 semitons (Dó → Sol)" },
                  { left: "Oitava", right: "12 semitons (Dó → Dó)" },
                ],
              },
            ],
          },
        ],
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
    // -----------------------------------------------------------------------
    {
      slug: "memoria-de-sequencias",
      title: "Memorização de sequências",
      summary: "Guardar e reproduzir pequenas melodias.",
      level: 1,
      minutes: 20,
      skills: ["memoria-melodica"],
      content: {
        objetivo: "Memorizar sequências de 3 a 5 notas e reproduzi-las no teclado e com a voz.",
        gancho: "Já esqueceu a sua voz do arranjo logo depois de ouvi-la? Existe um jeito de guardar melodias que não depende de decorar nota por nota.",
        etapas: [
          {
            titulo: "Desenho, não nota por nota",
            tipo: "descobrir",
            blocos: [
              {
                type: "p",
                text: "Aprender a sua voz num arranjo depende de memória melódica. A estratégia é perceber o desenho da melodia (sobe, desce, repete), os saltos e a nota de chegada.",
              },
              {
                type: "callout",
                icon: "ideia",
                title: "Como um caminho conhecido",
                text: "Você não decora cada passo até a igreja: lembra das curvas e dos pontos de referência. Com a melodia é igual.",
              },
              {
                type: "check",
                question: "O que ajuda mais a memorizar uma linha melódica?",
                options: ["Perceber o desenho, os saltos e a nota de chegada", "Decorar cada nota isolada", "Tocar rápido no teclado até acertar"],
                answer: 0,
                explain: "O desenho organiza a memória. Nota por nota sobrecarrega, e o teclado só confirma o que você já ouviu.",
              },
            ],
          },
          {
            titulo: "Três desenhos",
            tipo: "ouvir",
            blocos: [
              { type: "p", text: "Ouça cada sequência e desenhe no ar o caminho com o dedo." },
              { type: "audio", label: "Sobe por graus: Dó–Ré–Mi", notes: ["C4", "D4", "E4"], tempo: 84 },
              { type: "audio", label: "Com repetição: Sol–Sol–Mi–Dó", notes: ["G4", "G4", "E4", "C4"], tempo: 84 },
              { type: "audio", label: "Com salto: Dó–Sol–Mi–Ré", notes: ["C4", "G4", "E4", "D4"], tempo: 84 },
              { type: "illustration", name: "intervalo-escada", caption: "Grau: degrau vizinho. Salto: pula degraus." },
            ],
          },
          {
            titulo: "Que desenho é esse?",
            tipo: "ouvir",
            blocos: [
              {
                type: "check",
                question: "Qual é o desenho desta sequência?",
                options: ["Repete e depois desce", "Sobe, sobe", "Desce e depois sobe"],
                answer: 0,
                explain: "Sol–Sol–Mi–Dó: duas notas iguais e depois desce até o Dó.",
                audio: { notes: ["G4", "G4", "E4", "C4"], tempo: 84 },
              },
              {
                type: "compare",
                prompt: "Qual das duas sequências tem um salto?",
                options: [
                  { label: "Só graus: Dó–Ré–Mi–Ré", notes: ["C4", "D4", "E4", "D4"], tempo: 84 },
                  { label: "Com salto: Dó–Sol–Mi–Ré", notes: ["C4", "G4", "E4", "D4"], tempo: 84 },
                ],
                answer: 1,
                explain: "De Dó para Sol a melodia pula vários degraus. Saltos são ótimos pontos de referência para a memória.",
              },
            ],
          },
          {
            titulo: "O método em quatro passos",
            tipo: "descobrir",
            blocos: [
              {
                type: "order",
                prompt: "Coloque os passos na ordem certa.",
                items: [
                  "Ouvir uma vez só observando o desenho",
                  "Ouvir de novo cantando por dentro",
                  "Cantar em voz alta, em “lá” ou com os nomes das notas",
                  "Procurar no teclado a partir da primeira nota",
                ],
              },
              { type: "tip", title: "O teclado vem por último", text: "Cante primeiro; o teclado confirma o que você já sabe." },
            ],
          },
          {
            titulo: "Sua vez: Dó–Ré–Mi",
            tipo: "experimentar",
            blocos: [
              { type: "singAlong", instruction: "A primeira nota é Dó. Cante-a em “lá” para se localizar.", note: "C4", seconds: 3 },
              { type: "timer", instruction: "Cante Dó–Ré–Mi em “lá” e depois com os nomes. Desenhe no ar: sobe, sobe.", seconds: 15, reps: 2 },
              { type: "keyboard", from: "C4", to: "G4", highlight: ["C4"], label: "Agora toque a sequência a partir do Dó destacado" },
            ],
          },
          {
            titulo: "Desafio de memória",
            tipo: "ouvir",
            blocos: [
              { type: "audio", label: "Modelo: ouça bem e guarde", notes: ["C4", "E4", "G4", "E4"], tempo: 84 },
              {
                type: "compare",
                prompt: "Sem voltar ao modelo: qual opção repete exatamente o que você ouviu?",
                options: [
                  { label: "Dó–Mi–Lá–Mi", notes: ["C4", "E4", "A4", "E4"], tempo: 84 },
                  { label: "Dó–Mi–Sol–Mi (igual ao modelo)", notes: ["C4", "E4", "G4", "E4"], tempo: 84 },
                  { label: "Dó–Mi–Sol–Dó", notes: ["C4", "E4", "G4", "C4"], tempo: 84 },
                ],
                answer: 1,
                explain: "Sobe, sobe, desce um degrau e chega no Mi. Lembrar do ponto mais agudo e da nota de chegada resolve.",
              },
            ],
          },
          {
            titulo: "No ensaio",
            tipo: "aplicar",
            blocos: [
              { type: "illustration", name: "escuta-ativa", caption: "Ouça primeiro, cante depois." },
              {
                type: "check",
                question: "O regente toca a linha do seu naipe uma vez. O que fazer antes de cantar?",
                options: ["Observar o desenho e a nota de chegada, cantando por dentro", "Cantar junto logo de primeira, bem forte", "Esperar o naipe ao lado cantar e imitar"],
                answer: 0,
                explain: "Ouvir com atenção ao desenho é o que faz a linha ficar na memória.",
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
                  { statement: "Memorizar nota por nota é o jeito mais eficiente.", answer: false, explain: "Memorize o desenho e os pontos de chegada." },
                  { statement: "Saltos e notas repetidas ajudam a guardar a melodia.", answer: true, explain: "Eles funcionam como pontos de referência no caminho." },
                  { statement: "Tocar rápido no teclado acelera a memorização.", answer: false, explain: "Cante primeiro e vá devagar: o teclado só confirma." },
                ],
              },
            ],
          },
        ],
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
    // -----------------------------------------------------------------------
    {
      slug: "ritmo-e-pulsacao",
      title: "Ritmo e pulsação",
      summary: "Sentir o pulso e reproduzir padrões rítmicos.",
      level: 1,
      minutes: 20,
      skills: ["ritmo-pulsacao"],
      content: {
        objetivo: "Sentir a pulsação, manter o andamento e reproduzir padrões rítmicos simples com semínimas, mínimas e colcheias.",
        gancho: "Num grupo, entrar meio tempo atrasado aparece tanto quanto desafinar. Vamos colocar o pulso da música no seu corpo.",
        etapas: [
          {
            titulo: "O coração da música",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "pulso", caption: "Batidas regulares, como um coração." },
              { type: "p", text: "Pulsação é a batida regular que sentimos na música: a que marcamos com o pé. Ouça e bata o pé junto." },
              { type: "rhythm", pattern: "q q q q", bpm: 80, label: "Quatro semínimas: uma em cada pulso" },
            ],
          },
          {
            titulo: "Pulso, andamento e ritmo",
            tipo: "descobrir",
            blocos: [
              {
                type: "p",
                text: "O andamento é a velocidade da pulsação, medida em batidas por minuto (bpm). O ritmo é a combinação de durações curtas e longas sobre a pulsação.",
              },
              {
                type: "compare",
                prompt: "Qual das duas tem o andamento mais rápido?",
                options: [
                  { label: "100 bpm", notes: ["C4", "C4", "C4", "C4"], tempo: 100 },
                  { label: "60 bpm", notes: ["C4", "C4", "C4", "C4"], tempo: 60 },
                ],
                answer: 0,
                explain: "Mais batidas por minuto, pulso mais rápido. As notas são as mesmas: só muda a velocidade.",
              },
            ],
          },
          {
            titulo: "Longas e curtas",
            tipo: "ouvir",
            blocos: [
              { type: "illustration", name: "figuras-ritmicas" },
              {
                type: "list",
                items: ["Semínima: dura 1 tempo.", "Mínima: dura 2 tempos.", "Colcheia: dura meio tempo (duas colcheias por tempo)."],
              },
              { type: "rhythm", pattern: "h h", bpm: 80, label: "Duas mínimas" },
              { type: "rhythm", pattern: "q e e q q", bpm: 80, label: "Semínima, duas colcheias, duas semínimas" },
            ],
          },
          {
            titulo: "Fale o ritmo",
            tipo: "experimentar",
            blocos: [
              { type: "toolLink", tool: "metronomo", label: "Abrir o metrônomo em 80 bpm" },
              { type: "timer", instruction: "Bata o pé em cada clique e fale “tá” em cada tempo (semínimas).", seconds: 20 },
              { type: "timer", instruction: "Agora “tá-a”, segurando dois tempos (mínimas). O pé continua batendo.", seconds: 20 },
              { type: "timer", instruction: "Agora “ti-ti”: duas colcheias dentro de cada tempo, sem acelerar o pé.", seconds: 20 },
            ],
          },
          {
            titulo: "Conte os tempos",
            tipo: "checar",
            blocos: [
              {
                type: "check",
                question: "Quantas semínimas cabem numa mínima?",
                options: ["Duas", "Uma", "Quatro"],
                answer: 0,
                explain: "A mínima dura 2 tempos; cada semínima, 1.",
                illustration: "figuras-ritmicas",
              },
              {
                type: "check",
                question: "Quando aparecem colcheias, o que acontece com o pulso?",
                options: ["Continua igual; as colcheias cabem dentro do tempo", "Acelera junto com elas", "Fica mais lento"],
                answer: 0,
                explain: "As notas curtas dividem o tempo, mas o pé segue no mesmo andamento.",
              },
            ],
          },
          {
            titulo: "O compasso 4/4",
            tipo: "ouvir",
            blocos: [
              { type: "illustration", name: "compasso", caption: "Quatro tempos por compasso; o 1 é o mais forte." },
              { type: "p", text: "No compasso 4/4 contamos quatro tempos, e o primeiro é o mais forte. Conte em voz alta: UM, dois, três, quatro." },
              { type: "rhythm", pattern: "q q h", bpm: 80, label: "Duas semínimas e uma mínima: um compasso completo" },
            ],
          },
          {
            titulo: "Entradas seguras no ensaio",
            tipo: "aplicar",
            blocos: [
              {
                type: "callout",
                icon: "coracao",
                title: "Cantar junto começa no ritmo",
                text: "Sentir a pulsação no corpo (pé, mão) dá segurança para as entradas. O pulso é o mesmo para todos os naipes.",
              },
              {
                type: "check",
                question: "O regente marca quatro tempos antes da entrada do coral. O que fazer?",
                options: ["Sentir o pulso desde a marcação e entrar junto no tempo certo", "Esperar ouvir alguém começar e então entrar", "Entrar quando se sentir pronto(a)"],
                answer: 0,
                explain: "Quem espera os outros entra atrasado. Quem já está no pulso entra junto.",
              },
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
                  { left: "Pulsação", right: "Batida regular da música" },
                  { left: "Andamento", right: "Velocidade, em bpm" },
                  { left: "Mínima", right: "Dura 2 tempos" },
                  { left: "Colcheia", right: "Dura meio tempo" },
                ],
              },
            ],
          },
        ],
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
    // -----------------------------------------------------------------------
    {
      slug: "acordes-basicos",
      title: "Reconhecimento de acordes básicos",
      summary: "Maior, menor e as notas extremas de um acorde.",
      level: 2,
      minutes: 25,
      skills: ["acordes", "consonancia"],
      content: {
        objetivo: "Distinguir acordes maiores e menores, ouvir a nota mais grave e a mais aguda de um acorde e reconhecer consonância e dissonância.",
        gancho: "Quando o coral canta junto, cada voz é uma peça do acorde. Vamos aprender a ouvir o acorde inteiro e achar o seu lugar dentro dele.",
        etapas: [
          {
            titulo: "Três notas, um acorde",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "triade", caption: "Fundamental, terça e quinta empilhadas." },
              {
                type: "p",
                text: "Um acorde é a combinação de três ou mais notas soando juntas. A tríade básica tem fundamental, terça e quinta.",
              },
              { type: "audio", label: "Dó maior: notas separadas e depois juntas", notes: ["C4", "E4", "G4", ["C4", "E4", "G4"]], tempo: 70 },
            ],
          },
          {
            titulo: "A terça decide",
            tipo: "ouvir",
            blocos: [
              {
                type: "p",
                text: "O que muda entre maior e menor é a terça: maior fica 4 semitons acima da fundamental; menor, 3 semitons. Fundamental e quinta não mudam.",
              },
              { type: "chords", root: "C4", qualities: ["maior", "menor"] },
              {
                type: "compare",
                prompt: "Compare Dó maior e Dó menor: só uma nota muda.",
                options: [
                  { label: "Dó maior: Dó–Mi–Sol", notes: [["C4", "E4", "G4"]] },
                  { label: "Dó menor: Dó–Mi♭–Sol", notes: [["C4", "Eb4", "G4"]] },
                ],
                explain: "O Mi desce meio-tom para Mi♭ e o acorde muda de cor.",
              },
            ],
          },
          {
            titulo: "Desafio: maior ou menor?",
            tipo: "ouvir",
            blocos: [
              {
                type: "compare",
                prompt: "Qual destes acordes é maior?",
                options: [
                  { label: "Ré menor", notes: [["D4", "F4", "A4"]] },
                  { label: "Fá maior", notes: [["F3", "A3", "C4"]] },
                ],
                answer: 1,
                explain: "Fá–Lá tem 4 semitons: terça maior. Ré–Fá tem 3: terça menor.",
              },
              {
                type: "check",
                question: "E este acorde, é maior ou menor?",
                options: ["Maior", "Menor"],
                answer: 1,
                explain: "Lá–Dó–Mi: de Lá a Dó são 3 semitons, terça menor. É Lá menor.",
                audio: { notes: ["A3", "C4", "E4", ["A3", "C4", "E4"]], tempo: 70 },
              },
            ],
          },
          {
            titulo: "Cante as notas do acorde",
            tipo: "experimentar",
            blocos: [
              { type: "audio", label: "Lá menor arpejado e em bloco", notes: ["A3", "C4", "E4", ["A3", "C4", "E4"]], tempo: 70 },
              { type: "singAlong", instruction: "Cante a fundamental: Lá.", note: "A3", seconds: 3 },
              { type: "timer", instruction: "Cante devagar, em “lá”, as três notas: Lá–Dó–Mi, e depois de volta. Sem esforço.", seconds: 20 },
              { type: "singAlong", instruction: "Agora sustente a quinta, a nota mais aguda do acorde: Mi.", note: "E4", seconds: 3 },
            ],
          },
          {
            titulo: "A mais grave e a mais aguda",
            tipo: "ouvir",
            blocos: [
              {
                type: "p",
                text: "No grupo, a nota mais grave costuma ser do baixo, e a mais aguda, da melodia. Ouvi-las ajuda você a se localizar: “minha nota está no meio, acima do baixo”.",
              },
              {
                type: "compare",
                prompt: "Cada opção toca o acorde e depois uma nota. Qual nota é a mais grave do acorde?",
                options: [
                  { label: "Mi, a do meio", notes: [["C4", "E4", "G4"], "E4"], tempo: 60 },
                  { label: "Dó, a mais grave", notes: [["C4", "E4", "G4"], "C4"], tempo: 60 },
                  { label: "Sol, a mais aguda", notes: [["C4", "E4", "G4"], "G4"], tempo: 60 },
                ],
                answer: 1,
                explain: "O Dó é a base. Dica: enquanto o acorde soa, cante baixinho a nota que você acha que é a mais grave.",
              },
            ],
          },
          {
            titulo: "Repouso e tensão",
            tipo: "descobrir",
            blocos: [
              {
                type: "list",
                items: [
                  "Consonâncias soam estáveis: oitava, quinta, terças, sextas.",
                  "Dissonâncias soam tensas e pedem resolução: segundas, sétimas, trítono.",
                ],
              },
              { type: "intervals", root: "C4", semitones: [2, 4, 7, 11] },
              {
                type: "trueFalse",
                items: [
                  { statement: "Dissonância é sempre um erro.", answer: false, explain: "Ela cria movimento e tensão na música. Mas uma dissonância fora do lugar indica que alguém saiu da própria nota." },
                  { statement: "A quinta justa é uma consonância.", answer: true, explain: "Soa aberta e estável." },
                  { statement: "Acorde menor é sempre triste.", answer: false, explain: "O caráter depende do contexto. Use a terça como referência, não a emoção." },
                ],
              },
            ],
          },
          {
            titulo: "Alguém saiu da nota?",
            tipo: "aplicar",
            blocos: [
              {
                type: "compare",
                prompt: "Três vozes cantam Dó maior. Em qual versão alguém saiu da própria nota?",
                options: [
                  { label: "Todos certos: Dó–Mi–Sol", notes: [["C4", "E4", "G4"]] },
                  { label: "Alguém cantou Fá♯ em vez de Sol", notes: [["C4", "E4", "F#4"]] },
                ],
                answer: 1,
                explain: "O Fá♯ cria uma tensão que não estava no acorde. É esse “atrito” que você aprende a notar no ensaio.",
              },
              { type: "harmonyLink", arrangement: "triades-tres-vozes", label: "Cante tríades a três vozes no treinador de harmonia" },
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
                  { left: "Acorde maior", right: "Terça de 4 semitons" },
                  { left: "Acorde menor", right: "Terça de 3 semitons" },
                  { left: "Consonância", right: "Som estável" },
                  { left: "Dissonância", right: "Som tenso, pede resolução" },
                ],
              },
            ],
          },
        ],
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
