-- ============================================================
-- Migration 004 — Clergy ordering and RLS change
-- - Add `list_order` for display ordering
-- - Rename `manual_order` -> `reg_code` (immutable registration code)
-- - Make public reads only return `is_current = true`
-- WARNING: this migration alters existing data and adds constraints. Backup before running.
-- ============================================================

begin;

-- 1) Add list_order column for ordering (if missing)
alter table public.clergy add column if not exists list_order int default 0;

-- 2) If manual_order exists, rename to reg_code
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'clergy' and column_name = 'manual_order'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'clergy' and column_name = 'reg_code'
  ) then
    execute 'alter table public.clergy rename column manual_order to reg_code';
  elsif exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'clergy' and column_name = 'manual_order'
  ) and exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'clergy' and column_name = 'reg_code'
  ) then
    execute '
      update public.clergy
         set reg_code = coalesce(nullif(reg_code, 0), manual_order)
       where reg_code is null or reg_code = 0
    ';
    execute 'alter table public.clergy drop column manual_order';
  end if;
  execute 'drop index if exists public.idx_clergy_order';
end $$;

-- 3) Ensure reg_code column exists (in case migration executed on a fresh DB)
alter table public.clergy add column if not exists reg_code int default 0;

-- 4) Create a sequence to populate reg_code for existing rows with 0 or null
create sequence if not exists clergy_reg_code_seq start 1001;

update public.clergy set reg_code = nextval('clergy_reg_code_seq')
where reg_code is null or reg_code = 0;

-- 5) Make reg_code unique and not null
alter table public.clergy alter column reg_code set not null;
-- Postgres does not support `ADD CONSTRAINT IF NOT EXISTS`; create a unique index instead
create unique index if not exists idx_clergy_reg_code_unique on public.clergy(reg_code);

-- 6) Create index on list_order for ordering
drop index if exists public.idx_clergy_list_order;
create index if not exists idx_clergy_list_order on public.clergy(list_order);

-- 7) Create trigger to prevent updates to reg_code (immutable)
create or replace function public.clergy_reg_code_immutable() returns trigger as $$
begin
  if (tg_op = 'UPDATE') then
    if (old.reg_code is distinct from new.reg_code) then
      raise exception 'reg_code is immutable and cannot be changed';
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_clergy_reg_code_immutable on public.clergy;
create trigger trg_clergy_reg_code_immutable
  before update on public.clergy
  for each row execute function public.clergy_reg_code_immutable();

-- 8) Update RLS: only allow public select for current clergy
-- Drop existing policy if present and recreate
drop policy if exists "Leitura pública — clergy" on public.clergy;
create policy "Leitura pública — clergy"
  on public.clergy for select using (is_current = true);

commit;

-- Notes:
-- - Use `list_order` to control display sequence in the frontend (ORDER BY list_order ASC)
-- - `reg_code` is now the immutable registration code; attempts to change it will raise an error.
-- - If you prefer `reg_code` as text, alter the column type accordingly before applying the immutable trigger.
