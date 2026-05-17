ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS hero_title   text,
  ADD COLUMN IF NOT EXISTS hero_subtitle text;
