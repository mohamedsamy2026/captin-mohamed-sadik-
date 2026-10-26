import { whatsappLink } from '../../utils/whatsapp'
import Icon from '../ui/icons'

// زر واتساب ثابت. مكانه تحت على الشمال (عكس اتجاه القراءة) عشان ما يغطيش المحتوى.
export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink('السلام عليكم كابتن محمد، عايز أستفسر عن التدريب.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل مع الكابتن عبر واتساب"
      className="fixed bottom-4 end-4 z-40 grid size-14 place-items-center rounded-full bg-wa text-3xl text-white transition-transform hover:scale-105 focus-visible:scale-105 motion-reduce:transition-none"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <Icon name="whatsapp" />
    </a>
  )
}
