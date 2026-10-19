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
        explicacao: [
          {
            type: "p",
            text: "Na harmonia a duas vozes, uma voz canta a melodia principal e a outra canta uma linha de apoio — a “segunda voz”. A segunda voz não é uma melodia qualquer: ela se relaciona com a principal por intervalos consonantes, principalmente terças e sextas.",
          },
          {
            type: "list",
            items: [
              "Movimento paralelo: as duas vozes sobem e descem juntas, mantendo o mesmo intervalo (ex.: terças paralelas).",
              "Movimento contrário: uma voz sobe enquanto a outra desce. Dá independência e riqueza.",
              "Movimento oblíquo: uma voz fica parada (nota sustentada) enquanto a outra se move.",
            ],
          },
          {
            type: "tip",
            title: "Como não ser arrastado pela melodia",
            text: "Aprenda a sua voz sozinho(a) primeiro (modo solo), depois com a melodia baixinha (modo guiado) e só então com as duas no mesmo volume (modo conjunto). Nos momentos de movimento contrário, pense na direção da SUA linha.",
          },
        ],
        demonstracao: [
          { type: "harmonyLink", arrangement: "movimento-contrario", label: "Exercício: movimento contrário" },
          { type: "harmonyLink", arrangement: "hino-alegria-duas-vozes", label: "Hino da Alegria a duas vozes" },
          { type: "audio", label: "Terça e sexta soando juntas", notes: [["C4", "E4"], ["E3", "C4"]], tempo: 40 },
        ],
        exercicioGuiado: {
          passos: [
            "Abra “Movimento contrário” e ouça as duas vozes no modo conjunto.",
            "Escolha a voz 2 e cante no modo solo até conhecê-la bem.",
            "Passe para o modo guiado: a voz 1 soa baixinho enquanto você canta a 2.",
            "Abra o “Hino da Alegria a duas vozes” e repita o processo com a segunda voz.",
            "Grave-se no modo conjunto e ouça: a sua voz se manteve?",
          ],
        },
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
        explicacao: [
          {
            type: "p",
            text: "Terças e sextas são consonâncias imperfeitas: soam doces, cheias e permitem movimento paralelo sem perder a independência. Por isso a maioria das segundas vozes do louvor congregacional caminha em terças ou sextas da melodia.",
          },
          {
            type: "list",
            items: [
              "Terça abaixo da melodia: a segunda voz canta duas notas da escala abaixo (Mi → Dó, Fá → Ré).",
              "Sexta abaixo: a segunda voz canta cinco notas da escala abaixo (Dó → Mi, Ré → Fá).",
              "Terça e sexta se complementam: uma terça invertida (nota de baixo uma oitava acima) vira sexta.",
              "Quinta e oitava paralelas soam “ocas” e fazem as vozes perderem independência; evite-as na segunda voz.",
            ],
          },
          { type: "tip", title: "Afinação de terças", text: "A terça maior bem afinada num acorde soa um pouco mais baixa que a do teclado. Ouça o grupo: quando a terça “encaixa”, o acorde parece vibrar." },
        ],
        demonstracao: [
          { type: "harmonyLink", arrangement: "tercas-paralelas", label: "Terças paralelas" },
          { type: "harmonyLink", arrangement: "sextas-paralelas", label: "Sextas paralelas" },
          { type: "intervals", root: "C4", semitones: [3, 4, 8, 9] },
        ],
        exercicioGuiado: {
          passos: [
            "Abra “Terças paralelas”, escolha a voz 2 e cante no modo solo.",
            "Modo guiado e depois conjunto, gravando uma vez.",
            "Repita com “Sextas paralelas”.",
            "Faça a avaliação de reconhecimento de terças e sextas.",
          ],
        },
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
        explicacao: [
          {
            type: "p",
            text: "Com três vozes já é possível cantar acordes completos: uma voz para cada nota da tríade (fundamental, terça e quinta). Normalmente a voz mais aguda canta a melodia, a mais grave dá a base, e a do meio completa o acorde.",
          },
          {
            type: "list",
            items: [
              "Notas comuns: quando dois acordes vizinhos têm uma nota em comum, a voz que canta essa nota costuma permanecer nela. Isso facilita a afinação.",
              "Condução de vozes: cada voz se move pelo menor caminho possível para a próxima nota do acorde.",
              "Independência rítmica: em cânones e arranjos com imitação, as vozes entram em momentos diferentes.",
              "Equilíbrio: a voz do meio é a mais difícil de ouvir; ela precisa estar presente sem encobrir a melodia.",
            ],
          },
        ],
        demonstracao: [
          { type: "harmonyLink", arrangement: "triades-tres-vozes", label: "Tríades a três vozes (I – vi – IV – V – I)" },
          { type: "harmonyLink", arrangement: "canone-solfejo", label: "Cânone do solfejo: entradas em momentos diferentes" },
          { type: "harmonyLink", arrangement: "hino-alegria-tres-vozes", label: "Hino da Alegria a três vozes" },
        ],
        exercicioGuiado: {
          passos: [
            "Em “Tríades a três vozes”, cante cada uma das três vozes no modo solo e perceba quais notas permanecem iguais entre os acordes.",
            "Escolha a voz mais adequada à sua região e cante no modo guiado e no conjunto.",
            "No cânone, cante a voz 2: você entra depois da voz 1 com a mesma melodia.",
            "Cante a sua voz no Hino da Alegria a três vozes.",
          ],
        },
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
        explicacao: [
          {
            type: "p",
            text: "A formação SATB (Soprano, Contralto — em inglês Alto —, Tenor e Baixo) é a base dos hinários. Como uma tríade tem três notas, numa harmonia a quatro vozes uma nota é dobrada (geralmente a fundamental).",
          },
          {
            type: "list",
            items: [
              "Soprano: normalmente canta a melodia.",
              "Contralto: voz feminina intermediária, logo abaixo do soprano.",
              "Tenor: voz masculina aguda; em partituras, é escrito na clave de Sol uma oitava acima do que soa (ou na clave de Fá).",
              "Baixo: voz masculina grave; costuma cantar a fundamental do acorde e define a harmonia.",
              "Regras de ouro da condução: mover cada voz pelo menor caminho, manter notas comuns, evitar quintas e oitavas paralelas e não cruzar vozes sem motivo.",
            ],
          },
          {
            type: "tip",
            title: "Como estudar a sua parte",
            text: "1) Leia o texto e o ritmo. 2) Ouça a sua voz no modo solo. 3) Cante com a sua voz destacada (guiado). 4) Cante no conjunto. 5) Marque e repita os compassos difíceis. 6) Volte para o conjunto ouvindo quem está acima e abaixo de você.",
          },
        ],
        demonstracao: [
          { type: "harmonyLink", arrangement: "acordes-sustentados-satb", label: "Acordes sustentados SATB (para afinação vertical)" },
          { type: "harmonyLink", arrangement: "hino-alegria-satb", label: "Hino da Alegria a quatro vozes (SATB)" },
          { type: "audio", label: "Acorde de Dó maior a quatro vozes (Dó3–Sol3–Dó4–Mi4)", notes: [["C3", "G3", "C4", "E4"]], mode: "chord", tempo: 30 },
        ],
        exercicioGuiado: {
          passos: [
            "Abra o Hino da Alegria SATB no modo conjunto e ouça inteiro.",
            "Escolha a sua voz e siga os passos de estudo: solo, guiado, conjunto.",
            "Marque os compassos difíceis e use a repetição de trecho.",
            "Nos acordes sustentados, cante a sua nota e ouça o acorde completo se formar.",
          ],
        },
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
        explicacao: [
          {
            type: "p",
            text: "No quarteto masculino (TTBB), as quatro vozes ficam numa região mais próxima, o que produz um som muito unido — e exige afinação cuidadosa. A nomenclatura e a distribuição variam conforme o arranjo e a tradição (hinódia, gospel, barbershop).",
          },
          {
            type: "list",
            items: [
              "Primeiro tenor: a voz mais aguda; frequentemente canta acima da melodia, com voz leve.",
              "Segundo tenor: em muitos arranjos (como no estilo barbershop, onde é chamado de “lead”) canta a melodia.",
              "Barítono: completa o acorde; às vezes canta acima, às vezes abaixo da melodia — é a voz que mais “cruza”.",
              "Baixo: a fundamental e o alicerce rítmico.",
            ],
          },
          {
            type: "p",
            text: "Neste arranjo de treino (melodia NEW BRITAIN, conhecida como “Amazing Grace”, de domínio público, com texto original da plataforma), a melodia está no segundo tenor. Repare nos momentos em que o barítono canta acima da melodia.",
          },
        ],
        demonstracao: [
          { type: "harmonyLink", arrangement: "que-grande-amor-ttbb", label: "“Que grande amor” — quarteto masculino" },
          { type: "audio", label: "Acorde de Sol maior em quarteto (Sol2–Ré3–Sol3–Si3)", notes: [["G2", "D3", "G3", "B3"]], mode: "chord", tempo: 30 },
        ],
        exercicioGuiado: {
          passos: [
            "Ouça o arranjo no modo conjunto e acompanhe a melodia no segundo tenor.",
            "Escolha a sua voz pela região confortável (consulte sua classificação provisória).",
            "Estude no modo solo e guiado; marque os trechos em que a sua voz cruza com outra.",
            "Cante no modo conjunto e grave.",
          ],
        },
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
        explicacao: [
          {
            type: "p",
            text: "Afinação horizontal é a de cada voz ao longo da melodia. Afinação vertical é a do acorde: quanto as notas cantadas ao mesmo tempo se encaixam. Quando o acorde está bem afinado, ele parece mais forte e “brilha” — às vezes ouvimos até notas que ninguém está cantando (harmônicos).",
          },
          {
            type: "list",
            items: [
              "Afine a partir do baixo: o baixo dá a referência; as outras vozes ajustam-se a ele.",
              "Oitavas e quintas precisam estar exatas: são o “esqueleto” do acorde.",
              "A terça maior encaixa um pouco mais baixa que no teclado; a terça menor, um pouco mais alta.",
              "Notas longas tendem a cair: mantenha o apoio do ar até o fim.",
            ],
          },
        ],
        demonstracao: [
          { type: "harmonyLink", arrangement: "acordes-sustentados-satb", label: "Acordes sustentados SATB" },
          { type: "audio", label: "Quinta justa afinada (Dó3–Sol3)", notes: [["C3", "G3"]], mode: "chord", tempo: 25 },
        ],
        exercicioGuiado: {
          passos: [
            "Nos acordes sustentados, cante a sua voz no modo guiado ouvindo o baixo.",
            "Sustente cada acorde por 4 tempos prestando atenção ao “encaixe”.",
            "Faça a avaliação de perceber notas acima ou abaixo com diferenças pequenas.",
          ],
        },
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
        explicacao: [
          {
            type: "p",
            text: "Independência vocal é a capacidade de cantar a sua linha com segurança enquanto ouve o conjunto. Ela não significa ignorar os outros: significa ouvir, se localizar e continuar na sua parte.",
          },
          {
            type: "list",
            items: [
              "Conheça a sua parte de cor antes do conjunto.",
              "Saiba onde estão as notas-âncora e as entradas.",
              "Ouça ativamente a voz imediatamente acima e abaixo da sua: elas são suas referências.",
              "Se se perder, não pare o grupo: volte na próxima âncora ou na próxima frase.",
            ],
          },
        ],
        demonstracao: [
          { type: "harmonyLink", arrangement: "canone-solfejo", label: "Cânone a quatro vozes" },
          { type: "harmonyLink", arrangement: "hino-alegria-satb", label: "SATB no modo conjunto" },
        ],
        exercicioGuiado: {
          passos: [
            "Cante a voz 3 do cânone no modo conjunto (todas as vozes no mesmo volume).",
            "Cante a sua voz do SATB no modo conjunto com a sua voz em volume igual às outras.",
            "Faça a avaliação de sustentação com distração.",
          ],
        },
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
        explicacao: [
          {
            type: "list",
            items: [
              "Contracanto: uma segunda melodia independente, geralmente acima da principal (descante), que dialoga com ela.",
              "Pedal harmônico: nota sustentada (muitas vezes a tônica ou a dominante, no baixo) enquanto os acordes mudam acima dela.",
              "Introduções e interlúdios vocais: trechos em “u”, “m” ou com sílabas que preparam a entrada do texto.",
              "Modulação: mudança de tonalidade, muito usada para elevar a última estrofe (geralmente um tom acima).",
              "Rearmonização introdutória: trocar alguns acordes da harmonia original (ex.: usar vi no lugar de I) mantendo a melodia.",
              "Acordes de passagem: acordes rápidos que ligam dois acordes principais.",
              "Dinâmica por naipe e clímax: naipes entram aos poucos, a dinâmica cresce e o ponto mais alto coincide com a frase mais importante do texto.",
            ],
          },
          {
            type: "tip",
            title: "Adaptar a tonalidade",
            text: "A melhor tonalidade é a que coloca a melodia na região confortável do grupo e da congregação. Para louvor congregacional, mantenha a melodia aproximadamente entre Si♭3 e Ré5. O treinador de harmonia permite transpor os exercícios para testar.",
          },
        ],
        demonstracao: [
          { type: "harmonyLink", arrangement: "hino-alegria-contracanto", label: "Hino da Alegria com contracanto e pedal" },
          { type: "harmonyLink", arrangement: "pedal-e-melodia", label: "Nota pedal e melodia" },
        ],
        exercicioGuiado: {
          passos: [
            "Ouça o arranjo com contracanto no modo conjunto e identifique as três camadas.",
            "Cante o contracanto (vozes agudas) ou o pedal (vozes graves) no modo guiado.",
            "Use a transposição do treinador: +2 semitons. A melodia ficou mais confortável para o grupo?",
            "Planeje a dinâmica: qual compasso é o clímax do texto?",
          ],
        },
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
