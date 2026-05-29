import { Link, NavLink, Outlet } from 'react-router-dom'
import { Container } from '../components/ui'

const links = [
  ['/', 'Início'],
  ['/paroquia', 'Paróquia'],
  ['/comunidades', 'Comunidades'],
  ['/noticias', 'Notícias'],
  ['/horarios', 'Horários'],
  ['/pastorais', 'Pastorais'],
  ['/contato', 'Contato']
]

export function PublicLayout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Container className="site-header__inner">
          <Link to="/" className="brand-mark" aria-label="Paróquia Nossa Senhora das Graças">
            <div className="brand-mark__shield">M</div>
            <div>
              <strong>Paróquia</strong>
              <span>Nossa Senhora das Graças</span>
            </div>
          </Link>
          <nav className="site-nav" aria-label="Navegação principal">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {label}
              </NavLink>
            ))}
          </nav>
          <Link to="/admin/login" className="admin-entry">Área administrativa</Link>
        </Container>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <Container className="footer-grid">
          <div>
            <h3>Paróquia Nossa Senhora das Graças</h3>
            <p>Rua Domingos Alcino Dadalto, 114 · Jardim Itapemirim · Cachoeiro de Itapemirim/ES.</p>
          </div>
          <div>
            <h4>Contato</h4>
            <p>(28) 3517-7296</p>
            <p>secretariaparoquiansgracas.org.br</p>
          </div>
          <div>
            <h4>Atendimento</h4>
            <p>Seg–Sex · 8h às 11h30 · 14h às 17h30</p>
            <p>Sábado · 8h às 11h30</p>
          </div>
        </Container>
      </footer>
    </div>
  )
}
