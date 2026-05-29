# Guia de implantação da Fase 5

## 1. Criar projeto no Supabase
- Acesse [https://supabase.com/](https://supabase.com/)
- Clique em **New project**
- Defina organização, nome do projeto, senha do banco e região

## 2. Configurar API
Em **Settings → API** copie:
- Project URL
- anon public key

Preencha no frontend:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx
```

## 3. Criar admin
No painel do Supabase:
- Authentication → Users
- Invite user
- Informe o e-mail do administrador
- O usuário definirá a senha via fluxo do Supabase ou poderá ser ajustado no painel

## 4. Executar SQL
Abra **SQL Editor** e execute o conteúdo de `schema.sql`.

## 5. Bucket de mídia
Criar bucket:
- Name: `site-media`
- Public bucket: habilitado para imagens públicas do site

## 6. Integrar no código
O login foi preparado com:
```js
await supabase.auth.signInWithPassword({ email, password })
```

Isso substitui qualquer `handleLogin()` fictício do protótipo.

O frontend agora segue a estrutura padrão do Vite em `src/`, com entrada em `src/main.jsx` e rotas em `src/App.jsx`.

## 7. Próxima evolução sugerida
- Implementar serviços por domínio em `src/services`
- Criar hooks `useCommunities`, `useNews`, `useClergy`
- Adicionar formulários reais com upload de imagens para Supabase Storage
- Criar editor rico para história e notícias
- Adicionar confirmação de exclusão e paginação real
