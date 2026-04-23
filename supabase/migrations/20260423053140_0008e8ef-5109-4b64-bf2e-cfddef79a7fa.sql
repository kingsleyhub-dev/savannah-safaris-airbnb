create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
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

  if lower(new.email) = 'savannahsafarisairbnb@gmail.com' then
    insert into public.user_roles (user_id, role)
    values (new.id, 'super_admin')
    on conflict (user_id, role) do nothing;
  end if;

  if lower(new.email) = 'kingsleyhub01@gmail.com' then
    insert into public.user_roles (user_id, role)
    values
      (new.id, 'super_admin'),
      (new.id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();