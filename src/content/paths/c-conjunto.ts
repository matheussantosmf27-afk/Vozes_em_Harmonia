import type { PathDef } from "../types";
import { SEGURANCA_BASE } from "../common";

export const trilhaC: PathDef = {
  slug: "canto-em-conjunto",
  code: "C",
  title: "Canto em conjunto",
  subtitle: "Do uníssono à escuta ativa",
  description:
    "Antes de dividir vozes, o grupo aprende a soar como um só: mesma altura, mesmo ritmo, entradas e cortes juntos, equilíbrio e escuta. A trilha termina com o desafio de manter a própria linha enquanto outras melodias soam.",
  icon: "users",
  lessons: [
    {
      slug: "unissono",
      title: "Uníssono",
      summary: "Cantar a mesma melodia como uma só voz.",
      level: 1,
      minutes: 20,
      skills: ["canto-unissono"],
      content: {
        objetivo: "Cantar a mesma melodia com unidade de altura, ritmo, respiração, dicção e finalização.",
        gancho: "Vinte pessoas, vinte timbres, uma melodia. Será que dá para soar como uma voz só? Dá, e o segredo está mais nos ouvidos do que na garganta.",
        etapas: [
          {
            titulo: "Muitas vozes, um só som",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "unissono", caption: "Todos na mesma melodia, como uma voz só." },
              {
                type: "p",
                text: "Uníssono é quando todos cantam a mesma melodia. Parece fácil, mas cada pessoa tem um timbre, um volume e um jeito de pronunciar.",
              },
              {
                type: "callout",
                icon: "ideia",
                title: "Pense num remo",
                text: "Num barco a remo, ninguém ganha remando mais forte que os outros. O barco anda quando todos remam juntos, no mesmo ritmo.",
              },
              {
                type: "check",
                question: "Qual é o objetivo do uníssono num grupo?",
                options: ["Soar como uma única voz bem afinada", "Cada um mostrar o seu timbre", "Quem tem a voz mais forte puxar o grupo"],
                answer: 0,
                explain: "No uníssono, o resultado é uma voz só. Quem se destaca quebra a unidade.",
              },
            ],
          },
          {
            titulo: "Desafio: uma voz ou duas?",
            tipo: "ouvir",
            blocos: [
              {
                type: "compare",
                prompt: "Duas pessoas tentam cantar a mesma nota. Em qual opção elas estão em uníssono?",
                options: [
                  { label: "uníssono: as duas na mesma nota", notes: [["A3", "A3"]], mode: "chord", tempo: 40 },
                  { label: "uma delas meio tom acima", notes: [["A3", "A#3"]], mode: "chord", tempo: 40 },
                ],
                answer: 0,
                explain: "No uníssono as vozes se fundem num som liso. Quando uma escapa, aparece um “tremor” áspero: são as ondas batendo uma na outra.",
              },
              { type: "illustration", name: "onda-desafinada", caption: "Ondas desencontradas: o som “treme”." },
              {
                type: "compare",
                prompt: "O grupo está cantando A3. Qual destas entradas combina com o grupo?",
                options: [
                  { label: "afinada", notes: ["A3"] },
                  { label: "um pouco abaixo", notes: ["A3"], cents: -35 },
                ],
                answer: 0,
                explain: "A diferença é pequena, mas o ouvido percebe. Quem ouve o grupo se ajusta ao som dele, não o contrário.",
              },
            ],
          },
          {
            titulo: "Homens e mulheres juntos",
            tipo: "ouvir",
            blocos: [
              {
                type: "p",
                text: "Quando homens e mulheres cantam “em uníssono”, na verdade cantam em oitavas: a mesma melodia, os homens uma oitava abaixo. Para o grupo, isso também é uníssono.",
              },
              { type: "audio", label: "Mesma melodia em oitavas (vozes femininas e masculinas)", notes: [["E4", "E3"], ["E4", "E3"], ["F4", "F3"], ["G4", "G3"]], tempo: 90 },
              {
                type: "check",
                question: "Os homens cantam a melodia uma oitava abaixo das mulheres. O grupo está…",
                options: ["Em uníssono (em oitavas)", "Em duas vozes diferentes", "Desafinado", "Cantando em terças"],
                answer: 0,
                explain: "É a mesma melodia, só que na região de cada voz. O ouvido reconhece como “a mesma música”.",
              },
            ],
          },
          {
            titulo: "As cinco combinações do grupo",
            tipo: "descobrir",
            blocos: [
              {
                type: "match",
                prompt: "Ligue cada combinação ao que o grupo faz.",
                pairs: [
                  { left: "Mesma altura", right: "Ouvir o vizinho e se ajustar ao grupo" },
                  { left: "Mesmo ritmo", right: "Sílabas juntas, seguindo o regente" },
                  { left: "Mesma respiração", right: "Todos respiram no lugar combinado" },
                  { left: "Mesma vogal", right: "Mesmo formato de boca nas notas longas" },
                  { left: "Mesmo corte", right: "A nota termina no gesto do regente" },
                ],
              },
              {
                type: "tip",
                title: "Volume a serviço do grupo",
                text: "Só ouve a sua voz? Está forte demais. Não ouve nada da sua voz? Talvez esteja fraco demais. O ponto certo é ouvir a si e aos vizinhos.",
              },
            ],
          },
          {
            titulo: "Sua vez: cante junto",
            tipo: "experimentar",
            blocos: [
              { type: "singAlong", instruction: "Imagine que a nota é o som do grupo. Cante “lu” junto, suave, até sentir que as duas viram uma só.", note: "C4", seconds: 4 },
              { type: "harmonyLink", arrangement: "hino-alegria-unissono", label: "Praticar o “Hino da Alegria” em uníssono no treinador" },
              {
                type: "checklist",
                title: "No treinador",
                items: [
                  "Ouvi a melodia no modo solo",
                  "Cantei junto em “lu”, depois com o texto",
                  "Marquei a respiração no fim de cada linha",
                  "A última nota durou até o fim do tempo 4",
                ],
              },
            ],
          },
          {
            titulo: "No ensaio de domingo",
            tipo: "aplicar",
            blocos: [
              { type: "illustration", name: "regente", caption: "O corte acontece no gesto do regente." },
              {
                type: "check",
                question: "No último verso do hino, metade do grupo solta a nota e a outra metade continua. O que resolve?",
                options: ["Todos olharem o regente e cortarem no gesto dele", "Cada um cortar quando o ar acabar", "Seguir quem canta mais alto", "Encurtar a nota para garantir"],
                answer: 0,
                explain: "A finalização é combinada: o fim da nota e a consoante final acontecem juntos, no gesto do regente.",
              },
              {
                type: "trueFalse",
                items: [
                  { statement: "Cantar mais forte que o grupo “ajuda” o uníssono.", answer: false, explain: "No uníssono, quem se destaca quebra a unidade. Ajude ouvindo e se ajustando." },
                  { statement: "Nas notas longas, o grupo combina a vogal e o formato da boca.", answer: true, explain: "Vogais diferentes deixam o som “espalhado”, mesmo com todos afinados." },
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
                prompt: "Ligue cada problema à sua correção.",
                pairs: [
                  { left: "Cantar mais forte para ajudar", right: "Ouvir os vizinhos e se ajustar" },
                  { left: "Cada um termina num momento", right: "Cortar no gesto do regente" },
                  { left: "Vogais diferentes na nota longa", right: "Combinar vogal e formato da boca" },
                  { left: "Respirar cada um num lugar", right: "Marcar a respiração na letra" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: { passos: ["Treinador de harmonia: uníssono, 3 repetições.", "Grave-se cantando junto com a referência e confira se as sílabas começam juntas."], minutos: 8, frequencia: "3 vezes por semana" },
        errosComuns: [
          { erro: "Cantar mais forte que o grupo para “ajudar”.", correcao: "No uníssono, quem se destaca quebra a unidade. Ajude ouvindo e se ajustando." },
          { erro: "Cada um terminar a nota num momento.", correcao: "O corte é um gesto do regente; olhe para ele nas finalizações." },
          { erro: "Vogais diferentes nas notas longas.", correcao: "Combinem a vogal e o formato da boca." },
        ],
        seguranca: [...SEGURANCA_BASE],
        criterioAvanco: "Acertar pelo menos 70% da avaliação e cantar o uníssono no treinador do início ao fim.",
      },
      exercises: [
        { slug: "unissono-pratica-treinador", title: "Prática no treinador de harmonia", instructions: "Cante o Hino da Alegria em uníssono e avalie.", type: "harmony_part", config: { voices: 1, arrangementSlug: "hino-alegria-unissono" }, skill: "canto-unissono", purpose: "pratica" },
        {
          slug: "unissono-avaliacao",
          title: "Avaliação: princípios do uníssono",
          instructions: "Responda sobre canto em uníssono.",
          type: "quiz",
          config: {
            questions: [
              { q: "Homens e mulheres cantando a mesma melodia, os homens uma oitava abaixo, estão…", options: ["Em uníssono (oitavas)", "Em duas vozes diferentes", "Desafinados", "Em terças"], answer: 0 },
              { q: "Se você só ouve a sua própria voz no grupo, provavelmente…", options: ["Está cantando forte demais", "Está cantando perfeitamente", "Precisa cantar mais forte", "Está fora do ritmo"], answer: 0 },
              { q: "Quem define o momento da finalização?", options: ["O regente, com o gesto de corte", "Quem canta mais alto", "Cada pessoa", "O instrumentista"], answer: 0 },
              { q: "Para unificar o som nas notas longas, o naipe deve combinar…", options: ["A vogal e o formato da boca", "O volume máximo", "A posição dos pés", "A cor da roupa"], answer: 0 },
              {
                q: "Ouça: as duas notas formam uníssono (a mesma nota) ou não?",
                options: ["Uníssono", "Notas diferentes"],
                answer: 0,
                audio: { notes: [["G4", "G4"]], mode: "chord", tempo: 40 },
              },
            ],
          },
          skill: "canto-unissono",
          purpose: "avaliacao",
        },
      ],
    },
    {
      slug: "entradas-e-finalizacoes",
      title: "Entradas e finalizações",
      summary: "Começar e terminar juntos, no tempo certo.",
      level: 1,
      minutes: 15,
      skills: ["ritmo-pulsacao", "canto-unissono"],
      content: {
        objetivo: "Entrar no tempo exato após pausas e contagens e finalizar as notas juntos, respeitando a duração escrita.",
        gancho: "O teclado faz a introdução, o regente levanta a mão… e metade do coral entra atrasada. Vamos garantir que, com você, isso não aconteça.",
        etapas: [
          {
            titulo: "O momento mais exposto",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "regente", caption: "Respiração e entrada no gesto do regente." },
              {
                type: "p",
                text: "Na entrada, todo mundo percebe quem chegou cedo ou tarde. Uma entrada segura nasce de três coisas: contar a pausa, respirar no tempo anterior e já “ouvir por dentro” a primeira nota.",
              },
              {
                type: "check",
                question: "Qual destas NÃO faz parte de uma entrada segura?",
                options: ["Esperar o vizinho começar para ir junto", "Contar os tempos da pausa", "Respirar no tempo anterior à entrada", "Ter a primeira nota pronta na mente"],
                answer: 0,
                explain: "Quem espera o vizinho entra sempre um pouco atrasado. A referência é a contagem e o regente.",
              },
            ],
          },
          {
            titulo: "A pausa também é música",
            tipo: "ouvir",
            blocos: [
              {
                type: "callout",
                icon: "ouvido",
                title: "Silêncio contado",
                text: "Durante a pausa, a música continua. Conte mentalmente “1, 2, 3, 4” no andamento, como se estivesse cantando.",
              },
              { type: "rhythm", pattern: "rq q q q", bpm: 80, label: "Entrada após pausa de um tempo" },
              { type: "rhythm", pattern: "rh q q", bpm: 80, label: "Entrada após pausa de dois tempos" },
              {
                type: "reveal",
                prompt: "No segundo padrão, em que tempo acontece a entrada?",
                answer: "No tempo 3. A pausa de dois tempos ocupa o 1 e o 2. A respiração acontece no tempo 2.",
              },
            ],
          },
          {
            titulo: "Sua vez: palma e entrada",
            tipo: "experimentar",
            blocos: [
              { type: "toolLink", tool: "metronomo", label: "Abra o metrônomo a 80 bpm" },
              { type: "timer", instruction: "Conte em voz alta “1, 2, 3, 4” e bata palma apenas no tempo 2.", seconds: 30 },
              { type: "timer", instruction: "Inspire no tempo 1 e cante “lá” no tempo 2, sustentando até o fim do tempo 4. Depois, tente entrando no tempo 3.", seconds: 30, reps: 2 },
            ],
          },
          {
            titulo: "Até onde vai a última nota?",
            tipo: "descobrir",
            blocos: [
              { type: "rhythm", pattern: "q q h", bpm: 80, label: "Finalização em mínima (dura até o fim do compasso)" },
              { type: "illustration", name: "compasso", caption: "Em 4/4, cada compasso tem quatro tempos." },
              {
                type: "check",
                question: "Em 4/4, uma mínima que começa no tempo 3 termina…",
                options: ["No início do próximo compasso", "No tempo 4", "No tempo 3 e meio", "Quando faltar ar"],
                answer: 0,
                explain: "A mínima vale dois tempos: o 3 e o 4 inteiros. Encurtar a última nota é tão perceptível quanto atrasar a entrada.",
              },
            ],
          },
          {
            titulo: "Ouça por dentro antes de cantar",
            tipo: "experimentar",
            blocos: [
              {
                type: "p",
                text: "A primeira nota precisa estar pronta na mente. No ensaio, peça a nota ao instrumentista ou use a nota de referência.",
              },
              { type: "singAlong", instruction: "Ouça a nota. Conte “1, 2, 3” em silêncio, respire no 4 e entre no próximo 1 com “lá”.", note: "C4", seconds: 4 },
            ],
          },
          {
            titulo: "No culto",
            tipo: "aplicar",
            blocos: [
              {
                type: "check",
                question: "O teclado toca quatro compassos de introdução antes de o coral entrar. O que você faz?",
                options: ["Conto os compassos e respiro no tempo anterior à entrada", "Respiro fundo no começo da introdução e seguro o ar", "Espero ouvir os outros para entrar", "Entro quando o teclado parar"],
                answer: 0,
                explain: "Contando, você sabe exatamente quando entrar. A respiração faz parte do ritmo: no tempo anterior, no andamento da música.",
              },
              {
                type: "trueFalse",
                items: [
                  { statement: "Respirar bem cedo e prender o ar até a entrada deixa a entrada mais segura.", answer: false, explain: "Prender o ar gera tensão. Inspire no tempo anterior, no andamento." },
                  { statement: "A finalização é tão importante quanto a entrada.", answer: true, explain: "Conte até o fim da última nota e corte junto com o grupo." },
                ],
              },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "order",
                prompt: "Coloque em ordem: do silêncio até o fim da frase.",
                items: [
                  "Ouvir a primeira nota por dentro",
                  "Contar os tempos da pausa",
                  "Respirar no tempo anterior",
                  "Entrar junto, no tempo",
                  "Sustentar a última nota e cortar no gesto",
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: { passos: ["Exercício de entradas (5 minutos).", "Em um hino conhecido, conte as pausas entre as frases em voz baixa."], minutos: 6, frequencia: "3 vezes por semana" },
        errosComuns: [
          { erro: "Respirar cedo demais e prender o ar até a entrada.", correcao: "A respiração faz parte do ritmo: inspire no tempo anterior." },
          { erro: "Encurtar a última nota.", correcao: "Conte até o fim; a finalização é tão importante quanto a entrada." },
        ],
        seguranca: [...SEGURANCA_BASE.slice(0, 2)],
        criterioAvanco: "Acertar pelo menos 70% na avaliação de entradas após pausas.",
      },
      exercises: [
        {
          slug: "entradas-avaliacao",
          title: "Avaliação: entradas após pausas",
          instructions: "Ouça a contagem; toque somente onde há nota (as pausas ficam em silêncio).",
          type: "rhythm_tap",
          config: { rounds: 5, patterns: ["rq q q q", "rh q q", "rq q h", "q rq q q", "rh h"], bpm: 80, toleranceMs: 140 },
          skill: "ritmo-pulsacao",
          purpose: "avaliacao",
        },
        {
          slug: "finalizacoes-avaliacao",
          title: "Avaliação: duração das finalizações",
          instructions: "Responda sobre entradas e finalizações.",
          type: "quiz",
          config: {
            questions: [
              { q: "Em 4/4, uma mínima que começa no tempo 3 termina…", options: ["No início do próximo compasso", "No tempo 4", "No tempo 3 e meio", "Quando faltar ar"], answer: 0 },
              { q: "Quando respirar para uma entrada no tempo 2?", options: ["No tempo 1, no andamento da música", "Dois compassos antes", "Durante o tempo 2", "Não é preciso respirar"], answer: 0 },
              { q: "O que fazer durante uma pausa longa?", options: ["Contar os tempos mentalmente", "Conversar com o vizinho", "Esperar o vizinho começar", "Cantar baixinho"], answer: 0 },
            ],
          },
          skill: "canto-unissono",
          purpose: "avaliacao",
        },
      ],
    },
    {
      slug: "equilibrio-sonoro",
      title: "Equilíbrio sonoro",
      summary: "Nenhuma voz sobrando, nenhuma faltando.",
      level: 2,
      minutes: 15,
      skills: ["escuta-ativa"],
      content: {
        objetivo: "Compreender o equilíbrio entre naipes e entre vozes do mesmo naipe, e ajustar a própria intensidade ao conjunto.",
        gancho: "Já reparou quando uma única voz “fura” o coral inteiro? Equilíbrio é a arte de ninguém sobrar e ninguém faltar. Vamos treinar o ouvido para isso.",
        etapas: [
          {
            titulo: "Uma balança de vozes",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "equilibrio", caption: "Equilíbrio: a proporção de volume entre as vozes." },
              {
                type: "p",
                text: "A melodia precisa ser ouvida com clareza. O baixo sustenta a harmonia. As vozes do meio preenchem o acorde sem encobrir a melodia. E, dentro de um naipe, nenhuma voz individual se destaca.",
              },
              {
                type: "check",
                question: "Num hino a quatro vozes, o que precisa ficar mais claro para quem ouve?",
                options: ["A melodia", "A voz de quem canta mais forte", "As vozes do meio", "Nenhuma voz em especial"],
                answer: 0,
                explain: "A congregação reconhece o hino pela melodia. As outras vozes a enriquecem, sem cobri-la.",
              },
            ],
          },
          {
            titulo: "Desafio: onde está a melodia?",
            tipo: "ouvir",
            blocos: [
              { type: "audio", label: "Acorde equilibrado (todas as vozes com o mesmo volume)", notes: [["C3", "G3", "C4", "E4"]], mode: "chord", tempo: 30 },
              {
                type: "compare",
                prompt: "Num destes acordes, a voz mais aguda (a melodia) foi encoberta e sumiu. Qual?",
                options: [
                  { label: "completo: melodia por cima", notes: [["C3", "G3", "C4", "E4"]], mode: "chord", tempo: 30 },
                  { label: "sem a melodia", notes: [["C3", "G3", "C4"]], mode: "chord", tempo: 30 },
                ],
                answer: 1,
                explain: "Sem a nota de cima, o acorde fica “oco” e a música perde o rumo. É o que acontece quando os outros naipes cobrem o soprano.",
              },
            ],
          },
          {
            titulo: "A pirâmide sonora",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "naipes-satb", caption: "Baixo na base, vozes agudas mais leves." },
              {
                type: "callout",
                icon: "olho",
                title: "Imagine uma pirâmide",
                text: "Base larga embaixo, ponta leve em cima. Na dúvida, o baixo fica mais presente e as vozes agudas mais leves.",
              },
              {
                type: "trueFalse",
                items: [
                  { statement: "Notas agudas tendem a soar mais fortes.", answer: true, explain: "Sopranos e tenores precisam cuidar do volume nos agudos." },
                  { statement: "Um naipe com muitas pessoas deve cantar mais forte.", answer: false, explain: "É o contrário: naipe numeroso canta mais suave; naipe pequeno pode precisar de mais presença." },
                  { statement: "Com microfones, o equilíbrio é combinado com quem opera o som.", answer: true, explain: "Em grupos amplificados, o volume que chega ao público depende também da mesa de som." },
                ],
              },
            ],
          },
          {
            titulo: "Mexa nos volumes",
            tipo: "experimentar",
            blocos: [
              { type: "harmonyLink", arrangement: "hino-alegria-satb", label: "No treinador, ajuste o volume de cada naipe e ouça o efeito no equilíbrio" },
              {
                type: "checklist",
                title: "No modo conjunto",
                items: [
                  "Baixei o soprano e ouvi a melodia “sumir”",
                  "Voltei o soprano ao normal",
                  "Aumentei só o contralto e ouvi o desequilíbrio",
                  "Achei uma mistura com melodia clara e acorde cheio",
                ],
              },
            ],
          },
          {
            titulo: "Teste da vizinhança",
            tipo: "experimentar",
            blocos: [
              {
                type: "callout",
                icon: "ouvido",
                title: "A regra de ouro",
                text: "Você deve ouvir as pessoas ao seu lado. Se não ouve, reduza seu volume até ouvi-las.",
              },
              { type: "timer", instruction: "Toque o Hino da Alegria no treinador e cante junto. Ajuste o seu volume até ouvir a gravação e a sua voz ao mesmo tempo, sem esforço.", seconds: 40 },
              {
                type: "reveal",
                prompt: "No ensaio, você só ouve a própria voz. O que isso indica?",
                answer: "Que você está acima do grupo. Ajudar é ser ouvido junto, não por cima: reduza até ouvir os vizinhos.",
              },
            ],
          },
          {
            titulo: "No louvor com microfones",
            tipo: "aplicar",
            blocos: [
              {
                type: "check",
                question: "No ensaio do grupo de louvor, o técnico avisa que as contraltos estão cobrindo a melodia. O que fazer?",
                options: [
                  "Reduzir o volume do naipe e combinar o ajuste com o técnico de som",
                  "Pedir ao soprano para cantar mais forte",
                  "Afastar todos os microfones",
                  "Manter como está, pois o técnico corrige depois",
                ],
                answer: 0,
                explain: "O equilíbrio nasce nas vozes e é finalizado na mesa de som. Forçar o soprano só cansa a voz e desequilibra de novo.",
              },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "match",
                prompt: "Ligue cada situação ao ajuste certo.",
                pairs: [
                  { left: "Naipe com muita gente", right: "Cantar mais suave" },
                  { left: "Trecho agudo do soprano", right: "Aliviar o volume" },
                  { left: "Não ouço o vizinho", right: "Reduzir minha voz" },
                  { left: "Grupo amplificado", right: "Combinar com o técnico de som" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: { passos: ["Repita o experimento de volumes com outro arranjo.", "No próximo ensaio, aplique o teste da vizinhança."], minutos: 5, frequencia: "1 vez por semana" },
        errosComuns: [
          { erro: "Achar que cantar mais forte é ajudar o naipe.", correcao: "Ajudar é ser ouvido junto, não por cima." },
          { erro: "Ignorar o equilíbrio nos agudos.", correcao: "Notas agudas projetam mais: alivie o volume." },
        ],
        seguranca: [...SEGURANCA_BASE.slice(0, 3)],
        criterioAvanco: "Acertar pelo menos 70% da avaliação.",
      },
      exercises: [
        {
          slug: "equilibrio-avaliacao",
          title: "Avaliação: equilíbrio sonoro",
          instructions: "Responda sobre equilíbrio entre vozes.",
          type: "quiz",
          config: {
            questions: [
              { q: "Qual voz geralmente precisa ser ouvida com clareza?", options: ["A melodia", "A voz mais grave sempre", "A voz de quem canta mais alto", "Nenhuma"], answer: 0 },
              { q: "Notas agudas tendem a…", options: ["Soar mais fortes e precisar de cuidado com o volume", "Soar mais fracas", "Não interferir no equilíbrio", "Ser sempre desafinadas"], answer: 0 },
              { q: "Um naipe com muitas pessoas deve…", options: ["Cantar mais suave para não encobrir os outros", "Cantar mais forte", "Cantar sempre a melodia", "Diminuir apenas no final"], answer: 0 },
              { q: "No teste da vizinhança, se você não ouve quem está ao lado…", options: ["Reduza seu volume", "Aumente seu volume", "Troque de lugar", "Pare de cantar"], answer: 0 },
            ],
          },
          skill: "escuta-ativa",
          purpose: "avaliacao",
        },
      ],
    },
    {
      slug: "escuta-ativa",
      title: "Escuta ativa",
      summary: "Ouvir o conjunto enquanto canta: entradas, vozes e frases.",
      level: 2,
      minutes: 20,
      skills: ["escuta-ativa", "memoria-melodica"],
      content: {
        objetivo: "Perceber quantas vozes estão soando, qual voz entrou, e comparar frases melódicas — habilidades de quem canta ouvindo o grupo.",
        gancho: "Cantar é metade boca, metade ouvido. Hoje você vai treinar a metade que quase ninguém treina: ouvir o grupo enquanto canta.",
        etapas: [
          {
            titulo: "Ouvidos abertos",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "escuta-ativa", caption: "Cantar e ouvir o conjunto ao mesmo tempo." },
              {
                type: "p",
                text: "Escuta ativa é cantar com os ouvidos abertos para o conjunto. Quem ouve o grupo se ajusta em tempo real.",
              },
              {
                type: "check",
                question: "Quem só ouve a própria voz tem dificuldade de perceber…",
                options: ["Quando o grupo desafina, acelera ou outra voz entra", "A letra do hino", "A própria respiração", "A cor da partitura"],
                answer: 0,
                explain: "Sem ouvir o conjunto, não há como se ajustar. A escuta é o que mantém o grupo unido.",
              },
            ],
          },
          {
            titulo: "Quantas vozes entraram?",
            tipo: "ouvir",
            blocos: [
              {
                type: "callout",
                icon: "ouvido",
                title: "Entradas em camadas",
                text: "Em muitos arranjos, as vozes entram uma de cada vez e continuam soando. Perceber cada entrada ajuda você a saber onde o grupo está.",
              },
              {
                type: "check",
                question: "Ouça: as vozes entram uma de cada vez. Quantas estão soando no final?",
                options: ["Uma", "Duas", "Três", "Quatro"],
                answer: 2,
                explain: "Primeiro uma voz, depois a segunda, depois a terceira. No final, três notas soam juntas.",
                audio: { notes: ["C4", ["C4", "E4"], ["C4", "E4", "G4"]], tempo: 50 },
              },
            ],
          },
          {
            titulo: "A frase voltou igual?",
            tipo: "ouvir",
            blocos: [
              {
                type: "compare",
                prompt: "Ouça as duas frases com atenção. Elas são iguais?",
                options: [
                  { label: "Frase 1", notes: ["C4", "D4", "E4", "C4"], tempo: 90 },
                  { label: "Frase 2", notes: ["C4", "D4", "F4", "C4"], tempo: 90 },
                ],
                explain: "Quase iguais: só uma nota mudou. Num hino, o refrão às vezes volta com um detalhe diferente, e quem ouve percebe.",
              },
              {
                type: "check",
                question: "Qual nota da frase 2 ficou diferente?",
                options: ["A 1ª", "A 2ª", "A 3ª", "A 4ª"],
                answer: 2,
                explain: "A 3ª nota subiu um pouco (de E4 para F4). O resto é igual.",
              },
            ],
          },
          {
            titulo: "Onde está a sua voz?",
            tipo: "descobrir",
            blocos: [
              { type: "audio", label: "Acorde de quatro vozes, de baixo para cima", notes: ["C3", "G3", "C4", "E4", ["C3", "G3", "C4", "E4"]], tempo: 70 },
              {
                type: "p",
                text: "Saber sua posição no acorde ajuda a se orientar: você está acima do baixo? Abaixo da melodia?",
              },
              {
                type: "check",
                question: "No SATB, onde fica o contralto?",
                options: ["Abaixo do soprano e acima do tenor", "Acima do soprano", "Abaixo do baixo", "Sempre na mesma nota do tenor"],
                answer: 0,
                explain: "De cima para baixo: soprano, contralto, tenor e baixo. O contralto é uma voz interna.",
              },
            ],
          },
          {
            titulo: "Siga uma voz no cânone",
            tipo: "experimentar",
            blocos: [
              { type: "harmonyLink", arrangement: "canone-solfejo", label: "Ouça o cânone: as vozes entram uma de cada vez" },
              {
                type: "checklist",
                title: "No modo conjunto",
                items: [
                  "Contei quantas vozes entram",
                  "Ouvi de novo seguindo só a 2ª voz até o fim",
                  "Percebi quando cada voz entra",
                ],
              },
              { type: "tip", text: "Use volume moderado nos fones de ouvido." },
            ],
          },
          {
            titulo: "No ensaio",
            tipo: "aplicar",
            blocos: [
              {
                type: "check",
                question: "No meio do hino, você percebe que o grupo está acelerando. O que fazer?",
                options: ["Olhar o regente e manter o andamento dele", "Acelerar junto com quem está mais rápido", "Parar de cantar", "Cantar mais forte para segurar o grupo"],
                answer: 0,
                explain: "Siga o regente, não a pessoa mais rápida. Ouvir o grupo é o que permite perceber a mudança a tempo.",
              },
              {
                type: "reveal",
                prompt: "Desafio para o próximo culto: escolha uma voz interna (contralto ou tenor) e tente segui-la do início ao fim. Qual a dificuldade?",
                answer: "O ouvido vai “escorregar” para a melodia, que chama mais atenção. Tudo bem: volte para a voz escolhida. Isso é escuta ativa em treino.",
              },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "match",
                prompt: "Ligue cada habilidade à pergunta que ela responde.",
                pairs: [
                  { left: "Perceber entradas", right: "Quantas vozes estão soando?" },
                  { left: "Comparar frases", right: "O refrão voltou igual?" },
                  { left: "Saber sua posição", right: "Estou acima ou abaixo de quem?" },
                  { left: "Seguir uma voz interna", right: "O que o contralto está cantando?" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: { passos: ["Laboratório: entradas vocais e frases (5 minutos).", "Ouça uma gravação coral e tente seguir uma voz interna."], minutos: 7, frequencia: "3 vezes por semana" },
        errosComuns: [{ erro: "Prestar atenção só na melodia.", correcao: "Escolha uma voz interna e siga-a do início ao fim." }],
        seguranca: ["Use volume moderado nos fones de ouvido."],
        criterioAvanco: "Acertar pelo menos 70% nas avaliações de entradas e frases.",
      },
      exercises: [
        { slug: "escuta-entradas-avaliacao", title: "Avaliação: quantas vozes entraram?", instructions: "As vozes entram uma de cada vez e continuam soando.", type: "entry_detect", config: { rounds: 6, maxVoices: 3, ask: "quantidade" }, skill: "escuta-ativa", purpose: "avaliacao" },
        { slug: "escuta-frases-avaliacao", title: "Avaliação: frases iguais ou diferentes", instructions: "Compare as duas frases melódicas.", type: "phrase_compare", config: { rounds: 6, length: 4 }, skill: "memoria-melodica", purpose: "avaliacao" },
      ],
    },
    {
      slug: "manter-a-propria-linha",
      title: "Manutenção da própria linha vocal",
      summary: "Sustentar a sua nota enquanto outras vozes cantam melodias diferentes.",
      level: 2,
      minutes: 25,
      skills: ["independencia-vocal"],
      content: {
        objetivo: "Sustentar uma nota ou uma linha própria enquanto outra melodia soa, sem ser “arrastado” por ela.",
        gancho: "Você ensaiou sua voz sozinho(a) e estava perfeita. Aí o soprano entra com a melodia… e de repente você está cantando a melodia também. Vamos resolver isso, passo a passo.",
        etapas: [
          {
            titulo: "O ímã da melodia",
            tipo: "descobrir",
            blocos: [
              {
                type: "p",
                text: "Quando outra voz faz uma melodia diferente, a tendência é seguir a mais forte, normalmente a principal, e abandonar a própria linha. Isso é normal e se treina com passos pequenos.",
              },
              {
                type: "callout",
                icon: "ideia",
                title: "Como um ímã",
                text: "A melodia principal atrai o ouvido como um ímã. Quanto mais perto da sua nota ela passa, mais forte é a atração.",
              },
              {
                type: "check",
                question: "Quando é mais fácil ser “arrastado(a)” pela outra voz?",
                options: ["Quando a melodia se aproxima da sua nota", "Quando a melodia está bem longe da sua nota", "Quando você está cantando sozinho(a)"],
                answer: 0,
                explain: "Perto da sua nota, a outra voz “puxa” mais. Pense na sua nota com antecedência e mantenha-a firme.",
              },
            ],
          },
          {
            titulo: "Ouça: pedal e melodia",
            tipo: "ouvir",
            blocos: [
              { type: "illustration", name: "movimentos-vozes", caption: "Uma voz parada, outra em movimento." },
              { type: "audio", label: "Nota pedal (C3) parada enquanto a melodia sobe", notes: [["C3", "C4"], ["C3", "D4"], ["C3", "E4"], ["C3", "F4"], ["C3", "G4"]], tempo: 70 },
              {
                type: "compare",
                prompt: "Agora ouça a voz de baixo das terças paralelas, sozinha e com a voz de cima. Ela continua a mesma?",
                options: [
                  { label: "Voz 2 sozinha", notes: ["C4", "D4", "E4", "F4"], tempo: 80 },
                  { label: "Voz 2 com a voz 1", notes: [["C4", "E4"], ["D4", "F4"], ["E4", "G4"], ["F4", "A4"]], tempo: 80 },
                ],
                explain: "A voz 2 é exatamente a mesma nas duas opções. O que muda é a voz de cima, que tenta “puxar” o seu ouvido. Seu trabalho é não largar a sua linha.",
              },
            ],
          },
          {
            titulo: "Quatro degraus",
            tipo: "descobrir",
            blocos: [
              {
                type: "order",
                prompt: "Coloque os degraus do treino na ordem, do mais fácil ao mais difícil.",
                items: [
                  "Sustentar uma única nota enquanto outra melodia se move",
                  "Cantar uma linha curta com notas repetidas contra uma melodia",
                  "Cantar a linha completa com a melodia baixinha (modo guiado)",
                  "Cantar com todas as vozes no mesmo volume (modo conjunto)",
                ],
              },
              {
                type: "tip",
                title: "Âncoras",
                text: "Marque na sua parte as notas “âncora”: notas longas ou repetidas que você conhece bem. Quando se perder, volte para a próxima âncora.",
              },
            ],
          },
          {
            titulo: "Sua vez: segure a nota",
            tipo: "experimentar",
            blocos: [
              {
                type: "warning",
                text: "Para usar o microfone aqui, use fones de ouvido: assim ele capta só a sua voz, não a referência.",
              },
              { type: "singAlong", instruction: "Ouça a nota e sustente “u” firme, em volume moderado e sem esforço. Imagine uma melodia passando por cima.", note: "C4", seconds: 5 },
              { type: "timer", instruction: "Peça a alguém (ou ao celular) para tocar um hino enquanto você sustenta a sua nota em “u”. Respire quando precisar e volte à mesma nota.", seconds: 30, reps: 2 },
            ],
          },
          {
            titulo: "No treinador",
            tipo: "experimentar",
            blocos: [
              { type: "harmonyLink", arrangement: "pedal-e-melodia", label: "Exercício “Nota pedal e melodia”: sustente a nota enquanto a melodia se move" },
              {
                type: "checklist",
                title: "Passo a passo",
                items: [
                  "Escolhi a voz do pedal e o modo guiado",
                  "Cantei com a melodia baixinha",
                  "Aumentei a melodia aos poucos",
                  "Fiz o exercício de sustentação com distração (com fones)",
                ],
              },
              { type: "toolLink", tool: "afinador", label: "Treinador de afinação (use fones)" },
            ],
          },
          {
            titulo: "Um passo além: terças",
            tipo: "aplicar",
            blocos: [
              { type: "harmonyLink", arrangement: "tercas-paralelas", label: "Agora cante a voz de baixo em “Terças paralelas”" },
              {
                type: "check",
                question: "No ensaio, o soprano entra forte e passa perto da sua nota. O que fazer?",
                options: [
                  "Pensar na sua nota antes e mantê-la firme, em volume moderado",
                  "Cantar mais forte para não ouvir o soprano",
                  "Ir junto com o soprano até achar a nota",
                  "Parar e esperar a próxima frase",
                ],
                answer: 0,
                explain: "Forçar o volume cansa a voz e desequilibra o grupo. Antecipe a nota na mente e, se se perder, volte à próxima âncora.",
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
                  { statement: "Tampar um ouvido pode ajudar no começo, mas o objetivo é cantar ouvindo o conjunto.", answer: true, explain: "É uma muleta útil no início. Aos poucos, cante com os dois ouvidos abertos." },
                  { statement: "Quem se perdeu deve parar até o fim do hino.", answer: false, explain: "Volte para a próxima nota âncora e continue com o grupo." },
                  { statement: "Para não ser arrastado(a), o melhor é cantar mais forte que a melodia.", answer: false, explain: "Firmeza vem da atenção à sua nota, não do volume. Cante em volume moderado." },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: { passos: ["3 repetições do pedal com a melodia em volume normal.", "Exercício de sustentação com distração (3 notas)."], minutos: 10, frequencia: "4 vezes por semana" },
        errosComuns: [
          { erro: "Seguir a melodia quando ela se aproxima da sua nota.", correcao: "Pense na sua nota com antecedência e mantenha-a firme, em volume moderado." },
          { erro: "Tampar um ouvido para não ouvir a outra voz.", correcao: "É útil no início, mas o objetivo é cantar ouvindo o conjunto." },
        ],
        seguranca: [...SEGURANCA_BASE],
        criterioAvanco: "Média de pelo menos 70% na sustentação da própria nota com outra melodia soando.",
      },
      exercises: [
        { slug: "linha-propria-pedal", title: "Prática: pedal no treinador", instructions: "Cante a voz do pedal no exercício “Nota pedal e melodia”.", type: "harmony_part", config: { voices: 2, arrangementSlug: "pedal-e-melodia" }, skill: "independencia-vocal", purpose: "pratica" },
        {
          slug: "linha-propria-avaliacao",
          title: "Avaliação: sustente a sua nota com distração",
          instructions: "Sustente a nota enquanto outra melodia toca. Com microfone, use fones de ouvido.",
          type: "sing_note",
          config: { rounds: 3, holdSeconds: 4, toleranceCents: 30, distractor: true },
          skill: "independencia-vocal",
          purpose: "avaliacao",
        },
      ],
    },
  ],
};
