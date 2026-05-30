import CrudPage from '../CrudPage'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { uploadMedia } from '@lib/uploadMedia'
import ImageUploadField from '@components/ImageUploadField'

const schema = z.object({
  name:         z.string().min(2, 'Informe o nome'),
  role:         z.enum(['parochus', 'vicar', 'deacon', 'deacon_formation'], { required_error: 'Selecione o cargo' }),
  bio:          z.string().optional(),
  is_current:   z.boolean().default(true),
  list_order:   z.coerce.number().default(0),
  reg_code:     z.number().optional(),
  photo_url:    z.string().optional(),
})

const ROLE_LABELS = {
  parochus:          'Pároco',
  vicar:             'Vigário',
  deacon:            'Diácono Permanente',
  deacon_formation:  'Diácono em Formação',
}

function CleroForm({ item, onSave, onCancel, saving }) {
  const [imageFile, setImageFile] = useState(null)
  const [imageError, setImageError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: item ?? { is_current: true, list_order: 0, photo_url: '' }
  })
  const imageUrl = item?.photo_url || ''

  const submit = async (values) => {
    try {
      setImageError('')
      let uploaded = values.photo_url || ''
      if (imageFile) uploaded = await uploadMedia(imageFile, 'clergy')
      await onSave({ ...values, photo_url: uploaded })
    } catch (err) {
      setImageError(err?.message || 'Erro ao enviar a foto do clero.')
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Nome completo *</label>
          <input {...register('name')} className="form-input" placeholder="Pe. Nome Sobrenome" />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Cargo / Função *</label>
          <select {...register('role')} className="form-select">
            <option value="">Selecione...</option>
            {Object.entries(ROLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          {errors.role && <p className="form-error">{errors.role.message}</p>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Breve descrição / Biografia</label>
        <textarea {...register('bio')} className="form-textarea" style={{ height: 100 }} placeholder="Informações sobre o padre/diácono..." />
      </div>

      <ImageUploadField
        label="Foto do cadastro"
        hint="Suba uma foto para o card do clero."
        value={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
        onChange={setImageFile}
      />
      {imageError && <p className="form-error">{imageError}</p>}
      <input type="hidden" {...register('photo_url')} />

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Ordem de exibição</label>
          <input {...register('list_order')} type="number" className="form-input" />
          <div className="form-hint">A lista do clero é exibida nesta ordem. Alterar este valor reordena a lista.</div>
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 6 }}>
          <input type="checkbox" id="is_current" {...register('is_current')} style={{ width: 18, height: 18 }} />
          <label htmlFor="is_current" style={{ fontWeight: 700, color: 'var(--text)' }}>Em exercício (atual)</label>
        </div>
        <div className="form-group">
          <label className="form-label">Código de registro</label>
          <input {...register('reg_code')} type="number" className="form-input" readOnly />
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
  { key: 'name', label: 'Nome' },
  { key: 'role', label: 'Cargo', render: v => ROLE_LABELS[v] ?? v },
  { key: 'is_current', label: 'Status', render: v => (
    <span className={`badge ${v ? 'badge-green' : 'badge-gray'}`}>{v ? 'Atual' : 'Inativo'}</span>
  )},
]

export default function AdminClero() {
  return (
    <CrudPage
      table="clergy"
      title="Clero"
      columns={COLUMNS}
      FormComponent={CleroForm}
      orderBy="list_order"
      reorderField="list_order"
      searchField="name"
      canReorder
    />
  )
}
