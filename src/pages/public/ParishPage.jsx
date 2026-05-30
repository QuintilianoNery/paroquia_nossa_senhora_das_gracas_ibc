import { Link } from 'react-router-dom';
import Seo from '@/components/Seo';

export default function ParishPage() {
  return (
    <>
      <Seo title="Paróquia — Paróquia NSG" description="História da paróquia, endereço e clero paroquial." />

      <div className="page-header">
        <p className="breadcrumb">Início / Paróquia</p>
        <h1>Nossa <span>Paróquia</span></h1>
      </div>

      <section className="parish-section">
        <div className="container">
          <p className="section-label">Nossa história</p>
          <h2 className="section-title">História da Paróquia</h2>
          <div className="divider" aria-hidden="true" />
          <div className="history-grid">
            <div className="history-text">
              <p>A Paróquia Nossa Senhora das Graças foi fundada em 15 de agosto de 1962, na cidade de Cachoeiro de Itapemirim, Espírito Santo, sob a orientação do então bispo diocesano Dom João Batista da Mota e Albuquerque. Desde suas origens humildes em uma pequena capelinha de madeira, a paróquia cresceu ao longo das décadas e se tornou um importante polo de evangelização e serviço social da região.</p>
              <p>Em 1978, iniciou-se a construção da Igreja Matriz, concluída em 1983, com sua bela fachada neogótica que se tornaria um dos pontos históricos da cidade. A estrutura atual abriga a nave principal, sacristia, salão paroquial, secretaria e salão de catequese.</p>
              <p>Ao longo de mais de seis décadas, a paróquia expandiu sua atuação por diversas comunidades do bairro e região, formando uma rede de fé, caridade e evangelização que atende milhares de famílias. Hoje conta com seis comunidades vinculadas, diversas pastorais ativas e um quadro dedicado de voluntários.</p>
              <p>A devoção a Nossa Senhora das Graças é o coração da identidade paroquial, celebrada anualmente com grande solenidade no mês de maio, atraindo fiéis de toda a diocese.</p>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link className="btn-blue" to="/contato"><i className="ti ti-map-pin" aria-hidden="true" /> Como chegar</Link>
                <Link className="btn-link" to="/comunidades">Ver comunidades <i className="ti ti-arrow-right" aria-hidden="true" /></Link>
              </div>
            </div>
            <div>
              <div className="history-img" aria-label="Foto da Igreja Matriz Nossa Senhora das Graças">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 2h2v3h3v2h-3v3h-2V7H8V5h3zm1 10c4 0 8 2 8 5v3H4v-3c0-3 4-5 8-5z" /></svg>
                <p style={{ fontSize: 12 }}>Igreja Matriz · Cachoeiro de Itapemirim/ES</p>
              </div>
              <div style={{ background: 'var(--gold-xlight)', borderRadius: 8, padding: '1.5rem', border: '1px solid var(--gold-light)', marginTop: 20 }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: 'var(--blue-dark)', marginBottom: 10, fontSize: '1.05rem' }}><i className="ti ti-map-pin" style={{ marginRight: 6, color: 'var(--gold)' }} aria-hidden="true" />Endereço da Matriz</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>Rua Nossa Senhora das Graças, 450<br />Centro — Cachoeiro de Itapemirim/ES<br />CEP: 29300-000</p>
                <div className="map-placeholder" style={{ marginTop: 14, height: 140 }}>
                  <i className="ti ti-map" aria-hidden="true" />
                  <span>Mapa integrado (Google Maps)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="clergy-section">
        <div className="container">
          <p className="section-label">Clero Paroquial</p>
          <h2 className="section-title">Padres e Diáconos</h2>
          <div className="divider" aria-hidden="true" />
          <div className="clergy-grid">
            <div className="clergy-card">
              <div className="clergy-avatar" style={{ background: 'linear-gradient(135deg,var(--blue),var(--blue-light))' }} aria-hidden="true">JC</div>
              <p className="clergy-role"><i className="ti ti-star-filled" style={{ fontSize: 10, marginRight: 3 }} aria-hidden="true" />Pároco</p>
              <p className="clergy-name">Pe. José Carlos Mendonça</p>
              <p className="clergy-bio">Ordenado em 2001, exerce o ministério paroquial em Cachoeiro desde 2018, com forte atuação nas pastorais sociais.</p>
            </div>
            <div className="clergy-card">
              <div className="clergy-avatar" style={{ background: 'linear-gradient(135deg,#1E4D6B,#2D7AA6)' }} aria-hidden="true">AL</div>
              <p className="clergy-role">Vigário</p>
              <p className="clergy-name">Pe. André Lima Santos</p>
              <p className="clergy-bio">Vigário paroquial desde 2022, responsável pela catequese e pela juventude da paróquia.</p>
            </div>
            <div className="clergy-card">
              <div className="clergy-avatar" style={{ background: 'linear-gradient(135deg,#3D5016,#6B8C2A)' }} aria-hidden="true">MA</div>
              <p className="clergy-role"><i className="ti ti-star-filled" style={{ fontSize: 10, marginRight: 3 }} aria-hidden="true" />Diácono</p>
              <p className="clergy-name">Dc. Marcos Antônio Ferreira</p>
              <p className="clergy-bio">Diácono permanente ordenado em 2015, atuando nas visitas hospitalares e nos sacramentos de necessidade.</p>
            </div>
            <div className="clergy-card">
              <div className="clergy-avatar" style={{ background: 'linear-gradient(135deg,#6B4B1E,#AA7A35)' }} aria-hidden="true">RF</div>
              <p className="clergy-role">Diácono em Formação</p>
              <p className="clergy-name">Dc. Roberto Figueiredo</p>
              <p className="clergy-bio">Em processo de formação diaconal, auxiliando nas celebrações dominicais e na pastoral familiar.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
