-- =============================================================================
-- Vozes em Harmonia — esquema principal
-- Ministério único por instalação (uma igreja / um ministério de música).
-- =============================================================================

create extension if not exists pgcrypto with schema extensions;

-- -----------------------------------------------------------------------------
-- Tipos enumerados
-- -----------------------------------------------------------------------------
create type public.app_role as enum ('integrante', 'professor', 'diretor');

create type public.voice_classification as enum (
  'soprano', 'mezzo_soprano', 'contralto',
  'tenor', 'baritono', 'baixo',
  'nao_classificada'
);

create type public.classification_status as enum ('provisoria', 'em_desenvolvimento', 'confirmada');
create type public.assessment_kind as enum ('inicial', 'periodica', 'professor');
create type public.lesson_status as enum ('em_andamento', 'concluida');
create type public.group_kind as enum ('coral', 'quarteto', 'pequeno_grupo', 'equipe_louvor', 'turma');
create type public.license_status as enum (
  'dominio_publico', 'composicao_propria', 'licenciado',
  'material_original_plataforma', 'autorizacao_pendente'
);
create type public.repertoire_status as enum ('planejada', 'em_estudo', 'em_ensaio', 'pronta', 'arquivada');
create type public.assignment_status as enum ('designado', 'estudando', 'pronto');
create type public.rehearsal_status as enum ('planejado', 'realizado', 'cancelado');
create type public.attendance_status as enum ('presente', 'ausente', 'justificado');
create type public.goal_status as enum ('ativa', 'concluida', 'pausada', 'cancelada');
create type public.media_kind as enum ('audio', 'midi', 'musicxml', 'pdf', 'imagem', 'outro');

-- -----------------------------------------------------------------------------
-- Utilitário: updated_at automático
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Pessoas e papéis
-- -----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 120),
  display_name text check (char_length(display_name) <= 60),
  is_active boolean not null default true,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.profiles is 'Dados mínimos de cada pessoa (LGPD: apenas o necessário).';

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create table public.user_roles (
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.app_role not null,
  granted_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);
create index user_roles_role_idx on public.user_roles (role);

-- Funções de autorização usadas pelas políticas RLS (security definer evita
-- recursão de RLS sobre user_roles).
create or replace function public.has_role(r public.app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = (select auth.uid()) and ur.role = r
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = (select auth.uid())
      and ur.role in ('professor', 'diretor')
  );
$$;

create or replace function public.is_director()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.has_role('diretor');
$$;

-- Cria perfil e papel "integrante" para cada nova conta. A primeira conta
-- criada na instalação recebe também o papel de diretor (bootstrap).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)));

  insert into public.user_roles (user_id, role) values (new.id, 'integrante');

  if not exists (select 1 from public.user_roles where role = 'diretor') then
    insert into public.user_roles (user_id, role) values (new.id, 'diretor');
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Impede que o ministério fique sem nenhum diretor.
create or replace function public.ensure_director_remains()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.role = 'diretor'
     and not exists (
       select 1 from public.user_roles
       where role = 'diretor' and user_id <> old.user_id
     )
     and exists (select 1 from public.profiles where id = old.user_id) then
    raise exception 'O ministério precisa de pelo menos um diretor musical.';
  end if;
  return old;
end;
$$;

create trigger user_roles_keep_director
  before delete on public.user_roles
  for each row execute function public.ensure_director_remains();

-- -----------------------------------------------------------------------------
-- Conteúdo pedagógico
-- -----------------------------------------------------------------------------
create table public.skills (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  category text not null check (category in (
    'tecnica_vocal', 'afinacao', 'percepcao', 'ritmo', 'harmonia',
    'leitura', 'teoria', 'interpretacao', 'conjunto'
  )),
  description text not null,
  criteria jsonb not null default '{}'::jsonb,
  -- Nível máximo atingível automaticamente pelos exercícios. Acima disso,
  -- é necessária a validação de um professor (ex.: técnica vocal).
  auto_max_level smallint not null default 4 check (auto_max_level between 1 and 5),
  sort integer not null default 0
);

create table public.learning_paths (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  code text not null,
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  icon text not null default 'music',
  sort integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  path_id uuid not null references public.learning_paths (id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  summary text not null default '',
  sort integer not null default 0,
  level smallint not null default 1 check (level between 1 and 3),
  estimated_minutes smallint not null default 15 check (estimated_minutes between 1 and 240),
  content jsonb not null,
  pass_threshold numeric(3, 2) not null default 0.70 check (pass_threshold between 0 and 1),
  is_published boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index lessons_path_idx on public.lessons (path_id, sort);
create trigger lessons_updated_at before update on public.lessons
  for each row execute function public.set_updated_at();

create table public.lesson_skills (
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  skill_slug text not null references public.skills (slug) on delete cascade,
  primary key (lesson_id, skill_slug)
);
create index lesson_skills_skill_idx on public.lesson_skills (skill_slug);

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  lesson_id uuid references public.lessons (id) on delete cascade,
  title text not null,
  instructions text not null default '',
  type text not null check (type in (
    'pitch_compare', 'note_match', 'interval_id', 'chord_quality', 'chord_extreme',
    'progression_id', 'melody_memory', 'rhythm_tap', 'tuning_check', 'consonance',
    'quiz', 'sing_note', 'staff_read', 'entry_detect', 'phrase_compare', 'scale_id',
    'self_check', 'harmony_part'
  )),
  config jsonb not null default '{}'::jsonb,
  skill_slug text not null references public.skills (slug),
  -- pratica: dentro da aula; avaliacao: conta para concluir a aula;
  -- laboratorio: laboratório de percepção; diagnostico: avaliação inicial.
  purpose text not null default 'pratica' check (purpose in ('pratica', 'avaliacao', 'laboratorio', 'diagnostico')),
  difficulty smallint not null default 1 check (difficulty between 1 and 5),
  sort integer not null default 0,
  is_published boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index exercises_lesson_idx on public.exercises (lesson_id, sort);
create index exercises_skill_idx on public.exercises (skill_slug);
create index exercises_purpose_idx on public.exercises (purpose, type);

create table public.achievements (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  description text not null,
  icon text not null default 'award',
  points integer not null default 0 check (points >= 0),
  sort integer not null default 0
);

-- -----------------------------------------------------------------------------
-- Prática, progresso e domínio de habilidades
-- -----------------------------------------------------------------------------
create table public.exercise_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id) on delete cascade,
  score numeric(5, 4) not null check (score between 0 and 1),
  correct_count integer not null default 0 check (correct_count >= 0),
  total_count integer not null default 0 check (total_count >= 0),
  difficulty_level smallint check (difficulty_level between 1 and 5),
  duration_ms integer check (duration_ms >= 0),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (correct_count <= total_count)
);
create index exercise_attempts_user_idx on public.exercise_attempts (user_id, created_at desc);
create index exercise_attempts_user_ex_idx on public.exercise_attempts (user_id, exercise_id, created_at desc);

create table public.user_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  status public.lesson_status not null default 'em_andamento',
  best_score numeric(5, 4) check (best_score between 0 and 1),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
create trigger user_progress_updated_at before update on public.user_progress
  for each row execute function public.set_updated_at();

create table public.skill_mastery (
  user_id uuid not null references public.profiles (id) on delete cascade,
  skill_slug text not null references public.skills (slug) on delete cascade,
  auto_level smallint not null default 1 check (auto_level between 1 and 5),
  teacher_level smallint check (teacher_level between 1 and 5),
  level smallint generated always as (coalesce(teacher_level, auto_level)) stored,
  evidence text,
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (user_id, skill_slug)
);
create trigger skill_mastery_updated_at before update on public.skill_mastery
  for each row execute function public.set_updated_at();

create table public.user_achievements (
  user_id uuid not null references public.profiles (id) on delete cascade,
  achievement_slug text not null references public.achievements (slug) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, achievement_slug)
);

create table public.practice_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  practiced_on date not null default (now() at time zone 'America/Sao_Paulo')::date,
  minutes smallint not null check (minutes between 1 and 600),
  activity text not null check (char_length(activity) between 1 and 120),
  notes text check (char_length(notes) <= 2000),
  created_at timestamptz not null default now()
);
create index practice_logs_user_idx on public.practice_logs (user_id, practiced_on desc);

-- -----------------------------------------------------------------------------
-- Avaliação e classificação vocal (histórico preservado)
-- -----------------------------------------------------------------------------
create table public.vocal_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind public.assessment_kind not null default 'inicial',
  assessed_by uuid references public.profiles (id) on delete set null,
  questionnaire jsonb not null default '{}'::jsonb,
  test_results jsonb not null default '{}'::jsonb,
  range_low_midi smallint check (range_low_midi between 21 and 108),
  range_high_midi smallint check (range_high_midi between 21 and 108),
  comfortable_low_midi smallint check (comfortable_low_midi between 21 and 108),
  comfortable_high_midi smallint check (comfortable_high_midi between 21 and 108),
  range_confidence text check (range_confidence in ('confiavel', 'incerta', 'nao_medida')),
  suggested_classification public.voice_classification,
  report jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  check (range_low_midi is null or range_high_midi is null or range_low_midi <= range_high_midi),
  check (comfortable_low_midi is null or comfortable_high_midi is null or comfortable_low_midi <= comfortable_high_midi)
);
create index vocal_assessments_user_idx on public.vocal_assessments (user_id, created_at desc);

create table public.vocal_ranges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  low_midi smallint not null check (low_midi between 21 and 108),
  high_midi smallint not null check (high_midi between 21 and 108),
  comfortable_low_midi smallint check (comfortable_low_midi between 21 and 108),
  comfortable_high_midi smallint check (comfortable_high_midi between 21 and 108),
  source text not null check (source in ('teste_automatico', 'autoavaliacao', 'professor')),
  confidence text not null default 'incerta' check (confidence in ('confiavel', 'incerta')),
  measured_by uuid references public.profiles (id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  check (low_midi <= high_midi)
);
create index vocal_ranges_user_idx on public.vocal_ranges (user_id, created_at desc);

create table public.vocal_classifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  classification public.voice_classification not null default 'nao_classificada',
  status public.classification_status not null default 'provisoria',
  comfortable_low_midi smallint check (comfortable_low_midi between 21 and 108),
  comfortable_high_midi smallint check (comfortable_high_midi between 21 and 108),
  range_low_midi smallint check (range_low_midi between 21 and 108),
  range_high_midi smallint check (range_high_midi between 21 and 108),
  tessitura_low_midi smallint check (tessitura_low_midi between 21 and 108),
  tessitura_high_midi smallint check (tessitura_high_midi between 21 and 108),
  passaggio text check (char_length(passaggio) <= 300),
  notes text check (char_length(notes) <= 4000),
  assessment_id uuid references public.vocal_assessments (id) on delete set null,
  -- null = sugestão automática gerada pela avaliação inicial
  classified_by uuid references public.profiles (id) on delete set null,
  is_current boolean not null default true,
  created_at timestamptz not null default now()
);
create index vocal_classifications_user_idx on public.vocal_classifications (user_id, created_at desc);
create unique index vocal_classifications_current_idx on public.vocal_classifications (user_id) where is_current;

-- Uma nova classificação passa a ser a atual; as anteriores ficam no histórico.
create or replace function public.classification_make_current()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.is_current then
    update public.vocal_classifications
       set is_current = false
     where user_id = new.user_id and is_current and id <> new.id;
  end if;
  return new;
end;
$$;

create trigger vocal_classifications_current
  before insert on public.vocal_classifications
  for each row execute function public.classification_make_current();

create table public.teacher_observations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  category text not null default 'geral' check (category in (
    'geral', 'afinacao', 'respiracao', 'ritmo', 'projecao', 'percepcao',
    'independencia_vocal', 'interpretacao', 'saude_vocal', 'distribuicao_vocal'
  )),
  content text not null check (char_length(content) between 1 and 4000),
  visible_to_member boolean not null default true,
  created_at timestamptz not null default now()
);
create index teacher_observations_user_idx on public.teacher_observations (user_id, created_at desc);

-- -----------------------------------------------------------------------------
-- Plano individual e metas
-- -----------------------------------------------------------------------------
create table public.study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  assessment_id uuid references public.vocal_assessments (id) on delete set null,
  objective text not null check (char_length(objective) between 1 and 600),
  priority_skills text[] not null default '{}',
  recommended_lessons text[] not null default '{}',
  daily_exercises jsonb not null default '[]'::jsonb,
  weekly_frequency smallint not null default 3 check (weekly_frequency between 1 and 7),
  minutes_per_session smallint not null default 15 check (minutes_per_session between 5 and 120),
  review_every_weeks smallint not null default 4 check (review_every_weeks between 1 and 12),
  completion_criteria text not null default '',
  next_level text not null default '',
  rationale jsonb not null default '[]'::jsonb,
  is_current boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index study_plans_user_idx on public.study_plans (user_id, created_at desc);
create unique index study_plans_current_idx on public.study_plans (user_id) where is_current;
create trigger study_plans_updated_at before update on public.study_plans
  for each row execute function public.set_updated_at();

create or replace function public.plan_make_current()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.is_current then
    update public.study_plans set is_current = false
     where user_id = new.user_id and is_current and id <> new.id;
  end if;
  return new;
end;
$$;

create trigger study_plans_current
  before insert on public.study_plans
  for each row execute function public.plan_make_current();

create table public.practice_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan_id uuid references public.study_plans (id) on delete set null,
  title text not null check (char_length(title) between 1 and 160),
  description text not null default '' check (char_length(description) <= 2000),
  horizon_weeks smallint not null check (horizon_weeks in (1, 4, 8, 12)),
  skill_slug text references public.skills (slug) on delete set null,
  target_level smallint check (target_level between 1 and 5),
  due_on date,
  status public.goal_status not null default 'ativa',
  progress_note text check (char_length(progress_note) <= 2000),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index practice_goals_user_idx on public.practice_goals (user_id, status);
create trigger practice_goals_updated_at before update on public.practice_goals
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Grupos vocais
-- -----------------------------------------------------------------------------
create table public.vocal_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  kind public.group_kind not null,
  description text not null default '',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.group_members (
  group_id uuid not null references public.vocal_groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  part_label text check (char_length(part_label) <= 60),
  created_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
create index group_members_user_idx on public.group_members (user_id);

-- -----------------------------------------------------------------------------
-- Repertório e arranjos
-- -----------------------------------------------------------------------------
create table public.repertoire (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  composer text,
  lyricist text,
  source text,
  copyright_info text not null default '',
  license_status public.license_status not null default 'autorizacao_pendente',
  original_key text,
  group_key text,
  tempo_bpm smallint check (tempo_bpm between 20 and 260),
  time_signature text check (time_signature ~ '^[0-9]{1,2}/[0-9]{1,2}$'),
  lyrics text,
  chords text,
  difficulty smallint not null default 2 check (difficulty between 1 and 5),
  categories text[] not null default '{}'
    check (categories <@ array['culto', 'coral', 'quarteto', 'pequeno_grupo', 'louvor_congregacional', 'eventos_especiais']::text[]),
  formation text not null default 'livre' check (formation in (
    'unissono', 'duas_vozes', 'tres_vozes', 'satb', 'quarteto_masculino',
    'quarteto_feminino', 'quarteto_misto', 'coral', 'livre'
  )),
  voices_required smallint not null default 1 check (voices_required between 1 and 8),
  director_notes text,
  status public.repertoire_status not null default 'planejada',
  is_demo boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Letra e cifra só podem ser armazenadas com autorização registrada.
  constraint repertoire_lyrics_require_license check (
    (lyrics is null and chords is null) or license_status <> 'autorizacao_pendente'
  )
);
create index repertoire_status_idx on public.repertoire (status);
create index repertoire_title_idx on public.repertoire using gin (to_tsvector('portuguese', title || ' ' || coalesce(composer, '')));
create trigger repertoire_updated_at before update on public.repertoire
  for each row execute function public.set_updated_at();

create table public.arrangements (
  id uuid primary key default gen_random_uuid(),
  repertoire_id uuid not null references public.repertoire (id) on delete cascade,
  slug text unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  formation text not null default 'livre',
  key_name text,
  tempo_bpm smallint not null default 80 check (tempo_bpm between 20 and 260),
  beats_per_measure smallint not null default 4 check (beats_per_measure between 1 and 12),
  -- Nível da escola de harmonia (1 = uníssono … 5 = arranjos avançados)
  harmony_level smallint check (harmony_level between 1 and 5),
  description text not null default '',
  study_tips text not null default '',
  source text not null default 'manual' check (source in ('manual', 'midi', 'plataforma')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index arrangements_repertoire_idx on public.arrangements (repertoire_id);

create table public.vocal_parts (
  id uuid primary key default gen_random_uuid(),
  arrangement_id uuid not null references public.arrangements (id) on delete cascade,
  name text not null,
  short_name text not null default '',
  sort smallint not null default 0,
  range_low_midi smallint check (range_low_midi between 21 and 108),
  range_high_midi smallint check (range_high_midi between 21 and 108),
  -- Notas: [{ "p": midi | null (pausa), "s": início em tempos, "d": duração em tempos, "l": sílaba? }]
  notes jsonb not null default '[]'::jsonb check (jsonb_typeof(notes) = 'array'),
  suggested_voices public.voice_classification[] not null default '{}',
  created_at timestamptz not null default now()
);
create index vocal_parts_arrangement_idx on public.vocal_parts (arrangement_id, sort);

create table public.arrangement_assignments (
  id uuid primary key default gen_random_uuid(),
  vocal_part_id uuid not null references public.vocal_parts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status public.assignment_status not null default 'designado',
  assigned_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (vocal_part_id, user_id)
);
create index arrangement_assignments_user_idx on public.arrangement_assignments (user_id);
create trigger arrangement_assignments_updated_at before update on public.arrangement_assignments
  for each row execute function public.set_updated_at();

create table public.practice_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  arrangement_id uuid not null references public.arrangements (id) on delete cascade,
  start_measure smallint not null check (start_measure >= 1),
  end_measure smallint not null check (end_measure >= 1),
  note text check (char_length(note) <= 300),
  created_at timestamptz not null default now(),
  check (start_measure <= end_measure)
);
create index practice_bookmarks_user_idx on public.practice_bookmarks (user_id, arrangement_id);

-- -----------------------------------------------------------------------------
-- Ensaios
-- -----------------------------------------------------------------------------
create table public.rehearsal_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  starts_at timestamptz not null,
  duration_minutes smallint not null default 60 check (duration_minutes between 5 and 600),
  location text,
  group_id uuid references public.vocal_groups (id) on delete set null,
  objectives text not null default '',
  -- [{ "minutes": 10, "title": "Aquecimento", "description": "...", "responsible": "..." }]
  agenda jsonb not null default '[]'::jsonb check (jsonb_typeof(agenda) = 'array'),
  status public.rehearsal_status not null default 'planejado',
  summary_learned text,
  summary_revisit text,
  summary_next text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index rehearsal_sessions_starts_idx on public.rehearsal_sessions (starts_at);
create trigger rehearsal_sessions_updated_at before update on public.rehearsal_sessions
  for each row execute function public.set_updated_at();

create table public.rehearsal_repertoire (
  rehearsal_id uuid not null references public.rehearsal_sessions (id) on delete cascade,
  repertoire_id uuid not null references public.repertoire (id) on delete cascade,
  sort smallint not null default 0,
  focus text,
  primary key (rehearsal_id, repertoire_id)
);

create table public.rehearsal_attendance (
  rehearsal_id uuid not null references public.rehearsal_sessions (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status public.attendance_status not null,
  note text check (char_length(note) <= 500),
  recorded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (rehearsal_id, user_id)
);
create index rehearsal_attendance_user_idx on public.rehearsal_attendance (user_id);

create table public.rehearsal_notes (
  id uuid primary key default gen_random_uuid(),
  rehearsal_id uuid not null references public.rehearsal_sessions (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  kind text not null default 'observacao' check (kind in ('dificuldade', 'aprendizado', 'retomar', 'observacao')),
  content text not null check (char_length(content) between 1 and 4000),
  visible_to_members boolean not null default false,
  created_at timestamptz not null default now()
);
create index rehearsal_notes_rehearsal_idx on public.rehearsal_notes (rehearsal_id);

create table public.rehearsal_tasks (
  id uuid primary key default gen_random_uuid(),
  rehearsal_id uuid references public.rehearsal_sessions (id) on delete cascade,
  -- null = tarefa para todo o grupo
  assignee_id uuid references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  description text not null default '',
  due_on date,
  done_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index rehearsal_tasks_assignee_idx on public.rehearsal_tasks (assignee_id);

-- -----------------------------------------------------------------------------
-- Arquivos (metadados; os arquivos ficam no Supabase Storage, privados)
-- -----------------------------------------------------------------------------
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles (id) on delete cascade,
  bucket text not null check (bucket in ('media', 'recordings')),
  path text not null,
  kind public.media_kind not null,
  title text not null check (char_length(title) between 1 and 200),
  mime_type text,
  size_bytes bigint check (size_bytes >= 0),
  repertoire_id uuid references public.repertoire (id) on delete cascade,
  arrangement_id uuid references public.arrangements (id) on delete cascade,
  vocal_part_id uuid references public.vocal_parts (id) on delete set null,
  rehearsal_id uuid references public.rehearsal_sessions (id) on delete cascade,
  license_note text,
  created_at timestamptz not null default now(),
  unique (bucket, path)
);
create index media_assets_owner_idx on public.media_assets (owner_id);
create index media_assets_repertoire_idx on public.media_assets (repertoire_id);
