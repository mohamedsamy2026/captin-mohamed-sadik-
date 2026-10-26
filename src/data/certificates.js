// العناوين اتكتبت من محتوى الشهادات نفسها (مش من أسماء الملفات).
const cert = (id, file, title, width, height) => ({
  id,
  title,
  src: `/images/certificates/${file}.webp`,
  width,
  height,
  alt: `صورة ${title}`,
})

export const certificates = [
  cert('swimming-teacher', 'rescue-card', 'بطاقة معلم سباحة', 433, 576),
  cert('university', 'graduation', 'بكالوريوس التربية الرياضية، جامعة بني سويف', 433, 576),
  cert('personal-trainer-1', 'rehab1', 'شهادة المدرب الشخصي وإصابات الملاعب (2023)', 433, 576),
  cert('personal-trainer-2', 'rehab2', 'شهادة المدرب الشخصي وتأهيل الإصابات (2023)', 576, 433),
  cert('nutrition-en', 'nutrition1', 'دبلومة التغذية العلاجية وتغذية الرياضيين (2021)', 576, 433),
  cert('nutrition-ar', 'nutrition2', 'دبلومة التغذية، الشهادة العربية (2021)', 576, 433),
  cert('cupping-massage', 'massage', 'شهادة دورة الحجامة والتدليك', 576, 402),
  cert('coach-workshop', 'degla-experience', 'شهادة حضور ورشة إعداد المدربين (مايو 2024)', 577, 433),
  cert('e-marketing', 'shop', 'شهادة برنامج التسويق الإلكتروني (2023)', 576, 433),
]
