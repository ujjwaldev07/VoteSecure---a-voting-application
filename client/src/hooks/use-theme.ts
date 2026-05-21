import { useEffect } from 'react'
import { useUiStore } from '@/store/ui-store'

export function useTheme() {
  const { theme, setTheme } = useUiStore()

  useEffect(() => {
    const root = document.documentElement
    const resolved =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme
    root.classList.toggle('dark', resolved === 'dark')
  }, [theme])

  return { theme, setTheme }
}
