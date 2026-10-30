// بيعمل رابط واتساب برسالة جاهزة. ده مجرد رابط: مفيش حاجة بتتبعت أو بتتحفظ من الموقع.
export function buildWhatsappLink(number, message = '') {
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${number}${text}`
}
