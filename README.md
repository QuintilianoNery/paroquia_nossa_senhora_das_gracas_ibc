# Paróquia Nossa Senhora das Graças - Fase 5

Projeto React + Vite + Supabase com site público, autenticação administrativa, CRUDs e estrutura inicial para produção.

## Estrutura
- `src/main.jsx` é a entrada do Vite.
- `src/App.jsx` concentra as rotas públicas e administrativas.
- `src/components`, `src/layouts`, `src/pages`, `src/hooks`, `src/lib` e `src/data` organizam a aplicação.

## Stack
- React + Vite
- React Router
- Supabase Auth + Database + Storage
- JWT gerenciado pelo Supabase

## Instalação
```bash
npm install
cp .env.example .env
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Variáveis obrigatórias
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Passos no Supabase
1. Criar um projeto em [Supabase](https://supabase.com/).
2. Copiar `Project URL` e `anon public key` em Settings → API.
3. Preencher `.env` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
4. No SQL Editor, executar `supabase/schema.sql`.
5. Em Authentication → Users → Invite user, criar o usuário administrador.
6. Publicar imagens no bucket `site-media`.

## Regras implementadas
- Site público com home, paróquia, comunidades, notícias, horários, links, pastorais e contato.
- Login administrativo com `supabase.auth.signInWithPassword()`.
- Substituição do `handleLogin()` fake por autenticação real do Supabase.
- Área administrativa com CRUD para conteúdos principais.
- Estrutura preparada para RLS e auditoria com `created_by`.
- Sem persistência manual em storage; apenas a sessão mínima do Supabase.

## Observação
O projeto foi montado para reaproveitar o protótipo do front enviado, usando a paleta da marca:
- Azul principal: `#3d7f91`
- Dourado: `#c19241`
- Azul claro: `#a4bac5`
- Dourado claro: `#dfc79f`
- Fundo creme: `#f7f3e9`
