import { create } from 'zustand'
import type { AccountType, User, UserRole } from '@/types'

interface AuthState {
  user: User | null
  accountType: AccountType | null
  isAuthenticated: boolean
  initialized: boolean
  setSession: (user: User, accountType?: AccountType) => void
  setUser: (user: User) => void
  clearAuth: () => void
  setInitialized: (initialized: boolean) => void
  hasRole: (role: UserRole) => boolean
  isAdminAccount: () => boolean
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  accountType: null,
  isAuthenticated: false,
  initialized: false,

  setSession: (user, accountType = user.role === 'admin' ? 'admin' : 'user') =>
    set({
      user,
      accountType,
      isAuthenticated: true,
      initialized: true,
    }),

  setUser: (user) => set((state) => ({ ...state, user })),

  clearAuth: () =>
    set({
      user: null,
      accountType: null,
      isAuthenticated: false,
      initialized: true,
    }),

  setInitialized: (initialized) => set((state) => ({ ...state, initialized })),

  hasRole: (role) => get().user?.role === role,

  isAdminAccount: () => get().accountType === 'admin' || get().user?.role === 'admin',
}))
