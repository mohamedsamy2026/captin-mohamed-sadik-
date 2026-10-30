import { useCallback, useEffect, useState } from 'react'
import Icon from '../ui/icons'
import { PLATFORMS, platformById } from '../../data/socialPlatforms'
import { deleteRow, listRows, saveSocial } from '../../services/admin'
import { Alert, Btn, Field, Modal, PageLoader, inputCls } from './ui'

function SocialForm({ row, onClose, onSaved }) {
  const [platform, setPlatform] = useState(row?.platform ?? 'facebook')
  const [label, setLabel] = useState(row?.label ?? '')
  const [url, setUrl] = useState(row?.url ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const p = platformById(platform)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const clean = url.trim()
    if (!/^https?:\/\/.+\..+/.test(clean)) return setError('اكتب رابط صحيح يبدأ بـ https://')
    if (platform === 'other' && !label.trim()) return setError('اكتب اسم المنصة')
    setBusy(true)
    try {
      await saveSocial({ row, platform, label: label.trim(), url: clean })
      onSaved()
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <Modal title={row ? 'تعديل رابط' : 'إضافة منصة'} onClose={onClose} busy={busy}>
      <form onSubmit={submit} className="space-y-4">
        <fieldset disabled={busy}>
          <legend className="mb-2 text-sm font-semibold">اختار المنصة</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PLATFORMS.map((pl) => (
              <button
                key={pl.id}
                type="button"
                onClick={() => setPlatform(pl.id)}
                aria-pressed={platform === pl.id}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                  platform === pl.id ? 'border-brand bg-brand-soft text-brand' : 'border-line hover:border-brand'
                }`}
              >
                <Icon name={pl.icon} /> {pl.label}
              </button>
            ))}
          </div>
        </fieldset>
        {platform === 'other' && (
          <Field label="اسم المنصة">
            <input className={inputCls} value={label} onChange={(e) => setLabel(e.target.value)} disabled={busy} maxLength={30} />
          </Field>
        )}
        <Field label="الرابط">
          <input className={inputCls} dir="ltr" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={p.placeholder} disabled={busy} inputMode="url" />
        </Field>
        <Alert>{error}</Alert>
        <div className="flex gap-3">
          <Btn type="submit" loading={busy}>حفظ</Btn>
          <Btn variant="ghost" onClick={onClose} disabled={busy}>إلغاء</Btn>
        </div>
      </form>
    </Modal>
  )
}

export default function SocialsSection() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const load = useCallback(() => listRows('social_links').then(setRows).catch((e) => setError(e.message)), [])
  useEffect(() => { load() }, [load])

  const remove = async (row) => {
    if (!window.confirm('هيتحذف الرابط نهائيًا. متأكد؟')) return
    setDeletingId(row.id)
    try {
      await deleteRow('social_links', row)
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setDeletingId(null)
    }
  }

  if (!rows && !error) return <PageLoader />
  return (
    <div className="space-y-4">
      <Alert>{error}</Alert>
      <div className="flex justify-end"><Btn onClick={() => setEditing({})}>+ إضافة منصة</Btn></div>
      {rows?.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">لسه مفيش روابط سوشيال.</p>
      ) : (
        <ul className="space-y-3">
          {(rows ?? []).map((row) => {
            const p = platformById(row.platform)
            return (
              <li key={row.id} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-soft text-brand"><Icon name={p.icon} /></span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{row.platform === 'other' ? row.label : p.label}</p>
                  <p className="truncate text-xs text-muted" dir="ltr">{row.url}</p>
                </div>
                <Btn variant="ghost" className="min-h-9! px-3!" onClick={() => setEditing({ row })} disabled={deletingId === row.id}><Icon name="edit" /></Btn>
                <Btn variant="danger" className="min-h-9! px-3!" onClick={() => remove(row)} loading={deletingId === row.id}><Icon name="trash" /></Btn>
              </li>
            )
          })}
        </ul>
      )}
      {editing && <SocialForm row={editing.row} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load() }} />}
    </div>
  )
}
