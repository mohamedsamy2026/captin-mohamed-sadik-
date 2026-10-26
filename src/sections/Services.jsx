import { getServices } from '../services/content'
import { useAsync } from '../hooks/useAsync'
import AsyncContent from '../components/ui/AsyncContent'
import Icon from '../components/ui/icons'
import Reveal from '../components/ui/Reveal'
import Section from '../components/ui/Section'

export default function Services() {
  const query = useAsync(getServices)
  return (
    <Section
      id="services"
      tone="alt"
      eyebrow="الخدمات"
      title="مجالات الخبرة"
      subtitle="خدمات رياضية متكاملة بتجمع بين العلم الأكاديمي والخبرة الميدانية."
    >
      <AsyncContent query={query} empty={{ icon: 'swim', title: 'الخدمات هتتضاف قريبًا' }}>
        {(items) => (
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((s, i) => (
              <Reveal as="li" key={s.id} delay={i * 80}>
                <article className="flex h-full flex-col rounded-3xl border border-line bg-canvas p-6 transition duration-300 hover:-translate-y-1 hover:border-brand motion-reduce:transition-none">
                  <span className="mb-5 grid size-14 place-items-center rounded-2xl bg-brand text-2xl text-white dark:text-hero">
                    <Icon name={s.icon} />
                  </span>
                  <h3 className="text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 flex-1 leading-8 text-muted">{s.text}</p>
                  {s.tag && (
                    <span className="mt-5 inline-block self-start rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand">
                      {s.tag}
                    </span>
                  )}
                </article>
              </Reveal>
            ))}
          </ul>
        )}
      </AsyncContent>
    </Section>
  )
}
