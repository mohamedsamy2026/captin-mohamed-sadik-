// حدود وإعدادات الرفع. عدّلها من هنا.
export const BUCKET = 'media'

export const LIMITS = {
  maxVideos: 18, // أقصى عدد فيديوهات
  maxVideoSeconds: 150, // أقصى مدة للفيديو الواحد (ثواني)
  storageBytes: 1024 * 1024 * 1024, // مساحة Supabase المجانية (1GB)
  maxUploadBytes: 50 * 1024 * 1024, // أقصى حجم ملف في Supabase المجاني (50MB)
}

// إعدادات الضغط
export const IMAGE_PRESET = {
  gallery: { maxSide: 1400, quality: 0.8 },
  certificate: { maxSide: 1600, quality: 0.85 }, // الشهادات محتاجة وضوح للكتابة
  poster: { maxSide: 720, quality: 0.8 },
}

export const VIDEO_PRESET = {
  maxSide: 1280, // 720p
  videoBitrate: 1_400_000, // ~1.4 Mbps => الدقيقة حوالي 10MB
  audioBitrate: 96_000,
  skipIfSmallerThan: 8 * 1024 * 1024, // لو الفيديو أصغر من كده وأبعاده صغيرة مش بنضغطه تاني
}
