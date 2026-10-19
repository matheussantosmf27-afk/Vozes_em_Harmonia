-- =============================================================================
-- Vozes em Harmonia — Storage (arquivos privados por padrão)
--   media:      materiais autorizados do ministério (áudios por naipe, MIDI,
--               MusicXML, PDF). Leitura: membros ativos. Escrita: diretor.
--   recordings: gravações pessoais. Somente o dono lê, envia e exclui.
--               Caminho obrigatório: <user_id>/<arquivo>
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media', 'media', false, 52428800, array[
    'audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/wav', 'audio/x-wav', 'audio/webm', 'audio/ogg',
    'audio/midi', 'audio/x-midi', 'application/vnd.recordare.musicxml+xml', 'application/vnd.recordare.musicxml',
    'application/xml', 'text/xml', 'application/pdf', 'image/png', 'image/jpeg'
  ]),
  ('recordings', 'recordings', false, 20971520, array[
    'audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/aac'
  ])
on conflict (id) do nothing;

create policy "media: membros ativos leem"
  on storage.objects for select to authenticated
  using (bucket_id = 'media' and public.is_active_member());

create policy "media: diretor envia"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_director());

create policy "media: diretor atualiza"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_director())
  with check (bucket_id = 'media' and public.is_director());

create policy "media: diretor remove"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_director());

create policy "recordings: dono lê"
  on storage.objects for select to authenticated
  using (bucket_id = 'recordings' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "recordings: dono envia"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'recordings' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "recordings: dono remove"
  on storage.objects for delete to authenticated
  using (bucket_id = 'recordings' and (storage.foldername(name))[1] = (select auth.uid())::text);
