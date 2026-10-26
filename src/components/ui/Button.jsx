const base =
  'inline-flex min-h-12 select-none items-center justify-center gap-2 rounded-full px-6 text-base font-semibold transition-colors duration-200 disabled:opacity-60'

const variants = {
  primary: 'bg-signal text-white hover:bg-signal-hover',
  brand: 'bg-brand-strong text-white hover:bg-brand-strong-hover',
  outline: 'border-2 border-line text-ink hover:border-brand hover:text-brand',
  onDark: 'border-2 border-white/40 text-white hover:bg-white/10',
  whatsapp: 'bg-wa text-white hover:brightness-95',
}

// لو فيه href بيطلع <a>، غير كده <button>
export default function Button({ href, variant = 'primary', className = '', children, ...rest }) {
  const classes = `${base} ${variants[variant]} ${className}`
  if (href) {
    const external = /^https?:/.test(href)
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
