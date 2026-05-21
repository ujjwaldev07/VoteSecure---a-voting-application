import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Vote, Shield } from 'lucide-react'
import type { ReactNode } from 'react'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function AuthLayout({
  children,
  title,
  subtitle,
  variant = 'user',
}: {
  children: ReactNode
  title: string
  subtitle: string
  variant?: 'user' | 'admin'
}) {
  const isAdmin = variant === 'admin'

  return (
    <motion.div
      className="auth-page relative flex min-h-[100dvh] items-center justify-center overflow-x-hidden p-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background: isAdmin
            ? [
                'radial-gradient(circle at 20% 20%, rgba(245,158,11,0.12), transparent 50%)',
                'radial-gradient(circle at 80% 80%, rgba(249,115,22,0.12), transparent 50%)',
                'radial-gradient(circle at 20% 20%, rgba(245,158,11,0.12), transparent 50%)',
              ]
            : [
                'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.15), transparent 50%)',
                'radial-gradient(circle at 80% 80%, rgba(139,92,246,0.15), transparent 50%)',
                'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.15), transparent 50%)',
              ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <Link to={ROUTES.HOME} className="mb-6 flex items-center justify-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg',
              isAdmin
                ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                : 'bg-gradient-to-br from-primary to-violet-500 glow-primary'
            )}
          >
            {isAdmin ? <Shield className="h-5 w-5" /> : <Vote className="h-5 w-5" />}
          </motion.div>
          <span className="text-2xl font-bold gradient-text">VoteSecure</span>
        </Link>
        <motion.div
          layout
          className={cn(
            'glass-strong gradient-border rounded-2xl p-6 shadow-2xl sm:p-8',
            isAdmin && 'ring-1 ring-amber-500/20'
          )}
        >
          <motion.div layout className="mb-5 text-center">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </motion.div>
          <motion.div layout>{children}</motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
