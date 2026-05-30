-- ============================================================
-- RESET + Paróquia NSG — Recreate schema and seed data
-- WARNING: este script apaga (drop) tabelas existentes e recria o schema.
-- Execute apenas se você quiser redefinir a base local ou em ambiente de testes.
-- ============================================================

-- Drop child tables first to avoid FK constraint errors
drop table if exists public.community_gallery cascade;
drop table if exists public.news_gallery cascade;
drop table if exists public.communities cascade;
drop table if exists public.news cascade;
drop table if exists public.clergy cascade;
drop table if exists public.mass_schedules cascade;
drop table if exists public.useful_links cascade;
drop table if exists public.pastorals cascade;
drop table if exists public.parish_profile cascade;

-- Ensure extension for UUID generation
create extension if not exists "uuid-ossp";

-- ── 1. parish_profile ─────────────────────────────────────
create table public.parish_profile (
  id              int primary key default 1,
  title           text,
  content         text,
  address         text,
  google_maps_url text,
  latitude        text,
  longitude       text,
  phone           text,
  whatsapp        text,
  email           text,
  social_facebook  text,
  social_instagram text,
  social_youtube   text,
  social_whatsapp  text,
  updated_at      timestamptz default now()
);

alter table public.parish_profile add constraint parish_profile_one_row check (id = 1);

-- ── 2. communities ────────────────────────────────────────
create table public.communities (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  slug            text unique not null,
  history         text,
  address         text,
  google_maps_url text,
  latitude        text,
  longitude       text,
  is_published    boolean default true,
  manual_order    int default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index idx_communities_slug on public.communities(slug);
create index idx_communities_order on public.communities(manual_order);

-- ── 3. community_gallery ──────────────────────────────────
create table public.community_gallery (
  id            uuid primary key default uuid_generate_v4(),
  community_id  uuid references public.communities(id) on delete cascade,
  url           text not null,
  caption       text,
  manual_order  int default 0,
  created_at    timestamptz default now()
);

-- ── 4. clergy ─────────────────────────────────────────────
create table public.clergy (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  role          text not null check (role in ('parochus','vicar','deacon','deacon_formation')),
  bio           text,
  photo_url     text,
  is_current    boolean default true,
  manual_order  int default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index idx_clergy_order on public.clergy(manual_order);

-- ── 5. news ───────────────────────────────────────────────
create table public.news (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  slug          text unique not null,
  summary       text,
  content       text,
  is_published  boolean default false,
  published_at  timestamptz default now(),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index idx_news_slug       on public.news(slug);
create index idx_news_published  on public.news(published_at desc);

-- ── 6. news_gallery ───────────────────────────────────────
create table public.news_gallery (
  id           uuid primary key default uuid_generate_v4(),
  news_id      uuid references public.news(id) on delete cascade,
  url          text not null,
  caption      text,
  manual_order int default 0,
  created_at   timestamptz default now()
);

-- ── 7. mass_schedules ─────────────────────────────────────
create table public.mass_schedules (
  id            uuid primary key default uuid_generate_v4(),
  day_label     text not null,
  time_label    text not null,
  location      text,
  type          text not null default 'mass' check (type in ('mass','office','sacrament')),
  is_active     boolean default true,
  manual_order  int default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index idx_schedules_order on public.mass_schedules(manual_order);

-- ── 8. useful_links ───────────────────────────────────────
create table public.useful_links (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  url           text not null,
  description   text,
  category      text default 'geral',
  icon          text,
  is_active     boolean default true,
  manual_order  int default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index idx_links_order on public.useful_links(manual_order);

-- ── 9. pastorals ──────────────────────────────────────────
create table public.pastorals (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  description   text,
  icon          text,
  color         text,
  icon_color    text,
  image_url     text,
  is_active     boolean default true,
  manual_order  int default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index idx_pastorals_order on public.pastorals(manual_order);

-- ══════════════════════════════════════════════════════════
-- RLS — habilitar e políticas básicas (mesma lógica do 001)
-- ══════════════════════════════════════════════════════════

alter table public.parish_profile   enable row level security;
alter table public.communities      enable row level security;
alter table public.community_gallery enable row level security;
alter table public.clergy           enable row level security;
alter table public.news             enable row level security;
alter table public.news_gallery     enable row level security;
alter table public.mass_schedules   enable row level security;
alter table public.useful_links     enable row level security;
alter table public.pastorals        enable row level security;

create policy "Leitura pública — parish_profile"
  on public.parish_profile for select using (true);

create policy "Leitura pública — communities"
  on public.communities for select using (is_published = true);

create policy "Leitura pública — community_gallery"
  on public.community_gallery for select using (true);

create policy "Leitura pública — clergy"
  on public.clergy for select using (true);

create policy "Leitura pública — news"
  on public.news for select using (is_published = true);

create policy "Leitura pública — news_gallery"
  on public.news_gallery for select using (true);

create policy "Leitura pública — mass_schedules"
  on public.mass_schedules for select using (is_active = true);

create policy "Leitura pública — useful_links"
  on public.useful_links for select using (is_active = true);

create policy "Leitura pública — pastorals"
  on public.pastorals for select using (is_active = true);

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'parish_profile','communities','community_gallery',
    'clergy','news','news_gallery',
    'mass_schedules','useful_links','pastorals'
  ] loop
    execute format(''
      create policy "Escrita autenticada — %I" 
        on public.%I for all
        using (auth.role() = ''''authenticated'''')
        with check (auth.role() = ''''authenticated'''');
    '', tbl, tbl);
  end loop;
end $$;

-- ══════════════════════════════════════════════════════════
-- Seed: dados fictícios / exemplo
-- Use ON CONFLICT para permitir reexecução segura
-- ══════════════════════════════════════════════════════════

insert into public.parish_profile (id, title, content, address, phone, email) values
(1,
 'Nossa História - (reset)',
 'Paróquia exemplo criada para teste após reset do schema. Texto fictício de demonstração.',
 'Rua Exemplo, 100 — Bairro Teste, Cidade/UF · CEP: 00000-000',
 '(00) 0000-0000',
 'secretaria@exemplo.org.br'
) on conflict (id) do nothing;

insert into public.clergy (name, role, bio, is_current, manual_order) values
('Pe. Pedro Exemplo',   'parochus',         'Pároco responsável pela comunidade de teste.',                                         true,  1),
('Pe. João da Silva',   'vicar',            'Vigário paroquial, responsável por eventos e catequese.',                                true,  2),
('Dc. Carlos Souza',    'deacon',           'Diácono permanente na pastoral social.',                                                 true,  3)
on conflict do nothing;

insert into public.communities (name, slug, history, address, is_published, manual_order) values
('Comunidade Teste A', 'teste-a', 'História fictícia da Comunidade Teste A.', 'Rua A, 1', true, 1),
('Comunidade Teste B', 'teste-b', 'História fictícia da Comunidade Teste B.', 'Rua B, 2', true, 2)
on conflict (slug) do nothing;

insert into public.mass_schedules (day_label, time_label, location, type, is_active, manual_order) values
('Domingo', '9h00', 'Igreja Matriz', 'mass', true, 1),
('Quarta-feira', '19h30', 'Igreja Matriz', 'mass', true, 2)
on conflict do nothing;

insert into public.useful_links (title, url, description, category, is_active, manual_order) values
('Portal de Teste', 'https://example.org', 'Link de exemplo para testes', 'geral', true, 1)
on conflict do nothing;

insert into public.pastorals (title, description, is_active, manual_order) values
('Pastoral de Teste', 'Descrição fictícia da pastoral de teste.', true, 1)
on conflict do nothing;

-- Exemplos de galerias
insert into public.community_gallery (community_id, url, caption, manual_order) 
select id, 'https://picsum.photos/seed/comunidade1/800/600', 'Foto exemplo da comunidade', 1 from public.communities where slug = 'teste-a'
on conflict do nothing;

insert into public.news (title, slug, summary, content, is_published) values
('Notícia de Teste', 'noticia-teste', 'Resumo da notícia de teste.', 'Conteúdo fictício da notícia de teste.', true)
on conflict (slug) do nothing;

insert into public.news_gallery (news_id, url, caption) 
select id, 'https://picsum.photos/seed/noticia1/1200/800', 'Imagem da notícia de teste' from public.news where slug = 'noticia-teste'
on conflict do nothing;

-- Fim do script
