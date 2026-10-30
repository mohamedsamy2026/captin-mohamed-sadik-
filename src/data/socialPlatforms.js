// قايمة المنصات اللي بتظهر في الداشبورد. icon لازم يكون اسم موجود في components/ui/icons.jsx
export const PLATFORMS = [
  { id: 'facebook', label: 'فيسبوك', icon: 'facebook', placeholder: 'https://www.facebook.com/...' },
  { id: 'instagram', label: 'إنستجرام', icon: 'instagram', placeholder: 'https://www.instagram.com/...' },
  { id: 'tiktok', label: 'تيك توك', icon: 'tiktok', placeholder: 'https://www.tiktok.com/@...' },
  { id: 'youtube', label: 'يوتيوب', icon: 'youtube', placeholder: 'https://www.youtube.com/@...' },
  { id: 'x', label: 'إكس (تويتر)', icon: 'x', placeholder: 'https://x.com/...' },
  { id: 'snapchat', label: 'سناب شات', icon: 'snapchat', placeholder: 'https://www.snapchat.com/add/...' },
  { id: 'telegram', label: 'تيليجرام', icon: 'telegram', placeholder: 'https://t.me/...' },
  { id: 'linkedin', label: 'لينكد إن', icon: 'linkedin', placeholder: 'https://www.linkedin.com/in/...' },
  { id: 'pinterest', label: 'بينترست', icon: 'pinterest', placeholder: 'https://www.pinterest.com/...' },
  { id: 'other', label: 'أخرى', icon: 'globe', placeholder: 'https://...' },
]

export const platformById = (id) => PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[PLATFORMS.length - 1]
