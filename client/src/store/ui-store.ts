import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { THEME_KEY } from '@/lib/constants'
import type { Notification } from '@/types'

type Theme = 'light' | 'dark' | 'system'

interface UiState {
  theme: Theme
  sidebarOpen: boolean
  commandOpen: boolean
  notifications: Notification[]
  setTheme: (theme: Theme) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setCommandOpen: (open: boolean) => void
  markNotificationRead: (id: string) => void
  addNotification: (n: Omit<Notification, 'id' | 'read'>) => void
}

const defaultNotifications: Notification[] = [
  {
    id: '1',
    title: 'Election live',
    message: 'Voting is now open for all registered voters.',
    time: '2m ago',
    read: false,
  },
  {
    id: '2',
    title: 'Results updating',
    message: 'Live vote counts refresh every 30 seconds.',
    time: '1h ago',
    read: false,
  },
]

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: true,
      commandOpen: false,
      notifications: defaultNotifications,

      setTheme: (theme) => {
        localStorage.setItem(THEME_KEY, theme)
        set({ theme })
      },

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setCommandOpen: (open) => set({ commandOpen: open }),

      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      addNotification: (n) =>
        set((s) => ({
          notifications: [
            {
              ...n,
              id: crypto.randomUUID(),
              read: false,
            },
            ...s.notifications,
          ].slice(0, 20),
        })),
    }),
    {
      name: 'votesecure-ui',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)
