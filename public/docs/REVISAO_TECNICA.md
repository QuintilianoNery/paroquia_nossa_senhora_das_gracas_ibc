# 🔍 Revisão Técnica Completa — Paróquia Nossa Senhora das Graças

**Data da Revisão:** 30 de maio de 2026  
**Versão do Projeto:** 1.0.0  
**Escopo:** Análise completa de arquitetura, React, Supabase, segurança e banco de dados

---

## 📋 Sumário Executivo

O projeto está **bem estruturado e funcional**, com boas práticas implementadas em geral. A aplicação é um CMS paroquial com:
- ✅ Autenticação e autorização básica em funcionamento
- ✅ CRUD genérico para múltiplas entidades
- ✅ Integração Supabase adequada
- ✅ RLS (Row Level Security) habilitado
- ⚠️ Alguns problemas de segurança críticos identificados
- ⚠️ Pontos de melhoria em React e tratamento de erros

**Risco Geral:** MÉDIO-ALTO (principalmente pela exposição de secrets)

---

## 1️⃣ Estrutura do Projeto

### Status: ✅ BOM

#### Organização de Pastas
```
src/
├── components/      ✅ Componentes reutilizáveis
├── features/auth/   ✅ Autenticação isolada
├── features/admin/  ✅ Admin bem separado
├── layouts/         ✅ Layouts padronizados
├── lib/            ✅ Utilitários centralizados
├── pages/          ✅ Páginas públicas
└── styles/         ✅ Estilos globais
```

#### Pontos Positivos
- **Separação clara** entre public, auth e admin
- **Lazy loading** implementado em rotas
- **Aliases de import** configurados (vite.config.js) — facilita leitura
- **Responsabilidades bem definidas** — lib para Supabase, components para reutilização

#### Identificação de Problemas

**PROBLEMA 1 — Arquivo problemático no diretório src**
```
src/{lib,styles,components,layouts,pages,features/
```
Este arquivo/pasta parece ser um artefato ou erro de sintaxe no nome. **Ação recomendada: Verificar e remover.**

**PROBLEMA 2 — Falta de hooks customizados**
Não há hooks customizados (ex: `useComments`, `useFetch`, etc). Lógica de fetch está espalhada em componentes. **Recomendação:** Criar `useSupabaseQuery` genérico.

**PROBLEMA 3 — Componentes sem divisão em camadas**
Admin pages fazem queries diretas via `CrudPage`. Melhor seria uma camada de serviços.

---

## 2️⃣ React

### Status: ⚠️ PARCIALMENTE CORRETO

#### `useState` e `useEffect`

**❌ PROBLEMA: useEffect sem tratamento de cleanup em Comunidades.jsx**
```jsx
// ❌ Problema no arquivo: src/pages/Comunidades.jsx
useEffect(() => {
  supabase.from('communities').select('*').eq('is_published', true).order('manual_order')
    .then(({ data }) => { if (data) setItems(data); setLoading(false) })
}, [])
```
- Falta **AbortController** para cancelar requisições pendentes
- Sem tratamento de erro (`.catch()`)
- Se o componente desmontar antes da promise resolver → memory leak potencial

**✅ Código correto recomendado:**
```jsx
useEffect(() => {
  let isMounted = true
  
  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('is_published', true)
        .order('manual_order')
      
      if (isMounted) {
        if (error) setError(error.message)
        else setItems(data || [])
        setLoading(false)
      }
    } catch (err) {
      if (isMounted) {
        setError(err.message)
        setLoading(false)
      }
    }
  }
  
  fetchData()
  return () => { isMounted = false }
}, [])
```

**❌ PROBLEMA: Múltiplos fetches paralelos sem await no AdminDashboard.jsx**
```jsx
useEffect(() => {
  const tables = ['communities', 'news', 'clergy', 'pastorals', 'useful_links']
  tables.forEach(async (t) => {  // ❌ forEach com async/await não aguarda
    const { count } = await supabase.from(t).select('*', { count: 'exact', head: true })
    setCounts(c => ({ ...c, [t]: count ?? 0 }))
  })
}, [])
```
- **Problema:** Sem dependências no effect
- **Problema:** Sem cleanup — múltiplas requisições simultâneas podem sobrecarregar
- Melhor usar `Promise.all()` ou `useCallback`

**✅ Código correto:**
```jsx
useEffect(() => {
  const fetchCounts = async () => {
    const tables = ['communities', 'news', 'clergy', 'pastorals', 'useful_links']
    try {
      const results = await Promise.all(
        tables.map(t =>
          supabase.from(t).select('*', { count: 'exact', head: true })
        )
      )
      const newCounts = {}
      results.forEach((res, i) => {
        newCounts[tables[i]] = res.count ?? 0
      })
      setCounts(newCounts)
    } catch (err) {
      console.error('Erro ao carregar contagens:', err)
    }
  }
  
  fetchCounts()
}, [])
```

#### AuthContext.jsx — Problemas identificados

**✅ BOAS PRÁTICAS:**
- Inicializa estado de loading corretamente
- Listener de auth com cleanup proper
- useAuth com validação de contexto

**❌ PROBLEMAS:**
1. **Sem timeout de session** — O token pode expirar e o usuário não será deslogado
2. **Sem refresh token handling** — Supabase expirar.refreshToken não é tratado

**Código melhorado:**
```jsx
useEffect(() => {
  const initAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    } catch (err) {
      console.error('Erro ao recuperar sessão:', err)
    } finally {
      setLoading(false)
    }
  }
  
  initAuth()

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null)
  })

  return () => subscription?.unsubscribe()
}, [])
```

#### ProtectedRoute — ✅ Correto
Verifica `user` e `loading` corretamente antes de renderizar.

#### CrudPage.jsx — Componente complexo, análise detalhada

**✅ PONTOS POSITIVOS:**
- Genérico para múltiplas tabelas
- Estados bem definidos (loading, editing, deleting)
- Trata reordenação manual

**❌ CRÍTICOS:**
```jsx
const fetchItems = useCallback(async () => {
  // ...
  let q = supabase.from(table).select('*').order(orderBy, { ascending: true })
  const { data, error } = await q
  if (error) setError(error.message)
  else setItems(data)
  setLoading(false)
}, [table, orderBy])
```
1. **Falta error.catch()** se a requisição falhar completamente
2. **Sem AbortController** — Se `table` mudar durante o fetch, não cancela a requisição anterior
3. **Sem validação de dados** — Se `data` for null, `setItems` recebe null

**❌ PROBLEMA CRÍTICO: Loops infinitos potenciais em reordenação**
```jsx
const handleReorder = async (item, direction) => {
  // ...
  await supabase.from(table).update({ [orderField]: bOrder }).eq('id', item.id)
  await supabase.from(table).update({ [orderField]: aOrder }).eq('id', other.id)
  fetchItems()  // ❌ Sem await! Renderização ocorre antes do fetch terminar
}
```
- Falta `await fetchItems()` 
- UI renderiza antes dos dados serem carregados

#### Renderizações desnecessárias

**PROBLEMA: Componentes reutilizáveis sem memo**
```jsx
// Em Home.jsx, QuickLinks é redefinido a cada render
function QuickLinks() { ... }
```
Melhor seria:
```jsx
const QuickLinks = React.memo(() => { ... })
```

---

## 3️⃣ Hooks Customizados

### Status: ❌ NÃO EXISTEM

**Problema crítico:** Lógica de fetch espalhada por toda a aplicação.

**Recomendação:** Criar hooks customizados:

1. **`useSupabaseQuery`** — Fetch genérico
```jsx
export function useSupabaseQuery(table, filter = {}, orderBy = 'created_at') {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    
    const fetchData = async () => {
      try {
        let query = supabase.from(table).select('*')
        
        // Aplicar filtros
        Object.entries(filter).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
        
        const { data, error } = await query.order(orderBy)
        
        if (isMounted) {
          if (error) throw error
          setData(data || [])
        }
      } catch (err) {
        if (isMounted) setError(err.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchData()
    return () => { isMounted = false }
  }, [table])

  return { data, loading, error }
}
```

2. **`useCrudOperations`** — Generalizar INSERT/UPDATE/DELETE
```jsx
export function useCrudOperations(table) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const create = async (values) => {
    setSaving(true)
    try {
      const { error } = await supabase.from(table).insert(values)
      if (error) throw error
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }

  const update = async (id, values) => {
    setSaving(true)
    try {
      const { error } = await supabase.from(table).update(values).eq('id', id)
      if (error) throw error
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    setSaving(true)
    try {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }

  return { create, update, remove, saving, error }
}
```

---

## 4️⃣ Integração com Supabase

### Status: ⚠️ PARCIALMENTE CORRETO

#### Configuração — ❌ CRÍTICO: Secrets expostos

**PROBLEMA MÁXIMO CRITÉRIO: `.env` exposto no repositório**

No arquivo `.env` estão:
```
VITE_SUPABASE_URL=https://gyduhttifysokusmqbha.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**❌ RISCO:** A chave `ANON_KEY` é publica (anon = anonymous), mas ainda é sensível. Se alguém tiver acesso ao repositório, pode explorar a API.

**✅ AÇÃO IMEDIATA:**
1. **Invalidar a chave no Supabase** (Settings → API)
2. **Gerar nova chave**
3. **Adicionar `.env` ao `.gitignore`** (se não estiver)
4. **Usar `.env.example`** para documentar quais variáveis são necessárias

**Verificar .gitignore:**
```bash
# Deve conter:
.env
.env.local
.env.*.local
```

#### Inicialização do Cliente — ✅ Correto
```jsx
export const supabase = createClient(supabaseUrl, supabaseKey)
```
Simples e direto.

#### Chamadas CRUD — ⚠️ Problemas encontrados

**1. Falta de tratamento de erro consistente**

Em vários lugares:
```jsx
// ❌ Sem .catch()
const { data } = await supabase.from('...').select('...')
if (data) setItems(data)  // E se error ocorrer?
```

**2. Sem validação de retorno**

```jsx
// Em CrudPage.jsx
const { data, error } = await q
if (error) setError(error.message)
else setItems(data)  // data pode ser null
```

Melhor:
```jsx
if (error) {
  setError(error.message)
  setItems([])
  return
}
setItems(data || [])
```

**3. Queries N+1 potencial**

Em `Home.jsx`, duas queries separadas:
```jsx
// Query 1
supabase.from('news').select('*').eq('is_published', true).order(...)

// Query 2 (separadamente)
supabase.from('communities').select('id,name,address,image_url').eq('is_published', true).order(...)
```

Isso é OK porque são tabelas diferentes, mas em componentes complexos pode haver N+1.

#### Funcionalidades Críticas

**SELECT — ✅ Correto**
```jsx
supabase.from('communities').select('*').eq('is_published', true)
```

**INSERT — ⚠️ Sem validação de retorno**
```jsx
const { error } = await supabase.from(table).insert(values)
if (error) throw error
```
✅ Bom, mas falta verificar se `data` foi retornado.

**UPDATE — ⚠️ Falta validação de conflitos**
```jsx
const { error } = await supabase.from(table).update(values).eq('id', editing.id)
```
Não verifica se a linha realmente existe ou foi atualizada.

**DELETE — ⚠️ Falta confirmação**
```jsx
const { error } = await supabase.from(table).delete().eq('id', deleting.id)
```
Sem validação de existência antes de deletar.

---

## 5️⃣ Endpoints e Serviços

### Status: ⚠️ PARCIALMENTE IMPLEMENTADO

**Problema:** Não há camada de serviços. Todas as operações acontecem diretamente em componentes.

**Recomendação:** Criar `src/lib/services/`:
```
src/lib/services/
├── communitiesService.js
├── newsService.js
├── clergyService.js
├── parishService.js
└── index.js
```

**Exemplo de serviço:**
```jsx
// src/lib/services/communitiesService.js
export const communitiesService = {
  async getAll(published = true) {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('is_published', published)
      .order('manual_order')
    
    if (error) throw new Error(`Erro ao carregar comunidades: ${error.message}`)
    return data || []
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) throw new Error(`Comunidade não encontrada: ${error.message}`)
    return data
  },

  async create(values) {
    const { data, error } = await supabase.from('communities').insert(values)
    if (error) throw new Error(`Erro ao criar comunidade: ${error.message}`)
    return data?.[0]
  },

  async update(id, values) {
    const { data, error } = await supabase
      .from('communities')
      .update(values)
      .eq('id', id)
    if (error) throw new Error(`Erro ao atualizar comunidade: ${error.message}`)
    return data?.[0]
  },

  async delete(id) {
    const { error } = await supabase.from('communities').delete().eq('id', id)
    if (error) throw new Error(`Erro ao deletar comunidade: ${error.message}`)
  }
}
```

### Tratamento de Erros — ❌ INADEQUADO

**Problemas encontrados:**

1. **Uso de `alert()` em produção** (CrudPage.jsx):
```jsx
alert('Erro ao salvar: ' + e.message)
```
Usar toast notifications em vez disso.

2. **Erros não são persistidos** — Usuário vê erro e depois desaparece.

3. **Sem retry logic** — Se a rede falhar, sem possibilidade de tentar novamente.

**Recomendação: Implementar toast de erros**
```jsx
// src/lib/toast.js
export const showToast = (message, type = 'info') => {
  // Implementação com toast library (ex: react-toastify)
}

// Uso
try {
  await saveItem()
  showToast('Item salvo com sucesso!', 'success')
} catch (err) {
  showToast(`Erro: ${err.message}`, 'error')
}
```

---

## 6️⃣ Fluxo de Cadastro

### Status: ⚠️ PARCIALMENTE FUNCIONAL

**Análise do fluxo em AdminNoticias:**

1. ✅ **Validação com Zod** — Bom uso de schema de validação
2. ⚠️ **Upload de imagem sem validação de tamanho**
3. ⚠️ **Sem feedback de progresso** — Usuário não sabe se imagem está sendo enviada
4. ✅ **Auto-slug** — Bom UX

**Problemas identificados:**

**❌ PROBLEMA 1: Slug não valida duplicação**
```jsx
const schema = z.object({
  slug: z.string().min(3, 'Informe o slug'),
  // Sem validação de unicidade!
})
```

Se dois items tiverem o mesmo slug, o banco rejeitará:
```
Error: duplicate key value violates unique constraint "idx_news_slug"
```

Melhor:
```jsx
slug: z.string()
  .min(3, 'Slug deve ter pelo menos 3 caracteres')
  .refine(
    async (val) => {
      const { count } = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true })
        .eq('slug', val)
      return count === 0
    },
    { message: 'Este slug já está em uso' }
  )
```

**❌ PROBLEMA 2: Upload de imagem sem tratamento de tamanho**
```jsx
const submit = async (values) => {
  try {
    let uploaded = values.image_url || ''
    if (imageFile) uploaded = await uploadMedia(imageFile, 'news')
    // Nenhuma validação de tamanho
  } catch (err) {
    setImageError(err?.message)
  }
}
```

Adicionar validação em `uploadMedia.js`:
```jsx
export async function uploadMedia(file, folder = 'general') {
  if (!file) return ''

  // Validar tamanho (max 5MB)
  const MAX_SIZE = 5 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    throw new Error('Imagem muito grande. Máximo 5MB.')
  }

  // ... resto do código
}
```

**❌ PROBLEMA 3: Sem progresso de upload**

O usuário não recebe feedback se está enviando ou não. Adicionar:
```jsx
const [uploadProgress, setUploadProgress] = useState(0)

const submit = async (values) => {
  if (imageFile) {
    const formData = new FormData()
    formData.append('file', imageFile)
    
    // Isso seria melhor com XMLHttpRequest ou uma lib com suporte a progress
    // Por enquanto, mostrar loading simples
  }
}
```

---

## 7️⃣ Fluxo de Login

### Status: ✅ BASICAMENTE CORRETO (com ressalvas)

**Análise do fluxo em Login.jsx:**

✅ **Positivos:**
- Validação básica de email/senha
- Redirecionamento após login
- Mensagens de erro claras
- Estado de loading durante autenticação

❌ **Problemas:**

**1. Sem validação de email/senha**
```jsx
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
// Sem validação mínima

const handleSubmit = async (e) => {
  // Poderia validar: email.includes('@'), password.length >= 6
}
```

**2. Sem CSRF protection**
O formulário não usa token CSRF (se necessário para sua arquitetura).

**3. Sem rate limiting no frontend**
Se alguém fizer força bruta, sem proteção.

**4. Erro genérico demais**
```jsx
catch (err) {
  setError('E-mail ou senha inválidos. Verifique suas credenciais.')
}
```
Isso é bom para segurança (não revela qual campo está errado), mas pode ser frustrante para o usuário.

**5. Sem recuperação de senha**
Não há fluxo de reset de senha.

---

## 8️⃣ JWT

### Status: ⚠️ PARCIALMENTE IMPLEMENTADO

### Frontend

**✅ Positivos:**
- Supabase gerencia tokens automaticamente
- `AuthProvider` obtém a sessão na inicialização

**❌ Problemas:**

**1. Sem refresh token handling explícito**
```jsx
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null)
  })
}, [])
```

Supabase auto-refresh tokens, mas não há tratamento de expiração forçada.

**2. Sem timeout de sessão**
A sessão durará até expirar no Supabase. Melhor:
```jsx
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutos

useEffect(() => {
  let timeout
  const resetTimeout = () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      signOut()
      window.location.href = '/admin/login'
    }, SESSION_TIMEOUT)
  }

  window.addEventListener('mousemove', resetTimeout)
  window.addEventListener('keypress', resetTimeout)
  resetTimeout()

  return () => {
    clearTimeout(timeout)
    window.removeEventListener('mousemove', resetTimeout)
    window.removeEventListener('keypress', resetTimeout)
  }
}, [])
```

**3. Sem verificação de role/permission**
O código verifica apenas `user`, não `user.role` ou metadata.

Melhor:
```jsx
const isAdmin = () => {
  return user?.user_metadata?.role === 'admin'
}
```

### Backend (Supabase)

**✅ RLS habilitado**
```sql
alter table public.news enable row level security;
```

**❌ Mas falta restrição por role**
As policies apenas verificam `auth.role() = 'authenticated'`:
```sql
create policy "Escrita autenticada — %I"
  on public.%I for all
  using (auth.role() = 'authenticated')
```

Melhor seria:
```sql
create policy "Escrita administrativa — news"
  on public.news for all
  using (auth.role() = 'authenticated' AND public.is_admin())
  with check (auth.role() = 'authenticated' AND public.is_admin());
```

Seria necessário uma função `is_admin()` no Supabase que verifica o metadata do usuário.

---

## 9️⃣ Segurança

### Status: ❌ CRÍTICA

#### 🔴 PROBLEM 1: Chaves expostas no repositório

**CRITICIDADE:** CRÍTICA  
**Arquivo:** `.env`  
**Descrição:** VITE_SUPABASE_ANON_KEY visível no repositório público

**Ação imediata:**
1. Invalidar a chave no painel do Supabase
2. Gerar nova chave
3. Atualizar `.env` localmente (não fazer commit)
4. Verificar Git history e remover commits com secrets

```bash
# Verificar se .env está no .gitignore
cat .gitignore | grep ".env"

# Se não estiver, adicionar
echo ".env" >> .gitignore
echo ".env.*.local" >> .gitignore
```

#### 🔴 PROBLEM 2: Sem CORS configuration na origem

Se o Supabase permitir qualquer origem (CORS lax), qualquer site pode fazer requisições em seu nome.

**Verificar:** Settings do Supabase → API → CORS

Deve estar restrito a `https://seu-dominio.com`

#### 🟡 PROBLEM 3: Sem Content Security Policy (CSP)

Nenhuma header CSP está configurada. Vulnerável a XSS.

**Adicionar ao vite.config.js ou servidor:**
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; ...
```

#### 🟡 PROBLEM 4: Sem validação de entrada em formulários

Exemplo em Contato.jsx:
```jsx
const handleSubmit = (e) => {
  e.preventDefault()
  // Sem sanitização de mensagem
  const form = { nome, email, telefone, assunto, mensagem }
}
```

Se a mensagem for inserida diretamente no banco sem validação, pode haver:
- XSS (se renderizada em HTML)
- SQL Injection (se concatenada em query)

**Melhor:**
```jsx
const sanitize = (str) => {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

const handleSubmit = async (e) => {
  e.preventDefault()
  const sanitized = {
    nome: sanitize(form.nome),
    email: form.email, // emails são menos críticos
    mensagem: sanitize(form.mensagem)
  }
  // enviar para servidor
}
```

#### 🟡 PROBLEM 5: Sem proteção contra brute force no login

Nenhuma rate limiting no formulário de login. Se alguém tiver um formulário login exposto, pode fazer força bruta.

**Solução:** Usar Supabase Auth com rate limiting nativo ou implementar no servidor.

#### 🟡 PROBLEM 6: Dados sensíveis potencialmente logados

Procurar por `console.log` com dados sensíveis:
```jsx
// Em desenvolvimento, pode haver logs como:
console.log(error.message) // Se contiver informações de BD
```

**Recomendação:** Remover ou logar apenas em desenvolvimento:
```jsx
if (import.meta.env.DEV) {
  console.error('Debug:', error)
}
```

#### 🟡 PROBLEM 7: Sem controle de acesso em rotas admin

`ProtectedRoute` apenas verifica se `user` existe, não se é admin:
```jsx
if (!user) {
  return <Navigate to="/admin/login" ... />
}
return children  // ❌ Qualquer usuário logado entra!
```

**Deve ser:**
```jsx
const isAdmin = user?.user_metadata?.role === 'admin'
if (!isAdmin) {
  return <Navigate to="/" replace />
}
```

---

## 🔟 Banco de Dados

### Status: ✅ ESTRUTURA BOM, ⚠️ RLS INCOMPLETO

### Estrutura

#### ✅ Tabelas bem definidas:
- `parish_profile` — Profile da paróquia
- `communities` — Comunidades vinculadas
- `community_gallery` — Galeria por comunidade
- `clergy` — Clero
- `news` — Notícias
- `news_gallery` — Galeria de notícias
- `mass_schedules` — Horários de missas
- `useful_links` — Links úteis
- `pastorals` — Pastorais

#### ✅ Constraints apropriados:
- Foreign keys com `ON DELETE CASCADE` (apropriado)
- CHECK constraints (ex: role em clergy)
- Unique constraints (ex: slug em news)
- Índices em campos de busca e ordenação

#### ❌ Problema: Falta índice em alguns campos frequentemente usados
```sql
-- Índices existentes:
create index idx_communities_slug on public.communities(slug);
create index idx_communities_order on public.communities(manual_order);

-- Índices que faltam:
-- Falta: news.is_published + published_at (composite index)
-- Falta: communities.is_published + manual_order
```

**Adicionar:**
```sql
create index idx_news_published_at on public.news(is_published, published_at DESC);
create index idx_communities_published_order on public.communities(is_published, manual_order);
```

#### ❌ Problema: Tipos de dados não otimizados

Em `parish_profile`:
```sql
latitude text,    -- ❌ Deveria ser NUMERIC
longitude text,   -- ❌ Deveria ser NUMERIC
```

Melhor:
```sql
latitude DECIMAL(10, 8),
longitude DECIMAL(11, 8),
```

### Integridade referencial — ✅ Bom

```sql
community_id uuid references public.communities(id) on delete cascade
```

Community gallery é deletada automaticamente se comunidade for deletada. ✅

### Nomenclatura

**❌ Inconsistência:**
- `communities` (plural)
- `news` (singular, mas plural em inglês)
- `clergy` (singular coletivo)
- `pastorals` (plural)

**Melhor:** Padronizar como `community`, `news_item`, `clergyman`, etc.

**Nota:** Já que o schema está em produção, não é prático mudar agora, mas documentar.

### Performance

#### Índices ausentes:
1. Composite index em `(is_published, manual_order)` para queries comuns
2. Índice em `news.is_published` (muitas queries filtram por isso)

#### N+1 Queries potencial:
Em `Home.jsx`:
```jsx
// Query 1: Pega notícias
supabase.from('news').select('...')

// Query 2: Pega comunidades (separadamente)
supabase.from('communities').select('...')
```

Não é N+1 porque são tabelas diferentes, mas em casos de galeria:
```jsx
// Para cada comunidade, fetcha galeria
communities.forEach(c => {
  supabase.from('community_gallery').select('*').eq('community_id', c.id)
})
```

**Melhor:** Usar join ou selecionar tudo em uma query com `community_gallery(*)`:
```jsx
supabase.from('communities')
  .select('*, community_gallery(*)')
  .eq('is_published', true)
```

---

## 1️⃣1️⃣ Row Level Security (RLS)

### Status: ⚠️ HABILITADO MAS INCOMPLETO

#### Verificação por tabela:

**`parish_profile`**
- ✅ RLS habilitado
- ✅ Policy de leitura pública: `(true)` — qualquer pessoa lê
- ❌ Policy de escrita: `auth.role() = 'authenticated'` — todos autenticados escrevem!

**`communities`**
- ✅ RLS habilitado
- ✅ Policy de leitura: `is_published = true` — apenas publicadas
- ❌ Policy de escrita: `auth.role() = 'authenticated'` — sem verificação de admin

**`clergy`**
- ✅ RLS habilitado
- ✅ Policy de leitura: `is_current = true` — apenas current (bom!)
- ❌ Policy de escrita: `auth.role() = 'authenticated'`

**`news`**
- ✅ RLS habilitado
- ✅ Policy de leitura: `is_published = true`
- ❌ Policy de escrita: Sem restrição

**`pastorals`**
- ✅ RLS habilitado
- ✅ Policy de leitura: `is_active = true`
- ❌ Policy de escrita: Sem restrição

#### 🔴 CRÍTICO: Falta validação de admin em escrita

Todas as policies de escrita usam:
```sql
create policy "Escrita autenticada — %I"
  on public.%I for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

**ISSO SIGNIFICA:** Qualquer usuário autenticado pode editar qualquer tabela!

**Solução:** Criar função SQL que verifica admin:
```sql
-- Função auxiliar
create or replace function public.is_admin()
returns boolean as $$
declare
  user_role text;
begin
  select auth.jwt() ->> 'role' into user_role;
  return user_role = 'admin';
end;
$$ language plpgsql security definer;

-- Usar em policies
create policy "Escrita administrativa — communities"
  on public.communities for all
  using (public.is_admin())
  with check (public.is_admin());
```

**Ou usar app_metadata do Supabase:**
```sql
create policy "Escrita administrativa — news"
  on public.news for all
  using (auth.jwt() ->> 'app_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'app_metadata' ->> 'role' = 'admin');
```

#### Riscos encontrados

| Tabela | Risco | Severidade |
|--------|-------|-----------|
| parish_profile | Qualquer autenticado altera paróquia | 🔴 CRÍTICA |
| communities | Qualquer autenticado cria/edita comunidades | 🔴 CRÍTICA |
| clergy | Qualquer autenticado adiciona clero | 🔴 CRÍTICA |
| news | Qualquer autenticado publica notícias | 🔴 CRÍTICA |
| pastorals | Qualquer autenticado edita pastorais | 🔴 CRÍTICA |
| mass_schedules | Qualquer autenticado altera horários | 🔴 CRÍTICA |

---

## 1️⃣2️⃣ Rotas

### Status: ✅ ESTRUTURA BOA

#### Rotas Públicas — ✅ Correto
```jsx
<Route element={<PublicLayout />}>
  <Route index element={<Home />} />
  <Route path="paroquia" element={<Paroquia />} />
  <Route path="comunidades" element={<Comunidades />} />
  <Route path="comunidades/:slug" element={<ComunidadeDetalhe />} />
  <Route path="noticias" element={<Noticias />} />
  <Route path="horarios" element={<Horarios />} />
  <Route path="pastorais" element={<Pastorais />} />
  <Route path="links" element={<Links />} />
  <Route path="contato" element={<Contato />} />
</Route>
```

#### Rotas Privadas — ⚠️ Parcialmente protegidas
```jsx
<Route path="admin" element={
  <ProtectedRoute>
    <AdminLayout />
  </ProtectedRoute>
}>
```

**Problema:** `ProtectedRoute` apenas verifica `user`, não `isAdmin`.

#### Rota de Login — ✅ Correto
```jsx
<Route path="admin/login" element={<Login />} />
```

#### Fallback — ✅ Correto
```jsx
<Route path="*" element={<Navigate to="/" replace />} />
```

---

## 1️⃣3️⃣ Qualidade de Código

### Status: ⚠️ PARCIALMENTE BOM

#### Legibilidade — ✅ BOA
- Nomes de variáveis claros
- Componentes bem estruturados
- CSS inline organizado

#### Manutenibilidade — ⚠️ MÉDIA
- Lógica de fetch espalhada (sem hooks customizados)
- CrudPage é complexo (250+ linhas)
- Sem camada de serviços

#### Escalabilidade — ❌ FRACA
- Sem estrutura para novos recursos
- Códogo fortemente acoplado a Supabase
- Sem padrão de componentes reutilizáveis

#### Code Smells — Identificados

**1. Componente excessivamente grande: CrudPage.jsx**
```jsx
export default function CrudPage({
  table, title, columns, FormComponent,
  orderBy = 'created_at', reorderField = null, 
  searchField = null, canReorder = false
})
```
250+ linhas fazendo listing, edit, delete, reorder.

**Refatorar em:**
- `CrudList.jsx` — Apenas listagem
- `CrudForm.jsx` — Apenas formulário
- `useCrudPage.js` — Hook com lógica

**2. Funções inline em componentes**
```jsx
// Em Home.jsx
function Hero() { ... }
function QuickLinks() { ... }
function Destaques() { ... }
```

Melhor em arquivos separados ou usar React.memo.

**3. Styles inline excessivos**
Quase todos os componentes usam `style={{...}}`. Melhor usar CSS modules ou styled-components.

**4. Magic strings**
```jsx
const tables = ['communities', 'news', 'clergy', 'pastorals', 'useful_links']
```

Melhor:
```jsx
const CRUD_TABLES = {
  COMMUNITIES: 'communities',
  NEWS: 'news',
  CLERGY: 'clergy',
  PASTORALS: 'pastorals',
  USEFUL_LINKS: 'useful_links'
}
```

#### Anti-patterns

**1. Props drilling**
```jsx
<CrudPage FormComponent={NoticiaForm} ... />

function NoticiaForm({ item, onSave, onCancel, saving })
```

Muitas props. Melhor usar Context.

**2. Boolean props everywhere**
```jsx
canReorder, isPublished, is_current, is_published, is_active
```

Sem padrão de nomenclatura.

**3. Sem error boundary**
Se um componente crashar, a página inteira falha.

**Adicionar:**
```jsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error)
  }

  render() {
    return this.state.hasError 
      ? <div>Erro ao carregar componente</div>
      : this.props.children
  }
}
```

#### Complexidade — MÉDIA
- CrudPage é complexo (faz muito)
- Lógica de reordenação é confusa
- Sem comentários explicativos em seções críticas

---

## 📊 Sumário de Problemas

### Críticos 🔴 (3)
1. **Secrets expostos no repositório** (`.env` com ANON_KEY)
2. **RLS sem validação de admin** (qualquer autenticado altera dados)
3. **ProtectedRoute não verifica admin** (qualquer logado entra no admin)

### Altos 🟠 (5)
4. useEffect sem cleanup em Comunidades.jsx (memory leak)
5. CrudPage sem error handling robusto
6. Sem hooks customizados (duplicação de código)
7. Slug não valida duplicação
8. Sem tratamento de erro consistente

### Médios 🟡 (6)
9. Sem timeout de sessão
10. Upload sem validação de tamanho
11. Índices de BD incompletos
12. Componentes excessivamente grandes
13. Sem CSP headers
14. Sem rate limiting no login

---

## ✅ Recomendações Prioritárias

### Imediato (24h)
- [ ] **Invalidar ANON_KEY do Supabase**
- [ ] **Gerar nova chave**
- [ ] **Adicionar `.env` ao `.gitignore`**
- [ ] **Implementar validação de admin em RLS**
- [ ] **Corrigir ProtectedRoute para verificar role**

### Curto Prazo (1 semana)
- [ ] Criar `useSupabaseQuery` hook
- [ ] Refatorar CrudPage em componentes menores
- [ ] Adicionar validação de slug único
- [ ] Implementar timeout de sessão
- [ ] Adicionar validação de tamanho de imagem
- [ ] Implementar toast de erros

### Médio Prazo (1 mês)
- [ ] Criar camada de serviços
- [ ] Adicionar Error Boundary
- [ ] Migrar styles inline para CSS modules
- [ ] Implementar rate limiting
- [ ] Adicionar CSP headers
- [ ] Adicionar testes unitários

### Longo Prazo (3+ meses)
- [ ] Refatorar para TypeScript
- [ ] Implementar analytics
- [ ] Otimizar queries (índices, joins)
- [ ] Implementar cache
- [ ] Adicionar PWA capabilities

---

## 📚 Documentação Adicional

### Arquivos que precisam ser criados:

1. **`.env.example`** — Template de variáveis
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. **`src/lib/hooks/useSupabaseQuery.js`** — Hook genérico
3. **`src/lib/services/index.js`** — Camada de serviços
4. **`SECURITY.md`** — Guia de segurança
5. **`ARCHITECTURE.md`** — Documentação da arquitetura

---

## 🎯 Conclusão

O projeto está **funcional e bem estruturado em geral**, mas apresenta **problemas críticos de segurança** que precisam ser resolvidos imediatamente. A implementação React é adequada, mas há oportunidades significativas de melhoria em tratamento de erros, modularização e performance.

**Prioridade de correção:**
1. **Segurança** — Secrets, RLS, autenticação
2. **Confiabilidade** — Error handling, cleanup
3. **Manutenibilidade** — Hooks, serviços, componentes
4. **Performance** — Índices, queries otimizadas

---

**Revisão concluída em:** 30/05/2026  
**Próxima revisão sugerida:** 30/08/2026 (após implementar recomendações)
