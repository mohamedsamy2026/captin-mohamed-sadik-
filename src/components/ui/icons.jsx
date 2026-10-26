import {
  FaWhatsapp,
  FaPhone,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaBars,
  FaXmark,
  FaSun,
  FaMoon,
  FaPersonSwimming,
  FaLifeRing,
  FaKitMedical,
  FaLeaf,
  FaGraduationCap,
  FaMedal,
  FaUserDoctor,
  FaLocationDot,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaMinus,
  FaMagnifyingGlassPlus,
  FaPaperPlane,
  FaImages,
  FaVideo,
  FaCertificate,
  FaCircleCheck,
} from 'react-icons/fa6'

// الأسماء النصّية دي هي اللي بتتحط في فولدر data (وبعدين في قاعدة البيانات)
const map = {
  whatsapp: FaWhatsapp,
  phone: FaPhone,
  facebook: FaFacebookF,
  instagram: FaInstagram,
  tiktok: FaTiktok,
  menu: FaBars,
  close: FaXmark,
  sun: FaSun,
  moon: FaMoon,
  swim: FaPersonSwimming,
  rescue: FaLifeRing,
  rehab: FaKitMedical,
  leaf: FaLeaf,
  graduation: FaGraduationCap,
  medal: FaMedal,
  doctor: FaUserDoctor,
  pin: FaLocationDot,
  prev: FaChevronRight, // في الـ RTL "السابق" ناحية اليمين
  next: FaChevronLeft,
  plus: FaPlus,
  minus: FaMinus,
  zoom: FaMagnifyingGlassPlus,
  send: FaPaperPlane,
  images: FaImages,
  video: FaVideo,
  certificate: FaCertificate,
  check: FaCircleCheck,
}

export default function Icon({ name, className = '', ...rest }) {
  const Component = map[name]
  if (!Component) return null
  return <Component aria-hidden="true" focusable="false" className={className} {...rest} />
}
