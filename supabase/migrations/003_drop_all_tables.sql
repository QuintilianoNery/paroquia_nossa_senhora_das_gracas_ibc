-- ============================================================
-- DROP — Paróquia NSG — Remove todas as tabelas do schema public
-- WARNING: este script apaga dados permanentemente. Faça backup antes.
-- Execute no SQL Editor do Supabase ou via psql local conforme instruções.
-- ============================================================

-- Remova políticas (opcional — não necessário se as tabelas forem dropadas em cascade)
-- DROP POLICY IF EXISTS "Leitura pública — parish_profile" ON public.parish_profile;

-- Drop das tabelas criadas pelas migrations anteriores (ordem segura)
drop table if exists public.community_gallery cascade;
drop table if exists public.news_gallery cascade;
drop table if exists public.community_gallery cascade; -- redundância segura
drop table if exists public.news cascade;
drop table if exists public.communities cascade;
drop table if exists public.news_gallery cascade;
drop table if exists public.clergy cascade;
drop table if exists public.mass_schedules cascade;
drop table if exists public.useful_links cascade;
drop table if exists public.pastorals cascade;
drop table if exists public.parish_profile cascade;

-- Caso queira também remover a extensão UUID (opcional)
-- drop extension if exists "uuid-ossp";

-- Para garantir que não reste nada, você pode listar objetos no schema public:
-- SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Fim
