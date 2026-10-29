import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { navLinks, site } from '../../data/site'
import { useActiveSection } from '../../hooks/useActiveSection'
import { whatsappLink } from '../../utils/whatsapp'
import Button from '../ui/Button'
import Container from '../ui/Container'
import Icon from '../ui/icons'
import ThemeToggle from '../ui/ThemeToggle'

const ids = navLinks.map((l) => l.id)

function LogoMark() {
  return (
    <svg viewBox="0 0 64 64" className="size-9 shrink-0" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#061423" />
      <path d="M10 26c5 0 5-4 11-4s6 4 11 4 5-4 11-4 5 4 11 4" fill="none" stroke="#22D3EE" strokeWidth="5" strokeLinecap="round" />
      <path d="M10 40c5 0 5-4 11-4s6 4 11 4 5-4 11-4 5 4 11 4" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(ids)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // قائمة الموبايل: قفل التمرير + إغلاق بـ Esc + إغلاق لو الشاشة كبرت
  useEffect(() => {
    if (!open) return
    const lock = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const mq = window.matchMedia('(min-width: 1024px)')
    const onResize = () => mq.matches && setOpen(false)
    document.addEventListener('keydown', onKey)
    mq.addEventListener('change', onResize)
    return () => {
      document.body.style.overflow = lock
      document.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onResize)
    }
  }, [open])

  // على الصفحة الرئيسية الهيدر شفّاف فوق الـ Hero الغامق؛ في أي صفحة تانية بيكون ثابت اللون
  const solid = scrolled || open || pathname !== '/'
  const linkBase = 'rounded-full px-3 py-2 text-[16px] font-bold transition-colors'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? 'border-b border-line bg-canvas text-ink' : 'bg-transparent text-white'
      }`}
    >
      <Container className="flex h-[4.5rem] items-center justify-between gap-4">
        <a href="/#home" className="flex items-center gap-3 text-lg font-bold" onClick={() => setOpen(false)}>
          <LogoMark />
          <span>{site.shortName}</span>
        </a>

        <nav aria-label="القائمة الرئيسية" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`/#${link.id}`}
                  aria-current={active === link.id ? 'true' : undefined}
                  className={`font-sans2 ${linkBase} ${
                    active === link.id ? (solid ? 'bg-brand-soft text-brand' : 'bg-white/15') : solid ? 'hover:text-brand' : 'hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden sm:block">
            <Button
              href={whatsappLink('السلام عليكم كابتن صادق، عايز أحجز حصة سباحة.')}
              variant="primary"
              className="min-h-11! px-5! font-sans2"
            >
              <Icon name="whatsapp" className='text-lg' /> احجز الآن
            </Button>
          </div>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-current/30 text-lg xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </Container>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto bg-canvas text-ink xl:hidden">
          <nav aria-label="القائمة الرئيسية" className="mx-auto flex min-h-full max-w-md flex-col px-6 py-8">
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.id} className="border-b border-line">
                  <a
                    href={`/#${link.id}`}
                    onClick={() => setOpen(false)}
                    className={`block py-4 text-2xl font-semibold ${active === link.id ? 'text-brand' : ''}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <Button
              href={whatsappLink('السلام عليكم كابتن صادق، عايز أحجز حصة سباحة.')}
              variant="primary"
              className="mt-8 w-full font-sans2"
            >
              <Icon name="whatsapp" /> احجز حصة عبر واتساب
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
