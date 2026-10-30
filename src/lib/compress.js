// ضغط الصور والفيديوهات جوّه المتصفح قبل الرفع.
import { VIDEO_PRESET } from './config'

const even = (n) => Math.max(2, Math.round(n / 2) * 2)

// ---------------------------------------------------------------- الصور
export async function compressImage(file, { maxSide, quality }) {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const { width: w0, height: h0 } = bitmap
  const scale = Math.min(1, maxSide / Math.max(w0, h0))
  const width = Math.round(w0 * scale)
  const height = Math.round(h0 * scale)

  // صورة webp أصلاً وصغيرة: مفيش داعي نضغطها تاني
  if (scale === 1 && file.type === 'image/webp' && file.size <= 400 * 1024) {
    bitmap.close()
    return { blob: file, ext: 'webp', width, height }
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const toBlob = (type, q) => new Promise((res) => canvas.toBlob(res, type, q))
  let blob = await toBlob('image/webp', quality)
  let ext = 'webp'
  if (!blob || blob.type !== 'image/webp') {
    blob = await toBlob('image/jpeg', quality) // متصفح قديم مبيدعمش webp
    ext = 'jpg'
  }
  if (!blob) throw new Error('تعذّر معالجة الصورة')
  return { blob, ext, width, height }
}

// ---------------------------------------------------------------- الفيديو
function loadVideo(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const v = document.createElement('video')
    v.preload = 'metadata'
    v.muted = true
    v.playsInline = true
    v.onloadedmetadata = () => resolve({ video: v, url })
    v.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('الفيديو ده مش مدعوم أو الملف تالف'))
    }
    v.src = url
  })
}

export async function readVideoMeta(file) {
  const { video, url } = await loadVideo(file)
  const meta = { duration: video.duration, width: video.videoWidth, height: video.videoHeight }
  URL.revokeObjectURL(url)
  return meta
}

// بيسحب صورة من الفيديو (بوستر تلقائي)
export async function makePoster(file, { maxSide, quality }) {
  const { video, url } = await loadVideo(file)
  try {
    await new Promise((resolve, reject) => {
      video.onseeked = resolve
      video.onerror = () => reject(new Error('تعذّر سحب صورة من الفيديو'))
      video.currentTime = Math.min(1, (video.duration || 2) / 2)
    })
    const scale = Math.min(1, maxSide / Math.max(video.videoWidth, video.videoHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(video.videoWidth * scale)
    canvas.height = Math.round(video.videoHeight * scale)
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/webp', quality))
    if (!blob) throw new Error('تعذّر إنشاء البوستر')
    return { blob, ext: 'webp', width: canvas.width, height: canvas.height }
  } finally {
    URL.revokeObjectURL(url)
  }
}

// بيضغط الفيديو لـ 720p تقريبًا بمعدل بيانات منخفض باستخدام WebCodecs (مكتبة mediabunny)
// بيرجّع { blob, ext, compressed }. لو الضغط فشل بيرجّع الأصلي (لو حجمه مقبول) أو بيرمي خطأ واضح.
export async function compressVideo(file, { onProgress, maxUploadBytes } = {}) {
  const meta = await readVideoMeta(file)
  const scale = Math.min(1, VIDEO_PRESET.maxSide / Math.max(meta.width, meta.height))
  const small = scale === 1 && file.size <= VIDEO_PRESET.skipIfSmallerThan

  if (small && file.type === 'video/mp4') {
    onProgress?.(1)
    return { blob: file, ext: 'mp4', compressed: false }
  }

  try {
    if (typeof VideoEncoder === 'undefined') throw new Error('no-webcodecs')
    const { Input, Output, Conversion, ALL_FORMATS, BlobSource, BufferTarget, Mp4OutputFormat } =
      await import('mediabunny')

    const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS })
    const output = new Output({ format: new Mp4OutputFormat(), target: new BufferTarget() })
    const conversion = await Conversion.init({
      input,
      output,
      video: {
        width: even(meta.width * scale),
        height: even(meta.height * scale),
        fit: 'contain',
        bitrate: VIDEO_PRESET.videoBitrate,
      },
      audio: { bitrate: VIDEO_PRESET.audioBitrate },
    })
    if (!conversion.isValid) throw new Error('invalid-conversion')
    conversion.onProgress = (p) => onProgress?.(p)
    await conversion.execute()

    const blob = new Blob([output.target.buffer], { type: 'video/mp4' })
    // لو الناتج طلع أكبر من الأصلي نستخدم الأصلي
    if (blob.size >= file.size && file.type === 'video/mp4') {
      return { blob: file, ext: 'mp4', compressed: false }
    }
    return { blob, ext: 'mp4', compressed: true }
  } catch (err) {
    console.error('Video compression failed:', err)
    const limit = maxUploadBytes ?? Infinity
    if (file.size <= limit && (file.type === 'video/mp4' || file.type === 'video/webm')) {
      return { blob: file, ext: file.type === 'video/webm' ? 'webm' : 'mp4', compressed: false, fallback: true }
    }
    throw new Error(
      'المتصفح مقدرش يضغط الفيديو ده، والملف الأصلي كبير. جرّب Chrome أو Edge، أو اضغطه بـ HandBrake الأول.',
    )
  }
}
