-- Un solo hueco activo (pending o paid) por instante de inicio (evita doble reserva).
create unique index if not exists idx_virtual_appointments_unique_active_slot
  on public.virtual_appointments (starts_at)
  where status in ('pending', 'paid');
