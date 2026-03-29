-- Motivo de consulta (formulario cita virtual)
alter table public.virtual_appointments
  add column if not exists reason text not null default '';
