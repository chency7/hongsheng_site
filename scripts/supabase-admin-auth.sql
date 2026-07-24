-- Admin authorization helper for Supabase Auth and future RLS policies.
-- Create the user in Supabase Studio: Authentication > Users, then assign
-- app_metadata.role = "admin" with the Dashboard or the commented statement below.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    or coalesce(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin';
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, service_role;

create or replace function public.promote_admin(admin_email text)
returns table (
  id uuid,
  email varchar,
  raw_app_meta_data jsonb
)
language plpgsql
security definer
set search_path = auth, public, pg_temp
as $$
begin
  return query
  update auth.users as users
  set raw_app_meta_data = coalesce(users.raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
  where lower(users.email) = lower(admin_email)
  returning users.id, users.email, users.raw_app_meta_data;

  if not found then
    raise exception 'Supabase Auth user not found: %', admin_email;
  end if;
end;
$$;

revoke all on function public.promote_admin(text) from public, anon, authenticated;
grant execute on function public.promote_admin(text) to service_role;

-- Promote an existing Supabase Auth user without replacing other app metadata.
-- Run once after this script has been executed in SQL Editor.
-- select * from public.promote_admin('admin@example.com');
