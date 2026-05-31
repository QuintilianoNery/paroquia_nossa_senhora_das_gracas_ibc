import { supabase } from '@lib/supabase'

const DEFAULT_BUCKET = 'site-images'
const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
const MIME_BY_EXTENSION = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
}

function getFileExtension(fileName = '') {
  const parts = fileName.toLowerCase().split('.')
  return parts.length > 1 ? parts.pop() : ''
}

function getContentType(file) {
  if (file?.type && ALLOWED_MIME_TYPES.has(file.type)) return file.type
  const ext = getFileExtension(file?.name)
  return MIME_BY_EXTENSION[ext] ?? 'application/octet-stream'
}

function createFileId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export async function uploadMedia(file, folder = 'general') {
  if (!file) return ''

  const contentType = getContentType(file)
  if (!ALLOWED_MIME_TYPES.has(contentType)) {
    throw new Error('Formato inválido. Use PNG, JPEG ou WEBP.')
  }

  if (file.size && file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('Arquivo muito grande. Máx 5MB.')
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '_')
  const path = `${folder}/${createFileId()}-${safeName}`

  const { error: uploadError } = await supabase.storage
    .from(DEFAULT_BUCKET)
    .upload(path, file, {
      upsert: true,
      cacheControl: '3600',
      contentType,
    })

  if (uploadError) {
    if (uploadError?.message?.includes('Bucket not found')) {
      throw new Error('Bucket de imagens não encontrado no Supabase. Execute a migration 007 para criar o bucket site-images.')
    }
    throw uploadError
  }

  const { data } = supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
