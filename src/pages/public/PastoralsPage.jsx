import Seo from '@/components/Seo';

export default function PastoralsPage() {
  return (
    <>
      <Seo title="Pastorais — Paróquia NSG" description="Pastorais e movimentos da paróquia." />

      <div className="page-header">
        <p className="breadcrumb">Início / Pastorais</p>
        <h1>Pastorais e <span>Movimentos</span></h1>
      </div>

      <section className="pastorais-section">
        <div className="container">
          <p className="section-label">Serviço e evangelização</p>
          <h2 className="section-title">Conheça nossos grupos</h2>
          <div className="divider" aria-hidden="true" />
          <p className="section-sub">Cada pastoral e movimento tem um carisma específico. Encontre o que mais combina com você e participe!</p>
          <div className="past-grid">
            <div className="past-card"><div className="past-card-icon" style={{ background: 'rgba(123,26,42,.08)', color: 'var(--blue)' }}><i className="ti ti-heart" style={{ fontSize: 22 }} aria-hidden="true" /></div><h3>Pastoral da Criança</h3><p>Acompanhamento nutricional e espiritual de crianças em situação de vulnerabilidade social. Reuniões mensais.</p></div>
            <div className="past-card"><div className="past-card-icon" style={{ background: 'rgba(22,101,52,.08)', color: '#166534' }}><i className="ti ti-users" style={{ fontSize: 22 }} aria-hidden="true" /></div><h3>Pastoral Familiar</h3><p>Encontros de casais e famílias para fortalecer os laços conjugais e a vida em família à luz do Evangelho.</p></div>
            <div className="past-card"><div className="past-card-icon" style={{ background: 'rgba(37,99,235,.08)', color: '#1D4ED8' }}><i className="ti ti-wheelchair" style={{ fontSize: 22 }} aria-hidden="true" /></div><h3>Pastoral dos Enfermos</h3><p>Visitas a hospitais, casas de repouso e domicílios para levar conforto espiritual e o sacramento da unção.</p></div>
            <div className="past-card"><div className="past-card-icon" style={{ background: 'rgba(180,83,9,.08)', color: '#B45309' }}><i className="ti ti-hand-stop" style={{ fontSize: 22 }} aria-hidden="true" /></div><h3>Cáritas Paroquial</h3><p>Distribuição de alimentos e apoio a famílias em situação de vulnerabilidade. Voluntários bem-vindos!</p></div>
            <div className="past-card"><div className="past-card-icon" style={{ background: 'rgba(126,34,206,.08)', color: '#6D28D9' }}><i className="ti ti-music" style={{ fontSize: 22 }} aria-hidden="true" /></div><h3>Ministério de Música</h3><p>Grupos de canto e instrumentistas que animam as celebrações litúrgicas da matriz e das comunidades.</p></div>
            <div className="past-card"><div className="past-card-icon" style={{ background: 'rgba(15,118,110,.08)', color: '#0F766E' }}><i className="ti ti-book" style={{ fontSize: 22 }} aria-hidden="true" /></div><h3>Catequese</h3><p>Preparação para os sacramentos da iniciação cristã: Primeira Eucaristia e Crisma. Atende crianças e adultos.</p></div>
            <div className="past-card"><div className="past-card-icon" style={{ background: 'rgba(190,18,60,.08)', color: '#BE123C' }}><i className="ti ti-star" style={{ fontSize: 22 }} aria-hidden="true" /></div><h3>Movimento de Jovens</h3><p>Grupo de jovens adultos que se reúne semanalmente para reflexão, oração e serviço comunitário.</p></div>
            <div className="past-card"><div className="past-card-icon" style={{ background: 'rgba(161,98,7,.08)', color: '#A16207' }}><i className="ti ti-leaf" style={{ fontSize: 22 }} aria-hidden="true" /></div><h3>Pastoral da Sobriedade</h3><p>Apoio a pessoas com dependência química e seus familiares, em parceria com grupos de autoajuda da região.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
