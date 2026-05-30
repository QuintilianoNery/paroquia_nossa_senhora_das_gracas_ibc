import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { id: 'home', label: 'Início', to: '/' },
  { id: 'paroquia', label: 'Paróquia', to: '/paroquia' },
  { id: 'comunidades', label: 'Comunidades', to: '/comunidades' },
  { id: 'noticias', label: 'Notícias', to: '/noticias' },
  { id: 'horarios', label: 'Horários', to: '/horarios' },
  { id: 'pastorais', label: 'Pastorais', to: '/pastorais' },
  { id: 'links', label: 'Links', to: '/links' },
  { id: 'contato', label: 'Contato', to: '/contato' },
];

function navClass({ isActive }) {
  return isActive ? 'active' : '';
}

export default function PublicLayout() {
  const [alertHidden, setAlertHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {!alertHidden ? (
        <div className="alert-bar" id="alertBar">
          <i className="ti ti-bell" style={{ fontSize: 16 }} aria-hidden="true" />
          <span>
            ⛪ Corpus Christi — Missa Solene no dia 19/06 às 19h. <Link to="/horarios">Ver horários completos</Link>
          </span>
          <button className="alert-close" type="button" onClick={() => setAlertHidden(true)} aria-label="Fechar aviso">
            ×
          </button>
        </div>
      ) : null}

      <header>
        <div className="header-inner">
          <NavLink className="logo" to="/">
            <div className="logo-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 2h2v3h3v2h-3v3h-2V7H8V5h3zm1 10a7 7 0 1 1 0 14 7 7 0 0 1 0-14z" />
              </svg>
            </div>
            <div className="logo-text">
              <span className="parish">Paróquia</span>
              <span className="name">Nossa Senhora das Graças</span>
            </div>
          </NavLink>

          <nav aria-label="Menu principal">
            {navItems.map((item) => (
              <NavLink key={item.id} className={navClass} to={item.to} end={item.to === '/'}>
                {item.label}
              </NavLink>
            ))}
            <NavLink className="nav-admin" to="/admin/login">
              <i className="ti ti-lock" aria-hidden="true" /> Admin
            </NavLink>
          </nav>

          <button className="menu-btn" type="button" onClick={() => setMobileOpen((value) => !value)} aria-label="Abrir menu">
            <i className="ti ti-menu-2" aria-hidden="true" />
          </button>
        </div>
      </header>

      <nav className={`mobile-nav ${mobileOpen ? 'open' : ''}`} id="mobileNav" aria-label="Menu mobile">
        {navItems.map((item) => (
          <NavLink key={`m-${item.id}`} className={navClass} to={item.to} end={item.to === '/'} onClick={() => setMobileOpen(false)}>
            {item.label}
          </NavLink>
        ))}
        <NavLink to="/admin/login" onClick={() => setMobileOpen(false)} style={{ color: 'var(--text-light)', fontSize: 13 }}>
          <i className="ti ti-lock" aria-hidden="true" /> Área Administrativa
        </NavLink>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer>
        <div className="footer-grid">
          <div>
            <p className="footer-brand">Nossa Senhora das Graças</p>
            <p className="footer-about">Paróquia fundada em 1962, servindo a comunidade de Cachoeiro de Itapemirim com amor, fé e dedicação ao Evangelho.</p>
            <div className="social-links" aria-label="Redes sociais">
              <a href="#" className="social-link" aria-label="Facebook"><i className="ti ti-brand-facebook" aria-hidden="true" /></a>
              <a href="#" className="social-link" aria-label="Instagram"><i className="ti ti-brand-instagram" aria-hidden="true" /></a>
              <a href="#" className="social-link" aria-label="YouTube"><i className="ti ti-brand-youtube" aria-hidden="true" /></a>
              <a href="#" className="social-link" aria-label="WhatsApp"><i className="ti ti-brand-whatsapp" aria-hidden="true" /></a>
            </div>
          </div>
          <div className="footer-col">
            <h4>A Paróquia</h4>
            <ul>
              <li><NavLink to="/paroquia">Nossa História</NavLink></li>
              <li><NavLink to="/paroquia">Clero</NavLink></li>
              <li><NavLink to="/comunidades">Comunidades</NavLink></li>
              <li><NavLink to="/pastorais">Pastorais</NavLink></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Serviços</h4>
            <ul>
              <li><NavLink to="/horarios">Horários de Missa</NavLink></li>
              <li><NavLink to="/horarios">Sacramentos</NavLink></li>
              <li><NavLink to="/contato">Casamentos</NavLink></li>
              <li><NavLink to="/contato">Batismos</NavLink></li>
              <li><NavLink to="/links">Liturgia Diária</NavLink></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contato</h4>
            <ul>
              <li><span>Rua N. Sra. das Graças, 450</span></li>
              <li><span>Centro — Cachoeiro/ES</span></li>
              <li><a href="tel:+552835220000">(28) 3522-0000</a></li>
              <li><a href="mailto:paroquia.nsg@diocese.com.br">paroquia.nsg@diocese.com.br</a></li>
              <li>
                <NavLink to="/admin/login" style={{ opacity: 0.5, fontSize: 12 }}>
                  <i className="ti ti-lock" aria-hidden="true" /> Área Admin
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Paróquia Nossa Senhora das Graças — Cachoeiro de Itapemirim/ES</span>
          <span>Desenvolvido com ❤️ pela equipe paroquial</span>
        </div>
      </footer>
    </>
  );
}