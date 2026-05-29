import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Button, Container } from '../../components/ui'

export function AdminLoginPage({ auth }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (auth.user) return <Navigate to="/admin" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    await auth.login(email, password)
    setSubmitting(false)
  }

  return (
    <section className="auth-page">
      <Container className="auth-box">
        <div>
          <span className="eyebrow">Área restrita</span>
          <h1>Acesso administrativo</h1>
          <p>O login usa Supabase Auth com JWT. Crie o admin em Authentication → Users → Invite user e utilize as variáveis do projeto para autenticar.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            E-mail
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@paroquia.org" required />
          </label>
          <label>
            Senha
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </label>
          {auth.error ? <p className="form-error">{auth.error}</p> : null}
          <Button type="submit" disabled={submitting}>{submitting ? 'Entrando...' : 'Entrar'}</Button>
        </form>
      </Container>
    </section>
  )
}
