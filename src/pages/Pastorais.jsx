import { useEffect, useState } from 'react'
import { supabase } from '@lib/supabase'

const PLACEHOLDER = [
  { id:1, title:'Pastoral da Criança',    description:'Acompanhamento nutricional e espiritual de crianças em situação de vulnerabilidade social. Reuniões mensais.',        icon:'ti-heart',         color:'rgba(61,127,145,.1)',  iconColor:'var(--teal)' },
  { id:2, title:'Pastoral Familiar',      description:'Encontros de casais e famílias para fortalecer os laços conjugais e a vida em família à luz do Evangelho.',           icon:'ti-users',          color:'rgba(22,101,52,.08)',  iconColor:'#166534' },
  { id:3, title:'Pastoral dos Enfermos',  description:'Visitas a hospitais, casas de repouso e domicílios para levar conforto espiritual e o sacramento da unção.',          icon:'ti-wheelchair',     color:'rgba(29,78,216,.08)',  iconColor:'#1d4ed8' },
  { id:4, title:'Cáritas Paroquial',      description:'Distribuição de alimentos e apoio a famílias em situação de vulnerabilidade. Voluntários bem-vindos!',                icon:'ti-hand-stop',      color:'rgba(180,83,9,.08)',   iconColor:'#b45309' },
  { id:5, title:'Ministério de Música',   description:'Grupos de canto e instrumentistas que animam as celebrações litúrgicas da matriz e das comunidades.',                 icon:'ti-music',          color:'rgba(109,40,217,.08)', iconColor:'#6d28d9' },
  { id:6, title:'Catequese',              description:'Preparação para os sacramentos da iniciação cristã: Primeira Eucaristia e Crisma. Atende crianças e adultos.',        icon:'ti-book',           color:'rgba(15,118,110,.08)', iconColor:'#0f766e' },
  { id:7, title:'Movimento de Jovens',    description:'Grupo de jovens adultos que se reúne semanalmente para reflexão, oração e serviço comunitário.',                      icon:'ti-star',           color:'rgba(190,18,60,.08)',  iconColor:'#be123c' },
  { id:8, title:'Pastoral da Sobriedade', description:'Apoio a pessoas com dependência química e seus familiares, em parceria com grupos de autoajuda da região.',           icon:'ti-leaf',           color:'rgba(161,98,7,.08)',   iconColor:'#a16207' },
]

const ICON_POOL  = ['ti-heart','ti-users','ti-wheelchair','ti-hand-stop','ti-music','ti-book','ti-star','ti-leaf']
const COLOR_POOL = ['rgba(61,127,145,.1)','rgba(22,101,52,.08)','rgba(29,78,216,.08)','rgba(180,83,9,.08)']
const ICON_COLOR = ['var(--teal)','#166534','#1d4ed8','#b45309','#6d28d9','#0f766e','#be123c','#a16207']

export default function Pastorais() {
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('pastorals').select('*').eq('is_active', true).order('manual_order')
      .then(({ data }) => { if (data) setItems(data); setLoading(false) })
  }, [])

  const list = (!loading && items.length) ? items : PLACEHOLDER

  return (
    <>
      <div className="page-hero">
        <p className="breadcrumb">Início / Pastorais</p>
        <h1>Pastorais e <span>Movimentos</span></h1>
      </div>

      <section style={{ background: '#fff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <span className="section-label">Serviço e evangelização</span>
          <h2 className="section-title">Conheça nossos grupos</h2>
          <div className="divider"></div>
          <p className="section-sub">
            Cada pastoral e movimento tem um carisma específico. Encontre o que mais combina com você e participe!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
            {list.map((p, i) => (
              <div key={p.id} className="card" style={{ padding: '1.75rem', transition: 'box-shadow .2s, transform .2s', border: '1px solid var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
              >
                <div style={{
                  width: 54, height: 54, borderRadius: 12,
                  background: p.color ?? COLOR_POOL[i % COLOR_POOL.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, color: p.iconColor ?? ICON_COLOR[i % ICON_COLOR.length],
                  marginBottom: 14
                }} aria-hidden="true">
                  <i className={`ti ${p.icon ?? ICON_POOL[i % ICON_POOL.length]}`}></i>
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--teal-xdark)', marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65 }}>{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
