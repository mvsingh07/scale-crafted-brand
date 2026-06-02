-- migration: 20260601000002_deprecate_profile_theme_fields.sql
-- Clear stale per-profile overrides; ecosystem_theme is now authoritative

update public.profiles
set font_config = null
where username = 'mvsingh';

comment on column public.profiles.dashboard_theme is 'Deprecated — use ecosystem_theme table';
comment on column public.profiles.font_config     is 'Deprecated — use ecosystem_theme table';
