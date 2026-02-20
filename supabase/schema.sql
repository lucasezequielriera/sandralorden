-- Sandra Lorden Admin Dashboard Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ══════════════════════════════════════
-- CLIENTS
-- ══════════════════════════════════════
create table if not exists clients (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text not null,
  service_type text default '',
  goal text default '',
  status text default 'lead' check (status in ('lead', 'active', 'inactive')),
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ══════════════════════════════════════
-- SESSIONS (training/nutrition sessions)
-- ══════════════════════════════════════
create table if not exists sessions (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid not null references clients(id) on delete cascade,
  date timestamptz not null,
  type text default 'virtual' check (type in ('presencial', 'virtual')),
  duration_minutes integer default 60,
  notes text default '',
  created_at timestamptz default now()
);

-- ══════════════════════════════════════
-- FILES
-- ══════════════════════════════════════
create table if not exists files (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid not null references clients(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_type text default '',
  uploaded_at timestamptz default now()
);

-- ══════════════════════════════════════
-- INVOICES
-- ══════════════════════════════════════
create table if not exists invoices (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid not null references clients(id) on delete cascade,
  amount numeric(10,2) not null default 0,
  currency text default 'EUR',
  concept text not null default '',
  status text default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  due_date date,
  paid_date date,
  created_at timestamptz default now()
);

-- ══════════════════════════════════════
-- INDEXES
-- ══════════════════════════════════════
create unique index if not exists idx_clients_email on clients(email);
create index if not exists idx_clients_status on clients(status);
create index if not exists idx_sessions_client on sessions(client_id);
create index if not exists idx_sessions_date on sessions(date);
create index if not exists idx_files_client on files(client_id);
create index if not exists idx_invoices_client on invoices(client_id);
create index if not exists idx_invoices_status on invoices(status);

-- ══════════════════════════════════════
-- AUTO-UPDATE updated_at TRIGGER
-- ══════════════════════════════════════
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger clients_updated_at
  before update on clients
  for each row execute function update_updated_at();

-- ══════════════════════════════════════
-- ROW LEVEL SECURITY
-- Only authenticated users (Sandra) can access
-- ══════════════════════════════════════
alter table clients enable row level security;
alter table sessions enable row level security;
alter table files enable row level security;
alter table invoices enable row level security;

create policy "Authenticated users can read clients"
  on clients for select to authenticated using (true);
create policy "Authenticated users can insert clients"
  on clients for insert to authenticated with check (true);
create policy "Authenticated users can update clients"
  on clients for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete clients"
  on clients for delete to authenticated using (true);

create policy "Authenticated users can read sessions"
  on sessions for select to authenticated using (true);
create policy "Authenticated users can insert sessions"
  on sessions for insert to authenticated with check (true);
create policy "Authenticated users can update sessions"
  on sessions for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete sessions"
  on sessions for delete to authenticated using (true);

create policy "Authenticated users can read files"
  on files for select to authenticated using (true);
create policy "Authenticated users can insert files"
  on files for insert to authenticated with check (true);
create policy "Authenticated users can update files"
  on files for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete files"
  on files for delete to authenticated using (true);

create policy "Authenticated users can read invoices"
  on invoices for select to authenticated using (true);
create policy "Authenticated users can insert invoices"
  on invoices for insert to authenticated with check (true);
create policy "Authenticated users can update invoices"
  on invoices for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete invoices"
  on invoices for delete to authenticated using (true);

-- Service role can insert (for public form submissions)
create policy "Service role can insert clients"
  on clients for insert to service_role with check (true);

-- ══════════════════════════════════════
-- STORAGE BUCKET for client files
-- ══════════════════════════════════════
insert into storage.buckets (id, name, public) values ('client-files', 'client-files', false)
on conflict (id) do nothing;

create policy "Authenticated users can upload files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'client-files');

create policy "Authenticated users can read files"
  on storage.objects for select to authenticated
  using (bucket_id = 'client-files');

create policy "Authenticated users can delete files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'client-files');
