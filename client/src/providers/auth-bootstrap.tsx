import { useEffect } from 'react'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/auth-store'
import type { User } from '@/types'

let restoreSessionPromise: Promise<User | null> | null = null

function restoreSession(): Promise<User | null> {
  if (!restoreSessionPromise) {
    restoreSessionPromise = authApi
      .getMe()
      .then(({ data }) => data.user ?? null)
      .finally(() => {
        restoreSessionPromise = null
      })
  }

  return restoreSessionPromise
}

export function AuthBootstrap() {
  const setSession = useAuthStore((s) => s.setSession)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const setInitialized = useAuthStore((s) => s.setInitialized)

  useEffect(() => {
    let cancelled = false

    const bootstrap = async () => {
      try {
        const user = await restoreSession()
        if (!cancelled) {
          if (user) {
            setSession(user, user.role === 'admin' ? 'admin' : 'user')
          } else {
            clearAuth()
          }
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
