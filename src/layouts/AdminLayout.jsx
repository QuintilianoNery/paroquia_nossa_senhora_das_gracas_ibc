import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import Logo from '@/components/Logo';
import Container from '@/components/Container';
import Icon from '@/components/Icon';
import { adminQuickLinks } from '@/config/collections';
import { useAuth } from '@/context/AuthContext';
import { useIdleLogout } from '@/hooks/useIdleLogout';
import Button from '@/components/Button';

export default function AdminLayout() {
  const { user, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleTimeout = useCallback(async () => {
    await signOut();
    navigate('/admin/login', { replace: true, state: { reason: 'inactivity' } });
  }, [navigate, signOut]);

  useIdleLogout(handleTimeout, isAuthenticated, 30 * 60 * 1000);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Logo variant="vertical" className="admin-brand" />
        <div className="admin-userbox">
          <strong>Área Administrativa</strong>
          <span>{user?.email || 'Sessão autenticada'}</span>
        </div>

        <nav className="admin-nav" aria-label="Menu do painel">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}>
            <Icon name="home" size={16} /> Dashboard
          </NavLink>
          {adminQuickLinks.map((item) => (
            <NavLink key={item.key} to={`/admin/${item.key}`} className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}>
              <Icon name="layers" size={16} /> {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <Container className="admin-topbar-inner">
            <div>
              <p className="section-eyebrow">Painel administrativo</p>
              <h1 className="admin-title">Cadastros e publicação</h1>
            </div>
            <Button variant="ghost" onClick={() => signOut()}>
              <Icon name="logout" size={16} /> Sair
            </Button>
          </Container>
        </header>

        <Container className="admin-content">
          <Outlet />
        </Container>
      </div>
    </div>
  );
}