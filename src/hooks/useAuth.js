import { useEffect, useMemo, useState } from 'react'
import { hasSupabaseEnv, supabase } from '../lib/supabase'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!hasSupabaseEnv || !supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
      setLoading(false)
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const actions = useMemo(
    () => ({
      async login(email, password) {
        setError('')
        if (!supabase) {
          setError('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para habilitar o login.')
          return { ok: false }
        }
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
        if (authError) {
          setError(authError.message)
          return { ok: false, error: authError }
        }
        return { ok: true }
      },
      async logout() {
        if (supabase) {
          await supabase.auth.signOut()
        }
      }
    }),
    []
  )

  return {
    session,
    user: session?.user ?? null,
    loading,
    error,
    ...actions
  }
}
