-- =============================================================================
-- Vozes em Harmonia — regras de negócio no banco
-- (domínio de habilidades, conclusão de aulas, conquistas, estatísticas,
--  proteções de colunas e exclusão de conta)
-- =============================================================================

-- Novas contas aguardam aprovação do diretor musical, exceto a primeira
-- (que se torna diretora). Isso protege os dados pessoais do ministério.
alter table public.profiles alter column is_active set default false;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  first_account boolean;
begin
  first_account := not exists (select 1 from public.user_roles where role = 'diretor');

  insert into public.profiles (id, full_name, is_active)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)),
    first_account
  );

  insert into public.user_roles (user_id, role) values (new.id, 'integrante');

  if first_account then
    insert into public.user_roles (user_id, role) values (new.id, 'diretor');
  end if;

  return new;
end;
$$;

create or replace function public.is_active_member()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.is_active
  );
$$;

-- -----------------------------------------------------------------------------
-- Data local do ministério (para sequência de estudos e metas semanais)
-- -----------------------------------------------------------------------------
create or replace function public.local_date(ts timestamptz)
returns date
language sql
immutable
set search_path = ''
as $$
  select (ts at time zone 'America/Sao_Paulo')::date;
$$;

-- -----------------------------------------------------------------------------
-- Domínio de habilidades
-- Níveis: 1 ainda não iniciado · 2 em familiarização · 3 em desenvolvimento ·
--         4 executado com consistência · 5 aplicado em repertório (só professor)
-- Regras (espelhadas em src/lib/pedagogy/mastery.ts):
--   2: ao menos 1 tentativa (inclui autoavaliações guiadas)
--   3: >= 3 tentativas avaliadas e média das últimas 5 >= 60%
--   4: >= 5 tentativas avaliadas, média das últimas 5 >= 80% e em >= 3 dias
--      diferentes; limitado por skills.auto_max_level
-- -----------------------------------------------------------------------------
create or replace function public.compute_auto_level(p_user uuid, p_skill text)
returns smallint
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  any_count integer;
  graded_count integer;
  recent_avg numeric;
  recent_days integer;
  max_level smallint;
  result smallint := 1;
begin
  if (select auth.uid()) is not null
     and p_user is distinct from (select auth.uid())
     and not public.is_staff() then
    raise exception 'Sem permissão.' using errcode = '42501';
  end if;

  select auto_max_level into max_level from public.skills where slug = p_skill;
  if max_level is null then
    return 1;
  end if;

  select count(*) into any_count
    from public.exercise_attempts a
    join public.exercises e on e.id = a.exercise_id
   where a.user_id = p_user and e.skill_slug = p_skill;

  if any_count = 0 then
    return 1;
  end if;
  result := 2;

  select count(*) into graded_count
    from public.exercise_attempts a
    join public.exercises e on e.id = a.exercise_id
   where a.user_id = p_user and e.skill_slug = p_skill and e.type <> 'self_check';

  select avg(r.score), count(distinct r.d)
    into recent_avg, recent_days
    from (
      select a.score, public.local_date(a.created_at) as d
        from public.exercise_attempts a
        join public.exercises e on e.id = a.exercise_id
       where a.user_id = p_user and e.skill_slug = p_skill and e.type <> 'self_check'
       order by a.created_at desc
       limit 5
    ) r;

  if graded_count >= 3 and recent_avg >= 0.6 then
    result := 3;
  end if;
  if graded_count >= 5 and recent_avg >= 0.8 and recent_days >= 3 then
    result := 4;
  end if;

  return least(result, max_level, 4)::smallint;
end;
$$;

create or replace function public.refresh_skill_mastery(p_user uuid, p_skill text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.skill_mastery (user_id, skill_slug, auto_level)
  values (p_user, p_skill, public.compute_auto_level(p_user, p_skill))
  on conflict (user_id, skill_slug)
  do update set auto_level = excluded.auto_level;
end;
$$;

-- -----------------------------------------------------------------------------
-- Conclusão de aulas: todas as atividades de avaliação da aula precisam
-- atingir a nota mínima (lessons.pass_threshold). Abrir a aula não conclui.
-- -----------------------------------------------------------------------------
create or replace function public.refresh_lesson_progress(p_user uuid, p_lesson uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  threshold numeric;
  required_count integer;
  passed_count integer;
  overall numeric;
begin
  select pass_threshold into threshold from public.lessons where id = p_lesson;
  if threshold is null then
    return;
  end if;

  with best as (
    select e.id, max(a.score) as best_score
      from public.exercises e
      left join public.exercise_attempts a
        on a.exercise_id = e.id and a.user_id = p_user
     where e.lesson_id = p_lesson and e.purpose = 'avaliacao' and e.is_published
     group by e.id
  )
  select count(*), count(*) filter (where best_score >= threshold), avg(coalesce(best_score, 0))
    into required_count, passed_count, overall
    from best;

  insert into public.user_progress (user_id, lesson_id, status, best_score, completed_at)
  values (
    p_user, p_lesson,
    case when required_count > 0 and passed_count = required_count then 'concluida'::public.lesson_status else 'em_andamento'::public.lesson_status end,
    case when required_count > 0 then overall end,
    case when required_count > 0 and passed_count = required_count then now() end
  )
  on conflict (user_id, lesson_id) do update
    set best_score = excluded.best_score,
        status = case when public.user_progress.status = 'concluida' then 'concluida'::public.lesson_status else excluded.status end,
        completed_at = coalesce(public.user_progress.completed_at, excluded.completed_at);
end;
$$;

-- -----------------------------------------------------------------------------
-- Estatísticas individuais (pontos, sequência de dias, frequência)
-- -----------------------------------------------------------------------------
create or replace function public.activity_dates(p_user uuid)
returns table (d date)
language sql
stable
security definer
set search_path = ''
as $$
  select public.local_date(created_at) from public.exercise_attempts where user_id = p_user
  union
  select practiced_on from public.practice_logs where user_id = p_user;
$$;

create or replace function public.current_streak(p_user uuid)
returns integer
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  today date := public.local_date(now());
  cursor_day date;
  streak integer := 0;
begin
  if exists (select 1 from public.activity_dates(p_user) where d = today) then
    cursor_day := today;
  elsif exists (select 1 from public.activity_dates(p_user) where d = today - 1) then
    cursor_day := today - 1;
  else
    return 0;
  end if;

  while exists (select 1 from public.activity_dates(p_user) where d = cursor_day) loop
    streak := streak + 1;
    cursor_day := cursor_day - 1;
  end loop;
  return streak;
end;
$$;

create or replace function public.member_stats(p_user uuid)
returns table (
  points integer,
  streak_days integer,
  active_days_7 integer,
  attempts_total integer,
  lessons_completed integer,
  achievements_count integer,
  practice_minutes_7 integer
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if p_user is distinct from (select auth.uid()) and not public.is_staff() then
    raise exception 'Sem permissão para consultar estas estatísticas.' using errcode = '42501';
  end if;

  return query
  select
    (
      coalesce((select round(sum(a.score) * 10) from public.exercise_attempts a where a.user_id = p_user), 0)
      + coalesce((select count(*) * 50 from public.user_progress up where up.user_id = p_user and up.status = 'concluida'), 0)
      + coalesce((select sum(ac.points) from public.user_achievements ua join public.achievements ac on ac.slug = ua.achievement_slug where ua.user_id = p_user), 0)
      + coalesce((select count(*) * 5 from public.practice_logs pl where pl.user_id = p_user), 0)
    )::integer,
    public.current_streak(p_user),
    (select count(*) from public.activity_dates(p_user) ad where ad.d > public.local_date(now()) - 7)::integer,
    (select count(*) from public.exercise_attempts a where a.user_id = p_user)::integer,
    (select count(*) from public.user_progress up where up.user_id = p_user and up.status = 'concluida')::integer,
    (select count(*) from public.user_achievements ua where ua.user_id = p_user)::integer,
    (
      coalesce((select sum(pl.minutes) from public.practice_logs pl where pl.user_id = p_user and pl.practiced_on > public.local_date(now()) - 7), 0)
      + coalesce((select round(sum(coalesce(a.duration_ms, 0)) / 60000.0) from public.exercise_attempts a where a.user_id = p_user and a.created_at > now() - interval '7 days'), 0)
    )::integer;
end;
$$;

-- Desafio coletivo semanal: soma de dias de estudo de todo o ministério.
-- Não expõe dados individuais (sem ranking).
create or replace function public.collective_challenge()
returns table (week_start date, active_member_days integer, target integer, participants integer, active_members integer)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  ws date := date_trunc('week', public.local_date(now()))::date;
  members integer;
begin
  if not public.is_active_member() then
    raise exception 'Conta ainda não aprovada.' using errcode = '42501';
  end if;

  select count(*) into members from public.profiles where is_active;

  return query
  with days as (
    select a.user_id, public.local_date(a.created_at) as d
      from public.exercise_attempts a
     where public.local_date(a.created_at) >= ws
    union
    select pl.user_id, pl.practiced_on
      from public.practice_logs pl
     where pl.practiced_on >= ws
  )
  select ws,
         (select count(*) from days)::integer,
         greatest(members * 3, 3)::integer,
         (select count(distinct user_id) from days)::integer,
         members;
end;
$$;

-- -----------------------------------------------------------------------------
-- Conquistas (concedidas apenas pelo banco; o usuário não pode inseri-las)
-- -----------------------------------------------------------------------------
create or replace function public.award_achievements(p_user uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  earned text[] := '{}';
begin
  if exists (select 1 from public.vocal_assessments where user_id = p_user and kind = 'inicial') then
    earned := array_append(earned, 'primeiro-passo');
  end if;

  if exists (
    select 1 from public.exercise_attempts a join public.exercises e on e.id = a.exercise_id
     where a.user_id = p_user and e.type = 'sing_note'
       and coalesce((a.details ->> 'stable')::boolean, false) and a.score >= 0.7
  ) then
    earned := array_append(earned, 'primeira-nota-estavel');
  end if;

  if exists (
    select 1 from public.exercise_attempts a join public.exercises e on e.id = a.exercise_id
     where a.user_id = p_user and e.type = 'melody_memory' and a.score >= 0.8
  ) then
    earned := array_append(earned, 'primeira-sequencia-melodica');
  end if;

  if exists (
    select 1 from public.exercise_attempts a join public.exercises e on e.id = a.exercise_id
     where a.user_id = p_user and e.type = 'harmony_part' and a.score >= 0.6
       and coalesce((a.details ->> 'voices')::int, (e.config ->> 'voices')::int, 0) >= 2
  ) then
    earned := array_append(earned, 'primeira-harmonia-duas-vozes');
  end if;

  if exists (
    select 1 from public.exercise_attempts a join public.exercises e on e.id = a.exercise_id
     where a.user_id = p_user and e.type = 'harmony_part' and a.score >= 0.6
       and coalesce((a.details ->> 'voices')::int, (e.config ->> 'voices')::int, 0) >= 4
  ) or exists (
    select 1 from public.rehearsal_attendance ra
      join public.rehearsal_repertoire rr on rr.rehearsal_id = ra.rehearsal_id
      join public.repertoire r on r.id = rr.repertoire_id
     where ra.user_id = p_user and ra.status = 'presente' and r.voices_required >= 4
  ) then
    earned := array_append(earned, 'primeira-participacao-quatro-vozes');
  end if;

  if exists (select 1 from public.arrangement_assignments where user_id = p_user and status = 'pronto') then
    earned := array_append(earned, 'primeira-musica-estudada');
  end if;

  if exists (select 1 from public.vocal_assessments where user_id = p_user and kind in ('periodica', 'professor')) then
    earned := array_append(earned, 'primeira-avaliacao-evolucao');
  end if;

  if exists (select 1 from public.user_progress where user_id = p_user and status = 'concluida') then
    earned := array_append(earned, 'primeira-aula-concluida');
  end if;

  if exists (
    select 1 from public.learning_paths lp
     where lp.is_published
       and exists (select 1 from public.lessons l where l.path_id = lp.id and l.is_published)
       and not exists (
         select 1 from public.lessons l
          where l.path_id = lp.id and l.is_published
            and not exists (
              select 1 from public.user_progress up
               where up.lesson_id = l.id and up.user_id = p_user and up.status = 'concluida'
            )
       )
  ) then
    earned := array_append(earned, 'trilha-concluida');
  end if;

  if (
    select count(*) from public.exercise_attempts a join public.exercises e on e.id = a.exercise_id
     where a.user_id = p_user and e.purpose = 'laboratorio'
  ) >= 30 then
    earned := array_append(earned, 'ouvido-atento');
  end if;

  if public.current_streak(p_user) >= 7 then
    earned := array_append(earned, 'constancia-sete-dias');
  end if;

  if exists (select 1 from public.rehearsal_attendance where user_id = p_user and status = 'presente') then
    earned := array_append(earned, 'presenca-no-ensaio');
  end if;

  insert into public.user_achievements (user_id, achievement_slug)
  select p_user, s from unnest(earned) as s
   where exists (select 1 from public.achievements where slug = s)
  on conflict do nothing;
end;
$$;

-- -----------------------------------------------------------------------------
-- Gatilhos de tentativas
-- -----------------------------------------------------------------------------
create or replace function public.after_attempt_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  ex record;
begin
  select skill_slug, lesson_id into ex from public.exercises where id = new.exercise_id;
  perform public.refresh_skill_mastery(new.user_id, ex.skill_slug);
  if ex.lesson_id is not null then
    perform public.refresh_lesson_progress(new.user_id, ex.lesson_id);
  end if;
  perform public.award_achievements(new.user_id);
  return null;
end;
$$;

create trigger exercise_attempts_after_insert
  after insert on public.exercise_attempts
  for each row execute function public.after_attempt_insert();

create or replace function public.after_attempt_delete()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  ex record;
begin
  -- Ao excluir a conta, o perfil já não existe: nada a recalcular.
  if not exists (select 1 from public.profiles where id = old.user_id) then
    return null;
  end if;
  select skill_slug into ex from public.exercises where id = old.exercise_id;
  if ex.skill_slug is not null then
    perform public.refresh_skill_mastery(old.user_id, ex.skill_slug);
  end if;
  return null;
end;
$$;

create trigger exercise_attempts_after_delete
  after delete on public.exercise_attempts
  for each row execute function public.after_attempt_delete();

create or replace function public.award_achievements_trigger()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.award_achievements(new.user_id);
  return null;
end;
$$;

create trigger vocal_assessments_achievements after insert on public.vocal_assessments
  for each row execute function public.award_achievements_trigger();
create trigger practice_logs_achievements after insert on public.practice_logs
  for each row execute function public.award_achievements_trigger();
create trigger assignments_achievements after insert or update of status on public.arrangement_assignments
  for each row execute function public.award_achievements_trigger();
create trigger attendance_achievements after insert or update of status on public.rehearsal_attendance
  for each row execute function public.award_achievements_trigger();

-- -----------------------------------------------------------------------------
-- Proteções de colunas para usuários autenticados (o painel do Supabase e
-- funções security definer não são afetados).
-- -----------------------------------------------------------------------------
create or replace function public.guard_profile_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user = 'authenticated' and not public.is_director() then
    if new.is_active is distinct from old.is_active or new.is_demo is distinct from old.is_demo then
      raise exception 'Apenas o diretor musical pode alterar o status da conta.' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;
create trigger profiles_guard before update on public.profiles
  for each row execute function public.guard_profile_update();

create or replace function public.guard_skill_mastery_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user = 'authenticated' then
    if new.auto_level is distinct from old.auto_level then
      raise exception 'O nível automático é calculado pelo sistema.' using errcode = '42501';
    end if;
    new.updated_by := (select auth.uid());
  end if;
  return new;
end;
$$;
create trigger skill_mastery_guard before update on public.skill_mastery
  for each row execute function public.guard_skill_mastery_update();

create or replace function public.guard_skill_mastery_insert()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user = 'authenticated' then
    new.auto_level := public.compute_auto_level(new.user_id, new.skill_slug);
    new.updated_by := (select auth.uid());
  end if;
  return new;
end;
$$;
create trigger skill_mastery_guard_insert before insert on public.skill_mastery
  for each row execute function public.guard_skill_mastery_insert();

create or replace function public.guard_assignment_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user = 'authenticated' and not public.is_director() then
    if new.vocal_part_id is distinct from old.vocal_part_id
       or new.user_id is distinct from old.user_id
       or new.assigned_by is distinct from old.assigned_by then
      raise exception 'Você só pode alterar o status do seu estudo.' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;
create trigger arrangement_assignments_guard before update on public.arrangement_assignments
  for each row execute function public.guard_assignment_update();

create or replace function public.guard_task_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user = 'authenticated' and not public.is_staff() then
    if new.title is distinct from old.title
       or new.description is distinct from old.description
       or new.due_on is distinct from old.due_on
       or new.assignee_id is distinct from old.assignee_id
       or new.rehearsal_id is distinct from old.rehearsal_id then
      raise exception 'Você só pode marcar a tarefa como concluída.' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;
create trigger rehearsal_tasks_guard before update on public.rehearsal_tasks
  for each row execute function public.guard_task_update();

create or replace function public.guard_goal_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user = 'authenticated' and not public.is_staff()
     and old.created_by is distinct from (select auth.uid()) then
    if new.title is distinct from old.title
       or new.description is distinct from old.description
       or new.horizon_weeks is distinct from old.horizon_weeks
       or new.skill_slug is distinct from old.skill_slug
       or new.target_level is distinct from old.target_level
       or new.due_on is distinct from old.due_on then
      raise exception 'Metas definidas pelo professor: altere apenas o status e suas anotações.' using errcode = '42501';
    end if;
  end if;
  if new.user_id is distinct from old.user_id then
    raise exception 'Não é possível transferir metas.' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger practice_goals_guard before update on public.practice_goals
  for each row execute function public.guard_goal_update();

-- -----------------------------------------------------------------------------
-- Exclusão da própria conta (LGPD). Os arquivos do Storage são removidos
-- pela aplicação antes desta chamada.
-- -----------------------------------------------------------------------------
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := (select auth.uid());
begin
  if me is null then
    raise exception 'Não autenticado.' using errcode = '42501';
  end if;
  if exists (select 1 from public.user_roles where user_id = me and role = 'diretor')
     and not exists (select 1 from public.user_roles where role = 'diretor' and user_id <> me) then
    raise exception 'Você é o único diretor musical. Designe outro diretor antes de excluir sua conta.';
  end if;
  delete from public.media_assets where owner_id = me;
  delete from auth.users where id = me;
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
