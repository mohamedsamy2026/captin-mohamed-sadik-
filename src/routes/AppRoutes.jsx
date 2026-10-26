import { Route, Routes } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'

// صفحات الزوار بس. مفيش تسجيل دخول ولا لوحة تحكم في المرحلة دي.
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
