import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout';
import AuthLayout from '@/layouts/AuthLayout';
import RequireAuth from '@/components/RequireAuth';
import HomePage from '@/pages/public/HomePage';
import ParishPage from '@/pages/public/ParishPage';
import CommunitiesPage from '@/pages/public/CommunitiesPage';
import CommunityDetailPage from '@/pages/public/CommunityDetailPage';
import NewsPage from '@/pages/public/NewsPage';
import NewsDetailPage from '@/pages/public/NewsDetailPage';
import SchedulesPage from '@/pages/public/SchedulesPage';
import LinksPage from '@/pages/public/LinksPage';
import PastoralsPage from '@/pages/public/PastoralsPage';
import ContactPage from '@/pages/public/ContactPage';
import NotFoundPage from '@/pages/public/NotFoundPage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminCollectionPage from '@/pages/admin/AdminCollectionPage';
import { collectionDefinitions } from '@/config/collections';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="paroquia" element={<ParishPage />} />
        <Route path="paroquia/historia" element={<Navigate to="/paroquia" replace />} />
        <Route path="paroquia/clero" element={<Navigate to="/paroquia" replace />} />
        <Route path="comunidades" element={<CommunitiesPage />} />
        <Route path="comunidades/:slug" element={<CommunityDetailPage />} />
        <Route path="noticias" element={<NewsPage />} />
        <Route path="noticias/:slug" element={<NewsDetailPage />} />
        <Route path="horarios" element={<SchedulesPage />} />
        <Route path="links" element={<LinksPage />} />
        <Route path="pastorais" element={<PastoralsPage />} />
        <Route path="contato" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="admin/login" element={<AdminLoginPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route path="admin" element={<AdminDashboardPage />} />
          {collectionDefinitions.map((definition) => (
            <Route key={definition.key} path={`admin/${definition.key}`} element={<AdminCollectionPage collectionKey={definition.key} />} />
          ))}
        </Route>
      </Route>
    </Routes>
  );
}