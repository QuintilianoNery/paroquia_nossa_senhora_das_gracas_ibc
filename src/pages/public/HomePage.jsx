import { Card, Container, SectionTitle, Button } from '../../components/ui'
import { usePublicContent } from '../../hooks/usePublicContent'

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(date)
}

export function HomePage() {
  const { parishProfile, communities, news, pastorals, stats, usefulLinks, loading, error } = usePublicContent()
  const featured = {
    title: parishProfile?.title || 'Uma comunidade de fé, amor e serviço.',
    subtitle: parishProfile?.content || 'Venha participar das celebrações, pastorais e da vida da nossa paróquia.',
    image: parishProfile?.hero_image_url || 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1400&q=80'
  }

  const featuredNews = news.slice(0, 3)
  const featuredCommunities = communities.slice(0, 3)
  const featuredPastorals = pastorals.slice(0, 6)
  const featuredLinks = usefulLinks.slice(0, 4)

  return (
    <>
      <section className="hero">
        <Container className="hero__grid">
          <div className="hero__content">
            <span className="eyebrow">Cachoeiro de Itapemirim · ES</span>
            <h1>{featured.title}</h1>
            <p>{featured.subtitle}</p>
            <div className="hero__actions">
              <Button as="link" to="/horarios">Horários das missas</Button>
              <Button as="link" to="/paroquia" className="btn-secondary">Conheça a paróquia</Button>
            </div>
            <div className="stats-grid">
              {stats.map((item) => (
                <Card key={item.label} className="stat-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </Card>
              ))}
            </div>
            {error ? <p className="form-error">Não foi possível carregar alguns dados do Supabase: {error}</p> : null}
            {loading ? <p>Carregando conteúdos publicados...</p> : null}
          </div>
          <div className="hero__visual">
            <img src={featured.image} alt="Igreja católica em celebração" />
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <SectionTitle eyebrow="Acontecimentos" title="Notícias e destaques" description="Conteúdo administrável para eventos, formação e avisos pastorais." />
          <div className="grid grid-3">
            {featuredNews.map((item) => (
              <Card key={item.id}>
                <span className="card-date">{formatDate(item.published_at)}</span>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="section section--alt">
        <Container>
          <SectionTitle eyebrow="Comunidades" title="Comunidades vinculadas" description="Cards padronizados para levar o visitante à página individual de cada comunidade." />
          <div className="grid grid-3">
            {featuredCommunities.map((community) => (
              <Card key={community.id}>
                <span className="badge">Ordem {community.manual_order ?? 0}</span>
                <h3>{community.name}</h3>
                <p>{community.history}</p>
                <p>{community.address}</p>
                {community.google_maps_url ? <a className="card-link" href={community.google_maps_url} target="_blank" rel="noreferrer">Abrir no mapa</a> : null}
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container className="split-grid">
          <div>
            <SectionTitle eyebrow="Serviço e evangelização" title="Pastorais e movimentos" description="Estrutura simples para cards com título, descrição, imagem opcional e ordenação manual." />
            <div className="chips">
              {featuredPastorals.map((item) => <span key={item.id} className="chip">{item.title}</span>)}
            </div>
          </div>
          <Card className="links-card">
            <h3>Formação e links úteis</h3>
            <ul className="link-list">
              {featuredLinks.map((item) => (
                <li key={item.title}><a href={item.url} target="_blank" rel="noreferrer">{item.title}</a></li>
              ))}
            </ul>
          </Card>
        </Container>
      </section>
    </>
  )
}
