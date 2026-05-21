import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/auth-store'
import { ROUTES } from '@/lib/constants'
import type { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: UserRole[]
  adminOnly?: boolean
  userOnly?: boolean
}

function AuthLoadingSpinner() {
  return (
    <motion.div
      className="flex min-h-screen items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </motion.div>
  )
}

export function ProtectedRoute({ children, roles, adminOnly, userOnly }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, initialized, user, accountType } = useAuthStore()

  if (!initialized) {
    return <AuthLoadingSpinner />
  }

  if (!isAuthenticated || !user) {
    const loginPath = adminOnly ? ROUTES.ADMIN_LOGIN : ROUTES.LOGIN
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }

  if (adminOnly && accountType !== 'admin' && user.role !== 'admin') {
    return <Navigate to={ROUTES.ADMIN_LOGIN} replace />
  }

  if (userOnly && accountType === 'admin') {
    return <Navigate to={ROUTES.ADMIN} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return children
}

export function UserProtectedRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute userOnly>{children}</ProtectedRoute>
}

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute adminOnly roles={['admin']}>
      {children}
    </ProtectedRoute>
  )
}
