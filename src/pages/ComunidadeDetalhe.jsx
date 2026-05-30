import { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { supabase } from '@lib/supabase'

const PLACEHOLDER = {
  'sao-jose': {
    name: 'Comunidade São José',
    slug: 'sao-jose',
    history: 'Uma das primeiras comunidades, com forte tradição de catequese e movimento de casais.',
    address: 'Rua São José, 123',
    google_maps_url: '',
    image_url: '',
  },
  'santa-luzia': {
    name: 'Comunidade Santa Luzia',
    slug: 'santa-luzia',
    history: 'Comunidade com grande devoção a Santa Luzia, reconhecida pelo trabalho com jovens e famílias.',
    address: 'Av. Santa Luzia, 88',
    google_maps_url: '',
    image_url: '',
  },
  'sao-francisco': {
    name: 'Comunidade São Francisco',
    slug: 'sao-francisco',
    history: 'Inspirada no espírito franciscano, é referência em ação ecológica, partilha e solidariedade.',
    address: 'Rua das Graças, 45',
    google_maps_url: '',
    image_url: '',
  },
  'nsa-aparecida': {
    name: 'N. Sra. Aparecida',
    slug: 'nsa-aparecida',
    history: 'Forte devoção mariana e grande participação nas festas em honra a Nossa Senhora Aparecida.',
    address: 'Rua Aparecida, 300',
    google_maps_url: '',
    image_url: '',
  },
  'santo-antonio': {
    name: 'Comunidade Santo Antônio',
    slug: 'santo-antonio',
    history: 'Comunidade jovem com grande energia na evangelização e nos grupos de jovens adultos.',
    address: 'Tv. Santo Antônio, 12',
    google_maps_url: '',
    image_url: '',
  },
  'santa-rita': {
    name: 'Comunidade Santa Rita',
    slug: 'santa-rita',
    history: 'A mais nova comunidade, com crescimento rápido e forte presença da Pastoral da Família.',
    address: 'Rua Santa Rita, 67',
    google_maps_url: '',
    image_url: '',
  },
}

export default function ComunidadeDetalhe() {
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    supabase
      .from('communities')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
      .then(({ data, error }) => {
        if (!active) return
        if (data) {
          setItem(data)
        } else if (error) {
          setItem(PLACEHOLDER[slug] ?? null)
        }
        setLoading(false)
      })

    return () => { active = false }
  }, [slug])

  if (!slug) return <Navigate to="/comunidades" replace />
  if (loading) return <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando...</div>
  if (!item) return <Navigate to="/comunidades" replace />

  const mapsUrl = item.google_maps_url || (item.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}` : '')

  return (
    <>
      <div className="page-hero">
        <p className="breadcrumb">Início / Comunidades / {item.name}</p>
        <h1>{item.name}</h1>
      </div>

      <section style={{ background: '#fff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <span className="section-label">História</span>
          <h2 className="section-title">Sobre a comunidade</h2>
          <div className="divider"></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 28, alignItems: 'start' }}>
            <div>
              {item.image_url ? (
                <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 22 }}>
                  <img src={item.image_url} alt={item.name} style={{ width: '100%', height: 360, objectFit: 'cover', display: 'block' }} />
                </div>
              ) : null}

              <div className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--teal-xdark)', fontSize: '1.4rem', marginBottom: 14 }}>História</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.85, fontSize: 16 }}>
                  {item.history || 'História não cadastrada.'}
                </p>
              </div>
            </div>

            <aside>
              <div className="card" style={{ padding: '1.75rem', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--teal-xdark)', fontSize: '1.2rem', marginBottom: 10 }}>Endereço</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 14 }}>{item.address || 'Endereço não cadastrado.'}</p>
                {mapsUrl && (
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-teal" style={{ display: 'inline-flex' }}>
                    <i className="ti ti-map" aria-hidden="true"></i> Abrir no Maps
                  </a>
                )}
              </div>

              {mapsUrl && (
                <div className="card" style={{ overflow: 'hidden' }}>
                  <iframe
                    title={`Mapa de ${item.name}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(item.address || item.name)}&output=embed`}
                    width="100%"
                    height="320"
                    style={{ border: 0, display: 'block' }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
