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

function dataUrlToFile(dataUrl, folder = 'general') {
  const match = String(dataUrl).match(/^data:(image\/(?:png|jpeg|webp));base64,(.+)$/i)
  if (!match) return null

  const contentType = match[1].toLowerCase()
  const base64 = match[2]
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  const extension = contentType.split('/')[1] === 'jpeg' ? 'jpg' : contentType.split('/')[1]
  const fileName = `${folder}-${createFileId()}.${extension}`

  return new File([bytes], fileName, { type: contentType })
}

async function blobUrlToFile(blobUrl, folder = 'general') {
  const response = await fetch(blobUrl)
  if (!response.ok) return null

  const blob = await response.blob()
  const contentType = blob.type && ALLOWED_MIME_TYPES.has(blob.type) ? blob.type : 'application/octet-stream'
  if (!ALLOWED_MIME_TYPES.has(contentType)) return null

  const extension = contentType.split('/')[1] === 'jpeg' ? 'jpg' : contentType.split('/')[1]
  const fileName = `${folder}-${createFileId()}.${extension}`

  return new File([blob], fileName, { type: contentType })
}

export async function uploadMedia(file, folder = 'general') {
  if (!file) return ''

  let uploadFile = file
  if (typeof file === 'string') {
    if (file.startsWith('data:image/')) {
      uploadFile = dataUrlToFile(file, folder)
    } else if (file.startsWith('blob:')) {
      uploadFile = await blobUrlToFile(file, folder)
    }
  }

  if (!uploadFile) {
    throw new Error('Formato inválido. Use PNG, JPEG ou WEBP.')
  }

  const contentType = getContentType(uploadFile)
  if (!ALLOWED_MIME_TYPES.has(contentType)) {
    throw new Error('Formato inválido. Use PNG, JPEG ou WEBP.')
  }

  if (uploadFile.size && uploadFile.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('Arquivo muito grande. Máx 5MB.')
  }

  const safeName = uploadFile.name.replace(/[^a-zA-Z0-9._-]+/g, '_')
  const path = `${folder}/${createFileId()}-${safeName}`

  const { error: uploadError } = await supabase.storage
    .from(DEFAULT_BUCKET)
    .upload(path, uploadFile, {
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
