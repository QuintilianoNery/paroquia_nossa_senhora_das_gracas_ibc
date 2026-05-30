import { useEffect, useState } from 'react'
import { supabase } from '@lib/supabase'

const ROLE_LABELS = {
  parochus:         'Pároco',
  vicar:            'Vigário',
  deacon:           'Diácono Permanente',
  deacon_formation: 'Diácono em Formação',
}
const ROLE_ORDER = ['parochus', 'vicar', 'deacon', 'deacon_formation']

const AVATAR_COLORS = ['#3d7f91','#2a5f6e','#c19241','#96711e']

function CleroCard({ c, idx }) {
  const initials = c.name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase()
  return (
    <div style={{
      textAlign: 'center', background: '#fff', borderRadius: 10,
      padding: '2rem 1.5rem', border: '1px solid var(--border)',
      transition: 'box-shadow .2s'
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
    >
      <div style={{
        width: 88, height: 88, borderRadius: '50%',
        background: `linear-gradient(135deg, ${AVATAR_COLORS[idx % 4]}, ${AVATAR_COLORS[(idx + 1) % 4]})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px', fontFamily: 'var(--font-serif)',
        fontSize: '2rem', fontWeight: 700, color: '#fff'
      }} aria-hidden="true">{initials}</div>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>
        {c.is_current && <i className="ti ti-star-filled" style={{ fontSize: 10, marginRight: 3 }} aria-hidden="true"></i>}
        {ROLE_LABELS[c.role] ?? c.role}
      </p>
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: 'var(--teal-xdark)', marginBottom: 8 }}>{c.name}</p>
      {c.bio && <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55 }}>{c.bio}</p>}
    </div>
  )
}

export default function Paroquia() {
  const [profile, setProfile] = useState(null)
  const [clergy,  setClergy]  = useState([])

  useEffect(() => {
    supabase.from('parish_profile').select('*').single()
      .then(({ data }) => data && setProfile(data))

    supabase.from('clergy').select('*').order('manual_order')
      .then(({ data }) => {
        if (!data) return
        // pároco e diácono atual primeiro em suas seções
        const sorted = [...data].sort((a, b) => {
          const ro = ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role)
          if (ro !== 0) return ro
          if (a.is_current !== b.is_current) return a.is_current ? -1 : 1
          return (a.manual_order ?? 0) - (b.manual_order ?? 0)
        })
        setClergy(sorted)
      })
  }, [])

  const historyText = profile?.content || `A Paróquia Nossa Senhora das Graças foi fundada em 15 de agosto de 1962, na cidade de Cachoeiro de Itapemirim, Espírito Santo, sob a orientação do então bispo diocesano Dom João Batista da Mota e Albuquerque. Desde suas origens humildes em uma pequena capelinha de madeira, a paróquia cresceu ao longo das décadas e se tornou um importante polo de evangelização e serviço social da região.

Em 1978, iniciou-se a construção da Igreja Matriz, concluída em 1983, com sua bela fachada que se tornaria um dos pontos históricos da cidade. A estrutura atual abriga a nave principal, sacristia, salão paroquial, secretaria e salão de catequese.

Ao longo de mais de seis décadas, a paróquia expandiu sua atuação por diversas comunidades, formando uma rede de fé, caridade e evangelização que atende milhares de famílias. Hoje conta com seis comunidades vinculadas, diversas pastorais ativas e um quadro dedicado de voluntários.`

  const address  = profile?.address  || 'Rua Domingos Alcino Dadalto, 114 — Jardim Itapemirim, Cachoeiro de Itapemirim/ES · CEP: 29315-314'
  const mapsUrl  = profile?.google_maps_url || 'https://maps.google.com'

  const placeholderClergy = [
    { id:1, name:'Pe. José Carlos Mendonça',  role:'parochus',  is_current:true,  bio:'Ordenado em 2001, exerce o ministério paroquial em Cachoeiro desde 2018.' },
    { id:2, name:'Pe. André Lima Santos',     role:'vicar',     is_current:true,  bio:'Vigário paroquial desde 2022, responsável pela catequese e juventude.' },
    { id:3, name:'Dc. Marcos Antônio Ferreira',role:'deacon',   is_current:true,  bio:'Diácono permanente ordenado em 2015, atuando nas visitas hospitalares.' },
    { id:4, name:'Dc. Roberto Figueiredo',    role:'deacon_formation', is_current:false, bio:'Em processo de formação diaconal, auxiliando nas celebrações dominicais.' },
  ]
  const clergyList = clergy.length ? clergy : placeholderClergy

  return (
    <>
      <div className="page-hero">
        <p className="breadcrumb">Início / Paróquia</p>
        <h1>Nossa <span>Paróquia</span></h1>
      </div>

      {/* História */}
      <section style={{ background: '#fff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <span className="section-label">Nossa história</span>
          <h2 className="section-title">História da Paróquia</h2>
          <div className="divider"></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            <div>
              {historyText.split('\n\n').map((p, i) => (
                <p key={i} style={{ color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.85, fontSize: 16 }}>{p}</p>
              ))}
            </div>
            <div>
              {profile?.image_url ? (
                <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', height: 340 }}>
                  <img src={profile.image_url} alt={profile.title || 'Imagem da paróquia'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              ) : (
                <div style={{
                  borderRadius: 12, background: 'linear-gradient(135deg,var(--teal-xdark),var(--teal))',
                  height: 340, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', color: 'rgba(255,255,255,.2)'
                }} role="img" aria-label="Igreja Matriz Nossa Senhora das Graças">
                  <i className="ti ti-building-church" style={{ fontSize: 90, marginBottom: 12 }} aria-hidden="true"></i>
                  <p style={{ fontSize: 13 }}>Igreja Matriz · Cachoeiro de Itapemirim/ES</p>
                </div>
              )}

              <div style={{ background: 'var(--gold-xlight)', borderRadius: 8, padding: '1.5rem', border: '1px solid var(--gold-light)', marginTop: 20 }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--teal-xdark)', marginBottom: 10, fontSize: '1.05rem' }}>
                  <i className="ti ti-map-pin" style={{ color: 'var(--gold)', marginRight: 6 }} aria-hidden="true"></i>Endereço
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 14 }}>{address}</p>
                <a
                  href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  className="btn btn-teal btn-sm"
                  style={{ display: 'inline-flex' }}
                >
                  <i className="ti ti-map" aria-hidden="true"></i> Abrir no Maps
                </a>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:800px){section > div > div:last-child{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* Clero */}
      <section style={{ background: 'var(--cream-dark)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <span className="section-label">Clero Paroquial</span>
          <h2 className="section-title">Padres e Diáconos</h2>
          <div className="divider"></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 20 }}>
            {clergyList.map((c, i) => <CleroCard key={c.id} c={c} idx={i} />)}
          </div>
        </div>
      </section>
    </>
  )
}
