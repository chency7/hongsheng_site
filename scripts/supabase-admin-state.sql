-- Supabase SQL Editor: run this once before deploying the Docker app.
-- The Next.js app uses the service-role key on the server to read/write this table.

create table if not exists public.admin_state (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.admin_state enable row level security;

drop policy if exists "admin_state_service_role_all" on public.admin_state;
create policy "admin_state_service_role_all"
  on public.admin_state
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create or replace function public.touch_admin_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists admin_state_updated_at on public.admin_state;
create trigger admin_state_updated_at
before update on public.admin_state
for each row
execute function public.touch_admin_state_updated_at();
