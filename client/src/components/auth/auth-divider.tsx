import { motion } from 'framer-motion'

export function AuthDivider({ label = 'or continue with' }: { label?: string }) {
  return (
    <motion.div layout className="relative my-5 flex items-center gap-3">
      <motion.div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <motion.div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
    </motion.div>
  )
}
