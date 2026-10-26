import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Keyboard } from 'swiper/modules'
import 'swiper/css'
import { useVisibleCount } from '../../hooks/useVisibleCount'
import Icon from './icons'

const GAP = 20

const controlClass =
  'grid size-12 place-items-center rounded-full border-2 border-line text-ink transition-colors hover:border-brand hover:text-brand disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink'

// لو عدد الكروت <= العدد الظاهر على الشاشة: بيعرضهم كشبكة عادية من غير Swiper.
// لو أكتر: بيشغّل Swiper بأزرار سابق/تالي وسحب ولوحة المفاتيح.
// perView مثال: { base: 1, md: 2, lg: 3 }
export default function CardCarousel({ items, perView, renderItem, label }) {
  const count = useVisibleCount(perView)
  const [swiper, setSwiper] = useState(null)
  const [edges, setEdges] = useState({ begin: true, end: false })

  const sync = (s) => setEdges({ begin: s.isBeginning, end: s.isEnd })

  if (items.length <= count) {
    return (
      <ul className="flex flex-wrap justify-center" style={{ gap: GAP }}>
        {items.map((item, index) => (
          <li
            key={item.id}
            className="min-w-0"
            style={{ width: `calc((100% - ${(count - 1) * GAP}px) / ${count})` }}
          >
            {renderItem(item, index)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <Swiper
        key={count}
        dir="rtl"
        modules={[A11y, Keyboard]}
        keyboard={{ enabled: true }}
        a11y={{ prevSlideMessage: 'العنصر السابق', nextSlideMessage: 'العنصر التالي' }}
        slidesPerView={count}
        spaceBetween={GAP}
        onSwiper={(s) => {
          setSwiper(s)
          sync(s)
        }}
        onSlideChange={sync}
        onResize={sync}
      >
        {items.map((item, index) => (
          <SwiperSlide key={item.id} style={{ height: 'auto' }}>
            {renderItem(item, index)}
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-6 flex justify-center gap-3">
        <button type="button" className={controlClass} disabled={edges.begin} aria-label="السابق" onClick={() => swiper?.slidePrev()}>
          <Icon name="prev" />
        </button>
        <button type="button" className={controlClass} disabled={edges.end} aria-label="التالي" onClick={() => swiper?.slideNext()}>
          <Icon name="next" />
        </button>
      </div>
    </div>
  )
}
