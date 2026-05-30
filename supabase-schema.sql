create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.generate_slug(source text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(lower(unaccent(coalesce(source, ''))), '[^a-z0-9]+', '-', 'g'));
$$;

create table if not exists public.parish_profile (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  subtitle text,
  content text,
  address text,
  google_maps_url text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  gallery jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid references auth.users(id)
);

create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  summary text,
  story text,
  address text,
  google_maps_url text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  cover_image_url text,
  gallery jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  manual_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid references auth.users(id)
);

create table if not exists public.clergy (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  photo_url text,
  is_current boolean not null default false,
  manual_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid references auth.users(id)
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  content text,
  category text,
  cover_image_url text,
  gallery jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid references auth.users(id)
);

create table if not exists public.mass_schedules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  day_label text not null,
  time_label text not null,
  location text,
  category text not null default 'missa',
  manual_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid references auth.users(id)
);

create table if not exists public.office_hours (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  day_label text not null,
  hours_label text not null,
  manual_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid references auth.users(id)
);

create table if not exists public.useful_links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  description text,
  category text not null,
  manual_order integer not null default 0,
  open_in_new_tab boolean not null default true,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid references auth.users(id)
);

create table if not exists public.liturgy_links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  description text,
  manual_order integer not null default 0,
  open_in_new_tab boolean not null default true,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid references auth.users(id)
);

create table if not exists public.pastorals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  manual_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid references auth.users(id)
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text,
  page_key text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid references auth.users(id)
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  network text not null,
  url text not null,
  icon text,
  manual_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid references auth.users(id)
);

create trigger parish_profile_updated_at
before update on public.parish_profile
for each row execute function public.set_updated_at();

create trigger communities_updated_at
before update on public.communities
for each row execute function public.set_updated_at();

create trigger clergy_updated_at
before update on public.clergy
for each row execute function public.set_updated_at();

create trigger news_updated_at
before update on public.news
for each row execute function public.set_updated_at();

create trigger mass_schedules_updated_at
before update on public.mass_schedules
for each row execute function public.set_updated_at();

create trigger office_hours_updated_at
before update on public.office_hours
for each row execute function public.set_updated_at();

create trigger useful_links_updated_at
before update on public.useful_links
for each row execute function public.set_updated_at();

create trigger liturgy_links_updated_at
before update on public.liturgy_links
for each row execute function public.set_updated_at();

create trigger pastorals_updated_at
before update on public.pastorals
for each row execute function public.set_updated_at();

create trigger pages_updated_at
before update on public.pages
for each row execute function public.set_updated_at();

create trigger social_links_updated_at
before update on public.social_links
for each row execute function public.set_updated_at();

alter table public.parish_profile enable row level security;
alter table public.communities enable row level security;
alter table public.clergy enable row level security;
alter table public.news enable row level security;
alter table public.mass_schedules enable row level security;
alter table public.office_hours enable row level security;
alter table public.useful_links enable row level security;
alter table public.liturgy_links enable row level security;
alter table public.pastorals enable row level security;
alter table public.pages enable row level security;
alter table public.social_links enable row level security;

create policy "Public read parish profile" on public.parish_profile for select using (is_published = true);
create policy "Public read communities" on public.communities for select using (is_published = true);
create policy "Public read clergy" on public.clergy for select using (true);
create policy "Public read news" on public.news for select using (is_published = true);
create policy "Public read mass schedules" on public.mass_schedules for select using (is_published = true);
create policy "Public read office hours" on public.office_hours for select using (is_published = true);
create policy "Public read useful links" on public.useful_links for select using (is_published = true);
create policy "Public read liturgy links" on public.liturgy_links for select using (is_published = true);
create policy "Public read pastorals" on public.pastorals for select using (is_published = true);
create policy "Public read pages" on public.pages for select using (is_published = true);
create policy "Public read social links" on public.social_links for select using (is_published = true);

create policy "Admin manage parish profile" on public.parish_profile for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin manage communities" on public.communities for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin manage clergy" on public.clergy for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin manage news" on public.news for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin manage mass schedules" on public.mass_schedules for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin manage office hours" on public.office_hours for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin manage useful links" on public.useful_links for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin manage liturgy links" on public.liturgy_links for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin manage pastorals" on public.pastorals for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin manage pages" on public.pages for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin manage social links" on public.social_links for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');