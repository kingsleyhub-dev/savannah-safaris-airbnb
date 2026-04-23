create or replace function public.sync_admin_roles(_user_id uuid, _email text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or auth.uid() <> _user_id then
    return false;
  end if;

  if lower(coalesce(_email, '')) <> 'savannahsafarisadmin@gmail.com' then
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
$$;

grant execute on function public.sync_admin_roles(uuid, text) to authenticated;