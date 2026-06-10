alter table identity_profile
  add column if not exists about_eyebrow  text,
  add column if not exists about_headline text,
  add column if not exists about_paragraphs jsonb,
  add column if not exists about_stats     jsonb;
