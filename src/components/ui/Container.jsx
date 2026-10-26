export default function Container({ className = '', children, ...rest }) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`} {...rest}>
      {children}
    </div>
  )
}
