-- =============================================================================
-- Vozes em Harmonia — Row Level Security
-- Princípios:
--  * cada integrante acessa os próprios registros;
--  * professores e diretores (staff) acessam os dados pedagógicos dos integrantes;
--  * apenas o diretor gerencia papéis, grupos, repertório e materiais;
--  * contas aguardando aprovação não enxergam dados compartilhados.
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.skills enable row level security;
alter table public.learning_paths enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_skills enable row level security;
alter table public.exercises enable row level security;
alter table public.achievements enable row level security;
alter table public.exercise_attempts enable row level security;
alter table public.user_progress enable row level security;
alter table public.skill_mastery enable row level security;
alter table public.user_achievements enable row level security;
alter table public.practice_logs enable row level security;
alter table public.vocal_assessments enable row level security;
alter table public.vocal_ranges enable row level security;
alter table public.vocal_classifications enable row level security;
alter table public.teacher_observations enable row level security;
alter table public.study_plans enable row level security;
alter table public.practice_goals enable row level security;
alter table public.vocal_groups enable row level security;
alter table public.group_members enable row level security;
alter table public.repertoire enable row level security;
alter table public.arrangements enable row level security;
alter table public.vocal_parts enable row level security;
alter table public.arrangement_assignments enable row level security;
alter table public.practice_bookmarks enable row level security;
alter table public.rehearsal_sessions enable row level security;
alter table public.rehearsal_repertoire enable row level security;
alter table public.rehearsal_attendance enable row level security;
alter table public.rehearsal_notes enable row level security;
alter table public.rehearsal_tasks enable row level security;
alter table public.media_assets enable row level security;

-- Nenhum acesso anônimo a tabelas do aplicativo.
revoke all on all tables in schema public from anon;

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
create policy "profiles: ver o próprio" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "profiles: membros ativos veem nomes do ministério" on public.profiles
  for select to authenticated using (public.is_active_member() and is_active);
create policy "profiles: staff vê todos" on public.profiles
  for select to authenticated using (public.is_staff());
create policy "profiles: editar o próprio" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "profiles: diretor edita" on public.profiles
  for update to authenticated using (public.is_director()) with check (public.is_director());

-- -----------------------------------------------------------------------------
-- user_roles
-- -----------------------------------------------------------------------------
create policy "roles: ver os próprios" on public.user_roles
  for select to authenticated using (user_id = (select auth.uid()));
create policy "roles: staff vê" on public.user_roles
  for select to authenticated using (public.is_staff());
create policy "roles: diretor concede" on public.user_roles
  for insert to authenticated with check (public.is_director() and granted_by = (select auth.uid()));
create policy "roles: diretor remove" on public.user_roles
  for delete to authenticated using (public.is_director());

-- -----------------------------------------------------------------------------
-- Conteúdo pedagógico: leitura para membros ativos; edição por staff
-- -----------------------------------------------------------------------------
create policy "skills: leitura" on public.skills
  for select to authenticated using (public.is_active_member());
create policy "skills: staff edita" on public.skills
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "paths: leitura" on public.learning_paths
  for select to authenticated using (public.is_active_member() and (is_published or public.is_staff()));
create policy "paths: diretor edita" on public.learning_paths
  for all to authenticated using (public.is_director()) with check (public.is_director());

create policy "lessons: leitura" on public.lessons
  for select to authenticated using (public.is_active_member() and (is_published or public.is_staff()));
create policy "lessons: staff cria" on public.lessons
  for insert to authenticated with check (public.is_staff() and created_by = (select auth.uid()));
create policy "lessons: staff edita" on public.lessons
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "lessons: staff remove as que criou" on public.lessons
  for delete to authenticated using (public.is_director() or (public.is_staff() and created_by = (select auth.uid())));

create policy "lesson_skills: leitura" on public.lesson_skills
  for select to authenticated using (public.is_active_member());
create policy "lesson_skills: staff edita" on public.lesson_skills
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "exercises: leitura" on public.exercises
  for select to authenticated using (public.is_active_member() and (is_published or public.is_staff()));
create policy "exercises: staff cria" on public.exercises
  for insert to authenticated with check (public.is_staff() and created_by = (select auth.uid()));
create policy "exercises: staff edita" on public.exercises
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "exercises: staff remove as que criou" on public.exercises
  for delete to authenticated using (public.is_director() or (public.is_staff() and created_by = (select auth.uid())));

create policy "achievements: leitura" on public.achievements
  for select to authenticated using (true);

-- -----------------------------------------------------------------------------
-- Registros individuais de prática
-- -----------------------------------------------------------------------------
create policy "attempts: ver as próprias" on public.exercise_attempts
  for select to authenticated using (user_id = (select auth.uid()));
create policy "attempts: staff vê" on public.exercise_attempts
  for select to authenticated using (public.is_staff());
create policy "attempts: registrar as próprias" on public.exercise_attempts
  for insert to authenticated with check (user_id = (select auth.uid()) and public.is_active_member());
create policy "attempts: excluir as próprias" on public.exercise_attempts
  for delete to authenticated using (user_id = (select auth.uid()));

create policy "progress: ver o próprio" on public.user_progress
  for select to authenticated using (user_id = (select auth.uid()));
create policy "progress: staff vê" on public.user_progress
  for select to authenticated using (public.is_staff());
-- O integrante só pode marcar uma aula como iniciada. A conclusão é feita
-- pelo banco ao atingir a nota mínima nas avaliações.
create policy "progress: iniciar aula" on public.user_progress
  for insert to authenticated with check (
    user_id = (select auth.uid()) and status = 'em_andamento' and best_score is null and completed_at is null
  );

create policy "mastery: ver o próprio" on public.skill_mastery
  for select to authenticated using (user_id = (select auth.uid()));
create policy "mastery: staff vê" on public.skill_mastery
  for select to authenticated using (public.is_staff());
create policy "mastery: staff registra avaliação" on public.skill_mastery
  for insert to authenticated with check (public.is_staff());
create policy "mastery: staff ajusta" on public.skill_mastery
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "user_achievements: ver as próprias" on public.user_achievements
  for select to authenticated using (user_id = (select auth.uid()));
create policy "user_achievements: staff vê" on public.user_achievements
  for select to authenticated using (public.is_staff());

create policy "practice_logs: dono" on public.practice_logs
  for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "practice_logs: staff vê" on public.practice_logs
  for select to authenticated using (public.is_staff());

-- -----------------------------------------------------------------------------
-- Avaliação e classificação vocal
-- -----------------------------------------------------------------------------
create policy "assessments: ver as próprias" on public.vocal_assessments
  for select to authenticated using (user_id = (select auth.uid()));
create policy "assessments: staff vê" on public.vocal_assessments
  for select to authenticated using (public.is_staff());
create policy "assessments: autoavaliação" on public.vocal_assessments
  for insert to authenticated with check (
    user_id = (select auth.uid()) and assessed_by is null and kind in ('inicial', 'periodica')
  );
create policy "assessments: avaliação do professor" on public.vocal_assessments
  for insert to authenticated with check (public.is_staff() and assessed_by = (select auth.uid()));
create policy "assessments: excluir autoavaliações próprias" on public.vocal_assessments
  for delete to authenticated using (user_id = (select auth.uid()) and assessed_by is null);

create policy "ranges: ver as próprias" on public.vocal_ranges
  for select to authenticated using (user_id = (select auth.uid()));
create policy "ranges: staff vê" on public.vocal_ranges
  for select to authenticated using (public.is_staff());
create policy "ranges: registrar as próprias" on public.vocal_ranges
  for insert to authenticated with check (
    user_id = (select auth.uid()) and source in ('teste_automatico', 'autoavaliacao') and measured_by is null
  );
create policy "ranges: staff registra" on public.vocal_ranges
  for insert to authenticated with check (public.is_staff() and measured_by = (select auth.uid()));
create policy "ranges: excluir as próprias" on public.vocal_ranges
  for delete to authenticated using (user_id = (select auth.uid()) and measured_by is null);

create or replace function public.has_teacher_classification(p_user uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.vocal_classifications vc
     where vc.user_id = p_user and vc.is_current and vc.classified_by is not null
  );
$$;

create policy "classifications: ver as próprias" on public.vocal_classifications
  for select to authenticated using (user_id = (select auth.uid()));
create policy "classifications: staff vê" on public.vocal_classifications
  for select to authenticated using (public.is_staff());
-- Sugestão automática: só provisória e nunca por cima de uma classificação
-- feita por professor.
create policy "classifications: sugestão automática" on public.vocal_classifications
  for insert to authenticated with check (
    user_id = (select auth.uid())
    and classified_by is null
    and status = 'provisoria'
    and not public.has_teacher_classification((select auth.uid()))
  );
create policy "classifications: professor classifica" on public.vocal_classifications
  for insert to authenticated with check (public.is_staff() and classified_by = (select auth.uid()));

create policy "observations: staff" on public.teacher_observations
  for select to authenticated using (public.is_staff());
create policy "observations: integrante vê as liberadas" on public.teacher_observations
  for select to authenticated using (user_id = (select auth.uid()) and visible_to_member);
create policy "observations: staff escreve" on public.teacher_observations
  for insert to authenticated with check (public.is_staff() and author_id = (select auth.uid()));
create policy "observations: autor edita" on public.teacher_observations
  for update to authenticated using (public.is_staff() and author_id = (select auth.uid()))
  with check (public.is_staff() and author_id = (select auth.uid()));
create policy "observations: autor ou diretor remove" on public.teacher_observations
  for delete to authenticated using (public.is_director() or (public.is_staff() and author_id = (select auth.uid())));

-- -----------------------------------------------------------------------------
-- Planos e metas
-- -----------------------------------------------------------------------------
create policy "plans: ver os próprios" on public.study_plans
  for select to authenticated using (user_id = (select auth.uid()));
create policy "plans: staff vê" on public.study_plans
  for select to authenticated using (public.is_staff());
create policy "plans: gerar o próprio" on public.study_plans
  for insert to authenticated with check (user_id = (select auth.uid()) and created_by = (select auth.uid()));
create policy "plans: staff cria" on public.study_plans
  for insert to authenticated with check (public.is_staff() and created_by = (select auth.uid()));
create policy "plans: staff ajusta" on public.study_plans
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "goals: ver as próprias" on public.practice_goals
  for select to authenticated using (user_id = (select auth.uid()));
create policy "goals: staff vê" on public.practice_goals
  for select to authenticated using (public.is_staff());
create policy "goals: criar as próprias" on public.practice_goals
  for insert to authenticated with check (user_id = (select auth.uid()) and created_by = (select auth.uid()));
create policy "goals: staff cria" on public.practice_goals
  for insert to authenticated with check (public.is_staff() and created_by = (select auth.uid()));
create policy "goals: atualizar as próprias" on public.practice_goals
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "goals: staff atualiza" on public.practice_goals
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "goals: excluir as que criou" on public.practice_goals
  for delete to authenticated using (created_by = (select auth.uid()) or public.is_director());

-- -----------------------------------------------------------------------------
-- Grupos vocais
-- -----------------------------------------------------------------------------
create policy "groups: leitura" on public.vocal_groups
  for select to authenticated using (public.is_active_member());
create policy "groups: diretor gerencia" on public.vocal_groups
  for all to authenticated using (public.is_director()) with check (public.is_director());

create policy "group_members: leitura" on public.group_members
  for select to authenticated using (public.is_active_member());
create policy "group_members: diretor gerencia" on public.group_members
  for all to authenticated using (public.is_director()) with check (public.is_director());

-- -----------------------------------------------------------------------------
-- Repertório e arranjos
-- -----------------------------------------------------------------------------
create policy "repertoire: leitura" on public.repertoire
  for select to authenticated using (public.is_active_member());
create policy "repertoire: diretor gerencia" on public.repertoire
  for all to authenticated using (public.is_director()) with check (public.is_director());

create policy "arrangements: leitura" on public.arrangements
  for select to authenticated using (public.is_active_member());
create policy "arrangements: diretor gerencia" on public.arrangements
  for all to authenticated using (public.is_director()) with check (public.is_director());

create policy "vocal_parts: leitura" on public.vocal_parts
  for select to authenticated using (public.is_active_member());
create policy "vocal_parts: diretor gerencia" on public.vocal_parts
  for all to authenticated using (public.is_director()) with check (public.is_director());

create policy "assignments: leitura" on public.arrangement_assignments
  for select to authenticated using (public.is_active_member());
create policy "assignments: diretor designa" on public.arrangement_assignments
  for insert to authenticated with check (public.is_director() and assigned_by = (select auth.uid()));
create policy "assignments: diretor ou designado atualiza" on public.arrangement_assignments
  for update to authenticated using (public.is_director() or user_id = (select auth.uid()))
  with check (public.is_director() or user_id = (select auth.uid()));
create policy "assignments: diretor remove" on public.arrangement_assignments
  for delete to authenticated using (public.is_director());

create policy "bookmarks: dono" on public.practice_bookmarks
  for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- -----------------------------------------------------------------------------
-- Ensaios
-- -----------------------------------------------------------------------------
create policy "rehearsals: leitura" on public.rehearsal_sessions
  for select to authenticated using (public.is_active_member());
create policy "rehearsals: diretor cria" on public.rehearsal_sessions
  for insert to authenticated with check (public.is_director() and created_by = (select auth.uid()));
create policy "rehearsals: staff atualiza" on public.rehearsal_sessions
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "rehearsals: diretor remove" on public.rehearsal_sessions
  for delete to authenticated using (public.is_director());

create policy "rehearsal_repertoire: leitura" on public.rehearsal_repertoire
  for select to authenticated using (public.is_active_member());
create policy "rehearsal_repertoire: diretor gerencia" on public.rehearsal_repertoire
  for all to authenticated using (public.is_director()) with check (public.is_director());

create policy "attendance: ver a própria" on public.rehearsal_attendance
  for select to authenticated using (user_id = (select auth.uid()));
create policy "attendance: staff gerencia" on public.rehearsal_attendance
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "rehearsal_notes: staff" on public.rehearsal_notes
  for select to authenticated using (public.is_staff());
create policy "rehearsal_notes: membros veem as liberadas" on public.rehearsal_notes
  for select to authenticated using (public.is_active_member() and visible_to_members);
create policy "rehearsal_notes: staff escreve" on public.rehearsal_notes
  for insert to authenticated with check (public.is_staff() and author_id = (select auth.uid()));
create policy "rehearsal_notes: autor ou diretor remove" on public.rehearsal_notes
  for delete to authenticated using (public.is_director() or author_id = (select auth.uid()));

create policy "tasks: ver as minhas e as do grupo" on public.rehearsal_tasks
  for select to authenticated using (
    assignee_id = (select auth.uid()) or (assignee_id is null and public.is_active_member())
  );
create policy "tasks: staff vê" on public.rehearsal_tasks
  for select to authenticated using (public.is_staff());
create policy "tasks: staff cria" on public.rehearsal_tasks
  for insert to authenticated with check (public.is_staff() and created_by = (select auth.uid()));
create policy "tasks: staff ou responsável atualiza" on public.rehearsal_tasks
  for update to authenticated using (public.is_staff() or assignee_id = (select auth.uid()))
  with check (public.is_staff() or assignee_id = (select auth.uid()));
create policy "tasks: staff remove" on public.rehearsal_tasks
  for delete to authenticated using (public.is_staff());

-- -----------------------------------------------------------------------------
-- Metadados de arquivos
-- -----------------------------------------------------------------------------
create policy "media: gravações só do dono" on public.media_assets
  for select to authenticated using (owner_id = (select auth.uid()));
create policy "media: materiais do ministério" on public.media_assets
  for select to authenticated using (bucket = 'media' and public.is_active_member());
create policy "media: salvar gravação própria" on public.media_assets
  for insert to authenticated with check (
    owner_id = (select auth.uid()) and bucket = 'recordings'
    and path like ((select auth.uid())::text || '/%')
  );
create policy "media: diretor envia materiais" on public.media_assets
  for insert to authenticated with check (
    owner_id = (select auth.uid()) and bucket = 'media' and public.is_director()
  );
create policy "media: dono remove" on public.media_assets
  for delete to authenticated using (owner_id = (select auth.uid()));
create policy "media: diretor remove materiais" on public.media_assets
  for delete to authenticated using (bucket = 'media' and public.is_director());

-- -----------------------------------------------------------------------------
-- Funções expostas via RPC
-- -----------------------------------------------------------------------------
revoke execute on all functions in schema public from public, anon;
grant execute on function public.has_role(public.app_role) to authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_director() to authenticated;
grant execute on function public.is_active_member() to authenticated;
grant execute on function public.member_stats(uuid) to authenticated;
grant execute on function public.collective_challenge() to authenticated;
grant execute on function public.delete_my_account() to authenticated;
grant execute on function public.local_date(timestamptz) to authenticated;
grant execute on function public.has_teacher_classification(uuid) to authenticated;
-- Funções usadas dentro de políticas/gatilhos (executadas como dono)
grant execute on function public.set_updated_at() to authenticated;
grant execute on function public.compute_auto_level(uuid, text) to authenticated;
