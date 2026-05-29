create extension if not exists pgcrypto;
create extension if not exists unaccent;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function public.generate_slug(input_text text)
returns text as $$
  select lower(regexp_replace(unaccent(coalesce(input_text, '')), '[^a-zA-Z0-9]+', '-', 'g'));
$$ language sql immutable;

create table if not exists public.parish_profile (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Paróquia Nossa Senhora das Graças',
  content text,
  address text,
  google_maps_url text,
  latitude numeric,
  longitude numeric,
  phone text,
  email text,
  is_published boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  history text,
  address text,
  google_maps_url text,
  latitude numeric,
  longitude numeric,
  saint_story_url text,
  hero_image_url text,
  manual_order int not null default 0,
  is_published boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clergy (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  photo_url text,
  role text not null check (role in ('paroco', 'vigario', 'diacono')),
  is_current boolean not null default false,
  manual_order int not null default 0,
  is_published boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  summary text,
  content text,
  cover_image_url text,
  published_at timestamptz,
  is_published boolean not null default false,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mass_schedules (
  id uuid primary key default gen_random_uuid(),
  community_id uuid references public.communities(id) on delete set null,
  weekday text not null,
  celebration text not null,
  schedule_time text not null,
  place text,
  notes text,
  is_published boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.office_hours (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  schedule_text text not null,
  notes text,
  is_published boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.useful_links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  description text,
  category text not null default 'geral',
  manual_order int not null default 0,
  is_published boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pastorals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  manual_order int not null default 0,
  is_published boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at_parish_profile before update on public.parish_profile for each row execute procedure public.set_updated_at();
create trigger set_updated_at_communities before update on public.communities for each row execute procedure public.set_updated_at();
create trigger set_updated_at_clergy before update on public.clergy for each row execute procedure public.set_updated_at();
create trigger set_updated_at_news before update on public.news for each row execute procedure public.set_updated_at();
create trigger set_updated_at_mass_schedules before update on public.mass_schedules for each row execute procedure public.set_updated_at();
create trigger set_updated_at_office_hours before update on public.office_hours for each row execute procedure public.set_updated_at();
create trigger set_updated_at_useful_links before update on public.useful_links for each row execute procedure public.set_updated_at();
create trigger set_updated_at_pastorals before update on public.pastorals for each row execute procedure public.set_updated_at();

alter table public.parish_profile enable row level security;
alter table public.communities enable row level security;
alter table public.clergy enable row level security;
alter table public.news enable row level security;
alter table public.mass_schedules enable row level security;
alter table public.office_hours enable row level security;
alter table public.useful_links enable row level security;
alter table public.pastorals enable row level security;

create policy "public can read parish_profile" on public.parish_profile for select using (is_published = true);
create policy "public can read communities" on public.communities for select using (is_published = true);
create policy "public can read clergy" on public.clergy for select using (is_published = true);
create policy "public can read news" on public.news for select using (is_published = true);
create policy "public can read mass_schedules" on public.mass_schedules for select using (is_published = true);
create policy "public can read office_hours" on public.office_hours for select using (is_published = true);
create policy "public can read useful_links" on public.useful_links for select using (is_published = true);
create policy "public can read pastorals" on public.pastorals for select using (is_published = true);

create policy "authenticated full access parish_profile" on public.parish_profile for all to authenticated using (true) with check (true);
create policy "authenticated full access communities" on public.communities for all to authenticated using (true) with check (true);
create policy "authenticated full access clergy" on public.clergy for all to authenticated using (true) with check (true);
create policy "authenticated full access news" on public.news for all to authenticated using (true) with check (true);
create policy "authenticated full access mass_schedules" on public.mass_schedules for all to authenticated using (true) with check (true);
create policy "authenticated full access office_hours" on public.office_hours for all to authenticated using (true) with check (true);
create policy "authenticated full access useful_links" on public.useful_links for all to authenticated using (true) with check (true);
create policy "authenticated full access pastorals" on public.pastorals for all to authenticated using (true) with check (true);

insert into public.parish_profile (title, content, address, phone, email)
select 'Paróquia Nossa Senhora das Graças', 'História institucional administrável.', 'Rua Domingos Alcino Dadalto, 114 - Jardim Itapemirim', '(28) 3517-7296', 'secretaria@paroquia.org'
where not exists (select 1 from public.parish_profile);
