import { useState } from 'react'
import { getGalleryGroups } from '../services/content'
import { useAsync } from '../hooks/useAsync'
import AsyncContent from '../components/ui/AsyncContent'
import CardCarousel from '../components/ui/CardCarousel'
import Icon from '../components/ui/icons'
import Lightbox from '../components/ui/Lightbox'
import Section from '../components/ui/Section'

const PER_VIEW = { base: 1, sm: 2, lg: 3 }

function PhotoCard({ item, aspect, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`تكبير الصورة: ${item.caption}`}
      className="group relative block w-full overflow-hidden rounded-3xl bg-line text-start"
    >
      <img
        src={item.src}
        srcSet={item.srcSet}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        width={item.width}
        height={item.height}
        alt={item.alt}
        loading="lazy"
        decoding="async"
        className={`block w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none ${aspect}`}
        style={{ objectPosition: item.focus ?? '50% 35%' }}
      />
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-hero/85 px-4 py-3 text-white">
        <span className='md:text-[16px] tezt-[11px]'>{item.caption}</span>
        <Icon name="zoom" className="shrink-0 text-white/80" />
      </span>
    </button>
  )
}

export default function Gallery() {
  const query = useAsync(getGalleryGroups)
  const [box, setBox] = useState(null) // { items, index }

  return (
    <Section
      id="gallery"
      tone="alt"
      eyebrow="المعرض"
      title="لحظات من التدريب"
      subtitle="صور حقيقية من الحصص والفعاليات. دوس على أي صورة عشان تكبّرها."
    >
      <AsyncContent
        query={query}
        isEmpty={(groups) => groups.every((g) => g.items.length === 0)}
        empty={{ icon: 'images', title: 'لسه مفيش صور في المعرض', text: 'هتتضاف صور من الحصص والفعاليات قريبًا.' }}
      >
        {(groups) => (
          <div className="space-y-14">
            {groups
              .filter((g) => g.items.length > 0)
              .map((group, gi) => (
                <div key={group.id}>
                  <h3 className="mb-6 text-2xl font-bold">{group.title}</h3>
                  <CardCarousel
                    label={group.title}
                    items={group.items}
                    perView={PER_VIEW}
                    renderItem={(item, index) => (
                      <PhotoCard
                        item={item}
                        aspect={gi === 0 ? 'aspect-[4/5]' : 'aspect-[4/3]'}
                        onOpen={() => setBox({ items: group.items, index })}
                      />
                    )}
                  />
                </div>
              ))}
          </div>
        )}
      </AsyncContent>

      {box && (
        <Lightbox
          items={box.items}
          index={box.index}
          onClose={() => setBox(null)}
          onChange={(index) => setBox((b) => ({ ...b, index }))}
        />
      )}
    </Section>
  )
}
