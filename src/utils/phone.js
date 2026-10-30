// أرقام مصر: لو الرقم بيبدأ بصفر بنحوّله للصيغة الدولية.
const digits = (v) => String(v ?? '').replace(/\D/g, '')

// رقم واتساب بصيغة دولية من غير + (مثال: 201022349414)
export function toWhatsappNumber(input) {
  let d = digits(input)
  if (d.startsWith('00')) d = d.slice(2)
  if (d.startsWith('0')) d = `20${d.slice(1)}`
  return d
}

export function isValidPhone(input) {
  const d = digits(input)
  return d.length >= 10 && d.length <= 15
}

// رابط الاتصال tel:
export function toTel(input) {
  let d = digits(input)
  if (d.startsWith('00')) d = d.slice(2)
  if (d.startsWith('0')) d = `20${d.slice(1)}`
  return `+${d}`
}
