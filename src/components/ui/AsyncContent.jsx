import EmptyState from './EmptyState'
import ErrorState from './ErrorState'

function DefaultSkeleton() {
  return (
    <div aria-hidden="true" className="grid animate-pulse gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-64 rounded-3xl bg-line/60" />
      ))}
    </div>
  )
}

// بيعرض: تحميل ← خطأ ← فاضي ← المحتوى. بيتحط جوّه كل قسم بياخد بياناته من services.
export default function AsyncContent({ query, isEmpty, empty, skeleton, children }) {
  const { status, data, retry } = query
  if (status === 'loading') return skeleton ?? <DefaultSkeleton />
  if (status === 'error') return <ErrorState onRetry={retry} />
  const nothing = isEmpty ? isEmpty(data) : !data || (Array.isArray(data) && data.length === 0)
  if (nothing) return <EmptyState {...empty} />
  return children(data)
}
