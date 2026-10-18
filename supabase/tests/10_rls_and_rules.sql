-- Testes de RLS e regras de negócio (executados por scripts/test-db.sh)
\set ON_ERROR_STOP 1
\o /dev/null

create schema if not exists tests;
grant usage on schema tests to authenticated;

create or replace function tests.ok(cond boolean, msg text) returns void language plpgsql as $$
begin
  if cond is not true then raise exception 'FALHOU: %', msg; end if;
  raise notice 'ok - %', msg;
end $$;

create or replace function tests.fails(stmt text, msg text) returns void language plpgsql as $$
begin
  begin
    execute stmt;
  exception when others then
    raise notice 'ok - % (bloqueado: %)', msg, sqlerrm;
    return;
  end;
  raise exception 'FALHOU: % (deveria ter sido bloqueado)', msg;
end $$;

create or replace function tests.as_user(uid uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', uid::text, true);
  execute 'set local role authenticated';
end $$;

grant execute on all functions in schema tests to authenticated;

-- Conteúdo mínimo (caso o seed de conteúdo não tenha sido aplicado)
insert into public.skills (slug, name, category, description, auto_max_level)
values ('teste-afinacao', 'Afinação (teste)', 'afinacao', 'teste', 4)
on conflict do nothing;
insert into public.learning_paths (slug, code, title) values ('trilha-teste', 'T', 'Trilha teste') on conflict do nothing;
insert into public.lessons (path_id, slug, title, content, pass_threshold)
select id, 'aula-teste', 'Aula teste', '{}'::jsonb, 0.7 from public.learning_paths where slug = 'trilha-teste'
on conflict do nothing;
insert into public.exercises (slug, lesson_id, title, type, skill_slug, purpose)
select 'ex-teste-avaliacao', id, 'Avaliação teste', 'interval_id', 'teste-afinacao', 'avaliacao' from public.lessons where slug = 'aula-teste'
on conflict do nothing;
insert into public.exercises (slug, title, type, skill_slug, purpose)
values ('ex-teste-nota', 'Nota sustentada teste', 'sing_note', 'teste-afinacao', 'laboratorio')
on conflict do nothing;

insert into public.achievements (slug, title, description, points) values
  ('primeira-aula-concluida', 'Primeira aula', 'teste', 20),
  ('presenca-no-ensaio', 'Presença', 'teste', 10)
on conflict do nothing;

-- Usuários
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-0000000000d1', 'diretor@teste.local', '{"full_name":"Diretora Teste"}'),
  ('00000000-0000-0000-0000-0000000000a1', 'ana@teste.local', '{"full_name":"Ana Teste"}'),
  ('00000000-0000-0000-0000-0000000000b1', 'bruno@teste.local', '{"full_name":"Bruno Teste"}'),
  ('00000000-0000-0000-0000-0000000000c1', 'prof@teste.local', '{"full_name":"Professor Teste"}');

select tests.ok((select count(*) from public.profiles) = 4, 'perfis criados pelo gatilho');
select tests.ok(public.has_role('diretor') is false, 'sem sessão não há papel');
select tests.ok((select count(*) from public.user_roles where role = 'diretor') = 1, 'apenas a primeira conta vira diretora');
select tests.ok((select is_active from public.profiles where id = '00000000-0000-0000-0000-0000000000d1'), 'primeira conta ativa');
select tests.ok(not (select is_active from public.profiles where id = '00000000-0000-0000-0000-0000000000a1'), 'novas contas aguardam aprovação');

-- Conta pendente não vê dados compartilhados
select id as ex_id from public.exercises where slug = 'ex-teste-avaliacao' \gset
begin;
select tests.as_user('00000000-0000-0000-0000-0000000000a1');
select tests.ok((select count(*) from public.profiles) = 1, 'pendente vê apenas o próprio perfil');
select tests.ok((select count(*) from public.lessons) = 0, 'pendente não vê aulas');
select tests.fails(format($$insert into public.exercise_attempts (user_id, exercise_id, score) values ('00000000-0000-0000-0000-0000000000a1', %L, 1)$$, :'ex_id'), 'pendente não registra tentativas');
select tests.fails($$update public.profiles set is_active = true where id = '00000000-0000-0000-0000-0000000000a1'$$, 'integrante não se autoaprova');
commit;

-- Diretor aprova e concede papel de professor
begin;
select tests.as_user('00000000-0000-0000-0000-0000000000d1');
update public.profiles set is_active = true where id <> '00000000-0000-0000-0000-0000000000d1';
insert into public.user_roles (user_id, role, granted_by) values ('00000000-0000-0000-0000-0000000000c1', 'professor', '00000000-0000-0000-0000-0000000000d1');
select tests.fails($$delete from public.user_roles where user_id = '00000000-0000-0000-0000-0000000000d1' and role = 'diretor'$$, 'o único diretor não pode remover o próprio papel');
commit;
select tests.ok((select count(*) from public.profiles where is_active) = 4, 'diretor aprovou as contas');

-- Integrante: prática, domínio e conclusão de aula
begin;
select tests.as_user('00000000-0000-0000-0000-0000000000a1');
select tests.ok((select count(*) from public.profiles) = 4, 'membro ativo vê nomes do ministério');
select tests.fails($$insert into public.user_roles (user_id, role, granted_by) values ('00000000-0000-0000-0000-0000000000a1', 'diretor', '00000000-0000-0000-0000-0000000000a1')$$, 'integrante não concede papéis');
select tests.fails($$insert into public.user_progress (user_id, lesson_id, status) select '00000000-0000-0000-0000-0000000000a1', id, 'concluida' from public.lessons where slug = 'aula-teste'$$, 'integrante não marca aula como concluída');
insert into public.user_progress (user_id, lesson_id) select '00000000-0000-0000-0000-0000000000a1', id from public.lessons where slug = 'aula-teste';
insert into public.exercise_attempts (user_id, exercise_id, score, correct_count, total_count)
select '00000000-0000-0000-0000-0000000000a1', id, 0.5, 4, 8 from public.exercises where slug = 'ex-teste-avaliacao';
select tests.ok((select status from public.user_progress where user_id = '00000000-0000-0000-0000-0000000000a1') = 'em_andamento', 'nota abaixo do mínimo não conclui a aula');
select tests.ok((select level from public.skill_mastery where user_id = '00000000-0000-0000-0000-0000000000a1' and skill_slug = 'teste-afinacao') = 2, 'primeira tentativa: em familiarização');
insert into public.exercise_attempts (user_id, exercise_id, score, correct_count, total_count)
select '00000000-0000-0000-0000-0000000000a1', id, 0.875, 7, 8 from public.exercises where slug = 'ex-teste-avaliacao';
select tests.ok((select status from public.user_progress where user_id = '00000000-0000-0000-0000-0000000000a1') = 'concluida', 'nota mínima conclui a aula');
select tests.ok(exists (select 1 from public.user_achievements where achievement_slug = 'primeira-aula-concluida'), 'conquista de primeira aula concedida pelo banco');
select tests.fails($$insert into public.user_achievements (user_id, achievement_slug) select '00000000-0000-0000-0000-0000000000a1', slug from public.achievements limit 1$$, 'integrante não cria conquistas');
update public.skill_mastery set teacher_level = 5;
select tests.ok((select level from public.skill_mastery where user_id = '00000000-0000-0000-0000-0000000000a1') = 2, 'integrante não altera o próprio domínio');
select tests.ok((select points from public.member_stats('00000000-0000-0000-0000-0000000000a1')) > 0, 'pontuação calculada');
select tests.ok((select streak_days from public.member_stats('00000000-0000-0000-0000-0000000000a1')) = 1, 'sequência de 1 dia');
select tests.fails($$select * from public.member_stats('00000000-0000-0000-0000-0000000000b1')$$, 'integrante não vê estatísticas de outra pessoa');
select tests.ok((select participants from public.collective_challenge()) = 1, 'desafio coletivo agrega sem identificar');
-- Classificação provisória automática
insert into public.vocal_assessments (user_id, kind, questionnaire) values ('00000000-0000-0000-0000-0000000000a1', 'inicial', '{}');
insert into public.vocal_classifications (user_id, classification, status) values ('00000000-0000-0000-0000-0000000000a1', 'contralto', 'provisoria');
select tests.fails($$insert into public.vocal_classifications (user_id, classification, status) values ('00000000-0000-0000-0000-0000000000a1', 'soprano', 'confirmada')$$, 'integrante não confirma a própria classificação');
-- Gravações privadas
insert into storage.objects (bucket_id, name) values ('recordings', '00000000-0000-0000-0000-0000000000a1/nota.webm');
select tests.fails($$insert into storage.objects (bucket_id, name) values ('recordings', '00000000-0000-0000-0000-0000000000b1/intruso.webm')$$, 'não grava na pasta de outra pessoa');
select tests.fails($$insert into storage.objects (bucket_id, name) values ('media', 'partitura.pdf')$$, 'integrante não envia materiais do ministério');
select tests.fails($$insert into public.repertoire (title) values ('Música')$$, 'integrante não cadastra repertório');
commit;

-- Outro integrante não vê os registros da Ana
begin;
select tests.as_user('00000000-0000-0000-0000-0000000000b1');
select tests.ok((select count(*) from public.exercise_attempts) = 0, 'tentativas são privadas');
select tests.ok((select count(*) from public.vocal_classifications) = 0, 'classificações são privadas');
select tests.ok((select count(*) from storage.objects where bucket_id = 'recordings') = 0, 'gravações de outros não são visíveis');
commit;

-- Professor acompanha e classifica; histórico preservado
begin;
select tests.as_user('00000000-0000-0000-0000-0000000000c1');
select tests.ok((select count(*) from public.exercise_attempts) = 2, 'professor vê tentativas');
select tests.ok((select count(*) from storage.objects where bucket_id = 'recordings') = 0, 'professor não ouve gravações privadas');
insert into public.vocal_classifications (user_id, classification, status, classified_by)
values ('00000000-0000-0000-0000-0000000000a1', 'mezzo_soprano', 'em_desenvolvimento', '00000000-0000-0000-0000-0000000000c1');
update public.skill_mastery set teacher_level = 5, evidence = 'Cantou a linha de contralto no culto' where user_id = '00000000-0000-0000-0000-0000000000a1';
insert into public.teacher_observations (user_id, author_id, content, visible_to_member) values
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000c1', 'Ótima evolução na sustentação.', true),
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000c1', 'Nota interna da equipe.', false);
select tests.fails($$insert into public.repertoire (title) values ('Música')$$, 'professor não gerencia repertório');
commit;
select tests.ok((select count(*) from public.vocal_classifications where user_id = '00000000-0000-0000-0000-0000000000a1') = 2, 'histórico de classificações preservado');
select tests.ok((select classification from public.vocal_classifications where user_id = '00000000-0000-0000-0000-0000000000a1' and is_current) = 'mezzo_soprano', 'classificação do professor é a atual');
select tests.ok((select level from public.skill_mastery where user_id = '00000000-0000-0000-0000-0000000000a1') = 5, 'professor registra aplicação em repertório');

begin;
select tests.as_user('00000000-0000-0000-0000-0000000000a1');
select tests.fails($$insert into public.vocal_classifications (user_id, classification, status) values ('00000000-0000-0000-0000-0000000000a1', 'soprano', 'provisoria')$$, 'sugestão automática não substitui a do professor');
select tests.ok((select count(*) from public.teacher_observations) = 1, 'integrante vê só observações liberadas');
commit;

-- Repertório: letra exige autorização
begin;
select tests.as_user('00000000-0000-0000-0000-0000000000d1');
select tests.fails($$insert into public.repertoire (title, lyrics, license_status) values ('Sem licença', 'letra', 'autorizacao_pendente')$$, 'letra sem autorização é recusada');
insert into public.repertoire (title, license_status, voices_required, lyrics) values ('Hino teste', 'dominio_publico', 4, 'Texto em domínio público');
insert into public.rehearsal_sessions (title, starts_at, created_by) values ('Ensaio teste', now(), '00000000-0000-0000-0000-0000000000d1');
insert into public.rehearsal_repertoire (rehearsal_id, repertoire_id) select r.id, m.id from public.rehearsal_sessions r, public.repertoire m;
insert into public.rehearsal_attendance (rehearsal_id, user_id, status) select id, '00000000-0000-0000-0000-0000000000b1', 'presente' from public.rehearsal_sessions;
insert into public.rehearsal_tasks (rehearsal_id, assignee_id, title, created_by) select id, '00000000-0000-0000-0000-0000000000b1', 'Estudar compassos 1-8', '00000000-0000-0000-0000-0000000000d1' from public.rehearsal_sessions;
commit;

begin;
select tests.as_user('00000000-0000-0000-0000-0000000000b1');
select tests.ok(exists (select 1 from public.user_achievements where achievement_slug = 'presenca-no-ensaio'), 'conquista de presença no ensaio');
update public.rehearsal_tasks set done_at = now();
select tests.fails($$update public.rehearsal_tasks set title = 'outra'$$, 'responsável só marca a tarefa como feita');
select tests.ok((select count(*) from public.rehearsal_attendance) = 1, 'integrante vê apenas a própria presença');
commit;

-- Exclusão de conta (LGPD)
begin;
select tests.as_user('00000000-0000-0000-0000-0000000000d1');
select tests.fails($$select public.delete_my_account()$$, 'único diretor não exclui a conta');
commit;

begin;
select tests.as_user('00000000-0000-0000-0000-0000000000a1');
select public.delete_my_account();
commit;
select tests.ok(not exists (select 1 from public.profiles where id = '00000000-0000-0000-0000-0000000000a1'), 'perfil excluído');
select tests.ok(not exists (select 1 from public.exercise_attempts where user_id = '00000000-0000-0000-0000-0000000000a1'), 'tentativas excluídas em cascata');
select tests.ok(not exists (select 1 from public.vocal_classifications where user_id = '00000000-0000-0000-0000-0000000000a1'), 'classificações excluídas em cascata');

-- Limpeza
delete from auth.users;
delete from public.repertoire;
delete from public.rehearsal_sessions;
delete from storage.objects;
delete from public.exercises where slug like 'ex-teste-%';
delete from public.lessons where slug = 'aula-teste';
delete from public.learning_paths where slug = 'trilha-teste';
delete from public.skills where slug = 'teste-afinacao';
delete from public.achievements where description = 'teste';
drop schema tests cascade;
