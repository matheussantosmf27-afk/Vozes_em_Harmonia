# Vozes em Harmonia

Plataforma web de formação vocal, percepção musical e canto em vozes para o ministério de música de uma igreja: avaliação inicial, plano individual, trilhas de aulas com exercícios e avaliações, laboratório auditivo adaptativo, treinador de afinação com microfone, treinador de harmonia por voz, repertório com direitos autorais registrados, planejador de ensaios e painéis para professores e para o diretor musical.

> Princípio do produto: cada voz se desenvolve individualmente para, em seguida, contribuir melhor para a harmonia coletiva.

---

## Sumário

1. [Arquitetura](#arquitetura)
2. [Rodar localmente](#rodar-localmente)
3. [Configurar um projeto Supabase (produção)](#configurar-um-projeto-supabase-produção)
4. [Publicar no Vercel](#publicar-no-vercel)
5. [Perfis e primeiro acesso](#perfis-e-primeiro-acesso)
6. [Testes](#testes)
7. [Conteúdo pedagógico](#conteúdo-pedagógico)
8. [Segurança, privacidade e LGPD](#segurança-privacidade-e-lgpd)
9. [O que está implementado](#o-que-está-implementado)
10. [O que ainda está pendente](#o-que-ainda-está-pendente)
11. [Limitações e riscos técnicos](#limitações-e-riscos-técnicos)

---

## Arquitetura

| Camada | Escolha |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components por padrão, Server Actions, `proxy.ts` para sessão) |
| Linguagem | TypeScript em modo `strict` |
| Interface | Tailwind CSS v4, shadcn/ui (variante Base UI), Lucide, fontes Fraunces/Inter/Noto Music |
| Dados e autenticação | Supabase: PostgreSQL, Auth (e-mail e senha), Storage privado, Row Level Security |
| Áudio | Web Audio API (síntese própria — sem Tone.js), MediaRecorder, `getUserMedia` |
| Detecção de altura | Algoritmo YIN implementado em `src/lib/music/pitch-detection.ts` |
| MIDI | `@tonejs/midi` (somente leitura de arquivos importados) |
| Testes | Vitest + React Testing Library, testes SQL de RLS em PostgreSQL, Playwright (E2E) |

```
src/
  app/                 rotas (App Router)
    (auth)/            entrar, cadastro, recuperar senha
    (app)/             área autenticada: início, jornada, aprender, ouvido, voz,
                       harmonia, repertório, ensaios, progresso, conta, professor, diretor
    actions/           Server Actions (validação com Zod + RLS do Supabase)
  components/          interface (exercícios, música, harmonia, voz, professor, diretor…)
  content/             conteúdo inicial: trilhas, aulas, laboratório, arranjos (fonte da migration)
  lib/
    music/             notas, teoria, ritmo, notação, YIN, importação MIDI (funções puras e testadas)
    exercises/         esquemas, geradores de rodadas e correção das atividades
    pedagogy/          plano individual, classificação provisória, adaptação, domínio
    audio/             motor de síntese, reprodutor multivozes, microfone
    supabase/          clientes (servidor, navegador, proxy) e tipos gerados
supabase/
  migrations/          esquema, regras de negócio, RLS, Storage e conteúdo (gerado)
  tests/               testes de RLS e regras (rodam em PostgreSQL local)
scripts/               test-db, geração de tipos e da migration de conteúdo
e2e/                   testes de ponta a ponta (Playwright)
```

Decisões principais:

- **Regras críticas no banco.** O domínio de habilidades, a conclusão de aulas, as conquistas e as estatísticas são calculados por funções e gatilhos PostgreSQL (`*_logic.sql`). O integrante não consegue marcar uma aula como concluída nem conceder conquistas a si mesmo — só o banco faz isso, depois de uma avaliação com nota mínima.
- **Sem chave de serviço.** A aplicação usa apenas a chave publicável; tudo passa pelo RLS com a sessão do usuário. A exclusão de conta usa uma função `security definer` restrita ao próprio usuário.
- **Conteúdo versionado.** As aulas ficam em `src/content` (tipadas e testadas) e são convertidas em uma migration SQL idempotente. Em produção o app lê do banco, o que permite aos professores criar atividades novas pela interface.
- **Cache Components desligado.** Como quase todas as páginas dependem da sessão, o projeto usa renderização dinâmica clássica do App Router.

## Rodar localmente

Pré-requisitos: Node.js 20.9+ (testado com 22), npm e Docker (para o Supabase local).

```bash
npm install
npx supabase start          # sobe Postgres, Auth, REST e Storage locais e aplica as migrations
cp .env.example .env.local  # preencha com a URL e a chave publicável exibidas pelo comando acima
npm run dev                 # http://localhost:3000
```

Para economizar recursos, você pode subir só o necessário:
`npx supabase start -x realtime,imgproxy,mailpit,postgres-meta,studio,edge-runtime,logflare,vector,supavisor`.
No Supabase local a confirmação de e-mail vem desativada (`supabase/config.toml`), então o cadastro entra direto.

Sem as variáveis do Supabase, o app abre uma página de configuração (`/configuracao`) em vez de quebrar.

## Configurar um projeto Supabase (produção)

1. Crie um projeto em [supabase.com](https://supabase.com) (região sugerida: São Paulo, `sa-east-1`).
2. Aplique as migrations, **na ordem**:
   - com a CLI: `npx supabase link --project-ref SEU_REF` e depois `npx supabase db push`; ou
   - pelo SQL Editor do painel, executando cada arquivo de `supabase/migrations/` em ordem de nome.
3. Em **Authentication → URL Configuration**:
   - *Site URL*: o endereço público (ex.: `https://vozes.suaigreja.org`);
   - *Redirect URLs*: `https://SEU-DOMINIO/auth/confirm` (e o endereço local, se for testar).
4. Em **Authentication → Providers → Email**, mantenha a confirmação de e-mail ativa. Para e-mails em produção, configure um SMTP próprio (o envio padrão do Supabase tem limite baixo).
   - Recomendado: em **Authentication → Emails → Templates**, troque o link dos modelos para o formato `token_hash`, que funciona mesmo quando a pessoa abre o e-mail em outro navegador (ex.: app de e-mail no celular):
     - *Confirm signup*: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/inicio`
     - *Reset password*: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/auth/nova-senha`
   - Com o link padrão, a confirmação aberta em outro navegador ainda vale, mas a pessoa precisa entrar com a senha (o app avisa); a recuperação de senha precisa ser aberta no mesmo navegador.
5. Os buckets `media` e `recordings` são criados pela migration de Storage, privados, com políticas próprias.
6. Copie a *Project URL* e a *Publishable key* (ou *anon key*) para as variáveis de ambiente.

Para regenerar os tipos TypeScript a partir das migrations: `npm run db:types` (usa um PostgreSQL local temporário). Com um projeto vinculado, a alternativa oficial é `npx supabase gen types typescript --linked`.

## Publicar no Vercel

1. Importe o repositório no Vercel (framework detectado: Next.js).
2. Defina as variáveis de ambiente: `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (opcional: `NEXT_PUBLIC_SITE_URL`).
3. Faça o deploy e cadastre o endereço final como *Site URL* e *Redirect URL* no Supabase.

O microfone só funciona em HTTPS (ou `localhost`) — o Vercel já entrega HTTPS.

## Perfis e primeiro acesso

- **A primeira conta criada vira diretora musical** e já fica ativa (bootstrap).
- As contas seguintes ficam **aguardando aprovação** até o diretor aprová-las em *Direção musical* (protege os dados do ministério).
- Em *Direção musical → Integrantes e papéis* o diretor concede os papéis de professor(a) e diretor(a). Uma pessoa pode acumular papéis. O banco impede que o ministério fique sem nenhum diretor.

| Perfil | Vê no menu | Pode |
| --- | --- | --- |
| Integrante | Início, jornada, aprender, ouvido, voz, harmonia, repertório, ensaios, progresso | Fazer avaliação, estudar, treinar, gravar (privado), ver plano, metas, comentários e tarefas |
| Professor(a) | + Área do professor | Avaliar, classificar (com histórico), registrar exceções de domínio, observações, ajustar plano e metas, criar atividades, registrar presença e anotações de ensaio |
| Diretor(a) | + Direção musical | Aprovar contas, gerenciar papéis, grupos e formações, repertório, arranjos, materiais, designações e ensaios |

## Testes

```bash
npm run typecheck   # next typegen + tsc --noEmit
npm run lint
npm test            # Vitest: teoria musical, YIN, ritmo, geradores, conteúdo, plano, componentes
npm run test:db     # aplica as migrations num PostgreSQL 16 temporário e roda os testes de RLS/regras
npm run test:e2e    # Playwright (requer Supabase local e `.env.local`; use E2E_DIRECTOR_EMAIL se o banco já tiver contas)
npm run build
```

O teste de conteúdo verifica, entre outras coisas, que toda aula tem as nove seções, pelo menos uma avaliação, que todas as atividades geram rodadas válidas em todos os níveis e que o arranjo SATB não tem quintas nem oitavas paralelas.

## Conteúdo pedagógico

- 6 trilhas e 38 aulas (A: fundamentos vocais · B: percepção · C: canto em conjunto · D: harmonia vocal · E: leitura · F: teoria aplicada). Cada aula tem objetivo, explicação, demonstração sonora ou interativa, exercício guiado, prática individual, erros comuns, segurança vocal, avaliação e critério para avançar.
- Laboratório de percepção com 13 atividades em 5 níveis cada.
- 13 arranjos de treino: melodias em domínio público (Beethoven, NEW BRITAIN, FRÈRE JACQUES) com harmonizações, exercícios e textos **originais da plataforma**, livres para uso no ministério.

Para alterar o conteúdo: edite `src/content/*`, rode `npm test` e depois `npm run content:sql -- <nome>` (ex.: `npm run content:sql -- revisao-trilha-b`). Isso cria uma migration **nova**, com data e hora no nome; migrations já aplicadas nunca são reescritas. Os upserts são idempotentes, então basta aplicar a migration mais recente. Se gerar de novo antes de aplicar, apague o arquivo anterior que ainda não foi aplicado.

## Segurança, privacidade e LGPD

- RLS em todas as tabelas; nenhum acesso anônimo. Integrantes veem apenas os próprios registros; professores e diretores veem os dados pedagógicos; outros integrantes veem só nomes.
- Gravações ficam no bucket privado `recordings/<id-do-usuário>/` e **só o dono** pode ouvi-las ou excluí-las — nem professores.
- O microfone é usado apenas após autorização, com explicação prévia; a análise é feita no navegador e nada é gravado sem a escolha explícita de salvar. Resultados de afinação salvam apenas números.
- Consentimento com a política de privacidade no cadastro; página `/privacidade`; exportação dos dados em JSON e exclusão da conta em *Minha conta*.
- Sem ranking nem comparação pública de desempenho. O desafio coletivo mostra apenas o total do grupo.
- A plataforma não é uma ferramenta médica; os avisos de segurança vocal aparecem nas aulas e nas ferramentas de voz.

## O que está implementado

**Fase 1 — MVP**
- Autenticação (cadastro com consentimento, login, recuperação de senha, confirmação de e-mail), aprovação de contas e perfis acumuláveis.
- Avaliação inicial: questionário completo, 9 testes práticos (com microfone ou autoavaliação), mapeamento da região confortável, relatório individual com pontos fortes, habilidades a desenvolver e recomendações.
- Classificação vocal provisória (nunca forçada; “não classificada” quando faltam dados), com histórico preservado e revisão pelo professor (provisória, em desenvolvimento, confirmada; região confortável, extensão, tessitura, passagem).
- Plano individual automático (objetivo, habilidades prioritárias, aulas, exercícios diários, frequência, tempo, critérios, próximo nível, justificativas) e metas de 4, 8 e 12 semanas — sem usar a classificação como critério.
- Trilhas e aulas com conteúdo real, teclado interativo, pauta, demonstrações de intervalos, acordes, escalas e ritmo; teclado/teoria interativa (intervalos, acordes e inversões, escalas, campo harmônico, transposição de cifras).
- Laboratório de percepção adaptativo com histórico; domínio de habilidades em 5 níveis com critérios objetivos.
- Painel básico e completo do diretor.

**Fase 2 — Treinamento vocal avançado**
- Treinador de afinação (YIN, estados de confiança, cents, estabilidade, histórico), nota sustentada, sustentação com distração, aquecimento guiado, metrônomo e gravador privado.
- Exercícios adaptativos (entre sessões e dentro da sessão), metas individuais e avaliações periódicas (avaliação de evolução e avaliação do professor).

**Fase 3 — Harmonia e repertório**
- Biblioteca de repertório com direitos autorais, busca e filtros; letras/cifras só com autorização (garantido no banco).
- Arranjos por voz, treinador com modos solo/guiado/conjunto, volume e silêncio por naipe, andamento, transposição, repetição de compassos, metrônomo, oitava da própria voz, visualização das notas com letra, “cantar junto” com microfone, trechos difíceis marcados e status da designação.
- Importação de MIDI (uma voz por trilha), distribuição de vozes sem notas, designação de integrantes por voz, materiais privados e áudios por naipe tocados em conjunto.
- Planejador de ensaios: pauta por blocos (modelo de 60 minutos editável), músicas com foco, objetivos, presença, anotações (visíveis ou internas), tarefas individuais ou do grupo e registro pós-ensaio.

**Fase 4 (parcial)**
- Recomendações personalizadas no plano e no laboratório, alertas de integrantes que precisam de acompanhamento, naipes que precisam de reforço, conferência de formação para um arranjo (vozes vazias, fora da região confortável, habilidades ainda não desenvolvidas) e relatórios do ministério com filtros por período, grupo, naipe e trilha.

## O que ainda está pendente

- **Renderização de MusicXML** dentro da plataforma: os arquivos podem ser anexados e baixados, mas não são exibidos como partitura (sugestão: OpenSheetMusicDisplay).
- **Texto sincronizado com áudio gravado** (karaokê): a letra aparece sincronizada apenas nos arranjos com notas (MIDI/plataforma).
- **Avaliação automática de sequências cantadas**: hoje o microfone avalia notas sustentadas e o “cantar junto”; sequências são treinadas no teclado e por autoavaliação.
- **Detecção automática de entrada/corte pelo microfone** (hoje a precisão de entrada é treinada por toque no ritmo).
- **Notificações** (e-mail/push) de ensaios e tarefas e **convites** enviados pelo diretor (hoje a pessoa se cadastra e o diretor aprova).
- **Recomendação automática de formação vocal para o repertório** (hoje há a conferência de formação com alertas, mas a escolha é manual).
- Edição de aulas da plataforma pela interface (professores criam atividades; o texto das aulas é mantido em `src/content`).
- Modo offline/PWA.

## Limitações e riscos técnicos

- A detecção de altura é uma **estimativa**: ruído, eco, microfones de notebook e o áudio de referência saindo pelo alto-falante atrapalham. A interface mostra “confiável”, “incerta” ou “sem sinal” e recomenda fones de ouvido. Uma tentativa isolada nunca define a afinação de ninguém.
- No iOS, o áudio só começa após um toque do usuário (tratado em todos os botões); o modo silencioso do iPhone pode silenciar a Web Audio.
- A sincronia de áudios por naipe (arquivos separados) depende do navegador; para estudo preciso por voz, prefira MIDI ou os arranjos da plataforma.
- Separar vozes de uma gravação estéreo comum não é feito (e não é prometido).
- O timbre sintetizado é simples, pensado para leveza e clareza das alturas, não para realismo.
- Uma instalação atende um ministério; para várias igrejas no mesmo banco seria necessário acrescentar um identificador de organização às tabelas e às políticas.
