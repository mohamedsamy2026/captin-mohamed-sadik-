import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'

export default function NotFoundPage() {
  return (
    <section className="grid min-h-[70svh] place-items-center py-32">
      <Container className="text-center">
        <p className="text-6xl font-bold text-brand">404</p>
        <h1 className="mt-4 text-3xl font-bold">الصفحة دي مش موجودة</h1>
        <p className="mt-2 text-muted">ممكن الرابط غلط أو الصفحة اتنقلت.</p>
        <Link
          to="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-brand-strong px-6 font-semibold text-white transition-colors hover:bg-brand-strong-hover"
        >
          الرجوع للرئيسية
        </Link>
      </Container>
    </section>
  )
}
