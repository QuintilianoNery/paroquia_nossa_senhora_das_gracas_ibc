import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'

import PublicLayout   from '@layouts/PublicLayout'
import AdminLayout    from '@layouts/AdminLayout'
import ProtectedRoute from '@features/auth/ProtectedRoute'
import Login          from '@features/auth/Login'

// Public pages (lazy)
const Home        = lazy(() => import('@pages/Home'))
const Paroquia    = lazy(() => import('@pages/Paroquia'))
const Comunidades = lazy(() => import('@pages/Comunidades'))
const ComunidadeDetalhe = lazy(() => import('@pages/ComunidadeDetalhe'))
const Noticias    = lazy(() => import('@pages/Noticias'))
const Horarios    = lazy(() => import('@pages/Horarios'))
const Pastorais   = lazy(() => import('@pages/Pastorais'))
const Links       = lazy(() => import('@pages/Links'))
const Contato     = lazy(() => import('@pages/Contato'))

// Admin pages (lazy)
const Dashboard      = lazy(() => import('@features/admin/Dashboard'))
const AdminParoquia  = lazy(() => import('@features/admin/paroquia'))
const AdminClero     = lazy(() => import('@features/admin/clero'))
const AdminComuns    = lazy(() => import('@features/admin/comunidades'))
const AdminNoticias  = lazy(() => import('@features/admin/noticias'))
const AdminHorarios  = lazy(() => import('@features/admin/horarios'))
const AdminLinksPage = lazy(() => import('@features/admin/links').then(m => ({ default: m.AdminLinks })))
const AdminPastorais = lazy(() => import('@features/admin/links').then(m => ({ default: m.AdminPastorais })))

const Spinner = () => (
  <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
    <i className="ti ti-loader-2" style={{ fontSize: 28 }}></i>
  </div>
)

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* ── Public ── */}
        <Route element={<PublicLayout />}>
          <Route index         element={<Home />} />
          <Route path="paroquia"    element={<Paroquia />} />
          <Route path="comunidades" element={<Comunidades />} />
          <Route path="comunidades/:slug" element={<ComunidadeDetalhe />} />
          <Route path="noticias"    element={<Noticias />} />
          <Route path="horarios"    element={<Horarios />} />
          <Route path="pastorais"   element={<Pastorais />} />
          <Route path="links"       element={<Links />} />
          <Route path="contato"     element={<Contato />} />
        </Route>

        {/* ── Auth ── */}
        <Route path="admin/login" element={<Login />} />

        {/* ── Admin (protected) ── */}
        <Route path="admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index            element={<Dashboard />} />
          <Route path="paroquia"  element={<AdminParoquia />} />
          <Route path="clero"     element={<AdminClero />} />
          <Route path="comunidades" element={<AdminComuns />} />
          <Route path="noticias"  element={<AdminNoticias />} />
          <Route path="horarios"  element={<AdminHorarios />} />
          <Route path="links"     element={<AdminLinksPage />} />
          <Route path="pastorais" element={<AdminPastorais />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
