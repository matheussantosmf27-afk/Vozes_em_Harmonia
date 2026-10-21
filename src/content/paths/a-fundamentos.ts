import type { PathDef } from "../types";
import { SEGURANCA_BASE } from "../common";

export const trilhaA: PathDef = {
  slug: "fundamentos-vocais",
  code: "A",
  title: "Fundamentos vocais",
  subtitle: "Postura, respiração, emissão e cuidado com a voz",
  description:
    "A base técnica de quem canta: um corpo disponível, ar bem administrado, som livre, texto claro e uma rotina segura de aquecimento. Cada aula traz prática guiada e critérios para avançar.",
  icon: "mic-vocal",
  lessons: [
    // -----------------------------------------------------------------------
    {
      slug: "postura-e-relaxamento",
      title: "Postura e relaxamento",
      summary: "Um corpo alinhado e sem tensões desnecessárias deixa o ar e o som circularem.",
      level: 1,
      minutes: 15,
      skills: ["postura-relaxamento"],
      content: {
        objetivo:
          "Encontrar uma postura alinhada e relaxada, de pé e sentado, que favoreça a respiração e a emissão, e reconhecer as tensões mais comuns ao cantar.",
        gancho: "Antes da primeira nota, quem canta é o corpo. Vamos descobrir como deixá-lo pronto, sem esforço e sem rigidez.",
        etapas: [
          {
            titulo: "Sua voz usa o corpo inteiro",
            tipo: "descobrir",
            blocos: [
              { type: "p", text: "O som nasce na garganta, mas quem sustenta a voz é o corpo todo: pés, coluna, ombros e mandíbula." },
              {
                type: "callout",
                icon: "musica",
                title: "Pense num violão",
                text: "As cordas fazem o som, mas é a caixa de madeira que o deixa bonito. Seu corpo é a caixa da sua voz: se estiver torto ou travado, o som sai apertado.",
              },
              {
                type: "check",
                question: "Se os ombros sobem e o pescoço trava ao cantar, o que tende a acontecer com o som?",
                options: ["Fica mais apertado e cansa mais rápido", "Fica mais forte e bonito", "Não muda nada"],
                answer: 0,
                explain: "Tensão no corpo vira tensão no som. Por isso a postura vem antes de qualquer nota.",
              },
            ],
          },
          {
            titulo: "Alto e solto",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "postura-comparada", caption: "Orelha, ombro, quadril e tornozelo na mesma linha." },
              {
                type: "callout",
                icon: "ideia",
                title: "A imagem do fio",
                text: "Imagine um fio puxando o topo da cabeça para cima, enquanto ombros e braços pesam para baixo. Alto e solto ao mesmo tempo.",
              },
              {
                type: "trueFalse",
                items: [
                  { statement: "Boa postura é ficar duro, como um soldado.", answer: false, explain: "Postura não é rigidez. Se precisa de força para mantê-la, está rígida demais." },
                  { statement: "Para notas agudas, devo erguer o queixo.", answer: false, explain: "Erguer o queixo estica o pescoço e aperta a laringe. O queixo fica paralelo ao chão." },
                  { statement: "Joelhos destravados evitam tensão nas costas.", answer: true, explain: "Joelhos travados endurecem o corpo e podem até causar tontura em pé." },
                ],
              },
            ],
          },
          {
            titulo: "Encontre o seu centro",
            tipo: "experimentar",
            blocos: [
              { type: "p", text: "Fique de pé, de preferência na frente de um espelho, e siga o cronômetro." },
              { type: "timer", instruction: "Feche os olhos e balance devagar para frente e para trás até sentir o peso dividido entre calcanhares e dedos.", seconds: 20 },
              {
                type: "checklist",
                title: "Confira no espelho",
                items: ["Pés na largura do quadril", "Joelhos destravados", "Ombros soltos, longe das orelhas", "Queixo paralelo ao chão", "Peito aberto, barriga livre"],
              },
            ],
          },
          {
            titulo: "Solte ombros e mandíbula",
            tipo: "experimentar",
            blocos: [
              { type: "timer", instruction: "Suba os ombros até as orelhas ao inspirar e deixe-os cair de uma vez ao soltar o ar. Repita.", seconds: 6, reps: 3 },
              { type: "illustration", name: "mandibula", caption: "A mandíbula cai por gravidade, sem empurrar." },
              { type: "timer", instruction: "Com as pontas dos dedos, massageie as bochechas perto da articulação da mandíbula, com a boca entreaberta.", seconds: 20 },
              {
                type: "reveal",
                prompt: "Coloque a mão nos ombros e inspire fundo. Eles subiram?",
                answer: "Se subiram, o ar foi para cima do peito. Tente de novo pensando em encher a cintura e as costelas: os ombros ficam parados.",
              },
            ],
          },
          {
            titulo: "O “hum” que vibra",
            tipo: "ouvir",
            blocos: [
              { type: "p", text: "Agora una corpo e som. Com a boca fechada e os dentes separados por dentro, faça um “hum” confortável." },
              { type: "singAlong", instruction: "Ouça a nota e faça “hum” sustentando por 3 segundos. Sinta os lábios fazendo cócegas.", note: "A3", seconds: 3 },
              {
                type: "callout",
                icon: "maos",
                title: "Teste do toque",
                text: "Encoste os dedos nos lábios enquanto faz o “hum”. Sentiu vibrar? É sinal de som livre, sem apertar a garganta.",
              },
            ],
          },
          {
            titulo: "E sentado, como fica?",
            tipo: "aplicar",
            blocos: [
              { type: "illustration", name: "postura-sentada" },
              {
                type: "check",
                question: "No ensaio sentado, qual é a melhor posição?",
                options: ["Na frente da cadeira, pés no chão, costas sem encostar", "Recostado(a), pernas cruzadas", "Inclinado(a) para frente, apoiado nos joelhos"],
                answer: 0,
                explain: "Na frente da cadeira o abdômen fica livre para a respiração, e você mantém o mesmo alinhamento de quando está de pé.",
              },
              { type: "toolLink", tool: "gravador", label: "Desafio: grave uma frase “largado(a)” e outra alinhado(a). Ouça a diferença." },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "match",
                prompt: "Ligue cada tensão à sua correção.",
                pairs: [
                  { left: "Ombros sobem ao inspirar", right: "Encher cintura e costelas" },
                  { left: "Queixo para cima no agudo", right: "Queixo paralelo ao chão" },
                  { left: "Joelhos travados", right: "Joelhos destravados" },
                  { left: "Dentes apertados", right: "Mandíbula solta" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: {
          passos: [
            "Antes de cada estudo ou ensaio, faça o checklist de postura (1 minuto).",
            "Cante uma frase de um hino conhecido observando-se no espelho: queixo, ombros e mandíbula ficaram soltos?",
            "Repita a mesma frase sentado(a).",
          ],
          minutos: 5,
          frequencia: "Todos os dias, antes de cantar",
        },
        errosComuns: [
          { erro: "Erguer o queixo para alcançar notas agudas.", correcao: "Mantenha o queixo paralelo ao chão. A nota aguda não está “em cima”; erguer a cabeça tensiona a laringe." },
          { erro: "Estufar o peito e travar a barriga.", correcao: "O peito fica aberto, mas o abdômen precisa estar livre para se mover com a respiração." },
          { erro: "Travar os joelhos durante músicas longas.", correcao: "Joelhos destravados evitam tensão nas costas e até tontura em pé por muito tempo." },
          { erro: "Ombros que sobem ao inspirar.", correcao: "A inspiração acontece embaixo (costelas e abdômen). Pratique inspirar com as mãos nos ombros para perceber." },
        ],
        seguranca: [...SEGURANCA_BASE, "Se sentir tontura durante alongamentos ou respirações, sente-se e volte à respiração normal."],
        criterioAvanco:
          "Acertar pelo menos 70% da avaliação desta aula e conseguir cantar uma frase mantendo ombros, pescoço e mandíbula soltos (confira gravando-se ou com o professor).",
      },
      exercises: [
        {
          slug: "postura-checklist",
          title: "Checklist de postura",
          instructions: "Fique em frente a um espelho e confira cada item, primeiro de pé e depois sentado(a).",
          type: "self_check",
          config: {
            minutes: 3,
            items: [
              "Pés na largura do quadril e peso distribuído",
              "Joelhos destravados",
              "Ombros soltos, sem subir ao inspirar",
              "Queixo paralelo ao chão",
              "Mandíbula solta no “hum”",
              "Mesmo alinhamento quando sentado(a)",
            ],
          },
          skill: "postura-relaxamento",
          purpose: "pratica",
        },
        {
          slug: "postura-avaliacao",
          title: "Avaliação: postura para cantar",
          instructions: "Responda com base no que você estudou na aula.",
          type: "quiz",
          config: {
            questions: [
              {
                q: "Qual imagem ajuda a encontrar uma postura alinhada sem rigidez?",
                options: ["Um fio puxando o topo da cabeça para cima, com ombros pesando para baixo", "Peito estufado e barriga travada", "Queixo erguido para o som ir “para cima”", "Joelhos esticados ao máximo"],
                answer: 0,
                explanation: "“Alto e solto”: a coluna se alonga enquanto ombros e braços ficam relaxados.",
              },
              {
                q: "Por que não se deve erguer o queixo para cantar notas agudas?",
                options: ["Porque tensiona o pescoço e a laringe", "Porque a nota fica mais grave", "Porque o som fica mais alto", "Não há problema em erguer o queixo"],
                answer: 0,
                explanation: "Erguer a cabeça estica a musculatura do pescoço e dificulta a emissão livre.",
              },
              {
                q: "Ao cantar sentado(a), qual é a melhor posição?",
                options: ["Na parte da frente da cadeira, pés no chão e coluna sem encostar", "Recostado(a) no encosto, pernas cruzadas", "Na ponta da cadeira com os pés para trás e o corpo inclinado para frente", "Qualquer posição, a postura só importa em pé"],
                answer: 0,
              },
              {
                q: "O que acontece com os ombros numa inspiração eficiente?",
                options: ["Permanecem soltos; a expansão acontece nas costelas e no abdômen", "Sobem para encher mais o pulmão", "Vão para frente", "Ficam contraídos para dar apoio"],
                answer: 0,
              },
              {
                q: "Para que serve o “hum” de boca fechada nesta aula?",
                options: ["Sentir a vibração do som sem esforço, com a mandíbula solta", "Cantar o mais forte possível", "Testar a nota mais aguda", "Descansar a voz sem produzir som"],
                answer: 0,
              },
            ],
          },
          skill: "postura-relaxamento",
          purpose: "avaliacao",
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      slug: "aquecimento-vocal",
      title: "Aquecimento e desaquecimento vocal",
      summary: "Uma rotina curta e progressiva prepara a voz para cantar com segurança.",
      level: 1,
      minutes: 20,
      skills: ["aquecimento-vocal"],
      content: {
        objetivo:
          "Conhecer e executar uma rotina de aquecimento de 8 a 10 minutos — corpo, respiração, vibração, deslizes e articulação — e um desaquecimento de 2 minutos após o ensaio.",
        gancho: "Nenhum atleta entra em campo sem aquecer. Em 10 minutos, você vai preparar a voz do jeito certo e sentir a diferença no ensaio.",
        etapas: [
          {
            titulo: "Por que aquecer?",
            tipo: "descobrir",
            blocos: [
              { type: "p", text: "As pregas vocais são um tecido delicado, coordenado por pequenos músculos. Como um atleta antes do jogo, quem canta prepara essa musculatura aos poucos." },
              { type: "illustration", name: "aquecimento", caption: "Do suave ao intenso, do meio para as pontas." },
              {
                type: "callout",
                icon: "ideia",
                title: "Três regras de ouro",
                text: "Do suave para o intenso. Da região média para as extremidades. Do som fechado (“hum”, “u”) para o aberto (“á”).",
              },
              {
                type: "check",
                question: "Qual é o jeito mais seguro de começar o aquecimento?",
                options: ["Na região média, com volume moderado", "Pela nota mais aguda, para “abrir” a voz", "Com o trecho mais difícil do repertório", "Gritando um pouco para soltar"],
                answer: 0,
                explain: "Começar no meio e suave prepara a musculatura sem sobrecarga. Agudos e volume vêm depois, aos poucos.",
              },
            ],
          },
          {
            titulo: "Corpo e ar (2 minutos)",
            tipo: "experimentar",
            blocos: [
              { type: "timer", instruction: "Incline a cabeça devagar para um lado e para o outro, role os ombros para trás e deixe a mandíbula cair solta.", seconds: 60 },
              { type: "p", text: "Agora inspire pelo nariz, expandindo as costelas, e solte o ar num “sss” contínuo." },
              { type: "breathing", inhale: 4, exhale: 8, rounds: 4, exhaleOn: "sss" },
              { type: "tip", text: "Ficou fácil? Aos poucos, estique o “sss” para 12 tempos." },
            ],
          },
          {
            titulo: "O motorzinho dos lábios",
            tipo: "experimentar",
            blocos: [
              {
                type: "callout",
                icon: "ideia",
                title: "Por que o “brrr” funciona",
                text: "A vibração de lábios cria uma leve resistência na saída do ar. Isso equilibra a pressão sobre as pregas vocais com pouco esforço. É ótima para começar o dia e para recuperar a voz depois do ensaio.",
              },
              { type: "audio", label: "Escala de cinco notas em Dó (vozes femininas)", notes: ["C4", "D4", "E4", "F4", "G4", "F4", "E4", "D4", "C4"], tempo: 120 },
              { type: "audio", label: "Escala de cinco notas em Dó (vozes masculinas)", notes: ["C3", "D3", "E3", "F3", "G3", "F3", "E3", "D3", "C3"], tempo: 120 },
              {
                type: "timer",
                instruction: "Faça “brrr” acompanhando a escala. Se os lábios travarem, apoie os dedos de leve nas bochechas. Não saiu? Use a vibração de língua: “trrr”.",
                seconds: 30,
                reps: 2,
              },
            ],
          },
          {
            titulo: "A sirene que sobe e desce",
            tipo: "experimentar",
            blocos: [
              { type: "p", text: "Em “u”, deslize suavemente do grave ao agudo confortável e volte, como um elevador. Use o arpejo como guia." },
              { type: "audio", label: "Arpejo para deslize (Dó–Mi–Sol–Mi–Dó)", notes: ["C4", "E4", "G4", "E4", "C4"], tempo: 100 },
              { type: "timer", instruction: "Sirene em “u”: suba e desça bem suave, sem empurrar o topo.", seconds: 8, reps: 3 },
              {
                type: "trueFalse",
                items: [
                  { statement: "Se o topo da sirene pesar, devo empurrar mais forte.", answer: false, explain: "Pare antes do esforço. O aquecimento expande a voz aos poucos, sem empurrar." },
                  { statement: "Um bom aquecimento deixa a voz cansada.", answer: false, explain: "Aquecimento não deve doer nem cansar. Se cansar, diminua o volume e a extensão." },
                ],
              },
            ],
          },
          {
            titulo: "Vogais em cinco notas",
            tipo: "experimentar",
            blocos: [
              { type: "p", text: "Cante Dó–Ré–Mi–Fá–Sol–Fá–Mi–Ré–Dó em “mi”, “mê”, “má”, “mô”, “mu”. A cada repetição, suba meio-tom, só enquanto estiver confortável." },
              { type: "singAlong", instruction: "Comece pela primeira nota da escala: cante “mi” e sustente, suave.", note: "C4", seconds: 3 },
              {
                type: "reveal",
                prompt: "Até onde subir a escala?",
                answer: "Até onde estiver confortável, sem esforço. Não existe uma nota certa para todos: cada voz tem seu limite, e ele pode mudar de um dia para o outro.",
              },
            ],
          },
          {
            titulo: "Acorde a língua",
            tipo: "experimentar",
            blocos: [
              { type: "p", text: "Para fechar: articulação. Trava-línguas e as consoantes do repertório do dia." },
              { type: "timer", instruction: "Diga, articulando sem pressa: “O rato roeu a roupa do rei de Roma”. Depois, um pouco mais rápido.", seconds: 20 },
              { type: "toolLink", tool: "aquecimento", label: "Abrir a rotina guiada: ela toca as notas e avança sozinha" },
            ],
          },
          {
            titulo: "Depois do ensaio: desaquecer",
            tipo: "aplicar",
            blocos: [
              { type: "p", text: "O desaquecimento leva a voz de volta à fala. Após o ensaio, faça 1 minuto de “brrr” em deslizes descendentes e alguns bocejos-suspiros suaves, terminando na altura da sua fala." },
              {
                type: "check",
                question: "Acabou o ensaio e a garganta parece “arranhando”. O que fazer?",
                options: ["Deslizes descendentes em “brrr” e um gole de água", "Pigarrear até limpar", "Cantar as notas mais agudas para fechar", "Sussurrar com força o resto da noite"],
                answer: 0,
                explain: "Deslizes suaves ajudam a voz a se recuperar. Pigarrear e sussurrar forçado atritam as pregas vocais; prefira engolir em seco ou beber água.",
              },
            ],
          },
          {
            titulo: "Monte a sua rotina",
            tipo: "checar",
            blocos: [
              {
                type: "order",
                prompt: "Coloque as etapas do aquecimento na ordem.",
                items: ["Corpo: pescoço, ombros e mandíbula", "Respiração em “sss”", "Vibração de lábios ou de língua", "Sirene em “u”", "Escala de cinco notas em vogais", "Trava-línguas"],
              },
            ],
          },
        ],
        pratiqueSozinho: {
          passos: [
            "Use a rotina guiada antes de cada estudo e antes do ensaio.",
            "Depois de cantar, faça 1 minuto de vibração de lábios descendente e 3 suspiros suaves.",
            "Registre o seu estudo em “Meu progresso” para manter a sequência de dias.",
          ],
          minutos: 10,
          frequencia: "Todos os dias em que for cantar",
        },
        errosComuns: [
          { erro: "Começar pelas notas mais agudas e mais fortes.", correcao: "Comece na região média, com volume moderado, e expanda aos poucos." },
          { erro: "Fazer a vibração de lábios com as bochechas tensas.", correcao: "Apoie levemente os dedos nas bochechas; o som deve sair contínuo, com pouco esforço." },
          { erro: "Pular o desaquecimento depois do ensaio.", correcao: "Dois minutos de deslizes suaves ajudam a voz a se recuperar e voltar para a fala." },
          { erro: "Achar que pigarrear limpa a voz.", correcao: "Pigarrear atrita as pregas vocais. Prefira engolir em seco ou tomar um gole de água." },
        ],
        seguranca: [...SEGURANCA_BASE, "Aquecimento não deve doer nem cansar. Se cansar, diminua o volume e a extensão."],
        criterioAvanco: "Acertar pelo menos 70% da avaliação e completar a rotina guiada em 3 dias diferentes.",
      },
      exercises: [
        {
          slug: "aquecimento-rotina",
          title: "Rotina de aquecimento",
          instructions: "Faça a rotina completa e avalie como cada etapa foi.",
          type: "self_check",
          config: {
            minutes: 10,
            items: ["Alongamentos sem dor", "Respiração em “sss” por 8 tempos", "Vibração de lábios contínua", "Sirene sem empurrar o agudo", "Escala de cinco notas em vogais", "Desaquecimento após cantar"],
            audio: { notes: ["C4", "D4", "E4", "F4", "G4", "F4", "E4", "D4", "C4"], mode: "seq", tempo: 120 },
          },
          skill: "aquecimento-vocal",
          purpose: "pratica",
        },
        {
          slug: "aquecimento-avaliacao",
          title: "Avaliação: aquecimento seguro",
          instructions: "Responda sobre os princípios do aquecimento vocal.",
          type: "quiz",
          config: {
            questions: [
              {
                q: "Qual é a ordem mais segura para aquecer a voz?",
                options: ["Do suave para o intenso, da região média para as extremidades", "Do agudo para o grave, sempre forte", "Começar com o repertório mais difícil", "Gritar um pouco para “abrir” a voz"],
                answer: 0,
              },
              {
                q: "Por que a vibração de lábios é um bom exercício inicial?",
                options: ["Equilibra a pressão do ar sobre as pregas vocais com pouco esforço", "Porque deixa a voz mais grave", "Porque dispensa a respiração", "Porque aumenta a extensão imediatamente"],
                answer: 0,
              },
              {
                q: "O que fazer em vez de pigarrear?",
                options: ["Engolir em seco ou beber um gole de água", "Pigarrear mais forte", "Tossir", "Sussurrar"],
                answer: 0,
                explanation: "Sussurrar forçado e pigarrear também atritam as pregas vocais.",
              },
              {
                q: "Para que serve o desaquecimento?",
                options: ["Levar a voz de volta para a fala e ajudar na recuperação", "Treinar notas extremas", "Substituir o aquecimento", "Não tem utilidade"],
                answer: 0,
              },
              {
                q: "Na escala de cinco notas, até onde subir?",
                options: ["Até onde estiver confortável, sem esforço", "Sempre até a nota mais aguda possível", "Exatamente uma oitava acima, para todos", "Até a voz falhar"],
                answer: 0,
              },
            ],
          },
          skill: "aquecimento-vocal",
          purpose: "avaliacao",
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      slug: "respiracao-e-fraseado",
      title: "Respiração e fraseado",
      summary: "Administrar o ar com conforto e planejar onde respirar em cada frase.",
      level: 1,
      minutes: 20,
      skills: ["respiracao-fraseado"],
      content: {
        objetivo:
          "Inspirar sem tensão, administrar a saída do ar para sustentar frases e planejar as respirações de uma música de acordo com o texto e a melodia.",
        gancho: "Já ficou sem ar no meio de um hino? O segredo não é ter mais fôlego: é saber onde o ar entra e onde respirar.",
        etapas: [
          {
            titulo: "Onde o ar realmente entra",
            tipo: "descobrir",
            blocos: [
              { type: "p", text: "Cantar pede mais ar e mais controle do que falar. Na inspiração, o diafragma desce e as costelas se expandem. Por isso sentimos a cintura e as costas se abrirem." },
              { type: "illustration", name: "respiracao", caption: "O diafragma desce; costelas e cintura se abrem." },
              {
                type: "check",
                question: "Ao inspirar para cantar, onde você deve sentir a expansão?",
                options: ["Cintura, costelas laterais e costas", "Nos ombros, que sobem", "Só no peito alto", "Na garganta"],
                answer: 0,
                explain: "O diafragma desce e as costelas se abrem para os lados e para trás. Ombros que sobem indicam uma respiração alta e tensa.",
              },
            ],
          },
          {
            titulo: "Sinta com as mãos",
            tipo: "experimentar",
            blocos: [
              { type: "p", text: "Mãos na cintura, polegares para trás. Inspire e sinta as mãos se afastarem, sem subir os ombros." },
              { type: "breathing", inhale: 4, exhale: 4, rounds: 3 },
              {
                type: "list",
                items: [
                  "Pelo nariz quando houver tempo; pela boca nas respirações rápidas, sem barulho.",
                  "Não encha ao máximo: ar demais gera tensão. Inspire o necessário para a frase.",
                ],
              },
            ],
          },
          {
            titulo: "Solte o ar aos poucos",
            tipo: "experimentar",
            blocos: [
              { type: "p", text: "Agora o desafio: soltar o ar de forma constante, sem prender e sem empurrar. Mantenha as costelas “abertas” por mais tempo, em vez de esvaziar de uma vez." },
              { type: "breathing", inhale: 4, exhale: 8, rounds: 3, exhaleOn: "sss" },
              { type: "tip", title: "Próximo nível", text: "Conseguiu 8? Tente 12 e depois 16 tempos. Troque o “sss” por “fff” e depois por “vvv” (com som), com a mesma constância." },
              { type: "toolLink", tool: "metronomo", label: "Abrir o metrônomo a 60 bpm (um tempo por segundo)" },
            ],
          },
          {
            titulo: "Uma frase, uma respiração",
            tipo: "ouvir",
            blocos: [
              { type: "p", text: "Ouça e cante esta frase em “lu”, respirando só no início. Se faltar ar, cante mais suave, não mais forte." },
              { type: "audio", label: "Frase para sustentar (vozes femininas)", notes: ["G4", "G4", "A4", "G4", "F4", "E4", "D4", "C4"], tempo: 66 },
              { type: "audio", label: "Frase para sustentar (vozes masculinas)", notes: ["G3", "G3", "A3", "G3", "F3", "E3", "D3", "C3"], tempo: 66 },
              {
                type: "trueFalse",
                items: [
                  { statement: "Quanto mais ar eu puxar, melhor vou cantar.", answer: false, explain: "Ar demais gera tensão e dificulta o controle. Inspire o necessário para a frase." },
                  { statement: "Prender o ar antes de cantar dá mais apoio.", answer: false, explain: "A inspiração deve virar som sem uma pausa travada na garganta." },
                  { statement: "Começar a frase com o mesmo fluxo de ar do final ajuda a economizar.", answer: true, explain: "Quem gasta tudo nas primeiras notas fica sem ar no fim. Fluxo constante do início ao fim." },
                ],
              },
            ],
          },
          {
            titulo: "Onde respirar?",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "frase-respiracao", caption: "O “V” marca o lugar da respiração." },
              { type: "p", text: "Fraseado é conduzir a frase do início ao fim. Respirar no meio de uma palavra ou de uma ideia quebra o sentido do texto. Por isso marcamos com vírgula ou “V” onde respirar: nas pausas, nas vírgulas do texto e no fim das frases." },
              {
                type: "check",
                question: "Qual destas respirações quebra o sentido do texto?",
                options: ["No meio da palavra “Se-nhor”", "Na vírgula do texto", "Na pausa entre duas frases", "No fim da estrofe"],
                answer: 0,
                explain: "Respirar no meio de uma palavra corta a mensagem. Pausas, vírgulas e finais de frase são os lugares naturais.",
              },
            ],
          },
          {
            titulo: "Respirar em equipe",
            tipo: "descobrir",
            blocos: [
              {
                type: "callout",
                icon: "coracao",
                title: "Respiração escalonada",
                text: "Em frases muito longas, cada pessoa do naipe respira num lugar diferente, discretamente. Assim o som do naipe nunca para. O regente indica quando usar.",
              },
              {
                type: "reveal",
                prompt: "Numa frase longa e sem pausa, o que aconteceria se o naipe inteiro respirasse no mesmo lugar?",
                answer: "O som pararia de repente, abrindo um buraco na música. Respirando em momentos diferentes, cada um sai e volta discretamente e o som continua.",
              },
            ],
          },
          {
            titulo: "Sua vez: marque um hino",
            tipo: "aplicar",
            blocos: [
              { type: "p", text: "Escolha um hino conhecido, escreva a letra de uma estrofe e marque com “V” onde vai respirar." },
              {
                type: "checklist",
                title: "Confira suas marcações",
                items: ["Nenhum “V” no meio de palavra", "Respirações em vírgulas, pausas ou fins de frase", "Nenhuma ideia do texto cortada ao meio", "Cantei a estrofe respeitando as marcações"],
              },
              { type: "toolLink", tool: "gravador", label: "Grave a estrofe: alguma respiração cortou uma palavra?" },
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
                  { left: "Ombros sobem ao inspirar", right: "Expandir cintura e costelas" },
                  { left: "Ar acaba nas primeiras notas", right: "Fluxo constante, costelas abertas" },
                  { left: "Inspiração barulhenta", right: "Garganta aberta, como num bocejo discreto" },
                  { left: "Respirar no meio da palavra", right: "Planejar as respirações no texto" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: {
          passos: [
            "3 séries de “sss” por 12 a 16 tempos.",
            "Cante a estrofe que você marcou respeitando as respirações planejadas.",
            "Grave-se e confira: alguma respiração cortou uma palavra ou uma ideia?",
          ],
          minutos: 8,
          frequencia: "4 vezes por semana",
        },
        errosComuns: [
          { erro: "Inspirar ruidosamente ou com os ombros.", correcao: "Abra a garganta como num bocejo discreto e deixe o ar entrar embaixo." },
          { erro: "Gastar todo o ar nas primeiras notas.", correcao: "Comece a frase com o mesmo fluxo que pretende ter no final; pense em “economizar” as costelas abertas." },
          { erro: "Prender o ar antes de cantar.", correcao: "A inspiração deve se transformar em som sem pausa travada na garganta." },
          { erro: "Respirar no meio de uma palavra.", correcao: "Planeje as respirações no texto antes de cantar." },
        ],
        seguranca: [...SEGURANCA_BASE, "Não prenda a respiração em exercícios longos. Se ficar tonto(a), pare e respire normalmente."],
        criterioAvanco: "Acertar pelo menos 70% da avaliação e sustentar um “sss” constante por 12 tempos a 60 bpm.",
      },
      exercises: [
        {
          slug: "respiracao-pratica",
          title: "Prática de sustentação do ar",
          instructions: "Use o metrônomo a 60 bpm e marque o que conseguiu.",
          type: "self_check",
          config: {
            minutes: 6,
            items: ["Inspiração sem subir os ombros", "“sss” constante por 8 tempos", "“sss” constante por 12 tempos", "Frase cantada inteira com uma respiração", "Respirações marcadas numa estrofe"],
          },
          skill: "respiracao-fraseado",
          purpose: "pratica",
        },
        {
          slug: "respiracao-avaliacao",
          title: "Avaliação: respiração e fraseado",
          instructions: "Responda sobre respiração e planejamento das frases.",
          type: "quiz",
          config: {
            questions: [
              {
                q: "Onde sentimos a expansão numa inspiração adequada para cantar?",
                options: ["Cintura, costelas laterais e costas", "Somente no peito alto", "Nos ombros", "Na garganta"],
                answer: 0,
              },
              {
                q: "Se o ar está acabando antes do fim da frase, o que é melhor fazer no estudo?",
                options: ["Cantar mais suave e planejar uma respiração em lugar adequado", "Empurrar o ar com força", "Prender a respiração e continuar", "Encher o pulmão ao máximo, até ficar tenso"],
                answer: 0,
              },
              {
                q: "Onde normalmente marcamos as respirações?",
                options: ["Nas pausas, vírgulas do texto e finais de frase", "No meio das palavras mais longas", "Em qualquer lugar, quando faltar ar", "Somente no início da música"],
                answer: 0,
              },
              {
                q: "O que é respiração escalonada?",
                options: ["Cada cantor respira em um momento diferente para o som do naipe não parar", "Respirar em degraus, cada vez mais fundo", "Todos respiram juntos no mesmo ponto", "Respirar apenas pelo nariz"],
                answer: 0,
              },
              {
                q: "Inspirar ar demais pode…",
                options: ["Gerar tensão e dificultar o controle", "Garantir mais afinação", "Deixar a voz mais aguda", "Não tem efeito"],
                answer: 0,
              },
            ],
          },
          skill: "respiracao-fraseado",
          purpose: "avaliacao",
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      slug: "emissao-confortavel",
      title: "Emissão confortável e ressonância",
      summary: "Som livre e projetado sem apertar a garganta.",
      level: 1,
      minutes: 20,
      skills: ["emissao-ressonancia"],
      content: {
        objetivo:
          "Produzir um som equilibrado — nem soproso, nem apertado — usando a ressonância para projetar a voz sem aumentar o esforço.",
        gancho: "Dá para ser ouvido(a) lá no fundo da igreja sem gritar? Dá! O segredo está no começo do som e nos espaços do seu rosto.",
        etapas: [
          {
            titulo: "Três jeitos de começar um som",
            tipo: "descobrir",
            blocos: [
              { type: "p", text: "A emissão é o início do som. Ela pode ser de três tipos, e o nosso objetivo é a equilibrada." },
              {
                type: "list",
                items: ["Soprosa: sai muito ar e pouca nota.", "Apertada: a garganta fecha e o som fica duro.", "Equilibrada: o som começa limpo, com o ar e as pregas vocais coordenados."],
              },
              {
                type: "callout",
                icon: "ideia",
                title: "O “ã-hã” de concordância",
                text: "Diga “ã-hã” como quem concorda com algo agradável. Esse começo suave e limpo é o ataque equilibrado.",
              },
            ],
          },
          {
            titulo: "Experimente os três",
            tipo: "experimentar",
            blocos: [
              {
                type: "timer",
                instruction: "Numa nota confortável, cante “ah” soproso (com muito ar), depois “ah” apertado e, por fim, o “ah” equilibrado do “ã-hã”. Perceba a diferença.",
                seconds: 30,
              },
              {
                type: "check",
                question: "Qual emissão é a mais saudável e eficiente?",
                options: ["Equilibrada", "Soprosa", "Apertada"],
                answer: 0,
                explain: "Na equilibrada, ar e pregas vocais trabalham juntos: som limpo, sem desperdiçar ar e sem apertar a garganta.",
              },
            ],
          },
          {
            titulo: "Onde o som ganha corpo",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "ressonancia", caption: "Garganta, boca e cavidade nasal amplificam o som." },
              { type: "p", text: "Ressonância é a amplificação do som nas cavidades acima das pregas vocais: garganta, boca e cavidade nasal. Pequenos ajustes fazem a voz ser ouvida com clareza sem gritar." },
              {
                type: "callout",
                icon: "musica",
                title: "Espaço de bocejo",
                text: "Sinta o início de um bocejo: o palato mole sobe e a boca ganha espaço. A língua fica relaxada, tocando os dentes de baixo, sem afundar.",
              },
            ],
          },
          {
            titulo: "Do “hum” ao “á”",
            tipo: "experimentar",
            blocos: [
              { type: "p", text: "Faça “hum” e abra para “á” sem perder a vibração à frente: “hummmm-á”. Sinta lábios, nariz e maçãs do rosto vibrando." },
              { type: "singAlong", instruction: "Ouça a nota e cante “hummmm-á”, mantendo a vibração à frente.", note: "E4", seconds: 4 },
              {
                type: "reveal",
                prompt: "Ao abrir para “á”, a vibração no rosto continuou?",
                answer: "Se sumiu, a garganta pode ter apertado ou a língua afundado. Volte ao “hum”, mantenha o espaço de bocejo e abra devagar.",
              },
              { type: "toolLink", tool: "afinador", label: "Sustente a nota no treinador de afinação" },
            ],
          },
          {
            titulo: "Brilho com “nhã”",
            tipo: "ouvir",
            blocos: [
              { type: "audio", label: "Padrão “nhã-nhã-nhã” (Sol–Fá–Mi–Ré–Dó)", notes: ["G4", "F4", "E4", "D4", "C4"], tempo: 100 },
              { type: "p", text: "Cante o padrão em “nhã”, descendo as cinco notas (vozes graves, uma oitava abaixo). Depois cante a mesma melodia em “lá”, mantendo o mesmo brilho." },
              { type: "timer", instruction: "Alterne: uma vez em “nhã”, uma vez em “lá”. O “lá” ficou tão brilhante quanto o “nhã”?", seconds: 10, reps: 3 },
            ],
          },
          {
            titulo: "Mais forte sem apertar",
            tipo: "aplicar",
            blocos: [
              { type: "p", text: "Para cantar mais forte, aumente o fluxo de ar e o espaço interno. O pescoço continua solto." },
              {
                type: "trueFalse",
                items: [
                  { statement: "Para ser ouvido(a), preciso apertar a garganta.", answer: false, explain: "Volume vem do equilíbrio entre ar e ressonância, não de força na garganta." },
                  { statement: "Afundar a língua cria mais espaço para o som.", answer: false, explain: "O espaço vem do palato mole elevado. A língua fica relaxada, tocando os dentes de baixo." },
                  { statement: "Sentir o som “à frente” no rosto ajuda a projetar.", answer: true, explain: "No “hum” e no “nhã”, a vibração nos lábios e no rosto mostra a ressonância trabalhando a seu favor." },
                ],
              },
              { type: "timer", instruction: "Cante uma frase de hino em volume médio e depois mais forte, só com mais ar e mais espaço.", seconds: 30 },
            ],
          },
          {
            titulo: "Sinais de alerta",
            tipo: "aplicar",
            blocos: [
              {
                type: "warning",
                text: "Rouquidão frequente, dor ou sensação de “bola” na garganta não são normais. Interrompa o exercício e procure um profissional de saúde (otorrinolaringologista ou fonoaudiólogo). Esta plataforma não faz diagnóstico.",
              },
              {
                type: "check",
                question: "Você fica rouco(a) depois de quase todo ensaio. O que fazer?",
                options: ["Procurar um otorrino ou fonoaudiólogo", "Cantar mais forte para “abrir” a voz", "Ignorar: é sinal de voz aquecida", "Pigarrear até passar"],
                answer: 0,
                explain: "Rouquidão frequente não é normal nem sinal de esforço “bom”. Quem avalia é um profissional de saúde.",
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
                  { left: "Emissão soprosa", right: "Muito ar e pouca nota" },
                  { left: "Emissão apertada", right: "Garganta fechada, som duro" },
                  { left: "Emissão equilibrada", right: "Ar e pregas vocais coordenados" },
                  { left: "Ressonância", right: "Amplificação nas cavidades acima das pregas" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: {
          passos: ["5 repetições de “hum → á” em notas confortáveis.", "Padrão “nhã” → “lá” subindo meio-tom por vez.", "Uma frase de hino em três volumes: suave, médio e forte."],
          minutos: 8,
          frequencia: "4 vezes por semana",
        },
        errosComuns: [
          { erro: "Confundir volume com força na garganta.", correcao: "Aumente o volume com mais fluxo de ar e espaço interno; o pescoço continua solto." },
          { erro: "Afundar a língua para “fazer espaço”.", correcao: "O espaço vem do palato mole elevado. A língua fica relaxada, tocando os dentes de baixo." },
          { erro: "Som soproso por insegurança.", correcao: "Comece com o “ã-hã” de concordância para coordenar ar e voz." },
        ],
        seguranca: [...SEGURANCA_BASE],
        criterioAvanco: "Acertar pelo menos 70% da avaliação e sustentar uma nota por 3 segundos com estabilidade no treinador de afinação.",
      },
      exercises: [
        {
          slug: "emissao-nota-sustentada",
          title: "Nota sustentada com emissão equilibrada",
          instructions: "Cante “lá” ou “ú” e sustente a nota. Com microfone, o sistema mede a estabilidade; sem microfone, faça a autoavaliação.",
          type: "sing_note",
          config: { rounds: 3, holdSeconds: 3, toleranceCents: 30 },
          skill: "afinacao-nota",
          purpose: "pratica",
        },
        {
          slug: "emissao-avaliacao",
          title: "Avaliação: emissão e ressonância",
          instructions: "Responda sobre emissão e ressonância.",
          type: "quiz",
          config: {
            questions: [
              { q: "Qual é a emissão mais saudável e eficiente?", options: ["Equilibrada", "Soprosa", "Apertada", "Sussurrada"], answer: 0 },
              { q: "Ressonância é…", options: ["A amplificação do som nas cavidades acima das pregas vocais", "A força do ar no abdômen", "O volume máximo da voz", "Um tipo de respiração"], answer: 0 },
              { q: "Para cantar mais forte com segurança, devemos…", options: ["Aumentar o fluxo de ar e o espaço interno, sem apertar a garganta", "Apertar o pescoço", "Erguer o queixo", "Afundar a língua"], answer: 0 },
              { q: "Rouquidão frequente ao cantar indica que…", options: ["É preciso parar e procurar um profissional de saúde", "O exercício está funcionando", "Deve-se cantar mais forte", "A voz está aquecida"], answer: 0 },
              { q: "O “ã-hã” de concordância ajuda a…", options: ["Coordenar o ar e as pregas vocais num ataque equilibrado", "Treinar notas agudas", "Respirar pelo nariz", "Melhorar a dicção das consoantes"], answer: 0 },
            ],
          },
          skill: "emissao-ressonancia",
          purpose: "avaliacao",
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      slug: "afinacao-basica",
      title: "Afinação básica",
      summary: "Encontrar a nota de referência, reproduzi-la e sustentá-la.",
      level: 1,
      minutes: 25,
      skills: ["afinacao-nota", "percepcao-afinacao"],
      content: {
        objetivo:
          "Entender o que é afinação, reproduzir notas a partir de uma referência, sustentá-las e reconhecer tendências de cantar acima ou abaixo da nota.",
        gancho: "No coral, uma voz simples e afinada soa melhor do que uma voz linda fora da nota. Vamos treinar ouvido e voz para acertar o alvo.",
        etapas: [
          {
            titulo: "Acertar o alvo",
            tipo: "descobrir",
            blocos: [
              { type: "p", text: "Afinar é fazer a frequência da sua voz coincidir com a nota esperada. No grupo, a afinação é o que faz os acordes soarem limpos." },
              { type: "illustration", name: "onda-afinada", caption: "Voz e referência coincidem: o som fica limpo." },
              {
                type: "trueFalse",
                items: [
                  { statement: "Uma voz bonita está sempre afinada.", answer: false, explain: "Qualidade vocal e afinação são coisas diferentes. Uma voz simples pode estar perfeitamente afinada." },
                  { statement: "Errar uma tentativa prova que sou desafinado(a).", answer: false, explain: "Uma tentativa não diz nada. Observe a tendência ao longo de vários dias." },
                ],
              },
            ],
          },
          {
            titulo: "Ouça a diferença",
            tipo: "ouvir",
            blocos: [
              { type: "p", text: "A distância entre alturas próximas é medida em cents: 100 cents são um semitom, de uma tecla para a vizinha. Até 10 a 20 cents quase ninguém percebe; acima de 25 a 30 cents já soa “fora”." },
              {
                type: "compare",
                prompt: "As duas tentam cantar Lá. Qual está afinada?",
                options: [
                  { label: "afinada", notes: ["A3"] },
                  { label: "35 cents abaixo", notes: ["A3"], cents: -35 },
                ],
                answer: 0,
                explain: "A versão abaixo soa levemente “caída”. Com treino curto e frequente, essa diferença fica cada vez mais fácil de ouvir.",
              },
            ],
          },
          {
            titulo: "Ouça, imagine, cante",
            tipo: "experimentar",
            blocos: [
              {
                type: "callout",
                icon: "ouvido",
                title: "Ouça por dentro",
                text: "Ouça a referência, imagine o som em silêncio por 2 segundos e só então cante, suave, numa vogal fechada como “u”.",
              },
              { type: "singAlong", instruction: "Ouça o Dó, imagine o som e cante “u” suave na mesma altura.", note: "C4", seconds: 3 },
              { type: "tip", title: "Comece suave", text: "Com volume moderado é mais fácil ajustar a altura. Repita com três notas diferentes dentro da sua região confortável." },
            ],
          },
          {
            titulo: "A mesma nota, outra oitava",
            tipo: "descobrir",
            blocos: [
              { type: "p", text: "Se a nota estiver longe da sua região, cante-a uma oitava abaixo ou acima. A mesma nota em outra oitava também está afinada." },
              { type: "keyboard", from: "C3", to: "C5", highlight: ["C3", "C4", "C5"], label: "As notas Dó em três oitavas" },
              { type: "audio", label: "Mesma nota em duas oitavas (Dó3 e Dó4)", notes: ["C3", "C4"], tempo: 50 },
              {
                type: "check",
                question: "A referência é Dó4 e você canta Dó3, uma oitava abaixo. Você está…",
                options: ["Afinado(a): é a mesma nota em outra oitava", "Desafinado(a)", "Cantando outra nota"],
                answer: 0,
                explain: "Notas a uma oitava de distância têm o mesmo nome. Cantar a referência em outra oitava é uma forma afinada e segura de responder.",
              },
            ],
          },
          {
            titulo: "Treine o controle",
            tipo: "experimentar",
            blocos: [
              { type: "p", text: "No treinador de afinação, sustente a nota e observe o ponteiro. Ajuste devagar até ficar no centro." },
              { type: "toolLink", tool: "afinador", label: "Abrir o treinador de afinação com microfone" },
              { type: "timer", instruction: "Cante de propósito um pouco acima, depois um pouco abaixo, e volte ao centro.", seconds: 15, reps: 3 },
            ],
          },
          {
            titulo: "Por que a nota escapa?",
            tipo: "descobrir",
            blocos: [
              {
                type: "match",
                prompt: "Ligue cada tipo de dificuldade ao que acontece.",
                pairs: [
                  { left: "Auditiva", right: "Não percebe se está acima ou abaixo" },
                  { left: "Técnica", right: "Percebe, mas a voz não obedece" },
                  { left: "De coordenação", right: "Acerta devagar, erra em frases rápidas ou com outras vozes" },
                ],
              },
              { type: "tip", text: "Dificuldade auditiva? Treine primeiro a escuta no Laboratório: grave e agudo, perceber desafinação. Técnica? Confira ar, tensão e se a nota está na sua região confortável." },
            ],
          },
          {
            titulo: "Acima ou abaixo?",
            tipo: "aplicar",
            blocos: [
              { type: "p", text: "Quem tende a cantar abaixo (“calando”) costuma estar com pouco ar ou cansado. Quem tende a cantar acima costuma estar com tensão ou ansiedade nas entradas." },
              {
                type: "compare",
                prompt: "As duas tentam cantar Mi, mas nenhuma acertou. Qual ficou acima?",
                options: [
                  { label: "acima", notes: ["E4"], cents: 40 },
                  { label: "abaixo", notes: ["E4"], cents: -40 },
                ],
                answer: 0,
                explain: "Ouvir a direção do erro é o primeiro passo para corrigir. Anote se a sua tendência é ficar acima ou abaixo.",
              },
              {
                type: "reveal",
                prompt: "Fim de um ensaio longo, e o naipe começa a “calar”. Qual pode ser a causa?",
                answer: "Cansaço e pouco ar costumam puxar a afinação para baixo. Uma pausa curta e respirações tranquilas ajudam mais do que cantar mais forte.",
              },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "order",
                prompt: "Coloque na ordem os passos para encontrar uma nota.",
                items: ["Ouvir a referência", "Imaginar o som em silêncio", "Cantar suave em “u”", "Ajustar devagar até o centro"],
              },
            ],
          },
        ],
        pratiqueSozinho: {
          passos: ["Treinador de afinação: 5 notas sustentadas por dia.", "Laboratório: “perceber desafinação” por 3 minutos.", "Anote se a sua tendência é ficar acima ou abaixo."],
          minutos: 10,
          frequencia: "5 vezes por semana",
        },
        errosComuns: [
          { erro: "Cantar antes de ouvir a nota por dentro.", correcao: "Ouça, imagine e só depois cante." },
          { erro: "Começar a nota muito forte.", correcao: "Comece suave; é mais fácil ajustar a altura com volume moderado." },
          { erro: "Desistir após uma tentativa errada.", correcao: "Afinação melhora com repetição curta e frequente. Compare a evolução por semanas, não por tentativas." },
          { erro: "Forçar notas fora da região confortável.", correcao: "Cante a nota em outra oitava ou escolha outra nota de treino." },
        ],
        seguranca: [...SEGURANCA_BASE, "A detecção pelo microfone é uma estimativa: ruído, eco e outros sons podem atrapalhar. Ela não é um diagnóstico."],
        criterioAvanco: "Acertar pelo menos 70% nas avaliações desta aula (percepção de desafinação e conceitos).",
      },
      exercises: [
        {
          slug: "afinacao-sustentar-notas",
          title: "Reproduzir e sustentar notas",
          instructions: "Ouça a nota e cante-a sustentando. Use fones de ouvido se possível.",
          type: "sing_note",
          config: { rounds: 4, holdSeconds: 3, toleranceCents: 25 },
          skill: "afinacao-nota",
          purpose: "pratica",
        },
        {
          slug: "afinacao-perceber-desafinacao",
          title: "Avaliação: afinada, acima ou abaixo?",
          instructions: "Ouça a referência e a segunda nota. Diga se a segunda está afinada, acima ou abaixo.",
          type: "tuning_check",
          config: { rounds: 8, cents: 45 },
          skill: "percepcao-afinacao",
          purpose: "avaliacao",
        },
        {
          slug: "afinacao-avaliacao-conceitos",
          title: "Avaliação: conceitos de afinação",
          instructions: "Responda sobre afinação.",
          type: "quiz",
          config: {
            questions: [
              { q: "Quantos cents há em um semitom?", options: ["100", "10", "50", "1200"], answer: 0 },
              { q: "Cantar a mesma nota uma oitava abaixo da referência é…", options: ["Afinado: é a mesma nota em outra oitava", "Desafinado", "Uma terça", "Um erro de ritmo"], answer: 0 },
              { q: "Uma pessoa percebe que está desafinada, mas a voz não obedece. Que tipo de dificuldade é mais provável?", options: ["Técnica ou de coordenação", "Auditiva", "De leitura", "Rítmica"], answer: 0 },
              { q: "O que fazer antes de cantar uma nota de referência?", options: ["Ouvir e imaginar o som por dentro", "Cantar o mais forte possível", "Prender a respiração", "Subir o queixo"], answer: 0 },
              { q: "Errar uma tentativa no treinador significa que a pessoa é desafinada?", options: ["Não: é preciso observar a tendência ao longo de vários dias", "Sim, sempre", "Sim, se for a primeira tentativa", "Depende do volume"], answer: 0 },
            ],
          },
          skill: "afinacao-nota",
          purpose: "avaliacao",
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      slug: "diccao-e-articulacao",
      title: "Dicção e articulação",
      summary: "Texto compreensível, vogais unificadas e consoantes claras.",
      level: 1,
      minutes: 15,
      skills: ["diccao-articulacao"],
      content: {
        objetivo:
          "Cantar com texto inteligível, unificando as vogais com o grupo e articulando as consoantes no tempo certo, sem quebrar o legato.",
        gancho: "Na música sacra, a letra é a mensagem. Se a congregação não entende as palavras, parte do propósito se perde. Vamos deixar cada palavra clara.",
        etapas: [
          {
            titulo: "Vogal é som, consoante é moldura",
            tipo: "descobrir",
            blocos: [
              { type: "p", text: "Cantando, sustentamos as vogais: é nelas que está o som. As consoantes aparecem rápidas e precisas, como molduras das vogais." },
              {
                type: "callout",
                icon: "olho",
                title: "Quadro e moldura",
                text: "A vogal é o quadro; a consoante, a moldura. A moldura precisa estar lá, nítida, mas ninguém vai ao museu para ver só a moldura.",
              },
              {
                type: "check",
                question: "Numa nota longa na palavra “Deus”, o que você sustenta?",
                options: ["O “ê”, colocando o “u” só no final", "O “s” final", "O “D” inicial", "O “u”"],
                answer: 0,
                explain: "Cante “Dê-us”: sustente o “ê” e coloque o “u” e o “s” só no último instante.",
              },
            ],
          },
          {
            titulo: "Cinco vogais, uma nota",
            tipo: "experimentar",
            blocos: [
              { type: "illustration", name: "vogais", caption: "Muda a vogal; a mandíbula quase não se mexe." },
              { type: "audio", label: "Nota para exercitar vogais (mi-mê-má-mô-mu)", notes: ["D4", "D4", "D4", "D4", "D4"], tempo: 80 },
              {
                type: "timer",
                instruction: "Fale e depois cante numa nota só: “mi – mê – má – mô – mu”. Mude apenas a vogal, sem mexer a mandíbula de forma exagerada.",
                seconds: 30,
              },
            ],
          },
          {
            titulo: "Ditongos sem pressa",
            tipo: "descobrir",
            blocos: [
              { type: "p", text: "Nos ditongos, a segunda vogal entra só no último instante: “mãe” vira “mããã-e”, com o “e” bem no fim." },
              {
                type: "trueFalse",
                items: [
                  { statement: "Em “mãe”, sustento o “ã” e coloco o “e” no final.", answer: true, explain: "A primeira vogal carrega a nota; a segunda só fecha a palavra." },
                  { statement: "Sustentar consoantes deixa a palavra mais clara (“Deusssss”).", answer: false, explain: "Consoante sustentada vira ruído. Sustente a vogal; a consoante é rápida." },
                  { statement: "Para articular bem, preciso fechar bastante a boca.", answer: false, explain: "A articulação vem de lábios e língua ágeis, não da mandíbula travada." },
                ],
              },
            ],
          },
          {
            titulo: "Consoantes no tempo certo",
            tipo: "descobrir",
            blocos: [
              { type: "p", text: "Consoantes iniciais: articule um pouco antes do tempo, para a vogal cair no tempo. Consoantes finais: no grupo, todos soltam o “s” ou o “r” juntos, no corte indicado pelo regente." },
              {
                type: "check",
                question: "Para a vogal cair exatamente no tempo, quando entra a consoante inicial?",
                options: ["Um pouco antes do tempo", "Exatamente no tempo", "Depois do tempo"],
                answer: 0,
                explain: "A consoante gasta um instante. Começando um pouco antes, a vogal, que carrega o som, cai certinha no tempo.",
              },
              { type: "tip", title: "E o “r”?", text: "Em português cantado, evite o “r” muito arrastado ou gutural. Prefira o “r” vibrante simples ou suave, conforme a orientação do grupo." },
            ],
          },
          {
            titulo: "Trava-línguas no ritmo",
            tipo: "experimentar",
            blocos: [
              { type: "rhythm", pattern: "e e e e e e e e", bpm: 80, label: "Ritmo para trava-línguas em colcheias" },
              { type: "timer", instruction: "No ritmo das colcheias: “Três pratos de trigo para três tigres tristes”. Sem tropeçar e sem pressa.", seconds: 30 },
              { type: "toolLink", tool: "metronomo", label: "Abrir o metrônomo para treinar trava-línguas" },
            ],
          },
          {
            titulo: "“Senhor” sem arrastar",
            tipo: "experimentar",
            blocos: [
              { type: "p", text: "Sustente “Se-” e “-nhô” e solte o “r” somente no final, no corte." },
              { type: "singAlong", instruction: "Cante “Se-nhôôô” nesta nota e solte o “r” só no último instante.", note: "D4", seconds: 4 },
              {
                type: "reveal",
                prompt: "Cinco pessoas soltam o “s” de “Deus”, cada uma num momento. Como isso soa para a congregação?",
                answer: "Como um chiado espalhado: “Deus-s-s-s-s”. Combinem o corte com o regente e soltem juntos, sem exagero.",
              },
            ],
          },
          {
            titulo: "Um naipe, uma vogal",
            tipo: "aplicar",
            blocos: [
              {
                type: "callout",
                icon: "ouvido",
                title: "Unidade de vogais",
                text: "Cinco pessoas cantando “é” de cinco jeitos soam como cinco vozes separadas. Combinem a forma da boca: lábios levemente arredondados ajudam a unificar o som.",
              },
              {
                type: "checklist",
                title: "Teste com um hino",
                items: ["Li a estrofe em voz alta, com calma", "Cantei com a mesma clareza da leitura", "Sustentei as vogais, não as consoantes", "Soltei as consoantes finais no tempo"],
              },
              { type: "toolLink", tool: "gravador", label: "Grave a estrofe: o texto está compreensível?" },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              {
                type: "match",
                prompt: "Ligue cada elemento à forma de cantá-lo.",
                pairs: [
                  { left: "Vogal", right: "Sustentada: carrega o som" },
                  { left: "Consoante inicial", right: "Um pouco antes do tempo" },
                  { left: "Consoante final", right: "Todos juntos, no corte" },
                  { left: "Ditongo", right: "Segunda vogal só no fim" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: {
          passos: ["2 minutos de trava-línguas com metrônomo.", "Cante uma estrofe sustentando as vogais e cortando as consoantes finais no tempo.", "Grave e confira se o texto está compreensível."],
          minutos: 6,
          frequencia: "3 vezes por semana",
        },
        errosComuns: [
          { erro: "Sustentar consoantes (“mmmmãe”, “Deusssss”).", correcao: "Sustente a vogal; a consoante é rápida." },
          { erro: "Fechar a boca demais para articular.", correcao: "A articulação é feita com lábios e língua ágeis, não com a mandíbula travada." },
          { erro: "Cada pessoa soltar o “s” final num momento diferente.", correcao: "Combine o corte com o regente e solte junto, sem exagero." },
        ],
        seguranca: [...SEGURANCA_BASE],
        criterioAvanco: "Acertar pelo menos 70% da avaliação e gravar uma estrofe com o texto compreensível.",
      },
      exercises: [
        {
          slug: "diccao-pratica",
          title: "Prática de dicção",
          instructions: "Faça os exercícios e marque o que conseguiu com clareza.",
          type: "self_check",
          config: { minutes: 6, items: ["Vogais puras numa nota só", "Trava-língua no ritmo sem tropeçar", "Consoante final no tempo certo", "Estrofe gravada com texto claro"] },
          skill: "diccao-articulacao",
          purpose: "pratica",
        },
        {
          slug: "diccao-avaliacao",
          title: "Avaliação: dicção cantada",
          instructions: "Responda sobre dicção e articulação.",
          type: "quiz",
          config: {
            questions: [
              { q: "Ao cantar, o som é sustentado principalmente nas…", options: ["Vogais", "Consoantes", "Pausas", "Respirações"], answer: 0 },
              { q: "Como cantar o ditongo de “mãe” numa nota longa?", options: ["Sustentar “mã” e colocar o “e” no final", "Sustentar o “e”", "Alternar “ã” e “e”", "Cantar só o “m”"], answer: 0 },
              { q: "Para que a vogal caia exatamente no tempo, a consoante inicial deve ser articulada…", options: ["Um pouco antes do tempo", "Depois do tempo", "Junto com a respiração seguinte", "Sem preocupação"], answer: 0 },
              { q: "Por que unificar as vogais no naipe?", options: ["Para o naipe soar como uma só voz", "Para cantar mais rápido", "Para cantar mais agudo", "Não é necessário"], answer: 0 },
            ],
          },
          skill: "diccao-articulacao",
          purpose: "avaliacao",
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      slug: "extensao-tessitura-registros",
      title: "Extensão, tessitura e registros",
      summary: "Conhecer a própria região confortável e transitar entre registros sem forçar.",
      level: 2,
      minutes: 25,
      skills: ["registros-extensao"],
      content: {
        objetivo:
          "Diferenciar extensão e tessitura, conhecer os registros vocais e identificar a própria região confortável sem forçar notas extremas.",
        gancho: "Sua voz é de soprano, contralto, tenor ou baixo? Antes de responder, vamos descobrir onde ela canta feliz, sem esforço.",
        etapas: [
          {
            titulo: "Extensão × tessitura",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "extensao-tessitura", caption: "A tessitura fica dentro da extensão." },
              { type: "p", text: "Extensão é tudo o que você consegue cantar, do mais grave ao mais agudo, inclusive com esforço. Tessitura é a região em que a voz canta com conforto, boa qualidade e por bastante tempo." },
              {
                type: "callout",
                icon: "ideia",
                title: "Pense numa casa",
                text: "A extensão é a casa inteira, até o sótão apertado. A tessitura é a sala onde você mora e passa o dia.",
              },
              {
                type: "check",
                question: "Para escolher a sua parte num arranjo, o que conta mais?",
                options: ["A tessitura, onde canto com conforto", "A nota mais aguda que alcanço", "A nota mais grave que alcanço"],
                answer: 0,
                explain: "Uma música inteira pede conforto do começo ao fim. As notas extremas fazem parte da extensão, não da tessitura.",
              },
            ],
          },
          {
            titulo: "Os registros da voz",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "registros", caption: "Peito, mista e cabeça: a vibração muda de lugar." },
              {
                type: "match",
                prompt: "Ligue cada registro à sua característica.",
                pairs: [
                  { left: "Voz de peito", right: "Vibra no peito, som mais denso, grave e médio" },
                  { left: "Voz de cabeça", right: "Vibra no rosto e na cabeça, som mais leve, agudo" },
                  { left: "Voz mista", right: "Equilíbrio entre os dois, transição suave" },
                  { left: "Região de passagem", right: "Notas em que a voz muda de registro" },
                ],
              },
            ],
          },
          {
            titulo: "Sirene: sinta a mudança",
            tipo: "experimentar",
            blocos: [
              { type: "p", text: "Faça a sirene em “u”, do grave ao agudo, bem suave. Observe onde a sensação de vibração muda do peito para a cabeça." },
              { type: "timer", instruction: "Sirene suave em “u”: suba e desça devagar, sem empurrar.", seconds: 10, reps: 3 },
              {
                type: "reveal",
                prompt: "Sua voz deu uma “quebrada” no meio da sirene?",
                answer: "Normal! É a região de passagem entre registros. Com treino suave, a transição fica lisa. A identificação precisa da passagem deve ser feita com um professor.",
              },
            ],
          },
          {
            titulo: "Atravesse a passagem",
            tipo: "ouvir",
            blocos: [
              { type: "audio", label: "Deslize por arpejo (vozes femininas)", notes: ["C4", "E4", "G4", "C5", "G4", "E4", "C4"], tempo: 100 },
              { type: "audio", label: "Deslize por arpejo (vozes masculinas)", notes: ["C3", "E3", "G3", "C4", "G3", "E3", "C3"], tempo: 100 },
              { type: "p", text: "Cante o arpejo Dó–Mi–Sol–Dó em “u”, passando pela região de passagem com volume suave." },
              {
                type: "check",
                question: "Subindo o arpejo, a voz começa a pesar. O que fazer?",
                options: ["Deixar a voz ficar mais leve, sem empurrar", "Empurrar a voz de peito mais forte", "Erguer o queixo para alcançar"],
                answer: 0,
                explain: "Ao subir, a voz fica mais leve: a voz de cabeça e a voz mista existem para isso. Empurrar a voz de peito cansa e pode machucar.",
              },
            ],
          },
          {
            titulo: "Mapeie a sua região",
            tipo: "experimentar",
            blocos: [
              { type: "keyboard", from: "E2", to: "C6", highlight: ["C4"], label: "Teclado de referência (Dó4 = dó central)" },
              { type: "p", text: "No mapeamento, cante cada nota proposta e marque: confortável, com esforço ou não alcanço." },
              { type: "warning", text: "Pare de subir ou descer no primeiro sinal de esforço. As notas “com esforço” fazem parte da extensão, não da tessitura." },
              { type: "toolLink", tool: "extensao", label: "Abrir o mapeamento da região confortável" },
            ],
          },
          {
            titulo: "Sem competição",
            tipo: "aplicar",
            blocos: [
              {
                type: "callout",
                icon: "coracao",
                title: "O que importa no ministério",
                text: "Ninguém canta melhor por alcançar a nota mais aguda ou mais grave. O que importa é cantar a sua parte com conforto e qualidade. Exercícios extremos podem machucar a voz.",
              },
              {
                type: "check",
                question: "Ana alcança as notas do soprano, mas com esforço. No contralto, canta a música inteira com conforto. Onde ela deve cantar, por enquanto?",
                options: ["No contralto, onde está a tessitura dela", "No soprano, já que alcança as notas", "Alternando, para treinar o agudo no culto"],
                answer: 0,
                explain: "A parte certa é a da região confortável durante a música inteira. Com o estudo, isso pode mudar.",
              },
            ],
          },
          {
            titulo: "Juntando tudo",
            tipo: "checar",
            blocos: [
              { type: "p", text: "Soprano, mezzo-soprano, contralto, tenor, barítono e baixo: a classificação considera tessitura, timbre e passagens. Aqui ela sempre começa provisória, porque vozes se desenvolvem com o estudo." },
              {
                type: "trueFalse",
                items: [
                  { statement: "Minha classificação vocal é definitiva desde o primeiro teste.", answer: false, explain: "Ela começa provisória e pode ser revista pelo professor." },
                  { statement: "A voz “falhar” na passagem é um defeito.", answer: false, explain: "É uma transição natural, que se coordena com treino suave." },
                  { statement: "Ao sentir esforço numa nota, devo parar e voltar à região confortável.", answer: true, explain: "Não procure as notas extremas. Pare no primeiro sinal de esforço." },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: {
          passos: ["Sirene suave em “u” por 1 minuto.", "Arpejos leves atravessando a passagem em volume suave.", "Refaça o mapeamento da região a cada 4 semanas para ver a evolução."],
          minutos: 6,
          frequencia: "3 vezes por semana",
        },
        errosComuns: [
          { erro: "Empurrar a voz de peito cada vez mais alto.", correcao: "Deixe a voz ficar mais leve ao subir; a voz de cabeça e a voz mista existem para isso." },
          { erro: "Achar que a voz “falhar” na passagem é defeito.", correcao: "É uma transição natural que se coordena com treino suave." },
          { erro: "Escolher a parte do arranjo pela nota mais aguda que alcança.", correcao: "Escolha pela região onde canta com conforto durante a música inteira." },
        ],
        seguranca: [...SEGURANCA_BASE, "Não procure as notas extremas: pare no primeiro sinal de esforço."],
        criterioAvanco: "Acertar pelo menos 70% da avaliação e concluir um mapeamento da região confortável.",
      },
      exercises: [
        {
          slug: "registros-avaliacao",
          title: "Avaliação: extensão, tessitura e registros",
          instructions: "Responda sobre extensão, tessitura e registros.",
          type: "quiz",
          config: {
            questions: [
              { q: "Qual a diferença entre extensão e tessitura?", options: ["Extensão é tudo o que se alcança; tessitura é a região confortável", "São a mesma coisa", "Tessitura é a nota mais aguda", "Extensão é só a região grave"], answer: 0 },
              { q: "Para escolher a sua parte num arranjo, o mais importante é…", options: ["A tessitura (região confortável)", "A nota mais aguda que você alcança", "A nota mais grave que você alcança", "Cantar a melodia sempre"], answer: 0 },
              { q: "A voz “quebrar” ao passar do grave para o agudo indica…", options: ["Uma região de passagem entre registros, que pode ser coordenada com treino", "Que a pessoa não pode cantar", "Uma doença", "Que deve cantar mais forte"], answer: 0 },
              { q: "A classificação vocal nesta plataforma começa como…", options: ["Provisória, podendo ser revista pelo professor", "Definitiva", "Obrigatória para cantar", "Baseada só na nota mais aguda"], answer: 0 },
              { q: "Ao sentir esforço numa nota aguda, você deve…", options: ["Parar de subir e voltar à região confortável", "Insistir até conseguir", "Cantar mais forte", "Erguer o queixo"], answer: 0 },
            ],
          },
          skill: "registros-extensao",
          purpose: "avaliacao",
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      slug: "interpretacao-musical",
      title: "Interpretação musical",
      summary: "Dinâmica, fraseado, legato e intenção do texto sacro.",
      level: 2,
      minutes: 20,
      skills: ["interpretacao"],
      content: {
        objetivo:
          "Usar dinâmica, fraseado, legato e articulação para comunicar o sentido do texto, equilibrando emoção, técnica e inteligibilidade, em unidade com o grupo.",
        gancho: "A mesma melodia pode soar como uma oração íntima ou como um hino de vitória. A diferença está em como você canta. Vamos dar sentido às notas.",
        etapas: [
          {
            titulo: "Comece pelo texto",
            tipo: "descobrir",
            blocos: [
              { type: "p", text: "Interpretar é dar sentido às notas. O ponto de partida é sempre o texto: o que ele diz, para quem e com que sentimento." },
              {
                type: "callout",
                icon: "coracao",
                title: "Cante o texto, não só as notas",
                text: "O rosto e a expressão também comunicam. Quem ouve percebe quando você canta com intenção.",
              },
              {
                type: "check",
                question: "Qual é o ponto de partida para interpretar um hino?",
                options: ["O sentido do texto", "O volume máximo da voz", "A nota mais aguda", "O andamento mais rápido possível"],
                answer: 0,
                explain: "Dinâmica, fraseado e articulação servem ao texto. Primeiro entenda o que se diz; depois decida como cantar.",
              },
            ],
          },
          {
            titulo: "O volume conta uma história",
            tipo: "descobrir",
            blocos: [
              { type: "illustration", name: "dinamica", caption: "Do pp ao ff, com crescendo e decrescendo." },
              {
                type: "list",
                items: ["Dinâmica: variações de intensidade, do pp (pianíssimo) e p (piano, suave) ao f (forte) e ff.", "Crescendo: aumentar aos poucos. Decrescendo: diminuir aos poucos."],
              },
              { type: "order", prompt: "Ordene do mais suave para o mais forte.", items: ["pp", "p", "mp", "mf", "f", "ff"] },
            ],
          },
          {
            titulo: "Notas de mãos dadas",
            tipo: "ouvir",
            blocos: [
              { type: "p", text: "Legato é cantar as notas ligadas, sem buracos entre elas. É o padrão do canto coral sacro. Staccato e acentos são articulações curtas ou marcadas, usadas para efeito de texto." },
              { type: "audio", label: "Frase em legato (Sol–Lá–Si–Dó–Si–Lá–Sol)", notes: ["G4", "A4", "B4", "C5", "B4", "A4", "G4"], tempo: 72 },
              {
                type: "check",
                question: "Qual descrição combina com o legato?",
                options: ["Notas ligadas, sem interrupções", "Notas curtas e separadas", "Notas sempre acentuadas"],
                answer: 0,
                explain: "No legato, o som passa de uma nota à outra como um fio contínuo. Notas curtas e separadas são o staccato.",
              },
            ],
          },
          {
            titulo: "Dê direção à frase",
            tipo: "experimentar",
            blocos: [
              { type: "p", text: "Cante a frase anterior em “lu”, em legato (vozes graves, uma oitava abaixo). Depois cresça até a nota mais aguda, o Dó, e diminua até o fim." },
              { type: "timer", instruction: "Primeira vez: só legato. Segunda: com crescendo até o Dó e decrescendo até o fim.", seconds: 15, reps: 2 },
              { type: "tip", title: "Emoção não é volume", text: "Momentos suaves também emocionam. Planeje pelo menos um crescendo e um momento suave em cada estrofe." },
            ],
          },
          {
            titulo: "Para onde vai a frase?",
            tipo: "descobrir",
            blocos: [
              { type: "p", text: "Cada frase tem uma direção, normalmente para uma palavra ou sílaba importante. Evite acentuar sílabas fracas: respeite a acentuação natural da fala." },
              {
                type: "check",
                question: "Na palavra “glória”, qual sílaba recebe o acento natural?",
                options: ["GLÓ", "ri", "a"],
                answer: 0,
                explain: "Na fala dizemos “GLÓ-ri-a”. Cantando, mantenha esse acento e não empurre as sílabas fracas do fim.",
              },
              {
                type: "reveal",
                prompt: "Leia: “Grande é o Senhor e mui digno de louvor”. Para qual palavra você dirigiria a frase?",
                answer: "Não há uma única resposta: muitos escolheriam “grande” ou “digno”. O importante é decidir, combinar com o grupo e conduzir a frase até ela.",
              },
            ],
          },
          {
            titulo: "Unidade sonora",
            tipo: "aplicar",
            blocos: [
              {
                type: "callout",
                icon: "ouvido",
                title: "Todos juntos",
                text: "No grupo, todos crescem, respiram e cortam juntos. Emoção individual sem unidade vira desequilíbrio; técnica sem emoção vira execução fria. O regente conduz esse equilíbrio.",
              },
              {
                type: "trueFalse",
                items: [
                  { statement: "Quem sente mais a música deve cantar mais forte que o grupo.", answer: false, explain: "Emoção individual sem unidade vira desequilíbrio. A interpretação é combinada." },
                  { statement: "Cantar tudo no mesmo volume deixa a música mais bonita.", answer: false, explain: "Sem variação de dinâmica a música fica plana. Planeje crescendos e momentos suaves." },
                  { statement: "Momentos suaves também podem emocionar.", answer: true, explain: "Emoção não depende de volume. Um pianíssimo bem cantado toca muito." },
                ],
              },
            ],
          },
          {
            titulo: "Sua vez: prepare uma estrofe",
            tipo: "aplicar",
            blocos: [
              {
                type: "checklist",
                title: "Passo a passo",
                items: ["Sublinhei a palavra mais importante de cada frase", "Marquei respirações e dinâmicas na letra", "Cantei dirigindo cada frase para a palavra sublinhada", "Gravei e ouvi: a interpretação combina com o texto?"],
              },
              { type: "harmonyLink", arrangement: "hino-alegria-unissono", label: "Pratique dinâmica no “Hino da Alegria” em uníssono" },
              { type: "toolLink", tool: "gravador", label: "Gravar a estrofe" },
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
                  { left: "p", right: "Piano: suave" },
                  { left: "f", right: "Forte" },
                  { left: "Crescendo", right: "Aumentar aos poucos" },
                  { left: "Legato", right: "Notas ligadas" },
                  { left: "Staccato", right: "Notas curtas" },
                ],
              },
            ],
          },
        ],
        pratiqueSozinho: {
          passos: ["Escolha uma música do repertório e marque dinâmicas e respirações na letra.", "Cante em três versões: sem dinâmica, com a dinâmica marcada e com exagero. Compare.", "Leve as marcações para discutir no ensaio."],
          minutos: 10,
          frequencia: "2 vezes por semana",
        },
        errosComuns: [
          { erro: "Acentuar a última sílaba das palavras (“Se-NHOR” em notas longas sem intenção).", correcao: "Respeite a acentuação natural da fala." },
          { erro: "Cantar tudo no mesmo volume.", correcao: "Planeje pelo menos um crescendo e um momento suave em cada estrofe." },
          { erro: "Confundir emoção com volume excessivo.", correcao: "Momentos suaves também emocionam; o grupo precisa de equilíbrio." },
        ],
        seguranca: [...SEGURANCA_BASE],
        criterioAvanco: "Acertar pelo menos 70% da avaliação e apresentar ao professor uma estrofe com dinâmicas e respirações marcadas.",
      },
      exercises: [
        {
          slug: "interpretacao-avaliacao",
          title: "Avaliação: elementos de interpretação",
          instructions: "Responda sobre interpretação musical.",
          type: "quiz",
          config: {
            questions: [
              { q: "O que significa “p” numa partitura?", options: ["Piano: suave", "Pausa", "Pulsação", "Passagem"], answer: 0 },
              { q: "Crescendo significa…", options: ["Aumentar a intensidade aos poucos", "Cantar mais agudo", "Acelerar", "Diminuir a intensidade"], answer: 0 },
              { q: "Legato é…", options: ["Cantar as notas ligadas, sem interrupções", "Cantar notas curtas", "Cantar sem texto", "Cantar mais forte"], answer: 0 },
              { q: "Qual deve ser o ponto de partida da interpretação de um hino?", options: ["O sentido do texto", "O volume máximo da voz", "A nota mais aguda", "O andamento mais rápido possível"], answer: 0 },
              { q: "Num grupo, a interpretação deve ser…", options: ["Combinada, com unidade de dinâmicas, respirações e cortes", "Individual, cada um do seu jeito", "Sempre forte", "Definida por quem canta mais alto"], answer: 0 },
            ],
          },
          skill: "interpretacao",
          purpose: "avaliacao",
        },
      ],
    },
  ],
};
