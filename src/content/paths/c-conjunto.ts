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
        explicacao: [
          {
            type: "p",
            text: "Uníssono é quando todos cantam a mesma melodia. Parece simples, mas é um dos maiores desafios de um grupo: cada pessoa tem um timbre, um volume e um jeito de pronunciar. O objetivo é que o resultado soe como uma única voz bem afinada.",
          },
          {
            type: "list",
            items: [
              "Mesma altura: ouça quem está ao seu lado e ajuste-se ao som do grupo, não o contrário.",
              "Mesmo ritmo: as sílabas começam juntas. Siga o regente, não a pessoa mais rápida.",
              "Respirações planejadas: todos respiram no mesmo lugar, salvo respiração escalonada combinada.",
              "Mesma vogal: combinem o formato da boca nas vogais longas.",
              "Finalização conjunta: o corte (fim da nota e consoante final) acontece no gesto do regente.",
            ],
          },
          {
            type: "p",
            text: "Quando homens e mulheres cantam “em uníssono”, na verdade cantam em oitavas: a mesma melodia, os homens uma oitava abaixo. Isso também é uníssono no sentido musical do grupo.",
          },
          {
            type: "tip",
            title: "Volume a serviço do grupo",
            text: "Se você só ouve a sua própria voz, provavelmente está cantando forte demais. Se não ouve nada da sua voz, talvez esteja fraco demais. O ponto certo é ouvir a si e aos vizinhos.",
          },
        ],
        demonstracao: [
          { type: "audio", label: "Mesma melodia em oitavas (vozes femininas e masculinas)", notes: [["E4", "E3"], ["E4", "E3"], ["F4", "F3"], ["G4", "G3"]], tempo: 90 },
          { type: "harmonyLink", arrangement: "hino-alegria-unissono", label: "Praticar o “Hino da Alegria” em uníssono no treinador" },
        ],
        exercicioGuiado: {
          passos: [
            "No treinador, escolha “Hino da Alegria — uníssono” e ouça a melodia no modo solo.",
            "Cante junto com a referência em “lu”, depois com o texto.",
            "Marque na letra onde respirar (fim de cada linha) e respeite esse plano.",
            "Pratique a finalização: a última nota termina exatamente no tempo 4 do último compasso.",
            "No ensaio, cante com o grupo ouvindo os vizinhos.",
          ],
        },
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
        explicacao: [
          {
            type: "p",
            text: "A entrada é um dos momentos mais expostos do canto em grupo. Uma entrada segura nasce de três coisas: contar o tempo durante a pausa, respirar no tempo anterior à entrada e já “ouvir por dentro” a primeira nota.",
          },
          {
            type: "list",
            items: [
              "Respire no tempo anterior à entrada, no andamento da música — não antes, não depois.",
              "Durante pausas, conte mentalmente: “1, 2, 3, 4”.",
              "A primeira nota precisa estar pronta na mente (pergunte ao instrumentista ou use a nota de referência).",
              "Finalização: a nota longa dura até o tempo indicado. Uma mínima no tempo 3 termina no começo do próximo compasso, não antes.",
            ],
          },
        ],
        demonstracao: [
          { type: "rhythm", pattern: "rq q q q", bpm: 80, label: "Entrada após pausa de um tempo" },
          { type: "rhythm", pattern: "rh q q", bpm: 80, label: "Entrada após pausa de dois tempos" },
          { type: "rhythm", pattern: "q q h", bpm: 80, label: "Finalização em mínima (dura até o fim do compasso)" },
        ],
        exercicioGuiado: {
          passos: [
            "Com o metrônomo a 80 bpm, conte em voz alta “1, 2, 3, 4” e bata palma apenas no tempo 2.",
            "Agora inspire no tempo 1 e cante “lá” no tempo 2, sustentando até o tempo 4.",
            "Faça o mesmo entrando no tempo 3.",
            "Pratique os padrões da demonstração no exercício de ritmo.",
          ],
        },
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
        explicacao: [
          {
            type: "p",
            text: "Equilíbrio é a proporção de volume entre as vozes. Em geral, a melodia precisa ser ouvida com clareza, o baixo sustenta a harmonia e as vozes intermediárias preenchem o acorde sem encobrir a melodia. Num naipe, nenhuma voz individual deve se destacar.",
          },
          {
            type: "list",
            items: [
              "Naipe com mais pessoas canta mais suave; naipe com poucas pessoas pode precisar de mais presença.",
              "Notas agudas tendem a soar mais fortes: sopranos e tenores precisam cuidar do volume nos agudos.",
              "Na dúvida, siga a pirâmide sonora: baixo mais presente, agudos mais leves.",
              "Microfones mudam tudo: em grupos amplificados, combine o equilíbrio com quem opera o som.",
            ],
          },
          { type: "tip", title: "Teste da vizinhança", text: "Você deve ouvir as pessoas ao seu lado. Se não ouve, reduza seu volume até ouvi-las." },
        ],
        demonstracao: [
          { type: "harmonyLink", arrangement: "hino-alegria-satb", label: "No treinador, ajuste o volume de cada naipe e ouça o efeito no equilíbrio" },
          { type: "audio", label: "Acorde equilibrado (todas as vozes com o mesmo volume)", notes: [["C3", "G3", "C4", "E4"]], mode: "chord", tempo: 30 },
        ],
        exercicioGuiado: {
          passos: [
            "Abra o “Hino da Alegria — SATB” no modo conjunto.",
            "Reduza o volume do soprano e ouça como a melodia “some”. Volte ao normal.",
            "Aumente apenas o contralto e perceba como o acorde fica desequilibrado.",
            "Encontre uma combinação em que a melodia é clara e o acorde soa cheio.",
          ],
        },
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
        explicacao: [
          {
            type: "p",
            text: "Escuta ativa é cantar com os ouvidos abertos para o conjunto. Quem só ouve a si mesmo não percebe quando o grupo desafina, acelera ou quando outra voz entra. Quem ouve o conjunto se ajusta em tempo real.",
          },
          {
            type: "list",
            items: [
              "Perceba as entradas: em muitos arranjos as vozes entram em momentos diferentes.",
              "Identifique sua posição no acorde: acima do baixo? abaixo da melodia?",
              "Compare frases: o refrão volta igual ou com alguma mudança?",
            ],
          },
        ],
        demonstracao: [
          { type: "harmonyLink", arrangement: "canone-solfejo", label: "Ouça o cânone: as vozes entram uma de cada vez" },
        ],
        exercicioGuiado: {
          passos: [
            "Ouça o cânone no modo conjunto e conte quantas vozes entram.",
            "Ouça de novo acompanhando apenas a 2ª voz do início ao fim.",
            "Faça o exercício de entradas e o de comparação de frases.",
          ],
        },
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
        explicacao: [
          {
            type: "p",
            text: "O momento mais difícil para quem começa a cantar em vozes é quando outra voz faz uma melodia diferente: a tendência é seguir a melodia mais forte (normalmente a principal) e abandonar a própria. Isso se treina com passos pequenos.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Primeiro, sustente uma única nota enquanto outra melodia se move.",
              "Depois, cante uma linha curta com notas repetidas contra uma melodia em movimento.",
              "Depois, cante sua linha completa com a melodia em volume baixo (modo guiado).",
              "Por fim, cante com todas as vozes no mesmo volume (modo conjunto).",
            ],
          },
          {
            type: "tip",
            title: "Âncoras",
            text: "Marque na sua parte as notas “âncora”: notas longas ou repetidas que você conhece bem. Quando se perder, volte para a próxima âncora.",
          },
          {
            type: "warning",
            text: "Para usar o microfone neste exercício, use fones de ouvido: assim o microfone capta somente a sua voz e não a melodia de referência.",
          },
        ],
        demonstracao: [
          { type: "harmonyLink", arrangement: "pedal-e-melodia", label: "Exercício “Nota pedal e melodia”: sustente a nota enquanto a melodia se move" },
          { type: "toolLink", tool: "afinador", label: "Treinador de afinação (use fones)" },
        ],
        exercicioGuiado: {
          passos: [
            "Abra “Nota pedal e melodia” no treinador, escolha a voz do pedal e o modo guiado.",
            "Cante o pedal com a melodia em volume baixo; aumente o volume da melodia aos poucos.",
            "Faça o exercício de sustentação com distração abaixo (com fones, se usar o microfone).",
            "Passe para o exercício “Terças paralelas” cantando a voz de baixo.",
          ],
        },
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
