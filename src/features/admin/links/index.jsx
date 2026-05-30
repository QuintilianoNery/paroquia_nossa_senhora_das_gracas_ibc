import CrudPage from '../CrudPage'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

/* ── LINKS ── */
const linkSchema = z.object({
  title:        z.string().min(2, 'Informe o título'),
  url:          z.string().url('URL inválida'),
  description:  z.string().optional(),
  category:     z.string().optional(),
  manual_order: z.coerce.number().default(0),
  is_active:    z.boolean().default(true),
})

export function LinkForm({ item, onSave, onCancel, saving }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(linkSchema),
    defaultValues: item ?? { is_active: true, manual_order: 0 }
  })

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <div className="form-group">
        <label className="form-label">Título *</label>
        <input {...register('title')} className="form-input" placeholder="Ex: Liturgia Diária" />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>
      <div className="form-group">
        <label className="form-label">URL *</label>
        <input {...register('url')} className="form-input" placeholder="https://..." />
        {errors.url && <p className="form-error">{errors.url.message}</p>}
        <p className="form-hint">Links externos sempre abrem em nova aba.</p>
      </div>
      <div className="form-group">
        <label className="form-label">Descrição</label>
        <input {...register('description')} className="form-input" placeholder="Breve descrição do link" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Categoria</label>
          <input {...register('category')} className="form-input" placeholder="Ex: Liturgia | Formação" />
        </div>
        <div className="form-group">
          <label className="form-label">Ordem</label>
          <input {...register('manual_order')} type="number" className="form-input" />
        </div>
      </div>
      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input type="checkbox" id="is_active" {...register('is_active')} style={{ width: 18, height: 18 }} />
        <label htmlFor="is_active" style={{ fontWeight: 700 }}>Ativo</label>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button type="submit" className="btn btn-teal" disabled={saving}>{saving ? 'Salvando...' : item ? 'Salvar' : 'Adicionar'}</button>
        <button type="button" className="btn" onClick={onCancel} style={{ background: 'var(--cream)', color: 'var(--text)' }}>Cancelar</button>
      </div>
    </form>
  )
}

export function AdminLinks() {
  return (
    <CrudPage
      table="useful_links"
      title="Links Úteis"
      columns={[
        { key: 'title',    label: 'Título' },
        { key: 'category', label: 'Categoria' },
        { key: 'url',      label: 'URL', render: v => <a href={v} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)', fontSize: 12 }}>{v?.substring(0, 40)}...</a> },
        { key: 'is_active', label: 'Status', render: v => <span className={`badge ${v ? 'badge-green' : 'badge-gray'}`}>{v ? 'Ativo' : 'Inativo'}</span> },
      ]}
      FormComponent={LinkForm}
      orderBy="manual_order"
      searchField="title"
      canReorder
    />
  )
}

/* ── PASTORAIS ── */
const pastoralSchema = z.object({
  title:        z.string().min(2, 'Informe o título'),
  description:  z.string().optional(),
  manual_order: z.coerce.number().default(0),
  is_active:    z.boolean().default(true),
})

export function PastoralForm({ item, onSave, onCancel, saving }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(pastoralSchema),
    defaultValues: item ?? { is_active: true, manual_order: 0 }
  })

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <div className="form-group">
        <label className="form-label">Título *</label>
        <input {...register('title')} className="form-input" placeholder="Ex: Pastoral da Criança" />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>
      <div className="form-group">
        <label className="form-label">Descrição</label>
        <textarea {...register('description')} className="form-textarea" style={{ height: 100 }} placeholder="Descreva a pastoral ou movimento..." />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Ordem</label>
          <input {...register('manual_order')} type="number" className="form-input" />
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 28 }}>
          <input type="checkbox" id="is_active" {...register('is_active')} style={{ width: 18, height: 18 }} />
          <label htmlFor="is_active" style={{ fontWeight: 700 }}>Ativo</label>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button type="submit" className="btn btn-teal" disabled={saving}>{saving ? 'Salvando...' : item ? 'Salvar' : 'Adicionar'}</button>
        <button type="button" className="btn" onClick={onCancel} style={{ background: 'var(--cream)', color: 'var(--text)' }}>Cancelar</button>
      </div>
    </form>
  )
}

export function AdminPastorais() {
  return (
    <CrudPage
      table="pastorals"
      title="Pastorais e Movimentos"
      columns={[
        { key: 'title',       label: 'Título' },
        { key: 'description', label: 'Descrição', render: v => v?.substring(0, 60) + (v?.length > 60 ? '...' : '') },
        { key: 'is_active',   label: 'Status', render: v => <span className={`badge ${v ? 'badge-green' : 'badge-gray'}`}>{v ? 'Ativo' : 'Inativo'}</span> },
      ]}
      FormComponent={PastoralForm}
      orderBy="manual_order"
      searchField="title"
      canReorder
    />
  )
}
