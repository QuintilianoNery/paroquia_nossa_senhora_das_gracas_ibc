import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@lib/supabase'
import { uploadMedia } from '@lib/uploadMedia'
import ImageUploadField from '@components/ImageUploadField'

export default function AdminParoquia() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState(null)
  const [imageFile, setImageFile] = useState(null)

  const { register, handleSubmit, reset, watch, setValue } = useForm()
  const imageUrl = watch('image_url')

  useEffect(() => {
    supabase.from('parish_profile').select('*').single().then(({ data }) => {
      if (data) reset(data)
      setLoading(false)
    })
  }, [reset])

  const onSubmit = async (values) => {
    setSaving(true); setSuccess(false); setError(null)
    try {
      let image_url = values.image_url || ''
      if (imageFile) {
        image_url = await uploadMedia(imageFile, 'parish')
        setValue('image_url', image_url)
      }

      const { error } = await supabase.from('parish_profile').upsert({ id: 1, ...values, image_url })
      if (error) throw error
      setSuccess(true)
      navigate('/admin')
    } catch (err) {
      setError(err?.message || 'Erro ao salvar a imagem da paróquia.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Carregando...</p>

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--teal-xdark)', fontSize: '1.75rem', marginBottom: '1.5rem' }}>
        História da Paróquia
      </h1>

      {success && <div className="alert alert-success" style={{ marginBottom: 20 }}><i className="ti ti-check"></i>Salvo com sucesso!</div>}
      {error   && <div className="alert alert-error"   style={{ marginBottom: 20 }}><i className="ti ti-alert-circle"></i>{error}</div>}

      <div className="card" style={{ maxWidth: 720 }}>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label">Título da seção</label>
              <input {...register('title')} className="form-input" placeholder="Ex: Nossa História" />
            </div>

            <div className="form-group">
              <label className="form-label">Conteúdo / História</label>
              <textarea {...register('content')} className="form-textarea" style={{ height: 260 }}
                placeholder="Conte a história da paróquia..." />
            </div>

            <ImageUploadField
              label="Imagem da Paróquia"
              hint="Suba uma imagem que representará a paróquia na página pública."
              value={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
              onChange={setImageFile}
            />
            <input type="hidden" {...register('image_url')} />

            <div className="form-group">
              <label className="form-label">Endereço</label>
              <input {...register('address')} className="form-input" placeholder="Rua Domingos Alcino Dadalto, 114 — Jardim Itapemirim" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Latitude</label>
                <input {...register('latitude')} className="form-input" placeholder="-20.8413" />
              </div>
              <div className="form-group">
                <label className="form-label">Longitude</label>
                <input {...register('longitude')} className="form-input" placeholder="-41.1134" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Link Google Maps</label>
              <input {...register('google_maps_url')} className="form-input" placeholder="https://maps.google.com/..." />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Telefone</label>
                <input {...register('phone')} className="form-input" placeholder="(28) 3517-7296" />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp</label>
                <input {...register('whatsapp')} className="form-input" placeholder="(28) 99900-0000" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input {...register('email')} type="email" className="form-input" placeholder="secretaria@paroquiansgracas.org.br" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Facebook (URL)</label>
                <input {...register('social_facebook')} className="form-input" placeholder="https://facebook.com/..." />
              </div>
              <div className="form-group">
                <label className="form-label">Instagram (URL)</label>
                <input {...register('social_instagram')} className="form-input" placeholder="https://instagram.com/..." />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">YouTube (URL)</label>
                <input {...register('social_youtube')} className="form-input" placeholder="https://youtube.com/..." />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp link</label>
                <input {...register('social_whatsapp')} className="form-input" placeholder="https://wa.me/55..." />
              </div>
            </div>

            <button type="submit" className="btn btn-teal" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar informações'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
