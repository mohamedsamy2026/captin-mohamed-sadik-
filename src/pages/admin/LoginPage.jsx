import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Alert, Btn, Field, PageLoader, inputCls } from '../../components/admin/ui'

export default function LoginPage() {
  const { session, isAdmin, loading, signIn, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (loading) return <PageLoader />
  if (session && isAdmin) return <Navigate to="/admin" replace />

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error: err } = await signIn(email.trim(), password)
    if (err) setError('الإيميل أو كلمة السر غلط')
    setBusy(false)
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-sm place-items-center p-6">
      <form onSubmit={submit} className="w-full space-y-4 rounded-3xl border border-line bg-surface p-6">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        {session && !isAdmin && (
          <Alert>الحساب ده مش أدمن. شغّل ملف add-admin.sql بإيميله، أو سجّل بحساب تاني.</Alert>
        )}
        <Field label="الإيميل">
          <input className={inputCls} dir="ltr" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={busy} />
        </Field>
        <Field label="كلمة السر">
          <input className={inputCls} dir="ltr" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={busy} />
        </Field>
        <Alert>{error}</Alert>
        <Btn type="submit" loading={busy} className="w-full">دخول</Btn>
        {session && <Btn variant="ghost" className="w-full" onClick={signOut}>تسجيل الخروج</Btn>}
      </form>
    </main>
  )
}
