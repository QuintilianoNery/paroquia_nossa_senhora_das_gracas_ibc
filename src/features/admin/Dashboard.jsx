import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@lib/supabase'

const SHORTCUTS = [
  { to: '/admin/comunidades', icon: 'ti-map-pin',         label: 'Comunidades',   color: '#3d7f91' },
  { to: '/admin/paroquia',    icon: 'ti-building-church', label: 'Paróquia',      color: '#2a5f6e' },
  { to: '/admin/clero',       icon: 'ti-user-star',       label: 'Clero',         color: '#c19241' },
  { to: '/admin/noticias',    icon: 'ti-news',            label: 'Notícias',      color: '#96711e' },
  { to: '/admin/horarios',    icon: 'ti-clock',           label: 'Horários',      color: '#3f8091' },
  { to: '/admin/links',       icon: 'ti-link',            label: 'Links',         color: '#4a6170' },
  { to: '/admin/pastorais',   icon: 'ti-heart',           label: 'Pastorais',     color: '#a4bac5' },
]

export default function AdminDashboard() {
  const [counts, setCounts] = useState({})

  useEffect(() => {
    const tables = ['communities', 'news', 'clergy', 'pastorals', 'useful_links']
    tables.forEach(async (t) => {
      const { count } = await supabase.from(t).select('*', { count: 'exact', head: true })
      setCounts(c => ({ ...c, [t]: count ?? 0 }))
    })
  }, [])

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--teal-xdark)', fontSize: '1.75rem', marginBottom: 6 }}>
        Dashboard
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Bem-vindo ao painel de gestão da Paróquia Nossa Senhora das Graças.
      </p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: '2.5rem' }}>
        {[
          { label: 'Comunidades', value: counts['communities'], icon: 'ti-map-pin' },
          { label: 'Notícias',    value: counts['news'],        icon: 'ti-news' },
          { label: 'Clero',       value: counts['clergy'],      icon: 'ti-user-star' },
          { label: 'Pastorais',   value: counts['pastorals'],   icon: 'ti-heart' },
          { label: 'Links',       value: counts['useful_links'],icon: 'ti-link' },
        ].map(({ label, value, icon }) => (
          <div key={label} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '1.25rem', textAlign: 'center' }}>
            <i className={`ti ${icon}`} style={{ fontSize: 24, color: 'var(--teal)', display: 'block', marginBottom: 8 }} aria-hidden="true"></i>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--teal-xdark)', fontFamily: 'var(--font-serif)' }}>
              {value ?? '—'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Shortcuts */}
      <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--teal-xdark)', fontSize: '1.2rem', marginBottom: 14 }}>
        Acesso rápido
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {SHORTCUTS.map(({ to, icon, label, color }) => (
          <Link
            key={to}
            to={to}
            style={{
              background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
              padding: '1.5rem 1rem', textAlign: 'center', textDecoration: 'none',
              transition: 'box-shadow .2s, transform .2s', display: 'block'
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <i className={`ti ${icon}`} style={{ fontSize: 22, color }} aria-hidden="true"></i>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
