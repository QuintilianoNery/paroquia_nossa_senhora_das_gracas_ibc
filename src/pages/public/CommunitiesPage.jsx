import Seo from '@/components/Seo';

export default function CommunitiesPage() {
  return (
    <>
      <Seo title="Comunidades — Paróquia NSG" description="Comunidades vinculadas da paróquia." />

      <div className="page-header">
        <p className="breadcrumb">Início / Comunidades</p>
        <h1>Nossas <span>Comunidades</span></h1>
      </div>

      <section style={{ background: 'var(--white)' }}>
        <div className="container">
          <p className="section-label">Comunidades vinculadas</p>
          <h2 className="section-title">Conheça cada comunidade</h2>
          <div className="divider" aria-hidden="true" />
          <p className="section-sub">A paróquia é formada por seis comunidades espalhadas pelo município, cada uma com sua história, devoção e vida própria de fé.</p>
          <div className="comm-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
            <div className="comm-card" tabIndex={0}>
              <div className="cc-img" style={{ background: 'linear-gradient(135deg,#6B1E2A,#A63347)', height: 170 }} aria-hidden="true"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 2h2v3h3v2h-3v3h-2V7H8V5h3zm1 10c4 0 8 2 8 5v3H4v-3c0-3 4-5 8-5z" /></svg></div>
              <div className="cc-body" style={{ padding: '1.25rem' }}><h4 style={{ fontSize: '1.1rem', marginBottom: 6 }}>Comunidade São José</h4><p style={{ marginBottom: 8 }}>Uma das primeiras comunidades da paróquia, com forte tradição de catequese e movimento de casais.</p><p style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700 }}><i className="ti ti-calendar" aria-hidden="true" /> Missa: Domingos 8h · Rua São José, 123</p></div>
            </div>
            <div className="comm-card" tabIndex={0}>
              <div className="cc-img" style={{ background: 'linear-gradient(135deg,#1E4D6B,#2D7AA6)', height: 170 }} aria-hidden="true"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 2h2v3h3v2h-3v3h-2V7H8V5h3zm1 10c4 0 8 2 8 5v3H4v-3c0-3 4-5 8-5z" /></svg></div>
              <div className="cc-body" style={{ padding: '1.25rem' }}><h4 style={{ fontSize: '1.1rem', marginBottom: 6 }}>Comunidade Santa Luzia</h4><p style={{ marginBottom: 8 }}>Comunidade com grande devoção a Santa Luzia, reconhecida pelo trabalho com jovens e famílias.</p><p style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700 }}><i className="ti ti-calendar" aria-hidden="true" /> Missa: Domingos 10h · Av. Santa Luzia, 88</p></div>
            </div>
            <div className="comm-card" tabIndex={0}>
              <div className="cc-img" style={{ background: 'linear-gradient(135deg,#3D5016,#6B8C2A)', height: 170 }} aria-hidden="true"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 2h2v3h3v2h-3v3h-2V7H8V5h3zm1 10c4 0 8 2 8 5v3H4v-3c0-3 4-5 8-5z" /></svg></div>
              <div className="cc-body" style={{ padding: '1.25rem' }}><h4 style={{ fontSize: '1.1rem', marginBottom: 6 }}>Comunidade São Francisco</h4><p style={{ marginBottom: 8 }}>Inspirada no espírito franciscano, é referência em ação ecológica, partilha e solidariedade.</p><p style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700 }}><i className="ti ti-calendar" aria-hidden="true" /> Missa: Sábados 17h · Rua das Graças, 45</p></div>
            </div>
            <div className="comm-card" tabIndex={0}>
              <div className="cc-img" style={{ background: 'linear-gradient(135deg,#6B4B1E,#AA7A35)', height: 170 }} aria-hidden="true"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 2h2v3h3v2h-3v3h-2V7H8V5h3zm1 10c4 0 8 2 8 5v3H4v-3c0-3 4-5 8-5z" /></svg></div>
              <div className="cc-body" style={{ padding: '1.25rem' }}><h4 style={{ fontSize: '1.1rem', marginBottom: 6 }}>N. Sra. Aparecida</h4><p style={{ marginBottom: 8 }}>Forte devoção mariana e grande participação nas festas em honra a Nossa Senhora Aparecida.</p><p style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700 }}><i className="ti ti-calendar" aria-hidden="true" /> Missa: Domingos 9h · Rua Aparecida, 300</p></div>
            </div>
            <div className="comm-card" tabIndex={0}>
              <div className="cc-img" style={{ background: 'linear-gradient(135deg,#2A1E6B,#5242A6)', height: 170 }} aria-hidden="true"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 2h2v3h3v2h-3v3h-2V7H8V5h3zm1 10c4 0 8 2 8 5v3H4v-3c0-3 4-5 8-5z" /></svg></div>
              <div className="cc-body" style={{ padding: '1.25rem' }}><h4 style={{ fontSize: '1.1rem', marginBottom: 6 }}>Comunidade Santo Antônio</h4><p style={{ marginBottom: 8 }}>Comunidade jovem com grande energia na evangelização e nos grupos de jovens adultos.</p><p style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700 }}><i className="ti ti-calendar" aria-hidden="true" /> Missa: Domingos 18h · Tv. Santo Antônio, 12</p></div>
            </div>
            <div className="comm-card" tabIndex={0}>
              <div className="cc-img" style={{ background: 'linear-gradient(135deg,#6B1E5A,#A62D90)', height: 170 }} aria-hidden="true"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 2h2v3h3v2h-3v3h-2V7H8V5h3zm1 10c4 0 8 2 8 5v3H4v-3c0-3 4-5 8-5z" /></svg></div>
              <div className="cc-body" style={{ padding: '1.25rem' }}><h4 style={{ fontSize: '1.1rem', marginBottom: 6 }}>Comunidade Santa Rita</h4><p style={{ marginBottom: 8 }}>A mais nova comunidade, com crescimento rápido e forte presença da Pastoral da Família.</p><p style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700 }}><i className="ti ti-calendar" aria-hidden="true" /> Missa: Domingos 7h30 · Rua Santa Rita, 67</p></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
