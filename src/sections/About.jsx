import { getAbout } from '../services/content'
import { useAsync } from '../hooks/useAsync'
import AsyncContent from '../components/ui/AsyncContent'
import Icon from '../components/ui/icons'
import Reveal from '../components/ui/Reveal'
import Section from '../components/ui/Section'

export default function About() {
  const query = useAsync(getAbout)
  return (
    <Section id="about" eyebrow="عن الكابتن" title="العلم والخبرة جوّه المياه">
      <AsyncContent
        query={query}
        empty={{ icon: 'graduation', title: 'نبذة الكابتن هتتضاف قريبًا' }}
        skeleton={<div aria-hidden="true" className="h-80 animate-pulse rounded-3xl bg-line/60" />}
      >
        {(about) => (
          <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <img
                src={about.image.src}
                srcSet={about.image.srcSet}
                sizes="(min-width: 1024px) 400px, 90vw"
                width={about.image.width}
                height={about.image.height}
                alt={about.image.alt}
                loading="lazy"
                decoding="async"
                className="mx-auto block aspect-[4/5] w-full max-w-sm rounded-3xl object-cover object-[50%_30%]"
              />
            </Reveal>
            <div>
              <Reveal as="p" className="text-xl leading-9 text-muted">
                {about.intro}
              </Reveal>
              <ul className="mt-8 space-y-6">
                {about.items.map((item, i) => (
                  <Reveal as="li" key={item.id} delay={i * 80} className="flex gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-xl text-brand">
                      <Icon name={item.icon} />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="mt-1 leading-8 text-muted">{item.text}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        )}
      </AsyncContent>
    </Section>
  )
}
