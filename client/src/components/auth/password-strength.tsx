import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

function getStrength(password: string): { score: number; label: string } {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  return { score, label: labels[Math.max(0, score - 1)] ?? 'Weak' }
}

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  const { score, label } = getStrength(password)
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500']

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={cn('h-1 flex-1 rounded-full bg-muted', i < score && colors[score - 1])}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.05 }}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Password strength: {label}</p>
    </div>
  )
}
