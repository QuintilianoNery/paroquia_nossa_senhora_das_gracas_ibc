import CrudPage from '../CrudPage'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  day_label:    z.string().min(1, 'Informe o dia'),
  time_label:   z.string().min(1, 'Informe o horário'),
  location:     z.string().optional(),
  type:         z.enum(['mass', 'office', 'sacrament']).default('mass'),
  manual_order: z.coerce.number().default(0),
  is_active:    z.boolean().default(true),
})

const TYPE_LABELS = {
  mass:      'Missa',
  office:    'Atendimento',
  sacrament: 'Sacramento',
}

function HorarioForm({ item, onSave, onCancel, saving }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: item ?? { type: 'mass', is_active: true, manual_order: 0 }
  })

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Dia / Período *</label>
          <input {...register('day_label')} className="form-input" placeholder="Ex: Domingo | Segunda a Sexta" />
          {errors.day_label && <p className="form-error">{errors.day_label.message}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Horário(s) *</label>
          <input {...register('time_label')} className="form-input" placeholder="Ex: 7h · 9h · 11h · 19h" />
          {errors.time_label && <p className="form-error">{errors.time_label.message}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Local / Comunidade</label>
          <input {...register('location')} className="form-input" placeholder="Ex: Igreja Matriz | São José" />
        </div>
        <div className="form-group">
          <label className="form-label">Tipo</label>
          <select {...register('type')} className="form-select">
            {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Ordem</label>
          <input {...register('manual_order')} type="number" className="form-input" />
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 28 }}>
          <input type="checkbox" id="is_active" {...register('is_active')} style={{ width: 18, height: 18 }} />
          <label htmlFor="is_active" style={{ fontWeight: 700, color: 'var(--text)' }}>Ativo</label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button type="submit" className="btn btn-teal" disabled={saving}>
          {saving ? 'Salvando...' : item ? 'Salvar' : 'Adicionar'}
        </button>
        <button type="button" className="btn" onClick={onCancel} style={{ background: 'var(--cream)', color: 'var(--text)' }}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

const COLUMNS = [
  { key: 'type',       label: 'Tipo',    render: v => <span className="badge badge-teal">{TYPE_LABELS[v] ?? v}</span> },
  { key: 'day_label',  label: 'Dia' },
  { key: 'time_label', label: 'Horário' },
  { key: 'location',   label: 'Local' },
  { key: 'is_active',  label: 'Status',  render: v => <span className={`badge ${v ? 'badge-green' : 'badge-gray'}`}>{v ? 'Ativo' : 'Inativo'}</span> },
]

export default function AdminHorarios() {
  return (
    <CrudPage
      table="mass_schedules"
      title="Horários"
      columns={COLUMNS}
      FormComponent={HorarioForm}
      orderBy="manual_order"
      canReorder
    />
  )
}
