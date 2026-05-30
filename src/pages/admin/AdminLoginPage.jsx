import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Seo from '@/components/Seo';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from?.pathname || '/admin';
  const reason = location.state?.reason;

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível autenticar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Seo title="Área Administrativa - Paróquia Nossa Senhora das Graças" description="Login do painel administrativo integrado ao Supabase." />
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--cream-dark)' }}>
        <div style={{ background: 'var(--white)', borderRadius: 12, border: '1px solid var(--border)', padding: '3rem 2.5rem', maxWidth: 400, width: '100%', boxShadow: '0 12px 40px rgba(0,0,0,.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: 60, height: 60, background: 'var(--blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }} aria-hidden="true">
              <i className="ti ti-lock" style={{ fontSize: 24, color: 'var(--white)' }} />
            </div>
            <p style={{ fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: 6 }}>Paróquia Nossa Senhora das Graças</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", color: 'var(--blue-dark)', fontSize: '1.5rem' }}>Área Administrativa</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>Acesso restrito a administradores autorizados.</p>
            {reason === 'inactivity' ? <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>Sua sessão expirou por 30 minutos de inatividade.</p> : null}
          </div>

          <form onSubmit={handleSubmit} aria-label="Formulário de login administrativo">
            <div style={{ marginBottom: 14 }}>
              <label htmlFor="admin-email" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-light)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>E-mail</label>
              <input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@paroquia.com.br" required style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 6, fontFamily: "'Lato',sans-serif", fontSize: 15, color: 'var(--text)' }} />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label htmlFor="admin-pass" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-light)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Senha</label>
              <input id="admin-pass" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" required style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 6, fontFamily: "'Lato',sans-serif", fontSize: 15, color: 'var(--text)' }} />
            </div>
            {error ? <p style={{ color: '#991b1b', marginBottom: 12, fontSize: 13 }}>{error}</p> : null}
            <button type="submit" className="btn-blue" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              <i className="ti ti-login" aria-hidden="true" /> {loading ? 'Entrando...' : 'Entrar no painel'}
            </button>
          </form>

          <div style={{ marginTop: 16, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
            <button className="btn-link" type="button" onClick={() => navigate('/')}><i className="ti ti-arrow-left" aria-hidden="true" /> Voltar ao site</button>
          </div>
        </div>
      </div>
    </>
  );
}