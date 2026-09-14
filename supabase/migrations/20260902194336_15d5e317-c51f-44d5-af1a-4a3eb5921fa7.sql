insert into public.user_roles (user_id, role)
select '263fb9d6-c5c7-4b3f-a952-780ef924faf8'::uuid, 'admin'::app_role
where not exists (
  select 1 from public.user_roles
  where user_id = '263fb9d6-c5c7-4b3f-a952-780ef924faf8'::uuid and role = 'admin'::app_role
);