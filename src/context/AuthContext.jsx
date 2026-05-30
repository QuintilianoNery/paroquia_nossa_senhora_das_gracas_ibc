import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    }

    bootstrap();

    if (!supabase) {
      return undefined;
    }

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function signIn(email, password) {
    if (!supabase) {
      throw new Error('Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY antes de autenticar.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setSession(data.session ?? null);
    setUser(data.session?.user ?? null);
    return data;
  }

  async function signOut() {
    if (!supabase) {
      setSession(null);
      setUser(null);
      return;
    }

    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ session, user, loading, signIn, signOut, isAuthenticated: Boolean(user) }),
    [loading, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}