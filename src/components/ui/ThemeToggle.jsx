import { useTheme } from '../../hooks/useTheme'
import Icon from './icons'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
      className={`grid size-11 place-items-center rounded-full border border-current/30 transition-colors hover:bg-current/10 ${className}`}
    >
      <Icon name={isDark ? 'sun' : 'moon'} className="text-lg" />
    </button>
  )
}
