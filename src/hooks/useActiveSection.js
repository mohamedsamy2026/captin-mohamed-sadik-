import { useEffect, useState } from 'react'

// بيرجّع id القسم اللي ظاهر حاليًا في منتصف الشاشة تقريبًا (لتلوين رابط القائمة)
export function useActiveSection(ids) {
  const [active, setActive] = useState('')
  const key = ids.join('|')

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const els = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [key])

  return active
}
