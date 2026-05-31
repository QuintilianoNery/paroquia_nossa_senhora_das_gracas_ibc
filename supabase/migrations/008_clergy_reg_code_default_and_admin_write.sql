-- ============================================================
-- Migration 008 — Clergy reg_code default and admin write policies
-- - Guarantees clergy reg_code is generated automatically on insert
-- - Ensures admin-only write policies are present even if migration 006 was skipped
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

create sequence if not exists clergy_reg_code_seq start 1001;

do $$
begin
  perform setval(
    'clergy_reg_code_seq'::regclass,
    greatest(
      coalesce((select max(reg_code) from public.clergy), 0) + 1,
      1001
    ),
    false
  );
end $$;

alter table public.clergy
  alter column reg_code set default nextval('clergy_reg_code_seq'::regclass);

alter sequence clergy_reg_code_seq owned by public.clergy.reg_code;

drop policy if exists "Escrita autenticada — parish_profile" on public.parish_profile;
drop policy if exists "Escrita autenticada — communities" on public.communities;
drop policy if exists "Escrita autenticada — community_gallery" on public.community_gallery;
drop policy if exists "Escrita autenticada — clergy" on public.clergy;
drop policy if exists "Escrita autenticada — news" on public.news;
drop policy if exists "Escrita autenticada — news_gallery" on public.news_gallery;
drop policy if exists "Escrita autenticada — mass_schedules" on public.mass_schedules;
drop policy if exists "Escrita autenticada — useful_links" on public.useful_links;
drop policy if exists "Escrita autenticada — pastorals" on public.pastorals;
drop policy if exists "Admin write — parish_profile" on public.parish_profile;
drop policy if exists "Admin write — communities" on public.communities;
drop policy if exists "Admin write — community_gallery" on public.community_gallery;
drop policy if exists "Admin write — clergy" on public.clergy;
drop policy if exists "Admin write — news" on public.news;
drop policy if exists "Admin write — news_gallery" on public.news_gallery;
drop policy if exists "Admin write — mass_schedules" on public.mass_schedules;
drop policy if exists "Admin write — useful_links" on public.useful_links;
drop policy if exists "Admin write — pastorals" on public.pastorals;

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

commit;
