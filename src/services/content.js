// طبقة الوصول للبيانات (الجزء العام من الموقع).
// - لو مفاتيح Supabase موجودة في .env: بتقرا من قاعدة البيانات.
// - لو مش موجودة: بترجّع البيانات الثابتة من فولدر data (مفيد وقت التطوير).
import { supabase } from '../lib/supabase'
import { about } from '../data/about'
import { services } from '../data/services'
import { methodSteps } from '../data/method'
import { galleryGroups as staticGallery } from '../data/gallery'
import { videos as staticVideos } from '../data/videos'
import { certificates as staticCertificates } from '../data/certificates'
import { faqs } from '../data/faqs'
import { site } from '../data/site'
import { platformById } from '../data/socialPlatforms'

const resolve = (value) => Promise.resolve(value)

async function select(table) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export const getAbout = () => resolve(about)
export const getServices = () => resolve(services)
export const getMethodSteps = () => resolve(methodSteps)
export const getFaqs = () => resolve(faqs)

export const GALLERY_GROUPS = [
  { id: 'trainees', title: 'مع المتدربين' },
  { id: 'events', title: 'من الفعاليات والميدان' },
]

export async function getGalleryGroups() {
  if (!supabase) return staticGallery
  const rows = await select('gallery_items')
  return GALLERY_GROUPS.map((g) => ({
    ...g,
    items: rows
      .filter((r) => r.group_key === g.id)
      .map((r) => ({
        id: r.id,
        src: r.image_url,
        width: r.width,
        height: r.height,
        alt: r.alt || r.caption,
        caption: r.caption,
      })),
  }))
}

export async function getVideos() {
  if (!supabase) return staticVideos
  const rows = await select('videos')
  return rows.map((r) => ({ id: r.id, title: r.title, src: r.video_url, poster: r.poster_url }))
}

export async function getCertificates() {
  if (!supabase) return staticCertificates
  const rows = await select('certificates')
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    src: r.image_url,
    width: r.width,
    height: r.height,
    alt: `صورة ${r.title}`,
  }))
}

// بيانات التواصل + السوشيال (بتستخدمها كل أماكن الموقع من SiteContext)
export async function getContactInfo() {
  const fallback = {
    whatsapp: site.whatsapp,
    phone: site.phoneDisplay,
    location: site.location,
    socials: site.socials.map((s) => ({ id: s.id, icon: s.id, label: s.label, href: s.href })),
  }
  if (!supabase) return fallback

  const [settings, links] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
    select('social_links'),
  ])
  if (settings.error) throw settings.error
  const s = settings.data
  return {
    whatsapp: s?.whatsapp ?? fallback.whatsapp,
    phone: s?.phone ?? fallback.phone,
    location: s?.location ?? fallback.location,
    socials: links.map((l) => {
      const p = platformById(l.platform)
      return { id: l.id, icon: p.icon, label: l.platform === 'other' ? l.label || 'رابط' : p.label, href: l.url }
    }),
  }
}
