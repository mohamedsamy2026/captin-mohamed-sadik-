import { getMethodSteps } from '../services/content'
import { useAsync } from '../hooks/useAsync'
import AsyncContent from '../components/ui/AsyncContent'
import Icon from '../components/ui/icons'
import Reveal from '../components/ui/Reveal'
import Section from '../components/ui/Section'

const ICONS = { contact: 'whatsapp', assess: 'swim', plan: 'medal', follow: 'check' }

export default function Method() {
  const query = useAsync(getMethodSteps)
  return (
    <Section id="method" eyebrow="طريقة التدريب" title="من أول رسالة لحد ما تتقدّم">
      <AsyncContent query={query} empty={{ icon: 'check', title: 'خطوات التدريب هتتضاف قريبًا' }}>
        {(steps) => (
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.id} delay={i * 80}>
                <div className="cursor-pointer hover:-translate-y-2 duration-300 relative h-full overflow-hidden rounded-3xl border border-line bg-surface p-6 pb-8">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-2 end-4 select-none text-8xl font-black leading-none text-brand/10"
                  >
                    {i + 1}
                  </span>
                  <span className="relative grid size-14 place-items-center rounded-2xl bg-brand text-2xl text-white dark:text-hero">
                    <Icon name={ICONS[step.id] || 'check'} />
                  </span>
                  <p className="relative mt-5 text-sm font-bold text-brand">الخطوة {i + 1}</p>
                  <h3 className="relative mt-1 text-xl font-bold">{step.title}</h3>
                  <p className="relative mt-2 leading-8 text-muted font-sans2 font-bold">{step.text}</p>
                  {/* شريط تقدّم: بيزيد مع كل خطوة */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 start-0 h-1.5 rounded-e-full bg-signal"
                    style={{ width: `${((i + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </Reveal>
            ))}
          </ol>
        )}
      </AsyncContent>
    </Section>
  )
}
