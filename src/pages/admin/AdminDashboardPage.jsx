import { Link } from 'react-router-dom';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Icon from '@/components/Icon';
import SectionHeader from '@/components/SectionHeader';
import { adminQuickLinks } from '@/config/collections';

export default function AdminDashboardPage() {
  return (
    <section className="panel-section">
      <SectionHeader
        eyebrow="Visão geral"
        title="Atalhos do painel"
        description="Acesse os módulos de cadastro, ordenação e publicação."
      />

      <div className="dashboard-cards">
        {adminQuickLinks.map((item) => (
          <Card key={item.key} className="dashboard-card">
            <Badge tone="gold">{item.label}</Badge>
            <h3>{item.label}</h3>
            <p>{item.description}</p>
            <Link className="button button-primary" to={`/admin/${item.key}`}>
              Abrir cadastro <Icon name="arrow-right" size={16} />
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}