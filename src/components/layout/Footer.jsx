import { useSite } from '../../context/SiteContext'
import Container from '../ui/Container'
import Icon from '../ui/icons'

export default function Footer() {
  const site = useSite()
  const { whatsappLink } = site
  const circle = 'grid size-11 place-items-center rounded-full border border-white/25 text-lg text-white transition-colors hover:bg-white/15'
  return (
    <footer className="bg-hero text-white">
      <div className="lane-line" aria-hidden="true" />
      <Container className="flex flex-col items-center gap-6 py-12 text-center sm:flex-row sm:justify-between sm:text-start">
        <div className="flex items-center gap-4">
          <img
            src="/images/brand/logo-circle.webp"
            alt=""
            width="64"
            height="64"
            loading="lazy"
            className="size-16 rounded-full"
          />
          <div>
            <p className="text-xl font-bold">{site.name}</p>
            <p className="text-white/70">{site.role}</p>
          </div>
        </div>

        <ul className="flex items-center gap-3" aria-label="روابط التواصل">
          <li>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="واتساب" className={circle}>
              <Icon name="whatsapp" />
            </a>
          </li>
          <li>
            <a href={`tel:${site.phone}`} aria-label={`اتصال: ${site.phoneDisplay}`} className={circle}>
              <Icon name="phone" />
            </a>
          </li>
          {site.socials.map((s) => (
            <li key={s.id}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className={circle}>
                <Icon name={s.icon} />
              </a>
            </li>
          ))}
        </ul>
      </Container>
      <div className="border-t border-white/10 py-5 text-center font-bold text-md text-white/70 font-sans2">
        <Container>
          تم التطوير بواسطة <span className="font-semibold text-white">{site.developer}</span> © {site.year}
        </Container>
      </div>
    </footer>
  )
}
