-- Media kit settings (editable from admin panel)
begin;

create table if not exists public.media_kit_settings (
  id text primary key default 'default',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.media_kit_settings enable row level security;

drop policy if exists "Admins can manage media kit settings" on public.media_kit_settings;
create policy "Admins can manage media kit settings"
  on public.media_kit_settings for all to authenticated
  using (public.get_user_role() = 'admin')
  with check (public.get_user_role() = 'admin');

drop policy if exists "Service role can manage media kit settings" on public.media_kit_settings;
create policy "Service role can manage media kit settings"
  on public.media_kit_settings for all to service_role
  using (true)
  with check (true);

insert into public.media_kit_settings (id, data)
values ('default', '{}'::jsonb)
on conflict (id) do nothing;

commit;
