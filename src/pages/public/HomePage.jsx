import { Link } from 'react-router-dom';
import Seo from '@/components/Seo';

export default function HomePage() {
  return (
    <>
      <Seo title="Paróquia Nossa Senhora das Graças" description="Paróquia Nossa Senhora das Graças — Cachoeiro de Itapemirim/ES. Horários de missas, comunidades, pastorais e mais." />

      <section className="hero" aria-label="Bem-vindo à paróquia">
        <div className="hero-inner">
          <div>
            <p className="hero-eyebrow"><i className="ti ti-map-pin" aria-hidden="true" /> Cachoeiro de Itapemirim — ES</p>
            <h1>Bem-vindo à <em>Nossa Senhora das Graças</em></h1>
            <p>Uma comunidade de fé, amor e serviço. Venha participar das celebrações, pastorais e da vida da nossa paróquia.</p>
            <div className="hero-actions">
              <Link className="btn-gold" to="/horarios">
                <i className="ti ti-clock" aria-hidden="true" /> Horários das Missas
              </Link>
              <Link className="btn-ghost" to="/paroquia">
                Nossa História <i className="ti ti-arrow-right" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="hero-card" role="complementary" aria-label="Próximas missas">
            <h3><i className="ti ti-calendar" style={{ marginRight: 8, color: 'var(--gold)' }} aria-hidden="true" />Missas desta semana</h3>
            <div className="mass-item"><span className="day">Seg · Ter · Qui</span><span className="times">7h</span></div>
            <div className="mass-item"><span className="day">Quarta-feira</span><span className="times">7h · 19h30</span></div>
            <div className="mass-item"><span className="day">Sexta-feira</span><span className="times">7h · 19h30</span></div>
            <div className="mass-item"><span className="day">Sábado</span><span className="times">18h</span></div>
            <div className="mass-item"><span className="day">Domingo</span><span className="times">7h · 9h · 11h · 19h</span></div>
            <Link className="btn-ghost" style={{ marginTop: 18, width: '100%', justifyContent: 'center', fontSize: 12, padding: 9 }} to="/horarios">
              Ver todos os horários
            </Link>
          </div>
        </div>
      </section>

      <div className="quick-links" role="navigation" aria-label="Acesso rápido">
        <div className="container">
          <Link className="ql-item" to="/horarios">
            <div className="ql-icon" aria-hidden="true"><i className="ti ti-clock" /></div>
            <span>Horários</span>
          </Link>
          <Link className="ql-item" to="/paroquia">
            <div className="ql-icon" aria-hidden="true"><i className="ti ti-book" /></div>
            <span>Sacramentos</span>
          </Link>
          <Link className="ql-item" to="/pastorais">
            <div className="ql-icon" aria-hidden="true"><i className="ti ti-heart" /></div>
            <span>Pastorais</span>
          </Link>
          <Link className="ql-item" to="/contato">
            <div className="ql-icon" aria-hidden="true"><i className="ti ti-phone" /></div>
            <span>Contato</span>
          </Link>
        </div>
      </div>

      <section className="destaques">
        <div className="container">
          <p className="section-label">Nossa paróquia</p>
          <h2 className="section-title">Faça parte da comunidade</h2>
          <div className="divider" aria-hidden="true" />
          <div className="dest-grid">
            <Link className="dest-card" to="/contato">
              <i className="ti ti-ring" aria-hidden="true" />
              <h3>Casamentos</h3>
              <p>Informe-se sobre os documentos e preparação para o sacramento do matrimônio.</p>
            </Link>
            <Link className="dest-card" to="/pastorais">
              <i className="ti ti-heart-handshake" aria-hidden="true" />
              <p>Seja Dizimista</p>
              <h3>Seja Dizimista</h3>
              <p>Contribua para o crescimento da nossa paróquia e das obras de caridade.</p>
            </Link>
            <Link className="dest-card" to="/pastorais">
              <i className="ti ti-users" aria-hidden="true" />
              <h3>Pastorais</h3>
              <p>Conheça os grupos de serviço e movimento que atuam em nossa paróquia.</p>
            </Link>
            <Link className="dest-card" to="/links">
              <i className="ti ti-book-2" aria-hidden="true" />
              <h3>Formação e Links</h3>
              <p>Liturgia diária, homilias, sites católicos e materiais de formação espiritual.</p>
            </Link>
            <Link className="dest-card" to="/noticias">
              <i className="ti ti-news" aria-hidden="true" />
              <h3>Notícias</h3>
              <p>Fique por dentro das novidades, eventos e celebrações da nossa comunidade.</p>
            </Link>
            <Link className="dest-card" to="/comunidades">
              <i className="ti ti-building-church" aria-hidden="true" />
              <h3>Comunidades</h3>
              <p>Conheça as comunidades vinculadas à paróquia e sua história de fé.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="news-section">
        <div className="container">
          <div className="news-header">
            <div>
              <p className="section-label">Acontecimentos</p>
              <h2 className="section-title">Notícias da Paróquia</h2>
              <div className="divider" aria-hidden="true" />
            </div>
            <Link className="btn-link" to="/noticias">Ver todas <i className="ti ti-arrow-right" aria-hidden="true" /></Link>
          </div>
          <div className="news-grid">
            <article className="news-featured" tabIndex={0} role="button" aria-label="Ler notícia em destaque">
              <div className="nf-img" aria-hidden="true">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-8H9V10h2V8h2v2h2v2h-2v6h-2v-6z" /></svg>
                <span className="nf-badge">Em Destaque</span>
              </div>
              <div className="nf-body">
                <span className="news-tag badge badge-blue">Evento Especial</span>
                <h2>Festa da Padroeira reúne centenas de fiéis em celebração histórica</h2>
                <p>A festa em honra a Nossa Senhora das Graças reuniu a comunidade paroquial em três dias de novena, missa campal e procissão pelas ruas do bairro.</p>
                <div className="news-date">
                  <i className="ti ti-calendar" aria-hidden="true" /> 15 de maio de 2026
                </div>
              </div>
            </article>
            <article className="news-card" tabIndex={0} role="button">
              <div className="nc-img" aria-hidden="true">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /></svg>
              </div>
              <div className="nc-body">
                <span className="news-tag badge badge-blue" style={{ fontSize: 10, marginBottom: 8 }}>Catequese</span>
                <h4>Primeira Comunhão 2026 — inscrições abertas</h4>
                <p>As inscrições para o Encontro de Primeira Comunhão estão abertas até 30 de junho.</p>
                <div className="news-date"><i className="ti ti-calendar" aria-hidden="true" /> 08 de maio de 2026</div>
              </div>
            </article>
            <article className="news-card" tabIndex={0} role="button">
              <div className="nc-img" aria-hidden="true">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /></svg>
              </div>
              <div className="nc-body">
                <span className="news-tag badge badge-blue" style={{ fontSize: 10, marginBottom: 8 }}>Pastoral</span>
                <h4>Campanha de arrecadação da Pastoral da Criança</h4>
                <p>Contribua com alimentos e materiais para apoiar as famílias atendidas pela nossa pastoral.</p>
                <div className="news-date"><i className="ti ti-calendar" aria-hidden="true" /> 02 de maio de 2026</div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="communities-section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p className="section-label">Comunidades</p>
              <h2 className="section-title">Conheça nossas comunidades</h2>
              <div className="divider" aria-hidden="true" />
            </div>
            <Link className="btn-link" to="/comunidades">Ver todas <i className="ti ti-arrow-right" aria-hidden="true" /></Link>
          </div>
          <div className="comm-grid">
            <div className="comm-card" tabIndex={0} role="button" aria-label="Ver comunidade São José">
              <div className="cc-img" style={{ background: 'linear-gradient(135deg,#6B1E2A,#A63347)' }} aria-hidden="true">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /></svg>
              </div>
              <div className="cc-body"><h4>Comunidade São José</h4><p>Fundada em 1978</p></div>
            </div>
            <div className="comm-card" tabIndex={0} role="button" aria-label="Ver comunidade Santa Luzia">
              <div className="cc-img" style={{ background: 'linear-gradient(135deg,#1E4D6B,#2D7AA6)' }} aria-hidden="true">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /></svg>
              </div>
              <div className="cc-body"><h4>Comunidade Santa Luzia</h4><p>Fundada em 1985</p></div>
            </div>
            <div className="comm-card" tabIndex={0} role="button" aria-label="Ver comunidade São Francisco">
              <div className="cc-img" style={{ background: 'linear-gradient(135deg,#3D5016,#6B8C2A)' }} aria-hidden="true">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /></svg>
              </div>
              <div className="cc-body"><h4>Comunidade São Francisco</h4><p>Fundada em 1991</p></div>
            </div>
            <div className="comm-card" tabIndex={0} role="button" aria-label="Ver comunidade Nossa Senhora Aparecida">
              <div className="cc-img" style={{ background: 'linear-gradient(135deg,#6B4B1E,#AA7A35)' }} aria-hidden="true">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /></svg>
              </div>
              <div className="cc-body"><h4>N. Sra. Aparecida</h4><p>Fundada em 1998</p></div>
            </div>
            <div className="comm-card" tabIndex={0} role="button" aria-label="Ver comunidade Santo Antônio">
              <div className="cc-img" style={{ background: 'linear-gradient(135deg,#2A1E6B,#5242A6)' }} aria-hidden="true">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /></svg>
              </div>
              <div className="cc-body"><h4>Comunidade Santo Antônio</h4><p>Fundada em 2003</p></div>
            </div>
            <div className="comm-card" tabIndex={0} role="button" aria-label="Ver comunidade Santa Rita">
              <div className="cc-img" style={{ background: 'linear-gradient(135deg,#6B1E5A,#A62D90)' }} aria-hidden="true">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /></svg>
              </div>
              <div className="cc-body"><h4>Comunidade Santa Rita</h4><p>Fundada em 2010</p></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
