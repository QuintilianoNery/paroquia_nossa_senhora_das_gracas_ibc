import CrudPage from '../CrudPage'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import slugify from 'slugify'
import { format } from 'date-fns'
import { uploadMedia } from '@lib/uploadMedia'
import ImageUploadField from '@components/ImageUploadField'

const schema = z.object({
  title:        z.string().min(3, 'Informe o título'),
  slug:         z.string().min(3, 'Informe o slug'),
  summary:      z.string().max(280, 'Máximo 280 caracteres').optional(),
  content:      z.string().min(10, 'Informe o conteúdo'),
  published_at: z.string().optional(),
  is_published: z.boolean().default(false),
  image_url:    z.string().optional(),
})

function NoticiaForm({ item, onSave, onCancel, saving }) {
  const [imageFile, setImageFile] = useState(null)
  const [imageError, setImageError] = useState('')
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: item ? {
      ...item,
      published_at: item.published_at ? format(new Date(item.published_at), "yyyy-MM-dd'T'HH:mm") : '',
    } : {
      is_published: false,
      published_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      image_url: '',
    }
  })
  const imageUrl = watch('image_url') || item?.image_url || ''

  const title = watch('title')
  const autoSlug = () => {
    if (!item) setValue('slug', slugify(title || '', { lower: true, strict: true }))
  }

  const submit = async (values) => {
    try {
      setImageError('')
      let uploaded = values.image_url || ''
      if (imageFile) uploaded = await uploadMedia(imageFile, 'news')
      await onSave({ ...values, image_url: uploaded })
    } catch (err) {
      setImageError(err?.message || 'Erro ao enviar a imagem da notícia.')
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="form-group">
        <label className="form-label">Título *</label>
        <input {...register('title')} className="form-input" onBlur={autoSlug} placeholder="Título da notícia" />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Slug (URL) *</label>
        <input {...register('slug')} className="form-input" placeholder="titulo-da-noticia" />
        {errors.slug && <p className="form-error">{errors.slug.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Resumo <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>(exibido na listagem)</span></label>
        <textarea {...register('summary')} className="form-textarea" style={{ height: 80 }} placeholder="Resumo curto da notícia (máx. 280 caracteres)..." />
        {errors.summary && <p className="form-error">{errors.summary.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Conteúdo completo *</label>
        <textarea {...register('content')} className="form-textarea" style={{ height: 240 }} placeholder="Conteúdo completo da notícia..." />
        {errors.content && <p className="form-error">{errors.content.message}</p>}
      </div>

      <ImageUploadField
        label="Imagem da notícia"
        hint="Suba uma imagem para aparecer nos cards da notícia."
        value={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
        onChange={setImageFile}
      />
      {imageError && <p className="form-error">{imageError}</p>}
      <input type="hidden" {...register('image_url')} />

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Data de publicação</label>
          <input {...register('published_at')} type="datetime-local" className="form-input" />
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 28 }}>
          <input type="checkbox" id="is_published" {...register('is_published')} style={{ width: 18, height: 18 }} />
          <label htmlFor="is_published" style={{ fontWeight: 700, color: 'var(--text)' }}>Publicado</label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button type="submit" className="btn btn-teal" disabled={saving}>
          {saving ? 'Salvando...' : item ? 'Salvar alterações' : 'Criar notícia'}
        </button>
        <button type="button" className="btn" onClick={onCancel} style={{ background: 'var(--cream)', color: 'var(--text)' }}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

const COLUMNS = [
  { key: 'title',         label: 'Título' },
  { key: 'published_at',  label: 'Data', render: v => {
    const d = v ? new Date(v) : null
    return d && !Number.isNaN(d.getTime()) ? format(d, 'dd/MM/yyyy') : '—'
  }},
  { key: 'is_published',  label: 'Status', render: v => (
    <span className={`badge ${v ? 'badge-green' : 'badge-gray'}`}>{v ? 'Publicado' : 'Rascunho'}</span>
  )},
]

export default function AdminNoticias() {
  return (
    <CrudPage
      table="news"
      title="Notícias"
      columns={COLUMNS}
      FormComponent={NoticiaForm}
      orderBy="published_at"
      searchField="title"
    />
  )
}
