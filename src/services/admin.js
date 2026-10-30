// كل عمليات الداشبورد (إضافة / تعديل / حذف نهائي) على Supabase.
import { supabase } from '../lib/supabase'
import { IMAGE_PRESET, LIMITS } from '../lib/config'
import { compressImage, compressVideo, makePoster, readVideoMeta } from '../lib/compress'
import { removeFiles, uploadFile } from '../lib/storage'
import { toWhatsappNumber } from '../utils/phone'

const fail = (error) => {
  if (error) throw new Error(error.message || 'حصل خطأ غير متوقع')
}

export async function listRows(table) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  fail(error)
  return data
}

async function nextOrder(table) {
  const { data, error } = await supabase
    .from(table)
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
  fail(error)
  return (data?.[0]?.sort_order ?? -1) + 1
}

// ---------------------------------------------------------- مساحة التخزين
export async function getUsedBytes() {
  const tables = ['gallery_items', 'videos', 'certificates']
  const results = await Promise.all(tables.map((t) => supabase.from(t).select('size_bytes')))
  let total = 0
  for (const r of results) {
    fail(r.error)
    total += r.data.reduce((sum, row) => sum + (row.size_bytes || 0), 0)
  }
  return total
}

// ---------------------------------------------------------- حذف نهائي (الملف + الصف)
// الملف بيتحذف الأول؛ لو فشل مبنمسحش الصف عشان ما يفضلش ملف يتيم بياخد مساحة.
export async function deleteRow(table, row, pathKeys = []) {
  await removeFiles(pathKeys.map((k) => row[k]))
  const { error } = await supabase.from(table).delete().eq('id', row.id)
  fail(error)
}

// ---------------------------------------------------------- معرض + شهادات (صور)
// kind: 'gallery' | 'certificate'
export async function saveImageItem({ table, kind, row, fields, file, onStep }) {
  let img = null
  if (file) {
    onStep?.('جاري ضغط الصورة...')
    const c = await compressImage(file, IMAGE_PRESET[kind])
    onStep?.('جاري رفع الصورة...')
    const up = await uploadFile(table, c.blob, c.ext)
    img = { image_path: up.path, image_url: up.url, size_bytes: up.size, width: c.width, height: c.height }
  }

  onStep?.('جاري الحفظ...')
  try {
    if (row) {
      const { error } = await supabase.from(table).update({ ...fields, ...img }).eq('id', row.id)
      fail(error)
      if (img) await removeFiles([row.image_path]) // الصورة القديمة بتتحذف نهائيًا
    } else {
      const sort_order = await nextOrder(table)
      const { error } = await supabase.from(table).insert({ ...fields, ...img, sort_order })
      fail(error)
    }
  } catch (err) {
    if (img) await removeFiles([img.image_path]).catch(() => {}) // نمسح الصورة اللي اترفعت لو الحفظ فشل
    throw err
  }
}

// ---------------------------------------------------------- الفيديوهات
export async function saveVideo({ row, title, file, posterFile, onStep, onProgress }) {
  let vid = null
  let poster = null
  const uploaded = []

  try {
    if (file) {
      const meta = await readVideoMeta(file)
      if (meta.duration > LIMITS.maxVideoSeconds) {
        throw new Error(`الفيديو أطول من ${LIMITS.maxVideoSeconds} ثانية. قصّه الأول.`)
      }
      onStep?.('جاري ضغط الفيديو (ممكن ياخد وقت، سيب الصفحة مفتوحة)...')
      const c = await compressVideo(file, { onProgress, maxUploadBytes: LIMITS.maxUploadBytes })
      if (c.blob.size > LIMITS.maxUploadBytes) {
        throw new Error('الفيديو لسه كبير بعد الضغط (أكتر من 50MB). قصّه أو قلّل جودته.')
      }
      onStep?.('جاري رفع الفيديو...')
      const up = await uploadFile('videos', c.blob, c.ext)
      uploaded.push(up.path)
      vid = { video_path: up.path, video_url: up.url, size_bytes: up.size }

      if (!posterFile) {
        // بوستر تلقائي من الفيديو
        try {
          const p = await makePoster(file, IMAGE_PRESET.poster)
          const pu = await uploadFile('posters', p.blob, p.ext)
          uploaded.push(pu.path)
          poster = { poster_path: pu.path, poster_url: pu.url }
          vid.size_bytes += pu.size
        } catch (e) {
          console.warn('تعذّر إنشاء بوستر تلقائي:', e)
        }
      }
    }

    if (posterFile) {
      onStep?.('جاري رفع البوستر...')
      const p = await compressImage(posterFile, IMAGE_PRESET.poster)
      const pu = await uploadFile('posters', p.blob, p.ext)
      uploaded.push(pu.path)
      poster = { poster_path: pu.path, poster_url: pu.url }
    }

    onStep?.('جاري الحفظ...')
    if (row) {
      const update = { title, ...vid, ...poster }
      if (poster && vid) update.size_bytes = vid.size_bytes
      const { error } = await supabase.from('videos').update(update).eq('id', row.id)
      fail(error)
      const old = []
      if (vid) old.push(row.video_path)
      if (poster) old.push(row.poster_path)
      await removeFiles(old)
    } else {
      const sort_order = await nextOrder('videos')
      const { error } = await supabase.from('videos').insert({ title, ...vid, ...poster, sort_order })
      fail(error)
    }
  } catch (err) {
    await removeFiles(uploaded).catch(() => {})
    throw err
  }
}

export async function countVideos() {
  const { count, error } = await supabase.from('videos').select('id', { count: 'exact', head: true })
  fail(error)
  return count ?? 0
}

// ---------------------------------------------------------- السوشيال
export async function saveSocial({ row, platform, label, url }) {
  const payload = { platform, label: platform === 'other' ? label : null, url }
  if (row) {
    const { error } = await supabase.from('social_links').update(payload).eq('id', row.id)
    fail(error)
  } else {
    const sort_order = await nextOrder('social_links')
    const { error } = await supabase.from('social_links').insert({ ...payload, sort_order })
    fail(error)
  }
}

// ---------------------------------------------------------- بيانات التواصل
export async function getSettings() {
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
  fail(error)
  return data
}

// field: 'whatsapp' | 'phone' | 'location'
export async function saveSetting(field, value) {
  const v = field === 'whatsapp' ? toWhatsappNumber(value) : value.trim()
  const { error } = await supabase.from('site_settings').update({ [field]: v }).eq('id', 1)
  fail(error)
  return v
}
