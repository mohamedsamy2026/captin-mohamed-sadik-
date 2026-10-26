import { useEffect, useState } from 'react'

// نقاط التوقف بتطابق Tailwind: sm=640 md=768 lg=1024 xl=1280
const BREAKPOINTS = [
  ['xl', 1280],
  ['lg', 1024],
  ['md', 768],
  ['sm', 640],
]

function compute(perView) {
  for (const [key, width] of BREAKPOINTS) {
    if (perView[key] != null && window.matchMedia(`(min-width: ${width}px)`).matches) {
      return perView[key]
    }
  }
  return perView.base ?? 1
}

// بيرجّع عدد الكروت الظاهرة حاليًا حسب عرض الشاشة. مثال: { base: 1, md: 2, lg: 3 }
export function useVisibleCount(perView) {
  const key = JSON.stringify(perView)
  const [count, setCount] = useState(() => compute(perView))

  useEffect(() => {
    const config = JSON.parse(key)
    const update = () => setCount(compute(config))
    update()
    const lists = BREAKPOINTS.map(([, w]) => window.matchMedia(`(min-width: ${w}px)`))
    lists.forEach((m) => m.addEventListener('change', update))
    return () => lists.forEach((m) => m.removeEventListener('change', update))
  }, [key])

  return count
}
