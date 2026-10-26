import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import WhatsAppFloat from './WhatsAppFloat'

// الشكل العام للصفحات اللي الزائر بيشوفها.
// مستقبلًا: لو اتضافت لوحة تحكم هتبقى ليها Layout تاني منفصل، ومحدّش يلمس ده.
export default function PublicLayout() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-signal focus:px-5 focus:py-3 focus:text-white"
      >
        تخطّي إلى المحتوى
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
