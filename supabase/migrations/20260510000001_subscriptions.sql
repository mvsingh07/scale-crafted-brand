-- ── Subscription columns on profiles ─────────────────────────────────────────
alter table profiles
  add column if not exists subscription_status text not null default 'trial'
    check (subscription_status in ('trial', 'active', 'expired')),
  add column if not exists trial_ends_at     timestamptz,
  add column if not exists razorpay_customer_id text,
  add column if not exists razorpay_sub_id   text,
  add column if not exists current_plan      text
    check (current_plan in ('monthly', 'halfyearly', 'annual')),
  add column if not exists plan_ends_at      timestamptz;

-- Back-fill trial_ends_at for rows that pre-date this migration
update profiles
  set trial_ends_at = created_at + interval '30 days'
  where trial_ends_at is null;

create or replace function set_trial_ends_at()
returns trigger language plpgsql as $$
begin
  if new.trial_ends_at is null then
    new.trial_ends_at := coalesce(new.created_at, now()) + interval '30 days';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_trial_ends_at on profiles;
create trigger profiles_trial_ends_at
  before insert on profiles
  for each row execute function set_trial_ends_at();

-- ── Transactions ──────────────────────────────────────────────────────────────
create table if not exists transactions (
  id                  uuid default gen_random_uuid() primary key,
  profile_id          uuid not null references profiles on delete cascade,
  razorpay_payment_id text,
  razorpay_sub_id     text,
  plan                text not null check (plan in ('monthly', 'halfyearly', 'annual')),
  amount_paise        int  not null,
  status              text not null default 'captured'
    check (status in ('captured', 'failed', 'refunded')),
  created_at          timestamptz default now()
);

alter table transactions enable row level security;

drop policy if exists "owner read" on transactions;
create policy "owner read" on transactions for select
  using (auth.uid() = (select user_id from profiles where id = profile_id));

-- ── Admin config (single-row, super-admin only) ───────────────────────────────
create table if not exists admin_config (
  id                    int primary key default 1 check (id = 1),
  razorpay_key_id       text,
  plan_id_monthly       text,
  plan_id_halfyearly    text,
  plan_id_annual        text,
  trial_days            int  not null default 30,
  mode                  text not null default 'test'
    check (mode in ('test', 'live')),
  updated_at            timestamptz default now()
);

insert into admin_config (id) values (1) on conflict (id) do nothing;

alter table admin_config enable row level security;

drop policy if exists "superadmin only" on admin_config;
create policy "superadmin only" on admin_config for all
  using ((auth.jwt() ->> 'email') = 'manvirsinghashat@gmail.com');
