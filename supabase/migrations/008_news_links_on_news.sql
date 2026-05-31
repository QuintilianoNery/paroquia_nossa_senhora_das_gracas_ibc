-- ============================================================
-- Migration 008 — Add structured links to news
-- - Adds `news_links` JSON array column to public.news
-- - Keeps existing rows backward compatible with empty array
-- - Reloads PostgREST schema cache
-- ============================================================

begin;

alter table public.news
  add column if not exists news_links jsonb not null default '[]'::jsonb;

notify pgrst, 'reload schema';

commit;
