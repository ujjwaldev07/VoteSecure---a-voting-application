import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/api/auth'
import { adminApi } from '@/api/admin'
import { useAuthStore } from '@/store/auth-store'
import type { User } from '@/types'

export function useProfile(enabled = true) {
  const accountType = useAuthStore((s) => s.accountType) ?? 'user'
  const setSession = useAuthStore((s) => s.setSession)

  return useQuery({
    queryKey: ['profile', accountType],
    queryFn: async (): Promise<User> => {
      if (accountType === 'admin') {
        const { data } = await adminApi.getProfile()
        const mapped: User = {
          _id: data.admin._id,
          name: data.admin.name,
          email: data.admin.email,
          role: 'admin',
        }
        setSession(mapped, 'admin')
        return mapped
      }

      const { data } = await authApi.getProfile()
      setSession(data.user, 'user')
      return data.user
    },
    enabled,
    staleTime: 60_000,
    retry: 1,
  })
}
