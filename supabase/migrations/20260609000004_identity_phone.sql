alter table identity_profile
  add column if not exists phone text;


alter table identity_profile
  add column if not exists email text;
