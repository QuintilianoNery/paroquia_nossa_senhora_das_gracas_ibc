import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const NAV = [
  { to: '/',           label: 'Início' },
  { to: '/paroquia',   label: 'Paróquia' },
  { to: '/comunidades',label: 'Comunidades' },
  { to: '/noticias',   label: 'Notícias' },
  { to: '/horarios',   label: 'Horários' },
  { to: '/pastorais',  label: 'Pastorais' },
  { to: '/links',      label: 'Links' },
  { to: '/contato',    label: 'Contato' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header style={{
      background: '#fff', borderBottom: '3px solid var(--gold)',
      position: 'sticky', top: 0, zIndex: 200,
      boxShadow: '0 2px 16px rgba(0,0,0,.07)'
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src="/img/logo-horizontal.png"
            alt="Paróquia Nossa Senhora das Graças"
            style={{ width: 'clamp(184px, 20.8vw, 272px)', height: 'auto', display: 'block', flexShrink: 0, objectFit: 'contain' }}
          />
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: 2, alignItems: 'center' }} aria-label="Menu principal">
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                fontSize: 13, fontWeight: 700, textDecoration: 'none', padding: '7px 11px',
                borderRadius: 4, letterSpacing: '.03em', transition: 'color .2s, background .2s',
                color: isActive ? 'var(--teal)' : 'var(--text-muted)',
                background: isActive ? 'var(--teal-xlight)' : 'transparent'
              })}
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/admin"
            style={{
              fontSize: 12, fontWeight: 700, color: 'var(--text-light)',
              border: '1px solid var(--border)', borderRadius: 4,
              padding: '6px 11px', marginLeft: 8, textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 5, transition: 'color .2s, border-color .2s'
            }}
          >
            <i className="ti ti-lock" style={{ fontSize: 13 }} aria-hidden="true"></i>
            Admin
          </Link>
        </nav>

        {/* Mobile menu btn */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          style={{
            display: 'none', background: 'none', border: 'none',
            color: 'var(--teal)', fontSize: 24, cursor: 'pointer'
          }}
          className="mobile-menu-btn"
        >
          <i className={open ? 'ti ti-x' : 'ti ti-menu-2'} aria-hidden="true"></i>
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          style={{
            background: '#fff', borderBottom: '3px solid var(--gold)',
            padding: '1rem', display: 'flex', flexDirection: 'column', gap: 4
          }}
          aria-label="Menu mobile"
        >
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                fontSize: 15, fontWeight: 700, textDecoration: 'none', padding: '11px 14px',
                borderRadius: 6, color: isActive ? 'var(--teal)' : 'var(--text-muted)',
                background: isActive ? 'var(--teal-xlight)' : 'transparent'
              })}
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            style={{ fontSize: 13, color: 'var(--text-light)', padding: '11px 14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <i className="ti ti-lock" aria-hidden="true"></i> Área Admin
          </Link>
        </nav>
      )}

      <style>{`
        @media (max-width: 900px) {
          nav[aria-label="Menu principal"] { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  )
}
