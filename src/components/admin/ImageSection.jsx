import { useCallback, useEffect, useState } from 'react'
import Icon from '../ui/icons'
import { deleteRow, listRows, saveImageItem } from '../../services/admin'
import { Alert, Btn, Field, Modal, PageLoader, inputCls, formatBytes } from './ui'

// قسم صور عام: بيشتغل للمعرض (فيه مجموعتين) وللشهادات (من غير مجموعات).
function ImageForm({ editing, groups, textKey, textLabel, table, kind, onClose, onSaved }) {
  const { row, group: startGroup } = editing
  const [text, setText] = useState(row?.[textKey] ?? '')
  const [group, setGroup] = useState(row?.group_key ?? startGroup ?? groups?.[0]?.id)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(row?.image_url ?? null)
  const [busy, setBusy] = useState(false)
  const [step, setStep] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!row && !file) return setError('اختار صورة الأول')
    if (!text.trim()) return setError(`اكتب ${textLabel}`)
    setBusy(true)
    try {
      const fields = { [textKey]: text.trim() }
      if (groups) fields.group_key = group
      if (kind === 'gallery') fields.alt = text.trim()
      await saveImageItem({ table, kind, row, fields, file, onStep: setStep })
      onSaved()
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <Modal title={row ? 'تعديل' : 'إضافة صورة'} onClose={onClose} busy={busy}>
      <form onSubmit={submit} className="space-y-4">
        {groups && (
          <Field label="القسم">
            <select className={inputCls} value={group} onChange={(e) => setGroup(e.target.value)} disabled={busy}>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
          </Field>
        )}
        <Field label={row ? 'الصورة (سيبها فاضية لو مش عايز تغيّرها)' : 'الصورة'} hint="بتتضغط تلقائيًا قبل الرفع لتوفير المساحة.">
          <input type="file" accept="image/*" disabled={busy} onChange={(e) => setFile(e.target.files?.[0] ?? null)} className={inputCls} />
        </Field>
        {preview && <img src={preview} alt="" className="mx-auto max-h-56 rounded-xl object-contain" />}
        <Field label={textLabel}>
          <input className={inputCls} value={text} onChange={(e) => setText(e.target.value)} disabled={busy} maxLength={120} />
        </Field>
        <Alert>{error}</Alert>
        {busy && <p className="flex items-center gap-2 text-sm text-muted" role="status">{step}</p>}
        <div className="flex gap-3">
          <Btn type="submit" loading={busy}>حفظ</Btn>
          <Btn variant="ghost" onClick={onClose} disabled={busy}>إلغاء</Btn>
        </div>
      </form>
    </Modal>
  )
}

function Card({ row, textKey, busy, onEdit, onDelete }) {
  return (
    <li className="overflow-hidden rounded-2xl border border-line bg-surface">
      <img src={row.image_url} alt="" loading="lazy" className="aspect-[4/3] w-full bg-line object-cover" />
      <div className="space-y-2 p-3">
        <p className="line-clamp-2 text-sm font-semibold">{row[textKey]}</p>
        <p className="text-xs text-muted" dir="ltr">{formatBytes(row.size_bytes || 0)}</p>
        <div className="flex gap-2">
          <Btn variant="ghost" className="min-h-9! flex-1 px-3!" onClick={onEdit} disabled={busy}><Icon name="edit" /> تعديل</Btn>
          <Btn variant="danger" className="min-h-9! flex-1 px-3!" onClick={onDelete} loading={busy}><Icon name="trash" /> حذف</Btn>
        </div>
      </div>
    </li>
  )
}

export default function ImageSection({ table, kind, groups, textKey, textLabel, emptyText, onChanged }) {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const load = useCallback(() => listRows(table).then(setRows).catch((e) => setError(e.message)), [table])
  useEffect(() => { load() }, [load])

  const remove = async (row) => {
    if (!window.confirm('هيتحذف نهائيًا من الموقع ومن Supabase ومش هينفع تسترجعه. متأكد؟')) return
    setDeletingId(row.id)
    setError('')
    try {
      await deleteRow(table, row, ['image_path'])
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

  const renderGrid = (list) =>
    list.length === 0 ? (
      <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">{emptyText}</p>
    ) : (
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {list.map((row) => (
          <Card key={row.id} row={row} textKey={textKey} busy={deletingId === row.id} onEdit={() => setEditing({ row })} onDelete={() => remove(row)} />
        ))}
      </ul>
    )

  return (
    <div className="space-y-8">
      <Alert>{error}</Alert>
      {groups ? (
        groups.map((g) => (
          <section key={g.id} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold">{g.title}</h3>
              <Btn onClick={() => setEditing({ group: g.id })}>+ إضافة صورة</Btn>
            </div>
            {renderGrid((rows ?? []).filter((r) => r.group_key === g.id))}
          </section>
        ))
      ) : (
        <section className="space-y-4">
          <div className="flex justify-end"><Btn onClick={() => setEditing({})}>+ إضافة</Btn></div>
          {renderGrid(rows ?? [])}
        </section>
      )}
      {editing && (
        <ImageForm editing={editing} groups={groups} textKey={textKey} textLabel={textLabel} table={table} kind={kind} onClose={() => setEditing(null)} onSaved={saved} />
      )}
    </div>
  )
}
