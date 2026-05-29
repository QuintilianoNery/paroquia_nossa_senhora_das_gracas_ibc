import { Card, Container, SectionTitle } from '../../components/ui'
import { usePublicContent } from '../../hooks/usePublicContent'

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(date)
}

export function ContentPage({ eyebrow, title, description, section }) {
  const content = usePublicContent()

  const views = {
    paroquia: (
      <div className="grid grid-2">
        <Card>
          <h3>{content.parishProfile?.title ?? 'Paróquia'}</h3>
          <p>{content.parishProfile?.content ?? 'Conteúdo institucional administrável.'}</p>
          <p>{content.parishProfile?.address}</p>
          <p>{content.parishProfile?.phone}</p>
          <p>{content.parishProfile?.email}</p>
        </Card>
        <Card>
          <h3>Clero atual</h3>
          {content.clergy.filter((item) => item.is_current).slice(0, 3).map((item) => (
            <div key={item.id} className="content-stack">
              <strong>{item.name}</strong>
              <p>{item.description}</p>
            </div>
          ))}
        </Card>
      </div>
    ),
    comunidades: (
      <div className="grid grid-2">
        {content.communities.map((community) => (
          <Card key={community.id}>
            <span className="badge">Ordem {community.manual_order ?? 0}</span>
            <h3>{community.name}</h3>
            <p>{community.history}</p>
            <p>{community.address}</p>
            {community.saint_story_url ? <a className="card-link" href={community.saint_story_url} target="_blank" rel="noreferrer">História do padroeiro</a> : null}
          </Card>
        ))}
      </div>
    ),
    noticias: (
      <div className="grid grid-2">
        {content.news.map((item) => (
          <Card key={item.id}>
            <span className="card-date">{formatDate(item.published_at)}</span>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <p>{item.content}</p>
          </Card>
        ))}
      </div>
    ),
    horarios: (
      <div className="grid grid-2">
        <Card>
          <h3>Missas</h3>
          {content.massSchedules.map((item) => (
            <div key={item.id} className="content-stack">
              <strong>{item.weekday} · {item.schedule_time}</strong>
              <p>{item.celebration}</p>
              <p>{item.place}</p>
              {item.communities?.name ? <p>{item.communities.name}</p> : null}
            </div>
          ))}
        </Card>
        <Card>
          <h3>Secretaria e serviços</h3>
          {content.officeHours.map((item) => (
            <div key={item.id} className="content-stack">
              <strong>{item.label}</strong>
              <p>{item.schedule_text}</p>
              <p>{item.notes}</p>
            </div>
          ))}
        </Card>
      </div>
    ),
    pastorais: (
      <div className="grid grid-2">
        {content.pastorals.map((item) => (
          <Card key={item.id}>
            <span className="badge">Ordem {item.manual_order ?? 0}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </Card>
        ))}
      </div>
    ),
    contato: (
      <div className="grid grid-2">
        <Card>
          <h3>{content.parishProfile?.title ?? 'Contato'}</h3>
          <p>{content.parishProfile?.address}</p>
          <p>{content.parishProfile?.phone}</p>
          <p>{content.parishProfile?.email}</p>
          {content.parishProfile?.google_maps_url ? <a className="card-link" href={content.parishProfile.google_maps_url} target="_blank" rel="noreferrer">Abrir no Google Maps</a> : null}
        </Card>
        <Card>
          <h3>Links úteis</h3>
          <ul className="link-list">
            {content.usefulLinks.map((item) => (
              <li key={item.id}><a href={item.url} target="_blank" rel="noreferrer">{item.title}</a></li>
            ))}
          </ul>
        </Card>
      </div>
    )
  }

  return (
    <section className="section page-section">
      <Container>
        <SectionTitle eyebrow={eyebrow} title={title} description={description} />
        {views[section] ?? <p>Conteúdo indisponível.</p>}
      </Container>
    </section>
  )
}
