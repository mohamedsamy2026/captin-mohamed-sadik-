import Button from './Button'

export default function ErrorState({ onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-3xl border border-line bg-surface px-6 py-12 text-center">
      <p className="text-lg font-semibold">حصلت مشكلة وإحنا بنحمّل المحتوى</p>
      <p className="mt-1 text-muted">جرّب تاني بعد لحظات.</p>
      {onRetry && (
        <Button variant="brand" onClick={onRetry} className="mt-5">
          إعادة المحاولة
        </Button>
      )}
    </div>
  )
}
