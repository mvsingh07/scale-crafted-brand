-- migration: 20260601000000_ecosystem_theme.sql

create table public.ecosystem_theme (
  id               uuid primary key default gen_random_uuid(),
  username         text not null unique,

  -- Backgrounds
  bg_primary       text not null default '#0A0A0A',
  bg_secondary     text not null default '#111827',

  -- Accent colours
  gold_primary     text not null default '#C9A55A',
  gold_highlight   text not null default '#E0C27A',
  gold_border      text not null default '#9C7A35',
  silver           text not null default '#C7CDD6',

  -- Typography colours
  text_primary     text not null default '#F8FAFC',
  text_muted       text not null default '#D1D5DB',

  -- Typography fonts
  font_heading     text not null default 'Cinzel',
  font_body        text not null default 'Inter',

  -- Border
  border_radius    text not null default '24px',

  -- Mode
  default_mode     text not null default 'dark'
                   check (default_mode in ('dark', 'light')),

  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

alter table public.ecosystem_theme enable row level security;

create policy "public read ecosystem_theme"
  on public.ecosystem_theme for select
  using (true);

create policy "auth write ecosystem_theme"
  on public.ecosystem_theme for all
  using (auth.role() = 'authenticated');

-- Seed: mvsingh defaults
insert into public.ecosystem_theme (
  username,
  bg_primary, bg_secondary,
  gold_primary, gold_highlight, gold_border,
  silver,
  text_primary, text_muted,
  font_heading, font_body,
  border_radius, default_mode
) values (
  'mvsingh',
  '#0A0A0A', '#111827',
  '#C9A55A', '#E0C27A', '#9C7A35',
  '#C7CDD6',
  '#F8FAFC', '#D1D5DB',
  'Cinzel', 'Inter',
  '24px', 'dark'
)
on conflict (username) do nothing;
