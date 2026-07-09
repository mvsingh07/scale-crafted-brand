-- Ecosystem services: the "How I Can Help" service categories shown on /services.
-- Mirrors ecosystem_projects conventions (username-scoped, is_public, ord).

create table if not exists ecosystem_services (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  title text not null,
  summary text not null default '',
  items text[] not null default '{}',
  impact text not null default '',
  icon_name text not null default 'Sparkles',
  accent text not null default '#C9A55A',
  is_public boolean not null default true,
  ord integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists ecosystem_services_username_idx on ecosystem_services(username);

alter table ecosystem_services enable row level security;

do $$ begin
  create policy "anon_read_ecosystem_services"
    on ecosystem_services for select
    using (is_public = true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "auth_write_ecosystem_services"
    on ecosystem_services for all
    to authenticated
    using (true)
    with check (true);
exception when duplicate_object then null;
end $$;
