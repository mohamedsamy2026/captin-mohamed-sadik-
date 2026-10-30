import { useEffect } from 'react'

export function Spinner({ className = 'size-5' }) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function PageLoader({ text = 'جاري التحميل...' }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-muted" role="status">
      <Spinner className="size-6" /> {text}
    </div>
  )
}

const variants = {
  primary: 'bg-brand-strong text-white hover:bg-brand-strong-hover',
  danger: 'bg-signal text-white hover:bg-signal-hover',
  ghost: 'border border-line text-ink hover:border-brand hover:text-brand',
}

export function Btn({ variant = 'primary', loading = false, className = '', children, disabled, ...rest }) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors disabled:opacity-60 ${variants[variant]} ${className}`}
      {...rest}
    >
      {loading && <Spinner className="size-4" />}
      {children}
    </button>
  )
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  )
}

export const inputCls =
  'w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-ink outline-none focus:border-brand disabled:opacity-60'

export function Alert({ kind = 'error', children }) {
  if (!children) return null
  const cls = kind === 'error' ? 'border-signal/40 bg-signal/10 text-signal' : 'border-brand/40 bg-brand-soft text-ink'
  return (
    <p role={kind === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm ${cls}`}>
      {children}
    </p>
  )
}

export function ProgressBar({ value, label }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span dir="ltr">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function Modal({ title, onClose, busy, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !busy && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, busy])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-surface p-6 sm:rounded-3xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-xl font-bold">{title}</h3>
          <button type="button" onClick={onClose} disabled={busy} className="text-2xl leading-none text-muted hover:text-ink disabled:opacity-40" aria-label="إغلاق">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export const formatBytes = (n) => {
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`
}
