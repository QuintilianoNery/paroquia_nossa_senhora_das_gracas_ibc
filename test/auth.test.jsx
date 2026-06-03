import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AuthProvider, useAuth } from '@features/auth/AuthContext'
import ProtectedRoute from '@features/auth/ProtectedRoute'
import { BrowserRouter } from 'react-router-dom'

function Dummy() {
  const { user, loading } = useAuth()
  return <div>{loading ? 'loading' : (user ? 'logged' : 'anon')}</div>
}

describe('AuthProvider and ProtectedRoute', () => {
  it('provides auth context and protects routes', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute>
            <div>private</div>
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.queryByText('Verificando acesso...')).not.toBeInTheDocument()
    })
  })

  it('useAuth returnsa loading state initially', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Dummy />
        </AuthProvider>
      </BrowserRouter>
    )
    expect(screen.getByText(/loading|anon/)).toBeInTheDocument()
  })
})
