-- Token para enlace de reprogramación (sin login), idioma del flujo, ID del evento en Google Calendar
alter table public.virtual_appointments
  add column if not exists reschedule_token uuid unique,
  add column if not exists locale text not null default 'es' check (locale in ('es', 'en')),
  add column if not exists google_calendar_event_id text;

-- Citas ya pagadas: un token por fila para que el enlace del correo funcione tras desplegar
update public.virtual_appointments
set reschedule_token = gen_random_uuid()
where status = 'paid' and reschedule_token is null;
