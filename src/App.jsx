import { Navigate, Route, Routes } from 'react-router-dom'
import { PublicLayout } from './layouts/PublicLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { HomePage } from './pages/public/HomePage'
import { ContentPage } from './pages/public/ContentPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminCrudPage } from './pages/admin/AdminCrudPage'
import { useAuth } from './hooks/useAuth'
import { adminCrudConfig } from './data/adminCrudConfig'

export default function App() {
  const auth = useAuth()

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/paroquia" element={<ContentPage eyebrow="Paróquia" title="História, clero e identidade" description="Base institucional da matriz e do site público." section="paroquia" />} />
        <Route path="/comunidades" element={<ContentPage eyebrow="Comunidades" title="Rede viva de fé" description="Estrutura pública preparada para páginas individuais por slug." section="comunidades" />} />
        <Route path="/noticias" element={<ContentPage eyebrow="Notícias" title="Atualizações da paróquia" description="Listagem cronológica com destaque da notícia mais recente." section="noticias" />} />
        <Route path="/horarios" element={<ContentPage eyebrow="Horários" title="Missas e atendimento" description="Estrutura para mudanças frequentes com edição simples no painel." section="horarios" />} />
        <Route path="/pastorais" element={<ContentPage eyebrow="Pastorais" title="Serviço e evangelização" description="Cards administráveis e preparados para expansão futura." section="pastorais" />} />
        <Route path="/contato" element={<ContentPage eyebrow="Contato" title="Atendimento paroquial" description="Canais oficiais e páginas institucionais de apoio." section="contato" />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage auth={auth} />} />
      <Route path="/admin" element={<AdminLayout user={auth.user} onLogout={auth.logout} />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="comunidades" element={<AdminCrudPage config={adminCrudConfig.communities} userId={auth.user?.id} />} />
        <Route path="noticias" element={<AdminCrudPage config={adminCrudConfig.news} userId={auth.user?.id} />} />
        <Route path="clero" element={<AdminCrudPage config={adminCrudConfig.clergy} userId={auth.user?.id} />} />
        <Route path="horarios" element={<AdminCrudPage config={adminCrudConfig.mass_schedules} userId={auth.user?.id} />} />
        <Route path="secretaria" element={<AdminCrudPage config={adminCrudConfig.office_hours} userId={auth.user?.id} />} />
        <Route path="links" element={<AdminCrudPage config={adminCrudConfig.useful_links} userId={auth.user?.id} />} />
        <Route path="pastorais" element={<AdminCrudPage config={adminCrudConfig.pastorals} userId={auth.user?.id} />} />
        <Route path="configuracoes" element={<AdminCrudPage config={adminCrudConfig.parish_profile} userId={auth.user?.id} />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
