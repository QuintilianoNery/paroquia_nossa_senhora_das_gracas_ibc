import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@features/auth/AuthContext'

const MENU = [
  { to: '/admin',              icon: 'ti-dashboard',       label: 'Dashboard',   end: true },
  { to: '/admin/paroquia',     icon: 'ti-building-church', label: 'Paróquia' },
  { to: '/admin/clero',        icon: 'ti-user-star',       label: 'Clero' },
  { to: '/admin/comunidades',  icon: 'ti-map-pin',         label: 'Comunidades' },
  { to: '/admin/noticias',     icon: 'ti-news',            label: 'Notícias' },
  { to: '/admin/horarios',     icon: 'ti-clock',           label: 'Horários' },
  { to: '/admin/usuarios',     icon: 'ti-users',           label: 'Usuários' },
  { to: '/admin/links',        icon: 'ti-link',            label: 'Links' },
  { to: '/admin/pastorais',    icon: 'ti-heart',           label: 'Pastorais' },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate          = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleMenuClick = () => {
    window.dispatchEvent(new Event('admin-menu-click'))
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--cream)' }}>

      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 230, flexShrink: 0,
        background: 'var(--teal-xdark)', display: 'flex', flexDirection: 'column',
        transition: 'width .25s', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto'
      }}>
        {/* Brand */}
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src="/img/logo-horizontal-bege.png"
            alt="Paróquia Nossa Senhora das Graças"
            style={{ height: 43.2, width: 'auto', display: 'block', flexShrink: 0, objectFit: 'contain' }}
          />
          {/* brand text removed per request */}
        </div>

        {/* Nav */}
        <nav style={{ padding: '1rem 0', flex: 1 }} aria-label="Menu administrativo">
          {MENU.map(({ to, icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={handleMenuClick}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 16px', textDecoration: 'none', fontSize: 13, fontWeight: 700,
                letterSpacing: '.02em', transition: 'background .15s',
                color: isActive ? 'var(--gold)' : 'rgba(255,255,255,.7)',
                background: isActive ? 'rgba(193,146,65,.12)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--gold)' : '3px solid transparent',
              })}
            >
              <i className={`ti ${icon}`} style={{ fontSize: 18, flexShrink: 0 }} aria-hidden="true"></i>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,.1)' }}>
          {!collapsed && (
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 10, wordBreak: 'break-all' }}>{user?.email}</p>
          )}
          <button
            onClick={handleSignOut}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
              background: 'rgba(255,255,255,.08)', border: 'none', borderRadius: 6,
              color: 'rgba(255,255,255,.6)', padding: '8px 12px', fontSize: 13,
              fontWeight: 700, cursor: 'pointer', transition: 'background .2s'
            }}
          >
            <i className="ti ti-logout" style={{ fontSize: 16 }} aria-hidden="true"></i>
            {!collapsed && 'Sair'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          background: '#fff', borderBottom: '1px solid var(--border)',
          padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setCollapsed(c => !c)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 20 }}
              aria-label="Recolher menu"
            >
              <i className="ti ti-layout-sidebar" aria-hidden="true"></i>
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link to="/" target="_blank" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
              <i className="ti ti-external-link" style={{ fontSize: 14 }} aria-hidden="true"></i>
              Ver site
            </Link>
            <div style={{ width: 32, height: 32, background: 'var(--teal-xlight)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)', fontWeight: 700, fontSize: 14 }}>
              {user?.email?.[0]?.toUpperCase() ?? 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
