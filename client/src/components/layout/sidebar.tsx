import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Vote,
  BarChart3,
  Settings,
  Shield,
  ChevronLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import { useAuthStore } from '@/store/auth-store'
import { useUiStore } from '@/store/ui-store'
import { Button } from '@/components/ui/button'

const voterLinks = [
  { to: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
  { to: ROUTES.CANDIDATES, icon: Users, label: 'Candidates' },
  { to: ROUTES.RESULTS, icon: BarChart3, label: 'Results' },
]

const adminLinks = [
  { to: ROUTES.ADMIN, icon: Shield, label: 'Admin' },
  { to: ROUTES.ADMIN_CANDIDATES, icon: Users, label: 'Manage Candidates' },
  { to: ROUTES.ADMIN_ANALYTICS, icon: BarChart3, label: 'Analytics' },
]

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUiStore()
  const { user, accountType } = useAuthStore()
  const isAdmin = user?.role === 'admin'
  const isDedicatedAdmin = accountType === 'admin'
  const links = isAdmin ? (isDedicatedAdmin ? adminLinks : [...voterLinks, ...adminLinks]) : voterLinks

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border/50 glass-strong"
          >
            <div className="flex h-16 items-center gap-2 border-b border-border/50 px-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-500">
                <Vote className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">VoteSecure</span>
            </div>

            <nav className="flex-1 space-y-1 p-4" aria-label="Main navigation">
              {links.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary/15 text-primary glow-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>

            {!isDedicatedAdmin && (
              <div className="border-t border-border/50 p-4">
                <NavLink
                  to={ROUTES.PROFILE}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </NavLink>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <ChevronLeft className={cn('h-5 w-5 transition-transform', !sidebarOpen && 'rotate-180')} />
      </Button>
    </>
  )
}
