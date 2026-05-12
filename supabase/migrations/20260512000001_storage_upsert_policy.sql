-- Supabase Storage upsert (upload with upsert:true) issues an UPDATE on
-- storage.objects when the file already exists. Without an UPDATE policy the
-- operation is blocked with "new row violated row level security policy".

drop policy if exists "owner update" on storage.objects;

create policy "owner update" on storage.objects for update
  using  (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);
