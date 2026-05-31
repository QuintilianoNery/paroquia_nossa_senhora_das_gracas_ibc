import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Logo from '@components/Logo'

export default function Login() {
  const { signIn } = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const from       = location.state?.from?.pathname || '/admin'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      if (err?.code === 'NOT_ADMIN') {
        setError('Sua conta autenticou, mas não tem permissão para acessar a área administrativa.')
      } else {
        setError('E-mail ou senha inválidos. Verifique suas credenciais.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--cream-dark)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Logo size={60} style={{ margin: '0 auto 16px' }} />
          <p style={{ fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: 4 }}>
            Paróquia Nossa Senhora das Graças
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--teal-xdark)', fontSize: '1.5rem' }}>
            Área Administrativa
          </h1>
        </div>

        {/* Card */}
        <div className="card">
          <div className="card-body">
            {error && (
              <div className="alert alert-error" style={{ marginBottom: 20 }}>
                <i className="ti ti-alert-circle"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">E-mail</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="admin@paroquiansgracas.org.br"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Senha</label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-teal btn-full"
                disabled={loading}
                style={{ marginTop: 8 }}
              >
                {loading
                  ? <><i className="ti ti-loader-2"></i> Entrando...</>
                  : <><i className="ti ti-login"></i> Entrar no painel</>
                }
              </button>
            </form>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" className="btn-ghost" style={{ fontSize: 13 }}>
            <i className="ti ti-arrow-left"></i> Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  )
}
