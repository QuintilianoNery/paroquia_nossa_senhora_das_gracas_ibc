import { Card } from '../../components/ui'

const cards = [
  ['Comunidades', 'CRUD com slug, mapa, status de publicação e galeria.'],
  ['Notícias', 'Cadastro com resumo, conteúdo, data de publicação e destaque na home.'],
  ['Clero', 'Controle de pároco, vigário e diácono com ordem manual.'],
  ['Horários', 'Missas, atendimento paroquial e serviços pastorais.'],
  ['Links', 'Links úteis e liturgia com categoria e ordem.'],
  ['Pastorais', 'Cards leves com expansão futura para contato e coordenação.']
]

export function AdminDashboardPage() {
  return (
    <div className="admin-section">
      <div className="section-heading compact">
        <span className="eyebrow">Dashboard</span>
        <h2>Módulos da fase 5</h2>
        <p>Painel preparado para evolução do backend institucional usando Supabase.</p>
      </div>
      <div className="grid grid-3">
        {cards.map(([title, text]) => (
          <Card key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
