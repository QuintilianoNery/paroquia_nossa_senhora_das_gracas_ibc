# 🔍 Visualização de Problemas e Fluxos

Diagramas e visualizações da revisão técnica.

---

## 📊 Matriz de Severidade

```
IMPACTO CRÍTICO
    ▲
    │   🔴 Secrets           🔴 RLS Fraco    🔴 Auth Fraco
    │   Expostos            (qualquer       (qualquer
    │   (dia 0)             autenticado)    logado)
    │
    │        🟠 Memory       🟠 CrudPage     🟠 Sem
    │        Leaks          Error           Hooks
    │
    │              🟡 Slug    🟡 Upload      🟡 Components
    │              Dup.      Size           Grandes
    │
    └──────────────────────────────────────────────▶
      0h    24h   1w      2w      1m      2m     3m
             TEMPO PARA CORREÇÃO
```

---

## 🔐 Fluxo de Segurança — ANTES vs DEPOIS

### ❌ ANTES (Inseguro)

```
GitHub Repo
    │
    ├─ .env (SECRETS EXPOSTOS!)
    │   ├─ VITE_SUPABASE_URL
    │   └─ VITE_SUPABASE_ANON_KEY
    │
    └─ src/features/auth/ProtectedRoute.jsx
       │
       └─ if (!user) redirect else render ❌ Qualquer logado entra!
           │
           └─ Admin Panel (DESPROTEGIDO!)
               └─ Qualquer usuário pode:
                   ├─ Editar notícias
                   ├─ Deletar comunidades
                   ├─ Alterar horários
                   └─ Modificar paróquia
```

### ✅ DEPOIS (Seguro)

```
GitHub Repo (Seguro)
    │
    ├─ .gitignore (contém .env)
    │
    └─ src/features/auth/
       │
       ├─ AuthContext.jsx
       │   ├─ getSession()
       │   ├─ isAdmin (verifica metadata)
       │   └─ timeout (30 min)
       │
       └─ ProtectedRoute.jsx
           │
           ├─ if (!user) redirect
           └─ if (!isAdmin) redirect ✅ Apenas admin
               │
               └─ Admin Panel (PROTEGIDO!)
                   │
                   └─ Supabase RLS
                       └─ is_admin() function
                           └─ Qualquer operação:
                               ├─ Verifica autenticação
                               ├─ Verifica role=admin
                               └─ Rejeita se não admin
```

---

## 🔄 Fluxo de Login — ANTES vs DEPOIS

### ❌ ANTES

```
Login
  │
  ├─ signIn(email, password)
  │   └─ Supabase auth.signInWithPassword()
  │
  ├─ ✅ Usuário logado
  │   └─ Token guardado automaticamente
  │
  ├─ ❌ Sem timeout
  │   └─ Token nunca expira (até Supabase expirar)
  │
  └─ ❌ Sem verificação de role
      └─ Qualquer usuário logado = admin
```

### ✅ DEPOIS

```
Login
  │
  ├─ signIn(email, password)
  │   └─ Supabase auth.signInWithPassword()
  │
  ├─ ✅ Usuário logado
  │   ├─ Token guardado
  │   └─ isAdmin extraído de metadata
  │
  ├─ ✅ Timeout de inatividade
  │   └─ 30 min sem atividade = logout automático
  │
  ├─ ✅ Verificação de role
  │   └─ user.user_metadata.role = 'admin'?
  │
  └─ Acesso a /admin
      ├─ Se admin → Admin Layout ✅
      ├─ Se não admin → Redirect / ✅
      └─ Se não logado → Redirect /login ✅
```

---

## 📦 Arquitetura — Componentes Afetados

```
App.jsx
├── AuthProvider ✅ CORRIGIDO
│   └── useAuth() → { user, isAdmin, timeout }
│
├── Routes
│   ├── Public Routes ✅ OK
│   │   ├── /
│   │   ├── /comunidades
│   │   └── /noticias
│   │
│   ├── Auth Route
│   │   └── /admin/login ✅ OK
│   │
│   └── Protected Routes
│       └── ProtectedRoute ✅ CORRIGIDO
│           └── requireAdmin check
│               └── AdminLayout
│                   ├── /admin (Dashboard)
│                   ├── /admin/noticias
│                   ├── /admin/comunidades
│                   └── /admin/clero
│
└── Components
    ├── CrudPage ⚠️ REFATORAR
    │   ├── Listagem ❌ 250+ linhas
    │   ├── Formulário ❌ Misturado
    │   └── Reordenação ❌ Complexo
    │
    ├── Upload ✅ CORRIGIDO
    │   ├── Tamanho validado
    │   └─ Tipo validado
    │
    └── Toast (novo) 🟡 ADICIONAR
        └── Mensagens de erro
```

---

## 🗄️ Banco de Dados — RLS Policies

### ❌ ANTES (Inseguro)

```
news table
├─ RLS habilitado ✅
├─ Policy: select (is_published = true)
│   └─ Qualquer pessoa vê notícias publicadas ✅
│
└─ Policy: insert, update, delete
    └─ Qualquer AUTENTICADO escreve ❌❌❌
        ├─ Usuário comum pode criar notícias
        ├─ Usuário comum pode deletar notícias
        └─ Usuário comum pode editar tudo

Risco: admin.com/admin-painel = qualquer logado é admin!
```

### ✅ DEPOIS (Seguro)

```
news table
├─ RLS habilitado ✅
├─ Policy: select (is_published = true)
│   └─ Qualquer pessoa vê notícias publicadas ✅
│
└─ Policy: insert, update, delete
    └─ Apenas ADMIN escreve ✅
        ├─ is_admin() function = true
        ├─ Usuário comum é BLOQUEADO
        └─ Apenas usuário com role=admin entra

Risco: Mitigado! ✅
```

---

## 🎯 Fluxo de CRUD — ANTES vs DEPOIS

### ❌ ANTES (sem error handling)

```
CrudPage
├─ fetchItems()
│   ├─ supabase.from(table).select(...)
│   ├─ if (error) setError(...)  ⚠️ Sem retry
│   └─ else setItems(data)       ❌ data pode ser null
│
├─ handleSave()
│   └─ supabase.from(table).insert(values)
│       ├─ ❌ Sem validação de resposta
│       ├─ ❌ Erro silencioso
│       └─ ❌ alert() em produção
│
└─ handleDelete()
    └─ supabase.from(table).delete()
        ├─ ❌ Sem confirmação
        ├─ ❌ Sem validação de existência
        └─ ❌ alert() em produção

UX Ruim:
- Usuário não sabe se salvou
- Erros aparecem em caixa de alerta
- Sem feedback visual
```

### ✅ DEPOIS (com error handling)

```
CrudPage (refatorado)
├─ useCrudOperations(table)
│   ├─ create() → { saving, error }
│   ├─ update() → { saving, error }
│   └─ delete() → { deleting, error }
│
├─ useSupabaseQuery(table)
│   ├─ { data, loading, error, refetch }
│   ├─ Cleanup automático
│   └─ Retry integrado
│
├─ handleSave()
│   ├─ try/catch ✅
│   ├─ Validação de resposta ✅
│   ├─ toast.success() ✅
│   └─ toast.error() ✅
│
├─ handleDelete()
│   ├─ Confirmação visual ✅
│   ├─ try/catch ✅
│   └─ toast feedback ✅
│
└─ ErrorBoundary
    └─ Se algo quebra, mostra erro amigável ✅

UX Ótima:
- Feedback visual em tempo real
- Toast notifications
- Mensagens de erro claras
- Sem crashes silenciosos
```

---

## 🚀 Timeline de Implementação

```
Semana 1 │ Semana 2 │ Semana 3 │ Semana 4+ │
      │       │       │       │
CRÍTICA    ALTA    ALTA    MÉDIA
(24h)    (1-2w)  (2-4w)  (1m+)
│       │       │       │
├─ Invalidar  ├─ useSupabaseQuery   ├─ CrudPage       ├─ TypeScript
│  secrets    │                     │  refatorado    │
├─ .gitignore ├─ useCrudOperations  ├─ Services      ├─ Testes
│             │                     │                 │
├─ RLS admin  ├─ Toast Service     ├─ CSS Modules   ├─ PWA
│             │                     │                 │
├─ AuthContext├─ Fix uploadMedia    ├─ Índices BD    ├─ Analytics
│             │                     │                 │
├─ ProtRoute ├─ Fix Comunidades    ├─ SSR           └─ Otimizações
│             │                     │
└─ .env.ex   └─ Error Boundary     └─ Segurança
                                      avançada

Risco Residual:
ANTES:  🔴🔴🔴 Crítico (2/10)
DIA 1:  🔴🟠    Médio-Alto (4/10)
SEM 2:  🟠🟡    Médio (5.5/10)
MÊS 1:  🟡🟢    Baixo (7/10)
MÊS 3:  🟢✅    Muito Baixo (9/10)
```

---

## 💻 Stack de Tecnologias — Análise

```
Frontend
├─ React 18.2.0 ✅ Atualizado
│  └─ Hooks, Context, lazy loading
├─ Vite 5.0.8 ✅ Rápido
├─ React Router 6.21.0 ✅ Moderno
└─ React Hook Form 7.49.0 ✅ Bom

Validação
├─ Zod 3.22.4 ✅ Excelente
├─ @hookform/resolvers 3.3.2 ✅ Integrado
└─ slugify 1.6.6 ✅ Bom

Backend
├─ Supabase JS 2.39.0 ✅ Atualizado
└─ PostgreSQL 14+ (via Supabase)

Storage
├─ Supabase Storage ✅ Funcional
└─ Validações adicionadas? ⚠️ Não

Utilitários
├─ date-fns 3.0.6 ✅ Bom
└─ ESLint 8.55.0 ✅ Configurado

❌ Faltando:
├─ TypeScript
├─ Testing library
├─ Error boundary
├─ Toast notifications
└─ Service layer
```

---

## 📈 Métricas de Saúde — Antes e Depois

```
ANTES (Atual)              DEPOIS (Meta)
────────────────────────────────────────

Segurança:      2/10 ──────→ 9/10 ✅
                🔴🔴🔴🔴 ✅✅✅✅✅
                
Error Handling: 4/10 ──────→ 9/10 ✅
                🔴🔴🟡      ✅✅✅✅✅
                
Modularização:  5/10 ──────→ 8/10 ✅
                🔴🟡🟡      ✅✅✅✅
                
Performance:    6/10 ──────→ 8/10 ✅
                🔴🟡🟡      ✅✅✅✅
                
Manutenibilidade: 5/10 ──────→ 8/10 ✅
                🔴🟡🟡      ✅✅✅✅
                
MÉDIA GERAL:    4.4/10 ──────→ 8.4/10 ✅
                🔴🔴🟡      ✅✅✅✅
```

---

## 🧠 Esquema de Decisão — Como Priorizar

```
Você vai fazer UMA mudança. Qual?

┌─ É segurança crítica?
│  ├─ Sim → Crítica (hoje!)
│  │        ├─ Secrets expostos
│  │        ├─ RLS fraca
│  │        └─ Auth fraca
│  │
│  └─ Não → Qual é o impacto?
│     │
│     ├─ Memory leak / Crash? → Alta (esta semana)
│     │                          ├─ useEffect cleanup
│     │                          └─ Error handling
│     │
│     ├─ UX ruim / Dados errados? → Média (este mês)
│     │                              ├─ Toast notifications
│     │                              └─ Validações
│     │
│     └─ Código feio / Lento? → Baixa (próximo mês)
│                                ├─ Refatoração
│                                └─ Performance
```

---

## 🎓 Lições de Arquitetura

### ✅ O Que Funciona Bem

```
Estrutura de Pastas:
src/
├─ components/     ✅ Reutilizáveis
├─ features/       ✅ Feature-based
├─ layouts/        ✅ Bem separadas
├─ pages/          ✅ Page-specific
├─ lib/            ✅ Utilitários
└─ styles/         ✅ Global

Padrões:
├─ Context API para auth ✅
├─ Lazy loading de rotas ✅
├─ Alias de imports ✅
└─ Validação com Zod ✅
```

### ❌ O Que Precisa Melhorar

```
Faltando:
├─ ❌ Hooks customizados (duplicação)
├─ ❌ Camada de serviços (CRUD direto em componentes)
├─ ❌ Error boundaries (sem proteção)
├─ ❌ Toast notifications (alert() em prod)
├─ ❌ TypeScript (sem type safety)
└─ ❌ Testes (sem coverage)

Anti-patterns:
├─ ❌ Styles inline demais
├─ ❌ Componentes muito grandes
├─ ❌ Lógica no componente vs hook
└─ ❌ Sem cleanup em effects
```

---

**Fim da visualização. Para detalhes, veja REVISAO_TECNICA.md** 📚
