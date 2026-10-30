import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import DashboardPage from './DashboardPage'
import LoginPage from './LoginPage'

export default function AdminApp() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    const prev = document.title
    document.title = 'لوحة التحكم'
    return () => {
      meta.remove()
      document.title = prev
    }
  }, [])

  if (!supabase) {
    return (
      <main className="mx-auto max-w-lg p-8">
        <h1 className="mb-3 text-2xl font-bold">Supabase مش متوصّل</h1>
        <p className="leading-8 text-muted">
          ضيف <code dir="ltr">VITE_SUPABASE_URL</code> و <code dir="ltr">VITE_SUPABASE_ANON_KEY</code> في ملف <code dir="ltr">.env</code> وأعد تشغيل <code dir="ltr">npm run dev</code>. الخطوات في ملف README-SETUP.md.
        </p>
      </main>
    )
  }

  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route index element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  )
}
