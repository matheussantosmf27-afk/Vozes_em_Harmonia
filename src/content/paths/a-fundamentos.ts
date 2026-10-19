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
        explicacao: [
          {
            type: "p",
            text: "A voz não acontece só na garganta: ela depende do corpo inteiro. Quando o corpo está alinhado, os músculos da respiração trabalham com liberdade e a laringe não precisa compensar. Quando há tensão (ombros erguidos, queixo para frente, joelhos travados), o som fica mais apertado e cansamos mais rápido.",
          },
          {
            type: "list",
            items: [
              "Pés afastados na largura do quadril, peso distribuído entre calcanhares e dedos.",
              "Joelhos destravados (nem dobrados, nem esticados ao extremo).",
              "Quadril em posição neutra, sem empinar nem encaixar demais.",
              "Coluna longa e peito aberto, sem estufar ou arquear as costas.",
              "Ombros soltos, para baixo e levemente para trás.",
              "Cabeça equilibrada sobre a coluna, queixo paralelo ao chão.",
              "Mandíbula solta, língua relaxada encostando nos dentes de baixo.",
            ],
          },
          {
            type: "tip",
            title: "Postura não é rigidez",
            text: "Pense em “alto e solto”: imagine um fio puxando suavemente o topo da cabeça para cima, enquanto ombros e braços pesam para baixo. Se você precisa fazer força para manter a postura, ela está rígida demais.",
          },
          {
            type: "p",
            text: "Sentado(a), use a parte da frente da cadeira, com os dois pés apoiados no chão e a coluna sem encostar no encosto. Assim o abdômen fica livre para a respiração — o que é importante nos ensaios longos.",
          },
        ],
        demonstracao: [
          {
            type: "p",
            text: "Use as notas abaixo para fazer o “hum” de boca fechada. Escolha a que soar mais próxima da sua fala: o objetivo é sentir vibração nos lábios e no rosto, sem esforço.",
          },
          { type: "audio", label: "Nota para “hum” — vozes femininas (Lá3)", notes: ["A3"], tempo: 30 },
          { type: "audio", label: "Nota para “hum” — vozes masculinas (Lá2)", notes: ["A2"], tempo: 30 },
          { type: "toolLink", tool: "gravador", label: "Grave-se cantando uma frase curta em postura “largada” e depois alinhada, e compare" },
        ],
        exercicioGuiado: {
          intro: "Faça devagar, prestando atenção às sensações. Leva cerca de 5 minutos.",
          passos: [
            "De pé, feche os olhos e perceba o peso do corpo nos pés. Balance levemente para frente e para trás até encontrar o centro.",
            "Destrave os joelhos e imagine o fio no topo da cabeça alongando a coluna.",
            "Eleve os ombros até as orelhas ao inspirar e deixe-os cair ao expirar. Repita 3 vezes; depois role os ombros para trás 5 vezes.",
            "Com as pontas dos dedos, massageie a musculatura da bochecha perto da articulação da mandíbula, deixando a boca entreaberta.",
            "Com a boca fechada e a mandíbula solta por dentro, faça um “hum” na nota de referência por 5 segundos. Sinta a vibração nos lábios.",
            "Sente-se na frente da cadeira e repita o “hum”, mantendo o mesmo alinhamento.",
          ],
        },
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
        explicacao: [
          {
            type: "p",
            text: "As pregas vocais são um tecido delicado coordenado por pequenos músculos. Assim como um atleta não corre sem alongar, quem canta precisa preparar a musculatura aos poucos: do mais suave para o mais intenso, da região média para as extremidades, do som fechado para o aberto.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Corpo (1 min): alongar pescoço lateralmente, rolar ombros, soltar a mandíbula.",
              "Respiração (1 min): inspirar pelo nariz expandindo costelas; soltar o ar em “sss” contínuo por 8 a 12 tempos.",
              "Vibração (2 min): vibração de lábios (“brrr”) ou de língua (“trrr”) em notas sustentadas e pequenas escalas.",
              "Deslizes (2 min): sirene suave em “u” do grave ao agudo confortável e de volta, sem empurrar.",
              "Escalas em vogais (2 min): cinco notas (Dó–Ré–Mi–Fá–Sol–Fá–Mi–Ré–Dó) em “mi”, “mê”, “má”, “mô”, “mu”, subindo meio-tom por vez até o limite confortável.",
              "Articulação (1 min): trava-línguas e as consoantes do repertório do dia.",
            ],
          },
          {
            type: "tip",
            title: "Por que a vibração de lábios funciona",
            text: "Ela cria uma leve resistência na saída do ar que equilibra a pressão sobre as pregas vocais. É um dos exercícios mais seguros para começar o dia e para recuperar a voz depois do ensaio.",
          },
          {
            type: "p",
            text: "O desaquecimento leva a voz de volta à fala: após o ensaio, faça 1 minuto de vibração de lábios em deslizes descendentes e alguns bocejos-suspiros suaves, terminando na sua altura de fala.",
          },
        ],
        demonstracao: [
          { type: "audio", label: "Escala de cinco notas em Dó (vozes femininas)", notes: ["C4", "D4", "E4", "F4", "G4", "F4", "E4", "D4", "C4"], tempo: 120 },
          { type: "audio", label: "Escala de cinco notas em Dó (vozes masculinas)", notes: ["C3", "D3", "E3", "F3", "G3", "F3", "E3", "D3", "C3"], tempo: 120 },
          { type: "audio", label: "Arpejo para deslize (Dó–Mi–Sol–Mi–Dó)", notes: ["C4", "E4", "G4", "E4", "C4"], tempo: 100 },
          { type: "toolLink", tool: "aquecimento", label: "Abrir a rotina guiada de aquecimento com temporizador" },
        ],
        exercicioGuiado: {
          intro: "Siga a rotina guiada na página “Treinar minha voz”. Ela toca as notas de referência e avança automaticamente.",
          passos: [
            "Faça os alongamentos de pescoço e ombros (1 minuto).",
            "Respire em 4 tempos e solte o ar em “sss” por 8 tempos. Repita 4 vezes.",
            "Vibração de lábios na escala de cinco notas, começando numa nota média.",
            "Sirene em “u”: suba e desça suavemente, como um elevador, sem forçar o topo.",
            "Escala de cinco notas em “mi” e “má”, subindo meio-tom a cada repetição enquanto estiver confortável.",
            "Termine com um trava-língua: “O rato roeu a roupa do rei de Roma”, articulado sem pressa.",
          ],
        },
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
        explicacao: [
          {
            type: "p",
            text: "Cantar exige mais ar e mais controle do que falar. Na inspiração, o diafragma desce e as costelas se expandem — por isso sentimos a cintura e as costas se abrirem. Na expiração cantada, o desafio é soltar o ar aos poucos, de forma constante, sem prender e sem empurrar.",
          },
          {
            type: "list",
            items: [
              "Inspire pelo nariz quando houver tempo e pela boca nas respirações rápidas, sem barulho.",
              "Sinta a expansão na cintura, nas costelas laterais e nas costas — não nos ombros.",
              "Ao cantar, mantenha a sensação de “abertura” das costelas por mais tempo, em vez de esvaziar de uma vez.",
              "Não encha o pulmão ao máximo: ar demais gera tensão. Inspire o necessário para a frase.",
            ],
          },
          {
            type: "p",
            text: "Fraseado é a forma como conduzimos uma frase musical do início ao fim. Respirar no meio de uma palavra ou de uma ideia quebra o sentido do texto. Por isso marcamos na partitura (com uma vírgula ou um “V”) onde respirar, normalmente nas pausas, nas vírgulas do texto e no fim das frases.",
          },
          {
            type: "tip",
            title: "Respiração em grupo",
            text: "Num coral, frases muito longas podem ser cantadas com “respiração escalonada”: cada pessoa respira em um lugar diferente, discretamente, para que o som do naipe nunca pare. O diretor indica quando usar.",
          },
        ],
        demonstracao: [
          { type: "rhythm", pattern: "q q q q q q q q", bpm: 60, label: "Pulsação lenta (60 bpm) para contar a respiração" },
          { type: "audio", label: "Frase para sustentar (vozes femininas)", notes: ["G4", "G4", "A4", "G4", "F4", "E4", "D4", "C4"], tempo: 66 },
          { type: "audio", label: "Frase para sustentar (vozes masculinas)", notes: ["G3", "G3", "A3", "G3", "F3", "E3", "D3", "C3"], tempo: 66 },
          { type: "toolLink", tool: "metronomo", label: "Abrir o metrônomo para contar os tempos" },
        ],
        exercicioGuiado: {
          intro: "Use o metrônomo a 60 bpm (um tempo por segundo).",
          passos: [
            "Mãos na cintura, polegares para trás: inspire em 4 tempos sentindo as mãos se afastarem.",
            "Solte o ar em “sss” constante por 8 tempos. Depois tente 12 e 16, sem esvaziar de uma vez no início.",
            "Repita com “fff” e depois com “vvv” (com som), mantendo a mesma constância.",
            "Cante a frase de demonstração em “lu”, respirando somente no início. Se faltar ar, cante mais suave em vez de mais forte.",
            "Escolha um hino conhecido, escreva a letra de uma estrofe e marque com “V” onde vai respirar.",
          ],
        },
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
        explicacao: [
          {
            type: "p",
            text: "A emissão é o início do som. Ela pode ser soprosa (sai muito ar e pouca nota), apertada (a garganta fecha e o som fica duro) ou equilibrada (o som começa limpo, com o ar e as pregas vocais coordenados). O objetivo é a emissão equilibrada.",
          },
          {
            type: "p",
            text: "Ressonância é a amplificação do som nas cavidades acima das pregas vocais: garganta, boca e cavidade nasal. Ajustes pequenos — espaço na boca, posição da língua, a sensação de som “à frente” no rosto — fazem a voz ser ouvida com clareza sem gritar.",
          },
          {
            type: "list",
            items: [
              "Ataque equilibrado: imagine dizer “ah” suavemente, como quem concorda com algo agradável.",
              "Espaço interno: a sensação do início de um bocejo, com o palato mole elevado, sem abaixar a língua à força.",
              "Som à frente: no “hum” e no “nhã”, sinta vibração nos lábios, nariz e maçãs do rosto.",
              "Volume vem do equilíbrio entre ar e ressonância, não de apertar a garganta.",
            ],
          },
          {
            type: "warning",
            text: "Rouquidão frequente, dor ou sensação de “bola” na garganta não são normais. Interrompa o exercício e procure um profissional de saúde (otorrinolaringologista ou fonoaudiólogo). Esta plataforma não faz diagnóstico.",
          },
        ],
        demonstracao: [
          { type: "audio", label: "Nota sustentada para “hum → á” (vozes femininas)", notes: ["E4"], tempo: 20 },
          { type: "audio", label: "Nota sustentada para “hum → á” (vozes masculinas)", notes: ["E3"], tempo: 20 },
          { type: "audio", label: "Padrão “nhã-nhã-nhã” (Sol–Fá–Mi–Ré–Dó)", notes: ["G4", "F4", "E4", "D4", "C4"], tempo: 100 },
          { type: "toolLink", tool: "afinador", label: "Abrir o treinador de afinação para sustentar a nota" },
        ],
        exercicioGuiado: {
          passos: [
            "Diga “ã-hã” como quem concorda. Repita cantando numa nota confortável: esse é o ataque equilibrado.",
            "Experimente um “ah” soproso (com muito ar) e um “ah” apertado. Depois volte ao equilibrado e perceba a diferença.",
            "Faça “hum” na nota de referência e abra para “á” sem mudar a sensação de vibração à frente: “hummmm-á”.",
            "Cante “nhã-nhã-nhã” descendo cinco notas. Depois cante a mesma melodia em “lá”, mantendo o brilho.",
            "Cante uma frase de hino em volume médio e depois mais forte, apenas aumentando o ar e o espaço — sem apertar.",
          ],
        },
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
        explicacao: [
          {
            type: "p",
            text: "Afinar é fazer a frequência da sua voz coincidir com a nota esperada. Cantar afinado e cantar com boa qualidade vocal são coisas diferentes: uma voz bonita pode estar desafinada, e uma voz simples pode estar perfeitamente afinada. No grupo, a afinação é o que faz os acordes soarem limpos.",
          },
          {
            type: "p",
            text: "A diferença entre duas alturas muito próximas é medida em cents: 100 cents são um semitom (de uma tecla para a vizinha no teclado). Diferenças de até cerca de 10 a 20 cents passam despercebidas para a maioria das pessoas; acima de 25 a 30 cents já soam “fora”.",
          },
          {
            type: "list",
            items: [
              "Dificuldade auditiva: a pessoa não percebe se está acima ou abaixo. Treine primeiro a escuta (Laboratório: grave e agudo, perceber desafinação).",
              "Dificuldade técnica: percebe, mas a voz não obedece (falta de ar, tensão, nota fora da região confortável).",
              "Dificuldade de coordenação: acerta devagar, mas erra em frases rápidas ou com outras vozes soando.",
            ],
          },
          {
            type: "tip",
            title: "Como encontrar a nota",
            text: "Ouça a referência em silêncio, imagine o som por dentro e só então cante, suave, numa vogal fechada (“u”). Se a nota estiver longe da sua região, cante-a uma oitava abaixo ou acima: a mesma nota em outra oitava também está afinada.",
          },
          {
            type: "p",
            text: "Quem tende a cantar abaixo (“calando”) costuma estar com pouco ar ou cansado; quem tende a cantar acima costuma estar com tensão ou ansiedade nas entradas. Uma única tentativa não diz que alguém é “desafinado”: observe a tendência ao longo de vários dias.",
          },
        ],
        demonstracao: [
          { type: "audio", label: "Nota de referência Dó4", notes: ["C4"], tempo: 25 },
          { type: "audio", label: "Mesma nota em duas oitavas (Dó3 e Dó4)", notes: ["C3", "C4"], tempo: 50 },
          { type: "keyboard", from: "C3", to: "C5", highlight: ["C3", "C4", "C5"], label: "As notas Dó em três oitavas" },
          { type: "toolLink", tool: "afinador", label: "Abrir o treinador de afinação com microfone" },
        ],
        exercicioGuiado: {
          passos: [
            "Toque a referência, ouça em silêncio por 2 segundos e cante “u” suave na mesma altura.",
            "No treinador de afinação, sustente a nota e observe o ponteiro. Ajuste devagar até ficar no centro.",
            "Cante de propósito um pouco acima e depois um pouco abaixo, e volte ao centro. Isso treina o controle.",
            "Repita com três notas diferentes dentro da sua região confortável.",
            "Faça o exercício de percepção: ouça se a segunda nota está afinada, acima ou abaixo.",
          ],
        },
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
        explicacao: [
          {
            type: "p",
            text: "Na música sacra, o texto é a mensagem. Se a congregação não entende as palavras, perdemos parte do propósito. Cantando, sustentamos as vogais — é nelas que está o som — e as consoantes aparecem rápidas e precisas, como “molduras” das vogais.",
          },
          {
            type: "list",
            items: [
              "Vogais: sustente a vogal pura. Em “Deus”, cante “Dê-us”, mantendo o “ê” e colocando o “u” só no final.",
              "Ditongos: a segunda vogal entra no último instante (“mãe” = “mã-e”, com o “e” bem no fim).",
              "Consoantes finais: no grupo, todos devem soltar o “s” ou o “r” final juntos, exatamente no corte indicado pelo regente.",
              "Consoantes iniciais: ataque-as um pouco antes do tempo para que a vogal caia no tempo.",
              "Em português cantado, evite o “r” muito arrastado ou gutural; prefira o “r” vibrante simples ou suave, conforme a orientação do grupo.",
            ],
          },
          {
            type: "tip",
            title: "Unidade de vogais",
            text: "Num naipe, cinco pessoas cantando “é” de cinco jeitos soam como cinco vozes separadas. Combinem a forma da boca: lábios levemente arredondados ajudam a unificar o som.",
          },
        ],
        demonstracao: [
          { type: "audio", label: "Nota para exercitar vogais (mi-mê-má-mô-mu)", notes: ["D4", "D4", "D4", "D4", "D4"], tempo: 80 },
          { type: "rhythm", pattern: "e e e e e e e e", bpm: 80, label: "Ritmo para trava-línguas em colcheias" },
        ],
        exercicioGuiado: {
          passos: [
            "Fale e depois cante numa nota só: “mi – mê – má – mô – mu”, mudando apenas a vogal, sem mexer a mandíbula de forma exagerada.",
            "Trava-línguas no ritmo de colcheias: “Três pratos de trigo para três tigres tristes”.",
            "Cante a palavra “Senhor” em duas notas: sustente “Se-” e “-nhô” e solte o “r” somente no final.",
            "Leia em voz alta a primeira estrofe de um hino, com calma, articulando bem. Depois cante mantendo a mesma clareza.",
          ],
        },
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
        explicacao: [
          {
            type: "p",
            text: "Extensão vocal é o conjunto de todas as notas que uma pessoa consegue produzir, da mais grave à mais aguda — inclusive as que soam com esforço. Tessitura é a região em que a voz canta com conforto, boa qualidade e por bastante tempo. Para escolher a voz num arranjo, a tessitura é muito mais importante que a extensão.",
          },
          {
            type: "list",
            items: [
              "Voz de peito: sensação de vibração no peito, som mais denso, usada nas regiões grave e média.",
              "Voz de cabeça: sensação de vibração no rosto e na cabeça, som mais leve, usada na região aguda.",
              "Coordenação intermediária (voz mista): equilíbrio entre os dois, permitindo transições suaves.",
              "Região de passagem: notas em que a voz muda de registro. Pode “quebrar” no início; com treino, a transição fica suave. A identificação precisa da passagem deve ser feita com um professor.",
            ],
          },
          {
            type: "tip",
            title: "Sem competição",
            text: "Ninguém canta melhor por alcançar a nota mais aguda ou mais grave. O que importa no ministério é cantar a sua parte com conforto e qualidade. Exercícios extremos podem machucar a voz.",
          },
          {
            type: "p",
            text: "A classificação tradicional (soprano, mezzo-soprano, contralto, tenor, barítono, baixo) considera tessitura, timbre e passagens. Por isso, aqui ela sempre começa como provisória e pode mudar: vozes se desenvolvem com o estudo.",
          },
        ],
        demonstracao: [
          { type: "keyboard", from: "E2", to: "C6", highlight: ["C4"], label: "Teclado de referência (Dó4 = dó central)" },
          { type: "audio", label: "Deslize por arpejo (vozes femininas)", notes: ["C4", "E4", "G4", "C5", "G4", "E4", "C4"], tempo: 100 },
          { type: "audio", label: "Deslize por arpejo (vozes masculinas)", notes: ["C3", "E3", "G3", "C4", "G3", "E3", "C3"], tempo: 100 },
          { type: "toolLink", tool: "extensao", label: "Abrir o mapeamento da região confortável" },
        ],
        exercicioGuiado: {
          passos: [
            "Faça a sirene em “u” do grave ao agudo, bem suave, e observe onde a sensação de vibração muda do peito para a cabeça.",
            "No mapeamento da região confortável, cante cada nota proposta e marque: confortável, com esforço ou não alcanço.",
            "Pare de subir ou descer assim que sentir esforço. As notas “com esforço” fazem parte da extensão, não da tessitura.",
            "Cante o arpejo Dó–Mi–Sol–Dó em “u”, passando pela região de passagem com volume suave.",
          ],
        },
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
        explicacao: [
          {
            type: "p",
            text: "Interpretar é dar sentido às notas. A mesma melodia pode soar como uma oração íntima ou como um hino de vitória, dependendo de como a cantamos. O ponto de partida é sempre o texto: o que ele diz, para quem, com que sentimento.",
          },
          {
            type: "list",
            items: [
              "Dinâmica: variações de intensidade. pp (pianíssimo), p (piano, suave), mp, mf, f (forte), ff. Crescendo (aumentar aos poucos) e decrescendo (diminuir).",
              "Fraseado: cada frase tem uma direção, normalmente para uma palavra ou sílaba importante. Evite acentuar sílabas fracas.",
              "Legato: notas ligadas, sem buracos entre elas. É o padrão do canto coral sacro.",
              "Staccato e acentos: articulações curtas ou marcadas, usadas para efeito de texto.",
              "Intenção: o rosto e a expressão também comunicam. Cante o texto, não apenas as notas.",
            ],
          },
          {
            type: "tip",
            title: "Unidade sonora",
            text: "No grupo, a interpretação é combinada: todos crescem juntos, respiram juntos e cortam juntos. Emoção individual sem unidade vira desequilíbrio; técnica sem emoção vira execução fria. O regente conduz esse equilíbrio.",
          },
        ],
        demonstracao: [
          { type: "audio", label: "Frase em legato (Sol–Lá–Si–Dó–Si–Lá–Sol)", notes: ["G4", "A4", "B4", "C5", "B4", "A4", "G4"], tempo: 72 },
          { type: "harmonyLink", arrangement: "hino-alegria-unissono", label: "Pratique dinâmica no “Hino da Alegria” em uníssono" },
        ],
        exercicioGuiado: {
          passos: [
            "Leia o texto de uma estrofe em voz alta e sublinhe a palavra mais importante de cada frase.",
            "Cante a frase de demonstração em “lu” com legato, sem buracos entre as notas.",
            "Cante a mesma frase com crescendo até a nota mais aguda e decrescendo até o fim.",
            "Cante a estrofe escolhida dirigindo cada frase para a palavra sublinhada.",
            "Grave e ouça: a interpretação combina com o texto?",
          ],
        },
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
