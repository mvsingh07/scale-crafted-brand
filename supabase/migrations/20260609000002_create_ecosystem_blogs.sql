create table if not exists ecosystem_blogs (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  title text not null,
  subtitle text,
  summary text,
  image_url text,
  platform text not null default 'medium'
    check (platform in ('medium', 'reddit', 'linkedin', 'other')),
  url text not null,
  published_at date,
  ord integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists ecosystem_blogs_username_idx on ecosystem_blogs(username);

alter table ecosystem_blogs enable row level security;

do $$ begin
  create policy "anon_read_ecosystem_blogs"
    on ecosystem_blogs for select
    using (is_public = true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "auth_write_ecosystem_blogs"
    on ecosystem_blogs for all
    to authenticated
    using (true)
    with check (true);
exception when duplicate_object then null;
end $$;
