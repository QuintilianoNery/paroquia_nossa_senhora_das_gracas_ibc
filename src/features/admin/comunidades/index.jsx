import CrudPage from '../CrudPage'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import slugify from 'slugify'
import { uploadMedia } from '@lib/uploadMedia'
import ImageUploadField from '@components/ImageUploadField'

const schema = z.object({
  name:            z.string().min(2, 'Informe o nome'),
  slug:            z.string().min(2, 'Informe o slug'),
  history:         z.string().optional(),
  address:         z.string().optional(),
  google_maps_url: z.string().url('URL inválida').optional().or(z.literal('')),
  latitude:        z.string().optional(),
  longitude:       z.string().optional(),
  is_published:    z.boolean().default(true),
  manual_order:    z.coerce.number().default(0),
  image_url:       z.string().optional(),
})

function ComunidadeForm({ item, onSave, onCancel, saving }) {
  const [imageFile, setImageFile] = useState(null)
  const [imageError, setImageError] = useState('')
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: item ? {
      ...item,
      is_published: item.is_published ?? true,
      google_maps_url: item.google_maps_url ?? '',
    } : { is_published: true, manual_order: 0, image_url: '' }
  })
  const imageUrl = watch('image_url')

  const name = watch('name')
  const autoSlug = () => {
    if (!watch('slug')) setValue('slug', slugify(name || '', { lower: true, strict: true }))
  }

  const submit = async (values) => {
    try {
      setImageError('')
      let uploaded = values.image_url || ''
      if (imageFile) uploaded = await uploadMedia(imageFile, 'communities')

      const payload = { ...values }
      if (uploaded) payload.image_url = uploaded
      else delete payload.image_url

      await onSave(payload)
    } catch (err) {
      setImageError(err?.message || 'Erro ao enviar a imagem da comunidade.')
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Nome *</label>
          <input {...register('name')} className="form-input" onBlur={autoSlug} placeholder="Ex: São José" />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Slug (URL) *</label>
          <input {...register('slug')} className="form-input" placeholder="ex: sao-jose" />
          {errors.slug && <p className="form-error">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">História / Descrição</label>
        <textarea {...register('history')} className="form-textarea" placeholder="Conte a história da comunidade..." style={{ height: 140 }} />
      </div>

      <div className="form-group">
        <label className="form-label">Endereço</label>
        <input {...register('address')} className="form-input" placeholder="Rua, número, bairro, cidade/ES" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Latitude</label>
          <input {...register('latitude')} className="form-input" placeholder="-20.8413..." />
        </div>
        <div className="form-group">
          <label className="form-label">Longitude</label>
          <input {...register('longitude')} className="form-input" placeholder="-41.1134..." />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Link Google Maps</label>
        <input {...register('google_maps_url')} className="form-input" placeholder="https://maps.google.com/..." />
        {errors.google_maps_url && <p className="form-error">{errors.google_maps_url.message}</p>}
        <p className="form-hint">Cole o link "Compartilhar" do Google Maps.</p>
      </div>

      <ImageUploadField
        label="Imagem da Comunidade"
        hint="Suba uma imagem da comunidade para substituir o banner fixo."
        value={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
        onChange={setImageFile}
      />
      {imageError && <p className="form-error">{imageError}</p>}
      <input type="hidden" {...register('image_url')} />

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Ordem manual</label>
          <input {...register('manual_order')} type="number" className="form-input" />
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 28 }}>
          <input type="checkbox" id="is_published" {...register('is_published')} style={{ width: 18, height: 18 }} />
          <label htmlFor="is_published" style={{ fontWeight: 700, color: 'var(--text)' }}>Publicado</label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button type="submit" className="btn btn-teal" disabled={saving}>
          {saving ? 'Salvando...' : item ? 'Salvar alterações' : 'Criar comunidade'}
        </button>
        <button type="button" className="btn" onClick={onCancel} style={{ background: 'var(--cream)', color: 'var(--text)' }}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

const COLUMNS = [
  { key: 'name',         label: 'Nome' },
  { key: 'slug',         label: 'Slug' },
  { key: 'address',      label: 'Endereço' },
  { key: 'is_published', label: 'Status', render: v => (
    <span className={`badge ${v ? 'badge-green' : 'badge-gray'}`}>{v ? 'Publicado' : 'Rascunho'}</span>
  )},
]

export default function AdminComunidades() {
  return (
    <CrudPage
      table="communities"
      title="Comunidades"
      columns={COLUMNS}
      FormComponent={ComunidadeForm}
      orderBy="manual_order"
      searchField="name"
      canReorder
    />
  )
}
