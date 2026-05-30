-- ============================================================
-- Migration 005 — Image upload support for parish/communities/clergy/news
-- - Adds image columns where missing
-- - Creates a public storage bucket for site images
-- - Adds storage policies for authenticated uploads and public reads
-- ============================================================

begin;

-- Add image columns to existing tables
alter table public.parish_profile add column if not exists image_url text;
alter table public.communities add column if not exists image_url text;
alter table public.news add column if not exists image_url text;

-- Clergy already has `photo_url`, keep using it

-- Create public bucket for images
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do update
set public = excluded.public,
    name = excluded.name;

-- Drop and recreate policies to avoid duplicates if migration is rerun
drop policy if exists "Public read site images" on storage.objects;
drop policy if exists "Authenticated upload site images" on storage.objects;
drop policy if exists "Authenticated update site images" on storage.objects;
drop policy if exists "Authenticated delete site images" on storage.objects;

create policy "Public read site images"
  on storage.objects for select
  using (bucket_id = 'site-images');

create policy "Authenticated upload site images"
  on storage.objects for insert
  with check (bucket_id = 'site-images' and auth.role() = 'authenticated');

create policy "Authenticated update site images"
  on storage.objects for update
  using (bucket_id = 'site-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'site-images' and auth.role() = 'authenticated');

create policy "Authenticated delete site images"
  on storage.objects for delete
  using (bucket_id = 'site-images' and auth.role() = 'authenticated');

commit;
