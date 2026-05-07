-- Create contact submissions table
create table if not exists contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  project_role text,
  message text not null,
  created_at timestamptz default now(),
  is_read boolean default false
);

-- Enable RLS
alter table contact_submissions enable row level security;

-- Anyone can submit via the contact form
create policy "public insert"
  on contact_submissions
  for insert
  with check (true);

-- Only authenticated admin can read
create policy "admin select"
  on contact_submissions
  for select
  using (auth.role() = 'authenticated');

-- Only authenticated admin can mark as read
create policy "admin update"
  on contact_submissions
  for update
  using (auth.role() = 'authenticated');
