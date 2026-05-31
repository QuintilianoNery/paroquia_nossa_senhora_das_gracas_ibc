import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '@lib/supabase'
import { toast } from '@lib/toast'

const AuthContext = createContext(null)

const INACTIVITY_MS = 30 * 60 * 1000 // 30 minutes

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const timerRef = useRef(null)

  const checkIsAdmin = async (u) => {
    if (!u) {
      setIsAdmin(false)
      return false
    }
    try {
      // Prefer RPC if available, fallback to false
      const { data, error } = await supabase.rpc('is_admin')
      if (error) {
        setIsAdmin(false)
        return false
      } else {
        const admin = Boolean(data)
        setIsAdmin(admin)
        return admin
      }
    } catch (err) {
      setIsAdmin(false)
      return false
    }
  }

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return
        setUser(session?.user ?? null)
        await checkIsAdmin(session?.user ?? null)
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      checkIsAdmin(session?.user ?? null)
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  // Inactivity auto sign-out
  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(async () => {
        try {
          await supabase.auth.signOut()
          toast.info('Sessão expirada por inatividade')
        } catch (err) {
          console.error('Erro ao encerrar sessão por inatividade', err)
        }
      }, INACTIVITY_MS)
    }

    const events = ['mousemove', 'keydown', 'click', 'touchstart']
    events.forEach(e => window.addEventListener(e, resetTimer))
    resetTimer()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach(e => window.removeEventListener(e, resetTimer))
    }
  }, [])

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      const signedInUser = data?.user ?? null
      setUser(signedInUser)
      const admin = await checkIsAdmin(signedInUser)
      if (!admin) {
        await supabase.auth.signOut()
        setUser(null)
        setIsAdmin(false)
        const notAllowedError = new Error('Sua conta não tem permissão para acessar a área administrativa.')
        notAllowedError.code = 'NOT_ADMIN'
        throw notAllowedError
      }
      return data
    } catch (err) {
      throw err
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
