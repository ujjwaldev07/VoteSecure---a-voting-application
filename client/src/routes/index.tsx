import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute, AdminProtectedRoute } from './protected-route'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ROUTES } from '@/lib/constants'
import { Skeleton } from '@/components/ui/skeleton'

const LandingPage = lazy(() => import('@/pages/landing/landing-page'))
const LoginPage = lazy(() => import('@/pages/auth/login-page'))
const SignupPage = lazy(() => import('@/pages/auth/signup-page'))
const AdminLoginPage = lazy(() => import('@/pages/auth/admin-login-page'))
const AdminSignupPage = lazy(() => import('@/pages/auth/admin-signup-page'))
const DashboardPage = lazy(() => import('@/pages/dashboard/dashboard-page'))
const CandidatesPage = lazy(() => import('@/pages/voting/candidates-page'))
const ResultsPage = lazy(() => import('@/pages/results/results-page'))
const AdminPage = lazy(() => import('@/pages/admin/admin-page'))
const AdminCandidatesPage = lazy(() => import('@/pages/admin/admin-candidates-page'))
const AdminAnalyticsPage = lazy(() => import('@/pages/admin/admin-analytics-page'))
const ProfilePage = lazy(() => import('@/pages/profile/profile-page'))

function PageLoader() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path={ROUTES.HOME} element={<LandingPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />
        <Route path={ROUTES.ADMIN_SIGNUP} element={<AdminSignupPage />} />
        <Route path={ROUTES.RESULTS} element={<ResultsPage />} />

        <Route
          element={
            <ProtectedRoute userOnly>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.CANDIDATES} element={<CandidatesPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>

        <Route
          element={
            <AdminProtectedRoute>
              <DashboardLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path={ROUTES.ADMIN} element={<AdminPage />} />
          <Route path={ROUTES.ADMIN_CANDIDATES} element={<AdminCandidatesPage />} />
          <Route path={ROUTES.ADMIN_ANALYTICS} element={<AdminAnalyticsPage />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Suspense>
  )
}
