import Seo from '@/components/Seo';

export default function NewsPage() {
  return (
    <>
      <Seo title="Notícias — Paróquia NSG" description="Notícias da paróquia." />

      <div className="page-header">
        <p className="breadcrumb">Início / Notícias</p>
        <h1>Notícias da <span>Paróquia</span></h1>
      </div>

      <section className="news-section">
        <div className="container">
          <div className="news-grid">
            <article className="news-featured" tabIndex={0} role="article">
              <div className="nf-img" aria-hidden="true">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-8H9V10h2V8h2v2h2v2h-2v6h-2v-6z" /></svg>
                <span className="nf-badge">Mais Recente</span>
              </div>
              <div className="nf-body">
                <span className="news-tag badge badge-blue">Evento Especial</span>
                <h2>Festa da Padroeira reúne centenas de fiéis em celebração histórica</h2>
                <p>A festa em honra a Nossa Senhora das Graças reuniu a comunidade paroquial em três dias de novena, missa campal e procissão pelas ruas do bairro. O evento contou com a presença do bispo diocesano e representantes de todas as comunidades.</p>
                <div className="news-date" style={{ marginBottom: 16 }}><i className="ti ti-calendar" aria-hidden="true" /> 15 de maio de 2026</div>
                <button className="btn-blue" type="button">Ler notícia completa <i className="ti ti-arrow-right" aria-hidden="true" /></button>
              </div>
            </article>
            <article className="news-card" tabIndex={0} role="article"><div className="nc-img" aria-hidden="true"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /></svg></div><div className="nc-body"><span className="news-tag badge badge-blue" style={{ fontSize: 10, marginBottom: 8 }}>Catequese</span><h4>Primeira Comunhão 2026 — inscrições abertas até 30 de junho</h4><p>As inscrições para o Encontro de Preparação à Primeira Eucaristia estão abertas. Compareça à secretaria paroquial com documentação do batismo.</p><div className="news-date" style={{ marginBottom: 10 }}><i className="ti ti-calendar" aria-hidden="true" /> 08 de maio de 2026</div><button className="btn-link" type="button" style={{ fontSize: 12 }}>Saiba mais <i className="ti ti-arrow-right" aria-hidden="true" /></button></div></article>
            <article className="news-card" tabIndex={0} role="article"><div className="nc-img" aria-hidden="true"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /></svg></div><div className="nc-body"><span className="news-tag badge badge-blue" style={{ fontSize: 10, marginBottom: 8 }}>Pastoral Social</span><h4>Campanha de arrecadação da Pastoral da Criança</h4><p>Contribua com alimentos não perecíveis e materiais de higiene para apoiar as famílias atendidas pela pastoral.</p><div className="news-date" style={{ marginBottom: 10 }}><i className="ti ti-calendar" aria-hidden="true" /> 02 de maio de 2026</div><button className="btn-link" type="button" style={{ fontSize: 12 }}>Saiba mais <i className="ti ti-arrow-right" aria-hidden="true" /></button></div></article>
            <article className="news-card" tabIndex={0} role="article"><div className="nc-img" aria-hidden="true"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /></svg></div><div className="nc-body"><span className="news-tag badge badge-blue" style={{ fontSize: 10, marginBottom: 8 }}>Formação</span><h4>Curso de Teologia para Leigos — novas turmas em junho</h4><p>Em parceria com o ITESP, abrimos novas turmas do Curso de Formação para Leigos. Inscrições na secretaria.</p><div className="news-date" style={{ marginBottom: 10 }}><i className="ti ti-calendar" aria-hidden="true" /> 25 de abril de 2026</div><button className="btn-link" type="button" style={{ fontSize: 12 }}>Saiba mais <i className="ti ti-arrow-right" aria-hidden="true" /></button></div></article>
            <article className="news-card" tabIndex={0} role="article"><div className="nc-img" aria-hidden="true"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /></svg></div><div className="nc-body"><span className="news-tag badge badge-blue" style={{ fontSize: 10, marginBottom: 8 }}>Juventude</span><h4>JMJ Diocesana 2026 — inscrições abertas para jovens</h4><p>A Jornada Mundial da Juventude Diocesana acontece em julho. Vagas limitadas para jovens de 16 a 30 anos.</p><div className="news-date" style={{ marginBottom: 10 }}><i className="ti ti-calendar" aria-hidden="true" /> 18 de abril de 2026</div><button className="btn-link" type="button" style={{ fontSize: 12 }}>Saiba mais <i className="ti ti-arrow-right" aria-hidden="true" /></button></div></article>
          </div>
        </div>
      </section>
    </>
  );
}
