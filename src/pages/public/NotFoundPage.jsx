import { Link } from 'react-router-dom';
import Container from '@/components/Container';
import Seo from '@/components/Seo';

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Página não encontrada - Nossa Senhora das Graças" description="Página inexistente." />
      <Container className="public-page">
        <div className="page-hero">
          <p className="section-eyebrow">404</p>
          <h1>Página não encontrada</h1>
          <p>A rota solicitada não existe ou foi movida.</p>
          <Link to="/" className="button button-primary">
            Voltar para o início
          </Link>
        </div>
      </Container>
    </>
  );
}