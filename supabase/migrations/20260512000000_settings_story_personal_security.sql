-- ── Profile settings columns ──────────────────────────────────────────────────
alter table profiles
  add column if not exists dashboard_theme  text not null default 'dark',
  add column if not exists resume_visibility text not null default 'public',
  add column if not exists story_mode        text not null default 'brief',
  add column if not exists font_config       jsonb,
  add column if not exists personal_image_url text,
  add column if not exists personal_headline  text,
  add column if not exists personal_details   jsonb not null default '[]';

-- ── Story details on career_steps ─────────────────────────────────────────────
alter table career_steps
  add column if not exists story_details jsonb not null default '[]';

-- ── Storage security: restrict resumes listing to owners only ─────────────────
-- The "public download" policy allowed ANY client to list ALL files in the
-- resumes bucket via the storage API, exposing every user's resume path.
-- Public CDN URL access for known URLs still works independently of this policy.
drop policy if exists "public download" on storage.objects;

create policy "owner list resumes" on storage.objects for select
  using (
    bucket_id = 'resumes'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
