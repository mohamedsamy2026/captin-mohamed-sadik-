import { useCallback, useEffect, useState } from 'react'
import Icon from '../ui/icons'
import { LIMITS } from '../../lib/config'
import { countVideos, deleteRow, listRows, saveVideo } from '../../services/admin'
import { Alert, Btn, Field, Modal, PageLoader, ProgressBar, inputCls, formatBytes } from './ui'

function VideoForm({ row, onClose, onSaved }) {
  const [title, setTitle] = useState(row?.title ?? '')
  const [file, setFile] = useState(null)
  const [posterFile, setPosterFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [step, setStep] = useState('')
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) return setError('اكتب عنوان الفيديو')
    if (!row && !file) return setError('اختار فيديو الأول')
    setBusy(true)
    try {
      if (!row && (await countVideos()) >= LIMITS.maxVideos) {
        throw new Error(`وصلت للحد الأقصى (${LIMITS.maxVideos} فيديو). احذف فيديو الأول عشان تضيف جديد.`)
      }
      await saveVideo({ row, title: title.trim(), file, posterFile, onStep: setStep, onProgress: setProgress })
      onSaved()
    } catch (err) {
      setError(err.message)
      setBusy(false)
      setProgress(null)
    }
  }

  return (
    <Modal title={row ? 'تعديل فيديو' : 'إضافة فيديو'} onClose={onClose} busy={busy}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="عنوان الفيديو">
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} disabled={busy} maxLength={120} />
        </Field>
        <Field
          label={row ? 'الفيديو (سيبه فاضي لو مش عايز تغيّره)' : 'الفيديو'}
          hint={`بيتضغط تلقائيًا قبل الرفع. أقصى مدة ${LIMITS.maxVideoSeconds} ثانية، وأقصى عدد ${LIMITS.maxVideos} فيديو.`}
        >
          <input type="file" accept="video/mp4,video/webm,video/quicktime" disabled={busy} onChange={(e) => setFile(e.target.files?.[0] ?? null)} className={inputCls} />
        </Field>
        <Field label="صورة الغلاف (بوستر) — اختياري" hint="لو ما اخترتش صورة، هنسحب صورة تلقائيًا من الفيديو.">
          <input type="file" accept="image/*" disabled={busy} onChange={(e) => setPosterFile(e.target.files?.[0] ?? null)} className={inputCls} />
        </Field>
        <Alert>{error}</Alert>
        {busy && (
          <div className="space-y-2">
            <p className="text-sm text-muted" role="status">{step}</p>
            {progress !== null && <ProgressBar value={progress} label="تقدّم الضغط" />}
          </div>
        )}
        <div className="flex gap-3">
          <Btn type="submit" loading={busy}>حفظ</Btn>
          <Btn variant="ghost" onClick={onClose} disabled={busy}>إلغاء</Btn>
        </div>
      </form>
    </Modal>
  )
}

export default function VideosSection({ onChanged }) {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // { row? }
  const [deletingId, setDeletingId] = useState(null)

  const load = useCallback(() => listRows('videos').then(setRows).catch((e) => setError(e.message)), [])
  useEffect(() => { load() }, [load])

  const remove = async (row) => {
    if (!window.confirm('هيتحذف الفيديو نهائيًا من الموقع ومن Supabase ومش هينفع تسترجعه. متأكد؟')) return
    setDeletingId(row.id)
    setError('')
    try {
      await deleteRow('videos', row, ['video_path', 'poster_path'])
      await load()
      onChanged()
    } catch (e) {
      setError(e.message)
    } finally {
      setDeletingId(null)
    }
  }

  const saved = () => { setEditing(null); load(); onChanged() }
  if (!rows && !error) return <PageLoader />

  return (
    <div className="space-y-4">
      <Alert>{error}</Alert>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">{rows?.length ?? 0} من {LIMITS.maxVideos} فيديو</p>
        <Btn onClick={() => setEditing({})}>+ إضافة فيديو</Btn>
      </div>
      {rows?.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">لسه مفيش فيديوهات.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {(rows ?? []).map((row) => (
            <li key={row.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
              {row.poster_url ? (
                <img src={row.poster_url} alt="" loading="lazy" className="aspect-video w-full bg-line object-cover" />
              ) : (
                <div className="grid aspect-video place-items-center bg-black text-white/60"><Icon name="video" className="text-3xl" /></div>
              )}
              <div className="space-y-2 p-3">
                <p className="line-clamp-2 text-sm font-semibold">{row.title}</p>
                <p className="text-xs text-muted" dir="ltr">{formatBytes(row.size_bytes || 0)}</p>
                <div className="flex gap-2">
                  <Btn variant="ghost" className="min-h-9! flex-1 px-3!" onClick={() => setEditing({ row })} disabled={deletingId === row.id}><Icon name="edit" /> تعديل</Btn>
                  <Btn variant="danger" className="min-h-9! flex-1 px-3!" onClick={() => remove(row)} loading={deletingId === row.id}><Icon name="trash" /> حذف</Btn>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {editing && <VideoForm row={editing.row} onClose={() => setEditing(null)} onSaved={saved} />}
    </div>
  )
}
