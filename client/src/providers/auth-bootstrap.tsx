import { useEffect } from 'react'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/auth-store'

export function AuthBootstrap() {
  const setSession = useAuthStore((s) => s.setSession)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const setInitialized = useAuthStore((s) => s.setInitialized)

  useEffect(() => {
    let cancelled = false

    const bootstrap = async () => {
      try {
        const { data } = await authApi.getMe()
        if (!cancelled) {
          setSession(data.user, data.user.role === 'admin' ? 'admin' : 'user')
        }
      } catch {
        if (!cancelled) {
          clearAuth()
        }
      } finally {
        if (!cancelled) {
          setInitialized(true)
        }
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [clearAuth, setInitialized, setSession])

  return null
}
