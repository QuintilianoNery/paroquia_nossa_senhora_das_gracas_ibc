import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--teal-xdark)', color: 'rgba(255,255,255,.7)', padding: '2rem 2rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40,
          paddingBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,.1)',
          marginBottom: '1.5rem'
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 1.6 }}>
              <img
                src="/img/logo-horizontal-bege.png"
                alt="Paróquia Nossa Senhora das Graças"
                style={{ width: 'clamp(118px, 13.3vw, 174px)', height: 'auto', display: 'block', flexShrink: 0, objectFit: 'contain' }}
              />
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.75, marginTop: 0, marginBottom: 18, maxWidth: 280 }}>
              Fundada em 1962, servindo a comunidade de Cachoeiro de Itapemirim com amor, fé e dedicação ao Evangelho.
            </p>
            <div style={{ display: 'flex', gap: 9 }} aria-label="Redes sociais">
              {[
                { icon: 'ti-brand-facebook', label: 'Facebook' },
                { icon: 'ti-brand-instagram', label: 'Instagram' },
                { icon: 'ti-brand-youtube', label: 'YouTube' },
                { icon: 'ti-brand-whatsapp', label: 'WhatsApp' }
              ].map(({ icon, label }) => (
                <a key={label} href="#" aria-label={label} style={{
                  width: 36, height: 36, background: 'rgba(255,255,255,.1)', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 16, transition: 'background .2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.1)'}
                >
                  <i className={`ti ${icon}`} aria-hidden="true"></i>
                </a>
              ))}
            </div>
          </div>

          {/* A Paróquia */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>A Paróquia</h4>
            <ul style={{ listStyle: 'none' }}>
              {[
                ['/paroquia', 'Nossa História'],
                ['/paroquia', 'Clero'],
                ['/comunidades', 'Comunidades'],
                ['/pastorais', 'Pastorais'],
              ].map(([to, label]) => (
                <li key={label} style={{ marginBottom: 8 }}>
                  <Link to={to} style={{ fontSize: 13, color: 'rgba(255,255,255,.62)', textDecoration: 'none', transition: 'color .2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.62)'}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>Serviços</h4>
            <ul style={{ listStyle: 'none' }}>
              {[
                ['/horarios', 'Horários de Missa'],
                ['/horarios', 'Sacramentos'],
                ['/contato', 'Casamentos'],
                ['/contato', 'Batismos'],
                ['/links', 'Liturgia Diária'],
              ].map(([to, label]) => (
                <li key={label} style={{ marginBottom: 8 }}>
                  <Link to={to} style={{ fontSize: 13, color: 'rgba(255,255,255,.62)', textDecoration: 'none', transition: 'color .2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.62)'}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>Contato</h4>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ marginBottom: 8, fontSize: 13 }}>Rua Domingos Alcino Dadalto, 114</li>
              <li style={{ marginBottom: 8, fontSize: 13 }}>Jardim Itapemirim — Cachoeiro/ES</li>
              <li style={{ marginBottom: 8 }}>
                <a href="tel:+552835177296" style={{ fontSize: 13, color: 'rgba(255,255,255,.62)', textDecoration: 'none' }}>(28) 3517-7296</a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a href="mailto:secretaria@paroquiansgracas.org.br" style={{ fontSize: 13, color: 'rgba(255,255,255,.62)', textDecoration: 'none' }}>
                  secretaria@paroquiansgracas.org.br
                </a>
              </li>
              <li style={{ marginTop: 12 }}>
                <Link to="/admin" style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <i className="ti ti-lock" aria-hidden="true" style={{ fontSize: 11 }}></i> Área Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8, fontSize: 12, color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>
          <span>© {new Date().getFullYear()} Paróquia Nossa Senhora das Graças — Cachoeiro de Itapemirim/ES</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 540px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}
