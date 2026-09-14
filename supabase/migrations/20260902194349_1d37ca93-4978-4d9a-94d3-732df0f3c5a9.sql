revoke execute on function public.has_role(uuid, public.app_role) from anon;
revoke execute on function public.assign_initial_role() from anon, authenticated;