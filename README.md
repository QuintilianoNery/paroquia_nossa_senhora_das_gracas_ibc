# Paróquia Nossa Senhora das Graças — Site Institucional

Stack: **React + Vite + React Router + Supabase Auth/DB + React Hook Form + Zod**

---

## 🚀 Configuração em 5 passos

### 1. Clonar e instalar

```bash
cd paroquia-nsg
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Onde encontrar:** Supabase Dashboard → seu projeto → Settings → API

---

### 3. Criar o banco de dados

No Supabase Dashboard, vá em **SQL Editor** e execute as migrations nesta ordem:

```text
supabase/migrations/001_schema.sql
supabase/migrations/004_clergy_order_and_rls.sql
supabase/migrations/005_images_upload.sql
supabase/migrations/006_fix_rls_admin.sql
supabase/migrations/007_repair_news_image_and_storage.sql
```

Se o projeto for novo, as migrations são idempotentes e podem ser executadas sem risco.
Se você já estiver com erro de `image_url` ou `Bucket not found`, execute pelo menos a `007_repair_news_image_and_storage.sql`.

---

### 4. Criar o usuário administrador

No Supabase Dashboard → **Authentication → Users → Add user**

| Campo  | Valor                                      |
|--------|--------------------------------------------|
| Email  | `secretaria@paroquiansgracas.org.br`       |
| Senha  | (defina uma senha segura)                  |

> Ou use **Invite user** para enviar convite por e-mail.

---

### 5. Rodar o projeto

```bash
npm run dev
```

Acesse: `http://localhost:5173`

Para o painel admin: `http://localhost:5173/admin`

---

## 📁 Estrutura do projeto

```
src/
├── components/        # Header, Footer, Logo
├── features/
│   ├── auth/          # AuthContext, Login, ProtectedRoute
│   └── admin/         # Dashboard, CrudPage reutilizável
│       ├── paroquia/  # Editar história da paróquia
│       ├── clero/     # CRUD padres e diáconos
│       ├── comunidades/ # CRUD comunidades
│       ├── noticias/  # CRUD notícias
│       ├── horarios/  # CRUD horários
│       └── links/     # CRUD links + pastorais
├── layouts/           # PublicLayout, AdminLayout
├── lib/               # supabase.js (client)
├── pages/             # Home, Paroquia, Comunidades, Noticias...
└── styles/            # globals.css (design system completo)
```

---

## 🎨 Identidade visual

| Token          | Cor       | Uso                     |
|----------------|-----------|-------------------------|
| `--teal`       | `#3d7f91` | Cor principal da marca  |
| `--teal-xdark` | `#1a3e49` | Fundo do admin/hero     |
| `--gold`       | `#c19241` | Destaque / dourado      |
| `--cream`      | `#f7f3e9` | Fundo das páginas       |

Tipografia: **STIX Two Text** (serifada, fonte oficial da marca)

---

## 🔒 Segurança (RLS — Row Level Security)

| Operação             | Quem pode          |
|----------------------|--------------------|
| SELECT (leitura)     | Qualquer visitante |
| INSERT / UPDATE / DELETE | Apenas autenticados (admin) |

As políticas são definidas no migration SQL.

---

## 📦 Build para produção

```bash
npm run build
```

A pasta `dist/` pode ser publicada em **Vercel**, **Netlify** ou qualquer host estático.

### Variáveis no deploy (Vercel/Netlify)

Adicione nas configurações do projeto:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 🗺️ Rotas

### Públicas
| Rota           | Página           |
|----------------|------------------|
| `/`            | Home             |
| `/paroquia`    | História + Clero |
| `/comunidades` | Lista de comunidades |
| `/noticias`    | Lista de notícias |
| `/horarios`    | Horários de missas |
| `/pastorais`   | Pastorais        |
| `/links`       | Links úteis      |
| `/contato`     | Contato          |

### Admin (requer login)
| Rota                  | Módulo           |
|-----------------------|------------------|
| `/admin`              | Dashboard        |
| `/admin/login`        | Login            |
| `/admin/paroquia`     | Editar paróquia  |
| `/admin/clero`        | CRUD clero       |
| `/admin/comunidades`  | CRUD comunidades |
| `/admin/noticias`     | CRUD notícias    |
| `/admin/horarios`     | CRUD horários    |
| `/admin/links`        | CRUD links       |
| `/admin/pastorais`    | CRUD pastorais   |
