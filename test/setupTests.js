import '@testing-library/jest-dom'

// Mock supabase client used in tests to avoid network calls
vi.mock('@lib/supabase', () => {
  const mock = {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: () => {} } } })),
      signInWithPassword: vi.fn(({ email, password }) => Promise.resolve({ data: { user: { id: 'u1', email } }, error: null })),
      signOut: vi.fn(() => Promise.resolve()),
    },
    from: vi.fn(() => ({ select: vi.fn().mockResolvedValue({ data: [], error: null }) })),
    rpc: vi.fn(() => Promise.resolve({ data: false, error: null })),
    storage: { from: vi.fn(() => ({ upload: vi.fn(), getPublicUrl: vi.fn(() => ({ data: { publicUrl: '' } })) })) }
  }
  return { supabase: mock }
})
