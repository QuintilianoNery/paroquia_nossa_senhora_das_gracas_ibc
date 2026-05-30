import { useState } from 'react';
import Seo from '@/components/Seo';

export default function ContactPage() {
  const [successVisible, setSuccessVisible] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSuccessVisible(true);
    event.currentTarget.reset();
    window.setTimeout(() => setSuccessVisible(false), 5000);
  }

  return (
    <>
      <Seo title="Contato — Paróquia NSG" description="Informações de contato e formulário da paróquia." />

      <div className="page-header">
        <p className="breadcrumb">Início / Contato</p>
        <h1>Entre em <span>Contato</span></h1>
      </div>

      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div>
              <p className="section-label">Fale conosco</p>
              <h2 className="section-title">Informações de Contato</h2>
              <div className="divider" aria-hidden="true" />
              <div className="c-info-item"><div className="c-info-icon" aria-hidden="true"><i className="ti ti-map-pin" /></div><div><h4>Endereço</h4><p>Rua Nossa Senhora das Graças, 450<br />Centro — Cachoeiro de Itapemirim/ES<br />CEP: 29300-000</p></div></div>
              <div className="c-info-item"><div className="c-info-icon" aria-hidden="true"><i className="ti ti-phone" /></div><div><h4>Telefone / WhatsApp</h4><p>(28) 3522-0000 · (28) 99900-0000</p></div></div>
              <div className="c-info-item"><div className="c-info-icon" aria-hidden="true"><i className="ti ti-mail" /></div><div><h4>E-mail</h4><p>paroquia.nsg@diocese.com.br</p></div></div>
              <div className="c-info-item"><div className="c-info-icon" aria-hidden="true"><i className="ti ti-clock" /></div><div><h4>Atendimento</h4><p>Seg–Sex: 8h às 11h30 e 14h às 17h30<br />Sábado: 8h às 11h30</p></div></div>
              <div className="map-placeholder" role="img" aria-label="Mapa de localização da paróquia"><i className="ti ti-map" aria-hidden="true" /><span>Mapa integrado via Google Maps</span></div>
            </div>
            <div>
              <p className="section-label">Mensagem</p>
              <h2 className="section-title" style={{ fontSize: '1.6rem' }}>Envie uma mensagem</h2>
              <div className="divider" aria-hidden="true" />
              <form className="contact-form" onSubmit={handleSubmit} aria-label="Formulário de contato">
                <div className="form-row">
                  <div><label htmlFor="cf-nome" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-light)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Nome *</label><input id="cf-nome" type="text" placeholder="Seu nome completo" required /></div>
                  <div><label htmlFor="cf-tel" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-light)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Telefone</label><input id="cf-tel" type="tel" placeholder="(28) 99999-0000" /></div>
                </div>
                <div className="form-group"><label htmlFor="cf-email" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-light)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>E-mail *</label><input id="cf-email" type="email" placeholder="seu@email.com" required /></div>
                <div className="form-group"><label htmlFor="cf-assunto" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-light)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Assunto</label><select id="cf-assunto"><option value="">Selecione o assunto</option><option>Informações sobre sacramentos</option><option>Casamentos</option><option>Batismos</option><option>Pedido de oração</option><option>Pastorais e movimentos</option><option>Outro assunto</option></select></div>
                <div className="form-group"><label htmlFor="cf-msg" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-light)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Mensagem *</label><textarea id="cf-msg" placeholder="Escreva sua mensagem aqui..." required /></div>
                <button type="submit" className="btn-blue"><i className="ti ti-send" aria-hidden="true" /> Enviar mensagem</button>
                <div style={{ display: successVisible ? 'flex' : 'none', marginTop: 16, background: 'rgba(22,101,52,.08)', border: '1px solid rgba(22,101,52,.2)', borderRadius: 6, padding: '12px 16px', color: '#166534', fontSize: 14, alignItems: 'center', gap: 8 }}>
                  <i className="ti ti-circle-check" aria-hidden="true" /> Mensagem enviada com sucesso! Entraremos em contato em breve.
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
