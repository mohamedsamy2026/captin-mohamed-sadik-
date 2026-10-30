// زر "استيراد": بينقل المحتوى الموجود في الموقع (فولدر data + public) إلى Supabase مرة واحدة.
// آمن لو اتشغّل تاني: اللي اترفع قبل كده بيتخطّاه (عن طريق source_key).
import { supabase } from './supabase'
import { IMAGE_PRESET, LIMITS } from './config'
import { compressImage, compressVideo, makePoster } from './compress'
import { uploadFile, removeFiles } from './storage'
import { galleryGroups } from '../data/gallery'
import { videos } from '../data/videos'
import { certificates } from '../data/certificates'
import { site } from '../data/site'

// بيحمّل ملف من الموقع نفسه ويتأكد إنه فعلاً صورة/فيديو (لأن Vite بيرجّع index.html لو الملف مش موجود)
async function fetchMedia(url, kind) {
  const res = await fetch(url)
  const blob = res.ok ? await res.blob() : null
  if (!blob || !blob.type.startsWith(`${kind}/`)) {
    throw new Error(`الملف مش موجود: ${url}`)
  }
  return blob
}

const insert = async (table, row) => {
  const { error } = await supabase.from(table).insert(row)
  if (error) throw new Error(error.message)
}

async function existingKeys(table) {
  const { data, error } = await supabase.from(table).select('source_key').not('source_key', 'is', null)
  if (error) throw new Error(error.message)
  return new Set(data.map((r) => r.source_key))
}

// onProgress({ done, total, label })
export async function runImport(onProgress) {
  const [gKeys, cKeys, vKeys, sKeys] = await Promise.all(
    ['gallery_items', 'certificates', 'videos', 'social_links'].map(existingKeys),
  )

  const galleryItems = galleryGroups.flatMap((g) => g.items.map((it) => ({ ...it, group: g.id })))
  const jobs = []

  galleryItems.forEach((it, i) =>
    jobs.push({
      key: `gallery:${it.id}`,
      skip: gKeys,
      label: `صورة: ${it.caption}`,
      run: async () => {
        const c = await compressImage(await fetchMedia(it.src, 'image'), IMAGE_PRESET.gallery)
        const up = await uploadFile('gallery_items', c.blob, c.ext)
        try {
          await insert('gallery_items', {
            group_key: it.group, caption: it.caption, alt: it.alt, image_path: up.path, image_url: up.url,
            width: c.width, height: c.height, size_bytes: up.size, sort_order: i, source_key: `gallery:${it.id}`,
          })
        } catch (e) { await removeFiles([up.path]).catch(() => {}); throw e }
      },
    }),
  )

  certificates.forEach((it, i) =>
    jobs.push({
      key: `cert:${it.id}`,
      skip: cKeys,
      label: `شهادة: ${it.title}`,
      run: async () => {
        const c = await compressImage(await fetchMedia(it.src, 'image'), IMAGE_PRESET.certificate)
        const up = await uploadFile('certificates', c.blob, c.ext)
        try {
          await insert('certificates', {
            title: it.title, image_path: up.path, image_url: up.url, width: c.width, height: c.height,
            size_bytes: up.size, sort_order: i, source_key: `cert:${it.id}`,
          })
        } catch (e) { await removeFiles([up.path]).catch(() => {}); throw e }
      },
    }),
  )

  videos.forEach((it, i) =>
    jobs.push({
      key: `video:${it.id}`,
      skip: vKeys,
      label: `فيديو: ${it.title}`,
      run: async () => {
        const original = await fetchMedia(it.src, 'video')
        const c = await compressVideo(original, { maxUploadBytes: LIMITS.maxUploadBytes })
        const uploaded = []
        try {
          const v = await uploadFile('videos', c.blob, c.ext)
          uploaded.push(v.path)
          let size = v.size
          let poster = null
          try {
            const pb = await fetchMedia(it.poster, 'image')
            const p = await compressImage(pb, IMAGE_PRESET.poster)
            poster = await uploadFile('posters', p.blob, p.ext)
          } catch {
            const p = await makePoster(original, IMAGE_PRESET.poster) // مفيش بوستر جاهز: نسحب واحد من الفيديو
            poster = await uploadFile('posters', p.blob, p.ext)
          }
          uploaded.push(poster.path)
          size += poster.size
          await insert('videos', {
            title: it.title, video_path: v.path, video_url: v.url, poster_path: poster.path,
            poster_url: poster.url, size_bytes: size, sort_order: i, source_key: `video:${it.id}`,
          })
        } catch (e) { await removeFiles(uploaded).catch(() => {}); throw e }
      },
    }),
  )

  site.socials.forEach((it, i) =>
    jobs.push({
      key: `social:${it.id}`,
      skip: sKeys,
      label: `سوشيال: ${it.label}`,
      run: () => insert('social_links', { platform: it.id, url: it.href, sort_order: i, source_key: `social:${it.id}` }),
    }),
  )

  const total = jobs.length
  const errors = []
  let done = 0
  for (const job of jobs) {
    onProgress?.({ done, total, label: job.label })
    if (!job.skip.has(job.key)) {
      try {
        await job.run()
      } catch (e) {
        errors.push(`${job.label} ← ${e.message}`)
      }
    }
    done += 1
  }
  onProgress?.({ done, total, label: 'خلص' })

  // مبنقفلش الزر غير لو كل حاجة اترفعت؛ غير كده تقدر تعيد المحاولة (اللي اترفع مش هيتكرر)
  if (errors.length === 0) {
    const { error } = await supabase.from('site_settings').update({ imported: true }).eq('id', 1)
    if (error) throw new Error(error.message)
  }
  return { errors }
}
