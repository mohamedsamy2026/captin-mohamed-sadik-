import { useState } from 'react'
import { runImport } from '../../lib/importer'
import { Alert, Btn, ProgressBar } from './ui'

// بيظهر مرة واحدة بس (لحد ما الاستيراد يخلص كله بنجاح).
export default function ImportPanel({ onDone }) {
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(null)
  const [errors, setErrors] = useState([])
  const [fatal, setFatal] = useState('')

  const start = async () => {
    if (!window.confirm('هيتم رفع كل الصور والفيديوهات والبيانات الحالية على Supabase وضغطها. ممكن ياخد كام دقيقة. كمّل؟')) return
    setBusy(true)
    setErrors([])
    setFatal('')
    try {
      const { errors: errs } = await runImport(setProgress)
      setErrors(errs)
      if (errs.length === 0) onDone()
    } catch (e) {
      setFatal(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="space-y-4 rounded-3xl border-2 border-dashed border-brand bg-brand-soft p-5">
      <div>
        <h2 className="text-xl font-bold">استيراد المحتوى الحالي</h2>
        <p className="mt-1 text-sm text-muted">
          بينقل صور المعرض والفيديوهات والشهادات وروابط السوشيال اللي في الموقع دلوقتي إلى Supabase، وبيضغطهم قبل الرفع. الزر ده بيظهر مرة واحدة بس.
        </p>
      </div>
      {progress && <ProgressBar value={progress.total ? progress.done / progress.total : 0} label={`${progress.done} / ${progress.total} — ${progress.label}`} />}
      <Alert>{fatal}</Alert>
      {errors.length > 0 && (
        <Alert>
          <span className="font-bold">في ملفات معرفناش نرفعها (الباقي اترفع). صلّح المشكلة واضغط تاني، اللي اترفع مش هيتكرر:</span>
          <ul className="mt-2 list-disc ps-5">
            {errors.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </Alert>
      )}
      <Btn onClick={start} loading={busy}>{busy ? 'جاري الاستيراد... متقفلش الصفحة' : errors.length ? 'إعادة المحاولة' : 'ابدأ الاستيراد'}</Btn>
    </section>
  )
}
