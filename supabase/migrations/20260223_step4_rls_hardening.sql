-- Step 4: production-safe hardening for Stripe + client RLS
-- Idempotent migration (safe to run once per environment)

begin;

-- 1) Clients: Stripe identifiers
alter table if exists public.clients
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text;

create index if not exists idx_clients_stripe_customer
  on public.clients(stripe_customer_id);

create index if not exists idx_clients_stripe_subscription
  on public.clients(stripe_subscription_id);

-- 2) Helper to map auth user -> email
create or replace function public.get_auth_email()
returns text
language sql
security definer
stable
as $$
  select email from auth.users where id = auth.uid();
$$;

-- 3) clients RLS: admin all + client own
drop policy if exists "Clients can read own client row" on public.clients;
create policy "Clients can read own client row"
  on public.clients for select to authenticated
  using (
    public.get_user_role() = 'client'
    and email = public.get_auth_email()
  );

-- 4) files RLS: admin all + client own by client_id
drop policy if exists "Clients can read own files" on public.files;
create policy "Clients can read own files"
  on public.files for select to authenticated
  using (
    public.get_user_role() = 'client'
    and client_id in (
      select id from public.clients where email = public.get_auth_email()
    )
  );

-- 5) invoices RLS: admin all + client own by client_id
drop policy if exists "Clients can read own invoices" on public.invoices;
create policy "Clients can read own invoices"
  on public.invoices for select to authenticated
  using (
    public.get_user_role() = 'client'
    and client_id in (
      select id from public.clients where email = public.get_auth_email()
    )
  );

-- 6) intake_forms RLS (if table exists)
do $$
begin
  if to_regclass('public.intake_forms') is not null then
    execute 'alter table public.intake_forms enable row level security';

    execute 'drop policy if exists "Admins can read intake forms" on public.intake_forms';
    execute 'create policy "Admins can read intake forms" on public.intake_forms for select to authenticated using (public.get_user_role() = ''admin'')';

    execute 'drop policy if exists "Clients can read own intake forms" on public.intake_forms';
    execute 'create policy "Clients can read own intake forms" on public.intake_forms for select to authenticated using (public.get_user_role() = ''client'' and email = public.get_auth_email())';

    execute 'drop policy if exists "Service role can manage intake forms" on public.intake_forms';
    execute 'create policy "Service role can manage intake forms" on public.intake_forms for all to service_role using (true) with check (true)';
  end if;
end $$;

-- 7) storage.objects for client-files bucket
-- Remove broad policies if they exist
drop policy if exists "Authenticated users can upload files" on storage.objects;
drop policy if exists "Authenticated users can read files" on storage.objects;
drop policy if exists "Authenticated users can delete files" on storage.objects;

-- Ensure strict admin policies
drop policy if exists "Admins can upload files" on storage.objects;
create policy "Admins can upload files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'client-files'
    and public.get_user_role() = 'admin'
  );

drop policy if exists "Admins can read files storage" on storage.objects;
create policy "Admins can read files storage"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'client-files'
    and public.get_user_role() = 'admin'
  );

drop policy if exists "Admins can delete files storage" on storage.objects;
create policy "Admins can delete files storage"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'client-files'
    and public.get_user_role() = 'admin'
  );

-- Client can read only own folder "<client_id>/..."
drop policy if exists "Clients can read own storage files" on storage.objects;
create policy "Clients can read own storage files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'client-files'
    and public.get_user_role() = 'client'
    and split_part(name, '/', 1) in (
      select id::text from public.clients where email = public.get_auth_email()
    )
  );

commit;

