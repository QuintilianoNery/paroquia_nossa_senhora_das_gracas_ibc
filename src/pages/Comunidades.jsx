import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSupabaseQuery } from '@lib/hooks/useSupabaseQuery'
import { toast } from '@lib/toast'

const COLORS = ['#3d7f91','#2a5f6e','#c19241','#96711e','#4a6170','#1a3e49']

const PLACEHOLDER = [
  { id:1, slug:'sao-jose',       name:'Comunidade São José',       address:'Rua São José, 123',       history:'Uma das primeiras comunidades, com forte tradição de catequese e movimento de casais.', google_maps_url:'' },
  { id:2, slug:'santa-luzia',    name:'Comunidade Santa Luzia',    address:'Av. Santa Luzia, 88',     history:'Comunidade com grande devoção a Santa Luzia, reconhecida pelo trabalho com jovens e famílias.', google_maps_url:'' },
  { id:3, slug:'sao-francisco',  name:'Comunidade São Francisco',  address:'Rua das Graças, 45',      history:'Inspirada no espírito franciscano, é referência em ação ecológica, partilha e solidariedade.', google_maps_url:'' },
  { id:4, slug:'nsa-aparecida',  name:'N. Sra. Aparecida',         address:'Rua Aparecida, 300',      history:'Forte devoção mariana e grande participação nas festas em honra a Nossa Senhora Aparecida.', google_maps_url:'' },
  { id:5, slug:'santo-antonio',  name:'Comunidade Santo Antônio',  address:'Tv. Santo Antônio, 12',   history:'Comunidade jovem com grande energia na evangelização e nos grupos de jovens adultos.', google_maps_url:'' },
  { id:6, slug:'santa-rita',     name:'Comunidade Santa Rita',     address:'Rua Santa Rita, 67',      history:'A mais nova comunidade, com crescimento rápido e forte presença da Pastoral da Família.', google_maps_url:'' },
]

export default function Comunidades() {
  const { data: items = [], loading, error } = useSupabaseQuery('communities', { filters: { is_published: true }, orderBy: 'manual_order' })

  useEffect(() => {
    if (error) toast.error('Erro ao carregar comunidades')
  }, [error])

  const list = (!loading && items && items.length) ? items : PLACEHOLDER

  return (
    <>
      <div className="page-hero">
        <p className="breadcrumb">Início / Comunidades</p>
        <h1>Nossas <span>Comunidades</span></h1>
      </div>

      <section style={{ background: '#fff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <span className="section-label">Comunidades vinculadas</span>
          <h2 className="section-title">Conheça cada comunidade</h2>
          <div className="divider"></div>
          <p className="section-sub">
            A paróquia é formada por comunidades espalhadas pelo município, cada uma com sua história, devoção e vida própria de fé.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 22 }}>
            {list.map((c, i) => (
              <Link key={c.id} to={`/comunidades/${c.slug || ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <article className="card" style={{ overflow: 'hidden', transition: 'box-shadow .2s, transform .2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
              >
                {/* Banner */}
                <div style={{
                  height: 160,
                  background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}dd, ${COLORS[i % COLORS.length]})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
                }}>
                  {c.image_url ? (
                    <img src={c.image_url} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <i className="ti ti-building-church" style={{ fontSize: 64, color: 'rgba(255,255,255,.2)' }} aria-hidden="true"></i>
                  )}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent,rgba(0,0,0,.35))', padding: '2rem 1.5rem 1rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', color: '#fff', fontSize: '1.2rem' }}>{c.name}</h2>
                  </div>
                </div>

                <div className="card-body">
                  {c.history && (
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 16 }}>
                      {c.history.substring(0, 160)}{c.history.length > 160 ? '...' : ''}
                    </p>
                  )}

                  {c.address && (
                    <p style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <i className="ti ti-map-pin" aria-hidden="true"></i>{c.address}
                    </p>
                  )}

                  {c.google_maps_url && (
                    <a href={c.google_maps_url} target="_blank" rel="noopener noreferrer"
                      className="btn btn-teal btn-sm" style={{ display: 'inline-flex', marginTop: 6 }}>
                      <i className="ti ti-map" aria-hidden="true"></i> Ver no Maps
                    </a>
                  )}

                  <div style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: 'var(--teal)' }}>
                    Ver detalhes <i className="ti ti-arrow-right" aria-hidden="true"></i>
                  </div>
                </div>
              </article>
              </Link>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:600px){section > div > div:last-child{grid-template-columns:1fr!important}}`}</style>
      </section>
    </>
  )
}
