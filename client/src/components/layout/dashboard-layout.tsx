import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar'
import { Navbar } from './navbar'
import { CommandPalette } from '@/components/shared/command-palette'
import { useUiStore } from '@/store/ui-store'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <CommandPalette />
      <div className={cn('transition-all duration-300', sidebarOpen ? 'lg:pl-64' : 'lg:pl-0')}>
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
