import { Link, useParams } from 'react-router-dom';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Container from '@/components/Container';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import Seo from '@/components/Seo';
import SectionHeader from '@/components/SectionHeader';
import { useCollectionData } from '@/hooks/useCollectionData';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const { data: news } = useCollectionData('news');
  const item = news.find((entry) => entry.slug === slug);

  if (!item) {
    return (
      <Container className="detail-page">
        <EmptyState title="Notícia não encontrada" description="Verifique o endereço ou volte para a listagem de notícias." />
      </Container>
    );
  }

  return (
    <>
      <Seo title={`${item.title} - Notícias`} description={item.summary || item.content || ''} />
      <section className="detail-page">
        <Container>
          <div className="detail-hero">
            <p className="section-eyebrow">Início / Notícias / {item.category || 'Notícia'}</p>
            <h1>{item.title}</h1>
            <p>{item.summary}</p>
          </div>

          <section className="section-block">
            <div className="content-grid">
              <Card className="static-card">
                <Badge tone="gold">{item.category || 'Notícia'}</Badge>
                <p className="static-copy">{item.content}</p>
                <div className="meta-line">
                  <Icon name="calendar" size={16} />
                  {item.published_at ? new Date(item.published_at).toLocaleDateString('pt-BR') : 'Sem data'}
                </div>
              </Card>
              <Card className="static-card">
                <SectionHeader eyebrow="Galeria" title="Fotos da matéria" description="Galeria vinculada à notícia com alerta após cinco imagens." />
                <div className="gallery-grid">
                  {(item.gallery || []).slice(0, 8).map((photo, index) => (
                    <div key={`${photo}-${index}`} className="gallery-item">
                      {photo}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>

          <Button variant="ghost" asChild>
            <Link to="/noticias">
              <Icon name="arrow-left" size={16} /> Voltar para notícias
            </Link>
          </Button>
        </Container>
      </section>
    </>
  );
}