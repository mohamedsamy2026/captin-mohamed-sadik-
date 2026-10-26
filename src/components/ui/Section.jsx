import Container from './Container'
import Reveal from './Reveal'

// غلاف موحّد لكل قسم: عنوان فرعي + عنوان + وصف + المحتوى
export default function Section({ id, eyebrow, title, subtitle, tone = 'default', children }) {
  const bg = tone === 'alt' ? 'bg-surface' : 'bg-canvas'
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${bg} py-16 sm:py-24`}>
      <Container>
        <Reveal className="mb-10 max-w-2xl sm:mb-14">
          {eyebrow && (
            <p className="mb-3 flex items-center gap-3 text-sm font-semibold text-brand">
              <span className="h-1.5 w-10 rounded-full bg-signal" aria-hidden="true" />
              {eyebrow}
            </p>
          )}
          <h2 id={`${id}-title`} className="text-3xl font-bold sm:text-4xl">
            {title}
          </h2>
          {subtitle && <p className="mt-3 text-lg text-muted">{subtitle}</p>}
        </Reveal>
        {children}
      </Container>
    </section>
  )
}
