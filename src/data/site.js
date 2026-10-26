// بيانات عامة عن الموقع والكابتن. عدّل هنا والموقع كله بيتغيّر.
export const site = {
  name: 'كابتن محمد صادق',
  shortName: 'كابتن صادق',
  role: 'مدرب سباحة ومنقذ معتمد',
  subRole: 'أخصائي تأهيل إصابات وتغذية رياضية',
  quote: 'السباحة الرياضية تدور حول التفاصيل.. وأصغر الاختلافات تصنع الفارق',
  facts: ['خريج تربية رياضية', 'خبرة في أندية وادي دجلة والداخلية'],
  whatsapp: '201022349414', // بصيغة دولية من غير + ولا صفر
  phone: '+201022349414',
  phoneDisplay: '01022349414',
  location: '6 أكتوبر، الشيخ زايد',
  availability: 'متاح للحجز الفردي والخاص',
  socials: [
    { id: 'facebook', label: 'فيسبوك', href: 'https://www.facebook.com/profile.php?id=61587606998778' },
    { id: 'instagram', label: 'إنستجرام', href: 'https://www.instagram.com/mohamedelturk' },
    { id: 'tiktok', label: 'تيك توك', href: 'https://www.tiktok.com/@captainsadek1' },
  ],
  developer: 'محمد سامي',
  year: 2026,
}

// روابط القائمة الرئيسية (id = رقم القسم في الصفحة)
export const navLinks = [
  { id: 'about', label: 'عن الكابتن' },
  { id: 'services', label: 'الخدمات' },
  { id: 'gallery', label: 'المعرض' },
  { id: 'videos', label: 'الفيديوهات' },
  { id: 'certificates', label: 'الشهادات' },
  { id: 'faq', label: 'الأسئلة الشائعة' },
]
