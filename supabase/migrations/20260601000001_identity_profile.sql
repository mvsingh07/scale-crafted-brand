-- migration: 20260601000001_identity_profile.sql

create table public.identity_profile (
  id                   uuid primary key default gen_random_uuid(),
  username             text not null unique,

  -- Identity
  display_name         text not null default 'MV Singh',
  tagline              text not null default 'Igniting Innovation through continuous learning',

  -- Logos
  logo_dark_url        text,
  logo_light_url       text,
  favicon_url          text,

  -- Site metadata
  site_url             text not null default 'https://mvsingh.in',
  meta_title           text not null default 'MV Singh — Personal Hub',
  meta_description     text,

  -- Social links
  linkedin_url         text,
  github_url           text,
  twitter_url          text,
  instagram_url        text,

  -- Nav links: [{label, href, order}]
  nav_links            jsonb not null default '[
    {"label": "About",    "href": "/about",    "order": 1},
    {"label": "Portfolio","href": "/portfolio","order": 2},
    {"label": "Services", "href": "/services", "order": 3},
    {"label": "Blog",     "href": "/blog",     "order": 4},
    {"label": "Contact",  "href": "/contact",  "order": 5}
  ]'::jsonb,

  -- Hub page text states (Screen 3 slider): [{title, subtitle}]
  hub_text_states      jsonb not null default '[
    {"title": "MV Singh",          "subtitle": "Igniting Innovation through continuous learning"},
    {"title": "Digital Architect", "subtitle": "Crafting immersive digital experiences that blend creativity and technology."},
    {"title": "AI Strategist",     "subtitle": "Empowering businesses to harness the transformative potential of AI for growth and innovation."}
  ]'::jsonb,

  -- Footer
  footer_text          text not null default 'mvsingh.in · All rights reserved',

  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

alter table public.identity_profile enable row level security;

create policy "public read identity_profile"
  on public.identity_profile for select
  using (true);

create policy "auth write identity_profile"
  on public.identity_profile for all
  using (auth.role() = 'authenticated');

-- Seed: mvsingh defaults
insert into public.identity_profile (
  username,
  display_name,
  tagline,
  site_url,
  meta_title,
  meta_description,
  footer_text
) values (
  'mvsingh',
  'MV Singh',
  'Igniting Innovation through continuous learning',
  'https://mvsingh.in',
  'MV Singh — Digital Architect & AI Strategist',
  'Full-stack engineer and brand builder. Tech, Brand, Blogs.',
  'mvsingh.in · © 2026 · All rights reserved'
)
on conflict (username) do nothing;
