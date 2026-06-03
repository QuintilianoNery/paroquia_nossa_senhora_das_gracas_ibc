import { useEffect, useState } from 'react'
import { supabase } from '@lib/supabase'

const PLACEHOLDER = {
  mass: [
    { id:1, day_label:'Segunda-feira',      time_label:'7h00',                         location:'Igreja Matriz' },
    { id:2, day_label:'Terça-feira',        time_label:'7h00',                         location:'Igreja Matriz' },
    { id:3, day_label:'Quarta-feira',       time_label:'7h00 · 19h30',                 location:'Igreja Matriz' },
    { id:4, day_label:'Quinta-feira',       time_label:'7h00',                         location:'Igreja Matriz' },
    { id:5, day_label:'Sexta-feira',        time_label:'7h00 · 19h30',                 location:'Igreja Matriz' },
    { id:6, day_label:'Sábado',            time_label:'18h00 (Missa Vespertina)',      location:'Igreja Matriz' },
    { id:7, day_label:'Domingo',           time_label:'7h00 · 9h00 · 11h00 · 19h00', location:'Igreja Matriz' },
  ],
  communityMass: [
    { id:8,  day_label:'Comunidade São José',      time_label:'Dom. 8h00' },
    { id:9,  day_label:'Comunidade Santa Luzia',   time_label:'Dom. 10h00' },
    { id:10, day_label:'Comunidade São Francisco', time_label:'Sáb. 17h00' },
    { id:11, day_label:'N. Sra. Aparecida',        time_label:'Dom. 9h00' },
    { id:12, day_label:'Comunidade Santo Antônio', time_label:'Dom. 18h00' },
    { id:13, day_label:'Comunidade Santa Rita',    time_label:'Dom. 7h30' },
  ],
  office: [
    { id:14, day_label:'Seg a Sex',    time_label:'8h às 11h30 · 14h às 17h30' },
    { id:15, day_label:'Sábado',      time_label:'8h às 11h30' },
    { id:16, day_label:'Domingo',     time_label:'Após as missas' },
    { id:17, day_label:'Feriados',    time_label:'Fechado' },
  ],
  sacrament: [
    { id:18, day_label:'Confissões',   time_label:'Sáb. 16h às 17h30' },
    { id:19, day_label:'Batismos',     time_label:'1.º Dom./mês · 10h' },
    { id:20, day_label:'Casamentos',   time_label:'Agendamento antecipado' },
    { id:21, day_label:'Catequese',    time_label:'Sáb. 8h às 10h' },
  ],
}

function SchedBlock({ title, icon, items, color = 'var(--teal)' }) {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ background: color, color: '#fff', padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
        <i className={`ti ${icon}`} style={{ fontSize: 20, color: 'var(--gold)' }} aria-hidden="true"></i>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>{title}</h3>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }} aria-label={title}>
        <tbody>
          {items.map(s => (
            <tr key={s.id} style={{ borderBottom: '1px solid var(--border-light)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--teal-xlight)'}
              onMouseLeave={e => e.currentTarget.style.background = ''}
            >
              <td style={{ padding: '12px 20px', fontWeight: 700, color: 'var(--teal-dark)', width: '45%', fontSize: 14 }}>{s.day_label}</td>
              <td style={{ padding: '12px 20px', color: 'var(--text-muted)', fontSize: 14 }}>{s.time_label}{s.location ? ` · ${s.location}` : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Horarios() {
  const [schedules, setSchedules] = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    supabase.from('mass_schedules').select('*').eq('is_active', true).order('manual_order')
      .then(({ data }) => { if (data) setSchedules(data); setLoading(false) })
  }, [])

  const byType = (type) => {
    if (!loading && schedules.length) return schedules.filter(s => s.type === type)
    return PLACEHOLDER[type === 'mass' ? 'mass' : type === 'office' ? 'office' : 'sacrament'] ?? []
  }

  return (
    <>
      <div className="page-hero">
        <p className="breadcrumb">Início / Horários</p>
        <h1>Horários de <span>Missas e Atendimento</span></h1>
      </div>

      <section style={{ background: '#fff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <SchedBlock
              title="Missas — Igreja Matriz"
              icon="ti-building-church"
              items={byType('mass')}
            />
            <SchedBlock
              title="Missas — Comunidades"
              icon="ti-calendar-event"
              items={(!loading && schedules.length) ? schedules.filter(s => s.type === 'mass' && s.location && s.location !== 'Igreja Matriz') : PLACEHOLDER.communityMass}
            />
            <SchedBlock
              title="Atendimento Paroquial"
              icon="ti-clock"
              items={byType('office')}
              color="#4a6170"
            />
            <SchedBlock
              title="Sacramentos e Serviços"
              icon="ti-heart"
              items={byType('sacrament')}
              color="var(--teal-dark)"
            />
          </div>

          {/* Aviso */}
          <div className="alert alert-info" style={{ marginTop: 24 }} role="note">
            <i className="ti ti-info-circle" style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }} aria-hidden="true"></i>
            <span>
              Os horários podem ser alterados em datas festivas e feriados. Acompanhe os avisos nas redes sociais da paróquia ou entre em contato com a secretaria.{' '}
              <strong>Em caso de falecimento</strong>, favor ligar para o número da paróquia.
            </span>
          </div>
        </div>
        <style>{`@media(max-width:760px){section > div > div:first-child{grid-template-columns:1fr!important}}`}</style>
      </section>
    </>
  )
}
