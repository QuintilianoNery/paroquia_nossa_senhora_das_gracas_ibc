-- ============================================================
-- Paróquia Nossa Senhora das Graças — Supabase Schema
-- Execute no SQL Editor do Supabase (Settings → SQL Editor)
-- ============================================================

-- ── Extensões ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── 1. parish_profile ─────────────────────────────────────
create table if not exists public.parish_profile (
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

-- Garante apenas 1 linha (perfil da paróquia)
alter table public.parish_profile add constraint parish_profile_one_row check (id = 1);

-- ── 2. communities ────────────────────────────────────────
create table if not exists public.communities (
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

create index if not exists idx_communities_slug on public.communities(slug);
create index if not exists idx_communities_order on public.communities(manual_order);

-- ── 3. community_gallery ──────────────────────────────────
create table if not exists public.community_gallery (
  id            uuid primary key default uuid_generate_v4(),
  community_id  uuid references public.communities(id) on delete cascade,
  url           text not null,
  caption       text,
  manual_order  int default 0,
  created_at    timestamptz default now()
);

-- ── 4. clergy ─────────────────────────────────────────────
create table if not exists public.clergy (
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

create index if not exists idx_clergy_order on public.clergy(manual_order);

-- ── 5. news ───────────────────────────────────────────────
create table if not exists public.news (
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

create index if not exists idx_news_slug       on public.news(slug);
create index if not exists idx_news_published  on public.news(published_at desc);

-- ── 6. news_gallery ───────────────────────────────────────
create table if not exists public.news_gallery (
  id           uuid primary key default uuid_generate_v4(),
  news_id      uuid references public.news(id) on delete cascade,
  url          text not null,
  caption      text,
  manual_order int default 0,
  created_at   timestamptz default now()
);

-- ── 7. mass_schedules ─────────────────────────────────────
create table if not exists public.mass_schedules (
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

create index if not exists idx_schedules_order on public.mass_schedules(manual_order);

-- ── 8. useful_links ───────────────────────────────────────
create table if not exists public.useful_links (
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

create index if not exists idx_links_order on public.useful_links(manual_order);

-- ── 9. pastorals ──────────────────────────────────────────
create table if not exists public.pastorals (
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

create index if not exists idx_pastorals_order on public.pastorals(manual_order);

-- ══════════════════════════════════════════════════════════
-- RLS — Row Level Security
-- ══════════════════════════════════════════════════════════

-- Habilitar RLS em todas as tabelas
alter table public.parish_profile   enable row level security;
alter table public.communities      enable row level security;
alter table public.community_gallery enable row level security;
alter table public.clergy           enable row level security;
alter table public.news             enable row level security;
alter table public.news_gallery     enable row level security;
alter table public.mass_schedules   enable row level security;
alter table public.useful_links     enable row level security;
alter table public.pastorals        enable row level security;

-- ── Leitura pública (anon pode ler) ───────────────────────
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

-- ── Escrita restrita a usuários autenticados ───────────────
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'parish_profile','communities','community_gallery',
    'clergy','news','news_gallery',
    'mass_schedules','useful_links','pastorals'
  ] loop
    execute format('
      create policy "Escrita autenticada — %I"
        on public.%I for all
        using (auth.role() = ''authenticated'')
        with check (auth.role() = ''authenticated'');
    ', tbl, tbl);
  end loop;
end $$;

-- ══════════════════════════════════════════════════════════
-- Dados iniciais de exemplo
-- ══════════════════════════════════════════════════════════

insert into public.parish_profile (id, title, content, address, phone, email) values
(1,
 'Nossa História',
 'A Paróquia Nossa Senhora das Graças foi fundada em 15 de agosto de 1962, na cidade de Cachoeiro de Itapemirim, Espírito Santo. Desde suas origens humildes em uma pequena capelinha de madeira, a paróquia cresceu ao longo das décadas e se tornou um importante polo de evangelização e serviço social da região.

Em 1978, iniciou-se a construção da Igreja Matriz, concluída em 1983, com sua bela fachada que se tornaria um dos pontos históricos da cidade.

Ao longo de mais de seis décadas, a paróquia expandiu sua atuação por diversas comunidades, formando uma rede de fé, caridade e evangelização que atende milhares de famílias.',
 'Rua Domingos Alcino Dadalto, 114 — Jardim Itapemirim, Cachoeiro de Itapemirim/ES · CEP: 29315-314',
 '(28) 3517-7296',
 'secretaria@paroquiansgracas.org.br'
) on conflict (id) do nothing;

insert into public.clergy (name, role, bio, is_current, manual_order) values
('Pe. Evaldo Praça Ferreira',   'parochus',         'Pároco da Paróquia Nossa Senhora das Graças.',                                         true,  1),
('Pe. André Lima Santos',       'vicar',            'Vigário paroquial, responsável pela catequese e pela juventude da paróquia.',          true,  2),
('Dc. Marcos Antônio Ferreira', 'deacon',           'Diácono permanente, atuando nas visitas hospitalares e sacramentos de necessidade.',   true,  3),
('Dc. Roberto Figueiredo',      'deacon_formation', 'Em processo de formação diaconal, auxiliando nas celebrações dominicais.',             false, 4)
on conflict do nothing;

insert into public.communities (name, slug, history, address, is_published, manual_order) values
('Comunidade São José',      'sao-jose',      'Uma das primeiras comunidades da paróquia, com forte tradição de catequese.',           'Rua São José, 123',      true, 1),
('Comunidade Santa Luzia',   'santa-luzia',   'Comunidade com grande devoção a Santa Luzia, reconhecida pelo trabalho com jovens.',    'Av. Santa Luzia, 88',    true, 2),
('Comunidade São Francisco', 'sao-francisco', 'Inspirada no espírito franciscano, é referência em ação ecológica e solidariedade.',    'Rua das Graças, 45',     true, 3),
('N. Sra. Aparecida',        'nsa-aparecida', 'Forte devoção mariana e grande participação nas festas em honra a Nossa Senhora.',      'Rua Aparecida, 300',     true, 4),
('Comunidade Santo Antônio', 'santo-antonio', 'Comunidade jovem com grande energia na evangelização e nos grupos de jovens adultos.',  'Tv. Santo Antônio, 12',  true, 5),
('Comunidade Santa Rita',    'santa-rita',    'A mais nova comunidade, com crescimento rápido e forte presença da Pastoral da Família.','Rua Santa Rita, 67',    true, 6)
on conflict (slug) do nothing;

insert into public.mass_schedules (day_label, time_label, location, type, is_active, manual_order) values
('Segunda-feira',      '7h00',                         'Igreja Matriz', 'mass', true, 1),
('Terça-feira',        '7h00',                         'Igreja Matriz', 'mass', true, 2),
('Quarta-feira',       '7h00 · 19h30',                 'Igreja Matriz', 'mass', true, 3),
('Quinta-feira',       '7h00',                         'Igreja Matriz', 'mass', true, 4),
('Sexta-feira',        '7h00 · 19h30',                 'Igreja Matriz', 'mass', true, 5),
('Sábado',            '18h00 (Missa Vespertina)',      'Igreja Matriz', 'mass', true, 6),
('Domingo',           '7h00 · 9h00 · 11h00 · 19h00', 'Igreja Matriz', 'mass', true, 7),
('Seg a Sex',          '8h às 11h30 · 14h às 17h30',  null,            'office', true, 10),
('Sábado',            '8h às 11h30',                  null,            'office', true, 11),
('Domingo',           'Após as missas',                null,            'office', true, 12),
('Confissões',         'Sáb. 16h às 17h30',            null,            'sacrament', true, 20),
('Batismos',           '1.º Dom./mês · 10h',           null,            'sacrament', true, 21),
('Casamentos',         'Agendamento antecipado',        null,            'sacrament', true, 22),
('Catequese',          'Sáb. 8h às 10h',               null,            'sacrament', true, 23)
on conflict do nothing;

insert into public.useful_links (title, url, description, category, is_active, manual_order) values
('Liturgia Diária',   'https://liturgia.cancaonova.com', 'Leituras, salmo e evangelho do dia',              'liturgia', true, 1),
('Santo do Dia',      'https://santo.cancaonova.com',    'Conheça o santo que a Igreja celebra hoje',        'liturgia', true, 2),
('Vatican News',      'https://www.vaticannews.va/pt.html','Notícias da Santa Sé em português',             'liturgia', true, 3),
('Canção Nova',       'https://www.cancaonova.com',      'TV, rádio e evangelização online',                 'liturgia', true, 4),
('CNBB',              'https://www.cnbb.org.br',         'Conferência Nacional dos Bispos do Brasil',        'geral',    true, 5),
('Cáritas Brasileira','https://caritas.org.br',          'Organização da CNBB de ação social',               'geral',    true, 6),
('Catequese Hoje',    'https://www.catequesehoje.com.br','Subsídios e formação para catequistas',            'geral',    true, 7),
('Pe. Paulo Ricardo', 'https://padrepauloricardo.org',   'Homilias, cursos e formação teológica',            'geral',    true, 8)
on conflict do nothing;

insert into public.pastorals (title, description, is_active, manual_order) values
('Pastoral da Criança',    'Acompanhamento nutricional e espiritual de crianças em situação de vulnerabilidade.',  true, 1),
('Pastoral Familiar',      'Encontros de casais para fortalecer os laços conjugais à luz do Evangelho.',           true, 2),
('Pastoral dos Enfermos',  'Visitas a hospitais e domicílios para levar conforto espiritual.',                     true, 3),
('Cáritas Paroquial',      'Distribuição de alimentos e apoio a famílias em vulnerabilidade.',                     true, 4),
('Ministério de Música',   'Grupos de canto e instrumentistas que animam as celebrações litúrgicas.',              true, 5),
('Catequese',              'Preparação para a Primeira Eucaristia e Crisma. Atende crianças e adultos.',           true, 6),
('Movimento de Jovens',    'Grupo de jovens adultos para reflexão, oração e serviço comunitário.',                 true, 7),
('Pastoral da Sobriedade', 'Apoio a pessoas com dependência química e seus familiares.',                           true, 8)
on conflict do nothing;
