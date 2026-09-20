-- Editable copy for project cards (title, subtitle, blurb, tags), so the owner
-- can update project content from the live site without a code deploy.
-- One row per project slug; a missing row means "use the built-in copy".
create table if not exists public.project_content (
  slug text primary key,
  name text,
  subtitle text,
  blurb text,
  tags text[],
  updated_at timestamptz not null default now()
);

alter table public.project_content enable row level security;

-- The public site needs to read overrides for everyone, logged in or not.
create policy "project_content_public_read"
  on public.project_content
  for select
  using (true);

-- Only admins (see public.has_role / public.user_roles) may write.
create policy "project_content_admin_insert"
  on public.project_content
  for insert
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));

create policy "project_content_admin_update"
  on public.project_content
  for update
  using (public.has_role(auth.uid(), 'admin'::public.app_role))
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));

create policy "project_content_admin_delete"
  on public.project_content
  for delete
  using (public.has_role(auth.uid(), 'admin'::public.app_role));
