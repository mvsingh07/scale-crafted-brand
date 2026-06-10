create table if not exists ecosystem_projects (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  title text not null,
  tagline text not null default '',
  description text not null default '',
  status text not null default 'active'
    check (status in ('active', 'completed', 'paused')),
  live_url text,
  code_url text,
  stack_tags text[] not null default '{}',
  seeking text[] not null default '{}',
  cover_image_url text,
  is_public boolean not null default true,
  ord integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists ecosystem_projects_username_idx on ecosystem_projects(username);

alter table ecosystem_projects enable row level security;

do $$ begin
  create policy "anon_read_ecosystem_projects"
    on ecosystem_projects for select
    using (is_public = true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "auth_write_ecosystem_projects"
    on ecosystem_projects for all
    to authenticated
    using (true)
    with check (true);
exception when duplicate_object then null;
end $$;
