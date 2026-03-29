-- Facturas generadas por citas virtuales pagadas (visitantes sin ficha en `clients`)
alter table public.invoices alter column client_id drop not null;
