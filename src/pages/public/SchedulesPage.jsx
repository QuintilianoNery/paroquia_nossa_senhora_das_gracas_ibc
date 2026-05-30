import Seo from '@/components/Seo';

export default function SchedulesPage() {
  return (
    <>
      <Seo title="Horários — Paróquia NSG" description="Horários de missas e atendimento." />

      <div className="page-header">
        <p className="breadcrumb">Início / Horários</p>
        <h1>Horários de <span>Missas e Atendimento</span></h1>
      </div>

      <section className="schedule-section">
        <div className="container">
          <div className="schedule-grid">
            <div className="sched-block">
              <div className="sched-head"><i className="ti ti-building-church" aria-hidden="true" /><h3>Missas — Igreja Matriz</h3></div>
              <table className="sched-table" aria-label="Horários de Missa na Matriz"><tbody>
                <tr><td>Segunda-feira</td><td>7h00</td></tr><tr><td>Terça-feira</td><td>7h00</td></tr><tr><td>Quarta-feira</td><td>7h00 · 19h30</td></tr><tr><td>Quinta-feira</td><td>7h00</td></tr><tr><td>Sexta-feira</td><td>7h00 · 19h30</td></tr><tr><td>Sábado</td><td>18h00 (Missa Vespertina)</td></tr><tr><td>Domingo</td><td>7h00 · 9h00 · 11h00 · 19h00</td></tr>
              </tbody></table>
            </div>
            <div className="sched-block">
              <div className="sched-head"><i className="ti ti-calendar-event" aria-hidden="true" /><h3>Missas — Comunidades</h3></div>
              <table className="sched-table" aria-label="Horários de Missa nas Comunidades"><tbody>
                <tr><td>São José</td><td>Dom. 8h00</td></tr><tr><td>Santa Luzia</td><td>Dom. 10h00</td></tr><tr><td>São Francisco</td><td>Sáb. 17h00</td></tr><tr><td>N. Sra. Aparecida</td><td>Dom. 9h00</td></tr><tr><td>Santo Antônio</td><td>Dom. 18h00</td></tr><tr><td>Santa Rita</td><td>Dom. 7h30</td></tr>
              </tbody></table>
            </div>
            <div className="sched-block">
              <div className="sched-head" style={{ background: '#5F5E5A' }}><i className="ti ti-clock" aria-hidden="true" /><h3>Atendimento Paroquial</h3></div>
              <table className="sched-table" aria-label="Horários de Atendimento Paroquial"><tbody>
                <tr><td>Seg a Sex</td><td>8h às 11h30 · 14h às 17h30</td></tr><tr><td>Sábado</td><td>8h às 11h30</td></tr><tr><td>Domingo</td><td>Após as missas</td></tr><tr><td>Feriados</td><td>Fechado</td></tr>
              </tbody></table>
            </div>
            <div className="sched-block">
              <div className="sched-head" style={{ background: '#3D5016' }}><i className="ti ti-heart" aria-hidden="true" /><h3>Sacramentos e Serviços</h3></div>
              <table className="sched-table" aria-label="Horários de Sacramentos"><tbody>
                <tr><td>Confissões</td><td>Sáb. 16h às 17h30</td></tr><tr><td>Batismos</td><td>1.º Dom./mês 10h</td></tr><tr><td>Casamentos</td><td>Agendamento antecipado</td></tr><tr><td>Catequese</td><td>Sáb. 8h às 10h</td></tr>
              </tbody></table>
            </div>
          </div>
          <div className="schedule-note" role="note">
            <i className="ti ti-info-circle" aria-hidden="true" />
            <span>Os horários podem ser alterados em datas festivas e feriados. Acompanhe os avisos nas redes sociais da paróquia ou entre em contato com a secretaria. <strong>Em caso de falecimento</strong>, favor ligar para o número da paróquia.</span>
          </div>
        </div>
      </section>
    </>
  );
}
