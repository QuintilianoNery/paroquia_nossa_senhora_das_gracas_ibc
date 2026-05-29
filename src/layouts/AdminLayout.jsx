import { Outlet, Navigate } from 'react-router-dom'
import { AdminNavLink, Container } from '../components/ui'
import { adminNavItems } from '../data/adminCrudConfig'

export function AdminLayout({ user, onLogout }) {
  if (!user) return <Navigate to="/admin/login" replace />

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <p className="admin-sidebar__eyebrow">Painel paroquial</p>
          <h2>Administração</h2>
        </div>
        <nav className="admin-nav">
          {adminNavItems.map((item) => (
            <AdminNavLink key={item.to} to={item.to}>{item.label}</AdminNavLink>
          ))}
        </nav>
        <button className="btn btn-secondary" onClick={onLogout}>Sair</button>
      </aside>
      <section className="admin-content">
        <Container>
          <div className="admin-topbar">
            <div>
              <span className="eyebrow">Usuário autenticado</span>
              <h1>{user.email}</h1>
            </div>
          </div>
          <Outlet />
        </Container>
      </section>
    </div>
  )
}
