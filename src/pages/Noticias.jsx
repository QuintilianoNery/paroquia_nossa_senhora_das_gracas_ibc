import { useEffect, useState } from 'react'
import { supabase } from '@lib/supabase'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const PLACEHOLDER = [
  { id:1, title:'Festa da Padroeira reúne centenas de fiéis em celebração histórica', summary:'A festa em honra a Nossa Senhora das Graças reuniu a comunidade paroquial em três dias de novena, missa campal e procissão pelas ruas do bairro.', content:'', published_at: new Date().toISOString() },
  { id:2, title:'Primeira Comunhão 2026 — inscrições abertas até 30 de junho',        summary:'As inscrições para o Encontro de Primeira Eucaristia estão abertas. Compareça à secretaria paroquial com documentação do batismo.', content:'', published_at: new Date(Date.now()-7*86400000).toISOString() },
  { id:3, title:'Campanha de arrecadação da Pastoral da Criança',                      summary:'Contribua com alimentos não perecíveis e materiais de higiene para apoiar as famílias atendidas pela pastoral.', content:'', published_at: new Date(Date.now()-14*86400000).toISOString() },
  { id:4, title:'Curso de Teologia para Leigos — novas turmas em junho',              summary:'Em parceria com o ITESP, abrimos novas turmas do Curso de Formação para Leigos. Inscrições na secretaria.', content:'', published_at: new Date(Date.now()-21*86400000).toISOString() },
  { id:5, title:'JMJ Diocesana 2026 — inscrições abertas para jovens',                summary:'A Jornada Mundial da Juventude Diocesana acontece em julho. Vagas limitadas para jovens de 16 a 30 anos.', content:'', published_at: new Date(Date.now()-28*86400000).toISOString() },
]

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

function FeaturedCard({ n, onSelect }) {
  const date = n.published_at ? format(new Date(n.published_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : ''
  const firstLink = normalizeNewsLinks(n)[0]
  return (
    <article
      onClick={() => onSelect(n)}
      style={{
        gridColumn: '1/-1', background: '#fff', borderRadius: 10, overflow: 'hidden',
        display: 'grid', gridTemplateColumns: '220px 1fr', border: '1px solid var(--border)',
        cursor: 'pointer', transition: 'box-shadow .2s',
        minHeight: 220,
        height: 220,
      }}
      tabIndex={0} role="button" aria-label={`Ler: ${n.title}`}
      onKeyDown={e => e.key === 'Enter' && onSelect(n)}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
    >
      <div style={{ background: 'linear-gradient(135deg,var(--teal-xdark),var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 220, height: '100%', position: 'relative', overflow: 'hidden' }}>
        {n.image_url ? (
          <img src={n.image_url} alt={n.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <i className="ti ti-building-church" style={{ fontSize: 80, color: 'rgba(255,255,255,.1)' }} aria-hidden="true"></i>
        )}
        <span style={{ position: 'absolute', top: 16, left: 16, background: 'var(--gold)', color: 'var(--teal-xdark)', fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 3 }}>Mais Recente</span>
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
      <style>{`@media(max-width:680px){article{grid-template-columns:120px 1fr!important;min-height:120px!important;height:120px!important}article > div:first-child{width:120px!important}}`}</style>
    </article>
  )
}

function SmallCard({ n, onSelect }) {
  const date = n.published_at ? format(new Date(n.published_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : ''
  const firstLink = normalizeNewsLinks(n)[0]
  return (
    <article
      onClick={() => onSelect(n)}
      style={{ background: '#fff', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow .2s, transform .2s', display: 'flex' }}
      tabIndex={0} role="button" aria-label={`Ler: ${n.title}`}
      onKeyDown={e => e.key === 'Enter' && onSelect(n)}
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
        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--teal-xdark)', lineHeight: 1.3, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.title}</h4>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.summary}</p>
        {firstLink && (
          <p style={{ marginBottom: 10, fontSize: 13 }}>
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
        <p style={{ fontSize: 12, color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <i className="ti ti-calendar" aria-hidden="true"></i>{date}
        </p>
      </div>
    </article>
  )
}

function NoticiaModal({ n, onClose }) {
  const date = n.published_at ? format(new Date(n.published_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : ''
  const links = normalizeNewsLinks(n)
  if (!n) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--teal-xdark)', lineHeight: 1.3, maxWidth: '90%' }}>{n.title}</h3>
          <button onClick={onClose} aria-label="Fechar" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text-muted)' }}>
            <i className="ti ti-x"></i>
          </button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="ti ti-calendar" aria-hidden="true"></i>{date}
          </p>
          {n.image_url && (
            <div style={{ marginBottom: 18, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <img src={n.image_url} alt={n.title} style={{ width: '100%', maxHeight: 320, objectFit: 'cover', display: 'block' }} />
            </div>
          )}
          {(n.content || n.summary) && (
            <div style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.85 }}>
              {(n.content || n.summary).split('\n').map((p, i) => <p key={i} style={{ marginBottom: 14 }}>{p}</p>)}
            </div>
          )}
          {links.length > 0 && (
            <div style={{ marginTop: 12, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--teal-xdark)', fontSize: '1rem', marginBottom: 10 }}>Links relacionados</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {links.map((entry, index) => (
                  <p key={`${entry.url}-${index}`} style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>
                    <strong style={{ color: 'var(--teal-xdark)' }}>Clique aqui:</strong>{' '}
                    <a href={entry.url} target="_blank" rel="noreferrer" style={{ color: 'var(--teal)', fontWeight: 700, textDecoration: 'underline' }}>
                      {entry.description || entry.url}
                    </a>
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Noticias() {
  const [news,     setNews]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    supabase.from('news').select('*').eq('is_published', true).order('published_at', { ascending: false })
      .then(({ data }) => { if (data) setNews(data); setLoading(false) })
  }, [])

  const list = (!loading && news.length) ? news : PLACEHOLDER

  return (
    <>
      <div className="page-hero">
        <p className="breadcrumb">Início / Notícias</p>
        <h1>Notícias da <span>Paróquia</span></h1>
      </div>

      <section style={{ background: 'var(--cream)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <FeaturedCard n={list[0]} onSelect={setSelected} />
            {list.slice(1).map(n => <SmallCard key={n.id} n={n} onSelect={setSelected} />)}
          </div>
        </div>
        <style>{`@media(max-width:640px){section > div > div{grid-template-columns:1fr!important}}`}</style>
      </section>

      {selected && <NoticiaModal n={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
