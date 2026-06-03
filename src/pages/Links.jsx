import { useEffect, useState } from 'react'
import { supabase } from '@lib/supabase'

const PLACEHOLDER_LITURGY = [
  { id:1, title:'Liturgia Diária',  url:'https://liturgia.cancaonova.com', description:'Leituras, salmo e evangelho do dia — Canção Nova',    icon:'ti-book-2' },
  { id:2, title:'Santo do Dia',     url:'https://santo.cancaonova.com',    description:'Conheça o santo ou beato que a Igreja celebra hoje',  icon:'ti-star' },
  { id:3, title:'Vatican News',     url:'https://www.vaticannews.va/pt.html', description:'Notícias da Santa Sé e do Papa Francisco',        icon:'ti-world' },
  { id:4, title:'Canção Nova',      url:'https://www.cancaonova.com',      description:'TV, rádio, espiritualidade e evangelização online',   icon:'ti-music' },
]
const PLACEHOLDER_LINKS = [
  { id:5, title:'CNBB',             url:'https://www.cnbb.org.br',         description:'Conferência Nacional dos Bispos do Brasil',           icon:'ti-building' },
  { id:6, title:'Cáritas Brasileira',url:'https://caritas.org.br',        description:'Organização da CNBB de ação social e solidariedade',  icon:'ti-heart-handshake' },
  { id:7, title:'Catequese Hoje',   url:'https://www.catequesehoje.com.br',description:'Subsídios, artigos e formação para catequistas',     icon:'ti-school' },
  { id:8, title:'Rádio Aparecida',  url:'https://www.a12.com',             description:'Programação religiosa e conteúdo mariano',            icon:'ti-radio' },
  { id:9, title:'ACI Digital',      url:'https://www.acidigital.com',      description:'Agência Católica de Informações em português',        icon:'ti-news' },
  { id:10,title:'Pe. Paulo Ricardo',url:'https://padrepauloricardo.org',   description:'Homilias, cursos e formação filosófica e teológica',  icon:'ti-microphone' },
]

function LinkCard({ link, idx }) {
  const icons = ['ti-book-2','ti-star','ti-world','ti-music','ti-building','ti-heart-handshake','ti-school','ti-radio','ti-news','ti-microphone','ti-link']
  const icon  = link.icon ?? icons[idx % icons.length]
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        background: '#fff', border: '1px solid var(--border)', borderRadius: 8,
        padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: 14,
        textDecoration: 'none', transition: 'box-shadow .2s, border-color .2s'
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--gold)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      <div style={{ width: 44, height: 44, background: 'var(--teal-xlight)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)', fontSize: 20, flexShrink: 0 }}>
        <i className={`ti ${icon}`} aria-hidden="true"></i>
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--teal-xdark)', marginBottom: 2 }}>{link.title}</h4>
        {link.description && <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{link.description}</p>}
      </div>
      <i className="ti ti-external-link" style={{ fontSize: 15, color: 'var(--text-light)', flexShrink: 0 }} aria-hidden="true"></i>
    </a>
  )
}

export default function Links() {
  const [dbLinks,   setDbLinks]   = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    supabase.from('useful_links').select('*').eq('is_active', true).order('manual_order')
      .then(({ data }) => { if (data) setDbLinks(data); setLoading(false) })
  }, [])

  const liturgyLinks = (!loading && dbLinks.length) ? dbLinks.filter(l => l.category === 'liturgia') : PLACEHOLDER_LITURGY
  const otherLinks   = (!loading && dbLinks.length) ? dbLinks.filter(l => l.category !== 'liturgia') : PLACEHOLDER_LINKS

  return (
    <>
      <div className="page-hero">
        <p className="breadcrumb">Início / Formação e Links</p>
        <h1>Formação e <span>Links Úteis</span></h1>
      </div>

      <section style={{ background: '#fff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Liturgia */}
          <span className="section-label">Liturgia e espiritualidade</span>
          <h2 className="section-title">Links da Liturgia</h2>
          <div className="divider"></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14, marginBottom: '4rem' }}>
            {liturgyLinks.map((l, i) => <LinkCard key={l.id} link={l} idx={i} />)}
          </div>

          {/* Links úteis */}
          <span className="section-label">Formação e sites católicos</span>
          <h2 className="section-title">Links Úteis</h2>
          <div className="divider"></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
            {otherLinks.map((l, i) => <LinkCard key={l.id} link={l} idx={i} />)}
          </div>
        </div>
      </section>
    </>
  )
}
