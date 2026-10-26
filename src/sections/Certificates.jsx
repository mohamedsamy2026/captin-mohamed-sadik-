import { useState } from 'react'
import { getCertificates } from '../services/content'
import { useAsync } from '../hooks/useAsync'
import AsyncContent from '../components/ui/AsyncContent'
import CardCarousel from '../components/ui/CardCarousel'
import Icon from '../components/ui/icons'
import Lightbox from '../components/ui/Lightbox'
import Section from '../components/ui/Section'

const PER_VIEW = { base: 1, sm: 2, lg: 3, xl: 4 }

function CertificateCard({ cert, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`تكبير: ${cert.title}`}
      className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-line bg-canvas text-start transition-colors hover:border-brand"
    >
      <span className="relative block aspect-[4/5] bg-brand-soft">
        <span className="absolute inset-5 flex items-center justify-center">
          <img
            src={cert.src}
            width={cert.width}
            height={cert.height}
            alt={cert.alt}
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full rounded-md bg-white object-contain shadow-lg shadow-black/25"
          />
        </span>
      </span>
      <span className="flex flex-1 items-start justify-between gap-3 px-4 py-4">
        <span className="font-semibold leading-7">{cert.title}</span>
        <Icon name="zoom" className="mt-1.5 shrink-0 text-brand" />
      </span>
    </button>
  )
}

export default function Certificates() {
  const query = useAsync(getCertificates)
  const [index, setIndex] = useState(null)

  return (
    <Section
      id="certificates"
      tone="alt"
      eyebrow="الشهادات"
      title="مؤهلات واعتمادات"
      subtitle="شهادات حقيقية للكابتن. دوس على أي شهادة عشان تقرأها بوضوح."
    >
      <AsyncContent
        query={query}
        empty={{ icon: 'certificate', title: 'لسه مفيش شهادات هنا', text: 'هتتضاف الشهادات قريبًا.' }}
      >
        {(certs) => (
          <>
            <CardCarousel
              label="الشهادات"
              items={certs}
              perView={PER_VIEW}
              renderItem={(cert, i) => <CertificateCard cert={cert} onOpen={() => setIndex(i)} />}
            />
            {index !== null && (
              <Lightbox items={certs} index={index} onClose={() => setIndex(null)} onChange={setIndex} />
            )}
          </>
        )}
      </AsyncContent>
    </Section>
  )
}
