-- =============================================================================
-- Vozes em Harmonia — permissões de execução das funções
-- O Supabase hospedado concede EXECUTE ao papel `authenticated` em toda função
-- nova do schema public (privilégios padrão). Funções internas como
-- activity_dates(p_user) e current_streak(p_user) ficariam expostas via RPC e
-- revelariam a atividade de outras pessoas. Aqui revogamos tudo e concedemos
-- somente o necessário. Gatilhos não dependem de EXECUTE ao disparar.
-- =============================================================================

alter default privileges in schema public revoke execute on functions from public, anon, authenticated;

revoke execute on all functions in schema public from public, anon, authenticated;

-- Usadas pelas políticas de RLS
grant execute on function public.has_role(public.app_role) to authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_director() to authenticated;
grant execute on function public.is_active_member() to authenticated;
grant execute on function public.has_teacher_classification(uuid) to authenticated;
grant execute on function public.local_date(timestamptz) to authenticated;
-- Chamadas pelo app via RPC (cada uma verifica permissões internamente)
grant execute on function public.member_stats(uuid) to authenticated;
grant execute on function public.collective_challenge() to authenticated;
grant execute on function public.delete_my_account() to authenticated;
-- Usadas por gatilhos executados como o próprio usuário
grant execute on function public.set_updated_at() to authenticated;
grant execute on function public.compute_auto_level(uuid, text) to authenticated;
