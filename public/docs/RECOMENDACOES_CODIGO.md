# 🛠️ Recomendações de Código — Paróquia NSG

Implementações práticas dos problemas identificados na revisão técnica.

---

## 1. Corrigir `.gitignore`

**Arquivo:** `.gitignore`

Adicionar (se não existir):
```
# Environment variables
.env
.env.local
.env.*.local
.env.production

# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist
/.next
/out

# Misc
.DS_Store
*.pem
*.log

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# OS
Thumbs.db
.DS_Store
```

---

## 2. Criar `.env.example`

**Arquivo:** `.env.example`

```
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Service Role Key (NUNCA usar no frontend!)
# VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

---

## 3. Criar Hook `useSupabaseQuery`

**Arquivo:** `src/lib/hooks/useSupabaseQuery.js`

```jsx
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@lib/supabase'

/**
 * Hook genérico para queries no Supabase
 * @param {string} table - Nome da tabela
 * @param {object} options - Opções { filters, orderBy, limit }
 * @returns {object} { data, loading, error, refetch }
 */
export function useSupabaseQuery(table, options = {}) {
  const { filters = {}, orderBy = 'created_at', limit = null } = options
  
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      let query = supabase.from(table).select('*')

      // Aplicar filtros
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value)
        }
      })

      // Ordenação
      if (orderBy) {
        const [field, direction] = orderBy.includes(':') 
          ? orderBy.split(':') 
          : [orderBy, 'asc']
        query = query.order(field, { ascending: direction === 'asc' })
      }

      // Limite
      if (limit) query = query.limit(limit)

      const { data: responseData, error: responseError } = await query

      if (responseError) {
        setError(responseError.message)
        setData([])
      } else {
        setData(responseData || [])
      }
    } catch (err) {
      setError(err.message)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [table, JSON.stringify(filters), orderBy, limit])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

/**
 * Hook genérico para uma query que retorna um único item
 */
export function useSupabaseQuerySingle(table, filters = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        let query = supabase.from(table).select('*')
        
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value)
        })

        const { data: responseData, error: responseError } = await query.single()

        if (responseError) {
          setError(responseError.message)
          setData(null)
        } else {
          setData(responseData)
        }
      } catch (err) {
        setError(err.message)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [table, JSON.stringify(filters)])

  return { data, loading, error }
}
```

---

## 4. Criar Hook `useCrudOperations`

**Arquivo:** `src/lib/hooks/useCrudOperations.js`

```jsx
import { useState } from 'react'
import { supabase } from '@lib/supabase'

/**
 * Hook para operações CRUD (Create, Read, Update, Delete)
 */
export function useCrudOperations(table) {
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

  const create = async (values) => {
    setSaving(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from(table)
        .insert([values])
        .select()
      
      if (err) throw err
      return data?.[0]
    } catch (err) {
      const message = err.message || 'Erro ao criar item'
      setError(message)
      throw new Error(message)
    } finally {
      setSaving(false)
    }
  }

  const update = async (id, values) => {
    setSaving(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from(table)
        .update(values)
        .eq('id', id)
        .select()
      
      if (err) throw err
      return data?.[0]
    } catch (err) {
      const message = err.message || 'Erro ao atualizar item'
      setError(message)
      throw new Error(message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    setDeleting(true)
    setError(null)
    try {
      const { error: err } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
      
      if (err) throw err
    } catch (err) {
      const message = err.message || 'Erro ao deletar item'
      setError(message)
      throw new Error(message)
    } finally {
      setDeleting(false)
    }
  }

  return {
    create,
    update,
    remove,
    saving,
    deleting,
    error,
    clearError: () => setError(null)
  }
}
```

---

## 5. Corrigir AuthContext.jsx

**Arquivo:** `src/features/auth/AuthContext.jsx`

```jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@lib/supabase'

const AuthContext = createContext(null)

// Timeout de inatividade (30 minutos)
const SESSION_TIMEOUT = 30 * 60 * 1000

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Recuperar sessão ao iniciar
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Erro ao recuperar sessão:', error.message)
        }
        
        setUser(session?.user ?? null)
        setIsAdmin(session?.user?.user_metadata?.role === 'admin')
      } catch (err) {
        console.error('Erro ao inicializar auth:', err.message)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setIsAdmin(session?.user?.user_metadata?.role === 'admin')
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  // Timeout de inatividade
  useEffect(() => {
    if (!user) return

    let timeout
    let lastActivityTime = Date.now()

    const resetTimeout = () => {
      lastActivityTime = Date.now()
      clearTimeout(timeout)
      
      timeout = setTimeout(async () => {
        console.warn('Sessão expirada por inatividade')
        await signOut()
      }, SESSION_TIMEOUT)
    }

    // Resetar timeout em atividade
    const events = ['mousemove', 'keypress', 'click', 'scroll']
    events.forEach(event => {
      window.addEventListener(event, resetTimeout)
    })

    resetTimeout()

    return () => {
      clearTimeout(timeout)
      events.forEach(event => {
        window.removeEventListener(event, resetTimeout)
      })
    }
  }, [user])

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      return data
    } catch (err) {
      throw new Error(err.message || 'Erro ao fazer login')
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setIsAdmin(false)
    } catch (err) {
      console.error('Erro ao fazer logout:', err.message)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return ctx
}
```

---

## 6. Corrigir ProtectedRoute.jsx

**Arquivo:** `src/features/auth/ProtectedRoute.jsx`

```jsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function ProtectedRoute({ children, requireAdmin = true }) {
  const { user, loading, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <i
            className="ti ti-loader"
            style={{
              fontSize: 32,
              display: 'block',
              marginBottom: 12,
              animation: 'spin 1s linear infinite'
            }}
            aria-hidden="true"
          />
          Verificando acesso...
        </div>
      </div>
    )
  }

  // Usuário não autenticado
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Se requer admin e usuário não é admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}
```

---

## 7. Criar Toast Service

**Arquivo:** `src/lib/toast.js`

```jsx
// Simples implementação sem biblioteca externa
const subscribers = new Set()

export const toast = {
  show: (message, type = 'info', duration = 3000) => {
    const id = Math.random()
    const notification = { id, message, type, duration }
    
    subscribers.forEach(callback => callback(notification))
    
    setTimeout(() => {
      subscribers.forEach(callback => callback({ id, remove: true }))
    }, duration)
  },

  success: (message) => toast.show(message, 'success'),
  error: (message) => toast.show(message, 'error'),
  warning: (message) => toast.show(message, 'warning'),
  info: (message) => toast.show(message, 'info'),

  subscribe: (callback) => {
    subscribers.add(callback)
    return () => subscribers.delete(callback)
  }
}
```

**Componente Toast Provider:**
```jsx
// src/components/ToastProvider.jsx
import { useEffect, useState } from 'react'
import { toast } from '@lib/toast'

export function ToastProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const unsubscribe = toast.subscribe((notification) => {
      if (notification.remove) {
        setNotifications(n => n.filter(x => x.id !== notification.id))
      } else {
        setNotifications(n => [...n, notification])
      }
    })

    return unsubscribe
  }, [])

  return (
    <>
      {children}
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={`alert alert-${notif.type}`}
            style={{
              minWidth: 300,
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            {notif.message}
          </div>
        ))}
      </div>
    </>
  )
}
```

**Uso em main.jsx:**
```jsx
import { ToastProvider } from '@components/ToastProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
```

---

## 8. Corrigir uploadMedia.js

**Arquivo:** `src/lib/uploadMedia.js`

```jsx
import { supabase } from '@lib/supabase'

const DEFAULT_BUCKET = 'site-images'
const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MIME_BY_EXTENSION = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
}

function getFileExtension(fileName = '') {
  const parts = fileName.toLowerCase().split('.')
  return parts.length > 1 ? parts.pop() : ''
}

function getContentType(file) {
  if (file?.type && ALLOWED_MIME_TYPES.has(file.type)) return file.type
  const ext = getFileExtension(file?.name)
  return MIME_BY_EXTENSION[ext] ?? 'application/octet-stream'
}

function createFileId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export async function uploadMedia(file, folder = 'general') {
  if (!file) {
    throw new Error('Nenhum arquivo foi selecionado.')
  }

  // Validar tamanho
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `Arquivo muito grande. Máximo ${MAX_FILE_SIZE / 1024 / 1024}MB.`
    )
  }

  const contentType = getContentType(file)
  if (!ALLOWED_MIME_TYPES.has(contentType)) {
    throw new Error('Formato inválido. Use PNG, JPEG ou WEBP.')
  }

  try {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '_')
    const path = `${folder}/${createFileId()}-${safeName}`

    const { error: uploadError } = await supabase.storage
      .from(DEFAULT_BUCKET)
      .upload(path, file, {
        upsert: true,
        cacheControl: '3600',
        contentType,
      })

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage
      .from(DEFAULT_BUCKET)
      .getPublicUrl(path)

    return data.publicUrl
  } catch (err) {
    throw new Error(
      err.message || 'Erro ao fazer upload da imagem.'
    )
  }
}
```

---

## 9. Criar arquivo de configuração de ambiente

**Arquivo:** `src/lib/env.js`

```jsx
// Validar variáveis de ambiente na inicialização
export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}

// Validar ao inicializar
if (!env.supabaseUrl || !env.supabaseAnonKey) {
  throw new Error(
    'Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não configuradas. ' +
    'Copie .env.example para .env e preencha com suas credenciais.'
  )
}

export default env
```

---

## 10. Adicionar SQL para RLS com validação de admin

**Arquivo:** `supabase/migrations/006_fix_rls_admin.sql`

```sql
-- ============================================================
-- Migration 006 — Fix RLS to require admin role for writes
-- ============================================================

begin;

-- Função auxiliar para verificar admin
create or replace function public.is_admin()
returns boolean as $$
declare
  user_role text;
begin
  select auth.jwt() ->> 'app_metadata' ->> 'role' into user_role;
  return user_role = 'admin';
end;
$$ language plpgsql security definer;

-- Remover políticas antigas de escrita
drop policy if exists "Escrita autenticada — parish_profile" on public.parish_profile;
drop policy if exists "Escrita autenticada — communities" on public.communities;
drop policy if exists "Escrita autenticada — community_gallery" on public.community_gallery;
drop policy if exists "Escrita autenticada — clergy" on public.clergy;
drop policy if exists "Escrita autenticada — news" on public.news;
drop policy if exists "Escrita autenticada — news_gallery" on public.news_gallery;
drop policy if exists "Escrita autenticada — mass_schedules" on public.mass_schedules;
drop policy if exists "Escrita autenticada — useful_links" on public.useful_links;
drop policy if exists "Escrita autenticada — pastorals" on public.pastorals;

-- Criar políticas de escrita com validação de admin
create policy "Escrita administrativa — parish_profile"
  on public.parish_profile for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Escrita administrativa — communities"
  on public.communities for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Escrita administrativa — community_gallery"
  on public.community_gallery for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Escrita administrativa — clergy"
  on public.clergy for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Escrita administrativa — news"
  on public.news for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Escrita administrativa — news_gallery"
  on public.news_gallery for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Escrita administrativa — mass_schedules"
  on public.mass_schedules for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Escrita administrativa — useful_links"
  on public.useful_links for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Escrita administrativa — pastorals"
  on public.pastorals for all
  using (public.is_admin())
  with check (public.is_admin());

commit;
```

---

## 11. Corrigir Comunidades.jsx

**Arquivo:** `src/pages/Comunidades.jsx`

```jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@lib/supabase'
import { toast } from '@lib/toast'

const COLORS = ['#3d7f91','#2a5f6e','#c19241','#96711e','#4a6170','#1a3e49']

const PLACEHOLDER = [
  { id:1, slug:'sao-jose',       name:'Comunidade São José',       address:'Rua São José, 123',       history:'Uma das primeiras comunidades, com forte tradição de catequese e movimento de casais.', google_maps_url:'' },
  { id:2, slug:'santa-luzia',    name:'Comunidade Santa Luzia',    address:'Av. Santa Luzia, 88',     history:'Comunidade com grande devoção a Santa Luzia, reconhecida pelo trabalho com jovens e famílias.', google_maps_url:'' },
  { id:3, slug:'sao-francisco',  name:'Comunidade São Francisco',  address:'Rua das Graças, 45',      history:'Inspirada no espírito franciscano, é referência em ação ecológica, partilha e solidariedade.', google_maps_url:'' },
  { id:4, slug:'nsa-aparecida',  name:'N. Sra. Aparecida',         address:'Rua Aparecida, 300',      history:'Forte devoção mariana e grande participação nas festas em honra a Nossa Senhora Aparecida.', google_maps_url:'' },
  { id:5, slug:'santo-antonio',  name:'Comunidade Santo Antônio',  address:'Tv. Santo Antônio, 12',   history:'Comunidade jovem com grande energia na evangelização e nos grupos de jovens adultos.', google_maps_url:'' },
  { id:6, slug:'santa-rita',     name:'Comunidade Santa Rita',     address:'Rua Santa Rita, 67',      history:'A mais nova comunidade, com crescimento rápido e forte presença da Pastoral da Família.', google_maps_url:'' },
]

export default function Comunidades() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchCommunities = async () => {
      try {
        const { data, error: err } = await supabase
          .from('communities')
          .select('*')
          .eq('is_published', true)
          .order('manual_order')

        if (err) {
          throw err
        }

        if (isMounted) {
          setItems(data || [])
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          console.error('Erro ao carregar comunidades:', err)
          setError(err.message)
          setItems([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchCommunities()

    return () => {
      isMounted = false
    }
  }, [])

  const list = (!loading && items.length) ? items : PLACEHOLDER

  return (
    <>
      <div className="page-hero">
        <p className="breadcrumb">Início / Comunidades</p>
        <h1>Nossas <span>Comunidades</span></h1>
      </div>

      <section style={{ background: '#fff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <span className="section-label">Comunidades vinculadas</span>
          <h2 className="section-title">Conheça cada comunidade</h2>
          <div className="divider"></div>
          <p className="section-sub">
            A paróquia é formada por comunidades espalhadas pelo município, cada uma com sua história, devoção e vida própria de fé.
          </p>

          {error && !loading && (
            <div className="alert alert-warning" style={{ marginBottom: '2rem' }}>
              Erro ao carregar comunidades. Exibindo dados de exemplo.
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 22 }}>
            {list.map((c, i) => (
              <Link key={c.id || c.slug} to={`/comunidades/${c.slug || ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article className="card" style={{ overflow: 'hidden', transition: 'box-shadow .2s, transform .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
                >
                  {/* Banner */}
                  <div style={{
                    height: 160,
                    background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}dd, ${COLORS[i % COLORS.length]})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
                  }}>
                    {c.image_url ? (
                      <img src={c.image_url} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <i className="ti ti-building-church" style={{ fontSize: 64, color: 'rgba(255,255,255,.2)' }} aria-hidden="true"></i>
                    )}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent,rgba(0,0,0,.35))', padding: '2rem 1.5rem 1rem' }}>
                      <h2 style={{ fontFamily: 'var(--font-serif)', color: '#fff', fontSize: '1.2rem' }}>{c.name}</h2>
                    </div>
                  </div>

                  <div className="card-body">
                    {c.history && (
                      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 16 }}>
                        {c.history.substring(0, 160)}{c.history.length > 160 ? '...' : ''}
                      </p>
                    )}

                    {c.address && (
                      <p style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <i className="ti ti-map-pin" aria-hidden="true"></i>{c.address}
                      </p>
                    )}

                    {c.google_maps_url && (
                      <a href={c.google_maps_url} target="_blank" rel="noopener noreferrer"
                        className="btn btn-teal btn-sm" style={{ display: 'inline-flex', marginTop: 6 }}>
                        <i className="ti ti-map" aria-hidden="true"></i> Ver no Maps
                      </a>
                    )}

                    <div style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: 'var(--teal)' }}>
                      Ver detalhes <i className="ti ti-arrow-right" aria-hidden="true"></i>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:600px){section > div > div:last-child{grid-template-columns:1fr!important}}`}</style>
      </section>
    </>
  )
}
```

---

## 12. Criar Error Boundary

**Arquivo:** `src/components/ErrorBoundary.jsx`

```jsx
import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <h1 style={{ color: 'var(--teal-xdark)', marginBottom: '1rem' }}>
              Algo deu errado
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Desculpe, ocorreu um erro inesperado.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="btn btn-teal"
            >
              Voltar para o início
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
```

**Uso em App.jsx:**
```jsx
import ErrorBoundary from '@components/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        {/* Routes aqui */}
      </Suspense>
    </ErrorBoundary>
  )
}
```

---

## Resumo de Implementação

| Item | Prioridade | Tempo | Status |
|------|-----------|-------|--------|
| 1. .gitignore | 🔴 Crítica | 5min | ⬜ |
| 2. .env.example | 🔴 Crítica | 5min | ⬜ |
| 3. Invalidar ANON_KEY | 🔴 Crítica | 10min | ⬜ |
| 4. useSupabaseQuery | 🟠 Alta | 20min | ⬜ |
| 5. useCrudOperations | 🟠 Alta | 20min | ⬜ |
| 6. AuthContext corrigido | 🟠 Alta | 30min | ⬜ |
| 7. ProtectedRoute corrigido | 🟠 Alta | 15min | ⬜ |
| 8. Toast Service | 🟠 Alta | 25min | ⬜ |
| 9. uploadMedia corrigido | 🟠 Alta | 10min | ⬜ |
| 10. RLS Migration | 🔴 Crítica | 15min | ⬜ |
| 11. Comunidades.jsx corrigido | 🟡 Média | 15min | ⬜ |
| 12. Error Boundary | 🟡 Média | 15min | ⬜ |

**Tempo total estimado:** ~2-3 horas para implementação completa

