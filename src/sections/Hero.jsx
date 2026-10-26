import { heroImage } from '../data/hero'
import { site } from '../data/site'
import { whatsappLink } from '../utils/whatsapp'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import Icon from '../components/ui/icons'

export default function Hero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-hero text-white">
      <div className="lanes-bg absolute inset-0 -z-10" aria-hidden="true" />
      <div className="absolute -top-32 end-0 -z-10 size-[34rem] rounded-full bg-[#22d3ee]/15 blur-3xl" aria-hidden="true" />
      <Container className="grid min-h-svh items-center gap-10 pb-16 pt-28 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pt-32">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-white/90">
            <Icon name="swim" className="text-[#22d3ee]" /> {site.role}
          </p>
          <h1 id="hero-title" className="text-5xl font-bold leading-[1.25] sm:text-6xl lg:text-7xl">
            كابتن <span className="text-[#22d3ee]">محمد صادق</span>
          </h1>
          <p className="mt-4 text-xl font-medium text-white/90 sm:text-2xl">{site.subRole}</p>
          <p className="mt-6 max-w-xl text-lg leading-9 text-white/75">{site.quote}</p>

          <ul className="mt-6 flex flex-wrap gap-3">
            {site.facts.map((fact) => (
              <li key={fact} className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
                <Icon name="check" className="text-[#22d3ee]" /> {fact}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={whatsappLink('السلام عليكم كابتن محمد، عايز أحجز حصة سباحة.')} variant="primary">
              <Icon name="whatsapp" className="text-xl" /> ابدأ مع الكابتن عبر واتساب
            </Button>
            <Button href="#gallery" variant="onDark">
              شاهد المعرض
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
          <div className="absolute -inset-3 -z-10 -rotate-3 rounded-[2rem] border-2 border-[#22d3ee]/40" aria-hidden="true" />
          <img
            src={heroImage.src}
            srcSet={heroImage.srcSet}
            sizes="(min-width: 1024px) 448px, 90vw"
            width={heroImage.width}
            height={heroImage.height}
            alt={heroImage.alt}
            fetchPriority="high"
            className="block max-h-[72svh] w-full rounded-3xl border border-white/10 object-cover shadow-2xl shadow-black/40 object-top"
          />
          <p className="absolute bottom-4 start-4 flex items-center gap-2 rounded-full bg-hero/90 px-4 py-2 text-sm font-medium">
            <span className="size-2.5 rounded-full bg-[#34d399]" aria-hidden="true" /> {site.availability}
          </p>
        </div>
      </Container>
      <div className="lane-line" aria-hidden="true" />
    </section>
  )
}
