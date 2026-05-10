-- ── Profiles ──────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id                uuid default gen_random_uuid() primary key,
  user_id           uuid references auth.users not null unique,
  username          text unique not null,
  name              text not null default '',
  tagline           text not null default '',
  identity_stripe   text not null default '',
  hero_description  text not null default '',
  about_paragraphs  jsonb not null default '[]',
  email             text not null default '',
  phone             text,
  linkedin_url      text,
  github_url        text,
  resume_url        text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

alter table profiles enable row level security;

drop policy if exists "owner select" on profiles;
drop policy if exists "owner insert" on profiles;
drop policy if exists "owner update" on profiles;
drop policy if exists "public read"  on profiles;

create policy "owner insert" on profiles for insert with check (auth.uid() = user_id);
create policy "owner update" on profiles for update using (auth.uid() = user_id);
create policy "public read"  on profiles for select using (true);

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at before update on profiles
  for each row execute function set_updated_at();

-- ── Services ──────────────────────────────────────────────────────────────────
create table if not exists services (
  id          uuid default gen_random_uuid() primary key,
  profile_id  uuid not null references profiles on delete cascade,
  icon_name   text not null default 'Layers',
  title       text not null default '',
  description text not null default '',
  impact      text not null default '',
  accent      text not null default 'from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))]',
  ord         int  not null default 0
);

alter table services enable row level security;

drop policy if exists "owner all"   on services;
drop policy if exists "public read" on services;

create policy "owner all"   on services for all using (
  auth.uid() = (select user_id from profiles where id = profile_id)
);
create policy "public read" on services for select using (true);

-- ── Projects ──────────────────────────────────────────────────────────────────
create table if not exists projects (
  id          uuid default gen_random_uuid() primary key,
  profile_id  uuid not null references profiles on delete cascade,
  number      text not null default '01',
  title       text not null default '',
  tagline     text not null default '',
  problem     text not null default '',
  solution    text not null default '',
  impact      text not null default '',
  stack_tags  jsonb not null default '[]',
  accent      text not null default 'from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))]',
  ord         int  not null default 0
);

alter table projects enable row level security;

drop policy if exists "owner all"   on projects;
drop policy if exists "public read" on projects;

create policy "owner all"   on projects for all using (
  auth.uid() = (select user_id from profiles where id = profile_id)
);
create policy "public read" on projects for select using (true);

-- ── Career Steps ──────────────────────────────────────────────────────────────
create table if not exists career_steps (
  id          uuid default gen_random_uuid() primary key,
  profile_id  uuid not null references profiles on delete cascade,
  chapter     text not null default '',
  year        text not null default '',
  role        text not null default '',
  org         text not null default '',
  body        text not null default '',
  ord         int  not null default 0
);

alter table career_steps enable row level security;

drop policy if exists "owner all"   on career_steps;
drop policy if exists "public read" on career_steps;

create policy "owner all"   on career_steps for all using (
  auth.uid() = (select user_id from profiles where id = profile_id)
);
create policy "public read" on career_steps for select using (true);

-- ── Skill Groups ──────────────────────────────────────────────────────────────
create table if not exists skill_groups (
  id          uuid default gen_random_uuid() primary key,
  profile_id  uuid not null references profiles on delete cascade,
  cluster     text not null default 'Foundation',
  title       text not null default '',
  items       jsonb not null default '[]',
  ord         int  not null default 0
);

alter table skill_groups enable row level security;

drop policy if exists "owner all"   on skill_groups;
drop policy if exists "public read" on skill_groups;

create policy "owner all"   on skill_groups for all using (
  auth.uid() = (select user_id from profiles where id = profile_id)
);
create policy "public read" on skill_groups for select using (true);

-- ── Supabase Storage: resumes bucket ─────────────────────────────────────────
insert into storage.buckets (id, name, public)
  values ('resumes', 'resumes', true)
  on conflict (id) do nothing;

drop policy if exists "owner upload"    on storage.objects;
drop policy if exists "public download" on storage.objects;
drop policy if exists "owner delete"    on storage.objects;

create policy "owner upload" on storage.objects for insert
  with check (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "public download" on storage.objects for select
  using (bucket_id = 'resumes');

create policy "owner delete" on storage.objects for delete
  using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);
