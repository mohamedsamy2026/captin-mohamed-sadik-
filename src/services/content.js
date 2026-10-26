// طبقة الوصول للبيانات.
// دلوقتي بترجّع بيانات تجريبية ثابتة من فولدر data. لما نربط Supabase بعدين
// هنغيّر جوّه الدوال دي بس (fetch أو supabase.from(...)) والمكونات متتغيّرش.
import { about } from '../data/about'
import { services } from '../data/services'
import { methodSteps } from '../data/method'
import { galleryGroups } from '../data/gallery'
import { videos } from '../data/videos'
import { certificates } from '../data/certificates'
import { faqs } from '../data/faqs'

const resolve = (value) => Promise.resolve(value)

export const getAbout = () => resolve(about)
export const getServices = () => resolve(services)
export const getMethodSteps = () => resolve(methodSteps)
export const getGalleryGroups = () => resolve(galleryGroups)
export const getVideos = () => resolve(videos)
export const getCertificates = () => resolve(certificates)
export const getFaqs = () => resolve(faqs)
