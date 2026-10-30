import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'
import { PageLoader } from '../components/admin/ui'

// لوحة التحكم بتتحمّل لوحدها (lazy) عشان ما تتقلش على الزوار.
const AdminApp = lazy(() => import('../pages/admin/AdminApp'))

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<PageLoader />}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
