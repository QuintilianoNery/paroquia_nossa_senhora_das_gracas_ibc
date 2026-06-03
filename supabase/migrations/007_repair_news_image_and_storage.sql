-- ============================================================
-- Migration 007 — Repair missing image_url columns and storage bucket
-- - Adds image columns that may be missing after reset scripts
-- - Ensures site-images bucket exists
-- - Recreates storage policies with admin write + public read
-- - Reloads PostgREST schema cache
-- ============================================================

begin;

alter table public.parish_profile add column if not exists image_url text;
alter table public.communities add column if not exists image_url text;
alter table public.news add column if not exists image_url text;

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do update
set public = excluded.public,
    name = excluded.name;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

drop policy if exists "Public read site images" on storage.objects;
drop policy if exists "Authenticated upload site images" on storage.objects;
drop policy if exists "Authenticated update site images" on storage.objects;
drop policy if exists "Authenticated delete site images" on storage.objects;
drop policy if exists "Admin upload site images" on storage.objects;
drop policy if exists "Admin update site images" on storage.objects;
drop policy if exists "Admin delete site images" on storage.objects;

create policy "Public read site images"
  on storage.objects for select
  using (bucket_id = 'site-images');

create policy "Admin upload site images"
  on storage.objects for insert
  with check (bucket_id = 'site-images' and public.is_admin());

create policy "Admin update site images"
  on storage.objects for update
  using (bucket_id = 'site-images' and public.is_admin())
  with check (bucket_id = 'site-images' and public.is_admin());

create policy "Admin delete site images"
  on storage.objects for delete
  using (bucket_id = 'site-images' and public.is_admin());

-- Force PostgREST to refresh schema cache immediately.
notify pgrst, 'reload schema';

commit;
