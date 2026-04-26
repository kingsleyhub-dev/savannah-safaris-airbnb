-- Replace handle_new_user: every new signup gets full admin roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (user_id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (user_id) do update
    set email = excluded.email,
        full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name),
        updated_at = now();

  -- Grant every new signup full admin access
  insert into public.user_roles (user_id, role)
  values
    (new.id, 'super_admin'),
    (new.id, 'admin'),
    (new.id, 'editor')
  on conflict (user_id, role) do nothing;

  return new;
end;
$function$;

-- Make sure the trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Replace sync_admin_roles: any signed-in user can grant themselves full admin
CREATE OR REPLACE FUNCTION public.sync_admin_roles(_user_id uuid, _email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  if auth.uid() is null or auth.uid() <> _user_id then
    return false;
  end if;

  insert into public.user_roles (user_id, role)
  values
    (_user_id, 'super_admin'),
    (_user_id, 'admin'),
    (_user_id, 'editor')
  on conflict (user_id, role) do nothing;

  return true;
end;
$function$;

-- Backfill: grant full admin to all existing users that don't yet have it
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, r.role
FROM auth.users u
CROSS JOIN (VALUES ('super_admin'::app_role), ('admin'::app_role), ('editor'::app_role)) AS r(role)
ON CONFLICT (user_id, role) DO NOTHING;