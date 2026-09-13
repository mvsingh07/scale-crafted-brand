-- Allow the project editor to upload project cover images to the public
-- `site-images` bucket.
--
-- The bucket itself must exist in Supabase Storage. Create it in the dashboard
-- with name `site-images` and mark it as Public, then apply this migration.

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists "public read site-images" on storage.objects;
create policy "public read site-images"
  on storage.objects for select
  to public
  using (bucket_id = 'site-images');

drop policy if exists "authenticated can upload site-images" on storage.objects;
create policy "authenticated can upload site-images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-images');

drop policy if exists "authenticated can update site-images" on storage.objects;
create policy "authenticated can update site-images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-images')
  with check (bucket_id = 'site-images');

drop policy if exists "authenticated can delete site-images" on storage.objects;
create policy "authenticated can delete site-images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-images');
