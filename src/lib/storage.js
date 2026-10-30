import { supabase } from './supabase'
import { BUCKET } from './config'

const rand = () => Math.random().toString(36).slice(2, 8)

// بيرفع ملف ويرجّع { path, url, size }
export async function uploadFile(folder, blob, ext) {
  const path = `${folder}/${Date.now()}-${rand()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: blob.type || undefined,
    cacheControl: '31536000',
  })
  if (error) throw new Error(`فشل الرفع: ${error.message}`)
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { path, url: data.publicUrl, size: blob.size }
}

// حذف نهائي من المخزن
export async function removeFiles(paths) {
  const list = paths.filter(Boolean)
  if (list.length === 0) return
  const { error } = await supabase.storage.from(BUCKET).remove(list)
  if (error) throw new Error(`فشل حذف الملف: ${error.message}`)
}
