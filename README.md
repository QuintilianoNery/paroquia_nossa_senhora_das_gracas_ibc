# Paróquia Nossa Senhora das Graças

Base institucional em React + Vite + Supabase para o site da paróquia e a área administrativa.

## Stack

- React 18
- Vite
- React Router
- Supabase Auth / JWT
- Supabase Postgres

## Como rodar

1. Instale as dependências com `npm install`.
2. Copie `.env.example` para `.env` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
3. Execute `npm run dev`.

## Supabase

1. Crie o projeto no Supabase.
2. Rode o arquivo `supabase-schema.sql` no SQL Editor.
3. Convide o usuário admin em Authentication -> Users -> Invite user.
4. Ajuste os dados iniciais no painel administrativo.

## Observações

- A sessão do admin está configurada para expirar após 30 minutos de inatividade.
- A interface pública segue o layout do protótipo `modelo_demo.html`, com a paleta da marca da paróquia.
