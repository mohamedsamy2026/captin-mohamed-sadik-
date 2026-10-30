import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { GALLERY_GROUPS } from '../../services/content'
import { getSettings } from '../../services/admin'
import ContactSection from '../../components/admin/ContactSection'
import ImageSection from '../../components/admin/ImageSection'
import ImportPanel from '../../components/admin/ImportPanel'
import SocialsSection from '../../components/admin/SocialsSection'
import UsageBar from '../../components/admin/UsageBar'
import VideosSection from '../../components/admin/VideosSection'
import { Btn, PageLoader } from '../../components/admin/ui'

const TABS = [
  { id: 'gallery', label: 'المعرض' },
  { id: 'videos', label: 'الفيديوهات' },
  { id: 'certificates', label: 'الشهادات' },
  { id: 'socials', label: 'السوشيال ميديا' },
  { id: 'contact', label: 'بيانات التواصل' },
]

export default function DashboardPage() {
  const { session, isAdmin, loading, signOut } = useAuth()
  const [tab, setTab] = useState('gallery')
  const [version, setVersion] = useState(0)
  const [imported, setImported] = useState(null) // null = لسه بيتحمّل
  const bump = () => setVersion((v) => v + 1)

  useEffect(() => {
    if (!isAdmin) return
    getSettings().then((s) => setImported(Boolean(s?.imported))).catch(() => setImported(true))
  }, [isAdmin])

  if (loading) return <PageLoader />
  if (!session || !isAdmin) return <Navigate to="/admin/login" replace />

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <div className="flex gap-2">
          <Link to="/" className="inline-flex min-h-10 items-center rounded-full border border-line px-5 text-sm font-semibold hover:border-brand">الموقع</Link>
          <Btn variant="ghost" onClick={signOut}>خروج</Btn>
        </div>
      </header>

      {imported === null && <PageLoader />}
      {imported === false && (
        <ImportPanel
          onDone={() => {
            setImported(true)
            bump()
          }}
        />
      )}

      <UsageBar version={version} />

      <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="أقسام لوحة التحكم">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
            className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              tab === t.id ? 'bg-brand-strong text-white' : 'border border-line hover:border-brand'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* key=version بيعيد تحميل القسم بعد الاستيراد */}
      <div key={`${tab}-${imported}`}>
        {tab === 'gallery' && <ImageSection table="gallery_items" kind="gallery" groups={GALLERY_GROUPS} textKey="caption" textLabel="وصف الصورة" emptyText="لسه مفيش صور في القسم ده." onChanged={bump} />}
        {tab === 'videos' && <VideosSection onChanged={bump} />}
        {tab === 'certificates' && <ImageSection table="certificates" kind="certificate" textKey="title" textLabel="اسم الشهادة" emptyText="لسه مفيش شهادات." onChanged={bump} />}
        {tab === 'socials' && <SocialsSection />}
        {tab === 'contact' && <ContactSection />}
      </div>
    </div>
  )
}
