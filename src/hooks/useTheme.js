import { useCallback, useState } from 'react'

const KEY = 'theme'

// الوضع الابتدائي بيتحدد في index.html قبل الرسم؛ هنا بنقراه ونبدّله بس.
export function useTheme() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* لو التخزين مقفول مش مشكلة */
    }
    setTheme(next)
  }, [theme])

  return { theme, toggle }
}
