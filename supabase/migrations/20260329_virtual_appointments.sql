-- Citas virtuales (pago Stripe + enlace Meet)
create table if not exists public.virtual_appointments (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.clients(id) on delete set null,
  email text not null,
  name text not null,
  phone text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  stripe_checkout_session_id text unique,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  meet_link text,
  source text not null default 'home' check (source in ('home', 'client')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_virtual_appointments_starts on public.virtual_appointments(starts_at);
create index if not exists idx_virtual_appointments_email on public.virtual_appointments(email);
create index if not exists idx_virtual_appointments_status on public.virtual_appointments(status);
create index if not exists idx_virtual_appointments_stripe_session on public.virtual_appointments(stripe_checkout_session_id);

create trigger virtual_appointments_updated_at
  before update on public.virtual_appointments
  for each row execute function public.update_updated_at();

alter table public.virtual_appointments enable row level security;

create policy "Admins can manage virtual appointments"
  on public.virtual_appointments for all to authenticated
  using (public.get_user_role() = 'admin')
  with check (public.get_user_role() = 'admin');

create policy "Clients can read own virtual appointments"
  on public.virtual_appointments for select to authenticated
  using (
    public.get_user_role() = 'client'
    and email = public.get_auth_email()
  );

create policy "Service role can manage virtual appointments"
  on public.virtual_appointments for all to service_role
  using (true)
  with check (true);
