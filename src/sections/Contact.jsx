import { useSite } from '../context/SiteContext'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import Icon from '../components/ui/icons'
import Reveal from '../components/ui/Reveal'

// شريط تواصل بسيط (بدون فورم): واتساب + اتصال + المكان + السوشيال.
export default function Contact() {
  const site = useSite()
  const { whatsappLink } = site
  const info = 'flex items-center gap-3 font-medium'
  const dot = 'grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-[#22d3ee]'
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden bg-hero py-16 text-white sm:py-24">
      <div className="lanes-bg absolute inset-0 -z-10" aria-hidden="true" />
      <div className="absolute -bottom-40 start-0 -z-10 size-[30rem] rounded-full bg-[#22d3ee]/10 blur-3xl" aria-hidden="true" />
      <Container className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
        <Reveal>
          <h2 id="contact-title" className="text-3xl font-bold leading-[1.5] sm:text-5xl">
            جاهز تنزل المية؟
            <br />
            <span className="text-[#22d3ee]">كلّم الكابتن</span> وابدأ من أول حصة.
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-9 text-white/75">
            ابعت رسالة على واتساب بهدفك وسن المتدرب، والكابتن هيرد عليك ويحدد معاك البداية.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 font-sans2">
            <Button href={whatsappLink('السلام عليكم كابتن صادق، عايز أبدأ تدريب سباحة.')} variant="primary">
              <Icon name="whatsapp" className="text-xl" /> ابعت رسالة على واتساب
            </Button>
            <Button href={`tel:${site.phone}`} variant="onDark">
              <Icon name="phone" /> <span dir="ltr">{site.phoneDisplay}</span>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
            <p className={`${info} font-sans2`}>
              <span className={dot}><Icon name="pin" /></span>
              {site.location}
            </p>
            <p className={`${info} font-sans2`}>
              <span className={dot}><Icon name="check" /></span>
              {site.availability}
            </p>
            <div className="border-t border-white/10 pt-5">
              <p className="mb-3 font-bold text-white/80 font-sans2">تابعنا على</p>
              <ul className="flex gap-3">
                {site.socials.map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="grid size-12 place-items-center rounded-full border border-white/25 text-lg transition-colors hover:bg-white/15"
                    >
                      <Icon name={s.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
