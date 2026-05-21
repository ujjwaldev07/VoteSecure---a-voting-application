import { useNavigate } from 'react-router-dom'
import { Bell, LogOut, Moon, Search, Sun, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/auth-store'
import { useUiStore } from '@/store/ui-store'
import { getInitials } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

export function Navbar({ onSearch }: { onSearch?: (q: string) => void }) {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()
  const { theme, setTheme, setCommandOpen, notifications, markNotificationRead } = useUiStore()
  const unread = notifications.filter((n) => !n.read).length

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } finally {
      clearAuth()
      navigate(user?.role === 'admin' ? ROUTES.ADMIN_LOGIN : ROUTES.LOGIN)
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/50 glass px-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search... (⌘K)"
          className="pl-9"
          onFocus={() => setCommandOpen(true)}
          onChange={(e) => onSearch?.(e.target.value)}
          aria-label="Search"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center p-0 text-[10px]">
                  {unread}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="flex flex-col items-start gap-1 py-3"
                onClick={() => markNotificationRead(n.id)}
              >
                <span className="font-medium">{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.message}</span>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials(user?.name ?? 'U')}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">{user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div>{user?.name}</div>
              <div className="text-xs font-normal text-muted-foreground">{user?.role}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(ROUTES.PROFILE)}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => void handleLogout()}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
