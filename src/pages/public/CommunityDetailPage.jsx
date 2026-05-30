import { Link, useParams } from 'react-router-dom';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Container from '@/components/Container';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import MapEmbed from '@/components/MapEmbed';
import Seo from '@/components/Seo';
import SectionHeader from '@/components/SectionHeader';
import { useCollectionData } from '@/hooks/useCollectionData';

export default function CommunityDetailPage() {
  const { slug } = useParams();
  const { data: communities } = useCollectionData('communities');
  const community = communities.find((item) => item.slug === slug);

  if (!community) {
    return (
      <Container className="detail-page">
        <EmptyState title="Comunidade não encontrada" description="Verifique o endereço ou volte para a listagem de comunidades." />
      </Container>
    );
  }

  return (
    <>
      <Seo title={`${community.name} - Comunidades`} description={community.summary || community.story || ''} />
      <section className="detail-page">
        <Container>
          <div className="detail-hero">
            <p className="section-eyebrow">Início / Comunidades / {community.name}</p>
            <h1>{community.name}</h1>
            <p>{community.summary}</p>
          </div>

          <section className="section-block">
            <SectionHeader eyebrow="História" title="Sobre a comunidade" description={community.story} />
            <div className="content-grid">
              <Card className="static-card">
                <Badge tone="blue">Endereço</Badge>
                <p>{community.address || 'Endereço não cadastrado.'}</p>
                {community.google_maps_url ? (
                  <Button variant="ghost" asChild>
                    <a href={community.google_maps_url} target="_blank" rel="noreferrer">
                      Abrir no Google Maps <Icon name="external-link" size={16} />
                    </a>
                  </Button>
                ) : null}
              </Card>
              <Card className="static-card">
                <MapEmbed mapsUrl={community.google_maps_url} address={community.address} compact />
              </Card>
            </div>
          </section>

          <section className="section-block">
            <SectionHeader eyebrow="Galeria" title="Fotos da comunidade" description="Acima de cinco fotos o cadastro destaca um aviso de performance." />
            <div className="gallery-grid">
              {(community.gallery || []).slice(0, 8).map((item, index) => (
                <div key={`${item}-${index}`} className="gallery-item">
                  {item}
                </div>
              ))}
            </div>
            {community.story ? <p className="content-lead">História do santo: {community.story}</p> : null}
          </section>

          <Button variant="ghost" asChild>
            <Link to="/comunidades">
              <Icon name="arrow-left" size={16} /> Voltar para comunidades
            </Link>
          </Button>
        </Container>
      </section>
    </>
  );
}