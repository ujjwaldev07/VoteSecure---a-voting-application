import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Command } from 'cmdk'
import { BarChart3, LayoutDashboard, LogOut, Moon, Sun, Users } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { authApi } from '@/api/auth'
import { useUiStore } from '@/store/ui-store'
import { useAuthStore } from '@/store/auth-store'
import { ROUTES } from '@/lib/constants'

export function CommandPalette() {
  const navigate = useNavigate()
  const { commandOpen, setCommandOpen, theme, setTheme } = useUiStore()
  const { clearAuth, user } = useAuthStore()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen(!commandOpen)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [commandOpen, setCommandOpen])

  const run = (fn: () => void) => {
    setCommandOpen(false)
    fn()
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } finally {
      clearAuth()
      navigate(user?.role === 'admin' ? ROUTES.ADMIN_LOGIN : ROUTES.LOGIN)
    }
  }

  return (
    <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
          <Command.Input placeholder="Type a command or search..." className="h-12 border-0 bg-transparent px-4 text-sm outline-none" />
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty>No results found.</Command.Empty>
            <Command.Group heading="Navigation">
              <Command.Item onSelect={() => run(() => navigate(ROUTES.DASHBOARD))}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Command.Item>
              <Command.Item onSelect={() => run(() => navigate(ROUTES.CANDIDATES))}>
                <Users className="mr-2 h-4 w-4" />
                Candidates
              </Command.Item>
              <Command.Item onSelect={() => run(() => navigate(ROUTES.RESULTS))}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Results
              </Command.Item>
            </Command.Group>
            <Command.Group heading="Settings">
              <Command.Item onSelect={() => run(() => setTheme(theme === 'dark' ? 'light' : 'dark'))}>
                {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                Toggle theme
              </Command.Item>
              <Command.Item onSelect={() => run(() => void handleLogout())}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
