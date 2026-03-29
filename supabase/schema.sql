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
  stripe_customer_id text,
  stripe_subscription_id text,
  service_type text default '',
  modality text default 'virtual' check (modality in ('presencial', 'virtual')),
  goal text default '',
  status text default 'lead' check (status in ('lead', 'active', 'inactive')),
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- To add modality to an existing table, run:
-- alter table clients add column if not exists modality text default 'virtual' check (modality in ('presencial', 'virtual'));
-- alter table clients add column if not exists stripe_customer_id text;
-- alter table clients add column if not exists stripe_subscription_id text;

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
-- ACTIVITY LOGS
-- ══════════════════════════════════════
create table if not exists activity_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid,
  client_id uuid references clients(id) on delete cascade,
  action text not null,
  details text default '',
  created_at timestamptz default now()
);

-- ══════════════════════════════════════
-- USER ROLES
-- ══════════════════════════════════════
create table if not exists user_roles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'client' check (role in ('admin', 'client')),
  created_at timestamptz default now(),
  constraint unique_user_role unique (user_id)
);

create or replace function public.get_user_role()
returns text
language sql
security definer
stable
as $$
  select role from public.user_roles where user_id = auth.uid();
$$;

create or replace function public.get_auth_email()
returns text
language sql
security definer
stable
as $$
  select email from auth.users where id = auth.uid();
$$;

-- ══════════════════════════════════════
-- INDEXES
-- ══════════════════════════════════════
create unique index if not exists idx_clients_email on clients(email);
create index if not exists idx_clients_stripe_customer on clients(stripe_customer_id);
create index if not exists idx_clients_stripe_subscription on clients(stripe_subscription_id);
create index if not exists idx_clients_status on clients(status);
create index if not exists idx_sessions_client on sessions(client_id);
create index if not exists idx_sessions_date on sessions(date);
create index if not exists idx_files_client on files(client_id);
create index if not exists idx_invoices_client on invoices(client_id);
create index if not exists idx_invoices_status on invoices(status);
create index if not exists idx_logs_created on activity_logs(created_at desc);
create index if not exists idx_logs_client on activity_logs(client_id);
create index if not exists idx_user_roles_user on user_roles(user_id);

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
-- Admins have full access; future client role gets restricted access
-- ══════════════════════════════════════
alter table clients enable row level security;
alter table sessions enable row level security;
alter table files enable row level security;
alter table invoices enable row level security;
alter table activity_logs enable row level security;
alter table user_roles enable row level security;

-- USER ROLES: admins can read all, users can read their own
create policy "Admins can manage roles"
  on user_roles for all to authenticated
  using (public.get_user_role() = 'admin')
  with check (public.get_user_role() = 'admin');
create policy "Users can read own role"
  on user_roles for select to authenticated
  using (user_id = auth.uid());

-- CLIENTS: admin full access
create policy "Admins can read clients"
  on clients for select to authenticated using (public.get_user_role() = 'admin');
create policy "Admins can insert clients"
  on clients for insert to authenticated with check (public.get_user_role() = 'admin');
create policy "Admins can update clients"
  on clients for update to authenticated using (public.get_user_role() = 'admin') with check (public.get_user_role() = 'admin');
create policy "Admins can delete clients"
  on clients for delete to authenticated using (public.get_user_role() = 'admin');

-- CLIENTS: clients can read only their own row
create policy "Clients can read own client row"
  on clients for select to authenticated
  using (
    public.get_user_role() = 'client'
    and email = public.get_auth_email()
  );

-- SESSIONS: admin full access
create policy "Admins can read sessions"
  on sessions for select to authenticated using (public.get_user_role() = 'admin');
create policy "Admins can insert sessions"
  on sessions for insert to authenticated with check (public.get_user_role() = 'admin');
create policy "Admins can update sessions"
  on sessions for update to authenticated using (public.get_user_role() = 'admin') with check (public.get_user_role() = 'admin');
create policy "Admins can delete sessions"
  on sessions for delete to authenticated using (public.get_user_role() = 'admin');

-- FILES: admin full access
create policy "Admins can read files"
  on files for select to authenticated using (public.get_user_role() = 'admin');
create policy "Admins can insert files"
  on files for insert to authenticated with check (public.get_user_role() = 'admin');
create policy "Admins can update files"
  on files for update to authenticated using (public.get_user_role() = 'admin') with check (public.get_user_role() = 'admin');
create policy "Admins can delete files"
  on files for delete to authenticated using (public.get_user_role() = 'admin');

-- FILES: clients can read files for their own client_id
create policy "Clients can read own files"
  on files for select to authenticated
  using (
    public.get_user_role() = 'client'
    and client_id in (
      select id from clients where email = public.get_auth_email()
    )
  );

-- INVOICES: admin full access
create policy "Admins can read invoices"
  on invoices for select to authenticated using (public.get_user_role() = 'admin');
create policy "Admins can insert invoices"
  on invoices for insert to authenticated with check (public.get_user_role() = 'admin');
create policy "Admins can update invoices"
  on invoices for update to authenticated using (public.get_user_role() = 'admin') with check (public.get_user_role() = 'admin');
create policy "Admins can delete invoices"
  on invoices for delete to authenticated using (public.get_user_role() = 'admin');

-- INVOICES: clients can read their own invoices
create policy "Clients can read own invoices"
  on invoices for select to authenticated
  using (
    public.get_user_role() = 'client'
    and client_id in (
      select id from clients where email = public.get_auth_email()
    )
  );

-- ACTIVITY LOGS: admin full access
create policy "Admins can read logs"
  on activity_logs for select to authenticated using (public.get_user_role() = 'admin');
create policy "Admins can insert logs"
  on activity_logs for insert to authenticated with check (public.get_user_role() = 'admin');
create policy "Admins can delete logs"
  on activity_logs for delete to authenticated using (public.get_user_role() = 'admin');

-- SERVICE ROLE: bypass RLS for server-side operations (public form submissions)
create policy "Service role can insert clients"
  on clients for insert to service_role with check (true);
create policy "Service role can insert logs"
  on activity_logs for insert to service_role with check (true);

-- INTAKE_FORMS (if table exists): admin full access + client own read
do $$
begin
  if to_regclass('public.intake_forms') is not null then
    execute 'alter table intake_forms enable row level security';

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = 'intake_forms' and policyname = 'Admins can read intake forms'
    ) then
      execute 'create policy "Admins can read intake forms" on intake_forms for select to authenticated using (public.get_user_role() = ''admin'')';
    end if;

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = 'intake_forms' and policyname = 'Clients can read own intake forms'
    ) then
      execute 'create policy "Clients can read own intake forms" on intake_forms for select to authenticated using (public.get_user_role() = ''client'' and email = public.get_auth_email())';
    end if;

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = 'intake_forms' and policyname = 'Service role can manage intake forms'
    ) then
      execute 'create policy "Service role can manage intake forms" on intake_forms for all to service_role using (true) with check (true)';
    end if;
  end if;
end $$;

-- ══════════════════════════════════════
-- STORAGE BUCKET for client files
-- ══════════════════════════════════════
insert into storage.buckets (id, name, public) values ('client-files', 'client-files', false)
on conflict (id) do nothing;

create policy "Admins can upload files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'client-files'
    and public.get_user_role() = 'admin'
  );

create policy "Admins can read files storage"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'client-files'
    and public.get_user_role() = 'admin'
  );

create policy "Admins can delete files storage"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'client-files'
    and public.get_user_role() = 'admin'
  );

-- CLIENTS: read only their own folder "<client_id>/..."
create policy "Clients can read own storage files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'client-files'
    and public.get_user_role() = 'client'
    and split_part(name, '/', 1) in (
      select id::text from clients where email = public.get_auth_email()
    )
  );
