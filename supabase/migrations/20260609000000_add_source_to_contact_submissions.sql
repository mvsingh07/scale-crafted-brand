alter table contact_submissions
  add column if not exists source text not null default 'portfolio';
