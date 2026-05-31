-- ============================================================
-- Migration 006 — Restrict writes to admin users
-- - Adds public.is_admin() based on auth.jwt() app_metadata.role
-- - Replaces broad authenticated write policies with admin-only policies
-- - Tightens storage write permissions for site-images bucket
-- ============================================================

begin;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

-- Recreate write policies for core content tables
-- Public read policies remain unchanged.

drop policy if exists "Escrita autenticada — parish_profile" on public.parish_profile;
drop policy if exists "Escrita autenticada — communities" on public.communities;
drop policy if exists "Escrita autenticada — community_gallery" on public.community_gallery;
drop policy if exists "Escrita autenticada — clergy" on public.clergy;
drop policy if exists "Escrita autenticada — news" on public.news;
drop policy if exists "Escrita autenticada — news_gallery" on public.news_gallery;
drop policy if exists "Escrita autenticada — mass_schedules" on public.mass_schedules;
drop policy if exists "Escrita autenticada — useful_links" on public.useful_links;
drop policy if exists "Escrita autenticada — pastorals" on public.pastorals;

create policy "Admin write — parish_profile"
  on public.parish_profile for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin write — communities"
  on public.communities for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin write — community_gallery"
  on public.community_gallery for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin write — clergy"
  on public.clergy for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin write — news"
  on public.news for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin write — news_gallery"
  on public.news_gallery for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin write — mass_schedules"
  on public.mass_schedules for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin write — useful_links"
  on public.useful_links for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin write — pastorals"
  on public.pastorals for all
  using (public.is_admin())
  with check (public.is_admin());

-- Tighten storage permissions for site images

drop policy if exists "Authenticated upload site images" on storage.objects;
drop policy if exists "Authenticated update site images" on storage.objects;
drop policy if exists "Authenticated delete site images" on storage.objects;

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

commit;
