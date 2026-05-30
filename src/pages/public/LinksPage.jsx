import Seo from '@/components/Seo';

export default function LinksPage() {
  return (
    <>
      <Seo title="Links — Paróquia NSG" description="Formação e links úteis da paróquia." />

      <div className="page-header">
        <p className="breadcrumb">Início / Formação e Links</p>
        <h1>Formação e <span>Links Úteis</span></h1>
      </div>

      <section className="links-section">
        <div className="container">
          <p className="section-label">Liturgia e espiritualidade</p>
          <h2 className="section-title">Links da Liturgia</h2>
          <div className="divider" aria-hidden="true" />
          <div className="links-grid" style={{ marginBottom: '4rem' }}>
            <a className="link-card" href="https://liturgia.cancaonova.com" target="_blank" rel="noopener"><div className="link-icon"><i className="ti ti-book-2" aria-hidden="true" /></div><div><h4>Liturgia Diária</h4><p>Leituras, salmo e evangelho do dia — Canção Nova</p></div><i className="ti ti-external-link" style={{ marginLeft: 'auto', color: 'var(--text-light)', fontSize: 16 }} aria-hidden="true" /></a>
            <a className="link-card" href="https://santo.cancaonova.com" target="_blank" rel="noopener"><div className="link-icon"><i className="ti ti-star" aria-hidden="true" /></div><div><h4>Santo do Dia</h4><p>Conheça o santo ou beato que a Igreja celebra hoje</p></div><i className="ti ti-external-link" style={{ marginLeft: 'auto', color: 'var(--text-light)', fontSize: 16 }} aria-hidden="true" /></a>
            <a className="link-card" href="https://www.vaticannews.va/pt.html" target="_blank" rel="noopener"><div className="link-icon"><i className="ti ti-world" aria-hidden="true" /></div><div><h4>Vatican News</h4><p>Notícias da Santa Sé e do Papa Francisco em português</p></div><i className="ti ti-external-link" style={{ marginLeft: 'auto', color: 'var(--text-light)', fontSize: 16 }} aria-hidden="true" /></a>
            <a className="link-card" href="https://www.cancaonova.com" target="_blank" rel="noopener"><div className="link-icon"><i className="ti ti-music" aria-hidden="true" /></div><div><h4>Canção Nova</h4><p>TV, rádio, espiritualidade e evangelização online</p></div><i className="ti ti-external-link" style={{ marginLeft: 'auto', color: 'var(--text-light)', fontSize: 16 }} aria-hidden="true" /></a>
          </div>
          <p className="section-label">Formação e sites católicos</p>
          <h2 className="section-title">Links Úteis</h2>
          <div className="divider" aria-hidden="true" />
          <div className="links-grid">
            <a className="link-card" href="https://www.cnbb.org.br" target="_blank" rel="noopener"><div className="link-icon"><i className="ti ti-building" aria-hidden="true" /></div><div><h4>CNBB</h4><p>Conferência Nacional dos Bispos do Brasil</p></div><i className="ti ti-external-link" style={{ marginLeft: 'auto', color: 'var(--text-light)', fontSize: 16 }} aria-hidden="true" /></a>
            <a className="link-card" href="https://caritas.org.br" target="_blank" rel="noopener"><div className="link-icon"><i className="ti ti-heart-handshake" aria-hidden="true" /></div><div><h4>Cáritas Brasileira</h4><p>Organização da CNBB de ação social e solidariedade</p></div><i className="ti ti-external-link" style={{ marginLeft: 'auto', color: 'var(--text-light)', fontSize: 16 }} aria-hidden="true" /></a>
            <a className="link-card" href="https://www.catequesehoje.com.br" target="_blank" rel="noopener"><div className="link-icon"><i className="ti ti-school" aria-hidden="true" /></div><div><h4>Catequese Hoje</h4><p>Subsídios, artigos e formação para catequistas</p></div><i className="ti ti-external-link" style={{ marginLeft: 'auto', color: 'var(--text-light)', fontSize: 16 }} aria-hidden="true" /></a>
            <a className="link-card" href="https://www.a12.com" target="_blank" rel="noopener"><div className="link-icon"><i className="ti ti-radio" aria-hidden="true" /></div><div><h4>Rádio Aparecida</h4><p>Programação religiosa e conteúdo mariano</p></div><i className="ti ti-external-link" style={{ marginLeft: 'auto', color: 'var(--text-light)', fontSize: 16 }} aria-hidden="true" /></a>
            <a className="link-card" href="https://www.acidigital.com" target="_blank" rel="noopener"><div className="link-icon"><i className="ti ti-news" aria-hidden="true" /></div><div><h4>ACI Digital</h4><p>Agência Católica de Informações em português</p></div><i className="ti ti-external-link" style={{ marginLeft: 'auto', color: 'var(--text-light)', fontSize: 16 }} aria-hidden="true" /></a>
            <a className="link-card" href="https://padrepauloricardo.org" target="_blank" rel="noopener"><div className="link-icon"><i className="ti ti-microphone" aria-hidden="true" /></div><div><h4>Pe. Paulo Ricardo</h4><p>Homilias, cursos e formação filosófica e teológica</p></div><i className="ti ti-external-link" style={{ marginLeft: 'auto', color: 'var(--text-light)', fontSize: 16 }} aria-hidden="true" /></a>
          </div>
        </div>
      </section>
    </>
  );
}
