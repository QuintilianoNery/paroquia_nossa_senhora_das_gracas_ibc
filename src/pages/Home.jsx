import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@lib/supabase'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// ── Hero ────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      background: 'linear-gradient(140deg, var(--teal-xdark) 0%, var(--teal) 60%, #4a9aad 100%)',
      minHeight: 560, display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden'
    }} aria-label="Bem-vindo à paróquia">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '5rem 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', width: '100%' }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700, marginBottom: 14 }}>
            <i className="ti ti-map-pin" aria-hidden="true"></i> Cachoeiro de Itapemirim — ES
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: '#fff', lineHeight: 1.1, marginBottom: 18 }}>
            Bem-vindo à <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Nossa Senhora das Graças</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,.78)', fontSize: 17, marginBottom: 32, lineHeight: 1.7, maxWidth: 440 }}>
            Uma comunidade de fé, amor e serviço. Venha participar das celebrações, pastorais e da vida da nossa paróquia.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/horarios" className="btn btn-gold">
              <i className="ti ti-clock" aria-hidden="true"></i> Horários das Missas
            </Link>
            <Link to="/paroquia" className="btn btn-outline">
              Nossa História <i className="ti ti-arrow-right" aria-hidden="true"></i>
            </Link>
          </div>
        </div>

        {/* Mass card */}
        <div style={{
          background: 'rgba(255,255,255,.09)', backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,.15)', borderRadius: 12, padding: '2rem'
        }} role="complementary" aria-label="Resumo de horários">
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold)', fontSize: '1.15rem', marginBottom: 16 }}>
            <i className="ti ti-calendar" style={{ marginRight: 8 }} aria-hidden="true"></i>Missas desta semana
          </h3>
          {[
            ['Seg · Ter · Qui', '7h'],
            ['Quarta-feira',    '7h · 19h30'],
            ['Sexta-feira',     '7h · 19h30'],
            ['Sábado',          '18h'],
            ['Domingo',         '7h · 9h · 11h · 19h'],
          ].map(([day, time]) => (
            <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', fontWeight: 700 }}>{day}</span>
              <span style={{ fontSize: 13, color: '#fff' }}>{time}</span>
            </div>
          ))}
          <Link to="/horarios" className="btn btn-outline" style={{ marginTop: 18, width: '100%', justifyContent: 'center', fontSize: 12, padding: '9px' }}>
            Ver todos os horários
          </Link>
        </div>
      </div>

      <style>{`@media(max-width:860px){section[aria-label="Bem-vindo à paróquia"] > div{grid-template-columns:1fr!important}section[aria-label="Bem-vindo à paróquia"] > div > div:last-child{display:none}}`}</style>
    </section>
  )
}

// ── Quick links ─────────────────────────────────────────
function QuickLinks() {
  const items = [
    { to: '/horarios',   icon: 'ti-clock',           label: 'Horários' },
    { to: '/paroquia',   icon: 'ti-book',             label: 'Sacramentos' },
    { to: '/pastorais',  icon: 'ti-heart',            label: 'Pastorais' },
    { to: '/contato',    icon: 'ti-phone',            label: 'Contato' },
  ]
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid var(--border-light)' }} role="navigation" aria-label="Acesso rápido">
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
        {items.map(({ to, icon, label }, i) => (
          <Link key={to} to={to} style={{
            padding: '1.6rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 10, textDecoration: 'none', borderRight: i < 3 ? '1px solid var(--border-light)' : 'none',
            transition: 'background .2s'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--teal-xlight)'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <div style={{ width: 50, height: 50, background: 'var(--teal-xlight)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)', fontSize: 22 }}>
              <i className={`ti ${icon}`} aria-hidden="true"></i>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', letterSpacing: '.04em', textTransform: 'uppercase' }}>{label}</span>
          </Link>
        ))}
      </div>
      <style>{`@media(max-width:540px){div[aria-label="Acesso rápido"] > div{grid-template-columns:1fr 1fr!important}}`}</style>
    </div>
  )
}

// ── Destaques ────────────────────────────────────────────
function Destaques() {
  const cards = [
    { to: '/contato',  icon: 'ti-ring',           title: 'Casamentos',          desc: 'Informe-se sobre os documentos e a preparação para o sacramento do matrimônio.' },
    { to: '/pastorais',icon: 'ti-heart-handshake', title: 'Seja Dizimista',      desc: 'Contribua para o crescimento da nossa paróquia e das obras de caridade.' },
    { to: '/pastorais',icon: 'ti-users',           title: 'Pastorais',           desc: 'Conheça os grupos de serviço e movimentos que atuam em nossa paróquia.' },
    { to: '/links',    icon: 'ti-book-2',          title: 'Formação e Links',    desc: 'Liturgia diária, homilias, sites católicos e materiais de formação espiritual.' },
    { to: '/noticias', icon: 'ti-news',            title: 'Notícias',            desc: 'Fique por dentro das novidades, eventos e celebrações da comunidade.' },
    { to: '/comunidades',icon:'ti-building-church',title: 'Comunidades',         desc: 'Conheça as comunidades vinculadas à paróquia e sua história de fé.' },
  ]
  return (
    <section style={{ background: 'var(--cream-dark)', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <span className="section-label">Nossa paróquia</span>
        <h2 className="section-title">Faça parte da comunidade</h2>
        <div className="divider"></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
          {cards.map(({ to, icon, title, desc }) => (
            <Link key={title} to={to} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#fff', borderRadius: 8, padding: '1.75rem 1.5rem',
                border: '1px solid var(--border)', borderTop: '3px solid var(--gold)',
                textAlign: 'center', cursor: 'pointer', transition: 'box-shadow .2s, transform .2s',
                height: '100%'
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
              >
                <i className={`ti ${icon}`} style={{ fontSize: 30, color: 'var(--teal)', marginBottom: 12, display: 'block' }} aria-hidden="true"></i>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--teal-xdark)', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55 }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Notícias ─────────────────────────────────────────────
function normalizeNewsLinks(newsItem) {
  const raw = newsItem?.news_links ?? newsItem?.links
  let parsed = raw

  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed)
    } catch {
      parsed = []
    }
  }

  if (!Array.isArray(parsed)) return []
  return parsed
    .map((entry) => ({
      description: String(entry?.description ?? entry?.descricao ?? entry?.name ?? entry?.title ?? '').trim(),
      url: String(entry?.url ?? entry?.link ?? '').trim(),
    }))
    .filter((entry) => entry.url)
}

function NoticiaCard({ n, featured }) {
  const date = n.published_at ? format(new Date(n.published_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : ''
  const firstLink = normalizeNewsLinks(n)[0]
  if (featured) return (
    <Link to="/noticias" style={{ textDecoration: 'none', display: 'block', gridColumn: '1 / -1' }}>
      <article style={{
        background: '#fff', borderRadius: 10, overflow: 'hidden',
        display: 'grid', gridTemplateColumns: '220px 1fr', border: '1px solid var(--border)',
        cursor: 'pointer', transition: 'box-shadow .2s',
        minHeight: 220,
        height: 220,
      }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
      >
        <div style={{ background: 'linear-gradient(135deg, var(--teal-xdark), var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 220, height: '100%', position: 'relative', overflow: 'hidden' }}>
          {n.image_url ? (
            <img src={n.image_url} alt={n.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <i className="ti ti-building-church" style={{ fontSize: 80, color: 'rgba(255,255,255,.1)' }} aria-hidden="true"></i>
          )}
          <span style={{ position: 'absolute', top: 16, left: 16, background: 'var(--gold)', color: 'var(--teal-xdark)', fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 3 }}>Em Destaque</span>
        </div>
        <div style={{ padding: '1rem 1.1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
          <span style={{ display: 'inline-flex', alignSelf: 'flex-start', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--teal)', background: 'var(--teal-xlight)', padding: '3px 10px', borderRadius: 3, marginBottom: 10 }}>NOVO</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--teal-xdark)', lineHeight: 1.25, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.title}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 10, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.summary}</p>
          {firstLink && (
            <p style={{ marginBottom: 8, fontSize: 13, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              <strong style={{ color: 'var(--teal-xdark)' }}>Clique aqui:</strong>{' '}
              <a
                href={firstLink.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--teal)', fontWeight: 700, textDecoration: 'underline' }}
                onClick={(e) => e.stopPropagation()}
              >
                {firstLink.description || firstLink.url}
              </a>
            </p>
          )}
          <p style={{ fontSize: 12, color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto' }}>
            <i className="ti ti-calendar" aria-hidden="true"></i>{date}
          </p>
        </div>
        <style>{`@media(max-width:700px){article{grid-template-columns:120px 1fr!important;min-height:120px!important;height:120px!important}article > div:first-child{width:120px!important}}`}</style>
      </article>
    </Link>
  )
  return (
    <Link to="/noticias" style={{ textDecoration: 'none' }}>
      <article style={{ background: '#fff', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow .2s, transform .2s', display: 'flex' }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
      >
        <div style={{ width: 110, aspectRatio: '1 / 1', flexShrink: 0, background: 'linear-gradient(135deg,var(--cream-dark),var(--border))', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {n.image_url ? (
            <img src={n.image_url} alt={n.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <i className="ti ti-news" style={{ fontSize: 48, color: 'var(--teal)', opacity: .25 }} aria-hidden="true"></i>
          )}
        </div>
        <div style={{ padding: '1rem .95rem', minWidth: 0 }}>
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: 'var(--teal-xdark)', lineHeight: 1.3, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.title}</h4>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.summary}</p>
          <p style={{ fontSize: 12, color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <i className="ti ti-calendar" aria-hidden="true"></i>{date}
          </p>
        </div>
      </article>
    </Link>
  )
}

function NewsSection() {
  const [news, setNews] = useState([])
  useEffect(() => {
    supabase.from('news').select('*').eq('is_published', true).order('published_at', { ascending: false }).limit(5)
      .then(({ data }) => data && setNews(data))
  }, [])

  const placeholder = [
    { id: 1, title: 'Festa da Padroeira reúne centenas de fiéis', summary: 'A festa em honra a Nossa Senhora das Graças reuniu a comunidade em três dias de novena, missa campal e procissão.', published_at: new Date().toISOString(), image_url: '' },
    { id: 2, title: 'Primeira Comunhão 2026 — inscrições abertas', summary: 'As inscrições estão abertas até 30 de junho na secretaria paroquial.', published_at: new Date().toISOString(), image_url: '' },
    { id: 3, title: 'Campanha da Pastoral da Criança', summary: 'Contribua com alimentos e materiais de higiene para as famílias atendidas.', published_at: new Date().toISOString(), image_url: '' },
  ]
  const items = [...news]
  if (items.length < 3) {
    const needed = 3 - items.length
    items.push(...placeholder.slice(0, needed).map((p, idx) => ({ ...p, id: `placeholder-${idx + 1}` })))
  }

  return (
    <section style={{ background: 'var(--cream)', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span className="section-label">Acontecimentos</span>
            <h2 className="section-title">Notícias da Paróquia</h2>
            <div className="divider"></div>
          </div>
          <Link to="/noticias" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--teal)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Ver todas <i className="ti ti-arrow-right" aria-hidden="true"></i>
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <NoticiaCard n={items[0]} featured />
          {items.slice(1, 3).map(n => <NoticiaCard key={n.id} n={n} />)}
        </div>
      </div>
      <style>{`@media(max-width:640px){section > div > div:last-child{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}

// ── Comunidades ──────────────────────────────────────────
const COMM_COLORS = ['#3d7f91','#2a5f6e','#c19241','#96711e','#4a6170','#1a3e49']

function ComunidadesSection() {
  const [comuns, setComuns] = useState([])
  useEffect(() => {
    supabase.from('communities').select('id,name,address,image_url').eq('is_published', true).order('manual_order').limit(6)
      .then(({ data }) => data && setComuns(data))
  }, [])

  const placeholder = [
    { id:1, name:'Comunidade São José',       address:'Fundada em 1978', image_url: '' },
    { id:2, name:'Comunidade Santa Luzia',    address:'Fundada em 1985', image_url: '' },
    { id:3, name:'Comunidade São Francisco',  address:'Fundada em 1991', image_url: '' },
    { id:4, name:'N. Sra. Aparecida',         address:'Fundada em 1998', image_url: '' },
    { id:5, name:'Comunidade Santo Antônio',  address:'Fundada em 2003', image_url: '' },
    { id:6, name:'Comunidade Santa Rita',     address:'Fundada em 2010', image_url: '' },
  ]
  const items = comuns.length ? comuns : placeholder

  return (
    <section style={{ background: '#fff', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span className="section-label">Comunidades</span>
            <h2 className="section-title">Conheça nossas comunidades</h2>
            <div className="divider"></div>
          </div>
          <Link to="/comunidades" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--teal)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Ver todas <i className="ti ti-arrow-right" aria-hidden="true"></i>
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(215px,1fr))', gap: 18 }}>
          {items.map((c, i) => (
            <Link key={c.id} to="/comunidades" style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden', cursor: 'pointer', transition: 'transform .2s, box-shadow .2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
              >
                <div style={{ height: 130, background: `linear-gradient(135deg, ${COMM_COLORS[i % COMM_COLORS.length]}cc, ${COMM_COLORS[i % COMM_COLORS.length]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {c.image_url ? (
                    <img src={c.image_url} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <i className="ti ti-building-church" style={{ fontSize: 44, color: 'rgba(255,255,255,.25)' }} aria-hidden="true"></i>
                  )}
                </div>
                <div style={{ padding: '1rem' }}>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '.95rem', color: 'var(--teal-xdark)', marginBottom: 3 }}>{c.name}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.address}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <QuickLinks />
      <Destaques />
      <NewsSection />
      <ComunidadesSection />
    </>
  )
}
