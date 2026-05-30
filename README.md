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

No Supabase Dashboard, vá em **SQL Editor** e cole o conteúdo de:

```
supabase/migrations/001_schema.sql
```

Execute o script. Ele irá:
- Criar todas as tabelas com os campos corretos
- Configurar RLS (leitura pública + escrita autenticada)
- Inserir dados iniciais de exemplo

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
