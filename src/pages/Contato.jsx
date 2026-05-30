import { useState } from 'react'

export default function Contato() {
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [form,    setForm]    = useState({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 1200)
  }

  const INFO = [
    { icon: 'ti-map-pin',  label: 'Endereço',          value: 'Rua Domingos Alcino Dadalto, 114\nJardim Itapemirim — Cachoeiro de Itapemirim/ES\nCEP: 29315-314' },
    { icon: 'ti-phone',    label: 'Telefone / WhatsApp', value: '(28) 3517-7296\n(28) 99900-0000' },
    { icon: 'ti-mail',     label: 'E-mail',             value: 'secretaria@paroquiansgracas.org.br' },
    { icon: 'ti-clock',    label: 'Atendimento',         value: 'Seg–Sex: 8h às 11h30 e 14h às 17h30\nSábado: 8h às 11h30' },
  ]

  return (
    <>
      <div className="page-hero">
        <p className="breadcrumb">Início / Contato</p>
        <h1>Entre em <span>Contato</span></h1>
      </div>

      <section style={{ background: '#fff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 56 }}>

            {/* Info */}
            <div>
              <span className="section-label">Fale conosco</span>
              <h2 className="section-title">Informações de Contato</h2>
              <div className="divider"></div>

              {INFO.map(({ icon, label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 22 }}>
                  <div style={{ width: 42, height: 42, background: 'var(--teal-xlight)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)', fontSize: 19, flexShrink: 0 }}>
                    <i className={`ti ${icon}`} aria-hidden="true"></i>
                  </div>
                  <div>
                    <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: 3 }}>{label}</h4>
                    <p style={{ color: 'var(--text)', fontSize: 15, whiteSpace: 'pre-line' }}>{value}</p>
                  </div>
                </div>
              ))}

              {/* Map placeholder */}
              <div style={{
                background: 'var(--teal-xlight)', borderRadius: 8, height: 200,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', border: '1px solid var(--border)',
                marginTop: 20, color: 'var(--text-muted)', fontSize: 14
              }} role="img" aria-label="Localização no mapa">
                <i className="ti ti-map" style={{ fontSize: 32, color: 'var(--teal)', opacity: .4, marginBottom: 8 }} aria-hidden="true"></i>
                <span>Mapa integrado via Google Maps</span>
                <a
                  href="https://maps.google.com"
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-teal btn-sm"
                  style={{ marginTop: 14 }}
                >
                  <i className="ti ti-external-link" aria-hidden="true"></i> Abrir no Maps
                </a>
              </div>
            </div>

            {/* Form */}
            <div>
              <span className="section-label">Mensagem</span>
              <h2 className="section-title" style={{ fontSize: '1.7rem' }}>Envie uma mensagem</h2>
              <div className="divider"></div>

              {sent ? (
                <div className="alert alert-success" style={{ fontSize: 16, padding: '1.5rem' }}>
                  <i className="ti ti-circle-check" style={{ fontSize: 24 }} aria-hidden="true"></i>
                  <div>
                    <strong>Mensagem enviada com sucesso!</strong>
                    <p style={{ marginTop: 4, fontWeight: 400 }}>Entraremos em contato em breve.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} aria-label="Formulário de contato">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="cf-nome" className="form-label">Nome *</label>
                      <input id="cf-nome" type="text" className="form-input" placeholder="Seu nome completo" value={form.nome} onChange={set('nome')} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cf-tel" className="form-label">Telefone</label>
                      <input id="cf-tel" type="tel" className="form-input" placeholder="(28) 99999-0000" value={form.telefone} onChange={set('telefone')} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="cf-email" className="form-label">E-mail *</label>
                    <input id="cf-email" type="email" className="form-input" placeholder="seu@email.com" value={form.email} onChange={set('email')} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cf-assunto" className="form-label">Assunto</label>
                    <select id="cf-assunto" className="form-select" value={form.assunto} onChange={set('assunto')}>
                      <option value="">Selecione o assunto</option>
                      <option>Informações sobre sacramentos</option>
                      <option>Casamentos</option>
                      <option>Batismos</option>
                      <option>Pedido de oração</option>
                      <option>Pastorais e movimentos</option>
                      <option>Outro assunto</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="cf-msg" className="form-label">Mensagem *</label>
                    <textarea id="cf-msg" className="form-textarea" placeholder="Escreva sua mensagem..." value={form.mensagem} onChange={set('mensagem')} required />
                  </div>
                  <button type="submit" className="btn btn-teal" disabled={loading}>
                    {loading
                      ? <><i className="ti ti-loader-2" aria-hidden="true"></i> Enviando...</>
                      : <><i className="ti ti-send" aria-hidden="true"></i> Enviar mensagem</>
                    }
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        <style>{`@media(max-width:820px){section > div > div{grid-template-columns:1fr!important}}`}</style>
      </section>
    </>
  )
}
