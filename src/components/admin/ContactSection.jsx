import { useEffect, useState } from 'react'
import { getSettings, saveSetting } from '../../services/admin'
import { isValidPhone, toTel, toWhatsappNumber } from '../../utils/phone'
import { Alert, Btn, Field, PageLoader, inputCls } from './ui'

// كل حقل ليه زر حفظ مستقل: رقم الواتساب ورقم الاتصال ممكن يكونوا مختلفين.
function SettingRow({ field, label, hint, value, validate, preview, onSaved }) {
  const [text, setText] = useState(value)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  const save = async () => {
    setMsg(null)
    const problem = validate?.(text)
    if (problem) return setMsg({ kind: 'error', text: problem })
    setBusy(true)
    try {
      const saved = await saveSetting(field, text)
      onSaved(saved)
      setMsg({ kind: 'ok', text: 'اتحفظ وبقى ظاهر في كل مكان في الموقع.' })
    } catch (e) {
      setMsg({ kind: 'error', text: e.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-line bg-surface p-4">
      <Field label={label} hint={hint}>
        <input className={inputCls} value={text} onChange={(e) => setText(e.target.value)} disabled={busy} dir={field === 'location' ? 'rtl' : 'ltr'} inputMode={field === 'location' ? 'text' : 'tel'} />
      </Field>
      {preview && text.trim() && <p className="text-xs text-muted" dir="ltr">{preview(text)}</p>}
      <Alert kind={msg?.kind === 'ok' ? 'ok' : 'error'}>{msg?.text}</Alert>
      <Btn onClick={save} loading={busy}>حفظ</Btn>
    </div>
  )
}

export default function ContactSection() {
  const [s, setS] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getSettings().then(setS).catch((e) => setError(e.message))
  }, [])

  if (error) return <Alert>{error}</Alert>
  if (!s) return <PageLoader />
  const phoneCheck = (v) => (isValidPhone(v) ? null : 'اكتب رقم صحيح')

  return (
    <div className="space-y-4">
      <SettingRow
        field="whatsapp"
        label="رقم الواتساب"
        hint="بيتغيّر في زر الحجز، الزر العائم، والفوتر، وكل مكان فيه واتساب."
        value={s.whatsapp}
        validate={phoneCheck}
        preview={(v) => `https://wa.me/${toWhatsappNumber(v)}`}
        onSaved={() => {}}
      />
      <SettingRow
        field="phone"
        label="رقم الاتصال (التليفون)"
        hint="ممكن يكون مختلف عن رقم الواتساب."
        value={s.phone}
        validate={phoneCheck}
        preview={(v) => `tel:${toTel(v)}`}
        onSaved={() => {}}
      />
      <SettingRow
        field="location"
        label="المكان / العنوان"
        value={s.location}
        validate={(v) => (v.trim().length >= 3 ? null : 'اكتب العنوان')}
        onSaved={() => {}}
      />
    </div>
  )
}
